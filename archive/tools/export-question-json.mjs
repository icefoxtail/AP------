#!/usr/bin/env node
// Export repository-owned question source into JSON artifacts.
// This read-only transformation never edits source, identity, metadata,
// Consumer, or approval authorities.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import {
  createQuestionIdentityResolver,
  normalizeIdentityReference
} from './intelligence/question-identity-contract.mjs';

export const EXPORT_SCHEMA_VERSION = 'APMATH_SOURCE_QUESTION_JSON_V1';
export const MANIFEST_SCHEMA_VERSION = 'APMATH_SOURCE_JSON_EXPORT_MANIFEST_V1';
export const UID_INDEX_SCHEMA_VERSION = 'APMATH_SOURCE_UID_OCCURRENCE_INDEX_V1';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '../..');
const archiveRoot = path.join(repoRoot, 'archive');
const EXAM_FAMILIES = ['original', 'similar', 'types', 'textbooks'];
const GENERATED_ROOT = path.join(archiveRoot, 'generated', 'lite', 'v1');
const IDENTITY_MAP_PATH = path.join(archiveRoot, 'data', 'question_identity_map.json');
const QUESTION_METADATA_PATH = path.join(archiveRoot, 'data', 'question_metadata.json');
const DB_PATH = path.join(archiveRoot, 'db.js');
const CONSUMER_ROOT = path.join(archiveRoot, 'data', 'generated-lite-consumer', 'v1');
const FIXTURES_ROOT = path.join(archiveRoot, 'exams', 'test-fixtures');
const HISTORICAL_GENERATED_ROOT = path.join(archiveRoot, '_generated');

const stableCompare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const slash = value => String(value).replaceAll('\\', '/');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const repoRelative = full => slash(path.relative(repoRoot, full));
const isPlainObject = value => {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const proto = Object.getPrototypeOf(value);
  if (proto === null) return true;
  const ctor = Object.getOwnPropertyDescriptor(proto, 'constructor')?.value;
  return typeof ctor === 'function' && ctor.name === 'Object' && Object.getPrototypeOf(proto) === null;
};
const formatPath = (parent, key) => {
  if (typeof key === 'number') return parent + '[' + key + ']';
  return /^[A-Za-z_$][\w$]*$/.test(String(key))
    ? parent + '.' + String(key)
    : parent + '[' + JSON.stringify(String(key)) + ']';
};

export class UnsupportedJsValueError extends Error {
  constructor(code, valuePath, detail) {
    super(code + ' at ' + valuePath + (detail ? ': ' + detail : ''));
    this.name = 'UnsupportedJsValueError';
    this.code = code;
    this.valuePath = valuePath;
    this.detail = detail || '';
  }
}

/**
 * Copy only values that JSON can represent without coercion or omission.
 * Cross-realm plain objects from node:vm are supported. Accessors, sparse
 * arrays, symbols, functions, undefined, non-finite numbers, BigInt, custom
 * prototypes and cycles fail closed with a path-specific reason.
 */
export function cloneJsonValue(value, valuePath = '$', active = new WeakSet()) {
  const type = typeof value;
  if (value === null || type === 'string' || type === 'boolean') return value;
  if (type === 'number') {
    if (!Number.isFinite(value)) throw new UnsupportedJsValueError('NON_FINITE_NUMBER', valuePath, String(value));
    if (Object.is(value, -0)) throw new UnsupportedJsValueError('NEGATIVE_ZERO', valuePath, '-0 is emitted as 0 by JSON.stringify');
    return value;
  }
  if (type === 'undefined') throw new UnsupportedJsValueError('UNDEFINED_VALUE', valuePath);
  if (type === 'function') throw new UnsupportedJsValueError('FUNCTION_VALUE', valuePath, value.name || 'anonymous');
  if (type === 'symbol') throw new UnsupportedJsValueError('SYMBOL_VALUE', valuePath, String(value));
  if (type === 'bigint') throw new UnsupportedJsValueError('BIGINT_VALUE', valuePath, value.toString());
  if (type !== 'object') throw new UnsupportedJsValueError('UNSUPPORTED_VALUE_TYPE', valuePath, type);
  if (active.has(value)) throw new UnsupportedJsValueError('CIRCULAR_REFERENCE', valuePath);
  active.add(value);
  try {
    if (Array.isArray(value)) {
      const arrayPrototype = Object.getPrototypeOf(value);
      const arrayConstructor = arrayPrototype
        ? Object.getOwnPropertyDescriptor(arrayPrototype, 'constructor')?.value
        : null;
      const objectPrototype = arrayPrototype ? Object.getPrototypeOf(arrayPrototype) : null;
      if (typeof arrayConstructor !== 'function' || arrayConstructor.name !== 'Array' ||
          !objectPrototype || Object.getPrototypeOf(objectPrototype) !== null) {
        throw new UnsupportedJsValueError('NON_PLAIN_ARRAY_PROTOTYPE', valuePath);
      }
      const keys = Reflect.ownKeys(value);
      for (const key of keys) {
        if (key === 'length') continue;
        if (typeof key === 'symbol') throw new UnsupportedJsValueError('SYMBOL_PROPERTY', valuePath, String(key));
        const index = Number(key);
        if (!Number.isInteger(index) || index < 0 || index >= value.length || String(index) !== key) {
          throw new UnsupportedJsValueError('ARRAY_EXTRA_PROPERTY', formatPath(valuePath, key));
        }
      }
      const output = new Array(value.length);
      for (let index = 0; index < value.length; index += 1) {
        const key = String(index);
        const descriptor = Object.getOwnPropertyDescriptor(value, key);
        const childPath = formatPath(valuePath, index);
        if (!descriptor) throw new UnsupportedJsValueError('SPARSE_ARRAY_HOLE', childPath);
        if (!descriptor.enumerable) throw new UnsupportedJsValueError('NON_ENUMERABLE_PROPERTY', childPath);
        if (!Object.hasOwn(descriptor, 'value')) throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', childPath);
        output[index] = cloneJsonValue(descriptor.value, childPath, active);
      }
      return output;
    }

    if (!isPlainObject(value)) {
      const protoName = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(value) || {}, 'constructor')?.value?.name || 'unknown';
      throw new UnsupportedJsValueError('NON_PLAIN_OBJECT', valuePath, protoName);
    }
    const output = Object.create(null);
    for (const key of Reflect.ownKeys(value)) {
      if (typeof key === 'symbol') throw new UnsupportedJsValueError('SYMBOL_PROPERTY', valuePath, String(key));
      const childPath = formatPath(valuePath, key);
      const descriptor = Object.getOwnPropertyDescriptor(value, key);
      if (!descriptor.enumerable) throw new UnsupportedJsValueError('NON_ENUMERABLE_PROPERTY', childPath);
      if (!Object.hasOwn(descriptor, 'value')) throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', childPath);
      Object.defineProperty(output, key, {
        value: cloneJsonValue(descriptor.value, childPath, active),
        enumerable: true,
        configurable: true,
        writable: true
      });
    }
    return output;
  } finally {
    active.delete(value);
  }
}

function ownDataValue(object, key, valuePath) {
  if (object === null || (typeof object !== 'object' && typeof object !== 'function')) return undefined;
  const descriptor = Object.getOwnPropertyDescriptor(object, key);
  if (!descriptor) return undefined;
  if (!Object.hasOwn(descriptor, 'value')) {
    throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', valuePath);
  }
  return descriptor.value;
}

function getPathValue(root, segments, valuePath = '$') {
  let current = root;
  let cursor = valuePath;
  for (const segment of segments) {
    cursor = formatPath(cursor, segment);
    current = ownDataValue(current, segment, cursor);
    if (current === undefined) return undefined;
  }
  return current;
}

function pathInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (relative !== '..' && !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative));
}

function walkFiles(root, predicate) {
  if (!fs.existsSync(root)) return [];
  const result = [];
  const walk = directory => {
    const entries = fs.readdirSync(directory, { withFileTypes: true })
      .sort((a, b) => stableCompare(a.name, b.name));
    for (const entry of entries) {
      const full = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.isFile() && predicate(full)) result.push(full);
    }
  };
  walk(root);
  return result;
}

function isShardFile(file) {
  return path.basename(file).toLowerCase().endsWith('.js') &&
    slash(file).split('/').includes('shards');
}

