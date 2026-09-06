import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const candidate = read(path.join(OUT, 'c_denominator.json'));
const finalMapPath = path.join(OUT, 'final_visual_requirement_map.json');
const writeAttempt = (value) => fs.writeFileSync(path.join(OUT, 'c_denominator_freeze_attempt.json'), JSON.stringify(value, null, 2) + '\n', 'utf8');

const block = (reason, extra = {}) => {
  const result = { ...candidate, status: 'UNFROZEN', freezeAttempt: reason, frozenAtKst: null, ...extra };
  writeAttempt(result);
  console.log(JSON.stringify({ status: result.status, reason }, null, 2));
  process.exitCode = 1;
  return result;
};

if (!fs.existsSync(finalMapPath)) block('BLOCKED_FINAL_VISUAL_REQUIREMENT_MAP_MISSING');
else {
  let finalMap;
  try { finalMap = read(finalMapPath); } catch (error) { block(`FINAL_VISUAL_REQUIREMENT_MAP_INVALID:${error.message}`); }
  if (finalMap) {
    const requirements = finalMap.requirements || Object.fromEntries((finalMap.entries || []).map((entry) => [entry.questionUid, entry.finalVisualRequirement]));
    const requirementUids = Object.keys(requirements).sort();
    const candidateUids = [...new Set(candidate.candidateRequiredUidSet || Object.keys(candidate.candidateRequirementMap || {}))].sort();
    const allUids = [...new Set([...requirementUids, ...candidateUids])].sort();
    const pending = Object.values(finalMap.adjudications || {}).filter((item) => !['NOT_REQUIRED', 'RESOLVED'].includes(item.status));
    const invalidRequirements = Object.entries(requirements).filter(([, value]) => !['VISUAL_REQUIRED', 'VISUAL_OPTIONAL', 'VISUAL_EXEMPT', 'NO_VISUAL'].includes(value));
    if (candidate.status === 'STALE' || candidate.stale === true) block('CANDIDATE_DENOMINATOR_STALE');
    else if (pending.length) block('ADJUDICATION_PENDING', { pendingCount: pending.length });
    else if (invalidRequirements.length) block('FINAL_REQUIREMENT_ENUM_INVALID', { invalidRequirements });
    else if (allUids.length === 0) block('EMPTY_UID_CLOSURE');
    else {
      const dependencyClosure = new Set(candidateUids);
      for (const uid of requirementUids) if (requirements[uid] === 'VISUAL_REQUIRED') dependencyClosure.add(uid);
      const required = [...dependencyClosure].sort();
      const freezeInputSha = sha256({ candidateCdenominatorInputSha: candidate.cDenominatorInputSha, finalVisualRequirementMapSha: sha256(finalMap), requiredUidSetSha: sha256(required) });
      const frozen = {
        ...candidate,
        status: 'FROZEN',
        previousCdenominatorInputSha: candidate.cDenominatorInputSha,
        cDenominatorInputSha: freezeInputSha,
        finalVisualRequirementMapSha: sha256(finalMap),
        logicVisualRequiredUidSet: required,
        logicVisualRequiredUidSetSha: sha256(required),
        frozenAtKst: '2026-09-06',
        finalMapAdjudicationPending: 0,
        dependencyClosureApplied: true,
        dependencyClosureRule: 'requiredByDecision OR actualSolutionVisualAttached OR problemVisualMathDependency OR sharedVisualMathDependency',
        freezeInputSha
      };
      fs.writeFileSync(path.join(OUT, 'c_denominator_frozen.json'), JSON.stringify(frozen, null, 2) + '\n', 'utf8');
      console.log(JSON.stringify({ status: frozen.status, requiredCount: required.length, logicVisualRequiredUidSetSha: frozen.logicVisualRequiredUidSetSha, freezeInputSha: frozen.freezeInputSha }, null, 2));
    }
  }
}
