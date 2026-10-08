# 복성고 B03 CREATE → 독립 REVIEW 인계

- Original: `26_복성고_1학기_기말_고1_기출.js`; original Git blob `8266fa476906e9134b94f23e803bd3b2fb26ece4`.
- q9 10문항, q13 9문항, q14 10문항, q16 9문항 = **38개 신규 UID**. 입력 인덱스: `archive/data/generated-lite/bokseong-2026-1final-b03-create-index-v1.json`.
- 모든 학생용 후보의 발문·5지·저장 정답·학생용 해설을 먼저 출제했으며 생성자 계산 witness 38/38 확인. **독립 Blind 수학검수는 아직 하지 않음.**
- **q13 단원 순서 필수:** 원본 seed는 4단원 `H22-C-04-COMPLEX_ROOT`, 생성 학생문항은 6단원 `H22-C-06-HIGHER_EQUATION` / RPM L3 삼차·사차방정식 / H1-RPM-172. 복소수는 prerequisite. 독립 검수에서 실제 수학 주개념·교육과정 재판정.
- q14-I10 복수 진술 (가)·(나)·(다)의 참거짓을 독립 검증하고 보기는 유일한 하나를 선택하도록 확인.
- EXT 후보: L3 0개 / L4 12개. 수학적·의미 신규성은 아직 미승인. 유사한 Blueprint가 기존 RPM L4의 Condition-only 구조라면 신규 유형으로 세지 말 것.
- 정답 위치 ①9/②7/③8/④8/⑤6. 모든 객관식 5지 보기의 수학적 오개념·중복/동치 정답·해설 표기 검사.
- 이전 B01(45)·B02(38) 및 효천고 역사 승인 UID는 자동 재검 대상 아님. APPROVED 문항만 별도 REVIEW+MAIN에서 등록·학생조회검증·main remote readback까지 마감.
- q9·q13·q14·q16 모두 CREATE source-discovery checkpoint 종료. REVIEW PASS/DB/main 아직 0.


## 2026-10-08 REVIEW 개선 인계
- B01/B02와 교차검사 결과 q14-I06은 B02 Q05-I06 발문 완전 중복, q14-I09은 B02 Q05-I04 숫자만 변경된 유형이므로 q14 두 UID의 지문·보기·해설을 핀포인트 재작성했습니다.
- 생성자 동결은 보존하고 신규 38문항(36 answer-clean student-first, q9 앞 두 건 선노출) 수학 정답 대조 일치, 수정 두 문항은 reviewer-authored 재검 대상으로 표시합니다.
- 기존 ①9/②7/③8/④8/⑤6 분포는 변함없습니다. RPM 정식 유형 승격 없음. 학생용 Consumer 등록은 별도 release gate입니다.
