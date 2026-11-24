#!/usr/bin/env node
// 사용법: node archive/tools/aistudio-typebank/keys-geo.mjs [--subject=calc2] <유형 id|out 파일>... [--write]
// 유형 은행에 쓰이는 (L4 리프, PT, TPL) 조합이 레지스트리·크로스워크에 있는지 보고, 없는 것은 add-only 로 채운다. 이름은 keys-geo 지만 기하·미적분II 둘 다 쓴다.
//  - 기하: TPL 은 대응표 후보 → geo-tpl-map.json 의 alias(기존 키) → 기존 키 / newTpl(새 TPL, 정의는 표에 있어야 함). 둘 다 아니면 TPL_UNDEFINED 로 멈춘다.
//    PT 가 없는 유형은 typeOverride(기존 PT/TPL 에 붙이기) 또는 newPt(새 PT)로 정한다.
//  - 미적분II: PT/TPL 은 리프의 크로스워크 행에서 읽는다(DIRECT_ACTIVE 행, RPM_ONLY 리프를 올린 promotesRpmOnlyRowId 행, 바인딩 공백 DIRECT_BINDING_GAP 행). 묶음의 PT 가 둘이면 첫 리프를 따른다.
//  - 크로스워크: RPM_ONLY 리프를 가리키는 DIRECT_ACTIVE 행(promotesRpmOnlyRowId), 바인딩 공백 리프를 가리키는 DIRECT_ACTIVE 행(promotesBindingGapRowId, resolver 가 인정하는 add-only 모양)을 더한다.
//  - --write 일 때만 canonical·crosswalk 파일을 쓰고 compile-meta-foundation.mjs --write 로 compiled 를 다시 만든다.
// 이유: 문항 JS 의 PT/TPL/rpmPrimaryRecordId 가 등록기·Resolver 에서 PROJECTION_REUSE 가 되려면 키와 크로스워크 행이 있어야 한다(docs/agents/metadata.md 확장 원칙).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { REPO, SUBJECT, RPM_PREFIX, readJson, loadMaplRows, loadQueue, loadPairs, typeInfo, typesOfOutFile, typeSkip } from './geo-map.mjs';
import { SUBJECTS } from './common.mjs';

const P = (...p) => path.join(REPO, ...p);
const CFG = SUBJECTS[SUBJECT];
const PACKS_DIR = 'archive/data/meta-foundation/canonical/packs';
const CW = CFG.crosswalk;
const GEO_PACK = 'geometry';
export const TPL_MAP = readJson(path.join(path.dirname(fileURLToPath(import.meta.url)), 'geo-tpl-map.json'));
const writeJson = (rel, v) => fs.writeFileSync(P(rel), JSON.stringify(v, null, 2) + '\n', 'utf8');

/** 모든 팩(분류표·바인딩·팩 정보)과 이 과목의 크로스워크. 기하는 geometry 팩 하나만 쓴다. */
export function loadRegistry() {
  const packs = new Map();
  for (const dir of fs.readdirSync(P(PACKS_DIR))) {
    const f = n => P(PACKS_DIR, dir, n);
    if (!fs.existsSync(f('taxonomy.json'))) continue;
    packs.set(dir, { dir, taxonomy: readJson(f('taxonomy.json')), bindings: readJson(f('bindings.json')), pack: readJson(f('pack.json')) });
  }
  const reg = { packs, crosswalk: readJson(P(CW)), dirty: new Set(), added: { tpls: [], pts: [], rows: [], bindings: [] } };
  const own = packs.get(GEO_PACK);
  reg.taxonomy = own.taxonomy; reg.bindings = own.bindings; reg.pack = own.pack; // 기하 호환
  return reg;
}
const allTemplates = reg => [...reg.packs.values()].flatMap(p => p.taxonomy.templates);
const allPts = reg => [...reg.packs.values()].flatMap(p => p.taxonomy.problemTypes);
const packOfPt = (reg, pt) => [...reg.packs.values()].find(p => p.taxonomy.problemTypes.some(x => x.problemTypeKey === pt));

