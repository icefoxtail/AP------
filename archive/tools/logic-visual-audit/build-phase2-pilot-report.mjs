import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readJson, sha256, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const inventory = readJson(path.join(root, 'reports/target-inventory.json'));
const denominator = readJson(path.join(root, 'reports/c-denominator.json'));
const artifacts = Object.values(readJson(path.join(root, 'reports/v2-evidence-freeze.json')).items);
const qualification = readJson(path.join(root, 'reports/qualification-report.json'));
const contract = readJson(path.join(root, 'reports/phase2-missing-visual-contract.json'));
const connector = fs.readFileSync(path.join(repoRoot, 'archive/tools/set-visual-pilot/connect_assets.py'), 'utf8');
const pilotCases = [...connector.matchAll(/^\s*\(([^\n]+),\s*(\d+)\):/gm)].map((match) => `${match[1]}:q${String(match[2]).padStart(2, '0')}`);
const targetPaths = new Set();
for (const item of inventory.items) {
  targetPaths.add(item.sourceFile);
  if (item.solutionImage) targetPaths.add(`archive/${item.solutionImage}`);
}
const statusLines = execFileSync('git', ['-c', 'core.quotepath=false', 'status', '--porcelain=v1', '--untracked-files=all'], { cwd: repoRoot, encoding: 'utf8' }).split(/\r?\n/).filter(Boolean);
const changedTargetPaths = statusLines.map((line) => line.slice(3).replace(/^"|"$/g, '').replaceAll('\\', '/')).filter((filePath) => targetPaths.has(filePath));
const missingRequired = denominator.logicVisualRequiredUidSet.filter((uid) => !artifacts.find((item) => item.questionUid === uid)?.artifactExists);
const report = {
  reportVersion: 'logic-visual-production-phase2-pilot-v1',
  pilotCases,
  pilotCaseCount: pilotCases.length,
  changedTargetPathCount: changedTargetPaths.length,
  changedTargetPaths,
  artifactCountAfterPilot: artifacts.filter((item) => item.artifactExists).length,
  finalTargetCount: inventory.finalTargetCount,
  cRequiredCount: denominator.logicVisualRequiredUidSet.length,
  requiredVisualMissingCount: missingRequired.length,
  requiredVisualMissingUidSet: missingRequired,
  qualificationInputBundleSha: qualification.qualificationInputBundleSha,
  missingVisualContract: { pass: contract.pass, passCount: contract.passCount, failCount: contract.failCount, reportSha: contract.reportSha },
  qualification: { calibration: qualification.calibration, holdout: qualification.holdout, mutation: qualification.mutation, render: qualification.qualificationRender },
  phase2Status: missingRequired.length === 0 && contract.pass && qualification['final判定'].startsWith('PASS') ? 'READY_FOR_FINAL_REVIEW' : 'PILOT_PASS_FULL_SCOPE_PENDING',
  note: 'This report records the bounded pilot. It does not promote the candidate overlay or claim full-scope production completion while requiredVisualMissingCount is non-zero.'
};
report.reportSha = sha256(report);
writeJson(path.join(root, 'reports/phase2-pilot-report.json'), report);
console.log(JSON.stringify({ pilotCaseCount: report.pilotCaseCount, changedTargetPathCount: report.changedTargetPathCount, artifactCountAfterPilot: report.artifactCountAfterPilot, cRequiredCount: report.cRequiredCount, requiredVisualMissingCount: report.requiredVisualMissingCount, phase2Status: report.phase2Status, reportSha: report.reportSha }, null, 2));
