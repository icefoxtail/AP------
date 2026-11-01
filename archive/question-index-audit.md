# question-index 데이터 정합성 감사 (PHASE 4.5)

- 생성기: archive/tools/build-question-index.mjs
- 인덱싱 범위(SCOPE): git-tracked + db-listed production (parity-gated)
  - git 버전관리에 등재된 시험지 JS만 인덱싱(1057파일).
  - 교과서 파일은 `textbooks/<book>/<title>.js` 경로와 db.js의 명시 등록이 모두 있을 때만 포함한다.
  - DB 미등록 교재 파일과 미추적 _pro 드래프트는 제외한다.
- 공식 마스터 키 수: 143 (중등 23 + H22 56 + H15 64)
- 원본 문항 수: 26040
- 최종 인덱스 문항 수: 26040
- 중복 qKey 그룹: 0 / 제외 레코드(duplicate_skipped): 0
- 최종 인덱스 중복 qKey: 0 (0이어야 정상)

---

## 1. duplicate_skipped (qKey 중복 제거)

> 정책: 같은 qKey가 여러 레코드면 1개만 유지(KEPT), 나머지는 제외(SKIP).
> 유지 우선순위: ①공식 키 ②unit+course 존재 ③content 길이 ④choices 길이 ⑤원본 순서.
> qKey 규칙(sourceFile_id)은 유지하며 새 키로 치환하지 않는다.
> ※ 아래 그룹의 SKIP 레코드는 대부분 "내용이 다른 별개 문항"이 동일 id를 가져 qKey가 충돌한 경우다(2번 항목 참조).

- 중복 qKey 없음

---

## 2. 원본 JS id 정합성 (root cause)

> qKey 충돌의 근본 원인. 원본 시험지 JS는 이 단계에서 수정하지 않으며 여기에만 기록한다.
> 동일 파일 내 같은 id가 2회 이상 쓰이면(내용이 다르더라도) 동일 qKey가 생성되어 1건만 인덱스에 남는다.
> 후속 단계에서 원본 JS의 id 재부여가 필요하다.

- id 중복/누락 파일 없음

---

## 3. invalid_standard_key (비공식 표준단원키)

> 공식 마스터(142) 에 없고 RAW- 규약도 아닌 키. 검색/자동출제에서 mixer 의 getStandardizedUnit 이 "미분류"로 처리한다.
> 원문 standardUnitKey 값은 인덱스에 보존한다(별도 치환/보정 없음).
> distinct 28종 / 640건

