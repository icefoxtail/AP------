# ARCHIVE_AUDIT_REPORT

## 0. 요약
- 점검 일시: 2026-08-22T23:35:59.001Z
- 전체 판정: FAIL
- db 등록 자료 수: 435
- exams 실제 파일 수: 438
- 이미지 경로 수: 2055
- 주요 WARN 수: 4648
- 주요 FAIL 수: 2

## 1. db.js ↔ exams 파일 정합성
### FAIL (0)
- 없음

### WARN (3)
- db 미등록 실제 파일: `similar/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2_강화유사문제.js`
- db 미등록 실제 파일: `similar/high/h1/2mid/25_제일고_2학기_중간_고1_유사문제.js`
- db 미등록 실제 파일: `similar/high/h1/2mid/25_효천고_2학기_중간_고1_유사문제.js`

### PASS (3)
- db.js 해석 성공: 435개 등록
- 실제 exam JS 파일 438개 확인
- db.js ↔ exams 파일 정합성 점검은 경로 정규화 보정 적용 후 수행됨. 정규화 항목: types/similar 호환, 학기 축 디렉터리, c.js 접미사, basename fallback.

## 2. db.js 메타데이터 점검
### FAIL (0)
- 없음

### WARN (538)
- db[0] original/high/h2/1final/26_금당고_1학기_기말_고2_대수.js: 필수 메타 누락 -> topic
- db[1] original/high/h2/1final/26_순천고_1학기_기말_고2_대수.js: 필수 메타 누락 -> topic
- db[2] original/high/h2/1final/26_제일고_1학기_기말_고2_대수.js: 필수 메타 누락 -> topic
- db[3] original/high/h2/1final/26_팔마고_1학기_기말_고2_대수.js: 필수 메타 누락 -> topic
- db[4] original/high/h2/1final/26_효천고_1학기_기말_고2_대수.js: 필수 메타 누락 -> topic
- db[5] original/high/h2/1mid/26_효천고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[6] original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[7] original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[8] original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[9] original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[10] original/high/h1/1mid/26_매산고_1학기_중간_고1_기출c.js: 필수 메타 누락 -> topic
- db[11] original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[12] original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[13] original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[14] original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[15] original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[16] original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[17] original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[18] original/high/h1/1mid/26_효천고_1학기_중간_고1_기출c.js: 필수 메타 누락 -> topic
- db[19] original/middle/m3/1final/26_삼산중_1학기_기말_중3_기출.js: 필수 메타 누락 -> topic
- db[20] original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic
- db[21] original/middle/m3/1final/26_왕운중_1학기_기말_중3_기출.js: 필수 메타 누락 -> topic
- db[22] original/middle/m3/1mid/26_왕운중_1학기_중간_중3_기출c.js: 필수 메타 누락 -> topic
- db[23] original/middle/m3/1final/26_팔마중_1학기_기말_중3_기출.js: 필수 메타 누락 -> topic
- db[24] original/middle/m2/1final/26_동산중_1학기_기말_중2_기출.js: 필수 메타 누락 -> topic
- db[25] original/middle/m2/1final/26_신흥중_1학기_기말_중2_기출.js: 필수 메타 누락 -> topic
- db[26] original/middle/m2/1final/26_왕운중_1학기_기말_중2_기출.js: 필수 메타 누락 -> topic
- db[27] original/middle/m2/1final/26_왕의중_1학기_기말_중2_기출.js: 필수 메타 누락 -> topic
- db[28] original/middle/m2/1final/26_팔마중_1학기_기말_중2_기출.js: 필수 메타 누락 -> topic
- db[29] original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.js: 필수 메타 누락 -> topic
- db[30] original/high/h2/2final/25_강남여고_2학기_기말_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[31] original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js: 필수 메타 누락 -> topic
- db[32] original/high/h2/2final/25_금당고_2학기_기말_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[33] original/high/h2/2mid/25_금당고_2학기_중간_고2_미적분.js: 필수 메타 누락 -> topic
- db[34] original/high/h2/2mid/25_금당고_2학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[35] original/high/h2/2final/25_매산고_2학기_기말_고2_수학II.js: 필수 메타 누락 -> topic
- db[36] original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[37] original/high/h2/2mid/25_매산고_2학기_중간_고2_수학II.js: 필수 메타 누락 -> topic
- db[38] original/high/h2/1mid/25_매산고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[39] original/high/h2/2final/25_매산여고_2학기_기말_고2_수학II.js: 필수 메타 누락 -> topic
- db[40] original/high/h2/2mid/25_매산여고_2학기_중간_고2_수학II.js: 필수 메타 누락 -> topic
- db[41] original/high/h2/1mid/25_수피아여고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[42] original/high/h2/2final/25_순천고_2학기_기말_고2_수학II.js: 필수 메타 누락 -> topic
- db[43] original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[44] original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[45] original/high/h2/1mid/25_순천고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[46] original/high/h2/2mid/25_순천고_2학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[47] original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[48] original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[49] original/high/h2/1final/25_제일고_1학기_기말_고2_대수c.js: 필수 메타 누락 -> topic
- db[50] original/high/h2/2final/25_제일고_2학기_기말_고2_수학II.js: 필수 메타 누락 -> topic
- db[51] original/high/h2/1final/25_제일고_1학기_기말_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[52] original/high/h2/2final/25_제일고_2학기_기말_고2_확률과통계_기출.js: 필수 메타 누락 -> topic
- db[53] original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[54] original/high/h2/2mid/25_제일고_2학기_중간_고2_수학II.js: 필수 메타 누락 -> topic
- db[55] original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[56] original/high/h2/2mid/25_제일고_2학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[57] original/high/h2/1final/25_효천고_1학기_기말_고2_대수c.js: 필수 메타 누락 -> topic
- db[58] original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[59] original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[60] similar/high/h2/1mid/25_제일고_1학기_중간_고2_유사.js: 필수 메타 누락 -> topic
- db[61] types/high/h2/25_제일고_1학기_중간_고2_심화.js: 필수 메타 누락 -> topic
- db[63] original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[64] original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[65] original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[66] original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[67] original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[68] original/high/h1/2mid/25_금당고_2학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[69] original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[70] original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[71] original/high/h1/2mid/25_매산고_2학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[72] original/high/h1/1final/25_매산여고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[73] original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[74] original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[75] original/high/h1/2mid/25_순천고_2학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[76] original/high/h1/1final/25_순천여고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[77] original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[78] original/high/h1/2mid/25_순천여고_2학기_중간_고1_공통수학2.js: 필수 메타 누락 -> topic
- db[79] original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[80] original/high/h1/1final/25_제일고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[81] original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[82] original/high/h1/2mid/25_제일고_2학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[83] original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[84] original/high/h1/1final/25_팔마고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[85] original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[86] original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js: 필수 메타 누락 -> topic
- db[87] original/high/h1/1final/25_효천고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[88] original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[89] original/high/h1/2mid/25_효천고_2학기_중간_고1_기출.js: 필수 메타 누락 -> topic
- db[90] similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic
- db[91] similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js: 필수 메타 누락 -> topic
- db[92] similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic
- db[93] similar/high/h1/1final/25_금당고_1학기_기말_고1_심화.js: 필수 메타 누락 -> topic
- db[94] similar/high/h1/1final/25_금당고_1학기_기말_고1_확인.js: 필수 메타 누락 -> topic
- db[95] similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic
- db[96] similar/high/h1/1mid/25_제일고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic
- db[97] similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic
- db[98] similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사2.js: 필수 메타 누락 -> topic
- db[99] similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic
- db[100] similar/high/h1/1final/25_효천고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic
- 외 438개

