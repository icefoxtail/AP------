import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const workflow = name => fs.readFileSync(path.join(root, '.github/workflows', name), 'utf8');
const writer = workflow('archive-main-auto-meta.yml');
const pages = workflow('archive-pages-release.yml');
const sync = workflow('archive-registration-sync.yml');
const compatibility = workflow('archive-reviewed-exam-meta-register.yml');
const legacy = workflow('archive-reviewed-apply.yml');

// Read only the small YAML blocks under test; execution below uses the workflow's actual shell.
function job(text, id) {
  const lines = text.slice(text.indexOf('\njobs:\n') + 7).split('\n');
  const start = lines.indexOf(`  ${id}:`);
  assert.notEqual(start, -1, `missing job ${id}`);
  let end = start + 1;
  while (end < lines.length && !/^  [\w-]+:/.test(lines[end])) end++;
  return lines.slice(start, end).join('\n');
}
function step(text, selector) {
  const blocks = text.split(/(?=^      - )/m).filter(block => /^      - /m.test(block));
  const found = blocks.filter(block => selector.test(block));
  assert.equal(found.length, 1, `expected one step matching ${selector}`);
  return found[0];
}
function shell(block) {
  const lines = block.split('\n');
  const start = lines.findIndex(line => /^        run: \|$/.test(line));
  assert.notEqual(start, -1, 'expected a literal shell block');
  const result = [];
  for (const line of lines.slice(start + 1)) {
    if (line.trim() && !line.startsWith('          ')) break;
    result.push(line.slice(10));
  }
  return result.join('\n');
}
function fixture(t) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-writer-workflow-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  const put = (rel, content, mode) => {
    const file = path.join(dir, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content, mode ? { mode } : undefined);
    return file;
  };
  const read = rel => fs.existsSync(path.join(dir, rel)) ? fs.readFileSync(path.join(dir, rel), 'utf8') : '';
  const env = { ...process.env, PATH: `${path.join(dir, 'bin')}:${process.env.PATH}`,
    GITHUB_OUTPUT: path.join(dir, 'output'), GITHUB_STEP_SUMMARY: path.join(dir, 'summary'),
    WRITER_WORK_DIR: path.join(dir, 'writer'), COMMAND_TRACE: path.join(dir, 'command-trace') };
  const run = (script, extra = {}) => spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', script],
    { cwd: dir, encoding: 'utf8', env: { ...env, ...extra } });
  return { dir, put, read, env, run };
}
const git = (dir, ...args) => execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

test('only the serialized main registration job persists shared outputs, using one retryable transaction', () => {
  const register = job(writer, 'register');
  assert.match(register, /if: github\.event_name != 'pull_request' && github\.ref == 'refs\/heads\/main'/);
  assert.match(register, /permissions:\n      contents: write\n      actions: write/);
  assert.match(register, /group: archive-reviewed-exam-meta-register-main\n      cancel-in-progress: false/);
  assert.equal((register.match(/node tools\/ci\/git-push-derived-with-retry\.mjs/g) || []).length, 1);
  assert.match(register, /--paths-file "\$WRITER_WORK_DIR\/commit\.paths"/);
  assert.match(register, /--regenerate 'node tools\/ci\/archive-registration-writer\.mjs --work-dir "\$WRITER_WORK_DIR"'/);
  assert.match(register, /--remote origin --branch main --max-attempts 3/);
  assert.doesNotMatch(register, /--force|git\s+(?:commit|push)\b/);
  assert.match(step(register, /^        id: persist$/m), /if: steps\.prepare\.outputs\.safe_to_persist == 'true'/);
  for (const [name, text] of [['Pages', pages], ['PR preview', sync], ['compatibility recovery', compatibility]]) {
    assert.doesNotMatch(text, /contents: write|git-push-derived-with-retry|git\s+(?:commit|push)\b/, `${name} has no shared Git writer`);
  }
  assert.doesNotMatch(compatibility, /actions\/checkout|reviewed-meta-register-pass|archive-pages-release\.yml/);
  assert.equal((compatibility.match(/gh workflow run archive-main-auto-meta\.yml/g) || []).length, 1);
});

