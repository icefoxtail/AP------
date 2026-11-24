#!/usr/bin/env node
// AI 스튜디오가 만든 기하 유형은행 문항(out/geo_*.js) → 운영 병합할 수 있는 아카이브 JS + 4칸 + 메타 기록.
// 명령 한 줄(새 묶음도 같다):  node archive/tools/aistudio-typebank/typebank-geo.mjs all <out 파일>...
//   prep   : 유형별 JS 초안(PT/TPL/L4는 대응표에서 기계적으로), 키 확인·추가(keys-geo), DeepSeek 요청서, 기계 검산, 그림 할 일
//   judge  : DeepSeek 한 라인(동시 1개)이 정답 독립 풀이 → 메타 판정(CC·Condition·결합·난이도·4칸). 한도에 걸리면 기다렸다 재개
//   apply  : 판정을 검사해 JS·4칸(compact)·기록에 반영, Resolver(stage-meta-bridge CREATE) 증거 생성
//   report : 반입 요약(파일·문항 수, 채움률, 새 키, 검산 불일치, [그림] 문항)
// 저장소에는 운영물(types JS, 4칸 compact, 키·크로스워크)만 남고, 요청서·판정·증거는 작업 폴더(TYPEBANK_WORK)에 둔다.
// 흐름·규칙: docs/agents/aistudio-similar.md "유형 채우기(TYPE_BANK)".
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { REPO, PATHS, SUBJECT, readJson, loadMaplRows, loadQueue, loadPairs, typeInfo, typesOfOutFile, typeSkip } from './geo-map.mjs';
import { TPL_MAP, loadRegistry, planKeys, applyPlan, writeRegistry, sealCrosswalk, compileAll, resolveTypeKeys, leafRow } from './keys-geo.mjs';
import { SUBJECTS, loadMenus, INTEGRATION_PATTERNS, bankFromText } from './common.mjs';
import { solveRequest, judgeRequest, judgeBatchRequest, loadDictionary } from './judge-prompts.mjs';
import { runDeepSeekWaiting } from './ds-run.mjs';

