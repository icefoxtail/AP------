# 26_강남여고_1학기_2차_고2_대수 — 1학기 2차 고2 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> **문서 전용(engine handoff) 검수 기록.** 시험 원본 JS, 학생 UI, 원본 PNG/SVG, 엔진은 수정하지 않았다. 수학적 KEEP는 정식 배포/런타임 PASS가 아니다.

## 범위·원본 고정

- 대상: **26학년도 강남여고 1학기 2차**, 식별자 `26_강남여고_1학기_2차_고2_대수`.
- 브랜치: `work/solution-upgrade-lane-30-20261121`.
- 원본 JS: `archive/exams/original/high/h2/1final/26_강남여고_1학기_2차_고2_대수.js` (Git blob SHA `4c842ecffe92136b069bbc28c6243018f722d1da`), **25문항**.
- 직접 참조 원본 이미지: **10개 (PNG 3 / SVG 7)**; `image`/`solutionImage`뿐 아니라 HTML 발문 내부 `<img src>` 포함, 아래 경로·SHA 확인.
- 검수: 원문 발문/보기/정답/현재 해설 및 핵심 계산·제약 조건 대조. **해설 KEEP_MATH 25 / HOLD_VISUAL_SOURCE 0**.
- 이미지: 원본 10개를 전부 확보, PNG 디코드 또는 SVG→PNG 렌더 성공 **10/10**, 연락시트 관찰 및 필요한 이미지 확대 검토. 렌더 오류 **0**.
- 이미지 예약: **2개** (VISUAL_UPGRADE, VISUAL_UPGRADE); 기타 직접 참조 8개는 이번 원본 정지 화면 관찰에서 특정 결함을 지정하지 않음.
- 제외: 실제 앱 레이아웃·MathJax 런타임, 모바일, preflight/CI/ALIVE/Golden/Negative, 원본 이미지 교체 및 엔진 코드 반영 모두 **NOT_RUN**.

## 문항별 해설 검산 대장 (25/25)

