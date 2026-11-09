// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const vm=require('vm'),fs=require('fs'),cp=require('child_process');
const load=s=>{const c={window:{}};vm.runInNewContext(s,c);return c.window.questionBank};
for(const f of process.argv.slice(2)){const a=load(cp.execSync(`git show HEAD:"${f}"`).toString()),b=load(fs.readFileSync(f,'utf8'));
 const strip=q=>JSON.stringify(Object.fromEntries(Object.entries(q).filter(([k])=>!k.startsWith('solutionImage'))));
 const bad=a.map((q,i)=>strip(q)!==strip(b[i])?q.id:null).filter(x=>x!==null);
 const changed=a.map((q,i)=>JSON.stringify(q)!==JSON.stringify(b[i])?q.id:null).filter(x=>x!==null);
 console.log(f.split('/').pop(),'len',a.length,b.length,'nonImageChanged',bad,'imageChanged',changed.join(','));}
