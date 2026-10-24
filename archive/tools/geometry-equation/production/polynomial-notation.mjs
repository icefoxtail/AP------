const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a||1n;};
const rational=(n,d=1n)=>{if(!d)throw Error('POLYNOMIAL_COEFFICIENT_ZERO_DENOMINATOR');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);return[n/g,d/g];};
const parse=value=>{if(typeof value!=='string'||!/^[-+]?\d+(?:\/[-+]?\d+)?$/.test(value))throw Error('POLYNOMIAL_COEFFICIENT_INVALID');const[n,d='1']=value.split('/');return rational(BigInt(n),BigInt(d));};
const mul=(a,b)=>rational(a[0]*b[0],a[1]*b[1]);
const sub=(a,b)=>rational(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const div=(a,b)=>rational(a[0]*b[1],a[1]*b[0]);
const str=a=>a[1]===1n?String(a[0]):a[0]+'/'+a[1];
const term=a=>a[1]===1n?str(a):'('+str(a)+')';

// Equivalent quadratic vertex form keeps the source equation legible without
// shrinking glyphs or enlarging the formula panel. Curve sampling still uses
// the original exact coefficient inventory, independently of this notation.
export function quadraticVertexNotation(coefficients){
 if(!Array.isArray(coefficients)||coefficients.length!==3)return null;
 const[c,b,a]=coefficients.map(parse);if(!a[0])return null;
 const h=div([-b[0],b[1]],mul([2n,1n],a));
 const k=sub(c,div(mul(b,b),mul([4n,1n],a)));
 // A fraction after + or - needs no parentheses (division binds tighter); they would print as extra brackets.
 const shift=h[0]===0n?'x':h[0]<0n?'(x+'+str([-h[0],h[1]])+')':'(x-'+str(h)+')';
 const coefficient=a[0]===a[1]?'':a[0]===-a[1]?'-':term(a)+'*';
 const offset=k[0]===0n?'':k[0]<0n?'-'+str([-k[0],k[1]]):'+'+str(k);
 return {expression:coefficient+shift+'^2'+offset,vertex:{x:str(h),y:str(k)},coefficients:coefficients.map(v=>str(parse(v))),basis:'EXACT_COMPLETING_THE_SQUARE'};
}
