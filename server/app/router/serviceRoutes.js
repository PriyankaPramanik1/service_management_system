const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');
const { createService,getServices,getServiceById,renderServiceList} = require('../controllers/ServiceController');

// Fixed debug middleware
router.use((req, res, next) => {
  next();
});

// Safe upload handler
const handleUpload = (req, res, next) => {
  // console.log('🔄 Starting file upload...');
  
  upload.single('serviceImage')(req, res, (err) => {
    if (err) {
      // console.log('❌ Upload error:', err.message);
      return res.status(400).json({
        success: false,
        message: `Upload failed: ${err.message}`
      });
    }
    console.log('✅ Upload successful');
    next();
  });
};

// Your main route
router.post('/create/service', handleUpload, createService);
router.get('/get/service',getServices)
router.get('/get/singleService/:id',getServiceById)
router.get('/get/serviceList',renderServiceList)
// Simple test route without upload
router.post('/test', (req, res) => {
  // console.log('🧪 Test route hit');
  res.json({
    success: true,
    message: 'Test route works!',
    body: req.body || 'No body received'
  });
});

// Test route with upload
router.post('/test-upload', handleUpload, (req, res) => {
  // console.log('🧪 Upload test route hit');
  res.json({
    success: true,
    message: 'Upload test successful!',
    file: req.file ? {
      filename: req.file.originalname,
      url: req.file.path,
      size: req.file.size
    } : 'No file received',
    body: req.body || {}
  });
});

module.exports = router;