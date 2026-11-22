# 고2 대수/구 수학Ⅰ 1학기 중간 원본 시험지 — 참조 이미지 전수 시각 검수 (2026-11-22)

- lane: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · years: 2019–2026
- source branch: `work/solution-upgrade-lane-30-20261121`; 대상 `archive/exams/original/high/h2/1mid/*.js` 및 각 파일이 직접 참조하는 `archive/assets/images/*`의 PNG/SVG
- 대상 원본: **51개 시험지·1,134문항** (수학 심층 감사 KEEP 1,089 / UPGRADE 37 / HOLD 8 / UNREAD 0; 본 이미지 검수로 해당 문항 분류를 소급 변경하지 않음)
- 소스 참조 고유 이미지: **370개 = PNG 114 + SVG 256**; 이미지 참조 시험지 50개, 참조 이미지 0개 시험지 1개(`21_매산고_1학기_중간_고2_수학I.js`)
- **시각 검수 증거 범위: 370/370**. 기존 2019–2020 심층 감사에 실물 시각 판독이 기록된 **68개(PNG 36, SVG 32)**를 근거로 인계. 이번 2021–2026 원본 참조 이미지 **302개(PNG 78, SVG 224)**는 GitHub blob 원본 전부 실제 수신, PNG 원본 육안 판독/SVG Inkscape PNG 렌더를 거쳐 **302/302** 시각 확인(렌더 실패 0).
- 분류: **`OBSERVED_NO_FLAG` 363개**, **`VISUAL_UPGRADE` 6개**(실제 그림·배치 수정 필요), **`SOURCE_LINK_HOLD` 1개**(원본 문장↔그림 불일치로 출처 교정 보류); 이미지 관련 추적 항목 총 **7개**. 그중 **이번에 새로 확인한 문제 2개**(2023 한영고 Q13, 2024 매산여고 Q15); 기존 감사 문서에서 이미 발견한 문제 5개.
- `OBSERVED_NO_FLAG`는 해당 수준의 이미지 육안 판독에서 새 문제를 발견하지 않았다는 뜻이며 **출고 PASS가 아님**. 브라우저 학생 UI 렌더, 전체 preflight, Golden/Negative, 모든 해상도 테스트, 배포·출고 승인 `NOT_RUN`. 원본 JS·PNG·SVG, 정답·`main` 무수정.

## 연도별 누적

| 연도 | 시험지 | 참조 이미지 | PNG | SVG | 새 문제 미발견 | 이미지 수정 예약 | 원문↔그림 HOLD |
|---|---:|---:|---:|---:|---:|---:|---:|
| 2019 | 5 | 47 | 23 | 24 | 44 | 3 | 0 |
| 2020 | 3 | 21 | 13 | 8 | 21 | 0 | 0 |
| 2021 | 8 | 51 | 25 | 26 | 51 | 0 | 0 |
| 2022 | 6 | 31 | 14 | 17 | 30 | 1 | 0 |
| 2023 | 12 | 84 | 17 | 67 | 83 | 1 | 0 |
| 2024 | 6 | 56 | 10 | 46 | 55 | 1 | 0 |
| 2025 | 6 | 62 | 6 | 56 | 62 | 0 | 0 |
| 2026 | 5 | 18 | 6 | 12 | 17 | 0 | 1 |
| **합계** | **51** | **370** | **114** | **256** | **363** | **6** | **1** |

## 이미지 관련 추적 항목 7개

| 구분 | 시험지·문항 | 자산 | 판정 | 근거와 후속 |
|---|---|---|---|---|
| 기존 | `19_강남여고_1학기_중간_고2_수학I` Q03 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q3-solution.svg` (blob `d2603a523c344749123a6ce78bc00770fcb6c3d3`) | `VISUAL_UPGRADE` | 제목/결과 수식 중첩; **SVG 레이아웃 재제작** |
| 기존 | `19_강남여고_1학기_중간_고2_수학I` Q22 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q22-solution.svg` (blob `03f98fa1b9531ae2a0880524fc7cc66c7854c0fe`) | `VISUAL_UPGRADE` | 설명/범례 중첩 및 하단 잘림; **라벨 여백·배치 정리** |
| 기존 | `19_강남여고_1학기_중간_고2_수학I` Q25 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q25-solution.svg` (blob `46bf0b38ce1a826e4ffe0f45a0af201dff898641`) | `VISUAL_UPGRADE` | 하단 예시·좌표 라벨 충돌; **SVG 재배치** |
| 기존 | `22_금당고_1학기_중간_고2_수학I` Q18 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-problem-v2.svg` (blob `a9511e7ebb0fb794e4fe9fbe6bc52bc79d656996`) | `VISUAL_UPGRADE` | OA=10 문구가 점 C/x축과 겹침; **반지름 라벨 외부 이동** |
| 2026-11-22 신규 | `23_한영고_1학기_중간_고2_대수` Q13 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q13-solution.svg` (blob `c5cd592558ac0512bd3e1eea2f5cd96bd51c240f`) | `VISUAL_UPGRADE` | 우측 극대점 x=25π/8 라벨/점 클리핑; 문제 필수 그래프가 해설에만 있음(기존 Q13 HOLD); **SVG viewBox·라벨 재배치 + 문제용 그래프 복구** |
| 2026-11-22 신규 | `24_매산여고_1학기_중간_고2_수학I` Q15 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q15-solution.svg` (blob `fe086869c1c94f42498df568c30884d46f75beb6`) | `VISUAL_UPGRADE` | 최댓값 -1/2 그래프를 x축 위에 배치(음수값 축 표현 불일치); 계산/답은 맞음; **실제 y=0 축에 맞도록 사인 그래프 수직 재배치** |
| 기존 | `26_효천고_1학기_중간_고2_대수` Q23 | `archive/assets/images/26_효천고_1학기_중간_고2_대수/q23.png` (blob `8837e92f8b452d72666242c9e2ca11ea22c890fe`) | `SOURCE_LINK_HOLD` | 이미지는 AB 기울기 -1·BC 수평, 원문은 AB를 지나며 수평인 직선이라고 진술(기존 Q23 HOLD); **출제 원문 교정 승인 후 이미지/문장 일치 검수** |

### 이번에 새로 발견한 문제 상세

1. **2023 한영고 대수 Q13 — 우측 끝 라벨 잘림:** 해설 `q13-solution.svg`에서 다음 마루 `x=25π/8`의 표기와 점이 SVG 이미지 우측 경계를 넘어 클리핑된다. 함수 `y=2cos((4/5)(x−5π/8))+1`의 주기는 `5π/2`로 계산 자체는 맞다. 다만 원래 시험 문제는 `content`에 제시해야 할 그래프가 빠져 있고 같은 그래프가 `solutionImage`로만 연결되어 있으므로 **기존 Q13 HOLD를 반드시 유지**한다. Q13 수학 HOLD를 새 UPGRADE로 중복 계수하지 않는다.
2. **2024 매산여고 구 수학Ⅰ Q15 — 부호와 축 정합 오류:** `y=(1/2)sin(3x+π/4)-1`의 최댓값은 `-1/2`, 주기는 `2π/3`. 해설 `q15-solution.svg`에는 최댓값 텍스트 `−1/2`가 있지만 곡선 마루와 점선이 `y=0`인 x축보다 위에 표시되어 실제 함수의 음수 범위와 모순된다. **정답 ②·해설 계산은 정상이어서 수학 KEEP는 유지**하고, SVG 축/곡선 재작성만 별도 예약한다.

