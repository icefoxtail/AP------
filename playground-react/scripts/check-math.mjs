import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const file = new URL('../src/labs/semis/geometry.ts', import.meta.url);
const compiled = ts.transpileModule(readFileSync(file, 'utf8'), {
  fileName: 'geometry.ts', compilerOptions: {module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}
}).outputText;
const m = await import('data:text/javascript;charset=utf-8,'+encodeURIComponent(compiled));
const p={a:8,b:6,c:4,holeD:12};
const expected={arch:['14π','12π'],swirl:['14π','21π'],holes:['24π','18π'],chain:['18π','26π']};
for(const [shape,[per,area]] of Object.entries(expected)){
  const r=m.geometryMath(shape,p);
  assert.equal(m.pi(r.perimeter),per,shape+' 둘레');
  assert.equal(m.pi(r.area),area,shape+' 넓이');
  const termValue = r.terms.reduce((acc,t)=>acc+(t.sign==='+'?1:-1)*t.amount.numerator/t.amount.denominator,0);
  assert.ok(Math.abs(termValue-r.area.numerator/r.area.denominator)<1e-9,shape+' +/− 정합');
}
let count=0;
for(let a=2;a<=12;a++)for(let b=2;b<=12;b++)for(const shape of ['arch','swirl','chain']){
  const r=m.geometryMath(shape,{a,b,c:4,holeD:12});
  assert.equal(r.perimeter.numerator/r.perimeter.denominator,r.D,shape+' 경계 합');
  assert.equal(r.inner.reduce((sum,n)=>sum+n,0),r.D,shape+' 지름 합');
  assert.ok(r.area.numerator>0,shape+' 넓이 양수');
  const pieces=r.terms.reduce((sum,t)=>sum+(t.sign==='+'?1:-1)*t.amount.numerator/t.amount.denominator,0);
  assert.ok(Math.abs(pieces-r.area.numerator/r.area.denominator)<1e-9,shape+' 조각 합차');
  count++;
}
for(let holeD=8;holeD<=20;holeD+=2){
  const r=m.geometryMath('holes',{a:8,b:6,c:4,holeD});
  assert.equal(r.perimeter.numerator,holeD*2,'구멍 둘레');
  assert.equal(r.area.numerator/r.area.denominator,holeD*holeD/8,'구멍 넓이');
  count++;
}
console.log('PASS · 고정 4종 + 슬라이더 조합 '+count+'건 · 둘레/넓이/+− 정합');
