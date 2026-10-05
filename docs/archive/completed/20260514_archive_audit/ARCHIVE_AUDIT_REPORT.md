# ARCHIVE_AUDIT_REPORT

## 0. 요약
- 점검 일시: 2026-05-14T10:03:22.456Z
- 전체 판정: FAIL
- db 등록 자료 수: 135
- exams 실제 파일 수: 139
- 이미지 경로 수: 20
- 주요 WARN 수: 8866
- 주요 FAIL 수: 2

## 1. db.js ↔ exams 파일 정합성
### FAIL (0)
- 없음

### WARN (26)
- db 미등록 실제 파일: `original/high/h1/1final/25_팔마고_1학기_기말_고1_기출.js`
- db 미등록 실제 파일: `original/high/h1/1final/25_효천고_1학기_기말_고1_기출.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사1.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_금당고_1학기_기말_고1_심화.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_금당고_1학기_기말_고1_확인.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사1.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사2.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사1.js`
- db 미등록 실제 파일: `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사2.js`
- db 미등록 실제 파일: `similar/high/h1/1mid/23_매산고_1학기_중간_고1_유사.js`
- db 미등록 실제 파일: `similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js`
- db 미등록 실제 파일: `similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js`
- db 미등록 실제 파일: `similar/high/h1/1mid/25_제일고_1학기_중간_고1_유사.js`
- db 미등록 실제 파일: `similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사.js`
- db 미등록 실제 파일: `similar/high/h2/1mid/24_금당고_1학기_중간_고2_유사.js`
- db 미등록 실제 파일: `similar/high/h2/1mid/25_제일고_1학기_중간_고2_유사.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사1.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사2.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사3.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사1.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/24_왕운중_1학기_중간_중3_유사.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사1.js`
- db 미등록 실제 파일: `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사2.js`

### PASS (3)
- db.js 해석 성공: 135개 등록
- 실제 exam JS 파일 139개 확인
- db.js ↔ exams 파일 정합성 점검은 경로 정규화 보정 적용 후 수행됨. 정규화 항목: types/similar 호환, 학기 축 디렉터리, c.js 접미사, basename fallback.

## 2. db.js 메타데이터 점검
### FAIL (0)
- 없음

