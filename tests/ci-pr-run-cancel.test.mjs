// Runner demand: a validating run that a newer commit has superseded is cancelled - a pull request's older run,
// and (since 2026-11-24) a branch push's older run, so only the newest main commit keeps a verdict. Forty merges
// in one day queued 100+ runs and the student release waited 40-50 minutes for a runner.
// Registration writers, Pages and Worker deploys must never be cancelled: a running writer is never cut off half way.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const workflowDir = path.join(repo, '.github', 'workflows');
const read = name => fs.readFileSync(path.join(workflowDir, name), 'utf8').replace(/\r\n/g, '\n');

// workflow file -> concurrency group prefix. Pull request events share one group per PR number and are
// cancelled by a newer push; every other event gets a group of its own run id, so it is never replaced.
const PR_ONLY_CANCEL = new Map([
  ['ci.yml', 'ci'],
  ['archive2-runtime-guard.yml', 'archive2-runtime-guard'],
  ['archive2-save-roundtrip.yml', 'archive2-save-roundtrip'],
  ['problem-bank-meta.yml', 'problem-bank-meta'],
  ['archive-output-performance.yml', 'archive-output-performance'],
  ['generated-consumer-browser-smoke.yml', 'generated-consumer-browser-smoke'],
  ['archive-stage-validator.yml', 'archive-stage-validator'],
  ['meta-resolver-bridge.yml', 'meta-resolver-bridge'],
  ['svg-engine-tests.yml', 'svg-engine-tests'],
]);

// Workflows that write to main, register data or deploy. They must never be cancelled.
const NEVER_CANCELLED = [
  'archive-main-auto-meta.yml', 'archive-pages-release.yml', 'archive-reviewed-apply.yml',
  'archive-reviewed-exam-meta-register.yml', 'archive-reviewed-source-candidate.yml', 'r2-archive-assets-copy.yml',
  'question-json-sync.yml', 'archive-progress-observer.yml', 'apms-worker-deploy.yml',
];

const topLevelConcurrency = text => {
  const match = /\nconcurrency:\n((?:  .*\n)+)/.exec(text);
  return match ? match[1] : null;
};

test('a pull request run is replaced by a newer push to the same PR, in every PR-validating workflow listed here', () => {
  for (const [file, prefix] of PR_ONLY_CANCEL) {
    const block = topLevelConcurrency(read(file));
    assert.ok(block, `${file} has a top-level concurrency block`);
    const group = /^  group: (.+)$/m.exec(block)?.[1];
    assert.equal(group,
      `\${{ github.event_name == 'pull_request' && format('${prefix}-pr-{0}', github.event.pull_request.number) || github.event_name == 'push' && format('${prefix}-push-{0}', github.ref) || format('${prefix}-{0}-{1}', github.event_name, github.run_id) }}`,
      `${file}: one group per PR number, one group per pushed branch, one group per run for every other event`);
    assert.match(block, /^  cancel-in-progress: \$\{\{ github\.event_name == 'pull_request' \|\| github\.event_name == 'push' \}\}$/m,
      `${file}: pull_request and push events cancel their own older run; manual runs never`);
    assert.doesNotMatch(block, /cancel-in-progress: true/, `${file}: never an unconditional cancel`);
  }
});

test('the group expression separates PRs from each other, groups pushes by branch, and never groups two manual runs', () => {
  // Evaluate the shared expression shape for representative events.
  const groupFor = (prefix, { event, pr, runId, ref = 'refs/heads/main' }) =>
    event === 'pull_request' ? `${prefix}-pr-${pr}` : event === 'push' ? `${prefix}-push-${ref}` : `${prefix}-${event}-${runId}`;
  for (const prefix of PR_ONLY_CANCEL.values()) {
    assert.equal(groupFor(prefix, { event: 'pull_request', pr: 7, runId: 1 }), groupFor(prefix, { event: 'pull_request', pr: 7, runId: 2 }));
    assert.notEqual(groupFor(prefix, { event: 'pull_request', pr: 7, runId: 1 }), groupFor(prefix, { event: 'pull_request', pr: 8, runId: 1 }));
    assert.equal(groupFor(prefix, { event: 'push', runId: 1 }), groupFor(prefix, { event: 'push', runId: 2 }));
    assert.notEqual(groupFor(prefix, { event: 'push', runId: 1 }), groupFor(prefix, { event: 'push', runId: 1, ref: 'refs/heads/other' }));
    assert.notEqual(groupFor(prefix, { event: 'workflow_dispatch', runId: 1 }), groupFor(prefix, { event: 'workflow_dispatch', runId: 2 }));
  }
});

test('registration, Pages, Worker deploy, sync and observer runs are never cancelled', () => {
  for (const file of NEVER_CANCELLED) {
    const text = read(file);
    assert.doesNotMatch(text, /cancel-in-progress:\s*true/, `${file} must not cancel a run`);
    assert.doesNotMatch(text, /cancel-in-progress:\s*\$\{\{/, `${file} must not compute a cancel`);
  }
});

test('a main push is cancelled only by the listed validating workflows (newest commit only), never by a writer or deploy', () => {
  const offenders = [];
  for (const file of fs.readdirSync(workflowDir).filter(name => name.endsWith('.yml'))) {
    const text = read(file);
    const on = text.slice(0, text.indexOf('\njobs:\n'));
    const pushesMain = /\n  push:\n(?:    .*\n)*?    branches: \[[^\]]*\bmain\b/.test(on) || /\n  push:\n    branches:\n(?:      - .*\n)*?      - ['"]?main['"]?\n/.test(on);
    if (!pushesMain) continue;
    const block = topLevelConcurrency(text);
    if (!block) continue;
    const cancel = /^  cancel-in-progress: (.+)$/m.exec(block)?.[1]?.trim();
    if (cancel === 'true') offenders.push(`${file}: cancel-in-progress: true applies to a main push`);
    else if (cancel?.startsWith('${{') && cancel.includes("'push'") && !PR_ONLY_CANCEL.has(file)) offenders.push(`${file}: ${cancel}`);
    else if (cancel?.startsWith('${{') && !cancel.includes("github.event_name == 'pull_request'")) offenders.push(`${file}: ${cancel}`);
  }
  // An existing browser smoke that predates this rule cancels a main push when a newer push to main arrives. It is
  // listed explicitly (reported, not changed by the runner-demand PR); a new entry must be a deliberate decision.
  const known = new Set([
    'student-portal-ux-browser.yml: cancel-in-progress: true applies to a main push',
  ]);
  // The detector must see each known case, otherwise the check above proves nothing; fixing one means removing it here.
  assert.deepEqual([...known].filter(entry => !offenders.includes(entry)), [], 'a known entry no longer matches: remove it from the list');
  const unexpected = offenders.filter(entry => !known.has(entry));
  assert.deepEqual(unexpected, [], `a main push run would be cancelled by a newer push: ${unexpected.join('; ')}`);
});
