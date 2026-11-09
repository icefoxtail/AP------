import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import { evidenceProvenance, bindLabSources, sha256 } from './high-evidence-binding.mjs';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'apmath-evidence-binding-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  git('init', '--quiet'); git('config', 'user.email', 'qa@example.invalid'); git('config', 'user.name', 'Evidence fixture');
  const put = (file, value) => { fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true }); fs.writeFileSync(path.join(root, file), value); };
  put('apmath/playground/next/labs/test.html', '<script src="../kit/core.js"></script><link rel="stylesheet" href="https://fonts.example.invalid/font.css"><script>window.answer=1;</script>');
  put('apmath/playground/next/kit/core.js', 'window.core=1;');
  put('apmath/playground/next/kit/apl-catalog.js', 'window.catalog=1;');
  git('add', 'apmath'); git('commit', '--quiet', '-m', 'candidate source'); const head = git('rev-parse', 'HEAD');
  put('unrelated.txt', 'merge checkout contains a newer unrelated file');
  git('add', 'unrelated.txt'); git('commit', '--quiet', '-m', 'tested checkout');
  return { root, put, head, tested: git('rev-parse', 'HEAD'), lab: { id: 'test', next: 'next/labs/test.html' } };
}

test('source bytes bind to the candidate head separately from the actual tested checkout', t => {
  const f = fixture(t), provenance = evidenceProvenance(f.root, { toolRoot: f.root, env: { APMATH_CANDIDATE_HEAD_SHA: f.head, GITHUB_REF: 'refs/pull/1/merge' } });
  assert.equal(provenance.candidateHeadSha, f.head); assert.equal(provenance.testedCheckoutSha, f.tested); assert.notEqual(f.head, f.tested);
  const binding = bindLabSources(f.root, f.lab, provenance);
  assert.equal(binding.candidateHeadSourceVerified, true);
  assert.equal(binding.files.length, 3);
  assert.equal(binding.htmlSha256, sha256(fs.readFileSync(path.join(f.root, binding.html))));
  assert.deepEqual(binding.externalResources, ['https://fonts.example.invalid/font.css']);
});

test('a source change or an unavailable head cannot borrow a reviewed head label', t => {
  const f = fixture(t), provenance = evidenceProvenance(f.root, { toolRoot: f.root, env: { APMATH_CANDIDATE_HEAD_SHA: f.head } });
  f.put('apmath/playground/next/kit/core.js', 'window.core=2;');
  const changed = bindLabSources(f.root, f.lab, provenance);
  assert.equal(changed.candidateHeadSourceVerified, false);
  assert.equal(changed.errors[0].reason, 'tested-source-differs-from-candidate-head');
  const missing = bindLabSources(f.root, f.lab, { ...provenance, candidateHeadSha: 'a'.repeat(40) });
  assert.equal(missing.candidateHeadSourceVerified, false);
  assert.ok(missing.errors.every(e => e.reason === 'candidate-head-source-unavailable'));
});

test('baseline observation keeps its own source identity and makes no candidate-byte assertion', t => {
  const f = fixture(t), provenance = evidenceProvenance(f.root, { baseline: true, toolRoot: f.root, env: { APMATH_CANDIDATE_HEAD_SHA: f.head } });
  const binding = bindLabSources(f.root, f.lab, provenance);
  assert.equal(provenance.sourceRole, 'BASELINE'); assert.equal(provenance.sourceCommit, f.tested);
  assert.equal(binding.candidateHeadSourceVerified, null); assert.deepEqual(binding.errors, []);
});

test('a local dependency outside the playground is rejected', t => {
  const f = fixture(t), provenance = evidenceProvenance(f.root, { toolRoot: f.root, env: {} });
  f.put('apmath/playground/next/labs/test.html', '<script src="../../../../unrelated.txt"></script>');
  assert.throws(() => bindLabSources(f.root, f.lab, provenance), /leaves playground/);
});
