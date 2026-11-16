'use strict';
// Opt-in transport of an existing M2-S2 full vector. This module never authors a
// slot, repairs a source, or treats a renderer observation as mathematical QA.
const fs = require('node:fs');
const {execFileSync} = require('node:child_process');
const {compactItem} = require('./import-4slot.cjs');
const {buildLookup} = require('./validate-4slot.cjs');
const {sourceNumber, sourceIdentityNumber} = require('./exam-items.cjs');

const CARRIER_SCHEMA = 'm2-s2-current-four-slot-continuity-v1';
const REVIEW_SCHEMA = 'archive-m2s2-current-four-slot-continuity-review-v1';
const ROOT_SCHEMA = 'archive-m2s2-current-four-slot-root-closure-v1';
const HOLD_SCHEMA = '4slot-m2s2-current-renderer-hold-v1';
const REASON = 'SOURCE_RENDERER_CORRECTION_PENDING';
const SCOPE = 'KEEP_EXACT_EXISTING_M2S2_FOUR_SLOT_VECTOR';
const ROOT_SCOPE = 'EXISTING_VECTOR_CURRENT_SOURCE_CONTINUITY_ONLY';
const RAW_REVIEW_SCHEMA = 'm2s2-current-four-slot-actual-observation-v1';
const RAW_ROOT_SCHEMA = 'm2s2-wave131-root-independent-observation-v1';
const GROUP = 'currentM2Continuity';
const ZERO = ['newSemanticApprovals','newDifficultyApprovals','newMathQa','newSlotValues','sourceWrites','assetWrites'];
const SOURCE = /^archive\/exams\/original\/middle\/m2\/2(?:mid|final)\/.+\.js$/;
const COMPACT = /^archive\/data\/item-4slot\/original\/middle\/m2\/2(?:mid|final)\/.+\.4slot\.json$/;
const REF = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\.json$/;
const CARRIER_PATH = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-current-four-slot-transport\.json$/;
const ROOT_PATH = /^docs\/operations\/[A-Za-z0-9_가-힣./-]+\/m2-current-four-slot-root-closure\.json$/;
const NATIVE = /^archive\/data\/meta-review\/m2-s2-20261114\/exams\/E\d{3}\/(?:four-slot|review|root-acceptance|independent-sample)\.json$/;
const ASSET = /^archive\/assets\/.+\.(?:svg|png|jpe?g|gif|webp)$/i;
const DICTIONARY = /^docs\/architecture\/4slot\/term-dictionary-v[0-9.]+\.json$/;
const SHA = /^[a-f0-9]{64}$/, GIT = /^[a-f0-9]{40}$/, UID = /^qid_v1_[a-f0-9]{64}$/;
const REF4 = ['commit','path','gitBlobSha1','sha256'];
const TUPLE = ['questionUid','sourceOrdinal','sourceQuestionNo','ordinal'];
const INSPECTION = ['stemRead','solutionRead','allFourSlotsRead','actualRendererRead'];
const PRESENTATION = new Set(['image','imageAlt','imageSize','layoutTag','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize']);
const KINDS = new Set(['RENDERER_PRESENTATION_CONTINUITY','ANNOTATION_ONLY_REMOVAL_CONTINUITY','BODY_TRANSCRIPTION_CONTINUITY','WITHHOLD_CURRENT_RENDERER']);
const own = (o,k) => Object.hasOwn(o || {},k);
const plain = r => ({commit:r?.commit,path:r?.path,sha256:r?.sha256});
const utc = s => typeof s==='string' && /^\d{4}-\d\d-\d\dT.*(?:Z|\+00:00)$/.test(s) && Number.isFinite(Date.parse(s));
const has = d => own(d.evidence,GROUP) || (d.items || []).some(i => i.registrationHold?.schemaVersion===HOLD_SCHEMA || own(i.registrationHold,'m2ContinuityCarrier'));
const inScope = d => /^original\/middle\/m2\/2(?:mid|final)\//.test(d.sourceArchiveFile || '');
const gitBytes = (root,args) => execFileSync('git',['-C',root,'-c','core.quotepath=false',...args],{timeout:30000,maxBuffer:32*1024*1024,stdio:['ignore','pipe','pipe']});