function listSourceFiles() {
  const exams = EXAM_FAMILIES.flatMap(family =>
    walkFiles(path.join(archiveRoot, 'exams', family), file => file.toLowerCase().endsWith('.js'))
      .map(file => ({ file, family }))
  );
  const generated = walkFiles(GENERATED_ROOT, isShardFile)
    .map(file => ({ file, family: 'generated-lite' }));
  return [...exams, ...generated].sort((a, b) => stableCompare(repoRelative(a.file), repoRelative(b.file)));
}

function loadHeadRevision() {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim();
}

function loadHeadBlobMap() {
  const args = [
    'ls-tree', '-r', '-z', '--full-tree', 'HEAD', '--',
    'archive/exams/original',
    'archive/exams/similar',
    'archive/exams/types',
    'archive/exams/textbooks',
    'archive/generated/lite/v1',
    'archive/db.js',
    'archive/data/question_identity_map.json',
    'archive/data/question_metadata.json',
    'archive/data/generated-lite-consumer/v1',
    'archive/_generated'
  ];
  const output = execFileSync('git', args, {
    cwd: repoRoot,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  }).toString('utf8');
  const blobs = new Map();
  for (const entry of output.split('\0')) {
    if (!entry) continue;
    const tab = entry.indexOf('\t');
    if (tab < 0) continue;
    const [, type, objectSha] = entry.slice(0, tab).split(' ');
    const gitPath = slash(entry.slice(tab + 1));
    if (type === 'blob') blobs.set(gitPath, { objectSha });
  }
  return blobs;
}

function loadArchiveScript(file, sourceBytes) {
  const source = sourceBytes.toString('utf8').replace(/^\uFEFF/, '');
  const context = {
    window: {},
    console: { log() {}, warn() {}, error() {} }
  };
  vm.createContext(context, { codeGeneration: { strings: false, wasm: false } });
  vm.runInContext(source, context, { filename: repoRelative(file), timeout: 5000 });
  return context;
}

