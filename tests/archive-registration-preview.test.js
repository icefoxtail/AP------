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
  const body = section.split('        run: |\n')[1];
  assert.ok(body, `workflow shell ${name}`);
  return body.split('\n').map(line => line.replace(/^          /, '')).join('\n');
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
  const repo = path.join(root, 'repo'), temp = path.join(root, 'temp'), remote = path.join(root, 'remote.git');
  fs.mkdirSync(repo); fs.mkdirSync(temp);
  ok(repo, 'git', ['init', '-q', '--initial-branch=main']);
  for (const [key, value] of [['user.name', 'fixture'], ['user.email', 'fixture@example.invalid'], ['commit.gpgsign', 'false']]) {
    ok(repo, 'git', ['config', key, value]);
  }
  fs.mkdirSync(path.join(repo, 'archive/data'), { recursive: true });
  fs.writeFileSync(path.join(repo, 'archive/db.js'), 'const db = [];\n');
  const source = path.join(repo, 'archive/student-source.js');
  const sourceBytes = 'const student = 1;\n';
  fs.writeFileSync(source, sourceBytes);
  fs.writeFileSync(path.join(repo, '.gitignore'), '/node_modules/\nignored-native-fixture.*\n');
  ok(repo, 'git', ['add', '--', 'archive', '.gitignore']);
  ok(repo, 'git', ['commit', '-qm', 'fixture baseline']);
  ok(root, 'git', ['init', '--bare', '-q', remote]);
  ok(repo, 'git', ['remote', 'add', 'origin', remote]);
  ok(repo, 'git', ['push', '-q', 'origin', 'HEAD:refs/heads/main']);
  const head = ok(repo, 'git', ['rev-parse', 'HEAD']);
  const remoteRefs = ok(repo, 'git', ['ls-remote', '--refs', 'origin']);
  const env = { RUNNER_TEMP: temp, GITHUB_OUTPUT: path.join(temp, 'output'), GITHUB_STEP_SUMMARY: path.join(temp, 'summary'), PR_HEAD_SHA: head };
  const preview = path.join(temp, 'registration-preview');
  const checkUnchangedRefs = () => {
    assert.equal(ok(repo, 'git', ['rev-parse', 'HEAD']), head);
    assert.equal(ok(repo, 'git', ['rev-list', '--count', 'HEAD']), '1');
    assert.equal(ok(repo, 'git', ['ls-remote', '--refs', 'origin']), remoteRefs);
  };
  return { repo, temp, head, env, root, preview, source, sourceBytes, checkUnchangedRefs };
}
const previewScript = () => script('Record the read-only registration preview');

function consumedProofFixture(f) {
  // CI-success, ZIP digest and proof validation are exercised by the proof helper
  // suite. This fixture supplies that consumer's outputs to the actual next shell.
  const env = { ...f.env, GITHUB_REPOSITORY: 'fixture/archive', PROOF_SOURCE_SHA: f.head,
    CI_RUN_ID: '41', CI_RUN_ATTEMPT: '2', CI_ARTIFACT_ID: '71',
    CI_ARTIFACT_DIGEST: `sha256:${'c'.repeat(64)}`, CHROME_OUTCOME: 'success' };
  fs.mkdirSync(f.preview, { recursive: true });
  const proofFile = path.join(f.preview, 'proof.json');
  const proofBytes = JSON.stringify({ fixture: 'already verified consumer metadata',
    checkoutSha: f.head, runId: 41, runAttempt: 2, artifactId: 71 }) + '\n';
  fs.writeFileSync(proofFile, proofBytes);
  return { env, proofFile, proofBytes };
}

