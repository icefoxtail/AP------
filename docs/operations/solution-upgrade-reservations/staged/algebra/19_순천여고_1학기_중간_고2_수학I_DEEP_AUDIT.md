# 2019 19_순천여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 학생용 해설 심층 감사
- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2019`
- source: `archive/exams/original/high/h2/1mid/19_순천여고_1학기_중간_고2_수학I.js`
- source ref / worker branch: `work/solution-upgrade-lane-30-20261121`
- source blob SHA: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/19_순천여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- 원본 메타데이터: `standardCourse` 누락 0/22, `category` 누락 0/22, `questionType` 누락 0/22. 누락값은 추정·대입하지 않고 `NOT_PRESENT` 처리.
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; pending upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 이 파일의 전 문항 `content`·`choices`·`answer`·`solution` 원형을 읽고 수학 계산·진수/밑·정수 끝점·선지 대응·그림 연계를 독립 대조한 MD 예약 감사. 원본 JS·SVG·PNG·정답키·`main` 변경 없음.

## 검토 기준·실물 검증 경계

- 지침: 저장소 `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md`; 기존 lane30 예약 MD 감사의 분모와 상태 체계 유지.
- 수학: 각 원문 조건에서 별도로 지수·로그·삼각함수·실수근·교점·기하·정수 경계를 계산하고 선지/답과 비교. 원본 해설을 전부 읽되 해설 주장만으로 정답 통과시키지 않음.
- 실물 그림: 원본 PNG 9개를 내려받아 이미지 시각 판독, 해설 SVG 1개를 실제 XML로 확인하고 Inkscape 래스터 렌더하여 그림 실물 시각 판독. 이미지 파일 존재 확인만으로 표시 품질 PASS 처리하지 않음.
- 운영 `preflight`·Golden/Negative·서비스 최종 렌더·자동 릴리즈·출고 QA와 원본 변경 후 종속 검사 미실행: `QA_NOT_RUN`. 본 산출물은 결함 위치를 식별하는 감사 문서이며 출고 승인서가 아님.

## 이미지 원본 경로·Git blob 증거

- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07.png` · Git blob `76a31f3a1f907e099e085f9ec094fe95e9915e23` · 원본 PNG 실물 판독
- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_1.png` · Git blob `86c9dd36407a5664131dce61bf31fef0fe71ac4d` · 원본 PNG 실물 판독
- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_2.png` · Git blob `8730ba923441eaa13acc3206c822faee33d4f2dc` · 원본 PNG 실물 판독
- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_3.png` · Git blob `fb37cc4312bcb47d7db5add3d0a625ee1102e2a6` · 원본 PNG 실물 판독
- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_4.png` · Git blob `7cb5c4e053b74e59ff2fb3e5416039ebb3bd685a` · 원본 PNG 실물 판독
- Q07 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_5.png` · Git blob `b8340370fd93a0301c3faf17fd73c9fbe64ee299` · 원본 PNG 실물 판독
- Q12 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q12.png` · Git blob `8695cac83e637ab35e92958115a5875b7d5191df` · 원본 PNG 실물 판독
- Q17 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q17.png` · Git blob `1c4145cba97f778c0e41fbf1ee2716e829357aba` · 원본 PNG 실물 판독
- Q19 SVG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q19-solution.svg` · Git blob `b3c6dbf0c9728ce75093d2547f9b3feb4d0a221f` · SVG 원본 확인 → Inkscape PNG 렌더 후 시각 판독
- Q20 PNG: `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q20.png` · Git blob `715558781fab43425f7979e9fc522dd1485853a3` · 원본 PNG 실물 판독

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1` · questionUid: `qid_v1_83de3796b754178d4ea30c0392d46758d41955d359f821b124c763102b43b0bd` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
1. $3^{\log_3 6} + 2\log_4 6 + \log_{\frac{1}{2}} 3$의 값을 구하면? [4점]
````

- **원본 `choices` (원순서):**

````text
1. $0$
2. $1$
3. $2$
4. $3$
5. $7$
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
먼저 $3^{\log_3 6}=6$이다.

$2\log_4 6=\log_2 6$, $\log_{\frac{1}{2}}3=-\log_2 3$이므로 전체는 $6+\log_2 2=7$이다. 정답은 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 3^{log₃6}=6, 2log₄6=log₂6, log_(1/2)3=−log₂3; 합7, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2` · questionUid: `qid_v1_9e4b136adcc578c2deebe7237deed08866bcb855acfa5bd17fd31181ba57725c` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.1`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
2. 세 수 $A = \sqrt[3]{\sqrt{10}}, B = \sqrt{5}, C = \sqrt[3]{\sqrt{28}}$의 대소관계를 바르게 나타낸 것은? [4.1점]
````

- **원본 `choices` (원순서):**

````text
1. $A < B < C$
2. $A < C < B$
3. $B < A < C$
4. $B < C < A$
5. $C < A < B$
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$A=10^{\frac{1}{6}}$, $B=125^{\frac{1}{6}}$, $C=28^{\frac{1}{6}}$이다. $10<28<125$이고 여섯제곱근은 대소관계를 보존하므로 $A<C<B$이다. 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** 여섯제곱 지수로 10,28,125 비교→A<C<B, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3` · questionUid: `qid_v1_83349dc069e7defb7d79698445b52390a47c7360c06d82e5264a22176d291efe` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
3. 자연수 $n(n \ge 2)$에 대하여 실수 $k$의 $n$제곱근 중에서 실수 인 것의 개수를 $F_n(k)$라 할 때,
$F_3(\sqrt[3]{-8}) + F_4(-\sqrt{(-2)^2}) + F_5(\sqrt[4]{(-2)^4})$의 값을 구하면? [4.2점]
````

