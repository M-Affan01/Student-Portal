const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./config/db');

const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Allow all for now to debug
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('Nexor University API is running...');
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/courses', courseRoutes);



if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
