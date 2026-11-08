# 22 매산고 고2 수학II Q14 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 원격 변경·준비·빌드·handoff·게시·렌더는 하지 않았다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_매산고_2학기_기말_고2_수학II.js`, ordinal 14; exact source preparation-22-maesan-math2/source-exact.js (37,208 bytes), Git blob SHA-1 `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 기준 main은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`; metadata-only 후속 `653f9c9693664f791a4a6040f0d19b45f2b88621`이며 시각화 engine 내용은 `44ac8c11`에서 바뀌지 않은 것으로 전달받았다.

시각화 사유: 유용한 함수 그림은 개념 이해를 돕는다. 좌표는 임의의 위치가 아닌 해당 실제 곡선 점에 연결된 지시선으로 표시한다.

수학·범위 요약: 시각화는 정확한 원래 cubic f와 [-1,0]의 넓이 5/2만 보여 준다. 역함수 곡선 f⁻¹은 그리지 않으며 역함수 넓이 관계를 캡션에 적는다.

입력 작성 근거: This uses the supported rational cubic as the original f on ALL_REALS and an exact region against the x-axis. It does not claim to graph the inverse.

기존 원본 해설 SVG q12_encounter_tangencies.svg와 q18_four_intersections.svg는 보존하며 수정하지 않았다.

원문 인용(정확, 문항; questionBank[13].content):

```
14. 삼차함수 $f(x)=-4x^3+ax^2-x$의 역함수가 존재하도록 하는 정수 $a$의 최댓값을 $M$이라 하자. $a=M$일 때, 함수 $g(x)$를

$$g(x)=\begin{cases} f(x) & (x < 0) \\ f^{-1}(x) & (x \ge 0) \end{cases}$$

이라 하자. 다음에서 옳은 것만을 있는 대로 고른 것은? [4.9점]

ㄱ. $M = 3$
ㄴ. $\int_{0}^{8} |g(x)|dx = \frac{13}{2}$
ㄷ. $\int_{-1}^{9} g(x)dx < -4$
```

원문 인용(정확, 정답): ④

원문 인용(정확, 해설):

```
ㄱ. $f'(x)=-12x^2+2ax-1$입니다. 삼차함수 $f$의 역함수가 존재하려면 $f$가 일대일이어야 하므로 이 도함수가 양수가 되는 구간이 없어야 합니다. 판별식 $(2a)^2-4(-12)(-1)=4a^2-48\le0$에서 $|a|\le2\sqrt3$이고 정수의 최댓값은 $M=3$입니다. 따라서 ㄱ은 참입니다.
ㄴ. $a=3$일 때 $f(x)=-4x^3+3x^2-x$, $f(-1)=8$, $f(0)=0$이며 역함수는 감소합니다. $y\in[0,8]$이면 $f^{-1}(y)\le0$이므로 $\int_0^8|g(y)|dy=-\int_0^8f^{-1}(y)dy$입니다.
역함수 적분의 넓이 관계에서 $\int_0^8f^{-1}(y)dy=8(-1)-\int_0^{-1}f(x)dx=-8+\int_{-1}^0f(x)dx$입니다. $\int_{-1}^0f(x)dx=[-x^4+x^3-x^2/2]_{-1}^0=5/2$이므로 $\int_0^8|g|=11/2\ne13/2$입니다. ㄴ은 거짓입니다.
ㄷ. $\int_{-1}^9g(x)dx=\int_{-1}^0f(x)dx+\int_0^8f^{-1}(x)dx+\int_8^9f^{-1}(x)dx=5/2-11/2+\int_8^9f^{-1}(x)dx$입니다.
$f$가 감소하고 $f(-1)=8$이므로 $x>8$이면 $f^{-1}(x)<-1$입니다. 따라서 마지막 적분은 $-1$보다 작아 전체 값은 $-4$보다 작습니다. ㄷ은 참입니다.
옳은 것은 ㄱ, ㄷ이므로 정답은 ④입니다.
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

부분 표현 범위: 원래 f와 [−1,0] 넓이 5/2만 표현한다. 역함수 곡선 및 전체 g는 미표현이다. 역함수 넓이 11/2 관계는 문구로만 남겼다.
