#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(TOOL_DIR, '..', '..');
const EXPORT_SCHEMA = 'APMATH_SOURCE_JSON_EXPORT_MANIFEST_V1';
const UID_SCHEMA = 'APMATH_SOURCE_UID_OCCURRENCE_INDEX_V1';
const SYNC_SCHEMA = 'APMATH_QUESTION_BANK_SYNC_POINTER_V1';
const RELATION_SCHEMA = 'APMATH_SOURCE_QUESTION_RELATION_ANNOTATIONS_V1';
const PENDING_SNAPSHOT_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function safeRelativePath(value, label) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.startsWith('/') || /^[A-Za-z]:/.test(value)) {
    throw new Error(`${label}_INVALID_PATH`);
  }
  const normalized = path.posix.normalize(value);
  if (normalized !== value || normalized === '.' || normalized === '..' || normalized.startsWith('../')) throw new Error(`${label}_PATH_TRAVERSAL`);
  return normalized;
}

function isWithin(parent, child) {
  const relative = path.relative(path.resolve(parent), path.resolve(child));
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

function listFiles(root, prefix = '') {
  const result = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const absolute = path.join(root, entry.name);
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isSymbolicLink()) throw new Error(`EXPORT_SYMLINK_NOT_ALLOWED:${relative}`);
    if (entry.isDirectory()) result.push(...listFiles(absolute, relative));
    else if (entry.isFile()) result.push({ absolute, relative: relative.split(path.sep).join('/') });
    else throw new Error(`EXPORT_SPECIAL_FILE_NOT_ALLOWED:${relative}`);
  }
  return result;
}

function getPath(root, expression) {
  if (Array.isArray(root)) return undefined;
  if (!expression || (!Array.isArray(expression) && typeof expression !== 'string')) return undefined;
  const stripped = typeof expression === 'string' ? expression.replace(/^(?:window|globalThis|global)\./, '') : expression;
  const parts = Array.isArray(stripped) ? stripped.map(value => `${value}`) : stripped.match(/[^.[\]]+|\[(?:"([^"]+)"|'([^']+)'|(\d+))\]/g)?.map(part => {
    const bracket = part.match(/^\[(?:"([^"]+)"|'([^']+)'|(\d+))\]$/);
    return bracket ? (bracket[1] ?? bracket[2] ?? bracket[3]) : part;
  }) ?? [];
  let value = root;
  for (const part of parts) {
    if (value == null) return undefined;
    value = value[part];
  }
  return value;
}

function canonicalUid(meta) {
  const candidates = [
    meta?.canonicalUid,
    meta?.questionUid,
    meta?.uid,
    meta?.identity?.questionUid,
    meta?.identity?.uid,
    meta?.identityMapRecord?.questionUid,
    meta?.identityRecord?.questionUid,
    meta?.canonicalIdentity?.questionUid,
    meta?.canonicalMetadata?.questionUid,
  ];
  return candidates.find(value => typeof value === 'string' && value.trim()) ?? null;
}

function uidsForOccurrence(meta) {
  const entries = [];
  if (typeof meta?.questionUid === 'string' && meta.questionUid.trim()) {
    entries.push({ questionUid: meta.questionUid, identitySource: meta.identitySource });
  }
  for (const declared of meta?.sourceDeclaredUids ?? []) {
    if (typeof declared?.value !== 'string' || !declared.value.trim()) continue;
    if (entries.some(entry => entry.questionUid === declared.value)) continue;
    entries.push({ questionUid: declared.value, identitySource: `SOURCE_QUESTION_UID_FIELD:${declared.field}` });
  }
  for (const declared of meta?.generatedMetadataDeclaredUids ?? []) {
    if (typeof declared?.value !== 'string' || !declared.value.trim()) continue;
    if (entries.some(entry => entry.questionUid === declared.value)) continue;
    entries.push({ questionUid: declared.value, identitySource: `GENERATED_METADATA_SIDECAR_FIELD:${declared.field}` });
  }
  return entries.filter(entry => typeof entry.identitySource === 'string' && entry.identitySource);
}

function keyForOccurrence(sourcePath, ordinal, meta) {
  const explicit = [meta?.sourceKey, meta?.identity?.sourceKey, meta?.identityMapRecord?.sourceKey]
    .find(value => typeof value === 'string' && value.trim());
  return explicit ?? `${sourcePath}#${ordinal}`;
}

function fullRefKey(ref, includeIdentity = false) {
  return JSON.stringify([
    ref.sourceKey,
    ref.sourcePath,
    ref.sourceOrdinal,
    ref.jsonPath,
    ref.questionArrayPath,
    ...(includeIdentity ? [ref.identitySource] : []),
  ]);
}

