import fs from 'node:fs';
import crypto from 'node:crypto';
import {readExam} from '../../../tools/archive-codex-artifact-io.mjs';
const root = 'C:/Users/USER/Desktop/AP-worktrees/h2-intake-batch01/AP------';
const run = `${root}/archive/analysis/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I`;
const source = `${root}/.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/23_매산여고_1학기_중간_고2_수학I.js`;
const bundleOldPath = `${run}/R1.recovery.current-student-only-full23.json`;
const bundleCurrentPath = `${run}/R1.recovery.current-student-only-postholdclear23.json`;
const output = `${run}/R1.recovery.meta-closure.v4.json`;
if (fs.existsSync(output)) throw new Error('OUTPUT_ALREADY_EXISTS');
const exam = readExam(source);
const oldBundle = JSON.parse(fs.readFileSync(bundleOldPath,'utf8'));
const currentBundle = JSON.parse(fs.readFileSync(bundleCurrentPath,'utf8'));
const sha256 = (p) => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const rationale = {
  1:'Cube-root and exponent-law arithmetic; current M1-01 child is appropriate.',
  2:'Logarithm quotient law; current M1-02 child is appropriate.',
  3:'Pure exponent-law inequality. Rebound from function graph to existing M1-01 exponent child.',
  4:'Radian-to-degree conversion; current trigonometric-definition child is appropriate.',
  5:'Triangle-angle identities; current trigonometric-relation child and range condition are appropriate.',
  6:'Quadratic roots and logarithmic exponent evaluation; existing M1-02 and root-coefficient CrossConcept remain appropriate.',
  7:'Horizontal/vertical translation and reflection of an exponential graph; assigned existing M1-03 graph child.',
  8:'Common-log difference, integer condition, and product of resulting values; existing M1-02 remains appropriate.',
  9:'Distinct intersections of an exponential graph with a horizontal line; assigned existing M1-03 graph child.',
  10:'Trigonometric identity and positivity of a quadratic for all real x; current trigonometric-relation child remains appropriate.',
  11:'Opposite coterminal rays and tangent identity; current trigonometric-relation child remains appropriate.',
  12:'Reciprocal log identities with positive non-unit variables; current M1-02 child and positive/nonzero conditions remain appropriate.',
  13:'Absolute sine/cosine set conditions and interval cases; current trigonometric-relation child and case-branch integration remain appropriate.',
  14:'Coordinate-circle ratios reduced to trigonometric relations; current M1-05 relation child remains appropriate.',
  15:'Exponential inequality for all real x using t=2^x; assigned existing M1-03 application child.',
  16:'Composed logarithmic inequalities, quadratic range, and integer-count parameter; existing M1-04 application child is appropriate; q16 fresh answer and solution review matched and cleared the pending HOLD after freeze.',
  17:'Intersections of two exponential graphs constrained by lengths and triangle area; assigned existing M1-03 graph child; referenced PNG was opened.',
  18:'Two logarithmic graphs intersected by a line; assigned existing M1-04 graph child.',
  19:'Pure logarithm-law equation; rebound from logarithmic-function application to existing M1-02 logarithm child.',
  20:'Trigonometric graph maximum/minimum; existing M1-06 graph child remains appropriate.',
  21:'Exponential and logarithmic inverse graphs with a line and area condition; assigned existing M1-03 graph child, retaining existing inverse-function CrossConcept; referenced PNG was opened.',
  22:'Cosine graph translation and value evaluation; unchanged qualified prior R1 Meta evidence is reused.',
  23:'Count of rational logarithm values under natural-base/range conditions; current M1-02 child and existing prime-factorization CrossConcept remain appropriate.'
};
const patchQids = new Set([3,7,9,15,17,18,19,21]);
const studentRows = new Map(currentBundle.rows.map(r=>[r.qid,r]));
const rows = exam.questions.map(q=>{
  const qid=Number(q.id??q.qid), student=studentRows.get(qid);
  if(!student) throw new Error(`CURRENT_STUDENT_QID_MISSING:${qid}`);
  const meta={
    standardCourse:q.standardCourse,
    standardUnitKey:q.standardUnitKey,
    standardUnit:q.standardUnit,
    standardUnitOrder:q.standardUnitOrder,
    subUnitKey:q.subUnitKey,
    subUnit:q.subUnit,
    subUnitConfidence:q.subUnitConfidence,
    subUnitClassificationDepth:q.subUnitClassificationDepth,
    problemTypeKey:q.problemTypeKey??null,
    templateKey:q.templateKey??null,
    crossConceptKeys:q.crossConceptKeys??[],
    conditionKeys:q.conditionKeys??[],
    integrationPattern:q.integrationPattern??null,
    difficultyBucket:q.difficultyBucket,
    difficultyConfidence:q.difficultyConfidence,
    difficultyBoundaryFlag:q.difficultyBoundaryFlag,
    legacyLevelCompatibility:q.legacyLevelCompatibility,
    reviewStatus:q.reviewStatus??null,
    tagStatus:q.tagStatus??null,
  };
  const debts=[];
  if(meta.problemTypeKey===null) debts.push('problemTypeKey');
  if(meta.templateKey===null) debts.push('templateKey');
  if(meta.reviewStatus==='HOLD') debts.push('reviewStatus');
  return {qid,studentPayloadSha256:student.studentPayloadSha256,assetBindings:student.assets.map(a=>({ref:a.ref,sha256:a.sha256})),disposition:patchQids.has(qid)?'REPAIRED_EXISTING_CANONICAL_L2':'REVIEWED_CURRENT_META',semanticRationale:rationale[qid],meta,sourceBinding:{courseL1L2AndDifficulty:'REVIEWED',activeTaxonomyBindings:'REVIEWED_EXISTING_ONLY'},metaDebtFields:debts,metaDebtReason:debts.length?`Existing nullable PT/TPL fields are preserved without speculative key creation${meta.reviewStatus==='HOLD'?'; q16 reviewStatus HOLD remains pending the scoped post-freeze source/solution disposition':''}.`:'No current Meta projection debt.'};
});
const project = (b)=>b.rows.map(r=>[r.qid,r.studentPayloadSha256,r.assets.map(a=>[a.ref,a.sha256]).sort()]);
const studentParity = JSON.stringify(oldBundle.qids)===JSON.stringify(currentBundle.qids)&&JSON.stringify(project(oldBundle))===JSON.stringify(project(currentBundle));
if(!studentParity) throw new Error('POST_META_STUDENT_ASSET_PARITY_FAILED');
if(exam.rawSha256!==currentBundle.sourceRawSha256||exam.questions.length!==23) throw new Error('CURRENT_SOURCE_OR_DENOMINATOR_BINDING_FAILED');
const intakePath=`${root}/.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/intake-original.evidence.json`;
const tagMasterPath=`${root}/archive/data/master_tables/js_archive_tag_master.json`;
const unitMasterPath=`${root}/docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`;
const value={
 schemaVersion:'JS_ARCHIVE_R1_META_CLOSURE_SUPPLEMENT_V1',examUid:'23_매산여고_1학기_중간_고2_수학I',stage:'R1',executionLine:'CODEX',qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',reviewerIdentity:{role:'archive_r1',reviewerId:'/root/r1_07_recovery'},
 sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',pdfActualReview:'NOT_RUN_NO_SOURCE_DEPENDENT_DEFECT_IDENTIFIED',
 source:{path:source,rawSha256:exam.rawSha256,rawBufferGitBlobSha1:exam.rawBufferGitBlobSha1,previousRawSha256:'86b0a387bdde96fc50231456b33aab28342b8bb061745d1765173566f5c0c15d',intakeProvenance:{path:intakePath,sha256:sha256(intakePath),reuse:'EXISTING_INTAKE_PROVENANCE_REUSED; no new PDF comparison claimed'}},
 studentInput:{preMetaFull23:{path:bundleOldPath,sha256:sha256(bundleOldPath)},postMetaFull23:{path:bundleCurrentPath,sha256:sha256(bundleCurrentPath)},sourceQidCount:23,qids:currentBundle.qids,projectionParity:'EXACT_STUDENT_FIELDS_AND_ASSET_REFS_SHA',answersIncluded:false,assetsOpened:[{qid:17,ref:'assets/images/23_매산여고_1학기_중간_고2_수학I/q17.png',sha256:'974c007906c2f6c522e0f604e1a45cec6f2d9e19343f5c9ddd44ae08940bbf62',opened:true,observation:'Exponential graph pair and labeled A/B/C/D intersections.'},{qid:21,ref:'assets/images/23_매산여고_1학기_중간_고2_수학I/q21.png',sha256:'876c7ddfd7437841ad1067e03aa51515190d2b78bc2e3050877b2abcd084bc63',opened:true,observation:'Exponential and logarithm graphs, line y=-x+5, labeled A/B/C/D.'}]},
 metaAuthority:{unitMaster:{path:unitMasterPath,sha256:sha256(unitMasterPath)},tagMaster:{path:tagMasterPath,sha256:sha256(tagMasterPath),rowCount:1108},masterReviewedCourse:'2015 수학I',standardUnitOrders:{'H15-M1-01':1,'H15-M1-02':2,'H15-M1-03':3,'H15-M1-04':4},extensionRegistriesChanged:false,newPTTPLKeysCreated:false},
 metaRepair:{beforeSourceRawSha256:'86b0a387bdde96fc50231456b33aab28342b8bb061745d1765173566f5c0c15d',afterSourceRawSha256:exam.rawSha256,changedQids:[3,7,9,15,17,18,19,21],changedFields:['standardCourse','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth'],sourceBodyChoicesAnswersSolutionsAndAssetsChanged:false,provenanceScript:`${run}/R1.recovery.apply-meta-l2.mjs`,basis:'Eight existing null L2 leaves were bound to ACTIVE children in the genuine tag master from each current student prompt and, for q17/q21, actual opened source assets.'},
 artifactSha:exam.rawBufferGitBlobSha1,q16HoldClear:{path:run+'/R1.recovery.q16-hold-clear.v1.json',sha256:sha256(run+'/R1.recovery.q16-hold-clear.v1.json')},rows,
 artifactDispositions:{artifactSha:exam.rawBufferGitBlobSha1,rows:rows.map(r=>({qid:r.qid,metaDebtFields:r.metaDebtFields,metaDebtReason:r.metaDebtReason}))},
 qualifiedReuse:{old22Evidence:{path:`${run}/R1.evidence.bound.v2.json`,sha256:'aadfce9be7706d45b6958d42c5426c4d88fd5c7867a0bb60a523faf0294f86f1',scope:'unchanged qids only, including prior independent answer/other-axis evidence'},originalFreeze:{path:`${run}/R1.independent-freeze.tool.v1.json`,sha256:'187b615c3209967db8300dcc6d290edcf320890c73c95f8f764238cf897f9c93',reuse:'Original 22-qid proof identity preserved; q16 excluded'},rootAdoption:{path:`${run}/ROOT.recovery-adoption.v1.json`,sha256:'e27562d05ebfd58e1776034ad06772d4d7b4f196ee101bbe04c54171710b34c0',scope:'complete old22 object and two-asset exact student invariance proof'},q16Freeze:{path:`${run}/R1.recovery.q16.freeze.json`,sha256:'1e0e5ecd440deb9b4a00278f72db24a89665178917515a203cf287b639b1097a',sourceRawSha256:'86b0a387bdde96fc50231456b33aab28342b8bb061745d1765173566f5c0c15d'}},
 currentScope:{freshIndependentMathQid:16,full23MetaClosure:true,unchangedPriorProofQids:Array.from({length:23},(_,i)=>i+1).filter(q=>q!==16),noFull23FreshBlindClaim:true},
 supersedes:{path:run+'/R1.recovery.meta-closure.v3.json',sha256:'12a47be2efcd16cbe76d0bfcf7e3d225e1a377470158ca075f68289d56d85c85',reason:'corrected original-freeze physical path; previous closure v3 preserved'},disposition:'META_CLOSURE_PASS_Q16_HOLD_CLEARED_BY_FRESH_REVIEW'
};
fs.writeFileSync(output,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({path:output,sha256:sha256(output),sourceRawSha256:exam.rawSha256,sourceBlobSha1:exam.rawBufferGitBlobSha1,rowCount:rows.length,metaRepairQids:value.metaRepair.changedQids,studentProjectionParity:studentParity},null,2));










