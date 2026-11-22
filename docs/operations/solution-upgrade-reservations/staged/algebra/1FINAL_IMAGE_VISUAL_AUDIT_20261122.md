# lane30 고2 대수/구 수학Ⅰ 1학기 기말 이미지 전수 검수 — 누적 대장 (2026-11-22)

- branch: `work/solution-upgrade-lane-30-20261121`
- source: `archive/exams/original/high/h2/1final/*.js`; 직접 참조 `archive/assets/images/**` PNG/SVG
- 대상: 일반 대수/수학Ⅰ 32개 원본 JS, **723문항·고유 이미지 328개(PNG 128/SVG 200)**. `25_제일고_..._대수c.js` 및 `25_효천고_..._대수c.js` **2개·46문항·25이미지**는 일반 32개와 구별하여 **별도 보충 묶음으로 실물 검수 완료**, 대상 누락 방지.
- **현재 상태: 5차까지 일반 기말 32/32개 시험지·723/723문항, 이미지 328/328개(PNG 128/SVG 200) 실물 시각 검수 완료(100%)**. 일반 기말 미검수 **0개 시험지·0개 이미지**. 보충 `대수c` 2개·25/25이미지 별도 실물 검수 완료.
- 1차 실물 증거: 원본 GitHub blob 85개 각각 SHA 확보. PNG 30개 중 29개 파일 원본 디코딩·표시, **1개(2026 순천고 Q18, 1.01MB)**는 GitHub 파일 Contents 응답 본문이 비어 별도 GitHub 웹 페이지의 실물 이미지를 직접 화면 확인(도형·점·수선·60도·길이 5/8 판독). SVG 55개 모두 XML 원본 수신→Inkscape PNG 렌더 성공→7매 연락시트 및 의심 원본 개별 확인. **실물 미확인 0/85, SVG 렌더 실패 0/55**.
- 1차 판정: `OBSERVED_NO_FLAG` **83**, `VISUAL_UPGRADE` **1**, `VISUAL_HOLD_READABILITY` **1**.
- **2차 실물 증거: 신규 원본 GitHub blob 87개(각 SHA) 수신, PNG 34개 디코딩·확대 관찰, SVG 53개 XML 수신·렌더·시각 확인. 8매 연락시트와 의심 원본 단독 확대 확인. 미확인 0/87, SVG 렌더 실패 0/53.**
- **2차 판정: `OBSERVED_NO_FLAG` 82, `VISUAL_UPGRADE` 2, `VISUAL_HOLD_READABILITY` 3.**
- **3차 실물 증거: 2022년 팔마고·제일고·순천고·매산고·금당고 5개 JS에서 추출한 고유 참조 44개(PNG 17/SVG 27) 모두 원본 Git blob SHA 확인. PNG 원본과 Inkscape로 래스터화한 SVG를 5개 연락시트에서 직접 관찰하고, 의심 자산은 원본 크기로 확대해 JS 발문·해설과 대조. 미확인 0/44, SVG 렌더 실패 0/27.**
- **3차 판정: `OBSERVED_NO_FLAG` 42, `VISUAL_UPGRADE` 2, `VISUAL_HOLD_READABILITY` 0. 누적 일반 기말: `OBSERVED_NO_FLAG` **207**, `VISUAL_UPGRADE` **5**, `VISUAL_HOLD_READABILITY` **4** (총 216).** `OBSERVED_NO_FLAG`는 관찰 범위에서 주요 이상을 발견하지 못했다는 뜻이지 학생 UI/운영 출고 PASS가 아니다.
- **4차 실물 증거: 2021년 강남여고·금당고·매산고·매산여고·순천여고·제일고 6개 JS의 신규 64개 참조(PNG 23/SVG 41) 모두 원본 Git blob SHA 확보·실물 시각 검수. PNG 원본 디코드 및 SVG Inkscape 렌더 성공, 6매 연락시트·개별 확대 확인; 실물 미확인 0/64, SVG 렌더 실패 0/41.**
- **4차 판정: `OBSERVED_NO_FLAG` 57, `VISUAL_UPGRADE` 5, `VISUAL_HOLD_READABILITY` 2. 기말 일반 누적 `OBSERVED_NO_FLAG` 264, `VISUAL_UPGRADE` 10, `VISUAL_HOLD_READABILITY` 6 (280개).**
- **5차 실물 증거: 2020~2019년 5개 JS 117문항의 직접 참조 이미지 48개(PNG 24/SVG 24) 모두 원본 blob SHA 확보·디코딩/렌더 후 5매 연락시트와 의심 원본 개별 확대 확인. 미확인 0/48, SVG 렌더 실패 0/24.**
- **5차 판정: `OBSERVED_NO_FLAG` 37, `VISUAL_UPGRADE` 9, `VISUAL_HOLD_READABILITY` 2. 일반 기말 전수 누적 `OBSERVED_NO_FLAG` 301, `VISUAL_UPGRADE` 19, `VISUAL_HOLD_READABILITY` 8 (328개).**
- **보충 `대수c` 2개 시험지·46문항·25이미지(PNG 11/SVG 14) 실물 검수 완료. 판정: `OBSERVED_NO_FLAG` 23, `VISUAL_UPGRADE` 2, 가독성 HOLD 0.** 일반 기말 32개·328이미지와 별도 관리하며 통합 시 중복 합산하지 않음.
- **원본 JS·PNG·SVG·정답·`main` 변경 없음**. 이미지 결함은 문서로 예약하고 원본 교체는 엔진에 인계. 학생 실제 UI 렌더, 전체 preflight, Golden/Negative, 배포/출고 QA는 `NOT_RUN`.

## 1차 시험지별 실물 검수 결과

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `26_효천고_1학기_기말_고2_대수` | 23 | 13 | 4 | 9 | 새 문제 미발견 |
| `26_팔마고_1학기_기말_고2_대수` | 21 | 11 | 3 | 8 | 새 문제 미발견 |
| `26_제일고_1학기_기말_고2_대수` | 21 | 7 | 3 | 4 | 새 문제 미발견 |
| `26_순천고_1학기_기말_고2_대수` | 24 | 8 | 2 | 6 | 새 문제 미발견 |
| `26_금당고_1학기_기말_고2_대수` | 21 | 9 | 3 | 6 | 새 문제 미발견 |
| `26_강남여고_1학기_2차_고2_대수` | 25 | 10 | 3 | 7 | Q20 VISUAL_UPGRADE |
| `25_금당고_1학기_기말_고2_수학I` | 21 | 11 | 8 | 3 | 새 문제 미발견 |
| `24_팔마고_1학기_기말_고2_수학I` | 22 | 16 | 4 | 12 | Q09 VISUAL_HOLD_READABILITY |
| **합계** | **178** | **85** | **30** | **55** | **수정 1 · 가독성 HOLD 1** |

## 엔진 인계 필요 2건

### 2026 강남여고 1학기 2차 대수 Q20 — `VISUAL_UPGRADE`

- 원본: `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20.png`
- blob: `9373db4a1fdb318808be64e6ec6339039bed7f45`
- 관찰: 원본 이미지 위쪽에는 다른 수식·문장 끝부분이 이미지 경계에서 잘려 남아 있고, 아래쪽에는 ①~⑤ 선지 숫자들이 포함되어 있다. JS `content`는 `y=sin(πx)`, `y=1/2` 교점의 가중합 문제를 이미 서술하고 `choices`도 별도로 가진다. 학생 화면에 그림을 그대로 연결하면 그래프 주변 잘린 문자와 선지가 중복 노출된다.
- 수학적 교점 자체는 그림에서 읽히며 정답 수정 제안은 없음. 엔진은 **원본 페이지 근거로 그래프만 깔끔하게 재크롭**하고, 곡선·기준선·x축·교점 순서가 보존되었는지 서비스 렌더로 재확인해야 한다. 임의로 그래프를 새로 그려 수학 좌표를 바꾸지 않음.

### 2024 팔마고 1학기 기말 구 수학Ⅰ Q09 — `VISUAL_HOLD_READABILITY`

- 원본: `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9.png`
- blob: `14fbd419b85ace1cb4308068aa6a0091e496d1bb`
- 관찰: 가로 **417px × 세로 264px** PNG의 사인 그래프는 곡선 윤곽만 보이고 함수 라벨, x축 핵심 눈금, 최대·최소값 숫자가 매우 흐리다. 해당 Q09은 `a>0,b>0,0<c<π`인 `y=a sin(bx-c)`의 **그림만으로** `abc`를 정하도록 되어 있어 이미지 숫자를 읽을 수 있어야 한다.
- 기존 해설의 `a=3,b=2,c=π/3`, 답 `2π`는 별도로 존재하나, 이것으로 손상된 출제 그래프의 수치를 거꾸로 확정하지 않는다. 엔진 단계에서 고해상도 출제 원본을 확보·대조하고, 문제 PNG를 **수치가 명료한 원본 기반** 자산으로 복구 후 정답/해설 정합 재검증. 별도 `q9-solution-v2.svg`는 `u,v` 좌표의 기본 사인 예시이므로 **원본 문제 수치를 증명하는 자료로 대체 불가**.

## 이미지 원본 실물 증거 대장 (1차 85/85)

