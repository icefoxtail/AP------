# lane40 고2 확통 2학기 — 실물 시각검수 5차 (중간 잔여 14장 전수 마감)

- **기준일:** 2026-11-22 KST. 저장소 `icefoxtail/AP------`; 시험지·이미지 실물 `main`, 문서 기록 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- **범위:** 고2 확률과 통계 2학기 중간고사 남은 **14개 기출 시험지, 303문항**(2023년 5장·2022년 3장·2020년 3장·2019년 3장). 기말과 타 과목·유사시험지 제외.
- 문항 JS의 `image`, `images`, HTML `<img src>`, `solutionImage` 전수 집계. 원문 PNG 참조 **38회** 중 중복 필드/HTML 참조를 접어 실제 **서로 다른 원본 PNG 28개**, 해설 **SVG 25개**, 총 **53개 실물 파일**을 확인.
- **SVG 25/25 정상 XML 파싱 + `viewBox` + Inkscape 너비 1000px PNG 렌더**, **원본 PNG 28/28 ImageMagick 디코드 성공**. 시험지별 16개 접촉시트와 특정 원본·SVG 단독 1000px 확대를 육안 검수.
- **렌더 오류·빈 그림·실물 누락·확정적 프레임 잘림 0건.** 해설 SVG의 개념상 예시 표기 **1건(WARN)**, 작은 화면 별도 시험 **3건(WATCH)**, SVG 루트 설명 태그 형식 일관성 **3건(NOTE)**. 실제 320~360px 화면·PDF 인쇄는 수행하지 않았다.
- **중요 범위 한정:** 시각검수 완료는 기존 텍스트/수학 감사의 UPGRADE 수정 반영이나 학생용 최종 출고 승인을 뜻하지 않는다. 이번 배치에서 JS·SVG·PNG 원본은 수정하지 않았다.

## 이번 14개 시험지 개별 집계

