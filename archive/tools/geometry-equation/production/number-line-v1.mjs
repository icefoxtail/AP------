import {fileURLToPath} from 'node:url';
import {objectSha,bytesSha} from '../../pipeline-core/canonical.mjs';
import {pythonWorker} from './worker.mjs';
import {pointNameModel} from './point-names.mjs';
import {typesetter} from './typography.mjs';
import {launchBrowser} from '../visual-browser-runtime.mjs';
import {captureAtDisplaySize,analyzeRenderedLayout} from '../verify-rendered-layout.mjs';
import {rat,add,sub,mul,div,sgn,ZERO,parseRat,gcd,valueText,valueTex,checkVariable,NUMBER_LINE_CAPABILITY,NUMBER_LINE_SVG_VERSION,Stop,isDomainCode,esc,overlaps,real,sqrtRat,cmp,approx,floorOf} from './quadratic-inequality-chain-v1.mjs';

// A standalone number-line figure (number-line-figure-v1): rows of solution sets on one shared axis scale, optionally the common part of the rows
// drawn as a last row, integer points over a row, and a row of marked points with an internal division point. Endpoints are exact rationals or an
// affine expression in one parameter (a) drawn at a stated sample value. The engine solves every set exactly; number_line_observer.py re-solves
// the same plan with SymPy and checks the final panel SVG (the engine's own numbers are never trusted).
export const FIGURE_CAPABILITY='number-line-figure-v1';
export const FIGURE_MODEL_VERSION='NUMBER_LINE_FIGURE_MODEL_v1',FIGURE_SPEC_VERSION='NUMBER_LINE_FIGURE_SPEC_v1';
const OBSERVER_SCRIPT=fileURLToPath(new URL('number-line-observer-worker.py',import.meta.url));
const PUBLICATION_VIEWPORT=Object.freeze({width:1440,height:1000});
const bad=code=>{throw Error(code);};
const MAX_ROWS=4,MAX_POINTS=8,MAX_INTEGERS=25,MAX_TICK_INTEGERS=24,MAX_SUBDIVISIONS=8,MIN_TICK_GAP=6;
// A point may be named by one Hangul consonant letter (ㄱ..ㅎ) in place of a capital letter.
const JAMO=/^[\u3131-\u314E]$/u,CAPITAL=/^[A-Z]$/;
// E35: a POINTS point with no value is a letter point (a, -a, n); its id is the name written below its dot.
const SYMBOL_ID=/^-?[a-z]$/;
// E34: a point may also be named by a short Hangul word (뉴욕, 그리니치: 1 to 5 syllables), written as plain text above its dot.
const WORD_NAME=/^[\uAC00-\uD7A3]{2,5}$/u;
const isTextName=name=>JAMO.test(name)||WORD_NAME.test(name);
const pointSlug=id=>CAPITAL.test(id)?id:SYMBOL_ID.test(id)?'s'+id.replace('-','m'):'u'+id.codePointAt(0).toString(16);
const numSlug=text=>text.replace('-','m').replace('/','d');
const isPlain=value=>!!value&&typeof value==='object'&&!Array.isArray(value);
const onlyKeys=(value,keys,code)=>{if(!isPlain(value)||Object.keys(value).some(key=>!keys.includes(key)))bad(code);};
// An end value is a rational [n,d] or, for an end such as sqrt(10) or 1+sqrt(2), a real {p,q,s} = p+q*sqrt(s) (one radical s per plan; the chain module's exact numbers).
const isReal=x=>!Array.isArray(x);
const toReal=x=>isReal(x)?x:asReal(x);
const num=r=>isReal(r)?approx(r):Number(r[0])/Number(r[1]);
const ratText=r=>isReal(r)?valueText(r):r[1]===1n?String(r[0]):r[0]+'/'+r[1];
const asReal=r=>({p:r,q:ZERO,s:1n});
const cmpR=(a,b)=>(!isReal(a)&&!isReal(b))?sgn(sub(a,b)):cmp(toReal(a),toReal(b));
const floorR=r=>{if(isReal(r))return floorOf(r);let q=r[0]/r[1];if(r[0]%r[1]!==0n&&r[0]<0n)q-=1n;return q;};
/** An end value text: an exact rational ("-2", "1/3") or p+q*sqrt(r) in the grammar of integers, a/b, sqrt(...), + - * / and parentheses (for example "sqrt(10)", "-sqrt(10)", "(1+sqrt(2))/2"). */
function parseValue(text,code){
  if(typeof text==='string'&&/^-?\d{1,15}(?:\/\d{1,15})?$/.test(text))return parseRat(text,code);
  if(typeof text!=='string'||!/^[0-9+\-*/()sqrt ]{1,64}$/.test(text)||!text.includes('sqrt'))bad(code);
  const tokens=text.replace(/\s+/g,'').match(/sqrt|\d{1,15}|[+\-*/()]/g)||[];if(tokens.join('')!==text.replace(/\s+/g,''))bad(code);
  let i=0;const peek=()=>tokens[i],take=()=>tokens[i++];
  const surdOf=(a,b)=>a.s!==1n&&b.s!==1n&&a.s!==b.s?bad('NUMBER_LINE_RADICALS_MIXED'):(a.s!==1n?a.s:b.s);
  const radd=(a,b,sg)=>real(sg>0?add(a.p,b.p):sub(a.p,b.p),sg>0?add(a.q,b.q):sub(a.q,b.q),surdOf(a,b));
  const rmul=(a,b)=>{const s=surdOf(a,b);if(a.s===1n||b.s===1n)return real(mul(a.p,b.p),add(mul(a.p,b.q),mul(b.p,a.q)),s);return real(add(mul(a.p,b.p),mul(mul(a.q,b.q),[s,1n])),add(mul(a.p,b.q),mul(b.p,a.q)),s);};
  const rdiv=(a,b)=>{if(b.s!==1n||sgn(b.p)===0)bad(code);return real(div(a.p,b.p),div(a.q,b.p),a.s);};
  const fac=()=>{const t=take();
    if(t==='-'){const v=fac();return real(sub(ZERO,v.p),sub(ZERO,v.q),v.s);}
    if(t==='sqrt'){if(take()!=='(')bad(code);const v=expr();if(take()!==')'||v.s!==1n||sgn(v.p)<0)bad(code);if(sgn(v.p)===0)return asReal(ZERO);const r=sqrtRat(v.p);return real(ZERO,r.q,r.s);}
    if(t==='('){const v=expr();if(take()!==')')bad(code);return v;}
    if(/^\d+$/.test(t??''))return asReal(rat(BigInt(t)));
    return bad(code);};
  const term=()=>{let v=fac();while(peek()==='*'||peek()==='/'){const op=take(),w=fac();v=op==='*'?rmul(v,w):rdiv(v,w);}return v;};
  const expr=()=>{let v=term();while(peek()==='+'||peek()==='-'){const op=take(),w=term();v=radd(v,w,op==='+'?1:-1);}return v;};
  const value=expr();if(i!==tokens.length)bad(code);
  return value.s===1n?value.p:value;
}
// --- ends and pieces -----------------------------------------------------------------------------------------------------------------------
/** TeX and plain text of mul*p+add (p the parameter letter), fractions stacked: (a+2)/3 -> \frac{a+2}{3}. */
function affineTexts(name,m,c){
  const lcm=(x,y)=>x/gcd(x,y)*y,d=lcm(m[1],c[1]),M=m[0]*(d/m[1]),N=c[0]*(d/c[1]);
  const head=M===1n?name:M===-1n?'-'+name:M+name,tail=N>0n?'+'+N:N<0n?String(N):'';
  return {tex:d===1n?head+tail:'\\frac{'+head+tail+'}{'+d+'}',text:d===1n?head+tail:'('+head+tail+')/'+d};
}
function parseEnd(raw,parameter,usedParameter){
  if(raw===null)return null;
  onlyKeys(raw,['value','param','state'],'NUMBER_LINE_PIECE_INVALID');
  if(raw.state!=='OPEN'&&raw.state!=='CLOSED')bad('NUMBER_LINE_PIECE_INVALID');
  if((raw.value===undefined)===(raw.param===undefined))bad('NUMBER_LINE_PIECE_INVALID');
  if(raw.value!==undefined){
    const v=parseValue(raw.value,'NUMBER_LINE_VALUE_INVALID');
    return {v,value:ratText(v),tex:valueTex(toReal(v)),text:valueText(toReal(v)),state:raw.state,approx:num(v),expr:null};
  }
  if(!parameter)bad('NUMBER_LINE_PARAMETER_MISSING');
  onlyKeys(raw.param,['mul','add'],'NUMBER_LINE_PIECE_INVALID');
  const m=parseRat(raw.param.mul,'NUMBER_LINE_VALUE_INVALID'),c=parseRat(raw.param.add??'0','NUMBER_LINE_VALUE_INVALID');
  if(sgn(m)===0)bad('NUMBER_LINE_PARAMETER_COEFFICIENT_ZERO');
  usedParameter.used=true;
  const v=add(mul(m,parameter.v),c),texts=affineTexts(parameter.name,m,c);
  return {v,value:ratText(v),tex:texts.tex,text:texts.text,state:raw.state,approx:num(v),expr:{mul:ratText(m),add:ratText(c)}};
}
const endOf=(raw,parameter,used)=>parseEnd(raw,parameter,used);
function checkPiece(piece){
  if(!piece.lo&&!piece.hi)bad('NUMBER_LINE_PIECE_INVALID');
  if(piece.lo&&piece.hi){const c=cmpR(piece.lo.v,piece.hi.v);if(c>=0)bad(c===0?'NUMBER_LINE_PIECE_IS_A_POINT':'NUMBER_LINE_PIECE_INVALID');}
  return piece;
}
const piecesOrdered=pieces=>[...pieces].sort((a,b)=>!a.lo?-1:!b.lo?1:cmpR(a.lo.v,b.lo.v));
function checkDisjoint(pieces){
  for(let k=1;k<pieces.length;k++){
    const left=pieces[k-1],right=pieces[k];
    if(!left.hi||!right.lo)bad('NUMBER_LINE_PIECES_OVERLAP');
    const c=cmpR(left.hi.v,right.lo.v);
    if(c>0||c===0&&left.hi.state==='CLOSED'&&right.lo.state==='CLOSED')bad('NUMBER_LINE_PIECES_OVERLAP');
    if(c===0&&(left.hi.state==='CLOSED'||right.lo.state==='CLOSED'))bad('NUMBER_LINE_PIECES_TOUCH');
  }
}
const closedOf=e=>e.state==='CLOSED';
function intersectPiece(a,b){
  const lo=!a.lo?b.lo:!b.lo?a.lo:(c=>c>0?a.lo:c<0?b.lo:{...a.lo,state:closedOf(a.lo)&&closedOf(b.lo)?'CLOSED':'OPEN'})(cmpR(a.lo.v,b.lo.v));
  const hi=!a.hi?b.hi:!b.hi?a.hi:(c=>c<0?a.hi:c>0?b.hi:{...a.hi,state:closedOf(a.hi)&&closedOf(b.hi)?'CLOSED':'OPEN'})(cmpR(a.hi.v,b.hi.v));
  if(lo&&hi){const c=cmpR(lo.v,hi.v);if(c>0||c===0&&!(closedOf(lo)&&closedOf(hi)))return null;if(c===0)bad('NUMBER_LINE_RESULT_IS_A_POINT');}
  return {lo,hi};
}
const containsPiece=(piece,x)=>(!piece.lo||(c=>c>0||c===0&&closedOf(piece.lo))(cmpR(x,piece.lo.v)))&&(!piece.hi||(c=>c<0||c===0&&closedOf(piece.hi))(cmpR(x,piece.hi.v)));
const sideModel=e=>e&&{value:e.value,tex:e.tex,text:e.text,state:e.state,approx:e.approx,expr:e.expr};
function integersOf(pieces,request){
  const bounded=pieces.every(piece=>piece.lo&&piece.hi);
  let lo=null,hi=null;
  if(bounded){lo=pieces.map(piece=>floorR(piece.lo.v)).reduce((x,y)=>x<y?x:y);hi=pieces.map(piece=>floorR(piece.hi.v)+1n).reduce((x,y)=>x>y?x:y);}
  if(request===true){if(!bounded)bad('NUMBER_LINE_INTEGER_POINTS_NEED_RANGE');}
  else{
    onlyKeys(request,['range'],'NUMBER_LINE_INTEGER_POINTS_INVALID');
    const range=request.range;
    if(!Array.isArray(range)||range.length!==2||range.some(value=>typeof value!=='string'||!/^-?\d{1,6}$/.test(value))||BigInt(range[0])>BigInt(range[1]))bad('NUMBER_LINE_INTEGER_POINTS_INVALID');
    lo=bounded&&lo>BigInt(range[0])?lo:BigInt(range[0]);hi=bounded&&hi<BigInt(range[1])?hi:BigInt(range[1]);
  }
  if(hi-lo>200n)bad('NUMBER_LINE_TOO_MANY_INTEGER_POINTS');
  const out=[];for(let n=lo;n<=hi;n++)if(pieces.some(piece=>containsPiece(piece,rat(n))))out.push(String(n));
  if(out.length>MAX_INTEGERS)bad('NUMBER_LINE_TOO_MANY_INTEGER_POINTS');
  return out;
}