### 기존 결함과 다른 보류의 경계

- 2019 강남여고 Q03/Q22/Q25는 이전 실물 판독에서 중첩·잘림이 이미 확정된 SVG 3개. Q05는 이미지가 없는 **해설 MathJax `\\ne` 텍스트 깨짐**으로, 이미지 7건에 넣지 않음.
- 2022 금당고 Q18 문제 SVG의 `OA=10` 라벨은 점 `C` 표기와 충돌, 기존 UPGRADE 유지. 같은 문항의 보조 해설 SVG는 별도 시각 이슈 미발견.
- 2026 효천고 Q23의 PNG 자체는 정상 판독되나 `AB`는 비수평인 반면 문제 문장이 `AB`를 지나는 수평 직선을 지시하는 **원문 정합성 오류**. 기존 `HOLD_SOURCE_TEXT` 상태 유지. 이미지 자체를 조작해서 원문을 추정 수정하지 않음.
- 2024 순천고 Q08 등 기타 수학 HOLD 원인은 각 개별 심층 감사에 기록. **이미지와 직접 관련된 7건**만 이 표의 분모이며 수학 HOLD 8건 전체를 대체하지 않음.

## 증거 수집·판정 규칙

1. 원본 51개 JS의 `content`·`choices`·`solution`, `image`·`questionImage`·`solutionImage`를 포함하는 직접 참조를 추출해 경로를 유일화, 원본 Blob SHA와 문항 번호를 연결.
2. 2019–2020 68개는 앞선 심층 감사의 PNG 실물 판독/SVG XML 및 Inkscape 래스터 실물 판독 증거와 경로·blob SHA로 연결. 이번 작업에서 별도로 재수신·재렌더하지 않음.
3. 2021–2026 302개는 원본을 실제 수신했고, SVG는 각 자산을 Inkscape로 PNG 변환, PNG는 원본을 그대로 디코딩한 뒤 12개짜리 레이블 연락시트 26매 및 의심 자산의 개별 확대 화면을 육안 확인.
4. 이미지 크롭, 축·단위·함숫값, 글자 충돌, 그래프–문항 관계를 우선 점검. 라벨이 작아도 판독 가능하고 원문의 필수 정보와 충돌하지 않으면 `OBSERVED_NO_FLAG`. 실제 오류와 원문 승인 보류를 별도 분류.
5. 검수는 이미지 **참조/시각** 단계까지만 완료. 별도 승인 뒤 원본 자산 수정 → 문항·해설 재계산 → 브라우저 실제 학생 렌더 → preflight·Golden/Negative → 출고 게이트가 필요함.

## 이미지별 원본 경로·Git blob·판정 (370/370)

- `VISUAL_UPGRADE`: 이미지 수정 필요. `SOURCE_LINK_HOLD`: 그림/문장 연결 문제로 출처 대조 후 승인 필요. `OBSERVED_NO_FLAG`: 본 시각 감사에서 새 결함 미발견.
- 2019–2020은 기존 실물 검수 인계; 2021–2026은 이번 실제 취득·렌더·육안 확인. 문항 번호가 같은 서로 다른 문제 PNG/해설 SVG는 **각각 별개 이미지**로 집계.

### 19_강남여고_1학기_중간_고2_수학I — 20개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q03 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q3-solution.svg` | `d2603a523c344749123a6ce78bc00770fcb6c3d3` | `VISUAL_UPGRADE` |
| Q07 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q7-solution-v2.svg` | `78e3f47706a0e0efbd37b51f71599c2da754b258` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q8-solution.svg` | `ff29e48c565ac154a9be0842961f276760046c38` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q13-solution.svg` | `b4567bd66355b897445ce7c6c7b4334f70aaba7c` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q14.png` | `df9a67fd0ae48092e5214b5b5bb219db558c50a7` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q14-solution-v2.svg` | `fbb992b824bc1522d262fbc34c52ae759f74690e` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q15.png` | `83368eba401ef204946de386f736f4ec23fd2d9a` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q15-solution.svg` | `26aa580e3db1342eadd4bfe9e6ae6e823df280c4` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q17-solution.svg` | `89dac86d89a8b8abe168e93723e183cd188d94e7` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q20-solution.svg` | `752e0423d7d969aac486dd8a365bf28023df3d06` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q21-solution-v2.svg` | `b0534bb99e5a996cfa72bab700829abe30a00bb9` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q22-solution.svg` | `03f98fa1b9531ae2a0880524fc7cc66c7854c0fe` | `VISUAL_UPGRADE` |
| Q24 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q24-solution-v2.svg` | `0b84a89d48b9bda9c782d411629f64e2f8c8122a` | `OBSERVED_NO_FLAG` |
| Q25 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q25-solution.svg` | `46bf0b38ce1a826e4ffe0f45a0af201dff898641` | `VISUAL_UPGRADE` |
| Q26 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q26.png` | `0f4c2341528503eae9917b81d1c259615194b0ab` | `OBSERVED_NO_FLAG` |
| Q26 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q26-solution-v2.svg` | `52f6402ccc9be603aedb482ecc915d6cdd19ca32` | `OBSERVED_NO_FLAG` |
| Q28 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q28.png` | `922de45f71761bb883a5cdecc3b90457777a332f` | `OBSERVED_NO_FLAG` |
| Q28 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q28-solution.svg` | `b403c50528ebd8de57e2dea84ca76df41daf2f99` | `OBSERVED_NO_FLAG` |
| Q29 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q29-solution.svg` | `4b88efbbff0debdc3600cc122ca7165c7f780fb4` | `OBSERVED_NO_FLAG` |
| Q30 | `archive/assets/images/19_강남여고_1학기_중간_고2_수학I/q30-solution.svg` | `99fbf06cc6cb67f8935fa1afac45ffea497071e7` | `OBSERVED_NO_FLAG` |

### 19_금당고_1학기_중간_고2_수학I — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q08 | `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q8-solution.svg` | `d50329fc88f444733d0bd6e5e5e54db15a8fe7ca` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q09.png` | `4ff7fa882c574713b2c9abf5e748c5d14c84d147` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q11.png` | `348bb45c7eded45fdeed4065f3c243b6e269aa76` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q14-solution.svg` | `eaf98d9a6c579586e7edb3b2df93d3a6afde15b5` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q21.png` | `dd12ee3d79340c05292edf76a8fdd699ea6eacae` | `OBSERVED_NO_FLAG` |

### 19_매산고_1학기_중간_고2_수학I — 8개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q08 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q08.png` | `7dd0b885d3d6ecc69f93e7f6d0c82d79f9eac20b` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q10.png` | `74bc8607e3fd09d97880ab0dc6377604144ce244` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q13.png` | `0048862f6240b0e0031ed10172ca20ee65946023` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q14-solution.svg` | `82f22d10793b104d70fa84f0a69190f7b4042d0b` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q17.png` | `5d0a814a7480e90176d87a7d13d897f4a7affe2b` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q18-solution.svg` | `e6ce856b8ae020d718cc79108a70f81edfdce274` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20.png` | `48b5c854af7a6eb279ea38f92f6f9334e31dffed` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/19_매산고_1학기_중간_고2_수학I/q20-solution.svg` | `8ed1f2e7edc0914655a6d26f11a46c139b658ce0` | `OBSERVED_NO_FLAG` |

