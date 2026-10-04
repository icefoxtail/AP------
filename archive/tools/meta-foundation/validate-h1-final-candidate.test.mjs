import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const VALIDATOR = path.join(ROOT, 'archive', 'tools', 'meta-foundation', 'validate-h1-final-candidate.mjs');
const hash = (value) => crypto.createHash('sha256').update(value, 'utf8').digest('hex');
const stable = (value) => Array.isArray(value)
  ? `[${value.map(stable).join(',')}]`
  : !value || typeof value !== 'object'
    ? JSON.stringify(value)
    : `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
const semanticDigestOf = (record) => hash(stable({
  problemTypeKey: record.problemTypeKey,
  templateKey: record.templateKey,
  crossConceptKeys: record.crossConceptKeys,
  conditionKeys: record.conditionKeys,
  integrationPattern: record.integrationPattern,
}));

function makeFixture({ conflictAt = -1 } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'h1-final-candidate-'));
  const archiveRoot = path.join(dir, 'archive');
  fs.mkdirSync(archiveRoot, { recursive: true });
  const sourceArchiveFile = 'fixture/exam.js';
  const sourcePath = path.join(archiveRoot, sourceArchiveFile);
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, '/* fixture archive source */\n');
  const sourceJsSha256 = hash(fs.readFileSync(sourcePath));
  const sourceRows = [];
  const candidateRows = [];
  const workerARows = [];
  const workerBRows = [];

  for (let i = 0; i < 1170; i += 1) {
    const questionUid = `qid_v1_${hash(`uid-${i}`)}`;
    const sourceOrdinal = i + 1;
    const sourceIdentity = `${sourceArchiveFile}#${sourceOrdinal}`;
    const content = `problem content ${i}`;
    const solution = `solution text ${i}`;
    const sourceFingerprint = hash(`source fingerprint ${i}`);
    const contentHash = hash(content);
    const solutionHash = hash(solution);
    const common = {
      questionUid,
      family: 'POLYNOMIAL',
      sourceIdentity,
      sourceFingerprint,
      contentHash,
      solutionHash,
    };
    sourceRows.push({
      questionUid,
      sourceArchiveFile,
      sourceOrdinal,
      sourceJsSha256,
      sourceFingerprint,
      content,
      solution,
      curriculum: '2022',
      currentStandardUnitKey: 'UNIT_TEST',
      currentSubUnitKey: 'SUBUNIT_TEST',
    });
    candidateRows.push({
      ...common,
      inputBundleSha: hash(`candidate input ${i}`),
      evidenceRef: `candidate-evidence:${questionUid}`,
      problemTypeKey: 'PT_TEST',
      templateKey: 'TPL_TEST',
      ownerPack: 'PACK_TEST',
      taxonomyDisposition: 'ACTIVE',
      curriculum: '2022',
      standardUnitKey: 'UNIT_TEST',
      subUnitKey: 'SUBUNIT_TEST',
      crossConceptKeys: ['CC_TEST'],
      conditionKeys: ['COND_INTEGER'],
      integrationPattern: 'NONE',
      disposition: 'CLASSIFIED',
      conflictResolution: { status: 'RESOLVED', provenance: 'DUAL_LUNA_MATCH' },
    });
    const decisionHash = semanticDigestOf(candidateRows[i]);
    workerARows.push({
      ...common,
      inputBundleSha: hash(`worker A input ${i}`),
      evidenceRef: `worker-a-evidence:${questionUid}`,
      decisionHash,
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    });
    workerBRows.push({
      ...common,
      inputBundleSha: hash(`worker B input ${i}`),
      evidenceRef: `worker-b-evidence:${questionUid}`,
      decisionHash: i === conflictAt ? hash(`conflicting decision ${i}`) : decisionHash,
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    });
  }

  const writeJson = (name, value) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
    return file;
  };
  const writeJsonl = (name, value) => {
    const file = path.join(dir, name);
    fs.writeFileSync(file, `${value.map((row) => JSON.stringify(row)).join('\n')}\n`);
    return file;
  };
  const files = {
    source: writeJson('source.json', { rows: sourceRows }),
    candidate: writeJsonl('candidate.jsonl', candidateRows),
    workerA: writeJsonl('worker-a.jsonl', workerARows),
    workerB: writeJsonl('worker-b.jsonl', workerBRows),
    workerC: writeJsonl('worker-c.jsonl', []),
    taxonomy: writeJson('taxonomy.json', {
      problemTypes: [{ problemTypeKey: 'PT_TEST', ownerPack: 'PACK_TEST', status: 'ACTIVE' }],
      templates: [{ templateKey: 'TPL_TEST', parentProblemTypeKey: 'PT_TEST', ownerPack: 'PACK_TEST', status: 'ACTIVE' }],
    }),
    concepts: writeJson('concepts.json', { concepts: [{ conceptKey: 'CC_TEST', ownerConceptShard: 'ALGEBRA', status: 'ACTIVE' }] }),
    conditions: writeJson('conditions.json', { conditions: [{ conditionKey: 'COND_INTEGER', status: 'ACTIVE' }] }),
    bindings: writeJson('bindings.json', {
      bindings: [{
        curriculum: '2022', standardUnitKey: 'UNIT_TEST', subUnitKey: 'SUBUNIT_TEST',
        problemTypeKey: 'PT_TEST', ownerPack: 'PACK_TEST', status: 'ACTIVE',
      }],
    }),
    metadataRules: writeJson('metadata-rules.json', { integrationPatterns: ['NONE', 'SEQUENTIAL'] }),
    archiveRoot,
  };
  return { dir, sourceRows, candidateRows, workerARows, workerBRows, files, writeJson, writeJsonl };
}

