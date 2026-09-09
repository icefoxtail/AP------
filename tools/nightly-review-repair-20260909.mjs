import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workRoot = path.join(repoRoot, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work');

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && ent.name.endsWith('.js')) out.push(p);
  }
  return out;
}

function isTargetFile(file) {
  const rel = path.relative(workRoot, file).split(path.sep).join('/');
  return /(?:^|\/)(?:candidate|package-root|fresh-extract|fresh-extract-final|fresh-extract-package)\//.test(rel);
}

function normalizeJsStrings(source) {
  let out = '';
  let quote = null;
  let changed = false;
  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (!quote) {
      out += ch;
      if (ch === '"' || ch === "'") quote = ch;
      continue;
    }
    if (ch === quote) {
      out += ch;
      quote = null;
      continue;
    }
    if (ch === '\\') {
      const next = source[i + 1];
      if (next === undefined) {
        out += '\\\\';
        changed = true;
        continue;
      }
      if (next === '\\' || next === quote || next === '/') {
        out += ch + next;
        i += 1;
        continue;
      }
      if (next === 'n' && !/[A-Za-z]/.test(source[i + 2] ?? '')) {
        out += ch + next;
        i += 1;
        continue;
      }
      if (next === 'r' || next === 't' || next === 'b' || next === 'f') {
        if (!/[A-Za-z]/.test(source[i + 2] ?? '')) {
          out += ch + next;
          i += 1;
          continue;
        }
      }
      if (next === '0' && !/[0-9A-Za-z]/.test(source[i + 2] ?? '')) {
        out += ch + next;
        i += 1;
        continue;
      }
      if (next === 'u' && /^[0-9a-fA-F]{4}/.test(source.slice(i + 2, i + 6))) {
        const code = Number.parseInt(source.slice(i + 2, i + 6), 16);
        const recoveredCommand = { 8: 'b', 9: 't', 10: 'n', 11: 'v', 12: 'f', 13: 'r' }[code];
        if (recoveredCommand) {
          out += `\\\\${recoveredCommand}`;
          changed = true;
        } else {
          out += source.slice(i, i + 6);
        }
        i += 5;
        continue;
      }
      if (next === 'x' && /^[0-9a-fA-F]{2}/.test(source.slice(i + 2, i + 4))) {
        out += source.slice(i, i + 4);
        i += 3;
        continue;
      }
      out += '\\\\' + next;
      i += 1;
      changed = true;
      continue;
    }
    if (ch.charCodeAt(0) < 0x20) {
      const recoveredCommand = { 8: 'b', 9: 't', 10: 'n', 11: 'v', 12: 'f', 13: 'r' }[ch.charCodeAt(0)];
      const escaped = recoveredCommand ? `\\\\${recoveredCommand}` : `\\u${ch.charCodeAt(0).toString(16).padStart(4, '0')}`;
      out += escaped;
      changed = true;
      continue;
    }
    out += ch;
  }
  return { source: out, changed };
}

