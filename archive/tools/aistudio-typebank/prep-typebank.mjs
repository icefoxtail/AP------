#!/usr/bin/env node
// 사용법:
//   node archive/tools/aistudio-typebank/prep-typebank.mjs --subject geo|calc2 --tpl <TPL_KEY|PT_KEY> [--l4 <RPM id,...>] [--short <짧은유형명>] --round <N> --out <폴더>
// 결과(--out): request.txt (AI Studio에 붙여 넣을 한국어 요청) · target.json (intake-typebank 가 검사에 쓰는 목표)
// 흐름과 이유: docs/agents/aistudio-similar.md "유형 채우기(TYPE_BANK)".
// 정답 번호는 모델이 고르지 않고 이 스크립트가 시드로 뽑는다(similar-choices.md 규칙 3). 5문항은 서로 다른 번호 5개(순환·증감열 제외).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  SUBJECTS, ROLES, INTEGRATION_PATTERNS, EXAMS_ROOT, TYPES_DIR, META_ROOT, HARNESS,
  loadTaxonomy, loadSelection, loadCrosswalk, loadMenus, unitOrder, oneLine,
  parseArgs, isMain, bankFromText, CIRCLED, choiceLib,
} from './common.mjs';
import { INSTRUCTION } from '../aistudio-similar/plan-answers.mjs';

const SELF_CHECK = '출력 전에 문항마다 정답을 해설과 다른 방법(대입·역산·경우 세기 검산)으로 한 번 더 확인하고, 다르면 고쳐서 낸다. 보기 다섯 개를 나란히 보고 정답만 꼴이 다르면 오답을 고친다.';
const DUP_LIMIT = 12;

export function seededPermutation(seed, findCyclicRun) {
  for (let n = 0; n < 5000; n++) {
    const bytes = crypto.createHash('sha256').update(`typebank|${seed}|${n}`).digest();
    const arr = [1, 2, 3, 4, 5];
    for (let i = 4; i > 0; i--) { const j = bytes[i] % (i + 1); [arr[i], arr[j]] = [arr[j], arr[i]]; }
    const s = arr.join('');
    if (s === '12345' || s === '54321') continue;
    if (findCyclicRun(arr.map(String))) continue;
    // 인접한 번호가 한 칸씩 늘거나 주는 3개 연속도 피한다(눈에 띄는 규칙처럼 보인다)
    if (arr.some((v, i) => i >= 2 && ((arr[i - 1] - arr[i - 2] === 1 && v - arr[i - 1] === 1) || (arr[i - 2] - arr[i - 1] === 1 && arr[i - 1] - v === 1)))) continue;
    return arr;
  }
  throw new Error('정답 번호 배열을 뽑지 못했습니다');
}

// 메타 샤드를 한 번 훑어: 이 유형이 붙은 기존 문항 + 같은 과목 단원에서 쓰인 교차개념·조건 키 사용 횟수
function archiveScan(tplSet, prefixes) {
  const dir = path.join(HARNESS, 'archive/data/question-metadata/v1');
  const hits = []; const ccUse = new Map(); const condUse = new Map();
  for (const f of fs.readdirSync(dir)) {
    let arr = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    if (!Array.isArray(arr)) arr = [arr];
    for (const r of arr) {
      if (r.templateKey && tplSet.has(r.templateKey)) hits.push(r);
      if (prefixes.some(p => String(r.standardUnitKey || '').startsWith(p))) {
        for (const k of r.crossConceptKeys || []) ccUse.set(k, (ccUse.get(k) || 0) + 1);
        for (const k of r.conditionKeys || []) condUse.set(k, (condUse.get(k) || 0) + 1);
      }
    }
  }
  return { hits, ccUse, condUse };
}

function loadBankSafe(rel) {
  const p = path.join(EXAMS_ROOT, rel);
  if (!fs.existsSync(p)) return null;
  try { return bankFromText(fs.readFileSync(p, 'utf8'), p).bank; } catch { return null; }
}

function stemExcerpts(hits) {
  const order = r => (r.sourceArchiveFile.startsWith('original/') ? 0 : r.sourceArchiveFile.startsWith('similar/') ? 1 : 2);
  const sorted = [...hits].sort((a, b) => order(a) - order(b) || b.sourceArchiveFile.localeCompare(a.sourceArchiveFile, 'ko') || Number(a.sourceQuestionNo) - Number(b.sourceQuestionNo));
  const cache = new Map();
  const out = [];
  let missing = 0;
  for (const r of sorted) {
    if (out.length >= DUP_LIMIT) break;
    if (!cache.has(r.sourceArchiveFile)) cache.set(r.sourceArchiveFile, loadBankSafe(r.sourceArchiveFile));
    const bank = cache.get(r.sourceArchiveFile);
    const q = bank && (bank.find(x => String(x.id) === String(r.sourceQuestionNo)) || bank[(r.sourceOrdinal || 1) - 1]);
    if (!q) { missing++; continue; }
    out.push(`- (${path.basename(r.sourceArchiveFile, '.js')} ${r.sourceQuestionNo}번) ${oneLine(q.content, 130)}${q.image ? ' (그림 있음)' : ''}`);
  }
  return { lines: out, missing };
}

