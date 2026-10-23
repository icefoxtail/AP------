import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';

export function useConstructionTimeline(root:RefObject<HTMLElement|null>,revision:string){
  const timeline=useRef<gsap.core.Timeline|null>(null),[progress,setProgress]=useState(1);
  useLayoutEffect(()=>{
    if(!root.current)return;
    const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx=gsap.context(()=>{
      const elements=[...root.current!.querySelectorAll<SVGGeometryElement>('[data-construction-path]')];
      const tl=gsap.timeline({paused:true,onUpdate:()=>setProgress(tl.progress())});timeline.current=tl;
      for(const [i,element] of elements.entries()){
        let length=0;try{length=element.getTotalLength()}catch{length=0}
        if(length>0)tl.fromTo(element,{strokeDasharray:length,strokeDashoffset:length,opacity:.5},{strokeDashoffset:0,opacity:1,duration:.7,ease:'power1.inOut'},i*.2);
        const step=element.closest<SVGElement>('[data-step]');if(step)tl.fromTo(step,{opacity:0},{opacity:1,duration:.25},i*.2);
      }
      if(reduced){tl.progress(1).pause();setProgress(1)}else{tl.progress(1).pause();setProgress(1)}
    },root);
    return ()=>{ctx.revert();timeline.current=null};
  },[root,revision]);
  const seek=useCallback((value:number)=>{const v=Math.max(0,Math.min(1,value));timeline.current?.pause().progress(v);setProgress(v)},[]);
  const play=useCallback(()=>{if(!timeline.current)return;timeline.current.pause(0).play();},[]);
  return {progress,seek,play,replay:play};
}
