# 22 복성고 고2 수학II Q08 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 초안 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 8, questionNumber 8; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 시각 자료를 보조하는 것이다. 원곡선 f=x⁴+2와 두 정확한 접선 g, h를 referenceCurves로, BC의 y=3을 referenceLine으로 표시한다. A(0,−1), B(−1,3), C(1,3)의 좌표는 모두 실제 선/곡선 위 key point이고 coordinateLeader를 명시했다. 삼각형은 지원되는 두 영역으로 나누어 표시한다.

수학 요약: A를 지나는 접선의 접점 매개변수 t는 t⁴=1에서 ±1이다. 따라서 B=(−1,3), C=(1,3), BC=2, A에서 높이 4이고 삼각형 넓이는 4. 영역 두 부분은 각각 넓이 2이다.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
8. 점 $\mathrm{A}(0, -1)$에서 곡선 $y=x^4+2$에 그은 두 접선의 접점을 각각 $\mathrm{B, C}$라고 할 때, 삼각형 $\mathrm{ABC}$의 넓이를 구하시오. [4.0점]
```

원문 정답:

```text
④
```

원문 해설 (정확 인용):

```text
곡선 $y=x^4+2$의 $x=t$에서 접선은 $$y=4t^3(x-t)+(t^4+2)=4t^3x-3t^4+2.$$ 점 $A(0,-1)$을 지나야 하므로 $-1=-3t^4+2$, 따라서 $t^4=1$이고 실수 접점의 $x$좌표는 $t=\pm1$입니다. 두 접점은 $B(-1,3),C(1,3)$이고 $BC$는 길이 2인 수평선입니다. $A$에서 $BC$까지 높이는 $3-(-1)=4$이므로 $$[ABC]=\frac12\cdot2\cdot4=\boxed4.$$ ①·②·③·⑤는 접선 조건에서 얻은 두 접점과 삼각형의 밑변·높이를 동시에 만족하지 않습니다.
```

검사 기록: 정확 원문의 questionBank 항목 8을 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
