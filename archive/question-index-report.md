# question-index 생성 리포트

- 인덱싱 범위(SCOPE): git-tracked + db-listed production (parity-gated) (git 등재 시험지만; textbook 교재은행·미추적 _pro 드래프트 제외)
- 시험지 수(db.js): 490
- 시험지 파일 수: 490
- 원본 문항 수(중복 제거 전): 11739
- 최종 인덱스 문항 수(중복 제거 후): 11739
- 중복 qKey로 제외된 레코드: 0 (그룹 0)
- 최종 인덱스 중복 qKey: 0
- undefined/비객체 문항 skip: 0
- db.js 크기: 490672 bytes
- 시험지 JS 총 크기: 19970817 bytes
- 인덱스 크기: 12503751 bytes
- 로드 실패 파일: 0

> 누락/시각요소/키분류 집계는 모두 "최종 인덱스 레코드(11739)" 기준이다.

## 표준단원키 분류 (공식 마스터 143개 기준)

- 공식(official): 11645
- RAW-(임시 규약, 허용): 0 (distinct 0)
- 비공식(invalid): 94 (distinct 21)
- 빈 키(empty): 0

상세 비공식 키 목록은 question-index-audit.md 참조.

## 필드 누락 (최종 인덱스 기준)

- 누락 id: 0
- 누락 content: 0
- 누락 choices: 0
- 누락 level: 455
- 누락 standardUnit: 0
- 누락 standardUnitKey: 0
- 누락 standardCourse: 12
- 누락 tags: 0

## 시각요소 집계 (최종 인덱스 기준)

- q.image 보유: 2412
- content 내부 <img>: 26
- content 내부 <svg>: 78
- content 내부 <table>: 177
- 시각요소 보유(hasImage=true, OR 합산): 2686

## 누락 예시

### id
  - 없음

### content
  - 없음

### choices
  - 없음

### level
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_e096c669bb99f512a57e7383e36d57ef2534ab78aeb794605c9c197430bc48a3
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_47f15fd93f79484f6b466be24bd688d5abbfba734895462d97674396280d8219
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_e2625f0daf829b818c03659ac5c15f973a15a2a557ce4d9b7a64860155ac62d6
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_1d3d39f7f7a680bb3533173b8eecb519aecbb1ac78329baa2397856dce86273a
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_81b028a97af61d9c5c85f34737b9e38ae63c37818a14bb40a0f74f2c59708d07
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_685ceda707cd7842ae2889000b6b75efda29af06ad2fce6a19a10f5ffcadd118
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_0251148df84aac752249499886748271b339fb63a6172551608793f9162e0368
  - textbooks/비상교육_공통수학2/비상_공통수학2_도형의방정식_익힘책_고1.js#qid_v1_0c587370973c7d176eb219c11f5aa99f7771d53ba225fe222730eb1fd0f333bb

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
