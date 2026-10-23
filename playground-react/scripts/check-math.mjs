import { createRequire } from 'node:module';
const ts = createRequire(import.meta.url)('typescript');
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

async function loadTS(path){
  const file=new URL(path,import.meta.url);
  const compiled=ts.transpileModule(readFileSync(file,'utf8'),{fileName:file.pathname,compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  return import('data:text/javascript;charset=utf-8,'+encodeURIComponent(compiled));
}
const m=await loadTS('../src/labs/semis/geometry.ts');
const practice=await loadTS('../src/labs/practice/model.ts');
const basic=await loadTS('../src/labs/basic/math.ts');
const p={a:8,b:6,c:4,holeD:12};
const expected={arch:['14π','12π'],swirl:['16π','32π'],holes:['24π','18π'],chain:['18π','26π']};
for(const [shape,[per,area]] of Object.entries(expected)){
  const r=m.geometryMath(shape,p);
  assert.equal(m.pi(r.perimeter),per,shape+' 둘레');
  assert.equal(m.pi(r.area),area,shape+' 넓이');
  const termValue = r.terms.reduce((acc,t)=>acc+(t.sign==='+'?1:-1)*t.amount.numerator/t.amount.denominator,0);
  assert.ok(Math.abs(termValue-r.area.numerator/r.area.denominator)<1e-9,shape+' +/− 정합');
}
assert.equal(basic.basicFormula('basic-circumference',6,120).value,'12π cm');
assert.equal(basic.basicFormula('basic-circle-area',6,120).value,'36π cm²');
assert.equal(basic.basicFormula('basic-arc',6,120).value,'4π cm');
assert.equal(basic.basicFormula('basic-sector-perimeter',6,120).value,'4π + 12 cm');
assert.equal(basic.basicFormula('basic-sector-area',6,120).value,'12π cm²');
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
const snowman=m.geometryMath('holes3',{a:8,b:6,c:4,holeD:12});
assert.equal(snowman.perimeter.numerator,24,'세 작은 원의 둘레 합과 바깥 원 둘레');
assert.equal(snowman.area.numerator/snowman.area.denominator,24,'원 속 세 작은 원 넓이 합차');
assert.equal(snowman.inner.reduce((sum,d)=>sum+d,0),12,'세 작은 원 지름 합');
const check=(id,variant,p)=>practice.calculation(id,variant,p);
assert.equal(check('arc','arc-parallel',{r:6,theta:120}).boundary,'4π cm');
assert.equal(check('sector','sector-eighty',{r:6,theta:80}).area,'8π cm²');
assert.equal(check('sector','sector-eighty',{r:6,theta:80}).perimeter,'8π/3 + 12 cm','실전 부채꼴 둘레는 π 호 길이와 반지름 2개');
assert.equal(check('sector','sector-eighty',{r:6,theta:120}).perimeter,basic.basicFormula('basic-sector-perimeter',6,120).value,'기초/실전 동일 도형 둘레 일치');
assert.equal(check('boundary','boundary-ring',{R:8,r:4,theta:90}).perimeter,'6π + 8 cm','고리형 직선·안팎 원호');
assert.equal(check('boundary','boundary-ring',{R:8,r:4,theta:90}).area,'12π cm²','고리형 넓이 원주율 유지');
assert.equal(check('spinarea','spinarea-narrow',{r:3,w:3,theta:60}).perimeter,'3π + 6 cm','회전 띠 경계');
assert.equal(check('spinarea','spinarea-narrow',{r:3,w:3,theta:60}).area,'9π/2 cm²','회전 띠 정확한 분수');
assert.equal(check('overlap','overlap-lens',{r:6}).perimeter,'6π cm','두 90° 원호 경계');
assert.equal(check('overlap','overlap-lens',{r:6}).area,'18π − 36 cm²','사분원 둘에서 정사각형 빼기');
assert.ok(!check('overlap','overlap-lens',{r:6}).formula.includes('cos^{-1}'),'중1 교육과정 밖 일반 렌즈 역삼각함수 금지');
assert.equal(check('boundary','boundary-squarecut',{s:8}).perimeter,'24 + 4π cm');
assert.equal(check('boundary','boundary-squarecut',{s:8}).area,'64 − 8π cm²');
assert.equal(check('boundary','boundary-track',{s:8}).perimeter,'8π + 16 cm');
assert.equal(check('boundary','boundary-track',{s:8}).area,'16π + 64 cm²');
assert.equal(check('boundary','boundary-ring',{R:8,r:4,theta:90}).terms[0].value,'4π');
assert.equal(check('square','square-lens',{s:8}).terms[0].value,'32π cm²');
assert.equal(check('square','square-flower',{s:8}).area,'64 − 16π cm²');
assert.equal(check('square','square-inscribed',{s:8}).area,'64π − 128 cm²');
assert.equal(check('square','square-rect-quadrant',{s:8,a:5}).area,'16π cm²');
assert.equal(check('arc','arc-isosceles',{r:6,base:30}).boundary,'4π cm');
assert.equal(check('arc','arc-secant3',{r:6,secant:24}).boundary,'18 cm');
assert.equal(check('sector','sector-ratio-pie',{r:6}).area,'6π cm²');
assert.equal(check('spinarea','spinarea-narrow',{r:3,w:3,theta:60}).terms[0].value,'6π cm²');
assert.equal(check('rotate','rotate-square',{r:4,theta:90}).perimeter,'2π√2 cm');
assert.equal(check('rotate','rotate-triangle',{r:4,theta:120}).perimeter,'8π/3 cm');
assert.equal(check('rope','rope-triangle',{r:2}).perimeter,'12 + 4π cm');
assert.equal(check('rope','rope-four',{r:2,c:2,rows:2}).perimeter,'16 + 4π cm');
assert.equal(check('rope','rope-row',{r:2,c:3,rows:1}).perimeter,'16 + 4π cm');
assert.equal(check('rolling','rolling-square',{s:5,r:2,n:4}).area,'80 + 16π cm²');
assert.equal(check('overlap','overlap-nested',{R:6,r:3}).area,'27π cm²');
assert.equal(check('overlap','overlap-baby-circle',{R:6}).area,'27π cm²');
assert.equal(check('overlap','overlap-leaf',{a:6,b:8}).area,'24 cm²');
assert.equal(check('polygon','polygon-hex',{r:6,n:6}).area,'6π cm²');
assert.equal(check('polygon','polygon-pent',{r:6,n:5}).area,'36π/5 cm²');
assert.equal(check('tether','tether-corner',{R:7,w:5,h:4}).area,'40π m²');
assert.equal(check('tether','tether-wall',{R:6}).area,'18π m²');
assert.equal(check('pizza','pizza-original',{a:18,b:16,na:6,nb:8}).terms[2].value,'27/16 : 1');
assert.equal(check('equalarea','equalarea-hippocrates',{a:6,b:8}).area,'24 cm²');
assert.equal(check('equalarea','equalarea-common-part',{r:6}).area,'9π cm²');
const dynamic=[
  ['arc',[{r:3,theta:45,base:20,secant:15},{r:12,theta:300,base:70,secant:40}],['arc-parallel','arc-ratio','arc-isosceles','arc-secant3']],
  ['sector',[{r:4,theta:80},{r:9,theta:270}],['sector-eighty','sector-inverse','sector-ratio-pie']],
  ['boundary',[{s:4,R:6,r:2,theta:90},{s:12,R:12,r:8,theta:180}],['boundary-squarecut','boundary-ring','boundary-track']],
  ['square',[{s:4,a:3},{s:12,a:10}],['square-lens','square-flower','square-inscribed','square-rect-quadrant']],
  ['spinarea',[{r:2,w:1,theta:30},{r:7,w:6,theta:180}],['spinarea-narrow']],
  ['rotate',[{r:2,theta:30},{r:9,theta:180}],['rotate-square','rotate-triangle']],
  ['rope',[{r:1,c:2,rows:1},{r:5,c:4,rows:3}],['rope-triangle','rope-four','rope-row']],
  ['rolling',[{s:3,r:1,n:3},{s:10,r:5,n:6}],['rolling-square']],
  ['overlap',[{r:2,d:2,R:4,a:3,b:4},{r:8,d:12,R:10,a:10,b:10}],['overlap-lens','overlap-nested','overlap-baby-circle','overlap-leaf']],
  ['polygon',[{r:3,n:3},{r:10,n:8}],['polygon-hex','polygon-pent']],
  ['tether',[{R:5,w:2,h:2},{R:10,w:8,h:8}],['tether-corner','tether-wall']],
  ['pizza',[{a:10,b:10,na:4,nb:4},{a:24,b:10,na:12,nb:4}],['pizza-original','pizza-equal']],
  ['equalarea',[{a:3,b:4,r:3},{a:10,b:10,r:10}],['equalarea-hippocrates','equalarea-common-part']]
];
for(const [id,inputs,variants] of dynamic){
  for(const input of inputs)for(const variant of variants){
    const out=check(id,variant,input);
    assert.ok(out.formula.length>0,id+' formula '+variant);
    if(out.area)assert.ok(Number.isFinite(Number(out.area.match(/-?[\d.]+/)?.[0])),id+' area render '+variant);
    if(out.perimeter)assert.ok(out.perimeter.length>0,id+' perimeter render '+variant);
    count++;
  }
}
console.log('PASS · 반원 370 조합 + 기초 5 + 14 실전 원리 및 원본·확장 구조 '+(count-370)+' 입력 조합');
