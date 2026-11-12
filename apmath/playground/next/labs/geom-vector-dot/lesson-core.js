/* Native vector figures, immutable source packets, isolated lesson controls. */
(function(global){
  'use strict';
  const active=s=>!!(s&&(s.lessonOn||s.lessonEntry)),copy=x=>JSON.parse(JSON.stringify(x));
  const call=(f,...args)=>typeof f==='function'?f(...args):f;
  let keys=new Set(),drawingState=null;
  const tracked=values=>Object.fromEntries(Object.entries(values||{}).map(([k,v])=>[keys.has(k)?'lvdN_'+k:k,v]));
  const C=(title,a,b,o={})=>({title,length:12,...(o.start?{start:tracked(o.start)}:{}),cues:[
    {at:0,say:a,...(a.includes('$')?{pin:true}:{}),set:{...(o.stage==null?{}:{lvdStage:o.stage}),...tracked(o.set)},reveal:o.show||[]},
    ...(o.move?[{at:.2,to:tracked(o.move),dur:4}]:[]),
    {at:6,say:b,...(b.includes('$')?{pin:true}:{}),set:tracked(o.end),reveal:o.after||[]}
  ]});
  const saved=new WeakMap();
  function restore(b){if(b&&saved.has(b)){Object.assign(b,saved.get(b));saved.delete(b);}}
  function safeLabel(text,s){
    if(text==null)return text;text=String(text);const has=k=>s.lvdLabels.includes(k);
    if(/^θ\s*[≈=]/.test(text)&&!has('angle'))return 'θ';
    if(/^최대 P_max/.test(text)&&!has('max'))return '최대 위치';
    if(/^최소 P_min/.test(text)&&!has('min'))return '최소 위치';
    if(/^최대 P \(PM=/.test(text)&&!has('far'))return '먼 점';
    if(/^최소 P \(PM=/.test(text)&&!has('near'))return '가까운 점';
    return text;
  }
  function nativeFrame(b,s,draw){
    const text=b._text,fill=b.ctx.fillText;
    b._text=function(x,y,t,o,screen){return text.call(this,x,y,this._bbox?t:safeLabel(t,s),o,screen);};
    b.ctx.fillText=function(t,...args){return fill.call(this,b._bbox?t:safeLabel(t,s),...args);};
    try{draw();}finally{b._text=text;b.ctx.fillText=fill;}
  }
  global.APL_VECTORDOT_LESSONS={install(scenes,source){
    keys=new Set(scenes.flatMap(sc=>Object.keys(source.initial(sc.id))));
    const lessons={};
    const add=(id,label,title,answer,chapters,o={})=>{
      const initial=source.initial(id),nums={},sets={};
      for(const[k,v]of Object.entries(initial))(typeof v==='number'?nums:sets)['lvdN_'+k]=v;
      const first=chapters[0];first.start={...nums,lvdAngle:288.130102354156, ...first.start,...tracked(o.start)};
      chapters.forEach((ch,i)=>{ch.cues[0].step=i===chapters.length-1?4:Math.min(i,3);});
      const desired=first.cues[0].set.lvdStage??1;
      first.cues[0].set={...sets,lvdPacket:o.packet||'first',lvdConcept:!!o.concept,lvdTarget:label,lvdQuestion:o.concept?o.question:source.question(id,o.packet),lvdExplore:!!o.concept,lvdLabels:[],lvdShowAnswer:false,...tracked(o.set),...first.cues[0].set,lvdStage:0};
      first.cues[0].part=null;
      first.cues.splice(1,0,{at:.1,set:{lvdStage:desired}});
      const last=chapters.at(-1).cues[0];last.set={...last.set,lvdShowAnswer:true};
      const labels=new Set();for(const ch of chapters)for(const cue of ch.cues){for(const key of cue.reveal||[])labels.add(key);delete cue.reveal;if(cue.say)cue.set={...cue.set,lvdLabels:[...labels]};}
      (lessons[id]||(lessons[id]=[])).push({label,title,tab:'review',answer,answerText:answer,summary:'벡터의 성분과 도형의 관계를 연결해요.',task:'직접 해 보기에서 점과 벡터를 바꾸어 확인해 보세요.',chapters});
    };
    const concept=(id,label,title,answer,question,chapters,o={})=>add(id,label,title,answer,chapters,{...o,concept:true,question});
    for(const build of global.APL_VECTORDOT_LESSON_BUILDERS||[])build({add,concept,C,source});
    for(const[id,list]of Object.entries(lessons)){
      const setKeys=new Set(list.flatMap(l=>l.chapters.flatMap(ch=>ch.cues.flatMap(c=>Object.keys(c.set||{})))));
      for(const l of list){const first=l.chapters[0];for(const k of setKeys)if(!Object.hasOwn(first.cues[0].set,k))throw Error('Missing sibling reset '+id+'/'+k);first.cues[0].set.lvdInitial=copy({...first.start,...first.cues[0].set,step:0,part:null});}
    }
    for(const sc of scenes){
      const raw={question:sc.question,steps:sc.steps,view:sc.view,draw:sc.draw,enter:sc.enter,tick:sc.tick,reviewTop:sc.reviewTop};
      const cur=sc.vary.cur.bind(sc.vary);
      sc.vary.cur=()=>{
        const s=drawingState||global.lab?.s;
        return active(s)&&global.lab?.scene?.id===sc.id?{...source.first(sc.id,s.lvdPacket),lvdAngle:s.lvdAngle}:cur();
      };
      sc.question=(s,lab)=>active(s)?s.lvdQuestion:call(raw.question,s,lab);
      sc.steps=(s,lab)=>active(s)?['조건과 벡터를 확인해요.','도형의 관계를 찾으세요.','식으로 계산해요.','결론을 확인해요.']:call(raw.steps,s,lab);
      sc.reviewTop=(s,lab)=>active(s)?'':call(raw.reviewTop,s,lab);
      sc.view=(s,lab)=>active(s)?{}:call(raw.view,s,lab);
      sc.tick=(s,dt,lab)=>active(s)?false:(raw.tick?.(s,dt,lab)||false);
      sc.enter=(s,lab)=>{restore(lab?.board);raw.enter?.(s,lab);};
      sc.draw=(b,s,v,lab)=>{
        if(!active(s)){restore(b);return raw.draw(b,s,v,lab);}
        const snapshot={...s,...(s.lessonEntry?s.lvdInitial:{})},drawing={...snapshot,step:snapshot.lvdStage,part:null,playing:false};
        for(const key of keys)if(Object.hasOwn(snapshot,'lvdN_'+key))drawing[key]=snapshot['lvdN_'+key];
        if(!saved.has(b))saved.set(b,{focus:copy(b.focus),zoom:b.zoom,panX:b.panX,panY:b.panY,__nq:b.__nq,__ovk:b.__ovk,__axes:b.__axes});
        Object.assign(b,{zoom:1,panX:0,panY:0,__nq:''});
        // Native two-pass label fitting must start from the scene focus rather
        // than the preceding lesson frame, or replay gradually changes zoom.
        b.setFocus(call(sc.focus,drawing),true);
        const shown=Object.create(lab);Object.assign(shown,{tab:drawing.lvdExplore?'explore':'review',s:drawing});
        const previous=drawingState;drawingState=drawing;
        try{nativeFrame(b,drawing,()=>raw.draw(b,drawing,{},shown));}finally{drawingState=previous;}
      };
    }
    return lessons;
  }};
})(window);
