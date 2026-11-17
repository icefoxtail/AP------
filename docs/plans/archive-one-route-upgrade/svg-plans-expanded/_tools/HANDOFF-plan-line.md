# 플랜 작성 라인 인계 (2026-11-17, 마지막 갱신 batch68)

## 지금까지 (data/svg-plans-20261117)
- batch64: DRIFT 26개는 이미 해결됨(시험지별 `source-revision.json`), 이름 있는 플랜 7문항을 `qN-solution.json`으로 통합, 중3 CONTENT 5건.
- batch65~67: 한 문항 여러 플랜 171개를 composite 한 장으로 통합(`_tools/merge2.js`). 못 합친 문항은 `COMPOSITE-HOLD.tsv`, `MIXED-COMPOSITE-HOLD.tsv`.
- batch68: 고2 원본 2025 2학기 중간 수학II 3개 시험지(매산고·매산여고·제일고)의 장부 `plan 대기` 22문항. 판정은 FIGURE 20 / EXEMPT 2(매산고 q11, 제일고 q10).
- 눈금 값에 0을 넣으면 `INVALID_AXIS_TICK_VALUE`다. 이미 있던 49개 플랜에서 0을 뺐다(`fixzero`).

## 3순위 남은 순서 (사용자 결정 2026-11-10, 1·2순위 이후 사용자 지시로 순서는 신경 쓰지 않아도 됨)
- 대상: 원본 고2 1학기 중간·1학기 기말·2학기 중간. 2학기 기말은 다른 PC 담당(dots가 쓴 것은 공장이 처리).
- 과목 순서: 수학I → 수학II → 확률과통계 → 대수·미적분I·기하(신교육과정). 과목 안에서는 최신 연도부터.
- 장부(`archive/tools/geometry-equation/production/exam-figure-ledger/`)에서 이미 PUBLISHED/EXEMPT/CLOSED인 문항은 건너뛴다. 장부에 시험지가 없는 고2 원본은 약 125개 시험지다. 문항마다 FIGURE/EXEMPT/CONTENT부터 판정한다.
- 이번 묶음(batch68)이 끝난 다음 시험지부터 이어서 한다. 아직 시작 안 한 곳: 수학II 2mid 다른 학교(2024, 2023…), 수학I, 확률과통계, 대수·미적분I·기하.

## 규칙 (모든 플랜)
- 한 문항 한 장(필요하면 composite·number-line rows). 정답 숨김 없음. 과정 정보 최대(교점·극점 좌표, 중간값).
- `caption`: 풀이 요약, 끝에 정답("따라서 답은 ③이다."). `accessibilityDescription`: 그림에 보이는 것 한두 문장, 정답 금지. 둘 다 입력용 표기(^, sqrt, *, \frac)·"축척"을 쓰지 않는다. 검사기 `archive/tools/svg-language-contract.cjs`.
- 문항에 없는 이름 금지. 해설이 자리표시 문장이거나 문항과 맞지 않으면 decision CONTENT.
- 묶음(시험지 3~5개)마다 표본 2~3개 렌더 후 push, push할 때마다 SHA와 시험지 목록을 짧게 보고.

