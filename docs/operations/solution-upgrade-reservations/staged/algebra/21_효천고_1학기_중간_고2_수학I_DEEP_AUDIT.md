# 2021 21_효천고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2021`
- source: `archive/exams/original/high/h2/1mid/21_효천고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` (실제 열람 브랜치)
- source blob SHA: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/21_효천고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 0/21, `category` 누락 0/21, `questionType` 누락 0/21; 누락값은 추정해 채우지 않고 `NOT_PRESENT`로 기록
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 21 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일에 실린 21문항의 원본 `content`·`choices`·`answer`·`solution` 전수 확인 및 수학적 독립 검산. 연결 이미지 실물 검사. 이 MD 외의 원본 JS·정답키·SVG·PNG·`main` 수정 없음.

## 검토 기준·실물 검증 경계

- 지침: `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 선행 lane30 MD 감사 구조와 필드 유지.
- 수학 검토: 단원별 지수·근호 실수 정의역, 로그의 밑/진수, 삼각함수 부호·주기·끝점, 함수 최적화 및 정수 해 개수를 문항별 계산. 정답 문자열·선지 위치와 대응 검증.
- 시각 검사: 문제/선지 원본 PNG 5개는 실물 이미지로 열어 도형·축·값 대조, 해설 SVG 1개는 원본 XML 확인 후 Inkscape로 PNG 렌더하여 실물 시각 대조. SVG 최종 서비스 렌더와 별도 앱 화면 검증을 통과한 것은 아님.
- 운영 출고 및 `preflight`·Golden/Negative·전체 서비스 렌더·SHA-256 영수증은 이번 MD 감사 범위 밖이며 `NOT_RUN`. `HOLD`는 출고 보류지 운영 QA 성공을 뜻하지 않음.

## 이미지 실제 경로·Git blob 증거

- Q06 문제·선지 PNG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q06.png` · Git blob `05d09bc8bc81c88634cda493b977c5f13286279a` · 원본 PNG 실파일 시각 판독
- Q17 문제·선지 PNG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q17.png` · Git blob `6d188b6afd418c9800653c9fc0e84f10ebd699c8` · 원본 PNG 실파일 시각 판독
- Q18 문제·선지 PNG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q18.png` · Git blob `7656ed02c87764e1160eb773d07919ea6a25eabb` · 원본 PNG 실파일 시각 판독
- Q19 문제·선지 PNG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q19.png` · Git blob `494edf3db36f5facc6e6b5edc64024b6d59e87d7` · 원본 PNG 실파일 시각 판독
- Q20 문제·선지 PNG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q20.png` · Git blob `0cd9d0d307bf3f81c72992f196c49325cf5d174a` · 원본 PNG 실파일 시각 판독
- Q20 보조 해설 SVG — `archive/assets/images/21_효천고_1학기_중간_고2_수학I/q20-solution.svg` · Git blob `900d81b838d56b7c74411dc89e1e82b179f6548b` · 원본 XML 확인·Inkscape PNG 렌더·시각 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `3.7`; 원본 표준과정/단원: `수학I` / `거듭제곱근을 지수법칙으로 정리한 후 로그값과 합산`
- **원본 `content` 전체:**

````text
다음 식을 간단히 하면?<br>$$\sqrt[3]{\sqrt[3]{5^{18}}}+\log_{\sqrt{3}}\sqrt{27}$$ [3.7점]
````

- **원본 `choices` (순서 보존):**

````text
1. 29
2. 28
3. 27
4. 26
5. 25
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
거듭제곱근이 두 번 겹쳐 있으므로 안쪽부터 지수로 나타냅니다.<br>$$\sqrt[3]{\sqrt[3]{5^{18}}}=\left(5^{18}\right)^{\frac13\cdot\frac13}=5^{\frac{18}{9}}=5^2=25$$<br>로그에서는 밑과 진수를 모두 $3$의 거듭제곱으로 바꿉니다.<br>$$\sqrt3=3^{\frac12},\qquad \sqrt{27}=3^{\frac32}$$<br>$$\log_{\sqrt3}\sqrt{27}=\log_{3^{\frac{1}{2}}}3^{\frac{3}{2}}=\frac{\frac32}{\frac12}=3$$<br>따라서 $25+3=28$이므로 정답은 ②입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 이중 세제곱근 \(5^{18/9}=25\), 로그 \(\log_{3^{1/2}}3^{3/2}=3\), 합28, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q02 — KEEP

- source ordinal/id: `2` / `2` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.5`; 원본 표준과정/단원: `수학I` / `로그의 밑과 진수 정의 조건의 교집합`
- **원본 `content` 전체:**

````text
$\log_{a-2}(-a^2+3a+10)$이 정의되기 위한 실수 $a$의 값의 범위를 $l<a<m$, $m<a<n$이라 할 때, 실수 $l,m,n$에 대하여 $l+m+n$의 값은? [4.5점]
````

- **원본 `choices` (순서 보존):**

````text
1. 10
2. 11
3. 12
4. 13
5. 14
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
로그가 정의되려면 밑은 양수이면서 $1$이 아니고, 진수는 양수여야 합니다.<br>$$a-2>0\ \Rightarrow\ a>2,\qquad a-2\ne1\ \Rightarrow\ a\ne3$$<br>진수 조건을 인수분해합니다.<br>$$-a^2+3a+10=-(a-5)(a+2)>0$$<br>$$\therefore\ -2<a<5$$<br>세 조건을 함께 적용하면<br>$$2<a<3\quad\text{또는}\quad3<a<5$$<br>따라서 $l=2,\ m=3,\ n=5$이므로 $l+m+n=10$입니다. 정답은 ①입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 밑 조건 \(a>2,a\ne3\); 진수 \(-2<a<5\). 합쳐 \((2,3)\cup(3,5)\), 경계합10, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q03 — KEEP

- source ordinal/id: `3` / `3` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `3.8`; 원본 표준과정/단원: `수학I` / `지수방정식을 로그식으로 변환하여 역수 표현 소거`
- **원본 `content` 전체:**

````text
$45^x=9$, $5^y=27$일 때, 두 실수 $x,y$에 대하여 $\dfrac2x-\dfrac3y$의 값은? [3.8점]
````

- **원본 `choices` (순서 보존):**

````text
1. -2
2. -1
3. 1
4. 2
5. 3
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
양변에 로그를 취하면 지수를 앞으로 내릴 수 있습니다.<br>$$45^x=9\ \Rightarrow\ x\log45=\log9$$<br>$$\frac1x=\frac{\log45}{\log9}=\frac{\log5+2\log3}{2\log3}$$<br>또 $5^y=27$에서<br>$$y\log5=3\log3,\qquad\frac1y=\frac{\log5}{3\log3}$$<br>이제 두 식을 그대로 대입합니다.<br>$$\frac2x-\frac3y=2\cdot\frac{\log5+2\log3}{2\log3}-3\cdot\frac{\log5}{3\log3}$$<br>$$=\frac{\log5+2\log3-\log5}{\log3}=2$$<br>정답은 ④입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(2/x=2\log45/\log9\), \(3/y=3\log5/\log27\)의 차는 \(2\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q04 — KEEP

- source ordinal/id: `4` / `4` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.4`; 원본 표준과정/단원: `수학I` / `상용로그의 몫을 거리비 음압 공식에 대입`
- **원본 `content` 전체:**

