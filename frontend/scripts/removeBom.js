const fs = require('fs');
const path = require('path');

const files = [
  'src/pages/AllGroups.js',
  'src/pages/AllMentors.js',
  'src/pages/CompanyAnalytics.js',
  'src/pages/Dashboard.js',
  'src/pages/ExcelUpload.js',
  'src/pages/GroupGenerator.js',
  'src/pages/MentorEdit.js',
  'src/pages/StudentPicker.js',
];

files.forEach((relPath) => {
  const filePath = path.join(__dirname, '..', relPath);

  if (!fs.existsSync(filePath)) {
    console.warn(`Skipping missing file: ${relPath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  if (!content) {
    console.warn(`Empty file (or read error): ${relPath}`);
    return;
  }

  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Stripped BOM from: ${relPath}`);
  } else {
    console.log(`No BOM found in: ${relPath}`);
  }
});
