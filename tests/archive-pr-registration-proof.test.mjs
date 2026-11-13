import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { CI_WORKFLOW_PATH, REGISTRATION_CHECKS, producePrRegistrationProof,
  validateLocalRegistrationProof, prRegistrationProofNeeded,
} from '../tools/ci/archive-pr-registration-proof.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const clone = object => JSON.parse(JSON.stringify(object));

test('proof production follows registration inputs and direct checkers, not unrelated projects', () => {
  for (const files of [[], ['apmath/playground/index.html'],
    ['apmath/playground/app.js', 'apmath/playground/.gitignore', 'apmath/playground/.gitattributes'],
    ['eie/index.html', 'docs/meeting-notes.md']]) {
    assert.equal(prRegistrationProofNeeded(files), false, JSON.stringify(files));
  }
  for (const file of ['archive/exams/original/new.js', 'archive/assets/images/same-path.svg',
    'archive/data/question_metadata.json', 'archive/tools/build-archive2-catalog.mjs',
    'shared/js/common-output.js', 'alive/06_EXECUTION/H1_SCHOOL_EXPANSION/source.json',
    'docs/rules/01_CANONICAL/taxonomy/units.json', 'tools/lib/canonical.mjs', '.gitignore',
    'tools/ci/archive-pr-registration-proof.mjs', 'tests/archive-pr-registration-proof.test.mjs',
    '.archive-meta-register/inbox/reviewed-exam.json', 'tools/ci/archive-pr-native-preview.mjs',
    'tests/archive-pr-native-preview.test.mjs',
    CI_WORKFLOW_PATH, ...REGISTRATION_CHECKS.map(check => check.file)]) {
    assert.equal(prRegistrationProofNeeded([file]), true, file);
  }
  for (const files of [undefined, null, {}, [null], [''], ['../archive/exams/new.js'],
    ['archive\\exams\\new.js'], ['/archive/exams/new.js'], ['apmath/playground/app.js\n']]) {
    assert.equal(prRegistrationProofNeeded(files), true, JSON.stringify(files));
  }
});

function fixture(t, changedFile = 'archive/exams/original/new.js') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'registration-proof-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), text); };
  const git = (...args) => {
    const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  git('init', '-q', '--initial-branch=main');
  git('config', 'user.name', 'fixture'); git('config', 'user.email', 'fixture@example.invalid');
  git('config', 'commit.gpgsign', 'false');
  const dependencyFiles = [...REGISTRATION_CHECKS.map(check => check.file), 'archive/build_db.py',
    'archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs', 'archive/tools/build-archive2-catalog.mjs',
    'tools/ci/archive-pr-registration-prepare.mjs', 'tools/ci/archive-pr-registration-proof.mjs',
    'tools/ci/archive-pr-native-preview.mjs',
    'tools/ci/push-touches-paths.mjs', CI_WORKFLOW_PATH];
  for (const file of dependencyFiles) write(file, '// fixed fixture dependency\n');
  write('tools/ci/archive-pages-registration.paths', 'archive/db.js\narchive/data/archive2-catalog.json\narchive/data/archive2-canonical-input-manifest.json\narchive/data/meta-foundation/runtime/*.json\n');
  write('.gitignore', 'archive/data/archive2-source-verification/mixed-v1/\narchive/exams/ignored.js\nnode_modules/\n');
  write('archive/db.js', 'old projection\n');
  write('archive/data/archive2-catalog.json', '{"projection":"old"}\n');
  const manifest = includeRuntime => write('archive/data/archive2-canonical-input-manifest.json', JSON.stringify({
    schemaVersion: 'archive2-canonical-input-manifest-v1',
    files: ['data/archive2-catalog.json', ...(includeRuntime ? ['data/meta-foundation/runtime/new.json'] : [])]
      .map(file => ({ path: file, sha256: sha256(fs.readFileSync(path.join(root, 'archive', file))) })),
  }) + '\n');
  manifest(false);
  git('add', '.'); git('commit', '-qm', 'baseline');
  const baseSha = git('rev-parse', 'HEAD');
  git('switch', '-qc', 'source-pr');
  write(changedFile, 'fixture source bytes; never embed these in proof\n');
  git('add', '--', changedFile); git('commit', '-qm', 'source change');
  let headSha = git('rev-parse', 'HEAD');
  const repo = 'owner/repository';
  const event = { number: 17, repository: { id: 101, full_name: repo }, pull_request: {
    number: 17, base: { sha: baseSha, repo: { id: 101 } }, head: { sha: headSha, repo: { id: 101 } },
  } };
  const calls = [];
  const run = (program, args) => {
    calls.push([program, ...args]);
    if (program === 'git') {
      const result = spawnSync(program, args, { cwd: root, encoding: 'utf8' });
      if (result.status !== 0) throw Error(`FIXTURE_GIT_FAILED:${args.join(' ')}`);
      return result.stdout;
    }
    if (program === 'python3') {
      write('archive/db.js', 'fresh projection\n');
      write('archive/data/archive2-catalog.json', '{"projection":"fresh"}\n');
      write('archive/data/meta-foundation/runtime/new.json', '{"projection":"fresh"}\n');
      write('archive/data/archive2-source-verification/mixed-v1/shard.json', '{"ignoredPackageShard":true}\n');
      manifest(true);
    }
    if (args[0] === 'archive/tools/build-archive2-catalog.mjs') manifest(true);
    return '';
  };
  const options = () => ({ root, repo, event, expectedSha: headSha });
  const produce = extra => producePrRegistrationProof({ ...options(), runId: 41, runAttempt: 1, run, ...extra });
  const clean = () => {
    git('reset', '--hard', 'HEAD');
    fs.rmSync(path.join(root, 'archive/data/meta-foundation/runtime'), { recursive: true, force: true });
    fs.rmSync(path.join(root, 'archive/data/archive2-source-verification/mixed-v1'), { recursive: true, force: true });
  };
  const commit = (file, content) => {
    clean(); write(file, content); git('add', '--', file); git('commit', '-qm', 'changed input or checker');
    headSha = git('rev-parse', 'HEAD'); event.pull_request.head.sha = headSha;
    return headSha;
  };
  return { root, repo, event, baseSha, write, git, calls, run, options, produce, clean, commit };
}

