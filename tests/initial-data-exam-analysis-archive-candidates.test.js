const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const worker = fs.readFileSync(path.join(root, 'apmath/worker-backup/worker/index.js'), 'utf8');

assert.match(worker, /function normalizeInitialDataArchiveFile\(/);
assert.match(worker, /function getInitialDataArchiveCandidates\(/);
assert.match(worker, /analysisArchiveFiles\s*=\s*getInitialDataArchiveCandidates\(exs\.results\)/);
assert.match(worker, /SELECT \* FROM exam_question_reviews WHERE archive_file IN/);
assert.match(worker, /SELECT \* FROM exam_analysis_meta WHERE archive_file IN/);

const helperMatch = worker.match(/function normalizeInitialDataArchiveFile[\s\S]*?function getInitialDataArchiveCandidates[\s\S]*?return Array\.from\(candidates\)\.filter\(Boolean\);\r?\n}\r?\n/);
assert.ok(helperMatch, 'worker should expose initial-data archive candidate helpers');

const sandbox = {};
Function('sandbox', `
  ${helperMatch[0]}
  sandbox.normalizeInitialDataArchiveFile = normalizeInitialDataArchiveFile;
  sandbox.getInitialDataArchiveCandidates = getInitialDataArchiveCandidates;
`)(sandbox);
assert.equal(typeof sandbox.getInitialDataArchiveCandidates, 'function');

const candidates = sandbox.getInitialDataArchiveCandidates([
  { archive_file: 'middle/m3/1final/26_exam.js' },
  { archive_file: 'archive/exams/original/middle/m3/1mid/26_exam_c.js' },
  { archive_file: 'exams/original/middle/m3/1mid/26_exam_c.js' }
]);

assert.ok(candidates.includes('middle/m3/1final/26_exam.js'));
assert.ok(candidates.includes('exams/middle/m3/1final/26_exam.js'));
assert.ok(candidates.includes('archive/exams/original/middle/m3/1mid/26_exam_c.js'));
assert.ok(candidates.includes('exams/original/middle/m3/1mid/26_exam_c.js'));
assert.ok(candidates.includes('original/middle/m3/1mid/26_exam_c.js'));
assert.equal(new Set(candidates).size, candidates.length, 'candidate list should be deduped');

console.log('initial-data exam analysis archive candidate test passed');
