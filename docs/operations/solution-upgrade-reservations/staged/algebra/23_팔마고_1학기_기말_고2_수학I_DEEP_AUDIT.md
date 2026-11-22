# 23_팔마고_1학기_기말_고2_수학I — 1학기 기말 고2 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> **문서 전용(engine handoff) 검수 기록.** 시험 원본 JS, 학생 UI, 원본 PNG/SVG, 엔진은 수정하지 않았다. 수학적 KEEP는 정식 배포/런타임 PASS가 아니다.

## 범위·원본 고정

- 대상: **23학년도 팔마고 1학기 기말**, 식별자 `23_팔마고_1학기_기말_고2_수학I`.
- 브랜치: `work/solution-upgrade-lane-30-20261121`.
- 원본 JS: `archive/exams/original/high/h2/1final/23_팔마고_1학기_기말_고2_수학I.js` (Git blob SHA `3a90b0fa6e8b5474180422e71ff12c231ebd9188`), **22문항**.
- 직접 참조 원본 이미지: **9개 (PNG 2 / SVG 7)**; `image`/`solutionImage`뿐 아니라 HTML 발문 내부 `<img src>` 포함, 아래 경로·SHA 확인.
- 검수: 원문 발문/보기/정답/현재 해설 및 핵심 계산·제약 조건 대조. **해설 KEEP_MATH 22 / HOLD_VISUAL_SOURCE 0**.
- 이미지: 원본 9개를 전부 확보, PNG 디코드 또는 SVG→PNG 렌더 성공 **9/9**, 연락시트 관찰 및 필요한 이미지 확대 검토. 렌더 오류 **0**.
- 이미지 예약: **0개** (없음); 기타 직접 참조 9개는 이번 원본 정지 화면 관찰에서 특정 결함을 지정하지 않음.
- 제외: 실제 앱 레이아웃·MathJax 런타임, 모바일, preflight/CI/ALIVE/Golden/Negative, 원본 이미지 교체 및 엔진 코드 반영 모두 **NOT_RUN**.

## 문항별 해설 검산 대장 (22/22)

