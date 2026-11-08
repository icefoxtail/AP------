# 19 순천여고 고2 수학II Q19 로컬 입력 초안

원문 결속: main `ed06a82af57c37509e09b36e60b0aa59660fd313`; source `preparation-19-suncheongirls-math2/source-exact.js` (SHA-256 `08bd5c35d33b3c5795a147f6decdca388747ba08208714aa1e280759afc44ea6`); 원본 경로 `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`; `item.json`은 `sourcePath`와 `ordinal: 19`로 결속한다. 소유자는 UNKNOWN. 사용자가 전한 작성 이유는 함수의 시각적 표현이 이해에 도움이 된다는 것이다. 원본 문항·자산·기존 이력은 보존했다.

## 원문 문항 (정확 문자열)

~~~text
[서술형1] 닫힌구간 $[0,4]$에서 함수 $f(x)=-x^3+6x^2-9x+5$의 최댓값과 최솟값을 구하시오. [4점]
~~~

## 원문 선택지 (정확 문자열)

~~~text
없음 (원문 choices 배열은 빈 배열)
~~~

## 원문 정답 (정확 문자열)

~~~text
$5, 1$
~~~

## 원문 해설 (정확 문자열)

~~~text
닫힌구간의 내부에서 극값 후보를 찾는다.
$f'(x)=-3x^2+12x-9=-3(x-1)(x-3)$
임계점은 $x=1,3$이다.
끝점과 임계점에서의 함숫값은
$f(0)=5$
$f(1)=-1+6-9+5=1$
$f(3)=-27+54-27+5=5$
$f(4)=-64+96-36+5=1$
따라서 최댓값은 $5$, 최솟값은 $1$이다.
~~~

## 도식 초안

도식은 닫힌 구간 `[0,4]`에서 정확한 세로축 평행이동 `u(x)=f(x)−1=−x³+6x²−9x+4`를 그린다. 그래프의 네 점 A(0,4), B(1,0), C(3,4), D(4,0)은 `u`의 좌표이고 원래 함수값 5,1,5,1과 연결된다. 캡션은 평행이동을 숨기지 않고 `f=u+1`로 역변환하여 원문의 최댓값 5와 최솟값 1을 복원한다. 원래 함수 f를 그대로 그린 것처럼 라벨링하지 않는다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 checker 입력 검사 pending; render, full math review, visual review, CI, publication, handoff는 NOT_RUN. 준비된 네 파일은 item.json, plan.json, publish.json, STATUS.md뿐이다. source/assets/기존 history/ledger/queue, 보호된 문항 및 다른 draft는 수정하지 않았다. 원격 쓰기와 렌더는 수행하지 않았다.


## 실제 입력 검사 기록 2026-11-08T23-36-32-215Z

이 문항의 현재 3 JSON과 고정 검사본의 SHA256이 일치하며, 검사 전후 바이트가 유지됐다. 아래 실제 실행한 입력 경로만 PASS이다.

- frozen_snapshot_binding: PASS
- item_source_binding: PASS
- source_exact_binding: PASS
- publish_fields: PASS
- fit_overview: PASS
- specFor: PASS
- source_domain_preserved_during_fit: PASS
- semantic_model.validate: PASS
- exact_coordinate_per_coordinate_label: NOT_APPLICABLE_NO_COORDINATE_LABEL
- axis_title_plain_max10: PASS
- engine_critical_construction: PASS
- viewport.for_spec: PASS
- engine_axis_tick_guard: PASS
- fit_spec_tick_static_match: PASS

전체 독립 수학 검토와 원본 이미지 독립 재검수, engine.prepare/build/render, SVG/PNG 시각 확인, 배치·가독성 최종 검수, CI, 게시, 구현 인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY를 유지한다. 입력 PASS는 그림 완성이나 게시 완료가 아니다. 전체 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-input-only/reports/.
