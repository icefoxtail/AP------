// usage: node .tmp/work/exam-figs.cjs <시험지 JS 저장소 상대경로>
// 시험지 전 문항의 기존 해설 그림(solutionImage)을 구형/신형으로 분류해 마크다운 표로 출력한다.
// 구형 = solutionImage가 .svg인데 파일 앞부분에 data-engine-version=, data-publication-profile=, data-composite=,
//        data-<무엇>="<무엇>-figure-v1" 중 어느 것도 없는 것. PNG 등 래스터 그림도 구형으로 본다.
// 분류: NONE(그림 없음) / NEW(신형 SVG) / OLD_SVG(구형 SVG) / OLD_PNG(래스터) / MISSING_FILE(참조만 있고 파일 없음)
// 저장소 루트에서 실행되도록 맞춘다(스크립트가 <repo>/.tmp/work 에 있을 때). 상대경로 인자는 저장소 루트 기준.
{const p=require('path'),d=p.resolve(__dirname,'..','..');if(p.basename(p.dirname(__dirname))==='.tmp'&&require('fs').existsSync(p.join(d,'.git')))process.chdir(d);}
const fs=require('fs'),path=require('path');
const js=process.argv[2];
if(!js){console.error('usage: node .tmp/work/exam-figs.cjs <시험지 JS>');process.exit(2);}
global.window={};eval(fs.readFileSync(js,'utf8'));
const bank=window.questionBank??window.examData?.questions;
function classify(rel){
  if(!rel)return {kind:'NONE'};
  const p=path.join('archive',rel);
  if(!fs.existsSync(p))return {kind:'MISSING_FILE',file:p};
  if(!/\.svg$/i.test(rel))return {kind:'OLD_PNG',file:p};
  const head=fs.readFileSync(p,'utf8').slice(0,8000);
  const isNew=/data-engine-version=|data-publication-profile=|data-composite=/.test(head)||/data-([a-z0-9-]+)="\1-figure-v1"/.test(head);
  return {kind:isNew?'NEW':'OLD_SVG',file:p};
}
const rows=[];const cnt={};
for(const q of bank){
  const c=classify(q.solutionImage);cnt[c.kind]=(cnt[c.kind]||0)+1;
  rows.push(`| Q${String(q.id).padStart(2,'0')} | ${c.kind} | ${q.solutionImage||'-'} |`);
}
console.log('| 문항 | 기존 해설 그림 | 파일 |');console.log('|---|---|---|');console.log(rows.join('\n'));
console.log('\n합계: '+Object.entries(cnt).map(([k,v])=>`${k} ${v}`).join(', ')+` (전체 ${bank.length}문항)`);
