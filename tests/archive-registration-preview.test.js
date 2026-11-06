const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const workflow = fs.readFileSync(path.join(__dirname, '../.github/workflows/archive-registration-sync.yml'), 'utf8');
function script(name) {
  const section = workflow.split(`      - name: ${name}\n`)[1]?.split('\n      - ')[0];
  assert.ok(section, `workflow step ${name}`);
  return section.split('        run: |\n')[1].split('\n').map(line => line.replace(/^          /, '')).join('\n');
}
function run(cwd, command, args, env = {}) {
  return spawnSync(command, args, { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
}
function ok(cwd, command, args, env) {
  const result = run(cwd, command, args, env);
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return result.stdout.trim();
}
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-readonly-preview-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'repo');
  const temp = path.join(root, 'temp');
  fs.mkdirSync(repo); fs.mkdirSync(temp);
  ok(repo, 'git', ['init', '-q']);
  ok(repo, 'git', ['config', 'user.name', 'fixture']);
  ok(repo, 'git', ['config', 'user.email', 'fixture@example.invalid']);
  fs.mkdirSync(path.join(repo, 'archive/data'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'archive/db.js'), 'const db = [];\n');
  ok(repo, 'git', ['add', '--', 'archive/db.js']);
  ok(repo, 'git', ['commit', '-qm', 'fixture baseline']);
  const head = ok(repo, 'git', ['rev-parse', 'HEAD']);
  const env = { RUNNER_TEMP: temp, GITHUB_OUTPUT: path.join(temp, 'output'), GITHUB_STEP_SUMMARY: path.join(temp, 'summary'), PR_HEAD_SHA: head };
  return { repo, temp, head, env, root };
}

test('read-only runner transfers tracked and new generated outputs without changing the PR head', t => {
  const { repo, temp, head, env, root } = fixture(t);
  fs.writeFileSync(path.join(repo, 'archive/db.js'), 'const db = ["fixture"];\n');
  fs.writeFileSync(path.join(repo, 'archive/data/question_metadata.json'), '{"fixture":true}\n');
  ok(repo, 'bash', ['-c', script('Guard generated scope')], env);
  ok(repo, 'bash', ['-c', script('Record the read-only registration preview')], env);
  assert.equal(ok(repo, 'git', ['rev-parse', 'HEAD']), head);
  assert.equal(ok(repo, 'git', ['rev-list', '--count', 'HEAD']), '1');
  assert.match(fs.readFileSync(env.GITHUB_STEP_SUMMARY, 'utf8'), /Remote writes: none/);
  const repair = path.join(root, 'repair');
  ok(root, 'git', ['clone', '-q', repo, repair]);
  ok(repair, 'bash', ['-c', script('Apply the exact verified registration preview')], env);
  assert.equal(fs.readFileSync(path.join(repair, 'archive/db.js'), 'utf8'), 'const db = ["fixture"];\n');
  assert.equal(fs.readFileSync(path.join(repair, 'archive/data/question_metadata.json'), 'utf8'), '{"fixture":true}\n');
  assert.equal(fs.readFileSync(path.join(temp, 'registration-preview/source.sha'), 'utf8').trim(), head);
});

test('preview refuses source mutation and refuses applying results onto another snapshot', t => {
  const { repo, env, root } = fixture(t);
  fs.writeFileSync(path.join(repo, 'archive/db.js'), 'const db = [1];\n');
  ok(repo, 'bash', ['-c', script('Record the read-only registration preview')], env);
  fs.writeFileSync(path.join(repo, 'archive/student-source.js'), 'const student = 1;\n');
  assert.notEqual(run(repo, 'bash', ['-c', script('Guard generated scope')], env).status, 0);
  ok(repo, 'git', ['add', '--', 'archive/student-source.js']);
  assert.notEqual(run(repo, 'bash', ['-c', script('Guard generated scope')], env).status, 0, 'staged source changes must also be rejected');
  const repair = path.join(root, 'repair');
  ok(root, 'git', ['clone', '-q', repo, repair]);
  ok(repair, 'git', ['config', 'user.name', 'fixture']);
  ok(repair, 'git', ['config', 'user.email', 'fixture@example.invalid']);
  fs.writeFileSync(path.join(repair, 'later.txt'), 'another main commit');
  ok(repair, 'git', ['add', '--', 'later.txt']);
  ok(repair, 'git', ['commit', '-qm', 'main advanced']);
  assert.notEqual(run(repair, 'bash', ['-c', script('Apply the exact verified registration preview')], env).status, 0);
  assert.equal(fs.readFileSync(path.join(repair, 'archive/db.js'), 'utf8'), 'const db = [];\n');
});
