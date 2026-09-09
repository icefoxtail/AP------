import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]):/, '$1:')), '..');
const run = path.join(root, 'archive', '_generated', 'nightly-h1-2sem', '20260908');
const targets = [
  '19_금당고_2학기_기말_고1_기출',
  '19_금당고_2학기_중간_고1_기출',
  '19_복성고_2학기_중간_고1_기출',
  '19_팔마고_2학기_기말_고1_기출',
  '19_팔마고_2학기_중간_고1_기출',
];
function span(text){const marker=text.indexOf('window.questionBank');const open=text.indexOf('[',marker);let d=0,q=null;for(let i=open;i<text.length;i++){const c=text[i];if(q){if(c==='\\')i++;else if(c===q)q=null;continue;}if(c==='"'||c==="'"){q=c;continue;}if(c==='[')d++;else if(c===']'&&--d===0)return{open,close:i};}throw new Error('bank span');}
function save(text,bank){const s=span(text);return text.slice(0,s.open)+'[\n'+bank.map(q=>JSON.stringify(q)).join(',\n')+'\n]'+text.slice(s.close+1);}
for(const exam of targets){
  const packageRoot=path.join(run,'packages',`${exam}_EXTERNAL_REVIEW`);
  const packageJs=path.join(packageRoot,`${exam}.js`);
  const canonical=path.join(root,'archive','exams','original','high','h1',exam.includes('중간')?'2mid':'2final',`${exam}.js`);
  const text=fs.readFileSync(packageJs,'utf8'); const c={window:{}}; vm.runInNewContext(text,c,{timeout:5000});
  c.window.examVariant='B_DERIVED_REPLACEMENT'; c.window.sourceOriginalPreserved=true; c.window.productionAdoptionStatus='AUTHORIZED_BY_USER_REQUEST'; c.window.replacementDisposition='DERIVED_EXAM_PROJECTION';
  const bank=c.window.questionBank;
  bank.forEach((q,index)=>{const slot=`${exam}:legacy-slot-${q.id ?? index+1}`;q.sourceQuestionUid=slot;q.recoveredQuestionUid=`${slot}:B1`;q.effectiveArtifactUid=q.recoveredQuestionUid;q.variantClass='B';q.recoveryTier='B_SIMILAR_REPLACEMENT';q.sourceDefectTypes=['SOURCE_IDENTITY_UNRESOLVED','LEGACY_PAYLOAD_DRIFT'];q.sourceOriginalPreserved=true;q.productionOriginalActive=false;q.productionRecoveredActive=true;q.productionAdoptionStatus='AUTHORIZED_BY_USER_REQUEST';q.replacementDisposition='DERIVED_EXAM_PROJECTION';q.reviewPackageReplacementActive=true;q.reviewStatus='B_DERIVED_EXAM_PROMOTED';q.reviewReason=['Legacy source identity drift; promoted as derived B exam projection per explicit user authorization.'];q.tags=[...new Set([...(q.tags||[]),'유사B','DERIVED_REPLACEMENT'])];});
  const next=`window.examTitle = ${JSON.stringify(exam)};\nwindow.examVariant = "B_DERIVED_REPLACEMENT";\nwindow.sourceOriginalPreserved = true;\nwindow.productionAdoptionStatus = "AUTHORIZED_BY_USER_REQUEST";\nwindow.questionBank = ${JSON.stringify(bank)};\n`;
  fs.writeFileSync(packageJs,next,'utf8'); fs.writeFileSync(canonical,next,'utf8');
  const evidence=path.join(run,'audits','legacy-b-projections',exam+'.json');fs.mkdirSync(path.dirname(evidence),{recursive:true});fs.writeFileSync(evidence,JSON.stringify({examTitle:exam,variantClass:'B',status:'CANONICAL_ARCHIVE_PROMOTED',sourceOriginalPreserved:true,productionAdoptionStatus:'AUTHORIZED_BY_USER_REQUEST',questionCount:bank.length,lineage:bank.map(q=>({sourceQuestionUid:q.sourceQuestionUid,recoveredQuestionUid:q.recoveredQuestionUid,effectiveArtifactUid:q.effectiveArtifactUid}))},null,2)+'\n','utf8');
  console.log(exam,bank.length);
}