| # | 기출 시험지 | 문항 | 해설 SVG | 원본 PNG | 대표 시각 판정 |
|---:|---|---:|---:|---:|---|
| 1 | [2023 금당고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 18 | 1/1 | 3/3 | 실물 렌더·판독 OK |
| 2 | [2023 매산여고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 22 | 1/1 | 1/1 | 실물 렌더·판독 OK |
| 3 | [2023 복성고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 20 | 1/1 | 9/9 | Q16 그림 예시 WARN |
| 4 | [2023 순천고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/23_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 22 | 2/2 | 1/1 | Q14 모바일 WATCH |
| 5 | [2023 제일고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 24 | 1/1 | 7/7 | 실물 렌더·판독 OK |
| 6 | [2022 복성고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 20 | 2/2 | 0/0 | 실물 렌더·판독 OK |
| 7 | [2022 순천고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 21 | 1/1 | 1/1 | 실물 렌더·판독 OK |
| 8 | [2022 효천고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 24 | 0/0 | 1/1 | 실물 렌더·판독 OK |
| 9 | [2020 매산고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 19 | 2/2 | 0/0 | SVG 태그 방식 NOTE |
| 10 | [2020 매산여고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 23 | 3/3 | 0/0 | 실물 렌더·판독 OK |
| 11 | [2020 제일고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/20_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 22 | 1/1 | 0/0 | SVG 태그 방식 NOTE |
| 12 | [2019 매산여고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 22 | 2/2 | 1/1 | 실물 렌더·판독 OK |
| 13 | [2019 복성고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 24 | 5/5 | 4/4 | Q11·Q24 모바일 WATCH |
| 14 | [2019 제일고 중간](https://github.com/icefoxtail/AP------/blob/main/archive/exams/original/high/h2/2mid/19_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84.js) | 22 | 3/3 | 0/0 | 실물 렌더·판독 OK |
| **합계** | **14장** | **303** | **25/25** | **28/28** | **렌더 실패 0** |

## 검수 발견 사항 및 후속 권고

### VQA-05-01 · 2023 복성고 중간 Q16 — 확률밀도함수의 비정규화 예시 도식 (VISUAL_CONCEPT_WARN)

- 파일: [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg). 원본 [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png).
- 원문은 꼭짓점 `(-a,0), (0,a), (2a,0)`의 삼각형 모양 확률밀도함수로 `P(0≤X≤a)`를 구하는 문항. SVG는 가로축 `-1,0,1,2`, 최고 높이 `1`에 `f(x)`를 붙인 **a=1 예시**다.
- 이 좌표를 **실제 확률밀도함수 값**으로 읽으면 삼각형 전체 넓이가 `(3×1)/2=1.5`가 되어 확률밀도함수의 면적 1 조건과 맞지 않는다. JS의 `solutionImageCaption`은 'a=1일 때의 모양(예)'이라고 부연하므로 **해설 계산의 오류라고 단정할 사항은 아니며**, 독립 그림의 교육적 표기 위험으로 분리했다.
- 권고: 그림을 `-a,0,a,2a` 및 높이 `a`로 표시하거나, 정규화 조건 `3a²/2=1`을 만족하는 수치로 축을 재작성. 개형만 보여 주려면 SVG 안에 '비율 설명용 개형(정규화된 함수 아님)'이라고 명시. 수정 후 재렌더와 확률 면적 대조.

### VQA-05-02 · 모바일 축소 가독성 실기 재검증 (WATCH, 미실행)

- **2023 복성고 Q11** [`q11.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11.png): 하나의 PNG 안에 작은 정규곡선 비교 그림 **5개**가 들어 있어 실제 좁은 화면에서 곡선 차이 판별이 어려울 수 있음.
- **2023 순천고 Q14** [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution-v2.svg): 정규분포 곡선 **2개를 세로 배치**하고 비교하는 도식. 1000px 렌더에서는 판독되었으나 모바일 UI 배율 미검증.
- **2019 복성고 Q24** [`q24.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24.png): 591×124px의 **얇은 수직 높이 원본 스캔**으로, 가로 고정 너비 축소 시 숫자·눈금 가독성 재확인 권고.
- 위 항목은 모두 원본 크기 또는 1000px 확대에서 판독 가능했다. **실제 모바일에서 깨짐/잘림 확정이 아니며**, UI 확대·가로 스크롤/인쇄 배율 검증이 남았다.

### VQA-05-03 · SVG 제목·설명 태그 형식 통일 검토 (NOTE, 접근성 실패 아님)

- **2020 매산고 Q12** [`q12-grid-distance.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/solutions/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-grid-distance.svg), **Q14** [`q14-density-tail.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/solutions/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-density-tail.svg), **2020 제일고 Q17** [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/q17-solution.svg).
- 이 3개 SVG는 독립 `<title>`/`<desc>` 자식이 없지만 루트 `role="img"`와 구체적인 `aria-label`이 **이미 존재**한다. 접근성 대체설명 누락·픽셀 렌더 오류로 기록하지 않고, 다른 22개 SVG의 `title`·`desc` 방식과 맞출지 선택적으로 검토.
- SVG 25개 전체에 외부 HTTP/file 이미지 참조 없음.

### VQA-05-04 · 자산 폴더 위치 별도 확인

- 총 53개 중 `archive/assets/images/`의 대응 학교별 디렉터리에서 **50개** 실물 확인. 아래 **3개 SVG는 저장소 루트 경로**에 있었으며 404가 아닌 실제 바이트 취득·렌더링에 성공했다.
- 2020 매산고 Q12 `assets/solutions/20_매산고_2학기_중간_고2_확률과통계/q12-grid-distance.svg` / Q14 `assets/solutions/20_매산고_2학기_중간_고2_확률과통계/q14-density-tail.svg`; 2020 제일고 Q17 `assets/q17-solution.svg`.
- 원본 자산 참조와 실제 저장소 경로의 대응은 확인됐다. 추후 경로 정리 시 JS 참조를 임의로 변경하지 말고 자산 이동과 URL 변경을 한 작업으로 검증해야 한다.

## 대표 문항 대조 기록

- **2023 금당고 Q04:** 원본 계단형 4×2 도로망과 해설 정점별 경로 수를 비교. **Q08** 조합 삼각형, **Q10** 직육면체 스캔 모두 확인.
- **2023 매산여고 Q06:** 평균·분산이 다른 두 정규곡선 PNG, **Q19** 삼각형 밀도해설 SVG의 `3`과 `9/2` 음영을 읽었다.
- **2023 복성고 Q07/Q10/Q11/Q13–Q16/Q19/Q20:** 이산분포 표 2개, 정규곡선 선택 그림, 두 종류의 표준정규표, 복합 선택지 캡처, 삼각 밀도 원본과 Q16 SVG를 대조.
- **2023 순천고 Q03:** 원본 기울어진 삼각 밀도함수를 해설의 꼭짓점 `(2,1/4)`, 경계 `8`과 비교. **Q14** 두 정규곡선의 확률 영역 단독 판독.
- **2023 제일고 Q04/Q13/Q14/Q16/Q18/Q21/Q24:** 문제별 표준정규표 실물(일부는 1.5/2.0행만) 확인. **Q03** 선형밀도 SVG의 `[0,2]` 전체 음영 확인.
- **2022 복성고 Q07/Q12:** 증가형 삼각 밀도와 V자형 밀도에서 축 숫자·음영 읽음. **2022 순천고 Q17:** 4×3 도로망 원본/경로 수 SVG 대조. **2022 효천고 Q07:** 꼭짓점 `x=2`, 경계 `x=5`의 구간별 밀도 원본 확인.
- **2020 매산고 Q12/Q14:** 격자 간 거리1인 쌍 12개, 선형 밀도 꼬리면적 1/4의 실제 루트 SVG 확인. **2020 매산여고 Q07/Q12/Q22:** 삼각·V자 밀도와 베른 도형의 분수 주석 육안 확인. **2020 제일고 Q17:** 삼각 밀도와 반대쪽 누적확률 7/8을 그림과 주석에서 분리 판독.
- **2019 매산여고 Q03/Q11:** 삼각형 밀도 원본·해설 및 `[1,3]` 균등분포 음영. **2019 복성고 Q04/Q05/Q07/Q11/Q12/Q14/Q15/Q24:** 계단형 도로망, 집합도, 확률나무, 밀도함수, 원본 정규곡선/점열 실물 대조. **2019 제일고 Q09/Q15/Q22:** 선형 밀도, 벤다이어그램, `m±σ` 정규곡선 확인.

## 해설 SVG 25개 — 파일별 원장

`RENDER_OK`: XML 유효·viewBox 존재·픽셀 렌더와 육안 판독. `VISUAL_CONCEPT_WARN`: 위 Q16. `ARIA_LABEL_OK`는 독립 title/desc 없이 접근성 aria-label을 제공하는 예외.

| 시험지 | 문항 | 해설 SVG 실물 (`main`) | 판정 |
|---|---|---|---|
| 2023 금당고 | Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | RENDER_OK |
| 2023 매산여고 | Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | RENDER_OK |
| 2023 복성고 | Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | RENDER_OK · VISUAL_CONCEPT_WARN |
| 2023 순천고 | Q03 | [`q3-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution.svg) | RENDER_OK |
| 2023 순천고 | Q14 | [`q14-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution-v2.svg) | RENDER_OK |
| 2023 제일고 | Q03 | [`q3-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution.svg) | RENDER_OK |
| 2022 복성고 | Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | RENDER_OK |
| 2022 복성고 | Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | RENDER_OK |
| 2022 순천고 | Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | RENDER_OK |
| 2020 매산고 | Q12 | [`q12-grid-distance.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/solutions/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-grid-distance.svg) | RENDER_OK · ARIA_LABEL_OK |
| 2020 매산고 | Q14 | [`q14-density-tail.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/solutions/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-density-tail.svg) | RENDER_OK · ARIA_LABEL_OK |
| 2020 매산여고 | Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | RENDER_OK |
| 2020 매산여고 | Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | RENDER_OK |
| 2020 매산여고 | Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | RENDER_OK |
| 2020 제일고 | Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/assets/q17-solution.svg) | RENDER_OK · ARIA_LABEL_OK |
| 2019 매산여고 | Q03 | [`q3-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution.svg) | RENDER_OK |
| 2019 매산여고 | Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | RENDER_OK |
| 2019 복성고 | Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | RENDER_OK |
| 2019 복성고 | Q05 | [`q5-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution-v2.svg) | RENDER_OK |
| 2019 복성고 | Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | RENDER_OK |
| 2019 복성고 | Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | RENDER_OK |
| 2019 복성고 | Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | RENDER_OK |
| 2019 제일고 | Q09 | [`q9-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution-v2.svg) | RENDER_OK |
| 2019 제일고 | Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | RENDER_OK |
| 2019 제일고 | Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | RENDER_OK |

## 원본 PNG 28개 — 파일별 원장

`DECODE_OK`: 실제 파일 정상 열림. `MOBILE_WATCH`: 좁은 화면 실기 확인 대상.

| 시험지 | 문항 | 원본문제 PNG 실물 (`main`) | 판정 |
|---|---|---|---|
| 2023 금당고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | DECODE_OK |
| 2023 금당고 | Q08 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | DECODE_OK |
| 2023 금당고 | Q10 | [`q10.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10.png) | DECODE_OK |
| 2023 매산여고 | Q06 | [`q6.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6.png) | DECODE_OK |
| 2023 복성고 | Q07 | [`q7.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7.png) | DECODE_OK |
| 2023 복성고 | Q10 | [`q10.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10.png) | DECODE_OK |
| 2023 복성고 | Q11 | [`q11.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11.png) | DECODE_OK · MOBILE_WATCH |
| 2023 복성고 | Q13 | [`q13.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13.png) | DECODE_OK |
| 2023 복성고 | Q14 | [`q14.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14.png) | DECODE_OK |
| 2023 복성고 | Q15 | [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png) | DECODE_OK |
| 2023 복성고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | DECODE_OK |
| 2023 복성고 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | DECODE_OK |
| 2023 복성고 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | DECODE_OK |
| 2023 순천고 | Q03 | [`q3.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3.png) | DECODE_OK |
| 2023 제일고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | DECODE_OK |
| 2023 제일고 | Q13 | [`q13.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13.png) | DECODE_OK |
| 2023 제일고 | Q14 | [`q14.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14.png) | DECODE_OK |
| 2023 제일고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | DECODE_OK |
| 2023 제일고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | DECODE_OK |
| 2023 제일고 | Q21 | [`q21.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21.png) | DECODE_OK |
| 2023 제일고 | Q24 | [`q24.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24.png) | DECODE_OK |
| 2022 순천고 | Q17 | [`q17.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17.png) | DECODE_OK |
| 2022 효천고 | Q07 | [`q7.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7.png) | DECODE_OK |
| 2019 매산여고 | Q03 | [`q03.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q03.png) | DECODE_OK |
| 2019 복성고 | Q04 | [`q04.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q04.png) | DECODE_OK |
| 2019 복성고 | Q07 | [`q07.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q07.png) | DECODE_OK |
| 2019 복성고 | Q15 | [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png) | DECODE_OK |
| 2019 복성고 | Q24 | [`q24.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24.png) | DECODE_OK · MOBILE_WATCH |

## lane40 고2 확통 2학기 전체 시각검수 마감

| 단계 | 시험지 | 문항 | 실제 SVG | 원본 PNG |
|---|---:|---:|---:|---:|
| 1차 기말 | 5 | 116 | 61 | 18 |
| 2차 기말 | 10 | 221 | 115 | 21 |
| 3차 기말 8 + 중간 2 | 10 | 215 | 108 | 19 |
| 4차 중간 | 5 | 115 | 15 | 21 |
| **5차 중간 전량 마감** | **14** | **303** | **25** | **28** |
| **누적** | **44/44** | **970** | **324** | **107** |

- **2학기 기말 23/23장, 2학기 중간 21/21장: 모두 실물 시각 QA 완료.** 그림 렌더링 완료와 해설의 학생용 오류 수정/출고 승인은 별개.
- 3차의 `solutionImage` PNG 별칭 1건은 실제 SVG 집계에서 제외하고 원본 PNG에 포함. 따라서 3차 실제 SVG 108이며, 누적 수치 **324개**는 실제 SVG만 계산.
- 원본 JS·SVG·PNG 수정 없음; **문서만 신규 GitHub 커밋**. 후속 수정 대상은 각 배치 VQA WARN 및 기존 텍스트 UPGRADE 장부에서 추적.