- `H22-C3-01` — 400건 (예: textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js#BV-BAKBAL-H-COM2-HA-P54-Q01-T1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js#BV-BAKBAL-H-COM2-HA-P54-Q01-S1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js#BV-BAKBAL-H-COM2-HA-P54-Q01-S2-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js#BV-BAKBAL-H-COM2-HA-P54-Q01-S3-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_함수_P54-57_20261026_유사50.js#BV-BAKBAL-H-COM2-HA-P54-Q01-S4-R1)
- `H22-C3-02` — 50건 (예: textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js#BV-BAKBAL-H-COM2-HA-P89-Q01-T1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js#BV-BAKBAL-H-COM2-HA-P89-Q01-S1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js#BV-BAKBAL-H-COM2-HA-P89-Q01-S2-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js#BV-BAKBAL-H-COM2-HA-P89-Q01-S3-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_유리함수_P89-92_20261031_유사50.js#BV-BAKBAL-H-COM2-HA-P89-Q01-S4-R1)
- `M2-09` — 37건 (예: original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#18, original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#19, original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#20, original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#22, original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#24)
- `M2-10` — 26건 (예: original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#17, original/middle/m2/1final/19_금당중_1학기_기말_중2_수학.js#21, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#11, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#12, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#13)
- `M2-11` — 21건 (예: original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#15, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#16, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#17, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#18, original/middle/m2/2final/21_팔마중_2학기_기말_중2_수학.js#19)
- `H22-A-03-03` — 14건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#4, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#8, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#9, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#10, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#11)
- `HH15-SA-02` — 11건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#3, types/high/h1/항등식과나머지정리_고1_유형.js#10, types/high/h1/항등식과나머지정리_고1_유형.js#12, types/high/h1/항등식과나머지정리_고1_유형.js#13, types/high/h1/항등식과나머지정리_고1_유형.js#17)
- `H22-C-11` — 10건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#18, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#9)
- `HH15-SA-01` — 10건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#1, types/high/h1/항등식과나머지정리_고1_유형.js#2, types/high/h1/항등식과나머지정리_고1_유형.js#4, types/high/h1/항등식과나머지정리_고1_유형.js#6, types/high/h1/항등식과나머지정리_고1_유형.js#8)
- `H22-A-03-02` — 10건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#2, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#3, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#6, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#7, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#12)
- `H22-C2-SET` — 7건 (예: textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js#BV-BAKBAL-H-COM2-P151-Q10-T1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js#BV-BAKBAL-H-COM2-P151-Q10-S1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js#BV-BAKBAL-H-COM2-P151-Q10-S2-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js#BV-BAKBAL-H-COM2-P152-Q11-T1-R1, textbooks/백발백중_공통수학2/백발백중_공통수학2_실전모의4회_P152-155_20261023_유사50.js#BV-BAKBAL-H-COM2-P152-Q11-S1-R1)
- `H22-C-10` — 6건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#12, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#13, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#14, original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js#9)
- `M2-03-INEQUALITY` — 5건 (예: original/middle/m2/1final/20_신흥중_1학기_기말_중2_수학.js#11, original/middle/m2/1final/20_신흥중_1학기_기말_중2_수학.js#12, original/middle/m2/1final/20_신흥중_1학기_기말_중2_수학.js#14, original/middle/m2/1final/20_신흥중_1학기_기말_중2_수학.js#15, original/middle/m2/1final/20_신흥중_1학기_기말_중2_수학.js#16)
- `HH15-SA-03` — 4건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#11, types/high/h1/항등식과나머지정리_고1_유형.js#16, types/high/h1/항등식과나머지정리_고1_유형.js#21, types/high/h1/항등식과나머지정리_고1_유형.js#31)
- `H22-A-03-01` — 4건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#1, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#5, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js#1, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js#5)
- `M1-2-STAT-05` — 4건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#22, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#23, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#24, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#25)
- `M1-2-GEOM-SOLID-05` — 3건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#8, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#9, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#10)
- `M1-2-GEOM-SOLID-06` — 3건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#11, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#12, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#13)
- `H22-A-09` — 2건 (예: similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js#9, similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js#17)
- `M1-2-GEOM-SOLID-01` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#1, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#2)
- `M1-2-GEOM-SOLID-02` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#3, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#4)
- `M1-2-GEOM-SOLID-03` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#5, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#6)
- `M1-2-GEOM-SOLID-07` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#14, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#15)
- `H21-M1-01` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#19)
- `H21-M1-02` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#23)
- `HH22-C-02` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#19)
- `M1-2-GEOM-SOLID-04` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#7)
- `M1-2-STAT-03` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#20)

---

## 4. RAW- 키 (임시 규약, 허용)

> 마스터 테이블이 허용하는 임시 미분류 규약(standardUnitOrder 999). 비공식 오류와 구분한다.
> distinct 7종 / 25건

- `RAW-삼각비` — 10건
- `RAW-원의 성질` — 5건
- `RAW-삼각비의 활용` — 3건
- `RAW-원의 접선` — 3건
- `RAW-원주각` — 2건
- `RAW-정다각형과 원` — 1건
- `RAW-일차함수` — 1건

---

## 5. 필드 누락 (최종 인덱스 26040건 기준)

| 필드 | 누락 수 |
|------|--------:|
| id | 0 |
| content | 1592 |
| choices(배열) | 5 |
| level | 2551 |
| standardUnit | 2381 |
| standardUnitKey | 2208 |
| standardCourse | 2133 |
| tags | 2676 |
| undefined/비객체(skip) | 0 |

## 6. 시각요소 집계 (최종 인덱스 기준)

| 기준 | 수 |
|------|---:|
| q.image 보유 | 3922 |
| content <img> | 1076 |
| content <svg> | 77 |
| content <table> | 373 |
| 시각요소 보유(hasImage=true) | 5263 |

> hasImage 판정은 mixer.html 의 hasVisualAsset 과 동일(image OR content 내부 img/svg/table).
