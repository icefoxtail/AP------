import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import katex from 'katex';
import type { BasicId } from '../../data/types';
import { basicFormula } from './math';

type Mode = 'original' | 'line' | 'area';
const names:Record<BasicId,string>={
  'basic-circumference':'원의 둘레',
  'basic-circle-area':'원의 넓이',
  'basic-arc':'부채꼴 호의 길이',
  'basic-sector-perimeter':'부채꼴의 둘레',
  'basic-sector-area':'부채꼴의 넓이'
};
const tex=(s:string)=>katex.renderToString(s,{throwOnError:false,displayMode:true,output:'htmlAndMathml'});
function reducedRatio(theta:number){let a=theta,b=360;while(b){const t=b;b=a%b;a=t}return `${theta/a}/${360/a}`}
const sectorPath=(cx:number,cy:number,r:number,angle:number)=>{
  const a=-90*Math.PI/180,b=(angle-90)*Math.PI/180;
  const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle>180?1:0} 1 ${x2} ${y2} Z`;
};
const slicePath=(cx:number,cy:number,r:number,start:number,end:number)=>{const p=[cx+r*Math.cos(start*Math.PI/180),cy+r*Math.sin(start*Math.PI/180)],q=[cx+r*Math.cos(end*Math.PI/180),cy+r*Math.sin(end*Math.PI/180)];return `M ${cx} ${cy} L ${p[0]} ${p[1]} A ${r} ${r} 0 0 1 ${q[0]} ${q[1]} Z`};
const sectorArc=(cx:number,cy:number,r:number,angle:number)=>{
  const a=-90*Math.PI/180,b=(angle-90)*Math.PI/180;
  const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${angle>180?1:0} 1 ${x2} ${y2}`;
};
function usesArea(id:BasicId){return id==='basic-circle-area'||id==='basic-sector-area';}
function usesAngle(id:BasicId){return id!=='basic-circumference'&&id!=='basic-circle-area';}

