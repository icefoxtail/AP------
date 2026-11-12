/* Source packets and deterministic native figures; manual histories stay owned
   by the original lab. No random simulation is substituted for an answer. */
(function(global){
  'use strict';
  const active=s=>!!(s&&(s.lessonOn||s.lessonEntry)),copy=x=>JSON.parse(JSON.stringify(x));
  const call=(value,...args)=>typeof value==='function'?value(...args):value;
  let keys=new Set(),drawingState=null;
  const tracked=x=>Object.fromEntries(Object.entries(x||{}).map(([k,v])=>[keys.has(k)?'lppN_'+k:k,v]));
  const C=(title,a,b,o={})=>({title,length:12,...(o.start?{start:tracked(o.start)}:{}),cues:[
    {at:0,say:a,...(a.includes('$')?{pin:true}:{}),set:{...(o.stage==null?{}:{lppStage:o.stage}),...tracked(o.set)}},
    ...(o.move?[{at:.2,to:tracked(o.move),dur:4}]:[]),
    {at:6,say:b,...(b.includes('$')?{pin:true}:{}),set:tracked(o.end)}
  ]});
  const saved=new WeakMap();
  function restore(b){if(b&&saved.has(b)){Object.assign(b,saved.get(b));saved.delete(b);}}
  global.APL_PROBABILITY_LESSONS={install(scenes,source){
    keys=new Set(Object.keys(source.initial()));
    const lessons={};
    const add=(id,label,title,answer,chapters,o={})=>{
      const nums={},sets={};for(const[k,v]of Object.entries(source.initial()))(typeof v==='number'?nums:sets)['lppN_'+k]=v;
      const first=chapters[0];
      first.start={...nums,lppSeen:0,lppCols:1,lppFill:1,lppTrace:0,lppCondition:0,...first.start,...tracked(o.start)};
      chapters.forEach((ch,i)=>{ch.cues[0].step=i===chapters.length-1?4:Math.min(i,3);});
      const stage=first.cues[0].set.lppStage??1;
      first.cues[0].set={...sets,lppScene:id,lppPacket:o.packet||'first',lppConcept:!!o.concept,lppExplore:!!o.explore,lppQuestion:o.concept?o.question:source.question(id,o.packet),lppGridMode:'auto',lppCounts:false,lppKnown:[],lppMark:false,lppFaces:[],lppInquiryMachine:false,lppShowAnswer:false,...tracked(o.set),...first.cues[0].set,lppStage:0};
      first.cues[0].part=null;first.cues.splice(1,0,{at:.1,set:{lppStage:stage}});
      if(!first.cues.some(c=>c.to)&&id==='grid')first.cues.splice(2,0,{at:.2,to:{lppSeen:6},dur:4});
      if(!first.cues.some(c=>c.to)&&id.startsWith('rep-'))first.cues.splice(2,0,{at:.2,to:{lppCols:2},dur:4});
      const last=chapters.at(-1).cues[0];last.set={...last.set,lppShowAnswer:true};
      (lessons[id]||(lessons[id]=[])).push({label,title,tab:'review',answer,answerText:answer,summary:'조건에 맞는 경우와 전체를 구별해요.',task:'직접 해 보기에서 조건과 시행을 바꾸어 확인해 보세요.',chapters});
    };
    const concept=(id,label,title,answer,question,chapters,o={})=>add(id,label,title,answer,chapters,{...o,concept:true,question});
    for(const build of global.APL_PROBABILITY_LESSON_BUILDERS||[])build({add,concept,C,source});
    for(const[id,list]of Object.entries(lessons)){
      const all=new Set(list.flatMap(l=>l.chapters.flatMap(ch=>ch.cues.flatMap(c=>Object.keys(c.set||{})))));
      for(const l of list){const first=l.chapters[0];for(const key of all)if(!Object.hasOwn(first.cues[0].set,key))throw Error('Missing probability sibling reset '+id+'/'+key);first.cues[0].set.lppInitial=copy({...first.start,...first.cues[0].set,step:0,part:null});}
    }
    for(const sc of scenes){
      const raw={question:sc.question,steps:sc.steps,reviewTop:sc.reviewTop,view:sc.view,draw:sc.draw,enter:sc.enter,tick:sc.tick},cur=sc.vary.cur.bind(sc.vary);
      // The shell builds the destination panel before Player installs its entry cue.
      const owns=s=>active(s)&&s.lppScene===sc.id;
      sc.vary.cur=()=>{const s=drawingState||global.lab?.s;return owns(s)&&global.lab?.scene?.id===sc.id?source.first(sc.id,s.lppPacket):cur();};
      sc.question=(s,lab)=>owns(s)?s.lppQuestion:call(raw.question,s,lab);
      sc.steps=(s,lab)=>owns(s)?['조건과 표본공간을 확인해요.','사건에 맞는 경우를 세어요.','분자와 분모를 연결해요.','결론을 확인해요.']:call(raw.steps,s,lab);
      sc.reviewTop=(s,lab)=>owns(s)?'':call(raw.reviewTop,s,lab);
      sc.view=(s,lab)=>owns(s)?{}:call(raw.view,s,lab);
      sc.tick=(s,dt,lab)=>owns(s)?false:(raw.tick?.(s,dt,lab)||false);
      sc.enter=(s,lab)=>{restore(lab?.board);raw.enter?.(s,lab);};
      sc.draw=(b,s,v,lab)=>{
        if(!owns(s)){restore(b);return raw.draw(b,s,v,lab);}
        const snapshot={...s,...(s.lessonEntry?s.lppInitial:{})},drawing={...snapshot,step:snapshot.lppStage,part:null,playing:false,lppDrawing:true};
        for(const key of keys)if(Object.hasOwn(snapshot,'lppN_'+key))drawing[key]=typeof snapshot['lppN_'+key]==='object'&&snapshot['lppN_'+key]!==null?copy(snapshot['lppN_'+key]):snapshot['lppN_'+key];
        drawing.cndShow=drawing.lppCondition;
        if(!saved.has(b))saved.set(b,{focus:copy(b.focus),zoom:b.zoom,panX:b.panX,panY:b.panY});
        Object.assign(b,{zoom:1,panX:0,panY:0});
        const shown=Object.create(lab);Object.assign(shown,{tab:drawing.lppExplore?'explore':'review',s:drawing});
        const previous=drawingState;drawingState=drawing;
        try{return raw.draw(b,drawing,{},shown);}finally{drawingState=previous;}
      };
    }
    return lessons;
  }};
})(window);