function occurrenceRef(ref) {
  if (!ref || typeof ref !== 'object' || Array.isArray(ref)) return null;
  return {
    sourceKey: ref.sourceKey,
    sourcePath: ref.sourcePath,
    sourceOrdinal: ref.sourceOrdinal,
    jsonPath: ref.jsonPath,
    questionArrayPath: ref.questionArrayPath,
    identitySource: ref.identitySource,
  };
}

function sourceQuestionArray(envelope) {
  const direct = getPath(envelope.sourceGlobals, envelope.source?.questionArrayPath);
  if (Array.isArray(direct)) return direct;
  const location = envelope.source?.questionArrayLocation;
  const alternate = getPath(envelope.sourceGlobals, location);
  if (Array.isArray(alternate)) return alternate;
  throw new Error(`SOURCE_QUESTION_ARRAY_MISSING:${envelope.source?.path ?? 'unknown'}`);
}

function normalizeSourcePath(value) {
  return `${value ?? ''}`.replaceAll('\\', '/').replace(/^archive\/exams\//, '').replace(/^archive\//, '').replace(/^\/+/, '');
}

function presentFields(record, keys) {
  if (!record || typeof record !== 'object') return [];
  return keys.map(key => record[key]).filter(value => value !== null && value !== undefined && `${value}`.trim()).map(value => `${value}`);
}

function buildRelationAnnotations(sources) {
  const originals = sources.filter(source => source.row.kind === 'archive-exam' && source.row.family === 'original'
    || normalizeSourcePath(source.row.sourcePath).startsWith('original/'));
  const relationships = [];
  for (const source of sources) {
    const isGenerated = source.row.kind === 'generated';
    const isSimilar = source.row.family === 'similar';
    if (!isGenerated && !isSimilar) continue;
    if (!Array.isArray(source.envelope.questionMetadata)) continue;
    const questions = sourceQuestionArray(source.envelope);
    for (let index = 0; index < source.envelope.questionMetadata.length; index += 1) {
      const ordinal = index + 1;
      const meta = source.envelope.questionMetadata[index] ?? {};
      const question = questions[index] ?? {};
      const sidecarAssociation = meta.generatedMetadataSidecarAssociation;
      const matchedSidecarStatus = sidecarAssociation?.status === 'MATCH'
        || (typeof sidecarAssociation?.status === 'string' && sidecarAssociation.status.startsWith('MATCHED_'));
      const sidecarRecord = isGenerated && matchedSidecarStatus && sidecarAssociation.record && typeof sidecarAssociation.record === 'object'
        ? sidecarAssociation.record
        : null;
      const relationEvidence = [sidecarRecord, question, meta].filter(Boolean);
      const sourcePaths = relationEvidence.flatMap(value => presentFields(value, ['sourceArchiveFile', 'sourceExamPath', 'parentSourceArchiveFile', 'parentExamPath', 'originalSourceArchiveFile']));
      const sourceQids = relationEvidence.flatMap(value => presentFields(value, ['sourceQid', 'parentSourceQid', 'originalQid', 'originalSourceQid']));
      const sourceExamUids = relationEvidence.flatMap(value => presentFields(value, ['sourceExamUid', 'parentSourceExamUid', 'originalExamUid']));
      const sourcePathValues = [...new Set(sourcePaths.map(normalizeSourcePath).filter(Boolean))];
      const qidValues = [...new Set(sourceQids.map(value => `${value}`.trim()).filter(Boolean))];
      const base = {
        sourceKey: keyForOccurrence(source.row.sourcePath, ordinal, meta),
        sourcePath: source.row.sourcePath,
        sourceFamily: source.row.family,
        sourceOrdinal: ordinal,
        sourceUid: canonicalUid(meta),
        relationKind: isGenerated ? 'generated_variant_of' : 'similar_variant_of',
        declaredSourceExamUid: sourceExamUids.length === 1 ? sourceExamUids[0] : null,
        declaredSourceQid: qidValues.length === 1 ? qidValues[0] : null,
        declaredSourcePath: sourcePathValues.length === 1 ? sourcePathValues[0] : null,
      };
      const matchCandidates = [];
      if (sourcePathValues.length === 1 && qidValues.length === 1 && sourceExamUids.length <= 1) {
        for (const original of originals) {
          if (normalizeSourcePath(original.row.sourcePath) !== sourcePathValues[0]) continue;
          const originalQuestions = sourceQuestionArray(original.envelope);
          const originalMetadata = original.envelope.questionMetadata ?? [];
          for (let originalIndex = 0; originalIndex < originalQuestions.length; originalIndex += 1) {
            const originalQuestion = originalQuestions[originalIndex] ?? {};
            const originalMeta = originalMetadata[originalIndex] ?? {};
            const qidCandidates = [originalQuestion.id, originalQuestion.qid, originalMeta.sourceQuestionNo, originalMeta.identity?.sourceQuestionNo]
              .filter(value => value !== null && value !== undefined).map(value => `${value}`);
            if (!qidCandidates.includes(qidValues[0])) continue;
            matchCandidates.push({
              sourceKey: keyForOccurrence(original.row.sourcePath, originalIndex + 1, originalMeta),
              sourcePath: original.row.sourcePath,
              sourceOrdinal: originalIndex + 1,
              questionUid: canonicalUid(originalMeta),
            });
          }
        }
      }
      const uniqueMatches = new Map(matchCandidates.map(match => [match.sourceKey, match]));
      const matches = [...uniqueMatches.values()];
      if (matches.length === 1 && (matches[0].questionUid || matches[0].sourceKey)) {
        relationships.push({ ...base, status: 'LINKED', parent: matches[0], resolutionEvidence: ['sourceArchiveFile', 'sourceQid', 'unique_source_occurrence'] });
      } else {
        const reason = sourcePaths.length + sourceQids.length + sourceExamUids.length === 0 ? 'PARENT_SOURCE_RELATION_METADATA_MISSING'
          : sourcePathValues.length !== 1 ? 'SOURCE_EXAM_PATH_MISSING_OR_AMBIGUOUS'
          : qidValues.length !== 1 ? 'SOURCE_QID_MISSING_OR_AMBIGUOUS'
            : sourceExamUids.length > 1 ? 'SOURCE_EXAM_UID_CONFLICT'
              : matches.length === 0 ? 'SOURCE_OCCURRENCE_NOT_FOUND'
                : 'SOURCE_OCCURRENCE_AMBIGUOUS';
        relationships.push({ ...base, status: 'UNRESOLVED', parent: null, annotation: { reason, candidateCount: matches.length } });
      }
    }
  }
  const coverageByFamily = Object.fromEntries([...new Set(relationships.map(row => row.sourceFamily))].sort().map(family => {
    const rows = relationships.filter(row => row.sourceFamily === family);
    return [family, {
      occurrenceCount: rows.length,
      linkedCount: rows.filter(row => row.status === 'LINKED').length,
      unresolvedCount: rows.filter(row => row.status === 'UNRESOLVED').length,
    }];
  }));
  return {
    schemaVersion: RELATION_SCHEMA,
    sourceRevision: sources[0]?.envelope.source?.sourceRevision ?? null,
    sourcePolicy: 'Annotation only. No occurrence is removed or made unavailable by resolution status.',
    relationshipCount: relationships.length,
    linkedCount: relationships.filter(row => row.status === 'LINKED').length,
    unresolvedCount: relationships.filter(row => row.status === 'UNRESOLVED').length,
    coverageByFamily,
    relationships,
  };
}

export function validateExportTree(exportDir) {
  const root = path.resolve(exportDir);
  const manifestPath = path.join(root, 'manifest.json');
  const uidIndexPath = path.join(root, 'uid-index.json');
  if (!fs.statSync(root).isDirectory()) throw new Error('EXPORT_ROOT_NOT_DIRECTORY');
  if (!fs.existsSync(manifestPath) || !fs.existsSync(uidIndexPath)) throw new Error('EXPORT_INDEX_FILES_MISSING');
  const manifest = readJson(manifestPath);
  const uidIndex = readJson(uidIndexPath);
  if (manifest.schemaVersion !== EXPORT_SCHEMA || manifest.status !== 'COMPLETE' || !Array.isArray(manifest.sourceFiles)) throw new Error('EXPORT_MANIFEST_SCHEMA_INVALID');
  if (uidIndex.schemaVersion !== UID_SCHEMA || !uidIndex.byUid || typeof uidIndex.byUid !== 'object' || Array.isArray(uidIndex.byUid)) throw new Error('EXPORT_UID_INDEX_SCHEMA_INVALID');
  if (manifest.sourceRevision !== uidIndex.sourceRevision) throw new Error('EXPORT_SOURCE_REVISION_MISMATCH');
  if (!manifest.sourceScope || !manifest.counts || !Array.isArray(manifest.failures) || manifest.failures.length) throw new Error('EXPORT_MANIFEST_COMPLETENESS_FIELDS_INVALID');

  const allFiles = listFiles(root);
  const fileSet = new Set(allFiles.map(file => file.relative));
  const declared = new Map();
  const sourcePaths = new Set();
  const sources = [];
  const expectedByUid = new Map();
  const expectedUnresolved = new Map();
  let totalOccurrences = 0;
  for (const row of manifest.sourceFiles) {
    const outputPath = safeRelativePath(row.outputPath, 'SOURCE_OUTPUT');
    if (declared.has(outputPath)) throw new Error(`EXPORT_DUPLICATE_OUTPUT_PATH:${outputPath}`);
    if (sourcePaths.has(row.sourcePath)) throw new Error(`EXPORT_DUPLICATE_SOURCE_PATH:${row.sourcePath}`);
    sourcePaths.add(row.sourcePath);
    declared.set(outputPath, row);
    if (!fileSet.has(outputPath)) throw new Error(`EXPORT_SOURCE_OUTPUT_MISSING:${outputPath}`);
    const bytes = fs.readFileSync(path.join(root, outputPath));
    if (sha256(bytes) !== row.outputSha256 || bytes.length !== row.outputByteLength) throw new Error(`EXPORT_SOURCE_OUTPUT_HASH_MISMATCH:${outputPath}`);
    const envelope = JSON.parse(bytes.toString('utf8'));
    if (envelope.schemaVersion !== 'APMATH_SOURCE_QUESTION_JSON_V1') throw new Error(`EXPORT_ENVELOPE_SCHEMA_INVALID:${outputPath}`);
    if (envelope.source?.path !== row.sourcePath || envelope.source?.family !== row.family || envelope.source?.kind !== row.kind) throw new Error(`EXPORT_ENVELOPE_SOURCE_MISMATCH:${outputPath}`);
    if (envelope.source?.sourceSha256 !== row.sourceSha256 || envelope.source?.sourceGitBlobSha1 !== row.sourceGitBlobSha1 || envelope.source?.sourceByteLength !== row.sourceByteLength) throw new Error(`EXPORT_ENVELOPE_SOURCE_HASH_MISMATCH:${outputPath}`);
    if (!/^[a-f0-9]{64}$/i.test(row.sourceSha256 ?? '') || !/^[a-f0-9]{40}$/i.test(row.sourceGitBlobSha1 ?? '') || !/^[a-f0-9]{64}$/i.test(row.outputSha256 ?? '')) throw new Error(`EXPORT_SOURCE_HASH_FORMAT_INVALID:${outputPath}`);
    if (!Number.isInteger(row.sourceByteLength) || row.sourceByteLength < 0) throw new Error(`EXPORT_SOURCE_BYTE_LENGTH_INVALID:${outputPath}`);
    if (envelope.source?.questionCount !== row.questionCount || envelope.source?.questionArrayLocation !== row.questionArrayLocation || JSON.stringify(envelope.source?.questionArrayPath) !== JSON.stringify(row.questionArrayPath)) throw new Error(`EXPORT_ENVELOPE_SOURCE_COUNT_OR_ARRAY_PATH_MISMATCH:${outputPath}`);
    if (envelope.source?.sourceRevision !== manifest.sourceRevision) throw new Error(`EXPORT_ENVELOPE_SOURCE_REVISION_MISMATCH:${outputPath}`);
    const questionMetadata = envelope.questionMetadata;
    if (!Array.isArray(questionMetadata) || questionMetadata.length !== row.questionCount) throw new Error(`EXPORT_QUESTION_METADATA_COUNT_MISMATCH:${outputPath}`);
    const questions = sourceQuestionArray(envelope);
    if (questions.length !== row.questionCount) throw new Error(`EXPORT_QUESTION_ARRAY_COUNT_MISMATCH:${outputPath}`);
    const source = { row, envelope, questions };
    sources.push(source);
    for (let index = 0; index < questionMetadata.length; index += 1) {
      totalOccurrences += 1;
      const ordinal = index + 1;
      const meta = questionMetadata[index] ?? {};
      if (meta.sourcePath !== row.sourcePath || meta.sourceOrdinal !== ordinal || meta.sourceKey !== `${row.sourcePath}#${ordinal}`) throw new Error(`EXPORT_QUESTION_METADATA_IDENTITY_MISMATCH:${outputPath}#${ordinal}`);
      const sourceKey = keyForOccurrence(row.sourcePath, ordinal, meta);
      const ref = {
        sourceKey,
        sourcePath: row.sourcePath,
        sourceOrdinal: ordinal,
        jsonPath: meta.jsonPath ?? `${envelope.source.questionArrayPath}[${index}]`,
        questionArrayPath: envelope.source.questionArrayPath,
      };
      const entries = uidsForOccurrence(meta);
      if (!entries.length) {
        expectedUnresolved.set(sourceKey, { ...ref, reason: meta.identityResolutionStatus ?? 'NO_CANONICAL_OR_EXPLICIT_UID' });
      } else {
        for (const entry of entries) {
          if (!expectedByUid.has(entry.questionUid)) expectedByUid.set(entry.questionUid, []);
          expectedByUid.get(entry.questionUid).push({ ...ref, identitySource: entry.identitySource });
        }
      }
    }
  }
  for (const file of allFiles) {
    if (!file.relative.endsWith('.json')) throw new Error(`EXPORT_NON_JSON_FILE:${file.relative}`);
    try { JSON.parse(fs.readFileSync(file.absolute, 'utf8')); } catch (error) { throw new Error(`EXPORT_JSON_PARSE_ERROR:${file.relative}:${error.message}`); }
    if (file.relative !== 'manifest.json' && file.relative !== 'uid-index.json' && !declared.has(file.relative)) throw new Error(`EXPORT_UNDECLARED_JSON_FILE:${file.relative}`);
  }
  if (declared.size !== manifest.sourceFiles.length) throw new Error('EXPORT_SOURCE_DECLARATION_COUNT_MISMATCH');

  const indexedUids = new Set(Object.keys(uidIndex.byUid));
  const expectedUids = new Set(expectedByUid.keys());
  if (indexedUids.size !== expectedUids.size || [...expectedUids].some(uid => !indexedUids.has(uid))) throw new Error('EXPORT_UID_INDEX_UID_SET_MISMATCH');
  for (const [uid, expected] of expectedByUid) {
    const actual = uidIndex.byUid[uid];
    if (!Array.isArray(actual)) throw new Error(`EXPORT_UID_INDEX_OCCURRENCES_MISSING:${uid}`);
    const actualRefs = actual.map(occurrenceRef).filter(Boolean);
    const expectedKeys = expected.map(ref => fullRefKey(ref, true)).sort();
    const actualKeys = actualRefs.map(ref => fullRefKey(ref, true)).sort();
    if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) throw new Error(`EXPORT_UID_INDEX_OCCURRENCES_MISMATCH:${uid}`);
  }
  const unresolved = Array.isArray(uidIndex.unresolvedSourceKeys) ? uidIndex.unresolvedSourceKeys : [];
  const unresolvedKeys = unresolved.map(row => typeof row === 'string' ? JSON.stringify([row]) : JSON.stringify([row.sourceKey, row.sourcePath, row.sourceOrdinal, row.jsonPath, row.questionArrayPath, row.reason])).sort();
  const expectedUnresolvedKeys = [...expectedUnresolved.values()].map(row => JSON.stringify([row.sourceKey, row.sourcePath, row.sourceOrdinal, row.jsonPath, row.questionArrayPath, row.reason])).sort();
  if (JSON.stringify(unresolvedKeys) !== JSON.stringify(expectedUnresolvedKeys)) throw new Error('EXPORT_UID_INDEX_UNRESOLVED_SOURCE_KEYS_MISMATCH');

  const expectedUidOccurrenceCount = [...expectedByUid.values()].reduce((sum, rows) => sum + rows.length, 0);
  if (uidIndex.uidOccurrenceCount !== expectedUidOccurrenceCount || uidIndex.uniqueQuestionUidCount !== expectedByUid.size) throw new Error('EXPORT_UID_INDEX_OCCURRENCE_COUNT_MISMATCH');
  const countFields = manifest.counts ?? {};
  const discoveredTotal = manifest.sourceScope.examJavascriptFilesDiscovered
    + manifest.sourceScope.generatedLiteShardJavascriptFilesDiscovered;
  if (manifest.sourceScope.totalSourceJavascriptFilesDiscovered !== discoveredTotal || manifest.sourceFiles.length !== discoveredTotal) throw new Error('EXPORT_MANIFEST_SOURCE_SCOPE_COUNT_MISMATCH');
  if (countFields.exportedFiles !== manifest.sourceFiles.length || countFields.failedFiles !== 0 || countFields.exportedQuestionsTotal !== totalOccurrences) throw new Error('EXPORT_MANIFEST_EXPORTED_COUNT_MISMATCH');
  const byKindTotal = Object.values(countFields.exportedQuestionsByKind ?? {}).reduce((sum, value) => sum + (Number.isInteger(value) ? value : 0), 0);
  if (byKindTotal !== totalOccurrences) throw new Error('EXPORT_MANIFEST_QUESTION_COUNT_BY_KIND_MISMATCH');

  return { manifest, uidIndex, sources, allFiles, totalOccurrences, uidCount: expectedByUid.size, unresolvedOccurrenceCount: expectedUnresolved.size };
}

