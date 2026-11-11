const test = require('node:test');
const assert = require('node:assert/strict');
const helper = import('../tools/ci/collect-reviewed-consumer-refusals.mjs');

const paths = ['inbox/a.json', 'inbox/b.json'];
const report = () => ({ status: 'FAIL', counts: { changed: 2, checked: 2, passed: 1 },
  exams: [{ file: paths[0], exam: 'a', changed: 1, checked: 1, passed: 1 }, { file: paths[1], exam: 'b', changed: 1, checked: 1, passed: 0 }],
  failures: [{ exam: 'b', qid: 2, reason: 'VALUE_MISMATCH', detail: 'request 2 != consumer 3' }] });

test('only the exact failed request is returned, retaining real failure details', async () => {
  const { collectConsumerRefusals } = await helper;
  assert.deepEqual(collectConsumerRefusals(report(), paths), [{ request: paths[1], error: 'VALUE_MISMATCH Q2: request 2 != consumer 3' }]);
});

test('global, ambiguous, incomplete, unknown and inconsistent results cannot become per-request rejections', async () => {
  const { collectConsumerRefusals } = await helper;
  const global = report(); global.failures[0] = { exam: 'b', reason: 'CONSUMER_LOAD_FAILED' };
  assert.throws(() => collectConsumerRefusals(global, paths), /Non-isolatable/);
  const ambiguous = report(); ambiguous.exams[0].exam = 'b';
  assert.throws(() => collectConsumerRefusals(ambiguous, paths), /Non-isolatable/);
  const incomplete = report(); incomplete.exams.pop();
  assert.throws(() => collectConsumerRefusals(incomplete, paths), /Incomplete/);
  const unknown = report(); unknown.failures[0].reason = 'UNKNOWN_CHECKER_FAILURE';
  assert.throws(() => collectConsumerRefusals(unknown, paths), /Non-isolatable/);
  const inconsistent = report(); inconsistent.status = 'PASS';
  assert.throws(() => collectConsumerRefusals(inconsistent, paths), /Inconsistent/);
  const unchecked = report(); unchecked.exams[0].checked = 0; unchecked.exams[0].passed = 0;
  assert.throws(() => collectConsumerRefusals(unchecked, paths), /Incomplete checks/);
});
