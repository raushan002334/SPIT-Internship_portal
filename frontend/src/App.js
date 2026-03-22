import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import InternshipList from './pages/InternshipList';
import ExcelUpload from './pages/ExcelUpload';
import GroupGenerator from './pages/GroupGenerator';
import StudentPicker from './pages/StudentPicker';
import CompanyAnalytics from './pages/CompanyAnalytics';
import MentorEdit from './pages/MentorEdit';
import AllGroups from './pages/AllGroups';
import AllMentors from './pages/AllMentors';
import WeeklyReports from './pages/WeeklyReports';
import ImportWeeklyReports from './pages/ImportWeeklyReports';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/internships" element={<InternshipList />} />
                    <Route path="/upload" element={<ExcelUpload />} />
                    <Route path="/groups" element={<GroupGenerator />} />
                    <Route path="/all-groups" element={<AllGroups />} />
                    <Route path="/all-mentors" element={<AllMentors />} />
                    <Route path="/picker" element={<StudentPicker />} />
                    <Route path="/analytics" element={<CompanyAnalytics />} />
                    <Route path="/mentor-edit" element={<MentorEdit />} />
                    <Route path="/weekly-reports" element={<WeeklyReports />} />
                    <Route path="/import-weekly-reports" element={<ImportWeeklyReports />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
