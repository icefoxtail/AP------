# 22 복성고 고2 수학II Q09 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 초안 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 9, questionNumber 9; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 도식을 보조하는 것이다. 원함수는 실수 전체에서 정의된 f(x)=−x⁴+x²+3이므로 sourceDomain은 ALL_REALS다. 열린구간 (0,1)은 롤 정리를 적용할 조건이지 함수의 정의역 제한이 아니다. 관련점 c=√2/2=(√2/2,13/4)는 coordinateLeader로 표시한다.

수학 요약: f(0)=f(1)=3이고 f′(x)=2x(1−2x²). 도함수 영점은 0, ±√2/2이며 열린구간 (0,1)의 내부점은 √2/2 하나다. 따라서 합은 √2/2.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
9. 함수 $f(x)=-x^4+x^2+3$에 대하여 열린구간 $(0, 1)$에서 롤의 정리를 만족시키는 실수 $c$가 될 수 있는 모든 값의 합을 구하시오. [4.0점]
```

원문 정답:

```text
④
```

원문 해설 (정확 인용):

```text
$f(0)=3$이고 $f(1)=-1+1+3=3$입니다. 다항함수는 $[0,1]$에서 연속, $(0,1)$에서 미분가능하므로 롤의 정리를 적용할 수 있습니다. $$f'(x)=-4x^3+2x=2x(1-2x^2).$$ $f'(c)=0$의 해는 $c=0,\pm1/\sqrt2$이고, 열린구간 $(0,1)$에 속하는 값은 $c=1/\sqrt2=\sqrt2/2$ 하나입니다. 합은 $$\boxed{\frac{\sqrt2}{2}}$$로 ④입니다. ①·②·③·⑤는 구간 조건과 도함수의 영점을 함께 만족하지 않습니다.
```

검사 기록: 정확 원문의 questionBank 항목 9를 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
