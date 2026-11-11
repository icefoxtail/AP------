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
const widthWarnings = [];
const widthContext = { console: { warn: (...args) => widthWarnings.push(args) } };
vm.runInNewContext(source.slice(widthStart, widthEnd) + '\nthis.hasHorizontalSolutionOverflow = hasHorizontalSolutionOverflow; this.fitSolutionToNarrowColumn = fitSolutionToNarrowColumn; this.SOL_FIT_MAX_LEVEL = SOL_FIT_MAX_LEVEL; this.promoteSolutionToFullWidth = promoteSolutionToFullWidth;', widthContext);

test('solution overflow detection flags only blocks that do not fit their column', () => {
  const regularColumn = { clientWidth: 340, scrollWidth: 644 };
  const narrowBox = { clientWidth: 316, scrollWidth: 620 };
  assert.equal(widthContext.hasHorizontalSolutionOverflow(narrowBox, regularColumn), true);

  const fullWidthColumn = { clientWidth: 680, scrollWidth: 680 };
  const fullWidthBox = { clientWidth: 656, scrollWidth: 620 };
  assert.equal(widthContext.hasHorizontalSolutionOverflow(fullWidthBox, fullWidthColumn), false);

});

test('overflow never promotes a block to full width except in the explicit last-resort branch', () => {
  const solutionStart = source.indexOf('    async function solution(');
  const solutionEnd = source.indexOf('\n    global.APArchiveLayoutMaterializer', solutionStart);
  assert.notEqual(solutionStart, -1, 'solution materializer exists');
  assert.notEqual(solutionEnd, -1, 'solution materializer ends before API export');
  const solutionSource = source.slice(solutionStart, solutionEnd);
  // 2026-11-02: overflow-driven promotion was removed from the normal path (one 2px overflow on a
  // student PC turned a whole page into 1 column). It survives ONLY as a last resort when
  // fitSolutionToNarrowColumn() returns false, because leaving an unfittable box in the half column
  // fails the S12 page gate and blanks the whole exam (worse for students). So every promotion must
  // go through promoteSolutionToFullWidth(), and no code may assign blocks[index].fullWidth directly.
  assert.doesNotMatch(solutionSource, /blocks\[index\]\.fullWidth = true/);
  assert.match(solutionSource, /let fullWidth = box\.dataset\.solutionFullWidth === 'true' \|\| blocks\[index\]\.fullWidth === true;/);
  const assignments = [...solutionSource.matchAll(/fullWidth = true;/g)].length;
  const calls = [...solutionSource.matchAll(/promoteSolutionToFullWidth\(/g)].length;
  const guarded = [...solutionSource.matchAll(/else \{\s*promoteSolutionToFullWidth\([^;]*\);\s*fullWidth = true;/g)].length;
  assert.ok(calls >= 1);
  assert.equal(assignments, calls, 'every fullWidth = true accompanies a promoteSolutionToFullWidth() call');
  assert.equal(guarded, calls, 'promotion happens only in the else branch of a failed fitSolutionToNarrowColumn()');
  assert.match(solutionSource, /fitSolutionToNarrowColumn\(box, cols\[0\]\)/);
  // A block that is already full width and still overflows the full-width column keeps failing loudly.
  assert.match(solutionSource, /SOLUTION_HORIZONTAL_OVERFLOW_FULL_WIDTH/);
});

test('last-resort promotion restores the box, marks only that block full width and leaves a warning', () => {
  const classes = new Set(['sol-fit-narrow']);
  const box = { dataset: { solFit: '4', sourceRef: 'exam#q3' }, style: { cssText: 'font-size:7pt' },
    classList: { remove: name => classes.delete(name) },
    clientWidth: 316, scrollWidth: 400, getBoundingClientRect: () => ({ right: 316 }), querySelectorAll: () => [] };
  const block = { blockId: 'solution-block:3:primary' };
  const other = { blockId: 'solution-block:4:primary' };
  widthWarnings.length = 0;
  widthContext.promoteSolutionToFullWidth(box, { clientWidth: 340, scrollWidth: 340 }, block, 'color:red');
  assert.equal(block.fullWidth, true);
  assert.equal(other.fullWidth, undefined);
  assert.equal(classes.has('sol-fit-narrow'), false);
  assert.equal(box.dataset.solFit, undefined);
  assert.equal(box.style.cssText, 'color:red');
  assert.equal(widthWarnings.length, 1);
  assert.match(String(widthWarnings[0][0]), /last resort/);
  assert.equal(widthWarnings[0][1].sourceRef, 'exam#q3');
});

test('sol-fit-narrow CSS overrides inline fixed-width images and tables inside the half column', () => {
  const engine = fs.readFileSync(path.join(__dirname, '../archive/engine.html'), 'utf8');
  // Fixed inline widths such as <img style="max-width: 400px"> are not reduced by wrapping or by
  // font-size steps, so the fit class must cap them to the column with !important (keeping ratio).
  assert.match(engine, /\.sol-fit-narrow :is\(\.sol-exp, \[data-semantic-content="1"\]\) :is\(img, video, canvas\)[^{]*\{[^}]*max-width: 100% !important;[^}]*width: auto !important;[^}]*height: auto !important;/);
  assert.match(engine, /\.sol-fit-narrow :is\(\.sol-exp, \[data-semantic-content="1"\]\) table \{[^}]*max-width: 100% !important;/);
  assert.doesNotMatch(engine, /\.sol-fit-narrow[^{]*\{[^}]*overflow\s*:\s*(hidden|clip)/, 'fitting must never clip content');
});

test('narrow-column fit adds wrapping first, then steps the font down, without clipping', () => {
  const makeBox = (overflowUntil) => {
    const classes = new Set();
    const box = { dataset: {}, classList: { add: name => classes.add(name), has: name => classes.has(name) },
      get clientWidth() { return 316; },
      get scrollWidth() {
        const level = Number(this.dataset.solFit || 0);
        const wrapped = classes.has('sol-fit-narrow');
        return wrapped && level >= overflowUntil ? 316 : 620;
      } };
    return { box, classes };
  };
  const column = { clientWidth: 340, scrollWidth: 340 };

  const fits = makeBox(0);
  assert.equal(widthContext.fitSolutionToNarrowColumn(fits.box, column), true);
  assert.equal(fits.classes.has('sol-fit-narrow'), true);
  assert.equal(fits.box.dataset.solFit, undefined);

  const needsFont = makeBox(2);
  assert.equal(widthContext.fitSolutionToNarrowColumn(needsFont.box, column), true);
  assert.equal(needsFont.box.dataset.solFit, '2');

  const hopeless = makeBox(99);
  assert.equal(widthContext.fitSolutionToNarrowColumn(hopeless.box, column), false);
  assert.equal(Number(hopeless.box.dataset.solFit), widthContext.SOL_FIT_MAX_LEVEL);

  const untouched = { dataset: {}, classList: { add() { assert.fail('a box that already fits must not be modified'); } }, clientWidth: 316, scrollWidth: 316 };
  assert.equal(widthContext.fitSolutionToNarrowColumn(untouched, column), true);
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

// 2026-11-11: a solution whose head (number, problem, [answer], figure) plus first chunk cannot share one column used to
// fail with MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE, so such figures were dropped. The figure now moves to the end of the
// solution text only in that case; every box that fits today keeps its head/figure layout untouched.
const tailStart = source.indexOf('    function moveSolutionImageToTail(');
const tailEnd = source.indexOf('\n    async function solution(', tailStart);
assert.notEqual(tailStart, -1, 'solution figure tail mover exists');
assert.notEqual(tailEnd, -1, 'tail mover ends before solution materialization');
const tailContext = {};
vm.runInNewContext(source.slice(tailStart, tailEnd) + '\nthis.moveSolutionImageToTail = moveSolutionImageToTail;', tailContext);
const fakeElement = (tag) => ({ tag, className: '', dataset: {}, children: [], appendChild(node) { this.children.push(node); return node; } });

test('the solution figure moves out of the head into exactly one final chunk, and only once', () => {
  const wrap = fakeElement('span');
  let queried = null;
  const record = { chunks: [fakeElement('span'), fakeElement('span')],
    box: { querySelector(selector) { queried = selector; return this.hasWrap ? wrap : null; }, hasWrap: true } };
  const document = { createElement: fakeElement };
  assert.equal(tailContext.moveSolutionImageToTail(record, document), true);
  assert.equal(queried, '.sol-meta > .sol-image-wrap');
  assert.equal(record.chunks.length, 3);
  const tail = record.chunks.at(-1);
  assert.equal(tail.className, 'sol-chunk');
  assert.deepEqual(tail.children, [wrap]);
  assert.equal(tail.dataset.solutionImageTail, '1');
  // A second call never duplicates the figure.
  assert.equal(tailContext.moveSolutionImageToTail(record, document), false);
  assert.equal(record.chunks.length, 3);
  // A box without a figure, or without chunks yet, is left alone.
  assert.equal(tailContext.moveSolutionImageToTail({ chunks: [fakeElement('span')], box: { querySelector: () => null } }, document), false);
  assert.equal(tailContext.moveSolutionImageToTail({ chunks: null, box: { querySelector: () => wrap } }, document), false);
});

test('the figure move is reached only when the head plus the first chunk exceed the column', () => {
  const solutionStart = source.indexOf('    async function solution(');
  const solutionSource = source.slice(solutionStart);
  const guard = solutionSource.match(/if \(query\.primary && Math\.round\(heights\[0\]\) > capacity \+ 2 && moveSolutionImageToTail\(record, document\)\) \{([\s\S]*?)\n {16}\}/);
  assert.ok(guard, 'move is guarded by primary query + first chunk over capacity');
  assert.match(guard[1], /record\.input\.chunkCount = record\.chunks\.length;/);
  assert.match(guard[1], /record\.input\.primaryHeights = undefined;/);
  assert.match(guard[1], /continue;/);
  assert.equal([...solutionSource.matchAll(/moveSolutionImageToTail\(/g)].length, 1, 'no other call site moves figures');
});

test('planner places a moved figure chunk last instead of failing when the head did not fit', () => {
  const L = require('../archive/layout-authority.js');
  const geometry = { usableHeight: 958, columns: 2, tolerance: 2 };
  const base = { blockId: 'solution-block:22:primary', rawHeight: 1500, compressedHeight: 1400, fullWidth: false };
  // Before: head + figure + first chunk = 960 > 958 + 2, as in 21 Maesan Q22 with a figure.
  assert.throws(() => L.planMeasuredSolutionLayout({ pageGeometry: geometry, blocks: [{ ...base, chunkCount: 3, primaryHeights: [961] }] }),
    /MEASURED_SOLUTION_CHUNK_EXCEEDS_PAGE:solution-block:22:primary:0/);
  // After: the figure became chunk index 3 (4 chunks); the head measures without it and the figure rides in the last range.
  const needs = L.planMeasuredSolutionLayout({ pageGeometry: geometry, blocks: [{ ...base, chunkCount: 4, primaryHeights: [300, 700, 940, 1200] }] });
  assert.equal(needs.status, 'NEEDS_MEASUREMENT');
  assert.equal(needs.measurementRequest.primary, false);
  assert.equal(needs.measurementRequest.start, 2, 'the tiny tail borrows one chunk, so the next piece starts at index 2');
  const ready = L.planMeasuredSolutionLayout({ pageGeometry: geometry, blocks: [{ ...base, chunkCount: 4,
    primaryHeights: [300, 700, 940, 1200], continuationHeights: { 2: [260, 440] } }] });
  assert.equal(ready.status, 'READY');
  const placements = ready.pages.flatMap(page => page.itemPlacements);
  assert.equal(placements.length, 2);
  assert.equal(placements.at(-1).chunkEnd, 3, 'the figure chunk is in the final piece');
  assert.equal(placements.filter(item => item.chunkStart <= 3 && item.chunkEnd >= 3).length, 1, 'figure chunk appears in exactly one piece');
});
