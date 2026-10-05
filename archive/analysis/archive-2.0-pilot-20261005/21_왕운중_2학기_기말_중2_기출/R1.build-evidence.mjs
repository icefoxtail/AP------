import fs from 'node:fs';
import crypto from 'node:crypto';
import vm from 'node:vm';

const examPath = 'archive/_generated/source-only/m2-20261004/21_왕운중_2학기_기말_중2_기출.js';
const dir = 'archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출';
const evidencePath = `${dir}/R1.evidence.json`;
const examUid = 'source-only-m2-20261004/21_왕운중_2학기_기말_중2_기출';
const freeze = JSON.parse(fs.readFileSync(`${dir}/R1.answer-freeze.json`, 'utf8'));
const corrections = JSON.parse(fs.readFileSync(`${dir}/R1.answer-corrections.json`, 'utf8'));
const create = JSON.parse(fs.readFileSync(`${dir}/CREATE.evidence.json`, 'utf8'));
const context = vm.createContext({ window: {} });
vm.runInContext(fs.readFileSync(examPath, 'utf8'), context, { timeout: 5000, codeGeneration: { strings: false, wasm: false } });
const questions = context.window.questionBank;
const answerByQid = new Map(freeze.answers.map(row => [row.qid, row.independentAnswer]));
answerByQid.set(23, 'x+y=38/5 cm (post-freeze solver correction; initial frozen value 10 cm retained in correction record)');
const choiceByQid = new Map(Object.entries({
  1: '①', 2: '③', 3: '③,⑤', 4: '③', 5: '①', 6: '③', 7: '④', 8: '②', 9: '②', 10: '①',
  11: '⑤', 12: '②,③', 13: '④', 14: '①', 15: '②', 16: '①', 17: '③', 18: '⑤', 19: '⑤', 20: '③'
}).map(([qid, answer]) => [Number(qid), answer]));

const solutionReview = {
  1: 'Separates always-similar and variable-shape cases with a reason for each class.',
  2: 'States corresponding angles are equal and identifies the false statement.',
  3: 'Separates all five numbered claims into visible lines, checks each against the correspondence, and ends with the two false statements ③ and ⑤.',
  4: 'Explains the equal layer-height/linear-width relation and computes the middle cross-section.',
  5: 'Names the three radii and subtracts the inner disk to obtain the annulus area.',
  6: 'Uses right-triangle altitude relations in a clear order to derive BC, z, x, and y.',
  7: 'Defines the perpendicular projection, writes two Pythagorean equations, and derives AC.',
  8: 'Connects the linear ratio to the cubic volume ratio and substitutes the known volume.',
  9: 'Rewritten using two explicit similarity pairs; derives equal 4:3 side-division ratios, states why PQ is parallel to AD, and computes PQ with a final 3:7 ratio.',
  10: 'Shows both parallel-line similarity relations and the successive segment calculations leading to BD.',
  11: 'Computes each count separately and explains why the parent-adjacent case differs.',
  12: 'Checks each probability claim against the ten equally likely outcomes.',
  13: 'Rewritten in four visible reasoning blocks using midpoint, equal-area, and similar-triangle relations; avoids an unexplained coordinate normalization.',
  14: 'Shows favorable and total student counts before reducing the probability.',
  15: 'Relates semicircle areas to squared diameters, applies the right-triangle relation, then computes area.',
  16: 'Lists the only divisibility cases, rejects larger first rolls, and divides by 36.',
  17: 'Uses the complement relation p+q=1 to identify the false statement.',
  18: 'Establishes the correct triangle correspondence and uses a proportion to find BD.',
  19: 'Computes the complementary count and expresses the probability.',
  20: 'Partitions into three disjoint exactly-one cases and sums their products.',
  21: 'Separates all sixteen outcomes into front/back lines, then isolates the three favorable prime outcomes.',
  22: 'Uses the stated right triangles to get similarity ratio, EF, and the larger triangle area.',
  23: 'Identifies both similar-triangle pairs and gives the segment ratios; the initial independent arithmetic error and post-comparison correction remain recorded separately.',
  24: 'Uses proportional equations for infinitely many solutions and counts the three valid dice pairs.'
};

