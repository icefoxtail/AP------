// A polynomial written the way a person writes it. A plan may give a display formula such as "(5) + (0)*x + (-1)*x^2"; the figure shows -x^2+5:
// terms by falling degree, a coefficient 1 left out, a zero term removed, a negative term as a subtraction. Only a polynomial in one variable with integer or fraction
// coefficients is rewritten (the same function: the rewrite is the expanded polynomial); anything else (a root, a letter coefficient, a power of a bracket that is not a whole
// number, an unknown character) comes back exactly as it was written, so this never changes what a formula means.
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
const frac=(n,d=1n)=>{if(d===0n)throw Error('DIV0');if(d<0n){n=-n;d=-d;}const g=gcd(n,d)||1n;return {n:n/g,d:d/g};};
const add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a,b)=>frac(a.n*b.n,a.d*b.d);
const padd=(p,q)=>{const out=new Map(p);for(const [k,v] of q)out.set(k,out.has(k)?add(out.get(k),v):v);return out;};
const pneg=p=>new Map([...p].map(([k,v])=>[k,frac(-v.n,v.d)]));
const pmul=(p,q)=>{let out=new Map();for(const [a,x] of p)for(const [b,y] of q)out=padd(out,new Map([[a+b,mul(x,y)]]));return out;};
const constant=f=>new Map([[0,f]]);

function parsePolynomial(text,variable){
  const tokens=[];
  for(const m of text.matchAll(/\s*(\d+|[A-Za-z]|[-+*/^()])/gy))tokens.push(m[1]);
  if(tokens.join('')!==text.replace(/\s+/g,''))throw Error('SYNTAX');
  let i=0;const peek=()=>tokens[i],next=()=>tokens[i++];
  const expr=()=>{let v=term();while(peek()==='+'||peek()==='-'){const op=next(),t=term();v=padd(v,op==='-'?pneg(t):t);}return v;};
  const term=()=>{let v=unary();for(;;){const t=peek();if(t==='*'){next();v=pmul(v,unary());}else if(t==='/'){next();const d=unary();if(d.size!==1||!d.has(0))throw Error('DIVISOR');const c=d.get(0);if(c.n===0n)throw Error('DIV0');v=pmul(v,constant(frac(c.d,c.n)));}else if(t!==undefined&&(t===variable||t==='(')){v=pmul(v,power());}else break;}return v;};
  const unary=()=>{if(peek()==='-'){next();return pneg(unary());}if(peek()==='+'){next();return unary();}return power();};
  const power=()=>{const base=atom();if(peek()!=='^')return base;next();const e=next();if(!/^\d+$/.test(e??'')||Number(e)>8)throw Error('EXPONENT');let v=constant(frac(1n));for(let k=0;k<Number(e);k++)v=pmul(v,base);return v;};
  const atom=()=>{const t=next();if(t==='(')  {const v=expr();if(next()!==')')throw Error('PAREN');return v;}if(/^\d+$/.test(t??''))return constant(frac(BigInt(t)));if(t===variable)return new Map([[1,frac(1n)]]);throw Error('TOKEN');};
  const out=expr();if(i!==tokens.length)throw Error('TRAILING');return out;
}

/** The tidy text of a polynomial formula in `variable` (default x) with the shown letter `shown` (default the same), or the original text when it is not such a polynomial. */
export function tidyPolynomialText(text,{variable='x',shown=variable}={}){
  if(typeof text!=='string'||!text.trim())return text;
  let poly;try{poly=parsePolynomial(text,variable);}catch{return text;}
  const degrees=[...poly].filter(([,c])=>c.n!==0n).map(([k])=>k).sort((a,b)=>b-a);
  if(!degrees.length)return '0';
  let out='';
  for(const k of degrees){
    const c=poly.get(k),negative=c.n<0n,n=negative?-c.n:c.n,d=c.d;
    const power=k===0?'':shown+(k>1?'^'+k:'');
    const body=k===0?(d===1n?String(n):n+'/'+d):(n===1n?'':String(n))+power+(d===1n?'':'/'+d);
    out+=(negative?'-':out?'+':'')+body;
  }
  return out;
}
