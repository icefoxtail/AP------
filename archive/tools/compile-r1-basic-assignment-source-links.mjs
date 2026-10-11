#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import core from '../archive2-core.js';
import sourceBank from '../archive2-source.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const getArg = name => {
  const index = args.indexOf(name);
  return index < 0 ? '' : args[index + 1] || '';
};
const manifestPath = getArg('--manifest');
const receiptPath = getArg('--receipt');
const checkOnly = args.includes('--check');
if (!manifestPath || !receiptPath) throw new Error('REQUIRED_ARGUMENT: --manifest and --receipt');

const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const readBytes = relative => fs.readFileSync(path.resolve(root, relative));
const readJson = relative => JSON.parse(readBytes(relative).toString('utf8').replace(/^\uFEFF/, ''));
const writeJson = (relative, value) => fs.writeFileSync(path.resolve(root, relative), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const ensure = (condition, code, detail = '') => { if (!condition) throw new Error(detail ? `${code}:${detail}` : code); };
const toRepoPath = value => {
  const absolute = path.resolve(value);
  const relative = path.relative(root, absolute);
  ensure(relative !== '..' && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative), 'PATH_OUTSIDE_REPOSITORY', value);
  return relative.split(path.sep).join('/');
};
const manifest = readJson(manifestPath);
ensure(manifest.schemaVersion === 'JS_ARCHIVE_R1_BASIC_ASSIGNMENT_SOURCE_LINK_COMPILATION_V1', 'MANIFEST_SCHEMA_REQUIRED');
ensure(Array.isArray(manifest.targets) && manifest.targets.length > 0, 'MANIFEST_TARGETS_REQUIRED');

const master = readJson('docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json');
const parents = core.taxonomyPaths(master);
const policy = readJson('archive/data/archive2-canonical-projection-policy.json');
const sourcePath = 'archive/data/basic-scope-source-links.json';
const sourceLinks = readJson(sourcePath);
const priorSourceLinksSha256 = sha256(readBytes(sourcePath));
ensure(sourceLinks.schemaVersion === 'archive2-reviewed-basic-source-links-v1' && sourceLinks.status === 'REVIEWED_SCOPE_LINKS', 'SOURCE_LINK_AUTHORITY_INVALID');
const allowed = new Set((policy.gradeCourseAllowlist || []).map(row => [row.grade, row.curriculumKey, row.courseKey].join('\0')));
const additions = [];
const targetUids = new Set();
const targetSources = new Set();

