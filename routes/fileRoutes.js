const express = require('express');
const router = express.Router();
const {uploadFile,saveFile,downloadFile,deleteFile,} = require('../controllers/fileController');
const {authMiddleware} = require('../middleware/authMiddleware');

router.post('/upload', authMiddleware,uploadFile,saveFile);
router.get('/download/:code',downloadFile);
router.delete('/delete/:code', authMiddleware,deleteFile);

module.exports = router;
