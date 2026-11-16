import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { buildScopeAliasReport, outsideOutput, runCli } from '../archive/tools/meta-os/scope-alias-report.mjs';
test('report preserves exact lookup and keeps missing PT separate', () => {
  const row = { curriculum: '2022', standardCourse: '중1 수학', standardUnitKey: 'M1-01', subUnitKey: null, problemTypeKey: 'PT_TEST' };
  const report = buildScopeAliasReport([row, { ...row, problemTypeKey: '' }], [{ ...row, status: 'ACTIVE' }]);
  assert.equal(report.lookup.exact, 1); assert.equal(report.lookup.preservedExact, 1);
  assert.equal(report.lookup.alias, 0); assert.equal(report.lookup.noProblemType, 1);
  assert.equal(report.records, 2);
});
test('report refuses repository writes, symlink escape, overwrite and unsupported CLI', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-report-test-'));
  try {
    const root = path.join(temp, 'repo'); fs.mkdirSync(root);
    assert.throws(() => outsideOutput(path.join(root, 'new', 'report.json'), root), /outside/);
    const link = path.join(temp, 'link'); fs.symlinkSync(root, link);
    assert.throws(() => outsideOutput(path.join(link, 'report.json'), root), /outside/);
    const existing = path.join(temp, 'existing'); fs.writeFileSync(existing, 'preserved');
    assert.throws(() => outsideOutput(existing, root), /new file/);
    assert.equal(fs.readFileSync(existing, 'utf8'), 'preserved');
    assert.equal(outsideOutput(path.join(temp, 'new', 'report.json'), root), path.join(temp, 'new', 'report.json'));
    assert.throws(() => runCli(['--write']), /Usage/);
  } finally { fs.rmSync(temp, { recursive: true, force: true }); }
});
