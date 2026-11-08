# 22 매산고 고2 수학II Q18 로컬 입력 초안

원문 인용(정확, 문항):

```text
<단답형 3>
최고차항의 계수가 1인 사차함수 $f(x)$와 0이 아닌 실수 전체의 집합에서 정의된 함수 $g(x)$가 다음 조건을 만족시킨다.

(가) $f'(0)=f(0)=0$
(나) 함수 $f(x)$는 $x=2$에서 극댓값 16을 갖는다.
(다) 0이 아닌 모든 실수 $x$에 대하여 $f(x)=xg(x)+16$이다.

방정식 $g(x)=k$가 서로 다른 네 실근을 갖도록 하는 모든 정수 $k$의 합을 구하시오. [6.0점]
```

원문 인용(정확, 정답): `-10`

원문 인용(정확, 해설):

```text
$f(0)=f'(0)=0$이고 최고차항 계수가 $1$이므로 $f(x)=x^4+ax^3+bx^2$라고 둘 수 있습니다.
$x=2$에서 극댓값이 $16$이므로 $f(2)=16$, $f'(2)=0$입니다. $16+8a+4b=16$에서 $2a+b=0$, $32+12a+4b=0$에서 $a=-8,b=16$을 얻습니다.
따라서 $f(x)=x^2(x-4)^2$이고 $x\ne0$에서 $g(x)=(f(x)-16)/x=x^3-8x^2+16x-16/x$입니다.
$g'(x)=3x^2-16x+16+16/x^2$이고 $x^2g'(x)=(x-2)(3x^3-10x^2-4x-8)$입니다.
$x<0$에서는 $g'(x)>0$이므로 수평선 $y=k$와 한 번 만납니다. $x>0$에서는 $g$가 $-\infty$에서 증가하여 $g(2)=0$의 극댓값을 갖고, $(3,4)$에서 한 번 극소가 된 뒤 다시 증가합니다.
$g(4)=-4$이고 $g'(4)>0$이므로 그 극솟값은 $-4$보다 작습니다. 한편 $x\ge2$에서 $g(x)>-5$입니다. 실제로 $x\ge16/5$이면 $x^2(x-4)^2+5x-16\ge0$이고, $2\le x\le16/5$이면 $x(4-x)\ge64/25$이므로 $x^2(x-4)^2>6\ge16-5x$입니다.
따라서 극솟값은 $-5$와 $-4$ 사이입니다. $g(x)=k$가 음의 구간에서 한 번, 양의 구간에서 세 번 만나려면 정수 $k=-4,-3,-2,-1$이어야 합니다.
그 합은 $-4-3-2-1=-10$입니다.
```

표현 범위: 실제 rational-curve plan으로 원본 함수 전체를 복원하지 않는다. 현재 후보는 문제에서 묻는 네 정수 k만 discrete POINTS로 표시하며, 점 사이를 연속 해 집합으로 칠하지 않는다. 원문 조건에 있는 x≠0 정의역과 각 정수에서 음의 가지 한 교점·양의 가지 세 교점은 캡션에 명시한다. 기존 Q18 legacy SVG는 건드리지 않는다.

검증 상태: item/plan/publish JSON 파싱, sourcePath·ordinal 결속, source-exact 질문·정답·해설 인용 대조, 네 정수 합 정적 확인을 수행한다. number-line model/expand, renderer, browser/visual QA, 독립 전체 수학 검토, prepare/build, 공식 게시 및 인계는 NOT_RUN이다. 실제 유리함수 곡선 validation도 수행하지 않는다. LOCAL_ONLY, DRAFT_ONLY; READY가 아니다.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `expandNumberLineFigure`: PASS. 그래프용 fit/spec/semantic/좌표 observer는 이 number-line 입력 검사에서 NOT_RUN이며 적용하지 않은 단계의 성공을 주장하지 않는다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.

부분 표현 범위: 네 정수 k만 이산적으로 표시한다. x≠0인 g 전체 유리함수 곡선은 미표현이며 q18_four_intersections.svg를 보존했다.
