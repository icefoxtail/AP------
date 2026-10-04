const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const test = require('node:test');

const repo = path.resolve(__dirname, '..');
const auditScript = path.join(repo, 'archive', 'tools', 'audit-latex-escapes.mjs');

test('archive answer and solution LaTeX strings survive JavaScript evaluation', () => {
  const result = spawnSync(process.execPath, [auditScript, '--repo', repo], {
    cwd: repo,
    encoding: 'utf8',
    maxBuffer: 20 * 1024 * 1024
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  const report = JSON.parse(result.stdout);
  assert.equal(report.evaluationErrors, 0);
  assert.equal(report.staticOccurrences, 0);
  assert.equal(report.affectedFields, 0);
});