// This pass-local immutable inventory records obligations, never successful
// approval results. Full ancestry includes witnesses removed by a merge commit.
function createObligationReader(root,{safe,sha,blob,stable}) {
  let loaded=false, failure=null, entries=[];
  function load() {
    if(loaded) return;
    loaded=true;
    try {
      const head=gitBytes(root,['rev-parse','--verify','HEAD']).toString().trim();
      if(!GIT.test(head)) throw Error('HEAD');
      const paths=[':(glob)docs/operations/**/m2-current-four-slot-transport.json',':(glob)docs/operations/**/m2-current-four-slot-root-closure.json'];
      const history=gitBytes(root,['log','--full-history','--format=%H',head,'--',...paths]).toString().trim().split(/\s+/).filter(Boolean);
      const seen=new Set();
      for(const commit of new Set([head,...history])) {
        const names=gitBytes(root,['ls-tree','-r','-z','--name-only',commit,'--','docs/operations']).toString().split('\0').filter(p=>CARRIER_PATH.test(p)||ROOT_PATH.test(p));
        for(const path of names) {
          safe(root,path);
          const raw=gitBytes(root,['show',commit+':'+path]), digest=sha(raw), key=path+'#'+digest;
          if(seen.has(key)) continue;
          seen.add(key);
          const p=JSON.parse(raw);
          if(p.schemaVersion!==CARRIER_SCHEMA && p.schemaVersion!==ROOT_SCHEMA) continue;
          if(ZERO.some(k=>p[k]!==0)) throw Error('APPROVAL_SCOPE');
          if(p.schemaVersion===CARRIER_SCHEMA) {
            if(!CARRIER_PATH.test(path)||p.scope!==SCOPE||!SOURCE.test(p.sourceRef?.path||'')||p.sourceRef.path!=='archive/exams/'+p.sourceArchiveFile) throw Error('CARRIER');
            const r=p.sourceRef, source=gitBytes(root,['show',r.commit+':'+r.path]);
            if(!GIT.test(r.commit||'')||sha(source)!==r.sha256||blob(source)!==r.gitBlobSha1) throw Error('SOURCE');
            entries.push({sourceArchiveFile:p.sourceArchiveFile,kind:'TRANSPORT',path,sha256:digest});
          } else {
            if(!ROOT_PATH.test(path)||p.scope!==ROOT_SCOPE||!p.reviewer||!p.transportAuthor||p.reviewer===p.transportAuthor||!Array.isArray(p.rows)) throw Error('ROOT');
            for(const row of p.rows.filter(r=>r.decision==='WITHHOLD_CURRENT_RENDERER')) {
              const r=row.sourceRef;
              if(!UID.test(row.questionUid||'')||!SOURCE.test(r?.path||'')||r.path!=='archive/exams/'+row.sourceArchiveFile||!GIT.test(r.commit||'')) throw Error('NEGATIVE');
              const source=gitBytes(root,['show',r.commit+':'+r.path]);
              if(sha(source)!==r.sha256||blob(source)!==r.gitBlobSha1) throw Error('SOURCE');
              entries.push({sourceArchiveFile:row.sourceArchiveFile,questionUid:row.questionUid,sourceOrdinal:row.sourceOrdinal,sourceQuestionNo:row.sourceQuestionNo,ordinal:row.ordinal,kind:'NEGATIVE',path,sha256:digest});
            }
          }
        }
      }
    } catch { failure='M2_CURRENT_CONTINUITY_HISTORY_UNAVAILABLE'; }
  }
  return d => {
    if(!inScope(d)) return {required:false,errors:[],digest:null};
    load();
    if(failure) return {required:true,errors:[failure],digest:null};
    const found=entries.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile);
    if(!found.length) return {required:false,errors:[],digest:null};
    const held=(d.items||[]).filter(i=>i.registrationHold?.schemaVersion===HOLD_SCHEMA).map(i=>i.registrationHold);
    const covered=found.filter(r=>r.kind==='NEGATIVE').every(r=>held.some(h=>TUPLE.every(k=>h[k]===r[k])));
    return {required:true,errors:has(d)&&covered?[]:['M2_CURRENT_CONTINUITY_OBLIGATION_REQUIRED'],digest:sha(stable(found))};
  };
}

function evidenceDigests(root,d,{safe,sha}) {
  const refs=d.evidence?.[GROUP], out={};
  for(const r of Object.values(refs||{})) if(r?.path) {
    try { out[r.path]=sha(fs.readFileSync(safe(root,r.path))); } catch { out[r.path]=null; }
  }
  return out;
}

