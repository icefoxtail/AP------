# 20 매산고 고1 1학기 기말 Q19 로컬 입력 초안

## 원문 결속
원본 경로: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`. 원본 바이트는 SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, Git blob `830a02dfed7703f109a615015e658aadc3def794`이며 기준 main은 `ca13990f5ba49e16af134945e3c26bf35d7a89c5`이다. 로컬 exact input은 `preparation-20-maesan-h1-1final/source-exact.js` (50,573B, 같은 SHA-256)이다. `item.json`은 원본 경로와 ordinal `19`로 원문 행을 결속한다.

Q19 원본 JS의 해설 문자열에는 apostrophe가 유효한 `\x27` escape로 들어 있으며, 아래는 그 runtime 문자열이다. 원본 파일과 escape를 수정하지 않았다.

## 원문 문항 (정확 runtime 문자열)
```text
1) $\overline{AB}=4$, $\overline{BC}=6$인 직사각형 $ABCD$에서 변 $BC$ 위에 $\overline{BE}=1$인 점 $E$와 변 $AD$의 중점 $F$를 잡는다. 선분 $EF$에 대하여 직사각형 $ABCD$를 그림과 같이 접었을 때, 대각선 $AC$의 일부가 이동하여 생기는 새로운 선분과 변 $AB$가 만나는 점을 $P$라 하자. 선분 $\overline{BP}$의 길이는? [10점]
```

## 원문 선택지 (정확 runtime 문자열)
```text
(없음)
```

## 원문 정답 (정확 runtime 문자열)
```text
$\dfrac{56}{17}$
```

## 원문 해설 (정확 runtime 문자열)
```text
좌표를 $B=(0,0),\ A=(0,4),\ C=(6,0),\ D=(6,4)$로 둔다.
그러면 $E=(1,0),\ F=(3,4)$이고 접는 선 $EF$의 방정식은 $y=2x-2$이다.
대각선 $AC$의 방정식은 $y=4-\dfrac23x$이므로 두 선의 교점은
$X=\left(\dfrac94,\dfrac52\right)$이다.

그림에서는 C가 있는 쪽이 접히므로, 접힌 뒤 대각선의 C 쪽 부분 $XC$는 $XC'$가 된다. C에서 접는 선에 내린 수선의 발을 M이라 하자. 접는 선의 기울기는 2이므로 수선의 기울기는 $-\dfrac12$이다.
$y=-\dfrac12(x-6)$과 $y=2x-2$를 풀면 $M=(2,2)$이다.
접는 선은 점과 그 반사된 점을 잇는 선분의 수직이등분선이므로 M은 $CC'$의 중점이다. 따라서
$C'=(2\cdot2-6,\ 2\cdot2-0)=(-2,4)$이다.

새 선분 $XC'$의 기울기는
$\dfrac{4-\frac52}{-2-\frac94}=-\dfrac6{17}$이다.
직선 $XC'$의 방정식은
$y-\dfrac52=-\dfrac6{17}\left(x-\dfrac94\right)$이다.
$-2<0<\dfrac94$이므로 $x=0$에서 선분 $XC'$과 만난다. 이때
$y=\dfrac52+\dfrac{27}{34}=\dfrac{56}{17}$이다.
$0<\dfrac{56}{17}<4$이므로 $P=\left(0,\dfrac{56}{17}\right)$는 선분 $AB$ 위에 있다. 따라서
$\overline{BP}=\dfrac{56}{17}$이다.
```

## 대체 그림의 범위와 이해 도움
원래 직사각형의 정확한 길이 좌표 실현을 쓰고 E/F/X/G/P를 각각 division, midpoint, line intersection, line reflection, line intersection으로 도출하며 G는 원문의 C′를 뜻한다. 원래 AC와 접힌 뒤 XC′를 별도 선분으로 그리고 M의 반사 중점·수직 관계를 표시한다.

## 점 이름·좌표 라벨 및 공간 계획
A, B, C, D, E, F, X, G(원문의 C′), M, P의 이름만 둔다. 요구된 BP는 P의 좌표 라벨로 노출하지 않고 캡션 끝에서 답한다. 560×440 축 없는 평면 캔버스로 두 대각선과 반사 보조선을 분리한다.

## 상태
LOCAL_ONLY / DRAFT_ONLY / NOT_READY. JSON parse 및 현행 `construction.validate/execute` 로컬 실행 PASS. 통합 입력 checker, `phase2.specFor`, semantic/viewport, render, independent full-math review, visual review, CI, publication, handoff 모두 NOT_RUN. 원격 쓰기 0회.


## Final-six semantic/critical failure and minimal correction — 2026-11-09

The final-six actual checks reported `semantic_model.validate=FAIL` and `engine_critical_construction=FAIL`, both with `DUPLICATE_OBJECT_ID:EFfold`. The sole reported colliding ID was `EFfold`: the math-plan `LINE_THROUGH` node for fold line EF and the displayed `displaySegments` segment EF used the same object ID. Construction validation/execution, displayGeometryInventory and specFor passed. Minimal correction: rename only the displayed segment ID to `EFsegment` and update its sourceConditions mappedTo reference to `displaySegments.EFsegment`; retain the `mathPlan.nodes.EFfold` line node, all math and geometry, and segment endpoints unchanged. Integrated tests were not rerun, as directed.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `de05173d6af6ceef27d220fccae89241ca2789589524a5da2c1364a1ab3624c2`, `2f442745c806c930b2f1dd9b1138a18510591fb124c4c2be2f22c2a0f85d677e`, `42898ad8584af1913df8912c7c2870ae65229e12aaf57dce4b3e6bc7c5a2092d`로 동결된 `geometry-repaired` / `2026-11-09T01-32-42-901Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual construction wire/bind/validate/execute/provenance/display inventory/specFor and engine input checks의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
