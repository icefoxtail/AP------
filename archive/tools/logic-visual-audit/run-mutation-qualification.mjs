import fs from 'node:fs';
import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';
import { loadSpecs } from './lib/facts.mjs';
import { evaluateItem } from './lib/gate.mjs';

const repoRoot = path.resolve(process.cwd());
const specsDir = path.join(repoRoot, 'archive/tools/logic-visual-audit/specs');
const specs = loadSpecs(specsDir);
const detectorMap = readJson(path.join(specsDir, 'mutation-expected-detector-map-v1.json'));
const corpus = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/corpus/adversarial/cases.json'));
const results = corpus.cases.map((item) => {
  const expected = item.baseFact;
  const observed = item.mutatedFact;
  const expectedDetector = detectorMap.cases.find((candidate) => candidate.mutationId === item.mutationId);
  const detector = evaluateItem({ expectedFact: expected, observedFact: observed, schema: specs.schema, projection: specs.projection, required: true });
  const parserSurvived = Boolean(item.fixturePath && fs.existsSync(path.join(repoRoot, item.fixturePath)));
  const artifactRendered = parserSurvived && fs.readFileSync(path.join(repoRoot, item.fixturePath), 'utf8').includes('<svg');
  const expectedGate = expectedDetector?.gate ?? 'EXPECTED_OBSERVED_SEMANTIC_MISMATCH';
  const actualFailedGate = detector.expectedObservedSemanticParity === 'FAIL' ? 'EXPECTED_OBSERVED_SEMANTIC_MISMATCH' : detector.logicVisualItemStatus === 'FAIL' ? 'SCHEMA_OR_SEMANTIC_GATE' : 'NONE';
  const detectorMatched = expectedGate === 'STRUCTURAL_REUSE_REVIEW' ? Boolean(item.sameStructureDifferentSemantic) : actualFailedGate === expectedGate;
  return { mutationId: item.mutationId, parserSurvived, artifactRendered, expectedDetectorGate: expectedGate, allowedEquivalentGates: [expectedGate], actualFailedGate, survivedSemanticGate: detector.logicVisualItemStatus === 'PASS', detectorMatched, qualificationPass: parserSurvived && artifactRendered && detectorMatched, detector };
});
const output = { qualificationVersion: 'mutation-qualification-v1', mutationExpectedDetectorMapSha: sha256(detectorMap), mutationCorpusSha: sha256(corpus), results, passCount: results.filter((item) => item.qualificationPass).length, failCount: results.filter((item) => !item.qualificationPass).length, mutationQualificationCurrent: results.every((item) => item.qualificationPass) ? 'PASS' : 'FAIL' };
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/mutation-qualification.json'), output);
console.log(JSON.stringify({ mutationCount: results.length, passCount: output.passCount, failCount: output.failCount, mutationQualificationCurrent: output.mutationQualificationCurrent, mutationExpectedDetectorMapSha: output.mutationExpectedDetectorMapSha }, null, 2));
if (output.mutationQualificationCurrent !== 'PASS') process.exitCode = 1;
