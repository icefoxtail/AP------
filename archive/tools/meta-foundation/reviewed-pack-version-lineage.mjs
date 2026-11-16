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
const OWNER=/^[A-Z][A-Z0-9_]*$/, TEMPLATE=/^TPL_[A-Z0-9_]+$/;
const slug=id=>id.toLowerCase().replaceAll('_','-');
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

function companionRegistryAuthority(w,registry){
  const active=registry.activePacks?.get(w.owner);
  if(active?.id!==w.owner||active.status!=='ACTIVE'||active.version!==w.version||
    !same(registry.templates?.get(w.template.templateKey),w.template)||
    !same(registry.problemTypes?.get(w.parent.problemTypeKey),w.parent))
    fail('companion current ACTIVE definition or owner changed');
}
function ownerDocuments(d,id){
  const {pack,taxonomy,bindings,aliases}=d;
  if(pack?.packId!==id||pack.ownerPack!==id||pack.canonicalStatus!=='ACTIVE'||
    taxonomy?.status!=='ACTIVE'||bindings?.status!=='ACTIVE'||
    !Array.isArray(taxonomy.problemTypes)||!Array.isArray(taxonomy.templates)||
    !Array.isArray(bindings.bindings)||!Array.isArray(aliases?.aliases)||
    taxonomy.problemTypeCount!==taxonomy.problemTypes.length||taxonomy.templateCount!==taxonomy.templates.length||
    bindings.bindingCount!==bindings.bindings.length||pack.problemTypeCount!==taxonomy.problemTypes.length||
    pack.templateCount!==taxonomy.templates.length||pack.bindingCount!==bindings.bindings.length||pack.aliasCount!==aliases.aliases.length)
    fail('companion canonical owner document authority mismatch');
  version(pack.packVersion);
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
    selectedAuthority(current,registry,old.issuedBindings,old.bindings,old.issuedCompiled,old.compiled,id);
    for(const witness of old.companionWitnesses||[])companionRegistryAuthority(witness,registry);return true;
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
  // A mixed transaction may add exact templates to another existing owner.
  // Every non-target change must enter this closed lane; it is never ignored.
  const candidates=new Map(),baselineProviders=[],companionOwners=new Map(),companionWitnesses=[];
  const companionOwner=owner=>{
    if(companionOwners.has(owner))return companionOwners.get(owner);
    const ownerBase=`${CANON}/packs/${slug(owner)}`,docs={};
    for(const name of ['pack','taxonomy','bindings','aliases']){
      const p=`${ownerBase}/${name}.json`;docs[name]=parse(p);
      const refs=index.canonicalSources?.filter(r=>r.path===p);
      if(refs?.length!==1||String(refs[0].sha256).replace(/^sha256:/,'')!==inputs.get(p))
        fail('companion canonical input digest mismatch');
    }
    ownerDocuments(docs,owner);
    const entries=index.activePacks?.filter(r=>r.id===owner),sources=compiled.sourcePacks?.filter(r=>r.packId===owner);
    if(entries?.length!==1||entries[0].status!=='ACTIVE'||entries[0].version!==docs.pack.packVersion||
      sources?.length!==1||sources[0].version!==docs.pack.packVersion)fail('companion indexed owner version mismatch');
    const value={owner,base:ownerBase,docs,steps:[]};companionOwners.set(owner,value);return value;
  };
  for(const [label,p]of Object.entries(live.generatedFrom)){
    if(!label.startsWith('reviewedExam_')||typeof p!=='string'||!p.startsWith(RECEIPTS)||!p.endsWith('.json'))continue;
    const raw=read(p),r=JSON.parse(raw);
    if(!r.outputDigests?.some(d=>d.path===packPath))continue;
    const owned=(r.appliedRecords||[]).filter(row=>row.metaFoundationPackId===id);
    const versions=[...new Set(owned.map(row=>row.metaFoundationPackVersion))];
    if(versions.length!==1)fail('binding registrar issued pack version ambiguous');
    const v=version(versions[0]);if(!same(v.slice(0,2),from.slice(0,2))||v[2]<from[2]||v[2]>issued[2])continue;
    if(!ID.test(r.requestId||'')||label!=='reviewedExam_'+r.requestId||p!==RECEIPTS+r.requestId+'.json'||
      r.schemaVersion!=='archive-reviewed-exam-meta-registration-v2'||r.metadataRegistrationStatus!=='REGISTERED'||
      r.approval?.type!=='FINAL_QA'||r.approval.metadataReviewed!==true||!String(r.approval.approvedBy||'').trim()||
      !SHA.test(r.requestSha256||'')||!Array.isArray(r.registryChanges)||!r.registryChanges.length||
      !Array.isArray(r.runtimeRecords)||owned.some(row=>row.metadataApprovalType!=='FINAL_QA'||
        row.metadataRevision!==`meta-foundation:${id}@${versions[0]}:exam-final_qa-v2:${r.requestId}`||
        r.runtimeRecords.filter(rt=>rt.questionUid===row.questionUid&&rt.metaFoundationPackId===id&&
          rt.metaFoundationPackVersion===versions[0]&&rt.metadataRevision===row.metadataRevision).length!==1))
      fail('exact registered binding lineage receipt required');
    const row={receipt:r,path:p,raw,version:versions[0],bindingChanges:[],companions:[]};
    // A prior-version provider is an already issued baseline authority, not a
    // new permission for its registry operations in the post-prior chain.
    if(v[2]===from[2]){baselineProviders.push(row);continue;}
    for(const c of r.registryChanges){
      if(c.path===bindingPath&&c.collection==='bindings'&&c.before===null&&
        same(Object.keys(c.match||{}).sort(),KEYS)&&c.after?.status==='ACTIVE'&&c.after.ownerPack===id&&
        KEYS.every(k=>typeof c.match[k]==='string'&&c.match[k]&&c.after[k]===c.match[k])){
        row.bindingChanges.push(c);continue;
      }
      const owner=c.after?.ownerPack,key=c.after?.templateKey,parentKey=c.after?.parentProblemTypeKey;
      if(c.collection!=='templates'||c.before!==null||!OWNER.test(owner||'')||owner===id||
        c.path!==`${CANON}/packs/${slug(owner)}/taxonomy.json`||!TEMPLATE.test(key||'')||
        !same(c.match,{templateKey:key})||c.after.status!=='ACTIVE')
        fail('only target bindings and exact cross-owner ACTIVE template additions can establish patch lineage');
      const authority=companionOwner(owner),templates=authority.docs.taxonomy.templates.filter(t=>t.templateKey===key),
        parents=authority.docs.taxonomy.problemTypes.filter(t=>t.problemTypeKey===parentKey),
        compiledTemplates=compiled.templates?.filter(t=>t.templateKey===key),compiledParents=compiled.problemTypes?.filter(t=>t.problemTypeKey===parentKey);
      if(templates.length!==1||!same(templates[0],c.after)||parents.length!==1||parents[0].status!=='ACTIVE'||
        parents[0].ownerPack!==owner||compiledTemplates?.length!==1||!same(compiledTemplates[0],c.after)||
        compiledParents?.length!==1||!same(compiledParents[0],parents[0])||
        !owned.some(record=>record.templateKey===key&&record.problemTypeKey===parentKey&&
          r.runtimeRecords.some(rt=>rt.questionUid===record.questionUid&&rt.templateKey===key&&rt.problemTypeKey===parentKey)&&
          r.registryChanges.some(b=>b.path===bindingPath&&b.collection==='bindings'&&
            KEYS.every(k=>same(b.after?.[k],record[k])))))
        fail('companion template must be exact current authority and an issued target binding application');
      const witness={owner,version:authority.docs.pack.packVersion,template:c.after,parent:parents[0]};
      companionRegistryAuthority(witness,registry);companionWitnesses.push(witness);row.companions.push(c);
    }
    if(!row.bindingChanges.length)fail('target add-only binding step required');
    if(candidates.has(v[2]))fail('ambiguous binding version provider');
    candidates.set(v[2],row);
    for(const owner of new Set(row.companions.map(c=>c.after.ownerPack)))companionOwners.get(owner).steps.push(row);
  }
  const beforePack=structuredClone(issuedPack),beforeBindings=structuredClone(issuedBindings),chain=[],states=new Map();
  states.set(sha(json(beforePack)),{patch:issued[2],bindingsSha256:sha(json(beforeBindings))});
  for(let patch=issued[2];patch>from[2];patch--){
    const row=candidates.get(patch);if(!row)fail('binding version step missing');
    const r=row.receipt,changes=row.bindingChanges;
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
  // Reproduce all companion outputs from one genuine earlier owner snapshot.
  // Intermediate versions in a writer batch need not be standalone commits;
  // each complete taxonomy/pack output must still match its issued digest.
  const companionAt=commit=>{
    const historicalIndex=JSON.parse(git('show',`${commit}:${CANON}/registry_index.json`));
    if(historicalIndex.status!=='ACTIVE')fail('companion historical index must be ACTIVE');
    for(const authority of companionOwners.values()){
      const docs={};
      for(const name of ['pack','taxonomy','bindings','aliases']){
        const p=`${authority.base}/${name}.json`,bytes=git('show',`${commit}:${p}`);docs[name]=JSON.parse(bytes);
        const refs=historicalIndex.canonicalSources?.filter(r=>r.path===p);
        if(refs?.length!==1||String(refs[0].sha256).replace(/^sha256:/,'')!==sha(bytes))
          fail('companion immutable canonical input digest mismatch');
      }
      ownerDocuments(docs,authority.owner);
      const entry=historicalIndex.activePacks?.filter(r=>r.id===authority.owner);
      if(entry?.length!==1||entry[0].status!=='ACTIVE'||entry[0].version!==docs.pack.packVersion)
        fail('companion immutable owner version mismatch');
      for(const row of [...authority.steps].sort((a,b)=>version(a.version)[2]-version(b.version)[2])){
        for(const c of row.companions.filter(c=>c.after.ownerPack===authority.owner)){
          const parents=docs.taxonomy.problemTypes.filter(p=>p.problemTypeKey===c.after.parentProblemTypeKey);
          if(docs.taxonomy.templates.some(t=>t.templateKey===c.after.templateKey)||parents.length!==1||
            !same(parents[0],registry.problemTypes.get(c.after.parentProblemTypeKey)))
            fail('companion immutable template absence or unchanged parent required');
          docs.taxonomy.templates.push(structuredClone(c.after));
        }
        docs.taxonomy.problemTypeCount=docs.taxonomy.problemTypes.length;
        docs.taxonomy.templateCount=docs.taxonomy.templates.length;
        Object.assign(docs.pack,{problemTypeCount:docs.taxonomy.problemTypes.length,templateCount:docs.taxonomy.templates.length,
          bindingCount:docs.bindings.bindings.length,aliasCount:docs.aliases.aliases.length});
        const v=version(docs.pack.packVersion);docs.pack.packVersion=`${v[0]}.${v[1]}.${v[2]+1}`;
        for(const name of ['pack','taxonomy'])if(sha(json(docs[name]))!==digestEntry(row.receipt,`${authority.base}/${name}.json`))
          fail('companion registered canonical output does not reproduce');
      }
    }
  };
  const authenticateRequest=(commit,row)=>{
    const r=row.receipt,requestPath=`.archive-meta-register/inbox/${r.requestId}.json`,request=JSON.parse(git('show',`${commit}:${requestPath}`));
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
  };
  // A same-version provider may establish a prior issued within a larger batch.
  // Its original published receipt and request remain separate from the actual
  // prior approval, which may itself be an ordinary or source-only receipt.
  const fromPackDigest=sha(json(beforePack)),fromBindingDigest=sha(json(beforeBindings));
  const providers=baselineProviders.filter(row=>digestEntry(row.receipt,packPath)===fromPackDigest&&
    digestEntry(row.receipt,bindingPath)===fromBindingDigest);
  if(providers.length>1)fail('ambiguous prior-version canonical output provider');
  const provider=providers[0],publishedCompanions=new Set();
  let priorAnchored=false,providerPublished=false,providerRequestAnchored=false,
    companionAnchored=companionOwners.size===0;const anchored=new Set(),batchAnchored=new Set();
  const requestsAnchored=()=>chain.every(row=>anchored.has(row.receipt.requestId)||
    providerPublished&&providerRequestAnchored&&batchAnchored.has(row.receipt.requestId));
  for(const commit of candidatesAt){
    try{
      const packBytes=git('show',`${commit}:${packPath}`),historicalPack=JSON.parse(packBytes),state=states.get(sha(packBytes));
      if(provider&&!providerRequestAnchored){
        const v=version(historicalPack.packVersion);
        if(historicalPack.packId===id&&historicalPack.ownerPack===id&&historicalPack.canonicalStatus==='ACTIVE'&&
          same(v.slice(0,2),from.slice(0,2))&&v[2]<from[2])try{
          authenticateRequest(commit,provider);providerRequestAnchored=true;
          // The first post-prior request can share the provider's pre-batch
          // input commit when the prior version itself was never persisted.
          // These anchors count only after that provider's exact published
          // output has established the reconstructed prior canonical state.
          for(const row of chain)try{authenticateRequest(commit,row);batchAnchored.add(row.receipt.requestId);}
          catch{/* Not every later batch request must already exist here. */}
        }catch{/* A different genuine pre-provider ancestor may contain its immutable request. */}
      }
      if(!state||sha(git('show',`${commit}:${bindingPath}`))!==state.bindingsSha256||
        sha(git('show',`${commit}:${base}/taxonomy.json`))!==sha(issuedTaxonomy)||
        sha(git('show',`${commit}:${base}/aliases.json`))!==sha(issuedAliases))continue;
      const priorPresent=()=>sha(git('show',`${commit}:${priorReceiptRef.path}`))===priorReceiptRef.sha256;
      if(state.patch===from[2]&&priorPresent())priorAnchored=true;
      if(provider&&state.patch>from[2]&&!providerPublished)try{
        if(priorPresent()&&sha(git('show',`${commit}:${provider.path}`))===sha(provider.raw)){
          if(sha(read(priorReceiptRef.path))!==priorReceiptRef.sha256)fail('current prior receipt raw differs from immutable authority');
          const publishedCompiled=JSON.parse(git('show',`${commit}:archive/data/meta-foundation/compiled/taxonomy_registry.json`));
          if(publishedCompiled.status!=='DERIVED_READ_ONLY'||publishedCompiled.sourcePacks?.filter(p=>
            p.packId===id&&p.version===`${from[0]}.${from[1]}.${state.patch}`).length!==1)
            fail('published higher pack snapshot compiled authority mismatch');
          selectedAuthority(current,registry,beforeBindings,bindings,publishedCompiled,compiled,id);providerPublished=true;
        }
      }catch{/* A published higher state must contain both exact original receipts and selected authority. */}
      for(const row of chain)if(row.companions.length&&state.patch>=version(row.version)[2])try{
        if(sha(git('show',`${commit}:${row.path}`))===sha(row.raw))publishedCompanions.add(row.receipt.requestId);
      }catch{/* A companion is accepted only with its exact official receipt on real ancestry. */}
      if(!companionAnchored&&[...companionOwners.values()].every(owner=>owner.steps.every(row=>state.patch<version(row.version)[2])))try{
        companionAt(commit);companionAnchored=true;
      }catch{/* Missing, modified or non-add-only companion outputs cannot establish this anchor. */}
      for(const row of chain){
        if(anchored.has(row.receipt.requestId)||version(row.version)[2]<=state.patch)continue;
        try{authenticateRequest(commit,row);anchored.add(row.receipt.requestId);}
        catch{/* This step may belong to a different immutable registration batch. */}
      }
      if((priorAnchored||providerPublished&&providerRequestAnchored)&&requestsAnchored()&&
        companionAnchored&&publishedCompanions.size===chain.filter(row=>row.companions.length).length)break;
    }catch{/* Actual ancestry, canonical bytes and original authority are mandatory; no missing-state fallback. */}
  }
  if(!(priorAnchored||providerPublished&&providerRequestAnchored)||!requestsAnchored())
    fail('complete binding lineage lacks immutable prior/request authority');
  if(!companionAnchored||publishedCompanions.size!==chain.filter(row=>row.companions.length).length)
    fail('complete companion transaction lacks immutable canonical and issued receipt authority');
  cache.set(key,{inputs:[...inputs],issuedBindings,bindings,issuedCompiled,compiled,companionWitnesses});return true;
}
