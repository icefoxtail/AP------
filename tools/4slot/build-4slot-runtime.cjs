#!/usr/bin/env node
// Register already-reviewed compact 4slot files. Never author slots or change source/approval data.
'use strict';
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const crypto = require('node:crypto'), { execFileSync } = require('node:child_process');
const consumer = require('../../archive/item-4slot.js');
const ROOT = path.resolve(__dirname, '../..');
const INPUT = 'archive/data/item-4slot/';
const OUTPUT = 'archive/data/item-4slot-index.json';
const SCHEMA = 'archive-item-4slot-runtime-v1';
const SLOTS = ['given', 'goal', 'method', 'condition'];
const FORMATS = new Set(['단일 정답','옳은 것 고르기','옳지 않은 것 고르기','보기(ㄱㄴㄷ) 판정','보기 판정','빈칸 채우기','단답','서술','증명','소문항 묶음']);
const STUDENT = ['id','number','questionType','content','question','choices','answer','solution','image','images','figureSvg','svg','solutionImage','solutionImages','solutionFigureSvg'];
const stable = value => JSON.stringify(value, (_, v) => v && !Array.isArray(v) && typeof v === 'object' ? Object.fromEntries(Object.keys(v).sort().map(k => [k, v[k]])) : v);
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
const blob = value => crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${Buffer.byteLength(value)}\0`), Buffer.from(value)])).digest('hex');
const payloadHash = q => sha(stable(Object.fromEntries(STUDENT.map(k => [k, q[k] ?? null]))));
// Same identity fingerprint contract as sync-question-identity-map-v1.mjs (not a new UID formula).
const identityHash = q => sha(JSON.stringify({content:q.content??null, choices:Array.isArray(q.choices)?q.choices:null, answer:q.answer??null, solution:q.solution??null, image:q.image??null}));
const BUILDER_SHA = sha(fs.readFileSync(__filename));
const own = (o, k) => Object.prototype.hasOwnProperty.call(o || {}, k);
function safe(root, rel) {
  if (typeof rel !== 'string' || !rel || /[\\\0-\x1f]/.test(rel) || path.posix.isAbsolute(rel) || rel.split('/').some(x => !x || x === '..' || x === '.')) throw Error('UNSAFE_PATH');
  const full = path.resolve(root, rel), realRoot = fs.realpathSync(root);
  let check = full;
  while (!fs.existsSync(check)) check = path.dirname(check);
  if (!(fs.realpathSync(check) + path.sep).startsWith(realRoot + path.sep)) throw Error('SYMLINK_OUTSIDE_ROOT');
  return full;
}
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name,'en')).flatMap(e => {
    const p=path.join(dir,e.name);
    if (e.isSymbolicLink()) throw Error('SYMLINK_INPUT:'+p);
    return e.isDirectory() ? walk(p) : [p];
  });
}
function loadBank(text) {
  const c={window:{},console:{log(){},warn(){},error(){}}}; c.globalThis=c;
  vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});
  vm.runInContext(String(text),c,{timeout:1500});
  const b=c.window.questionBank||c.window.questions||c.questionBank||c.questions||c.window.examData?.questions;
  if (!Array.isArray(b)) throw Error('UNKNOWN_EXAM_SCHEMA');
  return JSON.parse(JSON.stringify(b));
}
function git(root,args) {
  try { return execFileSync('git',['-C',root,...args],{encoding:'utf8',maxBuffer:32*1024*1024,timeout:15000,stdio:['ignore','pipe','pipe']}); }
  catch { return null; }
}
// Existing compact ordinal is a printed numeric question number. Named source labels
// use an explicit sourceQuestionNo and a physical ordinal, so q01/s01 never become NaN.
function numberKey(value) {
  if (typeof value !== 'number' && typeof value !== 'string') throw Error('SOURCE_NUMBER_INVALID');
  const label=String(value).trim();
  if (!label || label.length>80 || /[\x00-\x1f]/.test(label)) throw Error('SOURCE_NUMBER_INVALID');
  if (/^\d+$/.test(label)) { const n=Number(label); if(!Number.isSafeInteger(n)||n<1)throw Error('SOURCE_NUMBER_INVALID'); return String(n); }
  if (typeof value !== 'string') throw Error('SOURCE_NUMBER_INVALID');
  return label;
}
function sourceNumbers(bank) {
  const map=new Map();
  for (let i=0;i<bank.length;i++) {
    const q=bank[i], n=numberKey(q.id??q.number);
    if (map.has(n)) throw Error('AMBIGUOUS_SOURCE_NUMBER');
    map.set(n,{q,ordinal:i+1});
  }
  return map;
}
function validateCompact(d, rel, dict) {
  const errors=[];
  if(d.schemaVersion!=='archive-meta-4slot-compact-v1')errors.push('UNSUPPORTED_SCHEMA');
  if(typeof d.sourceArchiveFile!=='string'||!d.sourceArchiveFile.endsWith('.js')||rel!==INPUT+d.sourceArchiveFile.replace(/\.js$/,'.4slot.json'))errors.push('SOURCE_PATH_MISMATCH');
  if(!/^[a-f0-9]{40}$/.test(d.sourceGitBlobSha||''))errors.push('SOURCE_BLOB_MISSING');
  if(!dict)errors.push('DICTIONARY_VERSION_UNKNOWN');
  if(!d.reviewedBy||!String(d.reviewedBy.agent||'').trim()||!d.reviewedBy.at||!Array.isArray(d.reviewedBy.sampled))errors.push('REVIEW_REFERENCE_MISSING');
  if(!d.evidence||['branch','commit','path'].some(k=>typeof d.evidence[k]!=='string'||!d.evidence[k].trim()))errors.push('EVIDENCE_REFERENCE_MISSING');
  if(!Array.isArray(d.items)||!d.items.length)errors.push('ITEMS_EMPTY');
  return errors;
}
function validateItem(it, dict) {
  const errors=[];
  if(!Number.isInteger(it.ordinal)||it.ordinal<1)errors.push('ORDINAL_INVALID');
  if(own(it,'sourceQuestionNo')){try{numberKey(it.sourceQuestionNo);}catch{errors.push('SOURCE_QUESTION_NO_INVALID');}}
  if(!FORMATS.has(it.format))errors.push('FORMAT_INVALID');
  for(const s of SLOTS) {
    const ids=it[s]; if(!Array.isArray(ids)){errors.push('SLOT_ARRAY_REQUIRED:'+s);continue;}
    if(new Set(ids).size!==ids.length)errors.push('DUPLICATE_TERM:'+s);
    if(['goal','method'].includes(s)&&ids.length===0)errors.push('REQUIRED_SLOT_EMPTY:'+s);
    for(const id of ids) {
      const t=dict.terms.get(id);
      if(!Number.isInteger(id)||!t||['RETIRED','CANDIDATE'].includes(t.status))errors.push('INVALID_TERM:'+s+':'+id);
    }
  }
  if(!Array.isArray(it.candidates)||it.candidates.some(x=>typeof x!=='string'))errors.push('CANDIDATES_INVALID');
  return errors;
}
function dictionaries(root) {
  const out=new Map();
  for(const f of walk(safe(root,'docs/architecture/4slot')).filter(f=>/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/.test(f))) {
    const raw=fs.readFileSync(f), d=JSON.parse(raw);
    if(typeof d.dictionaryVersion!=='string'||!Array.isArray(d.terms))throw Error('DICTIONARY_INVALID:'+f);
    const terms=new Map();
    for(const t of d.terms){if(!Number.isInteger(t.id)||terms.has(t.id))throw Error('DICTIONARY_DUPLICATE_ID:'+f);terms.set(t.id,t);}
    if(out.has(d.dictionaryVersion))throw Error('DICTIONARY_DUPLICATE_VERSION:'+d.dictionaryVersion);
    out.set(d.dictionaryVersion,{terms,sha256:sha(raw),path:path.relative(root,f).split(path.sep).join('/')});
  }
  return out;
}
function assetRefs(q) {
  const found=new Set(), text=JSON.stringify(Object.fromEntries(STUDENT.map(k=>[k,q[k]??null]))).replaceAll('\\/','/');
  // Local reference bytes are monitored; remote/R2 objects are not fetched or called visually verified.
  for(const m of text.matchAll(/(?:archive\/)?assets\/[A-Za-z0-9_가-힣%./+()@ -]+\.(?:png|jpe?g|gif|webp|svg)/gi))found.add(m[0].startsWith('archive/')?m[0]:'archive/'+m[0]);
  return [...found].sort();
}
function assetsFor(root,bank) {
  const refs=new Map();
  for(const q of bank)for(const rel of assetRefs(q)) {
    if(refs.has(rel))continue;
    try{const f=safe(root,rel);refs.set(rel,fs.existsSync(f)?sha(fs.readFileSync(f)):null);}catch{refs.set(rel,null);}
  }
  return Object.fromEntries(refs);
}
function build(root=ROOT,{previous,readBlob,reuseCache=true}={}) {
  root=path.resolve(root);
  const output=safe(root,OUTPUT);
  previous=previous??(fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):null);
  if(previous&&previous.schemaVersion!==SCHEMA)throw Error('PREVIOUS_INDEX_SCHEMA_INVALID');
  const dicts=dictionaries(root), identityPath=safe(root,'archive/data/question_identity_map.json');
  const identity=fs.existsSync(identityPath)?JSON.parse(fs.readFileSync(identityPath,'utf8')):{records:[]};
  const joins=new Map(), uidUses=new Map();
  for(const r of identity.records||[]){const key=`${r.sourceArchiveFile}#${r.sourceOrdinal}`;if(!joins.has(key))joins.set(key,[]);joins.get(key).push(r);uidUses.set(r.questionUid,(uidUses.get(r.questionUid)||0)+1);}
  const oldFiles=new Map((previous?.files||[]).map(f=>[f.path,f]));
  const records=[], files=[], pending=[], observed=[], stats={revalidatedFiles:0,reusedFiles:0};
  const inputs=walk(safe(root,INPUT.slice(0,-1)));
  for(const full of inputs){
    const rel=path.relative(root,full).split(path.sep).join('/'), raw=fs.readFileSync(full);
    observed.push([rel,sha(raw)]);
    let file={path:rel,compactSha256:sha(raw)}, d;
    const fail=(reason,ordinal=null)=>pending.push({path:rel,...(ordinal==null?{}:{ordinal}),reason});
    try{
      if(!rel.endsWith('.4slot.json'))throw Error('UNSUPPORTED_INPUT_FILE');
      d=JSON.parse(raw);file.itemCount=Array.isArray(d.items)?d.items.length:0;const dict=dicts.get(d.dictionaryVersion), errors=validateCompact(d,rel,dict);
      if(errors.length)throw Error(errors.join('|'));
      const sf=safe(root,'archive/exams/'+d.sourceArchiveFile), sourceRaw=fs.readFileSync(sf), sourceBlob=blob(sourceRaw);
      const bank=loadBank(sourceRaw), byNumber=sourceNumbers(bank), assetDigests=assetsFor(root,bank);
      const relevantIdentity=bank.map((_,i)=>joins.get(`${d.sourceArchiveFile}#${i+1}`)||[]);
      const inputHash=sha(stable([BUILDER_SHA,file.compactSha256,sourceBlob,dict.sha256,relevantIdentity,relevantIdentity.flat().map(r=>uidUses.get(r.questionUid)),assetDigests]));
      const old=oldFiles.get(rel);
      file={...file,sourceArchiveFile:d.sourceArchiveFile,sourceGitBlobSha:d.sourceGitBlobSha,currentSourceBlobSha:sourceBlob,dictionaryVersion:d.dictionaryVersion,dictionarySha256:dict.sha256,reviewedBy:d.reviewedBy,evidence:d.evidence,inputHash,assetDigests,itemCount:d.items.length};
      observed.push(['archive/exams/'+d.sourceArchiveFile,sha(sourceRaw)],[dict.path,dict.sha256]);
      for(const [p,h]of Object.entries(assetDigests))if(h)observed.push([p,h]);
      // No repeated semantic review. Cached rows are re-used only for identical input bytes and identity joins.
      if(reuseCache&&old?.inputHash===inputHash&&previous?.schemaVersion===SCHEMA){
        files.push(old);records.push(...previous.records.filter(r=>r.compactPath===rel));pending.push(...previous.pending.filter(r=>r.path===rel));stats.reusedFiles++;continue;
      }
      stats.revalidatedFiles++;
      let historical=null;
      if(sourceBlob!==d.sourceGitBlobSha){
        const text=readBlob?readBlob(d.sourceGitBlobSha):git(root,['cat-file','blob',d.sourceGitBlobSha]);
        if(text&&blob(text)===d.sourceGitBlobSha)historical=sourceNumbers(loadBank(text));
      }
      const baselineHashes={}, oldSame=old?.compactSha256===file.compactSha256;
      const baselineAssets=oldSame?(old.baselineAssetDigests||old.assetDigests):assetDigests;
      file.baselineAssetDigests=baselineAssets;
      file.assetVerification='LOCAL_CHANGE_MONITORING_ONLY_NOT_VISUAL_QA';
      const seen=new Map(),ordinals=new Map();for(const it of d.items){let k;try{k=numberKey(it.sourceQuestionNo??it.ordinal);}catch{k='INVALID';}seen.set(k,(seen.get(k)||0)+1);ordinals.set(it.ordinal,(ordinals.get(it.ordinal)||0)+1);}
      for(const it of d.items){
        const errors=validateItem(it,dict);let n;try{n=numberKey(it.sourceQuestionNo??it.ordinal);}catch{n='INVALID';}
        if(seen.get(n)!==1||ordinals.get(it.ordinal)!==1)errors.push('DUPLICATE_ORDINAL');
        const cur=byNumber.get(n);
        if(cur&&own(it,'sourceQuestionNo')&&it.ordinal!==cur.ordinal)errors.push('NAMED_ORDINAL_MISMATCH');
        if(!cur)errors.push('SOURCE_NUMBER_MISSING');
        if(errors.length){fail(errors.join('|'),it.ordinal);continue;}
        const ids=joins.get(`${d.sourceArchiveFile}#${cur.ordinal}`)||[], id=ids[0];
        if(ids.length!==1||!/^qid_v1_[a-f0-9]{64}$/.test(id?.questionUid||'')||uidUses.get(id.questionUid)!==1){fail('IDENTITY_JOIN_MISSING_OR_DUPLICATE',it.ordinal);continue;}
        if(id.status!=null&&id.status!=='VERIFIED'){fail('IDENTITY_STATE_INVALID',it.ordinal);continue;}
        let sourceUidReconciled=false;
        if(cur.q.questionUid&&cur.q.questionUid!==id.questionUid){
          // Only an explicit, source-bound compact reconciliation can resolve an unused author UID.
          // Known canonical UID collisions and any fingerprint drift remain hard failures.
          const a=it.uidReconciliation;
          sourceUidReconciled=Boolean(a&&a.basis==='EXACT_IDENTITY_SOURCE_FINGERPRINT'&&a.legacyUid===cur.q.questionUid&&a.canonicalUid===id.questionUid&&!uidUses.has(a.legacyUid)&&a.sourceFingerprint===id.sourceFingerprint&&id.sourceFingerprint===identityHash(cur.q));
          if(!sourceUidReconciled){fail('SOURCE_UID_CONFLICT',it.ordinal);continue;}
        }
        if(id.sourceQuestionNo!=null&&String(id.sourceQuestionNo).trim()&&numberKey(id.sourceQuestionNo)!==n){fail('IDENTITY_NUMBER_MISMATCH',it.ordinal);continue;}
        // Identity maps own stable UID/path/ordinal, not current content freshness. Their native writer
        // intentionally preserves historical fingerprints for existing rows. Compact source-blob +
        // per-question baseline below proves 4slot freshness; do not mutate or approve global identity.
        const identityFingerprintStatus=id.sourceFingerprint===identityHash(cur.q)?'CURRENT':'HISTORICAL';
        const currentPayload=payloadHash(cur.q), past=historical?.get(n);
        const baseline=sourceBlob===d.sourceGitBlobSha?currentPayload:past?payloadHash(past.q):oldSame?old.baselinePayloadHashes?.[it.ordinal]:null;
        if(baseline)baselineHashes[it.ordinal]=baseline;
        if(!baseline){fail('SOURCE_BASELINE_UNAVAILABLE',it.ordinal);continue;}
        if(currentPayload!==baseline){fail('STALE_STUDENT_PAYLOAD',it.ordinal);continue;}
        // Changed local figure bytes invalidate only rows that reference that file; never discard other rows.
        const alteredAsset=oldSame&&assetRefs(cur.q).some(p=>own(baselineAssets,p)&&baselineAssets[p]!==assetDigests[p]);
        if(alteredAsset){fail('STALE_ASSET_BYTES',it.ordinal);continue;}
        const row={questionUid:id.questionUid,sourceArchiveFile:d.sourceArchiveFile,sourceOrdinal:cur.ordinal,sourceQuestionNo:n,compactPath:rel,dictionaryVersion:d.dictionaryVersion,format:it.format,...Object.fromEntries(SLOTS.map(s=>[s,it[s]])),candidates:it.candidates,...(sourceUidReconciled?{uidReconciliation:it.uidReconciliation}:{}),identityFingerprintStatus,sourceBinding:sourceBlob===d.sourceGitBlobSha?'EXACT_BLOB':'UNCHANGED_STUDENT_PAYLOAD',registrationStatus:'REGISTERED',independentReviewClaim:false};
        records.push(row);
      }
      for(const n of byNumber.keys())if(!seen.has(n))fail('FOUR_SLOT_ITEM_MISSING',n);
      file.baselinePayloadHashes=baselineHashes;
      file.status=pending.some(r=>r.path===rel)?'SUPPLEMENT_PENDING':'REGISTERED';files.push(file);
    }catch(e){file.status='SUPPLEMENT_PENDING';files.push(file);fail(e.code==='ENOENT'?'SOURCE_OR_INPUT_MISSING':e.message);}
  }
  records.sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'en'));
  if(new Set(records.map(r=>r.questionUid)).size!==records.length)throw Error('DUPLICATE_RUNTIME_UID');
  files.sort((a,b)=>a.path.localeCompare(b.path,'en'));
  pending.sort((a,b)=>(a.path+'#'+(a.ordinal||0)+a.reason).localeCompare(b.path+'#'+(b.ordinal||0)+b.reason,'en'));
  const terms={};for(const version of [...new Set(records.map(r=>r.dictionaryVersion))].sort()){
    const ids=new Set(records.filter(r=>r.dictionaryVersion===version).flatMap(r=>SLOTS.flatMap(s=>r[s])));
    terms[version]=[...ids].sort((a,b)=>a-b).map(id=>{const t=dicts.get(version).terms.get(id);return {id,ko:t.ko,status:t.status||'ACTIVE',...(t.aliasOf?{aliasOf:t.aliasOf}:{})};});
  }
  const result={schemaVersion:SCHEMA,builderSha256:BUILDER_SHA,authority:'MAIN_MERGED_REVIEWED_COMPACT',sourceMutation:0,semanticApprovalMutation:0,counts:{files:files.length,items:files.reduce((n,f)=>n+(f.itemCount||0),0),registered:records.length,pending:pending.length,withCandidates:records.filter(r=>r.candidates.length).length,identityFingerprintHistorical:records.filter(r=>r.identityFingerprintStatus==='HISTORICAL').length},files,records,pending,terms};
  result.inputDigest=sha(stable([files.map(f=>[f.path,f.inputHash||f.compactSha256]),pending]));
  return {index:result,observed,stats};
}
function serialize(x){return JSON.stringify(x)+'\n';}
function verify(index) {
  const api=consumer.createIndex(index);
  if(api.size!==index.records.length)throw Error('CONSUMER_COUNT_MISMATCH');
  for(const row of index.records){const actual=api.get(row.questionUid);if(stable(actual)!==stable(row))throw Error('CONSUMER_VALUE_MISMATCH');
    for(const slot of SLOTS)for(const term of row[slot])if(!api.hasTerm(row.questionUid,slot,term,row.dictionaryVersion))throw Error('CONSUMER_POSTING_MISMATCH');}
  return {schemaVersion:SCHEMA,status:index.pending.length?'PASS_WITH_SUPPLEMENTS':'PASS',verified:index.records.length,pending:index.pending.length,indexSha256:sha(serialize(index)),sourceMutation:0,semanticApprovalMutation:0};
}
function run(root=ROOT,{write=false,check=false,report}={}) {
  const built=build(root,{reuseCache:!check}), verification=verify(built.index), out=safe(root,OUTPUT), text=serialize(built.index);
  for(const [p,h]of built.observed)if(sha(fs.readFileSync(safe(root,p)))!==h)throw Error('INPUT_CHANGED_DURING_BUILD:'+p);
  const changed=!fs.existsSync(out)||fs.readFileSync(out,'utf8')!==text;
  if(check&&changed)throw Error('FOUR_SLOT_RUNTIME_DRIFT');
  if(write&&changed){fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out+'.tmp',text);fs.renameSync(out+'.tmp',out);}
  const result={...verification,...built.stats,counts:built.index.counts,changed,write,output:OUTPUT,inputDigest:built.index.inputDigest,sourceFiles:built.index.files.map(f=>({path:f.path,sha256:f.compactSha256,status:f.status})),pendingItems:built.index.pending};
  if(report){fs.mkdirSync(path.dirname(path.resolve(report)),{recursive:true});fs.writeFileSync(report,JSON.stringify(result,null,2)+'\n');}
  return result;
}
module.exports={build,run,verify,loadBank,blob,sha,payloadHash,identityHash,validateItem,validateCompact,safe,OUTPUT,SCHEMA,SLOTS,numberKey,sourceNumbers};
if(require.main===module){try{const args=process.argv.slice(2),opt={};let root=ROOT;for(let i=0;i<args.length;i++){const a=args[i];if(a==='--write')opt.write=true;else if(a==='--check')opt.check=true;else if(a==='--report')opt.report=args[++i];else if(a==='--root')root=path.resolve(args[++i]);else throw Error('UNKNOWN_ARGUMENT:'+a);}if(opt.write&&opt.check)throw Error('WRITE_CHECK_MUTUALLY_EXCLUSIVE');console.log(JSON.stringify(run(root,opt),null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
