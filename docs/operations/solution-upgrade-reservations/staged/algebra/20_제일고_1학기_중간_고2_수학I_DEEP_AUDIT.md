# 2020 20_제일고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2020`
- source: `archive/exams/original/high/h2/1mid/20_제일고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` (실제 열람 브랜치)
- source blob SHA: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/20_제일고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 0/24, `category` 누락 0/24, `questionType` 누락 0/24; 누락값은 추정해 채우지 않고 `NOT_PRESENT`로 기록
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 24 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일에 실린 24문항의 원본 `content`·`choices`·`answer`·`solution` 전수 확인 및 수학적 독립 검산. 연결 이미지 실물 검사. 이 MD 외의 원본 JS·정답키·SVG·PNG·`main` 수정 없음.

## 검토 기준·실물 검증 경계

- 지침: `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 선행 lane30 MD 감사 구조와 필드 유지.
- 수학 검토: 단원별 지수·근호 실수 정의역, 로그의 밑/진수, 삼각함수 부호·주기·끝점, 함수 최적화 및 정수 해 개수를 문항별 계산. 정답 문자열·선지 위치와 대응 검증.
- 시각 검사: 문제/선지 원본 PNG 2개는 실물 이미지로 열어 도형·축·값 대조, 해설 SVG 0개는 원본 XML 확인 후 Inkscape로 PNG 렌더하여 실물 시각 대조. SVG 최종 서비스 렌더와 별도 앱 화면 검증을 통과한 것은 아님.
- 운영 출고 및 `preflight`·Golden/Negative·전체 서비스 렌더·SHA-256 영수증은 이번 MD 감사 범위 밖이며 `NOT_RUN`. `HOLD`는 출고 보류지 운영 QA 성공을 뜻하지 않음.

## 이미지 실제 경로·Git blob 증거

- Q08 문제·선지 PNG — `archive/assets/images/20_제일고_1학기_중간_고2_수학I/q08.png` · Git blob `adeee4b4eaed096661bc19f41587bc1b82c7a857` · 원본 PNG 실파일 시각 판독
- Q17 문제·선지 PNG — `archive/assets/images/20_제일고_1학기_중간_고2_수학I/q17.png` · Git blob `c60004367da0db36e8d514f3c154571851013a5c` · 원본 PNG 실파일 시각 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3`; 원본 표준과정/단원: `수학I` / `지수`
- **원본 `content` 전체:**

