'use strict';
// Synthetic checkout-provenance guards only. No browser, source bank or approval is executed.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { checkoutEvidence } = require('../tools/check-m3s2-q16-layout-browser.cjs');
const HEAD = '1'.repeat(40), EVENT = '2'.repeat(40);
const REPOSITORY = 'icefoxtail/AP------';
const REVIEW_REF = 'refs/heads/ops/middle-protected9-current-renderer-26fc-20261117';
function fixture(t, eventName = 'push') {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'q16-current-renderer-provenance-'));
  const eventPath = path.join(directory, 'event.json');
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const env = {
    ARCHIVE_M3S2_LAYOUT_UI_EXPECTED_SHA: HEAD,
    GITHUB_ACTIONS: 'true', GITHUB_EVENT_NAME: eventName,
    GITHUB_REPOSITORY: REPOSITORY, GITHUB_RUN_ID: '1001', GITHUB_RUN_ATTEMPT: '1',
    GITHUB_JOB: 'm3s2-layout-one', GITHUB_EVENT_PATH: eventPath,
    GITHUB_SHA: eventName === 'push' ? HEAD : EVENT,
    GITHUB_REF: eventName === 'push' ? REVIEW_REF : 'refs/pull/2330/merge',
  };
  const repo = { full_name: REPOSITORY };
  const event = eventName === 'push'
    ? { ref: REVIEW_REF, after: HEAD, repository: repo }
    : { pull_request: { head: { sha: HEAD, repo } }, repository: repo };
  return { env, event, call(actual = HEAD) {
    fs.writeFileSync(eventPath, JSON.stringify(event) + '\n');
    return checkoutEvidence(actual, env);
  } };
}
test('the exact review push records its real event with equal checkout, expected, after and GitHub SHAs', t => {
  const f = fixture(t);
  const result = f.call();
  assert.equal(result.eventName, 'push');
  assert.equal(result.headCommit, HEAD);
  assert.equal(result.actualCheckoutCommit, HEAD);
  assert.equal(result.expectedCheckoutCommit, HEAD);
  assert.equal(result.githubEventCommit, HEAD);
  assert.equal(result.executionOwner, 'GITHUB_ACTIONS_SUPPORTED_CHROME');
  assert.equal(result.repository, REPOSITORY);
  assert.equal(result.runId, '1001');
  assert.equal(result.job, 'm3s2-layout-one');
});
test('the pre-existing PR contract still distinguishes the actual head from the merge event commit', t => {
  const f = fixture(t, 'pull_request');
  const result = f.call();
  assert.equal(result.eventName, 'pull_request');
  assert.equal(result.headCommit, HEAD);
  assert.equal(result.actualCheckoutCommit, HEAD);
  assert.equal(result.githubEventCommit, EVENT);
  assert.notEqual(result.githubEventCommit, result.actualCheckoutCommit);
});
for (const [name, mutate, expected] of [
  ['another environment branch', f => { f.env.GITHUB_REF = 'refs/heads/main'; }, /UI_ACTIONS_REVIEW_BRANCH/],
  ['another payload branch', f => { f.event.ref = 'refs/heads/main'; }, /UI_ACTIONS_PUSH_REF_MISMATCH/],
  ['a GitHub event SHA different from the checkout', f => { f.env.GITHUB_SHA = '3'.repeat(40); }, /UI_ACTIONS_PUSH_HEAD_MISMATCH/],
  ['an after SHA different from the checkout', f => { f.event.after = '4'.repeat(40); }, /UI_ACTIONS_PUSH_AFTER_MISMATCH/],
  ['another environment repository', f => { f.env.GITHUB_REPOSITORY = 'example/other'; }, /UI_ACTIONS_REPOSITORY/],
  ['another payload repository', f => { f.event.repository.full_name = 'example/other'; }, /UI_ACTIONS_EVENT_REPOSITORY/],
  ['an unapproved event', f => { f.env.GITHUB_EVENT_NAME = 'workflow_dispatch'; }, /UI_ACTIONS_EVENT_REQUIRED/],
  ['an expected checkout different from HEAD', f => { f.env.ARCHIVE_M3S2_LAYOUT_UI_EXPECTED_SHA = '5'.repeat(40); }, /UI_CHECKOUT_MISMATCH/],
  ['missing run provenance', f => { delete f.env.GITHUB_RUN_ID; }, /UI_ACTIONS_RUN_REQUIRED/],
]) test('review-push provenance rejects ' + name, t => {
  const f = fixture(t);
  mutate(f);
  assert.throws(() => f.call(), expected);
});
test('the original PR head and repository refusals remain mandatory', t => {
  const wrongHead = fixture(t, 'pull_request');
  wrongHead.event.pull_request.head.sha = '6'.repeat(40);
  assert.throws(() => wrongHead.call(), /UI_ACTIONS_HEAD_MISMATCH/);
  const wrongRepo = fixture(t, 'pull_request');
  wrongRepo.event.pull_request.head.repo = { full_name: 'example/other' };
  assert.throws(() => wrongRepo.call(), /UI_ACTIONS_SAME_REPOSITORY/);
});
test('existing local provenance stays separate and cannot inherit GitHub event fields', () => {
  const env = { ARCHIVE_M3S2_LAYOUT_UI_EXPECTED_SHA: HEAD };
  assert.deepEqual(checkoutEvidence(HEAD, env), {
    expectedCheckoutCommit: HEAD, actualCheckoutCommit: HEAD,
    executionOwner: 'LOCAL_CHROMIUM', githubEventCommit: null,
  });
  assert.throws(() => checkoutEvidence(HEAD, { ...env, GITHUB_SHA: HEAD }), /UI_LOCAL_EXECUTION_NOT_ACTIONS/);
});
