'use strict';
// Per-request isolation of the reviewed-meta registration pass (tools/ci/register-reviewed-meta-requests.mjs).
// A request the registrar refuses must be fail-closed and visible for that request only; it must never block
// the other inbox requests (head-of-line blocking seen on main since 2026-10-26).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const repo = path.resolve(__dirname, '..');
const script = path.join(repo, 'tools/ci/register-reviewed-meta-requests.mjs');
const read = rel => fs.readFileSync(path.join(repo, rel), 'utf8');
const git = (cwd, ...args) => execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

// Fake registrar: request JSON { behavior: "ok" | "fail" | "dirty-fail" }.
const REGISTRAR = `
const fs = require('node:fs'); const path = require('node:path');
const args = process.argv.slice(2); const req = args[args.indexOf('--request') + 1];
if (!args.includes('--write')) process.exit(3);
const body = JSON.parse(fs.readFileSync(req, 'utf8')); const name = path.basename(req, '.json');
if (body.behavior !== 'fail') fs.mkdirSync('derived', { recursive: true });
if (body.behavior === 'dirty-fail') fs.writeFileSync('derived/partial-' + name + '.out', 'half written');
if (body.behavior === 'ok') { fs.writeFileSync('derived/' + name + '.out', 'applied ' + name + '\\n'); console.log(JSON.stringify({ status: 'PASS' })); process.exit(0); }
console.error('at fake (registrar.js:1:1)\\nError: before mismatch: qid_v1_' + name + '.standardCourse');
process.exit(1);
`;

function fixture(t, behaviors) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'register-isolation-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '--initial-branch=main');
  for (const [k, v] of [['user.name', 'test'], ['user.email', 'test@example.invalid'], ['core.autocrlf', 'false']]) git(dir, 'config', k, v);
  fs.mkdirSync(path.join(dir, '.archive-meta-register/inbox'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'tools/ci'), { recursive: true });
  fs.writeFileSync(path.join(dir, 'registrar.js'), REGISTRAR);
  fs.writeFileSync(path.join(dir, 'tools/ci/commit.paths'), '# fixture\n.archive-meta-register/inbox/\n.archive-meta-register/rejected/\nderived/\n');
  for (const [name, behavior] of Object.entries(behaviors))
    fs.writeFileSync(path.join(dir, '.archive-meta-register/inbox', name + '.json'), JSON.stringify({ behavior, name }, null, 2) + '\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'seed');
  const requests = Object.keys(behaviors).sort().map(n => `.archive-meta-register/inbox/${n}.json`);
  const run = () => {
    const summary = path.join(dir, 'summary.md');
    const r = spawnSync(process.execPath, [script, '--root', dir, '--registrar', 'registrar.js', '--guard-paths-file', 'tools/ci/commit.paths',
      '--applied-file', path.join(dir, 'applied.txt'), '--rejected-file', path.join(dir, 'rejected.txt'), '--summary-file', summary, '--', ...requests],
      { cwd: dir, encoding: 'utf8', env: { ...process.env, GITHUB_ACTIONS: 'true' } });
    const lines = f => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(Boolean) : []);
    return { ...r, applied: lines('applied.txt'), rejected: lines('rejected.txt'), summary: fs.existsSync(summary) ? fs.readFileSync(summary, 'utf8') : '' };
  };
  const exists = rel => fs.existsSync(path.join(dir, rel));
  return { dir, run, exists, readJson: rel => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8')) };
}

test('a refused first request does not block the remaining requests (head-of-line fix)', t => {
  const f = fixture(t, { '16-first-bad': 'fail', '17-good': 'ok', '18-also-bad': 'fail', '19-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/17-good.json', '.archive-meta-register/inbox/19-good.json']);
  assert.deepEqual(r.rejected, ['.archive-meta-register/inbox/16-first-bad.json', '.archive-meta-register/inbox/18-also-bad.json']);
  for (const good of ['17-good', '19-good']) {
    assert.ok(f.exists(`derived/${good}.out`), `${good} was applied`);
    assert.ok(f.exists(`.archive-meta-register/inbox/${good}.json`), `${good} stays in the inbox until the pass consumes it`);
  }
  for (const bad of ['16-first-bad', '18-also-bad']) {
    assert.ok(!f.exists(`derived/${bad}.out`), `${bad} applied nothing (fail-closed)`);
    assert.ok(!f.exists(`.archive-meta-register/inbox/${bad}.json`), `${bad} left the inbox`);
    assert.ok(f.exists(`.archive-meta-register/rejected/${bad}.json`), `${bad} request kept for the meta owner`);
  }
});

