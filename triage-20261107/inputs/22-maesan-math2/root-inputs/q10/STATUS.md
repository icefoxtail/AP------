# 22 매산고 고2 수학II Q10

그림은 원래 f가 아니라 H(x)=∫_a^x f(t)dt=x^2-4x라는 적분값 함수의 그래프다. 영점 0과 4를 표시하고, a>0 조건에서 양수 영점 4를 하한으로 고른다.

사용자 사유: 함수 도식이 이해에 도움이 되는 문항은 그래프로 보조한다.

원문 인용: “따라서 $a=0$ 또는 $a=4$인데 $a>0$이므로 $a=4$입니다.”

상태: DRAFT_ONLY. 이 폴더만 로컬로 작성했다. 실제 production input functions: NOT_RUN. 렌더·prepare/build·handoff: NOT_RUN. 원격 보존·commit·push·PR·READY 판정: NOT_RUN.

## 2026-11-08 최종 로컬 입력 검사 기록

위 내용은 작성 당시의 기록이며 아래는 현재 동결된 3종을 실제 입력 함수로 검사한 최신 결과이다. 이전 실패·제약과 미실행 이력은 삭제하지 않았다.

기준 원문: main `9970c2f6ada75e2c978519b46f964f3b16ee1b98`, Git blob `86a3923693fb02bca125a2ed0e2c45a6d56d35c5`. 실제 UTF-8 원문 파일은 47,143 bytes이다. item의 sourcePath·ordinal과 원문의 문항 신원, 세 JSON 파싱, publish의 alt/caption 기본 필드 존재 검사: PASS.
증거: `preparation-22-maesan-math2/checker/node-results-2026-11-08T18-29-14-273Z.json` 및 `preparation-22-maesan-math2/checker/python-results-2026-11-08T18-29-14-273Z.json`. item/plan/publish의 SHA-256을 검사 입력 해시와 다시 대조하여 일치함을 확인했다.

실제 수행: production `fit_overview`, `phase2.specFor`, `semantic_model.validate`, 실제 엔진의 critical 점 구성 분기, `viewport.for_spec`, 축 눈금 guard와 fitted/spec 눈금 대조: PASS.
`exact_coordinate` 검사 대상은 실제 COORDINATE_LABEL 객체 1개이며 모두 PASS이다. 대상이 0개인 경우 좌표 문구 전체의 독립 일치 검사를 뜻하지 않는다. named leader의 EQUATION_LABEL은 이 검사의 대상이 아니다. 엔진 prepare 내부의 해당 순수 분기만 사용했으며 `engine.prepare` 전체를 호출하지 않았다.

공통 사유: 사용자가 이해에 조금이라도 도움이 되는 함수 도식을 요청했다. 함수 좌표는 가능한 실제 점 지시선으로 배치하며, 수직선과 입체 치수는 해당 계약의 표시·연결 표기를 사용한다. 지시선 충돌·가독성은 실제 렌더 전이므로 아직 검수하지 않았다.

여전히 NOT_RUN: engine.prepare 전체, production build, 공식 render/SVG/PNG, browser·visual review, 독립 전체 수학 검토, 공식 게시 검증, CI, 구현자 인계. 상태는 LOCAL_ONLY / DRAFT_ONLY이며 READY나 전체 도해 완료가 아니다. 원본·기존 자산·ledger·Q05/Q16 입력은 수정하지 않았다. 원격 object/commit/ref/push/PR 쓰기를 하지 않았으며 효천 ref 거절을 재시도하거나 우회하지 않았다.
