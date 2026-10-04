import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const TOOL = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit');
const OUT = path.join(TOOL, 'reports');
const batch = JSON.parse(fs.readFileSync(path.join(OUT, 'phase2_2022_pilot_repair_batch_01.json'), 'utf8'));
const phase1V2 = JSON.parse(fs.readFileSync(path.join(OUT, 'v2_independent_observed.json'), 'utf8'));
const previousByUid = new Map(phase1V2.entries.map((entry) => [entry.questionUid, entry]));

function sha256(bytes) {
  return `sha256:${crypto.createHash('sha256').update(bytes).digest('hex')}`;
}

const entries = batch.results.map((result) => {
  const previous = previousByUid.get(result.questionUid);
  const absoluteAsset = path.join(ROOT, 'archive', result.solutionImage.replaceAll('/', path.sep));
  const currentArtifactSha = fs.existsSync(absoluteAsset) ? sha256(fs.readFileSync(absoluteAsset)) : null;
  const previousArtifactSha = previous?.observedArtifactSha256 ?? null;
  const changed = currentArtifactSha !== previousArtifactSha;
  return {
    questionUid: result.questionUid,
    artifactPath: result.solutionImage,
    phase1V2ArtifactSha: previousArtifactSha,
    phase2CurrentArtifactSha: currentArtifactSha,
    artifactShaChanged: changed,
    phase1V2EvidenceStatus: changed ? 'INVALIDATED_BY_ARTIFACT_CHANGE' : 'CURRENT_FOR_ARTIFACT_SHA',
    phase1CItemEvidenceStatus: changed ? 'INVALIDATED_BY_ARTIFACT_CHANGE' : 'REQUIRES_SEPARATE_REVIEW',
    cDenominatorStatusAfterChange: changed ? 'STALE_REQUIRED' : 'UNCHANGED_INPUT_NOT_PROVEN',
    requiredNextEvidence: changed ? ['emit new V2 artifact-only bundle', 'freeze new V2 evidence', 'rerun V3 parity', 'recompute/freeze C denominator before final C review'] : ['rerun V3 parity under Phase 2 review attempt'],
    sourceReport: 'reports/v2_independent_observed.json'
  };
});

const output = {
  generatedAtKst: '2026-09-05',
  phase: 'LOGIC_VISUAL_PHASE_2_ARTIFACT_EVIDENCE_INVALIDATION',
  status: entries.some((entry) => entry.artifactShaChanged) ? 'PHASE1_EVIDENCE_INVALIDATED_REVIEW_REQUIRED' : 'NO_ARTIFACT_SHA_CHANGE_DETECTED',
  phase1EvidencePreserved: true,
  phase1EvidenceCurrent: false,
  cDenominatorMayBeReused: false,
  entries,
  reportSha: sha256(JSON.stringify(entries))
};
fs.writeFileSync(path.join(OUT, 'phase2_artifact_evidence_invalidation.json'), JSON.stringify(output, null, 2) + '\n', 'utf8');
const markdown = [
  '# Phase 2 artifact evidence invalidation',
  '',
  `- 상태: **${output.status}**`,
  `- Phase 1 evidence 보존: **${output.phase1EvidencePreserved}**`,
  `- Phase 1 evidence 현재성: **${output.phase1EvidenceCurrent}**`,
  `- C denominator 재사용: **${output.cDenominatorMayBeReused}**`,
  '',
  ...entries.map((entry) => `- ${entry.questionUid}: ${entry.artifactShaChanged ? '**INVALIDATED**' : 'SHA unchanged'} — ${entry.phase1V2ArtifactSha} → ${entry.phase2CurrentArtifactSha}`),
  '',
  'asset SHA가 바뀐 문항은 새 V2 artifact-only freeze, V3 parity, C denominator 재계산·재동결 전에는 Phase 1 evidence를 현재 증거로 사용할 수 없다.',
  ''
].join('\n');
fs.writeFileSync(path.join(OUT, 'phase2_artifact_evidence_invalidation.md'), markdown, 'utf8');
console.log(JSON.stringify({ status: output.status, entryCount: entries.length, invalidatedCount: entries.filter((entry) => entry.artifactShaChanged).length, reportSha: output.reportSha }, null, 2));
