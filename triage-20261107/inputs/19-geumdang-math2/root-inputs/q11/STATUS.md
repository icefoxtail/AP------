# 19 금당고 고2 수학II Q11 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; `scope.json`의 sourceMain `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`. `item.json`은 `sourcePath`와 `ordinal: 11`로 묶는다. 소유자 UNKNOWN. 사용자가 도식 도움을 요청한 취지는 함수 관계·부호·경계·넓이를 시각적으로 이해하기 쉽게 보조하는 것이다. 원본 문항과 이력은 보존한다.

기존 검수·이력 보존: triage `590e20c0473b0d24d5d41687ed24272caaa80024`에서 PR #534의 Q11·Q17·Q21 해설 검수 이력이 확인되었다. 이 로컬 초안은 현 main 결속 `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`의 `source-exact.js` 원문만 사용하며, 기존 검수 결과·원격 원본을 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
$0\le x\le 3$일 때, 부등식 $\left|x^4-4x^3-2x^2+12x+k\right|\le 10$이 성립하기 위한 정수 $k$의 최댓값은? [4.2점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $3$
2. $5$
3. $7$
4. $9$
5. $11$
~~~

## 원문 정답 (정확 문자열)

~~~text
①
~~~

## 원문 해설 (정확 문자열)

~~~text
주어진 다항식 부분을 $p(x)=x^4-4x^3-2x^2+12x$라 두면
$p'(x)=4x^3-12x^2-4x+12=4(x-1)(x-3)(x+1)$
따라서 $[0,1]$에서 증가하고 $[1,3]$에서 감소한다.
$p(0)=0,\quad p(1)=7,\quad p(3)=-9$
그러므로 $-9\le p(x)\le7$이다.
$|p(x)+k|\le10$이 되려면 $k-9\ge-10$이고 $k+7\le10$이어야 한다.
$-1\le k\le3$
정수 $k$의 최댓값은 $3$이므로 정답은 ①이다.
~~~


## 도식 초안
닫힌 [0,3]에서 p를 표시하고 A(0,0), M(1,7), B(3,−9), 수평 레벨 y=7 및 y=−9를 보여 준다. 정수 k의 조건은 범위 [−9,7]에서 캡션으로 연결한다.

## 가독성·지시선 계획

A–M–B를 순서대로 이끈다. 두 기준 수평선은 y=7, y=−9이고 축 눈금 배열은 비운다. 구간 끝점과 내부 극점만 좌표로 표시해 가독성을 유지한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 이 묶음은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 계획 요약은: 원문 p(x)=x⁴−4x³−2x²+12x의 닫힌 구간 [0,3] 그래프이다. p′(x)=4(x−1)(x−3)(x+1)이므로 p는 [0,1]에서 증가하고 [1,3]에서 감소한다. p(0)=0, p(1)=7, p(3)=−9이므로 −9≤p(x)≤7. |p(x)+k|≤10이 모든 x에서 성립하려면 −1≤k≤3이고 정수 k의 최댓값은 3이다.

checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 이 초안은 검수된 결과가 아니며 엔진 제한이나 입력 적합성을 확정하지 않는다. owner UNKNOWN. source/assets/ledger/queue 및 다른 draft, 보호된 Q09/Q10 SVG·연결, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기와 렌더는 수행하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-09-10-084Z` / `interval`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/interval/node-results-2026-11-09T00-09-10-084Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
