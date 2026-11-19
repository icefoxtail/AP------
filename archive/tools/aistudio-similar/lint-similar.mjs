#!/usr/bin/env node
// 사용법: node lint-similar.mjs <유사.js> <target.json> [--fix] [--json]
// 생성·합친 뒤 기계로 보는 것. 오류가 하나라도 있으면 종료 코드 1, 경고만이면 0.
//  오류: 파싱 실패 · 문항 수/번호(1..N)/유형이 원본과 다름 · 해설 비었음 · 객관식 정답이 목표 번호와 다름 ·
//        수 보기가 크기순 아님(CHOICE_ORDER) · 같은 값 보기(CHOICE_DUPLICATE) · 정답 번호 분포 결함 · 해설 끝 "정답은 ○"이 answer 와 다름
//  경고: \frac(→ --fix 로 \dfrac) · 생김새 누설(leakWarnings) · HTML 엔티티 · [그림: …] 자리표시 · 복수정답 · 수가 아닌 보기의 번호 불일치
// 기준 정본: docs/agents/similar-choices.md. 판정 함수는 하네스(archive/tools/similar-import/choice-order-lib.mjs)를 그대로 쓴다.
import fs from 'node:fs';
import path from 'node:path';
import { choiceLib, lib, bankFromText, stemOf, parseArgs, isMain, CIRCLED } from './common.mjs';

const FRAC_RE = /\\frac(?![A-Za-z])/g;
const textsOf = q => [q.content, ...(q.choices || []), q.solution].map(s => String(s ?? ''));


// ---- 보기 꼴 누설(오류): 나머지 네 보기가 같은 꼴인데 정답만 다른 경우 ----
// choice-order-lib 의 leakWarnings 는 "정답만 분수/근호/음수/소수"처럼 보기 전체가 아닌 한 가지 겉모양만 보고,
// 다섯 보기가 모두 분수일 때 분자 1 여부·약분 여부·분모를 비교하지 않아 \dfrac{1}{6}..\dfrac{5}{12} 같은 구성을 통과시킨다. 여기서 확장한다.
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
function choiceForm(c) {
  const s = String(c ?? '').replace(/\$/g, '').replace(/\\displaystyle|\\left|\\right|\\,|\\ /g, '').replace(/\s+/g, '').replace(/^\(|\)$/g, '');
  const neg = /^-/.test(s);
  const body = s.replace(/^[-+]/, '');
  const f = body.match(/^\\d?frac\{(\d+)\}\{(\d+)\}$/) || body.match(/^(\d+)\/(\d+)$/);
  const sqrt = /\\sqrt/.test(body);
  let kind = 'other';
  if (f) kind = 'frac'; else if (sqrt) kind = 'sqrt'; else if (/^\d+\.\d+$/.test(body)) kind = 'dec'; else if (/^\d+$/.test(body)) kind = 'int'; else if (/\\pi/.test(body)) kind = 'pi';
  const o = { kind, neg };
  if (f) { const a = +f[1], b = +f[2]; o.num1 = a === 1; o.reduced = gcd(a, b) === 1; o.den = b; }
  return o;
}
export function formLeaks(q) {
  if (!Array.isArray(q.choices) || q.choices.length !== 5) return [];
  const m = String(q.answer ?? '').match(/[①②③④⑤]/);
  if (!m || (String(q.answer).match(/[①②③④⑤]/g) || []).length !== 1) return [];
  const k = CIRCLED.indexOf(m[0]);
  const F = q.choices.map(choiceForm);
  if (F.some(f => f.kind === 'other')) return [];
  const out = [];
  const alone = (name, get) => {
    const rest = F.filter((_, i) => i !== k).map(get);
    const a = get(F[k]);
    if (rest.every(v => v === rest[0]) && a !== rest[0]) out.push(`${name}(나머지 4개 ${rest[0]} · 정답 ${a})`);
  };
  alone('종류(정수/분수/근호/소수)', f => f.kind);
  alone('부호', f => (f.neg ? '음수' : '양수'));
  if (F.every(f => f.kind === 'frac')) {
    alone('분자가 1', f => (f.num1 ? '1' : '1 아님'));
    alone('약분 여부', f => (f.reduced ? '기약' : '약분 가능'));
    alone('분모', f => f.den);
  }
  return out;
}

