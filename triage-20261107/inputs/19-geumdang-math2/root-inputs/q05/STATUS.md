# 19 금당고 고2 수학II Q05 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; `scope.json`의 sourceMain `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`. `item.json`은 `sourcePath`와 `ordinal: 5`로 묶는다. 소유자 UNKNOWN. 사용자가 도식 도움을 요청한 취지는 함수 관계·부호·경계·넓이를 시각적으로 이해하기 쉽게 보조하는 것이다. 원본 문항과 이력은 보존한다.

## 원문 문항 (정확 문자열)

~~~text
수직선 위를 움직이는 점 $P$의 시각 $t$에서 속도가 $v(t)=4-2t$일 때, $t=1$에서 $t=3$까지 점 $P$의 위치변화량은? [4.0점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $-2$
2. $-1$
3. $0$
4. $1$
5. $2$
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
위치변화량은 속도를 시간에 대해 적분한 값이다.
$\displaystyle\int_1^3(4-2t)\,dt$
$=\left[4t-t^2\right]_1^3$
$=(12-9)-(4-1)=0$
따라서 정답은 ③이다.
~~~


## 도식 초안
닫힌 [1,3]에서 v(t)=4−2t를 표시한다. t=2의 영점과 signed-area +1, −1을 따로 음영 처리한다. 위치변화량 0과 총 이동거리 2를 캡션에서 분리한다.

## 가독성·지시선 계획

A–B–C의 세 핵심 점을 순서대로 둔다. 축 제목은 t와 v(t), 눈금 수는 비우고, 부호별 두 영역을 나눠 면적 부호가 분명하게 보이게 한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 이 묶음은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 계획 요약은: 도식은 수직선 위 점 P의 속도 v(t)=4−2t를 닫힌 시간 구간 [1,3]에서 그린다. t=2에서 속도가 0이 되고, [1,2]의 signed integral은 +1, [2,3]의 signed integral은 −1이다. 따라서 위치변화량은 0이지만 총 이동거리(두 넓이의 합)는 2이므로 정답 0을 거리 0으로 해석하지 않는다.

checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 이 초안은 검수된 결과가 아니며 엔진 제한이나 입력 적합성을 확정하지 않는다. owner UNKNOWN. source/assets/ledger/queue 및 다른 draft, 보호된 Q09/Q10 SVG·연결, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기와 렌더는 수행하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-09-10-084Z` / `interval`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/interval/node-results-2026-11-09T00-09-10-084Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