const P = (...p) => path.join(REPO, ...p);
const TYPES_REL = 'types/high/h2';
const TYPES_DIR = P('archive/exams', TYPES_REL);
const COMPACT_DIR = P('archive/data/item-4slot', TYPES_REL);
// Resolver 증거는 저장소에 두지 않는다(GIT_RAW_OUTPUT_FORBIDDEN): 작업 폴더에 쓴다.
const GEN_DIR = process.env.TYPEBANK_GEN || path.join(PATHS.work, '_generated');
const CFG = SUBJECTS[SUBJECT];
const branchName = () => execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim();
const sha256 = b => crypto.createHash('sha256').update(b).digest('hex');
const gitBlob = buf => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${buf.length}\0`), buf])).digest('hex');
const CIRCLED = ['①', '②', '③', '④', '⑤'];
const wj = (f, v) => { fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, JSON.stringify(v, null, 2) + '\n', 'utf8'); };
const log = (...a) => console.log(...a);

// ---------- 모듈(similar-import 하네스, CJS 4칸 검사기) ----------
const sim = await import(pathToFileURL(P('archive/tools/similar-import/lib.mjs')).href);
const chk = await import(pathToFileURL(P('archive/tools/similar-import/check-judgment.mjs')).href);
const coLib = await import(pathToFileURL(P('archive/tools/similar-import/choice-order-lib.mjs')).href);
const req = createRequire(import.meta.url);
const v4 = req(P('tools/4slot/validate-4slot.cjs'));
const imp4 = req(P('tools/4slot/import-4slot.cjs'));
const exam4 = req(P('tools/4slot/exam-items.cjs'));

// ---------- 작업 상태 ----------
const registryFile = path.join(PATHS.work, 'registry.json');
const loadRegistryState = () => (fs.existsSync(registryFile) ? readJson(registryFile) : { types: {} });
const saveRegistryState = s => wj(registryFile, s);
const workDir = stem => path.join(PATHS.work, stem);
// 파일 이름에 쓸 수 없는 문자(| \ / : * ? " < > 와 작은따옴표)는 뺀다(대기열 stem 에 |PF-PF'| 같은 식이 들어 있다).
const stemFor = (info, n) => info.stem.replace(/[\\/:*?"<>|'’‘]/g, '').replace(/_유형\d+$/, `_유형은행${n}`);

/** 발문 끝·앞의 난이도 꼬리표([중], [상], (하) …)를 걸러 낸다. 수식·[보기] 는 건드리지 않는다. */
export function stripDifficultyTag(text) {
  return String(text).replace(/^\s*[\[(](최상|최하|상|중|하)[\])]\s*/, '').replace(/\s*[\[(](최상|최하|상|중|하)[\])]\s*$/gm, '').trim();
}

/** 역슬래시가 빠진 LaTeX 명령(overline{ 등)만 고친다. 그 밖의 수학 내용은 건드리지 않는다. */
export const fixMissingBackslash = t => String(t).replace(/(?<![\\A-Za-z])(overline|dfrac|frac|sqrt|overrightarrow)(?=\{)/g, '\\$1');

/** `[태그: …]` 를 대괄호 짝으로 꺼낸다(설명 안의 [0,2] 때문에 정규식으로는 안 된다). 본문은 그대로 두고 설명만 모은다. */
export function figureSpecs(text, tag = '그림') {
  const s = String(text ?? ''); const specs = []; let i = 0;
  const open = `[${tag}`;
  while (i < s.length) {
    const at = s.indexOf(open, i);
    if (at < 0 || !/^\s*:/.test(s.slice(at + open.length, at + open.length + 4))) break;
    let depth = 0; let j = at;
    for (; j < s.length; j++) { if (s[j] === '[') depth++; else if (s[j] === ']') { depth--; if (depth === 0) break; } }
    if (depth !== 0) { specs.push({ spec: s.slice(at), broken: true }); break; }
    specs.push({ spec: s.slice(at + open.length, j).replace(/^\s*:\s*/, '').trim() });
    i = j + 1;
  }
  return specs;
}

/** 기계 검산: 정답이 보기 범위 안, 해설 마지막 줄의 정답 번호 일치, 보기 5개·중복 없음, 보기 크기순. */
export function mechanicalChecks(q) {
  const issues = [];
  const m = String(q.answer ?? '').match(/^[①②③④⑤]$/);
  if (!m) issues.push({ code: 'ANSWER_FORMAT', msg: `answer=${JSON.stringify(q.answer)}` });
  const idx = m ? CIRCLED.indexOf(q.answer) : -1;
  if (!Array.isArray(q.choices) || q.choices.length !== 5) issues.push({ code: 'CHOICE_COUNT', msg: `보기 ${q.choices?.length}개` });
  else if (idx >= q.choices.length) issues.push({ code: 'ANSWER_RANGE', msg: `정답 ${q.answer} 가 보기 범위 밖` });
  if (!String(q.solution ?? '').trim()) issues.push({ code: 'SOLUTION_EMPTY', msg: '해설이 비었다' });
  else {
    const last = String(q.solution).trim().split('\n').pop();
    const lm = last.match(/정답은\s*([①②③④⑤])/);
    if (!lm) issues.push({ code: 'SOLUTION_LAST_LINE', msg: `해설 마지막 줄에 정답 번호가 없다: ${last.slice(0, 40)}` });
    else if (lm[1] !== q.answer) issues.push({ code: 'SOLUTION_ANSWER_MISMATCH', msg: `해설 마지막 줄 ${lm[1]} ≠ answer ${q.answer}` });
  }
  if (Array.isArray(q.choices) && new Set(q.choices.map(c => String(c).replace(/\s+/g, ''))).size !== q.choices.length) issues.push({ code: 'CHOICE_DUPLICATE', msg: '같은 보기가 있다' });
  if (!Number.isInteger(q.difficultyBucket) || q.difficultyBucket < 1 || q.difficultyBucket > 5) issues.push({ code: 'DIFFICULTY_RANGE', msg: `difficultyBucket=${q.difficultyBucket}` });
  try {
    const o = coLib.analyzeChoiceOrder({ ...q, questionType: '객관식' });
    if (o.status === 'A' || o.status === 'B') issues.push({ code: 'CHOICE_ORDER', msg: `수 보기가 크기순이 아니다(${o.status})`, warn: true });
    if (o.status === 'OK' && o.dup) issues.push({ code: 'CHOICE_DUPLICATE_VALUE', msg: '같은 값의 보기' });
  } catch { /* 수 보기가 아니면 건너뜀 */ }
  return issues;
}

const ITEM_ORDER = [
  'id', 'category', 'standardCourse', 'curriculum', 'standardUnitKey', 'standardUnit', 'standardUnitOrder', 'subUnitKey', 'subUnit', 'subUnitConfidence',
  'subUnitClassificationDepth', 'conceptClusterKey', 'questionType', 'layoutTag', 'tags', 'wide', 'content', 'choices', 'answer', 'solution',
  'difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'rpmPrimaryRecordId', 'problemTypeKey', 'templateKey',
  'primaryMethod', 'decisiveStep', 'crossConceptKeys', 'conditionKeys', 'integrationPattern',
];
const orderedItem = o => { const r = {}; for (const k of ITEM_ORDER) if (k in o && o[k] !== undefined) r[k] = o[k]; return r; };
const serialize = (stem, bank) => `window.examTitle = ${JSON.stringify(stem)};\n\nwindow.questionBank = ${JSON.stringify(bank, null, 2)};\n`;

// ---------- prep ----------
export function baseItem(q, info, leaf, masters, k) {
  const unit = masters.unitOrders.get(leaf.standardUnitKey);
  // 2022 미적분II 는 소단원이 없다(선택표 소단원 0): 단원까지만 적고 소단원 칸은 비운다.
  const subRow = leaf.subUnitKey ? masters.subUnits.get(leaf.subUnitKey) : null;
  if (!unit || (leaf.subUnitKey && !subRow)) throw new Error(`MASTER_MISSING ${leaf.standardUnitKey}/${leaf.subUnitKey}`);
  const catLabel = subRow ? subRow.labelKo : unit.label;
  return {
    id: q.newId, category: catLabel, standardCourse: CFG.course, curriculum: CFG.curriculum,
    standardUnitKey: unit.key, standardUnit: unit.label, standardUnitOrder: unit.order,
    ...(subRow ? { subUnitKey: subRow.subUnitKey, subUnit: subRow.labelKo, subUnitConfidence: 'candidate_evidence', subUnitClassificationDepth: 'complete_candidate', conceptClusterKey: subRow.conceptClusterKey || undefined } : {}),
    questionType: '객관식', layoutTag: 'grid', tags: ['객관식', catLabel], wide: false,
    content: fixMissingBackslash(stripDifficultyTag(q.content)), choices: q.choices.map(fixMissingBackslash), answer: q.answer, solution: fixMissingBackslash(q.solution),
    difficultyBucket: q.difficultyBucket, difficultyConfidence: 'medium', difficultyBoundaryFlag: 'NONE', legacyLevelCompatibility: 'NORMAL',
    rpmPrimaryRecordId: k.leafIds[0], problemTypeKey: k.pt, templateKey: k.tpl,
    crossConceptKeys: [], conditionKeys: [], integrationPattern: 'NONE',
  };
}

/** 기계 전용 반입(--mechanical): 판정이 필요한 칸(난이도·결합 패턴·풀이 방법)은 채우지 않고 비운다. CrossConcept·Condition 은 빈 배열(= 아직 판정하지 않음). */
export function toMechanicalItem(it) {
  const o = { ...it };
  for (const k of ['difficultyBucket', 'difficultyConfidence', 'difficultyBoundaryFlag', 'legacyLevelCompatibility', 'integrationPattern', 'primaryMethod', 'decisiveStep']) delete o[k];
  return o;
}
/** 학생에게 보이면 안 되는 결함(보기·정답·해설 형식). 난이도는 보지 않는다. */
export const hardIssues = q => mechanicalChecks({ ...q, difficultyBucket: 2 }).filter(i => !i.warn && i.code !== 'DIFFICULTY_RANGE');

export async function prep(outFiles, { force = false, mechanical = false } = {}) {
  const ctx = { queue: loadQueue(), rows: loadMaplRows(), pairs: loadPairs() };
  const reg = loadRegistry();
  const state = loadRegistryState();
  // 1) 키 확인·추가(add-only)
  const typeIds = [];
  for (const f of outFiles) typeIds.push(...typesOfOutFile(f, ctx).items);
  const plan = planKeys([...new Set(typeIds)], reg, ctx);
  if (plan.errors.length) { for (const e of plan.errors) log(`ERROR ${e.code}: ${e.msg}`); throw new Error('KEYS_BLOCKED: 대응표 유형을 레지스트리 키로 옮길 수 없다(geo-tpl-map.json 보강 필요)'); }
  if (plan.newTpls.size || plan.newPts.size || plan.newRows.length || plan.newBindings.length) {
    applyPlan(plan, reg); writeRegistry(reg); sealCrosswalk(); compileAll();
    const klog = path.join(PATHS.work, 'keys-added.json'); const prevLog = fs.existsSync(klog) ? readJson(klog) : { tpls: [], pts: [], rows: [], bindings: [] };
    for (const k of Object.keys(reg.added)) prevLog[k] = [...new Set([...(prevLog[k] || []), ...reg.added[k]])];
    wj(klog, prevLog);
    try { execFileSync('node', [P('archive/tools/similar-import/build-selection-tables.mjs'), '--write'], { cwd: REPO, stdio: 'ignore' }); } catch { /* 선택표는 열람용 사본 */ }
    log(`키 추가: PT ${plan.newPts.size}, TPL ${plan.newTpls.size} (${[...plan.newTpls.keys()].join(', ')}), 크로스워크 행 ${plan.newRows.length}, 연결 ${plan.newBindings.length}`);
  }
  const reg2 = loadRegistry();
  const masters = sim.loadMasters(REPO);
  const prepared = []; const skipped = [];
  for (const file of outFiles) {
    const outText = fs.readFileSync(file, 'utf8');
    const outSha = sha256(outText);
    const { bank } = bankFromText(outText, file);
    const grp = typesOfOutFile(file, ctx);
    const byType = new Map(grp.items.map(id => [id, []]));
    for (const [i, q] of bank.entries()) {
      const id = grp.kind === 'single' ? grp.items[0] : grp.items[(q.srcImage ?? 0) - 1];
      if (!id) throw new Error(`SRC_IMAGE_UNMAPPED ${path.basename(file)} #${q.id} srcImage=${q.srcImage}`);
      byType.get(id).push({ ...q, outIndex: i });
    }
    for (const [typeId, qs] of byType) {
      if (typeSkip(typeId)) { log(`제외 ${typeId}: ${typeSkip(typeId)}`); skipped.push({ typeId, why: typeSkip(typeId), n: qs.length }); continue; }
      if (!qs.length) { log(`건너뜀 ${typeId}: ${path.basename(file)} 에 문항이 없다`); continue; }
      const info = typeInfo(typeId, ctx);
      const k = resolveTypeKeys(info, reg2);
      if (k.error) throw new Error(`${k.error} ${k.msg}`);
      // 같은 유형이 다른 out 파일로 다시 오면 다음 회차 번호
      const entries = (state.types[typeId] ||= []);
      let ent = entries.find(e => e.outFile === path.basename(file));
      if (!ent) { ent = { n: entries.length + 1, outFile: path.basename(file) }; entries.push(ent); }
      const stem = stemFor(info, ent.n);
      const wd = workDir(stem);
      const prev = fs.existsSync(path.join(wd, 'state.json')) ? readJson(path.join(wd, 'state.json')) : null;
      // 보기·정답·해설이 깨진 문항(해설에 생성기 혼잣말이 섞이는 등)은 학생이 풀 문항이 아니므로 빼고 목록으로 남긴다.
      const excluded = qs.filter(q => hardIssues(q).length).map(q => ({ outId: q.id, srcNo: q.srcNo ?? null, issues: hardIssues(q).map(i => i.code) }));
      if (excluded.length) qs.splice(0, qs.length, ...qs.filter(q => !hardIssues(q).length));
      if (!qs.length) { log(`건너뜀 ${typeId}: 남은 문항이 없다`); continue; }
      qs.forEach((q, i) => { q.newId = i + 1; });
      const leaf = leafRow(reg2, k.leafIds[0]);
      const items = qs.map(q => baseItem(q, info, leaf, masters, k));
      const mech = items.map(it => ({ qid: it.id, issues: mechanicalChecks(it).filter(i => !(mechanical && i.code === 'DIFFICULTY_RANGE')) })).filter(x => x.issues.length);
      const figures = [];
      for (const it of items) for (const f of figureSpecs(it.content)) figures.push({ qid: it.id, kind: 'problem', spec: f.spec, ...(f.broken ? { broken: true } : {}) });
      const st = {
        stem, typeId, type: info.type, outFile: path.basename(file), outSha, srcMap: qs.map(q => ({ qid: q.newId, srcImage: q.srcImage ?? null, srcNo: q.srcNo ?? null, outId: q.id })),
        pt: k.pt, tpl: k.tpl, tplFromMapl: info.tplRaw, tplIsNew: Boolean(k.isNew), l4Ids: k.leafIds, leafPairs: k.leafPairs, droppedL4Ids: k.droppedLeafIds, expectedN: info.n, gotN: items.length, excluded, mech, figures, n: ent.n,
        stage: mechanical ? (prev && prev.outSha === outSha && prev.stage === 'APPLIED' && !force ? 'APPLIED' : 'MECHANICAL') : (prev && prev.outSha === outSha && prev.stage && prev.stage !== 'MECHANICAL' && !force ? prev.stage : 'PREPPED'),
      };
      fs.mkdirSync(wd, { recursive: true });
      if (prev && prev.outSha !== outSha) for (const f of ['solve.json', 'judgment.json']) fs.rmSync(path.join(wd, f), { force: true });
      // 이미 판정까지 끝난 시험지(stage APPLIED)의 JS 는 prep 이 덮어쓰지 않는다(--force 로만)
      const dest = path.join(TYPES_DIR, `${stem}.js`);
      if (!(st.stage === 'APPLIED' && fs.existsSync(dest))) {
        fs.mkdirSync(TYPES_DIR, { recursive: true });
        fs.writeFileSync(dest, serialize(stem, mechanical ? items.map(it => orderedItem(toMechanicalItem(it))) : items), 'utf8');
        if (mechanical) {
          // 이전에 판정했던 4칸·Resolver 증거는 새 JS 와 어긋나므로 지운다(판정은 대기).
          for (const old of [path.join(COMPACT_DIR, `${stem}.4slot.json`), path.join(GEN_DIR, `${stem}.create-resolver.json`)]) fs.rmSync(old, { force: true });
          for (const old of ['solve.json', 'judgment.json', 'meta-record.json']) fs.rmSync(path.join(wd, old), { force: true });
          wj(path.join(wd, 'meta-record.json'), {
            stem, js: `archive/exams/${TYPES_REL}/${stem}.js`, subject: SUBJECT, source: { outFile: st.outFile, outSha256: st.outSha, typeId, srcMap: st.srcMap },
            keys: { pt: st.pt, tpl: st.tpl, tplFromMapl: st.tplFromMapl, tplIsNew: st.tplIsNew, l4Candidates: st.l4Ids, leafPairs: st.leafPairs },
            authoring: { tool: 'archive/tools/aistudio-typebank/typebank-geo.mjs --mechanical', at: new Date().toISOString() },
            review: { status: 'MECHANICAL_ONLY', note: 'PT/TPL/L4/단원은 마플 대응표·크로스워크에서 기계적으로 붙였다. 정답은 생성기 답 그대로. 난이도·CrossConcept·Condition·결합 패턴·풀이 방법·4칸은 판정 대기(비워 둠).' },
            pending: ['difficultyBucket', 'crossConceptKeys', 'conditionKeys', 'integrationPattern', 'primaryMethod', 'decisiveStep', '4slot'],
            mechanicalChecks: st.mech, excluded, answerCheck: [], judgmentErrors: [], files: { compact4slot: null, v0Evidence: null, bridge: null }, bridge: null, figures: st.figures,
            NOT_RUN: ['Resolver CREATE(판정 칸이 비어 있어 못 돈다)', '메타 판정(난이도·CrossConcept·Condition·4칸)', '수학 내용 사람 검수', 'Chrome 렌더 확인', 'tools/run-tests.js 전체'],
          });
        }
      }
      wj(path.join(wd, 'state.json'), st);
      wj(path.join(wd, 'figures-todo.json'), { stem, file: `archive/exams/${TYPES_REL}/${stem}.js`, items: figures });
      prepared.push(stem);
      log(`prep ${stem}: ${items.length}문항(대기열 n=${info.n}), PT ${k.pt}, TPL ${k.tpl}${k.aliasOf ? ` (대응표 ${k.aliasOf})` : ''}, L4 ${k.leafIds.join('/')}${k.droppedLeafIds.length ? ` (뺌 ${k.droppedLeafIds.join('/')})` : ''}, 그림 ${figures.length}, 기계 검산 ${mech.length}건`);
      for (const m of mech) for (const i of m.issues) log(`   ${i.warn ? 'warn ' : 'ISSUE'} Q${m.qid} ${i.code}: ${i.msg}`);
    }
  }
  saveRegistryState(state);
  if (skipped.length) { const sf = path.join(PATHS.work, 'skipped-types.json'); const prevS = fs.existsSync(sf) ? readJson(sf) : []; wj(sf, [...new Map([...prevS, ...skipped].map(x => [x.typeId, x])).values()]); }
  return prepared;
}

