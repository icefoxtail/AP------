# 22 복성고 고2 수학II Q11 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 초안 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 11, questionNumber 11; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 시각 자료를 보조하는 것이다. 원함수와 극값을 표시하고, y=15 referenceLine은 교점 x=−1(접점), 5를 정확하게 나타낸다. y=−15는 overlay 수평선으로만 그려 개별 근삿값을 만들지 않는다. 극값 및 교점 좌표는 coordinateLeader로 연결한다.

수학 요약: f(−1)=15, f(3)=−17. t=15이면 f=15의 해는 −1,5로 서로 다른 두 개이고, f=−15는 −17과 15 사이의 값이므로 세 개의 서로 다른 해가 있다. 총 5개.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
11. 함수 $f(x)=x^3-3x^2-9x+10$에 대하여 $x$에 대한 방정식 $|f(x)|=t$의 서로 다른 실근의 개수가 5가 되도록 하는 실수 $t$의 값을 구하시오. [4.0점]
```

원문 정답:

```text
②
```

원문 해설 (정확 인용):

```text
$f'(x)=3x^2-6x-9=3(x+1)(x-3)$이므로 $x=-1$에서 극대, $x=3$에서 극소입니다. $$f(-1)=-1-3+9+10=15,\quad f(3)=27-27-27+10=-17.$$ $|f(x)|=t$는 $f(x)=t$와 $f(x)=-t$를 함께 세는 문제입니다. $t=15$이면 수평선 $y=15$는 극대점에서 접하고 오른쪽에서 한 번 더 만나 **2개**, $y=-15$는 극댓값 15와 극솟값 -17 사이여서 **3개** 만납니다. 따라서 서로 다른 실근이 $2+3=5$개가 되어 $$\boxed{t=15}.$$ ①·③·④·⑤에서는 수평선의 접점·교점 개수가 이와 같지 않습니다.
```

검사 기록: 정확 원문의 questionBank 항목 11을 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 입력 보정 기록 · 2026-11-08 UTC

첫 후보에서 PIECEWISE_POLY_REFERENCE_LINE_INVALID가 확인되었다. reference line ID positive-level을 계약의 짧은 ID pos15로 정규화했다. 실제 overlay ID 계약도 읽어 보니 negative-level의 하이픈이 허용되지 않아 neg15로만 정규화했다. 두 선의 위치·식·라벨은 그대로이며 y=15의 교점 x=−1,5 및 y=−15의 교점 개수 서술을 바꾸지 않았다. 이 ID 보정으로 근삿값 교점을 추가하지 않았다. 기존 실패/NOT_RUN 이력은 보존했고 이 작성자는 재검사하지 않았다. 보정 후보 검사는 상위 담당자에게 남긴다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-40-16-648Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.
초기 실패는 failure-history.json 및 corrections/before/q11에 보존했다. 확정된 오기·필수점·식별자만 정정했고 item/publish, 수학 의도, 원문은 바꾸지 않았다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