function runFixture(fixture, { candidateTaxonomy } = {}) {
  if (candidateTaxonomy) fixture.files.candidateTaxonomy = candidateTaxonomy;
  const args = [
    VALIDATOR,
    '--source', fixture.files.source,
    '--candidate', fixture.files.candidate,
    '--worker-a', fixture.files.workerA,
    '--worker-b', fixture.files.workerB,
    '--worker-c', fixture.files.workerC,
    '--archive-root', fixture.files.archiveRoot,
    '--taxonomy', fixture.files.taxonomy,
    '--concepts', fixture.files.concepts,
    '--conditions', fixture.files.conditions,
    '--bindings', fixture.files.bindings,
    '--metadata-rules', fixture.files.metadataRules,
  ];
  if (fixture.files.candidateTaxonomy) args.push('--candidate-taxonomy', fixture.files.candidateTaxonomy);
  if (fixture.files.solAdjudication) args.push('--sol-adjudication', fixture.files.solAdjudication);
  const result = spawnSync(process.execPath, args, { encoding: 'utf8' });
  return { ...result, report: JSON.parse(result.stdout || '{}') };
}

function cleanup(fixture) {
  fs.rmSync(fixture.dir, { recursive: true, force: true });
}

test('H1 1170 final candidate passes complete source, worker, and registry coverage', () => {
  const fixture = makeFixture();
  try {
    const result = runFixture(fixture);
    assert.equal(result.status, 0, result.stderr || JSON.stringify(result.report.failures, null, 2));
    assert.equal(result.report.status, 'PASS');
    assert.equal(result.report.counts.source, 1170);
    assert.equal(result.report.counts.candidate, 1170);
    assert.equal(result.report.counts.uniqueUid, 1170);
    assert.equal(result.report.counts.uniqueSourceIdentity, 1170);
  } finally {
    cleanup(fixture);
  }
});

test('duplicate candidate UID is rejected with UID and family context', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[1].questionUid = fixture.candidateRows[0].questionUid;
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) =>
      failure.code === 'DUPLICATE_UID' && failure.family === 'POLYNOMIAL' && failure.questionUid === fixture.candidateRows[0].questionUid));
  } finally {
    cleanup(fixture);
  }
});

test('source identity must be derived from its canonical archive file and ordinal', () => {
  const fixture = makeFixture();
  try {
    const uid = fixture.sourceRows[0].questionUid;
    const forgedIdentity = 'fixture/exam.js#999999';
    fixture.sourceRows[0].sourceIdentity = forgedIdentity;
    fixture.candidateRows[0].sourceIdentity = forgedIdentity;
    fixture.workerARows[0].sourceIdentity = forgedIdentity;
    fixture.workerBRows[0].sourceIdentity = forgedIdentity;
    fixture.files.source = fixture.writeJson('source.json', { rows: fixture.sourceRows });
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SOURCE_IDENTITY_NOT_CANONICAL' && failure.questionUid === uid));
  } finally {
    cleanup(fixture);
  }
});

