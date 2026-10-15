const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { assertSvgStudentLanguage } = require('./svg-language-contract.cjs');
const { collectSvgAccessibilitySourceIndex, collectChangedSourceScope } = require('./collect-svg-accessibility-source-index.cjs');

const SCHEMA_VERSION = 'SVG_STUDENT_ACCESSIBILITY_V1';
const HASH_RE = /^[a-f0-9]{40}$/;
const SHA256_RE = /^sha256:[a-f0-9]{64}$/;
const ROLES = new Set(['problem', 'solution']);
const PROVENANCE = new Set(['SOURCE_BOUND', 'ASSET_ONLY']);
const REQUIRED_TEXT = [
  'assetRef', 'svgSha256', 'gitBlobSha', 'visualRole', 'titleKo', 'descriptionKo', 'provenanceStatus'
];

function fail(code, detail) {
  throw new Error(`${code}${detail ? `:${detail}` : ''}`);
}

function gitBlobSha(bytes) {
  const header = Buffer.from(`blob ${bytes.length}\0`, 'utf8');
  return crypto.createHash('sha1').update(Buffer.concat([header, bytes])).digest('hex');
}

function decodeXmlText(value) {
  return String(value).replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos);/gi, (entity, body) => {
    const lower = body.toLowerCase();
    if (lower === 'amp') return '&';
    if (lower === 'lt') return '<';
    if (lower === 'gt') return '>';
    if (lower === 'quot') return '"';
    if (lower === 'apos') return "'";
    const codePoint = lower.startsWith('#x') ? Number.parseInt(lower.slice(2), 16) : Number.parseInt(lower.slice(1), 10);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return entity;
    return String.fromCodePoint(codePoint);
  }).trim().replace(/\s+/g, ' ');
}

function svgAccessibilityText(svgBytes, assetRef) {
  const source = svgBytes.toString('utf8');
  const titleMatch = source.match(/<(?:[a-z_][\w.-]*:)?title\b[^>]*>([\s\S]*?)<\/(?:[a-z_][\w.-]*:)?title\s*>/i);
  const descriptionMatch = source.match(/<(?:[a-z_][\w.-]*:)?desc\b[^>]*>([\s\S]*?)<\/(?:[a-z_][\w.-]*:)?desc\s*>/i);
  if (!titleMatch || !descriptionMatch || /<[^>]+>/.test(titleMatch[1]) || /<[^>]+>/.test(descriptionMatch[1])) {
    fail('SVG_ACCESSIBILITY_METADATA_MISSING', assetRef);
  }
  return { titleKo: decodeXmlText(titleMatch[1]), descriptionKo: decodeXmlText(descriptionMatch[1]) };
}

function validateAssetRef(value) {
  if (typeof value !== 'string' || !value || value.includes('\\') || value.includes('?') || value.includes('#') || /%2e|%2f|%5c/i.test(value)) {
    fail('INVALID_SVG_ACCESSIBILITY_ASSET_REF', String(value));
  }
  const normalized = path.posix.normalize(value);
  if (normalized !== value || !normalized.startsWith('assets/') || !normalized.toLowerCase().endsWith('.svg') || normalized.split('/').includes('..')) {
    fail('INVALID_SVG_ACCESSIBILITY_ASSET_REF', String(value));
  }
  return normalized;
}

