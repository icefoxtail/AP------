import type { PointerEvent, KeyboardEvent } from 'react';
import { areParallel, arePerpendicular, distance2, isEqualLength, normalize2, scale2, sub2, type Point2 } from '../geometry-core/math';

export function PointGlyph({point,label,color='#2563eb',onPointerDown,onKeyDown,selected=false}:{point:Point2;label:string;color?:string;selected?:boolean;onPointerDown?:(event:PointerEvent<SVGCircleElement>)=>void;onKeyDown?:(event:KeyboardEvent<SVGCircleElement>)=>void}){
  return <g className="geo-point" aria-label={`점 ${label}`}>
    {selected&&<circle cx={point.x} cy={point.y} r="15" fill={color} opacity=".12"/>}
    <circle cx={point.x} cy={point.y} r="7" fill={color} stroke="white" strokeWidth="2" role={onPointerDown?'slider':undefined} tabIndex={onPointerDown?0:undefined} aria-label={onPointerDown?`점 ${label} 드래그`:undefined} onPointerDown={onPointerDown} onKeyDown={onKeyDown} className={onPointerDown?'geo-point-handle':undefined}/>
    <text x={point.x+9} y={point.y-10} className="geo-point-label">{label}</text>
  </g>;
}

export function SegmentGlyph({a,b,color='#334155',width=3,dash,arrows=false,opacity=1,constructionPath=false}:{a:Point2;b:Point2;color?:string;width?:number;dash?:string;arrows?:boolean;opacity?:number;constructionPath?:boolean}){
  const dir=normalize2(sub2(b,a));
  return <g opacity={opacity}>
    <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={width} strokeDasharray={dash} strokeLinecap="round" vectorEffect="non-scaling-stroke" data-construction-path={constructionPath?"line":undefined}/>
    {arrows&&dir&&<><path d={`M ${b.x-dir.x*13-dir.y*5} ${b.y-dir.y*13+dir.x*5} L ${b.x} ${b.y} L ${b.x-dir.x*13+dir.y*5} ${b.y-dir.y*13-dir.x*5}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/><path d={`M ${a.x+dir.x*13-dir.y*5} ${a.y+dir.y*13+dir.x*5} L ${a.x} ${a.y} L ${a.x+dir.x*13+dir.y*5} ${a.y+dir.y*13-dir.x*5}`} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/></>}
  </g>;
}

export function RightAngleMark({vertex,a,b,size=18,color='#16845f'}:{vertex:Point2;a:Point2;b:Point2;size?:number;color?:string}){
  if(!arePerpendicular(sub2(a,vertex),sub2(b,vertex)))return null;
  const u=normalize2(sub2(a,vertex))!,v=normalize2(sub2(b,vertex))!,p=add(vertex,scale2(u,size)),q=add(add(vertex,scale2(u,size)),scale2(v,size)),r=add(vertex,scale2(v,size));
  return <path d={`M ${p.x} ${p.y} L ${q.x} ${q.y} L ${r.x} ${r.y}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" className="geo-mark"/>;
}
const add=(a:Point2,b:Point2):Point2=>({x:a.x+b.x,y:a.y+b.y});

export function AngleArc({a,vertex,b,radius=24,color='#d97706',label}:{a:Point2;vertex:Point2;b:Point2;radius?:number;color?:string;label?:string}){
  const va=normalize2(sub2(a,vertex)),vb=normalize2(sub2(b,vertex));if(!va||!vb)return null;
  const cross=va.x*vb.y-va.y*vb.x,dot=va.x*vb.x+va.y*vb.y,delta=Math.atan2(cross,dot);
  if(Math.abs(delta)<1e-7||Math.abs(Math.abs(delta)-Math.PI)<1e-7)return null;
  const p=add(vertex,scale2(va,radius)),q=add(vertex,scale2(vb,radius)),mid=delta/2,tx=vertex.x+Math.cos(Math.atan2(va.y,va.x)+mid)*(radius+13),ty=vertex.y+Math.sin(Math.atan2(va.y,va.x)+mid)*(radius+13);
  const degrees=Math.round(Math.abs(delta)*180/Math.PI);
  return <g className="geo-angle"><path d={`M ${p.x} ${p.y} A ${radius} ${radius} 0 0 ${cross>0?1:0} ${q.x} ${q.y}`} fill="none" stroke={color} strokeWidth="2.5" data-angle-degrees={degrees} vectorEffect="non-scaling-stroke"/>{label&&<text x={tx} y={ty} className="geo-angle-label">{label==='auto'?`${degrees}°`:label}</text>}</g>;
}

export function EqualLengthMark({a,b,c,d,color='#16845f',count=1}:{a:Point2;b:Point2;c:Point2;d:Point2;color?:string;count?:number}){
  if(!isEqualLength(distance2(a,b),distance2(c,d)))return null;
  const make=(p:Point2,q:Point2)=>{const u=normalize2(sub2(q,p));if(!u)return null;const n={x:-u.y,y:u.x},m=add(p,scale2(sub2(q,p),.5));return Array.from({length:count},(_,i)=>{const offset=(i-(count-1)/2)*5,center=add(m,scale2(u,offset)),h=5;const t1=add(center,add(scale2(n,-h),scale2(u,-h*.65))),t2=add(center,add(scale2(n,h),scale2(u,h*.65)));return <line key={i} x1={t1.x} y1={t1.y} x2={t2.x} y2={t2.y} stroke={color} strokeWidth="2.4" className="geo-mark" vectorEffect="non-scaling-stroke"/>})};
  return <g className="geo-equality">{make(a,b)}{make(c,d)}</g>;
}

export function ParallelMark({a,b,c,d,color='#2563eb'}:{a:Point2;b:Point2;c:Point2;d:Point2;color?:string}){
  if(!areParallel(sub2(b,a),sub2(d,c)))return null;
  const u=normalize2(sub2(b,a));if(!u)return null;const n={x:-u.y,y:u.x};
  const tick=(p:Point2)=>{const center=add(p,scale2(sub2(b,a),.5)),p1=add(center,add(scale2(u,-5),scale2(n,-6))),p2=add(center,add(scale2(u,5),scale2(n,6)));return <path key={`${p.x}-${p.y}`} d={`M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`} stroke={color} strokeWidth="2.5" fill="none" className="geo-mark" vectorEffect="non-scaling-stroke"/>};
  return <g className="geo-parallel">{tick(a)}{tick(c)}</g>;
}

export function ConstructionArc({center,radius,start,end,color='#d97706',sweep=1}:{center:Point2;radius:number;start:Point2;end:Point2;color?:string;sweep?:0|1}){
  const r=Math.max(0,radius);if(r<=0)return null;
  const a=Math.atan2(start.y-center.y,start.x-center.x),b=Math.atan2(end.y-center.y,end.x-center.x),delta=sweep?((b-a+Math.PI*2)%(Math.PI*2)):((a-b+Math.PI*2)%(Math.PI*2)),large=delta>Math.PI?1:0;
  return <path d={`M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="6 5" opacity=".7" data-construction-path="arc"/>;
}
