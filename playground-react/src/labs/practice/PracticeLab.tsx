import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import katex from 'katex';
import type { PracticeId, PracticeParams } from './catalog';
import { PRACTICE_MODULES } from './modules';
import PracticeCanvas from './PracticeCanvas';

type Mode='original'|'line'|'area';
const renderMath=(s:string)=>katex.renderToString(s,{throwOnError:false,displayMode:true,output:'htmlAndMathml'});
function numericValue(value:string){
  const normalized=value.replaceAll('−','-');
  const piTerms=[...normalized.matchAll(/([+-]?\s*\d+(?:\.\d+)?)\s*π(?:\/(\d+))?/g)];
  let total=piTerms.reduce((sum,m)=>sum+Number(m[1].replace(/\s/g,''))*Math.PI/(Number(m[2])||1),0);
  const residue=normalized.replace(/([+-]?\s*\d+(?:\.\d+)?)\s*π(?:\/(\d+))?/g,' ').match(/[+-]?\s*\d+(?:\.\d+)?/g)||[];
  total+=residue.reduce((sum,n)=>sum+Number(n.replace(/\s/g,'')),0);
  return Math.abs(total);
}

export default function PracticeLab({id}:{id:PracticeId}){
  const module=PRACTICE_MODULES[id],def=module.definition;
  const [variant,setVariant]=useState(def.variants[0].id);
  const [params,setParams]=useState<PracticeParams>(def.initial);
  const [mode,setMode]=useState<Mode>('original');
  const [replay,setReplay]=useState(0),[progress,setProgress]=useState(0);
  const stage=useRef<HTMLDivElement>(null);
  const progressTween=useRef<gsap.core.Timeline|null>(null);
  const result=useMemo(()=>module.calculate(variant,params),[module,variant,params]);
  const controls=def.controls.filter(c=>{
    if(id==='arc')return variant==='arc-isosceles'?c.key==='r'||c.key==='base':variant==='arc-secant3'?c.key==='r'||c.key==='secant':c.key!=='base'&&c.key!=='secant';
    if(id==='sector'&&variant==='sector-ratio-pie')return c.key==='r';
    if(id==='boundary')return variant==='boundary-ring'?c.key==='R'||c.key==='r'||c.key==='theta':c.key==='s';
    if(id==='overlap')return variant==='overlap-nested'?c.key==='R'||c.key==='r':variant==='overlap-baby-circle'?c.key==='R':variant==='overlap-leaf'?c.key==='a'||c.key==='b':c.key==='r';
    if(id==='polygon')return c.key==='r';
    if(id==='rope'&&variant==='rope-triangle')return c.key==='r';
    if(id==='rope'&&variant==='rope-row')return c.key==='r'||c.key==='c';
    if(id==='pizza'&&variant==='pizza-equal')return c.key!=='b';
    if(id==='tether'&&variant==='tether-wall')return c.key==='R';
    if(id==='square'&&variant==='square-rect-quadrant')return c.key==='s'||c.key==='a';
    if(id==='equalarea')return variant==='equalarea-common-part'?c.key==='r':c.key==='a'||c.key==='b';
    return true;
  });
  const chooseVariant=(v:string)=>{setVariant(v);setMode('original');setProgress(0);setReplay(n=>n+1);if(id==='rotate')setParams(before=>({...before,theta:v==='rotate-triangle'?120:90}));if(id==='polygon')setParams(before=>({...before,n:v==='polygon-pent'?5:6}));if(id==='rope')setParams(before=>({...before,rows:v==='rope-row'?1:2}));};
  useLayoutEffect(()=>{setVariant(def.variants[0].id);setParams(def.initial);setMode('original')},[id]);
  useLayoutEffect(()=>{
    if(!stage.current||mode==='original'||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    const ctx=gsap.context(()=>{
      const root=stage.current!;
      const tl=gsap.timeline({defaults:{ease:'power2.out'}});
      if(mode==='line'){
        const paths=[...root.querySelectorAll<SVGGeometryElement>('[data-practice-boundary]')];
        paths.forEach((path,i)=>{let length=0;try{length=path.getTotalLength()}catch{return}tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:.75},i===0?0:'>-=0.12')});
        const conclusions=[...root.querySelectorAll('[data-practice-conclusion]')];
        if(conclusions.length)tl.fromTo(conclusions,{opacity:0,y:14},{opacity:1,y:0,duration:.45},'>-=0.1');
      }else{
        const pieces=[...root.querySelectorAll('[data-practice-piece]')],conclusions=[...root.querySelectorAll('[data-practice-conclusion]')];
        const motion={value:progress};
        progressTween.current=tl.to(motion,{value:1,duration:1.45,ease:'none',onUpdate:()=>setProgress(motion.value)},0);
        if(pieces.length)tl.fromTo(pieces,{opacity:.25,y:22,x:-10},{opacity:1,y:0,x:0,duration:.45,stagger:.08},.22);
        if(conclusions.length)tl.fromTo(conclusions,{opacity:0,y:14},{opacity:1,y:0,duration:.35},1.0);
      }
    },stage);
    return ()=>{ctx.revert();progressTween.current?.kill();};
  },[id,variant,params,mode,replay]);
  const set=(key:string,n:number)=>setParams(before=>{
    const next={...before,[key]:n};
      if(id==='tether'){next.w=Math.min(next.w,next.R);next.h=Math.min(next.h,next.R);if(next.w+next.h<next.R){if(key==='h')next.w=next.R-next.h;else next.h=next.R-next.w}}
    if(id==='overlap'&&key==='r')next.d=Math.min(next.d,2*n-1);
    if(id==='boundary'&&key==='R')next.r=Math.min(next.r,n-1);
    if(id==='square'&&key==='s')next.a=Math.min(next.a,n-1);
    return next;
  });
  const modes:Mode[]=['original',...((result.perimeter||result.boundary)?['line' as const]:[]),...(result.area?['area' as const]:[])];
  const lengthTerms=(result.terms??[]).filter(t=>/호|접선|직선|이동|끈|길이|둘레/.test(t.label));
  const maxLength=Math.max(1,...lengthTerms.map(t=>numericValue(t.value)));
  const setMotionProgress=(n:number)=>{progressTween.current?.kill();setProgress(n)};
  const replayMotion=()=>{progressTween.current?.kill();setProgress(0);setReplay(n=>n+1)};
  return <div className="lab-content">
    <div className="lab-caption"><div><span className="eyebrow">STEP3 실전 구조 · {def.variants.length}개 세부 도형</span><h2>{def.name}</h2></div><p>{def.description}</p></div>
    <div className="shape-grid practice-variants" aria-label="세부 도형 선택">
      {def.variants.map(v=><button type="button" key={v.id} onClick={()=>chooseVariant(v.id)} className={`shape-button ${v.id===variant?'active':''}`} aria-pressed={v.id===variant}>
        <div className="shape-image"><PracticeCanvas id={id} variant={v.id} p={def.initial} mode="original" progress={1}/></div><div><strong>{v.name}</strong><small>STEP3 도형 형태 · 직접 조작</small></div>
      </button>)}
    </div>
    <section className="stage-card practice-stage" ref={stage}>
      <div className="stage-head"><div className="mode-group" role="group" aria-label="관찰 모드">{modes.map(m=><button type="button" key={m} className={`mode-button mode-${m} ${m===mode?'selected':''}`} onClick={()=>{setMode(m);setProgress(0);setReplay(n=>n+1)}} aria-pressed={m===mode}>{m==='original'?'원본 도형':m==='line'?'둘레 · 호':'넓이 분해'}</button>)}</div>
        <div className="stage-actions">{mode!=='original'&&<button type="button" className="replay-button" onClick={replayMotion}>↻ 과정 다시 보기</button>}<span className="stage-chip">STEP3 기하·계산 재구성</span></div></div>
      {mode==='area'&&<div className="motion-scrubber"><label htmlFor={`practice-progress-${id}`}>계산 요소 보기 (일부는 비율을 나타내지 않는 개념도)</label><input id={`practice-progress-${id}`} type="range" min="0" max="100" step="1" value={Math.round(progress*100)} onChange={e=>setMotionProgress(Number(e.target.value)/100)}/><output>{Math.round(progress*100)}%</output><button type="button" className="replay-button" onClick={replayMotion}>▶ 재생</button><span>원본 색칠 영역은 보존하며, 계산 요소 그림은 실제 축척과 구별합니다.</span></div>}
      <div className="sliders-line practice-controls">{controls.map(c=><label className="slider-control" key={c.key}><span>{c.label}</span><input aria-label={c.label} type="range" min={c.min} max={id==='tether'&&(c.key==='w'||c.key==='h')?Math.min(c.max,params.R):c.key==='r'&&id==='boundary'?Math.min(c.max,params.R-1):c.key==='d'&&id==='overlap'?Math.min(c.max,2*params.r-1):id==='square'&&variant==='square-rect-quadrant'&&c.key==='a'?Math.min(c.max,params.s-1):c.max} step={c.step} value={params[c.key]??c.min} onChange={e=>set(c.key,Number(e.target.value))}/><output>{params[c.key]??c.min}{c.unit}</output></label>)}</div>
      <div className="stage-body practice-stage-body">
        <div className="canvas-area"><div className="canvas-label"><span className="canvas-label-dot"/>{mode==='original'?'도형의 원래 구조':mode==='line'?(result.lineLabel??'실제 둘레 경계만 강조'):'넓이 관계 · 원본 색칠 보존'}</div><PracticeCanvas id={id} variant={variant} p={params} mode={mode} progress={progress}/></div>
        <aside className="proof-panel practice-proof" aria-live="polite"><div className="proof-heading"><span className="proof-dot"/><span>{mode==='line'?(result.lineLabel??'실제 경계의 길이'):mode==='area'?'넓이의 합과 차':'계산 원리'}</span></div>
          <div className="practice-formula" data-practice-conclusion dangerouslySetInnerHTML={{__html:renderMath(result.formula)}}/>
          <p className="practice-insight">{result.concept}</p>
          {mode==='line'&&(result.perimeter||result.boundary)&&<div className="answer-line" data-practice-conclusion><span>{result.lineLabel??(result.perimeter?'전체 경계 길이':'호의 길이')}</span><strong>{result.perimeter??result.boundary}</strong></div>}
          {mode==='line'&&lengthTerms.length>1&&<div className="practice-length-bars" aria-label="길이 구간 비율 비교"><strong>경계를 나눈 길이 구간</strong>{lengthTerms.map((term,i)=><div className="practice-length-row" key={`${term.label}-${i}`}><span>{term.label}</span><div><i style={{width:`${Math.max(3,numericValue(term.value)/maxLength*100)}%`}}/></div><b>{term.value}</b></div>)}</div>}
          {mode==='area'&&<div className="practice-pieces">{result.terms?.filter(t=>/넓이|부채꼴|정사각형|고리|렌즈|영역|띠|원 /.test(t.label)).slice(0,4).map((term,i)=><div className={`practice-piece ${term.value.startsWith('−')?'negative':''}`} data-practice-piece key={`${term.label}-${i}`}><span className="practice-piece-sign">{term.value.startsWith('−')?'−':'+'}</span><span>{term.label}</span><b>{term.value}</b></div>)}</div>}
          {mode==='original'&&<div className="summary-stats"><div><span>{result.lineLabel??(result.perimeter?'둘레':result.boundary?'호 길이':'길이')}</span><strong>{result.perimeter??result.boundary??'해당 없음'}</strong></div><div><span>넓이</span><strong>{result.area??'해당 없음'}</strong></div></div>}
          {result.terms&&mode!=='area'&&<div className="practice-ledger">{result.terms.map((t,i)=><div key={`${t.label}-${i}`}><span>{t.label}</span><strong>{t.value}</strong></div>)}</div>}
        </aside>
      </div>
      <div className="stage-bottom"><div className="legend-key"><i className="key-green"/>원본 색칠 넓이</div><div className="legend-key"><i className="key-blue"/>바깥 경계</div><div className="legend-key"><i className="key-orange"/>안쪽 경계·계산 조각</div><div className="legend-note">도형·수식·결과는 같은 슬라이더 값을 사용합니다.</div></div>
    </section>
  </div>;
}
