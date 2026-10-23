import { useId, type ReactNode } from 'react';
import type { PracticeId, PracticeParams } from './catalog';

type Mode='original'|'line'|'area';
const BLUE='#2563eb',ORANGE='#e56b36',GREEN='#bcebd7',INK='#64748b';
const clean=(n:number)=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
const polar=(cx:number,cy:number,r:number,a:number)=>[cx+r*Math.cos((a-90)*Math.PI/180),cy+r*Math.sin((a-90)*Math.PI/180)] as const;
function sector(cx:number,cy:number,r:number,a:number,b:number){const p=polar(cx,cy,r,a),q=polar(cx,cy,r,b);return `M ${cx} ${cy} L ${p[0]} ${p[1]} A ${r} ${r} 0 ${b-a>180?1:0} 1 ${q[0]} ${q[1]} Z`}
function arc(cx:number,cy:number,r:number,a:number,b:number){const p=polar(cx,cy,r,a),q=polar(cx,cy,r,b);return `M ${p[0]} ${p[1]} A ${r} ${r} 0 ${b-a>180?1:0} 1 ${q[0]} ${q[1]}`}
function points(n:number,cx:number,cy:number,r:number){return Array.from({length:n},(_,i)=>polar(cx,cy,r,i*360/n)).map(p=>p.join(',')).join(' ')}
function roundedHull(ps:{x:number;y:number}[],r:number){const normals=ps.map((p,i)=>{const q=ps[(i+1)%ps.length],dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);return {x:dy/len,y:-dx/len}});let d='';for(let i=0;i<ps.length;i++){const p=ps[i],before=normals[(i+ps.length-1)%ps.length],after=normals[i],a={x:p.x+before.x*r,y:p.y+before.y*r},b={x:p.x+after.x*r,y:p.y+after.y*r};d+=`${i===0?'M':'L'}${a.x} ${a.y} A${r} ${r} 0 0 1 ${b.x} ${b.y} `}return `${d}Z`}
const label=(x:number,y:number,s:string)=><text key={`${x}-${y}-${s}`} x={x} y={y} textAnchor="middle" className="diagram-value">{s}</text>;

