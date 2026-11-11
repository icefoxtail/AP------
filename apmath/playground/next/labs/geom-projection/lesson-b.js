/* Actual registered tetrahedron subtriangles, section N, and both target faces. */
(function (global) {
  'use strict';
  const T = String.raw;
  (global.APL_PROJECTION_LESSON_BUILDERS || (global.APL_PROJECTION_LESSON_BUILDERS = [])).push(({ add, concept, C, source }) => {
    for (const [packet, name, foot, whole, part, result] of [
      [0, 'GCD', T`G'CD'`, '36', '12', '4'],
      [2, 'GBC', T`G'BC`, '9', '3', ''],
      [3, 'GBD', T`G'BD'`, '9', '3', '']
    ]) {
      const v = source.first('mode5', packet).input;
      add('mode5', name + '넓이', '부분 삼각형 ' + name + '의 정사영', T`$S'=${result}\sqrt3$`, [
        C('원문 조건', T`한 모서리는 $${v.e}$이고
$G$는 $BCD$의 무게중심이에요.`, T`이번 도형은 $\triangle ${name}$이에요.
평면 $ABC$ 위로 정사영해요.`),
        C('부분 넓이', T`정삼각형 $BCD$의 넓이는
$\dfrac{\sqrt3}{4}\cdot${v.e}^2=${whole}\sqrt3$예요.`, T`무게중심은 넓이가 같은 세 조각을 만들어요.
$[${name}]=${whole}\sqrt3/3=${part}\sqrt3$예요.`, { stage: 1 }),
        C('정사영한 꼭짓점', T`$D$와 $G$에서 바닥에 내린 발을
각각 $D',G'$이라 해요.`, T`$B,C$는 바닥에 그대로 남아요.
정사영은 $\triangle ${foot}$이에요.`, { stage: 2 }),
        C('평면각의 코사인', T`$M$은 $BC$의 중점이에요.
같은 정삼각형의 높이라 $DM=AM$예요.`, T`$D'$는 $ABC$의 무게중심이에요.
$MD'=AM/3$이므로 $\cos\theta=1/3$이에요.`, { stage: 3 }),
        C('넓이 비 적용', T`부분 삼각형도 $BCD$ 위에 있어요.
같은 각의 코사인을 곱해요.`, T`$S'=[${name}]\cos\theta$이므로
$S'=${part}\sqrt3\cdot\dfrac13$이에요.`, { stage: 3 }),
        C('정사영 넓이', T`따라서 구하는 넓이는
$S'=${result}\sqrt3$예요.`, T`무게중심의 넓이 분할과 정사영은
서로 다른 두 단계예요.`, { stage: 3, show: ['angle'] })
      ], { packet });
    }
    concept('mode5', '무게중심', '면 안을 세 조각으로 나누기', T`$[GBC]=[GCD]=[GBD]=[BCD]/3$`, '무게중심으로 나눈 세 부분 삼각형의 넓이가 같은 까닭은 무엇일까요?', [
      C('같은 면 안의 분할', T`$G$를 $B,C,D$와 연결해요.
세 조각은 원래 면 안에 있어요.`, T`아직 바닥으로 정사영하지 않고
분홍색 면의 넓이만 살펴봐요.`, { stage: 1 }),
      C('중선의 분할비', T`$G$는 각 중선을 꼭짓점부터
$2:1$로 나누는 점이에요.`, T`$CD$까지의 높이도
$G$의 높이가 $B$의 높이의 $1/3$이에요.`, { stage: 1 }),
      C('공통 밑변', T`$GCD,BCD$의 밑변은 $CD$예요.
넓이 비는 높이 비와 같아요.`, T`따라서 $[GCD]=[BCD]/3$이에요.
다른 두 중선에도 같은 이유가 적용돼요.`, { stage: 1 }),
      C('세 부분의 합', T`세 조각은 서로 겹치지 않고
원래 삼각형을 모두 채워요.`, T`부분을 고르는 것과 평면을 기울이는 것은
구별해서 계산해야 해요.`, { stage: 1 }),
      C('분할의 결론', T`$[GBC]=[GCD]=[GBD]=[BCD]/3$예요.`, T`이 $1/3$은 무게중심의 성질이에요.
정사영의 비는 별도로 구해요.`, { stage: 1 })
    ], { set: { lprExplore: true } });
    concept('mode5', '평면투영비', '부분에도 같은 정사영 비', T`$S'=S/3$`, '같은 면 위의 부분 삼각형도 면 전체와 같은 비로 정사영될까요?', [
      C('평면 안의 도형', T`분홍 삼각형 $GCD$는
평면 $BCD$ 안에 놓여 있어요.`, T`전체 면과 부분 삼각형은
바닥에 대한 평면각이 같아요.`, { stage: 1 }),
      C('수선 단면', T`$M$은 $BC$의 중점이에요.
$DM,AM$은 $BC$에 수직이에요.`, T`$D'$는 밑면 무게중심이라 $MD'=AM/3$예요.
두 면의 높이는 $DM=AM$예요.`, { stage: 3 }),
      C('수직으로 내리기', T`각 점을 바닥으로 내려요.
바닥에 수직인 선 위로 움직여요.`, T`바닥에 닿은 파란 도형이 정사영이에요.
중간 도형과 구별해요.`, { stage: 1, move: { press: 100 } }),
      C('면적 관계', T`$\cos\theta=MD'/DM$이에요.
앞의 두 길이 관계를 대입해요.`, T`정사영의 넓이는 $S\cos\theta$예요.
부분 도형에도 같은 식이 적용돼요.`, { stage: 3 }),
      C('공통 비율', T`$\cos\theta=1/3$이므로 $S'=S/3$예요.
같은 면의 모든 조각에 적용돼요.`, T`누르는 도중의 넓이가 시간에 따라
일정하게 줄어든다는 뜻은 아니에요.`, { stage: 3, show: ['angle'] })
    ], { set: { lprExplore: true } });

    add('mode6', '단면코사인', '공통 밑변을 지나는 직각 단면', T`$\cos\theta=\dfrac{\sqrt6}{3}$`, [
      C('정육면체 조건', T`한 모서리는 $6$이고
$N$은 $CG$의 중점이어서 $CN=3$이에요.`, T`단면 $BDN$과 밑면의 예각에 대해
$\cos\theta$를 구해요.`),
      C('정사영의 밑변', T`$N$에서 밑면으로 내린 발은 $C$예요.
$B,D$는 그대로 남아요.`, T`정사영은 $BDC$예요.
두 삼각형은 밑변 $BD$를 공유해요.`, { stage: 2 }),
      C('각을 재는 수선', T`$BD$의 중점을 $P$라 해요.
$CP=6\sqrt2/2=3\sqrt2$예요.`, T`$CP\perp BD$이고 $CN$은 밑면에 수직이에요.
삼수선의 정리로 $NP\perp BD$예요.`, { stage: 3 }),
      C('직각삼각형 계산', T`따라서 $\theta=\angle NPC$예요.
직각삼각형 $NCP$를 봐요.`, T`$NP=\sqrt{CP^2+CN^2}$이므로
$NP=\sqrt{18+9}=3\sqrt3$예요.`, { stage: 3 }),
      C('코사인 약분', T`$\cos\theta=CP/NP$이므로
$\dfrac{3\sqrt2}{3\sqrt3}$을 정리해요.`, T`공통 밑변의 넓이 비로 구해도
$[BDC]/[BDN]=CP/NP$예요.`, { stage: 3 }),
      C('단면각의 결론', T`따라서 $\cos\theta=\dfrac{\sqrt6}{3}$예요.`, T`교선 $BD$에 수직인 두 선분으로
이면각을 읽어야 해요.`, { stage: 3, show: ['angle'] })
    ]);
    concept('mode6', '높이와각', '점 N을 올리며 단면각 비교', T`$\cos\theta=3\sqrt2/\sqrt{18+CN^2}$`, '모서리 CG 위에서 N을 올리면 단면과 밑면의 각은 어떻게 변할까요?', [
      C('바닥에서 출발', T`모서리 길이는 $6$이에요.
$N=C$이면 단면이 밑면에 놓여요.`, T`이때 $NP=CP$여서
두 평면 사이의 각은 $0^\circ$예요.`, { stage: 3 }),
      C('중점으로 올리기', T`$N$을 $CG$의 중점까지 올려요.
$CN:0\to3$으로 변해요.`, T`$CP=3\sqrt2$는 고정되고
빗변 $NP$만 길어져요.`, { stage: 3, move: { cn: 3 } }),
      C('높이와 빗변', T`직각삼각형 $NCP$에서
$NP=\sqrt{18+CN^2}$예요.`, T`높이가 커질수록 $NP$가 커져서
$CP/NP$는 작아져요.`, { stage: 3 }),
      C('위 꼭짓점까지', T`$N=G$가 되도록 $CN=6$까지 올려요.
$NP=\sqrt{54}=3\sqrt6$예요.`, T`이때 $CP/NP=1/\sqrt3$이에요.
중점일 때보다 단면각이 더 커요.`, { stage: 3, move: { cn: 6 } }),
      C('위치에 따른 관계', T`$\cos\theta=3\sqrt2/\sqrt{18+CN^2}$예요.
$0\le CN\le6$에서 사용할 수 있어요.`, T`$N$이 높아지면 코사인은 작아지고
단면과 밑면 사이의 각은 커져요.`, { stage: 3, show: ['angle'] })
    ], { start: { cn: 0 }, set: { lprExplore: true } });

    for (const packet of [0, 2]) {
      const v = source.first('mode7', packet).input, e = v.e, half = e / 2, n = e * e / 4;
      const X = v.face === 'ABC' ? 'C' : 'D';
      add('mode7', v.face + '넓이', '면 ' + v.face + '를 대칭면에 정사영', T`$S'=${n}\sqrt2$`, [
        C('원문과 대칭면', T`정사면체의 모서리는 $${e}$이고
$M$은 $CD$의 중점이에요.`, T`삼각형 $${v.face}$를
평면 $ABM$에 정사영해요.`),
        C('수직인 선분', T`정삼각형 $ACD,BCD$의 중선이라
$AM\perp CD$, $BM\perp CD$예요.`, T`$AM,BM$이 평면에서 만나므로
$CD\perp$(평면 $ABM$)이에요.`, { stage: 1 }),
        C('정사영한 삼각형', T`$${X}$의 수선의 발은 $M$이에요.
$A,B$는 그 평면에 있어요.`, T`정사영은 삼각형 $ABM$이에요.
이 도형의 넓이를 직접 구해요.`, { stage: 2 }),
        C('정사영의 높이', T`$AM=BM=${half}\sqrt3$이고 $AB=${e}$예요.
$AB$의 중점을 $K$라 해요.`, T`$KM=\sqrt{AM^2-AK^2}$이므로
$KM=\sqrt{${3 * half * half}-${half * half}}=${half}\sqrt2$예요.`, { stage: 3 }),
        C('넓이 계산', T`$ABM$은 밑변 $AB$에 대한
높이가 $KM$인 이등변삼각형이에요.`, T`$S'=\dfrac12\cdot${e}\cdot${half}\sqrt2$예요.
밑변과 높이를 곱해 절반을 취해요.`, { stage: 3 }),
        C('면의 정사영 넓이', T`따라서 구하는 넓이는
$S'=${n}\sqrt2$예요.`, T`중점 $M$을 지나는 대칭면이므로
수선의 발을 먼저 찾을 수 있었어요.`, { stage: 3 })
      ], { packet });
    }
    concept('mode7', '움직이는면', '정사영 평면을 움직이기', T`$\cos\theta:1\to\dfrac{\sqrt6}{3}\to\dfrac13$`, 'M을 C에서 D까지 움직일 때 면 ABC의 정사영은 어떻게 달라질까요?', [
      C('원래 면에서 시작', T`$M=C$이면 평면 $ABM$은
원래 면 $ABC$와 같아요.`, T`이때 두 도형이 겹치고
정사영 넓이도 원래 넓이와 같아요.`, { stage: 2 }),
      C('중점의 대칭면', T`$M$을 $CD$의 중점으로 옮겨요.
이때 $C\to M$으로 정사영돼요.`, T`$AB$의 중점을 $K$라 하면
$KM=3\sqrt2$, $KC=3\sqrt3$예요.`, { stage: 3, move: { mt: 50 } }),
      C('수선의 발 구별', T`중점을 벗어나면 수선의 발 $C'$는
일반적으로 $M$과 같지 않아요.`, T`$C'$는 평면 위에 있고
$CC'$는 평면에 수직이어야 해요.`, { stage: 2, move: { mt: 75 } }),
      C('이웃한 면까지', T`$M=D$가 되면 정사영 평면은
이웃한 면 $ABD$가 돼요.`, T`이웃한 면의 코사인은 $1/3$이에요.
중점 대칭면의 각과 달라요.`, { stage: 3, move: { mt: 100 } }),
      C('세 위치의 비교', T`코사인은 $1,\ \sqrt6/3,\ 1/3$로 변해요.
각각 $M=C$, 중점, $M=D$에 대응해요.`, T`원래 넓이는 고정돼 있으므로
정사영 넓이는 같은 비율로 줄어들어요.`, { stage: 3, show: ['angle'] })
    ], { start: { mt: 0 }, set: { lprExplore: true } });
    concept('mode7', '수직인면', '면이 선분으로 정사영되는 경우', T`$\operatorname{proj}_{ABM}(ACD)=AM,\quad S'=0$`, 'M이 CD의 중점일 때 면 ACD의 정사영이 삼각형이 아닌 이유는 무엇일까요?', [
      C('다른 면도 관찰', T`보라색 $ACD$를 봐요.
$M$은 중점에서 조금 벗어나 있어요.`, T`$A$는 투영 평면 위에 있지만
$C,D$의 수선의 발은 서로 달라요.`, { stage: 2 }),
      C('대칭 위치로 이동', T`$M$을 $CD$의 중점으로 옮겨요.
$C',D'$가 같은 점으로 모여요.`, T`정삼각형의 중선이므로
$CD\perp AM$, $CD\perp BM$이에요.`, { stage: 2, move: { mt: 50 } }),
      C('평면에 수직', T`$CD$는 평면 $ABM$에 수직이에요.
$C,D$는 한 수선 위에 있어요.`, T`두 점의 정사영은 모두 $M$이에요.
반면 $A$는 제자리에 남아요.`, { stage: 2 }),
      C('투영한 꼭짓점', T`삼각형의 세 꼭짓점은
$A\to A$, $C\to M$, $D\to M$으로 가요.`, T`넓이를 갖던 삼각형이
두 점을 잇는 선분으로 바뀌어요.`, { stage: 2 }),
      C('퇴화하는 정사영', T`정사영은 선분 $AM$이며 넓이는 $0$이에요.`, T`이때 $ACD$와 $ABM$은 수직이에요.
넓이 공식의 $\cos90^\circ=0$과도 맞아요.`, { stage: 2 })
    ], { start: { mt: 25 }, set: { lprExplore: true, acd: true } });
  });
})(window);
