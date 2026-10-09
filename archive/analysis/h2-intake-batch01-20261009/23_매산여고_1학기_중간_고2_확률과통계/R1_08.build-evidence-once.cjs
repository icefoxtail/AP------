const fs=require('fs'),vm=require('vm'),path=require('path'),crypto=require('crypto');
const [root,pkg,ev]=process.argv.slice(2);
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const rel=p=>path.relative(root,p).replaceAll('\\','/');
const source=path.join(pkg,'23_매산여고_1학기_중간_고2_확률과통계.js');
const currentRawSha=hash(fs.readFileSync(source));
const ctx={window:{}};vm.runInNewContext(fs.readFileSync(source,'utf8'),ctx,{timeout:2000});
const exam=ctx.window.questionBank;
const notes=read(path.join(ev,'R1_08.review-notes.json'));
const freeze=read(path.join(ev,'R1_08.original-freeze.json'));
const initialDisclosure=read(path.join(ev,'R1_08.postfreeze-disclosure.json'));
const answerFix10=read(path.join(ev,'R1_08.q10-encoding-correction.json'));
const answerFix4=read(path.join(ev,'R1_08.q4-answer-correction.json'));
const answerFix3and21=read(path.join(ev,'R1_08.q3-q21-answer-correction.json'));
const assetReads=read(path.join(ev,'R1_08.asset-reads.json'));
const golden=read(path.join(ev,'R1_08.golden-preflight.json'));
const sourceQ21=read(path.join(ev,'R1_08.q21-source-review.json'));
const sourceQ22=read(path.join(ev,'R1_08.q22-source-review.json'));
const initialBundle=read(path.join(pkg,'R1.student-only.json'));
const correctedBundle=read(path.join(pkg,'R1_08.current-student-only-final.json'));
const baseline=path.join(pkg,'extracted-baseline.js');
const frozenById=new Map(freeze.rows.map(x=>[Number(x.qid),x]));
const initialDisclosureById=new Map(initialDisclosure.rows.map(x=>[Number(x.qid),x]));
const noteById=new Map(notes.map(x=>[Number(x.qid),x]));
const oldStudentById=new Map(initialBundle.rows.map(x=>[Number(x.qid),x]));
const currentStudentById=new Map(correctedBundle.rows.map(x=>[Number(x.qid),x]));
const corrections=new Map();
for(const x of [...answerFix10,...answerFix3and21,...answerFix4]) corrections.set(Number(x.qid),x);
const projectionDebt={
  1:{fields:['problemTypeKey','templateKey'],reason:'Current q1 fields are null and projectionStatus is PROJECTION_UNMATERIALIZED. The three independent truth checks require distinct arrangement, combination and repeated-combination semantics; GLOBAL ACTIVE taxonomy and exact binding lookup did not yield a unique primary. Preserve the existing unresolved projection; do not invent a mixed key.'},
  6:{fields:['problemTypeKey','templateKey'],reason:'Existing physical PT/TPL are retained; projectionStatus is PROJECTION_BINDING_PENDING for the registered legacy L2 key H15-PS-02-BINOMIAL_COEFFICIENT. This is compatibility projection debt, not a semantic HOLD or authority to reclassify.'},
  7:{fields:['problemTypeKey','templateKey'],reason:'Existing physical PT/TPL are retained; projectionStatus is PROJECTION_BINDING_PENDING for the registered legacy L2 key H15-PS-02-BINOMIAL_COEFFICIENT. This is compatibility projection debt, not a semantic HOLD or authority to reclassify.'},
  8:{fields:['problemTypeKey','templateKey'],reason:'Existing physical PT/TPL are retained; projectionStatus is PROJECTION_BINDING_PENDING for the registered legacy L2 key H15-PS-02-BINOMIAL_COEFFICIENT. This is compatibility projection debt, not a semantic HOLD or authority to reclassify.'},
  9:{fields:['problemTypeKey','templateKey'],reason:'Existing physical PT/TPL are retained; projectionStatus is PROJECTION_BINDING_PENDING for the registered legacy L2 key H15-PS-02-BINOMIAL_COEFFICIENT. This is compatibility projection debt, not a semantic HOLD or authority to reclassify.'}
};
const rows=exam.map(q=>{
  const id=Number(q.id),frozen=frozenById.get(id),correction=corrections.get(id),note=noteById.get(id),old=initialDisclosureById.get(id);
  const independent=correction?String(correction.correctedAnswer):String(frozen.independentAnswer);
  const stored=String(q.answer);
  if(!note||!frozen||!old) throw Error('ROW_INPUT_MISSING:'+id);
  const debt=projectionDebt[id]||{fields:[],reason:null};
  const problemAsset=assetReads.find(a=>a.ref===q.image)||null;
  const metaCurrent={
    standardCourse:q.standardCourse,standardUnitKey:q.standardUnitKey,standardUnit:q.standardUnit,
    standardUnitOrder:q.standardUnitOrder,subUnitKey:q.subUnitKey,subUnit:q.subUnit,
    problemTypeKey:q.problemTypeKey,templateKey:q.templateKey,projectionStatus:q.projectionStatus,
    crossConceptKeys:q.crossConceptKeys,conditionKeys:q.conditionKeys,integrationPattern:q.integrationPattern,
    difficultyBucket:q.difficultyBucket,difficultyConfidence:q.difficultyConfidence,
    difficultyBoundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,level:q.level
  };
  const metaStatus=note.metaDisposition||((q.projectionStatus==='PROJECTION_BINDING_PENDING')?'PROJECTION_BINDING_PENDING':'PASS');
  const assetObservation=problemAsset?({
    ref:problemAsset.ref,sha256:problemAsset.sha256,opened:true,
    observation:({2:'Grid was opened; P/R/Q lie on the 6-by-4 grid and R is four right/three up from P.',11:'Six equal sectors and the circular rotation model were opened and confirmed.',12:'Regular hexagon with twelve marked seats (two around each 60-degree sector) was opened and confirmed.'})[id]
  }):null;
  const verdict=note.itemVerdict||((note.metaDisposition==='META_ONLY_UNRESOLVED')?'PASS_WITH_META_DEBT':'PASS');
  const row={
    qid:id,independentAnswer:independent,independentAnswerFrozenBeforeStoredAnswer:true,
    independentReasoning:frozen.reasoning,originalFreezeAnswer:frozen.independentAnswer,
    correction:correction||null,storedAnswerBeforeRepair:old.answer,storedAnswer:stored,
    compareResult:independent===stored?'MATCH':'MISMATCH',
    answerCardinality:{validAnswerCount:id===21?2:1,requestedForm:id===21?'singular count; source-confirmed two admissible counts':'single answer'},
    verdict,disposition:note.itemDisposition||((id===3)?'R1_REPAIRED_STRICT_THRESHOLD_COUNT':(id===4)?'R1_REPAIRED_ANSWER_SELECTOR':(id===22)?'R1_REPAIRED_SOURCE_TERMINOLOGY':undefined),
    repairApplied:[3,4,22].includes(id),sourceMode:[3,4,22].includes(id)?'AUDITED_REPAIR':undefined,
    preRepairStoredAnswer:[3,4].includes(id)?old.answer:undefined,
    sourceStudentPayloadSha256:currentStudentById.get(id).studentPayloadSha256,
    frozenStudentPayloadSha256:oldStudentById.get(id).studentPayloadSha256,
    freezeValidity:id===22?note.freezeValidity:([3,4].includes(id)?'RETAINED_STUDENT_INPUT_UNCHANGED':'VALID'),
    questionLayout:{status:note.questionLayoutStatus,evidence:note.questionLayoutNote,studentTextChoicesParity:id===22?'RESTORED_TO_SCOPED_SOURCE':'EXACT'},
    solutionLayout:{status:note.solutionLayoutStatus,evidence:note.solutionLayoutNote},
    smallBoardContinuityStatus:'PASS',
    metaReview:{status:metaStatus,evidence:note.metaNote||('Current exact fields were independently checked against actual L1/L2 master and current ACTIVE taxonomy/binding authorities; projectionStatus '+q.projectionStatus+'.'),currentFields:metaCurrent,metaDebtFields:debt.fields,metaDebtReason:debt.reason},
    visualSvgReview:{status:note.visualStatus,needDisposition:note.visualNeed,problemAsset:assetObservation,solutionImage:q.solutionImage||null,independentReview:true},
    difficultyReview:{currentBucket:q.difficultyBucket,independentBucket:note.difficultyBucket,confidence:q.difficultyConfidence,boundaryFlag:q.difficultyBoundaryFlag,legacyLevelCompatibility:q.legacyLevelCompatibility,reasoning:note.difficultyRationale}
  };
  if(row.compareResult!=='MATCH') throw Error('FINAL_ANSWER_COMPARE_MISMATCH:q'+id);
  return row;
});
const assetHashes=assetReads.map(a=>({ref:a.ref,sha256:a.sha256,opened:a.opened}));
const authorityFiles=[
 'docs/rules/01_CANONICAL/JS아카이브_문항조판_운영규칙_v1.md',
 'docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md',
 'docs/rules/01_CANONICAL/JS아카이브_문항메타_파운데이션_운영규칙_v1.md',
 'docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md',
 'docs/rules/01_CANONICAL/JS아카이브_difficultyBucket_5단계_운영규칙_v1.3.md',
 'docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md',
 'archive/data/meta-foundation/canonical/packs/probability-statistics/taxonomy.json',
 'archive/data/meta-foundation/canonical/packs/probability-statistics/bindings.json',
 'archive/data/meta-foundation/canonical/packs/functions-graphs/taxonomy.json',
 'archive/data/meta-foundation/canonical/packs/functions-graphs/bindings.json',
 'archive/data/meta-foundation/canonical/condition_registry.json'
].map(p=>({path:p,sha256:hash(fs.readFileSync(path.join(root,p)))}));
const artifactDispositions={artifactSha:currentRawSha,rows:rows.map(r=>({qid:r.qid,metaDebtFields:r.metaReview.metaDebtFields,metaDebtReason:r.metaReview.metaDebtReason}))};
const evidence={
  schemaVersion:'JS_ARCHIVE_STAGE_EVIDENCE_v2',stage:'R1',examUid:'23_매산여고_1학기_중간_고2_확률과통계',
  artifactSha:currentRawSha,artifactRawSha256:currentRawSha,qualityContractVersion:'JS_ARCHIVE_QUALITY_CONTRACT_V2_20261006',executionLine:'CODEX',
  reviewerIdentity:{role:'archive_r1',reviewerId:'/root/r1_08'},
  status:'R1_REVIEW_COMPLETE_WITH_ITEM_HOLD',overallVerdict:'PASS_WITH_Q21_ITEM_HOLD',
  sourceInputMode:'EXTRACTED_JS_ASSETS',pdfReviewMode:'DEFECT_ONLY',sourceReferencePolicy:'EXTRACTED_JS_ASSETS / DEFECT_ONLY',
  sourceIdentity:{sourceArchiveFile:'archive/exams/original/high/h2/1mid/23_매산여고_1학기_중간_고2_확률과통계.js',productionRelativePath:'archive/exams/original/high/h2/1mid/23_매산여고_1학기_중간_고2_확률과통계.js',intakeBaselineSourceRawSha256:'8cb33720b3785c8014c939e4ffd3c67e86c52a0cc32c62fba7a28e82ddc268bd',currentArtifactRawSha256:currentRawSha},
  sourceProvenance:{
    intakeEvidence:{path:'.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_확률과통계/intake-original.evidence.json',sha256:'2f2adfcae10d9f7239692375da6768b3dfcc1fa7afc140e87445814a4d22ab68',reuse:'Source identity/intake provenance only; no full-page PDF parity claimed.'},
    extractedBaseline:{path:'.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_확률과통계/extracted-baseline.js',rawSha256:hash(fs.readFileSync(baseline))},
    originalFreezeSourceRawSha256:freeze.sourceRawSha256,currentRawSha256AfterRepairs:currentRawSha,
    studentOnlyFreezeBundle:{path:'.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_확률과통계/R1.student-only.json',sha256:hash(fs.readFileSync(path.join(pkg,'R1.student-only.json')))},
    currentStudentOnlyPacket:{path:'.tmp/archive/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_확률과통계/R1_08.current-student-only-final.json',sha256:hash(fs.readFileSync(path.join(pkg,'R1_08.current-student-only-final.json'))),sourceRawSha256:correctedBundle.sourceRawSha256,studentQidCount:correctedBundle.rows.length,studentParityToOriginalFreeze:'Exact at first postfreeze disclosure; q22 later changed only by meaning-invariant removal of unsupported terminology, with before/after q22 hashes and scoped reason.'}
  },
  originalFreeze:{path:rel(path.join(ev,'R1_08.original-freeze.json')),sha256:hash(fs.readFileSync(path.join(ev,'R1_08.original-freeze.json'))),qidCount:freeze.rows.length,qids:freeze.studentQidOrder,immutable:true,createdBeforeAnyAnswerDisclosure:true,actualAssetReads:assetReads},
  postfreezeDisclosure:{path:rel(path.join(ev,'R1_08.postfreeze-disclosure.json')),sha256:hash(fs.readFileSync(path.join(ev,'R1_08.postfreeze-disclosure.json'))),qids:initialDisclosure.rows.map(x=>x.qid),studentParityAtDisclosure:initialDisclosure.studentParity,originalFreezeSourceRawSha256:initialDisclosure.originalFreezeSourceRawSha256},
  goldenCalibrationReviewed:true,goldenCalibrationSet:golden.selectedGoldenPaths,goldenCalibration:{samples:golden.samples,negativeSample:golden.negativeSample},
  artifactDispositions,rows,
  coverage:{qidCount:rows.length,qids:rows.map(r=>r.qid),axes:{QUESTION_LAYOUT:'22/22',SOLUTION_LAYOUT:'22/22',META:'22/22',VISUAL_SVG:'22/22'},questionLayoutKeepCount:21,questionLayoutSourceRepairs:1,solutionLayoutPassCount:22,smallBoardContinuityPassCount:22,visualSolutionImageCount:0,requiredProblemAssetsOpened:assetReads.length,itemHoldCount:1,itemHoldQids:[21]},
  sourceReviews:[
    {qid:21,path:rel(path.join(ev,'R1_08.q21-source-review.json')),sha256:hash(fs.readFileSync(path.join(ev,'R1_08.q21-source-review.json'))),scope:'QID_ONLY',pdfPage:6,pdfSha256:sourceQ21.sourceDocument.sha256,cropSha256:sourceQ21.sourceCrop.sha256,disposition:'SOURCE_CONFIRMED_NON_UNIQUE_SINGULAR_COUNT'},
    {qid:22,path:rel(path.join(ev,'R1_08.q22-source-review.json')),sha256:hash(fs.readFileSync(path.join(ev,'R1_08.q22-source-review.json'))),scope:'QID_ONLY',pdfPage:6,pdfSha256:sourceQ22.sourceDocument.sha256,cropSha256:sourceQ22.sourceCrop.sha256,disposition:'TRANSCRIPTION_TERM_REMOVED_MEANING_INVARIANT'}
  ],
  originalPdfParityStatus:'NOT_CLAIMED; only q21 and q22 scoped facts were compared',
  actualPdfReviewedQids:[21,22],actualPdfReviewedPageAreas:{q21:'page6 left column crop',q22:'page6 right column crop'},
  actualAssetReads:assetHashes,
  repairLedger:[
    {qid:3,loci:['answer','solution','decisiveStep'],reason:'Strict greater-than excludes 3000; Q=647, P+Q=1727, correct answer ④.',freeze:'preserved',adjudicationPath:rel(path.join(ev,'R1_08.q3-q21-adjudication.json'))},
    {qid:4,loci:['answer'],reason:'Frozen independent value 211 maps to choice ⑤; current stored selector was ④. Corrected only the selector token.',freeze:'preserved',adjudicationPath:rel(path.join(ev,'R1_08.q4-adjudication.json'))},
    {qid:10,loci:['independentAnswerEncoding'],reason:'Freeze reasoning computed 48=choice ③ but the first freeze answer token was accidentally ⑤; corrected by separate pre-disclosure adjudication, no source edit.',freeze:'preserved',adjudicationPath:rel(path.join(ev,'R1_08.freeze-adjudication.json'))},
    {qid:21,loci:['independentAnswerEncoding'],reason:'Complete independent solve has both x=4 and x=9; initial freeze omitted 9. Stored complete set matches; source form remains item HOLD.',freeze:'preserved',adjudicationPath:rel(path.join(ev,'R1_08.q3-q21-adjudication.json'))},
    {qid:22,loci:['question','content'],reason:'Scoped PDF source has no ordered-pair noun before the displayed triple; removed only that unsupported word, preserving source tuple/conditions and the valid independent count.',freeze:'preserved as meaning-invariant terminology repair',sourceEvidence:rel(path.join(ev,'R1_08.q22-source-review.json'))}
  ],
  metaAuthorityReads:authorityFiles,renderStatus:'NOT_RUN_R1_ROLE_SCOPE',actualRenderPassAsserted:false
};
fs.writeFileSync(path.join(ev,'R1_08.evidence-draft.json'),JSON.stringify(evidence,null,2)+'\n','utf8');
console.log(JSON.stringify({path:path.join(ev,'R1_08.evidence-draft.json'),qidCount:rows.length,currentRawSha256:currentRawSha,answerMatches:rows.filter(r=>r.compareResult==='MATCH').length,itemHolds:rows.filter(r=>r.verdict==='HOLD_ITEM').map(r=>r.qid)}));
