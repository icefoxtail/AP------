'use strict';

const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { materializeHistoricalCreateFixture } = require('./helpers/historical-create-gates.cjs');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/m2-create-gate-history.json'), 'utf8'));
const ordinaryCase = 'm2-o11-create-gate-manual';
const questionOnlyCase = 'm2-o34-create-gate-tempcreate1';
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const gate = () => import('../archive/tools/review-evidence-gate.mjs');
const validate = async fixture => (await gate()).validatePhysicalEvidence({
  examFile: fixture.examFile, evidenceFile: fixture.evidenceFile, stage: 'CREATE',
});

async function withFixture(caseId, body) {
  const fixture = materializeHistoricalCreateFixture(caseId);
  try { return await body(fixture); }
  finally { fixture.cleanup(); }
}

function writeEvidence(fixture, evidence) {
  fs.writeFileSync(fixture.evidenceFile, JSON.stringify(evidence, null, 2) + '\n');
}

test('historical CREATE retains the complete Q19 adjudication gate', async () => {
  await withFixture(questionOnlyCase, async fixture => {
    const evidence = JSON.parse(fs.readFileSync(fixture.evidenceFile, 'utf8'));
    assert.equal(evidence.examSha256, `sha256:${sha256(fs.readFileSync(fixture.examFile))}`);
    assert.equal(evidence.questionOnlyReplacementAdjudications[0].qid, 19);
    const result = await validate(fixture);
    assert.equal(result.ok, true, JSON.stringify(result.issues));
    assert.deepEqual(result.issues, []);
  });
});

test('a changed manifest SHA cannot materialize an accepted fixture', () => {
  const altered = structuredClone(manifest);
  const entry = altered.cases.find(item => item.id === ordinaryCase);
  altered.files.find(file => file.path === entry.examPath).sha256 = '0'.repeat(64);
  assert.throws(() => materializeHistoricalCreateFixture(ordinaryCase, { manifest: altered }),
    /HISTORICAL_CREATE_SHA256_MISMATCH/);
});

test('missing historical Git objects fail without using current working source', () => {
  const altered = structuredClone(manifest);
  altered.sourceCommit = '0'.repeat(40);
  assert.throws(() => materializeHistoricalCreateFixture(ordinaryCase, { manifest: altered }),
    /HISTORICAL_CREATE_GIT_OBJECT_REQUIRED/);
});

test('fixture paths cannot escape their temporary repository', () => {
  const altered = structuredClone(manifest);
  altered.files[0].path = 'archive/../outside.json';
  assert.throws(() => materializeHistoricalCreateFixture(ordinaryCase, { manifest: altered }),
    /HISTORICAL_CREATE_FILE_PATH_INVALID/);
});

test('the production gate still rejects changed source bytes', async () => {
  await withFixture(ordinaryCase, async fixture => {
    fs.appendFileSync(fixture.examFile, '\n');
    const result = await validate(fixture);
    assert.equal(result.ok, false);
    assert.ok(result.issues.includes('EVIDENCE_EXAM_SHA_MISMATCH'));
  });
});

test('updating only the exam hash cannot rebind a Q19 historical approval', async () => {
  await withFixture(questionOnlyCase, async fixture => {
    fs.appendFileSync(fixture.examFile, '\n');
    const evidence = JSON.parse(fs.readFileSync(fixture.evidenceFile, 'utf8'));
    evidence.examSha256 = `sha256:${sha256(fs.readFileSync(fixture.examFile))}`;
    writeEvidence(fixture, evidence);
    const result = await validate(fixture);
    assert.equal(result.ok, false);
    assert.ok(!result.issues.includes('EVIDENCE_EXAM_SHA_MISMATCH'));
    assert.ok(result.issues.includes('QUESTION_ONLY_REPLACEMENT_BINDING_INVALID:q19'));
    assert.ok(result.issues.includes('QUESTION_ONLY_AUTHORITY_BINDING_INVALID:q19'));
    assert.ok(result.issues.includes('QUESTION_ONLY_CREATE_VALIDATOR_BINDING_INVALID:q19'));
  });
});

test('missing calibration sample evidence still fails the production gate', async () => {
  await withFixture(ordinaryCase, async fixture => {
    const evidence = JSON.parse(fs.readFileSync(fixture.evidenceFile, 'utf8'));
    const sample = evidence.solutionQualityCalibration.goldenSampleRefs[0];
    fs.unlinkSync(path.join(fixture.root, sample.path));
    const result = await validate(fixture);
    assert.equal(result.ok, false);
    assert.ok(result.issues.includes(`GOLDEN_SAMPLE_REF_NOT_FOUND:${sample.path}`));
  });
});

test('an unapproved question axis cannot be hidden by the historical fixture', async () => {
  await withFixture(ordinaryCase, async fixture => {
    const evidence = JSON.parse(fs.readFileSync(fixture.evidenceFile, 'utf8'));
    const row = evidence.questionRows[0];
    row.solutionMath.status = 'UNKNOWN';
    writeEvidence(fixture, evidence);
    const result = await validate(fixture);
    assert.equal(result.ok, false);
    assert.ok(result.issues.includes(`QUESTION_AXIS_EVIDENCE_MISSING:q${row.qid}:solutionMath`));
  });
});

test('changed visual bytes remain rejected by the current production gate', async () => {
  await withFixture(questionOnlyCase, async fixture => {
    const evidence = JSON.parse(fs.readFileSync(fixture.evidenceFile, 'utf8'));
    const visual = evidence.visualRows[0];
    assert.ok(visual?.assetPath);
    fs.appendFileSync(path.join(fixture.root, 'archive', visual.assetPath), '\n');
    const result = await validate(fixture);
    assert.equal(result.ok, false);
    assert.ok(result.issues.includes(`VISUAL_SHA_MISMATCH:q${visual.qid}`));
  });
});