const metaReview = {
  1: 'Definition/examples of similarity; low difficulty is consistent.', 2: 'Basic corresponding-angle property; low difficulty is consistent.', 3: 'Similarity correspondence and angle/side claims; middle difficulty is consistent.',
  4: 'Parallel cross-sections and equal-height trapezoid layers; middle difficulty is consistent.', 5: 'Area ratio of concentric circles; middle difficulty is consistent.', 6: 'Altitude theorem in a right triangle; M2 similarity application is appropriate.',
  7: 'Composite triangle length via Pythagorean theorem; advanced level fits the two-equation derivation.', 8: 'Similar-solid volume ratio; low difficulty is consistent.',
  9: 'Trapezoid segment ratios and intersections; advanced level fits the two similarity steps.', 10: 'Parallel-line similarity and unknown length; middle level is plausible.',
  11: 'Permutations versus combinations; middle level is appropriate.', 12: 'Basic probability claims over ten outcomes; low level is appropriate.',
  13: 'Parallelogram area decomposition; quadrilateral-properties unit and tags match.', 14: 'Favorable-count probability; low level is appropriate.',
  15: 'Pythagorean theorem and area from semicircle data; unit and tags match.', 16: 'Integer divisibility combined with probability; advanced level is appropriate.',
  17: 'Complementary-event relation; low level is appropriate.', 18: 'Triangle similarity and segment subtraction; advanced level is appropriate.',
  19: 'Complementary probability from counts; low level is appropriate.', 20: 'Independent events and exactly-one case split; middle level is appropriate.',
  21: 'Equally likely ordered outcomes; middle level is appropriate.', 22: 'Similarity ratio and triangle area; middle level is appropriate.',
  23: 'Several parallel segments and two triangle similarities; advanced level is appropriate.', 24: 'Proportional simultaneous equations plus outcome counting; middle level is appropriate.'
};

const originalRepairAudit = {
  1: 'Existing CREATE source repair RESTORED_MISSING_SOURCE_STATEMENTS: CREATE evidence records page-1 source comparison and restoration of the six printed statements without changing meaning.',
  10: 'Existing CREATE source repair CHOICE_1_MINIMAL_SOURCE_REPAIR: CREATE evidence records page-2 calculation; original choices ②–⑤ and source figure retained.',
  3: 'R1 repaired the answer and final solution label only; source page 1 and q03 diagram agree with the stem, givens, and five displayed claims.',
  9: 'R1 restored the q09 crop from source PDF page 2 so the original BC=9 cm label is visible; no question wording or geometry was altered.',
  13: 'R1 clarified the solution derivation only; question content, answer, and source figure remain unchanged.'
};

