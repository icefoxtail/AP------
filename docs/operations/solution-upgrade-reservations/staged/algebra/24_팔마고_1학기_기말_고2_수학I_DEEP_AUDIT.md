# 24_팔마고_1학기_기말_고2_수학I — 1학기 기말 고2 해설 DEEP AUDIT + 이미지 실물 렌더 검수 (2026-11-22)

> **문서 전용(engine handoff) 검수 기록.** 시험 원본 JS, 학생 UI, 원본 PNG/SVG, 엔진은 수정하지 않았다. 수학적 KEEP는 정식 배포/런타임 PASS가 아니다.

## 범위·원본 고정

- 대상: **24학년도 팔마고 1학기 기말**, 식별자 `24_팔마고_1학기_기말_고2_수학I`.
- 브랜치: `work/solution-upgrade-lane-30-20261121`.
- 원본 JS: `archive/exams/original/high/h2/1final/24_팔마고_1학기_기말_고2_수학I.js` (Git blob SHA `55385ed1b1dd2f28f298e8f0c2efee7bf30069ad`), **22문항**.
- 직접 참조 원본 이미지: **16개 (PNG 4 / SVG 12)**; `image`/`solutionImage`뿐 아니라 HTML 발문 내부 `<img src>` 포함, 아래 경로·SHA 확인.
- 검수: 원문 발문/보기/정답/현재 해설 및 핵심 계산·제약 조건 대조. **해설 KEEP_MATH 21 / HOLD_VISUAL_SOURCE 1**.
- 이미지: 원본 16개를 전부 확보, PNG 디코드 또는 SVG→PNG 렌더 성공 **16/16**, 연락시트 관찰 및 필요한 이미지 확대 검토. 렌더 오류 **0**.
- 이미지 예약: **1개** (VISUAL_HOLD_READABILITY); 기타 직접 참조 15개는 이번 원본 정지 화면 관찰에서 특정 결함을 지정하지 않음.
- 제외: 실제 앱 레이아웃·MathJax 런타임, 모바일, preflight/CI/ALIVE/Golden/Negative, 원본 이미지 교체 및 엔진 코드 반영 모두 **NOT_RUN**.

## 문항별 해설 검산 대장 (22/22)

