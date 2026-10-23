import type { PracticeId, PracticeParams } from './catalog';

export type Quantity={label:string;value:string};
export type PracticeResult={formula:string;concept:string;boundary?:string;area?:string;perimeter?:string;lineLabel?:string;terms?:Quantity[];unit:string};
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a)||1;
export function pi(n:number,d=1):string{const g=gcd(n,d),a=n/g,b=d/g;return b===1?`${a}π`:`${a}π/${b}`}
const frac=(n:number,d=1)=>d===1?String(n):`\\frac{${n}}{${d}}`;
const areaPi=(n:number,d=1)=>`${frac(n,d)}\\pi`;
const clean=(n:number)=>Number.isInteger(n)?String(n):n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
export function calculation(id:PracticeId,variant:string,p:PracticeParams):PracticeResult{
  const unit=id==='tether'?'m':'cm',r=p.r??6,theta=p.theta??90,s=p.s??8;
  if(id==='arc'||id==='sector'){
    const base=p.base??30,actualTheta=id==='arc'&&variant==='arc-isosceles'?180-2*base:theta;
    if(id==='sector'&&variant==='sector-ratio-pie'){
      const one=pi(r*r,6);
      return {formula:`\\theta_1:\\theta_2:\\theta_3=1:2:3;\\quad(\\theta_1,\\theta_2,\\theta_3)=(60^\\circ,120^\\circ,180^\\circ);\\quad A_1=\\frac{\\pi r^2}{6}=${one}`,concept:'호와 넓이는 중심각에 비례합니다. 1:2:3 비율의 합은 6이므로 첫 부채꼴은 원 넓이의 1/6입니다.',area:`${one} cm²`,terms:[{label:'첫째 중심각',value:'60°'},{label:'둘째 중심각',value:'120°'},{label:'셋째 중심각',value:'180°'},{label:'첫째 부채꼴 넓이',value:`${one} cm²`}],unit};
    }
    if(id==='arc'&&variant==='arc-isosceles'){
      const center=180-2*base;
      return {formula:`OA=OC\\implies\\angle OAC=\\angle OCA=${base}^\\circ;\\quad\\angle AOC=180^\\circ-2(${base}^\\circ)=${center}^\\circ;\\quad\\ell=${areaPi(r*center,180)}`,concept:'같은 반지름으로 만든 이등변삼각형의 밑각 두 개로 중심각을 먼저 구한 뒤 호 길이를 계산합니다.',boundary:`${pi(r*center,180)} cm`,lineLabel:'중심각에서 구한 호의 길이',terms:[{label:'이등변삼각형 밑각',value:`${base}°`},{label:'중심각',value:`${center}°`},{label:'호의 길이',value:`${pi(r*center,180)} cm`}],unit};
    }
    if(id==='arc'&&variant==='arc-secant3'){
      const sec=p.secant??24,arcAD=3*r;
      return {formula:`\\begin{aligned}\\angle BOC&=\\theta=${sec}^\\circ\\\\\\angle OCA&=\\angle OAC=2\\theta=${2*sec}^\\circ\\\\\\angle AOD&=\\theta+2\\theta=3\\theta=${3*sec}^\\circ\\\\\\ell_{AD}&=3\\ell_{BC}=3(${r})=${arcAD}\\text{ cm}\\end{aligned}`,concept:'할선 바깥 점에서 반지름을 이어 이등변삼각형을 두 번 이용하면 각이 θ→2θ→3θ로 이어집니다.',boundary:`${arcAD} cm`,lineLabel:'호 AD 길이 (호 BC의 3배)',terms:[{label:'각 단계',value:`${sec}° → ${2*sec}° → ${3*sec}°`},{label:'기준 호 BC',value:`${r} cm`},{label:'호 AD',value:`${arcAD} cm`}],unit};
    }
    const formula=id==='arc'&&variant==='arc-ratio'?`\\ell_1=\\frac{${theta}}{360}2\\pi r,\\quad\\ell_2=\\frac{360-${theta}}{360}2\\pi r;\\quad\\ell_1:\\ell_2=${theta}:${360-theta}`:id==='arc'?`\\ell=\\frac{${actualTheta}}{360}\\times2\\pi\\times${r}=${areaPi(r*actualTheta,180)}\\text{ ${unit}}`:
      variant==='sector-inverse'?`\\ell=${areaPi(theta*r,180)},\\quad A=${areaPi(theta*r*r,360)};\\quad r=\\frac{180\\ell}{${theta}\\pi}=${r}`:`\\ell=${areaPi(theta*r,180)},\\quad P=\\ell+2r=${areaPi(theta*r,180)}+${2*r},\\quad A=${areaPi(theta*r*r,360)}`;
    if(id==='arc')return {formula,concept:variant==='arc-ratio'?'같은 원의 두 호 길이 비는 각 호에 대응하는 중심각의 비와 같습니다.':'호와 현을 구분하고, 중심각이 원 전체에서 차지하는 비율을 사용합니다.',boundary:`${pi(r*actualTheta,180)} cm`,lineLabel:'호의 길이',terms:variant==='arc-ratio'?[{label:'첫째 호',value:`${pi(theta*r,180)} cm`},{label:'나머지 호',value:`${pi((360-theta)*r,180)} cm`},{label:'호의 길이 비',value:`${theta}:${360-theta}`}]:[{label:'호의 길이',value:`${pi(r*actualTheta,180)} cm`}],unit};
    return {formula,concept:'부채꼴의 호·전체 둘레·넓이는 서로 다른 양입니다. 각 식에 맞는 경계와 단위를 확인합니다.',boundary:`${pi(theta*r,180)} cm`,perimeter:`${pi(theta*r,180)} + ${2*r} cm`,area:`${pi(theta*r*r,360)} cm²`,terms:[{label:'호의 길이',value:`${pi(theta*r,180)} cm`},{label:'부채꼴 넓이',value:`${pi(theta*r*r,360)} cm²`}],unit};
  }
  if(id==='boundary'){
    if(variant==='boundary-track'){
      const diameter=s;
      return {formula:`P=2\\pi r+2(2r)=${pi(diameter)}+${2*diameter};\\quad A=\\pi r^2+(2r)^2=${pi(diameter*diameter,4)}+${diameter*diameter}`,concept:'양옆 반원 두 개를 합치면 지름이 같은 원 한 개입니다. 직선 두 구간은 둘레에 포함합니다.',perimeter:`${pi(diameter)} + ${2*diameter} cm`,area:`${pi(diameter*diameter,4)} + ${diameter*diameter} cm²`,terms:[{label:'양옆 반원 호 합',value:`${pi(diameter)} cm`},{label:'위·아래 직선',value:`${2*diameter} cm`},{label:'색칠 넓이',value:`${pi(diameter*diameter,4)} + ${diameter*diameter} cm²`}],unit};
    }
    if(variant==='boundary-ring'){
      const R=Math.max(p.R??8,(p.r??4)+1),q=Math.min(p.r??4,R-1);
      return {formula:`A=\\frac{${theta}}{360}\\pi(${R}^2-${q}^2),\\quad P=\\frac{${theta}}{360}2\\pi(${R}+${q})+2(${R}-${q})`,concept:'고리 모양 부채꼴은 안쪽·바깥쪽 원호와 두 반지름 방향 선분이 경계입니다.',perimeter:`${pi(theta*(R+q),180)} + ${2*(R-q)} cm`,area:`${pi(theta*(R*R-q*q),360)} cm²`,terms:[{label:'바깥 원호',value:`${pi(theta*R,180)} cm`},{label:'안쪽 원호',value:`${pi(theta*q,180)} cm`},{label:'직선 2개',value:`${2*(R-q)} cm`}],unit};
    }
    return {formula:`P=3s+\\pi\\frac{s}{2}=${3*s}+${pi(s,2)};\\quad A=s^2-\\frac{\\pi s^2}{8}`,concept:'잘라 낸 반원의 지름선은 도형 안쪽에 있으므로 둘레에서 빼고, 파인 호는 포함합니다.',perimeter:`${3*s} + ${pi(s,2)} cm`,area:`${s*s} − ${pi(s*s,8)} cm²`,terms:[{label:'남은 직선 3개',value:`${3*s} cm`},{label:'파인 반원 호',value:`${pi(s,2)} cm`},{label:'빠진 반원 넓이',value:`−${pi(s*s,8)} cm²`}],unit};
  }
  if(id==='square'){
    if(variant==='square-rect-quadrant'){
      const radius=s,width=Math.min(p.a??5,radius-1),height=Math.sqrt(radius*radius-width*width);
      return {formula:`AC=OB=r;\\quad L_{\\text{호}}=\\frac14(2\\pi r)=\\frac{\\pi r}{2};\\quad A=\\frac{\\pi r^2}{4}`,concept:'직사각형의 두 대각선 길이는 같습니다. 반대쪽 대각선 OB가 원의 반지름이므로 사분원의 호와 넓이를 구할 수 있습니다.',boundary:`${pi(radius,2)} cm`,lineLabel:'사분원 호의 길이',perimeter:`${pi(radius,2)} + ${2*radius} cm`,area:`${pi(radius*radius,4)} cm²`,terms:[{label:'주어진 직사각형 대각선 AC',value:`${radius} cm`},{label:'반대쪽 대각선 OB = 반지름',value:`${radius} cm`},{label:'직사각형 변',value:`${clean(width)} × ${clean(height)} cm`},{label:'사분원 넓이',value:`${pi(radius*radius,4)} cm²`}],unit};
    }
    if(variant==='square-inscribed'){
      const radius=s,side=radius*Math.sqrt(2);
      return {formula:`S_{\\text{색칠}}=\\pi R^2-\\frac12(2R)(2R)=\\pi R^2-2R^2`,concept:'원의 지름은 안쪽 정사각형의 대각선입니다. 두 대각선이 수직이므로 정사각형 넓이는 대각선 곱의 절반입니다.',perimeter:`${pi(2*radius)} + ${clean(4*side)} cm`,area:`${pi(radius*radius)} − ${2*radius*radius} cm²`,terms:[{label:'원 넓이',value:`${pi(radius*radius)} cm²`},{label:'안쪽 정사각형',value:`−${2*radius*radius} cm²`},{label:'정사각형 대각선',value:`${2*radius} cm`},{label:'정사각형 변',value:`${clean(side)} cm`}],unit};
    }
    if(variant==='square-flower'){
      return {formula:`A=s^2-\\pi\\frac{s^2}{4};\\quad P=\\pi s`,concept:'모서리 네 사분원은 원 한 개와 같은 넓이입니다. 가운데 곡선 경계만 합칩니다.',perimeter:`${pi(s)} cm`,area:`${s*s} − ${pi(s*s,4)} cm²`,terms:[{label:'정사각형',value:`${s*s} cm²`},{label:'네 사분원',value:`−${pi(s*s,4)} cm²`},{label:'중앙 곡선 둘레',value:`${pi(s)} cm`}],unit};
    }
    return {formula:`A=2\\times\\frac{\\pi s^2}{4}-s^2;\\quad P=2\\times\\frac{1}{4}(2\\pi s)`,concept:'두 사분원을 더하면 정사각형이 한 번 겹쳐 더해지므로 정사각형 넓이를 빼야 렌즈만 남습니다.',perimeter:`${pi(s)} cm`,area:`(${clean(Math.PI/2)} − 1) × ${s*s} cm²`,terms:[{label:'두 사분원 넓이',value:`${pi(s*s,2)} cm²`},{label:'겹친 정사각형',value:`−${s*s} cm²`},{label:'두 호의 합',value:`${pi(s)} cm`}],unit};
  }
  if(id==='spinarea'){
    const inner=p.r??3,w=p.w??3,outer=inner+w;
    return {formula:`A=\\frac{${theta}}{360}\\pi[(${outer})^2-(${inner})^2];\\quad P=\\frac{${theta}}{360}2\\pi(${outer}+${inner})+2(${w})`,concept:'큰 부채꼴에서 작은 부채꼴을 빼면 같은 각도만큼 회전한 띠가 남습니다.',perimeter:`${pi(theta*(outer+inner),180)} + ${2*w} cm`,area:`${pi(theta*(outer*outer-inner*inner),360)} cm²`,terms:[{label:'큰 부채꼴',value:`${pi(theta*outer*outer,360)} cm²`},{label:'작은 부채꼴',value:`−${pi(theta*inner*inner,360)} cm²`},{label:'남은 띠',value:`${pi(theta*(outer*outer-inner*inner),360)} cm²`}],unit};
  }
  if(id==='rotate'){
    const side=p.r??4,rad=variant==='rotate-square'?Math.sqrt(2)*side:side,turn=theta,arcExact=pi(turn*side,180);
    const arcText=variant==='rotate-square'?`${arcExact}√2`:`${arcExact}`;
    return {formula:variant==='rotate-square'?`L=\\frac{${turn}}{360}\\times2\\pi\\times${side}\\sqrt2=${frac(turn*side,180)}\\sqrt2\\pi`:`L=\\frac{${turn}}{360}\\times2\\pi\\times${rad}=${arcExact}`,concept:variant==='rotate-square'?'회전 중심에서 움직이는 꼭짓점까지의 대각선이 원호의 반지름입니다.':'회전 중심에서 점까지의 반지름과 회전각으로 원호 길이를 구합니다.',perimeter:`${arcText} cm`,lineLabel:'점이 이동한 원호 거리',terms:[{label:'회전 반지름',value:`${clean(rad)} cm`},{label:'회전각',value:`${turn}°`},{label:'움직인 원호',value:`${arcText} cm`}],unit};
  }
  if(id==='rope'){
    const rad=p.r??2,cols=p.c??2,rows=p.rows??2;
    const tri=variant==='rope-triangle',straight=tri?6*rad:4*rad*(cols+rows-2);
    return {formula:tri?`L=3(2r)+2\\pi r=${straight}+${pi(2*rad)}`:`L=2[(c-1)2r+(m-1)2r]+2\\pi r=${straight}+${pi(2*rad)}`,concept:'중심들을 이은 도형의 둘레가 직선 접선 합과 같습니다. 둥근 모서리 호는 한 바퀴로 합쳐집니다.',perimeter:`${straight} + ${pi(2*rad)} cm`,lineLabel:'팽팽한 끈의 전체 길이',terms:[{label:'직선 접선',value:`${straight} cm`},{label:'둥근 모서리 호',value:`${pi(2*rad)} cm`}],unit};
  }
  if(id==='rolling'){
    const side=p.s??5,rad=p.r??2,n=p.n??4,area=2*rad*n*side+4*Math.PI*rad*rad;
    return {formula:`L=n s+2\\pi r=${n}\\times${side}+${pi(2*rad)};\\quad A=2r(ns)+4\\pi r^2`,concept:'다각형 한 바퀴를 따라가는 중심의 직선·원호 길이와 원이 지나가며 쓸어낸 넓이를 나눠 봅니다.',perimeter:`${n*side} + ${pi(2*rad)} cm`,lineLabel:'원의 중심 이동 거리',area:`${2*rad*n*side} + ${pi(4*rad*rad)} cm²`,terms:[{label:'중심 직선 이동',value:`${n*side} cm`},{label:'중심 모서리 호',value:`${pi(2*rad)} cm`},{label:'지나간 넓이',value:`${clean(area)} cm²`}],unit};
  }
  if(id==='overlap'){
    if(variant==='overlap-nested'||variant==='overlap-baby-circle'){
      const R=p.R??6,q=variant==='overlap-baby-circle'?R/2:Math.min(p.r??3,R-1),relation=variant==='overlap-baby-circle'?'작은 원의 지름은 큰 원의 반지름과 같습니다.':'동심원 고리의 안팎 경계를 모두 포함합니다.';
      return {formula:`A=\\pi(${R}^2-${q}^2);\\quad P=2\\pi(${R}+${q})`,concept:relation,perimeter:`${pi(2*(R+q))} cm`,area:`${pi(R*R-q*q)} cm²`,terms:[{label:'큰 원 넓이',value:`${pi(R*R)} cm²`},{label:'작은 원 넓이',value:`−${pi(q*q)} cm²`},{label:'안팎 둘레',value:`${pi(2*(R+q))} cm`}],unit};
    }
    if(variant==='overlap-leaf'){
      const a=p.a??6,b=p.b??8,area=a*b/2;
      return {formula:`S_{\\text{두 초승달}}=(\\frac{a^2\\pi}{8}+\\frac{b^2\\pi}{8}+\\frac12ab)-\\frac{(a^2+b^2)\\pi}{8}=\\frac12ab`,concept:'작은 두 반원의 넓이 합은 빗변 위 큰 반원의 넓이와 같습니다. 원주율이 포함된 부분을 빼면 직각삼각형 넓이만 남습니다.',area:`${clean(area)} cm²`,terms:[{label:'작은 반원 2개',value:`${pi(a*a+b*b,8)} cm²`},{label:'직각삼각형을 더함',value:`+ ${clean(area)} cm²`},{label:'빗변 위 큰 반원',value:`−${pi(a*a+b*b,8)} cm²`}],unit};
    }
    const rad=p.r??6;
    return {formula:`A=2\\times\\frac14\\pi r^2-r^2=\\frac12\\pi r^2-r^2,\\quad P=2\\times\\frac14(2\\pi r)=\\pi r`,concept:'같은 크기의 두 원을 정사각형 대각 꼭짓점에 놓으면 교집합은 90° 원호 두 개로 둘러싸입니다. 사분원 둘에서 정사각형을 빼면 넓이가 나옵니다.',perimeter:`${pi(rad)} cm`,area:`${pi(rad*rad,2)} − ${rad*rad} cm²`,terms:[{label:'사분원 두 개',value:`${pi(rad*rad,2)} cm²`},{label:'겹친 정사각형',value:`−${rad*rad} cm²`},{label:'렌즈 둘레',value:`${pi(rad)} cm`}],unit};
  }
  if(id==='polygon'){
    const n=p.n??6,rad=p.r??6,angle=360/n;
    return {formula:`\\theta=\\frac{360^\\circ}{${n}}=${clean(angle)}^\\circ;\\quad A=\\frac{\\pi r^2}{${n}}=${pi(rad*rad,n)}`,concept:`정다각형 ${n}각형의 중심에서 꼭짓점을 이으면 원은 ${n}개의 같은 부채꼴로 나뉩니다.`,boundary:`${pi(2*rad,n)} cm`,lineLabel:'한 호의 길이',area:`${pi(rad*rad,n)} cm²`,terms:[{label:'중심각',value:`${clean(angle)}°`},{label:'한 호의 길이',value:`${pi(2*rad,n)} cm`},{label:'한 부채꼴 넓이',value:`${pi(rad*rad,n)} cm²`}],unit};
  }
  if(id==='tether'){
    const R=p.R??7,w=Math.min(p.w??5,R),h=Math.min(p.h??4,R),wall=variant==='tether-wall',area=wall?Math.PI*R*R/2:Math.PI*(3*R*R+(R-w)**2+(R-h)**2)/4;
    return {formula:wall?`A=\\frac12\\pi R^2`:`A=\\frac34\\pi R^2+\\frac14\\pi(R-w)^2+\\frac14\\pi(R-h)^2`,concept:wall?'긴 직선 울타리가 줄을 막으므로 접근 가능한 쪽은 반원입니다.':'줄이 집 모서리에 감기면 남은 길이만큼의 새 부채꼴이 추가됩니다. 추가 영역은 서로 겹치지 않는 것으로 둡니다.',area:`${clean(area/Math.PI)}π m²`,terms:[{label:'처음 접근하는 영역',value:`${wall?'1/2':'3/4'}πR²`},{label:'모퉁이 뒤 남은 줄',value:wall?'없음':`길이 ${clean(R-w)} m, ${clean(R-h)} m`},{label:'접근 가능 넓이',value:`${clean(area/Math.PI)}π m²`}],unit};
  }
  if(id==='equalarea'){
    if(variant==='equalarea-common-part'){
      const radius=p.r??6;
      return {formula:`S_1=S_2\\iff S_1+W=S_2+W;\\quad \\frac14\\pi r^2=r x\\implies x=\\frac{\\pi r}{4}=${pi(radius,4)}\\text{ cm}`,concept:'두 색칠 넓이에 같은 빈 영역 W를 더해 비교하면 사분원과 직사각형이 됩니다. 넓이는 보존됩니다.',area:`${pi(radius*radius,4)} cm²`,terms:[{label:'사분원 넓이',value:`${pi(radius*radius,4)} cm²`},{label:'직사각형 넓이 r×x',value:`${radius} × ${pi(radius,4)} = ${pi(radius*radius,4)} cm²`},{label:'직사각형 가로 x',value:`${pi(radius,4)} cm`}],unit};
    }
    const a=p.a??6,b=p.b??8,triangle=a*b/2;
    return {formula:`S_{\\text{lunes}}=(\\frac{a^2\\pi}{8}+\\frac{b^2\\pi}{8}+\\frac12ab)-\\frac{(a^2+b^2)\\pi}{8}=\\frac12ab=${clean(triangle)}\\text{ cm}^2`,concept:'두 작은 반원의 넓이 합이 빗변 위 큰 반원의 넓이와 같습니다. π가 붙은 부분이 상쇄되어 두 초승달 넓이의 합은 직각삼각형 넓이가 됩니다.',area:`${clean(triangle)} cm²`,terms:[{label:'작은 반원 2개',value:`${pi(a*a+b*b,8)} cm²`},{label:'더한 직각삼각형',value:`+ ${clean(triangle)} cm²`},{label:'빗변의 큰 반원',value:`− ${pi(a*a+b*b,8)} cm²`},{label:'초승달 넓이 합',value:`${clean(triangle)} cm²`}],unit};
  }
  const a=p.a??18,b=variant==='pizza-equal'?a:(p.b??16),na=p.na??6,nb=p.nb??8,aa=a*a/(4*na),bb=b*b/(4*nb),ratio=aa/bb;
  const toFrac=(x:number)=>{let bestN=0,bestD=1,err=Infinity;for(let d=1;d<=100;d++){const n=Math.round(x*d),e=Math.abs(x-n/d);if(e<err){bestN=n;bestD=d;err=e}}const g=gcd(bestN,bestD);return `${bestN/g}/${bestD/g}`};
  return {formula:`A_A=\\frac{\\pi(${a}/2)^2}{${na}}=${pi(a*a,4*na)};\\quad A_B=\\frac{\\pi(${b}/2)^2}{${nb}}=${pi(b*b,4*nb)}`,concept:'각 피자의 넓이를 먼저 구한 뒤 조각 수로 나눕니다. 지름의 제곱과 조각 수를 모두 반영합니다.',area:`A : B = ${toFrac(aa)} : ${toFrac(bb)}`,terms:[{label:'A 한 조각',value:`${pi(a*a,4*na)} cm²`},{label:'B 한 조각',value:`${pi(b*b,4*nb)} cm²`},{label:'크기 비',value:`${toFrac(ratio)} : 1`}],unit};
}
