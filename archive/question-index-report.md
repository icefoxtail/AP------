# question-index 생성 리포트

- 인덱싱 범위(SCOPE): git-tracked + db-listed production (parity-gated) (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 544
- 시험지 파일 수: 544
- 원본 문항 수(중복 제거 전): 12966
- 최종 인덱스 문항 수(중복 제거 후): 12966
- 중복 qKey로 제외된 레코드: 0 (그룹 0)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 543720 bytes
- 시험지 JS 총 크기: 22550662 bytes
- 인덱스 크기: 13826979 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(12942)" 기준이다.

## 표준단원키 분류 (공식 마스터 143개 기준)

- 공식(official): 12872
- RAW-(임시 규약, 허용): 0 (distinct 0)
- 비공식(invalid): 94 (distinct 21)
- 빈 키(empty): 0

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 0
- 누락 content: 0
- 누락 choices: 9
- 누락 level: 474
- 누락 standardUnit: 0
- 누락 standardUnitKey: 0
- 누락 standardCourse: 12
- 누락 tags: 0

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 2874
- content 내부 <img>: 26
- content 내부 <svg>: 77
- content 내부 <table>: 181
- 시각요소 보유(hasImage=true, OR 합산): 3151

## 누락 예시

### id
  - 없음

### content
  - 없음

### choices
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#19
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#20
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#21
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#22
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#23

### level
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#1
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#2
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#3
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#4
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#5
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#6
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#7
  - original/high/h1/1mid/24_금당고_1학기_중간_고1_기출.js#8

### standardUnit
  - 없음

### standardUnitKey
  - 없음

### standardCourse
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#13
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#14
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#15
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#16
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#17
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#18
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#19
  - original/middle/m3/1mid/21_신흥중_1학기_중간_중3_기출.js#20

### tags
  - 없음

### undefined/비객체 문항
  - 없음

## 실패 파일

- 없음