/** The optional display flags of one marked point: name (null, one Hangul consonant letter or a Hangul word of 1 to 5 syllables), hideName, showValue (false: the point's value is not written), valueSide ("ABOVE": the value is written above the dot, over its name). */
function pointFlags(raw){
  const flags={};
  if(raw.hideName!==undefined&&typeof raw.hideName!=='boolean')bad('NUMBER_LINE_POINT_NAME_INVALID');
  if(raw.showValue!==undefined&&typeof raw.showValue!=='boolean')bad('NUMBER_LINE_POINTS_INVALID');
  const hidden=raw.hideName===true||raw.name===null;
  if(raw.name!==undefined&&raw.name!==null){
    if(typeof raw.name!=='string'||!isTextName(raw.name)||raw.hideName===true)bad('NUMBER_LINE_POINT_NAME_INVALID');
    flags.jamoName=raw.name;
  }else if(!hidden&&JAMO.test(raw.id))flags.jamoName=raw.id;
  if(hidden)flags.hideName=true;
  if(raw.showValue===false)flags.hideValue=true;
  if(raw.style!==undefined&&!POINT_STYLES.includes(raw.style))bad('NUMBER_LINE_POINT_STYLE_INVALID');
  if(raw.valueSide!==undefined&&!VALUE_SIDES.includes(raw.valueSide))bad('NUMBER_LINE_VALUE_SIDE_INVALID');
  if(raw.valueSide==='ABOVE')flags.valueSide='ABOVE';
  return flags;
}
/**
 * spans (E34), on a POINTS row: [{from,to,label?,style?,side?}] draws the distance between two points of the row as a brace (BRACE, default, under the labels), a one-headed
 * arrow from `from` to `to` (ARROW, above the names) or a double-headed arrow (DOUBLE_ARROW). label: a short Korean phrase (plain text) or a short formula; side "ABOVE"|"BELOW".
 * The engine never computes the label: a distance that is the answer of the problem is simply not written.
 */
