# 19 복성고 고2 수학II 2학기 기말 Q20 로컬 입력 초안

원문 결속: sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`; triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 현재 refs-baseline main `b5c94b62ed06ccd095a6797939ab8c014603c406`. 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, byte length 44560, Git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). `item.json`은 sourcePath와 ordinal 20로 정확한 원문 행에 결속한다. owner: UNKNOWN.

사용자 취지: 함수·영역·극값 관계를 그림으로 보조해 풀이 이해를 돕되, 원문과 기존 검수 자산·이력을 보존한다. 이 초안은 지정 문항 하나의 2D 시각 입력만 로컬에 준비하며 원문·메타·기존 검수·원격 기록은 수정하지 않는다.

## 원문 문항 (정확 문자열)

~~~text
서술형 문제 1. [4점]
지면에서 $24,\mathrm{m/s}$의 속도로 지면과 수직하게 위로 쏘아 올린 물체의 $t$초 후의 높이를 $x,\mathrm{m}$라 하면
$x=24t-3t^2$
인 관계가 성립한다고 한다. (단위 생략해도 점수 인정)
(1) 물체가 최고 높이에 도달할 때까지 걸린 시간과 그때의 높이를 구하시오. (2점)
(2) 물체가 지면에 떨어지는 순간의 속도를 구하시오. (2점)
~~~

## 원문 선택지 (정확 문자열)

~~~text
원문 choices: [] (선택지 없음)
~~~

## 원문 정답 (정확 문자열)

~~~text
(1) 4초, 48m  (2) -24m/s (아래 방향)
~~~

## 원문 해설 (정확 문자열)

~~~text
높이는 $x(t)=24t-3t^2$이다.
$x'(t)=24-6t$
최고점에서 $x'(t)=0$이므로
$24-6t=0$, $t=4$
이때 높이는
$x(4)=24\cdot4-3\cdot4^2=96-48=48$\,m
물체가 지면에 닿을 때는
$24t-3t^2=3t(8-t)=0$
$t>0$이므로 $t=8$이다.
속도는
$v(t)=x'(t)=24-6t$
$v(8)=24-48=-24$\,m/s
따라서 속도는 아래 방향으로 $24$\,m/s이다.
~~~

## 수학 근거와 시각 계획

원문의 높이–시간 관계 h(t)=24t−3t²은 0≤t≤8에서 표시한다. 수평축은 시간 t(초), 수직축은 높이 h(t)(m)이다. 최고점은 (t,h)=(4,48)이고 지면 도달은 t=8이다. 속도는 높이 그래프의 세로좌표가 아니라 도함수 h′(t)=24−6t이다. 화면 표시에서는 높이축 1m의 길이를 시간축 1초의 1/6로 한다. 지면에 닿는 순간의 속도는 −24m/s, 아래 방향이다.

- 원문 높이는 x=24t−3t²이고 비행 시간은 [0,8]이다. 그림은 x를 수평축 변수로 오인하지 않도록 원문의 시간 t와 높이 h(t)를 축에 표시한다.
- h′(t)=24−6t이므로 꼭짓점은 t=4, 높이 48이며 지면 도달은 t=8, h=0이다. 속도는 h′(8)=−24m/s이고 아래 방향이다.
- 높이 x와 시간 t는 서로 다른 양이다. y축은 높이 h(t), x축은 시간 t이며 속도 −24는 그래프의 높이 좌표가 아니다.



## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 수학 수치와 시각 계획은 ROOT가 전달한 승인 계산 근거를 반영했으나 독립 수학 검수 NOT_RUN. input checker NOT_RUN, render NOT_RUN, 독립 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 원문 content/choices/answer/solution, triage 이력, 원본 자산(보호 Q08 SVG 및 Q14 PNG 포함), 다른 문항 draft, 원격 기록은 변경하지 않았다. 이 폴더 외 파일 수정 없음.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-37-08-849Z` / `interval-first`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/interval-first/node-results-2026-11-09T00-37-08-849Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