test('candidate decision digest must equal the A/B agreed digest', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[0].crossConceptKeys = [];
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'FINAL_DECISION_DIGEST_MISMATCH'));
  } finally {
    cleanup(fixture);
  }
});

test('worker A declared digest must match its semantic decision fields', () => {
  const fixture = makeFixture();
  try {
    fixture.workerARows[0].primaryMethod = 'METHOD_DISAGREES_WITH_DECLARED_DIGEST';
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_A_DECISION_HASH_STALE'));
  } finally {
    cleanup(fixture);
  }
});

test('worker B declared digest must match its semantic decision fields', () => {
  const fixture = makeFixture();
  try {
    fixture.workerBRows[0].decisiveStep = 'STEP_DISAGREES_WITH_DECLARED_DIGEST';
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_B_DECISION_HASH_STALE'));
  } finally {
    cleanup(fixture);
  }
});

test('worker C declared digest must match its semantic decision fields', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const evidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'LUNA_2_OF_3_CONSENSUS', evidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [{
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef,
      decisionHash: semanticDigestOf(candidate),
      primaryMethod: 'METHOD_DISAGREES_WITH_DECLARED_DIGEST',
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    }]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_C_DECISION_HASH_STALE'));
  } finally {
    cleanup(fixture);
  }
});

test('Sol adjudication declared digest must match its semantic decision fields', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    const solEvidenceRef = `sol-adjudication-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'SOL_DIRECT_ADJUDICATION', evidenceRef: solEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      integrationPattern: 'SEQUENTIAL',
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    cRow.decisionHash = semanticDigestOf(cRow);
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    fixture.files.solAdjudication = fixture.writeJsonl('sol-adjudication.jsonl', [{
      ...candidate,
      inputBundleSha: hash('Sol source and solution input'),
      evidenceRef: solEvidenceRef,
      decisionHash: semanticDigestOf(candidate),
      decisiveStep: 'STEP_DISAGREES_WITH_DECLARED_DIGEST',
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    }]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SOL_ADJUDICATION_DECISION_HASH_STALE'));
  } finally {
    cleanup(fixture);
  }
});

test('nested worker decision hashes use the final candidate set-array normalization', () => {
  const fixture = makeFixture();
  try {
    const concepts = JSON.parse(fs.readFileSync(fixture.files.concepts, 'utf8'));
    concepts.concepts.push({ conceptKey: 'CC_SECOND', ownerConceptShard: 'ALGEBRA', status: 'ACTIVE' });
    fixture.files.concepts = fixture.writeJson('concepts.json', concepts);
    const conditions = JSON.parse(fs.readFileSync(fixture.files.conditions, 'utf8'));
    conditions.conditions.push({ conditionKey: 'COND_RANGE', status: 'ACTIVE' });
    fixture.files.conditions = fixture.writeJson('conditions.json', conditions);
    fixture.candidateRows[0].crossConceptKeys = ['CC_TEST', 'CC_SECOND'];
    fixture.candidateRows[0].conditionKeys = ['COND_INTEGER', 'COND_RANGE'];
    const decision = {
      problemTypeKey: 'PT_TEST',
      templateKey: 'TPL_TEST',
      crossConceptKeys: ['CC_SECOND', 'CC_TEST'],
      conditionKeys: ['COND_RANGE', 'COND_INTEGER'],
      integrationPattern: 'NONE',
    };
    delete fixture.workerARows[0].decisionHash;
    delete fixture.workerBRows[0].decisionHash;
    fixture.workerARows[0].decision = decision;
    fixture.workerBRows[0].decision = structuredClone(decision);
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 0, JSON.stringify(result.report.failures.slice(0, 10), null, 2));
  } finally {
    cleanup(fixture);
  }
});

test('worker and final decision aliases cannot disagree behind the preferred field names', () => {
  const fixture = makeFixture();
  try {
    fixture.workerARows[0].normalizedDecisionHash = hash('conflicting decision hash alias');
    fixture.workerARows[0].crossConceptKeys = ['CC_TEST'];
    fixture.workerARows[0].crossConcepts = ['CC_DIFFERENT'];
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_A_DECISION_HASH_ALIAS_CONFLICT'));
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_A_DECISION_ALIAS_CONFLICT'));
  } finally {
    cleanup(fixture);
  }

  const candidateFixture = makeFixture();
  try {
    candidateFixture.candidateRows[0].decisionHash = semanticDigestOf(candidateFixture.candidateRows[0]);
    candidateFixture.candidateRows[0].classificationHash = hash('conflicting final hash alias');
    candidateFixture.candidateRows[0].crossConcepts = ['CC_DIFFERENT'];
    candidateFixture.files.candidate = candidateFixture.writeJsonl('candidate.jsonl', candidateFixture.candidateRows);
    const result = runFixture(candidateFixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'FINAL_DECISION_HASH_ALIAS_CONFLICT'));
    assert.ok(result.report.failures.some((failure) => failure.code === 'FINAL_DECISION_ALIAS_CONFLICT'));
  } finally {
    cleanup(candidateFixture);
  }
});

test('missing worker evidence reference is rejected', () => {
  const fixture = makeFixture();
  try {
    fixture.workerARows[0].evidenceRef = '';
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_A_EVIDENCE_REF_MISSING'));
  } finally {
    cleanup(fixture);
  }
});

test('A/B conflict without C review is rejected', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'CONFLICT_C_REVIEW_MISSING'));
  } finally {
    cleanup(fixture);
  }
});

test('resolved A/B conflict requires a matched C review and final evidence reference', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    const solEvidenceRef = `sol-adjudication-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'SOL_DIRECT_ADJUDICATION', evidenceRef: solEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: semanticDigestOf(candidate),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    const solRow = {
      ...candidate,
      inputBundleSha: hash('Sol direct source and solution input'),
      evidenceRef: solEvidenceRef,
      decisionHash: semanticDigestOf(candidate),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    fixture.files.solAdjudication = fixture.writeJsonl('sol-adjudication.jsonl', [solRow]);
    const result = runFixture(fixture);
    assert.equal(result.status, 0, JSON.stringify(result.report.failures, null, 2));
    assert.equal(result.report.counts.conflicts, 1);
    assert.equal(result.report.counts.workerC, 1);
    assert.equal(result.report.counts.solAdjudication, 1);
  } finally {
    cleanup(fixture);
  }
});

