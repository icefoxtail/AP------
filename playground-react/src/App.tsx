import { useState } from 'react';
import TypeCards from './components/TypeCards';
import { LAB_TYPES, type LabId } from './data/types';
import SemicircleLab from './labs/semis/SemicircleLab';

export default function App(){
  const [layout,setLayout]=useState<'overview'|'lab'>('lab');
  const [selected,setSelected]=useState<LabId>('semis');
  const selectedLab=LAB_TYPES.find(t=>t.id===selected)!;
  const pick=(id:LabId)=>{setSelected(id);setLayout('lab');window.scrollTo({top:0,behavior:'smooth'});};
  return <>
    <header className="site-header">
      <div className="brand-lockup"><span className="brand-mark">AP<span>·</span></span><div className="brand-title"><span>AP MATH PLAYGROUND <em>중1</em></span><h1>원과 부채꼴</h1></div></div>
      <nav className="header-actions" aria-label="페이지 이동">
        <div className="layout-switch"><button type="button" className={layout==='overview'?'on':''} onClick={()=>setLayout('overview')}>전체 유형</button><button type="button" className={layout==='lab'?'on':''} onClick={()=>setLayout('lab')}>실험실</button></div>
        <a className="basic-link" href="./circle-sectors-basic.html" target="_blank" rel="noopener noreferrer">기초 개념 실험실 ↗</a>
      </nav>
    </header>
    <div className="page-wrap">
      {layout==='overview'?<>
        <div className="overview-hero"><div><span className="eyebrow">EXPLORE THE GEOMETRY</span><h2>그림으로 고르고,<br/>움직여서 이해하는 수학</h2><p>도형을 선택하면 해당 둘레·넓이 실험실로 이동합니다. 구현된 유형부터 순차적으로 연결합니다.</p></div><div className="hero-symbol"><svg viewBox="0 0 220 180" aria-hidden="true"><path d="M17 130 A89 89 0 0 1 195 130 A36 36 0 0 1 123 130 A53 53 0 0 0 17 130 Z" fill="#c5ebd9" stroke="#16845f" strokeWidth="2.5"/><path d="M17 130 A89 89 0 0 1 195 130" fill="none" stroke="#2563eb" strokeWidth="6"/><path d="M17 130 A53 53 0 0 1 123 130" fill="none" stroke="#eb6a34" strokeWidth="5"/><path d="M123 130 A36 36 0 0 0 195 130" fill="none" stroke="#f0ad43" strokeWidth="5"/></svg></div></div>
        <div className="section-heading"><div><span className="eyebrow">GEOMETRY CATALOG</span><h3>도형 유형 살펴보기 <span>{LAB_TYPES.length}개 유형</span></h3></div><p>연결 예정 카드도 모양을 미리 살펴볼 수 있습니다.</p></div>
        <TypeCards types={LAB_TYPES} selected={selected} onPick={pick}/>
        <div className="basics-banner"><span className="basics-icon">◎</span><div><strong>원의 둘레·넓이부터 복습할까요?</strong><p>기존 기초 개념 실험실 5개를 그대로 이용할 수 있습니다.</p></div><a href="./circle-sectors-basic.html" target="_blank" rel="noopener noreferrer">기초 실험실 열기 ↗</a></div>
      </>:<>
        <div className="breadline"><button type="button" onClick={()=>setLayout('overview')}>원과 부채꼴 전체</button><span>›</span><strong>{selectedLab.name}</strong><span className="bread-pill">{selectedLab.implemented?'인터랙티브 실험':'미연결 유형'}</span></div>
        <div className="workspace">
          <aside className="type-sidebar"><div className="sidebar-heading"><div><span className="eyebrow">EXPLORE TYPES</span><strong>도형 유형 <span>{LAB_TYPES.length}</span></strong></div><button onClick={()=>setLayout('overview')} title="전체 유형 카드 보기">전체 보기 ↗</button></div><TypeCards types={LAB_TYPES} selected={selected} onPick={pick} compact/></aside>
          <main className="main-content">
            {selected==='semis'?<SemicircleLab/>:<div className="coming-card"><div className="coming-icon">◌</div><span className="eyebrow">COMING NEXT</span><h2>{selectedLab.number}. {selectedLab.name}</h2><p>카드 디자인만 연결된 상태입니다. 기존 실전 도형 코드를 이 유형 모듈로 옮기는 작업이 남아 있습니다.</p><button type="button" className="primary-button" onClick={()=>pick('semis')}>작동하는 반원 실험실로 이동 →</button></div>}
          </main>
        </div>
      </>}
      <footer className="site-footer"><span>AP Math Playground · 원과 부채꼴</span><span>반원 결합형 React + GSAP 시범판 · 다른 유형은 순차 연결</span></footer>
    </div>
  </>;
}
