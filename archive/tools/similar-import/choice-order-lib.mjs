// 객관식 보기 순서·정답 번호 분포 점검 (유사문항 반입 검사와 전수 조사 스크립트가 함께 쓰는 한 곳).
// 규칙·결함 기준·절차의 정본: docs/agents/similar-choices.md (기준 값을 바꾸려면 그 문서를 먼저 고친다).
// 이유: 변형으로 정답 값이 바뀌었는데 보기를 다시 정렬하지 않으면 혼자 순서가 어긋난 보기가 곧 정답임이 드러난다(2026-11-19 학생 신고).
// 수로 된 보기는 크기순(오름 또는 내림)이어야 하고, 정답 번호는 시험지 안에서 고르게 흩어져야 한다.
import crypto from 'node:crypto';
import { CIRCLED, parseObjectiveAnswer } from './lib.mjs';

// ---------- 보기 하나를 수로 환산 ----------
const EPS = 1e-9;

function normalizeChoiceText(raw) {
  let s = String(raw ?? '');
  s = s.replace(/^\s*[①②③④⑤]\s*/, '');
  s = s.replace(/\$/g, ' ');
  s = s.replace(/\\(?:text|mathrm|operatorname|textbf|mbox)\s*\{([^{}]*)\}/g, ' $1 ');
  s = s.replace(/\\(?:displaystyle|left|right|big|Big|bigg|Bigg)(?![A-Za-z])/g, ' ');
  s = s.replace(/\\[,;!:]|\\ |~/g, ' ');
  s = s.replace(/\\[dt]frac(?![A-Za-z])/g, '\\frac');
  s = s.replace(/\^\s*\{?\s*\\circ\s*\}?|\\circ(?![A-Za-z])|°/g, '°');
  s = s.replace(/\\%/g, '%');
  s = s.replace(/[−–]/g, '-').replace(/×/g, '\\times').replace(/÷/g, '\\div').replace(/√/g, '\\sqrt').replace(/π/g, '\\pi');
  s = s.replace(/²/g, '^2').replace(/³/g, '^3');
  return s.trim();
}

function tokenize(s) {
  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    let m;
    if ((m = /^\d+(?:,\d{3})*(?:\.\d+)?/.exec(s.slice(i)))) { tokens.push({ t: 'NUM', v: Number(m[0].replace(/,/g, '')), src: m[0] }); i += m[0].length; continue; }
    if ((m = /^\\[A-Za-z]+/.exec(s.slice(i)))) { tokens.push({ t: 'CMD', v: m[0], src: m[0] }); i += m[0].length; continue; }
    if ((m = /^[A-Za-z가-힣]+/.exec(s.slice(i)))) { tokens.push({ t: 'WORD', v: m[0], src: m[0] }); i += m[0].length; continue; }
    tokens.push({ t: 'SYM', v: ch, src: ch });
    i++;
  }
  return tokens;
}