// ---------- judge ----------
const readBankFile = f => bankFromText(fs.readFileSync(f, 'utf8'), f).bank;
const jsPathOf = stem => path.join(TYPES_DIR, `${stem}.js`);
const reqSha = text => sha256(text).slice(0, 16);

async function callDs(wd, name, prompt, outPath, label) {
  const sha = reqSha(prompt);
  fs.rmSync(outPath, { force: true });
  const r = await runDeepSeekWaiting(prompt.replace('__SHA__', sha), path.join(wd, `ds-${name}.log`), { onWait: m => log(`  DeepSeek 한도 대기 ${m}분 (${label})`) });
  if (r.status !== 'OK' || !fs.existsSync(outPath)) {
    // 파일을 못 썼으면 로그의 마지막 JSON 덩어리를 건져 본다
    const m = r.log.match(/\{\s*"requestSha"[\s\S]*\}\s*(?:DONE)?\s*$/);
    if (m) { try { JSON.parse(m[0].replace(/DONE\s*$/, '')); fs.writeFileSync(outPath, m[0].replace(/DONE\s*$/, ''), 'utf8'); } catch { /* 아래에서 실패 처리 */ } }
  }
  if (!fs.existsSync(outPath)) throw new Error(`DS_NO_OUTPUT ${label}: ${r.status}`);
  return JSON.parse(fs.readFileSync(outPath, 'utf8'));
}