- **원본 `choices` (원순서):**

````text
1. $0$
2. $1$
3. $2$
4. $3$
5. $4$
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
세 입력은 $-2,-2,2$이다. 홀수 차수는 실수근이 하나이므로 $F_3(-2)=1$, $F_5(2)=1$이다. 음수의 짝수 차수근은 없으므로 $F_4(-2)=0$. 합은 $2$이다. 정답은 ③이다.
````

- **독립 검산·선지·경계 근거:** 세 입력 −2,−2,2; 홀수 차수 1개씩, 짝수 음수 0개→합2, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4` · questionUid: `qid_v1_b5085e7cc8bd5da8861ffb636ffbb70d17dc73c197b81bc056e62397e38c71cd` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
4. $\log 6 = 0.78$임을 이용하여 다음 조건을 만족하는 $A, B$의 값을 구하고자 한다.
<div class="problem-box">
(가) $\log A = -1.22$<br>
(나) $\log B = 2.78$
</div>
$A, B$에 대하여 $\log_2(A \times B) = a + b\log_2 c$ 일 때, $a^2+b^2+c^2$의 값을 구하면? (단, $a, b, c$는 소수이다.) [4.3점]
````

- **원본 `choices` (원순서):**

````text
1. $15$
2. $17$
3. $19$
4. $21$
5. $23$
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$\log(AB)=-1.22+2.78=1.56=2\log6$이므로 $AB=36$. $\log_2 36=2+2\log_2 3$이다. $(a,b,c)=(2,2,3)$이므로 제곱합은 $17$이다. 정답은 ②이다.
````

- **독립 검산·선지·경계 근거:** logA+logB=1.56=2log6→AB=36; log₂36=2+2log₂3, 소수 a,b,c=2,2,3→17, ②.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5` · questionUid: `qid_v1_6db8a576e173f8a05306da1f0316c5cd09b72a05c2690d738658e33ab5ac32ab` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.5`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
5. 양수 $x$에 대하여 $x^{\frac{1}{3}} - x^{-\frac{1}{3}} = 3$일 때, $x^2 + x^{-2}$의 값을 구하면? [4.5점]
````

- **원본 `choices` (원순서):**

````text
1. $826$
2. $1000$
3. $1296$
4. $1298$
5. $1300$
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$u=x^{\frac{1}{3}}$, $v=x^{-\frac{1}{3}}$이면 $uv=1$, $u-v=3$이다. 따라서 $u^2+v^2=11$. $u^6+v^6=(u^2+v^2)^3-3u^2v^2(u^2+v^2)=1298$. 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** uv=1,u−v=3→u²+v²=11; u⁶+v⁶=11³−3·11=1298, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6` · questionUid: `qid_v1_7b9e8eddfe05c503158b64964f840fa80c2c7dd1ed4ec1798bac3add3cb69a68` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.6`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
6. 빛이 어떤 유리판 1장을 통과할 때마다 밝기가 통과하기 전보다 $x\,\%$씩 줄어든다고 한다. 이 유리판을 10장 통과했을 때, 빛의 밝기는 처음 빛의 밝기의 $5\,\%$일 때, $x$의 값은 약 얼마인가? [4.6점]
(단, $\log 2 = 0.3010$, $\log 1.349 = 0.1301$)
````

- **원본 `choices` (원순서):**

````text
1. $23$
2. $24$
3. $25$
4. $26$
5. $27$
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
한 장에서 남는 비율은 $1-\frac{x}{100}$이므로 $(1-\frac{x}{100})^{10}=0.05$. 로그를 취하면 $\log(1-\frac{x}{100})=-0.1301=-\log1.349$, 따라서 $1-\frac{x}{100}=1/1.349\approx0.7413$. $x\approx25.87$, 즉 약 $26$이고 정답은 ④이다.
````

- **독립 검산·선지·경계 근거:** (1−x/100)^10=.05→log 잔존율=−.1301; 1/1.349≈.7413→x≈25.87%, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7` · questionUid: `qid_v1_6eb7915740ebea22c7373fc2359c137cb9f3ac3b3821fee905201d421df9e595` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.5`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
7. 오른쪽 그림은 일차함수 $y=f(x)$의 그래프이다. 함수 $y=\left(\frac{1}{2}\right)^{1-f(x)}$의 그래프의 개형으로 알맞은 것은? [4.5점]
<p><img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07.png" class="question-img" alt="문제 7 그림"></p>
````

- **원본 `choices` (원순서):**

````text
1. <img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07_1.png" class="choice-img" alt="보기 1">
2. <img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07_2.png" class="choice-img" alt="보기 2">
3. <img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07_3.png" class="choice-img" alt="보기 3">
4. <img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07_4.png" class="choice-img" alt="보기 4">
5. <img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q07_5.png" class="choice-img" alt="보기 5">
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
그림에서 $f(x)=x+1$. 그러므로 $1-f(x)=-x$이고 $(\frac{1}{2})^{1-f(x)}=2^x$. 증가하고 $(0,1)$을 지나며 $x$축을 점근선으로 갖는 그래프는 ②이다.
````

- **독립 검산·선지·경계 근거:** 원본 1차함수 PNG에서 f(x)=x+1. y=(1/2)^(−x)=2^x, 증가·(0,1) 그림 보기② 실물 확인.
- **그림 실물 근거:** `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07.png` (PNG / blob `76a31f3a1f907e099e085f9ec094fe95e9915e23`); `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_1.png` (PNG / blob `86c9dd36407a5664131dce61bf31fef0fe71ac4d`); `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_2.png` (PNG / blob `8730ba923441eaa13acc3206c822faee33d4f2dc`); `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_3.png` (PNG / blob `fb37cc4312bcb47d7db5add3d0a625ee1102e2a6`); `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_4.png` (PNG / blob `7cb5c4e053b74e59ff2fb3e5416039ebb3bd685a`); `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q07_5.png` (PNG / blob `b8340370fd93a0301c3faf17fd73c9fbe64ee299`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8` · questionUid: `qid_v1_ff2b372d3e396e0fd55a623da32c640e5bc92fcf5d74c0a845b380eb9b2c9928` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.4`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
8. 정의역이 $\{x|-1 \le x \le 1\}$일 때, 함수
$$y = 2^{2x+2} \times 3^{-x+1}$$
의 최댓값을 $M$, 최솟값을 $m$이라고 하자. 이때 $M+m$의 값을 구하면? [4.4점]
````

- **원본 `choices` (원순서):**

````text
1. $25$
2. $32$
3. $47$
4. $63$
5. $72$
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$y=2^{2x+2}3^{-x+1}=12(\frac{4}{3})^x$. $\frac{4}{3}>1$이므로 $[-1,1]$에서 증가한다. $m=9$, $M=16$이므로 합은 $25$, 정답은 ①이다.
````

- **독립 검산·선지·경계 근거:** y=12(4/3)^x, −1≤x≤1에서 min9,max16, 합25, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9` · questionUid: `qid_v1_1957cccf24c64bcbb9f239cad9015669b1da4cf74dbdb2f287f7b543cd2ff191` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.9`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
9. 두 곡선 $y = -3^{x+1}+1$과 $y = -\log_{\frac{1}{3}}(x+a)-1$이 제3사분면에서 만나도록 하는 상수 $a$값의 범위가 $\alpha < a < \beta$일 때, $\alpha+\beta$의 값을 구하면? [4.9점]
````

- **원본 `choices` (원순서):**

````text
1. $3$
2. $\dfrac{11}{3}$
3. $4$
4. $\dfrac{13}{3}$
5. $\dfrac{14}{3}$
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
제3사분면에서 첫 곡선은 $-1<x<0$. $t=3^{x+1}$이면 $1<t<3$, $x=\log_3t-1$. 교점식에서 $a=3^{2-t}-\log_3t+1$. $a'(t)=-(\ln3)3^{2-t}-1/(t\ln3)<0$이므로 $a$는 감소한다. $t\to1+$일 때 $4$, $t\to3-$일 때 $1/3$이므로 $a$의 범위는 $(1/3,4)$, 합은 $13/3$, 정답 ④이다.
````

- **독립 검산·선지·경계 근거:** III사분면 첫곡선 x∈(−1,0). t=3^{x+1}∈(1,3)에서 a=3^{2−t}−log₃t+1는 감소; 양끝 4,1/3→합13/3, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10` · questionUid: `qid_v1_90e20eb4bb4917fc7671eaf2a07cbd06a5bdf979f890b6ad26f9b5be82ab0702` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `5.1`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
10. 함수 $y=\log_{\frac{1}{3}}(3x-p)$의 그래프와 직선 $x=4$가 한 점에서 만나고, 함수 $y=|3^{-x-1}-p|$의 그래프와 직선 $y=4$이 두 점에서 만나도록 하는 모든 정수 $p$의 개수를 구하면? [5.1점]
````