test('LUNA 2-of-3 resolution uses C evidence and requires C to match A or B', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'LUNA_2_OF_3_CONSENSUS', evidenceRef: cEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: semanticDigestOf(candidate),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    const result = runFixture(fixture);
    assert.equal(result.status, 0, JSON.stringify(result.report.failures, null, 2));
  } finally {
    cleanup(fixture);
  }
});

test('candidate digest cannot disagree with an otherwise valid C majority', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    candidate.crossConceptKeys = [];
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'LUNA_2_OF_3_CONSENSUS', evidenceRef: cEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      crossConceptKeys: ['CC_TEST'],
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: semanticDigestOf({ ...candidate, crossConceptKeys: ['CC_TEST'] }),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'FINAL_DECISION_DIGEST_MISMATCH'));
  } finally {
    cleanup(fixture);
  }
});

test('three-way split cannot pass without the referenced Sol adjudication ledger row', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = {
      status: 'RESOLVED',
      provenance: 'SOL_DIRECT_ADJUDICATION',
      evidenceRef: `sol-adjudication-evidence:${candidate.questionUid}`,
    };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: hash('third, distinct C decision'),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    };
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SOL_ADJUDICATION_EVIDENCE_MISSING'));
  } finally {
    cleanup(fixture);
  }
});

test('candidate digest cannot disagree with a valid Sol direct adjudication', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    const solEvidenceRef = `sol-adjudication-evidence:${candidate.questionUid}`;
    const solDecisionHash = semanticDigestOf(candidate);
    candidate.crossConceptKeys = [];
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'SOL_DIRECT_ADJUDICATION', evidenceRef: solEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [{
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: hash('third C decision'),
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    }]);
    fixture.files.solAdjudication = fixture.writeJsonl('sol-adjudication.jsonl', [{
      ...candidate,
      crossConceptKeys: ['CC_TEST'],
      inputBundleSha: hash('Sol source and solution input'),
      evidenceRef: solEvidenceRef,
      decisionHash: solDecisionHash,
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [],
      forbiddenInputRefs: [],
    }]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'FINAL_DECISION_DIGEST_MISMATCH'));
  } finally {
    cleanup(fixture);
  }
});

