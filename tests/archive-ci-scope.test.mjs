import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { classifyPaths, planCiScope, readScope, scopeChecks, TECHNICAL_INPUTS } from '../tools/ci/archive-ci-scope.mjs';
import { commandsForScope, selectTechnicalCommands, runScopedTests, packageShardsReady } from '../tools/ci/run-scoped-tests.mjs';

const source = 'archive/exams/original/high/example.js';
const asset = 'archive/assets/images/example/solution.svg';
const repo = fileURLToPath(new URL('..', import.meta.url));
const read = file => fs.readFileSync(path.join(repo, file), 'utf8');
const metadataFile = 'archive/data/question_metadata.json';
function fixture(t, changedFiles = { [source]: 'window.questions=[];' }) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'archive-scope-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); return result.stdout.trim();
  };
  const write = (file, value) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), value); };
  git('init', '-q', '--initial-branch=main'); git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false'); write('README.md', 'baseline');
  write(source, `window.questions=[{solutionImage:'assets/images/example/solution.svg'}];`);
  write(asset, '<svg xmlns="http://www.w3.org/2000/svg"/>');
  git('add', '.'); git('commit', '-qm', 'base'); const baseSha = git('rev-parse', 'HEAD');
  git('switch', '-qc', 'pr');
  for (const [file, value] of Object.entries(changedFiles)) write(file, value);
  git('add', '.'); git('commit', '-qm', 'change'); const headSha = git('rev-parse', 'HEAD');
  const event = { pull_request: { base: { sha: baseSha }, head: { sha: headSha } } };
  return { root, git, write, baseSha, headSha, event, plan: () => planCiScope({ root, eventName: 'pull_request', event, expectedSha: headSha }) };
}

test('only proven original content and original-only asset dependencies select targeted checks', () => {
  assert.equal(classifyPaths([source]).mode, 'archive-content');
  const plan = classifyPaths([asset], { assetConsumers: () => [source] });
  assert.equal(plan.mode, 'archive-content'); assert.deepEqual(plan.sources, [source]);
  assert.equal(classifyPaths([asset]).mode, 'full', 'unknown reverse dependency is conservative');
  assert.equal(classifyPaths([asset], { assetConsumers: () => ['archive/generated/bank.js'] }).mode, 'full');
  assert.equal(classifyPaths([source], { exists: () => false }).mode, 'full', 'deletion needs inventory checks');
});

test('metadata, generators, common output engines and checker versions keep existing relevant regression coverage', () => {
  for (const file of ['archive/data/question_metadata.json', 'archive/engine.js', 'archive/tools/build-archive2-catalog.mjs',
    'tools/ci/archive-ci-scope.mjs', 'tests/archive-content-scope.test.mjs', '.github/workflows/ci.yml', 'unmapped.txt']) {
    assert.equal(classifyPaths([source, file]).mode, 'full', file);
  }
  assert.equal(classifyPaths(null).mode, 'full'); assert.equal(classifyPaths([]).mode, 'full');
});

test('only the closed metadata, output and registration inputs opt into technical groups', () => {
  const samples = {
    metadata: [metadataFile, 'archive/data/question_identity_map.json', 'archive/data/meta-foundation/runtime/derivative-v1.json'],
    output: ['archive/engine.html', 'archive/mathjax_render_loop.js', 'tests/archive2-solution-loading-browser.cjs'],
    registration: ['tools/ci/archive-registration-writer.mjs', '.github/workflows/archive-pages-release.yml', 'archive/build_db.py'],
  };
  for (const [group, files] of Object.entries(samples)) {
    for (const file of files) {
      assert.equal(classifyPaths([file]).mode, `archive-${group}`, file);
      assert.deepEqual(classifyPaths([file]).groups, [group]);
      assert.equal(classifyPaths([file], { exists: () => false }).mode, 'full', 'deleted input is conservative');
    }
  }
  assert.equal(new Set(Object.values(TECHNICAL_INPUTS).flat()).size, Object.values(TECHNICAL_INPUTS).flat().length,
    'an input cannot silently acquire two incompatible owners');
  for (const file of ['shared/js/api.js', 'apmath/worker-backup/worker/helpers/archive2.js', 'apmath/wrong_print_engine.html',
    'alive/new-authority.json', 'archive/data/meta-foundation/runtime/new-domain-v1.json',
    'archive/tools/unknown-generator.mjs', 'tests/new-archive-check.test.mjs',
    'tools/ci/archive-ci-scope.mjs', 'tools/ci/run-scoped-tests.mjs', '.github/workflows/ci.yml',
    'tools/run-tests.js', 'tools/ci/ci-tip-plan.mjs', 'tests/ci-signal-hygiene.test.mjs']) {
    assert.equal(classifyPaths([file]).mode, 'full', file);
    assert.equal(classifyPaths([metadataFile, file]).mode, 'full', `uncertain mixed dependency: ${file}`);
  }
});

