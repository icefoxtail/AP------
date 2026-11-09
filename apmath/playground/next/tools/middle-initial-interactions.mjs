// Risk-based real UI regression. This supplements (never reduces) the complete
// catalog-driven initial-screen audit. Every attempted action is recorded.
export const INITIAL_INTERACTION_RISKS = {
  'g7-points-lines': ['ck1', 'ck2', 'bs', 'l-ray', 'th', 'm-mid'],
  'g7-parallel': ['p3-3'],
  'g7-spatial': ['s5-3'],
  'g7-area': ['b5-ratio', 'c1-trap', 'c2-frame'],
  'g7-polygons': ['p2-ext', 'p2-star', 'p2-bis', 'p3-given', 'p3-mixed', 'p3-ext360', 'p4-diag', 'p4-join', 'p4-fan'],
  'g7-construction': ['c3-5', 'c5-2', 'c6-2', 'c6-3'],
  'g7-polyhedra': ['p1-3', 'p3-1', 'p3-2', 'p3-3', 'p3-5', 'p3-6', 'p3-8', 'p4-1'],
  'g7-solids': ['s1-3', 's1-5', 's2-5', 's3-5', 's4-2', 's4-3'],
  'g7-surface-volume': ['sv1-1', 'sv2-4', 'sv4-4', 'sv5-6'],
  'g7-circle-sector': ['f1-star', 'f1-ss2', 'f1-lens', 'f1-ex22', 'f1-ring', 'f1-tri', 'f3-leaf-len', '1103', '1105', '1106', '1808', 'lune13', 'z0-arc', 'z0-sector', 'z0-segment', 'z2-sector', 'z2-segment', 'rl-rect', 'rl-tri', 'rl-rtri', 'rl-turn60', 'rl-turn45', 'rl-semi', 'rl-square', 'gt-kennel', 'gt-tri'],
  'g8-triangles': ['t1-3', 't1-6', 't3-1', 't3-3', 't3-4', 't3-6', 't3-7', 't5-1', 't5-2', 't5-3', 't5-5', 't5-6', 't6-1', 't6-5', 't7-1', 't7-4', 't7-5'],
  'g8-quadrilaterals': ['q6-6'],
  'g8-similarity': ['sm1-corr', 'sm1-always', 'sm1-solid', 'sm4-x', 'sm8-proof'],
  'g8-pythagoras': ['py5-hippo', 'py5-semi', 'py5-tree', 'py6-iso', 'py8-quad'],
  'g9-circle': ['c2-2', 'c4-3', 'c4-5', 'c4-6', 'c4-8', 'c5-3', 'c6-8'],
  'g9-trig-ratio': ['cut3060', 'r2-2', 'r5-1', 'solid3DTrig', 'equilFormula', 'rhombusSquare', 'brokenTreeCone', 'sasAcuteLen']
};

export function isProgressControl(label) {
  return /움직여 보기|애니메이션|펼치기|펼쳐|펼친|접기|접어|진행률|분리|굴러간|굴러 가기|움직인 정도|포개기/.test(label);
}

export function progressSamples(unit, sceneId) {
  if(unit==='g7-surface-volume'&&sceneId==='sv4-4')return [
    ['animation-progress-045',.45],['animation-progress-049',.49],['animation-middle',.5],
    ['animation-progress-051',.51],['animation-progress-055',.55],['animation-progress-075',.75],
    ['animation-progress-099',.99],['animation-end',1]
  ];
  return [['animation-middle',.5],['animation-end',1]];
}

export function needsInitialInteractionCheck(unit, scene) {
  return scene.index === 0 || (INITIAL_INTERACTION_RISKS[unit] || []).includes(scene.id);
}

export function missingInteractionRisks(unit, scenes) {
  return (INITIAL_INTERACTION_RISKS[unit] || []).filter(id => !scenes.some(s => s.id === id));
}

