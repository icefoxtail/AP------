# 19 금당고 고2 수학II Q21 로컬 입력 초안

원문 결속: main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`; triage `590e20c0473b0d24d5d41687ed24272caaa80024`; source `preparation-19-geumdang-math2/source-exact.js` (SHA-256 `3dae9c353c46f663a86ea9187bc02baa5b490742e9263cc64ad95cb0ad98e528`); 원본 경로 `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`; `scope.json`의 sourceMain `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`. `item.json`은 `sourcePath`와 `ordinal: 21`로 묶는다. 소유자 UNKNOWN. 사용자가 도식 도움을 요청한 취지는 함수 관계·부호·경계·넓이를 시각적으로 이해하기 쉽게 보조하는 것이다. 원본 문항과 이력은 보존한다.

기존 검수·이력 보존: triage `590e20c0473b0d24d5d41687ed24272caaa80024`에서 PR #534의 Q11·Q17·Q21 해설 검수 이력이 확인되었다. 이 로컬 초안은 현 main 결속 `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`의 `source-exact.js` 원문만 사용하며, 기존 검수 결과·원격 원본을 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
[서술형3] 최고차항의 계수가 $1$인 삼차함수 $f(x)$에 대하여 함수 $|f(x)|$는 $x=0$에서만 미분가능하지 않고, 방정식 $f(x)=0$은 구간 $[1,3]$에서 적어도 하나의 실근을 가질 때, $f(1)f'(1)$의 최댓값과 최솟값을 각각 구하시오. [8점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices 배열은 빈 배열 (선택지 없음).
~~~

## 원문 정답 (정확 문자열)

~~~text
최댓값 0, 최솟값 -\dfrac{27}{16}
~~~

## 원문 해설 (정확 문자열)

~~~text
$|f(x)|$가 $x=0$에서 미분가능하지 않으므로 $0$은 $f(x)$의 단순근이다. 구간 $[1,3]$의 실근을 $r$이라 하면, $|f(x)|$가 $r$에서 미분가능하므로 $r$은 단순근이 아니다. $f$는 삼차함수이므로 $r$은 이중근이고, 최고차항의 계수가 $1$이므로 $f(x)=x(x-r)^2\quad(1\le r\le3)$이다.
$f(1)=(1-r)^2$
$f'(x)=(x-r)(3x-r)$이다.
따라서
$f(1)f'(1)=-(r-1)^3(3-r)$이다.
$1\le r\le3$에서 $(r-1)^3(3-r)\ge0$이므로
$f(1)f'(1)$의 최댓값은 양 끝 $r=1,3$에서 $0$이다.
$u=r-1$로 두면
$0\le u\le2$이고
$(r-1)^3(3-r)=u^3(2-u)$이다.
$u^3(2-u)$를 미분하면
$2u^2(3-2u)$이다.
$0<u<\dfrac32$에서 증가하고 $\dfrac32<u<2$에서 감소하므로
최댓값은 $u=\dfrac32$에서이다.
$u=\dfrac32$일 때
$u^3(2-u)=\left(\dfrac32\right)^3\left(\dfrac12\right)=\dfrac{27}{16}$이다.
따라서 $f(1)f'(1)$의 최솟값은 $-\dfrac{27}{16}$이다.
~~~


## 도식 초안
u=r−1∈[0,2]를 가로축으로 하여 원래 삼차함수 f가 아닌 p(u)=f(1)f′(1)=−u³(2−u)를 그린다. 끝점의 최댓값 0, u=3/2에서의 최솟값 −27/16을 표시한다.

## 가독성·지시선 계획

coordinateLeader는 사용하지 않는다. 정확한 식과 닫힌 [0,2] 정의역으로 곡선 형태를 보이며, 정답인 극값 좌표 라벨과 축 눈금을 비워 그림에 답 숫자가 노출되지 않도록 한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 이 묶음은 `item.json`, `plan.json`, `publish.json`, `STATUS.md`뿐이다. 계획 요약은: 도식은 원래 삼차함수 f가 아니라 u=r−1∈[0,2]에 대한 목적함수 p(u)=f(1)f′(1)=−u³(2−u)=u⁴−2u³이다. 끝점 u=0,2에서 p=0이며 내부 최솟점은 u=3/2이다. 이때 r=5/2이고 목적함수는 −27/16이다. 따라서 최댓값은 0, 최솟값은 −27/16이다.

checker, render, full independent math review, visual review, CI, publication, handoff는 NOT_RUN. 이 초안은 검수된 결과가 아니며 엔진 제한이나 입력 적합성을 확정하지 않는다. owner UNKNOWN. source/assets/ledger/queue 및 다른 draft, 보호된 Q09/Q10 SVG·연결, 원격 상태는 수정하지 않았다. 별도 19 금당고 1학기 시험지 거절 범위는 이번 2학기 기말 초안에 포함하지 않는다. 원격 쓰기와 렌더는 수행하지 않았다.


## 실제 입력 오류와 최소 정정

실제 interval 입력 검사에서 `fit PIECEWISE_POLY_FUNCTION_NAME_INVALID`가 보고되었다. 원인은 대문자 functionName `P`였다. functionName, y축 제목, plan/publish의 목적함수 이름을 소문자 `p`로 통일했다. 원문 f, 치환 u=r−1, 수치·수식·정답·item은 그대로다. 수정 후 checker 재검사는 NOT_RUN이다.


## 정적 계약 보완

정적 계약 검토에서 `graph_framing.py` 2169–2173이 실제 극점을 `requiredPoints`에 요구함을 확인해 Q21의 실제 최솟점 M을 숫자 좌표와 `exactCoordinates`로 추가했다. 이는 아직 재실행한 오류가 아니라 필수 입력 자료 보완이다. `coordinateLeader`는 빈 배열로 유지해 정답 좌표 라벨을 추가하지 않았다. 함수·수식·정의역·정답·item은 바꾸지 않았다. 재검사는 NOT_RUN이다.

Q21 sourceConditions objective notation is now lowercase `p` throughout, including `p(3/2)`; checker recheck remains NOT_RUN.


## 실제 final3 오류와 최소 정정

실제 `final3-corrected`에서 Q21은 빈 top-level `coordinateLeader` 배열로 `COORDINATE_LEADER_INVALID`가 발생했다. 현재 계약에 맞춰 빈 필드를 삭제하고 `graphPlan.coordinateBand: {"hide": ["M"]}`로 해당 좌표 숫자만 숨기며 점 및 exactCoordinates는 유지했다. 정답 좌표는 캡션 끝에만 두고, 함수·requiredPoint·수식·source·item·publish 수학은 바꾸지 않았다. 수정 후 재검사는 NOT_RUN이다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-19-35-043Z` / `q21-leader-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 fit_overview, specFor, semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/q21-leader-corrected/node-results-2026-11-09T00-19-35-043Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
