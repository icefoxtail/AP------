// An issued RPM_PATH_PROVENANCE_ONLY binding may outlive append-only growth of
// its shared crosswalk. Authenticate its original bytes and unchanged rows;
// this is evidence continuity, never a replacement semantic/native approval.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {REVIEWED_RPM_FIELDS,validateRpmPrimaryProvenance} from './reviewed-rpm-provenance.mjs';
import {REASSESSED_STUDENT_FIELDS} from './reviewed-source-reassessment.mjs';

const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const MASTER='docs/rules/01_CANONICAL/taxonomy/rpm-primary-v1.0/00_POLICY/CANONICAL_MASTER.json';
const CROSSWALK=/^archive\/data\/meta-foundation\/crosswalks\/rpm-primary-v1\.0\/[a-z0-9-]+\.json$/;
const ID=/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA1=/^[a-f0-9]{40}$/, SHA256=/^[a-f0-9]{64}$/;
const LIMIT=16*1024*1024;
const BINDING_KEYS=['questionUid','sourceOrdinal','recordId','crosswalkRef','masterRef','curriculum','scope','rpmPath','authorityUse','selectsPtTpl'];
const STATUSES=['DIRECT_ACTIVE','FAMILY_ACTIVE','DIRECT_BINDING_GAP','FAMILY_BINDING_GAP','RPM_ONLY'];
// Read the imported field vector only when invoked, after the module graph is
// initialized. Native/renderer readers can reach this helper through a cycle.
const solutionFixedFields=()=>[...REASSESSED_STUDENT_FIELDS.filter(k=>k!=='solution'),'imageAlt'];
const REPAIR_KEYS=['questionUid','sourceOrdinal','metadataBefore','identityBefore','after','rebind'];
const MAPPING_ONLY_FIELDS=new Set(['mappingStatus','bindingStatus','standardCourse','binding']);
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const same=(a,b)=>stable(a)===stable(b);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const text=x=>typeof x==='string'&&x.trim().length>0;
const keys=(x,want)=>x&&typeof x==='object'&&!Array.isArray(x)&&same(Object.keys(x).sort(),[...want].sort());
const fail=m=>{throw Error(`issued RPM evidence continuity: ${m}`);};
const need=(v,m)=>{if(!v)fail(m);};

