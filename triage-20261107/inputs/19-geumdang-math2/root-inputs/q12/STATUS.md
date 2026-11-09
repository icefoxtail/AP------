# 19 금당고 고2 수학II Q12 로컬 입력 초안

## 출처 결속
준비된 source-exact.js의 questionBank id 12을 sourcePath `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`, pinned main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`에 ordinal 12으로 결속했다. scope.json에서 Q12은 미완료(open), owner는 UNKNOWN으로 확인했다.

## 원문 문항 (정확 문자열)

~~~text
다항함수 $f(x)$가 다음 두 조건을 만족할 때, 정적분 $\displaystyle\int_{-1}^1(4x^3+2x+1)f(x),dx$의 값은?
(가) 모든 실수 $x$에 대하여 $f(-x)=f(x)$
(나) $\displaystyle\int_{-1}^0 f(x),dx=4$
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$0$
$2$
$4$
$6$
$8$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
$f(-x)=f(x)$이므로 $f$는 짝함수이다.
$4x^3+2x$는 홀함수이므로 그 곱을 대칭구간에서 적분한 값은 $0$이다.
또 짝함수에서
$\displaystyle\int_{-1}^1 f(x)\,dx=2\int_{-1}^0 f(x)\,dx=8$
따라서 주어진 적분값은 $8$이고 정답은 ⑤이다.
~~~

## 보조 도식 범위

수직선에는 적분구간의 끝점 −1, 1과 대칭의 중심 0만 표시한다. 특정 다항함수나 함수 그래프를 추가하지 않는다. 원문에서 주어진 4는 부호 있는 정적분값이며, 양의 함수값이나 넓이를 뜻하는 도식은 만들지 않는다.

캡션에서 홀함수 항의 상쇄와 짝함수 적분 관계를 설명해 대칭 구간이 답 8로 이어지는 이유를 연결한다.

요청 취지에 맞춰 주어진 함수 관계와 조건의 이해를 돕는 보조 수직선을 계획했다. 축과 점 라벨의 간격, 겹침 및 가독성은 렌더 전이라 검토하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 checker/engine validation, render, visual review, independent math review, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 원문, assets, engine, ledger/queue, protected questions, 다른 drafts 및 외부 상태는 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-11-15-018Z` / `original9-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 expandNumberLineFigure 입력 함수의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/original9-corrected/node-results-2026-11-09T00-11-15-018Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
