# 2019 19_금당고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사
- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2019`
- source: `archive/exams/original/high/h2/1mid/19_금당고_1학기_중간_고2_수학I.js`
- source ref / worker branch: `work/solution-upgrade-lane-30-20261121`
- source blob SHA: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/19_금당고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 0/21, `category` 누락 0/21, `questionType` 누락 0/21. 누락값은 추정·대입하지 않고 `NOT_PRESENT` 처리.
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 21 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; pending upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일의 전 문항 `content`·`choices`·`answer`·`solution` 원형을 읽고 수학 계산·진수/밑·정수 끝점·선지 대응·그림 연계를 독립 대조한 MD 예약 감사. 원본 JS·SVG·PNG·정답키·`main` 변경 없음.

## 검토 기준·실물 검증 경계

- 지침: 저장소 `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 기존 lane30 예약 MD 감사의 분모와 상태 체계 유지.
- 수학: 각 원문 조건에서 별도로 지수·로그·삼각함수·실수근·교점·기하·정수 경계를 계산하고 선지/답과 비교. 원본 해설을 전부 읽되 해설 주장만으로 정답 통과시키지 않음.
- 실물 그림: 원본 PNG 3개를 내려받아 이미지 시각 판독, 해설 SVG 2개를 실제 XML로 확인하고 Inkscape 래스터 렌더하여 그림 실물 시각 판독. 이미지 파일 존재 확인만으로 표시 품질 PASS 처리하지 않음.
- 운영 `preflight`·Golden/Negative·서비스 최종 렌더·자동 릴리즈·출고 QA와 원본 변경 후 종속 검사 미실행: `QA_NOT_RUN`. 본 산출물은 결함 위치를 식별하는 감사 문서이며 출고 승인서가 아님.

## 이미지 원본 경로·Git blob 증거

- Q08 SVG: `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q8-solution.svg` · Git blob `d50329fc88f444733d0bd6e5e5e54db15a8fe7ca` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q09 PNG: `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q09.png` · Git blob `4ff7fa882c574713b2c9abf5e748c5d14c84d147` · 원본 PNG 실물 판독
- Q11 PNG: `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q11.png` · Git blob `348bb45c7eded45fdeed4065f3c243b6e269aa76` · 원본 PNG 실물 판독
- Q14 SVG: `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q14-solution.svg` · Git blob `eaf98d9a6c579586e7edb3b2df93d3a6afde15b5` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q21 PNG: `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q21.png` · Git blob `dd12ee3d79340c05292edf76a8fdd699ea6eacae` · 원본 PNG 실물 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$\log_{\sqrt{3}} \sqrt{27} + 10^{\log 3}$을 간단히 한 값은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 2
2. 3
3. 6
4. 8
5. 10
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
로그의 밑과 진수를 모두 $3$의 거듭제곱으로 나타낸다.
$\sqrt{3}=3^{\frac{1}{2}}$, $\sqrt{27}=3^{\frac{3}{2}}$이므로
$\log_{\sqrt{3}}\sqrt{27}=\log_{3^{\frac{1}{2}}}3^{\frac{3}{2}}=\dfrac{\frac{3}{2}}{\frac{1}{2}}=3$이다.
또한 상용로그의 정의에 따라 $10^{\log 3}=3$이다.
따라서 구하는 값은 $3+3=6$이고 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** 3의 지수로 변환한 로그비3, 10^{log3}=3, 합6, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
방정식 $5^{2x+4} = 125^{x+1}$의 해는? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
양변의 밑을 $5$로 통일하면 지수를 비교할 수 있다.
$125=5^3$이므로 $125^{x+1}=(5^3)^{x+1}=5^{3x+3}$이다.
$5^{2x+4}=5^{3x+3}$에서 밑 $5$는 $1$이 아니므로
$2x+4=3x+3$, 따라서 $x=1$이다. 정답은 ①이다.
````

- **독립 검산·선지·경계 근거:** 125=5³→지수 2x+4=3x+3→x=1, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
호의 길이가 $6\pi$이고 넓이가 $18\pi$인 부채꼴의 반지름의 길이는? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
부채꼴의 호의 길이를 $l$, 반지름을 $r$, 넓이를 $S$라 하면 $S=\dfrac12rl$이다. 이는 $l=r\theta$, $S=\dfrac12r^2\theta$에서 중심각 $\theta$를 없앤 식이다.
주어진 값을 대입하면
$18\pi=\dfrac12\times r\times6\pi=3\pi r$이다.
$3\pi r=18\pi$이므로 $r=6$이다. 정답은 ⑤이다.
````

