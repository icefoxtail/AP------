# 20 매산고 고1 1학기 기말 Q16 로컬 입력 초안

## 원문 결속
원본 경로: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`. 원본 바이트는 SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, Git blob `830a02dfed7703f109a615015e658aadc3def794`이며 기준 main은 `ca13990f5ba49e16af134945e3c26bf35d7a89c5`이다. 로컬 exact input은 `preparation-20-maesan-h1-1final/source-exact.js` (50,573B, 같은 SHA-256)이다. `item.json`은 원본 경로와 ordinal `16`로 원문 행을 결속한다.

## 원문 문항 (정확 runtime 문자열)
```text
그림과 같이 두 변 $\overline{AB}, \overline{BC}$의 길이가 각각 $2, 3$이고 $\angle ABC=90^\circ$인 직각삼각형 $ABC$가 있다. 세 변 $\overline{AB}, \overline{BC}, \overline{CA}$를 $t:(1-t)$로 내분하는 점을 각각 $P,Q,R$라 할 때, 삼각형 $PQR$의 넓이는 $t=\alpha$일 때 최솟값 $S$를 갖는다. $S\times\alpha$의 값은? (단, $0<t<1$) [5점]
```

## 원문 선택지 (정확 runtime 문자열)
```text
(없음)
```

## 원문 정답 (정확 runtime 문자열)
```text
$\dfrac38$
```

## 원문 해설 (정확 runtime 문자열)
```text
좌표를 $A=(0,2), B=(0,0), C=(3,0)$으로 두면
$[ABC]=\frac12\cdot2\cdot3=3$이다.
내분비 $t:(1-t)$에서 전체 비는 $t+(1-t)=1$이므로 각 변에서
$AP/AB=t, PB/AB=1-t, BQ/BC=t, QC/BC=1-t, CR/CA=t, RA/CA=1-t$이다.
같은 끼인각을 갖는 두 삼각형의 넓이비는 양쪽 변의 비를 곱한 값이다.
따라서
$[APR]/[ABC]=(AP/AB)(AR/AC)=t(1-t)$
$[PBQ]/[ABC]=(PB/AB)(BQ/BC)=(1-t)t$
$[QCR]/[ABC]=(QC/BC)(CR/CA)=(1-t)t$
가운데 삼각형은 세 꼭짓점의 작은 삼각형을 뺀 나머지이므로
$S=3(1-3t(1-t))$
$S=9t^2-9t+3$
완전제곱식으로 바꾸면
$S=9(t^2-t)+3$
$S=9\left((t-\frac12)^2-\frac14\right)+3$
$S=9(t-\frac12)^2+\frac34$
$0<t<1$에서 $t=1/2$가 가능하고 제곱항의 최솟값은 0이다.
따라서 $\alpha=1/2$일 때 $S=3/4$이며
$S\alpha=\frac34\cdot\frac12=\frac38$이다.
```

## 대체 그림의 범위와 이해 도움
저장된 해설의 정확한 좌표 실현으로 원래 직각삼각형의 변 길이를 보존하고, 최솟값 위치 t=1/2에서 P, Q, R을 실제 중점 작도로 만든다. 변 분할과 안쪽 삼각형의 형태가 함께 보여 최소가 되는 사례를 이해하기 쉽다. 일반 t의 그림은 아니다.

## 점 이름·좌표 라벨 및 공간 계획
A, B, C, P, Q, R 이름만 표시하고 좌표 수치는 노출하지 않는다. 384×320 축 없는 평면 도식으로 수용하고 별도 coordinateLabels/coordinatePanel은 쓰지 않는다.

## 상태
LOCAL_ONLY / DRAFT_ONLY / NOT_READY. JSON parse 및 현행 `construction.validate/execute` 로컬 실행 PASS. 통합 입력 checker, `phase2.specFor`, semantic/viewport, render, independent full-math review, visual review, CI, publication, handoff 모두 NOT_RUN. 원격 쓰기 0회.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `d659001712ed31dd2f035b451397bbb21f7f311b37ee2116418165e6e3166e7e`, `09049e0eb8fe015da510ec8e2df9d1cb31d237ca5c54927e50b58d8dba28c046`, `a7b612a289602c9f69ccf1e3ab3c4d1d67203577904499f6446a99f3992ef085`로 동결된 `mixed-first` / `2026-11-09T01-24-17-833Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
