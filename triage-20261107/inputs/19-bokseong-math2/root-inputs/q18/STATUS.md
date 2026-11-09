# 19 복성고 고2 수학II Q18 로컬 입력 초안

## 출처 결속
준비본 preparation-19-bokseong-math2/source-exact.js의 questionBank id 18을 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`, ordinal 18에 결속했다. 준비본 SHA-256은 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, Git blob은 `3913744bcac519140a34ab49fe37bd6519db40d7`이다. scope.json의 sourceMain `6e86de46be4373c3773ad2479296739a5f4b3f49`, triageMain `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`에서 이 문항은 open이며 owner는 UNKNOWN이다. 원문·다른 입력 패키지·기존 Q08 SVG/원본 이미지와 Q14 PNG는 건드리지 않았다.

## 원문 문항 (정확 문자열)

~~~text
함수 $f(x)$가 모든 실수 $x$에 대하여 $f(-x)=f(x)$를 만족시키고 $\displaystyle\int_0^1 f(x),dx=4$일 때, 정적분 $\displaystyle\int_{-1}^1\left(x^5-2x^3+\dfrac{1}{2}\right)f(x),dx$의 값은?
~~~

## 원문 선택지 (정확 문자열)

~~~text
$0$
$1$
$2$
$4$
$8$
~~~

## 원문 정답 (정확 문자열)

~~~text
④
~~~

## 원문 해설 (정확 문자열)

~~~text
$f(-x)=f(x)$이므로 $f$는 우함수이다.
따라서 $(x^5-2x^3)f(x)$는 홀함수이고
$\displaystyle\int_{-1}^1(x^5-2x^3)f(x)\,dx=0$
상수항의 적분은
$\dfrac12\displaystyle\int_{-1}^1 f(x)\,dx=\dfrac12\cdot2\displaystyle\int_0^1f(x)\,dx$
$=\displaystyle\int_0^1f(x)\,dx=4$
따라서 주어진 정적분은 4이다.
정답은 ④이다.
~~~

## 시각 목적 및 계획
요청 취지: 함수 관계를 도식으로 보면 풀이 이해에 도움이 된다. 아래 입력은 원문 조건과 해설에 직접 근거한 관계만 담는다. 계획한 표지·라벨은 실제 입력에 적고, 지정된 좌표가 있는 도식에는 해당 핵심점의 coordinateLeader를 둔다. 대체로 짧고 읽을 수 있는 라벨을 사용하며, 실제 간격·겹침·가독성 검토는 아직 하지 않았다.

수직선에 적분구간의 끝점 −1, 1과 대칭 중심 0만 둔다. f의 구체적 식이나 양성·곡선 모양을 가정하지 않는다. 홀함수 항의 상쇄와 우함수 적분 관계는 캡션에서 설명한다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 input checker, fit/spec, render, formal visual review, 독립 수학 검토, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 외부 쓰기·렌더·엔진 수정·삭제·원격 변경은 하지 않았다. checker 계약 지원 여부와 실제 표시 가독성은 아직 미확정이다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-35-24-550Z` / `relation`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 expandNumberLineFigure 입력 함수의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/relation/node-results-2026-11-09T00-35-24-550Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