const repairs = {
  '19_geumdang_2mid': {
    5: { solution: '보기에서 함수인 것은 ㄱ, ㄴ, ㄹ의 3개이고, 그중 일대일대응인 것은 ㄱ, ㄹ의 2개이다. 따라서 $a+b=3+2=5$이므로 정답은 ④이다.' },
  },
  '20_hyocheon_2mid': {
    4: { answer: '①', solution: '원명제의 역은 결론을 조건으로, 조건을 결론으로 바꾼 명제이다. 따라서 ‘$x>0$ 또는 $y>0$이면 $x+y>0$’이므로 정답은 ①이다.' },
  },
  '23_yeocheon_2final': {
    1: { answer: '④', solution: '$x=-1,0,1$에서 $2x+2$의 값은 $0,2,4$이다. $x=-1$일 때 함수값 0은 $Y$에 속하지 않으므로 $X$에서 $Y$로의 함수가 아니다. 따라서 정답은 ④이다.' },
    9: { solution: String.raw`실수 조건은 $x\ge-1/2$, $x<4$이다. 이 범위에서 $|2x+1|=2x+1$, $\sqrt{(x-4)^2}=4-x$이므로 합은 $x+5$이다. 따라서 정답은 ③이다.` },
    13: { choices: ['학생 6명 중에서 4명을 뽑아 일렬로 세울 때, 특정한 2명을 반드시 포함하여 세우는 경우의 수: $\\binom{4}{2}\\times4!$', '20명이 빠짐없이 서로 한 번씩 악수하는 경우의 수: $\\binom{20}{2}$', '남학생 3명과 여학생 3명이 교대로 서는 경우의 수: $3!\\times3!\\times2$', '어른 1명과 어린이 5명을 일렬로 세울 때, 어른이 세 번째 오도록 세우는 경우의 수: $1\\times5!$', '남학생 5명과 여학생 4명이 있는 동아리에서 4명의 대표를 뽑을 때 적어도 여학생 1명이 포함될 경우의 수: $\\binom{9}{4}-\\binom{5}{4}$'] },
  },
  '23_yeoyang_2mid': {
    1: { answer: '④', choices: ['$\\{\\varnothing\\}\\subset A$', '$A\\subset A$', '$\\varnothing\\in A$', '$\\{3\\}\\in A$', '$n(A)=3$'], solution: '집합의 원소와 부분집합을 구분하면 $\\{3\\}\\notin A$이므로 옳지 않은 것은 ④이다.' },
  },
  '23_jungang_2final': {
    8: { solution: String.raw`정의역과 치역, 평행이동에 관한 ㄱ, ㄴ, ㄹ은 모두 옳고, 그래프는 $x\\le3$, $y\\ge-1$이므로 제3사분면의 점도 지난다. 따라서 옳은 것은 ㄱ, ㄴ, ㄹ인 ④이다.` },
    18: { solution: '$1000a+500b+100c=3000$에서 $0\le a\le3$, $0\le b,c\le5$이다. 가능한 $(a,b,c)$는 $(0,5,5),(1,3,5),(1,4,0),(2,1,5),(2,2,0),(3,0,0)$의 6가지이므로 ㄷ은 거짓이다. 전체 지불 방법은 $4\times6\times6-1=143$가지이고, 가능한 금액은 100원 단위로 100원부터 6000원까지 모두 가능하므로 ㄱ은 참, ㄴ은 거짓이다. 따라서 ㄱ만 참이므로 정답은 ①이다.' },
    21: { solution: '승자가 정확히 $k$명인 경우에는 승리하는 손을 정하는 3가지와 그 손을 낸 $k$명을 고르는 $\binom5k$가지가 있으므로 $a=3\binom51=15$, $b=3\binom52=30$, $c=3\binom53=30$, $d=3\binom54=15$이다. 한 명 이상 이기는 경우는 세 가지 손이 모두 나오지 않고 정확히 두 손만 나오는 경우이다. 두 손을 고르는 3가지에 대해 $2^5-2$가지가 있으므로 $e=3(2^5-2)=90$이다.' },
    22: { solution: '선분의 개수는 $a=\binom82=28$, 삼각형의 개수는 $b=\binom83=56$이다. 원의 지름을 한 변으로 하는 직각삼각형은 지름 4개마다 나머지 점 6개를 고를 수 있으므로 $c=4\times6=24$이다. 사각형의 개수는 $d=\binom84=70$이다. 정사각형은 서로 마주 보는 두 쌍의 점을 꼭짓점으로 하는 경우뿐이며, 지름 4개 중 서로 평행하지 않은 두 지름을 고르는 경우는 2가지이므로 $e=2$이다.' },
  },
  '23_hanyeong_2mid': {
    11: { answer: '②', solution: '$x^2+3x+a=\\left(x+\\dfrac32\\right)^2+a-\\dfrac94$이므로 최솟값은 $a-\\dfrac94$이다. 명제가 거짓이 되려면 어떤 실수 $x$에서 식이 음수여야 하므로 $a<\\dfrac94$이다. 따라서 조건을 만족하는 정수 $a$의 최댓값은 2이고, 정답은 ②이다.' },
    18: { solution: '명제 ‘어떤 평행사변형은 정사각형이다’의 부정은 ‘어떤 평행사변형도 정사각형이 아니다’이다. 예를 들어 한 변의 길이가 서로 다른 직사각형은 평행사변형이지만 정사각형이 아니므로 부정 명제는 참이다. 따라서 원명제는 거짓이다.' },
  },
  '24_jungang_2final': {
    11: { solution: '$f$는 일대일대응이므로 $f(2),f(3),f(4)$는 서로 다른 $1,2,3,4,5,6$ 중의 세 수이다. 서로 다른 두 수의 곱이 1부터 6 사이의 수가 되려면 $\{f(2),f(3),f(4)\}=\{2,3,6\}$뿐이다. $f(2),f(3)$의 순서는 2가지이고, 나머지 세 입력 $1,5,6$의 함수값 배치는 $3!=6$가지이므로 전체는 $2\times6=12$가지이다. 따라서 정답은 ③이다.' },
  },
  '24_hanyeong_2final': {
    13: { answer: '163', solution: '한 자리 수는 $4$개, 두 자리 수는 $4\times4=16$개, 세 자리 수는 $4\times4\times3=48$개이다. 네 자리 수는 첫째 자리가 1 또는 2인 경우 $2\times4\times3\times2=48$개, 첫째 자리가 3인 경우 $24$개, 첫째 자리가 4인 경우 $23$개이다. 따라서 전체 개수는 $4+16+48+48+24+23=163$개이다.' },
  },
  '24_buyeong_2mid': {
    8: { choices: ['$\\dfrac{21}{2}$', '$\\dfrac{23}{2}$', '$\\dfrac{25}{2}$', '$\\dfrac{27}{2}$', '$\\dfrac{29}{2}$'], solution: '원의 중심은 $(2,0)$이고 반지름은 $\\sqrt5$이다. 점 $P(2,5)$에서 원에 그은 접선의 기울기를 $m$이라 하면 중심에서 접선까지의 거리가 $\\sqrt5$이므로 $5/\\sqrt{m^2+1}=\\sqrt5$이다. 따라서 $m=\\pm2$이고, 두 접선의 $x$축과의 교점은 $(-1/2,0)$, $(9/2,0)$이다. 밑변의 길이는 5, 높이는 5이므로 삼각형의 넓이는 $25/2$이다. 따라서 정답은 ③이다.' },
    15: { content: '자연수 $n$에 대하여 집합 $A_n$을 $A_n=\\{x\\mid 2n-1\\le x\\le10n+3,\\ x는 자연수\\}$라 하자. $A_1\\cap A_2\\cap\\cdots\\cap A_n\\ne\\varnothing$이 되도록 하는 $n$의 최댓값은? [5점]', solution: '교집합의 하한은 $2n-1$, 상한은 첫 집합의 상한 $13$이다. 공집합이 아니려면 $2n-1\\le13$, 즉 $n\\le7$이다. 최댓값은 7이다.' },
    19: { answer: '$90+30\\sqrt{10}$', solution: '신발끈 공식으로 사각형 $PABC$의 넓이는 $90+9y_P-3x_P$이다. $P=(x_P,y_P)$가 $x_P^2+y_P^2=100$ 위에 있으므로 $9y_P-3x_P$의 최댓값은 $10\\sqrt{9^2+(-3)^2}=30\\sqrt{10}$이다. 해당 점은 $B$를 포함하지 않는 호에 있으므로 최댓값은 $90+30\\sqrt{10}$이다.' },
  },
  '24_yeocheon_2final': {
    8: { choices: ['1', '$\\dfrac32$', '2', '$\\dfrac52$', '3'] },
    13: { choices: ['$\\dfrac16$', '$\\dfrac13$', '$\\dfrac12$', '$\\dfrac23$', '$\\dfrac56$'] },
    9: { solution: '고정점은 $x=f(x)$를 만족하는 점이다. $t=x+2$로 두면 $t=at^2$이므로 $t=0$ 또는 $t=1/a$이다. 따라서 두 고정점의 $x$좌표는 $-2$, $-2+1/a$이고, 두 점은 $y=x$ 위에 있으므로 거리는 $\sqrt2/a$이다. $\sqrt2/a=5\sqrt2$에서 $a=1/5$이다. 따라서 정답은 ④이다.' },
  },
  '20_maesan_2final': {
    16: { answer: '1680' },
  },
  '20_maesan_2final': {
    17: { answer: String.raw`$2\sqrt3$`, solution: String.raw`$f(x)=3x$이므로 $g(x)=\dfrac{x-3}{x+3}$이다. $t=x+3$이라 두면 그래프 위의 점은 $P=(-3+t,1-6/t)$이고 $t\ne0$이다. 점 $A(-3,1)$과의 거리의 제곱은 $t^2+36/t^2$이다. 산술기하평균에 의해 $t^2+36/t^2\ge12$이고, $t^2=6$일 때 등호가 성립한다. 따라서 최솟거리는 $\sqrt{12}=2\sqrt3$이다.` },
  },
  '20_maesanyeo_2final': {
    17: { answer: '$2\\sqrt3$', solution: '$f(x)=3x$이므로 $g(x)=\\dfrac{x-3}{x+3}$이다. $t=x+3$이라 두면 그래프 위의 점은 $P=(-3+t,1-6/t)$이고 $t\\ne0$이다. 점 $A(-3,1)$과의 거리의 제곱은 $t^2+36/t^2$이다. 산술기하평균에 의해 $t^2+36/t^2\\ge12$이고, $t^2=6$일 때 등호가 성립한다. 따라서 최솟거리는 $\\sqrt{12}=2\\sqrt3$이다.' },
  },
  '20_suncheon_2mid': {
    16: { solution: '각 보기의 조건을 순서대로 확인하면 ㄱ만 $q$가 $p$이기 위한 필요조건이고 충분조건은 아니다. 따라서 정답은 ①이다.' },
  },
};

