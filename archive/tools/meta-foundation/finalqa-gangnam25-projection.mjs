import fs from 'node:fs';import crypto from 'node:crypto';import sourceBank from '../../archive2-source.js';
const file='original/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계.js';
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const src=fs.readFileSync('archive/exams/'+file,'utf8');
const q=sourceBank.evaluate(src,file);
const doc=read('archive/data/question_metadata.json');
const rt=read('archive/data/meta-foundation/runtime/probability-statistics-v1.json');
const links=read('archive/data/basic-scope-source-links.json');
const metadata=doc.records.filter(x=>x.sourceArchiveFile===file).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
const rows=rt.records.filter(x=>x.sourceArchiveFile===file).sort((a,b)=>a.sourceOrdinal-b.sourceOrdinal);
if(q.length!==24||metadata.length!==24||rows.length!==24)throw Error('24 source/metadata/runtime mismatch');
for(let i=0;i<24;i++){
const m=metadata[i],r=rows[i],v=q[i],n=i+1;
if(v.id!==n||m.sourceOrdinal!==n||r.sourceOrdinal!==n||r.questionUid!==m.questionUid||r.bindingResolutionStatus!=='RESOLVED')throw Error('Q'+n+' authority mismatch');
const fp=await sourceBank.fingerprint(v);
const body=sha(JSON.stringify({content:v.content??null,choices:Array.isArray(v.choices)?v.choices:null,image:v.image??null}));
Object.assign(m,{sourceFingerprint:fp,approvedSourceFingerprint:fp,contentFingerprint:body,
metadataRevision:'meta-foundation:PROBABILITY_STATISTICS@1.0.0:finalqa-reviewed-v1',
metadataStatus:'approved_exam_finalqa',reviewStatus:'reviewed_pass',metaFoundationStatus:'ACTIVE',
metaFoundationPackId:'PROBABILITY_STATISTICS',metaFoundationPackVersion:'1.0.0',
foundationTaxonomyStatus:'CONFIRMED',defaultSelectable:true,curriculum:'2015',curriculumKey:'2015',
courseKey:'확률과 통계',L1:r.L1,L2:r.L2,L3:r.L3,L4:r.L4,
problemTypeKey:r.problemTypeKey,templateKey:r.templateKey,difficultyBucket:r.difficultyBucket,
crossConceptKeys:r.crossConceptKeys||[],conditionKeys:r.conditionKeys||[],
integrationPattern:r.integrationPattern||'NONE',legacyLevelCompatibility:r.legacyLevelCompatibility||'NORMAL',
fieldStatus:{...m.fieldStatus,standardUnit:'approved_finalqa',subUnit:'approved_finalqa',concept:'approved_finalqa',
problemType:'approved_finalqa',template:'approved_finalqa',difficulty:'approved_finalqa'}});
const link={grade:'고2',curriculumKey:'2015',courseKey:'확률과 통계',L1:r.L1,L2:r.L2,
sourceFile:file,sourceOrdinal:n,sourceFingerprint:fp,sourceBodyFingerprint:body,
reason:'Gangnam25 final QA canonical reviewed q'+n};
let old=links.records.find(x=>x.sourceFile===file&&x.sourceOrdinal===n);
if(old)Object.assign(old,link);else links.records.push(link);
}
if(links.records.filter(x=>x.sourceFile===file).length!==24)throw Error('link cardinality');
fs.writeFileSync('archive/data/question_metadata.json',JSON.stringify(doc,null,2)+'\n');
fs.writeFileSync('archive/data/basic-scope-source-links.json',JSON.stringify(links,null,2)+'\n');