function validateRecord(record, repoRoot, seen, options = {}) {
  if (!record || typeof record !== 'object' || Array.isArray(record)) fail('INVALID_SVG_ACCESSIBILITY_RECORD');
  for (const key of REQUIRED_TEXT) {
    if (typeof record[key] !== 'string' || !record[key].trim()) fail('INVALID_SVG_ACCESSIBILITY_FIELD', key);
  }
  if (typeof record.sourceExamRef !== 'string' || typeof record.sourceQid !== 'string') {
    fail('INVALID_SVG_ACCESSIBILITY_FIELD', 'sourceExamRef/sourceQid');
  }
  if (!ROLES.has(record.visualRole)) fail('INVALID_SVG_ACCESSIBILITY_ROLE', record.visualRole);
  if (!PROVENANCE.has(record.provenanceStatus)) fail('INVALID_SVG_ACCESSIBILITY_PROVENANCE', record.provenanceStatus);
  if (typeof record.answerHintFree !== 'boolean') fail('INVALID_SVG_ACCESSIBILITY_FIELD', 'answerHintFree');
  const hasSourceRefs = Boolean(record.sourceExamRef.trim() && record.sourceQid.trim());
  if ((record.provenanceStatus === 'SOURCE_BOUND' && !hasSourceRefs)
      || (record.provenanceStatus === 'ASSET_ONLY' && (record.sourceExamRef.trim() || record.sourceQid.trim()))) {
    fail('INVALID_SVG_ACCESSIBILITY_PROVENANCE_REFS', record.assetRef);
  }
  if (record.provenanceStatus === 'ASSET_ONLY' && record.answerHintFree !== false) {
    fail('SVG_ACCESSIBILITY_ASSET_ONLY_NOT_HINT_CLEARED', record.assetRef);
  }
  if (record.visualRole === 'problem' && (record.provenanceStatus !== 'SOURCE_BOUND' || record.answerHintFree !== true)) {
    fail('SVG_ACCESSIBILITY_PROBLEM_NOT_SOURCE_BOUND', record.assetRef);
  }
  if (!SHA256_RE.test(record.svgSha256)) fail('INVALID_SVG_ACCESSIBILITY_SHA256', record.assetRef);
  if (!HASH_RE.test(record.gitBlobSha)) fail('INVALID_SVG_ACCESSIBILITY_GIT_BLOB_SHA', record.assetRef);
  if (!/[\uac00-\ud7a3]/.test(record.titleKo) || !/[\uac00-\ud7a3]/.test(record.descriptionKo)) {
    fail('SVG_ACCESSIBILITY_KOREAN_REQUIRED', record.assetRef);
  }

  const assetRef = validateAssetRef(record.assetRef);
  const roleKey = `${assetRef}\u0000${record.visualRole}`;
  if (seen.has(roleKey)) fail('DUPLICATE_SVG_ACCESSIBILITY_RECORD', `${assetRef}:${record.visualRole}`);
  seen.add(roleKey);

  const assetRoot = path.resolve(repoRoot, 'archive', 'assets');
  const assetPath = path.resolve(repoRoot, 'archive', assetRef);
  if (!assetPath.startsWith(assetRoot + path.sep) || !fs.existsSync(assetPath) || !fs.statSync(assetPath).isFile()) {
    fail('SVG_ACCESSIBILITY_ASSET_NOT_FOUND', assetRef);
  }
  const bytes = fs.readFileSync(assetPath);
  assertSvgStudentLanguage(bytes.toString('utf8'), { assetRef });
  const svgText = svgAccessibilityText(bytes, assetRef);
  if (svgText.titleKo !== record.titleKo.trim() || svgText.descriptionKo !== record.descriptionKo.trim()) {
    fail('SVG_ACCESSIBILITY_METADATA_MISMATCH', `${assetRef}:svg=${JSON.stringify(svgText)}:manifest=${JSON.stringify({ titleKo: record.titleKo.trim(), descriptionKo: record.descriptionKo.trim() })}`);
  }
  const actualSha256 = crypto.createHash('sha256').update(bytes).digest('hex');
  const actualGitBlobSha = gitBlobSha(bytes);
  if (record.svgSha256 !== `sha256:${actualSha256}` || record.gitBlobSha !== actualGitBlobSha) {
    fail('SVG_ACCESSIBILITY_HASH_MISMATCH', `${assetRef}:expected=${record.svgSha256}/${record.gitBlobSha}:actual=sha256:${actualSha256}/${actualGitBlobSha}`);
  }

  return {
    assetRef,
    svgSha256: record.svgSha256,
    gitBlobSha: record.gitBlobSha,
    visualRole: record.visualRole,
    titleKo: record.titleKo.trim(),
    descriptionKo: record.descriptionKo.trim(),
    sourceExamRef: record.sourceExamRef,
    sourceQid: record.sourceQid,
    provenanceStatus: record.provenanceStatus,
    answerHintFree: record.answerHintFree,
    ...(options.semanticClearanceOrigin ? { semanticClearanceOrigin: options.semanticClearanceOrigin } : {})
  };
}

function manifestRecordKey(record) { return `${record.assetRef}\u0000${record.visualRole}`; }