test('PR validation jobs do not retain checkout credentials or inherit the main writer permission', () => {
  assert.match(writer, /^permissions:\n  contents: read\njobs:/m);
  const pr = job(writer, 'test');
  assert.match(pr, /if: github\.event_name == 'pull_request'/);
  for (const [name, text] of [['writer fixtures', pr], ['registration preview', sync],
    ['QID9 validation', workflow('auto-register-approved-qid9.yml')]]) {
    assert.match(text, /persist-credentials: false/, name);
    assert.doesNotMatch(text, /(?:contents|actions|id-token|pages|pull-requests): write|(?:GH_TOKEN|GITHUB_TOKEN):|secrets\.|git\s+(?:commit|push)\b|gh workflow run/, name);
  }
  assert.match(sync, /^permissions:\n  contents: read/m);
});

test('the publication handoff consumes only the push helper registered SHA and has one dispatch', () => {
  const register = job(writer, 'register');
  const bound = step(register, /^        id: registered$/m);
  const dispatch = step(register, /name: Dispatch the exact registered snapshot/);
  for (const block of [bound, dispatch]) {
    assert.match(block, /REGISTERED_MAIN_SHA: \$\{\{ steps\.persist\.outputs\.registered_sha \}\}/);
    assert.doesNotMatch(block, /outputs\.main_sha|ref: main|rev-parse (?:origin\/main|main)|git pull|git fetch/);
  }
  assert.match(bound, /if: steps\.persist\.outcome == 'success'/);
  assert.match(dispatch, /if: steps\.registered\.outputs\.publishable == 'true'/);
  assert.match(dispatch, /steps\.persist\.outputs\.result == 'PUSHED' \|\| github\.event_name != 'schedule'/,
    'unchanged periodic registration does not dispatch the same package again');
  assert.equal((register.match(/gh workflow run archive-pages-release\.yml/g) || []).length, 1);
  assert.doesNotMatch(sync + compatibility, /gh workflow run archive-pages-release\.yml/);
});

test('actual binding shell checks the registered commit even when main has advanced', t => {
  const f = fixture(t);
  git(f.dir, 'init', '-q', '-b', 'main');
  git(f.dir, 'config', 'user.name', 'Workflow fixture');
  git(f.dir, 'config', 'user.email', 'workflow-fixture@example.invalid');
  git(f.dir, 'config', 'commit.gpgsign', 'false');
  f.put('tracked.txt', 'registered\n');
  git(f.dir, 'add', 'tracked.txt'); git(f.dir, 'commit', '-qm', 'registered');
  const registered = git(f.dir, 'rev-parse', 'HEAD');
  f.put('tracked.txt', 'later unrelated main\n');
  git(f.dir, 'commit', '-qam', 'main moved');
  const newerMain = git(f.dir, 'rev-parse', 'HEAD');
  git(f.dir, 'update-ref', 'refs/remotes/origin/main', newerMain);
  f.put('bin/node', '#!/usr/bin/env bash\nset -e\nprintf "%s\\n" "$@" > "$COMMAND_TRACE"\ngit rev-parse HEAD > checked-sha\nexit "${CHECK_EXIT:-0}"\n', 0o755);
  const command = shell(step(job(writer, 'register'), /^        id: registered$/m));
  const result = f.run(command, { REGISTERED_MAIN_SHA: registered });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(git(f.dir, 'rev-parse', 'HEAD'), registered);
  assert.equal(git(f.dir, 'rev-parse', 'origin/main'), newerMain);
  assert.equal(f.read('checked-sha').trim(), registered, 'the unchanged-tree verifier sees the exact committed output');
  assert.deepEqual(f.read('command-trace').trim().split('\n'),
    ['tools/ci/archive-registration-writer.mjs', '--check', '--work-dir', `${f.env.WRITER_WORK_DIR}/persisted`]);
  assert.equal(f.read('summary'), `registered_main_sha=${registered}\n`);
  f.put('summary', '');
  const failed = f.run(command, { REGISTERED_MAIN_SHA: registered, CHECK_EXIT: '7' });
  assert.equal(failed.status, 7, 'a failed persisted verification is a failed job step');
  assert.equal(f.read('summary'), '', 'a failed check emits no registration completion claim');
});