| Q | 발문 식별자(앞부분) | 기존 정답 | 검산 근거(분기·수치·경계) | 참조 원본 | 해설 판정 |
|---:|---|---|---|---|---|
| 01 | $2\sin\dfrac{4}{3}\pi+3\tan\dfrac{4}{3}\pi$의 값은? [4점] | ④ | sin4π/3=−√3/2, tan4π/3=√3→2√3. | 없음 | KEEP_MATH |
| 02 | $A=45^\circ$, $B=30^\circ$, $\overline{BC}=4$인 삼각형 $ABC$가 있다. 외접원의 반지름의 길이를 $R$이라고 할 때, $R$과 선분 $AC$의 길이를 곱한 값은? [4.1점] | ③ | 2R=4/sin45°=4√2; AC=2√2, R·AC=8. | solutionImage:q2-solution.svg | KEEP_MATH |
| 03 | 다섯 개의 수 $2$, $x$, $8$, $y$, $14$가 이 순서대로 등차수열일 때, $y-x$의 값은? [4.1점] | ① | 다섯 항의 간격 d=(14−2)/4=3; x=5,y=11→6. | 없음 | KEEP_MATH |
| 04 | 수열 $\{a_n\}$의 첫째항부터 제$n$항까지의 합을 $S_n$이라고 하자. $S_n=n^2-2n$일 때, $a_6$의 값은? [4.1점] | ② | S6−S5=(36−12)−(25−10)=9. | 없음 | KEEP_MATH |
| 05 | 첫째항부터 제3항까지의 합이 $14$, 첫째항부터 제6항까지의 합이 $126$인 등비수열의 첫째항과 공비의 합은? [4.4점] | ① | S6/S3=9→r³=8→r=2, a1=14/(1+2+4)=2→합4. | 없음 | KEEP_MATH |
| 06 | $\displaystyle\sum_{k=1}^{10}a_{2k}=30$, $\displaystyle\sum_{k=1}^{10}a_{2k-1}=40$일 때, $\displaystyle\sum_{k=1}^{20}a_k$의 값은? [4.4점] | ② | 홀수항 합40+짝수항 합30=70. | 없음 | KEEP_MATH |
| 07 | 다음 중 함수 $y=\sqrt3\tan\dfrac{1}{3}x+2$에 대한 설명으로 옳지 않은 것은? [4.4점] | ⑤ | tan(x/3) 주기3π, 점근선 x=3π/2+3nπ; 제시 ⑤와 다름. | solutionImage:q7-solution.svg | KEEP_MATH |
| 08 | 어느 회사원이 연이율이 $2\%$이고, 1년마다 복리로 매년 초에 $100$만원씩 $10$년 동안 적립할 때, 10년 말까지 적립금의 원리합계는? (단, $1.02^{10}=1.22$로 계산, 단위는 만원) [4.4점] | ④ | 연초 선불 100·1.02(1.02^10−1)/0.02=1122만원(제시 근삿값 적용). | 없음 | KEEP_MATH |
| 09 | 함수 $y=a\sin(bx-c)$의 그래프가 다음과 같다. $a>0$, $b>0$, $0<c<\pi$일 때, $abc$의 값은? [4.3점] | ① | 이미지에서 진폭·주기·수평이동을 읽었다는 해설은 원본 그래프의 축 숫자/곡선 레이블 소실로 독립 확정 불가. a=3,b=2,c=π/3 ⇒ abc=2π는 조건부 계산만 확인. | solutionImage:q9-solution-v2.svg, image:q9.png | HOLD_VISUAL_SOURCE |
| 10 | 다음은 모든 자연수 $n$에 대하여 등식 $1+3+5+\cdots+(2n-1)=n^2$이 성립함을 증명하는 과정이다. 위의 증명에서 (가), (나), (다)에 알맞은 것을 차례대로 나열한 것은? [4.2점] (i) (가)일 때, 좌변$=1$ | ⑤ | 홀수 합 귀납: n=1, 다음 항 2k+1, k²+(2k+1)=(k+1)². | 없음 | KEEP_MATH |
| 11 | $0\le x<2\pi$일 때, 함수 $y=\cos2x$의 그래프와 직선 $y=-\dfrac{1}{4}$의 교점의 $x$좌표를 각각 $a$, $b$, $c$, $d$라고 하자. $a+b+c+d$의 값은? [4.3점] | ③ | cos2x=−1/4의 한 주기 두 근 합 π, 다음 주기 합3π→전체4π. | solutionImage:q11-solution.svg | KEEP_MATH |
| 12 | 어느 지역의 $t$월의 월평균 기온 $T(t)^\circ\mathrm{C}$가 $T(t)=6\sqrt3+12\cos\dfrac{\pi}{6}(t-1)$이었다. 이 지역의 월평균 기온이 $0^\circ\mathrm{C}$ 이하인 달은 모두 $ | ④ | cos[π(t−1)/6]≤−√3/2; 정수 월 t=6,7,8만 성립→48. | solutionImage:q12-solution.svg | KEEP_MATH |
| 13 | $0\le\alpha ㄱ. $\alpha \cos x$이면 $\beta-\alpha\le\pi$이다. ㄷ. $\|\sin\alpha\|>\|\cos\alpha\|=\dfrac{1}{3}$을 만족하는 모든 $\alpha$의 합은 $2\pi$이 | ③ | 삼각부등식 ㄱ·ㄴ 범위 대조; \|cosα\|=1/3의 네 해 합4π이므로 ㄷ의 2π는 거짓. | 없음 | KEEP_MATH |
| 14 | 함수 $y=2\cos2x-1$의 그래프와 함수 $y=\tan\left(3x-\dfrac{\pi}{4}\right)$의 그래프의 점근선이 만나는 모든 점의 $y$좌표 중에서 서로 다른 모든 $y$좌표의 곱은? [4.6점] | ③ | tan(3x−π/4) 점근선 x=π/4+nπ/3; y=−1,−1−√3,−1+√3의 곱2. | solutionImage:q14-solution.svg | KEEP_MATH |
| 15 | 아래 그림과 같이 원 $x^2+y^2=1$ 위의 점 $P$와 $A(0,1)$을 지나는 직선이 $x$축과 이루는 예각의 크기를 $\alpha$라 하자. 점 $P$를 원점 $O$에 대하여 대칭이동시킨 점을 $Q$라 할 때, 동경 $OQ$가 나타 | ② | 원과 y=1−x/3 교점 P=(3/5,4/5), 대칭 Q=(−3/5,−4/5)→tanθ=4/3. | solutionImage:q15-solution.svg, image:q15.png | KEEP_MATH |
| 16 | 집합 $\{x\mid -6\le x\le 6\}$에서 정의된 함수 $f(x)=2\sin\dfrac{\pi}{6}x$가 있다. $y=f(x)$의 그래프가 직선 $y=1$과 만나는 서로 다른 두 점을 $A$, $B$라 하고, 두 점 $B$, $ | ① | 교점 A,B의 수평거리4, C와 직선AB 거리2; S=4, AC=2√10→sin²θ=1/10. | solutionImage:q16-solution.svg | KEEP_MATH |
| 17 | [서답형1(단답형1)] 다음 그림과 같이 반원 $O$에 내접하는 $\overline{AB}=6$, $\overline{AC}=8$인 삼각형 $ABC$에서 $\angle ABC=\alpha$, $\angle ACB=\beta$라고 할 때, $ | $-\dfrac{3}{5}$ | 반원에서 A=90°, BC=10, α+β=π/2; cos(7α+6β)=−cosα=−3/5. | solutionImage:q17-solution.svg, image:q17.png | KEEP_MATH |
| 18 | [서답형2(단답형2)] 모든 자연수 $n$에 대하여 수열 $\{a_n\}$은 다음 등식을 만족시킨다. $\displaystyle\sum_{k=1}^{n}\dfrac{k a_k}{n}=3n-2$. $11a_{11}$의 값을 구하시오. [3점] | 61 | Σka_k=n(3n−2), n=11과10의 차 341−280=61. | 없음 | KEEP_MATH |
| 19 | [서답형3(단답형3)] 그림과 같이 한 평면에서 선분 $AB$를 공통변으로 갖는 두 삼각형 $ABC$, $ABD$의 외접원을 각각 $O$, $O'$이라 하고 $\angle ACB=\alpha$, $\angle ADB=\beta$라 할 때,  | $\sqrt5$ | 원의 반지름 R,R' 합7·비4:3→4,3; 중심각 차의 cos=5/6→OO'²=25−20=5. 그림의 배치에 의존. | solutionImage:q19-solution.svg, image:q19.png | KEEP_MATH |
| 20 | [서답형4(서술형1)] 등차수열 $\{a_n\}$에 대하여 $a_{10}=a_2+24$, $a_1+a_4+a_7=0$일 때, 수열 $\{a_n\}$의 일반항 $a_n$을 구하는 과정을 서술하시오. [6점] | $3n-12$ | a10−a2=8d=24→d=3; a1+a4+a7=3a1+27=0→a1=−9; an=3n−12. | 없음 | KEEP_MATH |
| 21 | [서답형5(서술형2)] $0\le\theta<2\pi$일 때, $x$에 대한 이차방정식 $x^2+4x\sin\theta+6\cos\theta=0$의 두 근이 모두 음의 실수가 되도록 하는 $\theta$의 값의 범위를 구하는 과정을 서술하시 | $\dfrac{\pi}{3}\le\theta<\dfrac{\pi}{2}$ | 두 음의 실근: D=16sin²θ−24cosθ≥0 ⇔ (cosθ+2)(cosθ−1/2)≤0, 근의 합 −4sinθ<0 및 근의 곱6cosθ>0 → π/3≤θ<π/2. | solutionImage:q21-solution.svg | KEEP_MATH |
| 22 | [서답형6(서술형3)] 원에 내접하는 사각형 $ABCD$에서 $\overline{AB}=3$, $\overline{BC}=4$, $\overline{CD}=2$, $\overline{DA}=3$일 때, 사각형 $ABCD$의 넓이를 구하는 과 | $6\sqrt2$ | 내접사각형 B+D=π; 대각선 코사인법칙 비교 cosB=1/3; S=9sinB=6√2. | solutionImage:q22-solution.svg | KEEP_MATH |