function contentDigest(files, root) {
  const records = files.map(file => {
    const bytes = fs.readFileSync(path.join(root, file));
    return `${file}\0${sha256(bytes)}\0${bytes.length}`;
  }).sort();
  return sha256(Buffer.from(records.join('\n'), 'utf8'));
}

function readCurrent(outDir) {
  const currentPath = path.join(outDir, 'current.json');
  if (!fs.existsSync(currentPath)) return null;
  try {
    const current = readJson(currentPath);
    if (current.schemaVersion !== SYNC_SCHEMA || !/^[a-f0-9]{64}$/.test(current.snapshotId ?? '') || current.snapshotPath !== `snapshots/${current.snapshotId}`) return null;
    const snapshotPath = path.resolve(outDir, current.snapshotPath);
    if (!isWithin(path.join(outDir, 'snapshots'), snapshotPath) || !fs.existsSync(snapshotPath)) return null;
    const files = listFiles(snapshotPath).map(file => file.relative);
    if (!files.length || contentDigest(files, snapshotPath) !== current.contentSha256) return null;
    const manifestPath = path.join(snapshotPath, 'manifest.json');
    if (!fs.existsSync(manifestPath) || sha256(fs.readFileSync(manifestPath)) !== current.manifestSha256) return null;
    return { ...current, absoluteSnapshotPath: snapshotPath };
  } catch {
    return null;
  }
}