const repairSourceNumbers = {
  '23_yeocheon_2final': { 1: '1', 9: '10', 13: '15' },
  '23_yeoyang_2mid': { 1: '1' },
  '23_jungang_2final': { 8: '9', 18: '19', 21: '서술형3', 22: '서술형4' },
  '23_hanyeong_2mid': { 11: '11', 18: '단답형3' },
  '24_jungang_2final': { 11: '15' },
  '24_hanyeong_2final': { 13: '서술형2' },
  '24_buyeong_2mid': { 8: '8', 15: '17', 19: '서술형3' },
  '24_yeocheon_2final': { 8: '11', 9: '12', 13: '16' },
};

const excludedIdsByExam = {
  '20_maesan_2final': [13],
  '20_maesanyeo_2final': [13],
};

const candidateRestoreBySource = {
  '23_yeocheon_2final': { 9: '9', 13: '13' },
  '23_jungang_2final': { 18: '18', 21: '서술형1', 22: '서술형2' },
  '24_buyeong_2mid': { 15: '15', 19: '서술형1' },
  '24_yeocheon_2final': { 9: '9' },
};

function applyRepairs(bank, examDir) {
  const byId = repairs[examDir];
  if (!byId) return [];
  const applied = [];
  for (const [idText, patch] of Object.entries(byId)) {
    const id = Number(idText);
    const q = bank.find((item) => item.id === id);
    if (!q) continue;
    const expectedSource = repairSourceNumbers[examDir]?.[id];
    if (expectedSource && q.sourceQuestionNo !== expectedSource) continue;
    Object.assign(q, restoreKnownLatex(patch));
    applied.push(`${examDir} q${id}`);
  }
  return applied;
}

