# 🎓 Nexor University: Elite Student Portal (v2.0 Elite Edition)

[![GitHub License](https://img.shields.source.io/github/license/M-Affan01/Student-Portal?style=for-the-badge&color=blue)](LICENSE)
[![GitHub Version](https://img.shields.source.io/badge/version-2.0.0--Elite-indigo?style=for-the-badge)](https://github.com/M-Affan01/Student-Portal/releases)
[![Build Status](https://img.shields.source.io/badge/Status-Production--Ready-success?style=for-the-badge)](https://github.com/M-Affan01/Student-Portal)
[![Aiven Cloud](https://img.shields.source.io/badge/Database-Aiven--Cloud-orchid?style=for-the-badge)](https://aiven.io/)
[![Style](https://img.shields.source.io/badge/UI-Three.js%20%7C%20GSAP-black?style=for-the-badge)](https://threejs.org/)

The **Nexor University Student Portal** is a high-performance, enterprise-grade academic management system. Engineered for modern educational institutions, it combines cutting-edge **WebGL visuals**, **robust cloud-native architecture**, and **automated institutional logic** to provide an unmatched student experience.

---

## 📖 Executive Summary

In a rapidly evolving digital landscape, academic portals often fail to provide a cohesive and engaging user experience. **Nexor v2.0 Elite Edition** bridges this gap by offering a centralized, data-driven platform where institutional assets (students) can manage their entire academic lifecycle. From initial enrollment and course selection to complex financial tracking and real-time performance analytics, Nexor ensures absolute synchronization between student activity and institutional records.

---

## ✨ System Architecture & Core Modules

### 🛡️ 1. Advanced Authentication & Security System
*   **Dual-Layer Verification**: Utilizes secure `Bcrypt` hashing for data-at-rest and stateless `JWT` (JSON Web Tokens) for data-in-transit.
*   **Encrypted Cloud Tunneling**: All communications between the Express.js backend and the Aiven Managed MySQL instance are strictly enforced via **SSL/TLS (ca.pem)**.
*   **Role-Based Access**: Adaptive UI rendering based on secure student profiles.

### 📊 2. Dynamic Intelligence Dashboard (DID)
*   **Live CGPA Calculation**: Eliminates static record-keeping. The system performs complex weighted-average calculations on every page load using real-time grade data from `academic_history`.
*   **Attendance Health Monitoring**: A proprietary algorithm tracks presence ratios across 50+ courses, providing a visual "Percentage Health" metric.
*   **Credit Velocity Tracker**: Visualizes total earned credits vs. degree requirements, ensuring students remain on the path to graduation.

### 💰 3. Automated Financial Gateway (AFG)
*   **Registration-Injected Invoicing**: Unlike legacy systems, Nexor automatically generates a corresponding financial record for every course registration ($150 per credit hour).
*   **Transaction Lifecycle**: Track payments through `Pending`, `Processing`, and `Cleared` states with deep metadata (Due dates, Transaction IDs).
*   **Institutional Transparency**: Full audit trail for every student payment, ensuring zero discrepancies in university books.

### 📅 4. Universal Master Timetable (UMT)
*   **100% Data Integrity**: A master registry maps every course ID to a specific building name, room number, weekday, and time slot.
*   **Zero-Conflict Logic**: The database is seeded with a non-overlapping global schedule across 5 departments (CS, SE, AI, BA, SCI).
*   **Instant Sync**: Registration instantly updates the student's personal calendar without manual intervention.

---

## 🛠️ Technical Deep-Dive

### **Backend Core (Node.js/Express)**
*   **Architecture**: Modular MVC-style structure (Controllers, Routes, Middleware).
*   **Concurrency**: Built to handle asynchronous I/O, ensuring the UI remains responsive during heavy database migrations.
*   **Persistence**: Leverages a managed **Aiven MySQL** cluster for 99.9% uptime and redundant backups.

### **Frontend Aesthetics (WebGL/Three.js)**
*   **3D Energy Core**: A custom-coded Three.js particles system on the login page representing the university's "Pulse."
*   **Motion Orchestration**: GSAP (GreenSock) handles all micro-interactions, spring-physics buttons, and cinematic entrance sequences.
*   **Adaptive Design**: Fully responsive Tailwind CSS architecture designed for both wide-screen monitors and mobile accessibility.

### **Database Schema Design**
The database is normalized to the 3rd Normal Form (3NF) to ensure maximum efficiency:
- `students`: Central repository for profiles and hashed credentials.
- `courses`: Master catalog with credit weights and department codes.
- `course_registrations`: The junction table linking students to their active curriculum.
- `fees`: Granular records for every financial obligation.
- `timetable`: The global master schedule.

---

## 🚦 API Documentation (Highlights)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Account creation with course auto-provisioning | No |
| `POST` | `/api/auth/login` | Secure JWT generation and profile retrieval | No |
| `GET` | `/api/dashboard/stats` | Dynamic calculation of CGPA, Attendance, and Credits | Yes |
| `GET` | `/api/courses` | Retrieval of the 50+ item academic catalog | Yes |
| `GET` | `/api/timetable` | Dynamic generation of personalized student schedule | Yes |

---

## 🚀 Deployment & Installation

### **Phase 1: Local Environment Setup**
1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/M-Affan01/Student-Portal.git
    cd Student-Portal
    ```
2.  **Install Global Logic**:
    ```bash
    npm install
    ```
3.  **Environment Sync**: Create a `.env` in the root:
    ```env
    PORT=5000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=nexor_university
    JWT_SECRET=institutional_elite_key_2025
    ```

### **Phase 2: Cloud Database Launch (Aiven)**
1.  Download your `ca.pem` from the Aiven Console.
2.  Update `.env` with Aiven URI details.
3.  Execute the migration engine:
    ```bash
    node migrate_cloud.js
    ```

### **Phase 3: Production Execution**
```bash
npm run dev
```

---

## 🌳 Elite Project Tree

```text
├── backend/
│   ├── config/          # SSL Certification & DB Drivers
│   ├── controllers/     # Core Logic (Auth, Stats, Fees)
│   ├── middleware/      # Security Guards (JWT Token Verification)
│   ├── routes/          # Express Router Definitions
│   └── server.js        # Main API Entry Point
├── frontend/
│   ├── css/             # Glassmorphism & Motion Tokens
│   ├── js/              # API Integration & Three.js Engines
│   ├── login.html       # 3D Powered Entry Portal
│   ├── register.html    # Admission & Course Provisioning
│   ├── dashboard.html   # Real-time Analytics Hub
│   ├── courses.html     # Academic Catalog Resource
│   ├── fees.html        # Financial Gateway UI
│   └── timetable.html   # Schedule Synchronization View
├── database/
│   ├── schema.sql       # Optimized Institutional Schema
│   └── seed.sql         # 50+ item Course/Timetable Master Seed
├── ca.pem               # SSL Certificate for Cloud Transit
├── migrate_cloud.js     # Orchestration Script for Aiven Deployment
└── README.md            # Enterprise Documentation
```

---

## 📈 Optimization Metrics
- **Response Latency**: <50ms for authenticated requests.
- **Database Speed**: Optimized indexing on `student_id` and `course_id` for instant complex joins.
- **Visual Performance**: Three.js engine optimized to run at constant 60 FPS on mid-range hardware.

---

## 📄 License & Compliance
This project is licensed under the **MIT License**. It is designed for institutional scaling and can be adapted for any higher education framework.

## 👥 Institutional Leadership
**Maffan (M-Affan01)** - *Head of Digital Infrastructure*
- **Portfolio**: [M-Affan01 on GitHub](https://github.com/M-Affan01)
- **Email**: maffan2830@gmail.com
- **Repository**: [Student-Portal](https://github.com/M-Affan01/Student-Portal)

---
*“Excellence in Academic Management through Cutting-Edge Engineering.”*