## 이미지별 렌더·육안 검수 대장 (16/16)

| # | Q | 필드 | 원본 파일 | Git blob SHA | 재현 방법 | 판정/예약 |
|---:|---:|---|---|---|---|---|
| 01 | 02 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q2-solution.svg` | `35c61984ecbadb79c4e1675d42f788ba84e817f5` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 02 | 07 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q7-solution.svg` | `3099a7fd1ad58684510363a3a259fb6f866cbeb5` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 03 | 09 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9-solution-v2.svg` | `0f526f20b2ed157077da57c76c316ea4124d57b9` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 04 | 09 | `image` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9.png` | `14fbd419b85ace1cb4308068aa6a0091e496d1bb` | PNG decode(Pillow) | VISUAL_HOLD_READABILITY |
| 05 | 11 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q11-solution.svg` | `e560865b8493573635815d2239d020ef84be5dec` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 06 | 12 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q12-solution.svg` | `d20368da0a39cc33dacf41af8106159dd2d7a0b2` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 07 | 14 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q14-solution.svg` | `52edcd231863c49c1683736f3aea418c7f956d9d` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 08 | 15 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q15-solution.svg` | `c620c78d08f4aecb72e2274c05c4abee7a77e9f1` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 09 | 15 | `image` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q15.png` | `5687559a2c91a71eef96fd2b5f8640d98ddd5c28` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 10 | 16 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q16-solution.svg` | `6bd7079a8e8e3baae45cf56b1cbcc31999591c45` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 11 | 17 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q17-solution.svg` | `7038ed2f1fd0fbb8fcdd2c5aefaf394e4fd17ef1` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 12 | 17 | `image` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q17.png` | `274a4695f39eb1720641a688d3dd5ab224dfae08` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 13 | 19 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q19-solution.svg` | `837111032e9f4f511729172ef7edcf8646a0c87a` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 14 | 19 | `image` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q19.png` | `8881167d0857c5276509542c744def1063daee92` | PNG decode(Pillow) | OBSERVED_NO_FLAG |
| 15 | 21 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q21-solution.svg` | `7ab7da658804096f92c4a4c8762a24d3cf5f119f` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |
| 16 | 22 | `solutionImage` | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q22-solution.svg` | `45520ded0ba792da3675e0c5ffd91f39b1dc5128` | SVG→PNG(Inkscape) | OBSERVED_NO_FLAG |