type PieceSpec={sign:'+'|'−';label:string;kind:'circle'|'semi'|'sector'|'rect'|'square';scale?:number};
function areaPieces(id:PracticeId,variant:string,p:PracticeParams):PieceSpec[]{
  if(id==='sector')return variant==='sector-ratio-pie'?[{sign:'+',label:'1/6 부채꼴',kind:'sector',scale:1/3},{sign:'+',label:'2/6 부채꼴',kind:'sector',scale:2/3},{sign:'+',label:'3/6 부채꼴',kind:'sector'}]:[{sign:'+',label:'부채꼴',kind:'sector'}];
  if(id==='boundary')return variant==='boundary-track'?[{sign:'+',label:'직사각형',kind:'rect'},{sign:'+',label:'양옆 반원',kind:'circle'}]:variant==='boundary-ring'?[{sign:'+',label:'바깥 부채꼴',kind:'sector'},{sign:'−',label:'안쪽 부채꼴',kind:'sector',scale:(p.r??4)/(p.R??8)}]:[{sign:'+',label:'정사각형',kind:'square'},{sign:'−',label:'파낸 반원',kind:'semi'}];
  if(id==='square')return variant==='square-flower'?[{sign:'+',label:'정사각형',kind:'square'},{sign:'−',label:'사분원 4개',kind:'circle'}]:variant==='square-inscribed'?[{sign:'+',label:'원',kind:'circle'},{sign:'−',label:'내접 정사각형',kind:'square'}]:variant==='square-rect-quadrant'?[{sign:'+',label:'사분원',kind:'sector'},{sign:'+',label:'내접 직사각형',kind:'rect'}]:[{sign:'+',label:'사분원 1',kind:'sector'},{sign:'+',label:'사분원 2',kind:'sector'},{sign:'−',label:'겹친 정사각형',kind:'square'}];
  if(id==='spinarea'){const ratio=(p.r??3)/((p.r??3)+(p.w??3));return [{sign:'+',label:'큰 부채꼴',kind:'sector'},{sign:'−',label:'작은 부채꼴',kind:'sector',scale:ratio}]}
  if(id==='rolling')return [{sign:'+',label:'직선 띠',kind:'rect'},{sign:'+',label:'모서리 원',kind:'circle',scale:2}];
  if(id==='overlap')return variant==='overlap-nested'||variant==='overlap-baby-circle'?[{sign:'+',label:'큰 원',kind:'circle'},{sign:'−',label:'작은 원',kind:'circle',scale:variant==='overlap-baby-circle'?.5:(p.r??3)/(p.R??6)}]:variant==='overlap-leaf'?[{sign:'+',label:'작은 반원 A',kind:'semi'},{sign:'+',label:'작은 반원 B',kind:'semi'},{sign:'+',label:'직각삼각형',kind:'square'},{sign:'−',label:'빗변 반원',kind:'semi'}]:[{sign:'+',label:'원 A',kind:'circle'},{sign:'+',label:'원 B',kind:'circle'},{sign:'−',label:'공통 렌즈',kind:'sector'}];
  if(id==='polygon')return [{sign:'+',label:'한 부채꼴',kind:'sector'}];
  if(id==='tether'){const R=p.R??7;return variant==='tether-wall'?[{sign:'+',label:'접근 가능한 반원',kind:'semi'}]:[{sign:'+',label:'처음 270°',kind:'sector'},{sign:'+',label:'가로 모퉁이',kind:'sector',scale:Math.max(0,R-(p.w??5))/R},{sign:'+',label:'세로 모퉁이',kind:'sector',scale:Math.max(0,R-(p.h??4))/R}]}
  if(id==='equalarea')return variant==='equalarea-common-part'?[{sign:'+',label:'사분원',kind:'sector'},{sign:'+',label:'직사각형 r×x',kind:'rect'}]:[{sign:'+',label:'작은 반원 A',kind:'semi'},{sign:'+',label:'작은 반원 B',kind:'semi'},{sign:'+',label:'직각삼각형',kind:'square'},{sign:'−',label:'빗변의 반원',kind:'semi'}];
  if(id==='pizza'){const a=p.a??18,b=variant==='pizza-equal'?a:(p.b??16),max=Math.max(a,b);return [{sign:'+',label:'피자 A 한 조각',kind:'sector',scale:a/max},{sign:'+',label:'피자 B 한 조각',kind:'sector',scale:b/max}]}
  return [];
}
function pieceShape(kind:PieceSpec['kind']){
  if(kind==='circle')return <circle cx="0" cy="0" r="15" fill="#bcebd7" stroke="#16845f" strokeWidth="1.8"/>;
  if(kind==='semi')return <path d="M-16 0 A16 16 0 0 1 16 0 Z" fill="#bcebd7" stroke="#16845f" strokeWidth="1.8"/>;
  if(kind==='sector')return <path d={sector(0,0,18,0,90)} fill="#bcebd7" stroke="#16845f" strokeWidth="1.8"/>;
  if(kind==='rect')return <rect x="-25" y="-12" width="50" height="24" rx="3" fill="#bcebd7" stroke="#16845f" strokeWidth="1.8"/>;
  return <rect x="-16" y="-16" width="32" height="32" rx="2" fill="#bcebd7" stroke="#16845f" strokeWidth="1.8"/>;
}

