import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the production shell policy. Real Chromium additionally measures
// drawn glyph bounds against the visible toolbar, across all middle scenes.
const media = { matches: false }, APLab = {};
vm.runInNewContext(fs.readFileSync(new URL('../kit/apl-shell.js', import.meta.url), 'utf8'),
  { window: { APLab, matchMedia: () => media }, document: {} });
function insets(id, { narrow = false, tools = 40, status = 32, presenter = 0, chips = 0 } = {}) {
  media.matches = narrow;
  const lab = Object.create(APLab.Lab.prototype);
  lab.id = id;
  lab.ui = {
    tools: { offsetHeight: tools }, tr: { offsetHeight: status },
    presenter: { hidden: !presenter, offsetHeight: presenter },
    chips: { childElementCount: chips ? 1 : 0, offsetHeight: chips }
  };
  return JSON.parse(JSON.stringify(lab._stageInsets()));
}
test('every middle course reserves the actual wide toolbar height below figures', () => {
  for (const id of ['g7-spatial', 'g8-similarity', 'g9-circle']) {
    assert.equal(insets(id).bottom, 54);
    assert.equal(insets(id, { tools: 52 }).bottom, 66);
  }
});
test('presenter mode stacks the middle toolbar above the presenter safely', () => {
  assert.deepEqual(insets('g7-spatial', { presenter: 36, chips: 30 }),
    { top: 48, right: 16, bottom: 112 });
});
test('existing narrow status row and non-middle layout policies are preserved', () => {
  assert.deepEqual(insets('g7-spatial', { narrow: true, status: 80 }),
    { top: 0, right: 0, bottom: 74 });
  assert.equal(insets('h1-functions').bottom, 0);
  assert.equal(insets('h1-functions', { presenter: 36 }).bottom, 58);
});
