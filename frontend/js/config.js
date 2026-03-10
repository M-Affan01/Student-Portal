console.log("✅ config.js loaded successfully");

var API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://student-portal-alpha-seven.vercel.app/api';

var BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://student-portal-alpha-seven.vercel.app';

// Ensure they are truly global
window.API_URL = API_URL;
window.BASE_URL = BASE_URL;