function solveSpans(raw,byId){
  if(!Array.isArray(raw)||raw.length<1||raw.length>MAX_SPANS)bad('NUMBER_LINE_SPANS_INVALID');
  const seen=new Set();
  return raw.map(item=>{
    onlyKeys(item,['from','to','label','style','side'],'NUMBER_LINE_SPANS_INVALID');
    const a=typeof item.from==='string'?byId.get(item.from):undefined,b=typeof item.to==='string'?byId.get(item.to):undefined;
    if(!a||!b||item.from===item.to)bad('NUMBER_LINE_SPAN_POINT_UNKNOWN');
    const style=item.style===undefined?'BRACE':item.style;
    if(!SPAN_STYLES.includes(style)||(item.side!==undefined&&!SPAN_SIDES.includes(item.side)))bad('NUMBER_LINE_SPANS_INVALID');
    const key=[item.from,item.to].sort().join('|');
    if(seen.has(key))bad('NUMBER_LINE_SPANS_INVALID');
    seen.add(key);
    const out={from:item.from,to:item.to,style,side:item.side??(style==='BRACE'?'BELOW':'ABOVE')};
    if(item.label!==undefined){
      const text=item.label;
      if(typeof text!=='string'||text!==text.trim())bad('NUMBER_LINE_SPAN_LABEL_INVALID');
      const hangul=/[가-힣]/.test(text);
      if(hangul?!SPAN_LABEL_TEXT.test(text)||/ {2}/.test(text):!SPAN_LABEL_MATH.test(text))bad('NUMBER_LINE_SPAN_LABEL_INVALID');
      out.label=text;out.labelKind=hangul?'TEXT':'MATH';
    }
    return out;
  });
}
/** A row label: one short line of at most ROW_LABEL_MAX_CHARS characters, plain text. */
function rowLabelOf(raw){
  if(raw.label===undefined)return {};
  if(typeof raw.label!=='string'||!raw.label.trim()||raw.label!==raw.label.trim()||[...raw.label].length>ROW_LABEL_MAX_CHARS||/[\u0000-\u001f<>&"\\$]/.test(raw.label))bad('NUMBER_LINE_ROW_LABEL_INVALID');
  return {label:raw.label};
}
/** hideSetLabel:true (SET and RESULT rows): the inequality the engine writes over the row (-9/2<x<9/2) is left out, for a figure whose problem already names the variable or the set. */
function hideSetLabelOf(raw){
  if(raw.hideSetLabel===undefined)return {};
  if(typeof raw.hideSetLabel!=='boolean')bad('NUMBER_LINE_HIDE_SET_LABEL_INVALID');
  return raw.hideSetLabel?{hideSetLabel:true}:{};
}
const ceilR=r=>-floorR(sub(ZERO,r));
/**
 * The graduated axis of a POINTS row: subdivisions=[{from,to,parts}] (integer strings from<to, parts 2..10) split every unit between from and to into
 * equal parts; every integer from the lowest to the highest of (the points, the subdivisions) gets a labelled tick. Exact: the minor values are rationals.
 */
function solveScale(raw,values){
  if(!Array.isArray(raw)||raw.length<1||raw.length>MAX_SUBDIVISIONS)bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
  const specs=raw.map(item=>{
    onlyKeys(item,['from','to','parts'],'NUMBER_LINE_SUBDIVISIONS_INVALID');
    if(typeof item.from!=='string'||typeof item.to!=='string'||!/^-?\d{1,4}$/.test(item.from)||!/^-?\d{1,4}$/.test(item.to))bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
    const from=BigInt(item.from),to=BigInt(item.to),parts=typeof item.parts==='string'&&/^\d{1,2}$/.test(item.parts)?Number(item.parts):item.parts;
    if(from>=to||to-from>BigInt(MAX_TICK_INTEGERS)||!Number.isInteger(parts)||parts<2||parts>10)bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
    return {from,to,parts};
  }).sort((a,b)=>a.from<b.from?-1:a.from>b.from?1:0);
  for(let k=1;k<specs.length;k++)if(specs[k].from<specs[k-1].to)bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
  const lo=[...values.map(floorR),...specs.map(spec=>spec.from)].reduce((x,y)=>x<y?x:y),hi=[...values.map(ceilR),...specs.map(spec=>spec.to)].reduce((x,y)=>x>y?x:y);
  if(hi-lo>BigInt(MAX_TICK_INTEGERS))bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
  const integers=[];for(let n=lo;n<=hi;n++)integers.push(String(n));
  const minor=[];
  for(const spec of specs)for(let k=spec.from;k<spec.to;k++)for(let j=1;j<spec.parts;j++){
    const v=div(rat(k*BigInt(spec.parts)+BigInt(j)),rat(BigInt(spec.parts)));
    minor.push({value:ratText(v),approx:num(v),unit:String(k),part:j,parts:spec.parts});
  }
  return {subdivisions:specs.map(spec=>({from:String(spec.from),to:String(spec.to),parts:spec.parts})),integers,minor};
}

// --- value-free letter points (E35) -----------------------------------------------------------------------------------------------------------
// A POINTS point with no value is a letter point ("a", "-a", "n"): where it sits is given by constraints only (between:[p,q] two points, or two exact values; mirrorOf:"a" the
// reflection of a letter point in 0, which needs the ids a and -a; and the row's order:[ids] left to right). The engine reasons over the constraints exactly (a strict order closure),
// refuses a plan whose constraints do not fix the order of every letter point (NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS) or contradict themselves, and then picks a place that satisfies
// them (a multiple of 1/20, centred in what the constraints leave open). That place is only where the dot is drawn: it is never written on the figure.
const SYMBOL_GRID=20,SYMBOL_MIN_GAP=0.12,MAX_SYMBOL_ROUNDS=400;
function placeSymbols(points,orderIds){
  const byId=new Map(points.map(point=>[point.id,point])),vars=[],varOf=new Map(),nodes=[],nodeOf=new Map();
  for(const point of points)if(point.symbolic&&point.raw.mirrorOf===undefined){varOf.set(point.id,vars.length);vars.push(point);}
  for(const point of points){
    nodeOf.set(point.id,nodes.length);
    if(!point.symbolic){nodes.push({kind:'const',v:point.v,approx:num(point.v),point:true});continue;}
    if(point.raw.mirrorOf===undefined){nodes.push({kind:'var',k:varOf.get(point.id),sign:1});continue;}
    const target=typeof point.raw.mirrorOf==='string'?byId.get(point.raw.mirrorOf):undefined;
    if(!target||!target.symbolic||target.raw.mirrorOf!==undefined||target===point||point.id!==(target.id.startsWith('-')?target.id.slice(1):'-'+target.id))bad('NUMBER_LINE_SYMBOL_MIRROR_INVALID');
    nodes.push({kind:'var',k:varOf.get(target.id),sign:-1});
  }
  const constNode=v=>{let i=nodes.findIndex(node=>node.kind==='const'&&cmpP(node.v,v)===0);if(i<0){i=nodes.length;nodes.push({kind:'const',v,approx:num(v)});}return i;};
  const Z=points.some(point=>point.symbolic&&point.raw.mirrorOf!==undefined)?constNode(rat(0n)):-1;
  const virtualZ=Z>=0&&!nodes[Z].point;
  const edges=[];
  for(const point of points){
    if(!point.symbolic||point.raw.between===undefined)continue;
    const between=point.raw.between;
    if(!Array.isArray(between)||between.length!==2)bad('NUMBER_LINE_SYMBOL_BETWEEN_INVALID');
    // each end is the id of a point of this row or an exact value
    let [lo,hi]=between.map(token=>{if(typeof token!=='string')bad('NUMBER_LINE_SYMBOL_BETWEEN_INVALID');return byId.has(token)?nodeOf.get(token):constNode(parseValue(token,'NUMBER_LINE_SYMBOL_BETWEEN_INVALID'));});
    const me=nodeOf.get(point.id);
    if(lo===me||hi===me||lo===hi)bad('NUMBER_LINE_SYMBOL_BETWEEN_INVALID');
    if(nodes[lo].kind==='const'&&nodes[hi].kind==='const'&&cmpP(nodes[lo].v,nodes[hi].v)>0)[lo,hi]=[hi,lo];
    edges.push([lo,me],[me,hi]);
  }
  if(orderIds!==undefined){
    if(!Array.isArray(orderIds)||orderIds.length<2||orderIds.length>MAX_POINTS||new Set(orderIds).size!==orderIds.length||orderIds.some(id=>typeof id!=='string'||!byId.has(id)))bad('NUMBER_LINE_SYMBOL_ORDER_INVALID');
    for(let i=1;i<orderIds.length;i++)edges.push([nodeOf.get(orderIds[i-1]),nodeOf.get(orderIds[i])]);
  }
  // the strict order the plan states, closed under transitivity, the sign of a mirror pair (a<-a means a<0<-a) and reflection in 0 (u<v gives -v<-u)
  const n=nodes.length,lt=Array.from({length:n},()=>Array(n).fill(false));
  for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(i!==j&&nodes[i].kind==='const'&&nodes[j].kind==='const'&&cmpP(nodes[i].v,nodes[j].v)<0)lt[i][j]=true;
  for(const [i,j] of edges)lt[i][j]=true;
  const partner=nodes.map((node,i)=>node.kind==='var'?nodes.findIndex((other,j)=>j!==i&&other.kind==='var'&&other.k===node.k):i===Z?Z:-1);
  for(let round=0;round<n+3;round++){
    let changed=false;const set=(i,j)=>{if(!lt[i][j]){lt[i][j]=true;changed=true;}};
    for(let k=0;k<n;k++)for(let i=0;i<n;i++)if(lt[i][k])for(let j=0;j<n;j++)if(lt[k][j])set(i,j);
    for(let i=0;i<n;i++){
      const m=partner[i];
      if(nodes[i].kind!=='var'||nodes[i].sign!==1||m<0||Z<0)continue;
      if(lt[i][m]){set(i,Z);set(Z,m);}
      if(lt[m][i]){set(m,Z);set(Z,i);}
      if(lt[i][Z])set(Z,m);
      if(lt[Z][i])set(m,Z);
      if(lt[m][Z])set(Z,i);
      if(lt[Z][m])set(i,Z);
    }
    for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(lt[i][j]&&partner[i]>=0&&partner[j]>=0)set(partner[j],partner[i]);
    if(!changed)break;
  }
  if(lt.some((line,i)=>line[i]))bad('NUMBER_LINE_SYMBOL_CONSTRAINT_CONTRADICTORY');
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){
    if(virtualZ&&(i===Z||j===Z))continue;
    if((nodes[i].kind==='var'||nodes[j].kind==='var')&&!lt[i][j]&&!lt[j][i])bad('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS');
  }
  const T=[...nodes.keys()].filter(i=>!(virtualZ&&i===Z));
  const rank=i=>T.filter(j=>lt[j][i]).length;
  T.sort((a,b)=>rank(a)-rank(b));
  if(T.some((i,t)=>t&&rank(i)===rank(T[t-1])))bad('NUMBER_LINE_SYMBOL_ORDER_AMBIGUOUS');
  // a first guess by the order (evenly in the gap between two drawn values, a step beyond the last one), then every letter is centred between its neighbours until nothing moves
  const consts=T.map(i=>nodes[i]).filter(node=>node.kind==='const').map(node=>node.approx);
  const step=consts.length>1?Math.max(1,(Math.max(...consts)-Math.min(...consts))/6):1;
  const x=Array(vars.length).fill(0),seeded=Array(vars.length).fill(false);
  for(let i=0;i<T.length;){
    if(nodes[T[i]].kind==='const'){i++;continue;}
    let j=i;while(j<T.length&&nodes[T[j]].kind==='var')j++;
    const m=j-i,left=i>0?nodes[T[i-1]].approx:null,right=j<T.length?nodes[T[j]].approx:null;
    for(let t=0;t<m;t++){
      const at=left!==null&&right!==null?left+(right-left)*(t+1)/(m+1):left!==null?left+step*(t+1):right!==null?right-step*(m-t):step*(t-(m-1)/2),node=nodes[T[i+t]];
      if(node.sign===1||!seeded[node.k]){x[node.k]=node.sign*at;seeded[node.k]=true;}
    }
    i=j;
  }
  const val=node=>node.kind==='const'?node.approx:node.sign*x[node.k];
  const pairs=[];for(let t=1;t<T.length;t++)pairs.push([nodes[T[t-1]],nodes[T[t]]]);
  for(let round=0;round<MAX_SYMBOL_ROUNDS;round++){
    let moved=0;
    for(let k=0;k<vars.length;k++){
      let low=-Infinity,high=Infinity;
      for(const [a,b] of pairs){
        const left=a.kind==='var'&&a.k===k,right=b.kind==='var'&&b.k===k;
        if(left&&right){if(b.sign>a.sign)low=Math.max(low,0);else high=Math.min(high,0);}
        else if(left){const bound=val(b);if(a.sign===1)high=Math.min(high,bound);else low=Math.max(low,-bound);}
        else if(right){const bound=val(a);if(b.sign===1)low=Math.max(low,bound);else high=Math.min(high,-bound);}
      }
      const next=Number.isFinite(low)&&Number.isFinite(high)?(low+high)/2:Number.isFinite(low)?low+step:Number.isFinite(high)?high-step:x[k];
      moved=Math.max(moved,Math.abs(next-x[k]));x[k]=next;
    }
    if(moved<1e-9)break;
  }
  const grid=x.map(value=>Math.round(value*SYMBOL_GRID)),exact=node=>{if(node.kind==='const')return node.v;const r=rat(BigInt(grid[node.k]),BigInt(SYMBOL_GRID));return node.sign===1?r:sub(ZERO,r);};
  for(const [a,b] of pairs){
    const ea=exact(a),eb=exact(b);
    if(cmpP(ea,eb)>=0||(a.kind==='var'||b.kind==='var')&&num(eb)-num(ea)<SYMBOL_MIN_GAP)bad('NUMBER_LINE_SYMBOL_CONSTRAINT_UNSATISFIABLE');
  }
  return new Map(points.filter(point=>point.symbolic).map(point=>[point.id,exact(nodes[nodeOf.get(point.id)])]));
}
// Values of marked points may use different radicals (the spiral sqrt(2), sqrt(3), sqrt(5)): cmpP is cmpR for them. With at most one radical involved it is exact; with two different ones (the roots are
// independent over the rationals, so there is no tie unless the values are the same) it decides on POINT_DIGITS decimals and refuses values closer than 1e-30 (NUMBER_LINE_VALUES_TOO_CLOSE).
// (SET rows keep one radical per plan: cmpR.)
const POINT_TEN=10n**40n;
function bigSqrt(n){
  if(n<2n)return n;
  let x=1n<<BigInt(Math.ceil(n.toString(2).length/2));
  for(;;){const y=(x+n/x)>>1n;if(y>=x)return x;x=y;}
}
const scaledReal=x=>x.p[0]*POINT_TEN/x.p[1]+(x.s===1n?0n:x.q[0]*bigSqrt(x.s*POINT_TEN*POINT_TEN)/x.q[1]);
function cmpP(a,b){
  const x=toReal(a),y=toReal(b);
  if(!(x.s!==1n&&y.s!==1n&&x.s!==y.s))return cmpR(a,b);
  const d=scaledReal(x)-scaledReal(y);
  if(d>-(10n**10n)&&d<10n**10n)bad('NUMBER_LINE_VALUES_TOO_CLOSE');
  return d>0n?1:-1;
}
const addReal=(a,b,sign=1)=>{
  const x=toReal(a),y=toReal(b),s=x.s!==1n&&y.s!==1n&&x.s!==y.s?bad('NUMBER_LINE_RADICALS_MIXED'):(x.s!==1n?x.s:y.s);
  return real(sign>0?add(x.p,y.p):sub(x.p,y.p),sign>0?add(x.q,y.q):sub(x.q,y.q),s);
};

// --- compass constructions (E35) ---------------------------------------------------------------------------------------------------------------
// numberLine.constructions: [{id,row?,center,radius:{value},arc:{side},hits:[{id,branch}]}]: a compass arc round a drawn point with an exact radius, over the number line; the arc
// meets the line at the points listed as hits, which must be exactly center+radius (branch RIGHT) or center-radius (branch LEFT). The arc is only drawn over the line.
const MAX_CONSTRUCTIONS=4,ARC_SIDES=['LEFT','RIGHT','BOTH'],ARC_BRANCHES=['LEFT','RIGHT'],CONSTRUCTION_ID=/^[a-z][A-Za-z0-9]{0,5}$/;
/**
 * source:{grid:true,from:[x,y],to:[x,y],toName?} (a construction's optional source): the segment whose length the compass carries, drawn on a lattice that stands on the number line, one cell
 * one unit of the line. It starts on the line at the centre (from=[the centre's value,0], an integer) and ends on a lattice point above it and to one side (to=[x,y], y>=1, x not the centre's); its length sqrt(dx^2+dy^2) must be
 * the radius exactly. toName: an optional capital letter written at its end (a name the problem gives, not a point of the figure; one name once).
 */
const sqReal=x=>{const r=toReal(x);return r.s===1n?asReal(mul(r.p,r.p)):real(add(mul(r.p,r.p),mul(mul(r.q,r.q),[r.s,1n])),mul([2n,1n],mul(r.p,r.q)),r.s);};
const toNameOk=(name,points,used)=>typeof name==='string'&&CAPITAL.test(name)&&!points.some(point=>point.id===name)&&!used.has(name);
function solveSource(raw,center,radius,points,used){
  const code='NUMBER_LINE_CONSTRUCTION_SOURCE_INVALID';
  // source:{perpendicular:{at,height,toName?}} (a chained construction): a perpendicular of an exact height is raised on the line at the point `at` (usually the hit of an earlier arc) and the hypotenuse
  // of the right triangle centre-at-tip is the radius: sqrt(|at-centre|^2+height^2) must be the radius exactly. The arc then runs from its hit to the tip.
  if(raw?.perpendicular!==undefined){
    onlyKeys(raw,['perpendicular'],code);
    const q=raw.perpendicular;onlyKeys(q,['at','height','toName'],code);
    const at=typeof q.at==='string'?points.find(point=>point.id===q.at&&!point.symbolic):undefined;
    if(!at||at===center)bad(code);
    const height=parseValue(q.height,code);
    if(cmpR(height,ZERO)<=0)bad(code);
    if(q.toName!==undefined&&!toNameOk(q.toName,points,used))bad(code);
    if(cmpR(addReal(sqReal(addReal(at.v,center.v,-1)),sqReal(height)),sqReal(radius))!==0)bad('NUMBER_LINE_CONSTRUCTION_SOURCE_LENGTH_MISMATCH');
    if(q.toName!==undefined)used.add(q.toName);
    return {perpendicular:{at:q.at,height:{value:ratText(height),approx:num(height)},...(q.toName!==undefined?{toName:q.toName}:{})}};
  }
  onlyKeys(raw,['grid','from','to','toName'],code);
  if(raw.grid!==true)bad(code);
  const pair=value=>{if(!Array.isArray(value)||value.length!==2)bad(code);return value.map(entry=>{const number=typeof entry==='string'&&/^-?\d{1,2}$/.test(entry)?Number(entry):entry;if(!Number.isInteger(number)||Math.abs(number)>99)bad(code);return number;});};
  const [fx,fy]=pair(raw.from),[tx,ty]=pair(raw.to);
  if(fy!==0||isReal(center.v)||center.v[1]!==1n||center.v[0]!==BigInt(fx)||ty<1||ty>SOURCE_MAX_CELLS||tx===fx||Math.abs(tx-fx)>SOURCE_MAX_CELLS)bad(code);
  if(raw.toName!==undefined&&!toNameOk(raw.toName,points,used))bad(code);
  if(cmpR(sqReal(radius),rat(BigInt((tx-fx)**2+ty**2)))!==0)bad('NUMBER_LINE_CONSTRUCTION_SOURCE_LENGTH_MISMATCH');
  if(raw.toName!==undefined)used.add(raw.toName);
  return {from:[fx,fy],to:[tx,ty],...(raw.toName!==undefined?{toName:raw.toName}:{})};
}
function solveConstructions(raw,pointInfo){
  const code='NUMBER_LINE_CONSTRUCTION_INVALID';
  if(!Array.isArray(raw)||raw.length<1||raw.length>MAX_CONSTRUCTIONS)bad(code);
  const rowNumbers=[...pointInfo.keys()];
  if(!rowNumbers.length)bad('NUMBER_LINE_CONSTRUCTION_NEEDS_POINTS_ROW');
  const seen=new Set(),out=[],usedNames=new Set();
  for(const item of raw){
    onlyKeys(item,['id','row','center','radius','arc','hits','source'],code);
    if(typeof item.id!=='string'||!CONSTRUCTION_ID.test(item.id)||seen.has(item.id))bad(code);
    seen.add(item.id);
    let rowNumber;
    if(item.row!==undefined){if(!Number.isInteger(item.row)||!pointInfo.has(item.row))bad('NUMBER_LINE_CONSTRUCTION_ROW_INVALID');rowNumber=item.row;}
    else if(rowNumbers.length===1)rowNumber=rowNumbers[0];
    else bad('NUMBER_LINE_CONSTRUCTION_ROW_AMBIGUOUS');
    const info=pointInfo.get(rowNumber),find=id=>typeof id==='string'?info.points.find(point=>point.id===id&&!point.symbolic):undefined;
    const center=find(item.center);if(!center)bad('NUMBER_LINE_CONSTRUCTION_POINT_UNKNOWN');
    onlyKeys(item.radius,['value'],'NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID');
    const radius=parseValue(item.radius.value,'NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID');
    if(cmpR(radius,ZERO)<=0)bad('NUMBER_LINE_CONSTRUCTION_RADIUS_INVALID');
    onlyKeys(item.arc,['side'],'NUMBER_LINE_CONSTRUCTION_ARC_INVALID');
    if(!ARC_SIDES.includes(item.arc.side))bad('NUMBER_LINE_CONSTRUCTION_ARC_INVALID');
    if(!Array.isArray(item.hits)||item.hits.length<1||item.hits.length>2)bad('NUMBER_LINE_CONSTRUCTION_HITS_INCOMPLETE');
    const hits=item.hits.map(hit=>{
      onlyKeys(hit,['id','branch'],code);
      if(!ARC_BRANCHES.includes(hit.branch))bad(code);
      const point=find(hit.id);if(!point||point===center)bad('NUMBER_LINE_CONSTRUCTION_POINT_UNKNOWN');
      if(cmpP(addReal(center.v,radius,hit.branch==='RIGHT'?1:-1),point.v)!==0)bad('NUMBER_LINE_CONSTRUCTION_HIT_MISMATCH');
      return {id:hit.id,branch:hit.branch};
    });
    const branches=hits.map(hit=>hit.branch);
    if(new Set(branches).size!==branches.length||new Set(hits.map(hit=>hit.id)).size!==hits.length)bad('NUMBER_LINE_CONSTRUCTION_HITS_INCOMPLETE');
    const want=item.arc.side==='BOTH'?['LEFT','RIGHT']:[item.arc.side];
    if(branches.length!==want.length||want.some(side=>!branches.includes(side)))bad('NUMBER_LINE_CONSTRUCTION_HITS_INCOMPLETE');
    const source=item.source===undefined?undefined:solveSource(item.source,center,radius,info.points,usedNames);
    out.push({rowNumber,model:{id:item.id,center:item.center,radius:{value:ratText(radius),approx:num(radius)},side:item.arc.side,hits:[...hits].sort((a,b)=>a.branch<b.branch?-1:1),...(source?{source}:{})}});
  }
  return out;
}

// --- solving the figure -----------------------------------------------------------------------------------------------------------------------
/**
 * numberLine = {variable?, parameter?:{name,value}, rows:[row...]}; a row is {kind:'SET',pieces:[{lo,hi}...],integerPoints?} (one or two disjoint
 * pieces, an end null for a ray; an end {value,state} or {param:{mul,add},state}), {kind:'RESULT',integerPoints?} (the exact intersection of
 * every SET row above it, last SET/RESULT row) or {kind:'POINTS',points:[{id,value}|{id,divides:{from,to,ratio:[m,n]}}],band?,subdivisions?}.
 * A point id is a capital letter or one Hangul consonant letter; a point may also carry name (null or one Hangul letter), hideName and showValue:false.
 * numberLine.axisVariable:false leaves out the variable at the axis end; subdivisions:[{from,to,parts}] gives the row a graduated axis (see solveScale).
 */
export function solveNumberLineFigure(numberLine){
  onlyKeys(numberLine,['variable','parameter','rows','axisVariable','constructions'],'NUMBER_LINE_FIGURE_PLAN_INVALID');
  if(numberLine.axisVariable!==undefined&&typeof numberLine.axisVariable!=='boolean')bad('NUMBER_LINE_AXIS_VARIABLE_INVALID');
  const variable=checkVariable(numberLine.variable);
  let parameter=null;
  if(numberLine.parameter!==undefined){
    onlyKeys(numberLine.parameter,['name','value','hideNote'],'NUMBER_LINE_PARAMETER_INVALID');
    const name=numberLine.parameter.name;
    if(typeof name!=='string'||!/^[a-z]$/.test(name)||name===variable||name==='y')bad('NUMBER_LINE_PARAMETER_INVALID');
    if(numberLine.parameter.hideNote!==undefined&&typeof numberLine.parameter.hideNote!=='boolean')bad('NUMBER_LINE_PARAMETER_INVALID');
    parameter={name,v:parseRat(numberLine.parameter.value,'NUMBER_LINE_PARAMETER_INVALID'),...(numberLine.parameter.hideNote===true?{hideNote:true}:{})};
  }
  const rows=numberLine.rows;
  if(!Array.isArray(rows)||!rows.length||rows.length>MAX_ROWS)bad('NUMBER_LINE_ROWS_INVALID');
  const used={used:false},solved=[],sets=[],pointInfo=new Map();
  for(const [index,row] of rows.entries()){
    if(!isPlain(row))bad('NUMBER_LINE_ROWS_INVALID');
    if(row.kind!=='POINTS'&&row.subdivisions!==undefined)bad('NUMBER_LINE_SUBDIVISIONS_INVALID');
    if(row.kind==='SET'){
      onlyKeys(row,['kind','pieces','integerPoints','label','hideSetLabel'],'NUMBER_LINE_ROWS_INVALID');
      if(!Array.isArray(row.pieces)||row.pieces.length<1||row.pieces.length>2)bad('NUMBER_LINE_PIECE_INVALID');
      const pieces=piecesOrdered(row.pieces.map(piece=>{onlyKeys(piece,['lo','hi'],'NUMBER_LINE_PIECE_INVALID');if(!Object.hasOwn(piece,'lo')||!Object.hasOwn(piece,'hi'))bad('NUMBER_LINE_PIECE_INVALID');return checkPiece({lo:endOf(piece.lo,parameter,used),hi:endOf(piece.hi,parameter,used)});}));
      checkDisjoint(pieces);sets.push(pieces);
      solved.push({kind:'SET',pieces,request:row.integerPoints,...rowLabelOf(row),...hideSetLabelOf(row)});
    }else if(row.kind==='RESULT'){
      onlyKeys(row,['kind','integerPoints','label','hideSetLabel'],'NUMBER_LINE_ROWS_INVALID');
      if(index!==rows.length-1&&rows.slice(index+1).some(next=>next?.kind==='SET'||next?.kind==='RESULT'))bad('NUMBER_LINE_RESULT_NOT_LAST');
      if(sets.length<2)bad('NUMBER_LINE_RESULT_NEEDS_TWO_SETS');
      let result=sets[0];
      for(const next of sets.slice(1))result=result.flatMap(a=>next.map(b=>intersectPiece(a,b)).filter(Boolean));
      result=piecesOrdered(result);
      if(!result.length)bad('NUMBER_LINE_RESULT_EMPTY');
      if(result.length>2)bad('NUMBER_LINE_TOO_MANY_PIECES');
      solved.push({kind:'RESULT',pieces:result,request:row.integerPoints,...rowLabelOf(row),...hideSetLabelOf(row)});
    }else if(row.kind==='POINTS'){
      onlyKeys(row,['kind','points','subdivisions','band','label','within','spans','order'],'NUMBER_LINE_ROWS_INVALID');
      // within: the 1-based number of an earlier SET or RESULT row; each point of this row is then classified exactly against that row's set (inside: filled and ringed, outside: crossed).
      if(row.within!==undefined&&(!Number.isInteger(row.within)||row.within<1||row.within>index||!['SET','RESULT'].includes(solved[row.within-1]?.kind)))bad('NUMBER_LINE_WITHIN_INVALID');
      if(row.band!==undefined&&typeof row.band!=='boolean')bad('NUMBER_LINE_ROWS_INVALID');
      if(!Array.isArray(row.points)||row.points.length<2||row.points.length>MAX_POINTS)bad('NUMBER_LINE_POINTS_INVALID');
      const byId=new Map(),points=[];
      for(const raw of row.points){
        onlyKeys(raw,['id','value','divides','name','hideName','showValue','style','valueSide','between','mirrorOf'],'NUMBER_LINE_POINTS_INVALID');
        if(typeof raw.id!=='string'||byId.has(raw.id)||(raw.value!==undefined&&raw.divides!==undefined))bad('NUMBER_LINE_POINTS_INVALID');
        let point;
        if(raw.value===undefined&&raw.divides===undefined){
          // a letter point: no value, only its constraints (between, mirrorOf, the row's order) and optionally a style
          if(!SYMBOL_ID.test(raw.id))bad('NUMBER_LINE_POINTS_INVALID');
          if(['name','hideName','showValue','valueSide'].some(key=>raw[key]!==undefined))bad('NUMBER_LINE_SYMBOL_INVALID');
          if(raw.style!==undefined&&!POINT_STYLES.includes(raw.style))bad('NUMBER_LINE_POINT_STYLE_INVALID');
          point={id:raw.id,raw,symbolic:true,flags:{hideName:true,hideValue:true}};
        }else{
          if(!(CAPITAL.test(raw.id)||JAMO.test(raw.id)))bad('NUMBER_LINE_POINTS_INVALID');
          if(raw.between!==undefined||raw.mirrorOf!==undefined)bad('NUMBER_LINE_SYMBOL_INVALID');
          point={id:raw.id,raw,flags:pointFlags(raw)};
        }
        byId.set(raw.id,point);points.push(point);
      }
      const shownJamo=points.map(point=>point.flags.jamoName).filter(Boolean);
      if(new Set(shownJamo).size!==shownJamo.length)bad('NUMBER_LINE_POINT_NAME_DUPLICATE');
      for(const point of points){
        if(point.symbolic)continue;
        if(point.raw.value!==undefined){point.v=parseValue(point.raw.value,'NUMBER_LINE_VALUE_INVALID');continue;}
        onlyKeys(point.raw.divides,['from','to','ratio'],'NUMBER_LINE_DIVISION_INVALID');
        const {from,to,ratio}=point.raw.divides,a=byId.get(from),b=byId.get(to);
        if(!a||!b||from===to||a.raw.value===undefined||b.raw.value===undefined||isReal(a.v)||isReal(b.v)||!Array.isArray(ratio)||ratio.length!==2||ratio.some(part=>typeof part!=='string'||!/^[1-9]\d{0,2}$/.test(part)))bad('NUMBER_LINE_DIVISION_INVALID');
        const m=rat(BigInt(ratio[0])),n=rat(BigInt(ratio[1]));
        point.v=div(add(mul(n,a.v),mul(m,b.v)),add(m,n));// AP:PB=m:n  ->  P=(nA+mB)/(m+n)
        point.division={from,to,ratio:[...ratio]};
      }
      const known=points.filter(point=>!point.symbolic).map(point=>point.v);
      if(known.some((x,i)=>known.slice(i+1).some(y=>cmpP(x,y)===0)))bad('NUMBER_LINE_POINTS_COINCIDE');
      if(points.some(point=>point.symbolic)){
        if(row.within!==undefined||row.subdivisions!==undefined)bad('NUMBER_LINE_SYMBOL_UNSUPPORTED');
        const placed=placeSymbols(points,row.order);
        for(const point of points)if(point.symbolic)point.v=placed.get(point.id);
      }else if(row.order!==undefined)bad('NUMBER_LINE_SYMBOL_ORDER_INVALID');
      const values=points.map(point=>point.v);
      if(values.some((x,i)=>values.slice(i+1).some(y=>cmpP(x,y)===0)))bad('NUMBER_LINE_POINTS_COINCIDE');
      const spans=row.spans===undefined?null:solveSpans(row.spans,byId);
      const within=row.within===undefined?null:solved[row.within-1].pieces;
      solved.push({kind:'POINTS',points:points.map(point=>{
          // the style: the author's, else (with `within`) FILLED inside the set and CROSS outside it; a point inside the set is also ringed
          const inside=within?within.some(piece=>containsPiece(piece,point.v)):null,style=point.raw.style??(inside===null||inside?'FILLED':'CROSS');
          // a letter point has no value: its name is the one label (below the dot), `place` is only where the engine drew it
          if(point.symbolic)return {id:point.id,symbol:true,tex:point.id,text:point.id,approx:num(point.v),place:ratText(point.v),...point.flags,...(style!=='FILLED'?{style}:{})};
          return {id:point.id,value:ratText(point.v),tex:valueTex(toReal(point.v)),text:valueText(toReal(point.v)),approx:num(point.v),...(point.division?{division:point.division}:{}),...point.flags,
            ...(style!=='FILLED'?{style}:{}),...(inside?{ring:true}:{})};}),
        ...(row.band===false?{band:false}:{}),...(row.subdivisions!==undefined?{scale:solveScale(row.subdivisions,points.map(point=>point.v))}:{}),...rowLabelOf(row),...(row.within!==undefined?{within:row.within}:{}),...(spans?{spans}:{}),...(row.order!==undefined?{order:[...row.order]}:{})});
      pointInfo.set(solved.length,{points});
    }else bad('NUMBER_LINE_ROWS_INVALID');
  }
  if(parameter&&!used.used)bad('NUMBER_LINE_PARAMETER_UNUSED');
  if(numberLine.constructions!==undefined){
    for(const {rowNumber,model} of solveConstructions(numberLine.constructions,pointInfo)){
      const target=solved[rowNumber-1];
      if(target.spans?.some(span=>span.side==='ABOVE'))bad('NUMBER_LINE_CONSTRUCTION_SPAN_ABOVE');
      (target.constructions??=[]).push(model);
    }
  }
  return {schemaVersion:FIGURE_MODEL_VERSION,variable,...(numberLine.axisVariable===false?{axisVariable:false}:{}),parameter:parameter&&{name:parameter.name,value:ratText(parameter.v),...(parameter.hideNote?{hideNote:true}:{})},
    rows:solved.map(row=>row.kind==='POINTS'?row:{kind:row.kind,pieces:row.pieces.map(piece=>({lower:sideModel(piece.lo),upper:sideModel(piece.hi)})),integers:row.request===undefined?null:integersOf(row.pieces,row.request),...(row.label?{label:row.label}:{}),...(row.hideSetLabel?{hideSetLabel:true}:{})})};
}

// --- layout and spec ----------------------------------------------------------------------------------------------------------------------------
// (the chain module and this one import each other: nothing of it may be read while this module is evaluated)
const WIDTH=512,SAFE=12,AXIS_LEFT=32,ARROW_TIP=WIDTH-32-20,MAP_LEFT=AXIS_LEFT+14,MAP_RIGHT=ARROW_TIP-22;
const DISPLAY='\\displaystyle ',END_RADIUS=5,DOT_RADIUS=3.2,TICK_HALF=6,LABEL_GAP=5,ZERO_TICK_CLEARANCE=56,NOTE_ROW=36,ROW_GAP=8;
const HEAD_TALL=52,HEAD_SHORT=38,BELOW_TALL=48,BELOW_SHORT=34,POINT_HEAD=36,INTEGER_ZONE=64,PLAIN_ZONE=24,INTEGER_LABEL_ROW=26;
const NAME_ROW=30,NAME_ROW_JAMO=34,VALUE_STACK_GAP=2,MINOR_TICK_HALF=3.5;
// Row labels (E30): a short Korean word at the left of a row's axis; with any label the axes start further right, by room for the longest (an estimate per character).
const ROW_LABEL_CHAR_PX=22,ROW_LABEL_GAP=10,ROW_LABEL_MAX_CHARS=6,ROW_LABEL_ROW_HEIGHT=34;
// Point styles (E30): FILLED (default), HOLLOW (open circle) and CROSS (two diagonal strokes, no disc); a point inside a `within` set also gets a ring.
const POINT_STYLES=['FILLED','HOLLOW','CROSS','TICK'],CROSS_HALF=4.2,RING_RADIUS=END_RADIUS+3,TICK_MARK_HALF=7.5;
// TICK (E35): a short bold vertical stroke through the axis, no disc: the mark of a place that is neither a value nor a member of a set (a letter point such as n).
// Spans and the side of a point's value (E34): a brace or an arrow between two points of a POINTS row sits in a band of its own under (or above) the row's labels.
const VALUE_SIDES=['ABOVE','BELOW'],SPAN_STYLES=['BRACE','ARROW','DOUBLE_ARROW'],SPAN_SIDES=['ABOVE','BELOW'],MAX_SPANS=3;
const SPAN_LABEL_TEXT=/^[\uAC00-\uD7A3][\uAC00-\uD7A3 ]{0,8}$/u,SPAN_LABEL_MATH=/^[A-Za-z0-9=+\-<>.,()]{1,12}$/;
const SPAN_PAD=4,SPAN_HALF=6,SPAN_LABEL_GAP=3,SPAN_LABEL_ROW=30,SPAN_BAND=SPAN_PAD+2*SPAN_HALF+SPAN_LABEL_GAP+SPAN_LABEL_ROW+2,SPAN_STROKE=1.4,SPAN_HEAD=9,SPAN_HEAD_HALF=3.6,SPAN_MIN_WIDTH=4*SPAN_HALF;
const HEAD_HIDDEN=8;      // a SET row whose inequality label is hidden keeps only the margin above its integer points
// Compass arcs (E35): an arc leaves the line at its hit point and rises at most ARC_RISE_MAX px (along at most ARC_SPAN_DEG degrees); the row's head keeps that room (plus the dot's margin).
const ARC_RISE_MAX=72,ARC_SPAN_DEG=32,ARC_MIN_RADIUS=14,ARC_HEAD=ARC_RISE_MAX+8,ARC_STROKE=1.2,ARC_LABEL_CLEAR=1.2,ARC_SAMPLES=32,HIT_NAME_GAP=3,SYMBOL_DOT_GAP=14;
// A source grid (E35): the segment whose length is the radius, on a lattice of unit cells that stands on the number line (one cell is one unit of the line); the arc then runs from its hit to the segment's end.
const SOURCE_RIGHT_ANGLE=9,SOURCE_MAX_CELLS=12,SOURCE_MARGIN=12,SOURCE_MAX_RISE=220,SOURCE_STROKE=2.4,LATTICE_STROKE=.8,LATTICE_COLOR='#bdbdbd';

const axisLeftOf=model=>{const longest=Math.max(0,...model.rows.map(row=>row.label?[...row.label].length:0));return longest?Math.max(AXIS_LEFT,SAFE+ROW_LABEL_CHAR_PX*longest+ROW_LABEL_GAP):AXIS_LEFT;};
const r6=value=>{const v=Math.round(value*1e6)/1e6;return v===0?0:v;};
const frac=tex=>tex.includes('\\frac');
const piecesOf=row=>row.pieces.map(piece=>({lo:piece.lower,hi:piece.upper}));
const customPoints=row=>!!row.scale||row.points.some(point=>point.hideName||point.hideValue||point.jamoName||point.valueSide);
function pieceTex(variable,piece){
  const rel=e=>e.state==='CLOSED'?'\\le ':'<',relText=e=>e.state==='CLOSED'?'≤':'<';
  if(piece.lo&&piece.hi)return {tex:piece.lo.tex+rel(piece.lo)+variable+rel(piece.hi)+piece.hi.tex,plain:piece.lo.text+relText(piece.lo)+variable+relText(piece.hi)+piece.hi.text};
  if(piece.lo)return {tex:variable+(piece.lo.state==='CLOSED'?'\\ge ':'>')+piece.lo.tex,plain:variable+(piece.lo.state==='CLOSED'?'≥':'>')+piece.lo.text};
  return {tex:variable+rel(piece.hi)+piece.hi.tex,plain:variable+relText(piece.hi)+piece.hi.text};
}
/** The shared unit-to-px map of a figure: the values shown, padded (a source grid's end too); unitPx is px per unit (compass arcs and source grids are drawn at true scale). */
function figureMap(model){
  const finite=[];
  for(const row of model.rows){
    if(row.kind==='POINTS')finite.push(...row.points.map(point=>point.approx),...(row.scale?.integers??[]).map(Number),...(row.constructions??[]).flatMap(construction=>construction.source?.to?[construction.source.to[0]]:[]));
    else{for(const piece of row.pieces)for(const end of [piece.lower,piece.upper])if(end)finite.push(end.approx);finite.push(...(row.integers??[]).map(Number));}
  }
  let lo=Math.min(...finite),hi=Math.max(...finite);
  const intsAll=model.rows.flatMap(row=>row.integers??[]).map(Number);
  const span=hi-lo,pad=span===0?2:Math.max(.8,.12*span);
  lo-=pad;hi+=pad;
  if(intsAll.length){lo=Math.min(lo,Math.min(...intsAll)-.75);hi=Math.max(hi,Math.max(...intsAll)+.75);}
  const AXL=axisLeftOf(model),MAPL=AXL+(MAP_LEFT-AXIS_LEFT);     // a row label moves every axis start (and the map) right by the room it needs
  return {lo,hi,AXL,MAPL,unitPx:(MAP_RIGHT-MAPL)/(hi-lo)};
}
/** Row tops, axis heights and the total height; known before any label is typeset. */
export function figureLayout(model){
  let y=SAFE+(model.parameter&&!model.parameter.hideNote?NOTE_ROW:0);const rows=[];
  for(const row of model.rows){
    const points=row.kind==='POINTS',ends=points?[]:row.pieces.flatMap(piece=>[piece.lower,piece.upper]).filter(Boolean);
    const tallHead=!points&&row.pieces.some(piece=>frac(piece.lower?.tex??'')||frac(piece.upper?.tex??'')),
      tallBelow=points?row.points.some(point=>frac(point.tex)):ends.some(end=>frac(end.tex));
    let head=points?POINT_HEAD:tallHead?HEAD_TALL:HEAD_SHORT,belowRow=tallBelow?BELOW_TALL:BELOW_SHORT;const zone=points?10:row.integers?.length?INTEGER_ZONE:PLAIN_ZONE;
    if(!points&&row.hideSetLabel)head=HEAD_HIDDEN;
    let custom=null;
    if(points&&customPoints(row)){
      // A row with a graduated axis, Hangul/hidden names or hidden values: names (and ratios) in the head; values below the axis, or (on a graduated axis, whose ticks use the space below, or for a point whose valueSide is ABOVE) stacked above the name.
      const named=row.points.some(point=>!point.hideName||point.division),nameRow=named?(row.points.some(point=>point.jamoName)?NAME_ROW_JAMO:NAME_ROW):0;
      const shown=row.points.filter(point=>!point.hideValue),aboveShown=shown.filter(point=>row.scale||point.valueSide==='ABOVE'),belowShown=row.scale?[]:shown.filter(point=>point.valueSide!=='ABOVE');
      const rowFor=list=>list.length?(list.some(point=>frac(point.tex))?BELOW_TALL:BELOW_SHORT):0,valueAbove=rowFor(aboveShown),valueBelow=rowFor(belowShown);
      head=7+nameRow+valueAbove+(nameRow&&valueAbove?VALUE_STACK_GAP:0);belowRow=row.scale?BELOW_SHORT:Math.max(valueBelow,row.points.some(point=>point.symbol)?BELOW_SHORT:0);
      custom={nameRow,valueAbove};
    }
    // compass arcs over the row: room for the tallest arc (a fixed rise, whatever the scale)
    if(points&&row.constructions?.length){
      head=Math.max(head,ARC_HEAD);
      // a source grid stands over the line as high as its segment's end
      const rise=Math.max(0,...row.constructions.map(construction=>construction.source?construction.source.perpendicular?construction.source.perpendicular.height.approx:construction.source.to[1]:0))*figureMap(model).unitPx;
      if(rise>0)head=Math.max(head,Math.ceil(rise)+SOURCE_MARGIN);
    }
    // spans: each takes a band of its own, under the row's labels or over its names (the head grows by the bands above)
    const spans=points?row.spans??[]:[],spanAbove=spans.filter(span=>span.side==='ABOVE').length*SPAN_BAND,spanBelow=spans.filter(span=>span.side==='BELOW').length*SPAN_BAND;
    head+=spanAbove;
    const axisY=y+head+zone;
    rows.push({top:y,head,axisY,belowRow,zone,...(custom??{}),...(spanAbove||spanBelow?{spanAbove,spanBelow}:{})});
    y=axisY+END_RADIUS+LABEL_GAP+belowRow+spanBelow+ROW_GAP;
  }
  return {rows,height:y-ROW_GAP+SAFE};
}
export const figurePanelSize=model=>({width:WIDTH,height:figureLayout(model).height});
/**
 * The figure before typesetting: one shared unit-to-px map, per row the axis, bands, dots, ticks and every label with its TeX and anchor.
 * Deterministic: the same plan and model give the same spec.
 */
/** plan.pointNames checked against the POINTS rows of the solved figure (an unknown target or an invalid display name is an explicit error). */
export const figurePointNames=(plan,model)=>pointNameModel(plan,model.rows.flatMap(row=>row.kind==='POINTS'?row.points.map(point=>point.id).filter(id=>CAPITAL.test(id)):[]));
export function numberLineFigureSpec(plan,model){
  if(plan?.capability!==NUMBER_LINE_CAPABILITY||!plan.numberLine)bad('NUMBER_LINE_PLAN_INVALID');
  if(objectSha(solveNumberLineFigure(plan.numberLine))!==objectSha(model))bad('NUMBER_LINE_MODEL_MISMATCH');
  const names=figurePointNames(plan,model),{lo,hi,AXL,MAPL,unitPx}=figureMap(model);
  const px=u=>r6(MAPL+(u-lo)/(hi-lo)*(MAP_RIGHT-MAPL)),layout=figureLayout(model),v=model.variable;
  const rows=[],labels=[];
  if(model.parameter&&!model.parameter.hideNote){
    // a fraction value is written as a small (text-style) stacked fraction so that it fits the one-line note row; an integer keeps the display style
    const fractionValue=/^-?\d+\/\d+$/.test(model.parameter.value);
    labels.push({id:'parameter-note-value',role:'note',owner:'note',kind:'MATH',tex:(fractionValue?'':DISPLAY)+model.parameter.name+'='+model.parameter.value.replace(/^(-?)(\d+)\/(\d+)$/,'$1\\frac{$2}{$3}'),plain:model.parameter.name+'='+model.parameter.value,anchor:{x:WIDTH/2-4,y:SAFE+NOTE_ROW/2,align:'left'},rowHeight:NOTE_ROW});
    labels.push({id:'parameter-note-text',role:'note',owner:'note',kind:'TEXT',text:'일 때의 그림',plain:'일 때의 그림',anchor:{x:WIDTH/2+4,y:SAFE+NOTE_ROW/2,align:'right'},rowHeight:NOTE_ROW});
  }
  for(const [r,row] of model.rows.entries()){
    const n=r+1,{axisY,head,top,belowRow}=layout.rows[r],dots=[],ticks=[],bands=[];
    const spec={n,kind:row.kind,axis:{x1:AXL,x2:ARROW_TIP,y:axisY},bands,dots,ticks};
    if(row.label)labels.push({id:`r${n}-row-label`,role:'row-label',owner:`r${n}-axis`,kind:'TEXT',text:row.label,plain:row.label,anchor:{x:AXL-ROW_LABEL_GAP,y:axisY,align:'left'},rowHeight:ROW_LABEL_ROW_HEIGHT,row:n});
    if(row.kind==='POINTS'){
      const placed=row.points.map(point=>({...point,x:px(point.approx)}));
      const sorted=[...placed].sort((a,b)=>a.x-b.x),{nameRow=NAME_ROW,valueAbove=belowRow}=layout.rows[r],stacked=!!row.scale;
      if(row.band!==false)bands.push({id:`r${n}-band-1`,piece:1,x1:sorted[0].x,x2:sorted[sorted.length-1].x,y:axisY,from:sorted[0].value,to:sorted[sorted.length-1].value});
      if(row.scale){
        // the graduated axis: a labelled tick at every integer, shorter ticks at the equal parts of the subdivided units
        for(const s of row.scale.integers){
          const id=`r${n}-tick-${numSlug(s)}`;
          ticks.push({id,role:'major',value:s,x:px(Number(s)),y1:r6(axisY-TICK_HALF),y2:r6(axisY+TICK_HALF)});
          labels.push({id:id+'-label',role:'tick',owner:id,kind:'MATH',tex:s,plain:s,value:s,anchor:{x:px(Number(s)),y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:belowRow,row:n});
        }
        for(const m of row.scale.minor)ticks.push({id:`r${n}-subtick-${numSlug(m.value)}`,role:'minor',value:m.value,parts:m.parts,x:px(m.approx),y1:r6(axisY-MINOR_TICK_HALF),y2:r6(axisY+MINOR_TICK_HALF)});
      }
      // compass arcs (E35): the points the arcs land on; an arc rises from its hit towards its centre, so the hit's name is written on the other side of the dot
      // (the centre of a construction with a source keeps its name off it: on the side away from the segment)
      const sourceEnd=construction=>{
        const source=construction.source,centre=placed.find(item=>item.id===construction.center);
        if(source.perpendicular){const at=placed.find(item=>item.id===source.perpendicular.at);return {ux:at.approx,rise:source.perpendicular.height.approx,dir:at.approx>=centre.approx?1:-1};}
        return {ux:source.to[0],rise:source.to[1],dir:source.to[0]>=source.from[0]?1:-1};
      };
      const nameSides=new Map(),addSide=(id,side)=>(nameSides.get(id)??nameSides.set(id,new Set()).get(id)).add(side);
      for(const construction of row.constructions??[]){
        for(const hit of construction.hits)addSide(hit.id,hit.branch);
        if(construction.source)addSide(construction.center,sourceEnd(construction).dir>=0?'LEFT':'RIGHT');
      }
      const nameAnchor=point=>{
        const sides=nameSides.get(point.id),y=r6(axisY-END_RADIUS-4);
        if(sides?.size===1)return sides.has('RIGHT')?{x:r6(point.x+HIT_NAME_GAP),y,align:'above-right'}:{x:r6(point.x-HIT_NAME_GAP),y,align:'above-left'};
        return {x:point.x,y,align:'above'};
      };
      for(const point of placed){
        const dotId=`r${n}-pt-${pointSlug(point.id)}`;
        dots.push({id:dotId,role:'point',...(point.symbol?{symbol:point.id}:{value:point.value}),state:point.style==='HOLLOW'?'OPEN':'CLOSED',x:point.x,y:axisY,r:END_RADIUS,pointId:point.id,...(point.hideValue&&!point.symbol?{valueHidden:true}:{}),...(point.style?{style:point.style}:{}),...(point.ring?{ring:true}:{})});
        if(!point.hideName)labels.push(point.jamoName
          ?{id:`${dotId}-name`,role:'point-name',owner:dotId,kind:'TEXT',text:point.jamoName,plain:point.jamoName,value:point.id,anchor:nameAnchor(point),rowHeight:nameRow,row:n}
          :{id:`${dotId}-name`,role:'point-name',owner:dotId,kind:'MATH',tex:names.tex(point.id),plain:names.text(point.id),value:point.id,anchor:nameAnchor(point),rowHeight:customPoints(row)?nameRow:30,row:n});
        if(point.symbol)labels.push({id:`${dotId}-symbol`,role:'point-symbol',owner:dotId,kind:'MATH',tex:point.tex,plain:point.text,value:point.id,anchor:{x:point.x,y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:belowRow,row:n});
        if(!point.hideValue){
          const above=stacked||point.valueSide==='ABOVE';   // above the dot, over the name (a graduated axis keeps its ticks' labels below) or below the dot
          labels.push({id:`${dotId}-value`,role:'point-value',owner:dotId,kind:'MATH',tex:DISPLAY+point.tex,plain:point.text,value:point.value,
            anchor:above?{x:point.x,y:r6(axisY-END_RADIUS-4-(point.hideName?0:nameRow+VALUE_STACK_GAP)),align:'above'}:{x:point.x,y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:above?valueAbove:belowRow,row:n});
        }
      }
      // spans (E34): a brace or an arrow between two points in a band of its own, its label on the outer side
      if(row.spans){
        const {spanAbove=0}=layout.rows[r],levels={ABOVE:0,BELOW:0};spec.spans=[];
        for(const [k,span] of row.spans.entries()){
          const a=placed.find(item=>item.id===span.from),b=placed.find(item=>item.id===span.to),id=`r${n}-span-${k+1}`,below=span.side==='BELOW',dir=below?1:-1,level=levels[span.side]++;
          const near=below?axisY+END_RADIUS+LABEL_GAP+belowRow+level*SPAN_BAND+SPAN_PAD:top+spanAbove-level*SPAN_BAND-SPAN_PAD,far=r6(near+dir*2*SPAN_HALF),mid=r6(near+dir*SPAN_HALF);
          const item={id,style:span.style,side:span.side,from:span.from,to:span.to,x1:a.x,x2:b.x,near:r6(near),far,mid};
          if(span.style==='BRACE'){
            const lo=Math.min(a.x,b.x),hi=Math.max(a.x,b.x),xm=r6((lo+hi)/2),h=SPAN_HALF,y0=r6(near),y1=r6(near+dir*h),y2=far;
            item.lo=lo;item.hi=hi;item.d=`M ${lo} ${y0} Q ${lo} ${y1} ${r6(lo+h)} ${y1} L ${r6(xm-h)} ${y1} Q ${xm} ${y1} ${xm} ${y2} Q ${xm} ${y1} ${r6(xm+h)} ${y1} L ${r6(hi-h)} ${y1} Q ${hi} ${y1} ${hi} ${y0}`;
          }else{
            const sign=Math.sign(b.x-a.x),double=span.style==='DOUBLE_ARROW';
            item.shaft={x1:r6(double?a.x+sign*SPAN_HEAD:a.x),x2:r6(b.x-sign*SPAN_HEAD),y:mid};
            item.heads=[[b.x,sign],...(double?[[a.x,-sign]]:[])].map(([tip,dx])=>({tip,points:[[tip,mid],[r6(tip-dx*SPAN_HEAD),r6(mid-SPAN_HEAD_HALF)],[r6(tip-dx*SPAN_HEAD),r6(mid+SPAN_HEAD_HALF)]]}));
          }
          spec.spans.push(item);
          if(span.label)labels.push({id:`${id}-label`,role:'span-label',owner:id,kind:span.labelKind,...(span.labelKind==='MATH'?{tex:span.label}:{text:span.label}),plain:span.label,value:`${span.from},${span.to}`,anchor:{x:r6((a.x+b.x)/2),y:r6(far+dir*SPAN_LABEL_GAP),align:below?'below':'above'},rowHeight:SPAN_LABEL_ROW,row:n,span:[span.from,span.to]});
        }
      }
      // compass arcs: a circle round the centre, drawn from each hit up to at most ARC_SPAN_DEG degrees (and ARC_RISE_MAX px); the arc touches the line only at its hit
      if(row.constructions){
        spec.constructions=[];
        for(const construction of row.constructions){
          const center=placed.find(item=>item.id===construction.center),cx=center.x,R=r6(construction.radius.approx*unitPx),source=construction.source;
          if(R<ARC_MIN_RADIUS)bad('NUMBER_LINE_CONSTRUCTION_ARC_TOO_SMALL');
          const theta=Math.min(ARC_SPAN_DEG*Math.PI/180,Math.asin(Math.min(1,ARC_RISE_MAX/R)));
          // the source: a lattice of unit cells over the line with the segment from the centre to its end (kind GRID), or a perpendicular raised on the line with the hypotenuse of its right triangle
          // (kind PERPENDICULAR); an arc on the side of the end runs on to the end
          const end=source?sourceEnd(construction):null;
          if(source){
            const top=r6(end.rise*unitPx);
            if(top>SOURCE_MAX_RISE)bad('NUMBER_LINE_CONSTRUCTION_SOURCE_TOO_TALL');
            const id=`r${n}-src-${construction.id}`,endX=px(end.ux),tipY=r6(axisY-top);
            let item;
            if(source.perpendicular){
              const sign=end.dir,RA=SOURCE_RIGHT_ANGLE;
              item={id,construction:construction.id,kind:'PERPENDICULAR',at:source.perpendicular.at,height:source.perpendicular.height.value,
                perp:{x1:endX,y1:axisY,x2:endX,y2:tipY},hyp:{x1:cx,y1:axisY,x2:endX,y2:tipY},rightAngle:`M ${r6(endX-sign*RA)} ${axisY} L ${r6(endX-sign*RA)} ${r6(axisY-RA)} L ${endX} ${r6(axisY-RA)}`,
                checkLines:[[endX,axisY,endX,tipY],[cx,axisY,endX,tipY],[r6(endX-sign*RA),axisY,r6(endX-sign*RA),r6(axisY-RA)],[r6(endX-sign*RA),r6(axisY-RA),endX,r6(axisY-RA)]]};
            }else{
              const [fx,fy]=source.from,[tx,ty]=source.to,left=Math.min(fx,tx),right=Math.max(fx,tx);
              item={id,construction:construction.id,kind:'GRID',from:[fx,fy],to:[tx,ty],segment:{x1:px(fx),y1:axisY,x2:endX,y2:tipY},verticals:[],horizontals:[]};
              for(let k=left;k<=right;k++)item.verticals.push({id:`${id}-v${k<0?'m'+(-k):k}`,x:px(k),y1:axisY,y2:tipY});
              for(let j=1;j<=ty;j++)item.horizontals.push({id:`${id}-h${j}`,y:r6(axisY-j*unitPx),x1:px(left),x2:px(right)});
              item.checkLines=[...item.verticals.map(line=>[line.x,line.y1,line.x,line.y2]),...item.horizontals.map(line=>[line.x1,line.y,line.x2,line.y]),[item.segment.x1,item.segment.y1,item.segment.x2,item.segment.y2]];
            }
            (spec.sources??=[]).push(item);
            const name=source.perpendicular?source.perpendicular.toName:source.toName;
            if(name){
              const right_=end.dir>=0;
              labels.push({id:`${id}-name`,role:'source-name',owner:source.perpendicular?`${id}-hyp`:id,kind:'MATH',tex:name,plain:name,value:name,anchor:{x:r6(endX+(right_?HIT_NAME_GAP:-HIT_NAME_GAP)),y:r6(tipY-4),align:right_?'above-right':'above-left'},rowHeight:30,row:n});
            }
          }
          for(const hit of construction.hits){
            const dir=hit.branch==='RIGHT'?1:-1,x0=r6(cx+dir*R);
            let x1=r6(cx+dir*R*Math.cos(theta)),y1=r6(axisY-R*Math.sin(theta));
            // on the side of the segment's end the arc runs from its hit exactly to that end (the end is on the circle: the segment is a radius)
            if(source&&dir*end.dir>0){x1=px(end.ux);y1=r6(axisY-end.rise*unitPx);}
            spec.constructions.push({id:`r${n}-con-${construction.id}-${hit.branch.toLowerCase()}`,construction:construction.id,center:construction.center,hit:hit.id,branch:hit.branch,radius:construction.radius.value,
              cx,cy:axisY,R,x0,y0:axisY,x1,y1,d:`M ${x0} ${axisY} A ${R} ${R} 0 0 ${dir===1?0:1} ${x1} ${y1}`});
          }
        }
      }
      // The ratio of an internal division: m over A..P and n over P..B (the numbers the author gave).
      for(const point of placed.filter(item=>item.division)){
        const a=placed.find(item=>item.id===point.division.from),b=placed.find(item=>item.id===point.division.to),dotId=`r${n}-pt-${pointSlug(point.id)}`;
        [[a,point,point.division.ratio[0],'first'],[point,b,point.division.ratio[1],'second']].forEach(([left,right,text,which])=>labels.push({id:`r${n}-ratio-${pointSlug(point.id)}-${which}`,role:'ratio',owner:dotId,kind:'MATH',tex:text,plain:text,value:text,anchor:{x:r6((left.x+right.x)/2),y:r6(axisY-END_RADIUS-4),align:'above'},rowHeight:30,row:n,span:[left.id,right.id]}));
      }
    }else{
      const result=row.kind==='RESULT';
      for(const [k,piece] of row.pieces.entries()){
        const p=k+1,x1=piece.lower?px(piece.lower.approx):AXL,x2=piece.upper?px(piece.upper.approx):ARROW_TIP-2;
        bands.push({id:`r${n}-band-${p}`,piece:p,x1,x2,y:axisY,from:piece.lower?.value??'-oo',to:piece.upper?.value??'+oo',result});
        for(const [side,end] of [['lo',piece.lower],['hi',piece.upper]]){
          if(!end)continue;
          const id=`r${n}-end-${p}-${side}`;
          dots.push({id,role:'endpoint',value:end.value,state:end.state,x:px(end.approx),y:axisY,r:END_RADIUS,piece:p,side});
          labels.push({id:id+'-label',role:'endpoint',owner:id,kind:'MATH',tex:DISPLAY+end.tex,plain:end.text,value:end.value,anchor:{x:px(end.approx),y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:belowRow,row:n});
        }
        if(!row.hideSetLabel){
          const text=pieceTex(v,{lo:piece.lower,hi:piece.upper});
          labels.push({id:`r${n}-piece-${p}-label`,role:'set',owner:`r${n}-band-${p}`,kind:'MATH',tex:DISPLAY+text.tex,plain:text.plain,anchor:{x:r6((x1+x2)/2),y:r6(top+head/2),align:'center'},rowHeight:head,row:n});
        }
      }
      const endsPx=dots.map(dot=>dot.x);
      if(lo<0&&0<hi&&!dots.some(dot=>dot.value==='0')&&endsPx.every(x=>Math.abs(x-px(0))>=ZERO_TICK_CLEARANCE)){
        ticks.push({id:`r${n}-tick-0`,value:'0',x:px(0),y1:axisY-TICK_HALF,y2:axisY+TICK_HALF});
        labels.push({id:`r${n}-tick-0-label`,role:'tick',owner:`r${n}-tick-0`,kind:'MATH',tex:'0',plain:'0',value:'0',anchor:{x:px(0),y:r6(axisY+END_RADIUS+LABEL_GAP),align:'below'},rowHeight:belowRow,row:n});
      }
      const integers=row.integers??[],estimate=s=>12*s.replace('-','').length+(s.startsWith('-')?19:0);
      const mode=integers.every((s,i)=>!i||px(Number(s))-px(Number(integers[i-1]))>=(estimate(s)+estimate(integers[i-1]))/2+4)?'ALL':'ENDS';
      if(integers.length)spec.integerLabels=mode;
      const dotY=axisY-22;
      for(const [i,s] of integers.entries()){
        const id=`r${n}-int-${s.replace('-','m')}`;dots.push({id,role:'integer',value:s,state:'CLOSED',x:px(Number(s)),y:dotY,r:DOT_RADIUS});
        if(mode==='ENDS'&&i&&i<integers.length-1)continue;
        labels.push({id:id+'-label',role:'integer',owner:id,kind:'MATH',tex:s,plain:s,value:s,anchor:{x:px(Number(s)),y:r6(dotY-DOT_RADIUS-4),align:'above'},rowHeight:INTEGER_LABEL_ROW,row:n});
      }
    }
    if(model.axisVariable!==false)labels.push({id:`r${n}-axis-variable`,role:'variable',owner:`r${n}-axis`,kind:'MATH',tex:v,plain:v,anchor:{x:ARROW_TIP+6,y:axisY,align:'right'},rowHeight:30,row:n});
    rows.push(spec);
  }
  return {schemaVersion:FIGURE_SPEC_VERSION,size:figurePanelSize(model),map:{unitLeft:r6(lo),unitRight:r6(hi),pxLeft:MAPL,pxRight:MAP_RIGHT},rows,labels};
}

// --- composing --------------------------------------------------------------------------------------------------------------------------------
/** Typeset every label, place it at its anchor, build the SVG, run the independent observer on its bytes and the rendered layout check in Chrome. */
export async function composeNumberLineFigurePanel({plan,model,identity,typographyPolicy,browser}={}){
  const lineage={planSha256:null,modelSha256:null,typographyPolicySha256:null,specSha256:null,fragmentSha256s:null,svgSha256:null,staticAuditSha256:null,renderedLayoutSha256:null};
  const state={svg:null,staticAudit:{status:'NOT_RUN'},renderedLayout:{status:'NOT_RUN'}};
  const outcome=(status,detail=null)=>({schemaVersion:NUMBER_LINE_SVG_VERSION,status,detail,svg:status==='COMPOSED'?state.svg:null,lineage:{...lineage},staticAudit:state.staticAudit,renderedLayout:state.renderedLayout,layoutRepairs:[],productionAuthorized:false,qualification:'NOT_RUN'});
  let ownBrowser=null;
  try{
    if(!typographyPolicy||!Number.isFinite(typographyPolicy.baseFontPx)||!(typographyPolicy.displayScale>0))throw new Stop('TYPOGRAPHY_POLICY_INVALID');
    lineage.planSha256=objectSha(plan);lineage.modelSha256=objectSha(model);lineage.typographyPolicySha256=objectSha(typographyPolicy);
    let spec;
    try{spec=numberLineFigureSpec(plan,model);}catch(error){if(!isDomainCode(error))throw error;throw new Stop(error.message==='NUMBER_LINE_MODEL_MISMATCH'?error.message:'NUMBER_LINE_SPEC_ERROR',{code:error.message});}
    lineage.specSha256=objectSha(spec);
    for(const row of spec.rows){const xs=row.ticks.map(tick=>tick.x).sort((a,b)=>a-b);if(xs.some((x,i)=>i&&x-xs[i-1]<MIN_TICK_GAP))throw new Stop('NUMBER_LINE_TICKS_TOO_DENSE',{row:row.n});}
    for(const row of spec.rows)for(const span of row.spans??[])if(Math.abs(span.x2-span.x1)<SPAN_MIN_WIDTH)throw new Stop('NUMBER_LINE_SPAN_TOO_SHORT',{span:span.id});
    // letter points sit at least SYMBOL_DOT_GAP px from every other dot of their row
    for(const row of spec.rows){
      const dotsOf=row.dots.filter(dot=>dot.role==='point');
      if(dotsOf.some(dot=>dot.symbol))for(const a of dotsOf)for(const b of dotsOf)if(a.id<b.id&&(a.symbol||b.symbol)&&Math.abs(a.x-b.x)<SYMBOL_DOT_GAP)throw new Stop('NUMBER_LINE_SYMBOL_TOO_CLOSE',{dots:[a.id,b.id]});
    }
    const typeset=typesetter(),font=typographyPolicy.baseFontPx,placed=[];
    for(const label of spec.labels){
      let fragment;
      try{fragment=typeset({id:label.id,owner:label.owner,factRole:['set','endpoint','integer','point-value'].includes(label.role)?'CONCLUSION':'DERIVED_INTERMEDIATE',fontPx:font,panelId:'number-line',...(label.kind==='MATH'?{kind:'MATH',tex:label.tex}:{kind:'TEXT',text:label.text})},identity);}
      catch(error){if(!isDomainCode(error))throw error;throw new Stop('NUMBER_LINE_TYPESET_ERROR',{labelId:label.id,code:error.message});}
      const {width,height}=fragment.intrinsic,{x,y,align}=label.anchor;
      if(height>label.rowHeight)throw new Stop('NUMBER_LINE_LABEL_TOO_LARGE',{labelId:label.id,height,rowHeight:label.rowHeight});
      // 'above-right' / 'above-left' (E35): the label stands above the anchor, on its right / left side (a name beside the compass arc of its point)
      const left=align==='right'||align==='left'||align==='above-right'||align==='above-left'?(align==='right'||align==='above-right'?x:x-width):x-width/2;
      if(label.role==='row-label'&&left<SAFE-0.01)throw new Stop('NUMBER_LINE_ROW_LABEL_TOO_WIDE',{labelId:label.id,width});
      placed.push({label,fragment,box:{x:r6(left),y:r6(align==='below'?y:align==='above'||align==='above-right'||align==='above-left'?y-height:y-height/2),width,height}});
    }
    for(let i=0;i<placed.length;i++)for(const other of placed.slice(i+1))if(overlaps(placed[i].box,other.box)){
      const roles=[placed[i].label.role,other.label.role];
      throw new Stop(roles.every(role=>role==='integer')?'NUMBER_LINE_INTEGER_POINTS_TOO_DENSE':'NUMBER_LINE_LABELS_TOO_CLOSE',{labels:[placed[i].label.id,other.label.id]});
    }
    // a compass arc never runs through a label or another dot; nor does a source grid (its lines, its segment) run through a label
    for(const row of spec.rows){
      for(const src of row.sources??[]){
        const lines=src.checkLines;
        for(const {label,box} of placed)for(const [x1,y1,x2,y2] of lines){
          const samples=Math.max(2,Math.ceil(Math.hypot(x2-x1,y2-y1)/2));
          if(Array.from({length:samples+1},(_,k)=>[x1+(x2-x1)*k/samples,y1+(y2-y1)*k/samples]).some(([x,y])=>x>box.x-ARC_LABEL_CLEAR&&x<box.x+box.width+ARC_LABEL_CLEAR&&y>box.y-ARC_LABEL_CLEAR&&y<box.y+box.height+ARC_LABEL_CLEAR))throw new Stop('NUMBER_LINE_CONSTRUCTION_SOURCE_ON_LABEL',{source:src.id,label:label.id});
        }
      }
      for(const arc of row.constructions??[]){
        const dir=arc.branch==='RIGHT'?1:-1,theta=Math.atan2(arc.cy-arc.y1,dir*(arc.x1-arc.cx));
        const samples=Array.from({length:ARC_SAMPLES+1},(_,k)=>[arc.cx+dir*arc.R*Math.cos(theta*k/ARC_SAMPLES),arc.cy-arc.R*Math.sin(theta*k/ARC_SAMPLES)]);
        for(const {label,box} of placed)if(samples.some(([x,y])=>x>box.x-ARC_LABEL_CLEAR&&x<box.x+box.width+ARC_LABEL_CLEAR&&y>box.y-ARC_LABEL_CLEAR&&y<box.y+box.height+ARC_LABEL_CLEAR))throw new Stop('NUMBER_LINE_CONSTRUCTION_ARC_ON_LABEL',{arc:arc.id,label:label.id});
        for(const dot of row.dots)if(dot.id!==`r${row.n}-pt-${pointSlug(arc.hit)}`&&samples.some(([x,y])=>Math.hypot(x-dot.x,y-dot.y)<=dot.r+ARC_STROKE))throw new Stop('NUMBER_LINE_CONSTRUCTION_ARC_ON_DOT',{arc:arc.id,dot:dot.id});
      }
    }
    lineage.fragmentSha256s=Object.fromEntries(placed.map(item=>[item.label.id,item.fragment.fragmentSha256]));
    const {width,height}=spec.size,{map}=spec;
    let body=`<rect width="${width}" height="${height}" fill="#fff"/>`;
    for(const row of spec.rows){
      const {axis,n}=row;
      body+=`<g data-layer="30"><line id="r${n}-axis" data-role="axis" data-axis="x" data-row="${n}" stroke="#111" stroke-width="1.2" fill="none" x1="${axis.x1}" y1="${axis.y}" x2="${axis.x2-6}" y2="${axis.y}"/>`;
      body+=`<polygon id="r${n}-axis-arrow" data-role="arrow" data-row="${n}" fill="#111" stroke="none" points="${axis.x2},${axis.y} ${axis.x2-9},${r6(axis.y-4)} ${axis.x2-9},${r6(axis.y+4)}"/></g>`;
      for(const tick of row.ticks){const minor=tick.role==='minor';body+=`<g data-layer="30"><line id="${tick.id}" data-role="${minor?'subtick':'tick'}" data-axis="x" data-row="${n}" data-value="${tick.value}"${tick.role?` data-scale="${tick.role}"`:''}${minor?` data-parts="${tick.parts}"`:''} stroke="#111" stroke-width="${minor?1:1.2}" fill="none" x1="${tick.x}" y1="${tick.y1}" x2="${tick.x}" y2="${tick.y2}"/></g>`;}
      for(const span of row.spans??[]){
        const head=`data-row="${n}" data-from="${span.from}" data-to="${span.to}" data-side="${span.side}" data-span-style="${span.style}"`,stroke=`stroke="#111" stroke-width="${SPAN_STROKE}"`;
        if(span.style==='BRACE')body+=`<g data-layer="45"><path id="${span.id}" data-role="span-brace" ${head} ${stroke} fill="none" d="${span.d}"/></g>`;
        else{
          body+=`<g data-layer="45"><line id="${span.id}" data-role="span-arrow" ${head} ${stroke} fill="none" x1="${span.shaft.x1}" y1="${span.shaft.y}" x2="${span.shaft.x2}" y2="${span.shaft.y}"/>`;
          span.heads.forEach((h,j)=>{body+=`<polygon id="${span.id}-head-${j+1}" data-role="span-head" data-row="${n}" data-of="${span.id}" fill="#111" stroke="none" points="${h.points.map(([x,y])=>x+','+y).join(' ')}"/>`;});
          body+='</g>';
        }
      }
      for(const band of row.bands)body+=`<g data-layer="40"><line id="${band.id}" data-role="solution-band" data-row="${n}" data-piece="${band.piece}" data-from="${esc(band.from)}" data-to="${esc(band.to)}" stroke="#111" stroke-width="${band.result?4.8:3.2}" stroke-linecap="butt" fill="none" x1="${band.x1}" y1="${band.y}" x2="${band.x2}" y2="${band.y}"/></g>`;
      for(const src of row.sources??[]){
        const head=`data-row="${n}" data-construction="${src.construction}"`;
        if(src.kind==='PERPENDICULAR'){
          const part=(key,role,seg)=>`<line id="${src.id}-${key}" data-role="${role}" ${head} data-at="${src.at}"${key==='perp'?` data-height="${esc(src.height)}"`:''} stroke="#111" stroke-width="${SOURCE_STROKE}" stroke-linecap="round" fill="none" x1="${seg.x1}" y1="${seg.y1}" x2="${seg.x2}" y2="${seg.y2}"/>`;
          body+=`<g data-layer="46">${part('perp','source-perpendicular',src.perp)}${part('hyp','source-hypotenuse',src.hyp)}<path id="${src.id}-right" data-role="source-right-angle" ${head} stroke="#111" stroke-width="1" fill="none" d="${src.rightAngle}"/></g>`;
          continue;
        }
        body+=`<g data-layer="25">${src.verticals.map(line=>`<line id="${line.id}" data-role="grid-line" ${head} data-axis="y" stroke="${LATTICE_COLOR}" stroke-width="${LATTICE_STROKE}" fill="none" x1="${line.x}" y1="${line.y1}" x2="${line.x}" y2="${line.y2}"/>`).join('')}${src.horizontals.map(line=>`<line id="${line.id}" data-role="grid-line" ${head} data-axis="x" stroke="${LATTICE_COLOR}" stroke-width="${LATTICE_STROKE}" fill="none" x1="${line.x1}" y1="${line.y}" x2="${line.x2}" y2="${line.y}"/>`).join('')}</g>`;
        body+=`<g data-layer="46"><line id="${src.id}" data-role="source-segment" ${head} data-from="${src.from.join(',')}" data-to="${src.to.join(',')}" stroke="#111" stroke-width="${SOURCE_STROKE}" stroke-linecap="round" fill="none" x1="${src.segment.x1}" y1="${src.segment.y1}" x2="${src.segment.x2}" y2="${src.segment.y2}"/></g>`;
      }
      for(const arc of row.constructions??[])body+=`<g data-layer="50"><path id="${arc.id}" data-role="construction-arc" data-row="${n}" data-construction="${arc.construction}" data-center="${arc.center}" data-hit="${arc.hit}" data-branch="${arc.branch}" data-radius="${esc(arc.radius)}" stroke="#111" stroke-width="${ARC_STROKE}" fill="none" d="${arc.d}"/></g>`;
      for(const dot of row.dots){
        const open=dot.state==='OPEN',cross=dot.style==='CROSS',tickMark=dot.style==='TICK',mark=cross||tickMark;
        if(dot.ring)body+=`<g data-layer="68"><circle id="${dot.id}-ring" data-role="point-ring" data-row="${n}" data-dot="ring" data-of="${dot.id}" stroke="#111" stroke-width="1.2" fill="none" cx="${dot.x}" cy="${dot.y}" r="${RING_RADIUS}"/></g>`;
        body+=`<g data-layer="70"><circle id="${dot.id}" data-role="point" data-row="${n}" data-dot="${dot.role}"${dot.symbol?` data-symbol="${esc(dot.symbol)}"`:` data-value="${esc(dot.value)}"`} data-state="${dot.state}"${dot.piece?` data-piece="${dot.piece}" data-end="${dot.side}"`:''}${dot.pointId?` data-point-id="${dot.pointId}"`:''}${dot.valueHidden?' data-value-shown="false"':''}${dot.style?` data-point-style="${dot.style}"`:''} stroke="${mark?'none':'#111'}" stroke-width="${open?1.6:.8}" fill="${mark?'none':open?'#fff':'#111'}" cx="${dot.x}" cy="${dot.y}" r="${dot.r}"/></g>`;
        if(tickMark)body+=`<g data-layer="71"><line id="${dot.id}-mark" data-role="tick-mark" data-row="${n}" data-of="${dot.id}" stroke="#111" stroke-width="2.2" stroke-linecap="round" fill="none" x1="${dot.x}" y1="${r6(dot.y-TICK_MARK_HALF)}" x2="${dot.x}" y2="${r6(dot.y+TICK_MARK_HALF)}"/></g>`;
        if(cross)for(const [k,[sx,sy]] of [[1,1],[1,-1]].entries())body+=`<g data-layer="71"><line id="${dot.id}-cross-${k+1}" data-role="cross" data-row="${n}" data-of="${dot.id}" stroke="#111" stroke-width="1.8" stroke-linecap="round" fill="none" x1="${r6(dot.x-sx*CROSS_HALF)}" y1="${r6(dot.y-sy*CROSS_HALF)}" x2="${r6(dot.x+sx*CROSS_HALF)}" y2="${r6(dot.y+sy*CROSS_HALF)}"/></g>`;
      }
    }
    for(const {label,fragment,box} of placed){
      body+=`<g data-layer="90"><g id="${label.id}" data-label-kind="${label.role==='set'?'EQUATION_LABEL':'COORDINATE_LABEL'}" data-label-role="${label.role}" data-priority="0" data-font-px="${font}" data-owner="${label.owner}"${label.row?` data-row="${label.row}"`:''}${label.value!==undefined?` data-value="${esc(label.value)}"`:''}${label.span?` data-span="${label.span.join(',')}"`:''}${label.kind==='MATH'?` data-tex="${esc(label.tex)}"`:` data-text="${esc(label.text)}"`} data-fragment-sha="${fragment.fragmentSha256}" transform="translate(${box.x} ${box.y})">${fragment.svg}</g></g>`;
    }
    const integerModes=spec.rows.map(row=>row.integerLabels?`${row.n}:${row.integerLabels}`:null).filter(Boolean).join(',');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet" role="img" data-number-line="${NUMBER_LINE_CAPABILITY}" data-figure="${FIGURE_CAPABILITY}" data-variable="${model.variable}"${model.axisVariable===false?' data-axis-variable="false"':''} data-unit-left="${map.unitLeft}" data-unit-right="${map.unitRight}" data-px-left="${map.pxLeft}" data-px-right="${map.pxRight}"${integerModes?` data-integer-labels="${integerModes}"`:''} data-publication-profile="fragment-publication-spike-v1" data-safe-margin="${SAFE}" style="max-width:100%;height:auto;stroke-linejoin:round;stroke-linecap:round">${body}</svg>`;
    lineage.svgSha256=bytesSha(Buffer.from(svg,'utf8'));
    if(process.env.APMS_DRAFT_DIR)(await import('node:fs')).writeFileSync(process.env.APMS_DRAFT_DIR+'/'+(process.env.APMS_DRAFT_TAG||'draft')+'-number-line-'+Date.now()+'.svg',svg);
    let response;
    try{response=await pythonWorker({numberLine:plan.numberLine,svg,...(plan.pointNames!==undefined?{pointNames:plan.pointNames}:{})},{script:OBSERVER_SCRIPT});}catch(error){throw new Stop('WORKER_ERROR',{stage:'numberLineAudit',code:String(error?.message??error)});}
    if(response?.status!=='OK')throw new Stop('WORKER_ERROR',{stage:'numberLineAudit',code:response?.result?.code??null});
    const audit=response.result;lineage.staticAuditSha256=objectSha(audit);
    const errors=[...(audit.errors??[])];
    if(audit.status==='PASS'&&audit.finalSvgSha256!==lineage.svgSha256)errors.push('STATIC_AUDIT_SVG_BYTES_MISMATCH');
    state.staticAudit={status:audit.status==='PASS'&&!errors.length?'PASS':'FAIL',errors};
    if(state.staticAudit.status!=='PASS')throw new Stop('NUMBER_LINE_STATIC_AUDIT_FAIL',{errors});
    const display={width:width*typographyPolicy.displayScale,height:height*typographyPolicy.displayScale};
    const page=await (browser??(ownBrowser=await launchBrowser())).newPage({viewport:{width:Math.max(1,Math.ceil(display.width)),height:Math.max(1,Math.ceil(display.height))}});
    let layout;
    try{layout=analyzeRenderedLayout(await captureAtDisplaySize(page,svg,display,{publicationViewport:PUBLICATION_VIEWPORT}));}finally{await page.close();}
    lineage.renderedLayoutSha256=objectSha({svgSha256:lineage.svgSha256,layout});
    state.renderedLayout={status:layout.status,display,errors:layout.errors};
    if(layout.status!=='PASS')throw new Stop('NUMBER_LINE_RENDERED_LAYOUT_FAIL',{errors:layout.errors});
    state.svg=svg;
    return outcome('COMPOSED');
  }catch(error){
    if(!(error instanceof Stop))throw error;
    return outcome(error.status,error.detail);
  }finally{if(ownBrowser)await ownBrowser.close();}
}

// --- the author plan ----------------------------------------------------------------------------------------------------------------------------
const CAPTION_MATH=/^[A-Za-z0-9=+\-<>.,()]{1,24}$/;
function caption(value,fallback){
  if(value===undefined)return fallback;
  if(!isPlain(value)||Object.keys(value).some(key=>!['math','text'].includes(key))||(!value.math&&!value.text)||(value.math!==undefined&&(typeof value.math!=='string'||!CAPTION_MATH.test(value.math)))||(value.text!==undefined&&(typeof value.text!=='string'||!value.text||value.text.length>24)))bad('CHAIN_CAPTION_INVALID');
  return value;
}
/**
 * {capability:'number-line-figure-v1',numberLine:{variable?,parameter?,rows},numberLineCaption?,caption,sourceConditions,newVisualInformation}
 * -> the one-panel composite-panels-v1 it stands for. The figure is solved here first, so a plan that cannot be drawn is refused before anything is.
 */
export function expandNumberLineFigure(plan){
  if(plan?.capability!==FIGURE_CAPABILITY||!isPlain(plan.numberLine))bad('NUMBER_LINE_FIGURE_PLAN_INVALID');
  onlyKeys(plan,['capability','numberLine','pointNames','numberLineCaption','caption','sourceConditions','newVisualInformation'],'NUMBER_LINE_FIGURE_PLAN_INVALID');
  figurePointNames(plan,solveNumberLineFigure(plan.numberLine));
  return {capability:'composite-panels-v1',chain:FIGURE_CAPABILITY,panels:[{caption:caption(plan.numberLineCaption,{text:'수직선 위의 범위'}),plan:{capability:NUMBER_LINE_CAPABILITY,numberLine:plan.numberLine,...(plan.pointNames!==undefined?{pointNames:plan.pointNames}:{})}}],
    caption:plan.caption,sourceConditions:plan.sourceConditions,newVisualInformation:plan.newVisualInformation};
}
