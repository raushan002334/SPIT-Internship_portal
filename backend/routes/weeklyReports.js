const express = require('express');
const XLSX = require('xlsx');
const multer = require('multer');
const WeeklyReport = require('../models/WeeklyReport');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper: Parse week pairs dynamically from column names
const parseWeeksFromData = (row) => {
  const weeks = [];
  const weekPairs = {}; // Store paired weeks: { 1: {1,2}, 2: {3,4}, 3: {5,6}, 4: {7,8} }

  Object.keys(row).forEach((key) => {
    // Find week pair date ranges like "(WEEK - 1 & 2) Exact Dates"
    const dateMatch = key.match(/\(WEEK\s*-\s*(\d+)\s*&\s*(\d+)\)\s*Exact Dates/i);
    if (dateMatch && row[key] && row[key] !== 'NA') {
      const w1 = parseInt(dateMatch[1]);
      const w2 = parseInt(dateMatch[2]);
      const pairNum = Math.ceil(w1 / 2); // 1,2 -> pair 1; 3,4 -> pair 2; etc
      
      if (!weekPairs[pairNum]) weekPairs[pairNum] = {};
      weekPairs[pairNum].dateRange = row[key];
      weekPairs[pairNum].weekRange = `Week ${w1} & ${w2}`;
    }

    // Find target briefs
    const targetMatch = key.match(/Target Assigned \(Project Brief\)(\s*(\d+))?$/i);
    if (targetMatch && row[key] && row[key] !== 'NA') {
      const pairNum = targetMatch[2] ? parseInt(targetMatch[2]) : 1;
      if (!weekPairs[pairNum]) weekPairs[pairNum] = {};
      weekPairs[pairNum].targetBrief = row[key];
    }

    // Find learning outcomes
    if (key.includes('Your learning related to Target') && !key.includes('Exact Dates')) {
      const learningMatch = key.match(/Your learning.*?(\d+)?$/i);
      const pairNum = learningMatch && learningMatch[1] ? parseInt(learningMatch[1]) : 1;
      if (!weekPairs[pairNum]) weekPairs[pairNum] = {};
      weekPairs[pairNum].learning = row[key];
    }

    // Find contributions
    if (key.includes('Your Role or Contribution to the project') && !key.includes('Exact Dates')) {
      const contribMatch = key.match(/Your Role.*?(\d+)?$/i);
      const pairNum = contribMatch && contribMatch[1] ? parseInt(contribMatch[1]) : 1;
      if (!weekPairs[pairNum]) weekPairs[pairNum] = {};
      weekPairs[pairNum].contribution = row[key];
    }
  });

  // Convert to array, sorted by pair number
  Object.keys(weekPairs)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .forEach((pairNum) => {
      const pair = weekPairs[pairNum];
      if (pair.dateRange) {
        weeks.push({
          weekPair: parseInt(pairNum), // 1, 2, 3, 4 for week pairs
          weekRange: pair.weekRange || `Week ${parseInt(pairNum) * 2 - 1} & ${parseInt(pairNum) * 2}`,
          dateRange: pair.dateRange,
          targetBrief: pair.targetBrief || '',
          learning: pair.learning || '',
          contribution: pair.contribution || '',
        });
      }
    });

  return weeks;
};

// POST: Import weekly reports from Excel
router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ success: false, message: 'No data found in Excel' });
    }

    let imported = 0;
    let skipped = 0;
    const errors = [];

    for (const row of data) {
      try {
        const studentUID = String(row['UID'] || '').trim();
        const studentName = String(row['Student Name'] || '').trim();
        const email = String(row['Email Address'] || '').trim();
        const company = String(row['Internship-Company Name'] || '').trim();
        const branch = String(row['Student Branch'] || '').trim();

        if (!studentUID || !studentName) {
          skipped++;
          continue;
        }

        // Parse weeks dynamically
        const weeks = parseWeeksFromData(row);

        // Upsert: Update if exists, create if not
        await WeeklyReport.findOneAndUpdate(
          { studentUID },
          {
            studentUID,
            studentName,
            email,
            company,
            branch,
            weeks,
            importedAt: new Date(),
          },
          { upsert: true, new: true }
        );

        imported++;
      } catch (error) {
        errors.push(`Error processing ${row['Student Name']}: ${error.message}`);
        skipped++;
      }
    }

    return res.json({
      success: true,
      message: `Imported ${imported} weekly reports, skipped ${skipped}`,
      data: { imported, skipped, errors: errors.slice(0, 10) },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Import failed',
      error: error.message,
    });
  }
});

// GET: All weekly reports with optional filters
router.get('/', async (req, res) => {
  try {
    const { search, company, branch } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { studentName: new RegExp(search, 'i') },
        { studentUID: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    if (company) {
      query.company = new RegExp(company, 'i');
    }

    if (branch) {
      query.branch = new RegExp(branch, 'i');
    }

    const reports = await WeeklyReport.find(query).sort({ studentName: 1 });

    return res.json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch reports',
      error: error.message,
    });
  }
});

// GET: Single student report by UID
router.get('/:uid', async (req, res) => {
  try {
    const report = await WeeklyReport.findOne({ studentUID: req.params.uid });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Weekly report not found',
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch report',
      error: error.message,
    });
  }
});

// GET: Unique companies for filter dropdown
router.get('/filter/companies', async (req, res) => {
  try {
    const companies = await WeeklyReport.distinct('company');
    return res.json({
      success: true,
      data: companies.sort(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch companies',
      error: error.message,
    });
  }
});

// GET: Unique branches for filter dropdown
router.get('/filter/branches', async (req, res) => {
  try {
    const branches = await WeeklyReport.distinct('branch');
    return res.json({
      success: true,
      data: branches.sort(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch branches',
      error: error.message,
    });
  }
});

// DELETE: All weekly reports (admin only)
router.delete('/clear-all', async (req, res) => {
  try {
    const result = await WeeklyReport.deleteMany({});
    return res.json({
      success: true,
      message: `Deleted ${result.deletedCount} weekly reports`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not delete reports',
      error: error.message,
    });
  }
});

module.exports = router;
