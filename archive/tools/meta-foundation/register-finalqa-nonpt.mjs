// FINAL QA non-PT metadata registration: one 2022 Calculus I exam, no PT/TPL fabrication.
// Invoked only by archive-reviewed-exam-meta-register.yml via small, source-bound inbox request.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
const EXAM = "26_금당고_2학기_중간_고2_미적분I";
const SOURCE = "original/high/h2/2mid/" + EXAM + ".js";
const CANDIDATE = "archive/data/meta-foundation/exam-scoped/" + EXAM + ".json";
const META = "archive/data/question_metadata.json";
const IDENTITY = "archive/data/question_identity_map.json";
const RECEIPT = "archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/geumdang26-calculus1-finalqa-nonpt.json";
const VERSION = "archive-finalqa-nonpt-register-request-v1";
const fail = s => { throw new Error("FINALQA_NONPT: " + s); };
const read = (root, rel) => JSON.parse(fs.readFileSync(path.join(root,rel), "utf8"));
const sha1blob = bytes => crypto.createHash("sha1").update("blob "+bytes.length+"\0").update(bytes).digest("hex");
const sha256 = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
const same = (a,b) => JSON.stringify(a ?? null)===JSON.stringify(b ?? null);
const out = d => JSON.stringify(d,null,2)+"\n";
const fingerprint = q => sha256(JSON.stringify({
  content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,
  answer:q.answer??null,solution:q.solution??null,image:q.image??null
}));
const contentFingerprint = q => sha256(JSON.stringify({
  content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null
}));
export function registerFinalqaNonpt({root,request:req,write=false,verifyProjection=false}) {
  if(req.schemaVersion!==VERSION||req.requestId!=="geumdang26-calculus1-finalqa-nonpt-20261023"||
     req.examUid!==EXAM||req.sourceArchiveFile!==SOURCE||req.expectedQuestionCount!==21||
     req.candidatePath!==CANDIDATE||!/^([0-9a-f]{40})$/.test(req.expectedMetadataBlobSha1||""))
    fail("scope, schema or baseline missing");
  if(req.approval?.type!=="FINAL_QA"||req.approval?.metadataReviewed!==true||
     req.approval?.approvedBy!=="USER_DIRECTED_FINALQA" ||
     req.projectionPolicy!=="NON_PT_SEMANTICS_ONLY__NO_PT_TPL_APPROVAL")
    fail("explicit scoped FINAL_QA approval and nonPT guard required");
  const sourceBytes=fs.readFileSync(path.join(root,"archive/exams",SOURCE));
  const sourceBlob=sha1blob(sourceBytes);
  if(sourceBlob!==req.expectedSourceBlobSha1) fail("source blob drift");
  const candidateBytes=fs.readFileSync(path.join(root,CANDIDATE));
  if(sha1blob(candidateBytes)!==req.expectedCandidateBlobSha1) fail("candidate blob drift");
  const candidate=JSON.parse(candidateBytes);
  if(candidate.examUid!==EXAM||candidate.sourceArchiveFile!==SOURCE||candidate.sourceBlobSha!==sourceBlob||
     candidate.status!=="SEMANTIC_CANDIDATE__NOT_PRODUCTION_REGISTERED"||
     candidate.recordCount!==21||candidate.records?.length!==21) fail("candidate not source-bound");
  const context={window:{},console:{log(){},warn(){},error(){}}};
  vm.createContext(context);vm.runInContext(sourceBytes.toString("utf8"),context,{timeout:5000});
  const bank=context.window.questionBank;
  if(!Array.isArray(bank)||bank.length!==21||bank.some((q,i)=>q.id!==i+1))
    fail("source question denominator");
  const metadataBytes=fs.readFileSync(path.join(root,META));
  const metadata=JSON.parse(metadataBytes),identity=read(root,IDENTITY);
  const rows=(metadata.records||[]).filter(r=>r.sourceArchiveFile===SOURCE).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
  const ids=(identity.records||[]).filter(r=>r.sourceArchiveFile===SOURCE).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
  if(rows.length!==21||ids.length!==21)fail("sidecar or identity denominator");
  const receiptFile=path.join(root,RECEIPT);
  const oldReceipt=fs.existsSync(receiptFile)?JSON.parse(fs.readFileSync(receiptFile,"utf8")):null;
  if(oldReceipt){
    if(oldReceipt.requestId!==req.requestId||oldReceipt.sourceBlobSha1!==sourceBlob||
       oldReceipt.candidateBlobSha1!==req.expectedCandidateBlobSha1) fail("receipt collision");
  }else if(sha1blob(metadataBytes)!==req.expectedMetadataBlobSha1){
    fail("stale-before metadata blob (regenerate small request from current main)");
  }
  // NonPT semantic enrichment is intentionally richer than unchanged student JS fields.
  // Every additional CC/Condition key must already be ACTIVE; no new keys or PT/TPL.
  const expectedCC = [...new Set(candidate.records.flatMap(r=>r.after?.crossConceptKeys||[]))];
  const expectedConditions = [...new Set(candidate.records.flatMap(r=>r.after?.conditionKeys||[]))];
  if(expectedCC.length||expectedConditions.length){
    const cc = read(root,"archive/data/meta-foundation/compiled/concept_registry.json").concepts||[];
    const cond = read(root,"archive/data/meta-foundation/compiled/condition_registry.json").conditions||[];
    const activeCC = new Set(cc.filter(r=>r.status==="ACTIVE").map(r=>r.conceptKey));
    const activeCond = new Set(cond.filter(r=>r.status==="ACTIVE").map(r=>r.conditionKey));
    if(expectedCC.some(k=>!activeCC.has(k))||expectedConditions.some(k=>!activeCond.has(k)))
      fail("nonPT CC or Condition is not ACTIVE");
  }
  const uniqueUids=new Set();
  // Do not project enriched CC/Condition/integration candidates over unchanged JS source;
  // they remain in candidate evidence until separate source-bound canonical approval.
  const fields=["L1","L2","L3","L4","level","difficultyBucket"];
  for(let i=0;i<21;i++){
    const item=candidate.records[i],row=rows[i],id=ids[i],q=bank[i],n=i+1;
    if(item.sourceOrdinal!==n||row.sourceOrdinal!==n||id.sourceOrdinal!==n||
       item.sourceArchiveFile!==SOURCE||item.questionUid!==row.questionUid||
       item.questionUid!==id.questionUid||uniqueUids.has(item.questionUid))fail("identity mismatch #"+n);
    uniqueUids.add(item.questionUid);
    if(item.sourceFingerprint!==fingerprint(q)||
       row.sourceFingerprint!==item.sourceFingerprint||id.sourceFingerprint!==item.sourceFingerprint||
       row.contentFingerprint!==contentFingerprint(q))fail("fingerprint mismatch #"+n);
    if(item.after.standardCourse!=="미적분I"||q.standardCourse!=="미적분I"||
       item.after.curriculum!=="2022"||item.after.level!==q.level||
       item.after.difficultyBucket!==q.difficultyBucket||
       !String(item.after.L1||"").trim()||!String(item.after.L2||"").trim()||
       !String(item.after.L3||"").trim()||!String(item.after.L4||"").trim()||
       !Array.isArray(item.after.crossConceptKeys)||
       !Array.isArray(item.after.conditionKeys)||
       !["NONE","SEQUENTIAL","INTERDEPENDENT"].includes(item.after.integrationPattern))
       fail("nonPT candidate/source mismatch #"+n);
    if(item.rpmPrimaryRecordIds?.length===0 && n!==3)fail("RPM no-path unexpectedly beyond q03");
    if(n===3&&(item.after.L3!=="함수의 정의역"||item.after.L4!=="분모의 영점 제외와 구간 표현"||
       item.disposition!=="NOT_APPLICABLE_EXACT_RPM_PATH"))fail("q03 provenance drift");
    if(oldReceipt){
      for(const f of fields)if(!same(row[f],item.after[f]))fail("registered projection drift #"+n+"."+f);
      if(row.metadataRevision!=="finalqa-nonpt:"+req.requestId)fail("registered revision drift #"+n);
      continue;
    }
    if(!["registration_pending_semantic_review","finalqa_nonpt_registered"].includes(row.metadataStatus) ||
       !["review_required","reviewed_pass"].includes(row.reviewStatus) ||
       (row.L3!=null&&row.L3!==""&&row.L3!==item.after.L3) ||
       (row.L4!=null&&row.L4!==""&&row.L4!==item.after.L4))fail("preexisting approval/conflict #"+n);
    // Never create PT/TPL keys or fabricate ACTIVE binding. This is a nonPT semantic sidecar.
    for(const f of fields)row[f]=item.after[f];
    row.curriculum="2022";row.curriculumKey="2022";row.courseKey="미적분I";
    row.metadataStatus="finalqa_nonpt_registered"; // NOT equivalent to approved canonical assignment.
    row.metadataRevision="finalqa-nonpt:"+req.requestId;
    row.fieldStatus={...(row.fieldStatus||{}),L3:"approved_finalqa_nonpt",L4:"approved_finalqa_nonpt",difficulty:"approved_finalqa_nonpt"};
    row.approvalEvidence=[...new Set([...(row.approvalEvidence||[]),CANDIDATE])];
    row.nonPtSemanticRegistration={state:"REGISTERED_SEMANTICS_ONLY",rpmPath:n===3?"EXAM_SCOPED_PREREQUISITE":"CROSSWALK_CANDIDATE",
      ptTpl:"NOT_REVIEWED_NOT_APPROVED",auxiliaryCcCondIntegration:"CANDIDATE_ONLY_NOT_PROJECTED",
      sourceBlobSha1:sourceBlob,candidateBlobSha1:req.expectedCandidateBlobSha1};
  }
  if(oldReceipt){
    return {status:"PASS",mode:"IDEMPOTENT",registeredRows:21,verifyProjection,sourceBlobSha1:sourceBlob,receiptPath:RECEIPT};
  }
  metadata.counts={...(metadata.counts||{})};
  metadata.counts.records=metadata.records.length;
  metadata.counts.semanticallyReviewed=metadata.records.filter(r=>r.reviewStatus==="reviewed_pass"||
    ["approved_semantic_review","approved_exam_meta_source"].includes(r.metadataStatus)).length;
  delete metadata.digest;
  metadata.digest=sha256(JSON.stringify(metadata));
  const receipt={schemaVersion:"archive-finalqa-nonpt-registration-receipt-v1",requestId:req.requestId,
    sourceArchiveFile:SOURCE,sourceBlobSha1:sourceBlob,candidateBlobSha1:req.expectedCandidateBlobSha1,
    metadataBeforeBlobSha1:req.expectedMetadataBlobSha1,registeredRows:21,
    status:"REGISTERED_SEMANTICS_ONLY__CONSUMER_UNVERIFIED",ptTpl:"NOT_IN_SCOPE",q03ExactRpmPath:"NOT_APPLICABLE"};
  if(write&&!verifyProjection){
    fs.writeFileSync(path.join(root,META),out(metadata),"utf8");
    fs.mkdirSync(path.dirname(receiptFile),{recursive:true});
    fs.writeFileSync(receiptFile,out(receipt),"utf8");
  }
  return {status:"PASS",mode:write?"WRITE":"DRY_RUN",registeredRows:21,sourceBlobSha1:sourceBlob,
    receiptPath:RECEIPT,plannedPaths:[META,RECEIPT],consumer:"UNVERIFIED"};
}