### 19_매산여고_1학기_중간_고2_수학I — 4개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q06 | `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q06.png` | `b610edad988d273caf8a4aa947eb5f76f4521cf0` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q14-solution.svg` | `12c3e5574108335970035120aa5c8ee5e4a3b890` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q16-solution.svg` | `3fe9ce42ab9a0895dbc08ebb4c20b562ecf7508d` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/19_매산여고_1학기_중간_고2_수학I/q21.png` | `4634f7181a127db4715d3b627c26807c7efb367d` | `OBSERVED_NO_FLAG` |

### 19_순천여고_1학기_중간_고2_수학I — 10개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07.png` | `76a31f3a1f907e099e085f9ec094fe95e9915e23` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_1.png` | `86c9dd36407a5664131dce61bf31fef0fe71ac4d` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_2.png` | `8730ba923441eaa13acc3206c822faee33d4f2dc` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_3.png` | `fb37cc4312bcb47d7db5add3d0a625ee1102e2a6` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_4.png` | `7cb5c4e053b74e59ff2fb3e5416039ebb3bd685a` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_5.png` | `b8340370fd93a0301c3faf17fd73c9fbe64ee299` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q12.png` | `8695cac83e637ab35e92958115a5875b7d5191df` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q17.png` | `1c4145cba97f778c0e41fbf1ee2716e829357aba` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q19-solution.svg` | `b3c6dbf0c9728ce75093d2547f9b3feb4d0a221f` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q20.png` | `715558781fab43425f7979e9fc522dd1485853a3` | `OBSERVED_NO_FLAG` |

### 20_매산고_1학기_중간_고2_수학I — 11개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q07_1.png` | `3da28fea761637916bfaeedf98f44b3ade121bf8` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q07_2.png` | `cb66ee3cf489c8f09c5cb0400e0e0effb585f244` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q07_3.png` | `82a92735af3bae45052893ea8f61b61fa7765274` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q07_4.png` | `3cf9360400dde805a1e5a61d7aa21514e4b4810b` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q07_5.png` | `5f4da9b8bd2f282525ba1e30ea4fc38652acc96e` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q7-solution.svg` | `d747f1bad9e4b7e9eab4e6c970dedd8d81b2e8f2` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q11.png` | `027d5b0f7a7d5a000815ae82fb25a5eb98bede26` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q11-solution.svg` | `72144d0e487abeeeccf9dde985afbc9e937bf8e0` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q15.png` | `c92aaaa8c1f9b6df6457ef6939c65dd6b7b15d6a` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q15-solution.svg` | `5fa0553eacc97737ec6765448fd7eb61e18de700` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/20_매산고_1학기_중간_고2_수학I/q20-solution.svg` | `32207ca0ee786e9136ad9c1c829497d30123504d` | `OBSERVED_NO_FLAG` |

### 20_매산여고_1학기_중간_고2_수학I — 8개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q7-solution.svg` | `304a3827930fae608ff58d8fdbc5596a1257b01e` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q10.png` | `47d3a44c531669ff856d7cde04d011679e2050e5` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q12.png` | `abd8623f236bda80c281046ceec1d0ad352735ea` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q16-solution.svg` | `293aa35796a4f5c236f3c085125ae3ad171f9ab2` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q18.png` | `12f32e7ad513a1007ab14deacd6e80349881149f` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q20.png` | `b9e4fd2766df6cb925d874364cb6f7e103381d6c` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q20-solution.svg` | `607b82ae32dbb5b01eebd9ab0012de9785ae3b57` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/20_매산여고_1학기_중간_고2_수학I/q23-solution.svg` | `5f097677d6309175b53328117c3937b74011857f` | `OBSERVED_NO_FLAG` |

### 20_제일고_1학기_중간_고2_수학I — 2개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q08 | `archive/assets/images/20_제일고_1학기_중간_고2_수학I/q08.png` | `adeee4b4eaed096661bc19f41587bc1b82c7a857` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/20_제일고_1학기_중간_고2_수학I/q17.png` | `c60004367da0db36e8d514f3c154571851013a5c` | `OBSERVED_NO_FLAG` |

### 21_강남여고_1학기_중간_고2_수학I — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q12 | `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q12-solution-v2.svg` | `b03e9a3c7633c3e2ee8a2f5c7bab174a80e1260d` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q23.png` | `50da192d5051dc4185d1e8405f5fabd6969efd84` | `OBSERVED_NO_FLAG` |
| Q25 | `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q25.png` | `556eb5a8eff16b01ca41866d8725952e96482f69` | `OBSERVED_NO_FLAG` |
| Q26 | `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q26.png` | `a2b37b6e057faf88f1001088f591e7284b189a98` | `OBSERVED_NO_FLAG` |
| Q29 | `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q29.png` | `47cc46b66facef017a49731fff811486c9f1f18e` | `OBSERVED_NO_FLAG` |

### 21_금당고_1학기_중간_고2_수학I — 11개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q11 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q11-solution.svg` | `0915a7e1898ef9595a75f4123c0afb98d37087d6` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q13-solution.svg` | `9be795c8d66d94fda791be81ac9003946c5dcc2c` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q14-solution.svg` | `95e360574f1e697aaf548158e5dc73644df40681` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q15.png` | `67814774701d81ff484b31e801b53b10062d21bb` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q16.png` | `45df60d5d4fd8eef390aadb04b8b8ba7f055ee94` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q16-solution.svg` | `03c13613e881bc00aaa94c0da3c96e5826222c50` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q17-solution.svg` | `263b542f6b67c58ad2dd6a67449667ccf57ba19d` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q18.png` | `3a7c258abb61eb0adb43a8f2e12713fb8432a45b` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q18-solution.svg` | `fc11b42e77fad6808e3f7a1930a0a6b96123ad66` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q19.png` | `ce429d53ea9bc32a0d8951566a9243e42763f729` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/21_금당고_1학기_중간_고2_수학I/q22-solution.svg` | `650ca4f57c61d591c5eeada220e9d7406a18736a` | `OBSERVED_NO_FLAG` |

### 21_매산고_1학기_중간_고2_수학I — 0개

- 직접 참조 이미지 없음 (시험지 문항 심층 감사와 별개).

### 21_매산여고_1학기_중간_고2_수학I — 8개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q05 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q05.png` | `a12f3902c1c13e3705ea90057e9188ad3962b35e` | `OBSERVED_NO_FLAG` |
| Q05 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q5-solution-v3.svg` | `9bba6f0d3fed56d931a482339eb6a1dddb331113` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q08-solution.svg` | `0a939b55c4cca19a81fd0de6139190d601f4a6f9` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q09.png` | `1125c4e364346ee201e325fba1bffb577efc5f80` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q09-solution.svg` | `45f23746c1ffc9c58494be6e51b1d3d10782b7b6` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q16-solution-v2.svg` | `a7b64ca2ce9304aa36dfd7e96b6c5f2d9704dfd1` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `61d9efd212dd3973ab3b391643c9c74c16080166` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/21_매산여고_1학기_중간_고2_수학I/q23-solution-v2.svg` | `c74ae41269a32ce60c2408c0794fabb14f7a0c06` | `OBSERVED_NO_FLAG` |

