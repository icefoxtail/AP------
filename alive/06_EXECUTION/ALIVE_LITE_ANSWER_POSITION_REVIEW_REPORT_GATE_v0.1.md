# ALIVE LITE — REVIEW 정답 분포·보기 품질 보고 게이트 v0.1

## CURRENT ADDENDUM — 정답 분포 통과 뒤 Consumer 등록/학생 readback까지 동일 REVIEW (2026-10-08)
- 최종 보고에는 before/after ①~⑤(전체·승인·HOLD), 보기 재설계·CHOICE_ORDER_LOCKED, **실제 Consumer DB 등록 UID 및 학생 조회/선택 검증 UID**, 원격 main SHA를 함께 쓴다. 기술 계약은 `ALIVE_LITE_REVIEW_CONSUMER_DB_CLOSEOUT_v1.md`.
- 기존 94/92 또는 19문항 1차 보정 보고는 current 독립검수/최종 등록 숫자가 아니다. phase1~4 변경 UID를 actual diff로 확정한 후 재검·필요 최소 보정하고 마지막에 DB로 공급한다.

적용: 모든 신규 ALIVE Generated Bank의 REVIEW+MAIN 채팅. 기존 original 시험지 변경 금지.

## 모든 REVIEW에서 의무
- 실제 frozen JS의 객관식 정답 위치를 전수 집계해 **①, ②, ③, ④, ⑤의 절대 수와 비율**을 완료보고에 넣는다. 원본 source 정답표가 아니라 생성 대상(승인/보류 각각)의 분모를 제시.
- 정답 ③ 등 한 위치가 40% 초과라면 품질 검수 finding으로 남기고 조정 가능한 문항을 조사한다.
- 정답을 옮기기 위해 보기만 임의 섞거나 ±k 규칙으로 기계 생산하는 것을 **완성 검수 PASS로 인정하지 않는다**.
- 수학적 정답은 불변. 원본 보기에 담긴 오개념 유형을 파악 → 틀린 계산·흔한 변형 착오·부호·조건 해석 실수에서 각각 그럴듯한 오답 후보를 얻는다 → 숫자/분수/부등식/다항식 선택지의 자연스러운 배열 유지 → 정답 기호/해설 참조 교정 → 5개 선택지 전부 실제 대조 및 중복·동치 정답 없음 검사.
- 오름차순/문항 고유 형식상 위치 이동이 부자연스러운 경우 CHOICE_ORDER_LOCKED로 기록. 20% 기계적 할당이 아니라 **의미 있는 보기 구성과 전체 분포 개선**이 목표.
- REVIEW 완료 보고: 검수 분모, ①~⑤ before/after, 보기 재설계 건수, CHOICE_ORDER_LOCKED 건수, 보기·정답·해설 정합 확인 수, HOLD 건수, math PASS/FAIL, main publication SHA/readback.
- 본 계약은 독립 수학풀이와 수학 PASS를 대체하지 않는다. 학생이 보는 수학 조건/SVG 문제의 사실 일치도 REVIEW 범위.
## 효천고 pilot 결함·수정 추적
- baseline source generated 94문항, ①9/②5/③63/④13/⑤4.
- answer-position repair branch `pilot/alive-lite-hyocheon-answer-position-repair-20261008`의 phase1 19개는 수치형 보기의 위치/정렬 1차 수정이며 **오개념 기반 오답 재설계 및 독립검수 미승인 상태**. main 승격 전에 품질 검수 필요.
- 94문항 전체가 완료라고 오인하지 말고 상태/denominator별로 보고.
