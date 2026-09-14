const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const examsRoot = path.join(root, 'archive', 'exams');

function examFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? examFiles(file) : file.endsWith('.js') ? [file] : [];
  });
}

function loadQuestions(file) {
  const window = {};
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), { window, console }, { filename: file, timeout: 1000 });
  const bank = Array.isArray(window.questionBank)
    ? window.questionBank
    : (window.questionBank?.questions || window.questionBank?.problems || []);
  return Array.isArray(bank) ? bank : [];
}

function inventory() {
  const rows = [];
  for (const file of examFiles(examsRoot)) {
    const relative = path.relative(examsRoot, file).replace(/\\/g, '/');
    loadQuestions(file).forEach((question, index) => {
      const content = String(question?.content || question?.question || question?.text || question?.prompt || '');
      for (const match of content.matchAll(/<img\b[^>]*>/gi)) {
        const tag = match[0];
        const source = tag.match(/\bsrc\s*=\s*(["'])(.*?)\1/i)?.[2] || '';
        rows.push({ file: relative, questionId: question?.id ?? index + 1, sourceOrdinal: index + 1, src: source,
          extension: path.extname(source.split(/[?#]/)[0]).toLowerCase(), qImagePresent: Boolean(question?.image),
          contentInlineImage: true, testFixture: relative.startsWith('test-fixtures/') });
      }
    });
  }
  return rows.sort((left, right) => left.file.localeCompare(right.file) || left.sourceOrdinal - right.sourceOrdinal);
}

test('archive/exams inline image inventory covers every content img without migrating production data', () => {
  const rows = inventory();
  const report = JSON.parse(fs.readFileSync(path.join(root, 'docs', 'reports', 'archive-inline-image-inventory-20260915.json'), 'utf8'));
  assert.equal(rows.length, 31);
  assert.equal(rows.filter(row => !row.testFixture).length, 27);
  assert.equal(rows.filter(row => row.testFixture).length, 4);
  assert.deepEqual(rows.reduce((counts, row) => { counts[row.extension] = (counts[row.extension] || 0) + 1; return counts; }, {}), { '.png': 30, '.svg': 1 });
  assert.equal(rows.filter(row => row.qImagePresent).length, 1);
  const q9 = rows.find(row => row.file === 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js' && row.questionId === 9);
  assert.deepEqual(q9, { file: 'original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js', questionId: 9, sourceOrdinal: 9,
    src: 'assets/images/25_제일고_2학기_중간_고2_수학II/q9.png', extension: '.png', qImagePresent: false,
    contentInlineImage: true, testFixture: false });
  assert.ok(rows.every(row => row.contentInlineImage && row.src.startsWith('assets/images/')));
  assert.deepEqual(report.records, rows);
});
