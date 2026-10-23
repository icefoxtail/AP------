import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import katex from 'katex';
import type { BasicId } from '../../data/types';

type Mode = 'original' | 'line' | 'area';
const names:Record<BasicId,string>={
  'basic-circumference':'원의 둘레',
  'basic-circle-area':'원의 넓이',
  'basic-arc':'부채꼴 호의 길이',
  'basic-sector-perimeter':'부채꼴의 둘레',
  'basic-sector-area':'부채꼴의 넓이'
};
const tex=(s:string)=>katex.renderToString(s,{throwOnError:false,displayMode:true,output:'htmlAndMathml'});
function gcd(a:number,b:number):number{return b?gcd(b,a%b):Math.abs(a)||1}
function piCoefficient(n:number,d=1){const g=gcd(n,d),a=n/g,b=d/g;return {tex:b===1?`${a}\\pi`:`\\frac{${a}}{${b}}\\pi`,label:b===1?`${a}π`:`${a}π/${b}`}}
const sectorPath=(cx:number,cy:number,r:number,angle:number)=>{
  const a=-90*Math.PI/180,b=(angle-90)*Math.PI/180;
  const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a),x2=cx+r*Math.cos(b),y2=cy+r*Math.sin(b);
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${angle>180?1:0} 1 ${x2} ${y2} Z`;
};
function formula(id:BasicId,r:number,theta:number){
  const arcTerm=piCoefficient(theta*r,180);
  const sectorTerm=piCoefficient(theta*r*r,360);
  switch(id){
    case 'basic-circumference':return {tex:`2\\pi r=2\\pi\\times ${r}=${2*r}\\pi\\text{ cm}`, value:`${2*r}π cm`,concept:'원의 둘레는 반지름의 2π배입니다.'};
    case 'basic-circle-area':return {tex:`\\pi r^2=\\pi\\times ${r}^2=${r*r}\\pi\\text{ cm}^2`,value:`${r*r}π cm²`,concept:'원을 같은 넓이의 부채꼴로 나누어 번갈아 놓으면 밑변 πr, 높이 r인 모양에 가까워집니다.'};
    case 'basic-arc':return {tex:`${arcTerm.tex}=${arcTerm.tex}\\text{ cm}`,value:`${arcTerm.label} cm`,concept:`중심각 ${theta}°는 한 바퀴 360°의 ${theta}/360입니다.`};
    case 'basic-sector-perimeter':return {tex:`\\frac{${theta}}{360}\\times 2\\pi\\times ${r}+2\\times ${r}=${arcTerm.tex}+${2*r}\\text{ cm}`,value:`${arcTerm.label} + ${2*r} cm`,concept:'부채꼴의 둘레는 호 한 개와 반지름 두 개를 더합니다.'};
    case 'basic-sector-area':return {tex:`\\frac{${theta}}{360}\\times \\pi\\times ${r}^2=${sectorTerm.tex}\\text{ cm}^2`,value:`${sectorTerm.label} cm²`,concept:'부채꼴의 넓이는 원 전체 넓이의 중심각 비율만큼입니다.'};
  }
}
function usesArea(id:BasicId){return id==='basic-circle-area'||id==='basic-sector-area';}
function usesAngle(id:BasicId){return id!=='basic-circumference'&&id!=='basic-circle-area';}

export default function BasicLab({id}:{id:BasicId}){
  const [r,setR]=useState(6),[theta,setTheta]=useState(120),[mode,setMode]=useState<Mode>('original'),[replay,setReplay]=useState(0);
  const stage=useRef<HTMLDivElement>(null);
  const result=formula(id,r,theta),angle=usesAngle(id)?theta:360;
  const areaMode=usesArea(id);
  useLayoutEffect(()=>{
    if(!stage.current||mode==='original'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const ctx=gsap.context(()=>{
      if(mode==='line'){
        const paths=[...stage.current!.querySelectorAll<SVGGeometryElement>('[data-basic-boundary]')];
        const tl=gsap.timeline();
        paths.forEach((p,i)=>{const len=p.getTotalLength();tl.fromTo(p,{strokeDasharray:len,strokeDashoffset:len},{strokeDashoffset:0,duration:.75},i===0?0:'>-=0.12')});
        tl.fromTo(stage.current!.querySelector('[data-basic-result]'),{opacity:0,y:12},{opacity:1,y:0,duration:.4},'>-=0.05');
      }else{
        gsap.fromTo(stage.current!.querySelectorAll('[data-basic-piece]'),{opacity:.25,y:22,rotate:-5},{opacity:1,y:0,rotate:0,duration:.7,stagger:.09,ease:'power2.out'});
        gsap.fromTo(stage.current!.querySelector('[data-basic-result]'),{opacity:0,y:12},{opacity:1,y:0,duration:.4,delay:.45});
      }
    },stage);
    return ()=>ctx.revert();
  },[id,mode,replay,r,theta]);
  const selectedMode:Mode=areaMode?'area':'line';
  return <div className="lab-content">
    <div className="lab-caption"><div><span className="eyebrow">기초 개념 · 직접 조작</span><h2>{names[id]}</h2></div><p>슬라이더를 움직여 그림과 계산 결과가 함께 바뀌는 것을 확인하세요.</p></div>
    <section className="stage-card basic-stage" ref={stage}>
      <div className="stage-head"><div className="mode-group" role="group" aria-label="관찰 모드">
        <button type="button" className={`mode-button ${mode==='original'?'selected':''}`} onClick={()=>setMode('original')} aria-pressed={mode==='original'}>원본 그림</button>
        <button type="button" className={`mode-button mode-${selectedMode} ${mode===selectedMode?'selected':''}`} onClick={()=>{setMode(selectedMode);setReplay(n=>n+1)}} aria-pressed={mode===selectedMode}>{areaMode?'넓이 확인':'경계 길이'}</button>
      </div><div className="stage-actions">{mode!=='original'&&<button type="button" className="replay-button" onClick={()=>setReplay(n=>n+1)}>↻ 과정 다시 보기</button>}<span className="stage-chip">기초 공식 실험</span></div></div>
      <div className="sliders-line">
        <label className="slider-control"><span>반지름 r</span><input aria-label="반지름 r" type="range" min="2" max="12" step="1" value={r} onChange={e=>setR(Number(e.target.value))}/><output>{r}cm</output></label>
        {usesAngle(id)&&<label className="slider-control"><span>중심각 θ</span><input aria-label="중심각 θ" type="range" min="30" max="330" step="15" value={theta} onChange={e=>setTheta(Number(e.target.value))}/><output>{theta}°</output></label>}
      </div>
      <div className="stage-body basic-stage-body">
        <div className="canvas-area"><div className="canvas-label"><span className="canvas-label-dot"/>{mode==='original'?'도형과 매개변수':areaMode?'원의 넓이 · 부채꼴 넓이':'둘레에 포함되는 실제 경계'}</div>
          <svg className="geometry-svg basic-svg" viewBox="0 0 420 340" role="img" aria-label={`${names[id]}, 반지름 ${r}센티미터${usesAngle(id)?`, 중심각 ${theta}도`:''}`}>
            <circle cx="210" cy="166" r="112" fill="#f8fafc" stroke="#dbe4ec" strokeWidth="2"/>
            {areaMode&&<path d={id==='basic-circle-area'?'':sectorPath(210,166,112,angle)} fill="#bcebd7" stroke="#16845f" strokeWidth="2"/>}
            {id==='basic-circle-area'&&<circle cx="210" cy="166" r="112" fill="#bcebd7" stroke="#16845f" strokeWidth="2"/>}
            {id==='basic-circle-area'&&Array.from({length:12},(_,i)=>{const a=i*Math.PI/6;return <line key={i} x1="210" y1="166" x2={210+112*Math.cos(a)} y2={166+112*Math.sin(a)} stroke="#fff" strokeWidth="2" data-basic-piece/>})}
            {usesAngle(id)&&<>
              <line x1="210" y1="166" x2="322" y2="166" stroke="#64748b" strokeWidth="2"/>
              <line x1="210" y1="166" x2={210+112*Math.cos((theta-90)*Math.PI/180)} y2={166+112*Math.sin((theta-90)*Math.PI/180)} stroke="#64748b" strokeWidth="2"/>
              <text x="220" y="158" className="diagram-note">{theta}°</text>
            </>}
            {id==='basic-circumference'?<circle cx="210" cy="166" r="112" fill="none" stroke={mode==='line'?'#2563eb':'#64748b'} strokeWidth={mode==='line'?7:3} data-basic-boundary/>:
              usesAngle(id)&&<path d={sectorPath(210,166,112,theta).replace(/^M [^ ]+ [^ ]+ L [^ ]+ [^ ]+ /,'')} fill="none" stroke="#e56b36" strokeWidth={mode==='line'?7:4} strokeLinecap="round" data-basic-boundary/>}
            {id==='basic-sector-perimeter'&&<><line x1="210" y1="166" x2="322" y2="166" stroke="#e56b36" strokeWidth="6" data-basic-boundary/><line x1="210" y1="166" x2={210+112*Math.cos((theta-90)*Math.PI/180)} y2={166+112*Math.sin((theta-90)*Math.PI/180)} stroke="#e56b36" strokeWidth="6" data-basic-boundary/></>}
            <line x1="210" y1="166" x2="322" y2="166" stroke="#334155" strokeWidth="2" strokeDasharray="5 4"/>
            <text x="264" y="187" className="diagram-value">r = {r} cm</text>
            <text x="210" y="320" textAnchor="middle" className="diagram-note">π는 원주율 · 그림의 크기와 수식이 같은 값에 연결됩니다</text>
          </svg>
        </div>
        <aside className="proof-panel basic-proof" aria-live="polite"><div className="proof-heading"><span className="proof-dot"/><span>{areaMode?'넓이의 비례 관계':'둘레와 호의 길이'}</span></div>
          <div className="basic-proof-copy"><strong>{result.concept}</strong><div className="basic-formula" data-basic-result dangerouslySetInnerHTML={{__html:tex(result.tex)}}/><div className="answer-line"><span>계산 결과</span><strong>{result.value}</strong></div></div>
          {id==='basic-circumference'&&<div className="basic-length-match"><span>원 둘레</span><div className="basic-length-bar"/><b>2πr</b></div>}
          {id==='basic-circle-area'&&<div className="basic-area-steps">{Array.from({length:6},(_,i)=><span key={i} data-basic-piece className={i%2?'down':''}/>)}</div>}
          {usesAngle(id)&&<div className="basic-ratio"><span>중심각 비율</span><strong>{theta}/360 = {theta/360}</strong><div className="basic-ratio-track"><i style={{width:`${theta/360*100}%`}}/></div></div>}
        </aside>
      </div>
      <div className="stage-bottom"><div className="legend-key"><i className="key-green"/>원본의 넓이</div><div className="legend-key"><i className="key-orange"/>둘레·호</div><div className="legend-note">계산식과 그림은 같은 슬라이더 값을 사용합니다.</div></div>
    </section>
  </div>;
}
