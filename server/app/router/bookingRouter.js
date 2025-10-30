const express = require('express')
const route = express.Router();
const upload = require('../config/multerConfig')
const BookingControoler = require('../controllers/BookingController')
const Auth=require('../middleware/UserAuthCheck')
// Fixed debug middleware
route.use((req, res, next) => {
    next();
});

// Safe upload handler
const handleUpload = (req, res, next) => {
    // console.log('Starting file upload...');

    upload.single('bookingImage')(req, res, (err) => {
        if (err) {
            // console.log('pload error:', err.message);
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
route.post('/create/booking',Auth, handleUpload, BookingControoler.createBooking)
route.get('/get/booking',BookingControoler.getBooking)
route.post('/cancel/booking',Auth,BookingControoler.cancelBooking);

// Simple test route without upload
route.post('/test', (req, res) => {
    // console.log('🧪 Test route hit');
    res.json({
        success: true,
        message: 'Test route works!',
        body: req.body || 'No body received'
    });
});

// Test route with upload
route.post('/test-upload', handleUpload, (req, res) => {
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
module.exports = route