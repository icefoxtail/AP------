# question-index 데이터 정합성 감사 (PHASE 4.5)

- 생성 시각: 2026-06-13T06:58:45.890Z
- 생성기: archive/tools/build-question-index.mjs
- 인덱싱 범위(SCOPE): git-tracked
  - git 버전관리에 등재된 시험지 JS만 인덱싱(210파일).
  - .gitignore `*textbook*` 로 차단되는 외부 교재 문제은행과 미추적 _pro 드래프트는 정식 아카이브가 아니므로 제외(db.js 210건과 일치).
- 공식 마스터 키 수: 142 (중등 23 + H22 56 + H15 63)
- 원본 문항 수: 5444
- 최종 인덱스 문항 수: 5419
- 중복 qKey 그룹: 25 / 제외 레코드(duplicate_skipped): 25
- 최종 인덱스 중복 qKey: 0 (0이어야 정상)

---

## 1. duplicate_skipped (qKey 중복 제거)

> 정책: 같은 qKey가 여러 레코드면 1개만 유지(KEPT), 나머지는 제외(SKIP).
> 유지 우선순위: ①공식 키 ②unit+course 존재 ③content 길이 ④choices 길이 ⑤원본 순서.
> qKey 규칙(sourceFile_id)은 유지하며 새 키로 치환하지 않는다.
> ※ 아래 그룹의 SKIP 레코드는 대부분 "내용이 다른 별개 문항"이 동일 id를 가져 qKey가 충돌한 경우다(2번 항목 참조).

### original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js_1
- sourceFile: original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js
  - KEPT   id=1 key="M3-04" unit="이차함수" course="중3 수학" class=official content=155자
  - SKIP   id=1 key="H15-SA-01" unit="다항식의 연산" course="고등 수학(상)" class=official content=73자

### original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js_1
- sourceFile: original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js
  - KEPT   id=1 key="M3-02" unit="다항식의 곱셈과 인수분해" course="중3 수학" class=official content=28자
  - SKIP   id=1 key="M3-01-04" unit="근호를 포함한 식의 계산" course="중3 수학" class=invalid content=168자

### types/high/h1/항등식과나머지정리_고1_유형1.js_1
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=1 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=104자
  - SKIP   id=1 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=104자

### types/high/h1/항등식과나머지정리_고1_유형1.js_2
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=2 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=80자
  - SKIP   id=2 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=76자

### types/high/h1/항등식과나머지정리_고1_유형1.js_3
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=3 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=111자
  - SKIP   id=3 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=78자

### types/high/h1/항등식과나머지정리_고1_유형1.js_4
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=4 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=86자
  - SKIP   id=4 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=80자

### types/high/h1/항등식과나머지정리_고1_유형1.js_5
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=5 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=225자
  - SKIP   id=5 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=111자

### types/high/h1/항등식과나머지정리_고1_유형1.js_6
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=6 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=242자
  - SKIP   id=6 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=110자

### types/high/h1/항등식과나머지정리_고1_유형1.js_7
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=7 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=113자
  - SKIP   id=7 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=107자

### types/high/h1/항등식과나머지정리_고1_유형1.js_8
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=8 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=106자
  - SKIP   id=8 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=103자

### types/high/h1/항등식과나머지정리_고1_유형1.js_9
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=9 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=132자
  - SKIP   id=9 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=100자

### types/high/h1/항등식과나머지정리_고1_유형1.js_10
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=10 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=157자
  - SKIP   id=10 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=131자

### types/high/h1/항등식과나머지정리_고1_유형1.js_11
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=11 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=146자
  - SKIP   id=11 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=113자

### types/high/h1/항등식과나머지정리_고1_유형1.js_12
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=12 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=108자
  - SKIP   id=12 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=106자

### types/high/h1/항등식과나머지정리_고1_유형1.js_13
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=13 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=125자
  - SKIP   id=13 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=115자

### types/high/h1/항등식과나머지정리_고1_유형1.js_14
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=14 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=159자
  - SKIP   id=14 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=149자

### types/high/h1/항등식과나머지정리_고1_유형1.js_15
- sourceFile: types/high/h1/항등식과나머지정리_고1_유형1.js
  - KEPT   id=15 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=209자
  - SKIP   id=15 key="H22-C-02" unit="나머지 정리" course="공통수학1" class=official content=201자

### types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js_1
- sourceFile: types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js
  - KEPT   id=1 key="H22-A-05" unit="사인법칙과 코사인법칙" course="대수" class=official content=107자
  - SKIP   id=1 key="H22-A-05" unit="삼각함수의 활용" course="대수" class=official content=82자

