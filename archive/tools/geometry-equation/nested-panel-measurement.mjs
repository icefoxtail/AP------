import crypto from 'node:crypto';

// Only the producer's exact, hash-bound SVG image envelope is replayable. This is
// an inspector DOM operation: the served composite/embedded bytes are never edited.
export function decodeMeasuredPanel({href,sha256}) {
  if(typeof href!=='string'||!/^data:image\/svg\+xml;base64,[A-Za-z0-9+/]+={0,2}$/.test(href))throw Error('NESTED_PANEL_DATA_URI_REQUIRED');
  const encoded=href.slice(href.indexOf(',')+1),bytes=Buffer.from(encoded,'base64');
  if(bytes.toString('base64')!==encoded)throw Error('NESTED_PANEL_BASE64_NONCANONICAL');
  const actual='sha256:'+crypto.createHash('sha256').update(bytes).digest('hex');
  if(sha256!==actual)throw Error('NESTED_PANEL_SHA_MISMATCH');
  const svg=new TextDecoder('utf-8',{fatal:true}).decode(bytes);
  if(!svg.startsWith('<svg ')||/<(?:script|foreignObject|style|iframe|object)\b/i.test(svg)||/\bon\w+\s*=/i.test(svg))throw Error('NESTED_PANEL_UNSUPPORTED_CONTENT');
  return {svg,sha256:actual,bytes:bytes.length};
}

