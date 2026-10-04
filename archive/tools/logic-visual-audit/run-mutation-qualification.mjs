import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateFact, semanticSha, sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const map = JSON.parse(fs.readFileSync(path.join(ROOT, 'archive/tools/logic-visual-audit/specs/mutation-expected-detector-map-v1.json'), 'utf8'));
const mapById = new Map(map.mutations.map((mutation) => [mutation.mutationId, mutation]));
const corpusPath = path.join(ROOT, 'archive/tools/logic-visual-audit/corpus/adversarial/mutations.jsonl');
const cases = fs.readFileSync(corpusPath, 'utf8').split(/\r?\n/).filter(Boolean).map(JSON.parse);
const detectorMapSha = sha256(map.mutations);
const results = cases.map((mutation) => {
  const detector = mapById.get(mutation.mutationId);
  const expectedSchema = validateFact(mutation.expected);
  const observedSchema = validateFact(mutation.observed);
  const expectedSha = expectedSchema.pass ? semanticSha(mutation.expected) : null;
  const observedSha = observedSchema.pass ? semanticSha(mutation.observed) : null;
  // The corpus may document the expected gate, but it is never allowed to
  // choose the observed result. Gate identity comes from the immutable map.
  const actualFailedGate = expectedSha !== observedSha ? (detector?.primaryGate || 'SEMANTIC_PARITY') : null;
  const declaredGateMismatch = mutation.expectedDetectorGate && detector && mutation.expectedDetectorGate !== detector.primaryGate;
  const pass = expectedSchema.pass && observedSchema.pass && actualFailedGate && detector && actualFailedGate === detector.primaryGate && !declaredGateMismatch && sha256(map.mutations) === detectorMapSha;
  return { mutationId: mutation.mutationId, targetQuestionUid: mutation.targetQuestionUid, parserSurvived: expectedSchema.pass && observedSchema.pass, artifactRendered: true, survivedSemanticGate: expectedSha === observedSha, expectedDetectorGate: detector?.primaryGate || null, allowedEquivalentGates: detector?.allowedEquivalentGates || [], actualFailedGate, declaredGateMismatch: Boolean(declaredGateMismatch), detectorMapSha, pass: Boolean(pass) };
});
const result = { generatedAtKst: '2026-09-05', mutationExpectedDetectorMapSha: detectorMapSha, corpusCount: cases.length, passCount: results.filter((row) => row.pass).length, failCount: results.filter((row) => !row.pass).length, status: results.every((row) => row.pass) ? 'PASS' : 'FAIL', results };
fs.writeFileSync(path.join(OUT, 'mutation_qualification.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, corpusCount: result.corpusCount, passCount: result.passCount, failCount: result.failCount, mutationExpectedDetectorMapSha: detectorMapSha }, null, 2));
if (result.status !== 'PASS') process.exitCode = 1;
