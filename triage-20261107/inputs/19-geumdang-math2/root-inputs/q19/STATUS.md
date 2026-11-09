# 19 금당고 고2 수학II Q19 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; `scope.json`의 sourceMain `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`. `item.json`은 `sourcePath`와 `ordinal: 19`로 묶는다. 소유자 UNKNOWN. 사용자가 도식 도움을 요청한 취지는 함수 관계·부호·경계·넓이를 시각적으로 이해하기 쉽게 보조하는 것이다. 원본 문항과 이력은 보존한다.

## 원문 문항 (정확 문자열)

~~~text
[서술형1] 곡선 $y=(x-2)^2$과 직선 $y=-x+4$로 둘러싸인 도형의 넓이를 구하시오. [5점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices 배열은 빈 배열 (선택지 없음).
~~~

## 원문 정답 (정확 문자열)

~~~text
\dfrac{9}{2}
~~~

## 원문 해설 (정확 문자열)

~~~text
교점을 먼저 구한다.
$(x-2)^2=-x+4$
$x^2-3x=0$
$x=0,3$
$0\le x\le3$에서는 직선이 포물선보다 위에 있으므로 넓이는
$S=\displaystyle\int_0^3\{(-x+4)-(x-2)^2\}\,dx$
$=\int_0^3(-x^2+3x)\,dx$
$=\left[-\dfrac{x^3}{3}+\dfrac{3x^2}{2}\right]_0^3=\dfrac92$
따라서 넓이는 $\dfrac92$이다.
~~~


## 도식 초안
닫힌 [0,3]에서 포물선 f와 직선 g를 함께 그리고 (0,4), (3,1) 사이의 g 위쪽·f 아래쪽 유한 영역을 음영 처리한다.

## 가독성·지시선 계획

A–V–B를 순서대로 표시해 두 교점과 포물선의 꼭짓점을 구별한다. 직선 g와 포물선 f에 별도 곡선 ID를 주고, 눈금 배열은 비운다. 음영은 [0,3]의 단일 유한 영역만 채운다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 이 묶음은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 계획 요약은: 닫힌 구간 [0,3]에서 원래 곡선 f(x)=(x−2)²와 직선 g(x)=−x+4의 교점은 (0,4), (3,1)이다. 이 구간에서는 g가 f보다 위에 있고, 두 곡선 사이의 유한한 영역을 채운다. 넓이는 ∫₀³(g−f)dx=∫₀³(−x²+3x)dx=9/2이다. 따라서 원문에서 구하는 넓이는 9/2이다.

checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 이 초안은 검수된 결과가 아니며 엔진 제한이나 입력 적합성을 확정하지 않는다. owner UNKNOWN. source/assets/ledger/queue 및 다른 draft, 보호된 Q09/Q10 SVG·연결, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기와 렌더는 수행하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-09-10-084Z` / `interval`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/interval/node-results-2026-11-09T00-09-10-084Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
