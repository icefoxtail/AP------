import fs from 'node:fs';
const p='C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
let src=fs.readFileSync(p,'utf8');
function blockFor(id,next){const a=src.indexOf('"id": '+id+',');const b=src.indexOf('"id": '+next+',',a+1);if(a<0||b<0)throw Error('QID_BLOCK_NOT_FOUND:'+id);return [a,b];}
function setUnit(id,next,oldKey,oldLabel,newKey,newLabel,requiredType,requiredTemplate){const [a,b]=blockFor(id,next);const x=src.slice(a,b);if(!x.includes('"problemTypeKey": "'+requiredType+'"')||!x.includes('"templateKey": "'+requiredTemplate+'"'))throw Error('QID_META_AUTHORITY_MISMATCH:'+id);if(!x.includes('"subUnitKey": "'+oldKey+'"')||!x.includes('"subUnit": "'+oldLabel+'"'))throw Error('QID_META_OLD_VALUE_MISMATCH:'+id);const y=x.replace('"subUnitKey": "'+oldKey+'"','"subUnitKey": "'+newKey+'"').replace('"subUnit": "'+oldLabel+'"','"subUnit": "'+newLabel+'"');src=src.slice(0,a)+y+src.slice(b);}
setUnit(1,2,'H15-PS-01-COMBINATION','조합','H15-PS-01-PERMUTATION','순열','PT_COUNTING_ARRANGEMENT','TPL_PERMUTATION_STANDARD_CONSTRAINT');
fs.writeFileSync(p,src,'utf8');