- **독립 검산·선지·경계 근거:** S=(1/2)rl에서 18π=3πr, r=6, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$\log_{(a-2)} (-a^2+3a+10)$이 정의되기 위한 정수 $a$의 값은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
실수 범위에서 로그 $\log_b M$이 정의되려면 밑은 $b>0$, $b\ne1$이고 진수는 $M>0$이어야 한다.
밑 조건 $a-2>0$, $a-2\ne1$에서 $a>2$, $a\ne3$이다.
진수 조건은 $-a^2+3a+10>0$이다.
$-(a-5)(a+2)>0\iff(a-5)(a+2)<0\iff-2<a<5$이다.
두 조건을 합하면 $2<a<5$, $a\ne3$이므로 가능한 정수는 $a=4$뿐이다. 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** 밑 a−2>0,≠1; 진수 −(a−5)(a+2)>0→−2<a<5, 정수 a=4, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
이차방정식 $x^2-4x+2=0$의 두 근이 $\log a$, $\log b$일 때, $\log_a b + \log_b a$의 값은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. -6
2. -3
3. 0
4. 3
5. 6
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$u=\log a$, $v=\log b$라 놓으면 근과 계수의 관계에서
$u+v=4$, $uv=2$이다. $uv\ne0$이므로 밑 $a,b$는 $1$이 아니어서 밑변환을 쓸 수 있다.
$\log_a b+\log_b a=\dfrac{\log b}{\log a}+\dfrac{\log a}{\log b}=\dfrac{v}{u}+\dfrac{u}{v}$
$=\dfrac{u^2+v^2}{uv}=\dfrac{(u+v)^2-2uv}{uv}$
$=\dfrac{4^2-2\times2}{2}=\dfrac{12}{2}=6$이다. 정답은 ⑤이다.
````

- **독립 검산·선지·경계 근거:** u,v=log a,log b: u+v=4, uv=2; u/v+v/u=((4²−4)/2)=6, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
$\pi < \theta < \dfrac{3}{2}\pi$이고, $\tan\theta + \dfrac{1}{\tan\theta}=2$일 때, $\sin\theta + \cos\theta$의 값은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. -\sqrt{3}
2. -\sqrt{2}
3. -1
4. -\dfrac{\sqrt{3}}{2}
5. -\dfrac{\sqrt{2}}{2}
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$t=\tan\theta$라 놓으면 $t\ne0$이고 $t+\dfrac1t=2$이다.
양변에 $t$를 곱해 $t^2-2t+1=0$, 즉 $(t-1)^2=0$이므로 $\tan\theta=1$이다.
$\pi<\theta<\dfrac{3\pi}{2}$이므로 $\theta$는 제3사분면의 각이다. 이 사분면에서는 사인과 코사인이 모두 음수다.
$\tan\theta=1$에서 기준각은 $\dfrac\pi4$이므로
$\sin\theta=-\dfrac{\sqrt2}{2}$, $\cos\theta=-\dfrac{\sqrt2}{2}$이다.
따라서 $\sin\theta+\cos\theta=-\sqrt2$이므로 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** III사분면 tan=1→θ 동경225°, sin+cos=−√2, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$(\sqrt{\sqrt[3]{4}\sqrt[4]{8}})^n$이 자연수가 되도록 하는 자연수 $n$의 최솟값은? [4.0점]
````

- **원본 `choices` (원순서):**

````text
1. 12
2. 18
3. 24
4. 30
5. 36
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 여러 겹의 근호를 같은 밑의 거듭제곱으로 바꾼다.
$\sqrt[3]{4}=\sqrt[3]{2^2}=2^{\frac{2}{3}}$이고 $\sqrt[4]{8}=\sqrt[4]{2^3}=2^{\frac{3}{4}}$이다.
두 수를 곱할 때에는 지수를 더하므로
$\sqrt[3]{4}\sqrt[4]{8}=2^{\frac{2}{3}}\cdot2^{\frac{3}{4}}$
$=2^{\frac{8}{12}+\frac{9}{12}}=2^{\frac{17}{12}}$이다.
이 곱 전체에 제곱근을 씌우면 지수가 다시 $\dfrac12$배가 된다.
$\sqrt{\sqrt[3]{4}\sqrt[4]{8}}=(2^{\frac{17}{12}})^{\frac{1}{2}}=2^{\frac{17}{24}}$이다.
따라서 문제의 식은
$(2^{\frac{17}{24}})^n=2^{17n/24}$이다.
밑이 소수 $2$인 이 거듭제곱이 자연수가 되려면 유리수 지수 $\dfrac{17n}{24}$가 음이 아닌 정수여야 한다. 지수가 기약분수로 남으면 자연수의 거듭제곱으로 $2$의 정수 지수를 만들 수 없기 때문이다.
즉 $24$가 $17n$을 나누어야 한다. $17$과 $24$는 서로소이므로 $n$은 $24$의 배수여야 한다.
가장 작은 자연수 $n=24$를 대입하면 $2^{17\times24/24}=2^{17}$로 실제 자연수가 된다.
따라서 구하는 최솟값은 $\boxed{24}$이고 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** 근호 전체=2^(17/24); 자연수 거듭제곱 조건 24∣17n, 최소24, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$-2 \le x \le 0$에서 함수 $y=4^{-x}-3\times 2^{1-x}+a$의 최솟값이 4일 때, 최댓값은? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. 4
2. 8
3. 12
4. 16
5. 20
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 지수식에 공통으로 나타나는 $2^{-x}$를 한 문자로 치환한다.
$4^{-x}=(2^{-x})^2$, $3\times2^{1-x}=6\times2^{-x}$이므로 $t=2^{-x}$로 놓으면
$y=t^2-6t+a=(t-3)^2+a-9$이다.
$x$가 $-2$에서 $0$까지 움직일 때 $2^{-x}$는 $4$에서 $1$까지 움직이므로 $1\le t\le4$이다.

