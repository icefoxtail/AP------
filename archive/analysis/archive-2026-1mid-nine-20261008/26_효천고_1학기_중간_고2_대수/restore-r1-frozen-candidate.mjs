import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import crypto from 'node:crypto';
const root=process.argv[2];
const source=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008/26_효천고_1학기_중간_고2_대수/26_효천고_1학기_중간_고2_대수.js');
const expected='5afa167857f4e23734358717db89876b07363a3a555292acc523f65476d57d43';
const raw=fs.readFileSync(source,'utf8');
const sha=s=>crypto.createHash('sha256').update(s,'utf8').digest('hex');
const c={window:{}};vm.createContext(c);vm.runInContext(raw,c,{filename:source,timeout:5000});
const qmap=new Map(c.window.questionBank.filter(q=>[13,23].includes(+q.id)).map(q=>[+q.id,q]));
const restore=new Map([
 [13,{difficultyBucket:4,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',difficultyReason:'PDF 원문에 60이 명확히 인쇄되어 있으며, 그 조건의 계산 결과가 다섯 보기와 일치하지 않는다.',conditionKeys:[],integrationPattern:'SINGLE_TOPIC',problemTypeKey:null,templateKey:null,crossConceptKeys:[]}],
 [23,{difficultyBucket:4,difficultyConfidence:'high',difficultyBoundaryFlag:'NONE',legacyLevelCompatibility:'NORMAL',difficultyReason:'기울기와 길이로 A,B의 좌표 차를 구하고, 넓이에서 BC를 확인해 원문 곡선 위의 점을 결정한다.',conditionKeys:[],integrationPattern:'SINGLE_TOPIC',problemTypeKey:null,templateKey:null,crossConceptKeys:[]}]
]);
const spans=[];
for(const[id] of restore){const start=raw.indexOf('"id": '+id+',');const re=/\n\s*\{\s*\n\s*"id":\s*\d+,/g;re.lastIndex=start+1;const nx=re.exec(raw),end=nx?nx.index:raw.indexOf('\n  }\n];',start);if(start<0||end<0)throw new Error('OBJECT_BOUNDARY:q'+id);spans.push({id,start,end,q:qmap.get(id)});}
let out=raw;
for(const x of spans.sort((a,b)=>b.start-a.start)){let block=out.slice(x.start,x.end);for(const[k,v]of Object.entries(restore.get(x.id))){const needle=JSON.stringify(k)+': '+JSON.stringify(x.q[k]),rep=JSON.stringify(k)+': '+JSON.stringify(v),at=block.indexOf(needle);if(at<0||block.indexOf(needle,at+needle.length)>=0)throw new Error('FIELD_MISMATCH:q'+x.id+':'+k);block=block.slice(0,at)+rep+block.slice(at+needle.length);}out=out.slice(0,x.start)+block+out.slice(x.end);}
const actual=sha(out);if(actual!==expected)throw new Error('RECONSTRUCTED_HASH_MISMATCH:'+actual);
const dir=path.join(root,'.tmp/archive/archive-2026-1mid-nine-20261008/26_효천고_1학기_중간_고2_대수/preimage/r1-frozen-candidate');fs.mkdirSync(dir,{recursive:true});const dst=path.join(dir,'26_효천고_1학기_중간_고2_대수.js');fs.writeFileSync(dst,out,'utf8');
console.log(JSON.stringify({ok:true,path:dst,rawSha256:actual,sourceInputRawSha256:sha(raw)},null,2));
