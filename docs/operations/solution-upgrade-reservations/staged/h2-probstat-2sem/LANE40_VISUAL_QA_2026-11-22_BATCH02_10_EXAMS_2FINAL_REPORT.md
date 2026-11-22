# lane40 고2 확통 2학기 기말 — 실물 시각검수 2차 (10장 / 221문항)

- 기준일: **2026-11-22 KST** · 검수 브랜치: `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 범위: 기말 텍스트 감사 제6·7회차의 다음 **10개 시험지, 221문항**, 기존 해설 `solutionImage` **SVG 115개**, 원본문제 **PNG 고유 21개(참조 23회)**.
- 모든 SVG·PNG를 GitHub `main`에서 실물 취득(`archive/assets/images/` 133개, 루트 `assets/images/` 3개). SVG는 Inkscape로 **각각 너비 1000px** PNG 렌더, 문항별 그래프·표·확률 음영·주석 대조. 115/115 XML 파싱 성공, 115/115 viewBox 존재, 외부 HTTP/file 리소스 없음.
- **결론:** SVG 렌더 **115/115 성공**, 원본 PNG 로드 **21/21 성공**, 렌더 실패/빈 화면/확정적 프레임 잘림 **0건**. **해설 도식의 수치 라벨 배치 문제 1건(Q09)**, SVG 접근성 메타데이터 누락 **3건**, 모바일 가독성 위험 **8건** 기록. 렌더 성공은 학생용 최종 출고 승인을 뜻하지 않는다.

## 검수 통계

| # | 시험지 | 문항 | 해설 SVG | 원본 PNG 고유/참조 | 화면 검수 결과 | SVG 접근성 경고 |
|---:|---|---:|---:|---:|---|---:|
| 1 | 2023 금당고 | 22 | 14/14 | 4/4 | 렌더·도식 육안 OK | 0 |
| 2 | 2023 매산여고 | 22 | 10/10 | 0/0 | 렌더·도식 육안 OK | 0 |
| 3 | 2023 복성고 | 20 | 18/18 | 4/6 | 렌더·도식 육안 OK | 0 |
| 4 | 2023 순천여고 | 23 | 8/8 | 0/0 | 렌더·도식 육안 OK | 0 |
| 5 | 2023 제일고 | 23 | 11/11 | 4/4 | 렌더·도식 육안 OK | 0 |
| 6 | 2025 제일고 `_기출` | 23 | 11/11 | 1/1 | 렌더·도식 육안 OK | 3 |
| 7 | 2022 복성고 | 20 | 9/9 | 2/2 | 렌더·도식 육안 OK | 0 |
| 8 | 2022 순천고 | 21 | 11/11 | 2/2 | 라벨 보완 1건 | 0 |
| 9 | 2022 효천고 | 24 | 11/11 | 3/3 | 렌더·도식 육안 OK | 0 |
| 10 | 2021 순천여고 | 23 | 12/12 | 1/1 | 렌더·도식 육안 OK | 0 |

## 확인된 시각·접근성 이슈

### VQA-02-01 · 2022 순천고 Q09 — 음영 내부 값의 뜻이 섞여 보임 (수정 권고)

- 파일: `assets/images/22_순천고_2학기_기말_고2_확률과통계/q9-solution.svg`.
- 원문 조건은 `P(-1/2 ≤ X ≤ 1/2)=3/8`, 확률밀도함수 `f(x)=a|x|+b`; 독립 풀이에서 `a=1/2`, `b=1/4`가 맞다.
- 실제 렌더 그림의 **[-1/2,1/2] 전체 음영 내부**에 왼편 `3/8`, 오른편 `1/2`를 같은 방식의 지역 레이블처럼 배치했다. `3/8`은 **전체 음영 확률**이고 `1/2`는 **계수 a**이므로, 각 절반의 넓이처럼 읽히면 수학적으로 잘못 해석된다. **수학적 해설 텍스트의 계산 오류가 아니라 SVG 설명 라벨의 시각적 모호성**이다.
- 제안: 전체 음영에 괄호/화살표로 `P(-1/2≤X≤1/2)=3/8`을 단일 주석으로 표기, `a=1/2`는 곡선 바깥 별도 설명으로 이동. 그림은 수정 후 재렌더·모바일 검수. 원본은 이번 차수에서 수정하지 않음.

### VQA-02-02 · SVG 접근성 메타데이터 누락 — 3건 (보완 권고)

아래 SVG는 루트 `<title>`, `<desc>`, `role="img"`, `aria-labelledby`가 모두 없다. 픽셀 렌더는 정상이다.

- **2025 제일고 `_기출` Q13** `q13-solution-v2.svg`
- **2025 제일고 `_기출` Q15** `q15-solution.svg`
- **2025 제일고 `_기출` Q23** `q23-solution.svg`

### VQA-02-03 · 작은 화면에서 가독성 재검증할 SVG 8건 (WATCH, 미실행)

- **2023 매산여고 Q16**(2개 정규곡선 세로 배치), **2023 순천여고 Q04**(6×6 경우 표),
- **2025 제일고 `_기출` Q15**(세로 2패널)·**Q22**(분수 다단계 확률나무)·**Q23**(99% 신뢰구간 2패널),
- **2022 복성고 Q20**(8개 잎의 3단계 확률나무), **2022 순천고 Q08**(정규곡선 2패널), **2022 효천고 Q23**(정규곡선 2패널).
- 단독 너비 1000px에서는 텍스트·축 눈금을 읽을 수 있었지만, 실제 320~360px UI와 PDF 인쇄 확대/축소는 확인하지 않았다. **미검증 위험**으로 기록하며 실제 텍스트 겹침이나 잘림이라고 단정하지 않는다.

### 참고: 원문/해설 그림의 교육적 변환

- **2023 금당고 Q08**: 문제 PNG는 `Z∈[-1,2]` 전체를 색칠하지만 해설 SVG는 좌우 대칭성을 보이는 차이 영역 `[-2,-1]`과 `[1,2]`를 강조한다. 면적 등가 변환에 해당하므로 원문 복제 실패로 판정하지 않음. 학생 화면에서 '대칭성을 이용한 비교' 주석 추가는 선택적.
- **2022 효천고 Q11·Q20·Q24**의 원본 PNG는 저장소 **루트** `assets/images/`에서 찾았고 나머지 18개는 `archive/assets/images/`에 있었다. 모두 실제 내려받아 판독했다.

## 대표 실물 대조 기록

- **2023 금당고 Q08/Q16/Q17/Q18**: 정상곡선 `[-1,2]` 원본과 대칭 변환 그림, 테니스 대진표 5자리, 정육각형 꼭짓점, 3×3 도로망의 원본 PNG 4개를 해설 SVG 및 문항 숫자와 대조.
- **2023 제일고 Q01/Q18/Q20/Q23**: 육각타일 묶음, 정사각형 변 길이와 방향, 원본 정규표, 원본 공 추출 지시문을 실제 판독하여 대응되는 도식을 확인.
- **2025 제일고 `_기출` Q08/Q13/Q15/Q22/Q23**: 문제의 삼각밀도 그래프와 해설 `b=2,c=2/3`; 같은 중심50인 신뢰구간 두 개와 자연수 38~62; 확률나무 다중 분수는 단독 확대 확인.
- **2022 복성고 Q13/Q16/Q20**: 원본 다각형과 원탁 옆자리 도식을 SVG 재구성에 대조, Q20 긴 확률나무는 단독 1000px 렌더로 끝단 분수까지 판독.
- **2022 순천고 Q04/Q08/Q09**: 원본 선형 밀도 삼각형·표준정규표 및 해설 2단 정규곡선을 확인. Q09의 면적·계수 라벨 구분 결함을 별도 적출.
- **2022 효천고 Q11/Q20/Q24**: 주머니의 숫자1·2 공, 1~6 자리 순서, 원본 사다리꼴/삼각 밀도와 해설의 변수변환 그래프를 대조.
- **2021 순천여고 Q01/Q09/Q23**: 원탁 8자리 실물, 함수 대응 도식 및 공 숫자 분포 도식을 문항·해설과 대조.

## SVG 115개 — 파일별 렌더·실물 판정 원장

`OK`: 렌더·육안 판독 정상. `VISUAL_LABEL_WARN`: 위 Q09 라벨 보완. `OK/A11Y_WARN`: 화면 정상이나 SVG 대체설명 누락.

### 1. 2023 금당고 (14 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q07 | [`q7-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution-v2.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |

