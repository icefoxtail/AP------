import type { Mode, Params, ShapeId } from './geometry';

const BLUE = '#2563eb', ORANGE = '#e56b36', AMBER = '#dd962d', GREEN = '#178b67';

export default function SemisCanvas({shape,mode,p,progress=0}:{shape:ShapeId;mode:Mode;p:Params;progress?:number}) {
  const line=mode==='line';
  const note = shape==='holes'||shape==='holes3'
    ? `큰 원과 작은 원 ${shape==='holes3'?3:2}개의 경계선`
    : shape==='swirl'?'태극형: 큰 반원과 위·아래 작은 반원':'큰 반원과 이어진 작은 반원';
  if(shape==='holes'||shape==='holes3'){
    const cx=320,cy=245,R=108+(p.holeD-8)*7,n=shape==='holes3'?3:2,r=R/n;
    const centers=Array.from({length:n},(_,i)=>cx-R+r+2*r*i);
    return <svg className="geometry-svg" viewBox="0 0 640 500" role="img" aria-label={note}>
      {mode==='area'&&<rect x="42" y="442" width="556" height="48" rx="13" fill="#f7fbf8" stroke="#dceee4"/>}
      <circle cx={cx} cy={cy} r={R} fill="#bee9d6" stroke="#64748b" strokeWidth="2"/>
      {centers.map((x,i)=><circle key={i} cx={x} cy={cy} r={r} fill="#fff" stroke="#64748b" strokeWidth="2"/>)}
      <line x1={cx-R} y1={cy} x2={cx+R} y2={cy} className="guide-line"/>
      {line&&<>
        <circle cx={cx} cy={cy} r={R} stroke={BLUE} strokeWidth="7" fill="none" data-trace="outer"/>
        {centers.map((x,i)=><circle key={i} cx={x} cy={cy} r={r} stroke={[ORANGE,AMBER,GREEN][i]} strokeWidth="6" fill="none" data-trace="inner"/>)}
      </>}
      {mode==='area'&&centers.map((sx,i)=>{const tx=120+(i+.5)*(400/n),color=[ORANGE,AMBER,GREEN][i];return <g key={i} data-area-motion data-dx={tx-sx} data-dy={390-cy}><circle cx={sx} cy={cy} r={r} fill={color} fillOpacity=".32" stroke={color} strokeWidth="3" strokeDasharray="5 4"/><text x={sx} y={cy+5} textAnchor="middle" fontSize="13" fontWeight="800" fill={color}>−</text></g>})}
      <text x={cx} y="34" className="diagram-title">큰 원 지름 D = {p.holeD}cm</text>
      {centers.map((x,i)=><text key={i} x={x} y={cy+5} className="diagram-value">작은 원 {i+1}</text>)}
      <text x={cx} y="466" className="diagram-note">작은 원 지름은 각각 D/{n}</text>
    </svg>;
  }

  const parts=shape==='chain'?[p.a,p.b,p.c]:shape==='swirl'?[p.a,p.a]:[p.a,p.b];
  const D=parts.reduce((sum,n)=>sum+n,0),x0=60,xEnd=580;
  const y=shape==='swirl'?260:shape==='chain'?355:335;
  const scale=(xEnd-x0)/D, points=[x0];
  for(const diameter of parts)points.push(points[points.length-1]+diameter*scale);
  const R=(xEnd-x0)/2;
  const small=parts.map((_,i)=>{
    const r=(points[i+1]-points[i])/2;
    const d=`M ${points[i]} ${y} A ${r} ${r} 0 0 ${shape==='swirl'&&i===1?0:1} ${points[i+1]} ${y}`;
    return {r,d};
  });
  const big=`M ${x0} ${y} A ${R} ${R} 0 0 1 ${xEnd} ${y}`;
  // Outline is one mathematically consistent shape. For the swirl, the second small arc is below the diameter.
  const closed=`${big} `+parts.map((_,reverseIndex)=>{
    const i=parts.length-1-reverseIndex;
    return `A ${small[i].r} ${small[i].r} 0 0 ${shape==='swirl'&&i===1?1:0} ${points[i]} ${y}`;
  }).join(' ')+` Z`;
  const colors=[ORANGE,AMBER,GREEN];

  return <svg className="geometry-svg" viewBox="0 0 640 500" role="img" aria-label={note}>
    <path d={closed} fill="#bcebd7" stroke="#64748b" strokeWidth="2.2"/>
    <line x1={x0} y1={y} x2={xEnd} y2={y} className="guide-line"/>
    <path d={big} stroke={line?BLUE:'#475569'} strokeWidth={line?5:3} fill="none"/>
    {small.map((piece,i)=><path key={i} d={piece.d} stroke={line?colors[i]:'#475569'} strokeWidth={line?4.5:3} fill="none"/>)}
    {line&&<>
      <path d={big} stroke={BLUE} strokeWidth="8" fill="none" strokeLinecap="round" data-trace="outer"/>
      {small.map((piece,i)=><path key={i} d={piece.d} stroke={colors[i]} strokeWidth="7" fill="none" strokeLinecap="round" data-trace="inner"/>)}
    </>}
    {mode==='area'&&<><rect x="42" y="404" width="556" height="76" rx="14" fill="#f7fbf8" stroke="#dceee4"/><text x="320" y="424" className="diagram-note">{shape==='swirl'?'녹색 반원을 180° 돌려 흰 반원 자리에 옮깁니다.':'조각의 크기를 유지해 옮깁니다 · 원본은 그대로'}</text>{small.map((piece,i)=>{if(shape==='swirl'&&i===0)return null;const center=(points[i]+points[i+1])/2,diameter=parts[i],prior=parts.slice(0,i).reduce((s,d)=>s+d,0),target=shape==='swirl'?(points[0]+points[1])/2:x0+(prior+diameter/2)*scale,sign=shape==='swirl'?'+':'−',color=sign==='+'?GREEN:colors[i],moveDy=shape==='swirl'?0:450-y,rotation=shape==='swirl'?180:0;return <g key={`piece-${i}`} data-area-motion data-dx={target-center} data-dy={moveDy}><g transform={rotation?`rotate(${rotation*progress} ${center} ${y})`:undefined}><path d={piece.d} fill={color} fillOpacity=".58" stroke={color} strokeWidth="2.2"/></g><text x={center} y={y+8} textAnchor="middle" fontSize="13" fontWeight="900" fill={sign==='+'?GREEN:'#d45c31'}>{sign}</text><text x={center} y={y-8} textAnchor="middle" fontSize="10" fontWeight="700" fill="#52657d">{diameter} cm</text></g>})}</>}
    {points.map((x,i)=><circle key={i} cx={x} cy={y} r="4.8" fill="#0f172a"/>)}
    {parts.map((diameter,i)=><text key={i} x={(points[i]+points[i+1])/2} y={y+33} className="diagram-value">
      {String.fromCharCode(97+i)} = {diameter}
    </text>)}
    <text x="320" y="36" className="diagram-title">큰 반원 지름 D = {D}cm</text>
    {shape==='swirl'&&<text x={(points[1]+points[2])/2} y={y+small[1].r+24} className="diagram-note">아래쪽으로 붙인 반원</text>}
    {mode!=='area'&&<text x="320" y="471" className="diagram-note">점선은 계산을 위한 지름선이며, 둘레에 포함되지 않습니다.</text>}
  </svg>;
}
