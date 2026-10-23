import { useLayoutEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import type { Mode } from './geometry';

/** GSAP timeline is scoped and fully reverted on mode, geometry, or replay changes. */
export function useProofAnimation(ref:RefObject<HTMLDivElement|null>,mode:Mode,replay:number,geometryKey:string,onProgress?:(value:number)=>void){
  const timelineRef=useRef<gsap.core.Timeline|null>(null),progressCallback=useRef(onProgress);
  progressCallback.current=onProgress;
  useLayoutEffect(()=>{
    if(!ref.current||mode==='original') return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){progressCallback.current?.(1);return}
    const context=gsap.context(()=>{
      const root=ref.current!;
      let tl!:gsap.core.Timeline;
      tl=gsap.timeline({paused:mode==='area',defaults:{ease:'power2.out'},onUpdate:()=>progressCallback.current?.(tl.progress())});
      timelineRef.current=tl;
      if(mode==='line'){
        const canvasPaths=[...root.querySelectorAll<SVGGeometryElement>('[data-trace]')];
        const circlePaths=[...root.querySelectorAll<SVGGeometryElement>('[data-ring]')];
        for(const [i,path] of canvasPaths.entries()) {
          const length=path.getTotalLength();
          tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:i===0?0.9:0.6},i===0?0:'>-=0.12');
        }
        for(const [i,path] of circlePaths.entries()){
          const length=path.getTotalLength();
          tl.fromTo(path,{strokeDasharray:length,strokeDashoffset:length},{strokeDashoffset:0,duration:i===0?0.85:0.65},i===0?'>-=0.1':'>-=0.08');
        }
        tl.fromTo([...root.querySelectorAll('[data-meter]')],{scaleX:0},{scaleX:1,duration:0.65,stagger:0.15},'>-=0.15');
        tl.fromTo([...root.querySelectorAll('[data-conclusion]')],{opacity:0,y:15},{opacity:1,y:0,duration:0.5},'>-=0.05');
      }else{
        for(const piece of [...root.querySelectorAll<SVGGElement>('[data-area-motion]')]){
          const x=Number(piece.dataset.dx??0),y=Number(piece.dataset.dy??0);
          tl.fromTo(piece,{x:0,y:0,opacity:.35},{x,y,opacity:.95,duration:.95,ease:'power2.inOut'},0);
        }
        tl.fromTo([...root.querySelectorAll('[data-area-piece]')],{opacity:0,y:38,x:-16,rotate:-8},{opacity:1,y:0,x:0,rotate:0,duration:0.65,stagger:0.2},0.1);
        tl.fromTo([...root.querySelectorAll('[data-conclusion]')],{opacity:0,y:20},{opacity:1,y:0,duration:0.35},1.0);
        tl.play(0);
      }
    },ref);
    return ()=>{context.revert();timelineRef.current=null};
  },[ref,mode,replay,geometryKey]);
  return (progress:number)=>{const tl=timelineRef.current;if(tl){tl.pause();tl.progress(Math.max(0,Math.min(1,progress)))}};
}
