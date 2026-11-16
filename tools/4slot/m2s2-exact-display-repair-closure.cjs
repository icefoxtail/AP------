'use strict';
// Explicit display repairs succeed an actually replayed negative history. This
// contract never promotes an ordinary positive renderer observation to a release.
const fs=require('node:fs');
const vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const GROUP='currentM2DisplayRepairClosure';
const SCHEMA='m2-s2-exact-display-repair-closure-v1';
const SCOPE='EXACT_EXISTING_NEGATIVE_DISPLAY_REPAIR_ONLY';
const BINDING_SCHEMA='m2-exact-display-repair-observation-binding-v1';
const ORIGINS=['CURRENT_V1','IMPORTED_NATIVE_AMENDMENT'];
const KINDS=['NATIVE_PROBLEM_DISPLAY_RESTORE','NATIVE_PROBLEM_AND_SOLUTION_DISPLAY_RESTORE','DERIVED_FOUR_MARKER_CLARIFICATION'];
const ZERO=['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'];
const REF3=['commit','path','sha256'],REF4=['commit','path','gitBlobSha1','sha256'];
const TUPLE=['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'];
const SHA=/^[a-f0-9]{64}$/,GIT=/^[a-f0-9]{40}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const DOC=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const CARRIER=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-current-display-repair-closure\.json$/;
const BINDING=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-display-repair-observation-binding\.json$/;
const SOURCE=/^archive\/exams\/original\/middle\/m2\/2(?:mid|final)\/[^/]+\.js$/;
const COMPACT=/^archive\/data\/item-4slot\/original\/middle\/m2\/2(?:mid|final)\/[^/]+\.4slot\.json$/;
const ASSET=/^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const CAPTURE=/^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.png$/;
const NATIVE=/^archive\/data\/meta-review\/m2-s2-20261114\/exams\/E\d{3}\/(?:four-slot|review|root-acceptance|independent-sample)\.json$/;
const own=(o,k)=>Object.hasOwn(o||{},k);
const has=d=>own(d.evidence,GROUP);
const hasFor=(d,origin)=>has(d)&&d.evidence[GROUP]?.origin===origin;
const git=(root,...args)=>execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});
const ref3=r=>Object.fromEntries(REF3.map(k=>[k,r?.[k]]));
const ref4=r=>Object.fromEntries(REF4.map(k=>[k,r?.[k]]));
const withoutHold=x=>Object.fromEntries(Object.entries(x).filter(([k])=>k!=='registrationHold'));

// Only immutable inventory is reused within a build. Every proof, source and
// asset is read and checked again by validateFile before runtime cache reuse.
function createObligationReader(root,{safe,sha,blob,stable}){
  let loaded=false,failed=false,claims=[];
  function load(){
    if(loaded)return;loaded=true;
    try{
      const head=git(root,'rev-parse','--verify','HEAD').toString().trim();if(!GIT.test(head))throw Error('HEAD');
      const history=git(root,'log','--full-history','--format=%H',head,'--',':(glob)docs/operations/**/m2-current-display-repair-closure.json').toString().trim().split(/\s+/).filter(Boolean),seen=new Set();
      for(const commit of new Set([head,...history]))for(const path of git(root,'ls-tree','-r','-z','--name-only',commit,'--','docs/operations').toString().split('\0').filter(p=>CARRIER.test(p))){
        safe(root,path);const raw=git(root,'show',commit+':'+path),digest=sha(raw),key=path+'#'+digest;if(seen.has(key))continue;seen.add(key);
        const p=JSON.parse(raw);if(p.schemaVersion!==SCHEMA)continue;
        if(p.scope!==SCOPE||!ORIGINS.includes(p.origin)||!KINDS.includes(p.kind)||ZERO.some(k=>p[k]!==0)||!SOURCE.test(p.sourceRef?.path||'')||p.sourceRef.path!=='archive/exams/'+p.sourceArchiveFile||!UID.test(p.selected?.questionUid||'')||!SHA.test(p.fullItemsSha256||''))throw Error('CLAIM');
        const b=git(root,'show',p.sourceRef.commit+':'+p.sourceRef.path);if(sha(b)!==p.sourceRef.sha256||blob(b)!==p.sourceRef.gitBlobSha1)throw Error('SOURCE');
        claims.push({sourceArchiveFile:p.sourceArchiveFile,path,sha256:digest,origin:p.origin,selected:p.selected,fullItemsSha256:p.fullItemsSha256});
      }
    }catch{failed=true;}
  }
  return d=>{
    if(!/^original\/middle\/m2\/2(?:mid|final)\//.test(d.sourceArchiveFile||''))return {required:false,errors:[],digest:null};load();
    if(failed)return {required:true,errors:['M2_DISPLAY_REPAIR_HISTORY_UNAVAILABLE'],digest:null};
    const entries=claims.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile);if(!entries.length)return {required:false,errors:[],digest:null};
    const covered=entries.every(r=>hasFor(d,r.origin)&&sha(stable((d.items||[]).map(withoutHold)))===r.fullItemsSha256);
    return {required:true,entries,errors:covered?[]:['M2_DISPLAY_REPAIR_OBLIGATION_REQUIRED'],digest:sha(stable(entries))};
  };
}

function evidenceDigests(root,d,{safe,sha}){
  if(!has(d))return {};
  const out={},queue=[d.evidence[GROUP]?.carrier,d.evidence[GROUP]?.observationBinding],seen=new Set();
  for(let i=0;i<queue.length;i++){
    const r=queue[i];if(!r?.path||seen.has(r.path))continue;seen.add(r.path);
    try{
      const b=fs.readFileSync(safe(root,r.path));out[r.path]=sha(b);
      if(!DOC.test(r.path))continue;
      const p=JSON.parse(b);
      if(p.schemaVersion===SCHEMA){queue.push(p.observationBindingRef,...(p.historicalEvidenceRefs||[]));}
      if(p.schemaVersion===BINDING_SCHEMA){queue.push(p.rootObservationRef,p.candidateReportRef,p.mechanicalReadRef,p.imageXmlReadRef,p.independentObservationRef,...(p.actualImageRefs||[]));}
    }catch{out[r.path]=null;}
  }
  return out;
}