export default function BasicLab({id}:{id:BasicId}){
  const [r,setR]=useState(6),[theta,setTheta]=useState(120),[mode,setMode]=useState<Mode>('original'),[replay,setReplay]=useState(0),[progress,setProgress]=useState(0);
  const stage=useRef<HTMLDivElement>(null),svgRef=useRef<SVGSVGElement>(null),dragPointer=useRef<number|null>(null);
  const progressTween=useRef<gsap.core.Tween|null>(null);
  const result=basicFormula(id,r,theta),angle=usesAngle(id)?theta:360;
  const areaMode=usesArea(id);
  const updateAngleFromPointer=(clientX:number,clientY:number)=>{
    const svg=svgRef.current;
    if(!svg)return;
    const point=svg.createSVGPoint();point.x=clientX;point.y=clientY;
    const local=point.matrixTransform(svg.getScreenCTM()?.inverse());
    const raw=(Math.atan2(local.y-166,local.x-210)*180/Math.PI+90+360)%360;
    const snapped=Math.max(15,Math.min(330,Math.round(raw/5)*5));
    setTheta(snapped);
  };
  useLayoutEffect(()=>{
    if(!stage.current||mode==='original')return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){setProgress(1);return}
    const ctx=gsap.context(()=>{
      if(mode==='line'){
        const motion={value:progress};
        progressTween.current=gsap.to(motion,{value:1,duration:1.4,ease:'none',onUpdate:()=>setProgress(motion.value)});
        const result=stage.current!.querySelector('[data-basic-result]');
        if(result)gsap.fromTo(result,{opacity:0,y:12},{opacity:1,y:0,duration:.4});
      }else{
        const result=stage.current!.querySelector('[data-basic-result]');
        if(id==='basic-circle-area'){
          const motion={value:progress};
          progressTween.current=gsap.to(motion,{value:1,duration:1.5,ease:'none',onUpdate:()=>setProgress(motion.value)});
        }
        if(result)gsap.fromTo(result,{opacity:0,y:12},{opacity:1,y:0,duration:.4,delay:.45});
      }
    },stage);
    return ()=>{ctx.revert();progressTween.current?.kill()};
  },[id,mode,replay,r,theta]);
  const selectedMode:Mode=areaMode?'area':'line';
  return <div className="lab-content">
    <div className="lab-caption"><div><span className="eyebrow">기초 개념 · 직접 조작</span><h2>{names[id]}</h2></div><p>{usesAngle(id)?'노란 점을 드래그하거나 슬라이더를 움직이면 그림과 계산 결과가 함께 바뀝니다.':'슬라이더를 움직여 그림과 계산 결과가 함께 바뀌는 것을 확인하세요.'}</p></div>
    <section className="stage-card basic-stage" ref={stage}>
      <div className="stage-head"><div className="mode-group" role="group" aria-label="관찰 모드">
        <button type="button" className={`mode-button ${mode==='original'?'selected':''}`} onClick={()=>{progressTween.current?.kill();setProgress(0);setMode('original')}} aria-pressed={mode==='original'}>원본 그림</button>
        <button type="button" className={`mode-button mode-${selectedMode} ${mode===selectedMode?'selected':''}`} onClick={()=>{setMode(selectedMode);setProgress(0);setReplay(n=>n+1)}} aria-pressed={mode===selectedMode}>{areaMode?'넓이 확인':'경계 길이'}</button>
      </div><div className="stage-actions">{mode!=='original'&&<button type="button" className="replay-button" onClick={()=>{progressTween.current?.kill();setProgress(0);setReplay(n=>n+1)}}>↻ 과정 다시 보기</button>}<span className="stage-chip">기초 공식 실험</span></div></div>
      <div className="sliders-line">
        <label className="slider-control"><span>반지름 r</span><input aria-label="반지름 r" type="range" min="2" max="12" step="1" value={r} onChange={e=>setR(Number(e.target.value))}/><output>{r}cm</output></label>
        {usesAngle(id)&&<label className="slider-control"><span>중심각 θ</span><input aria-label="중심각 θ" type="range" min="15" max="330" step="5" value={theta} onChange={e=>setTheta(Number(e.target.value))}/><output>{theta}°</output></label>}
      </div>
      {mode==='line'&&<div className="motion-scrubber"><label htmlFor="basic-line-progress">{id==='basic-circumference'?'원둘레를 길이 막대로 펼치기':'실제 경계를 따라 길이 확인'}</label><input id="basic-line-progress" type="range" min="0" max="100" step="1" value={Math.round(progress*100)} onChange={e=>{progressTween.current?.kill();setProgress(Number(e.target.value)/100)}}/><output>{Math.round(progress*100)}%</output><span>파란 원호·호와 길이 막대는 같은 진행 비율을 나타냅니다.</span></div>}
      {id==='basic-circle-area'&&mode==='area'&&<div className="motion-scrubber"><label htmlFor="basic-area-progress">부채꼴 조각 자르고 재배열</label><input id="basic-area-progress" type="range" min="0" max="100" step="1" value={Math.round(progress*100)} onChange={e=>{progressTween.current?.kill();setProgress(Number(e.target.value)/100)}}/><output>{Math.round(progress*100)}%</output><span>각 조각은 크기와 넓이를 유지한 채 이동합니다.</span></div>}
      <div className="stage-body basic-stage-body">
        <div className="canvas-area"><div className="canvas-label"><span className="canvas-label-dot"/>{mode==='original'?'도형과 매개변수':areaMode?'원의 넓이 · 부채꼴 넓이':'둘레에 포함되는 실제 경계'}</div>
          <svg ref={svgRef} className="geometry-svg basic-svg" viewBox="0 0 420 340" role="img" aria-label={`${names[id]}, 반지름 ${r}센티미터${usesAngle(id)?`, 중심각 ${theta}도`:''}`} onPointerMove={e=>{if(dragPointer.current===e.pointerId)updateAngleFromPointer(e.clientX,e.clientY)}} onPointerUp={e=>{if(dragPointer.current===e.pointerId)dragPointer.current=null}} onPointerCancel={e=>{if(dragPointer.current===e.pointerId)dragPointer.current=null}}>
            <circle cx="210" cy="166" r="112" fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/>
            {areaMode&&id!=='basic-circle-area'&&<path d={sectorPath(210,166,112,angle)} fill="#bcebd7" stroke="#16845f" strokeWidth="2"/>}
            {id==='basic-circle-area'&&mode==='original'&&<circle cx="210" cy="166" r="112" fill="#bcebd7" stroke="#16845f" strokeWidth="2"/>}
            {id==='basic-circle-area'&&mode==='area'&&<circle cx="210" cy="166" r="112" fill="#bcebd7" fillOpacity=".12" stroke="#7cb69a" strokeDasharray="6 5" strokeWidth="2"/>}
            {id==='basic-circle-area'&&mode==='area'&&Array.from({length:12},(_,i)=>{const cx=210,cy=166,R=112,N=12,step=360/N,start=i*step-90,end=start+step,mid=start+step/2,top=i<N/2,idx=top?i:i-N/2,rectW=Math.PI*R,slotW=rectW/(N/2),tx=cx-rectW/2+idx*slotW+(top?slotW/2:0),ty=cy+(top?R/2:-R/2);let delta=(top?-90:90)-mid;while(delta>180)delta-=360;while(delta< -180)delta+=360;const x=cx+(tx-cx)*progress,y=cy+(ty-cy)*progress,rotation=delta*progress;return <g key={i} transform={`translate(${x-cx} ${y-cy}) rotate(${rotation} ${cx} ${cy})`} data-basic-piece><path d={slicePath(cx,cy,R,start,end)} fill={top?'#91d9be':'#f2c78b'} fillOpacity=".78" stroke="#fff" strokeWidth="2"/></g>})}
            {usesAngle(id)&&<>
              <line x1="210" y1="166" x2="210" y2="54" stroke="#64748b" strokeWidth="2"/>
              <line x1="210" y1="166" x2={210+112*Math.cos((theta-90)*Math.PI/180)} y2={166+112*Math.sin((theta-90)*Math.PI/180)} stroke="#64748b" strokeWidth="2"/>
              <text x="220" y="158" className="diagram-note">{theta}°</text>
              <circle className="angle-handle" cx={210+112*Math.cos((theta-90)*Math.PI/180)} cy={166+112*Math.sin((theta-90)*Math.PI/180)} r="12" fill="#f7bf40" stroke="#7c5a1f" strokeWidth="2" role="slider" tabIndex={0} aria-label="중심각 끝점 드래그" aria-valuemin={15} aria-valuemax={330} aria-valuenow={theta} onPointerDown={e=>{dragPointer.current=e.pointerId;e.currentTarget.setPointerCapture(e.pointerId);updateAngleFromPointer(e.clientX,e.clientY)}} onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowUp'){e.preventDefault();setTheta(Math.min(330,theta+5))}else if(e.key==='ArrowLeft'||e.key==='ArrowDown'){e.preventDefault();setTheta(Math.max(15,theta-5))}}}/>
            </>}
            {id==='basic-circumference'?<><circle cx="210" cy="166" r="112" fill="none" stroke={mode==='line'?'#2563eb':'#64748b'} strokeWidth={mode==='line'?7:3} strokeDasharray={mode==='line'?`${2*Math.PI*112}`:undefined} strokeDashoffset={mode==='line'?`${2*Math.PI*112*(1-progress)}`:undefined} data-basic-boundary/>{mode==='line'&&<circle cx={210+112*Math.cos((-90+360*progress)*Math.PI/180)} cy={166+112*Math.sin((-90+360*progress)*Math.PI/180)} r="7" fill="#e56b36"/>}</>:
              usesAngle(id)&&<path d={sectorArc(210,166,112,mode==='line'?Math.max(.01,theta*progress):theta)} fill="none" stroke="#e56b36" strokeWidth={mode==='line'?7:4} strokeLinecap="round" data-basic-boundary/>}
            {id==='basic-sector-perimeter'&&<><line x1="210" y1="166" x2="210" y2={166-112*progress} stroke="#e56b36" strokeWidth="6"/><line x1="210" y1="166" x2={210+112*Math.cos((theta-90)*Math.PI/180)*progress} y2={166+112*Math.sin((theta-90)*Math.PI/180)*progress} stroke="#e56b36" strokeWidth="6"/></>}
            <line x1="210" y1="166" x2="210" y2="54" stroke="#334155" strokeWidth="2" strokeDasharray="5 4"/>
            <text x="216" y="108" className="diagram-value">r = {r} cm</text>
            <text x="210" y="320" textAnchor="middle" className="diagram-note">π는 원주율 · 그림의 크기와 수식이 같은 값에 연결됩니다</text>
          </svg>
        </div>
        <aside className="proof-panel basic-proof" aria-live="polite"><div className="proof-heading"><span className="proof-dot"/><span>{areaMode?'넓이의 비례 관계':'둘레와 호의 길이'}</span></div>
          <div className="basic-proof-copy"><strong>{result.concept}</strong><div className="basic-formula" data-basic-result dangerouslySetInnerHTML={{__html:tex(result.tex)}}/><div className="answer-line"><span>계산 결과</span><strong>{result.value}</strong></div></div>
          {id==='basic-circumference'&&<div className="basic-length-match"><span>원 둘레</span><div className="basic-length-bar" style={{width:`${progress*100}%`}}/><b>2πr</b></div>}
          {id==='basic-circle-area'&&<div className="basic-area-steps"><span>12개의 같은 넓이 부채꼴</span><span>엇갈려 놓아 πr × r 만들기</span></div>}
          {usesAngle(id)&&<div className="basic-ratio"><span>중심각 비율</span><strong>{theta}/360 = {reducedRatio(theta)}</strong><div className="basic-ratio-track"><i style={{width:`${theta/360*100}%`}}/></div></div>}
        </aside>
      </div>
      <div className="stage-bottom"><div className="legend-key"><i className="key-green"/>원본의 넓이</div><div className="legend-key"><i className="key-orange"/>둘레·호</div><div className="legend-note">계산식과 그림은 같은 슬라이더 값을 사용합니다.</div></div>
    </section>
  </div>;
}
