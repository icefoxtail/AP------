# 19 금당고 고2 수학II 2학기 기말 Q15 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`). `item.json`은 원본 경로와 `ordinal: 15`로 원문 행을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
상수함수가 아닌 계수가 정수인 두 다항함수 $f(x)$, $g(x)$에 대해
$g(x)+\displaystyle\int_1^x f(t),dt=-4x^2+9x+5$, $g(2)=7$이고, $f(x)g'(x)=-20x^2+54x-36$일 때, $g(3)$의 값은? [4.8점]
```

## 원문 선택지 (정확 문자열)

```text
$-6$ / $-5$ / $-4$ / $-3$ / $-2$
```

## 원문 정답 (정확 문자열)

```text
①
```

## 원문 해설 (정확 문자열)

```text
$x=1$을 원래 식에 대입하면 적분이 $0$이므로
$g(1)=-4+9+5=10$이다.
양변을 미분하면
$f(x)+g'(x)=-8x+9$
이고
$f(x)g'(x)=-20x^2+54x-36=(-10x+12)(2x-3)$이다.
곱은 이차식이고 합은 일차식이므로 $f(x)$와 $g'(x)$는 각각 일차식이다.
두 인수의 합도 $(-10x+12)+(2x-3)=-8x+9$이다.
따라서 $f(x),g'(x)$는 두 인수 $-10x+12$와 $2x-3$ 중 하나씩이다.
먼저 $g'(x)=2x-3$인 경우를 확인한다.
이를 적분하면
$g(x)=x^2-3x+C$이다.
$g(1)=10$을 대입하면
$1-3+C=10$
$C=12$이다.
따라서
$g(2)=4-6+12=10$이다.
이는 조건 $g(2)=7$과 모순이다.
그러므로 $g'(x)=-10x+12$이다.
이를 적분하면
$g(x)=-5x^2+12x+C$이다.
조건 $g(2)=7$을 대입하면
$-20+24+C=7$
$C=3$이다.
$g(3)=-45+36+3=-6$이다.
따라서 정답은 ①이다.
```

## 시각 목적 및 계획

사용자 사유: 함수 그림은 풀이 이해에 도움이 되므로 해당 함수 관계를 정확히 보조한다. Q15 해설 검수 이력(PR #534)과 #1405 메타 이력을 보존한다. 그래프는 f와 g를 구별하며, g(1)=10, g(2)=7, g(3)=−6 및 조건 g(2)=7을 유지한다. 계획과 좌표 라벨: 두 함수는 다른 곡선으로 표시한다: f(x)=2x−3, g(x)=−5x²+12x+3. g(1)=10, g(2)=7, g(3)=−6이다. `coordinateLeader`는 실제로 그린 점에 연결한다. 시험지 triage 이력: PR #534의 Q14 발문·정답 수정, Q11·Q15·Q17·Q21 해설 검수 및 #1405 메타 이력을 보존한다. 이 초안은 원문, 메타데이터, 판정표, 원격 기록을 수정하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 정적 JSON 파싱·원문 문자열/ordinal/source-hash 대조 PASS. 이는 출처·형식 연결만 확인하며 학생용 수학·교육·시각 품질 PASS를 뜻하지 않는다. 초기 입력 checker fit_overview FAIL (`PIECEWISE_POLY_REFERENCE_CURVES_INVALID`); reference-curve 수정 후 checker fit_overview FAIL (`PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:6/5`); 꼭짓점 추가 후 checker 재검사 NOT_RUN. 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 독립 수학 검토 NOT_RUN, 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content, choices, answer, solution 문자열을 위에 source-exact.js의 정확한 행으로 보존했다. 원본과 과거 이력, source/assets, Q09/Q10의 기존 SVG, ledger, queue, 다른 draft는 변경하지 않았다. 이 로컬 변경은 Q15 draft의 plan/STATUS 수정과 지정된 수정 전 4파일 스냅샷 추가로 한정하며 원격 쓰기 0회.


## Q15 reference-curve 검사 오류와 최소 수정

첫 실제 polynomial 입력 묶음 검사에서 Q15의 `fit_overview`가 `PIECEWISE_POLY_REFERENCE_CURVES_INVALID`로 실패했다. 읽은 현재 검사기 `preparation-19-geumdang-math2/checker/recheck-input-only/sources/graph_framing.py` 1964–1991행은 legacy `referenceCurves.coefficients` 경로에서 3개 계수의 진짜 이차식만 허용한다. 기존 `f(x)=2x−3`은 일차식인데 그 경로를 사용한 것이 원인이다.

최소 수정: `plan.json`의 f reference curve만 piecewise 형식으로 바꾸고 internal ID를 `fcurve`로 했다. 표시명 `f`, 계수 `['-3','2']`, 빈 breakpoints, `sourceDomain: ALL_REALS`, 교점 `1±sqrt(55)/5`를 보존했다. 주곡선 g와 좌표, 원문 결속 item, publish는 그대로다. 수정 전 item/plan/publish/STATUS 네 파일을 `preparation-19-geumdang-math2/corrections/q15-before-reference-fix/`에 보존했다.

수정 후 `fit_overview` 재검사 NOT_RUN. 엔진 변경·렌더·독립 수학/시각 검토·CI·publication·handoff는 NOT_RUN이며 LOCAL_ONLY / DRAFT_ONLY / NOT_READY 상태를 유지한다.


## Q15 꼭짓점 누락과 최소 수정

reference-curve 수정 뒤 실행된 실제 `fit_overview`에서 `PIECEWISE_POLY_EXTREMUM_NOT_IN_REQUIRED_POINTS:6/5`가 확인됐다. 주곡선은 g(x)=−5x²+12x+3이고 꼭짓점은 x=−12/(2·−5)=6/5, g(6/5)=51/5이다.

최소 수정: `requiredPoints`에 V=(1.2,10.2), `exactCoordinates.V=['6/5','51/5']`, `coordinateLeader`에 V를 추가했다. 기존 원함수 g/f, 세 기존 점과 두 교점, item/publish는 변경하지 않았다. 수정 전 item/plan/publish/STATUS 네 파일을 `preparation-19-geumdang-math2/corrections/q15-before-vertex-fix/`에 보존했다.

수정 후 `fit_overview` 재검사 NOT_RUN. 엔진 변경·렌더·독립 수학/시각 검토·CI·publication·handoff는 NOT_RUN이며 LOCAL_ONLY / DRAFT_ONLY / NOT_READY 상태를 유지한다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-17-53-313Z` / `final3-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/final3-corrected/node-results-2026-11-09T00-17-53-313Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
