# lane40 고2 확통 2학기 기말 — SVG/PNG 실물 시각검수 1차 (5장)

- 기준일: **2026-11-22 KST**. 독립 검수 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 범위: 기존 텍스트 감사 첫 5장 **116문항**에 연결된 **해설 SVG 61개**와 **원본문제 PNG 고유 18개(참조 23회)**. SVG/PNG 소스는 `main:archive/assets/images/...`에서 실제 다운로드했다.
- 방법: 79개 파일을 직접 획득해 PNG 픽셀로 확인. SVG 61개는 Inkscape에서 너비 **1000px**로 각각 렌더링하고 원본 그림과 도식의 방향·수치·음영·선·주석을 대조했다. XML 파싱, `viewBox`, 외부 리소스 참조, 접근성 메타데이터도 확인했다.
- **결론: 61/61 SVG 렌더 성공, 18/18 PNG 실물 로드 성공. 확인한 데스크톱 렌더에서 확정적인 SVG 잘림·글자 겹침·그림 수학 불일치 0건.** 단, **접근성 메타데이터 누락 5건**, 협소 화면 가독성 유의 대상 5건은 후속 보완 대상이다.

## 시험지별 실물 검수 합계

| # | 시험지 | 문항 | 렌더·육안검수 SVG | 원본 PNG 고유/참조 | 화면 도식 판정 | 접근성 경고 |
|---:|---|---:|---:|---:|---|---:|
| 1 | 2025 강남여고 | 24 | 16/16 | 5/10 | 데스크톱 렌더 OK | 4 |
| 2 | 2025 금당고 | 20 | 8/8 | 2/2 | 데스크톱 렌더 OK | 0 |
| 3 | 2025 순천고 | 24 | 11/11 | 8/8 | 데스크톱 렌더 OK | 0 |
| 4 | 2024 매산여고 | 23 | 10/10 | 2/2 | 데스크톱 렌더 OK | 1 |
| 5 | 2023 강남여고 | 25 | 16/16 | 1/1 | 데스크톱 렌더 OK | 0 |

## 발견사항·후속 조치

1. **VQA-01 / 접근성 경고 — 5 SVG**: 다음 해설 파일은 SVG 루트에 `<title>`, `<desc>`, `role="img"`, `aria-labelledby`가 모두 없어 보조공학 설명이 제공되지 않는다. 브라우저 시각 렌더는 성공했으며 학생 화면 시각 결함과는 별개이다.

   - 2025 강남여고 **Q13** `q13-solution.svg`
   - 2025 강남여고 **Q16** `q16-solution-v2.svg`
   - 2025 강남여고 **Q19** `q19-solution-v2.svg`
   - 2025 강남여고 **Q24** `q24-solution-v3.svg`
   - 2024 매산여고 **Q10** `q10-solution-v3.svg`

   조치 제안: 원본을 수정할 별도 승인 차수에서 도식 의미를 한두 문장으로 기술한 `<title>/<desc>` 및 참조 접근성 속성을 추가한 후 재렌더.

2. **VQA-02 / 작은 화면 가독성 WATCH — 5 SVG**: 두 개 이상의 패널을 세로 배치했거나 세로 비율이 큰 2025 강남여고 Q16·Q19·Q24, 2024 매산여고 Q10·Q15는 데스크톱 1000px 렌더에서는 읽을 수 있었으나, 320–360px 학생 화면·인쇄 배율 검증은 실행하지 않았다. 모바일에서 수식·눈금 크기 확인 필요. 실제 잘림·겹침으로 판정하지 않음.

3. **VQA-03 / PNG 비치명 메타데이터 경고 — 2 PNG**: 2025 순천고 Q22 `q22.png`, Q23 `q23.png`에 ImageMagick 판독 중 `bKGD: invalid` 경고가 발생했으나 두 이미지 모두 픽셀 로드와 육안 판독 성공. 원본 이미지 보존, 필요 시 별도 이미지 메타데이터 정규화 검토.

4. **결함으로 기록하지 않은 미리보기 현상**: 여러 PNG를 `montage`로 한 장에 배치한 축소 미리보기에서 일부 곡선·눈금이 패널 경계에 잘린 듯 보였다. 해당 해설 SVG를 **단독 1000px 렌더 원본으로 재확인**한 결과 잘림·좌표 중첩이 재현되지 않아 실제 SVG 결함으로 분류하지 않았다.