/** 기하: 대응표 TPL 값 → 레지스트리 TPL 키(+ 새로 만들어야 하는지). */
export function resolveTpl(info, reg) {
  const raw = info.tplRaw;
  if (!raw) return { error: 'TPL_NONE', msg: `${info.id}: 대응표에 TPL 이 없다` };
  const key = TPL_MAP.alias[raw] || raw;
  const have = allTemplates(reg).find(t => t.templateKey === key);
  if (have) {
    if (have.parentProblemTypeKey !== info.pt) return { error: 'TPL_PARENT', msg: `${info.id}: ${key} 의 상위 ${have.parentProblemTypeKey} ≠ 대응표 PT ${info.pt}` };
    return { key, isNew: false, aliasOf: key !== raw ? raw : null };
  }
  const def = TPL_MAP.newTpl[key];
  if (!def) return { error: 'TPL_UNDEFINED', msg: `${info.id}: ${raw} 는 레지스트리에도 geo-tpl-map.json 에도 없다(alias 로 기존 키에 붙이거나 newTpl 정의를 추가)` };
  if (def.parentProblemTypeKey !== info.pt) return { error: 'TPL_PARENT', msg: `${info.id}: newTpl ${key} 의 상위 ${def.parentProblemTypeKey} ≠ 대응표 PT ${info.pt}` };
  return { key, isNew: true, def, aliasOf: key !== raw ? raw : null };
}

export function leafRow(reg, id) {
  return reg.crosswalk.records.find(r => r.id === id && r.curriculum === '2022');
}
const linkedRows = (reg, leaf) => reg.crosswalk.records.filter(r => r.curriculum === '2022' && r.problemTypeKey && r.templateKey
  && (r.id === leaf.id || r.promotesRpmOnlyRowId === leaf.id || r.promotesBindingGapRowId === leaf.id));
const hasTriple = (reg, leaf, pt, tpl) => reg.crosswalk.records.some(r => r.curriculum === '2022' && r.mappingStatus === 'DIRECT_ACTIVE'
  && r.problemTypeKey === pt && r.templateKey === tpl && (r.id === leaf.id || r.promotesRpmOnlyRowId === leaf.id || r.promotesBindingGapRowId === leaf.id));

/** 미적분II: 리프의 크로스워크 행에서 (PT, TPL) 후보를 읽는다. ACTIVE 행을 먼저, 없으면 바인딩 공백 행. */
export function leafKeyPairs(reg, leaf) {
  const rows = linkedRows(reg, leaf);
  const pick = status => [...new Map(rows.filter(r => r.mappingStatus === status).map(r => [`${r.problemTypeKey}|${r.templateKey}`, { pt: r.problemTypeKey, tpl: r.templateKey, via: status }])).values()];
  const active = pick('DIRECT_ACTIVE');
  return active.length ? active : pick('DIRECT_BINDING_GAP');
}

