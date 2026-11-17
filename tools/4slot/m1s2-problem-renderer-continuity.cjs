'use strict';
// Closed M1S2 problem-image continuity. Existing published vectors are read,
// never approved or changed. Solution/text changes do not enter this route.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const {execFileSync}=require('node:child_process');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const ui=require('./m1s2-problem-renderer-ui.cjs');
const DIR='.archive-meta-register/4slot-m1s2-problem-renderer-continuity';
const SCHEMA='archive-m1s2-existing-problem-renderer-continuity-v1';
const SCOPE='M1S2_EXISTING_REGISTERED_VECTOR_PROBLEM_IMAGE_ONLY';
const BINDING='M1S2_PROBLEM_RENDERER_CONTINUITY';
const SUBJECTS=Object.freeze([
 ['P04','dda907fccf6844e209f2f909dacdb1ea30f2d76c258a72b76fd246c3655f4140','2final/24_향림중_2학기_기말_중1_기출.js',13],
 ['P08','b0046185c909143e8665ec134015703f04e8b0d17904e06717055b7771e63e15','2final/25_팔마중_2학기_기말_중1_기출.js',17],
 ['P10','a989f82a87d00dc1ec8c7d552fa21572235abfe58518c41fc7f95001ec9d689e','2final/25_풍덕중_2학기_기말_중1_기출.js',18],
 ['P11','7f4235f2620956516dfafbb36f1947f7edfe47aef1292379105eb747ba511fe3','2final/25_풍덕중_2학기_기말_중1_기출.js',19],
 ['P12','04a3307fa2f22f54255d293e5f2159fec8ae31d99a2c3188c242dd96b710d6e6','2mid/23_향림중_2학기_중간_중1_기출.js',6],
 ['P13','ebdae8cefdff3298308be0484ffbfd39d3a23075360265b27fd7b43f25af0b9c','2mid/26_팔마중_2학기_중간_중1_기출.js',6],
 ['P14','0292dec1b0304cd70882882526d8b57b86e2ab60a53d14a7c6aadcbc3e1f2246','2mid/26_팔마중_2학기_중간_중1_기출.js',8]
].map(([observationId,uid,source,sourceOrdinal])=>Object.freeze({observationId,questionUid:'qid_v1_'+uid,sourceArchiveFile:'original/middle/m1/'+source,sourceOrdinal})));
const SUBJECT_BY_UID=new Map(SUBJECTS.map(x=>[x.questionUid,x]));
const SOURCES=new Set(SUBJECTS.map(x=>x.sourceArchiveFile)),UIDS=new Set(SUBJECTS.map(x=>x.questionUid));
const INDEX='archive/data/item-4slot-index.json',MD='archive/data/question_metadata.json',ID='archive/data/question_identity_map.json';
const PRIOR_COMMIT='4af0d3e08addac84ac833afc7cbc3519979f79a3',REVIEWED_COMMIT='8377221debc9200dff7e647ae1a772d8d5a2e8be';
const REVIEW_PINS=Object.freeze({
 originalObservationRef:'51dba85292ee12564d270b2cadd6fd181d2da93ac7f0ce1a4093234d8b2b1132',
 currentObservationRef:'cc4ea7db873ea7c58f40a4fccf13e9a0f9985cb21c30e52cc3c123968a457e95',
 independentReviewRef:'7b64c4f6b8b84bdfd4d4adbfef460f6dc61e92a9ba23336147ee74034ffcaf58'
});
const VECTOR=['format','given','goal','method','condition','candidates'],ALLOWED=['image','imageAlt','imageSize'];
const ASSET_FIELDS=['content','question','choices','image','images','figureSvg','svg','solution','solutionImage','solutionImages','solutionFigureSvg'];
const HEX=/^[a-f0-9]{64}$/,OID=/^[a-f0-9]{40}$/;
const own=(x,k)=>Object.prototype.hasOwnProperty.call(x||{},k);
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+b.length+'\0'),b])).digest('hex');
const eq=(a,b)=>stable(a)===stable(b);
const fields=(q,keys)=>Object.fromEntries(keys.map(k=>[k,own(q,k)?{present:true,value:q[k]}:{present:false}]));
const vector=q=>Object.fromEntries(VECTOR.map(k=>[k,q[k]]));
const withoutCommit=({commit,...ref})=>ref;
function fail(code){throw Error('M1S2_PROBLEM_CONTINUITY_'+code);}
function exact(x,keys,code){if(!x||typeof x!=='object'||Array.isArray(x)||!eq(Object.keys(x).sort(),[...keys].sort()))fail(code+'_KEYS');}
function unique(rows,match,code){const found=(rows||[]).filter(match);if(found.length!==1)fail(code);return found[0];}
function relative(p){if(typeof p!=='string'||!p||/[\\\x00-\x1f\x7f]/.test(p)||p.startsWith('/')||p.split('/').some(x=>!x||x==='.'||x==='..'))fail('PATH');return p;}
function git(root,args){try{return execFileSync('git',['-C',root,...args],{env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout:30000,maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});}catch{fail('GIT_INPUT_UNAVAILABLE');}}
function ancestor(root,before,after){if(!OID.test(before)||!OID.test(after))fail('COMMIT');try{execFileSync('git',['-C',root,'merge-base','--is-ancestor',before,after],{env:{...process.env,GIT_NO_LAZY_FETCH:'1'},timeout:30000,stdio:'pipe'});}catch{fail('PRIOR_NOT_ANCESTOR');}}
function regular(root,p){relative(p);let file=root;for(const part of p.split('/')){file=path.join(file,part);if(fs.lstatSync(file).isSymbolicLink())fail('SYMLINK');}if(!fs.lstatSync(file).isFile())fail('NOT_REGULAR');return file;}
function makeReader(root){
 const observed=new Map(),small=new Map(),projections=new Map(),head=git(root,['rev-parse','--verify','HEAD']).toString().trim();
 function local(p){const b=fs.readFileSync(regular(root,p));observed.set(p,sha(b));return b;}
 function read(ref,live=false){
  const historical=own(ref,'commit');exact(ref,['path','gitBlobSha1','sha256','bytes',...(historical?['commit']:[])],'REF');relative(ref.path);
  if(!OID.test(ref.gitBlobSha1)||!HEX.test(ref.sha256)||!Number.isSafeInteger(ref.bytes)||ref.bytes<1||(historical&&!OID.test(ref.commit)))fail('REF');
  const key=stable(ref);let b=small.get(key);
  if(!b){const at=historical?ref.commit:head,row=git(root,['ls-tree','-z',at,'--',ref.path]).toString(),tab=row.indexOf('\t'),parts=row.slice(0,tab).split(' ');
   if(tab<0||row.slice(tab+1).replace(/\0$/,'')!==ref.path||!['100644','100755'].includes(parts[0])||parts[1]!=='blob'||parts[2]!==ref.gitBlobSha1)fail('GIT_PATH_BINDING');
   b=git(root,['cat-file','blob',ref.gitBlobSha1]);if(b.length!==ref.bytes||sha(b)!==ref.sha256||blob(b)!==ref.gitBlobSha1)fail('REF_BYTES');
   if(b.length<1024*1024)small.set(key,b);
  }
  if(live&&!local(ref.path).equals(b))fail('LIVE_BYTES_CHANGED');return b;
 }
 const json=(ref,live=false)=>JSON.parse(read(ref,live));
 function projection(ref,kind){
  const key=stable([ref,kind]);if(projections.has(key))return projections.get(key);
  const d=ref?json(ref):JSON.parse(local(kind==='metadata'?MD:ID));if(!Array.isArray(d.records))fail('RECORD_INVENTORY');
  // Authenticate full actual files; retain only owned rows in the build cache.
  // No filtered JSON substitutes for the original Git-authoritative bytes.
  const result=kind==='index'?{...Object.fromEntries(['schemaVersion','authority','sourceMutation','semanticApprovalMutation'].map(k=>[k,d[k]])),files:(d.files||[]).filter(x=>SOURCES.has(x.sourceArchiveFile)),records:d.records.filter(x=>UIDS.has(x.questionUid)),pending:d.pending||[]}:
   {records:d.records.filter(x=>kind==='identity'?SOURCES.has(x.sourceArchiveFile)||UIDS.has(x.questionUid):UIDS.has(x.questionUid))};
  projections.set(key,result);return result;
 }
 return{root,head,local,read,json,projection,observed};
}
function collect(root,{safe,walk,sha:hash}){
 const result=new Map(),dir=safe(root,DIR);if(!fs.existsSync(dir))return result;const files=walk(dir);if(!files.length)return result;
 const reader=makeReader(root),dataDigests=[MD,ID].map(p=>{try{return[p,sha(reader.local(p))];}catch{return[p,null];}});
 for(const file of files){const p=path.relative(root,file).split(path.sep).join('/');if(!p.endsWith('.json'))fail('FILE_TYPE');
  const raw=reader.local(p),doc=JSON.parse(raw),s=SUBJECT_BY_UID.get(doc.questionUid);
  if(!s||doc.sourceArchiveFile!==s.sourceArchiveFile||doc.sourceOrdinal!==s.sourceOrdinal||p!==DIR+'/'+s.questionUid+'.json')fail('CLOSED_SCOPE');
  const entry={path:p,sha256:hash(raw),questionUid:s.questionUid,sourceOrdinal:s.sourceOrdinal,doc,reader,digests:[[p,hash(raw)],...dataDigests]};
  if(!result.has(s.sourceArchiveFile))result.set(s.sourceArchiveFile,[]);result.get(s.sourceArchiveFile).push(entry);
 }return result;
}
function sourceRefs(q){
 const text=JSON.stringify(fields(q,ASSET_FIELDS)).replaceAll('\\/','/'),refs=new Set();
 if(/(?:https?:)?\/\/[^\s"<>]+\.(?:png|jpe?g|gif|webp|svg)/i.test(text)||/data:image|<svg\b/i.test(text))fail('REMOTE_OR_INLINE_ASSET');
 for(const m of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))refs.add(m[0].startsWith('archive/')?m[0]:'archive/'+m[0]);
 return[...refs].sort();
}
function nestedAssets(b,p){
 if(!/\.svg$/i.test(p))return[];const text=b.toString('utf8'),refs=[];
 if(/<script\b|\bon[a-z]+\s*=/i.test(text))fail('ACTIVE_SVG');
 for(const m of text.matchAll(/(?:\b(?:xlink:)?href\s*=\s*["']([^"']+)["']|url\(\s*["']?([^"')\s]+)["']?\s*\))/gi)){
  const v=m[1]||m[2];if(v.startsWith('#'))continue;if(/^[a-z]+:|^\/\//i.test(v))fail('EXTERNAL_NESTED_ASSET');
  const clean=v.split('#')[0].split('?')[0],r=clean.startsWith('/archive/assets/')?clean.slice(1):clean.startsWith('archive/assets/')?clean:clean.startsWith('assets/')?'archive/'+clean:path.posix.normalize(path.posix.join(path.posix.dirname(p),clean));
  if(!r.startsWith('archive/assets/'))fail('ASSET_SCOPE');refs.push(relative(r));
 }return refs;
}
function inventory(reader,refs,q,{commit,live=false,opaqueInherited=new Set()}){
 if(!Array.isArray(refs))fail('ASSET_INVENTORY');const map=new Map();
 for(const ref of refs){if(!ref.path?.startsWith('archive/assets/')||map.has(ref.path)||(commit?ref.commit!==commit:own(ref,'commit')))fail('ASSET_INVENTORY');reader.read(ref,live);map.set(ref.path,ref);}
 const queue=sourceRefs(q),seen=new Set();while(queue.length){const p=queue.shift();if(seen.has(p))continue;seen.add(p);const ref=map.get(p);if(!ref)fail('ASSET_MISSING');if(!opaqueInherited.has(p))queue.push(...nestedAssets(reader.read(ref,live),p));}
 if(!eq([...seen].sort(),refs.map(r=>r.path))||!eq(refs.map(r=>r.path),[...map.keys()].sort()))fail('ASSET_EXTRA_OR_ORDER');
}
function verifyAssetContinuity(reader,doc,prior,current){
 if(!Array.isArray(doc.priorAssets)||!Array.isArray(doc.currentAssets))fail('ASSET_INVENTORY');
 const oldOther=doc.priorAssets.filter(r=>r.path!=='archive/'+prior.image),newOther=doc.currentAssets.filter(r=>r.path!=='archive/'+current.image);
 if(!eq(oldOther.map(withoutCommit),newOther))fail('OTHER_ASSET_CHANGED');
 const inherited=new Set(oldOther.map(r=>r.path));
 if(inherited.has('archive/'+current.image))fail('PROBLEM_IMAGE_REUSES_OTHER_ASSET');
 // Whole-question continuity already forbids every solution-field change.
 // Exact previously issued non-problem assets remain opaque authenticated bytes;
 // this problem-only transport neither decodes nor reapproves their contents.
 // New problem SVGs retain all active/remote/inline/nested-reference checks.
 inventory(reader,doc.priorAssets,prior,{commit:doc.priorSourceRef.commit,opaqueInherited:inherited});
 inventory(reader,doc.currentAssets,current,{live:true,opaqueInherited:inherited});
}
function tuples(bank){const seen=new Set();return bank.map((q,i)=>{const number=sourceNumber(q);if(seen.has(number))fail('SOURCE_NUMBER_DUPLICATE');seen.add(number);return[i+1,sourceIdentityNumber(q),number];});}
function problemOnlyChange(prior,current){
 const changed=[...new Set([...Object.keys(prior),...Object.keys(current)])].filter(k=>!eq(fields(prior,[k]),fields(current,[k])));
 if(!changed.includes('image')||changed.some(k=>!ALLOWED.includes(k)))fail('NON_PROBLEM_IMAGE_CHANGE');
 return changed;
}
function verifyReview(reader,doc,prior,current){
 for(const[key,digest]of Object.entries(REVIEW_PINS))if(doc[key]?.sha256!==digest)fail('ACCEPTED_REVIEW_PIN');
 const original=reader.json(doc.originalObservationRef,true),observation=reader.json(doc.currentObservationRef,true),review=reader.json(doc.independentReviewRef,true),subject=SUBJECT_BY_UID.get(doc.questionUid);
 const selected=r=>r.questionUid===doc.questionUid&&r.sourceArchiveFile===doc.sourceArchiveFile&&r.sourceOrdinal===doc.sourceOrdinal&&r.observationId===subject.observationId;
 if(original.schemaVersion!=='archive-independent-original-problem-figure-observation-v1'||original.phase!=='GIVEN_METADATA_THEN_ORIGINAL_OBSERVATION_FREEZE_BEFORE_CURRENT'||
    observation.schemaVersion!=='archive-independent-current-problem-figure-observation-v1'||observation.phaseOrder!=='ORIGINAL_FROZEN_THEN_CURRENT_INPUT_RECEIVED_THEN_CURRENT_RASTER_VIEWED'||
    review.schemaVersion!=='archive-independent-problem-figure-continuity-review-v1'||review.scope!=='M1S2_PREVIOUSLY_REGISTERED_VECTOR_PROBLEM_FIGURE_ONLY'||
    !String(review.reviewer||'').trim()||review.reviewer===doc.author||original.reviewer!==review.reviewer||observation.reviewer!==review.reviewer||
    observation.originalObservationSha256!==doc.originalObservationRef.sha256||review.originalObservationSha256!==doc.originalObservationRef.sha256||review.currentObservationSha256!==doc.currentObservationRef.sha256||
    review.baselineRegisteredCommit!==doc.priorRegistrationRef.commit||review.currentSourceCommit!==doc.reviewedSourceRef.commit||
    !(Date.parse(original.createdAt)<Date.parse(observation.createdAt)&&Date.parse(observation.createdAt)<=Date.parse(review.createdAt))||
    [original,observation].some(r=>r.newMathQa!==0||r.newSemanticApproval!==0||r.newFourSlotVector!==0)||
    review.counts?.wholeItemApproved!==0||review.counts?.newMathQa!==0||review.counts?.newSemanticApproval!==0||review.counts?.newFourSlotVector!==0)fail('INDEPENDENT_REVIEW');
 const o=unique(original.records,selected,'ORIGINAL_OBSERVATION'),c=unique(observation.rows,selected,'CURRENT_OBSERVATION'),r=unique(review.records,selected,'REVIEW_ROW');
 if(o.decision!=='ORIGINAL_OBSERVATION_FROZEN_ONLY'||o.viewedOriginalAsset!==true||c.decision!=='CURRENT_OBSERVATION_FROZEN_ONLY'||c.viewedActualRaster!==true||
    r.decision!=='ACCEPT_PROBLEM_FIGURE_CONTINUITY_ONLY'||r.surface!=='PROBLEM'||r.wholeItemApproval!==false||r.originalAndCurrentProblemAssetsDirectlyViewed!==true||
    o.originalSourceGitBlobSha1!==doc.priorSourceRef.gitBlobSha1||r.originalSourceGitBlobSha1!==doc.priorSourceRef.gitBlobSha1||
    c.currentSourceGitBlobSha1!==doc.reviewedSourceRef.gitBlobSha1||r.currentSourceGitBlobSha1!==doc.reviewedSourceRef.gitBlobSha1||
    !eq(o.originalAssetRef,r.originalAssetRef)||!eq(c.currentAssetRef,r.currentAssetRef)||r.currentRasterSha256!==c.rasterSha256)fail('REVIEW_BINDING');
 const before=unique(doc.priorAssets,x=>x.path==='archive/'+prior.image,'PRIOR_PROBLEM_IMAGE'),after=unique(doc.currentAssets,x=>x.path==='archive/'+current.image,'CURRENT_PROBLEM_IMAGE');
 if(!eq(before,r.originalAssetRef)||!eq(withoutCommit(r.currentAssetRef),after)||r.currentAssetRef.commit!==doc.reviewedSourceRef.commit||
    typeof prior.image!=='string'||typeof current.image!=='string'||!prior.image.endsWith('.png')||!current.image.endsWith('.svg'))fail('PROBLEM_REVIEW_ASSET_BINDING');
}
function verify(root,entry,{d,it,id,cur,dict,bank,sourceRaw,identity,uidUses,loadBank}){
 const doc=entry.doc,reader=entry.reader,subject=SUBJECT_BY_UID.get(id?.questionUid);
 exact(doc,['schemaVersion','scope','author','questionUid','sourceArchiveFile','sourceOrdinal','sourceQuestionNo','sourceQuestionCount',
  'priorRegistrationRef','priorCompactRef','currentCompactRef','dictionaryRef','priorSourceRef','reviewedSourceRef','currentSourceRef','priorMetadataRef','priorIdentityRef',
  'priorAssets','currentAssets','vectorSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','priorMetadataRowSha256','priorIdentityRowSha256',
  'originalObservationRef','currentObservationRef','independentReviewRef','uiTechnicalRef','uiVisualRef','newMathQa','newSemanticApproval','newFourSlotVector'],'INPUT');
 if(doc.schemaVersion!==SCHEMA||doc.scope!==SCOPE||!subject||doc.sourceArchiveFile!==subject.sourceArchiveFile||doc.sourceOrdinal!==subject.sourceOrdinal||
    doc.questionUid!==id.questionUid||doc.sourceArchiveFile!==d.sourceArchiveFile||doc.sourceOrdinal!==cur.ordinal||doc.sourceQuestionNo!==sourceIdentityNumber(cur.q)||
    !String(doc.author||'').trim()||doc.sourceQuestionCount!==bank.length||doc.newMathQa!==0||doc.newSemanticApproval!==0||doc.newFourSlotVector!==0||
    own(it,'registrationHold')||own(d,'scope')||own(d,'identityReconciliation')||(cur.q.questionUid&&cur.q.questionUid!==id.questionUid))fail('INPUT_SCOPE');
 if(sha(reader.local(entry.path))!==entry.sha256)fail('INPUT_CHANGED');
 const source='archive/exams/'+d.sourceArchiveFile,compactPath='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');
 if(doc.priorRegistrationRef.commit!==PRIOR_COMMIT||doc.reviewedSourceRef.commit!==REVIEWED_COMMIT||
    doc.priorRegistrationRef.path!==INDEX||doc.priorMetadataRef.path!==MD||doc.priorIdentityRef.path!==ID||doc.priorCompactRef.path!==compactPath||doc.currentCompactRef.path!==compactPath||doc.dictionaryRef.path!==dict.path||
    [doc.priorSourceRef,doc.reviewedSourceRef,doc.currentSourceRef].some(r=>r.path!==source)||
    [doc.priorCompactRef,doc.priorSourceRef,doc.priorMetadataRef,doc.priorIdentityRef].some(r=>r.commit!==doc.priorRegistrationRef.commit)||
    [doc.currentSourceRef,doc.currentCompactRef,doc.dictionaryRef,doc.originalObservationRef,doc.currentObservationRef,doc.independentReviewRef,doc.uiTechnicalRef,doc.uiVisualRef].some(r=>own(r,'commit')))fail('REF_SCOPE');
 ancestor(root,doc.priorRegistrationRef.commit,doc.reviewedSourceRef.commit);ancestor(root,doc.reviewedSourceRef.commit,reader.head);
 const priorIndex=reader.projection(doc.priorRegistrationRef,'index'),priorCompact=reader.json(doc.priorCompactRef),currentCompact=reader.json(doc.currentCompactRef,true);
 if(priorIndex.schemaVersion!=='archive-item-4slot-runtime-v1'||priorIndex.authority!=='MAIN_MERGED_REVIEWED_COMPACT'||priorIndex.sourceMutation!==0||priorIndex.semanticApprovalMutation!==0||
    !eq(priorCompact,d)||!eq(currentCompact,d)||doc.priorSourceRef.gitBlobSha1!==d.sourceGitBlobSha||doc.priorCompactRef.sha256!==doc.currentCompactRef.sha256)fail('PRIOR_AUTHORITY');
 const file=unique(priorIndex.files,r=>r.path===compactPath,'PRIOR_FILE'),row=unique(priorIndex.records,r=>r.questionUid===id.questionUid,'PRIOR_REGISTERED');
 if(row.registrationStatus!=='REGISTERED'||row.independentReviewClaim!==false||!['EXACT_BLOB','UNCHANGED_STUDENT_PAYLOAD'].includes(row.sourceBinding)||
    row.sourceArchiveFile!==d.sourceArchiveFile||row.sourceOrdinal!==cur.ordinal||row.sourceQuestionNo!==doc.sourceQuestionNo||row.sourceDisplayNumber!==it.ordinal||row.compactPath!==compactPath||row.dictionaryVersion!==d.dictionaryVersion||
    !eq(vector(row),vector(it))||sha(stable(vector(it)))!==doc.vectorSha256||file.compactSha256!==doc.priorCompactRef.sha256||file.currentSourceBlobSha!==doc.priorSourceRef.gitBlobSha1||file.sourceGitBlobSha!==d.sourceGitBlobSha||
    file.itemCount!==bank.length||file.dictionarySha256!==doc.dictionaryRef.sha256||doc.dictionaryRef.sha256!==dict.sha256||!eq(file.evidence,d.evidence)||!eq(file.reviewedBy,d.reviewedBy)||
    priorIndex.pending.some(r=>r.path===compactPath&&(r.ordinal==null||r.ordinal===it.ordinal)))fail('PRIOR_REGISTERED_BINDING');
 reader.read(doc.dictionaryRef,true);
 const priorBank=loadBank(reader.read(doc.priorSourceRef)),reviewBank=loadBank(reader.read(doc.reviewedSourceRef)),currentBank=loadBank(reader.read(doc.currentSourceRef,true));
 if(!reader.read(doc.currentSourceRef).equals(sourceRaw)||!eq(currentBank,bank)||priorBank.length!==bank.length||reviewBank.length!==bank.length)fail('SOURCE_BINDING');
 const prior=priorBank[cur.ordinal-1],reviewed=reviewBank[cur.ordinal-1],current=cur.q;
 if(!eq(tuples(priorBank),tuples(bank))||!eq(tuples(reviewBank),tuples(bank))||sha(stable(prior))!==doc.priorWholeQuestionSha256||sha(stable(current))!==doc.currentWholeQuestionSha256||!eq(reviewed,current))fail('SOURCE_INVENTORY');
 problemOnlyChange(prior,current);
 const oldMd=unique(reader.projection(doc.priorMetadataRef,'metadata').records,r=>r.questionUid===id.questionUid,'PRIOR_MD'),md=unique(reader.projection(null,'metadata').records,r=>r.questionUid===id.questionUid,'CURRENT_MD');
 const oldIdentity=reader.projection(doc.priorIdentityRef,'identity').records,oldId=unique(oldIdentity,r=>r.questionUid===id.questionUid,'PRIOR_ID');
 if(!eq(oldMd,md)||!eq(oldId,id)||sha(stable(oldMd))!==doc.priorMetadataRowSha256||sha(stable(oldId))!==doc.priorIdentityRowSha256)fail('METADATA_IDENTITY_CHANGED');
 const ids=identity.records.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal),oldIds=oldIdentity.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
 if(ids.length!==bank.length||!eq(ids,oldIds)||ids.some((r,i)=>r.sourceOrdinal!==i+1||uidUses.get(r.questionUid)!==1||(own(r,'status')&&r.status!=='VERIFIED')||String(r.sourceQuestionNo)!==sourceIdentityNumber(bank[i])))fail('UID_INVENTORY');
 verifyAssetContinuity(reader,doc,prior,current);
 verifyReview(reader,doc,prior,current);
 ui.verify({reader,doc,current,subjects:SUBJECTS,ancestor:(a,b)=>ancestor(root,a,b)});
 return{status:'PASS',ref:{path:entry.path,sha256:entry.sha256},observed:[...reader.observed],approvalEffect:SCOPE,newFourSlotVector:0,newSemanticApproval:0};
}
module.exports={DIR,SCHEMA,SCOPE,BINDING,SUBJECTS,collect,verify,stable,sha,blob,fields,vector,sourceRefs,problemOnlyChange,verifyAssetContinuity};