| # | 원본 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| 1 | `26_효천고_1학기_기말_고2_대수` | 03 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q3-solution.svg` | `1a137be794094ce2dd2e08ad00c4dcc8c450ba8b` | `OBSERVED_NO_FLAG` |
| 2 | `26_효천고_1학기_기말_고2_대수` | 06 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q6-solution.svg` | `c5e8605640a5a08533a51f68319e831e9484eae7` | `OBSERVED_NO_FLAG` |
| 3 | `26_효천고_1학기_기말_고2_대수` | 09 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q9-solution.svg` | `7b19a4df48033146fb8fbde8a221364686e8c332` | `OBSERVED_NO_FLAG` |
| 4 | `26_효천고_1학기_기말_고2_대수` | 10 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q10.png` | `7a94f596fb2b1a8a21ebbbfec3197ffd21f8eca0` | `OBSERVED_NO_FLAG` |
| 5 | `26_효천고_1학기_기말_고2_대수` | 11 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q11-solution.svg` | `1a73bb735c18457c561a92ff19b7b1c2933d148e` | `OBSERVED_NO_FLAG` |
| 6 | `26_효천고_1학기_기말_고2_대수` | 12 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q12-solution.svg` | `f4f1266232cfc5c7705ee1c25a24607b3c6e88f2` | `OBSERVED_NO_FLAG` |
| 7 | `26_효천고_1학기_기말_고2_대수` | 14 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q14.png` | `94344cb42a6a1d7a99dae513605fa436101102b4` | `OBSERVED_NO_FLAG` |
| 8 | `26_효천고_1학기_기말_고2_대수` | 14 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q14-solution.svg` | `ab3afbb3566d69d32bd2a3b112f6e214eb5565da` | `OBSERVED_NO_FLAG` |
| 9 | `26_효천고_1학기_기말_고2_대수` | 15 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q15-solution.svg` | `02b588cee04bdd8e1bad75c9195fa906ab97de08` | `OBSERVED_NO_FLAG` |
| 10 | `26_효천고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q17.png` | `c2286434feeff72ffe7aa090f0000cff8a737f97` | `OBSERVED_NO_FLAG` |
| 11 | `26_효천고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q17-solution.svg` | `71a7a40a080974e3f370c7c40a01f7e9f0d6e36d` | `OBSERVED_NO_FLAG` |
| 12 | `26_효천고_1학기_기말_고2_대수` | 22 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q22.png` | `4a80fd2f15d4e516f5c89a5fe1b09a9e65118aa4` | `OBSERVED_NO_FLAG` |
| 13 | `26_효천고_1학기_기말_고2_대수` | 22 | `archive/assets/images/26_효천고_1학기_기말_고2_대수/q22-solution.svg` | `5ec8c4b15b17b04504f108fe3f3121d742abee3a` | `OBSERVED_NO_FLAG` |
| 14 | `26_팔마고_1학기_기말_고2_대수` | 02 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q02.png` | `790bdbcc32480ad69a78200fadd509e321ab9511` | `OBSERVED_NO_FLAG` |
| 15 | `26_팔마고_1학기_기말_고2_대수` | 02 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q2-solution.svg` | `c3a2129ca31a5aec73ab87f9a3f5dfedb119d675` | `OBSERVED_NO_FLAG` |
| 16 | `26_팔마고_1학기_기말_고2_대수` | 05 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q05.png` | `985f994a4a0294db506f8368dbdbd66e952ee88a` | `OBSERVED_NO_FLAG` |
| 17 | `26_팔마고_1학기_기말_고2_대수` | 10 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q10-solution.svg` | `0b279365bdc75fb0bf9bab9dd269b2e098ea0890` | `OBSERVED_NO_FLAG` |
| 18 | `26_팔마고_1학기_기말_고2_대수` | 13 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q13.png` | `494ffd95da09cf301402624fe8de90af8438e24b` | `OBSERVED_NO_FLAG` |
| 19 | `26_팔마고_1학기_기말_고2_대수` | 13 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q13-solution.svg` | `fd650b3d87dd8e2533397f1d7b395e229fa2f860` | `OBSERVED_NO_FLAG` |
| 20 | `26_팔마고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q17-problem-v2.svg` | `fafb308a9e228159ce80a8ab852169a384ee34e4` | `OBSERVED_NO_FLAG` |
| 21 | `26_팔마고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q17-solution.svg` | `ecc09ee60a3a200fcb37d2f33e95c2a0c72d81d9` | `OBSERVED_NO_FLAG` |
| 22 | `26_팔마고_1학기_기말_고2_대수` | 20 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q20.svg` | `85ab00b0f190223024ec391a7d24285512ca0d9b` | `OBSERVED_NO_FLAG` |
| 23 | `26_팔마고_1학기_기말_고2_대수` | 20 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q20-solution.svg` | `de46852ab1feb5e834b88ac25b93e761943fd0fd` | `OBSERVED_NO_FLAG` |
| 24 | `26_팔마고_1학기_기말_고2_대수` | 21 | `archive/assets/images/26_팔마고_1학기_기말_고2_대수/q21-problem-readable-v2.svg` | `2002bc1c00960eab978b8efa7af8afdcdd3ced13` | `OBSERVED_NO_FLAG` |
| 25 | `26_제일고_1학기_기말_고2_대수` | 14 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q14-solution.svg` | `1f012b3b3749fd637f1c744870d3e2c58a7c8b39` | `OBSERVED_NO_FLAG` |
| 26 | `26_제일고_1학기_기말_고2_대수` | 16 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q16.png` | `0bca29509e5213009276a54c8966aaaebae3f3dc` | `OBSERVED_NO_FLAG` |
| 27 | `26_제일고_1학기_기말_고2_대수` | 16 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q16-solution.svg` | `4accd5633a78b77634bae85c0881b366756cca19` | `OBSERVED_NO_FLAG` |
| 28 | `26_제일고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q17.png` | `dd38754cff6ca9994f1a1b984c80447fda65dd31` | `OBSERVED_NO_FLAG` |
| 29 | `26_제일고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q17-solution.svg` | `89651633987c7510eda1b80b5ab4a2ea564f4433` | `OBSERVED_NO_FLAG` |
| 30 | `26_제일고_1학기_기말_고2_대수` | 19 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q19.png` | `60db94b25281580c0e60c842472952c55b3a683a` | `OBSERVED_NO_FLAG` |
| 31 | `26_제일고_1학기_기말_고2_대수` | 19 | `archive/assets/images/26_제일고_1학기_기말_고2_대수/q19-solution-v2.svg` | `0202b2fbf302d3558e02039deed56935c289a5c6` | `OBSERVED_NO_FLAG` |
| 32 | `26_순천고_1학기_기말_고2_대수` | 04 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q4-solution.svg` | `b44079bb269c4edccf946e005669a9fdd2a14b39` | `OBSERVED_NO_FLAG` |
| 33 | `26_순천고_1학기_기말_고2_대수` | 06 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q6-solution.svg` | `e31115f1d12e13213374094ba6bee952c187e222` | `OBSERVED_NO_FLAG` |
| 34 | `26_순천고_1학기_기말_고2_대수` | 11 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q11-solution.svg` | `9a40867038079da9edc4270f30c0fc1962824935` | `OBSERVED_NO_FLAG` |
| 35 | `26_순천고_1학기_기말_고2_대수` | 15 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q15.png` | `507674d4e038cc5f4b82e23edf93adc82ead8375` | `OBSERVED_NO_FLAG` |
| 36 | `26_순천고_1학기_기말_고2_대수` | 15 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q15-solution.svg` | `f8ace80aca2331cecaaad7127efcbbccf026d24c` | `OBSERVED_NO_FLAG` |
| 37 | `26_순천고_1학기_기말_고2_대수` | 17 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q17-solution.svg` | `0281ad398f9dabdc9e18a3b0e4a74a13a27899aa` | `OBSERVED_NO_FLAG` |
| 38 | `26_순천고_1학기_기말_고2_대수` | 18 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q18.png` | `81eaeef2e526ca48b2f2f32df5c88086291b3c47` | `OBSERVED_NO_FLAG` · GitHub 웹 실물 |
| 39 | `26_순천고_1학기_기말_고2_대수` | 18 | `archive/assets/images/26_순천고_1학기_기말_고2_대수/q18-solution.svg` | `d4b4035fe5ce686a5afa81f811519d3a09bb342f` | `OBSERVED_NO_FLAG` |
| 40 | `26_금당고_1학기_기말_고2_대수` | 04 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q04.png` | `60def01a7770b33be28778f64e7d0af07f16d4d2` | `OBSERVED_NO_FLAG` |
| 41 | `26_금당고_1학기_기말_고2_대수` | 04 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q4-solution.svg` | `55ffc8feced429bd864528868cd6643f2498573c` | `OBSERVED_NO_FLAG` |
| 42 | `26_금당고_1학기_기말_고2_대수` | 05 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q5-solution.svg` | `466d1b90e2858d9187ad65fd9d22023e9058197b` | `OBSERVED_NO_FLAG` |
| 43 | `26_금당고_1학기_기말_고2_대수` | 09 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q9-solution.svg` | `ba483a38402cf2148d934d05ad00527c02ee7847` | `OBSERVED_NO_FLAG` |
| 44 | `26_금당고_1학기_기말_고2_대수` | 13 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q13-solution.svg` | `9dc84d8388901b1a8454272a8b3a062bcb183a78` | `OBSERVED_NO_FLAG` |
| 45 | `26_금당고_1학기_기말_고2_대수` | 15 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q15.png` | `1cb22921ecc10973021ce321d408efaa720cd7fc` | `OBSERVED_NO_FLAG` |
| 46 | `26_금당고_1학기_기말_고2_대수` | 15 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q15-solution.svg` | `4fbea018403178dc34d022bb8b99b472f88fe82c` | `OBSERVED_NO_FLAG` |
| 47 | `26_금당고_1학기_기말_고2_대수` | 19 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q19.png` | `b64523d691cee4425d8bd1ac5ed5ce067b045941` | `OBSERVED_NO_FLAG` |
| 48 | `26_금당고_1학기_기말_고2_대수` | 20 | `archive/assets/images/26_금당고_1학기_기말_고2_대수/q20-solution.svg` | `ec4f4130d9dd26f7bd58f52fcde7c8118b7c0fae` | `OBSERVED_NO_FLAG` |
| 49 | `26_강남여고_1학기_2차_고2_대수` | 01 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q1-solution.svg` | `b035eb06df3278814427cb9406002207bfacc21c` | `OBSERVED_NO_FLAG` |
| 50 | `26_강남여고_1학기_2차_고2_대수` | 02 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q2-solution.svg` | `906335f5d1dc889f363dc7f2e4a7160a25ff8f51` | `OBSERVED_NO_FLAG` |
| 51 | `26_강남여고_1학기_2차_고2_대수` | 03 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q03.png` | `cfe7783465e41470d63a4b4da98d2760f950c5ef` | `OBSERVED_NO_FLAG` |
| 52 | `26_강남여고_1학기_2차_고2_대수` | 03 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q3-solution.svg` | `c3c2ea4ded4a820edc6e263cc83008afcf9fa113` | `OBSERVED_NO_FLAG` |
| 53 | `26_강남여고_1학기_2차_고2_대수` | 10 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q10-solution.svg` | `13453e330af107cea697c316c602c27178a5c603` | `OBSERVED_NO_FLAG` |
| 54 | `26_강남여고_1학기_2차_고2_대수` | 11 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q11-solution.svg` | `0e314e653515df8d45608748ca4a423803851bd9` | `OBSERVED_NO_FLAG` |
| 55 | `26_강남여고_1학기_2차_고2_대수` | 12 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q12.png` | `b737a21f62a43125b6a86fb6ad63d56429f0155c` | `OBSERVED_NO_FLAG` |
| 56 | `26_강남여고_1학기_2차_고2_대수` | 12 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q12-solution-v2.svg` | `87d8bd83c420359daca2874667c2513080c688f6` | `OBSERVED_NO_FLAG` |
| 57 | `26_강남여고_1학기_2차_고2_대수` | 20 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20.png` | `9373db4a1fdb318808be64e6ec6339039bed7f45` | `VISUAL_UPGRADE` |
| 58 | `26_강남여고_1학기_2차_고2_대수` | 20 | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20-solution-v2.svg` | `00a34bebd78d691c21d5430c6a2d5183cda56611` | `OBSERVED_NO_FLAG` |
| 59 | `25_금당고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q6.png` | `0c9da1077dd91931ffe42d0d0456620c43918467` | `OBSERVED_NO_FLAG` |
| 60 | `25_금당고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q8.png` | `544b6e3f392f03c57e269088489c966e4d97ea8d` | `OBSERVED_NO_FLAG` |
| 61 | `25_금당고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q10.png` | `51172f10136d3277a090ae840b9348d22793e04e` | `OBSERVED_NO_FLAG` |
| 62 | `25_금당고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q13.png` | `6c84a795bdc88e10d5f9111961bdd79badeb1e89` | `OBSERVED_NO_FLAG` |
| 63 | `25_금당고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q14.png` | `a12f78b9efbf8bbe542db6802a9b11016d5c619c` | `OBSERVED_NO_FLAG` |
| 64 | `25_금당고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q16.png` | `2d00be54ee4ef85e6b7e562e4895453b2873697f` | `OBSERVED_NO_FLAG` |
| 65 | `25_금당고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q16-solution.svg` | `bc20b013c37c1187f167a72760e7a72477850b9e` | `OBSERVED_NO_FLAG` |
| 66 | `25_금당고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q17-solution-v2.svg` | `771cb0cc6541b7c073cfdb18981b861dae5c8c24` | `OBSERVED_NO_FLAG` |
| 67 | `25_금당고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q18.png` | `6ade4868d6c9db280296a44dd6e20f14cf48e1a2` | `OBSERVED_NO_FLAG` |
| 68 | `25_금당고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q18-solution.svg` | `5a977205120a90ad04d16c043911ef8bfde5c3c1` | `OBSERVED_NO_FLAG` |
| 69 | `25_금당고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q21.png` | `8ad36203cb0cfa747611e3b66685f50256c04c54` | `OBSERVED_NO_FLAG` |
| 70 | `24_팔마고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q2-solution.svg` | `35c61984ecbadb79c4e1675d42f788ba84e817f5` | `OBSERVED_NO_FLAG` |
| 71 | `24_팔마고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q7-solution.svg` | `3099a7fd1ad58684510363a3a259fb6f866cbeb5` | `OBSERVED_NO_FLAG` |
| 72 | `24_팔마고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9.png` | `14fbd419b85ace1cb4308068aa6a0091e496d1bb` | `VISUAL_HOLD_READABILITY` |
| 73 | `24_팔마고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9-solution-v2.svg` | `0f526f20b2ed157077da57c76c316ea4124d57b9` | `OBSERVED_NO_FLAG` |
| 74 | `24_팔마고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q11-solution.svg` | `e560865b8493573635815d2239d020ef84be5dec` | `OBSERVED_NO_FLAG` |
| 75 | `24_팔마고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q12-solution.svg` | `d20368da0a39cc33dacf41af8106159dd2d7a0b2` | `OBSERVED_NO_FLAG` |
| 76 | `24_팔마고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q14-solution.svg` | `52edcd231863c49c1683736f3aea418c7f956d9d` | `OBSERVED_NO_FLAG` |
| 77 | `24_팔마고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q15.png` | `5687559a2c91a71eef96fd2b5f8640d98ddd5c28` | `OBSERVED_NO_FLAG` |
| 78 | `24_팔마고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q15-solution.svg` | `c620c78d08f4aecb72e2274c05c4abee7a77e9f1` | `OBSERVED_NO_FLAG` |
| 79 | `24_팔마고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q16-solution.svg` | `6bd7079a8e8e3baae45cf56b1cbcc31999591c45` | `OBSERVED_NO_FLAG` |
| 80 | `24_팔마고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q17.png` | `274a4695f39eb1720641a688d3dd5ab224dfae08` | `OBSERVED_NO_FLAG` |
| 81 | `24_팔마고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q17-solution.svg` | `7038ed2f1fd0fbb8fcdd2c5aefaf394e4fd17ef1` | `OBSERVED_NO_FLAG` |
| 82 | `24_팔마고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q19.png` | `8881167d0857c5276509542c744def1063daee92` | `OBSERVED_NO_FLAG` |
| 83 | `24_팔마고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q19-solution.svg` | `837111032e9f4f511729172ef7edcf8646a0c87a` | `OBSERVED_NO_FLAG` |
| 84 | `24_팔마고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q21-solution.svg` | `7ab7da658804096f92c4a4c8762a24d3cf5f119f` | `OBSERVED_NO_FLAG` |
| 85 | `24_팔마고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q22-solution.svg` | `45520ded0ba792da3675e0c5ffd91f39b1dc5128` | `OBSERVED_NO_FLAG` |

## 2차 시험지별 실물 검수 결과 (추가 8개 · 87이미지)

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `24_강남여고_1학기_기말_고2_수학I` | 25 | 11 | 6 | 5 | Q07 VISUAL_HOLD_READABILITY; Q17 VISUAL_HOLD_READABILITY; Q19 VISUAL_UPGRADE |
| `23_팔마고_1학기_기말_고2_수학I` | 22 | 9 | 2 | 7 | 새 문제 미발견 |
| `23_제일고_1학기_기말_고2_수학I` | 23 | 10 | 4 | 6 | 새 문제 미발견 |
| `23_복성고_1학기_기말_고2_수학I` | 22 | 14 | 4 | 10 | 새 문제 미발견 |
| `23_매산고_1학기_기말_고2_수학I` | 20 | 6 | 3 | 3 | 새 문제 미발견 |
| `23_금당고_1학기_기말_고2_수학I` | 18 | 15 | 7 | 8 | Q08 VISUAL_UPGRADE |
| `23_강남여고_1학기_기말_고2_수학I` | 25 | 8 | 2 | 6 | 새 문제 미발견 |
| `22_효천고_1학기_기말_고2_수학I` | 25 | 14 | 6 | 8 | Q08 VISUAL_HOLD_READABILITY |
| **2차 합계** | **180** | **87** | **34** | **53** | **개선 2 · 가독성 HOLD 3** |
| **기말 1~2차 누적** | **358** | **172** | **64** | **108** | **개선 3 · 가독성 HOLD 4** |

### 2차 판정의 근거·범위

- 8개 원본 JS 각각의 문제 본문·해설·선지에 직접 들어간 고유 이미지 참조를 대조하고, 해당 Git blob **87개 원본**을 확보했다. PNG 34개는 디코드·시각 관찰, SVG 53개는 Inkscape로 래스터 렌더하여 전체 연락시트에서 시각 관찰했다. 흐림·크롭 의심 자산은 원본 크기로 재확대하고 JS `content`의 수치/지문과 대조했다.
- `VISUAL_HOLD_READABILITY` **3개**는 필요한 이미지 숫자가 원본 스캔에서 잘리거나 확실히 구별되지 않는 항목이다. 기존 해설 값을 원본 확인 없이 그림에 덮어쓰지 않는다. `VISUAL_UPGRADE` **2개**는 보이는 기하/수치 의미를 유지하면서 원본 재크롭·청소가 필요한 항목이다.
- **이번 87개 중 원본 미확인·파일 누락·SVG 렌더 실패는 0개**. 정답·해설 전체 의미론 재채점이나 실제 학생 브라우저 UI 검수는 이번 시각 감사 범위가 아니다.