### 21_순천고_1학기_중간_고2_수학I — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q7-solution.svg` | `ab355fae1ff796eea5d989c25d41feece4c50cb2` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q8-solution.svg` | `80749cd3769c8fd73266c4358f6dc0d6e065532b` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q14-solution.svg` | `40aced366f244ea033bfcf9a2ee942146cd62b6e` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q16-solution.svg` | `d80b268dbf643be58b1a21d5f06768198512dcfd` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q17.png` | `ec7b84bc729aae9f62a855babd43d30624c2f1ec` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q18-solution.svg` | `3aed0bae5926d7878e26822dfe99a590ab0e91f3` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `5f5c7a561fbb369c921d7a5ca9d07ba3314a9656` | `OBSERVED_NO_FLAG` |

### 21_순천여고_1학기_중간_고2_수학I — 4개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q14 | `archive/assets/images/21_순천여고_1학기_중간_고2_수학I/q14.png` | `8feeaaec769a2dd3007695f586bd74c80fa56352` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/21_순천여고_1학기_중간_고2_수학I/q15.png` | `8a49cc250c43f26dca44487724ab4d90ee26b530` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/21_순천여고_1학기_중간_고2_수학I/q19-solution-v3.svg` | `13b922dddce478accac4c84a78581ab466ccfe53` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/21_순천여고_1학기_중간_고2_수학I/q21.png` | `83a6a54c19328608e892a75228fdd418075afa0c` | `OBSERVED_NO_FLAG` |

### 21_제일고_1학기_중간_고2_수학I — 10개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q07.png` | `fa404babad3eda20996b2312f3a5e60cc40a647c` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q08.png` | `774aa7e679ca152940f4e7fdb5c92a899518ac35` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q9-solution.svg` | `43ff1d61985bd0f2e86bb72930d59538f53f0bd2` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q11-solution.svg` | `172ccf8e0a76e968a78e6433a336987c27658fa7` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q15.png` | `e31df4d015e4df1f4f3b9385544c67062850e362` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q17.png` | `e2eb2a2aa3bcb8f42a69f856cc2c40c8ff49f3eb` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q17-solution-v2.svg` | `f1e9a93a1d278df70a0883cbd75b8b1a8df9652d` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q20.png` | `948b5bee7d19ad7ec4bb52197eab39bf580901c4` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q20-solution.svg` | `1f5b75a45d742cc560cab7b0cee6b664dd44138b` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/21_제일고_1학기_중간_고2_수학I/q23.png` | `c7e14f426f296f9db17bdf70f43b7dc7f83af815` | `OBSERVED_NO_FLAG` |

### 21_효천고_1학기_중간_고2_수학I — 6개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q06 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q06.png` | `05d09bc8bc81c88634cda493b977c5f13286279a` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q17.png` | `6d188b6afd418c9800653c9fc0e84f10ebd699c8` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q18.png` | `7656ed02c87764e1160eb773d07919ea6a25eabb` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q19.png` | `494edf3db36f5facc6e6b5edc64024b6d59e87d7` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q20.png` | `0cd9d0d307bf3f81c72992f196c49325cf5d174a` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q20-solution.svg` | `900d81b838d56b7c74411dc89e1e82b179f6548b` | `OBSERVED_NO_FLAG` |

### 22_금당고_1학기_중간_고2_수학I — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q06 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q06.png` | `963fc26e5799b493633c6c135a4fd26bab7c2d3e` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q11.png` | `63d6785de777e29f5408b6900c611ddaa66550dc` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14.png` | `801e94c0aa2e0a7cbed726264ee7fded9ac67e5a` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q14-solution-v2.svg` | `6eb2171bf09e9580cb9fa8ee6cc3f5589eb52f59` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-problem-v2.svg` | `a9511e7ebb0fb794e4fe9fbe6bc52bc79d656996` | `VISUAL_UPGRADE` |
| Q18 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q18-solution-v2.svg` | `6288668a34690902267c2b1389ee74a64c978296` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/22_금당고_1학기_중간_고2_수학I/q19-solution-v2.svg` | `97a99d2839350eed3c8781d80845c0450088893c` | `OBSERVED_NO_FLAG` |

### 22_매산고_1학기_중간_고2_수학I — 10개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q03 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q03.png` | `730f7c46ac3fc150a7e0766e8d238118818373fe` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q09.png` | `60209586eaced70d05b84103c6cab2953d0ef29c` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q9-solution-v2.svg` | `8722b025ac2a0cfbdf66a811aa179273fc73351a` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q11.png` | `9e08b4d1693d99bc0a582999eb6968a8c068105a` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q12-solution-v2.svg` | `8f1862843c41931400c88c7b3c316391e75667b7` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q14.png` | `65341708f4cbd1678ded6486c462d7c50f62419d` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q14-solution-v2.svg` | `d3ffcaf7e788d20b3f7c4c97ba7a931fa4667ccb` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q15-solution-v2.svg` | `9944b882b4af2e14acfc6115688ebf65a1b41cd5` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q18-solution-v3.svg` | `2838404bfac87e87be3d7cab7dcdab4ee0b57109` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/22_매산고_1학기_중간_고2_수학I/q20-solution-v3.svg` | `1284cbdf41ef4293f09e474a5ecf43a63c049863` | `OBSERVED_NO_FLAG` |

### 22_순천고_1학기_중간_고2_수학I — 1개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q11 | `archive/assets/images/22_순천고_1학기_중간_고2_수학I/q11.png` | `14073d6b36aa071ec46b0214f8f83353d6366fba` | `OBSERVED_NO_FLAG` |

### 22_제일고_1학기_중간_고2_수학I — 4개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q14 | `archive/assets/images/22_제일고_1학기_중간_고2_수학I/q14-solution.svg` | `da74399b3792d76bd11c06bd5b7d799bd1866f27` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/22_제일고_1학기_중간_고2_수학I/q16.png` | `7695ed515e68cec6783e3d7e8a4e218f90873dc2` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/22_제일고_1학기_중간_고2_수학I/q17.png` | `dd223813a7af2ae35228cec16a8d67dfb830749d` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/22_제일고_1학기_중간_고2_수학I/q18-problem-v2.svg` | `567afdfbf49259912da3de42fd3a08827b3b41a6` | `OBSERVED_NO_FLAG` |

### 22_팔마고_1학기_중간_고2_수학I — 3개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q16 | `archive/assets/images/22_팔마고_1학기_중간_고2_수학I/q16-solution-v3.svg` | `ff2005396c4f6c98fb3d5e43d2c9a02965fab09b` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/22_팔마고_1학기_중간_고2_수학I/q17-solution-v2.svg` | `a553b3e57e8d49935adea0960398316eb6121969` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/22_팔마고_1학기_중간_고2_수학I/q22-solution-v2.svg` | `87b705d7e71892b55516c178bff125ab6c90859f` | `OBSERVED_NO_FLAG` |

