import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const workRoot = path.join(repoRoot, 'archive', '_generated', 'nightly-h1-2sem', '20260908', 'work');
const BS = String.fromCharCode(92);
const tex = (value) => value.replaceAll('§', BS);

const patches = {
  '19_gangnam_2final': {
    8: {
      content: '문자 $f,r,i,e,n,d$ 6개를 일렬로 나열할 때, 양 끝에 모음이 오도록 나열하는 모든 경우의 수는? [3점]',
      choices: ['12', '24', '36', '48', '60'],
      answer: '④',
      solution: '모음은 $i,e$의 2개이다. 양 끝에 모음을 배열하는 방법은 $2!§times4!$가지이고, 전체는 $48$이다. 따라서 정답은 ④이다.',
    },
    11: {
      content: '집합 $A=§{x§mid ax+1=2§sqrt{-x-2}§}$에 대하여 $A§ne§varnothing$이기 위한 실수 $a$의 값의 범위는? [3.5점]',
      choices: ['$-2§le a§le1$', '$-2§le a§le-§dfrac12$', '$-§dfrac12§le a§le§dfrac12$', '$-§dfrac12§le a§le2$', '$§dfrac12§le a§le1$'],
      answer: '③',
      solution: '$t=§sqrt{-x-2}§ge0$라 두면 $a=(1-2t)/(t^2+2)$이다. 이 함수는 $t=2$에서 최솟값 $-1/2$를 갖고, $t=0$에서 최댓값 $1/2$를 가지므로 $-1/2§le a§le1/2$이다. 따라서 정답은 ③이다.',
    },
    12: {
      content: 'A, B, C, D 네 사람이 각각 선물을 하나씩 준비하여 상자에 넣고 임의로 하나씩 집었을 때, 네 사람 모두가 서로 다른 사람이 준비한 선물을 집는 경우의 수는? [3.5점]',
      choices: ['6', '9', '12', '15', '24'],
      answer: '⑤',
      solution: '네 사람이 서로 다른 선물을 하나씩 받는 경우는 네 선물을 네 사람에게 배치하는 순열의 수와 같다. 따라서 경우의 수는 $4!=24$이다. 따라서 정답은 ⑤이다.',
    },
    13: {
      content: '그림과 같이 모든 모서리 길이의 합이 20인 직육면체 $ABCD-EFGH$가 있다. $§overline{AG}=§sqrt{13}$일 때, 직육면체 $ABCD-EFGH$의 겉넓이는? [4점]',
      choices: ['$10$', '$12$', '$14$', '$16$', '$18$'],
      answer: '②',
      image: 'assets/images/19_강남고_2학기_기말_고1_기출/q13.png',
      solution: '직육면체의 세 모서리의 길이를 $a,b,c$라 하면 $4(a+b+c)=20$이므로 $a+b+c=5$이다. 또 공간대각선으로부터 $a^2+b^2+c^2=13$이다. 따라서 $ab+bc+ca=((a+b+c)^2-(a^2+b^2+c^2))/2=6$이고, 겉넓이는 $2(ab+bc+ca)=12$이다. 따라서 정답은 ②이다.',
    },
    14: {
      content: '집합 $A=§{x§mid0§le x§le10, x는 정수§}$의 부분집합 중 원소 $0,1$을 포함하는 집합의 개수를 $m$, 원소 $1,2,3$을 포함하지 않는 집합의 개수를 $n$이라 할 때, $m-n$의 값은? [4점]',
      choices: ['$64$', '$128$', '$256$', '$512$', '$1024$'],
      answer: '③',
      solution: '$A$의 원소는 $0$부터 $10$까지 11개이다. $0,1$을 반드시 포함하는 부분집합은 나머지 9개 원소를 자유롭게 선택하므로 $m=2^9$이다. $1,2,3$을 포함하지 않는 부분집합은 나머지 8개 원소를 자유롭게 선택하므로 $n=2^8$이다. 따라서 $m-n=2^9-2^8=256$이므로 정답은 ③이다.',
    },
    15: {
      content: '두 실수 $a,b$에 대하여 두 조건 $p,q,r$는 $p:|a|+|b|=0$, $q:a^2-2ab+b^2=0$, $r:|a+b|=|a-b|$이다. 옳은 것만을 보기에서 있는 대로 고른 것은? [4점] ㄱ. $p$는 $q$이기 위한 충분조건이다. ㄴ. $§sim p$는 $§sim r$이기 위한 필요조건이다. ㄷ. $q$이고 $r$은 $p$이기 위한 필요조건이다.',
      choices: ['ㄱ', 'ㄴ', 'ㄱ, ㄴ', 'ㄴ, ㄷ', 'ㄱ, ㄴ, ㄷ'],
      answer: '⑤',
      solution: '$p$는 $a=b=0$과 동치이므로 $q$와 $r$을 모두 만족한다. 따라서 ㄱ과 ㄷ은 참이다. 또한 $r$은 $ab=0$과 동치이므로 $§sim r$이면 $ab§ne0$이고, 이때 $p$는 성립하지 않는다. 따라서 $§sim p$는 $§sim r$의 필요조건이므로 ㄴ도 참이다. 따라서 정답은 ⑤이다.',
    },
    23: {
      content: '서술형1) 함수 $y=-§sqrt{ax}$의 그래프를 $x$축의 방향으로 $b$만큼, $y$축의 방향으로 3만큼 평행이동한 다음 $x$축에 대하여 대칭이동하면 함수 $y=§sqrt{3x+6}+c$의 그래프와 일치한다. 이때 상수 $a,b,c$에 대하여 $a+b+c$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오) [5점]',
      choices: [],
      answer: '$-2$',
      solution: '평행이동과 대칭이동을 적용한 식은 $y=§sqrt{a(x-b)}-3$이다. 이를 $y=§sqrt{3(x+2)}+c$와 비교하면 $a=3$, $b=-2$, $c=-3$이다. 따라서 $a+b+c=3-2-3=-2$이다.',
    },
    25: {
      content: '서술형3) 건욱이와 재형이를 포함한 8명 중에서 4명을 뽑아 일렬로 줄을 세우려고 할 때, 건욱이와 재형이가 모두 포함되지 않는 경우의 수를 $a$, 두 사람 중 한 명만 포함된 경우의 수를 $b$, 두 사람이 모두 포함되어 있으며 서로 인접하여 있는 경우의 수를 $c$라 할 때, $§dfrac{bc}{a}$의 값을 구하시오. (단, 풀이과정을 자세히 쓰시오) [8점]',
      choices: [],
      answer: '240',
      solution: '두 사람이 모두 포함되지 않는 경우는 $a=§binom{6}{4}§times4!=360$이다. 두 사람 중 한 명만 포함되는 경우는 $b=2§binom{6}{3}§times4!=480$이다. 두 사람이 모두 포함되고 이웃하는 경우는 $c=§binom{6}{2}§times3!§times2=180$이다. 따라서 $bc/a=480§times180/360=240$이다.',
    },
  },
  '24_yeoyang_2final': {
    13: {
      choices: ['25', '34', '49', '64', '81'],
      answer: '②',
      solution: '두 번째 가지는 $k§ge0$에서 항상 한 점이고, 첫 번째 가지는 $k>1$에서 한 점이다. 따라서 $N(0)=1$, $N(1)=1$, $N(k)=2$ $(k=2,3,§dots,17)$이다. 합은 $1+1+16§times2=34$이므로 정답은 ②이다.',
    },
  },
};

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function bankSpan(source) {
  const markerAt = source.indexOf('window.questionBank');
  const open = source.indexOf('[', markerAt);
  let depth = 0;
  let quote = null;
  for (let i = open; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === BS) i += 1;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === '[') depth += 1;
    else if (ch === ']' && --depth === 0) return { open, close: i };
  }
  throw new Error('questionBank array not found');
}

