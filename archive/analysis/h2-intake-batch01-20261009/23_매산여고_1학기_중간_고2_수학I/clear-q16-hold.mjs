import fs from 'node:fs';
import crypto from 'node:crypto';
const source=process.argv[2], output=process.argv[3];
if(!source||!output)throw new Error('SOURCE_AND_OUTPUT_REQUIRED');
if(fs.existsSync(output))throw new Error('OUTPUT_ALREADY_EXISTS');
const sha=s=>crypto.createHash('sha256').update(s).digest('hex');
const original=fs.readFileSync(source,'utf8');
const ranges=[],stack=[];let quote='',escaped=false,lineComment=false,blockComment=false;
for(let i=0;i<original.length;i++){const ch=original[i],next=original[i+1];if(lineComment){if(ch==='\n')lineComment=false;continue;}if(blockComment){if(ch==='*'&&next==='/'){blockComment=false;i++;}continue;}if(quote){if(escaped)escaped=false;else if(ch==='\\')escaped=true;else if(ch===quote)quote='';continue;}if(ch==='/'&&next==='/'){lineComment=true;i++;continue;}if(ch==='/'&&next==='*'){blockComment=true;i++;continue;}if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}if(ch==='{')stack.push(i);else if(ch==='}'){const begin=stack.pop();if(begin!==undefined)ranges.push([begin,i+1]);}}
let target=null;for(const [begin,end] of ranges){const body=original.slice(begin,end);if(/["']?(?:id|qid)["']?\s*:\s*["']?16\b/.test(body)&&/["']?reviewStatus["']?\s*:/.test(body)&&(!target||body.length<target.body.length))target={begin,end,body};}
if(!target)throw new Error('QID16_OBJECT_NOT_FOUND');
const re=/("reviewStatus"\s*:\s*)"HOLD"/g,matches=[...target.body.matchAll(re)];
if(matches.length!==1)throw new Error(`QID16_HOLD_FIELD_EXPECTED_ONCE_GOT_${matches.length}`);
const m=matches[0];const body=target.body.slice(0,m.index)+m[1]+'"reviewed_pass"'+target.body.slice(m.index+m[0].length);
const updated=original.slice(0,target.begin)+body+original.slice(target.end);
if(updated===original)throw new Error('NO_CHANGE');
fs.writeFileSync(source,updated,'utf8');
const report={schemaVersion:'R1_QID16_META_HOLD_CLEAR_V1',qid:16,changedFields:['reviewStatus'],from:'HOLD',to:'reviewed_pass',sourceBeforeSha256:sha(original),sourceAfterSha256:sha(updated),reason:'Fresh q16 independent freeze answer matches the unique stored choice; current q16 solution is logically consistent and has complete small-board steps. The student-facing q16 payload and assets remained exact.',freezePath:'archive/analysis/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/R1.recovery.q16.freeze.json',freezeSha256:'1e0e5ecd440deb9b4a00278f72db24a89665178917515a203cf287b639b1097a',scopedDisclosurePath:'archive/analysis/h2-intake-batch01-20261009/23_매산여고_1학기_중간_고2_수학I/technical-scoped-freeze-reuse-q16/current-postmeta/R1.scoped-postfreeze-disclosure.q16.v1.json',scopedDisclosureSha256:'9a80e45392b85d9a4ebd1c20651ca616fc4c1a73dff127ac5b58a2b158b5ca88',semanticRegistryChanged:false,studentFieldsChanged:false,answerChanged:false,solutionChanged:false,assetsChanged:false};
fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify({sourceBeforeSha256:report.sourceBeforeSha256,sourceAfterSha256:report.sourceAfterSha256,reportPath:output,reportSha256:sha(fs.readFileSync(output))},null,2));