export async function withMeasuredPanels(page,selector,publicationViewport,collect,depth=0) {
  if(depth>8)throw Error('NESTED_PANEL_DEPTH_LIMIT');
  const capture=await collect(page,publicationViewport,selector);
  const panels=await page.evaluate(selector=>{
    const root=document.querySelector(selector);
    const rect=e=>{const b=e.getBoundingClientRect();return{x:b.x,y:b.y,width:b.width,height:b.height};};
    const matrix=e=>{const m=e.getScreenCTM();return m?{a:m.a,b:m.b,c:m.c,d:m.d,e:m.e,f:m.f}:null;};
    return [...root.querySelectorAll('image')].map((e,index)=>({index,id:e.id,href:e.getAttribute('href'),sha256:e.getAttribute('data-panel-svg-sha'),rect:rect(e),matrix:matrix(e)}));
  },selector);
  if(!panels.length)return capture;
  if(panels.length>32)throw Error('NESTED_PANEL_COUNT_LIMIT');
  capture.nestedPanels=[];
  for(const panel of panels){
    const decoded=decodeMeasuredPanel(panel),token='panel-'+crypto.randomUUID();
    let mounted=false;
    try{
      const replay=await page.evaluate(({selector,panel,decoded,token})=>{
        const root=document.querySelector(selector),image=[...root.querySelectorAll('image')][panel.index];
        if(!image||image.id!==panel.id||image.getAttribute('href')!==panel.href)throw Error('NESTED_PANEL_SOURCE_CHANGED');
        const doc=new DOMParser().parseFromString(decoded.svg,'image/svg+xml'),source=doc.documentElement;
        if(doc.querySelector('parsererror')||source.localName!=='svg')throw Error('NESTED_PANEL_PARSE_FAIL');
        const width=Number(image.getAttribute('width')),height=Number(image.getAttribute('height')),x=Number(image.getAttribute('x')||0),y=Number(image.getAttribute('y')||0),vb=source.viewBox.baseVal;
        if(![width,height,x,y].every(Number.isFinite)||width<=0||height<=0||Number(source.getAttribute('width'))!==width||Number(source.getAttribute('height'))!==height||vb.x!==0||vb.y!==0||vb.width!==width||vb.height!==height)throw Error('NESTED_PANEL_NATURAL_VIEWPORT_MISMATCH');
        if(source.hasAttribute('transform'))throw Error('NESTED_PANEL_SOURCE_TRANSFORM_UNSUPPORTED');
        if(image.hasAttribute('clip-path')||image.hasAttribute('mask')||image.hasAttribute('style')||image.hasAttribute('filter')||image.getAttribute('preserveAspectRatio')&&!['xMidYMid meet','xMidYMid'].includes(image.getAttribute('preserveAspectRatio')))throw Error('NESTED_PANEL_IMAGE_EFFECT_UNSUPPORTED');
        const inline=document.importNode(source,true),prefix=token+'-',ids=new Map([...inline.querySelectorAll('[id]'),inline].filter(e=>e.id).map(e=>[e.id,prefix+e.id]));
        const refs=new Set(['href','xlink:href','aria-labelledby','aria-describedby','data-owner','data-owner-label','data-owner-points','data-tick-owner','data-required-label-id','data-occluded-primitives']);
        for(const e of [inline,...inline.querySelectorAll('*')])for(const a of [...e.attributes]){
          if(a.name==='id')e.setAttribute(a.name,ids.get(a.value));
          else if(refs.has(a.name))e.setAttribute(a.name,a.value.split(/(\s+)/).map(v=>ids.has(v)?ids.get(v):v.startsWith('#')&&ids.has(v.slice(1))?'#'+ids.get(v.slice(1)):v).join(''));
          else if(a.value.includes('url('))e.setAttribute(a.name,a.value.replace(/url\(#([^)]*)\)/g,(all,id)=>ids.has(id)?'url(#'+ids.get(id)+')':all));
        }
        inline.setAttribute('x',String(x));inline.setAttribute('y',String(y));inline.setAttribute('width',String(width));inline.setAttribute('height',String(height));inline.setAttribute('data-measured-panel',token);
        if(image.hasAttribute('transform'))inline.setAttribute('transform',image.getAttribute('transform'));
        const expectedLabelIds=[...inline.querySelectorAll('text,g[data-fragment-sha]')].map(e=>e.id.slice(prefix.length)).sort();
        if(expectedLabelIds.some(id=>!id)||new Set(expectedLabelIds).size!==expectedLabelIds.length)throw Error('NESTED_PANEL_LABEL_IDS_REQUIRED');
        const expected=image.getScreenCTM().translate(x,y),originalRect=image.getBoundingClientRect();
        window.__geometryMeasuredPanels??=new Map();window.__geometryMeasuredPanels.set(token,{image,inline});image.replaceWith(inline);
        const m=inline.getScreenCTM(),domRect=inline.getBoundingClientRect(),corners=[[0,0],[width,0],[0,height],[width,height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m)),xs=corners.map(p=>p.x),ys=corners.map(p=>p.y),r={x:Math.min(...xs),y:Math.min(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)},matrix=v=>({a:v.a,b:v.b,c:v.c,d:v.d,e:v.e,f:v.f}),rect=v=>({x:v.x,y:v.y,width:v.width,height:v.height});
        const evidence={sourceImageId:panel.id,expectedLabelIds,sourceSha256:decoded.sha256,sourceBytes:decoded.bytes,naturalViewport:{width,height,viewBox:{x:vb.x,y:vb.y,width:vb.width,height:vb.height}},preserveAspectRatio:image.getAttribute('preserveAspectRatio')||'xMidYMid meet',sourceTransform:image.getAttribute('transform'),sourceImageMatrix:panel.matrix,expectedInlineMatrix:matrix(expected),inlineMatrix:matrix(m),sourceImageRect:rect(originalRect),inlineRect:rect(r),inlineDomRect:rect(domRect),inlineViewportRectMode:'ACTUAL_CTM_PROJECTED_NATURAL_VIEWPORT',inlineOverflow:getComputedStyle(inline).overflow};
        if(getComputedStyle(inline).overflow!=='hidden')throw Error('NESTED_PANEL_REPLAY_CLIP_REQUIRED');
        if(['a','b','c','d','e','f'].some(k=>Math.abs(m[k]-expected[k])>1e-5)||['x','y','width','height'].some(k=>Math.abs(r[k]-originalRect[k])>.02)){
          inline.replaceWith(image);window.__geometryMeasuredPanels.delete(token);throw Error('NESTED_PANEL_REPLAY_TRANSFORM_MISMATCH:'+JSON.stringify(evidence));
        }
        return evidence;
      },{selector,panel,decoded,token});
      mounted=true;
      const child=await withMeasuredPanels(page,`[data-measured-panel="${token}"]`,publicationViewport,collect,depth+1);
      // Keep original source IDs in each independently checked panel scope. A
      // deterministic panel path namespaces the aggregated measurement inventory.
      const restoreId=v=>typeof v==='string'?v.replaceAll(token+'-',''):v;
      const restoreTree=v=>Array.isArray(v)?v.map(restoreTree):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,value])=>[restoreId(k),restoreTree(value)])):restoreId(v);
      const restored=restoreTree(child),measuredLabelIds=restored.labels.map(label=>label.id).sort();
      if(JSON.stringify(measuredLabelIds)!==JSON.stringify(replay.expectedLabelIds))throw Error('NESTED_PANEL_LABEL_INVENTORY_MISMATCH');
      capture.nestedPanels.push({...replay,measuredLabelIds,labelInventoryExact:true,capture:restored});
    }finally{
      await page.evaluate(({token,mounted})=>{const entry=window.__geometryMeasuredPanels?.get(token);if(!entry){if(mounted)throw Error('NESTED_PANEL_RESTORE_MISSING');return;}entry.inline.replaceWith(entry.image);window.__geometryMeasuredPanels.delete(token);if(!window.__geometryMeasuredPanels.size)delete window.__geometryMeasuredPanels;},{token,mounted});
    }
  }
  return capture;
}