test('producer uses the existing preparation once, verifies all required data checks, and creates no commit', t => {
  const f = fixture(t), before = f.git('rev-parse', 'HEAD');
  const proof = f.produce();
  assert.equal(proof.status, 'PASS'); assert.equal(proof.scope, 'registration-data-only');
  assert.equal(proof.preparation.state, 'PREPARED');
  assert.equal(proof.preparation.generatedPathCount, 4);
  assert.equal(proof.preparation.catalogStabilized, false);
  assert.equal(proof.outputs.fileCount, 5, 'ignored mixed package shards also bind local catalog reuse');
  assert.deepEqual(f.calls.filter(call => call[0] !== 'git').map(call => call.slice(1)), [
    ['archive/tools/meta-foundation/materialize-meta-v2-payloads.mjs', '--write'], ['archive/build_db.py'],
    ...REGISTRATION_CHECKS.map(check => [check.file]),
  ]);
  assert.equal(f.git('rev-parse', 'HEAD'), before);
  assert.equal(f.git('rev-list', '--count', `${f.baseSha}..HEAD`), '1');
  assert.equal(JSON.stringify(proof).includes('fixture source bytes'), false);
  assert.equal(validateLocalRegistrationProof({ ...f.options(), proof, runId: 41, runAttempt: 1 }).reusable, true);
});

test('final runtime readiness changes cause only the necessary catalog stabilization', t => {
  const f = fixture(t);
  const proof = f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (program === 'python3') f.write('archive/data/meta-foundation/runtime/new.json', '{"readiness":"new final input"}\n');
    return result;
  } });
  assert.equal(proof.preparation.catalogStabilized, true);
  assert.equal(f.calls.filter(call => call[1] === 'archive/tools/build-archive2-catalog.mjs').length, 1);
  assert.equal(validateLocalRegistrationProof({ ...f.options(), proof }).catalogAndPackagePrepared, true);
});

