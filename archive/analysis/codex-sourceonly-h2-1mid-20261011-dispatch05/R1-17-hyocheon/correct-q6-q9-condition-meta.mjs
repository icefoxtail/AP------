import fs from 'node:fs';
const p='C:/Users/USER/Desktop/AP------/archive/exams/original/high/h2/1mid/17_효천고_1학기_중간_고2_확률과통계.js';
let src=fs.readFileSync(p,'utf8');
function patchQid(id,next,needle,replace,context){const a=src.indexOf('"id": '+id+',');const b=src.indexOf('"id": '+next+',',a+1);if(a<0||b<0)throw Error('QID_BLOCK_NOT_FOUND:'+id);const x=src.slice(a,b);if(!x.includes(context))throw Error('QID_SOURCE_PREDICATE_MISSING:'+id);if(!x.includes(needle))throw Error('QID_CONDITION_BEFORE_MISMATCH:'+id);src=src.slice(0,a)+x.replace(needle,replace)+src.slice(b);}
patchQid(6,7,'"conditionKeys": []','"conditionKeys": [\n      "COND_POSITIVE"\n    ]','"content": "같은 종류의 공 9개를 같은 종류의 상자 3개에 나누어 넣을 때, 빈 상자가 없도록 넣는 경우의 수는? [5점]"');
patchQid(9,10,'"conditionKeys": []','"conditionKeys": [\n      "COND_POSITIVE"\n    ]','"content": "똑같은 2개의 접시에 서로 다른 5개의 빵을 나누어 담을 때, 빈 접시가 없도록 담는 모든 방법의 수는? [4점]"');
fs.writeFileSync(p,src,'utf8');
