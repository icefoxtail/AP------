# 22_금당고_1학기_기말_고2_수학I — 해설 DEEP AUDIT + 원본 이미지 실물 검수 (2026-11-22)

> 문서 전용(engine handoff). 원본 JS/PNG/SVG·학생 UI·엔진 수정 없음. 해설 `KEEP_MATH`는 런타임 PASS와 구분한다.

## 원본·검수 범위

- 원본 `archive/exams/original/high/h2/1final/22_금당고_1학기_기말_고2_수학I.js`, Git blob `13e67f92e843baadd8c1b85eb74ff18d98fb8bea`, **20문항**, 브랜치 `work/solution-upgrade-lane-30-20261121`.
- 정답/보기·해설 계산·경계조건 전수 대조 **KEEP_MATH 20 / HOLD_MATH 0**.
- 현행 참조 **9개(PNG 4, SVG 5)** 원본 디코드 및 Inkscape SVG→PNG 렌더 후 이미지 내용·수치·수선·축 육안 확인 **9/9 성공**. 신규 확정 이미지 수정 예약 **0**.
- 실제 학생 앱·모바일·MathJax·preflight/CI·ALIVE/Golden/Negative **NOT_RUN**.

## 문항별 수학 검산 (20/20)

| Q | 발문 식별 | 정답 | 독립 계산·제약 확인 | 이미지 | 판정 |
|---:|---|---|---|---|---|
| 01 | y=sin2x 주기 | ③ | 2π/2=π. | 없음 | KEEP_MATH |
| 02 | cosx=1/2, 0≤x<2π 근 합 | ⑤ | x=π/3,5π/3, 합2π. | 없음 | KEEP_MATH |
| 03 | AB4,AC3,sinθ1/2 넓이 | ① | (1/2)·4·3·(1/2)=3. | q03.png | KEEP_MATH |
| 04 | a1=−3,d=2,a7 | ③ | −3+6·2=9. | 없음 | KEEP_MATH |
| 05 | Σa=10,Σb=5,Σ(3a+2b) | ④ | 3·10+2·5=40. | 없음 | KEEP_MATH |
| 06 | y=a sin bx+c, max5,min−1,Tπ | ① | a3,c2, 부호 제약 b=−2 →abc=−12. | 없음 | KEEP_MATH |
| 07 | sin²x−4sinx+3, 0≤x<π 최대 | ④ | t=sinx∈[0,1], t²−4t+3 단조감소, x=0에서 최대3. | 없음 | KEEP_MATH |
| 08 | A75°,B45°,AB4 외접원 R | ④ | C60°, R=AB/(2sin60°)=4√3/3. | q08.png, q8-solution.svg | KEEP_MATH |
| 09 | a,3,b 등차; 1,a,b 등비; a<0 | ⑤ | a+b=6, b=a², (a+3)(a−2)=0→a=−3,b=9, b−a=12. | 없음 | KEEP_MATH |
| 10 | Σ1..8 3/(9k²−3k−2) | ④ | 3/[(3k−2)(3k+1)]=1/(3k−2)−1/(3k+1), 합24/25. | 없음 | KEEP_MATH |
| 11 | cosB−cosC 계수 이차식 중근 | ⑤ | D=0→sin²A+sin²B=sin²C, 사인법칙 a²+b²=c²→C90°; 이차항 cosB≠0 확인. | 없음 | KEEP_MATH |
| 12 | a1=2,r4, Σlog₈ak=27 | ② | ak=2^(2k−1), Σ(2k−1)/3=n²/3=27→n9. | 없음 | KEEP_MATH |
| 13 | tanx와 a sin bx 그래프의 교점 | ② | 교점 x=π/3,c=√3; 연속 영점 0·π/2에서 b=2, a=2, a+b+c²=7. | q13.png | KEEP_MATH |
| 14 | 지름 AB4 반원, sin(α−β)=−1/8 | ⑤ | α+β=90°, cos2β=−1/8; AC²=8−8(−1/8)=9, sinβ=3/4 →cos(α+2β)=−3/4. | q14.png, q14-solution.svg | KEEP_MATH |
| 15 | cos(πx/2ⁿ)≤−1/2, 자연수 x 개수 | ① | 2^(n+1)/3≤x≤2^(n+2)/3, n1..8 개수 1,3,5,11,21,43,85,171 합340. | q15-solution.svg | KEEP_MATH |
| 16 | 공차3 AP, Sl=Sm 쌍 6개·Sn=0 짝수 | ③ | l+m=K가6쌍이면 K13/14; 영점 n=K 짝수로 K14 →a1=−39/2,S20=180. | 없음 | KEEP_MATH |
| 17 | tanx=sinx, −nπ<x≤nπ 근 개수 | 240 | cosx≠0에서 sinx(1−cosx)=0→x=kπ; a_n=2n, Σ1..15=240. | q17-solution.svg | KEEP_MATH |
| 18 | a5=4, 정수 여부에 따른 분기 점화 | 199 | 가능한 a1=−8,−11/16,−1/4,11/2,6 중 최소−8; a5..a25 7항 주기 합 3·69/4, 최솟값199. | 없음 | KEEP_MATH |
| 19 | sinx=3/n, 0<x<nπ 실근 수 | 44 | n1,2는0, n3은2, n4..9은4,6,6,8,8,10 →합44. | q19-solution.svg | KEEP_MATH |
| 20 | a1=1, sqrt(Sn−1)+sqrt(Sn)=an>0 | 59 | an=Sn−Sn−1로 인수분해→√Sn−√Sn−1=1, Sn=n² →a30=900−841=59. | 없음 | KEEP_MATH |