test('actual dispatch shell sends one exact SHA and refuses malformed refs before calling GitHub', t => {
  const f = fixture(t);
  f.put('bin/gh', '#!/usr/bin/env bash\nprintf "%s\\n" "$@" >> "$COMMAND_TRACE"\n', 0o755);
  const command = shell(step(job(writer, 'register'), /name: Dispatch the exact registered snapshot/));
  const sha = '2'.repeat(40);
  const result = f.run(command, { REGISTERED_MAIN_SHA: sha });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(f.read('command-trace').trim().split('\n'),
    ['workflow', 'run', 'archive-pages-release.yml', '--ref', 'main', '-f', `registered_main_sha=${sha}`]);
  for (const invalid of ['', 'main', 'refs/heads/main', `${sha}0`]) {
    f.put('command-trace', '');
    const rejected = f.run(command, { REGISTERED_MAIN_SHA: invalid });
    assert.notEqual(rejected.status, 0, invalid || 'empty SHA');
    assert.equal(f.read('command-trace'), '', 'no unbound publication request was sent');
  }
});

function applyFixture(t, targetRef, count = 1) {
  const f = fixture(t);
  // Packet validation itself remains covered by archive-reviewed-apply-bridge.test.mjs.
  // This boundary fixture supplies a successful inspection so the *workflow* main guard must act.
  f.put('archive/tools/meta-foundation/archive-reviewed-apply-staging.mjs',
    `console.log(JSON.stringify(${JSON.stringify({ targetRef, targetBaseSha: '3'.repeat(40), applyId: 'sealed-recovery-fixture' })}));\n`);
  fs.mkdirSync(path.join(f.dir, '.archive-apply/inbox'), { recursive: true });
  for (let i = 0; i < count; i++) f.put(`.archive-apply/inbox/packet-${i}.json`, '{}\n');
  const command = shell(step(legacy, /^        id: packet$/m)) + '\nprintf "reached\\n" > later-write-stage\n';
  return { ...f, result: f.run(command) };
}

test('actual legacy guard rejects main before any write-stage output and preserves non-main recovery routing', t => {
  const main = applyFixture(t, 'main');
  assert.equal(main.result.status, 1);
  assert.match(main.result.stderr, /LEGACY_MAIN_WRITER_RETIRED/);
  assert.equal(main.read('output'), '', 'no main target is exposed to later steps');
  assert.equal(main.read('later-write-stage'), '');
  const branch = 'codex/meta-foundation/middle1';
  const recovery = applyFixture(t, branch);
  assert.equal(recovery.result.status, 0, recovery.result.stderr);
  assert.match(recovery.read('output'), new RegExp(`^target_ref=${branch}$`, 'm'));
  assert.equal(recovery.read('later-write-stage'), 'reached\n');
  assert.ok(legacy.indexOf('id: packet') < legacy.indexOf('apply-reviewed-meta-patch.mjs'));
  assert.match(legacy, /archive-reviewed-apply-staging\.mjs\n\s+preflight/);
  assert.match(legacy, /APPLY_BASE_STALE: target changed during APPLY; refusing push/);
  assert.match(legacy, /git push origin "HEAD:refs\/heads\/\$\{TARGET_REF\}"/);
  assert.doesNotMatch(legacy, /git push[^\n]*--force/);
});

test('actual legacy guard refuses missing or ambiguous packets before exposing a target', t => {
  for (const count of [0, 2]) {
    const f = applyFixture(t, 'codex/meta-foundation/middle1', count);
    assert.equal(f.result.status, 1);
    assert.match(f.result.stderr, /Expected exactly one APPLY_PACKET/);
    assert.equal(f.read('output'), '');
    assert.equal(f.read('later-write-stage'), '');
  }
});