### WARN (289)
- db[0] original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[1] original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[2] original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js: 필수 메타 누락 -> topic
- db[3] original/high/h1/1mid/26_효천고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[3] original/high/h1/1mid/26_효천고_1학기_중간_고1_기출.js: subject 누락
- db[4] original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic, subject
- db[4] original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js: subject 누락
- db[5] original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[6] original/high/h2/1mid/25_수피아여고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[7] original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[8] original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[9] original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[10] original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[11] original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[12] original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[13] original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[14] types/high/h2/25_제일고_1학기_중간_고2_심화.js: 필수 메타 누락 -> topic, subject
- db[14] types/high/h2/25_제일고_1학기_중간_고2_심화.js: subject 누락
- db[15] types/high/h2/25_제일고_1학기_중간_고2_유사.js: 필수 메타 누락 -> topic, subject
- db[15] types/high/h2/25_제일고_1학기_중간_고2_유사.js: subject 누락
- db[16] types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js: 필수 메타 누락 -> subject
- db[16] types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js: subject 누락
- db[17] original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js: 필수 메타 누락 -> topic
- db[18] original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[18] original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js: subject 누락
- db[19] original/high/h1/1final/25_금당고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[19] original/high/h1/1final/25_금당고_1학기_기말_고1_기출.js: subject 누락
- db[20] original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[20] original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js: subject 누락
- db[21] original/high/h1/1final/25_매산고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[21] original/high/h1/1final/25_매산고_1학기_기말_고1_기출.js: subject 누락
- db[22] original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[22] original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js: subject 누락
- db[23] original/high/h1/1final/25_매산여고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[23] original/high/h1/1final/25_매산여고_1학기_기말_고1_기출.js: subject 누락
- db[24] original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[24] original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js: subject 누락
- db[25] original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[25] original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js: subject 누락
- db[26] original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[26] original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js: subject 누락
- db[27] original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[27] original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js: subject 누락
- db[28] original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[28] original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js: subject 누락
- db[29] original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[29] original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js: subject 누락
- db[30] original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[30] original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js: subject 누락
- db[31] types/high/h1/25_강남여고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic, subject
- db[31] types/high/h1/25_강남여고_1학기_기말_고1_유사1.js: subject 누락
- db[32] types/high/h1/25_강남여고_1학기_기말_고1_유사2.js: 필수 메타 누락 -> topic, subject
- db[32] types/high/h1/25_강남여고_1학기_기말_고1_유사2.js: subject 누락
- db[33] types/high/h1/25_강남여고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic, subject
- db[33] types/high/h1/25_강남여고_1학기_중간_고1_유사.js: subject 누락
- db[34] types/high/h1/25_순천여고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic, subject
- db[34] types/high/h1/25_순천여고_1학기_중간_고1_유사.js: subject 누락
- db[35] types/high/h1/25_제일고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic, subject
- db[35] types/high/h1/25_제일고_1학기_중간_고1_유사.js: subject 누락
- db[36] types/high/h1/25_팔마고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic, subject
- db[36] types/high/h1/25_팔마고_1학기_기말_고1_유사1.js: subject 누락
- db[37] types/high/h1/25_팔마고_1학기_기말_고1_유사2.js: 필수 메타 누락 -> topic, subject
- db[37] types/high/h1/25_팔마고_1학기_기말_고1_유사2.js: subject 누락
- db[38] types/high/h1/25_팔마고_1학기_중간_고1_유사.js: 필수 메타 누락 -> topic, subject
- db[38] types/high/h1/25_팔마고_1학기_중간_고1_유사.js: subject 누락
- db[39] types/high/h1/25_효천고_1학기_기말_고1_유사1.js: 필수 메타 누락 -> topic, subject
- db[39] types/high/h1/25_효천고_1학기_기말_고1_유사1.js: subject 누락
- db[40] types/high/h1/25_효천고_1학기_기말_고1_유사2.js: 필수 메타 누락 -> topic, subject
- db[40] types/high/h1/25_효천고_1학기_기말_고1_유사2.js: subject 누락
- db[41] original/middle/m3/1mid/25_금당중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic, subject
- db[41] original/middle/m3/1mid/25_금당중_1학기_중간_중3_기출.js: subject 누락
- db[42] original/middle/m3/1mid/25_신흥중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic, subject
- db[42] original/middle/m3/1mid/25_신흥중_1학기_중간_중3_기출.js: subject 누락
- db[43] original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic, subject
- db[43] original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js: subject 누락
- db[44] types/middle/m3/25_왕운중_1학기_중간_중3_유사1.js: 필수 메타 누락 -> topic, subject
- db[44] types/middle/m3/25_왕운중_1학기_중간_중3_유사1.js: subject 누락
- db[45] types/middle/m3/25_왕운중_1학기_중간_중3_유사2.js: 필수 메타 누락 -> topic, subject
- db[45] types/middle/m3/25_왕운중_1학기_중간_중3_유사2.js: subject 누락
- db[46] original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js: 필수 메타 누락 -> topic, subject
- db[46] original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js: subject 누락
- db[47] original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js: 필수 메타 누락 -> topic, subject
- db[47] original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js: subject 누락
- db[48] original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js: 필수 메타 누락 -> topic, subject
- db[48] original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js: subject 누락
- db[49] original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js: 필수 메타 누락 -> topic, subject
- db[49] original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js: subject 누락
- db[50] original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js: 필수 메타 누락 -> topic
- db[51] original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js: 필수 메타 누락 -> topic
- db[52] types/high/h2/24_금당고_1학기_중간_고2_유사.js: 필수 메타 누락 -> topic, subject
- db[52] types/high/h2/24_금당고_1학기_중간_고2_유사.js: subject 누락
- db[53] original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[53] original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js: subject 누락
- db[54] original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[54] original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js: subject 누락
- db[55] original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[55] original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js: subject 누락
- db[56] original/high/h1/1mid/24_효천고_1학기_중간_고1_기출.js: 필수 메타 누락 -> topic, subject
- db[56] original/high/h1/1mid/24_효천고_1학기_중간_고1_기출.js: subject 누락
- db[57] original/middle/m3/1mid/24_금당중_1학기_중간_중3_기출.js: 필수 메타 누락 -> topic, subject
- 외 189개

### PASS (0)
- 없음

## 3. exams JS 구조 점검
### FAIL (0)
- 없음

### WARN (6708)
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q1: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q2: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q3: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q4: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q5: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q6: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q7: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q8: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q9: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q10: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q11: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q12: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q13: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q14: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q15: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q16: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q17: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q18: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q19: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q20: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q21: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q22: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q23: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q1: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q1: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q1: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q1: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q2: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q2: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q2: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q2: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q3: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q3: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q3: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q3: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q4: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q4: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q4: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q4: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q5: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q5: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q5: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q5: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q6: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q6: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q6: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q6: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q7: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q7: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q7: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q7: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q8: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q8: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q8: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q8: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q9: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q9: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q9: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q9: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q10: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q10: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q10: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q10: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q11: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q11: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q11: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q11: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q12: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q12: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q12: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q12: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q13: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q13: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q13: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q13: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q14: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q14: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q14: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q14: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q15: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q15: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q15: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q15: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q16: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q16: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q16: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q16: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q17: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q17: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q17: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q17: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q18: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q18: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q18: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q18: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q19: questionType 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q19: layoutTag 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q19: tags 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q19: wide 누락 가능성
- archive/exams/original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js q20: questionType 누락 가능성
- 외 6608개