/** 유형 하나의 키: 기하는 대응표·geo-tpl-map, 미적분II 는 첫 리프의 크로스워크 행. */
export function resolveTypeKeys(info, reg) {
  if (SUBJECT === 'geo') {
    if (!info.pt) return { error: 'PT_NONE', msg: `${info.id}: 대응표에 PT 가 없다(geo-tpl-map.json 의 typeOverride 로 붙인다)` };
    const t = resolveTpl(info, reg);
    if (t.error) return t;
    const known = allPts(reg).some(p => p.problemTypeKey === info.pt) || TPL_MAP.newPt?.[info.pt];
    if (!known) return { error: 'PT_UNKNOWN', msg: `${info.id}: PT ${info.pt} 가 레지스트리에 없다` };
    return { pt: info.pt, tpl: t.key, isNew: t.isNew, def: t.def, aliasOf: t.aliasOf, leafIds: info.l4Ids, droppedLeafIds: [], leafPairs: Object.fromEntries(info.l4Ids.map(id => [id, { pt: info.pt, tpl: t.key }])) };
  }
  // 미적분II
  const leaves = info.l4Ids.map(id => ({ id, row: leafRow(reg, id) }));
  const missing = leaves.filter(l => !l.row);
  if (missing.length) return { error: 'L4_UNKNOWN', msg: `${info.id}: ${missing.map(l => l.id).join(', ')} 가 2022 크로스워크에 없다` };
  const ov = TPL_MAP.typeOverride?.[info.id];
  const per = leaves.map(l => ({ ...l, pairs: leafKeyPairs(reg, l.row) }));
  let primary = null;
  if (ov) primary = { pt: ov.pt, tpl: ov.tpl };
  else {
    const first = per.find(l => l.pairs.length);
    if (!first) return { error: 'KEYS_NONE', msg: `${info.id}: 리프 ${info.l4Ids.join(', ')} 에 PT/TPL 이 연결된 크로스워크 행이 없다(RPM_ONLY 뿐; typeOverride 또는 새 키가 필요)` };
    if (first.pairs.length > 1) return { error: 'KEYS_AMBIGUOUS', msg: `${info.id}: 리프 ${first.id} 에 (PT, TPL) 후보가 둘 이상: ${first.pairs.map(p => `${p.pt}/${p.tpl}`).join(' | ')}` };
    primary = first.pairs[0];
  }
  const tplRow = allTemplates(reg).find(t => t.templateKey === primary.tpl);
  if (!tplRow) return { error: 'TPL_UNKNOWN', msg: `${info.id}: TPL ${primary.tpl} 가 분류표에 없다` };
  if (tplRow.parentProblemTypeKey !== primary.pt) return { error: 'TPL_PARENT', msg: `${info.id}: ${primary.tpl} 의 상위 ${tplRow.parentProblemTypeKey} ≠ ${primary.pt}` };
  // 리프마다 자기 (PT, TPL): 문항이 고른 리프(rpmRecordId)가 그 문항의 PT/TPL 을 정한다. 연결된 행이 없는 리프는 후보에서 뺀다(첫 리프와 같은 키로 보지 않는다).
  const leafPairs = {};
  for (const l of per) {
    if (l.pairs.length === 1) leafPairs[l.id] = { pt: l.pairs[0].pt, tpl: l.pairs[0].tpl };
    else if (l.pairs.length > 1) return { error: 'KEYS_AMBIGUOUS', msg: `${info.id}: 리프 ${l.id} 에 (PT, TPL) 후보가 둘 이상: ${l.pairs.map(p => `${p.pt}/${p.tpl}`).join(' | ')}` };
  }
  if (ov) { for (const id of info.l4Ids) if (!leafPairs[id]) leafPairs[id] = { pt: ov.pt, tpl: ov.tpl }; }
  const bad = Object.entries(leafPairs).find(([, p]) => { const t = allTemplates(reg).find(x => x.templateKey === p.tpl); return !t || t.parentProblemTypeKey !== p.pt; });
  if (bad) return { error: 'TPL_PARENT', msg: `${info.id}: ${bad[0]} 의 ${bad[1].pt}/${bad[1].tpl} 가 분류표의 부모·자식과 맞지 않는다` };
  const leafIds = info.l4Ids.filter(id => leafPairs[id]);
  return { pt: primary.pt, tpl: primary.tpl, isNew: false, aliasOf: null, leafIds, droppedLeafIds: info.l4Ids.filter(id => !leafPairs[id]), leafPairs };
}

