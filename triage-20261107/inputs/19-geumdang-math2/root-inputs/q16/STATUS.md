# 19 금당고 고2 수학II Q16 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; `scope.json`의 sourceMain `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`. `item.json`은 `sourcePath`와 `ordinal: 16`로 묶는다. 소유자 UNKNOWN. 사용자가 도식 도움을 요청한 취지는 함수 관계·부호·경계·넓이를 시각적으로 이해하기 쉽게 보조하는 것이다. 원본 문항과 이력은 보존한다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)=x^3+6x^2+kx-10$이 닫힌구간 $[0,3]$에서 증가하도록 하는 상수 $k$의 최솟값은? [5.0점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $0$
2. $4$
3. $8$
4. $12$
5. $16$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
닫힌구간에서 증가하려면 도함수가 구간 전체에서 $0$ 이상이어야 한다.
$f'(x)=3x^2+12x+k$
$[0,3]$에서 $3x^2+12x$는 증가하므로 도함수의 최솟값은 $x=0$에서 $k$이다.
따라서 $k\ge0$이고 최솟값은 $0$이다.
정답은 ①이다.
~~~


## 도식 초안
닫힌 [0,3]에서 경계 k=0의 도함수 f′(x)=3x²+12x만 표시한다. 원래 f는 그리지 않고 f(0)=−10, f(3)=71을 캡션에 원래 함수값으로 분리해 적는다.

## 가독성·지시선 계획

A–B를 순서대로 표시한다. 세로축은 f′(x)라고 명시하고 [0,3]만 그리며 축 눈금 배열은 비운다. 원래 f값은 그래프 점으로 표시하지 않고 캡션에서 분리한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 이 묶음은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 계획 요약은: 도식은 원래 삼차함수 f가 아니라 경계값 k=0에서의 도함수 f′(x)=3x²+12x를 닫힌 구간 [0,3]에 그린다. f′의 최솟값은 x=0에서 0이므로 f′(x)+k≥0가 [0,3]에서 성립하는 k의 최솟값은 0이다. 이 경계 함수에서 원래 f(0)=−10, f(3)=71이며, 이 두 함수값은 그래프의 세로좌표가 아니다. 따라서 k의 최솟값은 0이다.

checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 이 초안은 검수된 결과가 아니며 엔진 제한이나 입력 적합성을 확정하지 않는다. owner UNKNOWN. source/assets/ledger/queue 및 다른 draft, 보호된 Q09/Q10 SVG·연결, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기와 렌더는 수행하지 않았다.


## 표시 배율 선택

Q16 plan에 `axisScale: {"x": 1, "y": "1/8"}`를 추가했다. 도식 표시에서 세로 1단위 길이는 가로 1단위 길이의 1/8이다. 이는 표시 배율만 조정하며 수식·좌표·정의역과 원함수/도함수 구분은 바꾸지 않는다. checker는 NOT_RUN이며 실제 실패를 실행했다고 기록하지 않는다.


## 실제 입력 오류와 최소 정정

실제 interval 입력 검사에서 `specFor AXIS_TITLE_INVALID:y`가 보고되었다. 원인은 `axisTitles.y`의 허용되지 않은 `f′(x)` 표기였다. 이를 허용 표기 `도함수`로 바꾸고 실제 표시 함수명 g와 plan/publish 설명을 `g(x)=f′(x)=3x²+12x`로 맞췄다. 수치·범위·축 배율·원함수/도함수 구분은 유지했다. 수정 후 checker 재검사는 NOT_RUN이다.

Q16 local input revision is complete and frozen; caption now uses `g(x)+k≥0` consistently. Checker recheck remains NOT_RUN.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-17-53-313Z` / `final3-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/final3-corrected/node-results-2026-11-09T00-17-53-313Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