### PASS (0)
- 없음

## 4. 이미지 연결 점검
### FAIL (1)
- archive/exams/original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js: 이미지 파일 없음 -> `assets/images/25_제일고_1학기_기말_고1_기출/q15.png`

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

### WARN (285)
- archive/exams/original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js q20: tags가 빈 배열인데 시각 요소 포함
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q12: tags가 빈 배열인데 시각 요소 포함
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q15: tags가 빈 배열인데 시각 요소 포함
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q16: tags가 빈 배열인데 시각 요소 포함
- archive/exams/original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js q23: tags가 빈 배열인데 시각 요소 포함
- archive/exams/original/high/h1/1final/25_팔마고_1학기_기말_고1_기출.js q18: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q17: RAW- 포함
- archive/exams/original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js q1: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q18: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q17: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js q15: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js q19: RAW- 포함
- archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js q22: RAW- 포함
- archive/exams/original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js q23: RAW- 포함
- archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js q12: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js q18: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js q11: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js q20: 작업 마커 잔존
- archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js q8: RAW- 포함
- archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js q15: RAW- 포함
- archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js q17: RAW- 포함
- archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js q19: RAW- 포함
- archive/exams/original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js q21: RAW- 포함
- archive/exams/original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js q10: RAW- 포함
- archive/exams/original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js q11: RAW- 포함
- archive/exams/original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js q14: RAW- 포함
- archive/exams/original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js q17: RAW- 포함
- archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js q8: RAW- 포함
- archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js q13: RAW- 포함
- archive/exams/original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js q20: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q2: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q3: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q5: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q6: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q12: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q17: RAW- 포함
- archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js q19: RAW- 포함
- archive/exams/original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js q10: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js q11: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js q18: 작업 마커 잔존
- archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js q6: RAW- 포함
- archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js q6: RAW- 포함
- archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js q14: RAW- 포함
- archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js q16: RAW- 포함
- archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js q24: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q6: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q7: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q8: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q15: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q16: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q23: RAW- 포함
- archive/exams/original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js q24: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q5: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q6: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q10: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q11: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q12: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q20: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q21: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js q22: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q8: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q9: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q10: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q11: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q12: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q16: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js q24: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js q20: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js q21: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q10: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q15: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q16: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q17: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q18: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q19: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js q20: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q6: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q7: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q8: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q11: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q12: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q13: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q14: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q21: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q22: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q23: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js q24: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q7: RAW- 포함
- archive/exams/original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js q8: RAW- 포함
- 외 185개

### PASS (0)
- 없음

## 7. 믹서 원본 추적 점검
### FAIL (0)
- 없음

### WARN (1558)
- archive/exams/original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js q19: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q1: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q2: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q3: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q4: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q5: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q6: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q7: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q8: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q9: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q10: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q11: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q12: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q13: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q14: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q15: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q16: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q17: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q18: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q19: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js q20: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q1: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q2: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q3: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q4: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q5: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q6: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q7: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q8: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q9: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q10: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q11: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q12: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q13: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q14: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q15: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q16: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q17: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q18: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q19: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q20: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q21: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js q22: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q1: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q2: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q3: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q4: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q5: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q6: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q7: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q8: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q9: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q10: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q11: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q12: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q13: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q14: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q15: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q16: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q17: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q18: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q19: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q20: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q21: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q22: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js q23: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q1: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q2: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q3: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q4: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q5: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q6: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q7: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q8: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q9: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q10: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q11: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q12: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q13: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q14: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q15: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q16: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q17: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q18: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q19: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q20: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js q21: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q1: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q2: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q3: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q4: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q5: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q6: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q7: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q8: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q9: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q10: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q11: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q12: solution에 [키포인트] 없음
- archive/exams/original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js q13: solution에 [키포인트] 없음
- 외 1458개

### PASS (2)
- mixer.html _sourceFile/_sourceTitle 흐름 확인
- engine.html exam_blueprints 흐름 확인

## 8. AP Math OS 연결 파일 점검
### FAIL (1)
- schema.sql 없음

### WARN (0)
- 없음

### PASS (7)
- apmath/js/qr-omr.js 존재
- apmath/js/clinic-print.js 존재
- apmath/js/report.js 존재
- apmath/js/student.js 존재
- apmath/js/core.js 존재
- apmath/worker-backup/worker/index.js 존재
- apmath/worker-backup/worker/schema.sql 존재

## 9. 다음 조치 추천
- 1순위: FAIL 항목부터 정리해 db 등록 누락, 이미지 누락, 연결 파일 부재를 해소한다.
- 2순위: db 메타데이터 누락과 exam 구조 누락을 표준 스키마 기준으로 정리한다.
- 3순위: mixed_engine 원본 추적과 schema 연결 여부를 실제 배포 흐름 기준으로 보강한다.