### 2024 강남여고 Q07 — `VISUAL_HOLD_READABILITY`

- 원본: `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q7.png` (blob `78b8c21b177c045f7dc18717239492ac9828ffa8`, 313×231 px).
- 관찰: 삼각형의 왼쪽 변 `AB` 옆 숫자가 작은 세로 얼룩처럼 붕괴되어 **4인지 이미지 자체로 확정하기 어렵고**, 오른쪽 `√21`도 흐리다. 같은 JS 문제 본문은 `AB=4, BC=√21, ∠A=60°`라고 적혀 있다. **이미지 단독 판독 가독성** 문제이지 정답 오기 확정은 아니다.
- 엔진 인계: 원 출제 이미지 확보 후 숫자 획을 확인해 문제 그림을 복원. 별도 `q7-solution.svg`는 보조 비교 가능하나 **문제 원본의 확인을 대체하지 않음**.

### 2024 강남여고 Q17 — `VISUAL_HOLD_READABILITY`

- 원본: `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q17.png` (blob `35487b12af4254750ef7e86d416805ffc11f0055`, 450×275 px).
- 관찰: 오른쪽 빗변 `AC` 길이 표기의 획이 소실되어 4 대신 1에 가까워 보이는 등 **숫자 혼독 위험**. 문제 본문은 `AB=2, BC=3, AC=4`, `BD:DC=1:2`를 명시한다. 원본 그림만으로 손상 숫자를 독립 검증할 수 없다.
- 엔진 인계: 출제 원본과 대조하여 길이 숫자 2/3/4 및 내분 점 D를 확인하고 깨끗한 문제용 이미지를 복원. 정답을 기존 해설만 보고 수정하지 않음.

### 2024 강남여고 Q19 — `VISUAL_UPGRADE`

- 원본: `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q19.png` (blob `c58812da4b5ee52a5a7907fc76ad8e50e3996313`, 651×236 px).
- 관찰: 반복 음영 정사각형 `R₁, R₂, R₃`를 나열한 스캔에서 세 번째 `R₃` 격자 **오른쪽 끝이 이미지 경계에서 실제로 잘려**, 전체 격자 구성 비교가 불완전하다. 아래첨자 라벨도 연하다. 원본 JS는 매 회차 미색칠 정사각형을 재분할해 색칠하는 규칙을 설명한다.
- 엔진 인계: 출제 지면의 원래 `R₃` 전체를 보이도록 재크롭하거나 각 단계별 실제 칠하기 패턴을 확인한 뒤 도형 복원. 수학적 규칙·색칠 위치를 추측해 새로 만들지 않음.

### 2023 금당고 Q08 — `VISUAL_UPGRADE`

- 원본: `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q8.png` (blob `bf558b219c9fdbb85c5fcffc22e3743a49c4fbff`, 870×680 px).
- 관찰: 강 건너편 점 `P`와 일직선상 `A–B–C`가 들어간 스캔에 **상단 주변 문장 잔여 획, 굵은 수평 스캔 줄, 하단 잘린 인쇄 흔적**이 함께 남아 있다. `AB=200 m`, `BC=300 m` 및 위치 순서는 확대 시 판독 가능하다.
- 엔진 인계: 도형과 거리표시를 보존하면서 주변 페이지 잡음만 재크롭·정리하고 `P,A,B,C` 위치와 거리 단위를 재확인.

### 2022 효천고 Q08 — `VISUAL_HOLD_READABILITY`

- 원본: `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q08.png` (blob `44d71b713306421f8de89d4fede1aacabe6082a8`, 590×430 px).
- 관찰: 코사인 그래프 왼쪽 경계가 너무 타이트하여 **최댓값 y축 눈금 숫자의 왼쪽 획이 잘려 있고** 원점 표기도 일부 잘린다. 오른쪽 검은 수직 스캔 경계도 남았다. `x=π` 봉우리 위치는 식별 가능하지만 문제는 오직 그림 최댓값에서 `a+b`를 읽게 하므로 축 눈금 가독성은 필수다. 기존 해설은 봉우리 4라고 설명하나 그림 결손을 그 값만으로 보완 확정하지 않는다.
- 엔진 인계: 고해상도 원본 출제 지면을 조회해 y축 최댓값 눈금을 복구한 후 숫자·해설을 재대조. 단순 업스케일·보간으로 수치 획을 창작하지 말 것.

## 이미지 원본 실물 증거 대장 (2차 추가 87/87; 통합 #86–#172)

| # | 원본 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| 86 | `24_강남여고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q5-solution.svg` | `6fdd8d6a06bcb395fcbb8cf15e11b51b82603b2b` | `OBSERVED_NO_FLAG` |
| 87 | `24_강남여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q6.png` | `6e4643e6e48d542ed87674fb8888ce5ec39a3935` | `OBSERVED_NO_FLAG` |
| 88 | `24_강남여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q6-solution.svg` | `523152874ff991661dc09ebceea40022c09c141f` | `OBSERVED_NO_FLAG` |
| 89 | `24_강남여고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q7.png` | `78b8c21b177c045f7dc18717239492ac9828ffa8` | `VISUAL_HOLD_READABILITY` |
| 90 | `24_강남여고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q7-solution.svg` | `383994f60fa410413661192fdd0fd1fb871fc57a` | `OBSERVED_NO_FLAG` |
| 91 | `24_강남여고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q17.png` | `35487b12af4254750ef7e86d416805ffc11f0055` | `VISUAL_HOLD_READABILITY` |
| 92 | `24_강남여고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q17-solution.svg` | `d0b73bfdbcc8cf5a1154d86abe3e5c64597e8680` | `OBSERVED_NO_FLAG` |
| 93 | `24_강남여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q19.png` | `c58812da4b5ee52a5a7907fc76ad8e50e3996313` | `VISUAL_UPGRADE` |
| 94 | `24_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q21.png` | `04e732cbfac103582e0da70c20f6a2c5eb0850d6` | `OBSERVED_NO_FLAG` |
| 95 | `24_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q21-solution.svg` | `03d296f32e1dcfe656c6345e06c9521d139d42ad` | `OBSERVED_NO_FLAG` |
| 96 | `24_강남여고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/24_강남여고_1학기_기말_고2_수학I/q22.png` | `bc076f0a7bf3ea32162f517c41e76b88968f2a8b` | `OBSERVED_NO_FLAG` |
| 97 | `23_팔마고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q1-solution.svg` | `4399948e79524f13c38a62f9ea6fd110acbba9fd` | `OBSERVED_NO_FLAG` |
| 98 | `23_팔마고_1학기_기말_고2_수학I` | 04 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q4-solution.svg` | `f0887d206e1067ecb9937f8550d42d6bc82f077f` | `OBSERVED_NO_FLAG` |
| 99 | `23_팔마고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q6-solution.svg` | `ce07c5fcea68e569edf98545093849b82f845147` | `OBSERVED_NO_FLAG` |
| 100 | `23_팔마고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q17.png` | `15d86298751aade4c518994f3df197e60c9871cb` | `OBSERVED_NO_FLAG` |
| 101 | `23_팔마고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q17-solution.svg` | `d0ae24866c7c745c8b306c0a10b65ac36f4a870d` | `OBSERVED_NO_FLAG` |
| 102 | `23_팔마고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q18-solution.svg` | `622fc8a999ffeb340e67589623dd8b5793f32575` | `OBSERVED_NO_FLAG` |
| 103 | `23_팔마고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q20.png` | `1f3dd60bd3741555d30ab9b071df47e40efdcff1` | `OBSERVED_NO_FLAG` |
| 104 | `23_팔마고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q20-solution.svg` | `55852d4622457304066b3f763c138fdc61755647` | `OBSERVED_NO_FLAG` |
| 105 | `23_팔마고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q21-solution.svg` | `4936a5e21136d0427af54a8028466be0379bdd4e` | `OBSERVED_NO_FLAG` |
| 106 | `23_제일고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q2-solution.svg` | `60b8187d4d8a0d669e8afcd6cee617df56dcd499` | `OBSERVED_NO_FLAG` |
| 107 | `23_제일고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q6-solution.svg` | `4d075ab5cc48c4381b6e35fd5bbbe85eb6fb5fde` | `OBSERVED_NO_FLAG` |
| 108 | `23_제일고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q8.png` | `ac06302b086dd47fe62519bbf2f5626f6ffa6e80` | `OBSERVED_NO_FLAG` |
| 109 | `23_제일고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q8-solution.svg` | `f71f6c7b3ace0927b0f5650d946c0982ad543d44` | `OBSERVED_NO_FLAG` |
| 110 | `23_제일고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q9-solution.svg` | `4026e539abadd0e99741940a882295ccf2d3e2fd` | `OBSERVED_NO_FLAG` |
| 111 | `23_제일고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q10.png` | `1975e745935488ef74d60921a0673192a93ba8ca` | `OBSERVED_NO_FLAG` |
| 112 | `23_제일고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q10-solution.svg` | `a1640ba7e02e454a8667481779bf731e215918f2` | `OBSERVED_NO_FLAG` |
| 113 | `23_제일고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q17.png` | `1dbcb2d60781525f84e5f6390013d38ab01061b5` | `OBSERVED_NO_FLAG` |
| 114 | `23_제일고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q20.png` | `8eb145643d1b94044b161504ca14944e24594947` | `OBSERVED_NO_FLAG` |
| 115 | `23_제일고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_제일고_1학기_기말_고2_수학I/q20-solution.svg` | `90c3a3d1428fabcd54644269988ad97fee2968db` | `OBSERVED_NO_FLAG` |
| 116 | `23_복성고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q5-solution.svg` | `2f8e80ac7c38cbc119e0fd0f5ebdebfb151cca9b` | `OBSERVED_NO_FLAG` |
| 117 | `23_복성고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q6.png` | `f03e2cb08d9ffe3f8a3412c2015c4d6297272422` | `OBSERVED_NO_FLAG` |
| 118 | `23_복성고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q10-solution.svg` | `4486c7b3c718f37b4046cc05f022467e0618b581` | `OBSERVED_NO_FLAG` |
| 119 | `23_복성고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q11-solution.svg` | `2ade13ab1b0fa13c68c1d9278d878a576507745a` | `OBSERVED_NO_FLAG` |
| 120 | `23_복성고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q14-solution.svg` | `5403a7cf76bea6eea57541671f7fbb6b073ea878` | `OBSERVED_NO_FLAG` |
| 121 | `23_복성고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q15.png` | `1c6cfe8fbbbb70bb090f2c0912a83f4f1e048b12` | `OBSERVED_NO_FLAG` |
| 122 | `23_복성고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q15-solution.svg` | `105401f16d70c8b5a3da09700b82b5bf44a6e25d` | `OBSERVED_NO_FLAG` |
| 123 | `23_복성고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q18-solution.svg` | `a87929b6ef78a5f2a991d8319a0512e4ce6df2ad` | `OBSERVED_NO_FLAG` |
| 124 | `23_복성고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q19.png` | `b7f6bd4b32d53d91f2d96e11a1390c6300fd94a3` | `OBSERVED_NO_FLAG` |
| 125 | `23_복성고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q19-solution.svg` | `8c78c1edccae5b37830be0c184b8b4e121789035` | `OBSERVED_NO_FLAG` |
| 126 | `23_복성고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q20-solution.svg` | `1e3cea5da5a05560243900f869751eec2636c772` | `OBSERVED_NO_FLAG` |
| 127 | `23_복성고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q21-solution.svg` | `92739f97c356af6b069fe8245becfb7550a4ed20` | `OBSERVED_NO_FLAG` |
| 128 | `23_복성고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q22.png` | `53a197536e6f563f93bd53b6f1c9315780552286` | `OBSERVED_NO_FLAG` |
| 129 | `23_복성고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/23_복성고_1학기_기말_고2_수학I/q22-solution.svg` | `891308a143bad67339020fb0ccb342405839f475` | `OBSERVED_NO_FLAG` |
| 130 | `23_매산고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q07.png` | `b96fa7781f4a0a9def51355d8b9b26ddf3bc18d8` | `OBSERVED_NO_FLAG` |
| 131 | `23_매산고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q15-solution-v2.svg` | `3ef0e9f9a52f4ab329f78fb99052c887c03d572d` | `OBSERVED_NO_FLAG` |
| 132 | `23_매산고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q16.png` | `064675359e46c7af9da112a9ff221d56a77a63d8` | `OBSERVED_NO_FLAG` |
| 133 | `23_매산고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q17.png` | `20b1822e840b6b1b8a180b3f4935c210a795a091` | `OBSERVED_NO_FLAG` |
| 134 | `23_매산고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q18-solution.svg` | `694ff327fd139059cdb25e7fdc0d3d2807a04e8f` | `OBSERVED_NO_FLAG` |
| 135 | `23_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/23_매산고_1학기_기말_고2_수학I/q19-solution.svg` | `fd5e638b2a150f1970f2a270fb2f05fd48b7d68a` | `OBSERVED_NO_FLAG` |
| 136 | `23_금당고_1학기_기말_고2_수학I` | 03 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q3.png` | `657535056194810af90d151f20a50c4c0997136a` | `OBSERVED_NO_FLAG` |
| 137 | `23_금당고_1학기_기말_고2_수학I` | 03 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q3-solution.svg` | `3b09b2971403d75d06989af3faef92abd66d6efc` | `OBSERVED_NO_FLAG` |
| 138 | `23_금당고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q5.png` | `3b0eb68cdc9ddd07e9b0862798a7d57c410c4638` | `OBSERVED_NO_FLAG` |
| 139 | `23_금당고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q5-solution.svg` | `e8e9987784e246a3411ee41a46d9cf7c79298281` | `OBSERVED_NO_FLAG` |
| 140 | `23_금당고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q7.png` | `8780c9091596b1de68d4848359954f1836e7f0d5` | `OBSERVED_NO_FLAG` |
| 141 | `23_금당고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q7-solution.svg` | `c7f41cf8fa120a08e890e1bc6cb61a7027fb3db9` | `OBSERVED_NO_FLAG` |
| 142 | `23_금당고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q8.png` | `bf558b219c9fdbb85c5fcffc22e3743a49c4fbff` | `VISUAL_UPGRADE` |
| 143 | `23_금당고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q8-solution.svg` | `8a4d83138decf4ae87e9e3314bf1636f28873ad5` | `OBSERVED_NO_FLAG` |
| 144 | `23_금당고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q9-solution.svg` | `2d26cce2358925fbf6fcd3a03ea45027549a28b1` | `OBSERVED_NO_FLAG` |
| 145 | `23_금당고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q15.png` | `f2685d747672ffbe4441a34e71118eb76a59d065` | `OBSERVED_NO_FLAG` |
| 146 | `23_금당고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q15-solution.svg` | `647303054d4c9565e61c7e37686ebeed26c72aab` | `OBSERVED_NO_FLAG` |
| 147 | `23_금당고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q16.png` | `3cb1bdfe66825875ebfe7d2cb0025e61f6e2feff` | `OBSERVED_NO_FLAG` |
| 148 | `23_금당고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q16-solution.svg` | `93b4b2bd09f83eb475d774727571e414a73172a1` | `OBSERVED_NO_FLAG` |
| 149 | `23_금당고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q18.png` | `a749b708401617bbe6e44aee6f5d244e54284410` | `OBSERVED_NO_FLAG` |
| 150 | `23_금당고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/23_금당고_1학기_기말_고2_수학I/q18-solution.svg` | `7a0f3e3b6091bec6334083f082c4dcd9d174e3b1` | `OBSERVED_NO_FLAG` |
| 151 | `23_강남여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q6-solution.svg` | `3fd7932e5454742c505899bdfd0cbaf066d10c3d` | `OBSERVED_NO_FLAG` |
| 152 | `23_강남여고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q11-solution.svg` | `2c1797acfc7f7aa70d3d4ea54709d048dce0ffd3` | `OBSERVED_NO_FLAG` |
| 153 | `23_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q20-quality-v4.svg` | `dcf778c01b2bd27cd77ff5bba435033b09787d4e` | `OBSERVED_NO_FLAG` |
| 154 | `23_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q20-solution-v2.svg` | `2eca8bba054505af680924efc36551545666b3ad` | `OBSERVED_NO_FLAG` |
| 155 | `23_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q21.png` | `bd0e6ebb7711150df92baee3528fe27128e01e39` | `OBSERVED_NO_FLAG` |
| 156 | `23_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q21-solution-v2.svg` | `48451726b952d9c0e81ed46a949be32f1172863b` | `OBSERVED_NO_FLAG` |
| 157 | `23_강남여고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q23.png` | `073354516159ba7c5c82f38999954128839a3b8d` | `OBSERVED_NO_FLAG` |
| 158 | `23_강남여고_1학기_기말_고2_수학I` | 25 | `archive/assets/images/23_강남여고_1학기_기말_고2_수학I/q25-solution.svg` | `ecd8e8e1ff332592ae4d1f14e38118d049586596` | `OBSERVED_NO_FLAG` |
| 159 | `22_효천고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q06.png` | `934691b3978c513867bc20af6700e5decffdaba1` | `OBSERVED_NO_FLAG` |
| 160 | `22_효천고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q6-solution.svg` | `578b4645d562148c35b5f7301cc13f4191d255c5` | `OBSERVED_NO_FLAG` |
| 161 | `22_효천고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q08.png` | `44d71b713306421f8de89d4fede1aacabe6082a8` | `VISUAL_HOLD_READABILITY` |
| 162 | `22_효천고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q12.png` | `c4ce5926b69a7593f2eeeafb2dad478ec8c06172` | `OBSERVED_NO_FLAG` |
| 163 | `22_효천고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q12-solution.svg` | `549c4f24e00f3d475e18bef84d0c53b3d25328e7` | `OBSERVED_NO_FLAG` |
| 164 | `22_효천고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q17-solution.svg` | `d1790652b42384b2b61efbd96f87679ec6d4469b` | `OBSERVED_NO_FLAG` |
| 165 | `22_효천고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q18.png` | `40475a9897bc75b3073aa952111aef6f8dd33221` | `OBSERVED_NO_FLAG` |
| 166 | `22_효천고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q18-solution.svg` | `529f35adaa5f58ccc79bf0fb5622734a3f8ff795` | `OBSERVED_NO_FLAG` |
| 167 | `22_효천고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q19-solution.svg` | `ec5fa00d969447b36b844ca63d4a978e7c833d30` | `OBSERVED_NO_FLAG` |
| 168 | `22_효천고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q21.png` | `37c7120e60c9e9bdfc3b23ceaf944d17a13a9f1d` | `OBSERVED_NO_FLAG` |
| 169 | `22_효천고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q21-solution-v2.svg` | `ad889ee1dc99d66d1bd74ab2ba4b95a6e509c229` | `OBSERVED_NO_FLAG` |
| 170 | `22_효천고_1학기_기말_고2_수학I` | 24 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q24-solution.svg` | `83985e8fe1d3920542ab6771d3b674bcc2f7690e` | `OBSERVED_NO_FLAG` |
| 171 | `22_효천고_1학기_기말_고2_수학I` | 25 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q25.png` | `e5c657f8d70adb953b24284a400891a19cf0a590` | `OBSERVED_NO_FLAG` |
| 172 | `22_효천고_1학기_기말_고2_수학I` | 25 | `archive/assets/images/22_효천고_1학기_기말_고2_수학I/q25-solution-v2.svg` | `971845322def172e0b99266117360fa3342f7737` | `OBSERVED_NO_FLAG` |

## 3차 시험지별 실물 검수 결과 (추가 5개 · 44이미지)

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `22_팔마고_1학기_기말_고2_수학I` | 22 | 7 | 3 | 4 | 새 문제 미발견 |
| `22_제일고_1학기_기말_고2_수학I` | 21 | 5 | 2 | 3 | 새 문제 미발견 |
| `22_순천고_1학기_기말_고2_수학I` | 22 | 12 | 5 | 7 | Q10 `VISUAL_UPGRADE` |
| `22_매산고_1학기_기말_고2_수학I` | 21 | 11 | 3 | 8 | 새 문제 미발견 |
| `22_금당고_1학기_기말_고2_수학I` | 20 | 9 | 4 | 5 | Q08 `VISUAL_UPGRADE` |
| **3차 합계** | **106** | **44** | **17** | **27** | **개선 2 · 가독성 HOLD 0** |
| **기말 1~3차 누적** | **464** | **216** | **81** | **135** | **개선 5 · 가독성 HOLD 4** |

### 2022 순천고 Q10 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q10.png`, blob `5e6e66a2401b87ee5941f8e6c661ee3064b95093`.
- 관찰: 원 위 네 점 `A, B, C, D`를 잇는 선분과 길이 `BD=5`, `CD=2`가 스캔의 잔획·흐린 숫자와 겹쳐, 특히 위쪽 `C`/`D` 문자 및 `2`의 위치를 축소 표시에서 혼동하기 쉽다. 원본 크기 확대에서는 점 위치와 두 길이의 대응을 분별할 수 있고, JS 문제 문장에도 수치가 명시돼 있다. **정답 오류 확정이나 원본 소실 HOLD는 아니다.**
- 엔진 인계: 실제 인쇄 원본의 네 점 연결 관계와 `BD=5`, `CD=2`를 대조한 뒤 문제 그림을 선명하게 복원. 해설용 `q10-solution.svg`는 대조 참고지만 출제 원본을 대체하지 않는다. 새 SVG 제작 시 저장소 엔진을 사용한다.

