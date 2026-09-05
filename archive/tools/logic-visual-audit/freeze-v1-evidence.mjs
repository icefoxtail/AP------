import path from 'node:path';
import { readJson, writeJson, sha256 } from './lib/io.mjs';

const repoRoot = path.resolve(process.cwd());
const inventory = readJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/target-inventory.json'));
const signals = {};
for (const item of inventory.items) signals[item.questionUid] = classify(item);
const output = {
  evidenceVersion: 'V1_SOURCE_ONLY_EVIDENCE_v1',
  coverageCount: Object.keys(signals).length,
  finalTargetCount: inventory.finalTargetCount,
  coveragePercent: Object.keys(signals).length / inventory.finalTargetCount * 100,
  signals,
  evidenceSha: sha256(signals)
};
writeJson(path.join(repoRoot, 'archive/tools/logic-visual-audit/reports/v1-evidence-freeze.json'), output);
console.log(JSON.stringify({ coverageCount: output.coverageCount, finalTargetCount: output.finalTargetCount, coveragePercent: output.coveragePercent, evidenceSha: output.evidenceSha }, null, 2));

function classify(item) {
  const source = `${item.content} ${item.category ?? ''} ${item.subUnitKey ?? ''}`;
  const visualCue = /벤다이어그램|수직선|구간|영역|그래프|좌표|격자|경우|표|진리|증명|반례|양화사|포함|합집합|교집합|차집합|여집합/.test(source);
  const abstractCue = /정의|뜻|기호|원소의 개수|부분집합의 개수|법칙|명제의 참/.test(source) && !visualCue;
  const expectedVisualRequirementSignal = visualCue ? 'SHOULD_BE_REQUIRED' : (abstractCue ? 'MAY_BE_OPTIONAL' : 'SHOULD_BE_EXEMPT');
  const finalVisualRequirement = expectedVisualRequirementSignal === 'SHOULD_BE_REQUIRED' ? 'VISUAL_REQUIRED' : expectedVisualRequirementSignal === 'SHOULD_BE_EXEMPT' ? 'VISUAL_EXEMPT' : 'VISUAL_OPTIONAL';
  return { questionUid: item.questionUid, expectedVisualRequirementSignal, finalVisualRequirement, sourceEvidence: { contentCue: visualCue ? 'logic-visual-cue' : abstractCue ? 'abstract-source-cue' : 'no-visual-cue', sourceFile: item.sourceFile }, visualRequirementAdjudicationStatus: 'RESOLVED', firstPassEvidenceFrozen: true };
}