최솟값으로 $a$를 정한다.
$(t-3)^2\ge0$이고 $t=3$이 주어진 구간에 있으므로
$y_{\min}=a-9=4$에서 $a=13$이다.
따라서 $y=(t-3)^2+4$이다.

최댓값은 꼭짓점에서 가장 먼 끝점에서 나온다.
$t=3$에서 멀어질수록 $(t-3)^2$이 커진다. 구간 끝점 $1,4$는 꼭짓점 $3$으로부터 각각 $2,1$만큼 떨어져 있다.
$t=1$에서 $y=(1-3)^2+4=4+4=8$,
$t=4$에서 $y=(4-3)^2+4=1+4=5$이다.
따라서 최댓값은 $8$이고 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** t=2^(−x)∈[1,4], y=(t−3)²+a−9, min4→a=13, max at t=1은8, ②. SVG의 축끝점과 일치.
- **그림 실물 근거:** `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q8-solution.svg` (SVG / blob `d50329fc88f444733d0bd6e5e5e54db15a8fe7ca`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
밑면의 반지름의 길이가 2인 원뿔이 있다. 이 원뿔의 옆면의 전개도인 부채꼴의 중심각의 크기가 $\dfrac{\pi}{5}$일 때, 원뿔의 모선의 길이는? [4.2점]<br><br><img src="assets/images/19_금당고_1학기_중간_고2_수학I/q09.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
1. 5
2. 10
3. 15
4. 20
5. 25
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
원뿔의 옆면을 펼친 부채꼴의 반지름은 원뿔의 모선 길이 $l$과 같다.
부채꼴의 호의 길이는 원뿔 밑면의 둘레와 같으므로
$2\pi\times2=4\pi$이다.
한편 중심각이 $\dfrac\pi5$인 부채꼴의 호의 길이는 $l\times\dfrac\pi5$이다.
따라서 $l\times\dfrac\pi5=4\pi$이고
$l=4\pi\times\dfrac5\pi=20$이다. 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** 부채꼴 호=l·π/5=밑면 둘레4π, l=20, ④. 원뿔 그림 반지름2 확인.
- **그림 실물 근거:** `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q09.png` (PNG / blob `4ff7fa882c574713b2c9abf5e748c5d14c84d147`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$\log\left(1-\dfrac{1}{2}\right)^2 + \log\left(1-\dfrac{1}{3}\right)^2 + \log\left(1-\dfrac{1}{4}\right)^2 + \cdots + \log\left(1-\dfrac{1}{100}\right)^2$의 값은? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. -6
2. -4
3. -2
4. 2
5. 4
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
로그의 합을 계산할 때에는 각 로그의 진수를 먼저 확인한다.
$2\le k\le100$이면 $1-\dfrac1k=\dfrac{k-1}{k}>0$이므로
$\log\left[\left(1-\dfrac1k\right)^2\right]=2\log\left(1-\dfrac1k\right)$이다.
문제의 식을 $S$라 하면
$S=2\log\dfrac12+2\log\dfrac23+2\log\dfrac34+\cdots+2\log\dfrac{99}{100}$이다.
로그의 합을 곱의 로그로 묶으면
$S=2\log\left(\dfrac12\times\dfrac23\times\dfrac34\times\cdots\times\dfrac{99}{100}\right)$이다.
곱에서 첫 분수의 분모 $2$는 다음 분수의 분자 $2$와, 분모 $3$은 다음 분자 $3$과 약분된다. 이 과정을 마지막까지 이어 가면
$\dfrac12\times\dfrac23\times\dfrac34\times\cdots\times\dfrac{99}{100}=\dfrac1{100}$이다.
따라서
$S=2\log\dfrac1{100}=2\log10^{-2}=2\times(-2)=-4$이다.
여기서 제곱은 로그값의 제곱이 아니라 각 진수의 제곱에 적용된다는 점에 주의한다.
따라서 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** 제곱 진수 텔레스코핑: 2log[(1/2)(2/3)…(99/100)]=2log(1/100)=−4, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
그림과 같이 두 점 $P(a, b)$, $Q(-1, b)$는 각각 두 함수 $y=\log_{\frac{1}{3}} x$와 그 역함수 $y=f(x)$의 그래프 위의 점일 때, $\dfrac{a}{b}$의 값은? (단, 점선은 $x$축 또는 $y$축에 평행하다.) [4.2점]<br><br><img src="assets/images/19_금당고_1학기_중간_고2_수학I/q11.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
1. 81
2. 9
3. \dfrac{1}{3}
4. \dfrac{1}{9}
5. \dfrac{1}{81}
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$y=\log_{\frac{1}{3}}x$의 역함수는 $y=(\dfrac13)^x$이다.
점 $Q(-1,b)$가 역함수 위에 있으므로
$b=(\dfrac13)^{-1}=3$이다.
점 $P(a,b)$는 로그함수 위에 있으므로 $\log_{\frac{1}{3}}a=b=3$이다.
로그를 지수식으로 바꾸면 $a=(\dfrac13)^3=\dfrac1{27}$이다.
따라서 $\dfrac ab=\dfrac{\frac{1}{27}}{3}=\dfrac1{81}$이므로 정답은 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 역함수 Q(−1,b)에서 b=3, 원함수 P(a,b)에서 a=1/27, a/b=1/81, ⑤. 원본 그래프 축 좌표 대조.
- **그림 실물 근거:** `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q11.png` (PNG / blob `348bb45c7eded45fdeed4065f3c243b6e269aa76`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
원점 $O$와 점 $P(-8, 15)$에 대하여 동경 $OP$가 나타내는 각의 크기를 $\theta$라 할 때, $\dfrac{17\sin\theta + 16\tan\theta}{17\cos\theta + 5}$의 값은? [4.8점]
````

- **원본 `choices` (원순서):**

````text
1. 5
2. 3
3. 1
4. -1
5. -3
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
점 $P(-8,15)$는 제2사분면에 있다. 원점에서의 거리는
$r=\sqrt{(-8)^2+15^2}=\sqrt{64+225}=17$이다.
따라서 $\sin\theta=\dfrac{15}{17}$, $\cos\theta=-\dfrac8{17}$이고
$\tan\theta=\dfrac{15}{-8}=-\dfrac{15}{8}$이다.
분자 $17\sin\theta+16\tan\theta=17\times\dfrac{15}{17}+16\times\left(-\dfrac{15}{8}\right)=15-30=-15$이다.
분모 $17\cos\theta+5=17\times\left(-\dfrac8{17}\right)+5=-8+5=-3$이다.
따라서 전체 값은 $\dfrac{-15}{-3}=5$이므로 정답은 ①이다.
````

- **독립 검산·선지·경계 근거:** r=17, sin=15/17, cos=−8/17, tan=−15/8; 분자−15/분모−3=5, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
0이 아닌 두 실수 $x$, $y$에 대하여 $2^x+2^y = 2-p$, $x+y=0$일 때, $(1+p\times 2^x + 2^{2x})(1+p\times 2^y + 2^{2y})$의 값은? (단, $p$는 상수이다.) [4.8점]
````

- **원본 `choices` (원순서):**

````text
1. 1
2. 2
3. 4
4. 8
5. 16
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$A=2^x$, $B=2^y$로 놓는다. 지수법칙과 주어진 조건에서
$AB=2^{x+y}=2^0=1$, $A+B=2-p$이다.
따라서 $p=2-A-B$로 바꿀 수 있다.
첫 번째 괄호는
$1+pA+A^2=1+(2-A-B)A+A^2$
$=1+2A-A^2-AB+A^2=1+2A-1=2A$이다.
같은 방법으로 두 번째 괄호는
$1+pB+B^2=1+(2-A-B)B+B^2$
$=1+2B-AB-B^2+B^2=2B$이다.
따라서 곱은 $(2A)(2B)=4AB=4$이므로 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** A=2^x,B=2^y, AB=1, A+B=2−p; 두 괄호 2A·2B=4, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
$\cos 0 + \cos\dfrac{\pi}{12} + \cos\dfrac{2\pi}{12} + \cdots + \cos\dfrac{23\pi}{12} + 1$의 값은? [4.8점]
````

- **원본 `choices` (원순서):**

````text
1. -1
2. -\dfrac{1}{2}
3. 0
4. \dfrac{1}{2}
5. 1
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
코사인의 성질 $\cos(\alpha+\pi)=-\cos\alpha$를 이용해 합의 앞뒤 항을 짝짓는다.
$k=0,1,\ldots,11$에 대하여
$\cos\dfrac{(k+12)\pi}{12}=\cos\left(\dfrac{k\pi}{12}+\pi\right)=-\cos\dfrac{k\pi}{12}$이다.
그러므로 $k=0$부터 $23$까지의 24개 코사인 항은 앞의 12개와 뒤의 12개가 서로 상쇄되어 합이 $0$이다.
마지막에 따로 더한 $1$이 남으므로 구하는 값은 $0+1=1$이다. 정답은 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 24개 코사인 항은 k와 k+12로 소거되고 따로 더한 1만 남아 ⑤.
- **그림 실물 근거:** `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q14-solution.svg` (SVG / blob `eaf98d9a6c579586e7edb3b2df93d3a6afde15b5`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `4.8`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$1 \le \log x < 2$일 때, $\log x$의 소수부분과 $\log\dfrac{1}{x^2}$의 소수부분이 같도록 하는 모든 $x$값의 곱은? [4.8점]
````

- **원본 `choices` (원순서):**

````text
1. 10
2. 10^2
3. 10^3
4. 10^4
5. 10^5
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
상용로그의 소수부분은 그 수에서 정수부분을 뺀 값이므로 항상 $0$ 이상 $1$ 미만이다. 음수의 소수부분도 이 정의를 그대로 쓴다.
$u=\log x$라 두면 $1\le u<2$이므로 $u=1+t$ ($0\le t<1$)로 나타낼 수 있다. 따라서 $\log x$의 소수부분은 $t$이다.
다른 로그는
$\log\dfrac1{x^2}=\log x^{-2}=-2\log x=-2-2t$이다.
정수 $-2$를 더하거나 빼도 소수부분은 변하지 않으므로 $-2t$의 소수부분이 $t$와 같아야 한다.

① $t=0$이면 $-2t=0$이고 두 소수부분은 모두 $0$이다. 따라서 $u=1$이다.
② $0<t<\dfrac12$이면 $-1<-2t<0$이다. 이 구간에서는 정수부분이 $-1$이므로 소수부분은 $-2t-(-1)=1-2t$이다.
$t=1-2t\iff3t=1\iff t=\dfrac13$, 따라서 $u=1+\dfrac13=\dfrac43$이다.
③ $t=\dfrac12$이면 $-2t=-1$은 정수이므로 소수부분이 $0$이다. 이는 $t=\dfrac12$와 다르므로 제외한다.
④ $\dfrac12<t<1$이면 $-2<-2t<-1$이다. 정수부분이 $-2$이므로 소수부분은 $-2t-(-2)=2-2t$이다.
$t=2-2t\iff3t=2\iff t=\dfrac23$, 따라서 $u=1+\dfrac23=\dfrac53$이다.

가능한 $\log x$는 $1,\dfrac43,\dfrac53$의 세 값이다. 각각 $x=10,10^{4/3},10^{5/3}$이므로
$10\times10^{4/3}\times10^{5/3}=10^{1+4/3+5/3}=10^4$이다.
따라서 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** t=frac(log x)∈[0,1), frac(−2t)=t의 해 t=0,1/3,2/3; x 곱=10^4, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `5.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
10이하의 자연수 $n$에 대하여 $n-6$의 제곱근 중 실수인 것의 개수를 $f(n)$, $n-6$의 다섯제곱근 중 실수인 것의 개수를 $g(n)$이라 하자. $f(n)+g(n)=3$을 만족시키는 10이하의 자연수 $n$의 개수는? [5.0점]
````

- **원본 `choices` (원순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 7
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
문제는 $n-6$의 실수인 제곱근 개수와 실수인 다섯제곱근 개수를 더한 값이 $3$이 되는 경우를 찾는 것이다.
먼저 $c=n-6$이라 놓자.
제곱근은 $z^2=c$를 만족하는 실수 $z$이고, 다섯제곱근은 $z^5=c$를 만족하는 실수 $z$이다.
$c<0$이면 제곱한 실수는 음수가 될 수 없으므로 제곱근은 $0$개다.
$c=0$이면 제곱근은 $z=0$ 하나뿐이므로 $1$개다.
$c>0$이면 제곱근은 $z=\sqrt c$와 $z=-\sqrt c$의 두 개다.
반면 다섯제곱은 홀수제곱이므로 $c$가 음수·$0$·양수인 모든 경우에 실수 다섯제곱근은 정확히 하나다. 즉 항상 $g(n)=1$이다.

따라서 경우를 나누면
$n<6$일 때 $f(n)+g(n)=0+1=1$,
$n=6$일 때 $f(n)+g(n)=1+1=2$,
$n>6$일 때 $f(n)+g(n)=2+1=3$이다.
원하는 합이 $3$이 되려면 $n>6$이어야 한다.
문제에서 $n$은 $10$ 이하의 자연수이므로 $n=7,8,9,10$의 네 개다.
따라서 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** g(n)=1, f(n)=2는 n−6>0일 때; n=7,8,9,10 네 개, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `5.0`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
$x$에 대한 부등식 $3^{2x}-(2a+10)3^x + 20a \le 0$을 만족시키는 정수 $x$의 개수가 3이 되도록 하는 1보다 작은 양수 $a$의 최댓값은? [5.0점]
````

- **원본 `choices` (원순서):**

````text
1. \dfrac{1}{6}
2. \dfrac{1}{3}
3. \dfrac{1}{2}
4. \dfrac{2}{3}
5. \dfrac{5}{6}
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$3^{2x}=(3^x)^2$이므로 $t=3^x>0$으로 치환한다.
$t^2-(2a+10)t+20a=(t-2a)(t-10)$이다.
$0<a<1$에서 $0<2a<2<10$이므로
$(t-2a)(t-10)\le0\iff2a\le t\le10$이다.
따라서 구할 정수해는 $2a\le3^x\le10$을 만족하는 정수 $x$다.

상한 $10$으로 먼저 정수 후보를 좁힌다.
$3^2=9\le10$, $3^3=27>10$이므로 $x\ge3$은 불가능하다.
또 $0<2a<2$이므로 $3^1=3$, $3^2=9$는 항상 범위 안에 들어간다. 따라서 $x=1,2$ 두 개는 이미 확보되어 있다.

정확히 세 개가 되려면 $x=0$은 넣고 $x=-1$은 빼야 한다.
$3^0=1$이 포함되려면 $2a\le1$, 즉 $a\le\dfrac12$이다.
$3^{-1}=\dfrac13$이 포함되지 않으려면 $\dfrac13<2a$, 즉 $a>\dfrac16$이다.
$3^x$는 $x$가 커질수록 증가하므로 $x=-1$이 제외되면 그보다 작은 모든 정수 $x\le-2$도 자동으로 제외된다.
따라서 정수해가 정확히 $x=0,1,2$가 되는 범위는
$\boxed{\dfrac16<a\le\dfrac12}$이다.

끝점 주의: $a=\dfrac16$이면 $x=-1$까지 포함되어 네 개이므로 제외한다. 반면 $a=\dfrac12$이면 $x=0$은 포함되고 $x=-1$은 제외되어 정확히 세 개다.
따라서 $a$의 최댓값은 $\dfrac12$이며 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** 2a≤3^x≤10, 항상 x=1,2 포함; 정확히 3개 조건 1/6<a≤1/2, 최댓값1/2, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `객관식` / `6.0`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
$x$에 관한 이차방정식 $5x^2 - \sqrt{5}x - k = 0$의 두 근을 $\sin\theta$, $\cos\theta$라 할 때, $\sin\theta$, $|\cos\theta|$를 두 근으로 하는 이차방정식은 $5x^2 - 3\sqrt{5}x + k = 0$이다. 상수 $k$에 대하여 $k(2\sin\theta + \cos\theta) = \dfrac{a\sqrt{5}}{5}$일 때, 상수 $a$의 값은? [6.0점]
````

- **원본 `choices` (원순서):**

````text
1. 6
2. 4
3. 2
4. -2
5. -4
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$s=\sin\theta$, $c=\cos\theta$라 놓는다. 두 이차방정식의 근과 계수의 관계를 각각 적용하면
$s+c=\dfrac{\sqrt5}{5}$, $sc=-\dfrac{k}{5}$,
$s+|c|=\dfrac{3\sqrt5}{5}$, $s|c|=\dfrac{k}{5}$이다.
두 근의 합을 빼면
$|c|-c=\dfrac{2\sqrt5}{5}>0$이다. 따라서 $c<0$이고 $|c|=-c$이다.
$-c-c=\dfrac{2\sqrt5}{5}$에서 $c=-\dfrac{\sqrt5}{5}$이다.
$s+c=\dfrac{\sqrt5}{5}$에 대입하면
$s=\dfrac{\sqrt5}{5}-\left(-\dfrac{\sqrt5}{5}\right)=\dfrac{2\sqrt5}{5}$이다.
$sc=-\dfrac{k}{5}$에 대입하면
$\dfrac{2\sqrt5}{5}\times\left(-\dfrac{\sqrt5}{5}\right)=-\dfrac25=-\dfrac{k}{5}$이므로 $k=2$다.
따라서 $k(2s+c)=2\left(\dfrac{4\sqrt5}{5}-\dfrac{\sqrt5}{5}\right)=\dfrac{6\sqrt5}{5}$이다.
$\dfrac{a\sqrt5}{5}=\dfrac{6\sqrt5}{5}$이므로 $a=6$이고 정답은 ①이다.
````

- **독립 검산·선지·경계 근거:** 두 방정식의 근 합 차로 cos=−√5/5, sin=2√5/5, k=2; a=6, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `서술형` / `5`; 원본 standardCourse/category: `수학Ⅰ` / `삼각함수`
- **원본 `content` 전체:**

````text
[서술형1] 각 $\theta$가 제3사분면의 각일 때, 다음 식을 간단히 하시오. [5점]<br><br>$$|1-2\cos\theta| - \sqrt{\cos^2\theta} - \sqrt{(\sin\theta+\cos\theta)^2}$$
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `$1+\sin\theta$`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
제3사분면에서는 $\sin\theta<0$, $\cos\theta<0$이므로 $\sin\theta+\cos\theta<0$이다.
따라서 $1-2\cos\theta>0$이고
$|1-2\cos\theta|=1-2\cos\theta$이다.
또한 $\sqrt{\cos^2\theta}=|\cos\theta|=-\cos\theta$,
$\sqrt{(\sin\theta+\cos\theta)^2}=|\sin\theta+\cos\theta|=-(\sin\theta+\cos\theta)$이다.
이제 원래 식에 대입하면
$(1-2\cos\theta)-(-\cos\theta)-[-(\sin\theta+\cos\theta)]$
$=1-2\cos\theta+\cos\theta+\sin\theta+\cos\theta$
$=1+\sin\theta$이다.
따라서 답은 $\boxed{1+\sin\theta}$이다.
````

- **독립 검산·선지·경계 근거:** III사분면 cos,sin<0; 절댓값/제곱근 분기 적용하면 1+sinθ로 원문과 일치.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `서술형` / `7`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
[서술형2] 모든 실수 $x$에 대하여 부등식 $a \cdot 2^{2x} + a \cdot 2^{x+1} - a^2+2a+3 > 0$이 항상 성립하도록 하는 모든 정수 $a$의 개수를 구하시오. [7점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `4`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
모든 실수 $x$에 대해 성립해야 하므로 $t=2^x$로 바꿔 생각한다.
$2^x$는 모든 양수 값을 가질 수 있고 $0$은 될 수 없으므로 범위는 정확히 $t>0$이다.
$2^{2x}=t^2$, $2^{x+1}=2t$를 대입하면
$a t^2+2at-a^2+2a+3>0$,
즉 $at(t+2)+(-a^2+2a+3)>0$이다.

① $a<0$인 경우
$t$가 매우 커지면 $at(t+2)$는 음의 방향으로 끝없이 작아진다. 따라서 모든 $t>0$에서 양수일 수 없으므로 제외한다.

② $a=0$인 경우
좌변은 $3>0$으로 항상 성립한다. 따라서 $a=0$은 반드시 포함한다.

③ $a>0$인 경우
$t>0$이므로 $at(t+2)>0$이고, $t$가 $0$에 가까워질수록 이 항은 $0$에 가까워진다.
따라서 모든 $t>0$에서 양수가 되기 위한 필요충분조건은 상수항이 음수가 아닌 것,
$-a^2+2a+3\ge0$이다.
상수항이 음수이면 충분히 작은 양수 $t$에서 좌변이 음수가 되기 때문이다.
$-a^2+2a+3=-(a-3)(a+1)$이므로
$-(a-3)(a+1)\ge0\iff-1\le a\le3$이다.
이 중 $a>0$인 정수는 $1,2,3$이다.

경계 $a=3$도 포함한다. 이때 상수항은 $0$이지만 좌변은 $3t(t+2)>0$이다. $t=0$은 $2^x$의 값이 될 수 없으므로 부등식의 엄격한 부등호 $>$와 모순되지 않는다.
따라서 $a=0,1,2,3$의 네 개이고 답은 $\boxed{4}$이다.
````

- **독립 검산·선지·경계 근거:** t=2^x>0에서 a<0 불가능, a=0 가능, a>0은 −a²+2a+3≥0→a=1,2,3. 총4.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21` · questionUid: `NOT_PRESENT` · source blob: `42d429890d5951aaf4aa337665da4cdbf1534d2d`
- 유형/배점: `서술형` / `8`; 원본 standardCourse/category: `수학Ⅰ` / `지수함수와 로그함수`
- **원본 `content` 전체:**

````text
[서술형3] 그림과 같이 두 함수 $f(x)=2^x-1$, $g(x)=-\left(\dfrac{1}{2}\right)^x+3$의 그래프가 만나는 두 점을 $\mathrm{A}$, $\mathrm{B}$라 하고 함수 $y=g(x)$의 그래프가 $y$축과 만나는 점을 $\mathrm{C}$라 하자. 점 $\mathrm{A}$의 $x$좌표를 $a$라 할 때, 사각형 $\mathrm{OACB}$의 넓이를 $a$로 나타내시오. (단, $\mathrm{O}$는 원점이다.) [8점]<br><br><img src="assets/images/19_금당고_1학기_중간_고2_수학I/q21.png" class="question-img">
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `$2a$`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
① 두 교점의 $x$좌표를 구한다.
$f(x)=g(x)$이므로
$2^x-1=-2^{-x}+3$,
$2^x+2^{-x}=4$이다.
$t=2^x>0$으로 놓고 양변에 $t$를 곱하면
$t^2+1=4t$,
$t^2-4t+1=0$,
$t=\dfrac{4\pm\sqrt{16-4}}2=2\pm\sqrt3$이다.
$(2+\sqrt3)(2-\sqrt3)=1$이므로 두 해는 서로 역수다.
오른쪽 교점 $\mathrm A$의 $x$좌표가 $a>0$이므로 $2^a=2+\sqrt3$,
따라서 $a=\log_2(2+\sqrt3)$이다.
다른 교점 $\mathrm B$에서는 $2^x=2-\sqrt3=2^{-a}$이므로 $x=-a$이다.

② 사각형을 나눌 기준 선분을 정한다.
$\mathrm C$는 $g$의 $y$절편이므로
$\mathrm C=(0,g(0))=(0,-1+3)=(0,2)$이다.
원점 $\mathrm O=(0,0)$이므로 세로 선분 $\mathrm{OC}$의 길이는 $2$다.
사각형 $\mathrm{OACB}$를 $\mathrm{OC}$로 나누면 삼각형 $\mathrm{OAC}$와 $\mathrm{OCB}$ 두 개가 된다.

③ 각 삼각형의 넓이를 구한다.
밑변을 세로 선분 $\mathrm{OC}$로 잡았으므로 높이는 점의 $y$좌표가 아니라 $y$축까지의 가로 거리다.
$\mathrm A$의 $x$좌표가 $a$이므로 높이는 $a$,
$\mathrm B$의 $x$좌표가 $-a$이므로 높이는 $|-a|=a$다.
따라서
$[\triangle\mathrm{OAC}]=\dfrac12\times2\times a=a$,
$[\triangle\mathrm{OCB}]=\dfrac12\times2\times a=a$이다.

④ 두 넓이를 더한다.
$[\mathrm{OACB}]=a+a=\boxed{2a}$이다.
$a=\log_2(2+\sqrt3)$를 대입하면 $2\log_2(2+\sqrt3)$로도 나타낼 수 있다.
````

- **독립 검산·선지·경계 근거:** 역수 교점의 x좌표 ±a, C=(0,2)이다. 공통 수직변 OC 길이2로 좌·우 삼각형 각각 a, 사각형 2a. 원본 PNG 도형 대조.
- **그림 실물 근거:** `archive/assets/images/19_금당고_1학기_중간_고2_수학I/q21.png` (PNG / blob `dd12ee3d79340c05292edf76a8fdd699ea6eacae`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

## 수납·잔여

- 실제 원문 문항 21/21, 해설 21/21, 답 21/21 확인. 연결 이미지 5/5를 물리적 렌더 또는 PNG 육안으로 대조.
- 분류: KEEP 21, UPGRADE 0, HOLD 0, UNREAD 0. UPGRADE는 MD에만 개선안을 적었으며 해당 원본 파일을 아직 직접 수정하지 않음.
- 보류 이유: 없음. 학생 서비스 릴리즈·Golden/Negative preflight는 별도 작업으로 `NOT_RUN`.
