# 22 매산고 고2 수학II Q09 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 원격 변경·준비·빌드·handoff·게시·렌더는 하지 않았다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_매산고_2학기_기말_고2_수학II.js`, ordinal 9; exact source preparation-22-maesan-math2/source-exact.js (37,208 bytes), Git blob SHA-1 `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 기준 main은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`; metadata-only 후속 `653f9c9693664f791a4a6040f0d19b45f2b88621`이며 시각화 engine 내용은 `44ac8c11`에서 바뀌지 않은 것으로 전달받았다.

시각화 사유: 유용한 함수 그림은 개념 이해를 돕는다. 좌표는 임의의 위치가 아닌 해당 실제 곡선 점에 연결된 지시선으로 표시한다.

수학·범위 요약: 시각화는 원문 도함수를 적분해 얻는 연속 piecewise f와 극값을 보여 준다. 각 핵심 좌표는 실제 곡선 점에 붙인 지시선으로 연결하며 경계 x=±1에서 f′ 값을 정의하지 않는다.

입력 작성 근거: 실제 piecewise-polynomial 프레이밍은 연속 네 조각 이하, rational 계수의 degree≤4를 지원한다. 이 plan은 3개 조각의 ALL_REALS 함수이며 각 도함수 근에서 얻는 두 극솟점을 포함한다.



원문 인용(정확, 문항; questionBank[8].content):

```
9. 실수 전체의 집합에서 연속인 함수 $f(x)$의 도함수 $f'(x)$가

$$f'(x)=\begin{cases} x^3-4x & (|x|>1) \\ 2x+2 & (|x|<1) \end{cases}$$

이고, 함수 $y=f(x)$의 그래프가 점 $\left(0, \frac{9}{4}\right)$를 지날 때, 함수 $f(x)$의 모든 극솟값의 곱은? [4.4점]
```

원문 인용(정확, 정답): ①

원문 인용(정확, 해설):

```
극솟값을 찾으려면 도함수의 부호가 음수에서 양수로 바뀌는 지점을 확인합니다.
$|x|>1$에서는 $f'(x)=x(x-2)(x+2)$이므로 $x=-2,2$가 후보입니다. $|x|<1$에서는 $f'(x)=2x+2>0$입니다.
따라서 $x=-2$에서는 감소에서 증가로, $x=2$에서도 감소에서 증가로 바뀌므로 두 점에서 극소입니다. $x=1$에서는 증가에서 감소로 바뀌어 극대이므로 포함하지 않습니다.
$f(0)=9/4$에서 $f(-1)=9/4-\int_{-1}^{0}(2x+2)dx=9/4-1=5/4$입니다.
$\int_{-2}^{-1}(x^3-4x)dx=9/4$이므로 $f(-2)=5/4-9/4=-1$입니다.
또 $f(1)=9/4+\int_0^1(2x+2)dx=9/4+3=21/4$입니다.
$\int_1^2(x^3-4x)dx=-9/4$이므로 $f(2)=21/4-9/4=3$입니다.
모든 극솟값의 곱은 $(-1)\cdot3=-3$이므로 정답은 ①입니다. 다른 보기 $-4,-5,-6,-7$은 이 곱이 아닙니다.
```

검사 기록: JSON 파싱, item sourcePath/ordinal 바인딩, publish alt/caption 필드 검사 **PASS**. exact source 파일은 47,143 bytes이며 Git blob SHA-1은 위 기록과 일치한다.

actual graph-framing copy로 `fit_overview` 입력 검사를 수행했다. 최종 저장된 graphPlan에 대한 exact piecewise framing 결과 **PASS** (`PIECEWISE_POLYNOMIAL_OVERVIEW_v1`). 이는 수학 해설 독립검토, Node capability/spec 검사, engine semantic validation 또는 렌더 통과를 뜻하지 않는다.

미실행: Node capability dispatch/specFor, production semantic checks, exact-coordinate observer, engine.prepare, formal render/SVG/PNG, browser·visual review, independent full math review, production prepare/build/handoff, CI 및 publication. 모두 **NOT_RUN**이다. 해당 문항 전체 도해 완료를 주장하지 않는다.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `fit_overview`, `phase2.specFor`, `semantic_model.validate`, 실제 엔진의 critical 점 구성 분기, `viewport.for_spec`, 축 눈금 guard와 fitted/spec 눈금 대조: PASS.
`exact_coordinate` 검사 대상은 실제 COORDINATE_LABEL 객체 0개이며 모두 PASS이다. 대상이 0개인 경우 좌표 문구 전체의 독립 일치 검사를 뜻하지 않는다. named leader의 EQUATION_LABEL은 이 검사의 대상이 아니다. 엔진 prepare 내부의 해당 순수 분기만 사용했으며 `engine.prepare` 전체를 호출하지 않았다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.

메타데이터 정정: 위 초안의 37,208 bytes 표기는 잘못된 이전 메모이고 정확한 값은 47,143 bytes이다. `653f9c9693664f791a4a6040f0d19b45f2b88621`은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`의 부모인 PR1523 병합 커밋이며 metadata-only 후속 커밋이 아니다. 9970c2f6가 metadata 변경 후속 커밋이다. 이 구분은 원문·수학·엔진 내용 변경을 뜻하지 않는다.
