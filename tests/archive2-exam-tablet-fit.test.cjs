const test=require('node:test');const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');
const html=fs.readFileSync('archive/engine.html','utf8');
const start=html.indexOf('function updateScreenFitScale()'),end=html.indexOf("if (typeof window !==",start),code=html.slice(start,end);
function fixture(width=768,mode='exam',context='archive2'){
  const classes=new Set(),values=new Map(),state={window:{innerWidth:width,screen:{width}},AppState:{mode}};
  state.document={documentElement:{dataset:{archive2Context:context},classList:{remove:n=>classes.delete(n),toggle:(n,on)=>on?classes.add(n):classes.delete(n)},style:{setProperty:(n,v)=>values.set(n,v)}},body:{classList:{contains:()=>true}},getElementById:()=>({querySelector:()=>({offsetWidth:794})})};
  vm.createContext(state);vm.runInContext(code,state);return {state,classes,values,run:()=>state.updateScreenFitScale()};
}
test('only a genuinely shrunken Archive2 exam tablet uses the edge-origin placement',()=>{
  for(const [width,mode,context,expected] of [[768,'exam','archive2',true],[850,'exam','archive2',false],[900,'exam','archive2',false],[390,'exam','archive2',false],[1440,'exam','archive2',false],[768,'sol','archive2',false],[768,'ans','archive2',false],[768,'exam','',false]]){
    const f=fixture(width,mode,context);f.run();assert.equal(f.classes.has('archive2-exam-tablet-shrink'),expected,[width,mode,context].join('/'));
    assert.equal(Number(f.values.get('--screen-page-scale')),Math.max(.32,Math.min(1,Math.max(280,width-16)/794)));
  }
});
test('resize, mode change and leaving screen-fit clear the tablet signal',()=>{
  const f=fixture();f.run();assert.ok(f.classes.size);f.state.window.innerWidth=850;f.state.window.screen.width=850;f.run();assert.equal(f.classes.size,0);
  f.state.window.innerWidth=768;f.state.window.screen.width=768;f.run();assert.ok(f.classes.size);f.state.AppState.mode='sol';f.run();assert.equal(f.classes.size,0);
  f.state.AppState.mode='exam';f.run();f.state.document.body.classList.contains=()=>false;f.run();assert.equal(f.classes.size,0);
});
test('the placement rule is screen-only and changes origin and margins without hiding overflow',()=>{
  const rule=html.match(/@media screen and \(min-width: 641px\) and \(max-width: 900px\)\s*\{\s*html\.archive2-exam-tablet-shrink body\.screen-fit-mode #print-area\s*\{([^}]+)\}/);
  assert.ok(rule);assert.match(rule[1],/margin-left: 8px/);assert.match(rule[1],/transform-origin: top left/);assert.doesNotMatch(rule[1],/overflow|width:|height:|scale\(/);
});