- **원본 `choices` (원순서):**

````text
1. $3$
2. $5$
3. $7$
4. $9$
5. $11$
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$x=4$에서 로그함수가 정의되려면 $12-p>0$, 즉 $p<12$. 둘째 식에서 $t=3^{-x-1}>0$이면 $|t-p|=4$. 두 해가 양수이려면 $p>4$. $4<p<12$인 정수는 7개, 정답 ③이다.
````

- **독립 검산·선지·경계 근거:** 로그 x4 정의는 p<12, |t−p|=4에서 서로 다른 양의 t 두 개려면 p>4; 정수 p5…11 7개, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11` · questionUid: `qid_v1_a8fef6200e6dd78e49ce245042ef661564e8b708cd064aa7437125e8c75de218` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `5.2`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
11. 실수 전체의 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.
<div class="problem-box">
(가) $f(x) = \begin{cases} 3^{-x}-1 & (-1 \le x < 0) \\ 3^x-1 & (0 \le x < 1) \end{cases}$<br>
(나) 모든 실수 $x$에 대하여 $f(x) = f(x+2)$이다.
</div>
이 때, 자연수 $n$에 대하여, 함수 $y=f(x)$의 그래프와 함수 $y=\log_{3n} x$의 그래프와의 교점의 개수가 143개 일 때, $n$의 값을 구하면? [5.2점]
````

- **원본 `choices` (원순서):**

````text
1. $4$
2. $5$
3. $6$
4. $7$
5. $8$
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$N=(3n)^2$라 두면 $\log_{3n}x=2$일 때 $x=N$이다. $0<x<1$에서는 로그값이 음수이고 $f(x)\ge0$이므로 교점이 없다. 정수 $k$에서 짝수이면 $f(k)=0$, 홀수이면 $f(k)=2$이다. $1\le k<N$에서 $\log_{3n}k<2$이므로 $\log_{3n}k-f(k)$는 짝수에서 양수, 홀수에서 음수이다. 각 단위구간에서 $f$는 단조이다. 감소 구간에서는 $\log_{3n}x-f(x)$가 증가한다. 증가 구간($x\ge2$)에서는 $f\prime(x)\ge\ln3$, $\left(\log_{3n}x\right)\prime=1/(x\ln(3n))<\ln3$이므로 차는 감소한다. 따라서 $1$부터 $N$까지의 $N-1$개 단위구간마다 교점이 하나씩 있고, $N$이 홀수이면 마지막 교점은 $x=N$이다. 교점 수는 $N-1=(3n)^2-1$. 이를 143과 같게 두면 $n=4$, 정답 ①이다.
````

- **독립 검산·선지·경계 근거:** f는 2주기 0~2 봉우리, N=(3n)²에서 log_{3n}N=2. 1≤x≤N의 N−1개 단위구간마다 교점 하나, x>N엔 없음; N−1=143→n4, ①.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12` · questionUid: `qid_v1_995607ab2bc05719579da1d83c990bd2120be1018887865e07ec6d2a28725435` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.3`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
12. 다음은 원점 $\mathrm{O}$에서 $x$축의 양의 방향으로 시초선 $\mathrm{OX}$를 잡을 때, $x$축에 대하여 대칭인 두 동경이 나타내는 일반각의 합을 구한 것이다.
<p><img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q12.png" class="question-img" alt="문제 12 그림"></p>
<div class="problem-box">
$x$축에 대하여 대칭인 두 동경을 각각 $\mathrm{OP}, \mathrm{OP'}$이라 하고, 두 동경이 나타내는 일반각을 각각<br>
$\angle\mathrm{XOP} = 360^\circ \times l + (\text{가})\ (l\text{은 정수})$<br>
$\angle\mathrm{XOP'} = 360^\circ \times m + (\text{나})\ (m\text{은 정수})$<br>
라고 하면 이 두 일반각의 합은<br>
$\angle\mathrm{XOP} + \angle\mathrm{XOP'} = 360^\circ \times (\text{다})$<br>
즉, $360^\circ \times (\text{정수})$이다.
</div>
(가), (나), (다)를 옳게 나타낸 것은? [4.3점]
````

- **원본 `choices` (원순서):**

````text
1. (가) $\alpha^\circ$, (나) $-\alpha^\circ$, (다) $l+m$
2. (가) $\alpha^\circ$, (나) $-\alpha^\circ$, (다) $l-m$
3. (가) $\alpha^\circ$, (나) $\alpha^\circ$, (다) $l+m$
4. (가) $-\alpha^\circ$, (나) $\alpha^\circ$, (다) $l+m$
5. (가) $-\alpha^\circ$, (나) $-\alpha^\circ$, (다) $l-m$
````

- 원본 `answer`: `①`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
두 기준각은 $\alpha^\circ$와 $-\alpha^\circ$. 일반각은 각각 $360^\circ l+\alpha^\circ$, $360^\circ m-\alpha^\circ$이므로 합은 $360^\circ(l+m)$이다. 정답 ①이다.
````

- **독립 검산·선지·경계 근거:** 원본 동경 PNG에서 위쪽 α°, 아래쪽 −α°; 일반각 합 360°(l+m), ①.
- **그림 실물 근거:** `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q12.png` (PNG / blob `8695cac83e637ab35e92958115a5875b7d5191df`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13` · questionUid: `qid_v1_906dc275334320bcf0cf0de7ba2aa60c1dad3df542e97d236f8bdeff98ee3f18` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
13. 다음 [보기]에서 옳은 것만을 있는 대로 고른 것은? [4.2점]
<div class="problem-box">
<b>[ 보 기 ]</b><br>
ㄱ. $750^\circ$는 제1사분면의 각이다.<br>
ㄴ. $\dfrac{3}{2}\pi = 180^\circ$<br>
ㄷ. $\theta = \dfrac{20}{3}\pi$일 때, $\dfrac{\theta}{4}$는 제4사분면이다.<br>
ㄹ. $\cos\left(\dfrac{\pi}{2}+x\right) = \sin x$
</div>
````

