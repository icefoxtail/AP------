# 22 매산고 고2 수학II Q17 로컬 입력 초안

원문 인용(정확, 문항):

```text
<단답형 2>
$x$에 대한 이차방정식 $x^2+ax+b=0$은 서로 다른 두 실근 $-1, \alpha$를 가지고 $\int_{-1}^{\alpha} (x^2+ax+b)dx = \frac{1}{6}$일 때, 정적분 $\int_{-3}^{1} (x^2+bx-a)dx$의 값을 구하시오. (단, $a$는 상수이다.) [5.0점]
```

원문 인용(정확, 정답): `-\frac{32}{3}`

원문 인용(정확, 해설):

```text
이차방정식의 두 근이 $-1,\alpha$이고 최고차항 계수가 $1$이므로 $x^2+ax+b=(x+1)(x-\alpha)$입니다.
전개하여 $a=1-\alpha$, $b=-\alpha$입니다.
$\int_{-1}^{\alpha}(x+1)(x-\alpha)dx=-(\alpha+1)^3/6=1/6$이므로 $(\alpha+1)^3=-1$입니다.
따라서 $\alpha=-2$, $a=3$, $b=2$입니다. 적분 구간의 상한이 $-1$보다 작을 수도 있으므로 부호를 임의로 바꾸면 안 됩니다.
구하는 값은 $\int_{-3}^{1}(x^2+2x-3)dx=[x^3/3+x^2-3x]_{-3}^{1}$입니다.
위끝에서 $-5/3$, 아래끝에서 $9$이므로 결과는 $-5/3-9=-32/3$입니다.
```

계약 점검: 실제 `number-line-figure-v1`의 POINTS row span은 `style:"ARROW"`에서 `from`과 `to`의 좌표 차로 방향 부호를 정하고 화살촉을 `to`에 둔다. 따라서 C=−1에서 B=−2로 지정하면 왼쪽 화살표가 된다. plan은 이 승인된 방향 표현을 사용하며 양의 길이/기하 넓이로 대체하지 않는다.

검증 상태: item/plan/publish JSON 파싱, sourcePath·ordinal 결속, 원문 인용 대조, 경계·정적분 부호 산술 정적 확인을 수행한다. number-line engine model/expand, typesetting, render, browser/visual QA, 독립 전체 수학 검토, prepare/build, 게시·인계는 NOT_RUN이다. LOCAL_ONLY, DRAFT_ONLY; READY나 전체 수학 검수 PASS가 아니다.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `expandNumberLineFigure`: PASS. 그래프용 fit/spec/semantic/좌표 observer는 이 number-line 입력 검사에서 NOT_RUN이며 적용하지 않은 단계의 성공을 주장하지 않는다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.
