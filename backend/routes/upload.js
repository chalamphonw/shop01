const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const path = require('path');

// POST single or multiple files
router.post('/', authMiddleware, upload.array('files', 4), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const fileUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.json({
      message: 'Files uploaded successfully',
      urls: fileUrls
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

module.exports = router;
