const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'eie/index.html',
  'eie/js/eie-app.js',
  'eie/js/views/eie-dashboard.js',
  'eie/js/views/eie-students.js',
  'eie/js/views/eie-teacher.js'
];

const forbiddenPatterns = [
  /\u6f61|\u934e|\u7570|\u8b70|\u907a|\u936e|\u6fd2/,
  /\?[\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/,
  /\?\?\/(?:span|h1|h3|button|div|label|title)>/,
  /[^\x00-\x7F]\?\/(?:span|h1|h3|button|div|label|title)>/,
  /\s\uCA0C\s/,
  // \uC4F0(\uC4F0)\uB294 '\uB36E\uC5B4\uC4F0\uC9C0' \uB4F1 \uC815\uC0C1 \uD55C\uAD6D\uC5B4 \uC74C\uC808\uC774\uB77C \uBAA8\uC9C0\uBC14\uCF00 \uD0D0\uC9C0\uC5D0\uC11C \uC81C\uC678 \u2014 Round 3 product decision #7
  /\uCA0C|\uB0B5|\uB365|\uB69D|\uB7F0/
];

for (const file of files) {
  const fullPath = path.join(root, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  for (const pattern of forbiddenPatterns) {
    assert(
      !pattern.test(source),
      `${file} should not contain mojibake pattern ${pattern}`
    );
  }
}

console.log('EIE non-timetable text encoding test passed');
