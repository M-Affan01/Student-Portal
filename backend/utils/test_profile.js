const jwt = require('jsonwebtoken');
require('dotenv').config();

const API_URL = 'http://localhost:5000/api';
const STUDENT_ID = 1;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_this_in_production';

const token = jwt.sign({ id: STUDENT_ID }, JWT_SECRET, { expiresIn: '1h' });

async function testProfileUpdate() {
    try {
        console.log("Testing Profile Update...");
        const res = await fetch(`${API_URL}/student/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                fullName: "Test User Updated",
                email: "test_dev@nexor.edu",
                phone: "123-456-7890"
            })
        });

        const data = await res.json();
        console.log("Status:", res.status);
        console.log("Response:", data);
    } catch (err) {
        console.error("Fetch Error:", err.message);
    }
}

testProfileUpdate();
