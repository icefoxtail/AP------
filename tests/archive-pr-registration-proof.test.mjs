import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { CI_WORKFLOW_PATH, REGISTRATION_CHECKS, producePrRegistrationProof,
  validateLocalRegistrationProof, consumePrRegistrationProof, registrationProofArtifactName,
  decodeRegistrationProofArtifact, createGitHubProofReader, prRegistrationProofNeeded,
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
    CI_WORKFLOW_PATH, ...REGISTRATION_CHECKS.map(check => check.file)]) {
    assert.equal(prRegistrationProofNeeded([file]), true, file);
  }
  for (const files of [undefined, null, {}, [null], [''], ['../archive/exams/new.js'],
    ['archive\\exams\\new.js'], ['/archive/exams/new.js'], ['apmath/playground/app.js\n']]) {
    assert.equal(prRegistrationProofNeeded(files), true, JSON.stringify(files));
  }
});

test('every existing Sync path can obtain CI proof, including the relocated advisory checkers', () => {
  const workflow = fs.readFileSync(new URL('../.github/workflows/archive-registration-sync.yml', import.meta.url), 'utf8');
  const paths = workflow.slice(workflow.indexOf('    paths:'), workflow.indexOf('\npermissions:'));
  const globs = [...paths.matchAll(/^\s+- "([^"]+)"$/gm)].map(match => match[1]);
  assert.ok(globs.length > 20, 'the existing trigger scope must be inspected');
  for (const glob of globs) {
    const file = glob.replaceAll('**', 'fixture/nested').replaceAll('*', 'fixture');
    assert.equal(prRegistrationProofNeeded([file]), true, `Sync would wait without producer: ${glob}`);
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
    'tools/ci/push-touches-paths.mjs', CI_WORKFLOW_PATH, '.github/workflows/archive-registration-sync.yml'];
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

function zip(proof, member = 'proof.json', extra = false) {
  const code = 'import io,sys,zipfile\nb=io.BytesIO()\nz=zipfile.ZipFile(b,"w",compression=zipfile.ZIP_DEFLATED)\nz.writestr(sys.argv[1],sys.stdin.buffer.read())\n' +
    (extra ? 'z.writestr("unrequested.txt","not a proof")\n' : '') + 'z.close()\nsys.stdout.buffer.write(b.getvalue())\n';
  const result = spawnSync('python3', ['-c', code, member], { input: JSON.stringify(proof) });
  assert.equal(result.status, 0, String(result.stderr));
  return result.stdout;
}

function network(f, proof, { mutateRun, mutateArtifact, mutateProof, jobs, omitArtifact = false, rawZip } = {}) {
  const payload = clone(proof); mutateProof?.(payload);
  const bytes = rawZip || zip(payload);
  const run = { id: 41, run_attempt: 1, event: 'pull_request', path: CI_WORKFLOW_PATH,
    repository: clone(f.event.repository), head_sha: f.event.pull_request.head.sha,
    pull_requests: [clone(f.event.pull_request)], status: 'completed', conclusion: 'success' };
  mutateRun?.(run);
  const artifact = { id: 71, name: registrationProofArtifactName(f.options().expectedSha, run.run_attempt),
    expired: false, size_in_bytes: bytes.length, digest: `sha256:${sha256(bytes)}`,
    workflow_run: { id: run.id, repository_id: 101, head_repository_id: 101, head_sha: f.event.pull_request.head.sha } };
  mutateArtifact?.(artifact);
  const requests = [];
  const getJson = async route => {
    requests.push(route);
    if (route.includes('/workflows/ci.yml/runs?')) return { workflow_runs: [run] };
    if (route.includes('/jobs?')) return { jobs: jobs || [{ name: 'test', status: 'completed', conclusion: 'success' }] };
    if (route.includes('/artifacts?')) return { artifacts: omitArtifact ? [] : [artifact] };
    if (route.endsWith(`/actions/runs/${run.id}`)) return run;
    throw Error(`UNEXPECTED_FIXTURE_ROUTE:${route}`);
  };
  const getArtifact = async route => { requests.push(route); return bytes; };
  const consume = extra => consumePrRegistrationProof({ ...f.options(), getJson, getArtifact, timeoutMs: 0, ...extra });
  return { run, artifact, bytes, getJson, getArtifact, requests, consume };
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

test('a valid remote proof never authorizes skipping a build in an unprepared checkout', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const n = network(f, proof), before = f.git('status', '--porcelain');
  const result = await n.consume();
  assert.equal(result.state, 'REUSED'); assert.equal(result.chrome, 'NOT_INCLUDED');
  assert.equal(result.artifactDigest, n.artifact.digest);
  assert.equal(f.git('status', '--porcelain'), before);
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof: result.proof }), /OUTPUT_MISMATCH/);
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

test('ignored untracked source files cannot masquerade as the fixed registered input', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  f.write('archive/exams/ignored.js', 'hidden source input');
  assert.equal(f.git('status', '--porcelain'), '', 'git status alone cannot detect this input');
  assert.throws(() => f.produce(), /UNREGISTERED_IGNORED_REGISTRATION_INPUT/);
  await assert.rejects(network(f, proof).consume(), /UNREGISTERED_IGNORED_REGISTRATION_INPUT/);
});

