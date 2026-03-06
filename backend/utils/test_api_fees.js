const axios = require('axios');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const test = async () => {
    try {
        // Generate a valid token for student 1
        const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Fetching fees for Student ID 1...");
        const res = await axios.get('http://localhost:5000/api/student/fees', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log("Response Status:", res.status);
        console.log("Data:", JSON.stringify(res.data, null, 2));

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
};

test();
