'use strict';
// Preserve an already imported M2-S2 vector. Source metadata is an opaque,
// byte-bound input: this module neither approves nor writes any metadata value.
const fs=require('node:fs');
const {execFileSync}=require('node:child_process');
const {compactItem}=require('./import-4slot.cjs');
const {buildLookup,validateData}=require('./validate-4slot.cjs');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const nativeAmendment=require('./m2s2-imported-native-vector-amendment.cjs');
const displayRepair=()=>require('./m2s2-exact-display-repair-closure.cjs');
const CARRIER_SCHEMA='m2-s2-imported-current-four-slot-continuity-v1';
const HOLD_SCHEMA='4slot-m2s2-imported-current-renderer-hold-v1';
const SCOPE='KEEP_EXACT_IMPORTED_M2S2_VECTOR_NO_METADATA_APPROVAL';
const GROUP='currentM2ImportedContinuity';
const REASON='SOURCE_RENDERER_CORRECTION_PENDING';
const ZERO=['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'];
const SOURCE=/^archive\/exams\/original\/middle\/m2\/2final\/.+\.js$/;
const COMPACT=/^archive\/data\/item-4slot\/original\/middle\/m2\/2final\/.+\.4slot\.json$/;
const NATIVE=/^archive-work\/4slot-annotate-v1\/out\/original\/middle\/m2\/2final\/.+\.4slot\.json$/;
const CARRIER_PATH=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-imported-four-slot-transport\.json$/;
const DOC=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const REQUEST=/^\.archive-meta-register\/inbox\/[A-Za-z0-9_.-]+\.json$/;
const ASSET=/^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const DICT=/^docs\/architecture\/4slot\/term-dictionary-v[0-9.]+\.json$/;
const GIT=/^[a-f0-9]{40}$/,SHA=/^[a-f0-9]{64}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const REF4=['commit','path','gitBlobSha1','sha256'];
const TUPLE=['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'];
const PRESENTATION=new Set(['image','imageAlt','imageSize','layoutTag','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize']);
const METADATA=new Set(['conditionKeys','crossConceptKeys','curriculum','decisiveStep','difficultyBoundaryFlag','difficultyBucket','difficultyConfidence','integrationPattern','legacyLevelCompatibility','primaryMethod','problemTypeKey','rpmL1','rpmL2','rpmL3','rpmL4','rpmPrimaryPath','standardUnit','standardUnitKey','subUnit','subUnitKey','templateKey']);
const OVERLAY=new Set(['courseKey','curriculumKey','crossConceptKeys']);
const own=(o,k)=>Object.hasOwn(o||{},k);
const has=d=>displayRepair().hasFor(d,'IMPORTED_NATIVE_AMENDMENT')||nativeAmendment.has(d)||own(d.evidence,GROUP)||(d.items||[]).some(i=>i.registrationHold?.schemaVersion===HOLD_SCHEMA||own(i.registrationHold,'m2ImportedCarrier'));
const inScope=d=>/^original\/middle\/m2\/2final\//.test(d.sourceArchiveFile||'');
const git=(root,args)=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});