test('new ignored allowlisted outputs also invalidate local proof reuse', t => {
  const f = fixture(t), proof = f.produce();
  fs.appendFileSync(path.join(f.root, '.git/info/exclude'), '\narchive/data/meta-foundation/runtime/extra.json\n');
  f.write('archive/data/meta-foundation/runtime/extra.json', '{"newOutput":"not verified"}\n');
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /OUTPUT_MISMATCH/);
});

test('an old PASS with a newly attached source SHA or checker SHA is rejected', async t => {
  for (const [file, label] of [['archive/exams/original/new.js', 'source'],
    ['archive/tools/build-archive2-catalog.mjs', 'generator'],
    [REGISTRATION_CHECKS[0].file, 'checker'], [CI_WORKFLOW_PATH, 'workflow']]) {
    await t.test(label, async st => {
      const f = fixture(st), proof = f.produce();
      const headSha = f.commit(file, 'changed bytes under the same path\n');
      // Deliberately reproduce the prohibited trick: retain the old verdict but
      // attach the new SHA. The Git blob input/checker digest still rejects it.
      proof.context.headSha = headSha; proof.context.checkoutSha = headSha;
      await assert.rejects(network(f, proof).consume(), /INPUT_OR_CHECKER_MISMATCH/);
    });
  }
});

test('an unrelated later origin/main move does not invalidate the fixed event proof', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  f.git('switch', '-q', 'main'); f.write('unrelated.txt', 'another worker');
  f.git('add', '--', 'unrelated.txt'); f.git('commit', '-qm', 'unrelated main advance');
  f.git('update-ref', 'refs/remotes/origin/main', 'HEAD'); f.git('switch', '-q', 'source-pr');
  assert.equal((await network(f, proof).consume()).state, 'REUSED');
});

test('a NO_OP preparation may verify data but cannot suppress the catalog pre-step', t => {
  const f = fixture(t, CI_WORKFLOW_PATH), proof = f.produce();
  assert.equal(proof.preparation.state, 'NO_OP');
  assert.equal(f.calls.some(call => call[0] === 'python3'), false);
  assert.throws(() => validateLocalRegistrationProof({ ...f.options(), proof }), /CATALOG_NOT_PREPARED/);
});

test('only a completed successful real CI test job can supply a proof', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  for (const conclusion of ['failure', 'cancelled', 'timed_out', 'skipped', null]) {
    await assert.rejects(network(f, proof, { mutateRun: run => { run.conclusion = conclusion; } }).consume(), /CI_REGISTRATION_PROOF_RUN_/);
  }
  for (const jobs of [[], [{ name: 'plan', status: 'completed', conclusion: 'success' }],
    [{ name: 'test', status: 'completed', conclusion: 'skipped' }]]) {
    await assert.rejects(network(f, proof, { jobs }).consume(), /TEST_JOB_NOT_SUCCESS/);
  }
});

