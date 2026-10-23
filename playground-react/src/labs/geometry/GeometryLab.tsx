import { useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import PointLinesLesson from '../../geometry-lessons/PointLinesLesson';
import MidpointLesson from '../../geometry-lessons/MidpointLesson';
import AnglesLesson from '../../geometry-lessons/AnglesLesson';
import ConstructionLesson from '../../geometry-lessons/ConstructionLesson';
import ParallelLesson from '../../geometry-lessons/ParallelLesson';
import CongruenceLesson from '../../geometry-lessons/CongruenceLesson';
import SpaceLesson from '../../geometry-lessons/SpaceLesson';
import { Compass, ExternalLink } from 'lucide-react';

const lessons=[
  {id:'lines',title:'점·직선·반직선·선분',goal:'선의 범위와 방향'},
  {id:'midpoint',title:'최단거리·중점·삼등분',goal:'점 이동과 불변량'},
  {id:'angles',title:'각과 맞꼭지각',goal:'각의 크기 관계'},
  {id:'construction',title:'작도와 수선',goal:'나침반 원호·자 작도'},
  {id:'parallel',title:'평행선과 횡단선',goal:'대응각·엇각·동측내각'},
  {id:'congruence',title:'삼각형의 합동',goal:'SSS·SAS·ASA·RHS'},
  {id:'space',title:'공간 위치관계',goal:'교차·평행·꼬인 위치'},
] as const;
type LessonId=typeof lessons[number]['id'];
const questions:Record<LessonId,{question:string;options:string[];answer:number;why:string}>={
  lines:{question:'반직선 AB와 BA가 겹치는 부분은?',options:['직선 AB 전체','선분 AB','공통부분이 없음'],answer:1,why:'두 반직선은 서로 반대 방향으로 뻗으므로 A와 B 사이의 선분만 공유합니다.'},
  midpoint:{question:'선분 AB의 중점 M을 정의하는 조건은?',options:['AM = MB','AM + MB = 2AB','M은 A와 B 바깥에 있음'],answer:0,why:'중점은 선분 위에 있고 양 끝점까지의 거리가 같습니다.'},
  angles:{question:'두 직선의 맞꼭지각 관계는?',options:['항상 크기가 같다','항상 합이 90°','항상 한쪽이 더 큼'],answer:0,why:'각의 두 변이 서로 반대 방향인 맞꼭지각은 크기가 같습니다.'},
  construction:{question:'수직이등분선 위의 점 P에서 항상 성립하는 것은?',options:['PA = PB','PA ⟂ PB','P는 반드시 선분 AB 위에 있음'],answer:0,why:'수직이등분선은 선분의 중점을 수직으로 지나므로 그 위의 점은 양 끝점에서 거리가 같습니다.'},
  parallel:{question:'두 직선이 평행하다는 조건이 확인되지 않으면 엇각이 같다고 결론낼 수 있을까요?',options:['예, 항상 같다','아니요, 평행 조건이 필요하다','직선 길이가 같으면 같다'],answer:1,why:'엇각이 같다는 정리는 두 직선이 평행할 때 적용합니다. 기울기 슬라이더로 조건을 바꾸어 확인할 수 있습니다.'},
  congruence:{question:'한 삼각형을 회전하거나 뒤집으면 합동 관계가 바뀔까요?',options:['바뀌지 않는다','뒤집으면 넓이가 달라진다','회전하면 변 길이가 달라진다'],answer:0,why:'회전과 반사는 길이와 각을 보존하므로 원래 삼각형과 합동입니다.'},
  space:{question:'꼬인 위치의 두 직선은 어떤 관계일까요?',options:['한 평면에서 만난다','평행하다','같은 평면 위에 있지 않고 만나지 않는다'],answer:2,why:'꼬인 위치는 한 평면에 놓이지 않는 두 직선 관계입니다. 3D 모서리를 회전해 겉보기 교차와 구분하세요.'},
};

export default function GeometryLab(){
  const [selected,setSelected]=useState<LessonId>('lines'),[zoom,setZoom]=useState(1),[pan,setPan]=useState({x:0,y:0}),[answer,setAnswer]=useState<number|null>(null),panStart=useRef<{pointerId:number;x:number;y:number;panX:number;panY:number}|null>(null);
  const lesson=lessons.find(x=>x.id===selected)!;
  const startPan=(e:ReactPointerEvent<HTMLDivElement>)=>{const target=e.target;if(!(target instanceof SVGElement)||target.closest('.geo-point-handle,.angle-handle,[data-no-pan]'))return;const svg=target.closest('svg');if(!svg)return;panStart.current={pointerId:e.pointerId,x:e.clientX,y:e.clientY,panX:pan.x,panY:pan.y};svg.setPointerCapture(e.pointerId)};
  const movePan=(e:ReactPointerEvent<HTMLDivElement>)=>{const start=panStart.current;if(!start||start.pointerId!==e.pointerId)return;setPan({x:start.panX+e.clientX-start.x,y:start.panY+e.clientY-start.y})};
  const endPan=(e:ReactPointerEvent<HTMLDivElement>)=>{if(panStart.current?.pointerId===e.pointerId)panStart.current=null};
  const zoomBy=(delta:number)=>setZoom(v=>Math.max(.75,Math.min(1.6,Math.round((v+delta)*100)/100)));
  const boardStyle={'--geometry-zoom':zoom,'--geometry-pan-x':`${pan.x}px`,'--geometry-pan-y':`${pan.y}px`} as CSSProperties;
  return <div className="lab-content geometry-lab">
    <div className="lab-caption"><div><span className="eyebrow">중1 기하 · 직접 조작</span><h2>기본 도형·작도·합동·평행선</h2></div><p>점을 끌어 도형을 바꾸고, 성립하는 관계와 성립하지 않는 반례를 확인합니다.</p></div>
    <div className="geometry-lesson-grid" aria-label="중1 기하 실험 선택">{lessons.map((x,i)=><button key={x.id} type="button" className={`geometry-lesson-card ${selected===x.id?'active':''}`} aria-pressed={selected===x.id} onClick={()=>{setSelected(x.id);setAnswer(null)}}><span>{String(i+1).padStart(2,'0')}</span><strong>{x.title}</strong><small>{x.goal}</small></button>)}</div>
    <section className="stage-card geometry-stage">
      <div className="stage-head"><div><span className="eyebrow"><Compass size={13} aria-hidden="true"/> GEOMETRY BOARD</span><strong>{lesson.title}</strong></div><div className="geometry-view-controls"><button type="button" aria-label="도형 확대" onClick={()=>zoomBy(.1)}>＋</button><output>{Math.round(zoom*100)}%</output><button type="button" aria-label="도형 축소" onClick={()=>zoomBy(-.1)}>−</button><button type="button" onClick={()=>{setZoom(1);setPan({x:0,y:0})}}>보기 초기화</button><a className="geometry-legacy-link" href="/labs/g7/points-lines.html" target="_blank" rel="noreferrer"><ExternalLink size={12} aria-hidden="true"/> 원본 전체 실험</a></div><span className="stage-chip">빈 칠판 드래그 · 확대/축소 · 점 스냅</span></div>
      <div className="geometry-board-viewport" style={boardStyle} onPointerDownCapture={startPan} onPointerMoveCapture={movePan} onPointerUpCapture={endPan} onPointerCancelCapture={endPan} onWheel={e=>{e.preventDefault();zoomBy(e.deltaY<0?.08:-.08)}}>
      {selected==='lines'?<PointLinesLesson/>:selected==='midpoint'?<MidpointLesson/>:selected==='angles'?<AnglesLesson/>:selected==='construction'?<ConstructionLesson/>:selected==='parallel'?<ParallelLesson/>:selected==='congruence'?<CongruenceLesson/>:<SpaceLesson/>}
      </div>
    </section>
    <details className="geometry-hypothesis"><summary>도형을 움직이기 전에 관계를 먼저 예상해 보세요</summary><p>{questions[selected].question}</p><div role="group" aria-label="예상 선택">{questions[selected].options.map((option,i)=><button key={option} type="button" className={answer===i?'selected':''} aria-pressed={answer===i} onClick={()=>setAnswer(i)}>{option}</button>)}</div>{answer!==null&&<p role="status" className={answer===questions[selected].answer?'correct':'incorrect'}>{answer===questions[selected].answer?'맞았습니다.':'다시 도형 조건을 살펴보세요.'} {questions[selected].why}</p>}</details>
  </div>;
}
