import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
function patchQuestion(relative, id, additions, visualReading) {
  const file = path.join(root, relative.replaceAll('/', path.sep));
  let text = fs.readFileSync(file, 'utf8');
  const block = new RegExp(`(\\"id\\": ${id},[\\s\\S]*?)(\\n\\s*\\"subUnitKey\\":)`, 'm');
  const match = text.match(block);
  if (!match) throw new Error(`question block not found: ${relative} q${id}`);
  if (text.slice(match.index, match.index + match[0].length).includes('"solutionImage"')) throw new Error(`solutionImage already present: ${relative} q${id}`);
  let replacement = match[1];
  if (visualReading) replacement = replacement.replace(/\\n따라서 구하는 값은/, `\\n[시각자료 읽기] ${visualReading}\\n따라서 구하는 값은`);
  replacement += `\n${additions}`;
  text = text.slice(0, match.index) + replacement + match[2] + text.slice(match.index + match[0].length);
  fs.writeFileSync(file, text, 'utf8');
}

patchQuestion(
  'archive/exams/original/high/h1/2final/22_강남여고_2학기_기말_고1_기출.js',
  21,
  `    "solutionImage": "assets/images/22_강남여고_2학기_기말_고1_기출/q21-solution.svg",\n    "solutionImageAlt": "U의 약수 원소에서 A={2,3,4,6,12}와 B\\cup C={1,2,6,24}를 복원하고 (B\\cup C)-A={1,24}를 남기는 도식",\n    "solutionImageCaption": "여집합 두 조건을 뒤집어 최종 원소 {1,24}와 합 25를 확인하는 집합 영역 pipeline",\n    "solutionImageSize": "full",`,
  '초록색으로 남은 {1,24}가 (B∪C)-A이고, 합은 25이다.'
);
patchQuestion(
  'archive/exams/original/high/h1/2final/22_순천여고_2학기_기말_고1_기출.js',
  15,
  `    "solutionImage": "assets/images/22_순천여고_2학기_기말_고1_기출/q15-solution.svg",\n    "solutionImageAlt": "2 강제 포함, 3 금지, 자유 원소 {1,4,5,6,7}에서 홀수 합 선택 16개를 보여 주는 상태표",\n    "solutionImageCaption": "강제·금지·자유 원소를 나누고 자유 원소 다섯 개의 홀짝 대칭으로 2⁵/2=16을 세는 도식",\n    "solutionImageSize": "full",`,
  '2는 강제 포함, 3은 금지, 자유 원소의 홀수 합 선택이 16개임을 표에서 확인한다.'
);
console.log(JSON.stringify({ status: 'BATCH_07_LINKAGES_PATCHED' }));
