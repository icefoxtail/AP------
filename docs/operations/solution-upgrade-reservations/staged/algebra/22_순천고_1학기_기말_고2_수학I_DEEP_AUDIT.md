# 22_순천고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. 수학 `KEEP_MATH`와 배포 PASS를 구분한다.

## 대상과 검수 범위

- 원본 `archive/exams/original/high/h2/1final/22_순천고_1학기_기말_고2_수학I.js` (Git blob `5c1ca3b542013779c786d7206fcf7add8f7d821c`), **22문항**. 브랜치 `work/solution-upgrade-lane-30-20261121`.
- 정답/원문/해설 및 제약 독립 대조 **KEEP_MATH 22 / HOLD_MATH 0**. 실사용 이미지 **12개(PNG 5, SVG 7)** 모두 확보; PNG 디코드, SVG Inkscape→PNG, 연락시트 육안 검수 **12/12 성공**. 신규 확정 이미지 교체 예약 0.
- 실제 학생 브라우저, 모바일/MathJax, CI/preflight/ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (22/22)

| Q | 발문 식별 | 원본 정답 | 계산·경계 검증 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | cosx를 y축 대칭, 오른쪽 π/2 이동 | ① | cos(−x)=cosx →cos(x−π/2)=sinx. | 없음 | KEEP_MATH |
| 02 | A45°,B30°,b√2 | ③ | a=b sin45°/sin30°=2. | 없음 | KEEP_MATH |
| 03 | a4=6,a7−a3=8 등차 | ② | 4d=8,d=2,a10=a4+6d=18. | 없음 | KEEP_MATH |
| 04 | x−1,x+2,3x−1 등비 | ⑤ | (x+2)²=(x−1)(3x−1) →2x²−8x−3=0, 실근 둘의 합4. | 없음 | KEEP_MATH |
| 05 | a1=1,a2=3 GP S5 | ⑤ | 1+3+9+27+81=121. | 없음 | KEEP_MATH |
| 06 | Σ1..5 k(k+1)(k+2) | ② | 항값 6+24+60+120+210=420. | 없음 | KEEP_MATH |
| 07 | −π/2<x<π/2, −√3≤tanx≤1 | ② | 증가구간에서 −π/3≤x≤π/4, a+b=−1/12. | q7-solution.svg | KEEP_MATH |
| 08 | tan(x/2) ㄱ~ㅁ 참 개수 | ① | 정의역의 홀수π 제외, 치역 전체 실수, 원점 대칭·주기2π·수직 점근선 x=(2n+1)π →ㄴ만 참. | q8-solution.svg | KEEP_MATH |
| 09 | 변환 삼각방정식 0≤x<2π | ① | cosx−sinx=−cosx+sinx →x=π/4,5π/4, 합3π/2. | 없음 | KEEP_MATH |
| 10 | 내접사각형 BD5, CD2, sinDAB3/4 | ③ | BD=2RsinDAB →R=10/3, sinDAC=CD/(2R)=3/10. | q10.png, q10-solution.svg | KEEP_MATH |
| 11 | 반지름5, a8, bc 최댓값 | ④ | sinA=4/5, cosA=±3/5; b²+c²≥2bc로 예각 가지 bc≤80(둔각20), 이등변으로80 달성. | q11.png, q11-solution.svg | KEEP_MATH |
| 12 | a1=1 GP, 홀수항 합10·짝수항 합30 | ② | 짝/홀 합 비 r=3, 홀수항 Σ9^j=10→k=2. | 없음 | KEEP_MATH |
| 13 | Sn=n²−n, Σ1..3n a2k | ④ | ak=2k−2, a2k=4k−2; 합=18n². | 없음 | KEEP_MATH |
| 14 | a1=0,d≠0, an+1 bn=Σ1..n ak | ⑤ | an=(n−1)d, nd·bn=dn(n−1)/2 →b2023=1011. | 없음 | KEEP_MATH |
| 15 | 몫=나머지인 자연수의 합 aₙ | ③ | N=(n+1)k, 1≤k≤n−1; an=n(n²−1)/2; a10=495, a11=660 →최초 11. | 없음 | KEEP_MATH |
| 16 | P→Q 20km, 건물 관측각 | ④ | PA=10√6, PB=20√2, ∠APB=60°; AB²=1400−400√3≈720, AB≈26.4km. | q16.png, q16-solution.svg | KEEP_MATH |
| 17 | AC4, DAC30°, AEC=ACD90° | ⑤ | AD=8/√3, CD=4/√3, BD=EC=x; 코사인·피타고라스 연립하여 BC=2√3. | q17.png, q17-solution.svg | KEEP_MATH |
| 18 | abs(S3)=abs(S6)=abs(S12)−3, a1>0 | ④ | d=−a/4 또는 −a/2; a1 각각4/3,2/13, 곱8/39 →p+q=47. | 없음 | KEEP_MATH |
| 19 | a^(log₂27)=3ⁿ의 증가순서 | ① | log₂aₙ=n/3, Σ1..20 n/3=70. | 없음 | KEEP_MATH |
| 20 | Sn=2n²−n+3, a1+a3+a4 | 26 | a1=4 예외, a3=S3−S2=9, a4=S4−S3=13, 합26. | 없음 | KEEP_MATH |
| 21 | Q가 원 x²+y²=16 위 한 바퀴 | 2 | 최소 양의 주기8π→a=8; chord PQ∈[0,8]→b=5,c=−11, 합2. | q21.png, q21-solution.svg | KEEP_MATH |
| 22 | an∈{0,1,2}, Σan=13, Σan²=23 | 83 | 1인 항 m, 2인 항 r: m+2r=13,m+4r=23→m3,r5; Σan⁴=3+80=83. | 없음 | KEEP_MATH |

