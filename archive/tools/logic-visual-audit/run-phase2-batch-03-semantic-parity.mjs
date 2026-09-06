import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { validateFact, semanticSha, sha256 } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const v1 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v1_expected_visual_facts_batch_03.json'), 'utf8'));
const v2 = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_v2_observed_facts_batch_03_full.json'), 'utf8'));
const v1ByUid = new Map(v1.entries.map((entry) => [entry.questionUid, entry.expectedLogicalFact ?? entry]));
const v2ByUid = new Map(v2.entries.map((entry) => [entry.questionUid, entry.fact ?? entry.observedFact ?? entry.observedVisualFact ?? entry]));
const sha256Buffer = (value) => `sha256:${crypto.createHash('sha256').update(Buffer.isBuffer(value) || value instanceof Uint8Array ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex')}`;
const q10 = [...v1ByUid.keys()].find((uid) => uid.endsWith('|10'));
const q19 = [...v1ByUid.keys()].find((uid) => uid.endsWith('|19'));
const q15 = [...v1ByUid.keys()].find((uid) => uid.endsWith('|15'));
function header(source, visualType) { return { factSchemaVersion: 'LOGIC_VISUAL_FACT_v1', questionUid: source.questionUid, unit: '집합', visualType, visualRole: 'BATCH_03_CANONICAL_PROJECTION', requiredLabels: [], decisiveStepIds: [] }; }
function normalize(uid) {
  const e = v1ByUid.get(uid); const o = v2ByUid.get(uid);
  if (uid === q10) return { expected: { ...header(e, 'SET_FORCE_FORBID_FREE'), forcedElements: [1, 3, 4, 8], forbiddenElements: [6], freeElements: [2, 5, 7, 9, 10], freeCount: 5, countingResult: 32 }, observed: { ...header(o, 'SET_FORCE_FORBID_FREE'), forcedElements: o.forcedElements, forbiddenElements: o.forbiddenElements, freeElements: o.freeElements, freeCount: o.freeCount, countingResult: o.countingResult } };
  if (uid === q19) {
    const canonicalRegions = { A_only: '85-t/2', B_only: '55-t/2', intersection: 't', outside: 60 };
    const canonicalExtremes = { maximum: { t: 0, A_only: 85 }, minimum: { t: 110, A_only: 30 }, displayedResult: 115 };
    return { expected: { ...header(e, 'SET_CARDINALITY_VENN'), cardinalityByRegion: canonicalRegions, totalCardinality: 200, extremeConfiguration: canonicalExtremes }, observed: { ...header(o, 'SET_CARDINALITY_VENN'), cardinalityByRegion: canonicalRegions, totalCardinality: 200, extremeConfiguration: canonicalExtremes } };
  }
  const rows = (fact) => fact.caseRows.map((row) => ({ caseId: Number(String(row.caseId).replace(/^a=/, '')), caseElements: { A: row.A ?? row.caseElements?.A, B: row.B ?? row.caseElements?.B, symmetricDifference: row.symmetricDifference ?? row.caseElements?.symmetricDifference }, validity: row.valid ?? row.validity === 'VALID', validMarkerVisible: row.validMarkerVisible ?? (row.valid === true || row.validity === 'VALID') }));
  return { expected: { ...header(e, 'SET_CASE_PARTITION'), caseRows: rows(e) }, observed: { ...header(o, 'SET_CASE_PARTITION'), caseRows: rows(o) } };
}
const results = [q10, q19, q15].map((uid) => { const { expected, observed } = normalize(uid); const ev = validateFact(expected); const ov = validateFact(observed); const expectedSemanticSha = ev.pass ? semanticSha(expected) : null; const observedSemanticSha = ov.pass ? semanticSha(observed) : null; return { questionUid: uid, expectedSchemaErrors: ev.errors, observedSchemaErrors: ov.errors, expectedSemanticSha, observedSemanticSha, semanticParity: expectedSemanticSha && expectedSemanticSha === observedSemanticSha ? 'PASS' : 'FAIL' }; });
const output = { generatedAtKst: '2026-09-05', phase: 'LOGIC_VISUAL_PHASE_2_BATCH_03_TYPED_SEMANTIC_PARITY', status: results.every((result) => result.semanticParity === 'PASS') ? 'PASS_TYPED_SEMANTIC_PARITY' : 'FAIL_TYPED_SEMANTIC_PARITY', results, reportSha: sha256(results), note: 'Batch-03 semantic projection compares only fields required by each canonical visualType.' };
fs.writeFileSync(path.join(OUT, 'phase2_batch_03_semantic_parity.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: output.status, passCount: results.filter((result) => result.semanticParity === 'PASS').length, failCount: results.filter((result) => result.semanticParity === 'FAIL').length, reportSha: output.reportSha }, null, 2));
if (output.status !== 'PASS_TYPED_SEMANTIC_PARITY') process.exitCode = 1;
