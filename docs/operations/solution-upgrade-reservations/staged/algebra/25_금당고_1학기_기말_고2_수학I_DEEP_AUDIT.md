# 25_금당고_1학기_기말_고2_수학I — 1학기 기말 고2 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> **문서 전용(engine handoff) 검수 기록.** 시험 원본 JS, 학생 UI, 원본 PNG/SVG, 엔진은 수정하지 않았다. 수학적 KEEP는 정식 배포/런타임 PASS가 아니다.

## 범위·원본 고정

- 대상: **25학년도 금당고 1학기 기말**, 식별자 `25_금당고_1학기_기말_고2_수학I`.
- 브랜치: `work/solution-upgrade-lane-30-20261121`.
- 원본 JS: `archive/exams/original/high/h2/1final/25_금당고_1학기_기말_고2_수학I.js` (Git blob SHA `5b3c097c17201927a278c9fe9519d68b4f72945b`), **21문항**.
- 직접 참조 원본 이미지: **11개 (PNG 8 / SVG 3)**; `image`/`solutionImage`뿐 아니라 HTML 발문 내부 `<img src>` 포함, 아래 경로·SHA 확인.
- 검수: 원문 발문/보기/정답/현재 해설 및 핵심 계산·제약 조건 대조. **해설 KEEP_MATH 21 / HOLD_VISUAL_SOURCE 0**.
- 이미지: 원본 11개를 전부 확보, PNG 디코드 또는 SVG→PNG 렌더 성공 **11/11**, 연락시트 관찰 및 필요한 이미지 확대 검토. 렌더 오류 **0**.
- 이미지 예약: **0개** (없음); 기타 직접 참조 11개는 이번 원본 정지 화면 관찰에서 특정 결함을 지정하지 않음.
- 제외: 실제 앱 레이아웃·MathJax 런타임, 모바일, preflight/CI/ALIVE/Golden/Negative, 원본 이미지 교체 및 엔진 코드 반영 모두 **NOT_RUN**.

## 문항별 해설 검산 대장 (21/21)

