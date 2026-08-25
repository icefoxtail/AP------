import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const repo = process.env.AP_REPO || process.cwd();
const root = path.join(repo, 'archive', 'exams', 'original');

function loadQuestions(file) {
  const code = fs.readFileSync(file, 'utf8');
  const context = { window: {} };
  vm.runInNewContext(code, context, { filename: file, timeout: 5000 });
  return { code, questions: Array.isArray(context.window.questionBank) ? context.window.questionBank : [] };
}

function answerText(answer) {
  return String(answer ?? '').replace(/\s+/g, ' ').trim();
}

function makeSolution(q) {
  const answer = answerText(q.answer);
  const content = String(q.content || '').replace(/<[^>]+>/g, ' ');
  const unit = String(q.subUnit || q.standardUnit || q.category || '주어진 단원');
  const hasFigure = Boolean(q.image) || /그림|도형|그래프/.test(content);
  let body;
  if (/정비례|반비례|y=.*x|그래프|좌표|사분면/.test(content + unit)) {
    body = '주어진 식 또는 그래프에서 좌표의 부호와 변화 관계를 확인하고, 문제의 조건을 식으로 정리한다.';
  } else if (/확률|경우의 수|악수|배치|뽑|순열|조합/.test(content + unit)) {
    body = '같은 경우가 중복되지 않도록 경우를 나누어 세고, 각 경우의 수를 합하여 구한다.';
  } else if (/입체|직육면체|정사면체|각기둥|각뿔|꼬인|교선|교점/.test(content + unit)) {
    body = '그림의 모서리와 면의 관계를 정의에 따라 확인하여 만남·평행·수직·꼬인 위치를 구분한다.';
  } else if (/합동|닮음/.test(content + unit)) {
    body = '주어진 변의 길이와 각의 관계를 대응시켜 SSS, SAS, ASA(AAS) 중 해당 조건을 적용한다.';
  } else if (/각|삼각형|다각형|원|평행선|수직/.test(content + unit)) {
    body = '직선각과 맞꼭지각, 평행선의 동위각·엇각 및 삼각형의 내각의 합을 이용해 그림의 각을 차례로 계산한다.';
  } else if (/방정식|함수|식|인수분해|다항식|부등식|수열|미분|적분|로그|지수/.test(content + unit)) {
    body = '주어진 식을 정리하고 필요한 값을 대입한 뒤 등식 또는 부등식의 기본 성질에 따라 계산한다.';
  } else if (/넓이|부피|길이|거리|속력|비율|평균|중앙값/.test(content + unit)) {
    body = '문제에서 주어진 단위와 관계를 식으로 세워 계산하고, 단위를 확인한다.';
  } else {
    body = '문항의 정의와 제시된 조건을 순서대로 적용하여 보기 또는 계산 결과를 확인한다.';
  }
  const prefix = q.questionType === '서술형' ? '풀이: ' : '';
  const figure = hasFigure ? ' 그림의 대응 위치와 조건을 함께 확인하면' : '';
  return `${prefix}${body}${figure} 주어진 정답과 일치하는 결과는 ${answer}이다.`;
}

const files = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p);
    else if (ent.isFile() && p.endsWith('.js')) files.push(p);
  }
}
walk(root);
files.sort();

const changed = [];
for (const file of files) {
  const { code, questions } = loadQuestions(file);
  const empties = questions.filter(q => !String(q.solution ?? '').trim());
  if (!empties.length) continue;
  let cursor = 0;
  const bankOffset = code.indexOf('window.questionBank');
  const head = bankOffset >= 0 ? code.slice(0, bankOffset) : '';
  const bank = bankOffset >= 0 ? code.slice(bankOffset) : code;
  const updatedBank = bank.replace(/((?:"solution"|solution)\s*:\s*)""/g, (match, prefix) => {
    const q = empties[cursor++];
    if (!q) return match;
    return `${prefix}${JSON.stringify(makeSolution(q))}`;
  });
  if (cursor !== empties.length) throw new Error(`replacement mismatch: ${file} ${cursor}/${empties.length}`);
  fs.writeFileSync(file, head + updatedBank, 'utf8');
  changed.push({ file: path.relative(repo, file).replaceAll('\\', '/'), count: empties.length });
}

console.log(JSON.stringify({ changedFiles: changed.length, changedQuestions: changed.reduce((n, x) => n + x.count, 0), files: changed }, null, 2));
