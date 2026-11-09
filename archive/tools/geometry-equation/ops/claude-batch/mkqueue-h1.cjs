// 고1 1mid·1final·2mid 시험지 대기열(최신 연도 내림차순, 같은 연도는 1mid→1final→2mid). 이미 runs/<key>/exam-impl 또는 ds-draft 가 있는 것은 뺀다.
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'..','..');
const M={강남여고:'gangnamgirls',고흥고:'goheung',광양제철고:'gyjecheol',금당고:'geumdang',매산고:'maesan',매산여고:'maesangirls',복성고:'bokseong',부영여고:'buyounggirls',순천고:'suncheon',순천여고:'suncheongirls',여수고:'yeosu',여수여고:'yeosugirls',여천고:'yeocheon',제일고:'jeil',충무고:'chungmu',팔마고:'palma',한영고:'hanyoung',효천고:'hyocheon'};
const out=[],seen={};
for(const t of ['1mid','1final','2mid']){for(const f of fs.readdirSync(path.join(R,'archive/exams/original/high/h1',t)).filter(f=>f.endsWith('.js'))){
  const [y,s]=f.split('_');let k=`h1-${t}-${y}-${M[s]||'x'+s}`;seen[k]=(seen[k]||0)+1;if(seen[k]>1)k+=`-${seen[k]}`;
  out.push({y:+y,ti:['1mid','1final','2mid'].indexOf(t),k,js:`archive/exams/original/high/h1/${t}/${f}`});}}
out.sort((a,b)=>b.y-a.y||a.ti-b.ti||a.k.localeCompare(b.k));
for(const o of out){ if(['exam-impl','ds-draft'].some(d=>fs.existsSync(path.join(__dirname,'runs',o.k,d))))continue; console.log(o.k+'\t'+o.js);}