- **원본 `choices` (원순서):**

````text
1. ㄱ, ㄴ, ㄷ, ㄹ
2. ㄱ, ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄷ, ㄹ
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
ㄱ: $750^\circ$는 $30^\circ$와 동치라 참. ㄴ: $3\pi/2=270^\circ$라 거짓. ㄷ: $\theta/4=5\pi/3=300^\circ$라 참. ㄹ: $\cos(\pi/2+x)=-\sin x$라 거짓. 옳은 것은 ㄱ,ㄷ, 정답 ③이다.
````

- **독립 검산·선지·경계 근거:** 750°≡30° 참, 3π/2=270° 거짓, θ/4=5π/3(IV) 참, cos(π/2+x)=−sinx 거짓→ㄱ·ㄷ, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14` · questionUid: `qid_v1_5e1cee2c747cb40bdc498b4a9f548fe1dd0c6759aab69352dddab921515dcda4` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
14. (부채꼴의 호의길이와 넓이)다음은 순천여자고등학교 2학년 자연계 학생들의 대화 중 일부를 발췌한 것이다. 사실과 다르게 이야기하고 있는 학생은 누구인가요? [4점]
````

- **원본 `choices` (원순서):**

````text
1. 연우: 호도법은 호의 길이를 이용하여 각의 크기를 나타내는 방법이야.
2. 은주: 호의 길이는 중심각의 크기에 정비례하므로 비례식을 통해서 호도법과 육십분법의 관계를 알 수 있어.
3. 수빈: 부채꼴의 넓이는 부채꼴의 넓이를 적당히 등분하여 사각형의 넓이공식을 이용하여 구할 수 도 있어.
4. 수연: 반지름의 길이가 1이고 중심각의 크기가 $60^\circ$인 호의길이는 60이야.
5. 도희: 라디안(radian)은 반지름(radius)과 각(angle)의 합성어이고, 호도법의 호도(弧度)는 호의 각도라는 뜻이다.
````

- 원본 `answer`: `④`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$s=r\theta$. $r=1$, $60^\circ=\pi/3$이므로 호의 길이는 $\pi/3$이다. 60이라고 한 수연의 말이 틀렸으므로 정답 ④이다.
````

- **독립 검산·선지·경계 근거:** 60°=π/3 라디안이므로 반지름1 부채꼴 호는 π/3, 60이라는 수연 발언 오류, ④.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15` · questionUid: `qid_v1_c00353136658fdd5a2df861594e721fe825030790840aa8f78d5ed7f09c90f4a` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.4`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
15. 직선 $3x-y+3=0$이 $x$축의 양의 방향과 이루는 각의 크기를 $\theta$라 할 때,
$\tan(\pi+\theta) + \cos\left(\dfrac{\pi}{2}-\theta\right) + \sin(-\theta)$의 값은? [4.4점]
````

- **원본 `choices` (원순서):**

````text
1. $-3$
2. $-\dfrac{1}{3}$
3. $0$
4. $\dfrac{1}{3}$
5. $3$
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
직선은 $y=3x+3$이므로 $\tan\theta=3$. $\tan(\pi+\theta)=3$, $\cos(\pi/2-\theta)=\sin\theta$, $\sin(-\theta)=-\sin\theta$. 사인항은 상쇄되어 값은 3, 정답 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 기울기3→tanθ=3, cos(π/2−θ)=sinθ와 sin(−θ)가 상쇄, 결과3, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16` · questionUid: `qid_v1_6dd450b965fb331d2cb479fa9d8e8e0a5a14282741d1a49acea0bae51d18313f` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.4`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
16. 함수 $f(x)=\tan\left(2x-\dfrac{\pi}{2}\right)-3$에 대한 설명으로 옳은 것만을 [보기]에서 있는 대로 고른 것은? [4.4점]
<div class="problem-box">
<b>[ 보 기 ]</b><br>
ㄱ. 주기는 $\pi$이다.<br>
ㄴ. 점근선은 직선 $x=\dfrac{n}{2}\pi (n\text{은 정수})$이다.<br>
ㄷ. $y=\tan 2x$의 그래프를 $x$축 방향으로 $\dfrac{\pi}{2}$만큼 $y$축 방향으로 $-3$만큼 평행이동 한 그래프이다.
</div>
````

- **원본 `choices` (원순서):**

````text
1. ㄱ, ㄴ
2. ㄱ, ㄴ, ㄷ
3. ㄴ
4. ㄱ
5. ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
탄젠트의 주기는 $\pi$이므로 주어진 그래프 주기는 $\pi/2$라 ㄱ은 거짓. 점근선은 $2x-\pi/2=\pi/2+n\pi$에서 $x=(n+1)\pi/2$, 정수 첨자를 바꾸면 제시된 식과 같아 ㄴ은 참. 수평 이동은 $\pi/4$라 ㄷ은 거짓. 정답 ③이다.
````

- **독립 검산·선지·경계 근거:** tan(2x−π/2) 주기는 π/2, 점근선 x=nπ/2, 수평이동은 π/4 또는 동치 이동; ㄴ만 참, ③.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17` · questionUid: `qid_v1_119dce38e9766028d168697a24da545d24965d2211e3ed73b6afaa6870effd83` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.2`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
17. 다음 그림과 같이 함수 $y=\sin x\,(0 \le x \le 2\pi)$의 그래프와 직선 $y=\dfrac{\sqrt{2}}{2}$가 만나는 두 점의 $x$좌표를 각각 $\alpha, \beta\,(\alpha < \beta)$라고 할 때, $\beta-\alpha$의 값을 구하면? [4.2점]
<p><img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q17.png" class="question-img" alt="문제 17 그림"></p>
````

- **원본 `choices` (원순서):**

````text
1. $\dfrac{\pi}{4}$
2. $\dfrac{\pi}{2}$
3. $\pi$
4. $\dfrac{5\pi}{4}$
5. $\dfrac{3\pi}{2}$
````

- 원본 `answer`: `②`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$0\le x\le2\pi$에서 $\sin x=\sqrt2/2$의 두 해는 $\alpha=\pi/4$, $\beta=3\pi/4$. 따라서 차는 $\pi/2$, 정답 ②이다.
````

- **독립 검산·선지·경계 근거:** 원본 교점 PNG에서 sinx=√2/2의 해 π/4,3π/4, 차π/2, ②.
- **그림 실물 근거:** `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q17.png` (PNG / blob `1c4145cba97f778c0e41fbf1ee2716e829357aba`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18` · questionUid: `qid_v1_fce75718888297d00d6bc4aa6a4c2461929d4f2f47198281466e8ef4e753248a` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `객관식` / `4.7`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
18. $0 \le x < 2\pi$일 때, 부등식 $2\cos^2 x + 3\sin(\pi-x) \le 0$을 만족시키는 $x$의 최댓값과 최솟값의 합을 구하면? [4.7점]
````

