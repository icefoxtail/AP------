import { useRef, useState } from 'react';
import { areParallel, distance2, dot2, intersectLinear, sub2, type Point2 } from '../geometry-core/math';
import { PointGlyph, SegmentGlyph } from '../geometry-renderer/primitives';
import MathFormula from '../geometry-renderer/MathFormula';
import { useDraggablePoints, type PointMap } from '../geometry-interaction/useDraggablePoints';

const initial:PointMap={A:{x:120,y:170},B:{x:300,y:170},C:{x:390,y:170},D:{x:510,y:170}};
type Mode='lineBasic'|'rayCompare'|'sameRay'|'intersect';
const modes:{id:Mode;name:string}[]=[{id:'lineBasic',name:'직선·반직선·선분'},{id:'rayCompare',name:'AB와 BA'},{id:'sameRay',name:'같은 반직선'},{id:'intersect',name:'두 반직선의 공통부분'}];
function extended(a:Point2,b:Point2,t0:number,t1:number){const dx=b.x-a.x,dy=b.y-a.y;return [{x:a.x+dx*t0,y:a.y+dy*t0},{x:a.x+dx*t1,y:a.y+dy*t1}] as const}

export default function PointLinesLesson(){
  const [points,setPoints]=useState<PointMap>(initial),[mode,setMode]=useState<Mode>('rayCompare'),svgRef=useRef<SVGSVGElement>(null);
  const visiblePoints=mode==='lineBasic'||mode==='rayCompare'?[points.A,points.B]:mode==='sameRay'?[points.B,points.C,points.D]:Object.values(points);
  const drag=useDraggablePoints({svgRef,points,setPoints,snapTo:visiblePoints,locked:mode==='sameRay'?['A','B']:[],constrainPoint:mode==='sameRay'?(id,next,current)=>(id==='C'||id==='D'?{x:Math.max(current.B.x+12,next.x),y:current.B.y}:next):undefined});
  const [a,b,c,d]=[points.A,points.B,points.C,points.D];
  const dirAB=extended(a,b,-3,3),rayAB=extended(a,b,0,4),rayBA=extended(b,a,0,4);
  const intersection=intersectLinear(b,d,c,a,'ray','ray');
  const sameLine=areParallel(sub2(c,b),sub2(a,b)),raysOverlap=sameLine&&dot2(sub2(c,b),sub2(d,b))>0&&dot2(sub2(d,b),sub2(a,c))<0;
  const description=mode==='lineBasic'?'직선은 양쪽으로 계속되고, 반직선은 출발점과 방향을 가지며, 선분은 두 끝점 사이만 포함합니다.':mode==='rayCompare'?'반직선 AB와 BA는 출발점과 방향이 달라 공통부분이 선분 AB입니다.':mode==='sameRay'?'출발점 B에서 같은 방향으로 나간 반직선의 공통부분은 더 짧은 반직선입니다.':'반직선 BD와 CA의 공통부분이 선분인지 점인지 직접 확인하세요.';
  return <div className="geometry-lesson">
    <div className="geometry-lesson-toolbar" role="group" aria-label="선의 표현 선택">{modes.map(item=><button type="button" key={item.id} className={mode===item.id?'selected':''} aria-pressed={mode===item.id} onClick={()=>setMode(item.id)}>{item.name}</button>)}</div>
    <p className="geometry-instruction">{description} {mode==='sameRay'?'C, D를 움직여 공통 반직선의 길이를 비교하세요.':mode==='lineBasic'?'A, B를 직접 끌어 보세요.':'점 A–D를 직접 끌어 보세요.'}</p>
    <svg ref={svgRef} viewBox="0 0 640 360" role="img" aria-label="점과 직선, 반직선, 선분을 직접 조작하는 도형 칠판" onPointerMove={drag.pointerMove} onPointerUp={drag.pointerUp} onPointerCancel={drag.pointerUp}>
      <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/>
      {mode==='lineBasic'?<>
        {(['A','B','C'] as const).map((name,i)=>{const y=95+i*82,pa={x:a.x,y},pb={x:b.x,y},line=extended(pa,pb,-2,3),ray=extended(pa,pb,0,3);return <g key={name}><text x="42" y={y-15} className="geometry-svg-label">{['직선 AB','반직선 AB','선분 AB'][i]}</text><SegmentGlyph a={line[0]} b={line[1]} color="#94a3b8" width={i===0?2:0.5} arrows/>{i===1&&<SegmentGlyph a={ray[0]} b={ray[1]} color="#2563eb" width={4} arrows/>}{i===2&&<SegmentGlyph a={pa} b={pb} color="#16845f" width={5}/>}<circle cx={pa.x} cy={y} r="5" fill="#2563eb"/><circle cx={pb.x} cy={y} r="5" fill="#2563eb"/>{i===0&&<><PointGlyph point={pa} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={pb} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/></>}</g>})}
      </>:<>
        <SegmentGlyph a={dirAB[0]} b={dirAB[1]} color="#cbd5e1" width={1.5}/>
        {mode==='rayCompare'?<><SegmentGlyph a={rayAB[0]} b={rayAB[1]} color="#2563eb" width={5} arrows/><SegmentGlyph a={rayBA[0]} b={rayBA[1]} color="#e56b36" width={4} arrows/><SegmentGlyph a={a} b={b} color="#16845f" width={8} opacity={.8}/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2-18} className="geometry-svg-label">공통부분: 선분 AB ({distance2(a,b).toFixed(1)})</text></>:mode==='sameRay'?<><SegmentGlyph a={b} b={c} color="#2563eb" width={5} arrows/><SegmentGlyph a={b} b={d} color="#e56b36" width={3.5} arrows/><SegmentGlyph a={b} b={c.x<d.x?c:d} color="#16845f" width={8} opacity={.72}/><text x={(b.x+Math.min(c.x,d.x))/2} y={b.y-18} className="geometry-svg-label">공통 반직선</text></>:<><SegmentGlyph a={b} b={extended(b,d,0,4)[1]} color="#2563eb" width={4} arrows/><SegmentGlyph a={c} b={extended(c,a,0,4)[1]} color="#e56b36" width={4} arrows/>{raysOverlap&&<SegmentGlyph a={b} b={c} color="#16845f" width={8} opacity={.72}/>} {intersection.kind==='point'&&<><circle cx={intersection.point.x} cy={intersection.point.y} r="10" fill="#16845f" opacity=".22"/><circle cx={intersection.point.x} cy={intersection.point.y} r="5" fill="#16845f"/><text x={intersection.point.x+12} y={intersection.point.y-12} className="geometry-svg-label">교점</text></>}</>}
        {mode==='sameRay'?<PointGlyph point={b} label="B"/>:<><PointGlyph point={a} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={b} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/></>}
        {mode!=='rayCompare'&&<><PointGlyph point={c} label="C" onPointerDown={drag.pointerDown('C')} onKeyDown={drag.keyDown('C')}/><PointGlyph point={d} label="D" onPointerDown={drag.pointerDown('D')} onKeyDown={drag.keyDown('D')}/></>}
      </>}
      <text x="320" y="326" textAnchor="middle" className="geometry-svg-caption">점은 같은데 시작점·방향·범위를 바꾸면 선의 뜻이 달라집니다.</text>
    </svg>
    <div className="geometry-live-result" aria-live="polite"><strong>{mode==='lineBasic'?'직선·반직선·선분은 같은 두 점에서도 포함하는 점의 범위가 다릅니다':mode==='rayCompare'?'공통부분은 선분 AB':mode==='sameRay'?'두 반직선은 같은 방향':raysOverlap?'반직선의 공통부분은 선분 BC':intersection.kind==='point'?'두 반직선은 한 점에서 만납니다':intersection.kind==='coincident'?'두 직선이 같은 직선 위에 있습니다':'두 선은 현재 만나지 않습니다'}</strong><MathFormula tex={mode==='lineBasic'?`\\overleftrightarrow{AB},\\;\\overrightarrow{AB},\\;\\overline{AB}`:mode==='rayCompare'?`\\overrightarrow{AB}\\cap\\overrightarrow{BA}=\\overline{AB}`:mode==='sameRay'?`\\overrightarrow{BC}\\cap\\overrightarrow{BD}=\\overrightarrow{B${c.x<=d.x?'C':'D'}}`:raysOverlap?`\\overrightarrow{BD}\\cap\\overrightarrow{CA}=\\overline{BC}`:intersection.kind==='point'?`\\overrightarrow{BD}\\cap\\overrightarrow{CA}=\\{P\\}`:`\\overrightarrow{BD}\\cap\\overrightarrow{CA}=\\varnothing`}/><span>AB = {distance2(a,b).toFixed(2)} · BC = {distance2(b,c).toFixed(2)}</span><button type="button" onClick={drag.undo}>실행 취소</button></div>
  </div>;
}
