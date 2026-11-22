// A region's value on a leader starts on a dot INSIDE its region (never on the boundary, where it reads as the length of a side or radius). Real renders (Chrome) of a circular
// segment, a sector that overlaps a rectangle, a named sector and a nested region (no spot of its own: refused with its own code); the final SVG is read back:
// the dot is drawn at the leader's start, inside the region and in no other region, and the label stands outside. Run with --test-concurrency=1.
import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import os from 'node:os';import path from 'node:path';
import {renderPlan} from '../production/render-plan.mjs';

const item={sourcePath:'archive/exams/original/middle/m2/1final/20_풍덕중_1학기_기말_중2_수학.js',ordinal:16};
const int=value=>({kind:'integer',value:String(value)});
const node=(id,op,inputs,outputType,args,factRole)=>({id,op,inputs,args,outputType,factRole});
const polar=(id,degrees)=>node(id,'POLAR_POINT',['O','X'],'POINT',{length:int(5),angleDeg:int(degrees),turn:'CCW'},'GIVEN');
const mathPlan={schemaVersion:'construction-spike-v1',realization:{recipeId:'PLANE_FIGURE_v1',unit:'source-length',reflectionEquivalent:false},nodes:[
  node('O','SOURCE_POINT',[],'POINT',{coordinates:[int(0),int(0)]},'GIVEN'),node('X','TRANSLATE_POINT',['O'],'POINT',{dx:int(1),dy:int(0)},'DERIVED_INTERMEDIATE'),
  node('k','CIRCLE_CENTER_RADIUS',['O'],'CIRCLE',{radius:int(5)},'GIVEN'),polar('A',30),polar('B',150),polar('C',210),polar('D',330)]};
const segment=(id,a,b)=>({id,refs:[a,b]});
const plan=(caption,regions,segments)=>({capability:'construction-spike-v1',caption,mathPlan,displayPoints:['O','A','B','C','D'],displayLines:[],displayCircles:['k'],
  displaySegments:segments??[segment('sOA','O','A'),segment('sOB','O','B'),segment('sAB','A','B'),segment('sOC','O','C'),segment('sOD','O','D')],
  coordinateLabels:[],coordinateCanvas:{width:560,height:420},planeMarks:{regions}});
const attr=(tag,name)=>new RegExp('\\s'+name+'="([^"]*)"').exec(tag)?.[1];
const tagOf=(svg,pattern)=>new RegExp(pattern).exec(svg)?.[0];

async function render(name,planeJson){
  const out=fs.mkdtempSync(path.join(os.tmpdir(),'region-inner-'+name+'-'));
  const result=await renderPlan({item:{...item,dir:name},plan:planeJson,outDir:out});
  return {result,svg:result.status==='ARCHIVE_BOUND'?fs.readFileSync(path.join(out,name+'-solution.svg'),'utf8'):null};
}
// the region fill is a path of M/L/A; flatten it into polygons (arcs by 24 steps) only as far as this test needs: inside / outside by even-odd
function regionPolygon(svg,id){
  const d=attr(tagOf(svg,'<path\\s[^>]*id="'+id+'"[^>]*data-role="region"[^>]*>')??tagOf(svg,'<path\\s[^>]*data-role="region"[^>]*id="'+id+'"[^>]*>'),'d');
  const tokens=d.match(/[MLAZ]|-?\d*\.?\d+(?:e[-+]?\d+)?/g);const polygon=[];let i=0,here=null;
  while(i<tokens.length){
    const t=tokens[i];
    if(t==='M'||t==='L'){here=[Number(tokens[i+1]),Number(tokens[i+2])];polygon.push(here);i+=3;}
    else if(t==='A'){
      const [r,,,large,sweep,x,y]=tokens.slice(i+1,i+8).map(Number);const to=[x,y];
      const half=Math.hypot(to[0]-here[0],to[1]-here[1])/2,h=Math.sqrt(Math.max(0,r*r-half*half)),mid=[(here[0]+to[0])/2,(here[1]+to[1])/2];
      const dx=(to[0]-here[0])/(2*half),dy=(to[1]-here[1])/(2*half),sign=(large!==sweep)?1:-1;
      const centre=[mid[0]-sign*h*dy,mid[1]+sign*h*dx];
      const a0=Math.atan2(here[1]-centre[1],here[0]-centre[0]),a1=Math.atan2(to[1]-centre[1],to[0]-centre[0]);
      let total=sweep?((a1-a0)%(2*Math.PI)+2*Math.PI)%(2*Math.PI):-(((a0-a1)%(2*Math.PI)+2*Math.PI)%(2*Math.PI));
      for(let k=1;k<=24;k++)polygon.push([centre[0]+r*Math.cos(a0+total*k/24),centre[1]+r*Math.sin(a0+total*k/24)]);
      here=to;i+=8;
    }else i+=1;
  }
  return polygon;
}
const insidePolygon=(point,polygon)=>{let inside=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const [ax,ay]=polygon[i],[bx,by]=polygon[j];if((ay>point[1])!==(by>point[1])&&point[0]<(bx-ax)*(point[1]-ay)/(by-ay)+ax)inside=!inside;}return inside;};

