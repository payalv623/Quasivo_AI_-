const express = require("express");
const fs = require("fs");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const upload = multer();

// Create 'data' folder if not exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

//Existing route - Save JSON result
app.post("/save", (req, res) => {
  const data = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = `result-${timestamp}.json`;
  const filePath = path.join(dataDir, filename);

  fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error saving file:", err);
      return res.status(500).json({ message: "Failed to save." });
    }
    res.status(200).json({ message: "Saved successfully!", filename });
  });
});

// neww route for - Extract text from PDF
app.post("/extract-pdf", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfData = await pdfParse(req.file.buffer);
    res.json({ text: pdfData.text });
  } catch (error) {
    console.error("PDF upload error:", error);
    res.status(500).json({ error: "Failed to extract text from PDF" });
  }
});

// starting the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
