const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { pathToFileURL } = require('node:url');

// 2026-11-19: A4 shows a solution figure at 60% of the column, so a wide canvas (> about 540 px) cannot reach readable labels at that size.
// The engine then binds it at solutionImageScale (% of the column) and the publisher writes the field. These checks need no browser:
// the candidate scales, the phone minimum font, the policy derivation, and the publisher's handling of the field.
const repo = path.join(__dirname, '..');
const capture = () => import(pathToFileURL(path.join(repo, 'archive/tools/geometry-equation/production/construction-archive-capture-v1.mjs')).href);
const envelope = () => import(pathToFileURL(path.join(repo, 'archive/tools/geometry-equation/production/display-envelope.mjs')).href);

const column = { solutionMetaContentWidth: 298 };

test('candidate scales: defaults stay out of it, wide canvases get a step that fits the column', async () => {
  const { solutionImageScaleCandidates } = await capture();
  const at = width => solutionImageScaleCandidates({ intrinsicSvg: { width }, observation: column });
  assert.deepEqual(at(610), [90]);
  for (const width of [540, 610, 640, 720, 776]) {
    const list = at(width);
    assert.ok(list.length > 0, `a ${width} px canvas has a candidate`);
    for (const scale of list) {
      assert.ok(scale >= 30 && scale <= 100 && scale % 5 === 0, `${width}: ${scale} is a step in range`);
      assert.ok(316.2 * scale / 100 <= 298.5, `${width}: ${scale}% never asks for more than the column shows`);
      assert.ok(11.5 * width / (316.2 * scale / 100) <= 32, `${width}: ${scale}% can reach the font floor within the base font cap`);
    }
  }
  assert.deepEqual(at(900), [], 'a canvas no column can show readably gets no scale (the refusal stays)');
});

test('phone minimum base font grows with the canvas and stops at the policy cap', async () => {
  const { phoneMinimumBaseFontPx } = await capture();
  assert.equal(phoneMinimumBaseFontPx(384), 20);
  assert.ok(phoneMinimumBaseFontPx(610) > 24 && phoneMinimumBaseFontPx(610) < 25);
  assert.equal(phoneMinimumBaseFontPx(900), 32);
});

test('scaled display reaches the floor where the default 60% display only records displayTextBelow11px (the refusal was released 2026-11-23)', async () => {
  const { requestedProfileTypographyPolicy } = await envelope();
  const { phoneMinimumBaseFontPx } = await capture();
  const intrinsic = { width: 610, height: 320 };
  const profile = (width, sizeClass) => ({ status: 'PASS', sizeClass, imageRect: { x: 0, y: 0, width, height: width * 320 / 610 }, naturalWidth: 610, naturalHeight: 320 });
  const observation = width => ({ status: 'PASS', synthetic: false, runtime: 'playwright-chromium', profiles: ['small', 'medium', 'large', 'full'].map(sizeClass => profile(width, sizeClass)) });
  // before 2026-11-23 the default (60%) display was refused with REQUESTED_PROFILE_FONT_SCALE; now the base font stays at the cap (32) and the policy records displayTextBelow11px
  const refusedBefore = requestedProfileTypographyPolicy({ requestedSizeClass: 'medium', intrinsicSvg: intrinsic, observation: observation(189.7) });
  assert.equal(refusedBefore.baseFontPx, 32);
  assert.equal(refusedBefore.displayTextBelow11px, true);
  assert.ok(refusedBefore.displayedFontPx < 11.25);
  const policy = requestedProfileTypographyPolicy({ requestedSizeClass: 'medium', intrinsicSvg: intrinsic, observation: observation(284.6), minimumBaseFontPx: phoneMinimumBaseFontPx(610) });
  assert.ok(policy.baseFontPx >= phoneMinimumBaseFontPx(610) && policy.baseFontPx <= 32);
  assert.ok(policy.baseFontPx * policy.displayScale >= 11.25 - 1e-6, 'A4 labels reach the floor');
  assert.equal('displayTextBelow11px' in policy, false);
});

