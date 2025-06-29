import React, { useState } from "react";
import { Mic } from "lucide-react";

const VoiceTextInput = ({ value, onChange, index }) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange(index, value + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="relative rounded-xl border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-green-500 mb-4">
      <div className="absolute left-2 top-2 flex items-center gap-2">
        <button
          onClick={handleVoiceInput}
          type="button"
          className="text-gray-600 hover:text-green-600 p-1"
          title="Click to speak"
        >
          <Mic size={20} />
        </button>
      </div>
      <textarea
        className="pl-15 pr-3 pt-2 pb-2 w-full h-32 resize-none border-none focus:outline-none rounded-xl"
        placeholder="Type here or click the mic to speak..."
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
      />{" "}
      {isListening && (
        <span className="text-sm text-green-600 animate-pulse">
          Listening...
        </span>
      )}
    </div>
  );
};

export default VoiceTextInput;
