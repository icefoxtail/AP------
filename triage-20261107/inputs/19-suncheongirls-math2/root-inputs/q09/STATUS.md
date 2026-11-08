# 19 순천여고 고2 수학II Q09 로컬 입력 초안

## 출처 결속
source-exact.js의 questionBank id 9을 sourcePath `archive/exams/original/high/h2/2final/19_순천여고_2학기_기말_고2_수학II.js`, pinned main `ed06a82af57c37509e09b36e60b0aa59660fd313`에 ordinal 9로 결속했다. owner는 UNKNOWN이다.

## 원문 문항 (정확 문자열)

~~~text
키가 $1.7\,\mathrm{m}$인 사람이 지상 $3.4\,\mathrm{m}$ 높이의 가로등 바로 밑에서 $1.5\,\mathrm{m/s}$의 속도로 일직선으로 걸어갈 때, 이 사람의 그림자의 길이의 변화율은? [4.4점]
~~~

## 원문 선택지 (원본 배열 순서, 정확 문자열)

~~~text
$1\,\mathrm{m/s}$
$1.5\,\mathrm{m/s}$
$2\,\mathrm{m/s}$
$2.5\,\mathrm{m/s}$
$3\,\mathrm{m/s}$
~~~

## 원문 정답 (정확 문자열)

~~~text
②
~~~

## 원문 해설 (정확 문자열)

~~~text
가로등에서 사람까지의 거리를 $x$ m, 그림자 길이를 $y$ m라 하자.
사람과 그림자 끝을 잇는 직각삼각형은 높이 $1.7$이고 밑변이 $y$이며, 가로등과 그림자 끝을 잇는 삼각형은 높이 $3.4$이고 밑변이 $x+y$이다.
닮음비에서
$\dfrac{3.4}{x+y}=\dfrac{1.7}{y}$
$3.4y=1.7x+1.7y$
$y=x$
시간에 대해 미분하면
$\dfrac{dy}{dt}=\dfrac{dx}{dt}$
사람의 속도가 $1.5\,\mathrm{m/s}$이므로
$\dfrac{dy}{dt}=1.5\,\mathrm{m/s}$
따라서 그림자 길이의 변화율은 $1.5\,\mathrm{m/s}$이다.
~~~

## 보조 도식 범위와 계약 공백

부분 도식은 현행 number-line-figure-v1 경로로 지면 위치 A(가로등 밑), B(사람), C(그림자 끝)의 순서만 나타낸다. A, B, C는 좌표가 없는 symbolic points이며 순서는 A-B-C다. 선 위의 배치는 실제 수평 거리, 좌표, 길이 비율을 나타내지 않는다. 원문의 두 닮음삼각형은 높이 3.4 m, 1.7 m 및 밑변 x+y, y를 두고 닮음비 3.4/(x+y)=1.7/y를 쓰지만, 이 초안은 축척으로 오해될 가상 삼각형이나 수평 좌표를 만들지 않고 정확한 관계를 캡션에만 둔다. 따라서 닮음삼각형 자체는 미표현이며 시각 계약 공백이 남는다.

요청 취지에 따라 변화율 이해에 도움이 되는 안전한 부분 시각화를 계획했다. 리더는 필요하지 않은 단순 순서선이다. A-B-C 간격과 라벨 간격은 렌더 전이라 검토하지 않았다.

## 상태

LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 지정 초안 파일만 작성했다. actual checker/engine validation, render, visual review, independent math review, CI, publication, handoff는 NOT_RUN이며 PASS를 주장하지 않는다. 원문, assets, engine, ledger/queue, 보호 문항 및 다른 draft는 수정하지 않았다. Hyocheon reference 거부는 재시도하거나 우회하지 않았다.


## 시간 범위 보완

기존 네 파일의 수정 전 사본은 `preparation-19-suncheongirls-math2/corrections/q09-before-time-scope/`에 보존했다. A-B-C 순서 부분도와 닮음비는 출발 후 `t>0`일 때만 적용한다. 출발 순간 `t=0`에는 `x=y=0`이라 세 지면점의 엄격한 순서가 없고, `3.4/(x+y)=1.7/y`는 분모 `y=0`으로 정의되지 않으므로 그 순간은 닮음비 관계에서 제외한다. 수식·수치·item.json은 바꾸지 않았다. 실제 checker 및 렌더/검토는 NOT_RUN이다.


## 실제 입력 검사 및 최소 정정 기록

실제 첫 입력 검사에서 Q09의 `expandNumberLineFigure`가 `NUMBER_LINE_POINTS_INVALID`로 실패했다. number-line-v1.mjs 469–474에서 값 없는 symbolic point는 소문자 `SYMBOL_ID`를 요구하고 `name`, `hideName`, `showValue`, `valueSide`를 허용하지 않기 때문이다. 검사 전 네 파일을 `preparation-19-suncheongirls-math2/corrections/before-input-fix/q09/`에 보존했다. 최소 정정으로 symbolic IDs와 order 및 설명의 점 이름 `A, B, C`만 `a, b, c`로 바꿨다. 수식, 수치, `t>0` 시간 범위, 순서 및 `item.json`은 유지했다. 수정 후 재검사, render, visual review는 NOT_RUN이다.


## 수정 후 실제 입력 검사 2026-11-08T23-41-25-742Z

최초 실패와 수정 전 파일을 보존한 채 수정 입력으로 한 차례 재검사했다. 현재 3 JSON이 고정 검사본과 일치하고 검사 전후 바이트가 유지됐다.

- frozen_snapshot_binding: PASS
- item_source_binding: PASS
- source_exact_binding: PASS
- publish_fields: PASS
- expandNumberLineFigure: PASS

전체 독립 수학 검토·원본 이미지 독립 재검수·engine.prepare/build/render·SVG/PNG 시각 확인·최종 배치와 가독성 검수·CI·게시·인계는 NOT_RUN이다. LOCAL_ONLY / DRAFT_ONLY / NOT_READY 유지. 입력 PASS는 실물 완료가 아니다. 원본 결과: preparation-19-suncheongirls-math2/checker/recheck-corrected-four/reports/.