function restoreKnownLatex(value) {
  if (typeof value === 'string') {
    const slash = String.fromCharCode(92);
    const backspace = String.fromCharCode(8);
    const tab = String.fromCharCode(9);
    const badSet = '$' + '{f(2),f(3),f(4)}={2,3,6}';
    return value
      .replaceAll(backspace + 'inom', slash + 'binom')
      .replaceAll(tab + 'imes', slash + 'times')
      .replace(/(?<!\\)sqrt/g, slash + 'sqrt')
      .replace(/(?<!\\)dfrac/g, slash + 'dfrac')
      .replace(/(?<=[A-Za-z0-9])le/g, slash + 'le')
      .replace(/(?<=[A-Za-z0-9])ge/g, slash + 'ge')
      .replace(/(?<=[A-Za-z0-9])ne/g, slash + 'ne')
      .replace(badSet, '$' + slash + '{f(2),f(3),f(4)' + slash + '}=' + slash + '{2,3,6' + slash + '}');
  }
  if (Array.isArray(value)) return value.map(restoreKnownLatex);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, restoreKnownLatex(v)]));
  return value;
}

function restoreCandidateFields(bank, file, examDir) {
  const specs = candidateRestoreBySource[examDir];
  if (!specs || !file.split(path.sep).includes('candidate')) return [];
  const referenceFile = files.find((candidate) => candidate.includes(path.sep + examDir + path.sep) && !candidate.split(path.sep).includes('candidate') && (candidate.includes(path.sep + 'fresh-extract-final' + path.sep) || candidate.includes(path.sep + 'package-root' + path.sep) || candidate.includes(path.sep + 'fresh-extract' + path.sep)));
  if (!referenceFile) return [];
  const referenceBank = loadBank(normalizeJsStrings(fs.readFileSync(referenceFile, 'utf8')).source);
  const restored = [];
  for (const [idText, sourceQuestionNo] of Object.entries(specs)) {
    const q = bank.find((item) => item.id === Number(idText));
    const reference = referenceBank.find((item) => item.sourceQuestionNo === sourceQuestionNo);
    if (!q) continue;
    if (!reference && examDir === '23_jungang_2final' && idText === '22' && sourceQuestionNo === '서술형2') {
      q.answer = '';
      q.solution = '';
      restored.push(examDir + ' candidate q' + idText + ' <- REVIEW_NEEDED source ' + sourceQuestionNo);
      continue;
    }
    if (!reference) continue;
    for (const field of ['content', 'choices', 'answer', 'solution']) {
      if (field in reference) q[field] = reference[field];
    }
    restored.push(examDir + ' candidate q' + idText + ' <- source ' + sourceQuestionNo);
  }
  return restored;
}