## 실물 그림 대조의 대표 확인 사례

- **2025 강남여고 Q12**: 문제의 꺾은선 밀도(0·3·4 지점)와 해설 그래프의 `f(1)=1/3`, 면적 분할을 대조. **Q19**의 상자 평균 정규곡선 두 꼬리와 불량 상자 수 `Y` 정규근사 두 패널도 단독 렌더로 확인.
- **2025 금당고 Q07**: 원본의 0→3 선형 증가, 3→5 평탄부, 5→6 감소 구조와 해설의 `f(2)=1/6` 및 음영 `P(0≤X≤2)`를 대조. Q10의 공장별 불량률 가지 도식도 계수와 대응.
- **2025 순천고 Q08·Q18·Q22·Q23**: 원본문제의 정규표 수치 이미지와 해설곡선의 평균·표준점수·음영 범위를 대조. Q15·Q21의 삼각형/직선 밀도에서 구간 넓이 기호가 해설 풀이에 대응함을 확인.
- **2024 매산여고 Q10**: 원본 표준정규 음영 `[-1,2]`와 해설의 `X: [a,43]` 두 패널을 단독 확대해 확인. Q15의 분산 포물선 정점 `(3,16)`도 가독성 확인.
- **2023 강남여고 Q21**: 두 정규밀도 원본 교차 `x=10`과 해설의 평균 `m₁=-5`, `m₂=25`, 중앙확률 `0.4987` 각각을 실물 그래프에서 확인.

## SVG 61개 파일별 렌더·시각검수 원장

표의 `OK`는 파일 단독 렌더 및 도식 육안 검수를 뜻한다. `OK/A11Y`는 시각검수 OK이나 위 접근성 메타데이터 경고를 함께 뜻한다.

### 1. 2025 강남여고 — 16 SVG

