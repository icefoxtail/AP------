import { arc, geometryMath, pi, type Mode, type Params, type ShapeId } from './geometry';

const COLORS=['#e56b36','#dd962d','#178b67'];

function CompareCircle({shape,p}:{shape:ShapeId;p:Params}){
  const m=geometryMath(shape,p);
  const cx=90,cy=90,r=57;
  if(shape==='holes'||shape==='holes3') {
    const n=shape==='holes3'?3:2;
    return <div className="proof-circle-wrap">
      <svg viewBox="0 0 215 160" className="circle-compare" role="img" aria-label="큰 원의 둘레와 두 작은 원 둘레의 합이 서로 같은 길이임을 나타낸 비교 원 2개">
        <circle cx="57" cy="74" r="39" fill="none" stroke="#e2e8f0" strokeWidth="9"/>
        <circle cx="57" cy="74" r="39" fill="none" stroke="#2563eb" strokeWidth="9" data-ring="outer" transform="rotate(-90 57 74)"/>
        <circle cx="158" cy="74" r="39" fill="none" stroke="#e2e8f0" strokeWidth="9"/>
        {Array.from({length:n},(_,i)=><path key={i} d={arc(158,74,39,i*2*Math.PI/n,(i+1)*2*Math.PI/n)} stroke={["#e56b36","#dd962d","#178b67"][i]} strokeWidth="9" fill="none" data-ring="inner"/>)}
        <text x="57" y="137" textAnchor="middle" fontSize="11" fontWeight="800" fill="#2563eb">바깥 원</text>
        <text x="158" y="137" textAnchor="middle" fontSize="11" fontWeight="800" fill="#be7540">작은 원 {n}개 합</text>
      </svg>
      <div className="compare-copy"><strong>안쪽 경계도 모두 포함</strong><span>바깥 한 바퀴와 안쪽 작은 원 {n}개의 길이를 비교합니다.</span></div>
    </div>;
  }
  const total=m.D;
  let start=0;
  return <div className="proof-circle-wrap">
    <svg viewBox="0 0 190 185" className="circle-compare" role="img" aria-label="바깥 반원 호와 안쪽 작은 반원 호를 하나의 원둘레로 대응시킨 그림">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e2e8f0" strokeWidth="10"/>
      <path d={arc(cx,cy,r,Math.PI,2*Math.PI)} stroke="#2563eb" strokeWidth="10" strokeLinecap="round" fill="none" data-ring="outer"/>
      {m.inner.map((d,i)=>{
        const end=start+Math.PI*d/total;
        const path=arc(cx,cy,r,start,end);
        start=end;
        return <path key={i} d={path} stroke={COLORS[i]} strokeWidth="10" strokeLinecap="butt" fill="none" data-ring="inner"/>;
      })}
      <text x="90" y="90" textAnchor="middle" className="ring-title">한 바퀴</text>
      <text x="90" y="105" textAnchor="middle" className="ring-sub">{pi(m.perimeter)} cm</text>
    </svg>
    <div className="compare-copy"><strong>호의 길이를 원둘레에 대응</strong><span>파랑 반 바퀴 + 아래쪽 색 호들의 합 = 한 바퀴</span></div>
  </div>;
}

function LengthBars({shape,p}:{shape:ShapeId;p:Params}) {
  const m=geometryMath(shape,p);
  return <div className="length-bars">
    <div className="bar-info"><span>바깥 큰 {shape==='holes'||shape==='holes3'?'원':'반원'} 경계</span><b>{pi(m.outerArc)} cm</b></div>
    <div className="bar-track"><div className="bar-fill" data-meter="outer" style={{width:'100%',background:'#2563eb'}} /></div>
    <div className="bar-info"><span>안쪽 {shape==='holes'||shape==='holes3'?`작은 원 ${m.inner.length}개`:'작은 반원'} 경계의 합</span><b>{pi(m.innerArc)} cm</b></div>
    <div className="bar-track">
      {m.inner.map((n,i)=><div key={i} className="bar-fill" data-meter="inner" style={{width:`${n/m.D*100}%`,background:COLORS[i]}}/>)}
    </div>
  </div>;
}

function PieceGlyph({kind,ratio}:{kind:'circle'|'semi';ratio:number}){
  const radius=Math.max(11,Math.min(35,35*ratio));
  return <svg viewBox="0 0 90 70" className="piece-glyph" aria-hidden="true">
    {kind==='circle'?<circle cx="45" cy="35" r={radius} fill="currentColor" fillOpacity=".17" stroke="currentColor" strokeWidth="2"/>:
      <path d={`M ${45-radius} 50 A ${radius} ${radius} 0 0 1 ${45+radius} 50 Z`} fill="currentColor" fillOpacity=".17" stroke="currentColor" strokeWidth="2"/>}
  </svg>;
}

function AreaPieces({shape,p}:{shape:ShapeId;p:Params}){
  const m=geometryMath(shape,p);
  return <>
    <p className="proof-subcaption">계산용 조각을 옮겨 세웁니다. <strong>원본의 색칠은 그대로 유지됩니다.</strong></p>
    <div className="area-tiles">
      {m.terms.map((t,i)=>{
        const diameter=i===0?m.D:m.inner[i-1];
        const sign=t.sign==='+'?'+':'−';
        return <div key={i} className={`area-tile ${sign==='+'?'positive':'negative'}`} data-area-piece>
          <div className="area-tile-head"><b>{sign}</b><span>{t.name}</span></div>
          <PieceGlyph kind={shape==='holes'||shape==='holes3'?'circle':'semi'} ratio={diameter/m.D}/>
          <strong>{pi(t.amount)}</strong>
        </div>;
      })}
    </div>
    <div className="area-formula" data-conclusion>
      <span>색칠된 넓이</span><strong>{m.terms.map((t,i)=>(i===0?'':` ${t.sign} `)+pi(t.amount)).join(' ')} = {pi(m.area)} cm²</strong>
    </div>
  </>;
}

export default function ProofPanel({shape,mode,p}:{shape:ShapeId;mode:Mode;p:Params}){
  const m=geometryMath(shape,p);
  return <aside className="proof-panel" aria-live="polite">
    <div className="proof-heading"><span className="proof-dot"/><span>{mode==='line'?'둘레가 같아지는 이유':mode==='area'?'넓이 조각의 더하기 · 빼기':'한눈에 보는 도형 구조'}</span></div>
    {mode==='line'?<>
      <CompareCircle shape={shape} p={p}/>
      <LengthBars shape={shape} p={p}/>
      <div className="answer-line" data-conclusion><span>전체 경계 길이</span><strong>{pi(m.perimeter)} cm</strong></div>
      <p className="insight">{m.perimeterNote}</p>
    </>:mode==='area'?<>
      <AreaPieces shape={shape} p={p}/>
      <p className="insight">색칠 영역과 계산에서 더하는 부분은 다릅니다. +/−는 계산 과정의 기호입니다.</p>
    </>:<>
      <div className="structure-intro"><div className="structure-symbol">◌</div><strong>도형의 실제 색칠 영역만 표시</strong><p>흰 부분은 흰색 그대로 보존했습니다. 둘레는 경계선을, 넓이는 계산용 조각을 따로 살펴봅니다.</p></div>
      <div className="summary-stats"><div><span>전체 둘레</span><strong>{pi(m.perimeter)} cm</strong></div><div><span>색칠 넓이</span><strong>{pi(m.area)} cm²</strong></div></div>
    </>}
  </aside>;
}