````text
$\left\{\left(\frac{4}{9}\right)^{-\frac{2}{3}}\right\}^{\frac{9}{4}}$ 의 값은? [3.0점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\frac{8}{27}$
2. $\frac{16}{61}$
3. $\frac{81}{16}$
4. $\frac{27}{8}$
5. $\frac{64}{81}$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
거듭제곱의 거듭제곱에서는 지수를 곱한다.
\[\left\{\left(\frac49\right)^{-\frac23}\right\}^{\frac94}=(\frac49)^{-\frac23\cdot\frac94}=(\frac49)^{-\frac32}\]
음의 지수를 양수 지수로 바꾸면
\[(\frac94)^{\frac32}=\left(\sqrt{\frac94}\right)^3=(\frac32)^3=\frac{27}{8}.\]
따라서 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** 거듭제곱 지수 \((-2/3)(9/4)=-3/2\), \((4/9)^{-3/2}=(3/2)^3=27/8\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q02 — KEEP

- source ordinal/id: `2` / `2` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.1`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
$\log_x 81 = 4$를 만족하는 실수 $x$의 값은? [3.1점]
````

- **원본 `choices` (순서 보존):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
로그의 정의에 따라 $\log_x81=4$는 $x^4=81$을 뜻한다. 밑은 양수이고 1이 아니어야 한다.
\[x^4=81=3^4\]
따라서 가능한 실수 밑은 $x=3$이다. 정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** 로그 밑 \(x>0,x\ne1\). \(x^4=81\)의 유효한 양의 밑 \(x=3\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q03 — KEEP

- source ordinal/id: `3` / `3` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.2`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
$1 < x < 8$ 일 때, $\log_{\frac{1}{2}} x$ 의 값의 범위는 $a < \log_{\frac{1}{2}} x < b$ 이다. 이때 $b-a$ 의 값은? [3.2점]
````

- **원본 `choices` (순서 보존):**

````text
1. -3
2. -1
3. 0
4. 1
5. 3
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
밑이 0과 1 사이인 로그함수는 감소한다.
\[x=1\Rightarrow\log_{\frac12}x=0,\qquad x=8\Rightarrow\log_{\frac12}x=-3\]
주어진 구간은 양 끝을 포함하지 않으므로 $-3<\log_{\frac12}x<0$이다. 따라서 $a=-3$, $b=0$이고
\[b-a=0-(-3)=3.\]
정답은 ⑤이다.
````

- **독립 검산·조건/끝점/정답 근거:** 밑 1/2 감소, \(1<x<8\)에서 로그 범위 \(-3<y<0\), 차3, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q04 — KEEP

- source ordinal/id: `4` / `4` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.3`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
$\frac{7}{4}\pi$ 는 제 몇 사분면의 각인가? [3.3점]
````

- **원본 `choices` (순서 보존):**

````text
1. 제 1 사분면
2. 제 2 사분면
3. 제 3 사분면
4. 제 4 사분면
5. 축 위의 각
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
\[\frac74\pi=\frac74\cdot180^\circ=315^\circ\]
$315^\circ$는 $270^\circ$와 $360^\circ$ 사이이므로 제4사분면의 각이다. 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(7\pi/4=315^\circ\)는 제4사분면, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q05 — KEEP

- source ordinal/id: `5` / `5` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.4`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
원점 $\mathrm{O}$와 점 $\mathrm{P}(3, -4)$를 지나는 동경 $\mathrm{OP}$가 나타내는 각을 $\theta$라 할 때, $\sin\theta + \cos\theta$ 의 값은? [3.4점]
````

- **원본 `choices` (순서 보존):**

````text
1. $-\frac{1}{5}$
2. $-\frac{2}{5}$
3. $-\frac{3}{5}$
4. $-\frac{4}{5}$
5. -1
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
점 $P(3,-4)$는 원점에서 거리
\[\sqrt{3^2+(-4)^2}=5\]
인 곳에 있다. 따라서
\[\cos\theta=\frac35,\qquad\sin\theta=-\frac45\]
이므로
\[\sin\theta+\cos\theta=-\frac45+\frac35=-\frac15.\]
정답은 ①이다.
````

- **독립 검산·조건/끝점/정답 근거:** 좌표 \((3,-4)\)의 반지름5에서 \(\sin+\cos=-4/5+3/5=-1/5\), ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q06 — KEEP

- source ordinal/id: `6` / `6` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.5`; 원본 표준과정/단원: `수학I` / `지수`
- **원본 `content` 전체:**

````text
다음 <보기>의 설명 중 옳은 것만을 있는 대로 고른 것은? [3.5점]

$$\begin{gathered} \text{<보 기>} \\ \text{ㄱ. } 81\text{의 네제곱근은 } 3\text{이다.} \\ \text{ㄴ. } -64\text{의 세제곱근 중 실수인 것은 } 1\text{개이다.} \\ \text{ㄷ. } n\text{이 짝수일 때, } -5\text{의 } n\text{제곱근 중 실수인 것은 없다.} \end{gathered}$$
````

- **원본 `choices` (순서 보존):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
각 문장을 확인한다.
ㄱ. $x^4=81$의 실근은 $x=3$뿐 아니라 $x=-3$도 있으므로 거짓이다.
ㄴ. $x^3=-64$의 실수해는 $x=-4$ 하나이므로 참이다.
ㄷ. 짝수 $n$에 대해 $x^n=-5$를 만족하는 실수 $x$는 없으므로 참이다.
따라서 옳은 것은 ㄴ, ㄷ이고 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** ㄱ은 x=−3도 네제곱근이고, ㄴ의 실근은−4 하나, ㄷ 짝수제곱의 음수 불가; ㄴ·ㄷ만 참, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q07 — KEEP

- source ordinal/id: `7` / `7` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.6`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
$4^x = 5^y = 10$ 일 때, $\frac{1}{x} + \frac{2}{y}$ 의 값은? [3.6점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\frac{1}{3}$
2. 1
3. 2
4. $\frac{5}{2}$
5. 4
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$4^x=10$에서 $\frac1x=\log_{10}4$이고, $5^y=10$에서 $\frac1y=\log_{10}5$이다.
\[\frac1x+\frac2y=\log_{10}4+2\log_{10}5=\log_{10}(4\cdot25)=\log_{10}100=2.\]
정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(1/x=\log_{10}4\), \(1/y=\log_{10}5\), \(\log(4\cdot25)=2\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q08 — KEEP

- source ordinal/id: `8` / `8` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.7`; 원본 표준과정/단원: `수학I` / `지수함수`
- **원본 `content` 전체:**

````text
다음 그림은 함수 $y=2^x$의 그래프이다. $b-2a$의 값은? [3.7점]

<img src="assets/images/20_제일고_1학기_중간_고2_수학I/q08.png" data-archive-mobile-figure="true" alt="증가하는 y=2^x 곡선에 y=3과 y=18의 수평 점선이 닿고, 각 교점에서 x축으로 수직 점선을 내린다. 두 x축 표식은 각각 a와 b이다." class="exam-image" style="display:block;width:280px;max-width:100%;height:auto;margin:8px auto;">
````

- **원본 `choices` (순서 보존):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
그래프에서 $y=3$일 때의 $x$좌표가 $a$, $y=18$일 때의 $x$좌표가 $b$이다.
\[a=\log_2 3,\qquad b=\log_2 18\]
따라서
\[b-2a=\log_2 18-\log_2 9=\log_2 2=1.\]
정답은 ①이다.
````

- **독립 검산·조건/끝점/정답 근거:** 그림의 y=3,18 높이에서 \(a=\log_23,b=\log_218\); \(b-2a=\log_2(18/9)=1\), ①.
- **그림 실물 근거:** `assets/images/20_제일고_1학기_중간_고2_수학I/q08.png` / blob `adeee4b4eaed096661bc19f41587bc1b82c7a857` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q09 — KEEP

- source ordinal/id: `9` / `9` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.8`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
$\frac{3}{2}\pi < \theta < 2\pi$ 일 때,
$\sqrt{\sin^2\theta} + \sqrt{\cos^2\theta} + \sqrt{\tan^2\theta}$ 를 간단히 하면? [3.8점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\sin\theta + \cos\theta + \tan\theta$
2. $\sin\theta + \cos\theta - \tan\theta$
3. $-\sin\theta + \cos\theta - \tan\theta$
4. $-\sin\theta - \cos\theta + \tan\theta$
5. $\sin\theta - \cos\theta - \tan\theta$
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$\frac32\pi<\theta<2\pi$이므로 $\theta$는 제4사분면에 있다. 따라서 $\sin\theta<0$, $\cos\theta>0$, $\tan\theta<0$이다.
\[\sqrt{\sin^2\theta}=|\sin\theta|=-\sin\theta\]
\[\sqrt{\cos^2\theta}=|\cos\theta|=\cos\theta\]
\[\sqrt{\tan^2\theta}=|\tan\theta|=-\tan\theta\]
그러므로 식은 $-\sin\theta+\cos\theta-\tan\theta$이고 정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** QIV에서 \(\sqrt{s^2}=|s|=-s\), \(\sqrt{c^2}=c\), \(\sqrt{\tan^2}=−\tan\); 결과 \(-\sin+\cos-\tan\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q10 — KEEP

- source ordinal/id: `10` / `10` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `3.9`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
방정식 $2(\log_{\frac{1}{2}} x)^2 = 3\log_{\frac{1}{2}} x + 2$ 의 두 근을 $\alpha, \beta$라 할 때, $\alpha\beta$ 의 값은? [3.9점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\sqrt{2}$
2. $\frac{\sqrt{2}}{2}$
3. $\frac{\sqrt{2}}{3}$
4. $\frac{\sqrt{2}}{4}$
5. $\frac{\sqrt{2}}{5}$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$t=\log_{\frac12}x$라고 두면
\[2t^2=3t+2\Rightarrow(2t+1)(t-2)=0\]
따라서 $t=2$ 또는 $t=-\frac12$이다.
\[t=2\Rightarrow x=(\frac12)^2=\frac14\]
\[t=-\frac12\Rightarrow x=(\frac12)^{-\frac12}=\sqrt2\]
두 근의 곱은 $\frac14\cdot\sqrt2=\frac{\sqrt2}{4}$이므로 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(t=\log_{1/2}x\), \((2t+1)(t-2)=0\)에서 \(x=\sqrt2,1/4\), 곱 \(\sqrt2/4\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q11 — KEEP

- source ordinal/id: `11` / `11` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.1`; 원본 표준과정/단원: `수학I` / `지수함수`
- **원본 `content` 전체:**

````text
방정식 $9^{2x} - 6 \cdot 9^x + 4 = 0$ 의 두 근을 $\alpha, \beta$라 할 때, $3^\alpha + 3^\beta$ 의 값은? [4.1점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\sqrt{5}$
2. $\sqrt{6}$
3. $\sqrt{7}$
4. $\sqrt{10}$
5. $\sqrt{11}$
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$u=9^x$라고 두면 $u>0$이고
\[u^2-6u+4=0\Rightarrow u=3\pm\sqrt5.\]
따라서 $9^\alpha=3+\sqrt5$, $9^\beta=3-\sqrt5$이고, $9=3^2$이므로
\[3^\alpha=\sqrt{3+\sqrt5},\qquad3^\beta=\sqrt{3-\sqrt5}.\]
두 값의 합은 양수이며
\[(3^\alpha+3^\beta)^2=6+2\sqrt{(3+\sqrt5)(3-\sqrt5)}=6+2\sqrt4=10.\]
따라서 $3^\alpha+3^\beta=\sqrt{10}$, 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(u=9^x>0\), 두 해 \(3\pm\sqrt5\). \((3^\alpha+3^\beta)^2=6+2\sqrt4=10\), 양수라 \(\sqrt{10}\), ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q12 — KEEP

- source ordinal/id: `12` / `12` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.2`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
실수 $\theta$에 대하여 $\sqrt{-\sin\theta}\sqrt{-\cos\theta}=\sqrt{\sin\theta\cos\theta}$를 만족할 때, 각 $\theta$는 제 몇 사분면의 각인가? (단, $\sin\theta\cos\theta\ne0$) [4.2점]
````

- **원본 `choices` (순서 보존):**

````text
1. 제1사분면
2. 제2사분면
3. 제3사분면
4. 제4사분면
5. 축 위의 각
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
실수 제곱근이 존재하려면 각 제곱근 안의 값이 0 이상이어야 한다.
따라서
$-\sin\theta\ge0$, $-\cos\theta\ge0$이다.

또한 $\sin\theta\cos\theta\ne0$이므로
$\sin\theta<0$, $\cos\theta<0$이다.
두 값이 모두 음수이므로 $\theta$는 제3사분면의 각이다.

이때 $-\sin\theta>0$, $-\cos\theta>0$이고
$\sqrt{-\sin\theta}\sqrt{-\cos\theta}$
$=\sqrt{(-\sin\theta)(-\cos\theta)}$
$=\sqrt{\sin\theta\cos\theta}$이다.
따라서 제3사분면의 모든 각이 등식을 만족하고, 다른 사분면의 각은 제곱근의 정의역 조건을 만족하지 않는다.

그러므로 정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** 두 실수 제곱근이 정의되려면 \(\sin\theta<0,\cos\theta<0\) (비영 조건), QIII, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q13 — KEEP

- source ordinal/id: `13` / `13` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.3`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
어떤 세균의 수는 2시간마다 3배가 된다고 한다. 관측한 지 40시간 후에 세균의 수는 처음 세균의 수의 $x$배가 된다. 여기에서 $x$는 몇 자리 정수인가? [4.3점]

(단, $\log 2=0.3010, \log 3=0.4771$이다.)
````

- **원본 `choices` (순서 보존):**

````text
1. 9자리
2. 10자리
3. 19자리
4. 20자리
5. 21자리
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
세균의 수는 2시간마다 3배가 되므로 40시간 후의 배수는
\[x=3^{\frac{40}{2}}=3^{20}.\]
상용로그를 이용하면
\[\log x=20\log3=20\cdot0.4771=9.542.\]
따라서 $10^9\le x<10^{10}$인 정수이므로 10자리이다. 정답은 ②이다.
````

- **독립 검산·조건/끝점/정답 근거:** 2시간 3배 성장 40시간이면 \(3^{20}\), \(20\log3=9.542\)로 10자리 정수, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q14 — KEEP

- source ordinal/id: `14` / `14` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.4`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
$\sin\theta\cos\theta = \frac{1}{4}$ 일 때, $\frac{1}{\sin\theta} + \frac{1}{\cos\theta}$ 의 값은? (단, $\theta$는 제 1 사분면의 각) [4.4점]
````

- **원본 `choices` (순서 보존):**

````text
1. $2\sqrt{2}$
2. $2\sqrt{3}$
3. 4
4. $2\sqrt{5}$
5. $2\sqrt{6}$
```` 

- 원본 `answer`: `⑤`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
\[\frac1{\sin\theta}+\frac1{\cos\theta}=\frac{\sin\theta+\cos\theta}{\sin\theta\cos\theta}=4(\sin\theta+\cos\theta).\]
제1사분면이므로 $\sin\theta+\cos\theta>0$이고
\[(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta=1+\frac12=\frac32.\]
따라서 $\sin\theta+\cos\theta=\frac{\sqrt6}{2}$이고 구하는 값은 $2\sqrt6$이다. 정답은 ⑤이다.
````

- **독립 검산·조건/끝점/정답 근거:** Q I에서 \(s+c=+\sqrt{1+2sc}=\sqrt{3/2}\); \((s+c)/(sc)=2\sqrt6\), ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q15 — KEEP

- source ordinal/id: `15` / `15` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.5`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
전파가 어떤 벽을 투과할 때 전파의 세기가 $A$에서 $B$로 바뀌면, 그 벽의 전파 감쇠비 $F$는 $F=10\log\left(\frac{B}{A}\right)$ (데시벨)로 정의한다. 전파 감쇠비가 $-7$ (데시벨)인 벽을 투과한 전파의 세기는 투과하기 전 세기의 몇 배인가? [4.5점]

(단, $10^{\frac{3}{10}}=2$로 계산한다.)
````

- **원본 `choices` (순서 보존):**

````text
1. $\frac{1}{10}$
2. $\frac{1}{5}$
3. $\frac{3}{10}$
4. $\frac{1}{2}$
5. $\frac{7}{10}$
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
감쇠비 식에 $F=-7$을 대입하면
\[10\log\frac BA=-7\Rightarrow\log\frac BA=-\frac7{10}.\]
주어진 조건에서 $\log2=\frac3{10}$이므로 $\log5=1-\log2=\frac7{10}$이다. 따라서
\[\log\frac BA=-1+\log2=\log\frac15\]
\[\frac BA=\frac15.\]
투과 후 세기는 투과 전 세기의 $\frac15$배이므로 정답은 ②이다.
````

- **독립 검산·조건/끝점/정답 근거:** 감쇠비 −7dB에서 \(B/A=10^{-7/10}\), 조건 \(10^{3/10}=2\)로 \(B/A=2/10=1/5\), ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q16 — KEEP

- source ordinal/id: `16` / `16` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.6`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
$\pi < \theta < \frac{3}{2}\pi$ 일 때, $\frac{1+\cos\theta}{\sin\theta} + \frac{\sin\theta}{1+\cos\theta} = -\frac{5}{2}$ 를 만족하는 $\cos\theta$ 의 값은? [4.6점]
````

- **원본 `choices` (순서 보존):**

````text
1. $-\frac{1}{5}$
2. $-\frac{2}{5}$
3. $-\frac{3}{5}$
4. $-\frac{4}{5}$
5. -1
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
분모를 통분하면
\[\frac{1+\cos\theta}{\sin\theta}+\frac{\sin\theta}{1+\cos\theta}\]
\[=\frac{(1+\cos\theta)^2+\sin^2\theta}{\sin\theta(1+\cos\theta)}\]
\[=\frac2{\sin\theta}.\]
따라서 $\frac2{\sin\theta}=-\frac52$에서 $\sin\theta=-\frac45$이다. $\theta$는 제3사분면이므로 $\cos\theta<0$이고
\[\cos^2\theta=1-\sin^2\theta=1-\frac{16}{25}=\frac9{25}\Rightarrow\cos\theta=-\frac35.\]
정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** \((1+\cos)^2+\sin^2=2(1+\cos)\)을 약분해 \(2/\sin=-5/2\), QIII \(\sin=-4/5,\cos=-3/5\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q17 — KEEP

- source ordinal/id: `17` / `17` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.7`; 원본 표준과정/단원: `수학I` / `로그함수`
- **원본 `content` 전체:**

````text
다음 그림은 $y=\log_2 x$의 그래프이다. $\overline{\mathrm{AB}}=3$일 때, $\frac{b}{a}$의 값은? (단, 점선은 $x$축 또는 $y$축에 평행하다.) [4.7점]

<img src="assets/images/20_제일고_1학기_중간_고2_수학I/q17.png" data-archive-mobile-figure="true" alt="좌표축에 증가하는 곡선 y=log₂x가 그려져 있다. y축 위의 A와 B는 세로 간격이 3이고, 각 높이에서 곡선까지 수평 점선을 그었다. 두 교점에서 x축까지 수직 점선을 내려 A′(a,0), B′(b,0)을 표시했다." class="exam-image" style="display:block;width:640px;max-width:100%;height:auto;margin:8px auto;">
````

- **원본 `choices` (순서 보존):**

````text
1. 6
2. 8
3. 9
4. $\log_2 3$
5. $\log_2 6$
```` 

- 원본 `answer`: `②`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
그림에서 $A$와 $B$는 로그 그래프 위 점의 $y$좌표이고, $\overline{AB}=3$이므로
\[\log_2b-\log_2a=3.\]
로그의 차를 정리하면
\[\log_2\frac ba=3\Rightarrow\frac ba=2^3=8.\]
정답은 ②이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(\log_2b-\log_2a=AB=3\)이므로 \(b/a=2^3=8\), ②; 도형의 수평·수직 점선 판독.
- **그림 실물 근거:** `assets/images/20_제일고_1학기_중간_고2_수학I/q17.png` / blob `c60004367da0db36e8d514f3c154571851013a5c` / PNG 육안 확인
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q18 — KEEP

- source ordinal/id: `18` / `18` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.8`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
두 부채꼴 $\mathrm{A, B}$가 있다. 부채꼴 $\mathrm{A}$의 중심각의 크기는 $\frac{1}{2}$이고, 호의 길이는 2이다. 부채꼴 $\mathrm{B}$의 중심각의 크기는 2이고, 넓이는 9이다. 두 부채꼴 $\mathrm{A, B}$의 반지름의 길이의 합은? [4.8점]
````

- **원본 `choices` (순서 보존):**

````text
1. 4
2. 5
3. 6
4. 7
5. 8
```` 

- 원본 `answer`: `④`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
부채꼴 A에서 호의 길이는 반지름과 중심각(라디안)의 곱이다.
\[2=r_A\cdot\frac12\Rightarrow r_A=4.\]
부채꼴 B의 넓이는 $\frac12r_B^2\theta$이고 중심각은 2이므로
\[9=\frac12r_B^2\cdot2=r_B^2\Rightarrow r_B=3.\]
두 반지름의 합은 $4+3=7$이고 정답은 ④이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(2=r_A\cdot1/2\Rightarrow r_A=4\), \(9=(1/2)r_B^2\cdot2\Rightarrow r_B=3\), 합7, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q19 — KEEP

- source ordinal/id: `19` / `19` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `4.9`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
$x > 0, y > 0$ 이고 $x+y = \frac{1}{5}$ 일 때, $\log x + \log y$ 의 최댓값은? [4.9점]
````

- **원본 `choices` (순서 보존):**

````text
1. -2
2. -1
3. 0
4. 1
5. 2
```` 

- 원본 `answer`: `①`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
\[\log x+\log y=\log(xy).\]
$x+y=\frac15$일 때 산술기하평균 부등식으로
\[xy\le\left(\frac{x+y}{2}\right)^2=\left(\frac1{10}\right)^2=\frac1{100}.\]
등호는 $x=y=\frac1{10}$일 때 성립한다. 따라서 최댓값은 $\log\frac1{100}=-2$이고 정답은 ①이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(x+y=1/5,xy\le1/100\)에서 \(\log x+\log y=\log(xy)\le−2\), 등호 \(x=y=1/10\), ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q20 — KEEP

- source ordinal/id: `20` / `20` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `객관식` / `5`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
$\log_2 5$의 정수 부분을 $x$, 소수 부분을 $y$라 할 때, $\frac{2^{-x} + 2^{-y}}{2^x + 2^y}$ 의 값은? [5.0점]
````

- **원본 `choices` (순서 보존):**

````text
1. $\frac{1}{3}$
2. $\frac{1}{4}$
3. $\frac{1}{5}$
4. $\frac{1}{7}$
5. $\frac{1}{9}$
```` 

- 원본 `answer`: `③`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$\log_2 5$의 정수 부분은 $x=2$이고 $y=\log_2 5-2$이므로 $x+y=\log_2 5$이다.
\[\frac{2^{-x}+2^{-y}}{2^x+2^y}=\frac{\frac1{2^x}+\frac1{2^y}}{2^x+2^y}=\frac1{2^x2^y}=\frac1{2^{x+y}}=\frac15.\]
정답은 ③이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(x+y=\log_25\) (정수·소수 부분), \((2^{-x}+2^{-y})/(2^x+2^y)=2^{-(x+y)}=1/5\), ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q21 — KEEP

- source ordinal/id: `21` / `21` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `서술형` / `4`; 원본 표준과정/단원: `수학I` / `지수`
- **원본 `content` 전체:**

````text
[서술형 1]
$\sqrt{2^3\sqrt{4^5\sqrt{8}}}$ 을 $2^k$의 꼴로 나타내었을 때, 유리수 $k$의 값을 구하시오. [4.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `\frac{35}{8}`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
\[\sqrt8=2^{\frac32}.\]
따라서 안쪽부터 정리하면
\[\sqrt{4^5\sqrt8}=\sqrt{2^{10}\cdot2^{\frac32}}=\sqrt{2^{\frac{23}{2}}}=2^{\frac{23}{4}}.\]
전체 식은
\[\sqrt{2^3\cdot2^{\frac{23}{4}}}=\sqrt{2^{\frac{35}{4}}}=2^{\frac{35}{8}}.\]
따라서 $k=\frac{35}{8}$이다.
````

- **독립 검산·조건/끝점/정답 근거:** 안쪽 \(\sqrt8=2^{3/2}\), 다음 \(\sqrt{4^5\sqrt8}=2^{23/4}\), 바깥 지수 \((3+23/4)/2=35/8\).
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q22 — KEEP

- source ordinal/id: `22` / `22` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `서술형` / `4`; 원본 표준과정/단원: `수학I` / `삼각함수`
- **원본 `content` 전체:**

````text
[서술형 2]
$\theta$가 제2사분면의 각이고 $\sin\theta = \frac{4}{5}$일 때, $\cos\theta$와 $\tan\theta$의 값을 구하시오. [4.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `\cos\theta=-\frac35, \tan\theta=-\frac43`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$\theta$가 제2사분면이므로 $\cos\theta<0$, $\tan\theta<0$이다.
\[\cos^2\theta=1-\sin^2\theta=1-\frac{16}{25}=\frac9{25}\]
따라서 $\cos\theta=-\frac35$이고
\[\tan\theta=\frac{\sin\theta}{\cos\theta}=\frac{\frac45}{-\frac35}=-\frac43.\]
````

- **독립 검산·조건/끝점/정답 근거:** QII에서 \(\sin=4/5\)이므로 \(\cos=-3/5,\tan=-4/3\).
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q23 — KEEP

- source ordinal/id: `23` / `23` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `서술형` / `6`; 원본 표준과정/단원: `수학I` / `로그`
- **원본 `content` 전체:**

````text
[서술형 3]
$100 \le x < 1000$인 $x$에 대하여 $\log x^4$의 소수부분과 $\log x^3$의 소수 부분이 같을 때, $x$의 값을 구하시오. [6.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `100`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$t=\log x$라고 두면 $2\le t<3$이다. 두 소수부분이 같다는 조건은
\[4t-\lfloor4t\rfloor=3t-\lfloor3t\rfloor\]
이므로
\[t=\lfloor4t\rfloor-\lfloor3t\rfloor.\]
오른쪽은 정수이므로 $t$는 정수이다. $2\le t<3$에서 $t=2$이고
\[x=10^t=10^2=100.\]
````

- **독립 검산·조건/끝점/정답 근거:** 두 로그 소수부분이 같음은 \(4\log x-3\log x=\log x\in\mathbb Z\), \(2\le\log x<3\)에서 \(x=100\).
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


### Q24 — KEEP

- source ordinal/id: `24` / `24` · 원본 문제 식별자: `NOT_PRESENT` · 원본 파일 blob: `ad0578278047dbd0d35cbd7f69576fb79ad1360c`
- 문항 유형/배점: `서술형` / `6`; 원본 표준과정/단원: `수학I` / `로그함수`
- **원본 `content` 전체:**

````text
[서술형 4]
정의역이 $\{x \mid 2 \le x \le 16\}$일 때, 함수 $y = \log_2 x^{\log_2 x} - 4\log_2 4x$의 최댓값과 최솟값과 그 때 각각의 $x$값을 구하시오. [6.0점]
````

- **원본 `choices` (순서 보존):**

````text
NOT_PRESENT (원본 서답형/단답형)
```` 

- 원본 `answer`: `최댓값 -8 (x=16), 최솟값 -12 (x=4)`
- **기존 `solution` 전체 원형 (HTML/LaTeX 보존):**

````text
$t=\log_2x$라고 두면 $2\le x\le16$에서 $1\le t\le4$이다.
\[y=\log_2(x^{\log_2x})-4\log_2(4x)=t^2-4(t+2)=(t-2)^2-12.\]
구간 $[1,4]$에서 최솟값은 $t=2$일 때 $-12$이고, $x=2^2=4$이다. 최댓값은 양 끝에서 비교한다. $t=1$이면 $y=-11$, $t=4$이면 $y=-8$이므로 최댓값은 $-8$이고 $x=2^4=16$이다.
````

- **독립 검산·조건/끝점/정답 근거:** \(t=\log_2x\in[1,4]\), \(y=(t-2)^2-12\). 최소−12은 \(x=4\), 최대−8은 \(x=16\).
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 계산·진수/밑·삼각함수 부호·정수 경계·표/그래프 위치를 독립 점검한 결과 기존 풀이와 답 일치. `READ_EVIDENCED` / 운영 최종 게이트 `NOT_RUN`.


## 누적 인계·출고 제한

- 본 시험지 분모 24, 전수 읽음 24, KEEP 24, UPGRADE 0, HOLD 0, UNREAD 0.
- 문항별 해설 오류로 새로 격리할 HOLD 없음. 추가 학생용 개선안이 꼭 필요한 UPGRADE 판정도 없음.
- 그림: PNG 2건 실물 육안 판독, SVG 0건 원본/XML 및 PNG 렌더 육안 판독. 학생 화면 전체 재현·실서비스 최종 시각 QA는 `NOT_RUN`.
- 작업 파일: 위 감사 MD 1개만 신규 생성; JS/PNG/SVG/메인 변경·운영 병합·출고 `NOT_DONE`.