````text
음원에서 떨어진 거리가 $d_1m$, $d_2m$인 두 지점에서 소리의 크기를 각각 $S_1dB$, $S_2dB$이라고 할 때, 다음의 관계가 성립한다고 한다.<br>$$S_2=S_1+20\log\dfrac{d_1}{d_2}$$<br>공연장의 스피커에서 $3m$ 떨어진 곳의 소리의 크기가 $100.4dB$이라고 할 때, 이 스피커에서 $10m$ 떨어진 곳의 소리의 크기는 얼마인가?<br>(단, $\log3=0.48$으로 계산한다.) [4.4점]
````

- **원본 `choices` (순서 보존):**

````text
1. 84dB
2. 86dB
3. 90dB
4. 94dB
5. 96dB
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
처음 지점이 $3m$이므로 $d_1=3$, $S_1=100.4$이고, 새 지점은 $d_2=10$입니다.<br>$$S_2=100.4+20\log\frac3{10}$$<br>로그의 나눗셈 성질을 이용하면<br>$$\log\frac3{10}=\log3-\log10=0.48-1=-0.52$$<br>$$S_2=100.4+20(-0.52)=100.4-10.4=90$$<br>따라서 소리의 크기는 $90dB$, 정답은 ③입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 소리 크기 \(100.4+20\log(3/10)=100.4+20(-0.52)=90\)dB, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q05 — KEEP

- source ordinal/id: `5` / `5` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `3.9`; 원본 표준과정/단원: `수학I` / `밑이 0과 1 사이인 지수부등식의 지수 비교`
- **원본 `content` 전체:**

````text
부등식 $\left(\dfrac12\right)^{x+4}<\left(\dfrac12\right)^{-x}$을 만족시키는 $x$의 값의 범위는? [3.9점]
````

- **원본 `choices` (순서 보존):**

````text
1. $x<-1$
2. $x>-1$
3. $x<-2$
4. $x>-2$
5. $-2<x<-1$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
밑 $\frac12$는 $0$과 $1$ 사이이므로 지수가 커질수록 함수값은 작아집니다. 따라서 부등호 방향을 바꾸어 지수를 비교합니다.<br>$$\left(\frac12\right)^{x+4}<\left(\frac12\right)^{-x}\ \Longleftrightarrow\ x+4>-x$$<br>$$2x>-4\ \Longleftrightarrow\ x>-2$$<br>정답은 ④입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 밑 \(1/2\) 감소이므로 \(x+4>-x\), \(x>-2\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q06 — KEEP

- source ordinal/id: `6` / `6` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.3`; 원본 표준과정/단원: `수학I` / `로그의 곱 성질과 눈금 그래프 대응`
- **원본 `content` 전체:**

````text
다음은 함수 $f(x)=\log x$의 그래프이다. $f(M)=0.3$, $f(N)=0.4$일 때 상수 $M,N$에 대하여 $MN$의 값은?<div class="exam-img-box"><img src="assets/images/21_효천고_1학기_중간_고2_수학I/q06.png" class="exam-img" data-archive-mobile-figure="true" alt="상용로그 곡선 y=log x에 y=0.1부터 0.7까지의 수평 점선이 그려져 있고, 각 곡선 교점에서 x축으로 수직 점선이 내려온다. y=0.3과 0.4의 수직선은 각각 x축의 M, N 표식에 닿고, y=0.7의 수직선은 e 표식에 닿는다. x축에는 a, b, M, N, c, d, e가 표시되어 있다."></div> [4.3점]
````

- **원본 `choices` (순서 보존):**

````text
1. $a$
2. $b$
3. $c$
4. $d$
5. $e$
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
상용로그에서 $\log M=0.3$, $\log N=0.4$입니다. 곱의 로그는 로그의 합이므로<br>$$\log(MN)=\log M+\log N=0.3+0.4=0.7$$<br>따라서 $MN=10^{0.7}$입니다. 그림에서 $y=0.7$에 대응하는 $x$좌표가 $e$이므로 $MN=e$, 정답은 ⑤입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\log M=0.3,\log N=0.4\Rightarrow\log(MN)=0.7\). PNG의 0.7 높이 x좌표 \(e\), ⑤.
- **그림 실물 근거:** `assets/images/21_효천고_1학기_중간_고2_수학I/q06.png` / blob `05d09bc8bc81c88634cda493b977c5f13286279a` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q07 — KEEP

- source ordinal/id: `7` / `7` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.7`; 원본 표준과정/단원: `수학I` / `로그 그래프의 평행이동 가로·세로 변위 계산`
- **원본 `content` 전체:**

````text
함수 $y=\log_3(x-2)+3$의 그래프를 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동하면 $y=\log_3(3x-9)$의 그래프와 일치한다. 상수 $a,b$의 곱 $ab$의 값은? [4.7점]
````

- **원본 `choices` (순서 보존):**

````text
1. -2
2. -1
3. 1
4. 2
5. 3
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
평행이동을 하면 그래프의 모양은 그대로이고 위치만 달라집니다. 원래 함수가 $y=\log_3(x-2)+3$이므로 오른쪽으로 $a$, 위쪽으로 $b$만큼 이동한 함수는<br>$$y=\log_3\{(x-a)-2\}+3+b=\log_3(x-a-2)+3+b$$<br>목표 함수의 로그 안을 $3$으로 묶어 같은 모양으로 바꿉니다.<br>$$y=\log_3(3x-9)=\log_3\{3(x-3)\}$$<br>$$=\log_3 3+\log_3(x-3)=1+\log_3(x-3)$$<br>원래 함수의 로그 안은 $x-2$, 목표 함수는 $x-3$이므로 그래프가 오른쪽으로 $1$만큼 이동해야 합니다. 실제로 $x-a-2=x-3$에서<br>$$-a-2=-3\quad\Longrightarrow\quad a=1$$<br>세로 위치도 원래의 $+3$이 목표의 $+1$이 되어야 하므로<br>$$3+b=1\quad\Longrightarrow\quad b=-2$$<br>이동 후 정의역도 $x>a+2=3$으로 목표 함수의 $x>3$과 같습니다.<br>$$ab=1\times(-2)=-2$$<br>따라서 정답은 ①입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\log_3(3x-9)=\log_3(x-3)+1\), 가로 이동 \(a=1\), 세로 \(b=-2\), 곱−2, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q08 — KEEP

