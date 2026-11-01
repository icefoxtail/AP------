// Point display names: a point keeps a simple ASCII id (A, B, T1, T2 ...) and may carry a separate DISPLAY name (T1 -> T_1, Ap -> A').
// One plan field everywhere:  plan.pointNames = { "<point id>": "<display name>" }   (construction plan, graph plan, number-line figure/panel plan).
// A display name is ONE capital letter, then optional prime(s), then optional subscript digits 1-9 (at most two):
//   T₁  T_1  T_{1}  A′  A'  A″  A''  A′₁  A'_{12}      (the spellings of one name are equivalent: they all draw the same glyphs)
// (or a coordinate-pair name with a letter, (2,k): see COORD below). Anything else is POINT_DISPLAY_NAME_INVALID. The id never appears in the figure when a display name exists.
const SUB='₁₂₃₄₅₆₇₈₉';
const NAME=/^([A-Z])(′′|″|''|′|')?(?:_\{([1-9]{1,2})\}|_([1-9])|([₁-₉]{1,2}))?$/u;
const fail=(code,id)=>{throw Error(id===undefined?code:code+':'+id);};

// A point may also be named by a coordinate pair with a letter in it, (2,k) or (a,0) or (k,-1) (G12-3): a source figure that writes the unknown coordinate beside a point.
// Each part is a whole number (a minus sign allowed) or one letter, and at least one part is a letter; the name is read as a name, never compared with the point's true coordinates.
const COORD=/^\(\s*(-?\d{1,3}|[A-Za-z])\s*,\s*(-?\d{1,3}|[A-Za-z])\s*\)$/u;
/** {letter, primes (0..2), sub (digit text)} of a display name, {coord:[a,b]} for a coordinate-pair name, or null when it is not an allowed form. */
export function parsePointName(raw){
  if(typeof raw!=='string')return null;
  const pair=COORD.exec(raw);
  if(pair)return /[A-Za-z]/u.test(pair[1]+pair[2])?{coord:[pair[1],pair[2]]}:null;
  const m=NAME.exec(raw);if(!m)return null;
  const primeText=m[2]??'',primes=primeText==='′′'||primeText==='″'||primeText==="''"?2:primeText?1:0;
  const sub=m[3]??m[4]??(m[5]?[...m[5]].map(ch=>String(SUB.indexOf(ch)+1)).join(''):'');
  return {letter:m[1],primes,sub};
}
/** TeX the label is typeset from: T_{1}, A', A''_{12}. */
export const pointNameTex=parsed=>parsed.coord?`(${parsed.coord[0]},${parsed.coord[1]})`:parsed.letter+"'".repeat(parsed.primes)+(parsed.sub?`_{${parsed.sub}}`:'');
/** The engine's expression-grammar spelling (a coordinate label's text is parsed as an expression): T_1, A', A''_12. */
export const pointNameExpr=parsed=>parsed.coord?`(${parsed.coord[0]},${parsed.coord[1]})`:parsed.letter+"'".repeat(parsed.primes)+(parsed.sub?'_'+parsed.sub:'');
/** Plain unicode spelling (what a person reads): T₁, A′, A″. */
export const pointNameText=parsed=>parsed.coord?`(${parsed.coord[0]},${parsed.coord[1]})`:parsed.letter+(parsed.primes===2?'″':parsed.primes?'′':'')+[...parsed.sub].map(d=>SUB[Number(d)-1]).join('');

/**
 * The display names of a plan, validated against the point ids the figure really draws.
 * ids: Iterable of point ids the figure can name. Returns {has(id), tex(id) (TeX for a name label), expr(id) (spelling inside an expression label), text(id), size}; tex/text fall back to the id itself.
 */
export function pointNameModel(plan,ids){
  const raw=plan?.pointNames;
  const known=new Set(ids),names=new Map();
  if(raw!==undefined){
    if(!raw||typeof raw!=='object'||Array.isArray(raw)||Object.getPrototypeOf(raw)!==Object.prototype)fail('POINT_DISPLAY_NAME_INVALID','pointNames');
    for(const [id,value] of Object.entries(raw)){
      if(!known.has(id))fail('POINT_NAME_TARGET_UNKNOWN',id);
      const parsed=parsePointName(value);
      if(!parsed)fail('POINT_DISPLAY_NAME_INVALID',id);
      names.set(id,{tex:pointNameTex(parsed),expr:pointNameExpr(parsed),text:pointNameText(parsed),coord:!!parsed.coord});
    }
    const shown=new Map();
    for(const id of known){
      const text=names.get(id)?.text??id;
      if(shown.has(text))fail('POINT_DISPLAY_NAME_DUPLICATE',text);
      shown.set(text,id);
    }
  }
  return {coord:id=>names.get(id)?.coord===true,has:id=>names.has(id),tex:id=>names.get(id)?.tex??id,expr:id=>names.get(id)?.expr??id,text:id=>names.get(id)?.text??id,size:names.size,entries:()=>[...names].map(([id,value])=>({id,...value}))};
}

/** One spelling for comparing observed/expected point names: T_1 = T_{1} = T₁ and A' = A′ ; A'' = A″. */
export const canonicalPointNameText=text=>String(text)
  .replace(/_\{([1-9]{1,2})\}|_([1-9]{1,2})/gu,(_,a,b)=>[...(a??b)].map(d=>SUB[Number(d)-1]).join(''))
  .replace(/\^\{\\prime\}|\\prime/gu,'′').replace(/''|′′/gu,'″').replace(/'/gu,'′');