## 엔진에서 실제로 걸린 것(이번 묶음에서 확인)
- `axisTickValues`에 0 금지. 눈금 라벨이 점 좌표 라벨과 겹치면 `TICK_LABEL_*`/`LAYOUT_INVENTORY_INCOMPLETE`이니 눈금을 줄인다.
- 구간별 다항(piecewise-polynomial)은 `requiredPoints`가 곡선 위에 있어야 하고(곡선에 없는 점 금지), 꼭짓점·극점·꺾임점을 모두 넣는다(엔진이 `fix`로 정확한 값을 알려 준다: 렌더 결과 JSON의 `fix`). 극점이 근호여도 그 값 그대로 넣는다.
- 삼차함수의 두 극점이 너무 가까우면 `PIECEWISE_POLY_FEATURES_BELOW_RESOLUTION`: 정의역을 좁힌다. 삼차 + 근호 교점 목록은 시간 초과(`WORKER_TIMEOUT`)가 났으니 근호 교점이 필요하면 정의역을 좁히거나 목록을 줄인다.
- 불연속 조각함수(piecewise-discontinuous): 조각 차수 2 이하, 양쪽이 모두 열린 경계는 `jumpValues` 필요.
- composite 패널 규칙은 `archive/tools/geometry-equation/production/composite-candidate-svg-v1.mjs`(벤 2~6, 평면도형 2~5 PLANE_FIGURE, 그래프 2패널, 다중곡선 정확히 2패널, 통계 2~4, 입체 2~6). 패널 제목은 한글·ASCII 16자 이내.
- 렌더: 공장 render 도구는 `r.sh`(이 폴더)로 한 개씩. 렌더 슬롯은 공장과 공유하므로 한 번에 1개.
- 표 작성 도구: `b68.js`가 batch68 작성 본보기(헬퍼 `pw()`로 구간별 다항 plan, `add()`로 등록, ALT 사전으로 alt).

## 2026-11-18 중단 시점 (사용자 지시로 SVG 라인 멈춤)
- batch68 결과: 매산여고 q20·제일고 q9는 UNSUPPORTED(끊어지는 조각함수 관측기가 비정수 x 필수점을 못 읽음, `PIECEWISE_POLY_EXACT_VALUE_INVALID`). 같은 조건의 다른 끊어지는 조각함수 플랜(예: 22 효천고 기말 고2 수학II q14)도 같은 공백일 수 있다.
- caption/alt: 공백이 빠진 문장 약 630개는 공백만 복원했고, 한글–수식 사이 띄어쓰기는 전 플랜에 적용했다(`_tools`에 스크립트 없음, 규칙은 "한글 뒤 숫자·영문·√·|·−는 한 칸 띄움, 제·고·중·초+숫자는 제외").
- b03 기준 반영 12문항 push 완료(4930d91dd7). 렌더 확인: q03, 심화 q4, 확인 q11, 순천여고 중간 q21, 순천고 q10·q11, 순천여고 q12·q19 ARCHIVE_BOUND.
- 미렌더(편집만): 확인 q20(RESULT 줄 제거, 근호 2√2와 3이 가까워 `NUMBER_LINE_LABELS_TOO_CLOSE`였음), 금당고 기말 q09, 복성고 q11, 순천고 q17(q03과 같은 세로 점선 방식).
- 미해결: 팔마고 기말 q21 실제 값 그래프(x 0~500, y −900~612는 `WORKER_TIMEOUT`; 정의역·눈금을 줄여 재시도), 20 매산여고 기말 고2 수학II q13(`referenceCurves`에 name/formula를 넣으면 `PIECEWISE_POLY_REFERENCE_CURVES_INVALID`; 이름 없이 callouts로 식 라벨 또는 `overlays.names` 시도). 두 문항은 옛 플랜 그대로다.
- 미확인: 금당고 중간 q13(렌더 통과, 라벨은 plan에 있음), 매산여고 중간 q13(렌더 중 중단).

## 2026-11-18 추가 (b03 마무리)
- 팔마고 기말 q21: `sourceDomain` INTERVAL [0,500]에 `domain` [100,350], 눈금 3개로 `WORKER_TIMEOUT`을 피했다. 엔진은 원 정의역 전체(0~500)를 그린다. ARCHIVE_BOUND.
- 20 매산여고 기말 고2 수학II q13: `referenceCurves[0]`에 `name:"g"`만 쓰고 `formula`는 빼면 통과한다(`formula`는 조각 형식 전용). f는 `functionName:"f"`+`formula`. ARCHIVE_BOUND.
- 금당고 확인 q20, 금당고 기말 q09, 복성고 q11, 순천고 q17: 렌더 ARCHIVE_BOUND, PNG에서 핵심 값·축 이름 확인.
- 남은 미확인: 매산여고 중간 q13(렌더 중단).
