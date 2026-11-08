# 22 복성고 고2 수학II Q06 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 허용된 이 문항 폴더에 초안 3종과 상태 기록만 작성했다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_수학II.js`, ordinal 6, questionNumber 6; exact source `preparation-22-bokseong-math2/source-exact.js` (44,520 bytes), Git blob SHA-1 `2f49f3a37342ca8116c9dd90a4665a1b51e0ca18`; 기준 main `a28bec278aada73e6c39de89174738839205b902`. 원문 이미지는 없음 (images: []).

시각화 사유 및 계획: 사용자 요청은 풀이 이해에 도움이 되는 함수 시각 자료를 보조하는 것이다. 원문의 포물선과 직선을 한 그림에 두고 교점 A(−1,3), B(0,2)를 coordinateLeader로 표시하며, 정확히 둘러싸인 부분만 채운다. 축척은 y/x=4:1로 소면적을 넉넉히 보이도록 의도한다.

가독성 상태 보존: 기존 소면적 표시 우려는 **HOLD**로 유지한다. 입력은 축척과 교점 지시선을 지정했지만, 실제 표시 가독성은 **NOT_REVIEWED**이며 통과로 주장하지 않는다.

수학 요약: 두 그래프는 x=−1,0에서 만나며 해당 구간에서 직선이 위다. ∫[−1,0](−x−x²)dx=1/6이므로 정답 p+q=7이다. 원래 함수 정의역은 실수 전체이고, 색칠은 두 교점 사이의 닫힌 영역뿐이다.

원문 인용 (문항; plan.sourceQuote와 동일):

```text
6. 곡선 $y=x^2+2$와 직선 $y=-x+2$로 둘러싸인 도형의 넓이가 $\frac{q}{p}$일 때 $p+q$의 값은? [3.7점]
```

원문 정답:

```text
⑤
```

원문 해설 (정확 인용):

```text
교점은 $x^2+2=-x+2$에서 $x(x+1)=0$, 즉 $x=-1,0$입니다. 이 구간에서 직선이 포물선보다 위에 있으므로 넓이는 $$S=\int_{-1}^{0}\big[(-x+2)-(x^2+2)\big]dx=\int_{-1}^0(-x-x^2)dx.$$ $$=\left[-\frac{x^2}{2}-\frac{x^3}{3}\right]_{-1}^0=0-\left(-\frac12+\frac13\right)=\frac16.$$ 따라서 $p=6,q=1$이고 $p+q=\boxed7$입니다. ①~④는 교점 또는 위아래 함수의 차를 잘못 적용한 값입니다.
```

검사 기록: 정확 원문의 questionBank 항목 6을 읽고 sourcePath/ordinal/questionNumber를 대조했다. 원문 인용·정답·해설을 보존했다.

미실행: JSON/계약 검사, graph framing, semantic validation, engine.prepare, build, render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, CI, 게시 및 인계는 **NOT_RUN**이다. 이 초안은 READY가 아니다. 원격 쓰기 및 원본·engine·자산·ledger 변경은 하지 않았다.


## 로컬 패키지 보존 시점

2026-11-08 UTC: 문항 item/plan/publish의 JSON 구문 파싱, sourcePath/ordinal과 정확 원문 인용 결속을 확인했다. 이는 엔진·수학·시각 검사의 PASS가 아니다. 모든 작성자가 JSON을 동결한 뒤 현재 바이트의 SHA256을 frozen-json-snapshot.json에 기록했고 일치함을 재확인했다.

엔진 입력 fit/spec/semantic/좌표·viewport 단계의 확정 실행 결과는 패키지 보존 시점에 아직 없으므로 NOT_RUN이다. 미실행을 PASS로 표시하지 않는다.
과거 작은 영역 프레이밍 가독성 보류는 해결됐다고 표시하지 않는다. 가독성·여유 배율 적합성 NOT_REVIEWED.

렌더/prepare/build/독립 전체 수학검토/시각검수/CI/게시/인계는 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 로컬 기록만 저장했고 main, triage branch, 원문, PNG, engine, ledger, Q07/Q10 기존 입력 및 앞선 로컬 패키지를 수정하지 않았다. 효천 ref 거절은 재시도·우회하지 않았다.


## 최종 입력 검사 및 보존 결과

2026-11-08 UTC, 실행 근거: `preparation-22-bokseong-math2/checker/node-results-2026-11-08T19-33-27-909Z.json` 및 해당 Python 결과. 현재 item/plan/publish 바이트는 실행 스냅샷과 일치한다.

실제 fit_overview → specFor → semantic_model.validate 및 critical/viewport·눈금 경계 대조: PASS. 실제 COORDINATE_LABEL 검사 대상 수는 0개다. 지시선 EQUATION_LABEL을 일반 좌표 라벨 검사에 포함했다고 주장하지 않는다.

초기 검사기의 sourceQid 문자열/숫자 타입 비교 결함은 별도 정규화 출처 감사로 구분했다. 정확 원문 바이트와 문항 번호는 일치한다. 렌더·engine.prepare/build·독립 전체 수학검토·시각검수·CI·게시·인계는 여전히 NOT_RUN. DRAFT_ONLY이며 READY가 아니다. 이전 NOT_RUN·실패 기록은 해당 시점의 이력으로 보존하고 이 절에 현재 결과를 추가했다.
