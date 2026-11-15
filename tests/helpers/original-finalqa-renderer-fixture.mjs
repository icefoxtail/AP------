import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import crypto from 'node:crypto';import {execFileSync} from 'node:child_process';
import {registerReviewedExamV2} from '../../archive/tools/meta-foundation/reviewed-exam-registration-v2.mjs';
import {sourceFingerprint,contentFingerprint} from '../../archive/tools/meta-foundation/auto-register-merged-source.mjs';
import {ORIGINAL_RENDERER_SCHEMA,ORIGINAL_RENDERER_REVIEW_SCHEMA,originalRendererBindingPath} from '../../archive/tools/meta-foundation/original-finalqa-renderer-preservation.mjs';
const CANON='archive/data/meta-foundation/canonical',META='archive/data/question_metadata.json';
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const blob=bytes=>crypto.createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
const j=v=>JSON.stringify(v,null,2)+'\n';
const stable=value=>JSON.stringify(value,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
function fixture(t, course = "중1 수학", curriculum = "2022") {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "archive-meta-v2-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const put = (p, value) => { const full = path.join(root, p); fs.mkdirSync(path.dirname(full), { recursive: true }); fs.writeFileSync(full, typeof value === "string" ? value : j(value)); };
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), "utf8"));
  put("docs/approval.json", { approved: true, meaning: "fixture reviewed definitions" });
  const evidenceRefs = [{ path: "docs/approval.json", sha256: hash(fs.readFileSync(path.join(root, "docs/approval.json"))) }];
  const q = { id: 1, content: "학생용 지문", choices: ["1", "2"], answer: "1", solution: "학생용 해설", image: "",
    standardCourse: course, standardUnitKey: "UNIT_NEW", standardUnit: "새 단원", subUnitKey: "SUB_NEW", subUnit: "새 세부단원",
    level: "중", problemTypeKey: "PT_NEW", templateKey: "TPL_NEW", crossConceptKeys: ["CC_NEW"], conditionKeys: ["COND_NEW"], integrationPattern: "NONE", difficultyBucket: 3 };
  const source = "fixture/exam.js";
  const text = `window.questions = ${JSON.stringify([q])};\n`;
  put(`archive/exams/${source}`, text);
  const fingerprint = hash(JSON.stringify({ content: q.content, choices: q.choices, answer: q.answer, solution: q.solution, image: q.image }));
  const current = { questionUid: "uid1", sourceArchiveFile: source, sourceOrdinal: 1, sourceFingerprint: fingerprint,
    standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", reviewStatus: "review_required" };
  put(META, { records: [current], counts: {} });
  put("archive/data/question_identity_map.json", { records: [{ ...current }] });
  put(`${CANON}/registry_index.json`, { activePacks: [], activeConceptShards: [], conditionRegistry: { id: "CONDITION_CORE", version: "1", status: "ACTIVE" }, canonicalSources: [{ path: `${CANON}/condition_registry.json` }],
    compiledArtifacts: ["aliases", "concept_registry", "condition_registry", "curriculum_bindings", "taxonomy_registry", "meta_foundation_compiled"].map(n => ({ path: `archive/data/meta-foundation/compiled/${n}.json` })) });
  put(`${CANON}/condition_registry.json`, { schemaVersion: "meta-foundation-condition-registry-v1", owner: "CONDITION_CORE", conditions: [], conditionCount: 0 });
  put("archive/data/master_tables/js_archive_tag_master.json", []);
  fs.mkdirSync(path.join(root, "archive/data/meta-foundation/runtime"), { recursive: true });
  const changes = [];
  const change = (p, collection, match, before, after) => changes.push({ path: p, ...(collection ? { collection, match } : {}), before, after, evidenceRefs });
  const base = `${CANON}/packs/new-course`;
  change(`${CANON}/registry_index.json`, "activePacks", { id: "NEW_COURSE" }, null, { id: "NEW_COURSE", version: "1.0.0", status: "ACTIVE" });
  change(`${base}/pack.json`, null, null, null, { schemaVersion: "meta-foundation-pack-v1", packId: "NEW_COURSE", packVersion: "1.0.0", canonicalStatus: "ACTIVE", curricula: [curriculum], standardCourses: [course] });
  change(`${base}/taxonomy.json`, null, null, null, { status: "ACTIVE", problemTypes: [{ problemTypeKey: "PT_NEW", canonicalLabelKo: "새 유형", definition: "검수된 유형 의미", ownerPack: "NEW_COURSE", status: "ACTIVE", sourceUnit: "UNIT_NEW", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }], templates: [{ templateKey: "TPL_NEW", canonicalLabelKo: "새 풀이 구조", definition: "검수된 풀이 구조", parentProblemTypeKey: "PT_NEW", status: "ACTIVE", sourceUnit: "UNIT_NEW", supportingQuestionUids: ["uid1"], supportingItemCount: 1 }] });
  change(`${base}/bindings.json`, null, null, null, { status: "ACTIVE", bindings: [{ curriculum, standardCourse: course, standardUnitKey: "UNIT_NEW", subUnitKey: "SUB_NEW", problemTypeKey: "PT_NEW", status: "ACTIVE" }] });
  change(`${base}/aliases.json`, null, null, null, { aliases: [] });
  change(`${CANON}/registry_index.json`, "activeConceptShards", { id: "NEW_CONCEPTS" }, null, { id: "NEW_CONCEPTS", version: "1.0.0", status: "ACTIVE" });
  change(`${CANON}/concepts/new-concepts.json`, null, null, null, { shardId: "NEW_CONCEPTS", shardVersion: "1.0.0", concepts: [{ conceptKey: "CC_NEW", canonicalLabelKo: "새 추가 개념", definition: "추가 개념 근거", supportingQuestionUids: ["uid1"], supportingItemCount: 1, status: "ACTIVE" }] });
  change(`${CANON}/condition_registry.json`, "conditions", { conditionKey: "COND_NEW" }, null, { conditionKey: "COND_NEW", canonicalLabelKo: "새 조건", definition: "조건 근거", status: "ACTIVE" });
  for (const row of [{ key: "UNIT_NEW", keyType: "standardUnitKey", labelKo: "새 단원", status: "active" }, { key: "SUB_NEW", keyType: "subUnitKey", parentKey: "UNIT_NEW", standardUnitKey: "UNIT_NEW", labelKo: "새 세부단원", status: "active" }]) change("archive/data/master_tables/js_archive_tag_master.json", "$", { key: row.key }, null, row);
  const after = { ...Object.fromEntries(Object.entries(q).filter(([k]) => !["id", "content", "choices", "answer", "solution", "image"].includes(k))), curriculum, curriculumKey: curriculum, courseKey: course, rpmSemanticStatus: "FINAL", rpmL3: "reviewed-rpm-l3", rpmL4: "reviewed-rpm-l4" };
  const request = { schemaVersion: "archive-reviewed-exam-meta-register-request-v2", requestId: "test-new-course", examUid: "exam1", sourceArchiveFile: source, expectedSourceBlobSha1: blob(text), expectedQuestionCount: 1,
    approval: { type: "FINAL_QA", metadataReviewed: true, approvedBy: "fixture-reviewer", evidenceRefs }, registryChanges: changes,
    items: [{ questionUid: "uid1", sourceOrdinal: 1, before: Object.fromEntries(Object.keys(after).map(k => [k, current[k] ?? null])), after, reason: "문항 사고와 승인 분류 일치", evidenceRefs }] };
  return { root, put, read, request, q, evidenceRefs, change };
}