test('Pages checks and packages the fixed registered tree, then gates receipt and deployment', () => {
  const build = job(pages, 'build');
  const deploy = job(pages, 'deploy');
  assert.match(build, /ref: \$\{\{ inputs\.registered_main_sha \|\| github\.sha \}\}/);
  assert.match(build, /persist-credentials: false/);
  assert.match(build, /git merge-base --is-ancestor "\$REGISTERED_MAIN_SHA" origin\/main/);
  assert.match(step(build, /^        id: registered$/m), /archive-registration-writer\.mjs --check/);
  assert.match(step(build, /^        id: package_shards$/m), /build-archive2-catalog\.mjs --package-only/);
  assert.match(step(build, /^        id: archive2_runtime$/m), /check-archive2-runtime\.cjs --registered/);
  assert.doesNotMatch(build, /archive\/build_db\.py|archive-pages-registration-derive\.sh|reviewed-meta-register-pass\.sh|archive-main-auto-meta-pass\.sh/);
  assert.match(step(build, /^        id: snapshot_guard$/m), /git diff --exit-code HEAD --/);
  const gate = step(build, /^        id: release_gate$/m);
  assert.match(gate, /STEPS_JSON: \$\{\{ toJSON\(steps\) \}\}/);
  const required = /--required ([\w,]+)/.exec(gate)?.[1].split(',');
  for (const id of ['registered', 'package_shards', 'identity', 'pages_build', 'staged_site_chrome', 'worker_order', 'image_order', 'snapshot_guard']) {
    assert.ok(required?.includes(id), `${id} outcome must reach the release gate`);
  }
  assert.ok(build.indexOf('id: release_gate') < build.indexOf('id: release_receipt'));
  assert.ok(build.indexOf('id: release_receipt') < build.indexOf('uses: actions/upload-pages-artifact'));
  assert.match(step(build, /^        id: release_receipt$/m), /--registered-main-sha "\$REGISTERED_MAIN_SHA"/);
  assert.match(deploy, /needs: build/);
  assert.match(deploy, /if: needs\.build\.outputs\.ready == 'true' && needs\.build\.outputs\.needed == 'true'/);
  assert.doesNotMatch(deploy, /always\(\)|continue-on-error|contents: write/);
});

test('one main push entrypoint and periodic reconciliation preserve interrupted-run recovery', () => {
  assert.match(writer, /^  push:\n    branches: \[main\]/m);
  assert.match(writer, /^  schedule:\n    - cron:/m);
  assert.match(pages, /^  schedule:\n    - cron:/m);
  assert.match(pages, /^  workflow_dispatch:/m);
  assert.doesNotMatch(pages, /^  (?:push|workflow_run):/m, 'publication does not fan out from duplicate registration events');
  assert.doesNotMatch(sync, /^  (?:push|workflow_dispatch|schedule|repair):/m);
  assert.doesNotMatch(compatibility, /^  (?:push|schedule):/m);
  assert.match(legacy, /^      - "archive-apply\/\*\*"/m);
});

test('runner-dependent evidence paths are initialized in executing steps, not unsupported job env contexts', t => {
  const f = fixture(t);
  const envFile = path.join(f.dir, 'github-env');
  const temp = path.join(f.dir, 'runner-temp');
  for (const [workflowText, id, variable, suffix] of [
    [writer, 'register', 'WRITER_WORK_DIR', 'archive-registration-writer'],
    [pages, 'build', 'RELEASE_EVIDENCE_DIR', 'archive-pages-release-evidence'],
  ]) {
    const block = job(workflowText, id);
    assert.doesNotMatch(block.split('    steps:')[0], /\$\{\{[^}]*runner\./);
    fs.writeFileSync(envFile, '');
    const result = f.run(shell(step(block, /name: Initialize runner evidence paths/)), { RUNNER_TEMP: temp, GITHUB_ENV: envFile });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readFileSync(envFile, 'utf8'), `${variable}=${temp}/${suffix}\n`);
  }
});