export async function lintSimilar({ jsPath, targetPath, fix = false }) {
  const C = await choiceLib();
  const L = await lib();
  const plan = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  const issues = []; // {qid|null, level, code, msg}
  const add = (qid, level, code, msg) => issues.push({ qid, level, code, msg });
  let fixedFrac = 0;

  let text = fs.readFileSync(jsPath, 'utf8');
  if (fix) {
    const next = text.replace(/(?<!\\)\\\\frac(?![A-Za-z])/g, () => { fixedFrac++; return '\\\\dfrac'; });
    if (fixedFrac) { fs.writeFileSync(jsPath, next, 'utf8'); text = next; }
  }
  let bank;
  try { ({ bank } = bankFromText(text, jsPath)); } catch (e) { add(null, 'ERROR', 'PARSE', e.message); return { plan, issues, bank: [], fixedFrac }; }

  if (bank.length !== plan.count) add(null, 'ERROR', 'COUNT', `문항 수 ${bank.length} ≠ 원본 ${plan.count}`);
  const ids = bank.map(q => q.id);
  if (ids.some((id, i) => id !== i + 1)) add(null, 'ERROR', 'IDS', `id 가 1..${plan.count} 순서가 아님: ${ids.join(',')}`);

  const nonNumeric = new Set(plan.nonNumericOriginalIds || []);
  for (const q of bank) {
    const qid = q.id;
    const want = plan.types?.[qid];
    if (want && q.questionType !== want) add(qid, 'ERROR', 'TYPE', `유형 ${q.questionType} ≠ 원본 ${want}`);
    if (!String(q.content ?? '').trim()) add(qid, 'ERROR', 'EMPTY_CONTENT', '발문이 비었다');
    if (!String(q.solution ?? '').trim()) add(qid, 'ERROR', 'EMPTY_SOLUTION', '해설이 비었다');
    if (!String(q.answer ?? '').trim()) add(qid, 'ERROR', 'EMPTY_ANSWER', '정답이 비었다');
    const all = textsOf(q).join('\n');
    const fracs = (all.match(FRAC_RE) || []).length;
    if (fracs) add(qid, 'WARN', 'FRAC', `\\frac ${fracs}곳 (--fix 로 \\dfrac)`);
    if (/&(lt|gt|amp|quot|#\d+);/.test(all)) add(qid, 'WARN', 'HTML_ENTITY', 'HTML 엔티티(&lt; 등)가 있다. < > 로 고친다');
    if (/\[그림\s*:/.test(all)) add(qid, 'WARN', 'FIGURE_NOTE', '[그림: …] 자리표시가 있다(그림은 나중에 일괄)');
    const mt = [q.content, q.solution, q.answer, ...(q.choices || [])].join('\n');
    if ((mt.match(/(?<!\\)\$/g) || []).length % 2) add(qid, 'ERROR', 'UNBALANCED_DOLLARS', '$ 개수가 홀수(수식 닫힘 확인)');
    if (/\\\(|\\\)/.test(mt)) add(qid, 'ERROR', 'PAREN_MATH', '수식 구분자 \\( \\) 사용 금지');
    if (/(?<!\\)\\[$_#=+<>~*`[\]]/.test(mt)) add(qid, 'ERROR', 'ESCAPE_RESIDUAL', '이스케이프 찌꺼기(\\$ \\_ 등)');
    for (const b of L.findBrokenStrings(q, 'q')) add(qid, 'ERROR', b.kind, b.path + ' 에 깨진 글자');
    if (q.questionType !== '객관식' && Array.isArray(q.choices) && q.choices.length) add(qid, 'ERROR', 'SUBJECTIVE_CHOICES', '서술형·단답형에 보기가 있다');
    if (!C.isObjectiveItem(q)) continue;

    if (q.choices.length !== 5) add(qid, 'ERROR', 'CHOICE_COUNT', `보기 ${q.choices.length}개`);
    const ans = L.parseObjectiveAnswer(q.answer);
    if (!ans) { add(qid, 'ERROR', 'ANSWER_FORMAT', `정답 "${q.answer}" 을 ①~⑤ 로 읽을 수 없다`); continue; }
    if (ans.length > 1) add(qid, 'WARN', 'MULTI_ANSWER', `복수정답 ${ans.join(',')} (표기만 확인)`);
    const analysis = C.analyzeChoiceOrder(q);
    const numeric = analysis.status !== 'NOT_NUMERIC';
    const tgt = plan.target?.[qid];
    if (tgt && ans.length === 1 && CIRCLED.indexOf(ans[0]) + 1 !== tgt) {
      add(qid, numeric && !nonNumeric.has(qid) ? 'ERROR' : 'WARN', 'TARGET_MISMATCH', `정답 ${ans[0]} ≠ 목표 ${CIRCLED[tgt - 1]}${numeric ? '' : ' (수가 아닌 보기라 경고)'}`);
    }
    if (analysis.status === 'A' || analysis.status === 'B') add(qid, 'ERROR', 'CHOICE_ORDER', `수 보기가 크기순이 아님(${analysis.status === 'A' ? '혼자 어긋난 보기가 정답' : '순서 어긋남'})`);
    if (analysis.dup) add(qid, 'ERROR', 'CHOICE_DUPLICATE', '같은 값의 보기가 있다');
    if (analysis.answerIssue) add(qid, 'ERROR', 'ANSWER_RANGE', analysis.answerIssue);
    for (const w of C.leakWarnings(q)) add(qid, 'WARN', 'LEAK', `${w} (정답만 생김새가 다름)`);
    for (const w of formLeaks(q)) add(qid, 'ERROR', 'FORM_LEAK', `보기 꼴 누설: ${w}. 오답 4개를 정답과 같은 꼴로 다시 짓는다`);
    const m = [...String(q.solution ?? '').matchAll(/정답은\s*([①②③④⑤](?:\s*,\s*[①②③④⑤])*)/g)].pop();
    if (m) {
      const got = m[1].split(/\s*,\s*/);
      if (got.length !== ans.length || !ans.every(a => got.includes(a))) add(qid, 'ERROR', 'SOLUTION_ANSWER', `해설 끝 정답 ${got.join(',')} ≠ answer ${ans.join(',')}`);
    } else add(qid, 'WARN', 'SOLUTION_NO_ANSWER_LINE', '해설에 "정답은 ○이다" 줄이 없다');
  }

  const dist = C.answerDistribution(bank);
  if (dist.skewed) add(null, 'ERROR', 'ANSWER_DISTRIBUTION', dist.reasons.join(' / '));
  return { plan, issues, bank, fixedFrac, dist };
}

if (isMain(import.meta.url)) {
  const { pos, opt } = parseArgs(process.argv.slice(2), ['--fix', '--json']);
  if (pos.length < 2) { console.error('Usage: node lint-similar.mjs <유사.js> <target.json> [--fix] [--json]'); process.exit(1); }
  const jsPath = path.resolve(pos[0]);
  const r = await lintSimilar({ jsPath, targetPath: path.resolve(pos[1]), fix: Boolean(opt['--fix']) });
  const errs = r.issues.filter(i => i.level === 'ERROR');
  const warns = r.issues.filter(i => i.level === 'WARN');
  if (opt['--json']) console.log(JSON.stringify(r.issues, null, 1));
  else {
    console.log(`lint ${stemOf(jsPath)}: ${r.bank.length}문항, 오류 ${errs.length}, 경고 ${warns.length}${r.fixedFrac ? `, \\frac→\\dfrac ${r.fixedFrac}곳 고침` : ''}`);
    if (r.dist) console.log(`정답 번호 열: ${r.dist.sequence} · ${C_FMT(r.dist)}`);
    for (const i of [...errs, ...warns]) console.log(`${i.level === 'ERROR' ? 'ERROR' : 'warn '} ${i.qid ? 'Q' + String(i.qid).padStart(2, '0') : '시험지'} ${i.code}: ${i.msg}`);
    const qids = [...new Set(r.issues.filter(i => i.qid).map(i => i.qid))].sort((a, b) => a - b);
    console.log(`플래그 문항: ${qids.length ? qids.join(', ') : '없음'} · 오류 문항: ${[...new Set(errs.filter(i => i.qid).map(i => i.qid))].sort((a, b) => a - b).join(', ') || '없음'}`);
  }
  process.exit(errs.length ? 1 : 0);
}

function C_FMT(d) { return `객관식 ${d.objective} · ${CIRCLED.map((c, i) => `${c}${d.counts[i]}`).join(' ')} · 최장 연속 ${d.longestRun}${d.skewed ? ' · 결함' : ''}`; }