test('run lookup binds repository, PR number, event base, head and workflow', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const mutations = [run => { run.repository.full_name = 'other/repository'; },
    run => { run.repository.id = 999; }, run => { run.pull_requests[0].number = 18; },
    run => { run.pull_requests[0].base.sha = 'f'.repeat(40); },
    run => { run.head_sha = 'e'.repeat(40); }, run => { run.event = 'push'; },
    run => { run.path = '.github/workflows/other.yml'; }];
  for (const mutateRun of mutations) {
    const n = network(f, proof, { mutateRun });
    await assert.rejects(n.consume(), /WAIT_TIMEOUT/);
    assert.equal(n.requests.some(route => route.endsWith('/zip')), false);
  }
});

test('waiting uses bounded intervals, and missing CI never becomes PASS', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const n = network(f, proof); let clock = 0, reads = 0;
  const sleeps = [], notices = [];
  const result = await n.consume({ timeoutMs: 90000, now: () => clock,
    getJson: async route => {
      if (route.includes('/workflows/')) {
        reads++;
        if (reads <= 2) return { workflow_runs: [{ ...n.run, status: 'in_progress', conclusion: null }] };
      }
      return n.getJson(route);
    }, sleep: async ms => { sleeps.push(ms); clock += ms; }, onWait: item => notices.push(item) });
  assert.equal(result.state, 'REUSED'); assert.deepEqual(sleeps, [30000, 30000]);
  assert.equal(notices.length, 2);
  clock = 0; reads = 0; sleeps.length = 0;
  await assert.rejects(n.consume({ timeoutMs: 60000, now: () => clock,
    getJson: async () => { reads++; return { workflow_runs: [] }; },
    sleep: async ms => { sleeps.push(ms); clock += ms; } }), /WAIT_TIMEOUT/);
  assert.equal(reads, 3); assert.deepEqual(sleeps, [30000, 30000]);
  await assert.rejects(n.consume({ pollMs: 1000 }), /WAIT_BOUND_INVALID/);
});

test('missing, expired, foreign, digestless and wrong-attempt artifacts are rejected', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  await assert.rejects(network(f, proof, { omitArtifact: true }).consume(), /ARTIFACT_MISSING/);
  for (const mutateArtifact of [artifact => { artifact.expired = true; },
    artifact => { delete artifact.digest; }, artifact => { artifact.workflow_run.id = 999; },
    artifact => { artifact.workflow_run.repository_id = 999; },
    artifact => { artifact.workflow_run.head_repository_id = 999; },
    artifact => { artifact.workflow_run.head_sha = 'c'.repeat(40); }]) {
    await assert.rejects(network(f, proof, { mutateArtifact }).consume(), /ARTIFACT_INVALID/);
  }
  await assert.rejects(network(f, proof, { mutateRun: run => { run.run_attempt = 2; } }).consume(), /RUN_MISMATCH/);
});

test('required check outcomes, strict metadata schema and exact producer cannot be forged', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const cases = [[item => { item.status = 'FAIL'; }, /NOT_PASS/],
    [item => { item.checks.pop(); }, /CHECKS_INCOMPLETE/],
    [item => { item.checks[0].outcome = 'skipped'; }, /CHECKS_INCOMPLETE/],
    [item => { item.producer.runId = 123; }, /RUN_MISMATCH/],
    [item => { item.producer.jobName = 'plan'; }, /PRODUCER_INVALID/],
    [item => { item.rawStudentContent = 'must never be accepted'; }, /SCHEMA_INVALID/],
    [item => { item.context.checkoutSha = 'a'.repeat(40); }, /CONTEXT_MISMATCH/],
    [item => { item.outputs.digest = 'not a digest'; }, /OUTPUT_INVALID/]];
  for (const [mutateProof, pattern] of cases) await assert.rejects(network(f, proof, { mutateProof }).consume(), pattern);
});

