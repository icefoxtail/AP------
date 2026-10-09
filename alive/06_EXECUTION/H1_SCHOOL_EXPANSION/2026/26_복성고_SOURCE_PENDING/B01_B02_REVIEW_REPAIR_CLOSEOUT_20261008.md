# 복성고 B01·B02 검수/수정 원장 — 2026-10-08

**Scope:** 2026 복성고 고1 1학기 기말 source Git blob `8266fa476906e9134b94f23e803bd3b2fb26ece4`. 생산자 브랜치 B01·B02 기준 커밋 `89527ab6e1ca0a891ff35d7851f0f8e3471c496f`. 생산자 B03 작업과 별도 REVIEW 격리.

## 수정 전후
- B01 45문항, B02 38문항, 총 83 UID 유지. 학생용 12개 JS shard.
- B01→B02 동일 문제 2개 대체: `Q03-M05`(동일 행렬 첫째 행 성분합 대신 열 합 비교), `Q03-M06`(동일 A+B,A-B 대신 A-B,2A+B로 한 성분 결정).
- B02 `Q10-D01,D02,D03,D07,D08` 5건은 공통수학1 행렬 크기 상한에 맞춰 재출제. 각 문제의 모든 명시 행렬 차원은 2 이하.
- 메타 14건: q3 6 + q10 7 → `H22-C-09-MATRIX_OPERATION`, q10 D05 → `H22-C-09-MATRIX_BASIC`. CORE 오염과 상이한 subUnit label 제거. q8 7건 이전 교체(H22-C-06-HIGHER_EQUATION, 삼차·사차방정식 RPM L3) 보존. q11 절댓값 부등식 L3는 독립 후보 유지, 정식 승격 0.

## 83문항 현재 정적·수리 대조
- 실제 최종 12개 JS shard의 발문/보기에서 계산한 수치 정답을 5개 보기 전부와 비교: **83/83 한 개 정답, 저장 answer 동일**.
- answer↔solution 마지막 결론 **83/83**. 사용 레벨 하/중/상 및 canonical compiled subUnit key·parent·label **83/83**. UID 중복 0, literal duplicate stems 0, q10 크기 초과 0.
- 9개 L2 manifest에서 Bokseong 83 UID 정확히 1회; 기존 Hyocheon approved 17 UID가 공존하는 manifest 내용 보존. B01 original 45 UID 보호.
- 정답 위치 before [12,13,24,23,11] → after [12,14,25,23,9]; B02 before [3,5,12,12,6] → after [3,6,13,12,4]. 40% 초과 정답 위치 없음. 수정 7문항의 보기 오개념 설계 보정, 정상 문항 기계적 shuffle 0.

## 서로 다른 품질 게이트
- `MATH_STATIC_AND_MANIFEST_REVIEW=PASS` (수치·보기·해설 결론·Meta current-pass).
- `FORMAL_FRESH_BLIND_SHA_FREEZE=NOT_TESTED`: 기존 세션에서 일부 정답/해설이 이미 노출됐으므로 공식 독립 blind pass를 소급 주장하지 않음.
- `ACTUAL_BROWSER_RENDER=NOT_TESTED`; `STUDENT_CONSUMER_REGISTRATION=NOT_DONE`; `STUDENT_SUPPLY_VERIFIED=NOT_TESTED`.
- `RPM_L3_L4_EXTENSION_CANONICAL_APPROVAL=0`. 별도 신규 유형 후보를 정식 RPM에 반영하지 않음.
- 해당 범위의 코드·후보·원장은 안전하게 main 병합할 수 있지만, 위 세 gate의 증거 없이 student-selectable/공급 완료를 주장할 수 없음. 학생용 등록은 별도 최종 release 조건.

## 보호 경계
- Archive original, RPM LOCKED, existing Hyocheon consumer 92 UID, B03 producer branch, 다른 시험지 파일 및 제품 런타임 변경 0.
