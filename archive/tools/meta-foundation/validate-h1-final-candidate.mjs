#!/usr/bin/env node
/**
 * Fail-closed structural validator for the assembled H1 1170-row metadata candidate.
 * This checks provenance, coverage, registry references and review isolation. It
 * does not assign or judge mathematical semantics and cannot promote candidates.
 *
 * Worker input rows may use common aliases; the final candidate rows use the
 * normalized field contract exercised in validate-h1-final-candidate.test.mjs.
 * Invoke with explicit --source, --candidate, --worker-a/--worker-b/--worker-c,
 * --archive-root, and registry file paths; --candidate-taxonomy is optional and
 * may contain only NEW_CANONICAL_CANDIDATE records.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DENOMINATOR = 1170;
const HASH_RE = /^[a-f0-9]{64}$/;
const KEY_RE = /^[A-Z][A-Z0-9_]*$/;
const DECISION_HASH_ALIASES = ['decisionHash', 'decisionDigest', 'normalizedDecisionHash', 'classificationHash'];
const DECISION_OBJECT_ALIASES = ['decision', 'normalizedDecision', 'classification'];
const DECISION_FIELD_ALIASES = [
  ['problemTypeKey', ['problemTypeKey', 'finalProblemTypeKey', 'l3Key']],
  ['templateKey', ['templateKey', 'finalTemplateKey', 'l4Key']],
  ['primaryMethod', ['primaryMethod', 'primaryMethodKey', 'methodKey']],
  ['decisiveStep', ['decisiveStep', 'decisiveStepKey', 'decisiveStepSummary']],
  ['crossConceptKeys', ['crossConceptKeys', 'crossConcepts', 'supportingConcepts']],
  ['conditionKeys', ['conditionKeys', 'conditions']],
  ['integrationPattern', ['integrationPattern']],
  ['compositionPattern', ['compositionPattern']],
];
const ARG_NAMES = new Set([
  'source', 'candidate', 'worker-a', 'worker-b', 'worker-c', 'archive-root',
  'taxonomy', 'candidate-taxonomy', 'concepts', 'conditions', 'bindings', 'metadata-rules', 'sol-adjudication',
]);

function parseArgs(argv) {
  const args = new Map();
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) throw new Error(`unexpected argument: ${token}`);
    const name = token.slice(2);
    if (!ARG_NAMES.has(name)) throw new Error(`unknown argument: --${name}`);
    if (args.has(name)) throw new Error(`duplicate argument: --${name}`);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) throw new Error(`missing value for --${name}`);
    args.set(name, value);
    i += 1;
  }
  const required = [...ARG_NAMES].filter((name) => !['candidate-taxonomy', 'sol-adjudication'].includes(name));
  const missing = required.filter((name) => !args.has(name));
  if (missing.length) throw new Error(`required flags missing: ${missing.map((name) => `--${name}`).join(' ')}`);
  return Object.fromEntries(args);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function rowsFromParsed(parsed, file) {
  if (Array.isArray(parsed)) return parsed;
  if (parsed && typeof parsed === 'object') {
    for (const key of ['rows', 'items', 'records', 'reviews', 'results']) {
      if (Array.isArray(parsed[key])) return parsed[key];
    }
    if (Object.keys(parsed).length === 0) return [];
  }
  throw new Error(`${file}: expected JSON array, JSONL, or an object with rows/items/records/reviews/results`);
}

function readRows(file, { allowEmpty = false } = {}) {
  const text = fs.readFileSync(file, 'utf8');
  const trimmed = text.trim();
  if (!trimmed) {
    if (allowEmpty) return [];
    throw new Error(`${file}: input is empty`);
  }
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch { /* JSONL objects also begin with `{`; parse one row per line below. */ }
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === 'object' && ['rows', 'items', 'records', 'reviews', 'results'].some((key) => Array.isArray(parsed[key]))) {
      return rowsFromParsed(parsed, file);
    }
    if (trimmed.startsWith('[') && parsed !== undefined) throw new Error(`${file}: JSON array input is not a row array`);
  }
  const lines = trimmed.split(/\r?\n/).filter((line) => line.trim());
  return lines.map((line, index) => {
    try {
      const value = JSON.parse(line);
      if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('row must be an object');
      return value;
    } catch (error) {
      throw new Error(`${file}:${index + 1}: invalid JSONL row (${error.message})`);
    }
  });
}

const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const nonemptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const validSourceOrdinal = (value) => Number.isInteger(Number(value)) && Number(value) > 0;

function firstDefined(record, names) {
  for (const name of names) {
    if (record && Object.hasOwn(record, name) && record[name] !== undefined && record[name] !== null) return record[name];
  }
  return undefined;
}

function identityOf(record) {
  const direct = firstDefined(record, ['sourceIdentity', 'sourceId', 'source_identity']);
  if (typeof direct === 'string' && direct.trim()) return direct.trim();
  return canonicalSourceIdentityOf(record);
}

function canonicalSourceIdentityOf(record) {
  const file = firstDefined(record, ['sourceArchiveFile', 'archiveFile', 'sourceFile']);
  const ordinal = firstDefined(record, ['sourceOrdinal', 'sourceQuestionOrdinal', 'ordinal']);
  if (typeof file === 'string' && validSourceOrdinal(ordinal)) {
    return `${file.replace(/\\/g, '/')}#${Number(ordinal)}`;
  }
  return undefined;
}

function uidOf(record) {
  const value = firstDefined(record, ['questionUid', 'uid', 'qUid']);
  return typeof value === 'string' ? value.trim() : undefined;
}

