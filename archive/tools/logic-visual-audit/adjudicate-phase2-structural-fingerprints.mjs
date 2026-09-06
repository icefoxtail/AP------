import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const OUT = path.join(ROOT, 'archive', 'tools', 'logic-visual-audit', 'reports');
const read = (name) => JSON.parse(fs.readFileSync(path.join(OUT, name), 'utf8'));
const sha = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const audit = read('phase2_2022_set_pilot_structural_fingerprint_audit.json');
const inventory = read('phase2_2022_set_pilot_inventory.json');
const inventoryByUid = new Map(inventory.rows.map((row) => [row.questionUid, row]));
const decisions = new Map([
  [
    'sha256:b3a895a123916a5539c6023e5242d90bee9aecc406daa6bfd9ff468ccd13ce3f',
    {
      disposition: 'APPROVED_STRUCTURAL_FAMILY_WITH_SEMANTIC_DISTINCTION',
      visualFamily: 'SET_FORCE_FORBID_FREE',
      reason: '두 SVG는 강제·금지·자유 bucket의 동일한 교육적 문법을 공유하지만 U의 원소 수, A/B 원소, 자유 원소, countingResult가 모두 문항별로 다르다. exact asset SHA도 다르며 문항 고유 fact가 보인다.',
      semanticDistinguishers: ['universe', 'forcedElements', 'forbiddenElements', 'freeElements', 'freeCount', 'countingResult']
    }
  ],
  [
    'sha256:ee08bc51ca250baf9a579841d44d5da407f99178a9140e35eeaf47fe993699b7',
    {
      disposition: 'APPROVED_STRUCTURAL_FAMILY_WITH_SEMANTIC_DISTINCTION',
      visualFamily: 'SET_CARDINALITY_VENN',
      reason: '세 SVG는 최대·최소 교집합을 두 패널로 보여 주는 동일한 시각 문법을 공유하지만 전체 인원, A/B 크기, 최대·최소 교집합, 영역별 수치와 답이 각각 다르다. exact asset SHA는 다르다.',
      semanticDistinguishers: ['totalCardinality', 'setA', 'setB', 'maximumIntersection', 'minimumIntersection', 'regionCounts', 'answer']
    }
  ]
]);
const groups = audit.candidates.map((candidate) => {
  const bindings = candidate.questionUids.map((questionUid) => {
    const row = inventoryByUid.get(questionUid);
    const sourcePath = path.join(ROOT, row.sourceJsPath.replaceAll('/', path.sep));
    const context = { window: {} };
    vm.runInNewContext(fs.readFileSync(sourcePath, 'utf8'), context, { timeout: 5000 });
    const question = context.window.questionBank.find((item) => Number(item.id) === Number(row.qid));
    const artifactPath = question.solutionImage ? path.join(ROOT, 'archive', question.solutionImage.replaceAll('/', path.sep)) : null;
    const artifactSha = artifactPath && fs.existsSync(artifactPath) ? `sha256:${crypto.createHash('sha256').update(fs.readFileSync(artifactPath)).digest('hex')}` : null;
    const questionSpecificEvidenceSha = sha({ content: question.content, choices: question.choices, answer: question.answer, solution: question.solution, alt: question.solutionImageAlt, caption: question.solutionImageCaption });
    return {
      questionUid,
      artifactPath: question.solutionImage,
      artifactSha,
      artifactExists: Boolean(artifactSha),
      questionSpecificEvidenceSha,
      questionSpecificCoverage: {
        content: typeof question.content === 'string' && question.content.length > 0,
        choices: Array.isArray(question.choices),
        answer: question.answer !== undefined && question.answer !== null,
        solution: typeof question.solution === 'string' && question.solution.length > 0,
        alt: typeof question.solutionImageAlt === 'string' && question.solutionImageAlt.length > 0,
        caption: typeof question.solutionImageCaption === 'string' && question.solutionImageCaption.length > 0
      }
    };
  });
  const adjudication = decisions.get(candidate.geometryFingerprint) ?? null;
  const coveragePass = bindings.every((binding) => binding.artifactExists && binding.questionSpecificEvidenceSha && Object.values(binding.questionSpecificCoverage).every(Boolean));
  const approvalInputSha = sha({ geometryFingerprint: candidate.geometryFingerprint, questionUids: candidate.questionUids, bindings, disposition: adjudication?.disposition ?? null });
  return { ...candidate, adjudication: adjudication ? { ...adjudication, approvalInputSha } : null, adjudicationStatus: adjudication && coveragePass ? 'RESOLVED' : 'UNRESOLVED', bindings, bindingSha: sha(bindings), approvalInputSha, questionSpecificCoverageStatus: coveragePass ? 'PASS' : 'FAIL' };
});
const unresolved = groups.filter((group) => group.adjudicationStatus !== 'RESOLVED');
const result = {
  generatedAtKst: '2026-09-06',
  phase: 'LOGIC_VISUAL_PHASE_2_STRUCTURAL_FINGERPRINT_ADJUDICATION',
  inputAudit: 'phase2_2022_set_pilot_structural_fingerprint_audit.json',
  status: unresolved.length === 0 ? 'PASS_STRUCTURAL_FINGERPRINT_ADJUDICATED' : 'FAIL_STRUCTURAL_FINGERPRINT_UNRESOLVED',
  candidateCount: groups.length,
  resolvedCount: groups.length - unresolved.length,
  unresolvedCount: unresolved.length,
  groups,
  rule: 'Same geometry family is permitted only when exact asset SHA differs and question-specific semantic distinguishers are present; otherwise FAIL.',
  reportSha: sha(groups)
};
fs.writeFileSync(path.join(OUT, 'phase2_2022_set_pilot_structural_fingerprint_adjudication.json'), JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ status: result.status, candidateCount: result.candidateCount, resolvedCount: result.resolvedCount, unresolvedCount: result.unresolvedCount, reportSha: result.reportSha }, null, 2));
if (unresolved.length) process.exitCode = 1;
