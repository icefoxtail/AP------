import type { BasicId } from '../../data/types';

function gcd(a:number,b:number):number{return b?gcd(b,a%b):Math.abs(a)||1}
function piCoefficient(n:number,d=1){const g=gcd(n,d),a=n/g,b=d/g;return {tex:b===1?`${a}\\pi`:`\\frac{${a}}{${b}}\\pi`,label:b===1?`${a}π`:`${a}π/${b}`} }

export function basicFormula(id:BasicId,r:number,theta:number){
  const arcTerm=piCoefficient(theta*r,180);
  const sectorTerm=piCoefficient(theta*r*r,360);
  switch(id){
    case 'basic-circumference':return {tex:`2\\pi r=2\\pi\\times ${r}=${2*r}\\pi\\text{ cm}`,value:`${2*r}π cm`,concept:'원의 둘레는 반지름의 2π배입니다.'};
    case 'basic-circle-area':return {tex:`\\pi r^2=\\pi\\times ${r}^2=${r*r}\\pi\\text{ cm}^2`,value:`${r*r}π cm²`,concept:'원을 같은 넓이의 부채꼴로 나누어 번갈아 놓으면 밑변 πr, 높이 r인 모양에 가까워집니다.'};
    case 'basic-arc':return {tex:`\\frac{${theta}}{360}\\times2\\pi\\times${r}=${arcTerm.tex}\\text{ cm}`,value:`${arcTerm.label} cm`,concept:`중심각 ${theta}°는 한 바퀴 360°의 ${theta}/360입니다.`};
    case 'basic-sector-perimeter':return {tex:`\\frac{${theta}}{360}\\times 2\\pi\\times ${r}+2\\times ${r}=${arcTerm.tex}+${2*r}\\text{ cm}`,value:`${arcTerm.label} + ${2*r} cm`,concept:'부채꼴의 둘레는 호 한 개와 반지름 두 개를 더합니다.'};
    case 'basic-sector-area':return {tex:`\\frac{${theta}}{360}\\times \\pi\\times ${r}^2=${sectorTerm.tex}\\text{ cm}^2`,value:`${sectorTerm.label} cm²`,concept:'부채꼴의 넓이는 원 전체 넓이의 중심각 비율만큼입니다.'};
  }
}
