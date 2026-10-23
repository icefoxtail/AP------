import { useRef, useState } from 'react';
import { angleDegrees, add2, sub2, type Point2 } from '../geometry-core/math';
import { AngleArc, PointGlyph, SegmentGlyph } from '../geometry-renderer/primitives';
import MathFormula from '../geometry-renderer/MathFormula';
import { useDraggablePoints, type PointMap } from '../geometry-interaction/useDraggablePoints';

const init:PointMap={O:{x:320,y:180},A:{x:500,y:180},B:{x:320,y:60}};
type Mode='vertical'|'lineCount'|'clock';
function ray(center:Point2,r:number,degrees:number):Point2{const a=degrees*Math.PI/180;return add2(center,{x:r*Math.cos(a),y:r*Math.sin(a)})}
export default function AnglesLesson(){
  const [points,setPoints]=useState<PointMap>(init),[mode,setMode]=useState<Mode>('vertical'),[count,setCount]=useState(4),[layout,setLayout]=useState<'collinear'|'circle'|'verticalPairs'>('collinear'),[hour,setHour]=useState(3),[minute,setMinute]=useState(0),svgRef=useRef<SVGSVGElement>(null),drag=useDraggablePoints({svgRef,points,setPoints});
  const o=points.O,a=points.A,b=points.B,c=add2(o,sub2(o,a)),d=add2(o,sub2(o,b));
  const small=angleDegrees(a,o,b),adjacent=180-(small??0),pairCount=count*(count-1)/2,clockDelta=Math.abs((hour%12)*30+minute*.5-minute*6),clockAngle=Math.min(clockDelta,360-clockDelta);
  return <div className="geometry-lesson">
    <div className="geometry-lesson-toolbar" role="group" aria-label="각과 직선 수 탐구"><button type="button" className={mode==='vertical'?'selected':''} aria-pressed={mode==='vertical'} onClick={()=>setMode('vertical')}>맞꼭지각</button><button type="button" className={mode==='lineCount'?'selected':''} aria-pressed={mode==='lineCount'} onClick={()=>setMode('lineCount')}>직선의 개수</button><button type="button" className={mode==='clock'?'selected':''} aria-pressed={mode==='clock'} onClick={()=>setMode('clock')}>시계의 각</button></div>
    {mode==='vertical'&&<>
      <p className="geometry-instruction">점 A 또는 B를 끌어 두 직선의 교각을 바꾸세요. 맞꼭지각은 교점과 직선 조건에서 계산합니다.</p>
      <svg ref={svgRef} viewBox="0 0 640 360" role="img" aria-label="두 직선이 교차할 때 맞꼭지각과 이웃한 각을 확인하는 실험" onPointerMove={drag.pointerMove} onPointerUp={drag.pointerUp} onPointerCancel={drag.pointerUp}>
        <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/><SegmentGlyph a={a} b={c} color="#2563eb" width={4} arrows/><SegmentGlyph a={b} b={d} color="#e56b36" width={4} arrows/><AngleArc a={a} vertex={o} b={b} radius={38} color="#16845f"/><AngleArc a={c} vertex={o} b={d} radius={48} color="#16845f"/><AngleArc a={a} vertex={o} b={d} radius={57} color="#d97706"/><circle cx={o.x} cy={o.y} r="5" fill="#0f172a"/><text x={o.x+10} y={o.y+20} className="geometry-svg-label">교점 O</text><PointGlyph point={a} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={b} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/><circle cx={c.x} cy={c.y} r="5" fill="#64748b"/><text x={c.x-18} y={c.y+18} className="geometry-svg-label">C</text><circle cx={d.x} cy={d.y} r="5" fill="#64748b"/><text x={d.x+10} y={d.y-8} className="geometry-svg-label">D</text><text x="320" y="315" textAnchor="middle" className="geometry-svg-caption">맞꼭지각 = {small?.toFixed(1)}° · 이웃한 각의 합 = 180°</text>
      </svg>
      <div className="geometry-live-result"><strong>∠AOB = ∠COD = {small?.toFixed(1)}°</strong><MathFormula tex={`\\angle AOB=\\angle COD=${small?.toFixed(1)}^\\circ,\\quad \\angle AOB+\\angle AOD=${(small==null?0:small+adjacent).toFixed(1)}^\\circ`}/><span>∠AOD = {adjacent.toFixed(1)}° · 맞꼭지각은 직선의 교점에서 계산합니다.</span><button type="button" onClick={drag.undo}>실행 취소</button></div>
    </>}
    {mode==='lineCount'&&<>
      <div className="geometry-lesson-controls"><label>점·직선 수 <output>{count}</output></label><input aria-label="점 또는 직선 수" type="range" min="2" max="7" step="1" value={count} onChange={e=>setCount(Number(e.target.value))}/><button className={layout==='collinear'?'selected':''} onClick={()=>setLayout('collinear')}>한 직선 위 점</button><button className={layout==='circle'?'selected':''} onClick={()=>setLayout('circle')}>원 위 점</button><button className={layout==='verticalPairs'?'selected':''} onClick={()=>setLayout('verticalPairs')}>맞꼭지각 쌍</button></div>
      <p className="geometry-instruction">두 점을 고르는 조합 수와 실제 직선 수를 비교합니다. 한 직선 위 점들은 여러 선분을 만들지만 직선은 하나입니다.</p>
      <svg viewBox="0 0 640 360" role="img" aria-label="점의 배치에 따른 선분과 직선의 개수">
        <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/>
        {layout==='collinear'?<><line x1="80" y1="180" x2="560" y2="180" stroke="#16845f" strokeWidth="5"/>{Array.from({length:count},(_,i)=>{const x=100+i*440/(count-1);return <g key={i}><circle cx={x} cy="180" r="7" fill="#2563eb"/><text x={x} y="157" textAnchor="middle" className="geometry-svg-label">{String.fromCharCode(65+i)}</text></g>})}<text x="320" y="245" textAnchor="middle" className="geometry-svg-caption">모든 점이 한 직선 위이면 겹친 선분을 합쳐 직선 하나로 셉니다.</text></>:layout==='circle'?<><circle cx="320" cy="180" r="128" fill="none" stroke="#cbd5e1" strokeDasharray="5 5"/>{Array.from({length:count},(_,i)=>{const p=ray({x:320,y:180},128,-90+i*360/count);return <g key={i}><circle cx={p.x} cy={p.y} r="7" fill="#2563eb"/><text x={p.x} y={p.y-12} textAnchor="middle" className="geometry-svg-label">{String.fromCharCode(65+i)}</text>{Array.from({length:i},(_,j)=>{const q=ray({x:320,y:180},128,-90+j*360/count);return <line key={j} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#8b5cf6" strokeWidth="1.6" opacity=".58"/>})}</g>})}</>:Array.from({length:count},(_,i)=>{const angle=-90+i*180/count,pa=ray({x:320,y:180},190,angle),pb=ray({x:320,y:180},190,angle+180);return <SegmentGlyph key={i} a={pa} b={pb} color={['#2563eb','#e56b36','#16845f','#8b5cf6','#d97706','#0891b2','#db2777'][i]} width={i===0?4:2.5}/>})}
      </svg>
      <div className="geometry-live-result"><strong>{layout==='verticalPairs'?`맞꼭지각 쌍 = ${2*pairCount}`:`선분 조합 = ${pairCount}`}</strong><MathFormula tex={layout==='collinear'?`\\binom{${count}}{2}=${pairCount}\\text{개 선분},\\quad 1\\text{개 직선}`:layout==='circle'?`\\binom{${count}}{2}=${pairCount}\\text{개 직선 (세 점 공선 없음 가정)}`:`2\\binom{${count}}{2}=${2*pairCount}\\text{쌍}`}/><span>{layout==='collinear'?`서로 다른 직선 = 1 · 반직선 = ${count*(count-1)}`:layout==='circle'?`일반 위치를 가정한 직선 후보 = ${pairCount}`:`직선 ${count}개가 한 점에서 만나고, 각 직선쌍마다 맞꼭지각 2쌍`}</span></div>
    </>}
    {mode==='clock'&&<>
      <div className="geometry-lesson-controls"><label>시 <output>{hour}</output></label><input aria-label="시" type="range" min="1" max="12" step="1" value={hour} onChange={e=>setHour(Number(e.target.value))}/><label>분 <output>{minute}</output></label><input aria-label="분" type="range" min="0" max="55" step="5" value={minute} onChange={e=>setMinute(Number(e.target.value))}/></div>
      <p className="geometry-instruction">시침은 1분마다 0.5° 움직입니다. 분침만 고려하지 않고 두 바늘의 상대각을 계산합니다.</p>
      <svg viewBox="0 0 640 360" role="img" aria-label={`${hour}시 ${minute}분 시계의 두 바늘 사이 각`}>
        <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/><circle cx="320" cy="180" r="125" fill="#fff" stroke="#64748b" strokeWidth="3"/>{Array.from({length:12},(_,i)=><text key={i} x={ray({x:320,y:180},112,i*30-90).x} y={ray({x:320,y:180},112,i*30-90).y+5} textAnchor="middle" className="geometry-svg-label">{i===0?12:i}</text>)}<SegmentGlyph a={{x:320,y:180}} b={ray({x:320,y:180},65,(hour%12)*30+minute*.5-90)} color="#2563eb" width={7}/><SegmentGlyph a={{x:320,y:180}} b={ray({x:320,y:180},100,minute*6-90)} color="#e56b36" width={4}/><AngleArc a={ray({x:320,y:180},65,(hour%12)*30+minute*.5-90)} vertex={{x:320,y:180}} b={ray({x:320,y:180},100,minute*6-90)} radius={42} color="#16845f" label="auto"/><circle cx="320" cy="180" r="6" fill="#0f172a"/>
      </svg>
      <div className="geometry-live-result"><strong>작은 각 = {clockAngle.toFixed(1)}°</strong><MathFormula tex={`\\min\\left(|30\\cdot${hour%12}+0.5\\cdot${minute}-6\\cdot${minute}|,360^\\circ-\\Delta\\right)=${clockAngle.toFixed(1)}^\\circ`}/><span>시침은 1분마다 0.5° 움직이며, 작은 각을 선택합니다.</span></div>
    </>}
  </div>;
}
