import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { bytesSha } from '../canonical.mjs';
import { rulePreflight } from '../rulepack.mjs';

test('identical or conflicting duplicate manifest paths fail closed', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rule-duplicate-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const dir = path.join(root, 'docs/rules');
  fs.mkdirSync(dir, { recursive: true });
  const bytes = Buffer.from('rule');
  fs.writeFileSync(path.join(dir, 'rule.md'), bytes);
  const entry = `- rule.md | ${bytes.length} bytes | sha256 ${bytesSha(bytes).slice(7)}\n`;
  const manifest = path.join(dir, 'MANIFEST.md');
  fs.writeFileSync(manifest, entry);
  assert.equal(rulePreflight(root).status, 'PASS');
  for (const duplicate of [entry, entry.replace('4 bytes', '5 bytes')]) {
    fs.writeFileSync(manifest, entry + duplicate);
    const report = rulePreflight(root);
    assert.equal(report.status, 'BLOCKED');
    assert.ok(report.errors.includes('RULE_MANIFEST_DUPLICATE:docs/rules/rule.md'));
  }
});

test('current project rule manifest has no duplicate geometry policy', () => {
  const root = new URL('../../../../', import.meta.url);
  const report = rulePreflight(fileURLToPath(root));
  assert.ok(!report.errors.some(error => error.startsWith('RULE_MANIFEST_DUPLICATE:')));
  assert.equal(new Set(report.refs.map(ref => ref.path)).size, report.refs.length);
});