class Parser {
  constructor(tokens) { this.tk = tokens; this.i = 0; this.pi = false; this.fail = false; }
  peek() { return this.tk[this.i]; }
  isSym(v) { const t = this.peek(); return t && t.t === 'SYM' && t.v === v; }
  isCmd(v) { const t = this.peek(); return t && t.t === 'CMD' && t.v === v; }
  bad() { this.fail = true; return NaN; }
  // 보기 하나는 "값 하나"여야 한다: 부호, 수, 분수, 근호, π 의 곱만 받고 항 사이의 + - × ÷ 와 거듭제곱은 받지 않는다.
  // (소인수분해 꼴·계산식 보기는 값이 아니라 식이므로 크기순이 요구되지 않는다.)
  expr() { return this.term(); }
  startsFactor() {
    const t = this.peek();
    if (!t) return false;
    if (t.t === 'NUM') return true;
    if (t.t === 'CMD') return ['\\frac', '\\sqrt', '\\pi'].includes(t.v);
    return false;
  }
  term() {
    let v = this.unary();
    if (this.isSym('/')) { this.i++; v /= this.unary(); }
    else {
      while (this.startsFactor() && this.peek().t !== 'NUM') v *= this.unary(); // 암묵 곱: 2π, 3√2, 분수 곱하기 π
    }
    return v;
  }
  unary() {
    if (this.isSym('-')) { this.i++; return -this.unary(); }
    if (this.isSym('+')) { this.i++; return this.unary(); }
    return this.power();
  }
  power() {
    const base = this.atom();
    if (this.isSym('^')) return this.bad(); // 2^{10}, 3^2 같은 꼴은 값인지 식인지 애매하므로 수로 보지 않는다.
    return base;
  }
  fracPart() { // \frac 의 분자·분모: {…} 또는 한 자리 수(\dfrac9{22}, \frac1{2})
    if (this.isSym('{')) return this.group();
    const x = this.peek();
    if (x && x.t === 'NUM' && /^\d$/.test(x.src)) { this.i++; return x.v; }
    return this.bad();
  }
  group() {
    if (!this.isSym('{')) return this.bad();
    this.i++;
    const v = this.expr();
    if (!this.isSym('}')) return this.bad();
    this.i++;
    return v;
  }
  atom() {
    const t = this.peek();
    if (!t) return this.bad();
    if (t.t === 'NUM') {
      this.i++;
      // 대분수처럼 보이는 "2\frac{1}{3}" 는 해석이 갈리므로 수로 보지 않는다.
      if (this.isCmd('\\frac')) return this.bad();
      return t.v;
    }
    if (t.t === 'CMD' && t.v === '\\pi') { this.i++; this.pi = true; return Math.PI; }
    if (t.t === 'CMD' && t.v === '\\frac') {
      this.i++;
      const t2 = this.peek();
      if (t2 && t2.t === 'NUM' && /^\d\d$/.test(t2.src)) { // \frac12 꼴
        this.i++;
        return Number(t2.src[0]) / Number(t2.src[1]);
      }
      const a = this.fracPart();
      const b = this.fracPart();
      return a / b;
    }
    if (t.t === 'CMD' && t.v === '\\sqrt') {
      this.i++;
      let n = 2;
      if (this.isSym('[')) {
        this.i++;
        const ix = this.peek();
        if (!ix || ix.t !== 'NUM') return this.bad();
        n = ix.v;
        this.i++;
        if (!this.isSym(']')) return this.bad();
        this.i++;
      }
      const r = this.isSym('{') ? this.group() : this.atom();
      return Math.pow(r, 1 / n);
    }
    return this.bad();
  }
}

/** 보기 하나 → { value, unit, pi } 또는 null(수 아님). 단위·접두 기호·$ 는 걷어 내고, 같은 꼴(단위·π 유무)끼리만 비교한다. */
export function parseChoiceValue(raw) {
  const s = normalizeChoiceText(raw);
  if (!s) return null;
  const tokens = tokenize(s);
  if (!tokens.length) return null;
  const p = new Parser(tokens);
  const value = p.expr();
  if (p.fail || !Number.isFinite(value)) return null;
  // 남은 토큰은 단위(글자·°·%·거듭제곱 지수)만 허용한다.
  const rest = tokens.slice(p.i);
  let unit = '';
  for (let k = 0; k < rest.length; k++) {
    const t = rest[k];
    if (t.t === 'WORD' || (t.t === 'SYM' && (t.v === '°' || t.v === '%'))) unit += t.src;
    else if (t.t === 'SYM' && t.v === '^') {
      const n = rest[k + 1];
      if (n && n.t === 'NUM' && /^[0-9]$/.test(n.src)) { unit += `^${n.src}`; k++; } else return null;
    } else if (t.t === 'SYM' && (t.v === '{' || t.v === '}') ) { /* ^{2} 의 중괄호 */ continue; }
    else if (t.t === 'NUM' && rest[k - 1] && rest[k - 1].t === 'SYM' && ['{'].includes(rest[k - 1].v) && /^[0-9]$/.test(t.src) && rest[k - 2] && rest[k - 2].v === '^') continue;
    else return null;
  }
  // 수 앞에 오는 문자(변수)는 위에서 이미 실패한다. 단위만 있고 수가 없는 경우도 실패한다.
  return { value, unit, pi: p.pi };
}

