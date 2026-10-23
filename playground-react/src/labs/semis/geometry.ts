/** geometry & exact π-rational computation. One source of truth for diagram and formulas. */
export type ShapeId = 'arch' | 'swirl' | 'holes' | 'holes3' | 'chain';
export type Mode = 'original' | 'line' | 'area';
export type Params = { a: number; b: number; c: number; holeD: number };
export const initialParams: Params = { a:8, b:6, c:4, holeD:12 };

export const SHAPES: {id:ShapeId; name:string; caption:string; icon:string}[] = [
  {id:'arch',name:'두 반원 파내기',caption:'큰 반원 − 작은 반원 2개',icon:'arches'},
  {id:'swirl',name:'태극 S자 결합',caption:'같은 크기 반원을 180° 돌려 옮기기',icon:'swirl'},
  {id:'holes',name:'원 속 구멍 두 개',caption:'바깥과 안쪽 경계',icon:'holes'},
  {id:'holes3',name:'원 속 작은 원 세 개',caption:'일렬로 채운 세 원 · 눈사람형',icon:'holes3'},
  {id:'chain',name:'반원 세 개 연결',caption:'지름이 달라도 호의 합 일정',icon:'chain'}
];

export type Fraction = { numerator:number; denominator:number };
export const fraction = (numerator:number,denominator=1):Fraction => ({numerator,denominator});
function gcd(a:number,b:number):number { a=Math.abs(a);b=Math.abs(b);while(b){const t=b;b=a%b;a=t;}return a||1; }
export function pi(f:Fraction):string {
  if(f.numerator===0) return '0';
  const g=gcd(f.numerator,f.denominator),n=f.numerator/g,d=f.denominator/g;
  if(d===1) return n===1?'π':n===-1?'−π':`${n}π`;
  return n===1?`π/${d}`:n===-1?`−π/${d}`:`${n}π/${d}`;
}
export function geometryMath(shape:ShapeId,p:Params){
  if(shape==='holes'||shape==='holes3'){
    const D=p.holeD,n=shape==='holes3'?3:2,smallD=D/n;
    return {
      D, inner:Array.from({length:n},()=>smallD), outerArc:fraction(D), innerArc:fraction(D),
      perimeter:fraction(2*D), area:fraction(D*D*(n-1),4*n),
      terms:[{sign:'+',name:'큰 원',amount:fraction(D*D,4)},
        ...Array.from({length:n},(_,i)=>({sign:'−',name:`작은 원 ${i+1}`,amount:fraction(D*D,4*n*n)}))],
      perimeterNote:`바깥 경계와 안쪽 작은 원 ${n}개의 경계를 모두 더합니다.`
    };
  }
  const inner=shape==='chain'?[p.a,p.b,p.c]:shape==='swirl'?[p.a,p.a]:[p.a,p.b];
  const D=inner.reduce((s,n)=>s+n,0);
  const signLast=shape==='swirl'?'+':'−';
  const areaNumber=shape==='swirl'?D*D-inner[0]*inner[0]+inner[1]*inner[1]:D*D-inner.reduce((s,d)=>s+d*d,0);
  return {
    D, inner, outerArc:fraction(D,2),innerArc:fraction(D,2),perimeter:fraction(D),area:fraction(areaNumber,8),
    terms:[{sign:'+',name:'큰 반원',amount:fraction(D*D,8)},
      ...inner.map((d,i)=>({sign:(i===1?signLast:'−'),name:`작은 반원 ${i+1}`,amount:fraction(d*d,8)})).map((term)=>shape==='chain'?{...term,sign:'−'}:term)],
    perimeterNote:'작은 반원들의 지름 합이 큰 지름과 같아, 두 호 길이의 합이 같습니다.'
  };
}

export function point(cx:number,cy:number,r:number,angle:number){return {x:cx+r*Math.cos(angle),y:cy+r*Math.sin(angle)};}
/** start to end in radians, increasing angle is clockwise in SVG coordinates */
export function arc(cx:number,cy:number,r:number,start:number,end:number):string {
  const a=point(cx,cy,r,start),b=point(cx,cy,r,end);
  return `M ${a.x.toFixed(3)} ${a.y.toFixed(3)} A ${r.toFixed(3)} ${r.toFixed(3)} 0 ${end-start>Math.PI?1:0} 1 ${b.x.toFixed(3)} ${b.y.toFixed(3)}`;
}
