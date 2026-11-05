'use strict';
// One-time release helper: kept on the isolated operations branch, never copied to main.
const fs=require('fs'),path=require('path'),crypto=require('crypto'),cp=require('child_process');
const root=process.cwd(), req=p=>require(path.join(root,p));
const {validateData,loadDict,buildLookup,DEFAULT_DICT}=req('tools/4slot/validate-4slot.cjs');
const {compactItem,serialize}=req('tools/4slot/import-4slot.cjs');
const {loadBank,blob,identityHash}=req('tools/4slot/build-4slot-runtime.cjs');
const {loadExam}=req('tools/4slot/exam-items.cjs');
const ref='e7aab2467ecad89b07442f3e2889ddaa889f5eb1';
const evidenceRef='https://drive.google.com/file/d/1qsCORL_Eb7nk-Cm6MkiEABvtQrfc3s7V/view';
const evidenceSha='7c6c352a984e4299d5750a405f7a74d6b2c249b84e08913f6a5e5202ba1a5667';
const git=(...a)=>cp.execFileSync('git',a,{encoding:'utf8',maxBuffer:128*1024*1024,stdio:['ignore','pipe','pipe']});
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const prefix='archive-work/4slot-annotate-v1/out/';
const files=git('ls-tree','-rz','--name-only',ref,'--',prefix).split('\0').filter(p=>p.endsWith('.4slot.json'));
const rows=files.map(p=>({path:p,source:p.slice(prefix.length).replace(/\.4slot\.json$/,'.js')}));
const sourcePairs=rows.map(r=>[r.source,git('hash-object','archive/exams/'+r.source).trim()]).sort((a,b)=>a[0].localeCompare(b[0],'en'));
if(files.length!==358||hash(JSON.stringify(sourcePairs))!=='425192911ac136be9f38493786621ee9b5451ad1ca0559fdca4cf5e2d3fe55c7')throw Error('PINNED_SOURCE_SNAPSHOT_CHANGED');
const sources=new Map(sourcePairs);
const identity=JSON.parse(fs.readFileSync('archive/data/question_identity_map.json'));
const joins=new Map(identity.records.map(r=>[r.sourceArchiveFile+'#'+r.sourceOrdinal,r]));
const knownUid=new Set(identity.records.map(r=>r.questionUid));
const dict=loadDict(root,DEFAULT_DICT),lut=buildLookup(dict);for(const t of dict.terms)lut.set('#'+t.id,t);
const patches=[];
function method(source,no,term,quote,justification){patches.push({source,no,slot:'method',term,quote,...(justification?{evidenceType:'IMPLIED',justification}:{})});}
let s='original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js';
method(s,22,'거듭제곱','모든 원소는 $a_1$의 거듭제곱이다');
method(s,22,'집합','$a_1$로 나누어도 집합 $S$의 자연수가 나온다.');
method(s,22,'로그','\\log_{a_1}a_2+\\cdots+\\log_{a_1}a_{12}');
method(s,22,'등차수열','=2+3+\\cdots+12');
s='original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js';
method(s,19,'경우분류','1) $D$가 볼펜 1개를 받는 경우','D가 받는 한 물건을 볼펜과 연필로 나누어 각각 센다.');
s='original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js';
method(s,24,'주기','절댓값을 씌운 코사인 그래프의 주기는');
method(s,24,'근의개수','먼저 $y=1$과의 교점 개수 $n$을 센다.');
method(s,24,'개수','$m-n=-1$이므로 $m=8$이어야 한다.');
method(s,24,'축대칭','양수와 음수가 각각 쌍을 이루므로');
patches.push({source:s,no:24,add:{slot:'method',value:{term:'경우분류',src:'solution',quote:'(ⅰ) $\\dfrac12<k<1$일 때',evidenceType:'IMPLIED',justification:'k가 1보다 작은 경우와 큰 경우의 구간 내 근 배치 및 합이 달라 따로 계산한다.'}}});
s='original/high/h2/1mid/26_강남여고_1학기_중간_고2_대수.js';
patches.push({source:s,no:24,format:'서술',remove:{given:['일반각'],goal:['사분면'],method:['일반각','홀짝'],condition:['사분면']}});
s='original/high/h2/1mid/26_제일고_1학기_중간_고2_기하.js';
method(s,22,'접선의방정식','접선은\n$\\dfrac{x_1x}{a^2}');
method(s,22,'수선','접선에 수직인 법선의 기울기는');
method(s,22,'x절편','접선과 $x$축이 만나는 점 $Q$를 구한다.');
method(s,22,'소거','=|a^2-b^2|$이다.','두 x절편의 절댓값을 곱하면 x_1과 a^2가 약분되어 점 P에 무관해진다.');
s='original/middle/m2/2final/23_매산중_2학기_기말_중2_기출.js';
method(s,1,'평행선과선분의길이의비','대응하는 선분의 길이의 비를 이용한다');
method(s,1,'비례식','$\\dfrac{2}{4}=\\dfrac{3}{x}$');
s='original/middle/m3/2final/23_풍덕중_2학기_기말_중3_기출.js';
method(s,21,'넓이','\\dfrac{1}{2}\\times12\\times5');
const results=[];let uidReconciled=0,named=0;
for(const r of rows){
 const a=JSON.parse(git('show',ref+':'+r.path));
 for(const p of patches.filter(p=>p.source===r.source)){
  const it=a.items.find(x=>String(x.sourceOrdinal)===String(p.no));if(!it)throw Error('PATCH_Q_MISSING');
  if(p.format)it.format=p.format;
  if(p.remove)for(const [slot,terms]of Object.entries(p.remove))it.slots[slot]=it.slots[slot].filter(x=>!terms.includes(x.term));
  if(p.quote){const t=it.slots[p.slot].find(x=>x.term===p.term);if(!t)throw Error('PATCH_TERM_MISSING');t.quote=p.quote;if(p.evidenceType){t.evidenceType=p.evidenceType;t.justification=p.justification;}}
  if(p.add)it.slots[p.add.slot].push(p.add.value);
 }
 a.sourceGitBlobSha=sources.get(r.source);
 const v=validateData(a,{root,dict,lut});if(v.fail.length)throw Error('AUTHORED_VALIDATION_FAIL:'+r.source+':'+JSON.stringify(v.fail));
 const bank=loadBank(fs.readFileSync('archive/exams/'+r.source));
 const pos=new Map(loadExam('archive/exams/'+r.source).map((q,i)=>[String(q.ordinal),i+1]));
 const items=a.items.map(it=>{
  const position=pos.get(String(it.sourceOrdinal));if(!position)throw Error('AUTHOR_ORDINAL_UNRESOLVED');
  const q=bank[position-1],id=joins.get(r.source+'#'+position);if(!id)throw Error('CANONICAL_UID_MISSING');
  const item=compactItem(it,lut,{sourcePosition:position,sourceQuestionNo:q.id??q.number});
  if(item.sourceQuestionNo)named++;
  if(q.questionUid&&q.questionUid!==id.questionUid){
   if(knownUid.has(q.questionUid)||id.sourceFingerprint!==identityHash(q))throw Error('UNRESOLVED_UID_CONFLICT');
   item.uidReconciliation={basis:'EXACT_IDENTITY_SOURCE_FINGERPRINT',legacyUid:q.questionUid,canonicalUid:id.questionUid,sourceFingerprint:id.sourceFingerprint};uidReconciled++;
  }
  return item;
 }).sort((a,b)=>a.ordinal-b.ordinal);
 const dest='archive/data/item-4slot/'+r.source.replace(/\.js$/,'.4slot.json');
 const d={schemaVersion:'archive-meta-4slot-compact-v1',sourceArchiveFile:r.source,sourceGitBlobSha:a.sourceGitBlobSha,dictionaryVersion:dict.dictionaryVersion,
  evidence:{branch:'work/4slot-annotate-v1',commit:git('log','-1','--format=%H',ref,'--',r.path).trim(),path:r.path,authorSnapshot:ref,reconciliationRef:evidenceRef,reconciliationSha256:evidenceSha},
  reviewedBy:{agent:'GPT6_CHAT',at:'2026-11-05',sampled:[...new Set(patches.filter(p=>p.source===r.source).map(p=>p.no))],scope:'MACHINE_ALL_AND_TARGETED_SOURCE_DELTA',independentFullReviewClaim:false},items};
 let unchanged=false;
 if(fs.existsSync(dest)){const prev=JSON.parse(fs.readFileSync(dest));unchanged=JSON.stringify(prev.items)===JSON.stringify(items)&&prev.sourceGitBlobSha===d.sourceGitBlobSha;}
 if(!unchanged){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,serialize(d));}
 results.push({source:r.source,items:items.length,unchanged,outputBlob:blob(fs.readFileSync(dest))});
}
const count=results.reduce((n,r)=>n+r.items,0);if(count!==8129||uidReconciled!==178||named!==70)throw Error('IMPORT_SCOPE_MISMATCH');
const summary={schemaVersion:'4slot-full-import-execution-v1',authorRef:ref,baseCommit:git('rev-parse','HEAD').trim(),files:results.length,items:count,changed:results.filter(r=>!r.unchanged).length,unchanged:results.filter(r=>r.unchanged).length,uidReconciled,named,independentFullReviewClaim:false,studentMutation:0,sourceDigest:hash(JSON.stringify(sourcePairs)),evidenceRef,evidenceSha,results};
fs.mkdirSync(process.env.RELEASE_EVIDENCE_DIR,{recursive:true});
fs.writeFileSync(process.env.RELEASE_EVIDENCE_DIR+'/import.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify({...summary,results:undefined},null,2));
