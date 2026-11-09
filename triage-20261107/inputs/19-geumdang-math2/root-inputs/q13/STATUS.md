# 19 금당고 고2 수학II Q13 로컬 입력 초안

## 출처 결속
준비된 source-exact.js의 questionBank id 13을 sourcePath `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`, pinned main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`에 ordinal 13으로 결속했다. scope.json에서 Q13은 미완료(open), owner는 UNKNOWN으로 확인했다.

## 원문 문항 (정확 문자열)

~~~text
실수 전체의 집합에서 정의된 함수 $f(x)=-x^3+2ax^2+ax$가 일대일함수가 되기 위한 상수 $a$의 최솟값은? [4.8점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$-\dfrac{10}{4}$
$-\dfrac{9}{8}$
$-1$
$-\dfrac{7}{8}$
$-\dfrac{3}{4}$
~~~

## 원문 정답 (정확 문자열)

~~~text
⑤
~~~

## 원문 해설 (정확 문자열)

~~~text
삼차함수가 일대일이려면 전 구간에서 단조이어야 한다. 최고차항이 $-x^3$이므로 도함수는 항상 $0$ 이하이어야 한다.
$f'(x)=-3x^2+4ax+a$
이 이차식의 판별식이 $0$ 이하이면
$(4a)^2-4(-3)a\le0$
$4a(4a+3)\le0$
$-\dfrac34\le a\le0$
이 구간의 최솟값은 $-\dfrac34$이므로 정답은 ⑤이다.
~~~

## 보조 도식 범위

닫힌 수직선 구간은 일대일 조건을 만족하는 매개변수 전체 −3/4≤a≤0을 나타낸다. 양 끝 경계에서는 f′가 한 점에서만 0이고 그 밖에는 음수이므로 단조성과 일대일성은 유지된다.

정답인 최솟값 −3/4와 허용 매개변수 전체를 구분하도록 캡션에 범위와 질문의 목적을 함께 적는다.

요청 취지에 맞춰 주어진 함수 관계와 조건의 이해를 돕는 보조 수직선을 계획했다. 축과 점 라벨의 간격, 겹침 및 가독성은 렌더 전이라 검토하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 checker/engine validation, render, visual review, independent math review, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 원문, assets, engine, ledger/queue, protected questions, 다른 drafts 및 외부 상태는 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-11-15-018Z` / `original9-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 expandNumberLineFigure 입력 함수의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/original9-corrected/node-results-2026-11-09T00-11-15-018Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
