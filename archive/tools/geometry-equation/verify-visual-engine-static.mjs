import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {verifySvgCoordinateParity} from './verify-svg-coordinate-parity.mjs';
import {observeExtraPrimitives} from './verify-visual-extra-primitives.mjs';

export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const decode = text => text.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#x([0-9a-f]+);/gi,(_,x)=>String.fromCodePoint(parseInt(x,16))).replace(/&#(\d+);/g,(_,x)=>String.fromCodePoint(Number(x)));
export function structural(svg) {
  const errors=[];const ids=[...svg.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  if(new Set(ids).size!==ids.length)errors.push('DUPLICATE_SVG_ID');
  for(const field of ['viewBox','preserveAspectRatio'])if(!new RegExp('<svg\\b[^>]*\\b'+field+'="[^"]+"').test(svg))errors.push('SVG_ROOT_'+field+'_MISSING');
  if(!/<title\b/.test(svg)||!/<desc\b/.test(svg))errors.push('SVG_ACCESSIBILITY_MISSING');
  if(/<(script|foreignObject|image|br)\b|\bon\w+\s*=|<!DOCTYPE|\bhref\s*=\s*["'](?!#)/i.test(svg))errors.push('UNSAFE_SVG_CONTENT');
  if(/<(?:text|tspan)\b[^>]*>[^<]*(?:\\(?:frac|sqrt)|\$)/.test(svg))errors.push('RAW_TEX_IN_SVG');
  const stack=[];
  for(const m of svg.matchAll(/<(\/?)([A-Za-z][\w:-]*)\b([^>]*)>/g)) {
    if(m[1]){if(stack.pop()!==m[2])errors.push('SVG_XML_NESTING_FAIL');}
    else if(!m[3].trim().endsWith('/'))stack.push(m[2]);
  }
  if(stack.length)errors.push('SVG_XML_NESTING_FAIL');
  return {status:errors.length?'FAIL':'PASS',errors};
}

export function displayedMath(svg,expected) {
  const errors=[];const rows=[];const actual=new Map();
  for(const m of svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
    const id=m[1].match(/\bid="([^"]+)"/)?.[1];
    const kind=m[1].match(/data-label-kind="([^"]+)"/)?.[1];
    const tree={children:[]};const stack=[tree];
    for(const token of m[2].match(/<[^>]*>|[^<]+/g)||[]) {
      if(token.startsWith('</')){if(stack.length>1)stack.pop();}
      else if(token.startsWith('<')){const n={super:/baseline-shift="super"/.test(token),children:[]};stack.at(-1).children.push(n);if(!token.endsWith('/>'))stack.push(n);}
      else stack.at(-1).children.push(decode(token));
    }
    const visibleText=n=>typeof n==='string'?n:n.children.map(visibleText).join('');
    const visible=visibleText(tree);const powers=[];
    const walk=n=>{if(typeof n==='string')return;if(n.super)powers.push(visibleText(n));n.children.forEach(walk);};walk(tree);
    if(id)actual.set(id,{visible,powers,kind,math:/data-math="true"/.test(m[1])});
  }
  for(const row of expected||[]) {
    const value=actual.get(row.id);const visible=Array.isArray(row.visible)?row.visible:[row.visible];const pass=value&&visible.includes(value.visible)&&JSON.stringify(value.powers)===JSON.stringify(row.powers||[]);
    rows.push({id:row.id,status:pass?'PASS':'FAIL',observed:value});if(!pass)errors.push('DISPLAYED_MATH_PARITY_FAIL:'+row.id);
  }
  const covered=new Set((expected||[]).map(v=>v.id));
  for(const [id,v] of actual)if((['EQUATION_LABEL','LENGTH_LABEL','COORDINATE_LABEL'].includes(v.kind)||(v.kind==='CONDITION_BOX'&&v.math))&&!covered.has(id))errors.push('DISPLAY_EXPECTATION_MISSING:'+id);
  if(new Set((expected||[]).map(v=>v.id)).size!==(expected||[]).length)errors.push('DUPLICATE_DISPLAY_EXPECTATION');
  return {status:errors.length?'FAIL':'PASS',rows,errors};
}

export function verifyVisualEngineStatic({root=process.cwd(),input}) {
  const svg=fs.readFileSync(path.resolve(root,input.svg),'utf8');
  const checks={structural:structural(svg),actual:verifySvgCoordinateParity({root,input}),extra:observeExtraPrimitives(svg,input),display:displayedMath(svg,input.expectedLabels)};
  const errors=[];
  if(checks.structural.status!=='PASS')errors.push(...checks.structural.errors);
  if(checks.actual.svgMathStatus!=='PASS')errors.push('ACTUAL_SVG_PARITY_FAIL');
  if(checks.extra.status!=='PASS')errors.push(...checks.extra.errors.map(v=>v.error));
  if(checks.display.status!=='PASS')errors.push(...checks.display.errors);
  if(input.witness) {
    const w=JSON.parse(fs.readFileSync(path.resolve(root,input.witness),'utf8'));
    if(w.normalizedSvgSha256!==sha256(svg))errors.push('STALE_WITNESS_SVG_SHA');
    if(w.layout?.unresolved?.length||w.sampling?.some(v=>v.status!=='PASS'))errors.push('BUILD_LAYOUT_OR_SAMPLING_UNRESOLVED');
  }
  if(input.review) {
    const n=input.review.items.reduce((s,v)=>s+v.unresolved,0);
    if(n!==input.review.aggregateUnresolved)errors.push('AGGREGATE_EVIDENCE_FAIL');
    if(n)errors.push('ITEM_REVIEW_UNRESOLVED');
  }
  return {status:errors.length?'FAIL':'PASS',gate:'STATIC_GATE',svgSha256:sha256(svg),
    STATIC_GATE_PASS:!errors.length,MATH_PARITY_PASS:checks.actual.svgMathStatus==='PASS'&&checks.extra.status==='PASS',SEMANTIC_PARITY_PASS:checks.actual.expectedObservedParity==='PASS'&&checks.extra.status==='PASS',DISPLAYED_MATH_PARITY_PASS:checks.display.status==='PASS',checks,errors};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) {
  const arg=k=>process.argv[process.argv.indexOf(k)+1];
  if(!process.argv.includes('--input')||!process.argv.includes('--out'))throw Error('INPUT_AND_OUTPUT_REQUIRED');
  const file=path.resolve(arg('--input'));const out=path.resolve(arg('--out'));const root=process.argv.includes('--root')?path.resolve(arg('--root')):path.dirname(file);
  const repo=fileURLToPath(new URL('../../../',import.meta.url));const allowed=path.resolve(repo,'archive/_generated/geometry-visual-engine');
  if(!out.startsWith(allowed+path.sep))throw Error('EVIDENCE_OUTPUT_SCOPE_VIOLATION');
  const result=verifyVisualEngineStatic({root,input:JSON.parse(fs.readFileSync(file,'utf8'))});fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,errors:result.errors}));if(result.status!=='PASS')process.exitCode=1;
}
