# question-index 생성 리포트

- 인덱싱 범위(SCOPE): git-tracked + db-listed production (parity-gated) (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 808
- 시험지 파일 수: 808
- 원본 문항 수(중복 제거 전): 19022
- 최종 인덱스 문항 수(중복 제거 후): 19022
- 중복 qKey로 제외된 레코드: 0 (그룹 0)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 784444 bytes
- 시험지 JS 총 크기: 37049834 bytes
- 인덱스 크기: 20066560 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(19022)" 기준이다.

## 표준단원키 분류 (공식 마스터 143개 기준)

- 공식(official): 17773
- RAW-(임시 규약, 허용): 25 (distinct 7)
- 비공식(invalid): 99 (distinct 22)
- 빈 키(empty): 1125

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 0
- 누락 content: 707
- 누락 choices: 5
- 누락 level: 1493
- 누락 standardUnit: 1020
- 누락 standardUnitKey: 1125
- 누락 standardCourse: 1031
- 누락 tags: 1019

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 3399
- content 내부 <img>: 613
- content 내부 <svg>: 77
- content 내부 <table>: 250
- 시각요소 보유(hasImage=true, OR 합산): 4291

## 누락 예시

### id
  - 없음

### content
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#1
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#2
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#3
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#4
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#5
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#6
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#7
  - original/middle/m3/1final/17_연향중_1학기_기말_중3_수학.js#8

### choices
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#19
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#20
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#21
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#22
  - original/high/h1/1mid/23_매산여고_1학기_중간_고1_기출.js#23

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
