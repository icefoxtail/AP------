import fs from 'node:fs';import vm from 'node:vm';
const p='archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_수학II.js';
const source=fs.readFileSync(p,'utf8');const sandbox={window:{}};vm.createContext(sandbox);vm.runInContext(source,sandbox);const questions=sandbox.window.questionBank;
const adds=new Map([[7,'그래프'],[8,'그래프'],[12,'그래프'],[13,'그래프'],[15,'도형'],[16,'그래프'],[19,'도형']]);
let text=source;const changes=[];
for(const [qid,tag] of adds){const q=questions.find(x=>Number(x.id)===qid);if(!q)throw Error('QID_NOT_FOUND:'+qid);if(q.tags.includes(tag)){changes.push({qid,tag,action:'KEEP'});continue;}
 const marker=`"id": ${qid},`;const idAt=text.indexOf(marker);if(idAt<0||text.indexOf(marker,idAt+1)>=0)throw Error('QID_MARKER_NOT_UNIQUE:'+qid);
 const nextMarker=`"id": ${qid+1},`;let end=nextMarker?text.indexOf(nextMarker,idAt+marker.length):-1;if(end<0)end=text.indexOf('\n  }\n];',idAt);if(end<0)end=text.length;
 const start=text.lastIndexOf('{',idAt);const block=text.slice(start,end);const m=block.match(/("tags"\s*:\s*\[)([\s\S]*?)(\n\s*\])/);if(!m)throw Error('TAGS_ARRAY_NOT_FOUND:'+qid);
 const lines=m[2];const insert=lines.trimEnd().endsWith(',')?`${lines.trimEnd()}\n      ${JSON.stringify(tag)},`:`${lines.trimEnd()},\n      ${JSON.stringify(tag)}`;
 const replacement=m[1]+insert+m[3];text=text.slice(0,start)+block.replace(m[0],replacement)+text.slice(end);
 changes.push({qid,tag,action:'ADD'});
}
const verify={window:{}};vm.createContext(verify);vm.runInContext(text,verify);for(const [qid,tag] of adds)if(!verify.window.questionBank.find(x=>Number(x.id)===qid).tags.includes(tag))throw Error('TAG_WRITE_VERIFY_FAIL:'+qid);
fs.writeFileSync(p,text,'utf8');fs.writeFileSync('archive/analysis/24_금당고_1학기_중간_고2_수학II/r1-clean-20261011/r1-visual-tag-correction.json',JSON.stringify({changes,studentBundleFieldsChanged:false,contentChoicesAnswerSolutionImageChanged:false,reason:'Canonical graph/figure tags added only to qids with student-facing solution visual or source graph; original q13 problem raster retained.'},null,2)+'\n');console.log(JSON.stringify(changes,null,2));