### types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js_2
- sourceFile: types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js
  - KEPT   id=2 key="H22-A-05" unit="사인법칙과 코사인법칙" course="대수" class=official content=97자
  - SKIP   id=2 key="H22-A-05" unit="삼각함수의 활용" course="대수" class=official content=73자

### types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js_3
- sourceFile: types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js
  - KEPT   id=3 key="H22-A-05" unit="사인법칙과 코사인법칙" course="대수" class=official content=145자
  - SKIP   id=3 key="H22-A-05" unit="삼각함수의 활용" course="대수" class=official content=95자

### types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js_4
- sourceFile: types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js
  - KEPT   id=4 key="H22-A-05" unit="사인법칙과 코사인법칙" course="대수" class=official content=67자
  - SKIP   id=4 key="H22-A-05" unit="삼각함수의 활용" course="대수" class=official content=65자

### types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js_1
- sourceFile: types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js
  - KEPT   id=1 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=204자
  - SKIP   id=1 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=72자

### types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js_2
- sourceFile: types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js
  - KEPT   id=2 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=154자
  - SKIP   id=2 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=89자

### types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js_3
- sourceFile: types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js
  - KEPT   id=3 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=82자
  - SKIP   id=3 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=79자

### types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js_4
- sourceFile: types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js
  - KEPT   id=4 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=142자
  - SKIP   id=4 key="H22-A-01" unit="지수와 로그" course="대수" class=official content=114자

---

## 2. 원본 JS id 정합성 (root cause)

> qKey 충돌의 근본 원인. 원본 시험지 JS는 이 단계에서 수정하지 않으며 여기에만 기록한다.
> 동일 파일 내 같은 id가 2회 이상 쓰이면(내용이 다르더라도) 동일 qKey가 생성되어 1건만 인덱스에 남는다.
> 후속 단계에서 원본 JS의 id 재부여가 필요하다.

### original/high/h1/1mid/23_여수여고_1학기_중간_고1_기출.js (총 21문항)
  - 중복 id "1" ×2 (slots 0,20)
  - 빈 id 문항: 1건

### original/middle/m3/1mid/22_왕운중_1학기_중간_중3_기출.js (총 24문항)
  - 중복 id "1" ×2 (slots 0,23)

### types/high/h1/항등식과나머지정리_고1_유형1.js (총 30문항)
  - 중복 id "1" ×2 (slots 0,15)
  - 중복 id "2" ×2 (slots 1,16)
  - 중복 id "3" ×2 (slots 2,17)
  - 중복 id "4" ×2 (slots 3,18)
  - 중복 id "5" ×2 (slots 4,19)
  - 중복 id "6" ×2 (slots 5,20)
  - 중복 id "7" ×2 (slots 6,21)
  - 중복 id "8" ×2 (slots 7,22)
  - 중복 id "9" ×2 (slots 8,23)
  - 중복 id "10" ×2 (slots 9,24)
  - 중복 id "11" ×2 (slots 10,25)
  - 중복 id "12" ×2 (slots 11,26)
  - 중복 id "13" ×2 (slots 12,27)
  - 중복 id "14" ×2 (slots 13,28)
  - 중복 id "15" ×2 (slots 14,29)

### types/high/h2/비상_대수_사인코사인법칙_고2_유형확인.js (총 18문항)
  - 중복 id "1" ×2 (slots 0,4)
  - 중복 id "2" ×2 (slots 1,5)
  - 중복 id "3" ×2 (slots 2,6)
  - 중복 id "4" ×2 (slots 3,7)

### types/high/h2/비상_대수_지수로그_중단원_고2_유형확인.js (총 18문항)
  - 중복 id "1" ×2 (slots 0,4)
  - 중복 id "2" ×2 (slots 1,5)
  - 중복 id "3" ×2 (slots 2,6)
  - 중복 id "4" ×2 (slots 3,7)

---

## 3. invalid_standard_key (비공식 표준단원키)

> 공식 마스터(142) 에 없고 RAW- 규약도 아닌 키. 검색/자동출제에서 mixer 의 getStandardizedUnit 이 "미분류"로 처리한다.
> 원문 standardUnitKey 값은 인덱스에 보존한다(별도 치환/보정 없음).
> distinct 40종 / 249건

