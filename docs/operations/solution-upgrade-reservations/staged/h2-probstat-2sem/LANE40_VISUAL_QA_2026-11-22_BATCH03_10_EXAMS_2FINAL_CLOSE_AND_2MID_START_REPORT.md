# lane40 고2 확통 2학기 — 실물 시각검수 3차 (기말 8장 마감 + 중간 2장 시작)

- 기준일: **2026-11-22 KST**. 자산 기준: GitHub `main`. 검수 보고서 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 범위: 기존 기말 8개 시험지 170문항 + 중간 2개 시험지 45문항 = **10장·215문항**.
- 총 `solutionImage` 참조 **109개** 중 실제 SVG **108개**, **원본문제 PNG 19개**. 나머지 해설 참조 1개는 SVG가 아니라 **원본문제 PNG로 연결된 별칭**이며 중복 다운로드·성공 수에 합산하지 않았다.
- 실제 SVG 108개를 **Inkscape 너비 1000px**로 렌더링, XML 루트/viewBox 확인, 원본문제 PNG 19개 디코드, 시험지별 **27장 접촉시트(contact sheet)**와 이슈 후보의 단독 확대 화면을 확인.
- **결론:** 진짜 SVG **108/108 렌더 성공**, 원본 PNG **19/19 판독 성공**, 렌더 오류·빈 그림·확정적 프레임 잘림 **0건**. 도식의 설명상 오독 가능성 **1건(REVIEW)**, PNG 해설 별칭 **1건(ASSET_ALIAS)**, SVG 자체 접근성 메타데이터 누락 **1건(A11Y_WARN)**, 모바일 소형 표시 미검증 **6건(WATCH)**.
- 검수는 그림의 로딩·판독과 원문 대비 표현을 확인하는 **시각 QA**다. 기존 텍스트·수학 감사에서 분류한 UPGRADE 사항을 재판정하거나 학생용 출고를 승인한 것은 아니다.

## 시험지별 검수 집계

| # | 시험지 | 문항 | 실제 해설 SVG | 원본 PNG | PNG 해설 별칭 | 화면 판정 |
|---:|---|---:|---:|---:|---:|---|
| 1 | 2021 효천고 기말 | 24 | 14/14 | 2/2 | 0 | Q03 도식 표기 REVIEW |
| 2 | 2020 매산여고 기말 | 23 | 12/12 | 0/0 | 0 | 시각 렌더 OK |
| 3 | 2020 매산고 기말 | 19 | 9/9 | 2/2 | 0 | 시각 렌더 OK |
| 4 | 2019 매산고 기말 | 19 | 9/9 | 5/5 | 1 | Q15 PNG 별칭 |
| 5 | 2019 순천고 기말 | 21 | 17/17 | 1/1 | 0 | 시각 렌더 OK |
| 6 | 2019 복성고 기말 | 20 | 11/11 | 1/1 | 0 | 시각 렌더 OK |
| 7 | 2019 매산여고 기말 | 22 | 14/14 | 0/0 | 0 | 시각 렌더 OK |
| 8 | 2019 금당고 기말 | 22 | 12/12 | 2/2 | 0 | 시각 렌더 OK |
| 9 | 2026 순천고 중간 | 24 | 5/5 | 3/3 | 0 | 시각 렌더 OK |
| 10 | 2026 제일고 중간 | 21 | 5/5 | 3/3 | 0 | Q12 A11Y_WARN |
| **계** | **기말 8 + 중간 2** | **215** | **108/108** | **19/19** | **1** | **0건 렌더 실패** |

## 분리 기록한 이슈

### VQA-03-01 — 2021 효천고 기말 Q03: 도식의 x축 눈금 순서가 조건 이상을 암시 (REVIEW)

- 해설 도식: [`q3-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution-v3.svg), 원문: [`q3.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3.png).
- 원문 그림은 평균 `a<b`의 두 곡선과 **함숫값(높이)** `f(a), g(b)`를 세로 눈금으로 보여 준다. 해설 SVG는 누적확률의 경계값으로 사용되는 `f(a),g(b)`를 **가로축에 a — g(b) — f(a) — b 순서로 찍고** 음영을 겹친다.
- 원문이 주는 `a<f(a)`, `g(b)<b`만으로는 `a<g(b)<f(a)<b`가 보장되지 않는다. 해설을 위한 *임의의 예시 좌표*일 수는 있으나, 그림만 보면 그 순서가 필연인 듯 보일 수 있다. 수학 풀이의 정답 오류라고 단정하지 않고 **설명 그림의 보완 대상**으로 표시한다.
- 권고: x축에 확정되는 조건만 반영하고 `f(a)`와 `g(b)`는 서로 다른 두 개의 비교 패널로 분리하거나 '가능한 배치의 예'라고 명시. 수정 시 음영 경계가 각 확률식과 일치하는지도 재검수.

