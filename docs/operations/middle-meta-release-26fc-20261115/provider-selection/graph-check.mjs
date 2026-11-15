import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {nativeRegistryDependencyDescriptor,orderNativeRequests} from './archive-pr-native-preview.mjs';
const own=path.dirname(new URL(import.meta.url).pathname);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const read=f=>JSON.parse(fs.readFileSync(f));
const fields=['curriculum','standardCourse','standardUnitKey','subUnitKey','problemTypeKey'];
const key=r=>JSON.stringify(Object.fromEntries(fields.map(f=>[f,r[f]])));
const input=read(own+'/current-inbox-inputs.json');
const m1path='/workspace/scratch/26fc42390a50/m1-work/.tmp/pr2141-authority-correction/withhold-eleven-current-main-028d28c/candidate-manifest.json';
assert.equal(sha(fs.readFileSync(m1path)),'a5e17a7c3a57c71bf501d17e7655909c04ad82565e34234830f20678aa14ab38');
const m1=read(m1path),base=new Map();
for(const f of input.files){const raw=fs.readFileSync(f.local);assert.equal(sha(raw),f.sha256);base.set(f.path,{path:f.path,raw,request:JSON.parse(raw)});}
const overlay=new Map(base);
for(const c of m1.changes.filter(c=>c.path.startsWith('.archive-meta-register/inbox/'))){
 const prior=overlay.get(c.path);assert(prior);assert.equal(sha(prior.raw),c.beforeSha256);
 if(c.action==='delete')overlay.delete(c.path);
 else{const raw=fs.readFileSync(path.resolve(path.dirname(m1path),c.candidateFile));assert.equal(sha(raw),c.afterSha256);overlay.set(c.path,{path:c.path,raw,request:JSON.parse(raw)});}
}
const canon=read(input.canonical.local).bindings.filter(r=>r.status==='ACTIVE');
const e029='.archive-meta-register/inbox/m2s1-binding-20261115-E029-Q7.json';
const stageA=new Map(overlay);stageA.delete(e029);
const external=new Map(overlay),externalRaw=fs.readFileSync(own+'/E029.external-request.json');
const extBlob=crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+externalRaw.length+'\0'),externalRaw])).digest('hex');
assert.equal(extBlob,'b482d4ac401a3a84e5997d1bc797cb5c8dbaffc7');
external.set(e029,{path:e029,raw:externalRaw,request:JSON.parse(externalRaw)});
const reqs=m=>[...m.values()].map(r=>({...r,registryDependency:nativeRegistryDependencyDescriptor(r.request)}));
const order=m=>{try{return{status:'PASS_TECHNICAL_ORDER_ONLY',paths:orderNativeRequests(reqs(m).filter(r=>r.registryDependency)).map(r=>r.path)}}catch(e){return{status:'FAIL',error:e.message}}};
const retained=m1.retainedRequestScopes.map(r=>'.archive-meta-register/inbox/'+r.requestId+'.json');
const changed=['E053','E061'].map(e=>'.archive-meta-register/inbox/m2s2-binding68-20261115-'+e+'.json');
assert.equal(retained.reduce((n,p)=>n+overlay.get(p).request.items.length,0),57);
function coverage(selected,universe){
 const entries=reqs(universe),provider=new Map();
 for(const r of entries)for(const p of r.registryDependency?.provides||[]){const k=key(p.key);if(!provider.has(k))provider.set(k,[]);provider.get(k).push(r.path);}
 const details=[];
 for(const p of selected){const r=entries.find(r=>r.path===p);assert(r,p);for(const dep of r.registryDependency?.requires||[]){
  const canonical=canon.filter(c=>key(c)===key(dep.key));const providers=provider.get(key(dep.key))||[];const chosen=providers.filter(x=>selected.includes(x));
  details.push({requestPath:p,questionUid:dep.questionUid,sourceOrdinal:dep.sourceOrdinal,key:dep.key,canonicalActiveMatches:canonical.length,selectedProviderPaths:chosen,unselectedProviderPaths:providers.filter(x=>!selected.includes(x)),satisfied:canonical.length>0||chosen.length===1});
 }}
 return{requestCount:selected.length,selectedUids:selected.reduce((n,p)=>n+universe.get(p).request.items.length,0),requiredItems:details.length,missing:details.filter(r=>!r.satisfied),details};
}
// Read-only graph expansion models the exact exported descriptor and the new
// private closure's algorithm; actual official selector is checked separately.
function closure(selected,universe){
 const entries=new Map(reqs(universe).map(r=>[r.path,r]));const providers=new Map();
 for(const r of entries.values())for(const dep of r.registryDependency?.provides||[]){const k=key(dep.key);if(!providers.has(k))providers.set(k,[]);providers.get(k).push(r.path);}
 const queue=[...selected],seen=new Set(queue),added=[];
 for(let i=0;i<queue.length;i++)for(const dep of entries.get(queue[i])?.registryDependency?.requires||[]){
  const matches=providers.get(key(dep.key))||[];
  if(matches.length>1)return{status:'FAIL',error:'PR_NATIVE_PREVIEW:REGISTRY_DEPENDENCY_AMBIGUOUS',consumer:queue[i],key:dep.key,providers:matches};
  const p=matches[0];if(p&&!seen.has(p)){seen.add(p);queue.push(p);added.push({provider:p,requiredBy:queue[i],questionUid:dep.questionUid,key:dep.key});}
 }
 const ordered=order(new Map(queue.map(p=>[p,universe.get(p)])));
 return{status:ordered.status,paths:ordered.paths,added,coverage:coverage(queue,universe)};
}
const full=coverage(retained,overlay),two=coverage(changed,overlay),combined=closure([...changed,e029],external);
assert.equal(full.missing.length,0);
assert.equal(combined.coverage.missing.length,0);
const result={schemaVersion:'native-request-binding-closure-technical-review-v1',main:input.main,externalHead:'918f912626afd878666d30c556de25468be3008e',m1Candidate:{path:m1path,sha256:sha(fs.readFileSync(m1path))},inputs:{path:'current-inbox-inputs.json',sha256:sha(fs.readFileSync(own+'/current-inbox-inputs.json'))},oldMainWholeQueue:order(base),withhold57AloneWholeQueue:order(overlay),withhold57PlusUnusedStageAFallback:order(stageA),withhold57PlusExternalDataFixWholeQueue:order(external),changed2WithoutNewClosure:two,retainedFull7WithoutNewClosure:full,changed2NewClosureBeforeE029Fix:closure(changed,overlay),changed2PlusE029NewClosureAfterDataFix:combined,limits:{scope:'Exact binding provider graph only; no new semantic authority judgment, source review, registrar application or actual registration',officialRequestDryWriteReplayConsumer:'M1 agent owns 57; no duplicate execution here',sourceContentReads:0,sourceWrites:0,canonicalWrites:0,remoteWrites:0}};
const out=own+'/combined-closure-graph.json',raw=JSON.stringify(result,null,2)+'\n';fs.writeFileSync(out,raw);assert.equal(fs.readFileSync(out,'utf8'),raw);
console.log(JSON.stringify({path:out,sha256:sha(raw),currentRequests:input.count,oldWholeQueue:result.oldMainWholeQueue.status,withholdOnly:result.withhold57AloneWholeQueue.status,fallback:result.withhold57PlusUnusedStageAFallback.status,combinedQueue:result.withhold57PlusExternalDataFixWholeQueue.status,changed2:{items:two.selectedUids,missing:two.missing.map(x=>({exam:path.basename(x.requestPath),ordinal:x.sourceOrdinal,key:x.key,providers:x.unselectedProviderPaths}))},full7:{items:full.selectedUids,missing:full.missing.length},combinedClosure:{paths:combined.paths,items:combined.coverage.selectedUids,missing:combined.coverage.missing.length}}));
