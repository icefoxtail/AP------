# 미적분Ⅰ(구 수학Ⅱ) lane10 심층 감사 — 22_팔마고_2학기_기말_고2_수학II

- 범위: 고2 2학기 기말 `수학II` 기출 → 미적분Ⅰ 전담, 원본 시험지 22문항.
- sourcePath: `archive/exams/original/high/h2/2final/22_팔마고_2학기_기말_고2_수학II.js`; 원본 Git ref `main`, blob SHA `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 작업 브랜치: `work/solution-upgrade-lane-10-20261121`; 결과 파일 `docs/operations/solution-upgrade-reservations/staged/calculus1/22_팔마고_2학기_기말_고2_수학II_DEEP_AUDIT.md`.
- 원본 전 문항 발문·보기·정답·기존 해설: **22/22 읽음**; 최종 판정 **KEEP 22 / UPGRADE 0 / HOLD 0 / UNREAD 0**.
- 원본 문제 시각 파일 4개: `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q3.png` (Q3, PNG 실제 판독), `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q13.png` (Q13, PNG 실제 판독), `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q18.png` (Q18, PNG 실제 판독), `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q21.png` (Q21, PNG 실제 판독). 해설 solutionImage SVG·학생 화면 독립 렌더 QA는 **NOT_RUN**.
- 절차: 각 문제의 원문·보기·정답과 기존 solution에서 실제 문장/계산을 확인하고, 계산·범위·부호를 독립 대조. 공유 점유 조회/claim은 사용자 지시대로 생략. `main` JS·정답·보기·SVG는 변경하지 않음.
- 단계: **EXAM_AUDIT_COMPLETE / EXAM_DRAFT_COMPLETE / RELEASE_QA_NOT_RUN**. 자료 수집/해설 초안이 최종 출고·병합 PASS를 의미하지 않는다. Golden/Negative, preflight SHA-256 receipt, 학생 렌더와 운영 출고 QA 미실시.

## Q01 — KEEP

- ordinal: 1; id: `1`; sourceQid: `q01`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `최대·최소`.
- 원본 문제·보기 필드 직접 확인:

```text
1. 닫힌구간 $[-2, 2]$에서 함수 $f(x)=x^3+3x^2-12$의 최댓값과 최솟값의 합은? [3.5점]
원본 보기: ["$-4$","$-3$","$-2$","$-1$","$0$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 닫힌구간의 최댓값·최솟값은 끝점과 구간 내부의 도함수 0인 점을 비교한다.
> ① $-4$만 일치한다. ② $-3$, ③ $-2$, ④ $-1$, ⑤ $0$은 위 세 함숫값의 최댓값·최솟값을 더한 결과가 아니다.
- **독립 검산 및 KEEP 판정:** $f'=3x(x+2)$의 후보 -2,0,2에서 f=-8,-12,8이므로 최댓값+최솟값=-4다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q1-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q02 — KEEP

- ordinal: 2; id: `2`; sourceQid: `q02`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
2. 원점을 출발하여 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서 위치 $x$가 $x=t^3-6t^2+9t$이다. $t=3$일 때, 점 $\mathrm{P}$의 속도와 가속도의 합은? [3.6점]
원본 보기: ["$2$","$3$","$4$","$5$","$6$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 위치의 도함수는 속도, 속도의 도함수는 가속도이다.
> 따라서 $v(3)+a(3)=\boxed{6}$으로 ⑤이다. ① $2$, ② $3$, ③ $4$, ④ $5$는 두 도함수의 정확한 대입 합과 다르다.
- **독립 검산 및 KEEP 판정:** 위치 미분으로 v(3)=0, 가속도 a(3)=6; 합 6이 선택지 ⑤다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q03 — KEEP

- ordinal: 3; id: `3`; sourceQid: `q03`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
3. 함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 다음 그림과 같을 때, <보기>에서 옳은 것만을 있는 대로 고른 것은? [3.6점]

<보기>
ㄱ. $f(x)$는 닫힌구간 $[B, D]$에서 증가한다.
ㄴ. $f(x)$는 $x=D$에서 극대이다.
ㄷ. $f(x)$의 극값은 4개이다.
ㄹ. $f(x)$가 극소가 되는 $x$의 값은 $C$와 $G$이다.
원본 보기: ["① ㄱ, ㄴ","② ㄱ, ㄷ","③ ㄴ, ㄹ","④ ㄷ, ㄹ","⑤ ㄱ, ㄴ, ㄷ, ㄹ"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 도함수의 부호가 원함수의 증가·감소를 결정한다. 그림에서 $f'$는 $A,C,E,G$에서 $x$축을 통과한다.
> 원본 PDF의 문자 A·C·E·G는 각 x절편을 가리키며, 글자 자체가 축 교점에서 왼쪽으로 배치된 것은 인쇄 라벨 위치이다.
- **독립 검산 및 KEEP 판정:** 원본 PNG에서 도함수는 A,C,E,G에서 실제 축을 교차하고 B,D,F는 축 상하 극점으로만 표시됨; 극대 A,E, 극소 C,G라 ㄷ·ㄹ만 참이다.
- 원본 그림: `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q3.png` (blob `90ed4167484f36f6286ad935af02dbb6b3790670`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q04 — KEEP

- ordinal: 4; id: `4`; sourceQid: `q04`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `정적분의 성질`.
- 원본 문제·보기 필드 직접 확인:

```text
4. 정적분 $\int_{0}^{1} \frac{1}{x+1}dx - \int_{1}^{0} \frac{y^3}{y+1}dy$의 값은? [3.7점]
원본 보기: ["$\\frac{1}{6}$","$\\frac{5}{6}$","$\\frac{7}{6}$","$\\frac{11}{6}$","$\\frac{13}{6}$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 상하한을 바꾸면 정적분의 부호가 반대가 된다.
> 따라서 ②이다. ① $\frac{1}{6}$, ③ $\frac{7}{6}$, ④ $\frac{11}{6}$, ⑤ $\frac{13}{6}$은 상하한 부호 또는 다항식 적분 계산과 맞지 않는다.
- **독립 검산 및 KEEP 판정:** 두 번째 적분의 상하한을 뒤집으면 $\int_0^1(1+x^3)/(1+x)$가 되고 $x^2-x+1$ 적분은 5/6이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q05 — KEEP

- ordinal: 5; id: `5`; sourceQid: `q05`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `넓이`.
- 원본 문제·보기 필드 직접 확인:

```text
5. 곡선 $y=x^2-3x$와 $x$축으로 둘러싸인 도형의 넓이는? [3.8점]
원본 보기: ["$\\frac{9}{2}$","$5$","$\\frac{11}{2}$","$6$","$\\frac{13}{2}$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 교점은 $x^2-3x=x(x-3)=0$에서 $x=0,3$이다.
> 따라서 ①. ② $5$, ③ $11/2$, ④ $6$, ⑤ $13/2$는 교점 $0,3$과 이 구간의 부호를 반영한 정확한 넓이가 아니다.
- **독립 검산 및 KEEP 판정:** 교점 0,3 사이 $x(x-3)<0$이므로 넓이 $\int_0^3(3x-x²)dx=9/2$다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q5-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q06 — KEEP

- ordinal: 6; id: `6`; sourceQid: `q06`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
6. 다음 <보기> 문장의 참(true), 거짓(false)을 바르게 판단한 것은? [3.9점]

<보기>
(가) 극댓값은 항상 극솟값보다 크다.
(나) 미분가능한 함수 $f(x)$가 열린구간 $(a, b)$에서 $x=c$ ($a < c < b$)일 때 최댓값 또는 최솟값을 가지면 곡선 $y=f(x)$ 위의 점 $(c, f(c))$에서의 접선의 기울기는 0이다.
(다) 함수 $f(x)$가 $x=a$에서 극값을 갖는다면 $f'(a)=0$이다.
원본 보기: ["① (가) 참, (나) 참, (다) 거짓","② (가) 참, (나) 거짓, (다) 참","③ (가) 거짓, (나) 거짓, (다) 참","④ (가) 거짓, (나) 참, (다) 참","⑤ (가) 거짓, (나) 참, (다) 거짓"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 세 문장은 극값의 정의와 미분가능성 조건을 구분해야 한다.
> 따라서 (가) 거짓, (나) 참, (다) 거짓인 ⑤이다. ①·②는 (가)를 참으로 잘못 판단하고, ③은 (나)를 거짓으로, ④는 (다)를 참으로 잘못 판단한다.
- **독립 검산 및 KEEP 판정:** (가) 서로 다른 국소 극값의 전체 대소 비교는 불가능, (나) 내부 미분가능 최적점의 도함수 0, (다) |x| 반례로 거짓; ⑤다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q6-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q07 — KEEP

- ordinal: 7; id: `7`; sourceQid: `q07`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
7. 함수 $f(x)=x^3+ax^2-(a^2-8a)x+3$이 다음 조건을 만족시키도록 하는 실수 $a$의 범위에 속하는 정수의 개수는? [4.0점]

임의의 두 실수 $x_1, x_2$에 대하여 $x_1 < x_2$이면 $f(x_1) < f(x_2)$이다.
원본 보기: ["$5$","$6$","$7$","$8$","$9$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 모든 $x_1<x_2$에 대해 $f(x_1)<f(x_2)$이려면 삼차함수가 전 구간에서 엄격히 증가해야 한다.
> ③이 정답. ① $5$, ② $6$은 끝값을 빠뜨린 개수이고, ④ $8$, ⑤ $9$는 범위 밖 정수를 포함한다.
- **독립 검산 및 KEEP 판정:** $f'=3x²+2ax-a²+8a$의 판별식 $16a(a-6)\le0$, 경계도 엄격 증가; 정수 a=0부터6까지 7개다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q7-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q08 — KEEP

- ordinal: 8; id: `8`; sourceQid: `q08`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
8. 방정식 $x^3+6x^2+9x-2-a=0$이 서로 다른 세 실근을 갖도록 하는 정수 $a$의 개수는? [4.1점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> $h(x)=x^3+6x^2+9x-2$라 두면 원래 방정식은 $h(x)=a$이다. 수평선과 삼차함수 그래프의 교점이 세 개일 조건을 구한다.
> 가능한 정수 $a$는 $-5,-4,-3$으로 $\boxed{3}$개, 정답 ③이다. ① $1$, ② $2$는 누락, ④ $4$, ⑤ $5$는 경계나 범위 밖 정수를 포함한다.
- **독립 검산 및 KEEP 판정:** $h'=3(x+3)(x+1)$의 극대 높이 -2와 극소 -6 사이 정수 수준 -5,-4,-3의 3개다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q09 — KEEP

- ordinal: 9; id: `9`; sourceQid: `q09`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
9. $x \ge 0$일 때, 부등식 $2x^3-3kx^2+8 \ge 0$이 항상 성립하도록 하는 양수 $k$의 최댓값은? [4.2점]
원본 보기: ["$1$","$2$","$3$","$7$","$5$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> $x\ge0$에서 $g(x)=2x^3-3kx^2+8$의 최솟값이 $0$ 이상이어야 한다.
> ① $1$도 조건을 만족하지만 최댓값이 아니다. ③ $3$, ④ $7$, ⑤ $5$는 $x=k$를 대입하면 음수가 되어 항상 성립하지 않는다.
- **독립 검산 및 KEEP 판정:** $g'=6x(x-k)$에서 x=k가 최소이고 g(k)=8-k³≥0, 양수 k 최대 2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q10 — KEEP

- ordinal: 10; id: `10`; sourceQid: `q10`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `조건을 이용한 함수 결정`.
- 원본 문제·보기 필드 직접 확인:

```text
10. 이차함수 $f(x)$와 그 부정적분 $F(x)$ 사이에 $\frac{d}{dx} \int F(x)dx = xf(x)+2x^3-2x^2$인 관계가 성립한다. $f(0)=2$일 때, $f(1)$의 값은? [4.4점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> $\frac{d}{dx}\int F(x)dx=F(x)$이므로 주어진 관계는 $F(x)=xf(x)+2x^3-2x^2$이다.
> ③이 정답. ① $1$, ② $2$, ④ $4$, ⑤ $5$는 위 계수 비교로 정해지는 $f(1)$이 아니다.
- **독립 검산 및 KEEP 판정:** $F=xf+2x³-2x²$와 $F'=f$를 계수 비교해 f=-3x²+4x+2, $f(1)=3$이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q11 — KEEP

- ordinal: 11; id: `11`; sourceQid: `q11`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
11. 다항함수 $f(x)$가 모든 실수 $x$에 대하여 다음을 만족할 때, $f(2)$의 값은? (단, $a$는 상수) [4.3점]

$$\int_{1}^{x} f(t)dt = x^3-2ax^2+a$$
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 정적분 $\int_1^x f(t)dt$는 $x=1$에서 항상 $0$이다.
> 정답은 ④. ① $1$, ② $2$, ③ $3$, ⑤ $5$는 $x=1$의 적분조건으로 $a$를 결정하고 미분한 결과와 다르다.
- **독립 검산 및 KEEP 판정:** 하한 x=1 대입으로 a=1, 미분해 f=3x²-4x, f(2)=4다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q12 — KEEP

- ordinal: 12; id: `12`; sourceQid: `q12`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
12. 좌표가 2인 점에서 출발하여 수직선 위를 움직이는 점 $\mathrm{P}$의 시각 $t$에서의 속도가 $v(t)=1-2t$일 때, 점 $\mathrm{P}$가 원점을 지나는 시각은? [4.3점]
원본 보기: ["$\\frac{1}{2}$","$1$","$\\frac{3}{2}$","$2$","$\\frac{5}{2}$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 속도를 적분하면 위치의 변화량을 얻는다.
> 정답 ④. ① $\frac{1}{2}$, ② $1$, ③ $\frac{3}{2}$, ⑤ $\frac{5}{2}$는 $2+t-t^2=0$을 만족하지 않는다.
- **독립 검산 및 KEEP 판정:** 초기 위치 2에 속도 $1-2t$ 적분을 더한 위치 $2+t-t²=0$에서 양의 해 t=2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q12-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q13 — KEEP

- ordinal: 13; id: `13`; sourceQid: `q13`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
13. 삼차함수 $f(x)$의 도함수 $y=f'(x)$의 그래프가 그림과 같다. 함수 $f(x)$의 극댓값이 32, 극솟값이 0일 때, $f(1)$의 값은? [4.4점]
원본 보기: ["$8$","$7$","$6$","$5$","$4$"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그림에서 $f'(x)$는 $x=0,4$에서 0이고, 그 사이에서 양수인 아래로 열린 이차함수이다. 따라서 $f'(x)=k x(4-x)$ ($k>0$)로 둔다.
> 정답 ④. ① $8$, ② $7$, ③ $6$, ⑤ $4$는 그래프의 두 영점과 극값 차이 $32$를 동시에 반영한 $f(1)$이 아니다.
- **독립 검산 및 KEEP 판정:** 원본 PNG의 f' 영점 0,4와 양쪽 아래·중앙 위 부호를 확인; f(4)-f(0)=32에서 f'=3x(4-x), f(1)=5다.
- 원본 그림: `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q13.png` (blob `1f69cee30973bd37615dfa831ec7d3ce9f509a86`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q14 — KEEP

- ordinal: 14; id: `14`; sourceQid: `q14`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `도형 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
14. 곡선 $y=x(x-a)^2$과 직선 $y=x$로 둘러싸인 두 도형의 넓이가 같을 때, 상수 $a$의 값은? (단, $a>0$) [4.5점]
원본 보기: ["$1$","$2$","$3$","$4$","$5$"]
```

- 원본 정답: `③`.
- **기존 solution 실제 원문 핵심 발췌:**
> 두 곡선의 교점은 $x(x-a)^2=x$, 즉 $x[(x-a)^2-1]=0$에서 $x=0,a-1,a+1$이다.
> $a>1$이므로 $a=3$이고 정답 ③이다. ① $1$은 세 교점이 중복되고, ② $2$, ④ $4$, ⑤ $5$는 두 영역의 넓이가 서로 다르다.
- **독립 검산 및 KEEP 판정:** 교점 0,a-1,a+1을 위치별로 나누고 0<a<1일 때 부호 있는 면적 -4a/3≠0; a>1일 때 전체 적분 $(a-3)(a+1)³/12=0$으로 a=3다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/solutions/22_팔마고_2학기_기말_고2_수학II/q14_solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q15 — KEEP

- ordinal: 15; id: `15`; sourceQid: `q15`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
15. $\lim_{n \to \infty} \left\{ 2n \int_{1}^{\frac{n+1}{n}} (x^3-2x^2+3x+5)dx \right\}$의 값은? [4.6점]
원본 보기: ["$10$","$11$","$12$","$13$","$14$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> $P(x)=x^3-2x^2+3x+5$라 두고 $F(x)=\int_1^xP(t)dt$라 하면 $F(1)=0$, $F'(1)=P(1)=1-2+3+5=7$이다.
> 따라서 ⑤. ① $10$, ② $11$, ③ $12$, ④ $13$은 적분구간 길이 $\frac{1}{n}$과 앞의 계수 $2n$을 함께 처리한 극한값이 아니다.
- **독립 검산 및 KEEP 판정:** 짧은 적분구간 길이 1/n을 이용하면 $2n\int_1^{1+1/n}P=2P(1)$로 수렴, P(1)=7이어서 14다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q16 — KEEP

- ordinal: 16; id: `16`; sourceQid: `q16`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `도형 활용`.
- 원본 문제·보기 필드 직접 확인:

```text
16. 곡선 $y=-x^2+6x$와 $x$축으로 둘러싸인 도형의 넓이가 직선 $y=mx$에 의하여 이등분될 때, 상수 $m$에 대하여 $(6-m)^3$의 값은? [4.7점]
원본 보기: ["$60$","$72$","$84$","$96$","$108$"]
```

- 원본 정답: `⑤`.
- **기존 solution 실제 원문 핵심 발췌:**
> 포물선 $y=-x^2+6x$와 $x$축의 교점은 $x=0,6$이다. 전체 넓이는
> $(6-m)^3=b^3=\boxed{108}$이고 정답 ⑤이다. ① $60$, ② $72$, ③ $84$, ④ $96$은 반쪽 넓이 $18$을 주지 않는다.
- **독립 검산 및 KEEP 판정:** 포물선과 x축 전체 넓이 36의 절반이 18; 직선 위쪽 조각 넓이 $(6-m)³/6=18$에서 108이다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q16-solution-v2.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q17 — KEEP

- ordinal: 17; id: `17`; sourceQid: `q17`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `방정식과 부등식`.
- 원본 문제·보기 필드 직접 확인:

```text
17. 실수 $a$에 대하여 두 함수 $f(x)=\frac{1}{4}x^4-2x^2+x+6$, $g(x)=x+a$의 그래프가 만나는 서로 다른 점의 개수를 $k(a)$라 할 때, $\sum_{a=1}^{12} k(a)$의 값은? [4.8점]
원본 보기: ["$31$","$29$","$27$","$25$","$24$"]
```

- 원본 정답: `②`.
- **기존 solution 실제 원문 핵심 발췌:**
> 교점은 $\frac14x^4-2x^2+x+6=x+a$의 서로 다른 실근 수이다.
> 합은 $0+2+12+3+12=\boxed{29}$이므로 ②이다. ① $31$, ③ $27$, ④ $25$, ⑤ $24$는 $a=2,6$의 중복근을 서로 다른 근으로 정확히 세지 않은 결과다.
- **독립 검산 및 KEEP 판정:** 교점의 식 $(x²-4)²=4(a-2)$에서 a=1은 0근, a=2는 2근, a=3,4,5는 4근, a=6은 3근, 7~12는 2근; 총 29다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q18 — KEEP

- ordinal: 18; id: `18`; sourceQid: `q18`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `속도와 가속도`.
- 원본 문제·보기 필드 직접 확인:

```text
18. 수직선 위를 움직이는 두 점 $\mathrm{A}, \mathrm{B}$의 시각 $t$에서의 위치를 각각 $f(t), g(t)$라 할 때, 두 함수 $y=f(t), y=g(t)$의 그래프가 다음과 같다. <보기>에서 옳은 것만을 있는 대로 고른 것은? (단, $f'(a)=f'(d)=0, g'(a)=g'(e)=0$) [4.8점]

<보기>
ㄱ. 두 점 $\mathrm{A}, \mathrm{B}$는 $d < t < e$에서 서로 같은 방향으로 움직인다.
ㄴ. 두 점 $\mathrm{A}, \mathrm{B}$는 $0 < t < 10$에서 두 번 만난다.
ㄷ. $t=a$에서 두 점 $\mathrm{A}, \mathrm{B}$의 가속도는 모두 음의 값을 갖는다.
원본 보기: ["① ㄱ","② ㄴ","③ ㄱ, ㄷ","④ ㄴ, ㄷ","⑤ ㄱ, ㄴ, ㄷ"]
```

- 원본 정답: `④`.
- **기존 solution 실제 원문 핵심 발췌:**
> 위치 그래프의 기울기는 속도, 기울기의 변화율은 가속도를 뜻한다.
> 옳은 것은 ㄴ, ㄷ이므로 정답은 ④이다. ①·③·⑤는 거짓인 ㄱ을 포함하고 ②는 참인 ㄷ을 누락한다.
- **독립 검산 및 KEEP 판정:** 원본 PNG에서 d<t<e 사이 f는 증가·g는 감소, 내부 두 교점 b,e, t=a에서 두 곡선 모두 아래로 굽는 최대점임을 확인; ㄴ·ㄷ 참이다.
- 원본 그림: `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q18.png` (blob `d3c88a49676b636462d2915125328ac18f37ffd0`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q19 — KEEP

- ordinal: 19; id: `19`; sourceQid: `q19`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `속도와 거리`.
- 원본 문제·보기 필드 직접 확인:

```text
19. 어느 전망대에 설치된 엘리베이터는 1층에서 출발하여 꼭대기까지 올라가는 동안 출발 후 처음 2초 동안은 속도가 매초 $3\mathrm{m}$씩 증가하고 2초 후부터 10초까지는 등속도로 올라가며, 10초 후부터는 매초 $2\mathrm{m}$씩 감소하게 되어 멈춘다고 한다. 이 엘리베이터가 출발하여 멈출 때까지 움직인 거리는? [4.8점]
원본 보기: ["$63\\mathrm{m}$","$65\\mathrm{m}$","$67\\mathrm{m}$","$69\\mathrm{m}$","$71\\mathrm{m}$"]
```

- 원본 정답: `①`.
- **기존 solution 실제 원문 핵심 발췌:**
> 속도-시간 그래프 아래 넓이가 이동거리이다. 처음 출발할 때 속도는 0이다.
> 전체 이동거리는 $6+48+9=\boxed{63\,\mathrm m}$이다. 정답 ①. ② $65$, ③ $67$, ④ $69$, ⑤ $71$은 세 구간의 넓이 합과 다르다.
- **독립 검산 및 KEEP 판정:** 속도-시간 삼각형(0~2:6), 직사각형(2~10:48), 감속 삼각형(10~13:9)의 합 63m다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q19-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q20 — KEEP

- ordinal: 20; id: `20`; sourceQid: `q20`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `증가·감소와 극값`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 1. 함수 $f(x)=x^3+ax^2+ax+1$이 열린구간 $(-2, 1)$에서 극댓값과 극솟값을 모두 갖도록 하는 실수 $a$의 값의 범위를 구하고, 그 풀이과정을 서술하시오. [6.0점]
원본 보기: []
```

- 원본 정답: `$(-1,0)\cup(3,4)$`.
- **기존 solution 실제 원문 핵심 발췌:**
> 극댓값과 극솟값을 열린구간 $(-2,1)$ 안에서 모두 가지려면 도함수의 서로 다른 두 근이 이 구간의 내부에 있어야 한다.
> 따라서 $\boxed{(-1,0)\cup(3,4)}$이다.
- **독립 검산 및 KEEP 판정:** 도함수 $3x²+2ax+a$의 두 근이 (-2,1)에 있어야 하므로 끝점 양수·꼭짓점 내부·판별식 양수 조건의 교집합은 (-1,0)∪(3,4)다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q20-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## Q21 — KEEP

- ordinal: 21; id: `21`; sourceQid: `q21`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `정적분과 함수`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 2. $x \ge a$에서 $f(x) \ge 0$인 연속함수 $f(x)$에 대하여 다음 그림과 같은 영역의 넓이를 $S(x)$라 하자.
$f(a)=10$이고, $F'(x)=f(x)$일 때, $\lim_{x \to a} \frac{2S(x)}{x-a}$의 값을 구하고, 그 풀이과정을 서술하시오. [7.0점]
원본 보기: []
```

- 원본 정답: `20`.
- **기존 solution 실제 원문 핵심 발췌:**
> 그림의 음영은 $x=a$부터 $x$까지 곡선 $y=f(t)$와 $t$축 사이의 넓이이다. $f(t)\ge0$이므로
> 따라서 극한은 $2\cdot10=\boxed{20}$이다. $S(a)=0$이고 $x\ge a$라는 정의역 때문에 $a$의 오른쪽에서 접근한다.
- **독립 검산 및 KEEP 판정:** 원본 PNG의 x=a에서 x까지 f≥0인 음영 면적 S(x)=F(x)-F(a)를 확인; 오른쪽 미분계수 극한 2f(a)=20이다.
- 원본 그림: `archive/assets/images/22_팔마고_2학기_기말_고2_수학II/q21.png` (blob `0d3e3ab0115b44f8c6a098d15100e033c7470bc4`, 원본 PNG 직접 판독 PASS). 해설 SVG: 없음.
- 점검 상태: SOURCE_READ_EVIDENCED / SOURCE_FIGURE_EVIDENCED / RELEASE_QA_NOT_RUN.

## Q22 — KEEP

- ordinal: 22; id: `22`; sourceQid: `q22`; questionUid: `NOT_PRESENT`; source blob: `9edf58cd349864203bf79323d0a9915a4b4ac079`.
- 과목·분류: `수학II` / `최대·최소`.
- 원본 문제·보기 필드 직접 확인:

```text
서술형 3. 어느 박람회에 원기둥을 직접 만들어 보는 체험관이 있다. 이 체험관에서는 겉넓이가 $k$로 일정하면서 부피가 최대인 원기둥을 만드는 행사를 열었다. 이때, 부피가 최대인 원기둥의 밑면의 반지름의 길이와 높이의 비를 가장 작은 자연수의 비로 나타내고, 그 풀이과정을 서술하시오. [7.0점]
원본 보기: []
```

- 원본 정답: `1:2`.
- **기존 solution 실제 원문 핵심 발췌:**
> 밑면의 반지름을 $r>0$, 높이를 $h>0$이라 하자. 원기둥의 겉넓이는 윗면·아랫면 두 원과 옆면을 합한
> 따라서 반지름:높이의 가장 작은 자연수 비는 $\boxed{1:2}$이다.
- **독립 검산 및 KEEP 판정:** 겉넓이 $2πr²+2πrh=k$에서 V=(k/2)r-πr³, V'=0은 k=6πr²를 주고 h=2r, 반지름:높이=1:2다.
- 원본 그림: 원본 문제 이미지 별도 연결 없음. 해설 SVG: `assets/images/22_팔마고_2학기_기말_고2_수학II/q22-solution.svg` (solutionImage 렌더 NOT_RUN).
- 점검 상태: SOURCE_READ_EVIDENCED / TEXT_ONLY / RELEASE_QA_NOT_RUN.

## 종료 검증 및 후속 인계

- 전체 source 문제·기존 solution 판독: **22/22**. KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0; 개선 해설 작성 대상 없음(원문 계산/정답 충돌 발견 없음).
- 실물 문제 PNG 판독: **4**개. SVG 도형 파라미터 검사: **0**개, 별도 raster/학생 렌더 NOT_RUN.
- 다음 단계: Golden/Negative, preflight 영수증·학생 화면 확인·출고 QA. 완료 전 운영 JS·main 병합 PASS로 표기하지 않는다.