/** 유형 id 목록 → 필요한 변경 계획. */
export function planKeys(typeIds, reg = loadRegistry(), ctx = null) {
  const plan = { errors: [], newTpls: new Map(), newPts: new Map(), newRows: [], newBindings: [], perType: [] };
  for (const id of typeIds) {
    if (typeSkip(id)) continue;
    const info = typeInfo(id, ctx);
    const k = resolveTypeKeys(info, reg);
    if (k.error) { plan.errors.push({ code: k.error, msg: k.msg }); continue; }
    if (TPL_MAP.newPt?.[k.pt] && !allPts(reg).some(p => p.problemTypeKey === k.pt)) plan.newPts.set(k.pt, TPL_MAP.newPt[k.pt]);
    if (k.isNew) plan.newTpls.set(k.tpl, k.def);
    for (const lid of k.leafIds) {
      const leaf = leafRow(reg, lid);
      const lp = k.leafPairs[lid];
      if (!leaf) { plan.errors.push({ code: 'L4_UNKNOWN', msg: `${id}: ${lid} 가 2022 크로스워크에 없다` }); continue; }
      if (!hasTriple(reg, leaf, lp.pt, lp.tpl) && !plan.newRows.some(r => r.leaf.id === leaf.id && r.pt === lp.pt && r.tpl === lp.tpl)) {
        const gap = leaf.mappingStatus === 'DIRECT_BINDING_GAP' && leaf.problemTypeKey === lp.pt && leaf.templateKey === lp.tpl;
        if (leaf.mappingStatus !== 'RPM_ONLY' && !gap) { plan.errors.push({ code: 'L4_ROW_OCCUPIED', msg: `${id}: ${lid} 는 이미 ${leaf.templateKey} 로 연결돼 있어 ${lp.tpl} 행을 더할 자리가 없다(수동 판단)` }); continue; }
        plan.newRows.push({ leaf, pt: lp.pt, tpl: lp.tpl, kind: gap ? 'GAP' : 'RPM_ONLY', why: `${id} ${info.type}` });
      }
      const hasBinding = [...reg.packs.values()].some(p => p.bindings.bindings.some(b => b.curriculum === '2022' && b.problemTypeKey === lp.pt && b.standardUnitKey === leaf.standardUnitKey
        && (b.subUnitKey ?? null) === (leaf.subUnitKey ?? null) && b.status === 'ACTIVE'));
      if (!hasBinding && !plan.newBindings.some(b => b.pt === lp.pt && b.unit === leaf.standardUnitKey && b.sub === (leaf.subUnitKey ?? null))) plan.newBindings.push({ pt: lp.pt, unit: leaf.standardUnitKey, sub: leaf.subUnitKey ?? null, leaf });
    }
    plan.perType.push({ id, pt: k.pt, tpl: k.tpl, tplIsNew: Boolean(k.isNew), aliasOf: k.aliasOf, leafIds: k.leafIds, droppedLeafIds: k.droppedLeafIds, leafPairs: k.leafPairs });
  }
  return plan;
}

function nextRowNumber(reg) {
  const re = new RegExp(`^${RPM_PREFIX}(\\d+)$`);
  return Math.max(...reg.crosswalk.records.map(r => Number(String(r.id).match(re)?.[1] || 0))) + 1;
}