test('missing source content hash is rejected with a precise code', () => {
  const fixture = makeFixture();
  try {
    delete fixture.candidateRows[0].contentHash;
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'CONTENT_HASH_MISSING'));
  } finally {
    cleanup(fixture);
  }
});

test('stale current archive bytes and stale worker tuple hashes are rejected', () => {
  const fixture = makeFixture();
  try {
    fixture.workerBRows[0].sourceFingerprint = hash('stale pre-repair fingerprint');
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const source = fixture.sourceRows[0];
    const firstIdentity = `${source.sourceArchiveFile}#${source.sourceOrdinal}`;
    const candidate = fixture.candidateRows[0];
    const workerA = fixture.workerARows[0];
    const workerB = fixture.workerBRows[0];
    const staleRelativePath = 'fixture/stale.js';
    const stalePath = path.join(fixture.files.archiveRoot, staleRelativePath);
    fs.writeFileSync(stalePath, '/* bytes changed after inventory */\n');
    source.sourceArchiveFile = staleRelativePath;
    candidate.sourceIdentity = `${staleRelativePath}#${source.sourceOrdinal}`;
    workerA.sourceIdentity = candidate.sourceIdentity;
    workerB.sourceIdentity = candidate.sourceIdentity;
    fixture.files.source = fixture.writeJson('source.json', { rows: fixture.sourceRows });
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    assert.notEqual(firstIdentity, candidate.sourceIdentity);

    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SOURCE_FILE_HASH_STALE'));
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_B_SOURCEFINGERPRINT_STALE'));
  } finally {
    cleanup(fixture);
  }
});

test('unregistered CrossConcept key is rejected', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[0].crossConceptKeys = ['CC_NOT_REGISTERED'];
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'CROSS_CONCEPT_NOT_REGISTERED'));
  } finally {
    cleanup(fixture);
  }
});

test('same-stage evidence leakage is rejected', () => {
  const fixture = makeFixture();
  try {
    fixture.workerARows[0].inputEvidenceRefs = [fixture.workerBRows[0].evidenceRef];
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SAME_STAGE_FORBIDDEN_INPUT_LEAKAGE'));
  } finally {
    cleanup(fixture);
  }
});

test('C conflict review cannot see A or B verdict evidence', () => {
  const fixture = makeFixture({ conflictAt: 0 });
  try {
    const candidate = fixture.candidateRows[0];
    const cEvidenceRef = `worker-c-evidence:${candidate.questionUid}`;
    candidate.conflictResolution = { status: 'RESOLVED', provenance: 'LUNA_2_OF_3_CONSENSUS', evidenceRef: cEvidenceRef };
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const cRow = {
      ...candidate,
      inputBundleSha: hash('worker C input'),
      evidenceRef: cEvidenceRef,
      decisionHash: fixture.workerARows[0].decisionHash,
      reviewStatus: 'COMPLETE',
      disposition: 'CLASSIFIED',
      inputEvidenceRefs: [fixture.workerARows[0].evidenceRef],
      forbiddenInputRefs: [],
    };
    fixture.files.workerC = fixture.writeJsonl('worker-c.jsonl', [cRow]);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SAME_STAGE_FORBIDDEN_INPUT_LEAKAGE'));
  } finally {
    cleanup(fixture);
  }
});

test('unknown raw review status must be normalized before final validation', () => {
  const fixture = makeFixture();
  try {
    fixture.workerBRows[0].reviewStatus = 'REVIEWED_WITH_LEGACY_LABEL';
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'WORKER_B_REVIEW_STATUS_INVALID'));
  } finally {
    cleanup(fixture);
  }
});

test('HOLD requires a reason and unresolved candidates cannot enter the final file', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[0].disposition = 'HOLD';
    fixture.candidateRows[0].holdReason = '';
    fixture.candidateRows[1].disposition = 'UNRESOLVED';
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'HOLD_REASON_MISSING'));
    assert.ok(result.report.failures.some((failure) => failure.code === 'UNRESOLVED_CANDIDATE_IN_FINAL'));
  } finally {
    cleanup(fixture);
  }
});

