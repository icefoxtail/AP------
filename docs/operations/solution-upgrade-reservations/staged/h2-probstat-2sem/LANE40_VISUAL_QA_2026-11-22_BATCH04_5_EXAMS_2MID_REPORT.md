# lane40 고2 확률과 통계 2학기 중간 — 실물 시각검수 4차 (5장 / 115문항)

- 기준일 **2026-11-22 KST** · 자산 기준 `main` · 기록 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 직전 3차에서 기말 전량 23장과 중간 2장을 시각검수한 뒤, **중간 다음 5장**(2025 금당고·순천고·제일고, 2024 매산여고, 2023 강남여고) 진행.
- 원문 JS 5개에서 115문항의 `image`/`images`/문항 HTML 이미지와 `solutionImage` 참조를 추출해 **원본 PNG 21개, 해설 SVG 15개**를 GitHub `main`의 `archive/assets/images/`에서 실물 취득.
- SVG **15/15 Inkscape 너비 1000px 렌더 성공**, PNG **21/21 ImageMagick 디코드 성공**. 각 시험지 그림을 11개 접촉시트로 펼치고 원본·해설 연결 문항은 비교, 예외 후보 원본을 단독 확대 확인.
- SVG **15/15 유효 XML·루트 `viewBox`**, 루트 `<title>`·`<desc>`·ARIA/role 설명 **15/15 존재**. 렌더 오류·빈 화면·확정적 프레임 잘림 **0건**.
- 이 배치에서 발견된 것은 원본 PNG **가로로 긴 스캔 자료 5개에 대한 작은 화면 가독성 위험(WATCH)**이다. 원본의 실제 잘림·파손은 확인되지 않았다. **문항·해설의 정오 판정과 학생용 출고 승인은 별도**.

## 시험지별 검수 집계

| # | 시험지 | 전체 문항 | 해설 SVG | 원본문제 PNG | 시각검수 결과 |
|---:|---|---:|---:|---:|---|
| 1 | 2025 금당고 중간 | 20 | 6/6 | 3/3 | 렌더·이미지 판독 OK |
| 2 | 2025 순천고 중간 | 24 | 2/2 | 4/4 | 렌더·이미지 판독 OK |
| 3 | 2025 제일고 중간 | 23 | 1/1 | 11/11 | 렌더·이미지 판독 OK · PNG 3건 WATCH |
| 4 | 2024 매산여고 중간 | 23 | 1/1 | 2/2 | 렌더·이미지 판독 OK · PNG 1건 WATCH |
| 5 | 2023 강남여고 중간 | 25 | 5/5 | 1/1 | 렌더·이미지 판독 OK · PNG 1건 WATCH |
| **합계** | **5장** | **115** | **15/15** | **21/21** | **실물 렌더 실패 0** |

## 분리 기록한 시각 이슈

### VQA-04-01 · 가로로 긴 원본 PNG의 모바일 가독성 (WATCH, 미검증)

- **2025 제일고 Q02** `q2.png`: 1650×335px(가로/세로 4.93), 확률분포 표. **Q05** `q5.png`: 2270×355px(6.39), 확률표. **Q16** `q16.png`: 2050×305px(6.72), 가로로 배치한 숫자 카드 5개.
- **2024 매산여고 Q07** `q7.png`: 718×153px(4.69), 이산분포 확률표. **2023 강남여고 Q18** `q18.png`: 1075×383px(2.81), 두 말풍선의 비교적 작은 한글 문장.
- 원본 해상도에서는 숫자·문장을 읽을 수 있었다. 특히 **제일고 Q16의 카드 상자 테두리는 원본 자체의 회색 대비가 약해서** 520px 접촉시트에서 선이 흐리게 보였다. 확대 시 상자 5개와 숫자 `1,1,2,2,4` 판독은 가능했다.
- 사용자 화면이 이미지를 화면 너비 320~360px로 강제 축소하면서 확대/스크롤을 제공하지 않는다면 작은 글씨가 읽기 어려워질 위험이 있다. **실제 모바일 브라우저 UI를 시험하지 않았으므로 실패 확정이 아닌 WATCH**.
- 권고: 제품 화면에서 실제 CSS 이미지 확대/가로 스크롤 가능 여부 검증, 필요하면 보존형 고대비 재제작 또는 표/카드의 SVG 재구성. 이 차수에서는 원본을 수정하지 않음.

