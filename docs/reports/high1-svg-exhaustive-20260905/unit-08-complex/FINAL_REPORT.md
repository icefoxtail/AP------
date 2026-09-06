# Unit 08 — 복소수 전수 검수

- 상태: `IN_PROGRESS_SOURCE_HOLDS_WITH_APPROVED_VARIANT`
- 대상 key: H15-SA-04, H22-C-04
- 원본 문항: **116**
- source files: **44**
- visual assets at intake: **0**
- source-only reviewed: **111/116**
- pending manual review: **0**
- source holds: **5 original items preserved; 0 production-approved variants (2 quarantined candidates); 5 source corrections completed; 5 additional D-source confirmations**

식 계산형 문항 중심으로 source-only 검수와 inline SVG parity를 확인한다. 23 여수여고 q11은
독립 계산값은 확정되지만 ④·⑤ 선택지가 중복되어 원본 source defect로 보존한다. D 정답표의
q11=④를 확인해 production answer는 ⑤에서 ④로 복원했지만, 중복 보기는 그대로라 hold다.
중복 보기를 정리한 승인 variant는 별도 candidate로 격리했다. 24 여수고 q15는 n의 자연수 범위가
누락되어 원본을 보존하고 m,n의 자연수 조건을 명시한 variant를 별도 생성했다. 24 여수고
q18도 z₁,z₂ 정의 누락으로 원본을 보존하고 자연수 좌표·절댓값 조건을 명시한 variant를
별도 생성했지만, D드라이브 HWP 원본을 발견했으므로 두 variant는 원본 대조 전까지
quarantine 상태로 전환했다. HWP BodyText를 직접 검사한 결과 q15의 조건식과 q18의 조건 블록은
원본 스트림에서 확인되지 않아 source hold를 유지한다. 26 금당고 q15와 26 매산여고 q12, q17, q21은 D드라이브 원문을 확인해
원본 answer/solution을 독립 계산 기준으로 보정했으며 기존 variant는 superseded 처리했다. 26 팔마고 q2도
D드라이브 원문과 정답표를 확인해 저장 answer ①을 ④로 보정했다. 23 여수여고 q11과 24 한영고 q19도
D드라이브 원문을 확인했다. q11은 중복 보기를 원본 결함으로 보존하고 D 정답표 ④를 반영해
production answer를 복원했으며, q19는 원문 표기
([서술형 1])을 복원했으며 학교 해설 정답 0과 독립 계산값 −20의 충돌을 source defect로 기록했다.
q5(24 제일고)는 D드라이브 원문을 확인했지만 순허수·복소수 부등호 해석 충돌 때문에 source hold로 남아 있고,
24 여수고 q15·q18도 HWP 수식 전사 전까지 source hold로 남아 있다.
HWP의 BinData raw-deflate stream도 해제해 확인했으나 정사면체 JPEG와 이차함수 그래프 BMP뿐이었고,
q15 조건식이나 q18 조건 블록은 포함하지 않았다. 따라서 별도 stream 기반 복원 근거도 없다고 판정했다.
근거는 [06_expected_facts.jsonl](06_expected_facts.jsonl),
[04_unit_findings.jsonl](04_unit_findings.jsonl), [q11 source hold resolution](07_source_hold_resolution_q11.json),
[q15 source hold](08_source_hold_resolution_q15.json), [26 금당고 q15 source recovery](12_source_recovery_q15_d_drive.json),
[q18 source hold resolution](09_source_hold_resolution_q18.json),
[q12 q17 q21 source recovery](11_source_recovery_q12_q17_q21_d_drive.json),
[q2 source recovery](13_source_recovery_q2_d_drive.json), [q11 source recovery](14_source_recovery_q11_d_drive.json), [q11 answer-key recovery](19_source_recovery_q11_answer_key_d_drive.json), [q19 source recovery](15_source_recovery_q19_d_drive.json), [q5 source recovery](16_source_recovery_q5_d_drive.json), [q15/q18 HWP inspection](17_hwp_source_inspection_q15_q18.json)에 기록했다.

2026-09-06 재감사에서도 D드라이브 원문 SHA와 기존 근거가 일치했다. 23 여수여고 q11은
정답 HWP에서 ④를 추가 확인해 production answer를 복원했지만,
중복 보기 결함, 24 여수고 q15·q18은 HWP 핵심 조건식/조건 블록 부재, 24 제일고 q5와
24 한영고 q19는 원문·해설·수학적 해석 충돌로 각각 hold를 유지한다. 유사문제 후보는
원문 대체로 승격하지 않았다. 상세 재감사 표는
[31_current_source_hold_status_after_q11_answer_restore_20260906.json](../source-audit-20260906/31_current_source_hold_status_after_q11_answer_restore_20260906.json)이다.

동일 날짜의 반복 D드라이브 파일명 탐색에서 추가로 확인된 24 한영고 PDF/HWP는
기존 q19 source PNG 및 HWP와 함께 supplementary provenance로만 기록했다. 여수고 q15·q18은
여전히 일치하는 HWP 1개뿐이고 조건식/조건 블록이 decoded BodyText에 없어 전사 보류를
유지한다. 반복 탐색 결과와 최신 current snapshot은
[32_source_hold_repeat_reaudit_20260906.json](../source-audit-20260906/32_source_hold_repeat_reaudit_20260906.json)와
[32_current_source_hold_status_repeat_reaudit_20260906.json](../source-audit-20260906/32_current_source_hold_status_repeat_reaudit_20260906.json)에 기록했다.
