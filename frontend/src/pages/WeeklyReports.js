import React, { useState, useEffect } from 'react';
import { getWeeklyReports, getCompaniesForFilter, getBranchesForFilter } from '../api/weeklyReports';

const WeeklyReports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [companies, setCompanies] = useState([]);
  const [branches, setBranches] = useState([]);

  // UI states
  const [expandedReports, setExpandedReports] = useState(new Set());

  useEffect(() => {
    fetchReports();
    fetchFilterOptions();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getWeeklyReports();
      if (response.data.success) {
        setReports(response.data.data);
        setFilteredReports(response.data.data);
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to load weekly reports',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterOptions = async () => {
    try {
      const [compRes, branchRes] = await Promise.all([
        getCompaniesForFilter(),
        getBranchesForFilter(),
      ]);
      if (compRes.data.success) setCompanies(compRes.data.data);
      if (branchRes.data.success) setBranches(branchRes.data.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  // Apply filters
  useEffect(() => {
    let filtered = reports;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(q) ||
          r.studentUID.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q)
      );
    }

    if (selectedCompany) {
      filtered = filtered.filter((r) => r.company === selectedCompany);
    }

    if (selectedBranch) {
      filtered = filtered.filter((r) => r.branch === selectedBranch);
    }

    setFilteredReports(filtered);
  }, [searchQuery, selectedCompany, selectedBranch, reports]);

  const toggleExpand = (reportId) => {
    const newExpanded = new Set(expandedReports);
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId);
    } else {
      newExpanded.add(reportId);
    }
    setExpandedReports(newExpanded);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-500">Loading weekly reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Weekly Reports</h1>
          <p className="page-subtitle">View student weekly work progress and learning outcomes</p>
        </div>
        <button onClick={fetchReports} className="btn-secondary">
          Refresh
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type === 'success' ? 'success' : 'error'} mb-6`}>
          {message.text}
        </div>
      )}

      {/* Filters */}
      <div className="section-card mb-6">
        <div className="section-card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Search Student</label>
              <input
                type="text"
                placeholder="Name, UID, or Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Filter by Company</label>
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="form-input"
              >
                <option value="">All Companies</option>
                {companies.map((comp) => (
                  <option key={comp} value={comp}>
                    {comp}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Filter by Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="form-input"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(searchQuery || selectedCompany || selectedBranch) && (
            <p className="text-xs text-gray-500 mt-3">
              Showing {filteredReports.length} of {reports.length} reports
            </p>
          )}
        </div>
      </div>

      {/* Statistics */}
      {filteredReports.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="stat-card">
            <p className="stat-label">Total Students</p>
            <p className="stat-value">{filteredReports.length}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Avg Week Pairs Reported</p>
            <p className="stat-value">
              {(
                filteredReports.reduce((sum, r) => sum + r.weeks.length, 0) / filteredReports.length
              ).toFixed(1)}
            </p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Total Week Pairs</p>
            <p className="stat-value">{filteredReports.reduce((sum, r) => sum + r.weeks.length, 0)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Max Week Pairs</p>
            <p className="stat-value">{Math.max(...filteredReports.map((r) => r.weeks.length), 0)}</p>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="section-card">
            <div className="section-card-body text-center py-12">
              <p className="text-gray-500">
                {reports.length === 0
                  ? 'No weekly reports imported yet. Go to Import tab to upload.'
                  : 'No reports match your filters.'}
              </p>
            </div>
          </div>
        ) : (
          filteredReports.map((report) => {
            const isExpanded = expandedReports.has(report._id);
            return (
              <div key={report._id} className="section-card">
                <div
                  className="section-card-body cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(report._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{report.studentName}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                        <p>
                          <span className="font-medium">UID:</span> {report.studentUID}
                        </p>
                        <p>
                          <span className="font-medium">Company:</span> {report.company}
                        </p>
                        <p>
                          <span className="font-medium">Branch:</span> {report.branch}
                        </p>
                        <p>
                          <span className="font-medium">Week Pairs:</span> {report.weeks.length}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-gray-400 hover:text-gray-600 p-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(report._id);
                      }}
                    >
                      {isExpanded ? '▼' : '▶'}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="border-t border-gray-200 p-4 bg-gray-50">
                    {report.weeks.length === 0 ? (
                      <p className="text-gray-500 text-sm">No week data available</p>
                    ) : (
                      <div className="space-y-6">
                        {report.weeks.map((week) => (
                          <div key={week.weekPair} className="bg-white rounded border border-gray-200 p-4">
                            <h4 className="font-semibold text-blue-700 mb-3">
                              {week.weekRange}
                              {week.dateRange && ` • ${week.dateRange}`}
                            </h4>

                            <div className="space-y-3 text-sm">
                              {week.targetBrief && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-1">Target/Project Brief:</p>
                                  <p className="text-gray-600 whitespace-pre-wrap">{week.targetBrief}</p>
                                </div>
                              )}

                              {week.learning && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-1">Learning Outcomes:</p>
                                  <p className="text-gray-600 whitespace-pre-wrap">{week.learning}</p>
                                </div>
                              )}

                              {week.contribution && (
                                <div>
                                  <p className="font-medium text-gray-700 mb-1">Role & Contribution:</p>
                                  <p className="text-gray-600 whitespace-pre-wrap">{week.contribution}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default WeeklyReports;
