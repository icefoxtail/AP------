import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { compareStructureReuse } from './lib/gate.mjs';

const repoRoot = path.resolve(process.cwd());
const parity = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/item-semantic-parity.json'));
const findings = compareStructureReuse(parity.results.filter((item) => item.artifactExists));
const output = { reportVersion: 'visual-structure-fingerprint-v1', findings, failCount: findings.filter((item) => item.status === 'FAIL_STRUCTURAL_REUSE').length, reportSha: sha256(findings) };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/structure-duplicates.json'), output);
console.log(JSON.stringify({ findingCount: findings.length, failCount: output.failCount, reportSha: output.reportSha }, null, 2));
if (output.failCount) process.exitCode = 1;
