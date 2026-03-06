const express = require('express');
const router = express.Router();
const { getCourses, registerCourse, dropCourse, getMyCourses } = require('../controllers/courseController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getCourses);
router.post('/register', protect, registerCourse);
router.delete('/:id', protect, dropCourse);
router.get('/my-courses', protect, getMyCourses);

module.exports = router;
