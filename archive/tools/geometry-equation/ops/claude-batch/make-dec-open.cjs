// usage: node .tmp/work/make-dec-open.cjs <key> <jsrel>  — after an OPEN fill: previous dec-<key>.json is the base;
// previously published (FIGURE/REPLACE) -> KEEP_EXISTING, rev-open qNN -> REPLACE (image exists) or FIGURE; others unchanged. Writes dec-<key>-open.json
// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const fs=require('fs');const [key,js,srcSub]=process.argv.slice(2);const W='.tmp/work';
const md=fs.readFileSync(`${W}/triage-20261107/${key}.md`,'utf8');const base={};
for(const m of md.matchAll(/^\|\s*Q?(\d+)\s*\|\s*([A-Z_-]+)/gm))base[+m[1]]=m[2]==='OPEN'?'UNSUPPORTED':m[2]==='CONTENT-OPEN'?'CONTENT':m[2]==='KEEP_HISTORY'?'KEEP':m[2];
const pf=`${W}/dec-${key}.json`;const prev=fs.existsSync(pf)?JSON.parse(fs.readFileSync(pf,'utf8')):{};for(const [k,v] of Object.entries(prev))base[+k]=v;
// current ledger state wins over old tables (later OPEN fills publish more items; 2026-11-09 19 금당 bug)
{const L=JSON.parse(fs.readFileSync('archive/tools/geometry-equation/production/exam-figure-ledger.json','utf8'));const nm=js.split('/').pop().replace(/\.js$/,'');const e=L.exams.find(x=>x.exam===nm);
 if(e)for(const i of e.items)base[i.ord]=i.state==='PUBLISHED'?'FIGURE':i.state==='EXEMPT'?'EXEMPT':i.state==='OPEN_CONTENT'?'CONTENT':i.state.startsWith('OPEN')?'UNSUPPORTED':base[i.ord];}
global.window={};eval(fs.readFileSync(js,'utf8'));const img=new Set((window.questionBank??window.examData?.questions).filter(q=>q.solutionImage).map(q=>q.id));
const ro=fs.readdirSync(`${W}/runs/${key}/${srcSub||"rev-open"}`).filter(d=>/^q\d+$/.test(d)).map(d=>+d.slice(1));
const dec={};for(const [k,v] of Object.entries(base)){const n=+k;dec[n]=(v==='FIGURE'||v==='REPLACE')?(img.has(n)?'KEEP_EXISTING':'UNSUPPORTED'):v;}
for(const n of ro)dec[n]=img.has(n)?'REPLACE':'FIGURE';
fs.writeFileSync(`${W}/dec-${key}-open.json`,JSON.stringify(dec));console.log(key,JSON.stringify(dec));
