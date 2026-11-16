'use strict';
// A literal repaired compact may survive two already-issued metadata-only
// additions. It replays the complete original repair and negative history first.
// This contract never approves metadata, repairs a renderer or changes a vector.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {sourceNumber, sourceIdentityNumber} = require('./exam-items.cjs');
const GROUP = 'currentM2RepairMetadataContinuity';
const PRIOR_GROUP = 'currentM2RepairClosure';
const SCHEMA = 'm2-s2-repaired-issued-metadata-continuity-v1';
const SCOPE = 'PRESERVE_LITERAL_REPAIRED_VECTOR_ACROSS_TWO_ISSUED_METADATA_ADDITIONS_ONLY';
const ZERO = ['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites','nativeMetadataWrites'];
const ADDED = ['courseKey','reviewStatus','tagConfidence','tagStatus'];
const SOURCE = /^archive\/exams\/original\/middle\/m2\/2mid\/[^/]+\.js$/;
const COMPACT = /^archive\/data\/item-4slot\/original\/middle\/m2\/2mid\/[^/]+\.4slot\.json$/;
const CARRIER = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-repaired-issued-metadata-continuity\.json$/;
const DOC = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const REQUEST = /^\.archive-meta-register\/inbox\/[A-Za-z0-9_.-]+\.json$/;
const COPY = /^\.archive-meta-register\/evidence\/[A-Za-z0-9_가-힣./-]+\.json$/;
const RECEIPT = /^archive\/data\/meta-foundation\/evidence\/reviewed-exam-meta\/v1\/[A-Za-z0-9_.-]+\.json$/;
const NATIVE = /^archive\/data\/meta-review\/m2-s2-20261114\/exams\/E\d{3}\/review\.json$/;
const ASSET = /^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const REF = ['commit','path','sha256'], FULL = ['commit','path','gitBlobSha1','sha256'];
const GIT = /^[a-f0-9]{40}$/, SHA = /^[a-f0-9]{64}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const own = (o,k) => Object.hasOwn(o||{},k);
const has = d => own(d?.evidence,GROUP);
const inScope = d => /^original\/middle\/m2\/2mid\//.test(d?.sourceArchiveFile||'');
const git = (root,args) => execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});

