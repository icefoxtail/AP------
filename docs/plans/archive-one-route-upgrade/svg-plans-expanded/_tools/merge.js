// 한 문항 여러 플랜 -> composite-panels-v1 한 장
const fs=require('fs'),path=require('path');
const L=require('./lib.js');
const DROP=['caption','sourceConditions','newVisualInformation','accessibilityDescription','sourceQuote','solidCaption','coordinateBand'];
function clean(p){const o={};for(const k of Object.keys(p))if(!DROP.includes(k))o[k]=p[k];return o;}
function firstClause(s,n){
  s=(s||'').replace(/\s+/g,' ').trim();
  const m=s.match(/^(.+?)(다\.|[.!?]|$)/);let t=m?m[1]:s;
  if(t.length<=n)return t;
  // 쉼표/공백에서 자르기
  let cut=t.slice(0,n);const i=Math.max(cut.lastIndexOf(','),cut.lastIndexOf(' '));
  if(i>8)cut=cut.slice(0,i);
  return cut.replace(/[,\s]+$/,'');}
const OKCH=/[^가-힣A-Za-z0-9 =+<>.,()\/-]/g;
function safe(t){return t.replace(OKCH,'').replace(/\s+/g,' ').trim();}
function fit(u,i){if(u.length>=2&&u.length<=16)return u;if(u.length>16){const c=u.slice(0,16);const j=c.lastIndexOf(' ');const t=(j>=6?c.slice(0,j):c).trim();if(t.length>=4)return t;}return '경우 '+(i+1);}
function titles(caps){const r=titles0(caps).map((t,i)=>fit(safe(t),i));return new Set(r).size===r.length?r:r.map((t,i)=>'경우 '+(i+1));}
function titles0(caps){
  const n=caps.length;
  // 공통 앞·뒤 제거로 달라진 부분 찾기
  let pre=0;while(pre<Math.min(...caps.map(c=>c.length))&&caps.every(c=>c[pre]===caps[0][pre]))pre++;
  let suf=0;const minL=Math.min(...caps.map(c=>c.length));
  while(suf<minL-pre&&caps.every(c=>c[c.length-1-suf]===caps[0][caps[0].length-1-suf]))suf++;
  const mids=caps.map(c=>c.slice(pre,c.length-suf));
  const similar=pre+suf>=0.6*Math.max(...caps.map(c=>c.length));
  if(similar&&mids.every(m=>m.length>0&&m.length<=14)){
    let ctx=caps[0].slice(Math.max(0,pre-12),pre);const sp=ctx.search(/[\s,.]/);
    // 앞에서 가장 가까운 공백 이후만 사용
    const j=Math.max(ctx.lastIndexOf(' '),ctx.lastIndexOf(','),ctx.lastIndexOf('.'));ctx=j>=0?ctx.slice(j+1):ctx;
    const t=mids.map(m=>(ctx+m).trim());
    if(t.every(x=>x.length>0&&x.length<=24)&&new Set(t).size===n)return t;
  }
  const t=caps.map(c=>firstClause(c,24));
  if(new Set(t).size===n&&t.every(x=>x.length>=3))return t;
  return caps.map((c,i)=>'경우 '+(i+1));
}
function topCaption(caps){
  const sents=[];for(const c of caps)for(const s of c.split(/(?<=[.다])\s+/)){const t=s.trim();if(t&&!sents.includes(t))sents.push(t);}
  return sents.join(' ');}
// files: 절대경로 배열(정렬됨), exam: 'original/...' (확장자 없음), ord
function mergeGroup(files,exam,ord,opts){
  opts=opts||{};
  const plans=files.map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
  const caps=plans.map(p=>p.caption||'');
  const t=opts.titles||titles(caps);
  const panels=plans.map((p,i)=>[t[i],clean(p)]);
  const sc=L.src(exam,ord,opts.method||('한 문항 한 장 규칙에 따라 '+plans.length+'개 그림을 패널로 합쳤다.'));
  const cap=opts.caption||topCaption(caps);
  const comp=L.composite(panels,cap,sc,opts.extra);
  return comp;
}
module.exports={mergeGroup,titles,topCaption,clean};
