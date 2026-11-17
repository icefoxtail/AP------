const fs=require('fs'),path=require('path');
const L=require('./lib.js');const D=require('./dec.js');const M=require('./merge2.js');
const S=__dirname;
const [N,scopes]=[process.argv[2],process.argv[3].split(',')];
const ml=JSON.parse(fs.readFileSync(S+'/multilist.json','utf8'));
const TAG='batch'+N+'-composite';
const done=[],holds=[];
for(const row of M.rows){
  if(row.led==='PUBLISHED')continue;
  if(!scopes.includes(row.scope))continue;
  const files=ml.find(([k])=>k===row.k)[1].sort();
  const r=M.build(row,files);
  const examRel=row.k.slice(2,row.k.lastIndexOf('#'));
  if(!r.ok){holds.push([row.scope,examRel,row.ord,r.reason,r.detail||'']);continue;}
  const dir=L.W+examRel;
  const prefix=path.basename(files[0]).replace(/-solution.*$/,'');
  const newName=prefix+'-solution.json';
  const out=dir+'/'+newName;
  if(fs.existsSync(out)){holds.push([row.scope,examRel,row.ord,'TARGET_EXISTS','']);continue;}
  fs.writeFileSync(out,JSON.stringify(r.plan,null,2)+'\n');
  D.toHistory(examRel,files.map(f=>path.basename(f)),TAG);
  D.upsert(examRel,row.ord,{decision:'FIGURE',plans:[newName],capability:r.plan.capability,render:'NOT_RUN',
    note:'batch'+N+': 한 문항 한 장으로 통합('+files.length+'개 -> '+r.family+'). 옛 플랜은 history/'+TAG+'. 정답 숨김 없음.'});
  done.push({scope:row.scope,exam:'archive/exams/'+examRel+'.js',ordinal:row.ord,family:r.family,oldPlans:files.length,newPlan:newName});
}
fs.writeFileSync(S+'/done_'+N+'.json',JSON.stringify(done,null,1));
fs.writeFileSync(S+'/holds_'+N+'.json',JSON.stringify(holds,null,1));
const c={};for(const d of done)c[d.family+'|'+d.scope]=(c[d.family+'|'+d.scope]||0)+1;
console.log('merged',done.length,c);const h={};for(const x of holds)h[x[3]]=(h[x[3]]||0)+1;console.log('holds',holds.length,h);
