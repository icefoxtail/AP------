import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function loadPlanner(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const start = source.indexOf('function getExamLayoutType');
  const endMarker = relativePath.includes('wrong_print_engine')
    ? 'async function renderMeasuredExamPages'
    : 'async function renderExam';
  const end = source.indexOf(endMarker, start);
  assert.ok(start >= 0 && end > start, `${relativePath} should expose the shared 2up page planner`);
  assert.match(source, /\.subjective-2up-layout\s*\{/);
  assert.match(source, /\.subjective-2up-wide-layout\s*\{/);
  assert.match(source, /pageData\.layout === 'subj2-wide'/);
  assert.match(source, /function promoteOverflowingNormals/);
  assert.match(source, /pageData\.layout === 'subj2-pair'/);
  assert.match(source, /pageData\.sideItems\.forEach/);
  assert.doesNotMatch(source, /container\.style\.fontSize/,
    `${relativePath} should not shrink question or MathJax font sizes to repair overflow`);

  const context = {};
  vm.createContext(context);
  vm.runInContext(source.slice(start, end), context, { filename: relativePath });
  return context.buildExamPagePlan;
}

function item(id, layoutTag = 'grid') {
  return { id, q: { layoutTag, wide: false } };
}

function promotedItem(id) {
  return {
    ...item(id, 'subjective-2up'),
    effectiveLayout: 'subj2-wide',
    profile: { proxyHeight_raw: 900, proxyHeight_wide: 360, usablePageHeight: 900 }
  };
}

function promotedNormalItem(id) {
  return {
    ...item(id, 'grid'),
    effectiveLayout: 'subj2',
    profile: { proxyHeight_raw: 600, normalCellHeight: 450 }
  };
}

function measuredNormal(id, height = 180) {
  return { ...item(id), profile: { proxyHeight_raw: height } };
}

function pageIds(page) {
  return Array.from(page.sourceItems || [], value => value.id);
}

function planSignature(plan) {
  return Array.from(plan, page => `${page.layout}:${pageIds(page).join(',')}`);
}

const enginePaths = [
  'archive/engine.html',
  'archive/mixed_engine.html',
  'apmath/wrong_print_engine.html'
];
const planners = enginePaths.map(relativePath => [relativePath, loadPlanner(relativePath)]);

for (const [relativePath, buildExamPagePlan] of planners) {
  const onePlusTwo = buildExamPagePlan([
    item('special', 'subjective-2up'), item('normal-1'), item('normal-2')
  ], 4);
  assert.equal(onePlusTwo.length, 1, `${relativePath}: 1+2 should fit on one page`);
  assert.equal(onePlusTwo[0].layout, 'subj2-left');
  assert.equal(onePlusTwo[0].mainItem.id, 'special');
  assert.deepEqual(Array.from(onePlusTwo[0].sideItems, value => value.id), ['normal-1', 'normal-2']);

  const twoPlusOne = buildExamPagePlan([
    item('normal-1'), item('normal-2'), item('special', 'subjective-2up')
  ], 4);
  assert.equal(twoPlusOne.length, 1, `${relativePath}: 2+1 should fit on one page`);
  assert.equal(twoPlusOne[0].layout, 'subj2-right');
  assert.equal(twoPlusOne[0].mainItem.id, 'special');
  assert.deepEqual(Array.from(twoPlusOne[0].sideItems, value => value.id), ['normal-1', 'normal-2']);

  const paired = buildExamPagePlan([
    item('special-1', 'subjective-2up'), item('special-2', 'subjective-2up')
  ], 4);
  assert.equal(paired.length, 1, `${relativePath}: consecutive 2up questions should retain a two-column page`);
  assert.equal(paired[0].layout, 'subj2-pair');
  assert.equal(paired[0].leftItem.id, 'special-1');
  assert.equal(paired[0].rightItem.id, 'special-2');

  const normalTo2up = buildExamPagePlan([
    promotedNormalItem('promoted-normal'), measuredNormal('normal-1'), measuredNormal('normal-2')
  ], 4);
  assert.equal(normalTo2up.length, 1, `${relativePath}: an overflowing normal question should promote to 2up`);
  assert.equal(normalTo2up[0].layout, 'subj2-left');
  assert.equal(normalTo2up[0].mainItem.id, 'promoted-normal');
  assert.deepEqual(Array.from(normalTo2up[0].sideItems, value => value.id), ['normal-1', 'normal-2']);

  const promotedFirst = buildExamPagePlan([
    promotedItem('promoted'), measuredNormal('normal-1'), measuredNormal('normal-2')
  ], 4);
  assert.equal(promotedFirst.length, 1, `${relativePath}: an overflowing leading 2up should widen and keep fitting neighbors`);
  assert.equal(promotedFirst[0].layout, 'subj2-wide');
  assert.equal(promotedFirst[0].mainItem.id, 'promoted');
  assert.deepEqual(Array.from(promotedFirst[0].sideItems, value => value.id), ['normal-1', 'normal-2']);

  const promotedLast = buildExamPagePlan([
    measuredNormal('normal-1'), measuredNormal('normal-2'), promotedItem('promoted')
  ], 4);
  assert.equal(promotedLast.length, 1, `${relativePath}: an overflowing trailing 2up should widen below fitting neighbors`);
  assert.equal(promotedLast[0].layout, 'subj2-wide');
  assert.equal(promotedLast[0].companionsBefore, true);
  assert.deepEqual(pageIds(promotedLast[0]), ['normal-1', 'normal-2', 'promoted']);

  const sandwich = buildExamPagePlan([
    item('normal-before'), item('special', 'subjective-2up'), item('normal-after')
  ], 4);
  assert.equal(sandwich.length, 1, `${relativePath}: normal + 2up + normal should fit on one page`);
  assert.equal(sandwich[0].layout, 'subj2-right');
  assert.deepEqual(Array.from(sandwich[0].sideItems, value => value.id), ['normal-before', 'normal-after']);

  const completedNormalPage = buildExamPagePlan([
    item('normal-1'), item('normal-2'), item('normal-3'), item('normal-4'),
    item('special', 'subjective-2up'), item('normal-5'), item('normal-6')
  ], 4);
  assert.deepEqual(
    Array.from(completedNormalPage, pageIds),
    [['normal-1', 'normal-2', 'normal-3', 'normal-4'], ['special', 'normal-5', 'normal-6']],
    `${relativePath}: a completed four-normal page must stay intact before a new 2up page`
  );
  assert.equal(completedNormalPage[1].layout, 'subj2-left');

  const trailingSpecial = buildExamPagePlan([
    item('normal-1'), item('normal-2'), item('normal-3'), item('normal-4'),
    item('special', 'subjective-2up')
  ], 4);
  assert.deepEqual(Array.from(trailingSpecial, pageIds), [
    ['normal-1', 'normal-2', 'normal-3', 'normal-4'], ['special']
  ]);

  const normalQppTwo = buildExamPagePlan([
    item('n1'), item('n2'), item('n3'), item('n4'), item('n5')
  ], 2);
  assert.deepEqual(Array.from(normalQppTwo, page => pageIds(page).length), [2, 2, 1]);

  const specialBoundaries = buildExamPagePlan([
    item('normal'), item('wide', 'fullwidth'),
    item('four-1', 'subjective-4up'), item('four-2', 'subjective-4up')
  ], 4);
  assert.deepEqual(Array.from(specialBoundaries, page => page.blocks[0].type), ['normal', 'wide', 'subj4']);
  assert.deepEqual(pageIds(specialBoundaries[1]), ['wide']);
  assert.deepEqual(pageIds(specialBoundaries[2]), ['four-1', 'four-2']);

  for (let length = 1; length <= 8; length++) {
    for (let mask = 0; mask < (1 << length); mask++) {
      const source = Array.from({ length }, (_, index) =>
        item(`q${index + 1}`, mask & (1 << index) ? 'subjective-2up' : 'grid'));
      const plan = buildExamPagePlan(source, 4);
      assert.deepEqual(
        Array.from(plan.flatMap(pageIds)),
        source.map(value => value.id),
        `${relativePath}: planner must not reorder, duplicate, or omit questions for mask ${mask}`
      );
      for (const page of plan) {
        const specialCount = page.sourceItems.filter(value => value.q.layoutTag === 'subjective-2up').length;
        const normalCount = page.sourceItems.length - specialCount;
        assert(
          (specialCount === 0 && normalCount <= 4) ||
          (specialCount === 1 && normalCount <= 2) ||
          (specialCount === 2 && normalCount === 0),
          `${relativePath}: invalid slot combination for mask ${mask}`
        );
      }
    }
  }
}

for (let length = 1; length <= 8; length++) {
  for (let mask = 0; mask < (1 << length); mask++) {
    const source = Array.from({ length }, (_, index) =>
      item(`q${index + 1}`, mask & (1 << index) ? 'subjective-2up' : 'grid'));
    const signatures = planners.map(([, planner]) => planSignature(planner(source, 4)));
    assert.deepEqual(signatures[1], signatures[0], `mixed engine planner mismatch for mask ${mask}`);
    assert.deepEqual(signatures[2], signatures[0], `wrong-answer engine planner mismatch for mask ${mask}`);
  }
}

console.log('archive/wrong-answer subjective-2up balanced layout test passed');