function earlierRounds(tplSet) {
  const out = [];
  if (!fs.existsSync(TYPES_DIR)) return out;
  for (const f of fs.readdirSync(TYPES_DIR)) {
    if (!/_유형은행\d+\.js$/.test(f)) continue;
    let bank; try { bank = bankFromText(fs.readFileSync(path.join(TYPES_DIR, f), 'utf8'), f).bank; } catch { continue; }
    if (!bank.some(q => tplSet.has(q.templateKey))) continue;
    out.push({ file: f, lines: bank.map(q => `  · ${q.id}번 ${oneLine(q.content, 110)}`) });
  }
  return out;
}

function pickAnchors({ cfg, ptKeys, unitKey, round }) {
  const p = path.join(HARNESS, cfg.anchor);
  const { bank } = bankFromText(fs.readFileSync(p, 'utf8'), p);
  const scored = bank
    .filter(q => q.questionType === '객관식' && Array.isArray(q.choices) && q.choices.length === 5)
    .map(q => ({ q, s: (ptKeys.has(q.problemTypeKey) ? 3 : 0) + (q.standardUnitKey === unitKey ? 2 : 0) + (cfg.anchorKeywords.test(q.content) ? 1 : 0) }))
    .sort((a, b) => b.s - a.s || a.q.id - b.q.id);
  const top = scored.filter(x => x.s === scored[0].s).length >= 3 ? scored.filter(x => x.s === scored[0].s) : scored;
  const start = ((round - 1) * 3) % Math.max(top.length, 1);
  const rotated = [...top.slice(start), ...top.slice(0, start)].slice(0, 3);
  return { name: path.basename(cfg.anchor, '.js'), items: rotated.map(x => x.q) };
}

const fmtChoices = ch => ch.map((c, i) => `${CIRCLED[i]} ${c}`).join('   ');

