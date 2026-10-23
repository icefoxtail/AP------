import type { Mode, Params, ShapeId } from './geometry';

const BLUE = '#2563eb', ORANGE = '#e56b36', AMBER = '#dd962d', GREEN = '#178b67';

export default function SemisCanvas({shape,mode,p}:{shape:ShapeId;mode:Mode;p:Params}) {
  const line=mode==='line';
  const note = shape==='holes'
    ? '큰 원과 두 구멍의 경계선'
    : shape==='swirl'?'태극형: 큰 반원과 위·아래 작은 반원':'큰 반원과 이어진 작은 반원';
  if(shape==='holes'){
    const cx=320,cy=245,R=108+(p.holeD-8)*7,r=R/2;
    return <svg className="geometry-svg" viewBox="0 0 640 500" role="img" aria-label={note}>
      <circle cx={cx} cy={cy} r={R} fill="#bee9d6" stroke="#64748b" strokeWidth="2"/>
      <circle cx={cx-r} cy={cy} r={r} fill="#fff" stroke="#64748b" strokeWidth="2"/>
      <circle cx={cx+r} cy={cy} r={r} fill="#fff" stroke="#64748b" strokeWidth="2"/>
      <line x1={cx-R} y1={cy} x2={cx+R} y2={cy} className="guide-line"/>
      {line&&<>
        <circle cx={cx} cy={cy} r={R} stroke={BLUE} strokeWidth="7" fill="none" data-trace="outer"/>
        <circle cx={cx-r} cy={cy} r={r} stroke={ORANGE} strokeWidth="6" fill="none" data-trace="inner"/>
        <circle cx={cx+r} cy={cy} r={r} stroke={AMBER} strokeWidth="6" fill="none" data-trace="inner"/>
      </>}
      <text x={cx} y="34" className="diagram-title">큰 원 지름 D = {p.holeD}cm</text>
      <text x={cx-r} y={cy+5} className="diagram-value">흰 구멍</text>
      <text x={cx+r} y={cy+5} className="diagram-value">흰 구멍</text>
      <text x={cx} y="466" className="diagram-note">작은 원 지름은 각각 D/2</text>
    </svg>;
  }

  const parts=shape==='chain'?[p.a,p.b,p.c]:[p.a,p.b];
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
    {points.map((x,i)=><circle key={i} cx={x} cy={y} r="4.8" fill="#0f172a"/>)}
    {parts.map((diameter,i)=><text key={i} x={(points[i]+points[i+1])/2} y={y+33} className="diagram-value">
      {String.fromCharCode(97+i)} = {diameter}
    </text>)}
    <text x="320" y="36" className="diagram-title">큰 반원 지름 D = {D}cm</text>
    {shape==='swirl'&&<text x={(points[1]+points[2])/2} y={y+small[1].r+24} className="diagram-note">아래쪽으로 붙인 반원</text>}
    <text x="320" y="471" className="diagram-note">점선은 계산을 위한 지름선이며, 둘레에 포함되지 않습니다.</text>
  </svg>;
}