### VQA-04-02 · SVG 접근성 및 렌더 점검 (OK)

- `solutionImage` 15개 모두 XML SVG이며 파싱·`viewBox`·렌더링 성공. 15개 모두 SVG 루트에 제목·설명·접근성 역할/연결이 있다.
- 2025 금당고 Q09: 원본 3×3 도로망과 해설의 정점별 경로 수 표기를 비교. 2025 순천고 Q16: 원본 사다리꼴 밀도함수와 해설의 `[0,5]` 음영을 비교. 2025 제일고 Q06: 선형 밀도함수의 `1,3,6` 좌표와 음영 표시를 읽었다.
- 2024 매산여고 Q11과 2023 강남여고 Q09는 분수 확률나무의 가지와 끝단 곱을 육안 판독. 2023 강남여고 Q14/Q15/Q21/Q22의 집합·도형 SVG에서 빈 화면·프레임 밖 배치는 관찰되지 않았다.

## 해설 SVG 15개 — 문항별 실제 렌더 원장

| 시험지 | 문항 | GitHub `main` 실물 SVG | 판정 |
|---|---|---|---|
| 2025 금당고 | Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 금당고 | Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 금당고 | Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 금당고 | Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 금당고 | Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 금당고 | Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 순천고 | Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 순천고 | Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2025 제일고 | Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2024 매산여고 | Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2023 강남여고 | Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2023 강남여고 | Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2023 강남여고 | Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2023 강남여고 | Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |
| 2023 강남여고 | Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | RENDER_OK · XML_OK · A11Y_OK |

## 원본문제 PNG 21개 — 실제 디코드 원장

| 시험지 | 문항 | GitHub `main` 실물 PNG | 판정 |
|---|---|---|---|
| 2025 금당고 | Q01 | [`q01_round_table.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q01_round_table.png) | DECODE_OK |
| 2025 금당고 | Q02 | [`q02_fire_table.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q02_fire_table.png) | DECODE_OK |
| 2025 금당고 | Q09 | [`q09_road_grid.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q09_road_grid.png) | DECODE_OK |
| 2025 순천고 | Q03 | [`q3.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3.png) | DECODE_OK |
| 2025 순천고 | Q12 | [`q12.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12.png) | DECODE_OK |
| 2025 순천고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | DECODE_OK |
| 2025 순천고 | Q17 | [`q17.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17.png) | DECODE_OK |
| 2025 제일고 | Q02 | [`q2.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2.png) | DECODE_OK · MOBILE_WATCH |
| 2025 제일고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | DECODE_OK |
| 2025 제일고 | Q05 | [`q5.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5.png) | DECODE_OK · MOBILE_WATCH |
| 2025 제일고 | Q09 | [`q9.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9.png) | DECODE_OK |
| 2025 제일고 | Q11 | [`q11.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11.png) | DECODE_OK |
| 2025 제일고 | Q12 | [`q12.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12.png) | DECODE_OK |
| 2025 제일고 | Q13 | [`q13.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13.png) | DECODE_OK |
| 2025 제일고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | DECODE_OK · MOBILE_WATCH |
| 2025 제일고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | DECODE_OK |
| 2025 제일고 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | DECODE_OK |
| 2025 제일고 | Q23 | [`q23.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23.png) | DECODE_OK |
| 2024 매산여고 | Q02 | [`q2.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2.png) | DECODE_OK |
| 2024 매산여고 | Q07 | [`q7.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7.png) | DECODE_OK · MOBILE_WATCH |
| 2023 강남여고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | DECODE_OK · MOBILE_WATCH |

## 이번 차수 마감 / 누적 현황

- 이번 4차 **5장·115문항·SVG 15개·PNG 21개** 시각검수 원장 작성. 원본 JS·SVG·PNG **변경 없음**.
- 누적(1~4차): **30/44장, 667문항, 실제 SVG 299개, 원본 PNG 79개**. 고2 확통 **2학기 기말 23/23장**, **2학기 중간 7/21장** 시각검수 완료; 다음 시각검수 대기 **중간 14장**.
- 기존 텍스트·수학 감사의 UPGRADE 판정은 이 렌더 성공과 별개로 관리한다. 아직 적용되지 않은 해설 수정·제품 모바일 실기 검증을 완료한 것으로 표시하지 않는다.