// Only inspect state here. Mutations below use the real DOM controls or native
// pointer events. goScene is reserved for a clean entry between distinct tests.
function motionState() {
  const l = window.lab;
  const numbers = Object.fromEntries(Object.entries(l.s).filter(([key, value]) => typeof value === 'number' && Number.isFinite(value) && !['step', 'part'].includes(key)));
  const handles = l.board.handles.filter(h => typeof h.drag === 'function').map(h => ({id:h.id,x:h.x,y:h.y}));
  return {numbers,handles,playing:!!l.s.playing};
}

function changedState(before, after) {
  return Object.keys(before.numbers).some(key => Object.hasOwn(after.numbers,key) && Math.abs(before.numbers[key]-after.numbers[key])>1e-7)
    || before.handles.some(h => after.handles.some(a => a.id===h.id && Math.hypot(a.x-h.x,a.y-h.y)>1));
}

// This exercise deliberately generates a new five-statement question on entry.
// Different diagrams are legitimate only when the new bank, selected statement,
// given conditions and its own initial parameters have all been checked.
export function compareEntryVariant(first, again) {
  const a=first.initialVariant,b=again.initialVariant;
  if(!a&&!b)return {known:false};
  const valid=v=>v?.policy==='spatial-five-statement-question'&&v.bankValid&&v.givenConditionsValid&&v.initialValuesRestored&&v.selectedIndex===0&&v.progress===0&&['spYaw','spPitch'].every(key=>Number.isFinite(v.sharedParams?.[key]));
  if(first.id!=='s2-7'||again.id!=='s2-7'||!valid(a)||!valid(b))return {known:true,pass:false,reason:'question-variant-initial-state-invalid'};
  if(JSON.stringify(a.sharedParams)!==JSON.stringify(b.sharedParams))return {known:true,pass:false,reason:'question-variant-camera-not-restored'};
  if(['zoom','panX','panY'].some(key=>!Number.isFinite(first.projection?.[key])||!Number.isFinite(again.projection?.[key])||Math.abs(first.projection[key]-again.projection[key])>1e-9))return {known:true,pass:false,reason:'question-variant-board-transform-not-restored'};
  return {known:true,pass:true,changed:a.selectedId!==b.selectedId,before:a.selectedId,after:b.selectedId};
}

export function compareInitialParameters(first, again) {
  const variant=compareEntryVariant(first,again);
  if(variant.known&&!variant.pass)return variant;
  if(variant.changed)return {...variant,reason:'verified-new-question-variant'};
  const values=row=>Object.fromEntries(first.declaredControls.map(key=>[key,row.params[key]]));
  return {pass:JSON.stringify(values(first))===JSON.stringify(values(again)),before:values(first),after:values(again)};
}

// Some handles select the closest polygon vertex. A short movement can be a
// valid no-op, so also try destinations across the visible canvas. All attempts
// still go through native pointer events; no scene parameters are assigned.
export function nativeDragDestinations(start, canvas, viewport) {
  const left=Math.max(8,canvas.left+12),right=Math.min(viewport.width-32,canvas.right-12);
  const top=Math.max(8,canvas.top+12),bottom=Math.min(viewport.height-8,canvas.bottom-12);
  const clamp=p=>({x:Math.max(left,Math.min(right,p.x)),y:Math.max(top,Math.min(bottom,p.y))});
  return [[28,-22],[-45,34],[50,20]].map(([dx,dy])=>clamp({x:start.x+dx,y:start.y+dy}))
    .concat([{x:left+(right-left)*0.8,y:top+(bottom-top)*0.45},
      {x:left+(right-left)*0.2,y:top+(bottom-top)*0.55},
      {x:left+(right-left)*0.5,y:top+(bottom-top)*0.8}].map(clamp))
    .filter((p,i,all)=>Math.hypot(p.x-start.x,p.y-start.y)>2&&!all.slice(0,i).some(q=>q.x===p.x&&q.y===p.y));
}

