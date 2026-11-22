# lane30 고2 대수/구 수학Ⅰ 1학기 기말 이미지 전수 검수 — 누적 대장 (2026-11-22)

- branch: `work/solution-upgrade-lane-30-20261121`
- source: `archive/exams/original/high/h2/1final/*.js`; 직접 참조 `archive/assets/images/**` PNG/SVG
- 대상: 일반 대수/수학Ⅰ 32개 원본 JS, **723문항·고유 이미지 328개(PNG 128/SVG 200)**. `25_제일고_..._대수c.js` 및 `25_효천고_..._대수c.js` **2개·46문항·25이미지**는 일반 32개와 구별하여 후속 보충 묶음으로 예약, 대상 누락 방지.
- **현재 상태: 1차 8/32개 시험지, 이미지 85/328개 실물 시각 검수 완료**; 일반 대상 미검수 24개 시험지·243개 이미지, 보충 2개·25개 이미지 미검수.
- 이번 실물 증거: 원본 GitHub blob 85개 각각 SHA 확보. PNG 30개 중 29개 파일 원본 디코딩·표시, **1개(2026 순천고 Q18, 1.01MB)**는 GitHub 파일 Contents 응답 본문이 비어 별도 GitHub 웹 페이지의 실물 이미지를 직접 화면 확인(도형·점·수선·60도·길이 5/8 판독). SVG 55개 모두 XML 원본 수신→Inkscape PNG 렌더 성공→7매 연락시트 및 의심 원본 개별 확인. **실물 미확인 0/85, SVG 렌더 실패 0/55**.
- 1차 판정: `OBSERVED_NO_FLAG` **83**, `VISUAL_UPGRADE` **1**, `VISUAL_HOLD_READABILITY` **1**. `OBSERVED_NO_FLAG`는 관찰 범위에서 특이사항이 없다는 뜻이지 학생 UI/운영 출고 PASS가 아니다.
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

## 이어지는 작업 및 누적 경계

- 2차 예정: 8개 시험지·87개 이미지(2024 강남여고 1개, 2023년 6개, 2022 효천고 1개), 동일한 전수 실물 검수·MD 기록만 수행.
- 1학기 기말 일반 32개가 끝난 후 `대수c` 2개(25개 이미지)를 별도 묶음 검수.
- 전 단계 1학기 중간: **51개 시험지·370개 참조 이미지 실물 판독 기록 완료, 시각/정합성 예약 7건**(`1MID_IMAGE_VISUAL_AUDIT_20261122.md`). 이번 기말 1차의 이미지 예약 2건은 그 7건에 합산 중복하지 않음.
- 대수 1학기 중간+기말 일반 전체: **고유 이미지 698개(370+328)**, 현재 **455개 검수(370+85)**, 남은 기말 이미지 **243개**. `대수c` 보충 후보 25개는 이 일반 분모에서 제외하고 별도 집계.
- 최종 작업 범위: 본 MD는 시각 감사 예약 문서일 뿐, 엔진 교정·운영 병합의 증거 또는 출고 승인서가 아님.