### 22_효천고_1학기_중간_고2_수학I — 6개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q14 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q14.png` | `e91872d276db11fd2d0db1deca3fe8fe976d83c0` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q16.png` | `04111ae4ffca7310e55ee53c9a6ee353097f580f` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `12044c6588b9105b040b28fa3fe8b229ba0c65ba` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q24.png` | `abc456ae4e2a840a04727b8cfc7a54019626875b` | `OBSERVED_NO_FLAG` |
| Q25 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q25.png` | `7fd7c7790299132483c31104e2240423102657ad` | `OBSERVED_NO_FLAG` |
| Q25 | `archive/assets/images/22_효천고_1학기_중간_고2_수학I/q25-solution.svg` | `be541d8df7ccd8082d980f98d20495cf01dc8fe0` | `OBSERVED_NO_FLAG` |

### 23_강남여고_1학기_중간_고2_수학I — 9개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q02 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q2-solution.svg` | `d54912f3e0588c710172a3ac613e2576f6f5ec0b` | `OBSERVED_NO_FLAG` |
| Q03 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q03-problem.svg` | `fda244ab9f2a8243864425887bc756f60b92753c` | `OBSERVED_NO_FLAG` |
| Q06 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q6-solution.svg` | `dca43feec794ec9e690de6ecf1b0a0d0c2e98f31` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q10-solution.svg` | `c3545dffda2ba3ad4fc0709430505ed468505098` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q11-problem-replacement.svg` | `f3ae0d6f88d5f421a989846b11645bb55fe07c9a` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q12-solution.svg` | `15bae48a0f5eaac1f75f3a118f25995cb0bdc7fb` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q18.png` | `87d01401479004cbfbb72f834f28f2f162c5cd12` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q20-solution.svg` | `2eec4857d8588b27f72fc81267a8aace59028423` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q21.png` | `c25a7b047bba40f8de4d17fd0deff98d3b88eb72` | `OBSERVED_NO_FLAG` |

### 23_금당고_1학기_중간_고2_수학I — 6개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q07.png` | `cead384b20473fcb36b21de263a556c8a7cace33` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q11-solution.svg` | `e01ebd04754b24eeefafd8dccf8f3e316ea88f84` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q13.png` | `5caf357ace4850386912857a9cd87c42affd9f22` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q14-solution.svg` | `008ec91ddd93699bcecf45479c3eb8a0faba3473` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q18-solution.svg` | `2e68bc743f3a0316b01a2281d8bbe4c6c70dcaf2` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/23_금당고_1학기_중간_고2_수학I/q19-solution.svg` | `af4c96332b0efbb1b0e462e9683fc6c4272596ec` | `OBSERVED_NO_FLAG` |

### 23_매산고_1학기_중간_고2_수학I — 6개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q04 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-b.svg` | `162a7ce33d64637f759f0c7092cbdf616047925c` | `OBSERVED_NO_FLAG` |
| Q04 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-c.svg` | `518799c993f99f5db867f810c241bd2644a7e5f0` | `OBSERVED_NO_FLAG` |
| Q04 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-a.svg` | `092df1fe99b0dc4952b2d5942e978ac72b411c7f` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q14-problem-v2.svg` | `d4322dbd9444c35c9908d5ad0db0ee10d1dd8685` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q18-solution-v2.svg` | `b8456d5721a538adb6bdb44348b009974332b516` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `c1121c5d2e6569816b1fb26b42c1ba61c1879916` | `OBSERVED_NO_FLAG` |

### 23_매산여고_1학기_중간_고2_수학I — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q09 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q9-solution.svg` | `6331256b812d427e7ec484ea654f08126b81b86d` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q13-solution.svg` | `797c86701b234e6b53a0ce20b346ec7de2aa3904` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17.png` | `e7e0ed378450b686e54d29d84abd1ce1fa6b8091` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q17-solution.svg` | `8dea1db2aba0cf204d652fbb16f4c0a2fa48ca23` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q20-solution.svg` | `f7ea94e25b1c9e6a63df54bb81a6a28b737386c5` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21.png` | `4b3ea167044eebbf553ec43bab079befce8550a4` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_매산여고_1학기_중간_고2_수학I/q21-solution.svg` | `56ad24ee51ab0a24ce7314ef1969e28b3470f0c4` | `OBSERVED_NO_FLAG` |

### 23_복성고_1학기_중간_고2_수학I — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q09 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q9-solution.svg` | `32f3bd6fb660679e15a7a0049e4fa0bf2bdaf547` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q11-solution.svg` | `163e8db4349215fa2e499c611c3fccd2018b0f73` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q13-solution-v2.svg` | `54b2c14a11e080984d15809d76e956c3a9e9e9d7` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q18-solution.svg` | `c724d81cb224e43e088c04d11780ebd0918f3064` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21.png` | `3c25c00ec866841b599ed43c97c5e8f2669ad04c` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q21-solution-v2.svg` | `ca62be64ca2a63cf594599b3f1fbf34bd9b60dc6` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/23_복성고_1학기_중간_고2_수학I/q22-solution.svg` | `8fd93675482cc6313093a95b96d02e31e2196069` | `OBSERVED_NO_FLAG` |

### 23_부영여고_1학기_중간_고2_대수 — 4개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q02 | `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q2-solution.svg` | `3696dc288c7151cbb0d63d168d1ca51dbd26a485` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q13.png` | `9d833fe78a049e4379cf089feacf27b5ff7b49e6` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q15-solution.svg` | `eab832118df62b85e91ae90eb5fbecccd59196db` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q21-solution.svg` | `ae75f94346805d9146be8988c9acab85d841e46a` | `OBSERVED_NO_FLAG` |

### 23_순천고_1학기_중간_고2_수학I — 11개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q02 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q2-solution.svg` | `701f7e9e66c7899ab9ec7cdb9e268075bd643e6e` | `OBSERVED_NO_FLAG` |
| Q03 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q03-engine-upgrade.svg` | `6a644dff453d3a42b0ac73fcce8e2b113f8ee4f5` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q10-solution.svg` | `3d24d673484e97c97ee212aaa00c9b608e511f3e` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-r3-source-recrop.png` | `0abfdd8fa07286833833b717158b1418dc551b72` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-solution.svg` | `ccffe50cb6566f0f9f8b574bf53891770ae54b55` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q15-solution.svg` | `d51f46543df7889fdde5f9b78449af6c8f4c14d5` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q18-solution.svg` | `df2607c51c99c37c43452b9fffdc9a446167e358` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-r3-source-recrop.png` | `9d1845e0e61cdbb1ae298fedc3939c155c71248f` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-solution.svg` | `e26f09a38589ba6eef90cd5a12ac97a32368412f` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q21.png` | `faab86cc70522ddefeb18f8531552566deb883de` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q22-solution.svg` | `75a125fb5ce6385f8683702c546fe2d5b99b3c6a` | `OBSERVED_NO_FLAG` |

### 23_순천여고_1학기_중간_고2_수학I — 12개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q7-solution-v2.svg` | `85b380a3084f19fd4ca7136d2caa51e321e48385` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q10-solution.svg` | `a15f11018d9c55657a1a542347dc229ad5a7a617` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q12-solution.svg` | `bc804833645a835f4930fdcce31305dd5a882795` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q13-solution-v2.svg` | `9a9c6b7c9ca1139f838c0f84fb1b04d952e2cf72` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q14-solution-v2.svg` | `53005dcdc8d980e9def184aff1f0418dc45da81b` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q15-solution-v2.svg` | `cec9fe0b7d6ba3b2911a3fcfa1897deff6e29162` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q16.png` | `dfc58321ee95a3533e35efbd647b90992b7fa613` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q18.png` | `3e6b4b232a06cd62ebf3d90f9ffea552a02ca825` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q19-solution-v2.svg` | `3b731e83a42930f4f7dc178c7de93cc9205a85ed` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `ef76e8910a1662b95987b48a9fe72c6e69a028a2` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q22-problem-v1.svg` | `c620e6da621ec244f0201e9f811aeb0815cab3e6` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q23-solution-v2.svg` | `e909a680ea4ea1aa0b170c3a5f28a8bfdc36449c` | `OBSERVED_NO_FLAG` |

