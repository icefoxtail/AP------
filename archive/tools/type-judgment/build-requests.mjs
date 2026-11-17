#!/usr/bin/env node
// Turns direct type-judgment result tables (PICK / NEW_KEY / HOLD) plus the new-key bundle tables into
// official reviewed-exam registration requests (archive-reviewed-exam-meta-register-request-v2).
// Summary mode (default) writes nothing. `--out <dir outside the repository>` writes the request files.
// It never touches the repository, never registers, and never decides a key by itself: every skipped row
// is written to skipped.jsonl with its reason. Rules and the reasons behind them:
// docs/agents/metadata.md ("유형 판정은 직접 판정 결과를 정본으로", "PT/TPL 이름의 굵기").
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadActiveMetaRegistry, curriculumForQuestion } from '../meta-foundation/active-registry.mjs';
import { loadBank } from '../meta-foundation/auto-register-merged-source.mjs';
import { validateReviewedSourceFingerprints } from '../meta-foundation/reviewed-exam-registration-v2.mjs';

export const REQUEST_SCHEMA = 'archive-reviewed-exam-meta-register-request-v2';
export const LEDGER_SCHEMA = 'archive-type-direct-judgment-ledger-v1';
export const KEYS_SCHEMA = 'archive-type-new-keys-evidence-v1';
const EVIDENCE_DIR = 'archive/data/meta-foundation/evidence/reviewed-exam-meta/v1';
const PLAN_DIR = 'docs/plans/archive-one-route-upgrade';
const EXCLUDED_RESULT_FILES = new Set(['비상_미적분1.jsonl']);
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const sha1 = value => crypto.createHash('sha1').update(value).digest('hex');
const eq = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
const text = v => String(v ?? '').trim();
const stableJson = v => JSON.stringify(v, (_, x) => x && !Array.isArray(x) && typeof x === 'object'
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, x[k]])) : x);
export const json = v => JSON.stringify(v, null, 2) + '\n';
export const normalizeExam = v => String(v || '').normalize('NFC').replace(/\\/g, '/').replace(/^\.?\/?archive\/exams\//, '').replace(/^\.?\/?exams\//, '');
// Same predicate the registrar uses for "approved" (reviewed-exam-registration-v2.mjs `approved`).
export const isApprovedRow = row => row?.reviewStatus === 'reviewed_pass' || String(row?.metadataStatus || '').startsWith('approved_');
const approvedField = value => String(value || '').startsWith('approved');
const slugPack = id => id.toLowerCase().replaceAll('_', '-');

// ---------------------------------------------------------------- git / file inputs
const git = (repo, ...args) => execFileSync('git', args, { cwd: repo, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
export function parseJsonl(content, label = 'jsonl') {
  const rows = [];
  content.split('\n').forEach((line, i) => {
    if (!line.trim()) return;
    try { rows.push(JSON.parse(line)); } catch { throw new Error(`BROKEN_JSONL_LINE:${label}:${i + 1}`); }
  });
  return rows;
}
// A source is either { ref } (read through git, repo-relative PLAN_DIR) or { dir } (plain folder, used by tests).
export function readResultTables(repo, sources) {
  const rows = [], commits = [];
  for (const source of sources) {
    const files = [];
    if (source.ref) {
      const commit = git(repo, 'rev-parse', `${source.ref}^{commit}`).trim();
      commits.push({ ref: source.ref, commit });
      for (const file of git(repo, 'ls-tree', '-r', '--name-only', commit, '--', PLAN_DIR).split('\n').filter(Boolean)) {
        if (/\/type-results-[a-z]+\/[^/]+\.jsonl$/.test(file) && !EXCLUDED_RESULT_FILES.has(path.posix.basename(file)))
          files.push({ label: file, read: () => git(repo, 'show', `${commit}:${file}`) });
      }
    } else {
      for (const file of walk(source.dir)) if (/\.jsonl$/.test(file) && !EXCLUDED_RESULT_FILES.has(path.basename(file)))
        files.push({ label: file, read: () => fs.readFileSync(file, 'utf8') });
    }
    for (const file of files.sort((a, b) => a.label.localeCompare(b.label, 'en')))
      for (const row of parseJsonl(file.read(), file.label)) rows.push({ ...row, _file: path.posix.basename(file.label.replaceAll('\\', '/')) });
  }
  return { rows, commits };
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
export function readBundleTables(repo, source) {
  const names = ['new-pt-bundles.json', 'new-pt-assign.jsonl', 'new-tpl-bundles.json', 'new-tpl-assign.jsonl'];
  let read, commit = null;
  if (source.ref) {
    commit = git(repo, 'rev-parse', `${source.ref}^{commit}`).trim();
    read = name => git(repo, 'show', `${commit}:${PLAN_DIR}/type-bundles/${name}`);
  } else read = name => fs.readFileSync(path.join(source.dir, name), 'utf8');
  const [ptBundles, ptAssign, tplBundles, tplAssign] = names.map(name => /\.jsonl$/.test(name) ? parseJsonl(read(name), name) : JSON.parse(read(name)));
  return { ptBundles, ptAssign, tplBundles, tplAssign, commit, ref: source.ref || null };
}

// ---------------------------------------------------------------- repository context
export function loadRepoContext(root, { mainRef = null } = {}) {
  root = fs.realpathSync(root);
  const registry = loadActiveMetaRegistry(root);
  const read = rel => JSON.parse(fs.readFileSync(path.join(root, rel), 'utf8'));
  const packs = new Map();
  for (const name of fs.readdirSync(path.join(root, 'archive/data/meta-foundation/canonical/packs')).sort()) {
    const file = `archive/data/meta-foundation/canonical/packs/${name}/pack.json`;
    if (fs.existsSync(path.join(root, file))) { const doc = read(file); packs.set(doc.packId, doc); }
  }
  const records = new Map(read('archive/data/question_metadata.json').records.map(r => [r.questionUid, r]));
  const master = new Map(read('archive/data/master_tables/js_archive_tag_master.json').map(r => [r.key, r]));
  const identity = new Map(read('archive/data/question_identity_map.json').records.map(r => [r.questionUid, r]));
  const crossKeys = new Set([...registry.concepts.keys(), ...registry.conditions.keys()]);
  let head = null, blobs = null;
  try {
    head = git(root, 'rev-parse', 'HEAD').trim();
    if (mainRef) {
      const changed = git(root, 'diff', '--name-only', mainRef, 'HEAD', '--', 'archive/data/question_metadata.json', 'archive/data/meta-foundation/canonical', 'archive/data/master_tables').trim();
      if (changed) throw new Error(`MAIN_REF_DATA_DIFFERS:${changed.split('\n').slice(0, 3).join(',')}`);
    }
    blobs = new Map();
    for (const line of git(root, 'ls-tree', '-r', 'HEAD', '--', 'archive/exams').split('\n').filter(Boolean)) {
      const m = line.match(/^\d+ blob ([0-9a-f]{40})\t(.+)$/);
      if (m) blobs.set(m[2].replace(/^archive\/exams\//, ''), m[1]);
    }
  } catch (error) { if (String(error.message).startsWith('MAIN_REF_DATA_DIFFERS')) throw error; }
  const banks = new Map();
  return {
    root, registry, packs, records, identity, master, crossKeys, head,
    bank(file) {
      if (!banks.has(file)) banks.set(file, loadBank(fs.readFileSync(path.join(root, 'archive/exams', file), 'utf8'), file));
      return banks.get(file);
    },
    blobSha(file) {
      const bytes = fs.readFileSync(path.join(root, 'archive/exams', file));
      return blobs?.get(file) || sha1(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes]));
    }
  };
}

// ---------------------------------------------------------------- key assignment
export const ptKeyFromBundle = id => id.replace(/^NPT_/, 'PT_');
export const tplKeyFromBundle = id => id.replace(/^NTPL_/, 'TPL_');
// The hint text is Korean free text, so a key cannot be spelled from it: PT suffix + stable 6-hex digest of the text.
export const tplKeyFromHint = (ptKey, hint) => `TPL_${ptKey.replace(/^PT_/, '')}_H${sha1(text(hint).normalize('NFC')).slice(0, 6).toUpperCase()}`;

function bundleIndex(bundles) {
  const b = new Map();
  for (const row of bundles.ptBundles) b.set(row.bundle, row);
  const t = new Map();
  for (const row of bundles.tplBundles) t.set(row.bundle, row);
  return { pt: b, tpl: t,
    ptAssign: new Map(bundles.ptAssign.map(r => [r.uid, r])), tplAssign: new Map(bundles.tplAssign.map(r => [r.uid, r])) };
}

// Decide the target PT/TPL of one result row. Returns { skip } or { pt, tpl, newPt?, newTpl?, ptOnly?, hints }.
export function assignRow(ctx, bundleIdx, row) {
  const R = ctx.registry;
  const active = (map, key) => map.get(key)?.status === 'ACTIVE';
  const hints = { condition: [], cross: [] };
  if (row.decision === 'HOLD') return { skip: 'HOLD' };
  if (row.decision === 'PICK') {
    if (!active(R.problemTypes, row.pt)) return { skip: 'PT_NOT_ACTIVE' };
    let tpl = row.tpl || null, newTpl = null;
    const assign = bundleIdx.tplAssign.get(row.uid);
    if (assign) { hints.condition = assign.conditionHints || []; hints.cross = assign.crossConceptHints || []; }
    if (tpl) {
      if (!active(R.templates, tpl)) return { skip: 'TPL_NOT_ACTIVE' };
      if (R.templates.get(tpl).parentProblemTypeKey !== row.pt) return { skip: 'TPL_PARENT_MISMATCH' };
    } else if (!assign) return { pt: row.pt, tpl: null, ptOnly: true, hints, reason: 'PT_ONLY_NO_TPL_ASSIGN' };
    else {
      if (assign.pt !== row.pt) return { skip: 'TPL_ASSIGN_PT_MISMATCH' };
      if (!assign.bundle) return { pt: row.pt, tpl: null, ptOnly: true, hints, reason: 'PT_ONLY_BUNDLE_NULL' };
      const b = bundleIdx.tpl.get(assign.bundle);
      if (!b) return { skip: 'TPL_BUNDLE_UNKNOWN' };
      if (b.pt !== row.pt) return { skip: 'TPL_BUNDLE_PT_MISMATCH' };
      if (b.absorbInto) {
        if (!active(R.templates, b.absorbInto) || R.templates.get(b.absorbInto).parentProblemTypeKey !== row.pt) return { skip: 'TPL_ABSORB_INVALID' };
        tpl = b.absorbInto;
      } else { tpl = tplKeyFromBundle(b.bundle); newTpl = { key: tpl, pt: row.pt, nameKo: b.nameKo, definition: b.definition, bundle: b.bundle, kind: 'BUNDLE' }; }
    }
    return { pt: row.pt, tpl, newTpl, hints };
  }
  if (row.decision === 'NEW_KEY') {
    const assign = bundleIdx.ptAssign.get(row.uid);
    if (!assign) return { skip: 'NEW_KEY_NOT_IN_PT_ASSIGN' };
    hints.condition = assign.conditionHints || []; hints.cross = assign.crossConceptHints || [];
    if (!assign.bundle) return { skip: 'NEW_KEY_BUNDLE_NULL', hints };
    const b = bundleIdx.pt.get(assign.bundle);
    if (!b) return { skip: 'PT_BUNDLE_UNKNOWN' };
    let pt, newPt = null;
    if (b.absorbInto) {
      if (!active(R.problemTypes, b.absorbInto)) return { skip: 'PT_ABSORB_INVALID' };
      pt = b.absorbInto;
    } else { pt = ptKeyFromBundle(b.bundle); newPt = { key: pt, nameKo: b.nameKo, definition: b.definition, bundle: b.bundle, course: b.course }; }
    const hint = text(assign.tplHint);
    if (!hint) return { pt, tpl: null, newPt, ptOnly: true, hints, reason: 'PT_ONLY_NO_TPL_HINT' };
    // Same hint text inside one PT is one TPL; an existing TPL of an absorbed PT with the same label is reused.
    const same = !newPt && [...R.templates.values()].find(t => t.parentProblemTypeKey === pt && t.status === 'ACTIVE' && text(t.canonicalLabelKo).normalize('NFC') === hint.normalize('NFC'));
    if (same) return { pt, tpl: same.templateKey, newPt, hints };
    const tpl = tplKeyFromHint(pt, hint);
    return { pt, tpl, newPt, newTpl: { key: tpl, pt, nameKo: hint, definition: null, bundle: assign.bundle, kind: 'HINT' }, hints };
  }
  return { skip: 'DECISION_UNKNOWN' };
}

// ---------------------------------------------------------------- per-row eligibility and item
const DEFAULT_FIELDS = ['crossConceptKeys', 'conditionKeys', 'integrationPattern'];
const SOURCE_FIELDS = ['standardCourse', 'standardUnitKey', 'standardUnit', 'subUnitKey', 'subUnit', 'level', 'L3', 'L4',
  'problemTypeKey', 'templateKey', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'difficultyBucket'];
export function scopeOf(ctx, m) {
  return { curriculum: text(m.curriculum || m.curriculumKey) || curriculumForQuestion(m), course: text(m.standardCourse || m.courseKey) };
}
// Eligibility is judged on the current canonical row and the exam source; nothing is repaired here.
const checkFingerprint = (ctx, m, q) => validateReviewedSourceFingerprints({ question: q, metadata: m, identity: ctx.identity.get(m.questionUid) || {}, patch: { before: {}, after: {} } });
// Returns { scope } when the row can be requested, else { skip: <first reason>, all: [every reason found] }.
export function eligibility(ctx, m, q, target) {
  if (!m) return { skip: 'NOT_IN_CANONICAL_METADATA', all: ['NOT_IN_CANONICAL_METADATA'] };
  if (!q) return { skip: 'SOURCE_QUESTION_MISSING', all: ['SOURCE_QUESTION_MISSING'] };
  const all = [];
  const hasType = Boolean(m.problemTypeKey || m.templateKey);
  if (hasType && isApprovedRow(m)) return { skip: 'TYPE_ALREADY_APPROVED', all: ['TYPE_ALREADY_APPROVED'] };
  if (['source_hold', 'route_out'].includes(m.metadataStatus) || ['reviewed_hold', 'route_out', 'HOLD'].includes(m.reviewStatus)) all.push('ROW_ON_EXPLICIT_HOLD');
  const fs_ = m.fieldStatus || {};
  // `ctx.relax` (analysis only, never for real requests) lets a field count without a recorded approval; the value must still exist.
  const relax = ctx.relax || new Set();
  if (!m.standardUnitKey || !(approvedField(fs_.standardUnit) || relax.has('unit'))) all.push('UNIT_NOT_APPROVED');
  if (m.subUnitKey && !(approvedField(fs_.subUnit) || relax.has('subUnit'))) all.push('SUBUNIT_NOT_APPROVED');
  if (!Number.isInteger(m.difficultyBucket) || m.difficultyBucket < 1 || m.difficultyBucket > 5 || !(approvedField(fs_.difficulty) || relax.has('difficulty'))) all.push('DIFFICULTY_NOT_APPROVED');
  const unit = ctx.master.get(m.standardUnitKey), sub = m.subUnitKey && ctx.master.get(m.subUnitKey);
  if (m.standardUnitKey && (unit?.keyType !== 'standardUnitKey' || !['active', 'ACTIVE'].includes(unit.status))) all.push('UNIT_NOT_IN_MASTER');
  else if (m.subUnitKey && (sub?.keyType !== 'subUnitKey' || !['active', 'ACTIVE'].includes(sub.status) || (sub.standardUnitKey || sub.parentKey) !== m.standardUnitKey)) all.push('SUBUNIT_NOT_IN_MASTER');
  // The registrar refuses a row whose stored fingerprint no longer matches its source (the question changed after registration).
  try { (ctx.checkFingerprint || checkFingerprint)(ctx, m, q); }
  catch (error) { all.push(String(error.message).startsWith('source fingerprint drift') ? 'SOURCE_FINGERPRINT_DRIFT' : 'IDENTITY_FINGERPRINT_DRIFT'); }
  const scope = scopeOf(ctx, m);
  if (!scope.curriculum || !scope.course) all.push('CURRICULUM_OR_COURSE_UNKNOWN');
  for (const field of ['problemTypeKey', 'templateKey']) {
    const want = field === 'problemTypeKey' ? target.pt : target.tpl;
    if (Object.hasOwn(q, field) && q[field] !== null && q[field] !== '' && q[field] !== want) { all.push('SOURCE_JS_TYPE_DIFFERS'); break; }
  }
  return all.length ? { skip: all[0], all } : { scope };
}
// Builds { before, after } for one row, or { skip }.
export function buildItemValues(ctx, m, q, target, scope) {
  const after = { problemTypeKey: target.pt, templateKey: target.tpl };
  const defaulted = [];
  const sourceOwn = f => Object.hasOwn(q, f);
  const put = (field, value) => { if (!eq(m[field] ?? null, value)) after[field] = value; };
  for (const field of DEFAULT_FIELDS) {
    const fallback = field === 'integrationPattern' ? 'NONE' : [];
    const value = sourceOwn(field) && q[field] !== null && q[field] !== undefined ? q[field] : (m[field] ?? null);
    if (value === null || value === undefined || value === '') { after[field] = fallback; defaulted.push(field); } else put(field, value);
  }
  if (!text(m.curriculum)) after.curriculum = scope.curriculum;
  if (!text(m.curriculumKey)) after.curriculumKey = scope.curriculum;
  if (!text(m.courseKey)) after.courseKey = scope.course;
  const levelSource = sourceOwn('level') ? q.level : undefined;
  if (levelSource !== undefined && levelSource !== null && levelSource !== '') { if (m.level !== levelSource) after.level = levelSource; }
  const finalLevel = after.level ?? m.level;
  if (sourceOwn('level') && !['하', '중', '상'].includes(finalLevel)) return { skip: 'LEVEL_INVALID' };
  if (!sourceOwn('level') && finalLevel !== undefined && finalLevel !== null && finalLevel !== '' && !['하', '중', '상'].includes(finalLevel)) return { skip: 'LEVEL_INVALID' };
  const final = { ...m, ...after };
  for (const f of SOURCE_FIELDS) {
    if (!Object.hasOwn(q, f) || eq(q[f], final[f])) continue;
    if (['problemTypeKey', 'templateKey'].includes(f) && (q[f] === null || q[f] === '') && !m[f]) continue;
    return { skip: `SOURCE_PARITY:${f}` };
  }
  const before = {};
  for (const f of [...Object.keys(after), 'L1', 'L2', 'L3', 'L4']) before[f] = m[f] ?? null;
  return { before, after, defaulted };
}

// ---------------------------------------------------------------- registry changes (new keys, bindings, pack scope)
// Bundle course -> owner pack where the course has one pack of its own; other courses use the majority owner pack
// of the existing bindings of the same unit (any course alias), and stay undecided when there is none.
export const COURSE_PACK = Object.freeze({ middle1: 'MIDDLE1', middle2: 'MIDDLE2', middle3: 'MIDDLE3', '공통수학1': 'H1_FOUNDATION', '대수': 'ALGEBRA_2022', '기하': 'GEOMETRY', '확률과통계': 'PROBABILITY_STATISTICS' });
function packForNewPt(ctx, rows, course) {
  const fixed = COURSE_PACK[course];
  if (fixed && ctx.packs.has(fixed)) return { pack: fixed, tally: {}, by: 'COURSE_MAP' };
  const tally = new Map();
  for (const { unit } of rows) {
    for (const b of ctx.registry.bindingRows) if (b.standardUnitKey === unit && b.ownerPack) tally.set(b.ownerPack, (tally.get(b.ownerPack) || 0) + 1);
  }
  const ranked = [...tally].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'en'));
  return ranked.length ? { pack: ranked[0][0], tally: Object.fromEntries(ranked), by: 'UNIT_BINDINGS' } : { pack: null, tally: {}, by: null };
}
const siblingLabels = (ctx, scope, unit, sub) => {
  const found = ctx.registry.bindingRows.filter(b => b.curriculum === scope.curriculum && b.standardCourse === scope.course &&
    b.standardUnitKey === unit && (b.subUnitKey ?? null) === (sub ?? null) && b.L1);
  const one = list => (new Set(list).size === 1 ? list[0] : null);
  const L1 = one(found.map(b => b.L1)), L2 = one(found.map(b => b.L2));
  return { L1: L1 || ctx.master.get(unit)?.labelKo || null, L2: L2 || (sub ? ctx.master.get(sub)?.labelKo : null) || '',
    subUnitLabelKo: found[0]?.subUnitLabelKo || (sub ? ctx.master.get(sub)?.labelKo : null) || null };
};

// planned = rows that passed eligibility: { uid, scope, unit, sub, target, ordinal }.
export function planRegistry(ctx, planned, { ptPack: fixedPtPack = null } = {}) {
  const R = ctx.registry;
  const newPt = new Map(), newTpl = new Map(), collisions = [], undecidedPack = [];
  for (const row of planned) {
    for (const [kind, k, map] of [['PT', row.target.newPt, newPt], ['TPL', row.target.newTpl, newTpl]]) {
      if (!k) continue;
      if (R.problemTypes.has(k.key) || R.templates.has(k.key) || ctx.crossKeys.has(k.key)) { collisions.push({ kind, key: k.key, bundle: k.bundle }); continue; }
      const entry = map.get(k.key) || { ...k, uids: [], scopes: [] };
      entry.uids.push(row.uid); entry.scopes.push({ scope: row.scope, unit: row.unit });
      map.set(k.key, entry);
    }
  }
  const collided = new Set(collisions.map(c => c.key));
  const ptPack = new Map();
  for (const [key, e] of newPt) {
    const decided = fixedPtPack?.has(key) ? { pack: fixedPtPack.get(key) } : packForNewPt(ctx, e.scopes, e.course);
    if (!decided.pack) undecidedPack.push({ key, bundle: e.bundle, course: e.course });
    ptPack.set(key, decided.pack);
  }
  const ownerOf = pt => ctx.registry.problemTypes.get(pt)?.ownerPack || ptPack.get(pt) || null;
  const bindings = new Map(), packScope = new Map();
  const blocked = new Set([...collided, ...undecidedPack.map(u => u.key)]);
  for (const row of planned) {
    const { pt, tpl } = row.target;
    if (blocked.has(pt) || blocked.has(tpl)) continue;
    const owner = ownerOf(pt);
    if (!owner) continue;
    const have = R.bindingRows.some(b => b.curriculum === row.scope.curriculum && b.standardCourse === row.scope.course &&
      b.standardUnitKey === row.unit && (b.subUnitKey ?? null) === (row.sub ?? null) && b.problemTypeKey === pt);
    if (!have) {
      const key = [owner, pt, row.scope.curriculum, row.scope.course, row.unit, row.sub ?? ''].join('\0');
      const e = bindings.get(key) || { owner, pt, scope: row.scope, unit: row.unit, sub: row.sub ?? null, uids: [] };
      e.uids.push(row.uid); bindings.set(key, e);
    }
    const need = packScope.get(owner) || { curricula: new Set(), courses: new Set() };
    const meta = ctx.packs.get(owner);
    if (meta && !meta.curricula.includes(row.scope.curriculum)) need.curricula.add(row.scope.curriculum);
    for (const c of [row.scope.course, row.courseKey || row.scope.course]) if (meta && !meta.standardCourses.includes(c)) need.courses.add(c);
    if (need.curricula.size || need.courses.size) packScope.set(owner, need);
  }
  return { newPt, newTpl, ptPack, ownerOf, collisions, undecidedPack, blocked, bindings, packScope };
}

export function registryChangeRows(ctx, plan, evidenceRef) {
  const base = id => `archive/data/meta-foundation/canonical/packs/${slugPack(id)}`;
  const changes = [];
  const evidenceRefs = [evidenceRef];
  const uidsOf = e => [...new Set(e.uids)].sort();
  for (const [key, e] of [...plan.newPt].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    if (plan.blocked.has(key)) continue;
    const owner = plan.ptPack.get(key);
    const units = [...new Set(e.scopes.map(s => s.unit))].sort();
    changes.push({ pack: owner, uids: uidsOf(e), change: { path: `${base(owner)}/taxonomy.json`, collection: 'problemTypes', match: { problemTypeKey: key }, before: null,
      after: { problemTypeKey: key, canonicalLabelKo: e.nameKo, definition: e.definition, aliases: [], status: 'ACTIVE', ownerPack: owner,
        supportingItemCount: uidsOf(e).length, supportingQuestionUids: uidsOf(e).slice(0, 5), sourceUnits: units,
        evidenceProvenance: [{ source: 'TYPE_DIRECT_JUDGMENT_BUNDLE_20261117', bundle: e.bundle, questionUids: uidsOf(e).slice(0, 5) }] }, evidenceRefs } });
  }
  for (const [key, e] of [...plan.newTpl].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    if (plan.blocked.has(key) || plan.blocked.has(e.pt)) continue;
    const owner = ctx.registry.problemTypes.get(e.pt)?.ownerPack || plan.ptPack.get(e.pt);
    if (!owner) continue;
    const units = [...new Set(e.scopes.map(s => s.unit))].sort();
    const definition = e.definition || `${plan.newPt.get(e.pt)?.nameKo || ctx.registry.problemTypes.get(e.pt)?.canonicalLabelKo || e.pt}에서 '${e.nameKo}'을(를) 묻는 유형.`;
    changes.push({ pack: owner, uids: uidsOf(e), change: { path: `${base(owner)}/taxonomy.json`, collection: 'templates', match: { templateKey: key }, before: null,
      after: { templateKey: key, parentProblemTypeKey: e.pt, canonicalLabelKo: e.nameKo, definition, aliases: [], status: 'ACTIVE', ownerPack: owner,
        supportingItemCount: uidsOf(e).length, supportingQuestionUids: uidsOf(e).slice(0, 5), sourceUnits: units,
        evidenceProvenance: [{ source: 'TYPE_DIRECT_JUDGMENT_BUNDLE_20261117', bundle: e.bundle, kind: e.kind, questionUids: uidsOf(e).slice(0, 5) }] }, evidenceRefs } });
  }
  for (const e of [...plan.bindings.values()].sort((a, b) => stableJson(a).localeCompare(stableJson(b), 'en'))) {
    const labels = siblingLabels(ctx, e.scope, e.unit, e.sub);
    const after = { problemTypeKey: e.pt, curriculum: e.scope.curriculum, standardCourse: e.scope.course, standardUnitKey: e.unit, subUnitKey: e.sub,
      subUnitLabelKo: labels.subUnitLabelKo, L1: labels.L1, L2: labels.L2, supportingItemCount: uidsOf(e).length,
      supportingQuestionUids: uidsOf(e).slice(0, 5), status: 'ACTIVE', ownerPack: e.owner };
    changes.push({ pack: e.owner, uids: uidsOf(e), change: { path: `${base(e.owner)}/bindings.json`, collection: 'bindings',
      match: { problemTypeKey: e.pt, curriculum: e.scope.curriculum, standardCourse: e.scope.course, standardUnitKey: e.unit, subUnitKey: e.sub }, before: null, after, evidenceRefs } });
  }
  for (const [owner, need] of [...plan.packScope].sort((a, b) => a[0].localeCompare(b[0], 'en'))) {
    const before = ctx.packs.get(owner);
    const after = { ...before, curricula: [...before.curricula, ...[...need.curricula].sort()], standardCourses: [...before.standardCourses, ...[...need.courses].sort()] };
    changes.push({ pack: owner, uids: [], change: { path: `${base(owner)}/pack.json`, before: structuredClone(before), after, evidenceRefs } });
  }
  return changes;
}

// ---------------------------------------------------------------- main build
export function buildAll({ ctx, resultRows, bundles, only = null, resultCommits = [], review = {} }) {
  const bundleIdx = bundleIndex(bundles);
  const skipped = [], holds = [], conflicts = [], hints = [], ptOnly = [], duplicates = [];
  const seen = new Set();
  const planned = [];
  const skip = (row, reason, extra = {}) => skipped.push({ uid: row.uid, exam: row.exam, no: row.no, reason, decision: row.decision, ...extra });
  for (const row of resultRows) {
    if (seen.has(row.uid)) { duplicates.push({ uid: row.uid, file: row._file }); continue; }
    seen.add(row.uid);
    const m = ctx.records.get(row.uid);
    if (only && normalizeExam(row.exam) !== only) continue;
    if (row.decision === 'HOLD') { holds.push({ uid: row.uid, exam: row.exam, no: row.no, note: row.note ?? null, step: row.step ?? null }); continue; }
    const target = assignRow(ctx, bundleIdx, row);
    if (target.skip) { skip(row, target.skip); continue; }
    if (target.hints && (target.hints.condition.length || target.hints.cross.length))
      hints.push({ uid: row.uid, conditionHints: target.hints.condition, crossConceptHints: target.hints.cross });
    if (!m) { skip(row, 'NOT_IN_CANONICAL_METADATA'); continue; }
    if (normalizeExam(row.exam) !== normalizeExam(m.sourceArchiveFile)) { skip(row, 'EXAM_PATH_MISMATCH'); continue; }
    if (target.ptOnly) { ptOnly.push({ uid: row.uid, exam: row.exam, no: row.no, pt: target.pt, reason: target.reason }); }
    const hasType = Boolean(m.problemTypeKey || m.templateKey);
    if (hasType && isApprovedRow(m)) {
      if (m.problemTypeKey !== target.pt || (target.tpl && m.templateKey !== target.tpl))
        conflicts.push({ uid: row.uid, exam: row.exam, no: row.no, canonical: { problemTypeKey: m.problemTypeKey, templateKey: m.templateKey }, dots: { problemTypeKey: target.pt, templateKey: target.tpl } });
      skip(row, 'TYPE_ALREADY_APPROVED');
      continue;
    }
    if (target.ptOnly) { skip(row, 'PT_ONLY_REGISTRAR_NEEDS_TEMPLATE', { pt: target.pt }); continue; }
    let banks;
    try { banks = ctx.bank(normalizeExam(m.sourceArchiveFile)); } catch (error) { skip(row, 'SOURCE_BANK_UNREADABLE', { error: String(error.message).slice(0, 120) }); continue; }
    const q = banks[m.sourceOrdinal - 1];
    const elig = eligibility(ctx, m, q, target);
    if (elig.skip) { skip(row, elig.skip, { all: elig.all }); continue; }
    const values = buildItemValues(ctx, m, q, target, elig.scope);
    if (values.skip) { skip(row, values.skip); continue; }
    planned.push({ uid: row.uid, row, m, target, scope: elig.scope, unit: m.standardUnitKey, sub: m.subUnitKey ?? null, courseKey: m.courseKey || elig.scope.course,
      source: normalizeExam(m.sourceArchiveFile), ordinal: m.sourceOrdinal, values });
  }
  // New keys and bindings are decided on the rows that passed; rows tied to a blocked key drop out here.
  const plan = planRegistry(ctx, planned);
  const final = [];
  for (const p of planned) {
    const blockedBy = [p.target.pt, p.target.tpl].find(k => plan.blocked.has(k));
    if (blockedBy) { skip(p.row, plan.collisions.some(c => c.key === blockedBy) ? 'KEY_COLLISION' : 'PACK_UNDECIDED', { key: blockedBy }); continue; }
    final.push(p);
  }
  const keysEvidence = {
    schemaVersion: KEYS_SCHEMA, generatedBy: 'archive/tools/type-judgment/build-requests.mjs', main: ctx.head, ...review,
    newProblemTypes: [...plan.newPt].filter(([k]) => !plan.blocked.has(k)).sort((a, b) => a[0].localeCompare(b[0], 'en')).map(([key, e]) => ({ key, nameKo: e.nameKo, definition: e.definition, bundle: e.bundle, ownerPack: plan.ptPack.get(key), questionUidCount: new Set(e.uids).size, exampleUids: [...new Set(e.uids)].sort().slice(0, 5) })),
    newTemplates: [...plan.newTpl].filter(([k, e]) => !plan.blocked.has(k) && !plan.blocked.has(e.pt)).sort((a, b) => a[0].localeCompare(b[0], 'en')).map(([key, e]) => ({ key, parent: e.pt, nameKo: e.nameKo, definition: e.definition, bundle: e.bundle, kind: e.kind, questionUidCount: new Set(e.uids).size, exampleUids: [...new Set(e.uids)].sort().slice(0, 5) })),
    newBindingCount: plan.bindings.size, packScopeAdditions: Object.fromEntries([...plan.packScope].map(([k, v]) => [k, { curricula: [...v.curricula], courses: [...v.courses] }]))
  };
  return { plan, planned: final, skipped, holds, conflicts, hints, ptOnly, duplicates, keysEvidence, bundleIdx };
}

// Groups planned rows by exam and builds one request per exam (PARTIAL_UIDS), or only the exams in `exams`.
export function buildRequests({ ctx, built, tag, evidencePrefix = EVIDENCE_DIR, approvedBy, passCount = 2, approvalType = 'REVIEW2', registryMode = 'per-exam' }) {
  const keysPath = `${evidencePrefix}/${tag}.new-keys.json`;
  const keysText = json(built.keysEvidence), keysRef = { path: keysPath, sha256: sha256(keysText) };
  const allChanges = registryChangeRows(ctx, built.plan, keysRef);
  const byExam = new Map();
  for (const p of built.planned) { if (!byExam.has(p.source)) byExam.set(p.source, []); byExam.get(p.source).push(p); }
  const requests = [], files = new Map([[keysPath, keysText]]);
  const sortedSources = [...byExam.keys()].sort((a, b) => a.localeCompare(b, 'ko'));
  for (const [source, rows] of [...byExam].sort((a, b) => a[0].localeCompare(b[0], 'ko'))) {
    rows.sort((a, b) => a.ordinal - b.ordinal);
    const bank = ctx.bank(source);
    // The carrier sorts first in the inbox (files are registered in name order) so its keys exist before any dependent request.
    const requestId = `${registryMode === 'carrier' && source === sortedSources[0] ? 'tj-000' : 'tj'}-${sha1(source).slice(0, 12)}-${tag}`;
    const ledgerPath = `${evidencePrefix}/${requestId}.type-ledger.json`;
    const ledger = { schemaVersion: LEDGER_SCHEMA, requestId, sourceArchiveFile: source, judge: 'dots', rule: '유형(PT/TPL)은 직접 판정 1회를 정본으로 받는다 (docs/agents/metadata.md CURRENT 2026-11-17)',
      ...built.keysEvidence.sources ? { sources: built.keysEvidence.sources } : {},
      rows: rows.map(p => ({ questionUid: p.uid, sourceOrdinal: p.ordinal, decision: p.row.decision, problemTypeKey: p.target.pt, templateKey: p.target.tpl,
        step: p.row.step ?? null, figure: p.row.figure ?? null, check: p.row.check ?? null, resultFile: p.row._file })) };
    const ledgerText = json(ledger), ledgerRef = { path: ledgerPath, sha256: sha256(ledgerText) };
    files.set(ledgerPath, ledgerText);
    const evidenceRefs = [ledgerRef];
    const keyedRows = new Set(rows.map(p => p.uid));
    // Per exam: keys, bindings and pack scope are planned from this exam's rows only, so an exam never widens a pack for another exam.
    // 'carrier': the first request carries every change once (later requests must be registered after it); 'none': keys already exist.
    const changes = registryMode === 'per-exam' ? registryChangeRows(ctx, planRegistry(ctx, rows, { ptPack: built.plan.ptPack }), keysRef)
      : registryMode === 'carrier' && source === sortedSources[0] ? allChanges : [];
    if (changes.length) evidenceRefs.push(keysRef);
    requests.push({
      schemaVersion: REQUEST_SCHEMA, requestId, examUid: path.posix.basename(source, '.js'), scope: 'PARTIAL_UIDS', sourceArchiveFile: source,
      expectedSourceBlobSha1: ctx.blobSha(source), expectedQuestionCount: bank.length,
      approval: { type: approvalType, metadataReviewed: true, ...(approvalType === 'REVIEW2' ? { reviewPassCount: passCount } : {}), approvedBy, evidenceRefs },
      items: rows.map(p => ({ questionUid: p.uid, sourceOrdinal: p.ordinal, before: p.values.before, after: p.values.after,
        reason: `유형 직접 판정(dots): ${text(p.row.step)}`, evidenceRefs: [ledgerRef] })),
      ...(changes.length ? { registryChanges: changes.map(c => c.change) } : {}) });
  }
  return { requests, files, allChanges, keysRef };
}

// ---------------------------------------------------------------- summary
const countBy = (rows, key) => rows.reduce((m, r) => { const k = key(r); m[k] = (m[k] || 0) + 1; return m; }, {});
export function summarize({ built, requestsInfo }) {
  const { planned, skipped } = built;
  const defaulted = countBy(planned.flatMap(p => p.values.defaulted), x => x);
  return {
    exams: requestsInfo.requests.length,
    itemsToFill: planned.length,
    withNewKey: planned.filter(p => p.target.newPt || p.target.newTpl).length,
    ptAndTpl: planned.length,
    ptOnlyNotRegistrable: built.ptOnly.length,
    newPtKeys: built.keysEvidence.newProblemTypes.length,
    newTplKeys: built.keysEvidence.newTemplates.length,
    newBindings: built.keysEvidence.newBindingCount,
    packScopeAdditions: built.keysEvidence.packScopeAdditions,
    keyCollisions: built.plan.collisions,
    packUndecided: built.plan.undecidedPack,
    emptyDefaultsFilled: defaulted,
    skippedByFirstReason: countBy(skipped, r => r.reason),
    skippedByAnyReason: skipped.flatMap(r => r.all || [r.reason]).reduce((m, k) => { m[k] = (m[k] || 0) + 1; return m; }, {}),
    holds: built.holds.length, conflictsWithApproved: built.conflicts.length,
    hintRows: built.hints.length, duplicateUids: built.duplicates.length,
    ...sharedChangeStats(requestsInfo.requests)
  };
}

// Two requests that both create the same key/binding cannot both be registered ("registry before mismatch" on the second).
export function sharedChangeStats(requests) {
  const seen = new Map();
  for (const r of requests) for (const c of r.registryChanges || []) {
    if (c.before !== null) continue;
    const id = stableJson([c.path, c.collection, c.match]);
    if (!seen.has(id)) seen.set(id, new Set());
    seen.get(id).add(r.requestId);
  }
  const shared = [...seen].filter(([, set]) => set.size > 1);
  return { requestsWithRegistryChanges: requests.filter(r => r.registryChanges?.length).length, distinctCreatedRegistryRows: seen.size,
    createdRowsSharedByManyRequests: shared.length, requestsInvolvedInSharedRows: new Set(shared.flatMap(([, set]) => [...set])).size };
}

export function bundleLinks(bundles) {
  return { schemaVersion: 'archive-type-bundle-links-v1',
    pt: bundles.ptBundles.filter(b => (b.relatedKeys || []).length || (b.narrowExisting || []).length).map(b => ({ bundle: b.bundle, key: b.absorbInto || ptKeyFromBundle(b.bundle), relatedKeys: b.relatedKeys, narrowExisting: b.narrowExisting })),
    tpl: bundles.tplBundles.filter(b => (b.relatedKeys || []).length || (b.narrowExisting || []).length).map(b => ({ bundle: b.bundle, key: b.absorbInto || tplKeyFromBundle(b.bundle), relatedKeys: b.relatedKeys, narrowExisting: b.narrowExisting })) };
}

// ---------------------------------------------------------------- output
// Real path of a target that may not exist yet: nearest existing ancestor resolved, missing tail appended.
export function realTarget(target) {
  const tail = [];
  let dir = path.resolve(target);
  while (!fs.existsSync(dir)) { tail.unshift(path.basename(dir)); dir = path.dirname(dir); }
  return path.join(fs.realpathSync(dir), ...tail);
}
export function writeOutputs(outDir, { built, requestsInfo, summary, links }) {
  const repoRoot = fs.realpathSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'));
  const planned = realTarget(outDir);
  if (planned === repoRoot || planned.startsWith(repoRoot + path.sep)) throw new Error('OUTPUT_INSIDE_REPOSITORY');
  fs.mkdirSync(outDir, { recursive: true });
  const real = fs.realpathSync(outDir);
  const put = (rel, content) => { const f = path.join(real, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content, { flag: 'wx', encoding: 'utf8' }); };
  const lines = rows => rows.map(r => JSON.stringify(r)).join('\n') + (rows.length ? '\n' : '');
  for (const r of requestsInfo.requests) put(`requests/${r.requestId}.json`, json(r));
  for (const [rel, content] of requestsInfo.files) put(`repo-files/${rel}`, content);
  put('registry-changes.json', json(requestsInfo.allChanges.map(c => ({ pack: c.pack, ...c.change }))));
  put('holds.jsonl', lines(built.holds)); put('conflicts-approved.jsonl', lines(built.conflicts));
  put('hints.jsonl', lines(built.hints)); put('skipped.jsonl', lines(built.skipped)); put('pt-only.jsonl', lines(built.ptOnly));
  put('bundle-links.json', json(links)); put('summary.json', json(summary));
}

// ---------------------------------------------------------------- CLI
const here = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
export function parseCli(argv) {
  const args = { results: [], out: null, exam: null, root: here, bundles: null, mainRef: null, tag: null, passCount: 2, approval: 'REVIEW2', registryMode: 'per-exam', relax: [], resultsDir: [], bundlesDir: null };
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i], v = () => { if (i + 1 >= argv.length || argv[i + 1].startsWith('--')) throw new Error(`MISSING_VALUE:${k}`); return argv[++i]; };
    if (k === '--results') args.results.push(v());
    else if (k === '--results-dir') args.resultsDir.push(v());
    else if (k === '--bundles') args.bundles = v();
    else if (k === '--bundles-dir') args.bundlesDir = v();
    else if (k === '--main-ref') args.mainRef = v();
    else if (k === '--out') args.out = v();
    else if (k === '--exam') args.exam = normalizeExam(v());
    else if (k === '--root') args.root = v();
    else if (k === '--tag') args.tag = v();
    else if (k === '--pass-count') args.passCount = Number(v());
    else if (k === '--approval') args.approval = v();
    else if (k === '--registry-mode') args.registryMode = v();
    else if (k === '--relax') args.relax = v().split(',').filter(Boolean);
    else throw new Error(`INVALID_ARGUMENT:${k}`);
  }
  return args;
}
export function run(args) {
  const sources = [...args.results.map(ref => ({ ref })), ...args.resultsDir.map(dir => ({ dir }))];
  if (!sources.length || !(args.bundles || args.bundlesDir)) throw new Error('RESULTS_AND_BUNDLES_REQUIRED');
  const ctx = loadRepoContext(args.root, { mainRef: args.mainRef });
  ctx.relax = new Set(args.relax || []);
  const { rows, commits } = readResultTables(args.root, sources);
  const bundles = readBundleTables(args.root, args.bundles ? { ref: args.bundles } : { dir: args.bundlesDir });
  const review = { sources: { results: commits, bundles: { ref: bundles.ref, commit: bundles.commit } } };
  const tag = args.tag || sha1(stableJson({ c: commits, b: bundles.commit, m: ctx.head })).slice(0, 8);
  const built = buildAll({ ctx, resultRows: rows, bundles, only: args.exam, review });
  const approvedBy = '사용자 결정 2026-11-17: 유형(PT/TPL)은 dots 직접 판정 1회를 정본으로 받는다 (docs/agents/metadata.md CURRENT). 판정 근거 문장은 증거 원장에 있다.';
  const requestsInfo = buildRequests({ ctx, built, tag, approvedBy, passCount: args.passCount, approvalType: args.approval, registryMode: args.registryMode });
  const summary = { tag, main: ctx.head, mainRef: args.mainRef, relax: [...ctx.relax], ...review, resultLines: rows.length, ...summarize({ built, requestsInfo }) };
  const links = bundleLinks(bundles);
  if (args.out) writeOutputs(path.resolve(args.out), { built, requestsInfo, summary, links });
  return { summary, built, requestsInfo, ctx };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { summary } = run(parseCli(process.argv.slice(2)));
    process.stdout.write(json(summary));
    if (summary.keyCollisions.length) process.exitCode = 2;
  } catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}
