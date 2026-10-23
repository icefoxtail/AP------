import { useRef, useState } from 'react';
import SemisCanvas from './SemisCanvas';
import ProofPanel from './ProofPanel';
import { geometryMath, initialParams, SHAPES, type Mode, type Params, type ShapeId } from './geometry';
import { useProofAnimation } from './useProofAnimation';

const ICONS:Record<ShapeId, string>={
 arch:'M 8 47 A 42 42 0 0 1 92 47 A 16 16 0 0 0 60 47 A 26 26 0 0 0 8 47 Z',
 swirl:'M 8 40 A 42 42 0 0 1 92 40 A 16 16 0 0 1 60 40 A 26 26 0 0 0 8 40 Z',
 holes:'',chain:'M 8 47 A 42 42 0 0 1 92 47 A 12 12 0 0 0 68 47 A 14 14 0 0 0 40 47 A 16 16 0 0 0 8 47 Z'
};
function ShapeThumb({id}:{id:ShapeId}){
  return <svg viewBox="0 0 100 68" aria-hidden="true">
    {id==='holes'?<><circle cx="50" cy="34" r="30" fill="#bcebd7" stroke="#16845f" strokeWidth="2"/><circle cx="35" cy="34" r="15" fill="#fff" stroke="#ea6a35" strokeWidth="2"/><circle cx="65" cy="34" r="15" fill="#fff" stroke="#dd962d" strokeWidth="2"/></>:
      <><path d={ICONS[id]} fill="#bcebd7" stroke="#16845f" strokeWidth="2"/><path d={id==='swirl'?'M 8 40 A 42 42 0 0 1 92 40':'M 8 47 A 42 42 0 0 1 92 47'} fill="none" stroke="#2563eb" strokeWidth="3"/></>}
  </svg>;
}
function Range({label,name,value,min=2,max=12,step=1,onChange}:{label:string;name:keyof Params;value:number;min?:number;max?:number;step?:number;onChange:(name:keyof Params,n:number)=>void}){
  return <label className="slider-control"><span>{label}</span><input aria-label={label} type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(name,Number(e.target.value))}/><output>{value}cm</output></label>;
}

export default function SemicircleLab(){
  const [shape,setShape]=useState<ShapeId>('swirl');
  const [mode,setMode]=useState<Mode>('original');
  const [params,setParams]=useState<Params>(initialParams);
  const [replay,setReplay]=useState(0);
  const stageRef=useRef<HTMLDivElement>(null);
  const formula=geometryMath(shape,params);
  const key=`${shape}/${params.a}/${params.b}/${params.c}/${params.holeD}`;
  useProofAnimation(stageRef,mode,replay,key);
  const change=(name:keyof Params,n:number)=>setParams(before=>({...before,[name]:n}));
  const choose=(id:ShapeId)=>{setShape(id);setMode('original');setReplay(0);};

  return <div className="lab-content">
    <div className="lab-caption"><div><span className="eyebrow">TYPE 01 · 시범 실험실</span><h2>반원 결합 · 태극형</h2></div><p>도형을 선택하고, 선과 면이 어떻게 계산되는지 직접 확인하세요.</p></div>
    <div className="shape-grid" aria-label="세부 도형 선택">
      {SHAPES.map(s=><button type="button" key={s.id} onClick={()=>choose(s.id)} className={`shape-button ${s.id===shape?'active':''}`} aria-pressed={s.id===shape}>
        <div className="shape-image"><ShapeThumb id={s.id}/></div><div><strong>{s.name}</strong><small>{s.caption}</small></div>
      </button>)}
    </div>
    <section className="stage-card" ref={stageRef}>
      <div className="stage-head">
        <div className="mode-group" role="group" aria-label="관찰 모드">
          {([['original','원본 도형'],['line','둘레 · 호'],['area','넓이 분해']] as [Mode,string][]).map(([id,label])=><button type="button" key={id} className={`mode-button mode-${id} ${mode===id?'selected':''}`} onClick={()=>{setMode(id);setReplay(n=>n+1)}} aria-pressed={mode===id}>{label}</button>)}
        </div>
        <div className="stage-actions">{mode!=='original'&&<button type="button" className="replay-button" onClick={()=>setReplay(n=>n+1)} aria-label="시각화 과정을 처음부터 다시 재생">↻ 과정 다시 보기</button>}<span className="stage-chip">직접 움직여 보세요</span></div>
      </div>
      <div className="sliders-line">
        {shape==='holes'?<Range label="큰 원의 지름" name="holeD" min={8} max={20} step={2} value={params.holeD} onChange={change}/>:
          <><Range label="왼쪽 지름 a" name="a" value={params.a} onChange={change}/><Range label="오른쪽 지름 b" name="b" value={params.b} onChange={change}/>{shape==='chain'&&<Range label="세 번째 지름 c" name="c" value={params.c} onChange={change}/>}</>}
        <span className="total-diameter">{shape==='holes'?'큰 원':'전체'} 지름 <b>{formula.D}cm</b></span>
      </div>
      <div className="stage-body">
        <div className="canvas-area"><div className="canvas-label"><span className="canvas-label-dot"/>{mode==='original'?'실제 색칠 영역':mode==='line'?'둘레에 포함되는 선':'원본 색칠 영역 (변경 없음)'}</div><SemisCanvas shape={shape} mode={mode} p={params}/></div>
        <ProofPanel shape={shape} mode={mode} p={params}/>
      </div>
      <div className="stage-bottom"><div className="legend-key"><i className="key-green"/>원본의 색칠 면</div><div className="legend-key"><i className="key-blue"/>바깥 경계</div><div className="legend-key"><i className="key-orange"/>안쪽 경계</div><div className="legend-note">넓이 계산용 +/− 기호는 원본 색칠과 별개입니다.</div></div>
    </section>
  </div>;
}
