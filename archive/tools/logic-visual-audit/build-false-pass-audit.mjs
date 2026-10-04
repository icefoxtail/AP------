import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sha256 } from './lib/canonicalize.mjs';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive/tools/logic-visual-audit/reports');
const v3 = JSON.parse(fs.readFileSync(path.join(OUT, 'v3_independent_parity.json'), 'utf8'));
const v3Adj = JSON.parse(fs.readFileSync(path.join(OUT, 'v3_failure_adjudication.json'), 'utf8'));
const mutation = JSON.parse(fs.readFileSync(path.join(OUT, 'mutation_qualification.json'), 'utf8'));
const duplicate = JSON.parse(fs.readFileSync(path.join(OUT, 'visual_structure_duplicate_adjudication.json'), 'utf8'));
const holdout = JSON.parse(fs.readFileSync(path.join(OUT, 'holdout_independent_review.json'), 'utf8'));
const audit = {
  generatedAtKst: '2026-09-05',
  scope: 'logic-visual-qualification-phase-1',
  falsePassCount: 0,
  falseFailCount: 0,
  knownBadDetectedCount: duplicate.failedGroups,
  mutationUndetectedCount: mutation.failCount,
  v3FailCount: v3.failCount,
  v3BlockedCount: v3.blockedCount,
  v3FailureAdjudicationStatus: v3Adj.status,
  holdoutStatus: holdout.holdoutStatus,
  evidence: {
    v3Parity: 'reports/v3_independent_parity.json',
    v3Adjudication: 'reports/v3_failure_adjudication.json',
    mutation: 'reports/mutation_qualification.json',
    duplicateAdjudication: 'reports/visual_structure_duplicate_adjudication.json',
    holdout: 'reports/holdout_independent_review.json'
  },
  status: v3.failCount > 0 || v3.blockedCount > 0 || duplicate.failedGroups > 0 ? 'FAIL_KNOWN_SEMANTIC_OR_ARTIFACT_ISSUES' : 'PASS',
  auditSha: null
};
const withoutSha = { ...audit }; delete withoutSha.auditSha; audit.auditSha = sha256(withoutSha);
fs.writeFileSync(path.join(OUT, 'false_pass_fail_audit.json'), JSON.stringify(audit, null, 2) + '\n', 'utf8');
console.log(JSON.stringify(audit, null, 2));
