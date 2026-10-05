# Unit 02 — 직선의 방정식 전수 검수

- 상태: `COMPLETE_FOR_HANDOFF`
- 대상 key: `H15-SA-10`, `H22-C2-02`
- 원본 문항: **94** (H15 63 + H22 31)
- source files: **28**
- unique solution SVG: **94**

## 판정

- 현재 HEAD 기준 actual-SVG qualification: **94/94 PASS**, failures 0, holds 0, releaseReady true.
- browser render: **84/84 PASS** (28 files × exam/solution/answer), zero load-error text, image failure, raw LaTeX, overflow, and console error.
- targeted current-source repair: **8** geometry assets repaired and revalidated.
- external independent-audit false-positive expectations: **2** documented and not applied as production changes.
- unresolved findings: **0**.

## 보고서 근거

- [00_unit_baseline.json](00_unit_baseline.json)
- [01_unit_inventory.csv](01_unit_inventory.csv)
- [03_unit_render_matrix.csv](03_unit_render_matrix.csv)
- [04_unit_findings.jsonl](04_unit_findings.jsonl)
- [05_confirmed_repairs.json](05_confirmed_repairs.json)
- [11_render_evidence.json](11_render_evidence.json)
- archive/analysis/line-equation-v22-qualification/qualification.json

## 결론

직선의 방정식 단원은 원문 식·좌표와 SVG primitive를 대조한 뒤 확정 결함을 수정했고, 현재 단원 handoff 기준을 충족한다. 다음 단원은 사용자가 정한 순서에 따라 평면좌표다.

## 현재 source-first ledger 경계

이 보고서의 `COMPLETE_FOR_HANDOFF`는 기존 직선 SVG·수학·브라우저 handoff를 뜻한다.
고1 전체 source-first 역감사의 current unit ledger에는 아직 이 단원의 94문항이
포함되지 않았으므로, 최종 source gate 완료로 해석하지 않는다. 다음 source-audit
배치로 H15-SA-10 63문항과 H22-C2-02 31문항을 모두 확장한다는 뜻이 아니다. 이번
실행은 사용자가 체크한 calibration 5문항만 기록하고, 나머지 문항은 범위 밖으로 둔다.

### 2026-09-06 calibration batch 01

`23 강남여고 1학기 기말`의 q5·q12·q13·q22·q24를 D드라이브 원문 PDF page 1·2·4와
정답 HWP로 대조했다. 객관식 q5/q12/q13은 정답 HWP의 ①/①/③과 독립 계산이
일치했고, 서술형 q22/q24는 원문 발문을 그대로 확인한 뒤 독립 계산값
`y=-3x-9`/`17`을 얻었다. 다섯 문항 모두 source content/choices parity와 answer
parity가 통과했고, production·solution은 수정하지 않았다.

현재 선택된 calibration ledger는 **5/5 reviewed**, `SOURCE_HOLD 0`이며, 나머지
직선 문항은 이번 실행 범위 밖이다. 단원 상태는 `CALIBRATION_RECORDED_NO_EXPANSION`이다.
이 calibration PASS는 직선 단원 전체
closure나 고1 전체 PASS를 의미하지 않는다. 원문·페이지 SHA·독립 fact와 production
비교는 [`07_source_calibration_batch_01_23gangnam.json`](07_source_calibration_batch_01_23gangnam.json)에,
원장 상태는 [`08_source_review_status.json`](08_source_review_status.json)에 기록했다.
