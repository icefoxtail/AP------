# 20 매산고 고1 1학기 기말 Q20 로컬 입력 초안

출처 결속: `archive/exams/original/high/h1/1final/20_매산고_1학기_기말_고1_기출.js`, ordinal 20; source main `ca13990f5ba49e16af134945e3c26bf35d7a89c5`, prepared source SHA-256 `08bdbe7571b0a6a043695f35958328f7e1870694f9c5465c0fa7e1df506384f4`, source git blob `830a02dfed7703f109a615015e658aadc3def794`. `item.json`은 위 원문 경로와 ordinal로 해당 런타임 행에 결속한다. 소유자는 `UNKNOWN`.

## 원문 문항 (정확 문자열)

```text
점 $A(a,0)$과 점 $B(0,b)$가 $\triangle OAB$의 넓이가 항상 1이 되도록 $x$축, $y$축 위를 각각 움직인다. 선분 $\overline{AB}$를 한 변으로 하는 정사각형 $ABCD$를 제1사분면에 만들고 이 정사각형의 두 대각선의 교점을 $M$이라고 하자. (단, $a,b$는 양수이다.)\n(1) $a+b$의 값의 범위를 구하여라. [4점]\n(2) 점 $M$의 자취를 그림으로 나타내어라. [6점]
```

## 원문 정답 (정확 문자열)

```text
(1) $2\sqrt2\le a+b$
(2) $y=x$ 위에서 $(\sqrt2,\sqrt2)$를 포함하고 오른쪽 위로 뻗는 반직선
```

## 원문 해설 (정확 문자열)

```text
삼각형 $OAB$의 넓이가 1이므로
$\frac{ab}{2}=1$
$ab=2$
$A=(a,0), B=(0,b)$이므로 $\overrightarrow{AB}=(-a,b)$이다.
이 벡터를 시계 방향으로 90도 회전하면 $(b,a)$이므로 제1사분면의 정사각형 꼭짓점은
$D=(a+b,a), C=(b,a+b)$이다.
두 대각선의 교점 $M$은 $AC$의 중점이므로
$M=\left(\frac{a+b}{2},\frac{a+b}{2}\right)$이다.
산술평균과 기하평균의 관계에서
$a+b\ge2\sqrt{ab}$
$a+b\ge2\sqrt2$
이 값은 $a=b=\sqrt2$일 때 가능하므로 (1)의 범위는 $2\sqrt2\le a+b$이다.
$s=(a+b)/2$라 두면 $M=(s,s)$이고 $s\ge\sqrt2$이다.
모든 $s\ge\sqrt2$가 가능한지도 확인한다.
$a,b$를 방정식 $z^2-2sz+2=0$의 두 근으로 두면 두 근의 합은 $2s$, 곱은 2이다.
판별식은
$(-2s)^2-4\cdot1\cdot2=4(s^2-2)\ge0$이다.
두 근의 곱이 $2>0$이고 합이 $2s>0$이므로 두 근은 모두 양수이다. 따라서 이 $a,b$는 조건 $ab=2$, $a+b=2s$를 만족한다.
따라서 $M$의 자취는 $y=x$ 위에서 $x\ge\sqrt2$인 반직선이며 끝점 $(\sqrt2,\sqrt2)$를 포함한다.
```

## 범위와 계획

이 capability로 정확히 그릴 수 있는 것은 s=(a+b)/2의 가능한 1차원 범위 `s≥√2`뿐이다. 원문이 요구하는 그림은 2차원에서 y=x 위의 (√2,√2)를 포함하는 오른쪽 위 반직선 전체이다. 기존 number-line contract는 이 자취를 그리지 않으므로 이 draft는 명시적인 PARTIAL_INPUT이며 완전한 자취 그림이나 완전한 Q20 해설 이미지로 표시하면 안 된다. 숫자 √2는 exact value 문자열 `sqrt(2)`로 표시하고 근사값으로 바꾸지 않는다.

원문 해설의 벡터를 시계 방향으로 90도 회전해 정사각형 꼭짓점을 정하는 방법은 별도 고등학교 교육과정 적합성 검토 대상이다. 이 drafting pass는 원문의 방법을 고치거나 판단하지 않았다. geometry graph/half-line 기능이 준비되면 전체 2차원 locus용 입력을 별도로 만들 수 있다; 현재에는 수직선 partial만 저장한다.

사용자 사유: “existing diagram replacement helps understanding”.

보호: 기존 Q03–Q20 SVG와 모든 PNG, 이 원본 시험지·JS, 다른 문항 패키지를 수정하지 않았다. Q20의 기존 SVG와 모든 원본 PNG는 덮어쓰거나 다시 렌더하지 않는다. 원격 쓰기·렌더·엔진 수정·외부 handoff 0회. 별개 `19 강남여고 고1 2기말 Q13` whole-item HOLD는 범위 밖이며 그대로 보존한다.

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. 실제 input checker, engine prepare/build, render/SVG/PNG, 전체 수학 검수, 시각·접근성 검수, CI, publication, handoff 모두 NOT_RUN. checker는 부모가 실행하기 전까지 실행하지 않는다. content/answer/solution은 source-runtime-bank.json의 해당 행에서 그대로 옮겼으며 원문/자산은 수정하지 않았다.



**명시적 한계:** `PARTIAL_INPUT` — 2차원 locus graph not represented. Caption also states this limit; no false full-visual PASS.


## 최종 현재 바이트 입력검사 기록

2026-11-09T01:41:40.117620+00:00: 현재 item/plan/publish 3종 JSON 바이트가 `3845720a23996376a0a030811f40d6a52943b33aa098bc4f18cc922e5d8f59e2`, `299206506b8f1e971c0cc07c1d3d028b78f30e7b4312d2ba3d8d660d84ca94bf`, `d8647f55bc7dbf9acd47cbc5584d9af2f806424d5dd7fc7c3092e74125aaba8a`로 동결된 `graph-rest` / `2026-11-09T01-27-29-093Z` 입력검사 PASS에 결속된다. source exact JS runtime의 20행·id=ordinal, 원본 경로·문항 번호 결속 및 actual expandNumberLineFigure input contract의 적용 가능한 실제 검사 PASS. 좌표 라벨 단계의 N/A는 PASS로 바꾸지 않았다.
이 기록은 입력 계약·순수 검사 함수만의 결과다. 전체 수학·교육 검수, 그림 완성도·학생 가독성·정답 노출 여부는 판단하지 않았다. render/engine.prepare/build/CI/publication/handoff NOT_RUN. 기존 STATUS·실패 이력·보호 자산은 그대로 보존하며, LOCAL_ONLY / DRAFT_ONLY / NOT_READY, owner UNKNOWN, 원격 쓰기 없음.
