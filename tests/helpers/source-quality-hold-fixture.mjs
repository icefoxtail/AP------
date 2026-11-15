import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Only invented content is used here; production source/evidence is never copied into fixtures.
export function seedSourceQualityHoldFixture(root) {
  const sha = value => crypto.createHash('sha256').update(value).digest('hex');
  const blob = value => crypto.createHash('sha1').update(`blob ${Buffer.byteLength(value)}\0`).update(value).digest('hex');
  const write = (file, value) => {
    const bytes = typeof value === 'string' || Buffer.isBuffer(value) ? value : JSON.stringify(value) + '\n';
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), bytes);
    return { path: file, sha256: sha(bytes) };
  };
  const sourceArchiveFile = 'original/middle/m1/2final/00_source_quality_hold_fixture.js';
  const questionUid = 'qid_v1_' + sha(sourceArchiveFile + '#1');
  const imagePath = 'archive/assets/images/source-quality-hold-fixture/q1.png';
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a3ioAAAAASUVORK5CYII=', 'base64');
  write(imagePath, image);
  const question = { id: 1, questionUid, content: 'Invented source-quality fixture', image: imagePath.slice('archive/'.length) };
  const source = 'window.questionBank=' + JSON.stringify([question]) + ';\n';
  write('archive/exams/' + sourceArchiveFile, source);
  const sourceFingerprint = sha(JSON.stringify({ content: question.content, choices: null, answer: null, solution: null, image: question.image }));
  const pendingRootEvidence = write('docs/operations/source-quality-hold-fixture/pending.json', {
    items: [{ sourceOrdinal: 1, disposition: 'EVIDENCE_PENDING', sourceMetadataChangeAllowed: false }],
  });
  const independentEvidence = write('docs/operations/source-quality-hold-fixture/independent.json', {
    summary: { difficultyEvidencePendingOrdinals: [1] },
  });
  const additionalEvidence = write('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/source-quality-fixture.parent-labels.json', { status: 'UNCHANGED' });
  const originalReceipt = write('archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/source-quality-fixture.json', {
    schemaVersion: 'archive-reviewed-exam-meta-registration-v2', metadataRegistrationStatus: 'REGISTERED',
    sourceArchiveFile, sourceBlobSha1: blob(source), sourceRawSha256: sha(source), expectedQuestionCount: 1,
    totalQuestions: 1, appliedRecords: [{ questionUid, sourceOrdinal: 1, sourceFingerprint }],
    approval: { evidenceRefs: [pendingRootEvidence, independentEvidence, additionalEvidence] },
  });
  const unresolvedEvidence = write('docs/operations/source-quality-hold-fixture/unresolved.json', {
    questionUid, ordinal: 1, sourcePath: 'archive/exams/' + sourceArchiveFile, sourceBlob: blob(source),
    sourceSha256: sha(source), status: 'SEMANTIC_UNJUDGED_SOURCE_CONDITION_NOT_ESTABLISHED',
    imageEvidence: { repositoryPath: imagePath, sha256: sha(image), bytes: image.length },
    storedValuesAreNotNewSemanticApproval: true,
  });
  const row = { holdId: 'synthetic-source-quality-hold-fixture', status: 'HOLD', reasonCode: 'SOURCE_CONDITION_NOT_ESTABLISHED',
    questionUid, sourceArchiveFile, sourceOrdinal: 1, expectedQuestionCount: 1,
    sourceBlobSha1: blob(source), sourceSha256: sha(source), image: { path: imagePath, sha256: sha(image), bytes: image.length },
    originalReceipt, pendingRootEvidence, independentEvidence, unresolvedEvidence,
    releasePolicy: 'EXPLICIT_SOURCE_EVIDENCE_RESOLUTION_REQUIRED' };
  const ledgerPath = 'archive/data/meta-foundation/source-quality-holds-v1.json';
  const ledger = { schemaVersion: 'archive-source-quality-holds-v1', status: 'ACTIVE', records: [row] };
  write(ledgerPath, ledger);
  write('archive/tools/source-quality-holds.mjs', fs.readFileSync(new URL('../../archive/tools/source-quality-holds.mjs', import.meta.url)));
  const identity = { records: [{ questionUid, sourceArchiveFile, sourceOrdinal: 1, status: 'VERIFIED', sourceFingerprint }] };
  return { root, questionUid, ledgerPath, ledger, row, identity, write, additionalEvidence };
}