test('changing generated output digest inside an artifact fails its API digest binding', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const n = network(f, proof);
  const forged = clone(proof); forged.outputs.digest = '0'.repeat(64);
  await assert.rejects(n.consume({ getArtifact: async () => zip(forged) }), /ARTIFACT_DIGEST_MISMATCH/);
  const before = f.git('status', '--porcelain');
  await assert.rejects(n.consume({ getArtifact: async () => Buffer.alloc(0) }), /ARTIFACT_DIGEST_MISMATCH/);
  assert.equal(f.git('status', '--porcelain'), before);
});

test('artifact decoding is bounded and never extracts extra or traversing members', t => {
  const f = fixture(t), proof = f.produce();
  assert.equal(decodeRegistrationProofArtifact(zip(proof)).status, 'PASS');
  assert.throws(() => decodeRegistrationProofArtifact(zip(proof, '../proof.json')), /ARTIFACT_INVALID/);
  assert.throws(() => decodeRegistrationProofArtifact(zip(proof, 'proof.json', true)), /ARTIFACT_INVALID/);
  assert.throws(() => decodeRegistrationProofArtifact(Buffer.alloc(256 * 1024 + 1)), /SIZE_INVALID/);
  assert.throws(() => decodeRegistrationProofArtifact(zip({ huge: 'x'.repeat(65 * 1024) })), /ARTIFACT_INVALID/);
});

test('a rerun or local source change during retrieval invalidates the consumed proof', async t => {
  const f = fixture(t), proof = f.produce(); f.clean();
  const n = network(f, proof);
  await assert.rejects(n.consume({ getJson: async route => {
    const result = await n.getJson(route);
    return route.endsWith('/actions/runs/41') ? { ...result, status: 'in_progress', conclusion: null, run_attempt: 2 } : result;
  } }), /RUN_CHANGED/);
  await assert.rejects(n.consume({ getArtifact: async route => {
    f.write('archive/exams/original/new.js', 'concurrent source mutation');
    return n.getArtifact(route);
  } }), /CLEAN_REGISTRATION_CHECKOUT_REQUIRED/);
});

test('the HTTP reader only makes GET requests and strips authorization at the signed redirect', async () => {
  const calls = [], payload = Buffer.from('bounded fixture bytes');
  const reader = createGitHubProofReader({ token: 'fixture-token', fetchImpl: async (url, options) => {
    calls.push({ url, options });
    if (url.endsWith('/zip')) return new Response(null, { status: 302, headers: { location: 'https://storage.example.invalid/artifact?signature=fixture' } });
    if (url.startsWith('https://storage.')) return new Response(payload);
    return new Response(JSON.stringify({ workflow_runs: [] }));
  } });
  assert.deepEqual(await reader.getJson('/repos/o/r/actions/workflows/ci.yml/runs'), { workflow_runs: [] });
  assert.deepEqual(await reader.getArtifact('/repos/o/r/actions/artifacts/1/zip'), payload);
  assert.ok(calls.every(call => call.options.method === 'GET'));
  assert.equal(calls[0].options.headers.Authorization, 'Bearer fixture-token');
  assert.equal(calls[2].options.headers, undefined);
  assert.equal(calls[2].options.redirect, 'error');
});

test('HTTP errors, unsafe redirects and oversized responses fail without a fallback PASS', async () => {
  const failing = createGitHubProofReader({ fetchImpl: async () => new Response('', { status: 403 }) });
  await assert.rejects(failing.getJson('/repos/o/r/actions/runs'), /HTTP_403/);
  const redirect = createGitHubProofReader({ fetchImpl: async () => new Response(null, { status: 302,
    headers: { location: 'http://storage.example.invalid/artifact' } }) });
  await assert.rejects(redirect.getArtifact('/repos/o/r/actions/artifacts/1/zip'), /REDIRECT_INVALID/);
  const oversized = createGitHubProofReader({ fetchImpl: async () => new Response(Buffer.alloc(256 * 1024 + 1)) });
  await assert.rejects(oversized.getArtifact('/repos/o/r/actions/artifacts/1/zip'), /RESPONSE_TOO_LARGE/);
});