- source ordinal/id: `8` / `8` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.8`; 원본 표준과정/단원: `수학I` / `감쇠 지수모형에 상용로그를 취해 지수 역산`
- **원본 `content` 전체:**

````text
독일의 심리학자 에빙하우스의 망각의 법칙은 다음과 같다. 학습한 처음 기억 상태를 $P_0$, $t$개월 후의 기억 상태를 $P$, 학습 종류에 따라 정해지는 상수를 $c$라고 할 때,<br>$$P=\frac{P_0}{(t+1)^c}$$<br>어느 학습에서 처음 기억 상태가 90, 4개월 후의 기억 상태가 77일 때 이 학습 종류의 $c$의 값은? (단, $\log2=0.30$, $\log3=0.48$, $\log7.7=0.89$로 계산한다.) [4.8점]
````

- **원본 `choices` (순서 보존):**

````text
1. 0.1
2. 0.2
3. 0.3
4. 0.4
5. 0.5
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$P_0=90$, $t=4$, $P=77$을 주어진 식에 대입합니다.<br>$$77=\frac{90}{5^c}\ \Longleftrightarrow\ 5^c=\frac{90}{77}$$<br>양변에 상용로그를 취합니다.<br>$$c\log5=\log90-\log77$$<br>문제에서 주어진 값으로 각각 계산합니다.<br>$$\log5=1-\log2=0.70$$<br>$$\log90=\log(9\cdot10)=2\log3+1=1.96$$<br>$$\log77=\log(7.7\cdot10)=0.89+1=1.89$$<br>$$c=\frac{1.96-1.89}{0.70}=\frac{0.07}{0.70}=0.1$$<br>정답은 ①입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(5^c=90/77\). 지정 상용로그 \(\log90-\log77=0.07\), \(\log5=0.70\)라 \(c=0.1\), ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q09 — KEEP

- source ordinal/id: `9` / `9` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.1`; 원본 표준과정/단원: `수학I` / `역수 거듭제곱의 치환과 세제곱의 합 인수분해`
- **원본 `content` 전체:**