export async function exerciseInitialInteractions({page,unit,scene,first,view,theme,settle,measure,dest,failures,loadDocument}) {
  const record = item => dest.interactions.push({id:scene.id,view:view.name,theme,...item});
  const fail = (reason, detail={}) => failures.push({unit,id:scene.id,view:view.name,theme,reason,...detail});
  const notRun = (state, reason) => dest.notRun.push({id:scene.id,view:view.name,theme,state,reason});
  const enter = async () => { await page.evaluate(i=>lab.goScene(i),first.index);await settle();await page.evaluate(()=>window.scrollTo(0,0)); };
  const actions = () => page.evaluate(()=>(lab._actionBtns||[]).map(({a,b},index)=>({index,id:a.id,label:b.textContent,play:!!a.play,visible:b.checkVisibility()})));
  await enter();
  const play = (await actions()).find(a=>a.visible&&(a.play||a.id==='play'));
  if(play){
    const before=await page.evaluate(motionState);
    await page.locator('.apl-actions-row button').nth(play.index).click();
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForTimeout(260);
    const after=await page.evaluate(motionState),pass=changedState(before,after);
    record({type:'native-play-button',label:play.label,before,after,pass,endpointCoverage:'Native progress-slider end is recorded separately; this action verifies actual time-driven motion.'});
    if(!pass)fail('play-button-does-not-advance-rendered-state');
    // Capture without waiting for a tween to finish, then use the native pause toggle.
    await measure(scene,'playback-moving',true,{live:true});
    if(await page.evaluate(()=>!!lab.s.playing)){
      await page.locator('.apl-actions-row button').nth(play.index).click();
      await settle();
      const stopped=!(await page.evaluate(()=>!!lab.s.playing));
      record({type:'native-pause-button',pass:stopped});if(!stopped)fail('play-button-does-not-pause');
    }
  }else notRun('native-play-button','NOT_APPLICABLE: no visible play action');

  await enter();
  const target=await page.evaluate(()=>{
    const b=lab.board,c=b.canvas,r=c.getBoundingClientRect();
    const occluded=(x,y)=>[...document.querySelectorAll('.apl-tools,.apl-toc-handle')].some(e=>{if(!e.checkVisibility())return false;const z=e.getBoundingClientRect();return x>=z.left&&x<=z.right&&y>=z.top&&y<=z.bottom;});
    return b.handles.filter(h=>typeof h.drag==='function').map(h=>({id:h.id,x:r.left+h.x*r.width/b.W,y:r.top+h.y*r.height/b.H})).find(h=>h.x>=10&&h.x<=innerWidth-10&&h.y>=10&&h.y<=innerHeight-10&&!occluded(h.x,h.y))||null;
  });
  if(target){
    const before=await page.evaluate(motionState),attempts=[];let moved=false;
    const canvas=await page.evaluate(()=>{const r=lab.board.canvas.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};});
    for(const end of nativeDragDestinations(target,canvas,view)){
      const current=await page.evaluate(id=>{const b=lab.board,r=b.canvas.getBoundingClientRect(),h=b.handles.find(x=>x.id===id&&typeof x.drag==='function');return h?{x:r.left+h.x*r.width/b.W,y:r.top+h.y*r.height/b.H}:null;},target.id);
      if(!current)break;
      await page.mouse.move(current.x,current.y);await page.mouse.down();await page.mouse.move(end.x,end.y,{steps:5});await page.mouse.up();
      await settle();const after=await page.evaluate(motionState);
      moved=changedState(before,after);attempts.push({start:current,end,after,changed:moved});if(moved)break;
    }
    record({type:'native-pointer-drag',pointerType:'mouse',handleId:target.id,before,attempts,pass:moved});
    if(!moved)fail('visible-handle-drag-does-not-change-state',{handleId:target.id});
    await measure(scene,'dragged',true);
  }else notRun('native-pointer-drag','NOT_APPLICABLE: no draggable handle in the first viewport');

  if(unit==='g9-circle'&&scene.id==='c6-8'){
    for(const restored of [{name:'invalid',pa:8,pb:2,expected:[2,3]},{name:'valid',pa:4,pb:9,expected:[4,9]}]){
      const url=new URL(page.url());url.searchParams.set('initial-restored-values',restored.name);
      url.hash=new URLSearchParams({s:`${scene.id}@${scene.gi}`,c6pa:String(restored.pa),c6pb:String(restored.pb)}).toString();
      await loadDocument(url.href);await page.evaluate(()=>window.scrollTo(0,0));
      const values=await page.evaluate(()=>{
        const l=window.lab,g=l.scene.ci.model(l.s,{tab:'explore',problem:false}).g;
        return {id:l.scene.id,pa:l.s.c6pa,pb:l.s.c6pb,drawnPa:g.a,drawnPb:g.b,inputPa:+l._ctls.c6pa.input.value,inputPb:+l._ctls.c6pb.input.value,
          outputPa:l._ctls.c6pa.out.textContent,outputPb:l._ctls.c6pb.out.textContent,playing:!!l.s.playing,revealed:!!l.s.revealed,answerOpen:!!l._answerOpen()};
      });
      const pass=values.id===scene.id&&values.pa===restored.expected[0]&&values.pb===restored.expected[1]
        &&values.pa===values.drawnPa&&values.pb===values.drawnPb&&values.inputPa===values.pa&&values.inputPb===values.pb
        &&Number.parseFloat(values.outputPa)===values.pa&&Number.parseFloat(values.outputPb)===values.pb
        &&!values.playing&&!values.revealed&&!values.answerOpen;
      record({type:'native-shared-url-restore',case:restored.name,requested:[restored.pa,restored.pb],expected:restored.expected,...values,pass});
      if(!pass)fail('restored-tangent-secant-conditions-disagree',{case:restored.name,...values});
      await measure(scene,`restored-${restored.name}-initial`,true);
    }
    await enter();
    // Exercise the actual range controls at their ends. Reading the model here
    // is independent of the UI output, so a silent geometry-only clamp fails.
    for(const [name,key]of [['PB','Home'],['PA','End'],['PB','End'],['PA','Home']]){
      await page.getByRole('slider',{name,exact:true}).press(key);await settle();
      await page.evaluate(()=>window.scrollTo(0,0));
      const values=await page.evaluate(()=>{
        const l=window.lab,g=l.scene.ci.model(l.s,{tab:'explore',problem:false}).g;
        return {pa:l.s.c6pa,pb:l.s.c6pb,drawnPa:g.a,drawnPb:g.b,
          inputPa:+l._ctls.c6pa.input.value,inputPb:+l._ctls.c6pb.input.value,
          outputPa:l._ctls.c6pa.out.textContent,outputPb:l._ctls.c6pb.out.textContent};
      });
      const pass=values.pa<values.pb&&values.pa===values.drawnPa&&values.pb===values.drawnPb
        &&values.inputPa===values.pa&&values.inputPb===values.pb
        &&Number.parseFloat(values.outputPa)===values.pa&&Number.parseFloat(values.outputPb)===values.pb;
      record({type:'native-tangent-secant-range',control:name,key,...values,pass});
      if(!pass)fail('tangent-secant-control-and-drawn-length-disagree',{control:name,key,...values});
      await measure(scene,`length-${name.toLowerCase()}-${key.toLowerCase()}`,true);
    }
  }

  if(unit==='g7-circle-sector'&&['f1-star','f1-ring'].includes(scene.id)){
    await enter();
    await page.locator('.apl-presets .apl-chip').filter({hasText:/^둘레$/}).click();
    await settle();await page.evaluate(()=>window.scrollTo(0,0));
    const selected=await page.evaluate(()=>lab.s[lab.scene.csKeys.kmode]===1&&!lab.s.playing);
    record({type:'native-perimeter-preset',pass:selected});
    if(!selected)fail('perimeter-preset-not-selected');
    await measure(scene,'perimeter-selected',true);
    await page.locator('.apl-tab[aria-controls="apl-pane-review"]').click();await settle();
    const count=await page.locator('.apl-steps > .apl-step').count();
    for(let i=0;i<count;i++){
      await page.locator('.apl-steps > .apl-step').nth(i).click();await page.evaluate(()=>window.scrollTo(0,0));
      await measure(scene,`perimeter-review-step-${i+1}`,true);
      const disclosure=await page.evaluate(()=>({step:lab.s.step,mode:lab.s[lab.scene.csKeys.kmode],futureVisible:[...(lab.refs.steps?.children||[])].slice(lab.s.step).filter(e=>e.children[1]?.textContent?.trim()!=='선택하면 이 단계의 풀이가 열립니다.').length}));
      const pass=disclosure.step===i+1&&disclosure.mode===1&&disclosure.futureVisible===0;
      record({type:'native-perimeter-review-step',requested:i+1,total:count,...disclosure,pass});
      if(!pass)fail('perimeter-review-step-or-disclosure-mismatch',{requested:i+1,...disclosure});
    }
  }

  await enter();
  if(first.reviewAvailable){
    let problemBefore=null;
    if(first.problemAvailable){
      await page.locator('.apl-tab[aria-controls="apl-pane-problem"]').click();await settle();
      problemBefore=await page.evaluate(()=>lab.refs.problemText?.textContent?.replace(/\s+/g,' ').trim()||'');
    }
    await page.locator('.apl-tab[aria-controls="apl-pane-review"]').click();await page.evaluate(()=>window.scrollTo(0,0));
    await measure(scene,'review-first',true);
    const count=await page.locator('.apl-steps > .apl-step').count();
    if(count){
      for(let i=0;i<count;i++){
        await page.locator('.apl-steps > .apl-step').nth(i).click();await page.evaluate(()=>window.scrollTo(0,0));
        const obs=await measure(scene,`review-step-${i+1}`,true);
        const disclosure=await page.evaluate(()=>({step:lab.s.step,futureVisible:[...(lab.refs.steps?.children||[])].slice(lab.s.step).filter(e=>e.children[1]?.textContent?.trim()!=='선택하면 이 단계의 풀이가 열립니다.').length}));
        const pass=disclosure.step===i+1&&disclosure.futureVisible===0;
        record({type:'native-review-step',requested:i+1,total:count,actual:disclosure.step,futureVisible:disclosure.futureVisible,pass});
        if(!pass)fail('review-step-or-disclosure-mismatch',{requested:i+1,...disclosure});
      }
      await page.locator('.apl-steps > .apl-step').first().click();await page.evaluate(()=>window.scrollTo(0,0));
      await measure(scene,'review-return-first',true);
    }else notRun('native-review-steps','NOT_APPLICABLE: review tab has no ordered step buttons');
    if(first.problemAvailable){
      await page.locator('.apl-tab[aria-controls="apl-pane-problem"]').click();await page.evaluate(()=>window.scrollTo(0,0));
      const obs=await measure(scene,'problem-after-review',true);
      const problemAfter=await page.evaluate(()=>lab.refs.problemText?.textContent?.replace(/\s+/g,' ').trim()||'');
      const pass=problemBefore===problemAfter;
      record({type:'problem-condition-after-review',sameQuestion:pass,pass});if(!pass)fail('review-changed-original-problem-conditions');
      if(count>1&&(obs.revealed||obs.answerOpen))fail('returning-to-first-review-step-leaves-answer-open');
    }
  }else notRun('native-review-steps','NOT_APPLICABLE: no review tab');

  await enter();
  const reset=await measure(scene,'interaction-reentry',true);
  const same=compareInitialParameters(first,reset).pass;
  const pass=same&&!reset.playing&&!reset.revealed&&!reset.answerOpen;
  record({type:'reentry-after-native-interactions',activeParametersRestored:same,pass});
  if(!pass)fail('native-interactions-leak-into-reentry');
}
