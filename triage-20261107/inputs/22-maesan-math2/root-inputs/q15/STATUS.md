# 22 매산고 고2 수학II Q15 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 원격 변경·준비·빌드·handoff·게시·렌더는 하지 않았다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_매산고_2학기_기말_고2_수학II.js`, ordinal 15; exact source preparation-22-maesan-math2/source-exact.js (37,208 bytes), Git blob SHA-1 `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 기준 main은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`; metadata-only 후속 `653f9c9693664f791a4a6040f0d19b45f2b88621`이며 시각화 engine 내용은 `44ac8c11`에서 바뀌지 않은 것으로 전달받았다.

시각화 사유: 유용한 함수 그림은 개념 이해를 돕는다. 좌표는 임의의 위치가 아닌 해당 실제 곡선 점에 연결된 지시선으로 표시한다.

수학·범위 요약: 시각화는 f의 두 가능한 quartic 후보를 u,v로 함께 표시하며 stationary inflections와 공통 minimum을 각각 실제 점에 붙인 좌표 지시선으로 나타낸다.

입력 작성 근거: Actual piecewise-polynomial referenceCurves accepts up to 4 rational pieces, including quartics. Both candidate quartics are represented exactly; no candidate is silently selected.



원문 인용(정확, 문항; questionBank[14].content):

```
15. 최고차항의 계수가 양수이고 $f(0)=0$인 사차함수 $f(x)$의 도함수 $f'(x)$가 다음 조건을 만족시킨다.

(가) 방정식 $f'(x)=0$은 서로 다른 두 실근을 갖는다.
(나) $f'(0)=0, f'(1)f'(-1)=0$

실수 $t$에 대하여 함수 $|f(x)-t|$가 미분가능하지 않은 점의 개수를 $g(t)$라고 하자. 함수 $g(t)$가 $t=0$과 $t=\frac{7}{12}$에서만 불연속일 때, $\int_{0}^{1} f(x)dx$의 최댓값은 $\frac{q}{p}$이다. $q-p$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [4.9점]
```

원문 인용(정확, 정답): ②

원문 인용(정확, 해설):

```
$f'(x)$는 최고차항 계수가 양수인 삼차식이고 서로 다른 두 실근만 갖습니다. $f'(0)=0$과 $f'(1)f'(-1)=0$에 따라 그 두 근은 $0$과 $1$ 또는 $0$과 $-1$입니다. 이 중 한 근이 중근입니다. 도함수의 중근에서는 부호가 바뀌지 않으므로 정지변곡점이 되고, 단순근에서는 부호가 바뀌므로 극솟점이 됩니다.
$|f(x)-t|$가 미분불가능한 점의 수 $g(t)$는 $f(x)=t$의 단순 교점에서 달라지고, 극솟값의 높이와 정지변곡점의 높이에서 불연속이 생깁니다.
$f(0)=0$이고 불연속 높이가 $0,7/12$이므로 $x=0$은 극솟점, $x=\pm1$은 정지변곡점입니다. 따라서 $f'(x)=kx(x-1)^2$ 또는 $kx(x+1)^2$이고 $k>0$입니다.
$f(\pm1)=\int_0^{\pm1}f'(x)dx=k/12=7/12$이므로 $k=7$입니다.
첫 경우 $f(x)=7(x^4/4-2x^3/3+x^2/2)$이고 $\int_0^1f(x)dx=7/20$입니다.
둘째 경우 $f(x)=7(x^4/4+2x^3/3+x^2/2)$이고 $\int_0^1f(x)dx=7(1/20+1/6+1/6)=161/60$입니다.
최댓값은 $161/60$이므로 $p=60,q=161$, $q-p=101$입니다. 따라서 정답은 ②입니다.
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
