# 19 순천여고 고2 수학II Q06 로컬 입력 초안

## 출처 결속
source-exact.js의 questionBank id 6을 sourcePath `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`, pinned main `ed06a82af57c37509e09b36e60b0aa59660fd313`에 ordinal 6으로 결속했다. 행은 원본 q6.png를 `assets/images/19_순천여고_2학기_기말_고2_수학II/q6.png`로 참조한다. 본 작성자는 해당 이미지를 픽셀 검토하지 않았다 (NOT_RUN). 부모가 정식 위치 `archive/assets/images/19_순천여고_2학기_기말_고2_수학II/q6.png`의 blob `76e24a317bdb77f6678e3fdcf82d98ab2448ab72` (20,317 bytes)를 확인하고 직접 픽셀 검토했다고 전달했다. 앞서 본 작성자가 잘못된 경로 `assets/images/19_순천여고_2학기_기말_고2_수학II/q6.png`로 pinned main에서 수행한 읽기 전용 fetch는 GitHub API 404를 반환했다. 이 응답은 원본 파일의 부재나 저장소 접근 제한을 뜻하지 않는다. 재시도하지 않았고 이미지 파일을 변경하거나 대체하지 않았다.

## 원문 문항 (정확 문자열)

~~~text
함수 $y=f(x)$의 도함수 $y=f'(x)$의 그래프가 아래 그림과 같을 때, 옳은 것만을 보기에서 있는 대로 고른 것은?
ㄱ. $f(x)$는 $x=2$에서 극대이다.
ㄴ. $f(x)$는 구간 $(2,3)$에서 감소한다.
ㄷ. $f(x)$는 구간 $(3,5)$에서 증가한다. [4.2점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
ㄱ
ㄴ
ㄱ, ㄴ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
~~~

## 원문 정답 (정확 문자열)

~~~text
③
~~~

## 원문 해설 (정확 문자열)

~~~text
도함수 그래프가 $x=2$에서 양수에서 음수로 바뀌므로 $f$는 $x=2$에서 극대이다.
따라서 ㄱ은 참이다.
$2<x<3$에서 $f'(x)<0$이므로 $f$는 감소한다.
따라서 ㄴ은 참이다.
$3<x<5$에서는 $x=4$를 지나며 $f'(x)$의 부호가 음수에서 양수로 바뀐다.
구간 전체에서 증가하는 것은 아니므로 ㄷ은 거짓이다.
따라서 옳은 것은 ㄱ, ㄴ이고 정답은 ③이다.
~~~

## 보조 도식 범위

number-line-figure-v1의 숫자 영점 −1, 2, 4만 표시한다. 도함수 부호열 −,+,−,+ 및 원 해설에서 판정되는 f의 증감은 캡션에 적고, 도함수의 식이나 높이·곡선 모양은 만들지 않는다. 원본 그림 속 f′ 그래프를 대체하지 않는다. 수치 영점 라벨은 표시하고 점 이름은 숨긴다. 레이아웃/라벨 간격/리더는 렌더 전이라 검토하지 않았다.

요청 취지에 따라 함수 관계를 이해하는 데 도움이 되도록 도함수 영점과 부호 변화의 보조 시각화를 계획했다. 원본 q6.png는 source-bound item의 경로 참조로 보존했으며, 실제 이미지 bytes를 확인하거나 수정하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정 초안 파일만 작성했다. owner UNKNOWN. actual checker/engine validation, render, visual review, independent math review, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 원문, 원본 이미지 bytes, engine, assets, ledger/queue, 보호 문항 및 다른 draft는 수정하지 않았다. Hyocheon reference 거부는 재시도하거나 우회하지 않았다.


## 실제 입력 검사 기록 2026-11-08T23-36-32-215Z

이 문항의 현재 3 JSON과 고정 검사본의 SHA256이 일치하며, 검사 전후 바이트가 유지됐다. 아래 실제 실행한 입력 경로만 PASS이다.

- frozen_snapshot_binding: PASS
- item_source_binding: PASS
- source_exact_binding: PASS
- publish_fields: PASS
- expandNumberLineFigure: PASS

전체 독립 수학 검토와 원본 이미지 독립 재검수, engine.prepare/build/render, SVG/PNG 시각 확인, 배치·가독성 최종 검수, CI, 게시, 구현 인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY를 유지한다. 입력 PASS는 그림 완성이나 게시 완료가 아니다. 전체 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-input-only/reports/.