````text
$a^{2x}=3$일 때, $\dfrac{a^{3x}+a^{-3x}}{a^x+a^{-x}}$의 값은? (단, $a>0$) [4.1점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\dfrac83$
2. $\dfrac73$
3. 2
4. $\dfrac53$
5. $\dfrac43$
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
분자에는 세제곱, 분모에는 일제곱이 나타나므로 같은 밑의 거듭제곱을 하나의 문자로 바꿉니다.<br>$$t=a^x\quad(a>0\text{이므로 }t>0),\qquad t^2=a^{2x}=3$$<br>구하려는 식은<br>$$\frac{a^{3x}+a^{-3x}}{a^x+a^{-x}}=\frac{t^3+t^{-3}}{t+t^{-1}}$$<br>여기서 분자에 바로 $t^2=3$을 넣기보다 세제곱의 합을 인수분해합니다. $u^3+v^3=(u+v)(u^2-uv+v^2)$에서 $u=t$, $v=t^{-1}$로 놓으면 $uv=1$입니다.<br>$$t^3+t^{-3}=(t+t^{-1})(t^2-tt^{-1}+t^{-2})$$<br>$$=(t+t^{-1})(t^2-1+t^{-2})$$<br>$t>0$이므로 분모 $t+t^{-1}>0$입니다. 따라서 약분할 수 있고,<br>$$\frac{t^3+t^{-3}}{t+t^{-1}}=t^2-1+\frac1{t^2}$$<br>$$=3-1+\frac13=\frac{9-3+1}{3}=\frac73$$<br>따라서 정답은 ②입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(t=a^x>0,t^2=3\), \((t^3+t^{-3})/(t+t^{-1})=t^2-1+t^{-2}=7/3\), ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q10 — KEEP

- source ordinal/id: `10` / `10` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `5`; 원본 표준과정/단원: `수학I` / `로그차의 정수 조건에서 가능한 지수를 추린 후 곱 계산`
- **원본 `content` 전체:**

````text
$10\le x<100$일 때, $\log x$와 $\log\dfrac1{x^2}$의 차가 정수가 되도록 하는 모든 $x$값의 곱을 구하면? [5.0점]
````

- **원본 `choices` (순서 보존):**

````text
1. $10^2$
2. $10^{\frac73}$
3. $10^{\frac{10}3}$
4. $10^4$
5. $10^{\frac{14}3}$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
먼저 $10\le x<100$이므로 $x>0$이고, 상용로그가 증가함수임을 이용하면<br>$$1=\log10\le\log x<\log100=2$$<br>로그의 성질로 두 로그의 차를 한 식으로 정리합니다.<br>$$\log\frac1{x^2}=\log(x^{-2})=-2\log x$$<br>$$\log x-\log\frac1{x^2}=\log x-(-2\log x)=3\log x$$<br>이 값이 정수여야 하므로 $k=3\log x$를 정수라고 놓습니다. 위 범위에 $3$을 곱하면<br>$$3\le k<6$$<br>따라서 가능한 정수는 정확히 $k=3,4,5$입니다. $6$은 오른쪽 끝이 포함되지 않아 제외됩니다.<br>$$3\log x=k\quad\Longleftrightarrow\quad\log x=\frac{k}{3}\quad\Longleftrightarrow\quad x=10^{\frac{k}{3}}$$<br>$$k=3:\ x=10,\qquad k=4:\ x=10^{\frac{4}{3}},\qquad k=5:\ x=10^{\frac{5}{3}}$$<br>세 수의 곱은 같은 밑 $10$의 지수를 더해<br>$$10\cdot10^{\frac{4}{3}}\cdot10^{\frac{5}{3}}=10^{1+\frac{4}{3}+\frac{5}{3}}=10^{1+3}=10^4$$<br>따라서 정답은 ④입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(1\le\log x<2\), 정수 조건 \(3\log x=3,4,5\). 세 x의 곱 \(10^{(3+4+5)/3}=10^4\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q11 — KEEP

- source ordinal/id: `11` / `11` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.6`; 원본 표준과정/단원: `수학I` / `감사 수정된 중근을 로그의 지수 관계에 대입`
- **원본 `content` 전체:**

````text
이차방정식 $x^2-5x+\dfrac{25}{4}=0$의 두 근이 $\log\alpha$, $\log\beta$일 때, $\log_{\alpha}\beta+\log_{\beta}\alpha$의 값은? [4.6점]
````

- **원본 `choices` (순서 보존):**

````text
1. 1
2. $\dfrac97$
3. $\dfrac{11}7$
4. $\dfrac{13}7$
5. 2
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
먼저 이차방정식을 완전제곱식으로 나타냅니다.<br>$$x^2-5x+\frac{25}{4}=\left(x-\frac52\right)^2=0$$<br>따라서 두 근이 모두 $\frac52$이므로<br>$$\log\alpha=\frac52,\qquad\log\beta=\frac52$$<br>즉 $\alpha=\beta=10^{\frac{5}{2}}>0$이고 밑은 $1$이 아닙니다.<br>같은 양수의 로그는 $\log_{\alpha}\beta=1$, $\log_{\beta}\alpha=1$이므로<br>$$\log_{\alpha}\beta+\log_{\beta}\alpha=1+1=2$$<br>정답은 ⑤입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \((z-5/2)^2=0\), \(\alpha=\beta=10^{5/2}\ne1\), 각 상호로그1로 합2, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q12 — KEEP

- source ordinal/id: `12` / `12` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `5.1`; 원본 표준과정/단원: `수학I` / `로그합을 곱으로 결합한 망원곱 약분`
- **원본 `content` 전체:**

````text
함수 $f(x)=\log_3\left(1+\dfrac1{x+3}\right)$에서 $f(1)+f(2)+f(3)+\cdots+f(n)=3$을 만족시키는 자연수 $n$의 값은? [5.1점]
````

- **원본 `choices` (순서 보존):**

````text
1. 100
2. 102
3. 104
4. 106
5. 108
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
여러 로그를 더하는 문제이므로 로그의 곱셈 성질을 이용해 중간 항이 소거되는지 살펴봅니다.<br>$$f(k)=\log_3\left(1+\frac1{k+3}\right)=\log_3\frac{k+4}{k+3}$$<br>처음 몇 항을 실제로 써 보면<br>$$f(1)=\log_3\frac54,\quad f(2)=\log_3\frac65,\quad f(3)=\log_3\frac76$$<br>$$f(1)+\cdots+f(n)=\log_3\left(\frac54\cdot\frac65\cdot\frac76\cdots\frac{n+4}{n+3}\right)$$<br>분모의 $5$는 다음 분자의 $5$와, 분모의 $6$은 다음 분자의 $6$과 약분됩니다. 중간 수가 모두 없어지고 첫 분모 $4$와 마지막 분자 $n+4$만 남으므로<br>$$=\log_3\frac{n+4}{4}$$<br>이 합이 $3$이라는 조건을 적용하면<br>$$\log_3\frac{n+4}{4}=3\quad\Longleftrightarrow\quad\frac{n+4}{4}=3^3=27$$<br>$$n+4=4\times27=108\quad\Longleftrightarrow\quad n=104$$<br>$104$는 자연수이므로 조건에 맞고 정답은 ③입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\sum_{k=1}^n\log_3((k+4)/(k+3))=\log_3((n+4)/4)=3\); \(n=104\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q13 — KEEP

- source ordinal/id: `13` / `13` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4`; 원본 표준과정/단원: `수학I` / `동경의 360° 동치를 적용한 사분면 판단`
- **원본 `content` 전체:**

````text
다음 <보기>의 각 중에서 각 $-460^\circ$와 같은 사분면에 속하는 각을 모두 고른 것은?<br><div class="exam-box"><보기><br>ㄱ. $240^\circ$&emsp;&emsp;ㄴ. $315^\circ$<br>ㄷ. $-\dfrac95\pi$&emsp;&emsp;ㄹ. $-\dfrac{29}{6}\pi$</div> [4.0점]
````

- **원본 `choices` (순서 보존):**

````text
1. ㄱ, ㄴ
2. ㄱ, ㄷ
3. ㄱ, ㄹ
4. ㄴ, ㄷ
5. ㄴ, ㄹ
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
동경의 위치는 $360^\circ$의 정수배를 더하거나 빼도 같습니다.<br>$$-460^\circ+720^\circ=260^\circ$$<br>$260^\circ$는 제3사분면입니다. 각 보기를 같은 방법으로 비교합니다.<br>ㄱ. $240^\circ$는 제3사분면입니다.<br>ㄴ. $315^\circ$는 제4사분면입니다.<br>ㄷ. $-\frac95\pi=-324^\circ$이고, $-324^\circ+360^\circ=36^\circ$이므로 제1사분면입니다.<br>ㄹ. $-\frac{29}{6}\pi=-870^\circ$이고, $-870^\circ+1080^\circ=210^\circ$이므로 제3사분면입니다.<br>따라서 ㄱ, ㄹ이고 정답은 ③입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(-460^\circ\equiv260^\circ\)은 제3사분면. ㄱ240°·ㄹ−870°만 해당, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q14 — KEEP

- source ordinal/id: `14` / `14` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `3.5`; 원본 표준과정/단원: `수학I` / `호 길이와 반지름에서 중심각의 호도법 관계를 사용`
- **원본 `content` 전체:**

````text
반지름의 길이가 $3\mathrm{cm}$, 호의 길이가 $2\mathrm{cm}$인 부채꼴의 중심각의 크기를 구하면? [3.5점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\dfrac13$
2. $\dfrac23$
3. 1
4. $\dfrac53$
5. 2
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
호의 길이 공식은 중심각을 라디안으로 나타낼 때 $l=r\theta$입니다.<br>반지름 $r=3$, 호의 길이 $l=2$를 대입하면<br>$$2=3\theta\ \Longleftrightarrow\ \theta=\frac23$$<br>중심각은 $\frac23$라디안이고 정답은 ②입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 호길이 \(2=r\theta=3\theta\)에서 \(\theta=2/3\) rad, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q15 — KEEP

- source ordinal/id: `15` / `15` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.2`; 원본 표준과정/단원: `수학I` / `삼각함수 제곱 관계에서 곱을 구해 역수 합에 대입`
- **원본 `content` 전체:**

````text
$\sin x+\cos x=\dfrac12$일 때, $\tan x+\dfrac1{\tan x}$의 값은? [4.2점]
````

- **원본 `choices` (순서 보존):**

````text
1. 2
2. -2
3. $\dfrac83$
4. $-\dfrac83$
5. $-\dfrac{10}3$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
먼저 주어진 식을 제곱하여 $\sin x\cos x$를 구합니다.<br>$$\left(\sin x+\cos x\right)^2=\frac14$$<br>$$\sin^2x+2\sin x\cos x+\cos^2x=\frac14$$<br>$$1+2\sin x\cos x=\frac14$$<br>$$2\sin x\cos x=-\frac34\ \Longleftrightarrow\ \sin x\cos x=-\frac38$$<br>따라서 $\sin x$와 $\cos x$는 모두 $0$이 아니므로 다음 식이 정의됩니다.<br>$$\tan x+\frac1{\tan x}=\frac{\sin x}{\cos x}+\frac{\cos x}{\sin x}$$<br>$$=\frac{\sin^2x+\cos^2x}{\sin x\cos x}=\frac1{-\frac{3}{8}}=-\frac83$$<br>정답은 ④입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\sin x+\cos x=1/2\Rightarrow\sin x\cos x=-3/8\); \(\tan x+\cot x=-8/3\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q16 — KEEP

- source ordinal/id: `16` / `16` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `4.9`; 원본 표준과정/단원: `수학I` / `절댓값 사인·코사인·탄젠트 함수 주기를 각각 계산`
- **원본 `content` 전체:**

````text
다음에 주어진 함수의 주기의 합을 구하면?<br><div class="exam-box">$y=|\sin x|+2\pi$&emsp;&emsp;$y=2\pi\cos x$<br>$y=\tan\dfrac x2$</div> [4.9점]
````

- **원본 `choices` (순서 보존):**

````text
1. $3\pi$
2. $\dfrac72\pi$
3. $4\pi$
4. $\dfrac92\pi$
5. $5\pi$
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
각 함수의 주기는 $x$를 얼마나 이동시켰을 때 **함수값 전체가 처음으로 반복되는지**로 판단합니다.<br><b>첫째, $y=|\sin x|+2\pi$</b><br>$$|\sin(x+\pi)|=|-\sin x|=|\sin x|$$<br>따라서 $\pi$만큼 이동하면 반복됩니다. $|\sin x|$는 $x=0,\pi,2\pi,\ldots$에서 $0$이고 이웃한 두 영점 사이의 봉우리가 하나이므로 최소 양의 주기는 $\pi$입니다. $+2\pi$는 그래프를 위로 옮길 뿐 주기를 바꾸지 않습니다.<br><b>둘째, $y=2\pi\cos x$</b><br>$$2\pi\cos(x+2\pi)=2\pi\cos x$$<br>앞의 $2\pi$는 함수값의 크기만 바꾸므로 최소 양의 주기는 $2\pi$입니다.<br><b>셋째, $y=\tan\frac x2$</b><br>탄젠트의 최소 양의 주기는 $\pi$이므로 안쪽 각이 $\pi$만큼 늘어야 합니다.<br>$$\frac{x+T}{2}-\frac x2=\pi\quad\Longrightarrow\quad\frac T2=\pi\quad\Longrightarrow\quad T=2\pi$$<br>따라서 세 주기의 합은<br>$$\pi+2\pi+2\pi=5\pi$$<br>정답은 ⑤입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(|\sin x|\) 주기 \(\pi\), \(\cos x\) 주기 \(2\pi\), \(\tan(x/2)\) 주기 \(2\pi\); 합 \(5\pi\), ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q17 — KEEP

- source ordinal/id: `17` / `17` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `5.3`; 원본 표준과정/단원: `수학I` / `코사인 그래프 진폭·주기·위상을 눈금으로 역산`
- **원본 `content` 전체:**

````text
다음 그림은 $y=a\cos(bx+c)-1$의 그래프이다. 주기를 $p$라 할 때, $ab+\dfrac pc$의 값은?<br>(단, $a>0$, $b>0$, $0<c<\pi$)<div class="exam-img-box"><img src="assets/images/21_효천고_1학기_중간_고2_수학I/q17.png" class="exam-img" data-archive-mobile-figure="true" alt="좌표축에 y=a cos(bx+c)−1의 그래프가 그려져 있다. 수평 점선은 y=1과 y=−3을 나타내며, x축에는 −π/3, π/3, 3π가 표시되어 있다. 곡선은 꼭대기에서 내려와 x축을 지나 최저점에 이른 뒤 다시 올라간다."></div> [5.3점]
````

- **원본 `choices` (순서 보존):**

````text
1. 21
2. 22
3. 23
4. 24
5. 25
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
그림의 높이와 두 가로 눈금을 차례로 읽어 $a,b,c$를 정합니다.<br><b>① 진폭 $a$</b><br>최댓값이 $1$, 최솟값이 $-3$이므로 중심선은 $\frac{1+(-3)}2=-1$입니다. 이는 식의 마지막 $-1$과도 같습니다. 중심선에서 꼭대기까지의 거리가 진폭이므로<br>$$a=\frac{1-(-3)}2=2$$<br><b>② 가로 변화로 $b$</b><br>그림에서 $x=-\frac\pi3$은 최대점이고, 그 다음에 곡선이 내려오며 $x=\frac\pi3$에서 $y=0$을 지납니다. $a=2$를 넣으면<br>$$y=2\cos(bx+c)-1$$<br>최대점에서 코사인값은 $1$, 이어서 내려오는 첫 $y=0$에서는 코사인값이 $\frac12$입니다. 따라서 이 두 점 사이에 코사인의 각은 $0$에서 $\frac\pi3$만큼 증가합니다. (내려오는 구간이므로 $-\frac\pi3$이 아니라 $+\frac\pi3$입니다.)<br>$$\Delta x=\frac\pi3-\left(-\frac\pi3\right)=\frac{2\pi}{3}$$<br>$$b\Delta x=\frac\pi3\quad\Longrightarrow\quad b\cdot\frac{2\pi}{3}=\frac\pi3\quad\Longrightarrow\quad b=\frac12$$<br><b>③ 최대점의 위치로 $c$</b><br>최대점에서는 $bx+c=2m\pi$($m$은 정수)입니다.<br>$$\frac12\left(-\frac\pi3\right)+c=2m\pi\quad\Longrightarrow\quad c=\frac\pi6+2m\pi$$<br>$0<c<\pi$에 들어가는 값은 $m=0$일 때뿐이므로 $c=\frac\pi6$입니다.<br><b>④ 주기와 마지막 계산</b><br>코사인의 안쪽 각이 $2\pi$ 증가하는 동안 $x$는 $p$ 증가하므로<br>$$bp=2\pi\quad\Longrightarrow\quad p=\frac{2\pi}{\frac{1}{2}}=4\pi$$<br>$$ab+\frac pc=2\cdot\frac12+\frac{4\pi}{\pi/6}=1+24=25$$<br>따라서 정답은 ⑤입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 원본 PNG 최대1·최소−3에서 \(a=2\). \(x=-\pi/3\) 최고에서 \(x=\pi/3\) 첫 하강 y0으로 \(b=1/2,c=\pi/6,p=4\pi\), \(ab+p/c=25\), ⑤.
- **그림 실물 근거:** `assets/images/21_효천고_1학기_중간_고2_수학I/q17.png` / blob `6d188b6afd418c9800653c9fc0e84f10ebd699c8` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q18 — KEEP

- source ordinal/id: `18` / `18` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `객관식` / `5.2`; 원본 표준과정/단원: `수학I` / `사인 그래프 대칭점을 이용하여 내접 직사각형의 높이 계산`
- **원본 `content` 전체:**

````text
다음 그림과 같이 $y=\sin\dfrac\pi4 x$의 그래프와 $x$축 사이에 직사각형 $\mathrm{ABCD}$가 내접하고 있다. 직사각형의 밑변 $\mathrm{BC}$의 길이가 $\dfrac83$일 때, 직사각형 $\mathrm{ABCD}$의 넓이를 구하면?<div class="exam-img-box"><img src="assets/images/21_효천고_1학기_중간_고2_수학I/q18.png" class="exam-img" data-archive-mobile-figure="true" alt="좌표축에 y=sin(πx/4)의 곡선이 그려져 있다. x축 위에 직사각형 ABCD가 놓이고, A와 D는 곡선 위의 같은 높이에 있으며 B와 C는 x축 위에 있다. 곡선의 꼭대기 높이 1도 점선으로 표시되어 있다."></div> [5.2점]
````

- **원본 `choices` (순서 보존):**

````text
1. 1
2. $\dfrac43$
3. $\dfrac53$
4. 2
5. $\dfrac73$
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
직사각형의 윗변 $AD$는 수평이므로 그래프 위의 두 점 $A,D$의 높이가 같습니다. 먼저 사인 그래프의 대칭성을 이용해 두 점의 $x$좌표를 구합니다.<br>$$y=\sin\frac\pi4x$$<br>이 함수는 $0\le x\le4$에서 $x=2$를 중심으로 좌우 대칭입니다. 실제로 $0\le t\le2$에 대하여<br>$$\sin\frac\pi4(2-t)=\sin\left(\frac\pi2-\frac{\pi t}4\right)=\cos\frac{\pi t}4$$<br>$$\sin\frac\pi4(2+t)=\sin\left(\frac\pi2+\frac{\pi t}4\right)=\cos\frac{\pi t}4$$<br>따라서 밑변 $BC$의 중점은 $x=2$입니다. 길이가 $\frac83$이므로 중점에서 양쪽 끝까지는 각각 $\frac43$입니다.<br>$$x_B=2-\frac43=\frac23,\qquad x_C=2+\frac43=\frac{10}3$$<br>직사각형의 높이는 $A$의 $y$좌표와 같으므로<br>$$AB=\sin\left(\frac\pi4\cdot\frac23\right)=\sin\frac\pi6=\frac12$$<br>넓이는 밑변과 높이의 곱입니다.<br>$$BC\cdot AB=\frac83\times\frac12=\frac43$$<br>따라서 정답은 ②입니다.
````

- **독립 검산·조건/끝점/정답 근거:** 사인 최고점 x=2에 대해 밑변 \(8/3\) 양끝 \(2/3,10/3\), 높이 \(\sin(\pi/6)=1/2\), 넓이 \(4/3\), ②.
- **그림 실물 근거:** `assets/images/21_효천고_1학기_중간_고2_수학I/q18.png` / blob `7656ed02c87764e1160eb773d07919ea6a25eabb` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q19 — KEEP

- source ordinal/id: `19` / `19` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `서술형` / `6`; 원본 표준과정/단원: `수학I` / `사인 그래프와 수평선 첫 네 교점의 위상합 제약을 분석`
- **원본 `content` 전체:**

````text
그림과 같이 $y=\sin\dfrac{k}{3}x$ $(x>0)$의 그래프와 직선 $y=a$ $(0<a<1)$의 교점의 $x$좌표 중 가장 작은 수를 $\alpha$, 두 번째로 작은 수를 $\beta$라 하고, 직선 $y=-a$의 교점의 $x$좌표 중 가장 작은 수를 $\gamma$, 두 번째로 작은 수를 $\delta$라 하자.<br>이 때, $\sin(\alpha+\beta+\gamma+\delta)=\dfrac{\sqrt3}{2}$을 만족시키는 양수 $k$의 최댓값을 풀이와 함께 구하시오.<div class="exam-img-box"><img src="assets/images/21_효천고_1학기_중간_고2_수학I/q19.png" class="exam-img" data-archive-mobile-figure="true" alt="x>0인 좌표평면에 y=sin(kx/3)의 곡선과 y=a, y=−a 수평선이 그려져 있다. y=a와 만나는 첫 두 점의 x좌표 α, β 및 y=−a와 만나는 첫 두 점의 x좌표 γ, δ가 점선으로 x축에 내려 표시되어 있다. 원점은 열린 점이다."></div> [6.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `36`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
사인곡선과 수평선의 첫 두 교점을 각각 찾되, 각을 먼저 구한 뒤 $x$좌표로 바꾸면 복잡한 미지수 $a$가 소거됩니다.<br>$0<a<1$이므로 $\sin\theta=a$인 $0<\theta<\frac\pi2$를 하나 정합니다. 또 $k>0$이므로 $x$가 커질수록 $\frac{kx}{3}$도 커집니다.<br><b>① $y=a$와의 첫 두 교점</b><br>양의 각에서 $\sin t=a$를 처음 만족시키는 각은 $\theta$, 다음은 $\pi-\theta$입니다. 따라서<br>$$\frac{k\alpha}{3}=\theta,\quad\frac{k\beta}{3}=\pi-\theta$$<br>$$\alpha=\frac{3\theta}{k},\qquad\beta=\frac{3(\pi-\theta)}{k}$$<br><b>② $y=-a$와의 첫 두 교점</b><br>사인값이 처음 음수가 되는 곳은 각 $\pi$ 이후입니다. 처음 $-a$가 되는 각은 $\pi+\theta$, 다음은 $2\pi-\theta$이므로<br>$$\gamma=\frac{3(\pi+\theta)}{k},\qquad\delta=\frac{3(2\pi-\theta)}{k}$$<br><b>③ 네 좌표의 합</b><br>$$\alpha+\beta=\frac3k\{\theta+\pi-\theta\}=\frac{3\pi}{k}$$<br>$$\gamma+\delta=\frac3k\{\pi+\theta+2\pi-\theta\}=\frac{9\pi}{k}$$<br>$$\alpha+\beta+\gamma+\delta=\frac{12\pi}{k}$$<br>따라서 $a$가 어떤 값이든 조건은<br>$$\sin\frac{12\pi}{k}=\frac{\sqrt3}{2}$$<br>로 바뀝니다.<br><b>④ $k$의 최댓값</b><br>$k>0$이므로 $t=\frac{12\pi}{k}>0$입니다. 사인값이 $\frac{\sqrt3}{2}$인 양의 각은<br>$$t=\frac\pi3+2m\pi\quad\text{또는}\quad t=\frac{2\pi}3+2m\pi\quad(m\text{은 정수})$$<br>이 가운데 가장 작은 양의 각은 $\frac\pi3$입니다. $k=\frac{12\pi}{t}$는 $t$가 작을수록 커지므로<br>$$k_{\max}=\frac{12\pi}{\pi/3}=36$$<br>따라서 최댓값은 $\boxed{36}$입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\alpha+\beta=3\pi/k,\gamma+\delta=9\pi/k\)이므로 \(\sin(12\pi/k)=\sqrt3/2\). 최소 양각 \(\pi/3\)에서 최대 \(k=36\).
- **그림 실물 근거:** `assets/images/21_효천고_1학기_중간_고2_수학I/q19.png` / blob `494edf3db36f5facc6e6b5edc64024b6d59e87d7` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q20 — KEEP

- source ordinal/id: `20` / `20` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `서술형` / `7`; 원본 표준과정/단원: `수학I` / `로그·지수의 대응 좌표로 만든 직사각형의 겹침 넓이를 비교`
- **원본 `content` 전체:**

````text
그림과 같이 두 함수 $y=\log_2 x$와 $y=2^x$의 그래프가 있다. 곡선 $y=\log_2 x$ 위의 점 $P(4,2)$와 $Q(a,\log_2 a)$에서 각각 $y$축에 평행한 직선을 그어 $x$축과 만나는 점을 각각 $P_1,Q_1$이라 하고, 각각 $x$축에 평행한 직선을 그어 곡선 $y=2^x$과 만나는 점을 각각 $P_2,Q_2$라 하자. 또 점 $P_2,Q_2$에서 각각 $y$축에 평행한 직선을 그어 $x$축과 만나는 점을 각각 $P_3,Q_3$라 하자.<br>두 사각형 $P_1PP_2P_3$와 $Q_1QQ_2Q_3$의 공통 부분의 넓이를 $S(a)$, 두 사각형의 넓이의 차를 $D(a)$라 하자.<br>2보다 큰 자연수 $n$에 대하여 $S(2^n)=4$일 때, $D(2^n)$의 값을 풀이와 함께 쓰시오. (단, $a>4$이다.)<div class="exam-img-box"><img src="assets/images/21_효천고_1학기_중간_고2_수학I/q20.png" class="exam-img" data-archive-mobile-figure="true" style="width:240px;max-width:100%;height:auto;max-height:230px;object-fit:contain" alt="지수곡선과 로그곡선이 그려져 있다. 로그곡선 위의 두 점 P와 Q에서 수평선으로 지수곡선에, 수직선으로 x축에 연결한다. 지수곡선 쪽 교점에서도 x축으로 수직선을 내리면 두 직사각형이 생기며, 겹치는 부분은 음영으로 표시되어 있다."></div> [7.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `50`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
두 사각형은 모두 밑변이 $x$축 위에 있으므로 **가로 구간과 높이**를 따로 정하면 겹치는 넓이를 구할 수 있습니다.<br><b>① 첫 직사각형 $P_1PP_2P_3$</b><br>$P=(4,2)$에서 수평선 $y=2$가 $y=2^x$와 만나는 점은 $2^x=2$에서 $x=1$이므로 $P_2=(1,2)$입니다.<br>$$1\le x\le4,\quad0\le y\le2,\qquad A_P=(4-1)\times2=6$$<br><b>② 둘째 직사각형 $Q_1QQ_2Q_3$</b><br>$a=2^n$이고 $n>2$이므로 $Q=(2^n,n)$입니다. 수평선 $y=n$과 $y=2^x$의 교점은 $2^x=n$에서 $Q_2=(\log_2n,n)$입니다.<br>$$\log_2n\le x\le2^n,\quad0\le y\le n$$<br>$$A_Q=(2^n-\log_2n)\times n$$<br><b>③ 공통 부분의 넓이로 $n$ 결정</b><br>$n>2$이므로 $\log_2n>1$, $2^n>4$, $n>2$입니다. 따라서 두 사각형의 오른쪽 경계 중 작은 값은 $4$, 위쪽 높이 중 작은 값은 $2$이고, 겹치는 부분의 왼쪽 경계는 $\log_2n$입니다.<br>만약 $\log_2n\ge4$라면 겹치는 넓이는 $0$입니다. 그러나 문제에서 $S(2^n)=4>0$이므로 $\log_2n<4$이고, 겹친 직사각형의 가로 길이는 $4-\log_2n$입니다.<br>$$S(2^n)=2(4-\log_2n)=4$$<br>$$4-\log_2n=2\quad\Longrightarrow\quad\log_2n=2\quad\Longrightarrow\quad n=2^2=4$$<br>실제로 $n=4$는 $n>2$와 $\log_2n<4$를 모두 만족합니다.<br><b>④ 두 넓이의 차</b><br>$a=2^4=16$이고 둘째 사각형은 $2\le x\le16$, 높이 $4$입니다.<br>$$A_Q=(16-2)\times4=56,\qquad A_P=6$$<br>$$D(2^4)=|A_Q-A_P|=|56-6|=\boxed{50}$$<br>따라서 구하는 값은 $50$입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(P\) 직사각형 넓이6, \(Q\) 넓이 \((2^n-\log_2n)n\). 겹침 \(2(4-\log_2n)=4\)에서 \(n=4\), 두 넓이 차 \(56-6=50\).
- **그림 실물 근거:** `assets/images/21_효천고_1학기_중간_고2_수학I/q20.png` / blob `0cd9d0d307bf3f81c72992f196c49325cf5d174a` / PNG 육안 확인; `assets/images/21_효천고_1학기_중간_고2_수학I/q20-solution.svg` / blob `900d81b838d56b7c74411dc89e1e82b179f6548b` / SVG 렌더 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q21 — KEEP

- source ordinal/id: `21` / `21` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `1d23702ba356621e2b875e6ae5e81629c3d641c6`
- 문항 유형/배점: `서술형` / `7`; 원본 표준과정/단원: `수학I` / `로그 바닥함수의 정수구간을 분할하여 자연수 개수 집계`
- **원본 `content` 전체:**

````text
$[\log_7 4n]=[\log_7 n]+1$을 만족시키는 300 이하의 자연수 $n$의 개수를 풀이과정과 함께 구하시오.<br>(단, $[x]$는 $x$보다 크지 않은 최대의 정수이다.) [7.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `256`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$[x]$는 $x$를 넘지 않는 최대 정수이므로, $[\log_7n]=k$라면<br>$$k\le\log_7n<k+1\quad\Longleftrightarrow\quad7^k\le n<7^{k+1}$$<br>입니다. $1\le n\le300<343=7^3$이므로 $k$는 $0,1,2$뿐입니다. 조건 $[\log_7(4n)]=k+1$도 동시에 만족해야 하므로<br>$$7^{k+1}\le4n<7^{k+2}$$<br>를 각 경우에 겹쳐 셉니다.<br><b>① $k=0$</b><br>$$1\le n<7,\qquad7\le4n<49$$<br>$$1\le n\le6,\qquad\frac74\le n<\frac{49}4$$<br>두 조건을 만족하는 자연수는 $2,3,4,5,6$으로 $5$개입니다.<br><b>② $k=1$</b><br>$$7\le n<49,\qquad49\le4n<343$$<br>$$7\le n\le48,\qquad\frac{49}4\le n<\frac{343}4$$<br>$\frac{49}4=12.25$이므로 최소 자연수는 $13$입니다. 따라서 $13\le n\le48$이고<br>$$48-13+1=36\text{개}$$<br>입니다.<br><b>③ $k=2$</b><br>$$49\le n<343,\quad n\le300,\qquad343\le4n<2401$$<br>$$49\le n\le300,\qquad\frac{343}4\le n<\frac{2401}4$$<br>$\frac{343}4=85.75$이므로 최소 자연수는 $86$입니다. $\frac{2401}4>300$이므로 최대는 문제의 제한인 $300$입니다.<br>$$86\le n\le300\quad\Longrightarrow\quad300-86+1=215\text{개}$$<br>서로 다른 $k$의 범위는 겹치지 않으므로 모두 더하면<br>$$5+36+215=\boxed{256}$$<br>따라서 구하는 자연수의 개수는 $256$개입니다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\lfloor\log_7n\rfloor=k=0,1,2\) 구간에 대해 조건 만족 자연수 수 \(5,36,215\)를 합해 256.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


## 누적 인계·출고 제한

- 본 시험지 분모 21, 전수 읽음 21, KEEP 21, UPGRADE 0, HOLD 0, UNREAD 0.
- 문항별 해설 오류로 새로 격리할 HOLD 없음. 추가 학생용 개선안이 꼭 필요한 UPGRADE 판정도 없음.
- 그림: PNG 5건 실물 육안 판독, SVG 1건 원본/XML 및 PNG 렌더 육안 판독. 학생 화면 전체 재현·실서비스 최종 시각 QA는 `NOT_RUN`.
- 작업 파일: 위 감사 MD 1개만 신규 생성; JS/PNG/SVG/메인 변경·운영 병합·출고 `NOT_DONE`.
