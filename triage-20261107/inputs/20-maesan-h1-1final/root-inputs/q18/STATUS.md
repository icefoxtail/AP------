# 20 매산고 고1 1학기 기말 Q18 로컬 입력 초안 — 제곱 좌표 대안

출처 결속: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 18; source main `ca13990f5ba49e16af134945e3c26bf35d7a89c5`, prepared source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, source git blob `830a02dfed7703f109a615015e658aadc3def794`. `item.json`은 위 원문 경로와 ordinal로 해당 런타임 행에 결속한다. 소유자는 `UNKNOWN`.

## 원문 문항 (정확 문자열)

```text
그림과 같이 직선 $y=nx$가 두 원 $x^2+(y-4)^2=1$, $(x-k)^2+y^2=9$와 모두 만나지 않도록 하는 자연수 $n$의 개수가 2가 되도록 하는 양수 $k$의 값의 범위는 $\alpha<k\le\beta$이다. $\alpha\beta$의 값을 구하시오. [5점]
```

## 원문 정답 (정확 문자열)

```text
$\dfrac{9\sqrt{10}}{2}$
```

## 원문 해설 (정확 문자열)

```text
직선 $y=nx$를 $nx-y=0$으로 쓴다.
첫째 원의 중심 $(0,4)$에서 직선까지의 거리는 $\dfrac4{\sqrt{n^2+1}}$이다.
반지름이 $1$이므로 만나지 않으려면 이 거리가 $1$보다 커야 한다.
$n^2<15$이어서 자연수 $n$은 $1,2,3$뿐이다.
둘째 원의 중심 $(k,0)$에서 직선까지의 거리는 $\dfrac{nk}{\sqrt{n^2+1}}$이다.
반지름이 $3$이므로 만나지 않으려면
$k>3\sqrt{n^2+1}/n$이다.
$n=1,2,3$일 때 필요한 경계는 차례로 $3\sqrt2,\ \dfrac{3\sqrt5}{2},\ \sqrt{10}$이다.
세 경계는 $\sqrt{10}<\dfrac{3\sqrt5}{2}<3\sqrt2$ 순서이다.
정확히 두 자연수 $n$이 조건을 만족하려면
$\dfrac{3\sqrt5}{2}<k\le3\sqrt2$이다.
따라서 $\alpha\beta=\dfrac{3\sqrt5}{2}\cdot3\sqrt2=\dfrac{9\sqrt{10}}2$이다.
```

원문 문제 그림: `assets/images/20_매산고_1학기_기말_고1_기출/q18.png` (두 원과 직선 `y=nx`). 이 원본 그림, 기존 Q18 solution SVG, Q03–Q20 SVG 및 모든 PNG는 변경하지 않았다.

## 최초 mixed-radical 시도와 실제 오류

최초 numberline 초안은 `preparation-20-maesan-h1-1final/history/q18-numberline-initial/`에 원래 네 파일 그대로 보존되어 있다. 부모가 실행한 실제 `expandNumberLineFigure` 결과는 `INEQUALITY_NUMERIC_SCOPE` 실패였다. 실제 계약에서 `numberLine-v1`은 `SET` 구간 끝 비교를 `cmpR`로 하고, 이는 quadratic-inequality-chain의 exact `cmp`를 호출한다. 그 `cmp`는 서로 다른 squarefree radicand field(여기서는 √5와 √2)를 비교하면 `INEQUALITY_NUMERIC_SCOPE`를 던진다. `3*sqrt(5)/2`, `sqrt(45)/2`, `sqrt(45/4)`는 모두 같은 √5 field로 단순화되므로 upper √2 field와의 비교를 바꾸지 못한다. 근삿값을 쓰거나 검증 범위를 완화하지 않았다.

## 현재 exact-input 대안과 범위

원문이 `k>0`임을 이용해 exact monotone transformation `u=k²`를 적용한다. 기존 원문 경계는 `√10<3√5/2<3√2`; 제곱 좌표 경계는 정확히 `10<45/4<18`; 원래 `3√5/2<k≤3√2`는 `45/4<u≤18`에 대응한다. 현재 `plan.json`은 허용된 number-line scalar grammar의 정수·유리수만 사용한다. Caption은 원래 k 경계와 k 범위를 그대로 보존하고, 이 그림의 간격은 k의 간격이 아니라 u의 제곱 좌표임을 밝힌다. 이 때문에 입력은 PARTIAL_VISUAL이며 직접적인 k-scale 그림은 아니다.

사용자 사유: “existing diagram replacement helps understanding”.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 소유자 UNKNOWN. 최초 mixed-radical 입력의 실제 `expandNumberLineFigure` 결과는 FAIL / `INEQUALITY_NUMERIC_SCOPE`로 이력에 보존했다. 현재 u=k² 대안의 input checker는 아직 실행하지 않았으므로 NOT_RUN이며 PASS를 주장하지 않는다. prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff도 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. 원문 content/answer/solution은 해당 runtime row 그대로 위에 보존했다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 보존한다.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `6cb73186a763d876ddf646c6610b51954c49fe1253eefba2b2879f8c50cc102b`, `8de4d5759c44c5dee84206284de1b7ae382b60512f6ca639264bd65ae8fcf087`, `e6840d9d962be8948b12bfbcb3f75b795f38563b47492ac21e283d38556d873f`로 동결된 `graph-repaired` / `2026-11-09T01-37-50-805Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual expandNumberLineFigure input contract의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