export default function PracticeCanvas({id,variant,p,mode,progress=1}:{id:PracticeId;variant:string;p:PracticeParams;mode:Mode;progress?:number}){
  const clipId=`lens-clip-${useId().replace(/:/g,'')}`;
  const cx=210,cy=160,hot=mode==='line',area=mode==='area';
  let drawing:ReactNode;
  if(id==='arc'||id==='sector'){
    const r=100,theta=p.theta??120,path=sector(cx,cy,r,0,theta);
    if(id==='arc'&&variant==='arc-isosceles'){
      const base=p.base??30,central=180-2*base,a=180-central/2,b=180+central/2,A=polar(cx,cy,r,a),B=polar(cx,cy,r,b);
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/><path d={sector(cx,cy,r,a,b)} fill={area?'#bcebd7':'#edf5ff'} stroke="none"/><path d={arc(cx,cy,r,a,b)} fill="none" stroke={hot?ORANGE:'#e56b36'} strokeWidth={hot?8:5} data-practice-boundary/><line x1={cx} y1={cy} x2={A[0]} y2={A[1]} stroke="#2563eb" strokeWidth="3"/><line x1={cx} y1={cy} x2={B[0]} y2={B[1]} stroke="#2563eb" strokeWidth="3"/><line x1={A[0]} y1={A[1]} x2={B[0]} y2={B[1]} stroke="#64748b" strokeWidth="2"/><text x={cx-38} y={cy+44} className="diagram-note">{base}°</text><text x={cx+38} y={cy+44} className="diagram-note">{base}°</text>{label(cx,cy+10,`${central}°`)}</>;
    }else if(id==='arc'&&variant==='arc-secant3'){
      const theta=p.secant??24,base=polar(cx,cy,r,0),three=polar(cx,cy,r,3*theta),outer=[cx-132,cy+65];
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/><path d={arc(cx,cy,r,0,theta)} fill="none" stroke="#2563eb" strokeWidth={hot?8:5} data-practice-boundary/><path d={arc(cx,cy,r,theta,3*theta)} fill="none" stroke="#e56b36" strokeWidth={hot?8:5} data-practice-boundary/><line x1={outer[0]} y1={outer[1]} x2={base[0]} y2={base[1]} stroke="#64748b" strokeWidth="2"/><line x1={outer[0]} y1={outer[1]} x2={three[0]} y2={three[1]} stroke="#64748b" strokeWidth="2"/><circle cx={outer[0]} cy={outer[1]} r="5" fill="#e56b36"/>{label(cx,cy-16,`θ → 2θ → 3θ`)}{label(cx,cy+18,`호 AD = 3 × 호 BC`)}</>;
    }else if(id==='arc'&&variant==='arc-parallel'){
      const a1=-theta/2,a2=theta/2,b1=180-theta/2,b2=180+theta/2,p1=polar(cx,cy,r,a1),p2=polar(cx,cy,r,a2),p3=polar(cx,cy,r,b1),p4=polar(cx,cy,r,b2);
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/><path d={arc(cx,cy,r,a1,a2)} fill="none" stroke={hot?BLUE:'#2563eb'} strokeWidth={hot?8:5} strokeLinecap="round" data-practice-boundary/><path d={arc(cx,cy,r,b1,b2)} fill="none" stroke={hot?ORANGE:'#e56b36'} strokeWidth={hot?8:5} strokeLinecap="round" data-practice-boundary/><line x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} stroke="#94a3b8" strokeWidth="3"/><line x1={p3[0]} y1={p3[1]} x2={p4[0]} y2={p4[1]} stroke="#94a3b8" strokeWidth="3"/><line x1={cx} y1={cy} x2={p1[0]} y2={p1[1]} stroke="#64748b" strokeWidth="2"/><line x1={cx} y1={cy} x2={p3[0]} y2={p3[1]} stroke="#64748b" strokeWidth="2"/>{label(cx,cy-34,`위 호 ${theta}°`)}{label(cx,cy+48,`아래 호 ${theta}°`)}</>;
    }else if(id==='arc'&&variant==='arc-ratio'){
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/><path d={arc(cx,cy,r,0,theta)} fill="none" stroke={hot?BLUE:'#2563eb'} strokeWidth={hot?8:5} strokeLinecap="round" data-practice-boundary/>{theta<360&&<path d={arc(cx,cy,r,theta,360)} fill="none" stroke={hot?ORANGE:'#e56b36'} strokeWidth={hot?8:5} strokeLinecap="round" data-practice-boundary/>}<line x1={cx} y1={cy} x2={polar(cx,cy,r,0)[0]} y2={polar(cx,cy,r,0)[1]} stroke="#64748b" strokeWidth="2"/><line x1={cx} y1={cy} x2={polar(cx,cy,r,theta)[0]} y2={polar(cx,cy,r,theta)[1]} stroke="#64748b" strokeWidth="2"/>{label(cx,cy,`${theta}° : ${360-theta}°`)}</>;
    }else if(id==='sector'&&variant==='sector-ratio-pie'){
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#dbe4ec" strokeWidth="2"/><path d={sector(cx,cy,r,0,60)} fill="#bcebd7" stroke="#16845f" strokeWidth="2"/><path d={sector(cx,cy,r,60,180)} fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/><path d={sector(cx,cy,r,180,360)} fill="#ffe2c9" stroke="#df7945" strokeWidth="2"/>{label(cx+38,cy-42,'1 : 2 : 3')}</>;
    }else{
      drawing=<><circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/><path d={path} fill={area?'#bcebd7':'#eaf3ff'} stroke="none"/><path d={arc(cx,cy,r,0,theta)} fill="none" stroke={ORANGE} strokeWidth={hot?8:5} strokeLinecap="round" data-practice-boundary/><line x1={cx} y1={cy} x2={polar(cx,cy,r,0)[0]} y2={polar(cx,cy,r,0)[1]} stroke={hot&&id==='sector'?ORANGE:INK} strokeWidth={hot&&id==='sector'?6:2} data-practice-boundary={hot&&id==='sector'?'true':undefined}/><line x1={cx} y1={cy} x2={polar(cx,cy,r,theta)[0]} y2={polar(cx,cy,r,theta)[1]} stroke={hot&&id==='sector'?ORANGE:INK} strokeWidth={hot&&id==='sector'?6:2} data-practice-boundary={hot&&id==='sector'?'true':undefined}/>{label(222,151,`${theta}°`)}</>;
    }
  }else if(id==='boundary'){
    if(variant==='boundary-track'){
      const radius=82,x1=cx-radius,x2=cx+radius,y1=cy-radius,y2=cy+radius;
      drawing=<><path d={`M${x1} ${y1} H${x2} A${radius} ${radius} 0 0 1 ${x2} ${y2} H${x1} A${radius} ${radius} 0 0 1 ${x1} ${y1} Z`} fill={area?GREEN:'#eaf3ff'} stroke={hot?ORANGE:INK} strokeWidth={hot?7:3} data-practice-boundary/><line x1={x1} y1={y1} x2={x2} y2={y1} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2}/><line x1={x1} y1={y2} x2={x2} y2={y2} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2}/>{label(cx,cy+radius+30,'두 반원 호 + 위·아래 직선')}</>;
    }else if(variant==='boundary-ring'){
      const R=106,r=58,t=p.theta??90,outer=arc(cx,cy,R,0,t),inner=arc(cx,cy,r,0,t),path=`${sector(cx,cy,R,0,t)} ${sector(cx,cy,r,0,t)}`;
      drawing=<><path d={path} fill={area?GREEN:'#edf5ff'} fillRule="evenodd"/><path d={outer} fill="none" stroke={hot?BLUE:INK} strokeWidth={hot?7:3} data-practice-boundary/><path d={inner} fill="none" stroke={hot?ORANGE:INK} strokeWidth={hot?7:3} data-practice-boundary/><line x1={cx+R} y1={cy} x2={cx+r} y2={cy} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/><line x1={cx+R*Math.cos(t*Math.PI/180)} y1={cy+R*Math.sin(t*Math.PI/180)} x2={cx+r*Math.cos(t*Math.PI/180)} y2={cy+r*Math.sin(t*Math.PI/180)} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/>{label(cx,42,'고리 모양 부채꼴 · 안팎 경계')}</>;
    }else{
      const s=180,x=120,y=65,r=s/2,d=`M${x} ${y} H${x+s} V${y+r} A${r} ${r} 0 0 1 ${x+s} ${y+s} H${x} Z`;
      drawing=<><rect x={x} y={y} width={s} height={s} fill="#f8fafc" stroke="#cbd5e1" strokeDasharray="5 5"/><path d={d} fill={area?GREEN:'#edf5ff'} stroke="none"/><path d={arc(x+s,y+r,r,-90,90)} fill="none" stroke={hot?BLUE:INK} strokeWidth={hot?7:3} data-practice-boundary/><line x1={x} y1={y} x2={x+s} y2={y} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/><line x1={x} y1={y} x2={x} y2={y+s} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/><line x1={x} y1={y+s} x2={x+s} y2={y+s} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/>{label(cx,285,`정사각형 한 변 ${p.s} cm · 잘린 지름선은 제외`)}</>;
    }
  }else if(id==='square'){
    const s=172,x=124,y=67;
    if(variant==='square-rect-quadrant'){
      const radius=104,unit=radius/(p.s??8),a=Math.min(p.a??5,(p.s??8)-.1),b=Math.sqrt((p.s??8)**2-a*a),ox=118,oy=250,w=a*unit,h=b*unit;
      drawing=<><path d={sector(ox,oy,radius,0,90)} fill={area?GREEN:'#eaf3ff'} stroke={hot?ORANGE:INK} strokeWidth={hot?6:3} data-practice-boundary/><rect x={ox} y={oy-h} width={w} height={h} fill="#fff" stroke="#2563eb" strokeWidth="3"/><line x1={ox} y1={oy} x2={ox+w} y2={oy-h} stroke="#e56b36" strokeWidth="3"/><path d={`M${ox+14} ${oy} V${oy-14} H${ox}`} fill="none" stroke="#334155" strokeWidth="2"/>{label(ox+w/2,oy-h/2,`${clean(a)}×${clean(b)}`)}{label(cx,cy+116,`대각선 AC = 반지름 OB = ${p.s} cm`)}</>;
    }else if(variant==='square-inscribed'){
      drawing=<><circle cx={cx} cy={cy} r="100" fill={area?GREEN:'#eaf3ff'} stroke={hot?BLUE:INK} strokeWidth={hot?6:3} data-practice-boundary/><polygon points={`${cx},${cy-100} ${cx+100},${cy} ${cx},${cy+100} ${cx-100},${cy}`} fill="#fff" stroke={hot?ORANGE:INK} strokeWidth={hot?6:3} data-practice-boundary/><line x1={cx-100} y1={cy} x2={cx+100} y2={cy} stroke="#94a3b8" strokeDasharray="4 4"/><line x1={cx} y1={cy-100} x2={cx} y2={cy+100} stroke="#94a3b8" strokeDasharray="4 4"/>{label(cx,cy+6,'대각선 = 원의 지름')}</>;
    }else if(variant==='square-flower'){
      drawing=<><rect x={x} y={y} width={s} height={s} fill={area?GREEN:'#edf5ff'} stroke="#cbd5e1"/><circle cx={x} cy={y} r={s/2} fill="#fff"/><circle cx={x+s} cy={y} r={s/2} fill="#fff"/><circle cx={x+s} cy={y+s} r={s/2} fill="#fff"/><circle cx={x} cy={y+s} r={s/2} fill="#fff"/>{[arc(x,y+s/2,s/2,0,90),arc(x+s,y+s/2,s/2,90,180),arc(x+s,y+s/2,s/2,180,270),arc(x,y+s/2,s/2,270,360)].map((d,i)=><path key={i} d={d} fill="none" stroke={hot?i%2?ORANGE:BLUE:INK} strokeWidth={hot?6:3} data-practice-boundary/>)}</>;
    }else{
      drawing=<><rect x={x} y={y} width={s} height={s} fill="#fff" stroke="#cbd5e1"/><path d={`M${x} ${y} A${s} ${s} 0 0 1 ${x+s} ${y+s} A${s} ${s} 0 0 1 ${x} ${y} Z`} fill={area?GREEN:'#edf5ff'} stroke={hot?ORANGE:INK} strokeWidth={hot?6:3} data-practice-boundary/>{label(cx,285,'두 사분원의 공통 렌즈')}</>;
    }
  }else if(id==='spinarea'){
    const outer=110,inner=outer*(p.r??3)/((p.r??3)+(p.w??3)),t=p.theta??60;
    drawing=<><path d={`${sector(cx,cy,outer,0,t)} ${sector(cx,cy,inner,0,t)}`} fill={area?GREEN:'#eaf3ff'} fillRule="evenodd"/><path d={arc(cx,cy,outer,0,t)} fill="none" stroke={hot?BLUE:INK} strokeWidth={hot?7:3} data-practice-boundary/><path d={arc(cx,cy,inner,0,t)} fill="none" stroke={hot?ORANGE:INK} strokeWidth={hot?7:3} data-practice-boundary/><line x1={cx+inner} y1={cy} x2={cx+outer} y2={cy} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/><line x1={cx+inner*Math.cos(t*Math.PI/180)} y1={cy+inner*Math.sin(t*Math.PI/180)} x2={cx+outer*Math.cos(t*Math.PI/180)} y2={cy+outer*Math.sin(t*Math.PI/180)} stroke={hot?ORANGE:INK} strokeWidth={hot?6:2} data-practice-boundary={hot?'true':undefined}/></>;
  }else if(id==='rotate'){
    const r=100,t=p.theta??90,triangle=variant==='rotate-triangle';
    drawing=<>{triangle?<polygon points={points(3,cx,cy,94)} fill="#f8fafc" stroke="#94a3b8" strokeWidth="3"/>:<rect x="140" y="115" width="100" height="100" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3"/>}<circle cx={cx} cy={cy} r={r} fill="none" stroke="#dbe4ec" strokeDasharray="5 5"/><path d={arc(cx,cy,r,0,t)} fill="none" stroke={ORANGE} strokeWidth={hot?8:5} data-practice-boundary/><line x1={cx} y1={cy} x2={polar(cx,cy,r,0)[0]} y2={polar(cx,cy,r,0)[1]} stroke={BLUE} strokeWidth="3"/><line x1={cx} y1={cy} x2={polar(cx,cy,r,t)[0]} y2={polar(cx,cy,r,t)[1]} stroke={BLUE} strokeWidth="3"/><circle cx={cx} cy={cy} r="5" fill="#172b4a"/>{label(cx,290,`회전각 ${t}° · 원호만 거리로 셉니다`)}</>;
  }else if(id==='rope'){
    const r=32,tri=variant==='rope-triangle',cols=p.c??2,rows=p.rows??2;
    const triPts=[{x:cx,y:cy-2*r/Math.sqrt(3)},{x:cx+r,y:cy+r/Math.sqrt(3)},{x:cx-r,y:cy+r/Math.sqrt(3)}],cs=tri?triPts.map(q=>[q.x,q.y]):Array.from({length:cols*rows},(_,i)=>[cx+(i%cols-(cols-1)/2)*2*r,cy+(Math.floor(i/cols)-(rows-1)/2)*2*r]);
    drawing=<>{tri?<path d={roundedHull(triPts,r)} fill="none" stroke={hot?ORANGE:'#b8c7d8'} strokeWidth={hot?7:4} data-practice-boundary/>:<rect x={cx-(cols-1)*r-r} y={cy-(rows-1)*r-r} width={(cols-1)*2*r+2*r} height={(rows-1)*2*r+2*r} rx={r} fill="none" stroke={hot?ORANGE:'#b8c7d8'} strokeWidth={hot?7:4} data-practice-boundary/>}{cs.map(([x,y],i)=><circle key={i} cx={x} cy={y} r={r} fill={area?GREEN:'#eaf3ff'} stroke="#7d91a8" strokeWidth="2"/>)}{label(cx,285,tri?'원 3개 삼각형 배열':rows===1?'한 줄로 맞닿은 원':'원 중심 격자의 바깥 접선')}</>;
  }else if(id==='rolling'){
    const n=p.n??4,rr=32,rad=90,pp=Array.from({length:n},(_,i)=>polar(cx,cy,rad,i*360/n+180));
    drawing=<><polygon points={pp.map(a=>a.join(',')).join(' ')} fill="#f5f7fa" stroke="#64748b" strokeWidth="3"/><circle cx={cx} cy={cy-rad-rr} r={rr} fill="#eaf3ff" stroke="#64748b" strokeWidth="2"/><circle cx={cx} cy={cy-rad-rr} r={rr*2} fill="none" stroke={area?GREEN:'#dce7f1'} strokeWidth="3" strokeDasharray="6 5"/><path d={`M${cx-rad-rr} ${cy-rad} ${pp.map(a=>`L${a[0]} ${a[1]}`).join(' ')} Z`} fill="none" stroke={hot?BLUE:INK} strokeWidth={hot?7:3} data-practice-boundary/>{area&&<path d={`M${cx-145} ${cy-145} H${cx+145} V${cy+145} H${cx-145} Z`} fill="#bcebd766" data-practice-piece/>}</>;
  }else if(id==='overlap'){
    if(variant==='overlap-nested'||variant==='overlap-baby-circle'){
      const R=108,r=variant==='overlap-baby-circle'?R/2:56;
      drawing=<><circle cx={cx} cy={cy} r={R} fill={area?GREEN:'#eaf3ff'} stroke={hot?BLUE:INK} strokeWidth={hot?6:3} data-practice-boundary/><circle cx={cx} cy={cy} r={r} fill="#fff" stroke={hot?ORANGE:INK} strokeWidth={hot?6:3} data-practice-boundary/>{label(cx,cy,variant==='overlap-baby-circle'?'작은 원의 지름 = 큰 원의 반지름':'흰 고리 구멍')}</>;
    }else if(variant==='overlap-leaf'){
      const A=[118,240],B=[270,240],C=[270,98],radA=76,radB=71,radC=Math.hypot(B[0]-A[0],B[1]-C[1])/2;
      drawing=<><path d={`M${A[0]} ${A[1]} A${radC} ${radC} 0 0 1 ${C[0]} ${C[1]} Z`} fill="#e9dcf7" fillOpacity=".68" stroke="#8b5eb6" strokeWidth="2.5"/><path d={`M${A[0]} ${A[1]} A${radA} ${radA} 0 0 0 ${B[0]} ${B[1]} Z`} fill="#dbeafe" fillOpacity=".78" stroke="#2563eb" strokeWidth="2.5"/><path d={`M${B[0]} ${B[1]} A${radB} ${radB} 0 0 0 ${C[0]} ${C[1]} Z`} fill="#ffe2c9" fillOpacity=".78" stroke="#df7945" strokeWidth="2.5"/><polygon points={`${A.join(',')} ${B.join(',')} ${C.join(',')}`} fill={area?GREEN:'#bcebd7'} stroke="#16845f" strokeWidth="3"/><path d={`M${B[0]-16} ${B[1]} V${B[1]-16} H${B[0]}`} fill="none" stroke="#334155" strokeWidth="2"/>{label(190,284,`초승달 합 = ½ab = ${clean((p.a??6)*(p.b??8)/2)} cm²`)}</>;
    }else{
      const d=Math.min(p.d??8,12)*9,rad=86,x2=cx+d;
      drawing=<><defs><clipPath id={clipId}><circle cx={x2} cy={cy} r={rad}/></clipPath></defs><circle cx={cx} cy={cy} r={rad} fill="#dbeafe" stroke={hot?BLUE:INK} strokeWidth={hot?6:3} data-practice-boundary/><circle cx={x2} cy={cy} r={rad} fill="#ffeddc" stroke={hot?ORANGE:INK} strokeWidth={hot?6:3} data-practice-boundary/><circle cx={cx} cy={cy} r={rad} fill={area?GREEN:'#bcebd7'} clipPath={`url(#${clipId})`}/><line x1={cx} y1={cy} x2={x2} y2={cy} stroke="#475569" strokeDasharray="4 4"/>{label(cx+d/2,cy+rad+24,`중심 거리 ${clean(d)} cm`)}</>;
    }
  }else if(id==='polygon'){
    const n=p.n??6,rad=104,t=360/n;
    drawing=<><polygon points={points(n,cx,cy,rad)} fill="#f8fafc" stroke="#94a3b8" strokeWidth="3"/><path d={sector(cx,cy,rad,0,t)} fill={area?GREEN:'#dbeafe'} stroke={hot?ORANGE:INK} strokeWidth={hot?5:2} data-practice-boundary/><circle cx={cx} cy={cy} r="5" fill="#172b4a"/>{Array.from({length:n},(_,i)=>{const q=polar(cx,cy,rad,i*360/n);return <line key={i} x1={cx} y1={cy} x2={q[0]} y2={q[1]} stroke="#94a3b8" strokeWidth="1.5"/>})}{label(cx,cy+rad+28,`${n}등분 · 중심각 ${clean(t)}°`)}</>;
  }else if(id==='tether'){
    const length=p.R??7,scale=84/length,R=84,w=Math.min(p.w??5,length)*scale,h=Math.min(p.h??4,length)*scale,wall=variant==='tether-wall',ox=cx-72,oy=cy-42;
    drawing=wall?<><path d={`M${cx-R} ${cy} A${R} ${R} 0 0 1 ${cx+R} ${cy} L${cx-R} ${cy} Z`} fill={area?GREEN:'#eaf3ff'} stroke={hot?ORANGE:INK} strokeWidth={hot?7:3} data-practice-boundary/><line x1={cx-R-20} y1={cy} x2={cx+R+20} y2={cy} stroke="#64748b" strokeWidth="9"/>{label(cx,cy+R+28,'울타리가 막는 반대쪽은 제외')}</>:<><path d={`M${ox} ${oy} H${ox+w} V${oy+h} H${ox} Z`} fill="#e5e7eb" stroke="#64748b" strokeWidth="3"/><path d={sector(ox,oy,R,90,360)} fill={area?GREEN:'#eaf3ff'} stroke={hot?ORANGE:INK} strokeWidth={hot?7:3} data-practice-boundary/>{area&&<><path d={sector(ox+w,oy,R*(length-Math.min(p.w??5,length))/length,270,360)} fill="#8ed8b7" fillOpacity=".72"/><path d={sector(ox,oy+h,R*(length-Math.min(p.h??4,length))/length,270,360)} fill="#f6d29b" fillOpacity=".72"/></>}{label(cx,285,'집 모서리를 지난 뒤 남은 줄로 새 부채꼴이 생깁니다.')}</>;
  }else if(id==='equalarea'){
    if(variant==='equalarea-common-part'){
      const radius=84,x=132,y=164,rectW=Math.PI*radius/4;
      drawing=<><path d={sector(x,y,radius,0,90)} fill={area?GREEN:'#dbeafe'} stroke="#16845f" strokeWidth="3" data-practice-boundary/><line x1={x} y1={y} x2={x+radius} y2={y} stroke="#64748b" strokeWidth="2"/><line x1={x} y1={y} x2={x} y2={y-radius} stroke="#64748b" strokeWidth="2"/><rect x="252" y={y-radius} width={rectW} height={radius} fill={area?GREEN:'#dbeafe'} stroke="#2563eb" strokeWidth="3"/><text x={x+radius/2} y={y+25} textAnchor="middle" className="diagram-value">¼πr²</text><text x={252+rectW/2} y={y-radius/2+5} textAnchor="middle" className="diagram-value">r × x</text>{label(cx,270,'같은 넓이: 사분원 = 직사각형')}</>;
    }else{
      const a=p.a??6,b=p.b??8,scale=110/Math.max(a,b),A=a*scale,B=b*scale,x=100,y=250,px=x+A,py=y-B,c=Math.hypot(A,B),midX=(x+px)/2,midY=(y+py)/2;
      drawing=<><path d={`M${x} ${y} L${px} ${y} L${px} ${py} Z`} fill={area?GREEN:'#e8f5ef'} stroke="#16845f" strokeWidth="3"/><path d={`M${x} ${y} A${A/2} ${A/2} 0 0 1 ${px} ${y} Z`} fill="#dbeafe" fillOpacity=".62" stroke="#2563eb" strokeWidth="2.5"/><path d={`M${px} ${y} A${B/2} ${B/2} 0 0 1 ${px} ${py} Z`} fill="#ffe2c9" fillOpacity=".62" stroke="#df7945" strokeWidth="2.5"/><path d={`M${x} ${y} A${c/2} ${c/2} 0 0 0 ${px} ${py} Z`} fill="#e7dcf7" fillOpacity=".46" stroke="#8b5eb6" strokeWidth="2.5"/><path d={`M${px-18} ${y} V${y-18} H${px}`} fill="none" stroke="#334155" strokeWidth="2"/>{label(x+A/2,y+22,`a=${a}`)}{label(px+21,y-B/2,`b=${b}`)}{label(midX-2,midY-12,`c=${clean(Math.hypot(a,b))}`)}</>;
    }
  }else{
    const da=(p.a??18)*5,db=(variant==='pizza-equal'?(p.a??18):(p.b??16))*5,ra=da/2,rb=db/2,na=p.na??6,nb=p.nb??8;
    drawing=<><circle cx="135" cy={cy} r={ra} fill="#fff2c4" stroke="#be8a22" strokeWidth="3"/><circle cx="285" cy={cy} r={rb} fill="#ffe1ca" stroke="#df7945" strokeWidth="3"/>{Array.from({length:Math.min(na,12)},(_,i)=>{const q=polar(135,cy,ra,i*360/na);return <line key={`a${i}`} x1="135" y1={cy} x2={q[0]} y2={q[1]} stroke="#be8a22" strokeWidth="2"/>})}{Array.from({length:Math.min(nb,12)},(_,i)=>{const q=polar(285,cy,rb,i*360/nb);return <line key={`b${i}`} x1="285" y1={cy} x2={q[0]} y2={q[1]} stroke="#df7945" strokeWidth="2"/>})}{label(135,cy+ra+24,`A · ${na}조각`)}{label(285,cy+rb+24,`B · ${nb}조각`)}</>;
  }
  const pieces=mode==='area'?areaPieces(id,variant,p):[];
  return <svg className="geometry-svg practice-svg" viewBox="0 0 420 340" role="img" aria-label={`${id} 도형, ${mode==='line'?'둘레 경계 강조':mode==='area'?'넓이 구조':'원본 도형'}`}>
    <rect x="12" y="12" width="396" height="316" rx="18" fill="#fff"/>{drawing}
    {pieces.length>0&&<><rect x="32" y="292" width="356" height="34" rx="10" fill="#f5faf7" stroke="#dceee4"/><text x="210" y="289" textAnchor="middle" fontSize="9" fill="#668071">원본 색칠은 그대로 · 계산용 복제 조각</text>{pieces.map((piece,i)=>{const x=210+(i-(pieces.length-1)/2)*83,y=309,dx=210-x,dy=160-y,offset=1-progress;return <g key={`${piece.label}-${i}`} data-practice-geometry-piece data-start-x={dx} data-start-y={dy} transform={`translate(${x+dx*offset} ${y+dy*offset})`}><g transform={`scale(${piece.scale??1})`} opacity=".92">{pieceShape(piece.kind)}<text x="0" y="25" textAnchor="middle" fontSize="7.5" fontWeight="800" fill={piece.sign==='−'?'#d45c31':'#16845f'}>{piece.sign} {piece.label}</text></g></g>})}</>}
    {id!=='pizza'&&id!=='rolling'&&id!=='tether'&&<circle cx="210" cy="160" r="3.5" fill="#172b4a"/>}
  </svg>;
}