| Q | 발문 식별자(앞부분) | 기존 정답 | 검산 근거(분기·수치·경계) | 참조 원본 | 해설 판정 |
|---:|---|---|---|---|---|
| 01 | 반지름의 길이가 $4$인 원에 내접하는 삼각형 $ABC$에서 $\angle A = 40^\circ, \angle C = 80^\circ$일 때, $\overline{CA}$의 값은? (3점) | ④ | B=60°, 사인법칙 CA=2·4·sin60°=4√3. | solutionImage:q1-solution.svg | KEEP_MATH |
| 02 | 삼각형 $ABC$의 외접원의 넓이가 $16\pi$이고 $\overline{BC} = 4$일 때, $\sin A$의 값은? (3점) | ③ | 외접원 넓이 16π에서 R=4; sinA=BC/(2R)=1/2. | solutionImage:q2-solution.svg | KEEP_MATH |
| 03 | 다음 그림과 같은 삼각형 $ABC$의 넓이를 구하면? (3점) [그림] | ④ | 도형 AB=7, BC=4√2, B=3π/4; 넓이 (1/2)·7·4√2·√2/2=14. | content:q03.png, solutionImage:q3-solution.svg | KEEP_MATH |
| 04 | 다음은 등차수열의 일반항 $a_n$을 구한 것이다. (가) 첫째항이 $-5$, 공차가 $3$인 등차수열의 일반항 $a_n = [\quad]$ (나) 등차수열 $3, 1, \cdots$의 일반항 $a_n = [\quad]$ 위의 (가), (나 | ① | 등차 일반항 f(n)=3n−8, g(n)=5−2n; f(3)+g(2)=1+1=2. | 없음 | KEEP_MATH |
| 05 | 첫째항이 $16$, 공비가 $-\dfrac{1}{2}$인 등비수열의 제$5$항과 첫째항이 $\dfrac{1}{9}$, 공비가 $3$인 등비수열의 제$5$항의 합은? (3점) | ② | 5항 계산: 16(−1/2)^4=1, (1/9)3^4=9; 합 10. | 없음 | KEEP_MATH |
| 06 | 제$3$항이 $8$이고 제$10$항이 $29$인 등차수열의 첫째항부터 제$20$항까지의 합 $S_{20}$의 값은? (3.5점) | ⑤ | a10−a3=7d=21, d=3, a1=2; S20=10(2+59)=610. | 없음 | KEEP_MATH |
| 07 | 첫째항부터 제$4$항까지의 합 $S_4$가 $5$, 첫째항부터 제$8$항까지의 합 $S_8$이 $85$인 등비수열의 첫째항과 공비의 합은? (단, 첫째항은 양수이다.) (3.5점) | ④ | S8/S4=17→r^4=16; a1>0 제약으로 r=2, a1=1/3; 합 7/3. | 없음 | KEEP_MATH |
| 08 | $\sum_{k=1}^7 a_k = -5, \sum_{k=1}^7 b_k = 10$일 때, 다음 식의 값이 옳지 않은 것은? (3.5점) | ③ | Σ(a+b)=5, Σ(a−b)=−15, Σ5a=−25, Σ5=35; Σab는 두 합만으로 결정 불가. | 없음 | KEEP_MATH |
| 09 | 공차가 $0$이 아닌 등차수열 $\{a_n\}$에 대하여 세 수 $a_2, a_4, a_7$이 순서대로 등비수열을 이룰 때, $\dfrac{a_{12}}{a_5}$의 값은? (3.5점) | ② | (a+3d)^2=(a+d)(a+6d), d≠0→a=3d; a12/a5=14/7=2. | 없음 | KEEP_MATH |
| 10 | 삼각형 $ABC$에서 $\overline{AB} = 2\sqrt{6}, \angle A = \dfrac{\pi}{4}, \angle B = \dfrac{5}{12}\pi$일 때, $\overline{BC}$의 값을 $a$, 삼각형 $DEF$ | ⑤ | 첫 삼각형 C=60°→BC=4; 두 번째 코사인법칙 b²−4b−5=0→b=5; 합 9. | solutionImage:q10-solution.svg | KEEP_MATH |
| 11 | 반지름의 길이가 $2$인 원 위의 세 점 $A, B, C$가 $\text{호 } AB : \text{호 } BC : \text{호 } CA = 5 : 5 : 2$를 만족시킬 때, 삼각형 $ABC$의 넓이는 $p + q\sqrt{3}$이다.  | ⑤ | 호 중심각 150°,150°,60°; 면적 2(sin150°+sin150°+sin60°)=2+√3, p/q=2. | solutionImage:q11-solution.svg | KEEP_MATH |
| 12 | 그림과 같이 원에 내접하는 사각형 $ABCD$에 대하여 $\overline{AB} = 5, \overline{BC} = 3, \overline{CD} = \overline{DA} = 7$일 때, 사각형 $ABCD$의 넓이는? (4점) [그림 | ① | 대각선 AC=x, 내접사각형 반대각 코사인 부호로 x=7; 면적 (15+49)√3/4=16√3. 원본 그림 크롭 오염은 별도 예약. | solutionImage:q12-solution-v2.svg, content:q12.png | KEEP_MATH |
| 13 | 등차수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. $a_3 + a_8 = 13$일 때, $S_6 + S_{12}$의 값은? (4점) | ② | a3+a8=2a+9d=13; S6+S12=9(2a+9d)=117. | 없음 | KEEP_MATH |
| 14 | 수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=3\times2^{n+1}-6$일 때, $a_2+a_4+a_6$의 값은? (4점) | ⑤ | n≥2에서 an=Sn−S(n−1)=3·2^n; a2+a4+a6=12+48+192=252. | 없음 | KEEP_MATH |
| 15 | 두 수열 $\{a_n\}, \{b_n\}$의 일반항이 $a_n = 2n - 1, b_n = 2 \times 3^{n-1}$일 때, $\sum_{k=1}^5 (a_{3k} + b_{2k})$의 값은 $p + \dfrac{3}{4}(q^r -  | ④ | Σa3k=85, Σb2k=(3/4)(9^5−1); (p,q,r)=(85,9,5). | 없음 | KEEP_MATH |
| 16 | 첫째항이 $41$인 등차수열 $\{a_n\}$에서 $a_7 = 11$일 때, $\|a_n\|$이 최소가 되는 자연수 $n$의 값은? (4.5점) | ③ | d=(11−41)/6=−5; an=46−5n, \|a9\|=1<\|a10\|=4, n=9. | 없음 | KEEP_MATH |
| 17 | $a_1 = 2$인 수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 하자. 수열 $\{a_{2n-1}\}$은 공비가 $2$인 등비수열이고, 모든 자연수 $n$에 대하여 $S_{2n} = 3$일 때, $a_{10} -  | ③ | 짝수 부분합 S2n=3으로 n≥2에서 a2n=−a(2n−1); a10=−32, a14=−128→96. | 없음 | KEEP_MATH |
| 18 | 모든 항이 양수인 등비수열 $\{a_n\}$에 대하여 $a_1 = 2$, $a_4 = 6a_2 + a_3$일 때, $\log_3(a_1 + a_2 + a_3 + \cdots + a_{15} + 1) + 5$의 값은? (4.5점) | ② | 2r³=12r+2r², r>0→r=3; S15=3^15−1, 로그와 상수 합 20. | 없음 | KEEP_MATH |
| 19 | 다음은 두 학생 A, B의 적립금의 원리합계에 대한 내용이다. A학생의 적립금의 원리합계를 $a$, B학생의 적립금의 원리합계를 $b$라고 할 때, $\|a - b\|$의 값은? (단, $1.005^{12} = 1.06, 1.006^{24} | ① | 월초 납입 연금선불; A=200000×1.005×12=2,412,000, B=100000×1.006×25=2,515,000; 차 103,000원. | 없음 | KEEP_MATH |
| 20 | 함수 $y = \sin \pi x$ ($x \ge 0$)의 그래프와 직선 $y = \dfrac{1}{2}$이 만나는 점의 $x$좌표를 작은 수부터 크기순으로 나열한 것을 $a_1, a_2, a_3, \cdots$이라 하자. $\sum_{n= | ⑤ | sinπx=1/2에서 홀수·짝수 교점 2(n−1)+1/6, 2(n−1)+5/6; 12쌍 합 118. 원본 그래프 크롭 오염은 별도 예약. | solutionImage:q20-solution-v2.svg, content:q20.png | KEEP_MATH |
| 21 | 수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 $a_n = (-1)^{1+2+3+\cdots+n}$을 만족시킬 때, $\sum_{n=1}^{30} n a_n$의 값은? (4.5점) | ④ | (−1)^(n(n+1)/2) 부호가 −−++ 4주기; 처음28항 가중합28, 마지막 −29−30→−31. | 없음 | KEEP_MATH |
| 22 | [서술형 1] 삼각형 $ABC$에 대하여 $\dfrac{\sin A}{\sin B} = \cos C$일 때, 삼각형 $ABC$는 어떤 삼각형인지 구하시오. (4점) | ∠B=90°, 직각삼각형 | sinA/sinB=a/b=cosC; c²=a²+b²−2abcosC=b²−a²→B=90°. | 없음 | KEEP_MATH |
| 23 | [서술형 2] 수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라 할 때, $S_n = -n^2 + 9n - 10$이다. $a_m > 0$을 만족시키는 자연수 $m$을 모두 구하시오. (5점) | m=2, 3, 4 | S1=−2는 예외; n≥2에서 an=10−2n, an>0인 m=2,3,4. | 없음 | KEEP_MATH |
| 24 | [서술형 3] 수열 $\{a_n\}$의 일반항이 $a_n = \dfrac{1}{(2n-1)(2n+1)}$일 때, $\sum_{k=1}^{10} a_k = \dfrac{p}{q}$이다. $p, q$를 차례대로 구하고, $p + q$의 값을 구 | p=10, q=21, p+q=31 | 1/[(2k−1)(2k+1)]=(1/2)[1/(2k−1)−1/(2k+1)]; 10항 합10/21→p+q=31. | 없음 | KEEP_MATH |
| 25 | [서술형 4] 모든 자연수 $n$에 대하여 다음 등식이 성립함을 수학적 귀납법으로 증명하시오. (단, 주어진 수학적 귀납법의 순서대로 서술한다.) (6점) $$\dfrac{1}{1 \times 2} + \dfrac{1}{2 \times 3} | 주어진 등식은 모든 자연수 n에 대해 성립한다. | 귀납 기초 n=1, 가정 n=k; k/(k+1)+1/[(k+1)(k+2)]=(k+1)/(k+2). | 없음 | KEEP_MATH |

## 이미지별 렌더·육안 검수 대장 (10/10)

| # | Q | 필드 | 원본 파일 | Git blob SHA | 재현 방법 | 판정/예약 |
|---:|---:|---|---|---|---|---|
| 01 | 01 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q1-solution.svg` | `b035eb06df3278814427cb9406002207bfacc21c` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 02 | 02 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q2-solution.svg` | `906335f5d1dc889f363dc7f2e4a7160a25ff8f51` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 03 | 03 | `content` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q03.png` | `cfe7783465e41470d63a4b4da98d2760f950c5ef` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 04 | 03 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q3-solution.svg` | `c3c2ea4ded4a820edc6e263cc83008afcf9fa113` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 05 | 10 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q10-solution.svg` | `13453e330af107cea697c316c602c27178a5c603` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 06 | 11 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q11-solution.svg` | `0e314e653515df8d45608748ca4a423803851bd9` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 07 | 12 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q12-solution-v2.svg` | `87d8bd83c420359daca2874667c2513080c688f6` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 08 | 12 | `content` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q12.png` | `b737a21f62a43125b6a86fb6ad63d56429f0155c` | PNG decode(Pillow) | VISUAL_UPGRADE |
| 09 | 20 | `solutionImage` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20-solution-v2.svg` | `00a34bebd78d691c21d5430c6a2d5183cda56611` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 10 | 20 | `content` | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20.png` | `9373db4a1fdb318808be64e6ec6339039bed7f45` | PNG decode(Pillow) | VISUAL_UPGRADE |

## 엔진 인계 예약 및 출고 차단

| 문항 | 유형 | 손상 소스(불변 식별자) | 관찰/요청 사항 | 후속 검증 |
|---|---|---|---|---|
| Q12 | VISUAL_UPGRADE | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q12.png` (`b737a21f62a43125b6a86fb6ad63d56429f0155c`) | q12.png 원본에 도형 아래쪽 타 문항/선택지 '③ 18√3'가 함께 포함됨. 학생 발문 HTML에서 별도 선택지가 이미 있으므로 순수 원 그림만 재크롭. 정답 ① 16√3은 해설 수식과 일치. | 엔진 작업 큐: 원본 재확보/크롭/가독성 비교 후 실제 학생 UI 재검수 |
| Q20 | VISUAL_UPGRADE | `archive/assets/images/26_강남여고_1학기_2차_고2_대수/q20.png` (`9373db4a1fdb318808be64e6ec6339039bed7f45`) | q20.png의 그래프 위쪽 텍스트 잔여와 하단 선택지 ①106~⑤118이 포함되어 content/choices와 이중 표현. 그래프 선·축만 재크롭; 해설 이미지 q20-solution-v2.svg는 유지. | 엔진 작업 큐: 원본 재확보/크롭/가독성 비교 후 실제 학생 UI 재검수 |

- **수학 검산과 원본 시각 검수는 서로 다른 판정층**이다. `KEEP_MATH` 문항이라도 `VISUAL_UPGRADE` 원본 교체 예약은 유효하다.
- `HOLD_VISUAL_SOURCE`는 그림에서 값을 독립 재현할 수 없는 문항으로, 깨끗한 원출처/재스캔 또는 판독 가능한 본문 근거가 마련되어야 해제한다.
- 엔진 담당: 원본을 수정하기 전에 관련 시험지의 예약을 점검하고, 이미지 변경 시 참조 경로 및 SHA·문항 텍스트 매칭을 다시 확인하라. 이미지를 실제 화면에 렌더해 도형·레이블·선택지 중복을 관찰하고, 수학 해설 교차검산과 CI 회귀를 별도로 수행하라.

## 이번 배치 누적 인계

- 본 회차 **5개 학교/시험지, 115문항, 이미지 57개(PNG 23·SVG 34)** 모두 문서로 기록.
- 전체 대수 85개 시험지 중 **61개 문서화(기존 56개 + 이번 5개)**, **1,359/1,903문항(기존 1,244문항 + 115문항)**.
- 미완료 **24개 시험지/544문항**(일반 기말 22개 498문항 + C 계열 2개 46문항), 시점 기준 계획 수량.
- 이번 회차 해설 검산: **KEEP_MATH 114 / HOLD_VISUAL_SOURCE 1**; **이미지 예약 3건(재크롭 2, 원본 판독 보류 1)**. 다른 회차 결과와 중복 집계하지 말 것.
- 작업 범위는 MD 기록 및 인계에 한정되며, 배포 가능 판정은 별도 운영 기준 충족 이후에만 내린다.