test('metadata and registration retain technical checks without scheduling the unchanged 50-solution engine comparison', () => {
  for (const files of [[metadataFile], ['tools/ci/archive-registration-writer.mjs'],
    [metadataFile, '.github/workflows/archive-pages-release.yml']]) {
    const scope = { ...classifyPaths(files), changedFiles: files };
    const checks = scopeChecks(scope);
    assert.equal(checks.workerDependencies, true, 'shared Consumer/Worker fixtures keep their dependencies');
    assert.equal(checks.runtimeContract, false);
    assert.equal(checks.runtimeChrome, false);
    assert.equal(checks.solutionBrowser, false);
  }
  for (const file of TECHNICAL_INPUTS.output) {
    const checks = scopeChecks(classifyPaths([file]));
    assert.equal(checks.runtimeContract, true, file);
    assert.equal(checks.runtimeChrome, true, file);
    assert.equal(checks.solutionBrowser, true, file);
  }
  assert.equal(scopeChecks(classifyPaths(['shared/js/api.js'])).solutionBrowser, true, 'unknown/shared dependencies remain conservative');
  assert.equal(scopeChecks({ ...classifyPaths([metadataFile]), changedFiles: [metadataFile] }).prepareProjection, true);
  assert.equal(scopeChecks({ ...classifyPaths(['archive/build_db.py']), changedFiles: ['archive/build_db.py'] }).prepareProjection, true);
  assert.equal(scopeChecks({ ...classifyPaths(['archive/engine.html']), changedFiles: ['archive/engine.html'] }).prepareProjection, true,
    'a main push may still carry pending derived registration before the writer finishes');
});

const registryFixture = [
  { label: 'Meta projection', args: ['--test', 'tests/archive2-canonical-projection.test.mjs'], timeout: 60000 },
  { label: 'Native writer', args: ['--test', 'tests/archive-registration-writer.test.mjs'], timeout: 60000 },
  { label: 'Worker grade/browse contract', args: ['--test', '--test-name-pattern', 'the existing exact filter', 'tests/archive2-worker-validation.test.mjs'], timeout: 60000 },
  { label: 'APMS UID bridge', args: ['--test', 'tests/apms-result-clinic-uid-bridge.test.mjs'], timeout: 60000 },
  { label: 'Print integration', args: ['tests/clinic-render-authority-adapter.test.js'], timeout: 60000 },
  { label: 'R2 gate', args: ['--test', 'tests/archive-pages-image-r2-gate.test.mjs'], timeout: 60000 },
  { label: 'Worker deploy order', args: ['--test', 'tests/apms-worker-deploy.test.mjs'], timeout: 60000 },
  { label: 'Unrelated EIE', args: ['tests/eie-student-grade-report-print.test.js'], timeout: 60000 },
  { label: 'Unrelated APMS', args: ['tests/dashboard-exam-memo-display.test.js'], timeout: 60000 },
  { label: 'Unrelated playground', args: ['--test', 'apmath/playground/next/tools/catalog.test.mjs'], timeout: 60000 },
];