## 엔진 인계 예약 및 출고 차단

| 문항 | 유형 | 손상 소스(불변 식별자) | 관찰/요청 사항 | 후속 검증 |
|---|---|---|---|---|
| Q9 | VISUAL_HOLD_READABILITY | `archive/assets/images/24_팔마고_1학기_기말_고2_수학I/q9.png` (`14fbd419b85ace1cb4308068aa6a0091e496d1bb`) | q9.png 원본 그래프의 함수/눈금/숫자가 희미해 a=3, 주기 π, 수평이동 π/6을 그림에서 독립 판독할 수 없음. 양질 원본 재스캔 전 이미지 HOLD, abc=2π의 계산은 조건부. q9-solution-v2.svg로 원본 눈금 증거를 대체하면 안 됨. | 엔진 작업 큐: 원본 재확보/크롭/가독성 비교 후 실제 학생 UI 재검수 |

- **수학 검산과 원본 시각 검수는 서로 다른 판정층**이다. `KEEP_MATH` 문항이라도 `VISUAL_UPGRADE` 원본 교체 예약은 유효하다.
- `HOLD_VISUAL_SOURCE`는 그림에서 값을 독립 재현할 수 없는 문항으로, 깨끗한 원출처/재스캔 또는 판독 가능한 본문 근거가 마련되어야 해제한다.
- 엔진 담당: 원본을 수정하기 전에 관련 시험지의 예약을 점검하고, 이미지 변경 시 참조 경로 및 SHA·문항 텍스트 매칭을 다시 확인하라. 이미지를 실제 화면에 렌더해 도형·레이블·선택지 중복을 관찰하고, 수학 해설 교차검산과 CI 회귀를 별도로 수행하라.

## 이번 배치 누적 인계

- 본 회차 **5개 학교/시험지, 115문항, 이미지 57개(PNG 23·SVG 34)** 모두 문서로 기록.
- 전체 대수 85개 시험지 중 **61개 문서화(기존 56개 + 이번 5개)**, **1,359/1,903문항(기존 1,244문항 + 115문항)**.
- 미완료 **24개 시험지/544문항**(일반 기말 22개 498문항 + C 계열 2개 46문항), 시점 기준 계획 수량.
- 이번 회차 해설 검산: **KEEP_MATH 114 / HOLD_VISUAL_SOURCE 1**; **이미지 예약 3건(재크롭 2, 원본 판독 보류 1)**. 다른 회차 결과와 중복 집계하지 말 것.
- 작업 범위는 MD 기록 및 인계에 한정되며, 배포 가능 판정은 별도 운영 기준 충족 이후에만 내린다.
