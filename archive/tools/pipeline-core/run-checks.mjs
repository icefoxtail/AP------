import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { CORE_SHA } from './closure.mjs';
import { writeNewJson } from './canonical.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const coreTests = fs.readdirSync(path.join(root, 'archive/tools/pipeline-core/tests')).filter(n => n.endsWith('.test.mjs')).sort().map(n => `archive/tools/pipeline-core/tests/${n}`);
const commands = [[process.execPath, ['--test', ...coreTests]]];
if (!process.argv.includes('--core-only')) {
  commands.push([process.env.APMATH_PYTHON || 'python', ['-X', 'utf8', '-m', 'unittest', 'alive.engine.tests.test_final_closure', 'alive.engine.tests.test_pipeline_closure', 'alive.engine.tests.test_visual_renderer']]);
  commands.push([process.execPath, ['--test', 'tests/past-exam-pipeline-contract.test.mjs', 'archive/textbook/tools/textbook-pipeline/tests/pipeline-stage-contract.test.mjs']]);
}
const startedAt = new Date().toISOString();
const results = commands.map(([command, args]) => {
  const before = Date.now();
  const r = spawnSync(command, args, { cwd: root, encoding: 'utf8', timeout: 180000, maxBuffer: 12_000_000 });
  const result = { command, args, status: r.status === 0 ? 'PASS' : 'FAIL', exitCode: r.status, durationMs: Date.now() - before, stdout: r.stdout || '', stderr: r.stderr || '', error: r.error?.message || null };
  console.log(`${result.status}: ${path.basename(command)} ${args.join(' ')} (${result.durationMs} ms)`);
  return result;
});
const report = { status: results.every(r => r.status === 'PASS') ? 'PASS_SOFTWARE_REGRESSION' : 'FAIL_SOFTWARE_REGRESSION', scope: 'Synthetic fixtures and existing regression tests; not production question qualification', startedAt, finishedAt: new Date().toISOString(), coreSha: CORE_SHA, results };
const i = process.argv.indexOf('--out');
if (i >= 0) writeNewJson(path.resolve(process.argv[i + 1]), report);
console.log(report.status);
if (report.status !== 'PASS_SOFTWARE_REGRESSION') process.exitCode = 1;