// Only immutable claim discovery is cached per build. This is not an approval
// cache. Full HEAD ancestry retains the obligation after deletion or a merge.
function createObligationReader(root,{safe,sha,blob,stable}) {
  const successorObligation=nativeAmendment.createObligationReader(root,{safe,sha,blob,stable});
  let loaded=false,failed=false,claims=[];
  function load(){
    if(loaded)return;loaded=true;
    try{
      const head=git(root,['rev-parse','--verify','HEAD']).toString().trim();if(!GIT.test(head))throw Error('HEAD');
      const history=git(root,['log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/m2-imported-four-slot-transport.json']).toString().trim().split(/\s+/).filter(Boolean),seen=new Set();
      for(const c of new Set([head,...history])){
        const names=git(root,['ls-tree','-r','-z','--name-only',c,'--','docs/operations']).toString().split('\0').filter(p=>CARRIER_PATH.test(p));
        for(const p of names){
          safe(root,p);const raw=git(root,['show',c+':'+p]),digest=sha(raw),key=p+'#'+digest;if(seen.has(key))continue;seen.add(key);
          const x=JSON.parse(raw);if(x.schemaVersion!==CARRIER_SCHEMA)continue;
          if(x.scope!==SCOPE||ZERO.some(k=>x[k]!==0)||!SOURCE.test(x.sourceRef?.path||'')||x.sourceRef.path!=='archive/exams/'+x.sourceArchiveFile||!GIT.test(x.sourceRef.commit||'')||!Array.isArray(x.heldRows))throw Error('CLAIM');
          const source=git(root,['show',x.sourceRef.commit+':'+x.sourceRef.path]);if(sha(source)!==x.sourceRef.sha256||blob(source)!==x.sourceRef.gitBlobSha1)throw Error('SOURCE');
          for(const h of x.heldRows)if(!UID.test(h.questionUid||'')||!Number.isSafeInteger(h.sourceOrdinal)||!Number.isSafeInteger(h.ordinal)||typeof h.sourceQuestionNo!=='string')throw Error('HOLD');
          claims.push({sourceArchiveFile:x.sourceArchiveFile,heldRows:x.heldRows,path:p,sha256:digest});
        }
      }
    }catch{failed=true;}
  }
  const originalObligation=d=>{
    if(!inScope(d))return {errors:[],digest:null};load();
    if(failed)return {errors:['M2_IMPORTED_CONTINUITY_HISTORY_UNAVAILABLE'],digest:null};
    const found=claims.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile);if(!found.length)return {errors:[],digest:null};
    const held=(d.items||[]).map(i=>i.registrationHold).filter(h=>h?.schemaVersion===HOLD_SCHEMA);
    const covered=found.flatMap(x=>x.heldRows).every(r=>held.some(h=>TUPLE.every(k=>h[k]===r[k])));
    const successor=displayRepair().hasFor(d,'IMPORTED_NATIVE_AMENDMENT');
    return {required:true,errors:has(d)&&covered||successor?[]:['M2_IMPORTED_CONTINUITY_OBLIGATION_REQUIRED'],digest:sha(stable(found)),...(successor?{entries:found}:{})};
  };
  return d=>{const prior=originalObligation(d),next=successorObligation(d);return {required:prior.required||next.required||false,errors:[...prior.errors,...next.errors],digest:next.digest===null?prior.digest:sha(stable([prior.digest,next.digest])),...(displayRepair().hasFor(d,'IMPORTED_NATIVE_AMENDMENT')?{originalEntries:prior.entries||[],amendmentEntries:next.entries||[]}:{} )};};
}
function evidenceDigests(root,d,{safe,sha}){
  const out=nativeAmendment.evidenceDigests(root,d,{safe,sha});for(const r of Object.values(d.evidence?.[GROUP]||{}))if(r?.path){try{out[r.path]=sha(fs.readFileSync(safe(root,r.path)));}catch{out[r.path]=null;}}return out;
}
function validateLegacyFile(root,d,hp,historicalCommit=null,historicalReads=null){
  if(!has(d))return [];
  const {safe,sha,blob,stable,payloadHash,identityHash,assetRefs,loadBank,dictionary,identity,studentFields}=hp;
  const fail=s=>{throw Error('M2_IMPORTED_CONTINUITY_'+s);},same=(a,b)=>stable(a)===stable(b);
  const keys=(o,ks)=>{if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),[...ks].sort()))fail('FIELDS');};
  const zero=o=>{if(ZERO.some(k=>o[k]!==0))fail('NO_NEW_APPROVAL');};
  const changed=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const exactRef=(a,b)=>REF4.every(k=>a?.[k]===b?.[k]);
  const exactAssets=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&same(a.map(r=>stable(REF4.map(k=>r?.[k]))).sort(),b.map(r=>stable(REF4.map(k=>r?.[k]))).sort());
  const plain=r=>({commit:r.commit,path:r.path,sha256:r.sha256});
  // Only the closed literal-snapshot adapter below selects historical bytes.
  const localBytes=p=>{safe(root,p);const raw=historicalCommit?git(root,['show',historicalCommit+':'+p]):fs.readFileSync(safe(root,p));if(historicalReads&&DOC.test(p))historicalReads.set(p,{commit:historicalCommit,path:p,gitBlobSha1:blob(raw),sha256:sha(raw)});return raw;};
  function immutable(r,pattern,{local=false,full=false}={}){
    keys(r,full?REF4:['commit','path','sha256']);
    if(!GIT.test(r.commit||'')||!SHA.test(r.sha256||'')||!pattern.test(r.path||''))fail('REFERENCE');safe(root,r.path);
    let b;try{b=git(root,['show',r.commit+':'+r.path]);}catch{fail('IMMUTABLE_UNAVAILABLE');}
    if(sha(b)!==r.sha256||full&&blob(b)!==r.gitBlobSha1)fail('IMMUTABLE_BYTES');
    if(local){let live;try{live=localBytes(r.path);}catch{fail('LIVE_UNAVAILABLE');}if(!b.equals(live))fail('LIVE_BYTES');}
    return b;
  }
  function staticSvg(raw,depth=0){
    if(depth>6)fail('SVG_DEPTH');const s=raw.toString('utf8');
    if(/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet|<(?:[^\s<>/:]+:)?(?:script|foreignObject|iframe|animate(?:Motion|Transform)?|set|discard)\b|\son[a-z]+\s*=|javascript:|@import/i.test(s))fail('DYNAMIC_SVG');
    if(/@(?:-[a-z]+-)?keyframes\b|(?:^|[;{\s])(?:-[a-z]+-)?(?:animation|transition)(?:-[a-z-]+)?\s*:/i.test(s))fail('DYNAMIC_SVG');
    const css=[...s.matchAll(/<(?:[^\s<>/:]+:)?style\b[^>]*>([\s\S]*?)<\/(?:[^\s<>/:]+:)?style\s*>/gi)].map(m=>m[1]);css.push(...[...s.matchAll(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi)].map(m=>m[2]));
    if(css.some(c=>/[\\&]/.test(c)))fail('UNINSPECTED_CSS_ESCAPE');
    for(const m of s.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)){
      if(m[1].startsWith('#'))continue;const data=/^data:image\/(svg\+xml|png|jpeg|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/i.exec(m[1]);if(!data)fail('UNBOUND_SVG_DEPENDENCY');if(data[1].toLowerCase()==='svg+xml')staticSvg(Buffer.from(data[2],'base64'),depth+1);
    }
    for(const m of s.matchAll(/url\s*\(\s*["']?([^)'"\s]+)["']?\s*\)/gi))if(!m[1].startsWith('#'))fail('UNBOUND_SVG_DEPENDENCY');
  }
  function assets(refs,q,commit,{local=false,currentCommit=null}={}){
    if(!Array.isArray(refs)||!same(refs.map(r=>r.path).sort(),assetRefs(q)))fail('ASSET_COVERAGE');
    for(const r of refs){
      if(r.commit!==commit)fail('ASSET_COMMIT');const pr=Object.fromEntries(REF4.map(k=>[k,r[k]]));const raw=immutable(pr,ASSET,{full:true,local});
      if(currentCommit&&currentCommit!==commit){const now=git(root,['show',currentCommit+':'+r.path]);if(!raw.equals(now))fail('CURRENT_ASSET_BYTES');}
      if(local&&/\.svg$/i.test(r.path))staticSvg(raw);
    }
  }
  // Locate an actual, single static image token. A path in a comment, script,
  // quoted attribute or prose is not an image. No HTML decoding is inferred.
  function imageToken(content){
    const found=[];let i=0;
    while((i=content.indexOf('<',i))!==-1){
      if(content.startsWith('<!--',i)){const end=content.indexOf('-->',i+4);if(end===-1)fail('IMAGE_TOKEN');i=end+3;continue;}
      if(!/^<\/?[A-Za-z_\p{L}]/u.test(content.slice(i))){i++;continue;}
      let j=i+1,quote=null;
      for(;j<content.length;j++){const ch=content[j];if(quote){if(ch===quote)quote=null;}else if(ch==='"'||ch==="'")quote=ch;else if(ch==='>')break;}
      if(j===content.length)fail('IMAGE_TOKEN');
      const start=i,tag=content.slice(i,j+1);i=j+1;
      const name=/^<\/?([^\s<>/]+)(?=\s|\/?>)/u.exec(tag);if(!name)continue;
      const kind=name[1].toLowerCase(),localName=kind.split(':').at(-1);
      if(['script','style','template','textarea','title','xmp','iframe','noembed','noframes','noscript','plaintext','svg','math','foreignobject'].includes(localName))fail('IMAGE_TOKEN');
      if(kind!=='img'||tag.startsWith('</'))continue;
      const attrs=tag.slice(name[0].length,-1).replace(/\/\s*$/,'');let src=null;const seen=new Set();
      const rest=attrs.replace(/\s+([A-Za-z][A-Za-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,(_,key,a,b)=>{
        key=key.toLowerCase();const value=a??b;
        if(!['src','alt','style'].includes(key)||seen.has(key)||/[\\&<>\x00-\x1f]/.test(value))fail('IMAGE_TOKEN_ATTRIBUTES');seen.add(key);
        if(key==='src')src=value;
        if(key==='style'&&/url\s*\(|@|expression\s*\(|behavior\s*:|(?:^|[;\s])(?:-[a-z]+-)?(?:animation|transition)(?:-[a-z-]+)?\s*:/i.test(value))fail('IMAGE_TOKEN_ATTRIBUTES');
        return '';
      });
      if(rest.trim()||!src||/[%?#]/.test(src))fail('IMAGE_TOKEN_ATTRIBUTES');
      const asset='archive/'+src.replace(/^archive\//,'');if(!ASSET.test(asset))fail('IMAGE_TOKEN_ASSET');safe(root,asset);found.push({start,end:j+1,asset});
    }
    if(found.length!==1)fail('IMAGE_TOKEN');return found[0];
  }
  function presentation(a,b,fields,observation){
    if(fields.some(k=>!PRESENTATION.has(k)&&k!=='content'))fail('PRESENTATION_FIELDS');
    if(fields.includes('content')){
      if(typeof a.content!=='string'||typeof b.content!=='string')fail('PROTECTED_TEXT');
      if(b.content.startsWith(a.content)){
        const suffix=b.content.slice(a.content.length);if(!/^<br\s*\/?><img\b[^>]*>$/i.test(suffix))fail('PROTECTED_TEXT');
        const attrs=suffix.replace(/^<br\s*\/?><img\b/i,'').replace(/>$/,'');let src=null;const seen=new Set();
        const rest=attrs.replace(/\s+([A-Za-z][A-Za-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,(_,k,x,y)=>{k=k.toLowerCase();const v=x??y;if(!['src','alt','style'].includes(k)||seen.has(k))fail('PRESENTATION_HTML');seen.add(k);if(k==='src')src=v;if(k==='style'&&/[\\&]|url\s*\(|@import|expression\s*\(|behavior\s*:/i.test(v))fail('PRESENTATION_HTML');return '';});
        if(rest.trim()||!src||!ASSET.test('archive/'+src.replace(/^archive\//,'')))fail('PRESENTATION_HTML');
      }else{
        if(observation?.detail?.contentDeltaLimitedToImageMarkup!==true)fail('IMAGE_TOKEN_OBSERVATION');
        const old=imageToken(a.content),now=imageToken(b.content);
        if(a.content.slice(0,old.start)!==b.content.slice(0,now.start)||a.content.slice(old.end)!==b.content.slice(now.end))fail('PROTECTED_TEXT');
        if(!assetRefs(a).includes(old.asset)||!assetRefs(b).includes(now.asset))fail('IMAGE_TOKEN_ASSET');
      }
    }
    for(const k of fields.filter(k=>k!=='content')){
      if(b[k]!=null&&typeof b[k]!=='string')fail('PRESENTATION_TYPE');
      if(['image','solutionImage'].includes(k)&&b[k]!=null&&(!b[k]||!ASSET.test('archive/'+b[k].replace(/^archive\//,''))))fail('PRESENTATION_IMAGE');
      if(/Size$/.test(k)&&b[k]!=null&&!['small','medium','large','full','tall'].includes(b[k]))fail('PRESENTATION_SIZE');
      if(k==='layoutTag'&&!['fullwidth','grid','subjective-2up'].includes(b[k]))fail('PRESENTATION_LAYOUT');
    }
  }
  function delta(a,b,allowed){return changed(a,b).filter(k=>allowed.has(k)).map(field=>({field,beforePresent:own(a,field),afterPresent:own(b,field),beforeSha256:own(a,field)?sha(stable(a[field])):null,afterSha256:own(b,field)?sha(stable(b[field])):null}));}
  try{
    if(!inScope(d)||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(d,k)))fail('FULL_SCOPE');
    const group=d.evidence[GROUP];keys(group,['carrier','readInputs','observation','rootFollowup','importAuthority','metadataOverlayRequest']);
    const p=JSON.parse(immutable(group.carrier,CARRIER_PATH,{local:true}));
    keys(p,['schemaVersion','scope','transportAuthor','sourceArchiveFile','expectedQuestionCount','priorCompactRef','nativeSourceRef','priorSourceRef','observedSourceRef','sourceRef','dictionaryRef','nativeFourSlotRef','queueRef','importReviewRef','importOperatorRef','readInputsRef','observationRef','rootFollowupRef','importAuthorityRef','metadataOverlayRequestRef','metadataOverlayOriginalRef','metadataDelta','candidateMetadataDelta','retainedOrdinals','unchangedOrdinals','heldRows',...ZERO,'nextAction']);zero(p);
    if(p.schemaVersion!==CARRIER_SCHEMA||p.scope!==SCOPE||!p.transportAuthor||p.sourceArchiveFile!==d.sourceArchiveFile||typeof p.nextAction!=='string'||!p.nextAction.trim())fail('OPT_IN');
    for(const [a,b]of [['readInputs','readInputsRef'],['observation','observationRef'],['rootFollowup','rootFollowupRef'],['importAuthority','importAuthorityRef'],['metadataOverlayRequest','metadataOverlayRequestRef']])if(!same(group[a],p[b]))fail('EVIDENCE_LINK');
    const sp='archive/exams/'+d.sourceArchiveFile;
    if([p.nativeSourceRef,p.priorSourceRef,p.observedSourceRef,p.sourceRef].some(r=>r?.path!==sp)||p.priorCompactRef?.path!=='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json'))fail('SOURCE_PATH');
    const nativeBank=loadBank(immutable(p.nativeSourceRef,SOURCE,{full:true})),before=loadBank(immutable(p.priorSourceRef,SOURCE,{full:true})),observed=loadBank(immutable(p.observedSourceRef,SOURCE,{full:true})),bank=loadBank(immutable(p.sourceRef,SOURCE,{full:true,local:true}));
    const prior=JSON.parse(immutable(p.priorCompactRef,COMPACT,{full:true})),native=JSON.parse(immutable(p.nativeFourSlotRef,NATIVE)),dict=JSON.parse(immutable(p.dictionaryRef,DICT,{full:true,local:true}));
    const n=bank.length;if(!Number.isSafeInteger(p.expectedQuestionCount)||n!==p.expectedQuestionCount||[before,observed,nativeBank,prior.items,native.items,d.items].some(x=>!Array.isArray(x)||x.length!==n))fail('FULL_DENOMINATOR');
    if(prior.schemaVersion!=='archive-meta-4slot-compact-v1'||prior.sourceArchiveFile!==d.sourceArchiveFile||prior.sourceGitBlobSha!==p.priorSourceRef.gitBlobSha1||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(prior,k))||prior.items.some(i=>own(i,'registrationHold'))||own(prior.evidence,GROUP))fail('PRIOR_FULL_COMPACT');
    if(native.schemaVersion!=='archive-meta-4slot-v0'||native.sourceArchiveFile!==d.sourceArchiveFile||native.sourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||native.dictionaryVersion!==prior.dictionaryVersion||dict.dictionaryVersion!==d.dictionaryVersion||p.dictionaryRef.path!==dictionary.path||p.dictionaryRef.sha256!==dictionary.sha256)fail('NATIVE_DICTIONARY');
    if(p.nativeFourSlotRef.path!=='archive-work/4slot-annotate-v1/out/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json')||prior.evidence?.commit!==p.nativeFourSlotRef.commit||prior.evidence.path!==p.nativeFourSlotRef.path||prior.evidence.originalSha256!==p.nativeFourSlotRef.sha256)fail('NATIVE_AUTHORITY');
    const queue=JSON.parse(immutable(p.queueRef,/^archive-work\/4slot-annotate-v1\/QUEUE-original\.json$/)),review=JSON.parse(immutable(p.importReviewRef,/^tools\/4slot\/bulk-delta-overrides\.json$/));
    immutable(p.importOperatorRef,/^tools\/4slot\/publish-reviewed-bulk\.cjs$/);
    const qrows=(queue.list||[]).filter(x=>x.path===d.sourceArchiveFile),qr=qrows[0];
    if(qrows.length!==1||qr.blob!==native.sourceGitBlobSha||qr.items!==n||!Number.isSafeInteger(qr.order)||p.queueRef.commit!==p.nativeFourSlotRef.commit||p.nativeSourceRef.commit!==p.nativeFourSlotRef.commit||review.schemaVersion!=='four-slot-bulk-targeted-delta-review-v1'||review.authoringCommit!==p.nativeFourSlotRef.commit||review.baseMain!==p.priorSourceRef.commit||p.importOperatorRef.commit!==p.importReviewRef.commit)fail('IMPORT_AUTHORITY');
    const imp=prior.evidence.importDelta;if(imp?.baseSourceGitBlobSha!==native.sourceGitBlobSha||imp.authoringSnapshot!==review.authoringCommit||!same(plain(imp.reviewRecord),p.importReviewRef)||prior.reviewedBy.agent!==review.reviewer||prior.reviewedBy.independentFullExamReview!==false||!same(prior.reviewedBy.originalAuthor,native.judgedBy))fail('IMPORT_REVIEW');
    const authority=JSON.parse(immutable(group.importAuthority,DOC,{local:true}));
    const fullRef=r=>({...r,gitBlobSha1:blob(git(root,['show',r.commit+':'+r.path]))});
    if(authority.schemaVersion!=='m2s2-existing-import-authority-exact-join-v1'||!exactRef(authority.authoringQueueRef,fullRef(p.queueRef))||!exactRef(authority.existingImportReviewRef,fullRef(p.importReviewRef))||!exactRef(authority.existingOperatorRef,fullRef(p.importOperatorRef))||authority.newMathApprovals!==0)fail('IMPORT_JOIN');
    const selected=(authority.selectedSources||[]).filter(s=>s.queueRow?.path===d.sourceArchiveFile);if(selected.length!==1||!same(selected[0].queueRow,qr)||!exactRef(selected[0].compactRef,p.priorCompactRef)||!exactRef(selected[0].nativeAuthorityRef,fullRef(p.nativeFourSlotRef)))fail('IMPORT_JOIN');
    const rejectedPath='archive-work/4slot-annotate-v1/REVIEW-rejected.json';
    if(git(root,['ls-tree','-z','--name-only',p.nativeFourSlotRef.commit,'--',rejectedPath]).length){
      const rej=JSON.parse(git(root,['show',p.nativeFourSlotRef.commit+':'+rejectedPath])),list=Array.isArray(rej)?rej:(rej.rejected||rej.list||[]);
      if(!Array.isArray(list)||list.some(x=>x.path===d.sourceArchiveFile))fail('NATIVE_REJECTED');
    }
    const effective=structuredClone(native),ops=(review.operations||[]).filter(x=>x.order===qr.order);
    if(ops.length!==selected[0].selectedOperationCount)fail('IMPORT_OPERATION_COUNT');
    for(const op of ops){
      if(op.op!=='replaceQuote'||op.slot!=='method'||!Number.isSafeInteger(op.ordinal))fail('UNSUPPORTED_IMPORT_OPERATION');
      const rows=effective.items.filter(i=>Number(i.sourceOrdinal)===op.ordinal),entries=rows[0]?.slots?.[op.slot]?.filter(e=>e.term===op.term)||[];if(rows.length!==1||entries.length!==1)fail('IMPORT_OPERATION_TARGET');
      for(const k of ['quote','src','evidenceType','justification'])if(op[k]!=null)entries[0][k]=op[k];
    }
    const lut=buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
    const map=new Map(before.map((q,i)=>[String(i+1),{ordinal:sourceNumber(q)}]));
    const projected=effective.items.map(i=>compactItem(i,lut,map)).sort((a,b)=>a.ordinal-b.ordinal);
    if(!same(projected,prior.items)||!same(d.reviewedBy,prior.reviewedBy))fail('ORIGINAL_VECTOR');
    // The existing validator still checks every native quote/schema/term against
    // the current source. No quote fallback and no changed metadata approval.
    const validation=validateData(effective,{root,dict,lut});if(validation.fail.length)fail('NATIVE_VALIDATION');
    const inputs=JSON.parse(immutable(group.readInputs,DOC,{local:true})),raw=JSON.parse(immutable(group.observation,DOC,{local:true}));
    const srcs=(inputs.sources||[]).filter(s=>s.sourceArchiveFile===d.sourceArchiveFile),snapshot=srcs[0];
    if(inputs.schemaVersion!=='m2s2-four-source-current-continuity-read-inputs-v1'||srcs.length!==1||!Array.isArray(snapshot.rows)||snapshot.rows.length!==n||!exactRef(snapshot.priorSourceRef,p.priorSourceRef)||!exactRef(snapshot.currentSourceRef,p.observedSourceRef)||!exactRef(snapshot.compactRef,p.priorCompactRef)||!exactRef(snapshot.nativeAuthorityRef,fullRef(p.nativeFourSlotRef)))fail('RAW_INPUT_SCOPE');
    if(raw.schemaVersion!=='m2s2-existing-vector-actual-continuity-observations-v1'||raw.sourceArchiveFile!==d.sourceArchiveFile||!raw.reviewer||raw.reviewer===p.transportAuthor||!Number.isFinite(Date.parse(raw.reviewedAtUtc))||['sourceWrites','assetWrites','slotWrites','newMathApprovals','newDifficultyApprovals'].some(k=>raw[k]!==0)||raw.fullExamIndependentMathReview!==false||raw.originalEvidenceAndReviewerPreserved!==true||!exactRef(raw.priorSourceRef,p.priorSourceRef)||!exactRef(raw.currentSourceRef,p.observedSourceRef)||!exactRef(raw.priorCompactRef,p.priorCompactRef)||!exactRef(raw.nativeAuthorityRef,fullRef(p.nativeFourSlotRef))||!exactRef(raw.importDeltaReviewRef,fullRef(p.importReviewRef))||!Array.isArray(raw.rows))fail('RAW_OBSERVER_SCOPE');
    const ordered=a=>Array.isArray(a)&&a.every(x=>Number.isSafeInteger(x)&&x>0)&&new Set(a).size===a.length&&same(a,[...a].sort((x,y)=>x-y));
    if(!ordered(p.retainedOrdinals)||!ordered(p.unchangedOrdinals)||!Array.isArray(p.heldRows))fail('PARTITION');
    for(const h of p.heldRows)keys(h,TUPLE);
    const heldOrdinals=p.heldRows.map(x=>x.sourceOrdinal),all=[...p.retainedOrdinals,...p.unchangedOrdinals,...heldOrdinals].sort((a,b)=>a-b);
    if(!ordered(heldOrdinals)||!same(all,Array.from({length:n},(_,i)=>i+1))||!same(raw.rows.map(r=>r.sourceOrdinal).sort((a,b)=>a-b),[...p.retainedOrdinals,...heldOrdinals].sort((a,b)=>a-b)))fail('PARTITION');
    let rootReview=null;if(p.heldRows.length){
      rootReview=JSON.parse(immutable(group.rootFollowup,DOC,{local:true}));
      if(rootReview.schemaVersion!=='archive-middle-current-observer-root-followup-v1'||!rootReview.reviewer||rootReview.reviewer===p.transportAuthor||rootReview.reviewer===raw.reviewer||rootReview.newMathematicalQa!==false||['newMetadataApprovals','newDifficultyJudgments','sourceWrites','assetWrites','slotWrites'].some(k=>rootReview[k]!==0)||rootReview.browserStatus!=='NOT_RUN')fail('ROOT_SCOPE');
      const negatives=rootReview.rows.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile&&r.decision==='WITHHOLD_CURRENT_RENDERER');if(!same(negatives.map(r=>r.questionUid).sort(),p.heldRows.map(r=>r.questionUid).sort()))fail('ROOT_HOLD_COVERAGE');
    }else if(group.rootFollowup!==null)fail('UNNEEDED_ROOT_CLAIM');
    let overlay=null;const candidateChanges=[];for(let i=0;i<n;i++){const fields=changed(observed[i],bank[i]);if(fields.length){if(fields.some(k=>!OVERLAY.has(k))||payloadHash(observed[i])!==payloadHash(bank[i]))fail('CANDIDATE_OVERLAY_FIELDS');candidateChanges.push({sourceOrdinal:i+1,fields:delta(observed[i],bank[i],OVERLAY)});}}
    if(!same(p.candidateMetadataDelta,candidateChanges))fail('CANDIDATE_OVERLAY_DIGEST');
    if(candidateChanges.length){
      // The inbox is consumed by the metadata writer. Retain a durable exact
      // copy while replaying its immutable original bytes on every validation.
      const frozenRequest=immutable(group.metadataOverlayRequest,DOC,{local:true});
      const originalRequest=immutable(p.metadataOverlayOriginalRef,REQUEST);
      if(!frozenRequest.equals(originalRequest))fail('OVERLAY_ORIGINAL_BYTES');
      overlay=JSON.parse(frozenRequest);
      if(overlay.schemaVersion!=='archive-reviewed-exam-meta-register-request-v2'||overlay.scope!=='PARTIAL_UIDS'||overlay.sourceArchiveFile!==d.sourceArchiveFile||overlay.expectedQuestionCount!==n||overlay.expectedSourceBlobSha1!==p.sourceRef.gitBlobSha1||overlay.approval?.type!=='FINAL_QA'||overlay.approval.metadataReviewed!==true||!Array.isArray(overlay.items))fail('OVERLAY_REQUEST_BINDING');
      if(!same(overlay.items.map(x=>x.sourceOrdinal).sort((a,b)=>a-b),candidateChanges.map(x=>x.sourceOrdinal)))fail('OVERLAY_REQUEST_SCOPE');
    }else if(group.metadataOverlayRequest!==null||p.metadataOverlayOriginalRef!==null)fail('UNNEEDED_OVERLAY');
    const metadataDelta=[];
    for(let i=0;i<n;i++){
      const a=before[i],o=observed[i],q=bank[i],ord=i+1,number=sourceNumber(q),item=prior.items.find(x=>x.ordinal===number),rows=snapshot.rows.filter(r=>r.sourceOrdinal===ord),s=rows[0],ids=(identity.records||[]).filter(r=>r.sourceArchiveFile===d.sourceArchiveFile&&r.sourceOrdinal===ord),id=ids[0];
      if(rows.length!==1||ids.length!==1||!UID.test(id?.questionUid||'')||s.questionUid!==id.questionUid||s.compactOrdinal!==number||String(id.sourceQuestionNo)!==sourceIdentityNumber(q)||sourceNumber(a)!==number||sourceNumber(o)!==number||!item)fail('IDENTITY');
      const tuple={questionUid:id.questionUid,sourceOrdinal:ord,sourceQuestionNo:sourceIdentityNumber(q),ordinal:number};
      if(s.priorWholeQuestionSha256!==sha(stable(a))||s.currentWholeQuestionSha256!==sha(stable(o))||s.priorStudentPayloadSha256!==payloadHash(a)||s.currentStudentPayloadSha256!==payloadHash(o)||!same(s.frozenItem,item)||s.frozenItemSha256!==sha(stable(item)))fail('RAW_INPUT_ROW');
      const fields=changed(a,o);if(!same(fields,s.changedFields)||fields.some(k=>!PRESENTATION.has(k)&&k!=='content'&&!METADATA.has(k)))fail('SOURCE_FIELD_SCOPE');
      const md=delta(a,o,METADATA);if(md.length)metadataDelta.push({sourceOrdinal:ord,fields:md});
      presentation(a,o,fields.filter(k=>!METADATA.has(k)),raw.rows.find(r=>r.sourceOrdinal===ord));
      for(const k of studentFields.filter(k=>!['image','solutionImage','content'].includes(k)))if(!same(a[k],o[k]))fail('PROTECTED_STUDENT');
      assets(s.priorAssets,a,p.priorSourceRef.commit);assets(s.currentAssets,o,p.observedSourceRef.commit,{local:true,currentCommit:p.sourceRef.commit});
      if(overlay){const os=overlay.items.filter(r=>r.sourceOrdinal===ord);if(os.length){if(os.length!==1||os[0].questionUid!==id.questionUid)fail('OVERLAY_IDENTITY');for(const k of changed(o,q))if(!own(os[0].after,k)||!same(q[k],os[0].after[k]))fail('OVERLAY_EXISTING_VALUE');}}
      const held=p.heldRows.find(h=>h.sourceOrdinal===ord),untouched=p.unchangedOrdinals.includes(ord),actual=raw.rows.filter(r=>r.sourceOrdinal===ord);
      if(untouched){if(actual.length||s.selectedForActualRead!==false||payloadHash(a)!==payloadHash(o)||!same(s.priorAssets.map(r=>[r.path,r.sha256]).sort(),s.currentAssets.map(r=>[r.path,r.sha256]).sort()))fail('UNTOUCHED_CHANGED');}
      else{
        const r=actual[0];if(actual.length!==1||s.selectedForActualRead!==true||r.questionUid!==id.questionUid||r.compactOrdinal!==number||r.priorWholeQuestionSha256!==s.priorWholeQuestionSha256||r.currentWholeQuestionSha256!==s.currentWholeQuestionSha256||r.priorStudentPayloadSha256!==s.priorStudentPayloadSha256||r.currentStudentPayloadSha256!==s.currentStudentPayloadSha256||!same(r.frozenItem,item)||r.frozenItemSha256!==s.frozenItemSha256||!same(r.changedFields,fields)||!exactAssets(r.priorAssets,s.priorAssets)||!exactAssets(r.currentAssets,s.currentAssets))fail('RAW_OBSERVATION_ROW');
        if(['existingFourSlotsAllRead','currentStemChoicesAnswerSolutionActuallyRead','originalNativeRowActuallyRead'].some(k=>r[k]!==true)||r.actualChromeInspectionByThisReviewer!==false||r.actualPriorAssetInspection!==(s.priorAssets.length>0)||r.actualCurrentAssetInspection!==(s.currentAssets.length>0)||typeof r.observation!=='string'||!r.observation.trim()||!SHA.test(r.cardRef?.sha256||'')||['newSlotValues','newMathApproval','newDifficultyApproval','sourceMutation','assetMutation'].some(k=>r[k]!==0))fail('ACTUAL_OBSERVATION');
        if(held){
          if(!same(held,tuple)||r.decision!=='HOLD_CURRENT_RENDERER')fail('HOLD_OBSERVER');
          const rr=rootReview.rows.filter(x=>x.sourceArchiveFile===d.sourceArchiveFile&&x.questionUid===id.questionUid&&x.sourceOrdinal===ord);const h=rr[0];
          if(rr.length!==1||h.decision!=='WITHHOLD_CURRENT_RENDERER'||h.choiceAnswerSolutionUnchanged!==true||h.nativeProjectionExact!==true||h.fullSourceDenominator!==n||h.priorWholeQuestionSha256!==s.priorWholeQuestionSha256||h.currentWholeQuestionSha256!==s.currentWholeQuestionSha256||h.frozenVectorSha256!==s.frozenItemSha256||!exactRef(h.priorSourceRef,p.priorSourceRef)||!exactRef(h.observerCurrentSourceRef,p.observedSourceRef)||!exactRef(h.compactRef,p.priorCompactRef)||!exactRef(h.nativeAuthorityRef,fullRef(p.nativeFourSlotRef))||!exactAssets(h.priorAssets,s.priorAssets)||!exactAssets(h.currentAssets,s.currentAssets)||h.card?.sha256!==r.cardRef.sha256||h.card.actuallyViewed!==true||!h.reasonCode||!h.observation||['fullStem','choices','solutionText','nativeFourSlots'].some(k=>h.inspected?.[k]!==true))fail('ROOT_HOLD');
          const rootSource=immutable(Object.fromEntries(REF4.map(k=>[k,h.currentSourceRef?.[k]])),SOURCE,{full:true});
          if(h.currentSourceRef.path!==sp||!same(loadBank(rootSource),observed))fail('ROOT_SOURCE');
        }else{
          const existingQuoteAmendment=ops.some(op=>op.ordinal===ord);
          const boundary=existingQuoteAmendment?'EXISTING_IMPORT_QUOTE_AMENDMENT_RETAINED':null;
          if(r.decision!=='RETAIN_EXISTING_VECTOR'||(r.specialBoundary??null)!==boundary)fail('ORDINARY_ONLY');
        }
      }
      const now=d.items.find(x=>x.ordinal===number),expected=structuredClone(item);
      if(held)expected.registrationHold={schemaVersion:HOLD_SCHEMA,reason:REASON,...tuple,sourceGitBlobSha:p.sourceRef.gitBlobSha1,wholeQuestionSha256:sha(stable(q)),studentPayloadSha256:payloadHash(q),sourceFingerprint:identityHash(q),m2ImportedCarrier:group.carrier,m2ImportedObservation:group.observation,m2ImportedRootFollowup:group.rootFollowup,nextAction:p.nextAction};
      if(!same(now,expected))fail('EXACT_ITEM');
    }
    if(!same(metadataDelta,p.metadataDelta))fail('METADATA_DELTA_BINDING');
    const expected=structuredClone(prior);expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;expected.evidence[GROUP]=group;expected.items=d.items;
    if(!same(expected,d))fail('EXACT_COMPACT');
    return [];
  }catch(e){return [String(e.message).startsWith('M2_IMPORTED_CONTINUITY_')?e.message:'M2_IMPORTED_CONTINUITY_INVALID'];}
}
// Historical evidence is a literal immutable compact plus its complete original
// contract. It cannot independently authorize the current source.
function validateHistoricalFile(root,reference,hp){
  try{
    const {safe,sha,blob,stable}=hp;
    if(!reference||stable(Object.keys(reference).sort())!==stable([...REF4].sort())||!GIT.test(reference.commit||'')||!SHA.test(reference.sha256||'')||!GIT.test(reference.gitBlobSha1||'')||!COMPACT.test(reference.path||''))throw Error('REFERENCE');
    safe(root,reference.path);const raw=git(root,['show',reference.commit+':'+reference.path]);
    if(sha(raw)!==reference.sha256||blob(raw)!==reference.gitBlobSha1)throw Error('BYTES');
    const document=JSON.parse(raw);
    if(Object.hasOwn(document.evidence||{},'currentM2DisplayRepairClosure'))throw Error('NOT_ORIGINAL');
    if(nativeAmendment.has(document))return nativeAmendment.validateHistoricalFile(root,reference,hp,validateHistoricalFile);
    if(!Object.hasOwn(document.evidence||{},GROUP))throw Error('ORIGINAL_REQUIRED');
    const reads=new Map(),errors=validateLegacyFile(root,document,hp,reference.commit,reads);
    return {errors,document,requiredLiveEvidence:[...reads.values()].sort((a,b)=>a.path.localeCompare(b.path,'en'))};
  }catch{return {errors:['M2_IMPORTED_CONTINUITY_HISTORICAL_INPUT_INVALID'],document:null,requiredLiveEvidence:[]};}
}
function validateFile(root,d,hp){
  if(displayRepair().has(d))return displayRepair().validateFile(root,d,hp,validateHistoricalFile);
  if(nativeAmendment.has(d))return nativeAmendment.validateFile(root,d,hp,validateFile);
  return validateLegacyFile(root,d,hp);
}
module.exports={CARRIER_SCHEMA,HOLD_SCHEMA,SCOPE,GROUP,REASON,ZERO,METADATA,OVERLAY,has,createObligationReader,evidenceDigests,validateFile,validateHistoricalFile};