export async function judge(stems, { onlyErrors = null, redo = false } = {}) {
  const menus = loadMenus(CFG);
  const dict = loadDictionary();
  const failFile = path.join(PATHS.work, 'judge-failures.json');
  for (const stem of stems) {
    try { await judgeOne(stem, { onlyErrors, redo, menus, dict }); } catch (e) {
      // 한 유형이 실패해도 나머지는 계속한다. 실패 목록은 작업 폴더에 남기고 다시 돌리면 이어서 한다.
      log(`judge 실패 ${stem}: ${e.message}`);
      const prev = fs.existsSync(failFile) ? readJson(failFile) : {}; prev[stem] = { at: new Date().toISOString(), error: String(e.message).slice(0, 300) }; wj(failFile, prev);
    }
  }
}

async function judgeOne(stem, { onlyErrors, redo, menus, dict }) {
  {
    const wd = workDir(stem); const st = readJson(path.join(wd, 'state.json'));
    const bank = readBankFile(jsPathOf(stem));
    const info = { ...typeInfo(st.typeId, { queue: loadQueue(), rows: loadMaplRows() }), l4Ids: st.l4Ids };
    const regJ = loadRegistry();
    info.candidates = st.l4Ids.map(id => ({ id, path: Object.values(leafRow(regJ, id)?.rpmPath || {}).join(' > ') }));
    // (1) 정답 독립 풀이
    const solvePath = path.join(wd, 'solve.json');
    if (redo || !fs.existsSync(solvePath)) {
      const draft = solveRequest({ stem, items: bank, outPath: solvePath.replace(/\\/g, '/'), requestSha: '__SHA__', cfg: CFG });
      log(`judge ${stem}: 독립 풀이 요청 (${bank.length}문항)`);
      await callDs(wd, 'solve', draft, solvePath, `${stem} solve`);
    }
    // (2) 메타 판정(오류가 있는 문항만 다시)
    const jPath = path.join(wd, 'judgment.json');
    const have = fs.existsSync(jPath) && !redo ? readJson(jPath) : { items: [] };
    const needQids = onlyErrors ? [...onlyErrors.keys()] : bank.map(q => q.id).filter(id => !have.items.some(i => i.qid === id));
    if (!needQids.length) { log(`judge ${stem}: 판정 완료됨`); return; }
    const items = bank.filter(q => needQids.includes(q.id));
    const part = path.join(wd, 'judgment.part.json');
    const errText = onlyErrors ? [...onlyErrors].map(([q, e]) => `- 문항 ${q}: ${e.join(' / ')}`).join('\n') : null;
    const draft = judgeRequest({ stem, info, cfg: CFG, items, menus, dict, outPath: part.replace(/\\/g, '/'), requestSha: '__SHA__', onlyErrors: errText });
    log(`judge ${stem}: 메타 판정 요청 (문항 ${needQids.join(',')})`);
    const res = await callDs(wd, 'judge', draft, part, `${stem} judge`);
    const merged = new Map(have.items.map(i => [i.qid, i]));
    for (const it of res.items || []) merged.set(it.qid, it);
    wj(jPath, { items: [...merged.values()].sort((a, b) => a.qid - b.qid) });
    fs.rmSync(part, { force: true });
    st.stage = 'JUDGED'; wj(path.join(wd, 'state.json'), st);
  }
}

// ---------- 묶음 판정 (정답 독립 풀이 없이, 단원 단위로 여러 유형을 한 번에) ----------
const BATCH_MAX_ITEMS = Number(process.env.TYPEBANK_BATCH_ITEMS || 30);

/** 한 번 호출 결과(문항마다 CC·Condition·결합 패턴·난이도·4칸)를 기존 judgment.json 문항 모양으로 바꾼다. 유형·PT/TPL·L4·정답은 이미 정해진 값이라 여기서 붙인다: 풀이 방법·결정 단계는 묻지 않으므로 비워 둔다. */
export function expandBatchResult(res, groups) {
  const out = new Map(); const missing = [];
  const byStem = new Map(groups.map(g => [g.stem, g]));
  for (const it of res.items || []) {
    const g = byStem.get(it.stem); if (!g || !g.items.some(q => q.id === it.qid)) continue;
    const list = out.get(g.stem) || out.set(g.stem, []).get(g.stem);
    const { stem, answerFlag, answerFlagReason, ...rest } = it;
    list.push({
      ...rest, rpmRecordId: it.rpmRecordId || g.info.l4Ids[0], crossConceptKeys: it.crossConceptKeys || [], conditionKeys: it.conditionKeys || [],
      format: it.format || '단일 정답', newTerms: it.newTerms || [], newKeyProposals: it.newKeyProposals || [], answerDoubt: answerFlag ? String(answerFlagReason || '정답이 맞지 않아 보임') : '',
    });
  }
  for (const g of groups) for (const q of g.items) if (!(out.get(g.stem) || []).some(i => i.qid === q.id)) missing.push(`${g.stem}#${q.id}`);
  return { out, missing };
}