### 2022 금당고 Q08 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q08.png`, blob `01d949798142a6dfce23ef2a81c5e980fa07e765`.
- 관찰: 삼각형 `ABC`의 밑변 `AB` 아래 숫자 `4`가 연한 스캔 점선·얼룩과 합쳐져 원본 크기에서도 다른 각도 숫자 `75°`, `45°`보다 훨씬 낮은 대비로 보인다. 확대하면 `4`는 판별 가능하며 JS 지문도 `AB=4`를 명시한다. 문제 풀이의 필수 길이 표기가 축소 화면에서 약해지는 **가독성 개선 대상**이다.
- 엔진 인계: 출제 원본에 확인되는 `A=75°`, `B=45°`, `AB=4`와 삼각형 모양을 보존하면서 길이 라벨을 선명하게 복원. 보정으로 숫자를 창작하지 않는다. 별도 `q8-solution.svg`와 정답을 독립적인 원본 증명으로 취급하지 않는다.

### 이미지 원본 실물 증거 대장 (3차 추가 44/44; 통합 #173–#216)

| # | 원본 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| 173 | `22_팔마고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q02.png` | `5ec5f5b2cb3c30660e92c8a08af4aa0d213a77cc` | `OBSERVED_NO_FLAG` |
| 174 | `22_팔마고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q2-solution.svg` | `86028ae688c3e1f7ca6abb16b04db53868815039` | `OBSERVED_NO_FLAG` |
| 175 | `22_팔마고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q07.png` | `d5e8ff541a82eac8ffd696ea5eee11dbd94ec1f8` | `OBSERVED_NO_FLAG` |
| 176 | `22_팔마고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q9-solution.svg` | `5629d61073a979cf7694495e8c61dc787889d9be` | `OBSERVED_NO_FLAG` |
| 177 | `22_팔마고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q12-solution.svg` | `77dd024b6e0057e0fc0df072c5aa966de8f77e89` | `OBSERVED_NO_FLAG` |
| 178 | `22_팔마고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q16-solution.svg` | `a75b23cfd09a3b8e1cb3542d6879003a4d46ea1f` | `OBSERVED_NO_FLAG` |
| 179 | `22_팔마고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/22_팔마고_1학기_기말_고2_수학I/q19.png` | `57e58653277d7a7567fe76eb549737910f57f099` | `OBSERVED_NO_FLAG` |
| 180 | `22_제일고_1학기_기말_고2_수학I` | 04 | `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q4-solution.svg` | `6b1b4afd162b88d72743bcb920c341a4d6d3150b` | `OBSERVED_NO_FLAG` |
| 181 | `22_제일고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q15.png` | `d15dbb635e54fffd92c8ae78645eb9ee74c030f7` | `OBSERVED_NO_FLAG` |
| 182 | `22_제일고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q15-solution.svg` | `41df1ddb4ed95d77ddd085c965e8ff115182a96c` | `OBSERVED_NO_FLAG` |
| 183 | `22_제일고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q21.png` | `f4e1180e8ad264ff6c158a1547dcb2ea185d1d5a` | `OBSERVED_NO_FLAG` |
| 184 | `22_제일고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_제일고_1학기_기말_고2_수학I/q21-solution.svg` | `b31007d1829a61fda4d342ecb47812b43ac6f358` | `OBSERVED_NO_FLAG` |
| 185 | `22_순천고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q7-solution.svg` | `4d0eab032b694e1cedaeaf22a6bbdefa675bc500` | `OBSERVED_NO_FLAG` |
| 186 | `22_순천고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q8-solution.svg` | `36e645eb989576b7d95877f4c467587dcc073472` | `OBSERVED_NO_FLAG` |
| 187 | `22_순천고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q10.png` | `5e6e66a2401b87ee5941f8e6c661ee3064b95093` | `VISUAL_UPGRADE` |
| 188 | `22_순천고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q10-solution.svg` | `22ebb1b2b397fe176f821cd6922f0c8cdb5dc988` | `OBSERVED_NO_FLAG` |
| 189 | `22_순천고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q11.png` | `2f08658d69ab4f715029f5afb2e3fced9c49e22b` | `OBSERVED_NO_FLAG` |
| 190 | `22_순천고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q11-solution.svg` | `31c73a379c7b9628b0620772d2b56f552501927e` | `OBSERVED_NO_FLAG` |
| 191 | `22_순천고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q16.png` | `517c57b54da95554116570c337b0d2e94cae4e74` | `OBSERVED_NO_FLAG` |
| 192 | `22_순천고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q16-solution.svg` | `db2970ddfb4fd35cb7996445525c9a041ae199fa` | `OBSERVED_NO_FLAG` |
| 193 | `22_순천고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q17.png` | `251a084a15c144014e0985641db5bea198fb318b` | `OBSERVED_NO_FLAG` |
| 194 | `22_순천고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q17-solution.svg` | `97baa5ca46fd989ed75b0286c8f6f70a9697aa11` | `OBSERVED_NO_FLAG` |
| 195 | `22_순천고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q21.png` | `a416b10d26cb656a0365d5023b5a0c3ccacf33ef` | `OBSERVED_NO_FLAG` |
| 196 | `22_순천고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/22_순천고_1학기_기말_고2_수학I/q21-solution.svg` | `15e0f3b065ebc9767b9aab1df499c168ea27724e` | `OBSERVED_NO_FLAG` |
| 197 | `22_매산고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q1-solution.svg` | `a0719ad998881e1792765a6f0aafb3cc53fa65b6` | `OBSERVED_NO_FLAG` |
| 198 | `22_매산고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q2-solution.svg` | `d367135aac712c584a7e89bb1d0f5180b0bd530a` | `OBSERVED_NO_FLAG` |
| 199 | `22_매산고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q7-solution.svg` | `5c1dbbd805f8fbda5fb0123fa03f81a747bbea1b` | `OBSERVED_NO_FLAG` |
| 200 | `22_매산고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q11-solution.svg` | `69c76a74977e924aebe4295488010de616731bfb` | `OBSERVED_NO_FLAG` |
| 201 | `22_매산고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q14-solution.svg` | `fba908e43305e005723e6485788b4e6429cd4175` | `OBSERVED_NO_FLAG` |
| 202 | `22_매산고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q16.png` | `77236c9d88a8735fdf6be049a20c7a2a4a7b40af` | `OBSERVED_NO_FLAG` |
| 203 | `22_매산고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q16-solution-v2.svg` | `a412abfba65bfa1ca915fc0ea4032f2f9194181b` | `OBSERVED_NO_FLAG` |
| 204 | `22_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q19.png` | `c4ed9457482e1c2243a135cc7abc9750491bc218` | `OBSERVED_NO_FLAG` |
| 205 | `22_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q19-solution-v2.svg` | `bfcf0266cb4ddd787ed88fa354e5bb31dac75252` | `OBSERVED_NO_FLAG` |
| 206 | `22_매산고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q20.png` | `5d535e6e913454fa53dc60fc28c64dada773678a` | `OBSERVED_NO_FLAG` |
| 207 | `22_매산고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/22_매산고_1학기_기말_고2_수학I/q20-solution.svg` | `39a40f1fad4bd61270b0c71db5e7fcd4f36301d5` | `OBSERVED_NO_FLAG` |
| 208 | `22_금당고_1학기_기말_고2_수학I` | 03 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q03.png` | `df841f4745b1cd28575e4a9fb633cf68786d2850` | `OBSERVED_NO_FLAG` |
| 209 | `22_금당고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q08.png` | `01d949798142a6dfce23ef2a81c5e980fa07e765` | `VISUAL_UPGRADE` |
| 210 | `22_금당고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q8-solution.svg` | `0060820bd430c0fd4aeba97ddc53b3076f2a48b6` | `OBSERVED_NO_FLAG` |
| 211 | `22_금당고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q13.png` | `9602b35ee4db262545fcd4d3d6c9f576bb338eb8` | `OBSERVED_NO_FLAG` |
| 212 | `22_금당고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q14.png` | `86dfbb3dfdb04bdbff4e3f0ac6e3d304fc6d1fb1` | `OBSERVED_NO_FLAG` |
| 213 | `22_금당고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q14-solution.svg` | `61c7adaffb54d59fcd2fa95fd3cb3445dbe51009` | `OBSERVED_NO_FLAG` |
| 214 | `22_금당고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q15-solution.svg` | `1434127d1448b49141a33a7b9ba9e0b48232fc66` | `OBSERVED_NO_FLAG` |
| 215 | `22_금당고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q17-solution.svg` | `8ea74d22d75de357eda0029b4c022c87d9c2f2cc` | `OBSERVED_NO_FLAG` |
| 216 | `22_금당고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/22_금당고_1학기_기말_고2_수학I/q19-solution.svg` | `1ab3c5a685cbfcec60c1cd960da6dbd590458210` | `OBSERVED_NO_FLAG` |

## 4차 시험지별 실물 검수 결과 (2021년 추가 6개 · 64이미지)

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `21_강남여고_1학기_기말_고2_수학I` | 30 | 12 | 6 | 6 | Q08·Q20 선분 그림·Q21 개선 3 / Q20 눈송이 단계 HOLD 1 |
| `21_금당고_1학기_기말_고2_수학I` | 22 | 10 | 2 | 8 | 새 문제 미발견 |
| `21_매산고_1학기_기말_고2_수학I` | 20 | 9 | 2 | 7 | 새 문제 미발견 |
| `21_매산여고_1학기_기말_고2_수학I` | 23 | 9 | 3 | 6 | Q19 가독성 HOLD 1 |
| `21_순천여고_1학기_기말_고2_수학I` | 23 | 10 | 5 | 5 | 새 문제 미발견 |
| `21_제일고_1학기_기말_고2_수학I` | 24 | 14 | 5 | 9 | Q04·Q15 개선 2 |
| **4차 합계** | **142** | **64** | **23** | **41** | **개선 5 · 가독성 HOLD 2** |
| **기말 1~4차 누적** | **606** | **280** | **104** | **176** | **개선 10 · 가독성 HOLD 6** |

- 여섯 원본 JS의 문제·해설 본문/이미지 필드에서 직접 참조한 고유 이미지 64개를 수집했으며, 경로별 원본 Git blob SHA를 모두 확보했다. **PNG 23개 전부 원본 디코딩**, **SVG 41개 전부 XML 수신·Inkscape PNG 렌더**, 시험지별 6매 연락시트와 결함 의심 PNG 개별 원본 크기 표시로 도형·숫자·색칠·잘림을 확인했다. **실물 미확인 0/64, SVG 렌더 실패 0/41**.
- 4차 판정: `OBSERVED_NO_FLAG` **57**, `VISUAL_UPGRADE` **5**, `VISUAL_HOLD_READABILITY` **2**. 일반 기말 누적: `OBSERVED_NO_FLAG` **264**, `VISUAL_UPGRADE` **10**, `VISUAL_HOLD_READABILITY` **6**. 한 문항의 이미지가 둘 이상이면 **자산별 개별 판정**하며, 이 통계는 정답 검증·엔진 교정·학생 UI 출고 PASS가 아니다.

### 2021 강남여고 Q08 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q08.png`, blob `4e8aab526598398c7708a4e55c3c3c68c38a86bf`.
- 관찰: 삼각형 `ABC`의 오른쪽 변 `AC` 옆의 길이 `3`, 밑변 `BC` 부근의 `2√2`가 원본 스캔에서 매우 연해 숫자와 배경의 구분이 어렵다. 각 `45°`와 삼각형 윤곽은 확인할 수 있으며 JS 문제 문장에 `a=2√2`, `b=3`, `C=45°`가 별도 명시되어 있어 값 자체를 복원 불능으로 판단하지 않았다.
- 엔진 인계: 출제 원본과 삼각형의 점·길이 배치를 대조한 뒤 길이 라벨 및 선을 선명하게 재제작. 문항 텍스트와 해설을 그림 내용의 독립적 출처로 간주하지 않고 출제 원본을 근거로 검증.

