# Unit 09 — 이차방정식 전수 검수

- 상태: `IN_PROGRESS_SOURCE_HOLDS`
- 대상 key: H15-SA-05, H22-C-05
- 원본 문항: **178**
- source files: **43**
- visual assets at intake: **0**
- inline SVG count: **9**
- source-only reviewed: **177/178**
- pending manual review: **0**
- source holds: **1**

식 계산형 문항 중심으로 source-only 검수하며 inline SVG는 별도 static gate로 분리한다.
기존 결함·증거 누락을 source hold로 기록했고, 현재 active source hold는 26 금당고 17번
한 건이다. 25 순천여고 19·20번은 D 원문을 추가 확인해 production과 expected fact를
원문 기준으로 복원했다.

2026-09-06 D드라이브 역감사에서 26 금당고 14·16·17번의 원문 이미지와 도형을 확인했다.
14번은 clean 해설 PDF로 좌표 모델과 둘레식이 고정되어 production 정답을 10(⑤)으로
보정했고, 기존 표시 답과의 충돌을 source defect로 기록했다. 16번은 원문 표시 정답
13/8과 독립 계산값 −15/8이 충돌해 독립 정답으로 보정했다. 17번은 원문 발문에
‘a의 최댓값’이 명시된 것을 확인해 production 발문을 복원했지만, 실제 조건은
1<a<4에서만 정확히 세 교점을 만들므로 최댓값이 존재하지 않는다. 원문 정답 ④는
수학적으로 확정할 수 없어 source defect hold를 유지한다. 근거는
[09_source_inspection_q14_q16_q17_d_drive.json](09_source_inspection_q14_q16_q17_d_drive.json)와
[17_source_inspection_q14_clean_pdf_26geumdang_d_drive.json](17_source_inspection_q14_clean_pdf_26geumdang_d_drive.json),
[18_source_recovery_q17_26geumdang_d_drive.json](18_source_recovery_q17_26geumdang_d_drive.json)이다.

25 순천여고 20번도 D드라이브 원문에서 지름 $AB=10$을 확인해 저장본의 지름 20 가정을
제거하고 정답을 $x^2-10x+54=0$으로 보정했다. 근거는
[11_source_recovery_q20_25suncheon_d_drive.json](11_source_recovery_q20_25suncheon_d_drive.json)이다.

25 순천여고 19번은 D드라이브 원문에서 누락·변경된 조건을 복원했다. 원문은
$x^2-2(k-1)x+k^2-ak+b-3=0$이 모든 실수 $k$에서 중근을 갖는 조건과
$x^3-4x^2+ax+b$의 복소수 범위 인수분해를 요구한다. 따라서 $a=2,b=4$이고
production을 $(x-2)(x-1-√3)(x-1+√3)$로 보정했다. 근거는
[16_source_recovery_q19_25suncheon_d_drive.json](16_source_recovery_q19_25suncheon_d_drive.json)이다.

26 매산여고 19번은 원문 표시 정답 5와 독립 교점 계산값 10이 충돌해 정답을 ④로
보정했고, 22번은 원문 도형 기준 넓이 최댓값 12로 보정했다. 근거는
[12_source_recovery_q19_q22_26maesan_d_drive.json](12_source_recovery_q19_q22_26maesan_d_drive.json)이다.

26 팔마고 9·15·22번도 각각 원문 이미지와 대조해 정답을 ①($51/2$), ③(43),
120으로 보정했다. 근거는 [13_source_recovery_q9_q15_q22_26palma_d_drive.json](13_source_recovery_q9_q15_q22_26palma_d_drive.json)이다.

26 금당고 20번도 원문 조건을 직접 계산해 저장 정답 6을 3으로 보정했다. 26 금당고 16번은
원문 표시 정답과 독립 계산이 충돌하지만 독립 계산 정답으로 보정하고 source defect를 기록했다.
현재 남은 이차방정식 source hold는 26 금당고 17번이다. 원문 발문은 복원했지만
최댓값 부재라는 원본 결함이 확인되어 보류한다.

23 부영여고 21번은 D 원문 6쪽에서 누락되어 있던 두 이차방정식의 실제 조건을 복원했고,
저장 해설의 계산값 −27과 대조를 완료했다. 근거는
[15_source_recovery_q21_23buyeong_d_drive.json](15_source_recovery_q21_23buyeong_d_drive.json)이다.

2026-09-06 재감사에서 26 금당고 q17 원문 이미지 SHA와 ‘a의 최댓값’ 발문을 확인했다.
읽힌 조건을 독립 분석한 결과 최댓값이 존재하지 않아 source defect hold를 유지했다.
전체 source hold 재감사 대상 7건의 D드라이브 결과(이후 q10 복구 포함)는
[30_current_source_hold_status_after_q17_restore_20260906.json](../source-audit-20260906/30_current_source_hold_status_after_q17_restore_20260906.json)에 고정했다.
