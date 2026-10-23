import { useCallback, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent, KeyboardEvent, RefObject } from 'react';
import type { Point2 } from '../geometry-core/math';

export type PointMap=Record<string,Point2>;
export function clientToSvg(svg:SVGSVGElement,clientX:number,clientY:number):Point2{
  const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;
  const m=svg.getScreenCTM();if(!m)return {x:clientX,y:clientY};
  const local=p.matrixTransform(m.inverse());return {x:local.x,y:local.y};
}

export function useDraggablePoints({svgRef,points,setPoints,snapTo=[],locked=[],constrainPoint}:{svgRef:RefObject<SVGSVGElement|null>;points:PointMap;setPoints:(next:PointMap)=>void;snapTo?:Point2[];locked?:string[];constrainPoint?:(id:string,next:Point2,current:PointMap)=>Point2}){
  const activeId=useRef<string|null>(null),undoStack=useRef<PointMap[]>([]),latestPoints=useRef(points);latestPoints.current=points;
  const pointerDown=useCallback((id:string)=>(e:ReactPointerEvent<SVGCircleElement>)=>{
    if(locked.includes(id))return;
    e.preventDefault();e.stopPropagation();activeId.current=id;undoStack.current.push({...latestPoints.current});
    e.currentTarget.setPointerCapture(e.pointerId);
  },[locked]);
  const pointerMove=useCallback((e:ReactPointerEvent<SVGSVGElement>)=>{
    const id=activeId.current,svg=svgRef.current;if(!id||!svg)return;
    const raw=clientToSvg(svg,e.clientX,e.clientY);let best:Point2|undefined,bestPx=14;
    const moving=latestPoints.current[id];
    for(const target of snapTo){
      if(target===moving)continue;
      const a=svg.createSVGPoint();a.x=raw.x;a.y=raw.y;const client=a.matrixTransform(svg.getScreenCTM()!);
      const b=svg.createSVGPoint();b.x=target.x;b.y=target.y;const snapClient=b.matrixTransform(svg.getScreenCTM()!);
      const px=Math.hypot(client.x-snapClient.x,client.y-snapClient.y);
      if(px<bestPx){bestPx=px;best=target}
    }
    const snapped=best??raw,next=constrainPoint?.(id,snapped,latestPoints.current)??snapped;setPoints({...latestPoints.current,[id]:next});
  },[constrainPoint,setPoints,snapTo,svgRef]);
  const pointerUp=useCallback(()=>{activeId.current=null},[]);
  const keyDown=useCallback((id:string)=>(e:KeyboardEvent<SVGCircleElement>)=>{
    if(locked.includes(id))return;
    const delta=e.shiftKey?10:2;let dx=0,dy=0;
    if(e.key==='ArrowLeft')dx=-delta;else if(e.key==='ArrowRight')dx=delta;else if(e.key==='ArrowUp')dy=-delta;else if(e.key==='ArrowDown')dy=delta;else return;
    e.preventDefault();const p=latestPoints.current[id];setPoints({...latestPoints.current,[id]:{x:p.x+dx,y:p.y+dy}});
  },[locked,setPoints]);
  const undo=useCallback(()=>{const previous=undoStack.current.pop();if(previous)setPoints(previous)},[setPoints]);
  return {pointerDown,pointerMove,pointerUp,keyDown,undo,isDragging:()=>activeId.current!==null};
}
