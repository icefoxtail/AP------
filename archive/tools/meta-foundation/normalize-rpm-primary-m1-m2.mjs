#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export const RPM = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0';
export const MASTER_PATH = `${RPM}/00_POLICY/CANONICAL_MASTER.json`;
export const CROSSWALK_DIR = 'archive/data/meta-foundation/crosswalks/rpm-primary-v1.0';
export const CANONICAL_DIR = 'archive/data/meta-foundation/canonical';
export const EVIDENCE_DIR = 'archive/data/meta-foundation/evidence/rpm-primary-v1.0/m1-m2-normalization';
export const BASE_MAIN_SHA = '2a425e2a970c00c20bba87f3eb9301b4359c106d';
const CURRICULA = ['2015', '2022'];
const GRADES = ['M1', 'M2'];
const SCOPES = { M1: ['M1-1', 'M1-2'], M2: ['M2-1', 'M2-2'] };
const SCOPE_ORDER = ['M1-1', 'M1-2', 'M2-1', 'M2-2'];
const STATUS_SET = new Set(['DIRECT_ACTIVE', 'FAMILY_ACTIVE', 'DIRECT_BINDING_GAP', 'FAMILY_BINDING_GAP', 'RPM_ONLY']);

const readText = relative => fs.readFileSync(path.join(ROOT, relative), 'utf8').replace(/^\uFEFF/, '');
const readJson = relative => JSON.parse(readText(relative));
const writeJson = (relative, value) => fs.writeFileSync(path.join(ROOT, relative), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const fileSha = relative => sha256(fs.readFileSync(path.join(ROOT, relative)));
export const semanticKey = row => [row.curriculum, row.scope, row.rpmPath.majorUnit, row.rpmPath.midUnit, row.rpmPath.l3, row.rpmPath.l4].join('|');
export const masterKey = row => [row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4].join('|');
const activeBindingKey = row => [row.curriculum, row.standardUnitKey, row.subUnitKey || '', row.problemTypeKey].join('|');
const text = value => String(value ?? '').trim();

export function flattenMaster(master, { curricula = CURRICULA, scopes = new Set(SCOPE_ORDER) } = {}) {
  const rows = [];
  for (const block of master.records) {
    if (block.level !== 'middle' || !curricula.includes(block.curriculum) || !scopes.has(block.scope)) continue;
    for (const concept of block.concepts || []) {
      for (const problemType of concept.problemTypes || []) {
        rows.push({
          curriculum: block.curriculum,
          level: block.level,
          scope: block.scope,
          majorUnit: block.majorUnit,
          midUnit: block.midUnit,
          l3: concept.concept,
          l4: problemType.problemType,
          l3Status: concept.status,
          l4Status: problemType.status,
          curriculumApplicability: problemType.curriculumApplicability || concept.curriculumApplicability || block.curriculumApplicability,
          defaultSelectable: problemType.defaultSelectable ?? concept.defaultSelectable ?? block.defaultSelectable,
          rpmSource: block.rpmSource,
          standardUnitKey: '',
          subUnitKey: '',
        });
      }
    }
  }
  rows.sort((a, b) => Number(a.curriculum) - Number(b.curriculum)
    || SCOPE_ORDER.indexOf(a.scope) - SCOPE_ORDER.indexOf(b.scope)
    || master.records.findIndex(x => x.curriculum === a.curriculum && x.scope === a.scope && x.majorUnit === a.majorUnit && x.midUnit === a.midUnit)
      - master.records.findIndex(x => x.curriculum === b.curriculum && x.scope === b.scope && x.majorUnit === b.majorUnit && x.midUnit === b.midUnit));
  return rows;
}

export function parseView(relative, curriculum, scope) {
  const lines = readText(relative).split(/\r?\n/);
  let majorUnit = '';
  let midUnit = '';
  let l3 = '';
  const rows = [];
  for (const line of lines) {
    let match = line.match(/^## L1-[^.]*(?:\.\d+)?\.\s*(.+?)\s*$/);
    if (match) { majorUnit = match[1].trim(); continue; }
    match = line.match(/^### L2-[^.]*(?:\.\d+)?\.\s*(.+?)\s*$/);
    if (match) { midUnit = match[1].trim(); continue; }
    match = line.match(/^#### L3-[^.]*(?:\.\d+)?\.\s*(.+?)\s*$/);
    if (match) { l3 = match[1].replace(/^\d+\.\s*/, '').trim(); continue; }
    match = line.match(/^-\s+\*\*L4-[^*]+\*\*\s+(.+?)\s*$/);
    if (match) {
      const value = match[1].replace(/\s+`?\[RPM_EXTENDED.*$/, '').trim();
      rows.push({ curriculum, scope, majorUnit, midUnit, l3, l4: value });
    }
  }
  return rows;
}

export function scopeViewPaths(curriculum, scope) {
  const dir = curriculum === '2015' ? '01_2015' : '02_2022';
  return `${RPM}/${dir}/MIDDLE/${scope}.md`;
}

export function collectGlobalActive() {
  const index = readJson(`${CANONICAL_DIR}/registry_index.json`);
  const activePackIds = new Set((index.activePacks || []).filter(x => x.status === 'ACTIVE').map(x => x.id));
  const problemTypes = new Map();
  const templates = new Map();
  const bindings = [];
  for (const file of fs.readdirSync(path.join(ROOT, `${CANONICAL_DIR}/packs`), { withFileTypes: true })) {
    if (!file.isDirectory()) continue;
    const pack = file.name;
    const taxonomyPath = `${CANONICAL_DIR}/packs/${pack}/taxonomy.json`;
    const bindingPath = `${CANONICAL_DIR}/packs/${pack}/bindings.json`;
    if (!fs.existsSync(path.join(ROOT, taxonomyPath))) continue;
    const taxonomy = readJson(taxonomyPath);
    if (taxonomy.status !== 'ACTIVE' || !activePackIds.has(taxonomy.ownerPack)) continue;
    for (const row of taxonomy.problemTypes || []) if (row.status === 'ACTIVE') problemTypes.set(row.problemTypeKey, { ...row, packDirectory: pack });
    for (const row of taxonomy.templates || []) if (row.status === 'ACTIVE') templates.set(row.templateKey, { ...row, packDirectory: pack });
    if (fs.existsSync(path.join(ROOT, bindingPath))) {
      const registry = readJson(bindingPath);
      if (registry.status === 'ACTIVE') bindings.push(...(registry.bindings || []).filter(row => row.status === 'ACTIVE').map(row => ({ ...row, packDirectory: pack })));
    }
  }
  const activePacks = (index.activePacks || []).filter(x => x.status === 'ACTIVE').map(x => x.id).sort();
  const registryFingerprint = sha256(JSON.stringify({ index, problemTypes: [...problemTypes.values()], templates: [...templates.values()], bindings }));
  return { index, activePacks, problemTypes, templates, bindings, registryFingerprint };
}

export function exactBindings(global, row) {
  const key = row.problemTypeKey;
  if (!key) return [];
  return global.bindings.filter(binding => binding.problemTypeKey === key
    && binding.curriculum === row.curriculum
    && binding.standardUnitKey === row.standardUnitKey
    && text(binding.subUnitKey) === text(row.subUnitKey));
}

export function viewMismatch(masterRows) {
  const mismatches = [];
  for (const curriculum of CURRICULA) for (const scope of SCOPE_ORDER) {
    const master = masterRows.filter(x => x.curriculum === curriculum && x.scope === scope);
    const view = parseView(scopeViewPaths(curriculum, scope), curriculum, scope);
    const masterSet = new Set(master.map(masterKey));
    const viewSet = new Set(view.map(masterKey));
    for (const key of masterSet) if (!viewSet.has(key)) mismatches.push({ curriculum, scope, direction: 'MASTER_MISSING_FROM_VIEW', key });
    for (const key of viewSet) if (!masterSet.has(key)) mismatches.push({ curriculum, scope, direction: 'VIEW_ORPHAN', key });
  }
  return mismatches;
}

function pathRow(row) {
  return { majorUnit: row.majorUnit, midUnit: row.midUnit, l3: row.l3, l4: row.l4 };
}

function crosswalkStatusCounts(rows) {
  const out = { recordCount: rows.length };
  for (const status of STATUS_SET) out[status] = rows.filter(x => x.mappingStatus === status).length;
  return out;
}

function baselineSnapshot() {
  const master = readJson(MASTER_PATH);
  const rows = flattenMaster(master);
  const global = collectGlobalActive();
  const crosswalks = {};
  for (const grade of GRADES) {
    const filename = `${CROSSWALK_DIR}/middle${grade.slice(1)}.json`;
    const data = readJson(filename);
    crosswalks[grade] = {
      file: filename,
      sha256: fileSha(filename),
      summary: data.summary,
      records: data.records.map(row => ({
        semanticKey: semanticKey(row), id: row.id, mappingStatus: row.mappingStatus,
        problemTypeKey: row.problemTypeKey || '', templateKey: row.templateKey || '',
        templateCandidates: (row.templateCandidates || []).map(x => x.templateKey),
        ownerPack: row.ownerPack || '', bindingStatus: row.bindingStatus || '',
        rpmPath: row.rpmPath, standardUnitKey: row.standardUnitKey, subUnitKey: row.subUnitKey,
      })),
    };
  }
  const initialCrosswalkBySemantic = new Map();
  for (const grade of GRADES) for (const row of crosswalks[grade].records) initialCrosswalkBySemantic.set(row.semanticKey, row);
  const viewSources = [];
  for (const curriculum of CURRICULA) for (const scope of SCOPE_ORDER) {
    const file = scopeViewPaths(curriculum, scope);
    viewSources.push({ curriculum, scope, path: file, sha256: fileSha(file), recordCount: parseView(file, curriculum, scope).length });
  }
  const duplicates = new Map();
  for (const row of rows) {
    const key = `${row.curriculum}|${row.scope}|${row.majorUnit}|${row.midUnit}|${row.l3}|${row.l4}`;
    duplicates.set(key, (duplicates.get(key) || 0) + 1);
  }
  const rhs2015 = rows.filter(x => x.curriculum === '2015' && x.scope === 'M2-2' && x.l3 === '직각삼각형의 합동');
  const artifact = {
    schemaVersion: 'RPM_PRIMARY_M1_M2_BASELINE_AUDIT_v1',
    baseMainSha: BASE_MAIN_SHA,
    initialRpmL4RecordCount: rows.length,
    masterRecordCount: master.records.length,
    masterSha256: fileSha(MASTER_PATH),
    curriculumViews: viewSources,
    rpmRecords: rows.map(row => {
      const source = initialCrosswalkBySemantic.get(masterKey(row));
      return { ...row, initialRpmRecordId: source?.id || '', existingMappingStatus: source?.mappingStatus || 'MISSING_CROSSWALK_ROW',
        existingProblemTypeKey: source?.problemTypeKey || '', existingTemplateKey: source?.templateKey || '',
        existingTemplateCandidates: (source?.templateCandidates || []).map(x => x.templateKey),
        existingBindingStatus: source?.bindingStatus || 'MISSING' };
    }),
    viewParityErrors: viewMismatch(rows),
    duplicateSemanticTupleCount: [...duplicates.values()].filter(count => count > 1).length,
    knownDefectBeforeRepair: {
      expected2015M2_2RhsRhaRows: 2,
      actual2015M2_2RhsRhaRows: rhs2015.length,
      observed2022Rows: readJson(`${CROSSWALK_DIR}/middle2.json`).records.filter(x => x.curriculum === '2022' && x.scope === 'M2-2' && x.rpmPath.l3 === '직각삼각형의 합동'),
      existingGlobalPt: global.problemTypes.get('PT_RIGHT_TRIANGLE_CONGRUENCE') || null,
      binding2015: global.bindings.find(x => x.problemTypeKey === 'PT_RIGHT_TRIANGLE_CONGRUENCE' && x.curriculum === '2015' && x.standardUnitKey === 'M2-05' && x.subUnitKey === 'M2-05-TRIANGLE_PROPERTIES') || null,
    },
    crosswalks,
    globalActiveSnapshot: {
      activePacks: global.activePacks,
      activeProblemTypeCount: global.problemTypes.size,
      activeTemplateCount: global.templates.size,
      exactActiveBindingCount: global.bindings.length,
      registryFingerprint: global.registryFingerprint,
    },
  };
  const output = `${EVIDENCE_DIR}/baseline-snapshot.json`;
  if (fs.existsSync(path.join(ROOT, output)) && !process.argv.includes('--refresh-baseline')) throw new Error(`Refusing to overwrite baseline snapshot: ${output}`);
  writeJson(output, artifact);
  return artifact;
}

function addRhsRhaRecord(master) {
  const already = flattenMaster(master).filter(x => x.curriculum === '2015' && x.scope === 'M2-2' && x.l3 === '직각삼각형의 합동');
  if (already.length === 2 && already.map(x => x.l4).sort().join('|') === 'RHA|RHS') return false;
  if (already.length) throw new Error(`Unexpected partial 2015 RHS/RHA path: ${JSON.stringify(already)}`);
  const block = {
    curriculum: '2015', level: 'middle', scope: 'M2-2',
    majorUnit: '삼각형의 성질', midUnit: '삼각형의 성질', rpmSource: 'RPM_M2_2015',
    majorStatus: 'RPM_VERIFIED', midStatus: 'RPM_VERIFIED',
    concepts: [{
      concept: '직각삼각형의 합동', status: 'CANONICAL_DRAFT',
      problemTypes: [
        { problemType: 'RHS', status: 'CANONICAL_DRAFT', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true },
        { problemType: 'RHA', status: 'CANONICAL_DRAFT', curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true },
      ], curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true,
    }], curriculumApplicability: 'DEFAULT_SCOPE', defaultSelectable: true,
  };
  const insertion = master.records.findIndex(x => x.curriculum === '2015' && x.scope === 'M2-2' && x.majorUnit === '사각형의 성질');
  if (insertion < 0) throw new Error('Cannot find 2015 M2-2 insertion point in RPM master.');
  master.records.splice(insertion, 0, block);
  return true;
}

function repairRpm() {
  const master = readJson(MASTER_PATH);
  const changed = addRhsRhaRecord(master);
  if (changed) writeJson(MASTER_PATH, master);

  const viewPath = `${RPM}/01_2015/MIDDLE/M2-2.md`;
  let view = readText(viewPath);
  const anchor = '## L1-2. 사각형의 성질';
  const section = [
    '### L2-1.3. 삼각형의 성질',
    '',
    '- status: `RPM_VERIFIED`',
    '',
    '#### L3-1.3.1. 직각삼각형의 합동',
    '',
    '- status: `CANONICAL_DRAFT`',
    '',
    '- **L4-1.3.1.1** RHS',
    '- **L4-1.3.1.2** RHA',
    '',
  ].join('\n');
  if (view.includes(anchor) && !view.includes('#### L3-1.3.1. 직각삼각형의 합동')) view = view.replace(anchor, `${section}${anchor}`);
  if (!view.includes('#### L3-1.3.1. 직각삼각형의 합동')) throw new Error('Failed to add 2015 M2-2 RHS/RHA curriculum view.');
  fs.writeFileSync(path.join(ROOT, viewPath), view, 'utf8');

  const l2Path = `${RPM}/00_POLICY/RPM_L1_L2_MATRIX.csv`;
  let l2Csv = readText(l2Path);
  const l2Anchor = '2015,middle,M2-2,사각형의 성질,평행사변형,RPM_M2_2015,RPM_VERIFIED,RPM_VERIFIED\n';
  const l2New = '2015,middle,M2-2,삼각형의 성질,삼각형의 성질,RPM_M2_2015,RPM_VERIFIED,RPM_VERIFIED\n';
  if (!l2Csv.includes(l2Anchor)) throw new Error('Cannot locate L1/L2 matrix order anchor for 2015 M2-2.');
  const normalizedL2Csv = `${l2Csv.replace(l2New, '')}`.replace(l2Anchor, `${l2New}${l2Anchor}`);
  if (normalizedL2Csv !== l2Csv) {
    l2Csv = normalizedL2Csv;
    fs.writeFileSync(path.join(ROOT, l2Path), l2Csv, 'utf8');
  }

  const l4Path = `${RPM}/00_POLICY/L1_L4_CANONICAL_DRAFT_MATRIX.csv`;
  let l4Csv = readText(l4Path);
  const l4Anchor = '2015,middle,M2-2,사각형의 성질,';
  const rows = [
    '2015,middle,M2-2,삼각형의 성질,삼각형의 성질,직각삼각형의 합동,RHS,RPM_VERIFIED,RPM_VERIFIED,CANONICAL_DRAFT,CANONICAL_DRAFT,DEFAULT_SCOPE,True,RPM_M2_2015\n',
    '2015,middle,M2-2,삼각형의 성질,삼각형의 성질,직각삼각형의 합동,RHA,RPM_VERIFIED,RPM_VERIFIED,CANONICAL_DRAFT,CANONICAL_DRAFT,DEFAULT_SCOPE,True,RPM_M2_2015\n',
  ].join('');
  if (!l4Csv.includes(rows)) {
    const at = l4Csv.indexOf(l4Anchor);
    if (at < 0) throw new Error('Cannot insert 2015 M2-2 L4 entries in L1_L4_CANONICAL_DRAFT_MATRIX.csv.');
    l4Csv = `${l4Csv.slice(0, at)}${rows}${l4Csv.slice(at)}`;
    fs.writeFileSync(path.join(ROOT, l4Path), l4Csv, 'utf8');
  }

  const counts = { L1: 0, L2: 0, L3: 0, L4: 0, educationMarkdown: 26, extendedMarkedEntries: 0 };
  const l1Keys = new Set();
  for (const r of master.records) {
    l1Keys.add(`${r.curriculum}|${r.level}|${r.scope}|${r.majorUnit}`);
    counts.L2++;
    for (const l3 of r.concepts || []) {
      counts.L3++;
      if (String(l3.curriculumApplicability || '').startsWith('RPM_EXTENDED')) counts.extendedMarkedEntries++;
      for (const l4 of l3.problemTypes || []) {
        counts.L4++;
        if (String(l4.curriculumApplicability || '').startsWith('RPM_EXTENDED')) counts.extendedMarkedEntries++;
      }
    }
  }
  counts.L1 = l1Keys.size;
  const statsPath = `${RPM}/STATS.json`;
  const stats = readJson(statsPath);
  Object.assign(stats, { L1: counts.L1, L2: counts.L2, L3: counts.L3, L4: counts.L4, extendedMarkedEntries: counts.extendedMarkedEntries });
  writeJson(statsPath, stats);

  refreshRpmPackageManifest();
  refreshRootRulesManifest();
  const after = readJson(MASTER_PATH);
  return { changed, addedRecords: changed ? 1 : 0, addedL3: changed ? 1 : 0, addedL4: changed ? 2 : 0,
    counts: { records: after.records.length, ...counts }, masterSha256: fileSha(MASTER_PATH) };
}

function refreshRpmPackageManifest() {
  const manifestPath = `${RPM}/MANIFEST.json`;
  const manifest = readJson(manifestPath);
  manifest.files = manifest.files.map(item => {
    const abs = path.join(ROOT, RPM, item.path);
    if (!fs.existsSync(abs)) throw new Error(`RPM package manifest file missing: ${item.path}`);
    const buffer = fs.readFileSync(abs);
    return { ...item, bytes: buffer.length, sha256: sha256(buffer) };
  });
  const files = manifest.files.map(item => `    {"path":${JSON.stringify(item.path)},"bytes":${item.bytes},"sha256":${JSON.stringify(item.sha256)}}`).join(',\n');
  const rendered = [
    '{',
    `  "schemaVersion": ${JSON.stringify(manifest.schemaVersion)},`,
    `  "authorityStatus": ${JSON.stringify(manifest.authorityStatus)},`,
    `  "package": ${JSON.stringify(manifest.package)},`,
    '  "files": [',
    files,
    '  ]',
    '}',
    '',
  ].join('\n');
  fs.writeFileSync(path.join(ROOT, manifestPath), rendered, 'utf8');
}

function refreshRootRulesManifest() {
  const manifestPath = 'docs/rules/MANIFEST.md';
  let content = readText(manifestPath);
  const master = fs.readFileSync(path.join(ROOT, MASTER_PATH));
  const row = `- 01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json | ${master.length} bytes | sha256 ${sha256(master)}`;
  const pattern = /^- 01_CANONICAL\/taxonomy\/rpm-primary-v1\.0\/00_POLICY\/CANONICAL_MASTER\.json \| .*$/m;
  if (!pattern.test(content)) throw new Error('Root rules MANIFEST lacks RPM canonical master entry.');
  content = content.replace(pattern, row);
  fs.writeFileSync(path.join(ROOT, manifestPath), content, 'utf8');
}

function refreshDerivedStatsAndManifests() {
  const master = readJson(MASTER_PATH);
  const l1Keys = new Set();
  let l3 = 0;
  let l4 = 0;
  for (const block of master.records) {
    l1Keys.add(`${block.curriculum}|${block.level}|${block.scope}|${block.majorUnit}`);
    l3 += (block.concepts || []).length;
    for (const concept of block.concepts || []) l4 += (concept.problemTypes || []).length;
  }
  const statsPath = `${RPM}/STATS.json`;
  const stats = readJson(statsPath);
  Object.assign(stats, { L1: l1Keys.size, L2: master.records.length, L3: l3, L4: l4 });
  writeJson(statsPath, stats);
  refreshRpmPackageManifest();
  refreshRootRulesManifest();
  return { L1: l1Keys.size, L2: master.records.length, L3: l3, L4: l4, masterSha256: fileSha(MASTER_PATH) };
}

export function validateRpmSources() {
  const master = readJson(MASTER_PATH);
  const rows = flattenMaster(master);
  const errors = [];
  const viewErrors = viewMismatch(rows);
  if (viewErrors.length) errors.push(`RPM_MASTER_VIEW_PARITY:${viewErrors.length}`);
  const semanticKeys = rows.map(row => `${row.curriculum}|${row.scope}|${row.majorUnit}|${row.midUnit}|${row.l3}|${row.l4}`);
  const duplicateKeys = semanticKeys.filter((key, index) => semanticKeys.indexOf(key) !== index);
  if (duplicateKeys.length) errors.push(`RPM_DUPLICATE_SEMANTIC_TUPLE:${duplicateKeys.length}`);

  const l2Csv = readText(`${RPM}/00_POLICY/RPM_L1_L2_MATRIX.csv`).trimEnd().split(/\r?\n/).slice(1);
  const matrixL2 = new Set(l2Csv.map(line => line.split(',').slice(0, 8).join('|')));
  const masterL2 = new Set(master.records.map(row => [row.curriculum, row.level, row.scope, row.majorUnit, row.midUnit, row.rpmSource, row.majorStatus, row.midStatus].join('|')));
  if (matrixL2.size !== l2Csv.length || matrixL2.size !== masterL2.size || [...masterL2].some(key => !matrixL2.has(key))) errors.push('RPM_L1_L2_MATRIX_PARITY');

  const l4Csv = readText(`${RPM}/00_POLICY/L1_L4_CANONICAL_DRAFT_MATRIX.csv`).trimEnd().split(/\r?\n/).slice(1);
  const matrixL4 = new Set(l4Csv.map(line => line.split(',').slice(0, 14).join('|')));
  const masterL4 = new Set();
  for (const row of master.records) for (const concept of row.concepts || []) for (const leaf of concept.problemTypes || []) {
    masterL4.add([row.curriculum, row.level, row.scope, row.majorUnit, row.midUnit, concept.concept, leaf.problemType,
      row.majorStatus, row.midStatus, concept.status, leaf.status, leaf.curriculumApplicability,
      leaf.defaultSelectable ? 'True' : 'False', row.rpmSource].join('|'));
  }
  if (matrixL4.size !== l4Csv.length || matrixL4.size !== masterL4.size || [...masterL4].some(key => !matrixL4.has(key))) errors.push('RPM_L1_L4_MATRIX_PARITY');

  const stats = readJson(`${RPM}/STATS.json`);
  const distinctL1 = new Set(master.records.map(row => `${row.curriculum}|${row.level}|${row.scope}|${row.majorUnit}`)).size;
  const totalL3 = master.records.reduce((sum, row) => sum + (row.concepts || []).length, 0);
  const totalL4 = masterL4.size;
  if (stats.L1 !== distinctL1 || stats.L2 !== master.records.length || stats.L3 !== totalL3 || stats.L4 !== totalL4) errors.push('RPM_STATS_PARITY');
  const packageManifest = readJson(`${RPM}/MANIFEST.json`);
  const manifestErrors = [];
  for (const entry of packageManifest.files || []) {
    const file = path.join(ROOT, RPM, entry.path);
    if (!fs.existsSync(file)) { manifestErrors.push(`MISSING:${entry.path}`); continue; }
    const bytes = fs.readFileSync(file);
    if (bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) manifestErrors.push(`HASH:${entry.path}`);
  }
  if (manifestErrors.length) errors.push(`RPM_PACKAGE_MANIFEST:${manifestErrors.length}`);
  const masterBytes = fs.readFileSync(path.join(ROOT, MASTER_PATH));
  const rootManifest = readText('docs/rules/MANIFEST.md');
  if (!rootManifest.includes(`${masterBytes.length} bytes | sha256 ${sha256(masterBytes)}`)) errors.push('ROOT_RULES_MANIFEST_MASTER_HASH_MISMATCH');

  const rhs = rows.filter(row => row.curriculum === '2015' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동');
  if (rhs.length !== 2 || new Set(rhs.map(row => row.l4)).size !== 2 || !rhs.some(row => row.l4 === 'RHS') || !rhs.some(row => row.l4 === 'RHA')) errors.push('KNOWN_RHS_RHA_2015_REGRESSION');
  return { status: errors.length ? 'FAIL' : 'PASS', errors, rows: rows.length, masterRecordCount: master.records.length,
    l1: distinctL1, l2: master.records.length, l3: totalL3, l4: totalL4,
    viewCount: CURRICULA.length * SCOPE_ORDER.length, viewMismatchCount: viewErrors.length,
    duplicateSemanticTupleCount: duplicateKeys.length, packageManifestEntryCount: packageManifest.files.length,
    knownRhsRha2015Rows: rhs.map(row => ({ scope: row.scope, l3: row.l3, l4: row.l4 })) };
}

function loadBaselineIndex() {
  const file = `${EVIDENCE_DIR}/baseline-snapshot.json`;
  if (!fs.existsSync(path.join(ROOT, file))) throw new Error('Baseline snapshot is required before normalization.');
  const snapshot = readJson(file);
  const out = new Map();
  for (const grade of GRADES) for (const row of snapshot.crosswalks[grade].records) out.set(row.semanticKey, row);
  return out;
}

export function reviewedProblemTypeDisposition(row) {
  const pt = row.problemTypeKey || '';
  const l3 = row.rpmPath.l3;
  const l4 = row.rpmPath.l4;
  if (pt === 'PT_M1_REGULAR_POLYGON_COMPOSITE_ANGLE') return 'REMAP_REGULAR_POLYGON_ANGLE_COUNT';
  if (pt === 'PT_M1_PARALLELISM_CONVERSE') return 'REMAP_PARALLEL_ANGLE_POSITION';
  if (pt === 'PT_LINE_EQUATION' && ['기울기·절편', '그래프 그리기', '일차방정식의 그래프'].includes(l4)) return 'REMAP_LINE_EQUATION_FAMILY';
  if (pt === 'PT_M1_FREQUENCY_DISTRIBUTION_READING') return l4 === '도수분포표 완성' ? 'KEEP_DIRECT' : 'RPM_ONLY_FAMILY_OR_TEMPLATE_TOO_NARROW';
  const unsafe = new Set([
    'PT_ABSOLUTE_VALUE_SIGN_EXTREMES',
    'PT_DIVISOR_COUNT',
    'PT_M1_ALGEBRAIC_EXPRESSION_EVALUATION',
    'PT_M1_DATA_CATEGORY_PERCENTAGE',
    'PT_M1_DATA_ORDER_AND_VALUE',
    'PT_M1_CONTEXT_GRAPH_INTERPRETATION',
    'PT_M1_PROPORTION_PARAMETER_EVALUATION',
    'PT_M1_GCD_LCM_EXPONENT_CONSTRAINT',
    'PT_M1_DIVISOR_MULTIPLE_EXPONENT',
    'PT_M1_PRIME_FACTOR_STRUCTURE',
    'PT_M1_BASIC_CONSTRUCTION',
    'PT_M1_POLYHEDRON_EDGE_FACE_RELATIONS',
    'PT_M1_PARALLELISM_CONVERSE',
    'PT_M1_SEGMENT_LENGTH_RELATIONS',
    'PT_LCM_APPLICATION',
    'PT_M1_COMMON_DIVISIBILITY_FILTER',
  ]);
  if (unsafe.has(pt)) return 'RPM_ONLY_TARGET_TOO_NARROW_OR_FAMILY_INCOMPLETE';
  if (pt === 'PT_DIRECT_INVERSE_PROPORTION_CLASSIFICATION' && /그래프|활용/.test(l4)) return 'RPM_ONLY_TARGET_IS_ALGEBRAIC_CLASSIFIER';
  if (pt === 'PT_M1_BASIC_GEOMETRY_JUDGMENT' && l4 !== '직선·반직선·선분') return 'RPM_ONLY_WRONG_SEMANTIC_TEMPLATE';
  if (pt === 'PT_M1_POLYHEDRON_COMPONENT_COUNT' && l4.includes('관계')) return 'RPM_ONLY_WRONG_SEMANTIC_TEMPLATE';
  if (pt === 'PT_M1_ALGEBRAIC_EXPRESSION_TRANSLATION' && l3 === '일차식') return 'RPM_ONLY_WRONG_PROBLEM_TYPE';
  return 'KEEP_REVIEWED_MAPPING';
}

function applyMappingDecision(row, global) {
  const decision = reviewedProblemTypeDisposition(row);
  if (decision === 'RPM_ONLY_TARGET_TOO_NARROW_OR_FAMILY_INCOMPLETE'
      || decision === 'RPM_ONLY_TARGET_IS_ALGEBRAIC_CLASSIFIER'
      || decision === 'RPM_ONLY_WRONG_SEMANTIC_TEMPLATE'
      || decision === 'RPM_ONLY_WRONG_PROBLEM_TYPE'
      || decision === 'RPM_ONLY_FAMILY_OR_TEMPLATE_TOO_NARROW') {
    return { ...row, mappingStatus: 'RPM_ONLY', bindingStatus: 'NO_ACTIVE_MAPPING', mappingDispositionMemo: decision };
  }
  if (decision === 'REMAP_REGULAR_POLYGON_ANGLE_COUNT') {
    const problemTypeKey = 'PT_M1_POLYGON_ANGLE_AND_COUNT';
    const templateKey = 'TPL_M1_POLYGON_ANGLE_AND_COUNT_REGULAR_POLYGON_ANGLE';
    return { ...row, mappingStatus: 'DIRECT_ACTIVE', problemTypeKey,
      problemTypeLabelKo: global.problemTypes.get(problemTypeKey)?.canonicalLabelKo || '', ownerPack: global.problemTypes.get(problemTypeKey)?.ownerPack || '',
      templateKey, templateLabelKo: global.templates.get(templateKey)?.canonicalLabelKo || '', templateCandidates: undefined,
      selectionRule: undefined, mappingDispositionMemo: 'REMAP_TO_BROADER_ACTIVE_POLYGON_ANGLE_AND_COUNT' };
  }
  if (decision === 'REMAP_PARALLEL_ANGLE_POSITION') {
    const problemTypeKey = 'PT_M1_PARALLEL_ANGLE_POSITION';
    const templateKey = 'TPL_M1_PARALLEL_ANGLE_POSITION_ANGLE_POSITION_CLAIM_AUDIT';
    return { ...row, mappingStatus: 'DIRECT_ACTIVE', problemTypeKey,
      problemTypeLabelKo: global.problemTypes.get(problemTypeKey)?.canonicalLabelKo || '', ownerPack: global.problemTypes.get(problemTypeKey)?.ownerPack || '',
      templateKey, templateLabelKo: global.templates.get(templateKey)?.canonicalLabelKo || '', templateCandidates: undefined,
      selectionRule: undefined, mappingDispositionMemo: 'REMAP_TO_ACTIVE_PARALLEL_ANGLE_CRITERION_TEMPLATE' };
  }
  if (decision === 'REMAP_LINE_EQUATION_FAMILY') {
    const templateKeys = ['TPL_LINE_GRAPH_BY_COEFFICIENTS', 'TPL_LINE_POINT_SLOPE', 'TPL_LINE_TWO_POINTS', 'TPL_LINE_MULTI_CONDITION'];
    return { ...row, mappingStatus: 'FAMILY_BINDING_GAP', templateKey: undefined, templateLabelKo: undefined,
      templateCandidates: templateKeys.map(templateKey => ({ templateKey, templateLabelKo: global.templates.get(templateKey)?.canonicalLabelKo || '' })),
      selectionRule: '최종 풀이의 입력 구조에 따라 기울기·절편 계수 판독, 한 점과 기울기, 두 점 또는 복합 조건 후보 중 decisive step과 일치하는 listed template을 선택한다.',
      mappingDispositionMemo: 'DIRECT_TO_COMPLETE_LINE_EQUATION_FAMILY' };
  }
  return row;
}

function rebuildCrosswalks() {
  const baseline = loadBaselineIndex();
  const master = readJson(MASTER_PATH);
  const allRows = flattenMaster(master);
  const global = collectGlobalActive();
  const globalRows = new Map();
  const samePathRows = new Map();
  for (const grade of GRADES) {
    const file = `${CROSSWALK_DIR}/middle${grade.slice(1)}.json`;
    const data = readJson(file);
    for (const row of data.records) samePathRows.set(semanticKey(row), row);
    globalRows.set(grade, data);
  }
  for (const row of allRows) {
    const key = [row.curriculum, row.scope, row.majorUnit, row.midUnit, row.l3, row.l4].join('|');
    const old = samePathRows.get(key);
    if (old) Object.assign(row, { standardUnitKey: old.standardUnitKey, subUnitKey: old.subUnitKey || '' });
    else if (row.curriculum === '2015' && row.scope === 'M2-2' && row.l3 === '직각삼각형의 합동' && ['RHS', 'RHA'].includes(row.l4)) {
      const base = allRows.find(candidate => candidate.curriculum === '2015' && candidate.scope === 'M2-2' && candidate.majorUnit === '삼각형의 성질' && candidate.midUnit === '이등변삼각형');
      if (!base) throw new Error('Missing adjacent M2-05 semantic binding path for restored right-triangle congruence.');
      row.standardUnitKey = 'M2-05';
      row.subUnitKey = 'M2-05-TRIANGLE_PROPERTIES';
    } else throw new Error(`Unplanned new RPM L4 path in ${key}`);
  }

  const outputs = {};
  for (const grade of GRADES) {
    const gradeNo = grade.slice(1);
    const original = globalRows.get(grade);
    const gradeRows = allRows.filter(row => row.scope.startsWith(grade));
    const records = gradeRows.map((flat, index) => {
      const key = [flat.curriculum, flat.scope, flat.majorUnit, flat.midUnit, flat.l3, flat.l4].join('|');
      const currentRow = samePathRows.get(key);
      const baselineRow = baseline.get(key);
      let row = currentRow ? { ...currentRow } : {
        curriculum: flat.curriculum, scope: flat.scope, rpmPath: pathRow(flat),
        standardUnitKey: flat.standardUnitKey, subUnitKey: flat.subUnitKey,
        mappingStatus: 'RPM_ONLY', bindingStatus: 'NO_ACTIVE_MAPPING',
      };
      if (currentRow && baselineRow?.problemTypeKey && currentRow.mappingStatus === 'RPM_ONLY') {
        row = { ...row,
          mappingStatus: baselineRow.mappingStatus,
          problemTypeKey: baselineRow.problemTypeKey,
          templateKey: baselineRow.templateKey || undefined,
          templateCandidates: baselineRow.templateCandidates?.length ? baselineRow.templateCandidates.map(templateKey => ({ templateKey })) : undefined,
          ownerPack: baselineRow.ownerPack || undefined,
          bindingStatus: baselineRow.bindingStatus || 'MISSING',
        };
      }
      row.id = `${grade}-RPM-${String(index + 1).padStart(3, '0')}`;
      row.curriculum = flat.curriculum;
      row.scope = flat.scope;
      row.rpmPath = pathRow(flat);
      row.standardUnitKey = flat.standardUnitKey;
      row.subUnitKey = flat.subUnitKey;
      if (!samePathRows.has(key) && flat.curriculum === '2015' && flat.scope === 'M2-2' && flat.l3 === '직각삼각형의 합동') {
        const templateKey = flat.l4 === 'RHS' ? 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_SIDE' : 'TPL_RIGHT_TRIANGLE_HYPOTENUSE_ANGLE';
        row = { ...row, mappingStatus: 'DIRECT_ACTIVE', problemTypeKey: 'PT_RIGHT_TRIANGLE_CONGRUENCE', templateKey,
          problemTypeLabelKo: global.problemTypes.get('PT_RIGHT_TRIANGLE_CONGRUENCE')?.canonicalLabelKo || '',
          templateLabelKo: global.templates.get(templateKey)?.canonicalLabelKo || '', ownerPack: 'MIDDLE_GEOMETRY',
          bindingStatus: 'ACTIVE', mappingDispositionMemo: 'RESTORE_2015_RHS_RHA_FROM_EXISTING_GLOBAL_ACTIVE' };
      } else {
        const predecision = row.mappingStatus;
        row = applyMappingDecision(row, global);
        if (row.mappingStatus === 'RPM_ONLY') {
          for (const field of ['problemTypeKey', 'problemTypeLabelKo', 'ownerPack', 'templateKey', 'templateLabelKo', 'templateCandidates', 'selectionRule', 'binding']) delete row[field];
          row.bindingStatus = 'NO_ACTIVE_MAPPING';
        } else {
          const keyPt = row.problemTypeKey;
          const problemType = global.problemTypes.get(keyPt);
          if (!problemType || problemType.status !== 'ACTIVE') throw new Error(`Mapped PT is not GLOBAL ACTIVE: ${keyPt}`);
          row.problemTypeLabelKo = problemType.canonicalLabelKo;
          row.ownerPack = problemType.ownerPack;
          const templateKeys = row.templateKey ? [row.templateKey] : (row.templateCandidates || []).map(x => x.templateKey);
          if (!templateKeys.length) throw new Error(`Mapped row has no template key: ${row.id}`);
          for (const templateKey of templateKeys) {
            const template = global.templates.get(templateKey);
            if (!template || template.status !== 'ACTIVE') throw new Error(`Mapped TPL is not GLOBAL ACTIVE: ${templateKey}`);
            if (template.parentProblemTypeKey !== keyPt) throw new Error(`TPL parent mismatch ${templateKey} -> ${keyPt}`);
          }
          if (row.templateKey) row.templateLabelKo = global.templates.get(row.templateKey).canonicalLabelKo;
          if (row.templateCandidates) row.templateCandidates = row.templateCandidates.map(candidate => ({
            templateKey: candidate.templateKey,
            templateLabelKo: global.templates.get(candidate.templateKey).canonicalLabelKo,
          }));
          const activeBinding = exactBindings(global, row).find(binding => binding.status === 'ACTIVE');
          if (activeBinding) {
            row.bindingStatus = 'ACTIVE';
            row.binding = { curriculum: activeBinding.curriculum, standardUnitKey: activeBinding.standardUnitKey,
              subUnitKey: activeBinding.subUnitKey || '', ownerPack: activeBinding.ownerPack };
            if (row.mappingStatus === 'DIRECT_BINDING_GAP') row.mappingStatus = 'DIRECT_ACTIVE';
            if (row.mappingStatus === 'FAMILY_BINDING_GAP') row.mappingStatus = 'FAMILY_ACTIVE';
          } else {
            row.bindingStatus = 'MISSING';
            delete row.binding;
            if (row.mappingStatus === 'DIRECT_ACTIVE') row.mappingStatus = 'DIRECT_BINDING_GAP';
            if (row.mappingStatus === 'FAMILY_ACTIVE') row.mappingStatus = 'FAMILY_BINDING_GAP';
          }
          if (predecision.includes('BINDING_GAP') && activeBinding) row.mappingDispositionMemo = 'EXACT_EXISTING_BINDING_REVALIDATED';
        }
      }
      delete row.mappingDispositionMemo;
      return row;
    });
    const summary = crosswalkStatusCounts(records);
    const data = {
      ...original,
      generatedAgainstMain: BASE_MAIN_SHA,
      activeAuthority: { ...original.activeAuthority, packs: global.activePacks },
      summary,
      records,
    };
    outputs[grade] = data;
  }

  for (const grade of GRADES) writeJson(`${CROSSWALK_DIR}/middle${grade.slice(1)}.json`, outputs[grade]);
  return { outputs, global, allRows };
}

function updateAllRpmViewsDerivedArtifacts() {
  const master = readJson(MASTER_PATH);
  const after = flattenMaster(master);
  const parityErrors = viewMismatch(after);
  const duplicates = new Set();
  const seen = new Set();
  for (const row of after) {
    const key = `${row.curriculum}|${row.scope}|${row.majorUnit}|${row.midUnit}|${row.l3}|${row.l4}`;
    if (seen.has(key)) duplicates.add(key);
    seen.add(key);
  }
  if (parityErrors.length) throw new Error(`RPM master/view parity failed: ${JSON.stringify(parityErrors.slice(0, 5))}`);
  if (duplicates.size) throw new Error(`Duplicate RPM semantic tuple(s): ${[...duplicates].slice(0, 5).join('; ')}`);
  return { rows: after, parityErrors, duplicateSemanticTupleCount: duplicates.size };
}

function main() {
  const command = process.argv[2];
  if (command === '--snapshot-baseline' || command === '--refresh-baseline') {
    const result = baselineSnapshot();
    console.log(JSON.stringify({ status: 'PASS', output: `${EVIDENCE_DIR}/baseline-snapshot.json`, initialRpmL4RecordCount: result.initialRpmL4RecordCount,
      middle1Records: result.crosswalks.M1.records.length, middle2Records: result.crosswalks.M2.records.length,
      known2015RhsRhaRows: result.knownDefectBeforeRepair.actual2015M2_2RhsRhaRows, globalActivePacks: result.globalActiveSnapshot.activePacks }, null, 2));
    return;
  }
  if (command === '--repair-rpm') {
    const result = repairRpm();
    console.log(JSON.stringify({ status: 'PASS', ...result }, null, 2));
    return;
  }
  if (command === '--normalize-crosswalk') {
    const result = rebuildCrosswalks();
    const parity = updateAllRpmViewsDerivedArtifacts();
    console.log(JSON.stringify({ status: 'PASS', middle1: result.outputs.M1.summary, middle2: result.outputs.M2.summary,
      rpmMasterRecords: parity.rows.length, masterViewParityErrors: parity.parityErrors.length, duplicateSemanticTupleCount: parity.duplicateSemanticTupleCount,
      globalActivePackCount: result.global.activePacks.length }, null, 2));
    return;
  }
  if (command === '--refresh-derived-stats-and-manifests') {
    console.log(JSON.stringify({ status: 'PASS', ...refreshDerivedStatsAndManifests() }, null, 2));
    return;
  }
  if (command === '--validate-rpm') {
    const result = validateRpmSources();
    console.log(JSON.stringify(result, null, 2));
    if (result.status !== 'PASS') process.exitCode = 1;
    return;
  }
  throw new Error('Usage: normalize-rpm-primary-m1-m2.mjs --snapshot-baseline | --repair-rpm | --normalize-crosswalk | --refresh-derived-stats-and-manifests');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