### 23_제일고_1학기_중간_고2_수학I — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q03 | `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q3-solution.svg` | `8ce49954b9ddca2adf5051d746aa9e008f4f1868` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q9-solution.svg` | `f0ffe1d5f640673e7cd7b3ca08cb26000dcc40a3` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q16-solution.svg` | `4de72c4138b4570c62c369f6a7b8c589e18faf0a` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q17-problem-v1.svg` | `26c4d0dd1de6a0689c472a51832d58b15354250b` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q18-solution.svg` | `97e5ceda9c0ac74b0f24e505efa46d1cff4ae3ab` | `OBSERVED_NO_FLAG` |

### 23_중앙여고_1학기_중간_고2_대수 — 2개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q04 | `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q4-solution-v2.svg` | `48cc64a040794ba956fa4fc60772433922172f72` | `OBSERVED_NO_FLAG` |
| Q05 | `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q5-solution.svg` | `58fb1bf1ba7d8d6e546d6687a18772e51a42dfa0` | `OBSERVED_NO_FLAG` |

### 23_팔마고_1학기_중간_고2_수학I — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q09 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q9-solution.svg` | `0b48744ddce07af16383cd1aa2fee61f4ee78274` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q10-solution.svg` | `4516cb72162f75e0f7602861a0e751e8f71cb5e2` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q11-solution.svg` | `e67b8bc66c0b1027f57ad62e7c5ea182463f812d` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q12.png` | `35e8a53bad234c214e465ff878568632d9ffbe9e` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q13.png` | `a77530c02374face69cfcb0b86182b905b9e7185` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q17-problem-v1.svg` | `967d4c8fbbf2b2162112487cb66e94424b620e29` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q19.png` | `cd35933d688fb570185cf965f79d91169156640c` | `OBSERVED_NO_FLAG` |

### 23_한영고_1학기_중간_고2_대수 — 8개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q03 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q3-solution-v2.svg` | `4f0f211f5313c363afacc245a504b36d3dbd8875` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9.png` | `8d69ff81cd7dbb12a430fc8dcade8760886662e0` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q9-solution.svg` | `2916f2de461e912842fdbae4c7c49e73ae5460d6` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q11-solution.svg` | `268d7f72b0cfdb33c61faa9d015ee3df21115d86` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q12-solution-v2.svg` | `9f4ae00340c452602fea3bdd5509c93ead07dc5f` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q13-solution.svg` | `c5cd592558ac0512bd3e1eea2f5cd96bd51c240f` | `VISUAL_UPGRADE` |
| Q14 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q14-solution.svg` | `df13c2003d7463bd323bf55d67729bd888afa41b` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/23_한영고_1학기_중간_고2_대수/q21-solution.svg` | `70ae8608a185dd3804a29be001b68bb5f4f612f7` | `OBSERVED_NO_FLAG` |

### 24_강남여고_1학기_중간_고2_대수 — 12개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q09 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q9-solution.svg` | `77bde73fa08e0873a4b954f705ae715800c99426` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q10-solution.svg` | `06114c8be0bfe41302949c631d8b799584963ab6` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q15-solution.svg` | `f28231fe711ad124ed20c6e2a3f155102f98aa84` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q16.png` | `71f79da5a41044fbe755188d72c71fd2d7442a55` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q16-solution.svg` | `8d22b6029cf433e354e487ac95f0fad3cf72cee9` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q18.png` | `53bc114643cc0976f2ecfe75f44cead7e02154ea` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q18-solution.svg` | `52ad5057bdca8a3c449b814ce5f04232f60214b2` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q19-solution.svg` | `67a64a4c307294084dc11153323ddcb8e4b6ce73` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q20-solution.svg` | `ec130b24e3285497022e4ffe69dc5fbeaf6b49e5` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q21-solution.svg` | `9d5a1de6f4c5c24d8040772d6e90fb42ac84d07b` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q22-solution.svg` | `0b05886ad0bbe07cfa762834734a5c1c52eccb4b` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q24.png` | `d7a372f2d233818daf916969c630bb6b7087f79f` | `OBSERVED_NO_FLAG` |

### 24_금당고_1학기_중간_고2_대수 — 9개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q09 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q9-solution.svg` | `5fad6ce695fc16bbffed51f8ecdcf838fd5fafd2` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q11-solution.svg` | `e4a837bba773b0901d8dac1483be98b4a804197c` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q13-solution.svg` | `147b505abe541556117e48ae69006c937ef13d64` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q14-solution.svg` | `7877921d8b3bf8770a5d074dae2edc7f9e68b2de` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q16-solution-v2.svg` | `2b71183bba79acd0057c22b11e81f5094660a10c` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q17-solution.svg` | `77e0607222d8feb54f66b0cada337e79767852b8` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q18-solution.svg` | `db4c3b474b58dd7cf4ec43afaa4ada64d28e46d9` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q19-solution.svg` | `dc277789ddd0b1a6531c2d7fac658ddf34819e77` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/24_금당고_1학기_중간_고2_대수/q21-solution.svg` | `58dbb8296180c8d169f72b837d254f065b4313c2` | `OBSERVED_NO_FLAG` |