function loadBank(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { timeout: 5000 });
  return context.window.questionBank;
}

function findArraySpan(source) {
  const marker = 'window.questionBank';
  const markerAt = source.indexOf(marker);
  if (markerAt < 0) throw new Error('missing window.questionBank');
  const open = source.indexOf('[', markerAt);
  if (open < 0) throw new Error('missing questionBank array');
  let depth = 0;
  let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === '\\') i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth += 1;
    else if (ch === ']') {
      depth -= 1;
      if (depth === 0) return { open, close: i };
    }
  }
  throw new Error('unterminated questionBank array');
}

function replaceBank(source, bank) {
  const { open, close } = findArraySpan(source);
  const replacement = `[\n${bank.map((q) => JSON.stringify(q)).join(',\n')}\n]`;
  return source.slice(0, open) + replacement + source.slice(close + 1);
}

function stripReviewMutations(source) {
  const marker = '\nwindow.questionBank.find';
  const markerAt = source.indexOf(marker);
  return markerAt >= 0 ? source.slice(0, markerAt) + '\n' : source;
}

function targetFiles() {
  return walk(workRoot).filter(isTargetFile).sort();
}

const files = targetFiles();
const mode = process.argv[2] ?? '--inspect';

if (mode === '--normalize') {
  let changed = 0;
  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    const result = normalizeJsStrings(stripReviewMutations(original));
    if (result.changed) {
      fs.writeFileSync(file, result.source, 'utf8');
      changed += 1;
      console.log(`NORMALIZED ${path.relative(repoRoot, file)}`);
    }
  }
  console.log(`TARGET_JS=${files.length} NORMALIZED=${changed}`);
} else if (mode === '--inspect') {
  const picks = [
    ['20_hyocheon_2mid', 4], ['23_yeocheon_2final', 1], ['23_yeocheon_2final', 9],
    ['23_yeocheon_2final', 18], ['23_jungang_2final', 18], ['23_jungang_2final', 21],
    ['23_jungang_2final', 22], ['23_hanyeong_2mid', 11], ['23_hanyeong_2mid', 18],
    ['24_jungang_2final', 11], ['24_hanyeong_2final', 13], ['24_buyeong_2mid', 15],
    ['24_buyeong_2mid', 19], ['24_yeocheon_2final', 9], ['20_maesan_2final', 16],
    ['20_maesanyeo_2final', 17],
  ];
  for (const [exam, id] of picks) {
    const file = files.find((f) => f.includes(`${path.sep}${exam}${path.sep}`) && (f.includes(`${path.sep}package-root${path.sep}`) || f.includes(`${path.sep}fresh-extract-final${path.sep}`)));
    if (!file) { console.log(`MISSING ${exam}`); continue; }
    const source = normalizeJsStrings(stripReviewMutations(fs.readFileSync(file, 'utf8'))).source;
    try {
      const bank = loadBank(source);
      const q = bank.find((item) => item.id === id);
      console.log(`\n### ${exam} q${id} ${path.relative(repoRoot, file)}\n${JSON.stringify(q, null, 2)}`);
    } catch (err) { console.log(`ERROR ${exam} q${id}: ${err.message}`); }
  }
  console.log(`TARGET_JS=${files.length}`);
} else if (mode === '--apply') {
  let normalized = 0;
  let repairedFiles = 0;
  const applied = [];
  for (const file of files) {
    const examDir = path.relative(workRoot, file).split(path.sep)[0];
    const original = fs.readFileSync(file, 'utf8');
    const normalizedSource = normalizeJsStrings(stripReviewMutations(original)).source;
    let bank;
    try {
      bank = loadBank(normalizedSource);
    } catch (error) {
      if (file.split(path.sep).includes('candidate')) {
        console.log('SKIP_MALFORMED_CANDIDATE', path.relative(repoRoot, file));
        continue;
      }
      console.error('LOAD_ERROR', path.relative(repoRoot, file), error.message);
      throw error;
    }
    const excludedIds = excludedIdsByExam[examDir] || [];
    if (excludedIds.length) {
      bank = bank.filter((item) => !excludedIds.includes(item.id));
      applied.push(examDir + ' excluded q' + excludedIds.join(',q') + ' as REVIEW_NEEDED');
    }
    const restored = restoreCandidateFields(bank, file, examDir);
    const changes = [...restored, ...applyRepairs(bank, examDir)];
    const next = changes.length ? replaceBank(normalizedSource, bank) : normalizedSource;
    if (next !== original) {
      fs.writeFileSync(file, next, 'utf8');
      if (next !== normalizedSource) repairedFiles += 1;
      if (normalizedSource !== original) normalized += 1;
    }
    applied.push(...changes);
  }
  console.log(`TARGET_JS=${files.length} NORMALIZED_FILES=${normalized} REPAIRED_FILES=${repairedFiles}`);
  for (const item of [...new Set(applied)].sort()) console.log(`REPAIRED ${item}`);
} else {
  throw new Error(`unknown mode: ${mode}`);
}