### PASS (0)
- 없음

## 3. exams JS 구조 점검
### FAIL (0)
- 없음

### WARN (167)
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q1: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q1: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q2: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q2: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q3: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q3: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q4: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q4: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q5: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q5: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q6: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q6: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q7: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q7: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q8: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q8: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q9: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q9: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q10: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q10: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q11: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q11: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q12: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q12: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q13: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q13: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q14: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q14: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q15: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q15: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q16: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q16: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q17: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q17: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q18: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q18: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q19: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q19: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q20: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q20: wide 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q21: layoutTag 누락 가능성
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q21: wide 누락 가능성
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q1: questionType 누락 가능성
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q1: layoutTag 누락 가능성
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q1: wide 누락 가능성
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q24: layoutTag 누락 가능성
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q24: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q1: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q1: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q1: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q1: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q2: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q2: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q2: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q2: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q3: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q3: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q3: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q3: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q4: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q4: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q4: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q4: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q5: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q5: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q5: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q5: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q6: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q6: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q6: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q6: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q7: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q7: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q7: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q7: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q8: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q8: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q8: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q8: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q9: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q9: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q9: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q9: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q10: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q10: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q10: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q10: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q11: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q11: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q11: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q11: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q12: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q12: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q12: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q12: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q13: questionType 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q13: layoutTag 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q13: tags 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q13: wide 누락 가능성
- archive/exams/types/high/h1/항등식과나머지정리_고1_유형1.js q14: questionType 누락 가능성
- 외 67개

### PASS (0)
- 없음

## 4. 이미지 연결 점검
### FAIL (0)
- 없음

### WARN (0)
- 없음

### PASS (1)
- 이미지 루트 확인: `archive/assets/images`

## 5. 표준단원키 / tags / 마커 점검
### FAIL (0)
- 없음

### WARN (0)
- 없음

### PASS (0)
- 없음

## 6. 해설 상태 점검
### FAIL (0)
- 없음