// The authoring engine emits double-quoted canonical attributes. Readback checks
// that every exact source glyph (including opaque panels) has one measured row.
export function measuredLabelInventory(svg,depth=0) {
  if(depth>8)throw Error('NESTED_PANEL_DEPTH_LIMIT');
  const labels=[],panels=[];
  for(const hit of svg.matchAll(/<(text|g|image)\b([^>]*)>/g)){
    const attrs=Object.fromEntries([...hit[2].matchAll(/([\w:-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]]));
    if(hit[1]==='text'||hit[1]==='g'&&attrs['data-fragment-sha']){
      if(!attrs.id||labels.includes(attrs.id))throw Error('NESTED_PANEL_LABEL_IDS_REQUIRED');labels.push(attrs.id);
    }
    if(hit[1]==='image'){
      if(!attrs.id||panels.some(p=>p.id===attrs.id))throw Error('NESTED_PANEL_IMAGE_ID_REQUIRED');
      const decoded=decodeMeasuredPanel({href:attrs.href,sha256:attrs['data-panel-svg-sha']});
      panels.push({id:attrs.id,sha256:decoded.sha256,inventory:measuredLabelInventory(decoded.svg,depth+1)});
    }
  }
  return {labels:labels.sort(),panels};
}
export function verifyMeasuredLabelInventory(svg,layout) {
  const inventory=measuredLabelInventory(svg);
  const verify=(inventory,layout)=>{
    const expected=[...inventory.labels,...inventory.panels.flatMap(p=>allIds(p.inventory).map(id=>p.id+'/'+id))].sort();
    const actual=layout.labelMeasurements?.map(label=>label.id).sort();
    for(const label of layout.labelMeasurements||[])if(label.font==='FROZEN_OUTLINE'){
      const observation=label.fontMeasurement;
      if(!Number.isFinite(label.baseFontPx)||label.baseFontPx<=0||observation?.metadataFontPx!==label.baseFontPx||!Array.isArray(observation.boundaries)||!observation.boundaries.length)throw Error('OUTLINE_FONT_METADATA_REQUIRED');
      const values=observation.boundaries.map(boundary=>{const m=boundary.matrix,units=boundary.kind==='FONT_UNITS'?boundary.unitsPerEm:boundary.fontPx;if(!m||!['a','b','c','d','e','f'].every(k=>Number.isFinite(m[k]))||!Number.isFinite(units)||units<=0)throw Error('OUTLINE_FONT_MATRIX_REQUIRED');const sum=m.a*m.a+m.b*m.b+m.c*m.c+m.d*m.d,det=m.a*m.d-m.b*m.c;return units*Math.sqrt(Math.max(0,(sum-Math.sqrt(Math.max(0,sum*sum-4*det*det)))/2));});
      if(!Number.isFinite(label.finalViewportCssFontPx)||Math.abs(Math.min(...values)-label.finalViewportCssFontPx)>1e-5)throw Error('OUTLINE_FONT_OBSERVATION_MISMATCH');
    }
    if(JSON.stringify(expected)!==JSON.stringify(actual))throw Error('NESTED_PANEL_LABEL_INVENTORY_MISMATCH');
    const evidence=layout.nestedPanelEvidence||[];
    if(evidence.length!==inventory.panels.length)throw Error('NESTED_PANEL_EVIDENCE_MISSING');
    for(const panel of inventory.panels){
      const matches=evidence.filter(e=>e.sourceImageId===panel.id),row=matches[0];
      if(matches.length!==1||row.inlineOverflow!=='hidden'||row.inlineViewportRectMode!=='ACTUAL_CTM_PROJECTED_NATURAL_VIEWPORT'||row.sourceSha256!==panel.sha256||row.labelInventoryExact!==true||JSON.stringify(row.expectedLabelIds)!==JSON.stringify(panel.inventory.labels)||JSON.stringify(row.measuredLabelIds)!==JSON.stringify(panel.inventory.labels))throw Error('NESTED_PANEL_SOURCE_BINDING_MISMATCH');
      if(!['a','b','c','d','e','f'].every(k=>Number.isFinite(row.inlineMatrix?.[k])&&Math.abs(row.inlineMatrix[k]-row.expectedInlineMatrix?.[k])<=1e-5)||!['x','y','width','height'].every(k=>Number.isFinite(row.inlineRect?.[k])&&Math.abs(row.inlineRect[k]-row.sourceImageRect?.[k])<=.02))throw Error('NESTED_PANEL_REPLAY_TRANSFORM_MISMATCH');
      verify(panel.inventory,row.layout);
    }
  };
  const allIds=inventory=>[...inventory.labels,...inventory.panels.flatMap(p=>allIds(p.inventory).map(id=>p.id+'/'+id))];
  verify(inventory,layout);return {labelCount:allIds(inventory).length,panelCount:inventory.panels.length};
}
