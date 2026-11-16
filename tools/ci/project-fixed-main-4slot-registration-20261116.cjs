'use strict';
// Read-only investigation of two already public fixed snapshots.
// Outputs hashes, UID/source/ordinal/status metadata only. No source question,
// answer, solution, slot vector, term payload, or validation result is emitted.
const { execFileSync } = require('node:child_process');
const crypto = require('node:crypto');
const INDEX = 'archive/data/item-4slot-index.json';
const LIVE_URL = 'https://icefoxtail.github.io/AP------/_archive-release.json';
const SNAPSHOTS = {
  "baseline": {
    "commit": "16f4b35d2ce11eaa1d2a299cb2d9ed74a4571e6f",
    "tree": "16e4723e2d3440ee0fd1d6a835d403691c73f29e",
    "gitBlobSha1": "4d04dd92231b1cedb3add50fb599a50eb824bcf6",
    "sha256": "bfd1d335058d00bb6baceab72d7b22c82abc1985d4effaf693754215f72f55a9",
    "bytes": 20400876,
    "counts": {
      "files": 954,
      "items": 21699,
      "registered": 18518,
      "pending": 3276,
      "withCandidates": 737,
      "identityFingerprintHistorical": 6487
    }
  },
  "current": {
    "commit": "6bc27c9b49c8eb795acf7cca1e0640f169334e3b",
    "tree": "176bc59c181982c2b0e1b44debd4c02b5eb55b3b",
    "gitBlobSha1": "8af67c9067ea855b3898e0cc196fc4efc01641ab",
    "sha256": "a74519a13b233a1d774c8e8b8699465590aff7a9ea8c21d63fb5c0ba55fda422",
    "bytes": 20402039,
    "counts": {
      "files": 954,
      "items": 21699,
      "registered": 18519,
      "pending": 3275,
      "withCandidates": 739,
      "identityFingerprintHistorical": 6487
    }
  }
};
const SCOPES = {
  "q5": [
    {
      "key": "M3-E052-Q5",
      "questionUid": "qid_v1_f0b8bed25f89afa2840da1e6980215f102c4e9a44ef272080a3c53a4a5226fe1",
      "sourceArchiveFile": "original/middle/m3/2final/21_풍덕중_2학기_기말_중3_기출.js",
      "sourceOrdinal": 5,
      "membership": "EXACT_MAIN_Q5_CLOSED_PROFILE"
    }
  ],
  "svg7": [
    {
      "key": "E037-Q3",
      "questionUid": "qid_v1_0d8f5786d2c658ae440bf814c83c4315e77c0730191a8bd95b038590d7383de6",
      "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 3,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E037-Q15",
      "questionUid": "qid_v1_c603060d464e3e703b01951f2c54483636632d20c77bf61478f727ea08d8ced5",
      "sourceArchiveFile": "original/middle/m2/1final/22_풍덕중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 15,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E045-Q15",
      "questionUid": "qid_v1_43e1fda6dcb1db1c657a86ab1e7669b0990593a621a6c7399d1281ef2055f569",
      "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 15,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E045-Q24",
      "questionUid": "qid_v1_cd19408eb02abc9397f6965a5ca108287df1438b377dd6e226da6fc09f0239fd",
      "sourceArchiveFile": "original/middle/m2/1final/21_팔마중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 24,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E048-Q11",
      "questionUid": "qid_v1_44b23ef95477c89c7dba6fab78c6fb336ef51d834584a6bbefc925bcbca450ec",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 11,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E048-Q13",
      "questionUid": "qid_v1_c46f4f225979a329fa4f253bbb57f8cd2406fd68c7d5d8c1f73b05305af4c637",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 13,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    },
    {
      "key": "E048-Q24",
      "questionUid": "qid_v1_70a5f39bf8c0af03c8e6eafde27e07239e9108c4d00c0863c10b00e8c632c1ad",
      "sourceArchiveFile": "original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 24,
      "membership": "EXACT_MAIN_SVG7_CLOSED_PROFILE"
    }
  ],
  "privateCandidates": [
    {
      "key": "PRIVATE-TEXT3-E044-Q21",
      "questionUid": "qid_v1_1554811ec6e62874443dc420e0fb4252a3f65e4279e3c1dd3c06bd30127c073a",
      "sourceArchiveFile": "original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 21,
      "membership": "NOT_RECHECKED_AGAINST_NATIVE55"
    },
    {
      "key": "PRIVATE-TEXT3-E044-Q24",
      "questionUid": "qid_v1_a34dd926bbebe44733ec9bc8421e99b688f5d9bea46e0d6ae0c5e89c80bc173e",
      "sourceArchiveFile": "original/middle/m2/1final/21_이수중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 24,
      "membership": "NOT_RECHECKED_AGAINST_NATIVE55"
    },
    {
      "key": "PRIVATE-TEXT3-E051-Q15",
      "questionUid": "qid_v1_afdacbb3734acfe658f8d1f2f820c0f23554c0d762412e449d0993e7e757c957",
      "sourceArchiveFile": "original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 15,
      "membership": "NOT_RECHECKED_AGAINST_NATIVE55"
    },
    {
      "key": "PRIVATE-E041-Q10",
      "questionUid": "qid_v1_eff16cb34d23543b88c1ec860d9c271078746a16c8dfd13ceb01a6cecbf7c108",
      "sourceArchiveFile": "original/middle/m2/1final/21_신흥중_1학기_기말_중2_수학.js",
      "sourceOrdinal": 10,
      "membership": "NOT_RECHECKED_AGAINST_NATIVE55"
    },
    {
      "key": "PRIVATE-E052-Q22",
      "questionUid": "qid_v1_5aa254d1f76b8ae6353704697bceec5b89fed757d97dbcbe3666cc4733a5eee0",
      "sourceArchiveFile": "original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js",
      "sourceOrdinal": 22,
      "membership": "NOT_RECHECKED_AGAINST_NATIVE55"
    },
    {
      "key": "E035-1FINAL-Q12-MEMBERSHIP-UNCONFIRMED",
      "questionUid": null,
      "sourceArchiveFile": "original/middle/m2/1final/22_연향중_1학기_기말_중2_기출.js",
      "sourceOrdinal": 12,
      "membership": "UNCONFIRMED_NATIVE55_MEMBERSHIP"
    }
  ]
};
const UID = /^qid_v1_[a-f0-9]{64}$/;
const SHA256 = /^[a-f0-9]{64}$/;
const own = (o,k) => Object.prototype.hasOwnProperty.call(o,k);
const stable = v => JSON.stringify(v,(_,x)=>x && typeof x==='object' && !Array.isArray(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])) : x);
const sha = v => crypto.createHash('sha256').update(v).digest('hex');
const rowHash = v => sha(stable(v));
const equal = (a,b) => stable(a)===stable(b);
function need(ok,code) { if(!ok) { const e=new Error(code); e.projectionCode=code; throw e; } }
function git(args,maxBuffer=4096) {
  return execFileSync('git',args,{cwd:process.cwd(),maxBuffer,timeout:60000,
    stdio:['ignore','pipe','pipe'],env:{...process.env,GIT_NO_LAZY_FETCH:'1',GIT_OPTIONAL_LOCKS:'0'}});
}
function compactPath(source) {
  need(typeof source==='string' && source.endsWith('.js'),'SOURCE_METADATA_SHAPE');
  return 'archive/data/item-4slot/'+source.slice(0,-3)+'.4slot.json';
}
function countIndex(d) {
  return {files:d.files.length,items:d.files.reduce((n,f)=>n+(f.itemCount||0),0),
    registered:d.records.length,pending:d.pending.length,
    withCandidates:d.records.filter(r=>Array.isArray(r.candidates)&&r.candidates.length>0).length,
    identityFingerprintHistorical:d.records.filter(r=>r.identityFingerprintStatus==='HISTORICAL').length};
}
function validateIndex(d,expectedCounts) {
  need(d && d.schemaVersion==='archive-item-4slot-runtime-v1' &&
    d.authority==='MAIN_MERGED_REVIEWED_COMPACT' && d.sourceMutation===0 &&
    d.semanticApprovalMutation===0,'INDEX_AUTHORITY');
  need(Array.isArray(d.files)&&Array.isArray(d.records)&&Array.isArray(d.pending),'INDEX_ARRAYS');
  need(equal(countIndex(d),d.counts)&&equal(d.counts,expectedCounts),'INDEX_COUNTS');
  const records=new Map(),tuples=new Set(),files=new Map(),pendingUids=new Set();
  for(const f of d.files) {need(typeof f.path==='string'&&!files.has(f.path),'DUPLICATE_FILE');files.set(f.path,f);}
  for(const r of d.records) {
    need(r && UID.test(r.questionUid||'') && typeof r.sourceArchiveFile==='string' &&
      Number.isSafeInteger(r.sourceOrdinal)&&r.sourceOrdinal>0 &&
      r.registrationStatus==='REGISTERED' && Array.isArray(r.candidates),'REGISTERED_ROW_SHAPE');
    need(!records.has(r.questionUid),'DUPLICATE_REGISTERED_UID');
    const tuple=r.sourceArchiveFile+'#'+r.sourceOrdinal;
    need(!tuples.has(tuple),'DUPLICATE_REGISTERED_SOURCE_ORDINAL');
    need(r.compactPath===compactPath(r.sourceArchiveFile)&&files.has(r.compactPath),'REGISTERED_FILE_JOIN');
    tuples.add(tuple);records.set(r.questionUid,r);
  }
  for(const p of d.pending) {
    need(p && typeof p.path==='string','PENDING_ROW_SHAPE');
    if(own(p,'questionUid')) {need(UID.test(p.questionUid||''),'PENDING_UID_SHAPE');pendingUids.add(p.questionUid);}
  }
  return {document:d,records,files,summary:{schemaVersion:d.schemaVersion,authority:d.authority,
    counts:d.counts,builderSha256:d.builderSha256,inputDigest:d.inputDigest,
    registeredUidCount:records.size,registeredSourceOrdinalCount:tuples.size,
    duplicateRegisteredUids:0,duplicateRegisteredSourceOrdinals:0,pendingDistinctKnownUids:pendingUids.size}};
}
function readSnapshot(pin) {
  need(git(['cat-file','-t',pin.commit]).toString().trim()==='commit','COMMIT_OBJECT');
  need(git(['rev-parse',pin.commit+'^{tree}']).toString().trim()===pin.tree,'COMMIT_TREE');
  need(git(['ls-tree','-z',pin.commit,'--',INDEX]).toString()===
    '100644 blob '+pin.gitBlobSha1+'\t'+INDEX+'\0','INDEX_TREE_PATH');
  need(Number(git(['cat-file','-s',pin.gitBlobSha1]).toString())===pin.bytes,'INDEX_OBJECT_SIZE');
  const raw=git(['cat-file','blob',pin.gitBlobSha1],pin.bytes+1024);
  const gitBlob=crypto.createHash('sha1').update('blob '+raw.length+'\0').update(raw).digest('hex');
  need(raw.length===pin.bytes && sha(raw)===pin.sha256 && gitBlob===pin.gitBlobSha1,'INDEX_RAW_BYTES');
  const text=raw.toString('utf8');need(Buffer.from(text,'utf8').equals(raw),'INDEX_UTF8');
  const parsed=validateIndex(JSON.parse(text),pin.counts);
  return {...parsed,pin:{commit:pin.commit,tree:pin.tree,path:INDEX,
    gitBlobSha1:pin.gitBlobSha1,sha256:pin.sha256,bytes:pin.bytes}};
}
function metadataRow(r) {
  if(!r)return null;
  const keys=['questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','registrationStatus',
    'compactPath','dictionaryVersion','sourceUidBinding','identityFingerprintStatus','sourceBinding','independentReviewClaim'];
  const v=Object.fromEntries(keys.filter(k=>own(r,k)).map(k=>[k,r[k]]));
  // Caller-visible values must remain scalar metadata even if a future producer
  // inserts an unexpected nested object under one of the named keys.
  need(Object.values(v).every(x=>x===null||['string','number','boolean'].includes(typeof x)),'ROW_METADATA_SCALAR');
  return {...v,wholeRowSha256:rowHash(r)};
}
function pendingMetadata(p) {
  const v={path:p.path,wholeRowSha256:rowHash(p)};
  for(const k of ['questionUid','sourceArchiveFile','sourceOrdinal','ordinal'])
    if(own(p,k)) {need(p[k]===null||['string','number'].includes(typeof p[k]),'PENDING_METADATA_SCALAR');v[k]=p[k];}
  if(typeof p.reason==='string' && /^[A-Z0-9_:.\/-]{1,300}$/.test(p.reason))v.reasonCode=p.reason;
  else if(own(p,'reason'))v.reasonSha256=rowHash(p.reason);
  return v;
}
function fileMetadata(f) {
  if(!f)return null;
  const keys=['path','status','sourceArchiveFile','itemCount','currentSourceBlobSha','compactSha256','sourceGitBlobSha'];
  const v=Object.fromEntries(keys.filter(k=>own(f,k)).map(k=>[k,f[k]]));
  need(Object.values(v).every(x=>x===null||['string','number','boolean'].includes(typeof x)),'FILE_METADATA_SCALAR');
  return {...v,wholeFileRowSha256:rowHash(f)};
}
function matchesPending(p,scope) {
  const exactUid=scope.questionUid && p.questionUid===scope.questionUid;
  const exactSource=p.sourceArchiveFile===scope.sourceArchiveFile || p.path===compactPath(scope.sourceArchiveFile);
  const ordinal=own(p,'sourceOrdinal')?p.sourceOrdinal:p.ordinal;
  if(exactUid)need(exactSource && (ordinal==null || ordinal===scope.sourceOrdinal),'SELECTED_PENDING_IDENTITY_MISMATCH');
  return Boolean(exactUid || (exactSource && (ordinal==null || ordinal===scope.sourceOrdinal)));
}
function selection(a,b,scope) {
  const pair=r=>r.sourceArchiveFile===scope.sourceArchiveFile&&r.sourceOrdinal===scope.sourceOrdinal;
  const before=[...a.records.values()].filter(r=>scope.questionUid?r.questionUid===scope.questionUid:pair(r));
  const after=[...b.records.values()].filter(r=>scope.questionUid?r.questionUid===scope.questionUid:pair(r));
  need(before.length<=1&&after.length<=1,'SELECTED_REGISTERED_NOT_UNIQUE');
  need(before.every(pair)&&after.every(pair),'SELECTED_IDENTITY_MISMATCH');
  const bp=a.document.pending.filter(p=>matchesPending(p,scope));
  const ap=b.document.pending.filter(p=>matchesPending(p,scope));
  const identityPending=[...bp,...ap].filter(p=>(own(p,'sourceOrdinal')?p.sourceOrdinal:p.ordinal)===scope.sourceOrdinal);
  const ids=[...new Set([...before,...after,...identityPending].map(x=>x.questionUid).filter(Boolean))].sort();
  if(scope.questionUid)need(ids.every(x=>x===scope.questionUid),'SELECTED_PENDING_UID_CONFLICT');
  const resolved=scope.questionUid || (ids.length===1?ids[0]:null);
  const old=before[0]||null,next=after[0]||null;
  return {key:scope.key,membership:scope.membership,requestedQuestionUid:scope.questionUid,
    resolvedQuestionUid:resolved,uidResolution:scope.questionUid?'EXACT_REQUESTED_UID':ids.length===1?'UNIQUE_INDEX_UID':ids.length===0?'UNRESOLVED_IN_INDEX':'CONFLICTING_INDEX_UIDS',
    sourceArchiveFile:scope.sourceArchiveFile,sourceOrdinal:scope.sourceOrdinal,
    before:{record:metadataRow(old),pending:bp.map(pendingMetadata),file:fileMetadata(a.files.get(compactPath(scope.sourceArchiveFile)))},
    after:{record:metadataRow(next),pending:ap.map(pendingMetadata),file:fileMetadata(b.files.get(compactPath(scope.sourceArchiveFile)))},
    registeredBefore:Boolean(old),registeredAfter:Boolean(next),
    newlyRegistered:Boolean(next&&!old),registrationRemoved:Boolean(old&&!next),
    wholeRegisteredRowChanged:Boolean(old&&next&&!equal(old,next)),
    native55MembershipEstablished:false,newNativeApproval:false};
}
function wholeIndexDiff(a,b) {
  const added=[],removed=[],changed=[];
  for(const [uid,next]of b.records) {
    const old=a.records.get(uid);
    if(!old)added.push(metadataRow(next));
    else if(!equal(old,next))changed.push({questionUid:uid,sourceArchiveFile:next.sourceArchiveFile,
      sourceOrdinal:next.sourceOrdinal,beforeWholeRowSha256:rowHash(old),afterWholeRowSha256:rowHash(next),
      changedFieldNames:[...new Set([...Object.keys(old),...Object.keys(next)])].filter(k=>!equal(old[k],next[k])).sort()});
  }
  for(const[uid,old]of a.records)if(!b.records.has(uid))removed.push(metadataRow(old));
  const sort=(x,y)=>x.questionUid.localeCompare(y.questionUid);
  added.sort(sort);removed.sort(sort);changed.sort(sort);
  const beforePending=new Map(),afterPending=new Map();
  for(const p of a.document.pending){const h=rowHash(p),v=beforePending.get(h)||{count:0,row:p};v.count++;beforePending.set(h,v);}
  for(const p of b.document.pending){const h=rowHash(p),v=afterPending.get(h)||{count:0,row:p};v.count++;afterPending.set(h,v);}
  const pendingAdded=[],pendingRemoved=[];
  for(const [h,v]of afterPending){const delta=v.count-(beforePending.get(h)?.count||0);if(delta>0)pendingAdded.push({count:delta,...pendingMetadata(v.row)});}
  for(const [h,v]of beforePending){const delta=v.count-(afterPending.get(h)?.count||0);if(delta>0)pendingRemoved.push({count:delta,...pendingMetadata(v.row)});}
  need(added.length-removed.length===b.records.size-a.records.size,'REGISTERED_DELTA_BALANCE');
  return {registeredCountBefore:a.records.size,registeredCountAfter:b.records.size,
    addedRegisteredCount:added.length,removedRegisteredCount:removed.length,changedRegisteredCount:changed.length,
    addedRegistered:added,removedRegistered:removed,changedRegistered:changed,
    pendingCountBefore:a.document.pending.length,pendingCountAfter:b.document.pending.length,
    pendingAdded,pendingRemoved};
}
function releaseProjection(raw,httpStatus) {
  const out={url:LIVE_URL,httpStatus,rawSha256:sha(raw),bytes:raw.length,status:'LIVE_UNVERIFIED'};
  if(httpStatus!==200)return out;
  let d;try{d=JSON.parse(raw.toString('utf8'));}catch{return {...out,failureCode:'INVALID_JSON'};}
  const digests=['packageDigest','externalDependencyDigest','validatorDigest','archiveValidationDigest'];
  if(!d || d.schemaVersion!=='ARCHIVE_PAGES_RELEASE_V1' ||
    !/^[a-f0-9]{40}$/.test(d.registeredMainSHA||'') || !digests.every(k=>SHA256.test(d[k]||'')) ||
    !Number.isSafeInteger(d.fileCount)||d.fileCount<=0 ||
    !Number.isSafeInteger(d.totalBytes)||d.totalBytes<0||d.totalBytes>=1000000000 ||
    d.releaseGate!=='RELEASE_GATE_PASS')return {...out,failureCode:'RELEASE_RECEIPT_FIELDS'};
  return {...out,status:d.registeredMainSHA===SNAPSHOTS.current.commit?'LIVE_RECEIPT_VERIFIED_EXACT_COMMIT':'LIVE_COMMIT_MISMATCH',
    registeredMainSHA:d.registeredMainSHA,packageDigest:d.packageDigest,
    fileCount:d.fileCount,totalBytes:d.totalBytes,releaseGate:d.releaseGate};
}
async function checkLive() {
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
  try{
    const response=await fetch(LIVE_URL,{method:'GET',redirect:'manual',cache:'no-store',signal:controller.signal});
    const chunks=[];let size=0;
    for await(const chunk of response.body||[]){size+=chunk.length;if(size>65536){controller.abort();return {url:LIVE_URL,httpStatus:response.status,status:'LIVE_UNVERIFIED',failureCode:'RESPONSE_TOO_LARGE'};}chunks.push(Buffer.from(chunk));}
    return releaseProjection(Buffer.concat(chunks),response.status);
  }catch{return {url:LIVE_URL,status:'LIVE_UNVERIFIED',failureCode:'HTTP_REQUEST_UNAVAILABLE'};}
  finally{clearTimeout(timer);}
}
async function main() {
  need(process.argv.length===2,'NO_ARGUMENTS_ALLOWED');
  const baseline=readSnapshot(SNAPSHOTS.baseline),current=readSnapshot(SNAPSHOTS.current);
  const whole=wholeIndexDiff(baseline,current);
  const selected=Object.fromEntries(Object.entries(SCOPES).map(([group,rows])=>[group,rows.map(row=>selection(baseline,current,row))]));
  const report={schemaVersion:'archive-fixed-main-4slot-index-projection-v1',
    status:'VERIFIED_FIXED_INDEX_BYTES_METADATA_ONLY',observedAtUtc:new Date().toISOString(),
    snapshots:{baseline:{ref:baseline.pin,...baseline.summary},current:{ref:current.pin,...current.summary}},
    wholeIndexComparison:whole,selectedScopes:selected,
    liveReleaseCheck:await checkLive(),
    limits:{rawQuestionOutput:0,answerOutput:0,solutionOutput:0,slotVectorOutput:0,sourceWrites:0,repositoryWrites:0,
      newNativeApprovals:0,newSemanticApprovals:0,blindReviewClaims:0,fullReleasePass:false,
      native55Membership:'NOT_ESTABLISHED_BY_THIS_INDEX_ONLY_INVESTIGATION'}};
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
}
module.exports={validateIndex,countIndex,metadataRow,pendingMetadata,selection,wholeIndexDiff,releaseProjection,SNAPSHOTS,SCOPES};
if(require.main===module)main().catch(error=>{
  process.stderr.write(JSON.stringify({schemaVersion:'archive-fixed-main-4slot-index-projection-failure-v1',
    status:'FAILED_NO_REGISTRATION_CLAIM',code:error.projectionCode||'FIXED_SNAPSHOT_READ_FAILED'})+'\n');
  process.exitCode=1;
});