export async function judgeBatch(stems, { errorsByStem = null, redo = false, maxItems = BATCH_MAX_ITEMS, onChunk = null } = {}) {
  const menus = loadMenus(CFG); const dict = loadDictionary(); const regJ = loadRegistry();
  const queue = loadQueue(); const rows = loadMaplRows();
  const groups = [];
  for (const stem of stems) {
    const wd = workDir(stem); const st = readJson(path.join(wd, 'state.json'));
    const bank = readBankFile(jsPathOf(stem));
    const jPath = path.join(wd, 'judgment.json');
    const have = fs.existsSync(jPath) && !redo ? new Set(readJson(jPath).items.map(i => i.qid)) : new Set();
    const errs = errorsByStem?.get(stem) || null;
    if (errorsByStem && !errs) continue;
    const need = errs ? bank.filter(q => errs.has(q.id)) : bank.filter(q => !have.has(q.id));
    if (!need.length) continue;
    const info = { ...typeInfo(st.typeId, { queue, rows }), pt: st.pt, tpl: st.tpl, l4Ids: st.l4Ids };
    info.candidates = st.l4Ids.map(id => ({ id, path: Object.values(leafRow(regJ, id)?.rpmPath || {}).join(' > ') }));
    groups.push({ stem, st, info, items: need, errors: errs ? Object.fromEntries(errs) : null, unit: leafRow(regJ, st.l4Ids[0])?.standardUnitKey || '' });
  }
  if (!groups.length) { log('judgeBatch: 판정할 문항이 없다'); return { calls: 0 }; }
  groups.sort((a, b) => a.unit.localeCompare(b.unit) || a.stem.localeCompare(b.stem));
  const chunks = []; let cur = [];
  // 같은 단원의 문항을 30개 안팎씩 묶는다(단원이 바뀌면 새 묶음).
  const weight = g => g.items.length;
  const limit = maxItems;
  for (const g of groups) { if (cur.length && (cur.reduce((n, x) => n + weight(x), 0) + weight(g) > limit || cur[0].unit !== g.unit)) { chunks.push(cur); cur = []; } cur.push(g); }
  if (cur.length) chunks.push(cur);
  const bdir = path.join(PATHS.work, 'batches'); fs.mkdirSync(bdir, { recursive: true });
  const failFile = path.join(PATHS.work, 'judge-failures.json'); let calls = 0; const timings = [];
  // TB_REVERSE=1: 뒤 묶음부터(두 프로세스가 양끝에서 만나게). 묶음마다 다른 프로세스가 이미 판정했는지 다시 본다.
  let order = process.env.TB_REVERSE === '1' ? [...chunks.entries()].reverse() : [...chunks.entries()];
  // TB_START=k: k번째 묶음부터 앞으로(세 번째 프로세스를 가운데서 출발시킬 때). 앞부분은 맨 뒤로 돈다.
  const st0 = Number(process.env.TB_START || 0); if (st0 > 0 && st0 < order.length) order = [...order.slice(st0), ...order.slice(0, st0)];
  for (const [ci, chunk0] of order) {
    const chunk = errorsByStem || redo ? chunk0 : chunk0.filter(g => {
      const jp = path.join(workDir(g.stem), 'judgment.json');
      if (!fs.existsSync(jp)) return true;
      const have = new Set(readJson(jp).items.map(i => i.qid));
      g.items = g.items.filter(q => !have.has(q.id));
      return g.items.length > 0;
    });
    if (!chunk.length) { log(`judgeBatch ${ci + 1}/${chunks.length}: 이미 판정됨, 건너뜀`); continue; }
    const name = `b${String(Date.now()).slice(-8)}-${ci}`;
    const part = path.join(bdir, `${name}.json`);
    const n = chunk.reduce((a, g) => a + g.items.length, 0);
    log(`judgeBatch ${ci + 1}/${chunks.length}: ${chunk.length}유형 ${n}문항 (단원 ${[...new Set(chunk.map(g => g.unit))].join('/')})`);
    const draft = judgeBatchRequest({ groups: chunk, menus, dict, outPath: part.replace(/\\/g, '/'), requestSha: '__SHA__', cfg: CFG });
    const t0 = Date.now();
    try {
      const res = await callDs(bdir, name, draft, part, `batch ${ci + 1}`);
      timings.push({ items: n, sec: Math.round((Date.now() - t0) / 1000) }); calls++;
      const { out, missing } = expandBatchResult(res, chunk);
      for (const g of chunk) {
        const jPath = path.join(workDir(g.stem), 'judgment.json');
        const merged = new Map((fs.existsSync(jPath) && !redo ? readJson(jPath).items : []).map(i => [i.qid, i]));
        for (const it of out.get(g.stem) || []) merged.set(it.qid, it);
        wj(jPath, { items: [...merged.values()].sort((a, b) => a.qid - b.qid) });
        g.st.stage = 'JUDGED'; wj(path.join(workDir(g.stem), 'state.json'), g.st);
      }
      log(`  완료 ${Math.round((Date.now() - t0) / 1000)}초, 응답 누락 ${missing.length}${missing.length ? ' (' + missing.slice(0, 6).join(', ') + ')' : ''}`);
      if (onChunk) await onChunk(chunk.map(g => g.stem)); // 묶음마다 바로 apply 해 중간에 멈춰도 끝난 유형은 JS·4칸이 반영돼 있게 한다
    } catch (e) {
      log(`  묶음 실패: ${e.message}`);
      const prev = fs.existsSync(failFile) ? readJson(failFile) : {}; prev[name] = { at: new Date().toISOString(), stems: chunk.map(g => g.stem), error: String(e.message).slice(0, 300) }; wj(failFile, prev);
    }
  }
  return { calls, timings };
}

// ---------- apply ----------
const BOUNDARY = new Set(sim.BOUNDARY_FLAGS);
const CONF = new Set(['high', 'medium', 'low']);
const FORMATS = ['단일 정답', '옳은 것 고르기', '옳지 않은 것 고르기', '보기(ㄱㄴㄷ) 판정', '보기 판정', '빈칸 채우기', '단답', '서술', '증명', '소문항 묶음'];

function validateJudgmentItem(j, base, st, menus) {
  const e = [];
  if (!st.l4Ids.includes(j.rpmRecordId)) e.push(`rpmRecordId ${j.rpmRecordId} 는 후보 ${st.l4Ids.join('|')} 중 하나여야 한다`);
  for (const k of ['primaryMethod', 'decisiveStep']) if (j[k] !== undefined && (typeof j[k] !== 'string' || j[k].trim().length < 8)) e.push(`${k} 가 너무 짧다`);
  if (!Array.isArray(j.crossConceptKeys) || new Set(j.crossConceptKeys).size !== j.crossConceptKeys.length || j.crossConceptKeys.length > 3) e.push('crossConceptKeys 는 중복 없는 배열(최대 3)');
  else for (const k of j.crossConceptKeys) if (!menus.cc.has(k)) e.push(`crossConceptKeys ${k} 는 등록부에 없다`);
  if (!Array.isArray(j.conditionKeys) || new Set(j.conditionKeys).size !== j.conditionKeys.length || j.conditionKeys.length > 2) e.push('conditionKeys 는 중복 없는 배열(최대 2)');
  else for (const k of j.conditionKeys) if (!menus.cond.has(k)) e.push(`conditionKeys ${k} 는 등록부에 없다`);
  if (!INTEGRATION_PATTERNS.includes(j.integrationPattern)) e.push(`integrationPattern ${j.integrationPattern}`);
  if (!Number.isInteger(j.difficultyBucket) || j.difficultyBucket < 1 || j.difficultyBucket > 5) e.push(`difficultyBucket ${j.difficultyBucket} 는 1~5 정수`);
  if (!CONF.has(j.difficultyConfidence)) e.push(`difficultyConfidence ${j.difficultyConfidence}`);
  if (!BOUNDARY.has(j.difficultyBoundaryFlag)) e.push(`difficultyBoundaryFlag ${j.difficultyBoundaryFlag}`);
  else if (/^B(\d)(\d)$/.test(j.difficultyBoundaryFlag)) { const [, a, b] = j.difficultyBoundaryFlag.match(/^B(\d)(\d)$/); if (![Number(a), Number(b)].includes(j.difficultyBucket)) e.push('경계 플래그의 두 단계에 difficultyBucket 이 들어 있어야 한다'); }
  if (typeof j.difficultyReason !== 'string' || j.difficultyReason.trim().length < 8) e.push('difficultyReason 이 비었다');
  if (!FORMATS.includes(j.format)) e.push(`format ${j.format}`);
  for (const s of ['given', 'goal', 'method', 'condition']) if (!Array.isArray(j.slots?.[s])) e.push(`slots.${s} 는 배열`);
  return e;
}

/** 전체 ACTIVE CrossConcept·Condition 키(모든 과목 묶음). 판정 목록(기하 묶음)에 없어 제안된 키가 이미 있는지 볼 때만 쓴다. */
function loadGlobalKeys() {
  const dir = P('archive/data/meta-foundation/canonical/concepts');
  const ccAll = new Set();
  for (const f of fs.readdirSync(dir)) for (const c of readJson(path.join(dir, f)).concepts || []) if (c.status === 'ACTIVE') ccAll.add(c.conceptKey);
  const condAll = new Set((readJson(P('archive/data/meta-foundation/canonical/condition_registry.json')).conditions || []).filter(c => c.status === 'ACTIVE').map(c => c.conditionKey));
  return { ccAll, condAll };
}

