import { useRef, useState } from 'react';
import { areParallel, intersectLinear, rotate2, sub2, type Point2 } from '../geometry-core/math';
import { AngleArc, ParallelMark, PointGlyph, SegmentGlyph } from '../geometry-renderer/primitives';
import MathFormula from '../geometry-renderer/MathFormula';
import { useDraggablePoints, type PointMap } from '../geometry-interaction/useDraggablePoints';

const initial:PointMap={A:{x:110,y:265},B:{x:530,y:265},C:{x:110,y:105},E:{x:255,y:340},F:{x:385,y:35}};
function acute(a:Point2,b:Point2,c:Point2,d:Point2){const u=sub2(b,a),v=sub2(d,c),lu=Math.hypot(u.x,u.y),lv=Math.hypot(v.x,v.y);return lu*lv<1e-12?0:Math.acos(Math.max(-1,Math.min(1,Math.abs((u.x*v.x+u.y*v.y)/(lu*lv)))))*180/Math.PI}
export default function ParallelLesson(){
  const [points,setPoints]=useState<PointMap>(initial),[deviation,setDeviation]=useState(0),svgRef=useRef<SVGSVGElement>(null);
  const drag=useDraggablePoints({svgRef,points,setPoints,snapTo:Object.values(points)}),a=points.A,b=points.B,c=points.C,base=sub2(b,a),rotation=rotate2(base,deviation*Math.PI/180),d={x:c.x+rotation.x,y:c.y+rotation.y},e=points.E,f=points.F;
  const crossA=intersectLinear(a,b,e,f),crossC=intersectLinear(c,d,e,f),parallel=areParallel(base,sub2(d,c));
  const angleA=acute(a,b,e,f),angleC=acute(c,d,e,f);
  const dPoint={x:c.x+rotation.x,y:c.y+rotation.y};
  const i1=crossA.kind==='point'?crossA.point:null,i2=crossC.kind==='point'?crossC.point:null;
  return <div className="geometry-lesson">
    <div className="geometry-lesson-controls"><label htmlFor="parallel-deviation">위 선 기울기 <output>{deviation}°</output></label><input id="parallel-deviation" type="range" min="-45" max="45" step="1" value={deviation} onChange={x=>setDeviation(Number(x.target.value))}/><span>0°에서는 평행이 유지되고, 기울이면 각의 관계가 어떻게 바뀌는지 비교합니다.</span></div>
    <p className="geometry-instruction">A, B와 C를 끌어 평행선의 위치를 옮기고, E, F를 움직여 횡단선의 각을 관찰하세요.</p>
    <svg ref={svgRef} viewBox="0 0 640 380" role="img" aria-label="평행선과 횡단선의 각 관계 실험" onPointerMove={drag.pointerMove} onPointerUp={drag.pointerUp} onPointerCancel={drag.pointerUp}>
      <rect x="18" y="18" width="604" height="344" rx="20" fill="#fbfdff" stroke="#dce5ef"/>
      <SegmentGlyph a={a} b={b} color="#2563eb" width={4} arrows/><SegmentGlyph a={c} b={dPoint} color="#16845f" width={4} arrows/><SegmentGlyph a={e} b={f} color="#e56b36" width={4}/>
      {parallel&&<ParallelMark a={a} b={b} c={c} d={dPoint}/>}
      {i1&&<><circle cx={i1.x} cy={i1.y} r="4" fill="#0f172a"/><AngleArc a={b} vertex={i1} b={f} radius={24} color="#d97706" label="auto"/></>}
      {i2&&<><circle cx={i2.x} cy={i2.y} r="4" fill="#0f172a"/><AngleArc a={dPoint} vertex={i2} b={e} radius={31} color="#7c3aed" label="auto"/></>}
      <PointGlyph point={a} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={b} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/><PointGlyph point={c} label="C" onPointerDown={drag.pointerDown('C')} onKeyDown={drag.keyDown('C')}/>
      <PointGlyph point={e} label="E" onPointerDown={drag.pointerDown('E')} onKeyDown={drag.keyDown('E')}/><PointGlyph point={f} label="F" onPointerDown={drag.pointerDown('F')} onKeyDown={drag.keyDown('F')}/><PointGlyph point={dPoint} label="D"/>
      <text x="320" y="345" textAnchor="middle" className="geometry-svg-caption">표시한 평행 화살표는 방향벡터의 외적이 0일 때만 나타납니다.</text>
    </svg>
    <div className="geometry-live-result"><strong>{parallel?'AB ∥ CD':'AB와 CD는 평행하지 않습니다'}</strong><MathFormula tex={parallel?`AB\\parallel CD\\Longrightarrow \\theta_1=\\theta_2=${angleA.toFixed(1)}^\\circ`:`AB\\not\\parallel CD,\\quad \\theta_1=${angleA.toFixed(1)}^\\circ,\\quad \\theta_2=${angleC.toFixed(1)}^\\circ`}/><span>{parallel?`계산된 두 작은 교차각: ${angleA.toFixed(1)}°와 ${angleC.toFixed(1)}°`:`반례 · 실측 작은 교차각 ${angleA.toFixed(1)}°와 ${angleC.toFixed(1)}° · 평행선 각 정리는 적용하지 않음`}</span><button type="button" onClick={drag.undo}>실행 취소</button></div>
  </div>;
}
