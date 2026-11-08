# 22 매산고 고2 수학II Q20 로컬 입력 초안

원문 인용(정확, 문항):

```text
<서술형 2>
최고차항의 계수가 1인 사차함수 $f(x)$가 있다. 양수 $p$에 대하여 함수 $g(x)$를

$$g(x)=\begin{cases} f(x) & (x \le 0) \\ f(x+p)-f(p)+f(0) & (x > 0) \end{cases}$$

이라 하자. 함수 $g(x)$는 실수 전체의 집합에서 미분가능하고, 두 함수 $f(x), g(x)$는 다음 조건을 만족시킨다.

(가) $|f'(0)| = f'(p+1) = \frac{5}{3}$
(나) 두 함수 $f(x), g(x)$는 모두 극댓값을 갖고, 두 함수 $f(x), g(x)$의 극댓값의 차는 14이다.

$f(2)-f(0)$의 값을 구하는 과정을 서술하시오. [10.0점]
```

원문 인용(정확, 정답): `14`

원문 인용(정확, 해설):

```text
조건·목표: 조각함수 $g$가 미분가능하고 $f,g$ 모두 극댓값을 갖는 조건으로 $p$를 결정하여 $f(2)-f(0)$을 구한다.
전략: $x=0$에서 좌우 미분계수를 일치시키고, $f'(0)$의 두 부호를 극댓값 존재 조건으로 판별한다.
풀이 ① $f(x)=x^4+Ax^3+Bx^2+Cx+D$로 놓는다. $g$가 $x=0$에서 미분가능하려면 $f'(0)=f'(p)=C$이다. 따라서 $4p^2+3Ap+2B=0$, 즉 $2B=-4p^2-3Ap$이다. 또한 $|C|=\frac53$, $f'(p+1)=\frac53$이다.
풀이 ② $f'(p+1)-C=(p+1)(8p+4+3A)=\frac53-C$이다. 먼저 $C=-\frac53$이라 가정하면 $A=-\frac{8p+4}{3}+\frac{10}{9(p+1)}<0$이고 $B=\frac{p(6p^2+12p+1)}{3(p+1)}>0$이다($p>0$). 따라서 $x\le0$에서는 $f'(x)=4x^3+3Ax^2+2Bx-\frac53<0$이므로 $g$의 왼쪽 부분에 극대가 없다.
풀이 ③ 오른쪽에서는 $x>p$인 $f'(x)$를 살핀다. $f'(p)=-\frac53$이고 $f''(p)=p\bigl(-4+\frac{10}{3(p+1)}\bigr)<0$이다. $f''(x)=12x^2+6Ax+2B$는 위로 열린 이차식이므로 $x>p$에서 한 번만 $0$이 되고, $f'$는 감소하다 증가한다. 따라서 $f'$는 $x>p$에서 음수에서 양수로 한 번만 바뀌므로 $g$의 오른쪽 부분에도 극대가 없다. 이는 조건에 모순이다. 그러므로 $C=\frac53$이다.
풀이 ④ $C=\frac53$이면 $A=-\frac{8p+4}{3}$, $B=2p(p+1)$이고 $f'(x)=4x(x-p)(x-p-1)+\frac53$이다. $x\le0$에서 $f'$는 음수에서 양수로만 바뀔 수 있으므로 왼쪽 부분에는 극대가 없다. $g$의 오른쪽 부분은 $f$의 $x>p$ 구간을 왼쪽으로 $p$만큼, 위아래로 $f(0)-f(p)$만큼 옮긴 것이므로 두 함수의 극댓값의 차는 $|f(p)-f(0)|$이다.
풀이 ⑤ $f(p)-f(0)=\frac{p(p^3+2p^2+5)}{3}$이다. $p>0$에서 이 값은 양수이고 엄격히 증가한다. 따라서 극댓값의 차가 $14$라는 조건은 $p(p^3+2p^2+5)=42$이며, $p=2$가 이를 만족하는 유일한 양수이다. 이때 $f'(\frac52)=-\frac56<0$이고 $f'(2)=f'(3)=\frac53>0$이므로 오른쪽 구간에 실제 극대가 존재한다.
결론: $p=2$이므로 $f(2)-f(0)=f(p)-f(0)=14$이다.
```

표현 범위: number-line plan에는 조건에서 정해지는 허용 범위 p>0, 제외되는 경계 0, 그리고 풀이 후 해 p=2만 표시한다. 0 점은 별도 POINTS row에서 명시적으로 HOLLOW이며, 같은 row의 `within:1`은 열린 SET과의 관계를 표시한다. 완전한 g 그래프는 두 조각의 모든 경계·수직 위치를 정확히 표현하는 그래프 contract가 확인되지 않았고 f(0)의 절대 높이도 미정이므로 그리지 않는다. 대신 F=f−f(0)의 정확한 계수와 목표값만 캡션에 적는다. 미정 상수를 정하거나 곡선을 근사하지 않는다.

검증 상태: item/plan/publish JSON 파싱, sourcePath·ordinal 결속, 원문 질문·정답·해설 인용 대조, p=2 대입과 F(2)=14의 정적 산술 확인을 수행한다. number-line model/expand 및 source piecewise graph contract validation, renderer, browser/visual QA, 독립 전체 수학 검토, prepare/build, 공식 게시와 인계는 NOT_RUN이다. LOCAL_ONLY, DRAFT_ONLY이며 READY가 아니다.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `expandNumberLineFigure`: PASS. 그래프용 fit/spec/semantic/좌표 observer는 이 number-line 입력 검사에서 NOT_RUN이며 적용하지 않은 단계의 성공을 주장하지 않는다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.

부분 표현 범위: p>0 및 p=2와 정확한 F(2)=14 관계만 표시한다. 0은 HOLLOW 제외 경계다. 원래 g의 전체 조각 곡선·극값 그림은 미표현이다.
