import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';
import { gsap } from 'gsap';
import type { Mode } from './geometry';

/** GSAP timeline is scoped and fully reverted on mode, geometry, or replay changes. */
export function useProofAnimation(ref:RefObject<HTMLDivElement|null>,mode:Mode,replay:number,geometryKey:string){
  useLayoutEffect(()=>{
    if(!ref.current||mode==='original') return;
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context=gsap.context(()=>{
      const root=ref.current!;
      const tl=gsap.timeline({defaults:{ease:'power2.out'}});
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
        tl.fromTo(root.querySelectorAll('[data-meter]'),{scaleX:0},{scaleX:1,duration:0.65,stagger:0.15},'>-=0.15');
        tl.fromTo(root.querySelectorAll('[data-conclusion]'),{opacity:0,y:15},{opacity:1,y:0,duration:0.5},'>-=0.05');
      }else{
        tl.fromTo(root.querySelectorAll('[data-area-piece]'),{opacity:0,y:38,x:-16,rotate:-8},{opacity:1,y:0,x:0,rotate:0,duration:0.65,stagger:0.2},0.1);
        tl.fromTo(root.querySelectorAll('[data-conclusion]'),{opacity:0,y:20},{opacity:1,y:0,duration:0.5},'>-=0.04');
      }
    },ref);
    return ()=>context.revert();
  },[ref,mode,replay,geometryKey]);
}
