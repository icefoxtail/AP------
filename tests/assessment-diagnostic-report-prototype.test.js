const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const prototypePath = path.join(root, 'archive', 'assessment', 'assessment-diagnostic-report-prototype.html');

assert.ok(fs.existsSync(prototypePath), 'prototype HTML file should exist');

const html = fs.readFileSync(prototypePath, 'utf8');
const printableRootMatch = html.match(/<main class="[^"]*\bsheet-stack\b[^"]*">([\s\S]*?)<\/main>/);
const printableHtml = printableRootMatch ? printableRootMatch[1] : '';
const printableMatches = [...printableHtml.matchAll(/<section class="sheet[^"]*"/g)];
const firstSheetMatch = printableHtml.match(/<section class="sheet[^"]*"[^>]*aria-label="1페이지 상담 요약"[^>]*>([\s\S]*?)<\/section>\s*<section class="sheet/);
const firstSheetHtml = firstSheetMatch ? firstSheetMatch[1] : '';
const sheetChunks = printableHtml.split(/<section class="sheet[^"]*"/).slice(1);
const evidenceHtml = sheetChunks[1] || '';

assert.ok(printableMatches.length >= 2, 'prototype should include at least two printable sheets');
assert.ok(printableHtml.includes('AP수학 진단평가'), 'printable sheet should use AP수학 진단평가 title');

[
  '[전체 결과 요약]',
  '[현재 강점]',
  '[주요 보완 사인]',
  '[수업 관리 방향]',
  '[문항별 확인 사인]',
  '[출력물 안내 문구]',
  '작성일 또는 출력일',
  '문항별 근거표',
  '단원별 요약',
  '유형별 요약',
  '난이도별 요약'
].forEach((text) => {
  assert.ok(html.includes(text), `prototype should include "${text}"`);
});

assert.ok(!firstSheetHtml.includes('[첫달 관리 방향]'), 'first page should not use first-month-only slot as the default label');
assert.ok(!firstSheetHtml.includes('[가정 확인 안내]'), 'first page should not include family-confirmation slot by default');
assert.ok(!firstSheetHtml.includes('[상담 메모]'), 'first page should not include consultation memo slot by default');
assert.ok(!firstSheetHtml.includes('유형별 요약'), 'first page should move type details off the summary page');
assert.ok(!firstSheetHtml.includes('난이도별 요약'), 'first page should move difficulty details off the summary page');
assert.ok(evidenceHtml.includes('유형별 요약'), 'second page should include type summary');
assert.ok(evidenceHtml.includes('난이도별 요약'), 'second page should include difficulty summary');

assert.ok(/class="[^"]*\bparent-print\b/.test(html), 'prototype should include parent-print separation class');
assert.ok(/class="[^"]*\binternal-only\b/.test(html), 'prototype should include internal-only separation class');
assert.ok(/class="[^"]*\bscreen-only\b/.test(html), 'prototype should include screen-only class');
assert.ok(/class="[^"]*\bprint-hidden\b/.test(html), 'prototype should include print-hidden class');

assert.ok(/@media\s+print/.test(html), 'prototype should include print media CSS');
assert.ok(/page-break|break-before|break-after/.test(html), 'prototype should include page break CSS');
assert.ok(/\.screen-only[\s\S]*display:\s*none\s*!important/.test(html), 'print CSS should hide screen-only elements');
assert.ok(/\.print-hidden[\s\S]*display:\s*none\s*!important/.test(html), 'print CSS should hide print-hidden elements');
assert.ok(/\.internal-only[\s\S]*display:\s*none\s*!important/.test(html), 'print CSS should hide internal-only elements by default');

[
  'APMS 진단평가 결과지',
  'mock data only',
  'Prototype notice',
  '실제 기능 연결 전 디자인/구조 검토용',
  'standalone 디자인 검토용',
  'fetch(',
  '/api/',
  'assessment_analysis_snapshots',
  'assessment_report_snapshots',
  'premium AI',
  '프리미엄 AI',
  'sourceFile',
  'sourceQuestionNo',
  'teacherMemo',
  'raw note',
  '내부 메모',
  '어머님, 안녕하세요.'
].forEach((forbidden) => {
  assert.ok(!printableHtml.includes(forbidden), `printable sheet should not include forbidden text: ${forbidden}`);
});

console.log('assessment diagnostic report prototype checks passed');
