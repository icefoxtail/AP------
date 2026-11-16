import {createRequire} from 'node:module';
const {validateSvgStudentLanguage}=createRequire(import.meta.url)('../../svg-language-contract.cjs');

const PIXEL_EPSILON=1e-5;
const attr=(tag,name)=>tag.match(new RegExp('(?:^| )'+name+'="([^"]*)"'))?.[1];
const separatedPoints=value=>value?.split(' ').map(pair=>pair.split(',').map(Number));
const near=(a,b)=>Math.abs(a-b)<PIXEL_EPSILON;
function expectedAttributes(tag,keys){
  const body=tag.replace(/^<\w+ |\/>$/g,''),parts=[...body.matchAll(/(?:^| )([a-zA-Z][a-zA-Z0-9-]*)="[^"]*"/g)];
  return parts.map(p=>p[0]).join('')===body&&parts.map(p=>p[1]).sort().join(',')===[...keys].sort().join(',');
}

export function auditSourceSchematic(svg,expected){
  const errors=[];
  const parts=svg.match(/^([^]*?)<g id="schematic-geometry">([^]*?)<\/g><g id="schematic-labels">([^]*)<\/g><\/svg>$/);
  const {width,height,title,description,sourceSha256}=expected;
  const header='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+width+' '+height+'" width="'+width+'" height="'+height+
    '" role="img" aria-labelledby="visual-title visual-desc" data-source-png-sha256="'+sourceSha256+'" data-scale-policy="SCHEMATIC_ALLOWED" data-publication-profile="fragment-publication-spike-v1" data-safe-margin="10">'+
    '<title id="visual-title">'+title+'</title><desc id="visual-desc">'+description+'</desc><rect width="'+width+'" height="'+height+'" fill="#fff"/>';
  if(!parts||parts[1]!==header)return {status:'FAIL',errors:['SCHEMATIC_SVG_AUTHORITY_MISMATCH']};
  const tags=[...parts[2].matchAll(/<(line|polyline|circle) [^<>]*\/>/g)];
  const pathCount=Object.keys(expected.paths).length,pointCount=Object.keys(expected.points).length;
  if(tags.map(m=>m[0]).join('')!==parts[2]||tags.length!==pathCount+pointCount)errors.push('SCHEMATIC_PRIMITIVE_INVENTORY_MISMATCH');
  const byId=new Map(tags.map(m=>[attr(m[0],'id'),m]));
  if(byId.size!==tags.length)errors.push('SCHEMATIC_PRIMITIVE_INVENTORY_MISMATCH');
  for(const [id,points] of Object.entries(expected.paths)){
    const m=byId.get(id),firstCurve=id==='exponential'||id==='logOriginal',secondCurve=id==='logarithm'||id==='logShifted';
    const curved=firstCurve||secondCurve, axis=id==='xAxis'||id==='yAxis';
    if(!m||m[1]!== (curved?'polyline':'line')||
      attr(m[0],'data-role')!==(curved?'curve':axis?'axis':'line')){
      errors.push('SCHEMATIC_PATH_MISSING:'+id);continue;
    }
    const extra=secondCurve?['stroke-dasharray']:[];
    const style=firstCurve?['#1f5fa8','3.2']:secondCurve?['#2e7d32','3.2']:id==='secant'?['#b85c00','3.2']:
      axis?['#111','1.8']:id==='AC'||id==='BD'?['#475569','2.2']:['#64748b','2.4'];
    const allowed=['id','data-role','stroke','stroke-width',...(curved?['points','fill',...extra]:['x1','y1','x2','y2'])];
    if(!expectedAttributes(m[0],allowed)||attr(m[0],'stroke')!==style[0]||attr(m[0],'stroke-width')!==style[1]||
      (curved&&attr(m[0],'fill')!=='none')||(extra.length&&attr(m[0],'stroke-dasharray')!=='8 4'))
      errors.push('SCHEMATIC_PATH_STYLE_CHANGED:'+id);
    const got=curved?separatedPoints(attr(m[0],'points')):[1,2].map(i=>['x','y'].map(a=>Number(attr(m[0],a+i))));
    if(!got||got.length!==points.length||got.some((p,i)=>p.length!==2||p.some((v,j)=>!near(v,points[i][j]))))
      errors.push('SCHEMATIC_PATH_CHANGED:'+id);
  }
  for(const [id,[x,y]] of Object.entries(expected.points)){
    const m=byId.get(id);
    if(!m||m[1]!=='circle'||attr(m[0],'data-role')!=='point'||Number(attr(m[0],'r'))!==4.5||
      !near(Number(attr(m[0],'cx')),x)||!near(Number(attr(m[0],'cy')),y)||
      !expectedAttributes(m[0],['id','data-role','cx','cy','r','fill'])||attr(m[0],'fill')!=='#111')
      errors.push('SCHEMATIC_POINT_CHANGED:'+id);
  }
  // Only the exact generated glyph groups may appear in this part of the SVG.
  if(parts[3]!==expected.groups.map(g=>g.group).join(''))errors.push('SCHEMATIC_LABELS_CHANGED');
  const language=validateSvgStudentLanguage(svg,{assetRef:'source schematic'});
  if(language.status!=='PASS')errors.push(...language.errors.map(e=>e.code));
  return {status:errors.length?'FAIL':'PASS',errors,pathsVerified:pathCount,pointsVerified:pointCount,labelsVerified:expected.groups.length};
}