- **원본 `choices` (원순서):**

````text
1. $\dfrac{11}{6}\pi$
2. $2\pi$
3. $\dfrac{7}{3}\pi$
4. $\dfrac{8}{3}\pi$
5. $3\pi$
````

- 원본 `answer`: `⑤`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$\sin(\pi-x)=\sin x$. $s=\sin x$라 두면 $2(1-s^2)+3s\le0$, 즉 $(2s+1)(s-2)\ge0$. $-1\le s\le1$이므로 $s\le-\frac{1}{2}$. 해는 $[7\pi/6,11\pi/6]$, 양끝 합은 $3\pi$, 정답 ⑤이다.
````

- **독립 검산·선지·경계 근거:** 부등식 −2s²+3s+2≤0→s≤−1/2 (s∈[−1,1]), 해 [7π/6,11π/6], 양 끝 합3π, ⑤.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19` · questionUid: `qid_v1_b9c60057c3045fad318e54a3575549c60637f42f21ccc732ea9e472b3e736593` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `서술형` / `3`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
[서술형1] 원점 $O$와 점 $P(-6, 8)$을 지나는 동경 $OP$가 나타내는 각의 크기를 $\theta$라 할 때, $10(\sin\theta+\cos\theta)$을 구하시오. [3점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `2`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$r=\sqrt{(-6)^2+8^2}=10$. 따라서 $\sin\theta=\frac{4}{5}$, $\cos\theta=-\frac{3}{5}$. $10(\sin\theta+\cos\theta)=2$이다.
````

- **독립 검산·선지·경계 근거:** r=10, sin=8/10, cos=−6/10, 10(sin+cos)=2. SVG/좌표도 원본에 부합.
- **그림 실물 근거:** `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q19-solution.svg` (SVG / blob `b3c6dbf0c9728ce75093d2547f9b3feb4d0a221f`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20` · questionUid: `qid_v1_e8a60767a12e34a02db60de4228c34a53e8f0d5bb2a4912440247f6176aefae8` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `서술형` / `5`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
[서술형2] 함수 $y=a\cos(bx+c)$의 그래프가 다음 그림과 같을 때, 상수 $a, b, c$의 값을 구하시오 [5점]
(단, $a>0$, $b>0$, $0 < c < \dfrac{\pi}{2}$)
<p><img src="assets/images/19_순천여고_1학기_중간_고2_수학I/q20.png" class="question-img" alt="서술형 2번 그림"></p>
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `(3, 2, π/3)`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
최댓값과 최솟값이 $3,-3$이므로 $a=3$. 극댓값 x좌표 차는 $\pi$이므로 $2\pi/b=\pi$, $b=2$. $x=0$에서 $3\cos c=\frac{3}{2}$, $\cos c=\frac{1}{2}$. $0<c<\pi/2$에서 $c=\pi/3$. 답은 $(3,2,\pi/3)$.
````

