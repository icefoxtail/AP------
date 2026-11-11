(function(g){
 'use strict';
 const P=say=>({say,...(/\$[^$]+\$/.test(say)?{pin:true}:{})});
 const C=(title,first,second,step)=>({title,length:12,cues:[{at:0,...P(first),step},{at:6,...P(second)}]});
 g.APL_PC_LESSONS={install(scenes,source){
  const lessons={};
  const add=(id,kind,label,title,answer,chapters,options={})=>{
   if(!scenes.some(sc=>sc.id===id)||!source.types(id).includes(kind))throw new Error('Unknown counting source');
   const first=chapters[0];first.start={lpcIntro:0};
   first.cues[0].part=null;first.cues[0].set={lpcKind:kind,lpcQuestion:options.question||source.question(id,kind),lpcConcept:!!options.question,lpcShowAnswer:false};
   first.cues.splice(1,0,{at:.1,to:{lpcIntro:1},dur:2});
   chapters.at(-1).cues[0].set={lpcShowAnswer:!options.question};
   first.cues[0].set.lpcInitial={...first.start,...first.cues[0].set,step:0};
   (lessons[id]||(lessons[id]=[])).push({label,title,tab:'review',answer,summary:'원래 공·격자·배열 그림을 따라 경우를 빠짐없이 세어요.',task:'직접 해 보기에서 조건을 바꾸어 같은 셈 원리를 확인하세요.',chapters});
  };
  for(const build of g.APL_PC_BUILDERS||[])build({add,C,P,source});
  return lessons;
 }};
})(window);
