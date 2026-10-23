import { useRef, useState } from 'react';
import { add2, angleDegrees, arePerpendicular, distance2, midpoint, normalize2, projectPointToLine, scale2, sub2, type Point2 } from '../geometry-core/math';
import { AngleArc, ConstructionArc, EqualLengthMark, PointGlyph, RightAngleMark, SegmentGlyph } from '../geometry-renderer/primitives';
import MathFormula from '../geometry-renderer/MathFormula';
import { useDraggablePoints, type PointMap } from '../geometry-interaction/useDraggablePoints';
import { useConstructionTimeline } from '../geometry-animation/useConstructionTimeline';

type Mode='perpBisector'|'angleBisector'|'perpDrop'|'paperFold'|'bisectStraight';
const base:PointMap={A:{x:135,y:180},B:{x:505,y:180},P:{x:300,y:92},O:{x:320,y:225},U:{x:500,y:165},V:{x:195,y:115}};
const options:{id:Mode;name:string}[]=[{id:'perpBisector',name:'수직이등분선 작도'},{id:'angleBisector',name:'각의 이등분선 작도'},{id:'bisectStraight',name:'평각의 이등분선'},{id:'perpDrop',name:'점에서 직선에 수선 긋기'},{id:'paperFold',name:'종이접기와 합동'}];
function reflect(p:Point2,a:Point2,b:Point2):Point2{const foot=projectPointToLine(p,a,b);return foot?add2(p,scale2(sub2(foot,p),2)):p}

