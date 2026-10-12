const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../archive/layout-materializer.js'), 'utf8');
const columnsStart = source.indexOf('    function columns(');
const columnsEnd = source.indexOf('\n    function fullwidthColumn(', columnsStart);
assert.notEqual(columnsStart, -1, 'column materializer helper exists');
assert.notEqual(columnsEnd, -1, 'column helper ends before fullwidth materialization');
const fakeNode = () => ({ style: {}, children: [], appendChild(node) { this.children.push(node); return node; } });
const columnsContext = { document: { createElement: fakeNode } };
vm.runInNewContext(source.slice(columnsStart, columnsEnd) + '\nthis.columns = columns;', columnsContext);

test('solution grids force equal zero-minimum tracks while other grids keep their existing sizing', () => {
  const solutionPage = { body: fakeNode() };
  columnsContext.columns(solutionPage, columnsContext.document, undefined, 'grid-col sol-grid-col', true);
  const solutionGrid = solutionPage.body.children[0];
  assert.equal(solutionGrid.style.gridTemplateColumns, 'minmax(0, 1fr) minmax(0, 1fr)');

  const examPage = { body: fakeNode() };
  columnsContext.columns(examPage, columnsContext.document, '1 1 0');
  const examGrid = examPage.body.children[0];
  assert.equal(examGrid.style.gridTemplateColumns, undefined);
  assert.equal(examGrid.style.flex, '1 1 0');
});

const widthStart = source.indexOf('    function hasHorizontalSolutionOverflow(');
const widthEnd = source.indexOf('\n    function assertQuestionImagesReady(', widthStart);
assert.notEqual(widthStart, -1, 'solution horizontal overflow helper exists');
assert.notEqual(widthEnd, -1, 'solution horizontal overflow helper ends before image readiness');
const widthContext = {};
vm.runInNewContext(source.slice(widthStart, widthEnd) + '\nthis.hasHorizontalSolutionOverflow = hasHorizontalSolutionOverflow;', widthContext);

test('solution overflow detection promotes only blocks that do not fit their column', () => {
  const regularColumn = { clientWidth: 340, scrollWidth: 644 };
  const narrowBox = { clientWidth: 316, scrollWidth: 620 };
  assert.equal(widthContext.hasHorizontalSolutionOverflow(narrowBox, regularColumn), true);

  const fullWidthColumn = { clientWidth: 680, scrollWidth: 680 };
  const fullWidthBox = { clientWidth: 656, scrollWidth: 620 };
  assert.equal(widthContext.hasHorizontalSolutionOverflow(fullWidthBox, fullWidthColumn), false);

  const solutionStart = source.indexOf('    async function solution(');
  const solutionEnd = source.indexOf('\n    global.APArchiveLayoutMaterializer', solutionStart);
  assert.notEqual(solutionStart, -1, 'solution materializer exists');
  assert.notEqual(solutionEnd, -1, 'solution materializer ends before API export');
  const solutionSource = source.slice(solutionStart, solutionEnd);
  assert.match(solutionSource, /fullWidth = true;\s*blocks\[index\]\.fullWidth = true;/);
  assert.match(solutionSource, /SOLUTION_HORIZONTAL_OVERFLOW_FULL_WIDTH/);
});

const capacityStart = source.indexOf('    function measuredSolutionCapacity(document, probePage) {');
const capacityEnd = source.indexOf('\n    async function exam(', capacityStart);
assert.notEqual(capacityStart, -1, 'solution capacity measurement helper exists');
assert.notEqual(capacityEnd, -1, 'solution capacity helper ends before exam materialization');
const capacityContext = {};
vm.runInNewContext(source.slice(capacityStart, capacityEnd) + '\nthis.measureSolutionCapacity = measuredSolutionCapacity;', capacityContext);

test('solution layout uses its measured offscreen A4 probe when available', () => {
  assert.equal(capacityContext.measureSolutionCapacity({ querySelector() { assert.fail('active page fallback should not run'); } }, { body: { clientHeight: 217 } }), 217);
});

test('screen-fit zero probe falls back only to the existing measured A4 page body', () => {
  assert.equal(capacityContext.measureSolutionCapacity({ querySelector(selector) {
    assert.equal(selector, '#print-area .page-body');
    return { clientHeight: 217 };
  } }, { body: { clientHeight: 0 } }), 217);
  assert.throws(() => capacityContext.measureSolutionCapacity({ querySelector() { return { clientHeight: 0 }; } }, { body: { clientHeight: 0 } }), {
    message: 'INVALID_MEASURED_SOLUTION_HEIGHT',
  });
});