test('technical group union uses registered Consumer, retry and gate commands without broadening to unrelated projects', () => {
  const scope = classifyPaths([metadataFile, 'tools/ci/archive-registration-writer.mjs']);
  assert.equal(scope.mode, 'archive-technical');
  assert.deepEqual(scope.groups, ['metadata', 'registration']);
  const commands = selectTechnicalCommands(scope, registryFixture);
  assert.deepEqual(commands.map(row => row.label), ['Meta projection', 'Native writer', 'Worker grade/browse contract', 'APMS UID bridge', 'R2 gate', 'Worker deploy order']);
  assert.strictEqual(commands[2], registryFixture[2], 'the real Worker name filter and command object are preserved');
  const output = selectTechnicalCommands(classifyPaths(['archive/engine.html']), registryFixture);
  assert.ok(output.some(row => row.label === 'Print integration'));
  assert.ok(output.some(row => row.label === 'APMS UID bridge'));
  assert.ok(output.every(row => !row.label.startsWith('Unrelated')));
  assert.throws(() => commandsForScope(scope), /existing test command registry/);
  assert.throws(() => selectTechnicalCommands({ groups: ['unknown'] }, registryFixture), /unknown technical/);
  assert.throws(() => selectTechnicalCommands(scope, registryFixture.slice(-3)), /selected no/);
  const prepared = commandsForScope({ ...scope, changedFiles: ['tools/ci/archive-registration-writer.mjs'] }, registryFixture);
  assert.deepEqual(prepared[0], ['--check', 'tools/ci/archive-registration-writer.mjs']);
  assert.ok(prepared.some(args => args.join(' ') === 'archive/tools/build-archive2-catalog.mjs --package-only'));
  assert.ok(!prepared.some(args => args.includes('archive/build_db.py') ||
    (args.includes('archive/tools/build-archive2-catalog.mjs') && !args.includes('--package-only'))), 'no second shared registration build');
});

