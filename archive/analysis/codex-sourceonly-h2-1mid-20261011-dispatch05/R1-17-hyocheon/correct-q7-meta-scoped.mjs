import fs from 'node:fs';
const p='C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
let src=fs.readFileSync(p,'utf8');
function blockFor(id,next){const a=src.indexOf('"id": '+id+',');const b=src.indexOf('"id": '+next+',',a+1);if(a<0||b<0)throw Error('QID_BLOCK_NOT_FOUND:'+id);return [a,b];}
{
 const [a,b]=blockFor(3,4),x=src.slice(a,b);
 if(!x.includes('"subUnitKey": "H15-PS-01-PERMUTATION"')||!x.includes('"subUnit": "순열"'))throw Error('Q3_EXPECTED_TEMPORARY_PATCH_NOT_FOUND');
 src=src.slice(0,a)+x.replace('"subUnitKey": "H15-PS-01-PERMUTATION"','"subUnitKey": "H15-PS-01-COMBINATION"').replace('"subUnit": "순열"','"subUnit": "조합"')+src.slice(b);
}
{
 const [a,b]=blockFor(7,8),x=src.slice(a,b);
 if(!x.includes('"subUnitKey": "H15-PS-01-COMBINATION"')||!x.includes('"templateKey": "TPL_REPEATED_PERMUTATION_ASSIGNMENT"'))throw Error('Q7_EVIDENCE_CONTEXT_NOT_FOUND');
 const y=x.replace('"subUnitKey": "H15-PS-01-COMBINATION"','"subUnitKey": "H15-PS-01-PERMUTATION"').replace('"subUnit": "조합"','"subUnit": "순열"');
 if(y===x)throw Error('Q7_META_NOT_CHANGED');
 src=src.slice(0,a)+y+src.slice(b);
}
fs.writeFileSync(p,src,'utf8');
