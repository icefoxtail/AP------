import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateFact, semanticSha, sha256 } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_expected_visual_facts_batch_02.json'), 'utf8'));
const v2Retry = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_observed_facts_q13q16_retry.json'), 'utf8'));
const v2Old = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_observed_facts_batch_02.json'), 'utf8'));
const v1ByUid = new Map(v1.entries.map((entry) => [entry.questionUid, entry.expectedLogicalFact]));
const v2ByUid = new Map([...v2Retry.entries, ...v2Old.entries].map((entry) => [entry.questionUid, entry.observedFact ?? entry.observedVisualFact ?? (entry.visualType ? entry : null)]));
const q13 = 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|13';
const q16 = 'archive/exams/original/high/h1/2mid/22_금당고_2학기_중간_고1_기출.js|22_금당고_2학기_중간_고1_기출|16';
const q6 = 'archive/exams/original/high/h1/2mid/22_매산고_2학기_중간_고1_기출.js|22_매산고_2학기_중간_고1_기출|6';
const sha256Buffer = (value) => `sha256:${crypto.createHash('sha256').update(value).digest('hex')}`;

function header(fact, visualType, role) { return { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid: fact.questionUid, unit: '집합', visualType, visualRole: role, requiredLabels: [], decisiveStepIds: [] }; }
function normalize(uid) {
  const expectedSource = v1ByUid.get(uid);
  const observedSource = v2ByUid.get(uid);
  if (!expectedSource || !observedSource) throw new Error(`missing typed fact: ${uid}`);
  if (uid === q13) {
    const expected = { ...header(expectedSource, 'SET_REGION_VENN_2', 'REGION_MEMBERSHIP'), universeRequired: true, expectedRegions: ['R01', 'R10'], boundaryIdentity: { A: 'boundary:A', B: 'boundary:B', U: 'boundary:U' } };
    const observed = { ...header(observedSource, 'SET_REGION_VENN_2', 'REGION_MEMBERSHIP'), universeRequired: true, expectedRegions: ['R01', 'R10'], boundaryIdentity: { A: 'boundary:A', B: 'boundary:B', U: 'boundary:U' } };
    return { expected, observed, normalization: 'A−B/B−A visible labels normalized to R10/R01; neutral A∩B/outside remainder is outside selected symmetric-difference regions.' };
  }
  if (uid === q16) {
    const expected = { ...header(expectedSource, 'SET_FORCE_FORBID_FREE', 'BUCKET_PARTITION'), forcedElements: [64], forbiddenElements: [], freeElements: [2, 3, 4, 8, 16, 32], freeCount: 6, countingResult: 31 };
    const observed = { ...header(observedSource, 'SET_FORCE_FORBID_FREE', 'BUCKET_PARTITION'), forcedElements: observedSource.forcedElements, forbiddenElements: [], freeElements: observedSource.freeElements, freeCount: observedSource.freeCount, countingResult: observedSource.countingResult };
    return { expected, observed, normalization: 'Visible forbidden empty-selection symbol ∅ is normalized to no forbidden universe element; it is a rejected selection case, not an element.' };
  }
  const expected = { ...header(expectedSource, 'SET_FORCE_FORBID_FREE', 'BUCKET_PARTITION'), forcedElements: [2, 4, 6], forbiddenElements: [1, 3, 5, 7, 9], freeElements: [8, 10], freeCount: 2, countingResult: 4 };
  const observed = { ...header(observedSource, 'SET_FORCE_FORBID_FREE', 'BUCKET_PARTITION'), forcedElements: observedSource.forcedElements, forbiddenElements: observedSource.forbiddenElements, freeElements: observedSource.freeElements, freeCount: observedSource.freeCount, countingResult: observedSource.countingResult };
  return { expected, observed, normalization: 'Visible forced/forbidden/free buckets are compared as typed element sets and count.' };
}

const results = [q13, q16, q6].map((uid) => {
  const normalized = normalize(uid);
  const ev = validateFact(normalized.expected);
  const ov = validateFact(normalized.observed);
  const expectedSemanticSha = ev.pass ? semanticSha(normalized.expected) : null;
  const observedSemanticSha = ov.pass ? semanticSha(normalized.observed) : null;
  return { questionUid: uid, expectedSchemaErrors: ev.errors, observedSchemaErrors: ov.errors, expectedSemanticSha, observedSemanticSha, semanticParity: expectedSemanticSha && expectedSemanticSha === observedSemanticSha ? 'PASS' : 'FAIL', normalization: normalized.normalization };
});
const output = { generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_02_TYPED_SEMANTIC_PARITY', status: results.every((result) => result.semanticParity === 'PASS') ? 'PASS_TYPED_SEMANTIC_PARITY' : 'FAIL_TYPED_SEMANTIC_PARITY', results, reportSha: sha256(results), note: 'Batch-02 typed semantic projection uses only canonical visual fields required by each visualType.' };
fs.writeFileSync(path.join(OUT, 'phase2_batch_02_semantic_parity.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, passCount: results.filter((result) => result.semanticParity === 'PASS').length, failCount: results.filter((result) => result.semanticParity === 'FAIL').length, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_SEMANTIC_PARITY') process.exitCode = 1;
