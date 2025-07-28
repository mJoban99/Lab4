const express = require('express');
const multer = require('multer');
const File = require('../models/File');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// POST file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const newFile = new File({
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
    });
    await newFile.save();
    res.json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    res.status(500).json({ error: 'File upload failed' });
  }
});

// GET all files
router.get('/files', async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch files' });
  }
});

module.exports = router;