// ---------- 문항 하나 분석 ----------
function monotone(values) {
  let asc = true;
  let desc = true;
  for (let i = 1; i < values.length; i++) {
    if (values[i] < values[i - 1] - EPS) asc = false;
    if (values[i] > values[i - 1] + EPS) desc = false;
  }
  return { asc, desc };
}

export function isObjectiveItem(q) {
  return q && q.questionType === '객관식' && Array.isArray(q.choices);
}

/**
 * 객관식 문항의 보기 순서 점검.
 * 반환 status:
 *  NOT_OBJECTIVE / NOT_NUMERIC(수 아님·단위가 다름·보기 4~5개 아님·그림 보기) → 점검 대상 아님
 *  OK(오름·내림차순) | A(하나만 어긋나고 그것이 정답) | B(그 밖의 순서 어긋남)
 *  dup: 값이 같은 보기가 있음, answerIssue: 정답이 비었거나 보기 번호와 안 맞음
 * 고칠 수 있는 A·B 는 perm(새 자리 → 옛 자리 색인), newChoices, newAnswer 를 준다.
 */
export function analyzeChoiceOrder(q) {
  if (!isObjectiveItem(q)) return { status: 'NOT_OBJECTIVE' };
  const choices = q.choices;
  if (![4, 5].includes(choices.length) || choices.some(c => typeof c !== 'string' || !c.trim())) return { status: 'NOT_NUMERIC', reason: 'CHOICE_COUNT_OR_EMPTY' };
  const parsed = choices.map(parseChoiceValue);
  if (parsed.some(p => !p)) return { status: 'NOT_NUMERIC', reason: 'NOT_A_NUMBER' };
  const sig = p => `${p.unit}|${p.pi ? 'pi' : ''}`;
  if (new Set(parsed.map(sig)).size !== 1) return { status: 'NOT_NUMERIC', reason: 'MIXED_FORM' };
  const values = parsed.map(p => p.value);
  const ans = parseObjectiveAnswer(q.answer);
  const result = { status: 'OK', values, dup: false, answerIssue: null, ansIdx: [] };
  if (!ans) result.answerIssue = 'ANSWER_UNPARSEABLE';
  else {
    result.ansIdx = ans.map(a => CIRCLED.indexOf(a));
    if (result.ansIdx.some(i => i >= choices.length)) result.answerIssue = 'ANSWER_OUT_OF_RANGE';
  }
  for (let i = 0; i < values.length && !result.dup; i++) for (let j = i + 1; j < values.length; j++) if (Math.abs(values[i] - values[j]) <= EPS) { result.dup = true; break; }
  const m = monotone(values);
  if (m.asc || m.desc) return result;

  // 하나만 빼면 단조인가, 그 하나가 정답인가
  let kind = 'B';
  let dir = null;
  if (!result.answerIssue && result.ansIdx.length === 1) {
    const k = result.ansIdx[0];
    const rest = values.filter((_, i) => i !== k);
    const rm = monotone(rest);
    if (rm.asc || rm.desc) { kind = 'A'; dir = rm.desc && !rm.asc ? 'desc' : 'asc'; }
  }
  if (!dir) {
    let up = 0;
    let down = 0;
    for (let i = 1; i < values.length; i++) { if (values[i] > values[i - 1]) up++; else if (values[i] < values[i - 1]) down++; }
    dir = down > up ? 'desc' : 'asc';
  }
  const idx = values.map((_, i) => i);
  idx.sort((a, b) => (dir === 'asc' ? values[a] - values[b] : values[b] - values[a]) || a - b);
  result.status = kind;
  result.direction = dir;
  result.perm = idx; // perm[새 자리] = 옛 자리
  if (!result.answerIssue) {
    const newAns = result.ansIdx.map(o => idx.indexOf(o)).sort((a, b) => a - b).map(i => CIRCLED[i]);
    result.newAnswer = newAns.join(', ');
    result.newChoices = idx.map(o => choices[o]);
    const hadPrefix = choices.some(c => /^\s*[①②③④⑤]/.test(c));
    if (hadPrefix) result.newChoices = result.newChoices.map((c, i) => c.replace(/^(\s*)[①②③④⑤]/, `$1${CIRCLED[i]}`));
  }
  return result;
}