### 24_매산여고_1학기_중간_고2_수학I — 16개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q04 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q4-solution-v2.svg` | `ea7732ef0e5d31d9687874db9500f77d06ec957f` | `OBSERVED_NO_FLAG` |
| Q05 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q5-solution-v2.svg` | `adb3c6177d47613d25de6d8b54b01d3464b3c4e9` | `OBSERVED_NO_FLAG` |
| Q06 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q06.png` | `42aca5e3f1d66bc472ef0bdf01ff1232544ed1cd` | `OBSERVED_NO_FLAG` |
| Q06 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q6-solution-v2.svg` | `fc185e5dae0e917f703d496b51665727bf9d1f7d` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q8-solution.svg` | `090721c4c4532b55820d0db0d7ab1ac86e5fec1b` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q9-solution-v2.svg` | `7dc21da7755bae8db11f6602c29728e854297302` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q12-solution.svg` | `b8f1df1cb065d85068b9f4d0e2391a0aba408201` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q14-solution-v2.svg` | `dd36177b8c0a3b90c569cfaa4c83d6a017f498f9` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q15-solution.svg` | `fe086869c1c94f42498df568c30884d46f75beb6` | `VISUAL_UPGRADE` |
| Q16 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q16-solution-v2.svg` | `cf6eb9e7d3b12407c0d22ff592b01d797c74c89e` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q18-solution-v2.svg` | `ec71bd04100b1a9d21f9c8375a8dd84fecb3b102` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q19-solution-v2.svg` | `4aec587c2cdaedd0a0652ea2d88fae4768fcfff6` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q20-solution.svg` | `7efbab5c5491b1c11d322e5b526b083268d06efc` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-v2.svg` | `aa78d6473fccffc841e83001b27558ccf8ed8c8a` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q22-solution.svg` | `a4a8103735f2a72211d6a5763a7abab7f897f5d8` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q24-solution-v2.svg` | `87477a9a873a960d0b65ed177a929f5aed3a7e78` | `OBSERVED_NO_FLAG` |

### 24_순천고_1학기_중간_고2_수학I — 9개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q11 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q11-solution-v2.svg` | `586bb42754fb575a8fb31ba8e569cb36c1a23618` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q13.png` | `0cc698eff32a9a2551d499689964cb78caa93e78` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q13-solution.svg` | `eaf4bbdf127ed40e868b9673200e31246cbdbea0` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q17.png` | `5431fd0009910033b5729f5df2debfbacc552478` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q17-solution.svg` | `b0dbb1ecd1d4bc824013c11ed167ca82dae85c10` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q18-solution-v2.svg` | `6bc416af18ccd4cb5377e506dd30611ba41e4ebc` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q19.png` | `c356aaba1246dc4316ebb8ce9d0c03d1ff29b6bb` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `61273a4793c080547dc0729bee0acc73edee0962` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q24-solution-v2.svg` | `6c143ca3ef152ba30e48f7440218ccc76eac3a16` | `OBSERVED_NO_FLAG` |

### 24_순천여고_1학기_중간_고2_수학I — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q07.png` | `740d254c6fdc6a1ac28203548769f20fecef957f` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q18-solution-v2.svg` | `21743338b8ce04a6c48c3d9cce2ee0c339be6b91` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q19-solution.svg` | `f7655dbc8b348d936f1a13a0b35881f3ac4c4d90` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q20-solution-v2.svg` | `cb12447ec2880747bd98fd02618fe6f27a378c3b` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q22-solution-v2.svg` | `1878cbb0d7549dbc9d7e6c5c33e901d1261017b9` | `OBSERVED_NO_FLAG` |

### 24_팔마고_1학기_중간_고2_수학I — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q11 | `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q11-solution-v2.svg` | `211238f140c62f0dbddc89a157ea214c5468bc9d` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q13.png` | `9c1f90c0f81f3c5a8ebef6281f4af04226b954de` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q13-solution-v2.svg` | `3fad4d66d89e6d902bc2de2e22799275948cae32` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q16-solution-v2.svg` | `43c48b30285ab12ed5e973f891579676c439bb1b` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q18.png` | `c4b0871ec652dce27a64807a7140ef18998133e6` | `OBSERVED_NO_FLAG` |

### 25_금당고_1학기_중간_고2_수학I — 10개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q07.png` | `2837f0ea9a7ed58af2114417b3cb390c5704e75a` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10.png` | `3191b4ffe0ad749e05cad1aa6646e3f0b5f2c232` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10-solution-v2.svg` | `f308a3d697a975f77d810182f8d06afd8f7f65d6` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q15.png` | `f950950f3f15e6f2527e5bcdebd7efdd3d435c63` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16.png` | `ff2c697958683a67481fdb42ce9a5ba89dd25ee4` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16-solution-v2.svg` | `1e92830b9d402a2ed1322f7d8d1028eb17d9d8b5` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-engine-v3.svg` | `8f844c61ee65b48902aae913f0452dbe5e7fe5e5` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-replacement.svg` | `735a147273ea3aed19cf4eb6dab686504bcd86bf` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20.png` | `0bd5e242f050a7b515c306c755922ea857f8aa31` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20-solution-v3.svg` | `964ca3c7e1a7e62a4091484eb0424c1cc8a42ca5` | `OBSERVED_NO_FLAG` |

### 25_매산고_1학기_중간_고2_대수 — 6개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q07 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q7-solution.svg` | `f194e73f143b096a386d66790c5276c7c74b56f3` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-problem-v2.svg` | `15bee6fa7346a23eff12938b7429118db98b2b38` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-solution.svg` | `81da8cf1f542591b7ee74201bbbed7c4d20d5e17` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q13-solution.svg` | `046c94bad25328ab252c4236f5e6c0a644834818` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-problem-readable-v2.svg` | `9608b0b65d7c5f85a03a88c040266331ba6343ff` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-solution.svg` | `bba674758ad8b83b17402740f64afeab602ad0b5` | `OBSERVED_NO_FLAG` |

### 25_순천고_1학기_중간_고2_대수 — 7개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q05 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q5-solution.svg` | `4226accf2f90d7324921073a7875da251de1ac88` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q9-solution.svg` | `a26fdbed54ca9ae16ef4529ab1fe0b0220ca986c` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-problem-v2.svg` | `0c986d83f3e8740cfc3e57090063e7808a68d487` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-solution.svg` | `693120526563f1edda494cc010052e614f024c4f` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q14-solution.svg` | `c3eb5b91f2c782b2879ce2b8b7ff7563203a8c2b` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q15-solution.svg` | `69d34344b29c227294d1d46ab83a8eb6f22b3804` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/25_순천고_1학기_중간_고2_대수/q24-solution-v2.svg` | `380721ccc4ef16316e862d6b1d59e0e830cac6bd` | `OBSERVED_NO_FLAG` |

### 25_순천여고_1학기_중간_고2_대수 — 10개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q03 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q3-solution-v2.svg` | `5196368c912b7246c6fc9e0a077aea13cf897bd1` | `OBSERVED_NO_FLAG` |
| Q08 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q8-solution-v2.svg` | `e7ba7a310b5b8607aafd7091c8b82a4da8484bff` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q10-solution.svg` | `25c72875a570ba4cb3f4305229e4d3cf4715c1d8` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q13-solution.svg` | `c7fcaf635013e6d405d4112b67ab090ea507182e` | `OBSERVED_NO_FLAG` |
| Q14 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q14-solution.svg` | `d297ba19cb81976ed56acb3f8a13694cfc1f9021` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q15-solution.svg` | `457f1eac859a1cf654eb87c7d5c3da297438ec5d` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q18-solution.svg` | `c9a0d86072ad33a88d9784782b5d8b0e3b675b16` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q19-solution.svg` | `6fd468436742a7c96b3927a010e51fc74d78bcaf` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20.png` | `5fd3eb0535809217de24aaac4a1231966a5255f6` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20-solution.svg` | `b977135a958bb39401e5081e2e54bc47b8b18110` | `OBSERVED_NO_FLAG` |

### 25_제일고_1학기_중간_고2_대수 — 15개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q01 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q1-solution.svg` | `6f0646915ce9fd5b53f6e5be1a320c913e15fb25` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q7-solution.svg` | `462e4dd71b9f94f9d35d615989a38538aa684b3d` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q9-solution.svg` | `597c4b38c5d6e10cefd0e86df1b625af919350de` | `OBSERVED_NO_FLAG` |
| Q12 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q12-solution.svg` | `c9fe3c3e551770180aa1f096ab2805e5fa490d40` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4.svg` | `f607c3d91b685db95ad869a350d16295f221f98d` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-1.svg` | `81d91020ce03eae7c87939820af852e525402137` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-2.svg` | `193a3f7a2abb66801ae156c2280c4b45b8df8e3b` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-3.svg` | `9c176a9377b61b95ae6f652fcfd2c07a3ada8971` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-4.svg` | `159b5b98fa79aadfc738459637b76da91827f791` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-5.svg` | `162e0b75a87ffdf9962ff4662578c095cdc98636` | `OBSERVED_NO_FLAG` |
| Q13 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-restored-solution.svg` | `66a080bd9b74cbefc698965f9ba1005ddd9b3966` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-problem-engine-v3.svg` | `5bf02451dcea3af0012042bad5126d4ff46f0f2c` | `OBSERVED_NO_FLAG` |
| Q18 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-solution.svg` | `820689163fcff1054a7ad7c53ca279f78f604580` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q19-solution-v2.svg` | `3f294fb18f2384c143973c9bc5b9677dd85cd576` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_제일고_1학기_중간_고2_대수/q20-solution-v2.svg` | `fadf4a96cbf9d0df9c12dd74f1a6063f0862455c` | `OBSERVED_NO_FLAG` |

