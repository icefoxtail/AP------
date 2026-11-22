# 21_금당고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 실물 이미지 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. `KEEP_MATH`는 런타임 PASS가 아니다.

## 원본·검수 범위

- 원본 `archive/exams/original/high/h2/1final/21_금당고_1학기_기말_고2_수학I.js`, Git blob `aaecb05f7f9b089c551e349f0d23d554e962daeb`, **22문항**.
- 전 문항 정답·풀이·양끝 조건 검산 **KEEP_MATH 22 / HOLD_MATH 0**.
- 현행 참조 이미지 **10개(PNG 2, SVG 8)**: 원본 PNG 디코드, SVG Inkscape→PNG 렌더 후 연락시트 및 복잡도형 관찰 **10/10 성공**. 확정 이미지 교체 예약 없음. 폴더의 미참조 그림은 제외.
- 실제 학생 앱·모바일·MathJax·preflight/CI·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (22/22)

| Q | 발문 식별 | 정답 | 독립 계산·조건 확인 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | sinx=−1/2, 0≤x<2π 실근 수 | ③ | 7π/6,11π/6로 2개. | q1-solution.svg | KEEP_MATH |
| 02 | 정수 x=0..4, tan(πx/2)≥100 | ① | 홀수 1,3은 미정의, 짝수 0,2,4는 tan=0→0개. | 없음 | KEEP_MATH |
| 03 | sin(5π/4)+cos(π/6) | ③ | (√3−√2)/2. | 없음 | KEEP_MATH |
| 04 | b6,c4,sinA√3/2, 삼각형 넓이 | ⑤ | (1/2)·6·4·√3/2=6√3. | 없음 | KEEP_MATH |
| 05 | a₂8,a₆16, a₄ | ④ | d=(16−8)/4=2, a₄=12. | 없음 | KEEP_MATH |
| 06 | Sₙ=3^(n+1)−2, a₁+a₃ | ③ | a₁7, a₃=S₃−S₂=54→61. | 없음 | KEEP_MATH |
| 07 | 3,x₁,x₂,x₃,243 등비, 중간합 최소 | ② | r=±3, r=−3에서 3(−3+9−27)=−63. | 없음 | KEEP_MATH |
| 08 | a₁6, S₃=S₇, Sₙ 최대 n | ③ | a₄+a₇=0→d−4/3, a₅2/3>0,a₆−2/3<0→n5. | 없음 | KEEP_MATH |
| 09 | Σ1/[(k+1)(k+2)], k1..7 | ⑤ | 1/2−1/9=7/18. | 없음 | KEEP_MATH |
| 10 | ax²−2√b·sinB·x+sin²A 중근 | ④ | 판별식0→b sin²B=a sin²A, 사인법칙 b³=a³→a=b. | 없음 | KEEP_MATH |
| 11 | a₁+a₂3,a₃+a₄5, a₁₉+a₂₀ | ① | 4d=2,d1/2; 첫 합+36d=21. | 없음 | KEEP_MATH |
| 12 | 첫날10km, 매일0.9배, 30일 | ① | 10(1−0.9³⁰)/(1−0.9)=96km(지정 근삿값). | 없음 | KEEP_MATH |
| 13 | 원내접 사각형 변1·2·3·4 넓이 | ③ | cosB=−5/7, sinB=2√6/7, 넓이=(1+6)sinB=2√6. | q13-solution.svg | KEEP_MATH |
| 14 | 삼각형 넓이9,B30°, AC 최소일 때 AB+BC | ③ | AB·BC=36, AB²+BC² 최소는 AB=BC=6→합12. | q14-solution.svg | KEEP_MATH |
| 15 | AP 첫 4항26·끝4항134·전체260 | ⑤ | 2a₁+3d=13,(n−4)d=27, Sₙ=n·40/2=260→n13. | 없음 | KEEP_MATH |
| 16 | y=2sin[(x−π)/4], y1 교점과 삼각형 | ② | 교점 x=5π/3,13π/3,29π/3, 최대 밑변8π·높이3→12π. | q16-solution.svg | KEEP_MATH |
| 17 | 원 x²+y²=1, PA=PQ, f·g | ⑤ | ∠AOP=π−θ, PA²=2+2cosθ; θπ/3에서 f·g=(2π/3)·3=2π. | q17.png, q17-solution.svg | KEEP_MATH |
| 18 | 100만원 원금·월0.8%·24회 월말 지급 | ④ | 미래가치120만원, 지급계수 (1.2−1)/.008=25→월48000원. | 없음 | KEEP_MATH |
| 19 | 1−2sin²x+sinx−k=0, [0,π] 근4개 | ⑤ | t=sinx∈[0,1], k=1+t−2t²; 근4개 범위 [1,9/8), 1+8·9/8=10. | q19-solution.svg | KEEP_MATH |
| 20 | 평행사변형 AB5,BC7,넓이28, 이등분선 직사각형 | ⑤ | BE=AB=5, 높이4,[ABE]=10→AP·BP=10, 직사각형 넓이8/5→p+q13. | q20.png, q20-solution.svg | KEEP_MATH |
| 21 | [서술형] a₁1,d2, Σ1/(aₙ₊₁aₙ₊₂) | 10/69 | (1/2)Σ[1/(2n+1)−1/(2n+3)], 1..10=(1/2)(1/3−1/23)=10/69. | 없음 | KEEP_MATH |
| 22 | [서술형] 조각함수·삼각형 격자점 합 | 244 | n1..10의 유효 격자점 수 2,5,8,12,17,24,31,39,48,58 합244; 경계부등호 구분. | q22-solution.svg | KEEP_MATH |

