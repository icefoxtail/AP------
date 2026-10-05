const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const source = fs.readFileSync(path.join(__dirname, '../archive/layout-materializer.js'), 'utf8');
const start = source.indexOf('    function measuredSolutionCapacity(document, probePage) {');
const end = source.indexOf('\n    async function exam(', start);
assert.notEqual(start, -1, 'solution capacity measurement helper exists');
assert.notEqual(end, -1, 'solution capacity helper ends before exam materialization');
const context = {};
vm.runInNewContext(source.slice(start, end) + '\nthis.measureSolutionCapacity = measuredSolutionCapacity;', context);

test('solution layout uses its measured offscreen A4 probe when available', () => {
  assert.equal(context.measureSolutionCapacity({ querySelector() { assert.fail('active page fallback should not run'); } }, { body: { clientHeight: 217 } }), 217);
});

test('screen-fit zero probe falls back only to the existing measured A4 page body', () => {
  assert.equal(context.measureSolutionCapacity({ querySelector(selector) {
    assert.equal(selector, '#print-area .page-body');
    return { clientHeight: 217 };
  } }, { body: { clientHeight: 0 } }), 217);
  assert.throws(() => context.measureSolutionCapacity({ querySelector() { return { clientHeight: 0 }; } }, { body: { clientHeight: 0 } }), {
    message: 'INVALID_MEASURED_SOLUTION_HEIGHT',
  });
});