// Only discovery of immutable obligations is pass-local. Current source,
// evidence, receipt and assets are read again by validateFile on every build.
function createObligationReader(root,{safe,sha,blob,stable}) {
  let loaded=false,failed=false,claims=[];
  function load() {
    if(loaded)return;loaded=true;
    try {
      const head=git(root,['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))throw Error('HEAD');
      const history=git(root,['log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/m2-repaired-issued-metadata-continuity.json']).toString().trim().split(/\s+/).filter(Boolean),seen=new Set();
      for(const commit of new Set([head,...history])) {
        const paths=git(root,['ls-tree','-r','-z','--name-only',commit,'--','docs/operations']).toString().split('\0').filter(p=>CARRIER.test(p));
        for(const path of paths) {
          safe(root,path);const raw=git(root,['show',commit+':'+path]),digest=sha(raw),key=path+'#'+digest;if(seen.has(key))continue;seen.add(key);
          const p=JSON.parse(raw);if(p.schemaVersion!==SCHEMA)continue;
          if(p.scope!==SCOPE||ZERO.some(k=>p[k]!==0)||!SOURCE.test(p.sourceRef?.path||'')||p.sourceRef.path!=='archive/exams/'+p.sourceArchiveFile||!GIT.test(p.sourceRef.commit||'')||!SHA.test(p.fullItemsSha256||'')||!Array.isArray(p.rows)||!p.rows.length)throw Error('CLAIM');
          const source=git(root,['show',p.sourceRef.commit+':'+p.sourceRef.path]);if(sha(source)!==p.sourceRef.sha256||blob(source)!==p.sourceRef.gitBlobSha1)throw Error('SOURCE');
          claims.push({sourceArchiveFile:p.sourceArchiveFile,path,sha256:digest,fullItemsSha256:p.fullItemsSha256});
        }
      }
    } catch {failed=true;}
  }
  return d => {
    if(!inScope(d))return {errors:[],digest:null};load();
    if(failed)return {errors:['M2_REPAIRED_METADATA_HISTORY_UNAVAILABLE'],digest:null};
    const found=claims.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile);if(!found.length)return {errors:[],digest:null};
    const ref=d.evidence?.[GROUP]?.carrier;
    const covered=found.length===1&&has(d)&&ref?.path===found[0].path&&ref?.sha256===found[0].sha256&&sha(stable(d.items))===found[0].fullItemsSha256;
    return {required:true,errors:covered?[]:['M2_REPAIRED_METADATA_OBLIGATION_REQUIRED'],digest:sha(stable(found)),entries:found};
  };
}

function evidenceDigests(root,d,{safe,sha}) {
  const out={},group=d.evidence?.[GROUP];if(!group)return out;
  const refs=Object.values(group);
  try {const p=JSON.parse(fs.readFileSync(safe(root,group.carrier.path)));refs.push(...(p.historicalEvidenceRefs||[]));}catch{}
  for(const ref of refs)if(ref?.path){try{out[ref.path]=sha(fs.readFileSync(safe(root,ref.path)));}catch{out[ref.path]=null;}}
  return out;
}

function validateCore(root,d,hp,replayHistorical,historicalCommit=null,historicalReads=null) {
  if(!has(d))return [];
  const {safe,sha,blob,stable,payloadHash,identityHash,assetRefs,loadBank,identity}=hp;
  const fail=s=>{throw Error('M2_REPAIRED_METADATA_'+s);},same=(a,b)=>stable(a)===stable(b);
  const keys=(o,ks)=>{if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),[...ks].sort()))fail('FIELDS');};
  const fields=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const plain=r=>Object.fromEntries(REF.map(k=>[k,r?.[k]]));
  function ancestor(a,b=historicalCommit||'HEAD'){try{git(root,['merge-base','--is-ancestor',a,b]);}catch{fail('UNMERGED_REFERENCE');}}
  function historicalRaw(commit,path) {
    safe(root,path);
    const entry=git(root,['ls-tree','-z','--full-tree',commit,'--',path]).toString();
    const m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    if(!m||m[2]!==path)fail('HISTORICAL_REGULAR_FILE');
    const raw=git(root,['show',commit+':'+path]);if(blob(raw)!==m[1])fail('HISTORICAL_BLOB');return raw;
  }
  function read(r,pattern,{full=false,live=false,merged=false,head=false}={}) {
    keys(r,full?FULL:REF);if(!GIT.test(r.commit||'')||!SHA.test(r.sha256||'')||full&&!GIT.test(r.gitBlobSha1||'')||!pattern.test(r.path||''))fail('REFERENCE');safe(root,r.path);
    if(merged)ancestor(r.commit);
    // Only the closed historical wrapper supplies this snapshot. The ordinary
    // path below is unchanged; callers cannot provide a reader or bypass flag.
    if(historicalCommit) {
      const raw=historicalRaw(r.commit,r.path);
      if(sha(raw)!==r.sha256||full&&blob(raw)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES');
      if(head||live) {
        const snapshot=historicalRaw(historicalCommit,r.path);
        if(!snapshot.equals(raw))fail('HISTORICAL_SNAPSHOT_BYTES');
        if(DOC.test(r.path)||COPY.test(r.path)||RECEIPT.test(r.path)) {
          const ref={commit:historicalCommit,path:r.path,gitBlobSha1:blob(raw),sha256:sha(raw)};
          const prior=historicalReads.get(r.path);
          if(prior&&prior.sha256!==ref.sha256)fail('HISTORICAL_EVIDENCE_CONFLICT');
          historicalReads.set(r.path,ref);
        }
      }
      return raw;
    }
    let raw;try{const entry=git(root,['ls-tree','-z','--full-tree',r.commit,'--',r.path]).toString(),m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);if(!m||m[2]!==r.path)fail('IMMUTABLE_REGULAR_FILE');raw=git(root,['show',r.commit+':'+r.path]);if(blob(raw)!==m[1])fail('IMMUTABLE_BLOB');}catch(e){if(String(e.message).startsWith('M2_REPAIRED_METADATA_'))throw e;fail('IMMUTABLE_UNAVAILABLE');}
    if(sha(raw)!==r.sha256||full&&blob(raw)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES');
    if(head){const entry=git(root,['ls-tree','-z','--full-tree','HEAD','--',r.path]).toString(),m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);if(!m||m[2]!==r.path)fail('CURRENT_HEAD_REGULAR_FILE');if(m[1]!==blob(raw)||!raw.equals(git(root,['show','HEAD:'+r.path])))fail('CURRENT_HEAD_BYTES');}
    if(live){let now;try{const file=safe(root,r.path),st=fs.lstatSync(file);if(!st.isFile()||st.isSymbolicLink())fail('LIVE_REGULAR_FILE');now=fs.readFileSync(file);}catch(e){if(String(e.message).startsWith('M2_REPAIRED_METADATA_'))throw e;fail('LIVE_UNAVAILABLE');}if(!raw.equals(now))fail('LIVE_BYTES');}
    return raw;
  }
  const doc=(r,p,o)=>JSON.parse(read(r,p,o));
  const pick=(xs,p,s)=>{if(!Array.isArray(xs))fail(s);const found=xs.filter(p);if(found.length!==1)fail(s);return found[0];};
  try {
    const group=d.evidence[GROUP];keys(group,['carrier','issuedRequestCopy','issuedReceipt','nativeReviewCopy']);
    const p=doc(group.carrier,CARRIER,{live:true,merged:true,head:true});
    keys(p,['schemaVersion','scope','transportAuthor','examId','sourceArchiveFile','expectedQuestionCount','priorValidatedCompactRef','priorRepairCarrierRef','sourceRef','historicalEvidenceRefs','issuedRequestOriginalRef','issuedRequestCopyRef','issuedReceiptRef','nativeReviewCopyRef','rows','currentAssets','fullItemsSha256',...ZERO]);
    if(p.schemaVersion!==SCHEMA||p.scope!==SCOPE||!p.transportAuthor||!/^E\d{3}$/.test(p.examId||'')||p.sourceArchiveFile!==d.sourceArchiveFile||ZERO.some(k=>p[k]!==0)||own(d,'scope'))fail('SCOPE');
    for(const [a,b]of [['issuedRequestCopy','issuedRequestCopyRef'],['issuedReceipt','issuedReceiptRef'],['nativeReviewCopy','nativeReviewCopyRef']])if(!same(group[a],p[b]))fail('EVIDENCE_LINK');
    const sp='archive/exams/'+d.sourceArchiveFile,cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
    if(p.sourceRef?.path!==sp||p.priorValidatedCompactRef?.path!==cp)fail('SOURCE_PATH');
    read(p.priorValidatedCompactRef,COMPACT,{full:true,merged:true});
    const replay=replayHistorical(root,p.priorValidatedCompactRef,hp);if(replay.errors.length)fail('HISTORICAL_CHAIN:'+replay.errors.join('|'));
    if(historicalReads)for(const r of replay.requiredLiveEvidence||[])historicalReads.set(r.path,r);
    const prior=replay.document;
    if(has(prior)||own(prior.evidence,'currentM2DisplayRepairClosure')||!prior.evidence?.[PRIOR_GROUP]||prior.sourceArchiveFile!==d.sourceArchiveFile||!same(prior.evidence[PRIOR_GROUP].carrier,p.priorRepairCarrierRef))fail('PRIOR_LITERAL_REPAIR');
    const old=doc(p.priorRepairCarrierRef,/^docs\/operations\/.+\/m2-current-four-slot-repair-closure\.json$/,{live:true});
    const original=doc(prior.evidence?.currentM2Continuity?.carrier,/^docs\/operations\/.+\/m2-current-four-slot-transport\.json$/,{live:true});
    if(original.examId!==p.examId||original.sourceArchiveFile!==d.sourceArchiveFile||old.selected?.questionUid==null)fail('ORIGINAL_REPAIR_CHAIN');
    if(old.examId!==p.examId||old.sourceArchiveFile!==d.sourceArchiveFile||old.sourceRef?.path!==sp||prior.sourceGitBlobSha!==old.sourceRef.gitBlobSha1)fail('PRIOR_BINDING');
    if(!Array.isArray(p.historicalEvidenceRefs)||!same(p.historicalEvidenceRefs.map(r=>FULL.map(k=>r[k])),(replay.requiredLiveEvidence||[]).map(r=>FULL.map(k=>r[k]))))fail('HISTORICAL_EVIDENCE_COVERAGE');
    for(const ref of p.historicalEvidenceRefs)read(ref,DOC,{full:true,live:true});
    const obligation=hp.m2ContinuityObligation;
    if(!obligation?.required||obligation.errors.length||obligation.metadataEntries?.length!==1||obligation.metadataEntries[0].path!==group.carrier.path||obligation.metadataEntries[0].sha256!==group.carrier.sha256)fail('HISTORY_REQUIRED');
    const beforeRaw=read(old.sourceRef,SOURCE,{full:true}),currentRaw=read(p.sourceRef,SOURCE,{full:true,live:true,merged:true,head:true});
    const before=loadBank(beforeRaw),bank=loadBank(currentRaw),n=p.expectedQuestionCount;
    if(!Number.isSafeInteger(n)||n<1||n>100||[before,bank,prior.items,d.items,p.rows].some(x=>!Array.isArray(x)||x.length!==n)||!SHA.test(p.fullItemsSha256||'')||sha(stable(prior.items))!==p.fullItemsSha256)fail('FULL_DENOMINATOR');
    const requestRaw=read(p.issuedRequestOriginalRef,REQUEST,{full:true,merged:true}),requestCopy=read(p.issuedRequestCopyRef,DOC,{full:true,live:true,merged:true,head:true});if(!requestCopy.equals(requestRaw))fail('REQUEST_COPY');
    const req=JSON.parse(requestRaw),receipt=doc(p.issuedReceiptRef,RECEIPT,{full:true,live:true,merged:true,head:true});
    ancestor(p.issuedRequestOriginalRef.commit,p.issuedReceiptRef.commit);
    if(req.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||req.scope!=='PARTIAL_UIDS'||req.sourceArchiveFile!==d.sourceArchiveFile||req.expectedSourceBlobSha1!==p.sourceRef.gitBlobSha1||req.expectedQuestionCount!==n||req.approval?.type!=='FINAL_QA'||req.approval.metadataReviewed!==true||!Array.isArray(req.registryChanges)||req.registryChanges.length||!Array.isArray(req.items)||req.items.length!==2||p.issuedRequestOriginalRef.path!=='.archive-meta-register/inbox/'+req.requestId+'.json')fail('ISSUED_REQUEST');
    if(receipt.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||receipt.metadataRegistrationStatus!=='REGISTERED'||receipt.scope!=='PARTIAL_UIDS'||own(receipt,'registrationMode')||receipt.requestId!==req.requestId||receipt.requestSha256!==sha(stable(req))||receipt.examUid!==req.examUid||!same(receipt.approval,req.approval)||receipt.sourceArchiveFile!==d.sourceArchiveFile||receipt.sourceBlobSha1!==p.sourceRef.gitBlobSha1||receipt.sourceRawSha256!==p.sourceRef.sha256||receipt.expectedQuestionCount!==n||receipt.totalQuestions!==req.items.length||receipt.partialUidCount!==req.items.length||!same(receipt.registryChanges,[])||p.issuedReceiptRef.path!=='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/'+req.requestId+'.json')fail('ISSUED_RECEIPT');
    if(!git(root,['show',p.issuedReceiptRef.commit+':'+sp]).equals(currentRaw))fail('ISSUED_SOURCE_BYTES');
    const nativeRaw=read(original.nativeReviewRef,NATIVE),native=JSON.parse(nativeRaw),copy=read(p.nativeReviewCopyRef,COPY,{full:true,live:true,merged:true,head:true});
    if(!copy.equals(nativeRaw)||native.schemaVersion!=='m2-s2-meta-review-v1'||native.examId!==p.examId||native.sourceArchiveFile!==d.sourceArchiveFile||native.items?.length!==n||native.sourceGitBlobSha!==original.nativeSourceRef.gitBlobSha1)fail('ORIGINAL_NATIVE_REVIEW');
    const reviewRef={path:p.nativeReviewCopyRef.path,sha256:p.nativeReviewCopyRef.sha256};
    if(!(req.approval.evidenceRefs||[]).some(r=>same(r,reviewRef)))fail('REQUEST_NATIVE_EVIDENCE');
    const authorityRows=['appliedRecords','appliedIdentityRecords','runtimeRecords','fingerprintRepairs'];
    for(const key of authorityRows)if(!Array.isArray(receipt[key])||receipt[key].length!==req.items.length||new Set(receipt[key].map(r=>r.questionUid)).size!==req.items.length)fail('ISSUED_PARTITION');
    const expectedRows=[],selected=[];
    for(let i=0;i<n;i++) {
      const a=before[i],q=bank[i],ord=i+1,number=sourceNumber(q),qno=sourceIdentityNumber(q);
      const id=pick(identity.records,r=>r.sourceArchiveFile===d.sourceArchiveFile&&r.sourceOrdinal===ord,'IDENTITY');
      const item=pick(prior.items,r=>r.ordinal===number,'COMPACT_NUMBER');
      const nativeItem=pick(native.items,r=>r.sourceOrdinal===ord&&r.questionUid===id.questionUid,'NATIVE_IDENTITY');
      if(!UID.test(id.questionUid||'')||id.sourceQuestionNo!==qno||id.status!=null&&id.status!=='VERIFIED'||sourceNumber(a)!==number||sourceIdentityNumber(a)!==qno||a.questionUid!==q.questionUid)fail('SOURCE_IDENTITY');
      const changed=fields(a,q);
      if(changed.length) {
        if(!same(changed,ADDED)||ADDED.some(k=>own(a,k)||!own(q,k))||own(item,'registrationHold')||id.questionUid===old.selected.questionUid)fail('NON_ADDITIVE_METADATA_CHANGE');
        const ri=pick(req.items,r=>r.questionUid===id.questionUid&&r.sourceOrdinal===ord,'REQUEST_PARTITION');
        const rows=Object.fromEntries(authorityRows.map(k=>[k,pick(receipt[k],r=>r.questionUid===id.questionUid&&r.sourceOrdinal===ord,'ISSUED_PARTITION')]));
        const issued=rows.appliedRecords,run=rows.runtimeRecords,fr=rows.fingerprintRepairs,identityRow=rows.appliedIdentityRecords;
        if(q.courseKey!=='M2-2'||q.reviewStatus!=='reviewed_pass'||q.tagStatus!=='reviewed_pass'||q.tagConfidence!=='approved_final_qa'||ADDED.some(k=>!same(q[k],issued[k])||!same(q[k],run[k]))||ri.after?.courseKey!==q.courseKey)fail('ISSUED_METADATA_VALUES');
        for(const row of [issued,run,identityRow])if(row.sourceArchiveFile!==d.sourceArchiveFile||row.sourceQuestionNo!==qno||row.sourceFingerprint!==identityHash(q))fail('ISSUED_IDENTITY');
        if(!ri.after||Object.keys(ri.after).some(k=>!same(ri.after[k],issued[k])||!same(ri.after[k],run[k]))||!nativeItem.after||Object.keys(nativeItem.after).some(k=>!same(nativeItem.after[k],ri.after[k])))fail('ISSUED_NATIVE_VALUES');
        keys(ri.sourceReview,['schemaVersion','reviewCommit','reviewPath','reviewRef']);
        if(ri.sourceReview.schemaVersion!=='archive-reviewed-source-reassessment-v1'||ri.sourceReview.reviewCommit!==original.nativeReviewRef.commit||ri.sourceReview.reviewPath!==original.nativeReviewRef.path||!same(ri.sourceReview.reviewRef,reviewRef)||!(ri.evidenceRefs||[]).some(r=>same(r,reviewRef)))fail('REQUEST_NATIVE_LINK');
        const sr=fr.sourceReview;
        if(sr?.schemaVersion!=='archive-reviewed-source-reassessment-v1'||sr.nativeSchemaVersion!==native.schemaVersion||sr.reviewCommit!==original.nativeReviewRef.commit||sr.reviewPath!==original.nativeReviewRef.path||!same(sr.reviewRef,reviewRef)||sr.questionUid!==id.questionUid||sr.sourceOrdinal!==ord||sr.reviewedSourceBlobSha1!==original.nativeSourceRef.gitBlobSha1||sr.reviewedSourceSha256!==original.nativeSourceRef.sha256||sr.scope!=='METADATA_SOURCE_BINDING_ONLY'||sr.newMathematicalQa!==false||fr.after?.sourceFingerprint!==identityHash(q))fail('ISSUED_NATIVE_LINK');
        selected.push({questionUid:id.questionUid,sourceOrdinal:ord});
      } else if(!same(a,q))fail('UNCHANGED_QUESTION');
      if(payloadHash(a)!==payloadHash(q)||!same(assetRefs(a),assetRefs(q)))fail('STUDENT_OR_ASSET_CHANGE');
      expectedRows.push({questionUid:id.questionUid,sourceOrdinal:ord,sourceQuestionNo:qno,ordinal:number,priorWholeQuestionSha256:sha(stable(a)),currentWholeQuestionSha256:sha(stable(q)),studentPayloadSha256:payloadHash(q),addedFields:changed});
    }
    if(selected.length!==2||!same(selected,req.items.map(r=>({questionUid:r.questionUid,sourceOrdinal:r.sourceOrdinal})))||!same(expectedRows,p.rows))fail('EXACT_PARTITION');
    const assetPaths=[...new Set(bank.flatMap(assetRefs))].sort();
    if(!Array.isArray(p.currentAssets)||!same(p.currentAssets.map(r=>r.path),assetPaths))fail('ASSET_COVERAGE');
    for(const ref of p.currentAssets){if(ref.commit!==p.sourceRef.commit)fail('ASSET_SNAPSHOT');const raw=read(ref,ASSET,{full:true,live:true,head:true});if(!raw.equals(git(root,['show',old.sourceRef.commit+':'+ref.path])))fail('CHANGED_ASSET_BYTES');}
    const expected=structuredClone(prior);expected.evidence[GROUP]=group;
    if(!same(expected,d)||sha(stable(d.items))!==p.fullItemsSha256)fail('EXACT_PRESERVED_COMPACT');
    return [];
  } catch(e) {return [String(e.message).startsWith('M2_REPAIRED_METADATA_')?e.message:'M2_REPAIRED_METADATA_EVIDENCE_UNAVAILABLE'];}
}
// An immutable result is historical evidence only. The IMAGE8 successor must
// independently require its complete live authority set before accepting it.
function validateFile(root,d,hp,replayHistorical) {
  return validateCore(root,d,hp,replayHistorical);
}
function validateHistoricalFile(root,reference,hp,replayHistorical) {
  try {
    const {safe,sha,blob,stable}=hp;
    if(!reference||stable(Object.keys(reference).sort())!==stable([...FULL].sort())||!GIT.test(reference.commit||'')||!GIT.test(reference.gitBlobSha1||'')||!SHA.test(reference.sha256||'')||!COMPACT.test(reference.path||''))throw Error('REFERENCE');
    safe(root,reference.path);git(root,['merge-base','--is-ancestor',reference.commit,'HEAD']);
    const entry=git(root,['ls-tree','-z','--full-tree',reference.commit,'--',reference.path]).toString(),m=/^100644 blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(entry);
    if(!m||m[2]!==reference.path||m[1]!==reference.gitBlobSha1)throw Error('MODE');
    const raw=git(root,['show',reference.commit+':'+reference.path]);
    if(sha(raw)!==reference.sha256||blob(raw)!==reference.gitBlobSha1)throw Error('BYTES');
    const document=JSON.parse(raw);
    if(!has(document)||own(document.evidence,'currentM2Image8Continuity'))throw Error('LITERAL_METADATA_SUCCESSOR_REQUIRED');
    const reads=new Map(),errors=validateCore(root,document,hp,replayHistorical,reference.commit,reads);
    return {errors,document,requiredLiveEvidence:[...reads.values()].sort((a,b)=>a.path.localeCompare(b.path,'en'))};
  }catch{return {errors:['M2_REPAIRED_METADATA_HISTORICAL_INPUT_INVALID'],document:null,requiredLiveEvidence:[]};}
}
module.exports={GROUP,SCHEMA,SCOPE,ZERO,ADDED,CARRIER,has,createObligationReader,evidenceDigests,validateFile,validateHistoricalFile};
