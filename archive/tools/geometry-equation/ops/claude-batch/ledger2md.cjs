// usage: node ledger2md.cjs <tablekey> <examName>  — writes triage-20261107/<key>.md from current ledger states (for exams published before triage-20261107)
// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const fs=require('fs');const [k,n]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync('archive/tools/geometry-equation/production/exam-figure-ledger.json','utf8'));
const e=L.exams.find(x=>x.exam===n); if(!e) throw new Error('not in ledger: '+n);
const map=s=>s==='PUBLISHED'?'KEEP_EXISTING':s==='EXEMPT'?'EXEMPT':s==='OPEN_CONTENT'?'CONTENT':s.startsWith('OPEN')?'UNSUPPORTED':s;
const rows=e.items.sort((a,b)=>a.ord-b.ord).map(i=>`| ${i.ord} | ${map(i.state)} | ledger ${i.state} |`);
fs.writeFileSync(`.tmp/work/triage-20261107/${k}.md`,`# ${n} (원장에서 생성)\n\n| 문항 | 판정 | 근거 |\n|---|---|---|\n${rows.join('\n')}\n`,'utf8');
console.log(k, rows.length);
