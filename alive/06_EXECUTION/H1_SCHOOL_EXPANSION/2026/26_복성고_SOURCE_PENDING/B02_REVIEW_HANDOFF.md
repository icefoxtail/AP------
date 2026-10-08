# 복성고 B02 CREATE → 독립 REVIEW 인계 (단원순서 보정 v2)

- 원본 5개(q3,5,8,10,11), 신규 UID 38개, 학생용 5지·해설 작성 완료. 작성자의 계산 확인과 독립 수학 PASS는 별도다.
- q8의 **7개 UID**는 6단원 `H22-C-06-HIGHER_EQUATION`, RPM `H1-RPM-172`(삼차·사차방정식/인수분해형)로 물리적으로 이동. 켤레복소수는 4단원 prerequisite, source seed 4단원 provenance 유지. 신규 L3 후보는 철회했으며 허근쌍 기반 EXT L4만 신규성 심사.
- q11의 **9개 UID**는 6단원 `H22-C-06-INEQUALITY` 아래 신규 L3 후보 '절댓값을 포함한 부등식'으로 구별. RPM의 절대부등식/AMGM/코시형과 혼동하지 않는다. 분류 후보표: archive/data/meta-foundation/candidates/high1/2022-commonmath1-absolute-value-inequality-v1.json.
- 주분류 규칙: docs/rules/01_CANONICAL/JS아카이브_단원순서_주개념분류_운영규정_v1.md.
- 별도 q10 행렬의 뜻/연산 주개념 경계는 REVIEW 판정 필요. q11 candidate taxonomy 정식 승격 아님.
- 실제 학생용 경로는 `archive/data/generated-lite/bokseong-2026-1final-b02-create-index-v1.json`의 studentSource. q8 원래 4단원 shard는 더 이상 존재하지 않는다.
- 객관식 38문항을 blind 독립 풀이·정답 frozen 비교 → 오개념 선지 5개 전수 → Primary Method L3/L4 재판정 후 결과 기록. 정답 위치 ①3/②5/③12/④12/⑤6. 기존 B01·효천고 승인 증거를 자동 재검하지 말 것.
- REVIEW 승인 후 Generated Bank Consumer DB 물리 등록 및 학생 조회검증까지 같은 REVIEW+MAIN에서 완료. CREATE는 main/DB/승인 0.


## B01/B02 REVIEW repair 2026-10-08
- 잘못된 CORE 14건을 MATRIX_OPERATION(13)/MATRIX_BASIC(1)로 재매핑 및 물리 shard 분리.
- 중복 2·교육과정 이탈 5문항 전부 새 발문·오개념 기반 보기·해설로 교체. q8과 q11 기존 교체 유지.
- 83 UID 해설·정답·마스터 의미 대조 완료. release/DB/Student smoke는 독립 게이트.