function plainBankContainer(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function candidateFromValue(value, rootSegments, label) {
  if (Array.isArray(value)) return { questions: value, segments: rootSegments, label };
  if (!plainBankContainer(value)) return null;
  const questions = ownDataValue(value, 'questions', label + '.questions');
  if (Array.isArray(questions)) return { questions, segments: [...rootSegments, 'questions'], label: label + '.questions' };
  return null;
}

/**
 * Resolve recognized bank shapes without rewriting the object.
 * The complete post-execution window and top-level globals are exported, and
 * this location is only a pointer into that preserved sourceGlobals value.
 */
export function resolveQuestionArray(context, sourceKind = 'exam') {
  const window = context?.window || {};
  const globals = Object.create(null);
  for (const key of Object.keys(context || {})) {
    if (key === 'window' || key === 'console') continue;
    const descriptor = Object.getOwnPropertyDescriptor(context, key);
    if (!descriptor || !Object.hasOwn(descriptor, 'value')) {
      throw new UnsupportedJsValueError('ACCESSOR_GLOBAL', '$.globals.' + key);
    }
    Object.defineProperty(globals, key, {
      value: descriptor.value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }

  const sourceGlobals = { window, globals };
  const probes = sourceKind === 'generated'
    ? [
        [['window', 'questionBank'], 'window.questionBank'],
        [['window', 'generatedLiteQuestions'], 'window.generatedLiteQuestions'],
        [['window', 'questions'], 'window.questions'],
        [['globals', 'questionBank'], 'global.questionBank'],
        [['globals', 'questions'], 'global.questions']
      ]
    : [
        [['window', 'questions'], 'window.questions'],
        [['window', 'questionBank'], 'window.questionBank'],
        [['globals', 'questions'], 'global.questions'],
        [['globals', 'questionBank'], 'global.questionBank'],
        [['window', 'examData', 'questions'], 'window.examData.questions'],
        [['window', 'generatedLiteQuestions'], 'window.generatedLiteQuestions']
      ];

  const candidates = [];
  for (const [segments, label] of probes) {
    const sourceRoot = segments[0] === 'window' ? window : globals;
    const value = getPathValue(sourceRoot, segments.slice(1), '$.' + segments[0]);
    const candidate = candidateFromValue(value, segments, label);
    if (candidate) candidates.push(candidate);
  }
  if (!candidates.length) throw new Error('QUESTION_ARRAY_NOT_FOUND');

  const selected = candidates[0];
  const selectedJson = JSON.stringify(cloneJsonValue(selected.questions, '$.' + selected.label));
  const conflicts = [];
  for (const candidate of candidates.slice(1)) {
    const candidateJson = JSON.stringify(cloneJsonValue(candidate.questions, '$.' + candidate.label));
    if (candidateJson !== selectedJson) conflicts.push(candidate.label);
  }
  if (conflicts.length) throw new Error('MULTIPLE_QUESTION_ARRAYS_CONFLICT:' + [selected.label, ...conflicts].join(','));

  return {
    sourceGlobals,
    questions: selected.questions,
    questionArrayPath: selected.segments,
    questionArrayLocation: selected.label,
    candidateQuestionArrayLocations: candidates.map(candidate => candidate.label),
    sourceTitle: ownDataValue(window, 'examTitle', '$.window.examTitle')
  };
}

function readArchiveDatabase(sourceBytes) {
  const context = loadArchiveScript(DB_PATH, sourceBytes);
  const exams = context.window?.mainDB?.exams;
  if (!Array.isArray(exams)) throw new Error('ARCHIVE_DB_EXAMS_NOT_ARRAY');
  const byFile = new Map();
  for (const exam of exams) {
    if (!exam || typeof exam !== 'object') throw new Error('ARCHIVE_DB_EXAM_ENTRY_NOT_OBJECT');
    const file = String(ownDataValue(exam, 'file', '$.db.exam.file') || '').normalize('NFC').replaceAll('\\', '/');
    if (!file) continue;
    if (byFile.has(file)) throw new Error('ARCHIVE_DB_DUPLICATE_FILE:' + file);
    byFile.set(file, exam);
  }
  return { exams, byFile };
}

function sourceRelativeToExams(sourcePath) {
  const prefix = 'archive/exams/';
  return sourcePath.startsWith(prefix) ? sourcePath.slice(prefix.length) : '';
}

function questionSourceFingerprint(question) {
  const fingerprintInput = {
    content: question?.content ?? null,
    choices: Array.isArray(question?.choices) ? question.choices : null,
    answer: question?.answer ?? null,
    solution: question?.solution ?? null,
    image: question?.image ?? null
  };
  return sha256(Buffer.from(JSON.stringify(fingerprintInput), 'utf8'));
}

function detectExplicitQuestionUids(question) {
  if (!question || typeof question !== 'object' || Array.isArray(question)) return [];
  const result = [];
  for (const field of ['questionUid', 'uid', 'generatedQuestionUid']) {
    const descriptor = Object.getOwnPropertyDescriptor(question, field);
    if (!descriptor) continue;
    if (!Object.hasOwn(descriptor, 'value')) {
      throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', '$.question.' + field);
    }
    const value = descriptor.value;
    if (typeof value === 'string' && value.trim()) result.push({ field, value });
  }
  return result;
}

function detectSourceIds(question) {
  if (!question || typeof question !== 'object' || Array.isArray(question)) return { present: false, value: null };
  const descriptor = Object.getOwnPropertyDescriptor(question, 'id');
  if (!descriptor) return { present: false, value: null };
  if (!Object.hasOwn(descriptor, 'value')) throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', '$.question.id');
  return { present: true, value: cloneJsonValue(descriptor.value, '$.question.id') };
}

function generatedSidecarRelative(sourcePath) {
  return sourcePath.replace('/shards/', '/metadata/').replace(/\.js$/i, '.json');
}

export function resolveGeneratedSidecarMetadata(question, sidecar, sourceOrdinal, sourceQuestionCount) {
  if (Array.isArray(sidecar) && sidecar.length === sourceQuestionCount) {
    return { status: 'MATCHED_BY_SOURCE_ORDINAL', record: sidecar[sourceOrdinal - 1] };
  }
  if (sidecar && typeof sidecar === 'object' && !Array.isArray(sidecar)) {
    const declaredOrdinal = Number(sidecar.sourceOrdinal ?? sidecar.sourceQuestionOrdinal ?? sidecar.localOrdinal);
    const hasDeclaredOrdinal = sidecar.sourceOrdinal !== undefined ||
      sidecar.sourceQuestionOrdinal !== undefined ||
      sidecar.localOrdinal !== undefined;
    if (hasDeclaredOrdinal) {
      return Number.isInteger(declaredOrdinal) && declaredOrdinal === sourceOrdinal
        ? { status: 'MATCHED_SINGLE_SIDECAR_OBJECT_BY_DECLARED_ORDINAL', record: sidecar }
        : { status: 'SIDECAR_DECLARED_ORDINAL_MISMATCH', record: null };
    }
    if (sourceQuestionCount === 1) {
      return { status: 'MATCHED_SINGLE_SIDECAR_OBJECT_BY_SOURCE_ORDINAL', record: sidecar };
    }
  }
  if (Array.isArray(sidecar) && question && typeof question.uid === 'string') {
    const record = sidecar.find(row => row?.uid === question.uid || row?.generatedQuestionUid === question.uid);
    if (record) return { status: 'MATCHED_BY_UID', record };
  }
  if (Array.isArray(sidecar?.records) && question && typeof question.uid === 'string') {
    const record = sidecar.records.find(row => row?.uid === question.uid || row?.generatedQuestionUid === question.uid);
    if (record) return { status: 'MATCHED_BY_RECORD_UID', record };
  }
  if (sidecar && typeof sidecar === 'object' && !Array.isArray(sidecar)) {
    const questionUid = typeof question?.uid === 'string' && question.uid.trim() ? question.uid : null;
    const uidMatches = Boolean(questionUid) &&
      (sidecar.uid === questionUid || sidecar.generatedQuestionUid === questionUid);
    if (uidMatches) return { status: 'MATCHED_SINGLE_SIDECAR_OBJECT_BY_UID', record: sidecar };
  }
  return { status: sidecar == null ? 'SIDECAR_MISSING' : 'NO_SIDECAR_QUESTION_MATCH', record: null };
}

function detectGeneratedSidecarUids(sidecarMatch) {
  const record = sidecarMatch?.record;
  if (!record || typeof record !== 'object' || Array.isArray(record)) return [];
  const result = [];
  for (const field of ['questionUid', 'uid', 'generatedQuestionUid']) {
    const descriptor = Object.getOwnPropertyDescriptor(record, field);
    if (!descriptor) continue;
    if (!Object.hasOwn(descriptor, 'value')) {
      throw new UnsupportedJsValueError('ACCESSOR_PROPERTY', '$.generatedMetadataSidecar.' + field);
    }
    if (typeof descriptor.value === 'string' && descriptor.value.trim()) {
      result.push({ field, value: descriptor.value });
    }
  }
  return result;
}

function normalizeMetadataMap(identityMap, questionMetadata) {
  if (!identityMap || !Array.isArray(identityMap.records)) throw new Error('IDENTITY_MAP_RECORDS_NOT_ARRAY');
  if (!questionMetadata || !Array.isArray(questionMetadata.records)) throw new Error('QUESTION_METADATA_RECORDS_NOT_ARRAY');
  const resolver = createQuestionIdentityResolver(identityMap);
  const identityByUid = new Map();
  for (const row of identityMap.records) {
    const uid = row?.questionUid;
    if (typeof uid !== 'string' || !uid) throw new Error('IDENTITY_MAP_UID_INVALID');
    if (identityByUid.has(uid)) throw new Error('IDENTITY_MAP_DUPLICATE_UID:' + uid);
    identityByUid.set(uid, row);
  }
  const metadataByUid = new Map();
  for (const row of questionMetadata.records) {
    const uid = row?.questionUid;
    if (typeof uid !== 'string' || !uid) throw new Error('QUESTION_METADATA_UID_INVALID');
    if (metadataByUid.has(uid)) throw new Error('QUESTION_METADATA_DUPLICATE_UID:' + uid);
    metadataByUid.set(uid, row);
  }
  return { resolver, identityMap, questionMetadata, identityByUid, metadataByUid };
}

function resolveQuestionProvenance({
  question,
  sourceKind,
  sourcePath,
  sourceOrdinal,
  metadataMaps,
  sidecarMatch
}) {
  const explicitQuestionUids = detectExplicitQuestionUids(question);
  const generatedMetadataDeclaredUids = sourceKind === 'generated'
    ? detectGeneratedSidecarUids(sidecarMatch)
    : [];
  const sourceId = detectSourceIds(question);
  let identityResolution = { status: 'NO_CANONICAL_MAP_FOR_SOURCE_KIND', questionUid: null };
  let identityMapRecord = null;
  let currentSourceFingerprintStatus = 'NOT_APPLICABLE';
  let canonicalMetadataRecord = null;
  let canonicalMetadataAssociationStatus = 'NOT_APPLICABLE';

  if (sourceKind === 'archive-exam') {
    const identitySourceFile = sourceRelativeToExams(sourcePath);
    identityResolution = metadataMaps.resolver.resolve({
      sourceArchiveFile: identitySourceFile,
      sourceOrdinal
    });
    if (identityResolution.questionUid) {
      identityMapRecord = metadataMaps.identityByUid.get(identityResolution.questionUid) || null;
      if (!identityMapRecord ||
          normalizeIdentityReference({ sourceArchiveFile: identityMapRecord.sourceArchiveFile }).sourceArchiveFile !== identitySourceFile ||
          Number(identityMapRecord.sourceOrdinal) !== sourceOrdinal) {
        identityResolution = {
          status: 'IDENTITY_MAP_TUPLE_MISMATCH',
          questionUid: null,
          sourceArchiveFile: identitySourceFile,
          sourceOrdinal
        };
        identityMapRecord = null;
      } else {
        currentSourceFingerprintStatus = identityMapRecord.sourceFingerprint === questionSourceFingerprint(question)
          ? 'MATCH'
          : 'MISMATCH';
        canonicalMetadataRecord = metadataMaps.metadataByUid.get(identityResolution.questionUid) || null;
        if (!canonicalMetadataRecord) canonicalMetadataAssociationStatus = 'CANONICAL_METADATA_MISSING';
        else {
          const metadataSource = normalizeIdentityReference({
            sourceArchiveFile: canonicalMetadataRecord.sourceArchiveFile,
            sourceOrdinal: canonicalMetadataRecord.sourceOrdinal
          });
          canonicalMetadataAssociationStatus =
            metadataSource.sourceArchiveFile === identitySourceFile &&
            metadataSource.sourceOrdinal === sourceOrdinal
              ? 'MATCHED_CANONICAL_UID_AND_SOURCE_ORDINAL'
              : 'CANONICAL_METADATA_TUPLE_MISMATCH';
        }
      }
    }
  }

  const sourceDeclaredUids = explicitQuestionUids.map(row => ({ ...row }));
  const canonicalUid = identityResolution.questionUid || null;
  const sourceUidConflicts = canonicalUid
    ? explicitQuestionUids.filter(row => row.value !== canonicalUid).map(row => row.field)
    : [];

  let outputQuestionUid = canonicalUid;
  let outputIdentitySource = canonicalUid ? 'QUESTION_IDENTITY_MAP_V1' : '';
  if (!outputQuestionUid && explicitQuestionUids.length) {
    outputQuestionUid = explicitQuestionUids[0].value;
    outputIdentitySource = 'SOURCE_QUESTION_UID_FIELD:' + explicitQuestionUids[0].field;
  }
  if (!outputQuestionUid && generatedMetadataDeclaredUids.length) {
    outputQuestionUid = generatedMetadataDeclaredUids[0].value;
    outputIdentitySource = 'GENERATED_METADATA_SIDECAR_FIELD:' + generatedMetadataDeclaredUids[0].field;
  }
  const generatedMetadataUidConflicts = outputQuestionUid
    ? generatedMetadataDeclaredUids.filter(row => row.value !== outputQuestionUid).map(row => row.field)
    : [];

  const questionIdentity = {
    sourceKey: sourcePath + '#' + sourceOrdinal,
    sourcePath,
    sourceOrdinal,
    sourceIdPresent: sourceId.present,
    sourceId: sourceId.value,
    identityResolutionStatus: identityResolution.status,
    questionUid: outputQuestionUid,
    identitySource: outputIdentitySource || 'UNRESOLVED_SOURCE_KEY',
    sourceDeclaredUids,
    generatedMetadataDeclaredUids,
    sourceUidConflicts,
    generatedMetadataUidConflicts,
    currentSourceFingerprintStatus,
    identityMapRecord,
    canonicalMetadataAssociationStatus,
    canonicalQuestionMetadataRecord: canonicalMetadataRecord
  };

  if (sourceKind === 'generated') {
    questionIdentity.generatedMetadataSidecarAssociation = {
      status: sidecarMatch.status,
      record: sidecarMatch.record
    };
  }
  return questionIdentity;
}

function countFileQuestionIssues(questions) {
  const idGroups = new Map();
  const blankIdOrdinals = [];
  for (let index = 0; index < questions.length; index += 1) {
    const sourceId = detectSourceIds(questions[index]);
    const legacyKey = !sourceId.present || sourceId.value === null || sourceId.value === ''
      ? ''
      : String(sourceId.value);
    if (!legacyKey) blankIdOrdinals.push(index + 1);
    if (!idGroups.has(legacyKey)) idGroups.set(legacyKey, []);
    idGroups.get(legacyKey).push(index + 1);
  }
  const duplicateIdGroups = [...idGroups.entries()]
    .filter(([key, ordinals]) => key !== '' && ordinals.length > 1)
    .map(([key, ordinals]) => ({ legacyIdKey: key, sourceOrdinals: ordinals }));
  return { blankIdOrdinals, duplicateIdGroups };
}

function countFiles(roots, predicate) {
  return roots.flatMap(root => walkFiles(root, predicate))
    .map(repoRelative)
    .sort(stableCompare);
}

function readJsonFile(file) {
  const bytes = fs.readFileSync(file);
  return { value: JSON.parse(bytes.toString('utf8').replace(/^\uFEFF/, '')), bytes };
}

function loadInputAuthorities(headBlobs) {
  const dbBytes = fs.readFileSync(DB_PATH);
  const identityMapBytes = fs.readFileSync(IDENTITY_MAP_PATH);
  const questionMetadataBytes = fs.readFileSync(QUESTION_METADATA_PATH);
  const db = readArchiveDatabase(dbBytes);
  const identityMap = JSON.parse(identityMapBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const questionMetadata = JSON.parse(questionMetadataBytes.toString('utf8').replace(/^\uFEFF/, ''));
  const maps = normalizeMetadataMap(identityMap, questionMetadata);
  const authority = file => ({
    sourcePath: repoRelative(file),
    sourceSha256: sha256(fs.readFileSync(file)),
    sourceGitBlobSha1: headBlobs.get(repoRelative(file))?.objectSha || null
  });
  return {
    db,
    metadataMaps: maps,
    authority: {
      archiveDatabase: authority(DB_PATH),
      questionIdentityMap: authority(IDENTITY_MAP_PATH),
      questionMetadata: authority(QUESTION_METADATA_PATH),
      questionIdentityMapRecordCount: identityMap.records.length,
      questionMetadataRecordCount: questionMetadata.records.length,
      questionIdentityMapSourceCommit: identityMap.sourceCommit || null,
      questionIdentityMapSchemaVersion: identityMap.schemaVersion || null,
      questionMetadataSchemaVersion: questionMetadata.schemaVersion || null
    }
  };
}

function countDuplicateUidGroups(uidOccurrences) {
  return [...uidOccurrences.entries()]
    .filter(([, occurrences]) => occurrences.length > 1)
    .sort(([a], [b]) => stableCompare(a, b))
    .map(([questionUid, occurrences]) => ({ questionUid, occurrenceCount: occurrences.length, occurrences }));
}

export function buildUidOccurrenceIndex(occurrences) {
  const byUid = Object.create(null);
  const unresolved = [];
  const declaredButConflicting = [];
  for (const occurrence of occurrences) {
    const entries = occurrence.uidEntries || [];
    if (!entries.length) {
      unresolved.push({
        sourceKey: occurrence.sourceKey,
        sourcePath: occurrence.sourcePath,
        sourceOrdinal: occurrence.sourceOrdinal,
        jsonPath: occurrence.jsonPath,
        questionArrayPath: occurrence.questionArrayPath,
        reason: occurrence.unresolvedReason || 'NO_CANONICAL_OR_EXPLICIT_UID'
      });
      continue;
    }
    for (const entry of entries) {
      if (!byUid[entry.questionUid]) byUid[entry.questionUid] = [];
      const value = {
        sourceKey: occurrence.sourceKey,
        sourcePath: occurrence.sourcePath,
        sourceOrdinal: occurrence.sourceOrdinal,
        jsonPath: occurrence.jsonPath,
        questionArrayPath: occurrence.questionArrayPath,
        identitySource: entry.identitySource
      };
      if (!byUid[entry.questionUid].some(existing => existing.sourceKey === value.sourceKey && existing.identitySource === value.identitySource)) {
        byUid[entry.questionUid].push(value);
      }
      if (entry.conflictsWithCanonical) declaredButConflicting.push({
        questionUid: entry.questionUid,
        sourceKey: occurrence.sourceKey,
        identitySource: entry.identitySource
      });
    }
  }
  const sortedByUid = Object.create(null);
  for (const uid of Object.keys(byUid).sort(stableCompare)) {
    sortedByUid[uid] = byUid[uid].sort((a, b) =>
      stableCompare(a.sourcePath, b.sourcePath) || a.sourceOrdinal - b.sourceOrdinal || stableCompare(a.identitySource, b.identitySource)
    );
  }
  unresolved.sort((a, b) => stableCompare(a.sourcePath, b.sourcePath) || a.sourceOrdinal - b.sourceOrdinal);
  const uidKeyCountByIdentitySource = Object.create(null);
  const uidReferenceCountByIdentitySource = Object.create(null);
  let canonicalQuestionUidCount = 0;
  for (const occurrencesForUid of Object.values(sortedByUid)) {
    const sourceKinds = new Set(occurrencesForUid.map(row => row.identitySource).filter(Boolean));
    if (sourceKinds.has('QUESTION_IDENTITY_MAP_V1')) canonicalQuestionUidCount += 1;
    for (const source of sourceKinds) {
      uidKeyCountByIdentitySource[source] = (uidKeyCountByIdentitySource[source] || 0) + 1;
    }
    for (const occurrence of occurrencesForUid) {
      const source = occurrence.identitySource || 'UNSPECIFIED';
      uidReferenceCountByIdentitySource[source] = (uidReferenceCountByIdentitySource[source] || 0) + 1;
    }
  }
  const uniqueUidKeyCount = Object.keys(sortedByUid).length;
  return {
    schemaVersion: UID_INDEX_SCHEMA_VERSION,
    sourceRevision: null,
    lookupKeySemantics: 'Union of existing canonical identity-map UIDs and explicit source question/sidecar UID values; not every key is a verified canonical UID.',
    uniqueQuestionUidCount: uniqueUidKeyCount,
    uniqueUidKeyCount,
    canonicalQuestionUidCount,
    supplementalUidKeyCount: uniqueUidKeyCount - canonicalQuestionUidCount,
    uidKeyCountByIdentitySource: Object.fromEntries(Object.entries(uidKeyCountByIdentitySource).sort(([a], [b]) => stableCompare(a, b))),
    uidReferenceCountByIdentitySource: Object.fromEntries(Object.entries(uidReferenceCountByIdentitySource).sort(([a], [b]) => stableCompare(a, b))),
    uidOccurrenceCount: Object.values(sortedByUid).reduce((sum, rows) => sum + rows.length, 0),
    byUid: sortedByUid,
    unresolvedSourceKeys: unresolved,
    explicitUidConflicts: declaredButConflicting.sort((a, b) => stableCompare(a.questionUid, b.questionUid) || stableCompare(a.sourceKey, b.sourceKey))
  };
}

function compareConsumerProjection(consumerIndex, generatedUidOccurrences) {
  const records = Array.isArray(consumerIndex?.records) ? consumerIndex.records : [];
  const userDisabledUids = Array.isArray(consumerIndex?.userDisabledUids)
    ? [...consumerIndex.userDisabledUids]
    : [];
  const withdrawnUids = Array.isArray(consumerIndex?.withdrawnUids)
    ? [...consumerIndex.withdrawnUids]
    : [];
  const consumerUidSet = new Set(records.map(row => row?.uid).filter(value => typeof value === 'string' && value));
  const sourceUidSet = new Set(generatedUidOccurrences.keys());
  const missingFromSource = [...consumerUidSet].filter(uid => !sourceUidSet.has(uid)).sort(stableCompare);
  const missingFromConsumer = [...sourceUidSet].filter(uid => !consumerUidSet.has(uid)).sort(stableCompare);
  return {
    consumerIndexPath: repoRelative(path.join(CONSUMER_ROOT, 'index.json')),
    consumerRecordCount: records.length,
    consumerUniqueUidCount: consumerUidSet.size,
    consumerDistinctSourceShardCount: new Set(records.map(row => row?.sourceShard).filter(Boolean)).size,
    consumerIsDerivedDataOnly: true,
    userDisabledUids,
    withdrawnUids,
    disabledOrWithdrawnStatusesAreAnnotationsOnly: true,
    sourceUidUniqueCount: sourceUidSet.size,
    sourceUidOccurrenceCount: [...generatedUidOccurrences.values()].reduce((sum, rows) => sum + rows.length, 0),
    sourceRepeatedUidOccurrenceCount: [...generatedUidOccurrences.values()].reduce((sum, rows) => sum + Math.max(0, rows.length - 1), 0),
    consumerUidMissingFromSource: missingFromSource,
    sourceUidMissingFromConsumer: missingFromConsumer
  };
}

function annotateConsumerUidStatuses(uidIndex, consumerIndex) {
  const userDisabled = new Set(
    Array.isArray(consumerIndex?.userDisabledUids)
      ? consumerIndex.userDisabledUids.filter(value => typeof value === 'string' && value)
      : []
  );
  const withdrawn = new Set(
    Array.isArray(consumerIndex?.withdrawnUids)
      ? consumerIndex.withdrawnUids.filter(value => typeof value === 'string' && value)
      : []
  );
  let disabledOccurrenceCount = 0;
  let withdrawnOccurrenceCount = 0;
  for (const [uid, occurrences] of Object.entries(uidIndex.byUid)) {
    const isDisabled = userDisabled.has(uid);
    const isWithdrawn = withdrawn.has(uid);
    for (const occurrence of occurrences) {
      occurrence.userDisabled = isDisabled;
      occurrence.withdrawn = isWithdrawn;
      if (isDisabled) disabledOccurrenceCount += 1;
      if (isWithdrawn) withdrawnOccurrenceCount += 1;
    }
  }
  uidIndex.statusAnnotations = {
    sourcePath: repoRelative(path.join(CONSUMER_ROOT, 'index.json')),
    userDisabledUids: [...userDisabled].sort(stableCompare),
    withdrawnUids: [...withdrawn].sort(stableCompare),
    disabledUidOccurrenceCount: disabledOccurrenceCount,
    withdrawnUidOccurrenceCount: withdrawnOccurrenceCount,
    annotationOnly: true,
    usedToExcludeSourceOccurrences: false
  };
}

function discoverExcludedScope(headBlobs, identityMap) {
  const fixtureJs = countFiles([FIXTURES_ROOT], file => file.toLowerCase().endsWith('.js'));
  const historicalFiles = [...headBlobs.keys()]
    .filter(file => file.startsWith('archive/_generated/'))
    .sort(stableCompare);
  const historicalJs = historicalFiles.filter(file => file.toLowerCase().endsWith('.js'));
  const historicalJson = historicalFiles.filter(file => file.toLowerCase().endsWith('.json'));
  const consumerJson = countFiles([CONSUMER_ROOT], file => file.toLowerCase().endsWith('.json'));
  const generatedJson = countFiles([GENERATED_ROOT], file => file.toLowerCase().endsWith('.json'));
  const generatedShardPaths = new Set(walkFiles(GENERATED_ROOT, isShardFile).map(repoRelative));
  const generatedMetadataPaths = new Set([...generatedShardPaths].map(generatedSidecarRelative));
  const companionMetadataJson = [...generatedMetadataPaths].filter(file => fs.existsSync(path.join(repoRoot, file)));
  const otherGeneratedJson = generatedJson.filter(file => !generatedMetadataPaths.has(file));
  const fixtureIdentityRecords = (identityMap?.records || []).filter(row => {
    const sourcePath = normalizeIdentityReference({ sourceArchiveFile: row?.sourceArchiveFile }).sourceArchiveFile;
    return sourcePath.startsWith('test-fixtures/');
  });
  const consumerIndexPath = path.join(CONSUMER_ROOT, 'index.json');
  let consumerIndex = null;
  if (fs.existsSync(consumerIndexPath)) {
    try { consumerIndex = readJsonFile(consumerIndexPath).value; } catch {}
  }
  const consumerSummary = consumerIndex ? {
    recordCount: Array.isArray(consumerIndex.records) ? consumerIndex.records.length : 0,
    uniqueUidCount: new Set((consumerIndex.records || []).map(row => row?.uid).filter(value => typeof value === 'string' && value)).size,
    distinctSourceShardCount: new Set((consumerIndex.records || []).map(row => row?.sourceShard).filter(Boolean)).size,
    userDisabledUids: Array.isArray(consumerIndex.userDisabledUids) ? [...consumerIndex.userDisabledUids] : [],
    withdrawnUids: Array.isArray(consumerIndex.withdrawnUids) ? [...consumerIndex.withdrawnUids] : []
  } : {
    recordCount: null,
    uniqueUidCount: null,
    distinctSourceShardCount: null,
    userDisabledUids: [],
    withdrawnUids: []
  };
  return {
    excluded: {
      archiveExamFixtures: {
        sourcePath: repoRelative(FIXTURES_ROOT),
        javascriptFileCount: fixtureJs.length,
        identityMapRecordCount: fixtureIdentityRecords.length,
        reason: 'test fixtures are not production exam source',
        files: fixtureJs
      },
      historicalUnderscoreGenerated: {
        sourcePath: repoRelative(HISTORICAL_GENERATED_ROOT),
        javascriptFileCount: historicalJs.length,
        jsonFileCount: historicalJson.length,
        filesCountedFrom: 'HEAD git tree at sourceRevision',
        materializedInWorkingCopy: fs.existsSync(HISTORICAL_GENERATED_ROOT),
        reason: 'historical/recovery artifacts are outside the main-resident production source scope',
        javascriptFiles: historicalJs,
        jsonFiles: historicalJson
      },
      generatedLiteNonCompanionJson: {
        sourcePath: repoRelative(GENERATED_ROOT),
        jsonFileCount: otherGeneratedJson.length,
        reason: 'manifests, registries, graph specs, and other package JSON are not question JS source or companion metadata',
        files: otherGeneratedJson
      },
      generatedLiteCompanionMetadata: {
        sourcePath: repoRelative(GENERATED_ROOT),
        jsonFileCount: companionMetadataJson.length,
        reason: 'these JSON sidecars are included within their source-shard envelope, not counted as question JS inputs',
        files: companionMetadataJson
      },
      generatedConsumerProjection: {
        sourcePath: repoRelative(CONSUMER_ROOT),
        jsonFileCount: consumerJson.length,
        summary: consumerSummary,
        reason: 'derived Consumer projection is excluded from the source denominator to avoid duplicate source-derived records',
        files: consumerJson
      }
    },
    consumerIndex
  };
}

function inspectExistingOutput(outDir) {
  if (!fs.existsSync(outDir)) return null;
  const stat = fs.lstatSync(outDir);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('OUTPUT_PATH_MUST_BE_DIRECTORY');
  const entries = fs.readdirSync(outDir);
  if (!entries.length) return null;
  const manifestPath = path.join(outDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) throw new Error('OUTPUT_DIRECTORY_NOT_EMPTY_AND_NOT_OWNED');
  const previous = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (previous.schemaVersion !== MANIFEST_SCHEMA_VERSION) throw new Error('OUTPUT_DIRECTORY_HAS_DIFFERENT_MANIFEST_SCHEMA');
  return previous;
}

function ensureOutputPath(outDir) {
  const resolved = path.resolve(outDir);
  if (pathInside(repoRoot, resolved)) throw new Error('OUTPUT_DIRECTORY_MUST_BE_OUTSIDE_REPOSITORY');
  fs.mkdirSync(resolved, { recursive: true });
  const real = fs.realpathSync(resolved);
  if (pathInside(repoRoot, real)) throw new Error('OUTPUT_DIRECTORY_MUST_BE_OUTSIDE_REPOSITORY');
  return real;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n', 'utf8');
}

function currentWorkingTreeChangedPaths() {
  const sourceRoots = [
    'archive/exams/original',
    'archive/exams/similar',
    'archive/exams/types',
    'archive/exams/textbooks',
    'archive/generated/lite/v1'
  ];
  const output = execFileSync('git', ['diff', '--name-only', '-z', 'HEAD', '--', ...sourceRoots], {
    cwd: repoRoot,
    maxBuffer: 64 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe']
  }).toString('utf8');
  return new Set(output.split('\0').filter(Boolean).map(slash));
}

export function buildUidEntries(identity) {
  const output = [];
  const canonical = identity.questionUid;
  if (typeof canonical === 'string' && canonical.trim()) {
    output.push({
      questionUid: canonical,
      identitySource: identity.identitySource,
      conflictsWithCanonical: false
    });
  }
  for (const row of identity.sourceDeclaredUids || []) {
    if (typeof row.value !== 'string' || !row.value.trim()) continue;
    if (output.some(entry => entry.questionUid === row.value)) continue;
    output.push({
      questionUid: row.value,
      identitySource: 'SOURCE_QUESTION_UID_FIELD:' + row.field,
      conflictsWithCanonical: Boolean(canonical && canonical !== row.value)
    });
  }
  for (const row of identity.generatedMetadataDeclaredUids || []) {
    if (typeof row.value !== 'string' || !row.value.trim()) continue;
    if (output.some(entry => entry.questionUid === row.value)) continue;
    output.push({
      questionUid: row.value,
      identitySource: 'GENERATED_METADATA_SIDECAR_FIELD:' + row.field,
      conflictsWithCanonical: Boolean(canonical && canonical !== row.value)
    });
  }
  return output;
}

function qCountMismatch(metadata, actualCount) {
  if (!metadata || metadata.qCount === undefined || metadata.qCount === null) return null;
  const declared = Number(metadata.qCount);
  if (!Number.isInteger(declared)) return { declared: metadata.qCount, actual: actualCount, status: 'DECLARED_QCOUNT_NOT_INTEGER' };
  if (declared !== actualCount) return { declared, actual: actualCount, status: 'DECLARED_QCOUNT_MISMATCH' };
  return null;
}

function safeJsonRoundTrip(value, pathLabel) {
  const cloned = cloneJsonValue(value, pathLabel);
  const text = JSON.stringify(cloned);
  const parsed = JSON.parse(text);
  if (JSON.stringify(parsed) !== text) throw new Error('JSON_VALUE_ROUNDTRIP_MISMATCH:' + pathLabel);
  return cloned;
}

function runExport(outDirArgument) {
  if (!outDirArgument) throw new Error('REQUIRED_ARGUMENT:--out-dir');
  const outDir = ensureOutputPath(outDirArgument);
  const previousManifest = inspectExistingOutput(outDir);
  const head = loadHeadRevision();
  const headBlobs = loadHeadBlobMap();
  const files = listSourceFiles();
  if (!files.length) throw new Error('NO_SOURCE_QUESTION_FILES');

  const sourcePaths = files.map(row => repoRelative(row.file));
  const changedSourcePaths = currentWorkingTreeChangedPaths();
  const sourceWorkingTreeStatus = changedSourcePaths.size ? 'DIFFERS_FROM_HEAD' : 'MATCHES_HEAD';
  const oldPaths = new Set((previousManifest?.sourceFiles || []).map(row => row.outputPath).filter(Boolean));
  const currentPaths = new Set(files.map(row => outputFileForSource(repoRelative(row.file))));
  const staleOutputs = [...oldPaths].filter(file => !currentPaths.has(file));
  if (staleOutputs.length) throw new Error('OUTPUT_DIRECTORY_HAS_STALE_SOURCE_FILES:' + staleOutputs.slice(0, 10).join(','));

  const dbBytes = fs.readFileSync(DB_PATH);
  const identityBytes = fs.readFileSync(IDENTITY_MAP_PATH);
  const questionMetadataBytes = fs.readFileSync(QUESTION_METADATA_PATH);
  const authorities = loadInputAuthorities(headBlobs);
  const excludedScope = discoverExcludedScope(headBlobs, authorities.metadataMaps.identityMap);
  const fileReports = [];
  const fileFailures = [];
  const identityMapResolutions = Object.create(null);
  const identityMapResolutionsByFamily = Object.create(null);
  const canonicalMetadataAssociations = Object.create(null);
  const fingerprintCounts = { MATCH: 0, MISMATCH: 0, NOT_APPLICABLE: 0 };
  const generatedSidecarStats = { present: 0, missing: 0, matchingQuestions: 0, unmatchedQuestions: 0 };
  let generatedMetadataUidConflictCount = 0;
  const idIssues = [];
  const qCountMismatches = [];
  const dbMetadataMissing = [];
  const sourceQuestionCountsByFamily = Object.create(null);
  const sourceFileCountsByFamily = Object.create(null);

  for (const row of files) {
    const file = row.file;
    const sourcePath = repoRelative(file);
    const family = row.family;
    const sourceBytes = fs.readFileSync(file);
    const sourceDigest = sha256(sourceBytes);
    const sourceBlob = headBlobs.get(sourcePath);
    const outputPath = outputFileForSource(sourcePath);
    const sourceKind = family === 'generated-lite' ? 'generated' : 'archive-exam';
    const workingTreeStatus = changedSourcePaths.has(sourcePath) ? 'DIFFERS_FROM_HEAD' : 'MATCHES_HEAD';

    try {
      if (!sourceBlob) throw new Error('SOURCE_NOT_TRACKED_AT_HEAD:' + sourcePath);
      const context = loadArchiveScript(file, sourceBytes);
      const resolved = resolveQuestionArray(context, sourceKind);
      const originalQuestions = resolved.questions;
      const sourceGlobals = safeJsonRoundTrip(resolved.sourceGlobals, '$.sourceGlobals');
      const copiedQuestions = getPathValue(sourceGlobals, resolved.questionArrayPath, '$.sourceGlobals');
      if (!Array.isArray(copiedQuestions) || copiedQuestions.length !== originalQuestions.length) {
        throw new Error('QUESTION_ARRAY_ROUNDTRIP_COUNT_MISMATCH:' + sourcePath);
      }
      if (JSON.stringify(copiedQuestions) !== JSON.stringify(safeJsonRoundTrip(originalQuestions, '$.questions'))) {
        throw new Error('QUESTION_ARRAY_ROUNDTRIP_VALUE_MISMATCH:' + sourcePath);
      }

      const sourceRelative = sourceKind === 'archive-exam' ? sourceRelativeToExams(sourcePath) : null;
      const dbMetadata = sourceRelative ? authorities.db.byFile.get(sourceRelative) || null : null;
      if (sourceKind === 'archive-exam' && !dbMetadata) dbMetadataMissing.push(sourcePath);
      const mismatch = qCountMismatch(dbMetadata, originalQuestions.length);
      if (mismatch) qCountMismatches.push({ sourcePath, ...mismatch });

      let sidecar = null;
      let sidecarPath = null;
      if (sourceKind === 'generated') {
        sidecarPath = generatedSidecarRelative(sourcePath);
        const sidecarFullPath = path.join(repoRoot, sidecarPath);
        if (fs.existsSync(sidecarFullPath)) {
          const sidecarRead = readJsonFile(sidecarFullPath);
          sidecar = safeJsonRoundTrip(sidecarRead.value, '$.generatedMetadataSidecar');
          generatedSidecarStats.present += 1;
        } else {
          generatedSidecarStats.missing += 1;
        }
      }

      const questionRows = [];
      const issueSummary = countFileQuestionIssues(originalQuestions);
      for (let index = 0; index < originalQuestions.length; index += 1) {
        const question = originalQuestions[index];
        const sourceOrdinal = index + 1;
        const sidecarMatch = sourceKind === 'generated'
          ? resolveGeneratedSidecarMetadata(question, sidecar, sourceOrdinal, originalQuestions.length)
          : { status: 'NOT_APPLICABLE', record: null };
        if (sourceKind === 'generated') {
          if (sidecarMatch.record) generatedSidecarStats.matchingQuestions += 1;
          else generatedSidecarStats.unmatchedQuestions += 1;
        }
        const identity = resolveQuestionProvenance({
          question,
          sourceKind,
          sourcePath,
          sourceOrdinal,
          metadataMaps: authorities.metadataMaps,
          sidecarMatch
        });
        identity.jsonPath = outputPath;
        identity.questionArrayPath = resolved.questionArrayPath;
        const clonedIdentity = safeJsonRoundTrip(identity, '$.questionMetadata[' + sourceOrdinal + ']');
        questionRows.push(clonedIdentity);
        const fingerprintKey = clonedIdentity.currentSourceFingerprintStatus || 'NOT_APPLICABLE';
        fingerprintCounts[fingerprintKey] = (fingerprintCounts[fingerprintKey] || 0) + 1;
        const resolutionKey = clonedIdentity.identityResolutionStatus || 'UNSPECIFIED';
        identityMapResolutions[resolutionKey] = (identityMapResolutions[resolutionKey] || 0) + 1;
        if (!identityMapResolutionsByFamily[family]) identityMapResolutionsByFamily[family] = Object.create(null);
        const familyResolutions = identityMapResolutionsByFamily[family];
        familyResolutions[resolutionKey] = (familyResolutions[resolutionKey] || 0) + 1;
        const associationKey = clonedIdentity.canonicalMetadataAssociationStatus || 'UNSPECIFIED';
        canonicalMetadataAssociations[associationKey] = (canonicalMetadataAssociations[associationKey] || 0) + 1;
        generatedMetadataUidConflictCount += clonedIdentity.generatedMetadataUidConflicts?.length || 0;
      }

      if (issueSummary.blankIdOrdinals.length || issueSummary.duplicateIdGroups.length) {
        idIssues.push({
          sourcePath,
          questionCount: originalQuestions.length,
          blankIdOrdinals: issueSummary.blankIdOrdinals,
          duplicateIdGroups: issueSummary.duplicateIdGroups
        });
      }

      const authorityRefs = sourceKind === 'archive-exam'
        ? {
            examMetadataSourcePath: 'archive/db.js',
            examMetadataSourceGitBlobSha1: headBlobs.get('archive/db.js')?.objectSha || null,
            examMetadataSourceSha256: sha256(dbBytes),
            identityMapSourcePath: repoRelative(IDENTITY_MAP_PATH),
            identityMapSourceGitBlobSha1: headBlobs.get(repoRelative(IDENTITY_MAP_PATH))?.objectSha || null,
            identityMapSourceSha256: sha256(identityBytes),
            questionMetadataSourcePath: repoRelative(QUESTION_METADATA_PATH),
            questionMetadataSourceGitBlobSha1: headBlobs.get(repoRelative(QUESTION_METADATA_PATH))?.objectSha || null,
            questionMetadataSourceSha256: sha256(questionMetadataBytes)
          }
        : null;

      const outputPayload = {
        schemaVersion: EXPORT_SCHEMA_VERSION,
        source: {
          path: sourcePath,
          family,
          kind: sourceKind,
          sourceRevision: head,
          sourceGitBlobSha1: sourceBlob.objectSha,
          sourceSha256: sourceDigest,
          sourceByteLength: sourceBytes.length,
          sourceTitle: typeof resolved.sourceTitle === 'string' ? resolved.sourceTitle : null,
          questionArrayLocation: resolved.questionArrayLocation,
          questionArrayPath: resolved.questionArrayPath,
          questionCount: originalQuestions.length,
          workingTreeStatus
        },
        examMetadata: dbMetadata ? safeJsonRoundTrip(dbMetadata, '$.examMetadata') : null,
        examMetadataAuthority: authorityRefs,
        sourceGlobals,
        questionMetadata: questionRows,
        generatedMetadataSidecar: sourceKind === 'generated'
          ? {
              path: sidecarPath,
              sourceGitBlobSha1: sidecarPath ? headBlobs.get(sidecarPath)?.objectSha || null : null,
              sourceSha256: sidecarPath && fs.existsSync(path.join(repoRoot, sidecarPath))
                ? sha256(fs.readFileSync(path.join(repoRoot, sidecarPath)))
                : null,
              payload: sidecar
            }
          : null
      };
      const outputJson = JSON.stringify(outputPayload, null, 2) + '\n';
      const parsedPayload = JSON.parse(outputJson);
      const parsedQuestionArray = getPathValue(parsedPayload.sourceGlobals, outputPayload.source.questionArrayPath, '$.sourceGlobals');
      if (!Array.isArray(parsedQuestionArray) ||
          JSON.stringify(parsedQuestionArray) !== JSON.stringify(copiedQuestions)) {
        throw new Error('FINAL_JSON_PARITY_CHECK_FAILED:' + sourcePath);
      }
      const outputBytes = Buffer.from(outputJson, 'utf8');
      const actualOutputPath = path.join(outDir, outputPath);
      fs.mkdirSync(path.dirname(actualOutputPath), { recursive: true });
      fs.writeFileSync(actualOutputPath, outputBytes);

      const fileReport = {
        sourcePath,
        family,
        kind: sourceKind,
        outputPath,
        sourceGitBlobSha1: sourceBlob.objectSha,
        sourceSha256: sourceDigest,
        sourceByteLength: sourceBytes.length,
        outputSha256: sha256(outputBytes),
        outputByteLength: outputBytes.length,
        questionCount: originalQuestions.length,
        questionArrayLocation: resolved.questionArrayLocation,
        questionArrayPath: resolved.questionArrayPath,
        topLevelMetadataStatus: sourceKind === 'generated'
          ? (sidecar ? 'GENERATED_COMPANION_PRESENT' : 'NO_GENERATED_COMPANION')
          : (dbMetadata ? 'DB_METADATA_PRESENT' : 'DB_METADATA_MISSING'),
        canonicalUidCount: questionRows.filter(item => item.identityResolutionStatus === 'RESOLVED_SOURCE_ORDINAL').length,
        unresolvedSourceOrdinalCount: questionRows.filter(item => item.identityResolutionStatus === 'UNKNOWN_SOURCE_ORDINAL').length,
        explicitSourceUidCount: questionRows.filter(item => item.sourceDeclaredUids.length).length,
        explicitGeneratedMetadataUidCount: questionRows.filter(item => item.generatedMetadataDeclaredUids.length).length,
        generatedMetadataUidConflictCount: questionRows.reduce((sum, item) => sum + item.generatedMetadataUidConflicts.length, 0),
        qCountStatus: mismatch?.status || (dbMetadata?.qCount === undefined ? 'NOT_DECLARED' : 'MATCH'),
        blankIdOrdinals: issueSummary.blankIdOrdinals,
        duplicateIdGroups: issueSummary.duplicateIdGroups,
        workingTreeStatus
      };
      fileReports.push(fileReport);
      sourceFileCountsByFamily[family] = (sourceFileCountsByFamily[family] || 0) + 1;
      sourceQuestionCountsByFamily[family] = (sourceQuestionCountsByFamily[family] || 0) + originalQuestions.length;
    } catch (error) {
      fileFailures.push({
        sourcePath,
        family,
        code: error?.code || 'SOURCE_EXPORT_FAILED',
        detail: String(error?.message || error)
      });
    }
  }

  // Build UID indexes only from successful source outputs after file-level
  // parity checks. Repeated UIDs remain arrays of distinct source occurrences.
  const occurrenceReports = [];
  const repeatedUidOccurrences = new Map();
  for (const fileReport of fileReports) {
    const filePayload = JSON.parse(fs.readFileSync(path.join(outDir, fileReport.outputPath), 'utf8'));
    for (let index = 0; index < fileReport.questionCount; index += 1) {
      const questionMetadata = filePayload.questionMetadata[index];
      const uidEntries = buildUidEntries(questionMetadata);
      const occurrence = {
        sourceKey: questionMetadata.sourceKey,
        sourcePath: questionMetadata.sourcePath,
        sourceOrdinal: questionMetadata.sourceOrdinal,
        jsonPath: fileReport.outputPath,
        questionArrayPath: fileReport.questionArrayPath,
        uidEntries,
        unresolvedReason: questionMetadata.identityResolutionStatus
      };
      occurrenceReports.push(occurrence);
      for (const entry of uidEntries) {
        if (!repeatedUidOccurrences.has(entry.questionUid)) repeatedUidOccurrences.set(entry.questionUid, []);
        repeatedUidOccurrences.get(entry.questionUid).push({
          sourceKey: occurrence.sourceKey,
          sourcePath: occurrence.sourcePath,
          sourceOrdinal: occurrence.sourceOrdinal,
          jsonPath: occurrence.jsonPath,
          identitySource: entry.identitySource
        });
      }
    }
  }
  const uidIndex = buildUidOccurrenceIndex(occurrenceReports);
  uidIndex.sourceRevision = head;
  annotateConsumerUidStatuses(uidIndex, excludedScope.consumerIndex);
  writeJson(path.join(outDir, 'uid-index.json'), uidIndex);

  const duplicateUidGroups = countDuplicateUidGroups(repeatedUidOccurrences);
  const excluded = excludedScope.excluded;
  const identityMapRowsUsedByCurrentSources = fileReports
    .filter(row => row.kind === 'archive-exam')
    .reduce((sum, row) => sum + row.canonicalUidCount, 0);
  const identityMapRowsExcludedForFixtures = excluded.archiveExamFixtures.identityMapRecordCount;
  const identityMapRowsNotMatchedToIncludedOrExcludedSources = Math.max(0,
    authorities.metadataMaps.identityByUid.size -
    identityMapRowsUsedByCurrentSources -
    identityMapRowsExcludedForFixtures
  );
  const questionCountByKind = {
    archiveExam: fileReports.filter(row => row.kind === 'archive-exam').reduce((sum, row) => sum + row.questionCount, 0),
    generatedLite: fileReports.filter(row => row.kind === 'generated').reduce((sum, row) => sum + row.questionCount, 0)
  };
  const generatedUidOccurrences = new Map();
  for (const occurrence of occurrenceReports.filter(row => row.sourcePath.startsWith('archive/generated/lite/v1/'))) {
    const entry = occurrence.uidEntries.find(row =>
      row.identitySource.startsWith('SOURCE_QUESTION_UID_FIELD:') ||
      row.identitySource.startsWith('GENERATED_METADATA_SIDECAR_FIELD:')
    );
    if (!entry) continue;
    if (!generatedUidOccurrences.has(entry.questionUid)) generatedUidOccurrences.set(entry.questionUid, []);
    generatedUidOccurrences.get(entry.questionUid).push(occurrence);
  }
  const consumerParity = compareConsumerProjection(excludedScope.consumerIndex, generatedUidOccurrences);
  const manifest = {
    schemaVersion: MANIFEST_SCHEMA_VERSION,
    status: fileFailures.length ? 'PARTIAL_FAILURE' : 'COMPLETE',
    sourceRevision: head,
    sourceWorkingTreeStatus,
    changedSourcePaths: [...changedSourcePaths].sort(stableCompare),
    transformation: {
      name: 'source-js-to-json-exact-values',
      executionMode: 'bounded-node-vm',
      questionObjectsAreUnmodified: true,
      sourceGlobalsContainPostExecutionState: true,
      unsupportedValuesFailClosed: true,
      consumerProjectionIsNotAnInput: true,
      approvalOrMetaStateModified: false
    },
    sourceScope: {
      examFamilies: EXAM_FAMILIES,
      examJavascriptFilesDiscovered: files.filter(row => row.family !== 'generated-lite').length,
      generatedLiteShardJavascriptFilesDiscovered: files.filter(row => row.family === 'generated-lite').length,
      totalSourceJavascriptFilesDiscovered: files.length,
      testFixturesExcluded: excluded.archiveExamFixtures.javascriptFileCount,
      historicalUnderscoreGeneratedExcluded: excluded.historicalUnderscoreGenerated.javascriptFileCount,
      consumerProjectionExcludedJsonFiles: excluded.generatedConsumerProjection.jsonFileCount
    },
    counts: {
      sourceFilesByFamily: sourceFileCountsByFamily,
      sourceQuestionsByFamily: sourceQuestionCountsByFamily,
      exportedFiles: fileReports.length,
      failedFiles: fileFailures.length,
      exportedQuestionsByKind: questionCountByKind,
      exportedQuestionsTotal: fileReports.reduce((sum, row) => sum + row.questionCount, 0),
      blankOrMissingSourceIds: idIssues.reduce((sum, row) => sum + row.blankIdOrdinals.length, 0),
      duplicateLegacyIdGroups: idIssues.reduce((sum, row) => sum + row.duplicateIdGroups.length, 0),
      identityResolutionStatusCounts: Object.fromEntries(Object.entries(identityMapResolutions).sort(([a], [b]) => stableCompare(a, b))),
      identityResolutionStatusCountsByFamily: Object.fromEntries(Object.entries(identityMapResolutionsByFamily)
        .sort(([a], [b]) => stableCompare(a, b))
        .map(([family, values]) => [family, Object.fromEntries(Object.entries(values).sort(([a], [b]) => stableCompare(a, b)))])),
      identityMapRowsUsedByCurrentSources,
      identityMapRowsExcludedForFixtures,
      identityMapRowsNotMatchedToIncludedOrExcludedSources,
      currentSourceFingerprintStatusCounts: fingerprintCounts,
      canonicalMetadataAssociationStatusCounts: Object.fromEntries(Object.entries(canonicalMetadataAssociations).sort(([a], [b]) => stableCompare(a, b))),
      examDatabaseMetadataMissingCount: dbMetadataMissing.length,
      generatedMetadataCompanionFilesPresent: generatedSidecarStats.present,
      generatedMetadataCompanionFilesMissing: generatedSidecarStats.missing,
      generatedMetadataRowsMatched: generatedSidecarStats.matchingQuestions,
      generatedMetadataRowsUnmatched: generatedSidecarStats.unmatchedQuestions,
      generatedMetadataUidConflicts: generatedMetadataUidConflictCount,
      duplicateQuestionUidGroups: duplicateUidGroups.length,
      repeatedQuestionUidOccurrences: duplicateUidGroups.reduce((sum, row) => sum + row.occurrenceCount - 1, 0),
      canonicalQuestionUidCount: uidIndex.canonicalQuestionUidCount,
      supplementalUidKeyCount: uidIndex.supplementalUidKeyCount,
      uidKeyCountByIdentitySource: uidIndex.uidKeyCountByIdentitySource
    },
    sourceDbMetadataMissingFiles: dbMetadataMissing.sort(stableCompare),
    sourceIdentityResolutionIssues: fileReports
      .filter(row => row.kind === 'archive-exam' && row.unresolvedSourceOrdinalCount > 0)
      .map(row => ({
        sourcePath: row.sourcePath,
        questionCount: row.questionCount,
        resolvedCanonicalUidCount: row.canonicalUidCount,
        unresolvedSourceOrdinalCount: row.unresolvedSourceOrdinalCount
      }))
      .sort((a, b) => stableCompare(a.sourcePath, b.sourcePath)),
    sourceDbQCountMismatches: qCountMismatches.sort((a, b) => stableCompare(a.sourcePath, b.sourcePath)),
    sourceIdIssues: idIssues.sort((a, b) => stableCompare(a.sourcePath, b.sourcePath)),
    duplicateQuestionUidGroups: duplicateUidGroups,
    generatedConsumerCrossCheck: consumerParity,
    excludedScopes: excluded,
    inputAuthorities: authorities.authority,
    sourceFiles: fileReports.sort((a, b) => stableCompare(a.sourcePath, b.sourcePath)),
    failures: fileFailures.sort((a, b) => stableCompare(a.sourcePath, b.sourcePath))
  };
  writeJson(path.join(outDir, 'manifest.json'), manifest);

  console.log(JSON.stringify({
    status: manifest.status,
    sourceRevision: head,
    sourceFilesDiscovered: files.length,
    sourceFilesExported: fileReports.length,
    sourceFilesFailed: fileFailures.length,
    questionsExported: manifest.counts.exportedQuestionsTotal,
    examDatabaseMetadataMissing: dbMetadataMissing.length,
    generatedConsumerRows: consumerParity.consumerRecordCount,
    generatedConsumerIsDerivedDataOnly: true,
    outDir
  }, null, 2));
  if (fileFailures.length) process.exitCode = 2;
  return manifest;
}

function outputFileForSource(sourcePath) {
  if (sourcePath.startsWith('archive/exams/')) {
    return sourcePath.slice('archive/'.length).replace(/\.js$/i, '.json');
  }
  if (sourcePath.startsWith('archive/generated/lite/v1/')) {
    return sourcePath.slice('archive/'.length).replace(/\.js$/i, '.json');
  }
  throw new Error('UNSUPPORTED_SOURCE_PATH:' + sourcePath);
}

function parseArguments(argv) {
  const args = [...argv];
  let outDir = '';
  while (args.length) {
    const item = args.shift();
    if (item === '--out-dir') outDir = args.shift() || '';
    else if (item === '--help' || item === '-h') return { help: true };
    else throw new Error('UNKNOWN_ARGUMENT:' + item);
  }
  return { outDir };
}

async function main() {
  const args = parseArguments(process.argv.slice(2));
  if (args.help) {
    console.log('Usage: node archive/tools/export-question-json.mjs --out-dir <absolute-or-relative-path-outside-repository>');
    return;
  }
  runExport(args.outDir);
}

const invokedAsScript = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedAsScript) {
  main().catch(error => {
    console.error(JSON.stringify({
      status: 'FAILED',
      code: error?.code || 'EXPORT_FAILED',
      error: String(error?.message || error)
    }, null, 2));
    process.exitCode = 1;
  });
}
