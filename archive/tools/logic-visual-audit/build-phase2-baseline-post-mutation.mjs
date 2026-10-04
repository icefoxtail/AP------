import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;
const inventory = read('phase2_2022_set_pilot_inventory.json');
const paths = new Set();
for (const row of inventory.rows) {
  paths.add(row.sourceJsPath);
  if (row.solutionImage) paths.add(`archive/${row.solutionImage}`);
}
const records = [];
for (const relativePath of [...paths].sort()) {
  const absolutePath = path.join(ROOT, relativePath.replaceAll('/', path.sep));
  const currentExists = fs.existsSync(absolutePath);
  const currentSha = currentExists ? sha(fs.readFileSync(absolutePath)) : null;
  let baselineSha = null;
  let baselineStatus = 'MISSING_AT_HEAD';
  try {
    const baselineBytes = childProcess.execFileSync('git', ['show', `HEAD:${relativePath}`], { cwd: ROOT, stdio: ['ignore', 'pipe', 'ignore'] });
    baselineSha = sha(baselineBytes);
    baselineStatus = currentSha === baselineSha ? 'UNCHANGED_FROM_HEAD' : 'CHANGED_FROM_HEAD';
  } catch {
    baselineStatus = 'NOT_TRACKED_AT_HEAD';
  }
  records.push({ relativePath, baselineRef: 'HEAD', baselineSha, currentSha, currentExists, baselineStatus });
}
const changed = records.filter((record) => record.baselineStatus !== 'UNCHANGED_FROM_HEAD');
const baseline = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_BASELINE_POST_MUTATION',
  baselineRef: 'HEAD',
  inventoryQuestionUidSetSha: inventory.questionUidSetSha,
  inventoryCount: inventory.rows.length,
  preExistingDirtyFilesIgnored: true,
  productionMutationAllowed: false,
  recordCount: records.length,
  changedPathCount: changed.length,
  records,
  status: 'PASS_BASELINE_POST_MUTATION_RECORDED',
  note: 'HEAD is used as a reproducible baseline; unrelated pre-existing dirty worktree changes are not attributed to this task.'
};
baseline.reportSha = sha(Buffer.from(JSON.stringify(baseline)));
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_baseline_post_mutation.json'), JSON.stringify(baseline, null, 2) + '\n', 'utf8');
const mutationManifest = {
  generatedAtKst: baseline.generatedAtKst,
  taskId: 'phase2-2022-set-pilot-infrastructure-hardening',
  baselineRef: 'HEAD',
  inventoryRef: 'phase2_2022_set_pilot_inventory.json',
  inventoryQuestionUidSetSha: inventory.questionUidSetSha,
  preExistingDirtyFilesIgnored: true,
  productionMutationAllowed: false,
  changedPathCount: changed.length,
  changedPaths: changed.map((record) => record.relativePath),
  attributionStatus: 'WORKTREE_COMPARISON_ONLY_NOT_EXCLUSIVE_TASK_ATTRIBUTION',
  baselinePostMutationReport: 'phase2_2022_set_pilot_baseline_post_mutation.json'
};
mutationManifest.manifestSha = sha(Buffer.from(JSON.stringify(mutationManifest)));
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_mutation_manifest.json'), JSON.stringify(mutationManifest, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: baseline.status, recordCount: records.length, changedPathCount: changed.length, baselineRef: baseline.baselineRef, reportSha: baseline.reportSha, manifestSha: mutationManifest.manifestSha }, null, 2));
