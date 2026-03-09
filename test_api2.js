const http = require('http');
const fs = require('fs');
const req = http.request('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
        const token = JSON.parse(d).token;
        const r2 = http.request('http://localhost:5000/api/student/dashboard', {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        }, res2 => {
            let d2 = '';
            res2.on('data', c => d2 += c);
            res2.on('end', () => {
                fs.writeFileSync('api_error2.json', JSON.stringify(JSON.parse(d2), null, 2));
                console.log('Saved to api_error2.json');
            });
        });
        r2.end();
    });
});
req.write(JSON.stringify({ rollNumber: '23SP-001-CS', password: 'password123' }));
req.end();
