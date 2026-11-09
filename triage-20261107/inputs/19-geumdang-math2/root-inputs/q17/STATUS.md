# 19 금당고 고2 수학II Q17 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`. `item.json`은 `sourcePath`와 `ordinal: 17`로 묶는다. 소유자 UNKNOWN. 사용자 요청 취지: 함수의 시각 보조가 풀이 이해를 돕는 부분에서 그래프를 보조한다. 원본과 기존 검수 이력은 보존한다.

기존 검수·이력 보존: triage `590e20c0473b0d24d5d41687ed24272caaa80024`에서 PR #534 Q17 해설 검수 이력이 확인되었다. 현행 source-exact 원문만 결속하며, 기존 검수 결과·원격 원본을 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
최고차항의 계수가 $1$인 사차함수 $f(x)$가 다음 조건을 만족할 때, $f(a)f(b)$의 값은?
(가) $y=f(x)$의 그래프는 직선 $y=4x+3$과 서로 다른 두 점에서 접한다.
(나) $y=f(x)$의 그래프는 직선 $y=4x+4$와 한 점에서 접하고, 접점 외의 서로 다른 두 점에서 만난다.
(다) $-3<a<b<0$인 실수 $a,b$에 대하여 $f'(-3)=f'(a)=f'(b)=4$이다. [5점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
$h(x)=f(x)-4x$라 두면 (가)에서
$h(x)-3=(x-r)^2(x-s)^2\quad(r<s)$이다.
따라서
$h'(x)=2(x-r)(x-s)(2x-r-s)$이고
$h'(x)=0$인 세 점은 $r,\dfrac{r+s}{2},s$이다.
(다)에서 이 세 점은 $-3,a,b$이며 $-3<a<b<0$이므로
$r=-3,\quad \dfrac{r+s}{2}=a,\quad s=b$이다.
$x=-3$ 또는 $x=b$에서는 $h(x)=3$이다.
(나)의 접점에서는 $h(x)=4$이고 $h'(x)=0$이다.
따라서 두 점 $-3,b$는 접점이 아니며 가운데 점 $a$가 접점이다.
$h(a)=4$이므로
$(a+3)^2(a-b)^2=1$이다.
$a=\dfrac{b-3}{2}$에서
$a+3=\dfrac{b+3}{2},\quad a-b=-\dfrac{b+3}{2}$이다.
따라서
$\dfrac{(b+3)^4}{16}=1$
$\dfrac{(b+3)^2}{4}=1$이다.
$-3<b<0$이므로 $b+3>0$이다.
따라서 $b+3=2$이고
$b=-1,\quad a=\dfrac{-3+(-1)}2=-2$이다.
(나)의 접선에서
$f(a)=4a+4=-4$이다.
(가)의 접선에서
$f(b)=4b+3=-1$이다.
$f(a)f(b)=(-4)(-1)=4$이다.
따라서 정답은 ④이다.
~~~

## 도식 초안

원문 보조식은 h(x)=f(x)−4x이다. 도식은 원래 f도 h도 아닌 수직이동 v(x)=h(x)−3=f(x)−4x−3=(x+3)²(x+1)²을 실수 전체에서 그린다. 수평선 v=0은 원래 직선 y=4x+3과의 접점 x=−3,−1을 나타내고, v=1은 y=4x+4와의 접점 x=−2 및 다른 두 교점 x=−2±√2를 나타낸다. 이로써 a=−2,b=−1이고 f(a)=−4, f(b)=−1이므로 f(a)f(b)=4이다. 정답은 4이다.

## 가독성·지시선 계획

A–M–B를 순서대로 표시한다. 세로축은 v(x), y=0 및 y=1 수평선을 사용하고 다른 좌표 눈금은 비운다. 수평선과 원래 직선의 관계 및 f로 복원하는 식을 캡션에 명시한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 준비된 파일은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 이 그래프 formula는 인수 차수가 각각 2 이하인 형태로 작성했지만 checker 미실행이므로 static compatibility는 UNKNOWN이다. checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 로컬 JSON 문법만 확인했으며, 이를 학생 수학·시각 품질 PASS로 확대하지 않는다. 원본/source/assets/ledger/queue, 보호 Q09/Q10의 main 연결 SVG·그 외 draft, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기·렌더는 수행하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-09-10-084Z` / `interval`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/interval/node-results-2026-11-09T00-09-10-084Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
