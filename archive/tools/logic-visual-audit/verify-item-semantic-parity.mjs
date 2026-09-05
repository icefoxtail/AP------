import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { loadSpecs } from './lib/facts.mjs';
import { evaluateItem, structureFingerprint } from './lib/gate.mjs';

const repoRoot = path.resolve(process.cwd());
const specs = loadSpecs(path.join(repoRoot, 'archive/tools/logic-visual-audit/specs'));
const inventory = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'));
const artifactReport = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v2-evidence-freeze.json'));
const corpus = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/corpus/calibration/index.json'));
const byUid = new Map(inventory.items.map((item) => [item.questionUid, item]));
const artifacts = artifactReport.items;
const results = [];
for (const entry of corpus.cases) {
  const artifact = artifacts[entry.questionUid];
  const observedFact = entry.observedFactOverride ?? artifact?.observedFact ?? null;
  const expectedFact = entry.expectedFact;
  const result = evaluateItem({ expectedFact, observedFact, schema: specs.schema, projection: specs.projection, required: true, structureFingerprint: structureFingerprint(observedFact) });
  const expectedStatus = entry.label?.startsWith('KNOWN_BAD') ? 'FAIL' : 'PASS';
  results.push({ ...entry, expectedStatus, sourceExists: Boolean(byUid.get(entry.questionUid)), artifactExists: Boolean(artifact?.artifactExists), ...result });
}
const output = { reportVersion: 'logic-visual-item-semantic-parity-v1', corpusSha: sha256(corpus), results, passCount: results.filter((item) => item.logicVisualItemStatus === 'PASS').length, failCount: results.filter((item) => item.logicVisualItemStatus === 'FAIL').length, reportSha: sha256(results) };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/item-semantic-parity.json'), output);
console.log(JSON.stringify({ caseCount: results.length, passCount: output.passCount, failCount: output.failCount, reportSha: output.reportSha }, null, 2));