| Q | 발문 식별자(앞부분) | 기존 정답 | 검산 근거(분기·수치·경계) | 참조 원본 | 해설 판정 |
|---:|---|---|---|---|---|
| 01 | 여섯 개의 수 $1, 3, x, 7, y, 11$이 순서대로 등차수열을 이룰 때, $y-x$의 값은? | ④ | 공차 2→x=5, y=9, y−x=4. | 없음 | KEEP_MATH |
| 02 | `다음 등차수열의 제10항은? $2, 5, 8, 11, ⋯$ ` | ⑤ | an=2+3(n−1)=3n−1→a10=29. | 없음 | KEEP_MATH |
| 03 | 첫째항이 2, 공비가 3인 등비수열의 첫째항부터 제5항까지의 합은? | ③ | S5=2(3^5−1)/(3−1)=242. | 없음 | KEEP_MATH |
| 04 | $\triangle ABC$에서 $a=\sqrt{6}$, $A=\dfrac{\pi}{3}$, $B=\dfrac{\pi}{4}$ 일 때, $b$의 값과 외접원의 반지름의 길이 $R$의 값을 알맞게 짝지은 것은? | ② | 사인법칙 2R=√6/sin60°=2√2; R=√2, b=2. | 없음 | KEEP_MATH |
| 05 | $\triangle ABC$에서 $a=7$, $b=3$, $c=8$ 일 때, $\cos A$의 값은? | ① | cosA=(3²+8²−7²)/(2·3·8)=1/2. | 없음 | KEEP_MATH |
| 06 | 삼각형 $ABC$에서 $\overline{AC}=12$, $\overline{BC}=8$, $\angle C=\dfrac{\pi}{6}$ 일 때, 삼각형 $ABC$의 넓이는? | ⑤ | (1/2)·12·8·sin30°=24. | image:q6.png | KEEP_MATH |
| 07 | 두 수열 $\{a_n\}, \{b_n\}$에 대하여 $\sum_{k=1}^{30}(3a_k-b_k-1)=10$, $\sum_{k=1}^{30}(2a_k+b_k)=35$ 일 때, $\sum_{k=1}^{30}b_k$의 값은? | ① | 3A−B=40, 2A+B=35→A=15, B=5. | 없음 | KEEP_MATH |
| 08 | 다음 그림과 같이 높이가 9인 원기둥이 있다. 윗면의 원의 둘레에 세 점 $A, B, C$를 잡아 삼각형 $ABC$를 만들었더니 $c=5$, $A=70^{\circ}$, $B=50^{\circ}$ 였다. 원기둥의 부피는? | ⑤ | C=60°, R=5/(2sin60°)=5/√3, V=πR²·9=75π. | image:q8.png | KEEP_MATH |
| 09 | 세 변의 길이가 $13, 14, 15$인 $\triangle ABC$의 내접원의 반지름의 길이는? | ① | 13-14-15 삼각형 넓이84, 반둘레21→내접반지름4. | 없음 | KEEP_MATH |
| 10 | 다음 그림과 같이 한 변의 길이가 8인 정육각형에서 변 $EF$의 중점을 $M$이라 하자. $\angle AMF=\theta$라 할 때, $7\cos\theta$의 값은? | ② | AF=8, FM=4, ∠AFM=120°→AM²=112; cos∠AMF=2/√7, 7cos=2√7. | image:q10.png | KEEP_MATH |
| 11 | $\sum_{k=1}^{10}(k+1)^2 - \sum_{k=1}^{10}k(k-2)$의 값은? | ② | (k+1)²−k(k−2)=4k+1; k=1..10 합230. | 없음 | KEEP_MATH |
| 12 | 모든 항이 양수인 등비수열 $\{a_n\}$에 대하여 $\dfrac{a_2 a_6}{a_5}=8$, $a_3+a_7=24$ 일 때, $a_{11}$의 값은? | ② | a2a6/a5=a3=8, a3+a7=24→r^4=2; a11=a3(r^4)²=32. | 없음 | KEEP_MATH |
| 13 | 그림과 같이 반지름의 길이가 $R$인 원 $O$에 내접하는 삼각형 $ABC$가 있다. $\overline{AB}=5$, $\overline{AC}=6$, $\cos A = \dfrac{3}{5}$일 때, $32R$의 값은? | ④ | cosA=3/5, BC²=25+36−36=25, sinA=4/5; R=25/8→32R=100. | image:q13.png | KEEP_MATH |
| 14 | 아래 그림과 같이 가로와 세로의 길이가 각각 $n, \sqrt{3}n$인 직사각형의 두 대각선을 그어 생긴 삼각형을 $A_n$이라 하자. 이 삼각형 $A_n$에 외접하는 원의 넓이를 $a_n$이라 할 때, $\sum_{k=1}^{10}a_k | ③ | 매 n 직사각형 대각선-중점의 60° 삼각형 외접반지름 n/√3; Σπn²/3=385π/3→p=385. | image:q14.png | KEEP_MATH |
| 15 | 모든 항이 양수인 등차수열 $\{a_n\}$이 $\sqrt{3a_1}=\sqrt{a_9}$, $\sum_{k=1}^{12}\dfrac{1}{\sqrt{a_{k+1}}+\sqrt{a_k}}=\dfrac{2}{5}$를 만족시킬 때, $a_1$의 | ② | a9=3a1→8d=2a1, a1=4d; 유리화 합(√a13−√a1)/d=2/5→d=25, a1=100. | 없음 | KEEP_MATH |
| 16 | 반지름의 길이가 $2\sqrt{7}$인 원에 내접하고 $\angle A=\dfrac{\pi}{3}$인 삼각형 $ABC$가 있다. 점 $A$를 포함하지 않는 호 $BC$ 위의 점 $D$에 대하여 $\sin(\angle BCD)=\dfrac{2 | ③ | 사인법칙 BD=8; 내접사각형 BDC=120°, 코사인법칙 CD²+8CD−20=0→CD=2; 차6. | solutionImage:q16-solution.svg, image:q16.png | KEEP_MATH |
| 17 | 모든 항이 자연수이고 다음 조건을 만족하는 수열 $\{a_n\}$에 대하여, 가능한 모든 $a_1$의 값의 합은? (가) 모든 자연수 $n$에 대하여 $a_{n+1}=$ $\dfrac{a_n}{4}$ ($a_n$이 4의 배수인 경우) $a_ | ⑤ | 정수 순환 조건을 첫 3항 역추적으로 분기, a1=17,80,29,128; 합254. 경로별 초기 순환 배제 확인. | solutionImage:q17-solution-v2.svg | KEEP_MATH |
| 18 | 그림과 같이 선분 $AB$를 지름으로 하는 반원의 호 $AB$ 위에 두 점 $C, D$가 있다. 선분 $AB$의 중점 $O$에 대하여 두 선분 $AD, CO$가 점 $E$에서 만나고, $\angle CEA=\dfrac{3}{4}\pi$, $ | ④ | 교차점 E의 각·반원 내접각으로 AE=4√2, AC²=80, CD²=10→차70. | solutionImage:q18-solution.svg, image:q18.png | KEEP_MATH |
| 19 | 수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라고 하자. $S_n = n^2 + 2n + 3$일 때, $a_1 + a_3 + a_5$의 값을 풀이과정과 함께 상세하게 서술하시오. | 24 | S1=6 예외, n≥2 an=2n+1; a1+a3+a5=6+7+11=24. | 없음 | KEEP_MATH |
| 20 | 집합 $A = \{x \mid 2\cos^2\dfrac{\pi x}{2} > 1 - \cos\dfrac{\pi x}{2}\}$에 대하여 실수 전체의 집합에서 정의된 함수 $f(x) = \begin{cases} 2 & (x \in A) \\  | 83 | 자연수 k에서 cos(πk/2)=1 ⇔ k≡0(mod4); Σkf(k)=8r(r+1)/2=440→r=10, 40≤n≤43→83. | 없음 | KEEP_MATH |
| 21 | 아래 그림과 같이 $\angle ABC=90^{\circ}$인 직각삼각형 $ABC$에 대하여, 세 정사각형 $ABED, BCGF, ACHI$는 서로 겹치지 않는다. 선분 $AC$의 길이가 1이고 세 선분 $EF, DI, GH$의 길이가 순서 | 27 | 등비 조건 EF,DI,GH→삼각형 변 제곱과 ab 산출; (S1+S2+S3)²=−3+(3/4)√21, p²+32q²=27. | image:q21.png | KEEP_MATH |

## 이미지별 렌더·육안 검수 대장 (11/11)

| # | Q | 필드 | 원본 파일 | Git blob SHA | 재현 방법 | 판정/예약 |
|---:|---:|---|---|---|---|---|
| 01 | 06 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q6.png` | `0c9da1077dd91931ffe42d0d0456620c43918467` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 02 | 08 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q8.png` | `544b6e3f392f03c57e269088489c966e4d97ea8d` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 03 | 10 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q10.png` | `51172f10136d3277a090ae840b9348d22793e04e` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 04 | 13 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q13.png` | `6c84a795bdc88e10d5f9111961bdd79badeb1e89` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 05 | 14 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q14.png` | `a12f78b9efbf8bbe542db6802a9b11016d5c619c` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 06 | 16 | `solutionImage` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q16-solution.svg` | `bc20b013c37c1187f167a72760e7a72477850b9e` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 07 | 16 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q16.png` | `2d00be54ee4ef85e6b7e562e4895453b2873697f` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 08 | 17 | `solutionImage` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q17-solution-v2.svg` | `771cb0cc6541b7c073cfdb18981b861dae5c8c24` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 09 | 18 | `solutionImage` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q18-solution.svg` | `5a977205120a90ad04d16c043911ef8bfde5c3c1` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 10 | 18 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q18.png` | `6ade4868d6c9db280296a44dd6e20f14cf48e1a2` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 11 | 21 | `image` | `archive/assets/images/25_금당고_1학기_기말_고2_수학I/q21.png` | `8ad36203cb0cfa747611e3b66685f50256c04c54` | PNG decode(Pillow) | OBSERVED_NO_FLAG |

## 엔진 인계 예약 및 출고 차단

- 금번 원본 이미지 관찰에서 별도 예약으로 지정한 신규 결함 없음. 실제 학생 UI 종합검증 결과를 의미하지 않음.

- **수학 검산과 원본 시각 검수는 서로 다른 판정층**이다. `KEEP_MATH` 문항이라도 `VISUAL_UPGRADE` 원본 교체 예약은 유효하다.
- `HOLD_VISUAL_SOURCE`는 그림에서 값을 독립 재현할 수 없는 문항으로, 깨끗한 원출처/재스캔 또는 판독 가능한 본문 근거가 마련되어야 해제한다.
- 엔진 담당: 원본을 수정하기 전에 관련 시험지의 예약을 점검하고, 이미지 변경 시 참조 경로 및 SHA·문항 텍스트 매칭을 다시 확인하라. 이미지를 실제 화면에 렌더해 도형·레이블·선택지 중복을 관찰하고, 수학 해설 교차검산과 CI 회귀를 별도로 수행하라.

## 이번 배치 누적 인계

- 본 회차 **5개 학교/시험지, 115문항, 이미지 57개(PNG 23·SVG 34)** 모두 문서로 기록.
- 전체 대수 85개 시험지 중 **61개 문서화(기존 56개 + 이번 5개)**, **1,359/1,903문항(기존 1,244문항 + 115문항)**.
- 미완료 **24개 시험지/544문항**(일반 기말 22개 498문항 + C 계열 2개 46문항), 시점 기준 계획 수량.
- 이번 회차 해설 검산: **KEEP_MATH 114 / HOLD_VISUAL_SOURCE 1**; **이미지 예약 3건(재크롭 2, 원본 판독 보류 1)**. 다른 회차 결과와 중복 집계하지 말 것.
- 작업 범위는 MD 기록 및 인계에 한정되며, 배포 가능 판정은 별도 운영 기준 충족 이후에만 내린다.
