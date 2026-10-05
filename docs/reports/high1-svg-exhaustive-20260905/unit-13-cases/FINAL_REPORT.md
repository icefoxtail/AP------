# Unit 13 — 경우의 수 전수 검수

- 상태: `SOURCE_REVIEW_COMPLETE_EXTERNAL_GATES_OPEN`
- 대상 key: H15-SB-06, H22-C-07
- 원본 문항: **96**
- H15-SB-06 미처리 문항: **70**
- H22-C-07 기존 reviewed 문항: **26**
- source files: **37**
- visual assets at intake: **1**

- H15-SB-06 source-only reviewed: **70/70**
- H15-SB-06 visual/source pending: **0**
- H22-C-07 existing source review reused: **26/26** (from unit-11 evidence)

- 2023 매산여고 q10은 D드라이브의 `2023_매여고1_2기말.pdf` 3쪽에서 순천매산여자고등학교·2023학년도 1학년 2학기 기말고사 원문을 확인했다. 등산로 도형과 발문이 production과 일치하고, 별도 정답 PDF의 P=4×3=12, Q=4+3=7, P+Q=19(④) 재계산까지 확인했으므로 source hold를 해소했다. 이전에 확인했던 매산고 1기말 및 generic HWP 후보는 여전히 배제한다. 근거: [28_source_recovery_q10_23maesan_women_d_drive.json](28_source_recovery_q10_23maesan_women_d_drive.json).

2026-09-06 D드라이브 재감사에서 23 매산여고 2학기 기말 q10의 정확한 원문과 정답
자료를 새로 확인했다. 원문·production 도형/발문·정답 PDF가 일치하고 P=12, Q=7,
P+Q=19(④)가 독립 재계산되므로 이 문항은 source-only reviewed로 전환했다. 전체
남은 hold 6건의 재감사 결과와 이번 복구 근거는
[28_source_recovery_q10_23maesan_women_d_drive.json](28_source_recovery_q10_23maesan_women_d_drive.json),
[30_current_source_hold_status_after_q17_restore_20260906.json](../source-audit-20260906/30_current_source_hold_status_after_q17_restore_20260906.json)이다.

경우의 수 문항은 먼저 source-only 독립 계산과 case completeness/disjointness를 확인하고, 실제 경우표·경로·배치도 의존성이 있는 문항만 시각자료 대상으로 확정한다.

현재 70개의 H15-SB-06 문항은 수식·수열·약수·주사위·배분·기본 경우의 수를 독립 재계산했다. 2022 매산고 q5·q6·q9·q15, 2021 금당고 q15·q20, 2021 복성고 q19, 2021 순천고 q20·q21, 2021 제일고 q12·q21, 2021 팔마고 q8·q11, 2021 효천고 q16·q22, 2022 제일고 q6·q12·q14·q18, 2022 금당고 q12·q14·q16, 2022 복성고 q1·q10·q17, 2022 순천여고 q1, 2022 효천고 q10·q17, 2021 강남여고 q18·q19, 2023 금당고 q17·q19, 2024 금당고 q19, 2022 강남여고 q17, 2024 강남여고 q19 및 2023 매산여고 q10은 D 원문과 production asset/문항을 대조해 source gate를 닫았다. 단, 2022 제일고 D파일은 경로명과 달리 PDF 표지/푸터에 `1학기 기말고사`가 있어 term-label conflict를 별도 기록했다. 근거는 [28_source_recovery_q10_23maesan_women_d_drive.json](28_source_recovery_q10_23maesan_women_d_drive.json)과 기존 D-drive recovery evidence이다.
