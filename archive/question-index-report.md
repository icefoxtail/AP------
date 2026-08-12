# question-index 생성 리포트

- 생성 시각: 2026-08-12T06:29:03.502Z
- 인덱싱 범위(SCOPE): git-tracked + db-listed (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 422
- 시험지 파일 수: 432
- 원본 문항 수(중복 제거 전): 10552
- 최종 인덱스 문항 수(중복 제거 후): 10527
- 중복 qKey로 제외된 레코드: 25 (그룹 25)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 429081 bytes
- 시험지 JS 총 크기: 13077810 bytes
- 인덱스 크기: 7002391 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(10527)" 기준이다.

## 표준단원키 분류 (공식 마스터 142개 기준)

- 공식(official): 10048
- RAW-(임시 규약, 허용): 216 (distinct 87)
- 비공식(invalid): 249 (distinct 39)
- 빈 키(empty): 14

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 1
- 누락 content: 2
- 누락 choices: 176
- 누락 level: 345
- 누락 standardUnit: 15
- 누락 standardUnitKey: 14
- 누락 standardCourse: 13
- 누락 tags: 15

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 1661
- content 내부 <img>: 5
- content 내부 <svg>: 77
- content 내부 <table>: 132
- 시각요소 보유(hasImage=true, OR 합산): 1872

## 누락 예시

### id
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)

### content
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/high/h2/1mid/25_수피아여고_1학기_중간_고2_확률과통계.js#10

### choices
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js#26
  - original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js#27
  - original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js#28
  - original/high/h1/2final/21_강남여고_2학기_기말_고1_기출.js#29
  - original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js#21
  - original/high/h1/2final/21_금당고_2학기_기말_고1_기출.js#22
  - original/high/h1/2final/21_복성고_2학기_기말_고1_기출.js#22

### level
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#1
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#2
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#3
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#4
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#5
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#6
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#7

### standardUnit
  - original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js#12
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#13
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#14
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#15
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#16
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#17
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#18

### standardUnitKey
  - original/high/h1/1final/22_효천고_1학기_기말_고1_기출.js#12
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#13
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#14
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#15
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#16
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#17
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#18

### standardCourse
  - original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js#(빈 id)
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#13
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#14
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#15
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#16
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#17
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#18
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#19

### tags
  - types/high/h1/항등식과나머지정리_고1_유형1.js#1
  - types/high/h1/항등식과나머지정리_고1_유형1.js#2
  - types/high/h1/항등식과나머지정리_고1_유형1.js#3
  - types/high/h1/항등식과나머지정리_고1_유형1.js#5
  - types/high/h1/항등식과나머지정리_고1_유형1.js#8
  - types/high/h1/항등식과나머지정리_고1_유형1.js#12
  - types/high/h1/항등식과나머지정리_고1_유형1.js#13
  - types/high/h1/항등식과나머지정리_고1_유형1.js#14

### undefined/비객체 문항
  - 없음

## 실패 파일

- 없음
