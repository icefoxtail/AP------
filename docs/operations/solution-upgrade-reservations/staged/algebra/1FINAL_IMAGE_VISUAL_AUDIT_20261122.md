# lane30 고2 대수/구 수학Ⅰ 1학기 기말 이미지 전수 검수 — 누적 대장 (2026-11-22)

- branch: `work/solution-upgrade-lane-30-20261121`
- source: `archive/exams/original/high/h2/1final/*.js`; 직접 참조 `archive/assets/images/**` PNG/SVG
- 대상: 일반 대수/수학Ⅰ 32개 원본 JS, **723문항·고유 이미지 328개(PNG 128/SVG 200)**. `25_제일고_..._대수c.js` 및 `25_효천고_..._대수c.js` **2개·46문항·25이미지**는 일반 32개와 구별하여 후속 보충 묶음으로 예약, 대상 누락 방지.
- **현재 상태: 2차까지 16/32개 시험지, 이미지 172/328개 실물 시각 검수 완료**; 일반 대상 미검수 **16개 시험지·156개 이미지**, 보충 `대수c` 2개·25개 이미지 미검수.
- 1차 실물 증거: 원본 GitHub blob 85개 각각 SHA 확보. PNG 30개 중 29개 파일 원본 디코딩·표시, **1개(2026 순천고 Q18, 1.01MB)**는 GitHub 파일 Contents 응답 본문이 비어 별도 GitHub 웹 페이지의 실물 이미지를 직접 화면 확인(도형·점·수선·60도·길이 5/8 판독). SVG 55개 모두 XML 원본 수신→Inkscape PNG 렌더 성공→7매 연락시트 및 의심 원본 개별 확인. **실물 미확인 0/85, SVG 렌더 실패 0/55**.
- 1차 판정: `OBSERVED_NO_FLAG` **83**, `VISUAL_UPGRADE` **1**, `VISUAL_HOLD_READABILITY` **1**.
- **2차 실물 증거: 신규 원본 GitHub blob 87개(각 SHA) 수신, PNG 34개 디코딩·확대 관찰, SVG 53개 XML 수신·렌더·시각 확인. 8매 연락시트와 의심 원본 단독 확대 확인. 미확인 0/87, SVG 렌더 실패 0/53.**
- **2차 판정: `OBSERVED_NO_FLAG` 82, `VISUAL_UPGRADE` 2, `VISUAL_HOLD_READABILITY` 3. 누적 일반 기말: `OBSERVED_NO_FLAG` **165**, `VISUAL_UPGRADE` **3**, `VISUAL_HOLD_READABILITY` **4** (총 172).** `OBSERVED_NO_FLAG`는 관찰 범위에서 주요 이상을 발견하지 못했다는 뜻이지 학생 UI/운영 출고 PASS가 아니다.
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

## 이어지는 작업 및 누적 경계

- 3차 예정: 일반 기말 미검수 16개 중 다음 8개 시험지를 원본 참조 목록과 대조해 전수 시각 검수·MD 기록만 수행(정확한 이미지 수는 착수 시 재확인).
- 1학기 기말 일반 32개가 끝난 후 `대수c` 2개(25개 이미지)를 별도 묶음 검수.
- 전 단계 1학기 중간: **51개 시험지·370개 참조 이미지 실물 판독 기록 완료, 시각/정합성 예약 7건**(`1MID_IMAGE_VISUAL_AUDIT_20261122.md`). 기말 1~2차의 이미지 예약 **7건**은 중간 7건과 별개이며 중복 집계하지 않음.
- 대수 1학기 중간+기말 일반 전체: **고유 이미지 698개(370+328)**, 현재 **542개 검수(370+172, 약 77.7%)**, 남은 일반 기말 이미지 **156개**. 중간 예약 7건+기말 예약 7건=**서로 다른 이미지 기준 14건**(개선 3/가독성 HOLD 4는 기말만). `대수c` 보충 후보 25개는 일반 분모에서 제외하고 별도 집계.
- 최종 작업 범위: 본 MD는 시각 감사 예약 문서일 뿐, 엔진 교정·운영 병합의 증거 또는 출고 승인서가 아님.
