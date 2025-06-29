import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/webpack";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import { Mic, Upload } from "lucide-react";

const SmartInput = ({ label, value, onChange }) => {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [fileName, setFileName] = useState("");

  const [transcriptHistory, setTranscriptHistory] = useState(value || "");

  // Voice Input Handler
  const handleSpeechToText = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Speech recognition not supported");

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-Indian";
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;

        setTranscriptHistory((prev) => {
          const updatedText = prev + " " + transcript;
          onChange(updatedText); // Update parent too
          return updatedText;
        });
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }

    setIsListening(true);
    recognitionRef.current.start();
  };

  // PDF Upload
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") return;

    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/extract-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("PDF upload failed");
      }

      const data = await response.json();

      const cleanText = data.text.trim();

      // replace existing text with extracted text
      onChange(cleanText);
    } catch (err) {
      console.error("PDF upload error:", err);
      alert("Failed to extract text from PDF.");
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-2xl font-bold mb-1 text-gray-700">
        {label}
      </label>

      <div className="relative rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
        <textarea
          className="w-full p-3 pl-12 pr-4 h-20 resize-none border-none focus:outline-none rounded-xl"
          placeholder="Type, speak, or upload PDF..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />

        <button
          onClick={handleSpeechToText}
          type="button"
          className="absolute top-3 left-3 text-gray-500 hover:text-green-600"
          title="Voice Input"
        >
          <Mic size={20} />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-4">
        <label className="flex items-center gap-2 text-blue-600 cursor-pointer hover:underline">
          <Upload size={16} />
          Upload PDF
          <input
            type="file"
            accept="application/pdf"
            onChange={handlePDFUpload}
            className="hidden"
          />
        </label>
        {fileName && (
          <span className="text-sm text-gray-500 truncate max-w-xs">
            📄 {fileName}
          </span>
        )}
        {isListening && (
          <span className="text-sm text-green-600 animate-pulse">
            🎤 Listening....
          </span>
        )}
      </div>
    </div>
  );
};

export default SmartInput;
