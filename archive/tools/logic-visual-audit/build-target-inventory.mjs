import path from 'node:path';
import { buildTargetInventory } from './lib/source.mjs';
import { writeJson, sha256 } from './lib/io.mjs';
import { buildRuleEvidence, ruleRoutingBundleSha } from './lib/rules.mjs';

const repoRoot = path.resolve(process.cwd());
const ruleEvidence = buildRuleEvidence(repoRoot);
const items = buildTargetInventory(repoRoot);
const report = {
  inventoryVersion: 'logic-visual-target-inventory-v1',
  targetUnitKeys: ['H15-SB-01', 'H15-SB-02'],
  sourceScope: 'archive/exams/original/high/h1/2mid/{21,22}_*_2학기_중간_고1_*.js',
  ruleRoutingBundleSha: ruleRoutingBundleSha(ruleEvidence),
  finalTargetCount: items.length,
  countsByYearAndUnit: items.reduce((acc, item) => { const key = `${item.year}:${item.standardUnitKey}`; acc[key] = (acc[key] ?? 0) + 1; return acc; }, {}),
  pilotSetTargetCount: items.filter((item) => item.standardUnitKey === 'H15-SB-01').length,
  items,
  inventorySha: sha256(items)
};
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'), report);
console.log(JSON.stringify({ finalTargetCount: report.finalTargetCount, pilotSetTargetCount: report.pilotSetTargetCount, countsByYearAndUnit: report.countsByYearAndUnit, inventorySha: report.inventorySha }, null, 2));
