const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
// const db = require('./config/db'); // Moved down

dotenv.config();

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Reflect origin back to the client to support credentials with wildcard-like behavior
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// Handle preflight for all routes explicitly
app.options('*', cors());

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Basic Route
app.get('/', (req, res) => {
    res.send('Nexor University API is running...');
});

// Health check route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Favicon route to prevent 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Import DB and Routes later to ensure CORS middleware is already active
const db = require('./config/db');
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