test('a final catalog that remains stale or loses a manifest input cannot issue proof', t => {
  const f = fixture(t);
  assert.throws(() => f.produce({ run: (program, args) => {
    if (args[0] === 'archive/tools/build-archive2-catalog.mjs') return '';
    const result = f.run(program, args);
    if (program === 'python3') f.write('archive/data/meta-foundation/runtime/new.json', '{"readiness":"stale"}\n');
    return result;
  } }), /CATALOG_DID_NOT_STABILIZE/);
  f.clean();
  assert.throws(() => f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (program === 'python3') fs.unlinkSync(path.join(f.root, 'archive/data/meta-foundation/runtime/new.json'));
    return result;
  } }), /CATALOG_INPUT_MISSING/);
});

test('local catalog reuse rejects changed generated bytes, staged output, deleted and ignored shards', t => {
  const f = fixture(t), proof = f.produce();
  for (const file of ['archive/db.js', 'archive/data/archive2-source-verification/mixed-v1/shard.json']) {
    const original = fs.readFileSync(path.join(f.root, file));
    f.write(file, 'different bytes\n');
    if (file === 'archive/db.js') f.git('add', '--', file);
    assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /OUTPUT_MISMATCH/);
    f.write(file, original);
    if (file === 'archive/db.js') f.git('reset', '--', file);
  }
  fs.unlinkSync(path.join(f.root, 'archive/data/archive2-source-verification/mixed-v1/shard.json'));
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /OUTPUT_MISMATCH/);
});

test('a proof is not reusable in a checkout that lacks its generated outputs', t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /OUTPUT_MISMATCH/);
});

test('producer refuses dirty, staged source and generator/validator mutations', t => {
  const f = fixture(t);
  f.write('unfinished.txt', 'keep this work');
  assert.throws(() => f.produce(), /CLEAN_REGISTRATION_CHECKOUT_REQUIRED/);
  fs.unlinkSync(path.join(f.root, 'unfinished.txt'));
  assert.throws(() => f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (program === 'python3') {
      f.write('archive/exams/original/new.js', 'unexpected generator mutation');
      f.git('add', '--', 'archive/exams/original/new.js');
    }
    return result;
  } }), /changed non-derived files/);
  f.clean();
  assert.throws(() => f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (args[0] === REGISTRATION_CHECKS[0].file) f.write('archive/db.js', 'validator changed output');
    return result;
  } }), /REGISTRATION_VALIDATOR_CHANGED_OUTPUT/);
});

test('missing dependencies, incorrect checkout and failed checks cannot produce PASS', t => {
  const f = fixture(t);
  assert.throws(() => f.produce({ expectedSha: f.baseSha }), /CHECKOUT_MISMATCH/);
  assert.throws(() => f.produce({ run: (program, args) => {
    if (args[0] === REGISTRATION_CHECKS[2].file) throw Error('EXPECTED_REQUIRED_CHECK_FAILURE');
    return f.run(program, args);
  } }), /EXPECTED_REQUIRED_CHECK_FAILURE/);
  f.clean(); f.git('rm', '--', REGISTRATION_CHECKS[2].file); f.git('commit', '-qm', 'missing checker');
  const expectedSha = f.git('rev-parse', 'HEAD'); f.event.pull_request.head.sha = expectedSha;
  assert.throws(() => f.produce({ expectedSha }), /DEPENDENCY_MISSING/);
});

test('symlinked generated output is rejected without hashing an external file', t => {
  const f = fixture(t);
  assert.throws(() => f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (program === 'python3') {
      fs.unlinkSync(path.join(f.root, 'archive/db.js'));
      fs.symlinkSync(path.join(f.root, 'archive/exams/original/new.js'), path.join(f.root, 'archive/db.js'));
    }
    return result;
  } }), /OUTPUT_SYMLINK_FORBIDDEN/);
});

test('ignored untracked source files cannot masquerade as the fixed registered input', t => {
  const f = fixture(t); f.produce(); f.clean();
  f.write('archive/exams/ignored.js', 'hidden source input');
  assert.equal(f.git('status', '--porcelain'), '', 'git status alone cannot detect this input');
  assert.throws(() => f.produce(), /UNREGISTERED_IGNORED_REGISTRATION_INPUT/);
});

test('new ignored allowlisted outputs also invalidate local proof reuse', t => {
  const f = fixture(t), proof = f.produce();
  fs.appendFileSync(path.join(f.root, '.git/info/exclude'), '\narchive/data/meta-foundation/runtime/extra.json\n');
  f.write('archive/data/meta-foundation/runtime/extra.json', '{"newOutput":"not verified"}\n');
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /OUTPUT_MISMATCH/);
});