function recordFromCurrentSvg(use, repoRoot, options = {}) {
  const assetRef = validateAssetRef(use.assetRef);
  const assetPath = path.resolve(repoRoot, 'archive', assetRef);
  const assetRoot = path.resolve(repoRoot, 'archive', 'assets');
  if (!assetPath.startsWith(assetRoot + path.sep) || !fs.existsSync(assetPath)) fail('SVG_ACCESSIBILITY_ASSET_NOT_FOUND', assetRef);
  const bytes = fs.readFileSync(assetPath);
  const text = svgAccessibilityText(bytes, assetRef);
  let answerHintFree = false;
  let semanticClearanceOrigin = 'SOLUTION_SURFACE';
  if (use.visualRole === 'problem') {
    if (!['image', 'imageRef', 'problemImage', 'problemImageRef', 'originalProblemImage'].includes(use.sourceField)) {
      fail('SVG_ACCESSIBILITY_PROBLEM_SOURCE_SURFACE_UNSUPPORTED', `${assetRef}:${use.sourceExamRef}:${use.sourceQid}:${use.sourceField}`);
    }
    if (!(use.sourceExamRef.startsWith('archive/exams/')
      || use.sourceExamRef.startsWith('archive/generated/')
      || use.sourceExamRef.startsWith('archive/textbook/'))) {
      fail('SVG_ACCESSIBILITY_PROBLEM_SOURCE_AUTHORITY_UNSUPPORTED', `${assetRef}:${use.sourceExamRef}:${use.sourceQid}`);
    }
    answerHintFree = true;
    semanticClearanceOrigin = use.sourceExamRef.startsWith('archive/generated/')
      ? 'GENERATED_PRODUCTION_SOURCE_IMAGE_BINDING'
      : 'PRODUCTION_SOURCE_IMAGE_BINDING';
  }
  return {
    assetRef,
    svgSha256: `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`,
    gitBlobSha: gitBlobSha(bytes),
    visualRole: use.visualRole,
    ...text,
    sourceExamRef: use.sourceExamRef,
    sourceQid: use.sourceQid,
    provenanceStatus: 'SOURCE_BOUND',
    answerHintFree,
    semanticClearanceOrigin
  };
}

function sourceIndexForCoverage(manifest, sourceIndexPath) {
  if (sourceIndexPath) {
    const bytes = fs.readFileSync(sourceIndexPath);
    return { sourceIndex: JSON.parse(bytes.toString('utf8')), sourceIndexBytes: bytes, sourceIndexPath };
  }
  const sourceIndex = collectSvgAccessibilitySourceIndex();
  const sourceIndexBytes = Buffer.from(JSON.stringify(sourceIndex));
  return { sourceIndex, sourceIndexBytes, sourceIndexPath: null };
}

function productionRows(manifest, repoRoot, scopeOptions) {
  const live = collectSvgAccessibilitySourceIndex({ repoRoot });
  const scope = collectChangedSourceScope({ ...scopeOptions, repoRoot, currentIndex: live });
  for (const assetRef of scope.changedSvgRefs) {
    const bytes = fs.readFileSync(path.resolve(repoRoot, 'archive', assetRef));
    assertSvgStudentLanguage(bytes.toString('utf8'), { assetRef });
  }
  const byKey = new Map();
  for (const row of manifest.records) byKey.set(manifestRecordKey(row), row);
  const usesByKey = new Map();
  for (const entry of live.uses) for (const use of entry.uses) {
    const key = `${entry.assetRef}\u0000${use.visualRole}`;
    if (!usesByKey.has(key)) usesByKey.set(key, []);
    usesByKey.get(key).push(use);
  }
  const scopeRefs = new Set([
    ...manifest.records.map(row => row.assetRef),
    ...scope.changedSvgRefs,
    ...scope.newUses.map(use => use.assetRef)
  ]);
  const seen = new Set();
  const rows = [];
  for (const assetRef of [...scopeRefs].sort()) {
    const uses = live.uses.find(entry => entry.assetRef === assetRef)?.uses || [];
    const roles = new Set(uses.map(use => use.visualRole));
    for (const managed of manifest.records.filter(row => row.assetRef === assetRef)) roles.add(managed.visualRole);
    for (const visualRole of [...roles].sort()) {
      const key = `${assetRef}\u0000${visualRole}`;
      const managed = byKey.get(key);
      const roleUses = usesByKey.get(key) || [];
      const representative = roleUses.find(use => managed && use.sourceExamRef === managed.sourceExamRef && use.sourceQid === managed.sourceQid)
        || roleUses[0];
      if (!representative) {
        if (managed) {
          rows.push(validateRecord(managed, repoRoot, seen, { semanticClearanceOrigin: 'MANAGED_VERIFIED_RECORD' }));
        }
        continue;
      }
      const managedSourceStillBound = managed && roleUses.some(use =>
        use.sourceExamRef === managed.sourceExamRef && use.sourceQid === managed.sourceQid);
      if (managed && managedSourceStillBound) {
        const validated = validateRecord(managed, repoRoot, seen, {
          semanticClearanceOrigin: 'MANAGED_VERIFIED_RECORD'
        });
        rows.push(validated);
      } else {
        const derived = recordFromCurrentSvg(representative, repoRoot);
        rows.push(validateRecord(derived, repoRoot, seen, { semanticClearanceOrigin: derived.semanticClearanceOrigin }));
      }
    }
  }
  const scopedUses = live.uses.filter(entry => scopeRefs.has(entry.assetRef));
  const rosterBytes = Buffer.from(JSON.stringify({ sourceRoots: live.sourceRoots, scopedUses }));
  return {
    rows,
    scope: {
      scopeMode: scope.scopeMode,
      baseRef: scope.baseRef,
      sourceRosterSchemaVersion: live.schemaVersion,
      sourceRosterRoots: live.sourceRoots,
      sourceRosterFileCount: live.jsFilesScanned,
      changedPathCount: scope.changedPaths.length,
      changedSvgCount: scope.changedSvgRefs.length,
      newlyReferencedRoleCount: scope.newUses.length,
      scopedAssetCount: scopeRefs.size,
      sourceRosterSha256: `sha256:${crypto.createHash('sha256').update(rosterBytes).digest('hex')}`,
      sourceIndexBytes: rosterBytes
    }
  };
}

