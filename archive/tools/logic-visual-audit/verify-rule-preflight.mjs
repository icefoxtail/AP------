import fs from 'node:fs';
import path from 'node:path';
import { buildRuleEvidence, verifyManifest, ruleRoutingBundleSha } from './lib/rules.mjs';
import { sha256, writeJson } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const evidence = buildRuleEvidence(repoRoot);
const manifestCheck = verifyManifest(repoRoot, evidence);
const overlay = evidence.find((item) => item.role === 'LOGIC_VISUAL_OVERLAY');
const overlayText = fs.readFileSync(path.join(repoRoot, overlay.path), 'utf8');
const lifecycleOk = /상태:\s*`QUALIFICATION_READY`/.test(overlayText) && /CANDIDATE_QUALIFICATION_ONLY/.test(overlayText) && /canonicalForProduction\s*=\s*false/.test(overlayText);
const report = {
  ruleStatus: 'CANDIDATE_QUALIFICATION_ONLY',
  routingStatus: manifestCheck.ok && lifecycleOk ? 'PASS' : 'RULE_ROUTING_BLOCKED',
  failures: [...manifestCheck.failures, ...(lifecycleOk ? [] : ['overlay lifecycle markers missing'])],
  appliedRuleRefs: evidence,
  ruleRoutingBundleSha: ruleRoutingBundleSha(evidence),
  effectiveRulesetSha: sha256(evidence.map((item) => `${item.path}:${item.sha256}`).join('\n'))
};
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/rule-preflight.json'), report);
console.log(JSON.stringify(report, null, 2));
if (report.routingStatus !== 'PASS') process.exitCode = 1;