export function applyPlan(plan, reg) {
  const ptLabel = new Map(allPts(reg).map(p => [p.problemTypeKey, p.canonicalLabelKo]));
  const tplLabel = new Map(allTemplates(reg).map(t => [t.templateKey, t.canonicalLabelKo]));
  const geo = reg.packs.get(GEO_PACK);
  for (const [key, def] of plan.newPts) {
    geo.taxonomy.problemTypes.push({ problemTypeKey: key, canonicalLabelKo: def.canonicalLabelKo, definition: def.definition, aliases: [], ownerPack: 'GEOMETRY', status: 'ACTIVE', supportingItemCount: 0, supportingQuestionUids: [], sourceUnits: [def.sourceUnit] });
    ptLabel.set(key, def.canonicalLabelKo); reg.added.pts.push(key);
  }
  if (plan.newPts.size) { geo.taxonomy.problemTypeCount = geo.taxonomy.problemTypes.length; reg.dirty.add(GEO_PACK); }
  for (const [key, def] of plan.newTpls) {
    geo.taxonomy.templates.push({
      templateKey: key, canonicalLabelKo: def.canonicalLabelKo, definition: def.definition, aliases: [], internalSkeleton: def.internalSkeleton,
      ownerPack: 'GEOMETRY', parentProblemTypeKey: def.parentProblemTypeKey, status: 'ACTIVE', supportingItemCount: 0, supportingQuestionUids: [],
    });
    tplLabel.set(key, def.canonicalLabelKo); reg.added.tpls.push(key);
  }
  if (plan.newTpls.size) { geo.taxonomy.templateCount = geo.taxonomy.templates.length; reg.dirty.add(GEO_PACK); }
  const subLabel = (pack, sub) => pack.bindings.bindings.find(b => b.subUnitKey === sub)?.subUnitLabelKo;
  for (const b of plan.newBindings) {
    const pack = packOfPt(reg, b.pt) || geo;
    const sample = pack.bindings.bindings.find(x => x.curriculum === '2022' && x.standardUnitKey === b.unit && (x.subUnitKey ?? null) === b.sub);
    const rec = {
      problemTypeKey: b.pt, curriculum: '2022', standardCourse: CFG.course, standardUnitKey: b.unit, subUnitKey: b.sub,
      ...(sample?.subUnitLabelKo || subLabel(pack, b.sub) ? { subUnitLabelKo: sample?.subUnitLabelKo || subLabel(pack, b.sub) } : (b.sub === null ? { subUnitLabelKo: b.leaf.rpmPath.midUnit } : {})),
      ...(b.sub === null ? { bindingMode: 'STANDARD_UNIT_DIRECT' } : {}),
      supportingItemCount: 0, supportingQuestionUids: [], curriculumApplicability: 'CORE', defaultSelectable: true, status: 'ACTIVE', ownerPack: pack.pack.ownerPack,
    };
    pack.bindings.bindings.push(rec);
    pack.bindings.bindingCount = pack.bindings.bindings.length;
    pack.pack.bindingCount = pack.bindings.bindings.length;
    if (!pack.pack.curricula.includes('2022')) pack.pack.curricula.push('2022');
    if (!pack.pack.standardCourses.includes(CFG.course)) pack.pack.standardCourses.push(CFG.course);
    reg.dirty.add(pack.dir); reg.added.bindings.push(`${b.pt}@${b.unit}`);
  }
  let n = nextRowNumber(reg);
  for (const r of plan.newRows) {
    const pack = packOfPt(reg, r.pt) || geo;
    const id = `${RPM_PREFIX}${String(n++).padStart(3, '0')}`;
    reg.crosswalk.records.push({
      id, curriculum: '2022', scope: r.leaf.scope, rpmPath: { ...r.leaf.rpmPath },
      standardUnitKey: r.leaf.standardUnitKey, subUnitKey: r.leaf.subUnitKey, mappingStatus: 'DIRECT_ACTIVE', bindingStatus: 'ACTIVE',
      [r.kind === 'GAP' ? 'promotesBindingGapRowId' : 'promotesRpmOnlyRowId']: r.leaf.id, standardCourse: CFG.course, problemTypeKey: r.pt, problemTypeLabelKo: ptLabel.get(r.pt),
      templateKey: r.tpl, templateLabelKo: tplLabel.get(r.tpl), ownerPack: pack.pack.ownerPack,
      binding: { curriculum: '2022', standardCourse: CFG.course, standardUnitKey: r.leaf.standardUnitKey, subUnitKey: r.leaf.subUnitKey, ownerPack: pack.pack.ownerPack },
      mappingReason: '유형 은행 반입용: 마플 시너지 유형 체계와 RPM 리프를 대조하여 같은 형태의 PT/TPL을 연결했다.',
    });
    reg.added.rows.push(`${id}<-${r.leaf.id}`);
  }
  // 요약·팩 수치 갱신
  const recs = reg.crosswalk.records;
  const sum = { recordCount: recs.length, DIRECT_ACTIVE: 0, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0, byCurriculum: {} };
  for (const r of recs) {
    if (r.mappingStatus in sum) sum[r.mappingStatus]++;
    const c = (sum.byCurriculum[r.curriculum] ||= {}); c[r.mappingStatus] = (c[r.mappingStatus] || 0) + 1;
  }
  reg.crosswalk.summary = { ...reg.crosswalk.summary, ...sum };
  if (reg.crosswalk.summary.byScope) {
    const byScope = {};
    for (const r of recs) { const s = (byScope[r.scope] ||= { DIRECT_ACTIVE: 0, FAMILY_ACTIVE: 0, DIRECT_BINDING_GAP: 0, FAMILY_BINDING_GAP: 0, RPM_ONLY: 0 }); if (r.mappingStatus in s) s[r.mappingStatus]++; }
    reg.crosswalk.summary.byScope = byScope;
  }
  const touched = new Set(reg.dirty);
  for (const d of touched) {
    const p = reg.packs.get(d);
    if ('templateCount' in p.pack) p.pack.templateCount = p.taxonomy.templates.length;
    if ('problemTypeCount' in p.pack) p.pack.problemTypeCount = p.taxonomy.problemTypes.length;
    const [a, b, c] = p.pack.packVersion.split('.').map(Number);
    p.pack.packVersion = `${a}.${b}.${c + 1}`;
    p.pack.notes.push(`2026-11-24: ${CFG.label} 유형 은행(마플 대응표) 반입용 add-only: TPL ${plan.newTpls.size}(${[...plan.newTpls.keys()].join(', ') || '없음'}), PT ${plan.newPts.size}, 크로스워크 DIRECT_ACTIVE 행 ${plan.newRows.length}, 소단원·단원 연결 ${plan.newBindings.length}.`);
  }
}