| 문항 | 원본 해설 SVG (`main`) | 렌더·육안 |
|---|---|---|
| Q03 | [`q3-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution-v2.svg) | OK |
| Q05 | [`q5-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution-v2.svg) | OK |
| Q07 | [`q7-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v2.svg) | OK |
| Q08 | [`q08-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q08-solution.svg) | OK |
| Q10 | [`q10-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution-v2.svg) | OK |
| Q11 | [`q11-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution-v2.svg) | OK |
| Q12 | [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK / A11Y WARN |
| Q16 | [`q16-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution-v2.svg) | OK / A11Y WARN |
| Q17 | [`q17-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution-v2.svg) | OK |
| Q19 | [`q19-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution-v2.svg) | OK / A11Y WARN |
| Q20 | [`q20-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v3.svg) | OK |
| Q21 | [`q21-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v2.svg) | OK |
| Q22 | [`q22-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution-v2.svg) | OK |
| Q23 | [`q23-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution-v2.svg) | OK |
| Q24 | [`q24-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24-solution-v3.svg) | OK / A11Y WARN |

### 2. 2025 금당고 — 8 SVG

| 문항 | 원본 해설 SVG (`main`) | 렌더·육안 |
|---|---|---|
| Q07 | [`q7-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v2.svg) | OK |
| Q08 | [`q8-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution-v2.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q11 | [`q11-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution-v2.svg) | OK |
| Q12 | [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg) | OK |
| Q13 | [`q13-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution-v2.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |

### 3. 2025 순천고 — 11 SVG

| 문항 | 원본 해설 SVG (`main`) | 렌더·육안 |
|---|---|---|
| Q07 | [`q7-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v3.svg) | OK |
| Q08 | [`q8-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution-v2.svg) | OK |
| Q10 | [`q10-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution-v2.svg) | OK |
| Q12 | [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution-v2.svg) | OK |
| Q18 | [`q18-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v2.svg) | OK |
| Q19 | [`q19-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution-v2.svg) | OK |
| Q21 | [`q21-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v2.svg) | OK |
| Q22 | [`q22-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution-v2.svg) | OK |
| Q23 | [`q23-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution-v3.svg) | OK |

### 4. 2024 매산여고 — 10 SVG

| 문항 | 원본 해설 SVG (`main`) | 렌더·육안 |
|---|---|---|
| Q03 | [`q3-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution-v2.svg) | OK |
| Q10 | [`q10-solution-v3.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution-v3.svg) | OK / A11Y WARN |
| Q11 | [`q11-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution-v2.svg) | OK |
| Q12 | [`q12-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution-v2.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q17 | [`q17-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution-v2.svg) | OK |
| Q18 | [`q18-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v2.svg) | OK |
| Q21 | [`q21-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution-v2.svg) | OK |
| Q22 | [`q22-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution-v2.svg) | OK |
| Q23 | [`q23-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution-v2.svg) | OK |

### 5. 2023 강남여고 — 16 SVG

| 문항 | 원본 해설 SVG (`main`) | 렌더·육안 |
|---|---|---|
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | OK |
| Q24 | [`q24-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24-solution.svg) | OK |
| Q25 | [`q25-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q25-solution.svg) | OK |

## PNG 18개 파일별 실물 확인 원장

| 시험지 | 원본 그림이 참조된 문항(최초 등장) | 원본 PNG (`main`) | 실물 판정 |
|---|---|---|
| 2025 강남여고 | Q01 | [`q01_distribution_table.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q01_distribution_table.png) | 로드·육안 OK |
| 2025 강남여고 | Q24 | [`q03_standard_normal_table.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q03_standard_normal_table.png) | 로드·육안 OK |
| 2025 강남여고 | Q09 | [`q09_graph_and_statements.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q09_graph_and_statements.png) | 로드·육안 OK |
| 2025 강남여고 | Q12 | [`q12_density_graph.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12_density_graph.png) | 로드·육안 OK |
| 2025 강남여고 | Q18 | [`q18_distribution_tables.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18_distribution_tables.png) | 로드·육안 OK |
| 2025 금당고 | Q07 | [`q07_graph.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q07_graph.png) | 로드·육안 OK |
| 2025 금당고 | Q16 | [`q16_numberline.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16_numberline.png) | 로드·육안 OK |
| 2025 순천고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | 로드·육안 OK |
| 2025 순천고 | Q07 | [`q7.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7.png) | 로드·육안 OK |
| 2025 순천고 | Q08 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | 로드·육안 OK |
| 2025 순천고 | Q10 | [`q10.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10.png) | 로드·육안 OK |
| 2025 순천고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | 로드·육안 OK |
| 2025 순천고 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | 로드·육안 OK |
| 2025 순천고 | Q22 | [`q22.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22.png) | 로드·육안 OK (bKGD WARN) |
| 2025 순천고 | Q23 | [`q23.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23.png) | 로드·육안 OK (bKGD WARN) |
| 2024 매산여고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | 로드·육안 OK |
| 2024 매산여고 | Q10 | [`q10.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/24_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10.png) | 로드·육안 OK |
| 2023 강남여고 | Q21 | [`q21.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B0%95%EB%82%A8%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21.png) | 로드·육안 OK |

## 출고·변경 게이트

- `DESKTOP_SVG_RENDER = PASS (61/61)`; `ORIGINAL_PNG_VISUAL = PASS (18/18)`; `SVG_XML_PARSE = PASS (61/61)`; `SVG_VIEWBOX = PRESENT (61/61)`; `SVG_EXTERNAL_REF = NONE (0/61)`.
- `ACCESSIBILITY_SVG = WARN (5/61)`; `SMALL_SCREEN_UI_GOLDEN = NOT_RUN`; `PRINT_PDF_VISUAL = NOT_RUN`; `STUDENT_UI_END_TO_END = NOT_RUN`. **운영 출고 최종 PASS를 선언하지 않는다.**
- 기존 소스 JS·PNG·SVG·문항·정답·해설·`main`을 수정하지 않았다. **이 MD 한 파일만 독립 작업 브랜치에 신규 추가**한다.
- 누적 시각검수: **고2 확통 2학기 전체 44장 중 5장**; 이번 차수 기말 5장/116문항의 이미지 자료 검수 완료. 텍스트/수학 감사의 기존 44장·970문항 상태는 변경하지 않음.
- 다음 시각검수 2차 cursor: `23_금당고_2학기_기말_고2_확률과통계.js`부터 **기말 다음 5장**. 1차와 동일하게 원본 이미지와 기존 SVG 실제 렌더링·육안·접근성 및 소화면 위험을 분리 기록.
