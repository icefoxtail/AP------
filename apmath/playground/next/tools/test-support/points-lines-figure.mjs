/** Production Board/scene harness. It records geometry, not browser visual PASS. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../../..');
export const sourcePath = 'apmath/playground/next/labs/g7-points-lines/angles.js';
export const plain = value => JSON.parse(JSON.stringify(value));
export const overlap = (a, b, gap = 0) => a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom + gap && a.bottom > b.top - gap;
export function segmentHitsRect(a, b, box, gap = 0) {
  let lo = 0, hi = 1;
  for (const [v, d, min, max] of [[a.x,b.x-a.x,box.left-gap,box.right+gap],[a.y,b.y-a.y,box.top-gap,box.bottom+gap]]) {
    if (Math.abs(d) < 1e-10) { if (v < min || v > max) return false; }
    else { const p = (min-v)/d, q = (max-v)/d; lo = Math.max(lo,Math.min(p,q)); hi = Math.min(hi,Math.max(p,q)); if (lo > hi) return false; }
  }
  return true;
}
export function loadAngles({ ref = null, sourceFile = null } = {}) {
  const el = () => ({ dataset:{},style:{setProperty(){}},classList:{add(){},remove(){},toggle(){}},append(){},setAttribute(){},addEventListener(){} });
  const document = {getElementById:()=>null,createElement:el,createTextNode:text=>({textContent:text}),addEventListener(){},documentElement:el(),head:el()};
  const scope = {document,console,Math,URLSearchParams,performance,setTimeout,clearTimeout,requestAnimationFrame:()=>0,cancelAnimationFrame(){},devicePixelRatio:1,
    location:{search:'',hash:'',pathname:'/labs/g7-points-lines.html'},localStorage:{getItem:()=>null,setItem(){}},
    getComputedStyle:()=>({getPropertyValue:k=>k==='--font-ui'?'sans-serif':k==='--m-glow'?'0':'#111111'}),matchMedia:()=>({matches:false}),addEventListener(){}};
  scope.window=scope;const context=vm.createContext(scope);
  for(const name of ['apl-core.js','apl-board.js','apl-shell.js'])vm.runInContext(fs.readFileSync(path.join(root,'apmath/playground/next/kit',name),'utf8'),context,{filename:name});
  const source = sourceFile ? fs.readFileSync(sourceFile,'utf8') : ref ? execFileSync('git',['show',`${ref}:${sourcePath}`],{cwd:root,encoding:'utf8'}) : fs.readFileSync(path.join(root,sourcePath),'utf8');
  vm.runInContext(source,context,{filename:sourcePath});
  const scenes=context.APL_PL_GROUPS.flatMap(g=>g.scenes);
  function create(id,W=360,H=387,bottom=60,right=0) {
    const stack=[],state={globalAlpha:1,font:'16px sans-serif',textAlign:'center',textBaseline:'middle'};
    state.measureText=text=>{const size=Number(/([\d.]+)px/.exec(state.font)?.[1]||16);return {width:[...String(text)].reduce((sum,ch)=>sum+size*(ch.charCodeAt(0)>=0x1100?1:.6),0)}};
    state.save=()=>stack.push({...state});state.restore=()=>Object.assign(state,stack.pop()||{});
    const ctx=new Proxy(state,{get:(t,k)=>k in t?t[k]:(...args)=>{for(const arg of args)if(typeof arg==='number')assert.ok(Number.isFinite(arg),`${String(k)} finite coordinates`);}});
    const board=new context.APLab.Board({width:W,height:H,getContext:()=>ctx},{kind:'figure',pad:.02,interactive:false});board.resize(W,H);board.setInsets({top:0,right,bottom,left:0});board.setFocus({x:[-5,5],y:[-4,4]},true);
    const scene=scenes.find(s=>s.id===id);assert.ok(scene,id);
    const lab={scene,board,tab:'explore',s:{step:1,revealed:false,playing:false},params:{},refs:{},invalidate(){},_buildReview(){}};
    lab._measureFocus=context.APLab.Lab.prototype._measureFocus;
    scene.enter(lab.s,lab);board.setFocus(scene.focus(lab.s),true);
    const records={circles:[],segments:[],polygons:[],arcs:[],labels:[]};
    const screen=p=>board.toS(p[0]??p.x,p[1]??p.y);
    for(const method of ['circle','seg','poly','arc']) {
      const original=board[method];board[method]=function(...args){
        if(!this._bbox){
          if(method==='circle')records.circles.push({world:plain(args[0]),at:screen(args[0]),radius:args[1]*this.k,options:plain(args[2]||{})});
          else if(method==='seg')records.segments.push({from:screen(args[0]),to:screen(args[1]),options:plain(args[2]||{})});
          else if(method==='poly')records.polygons.push({points:args[0].map(screen),world:plain(args[0]),options:plain(args[1]||{})});
          else records.arcs.push({at:screen(args[0]),radius:args[1]*this.k,start:args[2],end:args[3],options:plain(args[4]||{})});
        }
        return original.apply(this,args);
      };
    }
    const text=board._text;board._text=function(x,y,value,o={},...rest){
      if(!this._bbox && value!=null && String(value)!==''){
        const size=this.annotationSize(value,o);const align=o.align||'center';const left=align==='left'?x-3:align==='right'?x-size.width+3:x-size.width/2;
        records.labels.push({text:String(value),x,y,options:plain(o),box:{left,right:left+size.width,top:y-size.height/2,bottom:y+size.height/2}});
      }
      return text.call(this,x,y,value,o,...rest);
    };
    lab.draw=(tab='explore',step=1,height=H)=>{lab.tab=tab;lab.s.step=step;board.resize(W,height);const value=scene.view(lab.s,lab);Object.values(records).forEach(a=>a.length=0);board.begin();scene.draw(board,lab.s,value,lab);board.end();return {...plain(records),W,H:board.H,bottom:board.insets.bottom,focus:plain(board.focus),value:plain(value),handles:board.handles.map(h=>({id:h.id,x:h.x,y:h.y,draggable:typeof h.drag==='function'}))};};
    return lab;
  }
  return {scenes,create};
}