export async function apply(stems, { quiet = false } = {}) {
  const menus = loadMenus(CFG);
  const dict = v4.loadDict(REPO, 'docs/architecture/4slot/term-dictionary-v1.6.json');
  const lut = v4.buildLookup(dict);
  for (const t of dict.terms) lut.set('#' + t.id, t);
  const crosswalk = loadRegistry().crosswalk.records;
  const { ccAll, condAll } = loadGlobalKeys();
  const out = [];
  for (const stem of stems) {
    const wd = workDir(stem); const st = readJson(path.join(wd, 'state.json'));
    const bank = readBankFile(jsPathOf(stem));
    const jf = path.join(wd, 'judgment.json'); const sf = path.join(wd, 'solve.json');
    if (!fs.existsSync(jf)) { out.push({ stem, ok: false, reason: 'NO_JUDGMENT' }); continue; }
    const judgments = new Map(readJson(jf).items.map(j => [j.qid, j]));
    const solves = fs.existsSync(sf) ? new Map(readJson(sf).items.map(s => [s.qid, s])) : new Map();
    const errors = new Map();
    const addErr = (qid, m) => { (errors.get(qid) || errors.set(qid, []).get(qid)).push(m); };
    const final = []; const v0items = []; const candidates = []; const accepted = [];
    for (const base of bank) {
      const j = judgments.get(base.id);
      if (!j) { addErr(base.id, '판정이 없다'); final.push(base); continue; }
      for (const m of validateJudgmentItem(j, base, st, menus)) addErr(base.id, m);
      const it = {
        ...base, rpmPrimaryRecordId: j.rpmRecordId, ...(st.leafPairs?.[j.rpmRecordId] ? { problemTypeKey: st.leafPairs[j.rpmRecordId].pt, templateKey: st.leafPairs[j.rpmRecordId].tpl } : {}), primaryMethod: j.primaryMethod ? String(j.primaryMethod).trim() : undefined, decisiveStep: j.decisiveStep ? String(j.decisiveStep).trim() : undefined,
        crossConceptKeys: j.crossConceptKeys || [], conditionKeys: j.conditionKeys || [], integrationPattern: j.integrationPattern,
        difficultyBucket: j.difficultyBucket, difficultyConfidence: j.difficultyConfidence, difficultyBoundaryFlag: j.difficultyBoundaryFlag,
      };
      // 제안한 키가 다른 과목 묶음에 이미 ACTIVE 로 있으면(키 이름 일치) 받는다. 없는 키는 제안으로만 남긴다(추정 금지).
      it.crossConceptKeys = [...it.crossConceptKeys]; it.conditionKeys = [...it.conditionKeys];
      for (const p of j.newKeyProposals || []) {
        if (p.kind === 'CC' && ccAll.has(p.key) && !it.crossConceptKeys.includes(p.key) && it.crossConceptKeys.length < 3) { it.crossConceptKeys.push(p.key); accepted.push({ qid: base.id, key: p.key }); }
        if (p.kind === 'COND' && condAll.has(p.key) && !it.conditionKeys.includes(p.key) && it.conditionKeys.length < 2) { it.conditionKeys.push(p.key); accepted.push({ qid: base.id, key: p.key }); }
      }
      final.push(it);
      const slots = {};
      for (const s of ['given', 'goal', 'method', 'condition']) {
        slots[s] = (j.slots?.[s] || []).map(e => { const o = { term: e.term, src: e.src, quote: e.quote }; if (s === 'method') { o.evidenceType = e.evidenceType; if (e.justification) o.justification = e.justification; } return o; });
      }
      for (const nt of j.newTerms || []) if (!lut.has(String(nt.term).replace(/[\s·()\[\]]/g, ''))) candidates.push({ term: nt.term, en: [], synonyms: [], kind: nt.kind || '대상', parent: nt.parent || '', note: nt.note || '', usedIn: [base.id] });
      v0items.push({ sourceOrdinal: base.id, format: j.format, slots, steps: [], scenarioNote: '', reasons: {}, review: { status: 'UNREVIEWED' } });
    }
    // 후보 용어 합치기(같은 용어는 usedIn 만 늘린다)
    const candMap = new Map();
    for (const c of candidates) { const k = c.term; if (candMap.has(k)) candMap.get(k).usedIn.push(...c.usedIn); else candMap.set(k, { ...c }); }
    const finalSorted = final.map(orderedItem);
    const jsText = serialize(stem, finalSorted);
    fs.writeFileSync(jsPathOf(stem), jsText, 'utf8');
    const buf = Buffer.from(jsText, 'utf8');
    const blob = gitBlob(buf);
    const v0 = {
      schemaVersion: 'archive-meta-4slot-v0', sourceArchiveFile: `${TYPES_REL}/${stem}.js`, sourceGitBlobSha: blob, dictionaryVersion: dict.dictionaryVersion,
      judgedBy: { agent: 'opencode-go/deepseek-v4.1-flash', at: new Date().toISOString().slice(0, 10) }, candidates: [...candMap.values()],
      selfCheck: { note: '단일 모델 초안(UNREVIEWED). 인용은 validate-4slot 으로 원문 포함을 확인했다.' }, items: v0items,
    };
    const v = v4.validateData(v0, { root: REPO, dict, lut });
    for (const f of v.fail) { const m = f.match(/^#(\d+)\s/); addErr(m ? Number(m[1]) : 0, `4칸: ${f}`); }
    // 정답 독립 풀이 대조
    const answerCheck = [];
    for (const it of finalSorted) {
      const s = solves.get(it.id);
      const solved = s ? String(s.solved ?? '').trim() : '';
      const match = solved && solved !== '?' ? chk.answerMatchesStored({ questionType: '객관식', answer: it.answer, choices: it.choices }, solved) : null;
      const doubt = judgments.get(it.id)?.answerDoubt || '';
      answerCheck.push({ qid: it.id, stored: it.answer, solved: solved || null, match, doubt: doubt || undefined, note: s?.note || undefined });
    }
    const evidencePath = path.join(wd, `${stem}.4slot.v0.json`);
    wj(evidencePath, v0);
    // compact 4칸 + 기록
    let compactPath = null;
    if (!errors.size) {
      const items4 = v0.items.map(it => imp4.compactItem(it, lut, exam4.itemLookup(exam4.loadExam(jsPathOf(stem))))).sort((a, b) => a.ordinal - b.ordinal);
      const head = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: REPO, encoding: 'utf8' }).trim();
      const compact = {
        schemaVersion: 'archive-meta-4slot-compact-v1', sourceArchiveFile: `${TYPES_REL}/${stem}.js`, sourceGitBlobSha: blob, dictionaryVersion: dict.dictionaryVersion,
        evidence: { branch: branchName(), commit: head, path: evidencePath.replace(/\\/g, '/'), originalSha256: sha256(fs.readFileSync(evidencePath)) },
        reviewedBy: { agent: 'opencode-go/deepseek-v4.1-flash(검수 전)', at: new Date().toISOString().slice(0, 10), sampled: [] },
        items: items4,
      };
      fs.mkdirSync(COMPACT_DIR, { recursive: true });
      compactPath = path.join(COMPACT_DIR, `${stem}.4slot.json`);
      fs.writeFileSync(compactPath, imp4.serialize(compact), 'utf8');
    }
    // Resolver: stage-meta-bridge CREATE (문항마다)
    const bridge = errors.size ? null : await bridgeCreate(stem, finalSorted, st, answerCheck, crosswalk, jsText);
    const rec = {
      stem, js: `archive/exams/${TYPES_REL}/${stem}.js`, jsGitBlobSha1: blob, jsSha256: sha256(buf), source: { outFile: st.outFile, outSha256: st.outSha, typeId: st.typeId, srcMap: st.srcMap },
      keys: { pt: st.pt, tpl: st.tpl, tplFromMapl: st.tplFromMapl, tplIsNew: st.tplIsNew, l4Candidates: st.l4Ids },
      authoring: { tool: 'archive/tools/aistudio-typebank/typebank-geo.mjs', metaJudge: 'opencode-go/deepseek-v4.1-flash (단일 모델 초안, 검수 전)', at: new Date().toISOString() },
      review: { status: 'UNREVIEWED', note: '답안은 DeepSeek 독립 풀이(해설 비공개) 1회와 기계 검산으로 확인. 사람·Sonnet 검수 전.' },
      mechanicalChecks: st.mech, answerCheck, judgmentErrors: [...errors].map(([qid, m]) => ({ qid, errors: m })),
      files: { compact4slot: compactPath && path.relative(REPO, compactPath).replace(/\\/g, '/'), v0Evidence: evidencePath.replace(/\\/g, '/'), bridge: bridge?.file || null },
      bridge: bridge?.summary || null, figures: st.figures,
      NOT_RUN: ['수학 내용 사람 검수', 'Chrome 렌더 확인', 'tools/run-tests.js 전체·check-archive2-runtime (병합 직전)', '그림(SVG) 반영 뒤 4칸 blob 갱신'],
      proposals: [...judgments.values()].flatMap(j => (j.newKeyProposals || []).map(p => ({ qid: j.qid, ...p }))).filter(p => !accepted.some(a => a.qid === p.qid && a.key === p.key)),
      acceptedProposals: accepted,
    };
    wj(path.join(wd, 'meta-record.json'), rec);
    st.stage = errors.size ? 'JUDGED' : 'APPLIED'; st.errors = [...errors]; wj(path.join(wd, 'state.json'), st);
    out.push({ stem, ok: !errors.size, errors, record: rec });
    if (!quiet) log(`apply ${stem}: ${errors.size ? `오류 문항 ${[...errors.keys()].join(',')}` : 'OK'}; 4칸 WARN ${v.warn.length}; bridge ${bridge?.summary ? JSON.stringify(bridge.summary.byStatus) : '-'}`);
  }
  return out;
}

