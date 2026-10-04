#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const EVID = 'archive/evidence/visual-upgrade-2025-m3-independent-b';
const oldLedger = JSON.parse(fs.readFileSync(path.join(EVID, 'triage.json'), 'utf8'));
const inventory = JSON.parse(fs.readFileSync(path.join(EVID, 'inventory.json'), 'utf8'));
const sourceFiles = inventory.exams.map(exam => exam.sourcePath);
const sha256 = bytes => 'sha256:' + crypto.createHash('sha256').update(bytes).digest('hex');
const blobSha = bytes => crypto.createHash('sha1')
  .update(Buffer.concat([Buffer.from('blob ' + bytes.length + '\0'), bytes])).digest('hex');

function loadBank(file) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file, timeout: 5000 });
  const bank = sandbox.window.questionBank || sandbox.window.questions;
  if (!Array.isArray(bank)) throw new Error('QUESTION_BANK_REQUIRED:' + file);
  return bank;
}

const bankByFile = new Map(sourceFiles.map(file => [file, loadBank(file)]));
const sourceShaByFile = new Map(sourceFiles.map(file => [file, sha256(fs.readFileSync(file))]));
const questions = new Map();
for (const exam of inventory.exams) for (const row of exam.questions) {
  const bankQuestion = bankByFile.get(exam.sourcePath).find(q => Number(q.id) === Number(row.qid));
  if (!bankQuestion) throw new Error('QUESTION_MISSING:' + row.questionUid);
  const solutionSha = sha256(Buffer.from(String(bankQuestion.solution || ''), 'utf8'));
  if (solutionSha !== row.solutionSha256) throw new Error('SOLUTION_LOCK_MISMATCH:' + row.questionUid);
  questions.set(row.questionUid, { exam, inventory: row, bankQuestion });
}

const sourceFigureAudits = {
  '25_왕운중_2학기_중간_중3_수학.js|1': { presence: 'PRESENT: right triangle ABC with right angle at B and side labels AC=10, BC=6, AB=8', sufficiency: 'SUFFICIENT: the source figure already labels the exact two owner sides needed for sin A and the right-angle vertex.' },
  '25_풍덕중_2학기_중간_중3_수학.js|1': { presence: 'PRESENT: right triangle ABC with AB=1, BC=2 and the right angle at B', sufficiency: 'SUFFICIENT: the source already gives the same side-owner relation used to compute tan A.' },
  '25_풍덕중_2학기_중간_중3_수학.js|11': { presence: 'PRESENT: coordinate axes, origin, line, 30-degree inclination and y-intercept 2', sufficiency: 'SUFFICIENT: the source graph already contains the exact axes, plotted line, inclination and intercept; the candidate redraw adds no new learning information.' },
  '25_풍덕중_2학기_중간_중3_수학.js|23': { presence: 'PRESENT: named quadrilateral ABCD, diagonal AC, right angle at B, 30/60-degree angles, BC=6 and CD=8', sufficiency: 'SUFFICIENT: the original figure already shows the complete area-decomposition geometry and all values; the candidate is a second drawing of the same relation.' },
};