export function verifyCurrentSnapshot(outDir) {
  return readCurrent(path.resolve(outDir));
}

function writeStatus(statusFile, status) {
  if (!statusFile) return;
  const temporary = `${statusFile}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  try {
    writeJson(temporary, status);
    fs.renameSync(temporary, statusFile);
  } catch (error) {
    try { fs.rmSync(temporary, { force: true }); } catch {}
    throw error;
  }
}

function copyTree(source, target) {
  fs.mkdirSync(target, { recursive: true });
  for (const file of listFiles(source)) {
    const destination = path.join(target, ...file.relative.split('/'));
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(file.absolute, destination, fs.constants.COPYFILE_EXCL);
  }
}

function currentPointerSnapshotId(outDir) {
  try {
    const pointer = readJson(path.join(outDir, 'current.json'));
    return pointer.schemaVersion === SYNC_SCHEMA && /^[a-f0-9]{64}$/.test(pointer.snapshotId ?? '') && pointer.snapshotPath === `snapshots/${pointer.snapshotId}`
      ? pointer.snapshotId
      : null;
  } catch {
    return null;
  }
}

function pruneSnapshots(outDir, keepIds, { removeSnapshot = fs.rmSync, nowMs = () => Date.now() } = {}) {
  const keep = new Set(keepIds.filter(Boolean));
  const activePointerId = currentPointerSnapshotId(outDir);
  if (activePointerId) keep.add(activePointerId);
  const warnings = [];
  const snapshotRoot = path.join(outDir, 'snapshots');
  if (!fs.existsSync(snapshotRoot)) return warnings;
  let entries;
  try { entries = fs.readdirSync(snapshotRoot, { withFileTypes: true }); }
  catch (error) { return [{ code: 'SNAPSHOT_PRUNE_SCAN_FAILED', path: snapshotRoot, message: error.message }]; }
  for (const entry of entries) {
    const absolute = path.join(snapshotRoot, entry.name);
    if (!entry.isDirectory()) continue;
    if (/^[a-f0-9]{64}$/.test(entry.name) && !keep.has(entry.name)) {
      try { removeSnapshot(absolute, { recursive: true, force: true }); }
      catch (error) { warnings.push({ code: 'OLD_SNAPSHOT_PRUNE_FAILED', path: entry.name, message: error.message }); }
      continue;
    }
    if (!entry.name.startsWith('.pending-')) continue;
    let ageMs = null;
    try { ageMs = Math.max(0, nowMs() - fs.statSync(absolute).mtimeMs); }
    catch (error) {
      warnings.push({ code: 'PENDING_SNAPSHOT_AGE_CHECK_FAILED', path: entry.name, message: error.message });
      continue;
    }
    if (ageMs < PENDING_SNAPSHOT_MAX_AGE_MS) {
      warnings.push({ code: 'PENDING_SNAPSHOT_RETAINED_RECENT', path: entry.name, ageMs });
      continue;
    }
    try { removeSnapshot(absolute, { recursive: true, force: true }); }
    catch (error) { warnings.push({ code: 'STALE_PENDING_SNAPSHOT_PRUNE_FAILED', path: entry.name, ageMs, message: error.message }); }
  }
  return warnings;
}

function addStatusWarning(status, warning) {
  status.warnings ??= [];
  if (!status.warnings.some(row => row.code === warning.code && row.path === warning.path)) status.warnings.push(warning);
}

function tryWriteStatus(statusFile, status, writeStatusRecord = writeStatus) {
  if (!statusFile) return;
  try { writeStatusRecord(statusFile, status); }
  catch (error) { addStatusWarning(status, { code: 'STATUS_FILE_WRITE_FAILED', path: statusFile, message: error.message }); }
}

function pointerView(pointer) {
  if (!pointer) return null;
  const { absoluteSnapshotPath, ...view } = pointer;
  return view;
}

export function runSyncQuestionJson({
  repoRoot = REPO_ROOT,
  outDir = path.resolve(REPO_ROOT, '..', '..', 'outputs', 'apmath-question-bank'),
  exporterPath = path.join(REPO_ROOT, 'archive', 'tools', 'export-question-json.mjs'),
  statusFile = null,
  tempRoot = null,
  spawn = spawnSync,
  removeSnapshot = fs.rmSync,
  writeStatusRecord = writeStatus,
  now = () => new Date(),
  nowMs = () => Date.now(),
} = {}) {
  const root = path.resolve(repoRoot);
  let destination = path.resolve(outDir);
  if (isWithin(root, destination)) throw new Error('SYNC_OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
  fs.mkdirSync(destination, { recursive: true });
  const realRoot = fs.realpathSync(root);
  destination = fs.realpathSync(destination);
  if (isWithin(realRoot, destination)) throw new Error('SYNC_OUTPUT_MUST_BE_OUTSIDE_REPOSITORY');
  const startedAt = now().toISOString();
  const existing = readCurrent(destination);
  const stagingRoot = path.resolve(tempRoot ?? path.dirname(destination));
  fs.mkdirSync(stagingRoot, { recursive: true });
  if (isWithin(realRoot, fs.realpathSync(stagingRoot))) throw new Error('SYNC_STAGING_MUST_BE_OUTSIDE_REPOSITORY');
  const temporaryBase = fs.mkdtempSync(path.join(stagingRoot, 'apmath-question-json-sync-'));
  const exportDir = path.join(temporaryBase, 'export');
  let status;
  let pointer = null;
  let changed = false;
  let activationCommitted = false;
  try {
    const result = spawn(process.execPath, [path.resolve(exporterPath), '--out-dir', exportDir], { cwd: root, encoding: 'utf8', windowsHide: true });
    if (result.error) throw new Error(`EXPORTER_SPAWN_FAILED:${result.error.message}`);
    if (result.status !== 0) throw new Error(`EXPORTER_FAILED:${result.status ?? 'signal'}:${(result.stderr || result.stdout || '').trim().slice(-4000)}`);
    const validated = validateExportTree(exportDir);
    const relationAnnotations = buildRelationAnnotations(validated.sources);
    writeJson(path.join(exportDir, 'relationship-annotations.json'), relationAnnotations);
    const finalFiles = listFiles(exportDir).map(file => file.relative);
    const snapshotHash = contentDigest(finalFiles, exportDir);
    const snapshotId = snapshotHash;
    const snapshotRelative = `snapshots/${snapshotId}`;
    const snapshotPath = path.join(destination, ...snapshotRelative.split('/'));
    fs.mkdirSync(path.join(destination, 'snapshots'), { recursive: true });
    if (fs.existsSync(snapshotPath)) {
      const existingFiles = listFiles(snapshotPath).map(file => file.relative);
      if (JSON.stringify(existingFiles.sort()) !== JSON.stringify([...finalFiles].sort()) || contentDigest(existingFiles, snapshotPath) !== snapshotHash) {
        throw new Error('SYNC_SNAPSHOT_HASH_COLLISION');
      }
    } else {
      const pendingPath = path.join(destination, 'snapshots', `.pending-${snapshotId}-${process.pid}-${crypto.randomBytes(4).toString('hex')}`);
      try {
        copyTree(exportDir, pendingPath);
        const copiedFiles = listFiles(pendingPath).map(file => file.relative);
        if (contentDigest(copiedFiles, pendingPath) !== snapshotHash || JSON.stringify(copiedFiles.sort()) !== JSON.stringify([...finalFiles].sort())) throw new Error('SYNC_STAGED_SNAPSHOT_HASH_MISMATCH');
        fs.renameSync(pendingPath, snapshotPath);
      } catch (error) {
        const failure = error instanceof Error ? error : new Error(`${error}`);
        try { fs.rmSync(pendingPath, { recursive: true, force: true }); }
        catch (cleanupError) { failure.pendingCleanupWarning = { code: 'FAILED_PENDING_STAGE_CLEANUP', path: pendingPath, message: cleanupError.message }; }
        throw failure;
      }
    }
    changed = existing?.snapshotId !== snapshotId;
    pointer = {
      schemaVersion: SYNC_SCHEMA,
      status: changed ? 'SYNCED' : 'NO_CHANGE',
      snapshotId,
      snapshotPath: snapshotRelative,
      contentSha256: snapshotHash,
      sourceRevision: validated.manifest.sourceRevision,
      sourceWorkingTreeStatus: validated.manifest.sourceWorkingTreeStatus,
      manifestSha256: sha256(fs.readFileSync(path.join(exportDir, 'manifest.json'))),
      counts: {
        sourceFileCount: validated.sources.length,
        questionOccurrenceCount: validated.totalOccurrences,
        uidKeyCount: validated.uidCount,
        canonicalQuestionUidCount: validated.uidIndex.canonicalQuestionUidCount ?? null,
        supplementalUidKeyCount: validated.uidIndex.supplementalUidKeyCount ?? null,
        unresolvedOccurrenceCount: validated.unresolvedOccurrenceCount,
        linkedParentCount: relationAnnotations.linkedCount,
        unresolvedParentCount: relationAnnotations.unresolvedCount,
      },
      generatedAt: now().toISOString(),
    };
    if (changed) {
      const pointerPath = path.join(destination, 'current.json');
      const temporaryPointer = `${pointerPath}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
      try {
        writeJson(temporaryPointer, pointer);
        fs.renameSync(temporaryPointer, pointerPath);
      } catch (error) {
        const failure = error instanceof Error ? error : new Error(`${error}`);
        try { fs.rmSync(temporaryPointer, { force: true }); }
        catch (cleanupError) { failure.pointerCleanupWarning = { code: 'FAILED_POINTER_TEMP_CLEANUP', path: temporaryPointer, message: cleanupError.message }; }
        throw failure;
      }
    }
    activationCommitted = true;
    const pruneWarnings = pruneSnapshots(destination, [snapshotId, existing?.snapshotId], { removeSnapshot, nowMs });
    status = { ...(changed ? pointer : pointerView(existing)), status: changed ? 'SYNCED' : 'NO_CHANGE', activationCommitted: true, startedAt, finishedAt: now().toISOString(), lastGoodSnapshot: snapshotId, lastGoodAvailable: true, warnings: pruneWarnings };
    tryWriteStatus(statusFile, status, writeStatusRecord);
    return status;
  } catch (error) {
    const active = readCurrent(destination);
    if (active && pointer?.snapshotId === active.snapshotId) activationCommitted = true;
    if (activationCommitted) {
      const committedPointer = pointerView(active) ?? pointerView(pointer) ?? pointerView(existing);
      status = {
        ...(committedPointer ?? {}),
        schemaVersion: SYNC_SCHEMA,
        status: active ? (changed ? 'SYNCED' : 'NO_CHANGE') : 'FAILED_AFTER_ACTIVATION',
        activationCommitted: true,
        startedAt,
        finishedAt: now().toISOString(),
        error: error?.message ?? `${error}`,
        lastGoodSnapshot: active?.snapshotId ?? null,
        lastGoodAvailable: Boolean(active),
        warnings: [{ code: 'POST_ACTIVATION_ERROR', message: error?.message ?? `${error}` }],
      };
      tryWriteStatus(statusFile, status, writeStatusRecord);
      if (active) return status;
      throw Object.assign(error instanceof Error ? error : new Error(`${error}`), { syncStatus: status });
    }
    const lastGood = readCurrent(destination) ?? existing;
    status = {
      schemaVersion: 'APMATH_QUESTION_BANK_SYNC_STATUS_V1',
      status: 'FAILED',
      activationCommitted: false,
      startedAt,
      finishedAt: now().toISOString(),
      error: error?.message ?? `${error}`,
      lastGoodSnapshot: lastGood?.snapshotId ?? null,
      lastGoodSnapshotPath: lastGood?.snapshotPath ?? null,
      lastGoodAvailable: Boolean(lastGood),
      lastGoodUnavailableReason: lastGood ? null : 'NO_VALID_LAST_GOOD_SNAPSHOT_RESTORED',
      warnings: [error?.pendingCleanupWarning, error?.pointerCleanupWarning].filter(Boolean),
    };
    tryWriteStatus(statusFile, status, writeStatusRecord);
    throw Object.assign(error instanceof Error ? error : new Error(`${error}`), { syncStatus: status });
  } finally {
    try { fs.rmSync(temporaryBase, { recursive: true, force: true }); }
    catch (error) {
      const warning = { code: 'TEMPORARY_EXPORT_CLEANUP_FAILED', path: temporaryBase, message: error.message };
      if (status) {
        addStatusWarning(status, warning);
        tryWriteStatus(statusFile, status, writeStatusRecord);
      } else {
        process.stderr.write(`${JSON.stringify(warning)}\n`);
      }
    }
  }
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const name = argv[index];
    if (!name.startsWith('--')) throw new Error(`UNEXPECTED_ARGUMENT:${name}`);
    const value = argv[index + 1];
    if (name === '--help') return { help: true };
    if (!value || value.startsWith('--')) throw new Error(`MISSING_VALUE:${name}`);
    const key = ({ '--repo-root': 'repoRoot', '--out-dir': 'outDir', '--exporter': 'exporterPath', '--status-file': 'statusFile', '--temp-root': 'tempRoot', '--verify-current': 'verifyCurrent' })[name];
    if (!key) throw new Error(`UNKNOWN_ARGUMENT:${name}`);
    args[key] = value;
    index += 1;
  }
  return args;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write('Usage: node archive/tools/sync-question-json.mjs [--repo-root DIR] [--out-dir DIR] [--exporter FILE] [--status-file FILE] [--temp-root DIR]\n       node archive/tools/sync-question-json.mjs --verify-current DIR\n');
    } else if (args.verifyCurrent) {
      const current = verifyCurrentSnapshot(args.verifyCurrent);
      if (!current) throw new Error('NO_VALID_CURRENT_SNAPSHOT');
      process.stdout.write(`${JSON.stringify({ status: 'VALID_CURRENT_SNAPSHOT', snapshotId: current.snapshotId, contentSha256: current.contentSha256 }, null, 2)}\n`);
    } else {
      const result = runSyncQuestionJson(args);
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    }
  } catch (error) {
    process.stderr.write(`${JSON.stringify(error?.syncStatus ?? { status: 'FAILED', error: error?.message ?? `${error}` }, null, 2)}\n`);
    process.exitCode = 1;
  }
}
