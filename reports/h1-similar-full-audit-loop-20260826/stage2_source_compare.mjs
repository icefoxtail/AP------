import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const repo='C:/Users/USER/Desktop/AP------';
const outDir=path.join(repo,'reports','h1-similar-full-audit-loop-20260826');
const planPath=path.join(repo,'archive','analysis','2026-08-26-h1-2sem-similar-repair-plan.md');
const inventory=JSON.parse(fs.readFileSync(path.join(outDir,'source-pdf-inventory.json'),'utf8'));
const sourceByName=new Map(inventory.map(x=>[x.similar,x]));
const targets=[
 ['2mid','25_금당고_2학기_중간_고1_유사.js','25_금당고_2학기_중간_고1_기출.js',null],
 ['2mid','25_매산고_2학기_중간_고1_유사.js','25_매산고_2학기_중간_고1_기출.js',null],
 ['2mid','25_순천고_2학기_중간_고1_유사.js','25_순천고_2학기_중간_고1_기출.js',id=>id<=8?1:id<=13?2:id<=17?3:id<=21?4:5],
 ['2final','25_금당고_2학기_기말_고1_유사.js','25_금당고_2학기_기말_고1_기출.js',id=>id<=11?1:id<=17?2:3],
 ['2final','25_순천고_2학기_기말_고1_유사.js','25_순천고_2학기_기말_고1_기출.js',id=>id<=6?1:id<=11?2:id<=15?3:id<=19?4:id<=21?5:6],
 ['2final','25_제일고_2학기_기말_고1_유사.js','25_제일고_2학기_기말_고1_기출.js',id=>id<=5?1:id<=8?2:id<=12?3:id<=17?4:id<=20?5:6],
 ['2final','25_팔마고_2학기_기말_고1_유사.js','25_팔마고_2학기_기말_고1_기출.js',null],
 ['2final','25_효천고_2학기_기말_고1_유사.js','25_효천고_2학기_기말_고1_기출.js',id=>id<=6?1:id<=12?2:id<=16?3:id<=21?4:5],
];
const visualPages={
 '25_순천고_2학기_중간_고1_유사.js':{11:1,18:4},
 '25_금당고_2학기_기말_고1_유사.js':{6:1,16:2},
 '25_순천고_2학기_기말_고1_유사.js':{4:1,10:2,13:3,16:4},
 '25_제일고_2학기_기말_고1_유사.js':{10:3,12:3,17:4},
 '25_효천고_2학기_기말_고1_유사.js':{13:3,17:4},
};
function load(p){const c={window:{}};vm.createContext(c);vm.runInContext(fs.readFileSync(p,'utf8'),c,{filename:p});return c.window;}
const planText=fs.readFileSync(planPath,'utf8');
const planRows=[...planText.matchAll(/^\|\s*(\d+)\s*\|/gm)].length;
const rows=[]; const exams=[];
for(const [term,simName,origName,pageFn] of targets){
 const sim=path.join(repo,'archive','exams','similar','high','h1',term,simName); const orig=path.join(repo,'archive','exams','original','high','h1',term,origName); const sw=load(sim), ow=load(orig); const qs=sw.questionBank||[], oqs=ow.questionBank||[]; const source=sourceByName.get(simName); const has=Boolean(source?.available); const vmap=visualPages[simName]||{}; const ex={similar:simName,original:origName,qCount:qs.length,sourcePdf:source?.pdf||null,sourcePdfAvailable:has,pageCount:source?.pageCount||0,renderedPageCount:source?.renderedPageCount||0,pageCoverage:has?'PASS':'BLOCKED',fieldComparison:'BLOCKED_NO_TEXT_LAYER',planRows:planRows,questions:[]};
 for(const q of qs){const qPage=pageFn?.(q.id)||null; const visual=Boolean(q.image)||/<(?:img|svg|table)\b/i.test(String(q.content)); const sourcePage=visualPages[simName]?.[q.id]||null; const original=oqs.find(x=>x.id===q.id); ex.questions.push({id:q.id,sourcePage:qPage,visualSourcePage:sourcePage,renderedPageExists:has&&qPage?Boolean((source.pages||[]).some(p=>p.endsWith(`page-${qPage}.png`))):false,contentVsSource:has?'BLOCKED_Q_LEVEL_TRANSCRIPTION_COMPARE':'BLOCKED_SOURCE_PDF_MISSING',choicesVsSource:has?'BLOCKED_Q_LEVEL_TRANSCRIPTION_COMPARE':'BLOCKED_SOURCE_PDF_MISSING',scoreVsSource:has?'BLOCKED_Q_LEVEL_TRANSCRIPTION_COMPARE':'BLOCKED_SOURCE_PDF_MISSING',conditionsVsSource:has?'BLOCKED_Q_LEVEL_TRANSCRIPTION_COMPARE':'BLOCKED_SOURCE_PDF_MISSING',originalQuestionExists:Boolean(original),generatedVisual:visual,generatedImage:q.image||null,generatedAssetExists:q.image?fs.existsSync(path.join(repo,'archive',...q.image.split('/'))):false,visualCompare:visual?(has?'BLOCKED_SOURCE_CROP_PROVENANCE':'BLOCKED_SOURCE_PDF_MISSING'):'NOT_APPLICABLE'});}
 exams.push(ex); rows.push(...ex.questions.map(q=>({...q,exam:simName,sourcePdfAvailable:has})));
}
const available=exams.filter(e=>e.sourcePdfAvailable); const missing=exams.filter(e=>!e.sourcePdfAvailable); const out={generatedAt:new Date().toISOString(),protocols:['apmath-archive-exams/SKILL.md','archive-layout.md','JS아카이브_1차검수_프로토콜.md','JS아카이브_2차검수_프로토콜.md','JS아카이브_3차검수_프로토콜.md','무결성검수.md','2026-08-26-h1-2sem-similar-repair-plan.md'],plan:{path:'archive/analysis/2026-08-26-h1-2sem-similar-repair-plan.md',rows:planRows,expected:178,status:planRows===178?'PASS':'FAIL'},counts:{exams:8,questions:rows.length,sourcePdfAvailable:available.length,sourcePdfMissing:missing.length,renderedSourcePages:available.reduce((n,e)=>n+e.renderedPageCount,0),sourcePageMapped:rows.filter(r=>r.sourcePage).length,sourcePageCoveragePass:rows.filter(r=>r.sourcePdfAvailable&&r.renderedPageExists).length,fieldLevelComparisonBlocked:rows.length,visualRows:rows.filter(r=>r.generatedVisual).length},gates:{sourcePdfInventory:missing.length?'PARTIAL':'PASS',sourcePageRender:available.every(e=>e.pageCoverage==='PASS')?'PASS':'FAIL',sourceFieldLevelTranscription:'BLOCKED',similarityPlan:planRows===178?'PASS':'FAIL',visualCropProvenance:'BLOCKED'},missingSourceExams:missing.map(e=>e.similar),exams,rows};
fs.writeFileSync(path.join(outDir,'stage2-source-compare.json'),JSON.stringify(out,null,2)); console.log(JSON.stringify({plan:out.plan,counts:out.counts,gates:out.gates,missingSourceExams:out.missingSourceExams},null,2));
