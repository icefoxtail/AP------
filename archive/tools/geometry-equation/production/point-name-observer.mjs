// Independent check of the point names a FINAL svg really shows (it shares no code with the producer's name model or its typesetter call).
// The producer draws a name as MathJax glyph outlines; every outline path carries its glyph code (data-c) and sits at base / subscript (scaled,
// below the baseline) / superscript (scaled, above) level. This reads those back from the svg bytes and compares them with the glyphs the PLAN's
// display name must produce: capital letter (math italic, U+1D434 + index), primes (U+2032 each, superscript), subscript digits (U+0030 + n, subscript).
const NAME=/^([A-Z])(′′|″|''|′|')?(?:_\{([1-9]{1,2})\}|_([1-9])|([₁-₉]{1,2}))?$/u;
const SUBS='₁₂₃₄₅₆₇₈₉';
const hex=n=>n.toString(16).toUpperCase();

/** The glyph tokens a display name must show: [{c:'1D447',level:'base'},{c:'31',level:'sub'}] for T_1; or the plain id's letters when there is no display name. */
export function expectedNameTokens(name){
  const m=NAME.exec(String(name));
  if(!m)return null;
  const primeText=m[2]??'',primes=primeText?(['″',"''",'′′'].includes(primeText)?2:1):0;
  const digits=m[3]??m[4]??[...(m[5]??'')].map(ch=>String(SUBS.indexOf(ch)+1)).join('');
  return [{c:hex(0x1D434+m[1].charCodeAt(0)-65),level:'base'},...Array.from({length:primes},()=>({c:'2032',level:'sup'})),...[...digits].map(d=>({c:hex(0x30+Number(d)),level:'sub'}))];
}

/** Glyph tokens of one label group (its markup), in drawing order. */
export function glyphTokens(markup){
  const out=[],stack=[];
  for(const tag of markup.matchAll(/<g\b[^>]*>|<\/g>|<path\b[^>]*>/gu)){
    const text=tag[0];
    if(text==='</g>'){stack.pop();continue;}
    if(text.startsWith('<g')){
      const parent=stack.length?stack[stack.length-1]:'base';
      const scaled=/transform="[^"]*translate\(\s*[-\d.e]+[ ,]\s*([-\d.e]+)\s*\)\s*scale\(0\.707\)/u.exec(text);
      stack.push(parent!=='base'?parent:scaled?(Number(scaled[1])<0?'sub':'sup'):'base');
      continue;
    }
    const c=/\bdata-c="([0-9A-F]+)"/u.exec(text);
    if(c)out.push({c:c[1],level:stack.length?stack[stack.length-1]:'base'});
  }
  return out;
}

/** The label groups of a final svg: [{id,kind,owner,markup}]. */
export function labelGroups(svg){
  const starts=[...svg.matchAll(/<g id="([^"]+)" data-label-kind="([A-Z_]+)"[^>]*>/gu)];
  return starts.map((m,i)=>{
    const from=m.index+m[0].length,rest=svg.slice(from),stop=rest.search(/<g data-layer="|<\/svg>/u);
    const owner=/\bdata-owner="([^"]*)"/u.exec(m[0])?.[1]??null;
    return {id:m[1],kind:m[2],owner,markup:stop<0?rest:rest.slice(0,stop)};
  });
}

const show=tokens=>tokens.map(t=>t.level==='base'?t.c:t.level+':'+t.c).join(' ');
const same=(a,b)=>a.length===b.length&&a.every((t,i)=>t.c===b[i].c&&t.level===b[i].level);

/**
 * expectations: [{owner, name}] (owner = the label owner id in the svg, name = the plan's display name).
 * A POINT_NAME label of the owner must show exactly the name; an equation (coordinate band) label must start with it and then "(".
 * Returns {status:'PASS'|'FAIL', errors, checked}. A point without a name label in the svg is an error (the name is not shown).
 */
export function observeDisplayedPointNames(svg,expectations){
  const errors=[],groups=labelGroups(svg);let checked=0;
  for(const {owner,name} of expectations){
    const want=expectedNameTokens(name);
    if(!want){errors.push('POINT_DISPLAY_NAME_INVALID:'+owner);continue;}
    const mine=groups.filter(g=>g.owner===owner&&(g.kind==='POINT_NAME'||g.kind==='EQUATION_LABEL'));
    if(!mine.length){errors.push('POINT_DISPLAY_NAME_NOT_SHOWN:'+owner);continue;}
    for(const group of mine){
      const got=glyphTokens(group.markup);checked++;
      const head=got.slice(0,want.length);
      const ok=group.kind==='POINT_NAME'?same(got,want):same(head,want)&&got[want.length]?.c==='28'&&got[want.length].level==='base';
      if(!ok)errors.push('POINT_DISPLAY_NAME_MISMATCH:'+group.id+':shown['+show(group.kind==='POINT_NAME'?got:got.slice(0,want.length+1))+'] plan['+show(want)+']');
    }
  }
  return {status:errors.length?'FAIL':'PASS',errors,checked};
}

/** What a plan promises to show: a construction point is owned by its id, a graph key point by "required-point-<n>" (n counts from 1). */
export function planNameExpectations(plan){
  const names=plan?.pointNames;
  if(!names||typeof names!=='object')return [];
  if(plan.mathPlan)return Object.entries(names).map(([id,name])=>({owner:id,name}));
  const required=plan.graphPlan?.requiredPoints??[],overlay=new Set((plan.graphPlan?.overlays?.points??[]).map(point=>point?.id));
  return Object.entries(names).flatMap(([id,name])=>{
    const index=required.findIndex(point=>point?.id===id);
    if(index>=0)return [{owner:'required-point-'+(index+1),name}];
    return overlay.has(id)?[{owner:id,name}]:[];
  });
}
