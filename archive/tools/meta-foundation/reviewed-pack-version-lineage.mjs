// A registrar-generated pack patch is provenance, not a new classification.
// Reconstruct every intervening add-only binding registration and anchor its
// original requests, canonical bytes and prior approval in immutable Git.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

const CANON='archive/data/meta-foundation/canonical';
const RECEIPTS='archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/';
const ID=/^[A-Za-z0-9][A-Za-z0-9_-]{0,100}$/, SHA=/^[a-f0-9]{64}$/;
const VERSION=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const KEYS=['curriculum','problemTypeKey','standardCourse','standardUnitKey','subUnitKey'];
const stable=v=>JSON.stringify(v,(_,x)=>x&&typeof x==='object'&&!Array.isArray(x)
  ?Object.fromEntries(Object.keys(x).sort().map(k=>[k,x[k]])):x);
const same=(a,b)=>stable(a)===stable(b);
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const blob=b=>crypto.createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
const json=v=>Buffer.from(JSON.stringify(v,null,2)+'\n');
const fail=m=>{throw Error('reviewed pack version lineage: '+m);};
const cache=new Map();
function safe(root,p){
  if(typeof p!=='string'||!p||path.isAbsolute(p)||p.includes('\\')||/[\x00-\x1f]/.test(p)||
    p.split('/').some(s=>!s||s==='.'||s==='..'))fail('unsafe evidence path');
  const full=path.resolve(root,p);
  for(let q=full;q!==root;q=path.dirname(q))if(fs.existsSync(q)&&fs.lstatSync(q).isSymbolicLink())fail('symlink evidence path');
  return full;
}
function version(v){const m=typeof v==='string'&&v.match(VERSION);if(!m)fail('exact semantic version required');
  const n=m.slice(1).map(Number);if(n.some(x=>!Number.isSafeInteger(x)))fail('invalid version integer');return n;}
const digestEntry=(receipt,p)=>{
  const found=(receipt.outputDigests||[]).filter(r=>r.path===p);
  if(found.length!==1||!SHA.test(found[0].sha256||''))fail('unique canonical output digest required');return found[0].sha256;
};
function selectedAuthority(current,registry,issuedBindings,currentBindings,issuedCompiled,currentCompiled,id){
  for(const [collection,key,map]of [['problemTypes','problemTypeKey',registry.problemTypes],['templates','templateKey',registry.templates]]){
    const before=issuedCompiled[collection]?.filter(r=>r[key]===current[key]),now=currentCompiled[collection]?.filter(r=>r[key]===current[key]);
    if(before?.length!==1||now?.length!==1||before[0].status!=='ACTIVE'||now[0].status!=='ACTIVE'||
      !same(before[0],now[0])||!same(now[0],map?.get(current[key])))fail('selected ACTIVE definition changed since issued version');
    if(key==='templateKey'&&now[0].parentProblemTypeKey!==current.problemTypeKey)fail('selected template parent changed');
  }
  const find=doc=>doc.bindings.filter(row=>row.status==='ACTIVE'&&KEYS.every(k=>same(row[k],current[k])));
  const before=find(issuedBindings),now=find(currentBindings);
  if(before.length!==1||now.length!==1||before[0].ownerPack!==id||!same(before[0],now[0]))
    fail('selected exact binding or owner changed since issued version');
}