function roleKeysFromSourceIndex(sourceIndex) {
  if (!sourceIndex || sourceIndex.schemaVersion !== 'SVG_LANGUAGE_STAGE3_SOURCE_INDEX_V1' || !Array.isArray(sourceIndex.uses)) {
    fail('INVALID_SVG_ACCESSIBILITY_SOURCE_INDEX');
  }
  const expected = new Map();
  for (const entry of sourceIndex.uses) {
    if (!entry || typeof entry.assetRef !== 'string' || !entry.assetRef.trim()) fail('INVALID_SVG_ACCESSIBILITY_SOURCE_INDEX_ROW');
    const uses = Array.isArray(entry.uses) ? entry.uses : [];
    if (!uses.length) {
      const key = `${entry.assetRef}\u0000solution`;
      if (expected.has(key)) fail('DUPLICATE_SVG_ACCESSIBILITY_SOURCE_INDEX_ROLE', key);
      expected.set(key, { sourceBound: false, sourceRefs: new Set() });
      continue;
    }
    for (const use of uses) {
      if (!use || !ROLES.has(use.visualRole)) fail('INVALID_SVG_ACCESSIBILITY_SOURCE_INDEX_ROLE', entry.assetRef);
      const key = `${entry.assetRef}\u0000${use.visualRole}`;
      if (!expected.has(key)) expected.set(key, { sourceBound: true, sourceRefs: new Set() });
      const expectedUse = expected.get(key);
      if (!use.sourceExamRef || !use.sourceQid) fail('INVALID_SVG_ACCESSIBILITY_SOURCE_INDEX_SOURCE_REF', key);
      expectedUse.sourceRefs.add(`${use.sourceExamRef}\u0000${use.sourceQid}`);
    }
  }
  return expected;
}

function assertManifestCoverage(records, sourceIndex) {
  const expected = roleKeysFromSourceIndex(sourceIndex);
  const actual = new Set(records.map(record => `${record.assetRef}\u0000${record.visualRole}`));
  const missing = [...expected.keys()].filter(key => !actual.has(key)).sort();
  const extra = [...actual].filter(key => !expected.has(key)).sort();
  if (missing.length || extra.length) {
    fail('SVG_ACCESSIBILITY_MANIFEST_COVERAGE_MISMATCH', JSON.stringify({ expectedRoleCount: expected.size, actualRoleCount: actual.size, missing: missing.slice(0, 20), extra: extra.slice(0, 20) }));
  }
  for (const record of records) {
    const key = `${record.assetRef}\u0000${record.visualRole}`;
    const expectedRole = expected.get(key);
    const expectedProvenance = expectedRole.sourceBound ? 'SOURCE_BOUND' : 'ASSET_ONLY';
    if (record.provenanceStatus !== expectedProvenance) {
      fail('SVG_ACCESSIBILITY_PROVENANCE_SOURCE_INDEX_MISMATCH', `${key}:expected=${expectedProvenance}:actual=${record.provenanceStatus}`);
    }
    if (expectedRole.sourceBound && !expectedRole.sourceRefs.has(`${record.sourceExamRef}\u0000${record.sourceQid}`)) {
      fail('SVG_ACCESSIBILITY_SOURCE_REF_NOT_IN_ROSTER', `${key}:sourceExamRef=${record.sourceExamRef}:sourceQid=${record.sourceQid}`);
    }
  }
}

