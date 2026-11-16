const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '../archive/mixed_engine.html'), 'utf8');
const start = html.indexOf('function updateScreenFitScale() {');
const end = html.indexOf('\nif (!buildContext', start);
assert.ok(start >= 0 && end > start, 'use the production screen-fit function');
const functionSource = html.slice(start, end);
const screenRule = html.match(/body\.screen-fit-mode #print-area \{([^}]+)\}/)?.[1];
assert.ok(screenRule, 'the existing screen-only paper rule exists');
const reviewCss = fs.readFileSync(path.join(__dirname, '../archive/archive2-review.css'), 'utf8');
const reviewMedia = reviewCss.match(/@media screen and (\(max-width: (\d+)px\)) \{/);
const reviewRule = reviewCss.match(/html\.archive2-paper-review body\.screen-fit-mode #print-area \{([^}]+)\}/)?.[1];
assert.ok(reviewMedia && reviewRule, 'use the existing review stylesheet, not a synthetic layout mode');

function setup({ clientWidth = 1280, innerWidth = clientWidth, pageWidth = 794,
  areaWidth = pageWidth, screenFit = true, hasArea = true, hasPage = true,
  buildTarget = false, paperReview = false } = {}) {
  const values = new Map();
  const classes = new Set(paperReview ? ['archive2-paper-review'] : []);
  const page = { offsetWidth: pageWidth };
  const area = { offsetWidth: areaWidth, querySelector(selector) {
    assert.equal(selector, '.page');
    return hasPage ? page : null;
  } };
  const documentElement = { clientWidth, classList: { contains: name => classes.has(name) },
    style: { setProperty(name, value) { values.set(name, value); } } };
  const context = {
    document: { documentElement, body: { classList: { contains: name => screenFit && name === 'screen-fit-mode' } },
      getElementById(id) {
        assert.equal(id, 'print-area');
        assert.equal(buildTarget, false, 'an explicit build target is preferred');
        return hasArea ? area : null;
      } },
    window: { innerWidth, matchMedia(query) {
      assert.equal(query, reviewMedia[1]);
      return { matches: documentElement.clientWidth <= Number(reviewMedia[2]) };
    } },
    buildContext: buildTarget ? { targetArea: area } : null,
  };
  vm.runInNewContext(`${functionSource}\nthis.update = updateScreenFitScale;`, context);
  return { context, values, area, page, classes, update: () => context.update() };
}

// This small model evaluates the production CSS transform on the paper's two
// horizontal edges. It covers scale and centering arithmetic, not browser/UI
// readability. Actual desktop/mobile screenshots remain a separate gate.
function paperBounds(fixture, viewportWidth, measuredAreaWidth = fixture.area.offsetWidth) {
  assert.match(screenRule, /width:\s*max-content;/);
  assert.match(screenRule, /margin-left:\s*auto;/);
  assert.match(screenRule, /margin-right:\s*auto;/);
  assert.match(screenRule, /transform-origin:\s*top center;/);
  const transform = screenRule.match(/(?:^|;)\s*transform:\s*([^;]+);/)?.[1];
  assert.ok(transform, 'the scale stays in the original production CSS rule');
  const resolved = transform.replace(/var\((--[\w-]+),\s*([^()]+)\)/g,
    (_, name, fallback) => fixture.values.get(name) ?? fallback);
  const operations = [...resolved.matchAll(/(translateX|scale)\(([^()]+)\)/g)];
  assert.equal(resolved.replace(/(translateX|scale)\([^()]+\)/g, '').trim(), '', 'model only the existing horizontal transform operations');
  const leftReview = fixture.classes.has('archive2-paper-review') && fixture.context.window.matchMedia(reviewMedia[1]).matches;
  if (leftReview) {
    assert.match(reviewRule, /margin-left:\s*0;/);
    assert.match(reviewRule, /margin-right:\s*0;/);
    assert.match(reviewRule, /transform-origin:\s*top left;/);
  }
  const origin = leftReview ? 0 : measuredAreaWidth / 2;
  const margin = leftReview ? 0 : Math.max(0, (viewportWidth - measuredAreaWidth) / 2);
  const edge = x => {
    let result = x - origin;
    for (const [, operation, argument] of [...operations].reverse()) {
      const value = Number.parseFloat(argument);
      assert.ok(Number.isFinite(value), 'a screen transform must be finite');
      result = operation === 'scale' ? result * value : result + value;
    }
    return margin + origin + result;
  };
  return { left: edge(0), right: edge(measuredAreaWidth) };
}

function assertFits(fixture, width) {
  const bounds = paperBounds(fixture, width);
  assert.ok(bounds.left >= 8 - 1e-8, `left edge ${bounds.left} keeps the existing gutter`);
  assert.ok(bounds.right <= width - 8 + 1e-8, `right edge ${bounds.right} fits the actual viewport ${width}`);
  return bounds;
}

test('desktop screen-fit retains the unscaled centered A4 paper', () => {
  const fixture = setup();
  fixture.update();
  assert.equal(Number(fixture.values.get('--screen-page-scale')), 1);
  assert.deepEqual(paperBounds(fixture, 1280), { left: 243, right: 1037 });
});

test('mobile overflow cannot enlarge screen-fit beyond the 390px document viewport', () => {
  const fixture = setup({ clientWidth: 390, innerWidth: 786 });
  fixture.update();
  const bounds = assertFits(fixture, 390);
  assert.ok(Math.abs(bounds.right - bounds.left - 374) < 1e-8);
});

test('tablet overflow uses its 768px client viewport rather than a wider innerWidth', () => {
  const fixture = setup({ clientWidth: 768, innerWidth: 980 });
  fixture.update();
  assertFits(fixture, 768);
});

test('a 320px mobile viewport retains both gutters when layout overflows', () => {
  const fixture = setup({ clientWidth: 320, innerWidth: 980 });
  fixture.update();
  assertFits(fixture, 320);
});

test('a correctly measured mobile width also centers an overflowing max-content area', () => {
  const fixture = setup({ clientWidth: 390, innerWidth: 390 });
  fixture.update();
  assertFits(fixture, 390);
});

test('an unavailable document measurement falls back to the existing innerWidth', () => {
  const fixture = setup({ clientWidth: 0, innerWidth: 390 });
  fixture.update();
  assertFits(fixture, 390);
});

test('an invalid viewport measurement cannot install a non-finite or guessed transform', () => {
  const fixture = setup({ clientWidth: Number.NaN, innerWidth: 0 });
  fixture.update();
  assert.equal(fixture.values.size, 0);
});

test('resizing from mobile to desktop clears the horizontal overflow correction', () => {
  const fixture = setup({ clientWidth: 390, innerWidth: 786 });
  fixture.update();
  assertFits(fixture, 390);
  fixture.context.document.documentElement.clientWidth = 1280;
  fixture.context.window.innerWidth = 1280;
  fixture.update();
  assert.equal(Number(fixture.values.get('--screen-page-scale')), 1);
  assert.deepEqual(paperBounds(fixture, 1280), { left: 243, right: 1037 });
});

test('the explicit render build target keeps its own measured page width', () => {
  const fixture = setup({ clientWidth: 390, innerWidth: 786, pageWidth: 900, buildTarget: true });
  fixture.update();
  assertFits(fixture, 390);
});

test('the normal output path and missing paper do not acquire a screen transform', () => {
  for (const options of [{ screenFit: false }, { hasArea: false }, { hasPage: false }]) {
    const fixture = setup(options);
    fixture.update();
    assert.equal(fixture.values.size, 0);
  }
});

test('print still disables the complete screen transform without changing paper layout', () => {
  const printSection = html.slice(html.indexOf('@media print {'));
  assert.match(printSection, /body:not\(\.mode-pdf\) #print-area \{[^}]*transform:\s*none !important;/);
  assert.match(printSection, /\.page \{[^}]*height:\s*296\.5mm;/);
  assert.doesNotMatch(functionSource, /(?:innerHTML|textContent|appendChild|removeChild|createElement)/);
});

test('the existing narrow paper-review mode keeps its left origin and clears prior center offsets', () => {
  const fixture = setup({ clientWidth: 390, innerWidth: 786 });
  fixture.update();
  assertFits(fixture, 390);

  fixture.classes.add('archive2-paper-review');
  fixture.update();
  let bounds = paperBounds(fixture, 390);
  assert.equal(bounds.left, 0, 'entering the existing left-aligned review mode clears the previous offset');
  assert.ok(Math.abs(bounds.right - 374) < 1e-8);

  fixture.classes.delete('archive2-paper-review');
  fixture.update();
  assertFits(fixture, 390);

  fixture.classes.add('archive2-paper-review');
  fixture.context.document.documentElement.clientWidth = 1280;
  fixture.context.window.innerWidth = 1280;
  fixture.update();
  assert.deepEqual(paperBounds(fixture, 1280), { left: 243, right: 1037 }, 'desktop review returns to the existing centered rule');
});
