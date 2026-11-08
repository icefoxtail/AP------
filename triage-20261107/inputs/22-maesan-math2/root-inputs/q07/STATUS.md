# 22 매산고 고2 수학II Q07 로컬 입력 초안

원문 인용(정확, 문항):

```text
7. 실수 전체의 집합에서 증가하는 연속함수 $f(x)$가 모든 실수 $x$에 대하여 $f(x)=f(x-4)+5$이고 $\int_{0}^{8} f(x)dx=0$이다. 함수 $y=f(x)$의 그래프와 $x$축 및 두 직선 $x=12, x=16$으로 둘러싸인 부분의 넓이는? [4.2점]
```

원문 인용(정확, 정답): `④`

원문 인용(정확, 해설):

```text
주어진 식을 $f(x+4)=f(x)+5$로 고쳐 적습니다.
구간 $[4,8]$의 적분은 치환 $u=x-4$로 $\int_4^8 f(x)\,dx=\int_0^4[f(u)+5]du=\int_0^4f(u)du+20$입니다.
$\int_0^8f=0$이므로 $2\int_0^4 f+20=0$, 따라서 $\int_0^4 f=-10$입니다.
같은 식을 세 번 적용하면 $f(x+12)=f(x)+15$이므로 $\int_{12}^{16}f(x)dx=-10+15\cdot4=50$입니다.
넓이로 사용하려면 부호를 확인해야 합니다. $f$가 증가하므로 $-10=\int_0^4f\le4f(4)=4[f(0)+5]$, 따라서 $f(0)\ge-15/2$입니다. $f(12)=f(0)+15\ge15/2>0$이어서 $[12,16]$에서 $f>0$입니다.
그러므로 넓이는 $50$이고 다른 보기와 달리 정답은 ④입니다.
```

표현 계획: 그래프 계약이 정하지 않는 f의 곡선은 그리지 않는다. 수직선에는 문제에서 정확히 유도되는 네 연속 구간의 부호 있는 적분값을 순서대로 표시하고, 캡션에서 점과 x-구간의 대응 및 [12,16]에서 f>0인 이유를 보존한다.

검증 상태: item/plan/publish JSON 파싱, item sourcePath·ordinal 결속, 원문 인용 대조와 사용한 정수 산술은 로컬 정적 검사로 확인한다. number-line engine model/expand, typesetting, render, browser/visual QA, 독립 전체 수학 검토, prepare/build, 공식 게시 및 인계는 NOT_RUN이다. JSON·인용 점검만으로 capability PASS 또는 READY 판정하지 않는다. LOCAL_ONLY, DRAFT_ONLY.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `expandNumberLineFigure`: PASS. 그래프용 fit/spec/semantic/좌표 observer는 이 number-line 입력 검사에서 NOT_RUN이며 적용하지 않은 단계의 성공을 주장하지 않는다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.
