// usage: node mk-all.cjs <plansRef> <outRoot> <solplans.txt> — manifests for the listed solution plans whose _decisions.jsonl says FIGURE
const {execFileSync}=require('child_process');const fs=require('fs');const path=require('path');const vm=require('vm');
const [ref,outRoot,list]=process.argv.slice(2);const base='docs/plans/archive-one-route-upgrade/svg-plans-expanded/';
const files=fs.readFileSync(list,'utf8').split('\n').filter(Boolean);
const byExam={};for(const f of files){const rel=f.slice(base.length);const dir=path.posix.dirname(rel);(byExam[dir]=byExam[dir]||[]).push(f);}
const g=(r,p)=>{try{return execFileSync('git',['show',r+':'+p],{encoding:'utf8',maxBuffer:1<<28})}catch{return null}};
const load=(r,p)=>{const s=g(r,p);if(!s)return null;const c={window:{}};try{vm.runInNewContext(s,c)}catch{return null}return c.window.questionBank||c.window.examData?.questions||null};
const rows=[];let nf=0,nonfig=[];
for(const [dir,fl] of Object.entries(byExam)){
  const src='archive/exams/'+dir+'.js';const key=dir.replace(/\//g,'__');const K=path.join(outRoot,key);
  const dec=(g(ref,base+dir+'/_decisions.jsonl')||'').split('\n').filter(Boolean).map(l=>JSON.parse(l));
  const figPlans=new Set();dec.filter(d=>d.decision==='FIGURE').forEach(d=>(d.plans||[]).forEach(p=>figPlans.add(p)));
  const now=load('origin/main',src);if(!now){rows.push([key,'NO_SOURCE',fl.length].join('\t'));continue;}
  let rev='c57e1a1ca788ead8754db175ff0a8bc20fe158f0';try{const sr=JSON.parse(g(ref,base+dir+'/source-revision.json')||'{}');if(sr.mainCommit)rev=sr.mainCommit;}catch{}const old=load(rev,src);
  const items=[];const drift=[];
  for(const f of fl){const b=path.posix.basename(f,'.json');const n=+b.match(/^q(\d+)/)[1];
    if(!figPlans.has(b+'.json')){nonfig.push(key+'/'+b);continue;}
    const q=now[n-1],o=old?old[n-1]:null;
    if(o&&q&&['content','answer','solution','choices'].some(k=>JSON.stringify(o[k])!==JSON.stringify(q[k]))){drift.push(b);continue;}
    fs.mkdirSync(path.join(K,'pk',b),{recursive:true});fs.writeFileSync(path.join(K,'pk',b,'plan.json'),g(ref,f));
    items.push({dir:b,sourcePath:src,ordinal:(now.some(z=>typeof z.id!=="number")?now[n-1].id:n)});}
  if(items.length)fs.writeFileSync(path.join(K,'pk.manifest.json'),JSON.stringify({items},null,1));
  if(drift.length){fs.mkdirSync(K,{recursive:true});fs.writeFileSync(path.join(K,'DRIFT.txt'),drift.join('\n')+'\n');}
  rows.push([key,items.length,drift.length].join('\t'));
}
fs.writeFileSync(path.join(outRoot,'EXAMS.tsv'),rows.join('\n')+'\n');fs.writeFileSync(path.join(outRoot,'NONFIG.txt'),nonfig.join('\n')+'\n');
console.log('exams',rows.length,'plans',rows.reduce((s,r)=>s+(+r.split('\t')[1]||0),0),'drift',rows.reduce((s,r)=>s+(+r.split('\t')[2]||0),0),'nonfig',nonfig.length);