function validateFile(root,d,hp,replayHistorical){
  const {safe,sha,blob,stable,payloadHash,assetRefs,loadBank,identity}=hp;
  const fail=s=>{throw Error('M2_DISPLAY_REPAIR_'+s);},same=(a,b)=>stable(a)===stable(b);
  const keys=(x,ks)=>{if(!x||typeof x!=='object'||Array.isArray(x)||!same(Object.keys(x).sort(),[...ks].sort()))fail('FIELDS');};
  const changes=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const rawLive=p=>{const f=safe(root,p),s=fs.lstatSync(f);if(!s.isFile()||s.isSymbolicLink())fail('LIVE_REGULAR_FILE');return fs.readFileSync(f);};
  function rawAt(commit,path){
    if(!GIT.test(commit||''))fail('COMMIT');safe(root,path);
    const m=/^(100644|100755) blob ([a-f0-9]{40})\t([^\0]+)\0$/.exec(git(root,'ls-tree','-z','--full-tree',commit,'--',path).toString());
    if(!m||m[3]!==path)fail('IMMUTABLE_REGULAR_FILE');const b=git(root,'show',commit+':'+path);if(blob(b)!==m[2])fail('IMMUTABLE_BLOB');return b;
  }
  function read(r,pattern,{full=false,live=false,ancestor=false}={}){
    keys(r,full?REF4:REF3);if(!SHA.test(r.sha256||'')||!pattern.test(r.path||''))fail('REFERENCE');
    if(ancestor){try{git(root,'merge-base','--is-ancestor',r.commit,'HEAD');}catch{fail('UNMERGED_REFERENCE');}}
    const b=rawAt(r.commit,r.path);if(sha(b)!==r.sha256||full&&(!GIT.test(r.gitBlobSha1||'')||blob(b)!==r.gitBlobSha1))fail('IMMUTABLE_BYTES');
    if(live&&!rawLive(r.path).equals(b))fail('LIVE_BYTES');return b;
  }
  const doc=(r,pattern,o)=>JSON.parse(read(r,pattern,o));
  const sameBytesRef=(a,b)=>['path','sha256','gitBlobSha1'].every(k=>a?.[k]===b?.[k]);
  const pick=(rows,predicate,label)=>{const r=(rows||[]).filter(predicate);if(r.length!==1)fail(label);return r[0];};
  const nodeAttrs=tag=>{
    const name=/^<([A-Za-z][A-Za-z0-9:-]*)\b/.exec(tag)?.[1];if(!name)fail('XML_TOKEN');
    const rest=tag.slice(name.length+1).replace(/\/?\s*>$/,'');const attrs={};let end=0;
    const re=/\s+([A-Za-z_:][A-Za-z0-9_.:-]*)\s*=\s*(["'])([^<>&]*?)\2/g;let m;
    while((m=re.exec(rest))){if(rest.slice(end,m.index).trim()||own(attrs,m[1]))fail('XML_ATTRIBUTE');attrs[m[1]]=m[3];end=re.lastIndex;}
    if(rest.slice(end).trim())fail('XML_ATTRIBUTE');return {name,attrs};
  };
  function staticSvg(raw){
    const text=raw.toString('utf8');
    if(!text.includes('http://www.w3.org/2000/svg')||/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet|<(?:[^\s<>/:]+:)?(?:script|foreignObject|iframe|animate(?:Color|Motion|Transform)?|set|discard)\b|\son[a-z]+\s*=|xml:base\s*=|javascript:|@import/i.test(text))fail('DYNAMIC_SVG');
    const css=[...text.matchAll(/<(?:[^\s<>/:]+:)?style\b[^>]*>([\s\S]*?)<\/(?:[^\s<>/:]+:)?style\s*>/gi)].map(m=>m[1]);css.push(...[...text.matchAll(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi)].map(m=>m[2]));
    if(css.some(s=>/[\\&]/.test(s)||/@(?:-[a-z]+-)?keyframes\b|(?:^|[;{\s])(?:-[a-z]+-)?(?:animation|transition)(?:-[a-z-]+)?\s*:/i.test(s)))fail('DYNAMIC_CSS');
    for(const m of text.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi))if(!m[1].startsWith('#')&&!/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=\s]+$/i.test(m[1]))fail('SVG_DEPENDENCY');
    for(const m of text.matchAll(/url\s*\(\s*["']?([^)'"\s]+)["']?\s*\)/gi))if(!m[1].startsWith('#'))fail('SVG_DEPENDENCY');
  }
  function selectedSpan(raw,q){
    const text=raw.toString('utf8');if(!Buffer.from(text).equals(raw))fail('SOURCE_ENCODING');
    const stack=[],found=[];let quote=null,comment=null,escape=false;
    for(let i=0;i<text.length;i++){
      const ch=text[i],next=text[i+1];if(comment==='line'){if(ch==='\n')comment=null;continue;}if(comment==='block'){if(ch==='*'&&next==='/'){comment=null;i++;}continue;}
      if(quote){if(escape){escape=false;continue;}if(ch==='\\'){escape=true;continue;}if(ch===quote)quote=null;continue;}
      if(ch==='/'&&next==='/'){comment='line';i++;continue;}if(ch==='/'&&next==='*'){comment='block';i++;continue;}
      if(['"',"'",'`'].includes(ch)){quote=ch;continue;}if(ch==='{')stack.push(i);
      if(ch==='}'){const start=stack.pop();if(start==null)fail('SOURCE_OBJECT');const token=text.slice(start,i+1);if(!/(?:^|[,{]\s*)(?:id|["']id["'])\s*:/.test(token))continue;try{if(same(vm.runInNewContext('('+token+')',Object.create(null),{timeout:100}),q))found.push([start,i+1]);}catch{}}
    }
    if(found.length!==1||stack.length||quote||comment==='block')fail('SOURCE_OBJECT');return {text,start:found[0][0],end:found[0][1]};
  }
  function inlineAltOnly(old,next,native,assetPath){
    const extract=text=>{
      if(typeof text!=='string'||!text.startsWith(native)||/<!--|<!\[CDATA\[|<(?:script|style|textarea|title|iframe|xmp|plaintext)\b/i.test(text))fail('INLINE_IMAGE');
      const tags=[...text.matchAll(/<[^<>"']*(?:"[^"<>]*"|'[^'<>]*')*[^<>]*>/g)].filter(m=>/^<img(?=\s|\/?>)/i.test(m[0]));if(tags.length!==1)fail('INLINE_IMAGE');
      const m=tags[0],v=nodeAttrs(m[0]);if(v.name!=='img'||!own(v.attrs,'alt')||!own(v.attrs,'src')||Object.keys(v.attrs).some(k=>!['src','alt','style'].includes(k)))fail('INLINE_IMAGE');
      if('archive/'+v.attrs.src.replace(/^archive\//,'')!==assetPath)fail('INLINE_IMAGE');return {m,attrs:v.attrs};
    };
    const a=extract(old),b=extract(next);
    if(!same(changes(a.attrs,b.attrs),['alt'])||old.slice(0,a.m.index)!==next.slice(0,b.m.index)||old.slice(a.m.index+a.m[0].length)!==next.slice(b.m.index+b.m[0].length))fail('INLINE_ALT_ONLY');
  }
  function fourMarkerDelta(oldRaw,newRaw,report){
    staticSvg(oldRaw);staticSvg(newRaw);
    const a=oldRaw.toString('utf8'),b=newRaw.toString('utf8');if(/<!--|<!\[CDATA\[|<\?/.test(a+b))fail('SVG_TOKEN_SCOPE');
    const tokens=text=>[...text.matchAll(/<[^<>"']*(?:"[^"<>]*"|'[^'<>]*')*[^<>]*>/g)];
    const lines=tokens(a).filter(m=>/^<line\s/.test(m[0])).map(m=>({token:m[0],attrs:nodeAttrs(m[0]).attrs}));
    if(report.removedCount!==4||report.onlyOtherXmlChange!=='desc text'||report.remainingNamespaceExpandedTagsAllAttributesTextAndChildOrderExact!==true||report.retainedPurpleDoubleTickStrokeCount!==4||report.retainedPurpleDoubleTickAttributesExact!==true||!Array.isArray(report.removedElements)||report.removedElements.length!==4)fail('XML_OBSERVATION');
    let stripped=a;const seen=new Set();
    for(const r of report.removedElements){keys(r,['tag','attributes']);keys(r.attributes,['x1','y1','x2','y2','stroke','stroke-width','stroke-linecap']);if(r.tag!=='{http://www.w3.org/2000/svg}line'||r.attributes.stroke!=='#205d9c'||r.attributes['stroke-width']!=='2.5'||r.attributes['stroke-linecap']!=='round'||['x1','y1','x2','y2'].some(k=>!Number.isFinite(Number(r.attributes[k]))))fail('REMOVED_MARKER');const hit=lines.filter(x=>same(x.attrs,r.attributes));if(hit.length!==1||seen.has(hit[0].token))fail('REMOVED_MARKER');seen.add(hit[0].token);stripped=stripped.replace(hit[0].token,'');}
    const desc=text=>[...text.matchAll(/<desc(?:\s+[^<>]*)?>[^<>]*<\/desc>/g)];const da=desc(stripped),db=desc(b);if(da.length!==1||db.length!==1||da[0][0]===db[0][0]||!same(nodeAttrs(da[0][0].slice(0,da[0][0].indexOf('>')+1)),nodeAttrs(db[0][0].slice(0,db[0][0].indexOf('>')+1))))fail('DESCRIPTION');
    if(stripped.slice(0,da[0].index)+db[0][0]+stripped.slice(da[0].index+da[0][0].length)!==b)fail('EXTRA_XML_CHANGE');
    const purple=text=>tokens(text).filter(m=>/^<line\s/.test(m[0])).map(m=>nodeAttrs(m[0]).attrs).filter(x=>x.stroke==='#704895');
    if(purple(a).length!==4||!same(purple(a),purple(b)))fail('RETAINED_MARKERS');
  }
  try{
    const group=d.evidence?.[GROUP];keys(group,['origin','carrier','observationBinding']);if(!ORIGINS.includes(group.origin))fail('ORIGIN');
    const p=doc(group.carrier,CARRIER,{live:true,ancestor:true});
    keys(p,['schemaVersion','scope','origin','kind','transportAuthor','examId','sourceArchiveFile','expectedQuestionCount','historicalCompactRef','sourceRef','observationBindingRef','historicalEvidenceRefs','selected','currentAssets','fullItemsSha256',...ZERO]);
    if(p.schemaVersion!==SCHEMA||p.scope!==SCOPE||p.origin!==group.origin||!KINDS.includes(p.kind)||!p.transportAuthor||!/^E\d{3}$/.test(p.examId||'')||p.sourceArchiveFile!==d.sourceArchiveFile||!same(p.observationBindingRef,group.observationBinding)||ZERO.some(k=>p[k]!==0))fail('SCOPE');
    const s=p.selected;keys(s,TUPLE);if(!UID.test(s.questionUid||'')||!Number.isSafeInteger(s.sourceOrdinal)||s.sourceOrdinal<1||!Number.isSafeInteger(s.ordinal)||s.ordinal<1||typeof s.sourceQuestionNo!=='string')fail('SELECTED');
    const sp='archive/exams/'+d.sourceArchiveFile,cp='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json');if(p.sourceRef?.path!==sp||p.historicalCompactRef?.path!==cp)fail('PATH');
    const replay=replayHistorical(root,p.historicalCompactRef,hp);if(replay.errors.length)fail('HISTORICAL_CHAIN:'+replay.errors.join('|'));
    const prior=replay.document;if(prior.sourceArchiveFile!==d.sourceArchiveFile||has(prior))fail('HISTORICAL_COMPACT');
    const imported=p.origin==='IMPORTED_NATIVE_AMENDMENT',oldGroup=prior.evidence?.[imported?'currentM2ImportedNativeAmendment':'currentM2Continuity'];if(!oldGroup)fail('HISTORICAL_ORIGIN');
    const oldCarrier=doc(oldGroup.carrier,DOC,{live:true});
    let originalCarrier=oldCarrier,oldNegativeRef,nativeRef;
    if(imported){originalCarrier=doc(oldCarrier.priorCarrierRef,DOC,{live:true});oldNegativeRef=originalCarrier.rootFollowupRef;nativeRef=oldCarrier.nativeFourSlotRef;}
    else{const closure=doc(oldGroup.rootClosure,DOC,{live:true});oldNegativeRef=closure.rawObservationRef;nativeRef=oldCarrier.nativeFourSlotRef;}
    if(!Array.isArray(p.historicalEvidenceRefs)||!same(p.historicalEvidenceRefs.map(r=>[r.path,r.sha256,r.gitBlobSha1]).sort(),(replay.requiredLiveEvidence||[]).map(r=>[r.path,r.sha256,r.gitBlobSha1]).sort()))fail('HISTORICAL_EVIDENCE_COVERAGE');
    for(const r of p.historicalEvidenceRefs)read(r,DOC,{full:true,live:true});
    const holds=prior.items.filter(i=>i.registrationHold);if(holds.length!==1||TUPLE.some(k=>holds[0].registrationHold[k]!==s[k]))fail('EXACT_HOLD');
    const held=holds[0],beforeRef=oldCarrier.sourceRef,nativeSourceRef=oldCarrier.nativeSourceRef;
    const beforeRaw=read(beforeRef,SOURCE,{full:true}),currentRaw=read(p.sourceRef,SOURCE,{full:true,live:true,ancestor:true}),nativeRaw=read(nativeSourceRef,SOURCE,{full:true});
    const before=loadBank(beforeRaw),bank=loadBank(currentRaw),nativeBank=loadBank(nativeRaw),n=p.expectedQuestionCount,index=s.sourceOrdinal-1;
    if(!Number.isSafeInteger(n)||n<2||[before,bank,nativeBank,prior.items,d.items].some(x=>!Array.isArray(x)||x.length!==n)||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1||prior.sourceGitBlobSha!==beforeRef.gitBlobSha1||index>=n)fail('DENOMINATOR');
    const old=before[index],q=bank[index],native=nativeBank[index];
    const ob=hp.m2DisplayRepairObligation;if(!ob?.required||ob.errors.length||!ob.entries?.some(r=>r.path===group.carrier.path&&r.sha256===group.carrier.sha256))fail('HISTORY_REQUIRED');
    if(imported){
      const history=hp.m2ImportedObligation;if(!history?.required||history.errors.length||!Array.isArray(history.originalEntries)||!Array.isArray(history.amendmentEntries))fail('IMPORTED_HISTORY');
      if(history.originalEntries.length!==1||history.originalEntries[0].path!==oldCarrier.priorCarrierRef.path||history.originalEntries[0].sha256!==oldCarrier.priorCarrierRef.sha256||!same(history.originalEntries[0].heldRows,[s]))fail('ORIGINAL_HISTORY_COVERAGE');
      if(history.amendmentEntries.length!==1||history.amendmentEntries[0].path!==oldGroup.carrier.path||history.amendmentEntries[0].sha256!==oldGroup.carrier.sha256||!same(history.amendmentEntries[0].heldRows,[s]))fail('AMENDMENT_HISTORY_COVERAGE');
      for(const r of history.amendmentEntries[0].changedRows){const item=pick(prior.items,x=>x.ordinal===r.ordinal,'AMENDMENT_ITEM');if(sha(stable(withoutHold(item)))!==r.afterItemSha256)fail('AMENDMENT_VECTOR');}
    }else{
      const history=hp.m2ContinuityObligation;if(!history?.required||history.errors.length||!Array.isArray(history.entries))fail('CURRENT_HISTORY');
      const negatives=history.entries.filter(r=>r.kind==='NEGATIVE'),transports=history.entries.filter(r=>r.kind==='TRANSPORT');
      if(negatives.length!==1||TUPLE.some(k=>negatives[0][k]!==s[k])||negatives[0].path!==oldGroup.rootClosure.path||negatives[0].sha256!==oldGroup.rootClosure.sha256||transports.length!==1||transports[0].path!==oldGroup.carrier.path||transports[0].sha256!==oldGroup.carrier.sha256)fail('CURRENT_HISTORY_COVERAGE');
    }
    const binding=doc(group.observationBinding,BINDING,{live:true,ancestor:true});
    keys(binding,['schemaVersion','scope','examId','sourceArchiveFile','selected','kind','rootObservationRef','candidateReportRef','mechanicalReadRef','imageXmlReadRef','independentObservationRef','actualImageRefs']);
    if(binding.schemaVersion!==BINDING_SCHEMA||binding.scope!==SCOPE||binding.examId!==p.examId||binding.sourceArchiveFile!==d.sourceArchiveFile||!same(binding.selected,s)||binding.kind!==p.kind)fail('OBSERVATION_BINDING');
    const rootRead=doc(binding.rootObservationRef,DOC,{full:true,live:true,ancestor:true}),candidate=doc(binding.candidateReportRef,DOC,{full:true,live:true}),mechanical=doc(binding.mechanicalReadRef,DOC,{full:true,live:true}),xml=doc(binding.imageXmlReadRef,DOC,{full:true,live:true}),actual=doc(binding.independentObservationRef,DOC,{full:true,live:true});
    keys(rootRead,['schemaVersion','reviewer','observedAtUtc','scope','examId','sourceArchiveFile','sourceOrdinal','questionUid','expectedQuestionCount','beforeSource','currentSource','negativeRef','negativeReason','nativeSourceRef','actualViewedNativeAssets','exactCandidateReportSha256','sourceBoundary','actualObservations','reviewLimits','decision','priorNegativeEvidenceRemainsHistorical','registrationHoldReleased','registrationResult','requiredNext',...(p.kind===KINDS[2]?['assetRepairBoundary']:[])]);
    if(rootRead.schemaVersion!=='m2s2-root-exact-display-repair-observation-v1'||rootRead.scope!==SCOPE||rootRead.examId!==p.examId||rootRead.questionUid!==s.questionUid||rootRead.sourceOrdinal!==s.sourceOrdinal||rootRead.sourceArchiveFile!==d.sourceArchiveFile||rootRead.expectedQuestionCount!==n||rootRead.decision!=='ACCEPT_EXACT_DECLARED_DISPLAY_REPAIR_BOUNDARY'||rootRead.priorNegativeEvidenceRemainsHistorical!==true||rootRead.registrationHoldReleased!==false||rootRead.registrationResult!=='NOT_RUN'||!rootRead.reviewer||rootRead.reviewer===p.transportAuthor||!Number.isFinite(Date.parse(rootRead.observedAtUtc))||typeof rootRead.requiredNext!=='string'||!rootRead.requiredNext.trim())fail('ROOT_OBSERVATION');
    keys(rootRead.reviewLimits,['browserRenderingRun','newNativeMetadataApproval','newSlotVectorApproval','newDifficultyApproval','newSolutionAuthorship']);if(Object.values(rootRead.reviewLimits).some(x=>x!==false))fail('ROOT_LIMITS');
    if(!sameBytesRef(rootRead.beforeSource,beforeRef)||!same(ref4(rootRead.currentSource),p.sourceRef)||rootRead.exactCandidateReportSha256!==binding.candidateReportRef.sha256||!same(ref3(rootRead.negativeRef),oldNegativeRef))fail('ROOT_BYTE_BINDING');
    read(ref4(rootRead.beforeSource),SOURCE,{full:true});const rootNative=read(ref4(rootRead.nativeSourceRef),SOURCE,{full:true});if(!rootNative.equals(nativeRaw))fail('NATIVE_SOURCE_CHAIN');
    const negative=doc(ref4(rootRead.negativeRef),DOC,{full:true,live:true}),negativeRow=pick(negative.rows,r=>r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'NEGATIVE_ROW');
    if(negativeRow.decision!=='WITHHOLD_CURRENT_RENDERER'||(negativeRow.currentQuestionSha256??negativeRow.currentWholeQuestionSha256)!==sha(stable(old))||(negativeRow.reason??negativeRow.reasonCode)!==rootRead.negativeReason)fail('NEGATIVE_CURRENT_BYTES');
    if(candidate.schemaVersion!=='m2-hold3-root-exact-repair-candidates-v1'||candidate.scope!=='EXACT_DISPLAY_REPAIR_ONLY'||candidate.author!==rootRead.reviewer||candidate.productionFilesApplied!==0||candidate.registrationHoldReleased!==0||candidate.registration!=='NOT_RUN')fail('CANDIDATE_SCOPE');
    const cr=pick(candidate.rows,r=>r.examId===p.examId&&r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'CANDIDATE_ROW');
    if(cr.sourceArchiveFile!==d.sourceArchiveFile||cr.expectedQuestionCount!==n||!same(ref4(cr.beforeSource),ref4(rootRead.beforeSource))||!sameBytesRef(cr.afterSource,p.sourceRef)||!same(ref4(cr.negativeRef),ref4(rootRead.negativeRef))||cr.negativeReason!==rootRead.negativeReason||cr.registrationHoldReleased!==false||cr.actualCandidateVisualReview!=='PENDING')fail('CANDIDATE_BINDING');
    if(actual.schemaVersion!=='m2-hold3-scoped-independent-repair-observations-v1'||actual.scope!=='EXACT_THREE_SELECTED_DISPLAY_REPAIR_CANDIDATES_ONLY'||actual.status!=='ACTUAL_SCOPED_OBSERVATIONS_COMPLETE_REGISTRATION_NOT_RUN'||!actual.reviewer||[rootRead.reviewer,p.transportAuthor].includes(actual.reviewer)||actual.candidateAuthor!==rootRead.reviewer||!Number.isFinite(Date.parse(actual.observedAtUtc))||actual.candidateReportRef?.sha256!==binding.candidateReportRef.sha256||actual.mechanicalReadRef?.sha256!==binding.mechanicalReadRef.sha256||actual.imageAndXmlReadRef?.sha256!==binding.imageXmlReadRef.sha256)fail('INDEPENDENT_SCOPE');
    if(mechanical.schemaVersion!=='m2-hold3-independent-mechanical-read-v1'||mechanical.reviewer!==actual.reviewer||mechanical.candidateReportRef?.sha256!==binding.candidateReportRef.sha256||['sourceWrites','assetWrites','compactWrites','registrationHoldReleased'].some(k=>mechanical[k]!==0)||mechanical.registration!=='NOT_RUN'||xml.schemaVersion!=='m2-hold3-independent-image-byte-and-xml-read-v1'||xml.reviewer!==actual.reviewer||xml.productionWrites!==0||xml.browserInspection!=='NOT_RUN')fail('INDEPENDENT_MECHANICAL');
    if(!Array.isArray(actual.rows)||!actual.rows.length||new Set(actual.rows.map(r=>r.questionUid)).size!==actual.rows.length||!same((mechanical.rows||[]).map(r=>[r.questionUid,r.sourceOrdinal]).sort(),actual.rows.map(r=>[r.questionUid,r.sourceOrdinal]).sort())||!same((candidate.rows||[]).map(r=>[r.questionUid,r.sourceOrdinal]).sort(),actual.rows.map(r=>[r.questionUid,r.sourceOrdinal]).sort()))fail('RAW_FULL_OBSERVATION_SCOPE');
    const count=actual.counts,limits=actual.limits;
    if(count?.sourceFiles!==actual.rows.length||count.selectedQuestions!==actual.rows.length||count.outsideWholeQuestionsVerified!==actual.rows.reduce((n,r)=>n+r.outsideWholeQuestionsExact,0)||count.imagesActuallyViewed!==actual.rows.reduce((n,r)=>n+(r.actualImageRefs||[]).length,0)||count.approvedNewSlotValues!==0||count.productionWrites!==0||limits?.originalNegativeEvidenceRemainsValidForOldBytes!==true||limits.oldNegativeRawPreserved!==true||['currentSourceAndAssetsApplied','registrationHoldReleased','fullExamIndependentMathReview'].some(k=>limits[k]!==false)||['browserInspection','registration','consumer'].some(k=>limits[k]!=='NOT_RUN')||mechanical.sourceReportRef?.sha256!==candidate.sourceReportSha256)fail('ORIGINAL_REVIEW_LIMITS');
    const ar=pick(actual.rows,r=>r.examId===p.examId&&r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'ACTUAL_ROW'),mr=pick(mechanical.rows,r=>r.examId===p.examId&&r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'MECHANICAL_ROW');
    if(Object.keys(mr).some(k=>!same(mr[k],ar[k]))||!same(ref4(ar.beforeSource),ref4(rootRead.beforeSource))||!sameBytesRef(ar.candidateSource,p.sourceRef)||!same(ref4(ar.negativeRef),ref4(rootRead.negativeRef))||ar.negativeReason!==rootRead.negativeReason||ar.fullDenominator!==n||ar.outsideWholeQuestionsExact!==n-1||ar.originalHoldSha256!==sha(stable(held.registrationHold))||ar.existingVectorSha256!==sha(stable(withoutHold(held)))||['nativeRootAcceptanceAndReviewRawExact','heldVectorExactNativeProjection','negativeBindsExactCurrentWholeQuestion','outsideSelectedObjectRawPrefixAndSuffixExact','unchangedAllOtherSelectedFields','stemChoicesAnswerSolutionExact'].some(k=>ar[k]!==true)||['newSemanticApproval','newVectorSelection','newMathQa','newDifficultyApproval'].some(k=>ar[k]!==0)||ar.registrationHoldReleased!==false)fail('INDEPENDENT_ROW');
    keys(ar.actualReads,['nativeAndCurrentFullStem','allChoices','existingAnswerAndWrittenSolution','originalNamedFourSlots','originalNegativeRawEvidence','candidateSelectedWholeQuestion','listedImagesActuallyViewed','browser']);if(Object.entries(ar.actualReads).some(([k,v])=>v!==(k!=='browser')))fail('ACTUAL_READING');
    if(ar.currentNegativeRendererReViewed!==(p.kind===KINDS[2])||!Array.isArray(ar.observed)||!ar.observed.length||ar.observed.some(x=>typeof x!=='string'||!x.trim())||typeof ar.existingVectorRelationship!=='string'||!ar.existingVectorRelationship.trim())fail('ACTUAL_OBSERVATIONS');
    const nativeDoc=doc(ref4(ar.nativeFourSlotRef),NATIVE,{full:true}),nativeItem=pick(nativeDoc.items,r=>r.questionUid===s.questionUid&&r.sourceOrdinal===s.sourceOrdinal,'NATIVE_SELECTED');
    if(!same(ref3(ar.nativeFourSlotRef),ref3(nativeRef))||ar.nativeItemSha256!==sha(stable(nativeItem)))fail('NATIVE_SELECTED_AUTHORITY');
    const priorObserved=doc({...ar.priorHeldCompactRef,gitBlobSha1:blob(rawAt(ar.priorHeldCompactRef.commit,ar.priorHeldCompactRef.path))},COMPACT,{full:true});
    const observedHeld=pick(priorObserved.items,r=>r.ordinal===s.ordinal,'OBSERVED_HOLD');if(!same(observedHeld,held))fail('OBSERVED_HELD_VECTOR');
    const fields=changes(old,q),expectedFields=p.kind===KINDS[0]?['image','imageAlt','imageSize','layoutTag']:p.kind===KINDS[1]?['image','imageAlt','imageSize','layoutTag','solutionImage','solutionImageAlt','solutionImageCaption']:['content'];
    if(!same(fields,[...expectedFields].sort())||!same([...ar.changedFields].sort(),fields)||!same([...cr.changedFields].sort(),fields)||!same([...rootRead.sourceBoundary.changedFields].sort(),fields))fail('EXACT_CHANGED_FIELDS');
    const boundary=rootRead.sourceBoundary;
    if(boundary.wholeQuestionBeforeSha256!==sha(stable(old))||boundary.wholeQuestionAfterSha256!==sha(stable(q))||cr.wholeQuestionBeforeSha256!==sha(stable(old))||cr.wholeQuestionAfterSha256!==sha(stable(q))||boundary.outsideWholeQuestionsUnchanged!==n-1||cr.outsideWholeQuestionsUnchanged!==n-1||['sourcePrefixAndSuffixOutsideSelectedObjectRawExact','currentMetadataFieldsUnchanged'].some(k=>boundary[k]!==true||cr[k]!==true))fail('SOURCE_BOUNDARY');
    const a=selectedSpan(beforeRaw,old),b=selectedSpan(currentRaw,q);if(a.text.slice(0,a.start)!==b.text.slice(0,b.start)||a.text.slice(a.end)!==b.text.slice(b.end))fail('OUTSIDE_SOURCE_OBJECT');
    if(!Array.isArray(binding.actualImageRefs)||!Array.isArray(ar.actualImageRefs)||!same(binding.actualImageRefs.map(r=>r.sha256),ar.actualImageRefs.map(r=>r.sha256)))fail('ACTUAL_IMAGE_COVERAGE');
    for(const r of binding.actualImageRefs){const bytes=read(r,CAPTURE.test(r.path)?CAPTURE:ASSET,{full:true,live:CAPTURE.test(r.path)}),image=pick(ar.actualImageRefs,x=>x.sha256===r.sha256,'ACTUAL_IMAGE'),xmlImage=pick(xml.imageFiles,x=>x.sha256===r.sha256,'IMAGE_METADATA');if(!same(image,xmlImage)||bytes.length!==image.bytes||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))||bytes.length<24||bytes.readUInt32BE(16)!==image.width||bytes.readUInt32BE(20)!==image.height)fail('ACTUAL_IMAGE_BYTES');}
    let repairedAsset=null;
    if(p.kind!==KINDS[2]){
      const solution=p.kind===KINDS[1],reason=solution?'AREA_LABEL_OUTSIDE_REFERENCED_REGION':'GIVEN_RIGHT_ANGLE_MARKERS_MISSING';
      if(rootRead.negativeReason!==reason||ar.decision!==(solution?'ACCEPT_EXACT_NATIVE_PROBLEM_AND_SOLUTION_DISPLAY_RESTORATION_FOR_SCOPED_CLARITY':'ACCEPT_EXACT_NATIVE_DISPLAY_RESTORATION_FOR_SCOPED_CLARITY')||ar.changedFieldsEqualExactNativePresenceAndValues!==true||ar.nativeStudentPayloadExact!==true||boundary.nativeStudentPayloadRestored!==true||cr.nativeStudentPayloadRestored!==true||payloadHash(q)!==payloadHash(native))fail('NATIVE_RESTORE');
      for(const k of fields)if(own(q,k)!==own(native,k)||!same(q[k],native[k]))fail('NATIVE_FIELDS');
      const observedKeys=solution?['nativeProblemPngActuallyViewed','nativeSolutionSvgRenderedAndActuallyViewed','sourceCentroidABCAndGBCPremisesRead','A_G_Gprime_DOrderCorrect','DOnBCAndMedianVisible','shadedGprimeBDRegionVisible','areaLabelLeaderTerminatesAtShadedTriangleBoundary','heightLabelsAgreeWithRepeatedCentroidRelation','nativeAssetBytesUnchanged']:['nativeProblemPngActuallyViewed','rightAngleBVisible','rightAngleHVisible','EF2cmVisible','KL4cmVisible','twoPrismCorrespondenceVisible','stemSimilarityPremiseRead','nativeAssetBytesUnchanged'];
      keys(rootRead.actualObservations,observedKeys);if(observedKeys.some(k=>rootRead.actualObservations[k]!==true))fail('ROOT_NATIVE_READING');
      if(!same((rootRead.actualViewedNativeAssets||[]).map(r=>r.path).sort(),assetRefs(native))||!same((cr.nativeAssets||[]).map(r=>ref4(r)),rootRead.actualViewedNativeAssets.map(r=>ref4(r))))fail('NATIVE_ASSET_COVERAGE');
      const problem=pick(rootRead.actualViewedNativeAssets,r=>/\.png$/i.test(r.path),'NATIVE_PROBLEM');
      if(!sameBytesRef(binding.actualImageRefs[0],problem)||solution&&!CAPTURE.test(binding.actualImageRefs[1]?.path||''))fail('ACTUAL_NATIVE_PNG');
      for(const r of rootRead.actualViewedNativeAssets){const bytes=read(ref4(r),ASSET,{full:true});if(!bytes.equals(rawAt(nativeSourceRef.commit,r.path))||!bytes.equals(rawAt(p.sourceRef.commit,r.path))||!bytes.equals(rawLive(r.path)))fail('NATIVE_ASSET_BYTES');if(/\.svg$/i.test(r.path))staticSvg(bytes);}
      if(solution){const svg=pick(rootRead.actualViewedNativeAssets,r=>/\.svg$/i.test(r.path),'NATIVE_SOLUTION');if(!xml.convertedSvgInputRefs?.some(x=>same(ref4(x.originalRef),ref4(svg))&&x.sha256===svg.sha256))fail('SOLUTION_CAPTURE_INPUT');}
      if(cr.assetRepair!==null||own(rootRead,'assetRepairBoundary')||binding.actualImageRefs.length!==(solution?2:1))fail('UNEXPECTED_ASSET_REPAIR');
    }else{
      if(imported||rootRead.negativeReason!=='WHOLE_SEGMENT_VS_SUBSEGMENT_MARKING_AMBIGUOUS'||ar.decision!=='ACCEPT_EXACT_FOUR_TICK_REMOVAL_FOR_SCOPED_DIAGRAM_CLARITY'||ar.nativeStudentPayloadExact!==false||boundary.nativeStudentPayloadRestored!==false||cr.nativeStudentPayloadRestored!==false||assetRefs(native).length||rootRead.actualViewedNativeAssets?.length!==0||cr.nativeAssets?.length!==0||binding.actualImageRefs.length!==2||binding.actualImageRefs.some(r=>!CAPTURE.test(r.path)))fail('DERIVED_SCOPE');
      const repair=rootRead.assetRepairBoundary;if(!same(repair,cr.assetRepair?{...cr.assetRepair,after:rootRead.assetRepairBoundary.after}:null)||repair?.removedBlueSingleTicks!==4||repair.retainedPurpleDoubleTickStrokes!==4||['geometryAndLabelsUnchanged','descriptionChangedOnly','inlineImageAltChangedOnly','sourceImageRetained'].some(k=>repair[k]!==true)||repair.originalStemCharactersChanged!==0||!sameBytesRef(cr.assetRepair.after,repair.after))fail('DERIVED_BOUNDARY');
      if(!same(ref4(repair.before),ref4(xml.e003?.beforeRef))||!sameBytesRef(repair.after,xml.e003?.afterRef)||!same(ref4(repair.before),ref4(ar.priorAssetRef))||!sameBytesRef(repair.after,ar.newAssetRef)||repair.before.path!==repair.after.path||repair.after.commit!==p.sourceRef.commit||!sameBytesRef(repair.before,{...repair.before,sha256:sha(rawAt(beforeRef.commit,repair.before.path)),gitBlobSha1:blob(rawAt(beforeRef.commit,repair.before.path))}))fail('DERIVED_ASSET_BINDING');
      const oldAsset=read(ref4(repair.before),ASSET,{full:true}),newAsset=read(ref4(repair.after),ASSET,{full:true,live:true});fourMarkerDelta(oldAsset,newAsset,xml.e003);repairedAsset=repair.after.path;
      inlineAltOnly(old.content,q.content,native.content,repairedAsset);
      const truths=['currentAndRepairedSvgRenderedAndActuallyViewed','originalStemRhombusAndMidpointPremisesRead','originalFigureRetained','fourAmbiguousWholeSideSingleTicksRemoved','CMAndMDTwoStrokeMarksRetained','MOnCDVisible','A_C_MConnectionsUnchanged','allCoordinatesShapesColorsAndLabelsUnchanged','noNewNumericalOrAngleLabelsAdded','remainingXmlTreeExactExceptDescription','inlineImageAltOnlyChangedWithinContent'];keys(rootRead.actualObservations,[...truths,'originalStemCharactersChanged']);if(truths.some(k=>rootRead.actualObservations[k]!==true)||rootRead.actualObservations.originalStemCharactersChanged!==0)fail('ROOT_DERIVED_READING');
    }
    if(!Array.isArray(p.currentAssets)||!same(p.currentAssets.map(r=>r.path).sort(),assetRefs(q)))fail('CURRENT_ASSET_COVERAGE');
    for(const r of p.currentAssets){if(r.commit!==p.sourceRef.commit)fail('CURRENT_ASSET_COMMIT');const raw=read(r,ASSET,{full:true,live:true});if(/\.svg$/i.test(r.path))staticSvg(raw);}
    for(let i=0;i<n;i++){
      const current=bank[i],previous=before[i],ids=(identity.records||[]).filter(r=>r.sourceArchiveFile===d.sourceArchiveFile&&r.sourceOrdinal===i+1),id=ids[0];
      if(ids.length!==1||!UID.test(id?.questionUid||'')||(identity.records||[]).filter(r=>r.questionUid===id.questionUid).length!==1||String(id.sourceQuestionNo)!==sourceIdentityNumber(current)||sourceNumber(current)!==sourceNumber(previous)||sourceNumber(current)!==sourceNumber(nativeBank[i]))fail('FULL_IDENTITY');
      if(i===index){if(TUPLE.some(k=>s[k]!==({questionUid:id.questionUid,sourceOrdinal:i+1,sourceQuestionNo:sourceIdentityNumber(current),ordinal:sourceNumber(current)})[k]))fail('SELECTED_IDENTITY');}
      else if(!same(current,previous))fail('UNCHANGED_PEER');
      for(const ap of assetRefs(current)){const now=rawAt(p.sourceRef.commit,ap);if(!now.equals(rawLive(ap)))fail('CURRENT_ASSET_BYTES');if(i!==index&&!now.equals(rawAt(beforeRef.commit,ap)))fail('UNCHANGED_PEER_ASSET');if(i===index&&ap!==repairedAsset&&!now.equals(rawAt(nativeSourceRef.commit,ap)))fail('SELECTED_NATIVE_ASSET');}
    }
    const expected=structuredClone(prior);expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;expected.evidence[GROUP]=group;delete expected.items.find(i=>i.ordinal===s.ordinal).registrationHold;
    if(!same(expected,d)||p.fullItemsSha256!==sha(stable(prior.items.map(withoutHold))))fail('EXACT_COMPACT');
    return [];
  }catch(e){return [String(e.message).startsWith('M2_DISPLAY_REPAIR_')?e.message:'M2_DISPLAY_REPAIR_EVIDENCE_UNAVAILABLE'];}
}

module.exports={GROUP,SCHEMA,SCOPE,BINDING_SCHEMA,ORIGINS,KINDS,ZERO,CARRIER,has,hasFor,createObligationReader,evidenceDigests,validateFile};
