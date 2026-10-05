import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = 'C:/Users/work1/Desktop/AP-------h2-math2-independent-review';
const OUT = path.join(ROOT, 'reports/h2-2final-math2-visual/independent-review-20260909');
const DIRS = [
  '25_강남여고_2학기_기말_고2_수학II',
  '25_매산고_2학기_기말_고2_수학II',
  '25_매산여고_2학기_기말_고2_수학II',
  '25_순천고_2학기_기말_고2_수학II',
  '25_제일고_2학기_기말_고2_수학II',
];
function sha256(file) { return `sha256:${crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex')}`; }
function ref(file) { const st=fs.statSync(file); return { path:path.relative(ROOT,file).replaceAll('\\','/'), bytes:st.size, sha256:sha256(file) }; }
function attrs(raw) {
  const out={};
  for (const m of raw.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g)) out[m[1]]=m[3];
  return out;
}
function num(v) { const n=Number(v); return Number.isFinite(n) ? n : v; }
function pointList(raw) { return String(raw||'').trim().split(/\s+/).filter(Boolean).map(pair => { const [x,y]=pair.split(',').map(Number); return {x,y}; }); }
function elementList(svg, tag) {
  const re=new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>|<${tag}\\b([^>]*)/>`, 'g');
  const out=[];
  for (const m of svg.matchAll(re)) { const a=attrs(m[1]||m[3]||''); const inner=m[2]||''; out.push({ attrs:a, text:inner.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\s+/g,' ').trim() }); }
  return out;
}
function staticCheck(svg, rootAttrs, texts) {
  const errors=[];
  if (rootAttrs.xmlns !== 'http://www.w3.org/2000/svg') errors.push('SVG_NAMESPACE');
  const vb=String(rootAttrs.viewBox||'').trim().split(/\s+/).map(Number);
  if (vb.length!==4 || vb.some(x=>!Number.isFinite(x)) || vb[2]<=0 || vb[3]<=0) errors.push('VIEWBOX_INVALID');
  if (!rootAttrs.preserveAspectRatio) errors.push('PRESERVE_ASPECT_RATIO_MISSING');
  if (!/<title\b[^>]*>[^<]+<\/title>/i.test(svg)) errors.push('TITLE_MISSING');
  if (!/<desc\b[^>]*>[^<]+<\/desc>/i.test(svg)) errors.push('DESC_MISSING');
  if (rootAttrs.role !== 'img') errors.push('ROLE_IMG_MISSING');
  if (!rootAttrs['aria-labelledby']) errors.push('ARIA_LABEL_MISSING');
  if (/<script\b|<foreignObject\b|\son[a-z]+\s*=|(?:href|xlink:href)\s*=\s*["'](?!#)/i.test(svg)) errors.push('STATIC_UNSAFE_ELEMENT_OR_REFERENCE');
  if (!texts.length) errors.push('NO_TEXT_OR_GEOMETRY_LABELS');
  return { status:errors.length?'FAIL':'PASS', errors };
}
const records=[];
for (const dir of DIRS) {
  const absDir=path.join(ROOT,'archive/assets/images',dir);
  for (const name of fs.readdirSync(absDir).filter(n=>/^q\d+-solution\.svg$/.test(n)).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true}))) {
    const file=path.join(absDir,name); const svg=fs.readFileSync(file,'utf8');
    const rootMatch=svg.match(/<svg\b([^>]*)>/i); const rootAttrs=attrs(rootMatch?.[1]||'');
    const texts=elementList(svg,'text').map(x=>({ ...x.attrs, text:x.text }));
    const paths=elementList(svg,'path').map(x=>({ ...x.attrs, d:x.attrs.d||null }));
    const polylines=elementList(svg,'polyline').map(x=>({ ...x.attrs, points:pointList(x.attrs.points) }));
    const lines=elementList(svg,'line').map(x=>Object.fromEntries(Object.entries(x.attrs).map(([k,v])=>[k,['x1','y1','x2','y2','stroke-width'].includes(k)?num(v):v])));
    const circles=elementList(svg,'circle').map(x=>Object.fromEntries(Object.entries(x.attrs).map(([k,v])=>[k,['cx','cy','r','stroke-width'].includes(k)?num(v):v])));
    const rects=elementList(svg,'rect').map(x=>Object.fromEntries(Object.entries(x.attrs).map(([k,v])=>[k,['x','y','width','height','rx','ry','stroke-width'].includes(k)?num(v):v])));
    const fileRef=ref(file); const qid=Number(name.match(/^q(\d+)-/)[1]);
    const staticContract=staticCheck(svg,rootAttrs,texts);
    records.push({
      questionUid:`${dir}:q${qid}`,
      svgPath:fileRef.path,
      svgRef:fileRef,
      status:staticContract.status,
      findings:staticContract.errors,
      evidenceRefs:[`u2-artifact-only:${fileRef.sha256}`],
      observedFacts:{
        root:{ xmlns:rootAttrs.xmlns||null, width:num(rootAttrs.width), height:num(rootAttrs.height), viewBox:rootAttrs.viewBox||null, preserveAspectRatio:rootAttrs.preserveAspectRatio||null, role:rootAttrs.role||null, ariaLabelledby:rootAttrs['aria-labelledby']||null },
        staticContract,
        elementCounts:{ path:paths.length, polyline:polylines.length, line:lines.length, circle:circles.length, rect:rects.length, text:texts.length },
        geometry:{ paths, polylines, lines, circles, rects },
        labels:{ title:(svg.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]||'').trim(), desc:(svg.match(/<desc\b[^>]*>([\s\S]*?)<\/desc>/i)?.[1]||'').trim(), texts:texts.map(t=>({x:num(t.x),y:num(t.y),text:t.text,fill:t.fill||null})) },
      },
    });
  }
}
records.sort((a,b)=>a.questionUid.localeCompare(b.questionUid,'ko',{numeric:true}));
fs.mkdirSync(OUT,{recursive:true}); fs.writeFileSync(path.join(OUT,'svg-observed-facts.jsonl'),records.map(x=>JSON.stringify(x)).join('\n')+'\n');
console.log(JSON.stringify({ output:path.join(OUT,'svg-observed-facts.jsonl'), count:records.length, pass:records.filter(x=>x.status==='PASS').length, fail:records.filter(x=>x.status==='FAIL').length }));