- `H15-SA-13` — 49건 (예: original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js#10, original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js#11, original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js#12, original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js#16, original/high/h1/1mid/23_매산고_1학기_중간_고1_기출.js#20)
- `STAT-02` — 40건 (예: original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#1, original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#2, original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#3, original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#4, original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#5)
- `H15-PS` — 24건 (예: original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js#1, original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js#2, original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js#3, original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js#4, original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js#5)
- `H22-A-03-03` — 14건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#4, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#8, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#9, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#10, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#11)
- `H_ST_01_01` — 11건 (예: original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#1, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#3, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#6, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#10, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#11)
- `HH15-SA-02` — 11건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#3, types/high/h1/항등식과나머지정리_고1_유형.js#10, types/high/h1/항등식과나머지정리_고1_유형.js#12, types/high/h1/항등식과나머지정리_고1_유형.js#13, types/high/h1/항등식과나머지정리_고1_유형.js#17)
- `H22-C-11` — 10건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#18, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#16, original/high/h2/1mid/23_한영고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#9)
- `HH15-SA-01` — 10건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#1, types/high/h1/항등식과나머지정리_고1_유형.js#2, types/high/h1/항등식과나머지정리_고1_유형.js#4, types/high/h1/항등식과나머지정리_고1_유형.js#6, types/high/h1/항등식과나머지정리_고1_유형.js#8)
- `H22-A-03-02` — 10건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#2, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#3, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#6, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#7, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#12)
- `H_ST_01_02` — 9건 (예: original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#4, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#5, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#7, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#8, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#12)
- `H22-C-10` — 6건 (예: original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#12, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#13, original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js#19, original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js#14, original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js#9)
- `STAT-01` — 5건 (예: original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#15, original/high/h2/1mid/25_순천여고_1학기_중간_고2_확률과통계.js#17, original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js#15, original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js#16, original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js#23)
- `HH15-SA-03` — 4건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#11, types/high/h1/항등식과나머지정리_고1_유형.js#16, types/high/h1/항등식과나머지정리_고1_유형.js#21, types/high/h1/항등식과나머지정리_고1_유형.js#31)
- `H22-A-03-01` — 4건 (예: types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#1, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형심화.js#5, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js#1, types/high/h2/비상_대수_삼각함수_익힘책_고2_유형확인.js#5)
- `M1-2-STAT-05` — 4건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#22, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#23, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#24, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#25)
- `H_ST_02_01` — 3건 (예: original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#2, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#9, original/high/h2/1mid/25_제일고_1학기_중간_고2_확률과통계.js#17)
- `M1-2-GEOM-SOLID-05` — 3건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#8, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#9, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#10)
- `M1-2-GEOM-SOLID-06` — 3건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#11, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#12, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#13)
- `M1-2-GEOM-SOLID-07` — 3건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#14, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#15, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#16)
- `H22-A-09` — 2건 (예: similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js#9, similar/high/h1/1mid/25_순천여고_1학기_중간_고1_유사.js#17)
- `M1-2-GEOM-SOLID-01` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#1, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#2)
- `M1-2-GEOM-SOLID-02` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#3, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#4)
- `M1-2-GEOM-SOLID-03` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#5, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#6)
- `M1-2-STAT-02` — 2건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#18, types/middle/m1/중1_2_기말대비1_입체도형_통계.js#19)
- `함수` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#5)
- `H21-M1-01` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#19)
- `H21-M1-02` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js#22)
- `M2-10` — 1건 (예: original/high/h2/1mid/25_효천고_1학기_중간_고2_확률과통계.js#3)
- `UNCLASSIFIED-MIDDLE2` — 1건 (예: original/middle/m2/1mid/25_왕운중_1학기_중간_중2_기출.js#20)
- `RRAW-다항식전개응용` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#5)
- `RRAW-서술형(나눗셈의관계)` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#7)
- `RRAW-세제곱공식` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#9)
- `HH22-C-02` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#19)
- `RRAW-고차식변형` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#22)
- `RRAW-숫자의나눗셈` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#25)
- `RRAW-세제곱변형` — 1건 (예: types/high/h1/항등식과나머지정리_고1_유형.js#29)
- `M1-2-GEOM-SOLID-04` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#7)
- `M1-2-STAT-01` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#17)
- `M1-2-STAT-03` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#20)
- `M1-2-STAT-04` — 1건 (예: types/middle/m1/중1_2_기말대비1_입체도형_통계.js#21)

---

## 4. RAW- 키 (임시 규약, 허용)

> 마스터 테이블이 허용하는 임시 미분류 규약(standardUnitOrder 999). 비공식 오류와 구분한다.
> distinct 86종 / 215건

- `RAW-대표문제다시풀기` — 74건
- `RAW-삼각함수` — 9건
- `RAW-지수법칙` — 9건
- `RAW-지수법칙응용` — 7건
- `RAW-지수함수와 로그함수` — 7건
- `RAW-지수` — 4건
- `RAW-부등식의성질` — 4건
- `RAW-이등변삼각형` — 4건
- `RAW-서술형2` — 3건
- `RAW-서술형3` — 3건
- `RAW-서술형` — 3건
- `RAW-다항식의혼합계산` — 3건
- `RAW-수치계산의공식화` — 2건
- `RAW-다항식의성질` — 2건
- `RAW-로그` — 2건
- `RAW-삼각함수사이의관계` — 2건
- `RAW-삼각형의분류` — 2건
- `RAW-부등식의해` — 2건
- `RAW-부등식의정의` — 2건
- `RAW-식의대입` — 2건
- `RAW-서술형1` — 2건
- `RAW-내심` — 2건
- `RAW-약수와배수` — 2건
- `RAW-다항식추론` — 1건
- `RAW-다항식의변형` — 1건
- `RAW-다항식의결정` — 1건
- `RAW-지수의대소비교` — 1건
- `RAW-지수/로그의역함수` — 1건
- `RAW-산술기하평균과로그` — 1건
- `RAW-이차방정식과지수` — 1건
- `RAW-삼각함수의각변환` — 1건
- `RAW-삼각함수그래프의해석` — 1건
- `RAW-로그의실생활활용(서술형)` — 1건
- `RAW-삼각함수의사분면` — 1건
- `RAW-로그의실생활응용` — 1건
- `RAW-로그와이차방정식` — 1건
- `RAW-지수법칙미지수구하기` — 1건
- `RAW-피타고라스정리` — 1건
- `RAW-피타고라스정리활용` — 1건
- `RAW-삼각형의내심` — 1건
- `RAW-삼각형의내심활용` — 1건
- `RAW-삼각형의외심` — 1건
- `RAW-삼각형의내심과외심` — 1건
- `RAW-삼각형의외심의정의` — 1건
- `RAW-도형에서의다항식계산` — 1건
- `RAW-부등식의범위` — 1건
- `RAW-삼각형의성립조건` — 1건
- `RAW-미지수가2개인일차방정식` — 1건
- `RAW-연립방정식의해` — 1건
- `RAW-지수법칙심화` — 1건
- `RAW-지수법칙방정식` — 1건
- `RAW-부등식의표현` — 1건
- `RAW-서술형-부등식활용` — 1건
- `RAW-도형과다항식` — 1건
- `RAW-자릿수결정` — 1건
- `RAW-지수법칙미지수` — 1건
- `RAW-지수법칙과자릿수` — 1건
- `RAW-서술형4` — 1건
- `RAW-삼각형의합동` — 1건
- `RAW-피타고라스` — 1건
- `RAW-외심` — 1건
- `RAW-내심/외심복합` — 1건
- `RAW-바른계산구하기` — 1건
- `RAW-다항식의전개` — 1건
- `RAW-논술형3` — 1건
- `RAW-6.지수법칙기초` — 1건
- `RAW-7.지수법칙의활용(단위환산)` — 1건
- `RAW-8.지수법칙의응용` — 1건
- `RAW-10.다항식의전개와동류항계산` — 1건
- `RAW-11.등식의성질을이용한다항식구하기` — 1건
- `RAW-12.바르게계산한식구하기` — 1건
- `RAW-16.문장을부등식으로나타내기` — 1건
- `RAW-18.부등식의성질` — 1건
- `RAW-서술형1.거듭제곱의덧셈과나눗셈` — 1건
- `RAW-9.지수법칙기초판단` — 1건
- `RAW-10.지수법칙과단위변환` — 1건
- `RAW-11.지수법칙의응용` — 1건
- `RAW-13.자릿수계산` — 1건
- `RAW-14.도형의부피역산` — 1건
- `RAW-15.부등식의해석` — 1건
- `RAW-16.부등식의해` — 1건
- `RAW-17.부등식성질판단` — 1건
- `RAW-18.생활부등식활용` — 1건
- `RAW-분모의유리화` — 1건
- `RAW-곱셈공식의변형` — 1건
- `RAW-다항식의값` — 1건

---

## 5. 필드 누락 (최종 인덱스 5419건 기준)

| 필드 | 누락 수 |
|------|--------:|
| id | 1 |
| content | 2 |
| choices(배열) | 1 |
| level | 345 |
| standardUnit | 13 |
| standardUnitKey | 13 |
| standardCourse | 13 |
| tags | 15 |
| undefined/비객체(skip) | 2 |

## 6. 시각요소 집계 (최종 인덱스 기준)

| 기준 | 수 |
|------|---:|
| q.image 보유 | 310 |
| content <img> | 2 |
| content <svg> | 77 |
| content <table> | 101 |
| 시각요소 보유(hasImage=true) | 483 |

> hasImage 판정은 mixer.html 의 hasVisualAsset 과 동일(image OR content 내부 img/svg/table).