### VQA-03-02 — 2019 매산고 기말 Q15: 해설 이미지가 원본 PNG를 재참조 (ASSET_ALIAS)

- `solutionImage` 값이 [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png)이며, 문항 자체의 `images`에도 같은 PNG가 있다. 로컬 취득 과정에서 `svg_048.svg`라는 임시 이름으로 받았더라도 **실제 바이트는 PNG**다.
- SVG XML 검증 실패 **1회는 손상 SVG가 아닌 파일 형식 오분류**다. 따라서 **109개 SVG 성공이라고 보고하지 않고 108개 SVG + PNG 별칭 1개로 정정**했다.
- PNG 이미지 자체는 열리며 원본 19개 집계에 이미 포함되어 있다. 해설만을 설명하는 별도 도식이 없다면 **원본 재사용 의도 확인**이 필요하다.

### VQA-03-03 — 2026 제일고 중간 Q12: SVG 루트 설명 메타데이터 누락 (A11Y_WARN)

- [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg)는 **실물 렌더·세 개의 2×2 정사각형 도형 판독 정상**. 다만 SVG 자체에 `<title>`, `<desc>`, `role="img"`, `aria-labelledby`가 모두 없다.
- 문항 JS에 `solutionImageAlt`가 있다고 해도 **독립 SVG 문서**를 열거나 내보낼 때를 대비한 루트 설명 메타데이터는 추가하는 편이 안전하다. 현재 학생 화면에서 대체 텍스트가 누락된다고 단정하지 않는다.

### VQA-03-04 — 작은 화면에서 별도 실기 검수가 필요한 6건 (WATCH)

- 2019 매산고 기말 **Q12**(두 개의 작은 정규곡선)·**Q18**(세로 2패널), 2019 복성고 기말 **Q20**(세로형 9갈래 경우 나무), 2019 금당고 기말 **Q20**(정규곡선 3패널), 2026 제일고 중간 **Q12**(3패널)·**Q20**(긴 분수형 확률나무).
- **단독 1000px 확대에서는 판독 가능**했으며, 접촉시트 축소 상태에서 일부 글씨가 작게 보인다. 실제 모바일 320–360px 브라우저 배치나 PDF 배율을 직접 시험하지 않았으므로 **오류 확정이 아닌 재검증 목록**이다.

## PNG 실제 경로 및 대응 판독

- **2020 매산고 기말 Q05·Q11**, **2019 금당고 기말 Q02·Q03**의 원본 PNG 4개는 `main`의 **루트 `assets/images/`**에서 확인했다. 그 외 원본 PNG는 `archive/assets/images/`에서 확인했다.
- 2021 효천고 Q03은 좁고 높은 `f`, 낮고 넓은 `g`의 **원본 세로 높이 표시**와 해설 x축을 비교했다. 2020 매산고 Q05는 삼각형 밀도 그래프, Q11은 도넛 그림. 2019 순천고 Q19는 반원·삼각형 조합 원형을 확인했다.
- 2026 순천고 중간 Q14·Q16·Q20은 원본 격자 2개와 원 위 6점 도형을 SVG 변형과 비교, 2026 제일고 중간 Q12·Q19·Q20은 정사각형 중점·5×5 도로망·3개 상자 동전 그림을 SVG 해설 도식과 비교했다.

## 해설 이미지 109개 — 문항별 원장

판정: `OK` 실물 렌더·판독, `REVIEW` 설명의 오독 가능성, `A11Y_WARN` SVG 자체 메타데이터 누락, `ASSET_ALIAS_PNG` 동일 원본 PNG 재사용. 아래 링크는 모두 GitHub `main`의 실물 파일이다.

