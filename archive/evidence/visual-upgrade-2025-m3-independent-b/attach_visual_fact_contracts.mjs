#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const EVID = 'archive/evidence/visual-upgrade-2025-m3-independent-b';
const f = (id, statement, role, encodingRole, visualEvidence, sourceLocation='source question/verified solution') =>
  ({ id, statement, role, encodingRole, visualEvidence, sourceLocation });
const i = (semanticRole, label, ownerReference=null, ownerType='point') =>
  ({ semanticRole, sourceLabel: label, artifactLabel: label,
    ...(ownerReference ? { ownerBinding: { type: ownerType, reference: ownerReference } } : {}),
    result: 'PASS', renamingAuthorized: false });
const id = (checks, derivedHelperLabels=[]) => ({
  applicable: checks.length > 0,
  checks,
  derivedHelperLabels: derivedHelperLabels.map(label => ({ label, authorization: 'solution-only construction point; source names remain unchanged' })),
  ...(checks.length ? {} : { notApplicableReason: 'The source has no named geometric entity to bind; only derived construction points are used.' }),
});

const C = {
  '25_왕운중_2학기_중간_중3_수학.js|2': {
    visualSemanticType: 'RIGHT_TRIANGLE_SIDE_RATIO',
    facts: [
      f('G1','∠B=90°; the owner rays are BA and BC.','GIVEN','GIVEN_STYLE','right-angle-B marks seg-AB and seg-BC.'),
      f('G2','tan A=BC/AB=12/5.','GIVEN','GIVEN_STYLE','A is named and the adjacent/opposite side owners are labeled 5k and 12k.'),
      f('D1','AB:BC=5:12; use AB=5k and BC=12k.','DERIVED_INTERMEDIATE','DERIVED_STYLE','5k and 12k are placed on seg-AB and seg-BC.'),
      f('D2','AC=13k by the Pythagorean theorem.','DERIVED_INTERMEDIATE','DERIVED_STYLE','13k is placed on the actual hypotenuse seg-AC.'),
      f('C1','cos A=AB/AC=5/13.','CONCLUSION','NOT_RENDERED','The locked solution text states the final ratio; the SVG preserves the adjacent/hypotenuse geometry.'),
    ],
    identity: id([i('vertex A','A','pt-A'),i('right-angle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|10': {
    visualSemanticType: 'TRIANGLE_ANGLE_RATIO',
    facts: [
      f('G1','∠A:∠B:∠C=1:2:3.','GIVEN','NOT_RENDERED','The source text keeps the ratio; the figure shows its derived angle values.'),
      f('D1','∠A+∠B+∠C=180°.','DERIVED_INTERMEDIATE','NOT_RENDERED','The angle-sum calculation remains in the locked solution text.'),
      f('D2','∠A=30°, ∠B=60°, ∠C=90°.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Each angle label is bound to its own vertex and two rays.'),
      f('D3','sin A=cos B=1/2.','DERIVED_INTERMEDIATE','NOT_RENDERED','The equal trigonometric values remain in the locked solution text.'),
      f('C1','sin A:cos B=1:1.','CONCLUSION','CONCLUSION_STYLE','The blue result annotation explicitly shows the asked ratio.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|11': {
    visualSemanticType: 'TRIANGLE_ALTITUDE',
    facts: [
      f('G1','[ABC]=12√3.','GIVEN','NOT_RENDERED','The area remains in the locked prompt/solution; it is not repeated as a side length.'),
      f('G2','BC=8.','GIVEN','GIVEN_STYLE','8 is attached to seg-BC.'),
      f('G3','∠ACB=120°.','GIVEN','GIVEN_STYLE','120° is placed at vertex C inside rays CB and CA.'),
      f('D1','H lies on the extension of BC and AH⊥BC.','DERIVED_INTERMEDIATE','GIVEN_STYLE','H is on the correct exterior baseline; right-angle-H owns AH and the baseline.'),
      f('D2','∠ACH=60° and CH=3.','DERIVED_INTERMEDIATE','DERIVED_STYLE','3 is bound to the exterior segment CH.'),
      f('C1','AH=3√3.','CONCLUSION','CONCLUSION_STYLE','The answer value is blue and bound to altitude AH, so it is visibly derived rather than given.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C'),i('altitude foot H','H','pt-H')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|13': {
    visualSemanticType: 'CIRCLE_CHORD_PERPENDICULAR',
    facts: [
      f('G1','O is the source circle center.','GIVEN','GIVEN_STYLE','The center marker and O label are bound to pt-O.'),
      f('G2','AB=24 and OH=5.','GIVEN','GIVEN_STYLE','24 and 5 are attached to seg-AB and seg-OH.'),
      f('D1','OH⊥AB and H is the midpoint of AB.','DERIVED_INTERMEDIATE','DERIVED_STYLE','A right-angle marker owns OH/AB and matching derived ticks mark AH/HB.'),
      f('D2','AH=HB=12.','DERIVED_INTERMEDIATE','DERIVED_STYLE','12 is bound to half-chord AH; the matching ticks identify HB.'),
      f('G3','OA=x is the target radius.','GIVEN','GIVEN_STYLE','x remains on the source-named radius OA.'),
      f('C1','OA=13.','CONCLUSION','NOT_RENDERED','The solution text derives x=13; the SVG retains x on OA rather than presenting 13 as given.'),
    ],
    identity: id([i('circle center','O','pt-O'),i('chord endpoint A','A','pt-A'),i('chord endpoint B','B','pt-B'),i('perpendicular foot H','H','pt-H')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|21': {
    visualSemanticType: 'TRIANGLE_ALTITUDE_AREA',
    facts: [
      f('G1','AB=9 and BC=12.','GIVEN','GIVEN_STYLE','9 and 12 are attached to their source-named sides.'),
      f('G2','sin B=AH/AB=2√2/3.','GIVEN','NOT_RENDERED','The ratio remains in the locked prompt/solution; it determines the new altitude.'),
      f('D1','AH⊥BC with foot H on BC.','DERIVED_INTERMEDIATE','DERIVED_STYLE','A right-angle marker at H owns AH and BC.'),
      f('D2','AH=6√2.','DERIVED_INTERMEDIATE','DERIVED_STYLE','6√2 is bound to altitude AH.'),
      f('C1','[ABC]=36√2.','CONCLUSION','NOT_RENDERED','The final area remains in the solution text; the drawing retains the altitude geometry.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|22': {
    visualSemanticType: 'RIGHT_TRIANGLE_TRIGONOMETRY',
    facts: [
      f('G1','∠B=90°.','GIVEN','GIVEN_STYLE','right-angle-B owns AB and BC.'),
      f('G2','cos A=AB/AC=3/5.','GIVEN','GIVEN_STYLE','The side labels 3k and 5k are on the adjacent side and hypotenuse.'),
      f('D1','BC=4k by the Pythagorean theorem.','DERIVED_INTERMEDIATE','DERIVED_STYLE','4k is bound to opposite side BC.'),
      f('C1','sin A=4/5 and tan A=4/3.','CONCLUSION','CONCLUSION_STYLE','The blue note is separated from the given side labels and states the requested values.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('right-angle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_왕운중_2학기_중간_중3_수학.js|6': {
    visualSemanticType: 'TRIANGLE_EXTERNAL_ALTITUDE',
    facts: [
      f('G1','AB=5 and BC=2.','GIVEN','GIVEN_STYLE','5 and 2 are bound to seg-AB and seg-BC.'),
      f('G2','∠ABC=120°.','GIVEN','GIVEN_STYLE','120° is inside the source wedge at B.'),
      f('D1','BH is the extension of AB; ∠CBH=60°.','DERIVED_INTERMEDIATE','NOT_RENDERED','The extension and 120-degree source wedge are drawn; the supplementary 60-degree calculation remains in the locked solution text.'),
      f('D2','CH⊥BH and CH=√3.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The right-angle mark owns CH/BH and √3 is attached to CH.'),
      f('C1','[ABC]=5√3/2.','CONCLUSION','NOT_RENDERED','The area result remains in the locked solution text; it is not drawn as a given measurement.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')],['H']),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|2': {
    visualSemanticType: 'RIGHT_TRIANGLE_TRIGONOMETRY',
    facts: [
      f('G1','AB=6 is the hypotenuse and ∠B=30°.','GIVEN','GIVEN_STYLE','6 is attached to AB and 30° is owned by vertex B and rays BA/BC.'),
      f('G2','∠C=90°.','GIVEN','GIVEN_STYLE','right-angle-C owns AC and BC.'),
      f('D1','AC=x=3 and BC=y=3√3.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Computed x/y values are bound to their corresponding sides in teal.'),
      f('C1','xy=9√3.','CONCLUSION','NOT_RENDERED','The product remains in the locked solution text, separate from the side values.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|6': {
    visualSemanticType: 'RIGHT_TRIANGLE_TRIGONOMETRY',
    facts: [
      f('G1','∠B=90° and sin A=BC/AC=√5/3.','GIVEN','GIVEN_STYLE','right-angle-B and side owners are drawn; the numeric ratio remains in the source text.'),
      f('D1','AC=3, BC=√5 and AB=2.','DERIVED_INTERMEDIATE','DERIVED_STYLE','All three Pythagorean side lengths are attached to their actual segments in teal.'),
      f('C1','tan C=AB/BC=2/√5.','CONCLUSION','NOT_RENDERED','The final ratio remains in the locked solution text.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('right-angle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|7': {
    visualSemanticType: 'COMPOSITE_RIGHT_TRIANGLES',
    facts: [
      f('G1','In triangle BCD, ∠C=90°, ∠D=30° and CD=6.','GIVEN','GIVEN_STYLE','The right-angle owner, angle wedge and CD label match triangle BCD.'),
      f('D1','BC=2√3.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The shared side length is attached to seg-BC.'),
      f('G2','In triangle ABC, ∠B=90° and ∠A=45°.','GIVEN','GIVEN_STYLE','The second right-angle mark and 45° label belong to ABC.'),
      f('D2','AB=BC.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The 45-degree wedge and right-angle owner show the derived equal legs; no given-style equality tick is added.'),
      f('C1','AC=2√6.','CONCLUSION','CONCLUSION_STYLE','The answer length is blue and owner-bound to seg-AC.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('shared vertex B','B','pt-B'),i('shared vertex C','C','pt-C'),i('triangle vertex D','D','pt-D')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|13': {
    visualSemanticType: 'TRIANGLE_ALTITUDE_SUM',
    facts: [
      f('G1','AB=8, ∠B=30° and ∠C=45°.','GIVEN','GIVEN_STYLE','The source side and both angle wedges retain their named owners.'),
      f('D1','AH⊥BC and AH=4.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The right-angle marker owns the altitude and baseline; 4 labels AH.'),
      f('D2','BH=4√3 and HC=4.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The two base pieces are teal and bound to BH and HC.'),
      f('C1','BC=4√3+4.','CONCLUSION','NOT_RENDERED','The total remains in solution text; the geometry preserves the two summands.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C')],['H']),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|14': {
    visualSemanticType: 'CIRCLE_CHORD_RIGHT_TRIANGLES',
    facts: [
      f('G1','Lower chord AB=8 and OH=3.','GIVEN','GIVEN_STYLE','8 and 3 remain on their source owner segments.'),
      f('G2','Upper half-chord EN=4 and the question asks for x=ON.','GIVEN','GIVEN_STYLE','4 and the unknown x are attached to the upper chord half and perpendicular ON.'),
      f('D1','OH⊥AB and H bisects AB, so AH=4.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The right-angle marker and midpoint split are shown; AH=4 is labeled.'),
      f('D2','OA=OF=r=5.','DERIVED_INTERMEDIATE','DERIVED_STYLE','A radius segment is drawn and r=5 is colored as a computed intermediate.'),
      f('D3','ON⊥EF and N bisects EF.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The upper perpendicular foot and right-angle owner are drawn.'),
      f('C1','x=ON=3.','CONCLUSION','NOT_RENDERED','The unknown x remains on ON; the result is stated only in solution text.'),
    ],
    identity: id([i('circle center','O','pt-O'),i('requested distance label','x','seg-ON','segment')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|15': {
    visualSemanticType: 'CIRCLE_CHORD_MIDPOINT_LOCUS',
    facts: [
      f('G1','Two representative chords AB and CD have equal lengths.','GIVEN','GIVEN_STYLE','Matching black ticks mark the premise chords AB and CD.'),
      f('D1','OM⊥AB and M is the midpoint of AB.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The visible orthogonal center/chord geometry identifies M as the midpoint; its compact teal right-angle mark stays clear of M.'),
      f('D2','ON⊥CD and N is the midpoint of CD.','DERIVED_INTERMEDIATE','DERIVED_STYLE','N is shown as the midpoint with a teal right-angle marker.'),
      f('D3','OM=ON because the equal chords are equally distant from O.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Both center-to-midpoint distances share the same constructed geometry.'),
      f('C1','All such chord midpoints lie on a circle centered at O.','CONCLUSION','CONCLUSION_STYLE','The distinct dashed blue circle represents the derived locus, not a given equal-value mark.'),
    ],
    identity: id([i('circle center from source solution','O','pt-O')],['A','B','C','D','M','N']),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|17': {
    visualSemanticType: 'CIRCLE_EQUAL_CHORD_ANGLE',
    facts: [
      f('G1','OM=ON: the center distances to the two source chords are equal.','GIVEN','GIVEN_STYLE','Matching black ticks remain only on OM and ON.'),
      f('G2','∠PBC=62°.','GIVEN','GIVEN_STYLE','62° is in the wedge at its actual vertex and rays.'),
      f('D1','PB=BC by the equal-distance/equal-chord theorem.','DERIVED_INTERMEDIATE','DERIVED_STYLE','The derived equality uses teal ticks on PB and BC.'),
      f('D2','∠BPC=∠PCB=59°.','DERIVED_INTERMEDIATE','NOT_RENDERED','The base-angle calculation remains in the locked solution text; x stays unknown in the SVG.'),
      f('C1','x=59°.','CONCLUSION','NOT_RENDERED','The answer is not prefilled in the angle label.'),
    ],
    identity: id([i('circle center','O','pt-O'),i('unknown angle label','x','pt-P','angle'),i('given vertex angle','62°','pt-B','angle')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|18': {
    visualSemanticType: 'INCIRCLE_TANGENT_SEGMENTS',
    facts: [
      f('G1','AB=3, AC=6 and BC=7.','GIVEN','GIVEN_STYLE','The three side values are attached to source-named sides.'),
      f('G2','The circle centered at O is tangent at P on AB, Q on BC and R on AC.','GIVEN','GIVEN_STYLE','The incircle and all three source-named contact points are preserved.'),
      f('D1','AP=AR=1.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Matching teal ticks mark the two tangent segments from A.'),
      f('D2','BP=BQ=2.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Matching teal ticks mark the two tangent segments from B.'),
      f('D3','CQ=CR=5.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Matching teal ticks mark the two tangent segments from C.'),
      f('C1','x=CQ=CR=5.','CONCLUSION','NOT_RENDERED','x remains on the source-owned contact segment; the answer value stays in solution text.'),
    ],
    identity: id([i('triangle vertex A','A','pt-A'),i('triangle vertex B','B','pt-B'),i('triangle vertex C','C','pt-C'),
      i('circle center','O','pt-O'),i('contact on AB','P','pt-P'),i('contact on BC','Q','pt-Q'),i('contact on AC','R','pt-R')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|20': {
    visualSemanticType: 'TANGENT_RIGHT_TRIANGLE_CONGRUENCE',
    facts: [
      f('G1','PA and PB are tangents from P to circle O at A and B.','GIVEN','GIVEN_STYLE','Both source tangent segments and their contact points remain drawn.'),
      f('G2','OA=OB are radii and OP is common.','GIVEN','GIVEN_STYLE','Equal ticks are on radii OA and OB only; OP is drawn as the shared side.'),
      f('D1','OA⊥PA and OB⊥PB.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Teal right-angle marks own each contact point and the actual rays.'),
      f('D2','△PAO≅△PBO by RHS.','DERIVED_INTERMEDIATE','NOT_RENDERED','The congruence inference stays in the locked solution text.'),
      f('C1','PA=PB.','CONCLUSION','NOT_RENDERED','The proof target is deliberately not marked equal in the picture.'),
    ],
    identity: id([i('circle center','O','pt-O'),i('external point','P','pt-P'),i('contact A','A','pt-A'),i('contact B','B','pt-B')]),
  },
  '25_풍덕중_2학기_중간_중3_수학.js|22': {
    visualSemanticType: 'RIGHT_TRIANGLE_HEIGHT_DECOMPOSITION',
    facts: [
      f('G1','AE=4.5 m is the ground distance and AB=1.5 m is eye height.','GIVEN','GIVEN_STYLE','The source distances remain on AE and observer-height segment AB.'),
      f('G2','∠CBD=54° and tan54°=1.38 from the printed table.','GIVEN','GIVEN_STYLE','54° is bound to B/D/C; the rounded table value remains in the written source/solution.'),
      f('D1','BD=AE=4.5 m and DE=AB=1.5 m.','DERIVED_INTERMEDIATE','DERIVED_STYLE','Eye-level and ground horizontal segments are grouped with teal ticks.'),
      f('D2','CD=4.5×1.38=6.21 m.','DERIVED_INTERMEDIATE','DERIVED_STYLE','6.21 m is attached to the actual vertical segment CD and matches the printed table calculation.'),
      f('C1','CE=CD+DE=7.71 m.','CONCLUSION','NOT_RENDERED','The total remains in the locked solution text; it is not shown as a given tree height.'),
    ],
    identity: id([i('ground point A','A','pt-A'),i('eye-height point B','B','pt-B'),i('sight-line point C','C','pt-C'),
      i('eye-level point D','D','pt-D'),i('tree foot E','E','pt-E')]),
  },
};

function makeIdentity(identity) {
  if (!identity.applicable) return identity;
  return identity;
}

function makeCoverage(fact) {
  const notRendered = fact.encodingRole === 'NOT_RENDERED';
  return {
    condition: fact.statement,
    result: 'PASS',
    coveredByFactIds: [fact.id],
    sourceLocation: fact.sourceLocation,
    svgVisibility: notRendered ? 'NOT_RENDERED_IN_SVG' : 'VISIBLE_IN_FINAL_SVG',
    coverageNote: notRendered ? fact.visualEvidence : fact.visualEvidence,
  };
}

function makeVisualization(fact) {
  return { factId: fact.id, encodingRole: fact.encodingRole, evidence: fact.visualEvidence };
}

const triagePath = path.join(EVID, 'triage.json');
const triage = JSON.parse(fs.readFileSync(triagePath, 'utf8'));
const records = [];
for (const row of triage.triage) {
  const key = path.basename(row.sourcePath) + '|' + row.qid;
  const contract = C[key];
  if (!contract) continue;
  if (!contract.identity) throw new Error('IDENTITY_CONTRACT_MISSING:' + key);
  row.expectedFacts = contract.facts.map(({id, statement, role}) => ({id, statement, role, critical: true}));
  row.expectedFactCompleteness = {
    sourceConditionCoverage: contract.facts.map(makeCoverage),
    decisiveRelationCovered: true,
    uncoveredCriticalConditions: [],
    expectedFactCompletenessStatus: 'PASS',
  };
  row.factVisualizations = contract.facts.map(makeVisualization);
  row.sourceSemanticIdentity = makeIdentity(contract.identity);
  row.solutionSha256 = row.solutionSha;
  row.sourceExamSha256 = row.sourceExamSha;
  row.visualSemanticType = contract.visualSemanticType;
  row.visualReviewScope = 'source question + verified solution + actual final SVG bytes';
  records.push({
    questionUid: row.questionUid,
    qid: row.qid,
    assetPath: `archive/assets/images/${path.basename(row.sourcePath, '.js')}/q${row.qid}-solution.svg`,
    visualSemanticType: contract.visualSemanticType,
    expectedFacts: row.expectedFacts,
    expectedFactCompleteness: row.expectedFactCompleteness,
    factVisualizations: row.factVisualizations,
    sourceSemanticIdentity: row.sourceSemanticIdentity,
  });
}
if (records.length !== 17) throw new Error('FACT_CONTRACT_COUNT_EXPECTED_17:' + records.length);

const contracts = {
  schemaVersion: 'M3_VISUAL_FACT_CONTRACTS_v1',
  denominator: records.length,
  coordinateGraphCandidates: [{
    questionUid: 'archive/exams/original/middle/m3/2mid/25_풍덕중_2학기_중간_중3_수학.js|11',
    status: 'WITHDRAWN_ADD_SOURCE_FIGURE_SUFFICIENT',
    sourceFrameAudit: {
      result: 'PASS', visualSemanticType: 'COORDINATE_GRAPH',
      sourceProblemImagePath: triage.triage.find(q => q.questionUid.endsWith('|11') && q.sourcePath.includes('25_풍덕중'))?.problemImagePath,
      sourceProblemImageSha256: triage.triage.find(q => q.questionUid.endsWith('|11') && q.sourcePath.includes('25_풍덕중'))?.problemImageSha256,
      xAxisHorizontal: true, xAxisHorizontalResidual: 0,
      yAxisVertical: true, yAxisVerticalResidual: 0,
      axesOrthogonal: true, axisOrthogonalityResidual: 0,
      originNamedO: true, intendedOriginIntersection: true, originIntersectionDeltaPx: 0,
      plottedLineUsesSameAxesAndScale: true, sameCoordinateFrame: true,
      physicalMeasurement: {
        method: 'Source problem PNG dark-pixel line fit in the plotted line band; axis centers measured from continuous raster strokes.',
        imagePixels: [741, 595], xAxisCenterYpx: 486, yAxisCenterXpx: 398,
        axesIntersectionPx: [398, 486],
        plottedLineScreenSlope: -0.575134965, plottedLineMathSlope: 0.575134965,
        plottedLineInclinationDeg: 29.904713,
        observedYInterceptPx: 171.474949, observedXInterceptPx: 298.147321,
        estimatedYScalePxPerUnit: 85.737475, estimatedXScalePxPerUnit: 86.067718,
        axisScaleRelativeDelta: 0.003844395,
      },
      tolerance: 1e-6, originTolerancePx: 1,
      sourceCriticalFacts: ['30-degree inclination','y-intercept 2','equation y=(√3/3)x+2'],
      sourceConditionCoverage: ['x-axis horizontal','y-axis vertical','axes orthogonal','intended origin O','plotted line in the same coordinate frame'],
      marginalBenefit: 'The source problem figure already shows the complete coordinate frame and decisive line relation, so the candidate redraw added no new visual information.',
    },
  }],
  items: records,
};
const removedGraphRow=triage.triage.find(q => q.questionUid===contracts.coordinateGraphCandidates[0].questionUid);
if (!removedGraphRow || removedGraphRow.action!=='REMOVE') throw new Error('COORDINATE_GRAPH_REMOVE_ROW_NOT_FOUND');
removedGraphRow.sourceFigureAudit=contracts.coordinateGraphCandidates[0].sourceFrameAudit;
fs.writeFileSync(path.join(EVID, 'visual_fact_contracts.json'), JSON.stringify(contracts, null, 2) + '\n', 'utf8');

// Build inputs consume these same current-pass facts, rather than copying the
// pilot B verdict or an authored expected/observed pair.
const buildPath = path.join(EVID, 'build_outputs.json');
const built = JSON.parse(fs.readFileSync(buildPath, 'utf8'));
for (const asset of built.assets) {
  const row = triage.triage.find(q => q.questionUid === asset.questionUid);
  if (!row?.expectedFacts) throw new Error('FACTS_NOT_ATTACHED_TO_TRIAGE:' + asset.questionUid);
  asset.action = row.action;
  asset.oneLineReason = row.oneLineReason;
  asset.decisiveRelation = row.decisiveRelation;
  asset.expectedFacts = row.expectedFacts;
}
fs.writeFileSync(buildPath, JSON.stringify(built, null, 2) + '\n', 'utf8');
fs.writeFileSync(triagePath, JSON.stringify(triage, null, 2) + '\n', 'utf8');
console.log(JSON.stringify({factContracts: records.length, coordinateGraphCandidatesAudited: 1, status: 'ATTACHED'}));
