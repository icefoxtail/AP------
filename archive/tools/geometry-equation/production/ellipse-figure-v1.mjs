import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';

// A standalone axis-aligned ellipse figure (ellipse-figure-v1): the author states the standard-form
// ellipse and the fact-level points/lines of the stored solution only.  `ellipse_figure.py` derives
// every focus, vertex, mirror point and tangency exactly; this module draws one coordinate plane and
// the figure; `ellipse_figure_observer.py` re-derives the same facts with its own code and reads the
// FINAL SVG back (never the numbers computed here).  A rotated ellipse has no field to be written in,
// and a circle (a == b) or a hyperbola is refused with an explicit code.
export const FIGURE_CAPABILITY='ellipse-figure-v1';
export const MODEL_VERSION='ELLIPSE_FIGURE_MODEL_v1',SPEC_VERSION='ELLIPSE_FIGURE_SPEC_v1',SVG_VERSION='ellipse-figure-svg-v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('ellipse_figure_observer.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const PAD_UNITS=0.75,MARGIN_PX=34,MAX_SCALE=40,MIN_SCALE=8,MAX_PLOT_W=460,MAX_PLOT_H=360;
const FILL={LIGHT:'#eeeeee',MEDIUM:'#d8d8d8',NONE:'none'};
const AXIS_INK='#444';
const STYLE={
  axis:'fill="none" stroke="#444" stroke-width="1.1"',
  axisHead:'fill="#444" stroke="none"',
  curve:'fill="none" stroke="#111" stroke-width="1.7"',
  segment:'fill="none" stroke="#111" stroke-width="1.3"',
  segmentDashed:'fill="none" stroke="#111" stroke-width="1.3" stroke-dasharray="7 5"',
  line:'fill="none" stroke="#111" stroke-width="1.3"',
  point:'fill="#111" stroke="none"'
};
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
const px2=value=>String(Math.round(value*100)/100);
const POINT_ID=/^[A-Z][0-9']?$/;
const ELLIPSE_ID=/^[A-Za-z][A-Za-z0-9_]{0,7}$/;

const TOP_KEYS=['capability','ellipse','ellipses','points','segments','polygons','lines','caption','sourceConditions','newVisualInformation','sourceQuote'];
const ELLIPSE_KEYS=['center','semiAxisSquared','majorAxis'];
const PAIR_ELLIPSE_KEYS=[...ELLIPSE_KEYS,'id'];
const POINT_KEYS=['id','kind','side','end','x','y','branch','of','label','ellipseId'];
const SEGMENT_KEYS=['id','from','to','label','dashed'];
const POLYGON_KEYS=['id','points','fill'];
const LINE_KEYS=['id','slope','intercept','label','tangent','ellipseId'];

function validateEllipse(ellipse,keys){
  onlyKeys(ellipse,keys,'ELLIPSE_PLAN_INVALID');
  if(!Array.isArray(ellipse.center)||ellipse.center.length!==2)bad('ELLIPSE_CENTER_INVALID');
  onlyKeys(ellipse.semiAxisSquared,['major','minor'],'ELLIPSE_AXES_INVALID');
  if(!['X','Y'].includes(ellipse.majorAxis))bad('ELLIPSE_MAJOR_AXIS_UNSUPPORTED');
}

function validatePair(plan){
  if('ellipse' in plan)bad('ELLIPSE_PLAN_INVALID');
  if(!Array.isArray(plan.ellipses)||plan.ellipses.length!==2)bad('ELLIPSE_PAIR_COUNT_INVALID');
  const ids=new Set();
  for(const ellipse of plan.ellipses){
    if(!ellipse||typeof ellipse!=='object'||Array.isArray(ellipse))bad('ELLIPSE_PLAN_INVALID');
    if(typeof ellipse.id!=='string'||!ELLIPSE_ID.test(ellipse.id))bad('ELLIPSE_ELLIPSE_ID_INVALID');
    if(ids.has(ellipse.id))bad('ELLIPSE_ELLIPSE_ID_DUPLICATE');
    ids.add(ellipse.id);
    validateEllipse(ellipse,PAIR_ELLIPSE_KEYS);
  }
  return ids;
}

export function validateEllipseFigurePlan(plan){
  onlyKeys(plan,TOP_KEYS,'ELLIPSE_PLAN_INVALID');
  if(plan.capability!==FIGURE_CAPABILITY)bad('ELLIPSE_PLAN_INVALID');
  const pair='ellipses' in plan;
  const ellipseIds=pair?validatePair(plan):null;
  if(!pair)validateEllipse(plan.ellipse,ELLIPSE_KEYS);
  const points=plan.points??[];
  if(!Array.isArray(points)||points.length>10)bad('ELLIPSE_POINT_INVALID');
  const ids=new Set();
  for(const point of points){
    onlyKeys(point,POINT_KEYS,'ELLIPSE_POINT_INVALID');
    if(typeof point.id!=='string'||!POINT_ID.test(point.id))bad('ELLIPSE_POINT_ID_INVALID');
    if(ids.has(point.id))bad('ELLIPSE_POINT_ID_DUPLICATE');
    ids.add(point.id);
    if(!['FOCUS','VERTEX','ON_ELLIPSE','OPPOSITE','ORIGIN','POINT'].includes(point.kind))bad('ELLIPSE_POINT_INVALID');
    if(point.ellipseId!==undefined){
      if(!pair||!ellipseIds.has(point.ellipseId))bad('ELLIPSE_POINT_ELLIPSE_ID_INVALID');
    }else if(pair&&['FOCUS','VERTEX','ON_ELLIPSE'].includes(point.kind))bad('ELLIPSE_POINT_ELLIPSE_ID_REQUIRED');
  }
  for(const segment of plan.segments??[]){
    onlyKeys(segment,SEGMENT_KEYS,'ELLIPSE_SEGMENT_INVALID');
    if(!ids.has(segment.from)||!ids.has(segment.to)||segment.from===segment.to)bad('ELLIPSE_SEGMENT_INVALID');
  }
  for(const polygon of plan.polygons??[]){
    onlyKeys(polygon,POLYGON_KEYS,'ELLIPSE_POLYGON_INVALID');
    if(!Array.isArray(polygon.points)||polygon.points.length<3||polygon.points.length>6)bad('ELLIPSE_POLYGON_INVALID');
    if(polygon.points.some(id=>!ids.has(id)))bad('ELLIPSE_POLYGON_UNKNOWN_POINT');
  }
  for(const line of plan.lines??[]){
    onlyKeys(line,LINE_KEYS,'ELLIPSE_LINE_INVALID');
    if(line.label!==undefined)bad('ELLIPSE_LINE_LABEL_UNSUPPORTED');
    if(typeof line.slope!=='string'||typeof line.intercept!=='string')bad('ELLIPSE_LINE_INVALID');
    if(line.ellipseId!==undefined&&(!pair||!ellipseIds.has(line.ellipseId)))bad('ELLIPSE_LINE_ELLIPSE_ID_INVALID');
  }
  if(!Array.isArray(plan.sourceConditions))bad('ELLIPSE_PLAN_INVALID');
  if(!Array.isArray(plan.newVisualInformation))bad('ELLIPSE_PLAN_INVALID');
  return plan;
}

export async function solveEllipseFigure(plan){
  validateEllipseFigurePlan(plan);
  let response;
  try{response=await pythonWorker({action:'ellipse',ellipsePlan:plan},{timeoutMs:30000});}
  catch(error){bad('ELLIPSE_MODEL_WORKER_ERROR:'+String(error?.message??error));}
  if(response?.status!=='OK')bad(String(response?.result?.code??'ELLIPSE_MODEL_ERROR'));
  if(response.result?.modelVersion!==MODEL_VERSION)bad('ELLIPSE_MODEL_VERSION_MISMATCH');
  return response.result;
}

// --- layout: one uniform scale on both axes, taken from the exact model ---------------------------------------------------------------
function layoutOf(model){
  const bbox=model.bbox;
  const unitsW=(bbox.maxX-bbox.minX)+2*PAD_UNITS,unitsH=(bbox.maxY-bbox.minY)+2*PAD_UNITS;
  const scale=Math.min(MAX_SCALE,MAX_PLOT_W/unitsW,MAX_PLOT_H/unitsH);
  if(!(scale>=MIN_SCALE))bad('ELLIPSE_FIGURE_TOO_LARGE');
  const width=Math.ceil(unitsW*scale)+2*MARGIN_PX,height=Math.ceil(unitsH*scale)+2*MARGIN_PX;
  const baseX=bbox.minX-PAD_UNITS,baseY=bbox.minY-PAD_UNITS;
  const px=x=>MARGIN_PX+(x-baseX)*scale,py=y=>height-MARGIN_PX-(y-baseY)*scale;
  return {size:{width,height},scale,baseX,baseY,unitsW,unitsH,px,py,
    rect:{x0:px(baseX),y0:py(baseY+unitsH),x1:px(baseX+unitsW),y1:py(baseY)}};
}

export function ellipseFigureSize(model){
  const {size}=layoutOf(model);
  return {...size};
}

const num=value=>Number(value.value);

function clipLine(line,layout){
  const m=Number(line.slope.value),n=Number(line.intercept.value);
  const {baseX,baseY,unitsW,unitsH}=layout;
  const left=baseX,right=baseX+unitsW,bottom=baseY,top=baseY+unitsH;
  const candidates=[];
  const add=(x,y)=>{if(x>=left-1e-9&&x<=right+1e-9&&y>=bottom-1e-9&&y<=top+1e-9)candidates.push([x,y]);};
  add(left,m*left+n);add(right,m*right+n);
  if(Math.abs(m)>1e-12){add((bottom-n)/m,bottom);add((top-n)/m,top);}
  if(candidates.length<2)bad('ELLIPSE_LINE_OUTSIDE_VIEWPORT');
  let best=null;
  for(let i=0;i<candidates.length;i++)for(let j=i+1;j<candidates.length;j++){
    const distance=Math.hypot(candidates[i][0]-candidates[j][0],candidates[i][1]-candidates[j][1]);
    if(!best||distance>best.distance)best={distance,a:candidates[i],b:candidates[j]};
  }
  if(!best||best.distance<1e-6)bad('ELLIPSE_LINE_OUTSIDE_VIEWPORT');
  return best;
}

function ellipseSamples(cx,cy,rx,ry,count=720){
  const rows=[];
  for(let i=0;i<count;i++){
    const theta=i*2*Math.PI/count;
    rows.push([cx+rx*Math.cos(theta),cy+ry*Math.sin(theta)]);
  }
  return rows;
}

// --- labels: a neutral name sits next to its own point and never covers the curve, a segment or another name ----------------------------------
function labelCandidates(point,cx,cy){
  const dx=point.x-cx,dy=point.y-cy;
  const base=Math.abs(dx)+Math.abs(dy)<1e-9?Math.PI/4:Math.atan2(dy,dx);
  const rows=[];
  for(const offset of [0,20,-20,40,-40,65,-65,90,-90,120,-120,150,-150,180]){
    const angle=base+offset*Math.PI/180;
    for(const distance of [10,13,16,20,24,28,32,36,40]){
      rows.push({dx:Math.cos(angle)*distance,dy:Math.sin(angle)*distance,distance});
    }
  }
  return rows;
}

export function placeLabels(entries,layout,obstacles){
  // entries: {key,width,height,anchorX,anchorY,pointX,pointY,role,...}; returns boxes in place.
  const placed=[];
  const placedBoxes=[];const placedPoints=[];const placedLeaders=[];
  const hitsBox=(box,other,gap=2)=>!(box.x+box.width+gap<other.x||other.x+other.width+gap<box.x||box.y+box.height+gap<other.y||other.y+other.height+gap<box.y);
  const pointInBox=(x,y,box,margin=2)=>x>=box.x-margin&&x<=box.x+box.width+margin&&y>=box.y-margin&&y<=box.y+box.height+margin;
  const boxDistance=(x,y,box)=>{
    const dx=Math.max(box.x-x,0,x-(box.x+box.width)),dy=Math.max(box.y-y,0,y-(box.y+box.height));
    return Math.hypot(dx,dy);
  };
  const pointSegmentDistance=(point,a,b)=>{
    const dx=b[0]-a[0],dy=b[1]-a[1],length2=dx*dx+dy*dy||1;
    const t=Math.max(0,Math.min(1,((point[0]-a[0])*dx+(point[1]-a[1])*dy)/length2));
    return Math.hypot(point[0]-(a[0]+t*dx),point[1]-(a[1]+t*dy));
  };
  const nearestBoxPoint=(point,box)=>[
    Math.max(box.x,Math.min(point[0],box.x+box.width)),
    Math.max(box.y,Math.min(point[1],box.y+box.height))];
  const leaderFor=(box,entry)=>{
    if(!entry.requiresLeader)return null;
    const anchor=[entry.pointX,entry.pointY],start=nearestBoxPoint(anchor,box),length=Math.hypot(anchor[0]-start[0],anchor[1]-start[1]);
    if(length<8||length>64)return false;
    const leader={a:start,b:anchor,ownerSegment:entry.ownerSegment};
    const steps=Math.max(2,Math.ceil(Math.max(0,length-3)/2));
    for(let i=0;i<=steps;i++){
      const along=Math.min(length-3,length*i/steps),t=length?along/length:0;
      const x=start[0]+(anchor[0]-start[0])*t,y=start[1]+(anchor[1]-start[1])*t;
      if(obstacles.points.some(point=>Math.hypot(point.x-x,point.y-y)<3.5))return false;
      if(obstacles.curve.some(sample=>Math.hypot(sample[0]-x,sample[1]-y)<2.5))return false;
      for(const segment of obstacles.segments){
        if(pointSegmentDistance([x,y],segment.a,segment.b)<2.5)return false;
      }
      for(const placedBox of placedBoxes){if(pointInBox(x,y,placedBox,1.5))return false;}
      for(const other of placedLeaders){if(pointSegmentDistance([x,y],other.a,other.b)<2.5)return false;}
    }
    // The connector must meet the owner segment only at its midpoint, not run along it.
    if(pointSegmentDistance([start[0]+(anchor[0]-start[0])*Math.max(0,(length-4)/length),
      start[1]+(anchor[1]-start[1])*Math.max(0,(length-4)/length)],entry.ownerSegment.a,entry.ownerSegment.b)<2)return false;
    return leader;
  };
  const blocked=(box,entry)=>{
    if(box.x<4||box.y<4||box.x+box.width>layout.size.width-4||box.y+box.height>layout.size.height-4)return true;
    for(const point of obstacles.points){
      // A point label sits close to its own dot but must still clear the drawn circle.
      const own=!!entry.pointId&&point.key===entry.pointId;
      if(pointInBox(point.x,point.y,box,own?5:3))return true;
    }
    for(const sample of obstacles.curve){if(pointInBox(sample[0],sample[1],box,1.5))return true;}
    for(const segment of obstacles.segments){
      // Dense enough that a box cannot slip between two samples on a long axis.
      const length=Math.hypot(segment.b[0]-segment.a[0],segment.b[1]-segment.a[1]);
      const steps=Math.max(20,Math.ceil(length/2));
      for(let i=0;i<=steps;i++){
        const t=i/steps;
        const x=segment.a[0]+(segment.b[0]-segment.a[0])*t,y=segment.a[1]+(segment.b[1]-segment.a[1])*t;
        if(pointInBox(x,y,box,3.5))return true;
      }
    }
    for(const other of placedBoxes){if(hitsBox(box,other,3))return true;}
    for(const spot of placedPoints){if(pointInBox(spot.x,spot.y,box,2))return true;}
    return false;
  };
  for(const entry of entries){
    let best=null;
    for(const delta of entry.candidates){
      const box={x:r6(entry.centerX+delta.dx-entry.width/2),y:r6(entry.centerY+delta.dy-entry.height/2),width:entry.width,height:entry.height};
      if(blocked(box,entry))continue;
      const leader=leaderFor(box,entry);if(leader===false)continue;
      const clearance=Math.min(...obstacles.points.filter(point=>point.key!==entry.pointId)
        .map(point=>boxDistance(point.x,point.y,box)).concat([40]));
      const score=clearance*0.5-delta.distance*0.15;
      if(!best||score>best.score)best={box,score,leader};
    }
    if(!best)throw new Stop('ELLIPSE_LABEL_NO_ROOM',{label:entry.key});
    placed.push({...entry,box:best.box,leader:best.leader??null});
    placedBoxes.push(best.box);
    placedPoints.push({x:entry.pointX,y:entry.pointY});
    if(best.leader)placedLeaders.push(best.leader);
  }
  return placed;
}

// --- spec and SVG ------------------------------------------------------------------------------------------------------------------------------
export function ellipseFigureSpec(plan,model){
  if(plan?.capability!==FIGURE_CAPABILITY)bad('ELLIPSE_PLAN_INVALID');
  const layout=layoutOf(model);
  const pair=Array.isArray(model.ellipses);
  const shapes=pair?model.ellipses:[{id:null,center:model.center,semiAxis:model.semiAxis,majorAxis:model.majorAxis}];
  const shapeCenter=shape=>({x:layout.px(num(shape.center.x)),y:layout.py(num(shape.center.y))});
  const along=shape=>{
    const A=shape.semiAxis.major.value,B=shape.semiAxis.minor.value;
    return shape.majorAxis==='X'?{x:A,y:B}:{x:B,y:A};
  };
  const center=shapeCenter(shapes[0]);
  const {width,height}=layout.size;
  const prims=[];
  const axisX={x1:r6(layout.rect.x0),y1:r6(layout.py(0)),x2:r6(layout.rect.x1),y2:r6(layout.py(0))};
  const axisY={x1:r6(layout.px(0)),y1:r6(layout.rect.y1),x2:r6(layout.px(0)),y2:r6(layout.rect.y0)};
  prims.push({t:'line',id:'axis-x',role:'axis',cls:'axis',data:{axis:'x'},layer:10,...axisX});
  prims.push({t:'line',id:'axis-y',role:'axis',cls:'axis',data:{axis:'y'},layer:10,...axisY});
  prims.push({t:'polygon',id:'axis-x-head',role:'axis-head',cls:'axisHead',fill:AXIS_INK,layer:11,
    points:[[axisX.x2,axisX.y2],[axisX.x2-9,axisX.y2-3.6],[axisX.x2-9,axisX.y2+3.6]],data:{axis:'x'}});
  prims.push({t:'polygon',id:'axis-y-head',role:'axis-head',cls:'axisHead',fill:AXIS_INK,layer:11,
    points:[[axisY.x2,axisY.y2],[axisY.x2-3.6,axisY.y2+9],[axisY.x2+3.6,axisY.y2+9]],data:{axis:'y'}});
  for(const polygon of plan.polygons??[]){
    const points=polygon.points.map(id=>{
      const point=model.points.find(row=>row.id===id);
      return [layout.px(num(point.x)),layout.py(num(point.y))];
    });
    prims.push({t:'polygon',id:`polygon-${polygon.id}`,role:'polygon',cls:'polygon',layer:20,
      points:points.map(([x,y])=>[r6(x),r6(y)]),fill:FILL[polygon.fill??'LIGHT'],data:{points:polygon.points.join(',')}});
  }
  for(const shape of shapes){
    const sc=shapeCenter(shape),ax=along(shape);
    if(pair){
      prims.push({t:'ellipse',id:`ellipse-${shape.id}`,role:'ellipse',cls:'curve',layer:25,
        cx:r6(sc.x),cy:r6(sc.y),rx:r6(ax.x*layout.scale),ry:r6(ax.y*layout.scale),data:{ellipse:shape.id}});
    }else{
      prims.push({t:'ellipse',id:'ellipse',role:'ellipse',cls:'curve',layer:25,
        cx:r6(sc.x),cy:r6(sc.y),rx:r6(ax.x*layout.scale),ry:r6(ax.y*layout.scale),data:{}});
    }
  }
  const segmentLabelCounts=new Map();
  for(const segment of plan.segments??[])if(segment.label)segmentLabelCounts.set(segment.label,(segmentLabelCounts.get(segment.label)||0)+1);
  for(const segment of plan.segments??[]){
    const from=model.points.find(row=>row.id===segment.from),to=model.points.find(row=>row.id===segment.to);
    prims.push({t:'line',id:`segment-${segment.id}`,role:'segment',cls:segment.dashed?'segmentDashed':'segment',layer:30,
      x1:r6(layout.px(num(from.x))),y1:r6(layout.py(num(from.y))),x2:r6(layout.px(num(to.x))),y2:r6(layout.py(num(to.y))),
      data:{from:segment.from,to:segment.to}});
  }
  for(const line of plan.lines??[]){
    const exact=model.lines.find(row=>row.id===line.id);
    if(!exact)bad('ELLIPSE_LINE_INVALID');
    const clipped=clipLine(exact,layout);
    prims.push({t:'line',id:`line-${line.id}`,role:'line',cls:'line',layer:30,
      x1:r6(layout.px(clipped.a[0])),y1:r6(layout.py(clipped.a[1])),x2:r6(layout.px(clipped.b[0])),y2:r6(layout.py(clipped.b[1])),
      data:{line:line.id}});
  }
  for(const point of model.points){
    prims.push({t:'circle',id:`point-${point.id}`,role:'point',cls:'point',layer:40,
      cx:r6(layout.px(num(point.x))),cy:r6(layout.py(num(point.y))),r:3.2,data:{point:point.id}});
  }
  const labels=[];
  const curve=[];
  for(const shape of shapes){
    const sc=shapeCenter(shape),ax=along(shape);
    curve.push(...ellipseSamples(sc.x,sc.y,ax.x*layout.scale,ax.y*layout.scale));
  }
  const obstacles={points:[],curve,
    segments:prims.filter(prim=>prim.role==='segment').map(prim=>({a:[prim.x1,prim.y1],b:[prim.x2,prim.y2]}))};
  const centerOfPoint=point=>shapeCenter(shapes.find(shape=>shape.id===point.ellipseId)||shapes[0]);
  for(const point of model.points){
    const px=layout.px(num(point.x)),py=layout.py(num(point.y));
    obstacles.points.push({key:point.id,x:px,y:py});
    if(!point.labels)continue;
    const lc=centerOfPoint(point);
    labels.push({key:`point-${point.id}`,role:'point',pointId:point.id,text:point.id,
      pointX:px,pointY:py,centerX:px,centerY:py,candidates:labelCandidates({x:px,y:py},lc.x,lc.y)});
  }
  for(const segment of plan.segments??[]){
    if(!segment.label)continue;
    const from=model.points.find(row=>row.id===segment.from),to=model.points.find(row=>row.id===segment.to);
    const ax=layout.px(num(from.x)),ay=layout.py(num(from.y)),bx=layout.px(num(to.x)),by=layout.py(num(to.y));
    // The primitive is serialized to 0.01 px. Anchor owner leaders to those visible endpoint bytes,
    // so the rendered-layout audit sees the leader touch the owner only at its endpoint.
    const visible=(value)=>Math.round(value*100)/100;
    const va=[visible(ax),visible(ay)],vb=[visible(bx),visible(by)];
    const mx=(va[0]+vb[0])/2,my=(va[1]+vb[1])/2;
    const length=Math.hypot(bx-ax,by-ay)||1;
    const nx=-(by-ay)/length,ny=(bx-ax)/length;
    const candidates=[];
    // The measure sits off the segment. Besides the two normals, the four diagonals are offered so a
    // segment that runs through an axis still finds a place clear of both the segment and the axes.
    const directions=[[nx,ny],[nx,-ny],[-nx,ny],[-nx,-ny],
      [Math.SQRT1_2,Math.SQRT1_2],[Math.SQRT1_2,-Math.SQRT1_2],[-Math.SQRT1_2,Math.SQRT1_2],[-Math.SQRT1_2,-Math.SQRT1_2]];
    for(const [dx,dy] of directions)for(const distance of [10,14,18,22,26,30,36,42]){
      candidates.push({dx:dx*distance,dy:dy*distance,distance});
    }
    labels.push({key:`measure-${segment.id}`,role:'measure',segmentId:segment.id,text:segment.label,
      requiresLeader:segmentLabelCounts.get(segment.label)>1,ownerSegment:{a:va,b:vb},
      pointX:mx,pointY:my,centerX:mx,centerY:my,candidates});
  }
  return {schemaVersion:SPEC_VERSION,size:{width,height},prims,labels,layout:{
    scale:layout.scale,origin:{x:layout.px(0),y:layout.py(0)},rect:layout.rect},model:{majorAxis:model.majorAxis}};
}

function printPrim(prim){
  const data=Object.entries(prim.data??{}).map(([key,value])=>` data-${key}="${esc(value)}"`).join('');
  const head=`id="${prim.id}" data-role="${prim.role}"${data}`,style=STYLE[prim.cls];
  let tag;
  switch(prim.t){
    case 'line':tag=`<line ${head} x1="${px2(prim.x1)}" y1="${px2(prim.y1)}" x2="${px2(prim.x2)}" y2="${px2(prim.y2)}" ${style}/>`;break;
    case 'ellipse':tag=`<ellipse ${head} cx="${px2(prim.cx)}" cy="${px2(prim.cy)}" rx="${px2(prim.rx)}" ry="${px2(prim.ry)}" ${style}/>`;break;
    case 'circle':tag=`<circle ${head} cx="${px2(prim.cx)}" cy="${px2(prim.cy)}" r="${px2(prim.r)}" ${style}/>`;break;
    case 'polygon':tag=`<polygon ${head} points="${prim.points.map(([x,y])=>px2(x)+','+px2(y)).join(' ')}" fill="${prim.fill}" stroke="none"/>`;break;
    default:throw Error('ELLIPSE_PRIMITIVE_UNKNOWN');
  }
  return `<g data-layer="${prim.layer}">${tag}</g>`;
}

export async function renderEllipseSvg({plan,model,identity,typographyPolicy}){
  if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
  const spec=ellipseFigureSpec(plan,model);
  const font=typographyPolicy.baseFontPx,typeset=typesetter(),prepared=[];
  for(const label of spec.labels){
    let fragment;
    try{fragment=typeset({id:label.key,owner:`ellipse-${label.key}`,factRole:'DERIVED_INTERMEDIATE',fontPx:font,
      panelId:'ellipse-figure',kind:'MATH',tex:label.text},identity);}
    catch(error){if(!isDomainCode(error))throw error;throw new Stop('ELLIPSE_TYPESET_ERROR',{labelId:label.key,code:error.message});}
    prepared.push({...label,width:fragment.intrinsic.width,height:fragment.intrinsic.height,fragment});
  }
  const placed=placeLabels(prepared,layoutOf(model),ellipseLabelObstacles(spec));
  const {width,height}=spec.size;
  let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
  for(const prim of [...spec.prims].sort((a,b)=>a.layer-b.layer))body+=printPrim(prim);
  const lineage={planSha256:objectSha(plan),modelSha256:objectSha(model),typographyPolicySha256:objectSha(typographyPolicy),
    specSha256:null,fragmentSha256s:{},svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  lineage.specSha256=objectSha(spec);
  for(const item of placed)if(item.leader){
    body+=`<g data-layer="50"><line id="leader-${item.key}" data-role="leader" data-owner-label="${item.key}" data-owner-segment="${item.segmentId}" data-label="${item.key}" stroke="#555" stroke-width="0.9" fill="none" x1="${r6(item.leader.a[0])}" y1="${r6(item.leader.a[1])}" x2="${r6(item.leader.b[0])}" y2="${r6(item.leader.b[1])}"/></g>`;
  }
  for(const item of placed){
    const box=item.box;
    const extra=item.role==='point'?` data-point="${esc(item.pointId)}"`:` data-segment="${esc(item.segmentId)}"`;
    const role=item.role==='point'?'point':'measure';
    body+=`<g data-layer="90"><g id="${item.key}" data-label-kind="COORDINATE_LABEL" data-label-role="${role}" data-priority="0" data-font-px="${font}" data-owner="ellipse-${item.key}"${extra} data-tex="${esc(item.text)}" data-fragment-sha="${item.fragment.fragmentSha256}" data-box="${r6(box.x)},${r6(box.y)},${r6(box.width)},${r6(box.height)}" transform="translate(${r6(box.x)} ${r6(box.y)})">${item.fragment.svg}</g></g>`;
    lineage.fragmentSha256s[item.key]=item.fragment.fragmentSha256;
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-ellipse-figure="${FIGURE_CAPABILITY}" data-major-axis="${model.majorAxis}" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="6" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
  lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
  return {status:'RENDERED',svg,lineage,spec};
}

export async function auditEllipseSvg({plan,svg}){
  let response;
  try{response=await pythonWorker({ellipsePlan:plan,svg},{script:OBSERVER_SCRIPT,timeoutMs:30000});}
  catch(error){throw new Stop('WORKER_ERROR',{stage:'ellipseAudit',code:String(error?.message??error)});}
  if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'ellipseAudit',code:response?.result?.code??null});
  return response.result;
}

// Every drawn stroke a point name must stay clear of: the curve, the axes, the segments, the tangent
// lines and the polygon edges (the Archive rendered-layout audit reads each of them as geometry).
export function ellipseLabelObstacles(spec){
  const curve=[];
  for(const prim of spec.prims.filter(prim=>prim.role==='ellipse')){
    curve.push(...ellipseSamples(prim.cx,prim.cy,prim.rx,prim.ry));
  }
  const segments=[];
  for(const prim of spec.prims){
    if(prim.role==='segment'||prim.role==='axis'||prim.role==='line')segments.push({a:[prim.x1,prim.y1],b:[prim.x2,prim.y2]});
    if(prim.role==='polygon')prim.points.forEach((start,index)=>{
      const end=prim.points[(index+1)%prim.points.length];segments.push({a:start,b:end});
    });
  }
  return {
    points:spec.prims.filter(prim=>prim.role==='point').map(prim=>({key:prim.data.point,x:prim.cx,y:prim.cy})),
    curve,
    segments
  };
}

export async function composeEllipseFigure({plan,model,identity,typographyPolicy,browser}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,
    svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,
    status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,
    renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    const rendered=await renderEllipseSvg({plan,model,identity,typographyPolicy});
    Object.assign(lineage,rendered.lineage);state.svg=rendered.svg;
    let audit;
    try{audit=await auditEllipseSvg({plan,svg:rendered.svg});}
    catch(error){
      if(!(error instanceof Stop))throw error;
      return outcome('ELLIPSE_FIGURE_STATIC_AUDIT_FAIL',{code:error.status,detail:error.detail});
    }
    lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')return outcome('ELLIPSE_FIGURE_STATIC_AUDIT_FAIL',{errors});
    const {width,height}=rendered.spec.size;
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,rendered.svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}
    finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')return outcome('ELLIPSE_FIGURE_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
