# question-index 생성 리포트

- 인덱싱 범위(SCOPE): git-tracked + db-listed production (parity-gated) (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 1211
- 시험지 파일 수: 1107
- 원본 문항 수(중복 제거 전): 27179
- 최종 인덱스 문항 수(중복 제거 후): 27179
- 중복 qKey로 제외된 레코드: 0 (그룹 0)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 1096517 bytes
- 시험지 JS 총 크기: 60658894 bytes
- 인덱스 크기: 11602618 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(27179)" 기준이다.

## 표준단원키 분류 (공식 마스터 143개 기준)

- 공식(official): 24220
- RAW-(임시 규약, 허용): 25 (distinct 7)
- 비공식(invalid): 632 (distinct 28)
- 빈 키(empty): 2302

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 0
- 누락 content: 1521
- 누락 choices: 28
- 누락 level: 2667
- 누락 standardUnit: 2474
- 누락 standardUnitKey: 2302
- 누락 standardCourse: 2226
- 누락 tags: 2772

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 4082
- content 내부 <img>: 1118
- content 내부 <svg>: 77
- content 내부 <table>: 388
- 시각요소 보유(hasImage=true, OR 합산): 5479

## 누락 예시

### id
  - 없음

### content
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q01
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q02
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q03
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q04
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q05
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q06
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q07
  - original/middle/m1/1final/19_금당중_1학기_기말_중1_수학.js#Q08

### choices
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#19
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#20
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#21
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#22
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#23
  - similar/high/h1/1final/26_금당고_1학기_기말_고1_유사.js#18
  - similar/high/h1/1final/26_금당고_1학기_기말_고1_유사.js#19
  - similar/high/h1/1final/26_금당고_1학기_기말_고1_유사.js#20

### level
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#1
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#2
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#3
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#4
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#5
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#6
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#7
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#8

### standardUnit
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#1
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#2
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#3
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#4
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#5
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#6
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#7
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#8

### standardUnitKey
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#1
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#2
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#3
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#4
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#5
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#6
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#7
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#8

### standardCourse
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#1
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#2
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#3
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#4
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#5
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#6
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#7
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#8

### tags
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#1
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#2
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#3
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#4
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#5
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#6
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#7
  - original/high/h1/1final/19_매산고_1학기_기말_고1_기출.js#8

### undefined/비객체 문항
  - 없음

## 실패 파일

- 없음
