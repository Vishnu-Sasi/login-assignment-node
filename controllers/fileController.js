const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const File = require('../models/File');

// File Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads');
  },
  filename: (req, file, cb) => {
    const code = uuidv4().substr(0, 6);
    cb(null, `${code}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const uploadFile = upload.single('file');

const saveFile = async (req, res) => {
  try {
    const { filename } = req.file;
    const { userId } = req;

    // Create a new file entry
    const file = new File({
      originalFilename: req.file.originalname,
      code: filename.substr(0, 6),
      owner: userId,
    });
    await file.save();

    res.status(201).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Failed to save file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// File Download
const downloadFile = async (req, res) => {
  try {
    const { code } = req.params;

    // Find the file by code
    const file = await File.findOne({ code });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = `./public/uploads/${file.code}-${file.originalFilename}`;

    // Stream the file for download
    res.download(filePath, file.originalFilename);
  } catch (error) {
    console.error('Failed to download file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// File Deletion
const deleteFile = async (req, res) => {
  try {
    const { code } = req.params;

    // Find the file by code
    const file = await File.findOne({ code });
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = `./public/uploads/${file.code}-${file.originalFilename}`;

    // Delete the file from the file system
    fs.unlinkSync(filePath);

    // Delete the file entry from the database
    await file.remove();

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Failed to delete file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports={
  deleteFile,
  uploadFile,
  saveFile,
  downloadFile
}