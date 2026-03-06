const express = require('express');
const router = express.Router();
const { getDashboardStats, getAcademicHistory, getFees, getTimetable, payFee, updateProfile, updatePassword, uploadProfilePic } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/profile_pics'),
    filename: (req, file, cb) => cb(null, `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/dashboard', protect, getDashboardStats);
router.get('/history', protect, getAcademicHistory);
router.get('/fees', protect, getFees);
router.post('/pay-fee', protect, payFee);
router.get('/timetable', protect, getTimetable);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, updatePassword);
router.post('/profile/upload', protect, upload.single('profilePic'), uploadProfilePic);

module.exports = router;