export default function ConstructionLesson(){
  const [points,setPoints]=useState<PointMap>(base),[mode,setMode]=useState<Mode>('perpBisector'),[step,setStep]=useState(3),svgRef=useRef<SVGSVGElement>(null),stageRef=useRef<HTMLDivElement>(null);
  const drag=useDraggablePoints({svgRef,points,setPoints,snapTo:Object.values(points)});
  const motion=useConstructionTimeline(stageRef,`${mode}/${step}`);
  const a=points.A,b=points.B,m=midpoint(a,b),ab=distance2(a,b),radius=ab*.68,axis=normalize2(sub2(b,a))??{x:1,y:0},normal={x:-axis.y,y:axis.x},height=Math.sqrt(Math.max(0,radius*radius-ab*ab/4));
  const p=add2(m,scale2(normal,height)),q=add2(m,scale2(normal,-height));
  const perp=projectPointToLine(points.P,a,b)??m;
  const u=normalize2(sub2(points.U,points.O))??{x:1,y:0},v=normalize2(sub2(points.V,points.O))??{x:-1,y:-.2},bisector=normalize2(add2({x:0,y:0},add2(u,v)))??u,rayEnd=add2(points.O,scale2(bisector,180));
  const probe=add2(points.O,scale2(bisector,70)),footU=projectPointToLine(probe,points.O,points.U)??probe,footV=projectPointToLine(probe,points.O,points.V)??probe;
  const folded=reflect(points.U,points.O,points.V);
  const straightLeft=add2(points.O,{x:-170,y:0}),straightRight=add2(points.O,{x:170,y:0}),straightDir=normalize2(sub2(points.P,points.O))??{x:0,y:-1},bisectLeft=normalize2(add2({x:-1,y:0},straightDir))??{x:-1,y:0},bisectRight=normalize2(add2(straightDir,{x:1,y:0}))??{x:1,y:0},bisectLeftEnd=add2(points.O,scale2(bisectLeft,150)),bisectRightEnd=add2(points.O,scale2(bisectRight,150)),bisectorsPerpendicular=arePerpendicular(bisectLeft,bisectRight);
  const stepNames:Record<Mode,[string,string,string,string]>={perpBisector:['준비','원호','교점','완성'],angleBisector:['준비','각 확인','이등분선','거리 확인'],bisectStraight:['평각','두 각','이등분선','직각 확인'],perpDrop:['점과 직선','수선 긋기','거리 확인','직각 확인'],paperFold:['접기 전','접는 선','반사','합동 확인']};
  return <div className="geometry-lesson">
    <div className="geometry-lesson-toolbar" role="group" aria-label="작도 방식 선택">{options.map(item=><button type="button" key={item.id} className={mode===item.id?'selected':''} aria-pressed={mode===item.id} onClick={()=>{setMode(item.id);setStep(3)}}>{item.name}</button>)}</div>
    <div className="geometry-step-controls"><span>작도 단계</span>{[0,1,2,3].map(i=><button key={i} type="button" className={step>=i?'selected':''} aria-pressed={step===i} onClick={()=>setStep(i)}>{stepNames[mode][i]}</button>)}</div>
    <p className="geometry-instruction">점들을 움직여 작도 조건을 바꿔 보세요. 합동·직각 표시는 계산한 점의 관계가 정확히 성립할 때만 나타납니다.</p>
    <div ref={stageRef}>
    <div className="geometry-animation-controls"><button type="button" className="replay-button" onClick={motion.play}>작도 경로 재생</button><label htmlFor="geometry-construction-progress">원호부터 완성 직선까지</label><input id="geometry-construction-progress" type="range" min="0" max="100" value={Math.round(motion.progress*100)} onChange={e=>motion.seek(Number(e.target.value)/100)}/><output>{Math.round(motion.progress*100)}%</output></div>
    <svg ref={svgRef} viewBox="0 0 640 360" role="img" aria-label="나침반 원호와 자를 이용한 작도 실험" onPointerMove={drag.pointerMove} onPointerUp={drag.pointerUp} onPointerCancel={drag.pointerUp}>
      <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/>
      {mode==='perpBisector'&&<>
        <SegmentGlyph a={a} b={b} color="#334155" width={4}/>
        {step>=1&&<g data-step="1"><ConstructionArc center={a} radius={radius} start={p} end={q} color="#d97706"/><ConstructionArc center={b} radius={radius} start={q} end={p} color="#2563eb"/></g>}
        {step>=2&&<g data-step="2"><circle cx={p.x} cy={p.y} r="6" fill="#16845f"/><circle cx={q.x} cy={q.y} r="6" fill="#16845f"/><text x={p.x+10} y={p.y-8} className="geometry-svg-label">P</text><text x={q.x+10} y={q.y+20} className="geometry-svg-label">Q</text></g>}
        {step>=3&&<g data-step="3"><SegmentGlyph a={p} b={q} color="#16845f" width={4} arrows constructionPath/><SegmentGlyph a={a} b={m} color="#e56b36" width={0.6} dash="4 4"/><SegmentGlyph a={m} b={b} color="#e56b36" width={0.6} dash="4 4"/><EqualLengthMark a={a} b={m} c={m} d={b}/><RightAngleMark vertex={m} a={p} b={a} size={18}/></g>}
        <PointGlyph point={a} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={b} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/>
        <text x="320" y="322" textAnchor="middle" className="geometry-svg-caption">원호의 교점 P, Q는 AP = BP, AQ = BQ를 만족합니다.</text>
      </>}
      {mode==='angleBisector'&&<>
        <SegmentGlyph a={points.O} b={points.U} color="#2563eb" width={4} arrows/><SegmentGlyph a={points.O} b={points.V} color="#e56b36" width={4} arrows/>{step>=3&&<SegmentGlyph a={points.O} b={rayEnd} color="#16845f" width={4} arrows constructionPath/>}
        {step>=1&&<><AngleArc a={points.U} vertex={points.O} b={rayEnd} radius={38} color="#2563eb" label="auto"/><AngleArc a={rayEnd} vertex={points.O} b={points.V} radius={48} color="#e56b36" label="auto"/></>}
        {step>=3&&<><SegmentGlyph a={probe} b={footU} color="#16845f" width={2.5}/><SegmentGlyph a={probe} b={footV} color="#16845f" width={2.5}/><EqualLengthMark a={probe} b={footU} c={probe} d={footV} color="#16845f"/></>}
        <PointGlyph point={points.O} label="O" onPointerDown={drag.pointerDown('O')} onKeyDown={drag.keyDown('O')}/><PointGlyph point={points.U} label="A" onPointerDown={drag.pointerDown('U')} onKeyDown={drag.keyDown('U')}/><PointGlyph point={points.V} label="B" onPointerDown={drag.pointerDown('V')} onKeyDown={drag.keyDown('V')}/>
        <text x="320" y="322" textAnchor="middle" className="geometry-svg-caption">두 각의 크기는 실제 방향벡터에서 계산합니다.</text>
      </>}
      {mode==='bisectStraight'&&<>
        <SegmentGlyph a={straightLeft} b={straightRight} color="#334155" width={3}/>
        <SegmentGlyph a={points.O} b={points.P} color="#d97706" width={4} arrows/>
        {step>=2&&<><SegmentGlyph a={points.O} b={bisectLeftEnd} color="#2563eb" width={4} arrows constructionPath/><SegmentGlyph a={points.O} b={bisectRightEnd} color="#16845f" width={4} arrows constructionPath/></>}
        {step>=3&&<RightAngleMark vertex={points.O} a={bisectLeftEnd} b={bisectRightEnd} size={18}/>}<PointGlyph point={points.O} label="O"/><PointGlyph point={points.P} label="C" onPointerDown={drag.pointerDown('P')} onKeyDown={drag.keyDown('P')}/>
        <text x="320" y="322" textAnchor="middle" className="geometry-svg-caption">평각 180°의 두 이등분선 사이 각은 두 방향 벡터가 수직일 때 90°입니다.</text>
      </>}
      {mode==='perpDrop'&&<>
        <SegmentGlyph a={add2(a,scale2(axis,-80))} b={add2(b,scale2(axis,80))} color="#2563eb" width={4} arrows/>{step>=2&&<><SegmentGlyph a={points.P} b={perp} color="#d97706" width={4} constructionPath/><SegmentGlyph a={points.P} b={add2(perp,scale2(normal,60))} color="#94a3b8" width={2} dash="5 4"/></>}
        {step>=3&&<RightAngleMark vertex={perp} a={points.P} b={b} size={17}/>}<PointGlyph point={points.P} label="P" onPointerDown={drag.pointerDown('P')} onKeyDown={drag.keyDown('P')}/><PointGlyph point={perp} label="H"/><PointGlyph point={a} label="A" onPointerDown={drag.pointerDown('A')} onKeyDown={drag.keyDown('A')}/><PointGlyph point={b} label="B" onPointerDown={drag.pointerDown('B')} onKeyDown={drag.keyDown('B')}/>
        <text x="320" y="322" textAnchor="middle" className="geometry-svg-caption">PH ⟂ AB일 때 PH가 점 P와 직선 AB 사이의 거리입니다.</text>
      </>}
      {mode==='paperFold'&&<>
        <polygon points={[points.O,points.V,points.U].map(p=>`${p.x},${p.y}`).join(' ')} fill="#dbeafe" fillOpacity=".58" stroke="#2563eb" strokeWidth="2.5"/>
        {step>=1&&<SegmentGlyph a={points.O} b={points.V} color="#d97706" width={5} constructionPath/>}
        {step>=2&&<g><polygon points={[points.O,points.V,folded].map(p=>`${p.x},${p.y}`).join(' ')} fill="#d1fae5" fillOpacity=".52" stroke="#16845f" strokeWidth="2.5"/><SegmentGlyph a={points.O} b={points.U} color="#2563eb" width={2.5}/><SegmentGlyph a={points.O} b={folded} color="#16845f" width={2.5}/><SegmentGlyph a={points.V} b={points.U} color="#2563eb" width={2.5}/><SegmentGlyph a={points.V} b={folded} color="#16845f" width={2.5}/><PointGlyph point={folded} label="P′"/></g>}
        {step>=3&&<><EqualLengthMark a={points.O} b={points.U} c={points.O} d={folded} color="#2563eb"/><EqualLengthMark a={points.V} b={points.U} c={points.V} d={folded} color="#16845f" count={2}/></>}
        <PointGlyph point={points.O} label="O" onPointerDown={drag.pointerDown('O')} onKeyDown={drag.keyDown('O')}/><PointGlyph point={points.V} label="V" onPointerDown={drag.pointerDown('V')} onKeyDown={drag.keyDown('V')}/><PointGlyph point={points.U} label="P" onPointerDown={drag.pointerDown('U')} onKeyDown={drag.keyDown('U')}/>
        <text x="320" y="322" textAnchor="middle" className="geometry-svg-caption">접는 선 OV 위의 점은 고정되고, P와 P′의 거리는 보존됩니다.</text>
      </>}
    </svg></div>
    <div className="geometry-live-result"><strong>{mode==='perpBisector'?`AM = MB = ${(ab/2).toFixed(2)} · AP = BP = ${distance2(a,p).toFixed(2)}`:mode==='angleBisector'?`∠AOB = ${angleDegrees(points.U,points.O,points.V)?.toFixed(1)}°`:mode==='bisectStraight'?`두 이등분선은 ${bisectorsPerpendicular?'서로 수직입니다':'현재 수직이 아닙니다'}`:mode==='perpDrop'?`PH = ${distance2(points.P,perp).toFixed(2)} · ∠PHB = 90°`:`OP = OP′ = ${distance2(points.O,points.U).toFixed(2)} · VP = VP′ = ${distance2(points.V,points.U).toFixed(2)}`}</strong><MathFormula tex={mode==='perpBisector'?`M=\\frac{A+B}{2},\\quad AP=BP,\\quad PQ\\perp AB`:mode==='angleBisector'?`\\angle UOQ=\\angle QOV`:mode==='bisectStraight'?`\\angle AOB=180^\\circ,\\quad \\angle AOC=\\angle COB=90^\\circ,\\quad \\vec{OM}\\cdot\\vec{ON}=${bisectorsPerpendicular?'0':'\\ne0'}`:mode==='perpDrop'?`PH\\perp AB,\\quad d(P,AB)=PH=${distance2(points.P,perp).toFixed(2)}`:`OP=OP′,\\quad VP=VP′,\\quad \\triangle OVP\\cong\\triangle OVP′`}/><span>{mode==='perpBisector'?'수직이등분선 위의 점은 A와 B에서 거리가 같습니다.':mode==='angleBisector'?'이등분선 위의 점은 두 변에서 같은 거리에 놓입니다.':mode==='bisectStraight'?'평각의 두 부분을 각각 이등분하면 두 이등분선은 직각을 이룹니다.':mode==='perpDrop'?'직각 표시는 내적 계산 결과가 0일 때만 표시됩니다.':'접는 선 위의 두 점 O, V는 움직이지 않고 반사된 삼각형은 원본과 합동입니다.'}</span><button type="button" onClick={drag.undo}>실행 취소</button></div>
  </div>;
}