for (const target of manifest.targets) {
  ensure(typeof target.examUid === 'string' && target.examUid.length > 0, 'TARGET_EXAM_UID_REQUIRED');
  const supplementPath = target.supplementPath;
  const eventPath = target.completionEventPath;
  const supplementBytes = readBytes(supplementPath);
  const supplement = JSON.parse(supplementBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const eventBytes = readBytes(eventPath);
  const event = JSON.parse(eventBytes.toString('utf8').replace(/^\uFEFF/, ''));
  ensure(event.schemaVersion === 'JS_ARCHIVE_CODEX_STABLE_STAGE_COMPLETE_V1' && event.status === 'STAGE_COMPLETE', 'R1_COMPLETION_EVENT_REQUIRED', target.examUid);
  ensure(event.executionLine === 'CODEX' && event.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && event.stage === 'R1' && event.examUid === target.examUid, 'R1_COMPLETION_EVENT_IDENTITY_MISMATCH', target.examUid);
  ensure(Array.isArray(event.physicalSnapshot?.issues) && event.physicalSnapshot.issues.length === 0, 'R1_PHYSICAL_SNAPSHOT_ISSUES', target.examUid);
  const evidencePath = toRepoPath(event.physicalSnapshot?.evidence?.path || '');
  const evidenceBytes = readBytes(evidencePath);
  ensure(sha256(evidenceBytes) === event.physicalSnapshot.evidence.sha256, 'R1_EVIDENCE_SHA_MISMATCH', target.examUid);
  const rawReportPath = toRepoPath(event.rawReport?.path || '');
  const rawReportBytes = readBytes(rawReportPath);
  ensure(sha256(rawReportBytes) === event.rawReport.sha256, 'R1_RAW_REPORT_SHA_MISMATCH', target.examUid);
  const report = JSON.parse(rawReportBytes.toString('utf8').replace(/^\uFEFF/, ''));
  ensure(report.ok === true && report.disposition === 'PASS' && report.stage === 'R1' && report.examUid === target.examUid, 'R1_V2_CODEX_PASS_REQUIRED', target.examUid);
  ensure(report.qualityContractVersion === 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006' && report.executionLine === 'CODEX' && report.artifactContract?.active === true && report.artifactContract?.disposition === 'PASS' && report.artifactContract?.issues?.length === 0, 'R1_ACTIVE_ARTIFACT_CONTRACT_REQUIRED', target.examUid);
  const supplementSha = sha256(supplementBytes);
  const extraProofs = event.extraProofs || [];
  ensure(extraProofs.some(row => {
    try { return toRepoPath(row.path) === supplementPath && row.sha256 === supplementSha; } catch { return false; }
  }), 'R1_SUPPLEMENT_NOT_BOUND_BY_COMPLETION_EVENT', target.examUid);

  const productionPath = toRepoPath(event.physicalSnapshot?.source?.path || '');
  const productionBytes = readBytes(productionPath);
  ensure(sha256(productionBytes) === event.physicalSnapshot.source.sha256, 'CURRENT_PRODUCTION_RAW_SHA_MISMATCH', target.examUid);
  const blob = crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${productionBytes.length}\0`), productionBytes])).digest('hex');
  ensure(blob === event.physicalSnapshot.source.rawBufferGitBlobSha1 && blob === event.artifactSha, 'CURRENT_PRODUCTION_BLOB_SHA_MISMATCH', target.examUid);
  const vmContext = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vmContext.globalThis = vmContext;
  vm.createContext(vmContext);
  vm.runInContext(productionBytes.toString('utf8'), vmContext, { filename: productionPath, timeout: 5000 });
  const bank = vmContext.window.questionBank || vmContext.window.questions || vmContext.questionBank || vmContext.questions;
  ensure(Array.isArray(bank), 'SOURCE_BANK_REQUIRED', target.examUid);
  ensure(supplement.examUid === target.examUid, 'SUPPLEMENT_EXAM_UID_MISMATCH', target.examUid);
  const rows = supplement.rows;
  ensure(Array.isArray(rows) && rows.length === bank.length, 'SUPPLEMENT_QID_DENOMINATOR_MISMATCH', target.examUid);
  ensure(!supplement.unsupportedQids || supplement.unsupportedQids.length === 0, 'SUPPLEMENT_HAS_UNSUPPORTED_QIDS', target.examUid);

  const sourceFile = core.normalizeFile(productionPath.replace(/^archive[\\/]+exams[\\/]+/, ''));
  const gradeEvidence = core.Canonical.resolveSourceGrade({ registeredGrade: '고2', sourceFile, identitySourceFile: sourceFile });
  ensure(gradeEvidence.status === 'VALID' && gradeEvidence.grade === '고2', 'SOURCE_GRADE_NOT_CONFIRMED', target.examUid);
  const masterByUnit = new Map();
  const assignmentsByUid = new Set();
  for (const [index, row] of rows.entries()) {
    const ordinal = Number(row.sourceOrdinal ?? row.qid);
    ensure(Number(row.qid) === index + 1 && ordinal === index + 1, 'SUPPLEMENT_ORDINAL_PARITY', `${target.examUid}#${index + 1}`);
    const q = bank[index];
    const assignment = row.basicAssignment || row.basicAssignmentEvidence || row.assignment?.basicAssignment || row.assignment || row.sourceParentLinkCandidate || row;
    ensure(assignment && ['curriculumKey', 'courseKey', 'L1', 'L2'].every(key => typeof assignment[key] === 'string' && assignment[key].trim()), 'BASIC_ASSIGNMENT_FIELDS_REQUIRED', `${target.examUid}#${ordinal}`);
    const expectedCourse = core.normalizeCourseIdentity(q.standardCourse || q.course || '');
    ensure(core.normalizeCourseIdentity(assignment.courseKey) === expectedCourse, 'ASSIGNMENT_COURSE_SOURCE_PARITY', `${target.examUid}#${ordinal}`);
    const unitKey = q.standardUnitKey || '';
    ensure(unitKey, 'SOURCE_STANDARD_UNIT_REQUIRED', `${target.examUid}#${ordinal}`);
    const authority = row.courseAndUnitAuthority || row.courseAndUnitAuthorityEvidence || row.sourceUnit || row.assignment?.courseAndUnitAuthority || row;
    const recordedUnitKey = authority.sourceStandardUnitKey || authority.standardUnitKey || assignment.standardUnitKey;
    if (recordedUnitKey) ensure(recordedUnitKey === unitKey, 'ASSIGNMENT_UNIT_SOURCE_PARITY', `${target.examUid}#${ordinal}`);
    const parentKey = JSON.stringify([assignment.curriculumKey, assignment.courseKey, assignment.L1, assignment.L2]);
    const canonicalMatches = parents.filter(parent => parent.curriculumKey === assignment.curriculumKey && core.normalizeCourseIdentity(parent.courseKey) === core.normalizeCourseIdentity(assignment.courseKey) && parent.L1 === assignment.L1 && parent.L2 === assignment.L2);
    ensure(canonicalMatches.length > 0, 'ACTIVE_CANONICAL_PARENT_REQUIRED', `${target.examUid}#${ordinal}`);
    ensure(allowed.has([gradeEvidence.grade, assignment.curriculumKey, assignment.courseKey].join('\0')), 'ACTIVE_GRADE_COURSE_ALLOWLIST_REQUIRED', `${target.examUid}#${ordinal}`);
    const validated = row.canonicalValidation || row.canonicalAssignment || row.canonicalValidationEvidence;
    if (validated) ensure(validated.ok === true && Array.isArray(validated.reasons) && validated.reasons.length === 0, 'SUPPLEMENT_CANONICAL_VALIDATION_FAILED', `${target.examUid}#${ordinal}`);
    const parentAuthority = row.parentAuthority || {};
    if (parentAuthority.uniqueParentTupleCount !== undefined) ensure(Number(parentAuthority.uniqueParentTupleCount) === 1, 'SUPPLEMENT_PARENT_NOT_UNIQUE', `${target.examUid}#${ordinal}`);
    const sourceBodyFingerprint = sha256(Buffer.from(JSON.stringify({
      content: q.content ?? null,
      choices: Array.isArray(q.choices) ? q.choices : null,
      image: q.image ?? null,
    }), 'utf8'));
    const suppliedFingerprint = row.assignmentFingerprint || assignment.assignmentFingerprint;
    if (suppliedFingerprint) ensure(suppliedFingerprint === sourceBodyFingerprint, 'SUPPLEMENT_BODY_FINGERPRINT_MISMATCH', `${target.examUid}#${ordinal}`);
    const fullSourceFingerprint = await sourceBank.fingerprint(q);
    const uid = `qid_v1_${sha256(Buffer.from(`${sourceFile}#${ordinal}`, 'utf8'))}`;
    const sourceKey = `${sourceFile}#${ordinal}`;
    ensure(!targetSources.has(sourceKey) && !assignmentsByUid.has(uid), 'DUPLICATE_TARGET_ASSIGNMENT', sourceKey);
    targetSources.add(sourceKey);
    assignmentsByUid.add(uid);
    const reason = `R1-approved basic parent assignment; examUid=${target.examUid}; qid=${ordinal}; supplement=${supplementPath}@${supplementSha}; completionEvent=${eventPath}@${sha256(eventBytes)}; assignment=${parentKey}`;
    additions.push({
      grade: gradeEvidence.grade,
      curriculumKey: assignment.curriculumKey,
      courseKey: assignment.courseKey,
      sourceFile,
      sourceOrdinal: ordinal,
      sourceFingerprint: fullSourceFingerprint,
      L1: assignment.L1,
      L2: assignment.L2,
      reason,
      sourceBodyFingerprint,
    });
  }
}

const nextRecords = [...sourceLinks.records];
const existingBySource = new Map(nextRecords.map(row => [`${row.sourceFile}#${Number(row.sourceOrdinal)}`, row]));
for (const row of additions) {
  const key = `${row.sourceFile}#${row.sourceOrdinal}`;
  const prior = existingBySource.get(key);
  if (prior) {
    ensure(prior.grade === row.grade && prior.curriculumKey === row.curriculumKey && core.normalizeCourseIdentity(prior.courseKey) === core.normalizeCourseIdentity(row.courseKey) && prior.L1 === row.L1 && prior.L2 === row.L2 && prior.sourceBodyFingerprint === row.sourceBodyFingerprint, 'EXISTING_SOURCE_LINK_CONFLICT', key);
    continue;
  }
  nextRecords.push(row);
  existingBySource.set(key, row);
}
const nextSourceLinks = { ...sourceLinks, records: nextRecords };
const outputBytes = Buffer.from(`${JSON.stringify(nextSourceLinks, null, 2)}\n`, 'utf8');
if (checkOnly) {
  ensure(readBytes(sourcePath).equals(outputBytes), 'SOURCE_LINKS_STALE');
} else {
  fs.writeFileSync(path.resolve(root, sourcePath), outputBytes);
}

const receipt = {
  schemaVersion: 'JS_ARCHIVE_R1_BASIC_ASSIGNMENT_SOURCE_LINK_COMPILATION_RECEIPT_V1',
  qualityContractVersion: 'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',
  executionLine: 'CODEX',
  status: 'PASS',
  sourceLinksPath: sourcePath,
  sourceLinksSha256: sha256(outputBytes),
  priorSourceLinksSha256,
  targetCount: manifest.targets.length,
  targetAssignmentCount: additions.length,
  targetSourceKeys: [...targetSources].sort(),
  completionEventProofs: manifest.targets.map(target => ({ path: target.completionEventPath, sha256: sha256(readBytes(target.completionEventPath)) })),
  generatedAt: new Date().toISOString(),
};
writeJson(receiptPath, receipt);
console.log(JSON.stringify({ ok: true, status: 'PASS', targetCount: receipt.targetCount, targetAssignmentCount: receipt.targetAssignmentCount, sourceLinksSha256: receipt.sourceLinksSha256, sourceLinksPath: sourcePath }, null, 2));