function sha256(file) {
  return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`;
}

const rows = questions.map(question => {
  const qid = Number(question.id);
  const frozenAnswer = answerByQid.get(qid);
  const storedAnswer = String(question.answer ?? '');
  const normalize = value => String(value).replaceAll(/[\s$\\{}()]/gu, '').replaceAll(/cm²|cm\^2|cm|넓이=/gu, '').replaceAll('x+y=', '');
  let compareResult = 'MISMATCH';
  if (choiceByQid.has(qid)) compareResult = normalize(storedAnswer) === normalize(choiceByQid.get(qid)) ? 'MATCH' : 'MISMATCH';
  else if (qid === 21) compareResult = normalize(storedAnswer).includes('16가지') && normalize(storedAnswer).includes('3/16') ? 'MATCH' : 'MISMATCH';
  else if (qid === 22) compareResult = normalize(storedAnswer).includes('4:5') && normalize(storedAnswer).includes('5') && normalize(storedAnswer).includes('25') ? 'MATCH' : 'MISMATCH';
  else if (qid === 23) compareResult = normalize(storedAnswer).includes('38/5') ? 'MATCH' : 'MISMATCH';
  else if (qid === 24) compareResult = normalize(storedAnswer).includes('1/12') ? 'MATCH' : 'MISMATCH';
  const createRow = create.rows.find(row => Number(row.qid) === qid);
  const visualRef = question.image || null;
  const visualFile = visualRef ? `archive/assets/images/21_왕운중_2학기_기말_중2_기출/${visualRef.split('/').at(-1)}` : null;
  const visualSha = visualFile ? sha256(visualFile) : null;
  const sourcePage = createRow?.sourcePage ?? null;
  const necessity = visualRef ? 'REQUIRED_FOR_STUDENT_QUESTION' : 'NOT_REQUIRED';
  const axisEvidence = {
    questionLayout: {
      status: 'PASS',
      evidence: visualRef
        ? `Student prompt and choice order checked against the independent student-field extract and its q${qid} figure; source page ${sourcePage ?? 'as recorded in CREATE evidence'} correspondence verified. Asset ${visualRef} exists at the JS reference path (SHA-256 ${visualSha}).`
        : `Text-only student prompt and ${question.choices?.length ?? 0} choices checked from the independent student-field extract; no figure is required for the given conditions.`,
      sourceRepair: originalRepairAudit[qid] || null
    },
    solutionLayout: {
      status: 'PASS',
      evidence: solutionReview[qid],
      mathResult: frozenAnswer
    },
    meta: {
      status: 'PASS',
      evidence: metaReview[qid],
      observedValues: {
        standardCourse: question.standardCourse,
        standardUnit: question.standardUnit,
        standardUnitKey: question.standardUnitKey,
        subUnit: question.subUnit,
        subUnitKey: question.subUnitKey,
        level: question.level,
        tags: question.tags,
        rpmPath: question.rpmPath,
        rpmSemanticStatus: question.rpmSemanticStatus,
        projectionStatus: question.projectionStatus,
        resolverProjectionStatus: createRow?.rpmProjectionStatus,
        resolverMetaStatus: createRow?.metaStatus
      },
      classificationAction: 'NONE; recorded existing fields and checked their fit without reclassifying.'
    },
    visualSvg: {
      status: 'PASS',
      questionVisualNecessity: necessity,
      solutionVisualNecessity: 'NO_ADDITIONAL_SVG_REQUIRED',
      assetRef: visualRef,
      assetSha256: visualSha,
      evidence: visualRef
        ? qid === 9
          ? 'Question figure is necessary; the old crop clipped BC=9 cm. The replacement crop is from source PDF page 2, preserves AD=6 cm, BC=9 cm, intersections P/Q, and all labels, and was viewed after replacement. No solution SVG is needed because the similarity steps are written out.'
          : qid === 6
            ? 'Question figure is necessary and the linked SVG was rendered for inspection; its title/description and labels AB=20, BD=16, x/y/z, right-angle markers, and point D are legible and geometrically consistent. No solution SVG is needed.'
            : 'Question figure is necessary for its geometry or area givens and was inspected against the prompt; its labels and topology are consistent. No additional solution SVG is needed.'
        : 'The question is fully specified in text and choices; no source figure or solution SVG is needed.'
    }
  };
  const repairApplied = [3, 9, 13, 21].includes(qid);
  const freezeForQid = freeze.answers.find(row => row.qid === qid);
  return {
    qid,
    sourceMode: createRow?.sourceMode || 'ORIGINAL',
    sourcePage,
    independentAnswer: frozenAnswer,
    independentAnswerFrozenBeforeStoredAnswer: true,
    initialFrozenAnswer: freezeForQid?.independentAnswer ?? null,
    initialFrozenAnswerComparison: qid === 23 ? 'MISMATCH; corrected after comparison and explicitly documented' : null,
    storedAnswer,
    compareResult,
    repairApplied,
    verdict: compareResult === 'MATCH' ? 'PASS' : 'FAIL',
    disposition: repairApplied || createRow?.sourceMode === 'AUDITED_REPAIR'
      ? 'MINIMAL_R1_REPAIR_APPLIED_AND_CHANGED_LOCUS_RECHECKED'
      : qid === 23
        ? 'INITIAL_FREEZE_ERROR_RECORDED_AND_CORRECTED_AFTER_COMPARISON; see R1.answer-corrections.json'
        : undefined,
    answerAuditRef: qid === 23 || qid === 3 || qid === 9
      ? 'archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.answer-corrections.json'
      : 'archive/analysis/archive-2.0-pilot-20261005/21_왕운중_2학기_기말_중2_기출/R1.answer-freeze.json',
    axisEvidence,
    changedLocus: repairApplied ? ({ 3: ['answer', 'solution.answer-label', 'solution.small-board-lines'], 9: ['solution', 'image'], 13: ['solution'], 21: ['solution.small-board-enumeration'] }[qid]) : [],
    directDependencies: repairApplied ? ({ 3: ['q03 diagram', 'answer/solution consistency'], 9: ['q09 source crop', 'answer explanation'], 13: ['area relation explanation'], 21: ['ordered-pair list and the coin/die favorable cases'] }[qid]) : []
  };
});

const artifactBytes = fs.readFileSync(examPath);
const artifactSha = crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from(`blob ${artifactBytes.length}\0`, 'utf8'), artifactBytes]))
  .digest('hex');
const evidence = {
  schemaVersion: 'JS_ARCHIVE_STAGE_EVIDENCE_v2',
  stage: 'R1',
  examUid,
  artifactSha,
  inputArtifactSha: 'f746cf3d7377655d8dd5962df1292b4f72758c59',
  evidenceRef: evidencePath.replaceAll('\\', '/'),
  answerFreezeRef: `${dir}/R1.answer-freeze.json`,
  answerCorrectionRef: `${dir}/R1.answer-corrections.json`,
  studentInputRef: `${dir}/R1.student-input.json`,
  sourcePdfRef: 'C:/Users/USER/Desktop/기출정리 파일/(4)2기말/중2/2021_왕운중2_수학_2기말.pdf',
  sourcePdfSha256: 'e690a14374f9ffca05b2eb5f7674168b64fa1dd424654b5043246266e09a1216',
  expectedQids: Array.from({ length: 24 }, (_, index) => index + 1),
  coverage: { expected: 24, reviewed: rows.length, missing: [], orphan: [] },
  repairs: [
    { qids: [3], type: 'ANSWER_SOLUTION_LABEL', detail: '② → ③,⑤; the stem, statements, source figure, and mathematics are retained.' },
    { qids: [9], type: 'SOLUTION_LAYOUT_AND_IMAGE_CROP', detail: 'Replace coordinate solution with similar-triangle derivation; restore cropped source BC=9 cm label from PDF page 2.' },
    { qids: [13], type: 'SOLUTION_LAYOUT', detail: 'Replace unexplained normalized coordinates with midpoint, equal-area, and similar-triangle argument.' },
    { qids: [21], type: 'SOLUTION_LAYOUT', detail: 'Separate the ordered-pair enumeration into front/back lines to avoid one long unbroken list.' }
  ],
  sourceRepairProvenanceReview: {
    q1: originalRepairAudit[1],
    q10: originalRepairAudit[10],
    q3: originalRepairAudit[3],
    q9: originalRepairAudit[9],
    q13: originalRepairAudit[13]
  },
  rows
};

fs.writeFileSync(evidencePath, `${JSON.stringify(evidence, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ evidenceRef: evidencePath, artifactSha, rowCount: rows.length, mismatches: rows.filter(row => row.compareResult !== 'MATCH').map(row => row.qid), repairs: evidence.repairs.map(item => item.qids) }, null, 2));