## 이미지별 원본 렌더·판독 (12/12)

기준 폴더 `archive/assets/images/22_순천고_1학기_기말_고2_수학I/`. SHA는 변경 전 Git blob. PNG 원본 디코드, SVG Inkscape→PNG 실물 렌더 후 연락시트 관찰.

| Q | 필드 | 파일 | SHA | 관찰 |
|---:|---|---|---|---|
| 07 | solutionImage | q7-solution.svg | 4d0eab032b694e1cedaeaf22a6bbdefa675bc500 | tan 단조구간·점근선 확인 |
| 08 | solutionImage | q8-solution.svg | 36e645eb989576b7d95877f4c467587dcc073472 | 주기2π 그래프 확인 |
| 10 | 발문 HTML 이미지 | q10.png | 5e6e66a2401b87ee5941f8e6c661ee3064b95093 | 원·현·점 A/B/C/D 판독 |
| 10 | solutionImage | q10-solution.svg | 22ebb1b2b397fe176f821cd6922f0c8cdb5dc988 | 현 BD/CD 보조도식 확인 |
| 11 | 발문 HTML 이미지 | q11.png | 2f08658d69ab4f715029f5afb2e3fced9c49e22b | 외접원 BC8·R5 판독 |
| 11 | solutionImage | q11-solution.svg | 31c73a379c7b9628b0620772d2b56f552501927e | 이등변 최대 배치 확인 |
| 16 | 발문 HTML 이미지 | q16.png | 517c57b54da95554116570c337b0d2e94cae4e74 | 자전거 P/Q·건물 시선 판독 |
| 16 | solutionImage | q16-solution.svg | db2970ddfb4fd35cb7996445525c9a041ae199fa | 시선·길이 수치 확인 |
| 17 | 발문 HTML 이미지 | q17.png | 251a084a15c144014e0985641db5bea198fb318b | E/C/D 보조점 판독 |
| 17 | solutionImage | q17-solution.svg | 97baa5ca46fd989ed75b0286c8f6f70a9697aa11 | 직각·분할 보조도식 확인 |
| 21 | 발문 HTML 이미지 | q21.png | a416b10d26cb656a0365d5023b5a0c3ccacf33ef | 원 좌표축·P/Q 판독 |
| 21 | solutionImage | q21-solution.svg | 15e0f3b065ebc9767b9aab1df499c168ea27724e | 반지름4·현 PQ 렌더 |

## 엔진 인계

- Q8 발문은 `&lt;보 기&gt;`로 이미 HTML 이스케이프되어 있어 표제 특수태그 위험을 확정하지 않았다. 원본 사용 이미지 12개에서 별도의 확정 결함은 발견하지 못함.
- Q16의 수치 `√3≈1.7`, `√5≈2.2`는 문제에 주어진 근삿값 사용을 뜻한다. 실제 학생 UI에서 그림의 방향 및 보조선/라벨을 유지할 것.
- 문항 수학·정지 그림 판정과 UI/모바일/CI는 별도 층이며 미실행 영역은 `NOT_RUN`을 유지한다.