### 2021 강남여고 Q20 선분 변환 그림 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q20_1.png`, blob `43b986f895b62fe02904510bcb6469aed3dcfc4a`.
- 관찰: `q20_1.png`의 상단에는 이전 인쇄 문장 일부가 이미지 경계에서 잘린 채 붙어 있다. 아래의 직선과 가운데 정삼각형 돌출 변환 자체는 읽히지만, 학생 화면에서는 JS가 이미 `<원리>` 문장을 제공하므로 잘린 본문 잔해가 중복·혼동을 일으킬 수 있다.
- 엔진 인계: 선분 3등분과 가운데 선분을 정삼각형 두 변으로 바꾸는 두 도형만 원본 근거로 정리·재크롭. 인접한 설명문 및 잔획을 그림 일부로 재현하지 말 것.

### 2021 강남여고 Q20 눈송이 단계도 — `VISUAL_HOLD_READABILITY`

- 문제 원본: `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q20_2.png`, blob `fd1c05533ebeddb5ba742b3aed9e9aa8e9e57752`.
- 관찰: `q20_2.png`에서 두 번째 이후 눈송이의 세부 윤곽선이 거의 백색으로 날아가고 일부 변이 점·얼룩만 남아 단계별 도형을 시각적으로 확인하기 어렵다. 오른쪽에도 원래 인쇄본의 글자/도형 일부가 경계에서 잘려 붙어 있다. Q20은 ‘4번째 만들어지는 도형’의 둘레를 묻기에 단계가 정확히 읽혀야 한다.
- 엔진 인계: 고해상도 출제 원본에서 정삼각형→코흐 눈송이의 단계 순서·반복 회수·각 단계 선분 분할을 확인하고 문제 그림을 재구성. 해설의 둘레 수치 `64/9`를 이용해 원본 단계를 거꾸로 확정하거나 임의 생성하지 말 것. 복구 전 학생 표시/출고 판독 HOLD.

### 2021 강남여고 Q21 색칠 영역 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q21.png`, blob `6287ec7d52629b4538672500638560684f7c90d1`.
- 관찰: 원에 내접한 정삼각형 두 개의 원본 그림 전반에 회색 스캔 점·오염이 넓게 퍼져 있어, 색칠한 원 내부 영역과 비색칠 중심 정육각형의 경계가 축소 화면에서 흐릿하다. 전체 큰 외곽의 음영 방향은 확인할 수 있으므로 완전 판독 불가로 단정하지 않는다.
- 엔진 인계: `EF ∥ BC`, 원 반지름 `2`, 정삼각형 `ABC/DEF`의 배치 및 색칠 영역의 포함/제외 경계를 원본과 대조해 명료한 문제 그림으로 복원. 보충 해설 SVG를 출제 원본의 유일한 근거로 대체하지 말 것.

### 2021 매산여고 Q19 정육각형 — `VISUAL_HOLD_READABILITY`

- 문제 원본: `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q19.png`, blob `3cc14b923098d3456ca19e574657b4673d9892cc`.
- 관찰: 정육각형 `ABCDEF`의 하단 `C–D`, 오른쪽 하단 `D–E` 윤곽선과 꼭짓점 `M`에서 `D`로 향하는 일부 선분이 원본 스캔에서 끊어져 사실상 공백처럼 보인다. `B–M–C`의 중점 표시와 `θ`는 보이나, Q19은 `∠DME`를 묻는 문제여서 이 연결선 소실을 단순 배경 잡음으로 무시하기 어렵다. 글로 주어진 ‘정육각형·중점·각도’ 조건은 남아 있다.
- 엔진 인계: 원본 출제지 기준으로 정육각형 여섯 변과 `MD`, `ME`, 점 `M`, 각 `θ`, 변 길이 `2√7`를 정확히 재검증해 누락된 선분을 복원. 해설 SVG/산출값만으로 그림을 임의 확정하지 말고 복구 전 도형 가독성 HOLD.

### 2021 제일고 Q04 강 건너편 다리 측량 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q04.png`, blob `02081a377902cdaaa67fb2903e0e8d50f7a26037`.
- 관찰: 강·도로 배경과 삼각형 `A,B,P` 위에 회색 오염·스캔 점이 조밀하게 중첩돼 `20m`, `60°`, `75°` 라벨과 대각선이 크게 흐려 보인다. 동일 수치는 JS 지문에도 `AB=20m`, `∠PAB=75°`, `∠PBA=60°`로 명시돼 있어 원본 값 소실 판정은 보류한다.
- 엔진 인계: 출제지에서 강 건너 `P`의 위치와 삼각형 `ABP`, 세 수치·각도 방향을 확인하여 무관한 배경 잡음을 제거한 문제 도형으로 개선. 값·방향은 선명한 원본과 대조하며 재산정으로 만들지 말 것.

### 2021 제일고 Q15 정육면체 — `VISUAL_UPGRADE`

- 문제 원본: `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q15.png`, blob `01bf9c1b2e676b134c329c8f851fce73ba3c993f`.
- 관찰: 정육면체 `ABCD–EFGH`의 내부 대각선과 면의 명암에 고밀도 스캔 점·회색 얼룩이 겹쳐 선분 `AI`, `IG` 및 일부 꼭짓점 라벨이 축소 상태에서 쉽게 합쳐진다. 원본을 확대하면 정육면체·중점 `I`의 개략적 위치는 식별 가능하고 지문도 `I`를 `EF`의 중점으로 정의하므로 확정적인 값/관계 소실 HOLD는 아니다.
- 엔진 인계: 원본에서 꼭짓점 이름의 앞/뒤 위치, 중점 `I`, 그린 세 선분을 확인한 뒤 음영과 보조선의 명암을 분리해 선명한 입체도형으로 개선. 해설 계산에서 모서리·공간대각선의 위치를 역추론해 새로 구성하지 말 것.

### 이미지 원본 실물 증거 대장 (4차 추가 64/64; 통합 #217–#280)