### 1. 2021 효천고 기말 (14 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q03 | [`q3-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution-v3.svg) | REVIEW |
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v3.svg) | OK |
| Q08 | [`q8-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution-v3.svg) | OK |
| Q11 | [`q11-solution-v4.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution-v4.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution-v3.svg) | OK |
| Q17 | [`q17-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution-v3.svg) | OK |
| Q18 | [`q18-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v3.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q21 | [`q21-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v3.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |

### 2. 2020 매산여고 기말 (12 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |

### 3. 2020 매산고 기말 (9 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q02 | [`q2-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q14 | [`q14-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution-v2.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |

### 4. 2019 매산고 기말 (9 SVG + PNG 별칭 1)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v2.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution-v2.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png) | ASSET_ALIAS_PNG |
| Q18 | [`q18-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v2.svg) | OK |
| Q19 | [`q19-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution-v2.svg) | OK |

### 5. 2019 순천고 기말 (17 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q03 | [`q3-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution-v3.svg) | OK |
| Q05 | [`q5-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution-v3.svg) | OK |
| Q06 | [`q6-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution-v3.svg) | OK |
| Q07 | [`q7-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v3.svg) | OK |
| Q08 | [`q8-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution-v3.svg) | OK |
| Q09 | [`q9-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution-v3.svg) | OK |
| Q10 | [`q10-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution-v3.svg) | OK |
| Q12 | [`q12-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v3.svg) | OK |
| Q13 | [`q13-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution-v3.svg) | OK |
| Q14 | [`q14-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution-v3.svg) | OK |
| Q15 | [`q15-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution-v3.svg) | OK |
| Q16 | [`q16-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution-v3.svg) | OK |
| Q17 | [`q17-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution-v3.svg) | OK |
| Q18 | [`q18-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v3.svg) | OK |
| Q19 | [`q19-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution-v3.svg) | OK |
| Q20 | [`q20-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v3.svg) | OK |
| Q21 | [`q21-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v3.svg) | OK |

### 6. 2019 복성고 기말 (11 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q01 | [`q1-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q1-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |

### 7. 2019 매산여고 기말 (14 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q02 | [`q2-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |

### 8. 2019 금당고 기말 (12 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q05 | [`q5-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution-v3.svg) | OK |
| Q07 | [`q7-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v3.svg) | OK |
| Q08 | [`q8-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution-v3.svg) | OK |
| Q09 | [`q9-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution-v3.svg) | OK |
| Q10 | [`q10-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution-v3.svg) | OK |
| Q11 | [`q11-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution-v3.svg) | OK |
| Q13 | [`q13-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution-v3.svg) | OK |
| Q15 | [`q15-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution-v3.svg) | OK |
| Q17 | [`q17-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution-v3.svg) | OK |
| Q20 | [`q20-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v3.svg) | OK |
| Q21 | [`q21-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v3.svg) | OK |
| Q22 | [`q22-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution-v3.svg) | OK |

### 9. 2026 순천고 중간 (5 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q14 | [`q14-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution-v2.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q20 | [`q20-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v3.svg) | OK |
| Q23 | [`q23-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution-v2.svg) | OK |

### 10. 2026 제일고 중간 (5 SVG)

| 문항 | `solutionImage` 실물 | 판정 |
|---|---|---|
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg) | A11Y_WARN |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution-v2.svg) | OK |
| Q20 | [`q20-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v2.svg) | OK |

## 원본문제 PNG 19개 — 실물 디코드 원장

| 시험지 | 문항 | PNG 실물 | 판정 |
|---|---|---|---|
| 2021 효천고 기말 | Q03 | [`q3.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3.png) | DECODE_OK |
| 2021 효천고 기말 | Q23 | [`q23.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23.png) | DECODE_OK |
| 2020 매산고 기말 | Q05 | [`q5.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5.png) | DECODE_OK |
| 2020 매산고 기말 | Q11 | [`q11.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/20_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11.png) | DECODE_OK |
| 2019 매산고 기말 | Q07 | [`q07.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q07.png) | DECODE_OK |
| 2019 매산고 기말 | Q13 | [`q13.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13.png) | DECODE_OK |
| 2019 매산고 기말 | Q15 | [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png) | DECODE_OK |
| 2019 매산고 기말 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | DECODE_OK |
| 2019 매산고 기말 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/2019_%EB%A7%A4%EC%82%B0%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | DECODE_OK |
| 2019 순천고 기말 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | DECODE_OK |
| 2019 복성고 기말 | Q08 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/19_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | DECODE_OK |
| 2019 금당고 기말 | Q02 | [`q2.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2.png) | DECODE_OK |
| 2019 금당고 기말 | Q03 | [`q3.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/19_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3.png) | DECODE_OK |
| 2026 순천고 중간 | Q14 | [`q14.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14.png) | DECODE_OK |
| 2026 순천고 중간 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | DECODE_OK |
| 2026 순천고 중간 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | DECODE_OK |
| 2026 제일고 중간 | Q12 | [`q12.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12.png) | DECODE_OK |
| 2026 제일고 중간 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | DECODE_OK |
| 2026 제일고 중간 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/26_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EC%A4%91%EA%B0%84_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | DECODE_OK |

## 누적 진행률 / 남은 범위

- 1차 5장 116문항·SVG 61개·원본 PNG 18개 → 2차 10장 221문항·SVG 115개·원본 PNG 21개 → **이번 3차 10장 215문항·실제 SVG 108개·원본 PNG 19개**.
- 시각 QA 누적: **25/44장, 552문항, 실제 SVG 284개, 원본 PNG 58개**. **기말 23/23장 시각검수 완료**, **중간 2/21장 완료**. 남은 시각 QA는 **중간 19장**.
- 이전 8장 기말의 텍스트·수학 감사에서 남은 UPGRADE 항목은 **이번 시각 렌더 성공과 별도**이며, 미해결 사항이 있는 시험지를 출고 완료로 간주하지 않는다.
- 원본 JS·SVG·PNG는 이번 배치에서 **수정하지 않음**. 새 보고서만 생성하여 추적성 유지.