test('the production test registry retains its P2/P3 additions and supplies the scoped runner once', async () => {
  const text = read('tools/run-tests.js');
  const boundary = text.indexOf('\nif (args.length) {\n  const { runScopedTests }');
  assert.ok(boundary > text.indexOf('const requiredCommands = ['), 'scope selection follows the authoritative registry');
  assert.equal((text.match(/if \(runScopedTests\(/g) || []).length, 1);
  assert.ok(boundary < text.indexOf('const canonicalProjectionBuild'), 'scoped execution does not first run the full catalog builder');
  // Evaluate only the real registry declarations. No test, builder or browser is
  // launched; the child_process stub makes accidental execution fail this test.
  const registry = await vm.runInNewContext(text.slice(0, boundary) +
    '\nreturn [...tests.map(file => ({label: `tests/${file}`, args: [`tests/${file}`]})), ...requiredCommands];\n}\nmain();', {
    __dirname: path.join(repo, 'tools'), process: { argv: ['node', 'run-tests.js'], env: {} },
    require: name => name === 'child_process' ? { spawnSync() { throw Error('registry inspection must not execute commands'); } } : createRequire(import.meta.url)(name),
  });
  const names = registry.flatMap(command => command.args);
  for (const file of ['tests/archive-registration-writer.test.mjs', 'tests/archive-single-writer-workflows.test.mjs', 'tests/archive-pages-release-identity.test.mjs']) {
    assert.ok(names.includes(file), file);
  }
  const meta = selectTechnicalCommands(classifyPaths([metadataFile]), registry);
  const registration = selectTechnicalCommands(classifyPaths(['tools/ci/archive-registration-writer.mjs']), registry);
  const output = selectTechnicalCommands(classifyPaths(['archive/engine.html']), registry);
  for (const commands of [meta, registration, output]) {
    assert.ok(commands.length > 0 && commands.length < registry.length);
    assert.ok(!commands.some(command => command.args.some(arg => /^(?:apmath\/playground\/|tests\/eie-|tests\/dashboard-)/.test(arg))));
    assert.ok(commands.some(command => command.args.includes('tests/archive2-worker-validation.test.mjs')));
    assert.ok(commands.some(command => command.args.includes('tests/apms-result-clinic-uid-bridge.test.mjs')));
    assert.ok(!commands.some(command => command.args.some(arg => /geometry-equation\/tests\/verify-svg-coordinate-parity|solution-calibration-gate/.test(arg))));
  }
  for (const file of ['tests/archive-registration-writer.test.mjs', 'tests/archive-single-writer-workflows.test.mjs', 'tests/archive-pages-release-identity.test.mjs']) {
    assert.ok(registration.some(command => command.args.includes(file)), `new registration contract remains selected: ${file}`);
  }
  for (const file of TECHNICAL_INPUTS.registration.filter(file => file.startsWith('tests/'))) {
    assert.equal(classifyPaths(['tools/ci/archive-registration-writer.mjs', file]).mode, 'archive-registration',
      `a mapped producer plus its own fixture remains bounded: ${file}`);
    assert.equal(registry.filter(command => command.args.includes(file)).length, 1,
      `every scoped fixture exists exactly once in the actual registry: ${file}`);
    assert.ok(registration.some(command => command.args.includes(file)),
      `the mapped fixture is actually selected, not skipped by its filename: ${file}`);
  }
});

function scopedExecutionFixture(t, bytes = '{}\n') {
  const f = fixture(t, { [metadataFile]: bytes });
  const scopeFile = path.join(f.root, 'scope.json');
  const plan = f.plan(); fs.writeFileSync(scopeFile, JSON.stringify(plan));
  const command = registryFixture[0];
  f.write(command.args.at(-1), '// isolated command fixture\n');
  f.write('archive/tools/build-archive2-catalog.mjs', '// package-only command fixture\n');
  const hash = value => createHash('sha256').update(value).digest('hex');
  const prefix = 'data/archive2-source-verification/mixed-v1/';
  const packages = new Map();
  const row = (file, body) => {
    const content = JSON.stringify(body) + '\n'; packages.set(`archive/${file}`, content); f.write(`archive/${file}`, content);
    return { path: file, sha256: hash(content), byteLength: Buffer.byteLength(content) };
  };
  const context = row(`${prefix}context.json`, { fixture: 'context' });
  const sourceRow = row(`${prefix}sources/${hash(source)}.json`, { fixture: 'source' });
  const uidBuckets = [...'0123456789abcdef'].map(value => ({ ...row(`${prefix}uid-buckets/${value}.json`, { fixture: value }), prefix: value }));
  const index = { schemaVersion: 'archive2-source-verification-index-v1', resolverVersion: '1.1.0',
    generatedFromCatalogIndexVersion: 'fixture-version', baseProjectionVersion: 'fixture-base', files: [{ sourceFile: source }],
    mixedLookup: { schemaVersion: 'archive2-mixed-source-verification-index-v2', resolverVersion: '1.1.0',
      baseProjectionVersion: 'fixture-base', context, files: [{ sourceIndex: 0, sha256: sourceRow.sha256, byteLength: sourceRow.byteLength }], uidBuckets } };
  const indexText = JSON.stringify(index) + '\n';
  f.write('archive/data/archive2-source-verification-index.json', indexText);
  f.write('archive/data/archive2-canonical-input-manifest.json', JSON.stringify({ resolverVersion: '1.1.0', generatedFromCatalogIndexVersion: 'fixture-version',
    files: [{ path: 'data/archive2-source-verification-index.json', sha256: hash(indexText) }] }));
  return { ...f, scopeFile, plan, command, packages };
}

test('mixed package reuse requires manifest-bound index identity and every exact file byte, not mere existence', t => {
  const f = scopedExecutionFixture(t), first = [...f.packages][0];
  assert.equal(packageShardsReady(f.root).ready, true);
  f.write(first[0], first[1].replace('context', 'changed'));
  assert.equal(packageShardsReady(f.root).ready, false, 'same path with replaced bytes must be distinguished');
  f.write(first[0], first[1]);
  fs.unlinkSync(path.join(f.root, first[0]));
  assert.equal(packageShardsReady(f.root).ready, false, 'one absent referenced shard requires preparation');
  fs.symlinkSync('missing-target.json', path.join(f.root, first[0]));
  assert.throws(() => packageShardsReady(f.root), /symlink is forbidden/, 'a broken symlink is not treated as a safe missing file');
  fs.unlinkSync(path.join(f.root, first[0]));
  f.write(first[0], first[1]);
  f.write('archive/data/archive2-source-verification-index.json', '{}\n');
  assert.throws(() => packageShardsReady(f.root), /not bound to the current manifest/);
});

test('missing package shards invoke the official temporary builder once and verify its resulting bytes', t => {
  const f = scopedExecutionFixture(t), first = [...f.packages][0];
  fs.unlinkSync(path.join(f.root, first[0]));
  const calls = [];
  assert.equal(runScopedTests({ root: f.root, scopeFile: f.scopeFile, availableCommands: [f.command],
    run: (_node, args) => { calls.push(args); if (args.includes('--package-only')) f.write(first[0], first[1]); return { status: 0 }; } }), true);
  assert.equal(calls.filter(args => args.includes('--package-only')).length, 1);
  assert.equal(calls.length, 2);
  fs.unlinkSync(path.join(f.root, first[0]));
  assert.throws(() => runScopedTests({ root: f.root, scopeFile: f.scopeFile, availableCommands: [f.command],
    run: () => ({ status: 0 }) }), /did not produce the indexed bytes/, 'a zero exit code cannot replace the output byte check');
});

test('scoped execution fails on malformed metadata and missing selected tests before running any command', t => {
  const malformed = scopedExecutionFixture(t, '{invalid');
  let calls = 0;
  assert.throws(() => runScopedTests({ root: malformed.root, scopeFile: malformed.scopeFile,
    availableCommands: [malformed.command], run: () => { calls++; return { status: 0 }; } }), SyntaxError);
  assert.equal(calls, 0);
  const missing = scopedExecutionFixture(t);
  fs.unlinkSync(path.join(missing.root, missing.command.args.at(-1)));
  assert.throws(() => runScopedTests({ root: missing.root, scopeFile: missing.scopeFile,
    availableCommands: [missing.command], run: () => { calls++; return { status: 0 }; } }), /selected check is missing/);
  assert.equal(calls, 0, 'missing-path behavior of node --test cannot fabricate a scoped PASS');
});

test('selected failures remain blocking and the existing command timeout is unchanged', t => {
  const f = scopedExecutionFixture(t);
  const calls = [];
  assert.throws(() => runScopedTests({ root: f.root, scopeFile: f.scopeFile, availableCommands: [f.command],
    run: (_node, args, options) => { calls.push({ args, options }); return { status: args.includes('--test') ? 1 : 0 }; } }), /Scoped checks failed/);
  assert.equal(calls.length, 1, 'only the selected test runs; already generated byte-bound shards are reused');
  assert.equal(calls[0].options.timeout, f.command.timeout);
  assert.deepEqual(calls[0].args, f.command.args);
  const tampered = { ...f.plan, checks: { ...f.plan.checks, workerDependencies: false } };
  fs.writeFileSync(f.scopeFile, JSON.stringify(tampered));
  assert.throws(() => readScope(f.scopeFile, f.root), /no longer matches snapshot: checks/);
});

test('workflow conditions preserve output/checker Chrome and metadata shared-Consumer prerequisites', () => {
  const ci = read('.github/workflows/ci.yml');
  const runtime = read('.github/workflows/archive2-runtime-guard.yml');
  assert.match(ci, /name: Install Worker test dependencies\n\s+if: steps\.scope\.outputs\.worker_dependencies == 'true'/);
  assert.match(ci, /github\.event_name == 'push' && steps\.scope\.outputs\.prepare_projection == 'true'/);
  assert.match(runtime, /name: Verify original routes, response budgets, and storage failures\n\s+if: steps\.scope\.outputs\.runtime_contract == 'true'/);
  assert.match(runtime, /name: Compare 50 real solutions and verify asset failures in actual Chrome\n\s+if: steps\.scope\.outputs\.solution_browser == 'true'/);
  assert.match(runtime, /name: Verify the changed scoped browser checker on one existing original\n\s+if: steps\.scope\.outputs\.scoped_browser_changed == 'true'/);
  assert.match(runtime, /name: Load and print the changed original sources in actual Chrome\n\s+if: steps\.scope\.outputs\.mode == 'archive-content'/);
  assert.match(runtime, /Shared Meta and registration-preview Chrome checks retain their own policies/);
  assert.doesNotMatch(runtime, /continue-on-error: true/);
});

test('playground-only changes execute project and portal link tests without Archive generation', () => {
  const scope = { ...classifyPaths(['apmath/playground/next/kit/a.js']), changedFiles: ['apmath/playground/new.test.mjs'] };
  assert.equal(scope.mode, 'playground');
  const commands = commandsForScope(scope).flat().join('\n');
  assert.match(commands, /student-portal-geometry-lab-entry/);
  assert.match(commands, /apmath\/playground\/new.test.mjs/);
  assert.doesNotMatch(commands, /archive\/|build-archive2|geometry-equation/);
  assert.equal(commandsForScope({ mode: 'full' }), null);
  assert.throws(() => commandsForScope({ mode: 'unknown' }), /unknown/);
});

test('a later unrelated main merge cannot change the event base or broaden source validation', t => {
  const f = fixture(t); const before = f.plan();
  f.git('switch', '-q', 'main'); f.write('apmath/another.js', 'later'); f.git('add', '.'); f.git('commit', '-qm', 'other merge');
  f.git('update-ref', 'refs/remotes/origin/main', 'HEAD'); f.git('switch', '-q', 'pr');
  assert.deepEqual(f.plan(), before);
  assert.equal(before.mode, 'archive-content'); assert.deepEqual(before.changedFiles, [source]);
});

test('same event is deterministic; persisted plans reject a different checkout or changed dependency scope', t => {
  const f = fixture(t); const plan = f.plan();
  const file = path.join(os.tmpdir(), 'scope-' + f.headSha + '.json'); t.after(() => fs.rmSync(file, { force: true }));
  fs.writeFileSync(file, JSON.stringify(plan)); assert.deepEqual(readScope(file, f.root), plan);
  assert.deepEqual(f.plan(), plan);
  f.write('archive/engine.js', 'output engine'); f.git('add', '.'); f.git('commit', '-qm', 'engine change');
  assert.throws(() => readScope(file, f.root), /does not match/);
  const updated = planCiScope({ root: f.root, baseSha: f.baseSha }); assert.equal(updated.mode, 'full');
});

test('a solution SVG-only replacement resolves real source consumers at the exact Git snapshot', t => {
  const f = fixture(t, { [asset]: '<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0L1 1"/></svg>' });
  const plan = f.plan(); assert.equal(plan.mode, 'archive-content');
  assert.deepEqual(plan.sources, [source]); assert.deepEqual(plan.assets, [asset]);
  f.write('archive/generated/bank.js', `window.questions=[{solutionImage:'assets/images/example/solution.svg'}];`);
  f.git('add', '.'); f.git('commit', '-qm', 'shared generated consumer');
  assert.equal(planCiScope({ root: f.root, baseSha: f.baseSha }).mode, 'full');
});

test('missing event identities and an unrelated PR base cannot become a scoped success', t => {
  const f = fixture(t);
  assert.throws(() => planCiScope({ root: f.root, eventName: 'pull_request', event: {} }), /exact event/);
  assert.throws(() => planCiScope({ root: f.root, expectedSha: f.baseSha }), /does not match/);
  assert.throws(() => planCiScope({ root: f.root, eventName: 'pull_request', event: { pull_request: { base: { sha: 'a'.repeat(40) }, head: { sha: f.headSha } } } }));
  assert.equal(planCiScope({ root: f.root, eventName: 'workflow_dispatch' }).mode, 'full');
});