| # | 원본 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| 217 | `21_강남여고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q08.png` | `4e8aab526598398c7708a4e55c3c3c68c38a86bf` | `VISUAL_UPGRADE` |
| 218 | `21_강남여고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q16-solution.svg` | `abfe537e94e679eb2f2f57b48288f4c4df35312b` | `OBSERVED_NO_FLAG` |
| 219 | `21_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q20_1.png` | `43b986f895b62fe02904510bcb6469aed3dcfc4a` | `VISUAL_UPGRADE` |
| 220 | `21_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q20_2.png` | `fd1c05533ebeddb5ba742b3aed9e9aa8e9e57752` | `VISUAL_HOLD_READABILITY` |
| 221 | `21_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q21.png` | `6287ec7d52629b4538672500638560684f7c90d1` | `VISUAL_UPGRADE` |
| 222 | `21_강남여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q21-solution.svg` | `de748595e570bf42e7d3e3cac64d0b3760c4d8d7` | `OBSERVED_NO_FLAG` |
| 223 | `21_강남여고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q22-solution.svg` | `ca7e2b4c4092488c93892d210e25cd9479bc1962` | `OBSERVED_NO_FLAG` |
| 224 | `21_강남여고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q23.png` | `ef7a84290926fe5175fa943f6f1885fb6b093af8` | `OBSERVED_NO_FLAG` |
| 225 | `21_강남여고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q23-solution.svg` | `4f729936ebafe3eae5aacdeaef34ff979e1defe5` | `OBSERVED_NO_FLAG` |
| 226 | `21_강남여고_1학기_기말_고2_수학I` | 26 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q26-solution.svg` | `40c706f1e2f5a24b1b845ee2d78d6f6631aacaa4` | `OBSERVED_NO_FLAG` |
| 227 | `21_강남여고_1학기_기말_고2_수학I` | 28 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q28.png` | `3bd1d18b140566a11e6067b317fdc5e61fca2e53` | `OBSERVED_NO_FLAG` |
| 228 | `21_강남여고_1학기_기말_고2_수학I` | 28 | `archive/assets/images/21_강남여고_1학기_기말_고2_수학I/q28-solution.svg` | `6290d4681f706783e7a489f1fc944ffe3b37d083` | `OBSERVED_NO_FLAG` |
| 229 | `21_금당고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q1-solution.svg` | `fd65bedf42789568a72716e856b2989a0598bb66` | `OBSERVED_NO_FLAG` |
| 230 | `21_금당고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q13-solution.svg` | `dd3788ef7ae97b603a94d6e7977e4741302dbe7f` | `OBSERVED_NO_FLAG` |
| 231 | `21_금당고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q14-solution.svg` | `fdfe2db7a63a961272fee8b54b6ef407bc812ddd` | `OBSERVED_NO_FLAG` |
| 232 | `21_금당고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q16-solution.svg` | `a531d7d5e61a3347bd578d98eefd45898593ecda` | `OBSERVED_NO_FLAG` |
| 233 | `21_금당고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q17.png` | `7976c0589a8e305fcbcb81e799b03cc7fde18be9` | `OBSERVED_NO_FLAG` |
| 234 | `21_금당고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q17-solution.svg` | `f661912804de7ecbfac6b22cdf24538ae133e048` | `OBSERVED_NO_FLAG` |
| 235 | `21_금당고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q19-solution.svg` | `e768059224f22b879419efaf3f89a38d0fb4a1a1` | `OBSERVED_NO_FLAG` |
| 236 | `21_금당고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q20.png` | `71ff4ab9b9e6a74748a9b5d7d62a4d2ce4e65ba5` | `OBSERVED_NO_FLAG` |
| 237 | `21_금당고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q20-solution.svg` | `3f870c7f6fb04a024f2ea969b956827090195e9f` | `OBSERVED_NO_FLAG` |
| 238 | `21_금당고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/21_금당고_1학기_기말_고2_수학I/q22-solution.svg` | `8781730b6d6fadbf2c68f855b861b2d3b426d66c` | `OBSERVED_NO_FLAG` |
| 239 | `21_매산고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q7-solution.svg` | `822180e639d5c9868fa29fa1817f73f772385d10` | `OBSERVED_NO_FLAG` |
| 240 | `21_매산고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q10-solution.svg` | `189e97c99c2768847a0b70cf2fb6243a0a2af02d` | `OBSERVED_NO_FLAG` |
| 241 | `21_매산고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q11-solution.svg` | `f71b4ce92d0e42da5e818c7f81e80dde24d1c43e` | `OBSERVED_NO_FLAG` |
| 242 | `21_매산고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q14.png` | `a12724801ffc6179f6ab159ada14cebbaa12a974` | `OBSERVED_NO_FLAG` |
| 243 | `21_매산고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q14-solution.svg` | `46738920553a20dd24bab6edc84c1a9064ec1878` | `OBSERVED_NO_FLAG` |
| 244 | `21_매산고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q15-solution-v2.svg` | `29a9e066d51a49d414772c79009081d10b8630db` | `OBSERVED_NO_FLAG` |
| 245 | `21_매산고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q16.png` | `a78e9764cf63834acff42184822f2bdcaa2a45ae` | `OBSERVED_NO_FLAG` |
| 246 | `21_매산고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q17-solution.svg` | `9bd11ee7c44c3997bef53e59e2d11794184a4faa` | `OBSERVED_NO_FLAG` |
| 247 | `21_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_매산고_1학기_기말_고2_수학I/q19-solution.svg` | `5ed3e6b620d0404748f241fe34f6f80dd690843c` | `OBSERVED_NO_FLAG` |
| 248 | `21_매산여고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q05.png` | `779d6dcf74632067dff4e3f9fd045c80b834ba4d` | `OBSERVED_NO_FLAG` |
| 249 | `21_매산여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q6-solution.svg` | `effe69ca3f49991ba5c93e34dd096351f4023270` | `OBSERVED_NO_FLAG` |
| 250 | `21_매산여고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q13.png` | `f6bc8ddca146591b64365359f0c2ef84195413e0` | `OBSERVED_NO_FLAG` |
| 251 | `21_매산여고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q13-solution.svg` | `05fa0062e15212bee3930c1828a2810a1c50e42c` | `OBSERVED_NO_FLAG` |
| 252 | `21_매산여고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q18-content-correction.svg` | `f2436b6a6ff61b021cdc0cbfc4712e2da0b589c6` | `OBSERVED_NO_FLAG` |
| 253 | `21_매산여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q19.png` | `3cc14b923098d3456ca19e574657b4673d9892cc` | `VISUAL_HOLD_READABILITY` |
| 254 | `21_매산여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q19-solution-v2.svg` | `2f87b5ec6dcce9e6cac66c1537186b12f7f9309a` | `OBSERVED_NO_FLAG` |
| 255 | `21_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q21-problem-v2.svg` | `3b52f4f04e5983923c3b17dc8fe0aaffae2fbd91` | `OBSERVED_NO_FLAG` |
| 256 | `21_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/21_매산여고_1학기_기말_고2_수학I/q21-solution-v2.svg` | `280ce934c543f2bb981de2ce6c783574a193b995` | `OBSERVED_NO_FLAG` |
| 257 | `21_순천여고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q01-problem-full-c-v1.svg` | `134807adc116bdc75fc73175a8bd2b090b728591` | `OBSERVED_NO_FLAG` |
| 258 | `21_순천여고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q01.png` | `4164f23bf5868b0517091ab4df1f0a7ddea0927c` | `OBSERVED_NO_FLAG` |
| 259 | `21_순천여고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q1-solution.svg` | `79070bf8b16fb0a52b4b54218a148a6142d63599` | `OBSERVED_NO_FLAG` |
| 260 | `21_순천여고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q11.png` | `a56a31f3b41c3e2ddcac5eb721464319ad71ee6c` | `OBSERVED_NO_FLAG` |
| 261 | `21_순천여고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q11-solution.svg` | `14e778b85b5f03a40ad40ab90e8a6f7307f95dc9` | `OBSERVED_NO_FLAG` |
| 262 | `21_순천여고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q18.png` | `5578b49f0d82610c2357c6f02f67527101d01727` | `OBSERVED_NO_FLAG` |
| 263 | `21_순천여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q19.png` | `563453cb4e3ecdf6f80091a3fcec1995bb414f7d` | `OBSERVED_NO_FLAG` |
| 264 | `21_순천여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q19-solution-v2.svg` | `8c7a074e3840147ca918f0876f99ed3c2a31fe10` | `OBSERVED_NO_FLAG` |
| 265 | `21_순천여고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q23.png` | `70564a39d236a2e387caf483b8eaee51323a04af` | `OBSERVED_NO_FLAG` |
| 266 | `21_순천여고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/21_순천여고_1학기_기말_고2_수학I/q23-solution-v2.svg` | `41914d11eb7665279d2cc4ab111b80a68e9cb09b` | `OBSERVED_NO_FLAG` |
| 267 | `21_제일고_1학기_기말_고2_수학I` | 04 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q04.png` | `02081a377902cdaaa67fb2903e0e8d50f7a26037` | `VISUAL_UPGRADE` |
| 268 | `21_제일고_1학기_기말_고2_수학I` | 04 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q4-solution.svg` | `091ae89f09ff0e5c7e9d12d202467f549a17b6ab` | `OBSERVED_NO_FLAG` |
| 269 | `21_제일고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q5-solution.svg` | `985ff083f6a804a55f100ebbc2aa92512bb1d8b4` | `OBSERVED_NO_FLAG` |
| 270 | `21_제일고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q15.png` | `01bf9c1b2e676b134c329c8f851fce73ba3c993f` | `VISUAL_UPGRADE` |
| 271 | `21_제일고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q15-solution.svg` | `8445695db4745d21a436eacb2881401c172cf14c` | `OBSERVED_NO_FLAG` |
| 272 | `21_제일고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q17_question-v2.svg` | `bb7b1de10dc712297371261c85ba58db266ac7a6` | `OBSERVED_NO_FLAG` |
| 273 | `21_제일고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q17.png` | `be333647e5c6bb5d3fcb07d182fb32b0b1217601` | `OBSERVED_NO_FLAG` |
| 274 | `21_제일고_1학기_기말_고2_수학I` | 17 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q17-solution.svg` | `9a6291fb60d152d29c681331458ad5d3525945de` | `OBSERVED_NO_FLAG` |
| 275 | `21_제일고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q19.png` | `980bfd4676c6937e6a28f9f38431ca57efcc5586` | `OBSERVED_NO_FLAG` |
| 276 | `21_제일고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q19-solution.svg` | `7a90eb78bc2526adc1aa71ce5002d07bc9c9a993` | `OBSERVED_NO_FLAG` |
| 277 | `21_제일고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q22_question-v2.svg` | `d9f453958cf43d0bd94c8bceddd123eefba16d73` | `OBSERVED_NO_FLAG` |
| 278 | `21_제일고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q22.png` | `9ab015841ae8e54593c29eddb776b512d63266e7` | `OBSERVED_NO_FLAG` |
| 279 | `21_제일고_1학기_기말_고2_수학I` | 22 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q22-solution.svg` | `f763258ca571ab47c51c50356fcc9dad1ac18869` | `OBSERVED_NO_FLAG` |
| 280 | `21_제일고_1학기_기말_고2_수학I` | 23 | `archive/assets/images/21_제일고_1학기_기말_고2_수학I/q23-solution.svg` | `28851c54898ce808141dbeed9ea6c35c2982c318` | `OBSERVED_NO_FLAG` |

## 5차 시험지별 실물 검수 결과 (최종 5개 · 48이미지)

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `19_강남여고_1학기_기말_고2_수학I` | 30 | 8 | 4 | 4 | Q12 문제 그림 HOLD 1 · 보조 그림 개선 1 |
| `19_매산여고_1학기_기말_고2_수학I` | 22 | 10 | 6 | 4 | Q02·Q05·Q19 개선 3 · Q18 HOLD 1 |
| `19_순천여고_1학기_기말_고2_수학I` | 22 | 9 | 5 | 4 | Q04·Q05·Q07 개선 3 |
| `20_매산고_1학기_기말_고2_수학I` | 20 | 12 | 7 | 5 | Q14 문제 PNG·해설 SVG 개선 2 |
| `20_매산여고_1학기_기말_고2_수학I` | 23 | 9 | 2 | 7 | 새 시각 결함 미발견 |
| **5차 합계** | **117** | **48** | **24** | **24** | **개선 9 · 가독성 HOLD 2** |
| **기말 1~5차 전체** | **723** | **328** | **128** | **200** | **개선 19 · 가독성 HOLD 8** |

- JS 5개의 문제 본문·해설/이미지 필드를 전수 추출한 **고유 이미지 48개**는 48개 경로 모두 원본 Git blob SHA 수신 성공. **PNG 24개 원본 디코딩·개별 확대**, **SVG 24개 XML 원본 수신 후 Inkscape 렌더**, 시험지별 5매 연락시트에서 전부 실물 관찰. **이미지 원본 미확인 0/48 · 누락 0/48 · SVG 렌더 실패 0/24**.
- **5차 판정:** `OBSERVED_NO_FLAG` **37**, `VISUAL_UPGRADE` **9**, `VISUAL_HOLD_READABILITY` **2**. **일반 기말 최종(328개):** `OBSERVED_NO_FLAG` **301**, `VISUAL_UPGRADE` **19**, `VISUAL_HOLD_READABILITY` **8**. 2019 강남여고 Q12의 문제 그림과 보조 그림, 2020 매산고 Q14의 문제 그림과 해설 그림은 각각 별개 자산으로 판정한다.
- `VISUAL_HOLD_READABILITY`는 **원본 시각 판독·복구 확인 보류**이며, 자동으로 정답 오류 또는 JS 결함을 의미하지 않는다. `OBSERVED_NO_FLAG` 역시 엔진 교정·실제 학생 UI·출고 품질 보증 PASS가 아님.

### 2019 강남여고 Q12 겹친 두 원의 색칠 영역 — `VISUAL_HOLD_READABILITY`

- 이미지 원본: `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q12.png`, Git blob `da091f44a42188f20f1dbd6523afc0066c7ce58b`.
- 직접 관찰: 450×320px 원본에서 두 원 `O, O′`의 겹친 렌즈 영역이 주변 흰 바탕과 거의 같은 밝기로 보여, JS 발문이 가리키는 **‘어두운 부분’의 범위**를 실물 그림만으로 확정하기 어렵다. 왼쪽 경계에는 인접한 한글 문장 조각까지 끊긴 상태로 붙어 있다. 원의 중심·교점·바깥 윤곽은 구분되나 필수 음영 표시는 불명확하다.
- 엔진 인계: 고해상도 출제 원본에서 색칠 영역이 겹침 부분인지, 호의 어느 구간인지 확인하고 음영·중심·원호를 정확히 복구할 것. JS 풀이의 ‘틀린 과정’ 선택 및 해설에서 음영 위치를 역으로 만들어내지 말고 복구 전 가독성 HOLD.

### 2019 강남여고 Q12 보조 원 그림 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q12_1.png`, Git blob `6a65c047647e488a67b634a810c9ff3125abb312`.
- 직접 관찰: 410×310px `q12_1.png` 왼쪽에 인쇄 문장 자투리가 경계에 걸려 있고, 원의 교차부·삼각형 `POO′`의 회색 선과 음영 대비가 낮다. 점 `P,O,O′`와 선분은 확대하면 구별 가능하므로 문제 원본 `q12.png`와 별도의 개선 대상으로 관리한다.
- 엔진 인계: Q12 첫 그림의 원본 음영 대조 결과를 반영하면서 교차 원호와 보조 정삼각형만 깨끗이 크롭하고 점명·선분·중심각의 관계를 보존할 것.

### 2019 매산여고 Q02 유람선 거리 그림 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q02.png`, Git blob `10903f43187224d8df8db9b6c9c66c29394599b7`.
- 직접 관찰: 1100×593px 원본 윗부분에 문제의 끝 문장, ‘`sin40°=0.65`’ 조건과 배점이 복사된 채 잘려 있고, 그 아래 섬 A·섬 B·선착장·유람선의 지도가 있다. JS 본문은 그 문장과 수치를 이미 독립적으로 제공하므로 그림에서 인쇄 문장이 중복되어 보인다. `3km`, `2km`, `130°`, `xkm`의 대응은 판독 가능하다.
- 엔진 인계: 출제 원본에서 지도 도형·선착장·섬 이름·거리·각도만 일관되게 재크롭. 본문에서 제공되는 인쇄 문장·배점은 그림에 중복 삽입하지 말 것.

### 2019 매산여고 Q05 원과 색칠 삼각형 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q05.png`, Git blob `b536eddbfe13f701b113f45a2415ac3982246463`.
- 직접 관찰: 650×550px 원본 오른쪽에는 그림과 무관한 세로 인쇄 구분선 및 숫자 `7`이 그대로 들어가 있다. 원 안의 삼각형 `ABC`와 음영 영역, 중심 `O`, 길이 `5`는 시각 확인되며 기하 관계의 소실은 없다.
- 엔진 인계: 출제 원본에서 원·삼각형·음영·`AO=5` 라벨만 살리고 오른쪽 페이지/단 구성의 선과 잔여 숫자 `7`은 제거. 원의 중심과 색칠 영역을 바꾸지 말 것.

### 2019 매산여고 Q18 블록 쌓기 배열 — `VISUAL_HOLD_READABILITY`

- 이미지 원본: `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q18.png`, Git blob `6cd30a4cf1fb642c07fec0835c468ba538393b57`.
- 직접 관찰: 1400×600px 원본 위쪽에는 문항 끝부분·배점 및 가로 경계선이 붙어 있고, 오른쪽 **3층 블록 조형의 최하단 블록들이 그림 하단 경계에서 잘려 있다.** 학생이 층별 증가하는 블록 배치를 직접 확인해야 하는 수열 패턴 문제인데, 마지막 도형의 전체 실루엣이 보이지 않아 시각 자료로 검증하기 어렵다. JS에는 `a₁=1,a₂=4,a₃=10`이 별도 기술돼 있다.
- 엔진 인계: 원 인쇄본으로 1·2·3층 블록의 숨겨진 개수와 전후 위치·전체 바닥면을 확인한 뒤 잘린 하단을 복구. 발문의 세 수치나 해설 `a₅=35`만 보고 도형을 임의 제작하지 말고, 복원 전 시각 자료 HOLD.

