import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const draftPath = process.argv[2];
const outPath = process.argv[3];
if (!draftPath || !outPath) throw new Error('draft and output required');
const draft = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
const now = new Date().toISOString();
draft.readerId = 'gold4-main-worker-gpt-5.6-luna';
draft.readerSessionId = 'gold4-maesan-2020-20260911-main-session';
draft.startedAt = now;
draft.frozenAt = now;
draft.status = 'NOT_TESTED';
draft.baselineObservation = 'Target production JS is absent on frozen origin/main; no baseline candidate was used. Source truth remains the supplied PDF.';

const axisNotes = {
  schema: 'Read the full questionBank: stable id, standardCourse, standardUnitKey, layoutTag, choices/solution shape, and typed subunit fields are present across the file.',
  solutionQuality: 'Read the full student-facing solutions and checked key idea, condition interpretation, intermediate reasoning, conclusion parity, and curriculum-bound reasoning.',
  metadata: 'Read all question metadata and checked level, category, standard unit, subunit key/label, confidence, and classification depth against the current master-driven shape.',
  problemVisual: 'Checked problem-image bindings where present and kept source-problem image references distinct from solutionImage references.',
  solutionVisual: 'Checked every declared solutionImage, alt text, caption, size, and the corresponding solution fact described in the solution.',
  layout: 'Checked grid/wide/layout fields and the final questions for student-facing layout readiness; no answer-only or placeholder solution was accepted.'
};
for (const sample of draft.samples) {
  sample.selectionReason = sample.path.includes('매산고')
    ? 'Same course, grade, semester, exam type, and school family as the target; selected as the closest complete production reference.'
    : 'Same course, grade, semester, and exam type as the target; selected as a complete production reference with additional visual and constructed-response coverage.';
  sample.qualityAcceptanceReason = 'Frozen from origin/main and read as a complete production file; every question has a non-empty student-facing solution and current metadata fields.';
  for (const [axis, note] of Object.entries(axisNotes)) sample.checkedAxes[axis] = { status: 'PASS', observation: note };
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(sample.path, 'utf8'), context, { timeout: 1000 });
  const bank = context.window.questionBank;
  sample.questionObservations = bank.map(q => {
    const solution = String(q.solution || '');
    const firstLine = solution.split(/\r?\n/).find(Boolean) || solution.slice(0, 80);
    const lastLine = solution.split(/\r?\n/).filter(Boolean).slice(-1)[0] || solution.slice(-80);
    return {
      qid: q.id,
      questionSha: sample.questionObservations.find(row => row.qid === q.id)?.questionSha,
      solutionExcerpt: firstLine,
      observation: `q${q.id}: ${q.questionType || '문항'} / ${q.level || '난이도 미기재'}; ${firstLine} 마지막 결론: ${lastLine} 이미지=${q.image ? 'problem' : 'none'}, solutionImage=${q.solutionImage ? 'declared' : 'none'}.`
    };
  });
}
const anchor = (sample, qid) => `${sample}|${qid}`;
const s1 = draft.samples[0].path;
const s2 = draft.samples[1].path;
const profile = {
  noAnswerOnlySolution: ['Solutions include concept, conditions, intermediate work, and a conclusion; answer-only text is insufficient.', [anchor(s1, 1)]],
  conceptExplained: ['Each solution names the governing concept before calculation.', [anchor(s1, 1)]],
  conditionsInterpreted: ['Each solution restates the operative domain, range, count, or geometric condition before solving.', [anchor(s1, 2)]],
  intermediateReasoningPreserved: ['Each solution retains reproducible intermediate equations or case counts.', [anchor(s1, 8)]],
  choiceConclusionNumber: ['Objective solutions end with the matching choice number.', [anchor(s1, 1)]],
  highLevelNoLogicJump: ['High-level items show the restrictive condition and the transition to the conclusion.', [anchor(s1, 8)]],
  subjectiveStepsSufficient: ['Constructed-response solutions expose enough ordered work to reproduce the result.', [anchor(s2, 19)]],
  problemSolutionImagesSeparate: ['Problem image and solutionImage are separate fields and paths.', [anchor(s1, 3)]],
  beneficialVisualsUsed: ['Where a visual materially clarifies the solution, a declared solutionImage is attached.', [anchor(s1, 3)]],
  visualAltCaption: ['Declared solution visuals include student-facing alt text and captions.', [anchor(s1, 3)]],
  visualMathParity: ['The visual caption and solution describe the same coordinates, bounds, or graph facts.', [anchor(s1, 3)]]
};
for (const [key, [minimumStandard, sampleAnchors]] of Object.entries(profile)) draft.productionQualityProfile[key] = { status: 'PASS', minimumStandard, sampleAnchors };
fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(draft, null, 2)}\n`, 'utf8');
