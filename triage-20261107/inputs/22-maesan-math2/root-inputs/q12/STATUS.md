# 22 매산고 고2 수학II Q12 로컬 입력 초안

상태: **DRAFT_ONLY · LOCAL_ONLY**. 원격 변경·준비·빌드·handoff·게시·렌더는 하지 않았다.

원문 바인딩: `archive/exams/original/high/h2/2final/22_매산고_2학기_기말_고2_수학II.js`, ordinal 12; exact source preparation-22-maesan-math2/source-exact.js (37,208 bytes), Git blob SHA-1 `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 기준 main은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`; metadata-only 후속 `653f9c9693664f791a4a6040f0d19b45f2b88621`이며 시각화 engine 내용은 `44ac8c11`에서 바뀌지 않은 것으로 전달받았다.

시각화 사유: 유용한 함수 그림은 개념 이해를 돕는다. 좌표는 임의의 위치가 아닌 해당 실제 곡선 점에 연결된 지시선으로 표시한다.

수학·범위 요약: 시각화는 허용 높이 a=27/4,7만 수직선에 표시한다. 대응하는 양의 시각은 캡션에만 둔다. 열린 반직선의 cubic은 그리지 않는다.

입력 작성 근거: Current graph sourceDomain supports ALL_REALS or a finite INTERVAL, not an open half-line for a cubic; this plan is an honest discrete-height number line only.

기존 원본 해설 SVG q12_encounter_tangencies.svg는 보존하며 수정하지 않았다.

원문 인용(정확, 문항; questionBank[11].content):

```
12. 원점을 동시에 출발하여 수직선 위를 움직이는 두 점 $\mathrm{P, Q}$의 시각 $t(t \ge 0)$에서의 속도가 각각

$$v_1(t)=2t(t^2-5t+9), \quad v_2(t)=\frac{5}{4}t^2+a$$

이다. 두 점 $\mathrm{P, Q}$가 출발 후 두 번 만나기 위한 모든 상수 $a$의 값의 합을 $S$라고 할 때, $4S$의 값은? [4.8점]
```

원문 인용(정확, 정답): ③

원문 인용(정확, 해설):

```
두 점은 원점에서 출발하므로 만나는 시각은 출발 후 두 점의 위치 차가 $0$이 되는 양수 $t$입니다.
속도 차는 $v_1-v_2=2t^3-\frac{45}{4}t^2+18t-a$입니다.
$0$부터 $t$까지 적분하면 위치 차는 $D(t)=t\left(\frac12t^3-\frac{15}{4}t^2+9t-a\right)$입니다.
$t>0$에서 $P(t)=\frac12t^3-\frac{15}{4}t^2+9t=a$의 서로 다른 양의 해가 정확히 두 개여야 합니다.
$P'(t)=\frac32(t-2)(t-3)$이므로 $t=2$에서 극대 $P(2)=7$, $t=3$에서 극소 $P(3)=27/4$입니다.
정확히 두 양의 교점을 갖는 경우는 극댓값 또는 극솟값과 수평선이 접할 때뿐입니다. $a=7$이면 $P(t)-7=(t-2)^2(2t-7)/4$로 양의 해가 $2,7/2$이고, $a=27/4$이면 $(t-3)^2(2t-3)/4$로 양의 해가 $3,3/2$입니다.
따라서 $S=7+27/4=55/4$, $4S=55$이므로 정답은 ③입니다. 다른 보기의 수는 두 접선 높이의 합이 아닙니다.
```

검사 기록: JSON 파싱, item sourcePath/ordinal 바인딩, publish alt/caption 필드 검사 **PASS**. exact source 파일은 47,143 bytes이며 Git blob SHA-1은 위 기록과 일치한다.

허용된 부분 계획의 한계: number-line plan에 대해서는 현재 JSON/바인딩 검사만 수행했다. 실제 number-line solver·expansion 및 Node capability/spec 검사, graph input checker는 **NOT_RUN**이다.

미실행: Node capability dispatch/specFor, production semantic checks, exact-coordinate observer, engine.prepare, formal render/SVG/PNG, browser·visual review, independent full math review, production prepare/build/handoff, CI 및 publication. 모두 **NOT_RUN**이다. 해당 문항 전체 도해 완료를 주장하지 않는다.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `expandNumberLineFigure`: PASS. 그래프용 fit/spec/semantic/좌표 observer는 이 number-line 입력 검사에서 NOT_RUN이며 적용하지 않은 단계의 성공을 주장하지 않는다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.

메타데이터 정정: 위 초안의 37,208 bytes 표기는 잘못된 이전 메모이고 정확한 값은 47,143 bytes이다. `653f9c9693664f791a4a6040f0d19b45f2b88621`은 `9970c2f6ada75e2c978519b46f964f3b16ee1b98`의 부모인 PR1523 병합 커밋이며 metadata-only 후속 커밋이 아니다. 9970c2f6가 metadata 변경 후속 커밋이다. 이 구분은 원문·수학·엔진 내용 변경을 뜻하지 않는다.

부분 표현 범위: 허용 높이 a=27/4,7만 표시한다. t>0의 P(t) 삼차 곡선은 미표현이며 원래 q12_encounter_tangencies.svg를 그대로 보존했다.
