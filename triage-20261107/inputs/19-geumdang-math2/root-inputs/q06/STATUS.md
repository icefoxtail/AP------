# 19 금당고 고2 수학II Q06 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`. `item.json`은 `sourcePath`와 `ordinal: 6`로 묶는다. 소유자 UNKNOWN. 사용자 요청 취지: 함수의 시각 보조가 풀이 이해를 돕는 부분에서 그래프를 보조한다. 원본과 기존 검수 이력은 보존한다.

## 원문 문항 (정확 문자열)

~~~text
닫힌구간 $[-3,1]$에서 함수 $f(x)=x^4-8x^2+5$의 최댓값과 최솟값의 합은? [4.0점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $-3$
2. $-1$
3. $0$
4. $1$
5. $3$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
닫힌구간의 최댓값과 최솟값은 양 끝점과 내부 임계점에서 확인한다.
$f'(x)=4x^3-16x=4x(x-2)(x+2)$
구간 안의 임계점은 $x=-2,0$이다.
$f(-3)=14,\quad f(-2)=-11,\quad f(0)=5,\quad f(1)=-2$
최댓값은 $14$, 최솟값은 $-11$이다.
$14+(-11)=3$
따라서 정답은 ⑤이다.
~~~

## 도식 초안

原文 f(x)=x⁴−8x²+5 的定义区间 [−3,1]은 그대로 두고, 도식에는 정확한 평행이동 u(x)=f(x)+11=(x²−4)²만 그린다. A(−3,25), B(−2,0), C(0,16), D(1,9)는 각각 원래 f값 14, −11, 5, −2에 대응한다. 원래 f의 최댓값은 14, 최솟값은 −11이므로 그 합은 3이다.

## 가독성·지시선 계획

A–B–C–D를 순서대로 표시한다. x축은 원래 변수 x, y축은 u(x)로 명시하고 눈금 배열은 비운다. 원래 f값으로 오인하지 않도록 평행이동 및 값 대응을 캡션에 둔다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 준비된 파일은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 이 그래프 formula는 인수 차수가 각각 2 이하인 형태로 작성했지만 checker 미실행이므로 static compatibility는 UNKNOWN이다. checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 로컬 JSON 문법만 확인했으며, 이를 학생 수학·시각 품질 PASS로 확대하지 않는다. 원본/source/assets/ledger/queue, 보호 Q09/Q10의 main 연결 SVG·그 외 draft, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기·렌더는 수행하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-09-10-084Z` / `interval`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/interval/node-results-2026-11-09T00-09-10-084Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
