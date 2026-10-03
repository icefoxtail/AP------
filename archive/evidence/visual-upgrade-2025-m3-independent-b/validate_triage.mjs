import fs from 'node:fs';
import { validateVisualBenefit } from '../../tools/pipeline-core/solution-visual-benefit.mjs';
const triage=JSON.parse(fs.readFileSync('archive/evidence/visual-upgrade-2025-m3-independent-b/triage.json','utf8'));
const inv=JSON.parse(fs.readFileSync('archive/evidence/visual-upgrade-2025-m3-independent-b/inventory.json','utf8'));
const qmap=new Map(inv.exams.flatMap(e=>e.questions.map(q=>[q.questionUid,q])));
const results=triage.triage.map(row=>{const q=qmap.get(row.questionUid);const result=validateVisualBenefit(row.visualBenefitContract,{phase:'U1',question:{content:q.content},expectedFact:row.visualRequirement==='VISUAL_EXEMPT'?null:{visualType:row.expectedVisualType},ruleRefs:row.visualBenefitContract.applicablePolicyRefs});return{questionUid:row.questionUid,status:result.status,errors:result.errors??[]}});
const failed=results.filter(x=>x.status!=='PASS');const out={schemaVersion:'M3_V1_BENEFIT_VALIDATION_v1',denominator:results.length,passCount:results.length-failed.length,failCount:failed.length,results};fs.writeFileSync('archive/evidence/visual-upgrade-2025-m3-independent-b/v1-validation.json',JSON.stringify(out,null,2)+'\n','utf8');console.log(JSON.stringify({denominator:out.denominator,passCount:out.passCount,failCount:out.failCount,failures:failed.slice(0,5)}));if(failed.length)process.exitCode=1;
