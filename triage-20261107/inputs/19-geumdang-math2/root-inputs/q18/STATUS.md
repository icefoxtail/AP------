# 19 금당고 고2 수학II Q18 로컬 입력 초안

## 출처 결속
준비된 source-exact.js의 questionBank id 18을 sourcePath `archive/exams/original/high/h2/2final/19_금당고_2학기_기말_고2_수학II.js`, pinned main `7c38ac22d0c7e0a37f49e729cb7b6f555b1d89b6`에 ordinal 18으로 결속했다. scope.json에서 Q18은 미완료(open), owner는 UNKNOWN으로 확인했다.

## 원문 문항 (정확 문자열)

~~~text
다음 조건을 만족시키는 두 자연수 $m,n$의 모든 순서쌍 $(m,n)$의 개수는?
(가) $m-n\le 20$
(나) 함수 $f(x)=6x^2-2mx+3n$에 대하여 함수 $g(x)=\displaystyle\int_0^x(x-t)f(t),dt$가 $x=2$에서 극댓값을 갖는다. [6.0점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$10$
$15$
$20$
$25$
$30$
~~~

## 원문 정답 (정확 문자열)

~~~text
②
~~~

## 원문 해설 (정확 문자열)

~~~text
원문 PDF의 조건은 $x=2$에서 극댓값을 갖는다는 뜻이다.
$g'(x)=\displaystyle\int_0^x f(t)\,dt$이므로
$g'(2)=16-4m+6n=0$
$2m-3n=8$
따라서 $n=2k$, $m=4+3k$이다. 자연수 조건에서 $k\ge1$이고
$m-n=4+k\le20$이므로 $k\le16$이다.
극댓값이 되려면
$g''(2)=f(2)=24-4m+3n=8-6k<0$
이므로 $k\ge2$이다.
$k=2,3,\ldots,16$의 $15$가지 순서쌍이 있으므로 정답은 ②이다.
~~~

## 보조 도식 범위

수직선은 실수 구간 전체를 해로 표시하는 것이 아니라 k가 정수라는 조건 아래 2≤k≤16에 놓인 정수점만 강조한다.

변수 치환 m=4+3k, n=2k와 정수 개수 15는 캡션으로 설명하며, m,n 순서쌍을 축의 값처럼 꾸며내지 않는다.

요청 취지에 맞춰 주어진 함수 관계와 조건의 이해를 돕는 보조 수직선을 계획했다. 축과 점 라벨의 간격, 겹침 및 가독성은 렌더 전이라 검토하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정된 item.json, plan.json, publish.json, STATUS.md만 작성했다. owner UNKNOWN. 실제 checker/engine validation, render, visual review, independent math review, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 원문, assets, engine, ledger/queue, protected questions, 다른 drafts 및 외부 상태는 수정하지 않았다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T00:21:43.173110+00:00: 현행 3종 JSON 바이트는 `2026-11-09T00-11-15-018Z` / `original9-corrected`의 성공 입력과 SHA-256이 일치한다. sourcePath·ordinal·21문항 원문 결속, JSON/publish 계약 및 실제 expandNumberLineFigure 입력 함수의 적용 가능한 검사 PASS. 자세한 단계는 `preparation-19-geumdang-math2/checker/recheck-input-only/reports/original9-corrected/node-results-2026-11-09T00-11-15-018Z.json`에 보존한다. 이는 입력 단계 통과이며 학생용 결과물 완료 판정이 아니다.
실제 COORDINATE_LABEL이 없는 경우 exact_coordinate 단계는 NOT_APPLICABLE이며 성공으로 바꾸지 않는다. 앞선 실패와 수정 전 파일·원문·검수 이력은 그대로 보존한다. 정답 노출·가독성·학생 화면 및 전체 독립 수학 검수는 미평가다. render/build/prepare/CI/publication/handoff NOT_RUN, owner UNKNOWN, LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 원격 쓰기·렌더·엔진 수정 없음.
