import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const factsPayload = JSON.parse(fs.readFileSync(path.join(REPORTS, 'a_independent_solve_facts.json'), 'utf8'));
const adjudication = JSON.parse(fs.readFileSync(path.join(REPORTS, 'review_A_visual_adjudication.json'), 'utf8'));
if (adjudication.coverage?.reviewedCount !== 15 || adjudication.decisions?.length !== 15) throw new Error('Visual adjudication coverage is not 15/15');
const byUid = new Map(factsPayload.facts.map((fact) => [fact.questionUid, fact]));
for (const decision of adjudication.decisions) {
  const fact = byUid.get(decision.questionUid);
  if (!fact) throw new Error(`Fact missing for visual decision: ${decision.questionUid}`);
  fact.visualRequirement = decision.decision;
  fact.scalePolicy = decision.scalePolicy;
  fact.visualAdjudication = { educationalBasis: decision.educationalBasis, requiredVisualElements: decision.requiredVisualElements, scalePolicyRationale: decision.scalePolicyRationale, sourceReport: 'review_A_visual_adjudication.json' };
}
const result = { ...factsPayload, source: 'a_independent_solve_facts.json + review_A_visual_adjudication.json', visualAdjudicationSha256: crypto.createHash('sha256').update(fs.readFileSync(path.join(REPORTS, 'review_A_visual_adjudication.json'))).digest('hex'), facts: [...byUid.values()] };
fs.writeFileSync(path.join(REPORTS, 'a_independent_solve_facts_final.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: 'FACTS_VISUAL_ADJUDICATION_MERGED', targetCount: result.facts.length, adjudicatedCount: adjudication.decisions.length, requiredCount: result.facts.filter((fact) => fact.visualRequirement === 'VISUAL_REQUIRED').length, missingVisualCount: result.facts.filter((fact) => fact.reasonCodes.includes('SOLUTION_VISUAL_MISSING')).length }, null, 2));
