// usage: node .tmp/work/make-dec-exam.cjs <tablekey> <시험지 JS> <REV폴더>
// 시험지 단위 흐름(launch-exam → launch-exam-rev → Sonnet 최종)의 결과 <REV>/TABLE.md 를 그대로 게시 결정으로 쓴다.
//  - FIGURE/REPLACE 는 <REV>/qNN 에 렌더 결과(svg)가 있는 것만 게시 대상. 결과가 없으면 UNSUPPORTED.
//    (표의 FIGURE/REPLACE 는 시험지 JS의 solutionImage 유무에 맞춰 정규화한다: 이미지 있음 → REPLACE, 없음 → FIGURE.)
//  - KEEP_EXISTING / EXEMPT / UNSUPPORTED / CONTENT 는 표대로.
//  - 표에 없는 문항이 있으면(부분 결정 금지) 오류로 끝낸다.
// 출력 .tmp/work/dec-<key>-exam.json. build-pub.py 가 판정표를 .tmp/work/triage-20261107/<key>.md 에서 읽으므로
// <REV>/TABLE.md 를 그 경로로 복사한다(기존 파일은 <key>.md.bak-<날짜> 로 보존).
// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const fs=require('fs'),path=require('path');
const [key,js,rev]=process.argv.slice(2);const W='.tmp/work';
if(!key||!js||!rev){console.error('usage: node .tmp/work/make-dec-exam.cjs <tablekey> <시험지 JS> <REV폴더>');process.exit(2);}
const tp=path.join(rev,'TABLE.md');
if(!fs.existsSync(tp)){console.error(`ERROR: ${tp} 가 없다.`);process.exit(1);}
const md=fs.readFileSync(tp,'utf8');
const ALLOWED=new Set(['FIGURE','REPLACE','KEEP_EXISTING','EXEMPT','UNSUPPORTED','CONTENT']);
const tri={};
for(const m of md.matchAll(/^\|\s*Q?(\d+)\s*\|\s*([A-Z_]+)/gm))tri[+m[1]]=m[2];
global.window={};eval(fs.readFileSync(js,'utf8'));
const bank=window.questionBank;const ids=bank.map(q=>q.id);const img=new Set(bank.filter(q=>q.solutionImage).map(q=>q.id));
// 문항 id 가 숫자면 표의 번호 = id. 문자열 id(q01.., s01..)면 표/폴더의 번호 = 문제은행 순서(1부터): Q21..Q24 = s01..s04.
// 결정 JSON 의 키와 build-pub 의 ord 는 문자열 id 그대로("q01"), 폴더 이름은 qNN(순번).
const strIds=bank.some(q=>typeof q.id!=='number');
const idOf=n=>strIds?(bank[n-1]&&bank[n-1].id):n;
const seqOf=id=>strIds?bank.findIndex(q=>q.id===id)+1:id;
const errs=[];
for(const [o,d] of Object.entries(tri)){if(!ALLOWED.has(d))errs.push(`Q${o}: 알 수 없는 판정 ${d}`);if(!ids.includes(idOf(+o)))errs.push(`Q${o}: 시험지 JS에 없는 문항`);}
const missing=ids.filter(i=>!(seqOf(i) in tri));
if(missing.length)errs.push(`표에 없는 문항: ${missing.join(',')}`);
if(errs.length){console.error('ERROR: '+tp+'\n  '+errs.join('\n  '));process.exit(1);}
const hasResult=id=>{const d=path.join(rev,`q${String(seqOf(id)).padStart(2,'0')}`);return fs.existsSync(path.join(d,'out/figure-solution.svg'))||fs.existsSync(path.join(d,'figure-solution.svg'));};
const dec={};const notes=[];
for(const n of ids){
  const d=tri[seqOf(n)];
  if(d==='FIGURE'||d==='REPLACE'){
    if(!hasResult(n)){dec[n]='UNSUPPORTED';notes.push(`Q${n}: 표는 ${d}인데 ${rev}/q${String(seqOf(n)).padStart(2,'0')} 결과가 없어 UNSUPPORTED`);}
    else{const want=img.has(n)?'REPLACE':'FIGURE';dec[n]=want;if(want!==d)notes.push(`Q${n}: 표 ${d} → ${want} (JS solutionImage ${img.has(n)?'있음':'없음'})`);}
  }else{
    dec[n]=d;
    if(d==='KEEP_EXISTING'&&!img.has(n))notes.push(`WARN Q${n}: KEEP_EXISTING 인데 JS에 solutionImage가 없다`);
  }
}
// 판정표를 build-pub.py 가 읽는 위치로 복사(기존 것은 보존)
const dst=`${W}/triage-20261107/${key}.md`;
if(fs.existsSync(dst)&&fs.readFileSync(dst,'utf8')!==md){
  const t=new Date(),pad=x=>String(x).padStart(2,'0');const day=`${t.getFullYear()}${pad(t.getMonth()+1)}${pad(t.getDate())}`;
  let bak=`${dst}.bak-${day}`;if(fs.existsSync(bak))bak+=`-${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}`;
  fs.copyFileSync(dst,bak);console.log('백업:',bak);
}
fs.copyFileSync(tp,dst);console.log('판정표 복사:',tp,'->',dst);
const out=`${W}/dec-${key}-exam.json`;
fs.writeFileSync(out,JSON.stringify(dec));
const cnt={};for(const v of Object.values(dec))cnt[v]=(cnt[v]||0)+1;
for(const s of notes)console.log(s);
console.log(key,JSON.stringify(dec));console.log('집계:',JSON.stringify(cnt),'->',out);