export async function prepTypebank({ subject, key, l4 = null, short = null, round, outDir }) {
  const cfg = SUBJECTS[subject];
  if (!cfg) throw new Error(`--subject 는 ${Object.keys(SUBJECTS).join('|')} 중 하나`);
  const { pts, tpls } = loadTaxonomy();
  const isPt = key.startsWith('PT_');
  let ptKey; let tplKeys;
  if (isPt) {
    if (!pts.has(key)) throw new Error(`분류표에 PT 가 없습니다: ${key}`);
    ptKey = key;
    tplKeys = [...tpls.values()].filter(t => t.parentProblemTypeKey === key && t.status === 'ACTIVE').map(t => t.templateKey);
    if (!tplKeys.length) throw new Error(`PT ${key} 아래 ACTIVE TPL 이 없습니다`);
  } else {
    const t = tpls.get(key);
    if (!t) throw new Error(`분류표에 TPL 이 없습니다: ${key}`);
    if (t.status !== 'ACTIVE') throw new Error(`TPL 이 ACTIVE 가 아닙니다: ${key} (${t.status})`);
    ptKey = t.parentProblemTypeKey; tplKeys = [key];
  }
  const pt = pts.get(ptKey);
  const tplRows = tplKeys.map(k => tpls.get(k));

  // 단원·RPM 행: 크로스워크에서 이 TPL(또는 PT)에 연결된 2022 행 → 없으면 분류표 sourceUnit 의 행 전부
  const rows = loadCrosswalk(cfg);
  let linked = rows.filter(r => tplKeys.includes(r.templateKey));
  if (!linked.length) linked = rows.filter(r => r.problemTypeKey === ptKey);
  let unitKeys = [...new Set(linked.map(r => r.standardUnitKey))];
  if (!unitKeys.length) {
    const su = tplRows[0].sourceUnit || pt.sourceUnit;
    if (su && rows.some(r => r.standardUnitKey === su)) unitKeys = [su];
  }
  if (unitKeys.length !== 1) throw new Error(`단원을 하나로 정하지 못했습니다(${unitKeys.join(',') || '없음'}). 크로스워크 연결이나 분류표 sourceUnit 이 필요합니다.`);
  const unitKey = unitKeys[0];
  const units = loadSelection(cfg);
  const unit = units.get(unitKey);
  if (!unit) throw new Error(`선택표에 단원이 없습니다: ${unitKey}`);
  const unitRows = rows.filter(r => r.standardUnitKey === unitKey);
  let rpm = linked.length ? linked : unitRows;
  if (l4) {
    const want = l4.split(',').map(s => s.trim()).filter(Boolean);
    const miss = want.filter(id => !unitRows.some(r => r.id === id));
    if (miss.length) throw new Error(`--l4 행이 이 단원(${unitKey}) 크로스워크에 없습니다: ${miss.join(', ')}`);
    rpm = unitRows.filter(r => want.includes(r.id));
  }
  const subKeys = [...new Set(rpm.map(r => r.subUnitKey).filter(Boolean))];
  const subUnitKey = subKeys.length === 1 ? subKeys[0] : (unit.subs.size === 1 ? [...unit.subs.keys()][0] : null);
  const subUnit = subUnitKey ? (unit.subs.get(subUnitKey) ?? null) : null;
  const crosswalkStatus = [...new Set(rpm.map(r => `${r.mappingStatus}/${r.bindingStatus}`))];

  const short2 = short || (tplRows[0].canonicalLabelKo || key).replace(/[^가-힣A-Za-z0-9]/g, '').slice(0, 8);
  const stem = `${cfg.stemPrefix}_${short2}_고2_유형은행${round}`;

  // 정답 번호
  const C = await choiceLib();
  const { findCyclicRun } = await import(new URL('../similar-import/choice-order-lib.mjs', import.meta.url).href);
  const perm = seededPermutation(stem, findCyclicRun);
  const answers = Object.fromEntries(perm.map((n, i) => [i + 1, n]));

  // 중복 회피 자료
  const tplSet = new Set(tplKeys);
  const { hits, ccUse, condUse } = archiveScan(tplSet, cfg.usagePrefixes);
  const ex = stemExcerpts(hits);
  const earlier = earlierRounds(tplSet).filter(e => e.file !== `${stem}.js`);
  const anchors = pickAnchors({ cfg, ptKeys: new Set([ptKey]), unitKey, round });
  const menus = loadMenus(cfg);
  const top = (use, reg, n) => [...use.entries()].filter(([k]) => reg.has(k)).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, n).map(([k]) => k);
  const ccShown = top(ccUse, menus.cc, 40);
  const condShown = top(condUse, menus.cond, 20);

  const L = [];
  L.push(`[요청] 아래 "유형 하나"를 5문항 세트로 만든다. 학원 문제은행의 "유형 은행" 파일이다. 객관식 5문항만, 한 번에 낸다.`);
  L.push('');
  L.push('## 1. 목표 유형');
  L.push(`- 교육과정: ${cfg.curriculum} 개정 · 과목 ${cfg.course}`);
  L.push(`- 단원: \`${unitKey}\` ${unit.name}${subUnitKey ? ` · 소단원 \`${subUnitKey}\` ${subUnit ?? ''}` : ' · 소단원 없음(subUnitKey 는 null)'}`);
  L.push(`- 유형(PT): \`${ptKey}\` ${pt.canonicalLabelKo} — ${pt.definition}`);
  for (const t of tplRows) {
    L.push(`- 템플릿(TPL): \`${t.templateKey}\` ${t.canonicalLabelKo} — ${t.definition}${t.internalSkeleton ? ` (풀이 골격: ${t.internalSkeleton})` : ''}`);
  }
  if (isPt) L.push('  (PT 를 지정했으므로 문항마다 위 TPL 중 하나를 고르고, 5문항이 가능하면 서로 다른 TPL 을 포함하게 한다.)');
  L.push(`- 이 유형이 붙는 RPM 행(문항마다 가장 가까운 1개를 rpmPrimaryRecordId 에 쓴다):`);
  for (const r of rpm) L.push(`  - \`${r.id}\` ${r.path}`);
  L.push(`- 이 유형의 기존 아카이브 문항: ${hits.length}개${hits.length === 0 ? ' (없음 — 이 세트가 이 유형의 첫 문항들이다)' : ''}`);
  L.push('');
  L.push('## 2. 5문항의 역할 (TYPE_BANK)');
  L.push('- 1번 기본형: 이 유형의 대표 형태. 한 번에 읽히고 정의·공식을 곧바로 쓰는 문항.');
  L.push('- 2·3번 구조변형: 숫자만 바꾸지 않는다. 주어진 것과 묻는 것을 뒤집거나, 좌표로 주어진 것을 정의(길이·각·조건)로 바꾸거나, 조건의 표현 방식을 바꾼다. 서로 다른 방향으로 바꾼다.');
  L.push('- 4·5번 사고확장: 판단 단계를 하나 더 넣는다. 조건 뒤집기, 경우 나누기, 역할 바꾸기, 식 세우기, 반례 찾기 중에서 고른다. 계산량만 늘린 것은 가짜 심화라 금지다.');
  L.push('- 난이도(difficultyBucket)는 1번 1~2, 2·3번 2~3, 4·5번 3~5의 정수다. 풀이 줄 수·계산량이 아니라 필요한 판단 단계로 정한다. 정의·공식을 바로 쓰면 1이다.');
  L.push('');
  L.push('## 3. 중복 피하기');
  if (ex.lines.length) {
    L.push(`이 유형으로 이미 있는 문항(발문 일부)이다. 같은 설정·같은 수치·같은 도형을 쓰지 않는다. 총 ${hits.length}개 중 ${ex.lines.length}개를 보여 준다.`);
    L.push(...ex.lines);
  } else L.push('이 유형으로 아카이브에 이미 있는 문항이 없다(자료 파일을 읽을 수 없는 문항 포함). 5문항끼리만 서로 다르게 만든다.');
  if (earlier.length) {
    L.push('');
    L.push('이 도구로 이미 만든 이전 회차다. 이 문항들과도 겹치지 않게 한다.');
    for (const e of earlier) { L.push(`- ${e.file}`); L.push(...e.lines); }
  }
  L.push('');
  L.push('## 4. 문체 기준 (실제 학교 시험지 문항, 풀이 없음)');
  L.push(`출처: ${anchors.name}. 발문 길이·어투·보기 꼴만 참고한다. 내용을 베끼지 않는다.`);
  anchors.items.forEach((q, i) => {
    L.push(`<예시 ${i + 1}>${q.image ? ' (원본은 그림이 있다)' : ''}`);
    L.push(String(q.content).trim());
    L.push(fmtChoices(q.choices));
    L.push('');
  });
  L.push('## 5. 범위');
  L.push(`- ${cfg.boundary}`);
  L.push('- 학생 이름·인물·억지 실생활 이야기를 쓰지 않는다. 서로 관계없는 양을 억지로 더하거나 곱하지 않는다. 수학 문장만으로 쓴다.');
  L.push('- 수식은 KaTeX 만 쓴다: 인라인 $...$, 분수는 \\dfrac, 구분자 \\( \\) 금지. HTML 엔티티·마크다운 굵게(**) 금지. JS 문자열이므로 역슬래시는 두 번(\\\\dfrac)으로 쓴다.');
  L.push(`- ${cfg.figureNote}`);
  L.push('');
  L.push('## 6. 정답 번호와 보기');
  L.push(`정답 번호 지정: ${perm.map((n, i) => `${i + 1}번 ${CIRCLED[n - 1]}`).join(', ')}`);
  L.push(INSTRUCTION);
  L.push('- 전 문항 객관식(보기 5개), 정답은 ①~⑤ 한 글자. 복수 정답 금지.');
  L.push('- 수로 된 보기는 ①→⑤ 크기순이고, 오답은 정답과 같은 꼴(분수는 분수끼리, 근호는 근호끼리)로 짓는다.');
  L.push(SELF_CHECK);
  L.push('');
  L.push('## 7. 메타 칸에 쓸 수 있는 값 (이 목록의 키만 쓴다. 없으면 빈 배열)');
  L.push(`- crossConceptKeys (0~3개, 이 과목 단원에서 실제 쓰인 키): ${ccShown.map(k => `${k}(${menus.cc.get(k)})`).join(', ')}`);
  L.push(`- conditionKeys (0~2개): ${condShown.map(k => `${k}(${menus.cond.get(k)})`).join(', ')}`);
  L.push(`- integrationPattern: ${INTEGRATION_PATTERNS.join(' | ')} (한 단계로 끝나면 NONE, 앞 결과를 다음 단계가 쓰면 SEQUENTIAL, 판단 단계가 둘 이상 얽히면 INTERDEPENDENT 이상)`);
  L.push(`- primaryMethod: 이 문항을 푸는 방법 한 구(예: "${cfg.methodExample}").`);
  L.push('- decisiveStep: 풀이의 결정적 한 단계를 이 문항의 숫자·식으로 한 문장.');
  L.push('');
  L.push('## 8. 출력 형식');
  L.push('코드 블록 하나(```js)에 아래 꼴로만 낸다. 설명은 코드 블록 밖에 두지 않는다(변형 요약 5줄만 블록 아래에 허용). 아래 필드 이름을 그대로 쓰고 다른 필드를 만들지 않는다. level, score, category 는 쓰지 않는다.');
  L.push('```js');
  L.push(`window.examTitle = "${stem}";`);
  L.push('window.questionBank = [');
  L.push('  {');
  L.push('    "id": 1,');
  L.push('    "questionType": "객관식",');
  L.push('    "content": "발문 (그림이 필요하면 끝에 [그림: 점·좌표·길이·강조할 것을 정확히])",');
  L.push('    "choices": ["$...$", "$...$", "$...$", "$...$", "$...$"],');
  L.push('    "answer": "③",');
  L.push('    "solution": "판서형: 한 단계 한 줄, 마지막 줄 \\"따라서 ...이므로 정답은 ③이다.\\" (그림이 있으면 이해가 빨라질 해설은 끝에 [해설그림: 정확한 작도 설명])",');
  L.push(`    "curriculum": "${cfg.curriculum}",`);
  L.push(`    "standardCourse": "${cfg.course}",`);
  L.push(`    "standardUnitKey": "${unitKey}",`);
  L.push(`    "subUnitKey": ${subUnitKey ? `"${subUnitKey}"` : 'null'},`);
  L.push(`    "rpmPrimaryRecordId": "${rpm[0].id}",   // 위 RPM 행 중 하나`);
  L.push(`    "problemTypeKey": "${ptKey}",`);
  L.push(`    "templateKey": "${tplKeys[0]}",${isPt ? '   // 위 TPL 중 하나' : ''}`);
  L.push('    "primaryMethod": "...",');
  L.push('    "decisiveStep": "...",');
  L.push('    "difficultyBucket": 2,');
  L.push('    "crossConceptKeys": [],');
  L.push('    "conditionKeys": [],');
  L.push('    "integrationPattern": "NONE"');
  L.push('  },');
  L.push('  // ... 2~5번도 같은 꼴 (id 는 1~5)');
  L.push('];');
  L.push('```');
  L.push('코드 블록 아래에는 "1번 기본형: …, 2번 구조변형(…을 바꿈): …, …" 식으로 5줄만 쓴다.');

  const request = L.join('\n') + '\n';
  const target = {
    schema: 'typebank-target-v1',
    stem, subject, round, count: 5,
    // lint-similar.mjs 와 같은 칸(문항 수·유형·목표 정답)
    types: Object.fromEntries([1, 2, 3, 4, 5].map(i => [i, '객관식'])),
    target: answers, nonNumericOriginalIds: [],
    curriculum: cfg.curriculum, standardCourse: cfg.course,
    standardUnitKey: unitKey, standardUnit: unit.name, standardUnitOrder: unitOrder(unitKey),
    subUnitKey, subUnit,
    problemTypeKey: ptKey, templateKeys: tplKeys,
    rpmIds: rpm.map(r => r.id),
    crosswalkStatus,
    menu: { crossConceptKeys: ccShown, conditionKeys: condShown },
    archiveQuestionCount: hits.length,
    roles: ROLES,
  };
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'request.txt'), request, 'utf8');
  fs.writeFileSync(path.join(outDir, 'target.json'), JSON.stringify(target, null, 2) + '\n', 'utf8');
  return { stem, requestChars: request.length, target, excerptMissing: ex.missing, hits: hits.length };
}

if (isMain(import.meta.url)) {
  const { opt } = parseArgs(process.argv.slice(2));
  if (!opt['--subject'] || !opt['--tpl'] || !opt['--round'] || !opt['--out']) {
    console.error('Usage: node prep-typebank.mjs --subject geo|calc2 --tpl <TPL_KEY|PT_KEY> [--l4 <RPM id,...>] [--short <짧은유형명>] --round <N> --out <폴더>');
    process.exit(1);
  }
  try {
    const r = await prepTypebank({ subject: opt['--subject'], key: opt['--tpl'], l4: opt['--l4'] || null, short: opt['--short'] || null, round: Number(opt['--round']), outDir: path.resolve(opt['--out']) });
    console.log(`stem: ${r.stem}`);
    console.log(`request.txt ${r.requestChars}자 · target.json · 정답 번호 ${Object.values(r.target.target).map(n => CIRCLED[n - 1]).join('')} · 기존 문항 ${r.hits}개`);
    console.log(`크로스워크 상태: ${r.target.crosswalkStatus.join(', ')}`);
  } catch (e) { console.error('ERROR:', e.message); process.exit(1); }
}
