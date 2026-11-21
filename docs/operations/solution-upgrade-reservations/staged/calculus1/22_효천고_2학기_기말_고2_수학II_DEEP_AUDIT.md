# 미적분Ⅰ(구 수학Ⅱ) lane10 심층 감사 — 22_효천고_2학기_기말_고2_수학II

- 범위: 고2 2학기 기말 `수학II` 기출 → 미적분Ⅰ 전담, 원본 시험지 24문항.
- sourcePath: `archive/exams/original/high/h2/2final/22_효천고_2학기_기말_고2_수학II.js`; 원본 Git ref `main`, blob SHA `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; 결과 파일 `docs/operations/solution-upgrade-reservations/staged/calculus1/22_효천고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 전 문항 발문·보기·정답·기존 해설: **24/24 읽음**; 최종 판정 **KEEP 24 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 원본 문제 시각 파일 6개: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q4.png` (Q4, PNG 실제 판독), `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q10.png` (Q10, PNG 실제 판독), `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q18.png` (Q18, PNG 실제 판독), `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q19.png` (Q19, PNG 실제 판독), `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q22.png` (Q22, PNG 실제 판독), `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q24.png` (Q24, PNG 실제 판독). 해설 solutionImage SVG·학생 화면 독립 렌더 QA는 **NOT_RUN**.
- 절차: 각 문제의 원문·보기·정답과 기존 solution에서 실제 문장/계산을 확인하고, 계산·범위·부호를 독립 대조. 공유 점유 조회/claim은 사용자 지시대로 생략. `main` JS·정답·보기·SVG는 변경하지 않음.
- 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 자료 수집/해설 초안이 최종 출고·병합 PASS를 의미하지 않는다. Golden/Negative, preflight SHA-256 receipt, 학생 렌더와 운영 출고 QA 미실시.

## Q01 — KEEP

- ordinal: 1; id: `1`; sourceQid: `1`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `부정적분 계산`.
- 원본 문제·보기 필드 직접 확인:

```text
1. $\int (3x^2+4x-1)dx$의 부정적분은? (단, $C$는 적분상수) [3.0점]
원본 보기: ["$3x^2+4x-1$","$3x^2+4x+C$","$3x^3+4x^2+C$","$x^3+2x^2-x+C$","$x^3+4x^2-2x+C$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 부정적분은 미분하면 주어진 함수가 되는 원시함수를 찾는 것이다.
> ⑤ 4x의 적분 계수를 4로 두고 상수항을 -2x로 오산했다.
- **독립 검산 및 KEEP 판정:** 원시함수 $x³+2x²-x+C$를 미분하면 피적분함수 $3x²+4x-1$로 정확히 복원되므로 ④다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- ordinal: 2; id: `2`; sourceQid: `2`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
2. 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$가 $x=t^3-6t^2-9t$일 때, 점 $\mathrm{P}$의 속도가 $6$이 되는 시각은? [3.0점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 속도는 위치함수의 시간에 대한 도함수이다.
> ④ t=4이면 v(4)=-9이다.
- **독립 검산 및 KEEP 판정:** 위치 미분 $v=3t²-12t-9$, v=6의 해 5,-1 중 시각 t≥0인 5만 유효하다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- ordinal: 3; id: `3`; sourceQid: `3`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분의 성질`.
- 원본 문제·보기 필드 직접 확인:

```text
3. $\int_1^{-2} 5x^4 dx$의 값은? [3.0점]
원본 보기: ["$-33$","$-10$","$0$","$10$","$33$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 정적분의 상한이 하한보다 작으면 결과의 부호에 주의한다.
> ⑤ 정적분 상하한을 바꾸고 부호를 바꾸지 않은 값이다.
- **독립 검산 및 KEEP 판정:** 원시함수 x⁵의 1→-2 대입 차는 (-2)⁵−1=-33; 방향부호 확인했다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- ordinal: 4; id: `4`; sourceQid: `4`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
4. 원점을 출발하여 수직선 위를 $3$초 동안 움직이는 점 $\mathrm{P}$의 시각 $t$초에서 속도 $v(t)$의 그래프가 다음 그림과 같을 때, 시각 $t=0$에서 $t=3$까지 점 $\mathrm{P}$가 움직인 거리는? [3.0점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 이동거리는 속도 그래프와 시간축 사이의 넓이를 절댓값으로 더한다. 변위와 구별해야 한다.
> ⑤ 속도 부호를 무시한 뒤 면적을 중복 합산한 값이다.
- **독립 검산 및 KEEP 판정:** 원본 v(t) PNG의 0~1,1~2,2~3 구간은 밑변 1·높이 2인 삼각형 셋, 절댓값 넓이 3이다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q4.png` (blob `bf32fb906c0164ba2e31e75543a0ae20b3ea9abb`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q4-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- ordinal: 5; id: `5`; sourceQid: `5`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `조건을 이용한 함수 결정`.
- 원본 문제·보기 필드 직접 확인:

```text
5. 함수 $f(x)=\int \left\{\frac{d}{dx}(2x^3-3x)\right\}dx$이고, $f(0)=0$일 때, $f(1)$의 값은? [3.0점]
원본 보기: ["$-1$","$-2$","$-3$","$-4$","$-5$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 적분 안의 식은 $2x^3-3x$를 미분한 것이므로, 이를 다시 적분하면 원래 함수에 적분상수만 더해진다.
> ⑤ 미분과 적분을 두 번 적용한 오해다.
- **독립 검산 및 KEEP 판정:** 미분 후 적분하면 $f=2x³-3x+C$, f(0)=0에서 C=0, f(1)=-1이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- ordinal: 6; id: `6`; sourceQid: `6`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
6. 임의의 실수 $x$에 대하여 $\int_a^x f(t)dt=2x^2-12x+10$을 만족시키는 연속함수 $f(x)$에서 상수 $a$값들의 합은? [3.3점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 정적분의 상한과 하한이 같으면 값은 반드시 $0$이다. 따라서 $x=a$를 대입해
> ④ a=5 한 근만 답으로 쓴 것이다.
- **독립 검산 및 KEEP 판정:** 정적분 하한 x=a에서 오른쪽 식 0을 요구해 2(a−1)(a−5)=0, 가능한 a의 합 6이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- ordinal: 7; id: `7`; sourceQid: `7`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
7. 삼차방정식 $x^3-3x=a$이 서로 다른 세 실근을 갖도록 하는 실수 $a$의 값의 범위는? [3.5점]
원본 보기: ["$-2 < a < 1$","$-1 < a < 1$","$-1 < a < 2$","$-2 < a < 2$","$-2 < a < 3$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> $x^3-3x=a$의 실근 개수는 함수 $h(x)=x^3-3x$와 수평선 $y=a$의 교점 개수다.
> ⑤ 상한 3은 세 근이 아닌 a>2를 포함한다.
- **독립 검산 및 KEEP 판정:** $h'=3(x+1)(x-1)$과 h(-1)=2,h(1)=-2로 수평선 세 교점 범위는 -2<a<2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q08 — KEEP

- ordinal: 8; id: `8`; sourceQid: `8`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
8. 함수 $f(x)=\int_0^x (3t^2-6t-9)dt$의 극댓값과 극솟값의 합은? [3.7점]
원본 보기: ["$-27$","$-22$","$-17$","$-12$","$-5$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 정적분으로 정의된 함수를 미분하면 피적분함수가 나온다.
> ⑤ 두 극값의 차를 합으로 잘못 취급한 값이다.
- **독립 검산 및 KEEP 판정:** $F'=3(x+1)(x-3)$이므로 F(-1)=5 극대, F(3)=-27 극소, 합 -22다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q8-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- ordinal: 9; id: `9`; sourceQid: `9`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
9. 실수 전체의 집합에서 미분가능한 함수 $f(x)$가
$f'(x) = \begin{cases} 3x^2 & (x \ge 1) \\ 2x+1 & (x < 1) \end{cases}$
일 때, $f(2)-f(0)$ 값은? [3.7점]
원본 보기: ["$9$","$10$","$11$","$12$","$13$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 미적분의 기본정리에 의해 $f(2)-f(0)=\int_0^2 f'(x)dx$이다.
> ⑤ 상수 적분을 추가하면 안 된다.
- **독립 검산 및 KEEP 판정:** 도함수를 x=1 기준으로 나누면 $\int_0^1(2x+1)=2$, $\int_1^2 3x²=7$이어서 차는 9다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q9-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- ordinal: 10; id: `10`; sourceQid: `10`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `넓이`.
- 원본 문제·보기 필드 직접 확인:

```text
10. 함수 $y=-x^2+2$와 두 직선 $y=x$, $y=-x$로 둘러싸인 도형이 있다. 이 도형을 $y=x$와 $y=-x$ 대칭이동을 시켜 완성한 도형이 그림과 같을 때, 네 곡선으로 둘러싸인 부분의 넓이는? [4.0점]
원본 보기: ["$\\frac{26}{3}$","$\\frac{53}{6}$","$\\frac{27}{3}$","$\\frac{55}{6}$","$\\frac{28}{3}$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그림의 바깥 경계는 위쪽 $y=2-x^2$, 오른쪽 $x=2-y^2$, 아래쪽 $y=x^2-2$, 왼쪽 $x=y^2-2$의 네 포물선이다. 좌표축에 대해 대칭이므로 제1사분면 넓이를 구해 4배 한다.
> ④ 제1사분면 오른쪽 조각을 중복 적분한 값이다.
- **독립 검산 및 KEEP 판정:** 원본 PNG에서 x·y축과 y=±x에 대해 네 포물선이 만드는 대칭 폐곡선 확인; 제1사분면 위쪽 면적 5/3와 오른쪽 면적 2/3의 4배는 28/3이다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q10.png` (blob `251de0e7cc70c7e71c0c705ed2211566dea66784`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q10-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- ordinal: 11; id: `11`; sourceQid: `11`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
11. 곡선 $y=3x^2+1$과 $x$축 및 두 직선 $x=1$, $x=1+h$ ($h>0$)로 둘러싸인 도형의 넓이를 $S(h)$라고 할 때, $\lim_{h \to 0+} \frac{S(h)}{h}$의 값은? [4.0점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> $h>0$에서 도형의 넓이는 $S(h)=\int_1^{1+h}(3x^2+1)dx$이다. 피적분함수가 양수이므로 절댓값을 따로 쓸 필요가 없다.
> ⑤ 구간의 양끝 값을 합쳐 오해한 값이다.
- **독립 검산 및 KEEP 판정:** 양의 피적분함수 S(h)=∫1^{1+h}(3x²+1)dx=4h+3h²+h³이므로 S(h)/h→4다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- ordinal: 12; id: `12`; sourceQid: `12`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
12. 다항함수 $f(x)$가
$\int_0^3 3x^2 f(x)dx + \int_0^3 (x^3-1)f'(x)dx = 5$를 만족시킨다.
$f(0)=-8$일 때, $f(3)$의 값은? [4.1점]
원본 보기: ["$-2$","$-\\frac{1}{2}$","$0$","$\\frac{1}{2}$","$2$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 곱의 미분법을 역으로 이용한다.
> ⑤ 26f(3)=13을 26으로 잘못 나눈 값이다.
- **독립 검산 및 KEEP 판정:** 곱 미분으로 적분합은 $26f(3)+f(0)$; 5=26f(3)-8에서 f(3)=1/2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- ordinal: 13; id: `13`; sourceQid: `13`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
13. 다항함수 $f(x)$가 $f(x)=3x^2+2x+\int_0^1 f'(t)dt$를 만족시킬 때, $\int_0^1 f(x)dx$의 값은? [4.2점]
원본 보기: ["$6$","$7$","$8$","$9$","$10$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 미적분의 기본정리로 $\int_0^1 f'(t)dt=f(1)-f(0)$이다.
> ⑤ f(1)만 대입하고 적분하지 않은 값이다.
- **독립 검산 및 KEEP 판정:** 상수 K=∫0¹ f'=f(1)-f(0)=5라 f=3x²+2x+5, 적분 값 7이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- ordinal: 14; id: `14`; sourceQid: `14`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분의 뜻`.
- 원본 문제·보기 필드 직접 확인:

```text
14. 실수 전체의 집합에서 연속인 함수 $f(x)$와 자연수 $n$에 대하여 $n-1 \le x < n$일 때,
$f(x) = \begin{cases} 3(x-n+1)(x-n) & (n=1, 3, 5, 7\text{일 때}) \\ -3(x-n+1)(x-n) & (n=2, 4, 6, 8\text{일 때}) \end{cases}$
라고 정의하자. $\int_0^{\frac{15}{2}} f(x)dx$의 값은? [4.3점]
원본 보기: ["$-\\frac{1}{8}$","$-\\frac{1}{4}$","$-\\frac{3}{8}$","$-\\frac{1}{2}$","$-\\frac{5}{8}$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 각 정수 구간을 $u=x-(n-1)$로 옮기면 $0\le u<1$이다.
> ⑤ 짝수 구간의 양수 기여를 누락하면 안 된다.
- **독립 검산 및 KEEP 판정:** 길이 1인 여덟 조각의 부호는 −,+ 교대하고 0~7의 합 -1/2; 남은 7~7.5 양의 면적 1/4로 최종 -1/4다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- ordinal: 15; id: `15`; sourceQid: `15`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분의 성질`.
- 원본 문제·보기 필드 직접 확인:

```text
15. 최고차항의 계수가 1인 삼차함수 $f(x)$가 $f(1)=0$이고, 모든 실수 $x$에 대하여 $f(2-x)=-f(2+x)$를 만족시킨다.
$\int_0^4 (f(x)-g(x))dx = 0$을 만족하는 직선을
$g(x)=ax-6$라고 할 때 $a$의 값은? (단, $a$는 양수) [4.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> $f(2-x)=-f(2+x)$는 중심 $x=2$에 대한 점대칭, 즉 $u=x-2$로 바꾸면 홀함수라는 뜻이다.
> ⑤ a의 양수 조건만 사용하면 값을 정할 수 없다.
- **독립 검산 및 KEEP 판정:** x=2 중심 홀대칭으로 ∫0⁴f=0, ∫0⁴(ax−6)=8a−24도 0이어야 하므로 a=3이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q15-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- ordinal: 16; id: `16`; sourceQid: `16`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
16. 두 다항함수 $f(x)$, $g(x)$가 $f(x)=3x^2-\int_0^1 g(t)dt$, $g(x)=2x+\int_0^1 f(t)dt$를 만족시킬 때,
$\int_0^1 (f(x)-xg(x))dx$의 값은? [4.8점]
원본 보기: ["$-\\frac{2}{3}$","$-\\frac{1}{3}$","$0$","$\\frac{1}{3}$","$\\frac{2}{3}$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 적분값을 상수로 두어 연립한다.
> ⑤ f와 xg를 더하면 안 된다.
- **독립 검산 및 KEEP 판정:** 적분상수 F=∫f, G=∫g에서 F=1−G,G=1+F를 풀면 F=0,G=1; ∫0¹(x²−1)=-2/3이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- ordinal: 17; id: `17`; sourceQid: `17`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
17. 직선도로 위를 달리는 자동차 $\mathrm{A}$와 자동차 $\mathrm{B}$가 같은 곳에서 출발하여 $t$초 후 속도는 각각 $v_A, v_B$라고 한다.
$v_A$와 $v_B$는 $v_A = v_B + t^3 - \frac{15}{4}t^2 + 3t$의 관계를 가진다.
$\mathrm{A}$와 $\mathrm{B}$가 출발한 후에 처음으로 만나게 되는 시간 $t_c$의 값은? [4.9점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 같은 곳에서 출발했으므로 두 자동차가 다시 만나는 조건은 속도의 차를 적분한 상대 변위가 0이 되는 것이다.
> ⑤ 상대속도 적분 상수를 무시한 값이다.
- **독립 검산 및 KEEP 판정:** 상대속도의 적분 D(t)=t²(t−2)(t−3)/4이므로 출발 후 첫 영점 t=2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- ordinal: 18; id: `18`; sourceQid: `18`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
18. 다음 그림과 같이 주어진 최고차항의 계수가 1인 삼차함수 $f(x)$가 있다.
함수 $g(x)=x^2 \int_0^x f(t)dt - \int_0^x t^2 f(t)dt$가 오직 하나의 극값을 갖도록 하는 실수 $a$ ($a>2$)에 대하여 $a^2$의 최댓값은? [5.5점]
원본 보기: ["$24$","$25$","$26$","$27$","$28$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그림에서 최고차항 계수가 1인 삼차함수 $f$의 서로 다른 세 근은 $-2,2,a$이다. 따라서 $f(x)=(x+2)(x-2)(x-a)=(x^2-4)(x-a)$이다.
> ⑤ 28은 경계 초과다.
- **독립 검산 및 KEEP 판정:** 원본 PNG의 삼차함수 영점 -2,2,a(a>2)를 확인; g'=2x²Q(x), Q의 중근 경계 a=2√6에서만 극값 하나, a² 최대 24다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q18.png` (blob `bbd61c5df87ff1f68c1d57deebe3183a9622cb58`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- ordinal: 19; id: `19`; sourceQid: `19`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
19. 삼차함수 $f(x)$와 일차함수 $g(x)$에 대하여 양의 실수 $\alpha, \beta$와 두 함수 $y=f(x)$, $y=g(x)$의 그래프가 다음 그림과 같다. 두 함수로 둘러싸인 부분의 넓이를 각각 $S_1$, $S_2$ ($S_1 < S_2$)라고 하고 $h(x) = \int_0^x (f(t)-g(t))dt$ 라고 할 때, <보기>에서 옳은 것의 개수는? [5.0점]
(단, $y=f(x)$의 그래프는 $x$축에 접하며 두 함수 $y=f(x)$, $y=g(x)$ 모두 원점을 지난다.)

<보기>
ㄱ. $y=h(x)$는 4차 함수이며, 최고차항의 계수는 양수이다.
ㄴ. $y=h(x)$는 $x=\alpha, x=\beta$에서만 극값을 가진다.
ㄷ. $S_1+S_2 = 2h(\alpha)-h(\beta)$
ㄹ. $f'(\frac{\alpha+\beta}{2}) + f(\frac{\alpha+\beta}{2}) = 0$
ㅁ. $h(x)$의 최솟값은 $S_2-S_1$이다.
원본 보기: ["$1$개","$2$개","$3$개","$4$개","$5$개"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> $h'(x)=f(x)-g(x)$이므로 $h$의 증감은 두 그래프의 위아래 관계로 결정한다.
> ⑤ ㅁ은 최소값의 부호를 반대로 적었으므로 거짓이다.
- **독립 검산 및 KEEP 판정:** 원본 PNG에서 두 그래프 교점 0,α,β와 f의 x축 접점 중심 p=(α+β)/2 확인; h'=f−g는 0에서도 부호 바꾸므로 ㄴ 거짓, ㄱ·ㄷ·ㄹ 참 세 개다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q19.png` (blob `233b4f5ee9dd57b724738df90c16fab47499d959`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- ordinal: 20; id: `20`; sourceQid: `20`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `넓이`.
- 원본 문제·보기 필드 직접 확인:

```text
20. 최고차항의 계수가 1이고 서로 다른 두 근을 갖는 이차함수 $f(x)$가 상수 $a(0 < a < 5)$에 대하여 다음 조건을 만족시킨다. [5.5점]

(가) 임의의 실수 $t$에 대하여
$\int_0^t f(x)dx = \int_{2a-t}^{2a} f(x)dx$이다.
(나) $0 < k < a$인 실수 $k$에 대하여 $f(k)=0$
(다) $\int_a^5 f(x)dx = 6$, $\int_a^5 |f(x)|dx = \frac{22}{3}$

이때, $\int_k^5 |f(x)|dx$의 값은?
원본 보기: ["$7$","$\\frac{22}{3}$","$\\frac{23}{3}$","$8$","$\\frac{25}{3}$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> (가)의 두 정적분을 $t$로 미분하면 $f(t)=f(2a-t)$이므로 이차함수의 대칭축은 $x=a$이다. 최고차항 계수가 1이고 두 근이 있으므로 $f(x)=(x-a)^2-d^2$ ($d>0$)로 쓸 수 있다. (나)의 $0<k<a$인 근은 $k=a-d$이다.
> ⑤ 음수 부분을 두 번 더하는 계산이다.
- **독립 검산 및 KEEP 판정:** 축 대칭 f=(x−a)²−d²와 보통/절댓값 적분 차 4/3에서 d=1, ∫0^L(u²−1)=6에서 L=3; a=2,k=1, 구간 절댓값 적분 8이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- ordinal: 21; id: `21`; sourceQid: `21`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 1. $x$에 대한 삼차방정식 $x^3-3n^2 x + 32n = 0$의 서로 다른 실근의 개수가 1이 되도록 하는 모든 자연수 $n$의 합을 구하는 과정을 서술하시오. [4.0점]
원본 보기: []
```

- 원본 정답: `6`.
- **기존 solution 실제 원문 핵심 발췌:**
> $F_n(x)=x^3-3n^2x+32n$으로 놓는다. 도함수는 $F_n'(x)=3(x-n)(x+n)$이다.
> 따라서 $n=1,2,3$이고 합은 $1+2+3=6$이다.
- **독립 검산 및 KEEP 판정:** $F'_n=3(x−n)(x+n)$이고 극솟값 $2n(16−n²)>0$은 n=1,2,3; 합 6이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- ordinal: 22; id: `22`; sourceQid: `22`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `넓이`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 2. 다음 그림과 같이 $f(x)=-x^2+4x$와 $g(x)=-2x$로 둘러싸인 부분의 넓이를 $x=k$가 이등분할 때, 상수 $k$를 구하는 과정을 서술하시오. [4.0점]
원본 보기: []
```

- 원본 정답: `3`.
- **기존 solution 실제 원문 핵심 발췌:**
> 두 곡선의 교점은 $-x^2+4x=-2x$에서 $-x^2+6x=x(6-x)=0$이므로 $x=0,6$이다.
> $(k-3)(k^2-6k-18)=0$이다. $0<k<6$을 만족하는 해는 $k=3$뿐이다. 따라서 $k=3$이다.
- **독립 검산 및 KEEP 판정:** 원본 PNG의 x=0,6 교점과 그 사이 위쪽 f·아래쪽 g를 확인; ∫0³(6x−x²)=18은 전체 36의 반이므로 k=3이다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q22.png` (blob `396c19d3f3eefbc93b6e23bc0e13af95ee3436fb`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q22-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q23 — KEEP

- ordinal: 23; id: `23`; sourceQid: `23`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 3. 함수 $f(x)$가 모든 실수 $x$에 대하여
$\int_1^x (x-t)^2 f(t)dt = \int_0^x (t^3+at^2+bt+c)dt$를 만족한다고 할 때, $f(a)+10$의 값을 구하는 과정을 서술하시오. [6.0점]
원본 보기: []
```

- 원본 정답: `1`.
- **기존 solution 실제 원문 핵심 발췌:**
> 양변을 $x$에 대하여 세 번 미분한다. 왼쪽 $H(x)=\int_1^x(x-t)^2f(t)dt$에 대하여
> $f(a)=3a+a=4a=-9$이므로 $f(a)+10=1$이다.
- **독립 검산 및 KEEP 판정:** 좌변 적분의 3계 도함수는 2f, 우변은 6x+2a; x=1에서 세 차수의 영 조건으로 a=-9/4, f(a)=4a=-9, 합 1이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q24 — KEEP

- ordinal: 24; id: `24`; sourceQid: `24`; questionUid: `NOT_PRESENT`; source blob: `70791f1645e22adda6e3a4bc9508b9ff5f291f0b`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 4. 최고차항의 계수가 $k(k<0)$인 이차함수 $f'(x)$의 그래프가 다음 그림과 같다.

이때, 실수 전체의 집합에서 정의된 함수
$g(x) = \begin{cases} f(x) & (x < -3) \\ \int_0^x |f'(t)|dt & (x \ge -3) \end{cases}$
이 다음 조건을 만족시킨다.

(가) $g(-3)=-16$, $g(a)=-8$
(나) 함수 $g(x)$는 실수 전체의 집합에서 연속이다.
(다) 함수 $g(x)$는 극솟값을 갖는다.

$\int_a^2 \{f(x)+g(x)\}dx$의 값을 구하는 과정을 서술하시오. (단, $a > -3$) [6.0점]
원본 보기: []
```

- 원본 정답: `-48`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그림에서 $f'(x)$는 아래로 열린 이차함수이고 영점은 $x=-3$, $x=a$이며 $-3<a<0$이다. 따라서 $f'(x)=k(x+3)(x-a)$ ($k<0$)이다.
> (다)의 극솟값은 $x=-3$에서 왼쪽 $f'<0$, 오른쪽 $|f'|\ge0$이므로 실제로 성립한다.
- **독립 검산 및 KEEP 판정:** 원본 PNG의 f' 영점 -3,a(-3<a<0)와 아래로 열린 곡선 확인; g(-3),g(a) 조건에서 a=-1,k=-6이고 f+g=-16 on [-1,2], 적분 -48이다.
- 원본 그림: `archive/assets/images/22_효천고_2학기_기말_고2_수학II/q24.png` (blob `59551a8599bea9bc99764464b82f6342d5ffa4ce`, 원본 PNG 직접 판독 PASS). 해설 SVG: `assets/images/22_효천고_2학기_기말_고2_수학II/q24-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## 종료 검증 및 후속 인계

- 전체 source 문제·기존 solution 판독: **24/24**. KEEP 24, UPGRADE 0, HOLD 0, UNREAD 0; 개선 해설 작성 대상 없음(원문 계산/정답 충돌 발견 없음).
- 실물 문제 PNG 판독: **6**개. SVG 도형 파라미터 검사: **0**개, 별도 raster/학생 렌더 NOT_RUN.
- 다음 단계: Golden/Negative, preflight 영수증·학생 화면 확인·출고 QA. 완료 전 운영 JS·main 병합 PASS로 표기하지 않는다.
