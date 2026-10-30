// Exact reading of a free line-equation text (E31): "y=ax+6", "x-1=0", "ax+y+4=0" (the JS twin of linear_text.py, used for lineLabels[].text).
// The text is read as a linear equation in x and y with exact rational arithmetic. `values` gives the number a letter other than x and y stands for in the
// drawing ({"a":"3/2"}). A letter without a value makes the text symbolic: readEquation answers null (shown as written, not compared with a drawn line).
export const LINE_TEXT_PATTERN=/^[0-9A-Za-z=+\-*/().^ ]{1,40}$/;
const gcd=(a,b)=>{a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b];}return a;};
export const frac=(n,d=1n)=>{if(d===0n)throw Error('LINE_TEXT_INVALID');if(d<0n){n=-n;d=-d;}const g=gcd(n,d)||1n;return {n:n/g,d:d/g};};
const fadd=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),fneg=a=>({n:-a.n,d:a.d}),fmul=(a,b)=>frac(a.n*b.n,a.d*b.d),fdiv=(a,b)=>frac(a.n*b.d,a.d*b.n),fzero=a=>a.n===0n;
const ZERO=frac(0n),ONE=frac(1n);
const SYMBOLIC={symbolic:true};
const isConstant=v=>!v.symbolic&&fzero(v.x??ZERO)&&fzero(v.y??ZERO);
const lin=(x=ZERO,y=ZERO,c=ZERO)=>({x,y,c});
const add=(a,b,sign=1)=>{
  if(a.symbolic||b.symbolic)return SYMBOLIC;
  const s=sign===1?v=>v:fneg;return lin(fadd(a.x,s(b.x)),fadd(a.y,s(b.y)),fadd(a.c,s(b.c)));
};
const times=(a,b)=>{
  if(a.symbolic||b.symbolic)return SYMBOLIC;
  let scale,other;
  if(isConstant(a)){scale=a.c;other=b;}else if(isConstant(b)){scale=b.c;other=a;}else throw Error('LINE_TEXT_NOT_LINEAR');
  return lin(fmul(scale,other.x),fmul(scale,other.y),fmul(scale,other.c));
};
const divide=(a,b)=>{
  if(b.symbolic)return SYMBOLIC;
  if(!isConstant(b))throw Error('LINE_TEXT_NOT_LINEAR');
  if(fzero(b.c))throw Error('LINE_TEXT_INVALID');
  if(a.symbolic)return a;
  return lin(fdiv(a.x,b.c),fdiv(a.y,b.c),fdiv(a.c,b.c));
};
const decimal=text=>{const [whole,part='']=text.split('.');return frac(BigInt(whole+part),10n**BigInt(part.length));};
const tokenize=text=>{
  const out=[],pattern=/\s*(?:(\d+(?:\.\d+)?)|([A-Za-z])|([=+\-*/().^]))/y;let at=0;const body=text.trim();
  while(at<body.length){pattern.lastIndex=at;const m=pattern.exec(body);if(!m)throw Error('LINE_TEXT_INVALID');out.push(m[1]!==undefined?['n',decimal(m[1])]:m[2]!==undefined?['l',m[2]]:['s',m[3]]);at=pattern.lastIndex;}
  return out;
};
export function readValues(values){
  if(values===undefined||values===null)return {};
  if(typeof values!=='object'||Array.isArray(values))throw Error('LINE_TEXT_VALUES_INVALID');
  const out={};
  for(const [letter,text] of Object.entries(values)){
    if(!/^[A-Za-z]$/.test(letter)||letter==='x'||letter==='y'||typeof text!=='string'||!/^-?\d+(?:\/\d+)?$/.test(text)||/\/0+$/.test(text))throw Error('LINE_TEXT_VALUES_INVALID');
    const [n,d='1']=text.split('/');out[letter]=frac(BigInt(n),BigInt(d));
  }
  return out;
}
function reader(tokens,values){
  let at=0;
  const peek=()=>tokens[at],take=()=>tokens[at++],is=(token,type,value)=>token&&token[0]===type&&(value===undefined||token[1]===value);
  const startsAtom=()=>{const t=peek();return !!t&&(t[0]==='n'||t[0]==='l'||(t[0]==='s'&&t[1]==='('));};
  function atom(){
    const t=take();if(!t)throw Error('LINE_TEXT_INVALID');
    if(t[0]==='n')return lin(ZERO,ZERO,t[1]);
    if(t[0]==='l'){if(t[1]==='x')return lin(ONE);if(t[1]==='y')return lin(ZERO,ONE);return Object.hasOwn(values,t[1])?lin(ZERO,ZERO,values[t[1]]):SYMBOLIC;}
    if(t[0]==='s'&&t[1]==='('){const v=side();const close=take();if(!is(close,'s',')'))throw Error('LINE_TEXT_INVALID');return v;}
    throw Error('LINE_TEXT_INVALID');
  }
  function power(){
    const base=atom();
    if(is(peek(),'s','^')){take();const e=take();if(!e||e[0]!=='n'||!(fzero(e[1])||(e[1].n===1n&&e[1].d===1n)))throw Error('LINE_TEXT_NOT_LINEAR');return fzero(e[1])?lin(ZERO,ZERO,ONE):base;}
    return base;
  }
  function unary(){
    const t=peek();
    if(is(t,'s','-')||is(t,'s','+')){take();const inner=unary();return t[1]==='+'?inner:times(lin(ZERO,ZERO,fneg(ONE)),inner);}
    return power();
  }
  function term(){
    let value=unary();
    for(;;){
      const t=peek();
      if(is(t,'s','*')){take();value=times(value,unary());}
      else if(is(t,'s','/')){take();value=divide(value,unary());}
      else if(startsAtom())value=times(value,unary());
      else return value;
    }
  }
  function side(){
    let value=term();
    while(is(peek(),'s','+')||is(peek(),'s','-')){const sign=take()[1]==='+'?1:-1;value=add(value,term(),sign);}
    return value;
  }
  return {side,done:()=>at>=tokens.length};
}
/** The text as {a,b,c} (A*x+B*y+C=0, exact fractions, lhs minus rhs), or null when it holds a letter with no value. Refusals: LINE_TEXT_INVALID, LINE_TEXT_NOT_LINEAR. */
export function readEquation(text,values){
  if(typeof text!=='string'||!LINE_TEXT_PATTERN.test(text)||text.split('=').length!==2)throw Error('LINE_TEXT_INVALID');
  const known=readValues(values),tokens=tokenize(text),cut=tokens.findIndex(t=>t[0]==='s'&&t[1]==='=');
  const sides=[tokens.slice(0,cut),tokens.slice(cut+1)].map(part=>{
    if(!part.length)throw Error('LINE_TEXT_INVALID');
    const r=reader(part,known),value=r.side();if(!r.done())throw Error('LINE_TEXT_INVALID');return value;
  });
  if(sides[0].symbolic||sides[1].symbolic)return null;
  const d=add(sides[0],sides[1],-1);return {a:d.x,b:d.y,c:d.c};
}
/** True when the read text and a x + b y + c = 0 (fractions) are the same line: the coefficient triples are proportional and neither is all zero. */
export function sameLine(e,l){
  const z=t=>fzero(t.a)&&fzero(t.b);if(z(e)||z(l))return false;
  const m=(p,q)=>fmul(p,q),eq=(p,q)=>p.n===q.n&&p.d===q.d;
  return eq(m(e.a,l.b),m(l.a,e.b))&&eq(m(e.a,l.c),m(l.a,e.c))&&eq(m(e.b,l.c),m(l.b,e.c));
}