## 실제 참조 이미지 렌더 검수 (9/9)

기준 폴더 `archive/assets/images/22_금당고_1학기_기말_고2_수학I/`; Git blob SHA 고정. PNG 디코드, SVG Inkscape→PNG 렌더 후 연락시트 관찰, Q15 원본 크기 텍스트 확대 확인.

| Q | 위치 | 파일 | blob SHA | 판정 |
|---:|---|---|---|---|
| 03 | 발문 HTML 이미지 | q03.png | df841f4745b1cd28575e4a9fb633cf68786d2850 | 삼각형 변3·4, θ 판독 |
| 08 | 발문 HTML 이미지 | q08.png | 01d949798142a6dfce23ef2a81c5e980fa07e765 | A75° B45° BC 표기 판독 |
| 08 | solutionImage | q8-solution.svg | 0060820bd430c0fd4aeba97ddc53b3076f2a48b6 | 외접원·C60° 렌더 |
| 13 | 발문 HTML 이미지 | q13.png | 9602b35ee4db262545fcd4d3d6c9f576bb338eb8 | tan·sin 두 그래프 및 영점 판독 |
| 14 | 발문 HTML 이미지 | q14.png | 86dfbb3dfdb04bdbff4e3f0ac6e3d304fc6d1fb1 | 반원·각 α/β 판독 |
| 14 | solutionImage | q14-solution.svg | 61c7adaffb54d59fcd2fa95fd3cb3445dbe51009 | 반원중심 O·두 현 렌더 |
| 15 | solutionImage | q15-solution.svg | 1434127d1448b49141a33a7b9ba9e0b48232fc66 | n=3 구간·정수 점 확대 판독 |
| 17 | solutionImage | q17-solution.svg | 8ea74d22d75de357eda0029b4c022c87d9c2f2cc | 정수근 개수 표시 렌더 |
| 19 | solutionImage | q19-solution.svg | 1ab3c5a685cbfcec60c1cd960da6dbd590458210 | sin 그래프·y=1/2 수평선 판독 |

## 엔진 인계

- Q11은 중근 조건에서 2차항이 0으로 퇴화하지 않는지까지 확인해야 한다. 본 해설의 `C=90°`에서 계수 `cos B−cos C=cos B>0`으로 정상.
- Q15 자연수 범위의 양끝은 3으로 나누어떨어지지 않는 거듭제곱을 포함하므로 정수 계수 경계 오판을 주의. Q18은 역점화의 모든 정수·비정수 후보와 7항 주기를 유지.
- 원본 정지 이미지에서 새 시각 결함 예약 없음. 실제 학생 화면의 크롭·수식·CI 및 출고 검증은 **NOT_RUN**.
