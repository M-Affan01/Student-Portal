const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000/api'
    : 'https://student-portal-backend-sigma.vercel.app/api'; // Temporary placeholder, user will update if needed

const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:5000'
    : 'https://student-portal-backend-sigma.vercel.app';