test('the rejection is tracked, exact, deterministic and visible', t => {
  const f = fixture(t, { '16-first-bad': 'fail', '17-good': 'ok' });
  const r = f.run();
  const record = f.readJson('.archive-meta-register/rejected/16-first-bad.rejection.json');
  assert.equal(record.schemaVersion, 'archive-reviewed-meta-register-rejection-v1');
  assert.equal(record.request, '16-first-bad.json');
  assert.equal(record.error, 'Error: before mismatch: qid_v1_16-first-bad.standardCourse');
  assert.equal(record.registrarExitCode, 1);
  assert.match(record.requestSha256, /^[0-9a-f]{64}$/);
  assert.equal(record.requestSha256, require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.json'))).digest('hex'));
  assert.ok(!Object.keys(record).some(k => /time|date|sha1|base/i.test(k.replace('requestSha256', ''))), 'no run-specific fields, so a regenerate retry reproduces identical bytes');
  assert.match(r.stdout, /::error title=Reviewed meta request rejected \(registrar\)::16-first-bad\.json: Error: before mismatch/);
  assert.match(r.summary, /applied: \*\*1\*\*, rejected: \*\*1\*\*/);
  assert.match(r.summary, /\| `16-first-bad\.json` \| Error: before mismatch: qid_v1_16-first-bad\.standardCourse \|/);
  // Re-running on a fresh checkout of the same base yields byte-identical rejection records.
  const first = fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.rejection.json'), 'utf8');
  git(f.dir, 'checkout', '-q', '--', '.'); git(f.dir, 'clean', '-fdq');
  f.run();
  assert.equal(fs.readFileSync(path.join(f.dir, '.archive-meta-register/rejected/16-first-bad.rejection.json'), 'utf8'), first);
});

test('every request refused: pass still finishes, nothing is applied, all are recorded', t => {
  const f = fixture(t, { a: 'fail', b: 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, []);
  assert.equal(r.rejected.length, 2);
  assert.ok(!f.exists('derived'), 'no registration output');
  assert.deepEqual(fs.readdirSync(path.join(f.dir, '.archive-meta-register/inbox')), []);
});

test('a refusal that changed the tree breaks isolation: abort with exit 2, later requests untouched', t => {
  const f = fixture(t, { '1-good': 'ok', '2-dirty': 'dirty-fail', '3-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 2);
  assert.match(r.stderr, /per-request isolation cannot be proven/);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/1-good.json']);
  assert.ok(!f.exists('derived/3-good.out'), 'processing stopped after the dirtied tree');
  assert.ok(f.exists('.archive-meta-register/inbox/2-dirty.json'), 'the dirtying request is left in place, not recorded as a clean rejection');
});

test('a fixed re-submission supersedes the earlier rejection record', t => {
  const f = fixture(t, { 'x-request': 'fail' });
  f.run();
  assert.ok(f.exists('.archive-meta-register/rejected/x-request.rejection.json'));
  fs.writeFileSync(path.join(f.dir, '.archive-meta-register/inbox/x-request.json'), JSON.stringify({ behavior: 'ok' }));
  const r = f.run();
  assert.equal(r.status, 0, r.stderr);
  assert.deepEqual(r.applied, ['.archive-meta-register/inbox/x-request.json']);
  assert.ok(!f.exists('.archive-meta-register/rejected/x-request.rejection.json'));
  assert.ok(!f.exists('.archive-meta-register/rejected/x-request.json'));
});

test('the pass and workflow wiring use the isolating registrar and keep the single-writer design', () => {
  const pass = read('tools/ci/reviewed-meta-register-pass.sh');
  assert.ok(pass.includes('isolate=tools/ci/register-reviewed-meta-requests.mjs') && pass.includes('node "$isolate" --applied-file'), 'requests are registered through the isolating script');
  assert.ok(!/for request in "\$\{reqs\[@\]\}"; do\s*\n\s*node archive\/tools\/meta-foundation\/register-reviewed-exam-meta-source\.mjs[^\n]*--write/.test(pass), 'no unguarded fail-fast registrar loop');
  assert.ok(pass.includes('for request in "${applied[@]}"; do rm -f -- "$request"; done'), 'only applied requests are consumed');
  assert.ok(pass.includes('--verify-projection') && /for request in "\$\{applied\[@\]\}"; do\s*\n\s*schema=/.test(pass), 'only applied requests are projection-verified');
  assert.ok(pass.includes('for round in 1 2; do'), 'bounded to two registration rounds');
  assert.ok(pass.indexOf('compile-meta-foundation.mjs --write') > 0 && pass.indexOf('compile-meta-foundation.mjs --write') < pass.indexOf('compile-meta-foundation.mjs --canonical-only-check'),
    'derived compiled data is written by the single writer before its parity gate (a stale base must not block every request)');
  const paths = read('tools/ci/archive-meta-register-commit.paths').split(/\r?\n/);
  assert.ok(paths.includes('.archive-meta-register/rejected/'), 'rejection records are committed by the single writer');
  const trigger = read('tools/ci/archive-meta-register-trigger-paths.txt');
  assert.ok(!trigger.includes('rejected'), 'rejections must not retrigger the register workflow');
  const workflow = read('.github/workflows/archive-reviewed-exam-meta-register.yml');
  assert.ok(workflow.includes('bash tools/ci/reviewed-meta-register-pass.sh') && workflow.includes('tools/ci/git-push-derived-with-retry.mjs'));
});

// ---- reject / reset modes ---------------------------------------------------------------------------------
test('--reject records an already-applied request, --reset-derived restores every registration path but inbox/rejected', t => {
  const f = fixture(t, { 'a-good': 'ok', 'b-good': 'ok' });
  assert.equal(f.run().status, 0);
  assert.ok(f.exists('derived/a-good.out'));
  const run = (...args) => spawnSync(process.execPath, [script, '--root', f.dir, '--guard-paths-file', 'tools/ci/commit.paths', ...args], { cwd: f.dir, encoding: 'utf8' });
  assert.equal(run('--reset-derived').status, 0);
  assert.ok(!f.exists('derived/a-good.out') && !f.exists('derived'), 'derived output removed');
  assert.ok(f.exists('.archive-meta-register/inbox/a-good.json'), 'inbox untouched by the reset');
  const r = run('--reject', '.archive-meta-register/inbox/b-good.json', '--stage', 'projection-verify', '--error', 'Error: Consumer metadata mismatch: x.curriculumKey');
  assert.equal(r.status, 0, r.stderr);
  const rec = f.readJson('.archive-meta-register/rejected/b-good.rejection.json');
  assert.equal(rec.stage, 'projection-verify');
  assert.equal(rec.error, 'Error: Consumer metadata mismatch: x.curriculumKey');
  assert.ok(!f.exists('.archive-meta-register/inbox/b-good.json') && f.exists('.archive-meta-register/rejected/b-good.json'));
});

// ---- the whole pass with stubbed heavy steps ---------------------------------------------------------------
// Real tools/ci pass + isolating script; the registrar, build_db and validators are stubs driven by request JSON:
//   behavior ok | fail (registrar refuses) | verify-fail (applies, then projection verification refuses)
//   verify-fail-silent (refuses with exit 7 and no "Error:" line) | verify-fail-assert ("AssertionError [ERR_ASSERTION]: ..." only)
//   verifyNeeds: "<name>" (verification refuses when derived/<name>.out is absent)
function passFixture(t, behaviors, { buildFailOnce = false } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'register-pass-'));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  git(dir, 'init', '-q', '--initial-branch=main');
  for (const [k, v] of [['user.name', 'test'], ['user.email', 'test@example.invalid'], ['core.autocrlf', 'false']]) git(dir, 'config', k, v);
  const put = (rel, text) => { fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true }); fs.writeFileSync(path.join(dir, rel), text); };
  for (const rel of ['tools/ci/reviewed-meta-register-pass.sh', 'tools/ci/register-reviewed-meta-requests.mjs', 'tools/ci/archive-meta-register-commit.paths'])
    put(rel, read(rel));
  // The real registration paths plus `derived/`, where the stub registrar writes its output.
  put('tools/ci/archive-meta-register-commit.paths', read('tools/ci/archive-meta-register-commit.paths') + 'derived/\n');
  put('derived/.keep', '');
  put('tools/bin/python', '#!/bin/sh\nexec node "$@"\n'); fs.chmodSync(path.join(dir, 'tools/bin/python'), 0o755);
  for (const rel of ['tests/archive-reviewed-exam-registration-v2.test.mjs', 'tests/archive-finalqa-nonpt-register.test.mjs', 'tests/archive-finalqa-nonpt-real-geumdang.test.mjs'])
    put(rel, "import test from 'node:test'; test('stub', () => {});\n");
  put('archive/build_db.py', `const fs = require('node:fs'); const n = Number(fs.existsSync('build.count') ? fs.readFileSync('build.count', 'utf8') : 0) + 1; fs.writeFileSync('build.count', String(n));
${buildFailOnce ? "if (n === 1) { console.error('first build does not converge'); process.exit(1); }" : ''}
`);
  for (const rel of ['archive/tools/verify-archive-registration.mjs', 'archive/tools/build-archive2-catalog.mjs', 'archive/tools/meta-foundation/compile-meta-foundation.mjs'])
    put(rel, '');
  put('archive/tools/meta-foundation/register-reviewed-exam-meta-source.mjs', `import fs from 'node:fs'; import path from 'node:path';
const args = process.argv.slice(2); const req = args[args.indexOf('--request') + 1]; const body = JSON.parse(fs.readFileSync(req, 'utf8'));
const name = path.basename(req, '.json');
if (args.includes('--verify-projection')) {
  const missing = body.verifyNeeds && !fs.existsSync('derived/' + body.verifyNeeds + '.out');
  if (body.behavior === 'verify-fail-silent' && fs.existsSync('derived/' + name + '.out')) { process.stderr.write('no error line here\\n'); process.exit(7); }
  if (body.behavior === 'verify-fail-assert' && fs.existsSync('derived/' + name + '.out')) { console.error('AssertionError [ERR_ASSERTION]: projection differs'); process.exit(1); }
  if ((body.behavior === 'verify-fail' && fs.existsSync('derived/' + name + '.out')) || missing) { console.error('at x (y:1:1)\\nError: Consumer metadata mismatch: qid_' + name + '.curriculumKey'); process.exit(1); }
  process.exit(0);
}
if (body.behavior === 'fail') { console.error('Error: before mismatch: qid_' + name + '.standardCourse'); process.exit(1); }
fs.mkdirSync('derived', { recursive: true }); fs.writeFileSync('derived/' + name + '.out', 'applied\\n'); console.log('{}');
`);
  for (const [name, body] of Object.entries(behaviors))
    put(`.archive-meta-register/inbox/${name}.json`, JSON.stringify({ schemaVersion: 'archive-reviewed-exam-meta-register-request-v2', approval: { type: 'META_PIPELINE_AUDIT' }, ...(typeof body === 'string' ? { behavior: body } : body) }, null, 2) + '\n');
  git(dir, 'add', '-A'); git(dir, 'commit', '-q', '-m', 'seed');
  const exists = rel => fs.existsSync(path.join(dir, rel));
  const run = () => {
    const summary = path.join(dir, 'summary.md'); fs.rmSync(summary, { force: true });
    const runner = path.join(dir, 'runner-temp'); fs.mkdirSync(runner, { recursive: true });
    const r = spawnSync('bash', ['tools/ci/reviewed-meta-register-pass.sh'], { cwd: dir, encoding: 'utf8',
      env: { ...process.env, PATH: path.join(dir, 'tools/bin') + path.delimiter + process.env.PATH, RUNNER_TEMP: runner, GITHUB_STEP_SUMMARY: summary, ARCHIVE_META_SCOPED: 'false' } });
    return { ...r, copies: exists('runner-temp/archive-meta-register-pass/requests') ? fs.readdirSync(path.join(dir, 'runner-temp/archive-meta-register-pass/requests')).sort() : [],
      builds: exists('build.count') ? Number(fs.readFileSync(path.join(dir, 'build.count'), 'utf8')) : 0,
      inbox: fs.readdirSync(path.join(dir, '.archive-meta-register/inbox')).sort() };
  };
  return { dir, run, exists, readJson: rel => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8')) };
}

test('pass: registrar refusals are isolated and the rest is built once, consumed and kept for the post-push check', t => {
  const f = passFixture(t, { '16-first-bad': 'fail', '17-good': 'ok', '19-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 1, 'a single shared build when nothing fails verification');
  assert.deepEqual(r.inbox, [], 'applied requests consumed, refused one moved out');
  assert.deepEqual(r.copies, ['17-good.json', '19-good.json'], 'only applied requests are checked for changed-UID approval after the push');
  assert.ok(f.exists('derived/17-good.out') && f.exists('derived/19-good.out') && !f.exists('derived/16-first-bad.out'));
  assert.equal(f.readJson('.archive-meta-register/rejected/16-first-bad.rejection.json').stage, 'registrar');
});

test('pass: a request refused by the projection verification is rejected and the others are redone without it (round 2)', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-verify-bad': 'verify-fail', '3-good': 'ok', '4-registrar-bad': 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2, 'one rebuild after dropping the refused request');
  assert.ok(f.exists('derived/1-good.out') && f.exists('derived/3-good.out'));
  assert.ok(!f.exists('derived/2-verify-bad.out'), 'the verification-refused request was undone, not left half applied');
  const rec = f.readJson('.archive-meta-register/rejected/2-verify-bad.rejection.json');
  assert.equal(rec.stage, 'projection-verify');
  assert.equal(rec.error, 'Error: Consumer metadata mismatch: qid_2-verify-bad.curriculumKey');
  assert.equal(f.readJson('.archive-meta-register/rejected/4-registrar-bad.rejection.json').stage, 'registrar');
  assert.deepEqual(r.inbox, []);
  assert.deepEqual(r.copies, ['1-good.json', '3-good.json']);
  assert.match(r.stdout + fs.readFileSync(path.join(f.dir, 'summary.md'), 'utf8'), /REJECTED \(projection-verify\)/);
});

test('pass: still fail-closed when the second round is refused too (no endless isolation)', t => {
  const f = passFixture(t, { 'x-bad': 'verify-fail', 'y-needs-x': { behavior: 'ok', verifyNeeds: 'x-bad' } });
  const r = f.run();
  assert.equal(r.status, 1);
  assert.match(r.stderr, /still refuses 1 request\(s\) after the second round/);
  assert.equal(r.builds, 2);
  assert.ok(f.exists('.archive-meta-register/inbox/y-needs-x.json'), 'nothing was consumed by the failed pass');
});

test('pass: build_db may need one re-run to reach its fixed point, then the pass is green', t => {
  const f = passFixture(t, { 'only-good': 'ok' }, { buildFailOnce: true });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2);
  assert.match(r.stdout, /build_db did not converge on the first run/);
});

test('pass: every request refused -> green, nothing built, rejections recorded', t => {
  const f = passFixture(t, { a: 'fail', b: 'fail' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 0);
  assert.deepEqual(fs.readdirSync(path.join(f.dir, '.archive-meta-register/rejected')).sort(), ['a.json', 'a.rejection.json', 'b.json', 'b.rejection.json']);
});

test('pass: a projection refusal that prints no recognisable Error line is still isolated per request (no abort under set -e)', t => {
  const f = passFixture(t, { '1-good': 'ok', '2-silent': 'verify-fail-silent', '3-assert': 'verify-fail-assert', '4-good': 'ok' });
  const r = f.run();
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(r.builds, 2, 'one rebuild after dropping both refused requests');
  assert.ok(f.exists('derived/1-good.out') && f.exists('derived/4-good.out'));
  assert.ok(!f.exists('derived/2-silent.out') && !f.exists('derived/3-assert.out'), 'refused requests were undone');
  const silent = f.readJson('.archive-meta-register/rejected/2-silent.rejection.json');
  assert.equal(silent.stage, 'projection-verify');
  assert.equal(silent.error, 'consumer projection verification failed (exit status 7)');
  const assertion = f.readJson('.archive-meta-register/rejected/3-assert.rejection.json');
  assert.equal(assertion.stage, 'projection-verify');
  assert.equal(assertion.error, 'consumer projection verification failed (exit status 1)', 'AssertionError [ERR_...] does not match the Error: pattern, so the generic message is used');
  assert.deepEqual(r.inbox, []);
  assert.deepEqual(r.copies, ['1-good.json', '4-good.json']);
});