### 2. 2023 매산여고 (10 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%A7%A4%EC%82%B0%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |

### 3. 2023 복성고 (18 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q01 | [`q1-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q1-solution.svg) | OK |
| Q02 | [`q2-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q2-solution.svg) | OK |
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q20 | [`q20-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution-v2.svg) | OK |

### 4. 2023 순천여고 (8 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |

### 5. 2023 제일고 (11 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q01 | [`q1-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q1-solution.svg) | OK |
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q22-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |

### 6. 2025 제일고 `_기출` (11 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q7-solution.svg) | OK |
| Q08 | [`q8-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q8-solution-v2.svg) | OK |
| Q11 | [`q11-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q11-solution.svg) | OK |
| Q13 | [`q13-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q13-solution-v2.svg) | OK/A11Y_WARN |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q15-solution.svg) | OK/A11Y_WARN |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q16-solution.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q19-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q21-solution.svg) | OK |
| Q22 | [`q22-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q22-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q23-solution.svg) | OK/A11Y_WARN |

### 7. 2022 복성고 (9 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q05 | [`q5-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q5-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q18 | [`q18-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution-v2.svg) | OK |
| Q19 | [`q19-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |

### 8. 2022 순천고 (11 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q03 | [`q3-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q3-solution.svg) | OK |
| Q04 | [`q4-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4-solution.svg) | OK |
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | VISUAL_LABEL_WARN |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |

### 9. 2022 효천고 (11 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q06 | [`q6-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q6-solution.svg) | OK |
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q08 | [`q8-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q21 | [`q21-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q21-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |
| Q24 | [`q24-solution-v2.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24-solution-v2.svg) | OK |

### 10. 2021 순천여고 (12 SVG)

| 문항 | 해설 SVG (`main`) | 판정 |
|---|---|---|
| Q07 | [`q7-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q7-solution.svg) | OK |
| Q09 | [`q9-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q9-solution.svg) | OK |
| Q10 | [`q10-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q10-solution.svg) | OK |
| Q12 | [`q12-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q12-solution.svg) | OK |
| Q13 | [`q13-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13-solution.svg) | OK |
| Q14 | [`q14-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q14-solution.svg) | OK |
| Q15 | [`q15-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15-solution.svg) | OK |
| Q16 | [`q16-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16-solution.svg) | OK |
| Q17 | [`q17-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17-solution.svg) | OK |
| Q18 | [`q18-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18-solution.svg) | OK |
| Q20 | [`q20-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20-solution.svg) | OK |
| Q23 | [`q23-solution.svg`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23-solution.svg) | OK |

## 원본 PNG 21개 — 실물 확인 원장

| 시험지 | 최초 참조 | PNG (`main` 또는 루트) | 실물 |
|---|---|---|
| 2023 금당고 | Q08 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | 로드·육안 OK |
| 2023 금당고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | 로드·육안 OK |
| 2023 금당고 | Q17 | [`q17.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q17.png) | 로드·육안 OK |
| 2023 금당고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EA%B8%88%EB%8B%B9%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | 로드·육안 OK |
| 2023 복성고 | Q17 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | 로드·육안 OK |
| 2023 복성고 | Q15 | [`q15.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q15.png) | 로드·육안 OK |
| 2023 복성고 | Q19 | [`q19.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q19.png) | 로드·육안 OK |
| 2023 복성고 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | 로드·육안 OK |
| 2023 제일고 | Q01 | [`q1.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q1.png) | 로드·육안 OK |
| 2023 제일고 | Q18 | [`q18.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q18.png) | 로드·육안 OK |
| 2023 제일고 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | 로드·육안 OK |
| 2023 제일고 | Q23 | [`q23.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/23_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q23.png) | 로드·육안 OK |
| 2025 제일고 `_기출` | Q08 | [`q08.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/25_%EC%A0%9C%EC%9D%BC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84_%EA%B8%B0%EC%B6%9C/q08.png) | 로드·육안 OK |
| 2022 복성고 | Q13 | [`q13.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q13.png) | 로드·육안 OK |
| 2022 복성고 | Q16 | [`q16.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EB%B3%B5%EC%84%B1%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q16.png) | 로드·육안 OK |
| 2022 순천고 | Q04 | [`q4.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q4.png) | 로드·육안 OK |
| 2022 순천고 | Q08 | [`q8.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/22_%EC%88%9C%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q8.png) | 로드·육안 OK |
| 2022 효천고 | Q11 | [`q11.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q11.png) | 로드·육안 OK |
| 2022 효천고 | Q20 | [`q20.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q20.png) | 로드·육안 OK |
| 2022 효천고 | Q24 | [`q24.png`](https://github.com/icefoxtail/AP------/blob/main/assets/images/22_%ED%9A%A8%EC%B2%9C%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q24.png) | 로드·육안 OK |
| 2021 순천여고 | Q01 | [`q1.png`](https://github.com/icefoxtail/AP------/blob/main/archive/assets/images/21_%EC%88%9C%EC%B2%9C%EC%97%AC%EA%B3%A0_2%ED%95%99%EA%B8%B0_%EA%B8%B0%EB%A7%90_%EA%B3%A02_%ED%99%95%EB%A5%A0%EA%B3%BC%ED%86%B5%EA%B3%84/q1.png) | 로드·육안 OK |

## 원본 보존·상태·다음 작업

- `SVG_RENDER=115/115_PASS`; `PNG_LOAD=21/21_PASS`; `SVG_XML=115/115_PASS`; `VIEWBOX=115/115_PASS`; `EXTERNAL_REF=NONE`.
- `VISUAL_LABEL_WARN=1 (2022 순천고 Q09)`; `A11Y_WARN=3 (2025 제일고 Q13/Q15/Q23)`; `MOBILE_WATCH=8`; `MOBILE_GOLDEN=NOT_RUN`; `PRINT_PDF=NOT_RUN`; `STUDENT_UI_E2E=NOT_RUN`; `OPERATIONS_PROMOTION=HOLD`.
- 원본 `archive/exams/original/high/h2/2final/*.js`, `assets/images/*` PNG/SVG, 기존 해설·정답·`main` **무변경**. 이 MD 보고만 독립 브랜치에 신규 커밋.
- **누적 실물 시각검수: 15/44장, 337문항, 기존 해설 SVG 176개, PNG 고유 39개.** 텍스트·수학 심층 감사의 기존 44장/970문항 기록은 변경하지 않는다.
- **다음 cursor**: `21_효천고_2학기_기말_고2_확률과통계.js`. 기말 잔여 **8장**을 먼저 마무리한 뒤, 중간 21장 중 시각검수 미착수 원본을 이어갈 수 있다. 다음 차수부터도 시험지 **10장 단위**를 기본 목표로 하되 학기·기말 경계가 있으면 보고에 명시.