function compileManifest(options) {
  const config = options || {};
  const repoRoot = path.resolve(config.repoRoot || path.resolve(__dirname, '../..'));
  const manifestPath = path.resolve(config.manifestPath || path.join(repoRoot, 'archive/data/svg-accessibility-manifest.v1.json'));
  const explicitAuditPath = config.expectedSourceIndexPath || config.sourceIndexPath || null;
  const sourceIndexPath = explicitAuditPath ? path.resolve(explicitAuditPath) : null;
  const outputPath = path.resolve(config.outputPath || path.join(repoRoot, 'archive/data/svg-accessibility-index.js'));
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (!manifest || manifest.schemaVersion !== SCHEMA_VERSION || !Array.isArray(manifest.records) || manifest.recordCount !== manifest.records.length) {
    fail('INVALID_SVG_ACCESSIBILITY_MANIFEST_SCHEMA');
  }
  let records;
  let sourceIndexBytes;
  let sourceIndexSha256;
  let buildScope;
  if (sourceIndexPath) {
    const audit = sourceIndexForCoverage(manifest, sourceIndexPath);
    sourceIndexBytes = audit.sourceIndexBytes;
    const seen = new Set();
    records = manifest.records.map(record => validateRecord(record, repoRoot, seen));
    assertManifestCoverage(records, audit.sourceIndex);
    buildScope = { scopeMode: 'EXPLICIT_AUDIT_SOURCE_INDEX', sourceIndexPath: path.relative(repoRoot, sourceIndexPath).replace(/\\/g, '/') };
  } else {
    const production = productionRows(manifest, repoRoot, config);
    records = production.rows;
    sourceIndexBytes = production.scope.sourceIndexBytes;
    const { sourceIndexBytes: _sourceIndexBytes, ...publicScope } = production.scope;
    buildScope = publicScope;
  }
  sourceIndexSha256 = crypto.createHash('sha256').update(sourceIndexBytes).digest('hex');
  records.sort((a, b) => (a.assetRef < b.assetRef ? -1 : a.assetRef > b.assetRef ? 1 : a.visualRole < b.visualRole ? -1 : a.visualRole > b.visualRole ? 1 : 0));

  const manifestBytes = fs.readFileSync(manifestPath);
  const payload = JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    ...(sourceIndexPath ? { sourceIndexPath: path.relative(repoRoot, sourceIndexPath).replace(/\\/g, '/') } : {}),
    sourceIndexSha256: `sha256:${sourceIndexSha256}`,
    manifestSha256: `sha256:${crypto.createHash('sha256').update(manifestBytes).digest('hex')}`,
    buildScope,
    records
  });
  const source = `(function(root){\n  'use strict';\n  root.APSvgAccessibilityIndex = Object.freeze(${payload});\n}(typeof window !== 'undefined' ? window : globalThis));\n`;
  if (config.check) {
    if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, 'utf8') !== source) fail('SVG_ACCESSIBILITY_INDEX_STALE', outputPath);
  } else {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    const temporaryPath = `${outputPath}.${process.pid}.tmp`;
    fs.writeFileSync(temporaryPath, source, 'utf8');
    fs.renameSync(temporaryPath, outputPath);
  }
  return {
    recordCount: records.length,
    outputPath,
    sourceIndexSha256: `sha256:${sourceIndexSha256}`,
    ...(sourceIndexPath ? {} : {
      scopeMode: buildScope.scopeMode,
      baseRef: buildScope.baseRef,
      sourceRosterSha256: buildScope.sourceRosterSha256,
      changedPathCount: buildScope.changedPathCount,
      changedSvgCount: buildScope.changedSvgCount,
      newlyReferencedRoleCount: buildScope.newlyReferencedRoleCount,
      scopedAssetCount: buildScope.scopedAssetCount
    })
  };
}

if (require.main === module) {
  try {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--expected-source-index' && args[i + 1]) options.expectedSourceIndexPath = path.resolve(args[++i]);
      else if (args[i] === '--base' && args[i + 1]) options.baseRef = args[++i];
      else if (args[i] === '--check') options.check = true;
      else fail('INVALID_SVG_ACCESSIBILITY_COMPILER_ARGUMENT', args[i]);
    }
    const report = compileManifest(options);
    process.stdout.write(`SVG_ACCESSIBILITY_INDEX_BUILT records=${report.recordCount} sourceIndexSha256=${report.sourceIndexSha256} scope=${report.scopeMode || 'UNKNOWN'} base=${report.baseRef || 'none'} output=${report.outputPath}\n`);
  } catch (error) {
    process.stderr.write(`${error && error.message ? error.message : error}\n`);
    process.exitCode = 1;
  }
}

module.exports = { compileManifest, validateAssetRef, gitBlobSha, roleKeysFromSourceIndex, assertManifestCoverage, SCHEMA_VERSION, productionRows };