// ---------- 생김새 누설 (수 보기에서 정답만 꼴이 다른 경우) ----------
// 오답을 새로 지을 때는 정답과 같은 꼴(근호·분수·부호·소수·단위·간격)로 짓는다. 반입 검사에서는 경고만 한다.
export function leakWarnings(q) {
  if (!isObjectiveItem(q) || ![4, 5].includes(q.choices.length)) return [];
  const ans = parseObjectiveAnswer(q.answer);
  if (!ans || ans.length !== 1) return [];
  const k = CIRCLED.indexOf(ans[0]);
  const norm = q.choices.map(c => (typeof c === 'string' ? normalizeChoiceText(c) : ''));
  const parsed = q.choices.map(c => (typeof c === 'string' ? parseChoiceValue(c) : null));
  const warnings = [];
  const onlyAnswer = (name, test) => {
    const hits = norm.map((s, i) => (test(s) ? i : -1)).filter(i => i >= 0);
    if (hits.length === 1 && hits[0] === k) warnings.push(name);
  };
  const numericLike = norm.every(s => /\d/.test(s));
  if (!numericLike) return [];
  const sig = p => (p ? `${p.unit}|${p.pi ? 'pi' : ''}` : 'X');
  const sigs = parsed.map(sig);
  const odd = sigs.filter((s, i) => i !== k && s !== sigs[k]);
  if (odd.length === q.choices.length - 1 && new Set(sigs.filter((_, i) => i !== k)).size === 1) warnings.push('ANSWER_ONLY_FORM');
  onlyAnswer('ANSWER_ONLY_SQRT', s => /\\sqrt/.test(s));
  onlyAnswer('ANSWER_ONLY_FRACTION', s => /\\frac|\//.test(s));
  onlyAnswer('ANSWER_ONLY_NEGATIVE', s => /^[\s(]*-/.test(s));
  onlyAnswer('ANSWER_ONLY_DECIMAL', s => /\d\.\d/.test(s));
  if (parsed.every(Boolean) && new Set(sigs).size === 1) {
    const rest = parsed.filter((_, i) => i !== k).map(p => p.value).sort((a, b) => a - b);
    if (rest.length >= 3) {
      const gaps = rest.slice(1).map((v, i) => Number((v - rest[i]).toFixed(9)));
      const ap = gaps.every(g => Math.abs(g - gaps[0]) <= 1e-9);
      if (ap && gaps[0] > 0) {
        const all = parsed.map(p => p.value).sort((a, b) => a - b);
        const g2 = all.slice(1).map((v, i) => Number((v - all[i]).toFixed(9)));
        const allAp = g2.every(g => Math.abs(g - g2[0]) <= 1e-9);
        if (!allAp) warnings.push('ANSWER_ONLY_GAP');
      }
    }
  }
  return warnings;
}

// ---------- 시험지 단위 정답 번호 분포 ----------
// 객관식이 10문항 이상인 시험지는 정답 번호가 아래 중 하나라도 걸리면 결함이다(2026-11-19 사용자 기준).
//  - 한 번호가 30% 초과 / 한 번도 안 나온 번호가 있음 / 같은 번호 3연속
//  - 길이 3~6의 같은 순서가 2번 이상 연달아 되풀이(3412534125 같은 균등 되풀이)
//  - 한 칸씩 늘거나 주는 열이 5개 이상 이어짐(12345, 54321, 23451 ...)
// 판정(answerDistribution)과 목표 배열 뽑기(chooseTargetAnswers)가 같은 기준 상수·같은 평가 함수를 쓴다.
export const SKEW_MIN_QUESTIONS = 10;
export const SKEW_MAX_SHARE = 0.3; // 초과이면 결함
export const SKEW_MAX_RUN = 2; // 3연속부터 결함
export const PERIOD_MIN = 3;
export const PERIOD_MAX = 6;
export const CYCLE_MIN_LENGTH = 5;
const DIGITS = ['1', '2', '3', '4', '5'];

export function findPeriodicPattern(tokens) {
  const n = tokens.length;
  let best = null;
  for (let p = PERIOD_MIN; p <= PERIOD_MAX; p++) {
    for (let i = 0; i + 2 * p <= n; i++) {
      let ok = true;
      for (let j = 0; j < p; j++) if (tokens[i + j] === '?' || tokens[i + j] !== tokens[i + p + j]) { ok = false; break; }
      if (!ok) continue;
      const pattern = tokens.slice(i, i + p);
      if (new Set(pattern).size < 2) continue;
      let len = 2 * p;
      while (i + len < n && tokens[i + len] !== '?' && tokens[i + len] === tokens[i + len - p]) len++;
      if (!best || len > best.length) best = { pattern: pattern.join(''), period: p, start: i, length: len, repeats: Number((len / p).toFixed(1)) };
      break;
    }
  }
  return best;
}

export function findCyclicRun(tokens) {
  let best = null;
  const val = t => (DIGITS.includes(t) ? Number(t) : null);
  for (const step of [1, 4]) {
    let s = 0;
    for (let i = 1; i <= tokens.length; i++) {
      const a = val(tokens[i - 1]);
      const b = i < tokens.length ? val(tokens[i]) : null;
      const cont = a !== null && b !== null && (b - a + 5) % 5 === step;
      if (cont) continue;
      const len = i - s;
      if (len >= CYCLE_MIN_LENGTH && (!best || len > best.length)) best = { start: s, length: len, direction: step === 1 ? 'up' : 'down', pattern: tokens.slice(s, i).join('') };
      s = i;
    }
  }
  return best;
}

/** 정답 번호 열(문자열 토큰: '1'~'5', 복수정답 '2+4', 판독 불가 '?') 하나를 평가한다. */
export function evaluateAnswerTokens(tokens) {
  const objective = tokens.length;
  const counts = [0, 0, 0, 0, 0];
  let longest = 0;
  let run = 0;
  let prev = null;
  for (const t of tokens) {
    if (!DIGITS.includes(t)) { prev = null; run = 0; continue; }
    counts[Number(t) - 1]++;
    run = prev === t ? run + 1 : 1;
    prev = t;
    longest = Math.max(longest, run);
  }
  const periodic = findPeriodicPattern(tokens);
  const cyclic = findCyclicRun(tokens);
  const reasons = [];
  if (objective >= SKEW_MIN_QUESTIONS) {
    const max = Math.max(...counts);
    if (max / objective > SKEW_MAX_SHARE) reasons.push(`한 번호가 ${Math.round((max / objective) * 100)}%(${CIRCLED[counts.indexOf(max)]} ${max}/${objective})`);
    const absent = counts.map((c, i) => (c ? null : CIRCLED[i])).filter(Boolean);
    if (absent.length) reasons.push(`안 나온 번호 ${absent.length}개(${absent.join('')})`);
    if (longest > SKEW_MAX_RUN) reasons.push(`같은 번호 ${longest}연속`);
    if (periodic) reasons.push(`정답 번호가 ${periodic.pattern} 순서로 ${periodic.repeats}번 되풀이됨(${periodic.start + 1}번째부터 ${periodic.length}문항)`);
    if (cyclic) reasons.push(`정답 번호가 한 칸씩 ${cyclic.direction === 'up' ? '늘어나는' : '줄어드는'} 열 ${cyclic.length}개(${cyclic.pattern})`);
  }
  return { objective, counts, longestRun: longest, periodic, cyclic, skewed: reasons.length > 0, reasons };
}

export function answerTokens(bank) {
  const tokens = [];
  for (const q of bank) {
    if (!isObjectiveItem(q)) continue;
    const ans = parseObjectiveAnswer(q.answer);
    if (!ans) tokens.push('?');
    else tokens.push(ans.map(a => String(CIRCLED.indexOf(a) + 1)).join('+'));
  }
  return tokens;
}

export function answerDistribution(bank) {
  const tokens = answerTokens(bank);
  const ev = evaluateAnswerTokens(tokens);
  const multi = tokens.filter(t => t.includes('+')).length;
  const single = tokens.filter(t => DIGITS.includes(t)).length;
  return { ...ev, single, multi, sequence: tokens.join(' ') };
}

export function formatDistribution(d) {
  return `객관식 ${d.objective} · ${CIRCLED.map((c, i) => `${c}${d.counts[i]}`).join(' ')} · 최장 연속 ${d.longestRun}`;
}

// ---------- 목표 정답 번호 배열 뽑기 ----------

function seededRandom(seedText) {
  let counter = 0;
  let buf = [];
  const refill = () => {
    const h = crypto.createHash('sha256').update(`${seedText}#${counter++}`).digest();
    buf = [...h];
  };
  return () => {
    if (buf.length < 4) refill();
    const v = buf.splice(0, 4).reduce((a, b) => a * 256 + b, 0);
    return v / 4294967296;
  };
}

/**
 * 현재 정답 번호 열이 기준을 통과하면 그대로, 아니면 기준을 통과하는 무작위 배열 sampleCount 개 중
 * 현재와 가장 많이 겹치는 배열을 고른다(고쳐 쓸 문항 최소). 시험지 경로(seed)로 결정적이다.
 * force: 현재 열이 기준을 통과해도 허용 목록(allowed)이 현재 번호를 빼는 위치가 있으면 새로 뽑는다.
 * tokens: evaluateAnswerTokens 와 같은 토큰 열. allowed[i]: 그 위치가 가질 수 있는 번호('1'~'5') 목록
 *  (자리를 고정한 문항은 [현재], 복수정답·판독 불가는 자동 고정). 생략하면 고정되지 않은 위치는 전부 허용.
 */
export function chooseTargetAnswers({ tokens, allowed = null, seed, sampleCount = 400, maxAttempts = 400000, force = false }) {
  const cur = evaluateAnswerTokens(tokens);
  if (!cur.skewed && !force) return { ok: true, unchanged: true, target: [...tokens], changed: [], reasons: [] };
  const choices = tokens.map((t, i) => {
    if (!DIGITS.includes(t)) return [t];
    const a = allowed && allowed[i] ? allowed[i].filter(x => DIGITS.includes(x)) : DIGITS;
    return a.length ? a : [t];
  });
  const rnd = seededRandom(`choose-target|${seed}`);
  let best = null;
  let found = 0;
  for (let attempt = 0; attempt < maxAttempts && found < sampleCount; attempt++) {
    const cand = choices.map(c => (c.length === 1 ? c[0] : c[Math.floor(rnd() * c.length)]));
    if (evaluateAnswerTokens(cand).skewed) continue;
    found++;
    const overlap = cand.reduce((s, t, i) => s + (t === tokens[i] ? 1 : 0), 0);
    if (!best || overlap > best.overlap) best = { cand, overlap };
  }
  if (!best) return { ok: false, unchanged: false, target: [...tokens], changed: [], reasons: cur.reasons, why: 'NO_VALID_ARRAY_UNDER_LOCKS' };
  const changed = best.cand.map((t, i) => (t !== tokens[i] ? i : -1)).filter(i => i >= 0);
  return { ok: true, unchanged: false, target: best.cand, changed, reasons: cur.reasons, sampled: found };
}

/** 새 시험지용: 기준을 통과하는 무작위 정답 번호 배열을 뽑는다(시험지 이름 등 seed 로 결정적). fixed: { 위치(0부터): '1'~'5' } 는 그 번호로 고정. */
export function drawTargetAnswers({ count, seed, fixed = {}, maxAttempts = 400000 }) {
  const rnd = seededRandom(`draw-target|${seed}`);
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const cand = Array.from({ length: count }, (_, i) => fixed[i] ?? DIGITS[Math.floor(rnd() * DIGITS.length)]);
    if (!evaluateAnswerTokens(cand).skewed) return { ok: true, target: cand };
  }
  return { ok: false, target: [], why: 'NO_VALID_ARRAY_UNDER_FIXED' };
}