async function bridgeCreate(stem, items, st, answerCheck, crosswalk, jsText) {
  const rr = await import(pathToFileURL(P('archive/tools/meta-foundation/rpm-active-resolver.mjs')).href);
  const br = await import(pathToFileURL(P('archive/tools/meta-foundation/stage-meta-bridge.mjs')).href);
  const results = []; const byStatus = {};
  for (const it of items) {
    // 풀이 방법·결정 단계는 판정하지 않는다(발문·보기·정답만 읽고 고르는 방식). Resolver 결정 입력이 없어 CREATE 는 NOT_RUN 으로 남긴다.
    if (!it.primaryMethod || !it.decisiveStep) { byStatus.NOT_RUN = (byStatus.NOT_RUN || 0) + 1; results.push({ qid: it.id, metaStatus: 'NOT_RUN', errors: ['primaryMethod/decisiveStep 를 판정하지 않아 Resolver CREATE 를 돌리지 않았다'] }); continue; }
    const leaf = crosswalk.find(r => r.id === it.rpmPrimaryRecordId);
    const ac = answerCheck.find(a => a.qid === it.id);
    const input = {
      sourceIdentity: { sourceArchiveFile: `${TYPES_REL}/${stem}.js`, questionUid: `${TYPES_REL}/${stem}.js#q${it.id}`, sourceOrdinal: it.id, contentHash: sha256(it.content), choicesHash: sha256(JSON.stringify(it.choices)), imageRefHash: sha256('') },
      solutionIdentity: { status: 'VERIFIED_FINAL', independentVerification: ac?.match === true, solutionHash: sha256(it.solution) },
      curriculumContext: { grade: '고2', curriculum: '2022', scope: CFG.course, subjectFamily: '', standardCourse: CFG.course, standardUnitKey: it.standardUnitKey, subUnitKey: it.subUnitKey },
      semanticDecision: { primaryMethod: it.primaryMethod, decisiveStep: it.decisiveStep, rpmPath: { curriculum: '2022', scope: CFG.course, ...leaf.rpmPath } },
    };
    let verdict; let status;
    try {
      const iso = rr.buildDecisionIsolatedInput(input);
      const row = crosswalk.find(r => r.mappingStatus === 'DIRECT_ACTIVE' && r.problemTypeKey === it.problemTypeKey && r.templateKey === it.templateKey && (r.id === leaf.id || r.promotesRpmOnlyRowId === leaf.id || r.promotesBindingGapRowId === leaf.id));
      const withSel = row ? { ...input, familyTemplateSelection: { stage: 'POST_CROSSWALK', inputBundleSha: iso.inputBundleSha, crosswalkRecordId: row.id, templateKey: it.templateKey, decisiveStepReason: it.decisiveStep } } : input;
      const built = rr.buildResolverDecisionEvidence(withSel, { repoRoot: REPO });
      verdict = br.evaluateMetaStage({ stage: 'CREATE', built: { ...built, input: withSel }, candidateMeta: { problemTypeKey: it.problemTypeKey, templateKey: it.templateKey, crossConceptKeys: it.crossConceptKeys }, repoRoot: REPO });
      status = verdict.metaStatus === 'RESOLVER_ONLY' ? 'PASS' : verdict.metaStatus;
      verdict = { qid: it.id, metaStatus: verdict.metaStatus, semanticStatus: verdict.semanticStatus, projectionStatus: verdict.projectionStatus, errors: verdict.errors, crosswalkRecordId: verdict.resolverEvidence?.crosswalkRecordId, projectionReasonCode: verdict.resolverEvidence?.projectionReasonCode };
    } catch (e) {
      status = 'NOT_RUN'; verdict = { qid: it.id, metaStatus: 'NOT_RUN', errors: [String(e.message).slice(0, 200)] };
    }
    byStatus[status] = (byStatus[status] || 0) + 1;
    results.push(verdict);
  }
  const file = path.join(GEN_DIR, `${stem}.create-resolver.json`);
  wj(file, { schemaVersion: 'typebank-create-resolver-v1', subject: SUBJECT, stage: 'CREATE', stem, note: 'stage-meta-bridge.mjs --stage CREATE 와 같은 함수(evaluateMetaStage)를 문항마다 호출한 결과. 수학·렌더 통과를 뜻하지 않는다.', items: results });
  return { file: path.relative(REPO, file).replace(/\\/g, '/'), summary: { byStatus, items: results.length } };
}

// ---------- 오류 재판정 루프 (검사에 걸린 문항만 모아 한 번 다시 돌린다) ----------
export async function judgeAndApply(stems, rounds = 2) {
  await judgeBatch(stems, { onChunk: ss => apply(ss, { quiet: true }) });
  for (let r = 0; r <= rounds; r++) {
    const res = await apply(stems);
    const bad = res.filter(x => !x.ok && x.errors?.size);
    if (!bad.length) return res;
    if (r === rounds) return res;
    const byStem = new Map();
    for (const b of bad) {
      const qids = new Map([...b.errors].filter(([q]) => q > 0).map(([q, e]) => [q, e.slice(0, 6)]));
      if (qids.size) byStem.set(b.stem, qids);
    }
    log(`재판정 ${r + 1}회: ${byStem.size}유형 ${[...byStem.values()].reduce((n, m) => n + m.size, 0)}문항`);
    if (!byStem.size) return res;
    await judgeBatch([...byStem.keys()], { errorsByStem: byStem });
  }
}

/** 판정 대기 목록(저장소에 남는다): 기계 전용으로 들어와 난이도·CrossConcept·Condition·4칸이 비어 있는 유형. */
export function writePendingList() {
  const stems = fs.existsSync(PATHS.work) ? fs.readdirSync(PATHS.work).filter(d => fs.existsSync(path.join(PATHS.work, d, 'meta-record.json'))) : [];
  const rows = [];
  for (const d of stems.sort()) {
    const r = readJson(path.join(PATHS.work, d, 'meta-record.json'));
    if (r.review?.status !== 'MECHANICAL_ONLY') continue;
    rows.push({ stem: d, js: r.js, questions: readBankFile(P(r.js)).length, pt: r.keys.pt, tpl: r.keys.tpl, pending: r.pending, excluded: r.excluded?.length ? r.excluded : undefined });
  }
  wj(path.join(GEN_DIR, 'mechanical-pending.json'), { schemaVersion: 'typebank-mechanical-pending-v1', subject: SUBJECT, note: '기계 전용 반입 유형. 난이도·CrossConcept·Condition·결합 패턴·풀이 방법·4칸은 판정 대기(비워 둠, 추정으로 채우지 않았다).', count: rows.length, items: rows });
}

