const mongoose = require('mongoose');

const weeklyReportSchema = new mongoose.Schema(
  {
    studentUID: { type: String, required: true, unique: true, sparse: true },
    studentName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, sparse: true },
    company: { type: String, required: true },
    branch: { type: String, required: true },
    weeks: [
      {
        weekNumber: { type: Number, required: true },
        dateRange: { type: String },
        targetBrief: { type: String },
        learning: { type: String },
        contribution: { type: String },
      },
    ],
    importedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
weeklyReportSchema.index({ studentUID: 1 });
weeklyReportSchema.index({ email: 1 });
weeklyReportSchema.index({ company: 1 });
weeklyReportSchema.index({ branch: 1 });

module.exports = mongoose.model('WeeklyReport', weeklyReportSchema);