function safe(root,p) {
  need(text(p)&&!path.isAbsolute(p)&&!p.includes('\\')&&!/[\x00-\x1f]/.test(p)&&
    p.split('/').every(x=>x&&x!=='.'&&x!=='..'),'unsafe evidence path');
  const full=path.resolve(root,p);
  for(let f=full;f!==path.resolve(root);f=path.dirname(f))
    need(!fs.existsSync(f)||!fs.lstatSync(f).isSymbolicLink(),'symlink evidence path');
  return full;
}
function live(root,p) {
  const f=safe(root,p),s=fs.lstatSync(f);
  need(s.isFile()&&!s.isSymbolicLink()&&s.size<=LIMIT,'evidence must be a bounded regular file');
  const raw=fs.readFileSync(f);need(raw.length<=LIMIT,'evidence too large');return raw;
}
function git(root,args) {
  try{return execFileSync('git',args,{cwd:root,maxBuffer:LIMIT,stdio:['ignore','pipe','pipe'],
    env:{...process.env,GIT_NO_LAZY_FETCH:'1'}});}
  catch{fail('exact immutable Git evidence unavailable');}
}
function gitRaw(root,commit,p) {
  need(SHA1.test(commit),'exact commit required');safe(root,p);
  const lines=git(root,['ls-tree','-z',commit,'--',p]).toString('utf8').split('\0').filter(Boolean);
  need(lines.length===1,'immutable file missing or ambiguous');
  const m=/^100644 blob ([a-f0-9]{40})\t([\s\S]+)$/.exec(lines[0]);
  need(m&&m[2]===p,'immutable regular blob required');
  const raw=git(root,['cat-file','blob',m[1]]);need(blob(raw)===m[1],'immutable blob bytes differ');return raw;
}
function parse(raw,label) {
  try{return JSON.parse(raw.toString('utf8'));}catch{fail(`${label} JSON invalid`);}
}
function bank(raw,count) {
  let rows;
  try{const ctx={window:{},console:{log(){},warn(){},error(){}}};
    vm.runInNewContext(raw.toString('utf8'),ctx,{timeout:3000});
    rows=ctx.window.questionBank||ctx.window.questions||ctx.questionBank||ctx.questions||ctx.window.examData?.questions;
    rows=JSON.parse(JSON.stringify(rows));
  }catch{fail('source bank invalid');}
  need(Array.isArray(rows)&&rows.length===count,'source denominator mismatch');return rows;
}
function unique(rows,key,label) {
  need(Array.isArray(rows)&&rows.length>0,`${label} missing`);
  const map=new Map();for(const row of rows){const id=row?.[key];
    need(text(id)&&!map.has(id),`${label} identity missing or duplicate`);map.set(id,row);}
  return map;
}
function ref(r) {need(keys(r,['path','sha256'])&&SHA256.test(r.sha256),'exact SHA-bound ref required');return r;}
function summary(doc) {
  const rows=unique(doc.records,'id','crosswalk records');
  const expected={recordCount:rows.size,...Object.fromEntries(STATUSES.map(s=>[s,0]))};
  for(const row of rows.values()){
    need(STATUSES.includes(row.mappingStatus),'unknown crosswalk mapping status');expected[row.mappingStatus]++;
  }
  need(same(doc.summary,expected),'crosswalk summary does not describe its actual rows');
}
function locateIssuedCommit(root,head,p,raw) {
  // Only additions of this exact receipt on the actual HEAD ancestry qualify.
  // Neither an arbitrary same-source commit nor an unmerged review branch does.
  const commits=git(root,['log',head,'--full-history','--diff-filter=A','--format=%H','--',p])
    .toString('utf8').trim().split('\n').filter(Boolean);
  need(commits.length>0&&commits.length<=256&&commits.every(c=>SHA1.test(c)),'issued receipt ancestry unavailable');
  const matches=[];
  for(const commit of new Set(commits))if(gitRaw(root,commit,p).equals(raw))matches.push(commit);
  need(matches.length===1,'exact issued receipt addition must be unambiguous');
  git(root,['merge-base','--is-ancestor',matches[0],head]);return matches[0];
}
function originalRequest(root,issued,receipt) {
  const p=`.archive-meta-register/inbox/${receipt.requestId}.json`;
  const commits=git(root,['log',issued,'--full-history','--diff-filter=AM','--format=%H','--',p])
    .toString('utf8').trim().split('\n').filter(Boolean);
  need(commits.length>0&&commits.length<=256&&commits.every(c=>SHA1.test(c)),'original request ancestry unavailable');
  const matches=new Map();
  for(const commit of new Set(commits)){
    const raw=gitRaw(root,commit,p),request=parse(raw,'original request');
    if(sha(stable(request))===receipt.requestSha256)matches.set(sha(raw),{commit,path:p,sha256:sha(raw),request});
  }
  need(matches.size===1,'exact originally issued request required');
  const found=[...matches.values()][0];git(root,['merge-base','--is-ancestor',found.commit,issued]);
  const r=found.request;
  need(r.schemaVersion==='archive-reviewed-exam-meta-register-request-v2'&&r.requestId===receipt.requestId&&
    r.examUid===receipt.examUid&&r.sourceArchiveFile===receipt.sourceArchiveFile&&r.scope==='PARTIAL_UIDS'&&
    r.registrationMode===undefined&&r.expectedQuestionCount===receipt.expectedQuestionCount&&
    r.expectedSourceBlobSha1===receipt.sourceBlobSha1&&same(r.approval,receipt.approval)&&
    same(r.registryChanges||[],receipt.registryChanges||[]),'original request and issued receipt differ');
  const repaired=hasSingleSolutionRepair(receipt);
  need(Array.isArray(r.items)&&r.items.every(p=>p.sourceReview===undefined&&
    (repaired?p.rebind!==undefined:p.rebind===undefined)),
    'ordinary original request or explicit issued solution rebind required');
  return found;
}

