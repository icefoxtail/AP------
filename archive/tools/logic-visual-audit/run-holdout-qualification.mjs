import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { loadSpecs } from './lib/facts.mjs';
import { evaluateItem, structureFingerprint } from './lib/gate.mjs';

const repoRoot = path.resolve(process.cwd());
const root = path.join(repoRoot, 'archive/tools/logic-visual-audit');
const specs = loadSpecs(path.join(root, 'specs'));
const corpus = readJson(path.join(root, 'corpus/holdout/index.json'));
const artifacts = readJson(path.join(root, 'reports/v2-evidence-freeze.json')).items;
if (corpus.holdoutStatus !== 'UNSEEN') {
  const existingPath = path.join(root, 'reports/holdout-qualification.json');
  if (!fs.existsSync(existingPath)) throw new Error(`holdout is not unseen and frozen report is missing: ${corpus.holdoutStatus}`);
  const existing = readJson(existingPath);
  console.log(JSON.stringify({ holdoutStatus: existing.holdoutStatus, pass: existing.pass, caseCount: existing.results.length, reportSha: existing.reportSha, rerun: false, note: 'Revealed holdout was not rerun.' }, null, 2));
  if (!existing.pass) process.exitCode = 1;
  process.exit(0);
}
const results = corpus.cases.map((entry) => {
  if (!entry.expectedFact) throw new Error(`holdout expected fact missing: ${entry.questionUid}`);
  const artifact = artifacts[entry.questionUid];
  if (!artifact?.artifactExists || !artifact.observedFact) throw new Error(`holdout artifact missing: ${entry.questionUid}`);
  const gate = evaluateItem({ expectedFact: entry.expectedFact, observedFact: artifact.observedFact, schema: specs.schema, projection: specs.projection, required: true, structureFingerprint: structureFingerprint(artifact.observedFact) });
  return { questionUid: entry.questionUid, label: entry.label, expectedStatus: entry.expectedStatus ?? 'PASS', actualStatus: gate.logicVisualItemStatus, expectedObservedSemanticParity: gate.expectedObservedSemanticParity, artifactSha: artifact.artifactSha, ...gate };
});
const pass = results.every((item) => item.actualStatus === item.expectedStatus);
const output = {
  qualificationVersion: 'logic-visual-holdout-qualification-v1',
  holdoutStatus: pass ? 'REVEALED_PASS' : 'REVEALED_FAIL',
  pass,
  tuningUse: 'FORBIDDEN',
  corpusSha: sha256(corpus),
  results,
  reportSha: sha256(results),
  note: 'This holdout was evaluated after corpus freeze and was not used to tune the verifier.'
};
writeJson(path.join(root, 'reports/holdout-qualification.json'), output);
console.log(JSON.stringify({ holdoutStatus: output.holdoutStatus, pass: output.pass, caseCount: results.length, reportSha: output.reportSha }, null, 2));
if (!pass) process.exitCode = 1;