function familyOf(record) {
  const value = firstDefined(record, ['family', 'workUnit', 'sourceFamily', 'familyKey']);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function valueOfHash(record, kind) {
  const names = {
    sourceFingerprint: ['sourceFingerprint', 'sourceHash', 'source_fingerprint'],
    contentHash: ['contentHash', 'contentSha256', 'content_hash'],
    solutionHash: ['solutionHash', 'solutionSha256', 'solution_hash'],
    inputHash: ['inputBundleSha', 'inputHash', 'inputSha256', 'inputBundleSha256', 'input_hash'],
  };
  return firstDefined(record, names[kind] ?? []);
}

function evidenceRefOf(record) {
  const direct = firstDefined(record, ['evidenceRef', 'evidence_ref', 'reviewEvidenceRef']);
  if (typeof direct === 'string') return direct.trim();
  const refs = firstDefined(record, ['evidenceRefs', 'reviewEvidenceRefs']);
  return Array.isArray(refs) ? refs.find((ref) => typeof ref === 'string' && ref.trim())?.trim() : undefined;
}

function stable(value) {
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  if (!value || typeof value !== 'object') return JSON.stringify(value);
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
}

const NON_DECISION_ALIAS_GROUPS = [
  ['SOURCE_IDENTITY_ALIAS_CONFLICT', ['sourceIdentity', 'sourceId', 'source_identity']],
  ['SOURCE_ARCHIVE_FILE_ALIAS_CONFLICT', ['sourceArchiveFile', 'archiveFile', 'sourceFile']],
  ['SOURCE_ORDINAL_ALIAS_CONFLICT', ['sourceOrdinal', 'sourceQuestionOrdinal', 'ordinal']],
  ['UID_ALIAS_CONFLICT', ['questionUid', 'uid', 'qUid']],
  ['FAMILY_ALIAS_CONFLICT', ['family', 'workUnit', 'sourceFamily', 'familyKey']],
  ['SOURCE_FINGERPRINT_ALIAS_CONFLICT', ['sourceFingerprint', 'sourceHash', 'source_fingerprint']],
  ['CONTENT_HASH_ALIAS_CONFLICT', ['contentHash', 'contentSha256', 'content_hash']],
  ['SOLUTION_HASH_ALIAS_CONFLICT', ['solutionHash', 'solutionSha256', 'solution_hash']],
  ['INPUT_HASH_ALIAS_CONFLICT', ['inputBundleSha', 'inputHash', 'inputSha256', 'inputBundleSha256', 'input_hash']],
  ['SOURCE_JS_HASH_ALIAS_CONFLICT', ['sourceJsSha256', 'sourceFileSha256']],
  ['OWNER_PACK_ALIAS_CONFLICT', ['ownerPack', 'taxonomyOwnerPack']],
  ['STANDARD_UNIT_ALIAS_CONFLICT', ['standardUnitKey', 'currentStandardUnitKey']],
  ['SUB_UNIT_ALIAS_CONFLICT', ['subUnitKey', 'currentSubUnitKey']],
];

function aliasesConflict(record, code, names) {
  const values = names
    .filter((name) => Object.hasOwn(record ?? {}, name) && record[name] !== undefined && record[name] !== null)
    .map((name) => record[name]);
  if (values.length < 2) return false;
  const normalized = values.map((value) => {
    if (code === 'SOURCE_ORDINAL_ALIAS_CONFLICT') return Number(value);
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (code.includes('HASH') || code.includes('FINGERPRINT')) return trimmed.toLowerCase();
    if (code === 'SOURCE_IDENTITY_ALIAS_CONFLICT' || code === 'SOURCE_ARCHIVE_FILE_ALIAS_CONFLICT') return trimmed.replace(/\\/g, '/');
    return trimmed;
  });
  return new Set(normalized.map(stable)).size > 1;
}

function decisionProjection(record) {
  const projection = {};
  for (const [normalized, keys] of DECISION_FIELD_ALIASES) {
    const value = firstDefined(record, keys);
    if (value !== undefined) projection[normalized] = value;
  }
  for (const key of ['crossConceptKeys', 'conditionKeys']) {
    if (Array.isArray(projection[key])) projection[key] = [...projection[key]].sort();
  }
  return projection;
}

function semanticDecisionDigest(record) {
  const projection = decisionProjection(record);
  return Object.keys(projection).length
    ? { digest: sha256(stable(projection)), projection, supplied: true }
    : { supplied: false };
}

function decisionDigest(record) {
  const declaredDigests = DECISION_HASH_ALIASES
    .filter((name) => Object.hasOwn(record ?? {}, name) && record[name] !== undefined && record[name] !== null)
    .map((name) => record[name]);
  const decisionObjects = DECISION_OBJECT_ALIASES
    .filter((name) => Object.hasOwn(record ?? {}, name) && record[name] && typeof record[name] === 'object' && !Array.isArray(record[name]))
    .map((name) => record[name]);
  const outerSemantic = semanticDecisionDigest(record);
  const nestedSemantics = decisionObjects.map(semanticDecisionDigest).filter((result) => result.supplied);
  const nestedObjectDigests = decisionObjects.map((decision) => {
    const normalized = semanticDecisionDigest(decision);
    return normalized.supplied ? normalized.digest : sha256(stable(decision));
  });
  const semantic = nestedSemantics[0] ?? outerSemantic;
  const semanticDigests = [outerSemantic, ...nestedSemantics]
    .filter((result) => result.supplied)
    .map((result) => result.digest);
  let digest;
  if (semantic.supplied) digest = semantic.digest;
  else if (decisionObjects.length) digest = sha256(stable(decisionObjects[0]));
  else if (declaredDigests.length) digest = declaredDigests[0];

  return {
    ...(digest !== undefined ? { digest } : {}),
    supplied: digest !== undefined,
    declaredDigests,
    declaredMismatch: digest !== undefined && declaredDigests.some((value) => value !== digest),
    declaredInvalid: declaredDigests.some((value) => !HASH_RE.test(String(value ?? ''))),
    declaredAliasConflict: new Set(declaredDigests.map((value) => stable(value))).size > 1,
    semanticAliasConflict: new Set(semanticDigests).size > 1 || new Set(nestedObjectDigests).size > 1 ||
      [record, ...decisionObjects].some(decisionFieldAliasesConflict),
  };
}

function decisionFieldAliasesConflict(record) {
  for (const [normalized, aliases] of DECISION_FIELD_ALIASES) {
    const values = aliases
      .filter((name) => Object.hasOwn(record ?? {}, name) && record[name] !== undefined && record[name] !== null)
      .map((name) => record[name])
      .map((value) => (['crossConceptKeys', 'conditionKeys'].includes(normalized) && Array.isArray(value) ? [...value].sort() : value));
    if (new Set(values.map(stable)).size > 1) return true;
  }
  return false;
}

function candidateTaxonomyRows(candidateTaxonomy) {
  if (!candidateTaxonomy || typeof candidateTaxonomy !== 'object') return { problemTypes: [], templates: [], bindings: [] };
  return {
    problemTypes: Array.isArray(candidateTaxonomy.problemTypes) ? candidateTaxonomy.problemTypes : [],
    templates: Array.isArray(candidateTaxonomy.templates) ? candidateTaxonomy.templates : [],
    bindings: Array.isArray(candidateTaxonomy.bindings) ? candidateTaxonomy.bindings : [],
  };
}

function registryMap(records, keyName) {
  const map = new Map();
  for (const record of records) {
    if (record && typeof record[keyName] === 'string') {
      const list = map.get(record[keyName]) ?? [];
      list.push(record);
      map.set(record[keyName], list);
    }
  }
  return map;
}

function makeValidator(argv) {
  const args = parseArgs(argv);
  const sourceRows = readRows(args.source);
  const candidateRows = readRows(args.candidate);
  const workerRows = {
    A: readRows(args['worker-a']),
    B: readRows(args['worker-b']),
    C: readRows(args['worker-c'], { allowEmpty: true }),
  };
  const solRows = args['sol-adjudication'] ? readRows(args['sol-adjudication'], { allowEmpty: true }) : [];
  const taxonomy = readJson(args.taxonomy);
  const concepts = readJson(args.concepts);
  const conditions = readJson(args.conditions);
  const bindings = readJson(args.bindings);
  const metadataRules = readJson(args['metadata-rules']);
  const candidateTaxonomy = args['candidate-taxonomy'] ? readJson(args['candidate-taxonomy']) : null;
  const archiveRoot = path.resolve(args['archive-root']);

  const failures = [];
  const add = (code, record, detail = '') => {
    const uid = uidOf(record);
    const family = familyOf(record) ?? (uid ? familyByUid.get(uid) : undefined) ?? 'UNKNOWN';
    failures.push({ code, questionUid: uid ?? null, family, ...(detail ? { detail } : {}) });
  };
  const familyByUid = new Map();
  for (const record of [...sourceRows, ...candidateRows, ...workerRows.A, ...workerRows.B, ...workerRows.C, ...solRows]) {
    const uid = uidOf(record);
    const family = familyOf(record);
    if (uid && family && !familyByUid.has(uid)) familyByUid.set(uid, family);
  }

  const activeProblemTypes = registryMap(taxonomy.problemTypes ?? [], 'problemTypeKey');
  const activeTemplates = registryMap(taxonomy.templates ?? [], 'templateKey');
  const proposed = candidateTaxonomyRows(candidateTaxonomy);
  const proposedProblemTypes = registryMap(proposed.problemTypes, 'problemTypeKey');
  const proposedTemplates = registryMap(proposed.templates, 'templateKey');
  const conceptMap = registryMap(concepts.concepts ?? [], 'conceptKey');
  const conditionMap = registryMap(conditions.conditions ?? [], 'conditionKey');
  const activeBindings = Array.isArray(bindings.bindings) ? bindings.bindings : [];
  const integrationPatterns = Array.isArray(metadataRules.integrationPatterns) ? new Set(metadataRules.integrationPatterns) : new Set();
  const candidateOnlyKeySet = new Set();

  for (const [name, rows] of [['source', sourceRows], ['candidate', candidateRows], ['A', workerRows.A], ['B', workerRows.B]]) {
    if (rows.length !== DENOMINATOR) add('DENOMINATOR_MISMATCH', null, `${name} rows=${rows.length}, expected=${DENOMINATOR}`);
  }
  if (!taxonomy || !Array.isArray(taxonomy.problemTypes) || !Array.isArray(taxonomy.templates)) add('ACTIVE_TAXONOMY_SCHEMA_INVALID', null);
  if (!concepts || !Array.isArray(concepts.concepts)) add('CONCEPT_REGISTRY_SCHEMA_INVALID', null);
  if (!conditions || !Array.isArray(conditions.conditions)) add('CONDITION_REGISTRY_SCHEMA_INVALID', null);
  if (!bindings || !Array.isArray(bindings.bindings)) add('BINDING_REGISTRY_SCHEMA_INVALID', null);
  if (!integrationPatterns.size) add('INTEGRATION_ENUM_SCHEMA_INVALID', null);
  if (candidateTaxonomy && !['PROMOTION_CANDIDATE', 'NEW_CANONICAL_CANDIDATE'].includes(candidateTaxonomy.status)) {
    add('CANDIDATE_TAXONOMY_STATUS_INVALID', null, 'expected PROMOTION_CANDIDATE or NEW_CANONICAL_CANDIDATE');
  }
  if (candidateTaxonomy) validateCandidateTaxonomyRecords();

  function indexRows(rows, label, { requireSourceIdentity = true } = {}) {
    const byUid = new Map();
    const byIdentity = new Map();
    for (const row of rows) {
      for (const [code, names] of NON_DECISION_ALIAS_GROUPS) {
        if (aliasesConflict(row, code, names)) add(code, row, `input=${label}`);
      }
      const uid = uidOf(row);
      const identity = identityOf(row);
      if (!uid) add(`${label}_UID_MISSING`, row);
      else {
        if (!/^qid_v1_[a-f0-9]{64}$/.test(uid)) add('UID_INVALID', row, 'expected qid_v1_ plus 64 lowercase hex characters');
        if (byUid.has(uid)) add(`${label === 'candidate' || label === 'source' ? 'DUPLICATE' : `WORKER_${label}_DUPLICATE`}_UID`, row);
        else byUid.set(uid, row);
      }
      if (requireSourceIdentity && !identity) add(`${label.toUpperCase()}_SOURCE_IDENTITY_MISSING`, row);
      if (identity) {
        if (byIdentity.has(identity)) add(`${label === 'candidate' || label === 'source' ? 'DUPLICATE' : `WORKER_${label}_DUPLICATE`}_SOURCE_IDENTITY`, row, identity);
        else byIdentity.set(identity, row);
      }
    }
    return { byUid, byIdentity };
  }

  const sourceIndex = indexRows(sourceRows, 'source');
  const candidateIndex = indexRows(candidateRows, 'candidate');
  const workerIndex = {
    A: indexRows(workerRows.A, 'A'),
    B: indexRows(workerRows.B, 'B'),
    C: indexRows(workerRows.C, 'C'),
  };
  const solIndex = indexRows(solRows, 'SOL_ADJUDICATION');
  const finalDecisionDigests = new Map();

  for (const record of [...sourceRows, ...candidateRows, ...workerRows.A, ...workerRows.B, ...workerRows.C]) {
    const uid = uidOf(record);
    const expectedFamily = familyOf(candidateIndex.byUid.get(uid) ?? {}) ?? familyOf(sourceIndex.byUid.get(uid) ?? {});
    const actualFamily = familyOf(record);
    if (expectedFamily && actualFamily && expectedFamily !== actualFamily) add('FAMILY_MISMATCH', record, `expected=${expectedFamily};actual=${actualFamily}`);
  }

  if (sourceIndex.byUid.size !== DENOMINATOR) add('SOURCE_UID_UNIQUENESS_FAILED', null, `unique=${sourceIndex.byUid.size}`);
  if (sourceIndex.byIdentity.size !== DENOMINATOR) add('SOURCE_IDENTITY_UNIQUENESS_FAILED', null, `unique=${sourceIndex.byIdentity.size}`);
  if (candidateIndex.byUid.size !== DENOMINATOR) add('CANDIDATE_UID_UNIQUENESS_FAILED', null, `unique=${candidateIndex.byUid.size}`);
  if (candidateIndex.byIdentity.size !== DENOMINATOR) add('CANDIDATE_SOURCE_IDENTITY_UNIQUENESS_FAILED', null, `unique=${candidateIndex.byIdentity.size}`);

  const sourceIdentityByUid = new Map();
  const sourceContentHashByUid = new Map();
  const sourceSolutionHashByUid = new Map();
  const sourceFileHashCache = new Map();
  for (const source of sourceRows) {
    const uid = uidOf(source);
    if (!uid) continue;
    const identity = identityOf(source);
    const canonicalIdentity = canonicalSourceIdentityOf(source);
    if (canonicalIdentity) sourceIdentityByUid.set(uid, canonicalIdentity);
    if (identity && canonicalIdentity && identity !== canonicalIdentity) {
      add('SOURCE_IDENTITY_NOT_CANONICAL', source, `expected=${canonicalIdentity};actual=${identity}`);
    }
    const sourceFingerprint = valueOfHash(source, 'sourceFingerprint');
    if (!HASH_RE.test(String(sourceFingerprint ?? ''))) add('SOURCE_FINGERPRINT_INVALID', source, 'source inventory fingerprint must be a SHA-256 hex digest');
    if (!validSourceOrdinal(source.sourceOrdinal)) add('SOURCE_ORDINAL_INVALID', source);
    if (!nonemptyString(source.sourceArchiveFile) || !validSourceOrdinal(source.sourceOrdinal)) {
      add('SOURCE_LOCATION_MISSING', source);
    } else {
      const relative = String(source.sourceArchiveFile).replace(/[\\/]+/g, path.sep);
      const resolved = path.resolve(archiveRoot, relative);
      const rel = path.relative(archiveRoot, resolved);
      if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
        add('SOURCE_LOCATION_OUTSIDE_ARCHIVE_ROOT', source);
      } else if (!fs.existsSync(resolved) || !fs.statSync(resolved).isFile()) {
        add('SOURCE_FILE_MISSING', source, String(source.sourceArchiveFile));
      } else {
        if (!sourceFileHashCache.has(resolved)) sourceFileHashCache.set(resolved, sha256(fs.readFileSync(resolved)));
        const currentFileHash = sourceFileHashCache.get(resolved);
        const expectedFileHash = firstDefined(source, ['sourceJsSha256', 'sourceFileSha256']);
        if (!HASH_RE.test(String(expectedFileHash ?? ''))) add('SOURCE_JS_HASH_MISSING', source);
        else if (currentFileHash !== expectedFileHash) add('SOURCE_FILE_HASH_STALE', source, 'current archive bytes differ from source inventory');
      }
    }
    if (typeof source.content !== 'string') add('SOURCE_CONTENT_MISSING', source);
    else sourceContentHashByUid.set(uid, sha256(source.content));
    if (typeof source.solution !== 'string') add('SOURCE_SOLUTION_MISSING', source);
    else sourceSolutionHashByUid.set(uid, sha256(source.solution));
    if (!familyOf(source) && !familyByUid.has(uid)) add('FAMILY_MISSING', source);
  }

  for (const [uid, source] of sourceIndex.byUid) {
    const candidate = candidateIndex.byUid.get(uid);
    if (!candidate) add('CANDIDATE_UID_MISSING', source);
    else {
      const expectedIdentity = sourceIdentityByUid.get(uid);
      if (identityOf(candidate) !== expectedIdentity) add('SOURCE_IDENTITY_MISMATCH', candidate, `expected=${expectedIdentity ?? 'missing'}`);
      validateProvenance(candidate, source, uid, 'CANDIDATE');
      validateCandidate(candidate);
    }
    for (const stage of ['A', 'B']) {
      const worker = workerIndex[stage].byUid.get(uid);
      if (!worker) add(`WORKER_${stage}_COVERAGE_MISSING`, source);
      else {
        if (identityOf(worker) !== sourceIdentityByUid.get(uid)) add(`WORKER_${stage}_SOURCE_IDENTITY_MISMATCH`, worker);
        validateProvenance(worker, source, uid, `WORKER_${stage}`);
        validateWorkerEvidence(worker, stage);
        validateWorkerStatus(worker, stage);
      }
    }
  }
  for (const candidate of candidateRows) {
    const uid = uidOf(candidate);
    if (uid && !sourceIndex.byUid.has(uid)) add('CANDIDATE_UID_UNKNOWN', candidate);
  }
  for (const stage of ['A', 'B', 'C']) {
    for (const worker of workerRows[stage]) {
      const uid = uidOf(worker);
      if (uid && !sourceIndex.byUid.has(uid)) add(`WORKER_${stage}_UID_UNKNOWN`, worker);
      if (stage === 'C' && uid && sourceIndex.byUid.has(uid)) {
        const source = sourceIndex.byUid.get(uid);
        if (identityOf(worker) !== sourceIdentityByUid.get(uid)) add('WORKER_C_SOURCE_IDENTITY_MISMATCH', worker);
        validateProvenance(worker, source, uid, 'WORKER_C');
        validateWorkerEvidence(worker, stage);
        validateWorkerStatus(worker, stage);
      }
    }
  }

  for (const sol of solRows) {
    const uid = uidOf(sol);
    if (!uid) continue;
    const source = sourceIndex.byUid.get(uid);
    if (!source) add('SOL_ADJUDICATION_UID_UNKNOWN', sol);
    else {
      if (identityOf(sol) !== sourceIdentityByUid.get(uid)) add('SOL_ADJUDICATION_SOURCE_IDENTITY_MISMATCH', sol);
      validateProvenance(sol, source, uid, 'SOL_ADJUDICATION');
      validateWorkerStatus(sol, 'SOL_ADJUDICATION');
      validateWorkerEvidence(sol, 'SOL_ADJUDICATION');
    }
  }

  const digests = { A: new Map(), B: new Map(), C: new Map() };
  for (const stage of ['A', 'B', 'C']) {
    for (const worker of workerRows[stage]) {
      const uid = uidOf(worker);
      if (!uid) continue;
      const result = decisionDigest(worker);
      if (!result.supplied) add(`WORKER_${stage}_DECISION_MISSING`, worker);
      else {
        validateDeclaredDecision(worker, result, `WORKER_${stage}`);
        if (!HASH_RE.test(String(result.digest ?? ''))) {
          if (!result.declaredInvalid) add(`WORKER_${stage}_DECISION_HASH_INVALID`, worker);
        } else digests[stage].set(uid, result.digest);
      }
    }
  }

  const workerEvidenceRefs = new Map();
  for (const stage of ['A', 'B', 'C']) {
    for (const worker of workerRows[stage]) {
      const ref = evidenceRefOf(worker);
      if (ref) workerEvidenceRefs.set(ref, { stage, uid: uidOf(worker) });
    }
  }
  for (const candidate of candidateRows) {
    const ref = evidenceRefOf(candidate);
    if (ref) workerEvidenceRefs.set(ref, { stage: 'CANDIDATE', uid: uidOf(candidate) });
  }
  for (const sol of solRows) {
    const ref = evidenceRefOf(sol);
    if (ref) workerEvidenceRefs.set(ref, { stage: 'SOL_ADJUDICATION', uid: uidOf(sol) });
  }

  for (const stage of ['A', 'B', 'C', 'SOL_ADJUDICATION']) {
    const rows = stage === 'SOL_ADJUDICATION' ? solRows : workerRows[stage];
    for (const worker of rows) {
      const uid = uidOf(worker);
      if (!uid) continue;
      const refs = inputRefsOf(worker);
      if (!refs.present) add(`WORKER_${stage}_INPUT_REFS_MISSING`, worker);
      if (refs.invalidAliases.length) add(`WORKER_${stage}_INPUT_REFS_INVALID`, worker, refs.invalidAliases.join(','));
      const forbiddenRefs = refs.values.filter((ref) => {
        const referenced = workerEvidenceRefs.get(ref.evidenceRef);
        return referenced || ['A', 'B', 'C', 'CANDIDATE', 'SOL_ADJUDICATION'].includes(ref.stage);
      });
      const forbiddenAliases = ['forbiddenInputRefs', 'forbiddenInputs'];
      const forbiddenPresent = forbiddenAliases.filter((name) => Object.hasOwn(worker, name));
      const malformedForbidden = forbiddenPresent.filter((name) => !Array.isArray(worker[name]));
      const declaredForbidden = forbiddenPresent.flatMap((name) => Array.isArray(worker[name]) ? worker[name] : []);
      if (!forbiddenPresent.length) add(`WORKER_${stage}_FORBIDDEN_INPUTS_MISSING`, worker);
      if (malformedForbidden.length) add(`WORKER_${stage}_FORBIDDEN_INPUTS_INVALID`, worker, malformedForbidden.join(','));
      if (forbiddenRefs.length || declaredForbidden.length) {
        add('SAME_STAGE_FORBIDDEN_INPUT_LEAKAGE', worker, `references=${forbiddenRefs.length + declaredForbidden.length}`);
      }
    }
  }

  const conflicts = [];
  for (const uid of sourceIndex.byUid.keys()) {
    const aDigest = digests.A.get(uid);
    const bDigest = digests.B.get(uid);
    if (aDigest && bDigest && aDigest !== bDigest) conflicts.push(uid);
  }
  const conflictsSet = new Set(conflicts);
  const expectedSolUids = new Set();
  for (const uid of conflicts) {
    const source = sourceIndex.byUid.get(uid);
    const workerC = workerIndex.C.byUid.get(uid);
    if (!workerC) {
      add('CONFLICT_C_REVIEW_MISSING', source);
      continue;
    }
    const candidate = candidateIndex.byUid.get(uid);
    const resolution = candidate && firstDefined(candidate, ['conflictResolution', 'adjudication']);
    const provenance = String(resolution?.provenance ?? '').toUpperCase();
    if (!resolution || typeof resolution !== 'object' || String(resolution.status ?? '').toUpperCase() !== 'RESOLVED') {
      add('CONFLICT_UNRESOLVED', candidate ?? source);
    } else if (!['LUNA_2_OF_3_CONSENSUS', 'SOL_DIRECT_ADJUDICATION'].includes(provenance)) {
      add('CONFLICT_PROVENANCE_INVALID_FOR_CONFLICT', candidate);
    } else if (provenance === 'LUNA_2_OF_3_CONSENSUS') {
      if (!nonemptyString(resolution.evidenceRef) || resolution.evidenceRef !== evidenceRefOf(workerC)) add('CONFLICT_RESOLUTION_EVIDENCE_MISMATCH', candidate);
      if (digests.C.get(uid) !== digests.A.get(uid) && digests.C.get(uid) !== digests.B.get(uid)) add('CONFLICT_2_OF_3_NOT_SUPPORTED', candidate);
      if (finalDecisionDigests.has(uid) && digests.C.has(uid) && finalDecisionDigests.get(uid) !== digests.C.get(uid)) add('FINAL_DECISION_DIGEST_MISMATCH', candidate);
    } else {
      expectedSolUids.add(uid);
      const sol = solIndex.byUid.get(uid);
      if (!sol) add('SOL_ADJUDICATION_EVIDENCE_MISSING', candidate ?? source);
      else {
        const solDecision = decisionDigest(sol);
        if (solDecision.supplied) validateDeclaredDecision(sol, solDecision, 'SOL_ADJUDICATION');
        if (!solDecision.supplied || !HASH_RE.test(String(solDecision.digest ?? ''))) add('SOL_ADJUDICATION_DECISION_MISSING', sol);
        if (!nonemptyString(resolution.evidenceRef) || resolution.evidenceRef !== evidenceRefOf(sol)) add('SOL_ADJUDICATION_EVIDENCE_MISMATCH', candidate);
      if (finalDecisionDigests.has(uid) && solDecision.supplied && HASH_RE.test(String(solDecision.digest ?? '')) && finalDecisionDigests.get(uid) !== solDecision.digest) add('FINAL_DECISION_DIGEST_MISMATCH', candidate);
      }
    }
  }
  for (const workerC of workerRows.C) {
    const uid = uidOf(workerC);
    if (uid && !conflictsSet.has(uid)) add('WORKER_C_NOT_CONFLICT_UID', workerC);
  }
  for (const uid of sourceIndex.byUid.keys()) {
    if (conflictsSet.has(uid)) continue;
    const candidate = candidateIndex.byUid.get(uid);
    const resolution = candidate && firstDefined(candidate, ['conflictResolution', 'adjudication']);
    if (!resolution || typeof resolution !== 'object' || String(resolution.status ?? '').toUpperCase() !== 'RESOLVED' || String(resolution.provenance ?? '').toUpperCase() !== 'DUAL_LUNA_MATCH') {
      add('DUAL_LUNA_MATCH_PROVENANCE_REQUIRED', candidate ?? sourceIndex.byUid.get(uid));
    }
    if (candidate && finalDecisionDigests.has(uid) && digests.A.has(uid) && finalDecisionDigests.get(uid) !== digests.A.get(uid)) {
      add('FINAL_DECISION_DIGEST_MISMATCH', candidate);
    }
  }
  for (const sol of solRows) {
    const uid = uidOf(sol);
    if (uid && !expectedSolUids.has(uid)) add('SOL_ADJUDICATION_UNEXPECTED_UID', sol);
  }

  const counts = {
    source: sourceRows.length,
    candidate: candidateRows.length,
    workerA: workerRows.A.length,
    workerB: workerRows.B.length,
    workerC: workerRows.C.length,
    solAdjudication: solRows.length,
    uniqueUid: candidateIndex.byUid.size,
    uniqueSourceIdentity: candidateIndex.byIdentity.size,
    conflicts: conflicts.length,
    candidateOnlyKeys: candidateOnlyKeySet.size,
    failures: 0,
  };
  failures.sort((left, right) =>
    lexical(left.code, right.code) ||
    lexical(String(left.family), String(right.family)) ||
    lexical(String(left.questionUid), String(right.questionUid)) ||
    lexical(String(left.detail ?? ''), String(right.detail ?? '')));
  counts.failures = failures.length;
  return {
    schemaVersion: 'h1-final-candidate-validator-v1',
    status: failures.length ? 'FAIL' : 'PASS',
    finalCandidateOnly: true,
    canonicalPromotion: 'NOT_PERFORMED',
    denominator: DENOMINATOR,
    counts,
    failures,
  };

  function validateCandidateTaxonomyRecords() {
    if (!Array.isArray(candidateTaxonomy.problemTypes) || !Array.isArray(candidateTaxonomy.templates) || !Array.isArray(candidateTaxonomy.bindings)) {
      add('CANDIDATE_TAXONOMY_SCHEMA_INVALID', null, 'problemTypes, templates, and bindings must be arrays');
      return;
    }
    const candidateProblemTypes = registryMap(candidateTaxonomy.problemTypes, 'problemTypeKey');
    const candidateTemplates = registryMap(candidateTaxonomy.templates, 'templateKey');
    for (const record of candidateTaxonomy.problemTypes) {
      const key = record?.problemTypeKey;
      if (!nonemptyString(key) || !KEY_RE.test(key)) add('CANDIDATE_TAXONOMY_L3_KEY_INVALID', null, String(key ?? 'missing'));
      if (nonemptyString(key) && activeProblemTypes.has(key)) add('CANDIDATE_TAXONOMY_KEY_COLLIDES_ACTIVE', null, `L3:${key}`);
      if (nonemptyString(key) && candidateProblemTypes.get(key)?.length > 1) add('CANDIDATE_TAXONOMY_L3_DUPLICATE', null, key);
      if (String(record?.status ?? '').toUpperCase() !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_TAXONOMY_RECORD_NOT_CANDIDATE', null, `L3:${key ?? 'missing'} status=${record?.status ?? 'missing'}`);
      if (!nonemptyString(record?.ownerPack)) add('CANDIDATE_TAXONOMY_L3_OWNER_MISSING', null, String(key ?? 'missing'));
    }
    for (const record of candidateTaxonomy.templates) {
      const key = record?.templateKey;
      const parentKey = record?.parentProblemTypeKey;
      if (!nonemptyString(key) || !KEY_RE.test(key)) add('CANDIDATE_TAXONOMY_L4_KEY_INVALID', null, String(key ?? 'missing'));
      if (nonemptyString(key) && activeTemplates.has(key)) add('CANDIDATE_TAXONOMY_KEY_COLLIDES_ACTIVE', null, `L4:${key}`);
      if (nonemptyString(key) && candidateTemplates.get(key)?.length > 1) add('CANDIDATE_TAXONOMY_L4_DUPLICATE', null, key);
      if (String(record?.status ?? '').toUpperCase() !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_TAXONOMY_RECORD_NOT_CANDIDATE', null, `L4:${key ?? 'missing'} status=${record?.status ?? 'missing'}`);
      if (!nonemptyString(parentKey) || !KEY_RE.test(parentKey)) {
        add('CANDIDATE_TAXONOMY_TEMPLATE_PARENT_INVALID', null, `L4:${key ?? 'missing'} parent=${parentKey ?? 'missing'}`);
        continue;
      }
      const parent = candidateProblemTypes.get(parentKey)?.[0] ?? activeProblemTypes.get(parentKey)?.[0];
      if (!parent) add('CANDIDATE_TAXONOMY_TEMPLATE_PARENT_INVALID', null, `L4:${key ?? 'missing'} parent=${parentKey}`);
      else if (!nonemptyString(record?.ownerPack) || record.ownerPack !== parent.ownerPack) {
        add('CANDIDATE_TAXONOMY_TEMPLATE_OWNER_INVALID', null, `L4:${key ?? 'missing'} parent=${parentKey}`);
      }
    }
    for (const binding of proposed.bindings) {
      const key = binding?.problemTypeKey;
      const target = candidateProblemTypes.get(key)?.[0] ?? activeProblemTypes.get(key)?.[0];
      const hasDirectL2 = binding?.subUnitKey === null && binding?.bindingMode === 'STANDARD_UNIT_DIRECT';
      if (!nonemptyString(binding?.curriculum) || !nonemptyString(binding?.standardUnitKey) ||
          (!nonemptyString(binding?.subUnitKey) && !hasDirectL2)) {
        add('CANDIDATE_TAXONOMY_BINDING_LOCATION_INVALID', null, String(key ?? 'missing'));
      }
      if (String(binding?.status ?? '').toUpperCase() !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_TAXONOMY_BINDING_NOT_CANDIDATE', null, `${key ?? 'missing'} status=${binding?.status ?? 'missing'}`);
      if (!target) add('CANDIDATE_TAXONOMY_BINDING_TARGET_INVALID', null, String(key ?? 'missing'));
      else if (!nonemptyString(binding?.ownerPack) || binding.ownerPack !== target.ownerPack) add('CANDIDATE_TAXONOMY_BINDING_OWNER_INVALID', null, String(key ?? 'missing'));
      const collides = activeBindings.some((active) =>
        active.problemTypeKey === key && active.curriculum === binding.curriculum &&
        active.standardUnitKey === binding.standardUnitKey && (active.subUnitKey ?? null) === (binding.subUnitKey ?? null));
      if (collides) add('CANDIDATE_TAXONOMY_BINDING_COLLIDES_ACTIVE', null, String(key ?? 'missing'));
    }
  }

  function validateProvenance(record, source, uid, prefix) {
    const requirements = [
      ['sourceFingerprint', 'SOURCE_FINGERPRINT_MISSING'],
      ['contentHash', 'CONTENT_HASH_MISSING'],
      ['solutionHash', 'SOLUTION_HASH_MISSING'],
      ['inputHash', 'INPUT_HASH_MISSING'],
    ];
    const expected = {
      sourceFingerprint: valueOfHash(source, 'sourceFingerprint'),
      contentHash: sourceContentHashByUid.get(uid),
      solutionHash: sourceSolutionHashByUid.get(uid),
    };
    for (const [field, missingCode] of requirements) {
      const actual = field === 'inputHash' ? valueOfHash(record, field) : valueOfHash(record, field);
      const label = prefix === 'CANDIDATE' ? missingCode : `${prefix}_${missingCode}`;
      if (actual === undefined || actual === null || actual === '') {
        add(label, record);
        continue;
      }
      if (!HASH_RE.test(String(actual))) {
        add(`${prefix}_${field.toUpperCase()}_INVALID`, record);
        continue;
      }
      if (field !== 'inputHash' && expected[field] && actual !== expected[field]) {
        add(`${prefix}_${field.toUpperCase()}_STALE`, record, 'hash differs from current source inventory');
      }
    }
    if (!nonemptyString(evidenceRefOf(record))) add(prefix === 'CANDIDATE' ? 'CANDIDATE_EVIDENCE_REF_MISSING' : `${prefix}_EVIDENCE_REF_MISSING`, record);
  }

  function validateDeclaredDecision(record, result, prefix) {
    if (result.declaredInvalid) add(`${prefix}_DECISION_HASH_INVALID`, record);
    if (result.declaredAliasConflict) add(`${prefix}_DECISION_HASH_ALIAS_CONFLICT`, record);
    if (result.semanticAliasConflict) add(`${prefix}_DECISION_ALIAS_CONFLICT`, record);
    if (result.declaredMismatch && !result.declaredInvalid) add(`${prefix}_DECISION_HASH_STALE`, record);
  }

  function validateWorkerEvidence(worker, stage) {
    const prefix = `WORKER_${stage}`;
    if (!identityOf(worker)) add(`${prefix}_SOURCE_IDENTITY_MISSING`, worker);
  }

  function validateWorkerStatus(worker, stage) {
    const prefix = `WORKER_${stage}`;
    const reviewStatus = String(firstDefined(worker, ['reviewStatus']) ?? '').toUpperCase();
    if (reviewStatus !== 'COMPLETE') add(`${prefix}_REVIEW_STATUS_INVALID`, worker, `reviewStatus=${reviewStatus || 'missing'}`);
    const disposition = String(firstDefined(worker, ['disposition']) ?? '').toUpperCase();
    if (!['CLASSIFIED', 'HOLD'].includes(disposition)) add(`${prefix}_DISPOSITION_INVALID`, worker, `disposition=${disposition || 'missing'}`);
    if (disposition === 'HOLD' && !nonemptyString(firstDefined(worker, ['holdReason', 'holdReasonShort', 'holdReasonCode']))) add(`${prefix}_HOLD_REASON_MISSING`, worker);
  }

  function inputRefsOf(record) {
    const names = ['inputEvidenceRefs', 'reviewInputRefs', 'reviewInputs', 'visibleEvidenceRefs'];
    const values = [];
    const invalidAliases = [];
    let present = false;
    for (const name of names) {
      if (Object.hasOwn(record ?? {}, name)) {
        if (!Array.isArray(record[name])) {
          invalidAliases.push(name);
          continue;
        }
        present = true;
        for (const entry of record[name]) {
          if (typeof entry === 'string') values.push({ evidenceRef: entry, stage: undefined });
          else if (entry && typeof entry === 'object') values.push({
            evidenceRef: firstDefined(entry, ['evidenceRef', 'ref', 'artifactRef']),
            stage: String(firstDefined(entry, ['stage', 'workerStage', 'reviewStage']) ?? '').toUpperCase(),
          });
          else values.push({ evidenceRef: undefined, stage: undefined });
        }
      }
    }
    return { present, values, invalidAliases };
  }

  function validateCandidate(row) {
    const uid = uidOf(row);
    if (!familyOf(row)) add('FAMILY_MISSING', row);
    const disposition = String(firstDefined(row, ['disposition', 'finalDisposition']) ?? '').toUpperCase();
    if (!['CLASSIFIED', 'HOLD'].includes(disposition)) add('UNRESOLVED_CANDIDATE_IN_FINAL', row, `disposition=${disposition || 'missing'}`);
    if (disposition === 'HOLD' && !nonemptyString(firstDefined(row, ['holdReason', 'holdReasonShort', 'holdReasonCode']))) add('HOLD_REASON_MISSING', row);

    const problemTypeKey = firstDefined(row, ['problemTypeKey', 'finalProblemTypeKey', 'l3Key']);
    const templateKey = firstDefined(row, ['templateKey', 'finalTemplateKey', 'l4Key']);
    const rowDisposition = String(firstDefined(row, ['taxonomyDisposition']) ?? '').toUpperCase();
    if (!nonemptyString(problemTypeKey)) add('L3_KEY_MISSING', row);
    else if (!KEY_RE.test(problemTypeKey)) add('L3_KEY_INVALID', row, String(problemTypeKey));
    if (!nonemptyString(templateKey)) add('L4_KEY_MISSING', row);
    else if (!KEY_RE.test(templateKey)) add('L4_KEY_INVALID', row, String(templateKey));
    if (!['ACTIVE', 'NEW_CANONICAL_CANDIDATE'].includes(rowDisposition)) add('TAXONOMY_DISPOSITION_INVALID', row, `disposition=${rowDisposition || 'missing'}`);

    const problemIsActive = nonemptyString(problemTypeKey) && activeProblemTypes.has(problemTypeKey);
    const templateIsActive = nonemptyString(templateKey) && activeTemplates.has(templateKey);
    const problemIsProposed = nonemptyString(problemTypeKey) && proposedProblemTypes.has(problemTypeKey);
    const templateIsProposed = nonemptyString(templateKey) && proposedTemplates.has(templateKey);
    const usesCandidateKey = (!problemIsActive && problemIsProposed) || (!templateIsActive && templateIsProposed);
    const usesUnknownKey = (!problemIsActive && !problemIsProposed) || (!templateIsActive && !templateIsProposed);

    if (rowDisposition === 'NEW_CANONICAL_CANDIDATE' && (problemIsActive || templateIsActive)) add('ACTIVE_KEY_MISLABELED_CANDIDATE', row);
    if (usesCandidateKey && rowDisposition !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_TAXONOMY_DISPOSITION_REQUIRED', row);
    if (usesCandidateKey && !candidateTaxonomy) add('CANDIDATE_TAXONOMY_REQUIRED', row);
    if (rowDisposition === 'NEW_CANONICAL_CANDIDATE' && !candidateTaxonomy && usesUnknownKey) add('CANDIDATE_TAXONOMY_REQUIRED', row);
    if (usesUnknownKey) {
      if (rowDisposition === 'NEW_CANONICAL_CANDIDATE' || problemIsProposed || templateIsProposed) add('CANDIDATE_KEY_NOT_REGISTERED', row);
      else {
        if (!problemIsActive) add('L3_NOT_REGISTERED', row, String(problemTypeKey ?? ''));
        if (!templateIsActive) add('L4_NOT_REGISTERED', row, String(templateKey ?? ''));
      }
    }
    if (problemIsProposed && activeProblemTypes.has(problemTypeKey)) add('CANDIDATE_L3_COLLIDES_ACTIVE', row);
    if (templateIsProposed && activeTemplates.has(templateKey)) add('CANDIDATE_L4_COLLIDES_ACTIVE', row);
    const problemRegistry = problemIsActive ? activeProblemTypes.get(problemTypeKey)?.[0] : problemIsProposed ? proposedProblemTypes.get(problemTypeKey)?.[0] : null;
    const templateRegistry = templateIsActive ? activeTemplates.get(templateKey)?.[0] : templateIsProposed ? proposedTemplates.get(templateKey)?.[0] : null;

    if (problemRegistry) {
      const status = String(problemRegistry.status ?? (problemIsActive ? 'ACTIVE' : '')).toUpperCase();
      if (problemIsActive && status !== 'ACTIVE') add('ACTIVE_L3_STATUS_INVALID', row, `status=${status || 'missing'}`);
      if (problemIsProposed && status !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_L3_STATUS_INVALID', row, `status=${status || 'missing'}`);
    }
    if (templateRegistry) {
      const status = String(templateRegistry.status ?? (templateIsActive ? 'ACTIVE' : '')).toUpperCase();
      if (templateIsActive && status !== 'ACTIVE') add('ACTIVE_L4_STATUS_INVALID', row, `status=${status || 'missing'}`);
      if (templateIsProposed && status !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_L4_STATUS_INVALID', row, `status=${status || 'missing'}`);
      if (templateRegistry.parentProblemTypeKey !== problemTypeKey) add('L4_PARENT_MISMATCH', row, `parent=${templateRegistry.parentProblemTypeKey ?? 'missing'};L3=${problemTypeKey ?? 'missing'}`);
    }

    const ownerPack = firstDefined(row, ['ownerPack', 'taxonomyOwnerPack']);
    if (!nonemptyString(ownerPack)) add('OWNER_PACK_MISSING', row);
    else {
      if (problemRegistry?.ownerPack !== ownerPack) add('L3_OWNER_PACK_MISMATCH', row, `expected=${problemRegistry?.ownerPack ?? 'missing'};actual=${ownerPack}`);
      if (templateRegistry?.ownerPack !== ownerPack) add('L4_OWNER_PACK_MISMATCH', row, `expected=${templateRegistry?.ownerPack ?? 'missing'};actual=${ownerPack}`);
    }
    if (problemIsProposed && !problemIsActive) candidateOnlyKeySet.add(problemTypeKey);
    if (templateIsProposed && !templateIsActive) candidateOnlyKeySet.add(templateKey);

    validateKeyArray(row, ['crossConceptKeys', 'crossConcepts'], 'CROSS_CONCEPT', conceptMap, 'ownerConceptShard');
    validateKeyArray(row, ['conditionKeys', 'conditions'], 'CONDITION', conditionMap);
    const integrationPattern = firstDefined(row, ['integrationPattern']);
    if (!integrationPatterns.has(integrationPattern)) add('INTEGRATION_PATTERN_INVALID', row, String(integrationPattern ?? 'missing'));

    const curriculum = firstDefined(row, ['curriculum']);
    const standardUnitKey = firstDefined(row, ['standardUnitKey', 'currentStandardUnitKey']);
    const subUnitKey = firstDefined(row, ['subUnitKey', 'currentSubUnitKey']);
    const hasDirectL2 = subUnitKey === null && row.bindingResolutionStatus === 'RESOLVED_STANDARD_UNIT_DIRECT';
    if (!nonemptyString(curriculum) || !nonemptyString(standardUnitKey) ||
        (!nonemptyString(subUnitKey) && !hasDirectL2)) {
      add('L2_L3_LOCATION_MISSING', row);
    } else {
      const bindingMatch = activeBindings.some((binding) =>
        binding.curriculum === curriculum &&
        binding.standardUnitKey === standardUnitKey &&
        (binding.subUnitKey ?? null) === (subUnitKey ?? null) &&
        binding.problemTypeKey === problemTypeKey &&
        binding.ownerPack === ownerPack &&
        String(binding.status ?? 'ACTIVE').toUpperCase() === 'ACTIVE');
      const candidateBindingMatch = proposed.bindings.some((binding) =>
        binding.curriculum === curriculum &&
        binding.standardUnitKey === standardUnitKey &&
        (binding.subUnitKey ?? null) === (subUnitKey ?? null) &&
        binding.problemTypeKey === problemTypeKey &&
        binding.ownerPack === ownerPack &&
        String(binding.status ?? '').toUpperCase() === 'NEW_CANONICAL_CANDIDATE');
      if (!bindingMatch && !candidateBindingMatch) add('L2_L3_BINDING_MISSING', row);
      if (candidateBindingMatch && rowDisposition !== 'NEW_CANONICAL_CANDIDATE') add('CANDIDATE_BINDING_DISPOSITION_REQUIRED', row);
    }

    const conflict = firstDefined(row, ['conflictResolution', 'adjudication']);
    if (!conflict || typeof conflict !== 'object') add('CONFLICT_RESOLUTION_MISSING', row);
    else {
      if (String(conflict.status ?? '').toUpperCase() !== 'RESOLVED') add('UNRESOLVED_CONFLICT_PRESENT', row);
      if (!['DUAL_LUNA_MATCH', 'LUNA_2_OF_3_CONSENSUS', 'SOL_DIRECT_ADJUDICATION'].includes(String(conflict.provenance ?? '').toUpperCase())) add('CONFLICT_PROVENANCE_INVALID', row, String(conflict.provenance ?? 'missing'));
    }
    const finalDigest = semanticDecisionDigest(row);
    if (!finalDigest.supplied) add('FINAL_DECISION_DIGEST_MISSING', row);
    else {
      if (decisionFieldAliasesConflict(row)) add('FINAL_DECISION_ALIAS_CONFLICT', row);
      finalDecisionDigests.set(uid, finalDigest.digest);
      const declaredDigests = DECISION_HASH_ALIASES
        .filter((name) => Object.hasOwn(row, name) && row[name] !== undefined && row[name] !== null)
        .map((name) => row[name]);
      if (declaredDigests.some((value) => !HASH_RE.test(String(value ?? '')))) add('FINAL_DECISION_HASH_INVALID', row);
      if (new Set(declaredDigests.map((value) => stable(value))).size > 1) add('FINAL_DECISION_HASH_ALIAS_CONFLICT', row);
      if (declaredDigests.some((value) => value !== finalDigest.digest)) add('FINAL_DECISION_HASH_STALE', row);
    }
    if (uid && !sourceIdentityByUid.has(uid)) add('CANDIDATE_SOURCE_UNKNOWN', row);
  }

  function validateKeyArray(row, names, codePrefix, registry, ownershipField) {
    const values = firstDefined(row, names);
    if (!Array.isArray(values)) {
      add(`${codePrefix}_KEYS_NOT_ARRAY`, row);
      return;
    }
    const seen = new Set();
    for (const key of values) {
      if (!nonemptyString(key) || !KEY_RE.test(key)) {
        add(`${codePrefix}_KEY_INVALID`, row, String(key ?? 'missing'));
        continue;
      }
      if (seen.has(key)) add(`${codePrefix}_KEY_DUPLICATE`, row, key);
      seen.add(key);
      const entry = registry.get(key)?.[0];
      if (!entry) {
        add(`${codePrefix}_NOT_REGISTERED`, row, key);
        continue;
      }
      if (String(entry.status ?? 'ACTIVE').toUpperCase() !== 'ACTIVE') add(`${codePrefix}_STATUS_INVALID`, row, `${key}:${entry.status ?? 'missing'}`);
      if (ownershipField && !nonemptyString(entry[ownershipField])) add(`${codePrefix}_OWNER_MISSING`, row, key);
    }
  }
}

function lexical(left, right) {
  return left === right ? 0 : left < right ? -1 : 1;
}

let report;
try {
  report = makeValidator(process.argv.slice(2));
} catch (error) {
  report = {
    schemaVersion: 'h1-final-candidate-validator-v1',
    status: 'FAIL',
    finalCandidateOnly: true,
    canonicalPromotion: 'NOT_PERFORMED',
    denominator: DENOMINATOR,
    counts: { failures: 1 },
    failures: [{ code: 'INPUT_ERROR', questionUid: null, family: 'UNKNOWN', detail: error.message }],
  };
}
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
if (report.status !== 'PASS') process.exitCode = 1;
