import api from './axios';

// Import weekly reports from Excel
export const importWeeklyReports = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/weekly-reports/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get all weekly reports with optional filters
export const getWeeklyReports = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.company) params.append('company', filters.company);
  if (filters.branch) params.append('branch', filters.branch);
  return api.get('/weekly-reports', { params });
};

// Get single student's weekly report
export const getWeeklyReportByUID = (uid) => {
  return api.get(`/weekly-reports/${uid}`);
};

// Get unique companies for filtering
export const getCompaniesForFilter = () => {
  return api.get('/weekly-reports/filter/companies');
};

// Get unique branches for filtering
export const getBranchesForFilter = () => {
  return api.get('/weekly-reports/filter/branches');
};

// Clear all weekly reports
export const clearAllWeeklyReports = () => {
  return api.delete('/weekly-reports/clear-all');
};
