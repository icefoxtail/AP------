const fs=require('node:fs');
const path=require('node:path');
const p=path.join(__dirname,'author-create.mjs'); let s=fs.readFileSync(p,'utf8');
s=s.replace('const root = process.argv[2];','const root = process.argv.at(-1);');
const a=s.indexOf('**ㄴ.**'), b=s.indexOf('**ㄹ.**',a); if(a<0||b<0)throw Error('Q9_SECTION_NOT_FOUND');
const q9=String.raw`**ㄴ.** $a=0$에서 $f(x)=1+x$, $g(t)=\sin\frac1{t-1}$로 두자. $x\to0$일 때 $f(x)\to1$, $g(x)\to\sin(-1)$이므로 두 극한은 존재한다. 그러나 $g(f(x))=\sin(1/x)$는 극한이 없다. 거짓이다.

**ㄷ.** $f(x)=1$, $g(x)=1+x$로 두면 $f(x)+g(x)=2+x$, $f(x)-g(x)=-x$의 극한은 모두 존재하고 $f(x)\ne g(x)$ $(x\ne0)$이다. 그러나
$$\frac{f(x)}{f(x)-g(x)}=-\frac1x$$
의 유한한 극한은 존재하지 않는다. 거짓이다.

`;
s=s.slice(0,a)+q9+s.slice(b);
s=s.replace(String.raw`$t<0$이면 중심의 $x$좌표 $1+2t$가 음수가 되어 제1사분면 조건에 어긋난다. 그러므로 $t>0$이고`,String.raw`$t<0$인 경우 $t=\frac4{1-\sqrt5}=-1-\sqrt5$이고 중심의 $x$좌표 $1+2t<0$이므로 제1사분면 조건에 어긋난다. 따라서 $t>0$이고`);
fs.writeFileSync(p,s,'utf8');