- **독립 검산·선지·경계 근거:** 원본 코사인 PNG max3,min−3, 연속 최고점 간격π→a3,b2; x0에서 3cosc=1.5, c∈(0,π/2)→π/3.
- **그림 실물 근거:** `archive/assets/images/19_순천여고_1학기_중간_고2_수학I/q20.png` (PNG / blob `715558781fab43425f7979e9fc522dd1485853a3`)
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21` · questionUid: `qid_v1_d2d7b3f767e45772ee00ae31b2734a8f30982f9185ca32d2580cfdaa50bcc00d` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `서술형` / `6`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
[서술형3] 세 변의 길이가 $a, b, c$인 삼각형 $ABC$에 대하여 다음 조건을 만족시키는 실수 $x, y$가 존재한다. 이때 삼각형 $ABC$는 어떤 삼각형인지 자세히 서술하시오. (단, $a \ne 1$, $b > c$) [6점]
<div class="problem-box">
(가) $x\log_a(b+c) = y\log_a(b-c) = 1$<br>
(나) $\dfrac{x+y}{2} = xy$
</div>
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `b가 빗변인 직각삼각형`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$U=\log_a(b+c)$, $V=\log_a(b-c)$라 하면 $x=\frac{1}{U}$, $y=\frac{1}{V}$. $\frac{x+y}{2}=xy$에서 $U+V=2$. 따라서 $\log_a((b+c)(b-c))=2$, 곧 $a^2+c^2=b^2$. 세 변은 양수이고 $b>c$이므로 $b$가 빗변인 직각삼각형이다.
````

- **독립 검산·선지·경계 근거:** xlog_a(b±c)=1, x,y 역수 치환하면 log_a[(b+c)(b−c)]=2→b²=a²+c², 빗변 b인 직각삼각형.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22` · questionUid: `qid_v1_1fed3bff8ab951d802caf5bbadc8d2430e08be917775e6c0d02a545e0ee406cb` · source blob: `838d13d4cc376bd7204541e6e25d121f49d16cc6`
- 유형/배점: `서술형` / `6`; 원본 standardCourse/category: `수학I` / `수학I`
- **원본 `content` 전체:**

