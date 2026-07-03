import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: { db: {} },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

const info = context.reportCenterNormalizeArchiveFile('exams/original/high/h1/1final/22_test_exam.js');
assert.equal(info.ok, true);

// 상대 이미지 경로는 시험 js와 같은 디렉터리 기준으로 절대 URL이 된다.
const rel = context.reportCenterResolveArchiveImageUrl(info, 'images/pic.png');
assert.ok(rel.startsWith('https://icefoxtail.github.io/AP------/archive/exams/'), rel);
assert.ok(rel.endsWith('/1final/images/pic.png'), rel);

// 실제 데이터 레이아웃: image는 아카이브 루트 기준(assets/images/<학교>/qN.png).
// 시험 js 디렉터리(1final)가 아니라 아카이브 루트에 붙어야 한다.
const assetImg = context.reportCenterResolveArchiveImageUrl(info, 'assets/images/22_금당고_1학기_기말_고1_기출/q16.png');
assert.ok(assetImg.startsWith('https://icefoxtail.github.io/AP------/archive/assets/images/'), assetImg);
assert.ok(!assetImg.includes('/1final/'), `루트 기준이어야 함(1final 없음): ${assetImg}`);
assert.ok(/q16\.png$/.test(assetImg), assetImg);

// http/data URL은 그대로 통과.
assert.equal(context.reportCenterResolveArchiveImageUrl(info, 'https://x/y.png'), 'https://x/y.png');
assert.equal(context.reportCenterResolveArchiveImageUrl(info, 'data:image/png;base64,AAA'), 'data:image/png;base64,AAA');

// 빈 이미지/URL 없음 → 빈 문자열(빈 <img src> 방지).
assert.equal(context.reportCenterResolveArchiveImageUrl(info, ''), '');
assert.equal(context.reportCenterResolveArchiveImageUrl({ url: '' }, 'images/pic.png'), '');

// 한글 경로 인코딩.
const kr = context.reportCenterResolveArchiveImageUrl(info, 'images/금당고_1.png');
assert.ok(/images\/%[0-9A-F]{2}/i.test(kr), kr);

// normalizeQuestionDetail이 image를 담는다(found/not-found).
const found = context.reportCenterNormalizeQuestionDetail(
  { content: '점 P의 좌표', image: 'images/a.png', choices: ['①', '②'], answer: '⑤', solution: '풀이' },
  1
);
assert.equal(found.found, true);
assert.equal(found.image, 'images/a.png');
assert.deepEqual(found.choices, ['①', '②']);

const missing = context.reportCenterNormalizeQuestionDetail(null, 3);
assert.equal(missing.found, false);
assert.equal(missing.image, '');

console.log('report archive image test passed');
