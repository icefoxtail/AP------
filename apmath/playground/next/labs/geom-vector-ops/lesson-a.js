/* Original vector addition/subtraction targets and their distinct concepts. */
(function(g){
 'use strict';const R=String.raw;
 (g.APL_VO_LESSON_BUILDERS||(g.APL_VO_LESSON_BUILDERS=[])).push(({add,concept,C,P})=>{
  const L=(id,label,title,answer,lines,o={})=>{
   const names=['조건 확인','보조점과 전략','벡터 관계','계산과 확인','결론'];
   const chapters=lines.map((line,i)=>{const a=line.split('||'),c=C(names[i],P(a[0]),a[1]||'그림의 점과 화살표에서 이 관계를 확인해요.');c.cues[0].step=(o.stages||[0,1,2,2,3])[i];if(o.moves?.[i])c.cues.splice(1,0,{at:.2,to:o.moves[i],dur:4});if(o.sets?.[i])c.cues[0].set=o.sets[i];return c;});
   if(o.question)concept(id,label,title,answer,o.question,chapters,o);else add(id,label,title,answer,chapters,o);
  };
  L('1-A','합의크기','중점으로 합벡터의 크기 구하기',R`$|OA+OB|=6\sqrt2$`,[
   R`$A(4,2)$, $B(2,4)$가 주어졌어요.||원점에서 두 점으로 향하는 벡터를 더해요.`,
   R`$AB$의 중점 $M=(3,3)$을 잡아요.||중점에서는 두 꼭짓점을 향한 벡터가 상쇄돼요.`,
   R`$\overrightarrow{OA}+\overrightarrow{OB}=2\overrightarrow{OM}$이에요.||옮긴 분홍 벡터의 끝과 원점을 이으면 합벡터예요.`,
   R`$OM^2=3^2+3^2=18$이에요.||합벡터의 길이는 중점까지 거리의 두 배예요.`,
   R`따라서 $|OA+OB|=6\sqrt2$예요.||벡터의 크기를 각각 더한 값과 구별하세요.`
  ],{start:{slideT:0},moves:{2:{slideT:1}}});
  L('1-A','중점거리','합벡터와 중점까지의 거리',R`$OM=3\sqrt2$`,[
   R`$M$은 $A(4,2)$, $B(2,4)$의 중점이에요.||원점에서 중점까지의 거리를 구해요.`,
   R`중점 좌표는 $M=(3,3)$이에요.||두 좌표를 각각 평균내요.`,
   R`$\overrightarrow{OM}=\tfrac12(\overrightarrow{OA}+\overrightarrow{OB})$예요.||대각선이 서로를 이등분하는 그림과 같아요.`,
   R`$OM^2=3^2+3^2=18$이에요.||길이는 양수이므로 양의 제곱근을 취해요.`,
   R`따라서 $OM=3\sqrt2$예요.||합벡터의 크기는 이 길이의 두 배예요.`
  ]);
  L('1-A','삼각형법','벡터를 옮겨도 변하지 않는 합','방향과 크기를 유지해 종점에 이어 붙여요',[
   R`파란 벡터는 $\overrightarrow{OA}$, 분홍 벡터는 $\overrightarrow{OB}$예요.||두 벡터의 시점이 같아요.`,
   R`분홍 벡터의 시점을 $O$에서 $A$로 옮겨요.||회전하거나 길이를 바꾸지 않아요.`,
   R`옮긴 벡터의 종점을 $S$라 하면 $\overrightarrow{AS}=\overrightarrow{OB}$예요.||같은 벡터를 다른 자리에서 그린 것이에요.`,
   R`$O\to A\to S$를 이어 가는 이동이 두 이동의 합이에요.||합은 첫 시점에서 마지막 종점으로 읽어요.`,
   '방향과 크기를 유지해 종점에 이어 붙여요.||따라서 합벡터는 OS예요.'
  ],{question:'원래 두 위치벡터를 삼각형법으로 합성해 보세요.',start:{slideT:0},stages:[0,2,2,2,3],moves:{1:{slideT:1}}});
  L('1-A','대각선중점','중점벡터가 합의 절반인 이유',R`$\overrightarrow{OS}=2\overrightarrow{OM}$`,[
   '두 벡터로 평행사변형 OASB를 만들어요.||대각선은 OS와 AB예요.',
   R`$M$은 $AB$의 중점이에요.||양쪽 같은 길이 눈금을 확인해요.`,
   '평행사변형의 두 대각선은 서로를 이등분해요.||따라서 M은 OS의 중점이기도 해요.',
   'O, M, S가 같은 직선 위에 있고 방향도 같아요.||OM과 MS의 길이가 같아요.',
   R`따라서 $\overrightarrow{OS}=2\overrightarrow{OM}$이에요.||두 벡터의 합을 중점으로 읽었어요.`
  ],{question:'원래 평행사변형에서 합벡터와 중점벡터의 관계를 설명하세요.'});
  L('1-B','세벡터합','외심에서 본 무게중심과 수심',R`$\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}=\overrightarrow{OH}=3\overrightarrow{OG}$`,[
   'O는 외심, G는 무게중심, H는 세 수선의 교점이에요.||외심에서 세 꼭짓점까지의 거리가 같아요.',
   R`$M$을 $AB$의 중점으로 잡으면 $OA+OB=2OM$이에요.||현의 중점을 향하는 방향은 현에 수직이에요.`,
   R`$\overrightarrow{OH}=\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}$로 점 $H$를 잡아요.||그러면 CH는 두 벡터 OA, OB의 합이에요.`,
   R`$CH\perp AB$이고 다른 두 꼭짓점에서도 같아요.||한편 G의 위치벡터는 세 꼭짓점 위치벡터의 평균이에요.`,
   R`따라서 $\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}=\overrightarrow{OH}=3\overrightarrow{OG}$예요.||정삼각형에서는 세 중심이 O와 일치해도 식은 성립해요.`
  ]);
  L('1-B','현의수선','같은 반지름에서 나오는 수직',R`$(\overrightarrow{OA}+\overrightarrow{OB})\cdot\overrightarrow{AB}=0$`,[
   R`외심에서 $OA=OB$예요.||두 위치벡터의 길이가 같다는 조건을 써요.`,
   R`$\overrightarrow{AB}=\overrightarrow{OB}-\overrightarrow{OA}$예요.||벡터의 시점을 같게 놓고 차를 읽어요.`,
   R`$(a+b)\cdot(b-a)=|b|^2-|a|^2$예요.||서로 반대 부호인 교차항이 소거돼요.`,
   '두 반지름의 제곱이 같아요.||합벡터가 영벡터인 경우도 내적식에는 포함돼요.',
   R`따라서 $(\overrightarrow{OA}+\overrightarrow{OB})\cdot\overrightarrow{AB}=0$이에요.||합벡터가 0이 아니면 현에 수직인 방향을 나타내요.`
  ],{question:'외심에서 두 반지름을 더한 벡터와 현 AB의 내적을 확인하세요.',start:{a1:0,a2:120,a3:230}});
  L('1-B','무게중심','위치벡터의 평균과 무게중심',R`$\overrightarrow{OG}=\tfrac13(\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC})$`,[
   '삼각형의 한 중선 CM을 보아요.||M은 AB의 중점이에요.',
   R`$\overrightarrow{OM}=\tfrac12(\overrightarrow{OA}+\overrightarrow{OB})$예요.||두 꼭짓점의 평균이 중점이에요.`,
   R`$CG:GM=2:1$이에요.||G는 중선에서 꼭짓점 쪽 두 부분을 차지해요.`,
   R`$\overrightarrow{OG}=\tfrac13\overrightarrow{OC}+\tfrac23\overrightarrow{OM}$이에요.||중점의 표현을 대입해요.`,
   R`따라서 $\overrightarrow{OG}=\tfrac13(\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC})$예요.||외심을 시점으로 잡으면 수심 관계와 연결돼요.`
  ],{question:'원래 삼각형에서 무게중심의 위치벡터가 세 위치벡터의 평균인 이유를 설명하세요.',start:{a1:0,a2:120,a3:230}});
  L('1-B','지름인경우','지름을 한 변으로 둔 삼각형',R`$H=C$`,[
   '원래 직각삼각형 프리셋을 보아요.||AB가 원의 지름이에요.',
   R`$\overrightarrow{OA}+\overrightarrow{OB}=\vec0$이에요.||두 반지름의 크기가 같고 방향이 반대예요.`,
   R`$\overrightarrow{OH}=\overrightarrow{OA}+\overrightarrow{OB}+\overrightarrow{OC}$를 써요.||첫 두 항이 상쇄돼요.`,
   R`$\angle ACB=90^\circ$이므로 두 변 자체가 수선이에요.||다른 수선도 꼭짓점 C를 지나야 해요.`,
   R`따라서 $H=C$예요.||중점 O에서 길이 0인 선분에 각도를 붙이지 않아요.`
  ],{question:'AB가 지름인 원래 프리셋에서 수심의 위치를 구하세요.',start:{a1:0,a2:180,a3:108}});
  L('2-A','차의크기','차벡터를 한 변으로 읽기',R`$|OB-OA|=4$`,[
   '한 변이 4인 정삼각형 OAB예요.||두 위치벡터의 차의 크기를 구해요.',
   R`$\overrightarrow{OB}-\overrightarrow{OA}=\overrightarrow{AB}$예요.||차는 A에서 B로 가는 이동이에요.`,
   'OB에서 OA를 빼는 순서를 유지해요.||반대 순서는 BA예요.',
   'AB는 정삼각형의 한 변이에요.||복잡한 성분 전개 없이 길이를 읽을 수 있어요.',
   R`따라서 $|OB-OA|=4$예요.||방향이 바뀌어도 크기는 같아요.`
  ]);
  L('2-A','합의크기','정삼각형의 중선과 합벡터',R`$|OA+OB|=4\sqrt3$`,[
   R`$OA=OB=AB=4$예요.||이번에는 합벡터의 크기를 구해요.`,
   R`$M$은 $AB$의 중점이므로 $AM=2$예요.||이등변삼각형의 중선은 높이이기도 해요.`,
   R`$OM\perp AB$, $OM^2=4^2-2^2$예요.||직각삼각형 OAM을 사용해요.`,
   R`$OM^2=12$이고 $OA+OB=2OM$이에요.||합벡터는 중선 방향으로 그 두 배 길이예요.`,
   R`따라서 $|OA+OB|=4\sqrt3$예요.||두 벡터의 길이를 그냥 더한 8과 달라요.`
  ],{stages:[0,3,3,3,3]});
  L('2-A','시점맞추기','종점끼리의 이동으로 차 구하기',R`$\overrightarrow{OB}-\overrightarrow{OA}=\overrightarrow{AB}$`,[
   '두 벡터를 같은 시점 O에서 그려요.||시점이 다르면 먼저 평행이동해요.',
   R`$\overrightarrow{OA}+\overrightarrow{AB}=\overrightarrow{OB}$예요.||O에서 A를 거쳐 B로 가는 경로예요.`,
   '양변에서 OA를 빼요.||벡터 등식에서도 같은 항을 양변에 적용해요.',
   '빼는 벡터의 종점 A가 출발점이에요.||남는 벡터의 종점 B가 도착점이에요.',
   R`따라서 $\overrightarrow{OB}-\overrightarrow{OA}=\overrightarrow{AB}$예요.||화살표의 순서를 확인하세요.`
  ],{question:'원래 두 벡터의 차를 종점끼리의 이동으로 설명하세요.'});
  L('2-A','역벡터','빼기를 역벡터의 덧셈으로',R`$b-a=b+(-a)$`,[
   'a와 크기가 같고 방향이 반대인 벡터를 잡아요.||이 벡터가 −a예요.',
   R`$a+(-a)=\vec0$이에요.||갔다가 같은 길이를 되돌아오는 이동이에요.`,
   'b의 종점에 −a를 이어 붙여요.||역벡터도 평행이동할 수 있어요.',
   '합성한 화살표를 A에서 B로 가는 화살표와 비교해요.||크기와 방향이 일치해요.',
   R`따라서 $b-a=b+(-a)$예요.||빼기는 역벡터를 더하는 연산이에요.`
  ],{question:'원래 차벡터를 역벡터의 합으로 나타내세요.'});
  L('2-B','원의자취','합과 차의 크기가 같은 점', '자취는 선분 AB를 지름으로 하는 원이에요',[
   R`$|PA+PB|=|PA-PB|$를 만족하는 $P$를 찾아요.||A와 B는 서로 다른 고정점이에요.`,
   'AB의 중점 M을 잡아요.||MA와 MB가 상쇄되도록 시점을 바꾸려는 선택이에요.',
   R`$PA+PB=2PM$, $PA-PB=BA$예요.||차벡터의 크기는 움직이는 P와 관계없어요.`,
   R`$2PM=AB$이므로 $PM=AB/2$예요.||중점에서 일정한 거리에 있는 모든 점을 모아요.`,
   '자취는 선분 AB를 지름으로 하는 원이에요.||양 끝점도 벡터식은 만족해요.'
  ]);
  L('2-B','끝점포함','지름의 양 끝점도 자취일까','끝점은 포함되지만 그때 각은 정의되지 않아요',[
   '원래 프리셋에서 P를 B로 옮겨요.||PB가 영벡터가 돼요.',
   R`$PA+PB=BA+\vec0$이에요.||합의 크기는 BA의 길이예요.`,
   R`$PA-PB=BA-\vec0$이에요.||차의 크기도 같은 길이예요.`,
   '따라서 원래 등식은 성립해요.||하지만 길이 0인 PB와 이루는 각은 정할 수 없어요.',
   '끝점은 포함되지만 그때 각은 정의되지 않아요.||각도 설명만으로 끝점을 제외하지 마세요.'
  ],{question:'원래 끝점 프리셋 P=B가 자취에 포함되는지 확인하세요.',start:{th2b:0}});
  L('2-B','중점상쇄','중점을 지나 합벡터 분해하기',R`$\overrightarrow{PA}+\overrightarrow{PB}=2\overrightarrow{PM}$`,[
   '두 벡터의 시점 P가 움직여요.||고정점 A, B의 중점은 움직이지 않아요.',
   R`$PA=PM+MA$, $PB=PM+MB$예요.||두 이동 모두 중점 M을 거쳐 가요.`,
   R`$MA+MB=\vec0$이에요.||길이가 같고 방향이 반대이기 때문이에요.`,
   '두 식을 더하면 PM 두 개만 남아요.||점 P의 위치에 관계없이 성립해요.',
   R`따라서 $\overrightarrow{PA}+\overrightarrow{PB}=2\overrightarrow{PM}$예요.||이 관계를 거리 조건에 대입해요.`
  ],{question:'원래 자취 풀이에서 중점을 선택한 이유를 설명하세요.'});
  L('2-B','두점일치','두 고정점이 겹치는 경계','A와 B가 겹치면 자취는 그 한 점이에요',[
   '탐구에서 A와 B를 같은 점으로 옮겨요.||지름의 길이가 0이 돼요.',
   R`$PA-PB=\vec0$이에요.||두 벡터가 같아 차가 사라져요.`,
   R`$PA+PB=2PA$예요.||원래 등식은 이 벡터의 크기가 0이라는 조건이에요.`,
   R`$PA=0$이 되려면 $P=A$여야 해요.||반지름 0인 원의 퇴화 상태로도 읽을 수 있어요.`,
   'A와 B가 겹치면 자취는 그 한 점이에요.||지름이 양수인 원과 구별해요.'
  ],{question:'원래 탐구에서 A=B가 되면 자취는 어떻게 바뀔까요?',start:{Ax:1,Ay:1,Bx:1,By:1}});
  const regions=[
   ['직선자취','계수 합이 정하는 평행한 직선','직선 AB와 평행한 직선이에요','line',R`$\alpha+\beta=k$`,R`$OP=kOA+\beta AB$`,R`$\beta$가 모든 실수를 움직여요.`],
   ['삼각형영역','음이 아닌 두 계수와 삼각형','삼각형 OAB의 안과 둘레예요','triangle',R`$\alpha,\beta\ge0,\ \alpha+\beta\le1$`,R`$OP=\alpha OA+\beta OB+(1-\alpha-\beta)\vec0$`,R`세 가중치가 음이 아니고 합은 $1$이에요.`],
   ['평행사변형','독립된 두 계수의 범위','평행사변형 OASB의 안과 둘레예요','square',R`$0\le\alpha,\beta\le1$`,R`$S=A+B$`,R`두 계수는 서로 독립적으로 $0$부터 $1$까지 움직여요.`]
  ];
  for(const [label,title,answer,region,condition,relation,why] of regions)L('2-C',label,title,answer,[
   R`$OP=\alpha OA+\beta OB$에서 ${condition}예요.||원래 두 벡터는 서로 평행하지 않아요.`,
   '한 계수를 고정하고 다른 계수만 움직여 보아요.||계수의 변화는 해당 벡터 방향의 이동이에요.',
   relation+'예요.||'+why,
   region==='line'?'kA를 지나 AB 방향으로 양쪽 끝없이 이어져요.||음의 계수도 허용된다는 점을 확인해요.':region==='triangle'?'세 꼭짓점 O, A, B에 경계가 걸려요.||계수 합이 1인 경계는 AB예요.':'네 모서리에서 두 계수는 각각 0 또는 1이에요.||두 방향의 선분을 조합한 영역이에요.',
   answer+'||계수의 범위가 바뀌면 자취도 바뀌어요.'
  ],{set:{region},moves:{2:{la:.2,lb:region==='line'?.8:.5},3:{la:.8,lb:region==='triangle'?.15:region==='line'?.2:.8}}});
  L('2-C','선분길이','계수의 합과 음이 아닌 조건',R`$A'B'=10$`,[
   R`$A=(3,0)$, $B=(0,4)$, $\alpha+\beta=2$예요.||두 계수는 음이 아니에요.`,
   R`$\alpha=2s$, $\beta=2(1-s)$로 두어요.||조건 때문에 s는 0과 1 사이예요.`,
   R`$P$는 $2A$와 $2B$를 잇는 선분 위에 있어요.||계수의 음수 범위가 없어 직선 전체가 아니에요.`,
   R`$AB=\sqrt{3^2+4^2}=5$예요.||끝점의 위치벡터가 두 배이므로 선분 길이도 두 배예요.`,
   R`따라서 $A'B'=10$이에요.||원래 등록된 선분 유형의 길이를 구했어요.`
  ],{index:1});
  L('2-C','삼각형넓이','벡터 성분과 삼각형 영역',R`$S=12$`,[
   R`$A=(6,0)$, $B=(2,4)$예요.||두 계수는 음이 아니고 합은 1 이하예요.`,
   '움직이는 점의 영역은 삼각형 OAB예요.||계수 합이 1이면 AB 경계에 있어요.',
   R`$OA=6$이고 $B$에서 $x$축까지 높이는 $4$예요.||빗변 OB를 높이로 쓰지 않아요.`,
   R`$S=\tfrac12\times6\times4$예요.||밑변과 수직 높이를 곱해요.`,
   R`따라서 $S=12$예요.||성분식으로는 행렬식의 절댓값의 절반이에요.`
  ],{index:2});
  L('2-C','평행넓이','두 벡터가 만드는 평행사변형',R`$S=11$`,[
   R`$A=(4,1)$, $B=(1,3)$예요.||두 계수는 각각 0 이상 1 이하예요.`,
   '영역의 네 꼭짓점은 O, A, A+B, B예요.||한 변을 다른 벡터만큼 평행이동해요.',
   R`평행사변형의 넓이는 $|x_Ay_B-y_Ax_B|$예요.||두 삼각형을 합친 넓이와 같아요.`,
   R`$S=|4\times3-1\times1|$이에요.||방향이 뒤집혀도 넓이는 음수가 되지 않아요.`,
   R`따라서 $S=11$예요.||삼각형 영역의 넓이와 두 배 차이를 확인해요.`
  ],{index:3});
  L('2-C','음수계수','계수의 부호가 바꾸는 위치','음수 계수는 반대 방향의 이동이에요',[
   R`$\alpha+\beta=1$인 직선 자취를 보아요.||계수에 음수도 허용해요.`,
   R`$\alpha=-1$, $\beta=2$로 옮겨요.||OA 방향 이동은 한 번 뒤로 가요.`,
   R`$OP=-OA+2OB$예요.||합의 종점이 선분 AB 밖으로 나가요.`,
   '직선 자취와 선분 자취의 차이를 보아요.||계수 합이 같아도 부호 제한에 따라 범위가 달라요.',
   '음수 계수는 반대 방향의 이동이에요.||음이 아닌 계수라는 조건을 놓치지 마세요.'
  ],{question:'원래 직선 탐구에서 한 계수가 음수가 되면 점은 어디로 갈까요?',set:{region:'line',seg:false},moves:{1:{la:-1,lb:2}}});
  L('2-C','일직선경계','두 기준 벡터가 평행한 경우','평행한 두 벡터로 만든 영역의 넓이는 0이에요',[
   R`$OA=(4,0)$, $OB=(2,0)$으로 두어요.||원래 탐구에서 두 점을 같은 축 위에 놓은 경우예요.`,
   '두 계수를 바꾸어도 이동은 x축 방향뿐이에요.||새로운 두 번째 방향이 생기지 않아요.',
   R`$x_Ay_B-y_Ax_B=0$이에요.||넓이 공식의 행렬식이 사라져요.`,
   '평행사변형이나 삼각형이 선분으로 납작해져요.||이 예에서는 점들이 모두 같은 직선 위에 있어요.',
   '평행한 두 벡터로 만든 영역의 넓이는 0이에요.||영역의 넓이를 논할 때 두 방향의 독립성을 확인해요.'
  ],{question:'원래 평행사변형 탐구에서 두 벡터가 평행해지는 경계를 확인하세요.',start:{Ax:4,Ay:0,Bx:2,By:0},set:{region:'square'}});
 });
})(window);
