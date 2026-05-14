# ARCHIVE_DB_MISSING_RECHECK

## 0. 요약
- 기존 db 등록 파일 없음: 24
- audit 오탐: 0
- 경로 표기 차이: 24
- 실제 파일 누락: 0
- db.js 등록 오류: 0
- 확인 필요: 0

## 1. db.js file 원형 목록

| 번호 | db.js file 값 |
|---:|---|
| 1 | `original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js` |
| 2 | `original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js` |
| 3 | `original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js` |
| 4 | `original/high/h1/1mid/26_효천고_1학기_중간_고1_기출.js` |
| 5 | `original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js` |
| 6 | `original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js` |
| 7 | `original/high/h2/1mid/25_수피아여고_1학기_중간_고2_확률과통계.js` |
| 8 | `original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js` |
| 9 | `original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js` |
| 10 | `original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js` |
| 11 | `original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js` |
| 12 | `original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js` |
| 13 | `original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js` |
| 14 | `original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js` |
| 15 | `types/high/h2/25_제일고_1학기_중간_고2_심화.js` |
| 16 | `types/high/h2/25_제일고_1학기_중간_고2_유사.js` |
| 17 | `types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js` |
| 18 | `original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js` |
| 19 | `original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js` |
| 20 | `original/high/h1/1final/25_금당고_1학기_기말_고1_기출.js` |
| 21 | `original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js` |
| 22 | `original/high/h1/1final/25_매산고_1학기_기말_고1_기출.js` |
| 23 | `original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js` |
| 24 | `original/high/h1/1final/25_매산여고_1학기_기말_고1_기출.js` |
| 25 | `original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js` |
| 26 | `original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js` |
| 27 | `original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js` |
| 28 | `original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js` |
| 29 | `original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js` |
| 30 | `original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js` |
| 31 | `original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js` |
| 32 | `types/high/h1/25_강남여고_1학기_기말_고1_유사1.js` |
| 33 | `types/high/h1/25_강남여고_1학기_기말_고1_유사2.js` |
| 34 | `types/high/h1/25_강남여고_1학기_중간_고1_유사.js` |
| 35 | `types/high/h1/25_순천여고_1학기_중간_고1_유사.js` |
| 36 | `types/high/h1/25_제일고_1학기_중간_고1_유사.js` |
| 37 | `types/high/h1/25_팔마고_1학기_기말_고1_유사1.js` |
| 38 | `types/high/h1/25_팔마고_1학기_기말_고1_유사2.js` |
| 39 | `types/high/h1/25_팔마고_1학기_중간_고1_유사.js` |
| 40 | `types/high/h1/25_효천고_1학기_기말_고1_유사1.js` |
| 41 | `types/high/h1/25_효천고_1학기_기말_고1_유사2.js` |
| 42 | `original/middle/m3/1mid/25_금당중_1학기_중간_중3_기출.js` |
| 43 | `original/middle/m3/1mid/25_신흥중_1학기_중간_중3_기출.js` |
| 44 | `original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js` |
| 45 | `types/middle/m3/25_왕운중_1학기_중간_중3_유사1.js` |
| 46 | `types/middle/m3/25_왕운중_1학기_중간_중3_유사2.js` |
| 47 | `original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js` |
| 48 | `original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js` |
| 49 | `original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js` |
| 50 | `original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js` |
| 51 | `original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js` |
| 52 | `original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js` |
| 53 | `types/high/h2/24_금당고_1학기_중간_고2_유사.js` |
| 54 | `original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js` |
| 55 | `original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js` |
| 56 | `original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js` |
| 57 | `original/high/h1/1mid/24_효천고_1학기_중간_고1_기출.js` |
| 58 | `original/middle/m3/1mid/24_금당중_1학기_중간_중3_기출.js` |
| 59 | `original/middle/m3/1mid/24_왕운중_1학기_중간_중3_기출.js` |
| 60 | `types/middle/m3/24_왕운중_1학기_중간_중3_유사.js` |
| 61 | `original/middle/m2/1mid/24_문성중_1학기_중간_중2_기출.js` |
| 62 | `original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js` |
| 63 | `original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js` |
| 64 | `original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js` |
| 65 | `original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js` |
| 66 | `original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js` |
| 67 | `original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js` |
| 68 | `original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js` |
| 69 | `original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js` |
| 70 | `original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js` |
| 71 | `original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js` |
| 72 | `original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js` |
| 73 | `types/high/h1/23_매산고_1학기_중간_고1_유사.js` |
| 74 | `original/middle/m3/1mid/23_왕운중_1학기_중간_중3_기출.js` |
| 75 | `original/middle/m3/1mid/23_풍덕중_1학기_중간_중3_기출.js` |
| 76 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사1.js` |
| 77 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사2.js` |
| 78 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사3.js` |
| 79 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사1.js` |
| 80 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사2.js` |
| 81 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사3.js` |
| 82 | `original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js` |
| 83 | `original/middle/m3/1mid/22_팔마중_1학기_중간_중3_기출.js` |
| 84 | `original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` |
| 85 | `original/middle/m3/1mid/21_금당중_1학기_중간_중3_기출.js` |
| 86 | `original/middle/m3/1mid/21_동산중_1학기_중간_중3_기출.js` |
| 87 | `original/middle/m3/1mid/21_매산중_1학기_중간_중3_기출.js` |
| 88 | `original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js` |
| 89 | `original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js` |
| 90 | `original/middle/m3/1mid/21_왕운중_1학기_중간_중3_기출.js` |
| 91 | `original/middle/m3/1mid/21_팔마중_1학기_중간_중3_기출.js` |
| 92 | `original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js` |
| 93 | `original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js` |
| 94 | `original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js` |
| 95 | `original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js` |
| 96 | `original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js` |
| 97 | `original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js` |
| 98 | `original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js` |
| 99 | `original/middle/m3/1mid/19_금당중_1학기_중간_중3_기출.js` |
| 100 | `original/middle/m3/1mid/19_동산중_1학기_중간_중3_기출.js` |
| 101 | `original/middle/m3/1mid/19_연향중_1학기_중간_중3_기출.js` |
| 102 | `original/middle/m3/1mid/19_풍덕중_1학기_중간_중3_기출.js` |
| 103 | `original/middle/m2/1mid/19_동산중_1학기_중간_중2_기출.js` |
| 104 | `original/middle/m2/1mid/19_연향중_1학기_중간_중2_기출.js` |
| 105 | `types/high/h2/비상_대수_사인코사인법칙_고2_유형심화.js` |
| 106 | `types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js` |
| 107 | `types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형심화.js` |
| 108 | `types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형확인.js` |
| 109 | `types/high/h2/비상_대수_삼각함수_대단원_고2_유형심화.js` |
| 110 | `types/high/h2/비상_대수_삼각함수_대단원_고2_유형확인.js` |
| 111 | `types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js` |
| 112 | `types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js` |
| 113 | `types/high/h2/비상_대수_삼각함수_중단원_고2_유형심화.js` |
| 114 | `types/high/h2/비상_대수_삼각함수_중단원_고2_유형확인.js` |
| 115 | `types/high/h2/비상_대수_지수로그_대단원_고2_유형심화.js` |
| 116 | `types/high/h2/비상_대수_지수로그_대단원_고2_유형확인.js` |
| 117 | `types/high/h2/비상_대수_지수로그_익힘책_고2_유형심화.js` |
| 118 | `types/high/h2/비상_대수_지수로그_익힘책_고2_유형확인.js` |
| 119 | `types/high/h2/비상_대수_지수로그_중단원_고2_유형심화.js` |
| 120 | `types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js` |
| 121 | `types/high/h2/비상_대수_지수로그함수_익힘책_고2_유형심화.js` |
| 122 | `types/high/h2/비상_대수_지수로그함수_익힘책_고2_유형확인.js` |
| 123 | `types/high/h2/비상_대수_지수로그함수_중단원_고2_유형심화.js` |
| 124 | `types/high/h2/비상_대수_지수로그함수_중단원_고2_유형확인.js` |
| 125 | `types/high/h1/항등식과나머지정리_고1_유형.js` |
| 126 | `types/high/h1/항등식과나머지정리_고1_유형1.js` |
| 127 | `types/middle/m2/수와식_중2_유리수와순환소수_유형1.js` |
| 128 | `types/middle/m2/수와식_중2_유리수와순환소수_유형2.js` |
| 129 | `similar/middle/m1/1final/1학기_기말평가_중1_단원평가.js` |
| 130 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가.js` |
| 131 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가유사1.js` |
| 132 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가유사2.js` |
| 133 | `types/middle/m1/문자와식_중1_일차방정식활용_유형.js` |
| 134 | `types/middle/m1/문자와식_중1_일차방정식활용_유형1.js` |
| 135 | `types/middle/m1/문자와식_중1_일차방정식활용_유형2.js` |

## 2. archive/exams 실제 파일 목록

| 번호 | 실제 파일 경로 |
|---:|---|
| 1 | `original/high/h1/1final/25_강남여고_1학기_기말_고1_기출c.js` |
| 2 | `original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js` |
| 3 | `original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js` |
| 4 | `original/high/h1/1final/25_매산여고_1학기_기말_고1_기출.js` |
| 5 | `original/high/h1/1final/25_순천고_1학기_기말_고1_기출.js` |
| 6 | `original/high/h1/1final/25_순천여고_1학기_기말_고1_기출.js` |
| 7 | `original/high/h1/1final/25_제일고_1학기_기말_고1_기출.js` |
| 8 | `original/high/h1/1final/25_팔마고_1학기_기말_고1_기출.js` |
| 9 | `original/high/h1/1final/25_효천고_1학기_기말_고1_기출.js` |
| 10 | `original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js` |
| 11 | `original/high/h1/1mid/23_부영여고_1학기_중간_고1_기출.js` |
| 12 | `original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js` |
| 13 | `original/high/h1/1mid/23_여천고_1학기_중간_고1_기출.js` |
| 14 | `original/high/h1/1mid/23_충무고_1학기_중간_고1_기출.js` |
| 15 | `original/high/h1/1mid/23_한영고_1학기_중간_고1_기출.js` |
| 16 | `original/high/h1/1mid/24_여수고_1학기_중간_고1_기출.js` |
| 17 | `original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js` |
| 18 | `original/high/h1/1mid/24_한영고_1학기_중간_고1_기출.js` |
| 19 | `original/high/h1/1mid/24_효천고_1학기_중간_고1_기출.js` |
| 20 | `original/high/h1/1mid/25_강남여고_1학기_중간_고1_기출.js` |
| 21 | `original/high/h1/1mid/25_금당고_1학기_중간_고1_기출.js` |
| 22 | `original/high/h1/1mid/25_매산고_1학기_중간_고1_기출.js` |
| 23 | `original/high/h1/1mid/25_순천여고_1학기_중간_고1_기출.js` |
| 24 | `original/high/h1/1mid/25_제일고_1학기_중간_고1_기출.js` |
| 25 | `original/high/h1/1mid/25_팔마고_1학기_중간_고1_기출.js` |
| 26 | `original/high/h1/1mid/25_효천고_1학기_중간_고1_기출.js` |
| 27 | `original/high/h1/1mid/26_금당고_1학기_중간_고1_기출_c.js` |
| 28 | `original/high/h1/1mid/26_매산여고_1학기_중간_고1_기출_c.js` |
| 29 | `original/high/h1/1mid/26_팔마고_1학기_중간_고1_기출_c.js` |
| 30 | `original/high/h1/1mid/26_효천고_1학기_중간_고1_기출.js` |
| 31 | `original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js` |
| 32 | `original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js` |
| 33 | `original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js` |
| 34 | `original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js` |
| 35 | `original/high/h2/1mid/24_수피아여고_1학기_중간_고2_확률과통계.js` |
| 36 | `original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js` |
| 37 | `original/high/h2/1mid/25_수피아여고_1학기_중간_고2_확률과통계.js` |
| 38 | `original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js` |
| 39 | `original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js` |
| 40 | `original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js` |
| 41 | `original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js` |
| 42 | `original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js` |
| 43 | `original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js` |
| 44 | `original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js` |
| 45 | `original/middle/m2/1mid/19_동산중_1학기_중간_중2_기출.js` |
| 46 | `original/middle/m2/1mid/19_연향중_1학기_중간_중2_기출.js` |
| 47 | `original/middle/m2/1mid/20_풍덕중_1학기_중간_중2_기출.js` |
| 48 | `original/middle/m2/1mid/21_금당중_1학기_중간_중2_기출.js` |
| 49 | `original/middle/m2/1mid/21_신흥중_1학기_중간_중2_기출.js` |
| 50 | `original/middle/m2/1mid/21_연향중_1학기_중간_중2_기출.js` |
| 51 | `original/middle/m2/1mid/21_왕운중_1학기_중간_중2_기출.js` |
| 52 | `original/middle/m2/1mid/21_팔마중_1학기_중간_중2_기출.js` |
| 53 | `original/middle/m2/1mid/21_풍덕중_1학기_중간_중2_기출.js` |
| 54 | `original/middle/m2/1mid/24_문성중_1학기_중간_중2_기출.js` |
| 55 | `original/middle/m2/1mid/24_신흥중_1학기_중간_중2_기출c.js` |
| 56 | `original/middle/m2/1mid/24_연향중_1학기_중간_중2_기출.js` |
| 57 | `original/middle/m2/1mid/25_매산중_1학기_중간_중2_기출.js` |
| 58 | `original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js` |
| 59 | `original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js` |
| 60 | `original/middle/m2/1mid/25_진남중_1학기_중간_중2_기출.js` |
| 61 | `original/middle/m3/1mid/19_금당중_1학기_중간_중3_기출.js` |
| 62 | `original/middle/m3/1mid/19_동산중_1학기_중간_중3_기출.js` |
| 63 | `original/middle/m3/1mid/19_연향중_1학기_중간_중3_기출.js` |
| 64 | `original/middle/m3/1mid/19_풍덕중_1학기_중간_중3_기출.js` |
| 65 | `original/middle/m3/1mid/21_금당중_1학기_중간_중3_기출.js` |
| 66 | `original/middle/m3/1mid/21_동산중_1학기_중간_중3_기출.js` |
| 67 | `original/middle/m3/1mid/21_매산중_1학기_중간_중3_기출.js` |
| 68 | `original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js` |
| 69 | `original/middle/m3/1mid/21_연향중_1학기_중간_중3_기출.js` |
| 70 | `original/middle/m3/1mid/21_왕운중_1학기_중간_중3_기출.js` |
| 71 | `original/middle/m3/1mid/21_팔마중_1학기_중간_중3_기출.js` |
| 72 | `original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js` |
| 73 | `original/middle/m3/1mid/22_팔마중_1학기_중간_중3_기출.js` |
| 74 | `original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` |
| 75 | `original/middle/m3/1mid/23_왕운중_1학기_중간_중3_기출.js` |
| 76 | `original/middle/m3/1mid/23_풍덕중_1학기_중간_중3_기출.js` |
| 77 | `original/middle/m3/1mid/24_금당중_1학기_중간_중3_기출.js` |
| 78 | `original/middle/m3/1mid/24_왕운중_1학기_중간_중3_기출.js` |
| 79 | `original/middle/m3/1mid/25_금당중_1학기_중간_중3_기출.js` |
| 80 | `original/middle/m3/1mid/25_신흥중_1학기_중간_중3_기출.js` |
| 81 | `original/middle/m3/1mid/25_왕운중_1학기_중간_중3_기출.js` |
| 82 | `original/middle/m3/1mid/26_삼산중_1학기_중간_중3_기출.js` |
| 83 | `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사1.js` |
| 84 | `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js` |
| 85 | `similar/high/h1/1final/25_금당고_1학기_기말_고1_심화.js` |
| 86 | `similar/high/h1/1final/25_금당고_1학기_기말_고1_확인.js` |
| 87 | `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사1.js` |
| 88 | `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사2.js` |
| 89 | `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사1.js` |
| 90 | `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사2.js` |
| 91 | `similar/high/h1/1mid/23_매산고_1학기_중간_고1_유사.js` |
| 92 | `similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js` |
| 93 | `similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js` |
| 94 | `similar/high/h1/1mid/25_제일고_1학기_중간_고1_유사.js` |
| 95 | `similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사.js` |
| 96 | `similar/high/h2/1mid/24_금당고_1학기_중간_고2_유사.js` |
| 97 | `similar/high/h2/1mid/25_제일고_1학기_중간_고2_유사.js` |
| 98 | `similar/middle/m1/1final/1학기_기말평가_중1_단원평가.js` |
| 99 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가.js` |
| 100 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가유사1.js` |
| 101 | `similar/middle/m1/1mid/1학기_중간평가_중1_단원평가유사2.js` |
| 102 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사1.js` |
| 103 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사2.js` |
| 104 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사3.js` |
| 105 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사1.js` |
| 106 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2.js` |
| 107 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3.js` |
| 108 | `similar/middle/m3/1mid/24_왕운중_1학기_중간_중3_유사.js` |
| 109 | `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사1.js` |
| 110 | `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사2.js` |
| 111 | `types/high/h1/항등식과나머지정리_고1_유형.js` |
| 112 | `types/high/h1/항등식과나머지정리_고1_유형1.js` |
| 113 | `types/high/h2/25_제일고_1학기_중간_고2_심화.js` |
| 114 | `types/high/h2/25_제일고_1학기_중간_고2_확률과통계_유형확인.js` |
| 115 | `types/high/h2/비상_대수_사인코사인법칙_고2_유형심화.js` |
| 116 | `types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js` |
| 117 | `types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형심화.js` |
| 118 | `types/high/h2/비상_대수_사인코사인법칙_익힘책_고2_유형확인.js` |
| 119 | `types/high/h2/비상_대수_삼각함수_대단원_고2_유형심화.js` |
| 120 | `types/high/h2/비상_대수_삼각함수_대단원_고2_유형확인.js` |
| 121 | `types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js` |
| 122 | `types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js` |
| 123 | `types/high/h2/비상_대수_삼각함수_중단원_고2_유형심화.js` |
| 124 | `types/high/h2/비상_대수_삼각함수_중단원_고2_유형확인.js` |
| 125 | `types/high/h2/비상_대수_지수로그_대단원_고2_유형심화.js` |
| 126 | `types/high/h2/비상_대수_지수로그_대단원_고2_유형확인.js` |
| 127 | `types/high/h2/비상_대수_지수로그_익힘책_고2_유형심화.js` |
| 128 | `types/high/h2/비상_대수_지수로그_익힘책_고2_유형확인.js` |
| 129 | `types/high/h2/비상_대수_지수로그_중단원_고2_유형심화.js` |
| 130 | `types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js` |
| 131 | `types/high/h2/비상_대수_지수로그함수_익힘책_고2_유형심화.js` |
| 132 | `types/high/h2/비상_대수_지수로그함수_익힘책_고2_유형확인.js` |
| 133 | `types/high/h2/비상_대수_지수로그함수_중단원_고2_유형심화.js` |
| 134 | `types/high/h2/비상_대수_지수로그함수_중단원_고2_유형확인.js` |
| 135 | `types/middle/m1/문자와식_중1_일차방정식활용_유형.js` |
| 136 | `types/middle/m1/문자와식_중1_일차방정식활용_유형1.js` |
| 137 | `types/middle/m1/문자와식_중1_일차방정식활용_유형2.js` |
| 138 | `types/middle/m2/수와식_중2_유리수와순환소수_유형1.js` |
| 139 | `types/middle/m2/수와식_중2_유리수와순환소수_유형2.js` |

## 3. db 등록 파일 없음 재검증

| 번호 | db.js file 값 | 기존 판정 | 재검증 결과 | 실제 매칭 파일 | 판단 |
|---:|---|---|---|---|---|
| 1 | `types/high/h2/25_제일고_1학기_중간_고2_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h2/1mid/25_제일고_1학기_중간_고2_유사.js` | 경로 표기 차이 |
| 2 | `original/high/h1/1final/25_금당고_1학기_기말_고1_기출.js` | db 등록 파일 없음 | D. 접미사(c) 정리 시 매칭 | `original/high/h1/1final/25_금당고_1학기_기말_고1_기출c.js` | 경로 표기 차이 |
| 3 | `original/high/h1/1final/25_매산고_1학기_기말_고1_기출.js` | db 등록 파일 없음 | D. 접미사(c) 정리 시 매칭 | `original/high/h1/1final/25_매산고_1학기_기말_고1_기출c.js` | 경로 표기 차이 |
| 4 | `types/high/h1/25_강남여고_1학기_기말_고1_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사1.js` | 경로 표기 차이 |
| 5 | `types/high/h1/25_강남여고_1학기_기말_고1_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_강남여고_1학기_기말_고1_유사2.js` | 경로 표기 차이 |
| 6 | `types/high/h1/25_강남여고_1학기_중간_고1_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1mid/25_강남여고_1학기_중간_고1_유사.js` | 경로 표기 차이 |
| 7 | `types/high/h1/25_순천여고_1학기_중간_고1_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js` | 경로 표기 차이 |
| 8 | `types/high/h1/25_제일고_1학기_중간_고1_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1mid/25_제일고_1학기_중간_고1_유사.js` | 경로 표기 차이 |
| 9 | `types/high/h1/25_팔마고_1학기_기말_고1_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사1.js` | 경로 표기 차이 |
| 10 | `types/high/h1/25_팔마고_1학기_기말_고1_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_팔마고_1학기_기말_고1_유사2.js` | 경로 표기 차이 |
| 11 | `types/high/h1/25_팔마고_1학기_중간_고1_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1mid/25_팔마고_1학기_중간_고1_유사.js` | 경로 표기 차이 |
| 12 | `types/high/h1/25_효천고_1학기_기말_고1_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사1.js` | 경로 표기 차이 |
| 13 | `types/high/h1/25_효천고_1학기_기말_고1_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1final/25_효천고_1학기_기말_고1_유사2.js` | 경로 표기 차이 |
| 14 | `types/middle/m3/25_왕운중_1학기_중간_중3_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사1.js` | 경로 표기 차이 |
| 15 | `types/middle/m3/25_왕운중_1학기_중간_중3_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/25_왕운중_1학기_중간_중3_유사2.js` | 경로 표기 차이 |
| 16 | `types/high/h2/24_금당고_1학기_중간_고2_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h2/1mid/24_금당고_1학기_중간_고2_유사.js` | 경로 표기 차이 |
| 17 | `types/middle/m3/24_왕운중_1학기_중간_중3_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/24_왕운중_1학기_중간_중3_유사.js` | 경로 표기 차이 |
| 18 | `types/high/h1/23_매산고_1학기_중간_고1_유사.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/high/h1/1mid/23_매산고_1학기_중간_고1_유사.js` | 경로 표기 차이 |
| 19 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사1.js` | 경로 표기 차이 |
| 20 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사2.js` | 경로 표기 차이 |
| 21 | `types/middle/m3/23_왕운중_1학기_중간_중3_유사3.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_왕운중_1학기_중간_중3_유사3.js` | 경로 표기 차이 |
| 22 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사1.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사1.js` | 경로 표기 차이 |
| 23 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사2.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사2.js` | 경로 표기 차이 |
| 24 | `types/middle/m3/23_풍덕중_1학기_중간_중3_유사3.js` | db 등록 파일 없음 | C. basename만 비교 시 동일 파일명 존재 | `similar/middle/m3/1mid/23_풍덕중_1학기_중간_중3_유사3.js` | 경로 표기 차이 |

## 4. audit 스크립트 오탐 가능 원인

* 원인 1: `db.js`의 일부 등록값은 `types/...`를 쓰지만 실제 파일은 `similar/...` 아래에 있어 exact path 비교만으로는 누락으로 잡힌다.
* 원인 2: 실제 파일 경로에는 `1mid`, `1final` 같은 하위 디렉터리 축이 포함되는데 일부 `db.js` 값은 그 축 정보가 빠져 있다.
* 원인 3: `기출.js`와 `기출c.js`처럼 접미사 변형이 있는 파일은 basename 정규화 없이 비교하면 누락처럼 보인다.

## 5. 다음 조치 제안

1. archive_audit.js의 경로 정규화 보정 필요 여부: 필요함. `types -> similar`, 학기 축 디렉터리(`1mid`, `1final`) 보정, `c.js` 접미사 정규화 규칙을 추가하는 편이 맞다.
2. db.js 수정 필요 여부: 즉시 수정 확정 전, 현재 `db.js`가 의도적으로 축약 경로를 쓰는지 먼저 확인이 필요하다. 다만 실제 파일 체계와 불일치하는 항목은 존재한다.
3. 실제 파일 복구 필요 여부: 이번 24건 기준으로는 복구 필요 없음으로 본다. 실제 파일 부재보다는 경로 표기 체계 차이가 핵심이다.
