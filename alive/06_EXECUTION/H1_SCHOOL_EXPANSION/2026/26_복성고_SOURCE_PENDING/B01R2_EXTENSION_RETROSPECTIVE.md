# 복성고 B01R2 CREATE 생산 및 L3/L4 확장 회고

2026-10-08. 기존 RPM 정본은 변경하지 않는다.

## 생산 근거
- 원본: archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js
- 원본 blob: 8266fa476906e9134b94f23e803bd3b2fb26ece4
- 최초 13개 시제품은 이번 실적에서 제외.
- 재설계: 원본 7개(q1,2,4,6,7,12,15), Blueprint 65 / ACCEPT 45 / 중복 6 / L3 이탈 7 / 교육과정 위반 1 / 보류 6.
- 신규 생성: q1 5개, q2 10개, q4 6개, q6 9개, q7 6개, q12 9개, q15 0개. 총 45개 UID, L2 6개 shard.
- 정답 위치 ①9 · ②8 · ③12 · ④11 · ⑤5. 메타 projection DIRECT_ACTIVE 22 / DIRECT_BINDING_GAP 15 / RPM_ONLY 8.
- 45개 Git readback 완료: commit 669422445f3683855301a86b5c2f1ae61a897d94.
- 독립 수학 REVIEW 0, main 0, DB 0. 45문항 = 신규 L4 45종이 아님.

## 기존 RPM과 비교해야 할 확장 축
| 원본 | 기존 RPM L3 | 재검할 EXT L4 후보 |
|---|---|---|
| q1 | 조합의 뜻과 계산 | 항등식, 비율 역산, 대칭 조합 |
| q2 | 순열 | 틈 배치, 거리 제한, 이중 묶음, 정확한 인접쌍, 교대 |
| q4 | 다항식의 곱셈 | 항 선택 기여계수, 계수 역조건, 대칭 인수쌍 |
| q6 | 행렬의 연산 | 미지 성분 조건, 선형 집계, AB/BA 합 |
| q7 | 연립일차부등식 | 정수해 수·합 역조건, 구간 포함, 경계 한 점 |
| q12 | 분할·분배 | 선택 후 배열 제약, 무명분할, 비공집합 분배 |
| q15 | 합·곱의 법칙의 이전 단원 semantic | 반복 숫자 선택과 배수 판정 |

## q15 발견
q15의 target subUnit은 H22-C-08-COUNTING_PRINCIPLE이지만, RPM Primary H1-RPM-186과 H1-RPM-187에 이미 합·곱의 법칙 L3가 H22-C-07-CORE 범위로 존재한다. 새 L3가 아예 필요하다고 결론 내리지 않는다. 원래 target L2를 보존한 채 prior same-grade scope 재사용과 새로운 L4 필요성을 별도 REVIEW해야 한다. 기존 q15 HOLD는 역사 기록으로 보존하며 아직 생성 UID 0이다.

## 다음 배치
B02부터 기존 RPM L3/L4 및 earlier/lower-only lookup → EXT L4/L3 후보 → Condition/CrossConcept/Integration과 중복 비교를 먼저 Git design에 저장한 뒤 출제한다. 신규 L3/L4는 별도 후보 등록부에서 심사하고 canonical 자동 승격하지 않는다.

근거: B01R2_BATCH_DESIGN.json, B01R2_CREATE_RECEIPT.json, bokseong-2026-1final-create-index-v2.json, ALIVE_LITE_L3_L4_EXTENSION_DISCOVERY_CONTRACT_v1.md.