// This additional branch is a single, already issued solution-only leaf. It
// cannot reinterpret a missing marker or a mixed/sourceReview repair as one.
function hasSingleSolutionRepair(receipt) {
  return receipt.partialUidCount===1&&Array.isArray(receipt.fingerprintRepairs)&&receipt.fingerprintRepairs.length===1&&
    keys(receipt.fingerprintRepairs[0],REPAIR_KEYS)&&
    keys(receipt.fingerprintRepairs[0].rebind,['priorSourceBlobSha1','priorContentFingerprint']);
}
function crosswalkGrowth(before,after,receipt) {
  if(!hasSingleSolutionRepair(receipt)){
    need(after.records.length>before.records.length&&same(after.records.slice(0,before.records.length),before.records),
      'crosswalk is not an exact append-only extension');return null;
  }
  need(receipt.rpmPrimaryBindings.length===1,'one original solution RPM binding required');
  const selected=receipt.rpmPrimaryBindings[0].recordId,prefix=after.records.slice(0,before.records.length);
  need(after.records.length>before.records.length&&same(prefix.map(r=>r.id),before.records.map(r=>r.id)),
    'solution RPM original ordered ID prefix changed');
  const fixed=r=>Object.fromEntries(Object.entries(r).filter(([k])=>!MAPPING_ONLY_FIELDS.has(k)));
  let selectedRow,unselectedMappingRefreshCount=0;
  for(const [i,row]of before.records.entries()){
    const current=prefix[i];
    if(row.id===selected){need(same(row,current),'selected solution RPM row changed');selectedRow=row;}
    else{need(same(fixed(row),fixed(current)),'unselected RPM non-mapping fields changed');
      if(!same(row,current))unselectedMappingRefreshCount++;}
  }
  need(selectedRow,'selected solution RPM row absent from original authority');
  return {unselectedMappingRefreshCount,selectedFullRowSha256:sha(stable(selectedRow))};
}
function fingerprints(q) {
  const content={content:q.content??null,choices:Array.isArray(q.choices)?q.choices:null,image:q.image??null};
  return {sourceFingerprint:sha(JSON.stringify({content:content.content,choices:content.choices,answer:q.answer??null,
    solution:q.solution??null,image:content.image})),contentFingerprint:sha(JSON.stringify(content))};
}
function solutionAssetPaths(question) {
  const found=new Set(),fields=new Set(['image','images','solutionImage','solutionImages','src','href','xlink:href']);
  const add=value=>{
    if(!value||value.startsWith('#')||/^data:image\/(?:png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=\s]+$/u.test(value))return;
    need(!/^data:|^[a-z]+:|^\/\/|[?#]/iu.test(value),'unsupported solution renderer dependency');
    let p=value.replace(/^\.\//,'');if(p.startsWith('/archive/'))p=p.slice(1);else if(p.startsWith('assets/'))p='archive/'+p;
    need(p.startsWith('archive/assets/')&&p.split('/').every(k=>k&&k!=='.'&&k!=='..'),'unsupported solution renderer path');found.add(p);
  };
  const visit=(value,key='')=>{
    if(Array.isArray(value)){value.forEach(x=>visit(x,key));return;}
    if(value&&typeof value==='object'){for(const[k,x]of Object.entries(value))visit(x,k);return;}
    if(typeof value!=='string')return;
    if(fields.has(key)&&!value.includes('<'))add(value);
    if(/<(?:img|image|svg|use)\b/iu.test(value)){
      const attrs=[...value.matchAll(/\b(?:src|(?:xlink:)?href)\s*=\s*(["'])(.*?)\1/giu)];
      need((value.match(/\b(?:src|(?:xlink:)?href)\s*=/giu)||[]).length===attrs.length,'malformed solution renderer dependency');
      attrs.forEach(m=>add(m[2]));
    }
    need(!/url\s*\(/iu.test(value.replace(/url\(\s*["']?#[A-Za-z0-9_.:-]+["']?\s*\)/giu,'')),'external renderer CSS dependency');
  };
  for(const field of [...solutionFixedFields(),'solution'])visit(question[field],field);
  return [...found].sort();
}
function verifySolutionRepair({root,head,issued,receipt,original,oldBank,nowBank}) {
  if(!hasSingleSolutionRepair(receipt))return null;
  need(original.request.items.length===1,'one original solution item required');
  const repair=receipt.fingerprintRepairs[0],patch=original.request.items[0],n=repair.sourceOrdinal;
  need(patch.questionUid===repair.questionUid&&patch.sourceOrdinal===n&&Number.isInteger(n)&&n>0&&n<=oldBank.length&&
    same(patch.rebind,repair.rebind)&&same(patch.identityBefore,repair.identityBefore)&&
    keys(repair.metadataBefore,['sourceFingerprint','contentFingerprint'])&&keys(repair.identityBefore,['sourceFingerprint'])&&
    keys(repair.after,['sourceFingerprint','contentFingerprint'])&&SHA1.test(repair.rebind.priorSourceBlobSha1)&&
    SHA256.test(repair.rebind.priorContentFingerprint),'exact original solution repair required');
  const raw=git(root,['cat-file','blob',repair.rebind.priorSourceBlobSha1]);
  need(blob(raw)===repair.rebind.priorSourceBlobSha1,'original solution source blob mismatch');
  const previous=bank(raw,receipt.expectedQuestionCount)[n-1],question=oldBank[n-1];
  const pick=q=>Object.fromEntries(solutionFixedFields().map(k=>[k,q[k]??null]));
  need(typeof previous.solution==='string'&&typeof question.solution==='string'&&previous.solution!==question.solution&&
    same(pick(previous),pick(question)),'issued repair is not solution-only');
  // A changed inline/embedded drawing needs its own renderer approval. This
  // branch only preserves the previously issued text-solution repair.
  need(![previous.solution,question.solution].some(s=>/<\s*(?:\/\s*)?[A-Za-z][^>]*>|<!|<\?|&(?:#(?:x[a-f0-9]+|[0-9]+)|[a-z][a-z0-9]+);|url\s*\(|data:image/iu.test(s)),
    'solution renderer reassessment is outside this branch');
  const before=fingerprints(previous),after=fingerprints(question);
  need(before.contentFingerprint===after.contentFingerprint&&repair.rebind.priorContentFingerprint===before.contentFingerprint&&
    repair.metadataBefore.sourceFingerprint===before.sourceFingerprint&&
    [null,before.contentFingerprint].includes(repair.metadataBefore.contentFingerprint)&&
    repair.identityBefore.sourceFingerprint===before.sourceFingerprint&&same(repair.after,after),'issued solution fingerprints differ');
  for(const field of ['sourceFingerprint','contentFingerprint'])need(Object.hasOwn(patch.before,field)&&Object.hasOwn(patch.after,field)&&
    same(patch.before[field],repair.metadataBefore[field])&&same(patch.after[field],after[field]),'original solution before/after differs');
  const paths=solutionAssetPaths(question);
  need(same(solutionAssetPaths(previous),paths)&&same(solutionAssetPaths(nowBank[n-1]),paths),'solution renderer inventory changed');
  for(const p of paths){const old=gitRaw(root,issued,p),now=live(root,p);
    need(now.equals(old)&&gitRaw(root,head,p).equals(now),'solution renderer bytes changed');
    if(/\.svg$/iu.test(p)){
      const svg=now.toString('utf8');
      need(!/<!DOCTYPE|<!ENTITY|<(?:[^<>\s/:]+:)?(?:script|foreignObject|style|animate|animateColor|animateTransform|animateMotion|set|discard)\b|\b(?:xml:base|style|on\w+)\s*=|@import|&|\\/iu.test(svg),'unsupported SVG dependency');
      need(solutionAssetPaths({figureSvg:svg}).length===0,'nested external SVG dependency');
    }
  }
  return {questionUid:repair.questionUid,sourceOrdinal:n,priorSourceBlobSha1:repair.rebind.priorSourceBlobSha1,
    priorSourceRawSha256:sha(raw),selectedAssetCount:paths.length,authorityUse:'EXISTING_ISSUED_SOLUTION_REBIND_ONLY'};
}

// Returns null outside the existing typed RPM-provenance claim. Callers keep
// their ordinary SHA failure then. A successful result authenticates only this
// historical crosswalk ref; all other evidence/native/current guards still run.
export function verifyIssuedRpmEvidenceContinuity({root,receipt,receiptPath,evidenceRef,headSha}) {
  if(!CROSSWALK.test(evidenceRef?.path||'')||!Array.isArray(receipt?.rpmPrimaryBindings)||
    !receipt.rpmPrimaryBindings.some(b=>same(b?.crosswalkRef,evidenceRef)))return null;
  ref(evidenceRef);root=fs.realpathSync(root);
  const currentBytes=live(root,evidenceRef.path);
  if(sha(currentBytes)===evidenceRef.sha256)return null;
  need(receipt.schemaVersion==='archive-reviewed-exam-meta-registration-v2'&&
    receipt.metadataRegistrationStatus==='REGISTERED'&&ID.test(receipt.requestId||'')&&
    receiptPath===RECEIPTS+receipt.requestId+'.json'&&SHA256.test(receipt.requestSha256||'')&&
    receipt.scope==='PARTIAL_UIDS'&&receipt.approval?.type==='FINAL_QA'&&receipt.approval.metadataReviewed===true&&
    text(receipt.approval.approvedBy)&&receipt.approval.sourceRebind===undefined&&receipt.registrationMode===undefined&&
    (receipt.fingerprintRepairs===undefined||Array.isArray(receipt.fingerprintRepairs)&&receipt.fingerprintRepairs.length===0||hasSingleSolutionRepair(receipt))&&
    (receipt.nativeParentBindings===undefined||Array.isArray(receipt.nativeParentBindings)&&receipt.nativeParentBindings.length===0)&&
    Number.isInteger(receipt.partialUidCount)&&receipt.partialUidCount>0&&receipt.totalQuestions===receipt.partialUidCount&&
    Number.isInteger(receipt.expectedQuestionCount)&&receipt.expectedQuestionCount>=receipt.partialUidCount&&
    SHA1.test(receipt.sourceBlobSha1||'')&&SHA256.test(receipt.sourceRawSha256||''),'ordinary issued partial FINAL_QA required');
  const rawReceipt=live(root,receiptPath);need(same(parse(rawReceipt,'receipt'),receipt),'supplied receipt differs from live bytes');
  const head=git(root,['rev-parse','--verify','HEAD^{commit}']).toString('utf8').trim();
  need(SHA1.test(head)&&(!headSha||headSha===head),'actual fixed HEAD required');
  need(gitRaw(root,head,receiptPath).equals(rawReceipt),'live receipt differs from HEAD');
  need(gitRaw(root,head,evidenceRef.path).equals(currentBytes),'live crosswalk differs from HEAD');
  const issued=locateIssuedCommit(root,head,receiptPath,rawReceipt),original=originalRequest(root,issued,receipt);
  const oldBytes=gitRaw(root,issued,evidenceRef.path);need(sha(oldBytes)===evidenceRef.sha256,'issued crosswalk SHA mismatch');
  const before=parse(oldBytes,'issued crosswalk'),after=parse(currentBytes,'current crosswalk');
  const header=x=>Object.fromEntries(Object.entries(x).filter(([k])=>!['records','summary'].includes(k)));
  need(before.schemaVersion==='rpm-primary-active-crosswalk-v1'&&before.status==='ACTIVE_REFERENCE'&&
    before.rpmAuthority?.source===MASTER&&same(header(before),header(after)),'crosswalk authority header changed');
  summary(before);summary(after);
  const growth=crosswalkGrowth(before,after,receipt);
  const applied=unique(receipt.appliedRecords,'questionUid','issued metadata'),runtime=unique(receipt.runtimeRecords,'questionUid','issued runtime'),
    identities=unique(receipt.appliedIdentityRecords,'questionUid','issued identity'),patches=unique(original.request.items,'questionUid','original selected items');
  need([applied,runtime,identities,patches].every(m=>m.size===receipt.partialUidCount)&&
    receipt.rpmPrimaryBindings.length===receipt.partialUidCount,'whole selected RPM denominator required');
  const sourcePath='archive/exams/'+receipt.sourceArchiveFile;safe(root,sourcePath);
  const oldSource=gitRaw(root,issued,sourcePath),nowSource=live(root,sourcePath);
  need(blob(oldSource)===receipt.sourceBlobSha1&&sha(oldSource)===receipt.sourceRawSha256,'issued source bytes mismatch');
  need(gitRaw(root,head,sourcePath).equals(nowSource),'live source differs from HEAD');
  const oldBank=bank(oldSource,receipt.expectedQuestionCount),nowBank=bank(nowSource,receipt.expectedQuestionCount);
  // Every original explicitly approved authority is still available at the
  // exact issuance snapshot. Current non-RPM refs retain the caller's live SHA.
  const refs=[receipt.approval.evidenceRefs,...original.request.items.map(p=>p.evidenceRefs),
    ...(original.request.registryChanges||[]).map(c=>c.evidenceRefs)];
  for(const list of refs){need(Array.isArray(list)&&list.length>0,'original approval evidence missing');
    for(const r of list){ref(r);need(sha(gitRaw(root,issued,r.path))===r.sha256,'original immutable authority changed');}}
  const solutionRepair=verifySolutionRepair({root,head,issued,receipt,original,oldBank,nowBank});
  const seen=new Set(),ordinals=new Set();
  for(const binding of receipt.rpmPrimaryBindings){
    need(keys(binding,BINDING_KEYS)&&binding.authorityUse==='RPM_PATH_PROVENANCE_ONLY'&&binding.selectsPtTpl===false&&
      same(binding.crosswalkRef,evidenceRef)&&binding.masterRef?.path===MASTER,'explicit RPM-path-only binding required');
    ref(binding.masterRef);const uid=binding.questionUid,n=binding.sourceOrdinal;
    need(text(uid)&&!seen.has(uid)&&Number.isInteger(n)&&n>0&&n<=oldBank.length&&!ordinals.has(n),'RPM UID/ordinal mismatch');
    seen.add(uid);ordinals.add(n);
    const row=applied.get(uid),rt=runtime.get(uid),id=identities.get(uid),patch=patches.get(uid),q=nowBank[n-1];
    need([row,rt,id,patch].every(x=>x?.sourceOrdinal===n)&&[row,rt,id].every(x=>x.sourceArchiveFile===receipt.sourceArchiveFile)&&
      [row,rt,id].every(x=>String(x.sourceQuestionNo??'')===String(q.sourceQuestionNo??q.id??''))&&
      (!Object.hasOwn(q,'questionUid')||q.questionUid===uid)&&same(oldBank[n-1],q),'selected whole question/identity changed');
    for(const [field,value]of Object.entries(patch.after||{}))need(same(row[field],value),'issued value differs from original request');
    for(const field of [...REVIEWED_RPM_FIELDS,'curriculum','curriculumKey','courseKey','standardCourse'])
      need(same(row[field],rt[field]),'issued metadata/runtime RPM values differ');
    need(row.rpmPrimaryId===binding.recordId,'selected RPM record differs');
    const master=live(root,MASTER);
    need(sha(master)===binding.masterRef.sha256&&gitRaw(root,head,MASTER).equals(master)&&
      gitRaw(root,issued,MASTER).equals(master),'RPM master changed');
    need(receipt.approval.evidenceRefs.filter(r=>same(r,evidenceRef)).length===1&&
      receipt.approval.evidenceRefs.filter(r=>same(r,binding.masterRef)).length===1,'typed RPM refs are not exactly approval-bound');
    const current=validateRpmPrimaryProvenance({root,question:q,final:row,cache:new Map()});
    const expected={...binding,crosswalkRef:{path:evidenceRef.path,sha256:sha(currentBytes)}};
    delete expected.questionUid;delete expected.sourceOrdinal;
    need(same(current,expected),'current selected RPM provenance differs');
  }
  need(seen.size===applied.size&&[...applied.keys()].every(uid=>seen.has(uid)),'selected RPM coverage differs');
  return {schemaVersion:'archive-issued-rpm-evidence-continuity-v1',issuedCommit:issued,
    issuedReceiptRef:{path:receiptPath,sha256:sha(rawReceipt)},
    originalRequestRef:{commit:original.commit,path:original.path,sha256:original.sha256},
    historicalRef:{...evidenceRef},currentRef:{path:evidenceRef.path,sha256:sha(currentBytes)},
    selectedCount:seen.size,retainedRecordCount:before.records.length,appendedRecordCount:after.records.length-before.records.length,
    authorityUse:'RPM_PATH_PROVENANCE_ONLY',selectsPtTpl:false,newMetadataApprovals:0,
    ...(solutionRepair?{solutionRepair,...growth}:{})};
}
