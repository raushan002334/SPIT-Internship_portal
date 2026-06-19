# SPIT Internship Management & Analytics Portal

> **Currently in use by SPIT for the batch of 2026 passing students**
> 
> **Project created under the guidance of Prof. Vandana Wekhande, SPIT Senior Faculty**

---

## Overview

An intelligent, automated internship evaluation and management platform that revolutionizes how institutions evaluate final-year students pursuing internships. This portal transforms the traditionally manual and time-intensive evaluation process into a seamless, efficient workflow—enabling colleges to evaluate 400+ students in minutes while maintaining rigorous evaluation standards.

### The Problem We Solved

**Legacy Evaluation Process (Manual & Time-Intensive):**
- Weekly progress tracking through manual reports
- Complex group formation process for batching 400+ students
- Dual evaluation requirement: Internal mentors + External mentors (alumni)
- Manual assignment of mentors to student groups
- Individual email communications to each group
- Manual collection of evaluation marks from multiple sources
- Time-consuming report generation

**Our Solution:**
This platform automates the entire evaluation lifecycle—from intelligent group generation to automated mentor assignment, email distribution, centralized evaluation scoring, and instant report generation—all achievable in minutes with zero manual intervention.

## Key Features

- 📊 **Automated Group Generation**: Intelligently create student evaluation groups with customizable filters
- 📧 **One-Click Communication**: Generate and send evaluation emails to all mentor-student groups simultaneously
- ⭐ **Integrated Evaluation System**: Centralized evaluation interface for internal and external mentors
- 📈 **Automated Scoring & Reporting**: Calculate final marks and generate comprehensive reports instantly
- 📝 **Internship Management**: List, filter, and manage all internship records
- 📤 **Excel Import/Export**: Upload Excel files to import data and export results
- 📊 **Dashboard Analytics**: View summary cards and charts for internships, companies, and students
- 🔍 **Advanced Filtering**: Filter by branch, company, status, mentor, year, and more

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- XLSX (Excel processing)
- Multer (File uploads)
- Nodemailer (Email automation)

### Frontend
- React.js
- TailwindCSS
- Recharts (Data visualization)
- Axios (API calls)

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd Internship_portal
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory:
```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/spit-internships
NODE_ENV=development
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Run the application:
```bash
# Run both backend and frontend concurrently
npm run dev

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

7. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Contributors

- **Raushan Kumar** - [@raushan002334](https://github.com/raushan002334)
- **Soham** - [@Soham-dotcom](https://github.com/Soham-dotcom)

## Contributing

This is an internal project for SPIT. For any issues or suggestions, please contact the development team.

## License

ISC