### 2019 매산여고 Q19 두 포물선과 수직선 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q19.png`, Git blob `4591fc51063a75f756d0aad9822fc455859a232c`.
- 직접 관찰: 895×652px 원본 위쪽에 인쇄 문장 ‘…구할 수 있다.[5점]’가 이미지 경계에서 절단된 채 남아 있다. 그래프 자체인 `y=x²`, `y=x²+ax+b`와 두 곡선 사이의 15개 수직 간격 위치는 화면에서 읽힌다.
- 엔진 인계: 포물선·축·교점·수직선의 상대 관계를 원본대로 유지하고, 잘린 상단 문구와 주변 잡음을 제외한 도형 부분만 다시 크롭할 것.

### 2019 순천여고 Q04 대각선 교차 사각형 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q04.png`, Git blob `75dfd668ae5292b3ab01568f4e5bfda5da876f5e`.
- 직접 관찰: 450×290px 스캔에서 마름모형 사각형 `ABCD`의 아래쪽 꼭짓점 **`C` 라벨 일부가 이미지 하단에 잘리고**, 대각선 `AC`, `BD`의 교차부에 `6`, `8`, `π/3` 표기가 좁게 겹쳐 있다. JS 지문이 길이 `6`, `8`과 끼인각 `π/3`을 모두 명시하므로 원본 수치 소실은 확정하지 않는다.
- 엔진 인계: 네 꼭짓점과 교차각·대각선의 길이 표시를 원본에 따라 확실하게 분리하여 재크롭. 특히 `C`와 하단 여백을 확보하고 각도 표기의 위치를 임의 변경하지 말 것.

### 2019 순천여고 Q05 각의 이등분선 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q05.png`, Git blob `82d7a888b1dbffbf654c1568d91b612a22760342`.
- 직접 관찰: 500×330px `ABC`와 각 이등분선 `AD` 그림의 왼쪽 테두리에 원본 인쇄물의 세로 한글 글자 조각이 그대로 잘려 붙어 있다. `AB=9`, `AC=6`, 두 각 `60°`, 점 `D`와 삼각형은 판독된다.
- 엔진 인계: 왼쪽 인쇄 본문 잔여를 제거하고 삼각형 `ABC`, `AD`, 점명·두 변 길이·두 각도만 정돈해 크롭. 각 이등분 관계를 보존할 것.

### 2019 순천여고 Q07 세 경우 수선 그림 표 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q07.png`, Git blob `9f7e647fd42aeb1b0f02dc1f36dde5cfd424cbfc`.
- 직접 관찰: 990×830px 도형·수식 표의 왼쪽 `C<90° / C=90° / C>90°` 열에 고농도의 회색 스캔 얼룩이 수직으로 남아 문자 대비가 약하다. 각 행의 그림과 `(가)·(나)·(다)` 빈칸 및 코사인 식은 개별 확대에서 확인되므로 현재는 판독 보류가 아닌 표면·음영 개선 대상으로 분류한다.
- 엔진 인계: 출제 표의 세 행 분류·수선의 발 `H` 위치·빈칸 기호 및 수식을 그대로 보존해 왼쪽 얼룩을 제거하고 글자 대비를 개선. 답의 `(가)(나)(다)` 값은 원본 확인 없이 빈칸 안에 미리 입력하지 말 것.

### 2020 매산고 Q14 삼각형의 `C`각 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q14.png`, Git blob `81dc79146355630e3c3a7be7b7623268c0f6991a`.
- 직접 관찰: 875×550px 원본에서 `AB=5√6`, `AC=10`, `AD=7√2`는 확인되지만, `C`의 내각을 나타내는 활꼴 옆 **`60°` 숫자가 희미한 얼룩만 남아 사실상 읽히지 않는다.** JS 발문에는 `∠C=60°`가 따로 적혀 있어 출제 값이 유실된 것으로 단정하지 않는다.
- 엔진 인계: 출제 원본과 대조해 꼭짓점 `C`의 각도 `60°` 라벨과 `AD` 위치를 선명히 복원하고, 세 변 길이의 점 대응을 보존할 것. 정답 풀이 수치만으로 각 위치를 확정하지 말 것.

### 2020 매산고 Q14 해설 도형 패널 — `VISUAL_UPGRADE`

- 이미지 원본: `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q14-solution.svg`, Git blob `c8b51b969a29fa4ba2a458a821708fa332146d76`.
- 직접 관찰: 720×1048px 해설 SVG는 위쪽의 원래 삼각형 `ABC/D`와 양쪽에 떨어진 길이 표기용 선분 `AB`, `AD`, 아래쪽의 `D′` 확대 구간을 한 장에 그리며, 두 묶음 사이의 세로 빈 공간이 지나치게 크다. 연락시트·축소 표시에서는 중심 기하도형과 `5−√23`의 관계가 한눈에 묶이지 않고 인접한 `A/B/D` 명칭이 중복되어 보인다. 원본 SVG는 정상 렌더한다.
- 엔진 인계: 상단 주도형·길이 보조 도형·하단 두 번째 교점 `D′` 확대를 구획 또는 간단한 연결 라벨로 분리하고 과도한 공백을 줄일 것. `5+5√3`, `5−√23` 및 점 대응을 유지해 수치·기하관계를 수정하지 말 것.

### 이미지 원본 실물 증거 대장 (5차 추가 48/48; 일반 통합 #281–#328)

| # | 원본 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| 281 | `19_강남여고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q12.png` | `da091f44a42188f20f1dbd6523afc0066c7ce58b` | `VISUAL_HOLD_READABILITY` |
| 282 | `19_강남여고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q12_1.png` | `6a65c047647e488a67b634a810c9ff3125abb312` | `VISUAL_UPGRADE` |
| 283 | `19_강남여고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q16-solution.svg` | `2645e0641986b8ba6dfa39db82cd88200a5456ca` | `OBSERVED_NO_FLAG` |
| 284 | `19_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q20.png` | `b7764ecf7dd69cdd9fd34002d14697fb366c9822` | `OBSERVED_NO_FLAG` |
| 285 | `19_강남여고_1학기_기말_고2_수학I` | 20 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q20-solution.svg` | `27fabf9a19445069df39fb10899a0fa5784e4dbc` | `OBSERVED_NO_FLAG` |
| 286 | `19_강남여고_1학기_기말_고2_수학I` | 25 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q25.png` | `5b21994dbef6d151fe814d0db8691e2c384662e9` | `OBSERVED_NO_FLAG` |
| 287 | `19_강남여고_1학기_기말_고2_수학I` | 25 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q25-solution.svg` | `fa9d4d27c1b45e73c16ab22ca71264a8a2a6aea1` | `OBSERVED_NO_FLAG` |
| 288 | `19_강남여고_1학기_기말_고2_수학I` | 30 | `archive/assets/images/19_강남여고_1학기_기말_고2_수학I/q30-solution.svg` | `c582738cc07ff0830ebbc97d747e58908c92eac8` | `OBSERVED_NO_FLAG` |
| 289 | `19_매산여고_1학기_기말_고2_수학I` | 02 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q02.png` | `10903f43187224d8df8db9b6c9c66c29394599b7` | `VISUAL_UPGRADE` |
| 290 | `19_매산여고_1학기_기말_고2_수학I` | 03 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q03.png` | `5ec0e24a2a5774c0b7a1375d8e1b14f70ad666ba` | `OBSERVED_NO_FLAG` |
| 291 | `19_매산여고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q05.png` | `b536eddbfe13f701b113f45a2415ac3982246463` | `VISUAL_UPGRADE` |
| 292 | `19_매산여고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q5-solution.svg` | `54d6f8f74a64712c08c23c1418d035d4e81ee24f` | `OBSERVED_NO_FLAG` |
| 293 | `19_매산여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q6-solution.svg` | `0bb00dd03ed7e998d14e1e99dbef8ff244874a52` | `OBSERVED_NO_FLAG` |
| 294 | `19_매산여고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q8-solution.svg` | `faad363929bf9002b0159214327d30b95880e0b7` | `OBSERVED_NO_FLAG` |
| 295 | `19_매산여고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q18.png` | `6cd30a4cf1fb642c07fec0835c468ba538393b57` | `VISUAL_HOLD_READABILITY` |
| 296 | `19_매산여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q19.png` | `4591fc51063a75f756d0aad9822fc455859a232c` | `VISUAL_UPGRADE` |
| 297 | `19_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q21.png` | `1bce2c413e2f0f55f645758c12fc2e9b72e961fd` | `OBSERVED_NO_FLAG` |
| 298 | `19_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/19_매산여고_1학기_기말_고2_수학I/q21-solution.svg` | `0f803db5af82d513f1ee513fc9210350e1b4516c` | `OBSERVED_NO_FLAG` |
| 299 | `19_순천여고_1학기_기말_고2_수학I` | 04 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q04.png` | `75dfd668ae5292b3ab01568f4e5bfda5da876f5e` | `VISUAL_UPGRADE` |
| 300 | `19_순천여고_1학기_기말_고2_수학I` | 05 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q05.png` | `82d7a888b1dbffbf654c1568d91b612a22760342` | `VISUAL_UPGRADE` |
| 301 | `19_순천여고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q06-problem-11px.svg` | `cace8989f922454b520c3dcbdb8c36da5520e72b` | `OBSERVED_NO_FLAG` |
| 302 | `19_순천여고_1학기_기말_고2_수학I` | 07 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q07.png` | `9f7e647fd42aeb1b0f02dc1f36dde5cfd424cbfc` | `VISUAL_UPGRADE` |
| 303 | `19_순천여고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q8-solution.svg` | `48cf5a8931dcd224b27d1b74e292567646d8a888` | `OBSERVED_NO_FLAG` |
| 304 | `19_순천여고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q09.png` | `345855da8992b2928cb2d4caaf08ec97c4afccb7` | `OBSERVED_NO_FLAG` |
| 305 | `19_순천여고_1학기_기말_고2_수학I` | 09 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q9-solution.svg` | `f9149856362cce05591b977a47d3117a7def5b89` | `OBSERVED_NO_FLAG` |
| 306 | `19_순천여고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q11.png` | `b3482f43072f046aea8a91a4b0e652af6486c2d9` | `OBSERVED_NO_FLAG` |
| 307 | `19_순천여고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/19_순천여고_1학기_기말_고2_수학I/q19-solution.svg` | `0ac441bc1c4337c428d583c9169dc12a2e9e5177` | `OBSERVED_NO_FLAG` |
| 308 | `20_매산고_1학기_기말_고2_수학I` | 01 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q01.png` | `5372a78c2d91333bd03439c9704d2c3cd03901cb` | `OBSERVED_NO_FLAG` |
| 309 | `20_매산고_1학기_기말_고2_수학I` | 06 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q06.png` | `835fabd2474e1d6928556c82231e90a8d3078181` | `OBSERVED_NO_FLAG` |
| 310 | `20_매산고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q08.png` | `d87256935d1b9aab5c40b03bda6075166ecc65fa` | `OBSERVED_NO_FLAG` |
| 311 | `20_매산고_1학기_기말_고2_수학I` | 08 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q8-solution.svg` | `6ec2ab3f57698be3c674640ac10225280e01dbcc` | `OBSERVED_NO_FLAG` |
| 312 | `20_매산고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q13.png` | `1d465ade9b900c48faa0f51da02e02af90efebdc` | `OBSERVED_NO_FLAG` |
| 313 | `20_매산고_1학기_기말_고2_수학I` | 13 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q13-solution.svg` | `bfaa14d284a54bf58ab82b2596e49f9d33c04dfc` | `OBSERVED_NO_FLAG` |
| 314 | `20_매산고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q14.png` | `81dc79146355630e3c3a7be7b7623268c0f6991a` | `VISUAL_UPGRADE` |
| 315 | `20_매산고_1학기_기말_고2_수학I` | 14 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q14-solution.svg` | `c8b51b969a29fa4ba2a458a821708fa332146d76` | `VISUAL_UPGRADE` |
| 316 | `20_매산고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q18.png` | `69c35ef349a35190e9eb4ffff4f02ca3291d331c` | `OBSERVED_NO_FLAG` |
| 317 | `20_매산고_1학기_기말_고2_수학I` | 18 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q18-solution.svg` | `6f1e7b4142e9ddfd04a8f338b5e864417f636706` | `OBSERVED_NO_FLAG` |
| 318 | `20_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q19.png` | `ea555a621b04582b27e292b439c046dcdad5a19c` | `OBSERVED_NO_FLAG` |
| 319 | `20_매산고_1학기_기말_고2_수학I` | 19 | `archive/assets/images/20_매산고_1학기_기말_고2_수학I/q19-solution.svg` | `22a28300df160d8319cd5ea1e23653d817561377` | `OBSERVED_NO_FLAG` |
| 320 | `20_매산여고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q10.png` | `bc2be3489a1f096c3a4f2cb6088a16d3312b377b` | `OBSERVED_NO_FLAG` |
| 321 | `20_매산여고_1학기_기말_고2_수학I` | 10 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q10-solution.svg` | `2f301a50eb4376bccaa466cc88b562bbaed65a63` | `OBSERVED_NO_FLAG` |
| 322 | `20_매산여고_1학기_기말_고2_수학I` | 11 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q11-solution.svg` | `59d2a307077b2e306ab3fec90fe30d9306b67eaa` | `OBSERVED_NO_FLAG` |
| 323 | `20_매산여고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q12.png` | `55f8af6b9e76cfc88ce8425f76e93fac37692f57` | `OBSERVED_NO_FLAG` |
| 324 | `20_매산여고_1학기_기말_고2_수학I` | 12 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q12-solution.svg` | `b42cd96e8b9d05b4e86897c1bd1eb97384d4a140` | `OBSERVED_NO_FLAG` |
| 325 | `20_매산여고_1학기_기말_고2_수학I` | 15 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q15-solution.svg` | `7394aa0805c1cf14fc71645bbbd83d277d540665` | `OBSERVED_NO_FLAG` |
| 326 | `20_매산여고_1학기_기말_고2_수학I` | 16 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q16-solution.svg` | `389a3d01303aad6c40fdab36a62ac8fd78463028` | `OBSERVED_NO_FLAG` |
| 327 | `20_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q21-problem.svg` | `39ec80ce5e1eaa613ab1e2eb6e016acbbe91cc89` | `OBSERVED_NO_FLAG` |
| 328 | `20_매산여고_1학기_기말_고2_수학I` | 21 | `archive/assets/images/20_매산여고_1학기_기말_고2_수학I/q21-solution.svg` | `bde16e38c7d15f02faadb3480d83c52e01e264b5` | `OBSERVED_NO_FLAG` |

