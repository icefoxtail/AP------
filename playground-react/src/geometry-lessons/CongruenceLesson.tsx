import { useMemo, useState } from 'react';
import { congruenceCriterion, rotate2, sub2, triangleMeasures, type Point2 } from '../geometry-core/math';
import { AngleArc, EqualLengthMark, PointGlyph, RightAngleMark } from '../geometry-renderer/primitives';
import MathFormula from '../geometry-renderer/MathFormula';

type Criterion='SSS'|'SAS'|'ASA'|'RHS';
const start:[Point2,Point2,Point2]=[{x:105,y:250},{x:260,y:250},{x:260,y:115}];
const criteria:Criterion[]=['SSS','SAS','ASA','RHS'];
function transformed(points:[Point2,Point2,Point2],angle:number,scale:number,reflect:boolean):[Point2,Point2,Point2]{
  const center={x:points.reduce((s,p)=>s+p.x,0)/3,y:points.reduce((s,p)=>s+p.y,0)/3},rad=angle*Math.PI/180;
  return points.map(p=>{const v=sub2(p,center),r=rotate2({x:reflect?-v.x:v.x,y:v.y},rad);return {x:465+r.x*scale,y:185+r.y*scale}}) as [Point2,Point2,Point2];
}
export default function CongruenceLesson(){
  const [criterion,setCriterion]=useState<Criterion>('SSS'),[rotation,setRotation]=useState(28),[scale,setScale]=useState(1),[reflect,setReflect]=useState(true);
  const second=useMemo(()=>transformed(start,rotation,scale,reflect),[rotation,scale,reflect]),left=triangleMeasures(start),right=triangleMeasures(second);
  const valid=congruenceCriterion(left,right)!=='none';
  const pairs:[[number,number],[number,number],[number,number]]=[[left.sides[0],right.sides[0]],[left.sides[1],right.sides[1]],[left.sides[2],right.sides[2]]];
  const exactSides=pairs.map(([a,b])=>Math.abs(a-b)<1e-7);
  const required=criterion==='SSS'?exactSides.every(Boolean):criterion==='SAS'?exactSides[0]&&exactSides[1]&&Math.abs(left.angles[1]-right.angles[1])<1e-7:criterion==='ASA'?exactSides[0]&&Math.abs(left.angles[0]-right.angles[0])<1e-7&&Math.abs(left.angles[1]-right.angles[1])<1e-7:Math.abs(left.angles[1]-90)<1e-7&&Math.abs(right.angles[1]-90)<1e-7&&exactSides[0]&&exactSides[2];
  const rightAngle=(i:number)=>second[i];
  const conditionTex=criterion==='SSS'?`|AB|=|DE|=${left.sides[0].toFixed(1)},\\ |BC|=|EF|=${left.sides[1].toFixed(1)},\\ |CA|=|FD|=${left.sides[2].toFixed(1)}`:criterion==='SAS'?`|AB|=|DE|,\\ |BC|=|EF|,\\ \\angle B=\\angle E`:criterion==='ASA'?`\\angle A=\\angle D,\\ |AB|=|DE|,\\ \\angle B=\\angle E`:`\\angle B=\\angle E=90^\\circ,\\ |AC|=|DF|,\\ |AB|=|DE|`;
  return <div className="geometry-lesson">
    <div className="geometry-lesson-toolbar" role="group" aria-label="합동 판정 조건">{criteria.map(c=><button key={c} type="button" className={criterion===c?'selected':''} aria-pressed={criterion===c} onClick={()=>setCriterion(c)}>{c}</button>)}</div>
    <div className="geometry-lesson-controls"><label htmlFor="triangle-turn">회전 <output>{rotation}°</output></label><input id="triangle-turn" type="range" min="0" max="360" step="1" value={rotation} onChange={e=>setRotation(Number(e.target.value))}/><label htmlFor="triangle-scale">크기 <output>{scale.toFixed(2)}배</output></label><input id="triangle-scale" type="range" min="0.65" max="1.35" step="0.01" value={scale} onChange={e=>setScale(Number(e.target.value))}/><button type="button" aria-pressed={reflect} onClick={()=>setReflect(v=>!v)}>뒤집기 {reflect?'켜짐':'꺼짐'}</button></div>
    <p className="geometry-instruction">회전·뒤집어도 길이와 각은 유지됩니다. 크기를 바꾸면 실제 대응 조건을 다시 계산합니다.</p>
    <svg viewBox="0 0 640 360" role="img" aria-label="두 삼각형을 회전하고 뒤집어 합동 조건을 비교하는 실험">
      <rect x="18" y="18" width="604" height="324" rx="20" fill="#fbfdff" stroke="#dce5ef"/>
      <polygon points={start.map(p=>`${p.x},${p.y}`).join(' ')} fill="#dbeafe" fillOpacity=".75" stroke="#2563eb" strokeWidth="3"/>
      <polygon points={second.map(p=>`${p.x},${p.y}`).join(' ')} fill="#d1fae5" fillOpacity=".72" stroke="#16845f" strokeWidth="3"/>
      {[[0,1],[1,2],[2,0]].map(([i,j],idx)=><g key={idx}><EqualLengthMark a={start[i]} b={start[j]} c={second[i]} d={second[j]} count={idx+1} color={idx===0?'#2563eb':idx===1?'#d97706':'#16845f'}/></g>)}
      <RightAngleMark vertex={start[1]} a={start[0]} b={start[2]} color="#2563eb"/><RightAngleMark vertex={second[1]} a={second[0]} b={second[2]} color="#16845f"/>
      {[[0,1,2],[1,2,0],[2,0,1]].map(([i,j,k])=><g key={i}><AngleArc a={start[j]} vertex={start[i]} b={start[k]} radius={i===0?20:i===1?26:32} color="#2563eb"/><AngleArc a={rightAngle(j)} vertex={rightAngle(i)} b={rightAngle(k)} radius={i===0?20:i===1?26:32} color="#16845f"/></g>)}
      {start.map((p,i)=><PointGlyph key={`l${i}`} point={p} label={String.fromCharCode(65+i)}/>)}{second.map((p,i)=><PointGlyph key={`r${i}`} point={p} label={String.fromCharCode(68+i)}/>)}
      <text x="182" y="310" textAnchor="middle" className="geometry-svg-label">△ABC</text><text x="465" y="310" textAnchor="middle" className="geometry-svg-label">△DEF</text>
    </svg>
    <div className="geometry-live-result"><strong>{required?`${criterion} 조건이 계산상 성립합니다`:`현재 △ABC, △DEF는 ${criterion} 조건을 만족하지 않습니다`}</strong><MathFormula tex={`${conditionTex}${valid?'\\quad\\Longrightarrow\\quad \\triangle ABC\\cong\\triangle DEF':''}`}/><span>전체 삼각형 판정: {valid?'합동':'합동 아님'} · 대응변 오차 {Math.max(...pairs.map(([x,y])=>Math.abs(x-y))).toFixed(3)}</span><small>조건 입력과 좌표에서 계산한 합동 판정을 구분해 표시합니다.</small></div>
  </div>;
}
