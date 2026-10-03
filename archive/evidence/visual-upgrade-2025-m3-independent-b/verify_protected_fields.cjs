const fs=require('fs');const vm=require('vm');const crypto=require('crypto');
const E='archive/evidence/visual-upgrade-2025-m3-independent-b';
const lock=JSON.parse(fs.readFileSync(E+'/protected_fields_snapshot.json','utf8'));
const omit=new Set(lock.exclusions);
const sha=v=>'sha256:'+crypto.createHash('sha256').update(Buffer.from(JSON.stringify(v),'utf8')).digest('hex');
const items=[];let fail=0;
for(const exam of lock.exams){
 const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(exam.sourcePath,'utf8'),sandbox,{filename:exam.sourcePath,timeout:5000});
 const bank=sandbox.window.questionBank||sandbox.window.questions;
 if(!Array.isArray(bank)||bank.length!==exam.questions.length)throw new Error('QUESTION_COUNT_MISMATCH:'+exam.sourcePath);
 for(const base of exam.questions){
  const q=bank.find(x=>Number(x.id)===Number(base.qid));
  if(!q)throw new Error('QID_MISSING:'+exam.sourcePath+'#'+base.qid);
  const protectedValues=Object.fromEntries(Object.entries(q).filter(([k])=>!omit.has(k)));
  const actual=sha(protectedValues);const ok=actual===base.protectedValuesSha256;
  if(!ok)fail++;
  items.push({sourcePath:exam.sourcePath,qid:base.qid,expectedSha256:base.protectedValuesSha256,actualSha256:actual,result:ok?'PASS':'FAIL'});
 }
}
const out={schemaVersion:'M3_PROTECTED_FIELD_PARITY_v1',baseCommit:lock.baseCommit,denominator:120,
 passCount:items.filter(x=>x.result==='PASS').length,failCount:fail,lockedFields:['content','choices','answer','solution','image','Meta','difficulty','layout'],
 excludedVisualFields:[...omit],items};
fs.writeFileSync(E+'/protected_fields_verification.json',JSON.stringify(out,null,2)+'\n','utf8');
console.log(JSON.stringify({denominator:out.denominator,passCount:out.passCount,failCount:out.failCount,out:E+'/protected_fields_verification.json'}));
if(fail)process.exit(1);