## 보충 묶음 `대수c` 2개 시험지 전수 이미지 검수 (별도 25/25)

| 시험지 | 문항 | 이미지 | PNG | SVG | 시각 결함 예약 |
|---|---:|---:|---:|---:|---|
| `25_제일고_1학기_기말_고2_대수c` | 23 | 13 | 6 | 7 | 새 문제 미발견 |
| `25_효천고_1학기_기말_고2_대수c` | 23 | 12 | 5 | 7 | Q16, Q21 해설 `VISUAL_UPGRADE` |
| **보충 합계(일반 328개 분모 제외)** | **46** | **25** | **11** | **14** | **개선 2 · 가독성 HOLD 0** |

- 보충 시험지 2개 원본 JS에서 문제·해설의 이미지 필드와 인라인 이미지 참조를 추출해 **고유 자산 25개**를 각 경로에서 실제 수신했다. PNG 11개 원본 디코드·확대 관찰, SVG 14개 XML 수신·Inkscape 래스터 렌더 후 화면 관찰, 전체 6매 연락시트의 보충 영역과 의심 원본을 단독 대조. **미확인 자산 0/25, SVG 렌더 실패 0/14**.
- 두 JS는 일부 이미지가 `_대수c`가 아닌 `_수학I` 또는 `_대수` 자산 폴더를 직접 참조한다. 경로가 서로 다르더라도 **25개 모두 실제 존재·렌더 가능**하므로 파일 누락으로 판단하지 않는다. 교체 엔진은 JS에 설정된 **실제 자산 경로**를 기준으로 추적해야 한다.
- `OBSERVED_NO_FLAG` **23**, `VISUAL_UPGRADE` **2**, `VISUAL_HOLD_READABILITY` **0**. 이 판정은 화면에서의 그림·숫자·레이아웃 관찰 결과로, 정답/전체 해설의 의미론적 재채점이나 학생 UI 출고 승인과는 별개다.

### 2025 효천고 `대수c` Q16 — `VISUAL_UPGRADE` (문제 그림)

- 자산: `archive/assets/images/25_효천고_1학기_기말_고2_대수/q16.png` (blob `e11014c69395b22ffbac66f0a9b616999d28b21e`, 341×196 px).
- 관찰: 좌표축 위 다섯 점 `E, A, B, C, D`를 나타낸 원본 스캔의 해상도가 낮고, 원점 `O`·점 `A`·점 `B`·점 `C`가 축 교차부의 좁은 공간에 모여 있어 기본 표시 크기에서 **점 이름과 원점을 혼동하기 쉽다**. 확대하면 점 배치(`E–A–O–C`, `B`는 양의 y방향, `D`는 음의 y방향)를 확인할 수 있으므로 숫자/점 불일치 확정이나 HOLD는 아니다.
- 엔진 인계: 원본 출제 그림 및 본문 `AB⊥BC`, `BC⊥CD`, `CD⊥DE` 조건을 대조한 뒤 축·라벨 여백을 넓힌 선명한 문제 그림으로 복원. 5개 점의 실제 순서 및 직교 관계를 바꾸지 않을 것.

### 2025 효천고 `대수c` Q21 — `VISUAL_UPGRADE` (해설 SVG)

- 자산: `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q21-solution.svg` (blob `24160b8849981cbd6dbc0eed85f44a85be3d76cd`, 렌더 560×440 px).
- 관찰: 하나의 해설 이미지에 **주삼각형 ABC**, **오른쪽에 펼친 AQ 길이**, **아래에 펼친 BC의 3:1:2 구간**이 동시에 담겨 있다. 별도 패널 경계 없이 점 `A/P/Q/C` 이름이 여러 위치에 되풀이되고 보조 연결 점선이 지나가므로, 축소 표시 시 서로 다른 보조도형을 하나의 연결 도형으로 오해하기 쉽다. 원본 SVG는 정상 렌더하며 수치 `AB=5`, `AC=4`, `AQ=√11` 및 구간 `3/1/2`는 개별 확대 시 읽힌다.
- 엔진 인계: 기존 `solutionImageAlt`·`solutionImageCaption`에 기술된 세 가지 도형의 목적을 유지하되, **주도형/BC 구간도/AQ 길이도**의 패널 또는 설명 라벨을 분리하고 중복 점명 간격을 개선. 파란·주황 구분 및 원래 길이/각 정보를 그대로 보존할 것.

### `대수c` 내부 제목 메타 참고 (이미지 결함에 합산하지 않음)

- 파일 `25_제일고_1학기_기말_고2_대수c.js`의 `window.examTitle`은 `25_제일고_1학기_기말_고2_수학I`로 되어 있다.
- 파일 `25_효천고_1학기_기말_고2_대수c.js`의 `window.examTitle`은 `25_효천고_1학기_기말_고2_대수`로 되어 있다.
- 이 둘은 파일명과 내부 표시 제목이 일치하지 않는다는 **사실 확인**이며 오류로 단정하지 않는다. 엔진이 시험지 표시·중복 매핑 정책을 확인한 뒤 필요할 때만 별도 처리한다. 본 시각 감사에서는 제목·JS 내용을 수정하지 않았다.

### `대수c` 25/25개 원본 실물 증거 대장 (일반 #1–#216과 별도 번호)

| # | 보충 JS 시험지 | Q | 이미지 원본 경로 | Git blob SHA | 검수 판정 |
|---:|---|---:|---|---|---|
| C01 | `25_제일고_1학기_기말_고2_대수c` | 02 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q2-solution-v2.svg` | `7edab45d23ee3341dbc0d2d8f24c31027dccd815` | `OBSERVED_NO_FLAG` |
| C02 | `25_제일고_1학기_기말_고2_대수c` | 03 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q3.png` | `ab42b7569a3aaf65f64ccd3d966c478e73ef99b7` | `OBSERVED_NO_FLAG` |
| C03 | `25_제일고_1학기_기말_고2_대수c` | 03 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q3-solution.svg` | `17df6824d47a4543db4b8378e219169dba61204d` | `OBSERVED_NO_FLAG` |
| C04 | `25_제일고_1학기_기말_고2_대수c` | 08 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q8-solution.svg` | `cdbc0701397da06837a1ecb4e1e38b4fe9201a15` | `OBSERVED_NO_FLAG` |
| C05 | `25_제일고_1학기_기말_고2_대수c` | 09 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q9.png` | `7c33b4b0c4f2ac4f09cda5fa3ad8a4eced433ed9` | `OBSERVED_NO_FLAG` |
| C06 | `25_제일고_1학기_기말_고2_대수c` | 09 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q9-solution.svg` | `a79fdfec1b4acd1224a18e3cd42e9e8fff1874f3` | `OBSERVED_NO_FLAG` |
| C07 | `25_제일고_1학기_기말_고2_대수c` | 10 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q10.png` | `c968d425931a0a75385b35d5cdaafe36ce283a84` | `OBSERVED_NO_FLAG` |
| C08 | `25_제일고_1학기_기말_고2_대수c` | 12 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q12.png` | `99196561f38a7939566456d64e7f0dbe45c1fa8e` | `OBSERVED_NO_FLAG` |
| C09 | `25_제일고_1학기_기말_고2_대수c` | 15 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q15-solution-v2.svg` | `8329ccd68c6401c144e13703e576e137449af562` | `OBSERVED_NO_FLAG` |
| C10 | `25_제일고_1학기_기말_고2_대수c` | 16 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q16.png` | `542c266f4d99c5ca6cf5ba86e4837b15882e2bea` | `OBSERVED_NO_FLAG` |
| C11 | `25_제일고_1학기_기말_고2_대수c` | 16 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q16-solution.svg` | `3a1690db387fc4dd7c728f53295657e3995b5e90` | `OBSERVED_NO_FLAG` |
| C12 | `25_제일고_1학기_기말_고2_대수c` | 17 | `archive/assets/images/25_제일고_1학기_기말_고2_수학I/q17.png` | `87addcdb35554cc946325a5d12d67b8f01102934` | `OBSERVED_NO_FLAG` |
| C13 | `25_제일고_1학기_기말_고2_대수c` | 17 | `archive/assets/images/25_제일고_1학기_기말_고2_대수c/q17-solution.svg` | `94abdb35b8853747d6f627ff9088c5a7f2eefb63` | `OBSERVED_NO_FLAG` |
| C14 | `25_효천고_1학기_기말_고2_대수c` | 05 | `archive/assets/images/25_효천고_1학기_기말_고2_대수/q5.png` | `0c7df92e572c996810cb2ecedb576bde990f81c9` | `OBSERVED_NO_FLAG` |
| C15 | `25_효천고_1학기_기말_고2_대수c` | 05 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q5-solution.svg` | `d94f133c5688def668c8f77ced8df55c4b2608be` | `OBSERVED_NO_FLAG` |
| C16 | `25_효천고_1학기_기말_고2_대수c` | 09 | `archive/assets/images/25_효천고_1학기_기말_고2_대수/q9.png` | `58e97b867c629bfb129d45f41c99d1d77b32eb99` | `OBSERVED_NO_FLAG` |
| C17 | `25_효천고_1학기_기말_고2_대수c` | 09 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q9-solution.svg` | `d2e1d9d0d305354f2d68095275951648bb57a14d` | `OBSERVED_NO_FLAG` |
| C18 | `25_효천고_1학기_기말_고2_대수c` | 14 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q14-solution.svg` | `24f4ced38a3df6855238d105e5aa448d4fb63ce8` | `OBSERVED_NO_FLAG` |
| C19 | `25_효천고_1학기_기말_고2_대수c` | 16 | `archive/assets/images/25_효천고_1학기_기말_고2_대수/q16.png` | `e11014c69395b22ffbac66f0a9b616999d28b21e` | `VISUAL_UPGRADE` |
| C20 | `25_효천고_1학기_기말_고2_대수c` | 16 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q16-solution.svg` | `e54f6998887245d3ef6a27b459536ead425519e7` | `OBSERVED_NO_FLAG` |
| C21 | `25_효천고_1학기_기말_고2_대수c` | 18 | `archive/assets/images/25_효천고_1학기_기말_고2_대수/q18.png` | `f64ea6718ac5a89ac6e3035466c7e53c47d99172` | `OBSERVED_NO_FLAG` |
| C22 | `25_효천고_1학기_기말_고2_대수c` | 18 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q18-solution.svg` | `286c97e2379948d2e94627962b0c7ffc9e5ab1a2` | `OBSERVED_NO_FLAG` |
| C23 | `25_효천고_1학기_기말_고2_대수c` | 21 | `archive/assets/images/25_효천고_1학기_기말_고2_대수/q21.png` | `eb966886dd7d44e7bd7fcd94cf141a278dd76763` | `OBSERVED_NO_FLAG` |
| C24 | `25_효천고_1학기_기말_고2_대수c` | 21 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q21-solution.svg` | `24160b8849981cbd6dbc0eed85f44a85be3d76cd` | `VISUAL_UPGRADE` |
| C25 | `25_효천고_1학기_기말_고2_대수c` | 23 | `archive/assets/images/25_효천고_1학기_기말_고2_대수c/q23-solution-v2.svg` | `e9def5028ca6ef37b218756a946c769796f350da` | `OBSERVED_NO_FLAG` |

## 전수 검수 완료 및 누적 경계

- **일반 1학기 기말 이미지 검수 종료:** 원본 JS **32/32개·723/723문항**, 직접 참조 이미지 **328/328개(PNG 128/SVG 200) 전수 실물 시각 검수 완료**. 이전 1~4차 280개 + 이번 5차 48개, 잔여 0개. 2020~2019년 미검수 시험지 5개도 모두 이번 차수에서 마감.
- 별도 보충 `대수c` **2개·46문항·25이미지(PNG 11/SVG 14) 25/25개 검수 완료**, 개선 예약 2건. 일반 기말 32개·328이미지 분모와 엄격히 구분하며 중복 집계하지 않는다.
- 이전 1학기 중간: **51개 시험지·370개 이미지 실물 판독 완료**, 시각/정합성 예약 **7건**(`1MID_IMAGE_VISUAL_AUDIT_20261122.md`).
- **대수 1학기 중간+기말 일반 전체:** 이미지 **698/698개(370+328, 100%)** 검수 완료. 일반 기말 개선·HOLD 예약 **27건(개선 19·HOLD 8)**이며 중간 7건과 합치면 서로 다른 이미지 기준 **34건**.
- **`대수c` 별도 포함 확대 집계:** 이미지 **723/723개(370+328+25, 100%)** 검수 완료, 미검수 **0개**. 개선·HOLD 예약 **총 36건**(중간 7 + 기말 일반 27 + `대수c` 2). `대수c` 내부 시험지 제목 메타 2건은 이미지 결함 통계에 포함하지 않음.
- **엔진 인계 필요:** 일반 기말 `VISUAL_HOLD_READABILITY` 8개 자산의 고해상도 출제 원본 대조·시각 복구를 우선 수행하고, `VISUAL_UPGRADE` 19개는 원본 근거 재크롭·배경 노이즈 제거·라벨/음영 개선을 예약. 중간·`대수c`의 별도 예약도 해당 MD 근거로 이관.
- 본 MD는 **원본 실물 확인에 따른 결함 예약 기록**이며 이미지 수정·정답 변경·JS 패치·`main` 병합은 수행하지 않았다. 엔진 교정, 학생 실제 UI 렌더, 전체 preflight, Golden/Negative, 배포·출고 검증은 `NOT_RUN`. 시각 감사 완료가 학생 서비스의 출고 승인을 뜻하지 않는다.
