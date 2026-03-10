# Nexor University Student Portal

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/M-Affan01/Student-Portal?style=for-the-badge&logo=github&color=6366f1)](https://github.com/M-Affan01/Student-Portal)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel)](https://nexor-portal.vercel.app)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18.18.2-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Production--Ready-success?style=for-the-badge)](https://nexor-portal.vercel.app)

> **Nexor University Student Portal** is an enterprise-grade, high-performance Academic Management System (AMS). 
> It provides a unified, secure, and visually stunning interface for students to manage their entire academic lifecycle—from registration to graduation. 

---

## Project Overview
The **Nexor University Student Portal** is a mission-critical digital ecosystem designed for higher education institutions. It bridges the gap between administrative data and student accessibility by providing real-time analytics, automated financial tracking, and intuitive course management.

### Academic & Real-World Context
In a real-world university setting, data fragmentation is the biggest hurdle. This project solves this by centralizing **Identity (Auth)**, **Academics (Grades/Courses)**, and **Finances (Fees)** into a single, stateless, cloud-native application. It's built to handle high-concurrency scenarios like course registration weeks and result announcements with sub-second response times.

---

## Detailed Feature Breakdown

### Core Academic System
- **Intelligent Dashboard**: Real-time KPI cards for CGPA, Active Credits, Current Semester, and Attendance (Visualized via Chart.js).
- **Transcript Engine**: A recursive semester-wise academic history that calculates GPA per semester with grade point tracking.
- **Dynamic Timetable**: A weekly schedule engine that automatically populates based on active course registrations including room numbers.
- **Smart Enrollment**: A validation-heavy registration workflow that prevents over-enrollment and prerequisite violations in real-time.

### Financial Management & Reporting
- **Smart Fee Desk**: Automatic calculation of dues based on credit hours and lab requirements.
- **Payment Lifecycle**: Secure transitions from `Pending` → `Paid` with a simulated yet secure transaction gateway.
- **Financial Reporting**: Generation of digital receipts with unique `Transaction IDs` saved across ledgers for administrative reconciliation.

### UX & Advanced Features
- **Glassmorphism Design**: A premium UI built with Tailwind CSS, featuring subtle blur effects and a "Floating" aesthetic.
- **Dark Mode Engine**: Persistent, CSS-variable based system with zero-flash on page load (stored in `localStorage`).
- **Base64 Cloud Images**: Edge-optimized profile picture uploads that store images as Base64 strings, bypassing serverless filesystem limits.
- **Micro-Animations**: Industrial-grade animations using **GSAP** and interactive 3D perspective effects with **Vanilla-Tilt**.

---

## Technical Stack & Tools

### Languages & Frameworks
- **Backend**: Node.js (v18.x LTS) & Express.js (v4.18)
- **Frontend**: Vanilla ES6+ JavaScript & Tailwind CSS (v3.0)
- **Database**: MySQL 8.0 (Relational Storage)

### Libraries & Versions
- **Auth**: `jsonwebtoken` (v9.0) for auth, `bcryptjs` (v2.4) for hashing.
- **Storage**: `multer` (v2.0) with `MemoryStorage` (Vercel Optimized).
- **Visuals**: `GSAP` (v3.12), `Chart.js` (v4.0), `Vanilla-Tilt` (v1.7), `SweetAlert2` (v11).

---

## Quick Start & Installation

### 1. Repository Setup
```bash
git clone https://github.com/M-Affan01/Student-Portal.git
cd Student-Portal/1/1
npm install
```

### 2. Environment Setup
Create a `.env` file in the root:
```env
DB_HOST=your-hostname
DB_PORT=your-port
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=defaultdb
DB_CA_PATH=./ca.pem
JWT_SECRET=your-secret-key
```

### 3. Initialize Database
Execute `database/schema.sql` on your MySQL instance.

---

## Development Setup

To run the project in development mode with hot-reloading:
```bash
# Start backend-only seeder (optional)
npm run seed

# Run the dev server
npm run dev
```
The application will be available at `http://localhost:5000`.

---

## 📖 Usage Guide & Examples

### Academic Credentials (Demo)
- **Roll Number**: `23SP-001-CS`
- **Password**: `password123`

### Interaction Examples
1. **Login**: Visit `login.html`. Success creates a JWT in `sessionStorage`.
2. **Upload Profile**: Go to `profile.html` → Click the Avatar → Choose a `.jpg`/`.png`.
   *   *Result:* Backend converts image to Base64 and updates `students` table.
3. **Pay Fees**: Navigate to `fees.html` → Click "Pay Now" on any entry.
   *   *Result:* Status updates to `Paid` and a `Transaction ID` is logged.

---

## Project Structure Tree

```text
.
├── backend/
│   ├── config/         # DB Connection & SSL Setup
│   ├── controllers/    # Business logic (auth, student, academic)
│   ├── middleware/     # Auth & Error handling
│   ├── routes/         # Express endpoint definitions
│   └── utils/          # Hashing and seeding scripts
├── frontend/
│   ├── js/             # Framework-less client logic
│   ├── css/            # UI tokens and custom animations
│   └── *.html          # Semantic HTML5 views
├── database/           # MySQL Schema & Migrations
├── vercel.json         # Serverless deployment config
└── server.js           # Server entry point
```

---

## Performance & Optimization
- **Payload Sanitization**: API responses are stripped of sensitive data before being sent.
- **Edge Assets**: Static UI is served via Vercel Edge for sub-100ms Worldwide latency.
- **In-Memory Uploads**: Zero-I/O image processing ensures standard serverless functions don't timeout.
- **Pool Scaling**: Database pooling scales to 20 concurrent connections.

---

## Future Plans
- **Native Mobile App**: React Native port for iOS/Android.
- **AI Advisor**: Machine learning based course recommendations.
- **Live Chat**: Socket.io powered student-support desk.

---

## License
### **MIT License**
Copyright (c) 2026 Nexor University Team

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. This allows for full commercial and private use with credit.

---

## Contact Info
- **Developer**: Muhammad Affan
- **Linkdin**: [Affan Nexor](https://www.linkedin.com/in/affan-nexor-66abb8321/)
- **GitHub**: [@M-Affan01](https://github.com/M-Affan01)

---
*Created with ❤️ for Nexor University Academic Excellence.*
