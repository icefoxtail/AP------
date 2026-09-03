# question-index 데이터 정합성 감사 (PHASE 4.5)

- 생성 시각: 2026-09-03T17:46:19.000Z
- 생성기: archive/tools/build-question-index.mjs
- 인덱싱 범위(SCOPE): git-tracked + db-listed
  - git 버전관리에 등재된 시험지 JS만 인덱싱(451파일).
  - .gitignore `*textbook*` 로 차단되는 외부 교재 문제은행과 미추적 _pro 드래프트는 정식 아카이브가 아니므로 제외(db.js 210건과 일치).
- 공식 마스터 키 수: 143 (중등 23 + H22 56 + H15 64)
- 원본 문항 수: 10980
- 최종 인덱스 문항 수: 10980
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
> distinct 21종 / 94건

- `H22-A-03-03` — 14건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#4, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#8, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#9, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#10, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#11)
- `HH15-SA-02` — 11건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#3, types/high/h1/항등식과나머지정리_고1_유형.js#10, types/high/h1/항등식과나머지정리_고1_유형.js#12, types/high/h1/항등식과나머지정리_고1_유형.js#13, types/high/h1/항등식과나머지정리_고1_유형.js#17)
- `H22-C-11` — 10건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#18, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#9)
- `HH15-SA-01` — 10건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#1, types/high/h1/항등식과나머지정리_고1_유형.js#2, types/high/h1/항등식과나머지정리_고1_유형.js#4, types/high/h1/항등식과나머지정리_고1_유형.js#6, types/high/h1/항등식과나머지정리_고1_유형.js#8)
- `H22-A-03-02` — 10건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#2, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#3, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#6, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#7, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#12)
- `H22-C-10` — 6건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#12, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#13, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#14, original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js#9)
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
> distinct 0종 / 0건

- 없음

---

## 5. 필드 누락 (최종 인덱스 10980건 기준)

| 필드 | 누락 수 |
|------|--------:|
| id | 0 |
| content | 0 |
| choices(배열) | 0 |
| level | 344 |
| standardUnit | 0 |
| standardUnitKey | 0 |
| standardCourse | 12 |
| tags | 0 |
| undefined/비객체(skip) | 0 |

## 6. 시각요소 집계 (최종 인덱스 기준)

| 기준 | 수 |
|------|---:|
| q.image 보유 | 2211 |
| content <img> | 24 |
| content <svg> | 79 |
| content <table> | 165 |
| 시각요소 보유(hasImage=true) | 2473 |

> hasImage 판정은 mixer.html 의 hasVisualAsset 과 동일(image OR content 내부 img/svg/table).