test('after CI proof consumption the actual PR shell records exact metadata without patch generation or remote writes', t => {
  const f = fixture(t), consumed = consumedProofFixture(f);
  const browserDependency = path.join(f.repo, 'node_modules/playwright/package.json');
  const browserDependencyBytes = '{"name":"fixture-browser-driver"}\n';
  fs.mkdirSync(path.dirname(browserDependency), { recursive: true });
  fs.writeFileSync(browserDependency, browserDependencyBytes);
  ok(f.repo, 'git', ['check-ignore', '-q', '--', browserDependency]);
  assert.doesNotMatch(workflow, /^  repair:|Apply the exact verified registration preview|create-pull-request|git apply --index/m);
  assert.doesNotMatch(workflow, /git commit|git push|contents: write|pull-requests: write|registration\.patch|git diff --binary/);
  const consumeStep = workflow.split('      - name: Reuse the exact CI registration data proof\n')[1]?.split('\n      - ')[0];
  assert.ok(consumeStep, 'the metadata preview must follow the mandatory proof consumer');
  assert.match(consumeStep, /archive-pr-registration-proof\.mjs consume/);
  assert.doesNotMatch(consumeStep, /continue-on-error:/);
  for (const [env, output] of [['PROOF_SOURCE_SHA', 'source_sha'], ['CI_RUN_ID', 'ci_run_id'],
    ['CI_RUN_ATTEMPT', 'ci_run_attempt'], ['CI_ARTIFACT_ID', 'artifact_id'], ['CI_ARTIFACT_DIGEST', 'artifact_digest']]) {
    assert.ok(workflow.includes(`${env}: ` + '${{ steps.registration_proof.outputs.' + output + ' }}'));
  }
  ok(f.repo, 'bash', ['-c', previewScript()], consumed.env);
  f.checkUnchangedRefs();
  assert.equal(ok(f.repo, 'git', ['status', '--porcelain', '--untracked-files=all']), '');
  assert.equal(fs.readFileSync(f.source, 'utf8'), f.sourceBytes);
  assert.equal(fs.readFileSync(path.join(f.repo, 'archive/db.js'), 'utf8'), 'const db = [];\n');
  assert.equal(fs.readFileSync(consumed.proofFile, 'utf8'), consumed.proofBytes);
  assert.equal(fs.readFileSync(browserDependency, 'utf8'), browserDependencyBytes,
    'ignored browser dependencies outside native inputs remain allowed and unchanged');
  assert.deepEqual(fs.readdirSync(f.preview).sort(), ['preview.json', 'proof.json', 'source.sha']);
  assert.equal(fs.readFileSync(path.join(f.preview, 'source.sha'), 'utf8').trim(), f.head);
  const report = JSON.parse(fs.readFileSync(path.join(f.preview, 'preview.json'), 'utf8'));
  assert.deepEqual(report, {
    schemaVersion: 'archive-pr-registration-preview/v2', sourceSha: f.head, authorHeadSha: f.head,
    registrationData: { state: 'REUSED', scope: 'registration-data-only', ciRunId: 41, ciRunAttempt: 2,
      artifactId: 71, artifactDigest: consumed.env.CI_ARTIFACT_DIGEST,
      ciUrl: 'https://github.com/fixture/archive/actions/runs/41/attempts/2' },
    directOriginalChrome: 'success', generatedDataIncluded: false, remoteWrites: 0,
  });
  const summary = fs.readFileSync(f.env.GITHUB_STEP_SUMMARY, 'utf8');
  assert.ok(summary.includes(f.head));
  assert.ok(summary.includes(report.registrationData.ciUrl));
  assert.match(summary, /Remote writes: none/);
  assert.match(summary, /metadata only/);
});

test('the actual post-consume guard refuses another checkout, changed or untracked inputs and failed Chrome', t => {
  const f = fixture(t), consumed = consumedProofFixture(f);
  const cases = [
    { name: 'another snapshot' }, { name: 'tracked unstaged' }, { name: 'tracked staged' },
    { name: 'untracked source', file: 'archive/new-untracked-source.js' },
    ...['archive/exams/original', 'shared', 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION',
      'docs/rules/01_CANONICAL/taxonomy'].map(root => ({ name: `ignored native input in ${root}`,
      file: `${root}/ignored-native-fixture.js`, ignored: true })),
    { name: 'failed Chrome' },
  ];
  for (const { name, file, ignored } of cases) {
    ok(f.repo, 'git', ['reset', '--hard', 'HEAD']);
    ok(f.repo, 'git', ['clean', '-fdx']);
    fs.rmSync(path.join(f.preview, 'preview.json'), { force: true });
    fs.rmSync(f.env.GITHUB_STEP_SUMMARY, { force: true });
    const env = { ...consumed.env };
    if (name === 'another snapshot') env.PROOF_SOURCE_SHA = 'f'.repeat(40);
    if (name === 'failed Chrome') env.CHROME_OUTCOME = 'failure';
    if (name.startsWith('tracked')) {
      fs.writeFileSync(f.source, `const rejectedFixture = ${JSON.stringify(name)};\n`);
      if (name === 'tracked staged') ok(f.repo, 'git', ['add', '--', f.source]);
    }
    const addedInput = file ? path.join(f.repo, file) : null;
    const addedInputBytes = 'const unboundFixture = 1;\n';
    if (addedInput) {
      fs.mkdirSync(path.dirname(addedInput), { recursive: true });
      fs.writeFileSync(addedInput, addedInputBytes);
      if (ignored) ok(f.repo, 'git', ['check-ignore', '-q', '--', file]);
      else assert.equal(ok(f.repo, 'git', ['ls-files', '--others', '--exclude-standard']), file);
    }
    const beforeSource = fs.readFileSync(f.source, 'utf8');
    const result = run(f.repo, 'bash', ['-c', previewScript()], env);
    assert.notEqual(result.status, 0, `${name} must not produce a successful preview`);
    assert.equal(fs.existsSync(path.join(f.preview, 'preview.json')), false);
    assert.equal(fs.existsSync(f.env.GITHUB_STEP_SUMMARY), false);
    assert.equal(fs.readFileSync(f.source, 'utf8'), beforeSource, 'failure must not overwrite its input');
    if (addedInput) assert.equal(fs.readFileSync(addedInput, 'utf8'), addedInputBytes);
    assert.equal(fs.readFileSync(consumed.proofFile, 'utf8'), consumed.proofBytes);
    f.checkUnchangedRefs();
  }
});
