# Nexor University: Student Portal

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/M-Affan01/Student-Portal/blob/main/LICENSE)
[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-black?logo=express)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-Aiven%20Cloud-4479A1?logo=mysql&logoColor=white)](https://aiven.io/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![Status](https://img.shields.io/badge/Status-Active-brightgreen.svg)]()

*A high-performance, enterprise-grade academic management system engineered for modern educational institutions, featuring stunning WebGL aesthetics and robust cloud-native architecture.*

---

## Project Overview

In a rapidly evolving digital landscape, academic portals often fail to provide a cohesive and engaging user experience. **Nexor University Elite Student Portal** bridges this gap by offering a centralized, data-driven platform where institutional assets (students) can manage their entire academic lifecycle. From initial enrollment and course selection to complex financial tracking and real-time performance analytics, Nexor ensures absolute synchronization between student activity and institutional records.

**Project Type:** Comprehensive Web Application / Academic Management System

---

## Enterprise Features

### Advanced Authentication & Security System
*   **Dual-Layer Verification:** Utilizes secure `Bcrypt` hashing for data-at-rest and stateless JWT (JSON Web Tokens) for data-in-transit.
*   **Encrypted Cloud Tunneling:** All communications between the Express.js backend and the Aiven Managed MySQL instance are strictly enforced via SSL/TLS.
*   **Role-Based UI:** Adaptive UI rendering based on secure student profiles.

### Dynamic Intelligence Dashboard (DID)
*   **Live CGPA Calculation:** Eliminates static record-keeping. The system performs complex weighted-average calculations on every page load.
*   **Attendance Health Monitoring:** A proprietary algorithm tracks presence ratios across all courses, providing a visual "Percentage Health" metric.
*   **Credit Velocity Tracker:** Visualizes total earned credits vs. degree requirements.
*   **Smart Notifications:** Real-time dynamic alerts for unpaid fees, registration deadlines, and schedule updates.

### Automated Financial Gateway (AFG)
*   **Registration-Injected Invoicing:** Automatically generates a corresponding financial record for every course registration.
*   **Transaction Lifecycle:** Track payments through Pending, Processing, and Cleared states with deep metadata.
*   **Institutional Transparency:** Full audit trail for every student financial obligation.

### Universal Master Timetable (UMT)
*   **100% Data Integrity:** A master registry maps every course ID to a specific building name, room number, weekday, and time slot.
*   **Zero-Conflict Logic:** The database is seeded with a non-overlapping global schedule across 5 major departments (CS, SE, AI, BA, SCI).
*   **Instant Sync:** Registration instantly updates the student's personal calendar without manual intervention.

---

## Technical Stack & Tools

*   **Frontend Magic:** Vanilla JavaScript, HTML5, Tailwind CSS
*   **Motion & 3D Graphics:** GSAP (GreenSock), Three.js (WebGL Particles)
*   **Backend Engineering:** Node.js, Express.js
*   **Database Management:** MySQL (Hosted on Aiven Cloud)
*   **Security & Authentication:** `jsonwebtoken` (JWT), `bcryptjs`, Secure HTTP Headers
*   **Environment Management:** `dotenv`

---

## Architecture & Design Summary

The system is built on a resilient Client-Server Architecture utilizing the **MVC (Model-View-Controller)** design pattern on the backend:
1.  **Client Tier:** A highly responsive, glassmorphism-inspired UI that communicates asynchronously via REST API fetch requests. Token-based authentication secures all routes.
2.  **App Server (Express):** Routes intercept requests, verify JWT signatures via custom middleware, and pass control to modular Controllers (`authController`, `courseController`, `studentController`).
3.  **Data Tier (MySQL):** The database is normalized to the 3rd Normal Form (3NF) to ensure maximum efficiency. Strict `ANSI_QUOTES` mode is enforced to guarantee enterprise-level SQL integrity. Waitlisted, Pending, and Cleared statuses dictate finite state machines for course and financial lifecycles.

---

## Quick Start & Installation

### Prerequisites
*   Node.js (v16 or higher)
*   Local MySQL Server OR an Aiven MySQL Cloud Account

### Setup Steps

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/M-Affan01/Student-Portal.git
    cd Student-Portal
    ```

2.  **Install Global Logic:**
    ```bash
    npm install
    ```

3.  **Environment Sync:** Create a `.env` in the root directory (ensure you never commit this file):
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=your_password
    DB_NAME=nexor_university
    JWT_SECRET=super_secret_institutional_key
    # DB_CA_PATH=./ca.pem # Uncomment and use if connecting to Aiven Cloud SSL
    ```

4.  **Database Seeding:**
    Import the extensive seed file into your MySQL instance:
    ```bash
    mysql -u root -p nexor_university < database/seed.sql
    ```

5.  **Production Execution:**
    ```bash
    npm run dev
    ```
    The server will boot up at `http://localhost:5000`.

---

## Usage Guide & Test Credentials

You can test the full functionality of the Elite Student Portal using the pre-seeded student accounts.

### Test Credentials
*   **Student 1:**
    *   **Roll Number:** `23SP-001-CS`
    *   **Password:** `password123`
*   **Student 2:**
    *   **Roll Number:** `23SP-002-CS`
    *   **Password:** `password123`

### Workflow Example:
1.  Navigate to the stunning 3D Login Page.
2.  Input the test credentials provided above.
3.  Observe the **Dashboard** loading live CGPA and financial stats.
4.  Navigate to **Academics > Courses** to register for new electives or core subjects.
5.  Check the **Timetable** module instantly updating with your new schedule.
6.  Visit **Finance > Fees** to see the system automatically generate a pending invoice for the registered course credits.

---

## Project Structure Tree

```text
├── backend/
│   ├── config/          # SSL Certification & DB Connection Pools
│   ├── controllers/     # Core Business Logic (Auth, Stats, Fees, Courses)
│   ├── middleware/      # Security Guards (JWT Token Verification)
│   ├── routes/          # Express Router Definitions
│   └── server.js        # Main API Entry Point
├── frontend/
│   ├── css/             # Glassmorphism & Motion Utility Tokens
│   ├── js/              # API Integration, Routing & Three.js Engines
│   ├── login.html       # 3D Powered Entry Portal
│   ├── register.html    # Admission & Course Provisioning
│   ├── dashboard.html   # Real-time Analytics Hub
│   ├── courses.html     # Academic Catalog Resource (Add/Drop)
│   ├── fees.html        # Financial Gateway UI
│   ├── history.html     # Academic Transcript Record
│   └── timetable.html   # Schedule Synchronization View
├── database/
│   ├── schema.sql       # Optimized Institutional Schema (3NF)
│   └── seed.sql         # 50+ item Course/Timetable Master Seed
├── .gitignore           # Security Exclusions (.env, ca.pem)
└── package.json         # Node Dependencies & Scripts
```

---

## Performance & Optimization

*   **Response Latency:** Sub 50ms for authenticated requests due to efficient JWT un-signing and SQL indexing.
*   **Database Speed:** Optimized indexing on `student_id` and `course_id` alongside memory-efficient JOIN operations. ANSI compliance enforced.
*   **Visual Performance:** The Three.js WebGL engine is highly optimized to run at a constant 60 FPS on mid-range hardware without hogging GPU resources.

---

## Future Plans

*   **AI Timetable Negotiator:** Implement an AI module that suggests the optimal schedule to minimize gaps between classes.
*   **Professor Portal Integration:** Allow instructors to natively upload grades directly directly syncing with the `academic_history` tables.
*   **Mobile App Native Bridge:** Convert the responsive Tailwind Web UI into an exported React Native application context.

---

## License & Compliance

This project is licensed under the **MIT License**. It is designed for institutional scaling and can be adapted, modified, and utilized freely for educational and commercial purposes.

---

## Contact Information
*   **Email:** maffan2830@gmail.com
*   **GitHub:** [@M-Affan01](https://github.com/M-Affan01)
*   **Linkdin:** [Affan Nexor](https://www.linkedin.com/in/affan-nexor-66abb8321/)

<div align="center">
  <br/>
  <i>“Excellence in Academic Management through Cutting-Edge Engineering.”</i>
</div>
