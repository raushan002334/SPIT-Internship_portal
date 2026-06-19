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
- ⭐ **Integrated Evaluation System**: Centralized evaluation interface for internal and external mentors based on predefined rubrics
- 📈 **Automated Scoring & Reporting**: Calculate final marks according to evaluation rubrics and generate comprehensive reports instantly
- 📝 **Internship Management**: List, filter, and manage all internship records
- 📤 **Excel Import/Export**: Upload Excel files to import data and export results with reports
- 📊 **Dashboard Analytics**: View summary cards and charts for internships, companies, branches, and students
- 🔍 **Advanced Filtering**: Filter by branch, company, status, mentor, year, and more
- 📈 **Company Analytics**: Analyze hiring patterns, branch distribution, and stipend data

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

## API Endpoints

### Internships
- `GET /api/internships` - Get all internships with filters
- `GET /api/internships/:id` - Get single internship
- `POST /api/internships` - Create new internship
- `PUT /api/internships/:id` - Update internship
- `DELETE /api/internships/:id` - Delete internship
- `GET /api/internships/stats/summary` - Get summary statistics

### Upload
- `POST /api/upload/excel` - Parse Excel file
- `POST /api/upload/import` - Import parsed data to MongoDB
- `GET /api/upload/template` - Download Excel template

### Analytics
- `GET /api/analytics/companies` - Company-wise statistics
- `GET /api/analytics/branches` - Branch distribution
- `GET /api/analytics/status` - Status distribution
- `GET /api/analytics/companies/branches` - Branch distribution per company
- `GET /api/analytics/stipends` - Stipend comparison
- `GET /api/analytics/types` - Internship type distribution
- `GET /api/analytics/summary` - Comprehensive summary

### Groups
- `POST /api/groups/generate` - Generate student groups
- `POST /api/groups/export` - Export groups to Excel
- `POST /api/groups/random-pick` - Pick random students
- `POST /api/groups/export-random` - Export random students to Excel

### Evaluation
- `POST /api/evaluation/send-mails` - Send evaluation emails to groups
- `POST /api/evaluation/submit` - Submit evaluation marks
- `GET /api/evaluation/report` - Generate evaluation report

## Data Model

The system uses the following data structure for internships:

```javascript
{
  student: {
    name: String,
    email: String,
    phone: String,
    rollNo: String,
    branch: String (comps|extc|cse|mca|aiml),
    year: String,
    avatar: String (optional)
  },
  company: {
    name: String,
    location: String,
    website: String
  },
  internship: {
    title: String,
    type: String,
    duration: String,
    startDate: Date,
    endDate: Date,
    stipend: String,
    status: String (pending|approved|in-progress|completed|cancelled)
  },
  mentor: {
    name: String,
    email: String,
    designation: String,
    type: String (internal|external)
  },
  evaluation: {
    internalMentorRating: Number (0-5),
    externalMentorRating: Number (0-5),
    finalMarks: Number,
    feedback: String,
    skills: [String]
  },
  submittedAt: Date
}
```

## Excel Template

Download the Excel template from the Upload page to see the required format for importing data. The template includes all necessary columns with sample data.

## Contributing

This is an internal project for SPIT. For any issues or suggestions, please contact the development team.

## License

ISC
