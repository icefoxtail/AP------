import fs from 'node:fs';
import path from 'node:path';

const repo = process.env.AP_REPO || process.cwd();
const values = {
  'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js': {
    20: '6개', 21: '-1/9', 22: '10', 23: '7개'
  },
  'archive/exams/original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js': {
    21: '144', 22: '8/15', 23: '45'
  },
  'archive/exams/original/high/h2/2final/25_매산고_2학기_기말_고2_수학II.js': {
    1: '①', 2: '④', 3: '②', 4: '③', 5: '⑤', 6: '②', 7: '②', 8: '①', 9: '④', 10: '③',
    11: '⑤', 12: '③', 14: '①', 15: '⑤'
  },
  'archive/exams/original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js': {
    1: '②', 2: '④', 3: '①', 4: '④', 5: '④', 6: '①', 7: '③', 8: '②',
    9: '①', 10: '⑤', 11: '②', 12: '②', 13: '③', 14: '②', 15: '①'
  },
  'archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_수학II.js': {
    1: '⑤', 2: '③', 4: '⑤', 5: '①', 6: '②', 8: '⑤', 9: '①', 11: '②',
    12: '②', 13: '④', 14: '①', 16: '④'
  },
  'archive/exams/original/middle/m1/2final/23_금당중_2학기_기말_중1_기출.js': {
    21: '60분', 23: '(1) 정구각형 (2) 27개'
  },
  'archive/exams/original/middle/m1/2final/23_연향중_2학기_기말_중1_기출.js': {
    23: '계급의 크기가 일정하지 않음; 50~60: 2명, 60~70: 1명, 70~80: 5명, 80~90: 6명, 90~100: 6명',
    24: '24명'
  },
  'archive/exams/original/middle/m1/2final/23_왕운중_2학기_기말_중1_기출.js': {
    21: '(1) 히스토그램 (2) 자료의 분포를 한눈에 알아보기 쉽다',
    22: '60°', 23: '(1) 내각 135°, 외각 45° (2) 정팔각형 (3) 20개'
  },
  'archive/exams/original/middle/m1/2final/24_율촌중_2학기_기말_중1_기출.js': {
    19: '(1) 288 cm² (2) 75π cm³', 20: '16명', 21: '54π cm³',
    22: 'ㄴ, ㄷ'
  },
  'archive/exams/original/middle/m1/2final/24_향림중_2학기_기말_중1_기출.js': {
    24: '2|3 4 4 5 7\n3|1 3 8\n4|1 2 5 7\n5|1 4 5\n6|5 7 9'
  },
  'archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js': {
    22: '(1) 4.5x+3y mg (2) 1350 mg',
    23: '20/3 km (약 6.67 km)'
  }
};

let changed = 0;
for (const [rel, byId] of Object.entries(values)) {
  const file = path.join(repo, rel);
  const text = fs.readFileSync(file, 'utf8');
  const marker = text.indexOf('window.questionBank');
  const head = text.slice(0, marker);
  let bank = text.slice(marker);
  for (const [id, answer] of Object.entries(byId)) {
    const re = new RegExp(`("id"\\s*:\\s*${id},[\\s\\S]*?"answer"\\s*:\\s*)""`);
    if (!re.test(bank)) continue;
    bank = bank.replace(re, `$1${JSON.stringify(answer)}`);
  }
  if (bank !== text.slice(marker)) {
    fs.writeFileSync(file, head + bank, 'utf8');
    changed++;
  }
}
console.log(JSON.stringify({ changedFiles: changed }));