function loadBank(source) {
  const context = { window: {} };
  vm.runInNewContext(source, context, { timeout: 5000 });
  return context.window.questionBank;
}

function replaceBank(source, bank) {
  const { open, close } = bankSpan(source);
  return source.slice(0, open) + '[\n' + bank.map((q) => JSON.stringify(q)).join(',\n') + '\n]' + source.slice(close + 1);
}

const files = walk(workRoot).filter(file => {
  const rel = path.relative(workRoot, file).split(path.sep);
  return rel.includes('package-root') || rel.includes('fresh-extract') || rel.includes('fresh-extract-final') || rel.includes('fresh-extract-package') || rel.includes('candidate');
});
let changed = 0;
const applied = [];
for (const file of files) {
  const examDir = path.relative(workRoot, file).split(path.sep)[0];
  const byId = patches[examDir];
  if (!byId) continue;
  const original = fs.readFileSync(file, 'utf8');
  let bank;
  try { bank = loadBank(original); } catch { continue; }
  let touched = false;
  for (const [idText, patch] of Object.entries(byId)) {
    const q = bank.find(item => item.id === Number(idText));
    if (!q) continue;
    if (examDir === '24_yeoyang_2final' && q.sourceQuestionNo !== '15') continue;
    Object.assign(q, patch);
    for (const [key, value] of Object.entries(q)) if (typeof value === 'string') q[key] = tex(value);
    if (Array.isArray(q.choices)) q.choices = q.choices.map(value => typeof value === 'string' ? tex(value) : value);
    touched = true;
    applied.push(examDir + ' q' + idText);
  }
  if (touched) {
    fs.writeFileSync(file, replaceBank(original, bank), 'utf8');
    changed += 1;
  }
}
console.log(JSON.stringify({ files: files.length, changedFiles: changed, applied: [...new Set(applied)].sort() }, null, 2));