function validateFile(root,d,hp) {
  if(!has(d)) return [];
  const {safe,sha,blob,stable,payloadHash,identityHash,assetRefs,loadBank,dictionary,identity,studentFields}=hp;
  const fail=s=>{throw Error('M2_CURRENT_CONTINUITY_'+s);};
  const same=(a,b)=>stable(a)===stable(b);
  const keys=(o,ks)=>{if(!o||typeof o!=='object'||Array.isArray(o)||!same(Object.keys(o).sort(),[...ks].sort())) fail('FIELDS');};
  const zero=o=>{if(ZERO.some(k=>o[k]!==0)) fail('NO_NEW_APPROVAL');};
  const ordinals=a=>Array.isArray(a)&&a.every(n=>Number.isSafeInteger(n)&&n>0)&&new Set(a).size===a.length&&same(a,[...a].sort((x,y)=>x-y));
  function immutable(ref,pattern,{local=false,fields=['commit','path','sha256']}={}) {
    keys(ref,fields);
    if(!GIT.test(ref.commit||'')||!SHA.test(ref.sha256||'')||!pattern.test(ref.path||'')) fail('REFERENCE');
    safe(root,ref.path);
    let raw;try{raw=gitBytes(root,['show',ref.commit+':'+ref.path]);}catch{fail('IMMUTABLE_UNAVAILABLE');}
    if(sha(raw)!==ref.sha256||own(ref,'gitBlobSha1')&&(!GIT.test(ref.gitBlobSha1||'')||blob(raw)!==ref.gitBlobSha1)) fail('IMMUTABLE_BYTES');
    if(local) {let b;try{b=fs.readFileSync(safe(root,ref.path));}catch{fail('LIVE_UNAVAILABLE');}if(!b.equals(raw))fail('LIVE_BYTES');}
    return raw;
  }
  function staticSvg(raw,depth=0) {
    if(depth>6) fail('SVG_DEPTH');
    const s=raw.toString('utf8');
    if(/<!DOCTYPE|<!ENTITY|<\?xml-stylesheet|<(?:[^\s<>/:]+:)?(?:script|foreignObject|iframe|animate(?:Motion|Transform)?|set|discard)\b|\son[a-z]+\s*=|javascript:|@import/i.test(s)) fail('DYNAMIC_SVG');
    if(/@(?:-[a-z]+-)?keyframes\b|(?:^|[;{\s])(?:-[a-z]+-)?(?:animation|transition)(?:-[a-z-]+)?\s*:/i.test(s)) fail('DYNAMIC_SVG');
    const css=[...s.matchAll(/<(?:[^\s<>/:]+:)?style\b[^>]*>([\s\S]*?)<\/(?:[^\s<>/:]+:)?style\s*>/gi)].map(m=>m[1]);
    css.push(...[...s.matchAll(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi)].map(m=>m[2]));
    // Escaped CSS and XML entities inside CSS are outside this static input
    // contract; do not guess a browser's decoded property names.
    if(css.some(s=>/@(?:-[a-z]+-)?keyframes\b|(?:^|[;{\s])(?:-[a-z]+-)?(?:animation|transition)(?:-[a-z-]+)?\s*:/i.test(s))) fail('DYNAMIC_SVG');
    if(css.some(s=>/[\\&]/.test(s))) fail('UNINSPECTED_CSS_ESCAPE');
    for(const m of s.matchAll(/(?:href|src)\s*=\s*["']([^"']+)["']/gi)) {
      if(m[1].startsWith('#')) continue;
      const data=/^data:image\/(svg\+xml|png|jpeg|gif|webp);base64,([A-Za-z0-9+/=\s]+)$/i.exec(m[1]);
      if(!data) fail('UNBOUND_SVG_DEPENDENCY');
      if(data[1].toLowerCase()==='svg+xml') staticSvg(Buffer.from(data[2],'base64'),depth+1);
    }
    for(const m of s.matchAll(/url\s*\(\s*["']?([^)'"\s]+)["']?\s*\)/gi)) if(!m[1].startsWith('#')) fail('UNBOUND_SVG_DEPENDENCY');
  }
  function assets(refs,q,commit,local,visual) {
    if(!Array.isArray(refs)||!same(refs.map(r=>r.path).sort(),assetRefs(q))) fail('ASSET_COVERAGE');
    const seen=new Set();
    for(const r of refs) {
      if(seen.has(r.path)||r.commit!==commit||visual&&r.visuallyInspected!==true) fail('ASSET_SCOPE');
      seen.add(r.path);
      const raw=immutable(r,ASSET,{local,fields:[...REF4,'visuallyInspected']});
      if(local&&/\.svg$/i.test(r.path)) staticSvg(raw);
    }
  }
  const changed=(a,b)=>[...new Set([...Object.keys(a),...Object.keys(b)])].filter(k=>own(a,k)!==own(b,k)||!same(a[k],b[k])).sort();
  const exactRef=(a,b)=>REF4.every(k=>a?.[k]===b?.[k]);
  const exactAssetRefs=(a,b)=>Array.isArray(a)&&Array.isArray(b)&&same(a.map(r=>stable(REF4.map(k=>r?.[k]))).sort(),b.map(r=>stable(REF4.map(k=>r?.[k]))).sort());
  function presentation(old,q,fields) {
    if(fields.some(k=>!PRESENTATION.has(k)&&k!=='content')) fail('PRESENTATION_FIELDS');
    if(fields.includes('content')) {
      // Existing prose must be a byte-exact prefix. Only one static local image
      // suffix is accepted here; proof text transcription uses another kind.
      if(typeof old.content!=='string'||typeof q.content!=='string'||!q.content.startsWith(old.content)) fail('PRESENTATION_BODY');
      const suffix=q.content.slice(old.content.length);
      if(!/^<br\s*\/?><img\b[^>]*>$/i.test(suffix)||/\son[a-z]+\s*=|javascript:/i.test(suffix)) fail('PRESENTATION_BODY');
      const attrs=suffix.replace(/^<br\s*\/?><img\b/i,'').replace(/>$/,'');
      const seen=new Set();let src=null;
      const rest=attrs.replace(/\s+([A-Za-z][A-Za-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,(_,name,a,b)=>{
        name=name.toLowerCase();const value=a??b;
        if(!['src','alt','style'].includes(name)||seen.has(name)) fail('PRESENTATION_BODY');
        seen.add(name);
        if(name==='src')src=value;
        if(name==='style'&&/[\\&]|url\s*\(|@import|expression\s*\(|behavior\s*:/i.test(value)) fail('PRESENTATION_BODY');
        return '';
      });
      if(rest.trim()||!src||!ASSET.test('archive/'+src.replace(/^archive\//,''))) fail('PRESENTATION_BODY');
    }
    for(const k of fields.filter(k=>k!=='content')) {
      if(q[k]!=null&&typeof q[k]!=='string') fail('PRESENTATION_TYPE');
      if(['image','solutionImage'].includes(k)&&q[k]!=null&&(!q[k]||!ASSET.test('archive/'+q[k].replace(/^archive\//,'')))) fail('PRESENTATION_IMAGE');
      if(/Size$/.test(k)&&q[k]!=null&&!['small','medium','large','full','tall'].includes(q[k])) fail('PRESENTATION_SIZE');
      if(k==='layoutTag'&&!['fullwidth','grid','subjective-2up'].includes(q[k])) fail('PRESENTATION_LAYOUT');
    }
  }
  // Tokenize the small static HTML surface rather than treating an asset path
  // in prose, a comment or a quoted attribute as a rendered image.
  function bodyInlineFigures(content) {
    const found=[];let i=0;
    while((i=content.indexOf('<',i))!==-1) {
      if(content.startsWith('<!--',i)) {const end=content.indexOf('-->',i+4);if(end===-1)return [];i=end+3;continue;}
      if(!/^<\/?[A-Za-z]/.test(content.slice(i))) {i++;continue;}
      let j=i+1,quote=null;
      for(;j<content.length;j++){const ch=content[j];if(quote){if(ch===quote)quote=null;}else if(ch==='"'||ch==="'")quote=ch;else if(ch==='>')break;}
      if(j===content.length)return [];
      const tag=content.slice(i,j+1);i=j+1;
      const name=/^<\/?([A-Za-z][\w:-]*)(?=\s|\/?>)/.exec(tag);if(!name)continue;
      const kind=name[1].toLowerCase();
      if(['script','style','template','textarea','title','xmp','iframe','noembed','noframes','noscript','plaintext'].includes(kind))return [];
      if(kind!=='img'||tag.startsWith('</'))continue;
      const attrs=tag.slice(name[0].length,-1).replace(/\/\s*$/,'');let src=null;const seen=new Set();
      const rest=attrs.replace(/\s+([A-Za-z][A-Za-z0-9-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g,(_,key,a,b)=>{
        key=key.toLowerCase();const value=a??b;
        if(!['src','alt','style'].includes(key)||seen.has(key))fail('BODY_INLINE_FIGURE_REQUIRED');seen.add(key);
        if(key==='src')src=value;
        if(key==='style'&&/[\\&]|url\s*\(|@import|expression\s*\(|behavior\s*:/i.test(value))fail('BODY_INLINE_FIGURE_REQUIRED');
        return '';
      });
      if(rest.trim()||!src)return [];
      const rel='archive/'+src.replace(/^archive\//,'');if(!ASSET.test(rel))return [];safe(root,rel);found.push(rel);
    }
    return found;
  }
  function inspected(r) {
    keys(r.inspection,INSPECTION);
    if(INSPECTION.some(k=>r.inspection[k]!==true)||typeof r.observed!=='string'||!r.observed.trim()||!Array.isArray(r.captureSha256s)||!r.captureSha256s.length||r.captureSha256s.some(h=>!SHA.test(h))) fail('ACTUAL_OBSERVATION');
  }
  try {
    if(!inScope(d)||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(d,k))) fail('FULL_M2_SCOPE');
    const group=d.evidence[GROUP];keys(group,['carrier','observation','rootClosure']);
    const p=JSON.parse(immutable(group.carrier,CARRIER_PATH,{local:true}));
    keys(p,['schemaVersion','scope','transportAuthor','examId','sourceArchiveFile','expectedQuestionCount','priorCompactRef','nativeSourceRef','priorSourceRef','sourceRef','dictionaryRef','nativeFourSlotRef','nativeReviewRef','rootAcceptanceRef','independentSampleRef','observationRef','rootClosureRef','retainedOrdinals','bodyTranscriptionOrdinals','heldOrdinals','unchangedOrdinals',...ZERO,'nextAction']);
    if(p.schemaVersion!==CARRIER_SCHEMA||p.scope!==SCOPE||!p.transportAuthor||!/^E\d{3}$/.test(p.examId||'')||p.sourceArchiveFile!==d.sourceArchiveFile||!same(p.observationRef,group.observation)||!same(p.rootClosureRef,group.rootClosure)||typeof p.nextAction!=='string'||!p.nextAction.trim()) fail('OPT_IN');
    zero(p);
    const sp='archive/exams/'+d.sourceArchiveFile;
    if(p.sourceRef.path!==sp||p.priorSourceRef.path!==sp||p.nativeSourceRef.path!==sp||p.priorCompactRef.path!=='archive/data/item-4slot/'+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json')) fail('SOURCE_PATH');
    const prior=JSON.parse(immutable(p.priorCompactRef,COMPACT,{fields:REF4}));
    const nativeBank=loadBank(immutable(p.nativeSourceRef,SOURCE,{fields:REF4}));
    const before=loadBank(immutable(p.priorSourceRef,SOURCE,{fields:REF4}));
    const bank=loadBank(immutable(p.sourceRef,SOURCE,{fields:REF4,local:true}));
    const n=p.expectedQuestionCount;
    if(!Number.isSafeInteger(n)||n<1||bank.length!==n||before.length!==n||nativeBank.length!==n||prior.items?.length!==n||d.items?.length!==n) fail('WHOLE_DENOMINATOR');
    if(prior.schemaVersion!=='archive-meta-4slot-compact-v1'||prior.sourceArchiveFile!==d.sourceArchiveFile||prior.sourceGitBlobSha!==p.priorSourceRef.gitBlobSha1||d.sourceGitBlobSha!==p.sourceRef.gitBlobSha1||['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>own(prior,k))||prior.items.some(i=>own(i,'registrationHold'))||own(prior.evidence,GROUP)||own(prior.evidence,'nativeHoldReview')) fail('PRIOR_FULL_COMPACT');
    const dict=JSON.parse(immutable(p.dictionaryRef,DICTIONARY,{fields:REF4,local:true}));
    if(p.dictionaryRef.path!==dictionary.path||p.dictionaryRef.sha256!==dictionary.sha256||dict.dictionaryVersion!==d.dictionaryVersion||prior.dictionaryVersion!==d.dictionaryVersion) fail('DICTIONARY');
    if(!same(p.nativeFourSlotRef,plain(prior.evidence))||!same(p.rootAcceptanceRef,plain(prior.evidence.rootAcceptance))||!same(p.independentSampleRef,plain(prior.evidence.independentReview))) fail('NATIVE_AUTHORITY_REFERENCE');
    const prefix='archive/data/meta-review/m2-s2-20261114/exams/'+p.examId+'/';
    for(const [k,f]of [['nativeFourSlotRef','four-slot.json'],['nativeReviewRef','review.json'],['rootAcceptanceRef','root-acceptance.json'],['independentSampleRef','independent-sample.json']]) if(p[k].path!==prefix+f||p[k].commit!==p.nativeFourSlotRef.commit) fail('NATIVE_SCOPE');
    if(p.nativeSourceRef.commit!==p.nativeFourSlotRef.commit) fail('NATIVE_SOURCE_COMMIT');
    const native=JSON.parse(immutable(p.nativeFourSlotRef,NATIVE)), review=JSON.parse(immutable(p.nativeReviewRef,NATIVE));
    const accepted=JSON.parse(immutable(p.rootAcceptanceRef,NATIVE)), independent=JSON.parse(immutable(p.independentSampleRef,NATIVE));
    if(native.schemaVersion!=='archive-meta-4slot-v0'||native.sourceArchiveFile!==d.sourceArchiveFile||native.sourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||native.dictionaryVersion!==d.dictionaryVersion||native.items?.length!==n) fail('NATIVE_VECTOR_SCOPE');
    if(accepted.schemaVersion!=='m2-s2-root-acceptance-v1'||accepted.examId!==p.examId||accepted.reviewer!=='ROOT'||!accepted.owner||!accepted.sampleReviewer||accepted.owner===accepted.sampleReviewer||accepted.semanticReviewStatus!=='PRO_REVIEW_COMPLETE'||accepted.sourceUnchanged!==true||accepted.sourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||accepted.sourceSha256!==p.nativeSourceRef.sha256||accepted.fourSlotSha256!==p.nativeFourSlotRef.sha256||accepted.reviewSha256!==p.nativeReviewRef.sha256||accepted.independentSampleSha256!==p.independentSampleRef.sha256) fail('ROOT_NATIVE_ACCEPTANCE');
    if(review.schemaVersion!=='m2-s2-meta-review-v1'||review.sourceArchiveFile!==d.sourceArchiveFile||review.sourceGitBlobSha!==native.sourceGitBlobSha||review.examId!==p.examId||review.items?.length!==n||independent.sourceGitBlobSha!==native.sourceGitBlobSha||independent.examId!==p.examId) fail('NATIVE_REVIEW_BINDING');
    const reuse=prior.evidence.sourceReuse;keys(reuse,['kind','reviewedSourceGitBlobSha','currentSourceGitBlobSha']);
    if(reuse.kind!=='UNCHANGED_STUDENT_PAYLOAD'||reuse.reviewedSourceGitBlobSha!==p.nativeSourceRef.gitBlobSha1||reuse.currentSourceGitBlobSha!==p.priorSourceRef.gitBlobSha1) fail('PRIOR_SOURCE_REUSE');
    const observation=JSON.parse(immutable(group.observation,REF,{local:true}));
    keys(observation,['schemaVersion','scope','observer','transportAuthor','reviewedAtUtc','sourceArchiveFile','priorSourceRef','sourceRef','priorCompactRef','rawObservationRef','rows',...ZERO]);
    if(observation.schemaVersion!==REVIEW_SCHEMA||observation.scope!==SCOPE||!observation.observer||!utc(observation.reviewedAtUtc)||observation.transportAuthor!==p.transportAuthor||observation.sourceArchiveFile!==d.sourceArchiveFile||!same(observation.priorSourceRef,p.priorSourceRef)||!same(observation.sourceRef,p.sourceRef)||!same(observation.priorCompactRef,p.priorCompactRef)||!Array.isArray(observation.rows)) fail('OBSERVATION_SCOPE');
    zero(observation);
    const rawObservation=JSON.parse(immutable(observation.rawObservationRef,REF));
    if(rawObservation.schemaVersion!==RAW_REVIEW_SCHEMA||rawObservation.observer!==observation.observer||rawObservation.newMathematicalApproval!==false||rawObservation.newSlotApproval!==false||['sourceWrites','assetWrites','slotChanges'].some(k=>rawObservation[k]!==0)||!Array.isArray(rawObservation.rows)) fail('RAW_OBSERVATION');
    let closure=null, roots=[], rawRoot=null;
    if(group.rootClosure!==null) {
      closure=JSON.parse(immutable(group.rootClosure,ROOT_PATH,{local:true}));
      keys(closure,['schemaVersion','scope','reviewer','transportAuthor','reviewedAtUtc','rawObservationRef','rows',...ZERO]);
      if(closure.schemaVersion!==ROOT_SCHEMA||closure.scope!==ROOT_SCOPE||!closure.reviewer||!utc(closure.reviewedAtUtc)||closure.reviewer===p.transportAuthor||closure.transportAuthor!==p.transportAuthor||!Array.isArray(closure.rows)||!closure.rows.length) fail('ROOT_CURRENT_SCOPE');
      zero(closure);
      rawRoot=JSON.parse(immutable(closure.rawObservationRef,REF));
      if(rawRoot.schemaVersion!==RAW_ROOT_SCHEMA||rawRoot.reviewer!==closure.reviewer||rawRoot.transportAuthor!==p.transportAuthor||!Array.isArray(rawRoot.rows)||ZERO.some(k=>rawRoot[k]!==0)) fail('RAW_ROOT_OBSERVATION');
      if(new Set(closure.rows.map(r=>r.sourceArchiveFile+'#'+r.questionUid)).size!==closure.rows.length) fail('ROOT_DUPLICATE');
      const rootSelection=rows=>rows.map(r=>[r.sourceArchiveFile,...TUPLE.map(k=>r[k]),r.decision]).sort((a,b)=>stable(a).localeCompare(stable(b)));
      if(!same(rootSelection(closure.rows),rootSelection(rawRoot.rows))) fail('RAW_ROOT_COVERAGE');
      roots=closure.rows.filter(r=>r.sourceArchiveFile===d.sourceArchiveFile);
    }
    const groups=['retainedOrdinals','bodyTranscriptionOrdinals','heldOrdinals','unchangedOrdinals'];
    if(groups.some(k=>!ordinals(p[k]))) fail('PARTITION');
    const partition=groups.flatMap(k=>p[k]);
    if(partition.length!==n||new Set(partition).size!==n||!same([...partition].sort((a,b)=>a-b),bank.map(sourceNumber).sort((a,b)=>a-b))) fail('PARTITION');
    const observedOrdinals=observation.rows.map(r=>r.ordinal).sort((a,b)=>a-b);
    if(!same(observedOrdinals,[...p.retainedOrdinals,...p.bodyTranscriptionOrdinals,...p.heldOrdinals].sort((a,b)=>a-b))) fail('OBSERVED_COVERAGE');
    const lut=buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
    const neededRoots=[], seen=new Set();
    for(let i=0;i<n;i++) {
      const q=bank[i], old=before[i], original=nativeBank[i], ordinal=sourceNumber(q);
      const item=prior.items.find(x=>x.ordinal===ordinal), ids=(identity.records||[]).filter(x=>x.sourceArchiveFile===d.sourceArchiveFile&&x.sourceOrdinal===i+1), id=ids[0];
      if(!item||sourceNumber(old)!==ordinal||sourceNumber(original)!==ordinal||seen.has(ordinal)||ids.length!==1||!UID.test(id?.questionUid||'')||id.status!=null&&id.status!=='VERIFIED'||(identity.records||[]).filter(x=>x.questionUid===id.questionUid).length!==1||id.sourceQuestionNo!=null&&String(id.sourceQuestionNo)!==sourceIdentityNumber(q)) fail('FULL_IDENTITY');
      seen.add(ordinal);
      const nativeRows=native.items.filter(x=>x.sourceOrdinal===i+1&&x.questionUid===id.questionUid), reviewed=review.items.filter(x=>x.sourceOrdinal===i+1&&x.questionUid===id.questionUid);
      if(nativeRows.length!==1||reviewed.length!==1||!same(compactItem(nativeRows[0],lut,new Map([[String(i+1),{ordinal}]])),item)) fail('ORIGINAL_VECTOR');
      if(payloadHash(original)!==payloadHash(old)||!same(assetRefs(original),assetRefs(old))) fail('NATIVE_PRIOR_PAYLOAD');
      for(const ap of assetRefs(original)) if(!gitBytes(root,['show',p.nativeSourceRef.commit+':'+ap]).equals(gitBytes(root,['show',p.priorSourceRef.commit+':'+ap]))) fail('NATIVE_PRIOR_ASSET');
      if(p.unchangedOrdinals.includes(ordinal)) {
        if(!same(old,q)||payloadHash(old)!==payloadHash(q)||!same(assetRefs(old),assetRefs(q))) fail('UNOBSERVED_ROW');
        for(const ap of assetRefs(q)) {
          const priorAsset=gitBytes(root,['show',p.priorSourceRef.commit+':'+ap]), currentAsset=gitBytes(root,['show',p.sourceRef.commit+':'+ap]);
          if(!priorAsset.equals(currentAsset)||!currentAsset.equals(fs.readFileSync(safe(root,ap)))) fail('UNOBSERVED_ASSET');
        }
        continue;
      }
      const r=observation.rows.find(x=>x.ordinal===ordinal);
      keys(r,[...TUPLE,'continuityKind','compactItemSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','priorStudentPayloadSha256','currentStudentPayloadSha256','changedFields','inspection','priorAssets','currentAssets','captureSha256s','observed']);
      const tuple={questionUid:id.questionUid,sourceOrdinal:i+1,sourceQuestionNo:sourceIdentityNumber(q),ordinal};
      if(TUPLE.some(k=>r[k]!==tuple[k])||!KINDS.has(r.continuityKind)||r.compactItemSha256!==sha(stable(item))||r.priorWholeQuestionSha256!==sha(stable(old))||r.currentWholeQuestionSha256!==sha(stable(q))||r.priorStudentPayloadSha256!==payloadHash(old)||r.currentStudentPayloadSha256!==payloadHash(q)||!same(r.changedFields,changed(old,q))) fail('OBSERVED_ROW');
      const rawRows=rawObservation.rows.filter(x=>x.questionUid===id.questionUid&&x.sourceOrdinal===i+1);
      if(rawRows.length!==1) fail('RAW_OBSERVATION_ROW');
      const raw=rawRows[0];
      if(raw.actualObserver!==observation.observer||raw.beforeQuestionSha256!==r.priorWholeQuestionSha256||raw.currentQuestionSha256!==r.currentWholeQuestionSha256||raw.beforeStudentSha256!==r.priorStudentPayloadSha256||raw.currentStudentSha256!==r.currentStudentPayloadSha256||raw.compactItemSha256!==r.compactItemSha256||!same(raw.unchangedFourSlot,item)||!same(raw.changedFields,r.changedFields)||['fullStem','choices','answer','writtenSolution','nativeFourSlot','priorAndCurrentReferencedRenderers'].some(k=>raw.actualRead?.[k]!==true)||!same(r.captureSha256s,[raw.card?.cardSha256])) fail('RAW_OBSERVATION_ROW');
      if(!exactRef(raw.priorSourceRef,p.priorSourceRef)||!exactRef(raw.currentSourceRef,p.sourceRef)) fail('RAW_OBSERVATION_SOURCE');
      const card=raw.card;
      if(card.questionUid!==r.questionUid||card.sourceOrdinal!==r.sourceOrdinal||card.beforeQuestionSha256!==r.priorWholeQuestionSha256||card.currentQuestionSha256!==r.currentWholeQuestionSha256||card.beforeStudentSha256!==r.priorStudentPayloadSha256||card.currentStudentSha256!==r.currentStudentPayloadSha256||card.compactItemSha256!==r.compactItemSha256) fail('RAW_OBSERVATION_CARD');
      if(!Array.isArray(card.assets)||card.assets.some(a=>!['prior','current'].includes(a.phase)||a.rawBytesVerified!==true)||!exactAssetRefs(card.assets.filter(a=>a.phase==='prior'),r.priorAssets)||!exactAssetRefs(card.assets.filter(a=>a.phase==='current'),r.currentAssets)) fail('RAW_OBSERVATION_RENDERERS');
      if(r.continuityKind==='RENDERER_PRESENTATION_CONTINUITY'&&raw.decision!=='RETAIN_EXISTING_VECTOR') fail('RAW_RETAIN_DECISION');
      inspected(r);assets(r.priorAssets,old,p.priorSourceRef.commit,false,true);assets(r.currentAssets,q,p.sourceRef.commit,true,true);
      const body=p.bodyTranscriptionOrdinals.includes(ordinal), held=p.heldOrdinals.includes(ordinal);
      if(body!==(r.continuityKind==='BODY_TRANSCRIPTION_CONTINUITY')||held!==(r.continuityKind==='WITHHOLD_CURRENT_RENDERER')) fail('ROW_KIND');
      if(!body&&!held) presentation(old,q,r.changedFields);
      if(body) {
        if(!same(r.changedFields,['content','image','layoutTag'])||typeof old.content!=='string'||typeof q.content!=='string'||/<(?:table|tr|td|th)\b|^\s*\|.+\|/im.test(q.content)) fail('BODY_FIELDS');
        if(!assetRefs(old).length) fail('BODY_PRIOR_FIGURE_REQUIRED');
        if(q.image==='') {
          // The actual proof moved its image into the transcribed HTML. This
          // empty scalar is allowed only with a still-bound local figure.
          const inline=bodyInlineFigures(q.content);
          if(!inline.length||inline.some(ap=>!r.currentAssets.some(a=>a.path===ap))) fail('BODY_INLINE_FIGURE_REQUIRED');
          presentation(old,q,['layoutTag']);
        } else presentation(old,q,['image','layoutTag']);
      }
      const special=body||held||r.continuityKind==='ANNOTATION_ONLY_REMOVAL_CONTINUITY';
      if(special) {
        neededRoots.push(ordinal);
        const matches=roots.filter(x=>x.questionUid===id.questionUid&&x.sourceOrdinal===i+1);
        if(matches.length!==1) fail('ROOT_ROW_REQUIRED');
        const rr=matches[0];
        keys(rr,[...TUPLE,'sourceArchiveFile','decision','priorSourceRef','sourceRef','priorCompactRef','compactItemSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','priorStudentPayloadSha256','currentStudentPayloadSha256','inspection','priorAssets','currentAssets','captureSha256s','observed','bodyTranscription','classification']);
        if(TUPLE.some(k=>rr[k]!==tuple[k])||rr.decision!==r.continuityKind||!same(rr.priorSourceRef,p.priorSourceRef)||!same(rr.sourceRef,p.sourceRef)||!same(rr.priorCompactRef,p.priorCompactRef)||['compactItemSha256','priorWholeQuestionSha256','currentWholeQuestionSha256','priorStudentPayloadSha256','currentStudentPayloadSha256'].some(k=>rr[k]!==r[k])) fail('ROOT_ROW_BINDING');
        const originals=rawRoot.rows.filter(x=>x.questionUid===id.questionUid&&x.sourceOrdinal===i+1&&x.sourceArchiveFile===d.sourceArchiveFile);
        if(originals.length!==1) fail('RAW_ROOT_ROW');
        const originalRoot=originals[0];
        const priorProblemRead=assetRefs(old).length>0?originalRoot.actualReads?.priorProblemAsset===true:held&&originalRoot.actualReads?.priorProblemAsset===false;
        if(TUPLE.some(k=>originalRoot[k]!==tuple[k])||originalRoot.decision!==rr.decision||originalRoot.beforeQuestionSha256!==rr.priorWholeQuestionSha256||originalRoot.currentQuestionSha256!==rr.currentWholeQuestionSha256||originalRoot.beforeStudentSha256!==rr.priorStudentPayloadSha256||originalRoot.currentStudentSha256!==rr.currentStudentPayloadSha256||originalRoot.compactItemSha256!==rr.compactItemSha256||!same(originalRoot.preservedFourSlot,item)||!priorProblemRead||['currentProblemAsset','priorAndCurrentStem','allChoices','answerAndWrittenSolution','nativeFourSlotsAndReasons'].some(k=>originalRoot.actualReads?.[k]!==true)||!same(rr.captureSha256s,[originalRoot.captureRef?.sha256])) fail('RAW_ROOT_ROW');
        if(!exactRef(originalRoot.priorSourceRef,p.priorSourceRef)||!exactRef(originalRoot.currentSourceRef,p.sourceRef)||!exactAssetRefs(originalRoot.priorAssets,rr.priorAssets)||!exactAssetRefs(originalRoot.currentAssets,rr.currentAssets)) fail('RAW_ROOT_RENDERERS');
        inspected(rr);assets(rr.priorAssets,old,p.priorSourceRef.commit,false,true);assets(rr.currentAssets,q,p.sourceRef.commit,true,true);
        if(body) {
          const b=rr.bodyTranscription;
          keys(b,['kind','contentBeforeSha256','contentAfterSha256','literalStatementsPreserved','blankOrderPreserved','givenConditionsPreserved','noAddedHintOrInference','priorBlankOrder','blankOrder','blankSpans']);
          if(b.kind!=='PROOF_TEXT_WITH_ORDERED_BLANKS'||b.contentBeforeSha256!==sha(old.content)||b.contentAfterSha256!==sha(q.content)||['literalStatementsPreserved','blankOrderPreserved','givenConditionsPreserved','noAddedHintOrInference'].some(k=>b[k]!==true)||!Array.isArray(b.blankOrder)||!b.blankOrder.length||!same(b.priorBlankOrder,b.blankOrder)||!Array.isArray(b.blankSpans)||b.blankSpans.length!==b.blankOrder.length) fail('BODY_TRANSCRIPTION');
          const rb=originalRoot.bodyTranscription;
          if(rb?.transcriptionKind!==b.kind||rb.contentBeforeSha!==b.contentBeforeSha256||rb.contentAfterSha!==b.contentAfterSha256||rb.nonTranscriptionQuestionFieldsExact!==true||['literalStatementsPreserved','blankOrderPreserved','givenConditionsPreserved','noAddedHintOrInference'].some(k=>rb[k]!==true)||!same(rb.blankOrder,b.blankOrder)||!same(rb.blankSpans,b.blankSpans)) fail('RAW_BODY_TRANSCRIPTION');
          let end=-1;
          for(let j=0;j<b.blankSpans.length;j++) {
            const s=b.blankSpans[j];keys(s,['label','start','end']);
            if(typeof s.label!=='string'||!s.label||s.label.length>32||s.label!==b.blankOrder[j]||!Number.isSafeInteger(s.start)||!Number.isSafeInteger(s.end)||s.start<end||s.start<0||s.end<=s.start||q.content.slice(s.start,s.end)!==s.label) fail('BODY_BLANK_ORDER');
            end=s.end;
          }
          if(rr.classification!==null) fail('BODY_CLASSIFICATION');
        } else if(rr.bodyTranscription!==null) fail('UNEXPECTED_BODY');
        if(held&&(typeof rr.classification!=='string'||!rr.classification.trim()||rr.classification!==originalRoot.reason)||!held&&!body&&rr.classification!==null) fail('CLASSIFICATION');
      }
    }
    if(!same(roots.map(r=>r.ordinal).sort((a,b)=>a-b),neededRoots.sort((a,b)=>a-b))) fail('ROOT_ROW_COVERAGE');
    const expected=JSON.parse(JSON.stringify(prior));
    expected.sourceGitBlobSha=p.sourceRef.gitBlobSha1;expected.evidence[GROUP]=group;
    for(const ordinal of p.heldOrdinals) {
      const i=bank.findIndex(q=>sourceNumber(q)===ordinal),q=bank[i],r=observation.rows.find(x=>x.ordinal===ordinal);
      expected.items.find(x=>x.ordinal===ordinal).registrationHold={schemaVersion:HOLD_SCHEMA,reason:REASON,questionUid:r.questionUid,sourceOrdinal:i+1,sourceQuestionNo:sourceIdentityNumber(q),ordinal,sourceGitBlobSha:p.sourceRef.gitBlobSha1,wholeQuestionSha256:sha(stable(q)),studentPayloadSha256:payloadHash(q),sourceFingerprint:identityHash(q),m2ContinuityCarrier:group.carrier,m2ContinuityObservation:group.observation,m2RootClosure:group.rootClosure,nextAction:p.nextAction};
    }
    if(!same(expected,d)) fail('COMPACT_CHANGED');
    return [];
  } catch(error) {
    return [String(error.message).startsWith('M2_CURRENT_CONTINUITY_')?error.message:'M2_CURRENT_CONTINUITY_EVIDENCE_UNAVAILABLE'];
  }
}

module.exports={CARRIER_SCHEMA,REVIEW_SCHEMA,ROOT_SCHEMA,RAW_REVIEW_SCHEMA,RAW_ROOT_SCHEMA,HOLD_SCHEMA,REASON,SCOPE,ROOT_SCOPE,GROUP,ZERO,has,inScope,createObligationReader,evidenceDigests,validateFile};
