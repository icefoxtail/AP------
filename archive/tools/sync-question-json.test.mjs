import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { runSyncQuestionJson, verifyCurrentSnapshot } from './sync-question-json.mjs';

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function fixtureRows({ includeGenerated = true, includeSimilar = false, unresolvedParent = false, metaDebt = false, noSourceUid = false, sidecarUidConflict = false, explicitSimilarParent = false, unmatchedGeneratedSidecar = false } = {}) {
  const sourceRows = [{
    sourcePath: 'archive/exams/original/example-exam.js',
    outputPath: 'exams/original/example-exam.json',
    family: 'original',
    kind: 'archive-exam',
    sourceSha256: 'a'.repeat(64),
    sourceGitBlobSha1: 'b'.repeat(40),
    question: { id: 11, content: 'source body' },
    uid: noSourceUid ? null : 'qid-source-11',
  }];
  if (includeGenerated) sourceRows.push({
    sourcePath: 'archive/generated/lite/v1/shards/example.js',
    outputPath: 'generated/lite/v1/shards/example.json',
    family: 'generated-lite',
    kind: 'generated',
    sourceSha256: 'c'.repeat(64),
    sourceGitBlobSha1: 'd'.repeat(40),
    question: { id: 1, content: 'generated body' },
    uid: 'uid-generated-1',
    parentQid: unresolvedParent ? 999 : 11,
  });
  if (includeSimilar) sourceRows.push({
    sourcePath: 'archive/exams/similar/high/h1/example-similar.js',
    outputPath: 'exams/similar/high/h1/example-similar.json',
    family: 'similar',
    kind: 'archive-exam',
    sourceSha256: '1'.repeat(64),
    sourceGitBlobSha1: '2'.repeat(40),
    question: { id: 1, content: 'similar body', originalCategory: '다항식' },
    uid: 'uid-similar-1',
    ...(explicitSimilarParent ? { question: { id: 1, content: 'similar body', sourceArchiveFile: 'archive/exams/original/example-exam.js', sourceQid: 11 } } : {}),
  });

  const outputs = [];
  const byUid = {};
  let questionCount = 0;
  for (const row of sourceRows) {
    questionCount += 1;
    const ordinal = 1;
    const sourceKey = `${row.sourcePath}#${ordinal}`;
    const sourceMeta = {
      sourceKey,
      sourcePath: row.sourcePath,
      sourceOrdinal: ordinal,
      jsonPath: row.outputPath,
      sourceIdPresent: true,
      sourceId: row.question.id,
      identityResolutionStatus: row.uid ? 'RESOLVED' : 'UNRESOLVED',
      questionUid: row.uid,
      identitySource: row.uid ? 'question_identity_map' : 'UNRESOLVED_SOURCE_KEY',
      sourceDeclaredUids: [],
      sourceUidConflicts: [],
      currentSourceFingerprintStatus: metaDebt ? 'MISMATCH' : 'MATCH',
      identityMapRecord: { questionUid: row.uid, sourceArchiveFile: row.sourcePath, sourceOrdinal: ordinal },
      canonicalMetadataAssociationStatus: metaDebt ? 'UNRESOLVED' : 'MATCH',
      canonicalQuestionMetadataRecord: null,
    };
    if (row.kind === 'generated') {
      const sidecarRow = {
        generatedQuestionUid: row.uid,
        sourceKind: 'generated',
        sourceArchiveFile: 'archive/exams/original/example-exam.js',
        sourceExamUid: 'example-exam-uid',
        sourceQid: row.parentQid,
      };
      sourceMeta.generatedMetadataSidecarAssociation = { status: unmatchedGeneratedSidecar ? 'NO_SIDECAR_QUESTION_MATCH' : 'MATCHED_BY_SOURCE_ORDINAL', record: unmatchedGeneratedSidecar ? null : sidecarRow };
      sourceMeta.generatedMetadataDeclaredUids = sidecarUidConflict
        ? [{ field: 'generatedQuestionUid', value: 'uid-generated-sidecar' }]
        : [];
      sourceMeta.generatedMetadataUidConflicts = sidecarUidConflict ? ['generatedQuestionUid'] : [];
    }
    const envelope = {
      schemaVersion: 'APMATH_SOURCE_QUESTION_JSON_V1',
      source: {
        path: row.sourcePath,
        family: row.family,
        kind: row.kind,
        sourceRevision: 'source-revision-1',
        sourceGitBlobSha1: row.sourceGitBlobSha1,
        sourceSha256: row.sourceSha256,
        sourceByteLength: 10,
        questionArrayLocation: 'window.questionBank',
        questionArrayPath: ['window', 'questionBank'],
        questionCount: 1,
        workingTreeStatus: 'CLEAN',
      },
      examMetadata: null,
      examMetadataAuthority: null,
      sourceGlobals: { window: { questionBank: [row.question], examTitle: 'example' }, globals: {} },
      questionMetadata: [sourceMeta],
    };
    if (row.kind === 'generated') {
      envelope.generatedMetadataSidecar = { path: 'metadata/example.json', sourceGitBlobSha1: 'e'.repeat(40), sourceSha256: 'f'.repeat(64), payload: [sourceMeta.generatedMetadataSidecarAssociation.record] };
    }
    const bytes = Buffer.from(`${JSON.stringify(envelope, null, 2)}\n`, 'utf8');
    outputs.push({ ...row, outputBytes: bytes });
    if (row.uid) {
      byUid[row.uid] = [{
        sourceKey,
        sourcePath: row.sourcePath,
        sourceOrdinal: ordinal,
        jsonPath: row.outputPath,
        questionArrayPath: ['window', 'questionBank'],
        identitySource: sourceMeta.identitySource,
      }];
    }
    for (const declared of sourceMeta.generatedMetadataDeclaredUids ?? []) {
      byUid[declared.value] = [{
        sourceKey,
        sourcePath: row.sourcePath,
        sourceOrdinal: ordinal,
        jsonPath: row.outputPath,
        questionArrayPath: ['window', 'questionBank'],
        identitySource: `GENERATED_METADATA_SIDECAR_FIELD:${declared.field}`,
      }];
    }
  }
  const sourceFiles = outputs.map(row => ({
    sourcePath: row.sourcePath,
    family: row.family,
    kind: row.kind,
    outputPath: row.outputPath,
    sourceGitBlobSha1: row.sourceGitBlobSha1,
    sourceSha256: row.sourceSha256,
    sourceByteLength: 10,
    outputSha256: sha256(row.outputBytes),
    outputByteLength: row.outputBytes.length,
    questionCount: 1,
    questionArrayLocation: 'window.questionBank',
    questionArrayPath: ['window', 'questionBank'],
    topLevelMetadataStatus: 'MISSING',
    canonicalUidCount: 1,
    explicitSourceUidCount: 0,
    qCountStatus: 'MATCH',
    blankIdOrdinals: [],
    duplicateIdGroups: [],
    workingTreeStatus: 'CLEAN',
  }));
  const manifest = {
    schemaVersion: 'APMATH_SOURCE_JSON_EXPORT_MANIFEST_V1',
    status: 'COMPLETE',
    sourceRevision: 'source-revision-1',
    sourceWorkingTreeStatus: 'CLEAN',
    transformation: { schemaVersion: 'fixture' },
    sourceScope: {
      examJavascriptFilesDiscovered: sourceRows.filter(row => row.kind === 'archive-exam').length,
      generatedLiteShardJavascriptFilesDiscovered: sourceRows.filter(row => row.kind === 'generated').length,
      totalSourceJavascriptFilesDiscovered: sourceRows.length,
    },
    counts: {
      exportedFiles: sourceRows.length,
      failedFiles: 0,
      exportedQuestionsByKind: sourceRows.reduce((acc, row) => ({ ...acc, [row.kind === 'generated' ? 'generatedLite' : 'archiveExam']: (acc[row.kind === 'generated' ? 'generatedLite' : 'archiveExam'] ?? 0) + 1 }), {}),
      exportedQuestionsTotal: questionCount,
    },
    sourceDbMetadataMissingFiles: [],
    sourceDbQCountMismatches: [],
    sourceIdIssues: [],
    duplicateQuestionUidGroups: [],
    generatedConsumerCrossCheck: {},
    excludedScopes: [],
    inputAuthorities: [],
    sourceFiles,
    failures: [],
  };
  const uidIndex = {
    schemaVersion: 'APMATH_SOURCE_UID_OCCURRENCE_INDEX_V1',
    sourceRevision: 'source-revision-1',
    uniqueQuestionUidCount: Object.keys(byUid).length,
    uidOccurrenceCount: Object.values(byUid).reduce((sum, rows) => sum + rows.length, 0),
    byUid,
    unresolvedSourceKeys: sourceRows.filter(row => !row.uid).map(row => ({
      sourceKey: `${row.sourcePath}#1`,
      sourcePath: row.sourcePath,
      sourceOrdinal: 1,
      jsonPath: row.outputPath,
      questionArrayPath: ['window', 'questionBank'],
      reason: 'UNRESOLVED',
    })),
    explicitUidConflicts: [],
  };
  return { outputs, manifest, uidIndex };
}

