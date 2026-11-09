# 19 복성고 고2 수학II Q19 로컬 입력 초안

## 출처 결속
준비본 preparation-19-bokseong-math2/source-exact.js의 questionBank id 19을 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`, ordinal 19에 결속했다. 준비본 SHA-256은 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, Git blob은 `3913744bcac519140a34ab49fe37bd6519db40d7`이다. scope.json의 sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`, triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`에서 이 문항은 open이며 owner는 UNKNOWN이다. 원문·다른 입력 패키지·기존 Q08 SVG/원본 이미지와 Q14 PNG는 건드리지 않았다.

## 원문 문항 (정확 문자열)

~~~text
둘레의 길이가 $60,\mathrm{m}$인 원이 있다.
원 위를 움직이는 두 점 $P$, $Q$가 같은 점에서 동시에 출발하여 서로 반대방향으로 움직인다. 점 $P$는 시각 $t$에서 속도가 $1,\mathrm{m/s}$이고, 점 $Q$는 시각 $t$에서의 속도가 $t,\mathrm{m/s}$일 때, 출발한 후 세 번째 만나는 것은 몇 초 후인가?
~~~

## 원문 선택지 (정확 문자열)

~~~text
$12$
$14$
$16$
$18$
$20$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
서로 반대 방향으로 움직이므로 두 점 사이의 상대 속도는
$1+t$\,m/s
이다.
출발 후 $t$초 동안 상대적으로 움직인 거리는
$\displaystyle\int_0^t(1+u)\,du$
$=t+\dfrac{t^2}{2}$
세 번째 만남까지 상대 이동 거리는 원의 둘레의 세 배인
$3\cdot60=180$\,m
이다.
$t+\dfrac{t^2}{2}=180$
$t^2+2t-360=0$
$(t+20)(t-18)=0$
$t>0$이므로 $t=18$
정답은 ④이다.
~~~

## 시각 목적 및 계획
요청 취지: 함수 관계를 도식으로 보면 풀이 이해에 도움이 된다. 아래 입력은 원문 조건과 해설에 직접 근거한 관계만 담는다. 계획한 표지·라벨은 실제 입력에 적고, 지정된 좌표가 있는 도식에는 해당 핵심점의 coordinateLeader를 둔다. 대체로 짧고 읽을 수 있는 라벨을 사용하며, 실제 간격·겹침·가독성 검토는 아직 하지 않았다.

시간 t를 가로축, 누적 상대 이동 거리 d(t)=t+t²/2를 세로축에 둔다. A=(0,0)은 출발, B=(18,180)은 세 번째 만남이며 y=180 기준과의 교점으로 구별한다. 서로 다른 단위를 쓰므로 시간 축과 거리 축은 실제 문제에 맞는 독립 눈금으로 표시하고 캡션에 각 눈금 간격을 쓴다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 input checker, fit/spec, render, formal visual review, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 외부 쓰기·렌더·엔진 수정·삭제·원격 변경은 하지 않았다. checker 계약 지원 여부와 실제 표시 가독성은 아직 미확정이다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-35-24-550Z` / `relation`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/relation/node-results-2026-11-09T00-35-24-550Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
