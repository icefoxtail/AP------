# 22 복성고 고2 수학II Q01 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 item.json, plan.json, publish.json, STATUS.md 초안만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 1, questionNumber 1; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 시각 자료를 보조하는 것이다. 원문이 접선 방정식을 묻는다. 원래 함수 곡선, (1,4)의 접점, 접선 y=4x를 정확한 수식과 좌표로 나타내며 P의 좌표는 coordinateLeader로 연결한다.

수학 요약: f(x)=(x+1)^2, f′(1)=4. 점 (1,4)를 지나는 기울기 4인 접선은 y=4x이다.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
1. 곡선 $y=x^2+2x+1$ 위의 점 $(1, 4)$에서 접하는 접선의 방정식을 구하시오. [3.6점]
```

원문 정답:

```text
④
```

원문 해설 (정확 인용):

```text
접선의 기울기는 접점에서의 미분계수입니다. $$y'=2x+2,$$ 따라서 $x=1$에서 기울기는 $2+2=4$입니다. 접점이 $(1,4)$이므로 점-기울기 식은 $$y-4=4(x-1),$$ 정리하면 $$\boxed{y=4x}.$$ ①·②는 기울기 2, ③은 절편 -4, ⑤는 절편 4라서 접점과 기울기를 동시에 만족하지 않습니다.
```

검사 기록: 정확 원문의 questionBank 항목 1을 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 입력 보정 기록 · 2026-11-08 UTC

외부 fit 결과에서 PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:-1이 확인되었다. 포물선의 실제 꼭짓점 V=(−1,0)을 graphPlan.requiredPoints에 marker NONE으로 추가했다. 기존 접점 P=(1,4), 접선, 문항 인용 및 이전 실패/NOT_RUN 이력은 보존했다. 이 작성자는 재검사하지 않았다. 보정 후보 검사는 상위 담당자에게 남긴다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 실패는 failure-history.json 및 corrections/before/q01에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