function materializeExport(exportDir, fixture) {
  fs.mkdirSync(exportDir, { recursive: true });
  for (const row of fixture.outputs) {
    const filePath = path.join(exportDir, ...row.outputPath.split('/'));
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, row.outputBytes);
  }
  fs.writeFileSync(path.join(exportDir, 'manifest.json'), `${JSON.stringify(fixture.manifest, null, 2)}\n`);
  fs.writeFileSync(path.join(exportDir, 'uid-index.json'), `${JSON.stringify(fixture.uidIndex, null, 2)}\n`);
}

function tempRoot() {
  const outputRoot = path.resolve(process.cwd(), '..', '..', 'outputs');
  fs.mkdirSync(outputRoot, { recursive: true });
  return fs.mkdtempSync(path.join(outputRoot, '.question-json-sync-test-'));
}

function okSpawn(fixture) {
  return (_executable, args) => {
    materializeExport(args[2], fixture);
    return { status: 0, stdout: '', stderr: '' };
  };
}

test('publishes a complete occurrence snapshot and a conservative parent annotation index', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    const statusFile = path.join(temp, 'evidence', 'status.json');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows();
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), statusFile, tempRoot: temp, spawn: okSpawn(fixture) });
    const pointer = JSON.parse(fs.readFileSync(path.join(outDir, 'current.json'), 'utf8'));
    assert.equal(result.status, 'SYNCED');
    assert.equal(pointer.snapshotId, result.snapshotId);
    const snapshot = path.join(outDir, pointer.snapshotPath);
    const relation = JSON.parse(fs.readFileSync(path.join(snapshot, 'relationship-annotations.json'), 'utf8'));
    assert.equal(relation.relationshipCount, 1);
    assert.equal(relation.linkedCount, 1, JSON.stringify(relation, null, 2));
    assert.equal(relation.relationships[0].parent.questionUid, 'qid-source-11');
    assert.equal(JSON.parse(fs.readFileSync(statusFile, 'utf8')).lastGoodSnapshot, pointer.snapshotId);
    assert.equal(JSON.parse(fs.readFileSync(path.join(snapshot, 'uid-index.json'), 'utf8')).uidOccurrenceCount, 2);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('keeps similar variants in relation lookup and leaves missing parent provenance unresolved', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ includeSimilar: true });
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    const snapshot = path.join(outDir, result.snapshotPath);
    const relation = JSON.parse(fs.readFileSync(path.join(snapshot, 'relationship-annotations.json'), 'utf8'));
    const similarRelation = relation.relationships.find(row => row.sourceFamily === 'similar');
    assert.equal(relation.coverageByFamily.similar.occurrenceCount, 1);
    assert.equal(relation.coverageByFamily.similar.linkedCount, 0);
    assert.equal(relation.coverageByFamily.similar.unresolvedCount, 1);
    assert.equal(similarRelation.status, 'UNRESOLVED');
    assert.equal(similarRelation.annotation.reason, 'PARENT_SOURCE_RELATION_METADATA_MISSING');
    assert.equal(JSON.parse(fs.readFileSync(path.join(snapshot, 'uid-index.json'), 'utf8')).uidOccurrenceCount, 3);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('links a similar variant only when its explicit exam path and sourceQid resolve uniquely', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ includeSimilar: true, explicitSimilarParent: true });
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    const snapshot = path.join(outDir, result.snapshotPath);
    const relation = JSON.parse(fs.readFileSync(path.join(snapshot, 'relationship-annotations.json'), 'utf8'));
    const similarRelation = relation.relationships.find(row => row.sourceFamily === 'similar');
    assert.equal(similarRelation.status, 'LINKED');
    assert.equal(similarRelation.parent.questionUid, 'qid-source-11');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('does not use a positional sidecar row when the explicit association says unmatched', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ unmatchedGeneratedSidecar: true });
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    const snapshot = path.join(outDir, result.snapshotPath);
    const relation = JSON.parse(fs.readFileSync(path.join(snapshot, 'relationship-annotations.json'), 'utf8'));
    assert.equal(relation.linkedCount, 0);
    assert.equal(relation.unresolvedCount, 1);
    assert.equal(relation.relationships[0].annotation.reason, 'PARENT_SOURCE_RELATION_METADATA_MISSING');
    assert.equal(JSON.parse(fs.readFileSync(path.join(snapshot, 'uid-index.json'), 'utf8')).uidOccurrenceCount, 2);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('idempotent repeat and exporter failure preserve the exact last-good pointer', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    const statusFile = path.join(temp, 'evidence', 'status.json');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ metaDebt: true });
    const options = { repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), statusFile, tempRoot: temp, spawn: okSpawn(fixture) };
    const first = runSyncQuestionJson(options);
    const before = fs.readFileSync(path.join(outDir, 'current.json'));
    const second = runSyncQuestionJson(options);
    assert.equal(second.status, 'NO_CHANGE');
    assert.equal(second.snapshotId, first.snapshotId);
    assert.deepEqual(fs.readFileSync(path.join(outDir, 'current.json')), before);
    assert.throws(() => runSyncQuestionJson({ ...options, spawn: () => ({ status: 1, stdout: '', stderr: 'fixture export failure' }) }), /EXPORTER_FAILED/);
    assert.deepEqual(fs.readFileSync(path.join(outDir, 'current.json')), before);
    const failure = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    assert.equal(failure.status, 'FAILED');
    assert.equal(failure.lastGoodSnapshot, first.snapshotId);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('source deletion is reflected while unresolved parent links remain annotations and occurrences stay present', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const initial = fixtureRows();
    const options = { repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(initial) };
    const first = runSyncQuestionJson(options);
    const reduced = fixtureRows({ includeGenerated: false });
    const second = runSyncQuestionJson({ ...options, spawn: okSpawn(reduced) });
    assert.notEqual(first.snapshotId, second.snapshotId);
    assert.equal(second.counts.questionOccurrenceCount, 1);
    assert.equal(fs.existsSync(path.join(outDir, first.snapshotPath)), true, 'the previous last-good snapshot remains available');
    assert.equal(fs.existsSync(path.join(outDir, second.snapshotPath)), true, 'the current pointer target is never pruned');
    const secondSnapshot = path.join(outDir, second.snapshotPath);
    assert.equal(fs.existsSync(path.join(secondSnapshot, 'generated/lite/v1/shards/example.json')), false);

    const unresolved = fixtureRows({ unresolvedParent: true });
    const third = runSyncQuestionJson({ ...options, spawn: okSpawn(unresolved) });
    const thirdSnapshot = path.join(outDir, third.snapshotPath);
    const relation = JSON.parse(fs.readFileSync(path.join(thirdSnapshot, 'relationship-annotations.json'), 'utf8'));
    assert.equal(relation.unresolvedCount, 1);
    assert.equal(relation.relationships[0].status, 'UNRESOLVED');
    assert.equal(JSON.parse(fs.readFileSync(path.join(thirdSnapshot, 'uid-index.json'), 'utf8')).uidOccurrenceCount, 2);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('rejects output inside the repository before export starts', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    fs.mkdirSync(repoRoot, { recursive: true });
    assert.throws(() => runSyncQuestionJson({ repoRoot, outDir: path.join(repoRoot, 'outputs'), exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: () => { throw new Error('must not run'); } }), /SYNC_OUTPUT_MUST_BE_OUTSIDE_REPOSITORY/);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('keeps occurrences with no resolved UID under the sourcePath#ordinal key', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ includeGenerated: false, noSourceUid: true });
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    const snapshot = path.join(outDir, result.snapshotPath);
    const uidIndex = JSON.parse(fs.readFileSync(path.join(snapshot, 'uid-index.json'), 'utf8'));
    assert.equal(result.counts.questionOccurrenceCount, 1);
    assert.equal(result.counts.unresolvedOccurrenceCount, 1);
    assert.equal(uidIndex.unresolvedSourceKeys[0].sourceKey, 'archive/exams/original/example-exam.js#1');
    assert.equal(JSON.parse(fs.readFileSync(path.join(snapshot, 'exams/original/example-exam.json'), 'utf8')).questionMetadata.length, 1);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('indexes conflicting sidecar UIDs as separate source evidence without changing availability', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows({ sidecarUidConflict: true });
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    const snapshot = path.join(outDir, result.snapshotPath);
    const uidIndex = JSON.parse(fs.readFileSync(path.join(snapshot, 'uid-index.json'), 'utf8'));
    assert.equal(result.counts.questionOccurrenceCount, 2);
    assert.equal(uidIndex.byUid['uid-generated-sidecar'][0].identitySource, 'GENERATED_METADATA_SIDECAR_FIELD:generatedQuestionUid');
    assert.equal(JSON.parse(fs.readFileSync(path.join(snapshot, 'exams/original/example-exam.json'), 'utf8')).questionMetadata.length, 1);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('does not report a corrupted cached snapshot as last-good after the next export fails', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    const statusFile = path.join(temp, 'evidence', 'status.json');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows();
    const options = { repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), statusFile, tempRoot: temp, spawn: okSpawn(fixture) };
    const first = runSyncQuestionJson(options);
    const pointerBytes = fs.readFileSync(path.join(outDir, 'current.json'));
    const snapshot = path.join(outDir, first.snapshotPath);
    fs.appendFileSync(path.join(snapshot, 'uid-index.json'), 'corruption');
    assert.equal(verifyCurrentSnapshot(outDir), null);
    assert.throws(() => runSyncQuestionJson({ ...options, spawn: () => ({ status: 1, stdout: '', stderr: 'failed after restore' }) }), /EXPORTER_FAILED/);
    assert.deepEqual(fs.readFileSync(path.join(outDir, 'current.json')), pointerBytes);
    const failure = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    assert.equal(failure.lastGoodAvailable, false);
    assert.equal(failure.lastGoodUnavailableReason, 'NO_VALID_LAST_GOOD_SNAPSHOT_RESTORED');
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('manifest hash mismatch fails before pointer replacement and keeps the previous good snapshot', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    const statusFile = path.join(temp, 'evidence', 'status.json');
    fs.mkdirSync(repoRoot, { recursive: true });
    const valid = fixtureRows();
    const options = { repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), statusFile, tempRoot: temp, spawn: okSpawn(valid) };
    const first = runSyncQuestionJson(options);
    const pointerBytes = fs.readFileSync(path.join(outDir, 'current.json'));
    const invalid = fixtureRows();
    invalid.manifest.sourceFiles[0].outputSha256 = '0'.repeat(64);
    assert.throws(() => runSyncQuestionJson({ ...options, spawn: okSpawn(invalid) }), /EXPORT_SOURCE_OUTPUT_HASH_MISMATCH/);
    assert.deepEqual(fs.readFileSync(path.join(outDir, 'current.json')), pointerBytes);
    const failure = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    assert.equal(failure.status, 'FAILED');
    assert.equal(failure.lastGoodSnapshot, first.snapshotId);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('status file failure after pointer activation reports the active snapshot as successful with a warning', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    const statusPath = path.join(temp, 'evidence', 'status.json');
    fs.mkdirSync(repoRoot, { recursive: true });
    const fixture = fixtureRows();
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), statusFile: statusPath, tempRoot: temp, spawn: okSpawn(fixture), writeStatusRecord: () => { throw new Error('injected status write failure'); } });
    assert.equal(result.status, 'SYNCED');
    assert.equal(result.activationCommitted, true);
    assert.equal(result.lastGoodSnapshot, result.snapshotId);
    assert.ok(result.warnings.some(row => row.code === 'STATUS_FILE_WRITE_FAILED'));
    assert.equal(verifyCurrentSnapshot(outDir).snapshotId, result.snapshotId);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('snapshot prune failure is visible and does not remove or invalidate the current snapshot', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const initial = fixtureRows();
    const options = { repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(initial) };
    const first = runSyncQuestionJson(options);
    const reduced = fixtureRows({ includeGenerated: false });
    const second = runSyncQuestionJson({ ...options, spawn: okSpawn(reduced) });
    const changed = fixtureRows({ unresolvedParent: true });
    const third = runSyncQuestionJson({ ...options, spawn: okSpawn(changed), removeSnapshot: () => { throw new Error('injected snapshot prune failure'); } });
    assert.equal(third.status, 'SYNCED');
    assert.equal(third.activationCommitted, true);
    assert.ok(third.warnings.some(row => row.code === 'OLD_SNAPSHOT_PRUNE_FAILED'));
    assert.equal(fs.existsSync(path.join(outDir, first.snapshotPath)), true);
    assert.equal(fs.existsSync(path.join(outDir, second.snapshotPath)), true);
    assert.equal(verifyCurrentSnapshot(outDir).snapshotId, third.snapshotId);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('recent pending snapshots are retained with an orphan warning instead of being blindly removed', () => {
  const temp = tempRoot();
  try {
    const repoRoot = path.join(temp, 'repo');
    const outDir = path.join(temp, 'outputs', 'apmath-question-bank');
    fs.mkdirSync(repoRoot, { recursive: true });
    const pendingPath = path.join(outDir, 'snapshots', `.pending-${'a'.repeat(64)}-1234-deadbeef`);
    fs.mkdirSync(pendingPath, { recursive: true });
    const fixture = fixtureRows();
    const result = runSyncQuestionJson({ repoRoot, outDir, exporterPath: path.join(repoRoot, 'exporter.mjs'), tempRoot: temp, spawn: okSpawn(fixture) });
    assert.equal(fs.existsSync(pendingPath), true);
    assert.ok(result.warnings.some(row => row.code === 'PENDING_SNAPSHOT_RETAINED_RECENT'));
    assert.equal(verifyCurrentSnapshot(outDir).snapshotId, result.snapshotId);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
