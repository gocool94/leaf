const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = 5000;

// Set up multer to handle file uploads
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  const uploadedFile = req.file.path;

  // Path where the output should be placed
  const outputFilePath = path.join(__dirname, "src", "kpi_output.json");

  // Command to run your Python script
  const command = `python your_script.py ${uploadedFile} ${outputFilePath}`;

  // Run the Python script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).json({ success: false, error: error.message });
    }

    if (stderr) {
      console.error(`Script error: ${stderr}`);
      return res.status(500).json({ success: false, error: stderr });
    }

    console.log(`Script output: ${stdout}`);
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
