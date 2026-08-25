import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { auditQuestionTypeCoverage } from '../archive/tools/audit-question-type-coverage.mjs';

test('original questionType values are preserved in question-index', () => {
  const audit = auditQuestionTypeCoverage();
  assert.equal(audit.source.fileCount, 348);
  assert.equal(audit.source.questionCount, 7981);
  assert.equal(audit.index.originalRecordCount, 7981);
  assert.equal(audit.comparison.originalCountMatches, true);
  assert.equal(audit.comparison.exactValueMatch, true);
  assert.equal(audit.comparison.missingIndexRecordCount, 0);
  assert.equal(audit.comparison.questionTypeMismatchCount, 0);
  assert.equal(audit.source.nonblankCount, 6705);
  assert.equal(audit.source.blankCount, 1276);
  assert.equal(audit.source.missingPropertyCount, 0);
  assert.equal(audit.source.filesWithoutProperty.length, 0);
});

test('checked-in questionType audit remains deterministic', () => {
  const path = 'archive/data/question-type-coverage-audit.json';
  assert.ok(fs.existsSync(path), 'question-type-coverage-audit.json must be generated');
  const checkedIn = JSON.parse(fs.readFileSync(path, 'utf8'));
  const fresh = auditQuestionTypeCoverage();
  assert.deepEqual(checkedIn, fresh);
});
