// A pull request that changes original exam JS or meta carries only sources; the registrar writes the generated files after the merge.
// So the save round trip builds the ignored package shards from the checkout's own sources on a pull request, and keeps
// `--package-only` (registered files must match their inputs) after main registration and on manual runs.
// This test pins that split and shows the pull request path is not a weaker check: it is the same computation as --package-only
// (a broken exam JS still throws), minus only the comparison with registered bytes. Duplicate questionUid is guarded elsewhere
// (verify-archive-registration in the PR registration projection of ci.yml), unchanged by this split.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(repo, rel), 'utf8').replace(/\r\n/g, '\n');
const workflow = read('.github/workflows/archive2-save-roundtrip.yml');
const builder = read('archive/tools/build-archive2-catalog.mjs');

function steps(text) {
  const jobStart = text.indexOf('\n  save-round-trip:\n');
  assert.ok(jobStart >= 0, 'save-round-trip job exists');
  const body = text.slice(jobStart);
  const stepsStart = body.indexOf('\n    steps:\n');
  assert.ok(stepsStart >= 0, 'save-round-trip job has steps');
  const stepBody = body.slice(stepsStart);
  return stepBody.split(/\n      - /).slice(1).map(chunk => '- ' + chunk);
}

test('main save test starts after successful registration, not on an unregistered push', () => {
  assert.doesNotMatch(workflow, /^  push:/m);
  assert.match(workflow, /^  workflow_run:\n    workflows: \['Archive Main Auto Metadata'\]\n    types: \[completed\]\n    branches: \[main\]/m);
  assert.match(workflow, /if: needs\.scope\.outputs\.run_save == 'true'/);
  assert.match(workflow, /SOURCE_RESULT.*github\.event\.workflow_run\.conclusion/);
  assert.match(workflow, /SOURCE_EVENT.*github\.event\.workflow_run\.event/);
  assert.match(workflow, /count >= 300/, 'truncated commits must fail open to running the test');
  for (const path of [
    'archive/archive2-*.js', 'archive/workspace.html', 'archive/data/*', 'archive/problem-bank-*.js',
    'archive/tools/build-archive2-catalog.mjs', 'archive/tools/materialize-archive-package-shards.mjs',
    'archive/tools/meta-foundation/question-metadata-format.mjs',
    'archive/meta-foundation-runtime.js', 'archive/mixer-selector.js', 'archive/rpm-middle-toc.js',
    'archive/unit-past-exams-core.js', 'apmath/worker-backup/*',
    'tests/archive2-save-roundtrip.e2e.mjs', 'tests/archive-saved-papers-many-images.test.mjs',
    'tests/helpers/archive2-save-roundtrip-harness.mjs', 'tests/helpers/archive2-scope-harness.cjs',
    '.github/workflows/archive2-save-roundtrip.yml',
  ]) assert.ok(workflow.includes(path), `save-sensitive trigger path missing: ${path}`);
});

test('pull request builds the package shards from sources, main and manual runs keep --package-only', () => {
  const generate = steps(workflow).filter(step => /build-archive2-catalog\.mjs/.test(step));
  assert.equal(generate.length, 2, 'exactly one build step per event kind');
  const pr = generate.find(step => /github\.event_name == 'pull_request'/.test(step));
  const rest = generate.find(step => /github\.event_name != 'pull_request'/.test(step));
  assert.ok(pr && rest, 'one step for pull_request, one for every other event');
  assert.match(pr, /run: node archive\/tools\/build-archive2-catalog\.mjs\n?$/);
  assert.doesNotMatch(pr, /--package-only|--check/);
  assert.match(rest, /run: node archive\/tools\/build-archive2-catalog\.mjs --package-only\n?$/);
});

test('step names stay valid plain YAML scalars (a ": " inside one makes the whole workflow invalid and no job starts)', () => {
  for (const line of workflow.split('\n')) {
    const match = /^\s*(?:- )?name: (.*)$/.exec(line);
    if (match) assert.ok(!/: /.test(match[1]) && !/ #/.test(match[1]), `invalid plain scalar: ${line.trim()}`);
  }
});

test('the build step still runs before the save round trip test, and the test is unchanged', () => {
  const all = steps(workflow);
  const lastBuild = all.map((s, i) => (/build-archive2-catalog\.mjs/.test(s) ? i : -1)).filter(i => i >= 0).pop();
  const e2e = all.findIndex(s => /node --test tests\/archive2-save-roundtrip\.e2e\.mjs/.test(s));
  assert.ok(lastBuild >= 0 && e2e > lastBuild);
  assert.match(workflow, /fetch-depth: 0/);
});

test('the pull request path computes exactly what --package-only computes: the flag only picks the final output branch', () => {
  // Everything before the branch (reading and running every exam source, canonical identity, mixed lookup, manifests) is shared,
  // so a broken exam JS or a duplicate canonical identity stops both. Only the comparison with the registered bytes differs.
  const flagLines = builder.split('\n').map((line, i) => [i + 1, line]).filter(([, line]) => /packageOnly/.test(line));
  assert.equal(flagLines.length, 3, 'packageOnly is declared once, guarded once, and selects the output branch once');
  assert.match(builder, /const packageOnly = process\.argv\.includes\("--package-only"\);/);
  assert.ok(builder.indexOf('if (packageOnly) {') > builder.indexOf('const compactManifestTarget'), 'the branch comes after all computation');
  assert.match(builder, /throw new Error\("duplicate canonical identity"\)/);
  assert.match(builder, /vm\.runInContext\(source, scope, \{ filename: file, timeout: 3000 \}\)/);
  const defaultBranch = builder.slice(builder.indexOf('} else {\n  fs.writeFileSync(target, packedText);'));
  assert.match(defaultBranch, /mixedContextTarget, mixedContextText/);
  assert.match(defaultBranch, /mixedSourceShardTexts/);
  assert.match(defaultBranch, /mixedUidBucketTexts/);
  assert.ok(!/process\.argv\.includes\("--pull-request"\)|GITHUB_EVENT_NAME/.test(builder), 'no per-event branch inside the tool');
});