### 25_효천고_1학기_중간_고2_대수 — 14개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q05 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q05-problem-readable-v2.svg` | `3045108c51407357228e09daae58302047699287` | `OBSERVED_NO_FLAG` |
| Q05 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q5-solution.svg` | `dfec3bfa4d6fc69a6387fb2ef38272e5c68a73af` | `OBSERVED_NO_FLAG` |
| Q07 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q7-solution-v2.svg` | `e4ff869e805db55fcdb97329ae68e02fd8b04818` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q09-audit-rework.svg` | `d8fa5fa4ad2ebfe5884ec4306a375ba3035af1fe` | `OBSERVED_NO_FLAG` |
| Q09 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q9-solution.svg` | `f5a6b4cddea0ca7c3b6fe3a714269a8970f5120a` | `OBSERVED_NO_FLAG` |
| Q10 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q10-solution.svg` | `a8d670f654e9670aa780fb5e0fb4fb3d37c11f80` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q11-solution.svg` | `b429b16d04084cac02f2c516a2143d4ea69b8e89` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q16-problem-v2.svg` | `d92fa5989cfad40bdbaca2f2ebb81c7dcdf5f3d5` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q16-solution-v2.svg` | `c74ba9d9e6228cb2363d3ab866c869c31bec0611` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q19-audit-rework.svg` | `b731caeec811e55005b5d2323f8c26cdff6a50c4` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q19-solution.svg` | `88e98023047963bd15e8d2778a0a4de83efbb259` | `OBSERVED_NO_FLAG` |
| Q20 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q20-solution.svg` | `0747ad6a30b459990c40963b429d7816d55158f4` | `OBSERVED_NO_FLAG` |
| Q21 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q21-solution.svg` | `47a224807b21a5595b32c6d89679b2150fd6aef5` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/25_효천고_1학기_중간_고2_대수/q23-problem-v2.svg` | `61049cee0aa98bb030151415144795a8dd8e2a40` | `OBSERVED_NO_FLAG` |

### 26_강남여고_1학기_중간_고2_대수 — 4개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q05 | `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q5-solution.svg` | `0808a0874ff8a90104c1167203a6f20e03ac6195` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q17-solution.svg` | `283d35d7cb741d7191feeef11fe629e2866884e3` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q19.png` | `1cb3191f1b115806229f2b4d8384b7a671610bee` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q19-solution.svg` | `081456d95b774629639598403ac4362e35ac8df0` | `OBSERVED_NO_FLAG` |

### 26_금당고_1학기_중간_고2_대수 — 3개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q08 | `archive/assets/images/26_금당고_1학기_중간_고2_대수/q08.png` | `6143c401c2ac7b4258e435472119ea168002eb8e` | `OBSERVED_NO_FLAG` |
| Q11 | `archive/assets/images/26_금당고_1학기_중간_고2_대수/q11-solution.svg` | `f177486a32d7ab3ba95b516ce21bfb190b02dc52` | `OBSERVED_NO_FLAG` |
| Q19 | `archive/assets/images/26_금당고_1학기_중간_고2_대수/q19-solution.svg` | `b4fc0eeb56722a53da9f7aa992c328ffd7a185f4` | `OBSERVED_NO_FLAG` |

### 26_순천고_1학기_중간_고2_대수 — 3개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q05 | `archive/assets/images/26_순천고_1학기_중간_고2_대수/q05.png` | `75bf1a427300bb382c8d2bcdf939ffb9d04a8024` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/26_순천고_1학기_중간_고2_대수/q15.png` | `742983456f1773408bfeb5b0e5f30c94cb486ff0` | `OBSERVED_NO_FLAG` |
| Q24 | `archive/assets/images/26_순천고_1학기_중간_고2_대수/q24-solution.svg` | `e46ce9ddadec7164c7b0247a9efeaa029b135a45` | `OBSERVED_NO_FLAG` |

### 26_제일고_1학기_중간_고2_대수 — 5개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q14 | `archive/assets/images/26_제일고_1학기_중간_고2_대수/q14-solution.svg` | `3661fd5daa2ab3f34fb8bfdd9d14b555cb72e951` | `OBSERVED_NO_FLAG` |
| Q15 | `archive/assets/images/26_제일고_1학기_중간_고2_대수/q15-solution.svg` | `d168ae3fbf0bdbe82f911afc79b3934fe87c84ba` | `OBSERVED_NO_FLAG` |
| Q17 | `archive/assets/images/26_제일고_1학기_중간_고2_대수/q17.png` | `4df5fa1deccbce2e975174ded19123ecf4e175d5` | `OBSERVED_NO_FLAG` |
| Q22 | `archive/assets/images/26_제일고_1학기_중간_고2_대수/q22-solution.svg` | `6fd387943551057bbd107f07248e8722ec7a2ae8` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/26_제일고_1학기_중간_고2_대수/q23-solution.svg` | `fe325a835ec79450836b98f6bd43020c04a881fd` | `OBSERVED_NO_FLAG` |

### 26_효천고_1학기_중간_고2_대수 — 3개

| Q | 자산 경로 | Git blob SHA | 시각 판정 |
|---|---|---|---|
| Q12 | `archive/assets/images/26_효천고_1학기_중간_고2_대수/q12-solution.svg` | `24af73a50d5e700a41c4733f9d5e6f8208c16e7e` | `OBSERVED_NO_FLAG` |
| Q16 | `archive/assets/images/26_효천고_1학기_중간_고2_대수/q16-solution.svg` | `76847d6d488f482fc750d01132f5a848edae7744` | `OBSERVED_NO_FLAG` |
| Q23 | `archive/assets/images/26_효천고_1학기_중간_고2_대수/q23.png` | `8837e92f8b452d72666242c9e2ca11ea22c890fe` | `SOURCE_LINK_HOLD` |

## 이력 및 수정 경계

- 2026-11-22: 남아 있던 2021–2026 직접 참조 이미지 302개의 취득·렌더·실물 시각 판독 완료, 기존 2019–2020 68개와 병합하여 370개 증거 대장 작성.
- 새로 발견한 2023 한영고 Q13, 2024 매산여고 Q15의 세부 근거는 각 개별 `*_DEEP_AUDIT.md` 부록에도 동기화. 이전 수학 감사 판정과 원본 소스는 변경하지 않음.
- 남은 이미지 육안 검수 미처리: **0개**. 남은 이미지 수정/원문 정합 이슈: **7개**(기존 5 + 신규 2). 운영 QA 및 원본 교정 승인: **미실시**.