test('ACTIVE keys cannot be mislabeled as candidate-only', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[0].taxonomyDisposition = 'NEW_CANONICAL_CANDIDATE';
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'ACTIVE_KEY_MISLABELED_CANDIDATE'));
  } finally {
    cleanup(fixture);
  }
});

test('candidate-only L3/L4 keys require an explicit promotion taxonomy and disposition', () => {
  const fixture = makeFixture();
  try {
    Object.assign(fixture.candidateRows[0], {
      problemTypeKey: 'PT_H1_CANDIDATE',
      templateKey: 'TPL_H1_CANDIDATE',
      ownerPack: 'H1_CANDIDATE',
      taxonomyDisposition: 'NEW_CANONICAL_CANDIDATE',
    });
    fixture.workerARows[0].decisionHash = semanticDigestOf(fixture.candidateRows[0]);
    fixture.workerBRows[0].decisionHash = fixture.workerARows[0].decisionHash;
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const noRegistry = runFixture(fixture);
    assert.equal(noRegistry.status, 1);
    assert.ok(noRegistry.report.failures.some((failure) => failure.code === 'CANDIDATE_TAXONOMY_REQUIRED'));

    const candidateTaxonomy = fixture.writeJson('candidate-taxonomy.json', {
      status: 'PROMOTION_CANDIDATE',
      problemTypes: [{ problemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
      templates: [{ templateKey: 'TPL_H1_CANDIDATE', parentProblemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
      bindings: [{ curriculum: '2022', standardUnitKey: 'UNIT_TEST', subUnitKey: 'SUBUNIT_TEST', problemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
    });
    fixture.candidateRows[0].taxonomyDisposition = 'ACTIVE';
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const wrongDisposition = runFixture(fixture, { candidateTaxonomy });
    assert.equal(wrongDisposition.status, 1);
    assert.ok(wrongDisposition.report.failures.some((failure) => failure.code === 'CANDIDATE_TAXONOMY_DISPOSITION_REQUIRED'), JSON.stringify(wrongDisposition.report.failures, null, 2));

    fixture.candidateRows[0].taxonomyDisposition = 'NEW_CANONICAL_CANDIDATE';
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const explicitDisposition = runFixture(fixture, { candidateTaxonomy });
    assert.equal(explicitDisposition.status, 0, JSON.stringify(explicitDisposition.report.failures, null, 2));
    assert.equal(explicitDisposition.report.counts.candidateOnlyKeys, 2);
  } finally {
    cleanup(fixture);
  }
});

test('all candidate taxonomy records are isolated from ACTIVE and have valid ownership and parents', () => {
  const fixture = makeFixture();
  try {
    const candidateTaxonomy = fixture.writeJson('candidate-taxonomy-unused-invalid.json', {
      status: 'PROMOTION_CANDIDATE',
      problemTypes: [
        { problemTypeKey: 'PT_TEST', ownerPack: 'PACK_TEST', status: 'ACTIVE' },
        { problemTypeKey: 'PT_UNUSED_CANDIDATE', ownerPack: 'PACK_TEST', status: 'NEW_CANONICAL_CANDIDATE' },
      ],
      templates: [
        { templateKey: 'TPL_UNUSED_CANDIDATE', parentProblemTypeKey: 'PT_NOT_REGISTERED', ownerPack: 'PACK_TEST', status: 'NEW_CANONICAL_CANDIDATE' },
      ],
      bindings: [],
    });
    const result = runFixture(fixture, { candidateTaxonomy });
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'CANDIDATE_TAXONOMY_KEY_COLLIDES_ACTIVE'));
    assert.ok(result.report.failures.some((failure) => failure.code === 'CANDIDATE_TAXONOMY_TEMPLATE_PARENT_INVALID'));
  } finally {
    cleanup(fixture);
  }
});

test('candidate taxonomy bindings must be an array when the optional taxonomy is supplied', () => {
  const fixture = makeFixture();
  try {
    const candidateTaxonomy = fixture.writeJson('candidate-taxonomy-invalid-bindings.json', {
      status: 'PROMOTION_CANDIDATE',
      problemTypes: [],
      templates: [],
      bindings: {},
    });
    const result = runFixture(fixture, { candidateTaxonomy });
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'CANDIDATE_TAXONOMY_SCHEMA_INVALID'));
  } finally {
    cleanup(fixture);
  }
});

test('reviewInputs leakage cannot be hidden by an earlier empty inputEvidenceRefs alias', () => {
  const fixture = makeFixture();
  try {
    fixture.workerARows[0].inputEvidenceRefs = [];
    fixture.workerARows[0].reviewInputs = [fixture.workerBRows[0].evidenceRef];
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SAME_STAGE_FORBIDDEN_INPUT_LEAKAGE'));
  } finally {
    cleanup(fixture);
  }
});

test('source ordinal must be a positive one-based question number', () => {
  const fixture = makeFixture();
  try {
    const bad = 'fixture/exam.js#-1';
    fixture.sourceRows[0].sourceOrdinal = -1;
    fixture.sourceRows[0].sourceIdentity = bad;
    fixture.candidateRows[0].sourceIdentity = bad;
    fixture.workerARows[0].sourceIdentity = bad;
    fixture.workerBRows[0].sourceIdentity = bad;
    fixture.files.source = fixture.writeJson('source.json', { rows: fixture.sourceRows });
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    assert.ok(result.report.failures.some((failure) => failure.code === 'SOURCE_ORDINAL_INVALID'));
  } finally {
    cleanup(fixture);
  }
});

test('identity, hash, and owner aliases cannot conceal conflicting values', () => {
  const fixture = makeFixture();
  try {
    fixture.candidateRows[0].sourceId = 'fixture/wrong.js#1';
    fixture.candidateRows[0].sourceHash = hash('wrong fingerprint');
    fixture.candidateRows[0].taxonomyOwnerPack = 'PACK_OTHER';
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    const result = runFixture(fixture);
    assert.equal(result.status, 1);
    const codes = new Set(result.report.failures.map((failure) => failure.code));
    assert.ok(codes.has('SOURCE_IDENTITY_ALIAS_CONFLICT'));
    assert.ok(codes.has('SOURCE_FINGERPRINT_ALIAS_CONFLICT'));
    assert.ok(codes.has('OWNER_PACK_ALIAS_CONFLICT'));
  } finally {
    cleanup(fixture);
  }
});

test('candidate-only binding and item require explicit curriculum and L2 location', () => {
  const fixture = makeFixture();
  try {
    Object.assign(fixture.candidateRows[0], {
      problemTypeKey: 'PT_H1_CANDIDATE',
      templateKey: 'TPL_H1_CANDIDATE',
      ownerPack: 'H1_CANDIDATE',
      taxonomyDisposition: 'NEW_CANONICAL_CANDIDATE',
    });
    delete fixture.candidateRows[0].curriculum;
    delete fixture.candidateRows[0].standardUnitKey;
    delete fixture.candidateRows[0].subUnitKey;
    fixture.workerARows[0].decisionHash = semanticDigestOf(fixture.candidateRows[0]);
    fixture.workerBRows[0].decisionHash = fixture.workerARows[0].decisionHash;
    fixture.files.candidate = fixture.writeJsonl('candidate.jsonl', fixture.candidateRows);
    fixture.files.workerA = fixture.writeJsonl('worker-a.jsonl', fixture.workerARows);
    fixture.files.workerB = fixture.writeJsonl('worker-b.jsonl', fixture.workerBRows);
    const candidateTaxonomy = fixture.writeJson('candidate-taxonomy-location-missing.json', {
      status: 'PROMOTION_CANDIDATE',
      problemTypes: [{ problemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
      templates: [{ templateKey: 'TPL_H1_CANDIDATE', parentProblemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
      bindings: [{ problemTypeKey: 'PT_H1_CANDIDATE', ownerPack: 'H1_CANDIDATE', status: 'NEW_CANONICAL_CANDIDATE' }],
    });
    const result = runFixture(fixture, { candidateTaxonomy });
    assert.equal(result.status, 1);
    const codes = new Set(result.report.failures.map((failure) => failure.code));
    assert.ok(codes.has('CANDIDATE_TAXONOMY_BINDING_LOCATION_INVALID'));
    assert.ok(codes.has('L2_L3_LOCATION_MISSING'));
  } finally {
    cleanup(fixture);
  }
});