test('an old PASS with a newly attached source SHA or checker SHA is rejected', t => {
  for (const [file, label] of [['archive/exams/original/new.js', 'source'],
    ['archive/tools/build-archive2-catalog.mjs', 'generator'],
    [REGISTRATION_CHECKS[0].file, 'checker'], [CI_WORKFLOW_PATH, 'workflow']]) {
    const f = fixture(t), proof = f.produce();
    const headSha = f.commit(file, 'changed bytes under the same path\n');
    // Deliberately reproduce the prohibited trick: retain the old verdict but
    // attach the new SHA. The Git blob input/checker digest still rejects it.
    proof.context.headSha = headSha; proof.context.checkoutSha = headSha;
    assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /INPUT_OR_CHECKER_MISMATCH/, label);
  }
});

test('an unrelated later origin/main move does not invalidate the fixed event proof', t => {
  const f = fixture(t), proof = f.produce();
  f.git('switch', '-q', 'main'); f.write('unrelated.txt', 'another worker');
  f.git('add', '--', 'unrelated.txt'); f.git('commit', '-qm', 'unrelated main advance');
  f.git('update-ref', 'refs/remotes/origin/main', 'HEAD'); f.git('switch', '-q', 'source-pr');
  assert.equal(validateLocalRegistrationProof({ ...f.options(), proof }).reusable, true);
});

// Official manifest paths are relative to archive/ and include a legitimate ../docs/... authority input.
const DOCS_ROW = '../docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
function produceWithManifestRows(t, rows) {
  const f = fixture(t), docs = 'docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
  const content = '{"authority":"fixture"}\n';
  f.commit(docs, content);
  const manifestFile = path.join(f.root, 'archive/data/archive2-canonical-input-manifest.json');
  const resolved = rows.map(row => row === DOCS_ROW ? { path: row, sha256: sha256(content) }
    : { path: row, sha256: 'a'.repeat(64) });
  return f.produce({ run: (program, args) => {
    const result = f.run(program, args);
    if (program === 'python3') {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      manifest.files.push(...resolved);
      fs.writeFileSync(manifestFile, JSON.stringify(manifest) + '\n');
    }
    return result;
  } });
}

test('catalog manifest accepts the official ../docs authority row and rejects unsafe paths', t => {
  const proof = produceWithManifestRows(t, [DOCS_ROW]);
  assert.equal(proof.status, 'PASS');
  assert.equal(proof.preparation.catalogStabilized, false);
  for (const bad of ['../../etc/passwd', '/abs/file.json', 'a/./b', 'a//b', 'a\\b.json']) {
    assert.throws(() => produceWithManifestRows(t, [bad]), /REGISTRATION_CATALOG_MANIFEST_INVALID/, bad);
  }
});

test('a NO_OP preparation may verify data but cannot suppress the catalog pre-step', t => {
  const f = fixture(t, CI_WORKFLOW_PATH), proof = f.produce();
  assert.equal(proof.preparation.state, 'NO_OP');
  assert.equal(f.calls.some(call => call[0] === 'python3'), false);
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /CATALOG_NOT_PREPARED/);
});

test('required check outcomes, strict metadata schema and exact producer cannot be forged', t => {
  const f = fixture(t), proof = f.produce();
  const cases = [[item => { item.status = 'FAIL'; }, /NOT_PASS/],
    [item => { item.checks.pop(); }, /CHECKS_INCOMPLETE/],
    [item => { item.checks[0].outcome = 'skipped'; }, /CHECKS_INCOMPLETE/],
    [item => { item.producer.runId = 123; }, /RUN_MISMATCH/],
    [item => { item.producer.jobName = 'plan'; }, /PRODUCER_INVALID/],
    [item => { item.rawStudentContent = 'must never be accepted'; }, /SCHEMA_INVALID/],
    [item => { item.context.checkoutSha = 'a'.repeat(40); }, /CONTEXT_MISMATCH/],
    [item => { item.outputs.digest = 'not a digest'; }, /OUTPUT_INVALID/]];
  for (const [mutate, pattern] of cases) {
    const forged = clone(proof); mutate(forged);
    assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof: forged, runId: 41, runAttempt: 1 }), pattern);
  }
});