| Q | 발문 식별자(앞부분) | 기존 정답 | 검산 근거(분기·수치·경계) | 참조 원본 | 해설 판정 |
|---:|---|---|---|---|---|
| 01 | 삼각부등식 $\cos x\le -\dfrac{1}{2}$의 해는? (단, $0\le x<2\pi$) | ④ | cosx≤−1/2의 닫힌 구간 [2π/3,4π/3]. | solutionImage:q1-solution.svg | KEEP_MATH |
| 02 | 등비수열 $\{a_n\}$에 대하여 $a_2=6$, $a_5=48$일 때 공비 $r$의 값은? | ② | a5/a2=r³=48/6=8→r=2. | 없음 | KEEP_MATH |
| 03 | 두 수열 $\{a_n\}$, $\{b_n\}$에 대하여 $\sum_{k=1}^{10}a_k=5$, $\sum_{k=1}^{10}b_k=10$일 때, $\sum_{k=1}^{10}(3a_k+2b_k-1)$의 값은? | ① | 3Σa+2Σb−10=3·5+2·10−10=25. | 없음 | KEEP_MATH |
| 04 | 반지름의 길이가 6인 원에 내접하는 삼각형 $ABC$가 있다. $A=120^\circ$일 때, 이 삼각형의 가장 긴 변의 길이는? | ③ | 최대각 A=120°의 대변 a=2·6sin120°=6√3. | solutionImage:q4-solution.svg | KEEP_MATH |
| 05 | 이차방정식 $x^2-6x+2=0$의 서로 다른 두 실근 $\alpha$, $\beta$에 대하여 세 수 $\alpha^2$, $k$, $\beta^2$이 이 순서대로 등차수열을 이룰 때, $k$의 값은? | ④ | 근의 합6·곱2, (α²+β²)/2=(36−4)/2=16. | 없음 | KEEP_MATH |
| 06 | 삼각형 $ABC$에서 $b=\sqrt5$, $c=\sqrt2$, $B=135^\circ$일 때, 삼각형 $ABC$의 넓이는? | ① | b²=a²+c²−2accosB→a²+2a−3=0→a=1, 면적 (1/2)·a·c·sin135°=1/2. | solutionImage:q6-solution.svg | KEEP_MATH |
| 07 | $\sin A+\sin B-\sin(A+B)=2\sin A\cos C$를 만족시킬 때 다음 중 삼각형 $ABC$의 모양으로 항상 옳은 것은? | ② | 삼각함수 항등식으로 −4sin((A−C)/2)sin(A/2)sin(C/2)=0; 내각 양수→A=C. | 없음 | KEEP_MATH |
| 08 | 등차수열 $\{a_n\}$에 대하여 $a_3=7$, $a_8=-13$일 때, $\sum_{k=1}^{10}\|a_k\|$의 값은? | ③ | d=(−13−7)/5=−4, a1=15; \|15\|+\|11\|+⋯+\|−21\|=102. | 없음 | KEEP_MATH |
| 09 | $0\le \theta<2\pi$일 때, $x$에 대한 이차방정식 $6x^2+(4\cos\theta)x+\sin\theta=0$이 실근을 갖지 않도록 하는 $\theta$의 값의 범위가 $\alpha<\theta<\beta$일 때, $\al | ⑤ | 실근 없음 D=16cos²θ−24sinθ<0 ⇔ sinθ>1/2→π/6<θ<5π/6, 끝점 합π. | 없음 | KEEP_MATH |
| 10 | 첫째항이 3이고 공비가 $r$인 등비수열 $\{a_n\}$과 자연수 $k$는 다음 조건을 만족시킨다. $r+k$의 값은? (가) $a_1+a_3+a_5+\cdots+a_{2k-1}=63$ (나) $a_2+a_4+a_6+\cdots+a_{2k | ③ | 짝수항 합= r×홀수항 합→r=126/63=2; 3(4^k−1)/3=63→k=3; r+k=5. | 없음 | KEEP_MATH |
| 11 | $\sum_{k=1}^{11}k^2+\sum_{k=2}^{11}k^2+\sum_{k=3}^{11}k^2+\cdots+\sum_{k=11}^{11}k^2$의 값은? | ⑤ | 중첩합에서 k²은 k회 등장→Σk³=(11·12/2)²=4356. | 없음 | KEEP_MATH |
| 12 | 월이율이 $0.5\%$이고, 1개월마다 복리로 매월 초에 12개월 동안 저금하려고 한다. 첫 달에 200만원을 저금하고 그 다음달부터는 전월보다 $0.5\%$ 많은 금액을 저금한다고 할 때, 12개월 말까지 저금한 금액의 원리합계는? (단, | ④ | n번째 월초 적립액 200(1.005)^(n−1), 만기 복리기간 13−n개월→각 납입 미래가치 200(1.005)^12; 12개 합2544만원. | 없음 | KEEP_MATH |
| 13 | $0\le x<2\pi$일 때, 방정식 $2\cos3x+3\tan3x=0$을 만족시키는 모든 실수 $x$의 개수는 $p$이고 모든 실수 $x$의 값의 합은 $k\pi$이다. $2p+k$의 값은? | ⑤ | t=3x, cos t≠0; 2sin²t−3sint−2=0→sint=−1/2; 0≤t<6π에서 6근, x합7π; 2p+k=19. | 없음 | KEEP_MATH |
| 14 | 첫째항이 3이고 공차가 2인 등차수열 $\{a_n\}$에 대하여 부등식 $\sum_{k=1}^{m}\dfrac{1}{a_ka_{k+1}}\ge \dfrac{1}{7}$을 만족시키는 자연수 $m$의 최소값은? | ② | 부분분수 Σ1/[(2k+1)(2k+3)]=(1/2)(1/3−1/(2m+3))≥1/7→m≥9. | 없음 | KEEP_MATH |
| 15 | $a_1=2$인 수열 $\{a_n\}$이 자연수 $n$에 대하여 $2(a_1+a_2+a_3+\cdots+a_n)=(n+1)a_n$이 성립할 때, $a_{100}$의 값은? | ④ | 2S_n=(n+1)an와 다음 항 차분→an=2n→a100=200. | 없음 | KEEP_MATH |
| 16 | $0\le x<2\pi$에서 부등식 $2\sin^2\left(\dfrac{x-\pi}{3}\right)-\cos\left(\dfrac{2x+\pi}{6}\right)<0$의 해가 $\alpha<x<\beta$일 때, $4\alpha+2\be | ① | t=(x−π)/3∈[−π/3,π/3); −1/2<sin t<0→π/2<x<π, 4α+2β=4π. | 없음 | KEEP_MATH |
| 17 | 그림과 같이 원에 길이가 각각 2, 3, 4인 세 개의 현이 있다. 이 세 개의 현 각각에 대응하는 중심각의 크기를 각각 $\theta_1$, $\theta_2$, $\theta_3$이라 할 때, $\theta_3=\theta_1+\thet | ② | 현의 반길이 sin(θi/2) 비 2:3:4; 중심각 합과 cos 연립→cos(θ₂/2)=11/16, cosθ₂=−7/128. | solutionImage:q17-solution.svg, image:q17.png | KEEP_MATH |
| 18 | [서답형1(단답형1)] 삼각형 $ABC$가 다음 조건을 만족시킨다. (가) $\cos^2 A+\cos^2 B-\cos^2 C=1$ (나) $2\tan(\pi-A)+\tan(\pi+B)-\tan\left(\dfrac{\pi}{4}-C\righ | $\dfrac{15\pi}{2}$ | 첫 조건으로 C=90°, tanA=1/2, 직각변 비 1:2; 면적6→빗변²=30, R²=15/2, 원넓이15π/2. | solutionImage:q18-solution.svg | KEEP_MATH |
| 19 | [서답형2(단답형2)] 모든 항이 자연수인 등차수열 $\{a_n\}$의 첫째항을 $a$, 공차를 $d$($d\ne0$)이라 하자. $a_1+a_3+a_5+a_7=120$일 때, $a\times d$의 최댓값을 구하시오. | 75 | 홀수 네 항 합4a+12d=120→a=30−3d, 모든 항 자연수→d>0 정수; ad=−3(d−5)²+75 최대75. | 없음 | KEEP_MATH |
| 20 | [서답형3(서술형1)] 다음 그림과 같이 $\overline{AB}=7$, $\overline{BC}=8$, $\overline{CA}=5$인 삼각형 $ABC$에서 $\overline{BC}$를 $3:1$로 내분하는 점을 $D$라고 할 때, | $\sqrt{19}$ | 스튜어트: 5²·6+7²·2=8(AD²+12)→AD²=19→√19. | solutionImage:q20-solution.svg, image:q20.png | KEEP_MATH |
| 21 | [서답형4(서술형2)] 이차함수 $f(x)=-x^2+x\sin\theta+\cos\theta+1$의 그래프와 $x$축의 교점의 $x$좌표가 모두 $-1$보다 크고 $1$보다 작을 때, $\theta$의 값의 범위는 $\alpha<\theta | $\dfrac{7\pi}{4}$ | 두 교점이 (−1,1) 내에 있으려면 f(−1)<0,f(1)<0이며 근 존재 확인; θ 교집합 (3π/4,5π/4), 2β−α=7π/4. | solutionImage:q21-solution.svg | KEEP_MATH |
| 22 | [서답형5(서술형3)] 수열 $\{a_n\}$이 모든 자연수 $n$에 대하여 $\sum_{k=1}^{n}a_k=n^2+2n+1$을 만족시킨다. $\sum_{k=1}^{10}ka_k$의 값을 구하시오. | 826 | S1=4 예외, n≥2 an=2n+1; 4+Σk=2..10 k(2k+1)=4+768+54=826. | 없음 | KEEP_MATH |

## 이미지별 렌더·육안 검수 대장 (9/9)

| # | Q | 필드 | 원본 파일 | Git blob SHA | 재현 방법 | 판정/예약 |
|---:|---:|---|---|---|---|---|
| 01 | 01 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q1-solution.svg` | `4399948e79524f13c38a62f9ea6fd110acbba9fd` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 02 | 04 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q4-solution.svg` | `f0887d206e1067ecb9937f8550d42d6bc82f077f` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 03 | 06 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q6-solution.svg` | `ce07c5fcea68e569edf98545093849b82f845147` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 04 | 17 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q17-solution.svg` | `d0ae24866c7c745c8b306c0a10b65ac36f4a870d` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 05 | 17 | `image` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q17.png` | `15d86298751aade4c518994f3df197e60c9871cb` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 06 | 18 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q18-solution.svg` | `622fc8a999ffeb340e67589623dd8b5793f32575` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 07 | 20 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q20-solution.svg` | `55852d4622457304066b3f763c138fdc61755647` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 08 | 20 | `image` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q20.png` | `1f3dd60bd3741555d30ab9b071df47e40efdcff1` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 09 | 21 | `solutionImage` | `archive/assets/images/23_팔마고_1학기_기말_고2_수학I/q21-solution.svg` | `4936a5e21136d0427af54a8028466be0379bdd4e` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |

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
