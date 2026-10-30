import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {Stop,isDomainCode,esc,overlaps} from './quadratic-inequality-chain-v1.mjs';

// A standalone "vessel filled with water" figure (container-fill-figure-v1): one to three rows, each a vessel (a stack of cylinders and cone frusta on one
// vertical axis, drawn as its cross-section) beside the graph of the water height against time when water is poured in at a constant rate. The author gives
// only the vessel profile (radius / height of each piece, bottom to top); the engine derives the graph itself: for a constant inflow the time to reach height h is
// proportional to the volume below h, t(h) = pi * integral of r(z)^2 dz / flow, computed exactly (rational arithmetic) at every piece boundary and sampled
// densely inside a frustum. A cylinder piece is a straight segment, a widening frustum bends the curve flatter and flatter, a narrowing one steeper and steeper,
// and the kink where two pieces meet sits at the height of the boundary. The vessel and the graph share one vertical scale, so a dotted guide at a piece
// boundary runs level from the vessel to its kink. container_fill_observer.py re-derives the profile, the volumes and the curve from the same plan with its own
// code and checks the final SVG bytes (the engine's own numbers are never trusted).
export const FIGURE_CAPABILITY='container-fill-figure-v1';
export const MODEL_VERSION='CONTAINER_FILL_MODEL_v1',SPEC_VERSION='CONTAINER_FILL_SPEC_v1',SVG_VERSION='container-fill-svg-v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('container-fill-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};

