# 19 복성고 고2 수학II Q10 로컬 입력 초안

## 출처 결속
준비본 preparation-19-bokseong-math2/source-exact.js의 questionBank id 10을 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`, ordinal 10에 결속했다. 준비본 SHA-256은 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, Git blob은 `3913744bcac519140a34ab49fe37bd6519db40d7`이다. scope.json의 sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`, triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`에서 이 문항은 open이며 owner는 UNKNOWN이다. 원문·다른 입력 패키지·기존 Q08 SVG/원본 이미지와 Q14 PNG는 건드리지 않았다.

## 원문 문항 (정확 문자열)

~~~text
다음 중 함수 $f'(x)=4x^3+6x^2+2ax$일 때, $f(x)$가 단 하나의 극값을 가질 때의 $a$의 값을 모두 고르면?
~~~

## 원문 선택지 (정확 문자열)

~~~text
$-2$
$-1$
$0$
$1$
$2$
~~~

## 원문 정답 (정확 문자열)

~~~text
③, ⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
극값은 $f'(x)$의 부호가 바뀌는 점에서 생긴다.
$f'(x)=4x^3+6x^2+2ax=2x(2x^2+3x+a)$
$a=2$이면 이차식의 판별식은
$3^2-4\cdot2\cdot2=-7<0$
이므로 $x=0$만 부호가 바뀌어 극값은 하나이다.
$a=0$이면
$f'(x)=2x^2(2x+3)$
$x=0$은 중근이라 부호가 바뀌지 않고, $x=-\dfrac32$에서만 부호가 바뀌므로 극값은 하나이다.
$a=-2,-1,1$에서는 이차식의 두 근이 서로 다르고 $0$이 아니다. 따라서 $f'(x)$에는 서로 다른 단순근이 세 개 있어 극값이 세 개 생긴다.
해당하는 값은 $a=0,2$이므로 정답은 ③, ⑤이다.
~~~

## 시각 목적 및 계획
요청 취지: 함수 관계를 도식으로 보면 풀이 이해에 도움이 된다. 아래 입력은 원문 조건과 해설에 직접 근거한 관계만 담는다. 계획한 표지·라벨은 실제 입력에 적고, 지정된 좌표가 있는 도식에는 해당 핵심점의 coordinateLeader를 둔다. 대체로 짧고 읽을 수 있는 라벨을 사용하며, 실제 간격·겹침·가독성 검토는 아직 하지 않았다.

두 패널에 source에서 정해지는 f′만 각각 그린다: a=0일 때 4x³+6x², a=2일 때 4x³+6x²+4x. 각 패널의 x축 위/아래 부호가 근의 단순성·중복성과 일치한다. 일반 a의 곡선이나 f의 불명확한 곡선은 그리지 않는다. 좌표 지시선은 표시된 근·극값 점에만 둔다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 input checker, fit/spec, render, formal visual review, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 외부 쓰기·렌더·엔진 수정·삭제·원격 변경은 하지 않았다. checker 계약 지원 여부와 실제 표시 가독성은 아직 미확정이다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-35-24-550Z` / `relation`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 compositePanels와 두 패널 각각의 fit/spec/semantic/viewport/축 검사의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/relation/node-results-2026-11-09T00-35-24-550Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
