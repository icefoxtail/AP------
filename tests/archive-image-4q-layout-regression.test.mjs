import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const repoRoot = path.resolve(import.meta.dirname, '..');
const targets = [
  'original/high/h1/1final/23_복성고_1학기_기말_고1_기출.js#15',
  'original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js#9',
  'original/high/h1/2mid/21_효천고_2학기_중간_고1_기출.js#8',
  'original/high/h1/2mid/22_복성고_2학기_중간_고1_기출.js#4',
  'original/high/h2/2mid/25_순천고_2학기_중간_고2_확률과통계.js#17',
  'original/middle/m1/2final/25_왕의중_2학기_기말_중1_기출.js#20',
  'original/middle/m1/2mid/24_왕운중_2학기_중간_중1_기출.js#10',
  'original/middle/m1/2mid/25_연향중_2학기_중간_중1_기출.js#3',
  'original/middle/m1/2mid/25_풍덕중_2학기_중간_중1_기출.js#4',
  'original/middle/m2/1final/25_연향중_1학기_기말_중2_기출.js#8',
  'original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js#10',
  'original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js#12',
  'original/middle/m2/2final/25_삼산중_2학기_기말_중2_기출.js#20',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#2',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#9',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#11',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#12',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#17',
  'original/middle/m2/2final/25_왕운중_2학기_기말_중2_기출.js#20',
  'original/middle/m2/2mid/23_연향중_2학기_중간_중2_수학.js#20',
  'original/middle/m2/2mid/23_이수중_2학기_중간_중2_수학.js#4',
  'original/middle/m2/2mid/24_신흥중_2학기_중간_중2_수학.js#6',
  'original/middle/m2/2mid/24_왕운중_2학기_중간_중2_수학.js#7',
  'original/middle/m2/2mid/25_연향중_2학기_중간_중2_수학.js#7',
  'original/middle/m2/2mid/25_왕운중_2학기_중간_중2_수학.js#16',
  'original/middle/m2/2mid/25_왕운중_2학기_중간_중2_수학.js#19',
  'original/middle/m3/1final/26_삼산중_1학기_기말_중3_기출.js#17',
  'original/middle/m3/1mid/26_왕운중_1학기_중간_중3_기출c.js#12',
  'original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js#19',
  'original/middle/m3/2final/23_순천여중_2학기_기말_중3_기출.js#19',
  'original/middle/m3/2final/25_연향중_2학기_기말_중3_기출.js#19',
  'original/middle/m3/2mid/24_금당중_2학기_중간_중3_수학.js#17',
  'original/middle/m3/2mid/24_신흥중_2학기_중간_중3_수학.js#10',
  'similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js#13',
  'similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제.js#8'
];

function loadQuestions(relativeFile) {
  const context = { console, window: {} };
  const file = path.join(repoRoot, 'archive', 'exams', relativeFile);
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), context, { filename: file });
  return context.window.questionBank;
}

test('4-question image candidates have a fitting image or 2up layout override', () => {
  const failures = [];
  for (const target of targets) {
    const separator = target.lastIndexOf('#');
    const relativeFile = target.slice(0, separator);
    const id = Number(target.slice(separator + 1));
    const question = loadQuestions(relativeFile).find(item => Number(item.id) === id);
    assert.ok(question, `missing target ${target}`);
    const imageFits = ['small', 'half', 'medium'].includes(question.imageSize);
    const layoutFits = question.layoutTag === 'subjective-2up';
    if (!imageFits && !layoutFits) failures.push({ target, imageSize: question.imageSize ?? null, layoutTag: question.layoutTag ?? null });
  }
  assert.deepEqual(failures, [], `unfixed 4-question image candidates: ${JSON.stringify(failures)}`);
});
