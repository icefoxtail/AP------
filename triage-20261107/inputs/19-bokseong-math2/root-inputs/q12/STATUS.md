# 19 복성고 고2 수학II 2학기 기말 Q12 로컬 입력 초안

원문 결속: source main `6e86de46be4373c3773ad2479296739a5f4b3f49`; triage main `a94cd0ce7a3c5ac53b4ccbed61331cc65d7ef003`; 원본 경로 `archive/exams/original/high/h2/2final/19_복성고_2학기_기말_고2_수학II.js`; 준비본 `preparation-19-bokseong-math2/source-exact.js` (SHA-256 `8aac43a54712b66f2d146a2cc5f3743a526c34e7e646044457e6aa6e7516fb2a`, git blob `3913744bcac519140a34ab49fe37bd6519db40d7`). `item.json`은 원본 경로와 `ordinal: 12`로 해당 원문 행을 결속한다. owner: UNKNOWN.

## 원문 문항 (정확 문자열)

```text
다항함수 $f(x)$가 모든 실수 $x$에 대하여 $x^2f(x)=x^3+\displaystyle\int_0^x(x^2+t)f'(t),dt$를 만족시킨다. $f(0)=3$일 때, $f(2)$의 값은?
```

## 원문 선택지 (정확 문자열)

```text
$8$
$9$
$10$
$11$
$12$
```

## 원문 정답 (정확 문자열)

```text
②
```

## 원문 해설 (정확 문자열)

```text
적분에서 $x$는 상수로 두고 부분적분한다.
$\displaystyle\int_0^x(x^2+t)f'(t)\,dt$
$=x^2(f(x)-f(0))+xf(x)-\displaystyle\int_0^x f(t)\,dt$
$f(0)=3$을 대입해 주어진 식에 넣으면
$x^2f(x)=x^3+x^2f(x)-3x^2+xf(x)-\displaystyle\int_0^x f(t)\,dt$
따라서
$0=x^3-3x^2+xf(x)-\displaystyle\int_0^x f(t)\,dt$
양변을 미분하면
$0=3x^2-6x+xf'(x)$
$x\ne0$에서 $f'(x)=6-3x$이다.
$f(x)=6x-\dfrac32x^2+C$이고 $f(0)=3$이므로 $C=3$이다.
$f(2)=12-6+3=9$
정답은 ②이다.
```

## 시각 목적 및 계획

사용자 사유: 함수 그림은 풀이 이해에 도움이 되므로 해당 함수 관계를 정확히 보조한다. 이 입력은 원문·해설에서 정한 다항함수와 필요한 중간점을 그래프로 보인다. `sourceDomain: ALL_REALS`는 실제 정의역이며 `graphPlan.domain`/`viewport`는 초기 프레이밍 입력일 뿐 최종 렌더 창을 주장하지 않는다. 관심점은 필요한 점으로 보존하고 `coordinateLeader`는 실제 점에 연결한다. Q12의 요청된 좌표값 B=(2,9)는 점과 이름을 유지하되 `coordinateBand.hide`로 숫자 좌표만 숨긴다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. owner UNKNOWN. 입력 checker NOT_RUN, 엔진 검사 NOT_RUN, 렌더 NOT_RUN, 독립 수학 검토 NOT_RUN, 시각·가독성 검토 NOT_RUN, CI NOT_RUN, publication NOT_RUN, handoff NOT_RUN. 위 원문 문항·선택지·정답·해설은 준비본의 정확한 행에서 보존했다. 이 초안은 원문, 메타데이터, triage/queue 판정, 원본 자산, 다른 문항 패키지를 수정하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:43:20.429252+00:00: 최신 3종 JSON 바이트가 `2026-11-09T00-38-08-641Z` / `polynomial-final`의 성공 입력 SHA-256과 일치한다. sourcePath·ordinal·23문항 원문 결속, JSON/publish 계약, 실제 fit_overview/specFor/semantic_model.validate, critical/viewport, 축 제목·눈금 정적 경계 대조의 적용 가능한 검사 PASS. 단계별 근거는 `preparation-19-bokseong-math2/checker/recheck-input-only/reports/polynomial-final/node-results-2026-11-09T00-38-08-641Z.json`에 보존했다. 실제 COORDINATE_LABEL이 없는 검사는 N/A이며 PASS로 바꾸지 않았다.
입력 통과는 완성 그림·학생 이해·정답 노출·가독성·전체 독립 수학 검수의 통과가 아니다. 이전 실패/미검증·수정 전 파일·원문·기존 실물·검수 이력을 보존한다. render/prepare/build/CI/publication/handoff 및 전체 수학·시각 검수 NOT_RUN, owner UNKNOWN. LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 변경 없음.
