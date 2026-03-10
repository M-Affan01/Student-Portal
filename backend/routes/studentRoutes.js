const express = require('express');
const router = express.Router();
const { getDashboardStats, getAcademicHistory, getFees, getTimetable, payFee, updateProfile, updatePassword, uploadProfilePic } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config - Memory storage (works on Vercel serverless)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) cb(null, true);
        else cb(new Error('Only image files are allowed'));
    }
});

router.get('/dashboard', protect, getDashboardStats);
router.get('/history', protect, getAcademicHistory);
router.get('/fees', protect, getFees);
router.post('/pay-fee', protect, payFee);
router.get('/timetable', protect, getTimetable);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, updatePassword);
router.post('/profile/upload', protect, upload.single('profilePic'), uploadProfilePic);

module.exports = router;