// Synthetic originals are issued by the real registrar. Only the fixture's
// later visual witness is synthetic; production proof must come from an actual
// independent reviewer and an immutable published Git document.
export function originalRendererFixture(t, { sizeOnly = false } = {}) {
  const f=fixture(t),sourcePath='archive/exams/'+f.request.sourceArchiveFile;
  // Exercise the real producer validator, including the fully indexed ACTIVE
  // registry and an explicit middle-school unit namespace.
  f.request=JSON.parse(JSON.stringify(f.request).replaceAll('UNIT_NEW','M1-RENDERER-PRESERVATION-TEST'));
  f.q.standardUnitKey='M1-RENDERER-PRESERVATION-TEST';
  const initial=f.read(META);initial.records[0].standardUnitKey=f.q.standardUnitKey;f.put(META,initial);
  const index=f.read(`${CANON}/registry_index.json`);index.status='ACTIVE';
  index.canonicalSources.push({path:`${CANON}/metadata_rules.json`});f.put(`${CANON}/registry_index.json`,index);
  f.put(`${CANON}/metadata_rules.json`,{status:'ACTIVE',integrationPatterns:['NONE']});
  const conditions=f.read(`${CANON}/condition_registry.json`);conditions.status='ACTIVE';f.put(`${CANON}/condition_registry.json`,conditions);
  const git=(...args)=>execFileSync('git',args,{cwd:f.root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  const commit=message=>{git('add','.');git('commit','-qm',message);return git('rev-parse','HEAD');};
  git('init','-q');git('config','user.name','synthetic fixture');git('config','user.email','fixture@example.invalid');
  const complete={difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL'};
  Object.assign(f.q,complete,{image:'assets/old-1.svg'});
  Object.assign(f.request.items[0].after,complete);
  Object.assign(f.request.items[0].before,Object.fromEntries(Object.keys(complete).map(k=>[k,null])));
  const bank=[f.q,{...f.q,id:2,image:'assets/old-2.svg'}];
  for(const name of ['old-1','old-2'])f.put('archive/assets/'+name+'.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="20" fill="none" stroke="black"/></svg>\n');
  const writeBank=()=>{const bytes=`window.questions=${JSON.stringify(bank)};\n`;f.put(sourcePath,bytes);return bytes;};
  const rows=bank.map((q,i)=>({...f.read(META).records[0],questionUid:'uid'+(i+1),sourceOrdinal:i+1,sourceQuestionNo:i+1,
    sourceFingerprint:sourceFingerprint(q),contentFingerprint:contentFingerprint(q)}));
  f.put(META,{records:rows});f.put('archive/data/question_identity_map.json',{records:structuredClone(rows)});
  for(const change of f.request.registryChanges) {
    if(change.path.endsWith('/bindings.json'))Object.assign(change.after.bindings[0],{L1:'새 단원',L2:'새 세부단원'});
    if(change.path.endsWith('/taxonomy.json'))change.after.templates[0].ownerPack='NEW_COURSE';
  }
  const firstBytes=writeBank();f.request.requestId='renderer-original-full';f.request.expectedQuestionCount=2;f.request.expectedSourceBlobSha1=blob(firstBytes);
  f.request.items=rows.map(row=>({...structuredClone(f.request.items[0]),questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal}));
  registerReviewedExamV2({root:f.root,request:f.request,write:true});
  const firstPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+f.request.requestId+'.json',first=f.read(firstPath),firstRef={path:firstPath,sha256:hash(fs.readFileSync(path.join(f.root,firstPath)))};
  commit('synthetic original full FINAL_QA');
  bank[0].difficultyBucket=4;const reusedBytes=writeBank();
  const difficulty=['difficultyBucket','difficultyConfidence','difficultyBoundaryFlag','legacyLevelCompatibility'],d5=row=>Object.fromEntries(difficulty.map(k=>[k,row[k]]));
  const reusePath='docs/original-full-difficulty-reuse.json',reuseProof={schemaVersion:'m1s2-exact-finalqa-preservation-proof-v1',sourceArchiveFile:f.request.sourceArchiveFile,
    priorSourceBlob:first.sourceBlobSha1,currentSourceBlob:blob(reusedBytes),currentSourceSha256:hash(reusedBytes),priorReceipt:firstRef,priorApprovalCount:2,preservedApprovalCount:2,newSemanticJudgments:0,
    difficultyChangedCount:1,unchangedDifficultyCount:1,sourceAndAssetMutation:false,registryMutation:false,
    rows:first.appliedRecords.map((row,i)=>({ordinal:i+1,questionUid:row.questionUid,existingApprovalType:'FINAL_QA',priorSourceFingerprint:row.sourceFingerprint,currentSourceFingerprint:row.sourceFingerprint,
      sameStudentPayload:true,sameSemanticValues:true,difficultyChanged:i===0,beforeD5:d5(row),afterD5:{...d5(row),...(i===0?{difficultyBucket:4}:{})}}))};
  f.put(reusePath,reuseProof);const reuseRef={path:reusePath,sha256:hash(fs.readFileSync(path.join(f.root,reusePath)))};
  const reusedRequest={schemaVersion:f.request.schemaVersion,requestId:'renderer-original-full-difficulty',examUid:f.request.examUid,sourceArchiveFile:f.request.sourceArchiveFile,
    expectedQuestionCount:2,expectedSourceBlobSha1:blob(reusedBytes),registryChanges:[],approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-original-reviewer',
      evidenceRefs:[...f.evidenceRefs,firstRef,reuseRef],reuse:{mode:'EXACT_PRIOR_FINAL_QA_PLUS_REVIEWED_DIFFICULTY',priorRequestId:first.requestId,newSemanticJudgments:0,preservedPriorApprovals:2,proofRef:reuseRef}},
    items:first.appliedRecords.map((row,i)=>({questionUid:row.questionUid,sourceOrdinal:i+1,before:i===0?{difficultyBucket:3}:{},after:i===0?{difficultyBucket:4}:{},reason:'synthetic existing approval with explicit reviewed difficulty only',evidenceRefs:[reuseRef]}))};
  registerReviewedExamV2({root:f.root,request:reusedRequest,write:true});
  const priorPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+reusedRequest.requestId+'.json',prior=f.read(priorPath),priorRaw=fs.readFileSync(path.join(f.root,priorPath)),priorRef={path:priorPath,sha256:hash(priorRaw)};
  const priorBank=structuredClone(bank),priorCommit=commit('synthetic reviewed difficulty reuse');
  if(!sizeOnly) {
    bank[0].image='assets/current-1.svg';
    f.put('archive/assets/current-1.svg','<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="40" fill="none" stroke="black"/></svg>\n');
  }
  bank[0].imageSize='full';
  const currentBytes=writeBank(),currentCommit=commit('synthetic equivalent renderer');
  const sourceRef=(commit,bytes)=>({commit,path:sourcePath,gitBlobSha1:blob(bytes),sha256:hash(bytes)});
  const asset=(p,commit)=>({path:p,gitBlobSha1:git('rev-parse',commit+':'+p),sha256:hash(fs.readFileSync(path.join(f.root,p))),visuallyInspected:true});
  const reviewPath='docs/original-renderer-independent.json',review={schemaVersion:ORIGINAL_RENDERER_REVIEW_SCHEMA,scope:'NARROW_RENDERER_CONTINUITY_OF_EXISTING_FULL_FINAL_QA',
    reviewer:'synthetic-independent-visual-reviewer',decision:'PASS_NARROW_RENDERER_CONTINUITY',sourceArchiveFile:f.request.sourceArchiveFile,expectedQuestionCount:2,priorReceiptRef:priorRef,
    priorSourceRef:sourceRef(priorCommit,reusedBytes),currentSourceRef:sourceRef(currentCommit,currentBytes),newMetadataApprovals:0,newMathematicalQa:false,newReviewPassCount:0,newDifficultyJudgments:0,
    rows:[{questionUid:'uid1',sourceOrdinal:1,decision:'PRESERVE_EXISTING_APPROVAL_RENDERER_ONLY',visualInspectionPerformed:true,priorQuestionSha256:hash(stable(priorBank[0])),currentQuestionSha256:hash(stable(bank[0])),
      changedFields:sizeOnly?['imageSize']:['image','imageSize'],nonRendererFieldsUnchanged:true,noNewAnswerLeak:true,observed:'Synthetic fixture preserves one unfilled circle under uniform display rescaling.',
      priorAssets:[asset('archive/assets/old-1.svg',priorCommit)],currentAssets:[asset('archive/'+bank[0].image,currentCommit)]}]};
  f.put(reviewPath,review);const reviewRef={path:reviewPath,sha256:hash(fs.readFileSync(path.join(f.root,reviewPath)))},reviewCommit=commit('synthetic independent renderer evidence');
  const assetRef={path:'archive/'+bank[0].image,sha256:review.rows[0].currentAssets[0].sha256},requestId='preserve-original-renderer';
  const request={schemaVersion:f.request.schemaVersion,requestId,examUid:prior.examUid,sourceArchiveFile:prior.sourceArchiveFile,scope:'PARTIAL_UIDS',expectedQuestionCount:2,
    expectedSourceBlobSha1:blob(currentBytes),registryChanges:[],approval:{type:'FINAL_QA',metadataReviewed:true,approvedBy:'synthetic-transport-operator',evidenceRefs:[priorRef,reuseRef,reviewRef,assetRef],
      sourceRebind:{schemaVersion:ORIGINAL_RENDERER_SCHEMA,priorReceiptRef:priorRef,rendererEvidenceRef:reviewRef,reviewCommit}},
    items:[{questionUid:'uid1',sourceOrdinal:1,before:{},after:{},reason:'Preserve the existing original approval; synthetic renderer-only continuity.',evidenceRefs:[priorRef,reviewRef,assetRef,...prior.approval.evidenceRefs]}]};
  const receiptPath='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+requestId+'.json';
  const publishReview=()=>{f.put(reviewPath,review);reviewRef.sha256=hash(fs.readFileSync(path.join(f.root,reviewPath)));request.approval.sourceRebind.reviewCommit=commit('synthetic changed review');};
  return {...f,request,git,commit,sourcePath,bank,currentBytes,currentCommit,priorCommit,priorBank,prior,priorPath,priorRaw,priorRef,firstPath,firstRef,reuseRef,reuseProof,reusePath,review,reviewPath,reviewRef,assetRef,publishReview,
    receiptPath,bindingPath:originalRendererBindingPath(requestId),META,runtimePath:'archive/data/meta-foundation/runtime/new-course-v1.json',identityPath:'archive/data/question_identity_map.json',hash,stable};
}