const ADD_INFO = {
  '25_왕운중_2학기_중간_중3_수학.js|2': {
    sourceFigureSufficiency: 'ABSENT: the question gives tan A but no diagram or side-owner picture.',
    visualRequirement: 'VISUAL_OPTIONAL',
    newVisualInformation: ['A right-angle marker at B binds AB and BC to angle A.', 'The 5k, 12k, 13k side labels turn tan A=12/5 into the Pythagorean side model used for cos A.'],
    reason: 'No source figure exists. The labeled 5-12-13 triangle adds side ownership and the Pythagorean intermediate needed to identify adjacent over hypotenuse.'
  },
  '25_왕운중_2학기_중간_중3_수학.js|10': {
    sourceFigureSufficiency: 'ABSENT: the source states only the 1:2:3 angle ratio.',
    visualRequirement: 'VISUAL_OPTIONAL',
    newVisualInformation: ['The ratio is placed at vertices A, B and C as 30°, 60° and 90°.', 'The equality sin A=cos B=1/2 is attached to those named angles.'],
    reason: 'The source has no figure. The labeled triangle makes the angle-sum reduction and the matched A/B trigonometric values visible.'
  },
  '25_왕운중_2학기_중간_중3_수학.js|11': {
    sourceFigureSufficiency: 'PARTIAL: the source shows triangle ABC, BC=8, angle C=120° and the altitude foot H, but not the derived AH length.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The exterior altitude foot H and its right-angle owner are attached to the BC baseline.', 'The area condition gives AH=3√3, and the 60-degree exterior wedge gives CH=3.'],
    reason: 'The added height and horizontal split are the solution steps that convert the given area into the requested altitude.'
  },
  '25_왕운중_2학기_중간_중3_수학.js|13': {
    sourceFigureSufficiency: 'ABSENT: the source lists OA=x, OH=5 and AB=24 without a diagram.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The center-to-chord perpendicular is bound to H on chord AB.', 'The derived half-chord AH=HB=12 is shown before applying Pythagoras to OA.'],
    reason: 'No source picture exists. The circle, chord and perpendicular show why the 24-unit chord must be halved before finding x.'
  },
  '25_왕운중_2학기_중간_중3_수학.js|21': {
    sourceFigureSufficiency: 'PARTIAL: the source gives triangle ABC, AB=9 and BC=12 but does not draw the altitude that the solution derives.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The altitude AH is drawn perpendicular to BC with its foot H on the base.', 'AH=6√2 is bound to the height used in the area formula.'],
    reason: 'The added altitude turns the given sine ratio into a named height and makes the area calculation reproducible from the figure.'
  },
  '25_왕운중_2학기_중간_중3_수학.js|22': {
    sourceFigureSufficiency: 'ABSENT: the question gives cos A=3/5 without a triangle.',
    visualRequirement: 'VISUAL_OPTIONAL',
    newVisualInformation: ['The 3k, 4k, 5k lengths are bound to AB, BC and AC in a right triangle at B.', 'The result sin A=4/5 and tan A=4/3 is shown as a separate conclusion annotation.'],
    reason: 'No source figure exists. The labeled 3-4-5 triangle identifies opposite, adjacent and hypotenuse owners for both requested ratios.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|2': {
    sourceFigureSufficiency: 'PARTIAL: the source already shows the 30-degree right triangle and hypotenuse 6, but leaves x and y unknown.',
    visualRequirement: 'VISUAL_OPTIONAL',
    newVisualInformation: ['The solved values x=3 and y=3√3 are attached to AC and BC respectively.', 'The owner angle B=30° and hypotenuse AB=6 remain visible.'],
    reason: 'The source figure is a useful starting point; the solution SVG adds the computed values at their actual side owners.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|6': {
    sourceFigureSufficiency: 'ABSENT: the source gives sin A=√5/3 and angle B=90° without a figure.',
    visualRequirement: 'VISUAL_OPTIONAL',
    newVisualInformation: ['The sides BC=√5, AB=2 and AC=3 are placed on their triangle segments.', 'The right angle at B clarifies which side is the hypotenuse before evaluating tan C.'],
    reason: 'No source figure exists. The reconstructed right triangle binds each computed length to the correct side used in tan C.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|7': {
    sourceFigureSufficiency: 'PARTIAL: the source contains both right triangles and their shared BC, but not the derived BC/AB lengths.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The shared side BC links the two right triangles.', 'The derived AB=BC=2√3 and requested AC=2√6 are attached to the corresponding owners.'],
    reason: 'The shared side is the bridge between the two triangles; its derived length and the 45-degree equality are visible in one geometry-preserving figure.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|13': {
    sourceFigureSufficiency: 'PARTIAL: the source mountain picture gives AB=8 and the 30/45-degree base angles but does not show the foot H or the two base intervals.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The perpendicular foot H splits BC into BH=4√3 and HC=4.', 'The two right triangles explain the summed tunnel length.'],
    reason: 'The altitude split is the decisive geometric construction for adding the two legs of the mountain tunnel.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|14': {
    sourceFigureSufficiency: 'PARTIAL: the source shows the circle, equal chord marks, center distance 3 and target x but not the half-chord/radius chain.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The 8-unit chord is bisected into two 4-unit halves.', 'The lower right triangle gives radius 5; the upper chord triangle binds x to its 4-unit half.'],
    reason: 'The intermediate 4 and 5 lengths are the bridge from the given lower chord to the requested upper perpendicular distance.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|15': {
    sourceFigureSufficiency: 'ABSENT: the question asks why the locus of midpoints of equal chords is a circle and supplies no figure.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['Two representative equal chords and their midpoints are shown.', 'The center-to-midpoint distances define a distinct dashed locus circle as a derived conclusion.'],
    reason: 'The locus is the question itself; the concentric construction shows how equal chord lengths lead to equal midpoint radii.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|17': {
    sourceFigureSufficiency: 'PARTIAL: the source shows equal center-to-chord distances, 62° and x, but not the derived equal chord lengths as an inscribed triangle.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The two equal chords are connected to the vertex of x to form the derived isosceles triangle.', 'The 62° vertex angle is placed in its owner wedge; x remains the unknown angle.'],
    reason: 'The derived equal-chord relation creates the isosceles triangle used to calculate x; the candidate preserves the circle geometry.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|18': {
    sourceFigureSufficiency: 'PARTIAL: the source already shows triangle ABC, its incircle, contact points P/Q/R and side lengths 3/6/7.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['The center is labeled O and the source contact identities P, Q and R are preserved.', 'Equal tangent segments at each vertex are grouped, then the three perimeter equations determine CQ=CR=x.'],
    reason: 'The contact-owner equalities are the proof structure behind x=5; the final SVG labels those segments without replacing the incircle geometry.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|20': {
    sourceFigureSufficiency: 'PARTIAL: the source gives two tangents from P but does not mark the two right triangles and radius equality used in the proof.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['OA and OB are shown as radii with right angles at the contact points.', 'The common OP side supports RHS congruence; the conclusion PA=PB is not marked as a given.'],
    reason: 'The question asks which equality is not yet given; the geometry panel exposes only the RHS premises and keeps PA=PB as the result.'
  },
  '25_풍덕중_2학기_중간_중3_수학.js|22': {
    sourceFigureSufficiency: 'PARTIAL: the source includes the tree, observer, 54° angle, distances and eye height, but not the equal-height horizontal split and vertical sum.',
    visualRequirement: 'VISUAL_REQUIRED',
    newVisualInformation: ['BD=AE=4.5 m and the eye-level horizontal segment are bound to the diagram.', 'The tree height is decomposed into CD=6.21 m plus DE=1.5 m; the requested total is left to the solution text.'],
    reason: 'The extra horizontal line and vertical decomposition separate the measured sight-line height from the observer eye-height correction.'
  },
};

const WITHDRAWN = {
  '25_왕운중_2학기_중간_중3_수학.js|1': 'The original problem figure already names A/B/C, marks the right angle and labels AC=10 and BC=6; the candidate only redraws those same facts.',
  '25_풍덕중_2학기_중간_중3_수학.js|1': 'The original problem figure already shows AB=1, BC=2 and the right angle; the candidate is a duplicate triangle with the same tan-A owners.',
  '25_풍덕중_2학기_중간_중3_수학.js|11': 'The original coordinate graph already shows the axes, 30-degree line inclination and y-intercept 2; the candidate redraws the same line and intercept without a new graph-reading relation.',
  '25_풍덕중_2학기_중간_중3_수학.js|23': 'The original quadrilateral already shows named vertices, diagonal AC, angle values and side lengths; the candidate repeats that decomposition without adding a derived measurement or helper construction.',
};

function compactSolution(solution) {
  const math = [...String(solution || '').matchAll(/\$([^$]{2,180})\$/g)].map(m => m[1].replace(/\s+/g, ' ').trim());
  const relation = math.find(s => /(?:=|\\perp|\\parallel|:|\+|\\dfrac)/.test(s));
  if (relation) return relation.slice(0, 180);
  return String(solution || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
}

const newTriage = [];
for (const oldRow of oldLedger.triage) {
  const { exam, inventory: q, bankQuestion } = questions.get(oldRow.questionUid);
  const qid = Number(oldRow.qid);
  const key = path.basename(oldRow.sourcePath) + '|' + qid;
  const withdrawn = Object.hasOwn(WITHDRAWN, key);
  const decision = ADD_INFO[key];
  const action = withdrawn ? 'REMOVE' : oldRow.action;
  const baselinePath = q.solutionImagePath || null;
  const baselineImage = baselinePath ? {
    path: baselinePath,
    sha256: q.solutionImageSha256,
    gitBlobSha: q.solutionImageGitBlobSha || null,
  } : null;
  const currentPath = bankQuestion.solutionImage || null;
  const sourcePresent = Boolean(q.problemImagePath);
  const solutionText = String(bankQuestion.solution || '');
  const relation = ({
    '25_왕운중_2학기_중간_중3_수학.js|1': '∠B=90°, sin A=BC/AC=6/10=3/5; the same owner sides and values are already present in the source figure.',
    '25_풍덕중_2학기_중간_중3_수학.js|1': 'tan A=BC/AB=2/1=2; both sides and the right-angle vertex are already labeled in the source figure.',
    '25_풍덕중_2학기_중간_중3_수학.js|11': 'm=tan30°=√3/3, b=2, so y=(√3/3)x+2; source axes and line already show the same frame.',
    '25_풍덕중_2학기_중간_중3_수학.js|23': '[ABCD]=[ABC]+[ACD] with AC as the shared diagonal; all input angles and side lengths are already drawn in source.',
    '25_왕운중_2학기_중간_중3_수학.js|6': 'Extend AB beyond B: the exterior angle with BC is 60°, so CH=2sin60°=√3 and area=(1/2)·5·√3.',
    '25_왕운중_2학기_중간_중3_수학.js|11': 'AH is the altitude to BC; area=(1/2)·8·AH=12√3, giving AH=3√3.',
    '25_왕운중_2학기_중간_중3_수학.js|13': 'OH⊥AB, H bisects AB, AH=12 and OA²=OH²+AH²=5²+12²=169.',
    '25_왕운중_2학기_중간_중3_수학.js|21': 'sin B=AH/AB gives AH=9·(2√2/3)=6√2; area=(1/2)·12·6√2.',
    '25_왕운중_2학기_중간_중3_수학.js|22': 'cos A=AB/AC=3/5; Pythagoras gives BC=4k, then sin A=4/5 and tan A=4/3.',
    '25_풍덕중_2학기_중간_중3_수학.js|7': 'tan30°=BC/CD gives BC=2√3; the 45-45-90 triangle gives AB=BC and AC=2√6.',
    '25_풍덕중_2학기_중간_중3_수학.js|13': 'AH⊥BC, AH=AB·sin30°=4 and BH=AB·cos30°=4√3; ∠C=45° gives HC=4.',
    '25_풍덕중_2학기_중간_중3_수학.js|14': 'Equal chord distance gives half-chord 4; r²=3²+4²=25 and x²+4²=5², so x=3.',
    '25_풍덕중_2학기_중간_중3_수학.js|15': 'Equal chords in one circle are equally distant from O, so all chord midpoints lie at one radius from O.',
    '25_풍덕중_2학기_중간_중3_수학.js|17': 'Equal distances from O to the chords imply equal chord lengths; the inscribed isosceles triangle gives x=(180°−62°)/2=59°.',
    '25_풍덕중_2학기_중간_중3_수학.js|18': 'PA=AR, BP=BQ and CQ=CR; the three side sums give 2x=6+7−3=10.',
    '25_풍덕중_2학기_중간_중3_수학.js|20': 'OA=OB are radii and OP is common; two right triangles satisfy RHS, while PA=PB remains the proved conclusion.',
    '25_풍덕중_2학기_중간_중3_수학.js|22': 'tan54°=CD/BD gives CD=6.21 m; CE=CD+DE=6.21+1.5=7.71 m.',
  })[key] || compactSolution(solutionText);

  let visualRequirement;
  if (action === 'EXEMPT' || action === 'REMOVE') visualRequirement = 'VISUAL_EXEMPT';
  else if (action === 'ADD') visualRequirement = decision.visualRequirement;
  else visualRequirement = 'VISUAL_REQUIRED';

  let reason;
  if (action === 'ADD') reason = decision.reason;
  else if (action === 'REMOVE') reason = WITHDRAWN[key];
  else if (action === 'REBUILD' && key === '25_왕운중_2학기_중간_중3_수학.js|6') {
    reason = 'Source angle and side conditions were rechecked; the repaired SVG retains the exterior-angle height construction, binds 120°/60° to the B wedges, removes the unsupported BH=1 claim, and keeps the geometry that determines area.';
  } else if (action === 'KEEP') {
    reason = `The actual Archive solution SVG draws the solution-specific geometry for ${relation}; its owner labels make the decisive step easier to reproduce than the source figure or prose alone.`;
  } else if (action === 'EXEMPT') {
    reason = sourcePresent
      ? `The source table/graph/figure already supplies the data needed for ${relation}; the solution reads or calculates from it, and a second SVG adds no new relation.`
      : `The solution's direct calculation for ${relation} is the full student procedure; no spatial or owner relation would be clarified by an extra diagram.`;
  } else {
    throw new Error('UNHANDLED_ACTION:' + action + ':' + key);
  }

  const sourceSufficiency = decision?.sourceFigureSufficiency || sourceFigureAudits[key]?.sufficiency ||
    (sourcePresent
      ? (action === 'EXEMPT' ? 'SUFFICIENT_FOR_SOURCE_DATA; no separate solution visual is needed.' : 'PARTIAL: source contains givens; solution SVG adds the derived relation.')
      : 'NOT_APPLICABLE: no problem image; decision uses the source text and verified solution.');
  const row = {
    questionUid: oldRow.questionUid,
    qid,
    sourcePath: oldRow.sourcePath,
    sourceExamSha: sourceShaByFile.get(oldRow.sourcePath),
    solutionSha: sha256(Buffer.from(solutionText, 'utf8')),
    problemImagePath: q.problemImagePath || null,
    problemImageSha256: q.problemImageSha256 || null,
    baselineSolutionImage: baselineImage,
    baselineSolutionImagePath: baselinePath,
    baselineSolutionImageSha256: q.solutionImageSha256 || null,
    finalSolutionImagePath: currentPath,
    pilotBAction: oldRow.action,
    action,
    visualRequirement,
    oneLineReason: reason,
    decisiveRelation: relation,
    sourceFigurePresence: sourcePresent ? `PRESENT: ${q.problemImagePath}` : 'ABSENT',
    sourceFigureSufficiency: sourceSufficiency,
    decisionEvidence: {
      sourceQuestionExcerpt: String(bankQuestion.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 260),
      verifiedSolutionExcerpt: solutionText.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 320),
      sourceExamSha: sourceShaByFile.get(oldRow.sourcePath),
      solutionSha: sha256(Buffer.from(solutionText, 'utf8')),
      sourceProblemImageSha256: q.problemImageSha256 || null,
      decisionAuthority: 'current source question + current solution + original problem figure + direct Archive baseline-render review',
    },
  };
  if (decision) {
    row.marginalBenefitEvidence = {
      sourceFigurePresence: sourcePresent ? 'PRESENT' : 'ABSENT',
      sourceFigureSufficiency: sourceFigureAudits[key]?.sufficiency || decision.sourceFigureSufficiency,
      newVisualInformation: decision.newVisualInformation,
      marginalBenefitReason: decision.reason,
    };
  } else if (withdrawn) {
    row.marginalBenefitEvidence = {
      sourceFigurePresence: 'PRESENT',
      sourceFigureSufficiency: sourceFigureAudits[key].sufficiency,
      newVisualInformation: [],
      marginalBenefitReason: WITHDRAWN[key],
    };
    row.withdrawnPilotAsset = {
      path: `archive/assets/images/${path.basename(oldRow.sourcePath, '.js')}/q${qid}-solution.svg`,
      reason: WITHDRAWN[key],
      recordedIn: 'withdrawn_add_repair.json',
    };
  }
  newTriage.push(row);
}

const counts = Object.fromEntries(['KEEP', 'POLISH', 'REBUILD', 'ADD', 'REMOVE', 'EXEMPT']
  .map(action => [action, newTriage.filter(row => row.action === action).length]));
const finalImageCount = newTriage.filter(row => row.finalSolutionImagePath).length;
if (newTriage.length !== 120 || Object.values(counts).reduce((a, b) => a + b, 0) !== 120 || counts.ADD !== 16 || counts.REMOVE !== 4 || counts.REBUILD !== 1 || finalImageCount !== 71) {
  throw new Error('TRIAGE_CLOSURE_COUNT_MISMATCH:' + JSON.stringify({ rows: newTriage.length, counts, finalImageCount }));
}

const out = {
  schemaVersion: 'M3_VISUAL_TRIAGE_QUALITY_REPAIR_v1',
  baseCommit: 'e5189d7e459d2f12e281baee5f7d25eada26015c',
  importedPilotCommit: '43e0b955d890e317e222f36d7f18e6a30925be04',
  denominator: newTriage.length,
  counts,
  finalLinkedSolutionSvgCount: finalImageCount,
  originalBAddAudit: { candidates: 20, retainedAsAdd: 16, withdrawnAsRemove: 4 },
  triage: newTriage,
};
fs.writeFileSync(path.join(EVID, 'triage.json'), JSON.stringify(out, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({ denominator: out.denominator, counts, finalLinkedSolutionSvgCount: finalImageCount,
  originalBAddAudit: out.originalBAddAudit }));
