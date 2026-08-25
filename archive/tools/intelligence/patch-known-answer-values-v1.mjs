import fs from 'node:fs';
import path from 'node:path';

const repo = process.env.AP_REPO || process.cwd();
const target = path.join(repo, 'archive/exams/original/middle/m1/2final/24_연향중_2학기_기말_중1_기출.js');
const answers = [
  '①', '②', '⑤', '③', '①', '③', '②', '④', '⑤', '④',
  '⑤', '③', '③', '②, ④', '②', '⑤', '⑤', '①', '①', '④',
  '24π cm²',
  '정다면체는 모든 면이 합동인 정다각형이고 각 꼭짓점에 모인 면의 수가 같은 다면체이다. 정다면체는 정사면체, 정육면체, 정팔면체, 정십이면체, 정이십면체의 다섯 종류이다. 제시된 축구공 모양은 정오각형과 정육각형이 함께 있어 모든 면이 합동이 아니므로 정다면체가 아니다.',
  '원뿔대의 전개도를 그리고, 바깥 곡면과 두 밑면의 넓이를 합하면 90π cm²이다.'
];
let text = fs.readFileSync(target, 'utf8');
const marker = text.indexOf('window.questionBank');
const head = text.slice(0, marker);
let bank = text.slice(marker);
let i = 0;
bank = bank.replace(/("answer"\s*:\s*)""(\s*,\s*\n\s*"solution")/g, (m, p, s) => {
  if (i >= answers.length) return m;
  return `${p}${JSON.stringify(answers[i++])}${s}`;
});
if (i !== answers.length) throw new Error(`patched ${i}/${answers.length}`);
fs.writeFileSync(target, head + bank, 'utf8');
console.log(JSON.stringify({ file: path.relative(repo, target), answers: i }));
