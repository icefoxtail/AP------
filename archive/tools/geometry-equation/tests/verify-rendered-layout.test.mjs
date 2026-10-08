import assert from 'node:assert/strict';
import test from 'node:test';
import {analyzeRenderedLayout,captureAtDisplaySize,collectRenderedLayout} from '../verify-rendered-layout.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {typesetter} from '../production/typography.mjs';

test('font measurement includes nested MathJax viewport scaling; new generation freezes glyph scale',async()=>{
  const browser=await launchBrowser();try{
    const page=await browser.newPage({viewport:{width:1440,height:1000}});
    const wrap=fragment=>'<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200" data-publication-profile="fragment-publication-spike-v1"><g id="number" data-fragment-sha="frozen" data-label-kind="EQUATION_LABEL" data-font-px="20" transform="translate(100 60)">'+fragment+'</g></svg>';
    const t=typesetter(),fragment=t({id:'number',owner:'number',factRole:'GIVEN',kind:'MATH',tex:'2',fontPx:20},{visualAssetKey:'font-scale-regression'});
    assert.doesNotMatch(fragment.svg,/<svg[^>]*><svg/);
    const normal=await captureAtDisplaySize(page,wrap(fragment.svg),{width:300,height:200});
    assert.ok(Math.abs(normal.labels[0].effectiveFontPx-20)<1e-4,JSON.stringify(normal.labels[0]));
    assert.equal(analyzeRenderedLayout(normal).status,'PASS');
    const legacy=width=>'<svg width="'+width+'" height="13.32" viewBox="0 0 '+width+' 13.32"><svg width="'+width+'" height="13.32" viewBox="0 -666 500 666"><g data-mml-node="math" transform="scale(1,-1)"><path d="M50 0H450V666H50Z"/></g></svg></svg>';
    const old=await captureAtDisplaySize(page,wrap(legacy(10)),{width:300,height:200});
    assert.ok(Math.abs(old.labels[0].effectiveFontPx-20)<1e-4);
    assert.equal(analyzeRenderedLayout(old).status,'PASS');
    const compact=await captureAtDisplaySize(page,wrap(legacy(4.5)),{width:300,height:200});
    assert.ok(Math.abs(compact.labels[0].effectiveFontPx-9)<1e-4);
    assert.ok(analyzeRenderedLayout(compact).errors.includes('PUBLICATION_FONT_BELOW_11_CSS_PX:number'));
    // New fragments do not shrink their ink when a box is narrowed.
    const narrowed=fragment.svg.replace(/width="[^"]+"/,'width="4.5"').replace(/viewBox="0 0 [^ ]+ /,'viewBox="0 0 4.5 ');
    const frozen=await captureAtDisplaySize(page,wrap(narrowed),{width:300,height:200});
    assert.ok(Math.abs(frozen.labels[0].effectiveFontPx-20)<1e-4);
  }finally{await browser.close();}
});
function capture(){return{runtime:'playwright-chromium',synthetic:false,svg:{x:0,y:0,width:620,height:500},viewBox:{width:620,height:500},safeMargin:32,labels:[{id:'a',priority:0,client:{x:100,y:100,width:20,height:15},bbox:{width:20,height:15},missingGlyphCount:0}],geometry:[]};}
test('clear rendered bbox passes',()=>assert.equal(analyzeRenderedLayout(capture()).status,'PASS'));
test('synthetic capture cannot pass',()=>assert.throws(()=>analyzeRenderedLayout({...capture(),synthetic:true}),/ACTUAL_BROWSER/));
test('critical label overlap fails',()=>{const c=capture();c.labels.push({...c.labels[0],id:'b'});assert.equal(analyzeRenderedLayout(c).HARD_RENDERED_COLLISION,1);});
test('actual line through label fails',()=>{const c=capture();c.geometry.push({id:'line',kind:'line',points:[[0,105],[200,105]],client:{x:0,y:105,width:200,height:0}});assert.equal(analyzeRenderedLayout(c).criticalCollisionCount,1);});
test('clipping and glyph errors fail',()=>{const c=capture();c.labels[0].client.x=1;c.labels[0].missingGlyphCount=1;const r=analyzeRenderedLayout(c);assert.equal(r.CLIPPING,1);assert.equal(r.missingGlyphCount,1);});
test('own condition box must contain rendered multiline text',()=>{const c=capture();c.geometry.push({id:'a-box',kind:'conditionBox',client:{x:100,y:100,width:10,height:10}});assert.equal(analyzeRenderedLayout(c).overflowCount,1);});
test('leader crossing a core line is a hard rendered failure',()=>{const c=capture();c.labels=[];c.geometry=[{id:'lead',kind:'leader',points:[[50,50],[200,200]],client:{x:50,y:50,width:150,height:150}},{id:'core',kind:'line',points:[[50,200],[200,50]],client:{x:50,y:50,width:150,height:150}}];assert.ok(analyzeRenderedLayout(c).errors.some(v=>v.startsWith('LEADER_CROSSING')));});
function tickCapture({id='tick-x--2',axis='x',value=-2,point=[34.84,160],box={x:27.84,y:172,width:14,height:12},extraTicks=[]}={}) {
  const [x,y]=point,labelId=id+'-label';const axisClient=axis==='x'?{x:0,y,width:300,height:0}:{x,y:0,width:0,height:300};const tickClient=axis==='x'?{x,y:y-4,width:0,height:8}:{x:x-4,y,width:8,height:0};return{...capture(),safeMargin:0,labels:[{id:labelId,kind:'TICK_LABEL',priority:0,value:value<0?'−'+Math.abs(value):String(value),owner:id,tickOwner:id,tickAxis:axis,tickValue:String(value),tickDisplayValue:value<0?'−'+Math.abs(value):String(value),tickSource:[x,y],tickSourceClient:[x,y],client:box,bbox:{x:box.x,y:box.y,width:box.width,height:box.height},missingGlyphCount:0,font:'serif',baseFontPx:12,effectiveFontPx:12,renderedVisibility:visibleMeasurement(labelId,box)}],geometry:[{id:axis+'-axis',kind:'axis',axis,points:axis==='x'?[[0,y],[300,y]]:[[x,0],[x,300]],client:axisClient,strokeWidthPx:0,visibilityEvidence:visibleGeometryMeasurement(axis+'-axis',axisClient)},{id,kind:'tick',axis,value:String(value),points:axis==='x'?[[x,y-4],[x,y+4]]:[[x-4,y],[x+4,y]],client:tickClient,strokeWidthPx:0,visibilityEvidence:visibleGeometryMeasurement(id,tickClient)},...extraTicks]};
}
test('curve masking cannot make a tick-label collision pass',()=>{
  const c=tickCapture({id:'tick-x-1',value:1,point:[100,160],box:{x:93,y:172,width:14,height:12}}),label=c.labels[0],maskBox={x:87,y:166,width:26,height:24};
  const curve={id:'f-branch-0',kind:'curve',role:'curve',points:[[100,100],[100,220]],client:{x:100,y:100,width:0,height:120},strokeWidthPx:.8,paintOrder:1};
  const rectNode={tag:'rect',id:'tick-x-1-label-knockout-background',display:'inline',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:{status:'CLEAR'},maskState:{status:'CLEAR'}};
  const svgNode={tag:'svg',id:null,display:'block',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:{status:'CLEAR'},maskState:{status:'CLEAR'}};
  const mask={id:'tick-x-1-label-knockout-background',kind:'tickLabelKnockout',role:'tick-label-knockout',ownerLabelId:label.id,occludedPrimitiveIds:['f-branch-0'],client:maskBox,fill:'rgb(255, 255, 255)',fillOpacity:1,opacity:1,strokeWidthPx:0,paintOrder:2,visibilityEvidence:{kind:'GEOMETRY',elementAncestors:[rectNode,svgNode],content:[{tag:'rect',id:rectNode.id,bbox:maskBox,client:maskBox,ancestors:[rectNode,svgNode],fill:'#fff',fillOpacity:1,stroke:'none',strokeOpacity:1,strokeWidth:0}]}};
  label.paintOrder=3;c.geometry.push(curve,mask);
  const result=analyzeRenderedLayout(c);
  assert.equal(result.status,'FAIL');
  assert.ok(result.errors.includes('TICK_LABEL_CURVE_MASK_FORBIDDEN:'+mask.id));
  assert.ok(result.errors.includes('LABEL_GEOMETRY_COLLISION:'+label.id+':'+curve.id));
});
test('only the exact legacy q10 straight-segment tick mask remains inspectable',()=>{
  const point=[122.3552045164009,97.5114545164009],box={x:113.7421646118164,y:79.69046783447266,width:17.748695373535156,height:10.341751098632812};
  const c=tickCapture({id:'tick-x--1',value:-2,point,box}),label=c.labels[0];
  c.svg={x:0,y:0,width:298.140625,height:248.453125};c.viewBox={x:0,y:0,width:384,height:320};c.coordinateScale=298.140625/384;c.safeMargin=12;c.publicationProfile='fragment-publication-spike-v1';c.publicationViewport={width:1440,height:1000};c.fontStatus='loaded';
  c.svgSha256='8e2d318dcdd5e791c153cd638b57862b349061115c90a189ae3541637e6f9ca7';
  label.paintOrder=25;label.font='FROZEN_OUTLINE';label.value='sha256:4c1ff71e87095ea3098c304eef5710f89046a21f9665bcdfc43a778b6d77edf7';label.baseFontPx=20;label.effectiveFontPx=15.32;label.tickSource=[157.591397849,125.591397849];label.tickSourceClient=point;label.renderedVisibility=visibleMeasurement(label.id,box,'OUTLINE');
  const axis=c.geometry.find(value=>value.id==='x-axis');axis.points=[[76.40521240234375,point[1]],[221.73541259765625,point[1]]];axis.client={x:76.40521240234375,y:point[1],width:145.3302001953125,height:0};axis.paintOrder=5;axis.visibilityEvidence.content[0].client={...axis.client};
  const tick=c.geometry.find(value=>value.id==='tick-x--1');tick.points=[point,[point[0],point[1]+3.1056365966796875]];tick.client={x:point[0],y:point[1],width:0,height:3.1056365966796875};tick.paintOrder=10;tick.visibilityEvidence.content[0].client={...tick.client};
  const line={id:'segmentAB',kind:'line',role:'line',points:[[95.64009296600825,44.07993111529085],[202.50053203399173,204.37058971804245]],client:{x:95.64009296600825,y:44.07993111529085,width:106.86043906798348,height:160.2906586027516},strokeWidthPx:1.2422526041666666,paintOrder:15};
  const maskBox={x:107.77935796790645,y:75.03071631802446,width:29.151689529418945,height:20.926618576049805},rectNode={tag:'rect',id:'tick-x--1-label-knockout-background',display:'inline',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:{status:'CLEAR'},maskState:{status:'CLEAR'}};
  const svgNode={tag:'svg',id:null,display:'block',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:{status:'CLEAR'},maskState:{status:'CLEAR'}};
  const mask={id:'tick-x--1-label-knockout-background',kind:'tickLabelKnockout',role:'tick-label-knockout',ownerLabelId:label.id,occludedPrimitiveIds:['segmentAB'],client:maskBox,fill:'rgb(255, 255, 255)',fillOpacity:1,opacity:1,strokeWidthPx:0,paintOrder:20,visibilityEvidence:{kind:'GEOMETRY',elementAncestors:[rectNode,svgNode],content:[{tag:'rect',id:rectNode.id,bbox:{x:138.817960349,y:96.638272849,width:37.546875,height:26.953125},client:maskBox,ancestors:[rectNode,svgNode],fill:'rgb(255, 255, 255)',fillOpacity:1,stroke:'none',strokeOpacity:1,strokeWidth:0}]}};
  c.geometry.push(line,mask);
  const result=analyzeRenderedLayout(c);
  assert.equal(result.status,'PASS',JSON.stringify(result.errors));
  assert.equal(result.labelCollisionCount,0);
  assert.equal(result.criticalCollisionCount,0);
  assert.equal(result.observedLabelCollisionCount,1);
  assert.equal(result.observedCriticalCollisionCount,1);
  assert.equal(result.tickKnockoutEvidence[0].status,'PASS');
  assert.equal(result.tickKnockoutEvidence[0].checks.exactSvgSha256,true);
  const altered=structuredClone(c);altered.geometry.find(value=>value.id===mask.id).client.width=20;
  const rejected=analyzeRenderedLayout(altered);
  assert.ok(rejected.errors.includes('TICK_LABEL_KNOCKOUT_EVIDENCE_INVALID:'+mask.id));
  assert.equal(rejected.observedCriticalCollisionCount,1);
  assert.equal(rejected.criticalCollisionCount,1);
});
function visibleMeasurement(id,bbox,kind='TEXT') {
  const tag=kind==='TEXT'?'text':'g',contentTag=kind==='TEXT'?'text':'path';
  const clearState=()=>({status:'CLEAR',value:'none',referenceId:null,reason:null});
  const labelNode={tag,id,display:'block',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:clearState(),maskState:clearState()},svgNode={tag:'svg',id:null,display:'block',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:clearState(),maskState:clearState()};
  return{kind,elementAncestors:[labelNode,svgNode],content:[{tag:contentTag,id:null,text:kind==='TEXT'?'−2':null,glyph:kind==='OUTLINE'?'30':null,bbox:{...bbox},client:{...bbox},ancestors:[{...labelNode,tag:contentTag,id:null},svgNode],fill:'#111',fillOpacity:1,stroke:'none',strokeOpacity:1,strokeWidth:0}]};
}
function visibleGeometryMeasurement(id,client) {
  const clearState=()=>({status:'CLEAR',value:'none',referenceId:null,reason:null});
  const node={tag:'line',id,display:'inline',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:clearState(),maskState:clearState()};
  const svgNode={tag:'svg',id:null,display:'block',visibility:'visible',opacity:1,clipPath:'none',mask:'none',clipPathState:clearState(),maskState:clearState()};
  return{kind:'GEOMETRY',elementAncestors:[node,svgNode],content:[{tag:'line',id,bbox:{x:client.x,y:client.y,width:Math.max(client.width,1),height:Math.max(client.height,1)},client:{x:client.x,y:client.y,width:Math.max(client.width,1),height:Math.max(client.height,1)},ancestors:[node,svgNode],fill:'none',fillOpacity:1,stroke:'#111',strokeOpacity:1,strokeWidth:1}]};
}
test('normal cubic x=-2 tick label placement passes owner geometry and displayed value checks',()=>{const r=analyzeRenderedLayout(tickCapture());assert.equal(r.status,'PASS');assert.equal(r.tickLabelEvidence[0].status,'PASS');assert.deepEqual(r.tickLabelEvidence[0].intersection,[34.84,160]);});
test('q13 tick callout recomputes exact owner and full leader endpoints',()=>{
  const c=tickCapture({id:'tick-x--3',value:-6,point:[100,160],box:{x:121,y:132,width:14,height:12}}),label=c.labels[0];
  label.tickCalloutSchema='TICK_LABEL_OWNER_LEADER_v1';label.value='−6';label.paintOrder=3;
  const leader={id:label.id+'-owner-leader',kind:'leader',role:'leader',ownerLabelId:label.id,tickOwner:'tick-x--3',tickAxis:'x',tickValue:'-6',points:[[100,160],[121,144]],client:{x:100,y:144,width:21,height:16},strokeWidthPx:.8,strokeColor:'rgb(102, 102, 102)',markerStart:'',markerEnd:'',paintOrder:2,visibilityEvidence:visibleGeometryMeasurement(label.id+'-owner-leader',{x:100,y:144,width:21,height:16})};
  c.geometry.push(leader);
  const result=analyzeRenderedLayout(c);
  assert.equal(result.status,'PASS',JSON.stringify(result.errors));
  assert.equal(result.tickLabelEvidence[0].ownerLeader.status,'PASS');
  assert.equal(result.tickLabelEvidence[0].ownerLeader.ownerTick,'tick-x--3');
  assert.equal(result.tickLabelEvidence[0].ownerLeader.endAtLabelEdge,true);
});
test('q13 owner leader fails if it crosses the curve or has the wrong owner value',()=>{
  const c=tickCapture({id:'tick-x--3',value:-6,point:[100,160],box:{x:121,y:132,width:14,height:12}}),label=c.labels[0];
  label.tickCalloutSchema='TICK_LABEL_OWNER_LEADER_v1';label.value='−6';label.paintOrder=3;
  const leader={id:label.id+'-owner-leader',kind:'leader',role:'leader',ownerLabelId:label.id,tickOwner:'tick-x--3',tickAxis:'x',tickValue:'-6',points:[[100,160],[121,144]],client:{x:100,y:144,width:21,height:16},strokeWidthPx:.8,strokeColor:'rgb(102, 102, 102)',markerStart:'',markerEnd:'',paintOrder:2,visibilityEvidence:visibleGeometryMeasurement(label.id+'-owner-leader',{x:100,y:144,width:21,height:16})};
  const curve={id:'curve-near-callout',kind:'curve',role:'curve',points:[[110,150],[140,120]],client:{x:110,y:120,width:30,height:30},strokeWidthPx:1,paintOrder:1};
  c.geometry.push(leader,curve);
  const result=analyzeRenderedLayout(c);
  assert.ok(result.errors.includes('TICK_LABEL_OWNER_LEADER_CLEARANCE_FAIL:tick-x--3-label'));
  const wrong={...c,geometry:c.geometry.map(item=>item===leader?{...leader,tickValue:'-4'}:item)};
  assert.ok(analyzeRenderedLayout(wrong).errors.includes('TICK_LABEL_OWNER_LEADER_BINDING_MISMATCH:tick-x--3-label'));
});
test('cubic reproduction with x=-2 label moved to the upper-right panel fails',()=>{const r=analyzeRenderedLayout(tickCapture({box:{x:182.3,y:32,width:14,height:12}}));assert.ok(r.errors.includes('TICK_LABEL_ALONG_AXIS_MISALIGNMENT:tick-x--2-label'));});
test('normal quartic tick label placement passes',()=>{const c=tickCapture({id:'tick-x-3',value:3,point:[300,200],box:{x:293,y:212,width:14,height:12}});assert.equal(analyzeRenderedLayout(c).status,'PASS');});
test('adjacent-tick confusion fails even when owner metadata names a real tick',()=>{const second={id:'tick-x--1',kind:'tick',axis:'x',value:'-1',points:[[70,156],[70,164]],client:{x:70,y:156,width:0,height:8},strokeWidthPx:0};const c=tickCapture({box:{x:63,y:172,width:14,height:12},extraTicks:[second]});const r=analyzeRenderedLayout(c);assert.ok(r.errors.includes('TICK_LABEL_ALONG_AXIS_MISALIGNMENT:tick-x--2-label'));});
test('tick label moved into a panel is rejected independently of producer placement claims',()=>{const c=tickCapture({box:{x:182.3,y:32,width:14,height:12}});c.labels[0].placement='AUTO_S';assert.equal(analyzeRenderedLayout(c).tickLabelEvidence[0].status,'FAIL');});
test('tick label owner must be unique',()=>{const c=tickCapture();c.labels.push({...c.labels[0],id:'duplicate-label'});assert.ok(analyzeRenderedLayout(c).errors.includes('TICK_LABEL_OWNER_NOT_UNIQUE:tick-x--2-label'));});
test('required tick with absent label fails closed',()=>{const c=capture();c.labels=[];c.geometry=[{id:'tick-x-1',kind:'tick',axis:'x',value:'1',requiredLabelId:'tick-x-1-label',points:[[100,96],[100,104]],client:{x:100,y:96,width:0,height:8},strokeWidthPx:0}];const r=analyzeRenderedLayout(c);assert.ok(r.errors.includes('REQUIRED_TICK_LABEL_MISSING_OR_MISOWNED:tick-x-1-label'));assert.equal(r.tickLabelEvidence[0].status,'FAIL');});
test('y=1 unit tick ownership is recognized',()=>{const c=tickCapture({id:'model-y-unit',axis:'y',value:1,point:[160,100],box:{x:148,y:94,width:12,height:12}});c.labels[0].value='1';c.labels[0].tickDisplayValue='1';assert.equal(analyzeRenderedLayout(c).tickLabelEvidence[0].status,'PASS');});
test('tick labels reject non-finite, missing, empty, and whitespace primitive values',()=>{for(const value of ['NaN','Infinity','-Infinity','not-a-number',null,'','   ']){const c=tickCapture();c.geometry.find(v=>v.kind==='tick').value=value;assert.ok(analyzeRenderedLayout(c).errors.includes('TICK_LABEL_PRIMITIVE_VALUE_INVALID:tick-x--2-label'),String(value));}});
test('tick labels reject missing, empty, whitespace, and non-finite bound numeric fields',()=>{for(const value of ['NaN','Infinity','-Infinity',null,'','   ']){const c=tickCapture();c.labels[0].tickValue=value;assert.ok(analyzeRenderedLayout(c).errors.includes('TICK_LABEL_VALUE_INVALID:tick-x--2-label'),String(value));}for(const value of ['NaN','Infinity','-Infinity',null,'','   ']){const c=tickCapture();c.labels[0].tickDisplayValue=value;assert.ok(analyzeRenderedLayout(c).errors.includes('TICK_LABEL_DISPLAY_VALUE_INVALID:tick-x--2-label'),String(value));}});
test('valid negative, zero, and positive tick values remain legal',()=>{for(const value of [-5,0,5]){const c=tickCapture({id:`tick-x-${value}`,value});assert.equal(analyzeRenderedLayout(c).tickLabelEvidence[0].status,'PASS',String(value));}});
test('visible frozen outline tick content passes its browser visibility evidence contract',()=>{const c=tickCapture();c.labels[0].font='FROZEN_OUTLINE';c.labels[0].renderedVisibility=visibleMeasurement(c.labels[0].id,c.labels[0].client,'OUTLINE');assert.equal(analyzeRenderedLayout(c).status,'PASS');});
test('missing or hidden painted tick content fails closed',()=>{const c=tickCapture();c.labels[0].renderedVisibility.content[0].fill='none';assert.ok(analyzeRenderedLayout(c).errors.includes('TICK_LABEL_NOT_VISIBLE:tick-x--2-label'));const outline=tickCapture();outline.labels[0].font='FROZEN_OUTLINE';outline.labels[0].renderedVisibility=visibleMeasurement(outline.labels[0].id,outline.labels[0].client,'OUTLINE');outline.labels[0].renderedVisibility.content[0].ancestors[0].opacity=0;assert.ok(analyzeRenderedLayout(outline).errors.includes('TICK_LABEL_NOT_VISIBLE:tick-x--2-label'));});
function renderedTickSvg({labelX=34.84,labelY=178,tickX=34.84,owner='tick-x--2',axisY=160,value='-2',neighbor=false,kind='TEXT'}={}) {
  const extra=neighbor?'<line id="tick-x--1" data-role="tick" data-axis="x" data-value="-1" x1="70" y1="156" x2="70" y2="164" stroke="#111"/>':'';
  const display=value.replaceAll('-','−');
  const label=kind==='OUTLINE'?`<g id="${owner}-label" data-label-kind="TICK_LABEL" data-visual-role="tick-label" data-priority="0" data-owner="${owner}" data-tick-owner="${owner}" data-tick-axis="x" data-tick-value="${value}" data-tick-display-value="${display}" data-tick-source-x="${tickX}" data-tick-source-y="${axisY}" data-font-px="12" data-fragment-sha="sha256:${'a'.repeat(64)}" transform="translate(${labelX-7} ${labelY-6})"><path data-c="35" d="M0 0H14V12H0Z" fill="#111"/></g>`:`<text id="${owner}-label" data-label-kind="TICK_LABEL" data-visual-role="tick-label" data-priority="0" data-owner="${owner}" data-tick-owner="${owner}" data-tick-axis="x" data-tick-value="${value}" data-tick-display-value="${display}" data-tick-source-x="${tickX}" data-tick-source-y="${axisY}" x="${labelX}" y="${labelY}" text-anchor="middle" dominant-baseline="central" font-size="12">${display}</text>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 500" width="620" height="500" data-publication-profile="fragment-publication-spike-v1"><defs><clipPath id="emptyClip"><rect x="0" y="0" width="0" height="0"/></clipPath><mask id="emptyMask"><rect x="0" y="0" width="620" height="500" fill="black"/></mask></defs><g id="axis-geometry-wrapper"><line id="x-axis" data-role="axis" data-axis="x" x1="20" y1="${axisY}" x2="400" y2="${axisY}" stroke="#111"/></g><g id="tick-geometry-wrapper"><line id="${owner}" data-role="tick" data-axis="x" data-value="${value}" data-required-label-id="${owner}-label" x1="${tickX}" y1="${axisY-4}" x2="${tickX}" y2="${axisY+4}" stroke="#111"/></g>${extra}<g id="${owner}-wrapper">${label}</g></svg>`;
}
test('Playwright DOM measurements reject the final-SVG cubic panel reproduction and adjacent tick confusion',async()=>{
  const browser=await launchBrowser();try{const page=await browser.newPage({viewport:{width:620,height:500}});
    const normal=analyzeRenderedLayout(await captureAtDisplaySize(page,renderedTickSvg(),{width:620,height:500}));assert.equal(normal.status,'PASS',JSON.stringify({errors:normal.errors,evidence:normal.tickLabelEvidence}));
    const cubic=analyzeRenderedLayout(await captureAtDisplaySize(page,renderedTickSvg({labelX:182.3,labelY:32}),{width:620,height:500}));assert.ok(cubic.errors.includes('TICK_LABEL_ALONG_AXIS_MISALIGNMENT:tick-x--2-label'));
    const adjacent=analyzeRenderedLayout(await captureAtDisplaySize(page,renderedTickSvg({labelX:70,neighbor:true}),{width:620,height:500}));assert.ok(adjacent.errors.includes('TICK_LABEL_ALONG_AXIS_MISALIGNMENT:tick-x--2-label'));
    const quartic=analyzeRenderedLayout(await captureAtDisplaySize(page,renderedTickSvg({owner:'tick-x-3',value:'3',tickX:300,axisY:200,labelX:300,labelY:218}),{width:620,height:500}));assert.equal(quartic.status,'PASS');
    const smallFontSvg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 620 500" width="620" height="500" data-publication-profile="fragment-publication-spike-v1"><text id="small-publication-label" data-label-kind="EQUATION_LABEL" data-priority="1" x="80" y="80" font-family="serif" font-size="10">f(x)</text></svg>';
    const desktopCapture=await captureAtDisplaySize(page,smallFontSvg,{width:620,height:500},{publicationViewport:{width:1440,height:1000}}),desktop=analyzeRenderedLayout(desktopCapture);
    assert.deepEqual(desktopCapture.publicationViewport,{width:1440,height:1000});assert.ok(desktop.errors.includes('PUBLICATION_FONT_BELOW_11_CSS_PX:small-publication-label'));
    const mobileCapture=await captureAtDisplaySize(page,smallFontSvg,{width:390,height:314},{publicationViewport:{width:390,height:844}}),mobile=analyzeRenderedLayout(mobileCapture);
    assert.deepEqual(mobileCapture.publicationViewport,{width:390,height:844});assert.ok(!mobile.errors.includes('PUBLICATION_FONT_BELOW_11_CSS_PX:small-publication-label'));assert.equal(mobile.status,'PASS');
  }finally{await browser.close();}
});
test('Playwright checks actual visible text and frozen-outline content through ancestor paint state',async()=>{
  const browser=await launchBrowser();try{const page=await browser.newPage({viewport:{width:620,height:500}}),textSvg=renderedTickSvg(),outlineSvg=renderedTickSvg({kind:'OUTLINE'});
    const analyze=async(svg,mutation)=>{await captureAtDisplaySize(page,svg,{width:620,height:500});if(mutation)await page.evaluate(({id,selector,attr,value,remove})=>{const element=selector?document.querySelector(selector):document.getElementById(id);if(!element)throw Error('VISIBILITY_MUTATION_TARGET_MISSING');if(remove)element.removeAttribute(attr);else element.setAttribute(attr,value);},mutation);return analyzeRenderedLayout(await collectRenderedLayout(page,{width:620,height:500}));};
    const visibleText=await analyze(textSvg);assert.equal(visibleText.status,'PASS',JSON.stringify(visibleText.errors));
    for(const mutation of [
      {id:'tick-x--2-label',attr:'opacity',value:'0'},
      {id:'tick-x--2-wrapper',attr:'opacity',value:'0'},
      {id:'tick-x--2-wrapper',attr:'visibility',value:'hidden'},
      {id:'tick-x--2-wrapper',attr:'display',value:'none'},
      {id:'tick-x--2-label',attr:'fill-opacity',value:'0'},
      {id:'tick-x--2-label',attr:'fill',value:'none'}
    ]){const result=await analyze(textSvg,mutation);assert.ok(result.errors.includes('TICK_LABEL_NOT_VISIBLE:tick-x--2-label'),JSON.stringify({mutation,errors:result.errors}));}
    const visibleOutline=await analyze(outlineSvg);assert.equal(visibleOutline.status,'PASS',JSON.stringify(visibleOutline.errors));
    for(const mutation of [
      {selector:'#tick-x--2-label path',attr:'opacity',value:'0'},
      {id:'tick-x--2-wrapper',attr:'opacity',value:'0'},
      {selector:'#tick-x--2-label path',attr:'fill',value:'none'},
      {selector:'#tick-x--2-label path',attr:'fill-opacity',value:'0'}
    ]){const result=await analyze(outlineSvg,mutation);assert.ok(result.errors.includes('TICK_LABEL_NOT_VISIBLE:tick-x--2-label'),JSON.stringify({mutation,errors:result.errors}));}
  }finally{await browser.close();}
});
test('Playwright rejects label and ancestor clip-path or mask hiding for text and frozen outlines',async()=>{
  const browser=await launchBrowser();try{const page=await browser.newPage({viewport:{width:620,height:500}});
    const analyze=async(kind,target,attr,value)=>{const svg=renderedTickSvg({kind});await captureAtDisplaySize(page,svg,{width:620,height:500});await page.evaluate(({target,attr,value})=>document.getElementById(target).setAttribute(attr,value),{target,attr,value});return analyzeRenderedLayout(await collectRenderedLayout(page,{width:620,height:500}));};
    for(const kind of ['TEXT','OUTLINE']){
      const visible=analyzeRenderedLayout(await captureAtDisplaySize(page,renderedTickSvg({kind}),{width:620,height:500}));assert.equal(visible.status,'PASS',JSON.stringify({kind,errors:visible.errors}));
      for(const [target,attr,value] of [['tick-x--2-label','clip-path','url(#emptyClip)'],['tick-x--2-wrapper','clip-path','url(#emptyClip)'],['tick-x--2-label','mask','url(#emptyMask)'],['tick-x--2-wrapper','mask','url(#emptyMask)']]){
        const result=await analyze(kind,target,attr,value);assert.ok(result.errors.includes('TICK_LABEL_NOT_VISIBLE:tick-x--2-label'),JSON.stringify({kind,target,attr,errors:result.errors}));
      }
      const unsupported=await analyze(kind,'tick-x--2-wrapper','clip-path','circle(5px at 0 0)');assert.ok(unsupported.errors.includes('TICK_LABEL_VISIBILITY_UNSUPPORTED:tick-x--2-label'),JSON.stringify({kind,errors:unsupported.errors}));
    }
  }finally{await browser.close();}
});
test('Playwright requires painted visible owner tick and axis geometry, including ancestors',async()=>{
  const browser=await launchBrowser();try{const page=await browser.newPage({viewport:{width:620,height:500}});
    const analyze=async(mutation)=>{await captureAtDisplaySize(page,renderedTickSvg(),{width:620,height:500});await page.evaluate(({id,attr,value})=>document.getElementById(id).setAttribute(attr,value),mutation);return analyzeRenderedLayout(await collectRenderedLayout(page,{width:620,height:500}));};
    for(const mutation of [
      {id:'tick-x--2',attr:'opacity',value:'0'},
      {id:'tick-geometry-wrapper',attr:'display',value:'none'},
      {id:'tick-geometry-wrapper',attr:'visibility',value:'hidden'},
      {id:'tick-x--2',attr:'stroke',value:'none'},
      {id:'tick-x--2',attr:'stroke-opacity',value:'0'}
    ]){const result=await analyze(mutation);assert.ok(result.errors.includes('TICK_LABEL_OWNER_NOT_VISIBLE:tick-x--2-label'),JSON.stringify({mutation,errors:result.errors}));}
    for(const mutation of [
      {id:'x-axis',attr:'opacity',value:'0'},
      {id:'axis-geometry-wrapper',attr:'display',value:'none'},
      {id:'axis-geometry-wrapper',attr:'visibility',value:'hidden'},
      {id:'x-axis',attr:'stroke',value:'none'},
      {id:'x-axis',attr:'stroke-opacity',value:'0'}
    ]){const result=await analyze(mutation);assert.ok(result.errors.includes('TICK_LABEL_AXIS_NOT_VISIBLE:tick-x--2-label'),JSON.stringify({mutation,errors:result.errors}));}
  }finally{await browser.close();}
});
test('Playwright rejects invalid or blank tick numeric attributes and accepts negative, zero, and positive values',async()=>{
  const browser=await launchBrowser();try{const page=await browser.newPage({viewport:{width:620,height:500}});
    const analyze=async(svg,mutation)=>{await captureAtDisplaySize(page,svg,{width:620,height:500});if(mutation)await page.evaluate(({id,attr,value,remove})=>{const element=document.getElementById(id);if(!element)throw Error('NUMERIC_MUTATION_TARGET_MISSING');if(remove)element.removeAttribute(attr);else element.setAttribute(attr,value);},mutation);return analyzeRenderedLayout(await collectRenderedLayout(page,{width:620,height:500}));};
    for(const value of ['-5','0','5']){const result=await analyze(renderedTickSvg({value}));assert.equal(result.status,'PASS',JSON.stringify({value,errors:result.errors}));}
    for(const value of ['NaN','Infinity','-Infinity','not-a-number','','   ']){const result=await analyze(renderedTickSvg(),{id:'tick-x--2',attr:'data-value',value});assert.ok(result.errors.includes('TICK_LABEL_PRIMITIVE_VALUE_INVALID:tick-x--2-label'),JSON.stringify({value,errors:result.errors}));}
    const missingPrimitive=await analyze(renderedTickSvg(),{id:'tick-x--2',attr:'data-value',remove:true});assert.ok(missingPrimitive.errors.includes('TICK_LABEL_PRIMITIVE_VALUE_INVALID:tick-x--2-label'));
    for(const value of ['NaN','Infinity','-Infinity','','   ']){const result=await analyze(renderedTickSvg(),{id:'tick-x--2-label',attr:'data-tick-value',value});assert.ok(result.errors.includes('TICK_LABEL_VALUE_INVALID:tick-x--2-label'),JSON.stringify({value,errors:result.errors}));}
    const missingBoundValue=await analyze(renderedTickSvg(),{id:'tick-x--2-label',attr:'data-tick-value',remove:true});assert.ok(missingBoundValue.errors.includes('TICK_LABEL_VALUE_INVALID:tick-x--2-label'));
    for(const value of ['NaN','Infinity','-Infinity','','   ']){const result=await analyze(renderedTickSvg(),{id:'tick-x--2-label',attr:'data-tick-display-value',value});assert.ok(result.errors.includes('TICK_LABEL_DISPLAY_VALUE_INVALID:tick-x--2-label'),JSON.stringify({value,errors:result.errors}));}
    const missingDisplayValue=await analyze(renderedTickSvg(),{id:'tick-x--2-label',attr:'data-tick-display-value',remove:true});assert.ok(missingDisplayValue.errors.includes('TICK_LABEL_DISPLAY_VALUE_INVALID:tick-x--2-label'));
  }finally{await browser.close();}
});
