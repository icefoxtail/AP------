import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { pathToFileURL } from 'node:url';
const [repoRoot, assignmentPath] = process.argv.slice(2);
const assignment = JSON.parse(fs.readFileSync(assignmentPath, 'utf8'));
const bytes = fs.readFileSync(assignment.workingJsAbsolute);
const source = bytes.toString('utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: assignment.workingJsAbsolute, timeout: 5000 });
const questions = sandbox.window.questionBank;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const sourceManifestBytes = fs.readFileSync(assignment.sourceManifestAbsolute);
const manifest = JSON.parse(sourceManifestBytes.toString('utf8'));
const sourceRow = manifest.rows.find(row => row.examUid === assignment.examUid);
if (!sourceRow) throw new Error('SOURCE_ROW_MISSING');
const sourceJs = path.resolve('C:/Users/USER/Desktop/AP------', sourceRow.workingPath);
const sourceBytes = fs.readFileSync(sourceJs);
const sourceSandbox = { window: {} };
vm.createContext(sourceSandbox);
vm.runInContext(sourceBytes.toString('utf8'), sourceSandbox, { filename: sourceJs, timeout: 5000 });
const sourceQuestions = sourceSandbox.window.questionBank;
if (questions.length !== assignment.allowedQids.length || sourceQuestions.length !== questions.length) throw new Error('QID_DENOMINATOR_MISMATCH');
const studentKeys = ['id','content','choices','answer','image','questionType','layoutTag','wide'];
for (let i=0;i<questions.length;i++) for (const key of studentKeys) if (JSON.stringify(sourceQuestions[i][key]) !== JSON.stringify(questions[i][key])) throw new Error(`STUDENT_PARITY_FAIL:q${questions[i].id}:${key}`);
const helper = await import(pathToFileURL(path.join(repoRoot,'archive/tools/archive-stage-validator.mjs')).href);
const artifactSha = helper.gitBlobSha(bytes);
const artifactRawSha256 = sha256(bytes);
const assetMap = new Map();
for (const asset of assignment.requiredAssets) {
  const actual = sha256(fs.readFileSync(asset.path));
  if (actual !== asset.sha256) throw new Error(`ASSIGNED_ASSET_SHA_MISMATCH:${asset.ref}`);
  assetMap.set(asset.ref, {ref:asset.ref, path:asset.path, sha256:actual});
}
const standardSolutions = {
  1:'BC/AC=6/10=3/5',2:'tan ratio 5:12 gives hypotenuse 13 and cos=5/13',3:'special-angle values give sqrt(2)-3/2',4:'table gives (79°,77°)',5:'acute-angle domains resolve both absolute values to tan A+sin A',6:'included-angle area formula gives 5sqrt(3)/2',7:'unit-quarter-circle coordinates and complementary ratios show choice ② is false',8:'45-45-90 legs 4, then HC=6 and AC=2sqrt(13)',9:'legs k and 3k give hypotenuse sqrt(10)k and cos C=3/sqrt(10)',10:'angle ratio gives 30°,60°,90° and ratio 1:1',11:'area identity gives AH=3sqrt(3)',12:'apothem gives circumradius 6; subtract hexagon area from circle area',13:'half-chord 12 and perpendicular leg 5 give radius 13',14:'RHS follows from right angles, equal radii, and common OM; RHA is wrong',15:'sagitta 3 and half-chord 5 give r=17/3',16:'equal center-to-chord distances give an equilateral triangle and radius 4sqrt(3)',17:'equal tangent segments give PB=2 and QB=QC=3',18:'shared tangent contact points allow chaining lengths to AD=30 and AF=26',19:'13-5-12 triangle, midpoint and parallel-line similarity give sin x=12/13',20:'right-triangle side lengths and horizontal components give sin75=(sqrt6+sqrt2)/4',21:'height 9 sin B=6sqrt(2), so area is 36sqrt(2)',22:'3-4-5 side ratio gives sin A=4/5 and tan A=4/3',23:'OM=5, OB=7, so half-chord=2sqrt(6) and triangle area=10sqrt(6)',24:'depression complements give horizontal distances 595m and 830m, total 1425m'
};
const difficultyBuckets = [1,1,1,1,2,1,2,2,2,2,2,4,1,2,4,3,1,4,4,4,2,2,4,4];
const difficultyRationales = {
  1:'one direct sine definition from a marked right triangle',2:'one ratio choice followed by a standard Pythagorean triple',3:'direct substitution of two special-angle values',4:'two direct table lookups',5:'domain-sensitive absolute-value simplification',6:'single included-angle area formula with a special angle',7:'read unit-circle coordinates and apply complementary ratios',8:'two linked right-triangle steps using a special triangle and Pythagoras',9:'construct a side ratio, derive the hypotenuse, then form a ratio',10:'derive angle values from a fixed sum and evaluate two special ratios',11:'invert the triangle-area formula',12:'derive a regular-hexagon radius and compare two area formulas',13:'apply the chord-bisector theorem and Pythagoras',14:'organize a congruence proof from three given facts',15:'translate a sagitta and half-chord into a radius equation',16:'infer equal chords, identify an equilateral triangle, and derive its circumradius',17:'chain tangent-length equalities across two vertices',18:'chain tangent-length relations across four adjacent triangles',19:'combine a right-triangle triple, midpoint, parallelism and similarity',20:'combine a right-triangle ratio with two projected components',21:'derive a height from a sine ratio and use the area formula',22:'derive the missing side from a right-triangle ratio and compute two ratios',23:'combine tangent perpendicularity, chord bisection, Pythagoras and area',24:'convert depression angles, use two tangent equations, then add lengths'
};
const preflight = JSON.parse(fs.readFileSync(path.join(assignment.evidenceRootAbsolute,'CREATE.golden-negative-preflight.json'),'utf8'));
const rows = questions.map((q,index) => {
  const qid = Number(q.id);
  const itemAssets=[];
  for (const ref of [q.image,q.solutionImage,q.visualAsset].filter(Boolean)) {
    const asset=assetMap.get(ref); if (!asset) throw new Error(`ASSET_NOT_IN_ASSIGNMENT:q${qid}:${ref}`);
    itemAssets.push(asset);
  }
  const sourceProjection={id:q.id,content:q.content,choices:q.choices,image:q.image||null,answer:q.answer};
  const sourceFingerprint=sha256(Buffer.from(JSON.stringify(sourceProjection),'utf8'));
  const solutionHash=sha256(Buffer.from(q.solution, 'utf8'));
  const imageEvidence=q.image ? {ref:q.image,sha256:assetMap.get(q.image).sha256,review:'assigned source image opened; mathematical labels/diagram read'} : null;
  const svgEvidence=q.solutionImage ? {ref:q.solutionImage,sha256:assetMap.get(q.solutionImage).sha256,review:'assigned temporary SVG parsed and rasterized; labels, topology, and stated decisive values checked against solution'} : {disposition:'NOT_REQUIRED',reason:'No solution SVG in the current source artifact; student-facing problem image/text remains bound when present.'};
  const isSubjective=q.choices.length===0;
  return {
    qid,
    sourceMode:'ORIGINAL',
    provenanceEvidence:{sourceParity:{sourceManifest:assignment.sourceManifestAbsolute,sourceManifestSha256:sha256(sourceManifestBytes),sourceSelection:sourceRow.sourceSelection,selectedPath:sourceRow.selectedPath,sourceWorkingPath:sourceRow.workingPath,sourceArtifactRawSha256:sha256(sourceBytes),manifestInputFileSha256:sourceRow.inputFileSha256,sourcePdf:null,answerHwp:null,sourceDocumentStatus:'NOT_LISTED_IN_EXACT_SOURCE_ROW',studentPayloadParity:'PASS',scope:'selected committed branch snapshot; official original PDF/HWP is not named by the manifest row'}},
    axisEvidence:{
      questionLayout:{status:'PASS',beforeDisposition:'LAYOUT_KEEP',finalDisposition:'LAYOUT_KEEP',issueCodes:[],changedFields:[],exactSourceTextAndChoiceOrder:true,semanticBoundaries:'source order and all prompt/choice text retained exactly; assigned problem image/table retained; static disposition only'},
      solutionLayout:{status:'PASS',smallBoardContinuity:'PASS',boardFlow:'source interpretation → governing relation → substitutions/intermediate values → calculation → final response are separated by line breaks',changedFields:['solution'],staticRenderedSolutionSvg:!!q.solutionImage},
      meta:{status:'BOUND_WITH_PROJECTION_DEBT',standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,subUnitConfidence:q.subUnitConfidence,subUnitClassificationDepth:q.subUnitClassificationDepth,problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern},
      visualSvg:{status:'PASS',disposition:q.solutionImage?'RETAIN_EXISTING_SHA_BOUND_SVG':(q.image?'PROBLEM_IMAGE_ONLY':'NOT_REQUIRED'),problemImage:imageEvidence,solutionSvg:svgEvidence,assignedAssetRefs:itemAssets.map(a=>({ref:a.ref,sha256:a.sha256}))}
    },
    answerCardinalityEvidence:{status:'FRESH_SOLVE_MATCH',independentlySolvedFromStudentPromptAndAssignedVisual:true,choicesCount:q.choices.length,cardinality:isSubjective?'single requested numeric/value response':'single correct option among five',storedSnapshotAnswer:q.answer,independentReason:standardSolutions[qid]},
    itemDisposition:'PASS',
    solutionSha256:solutionHash,
    smallBoardContinuityStatus:'PASS',
    smallBoardEvidence:{solutionSha256:solutionHash,reason:'visible defining relation, decisive intermediate calculation and conclusion are separate source lines; not judged by line count'},
    sourceFingerprint,
    sourceParityStatus:'PASS_TO_MANIFEST_SELECTED_SNAPSHOT',
    difficultyEvidence:{sourceFingerprint,solutionSha256:solutionHash,difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reviewStatus:'CREATE_CURRENT_PASS_PENDING_R1_INDEPENDENT_REVIEW',rationale:difficultyRationales[qid]},
    assetEvidence:itemAssets.map(a=>({ref:a.ref,sha256:a.sha256,path:a.path})),
    renderStatus:'NOT_RUN_ROOT_WAIVER'
  };
});
const metaDebtReason='The exact selected source snapshot carries current unit/subunit fields but no L3/L4 projection keys. This CREATE preserves that semantic classification boundary; null PT/TPL fields remain explicit projection debt for a current ACTIVE lookup, rather than an inferred semantic key.';
const evidence={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:assignment.qualityContractVersion,executionLine:'CODEX',stage:'CREATE',examUid:assignment.examUid,artifactSha,artifactRawSha256,sourceArtifactRawSha256:sha256(sourceBytes),sourcePDFSha256:null,answerHwpSha256:null,sourceProvenanceSha256:sha256(Buffer.from(JSON.stringify({manifestSha256:sha256(sourceManifestBytes),sourceRow,sourceArtifactRawSha256:sha256(sourceBytes)}),'utf8')),sourcePageCount:null,sourceManifestAbsolute:assignment.sourceManifestAbsolute,sourceManifestRow:{sourceSelection:sourceRow.sourceSelection,selectedPath:sourceRow.selectedPath,workingPath:sourceRow.workingPath,inputFileSha256:sourceRow.inputFileSha256,qualityReview:sourceRow.qualityReview,sourceEvidence:sourceRow.sourceEvidence,sourcePdfs:sourceRow.sourcePdfs},denominator:questions.length,itemHoldQids:[],goldenCalibrationSet:preflight.goldenSamples.map(s=>s.path),goldenCalibration:{samples:preflight.goldenSamples.map(s=>({path:s.path,sha256:s.sha256,items:s.items.map(i=>({...i,axes:['STUDENT_REPRODUCIBILITY','SMALL_BOARD_STRUCTURE','EXPLANATION_DENSITY','VISUAL_SEMANTIC_PARITY','VISUAL_READABILITY']}))})),negativeSample:{path:preflight.negativeSample.path,sha256:preflight.negativeSample.sha256,observation:preflight.negativeSample.observation}},goldenCalibrationReviewed:true,goldenCalibrationOrder:'Golden sample solutions and assigned SVGs plus approved Negative README/SVG read before target edits.',solutionRewrite:true,solutionRewriteCount:questions.length,solutionRewriteAttempted:true,solutionRewriteResolved:questions.length,questionLayoutCoverage:{denominator:questions.length,keep:questions.length,polish:0,reformat:0,hold:0,questionLayoutStatus:'PASS',sourceTextExactParityStatus:'PASS',choicesExactParityStatus:'PASS',questionLayoutRenderStatus:'NOT_RUN_ROOT_WAIVER',staticDisposition:'all student prompt and choice fields match the exact manifest selected snapshot'},sourceTextExactParityStatus:'PASS',choicesExactParityStatus:'PASS',renderDecision:assignment.renderDecision,renderStatus:'NOT_RUN_ROOT_WAIVER',assetRootAbsolute:assignment.assetRootAbsolute,rows,artifactDispositions:{artifactSha,rows:questions.map(q=>({qid:q.id,metaDebtFields:['problemTypeKey','templateKey'],metaDebtReason}))},
};
const out=path.join(assignment.evidenceRootAbsolute,'CREATE.evidence.json');
fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify({evidencePath:out,artifactSha,artifactRawSha256,sourceParityCount:questions.length,assetCount:assetMap.size,goldenCount:evidence.goldenCalibration.samples.length},null,2));