// 2026-11-23 (owner: the displayed font floor is released, never a refusal; the owner wants figures not rejected, not smaller):
// the scale search stays, triggered by policy.displayTextBelow11px instead of a refusal.
test('scale search: the first candidate whose labels reach the floor is taken, else the largest; never a refusal', async () => {
  const { selectSolutionImageScale, solutionImageScaleCandidatesWithMaximum } = await capture();
  const below = (scale, displayScale) => ({ displayScale, baseFontPx: 32, displayTextBelow11px: true, scale });
  const ok = (scale, displayScale) => ({ displayScale, baseFontPx: 28, scale });
  const defaultPolicy = below(80, 0.6);
  // 1) the first satisfying candidate wins; later candidates are not even measured
  const tried = [];
  const first = await selectSolutionImageScale({ defaultPolicy, scales: [85, 90, 95], derivePolicy: async scale => { tried.push(scale); return scale >= 90 ? ok(scale, scale / 100) : below(scale, scale / 100 * 0.6); } });
  assert.equal(first.scale, 90); assert.equal(first.policy.displayTextBelow11px, undefined); assert.deepEqual(tried, [85, 90]);
  // 2) no candidate reaches the floor: the largest one is used and the information flag stays
  const none = await selectSolutionImageScale({ defaultPolicy, scales: [85, 90, 95], derivePolicy: async scale => below(scale, scale / 100 * 0.7) });
  assert.equal(none.scale, 95); assert.equal(none.policy.displayTextBelow11px, true); assert.equal(none.refusal, null);
  // 3) a candidate that is not larger than the default never replaces it (no smaller display)
  const smaller = await selectSolutionImageScale({ defaultPolicy, scales: [70], derivePolicy: async scale => below(scale, 0.4) });
  assert.equal(smaller.policy, defaultPolicy); assert.equal(smaller.scale, undefined);
  // 4) candidate derivation failures are skipped; with a default the default is kept, without one the policy is null and the refusal is reported
  const boom = new Error('X');
  const kept = await selectSolutionImageScale({ defaultPolicy, scales: [85], derivePolicy: async () => { throw boom; } });
  assert.equal(kept.policy, defaultPolicy); assert.equal(kept.refusal, boom);
  const lost = await selectSolutionImageScale({ defaultPolicy: null, scales: [85], derivePolicy: async () => { throw boom; } });
  assert.equal(lost.policy, null); assert.equal(lost.refusal, boom);
  // a non-domain error (a defect) still propagates
  await assert.rejects(selectSolutionImageScale({ defaultPolicy, scales: [85], derivePolicy: async () => { throw new TypeError('bug'); }, isDomainCode: e => e.constructor === Error }), TypeError);
  // a figure too wide for every listed candidate still gets the largest whole percent the column allows
  const wide = solutionImageScaleCandidatesWithMaximum({ intrinsicSvg: { width: 1168, height: 400 }, observation: column });
  assert.ok(wide.length > 0 && wide.at(-1) === 94 && wide.every((v, i) => i === 0 || v > wide[i - 1]), JSON.stringify(wide));
});

function publishFixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'scale-publish-'));
  const exam = path.join(dir, 'archive/exams/original/t.js');
  fs.mkdirSync(path.dirname(exam), { recursive: true });
  fs.writeFileSync(exam, 'window.questionBank=[\n  {\n    "id": 1,\n    "solution": "x"\n  },\n  {\n    "id": 2,\n    "solution": "y"\n  }\n];\n');
  const svg = path.join(dir, 'f.svg');
  fs.writeFileSync(svg, '<svg xmlns="http://www.w3.org/2000/svg" width="610" height="320"/>');
  return { dir, exam, svg };
}
function runPublish(dir, rows) {
  const rowsFile = path.join(dir, 'rows.json');
  fs.writeFileSync(rowsFile, JSON.stringify(rows));
  const script = path.join(repo, 'archive/tools/geometry-equation/ops/svg-m1/publish.mjs');
  return spawnSync(process.execPath, [script, rowsFile, dir, '--apply'], { cwd: dir, env: { ...process.env, PUBLISH_REPORT: path.join(dir, 'report.json') }, encoding: 'utf8' });
}
const rowFor = (x, extra) => ({ src: 'archive/exams/original/t.js', ord: 1, svg: x.svg, key: 'k', fam: 'f', alt: '해설 그림: 도형', caption: '풀이', size: 'medium', ...extra });
const bankOf = file => { const w = {}; new Function('window', fs.readFileSync(file, 'utf8'))(w); return w.questionBank; };

test('publisher writes solutionImageScale beside solutionImageSize and rejects out-of-range values', () => {
  const x = publishFixture();
  try {
    const bad = runPublish(x.dir, [rowFor(x, { scale: 120 })]);
    assert.equal(bad.status, 0, bad.stderr);
    assert.match(bad.stdout, /BAD_SOLUTION_IMAGE_SCALE/);
    assert.equal(bankOf(x.exam)[0].solutionImage, undefined, 'a bad scale publishes nothing');
    const ok = runPublish(x.dir, [rowFor(x, { scale: 85 })]);
    assert.equal(ok.status, 0, ok.stderr);
    const q = bankOf(x.exam);
    assert.equal(q[0].solutionImageScale, 85);
    assert.equal(q[0].solutionImageSize, 'medium');
    assert.equal(q[1].solutionImageScale, undefined, 'other questions are untouched');
  } finally { fs.rmSync(x.dir, { recursive: true, force: true }); }
});

test('publisher without a scale writes exactly the four fields as before', () => {
  const x = publishFixture();
  try {
    const ok = runPublish(x.dir, [rowFor(x, {})]);
    assert.equal(ok.status, 0, ok.stderr);
    const q = bankOf(x.exam)[0];
    assert.equal(Object.hasOwn(q, 'solutionImageScale'), false);
    assert.deepEqual(Object.keys(q).filter(k => k.startsWith('solutionImage')).sort(), ['solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize']);
  } finally { fs.rmSync(x.dir, { recursive: true, force: true }); }
});