// --- exact numbers: rationals [n,d] (BigInt, d>0, reduced) ---------------------------------------------------------------------------------
const gcdB=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
const Q=(n,d=1n)=>{if(d<0n){n=-n;d=-d;}const g=gcdB(n,d)||1n;return [n/g,d/g];};
const ZERO=Q(0n);
const qadd=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]),qsub=(a,b)=>Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]),qmul=(a,b)=>Q(a[0]*b[0],a[1]*b[1]),qdiv=(a,b)=>Q(a[0]*b[1],a[1]*b[0]);
const qcmp=(a,b)=>{const x=a[0]*b[1]-b[0]*a[1];return x<0n?-1:x>0n?1:0;};
const qnum=a=>Number(a[0])/Number(a[1]);
function parseQ(raw,code){
  const text=typeof raw==='number'&&Number.isSafeInteger(raw)?String(raw):raw;
  if(typeof text!=='string')bad(code);
  let m=/^(-?)(\d{1,12})(?:\.(\d{1,6}))?$/.exec(text);
  if(m){const frac=m[3]??'',n=BigInt(m[2]+frac),d=10n**BigInt(frac.length);return Q(m[1]?-n:n,d);}
  m=/^(-?)(\d{1,12})\/(\d{1,12})$/.exec(text);
  if(m&&BigInt(m[3])!==0n)return Q(m[1]?-BigInt(m[2]):BigInt(m[2]),BigInt(m[3]));
  return bad(code);
}
function decimalOf(a){
  let d=a[1],twos=0,fives=0;
  while(d%2n===0n){d/=2n;twos++;}while(d%5n===0n){d/=5n;fives++;}
  if(d!==1n)return null;
  const k=Math.max(twos,fives),n=a[0]*10n**BigInt(k)/a[1],neg=n<0n,abs=(neg?-n:n).toString().padStart(k+1,'0');
  return (neg?'-':'')+(k?abs.slice(0,-k)+'.'+abs.slice(-k):abs);
}
const qstr=a=>decimalOf(a)??`${a[0]}/${a[1]}`;
const qtex=a=>decimalOf(a)??`${a[0]<0n?'-':''}\\frac{${a[0]<0n?-a[0]:a[0]}}{${a[1]}}`;
const P=text=>parseQ(text,'CONTAINER_MODEL_NUMBER_INVALID'),N=text=>qnum(P(text));
const shortText=(v,code,max)=>{if(typeof v!=='string'||v.length<1||v.length>max||/[\u0000-\u001f<>&"\\]/.test(v))bad(code);return v;};
const titleText=(v,code,fallback)=>v===undefined?fallback:shortText(v,code,14);

// --- solving: the exact model ---------------------------------------------------------------------------------------------------------------
const MAX_PAIRS=3,MAX_PIECES=4,MAX_TICKS=6;
// Keys that would make a vessel lopsided or tilted: refused by name so the author learns the vessel must be a solid of revolution about one vertical axis.
const ASYMMETRIC_KEYS=['offset','xOffset','tilt','slant','axis','center','centre','shear','side','angle'];
// Pieces with a curved wall (a sphere, a hemisphere, a bulb): the cross-section area is not a polynomial of the height the engine integrates.
const CURVED_KINDS=['SPHERE','HEMISPHERE','SPHERICAL_SEGMENT','ELLIPSOID','PARABOLOID','CURVED','BULB','CONE_FRUSTUM_CURVED'];
const dimension=raw=>{const q=parseQ(raw,'CONTAINER_DIMENSION_INVALID');if(qcmp(q,ZERO)<=0)bad('CONTAINER_DIMENSION_INVALID');return q;};
function parsePiece(piece,index){
  if(!isPlain(piece))bad('CONTAINER_PROFILE_INVALID');
  if(Object.keys(piece).some(key=>ASYMMETRIC_KEYS.includes(key)))bad('CONTAINER_ASYMMETRIC_UNSUPPORTED');
  if(typeof piece.kind!=='string')bad('CONTAINER_PROFILE_INVALID');
  if(CURVED_KINDS.includes(piece.kind))bad('CONTAINER_CURVED_PROFILE_UNSUPPORTED');
  if(piece.kind==='CYLINDER'){
    onlyKeys(piece,['kind','radius','height'],'CONTAINER_PROFILE_INVALID');
    const r=dimension(piece.radius);
    return {kind:'CYLINDER',r0:r,r1:r,h:dimension(piece.height)};
  }
  if(piece.kind==='FRUSTUM'){
    onlyKeys(piece,['kind','r0','r1','height'],'CONTAINER_PROFILE_INVALID');
    const r0=parseQ(piece.r0,'CONTAINER_DIMENSION_INVALID'),r1=parseQ(piece.r1,'CONTAINER_DIMENSION_INVALID'),h=dimension(piece.height);
    if(qcmp(r0,ZERO)<0||qcmp(r1,ZERO)<0)bad('CONTAINER_DIMENSION_INVALID');
    // a cone point is allowed only at the very bottom of the vessel (the water has to start somewhere); a point at the top closes the vessel
    if(qcmp(r1,ZERO)===0||(qcmp(r0,ZERO)===0&&index!==0))bad('CONTAINER_APEX_UNSUPPORTED');
    return {kind:'FRUSTUM',r0,r1,h};
  }
  return bad('CONTAINER_PIECE_KIND_UNSUPPORTED');
}
const volumeOf=pc=>{ // pi-free volume of a whole piece: r0^2 h + r0 (r1-r0) h + (r1-r0)^2 h / 3
  const d=qsub(pc.r1,pc.r0);
  return qadd(qadd(qmul(qmul(pc.r0,pc.r0),pc.h),qmul(qmul(pc.r0,d),pc.h)),qdiv(qmul(qmul(d,d),pc.h),Q(3n)));
};
function tickList(raw,max,code){
  if(raw===undefined)return [];
  if(!Array.isArray(raw)||raw.length>MAX_TICKS)bad(code);
  const out=[];
  for(const item of raw){
    const q=parseQ(item,code);
    if(qcmp(q,ZERO)<=0||qcmp(q,max)>0||(out.length&&qcmp(q,out.at(-1))<=0))bad(code);
    out.push(q);
  }
  return out;
}
function solvePair(pair){
  onlyKeys(pair,['vessel','graphName','segmentNotes','flowPi','xTicks','yTicks'],'CONTAINER_PLAN_INVALID');
  const vessel=pair.vessel;
  if(isPlain(vessel)&&Object.keys(vessel).some(key=>ASYMMETRIC_KEYS.includes(key)))bad('CONTAINER_ASYMMETRIC_UNSUPPORTED');
  onlyKeys(vessel,['name','profile'],'CONTAINER_PLAN_INVALID');
  if(!Array.isArray(vessel.profile)||vessel.profile.length<1||vessel.profile.length>MAX_PIECES)bad('CONTAINER_PROFILE_INVALID');
  const pieces=vessel.profile.map(parsePiece);
  const z=[ZERO],vol=[ZERO];
  for(const pc of pieces){z.push(qadd(z.at(-1),pc.h));vol.push(qadd(vol.at(-1),volumeOf(pc)));}
  const name=vessel.name===undefined?null:shortText(vessel.name,'CONTAINER_NAME_INVALID',6);
  const graphName=pair.graphName===undefined?null:shortText(pair.graphName,'CONTAINER_NAME_INVALID',6);
  let flow=null;
  if(pair.flowPi!==undefined){flow=parseQ(pair.flowPi,'CONTAINER_FLOW_INVALID');if(qcmp(flow,ZERO)<=0)bad('CONTAINER_FLOW_INVALID');}
  if(pair.xTicks!==undefined&&flow===null)bad('CONTAINER_XTICKS_NEED_FLOW');
  const timeTotal=flow&&qdiv(vol.at(-1),flow);
  const xTicks=flow?tickList(pair.xTicks,timeTotal,'CONTAINER_TICK_INVALID'):[];
  const yTicks=tickList(pair.yTicks,z.at(-1),'CONTAINER_TICK_INVALID');
  const notes=[];
  if(pair.segmentNotes!==undefined){
    if(!Array.isArray(pair.segmentNotes)||pair.segmentNotes.length>pieces.length)bad('CONTAINER_SEGMENT_NOTE_INVALID');
    for(const note of pair.segmentNotes){
      onlyKeys(note,['segment','text'],'CONTAINER_SEGMENT_NOTE_INVALID');
      if(!Number.isInteger(note.segment)||note.segment<0||note.segment>=pieces.length||notes.some(x=>x.segment===note.segment))bad('CONTAINER_SEGMENT_NOTE_INVALID');
      notes.push({segment:note.segment,text:shortText(note.text,'CONTAINER_SEGMENT_NOTE_INVALID',16)});
    }
    notes.sort((a,b)=>a.segment-b.segment);
  }
  const maxRadius=pieces.map(pc=>qcmp(pc.r0,pc.r1)>=0?pc.r0:pc.r1).concat(pieces.map(pc=>pc.r1)).reduce((a,b)=>qcmp(a,b)>=0?a:b);
  return {name,graphName,
    pieces:pieces.map(pc=>({kind:pc.kind,r0:qstr(pc.r0),r1:qstr(pc.r1),h:qstr(pc.h)})),
    z:z.map(qstr),vol:vol.map(qstr),height:qstr(z.at(-1)),volume:qstr(vol.at(-1)),maxRadius:qstr(maxRadius),
    flowPi:flow&&qstr(flow),time:flow?vol.map(v=>qstr(qdiv(v,flow))):null,
    xTicks:xTicks.map(qstr),yTicks:yTicks.map(qstr),notes};
}
export function solveContainerFill(container){
  if(!isPlain(container))bad('CONTAINER_PLAN_INVALID');
  onlyKeys(container,['pairs','guides','xTitle','yTitle','origin'],'CONTAINER_PLAN_INVALID');
  if(!Array.isArray(container.pairs)||container.pairs.length<1||container.pairs.length>MAX_PAIRS)bad('CONTAINER_PAIR_COUNT_INVALID');
  for(const key of ['guides','origin'])if(container[key]!==undefined&&typeof container[key]!=='boolean')bad('CONTAINER_PLAN_INVALID');
  const pairs=container.pairs.map(pair=>{if(!isPlain(pair))bad('CONTAINER_PLAN_INVALID');return solvePair(pair);});
  return {schemaVersion:MODEL_VERSION,guides:container.guides===true,origin:container.origin!==false,
    xTitle:titleText(container.xTitle,'CONTAINER_TITLE_INVALID','시간'),yTitle:titleText(container.yTitle,'CONTAINER_TITLE_INVALID','높이'),pairs};
}

// --- geometry shared by every row --------------------------------------------------------------------------------------------------------------
const W=548,SAFE=12,VCX=96,VMAXW=156,GX=214,GW=206,ARROW_TIP=436,TITLE_X=444,TICK=5,ROW_GAP=6,LABEL_ROW=30,TIP_ABOVE=38,TOP_ABOVE=18;
const PLOT_H={1:200,2:150,3:105};
const MIN_PIECE_PX=12,MIN_WALL_PX=6,MIN_BREAK_PX=8,CHORD_PX=0.1,GUIDE_GAP=5,NOTE_REACH=40;
const STYLE={
  axis:'stroke="#111" stroke-width="1.2" fill="none"',tick:'stroke="#111" stroke-width="1.2" fill="none"',arrow:'fill="#111" stroke="none"',
  vesselFill:'fill="#ececec" stroke="none"',vesselWall:'stroke="#111" stroke-width="1.8" fill="none"',sep:'stroke="#777" stroke-width="1" fill="none"',
  guide:'stroke="#555" stroke-width="1.1" fill="none" stroke-dasharray="1.5 4"',curve:'stroke="#111" stroke-width="2.2" fill="none"',dot:'fill="#111" stroke="none"'
};
const L=(id,role,cls,x1,y1,x2,y2,data={},layer=30)=>({t:'line',id,role,cls,x1:r6(x1),y1:r6(y1),x2:r6(x2),y2:r6(y2),data,layer});
const DISPLAY='\\displaystyle ';
const math=(id,role,owner,tex,plain,ax,ay,x,y,extra={})=>({id,role,owner,kind:'MATH',tex,plain,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
const textLabel=(id,role,owner,text,ax,ay,x,y,extra={})=>({id,role,owner,kind:'TEXT',text,plain:text,anchor:{x:r6(x),y:r6(y),ax,ay},extra});
const pushDistinct=(points,point)=>{const last=points.at(-1);if(!last||last[0]!==point[0]||last[1]!==point[1])points.push(point);};

/** The dense, exact-at-the-corners curve of one vessel: vertices {x,y,seg}. The height axis is sampled, the time axis follows from the volume. */
function curveVertices(pr,px,py){
  const z=pr.z.map(N),vol=pr.vol.map(N),out=[];
  pr.pieces.forEach((pc,k)=>{
    const r0=N(pc.r0),r1=N(pc.r1),hh=N(pc.h),d=r1-r0,v0=vol[k];
    const volAt=s=>v0+r0*r0*s+r0*d*s*s/hh+d*d*s*s*s/(3*hh*hh);
    const at=s=>[px(volAt(s)),py(z[k]+s)];
    const pts=[[0,at(0)]];
    if(d!==0){
      const refine=(sa,a,sb,b,depth)=>{
        const sm=(sa+sb)/2,m=at(sm);
        if(depth<14&&Math.abs(m[0]-(a[0]+b[0])/2)>CHORD_PX){refine(sa,a,sm,m,depth+1);pts.push([sm,m]);refine(sm,m,sb,b,depth+1);}
      };
      const STEPS=8;
      let prev=pts[0];
      for(let i=1;i<=STEPS;i++){
        const s=hh*i/STEPS,cur=[s,at(s)];
        refine(prev[0],prev[1],cur[0],cur[1],0);
        pts.push(cur);prev=cur;
      }
    }else pts.push([hh,at(hh)]);
    // the first vertex of a piece is the last one of the piece below it
    for(const [,[x,y]] of pts.slice(k===0?0:1))out.push({x:r6(x),y:r6(y),seg:k});
  });
  return out;
}

/** One row: the vessel section, its graph, the guides and every label with a fixed anchor. y0 is the top of the row. */
function layoutPair(m,pr,p,y0,count){
  const H=N(pr.height),maxR=N(pr.maxRadius),sv=Math.min(PLOT_H[count]/H,VMAXW/(2*maxR)),ph=H*sv;
  const z=pr.z.map(N),vol=pr.vol.map(N),total=N(pr.volume),n=pr.pieces.length;
  // proportions that cannot be drawn legibly: a slab thinner than 12 px, a wall pair narrower than 6 px, two kinks closer than 8 px
  const positive=pr.pieces.flatMap(pc=>[N(pc.r0),N(pc.r1)]).filter(r=>r>0);
  if(pr.pieces.some((pc,k)=>(z[k+1]-z[k])*sv<MIN_PIECE_PX)||2*Math.min(...positive)*sv<MIN_WALL_PX||vol.slice(1).some((v,k)=>(v-vol[k])/total*GW<MIN_BREAK_PX))bad('CONTAINER_PROPORTION_UNSUPPORTED');
  const hasX=pr.xTicks.length>0,named=!!(pr.name||pr.graphName);
  const tipY=y0+TIP_ABOVE,top=tipY+TOP_ABOVE,base=top+ph;
  const py=h=>r6(base-h*sv),pxv=v=>r6(GX+v/total*GW);
  const prims=[],labels=[],id=s=>`${s}-${p}`;
  // vessel section: filled silhouette (closed), wall (open at the top), a thin line at every inner piece boundary
  const right=[];
  pr.pieces.forEach((pc,k)=>{pushDistinct(right,[r6(VCX+N(pc.r0)*sv),py(z[k])]);pushDistinct(right,[r6(VCX+N(pc.r1)*sv),py(z[k+1])]);});
  const left=right.map(([x,y])=>[r6(2*VCX-x),y]);
  const poly=[...left];for(const point of [...right].reverse())pushDistinct(poly,point);
  if(poly.length>1&&poly[0][0]===poly.at(-1)[0]&&poly[0][1]===poly.at(-1)[1])poly.pop();
  const wall=[...left].reverse();for(const point of right)pushDistinct(wall,point);
  prims.push({t:'polygon',id:id('vessel-fill'),role:'vessel-fill',cls:'vesselFill',points:poly,data:{pair:p},layer:20});
  prims.push({t:'polyline',id:id('vessel-wall'),role:'vessel-wall',cls:'vesselWall',points:wall,data:{pair:p},layer:30});
  for(let i=1;i<n;i++){
    const w=Math.min(N(pr.pieces[i-1].r1),N(pr.pieces[i].r0))*sv;
    prims.push(L(`vessel-sep-${p}-${i}`,'vessel-sep','sep',VCX-w,py(z[i]),VCX+w,py(z[i]),{pair:p,boundary:i},25));
  }
  // graph axes
  prims.push(L(id('x-axis'),'axis','axis',GX,base,ARROW_TIP-8,base,{axis:'x',pair:p}));
  prims.push({t:'polygon',id:id('x-axis-arrow'),role:'arrow',cls:'arrow',points:[[ARROW_TIP,base],[ARROW_TIP-9,base-4],[ARROW_TIP-9,base+4]],data:{pair:p},layer:30});
  prims.push(L(id('y-axis'),'axis','axis',GX,base,GX,tipY+8,{axis:'y',pair:p}));
  prims.push({t:'polygon',id:id('y-axis-arrow'),role:'arrow',cls:'arrow',points:[[GX,tipY],[GX-4,tipY+9],[GX+4,tipY+9]],data:{pair:p},layer:30});
  // numeric ticks only where the author gave a value
  pr.xTicks.forEach((t,k)=>{
    const x=r6(GX+N(t)*N(pr.flowPi)/total*GW);
    prims.push(L(`x-tick-${p}-${k}`,'x-tick','tick',x,base,x,base+TICK,{axis:'x',value:t,pair:p}));
    labels.push(math(`x-tick-${p}-${k}-label`,'x-tick',`x-tick-${p}-${k}`,DISPLAY+qtex(P(t)),t,'center','top',x,base+TICK+4,{value:t,pair:p}));
  });
  pr.yTicks.forEach((t,k)=>{
    const y=py(N(t));
    prims.push(L(`y-tick-${p}-${k}`,'y-tick','tick',GX-TICK,y,GX,y,{axis:'y',value:t,pair:p}));
    labels.push(math(`y-tick-${p}-${k}-label`,'y-tick',`y-tick-${p}-${k}`,DISPLAY+qtex(P(t)),t,'end','middle',GX-TICK-4,y,{value:t,pair:p}));
  });
  // the curve, its kinks, and the level guides from the vessel
  const verts=curveVertices(pr,pxv,py);
  prims.push({t:'polyline',id:id('curve'),role:'curve',cls:'curve',points:verts.map(v=>[v.x,v.y]),data:{pair:p},layer:50});
  for(let i=1;i<=n;i++){
    const cx=pxv(vol[i]),cy=py(z[i]);
    prims.push({t:'circle',id:`break-${p}-${i}`,role:'break-point',cls:'dot',cx,cy,r:3.2,data:{pair:p,boundary:i},layer:70});
    if(m.guides){
      const wallR=Math.max(N(pr.pieces[i-1].r1),i<n?N(pr.pieces[i].r0):0)*sv;
      prims.push(L(`guide-${p}-${i}`,'guide','guide',VCX+wallR+GUIDE_GAP,cy,cx,cy,{pair:p,boundary:i},22));
    }
  }
  // labels
  labels.push(textLabel(id('y-title'),'axis-title',id('y-axis'),m.yTitle,'center','bottom',GX,tipY-4,{pair:p}));
  labels.push(textLabel(id('x-title'),'axis-title',id('x-axis'),m.xTitle,'start','middle',TITLE_X,base,{pair:p}));
  if(m.origin)labels.push(math(id('origin'),'origin',id('x-axis'),'O','O','end','top',GX-6,base+4,{pair:p}));
  const nameY=base+TICK+4;
  if(pr.name)labels.push(textLabel(id('vessel-name'),'vessel-name',id('vessel-wall'),pr.name,'center','top',VCX,nameY,{pair:p}));
  if(pr.graphName)labels.push(textLabel(id('graph-name'),'graph-name',id('curve'),pr.graphName,'center','top',GX+GW/2,nameY+(hasX?LABEL_ROW:0),{pair:p}));
  for(const note of pr.notes)labels.push({id:`segment-note-${p}-${note.segment}`,role:'segment-note',owner:id('curve'),kind:'TEXT',text:note.text,plain:note.text,anchor:{x:0,y:0,ax:'start',ay:'middle'},extra:{pair:p,segment:note.segment},placement:'note'});
  const bottom=base+TICK+4+Math.max((hasX?LABEL_ROW:0)+(named?LABEL_ROW:0),20)+2;
  // the polyline of piece k runs from the last vertex of the piece below it (its own first vertex) to its own last one
  const segments=pr.pieces.map((_,k)=>{const own=verts.filter(v=>v.seg===k).map(v=>[v.x,v.y]),below=k?verts.filter(v=>v.seg===k-1).at(-1):null;return below?[[below.x,below.y],...own]:own;});
  const mids=pr.pieces.map((pc,k)=>{ // the curve point at the middle height of each piece
    const r0=N(pc.r0),r1=N(pc.r1),hh=N(pc.h),d=r1-r0,s=hh/2;
    return [pxv(vol[k]+r0*r0*s+r0*d*s*s/hh+d*d*s*s*s/(3*hh*hh)),py(z[k]+s)];
  });
  return {prims,labels,bottom,geom:{base,top,sv,segments,mids,frame:{x0:GX+6,y0:top-10,y1:base-6}}};
}

// --- the figure: spec = ordered primitives + labels at anchors (note positions need the label widths and are fixed when the labels are typeset) --------------------------
export function containerFillSpec(plan,model){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.container))bad('CONTAINER_PLAN_INVALID');
  if(objectSha(solveContainerFill(plan.container))!==objectSha(model))bad('CONTAINER_MODEL_MISMATCH');
  return {schemaVersion:SPEC_VERSION,...buildSpec(model)};
}
function buildSpec(model){
  const prims=[],labels=[],pairs=[];
  let y0=SAFE;
  model.pairs.forEach((pr,p)=>{
    const row=layoutPair(model,pr,p,y0,model.pairs.length);
    prims.push(...row.prims);labels.push(...row.labels);pairs.push(row.geom);
    y0=row.bottom+ROW_GAP;
  });
  return {size:{width:W,height:Math.ceil(y0-ROW_GAP+SAFE)},prims,labels,pairs};
}
export const containerFillSize=model=>({...buildSpec(model).size});

// --- composing ---------------------------------------------------------------------------------------------------------------------------------
const PLAIN_KEYS=['capability','container','caption','sourceConditions','newVisualInformation'];
export function checkContainerFillPlan(plan){
  onlyKeys(plan,PLAIN_KEYS,'CONTAINER_PLAN_INVALID');
  if(plan.capability!==FIGURE_CAPABILITY)bad('CONTAINER_PLAN_INVALID');
  return solveContainerFill(plan.container);
}
const fmt=n=>String(r6(n));
function printPrim(p){
  const data=Object.entries(p.data??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join(''),head=`id="${p.id}" data-role="${p.role}"${data}`,style=STYLE[p.cls];
  let tag;
  switch(p.t){
    case 'line':tag=`<line ${head} x1="${fmt(p.x1)}" y1="${fmt(p.y1)}" x2="${fmt(p.x2)}" y2="${fmt(p.y2)}" ${style}/>`;break;
    case 'polyline':tag=`<polyline ${head} points="${p.points.map(([x,y])=>fmt(x)+','+fmt(y)).join(' ')}" ${style}/>`;break;
    case 'polygon':tag=`<polygon ${head} points="${p.points.map(([x,y])=>fmt(x)+','+fmt(y)).join(' ')}" ${style}/>`;break;
    case 'circle':tag=`<circle ${head} cx="${fmt(p.cx)}" cy="${fmt(p.cy)}" r="${p.r}" ${style}/>`;break;
    default:throw Error('CONTAINER_PRIMITIVE_UNKNOWN');
  }
  return `<g data-layer="${p.layer}">${tag}</g>`;
}
const grow=(b,m)=>({x:b.x-m,y:b.y-m,width:b.width+2*m,height:b.height+2*m});
// segment / rectangle intersection (Liang-Barsky)
function segmentHitsRect(x1,y1,x2,y2,b){
  let t0=0,t1=1;const dx=x2-x1,dy=y2-y1;
  for(const [p,q] of [[-dx,x1-b.x],[dx,b.x+b.width-x1],[-dy,y1-b.y],[dy,b.y+b.height-y1]]){
    if(p===0){if(q<0)return false;}
    else{const r=q/p;if(p<0){if(r>t1)return false;if(r>t0)t0=r;}else{if(r<t0)return false;if(r<t1)t1=r;}}
  }
  return t0<=t1;
}
const circleHitsRect=(cx,cy,r,b)=>{const x=Math.min(Math.max(cx,b.x),b.x+b.width),y=Math.min(Math.max(cy,b.y),b.y+b.height);return Math.hypot(x-cx,y-cy)<=r;};
// the first line-like primitive a label box touches (guides are cut around labels, the vessel fill is only a tint)
function primitiveHit(box,prims){
  for(const prim of prims){
    if(prim.role==='guide'||prim.role==='vessel-fill')continue;
    if(prim.t==='circle'){if(circleHitsRect(prim.cx,prim.cy,prim.r,box))return prim.id;continue;}
    const pts=prim.t==='line'?[[prim.x1,prim.y1],[prim.x2,prim.y2]]:prim.points;
    const count=prim.t==='polygon'?pts.length:pts.length-1;
    for(let i=0;i<count;i++){const a=pts[i],b=pts[(i+1)%pts.length];if(segmentHitsRect(a[0],a[1],b[0],b[1],box))return prim.id;}
  }
  return null;
}
const rectDist=(x,y,b)=>Math.hypot(Math.max(b.x-x,0,x-(b.x+b.width)),Math.max(b.y-y,0,y-(b.y+b.height)));
// the distance from a polyline to a box, found by walking along the line in 3 px steps
function polyRectDist(pts,box){
  let best=Infinity;
  for(let i=0;i<pts.length-1;i++){
    const [a,c]=[pts[i],pts[i+1]],steps=Math.max(1,Math.ceil(Math.hypot(c[0]-a[0],c[1]-a[1])/3));
    for(let k=0;k<=steps;k++)best=Math.min(best,rectDist(a[0]+(c[0]-a[0])*k/steps,a[1]+(c[1]-a[1])*k/steps,box));
  }
  return best;
}
/** A segment note stands beside its own piece of the curve: on the free side of the monotone curve, clear of every line and label, nearer to its own piece than to any other. */
function resolveNotes(spec,placed){
  const {width,height}=spec.size;
  for(const item of placed.filter(it=>it.label.placement==='note')){
    const {label,fragment}=item,w=fragment.intrinsic.width,h=fragment.intrinsic.height,{pair,segment}=label.extra,geom=spec.pairs[pair];
    const [mx,my]=geom.mids[segment],own=geom.segments[segment],others=geom.segments.filter((_,k)=>k!==segment);
    let best=null;
    for(let dx=-w-20;dx<=60;dx+=6)for(let k=-16;k<=12;k++){
      const box={x:r6(mx+dx),y:r6(my+k*6-h/2),width:w,height:h};
      if(box.x<SAFE||box.y<SAFE||box.x+w>width-SAFE||box.y+h>height-SAFE)continue;
      // a note stays inside the graph: right of its y axis, above its x axis
      if(box.x<geom.frame.x0||box.y<geom.frame.y0||box.y+h>geom.frame.y1)continue;
      const cx=box.x+w/2,cy=box.y+h/2,dOwn=polyRectDist(own,box);
      if(dOwn>NOTE_REACH||others.some(o=>polyRectDist(o,box)<dOwn-0.5))continue;
      if(primitiveHit(grow(box,3),spec.prims)!==null)continue;
      if(placed.some(o=>o!==item&&o.box&&overlaps(grow(box,2),o.box)))continue;
      // beside the curve is not enough: a note that sits clear of the level guides reads better than one that interrupts them
      const onGuide=spec.prims.some(prim=>prim.role==='guide'&&segmentHitsRect(prim.x1,prim.y1,prim.x2,prim.y2,grow(box,3)));
      const score=Math.hypot(cx-mx,cy-my)+(onGuide?1000:0);
      if(best===null||score<best.score-1e-9)best={score,box};
    }
    if(best===null)throw new Stop('CONTAINER_NOTE_NO_ROOM',{labelId:label.id});
    item.box=best.box;
  }
}
// A guide never runs under a label: it is cut into the pieces that clear every label box (the labels are glyph outlines, the guide only a reading aid).
function cutGuides(spec,placed){
  const boxes=placed.map(item=>grow(item.box,3));
  const out=[];
  for(const prim of spec.prims){
    if(prim.role!=='guide'){out.push(prim);continue;}
    const lo=Math.min(prim.x1,prim.x2),hi=Math.max(prim.x1,prim.x2);
    const covers=boxes.filter(b=>b.y<prim.y1&&prim.y1<b.y+b.height&&b.x<hi&&b.x+b.width>lo).map(b=>[b.x,b.x+b.width]).sort((u,v)=>u[0]-v[0]);
    const pieces=[];let cur=lo;
    for(const [c0,c1] of covers){if(c0>cur)pieces.push([cur,c0]);cur=Math.max(cur,c1);}
    if(hi>cur)pieces.push([cur,hi]);
    const kept=pieces.filter(([a,b])=>b-a>=4);
    if(!kept.length)throw new Stop('CONTAINER_GUIDE_HIDDEN',{guide:prim.id});
    kept.forEach(([a,b],k)=>out.push({...prim,id:kept.length===1&&a===lo&&b===hi?prim.id:`${prim.id}~${k}`,x1:r6(a),x2:r6(b)}));
  }
  spec.prims=out;
}
/** Typeset every label, place it, build the SVG, run the independent observer on its bytes and the rendered layout check in Chrome. */
export async function composeContainerFillFigure({plan,model,identity,typographyPolicy,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:status==='COMPOSED'?'construction-candidate-svg-v1':SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=containerFillSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='CONTAINER_MODEL_MISMATCH'?error.message:'CONTAINER_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(JSON.parse(JSON.stringify(spec)));
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:'DERIVED_INTERMEDIATE',fontPx:font,panelId:'container-fill',...(label.kind==='MATH'?{kind:'MATH',tex:label.tex}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('CONTAINER_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      const {width,height}=fragment.intrinsic,{x,y,ax,ay}=label.anchor;
      placed.push({label,fragment,box:label.placement==='note'?null:{x:r6(ax==='end'?x-width:ax==='center'?x-width/2:x),y:r6(ay==='bottom'?y-height:ay==='middle'?y-height/2:y),width,height}});
    }
    const {width,height}=spec.size;
    // the fixed labels must be inside the figure before notes look for room beside them
    for(const item of placed.filter(it=>it.box)){
      const b=item.box;
      if(b.x<SAFE||b.y<SAFE||b.x+b.width>width-SAFE||b.y+b.height>height-SAFE)throw new Stop('CONTAINER_LABEL_OUT_OF_BOUNDS',{labelId:item.label.id,box:b,size:{width,height}});
    }
    resolveNotes(spec,placed);
    cutGuides(spec,placed);
    for(let i=0;i<placed.length;i++)for(const other of placed.slice(i+1))if(overlaps(placed[i].box,other.box))throw new Stop('CONTAINER_LABELS_TOO_CLOSE',{labels:[placed[i].label.id,other.label.id]});
    for(const item of placed){
      const hit=primitiveHit(grow(item.box,1.5),spec.prims);
      if(hit!==null)throw new Stop('CONTAINER_LABEL_ON_LINE',{labelId:item.label.id,primitive:hit});
    }
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    for(const prim of [...spec.prims].sort((a,b)=>a.layer-b.layer))body+=printPrim(prim);
    for(const {label,fragment,box} of placed){
      const extra=Object.entries(label.extra??{}).map(([k,v])=>` data-${k}="${esc(v)}"`).join('');
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="COORDINATE_LABEL" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${extra}${label.kind==='MATH'?` data-tex="${esc(label.tex)}"`:` data-text="${esc(label.text)}"`} data-fragment-sha="${fragment.fragmentSha256}" data-box="${box.x},${box.y},${box.width},${box.height}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-container-fill="${FIGURE_CAPABILITY}" data-pairs="${model.pairs.length}" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-container-fill-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({container:plan.container,svg},{script:OBSERVER_SCRIPT});}catch(error){throw new Stop('WORKER_ERROR',{stage:'containerFillAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'containerFillAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('CONTAINER_FILL_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('CONTAINER_FILL_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}
