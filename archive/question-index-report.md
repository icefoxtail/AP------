# question-index 생성 리포트

- 생성 시각: 2026-09-07T02:26:21.701Z
- 인덱싱 범위(SCOPE): git-tracked + db-listed (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 440
- 시험지 파일 수: 454
- 원본 문항 수(중복 제거 전): 11034
- 최종 인덱스 문항 수(중복 제거 후): 11034
- 중복 qKey로 제외된 레코드: 0 (그룹 0)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 448998 bytes
- 시험지 JS 총 크기: 18156652 bytes
- 인덱스 크기: 11640149 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(11034)" 기준이다.

## 표준단원키 분류 (공식 마스터 143개 기준)

- 공식(official): 10932
- RAW-(임시 규약, 허용): 0 (distinct 0)
- 비공식(invalid): 94 (distinct 21)
- 빈 키(empty): 8

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 0
- 누락 content: 0
- 누락 choices: 0
- 누락 level: 352
- 누락 standardUnit: 8
- 누락 standardUnitKey: 8
- 누락 standardCourse: 20
- 누락 tags: 8

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 2219
- content 내부 <img>: 24
- content 내부 <svg>: 79
- content 내부 <table>: 172
- 시각요소 보유(hasImage=true, OR 합산): 2488

## 누락 예시

### id
  - 없음

### content
  - 없음

### choices
  - 없음

### level
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#1
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#2
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#3
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#4
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#5
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#6
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#7
  - original/middle/m2/1mid/25_연향중_1학기_중간_중2_기출.js#8

### standardUnit
  - test-fixtures/render-authority-golden.js#1
  - test-fixtures/render-authority-golden.js#2
  - test-fixtures/render-authority-golden.js#3
  - test-fixtures/render-authority-golden.js#4
  - test-fixtures/render-authority-golden.js#5
  - test-fixtures/render-authority-golden.js#6
  - test-fixtures/render-authority-golden.js#7
  - test-fixtures/render-authority-golden.js#8

### standardUnitKey
  - test-fixtures/render-authority-golden.js#1
  - test-fixtures/render-authority-golden.js#2
  - test-fixtures/render-authority-golden.js#3
  - test-fixtures/render-authority-golden.js#4
  - test-fixtures/render-authority-golden.js#5
  - test-fixtures/render-authority-golden.js#6
  - test-fixtures/render-authority-golden.js#7
  - test-fixtures/render-authority-golden.js#8

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
  - test-fixtures/render-authority-golden.js#1
  - test-fixtures/render-authority-golden.js#2
  - test-fixtures/render-authority-golden.js#3
  - test-fixtures/render-authority-golden.js#4
  - test-fixtures/render-authority-golden.js#5
  - test-fixtures/render-authority-golden.js#6
  - test-fixtures/render-authority-golden.js#7
  - test-fixtures/render-authority-golden.js#8

### undefined/비객체 문항
  - 없음

## 실패 파일

- 없음
