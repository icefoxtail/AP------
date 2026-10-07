import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');
const target='.tmp/archive/h1-final-three-pilot-20261007/21_고흥고_1학기_기말_고1_기출/21_고흥고_1학기_기말_고1_기출.js';
const evidence='archive/analysis/21_고흥고_1학기_기말_고1_기출/h1-final-three-pilot-20261007/R1.repair-provenance.json';
const pdf='C:/Users/USER/Desktop/기출정리 파일/(2)1기말/수학(상)/2021_고흥고1_1기말.pdf';
const replacements=[
 ['"$dfrac83$"','"$\\\\dfrac83$"'],['"$dfrac54$"','"$\\\\dfrac54$"'],['"$dfrac{13}3$"','"$\\\\dfrac{13}3$"'],['"$dfrac{15}4$"','"$\\\\dfrac{15}4$"'],['"$dfrac{17}3$"','"$\\\\dfrac{17}3$"'],
 ['"$-dfrac32$"','"$-\\\\dfrac32$"'],['"$dfrac43$"','"$\\\\dfrac43$"'],
 ['"$sqrt{10}$"','"$\\\\sqrt{10}$"'],['"$dfrac{sqrt{10}}3$"','"$\\\\dfrac{\\\\sqrt{10}}3$"'],['"$sqrt5$"','"$\\\\sqrt5$"'],['"$dfrac{sqrt{10}}5$"','"$\\\\dfrac{\\\\sqrt{10}}5$"'],['"$sqrt3$"','"$\\\\sqrt3$"']
];
let src=fs.readFileSync(target); const beforeSha256=sha(src); let text=src.toString('utf8');
const changed=[];
for(const [oldValue,newValue] of replacements){const count=text.split(oldValue).length-1;if(count!==1)throw Error(`EXPECTED_SINGLE_SOURCE_LOCUS:${oldValue}:${count}`);text=text.replace(oldValue,newValue);changed.push({oldValue,newValue});}
fs.writeFileSync(target,text); const after=fs.readFileSync(target);
const receipt={schemaVersion:'JS_ARCHIVE_R1_SOURCE_REPAIR_V1',runId:'h1-final-three-pilot-20261007',examUid:'21_고흥고_1학기_기말_고1_기출',sourceRawSha256Before:beforeSha256,sourceRawSha256After:sha(after),pdf:{path:pdf,sha256:'e4fcdf049c1eb5dff56e6c7c63cf02105109f221b75e32637f05ffaf5501ddb9'},changedLoci:[{qid:5,field:'choices',sourcePage:1,reason:'Restore LaTeX fraction command delimiters exactly matching the visible source choices.'},{qid:6,field:'choices',sourcePage:1,reason:'Restore LaTeX fraction command delimiters exactly matching the visible source choices.'},{qid:13,field:'choices',sourcePage:3,reason:'Restore radical/fraction command delimiters exactly matching the visible source choices.'}],literalReplacements:changed,semanticDelta:'None; only TeX command escaping and delimiters were restored to match source scan.',scope:'q5,q6,q13 choices only'};
fs.writeFileSync(evidence,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({target,sourceRawSha256Before:beforeSha256,sourceRawSha256After:sha(after),repairReceipt:evidence,receiptSha256:sha(fs.readFileSync(evidence)),changeCount:changed.length}));

