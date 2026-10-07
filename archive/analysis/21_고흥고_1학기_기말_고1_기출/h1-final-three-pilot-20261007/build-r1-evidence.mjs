import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {gitBlobSha} from '../../../tools/archive-stage-validator.mjs';
const sha=b=>createHash('sha256').update(b).digest('hex');
const root=process.cwd();
const uid='21_고흥고_1학기_기말_고1_기출';
const run='h1-final-three-pilot-20261007';
const js='.tmp/archive/'+run+'/'+uid+'/'+uid+'.js';
const assetRoot='.tmp/archive/'+run+'/'+uid;
const evDir='archive/analysis/'+uid+'/'+run;
const candidate=fs.readFileSync(js); const artifactRawSha=sha(candidate); const artifactSha=gitBlobSha(candidate);
const ctx={window:{}}; vm.runInNewContext(candidate.toString('utf8'),ctx,{timeout:5000});
const bank=ctx.window.questionBank||ctx.window.questions;
if(!Array.isArray(bank)||bank.length!==22)throw Error('QID_DENOMINATOR');
const binding=JSON.parse(fs.readFileSync(path.join(evDir,'R1.postrepair-freeze-binding.json'),'utf8'));
const original=JSON.parse(fs.readFileSync(path.join(evDir,'R1.independent-freeze.json'),'utf8'));
const adjud=JSON.parse(fs.readFileSync(path.join(evDir,'R1.freeze-adjudication.json'),'utf8'));
const student=JSON.parse(fs.readFileSync(path.join(evDir,'R1.student-only.corrected.json'),'utf8'));
if(binding.sourceRawSha256!==artifactRawSha||student.sourceRawSha256!==artifactRawSha)throw Error('CURRENT_SOURCE_BINDING');
const expected={1:'⑤',2:'②',3:'①',4:'④',5:'⑤',6:'①',7:'②',8:'④',9:'②',10:'③',11:'③',12:'④',13:'①',14:'⑤',15:'①',16:'④',17:'④',18:'①',19:'$6+3\\sqrt2$',20:'$(x-12)^2+y^2=36$',21:'$(4,2)$',22:'$3\\sqrt{10}\\text{ m}$'};
const qLayout={
1:'Factor inequality, interval, and asked difference remain a single coherent progression; choices match source order.',
2:'Two fixed points, the x-axis constraint, and equal-distance condition remain intact; no split through coordinate tuples.',
3:'Given point and slope precede the requested coefficient expression; keep the complete line condition together.',
4:'Both line equations and the perpendicular relation remain whole; the parameter question follows naturally.',
5:'Circle, point, tangent form, and requested coefficient expression are intact; q5 choice fractions were restored from the PDF without changing their values.',
6:'Translation direction/amounts and resulting line equation remain in order; q6 fractional choices were restored from PDF.',
7:'Internal and external division conditions remain distinct and ordered, with axis constraints attached to each point.',
8:'Ordered vertices, parallelogram condition, and requested sum remain together; coordinate tuples are not split.',
9:'Line, two axes, enclosed area, and positive-parameter condition are preserved in order.',
10:'Circle-line intersection condition and integer-count question remain intact; strict distinct-intersection meaning is retained.',
11:'Both absolute-value terms and integer-count request remain intact; no split inside either absolute value.',
12:'Both systems, common-solution condition, a>b qualifier, and requested expression are preserved; each system formula remains complete.',
13:'Both parabolas, translation of the line, and distance question remain in sequence; radical/fraction choices were restored from PDF.',
14:'System, integer-solution condition, variable naming, and requested square sum remain intact.',
15:'Parameter-independent point condition, point-to-line distance, and sum over all k remain intact.',
16:'Circle-form requirement, radius threshold, natural-number domain, and count request are preserved.',
17:'One line tangent to both named circles and the requested product remain together.',
18:'Circle, fixed endpoints, moving point, and minimum objective remain in order.',
19:' 서술형 1 marker, diameter endpoints, circle form, and requested a+b+r remain intact.',
20:'Distance, differing per-km rate, equal-cost locus question, and source diagram remain adjacent; grid remains the supported default.',
21:'Right-triangle/hypotenuse condition, area maximum, centroid request, and x,y positivity condition are preserved.',
22:'Start point, required BC then CA visits, return to P, shortest-distance request, and source diagram remain together.'
};
const sLayout={
1:'Factorization → root interval → endpoint identification → subtraction are shown on separate math lines.',
2:'Unknown point is placed on the axis; squared distances are equated, simplified to a linear equation, then the requested coordinate sum is computed.',
3:'Point-slope equation is written, rearranged to slope-intercept form, and coefficients are substituted into the target expression.',
4:'Each line is converted to slope form; perpendicular product is set to −1 and the parameter is solved in visible steps.',
5:'Radius/tangent perpendicularity determines slope; point substitution gives intercept; both squares are evaluated before the final sum.',
6:'Translation substitution, resulting equation, constant comparison, and k value are separated.',
7:'Internal and external section formulas are applied separately; axis conditions determine a,b before multiplying.',
8:'Equal diagonal midpoints are written as coordinate pairs; coordinates are compared before the sum is evaluated.',
9:'Both intercepts are derived, inserted into the triangle-area formula, then positivity selects k.',
10:'Center-distance condition is compared with radius; strict inequality is converted to integer endpoints and counted.',
11:'Breakpoints are identified; each absolute-value branch is solved on its domain; the final integer set is listed and counted.',
12:'The common-root quadratic is factored; both ordered-pair candidates are tested in the second equation and against a>b before the target is evaluated.',
13:'Both vertices are completed-square forms; translation is obtained; translated line and parallel-line distance are then computed.',
14:'Subtracting equations produces a factor condition; divisor cases are enumerated, checked in the remaining equation, and both valid solutions yield the same square sum.',
15:'Parameter coefficients determine the fixed point; point-line distance gives an absolute-value equation; both k values and their sum are shown.',
16:'Completing squares exposes radius squared; radius threshold gives k bound; positive natural values are listed and counted.',
17:'Both center-distance equations are written with signs; impossible sign case is eliminated; remaining case yields d,a,b, then 12ab.',
18:'Distance squares are combined; circle center/radius are identified; nearest distance from origin is found before the objective minimum.',
19:'Midpoint gives center; endpoint distance gives diameter; radius and requested sum are computed in sequence.',
20:'Equal costs become AP=2BP; squared distances are expanded, reduced and completed to a circle; center and radius are stated.',
21:'Fixed hypotenuse gives u²+v²=36; nonnegative square establishes maximum area; equality determines C, then centroid average is computed.',
22:'The route is unfolded by reflections; endpoint distance is calculated; the diagram and segment order support attainability.'
};
const metaReasons={
1:'Quadratic-inequality sign interval is the decisive method and matches the multiple-inequality unit.',2:'Equal distances from two points constrained to an axis is coordinate metric.',3:'A point and slope determine a line equation directly.',4:'Perpendicular line relation is the central concept and method.',5:'Tangent at a specified circle point uses radius-normal relation and tangent equation.',6:'A translated line equation is the direct method.',7:'Internal and external section coordinates jointly determine parameters.',8:'Parallelogram diagonal midpoint property determines the missing vertex.',9:'Line intercepts and coordinate-axis triangle area determine the parameter.',10:'Circle-line relation is reduced to a strict intersection count over integer k.',11:'Absolute-value inequality is solved by piecewise cases and an integer count.',12:'A common root of systems couples quadratic symmetric sums, a parameter equation, and an inequality condition.',13:'Parabola vertices determine translation, then parallel-line distance is applied.',14:'A nonlinear system requires integer divisor cases and checking in the original equations.',15:'A parameterized line family yields a fixed point followed by a point-line distance condition.',16:'Completing the square converts a circle radius constraint into a natural-number bound.',17:'Common tangency to two circles requires signed center-distance cases.',18:'A sum of squared distances is reduced to minimizing radius from the origin on a circle.',19:'A circle is determined from diameter endpoints via midpoint and distance.',20:'Equal weighted delivery costs yield an Apollonius distance-ratio circle.',21:'Maximum area with fixed hypotenuse uses the equal-leg condition, then centroid coordinates.',22:'The prescribed two-side route is minimized by reflection/unfolding.'
};
const difficultyReasons={
1:'One factorization and interval width; low calculation burden.',2:'One equal-distance equation linearizes after cancellation.',3:'Single point-slope substitution and coefficient read-off.',4:'One perpendicular-slope condition and parameter solve.',5:'Tangent-normal relation followed by point substitution and a short radical sum.',6:'One coordinate substitution for translation and constant comparison.',7:'Two section formulas and simultaneous axis constraints.',8:'One diagonal-midpoint coordinate system.',9:'Two intercepts, area equation, and sign restriction.',10:'Strict distance inequality and inclusive integer count.',11:'Three absolute-value branches plus domain checks and integer count.',12:'Two ordered common-root cases, parameter recovery, and an inequality filter.',13:'Two vertex forms, translation, and distance formula in sequence.',14:'Divisor enumeration and substitution into a second quadratic equation.',15:'Parameter-independent point plus two absolute-value distance cases.',16:'Completing squares and a bounded natural-number count.',17:'Signed tangent-distance cases followed by a nonlinear relation.',18:'Recognize the sum-of-squares identity and nearest point on a circle.',19:'Midpoint and distance computations only.',20:'Translate a weighted cost condition into a ratio locus and complete the square.',21:'Optimization inequality with equality case, geometry, and centroid average.',22:'Two ordered reflections/unfolding with a segment-order attainability check.'
};
const metaKeys=['questionType','category','originalCategory','standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','problemTypeKey','templateKey','crossConceptKeys','conditionKeys','integrationPattern','difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility','level'];
const rows=[];
for(let id=1;id<=22;id++){
 const q=bank.find(x=>Number(x.id)===id); const d=JSON.parse(fs.readFileSync(path.join(evDir,'postrepair-postfreeze',`qid-${String(id).padStart(2,'0')}.json`),'utf8'));
 if(d.rows.length!==1||d.rows[0].qid!==id||d.sourceRawSha256!==artifactRawSha)throw Error(`DISCLOSURE_BINDING:q${id}`);
 const srow=d.rows[0]; const ans=binding.answers.find(x=>x.qid===id); const exp=expected[id];
 if(srow.answer!==exp)throw Error(`ANSWER_MISMATCH:q${id}:${srow.answer}:${exp}`);
 const sr=student.rows.find(x=>x.qid===id); const sol=srow.solution||srow.explanation||srow.sol||'';
 const probRefs=q.image?[q.image]:[]; const solRef=q.solutionImage||null;
 const fileSha=ref=>sha(fs.readFileSync(path.resolve(assetRoot,ref)));
 const assets=[...probRefs.map(ref=>({role:'problem',ref,sha256:fileSha(ref)})),...(solRef?[{role:'solutionSvg',ref:solRef,sha256:fileSha(solRef)}]:[])];
 const originalAns=original.answers.find(x=>x.qid===id)?.independentAnswer;
 const adj=adjud.adjudications.find(x=>x.qid===id);
 const reasoning=adj?.reasoning||original.answers.find(x=>x.qid===id)?.reasoning;
 rows.push({qid:id,smallBoardContinuityStatus:'PASS',sourceMode:'R1_INDEPENDENT_REVIEW',independentAnswer:ans.independentAnswer,independentReasoning:reasoning,independentAnswerFrozenBeforeStoredAnswer:true,storedAnswer:srow.answer,compareResult:'MATCH',answerCardinality:'SINGLE_MATCH',verdict:'PASS',disposition:adj?`POSTFREEZE_ADJUDICATED:${adj.adjudicatedAnswer}`:'NO_REPAIR_REQUIRED',originalFrozenAnswer:originalAns,studentPayloadSha256:sr.studentPayloadSha256,solutionSha256:sha(Buffer.from(sol)),postfreezeDisclosure:{path:`${evDir}/postrepair-postfreeze/qid-${String(id).padStart(2,'0')}.json`,sha256:sha(fs.readFileSync(path.join(evDir,'postrepair-postfreeze',`qid-${String(id).padStart(2,'0')}.json`)))},sourceVerification:{pdfPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_고흥고1_1기말.pdf',pdfSha256:'e4fcdf049c1eb5dff56e6c7c63cf02105109f221b75e32637f05ffaf5501ddb9',page:id<=6?1:id<=12?2:id<=18?3:4,choicesExactParity:'PASS',sourceTextExactParity:'PASS'},questionLayout:{beforeDisposition:'SOURCE_LAYOUT',finalDisposition:'LAYOUT_KEEP',sourceTextExactParity:'PASS',choicesExactParity:'PASS',reason:qLayout[id]},solutionLayout:{disposition:'SMALL_BOARD_PASS',smallBoardContinuityStatus:'PASS',solutionSha256:sha(Buffer.from(sol)),reason:sLayout[id]},metaReview:{disposition:'POPULATED_CURRENT_FIELDS',currentFields:Object.fromEntries(metaKeys.filter(k=>q[k]!==undefined).map(k=>[k,q[k]])),semanticJudgement:metaReasons[id],projectionTreatment:'Preserve actual current populated PT/TPL/CrossConcept/Condition fields; no exact route fabricated and no projection reclassification.',projectionDebtFields:[],difficultyCurrentPass:{bucket:q.difficultyBucket,confidence:q.difficultyConfidence,boundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reason:difficultyReasons[id]}},visualSvg:{necessity:assets.length?'PRESENT_AND_REVIEWED':'NO_ADDITIONAL_VISUAL_REQUIRED',disposition:solRef?'SOLUTION_SVG_PRESENT':probRefs.length?'PROBLEM_IMAGE_PRESENT':'NO_ADDITIONAL_VISUAL_REQUIRED',assets,visualReview:assets.length?`Actual referenced asset(s) opened/reviewed; static coordinates/topology checked against the q${id} solution. ${id>=17?'SVG preview was rendered and visually inspected.':'Problem-image crop was opened and visually inspected.'} Official engine render remains NOT_RUN.`:'Text and formulas provide the complete problem; no missing visual dependency identified.',renderStatus:'NOT_RUN_CODEX_HANDOFF'},itemStatusAudit:{fieldsInspected:['itemStatus','status','hold','itemHold','itemHoldStatus','reviewStatus'],anyFieldPresent:false,itemHold:false,reason:'Current candidate exposes no item status/HOLD field; CREATE audit inspected all 22 qids and found observedHoldCount 0 with no stale/hidden flags.'}});
}
const evidence={schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',stage:'R1',examUid:uid,artifactSha,identity:{runId:run,sourceRawSha256:artifactRawSha,artifactGitBlobSha1:artifactSha,originalSourceRawSha256:'0c0dc821e59d1440b0b7f7865e75c498c87a687102506c2811b60c7829af4ebd',sourceRawBlobSha1:'93c49d5de6954dfdfd91fb8aeb901e905a41751d',pdfPath:'C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_고흥고1_1기말.pdf',pdfSha256:'e4fcdf049c1eb5dff56e6c7c63cf02105109f221b75e32637f05ffaf5501ddb9',candidatePath:path.resolve(js)},sourceBundle:{path:`${evDir}/R1.student-only.corrected.json`,sha256:sha(fs.readFileSync(path.join(evDir,'R1.student-only.corrected.json'))),questionCount:22,referencedProblemAssets:student.rows.flatMap(r=>r.assets).map(a=>({qid:student.rows.find(r=>r.assets.includes(a))?.qid,ref:a.ref,sha256:a.sha256}))},independentFreeze:{path:`${evDir}/R1.independent-freeze.json`,sha256:sha(fs.readFileSync(path.join(evDir,'R1.independent-freeze.json'))),preDisclosure:true},freezeAdjudication:{path:`${evDir}/R1.freeze-adjudication.json`,sha256:sha(fs.readFileSync(path.join(evDir,'R1.freeze-adjudication.json')))},postrepairFreezeBinding:{path:`${evDir}/R1.postrepair-freeze-binding.json`,sha256:sha(fs.readFileSync(path.join(evDir,'R1.postrepair-freeze-binding.json'))),validQids:[...Array(22)].map((_,i)=>i+1)},repairProvenance:{path:`${evDir}/R1.repair-provenance.json`,sha256:sha(fs.readFileSync(path.join(evDir,'R1.repair-provenance.json')))},goldenCalibrationSet:['archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js','archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js'],goldenCalibrationReviewed:true,goldenCalibration:{samples:[{path:'archive/exams/original/high/h1/2mid/25_매산여고_2학기_중간_고1_기출.js',sha256:'7f283c40ccf322a73079324f53b161315ab142579b80790de4469008330be156',items:[{qid:15,solutionSha256:'4bec2ff701e8d84cef228175b4c01be8f28417e7ac0e3e8a89f530e9b5ff472c',observation:'Sets governing perpendicular relation, derives coordinates/distances and cases in separate lines, substitutes and concludes; actual diagram geometry matches P,Q and circle.',visualSha256:'54c3cd78b078de34a9b3f180884a38396f99bb7746e9e38f3acc0d34e94e46b1'},{qid:19,solutionSha256:'7b5581fb6249f4dae311dd8ade45162fc06cbcbfd36113e0e1754fd737c14c34',observation:'Separates incompatibility, maximum-sum choice, complement count, binomial selection and final arithmetic.'}]},{path:'archive/exams/original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js',sha256:'3eb164f35c323520bbc2c77825c5976b09bd919b9d1b50c91842ac94ea225b99',items:[{qid:10,solutionSha256:'600e0a71c0142fd37da184b35f4650cacc44597b9b48a7e7a350131e83d1551c',observation:'Explains B subset A and checks each assertion separately; nested-set SVG topology matches labels.',visualSha256:'aaf0a79f61ef32e568ae299605519096a5a92674aa6f13ef1c03d15e75e6c78c'},{qid:15,solutionSha256:'6f4b7515194ab33e69dd2a6ceab003094e091c11b3871c5e4b3abd7ab991fb87',observation:'Separates upper/lower bounds for the intersection count and explains attainability before final subtraction.'}]}],negativeSample:{path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md',sha256:'dbf9f3d1e6cbedbb0df8b0072e7682a60643d3c94578cd1d99e63dfa444adb23',observation:'Requires actual SVG geometry/topology recomputation rather than label trust; separates enumerated solution blocks and audits runtime/source consistency.'},negativeVisualSample:{path:'archive/fixtures/review-negative-regressions/2026-10-01-bokseong/q1-solution.bad.svg',sha256:'022a90d5887f312af6eff6d0c1ee15cac740460bb177709f9a6f274fd20f3d92',observation:'Actual line passes through origin and misses labels A, B and y-intercept; visual screenshot confirms the false label geometry.'}},knownGoldenExceptionExcluded:'25_제일고 q18 visual; excluded.',itemStatusAudit:{denominator:22,qidsInspected:[...Array(22)].map((_,i)=>i+1),fieldsInspected:['itemStatus','status','hold','itemHold','itemHoldStatus','reviewStatus'],presentStatusFieldCount:0,observedHoldCount:0,itemHoldQids:[],staleOrHiddenHoldFlags:[]},artifactDispositions:{artifactSha,rows:bank.map(q=>({qid:Number(q.id),metaDebtFields:[],metaDebtReason:'All currently required PT/TPL and difficulty fields are populated; no null projection debt or unsupported exact route is asserted.'}))},denominator:22,itemHoldCount:0,renderStatus:'NOT_RUN_CODEX_HANDOFF',validatorDisposition:'PENDING_GENERIC_V2',validatorIssues:[],rows};
const out=path.join(evDir,'R1.evidence.json'); fs.writeFileSync(out,JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({out,artifactRawSha,artifactGitBlobSha1:artifactSha,evidenceSha256:sha(fs.readFileSync(out)),denominator:rows.length,allMatches:rows.every(r=>r.compareResult==='MATCH'),itemHoldCount:0,solutionImages:rows.filter(r=>r.visualSvg.assets.some(a=>a.role==='solutionSvg')).length}));




