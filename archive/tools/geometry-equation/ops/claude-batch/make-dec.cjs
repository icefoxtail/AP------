// usage: node .tmp/work/make-dec.cjs <key> <jsrel>  -> writes .tmp/work/dec-<key>.json and prints the table decisions
// OPEN -> UNSUPPORTED, CONTENT-OPEN -> CONTENT, KEEP_HISTORY -> KEEP, produced (rev/qNN exists) + existing solutionImage -> REPLACE
// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const fs=require('fs'),path=require('path');const [key,js]=process.argv.slice(2);const W='.tmp/work';
const md=fs.readFileSync(`${W}/triage-20261107/${key}.md`,'utf8');const tri={};
for(const m of md.matchAll(/^\|\s*Q?(\d+)\s*\|\s*([A-Z_-]+)/gm))tri[+m[1]]=m[2];
global.window={};eval(fs.readFileSync(js,'utf8'));const img=new Set(window.questionBank.filter(q=>q.solutionImage).map(q=>q.id));
const rev=new Set(fs.readdirSync(`${W}/runs/${key}/rev`).filter(d=>/^q\d+$/.test(d)).map(d=>+d.slice(1)));
const dec={};for(const [o,d] of Object.entries(tri)){const n=+o;
 if(rev.has(n))dec[n]=img.has(n)?'REPLACE':'FIGURE';
 else if(d==='OPEN')dec[n]='UNSUPPORTED';else if(d==='CONTENT-OPEN')dec[n]='CONTENT';else if(d==='KEEP_HISTORY')dec[n]='KEEP';
 else if(rev.has(n)&&img.has(n))dec[n]='REPLACE';else if(rev.has(n))dec[n]='FIGURE';
 else if(d==='FIGURE')dec[n]=img.has(n)?'KEEP_EXISTING':'UNSUPPORTED';}
for(const n of rev)if(!(n in dec))dec[n]=img.has(n)?'REPLACE':'FIGURE';
fs.writeFileSync(`${W}/dec-${key}.json`,JSON.stringify(dec));console.log(key,JSON.stringify(tri),'\n->',JSON.stringify(dec));
