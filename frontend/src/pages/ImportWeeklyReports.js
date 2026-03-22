import React, { useState } from 'react';
import { importWeeklyReports, clearAllWeeklyReports } from '../api/weeklyReports';

const ImportWeeklyReports = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage({ type: '', text: '' });
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage({ type: 'error', text: 'Please select an Excel file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await importWeeklyReports(file);
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: response.data.message,
        });
        setResult(response.data.data);
        setFile(null);
        // Reset file input
        document.querySelector('input[type="file"]').value = '';
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Upload failed',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('WARNING: Delete ALL weekly reports? This cannot be undone.')) {
      return;
    }

    if (!window.confirm('Final confirmation: Delete all weekly reports?')) {
      return;
    }

    try {
      setUploading(true);
      const response = await clearAllWeeklyReports();
      if (response.data.success) {
        setMessage({
          type: 'success',
          text: response.data.message,
        });
        setResult(null);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Clear failed',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Import Weekly Reports</h1>
          <p className="page-subtitle">Upload student weekly report data from Excel file</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'} mb-6`}>
          {message.text}
        </div>
      )}

      <div className="section-card">
        <div className="section-card-body">
          <h2 className="text-lg font-semibold mb-4">Upload Weekly Reports Excel</h2>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="form-label">Select Excel File</label>
              <div className="flex gap-3 items-center">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="form-input flex-1"
                />
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="btn-primary disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Expected format: Columns for Student Name, UID, Email, Company, Branch, and weekly data
              </p>
            </div>

            {result && (
              <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">Import Summary</h3>
                <div className="space-y-1 text-sm text-blue-800">
                  <p>✓ Successfully imported: <strong>{result.imported}</strong> reports</p>
                  <p>⊘ Skipped: <strong>{result.skipped}</strong> records</p>
                  {result.errors && result.errors.length > 0 && (
                    <div className="mt-3 text-red-700">
                      <p className="font-semibold">Errors (first 10):</p>
                      <ul className="list-disc list-inside text-xs">
                        {result.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Danger Zone</h3>
            <button
              onClick={handleClearAll}
              disabled={uploading}
              className="btn-danger text-sm"
            >
              Delete All Weekly Reports
            </button>
          </div>
        </div>
      </div>

      <div className="section-card mt-6">
        <div className="section-card-body">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">File Format Guide</h3>
          <div className="text-xs text-gray-600 space-y-2">
            <p>Your Excel file should contain these columns:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Student Name</strong> - Full name of student</li>
              <li><strong>UID</strong> - Student ID/UID</li>
              <li><strong>Email Address</strong> - Student email</li>
              <li><strong>Internship-Company Name</strong> - Company name</li>
              <li><strong>Student Branch</strong> - Branch (Comps, DS, etc.)</li>
              <li><strong>(WEEK - 1 & 2) Exact Dates</strong> - Date range for weeks 1-2</li>
              <li><strong>Target Assigned (Project Brief)</strong> - Weeks 1-2 target</li>
              <li><strong>Your learning related to Target</strong> - Weeks 1-2 learning</li>
              <li><strong>Your Role or Contribution to the project.</strong> - Weeks 1-2 contribution</li>
              <li><em>...and repeat for (WEEK - 3 & 4), (WEEK - 5 & 6), (WEEK - 7 & 8), etc.</em></li>
            </ul>
            <p className="mt-3 italic">System will automatically detect all week pairs and add them dynamically as more data comes in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportWeeklyReports;