export function assertReviewedPackVersionLineage({root,current,runtime,prior,priorRuntime,priorReceiptRef,registry}){
  if(current.metaFoundationPackVersion===prior.metaFoundationPackVersion&&
    runtime.metaFoundationPackVersion===priorRuntime.metaFoundationPackVersion)return false;
  root=fs.realpathSync(root);
  const id=current.metaFoundationPackId;
  if(!/^[A-Z][A-Z0-9_]*$/.test(id||'')||[runtime,prior,priorRuntime].some(r=>r.metaFoundationPackId!==id)||
    current.metaFoundationPackVersion!==runtime.metaFoundationPackVersion||
    prior.metaFoundationPackVersion!==priorRuntime.metaFoundationPackVersion||registry?.status!=='ACTIVE')
    fail('same approved pack and paired metadata/runtime versions required');
  const from=version(prior.metaFoundationPackVersion),issued=version(current.metaFoundationPackVersion);
  const active=registry.activePacks?.get(id),now=version(active?.version);
  if(active?.status!=='ACTIVE'||active.id!==id||!same(from.slice(0,2),issued.slice(0,2))||
    !same(from.slice(0,2),now.slice(0,2))||issued[2]<=from[2]||now[2]<issued[2]||issued[2]-from[2]>64)
    fail('forward patch lineage in one ACTIVE pack required');
  if(!priorReceiptRef||!SHA.test(priorReceiptRef.sha256||''))fail('immutable prior receipt reference required');
  const git=(...args)=>execFileSync('git',args,{cwd:root,env:{...process.env,GIT_NO_LAZY_FETCH:'1'},
    maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
  const head=git('rev-parse','HEAD').toString().trim();
  const key=[root,head,id,prior.metaFoundationPackVersion,current.metaFoundationPackVersion,active.version,priorReceiptRef.sha256].join('\0');
  const old=cache.get(key);
  if(old&&old.inputs.every(([p,d])=>fs.existsSync(safe(root,p))&&sha(fs.readFileSync(safe(root,p)))===d)){
    selectedAuthority(current,registry,old.issuedBindings,old.bindings,old.issuedCompiled,old.compiled,id);return true;
  }
  const inputs=new Map(),read=p=>{const b=fs.readFileSync(safe(root,p));inputs.set(p,sha(b));return b;};
  const parse=p=>JSON.parse(read(p));
  const base=`${CANON}/packs/${id.toLowerCase().replaceAll('_','-')}`;
  const packPath=base+'/pack.json',bindingPath=base+'/bindings.json';
  const pack=parse(packPath),bindings=parse(bindingPath),taxonomyBytes=read(base+'/taxonomy.json'),aliasesBytes=read(base+'/aliases.json');
  const index=parse(CANON+'/registry_index.json'),compiled=parse('archive/data/meta-foundation/compiled/taxonomy_registry.json');
  const indexPack=index.activePacks?.filter(r=>r.id===id),compiledPack=compiled.sourcePacks?.filter(r=>r.packId===id);
  if(pack.packId!==id||pack.ownerPack!==id||pack.canonicalStatus!=='ACTIVE'||pack.packVersion!==active.version||
    index.status!=='ACTIVE'||indexPack?.length!==1||indexPack[0].status!=='ACTIVE'||indexPack[0].version!==pack.packVersion||
    compiled.status!=='DERIVED_READ_ONLY'||compiledPack?.length!==1||compiledPack[0].version!==pack.packVersion||
    !Array.isArray(bindings.bindings)||bindings.status!=='ACTIVE'||pack.bindingCount!==bindings.bindings.length||
    bindings.bindingCount!==bindings.bindings.length)fail('current canonical and compiled pack authority mismatch');
  for(const p of [packPath,bindingPath,base+'/taxonomy.json',base+'/aliases.json']){
    const rows=index.canonicalSources?.filter(r=>r.path===p);
    if(rows?.length!==1||String(rows[0].sha256).replace(/^sha256:/,'')!==inputs.get(p))fail('canonical input digest mismatch');
  }
  const compiledRef=index.compiledArtifacts?.filter(r=>r.path==='archive/data/meta-foundation/compiled/taxonomy_registry.json');
  if(compiledRef?.length!==1||String(compiledRef[0].sha256).replace(/^sha256:/,'')!==inputs.get(compiledRef[0].path))
    fail('compiled input digest mismatch');
  const runtimePath=`archive/data/meta-foundation/runtime/${id.toLowerCase().replaceAll('_','-')}-v1.json`,live=parse(runtimePath);
  if(live.packId!==id||live.status!=='ACTIVE'||live.packVersion!==pack.packVersion||!live.generatedFrom||
    typeof live.generatedFrom!=='object'||Array.isArray(live.generatedFrom))fail('current runtime pack authority mismatch');
  // Validate the version actually issued, even when a later registration added
  // unrelated PT/TPL definitions. A historical snapshot must be on HEAD's real
  // ancestry; current selected definitions and their exact binding stay fixed.
  const candidatesAt=git('rev-list','--first-parent',head).toString().trim().split('\n').filter(Boolean);
  let issuedPack=pack,issuedBindings=bindings,issuedTaxonomy=taxonomyBytes,issuedAliases=aliasesBytes,issuedCompiled=compiled;
  if(now[2]>issued[2]){
    let found=false;
    for(const commit of candidatesAt)try{
      const historical=JSON.parse(git('show',`${commit}:${packPath}`));
      if(historical.packVersion!==current.metaFoundationPackVersion||historical.packId!==id||historical.ownerPack!==id||historical.canonicalStatus!=='ACTIVE')continue;
      const historicalBindings=JSON.parse(git('show',`${commit}:${bindingPath}`)),historicalCompiled=JSON.parse(git('show',`${commit}:archive/data/meta-foundation/compiled/taxonomy_registry.json`));
      if(historicalBindings.status!=='ACTIVE'||historical.bindingCount!==historicalBindings.bindings?.length||
        historicalBindings.bindingCount!==historicalBindings.bindings.length||historicalCompiled.status!=='DERIVED_READ_ONLY'||
        historicalCompiled.sourcePacks?.filter(r=>r.packId===id&&r.version===historical.packVersion).length!==1)continue;
      issuedPack=historical;issuedBindings=historicalBindings;issuedCompiled=historicalCompiled;
      issuedTaxonomy=git('show',`${commit}:${base}/taxonomy.json`);issuedAliases=git('show',`${commit}:${base}/aliases.json`);found=true;break;
    }catch{/* An absent or inconsistent historical snapshot cannot establish an issued version. */}
    if(!found)fail('issued pack version lacks immutable canonical history');
  }
  selectedAuthority(current,registry,issuedBindings,bindings,issuedCompiled,compiled,id);
  const candidates=new Map();
  for(const [label,p]of Object.entries(live.generatedFrom)){
    if(!label.startsWith('reviewedExam_')||typeof p!=='string'||!p.startsWith(RECEIPTS)||!p.endsWith('.json'))continue;
    const raw=read(p),r=JSON.parse(raw);
    if(!r.outputDigests?.some(d=>d.path===packPath))continue;
    const owned=(r.appliedRecords||[]).filter(row=>row.metaFoundationPackId===id);
    const versions=[...new Set(owned.map(row=>row.metaFoundationPackVersion))];
    if(versions.length!==1)fail('binding registrar issued pack version ambiguous');
    const v=version(versions[0]);if(!same(v.slice(0,2),from.slice(0,2))||v[2]<=from[2]||v[2]>issued[2])continue;
    if(!ID.test(r.requestId||'')||label!=='reviewedExam_'+r.requestId||p!==RECEIPTS+r.requestId+'.json'||
      r.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||r.metadataRegistrationStatus!=='REGISTERED'||
      r.approval?.type!=='FINAL_QA'||r.approval.metadataReviewed!==true||!String(r.approval.approvedBy||'').trim()||
      !SHA.test(r.requestSha256||'')||!Array.isArray(r.registryChanges)||!r.registryChanges.length||
      !Array.isArray(r.runtimeRecords)||owned.some(row=>row.metadataApprovalType!=='FINAL_QA'||
        row.metadataRevision!==`meta-foundation:${id}@${versions[0]}:exam-final_qa-v2:${r.requestId}`||
        r.runtimeRecords.filter(rt=>rt.questionUid===row.questionUid&&rt.metaFoundationPackId===id&&
          rt.metaFoundationPackVersion===versions[0]&&rt.metadataRevision===row.metadataRevision).length!==1))
      fail('exact registered binding lineage receipt required');
    for(const c of r.registryChanges)if(c.path!==bindingPath||c.collection!=='bindings'||c.before!==null||
      !same(Object.keys(c.match||{}).sort(),KEYS)||c.after?.status!=='ACTIVE'||
      KEYS.some(k=>typeof c.match[k]!=='string'||!c.match[k]||c.after[k]!==c.match[k]))
      fail('only exact add-only ACTIVE bindings can establish patch lineage');
    if(candidates.has(v[2]))fail('ambiguous binding version provider');
    candidates.set(v[2],{receipt:r,path:p,raw,version:versions[0]});
  }
  const beforePack=structuredClone(issuedPack),beforeBindings=structuredClone(issuedBindings),chain=[],states=new Map();
  for(let patch=issued[2];patch>from[2];patch--){
    const row=candidates.get(patch);if(!row)fail('binding version step missing');
    const r=row.receipt,changes=r.registryChanges;
    if(sha(json(beforePack))!==digestEntry(r,packPath)||sha(json(beforeBindings))!==digestEntry(r,bindingPath))
      fail('registered canonical version output does not reproduce');
    if(changes.length>beforeBindings.bindings.length||!same(beforeBindings.bindings.slice(-changes.length),changes.map(c=>c.after)))
      fail('binding lineage is not an exact appended suffix');
    for(const c of changes){
      if(beforeBindings.bindings.filter(b=>KEYS.every(k=>same(b[k],c.match[k]))).length!==1||
        !beforePack.ownedStandardUnitDomains?.includes(c.after.standardUnitKey))fail('binding identity or owner domain changed');
    }
    beforeBindings.bindings.splice(-changes.length);beforeBindings.bindingCount=beforeBindings.bindings.length;
    beforePack.bindingCount=beforeBindings.bindings.length;beforePack.packVersion=`${from[0]}.${from[1]}.${patch-1}`;
    states.set(sha(json(beforePack)),{patch:patch-1,bindingsSha256:sha(json(beforeBindings))});
    chain.push(row);
  }
  // A later batch need not have existed in the first batch's inbox. Each step
  // must have an immutable request at a reconstructed earlier canonical state;
  // the original prior receipt must also exist at its exact original version.
  let priorAnchored=false;const anchored=new Set();
  for(const commit of candidatesAt){
    try{
      const state=states.get(sha(git('show',`${commit}:${packPath}`)));
      if(!state||sha(git('show',`${commit}:${bindingPath}`))!==state.bindingsSha256||
        sha(git('show',`${commit}:${base}/taxonomy.json`))!==sha(issuedTaxonomy)||
        sha(git('show',`${commit}:${base}/aliases.json`))!==sha(issuedAliases))continue;
      if(state.patch===from[2]&&sha(git('show',`${commit}:${priorReceiptRef.path}`))===priorReceiptRef.sha256)priorAnchored=true;
      for(const {receipt:r,version:issuedVersion}of chain){
        if(anchored.has(r.requestId)||version(issuedVersion)[2]<=state.patch)continue;
        try{
        const requestPath=`.archive-meta-register/inbox/${r.requestId}.json`,request=JSON.parse(git('show',`${commit}:${requestPath}`));
        if(request.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||sha(stable(request))!==r.requestSha256||
          request.requestId!==r.requestId||request.sourceArchiveFile!==r.sourceArchiveFile||
          request.expectedSourceBlobSha1!==r.sourceBlobSha1||request.expectedQuestionCount!==r.expectedQuestionCount||
          !same(request.registryChanges,r.registryChanges)||!same(request.approval,r.approval)||
          !same(request.items.map(x=>[x.questionUid,x.sourceOrdinal]).sort(),r.appliedRecords.map(x=>[x.questionUid,x.sourceOrdinal]).sort()))
          fail('immutable binding request differs from issued receipt');
        const source=git('show',`${commit}:archive/exams/${r.sourceArchiveFile}`);
        if(blob(source)!==r.sourceBlobSha1||sha(source)!==r.sourceRawSha256)fail('immutable binding source differs from issued receipt');
        const refs=[...(request.approval.evidenceRefs||[]),...request.items.flatMap(i=>i.evidenceRefs||[]),
          ...request.registryChanges.flatMap(c=>c.evidenceRefs||[])];
        if(!refs.length)fail('immutable binding evidence required');
        for(const ref of refs)if(!SHA.test(ref?.sha256||'')||sha(git('show',`${commit}:${ref.path}`))!==ref.sha256)
          fail('immutable binding evidence differs from registered authority');
        anchored.add(r.requestId);
        }catch{/* This step may belong to a different immutable registration batch. */}
      }
      if(priorAnchored&&anchored.size===chain.length)break;
    }catch{/* Try another actual ancestor; absent or mismatched Git authority never grants reuse. */}
  }
  if(!priorAnchored||anchored.size!==chain.length)fail('complete binding lineage lacks immutable prior/request authority');
  cache.set(key,{inputs:[...inputs],issuedBindings,bindings,issuedCompiled,compiled});return true;
}
