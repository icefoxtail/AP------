import { spawnSync } from 'node:child_process';
import path from 'node:path';

const repoRoot = path.resolve(process.cwd());
const phases = [
  ['Phase 1A rule preflight', 'verify-rule-preflight.mjs'],
  ['Phase 1B target inventory', 'build-target-inventory.mjs'],
  ['Phase 1C V1 source-only bundle', 'emit-v1-source-only-bundles.mjs'],
  ['Phase 1C V1 evidence freeze', 'freeze-v1-evidence.mjs'],
  ['Phase 1D V2 artifact-only bundle', 'emit-v2-artifact-only-bundles.mjs'],
  ['Phase 1D V2 evidence freeze', 'freeze-v2-evidence.mjs'],
  ['Phase 1E C denominator freeze and stale rehearsal', 'compute-c-denominator.mjs'],
  ['Phase 1F semantic item gate', 'verify-item-semantic-parity.mjs'],
  ['Phase 1F structural duplicate gate', 'audit-visual-structure-duplicates.mjs'],
  ['Phase 1G mutation qualification', 'run-mutation-qualification.mjs'],
  ['Phase 1H infrastructure regression tests', 'test-logic-visual-audit.mjs'],
  ['Phase 1I unseen holdout qualification', 'run-holdout-qualification.mjs'],
  ['Phase 1J qualification render profile', 'run-qualification-render.mjs'],
  ['Phase 1K qualification report', 'build-qualification-report.mjs']
];

const results = [];
for (const [phase, script] of phases) {
  const result = spawnSync(process.execPath, [path.join(repoRoot, 'archive/tools/logic-visual-audit', script)], { cwd: repoRoot, encoding: 'utf8' });
  const ok = result.status === 0;
  results.push({ phase, script, status: ok ? 'PASS' : 'FAIL', exitCode: result.status, stdout: result.stdout.trim(), stderr: result.stderr.trim() });
  console.log(`[${ok ? 'PASS' : 'FAIL'}] ${phase}`);
  if (!ok) {
    if (result.stdout) console.log(result.stdout);
    if (result.stderr) console.error(result.stderr);
    process.exitCode = 1;
    break;
  }
}
if (process.exitCode !== 1) console.log(JSON.stringify({ workflow: 'logic-visual-qualification-phase1', status: 'PASS', phases: results.map((item) => ({ phase: item.phase, status: item.status })) }, null, 2));
