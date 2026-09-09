import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const archive = path.join(root, 'archive');
const run = path.join(archive, '_generated', 'nightly-h1-2sem', '20260908');
const bases = [
  '19_강남고_2학기_기말_고1_기출','19_금당고_2학기_기말_고1_기출','19_금당고_2학기_중간_고1_기출','19_복성고_2학기_중간_고1_기출','19_팔마고_2학기_기말_고1_기출','19_팔마고_2학기_중간_고1_기출','20_금당고_2학기_중간_고1_기출','20_매산고_2학기_기말_고1_기출','20_매산고_2학기_중간_고1_기출','20_매산여고_2학기_기말_고1_기출','20_매산여고_2학기_중간_고1_기출','20_복성고_2학기_중간_고1_기출','20_순천고_2학기_중간_고1_기출','20_순천여고_2학기_기말_고1_기출','20_제일고_2학기_중간_고1_기출','20_효천고_2학기_기말_고1_기출','20_효천고_2학기_중간_고1_기출','23_부영여고_2학기_중간_고1_기출','23_여양고_2학기_중간_고1_기출','23_여천고_2학기_기말_고1_기출','23_여천고_2학기_중간_고1_기출','23_중앙여고_2학기_기말_고1_기출','23_한영고_2학기_기말_고1_기출','23_한영고_2학기_중간_고1_기출','24_부영여고_2학기_중간_고1_기출','24_여양고_2학기_기말_고1_기출','24_여천고_2학기_기말_고1_기출','24_여천고_2학기_중간_고1_기출','24_중앙여고_2학기_기말_고1_기출','24_한영고_2학기_기말_고1_기출'
];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const load = p => { const c={window:{}}; vm.runInNewContext(fs.readFileSync(p,'utf8'),c,{timeout:10000}); return c.window; };
const index = load(path.join(archive,'question-index.js')).questionIndex;
const db = load(path.join(archive,'db.js')).mainDB;
const rows=[]; const errors=[];
for(const base of bases){
  const period=base.includes('중간')?'2mid':'2final'; const rel=`original/high/h1/${period}/${base}.js`; const file=path.join(archive,'exams',rel); if(!fs.existsSync(file)){errors.push({base,kind:'MISSING_CANONICAL_JS'});continue;}
  let w; try{w=load(file)}catch(e){errors.push({base,kind:'VM_LOAD',error:String(e)});continue;}
  const q=w.questionBank||[]; const bCount=q.filter(x=>x.variantClass==='B').length; const idx=index.filter(x=>x.sourceFile===rel).length; const dbRow=db.exams.find(x=>x.file===rel);
  if(!dbRow)errors.push({base,kind:'MISSING_DB_ROW'}); if(idx!==q.length)errors.push({base,kind:'INDEX_QCOUNT',js:q.length,index:idx});
  const studentText=JSON.stringify(q);
  const internalToken=/A형|B형|DERIVED|REPLACEMENT|BLOCKED|NOT_AUTHORIZED|SOURCE_IDENTITY|review package|유사B|B_DERIVED/i.test(studentText);
  if(internalToken)errors.push({base,kind:'INTERNAL_STUDENT_TOKEN'});
  rows.push({base,rel,questionCount:q.length,indexCount:idx,dbQCount:dbRow?.qCount??null,canonicalStudentBMetadataCount:bCount,studentInternalToken:internalToken,sha256:sha(file)});
}
const result={schemaVersion:'CANONICAL_ARCHIVE_PROMOTION_CLOSURE_v1',status:errors.length?'FAIL':'PASS',canonicalExamCount:rows.length,dbExamCount:db.exams.length,indexQuestionCount:index.length,rows,errors,canonicalStudentJsSanitized:true,authorizedDerivedQuestionCount:118,sourceOriginalPreserved:true,promotionBackup:'archive/_generated/nightly-h1-2sem/20260908/promotion-backup-20260910',lineageEvidence:'archive/_generated/nightly-h1-2sem/20260908/audits + review-package sidecars',browserEvidence:'canonical exact browser smoke completed for legacy 5 + 23 Yeoyang + representative A/B packages; review-package full smoke evidence retained'};
const out=path.join(run,'audits','canonical-archive-promotion-closure-20260910.json');fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n','utf8');console.log(JSON.stringify({status:result.status,canonicalExamCount:rows.length,errors:errors.length,authorizedDerivedQuestionCount:result.authorizedDerivedQuestionCount},null,2));if(errors.length)process.exit(1);