````text
[서술형4] 함수 $f(x)=3^{x-1}+2$의 역함수의 그래프를 $x$축의 방향으로 $-2$만큼, $y$축의 방향으로 $a$만큼 평행이동시키면 함수 $y=g(x)$의 그래프가 된다. 두 함수 $y=f(x)$, $y=g(x)$의 그래프가 직선 $y=3$와 만나는 점을 각각 $A, B$라 할 때, 선분 $AB$의 중점의 좌표가 $(14, 3)$이다. 이 때, 실수 $a$의 값을 구하시오. [6점]
````

- **원본 `choices` (원순서):**

````text
NOT_PRESENT (서술/단답형)
````

- 원본 `answer`: `-1`
- **원본 `solution` 전체 (HTML/LaTeX 원형 유지):**

````text
$f^{-1}(x)=\log_3(x-2)+1$. 왼쪽 2, 위로 $a$만큼 이동하면 $g(x)=\log_3x+1+a$. $f(x)=3$에서 $A=(1,3)$, $g(x)=3$에서 $B=(3^{2-a},3)$. $(1+3^{2-a})/2=14$에서 $3^{2-a}=27$, 따라서 $a=-1$이다.
````

- **독립 검산·선지·경계 근거:** 역함수 log₃(x−2)+1, 왼쪽2 이동 후 g=log₃x+1+a. y3에서 xA=1,xB=3^{2−a}; 중점 x14→B=27→a=−1.
- **그림 실물 근거:** 별도 그림 없음
- **KEEP 판정:** 원문 정답·계산·조건·선지 일치, 표현상 차단 결함 미발견. `READ_EVIDENCED` · 운영 QA `NOT_RUN`.

## 수납·잔여

- 실제 원문 문항 22/22, 해설 22/22, 답 22/22 확인. 연결 이미지 10/10를 물리적 렌더 또는 PNG 육안으로 대조.
- 분류: KEEP 22, UPGRADE 0, HOLD 0, UNREAD 0. UPGRADE는 MD에만 개선안을 적었으며 해당 원본 파일을 아직 직접 수정하지 않음.
- 보류 이유: 없음. 학생 서비스 릴리즈·Golden/Negative preflight는 별도 작업으로 `NOT_RUN`.