// ---------- report ----------
export function report() {
  const stems = fs.existsSync(PATHS.work) ? fs.readdirSync(PATHS.work).filter(d => fs.existsSync(path.join(PATHS.work, d, 'meta-record.json'))) : [];
  const recs = stems.map(s => readJson(path.join(PATHS.work, s, 'meta-record.json')));
  const allStems = fs.existsSync(PATHS.work) ? fs.readdirSync(PATHS.work).filter(d => fs.existsSync(path.join(PATHS.work, d, 'state.json'))) : [];
  const applied = recs.filter(r => !r.judgmentErrors.length);
  let q = 0; const fill = { pt: 0, tpl: 0, l4: 0, diff: 0, cc: 0, cond: 0, slots: 0, method: 0 }; let mism = 0; let unsure = 0; let figQ = 0; let mechIssues = 0;
  const mismList = []; const figAll = [];
  for (const r of recs) {
    const bank = readBankFile(P(r.js));
    q += bank.length;
    for (const it of bank) {
      if (it.problemTypeKey) fill.pt++; if (it.templateKey) fill.tpl++; if (it.rpmPrimaryRecordId) fill.l4++; if (Number.isInteger(it.difficultyBucket)) fill.diff++;
      if ((it.crossConceptKeys || []).length) fill.cc++; if ((it.conditionKeys || []).length) fill.cond++; if (it.primaryMethod && it.decisiveStep) fill.method++;
    }
    for (const a of r.answerCheck || []) { if (a.match === false) { mism++; mismList.push(`${r.stem} Q${a.qid} 저장 ${a.stored} / 풀이 ${a.solved}`); } else if (a.doubt) { unsure++; mismList.push(`${r.stem} Q${a.qid} 애매: ${a.doubt || a.note || '풀이 불가'}`); } }
    mechIssues += (r.mechanicalChecks || []).reduce((n, m) => n + m.issues.filter(i => !i.warn).length, 0);
    figQ += new Set((r.figures || []).map(f => f.qid)).size;
    for (const f of r.figures || []) figAll.push({ stem: r.stem, qid: f.qid, kind: f.kind, spec: f.spec });
    if (r.files.compact4slot) fill.slots += bank.length;
  }
  wj(path.join(PATHS.work, 'figures-todo-all.json'), { generatedAt: new Date().toISOString(), note: 'SVG 단계 입력: [그림: …] 자리표시가 남은 문항(qid, 설명). 본문의 자리표시는 SVG 반영 때 대체한다.', items: figAll });
  const reg = loadRegistry();
  const klog = path.join(PATHS.work, 'keys-added.json');
  const added = fs.existsSync(klog) ? readJson(klog) : { tpls: [], pts: [], rows: [], bindings: [] };
  const bridgeAll = recs.flatMap(r => Object.entries(r.bridge?.byStatus || {}));
  const bridgeSum = {}; for (const [k, n] of bridgeAll) bridgeSum[k] = (bridgeSum[k] || 0) + n;
  const proposals = recs.reduce((n, r) => n + (r.proposals?.length || 0), 0);
  const summary = {
    files: stems.length, filesFullyApplied: applied.filter(r => r.review?.status !== 'MECHANICAL_ONLY').length, filesMechanicalOnly: recs.filter(r => r.review?.status === 'MECHANICAL_ONLY').length, excludedQuestions: recs.flatMap(r => (r.excluded || []).map(e => `${r.stem} ${e.srcNo ?? e.outId} ${e.issues.join('/')}`)), questions: q, fill, fillPct: Object.fromEntries(Object.entries(fill).map(([k, n]) => [k, q ? Math.round(1000 * n / q) / 10 : 0])),
    newKeys: { pt: added.pts.length, tpl: added.tpls.length, crosswalkRows: added.rows.length, bindings: added.bindings.length, tplKeys: added.tpls, ptKeys: added.pts },
    shortOfQueueN: allStems.map(d => { const st = readJson(path.join(PATHS.work, d, 'state.json')); return st.gotN !== st.expectedN ? `${d} (${st.typeId}) 대기열 n=${st.expectedN} / 받은 ${st.gotN}` : null; }).filter(Boolean),
    crosswalkRowsTotal: reg.crosswalk.records.length,
  };
  wj(path.join(PATHS.work, 'report.json'), { summary, mismatchAndUnsure: mismList });
  return { summary, mismList };
}

// ---------- CLI ----------
async function main() {
  const [cmd, ...rest] = process.argv.slice(2).filter(a => !a.startsWith('--subject='));
  const files = rest.filter(a => !a.startsWith('--')).map(f => (fs.existsSync(f) ? path.resolve(f) : path.join(PATHS.outDir, f)));
  const flags = new Set(rest.filter(a => a.startsWith('--')));
  const stemsFromFiles = () => {
    const state = loadRegistryState(); const ctx = { queue: loadQueue(), pairs: loadPairs() };
    return files.flatMap(f => typesOfOutFile(f, ctx).items).flatMap(id => (state.types[id] || []).filter(e => files.some(ff => path.basename(ff) === e.outFile)).map(e => stemFor(typeInfo(id, { queue: ctx.queue, rows: loadMaplRows() }), e.n)));
  };
  if (!cmd || !['prep', 'judge', 'apply', 'all', 'report', 'keys', 'mech', 'files'].includes(cmd)) { console.error('Usage: typebank-geo.mjs [--subject=calc2] prep|judge|apply|all|report <out 파일(이름만 가능)>... [--force]'); process.exit(1); }
  // files: apply 까지 끝난(APPLIED) 유형의 저장소 파일 경로(JS·4칸 compact·Resolver 증거). 커밋: git add -f $(node …typebank-geo.mjs [--subject=calc2] files)
  if (cmd === 'files') {
    const dirs = fs.existsSync(PATHS.work) ? fs.readdirSync(PATHS.work).filter(d => fs.existsSync(path.join(PATHS.work, d, 'state.json'))) : [];
    for (const d of dirs.sort()) {
      if (readJson(path.join(PATHS.work, d, 'state.json')).stage !== 'APPLIED') continue;
      for (const f of [`archive/exams/${TYPES_REL}/${d}.js`, `archive/data/item-4slot/${TYPES_REL}/${d}.4slot.json`]) if (fs.existsSync(P(f))) console.log(f);
    }
    return;
  }
  if (cmd === 'report') { const r = report(); console.log(JSON.stringify(r.summary, null, 2)); for (const m of r.mismList) console.log(' -', m); return; }
  if (!files.length) { console.error('out 파일을 하나 이상 준다'); process.exit(1); }
  // TB_SKIP_PREP=1: 이미 prep된 묶음에 두 번째 판정 프로세스를 붙일 때(초안을 다시 쓰지 않는다).
  if (cmd === 'prep' || (cmd === 'all' && process.env.TB_SKIP_PREP !== '1')) await prep(files, { force: flags.has('--force') });
  if (cmd === 'mech') { await prep(files, { force: flags.has('--force'), mechanical: true }); writePendingList(); const r = report(); console.log(JSON.stringify(r.summary, null, 2)); for (const m of r.mismList) console.log(' -', m); return; }
  const stems = stemsFromFiles();
  if (cmd === 'judge') await judge(stems);
  if (cmd === 'apply') await apply(stems);
  if (cmd === 'all') await judgeAndApply(stems);
  if (cmd === 'all' || cmd === 'apply') { const r = report(); console.log(JSON.stringify(r.summary, null, 2)); }
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) main().catch(e => { console.error('ERROR', e.message); process.exit(1); });