## 실제 참조 이미지 렌더 검수 (10/10)

기준 폴더 `archive/assets/images/21_금당고_1학기_기말_고2_수학I/`; Git blob SHA 고정. PNG 직접 관찰, SVG→PNG 렌더 후 연락시트에서 선·라벨·그래프 구간 확인.

| Q | 파일 | blob SHA | 렌더·시각 확인 |
|---:|---|---|---|
| 01 | q1-solution.svg | fd65bedf42789568a72716e856b2989a0598bb66 | sinx=−1/2 단위원 보조 |
| 13 | q13-solution.svg | dd3788ef7ae97b603a94d6e7977e4741302dbe7f | 원내접 사각형·대각선 보조 |
| 14 | q14-solution.svg | fdfe2db7a63a961272fee8b54b6ef407bc812ddd | B30° 삼각형·변 x,y |
| 16 | q16-solution.svg | a531d7d5e61a3347bd578d98eefd45898593ecda | 사인곡선·y=1 교점 좌표 |
| 17 | q17.png | 7976c0589a8e305fcbcb81e799b03cc7fde18be9 | 원과 A,P,Q 원본 스캔 |
| 17 | q17-solution.svg | f661912804de7ecbfac6b22cdf24538ae133e048 | 각과 현 코사인 보조 |
| 19 | q19-solution.svg | e768059224f22b879419efaf3f89a38d0fb4a1a1 | k 범위 포물선 보조 |
| 20 | q20.png | 71ff4ab9b9e6a74748a9b5d7d62a4d2ce4e65ba5 | 평행사변형·각 이등분선 원본 |
| 20 | q20-solution.svg | 3f870c7f6fb04a024f2ea969b956827090195e9f | 삼각형 ABE·직사각형 보조 패널 |
| 22 | q22-solution.svg | 8781730b6d6fadbf2c68f855b861b2d3b426d66c | 조각함수와 삼각형 격자 영역 |

## 엔진 인계

- Q02는 tan이 미정의인 홀수 정수들을 부등식의 해로 포함하지 않는다. Q19는 `k=1`에서 sinx=0의 두 끝점 및 다른 두 내부해를 모두 세고 `k=9/8`의 중근을 중복 계산하지 않는다.
- Q22의 격자점 개수에는 좌우의 열린/닫힌 경계가 서로 달라 n별 열거를 유지해야 한다.
- 현재 이미지 확정 교체 예약 없음. 학생 앱·MathJax·CI·출고 검증은 **NOT_RUN**.