### WARN (116)
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q12: standardUnitOrder가 0
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q18: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q17: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js q15: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js q11: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js q20: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js q10: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js q18: 작업 마커 잔존
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q1: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q2: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q3: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q4: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q5: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q6: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q7: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q8: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q9: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q10: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q11: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q12: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q13: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q14: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q15: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q16: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q17: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q18: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q19: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q20: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q21: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q22: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q23: standardUnitOrder가 0
- archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js q24: standardUnitOrder가 0
- archive/exams/original/middle/m1/2mid/23_연향중_2학기_중간_중1_기출.js q19: RAW- 포함
- archive/exams/original/middle/m1/2mid/24_향림중_2학기_중간_중1_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q12: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q21: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q24: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q19: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q20: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q11: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q12: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js q15: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js q10: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js q16: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js q15: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js q16: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m3/1mid/21_동산중_1학기_중간_중3_기출.js q14: RAW- 포함
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q13: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q13: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q14: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q14: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q15: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q15: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q16: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q16: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q17: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q17: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q18: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q18: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q19: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q19: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q20: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q20: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q21: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q21: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q22: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q22: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q23: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q23: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q24: standardUnitKey 빈 문자열
- archive/exams/original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js q24: standardUnit 빈 문자열
- archive/exams/original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js q11: 작업 마커 잔존
- archive/exams/original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js q14: 작업 마커 잔존
- archive/exams/original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js q4: 작업 마커 잔존
- archive/exams/similar/high/h1/1final/25_금당고_1학기_기말_고1_확인.js q13: 작업 마커 잔존
- archive/exams/similar/high/h1/1final/25_금당고_1학기_기말_고1_확인.js q17: 작업 마커 잔존
- archive/exams/similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js q16: tags가 빈 배열인데 시각 요소 포함
- archive/exams/similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js q19: tags가 빈 배열인데 시각 요소 포함
- archive/exams/similar/middle/m1/1final/AP수학학원_1학기_기말_중1_기말고사.js q6: tags가 빈 배열인데 시각 요소 포함
- archive/exams/similar/middle/m1/1final/AP수학학원_1학기_기말_중1_기말고사.js q10: tags가 빈 배열인데 시각 요소 포함
- archive/exams/similar/middle/m1/1final/AP수학학원_1학기_기말_중1_기말고사.js q21: 작업 마커 잔존
- archive/exams/similar/middle/m1/1final/AP수학학원_1학기_기말_중1_기말고사.js q22: tags가 빈 배열인데 시각 요소 포함
- archive/exams/similar/middle/m1/1final/AP수학학원_1학기_기말_중1_모의고사_4회.js q21: standardUnit 빈 문자열
- 외 16개

### PASS (0)
- 없음

## 7. 믹서 원본 추적 점검
### FAIL (0)
- 없음

### WARN (3824)
- archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js q16: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_복성고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_순천여고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_순천여고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_순천여고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_제일고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_팔마고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js q24: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js q25: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_금당고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_매산고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_복성고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_순천여고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_순천여고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_순천여고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_제일고_1학기_기말_고1_기출.js q11: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_제일고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_제일고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/23_팔마고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_금당고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_매산고_1학기_기말_고1_기출.js q16: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_매산고_1학기_기말_고1_기출.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_매산고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_매산고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_매산고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_제일고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/24_제일고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js q16: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_매산여고_1학기_기말_고1_기출c.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q1: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q2: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q3: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q4: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q5: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q6: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q7: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q8: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q9: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q10: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q11: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q12: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q13: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q14: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q15: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q16: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출c.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출c.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_광양제철고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js q18: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_금당고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js q17: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_매산고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_순천고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_순천여고_1학기_기말_고1_기출.js q23: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js q21: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_팔마고_1학기_기말_고1_기출.js q22: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js q19: solution 결론 확인 필요
- archive/exams/original/high/h1/1final/26_효천고_1학기_기말_고1_기출.js q20: solution 결론 확인 필요
- 외 3724개

### PASS (3)
- mixer.html _sourceFile/_sourceTitle 흐름 확인
- mixed_engine.html exam_blueprints 흐름 확인
- engine.html exam_blueprints 흐름 확인

## 8. AP Math OS 연결 파일 점검
### FAIL (2)
- apmath/js/report.js 없음
- schema.sql 없음

### WARN (0)
- 없음

### PASS (6)
- apmath/js/qr-omr.js 존재
- apmath/js/clinic-print.js 존재
- apmath/js/student.js 존재
- apmath/js/core.js 존재
- apmath/worker-backup/worker/index.js 존재
- apmath/worker-backup/worker/schema.sql 존재

## 9. 다음 조치 추천
- 1순위: FAIL 항목부터 정리해 db 등록 누락, 이미지 누락, 연결 파일 부재를 해소한다.
- 2순위: db 메타데이터 누락과 exam 구조 누락을 표준 스키마 기준으로 정리한다.
- 3순위: mixed_engine 원본 추적과 schema 연결 여부를 실제 배포 흐름 기준으로 보강한다.
