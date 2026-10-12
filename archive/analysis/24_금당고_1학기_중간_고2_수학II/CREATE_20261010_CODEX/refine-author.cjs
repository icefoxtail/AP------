const fs=require('node:fs');const path=require('node:path');const p=path.join(__dirname,'author-create.mjs');let s=fs.readFileSync(p,'utf8');
s=s.replace("7:{answer:'④',unit:'application'","7:{answer:'④',unit:'tangent'");
s=s.replace("16:{answer:'④',unit:'application'","16:{answer:'④',unit:'derivative'");
s=s.replace(String.raw`$$f(x)=\\begin{cases}(x+1)^2+p&(x\\le-1),\\\\-(x+1)^2+p&(x>-1).\\end{cases}$$`,String.raw`$x\\le-1$에서는 $f(x)=(x+1)^2+p$이고, $x>-1$에서는 $f(x)=-(x+1)^2+p$이다.`);
const a=s.indexOf('17:{answer:');const b=s.indexOf('\n18:{answer:',a);if(a<0||b<0)throw Error('Q17_ENTRY_NOT_FOUND');
const q17=String.raw`17:{answer:'49',unit:'derivative',category:'미분계수의 정의를 이용한 계산',level:'중',bucket:3,pt:'PT_DERIVATIVE_DEFINITION',tpl:'TPL_DERIVATIVE_LIMIT_REDUCTION',method:'미분계수 정의의 차분을 전개해 h의 1차 계수를 읽는다.',step:'[f(2+h)−f(2)]/h의 극한을 정의대로 계산해 49를 얻는다.',integration:'NONE',solution:String.raw`+String.raw`미분계수의 정의에 따라
$$f'(2)=\lim_{h\to0}\frac{f(2+h)-f(2)}h.$$
$f(x)=4x^3+x-5$를 대입하면
$$\frac{f(2+h)-f(2)}h=\frac{4\{(2+h)^3-8\}+h}{h}=49+24h+4h^2.$$
따라서 $f'(2)=49$이다. 답은 49이다.`+String.raw`},`;
s=s.slice(0,a)+q17+s.slice(b);
s=s.replace("solution:[16,17].includes(q.id)?a.solution.split(String.fromCharCode(92,92)).join(String.fromCharCode(92)):a.solution","solution:[16,17].includes(q.id)?a.solution.split(String.fromCharCode(92,92)).join(String.fromCharCode(92)):a.solution");
s=s.replace('solution:a.solution,level:a.level','solution:[16,17].includes(q.id)?a.solution.split(String.fromCharCode(92,92)).join(String.fromCharCode(92)):a.solution,level:a.level');
fs.writeFileSync(p,s,'utf8');
