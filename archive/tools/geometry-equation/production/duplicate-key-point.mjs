// A graph requiredPoint and an overlays.points point that sit at exactly the same coordinates, both writing their coordinates, cannot both keep a label whose box is closer to its own dot
// than to the other (MEASURED_OWNER_LAYOUT_VORONOI_BOX_FAIL): two dots at one place have no Voronoi side. The render ladder (render-plan.mjs) then lists the requiredPoint in
// graphPlan.coordinateBand.hide once: its dot stays, the overlay point keeps the one coordinate label. This module only decides WHICH requiredPoint is the duplicate.
// Exact comparison only: rational text (a/b, integer, decimal) compared as reduced fractions; anything else (a root, an unknown family) is "not a duplicate". No approximation.

const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
function frac(n,d=1n){if(d===0n)return null;if(d<0n){n=-n;d=-d;}const g=gcd(n,d)||1n;return {n:n/g,d:d/g};}
export function parseExact(text){
  if(typeof text==='number'&&Number.isSafeInteger(text))return frac(BigInt(text));
  if(typeof text!=='string')return null;
  const t=text.trim();let m;
  if((m=/^([+-]?\d+)\/(\d+)$/.exec(t)))return frac(BigInt(m[1]),BigInt(m[2]));
  if((m=/^([+-]?)(\d+)(?:\.(\d+))?$/.exec(t))){const scale=10n**BigInt((m[3]||'').length);const n=BigInt(m[2]+(m[3]||''))*(m[1]==='-'?-1n:1n);return frac(n,scale);}
  return null;
}
const same=(a,b)=>a!==null&&b!==null&&a.n===b.n&&a.d===b.d;
const add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a,b)=>frac(a.n*b.n,a.d*b.d);
// exact value of a piecewise-polynomial graphPlan at x (rational coefficients only); null when anything is not plain rational text
function piecewiseValue(graphPlan,x){
  const pieces=graphPlan.pieces,breaks=graphPlan.breakpoints||[];
  if(!Array.isArray(pieces)||!pieces.length||!Array.isArray(breaks)||breaks.length!==pieces.length-1)return null;
  let index=pieces.length-1;
  for(let i=0;i<breaks.length;i++){const b=parseExact(breaks[i]?.x);if(b===null)return null;if(x.n*b.d<=b.n*x.d){index=i;break;}}
  const coefficients=pieces[index]?.coefficients;if(!Array.isArray(coefficients)||!coefficients.length)return null;
  let total=frac(0n),power=frac(1n);
  for(const raw of coefficients){const c=parseExact(raw);if(c===null)return null;total=add(total,mul(c,power));power=mul(power,x);}
  return total;
}
// The id of the requiredPoint that labelId ("required-point-<n>-coordinates") names, when an overlay point with coordinates stands at exactly its place; otherwise null.
export function duplicateRequiredPointId(graphPlan,labelId){
  const m=/^required-point-(\d+)-coordinates$/.exec(String(labelId??''));
  if(!m||!graphPlan||typeof graphPlan!=='object')return null;
  const required=graphPlan.requiredPoints;if(!Array.isArray(required))return null;
  const point=required[Number(m[1])-1];if(!point||typeof point.id!=='string')return null;
  const x=parseExact(point.x),y=parseExact(point.y);if(x===null||y===null)return null;
  const rows=graphPlan.overlays&&Array.isArray(graphPlan.overlays.points)?graphPlan.overlays.points:[];
  for(const row of rows){
    if(!row||typeof row!=='object'||!row.coordinates)continue;
    if(row.x!==undefined&&row.y!==undefined){if(same(parseExact(row.x),x)&&same(parseExact(row.y),y))return point.id;continue;}
    // curveX: the point of the (only, unnamed) drawn curve at that x; only the piecewise-polynomial family is evaluated here
    if(row.curveX!==undefined&&row.curve===undefined&&graphPlan.family==='piecewise-polynomial'){
      const cx=parseExact(row.curveX);if(!same(cx,x))continue;
      if(same(piecewiseValue(graphPlan,cx),y))return point.id;
    }
  }
  return null;
}
