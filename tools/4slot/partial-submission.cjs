'use strict';
// Explicit partial scope and public, content-free import receipts. These checks
// never grant native semantic approval or fill an unsubmitted question.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const {sourceNumber,sourceIdentityNumber}=require('./exam-items.cjs');
const SLOTS=['given','goal','method','condition'];
const SCOPE='PARTIAL_UIDS',EVIDENCE_SCHEMA='archive-4slot-private-import-evidence-v1';
const RECEIPT_SCHEMA='archive-4slot-private-import-receipt-v1',RECEIPTS='archive/data/item-4slot-receipts/v1/';
const DECISION='ACCEPT_CURRENT_SOURCE_QUOTE_AND_UNCHANGED_FOUR_SLOT_VECTOR_ROLE';
const SHA=/^[a-f0-9]{64}$/,GIT=/^[a-f0-9]{40}$/,UID=/^qid_v1_[a-f0-9]{64}$/;
const stable=x=>JSON.stringify(x,(_,v)=>v&&typeof v==='object'&&!Array.isArray(v)?Object.fromEntries(Object.keys(v).sort().map(k=>[k,v[k]])):v);
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const blob=x=>crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${Buffer.byteLength(x)}\0`),Buffer.from(x)])).digest('hex');
const eq=(a,b)=>stable(a)===stable(b),fail=code=>{throw Error('PARTIAL_4SLOT:'+code);};
function keys(x,expected,code){if(!x||Array.isArray(x)||typeof x!=='object'||!eq(Object.keys(x).sort(),[...expected].sort()))fail(code);}
function safe(root,rel){
 if(typeof rel!=='string'||!rel||path.isAbsolute(rel)||/[\\\0-\x1f]/.test(rel)||rel.split('/').some(x=>!x||x==='.'||x==='..'))fail('UNSAFE_PATH');
 let full=root;for(const part of rel.split('/')){full=path.join(full,part);if(fs.existsSync(full)&&fs.lstatSync(full).isSymbolicLink())fail('SYMLINK_INPUT');}return full;
}
function loadBank(bytes){const c={window:{},console:{log(){},warn(){},error(){}}};c.globalThis=c;vm.createContext(c,{codeGeneration:{strings:false,wasm:false}});vm.runInContext(String(bytes),c,{timeout:1500});const b=c.window.questionBank||c.window.questions||c.questionBank||c.questions||c.window.examData?.questions;if(!Array.isArray(b))fail('SOURCE_SCHEMA');return JSON.parse(JSON.stringify(b));}
function scopeFields(d){return {scope:d.scope,expectedQuestionCount:d.expectedQuestionCount,selected:d.selected,unsubmitted:d.unsubmitted};}
function hasScope(d){return ['scope','expectedQuestionCount','selected','unsubmitted'].some(k=>Object.hasOwn(d,k));}
function partition(root,d,{bank,identity,sourceRaw}={}){
 if(d.scope!==SCOPE)fail('SCOPE_REQUIRED');
 sourceRaw=sourceRaw??fs.readFileSync(safe(root,'archive/exams/'+d.sourceArchiveFile));bank=bank??loadBank(sourceRaw);
 if(!GIT.test(d.sourceGitBlobSha||'')||blob(sourceRaw)!==d.sourceGitBlobSha)fail('CURRENT_SOURCE_BLOB_MISMATCH');
 if(!Number.isSafeInteger(d.expectedQuestionCount)||d.expectedQuestionCount!==bank.length||bank.length<2)fail('SOURCE_DENOMINATOR');
 if(!Array.isArray(d.selected)||!d.selected.length||!Array.isArray(d.unsubmitted)||!d.unsubmitted.length||d.selected.length+d.unsubmitted.length!==bank.length)fail('PARTITION_DENOMINATOR');
 identity=identity??JSON.parse(fs.readFileSync(safe(root,'archive/data/question_identity_map.json')));
 const joins=new Map(),uses=new Map();for(const r of identity.records||[]){const k=r.sourceArchiveFile+'#'+r.sourceOrdinal;if(!joins.has(k))joins.set(k,[]);joins.get(k).push(r);uses.set(r.questionUid,(uses.get(r.questionUid)||0)+1);}
 const canonical=bank.map((q,i)=>{const rows=joins.get(d.sourceArchiveFile+'#'+(i+1))||[],r=rows[0],n=sourceNumber(q),no=sourceIdentityNumber(q);
  if(rows.length!==1||!UID.test(r?.questionUid||'')||uses.get(r.questionUid)!==1||r.status!=null&&r.status!=='VERIFIED'||r.sourceQuestionNo!=null&&String(r.sourceQuestionNo).trim()&&String(r.sourceQuestionNo)!==no)fail('CANONICAL_IDENTITY_MISMATCH');
  return {questionUid:r.questionUid,sourceOrdinal:i+1,sourceQuestionNo:no,displayNumber:n};});
 const seenUid=new Set(),seenOrdinal=new Set();
 for(const row of [...d.selected,...d.unsubmitted]){keys(row,['questionUid','sourceOrdinal','sourceQuestionNo'],'PARTITION_ROW_FIELDS');const c=canonical[row.sourceOrdinal-1];
  if(!Number.isSafeInteger(row.sourceOrdinal)||!c||row.questionUid!==c.questionUid||row.sourceQuestionNo!==c.sourceQuestionNo||seenUid.has(row.questionUid)||seenOrdinal.has(row.sourceOrdinal))fail('PARTITION_IDENTITY_OR_DUPLICATE');seenUid.add(row.questionUid);seenOrdinal.add(row.sourceOrdinal);}
 if(seenOrdinal.size!==bank.length)fail('PARTITION_MISSING');
 return {bank,sourceRaw,canonical,selected:d.selected.map(x=>canonical[x.sourceOrdinal-1]),unsubmitted:d.unsubmitted.map(x=>canonical[x.sourceOrdinal-1])};
}
function selectedItems(d,p,compact=false){
 if(!Array.isArray(d.items)||d.items.length!==p.selected.length)fail('SELECTED_ITEM_DENOMINATOR');
 const seen=new Set();for(const it of d.items){const row=p.selected.find(r=>compact?r.displayNumber===it.ordinal:r.sourceOrdinal===it.sourceOrdinal&&r.questionUid===it.questionUid);
  if(!row||seen.has(row.questionUid)||!compact&&it.sourceQuestionNo!=null&&String(it.sourceQuestionNo)!==row.sourceQuestionNo)fail('ITEM_OUTSIDE_SELECTED_OR_DUPLICATE');seen.add(row.questionUid);}
 return true;
}
function textFor(q,entry){
 if(entry.src==='stem'&&entry.choiceIndex===undefined)return String(q.content||q.question||'');
 if(entry.src==='solution'&&entry.choiceIndex===undefined)return String(q.solution||'');
 if(entry.src==='choices'&&Number.isSafeInteger(entry.choiceIndex)&&entry.choiceIndex>=0&&entry.choiceIndex<(q.choices||[]).length)return String(q.choices[entry.choiceIndex]);
 fail('QUOTE_SOURCE');
}
function verifyBindings(bindings,item,q){
 if(!Array.isArray(bindings)||bindings.length!==SLOTS.reduce((n,s)=>n+item[s].length,0))fail('QUOTE_BINDING_COVERAGE');
 const seen=new Set();for(const e of bindings){const allowed=['slot','entryIndex','termId','src','offsetCodepoints','lengthCodepoints','quoteSha256',...(e.src==='choices'?['choiceIndex']:[]),...(e.slot==='method'?['evidenceType',...(e.evidenceType==='IMPLIED'?['justificationSha256']:[])]:[])];keys(e,allowed,'QUOTE_BINDING_FIELDS');
  if(!SLOTS.includes(e.slot)||!Number.isSafeInteger(e.entryIndex)||e.entryIndex<0||item[e.slot][e.entryIndex]!==e.termId||seen.has(e.slot+'#'+e.entryIndex))fail('QUOTE_VECTOR_BINDING');seen.add(e.slot+'#'+e.entryIndex);
  if(!Number.isSafeInteger(e.offsetCodepoints)||e.offsetCodepoints<0||!Number.isSafeInteger(e.lengthCodepoints)||e.lengthCodepoints<1||!SHA.test(e.quoteSha256||''))fail('QUOTE_SPAN');
  if(e.slot==='method'&&(!['NAMED','IMPLIED'].includes(e.evidenceType)||e.evidenceType==='IMPLIED'&&!SHA.test(e.justificationSha256||'')))fail('METHOD_EVIDENCE');
  const chars=[...textFor(q,e)];if(e.offsetCodepoints+e.lengthCodepoints>chars.length||sha(chars.slice(e.offsetCodepoints,e.offsetCodepoints+e.lengthCodepoints).join(''))!==e.quoteSha256)fail('QUOTE_SPAN_HASH_MISMATCH');
 }
}
function publicEvidence(root,d,{bank,identity,sourceRaw,dictRaw,dictPath}={}){
 keys(d,['schemaVersion','sourceArchiveFile','sourceGitBlobSha','dictionaryVersion','evidence','reviewedBy','scope','expectedQuestionCount','selected','unsubmitted','items'],'COMPACT_FIELDS');
 const p=partition(root,d,{bank,identity,sourceRaw});selectedItems(d,p,true);
 keys(d.reviewedBy,['agent','at','sampled'],'REVIEWER_FIELDS');
 if(!eq(d.reviewedBy.sampled,[...p.selected.map(x=>x.displayNumber)].sort((a,b)=>a-b)))fail('REVIEWED_SELECTION_MISMATCH');
 for(const it of d.items)keys(it,['ordinal','format',...SLOTS,'candidates'],'COMPACT_ITEM_FIELDS');
 keys(d.evidence,['schemaVersion','receipt'],'EVIDENCE_FIELDS');if(d.evidence.schemaVersion!==EVIDENCE_SCHEMA)fail('EVIDENCE_SCHEMA');
 const ref=d.evidence.receipt;keys(ref,['path','sha256'],'RECEIPT_REFERENCE');if(!SHA.test(ref.sha256||'')||!new RegExp('^'+RECEIPTS+'[A-Za-z0-9][A-Za-z0-9_-]{0,100}\\.json$').test(ref.path||''))fail('RECEIPT_REFERENCE');
 const raw=fs.readFileSync(safe(root,ref.path));if(sha(raw)!==ref.sha256)fail('RECEIPT_SHA_MISMATCH');const r=JSON.parse(raw);
 keys(r,['schemaVersion','requestId','digestAlgorithm','source','dictionary','submission','acceptance','items'],'RECEIPT_FIELDS');
 if(r.schemaVersion!==RECEIPT_SCHEMA||ref.path!==RECEIPTS+r.requestId+'.json'||r.digestAlgorithm!=='sha256-stable-json-utf8-v1')fail('RECEIPT_SCHEMA');
 keys(r.source,['path','gitBlobSha','rawSha256'],'SOURCE_REFERENCE');if(r.source.path!=='archive/exams/'+d.sourceArchiveFile||r.source.gitBlobSha!==d.sourceGitBlobSha||r.source.rawSha256!==sha(p.sourceRaw))fail('RECEIPT_SOURCE_MISMATCH');
 keys(r.dictionary,['path','version','gitBlobSha','rawSha256'],'DICTIONARY_REFERENCE');dictPath=dictPath??r.dictionary.path;
 if(!/^docs\/architecture\/4slot\/term-dictionary-v[0-9]+(?:\.[0-9]+)*\.json$/.test(dictPath)||r.dictionary.path!==dictPath)fail('DICTIONARY_PATH');
 dictRaw=dictRaw??fs.readFileSync(safe(root,dictPath));const dict=JSON.parse(dictRaw);if(dict.dictionaryVersion!==d.dictionaryVersion||r.dictionary.version!==d.dictionaryVersion||r.dictionary.gitBlobSha!==blob(dictRaw)||r.dictionary.rawSha256!==sha(dictRaw))fail('DICTIONARY_MISMATCH');
 if(!eq(r.submission,scopeFields(d)))fail('RECEIPT_PARTITION_MISMATCH');
 const a=r.acceptance;keys(a,['author','reviewer','decision','reviewedAtUtc','candidateSha256','privateInputSha256','independentReviewSha256','allowedScope','newSemanticApproval','otherUidApprovals','newMathQa'],'ACCEPTANCE_FIELDS');
 if(!a.author||!a.reviewer||a.author===a.reviewer||a.reviewer!==d.reviewedBy?.agent||a.decision!==DECISION||!a.reviewedAtUtc||a.reviewedAtUtc!==d.reviewedBy.at||a.allowedScope!=='FOUR_SLOT_VECTOR_ONLY'||a.newSemanticApproval!==0||a.otherUidApprovals!==0||a.newMathQa!==0||[a.candidateSha256,a.privateInputSha256,a.independentReviewSha256].some(h=>!SHA.test(h||'')))fail('ACCEPTANCE_MISMATCH');
 if(!Array.isArray(r.items)||r.items.length!==d.items.length)fail('RECEIPT_ITEM_DENOMINATOR');const seen=new Set();
 for(const row of r.items){keys(row,['questionUid','sourceOrdinal','sourceQuestionNo','compactItemSha256','quoteBindings'],'RECEIPT_ITEM_FIELDS');const s=p.selected.find(x=>x.questionUid===row.questionUid&&x.sourceOrdinal===row.sourceOrdinal&&x.sourceQuestionNo===row.sourceQuestionNo),it=d.items.find(x=>x.ordinal===s?.displayNumber);
  if(!s||!it||seen.has(s.questionUid)||row.compactItemSha256!==sha(stable(it)))fail('RECEIPT_VECTOR_MISMATCH');seen.add(s.questionUid);verifyBindings(row.quoteBindings,it,p.bank[s.sourceOrdinal-1]);}
 return {...p,receiptPath:ref.path,receiptSha256:ref.sha256};
}
module.exports={SLOTS,SCOPE,EVIDENCE_SCHEMA,RECEIPT_SCHEMA,RECEIPTS,DECISION,SHA,GIT,UID,stable,sha,blob,eq,fail,keys,safe,loadBank,scopeFields,hasScope,partition,selectedItems,textFor,verifyBindings,publicEvidence};
