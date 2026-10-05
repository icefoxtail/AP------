import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
const root=process.cwd();
const setRoot='archive-work/textbooks/visang-common2/middle/함수';
const evidenceRoot=`${setRoot}/evidence/비상_공통수학2_함수_중단원학습점검_고1`;
const jsPath=`${setRoot}/js/비상_공통수학2_함수_중단원학습점검_고1.js`;
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const fail=[];
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,jsPath),'utf8'),ctx,{filename:jsPath});
const q=ctx.window.questionBank;
const inv=read(`${evidenceRoot}/question-inventory.json`), cross=read(`${evidenceRoot}/answer-solution-crosswalk.json`), pages=read(`${evidenceRoot}/section-page-mapping.json`), visual=read(`${evidenceRoot}/visual-benefit-ledger.json`);
const master=read('archive/data/master_tables/js_archive_tag_master.json');
if(!Array.isArray(q)||q.length!==12)fail.push('QUESTION_COUNT');
if(inv.coverage?.expected!==12||inv.coverage?.observed!==12||inv.items?.length!==12)fail.push('INVENTORY_DENOMINATOR');
if(cross.summary?.expected!==12||cross.summary?.officialAnswerMatches!==12||cross.summary?.unresolved!==0||cross.items?.length!==12)fail.push('ANSWER_CROSSWALK');
if(pages.problemPdf?.physicalPages?.join(',')!=='31,32'||pages.problemPdf?.printedPages?.join(',')!=='113,114'||pages.officialAnswerPdf?.physicalPages?.join(',')!=='12,13')fail.push('PAGE_MAPPING');
if(visual.items?.length!==12)fail.push('VISUAL_LEDGER_COUNT');
for(let i=0;i<q.length;i++){
 const x=q[i], n=i+1;
 if(x.id!==inv.items[i]?.id)fail.push(`UID_${n}`);
 for(const f of ['content','answer','solution','standardCourse','standardUnitKey','standardUnit','subUnitKey','subUnit','subUnitConfidence','subUnitClassificationDepth','questionType'])if(!x[f])fail.push(`MISSING_${n}_${f}`);
 if(!x.solution?.trim())fail.push(`EMPTY_SOLUTION_${n}`);
 if(cross.items[i]?.ordinal!==n||cross.items[i]?.status!=='MATCH')fail.push(`CROSSWALK_ROW_${n}`);
 if(visual.items[i]?.ordinal!==n)fail.push(`VISUAL_ROW_${n}`);
 const sub=master.find(y=>y.keyType==='subUnitKey'&&y.key===x.subUnitKey&&y.standardUnitKey===x.standardUnitKey);
 if(!sub||sub.subUnit!==x.subUnit||sub.parentKey!==x.standardUnitKey)fail.push(`SUBUNIT_MASTER_${n}`);
 if(x.image){const file=path.join(root,setRoot,x.image);if(!fs.existsSync(file))fail.push(`MISSING_IMAGE_${n}`);}
}
for(const f of ['problem-page-31.png','problem-page-32.png','answer-page-12.png','answer-page-13.png'])if(!fs.existsSync(path.join(root,evidenceRoot,f)))fail.push(`MISSING_SOURCE_EVIDENCE_${f}`);
const browser=read(`${evidenceRoot}/browser-render-report.json`);
if(browser.expectedQuestionCount!==12||browser.captures?.length!==6||browser.summary?.pass!==6||browser.summary?.fail!==0)fail.push('BROWSER_RENDER');
const report={schemaVersion:'VISANG_TEXTBOOK_STATIC_VALIDATION_v1',setTitle:'비상 공통수학2 함수 중단원학습점검 고1',questionCount:q.length,checks:{questionCount:q.length===12,inventory:inv.coverage?.observed===12,officialCrosswalk:cross.summary?.officialAnswerMatches===12,unitSubunitMasterParity:!fail.some(x=>x.startsWith('SUBUNIT_MASTER_')),visualRefs:q.filter(x=>x.image).length,sourcePageEvidence:4,browserModes:browser.summary},failures:fail};
fs.writeFileSync(path.join(root,evidenceRoot,'static-validation-report.json'),JSON.stringify(report,null,2)+'\n','utf8');console.log(JSON.stringify(report,null,2));if(fail.length)process.exitCode=1;
