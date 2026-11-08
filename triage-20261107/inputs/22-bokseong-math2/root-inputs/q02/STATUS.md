# 22 복성고 고2 수학II Q02 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 초안 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 2, questionNumber 2; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 시각 자료를 보조하는 것이다. 원문이 극댓값 조건에서 정해지는 상수와 극솟값을 묻는다. a=7로 정해지는 정확한 삼차함수와 극소점·극대점 좌표를 보인다. 좌표 라벨은 M, N 각각에 coordinateLeader를 지정했다.

수학 요약: f′(x)=−6(x−1)(x−2)이므로 x=1에서 극소, x=2에서 극대이다. f(2)=a−4=3에서 a=7; f(1)=2이다.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
2. 함수 $f(x)=-2x^3+9x^2-12x+a$의 극댓값이 3일 때, 함수 $f(x)$의 극솟값은? (단, $a$는 상수) [3.6점]
```

원문 정답:

```text
②
```

원문 해설 (정확 인용):

```text
도함수는 $$f'(x)=-6x^2+18x-12=-6(x-1)(x-2)$$입니다. 부호는 $x<1$에서 음, $1<x<2$에서 양, $x>2$에서 음이므로 $x=1$에서 극소, $x=2$에서 극대입니다. $$f(2)=-16+36-24+a=a-4=3$$에서 $a=7$입니다. 따라서 극솟값은 $$f(1)=-2+9-12+7=\boxed2.$$ ①·③·④·⑤는 극대 위치를 $x=2$로 판단해 구한 상수와 맞지 않습니다.
```

검사 기록: 정확 원문의 questionBank 항목 2를 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
