const L=require('./lib.js');
const venn=(sets,elements,shade,extra)=>({capability:'set-diagram-figure-v1',diagram:Object.assign({kind:'VENN',sets,elements,shade},extra||{})});
const out=[];
// ---- 복성고 2mid q13 : 세 후보 a=3, 2, -2
{
 const ex='original/high/h1/2mid/19_복성고_2학기_중간_고1_기출';
 const A='A',B='B';
 const sets=[{id:'A'},{id:'B'}];
 const sh='(A-B)∪(B-A)';
 const p=composite3();
 function composite3(){return L.composite([
  ['a=3: 대칭차 {1, 7}',venn(sets,[{text:'7',in:['A']},{text:'2',in:['A','B']},{text:'3',in:['A','B']},{text:'1',in:['B']}],sh)],
  ['a=2: 대칭차 {0, 1}',venn(sets,[{text:'1',in:['A']},{text:'2',in:['A','B']},{text:'3',in:['A','B']},{text:'0',in:['B']}],sh)],
  ['a=-2: 대칭차 {-4, -3}',venn(sets,[{text:'-3',in:['A']},{text:'2',in:['A','B']},{text:'3',in:['A','B']},{text:'-4',in:['B']}],sh)],
 ],'대칭차(색칠)가 {0,1}이면 B의 원소 2는 A에도 있어야 하므로 a-1=2 또는 a²-2=2에서 a=3, 2, -2를 얻는다. a=3이면 A={2,3,7}, B={1,2,3}으로 대칭차가 {1,7}, a=-2이면 A={-3,2,3}, B={-4,2,3}으로 {-4,-3}이라 조건에 맞지 않고, a=2이면 A={1,2,3}, B={0,2,3}으로 대칭차가 {0,1}이 되어 성립한다. 따라서 b=1+2+3=6, ab=12 (정답 ③).',
  L.src(ex,13,'a의 세 후보 3, 2, -2를 원문 식에 대입해 A,B의 원소와 대칭차(색칠)를 한 장에서 비교한다.'));}
 out.push([ex+'/q13-solution.json',p]);
}
// ---- 제일고 20 2mid q5 : 최댓값/최솟값 두 배치
{
 const ex='original/high/h1/2mid/20_제일고_2학기_중간_고1_기출';
 const U={name:'U',count:'34',countUnit:'명'};
 const mk=(el,sub)=>venn([{id:'R',name:'R'},{id:'Y',name:'Y'}],el,'R∩Y',sub?{subset:['Y','R']}:{});
 const p=L.composite([
  ['최대: 둘 다 15명',mk([{text:'7명',in:['R']},{text:'15명',in:['R','Y']},{text:'12명',in:[]}],true)],
  ['최소: 둘 다 3명',mk([{text:'19명',in:['R']},{text:'3명',in:['R','Y']},{text:'12명',in:['Y']}],false)],
 ],'R는 빨강, Y는 노랑을 좋아하는 학생의 집합이다. 둘 다 좋아하는 학생 수 x는 Y의 15명을 넘을 수 없어 x≤15이고, 이때 Y⊂R로 빨강만 7명, 둘 다 아닌 학생 12명이다. 또 22+15-x≤34에서 x≥3이고, 이때는 모든 학생이 적어도 한 색을 좋아하여 빨강만 19명, 노랑만 12명이다. 따라서 최댓값 15, 최솟값 3이고 그 차는 12이다 (정답 ④).',
  L.src(ex,5,'두 경계 상황(최대 15명, 최소 3명)을 벤다이어그램 두 장으로 비교한다.'));
 out.push([ex+'/q5-solution.json',p]);
}
// ---- 제일고 21 2mid q10 : 한 장 벤 (P⊃Q)
{
 const ex='original/high/h1/2mid/21_제일고_2학기_중간_고1_기출';
 const p={capability:'set-diagram-figure-v1',diagram:{kind:'VENN',sets:[{id:'P'},{id:'Q'}],subset:['Q','P'],shade:'Q'},
  caption:'문제 그림에서 Pᶜ과 Q는 R 안에 있고 서로 겹치지 않으므로 Pᶜ∩Q=∅이다. 따라서 Q의 원소는 모두 P에 속하여 Q⊂P이고, q이면 p이므로 q→p가 성립한다. 즉 q는 p이기 위한 충분조건이다 (정답 ①).',
  sourceConditions:L.src(ex,10,'Pᶜ∩Q=∅ 에서 Q⊂P를 한 장의 포함관계 벤으로 보인다(R은 이 단계에 필요 없어 생략).'),
  newVisualInformation:['Pᶜ∩Q=∅ ⇒ Q⊂P ⇒ q→p, q는 p의 충분조건']};
 out.push([ex+'/q10-solution.json',p]);
}
for(const [rel,p] of out){console.log(L.write(rel,p).slice(-60));}