export function writeRegistry(reg) {
  for (const d of reg.dirty) {
    const p = reg.packs.get(d);
    writeJson(`${PACKS_DIR}/${d}/taxonomy.json`, p.taxonomy);
    writeJson(`${PACKS_DIR}/${d}/bindings.json`, p.bindings);
    writeJson(`${PACKS_DIR}/${d}/pack.json`, p.pack);
  }
  writeJson(CW, reg.crosswalk);
}

/** 크로스워크 파일의 현재 해시를 봉인 레지스트리에 더한다(멱등). 이유: 승인된 Meta 가 옛 해시를 가리켜도 행이 그대로면 통과시키는 가드(docs/agents/metadata.md "공유 크로스워크는 추가만")가 현재 해시도 봉인돼 있기를 요구한다. */
export function sealCrosswalk() {
  const seal = createRequire(import.meta.url)(P('archive/tools/sealed-crosswalk-digests.cjs'));
  return seal.sealCrosswalkDigest(REPO, { path: CW, bytes: fs.readFileSync(P(CW)), sealedBy: 'aistudio-typebank/keys-geo.mjs', reason: `유형 은행(${CFG.label}) add-only 크로스워크 행` });
}

export function compileAll() {
  const run = (file, args) => execFileSync('node', [P(file), ...args], { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  // 컴파일러가 조립된 question_metadata.json(생성물, git 무시)을 읽는다. 없으면 샤드에서 조립한다.
  if (!fs.existsSync(P('archive/data/question_metadata.json'))) run('archive/tools/meta-foundation/question-metadata-format.mjs', ['assemble', '--root', REPO]);
  const out = [run('archive/tools/meta-foundation/compile-meta-foundation.mjs', ['--write'])];
  return out.join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  const args = process.argv.slice(2);
  const write = args.includes('--write');
  const ctx = { queue: loadQueue(), rows: loadMaplRows(), pairs: loadPairs() };
  const ids = [];
  for (const a of args.filter(x => !x.startsWith('--'))) {
    if (/\.js$/.test(a)) ids.push(...typesOfOutFile(a, ctx).items); else ids.push(a);
  }
  const reg = loadRegistry();
  const plan = planKeys([...new Set(ids)], reg, ctx);
  for (const e of plan.errors) console.log(`ERROR ${e.code}: ${e.msg}`);
  console.log(`새 PT ${plan.newPts.size}: ${[...plan.newPts.keys()].join(', ')}`);
  console.log(`새 TPL ${plan.newTpls.size}: ${[...plan.newTpls.keys()].join(', ')}`);
  console.log(`새 크로스워크 행 ${plan.newRows.length}: ${plan.newRows.map(r => `${r.leaf.id}→${r.tpl}${r.kind === 'GAP' ? '(GAP)' : ''}`).join(', ')}`);
  console.log(`새 연결(binding) ${plan.newBindings.length}: ${plan.newBindings.map(b => `${b.pt}@${b.unit}/${b.sub}`).join(', ')}`);
  const dropped = plan.perType.filter(t => t.droppedLeafIds.length);
  if (dropped.length) console.log(`다른 키의 후보 리프를 뺀 유형 ${dropped.length}: ${dropped.map(t => `${t.id}(-${t.droppedLeafIds.join('/')})`).join(', ')}`);
  if (plan.errors.length) process.exit(1);
  if (write && (plan.newTpls.size || plan.newPts.size || plan.newRows.length || plan.newBindings.length)) {
    applyPlan(plan, reg); writeRegistry(reg); sealCrosswalk();
    console.log(compileAll().split('\n').slice(-8).join('\n'));
    console.log('쓰기 완료. 선택표(archive/tools/similar-import/build-selection-tables.mjs --write)와 테스트는 따로 돌린다.');
  } else if (!write) console.log('(미리보기) 쓰려면 --write');
}