function checkLeader(svg,regionId,others=[]){
  const label=regionId+'-label';
  const leader=tagOf(svg,'<line\\s[^>]*data-role="leader"[^>]*data-owner-label="'+label+'"[^>]*/>');assert.ok(leader,regionId+': a leader ties the value to its region');
  assert.equal(attr(leader,'data-region-dot'),'1');
  const dot=tagOf(svg,'<circle\\s[^>]*data-role="leader-dot"[^>]*data-owner-label="'+label+'"[^>]*/>');assert.ok(dot,regionId+': the leader starts on a dot');
  const start=[Number(attr(leader,'x1')),Number(attr(leader,'y1'))],end=[Number(attr(leader,'x2')),Number(attr(leader,'y2'))];
  assert.ok(Math.hypot(Number(attr(dot,'cx'))-start[0],Number(attr(dot,'cy'))-start[1])<1e-6);
  const polygon=regionPolygon(svg,regionId);
  assert.ok(insidePolygon(start,polygon),regionId+': the dot lies inside its region');
  assert.ok(!insidePolygon(end,polygon),regionId+': the leader ends outside it');
  for(const other of others)assert.ok(!insidePolygon(start,regionPolygon(svg,other)),regionId+': the dot is in no other region ('+other+')');
  const edges=polygon.map((p,i)=>[p,polygon[(i+1)%polygon.length]]);
  const distance=edges.reduce((best,[a,b])=>{const dx=b[0]-a[0],dy=b[1]-a[1],l2=dx*dx+dy*dy;const t=l2<1e-18?0:Math.max(0,Math.min(1,((start[0]-a[0])*dx+(start[1]-a[1])*dy)/l2));return Math.min(best,Math.hypot(start[0]-a[0]-t*dx,start[1]-a[1]-t*dy));},Infinity);
  assert.ok(distance>=8,regionId+': the dot stands '+distance.toFixed(1)+' px from the boundary');
}

test('a circular segment, a sector that overlaps a rectangle and a named sector: every value leader starts on a dot inside its own region',{timeout:900000},async()=>{
  const segmentPlan=plan('활꼴 AB의 넓이.',[{id:'seg',fill:'LIGHT',label:'25',labelPlacement:'LEADER',shapes:[{sector:{center:'O',from:'A',to:'B',side:'MINOR'}}],holes:[{polygon:['O','A','B']}]}]);
  const first=await render('circle-segment',segmentPlan);assert.equal(first.result.status,'ARCHIVE_BOUND',JSON.stringify(first.result).slice(0,500));checkLeader(first.svg,'seg');
  const overlap=plan('부채꼴 OAB와 직사각형 ABCD가 겹친다.',[
    {id:'sec',fill:'LIGHT',label:'40',labelPlacement:'LEADER',shapes:[{sector:{center:'O',from:'A',to:'B',side:'MINOR'}}]},
    {id:'rect',fill:'MEDIUM',label:'48',labelPlacement:'LEADER',shapes:[{polygon:['A','B','C','D']}]}],
    [segment('sAB','A','B'),segment('sBC','B','C'),segment('sCD','C','D'),segment('sDA','D','A'),segment('sOA','O','A'),segment('sOB','O','B')]);
  const second=await render('sector-rectangle',overlap);assert.equal(second.result.status,'ARCHIVE_BOUND',JSON.stringify(second.result).slice(0,500));
  checkLeader(second.svg,'sec',['rect']);checkLeader(second.svg,'rect',['sec']);
  const named=plan('두 부채꼴의 넓이.',[
    {id:'s1',fill:'LIGHT',label:'8',labelName:'부채꼴 AOB',unit:'cm^2',labelPlacement:'LEADER',shapes:[{sector:{center:'O',from:'A',to:'B',side:'MINOR'}}]},
    {id:'s2',fill:'LIGHT',label:'6',labelPlacement:'AUTO_LEADER',shapes:[{sector:{center:'O',from:'C',to:'D',side:'MINOR'}}]}]);
  const third=await render('two-sectors',named);assert.equal(third.result.status,'ARCHIVE_BOUND',JSON.stringify(third.result).slice(0,500));
  checkLeader(third.svg,'s1');
  assert.equal(tagOf(third.svg,'<line\\s[^>]*data-role="leader"[^>]*data-owner-label="s2-label"[^>]*/>'),undefined,'AUTO_LEADER keeps its value inside when it fits: no leader, no dot');
});

test('a region wholly inside another has no spot of its own: refused with REGION_LEADER_NO_INNER_SPOT, never a boundary start',{timeout:900000},async()=>{
  const nested=plan('부채꼴 OAB와 그 안의 삼각형 OAB.',[
    {id:'sec',fill:'LIGHT',label:'40',labelPlacement:'LEADER',shapes:[{sector:{center:'O',from:'A',to:'B',side:'MINOR'}}]},
    {id:'tri',fill:'MEDIUM',label:'12',labelPlacement:'LEADER',shapes:[{polygon:['O','A','B']}]}]);
  const {result}=await render('nested',nested);
  assert.equal(result.status,'FAILED');assert.equal(result.code,'REGION_LEADER_NO_INNER_SPOT',JSON.stringify(result).slice(0,500));
});
