# 2022 22_매산고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2022`
- source: `archive/exams/original/high/h2/1mid/22_매산고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` · Git blob SHA `52e613e77cce60392de096100734c37ec6eeac8a`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/22_매산고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `20` · content/choices/answer/solution actual read: `20` · KEEP 19 · UPGRADE 1 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- scope: 원본 JS의 모든 문항 내용·보기·정답·기존 해설을 읽고 학생 재현성·정답 대응·조건을 검산했다. UPGRADE는 학생용 개선 해설 완성본을 아래에 작성했으며 원본 JS·메타·자산·main은 변경하지 않았다.

## 증거 및 검증 경계

- 근거: 작업 브랜치에서 직접 읽은 Git blob `52e613e77cce60392de096100734c37ec6eeac8a`, 각 문항 원문·기존 풀이 및 아래 독립 계산 메모.
- 실제 수행: 원격 JS 전 문항 파싱 및 내용 판독, 정답·계산·정의역·조건 비교, 원격 이미지 blob 존재 확인, 문제 PNG 실물 시각 판독(해당 문항별 기재).
- 미실행: 시험지 최종 화면 렌더/학생 DOM 출력 검사, SVG 렌더 이미지 전수 시각 QA, `preflight`, Golden/Negative, 배포 및 운영 인수. 모두 `NOT_RUN`이며 MD 초안 완료를 출고 PASS로 해석하지 않는다.
- 원본 JS의 일부 수식이 HTML로 표시되는 모습·Markdown 표/기호가 학생 브라우저에서 정상 출력되는지는 별도의 렌더 검증이 필요하다. 원본 표기 문제를 추정만으로 고치거나 품질 PASS로 기록하지 않는다.
- 참고 정본: 브랜치 내 `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`. 선행 감사가 인용한 `HARNESS_CURRENT.md`·`GLOBAL_QUEUE_CURRENT.md`·`DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md` 3개는 현재 브랜치의 해당 경로에 없어 재조회 `NOT_FOUND`.

## 실제 문제·해설 이미지 참조

- Q03 `assets/images/22_매산고_1학기_중간_고2_수학I/q03.png` · blob `730f7c46ac3fc150a7e0766e8d238118818373fe` · 원본 PNG 실제 시각 판독
- Q09 `assets/images/22_매산고_1학기_중간_고2_수학I/q09.png` · blob `60209586eaced70d05b84103c6cab2953d0ef29c` · 원본 PNG 실제 시각 판독
- Q09 `assets/images/22_매산고_1학기_중간_고2_수학I/q9-solution-v2.svg` · blob `8722b025ac2a0cfbdf66a811aa179273fc73351a` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN
- Q11 `assets/images/22_매산고_1학기_중간_고2_수학I/q11.png` · blob `9e08b4d1693d99bc0a582999eb6968a8c068105a` · 원본 PNG 실제 시각 판독
- Q12 `assets/images/22_매산고_1학기_중간_고2_수학I/q12-solution-v2.svg` · blob `8f1862843c41931400c88c7b3c316391e75667b7` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN
- Q14 `assets/images/22_매산고_1학기_중간_고2_수학I/q14.png` · blob `65341708f4cbd1678ded6486c462d7c50f62419d` · 원본 PNG 실제 시각 판독
- Q14 `assets/images/22_매산고_1학기_중간_고2_수학I/q14-solution-v2.svg` · blob `d3ffcaf7e788d20b3f7c4c97ba7a931fa4667ccb` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN
- Q15 `assets/images/22_매산고_1학기_중간_고2_수학I/q15-solution-v2.svg` · blob `9944b882b4af2e14acfc6115688ebf65a1b41cd5` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN
- Q18 `assets/images/22_매산고_1학기_중간_고2_수학I/q18-solution-v3.svg` · blob `2838404bfac87e87be3d7cab7dcdab4ee0b57109` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN
- Q20 `assets/images/22_매산고_1학기_중간_고2_수학I/q20-solution-v3.svg` · blob `1284cbdf41ef4293f09e474a5ecf43a63c049863` · SVG 실파일 존재 확인, 렌더 시각 판독 NOT_RUN

## 전 문항 원본-해설 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentity: `qid_v1_1a08c621ca05a4ad06370cf9e5094409571781e1569eb73bdc7b299cbee725eb` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `로그의 성질`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$\log_6 4 + \log_6 9$의 값은? [3.8점]
````

- 원본 선지(`choices` 원 순서):

````text
1. -2
2. -1
3. 0
4. 1
5. 2
````

- 원본 `answer`: `⑤`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p><b>1단계 · 로그 합치기</b> 같은 밑을 가진 로그의 합은 곱의 로그입니다. $\log_6 4+\log_6 9=\log_6(4\times9)=\log_6 36$입니다.</p><p><b>2단계 · 지수로 바꾸기</b> $36=6^2$이므로 $\log_6 36=2$입니다.</p><p>따라서 정답은 <b>⑤</b>입니다.</p></div>
````

- **독립 판독·정답 근거:** 로그의 곱법칙으로 log₆(4×9)=log₆36=2, ⑤와 일치한다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentity: `qid_v1_989f08e0d98929920eaca1f892c82c971ac7cd50e4028d97417f782ac5258b49` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수의 뜻과 성질`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$\sqrt[6]{4\sqrt{2\sqrt[3]{8}}} = 2^k$일 때, $k$의 값은? [3.9점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 2
2. 3
3. $\sqrt{2}$
4. $\sqrt{3}$
5. $\frac{1}{2}$
````

- 원본 `answer`: `⑤`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p><b>1단계 · 안쪽부터 계산</b> $\sqrt[3]{8}=2$이고, $\sqrt{2\sqrt[3]{8}}=\sqrt{2\cdot2}=2$입니다.</p><p><b>2단계 · 거듭제곱근을 지수로</b> 전체 식은 $\sqrt[6]{4\cdot2}=\sqrt[6]{8}=(2^3)^{\frac{1}{6}}=2^{\frac{1}{2}}$입니다.</p><p>따라서 $k=\frac12$이며 정답은 <b>⑤</b>입니다.</p></div>
````

- **독립 판독·정답 근거:** 안쪽 ∛8=2, 그다음 √(2×2)=2이므로 전체 ⁶√8=√2=2^(1/2), ⑤와 일치한다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentity: `qid_v1_e54a0228017360ffcff4ef032003e57daf908b95a10a9936200b95b219fb89bc` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수함수의 그래프`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
함수 $f(x)=3^x$와 $f(x)$의 역함수인 $g(x)$의 그래프가 그림과 같다.<br><div class="exam-img-box"><img src="assets/images/22_매산고_1학기_중간_고2_수학I/q03.png" class="exam-img" alt="증가하는 지수함수 f와 그 역함수 g의 그래프가 직선 y=x를 기준으로 서로 대칭이다. 안내선은 f의 x=1일 때 높이 3을 표시한다." data-archive-mobile-figure="true"></div><br>$f(2)+g(9)$의 값은? [3.9점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `④`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p><b>1단계 · 함수값</b> $f(x)=3^x$이므로 $f(2)=3^2=9$입니다.</p><p><b>2단계 · 역함수 관계</b> $f(2)=9$는 $g(9)=2$와 같은 뜻입니다. 역함수는 입력과 출력을 맞바꿉니다.</p><p><b>3단계 · 합 구하기</b> $f(2)+g(9)=9+2=11$이므로 정답은 <b>④</b>입니다.</p></div>
````

- **독립 판독·정답 근거:** f(2)=9이고 역함수 g(9)=2이므로 합은 11이다. q03.png에서 (1,3) 및 (1,0)의 대응 축을 판독했다.
- **그림 증거:** 문제 PNG 원본 판독.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentity: `qid_v1_aa853f9c074c72b8ae3877b6f8989485ce86294c9373a23957e4663b241f376d` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `삼각함수의 관계`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$\sin\left(\frac{\pi}{2}-\theta\right)\cos(2\pi-\theta) - \sin\left(\frac{\pi}{2}+\theta\right)\cos(\pi+\theta)$를 간단히 하면? [3.8점]
````

- 원본 선지(`choices` 원 순서):

````text
1. $\sin\theta$
2. $-\cos\theta$
3. $2\sin^2\theta$
4. $2\cos^2\theta$
5. $\tan^2\theta$
````

- 원본 `answer`: `④`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>각을 바꾸는 삼각함수의 성질을 먼저 적용한다.</p><p>$\sin(\frac\pi2-\theta)=\cos\theta$, $\cos(2\pi-\theta)=\cos\theta$이다.</p><p>또 $\sin(\frac\pi2+\theta)=\cos\theta$, $\cos(\pi+\theta)=-\cos\theta$이다.</p><p>따라서 주어진 식은</p><p>$\cos\theta\cdot\cos\theta-\cos\theta\cdot(-\cos\theta)$</p><p>$=\cos^2\theta+\cos^2\theta=2\cos^2\theta$이다.</p><p>정답은 ④이다.</p></div>
````

- **독립 판독·정답 근거:** 삼각함수 보각·주기 관계로 cos²θ−cosθ(−cosθ)=2cos²θ, ④가 맞다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentity: `qid_v1_4ee65955cdb1008c24dbb80ae4bd1eb93b55341763dac72a287ce23ab8bf94a5` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `삼각함수의 뜻과 값`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$\theta$가 제3사분면의 각이고 $\tan\theta = \frac{3}{4}$일 때, $\cos\theta$의 값은? [4.0점]
````

- 원본 선지(`choices` 원 순서):

````text
1. $-\frac{4}{5}$
2. $-\frac{3}{5}$
3. $-\frac{3}{4}$
4. $\frac{3}{5}$
5. $\frac{4}{5}$
````

- 원본 `answer`: `①`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>제3사분면에서는 $\sin\theta$와 $\cos\theta$가 모두 음수이므로 $\tan\theta$는 양수이다.</p><p>$\tan\theta=\frac34$이므로 직각삼각형의 두 직각변 길이를 $3,4$로 생각하면 빗변은 $5$이다.</p><p>$|\cos\theta|=\frac45$이고 제3사분면에서 $\cos\theta&lt;0$이다.</p><p>따라서 $\cos\theta=-\frac45$이므로 정답은 ①이다.</p></div>
````

- **독립 판독·정답 근거:** 제3사분면에서 cosθ<0이며 tanθ=3/4이면 기준 직각삼각형은 3-4-5이므로 −4/5, ①이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentity: `qid_v1_53c6695ef8cce867803185633f709b92c0f7fbf74c23267c2eb9ee8dd0143763` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `거듭제곱근`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
n이 2 이상의 자연수일 때, 다음 보기 중 옳은 것만을 있는 대로 고른 것은? [4.2점]<br><b>&lt;보기&gt;</b><br>ㄱ. $n$이 홀수일 때, 양의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\sqrt[n]{a}, -\sqrt[n]{a}$이다.<br>ㄴ. $n$이 홀수일 때, 음의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\sqrt[n]{a}$이다.<br>ㄷ. $n$이 짝수일 때, 양의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\sqrt[n]{a}$이다.<br>ㄹ. $n$이 짝수일 때, 음의 실수 $a$의 $n$제곱근 중에서 실수는 존재하지 않는다.
````

- 원본 선지(`choices` 원 순서):

````text
1. ㄱ, ㄴ
2. ㄱ, ㄷ
3. ㄱ, ㄹ
4. ㄴ, ㄷ
5. ㄴ, ㄹ
````

- 원본 `answer`: `⑤`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$x^n=a$의 실수해가 몇 개인지 $n$의 홀짝과 $a$의 부호에 따라 판단한다.</p><p>ㄱ. $n$이 홀수이고 $a&gt;0$이면 실수해는 양수 $\sqrt[n]a$ 하나이다. 음수는 해가 아니므로 거짓이다.</p><p>ㄴ. $n$이 홀수이고 $a&lt;0$이면 실수해는 음수 $\sqrt[n]a$ 하나이므로 참이다.</p><p>ㄷ. $n$이 짝수이고 $a&gt;0$이면 실수해는 $\pm\sqrt[n]a$ 두 개이므로 거짓이다.</p><p>ㄹ. $n$이 짝수이면 $x^n\ge0$이므로 $a&lt;0$일 때 실수해가 없다. 참이다.</p><p>따라서 옳은 것은 ㄴ, ㄹ이고 정답은 ⑤이다.</p></div>
````

- **독립 판독·정답 근거:** 홀수 차수 음수 피제곱수의 실근은 하나, 짝수 차수 음수는 실근 없음이다. ㄴ·ㄹ만 참으로 ⑤이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentity: `qid_v1_49401238f79aa40213f57321e5b7b6dedde7daf865402f871f70ff98115aa3e9` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `로그의 성질`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
세 양수 $a, b, c$ ($a \ne 1$)이 $\log_a bc = 3$, $\log_a b - \log_a c = 1$, $\log_a \frac{b+c}{3} = 1$을 만족시킬 때, $ab+c$의 값을 구하면? [4.3점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `③`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$u=\log_a b$, $v=\log_a c$로 두어 로그 조건을 연립방정식으로 바꾼다.</p><p>$\log_a(bc)=u+v=3$, $u-v=1$이므로 $u=2$, $v=1$이다.</p><p>따라서 $b=a^2$, $c=a$이다.</p><p>남은 조건 $\log_a\frac{b+c}{3}=1$은 $\frac{b+c}{3}=a$를 뜻한다.</p><p>$\frac{a^2+a}{3}=a$에서 $a^2-2a=0$, 즉 $a(a-2)=0$이다.</p><p>밑 $a$는 양수이고 $1$이 아니므로 $a=2$이다.</p><p>$b=4$, $c=2$이므로 $ab+c=2\times4+2=10$이다.</p><p>따라서 정답은 ③이다.</p></div>
````

- **독립 판독·정답 근거:** u=logₐb, v=logₐc로 두면 (u,v)=(2,1), b=a²,c=a. (a²+a)/3=a에서 a=2, ab+c=10이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentity: `qid_v1_db59d3ffeacedaf2516e4132ee9cfe24cc542f875a9798de54b84de583c342fe` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `로그방정식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
방정식 $\log_3 x - \log_x 27 = 2$의 두 근의 곱은? [4.4점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 3
2. 9
3. 27
4. 81
5. 243
````

- 원본 `answer`: `②`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>로그의 밑 조건으로 $x&gt;0$, $x\ne1$이다.</p><p>$t=\log_3 x$로 놓으면 $t\ne0$이고 밑변환에 의해 $\log_x27=\frac{3}{t}$이다.</p><p>주어진 식은 $t-\frac3t=2$이므로 $t^2-2t-3=0$이다.</p><p>$(t-3)(t+1)=0$에서 $t=3$ 또는 $t=-1$이다.</p><p>따라서 $x=3^3=27$ 또는 $x=3^{-1}=\frac13$이다. 두 값 모두 밑 조건을 만족한다.</p><p>두 근의 곱은 $27\times\frac13=9$이므로 정답은 ②이다.</p></div>
````

- **독립 판독·정답 근거:** t=log₃x로 치환하면 (t−3)(t+1)=0, x∈{27,1/3}; 곱 9로 ②이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentity: `qid_v1_7a93a0760c9e4b0f9de6b8f2ea243da973f025be568bbbab998e27822a5cba68` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수부등식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
이차함수 $y=f(x)$의 그래프와 일차함수 $y=g(x)$의 그래프가 그림과 같을 때, 부등식 $\left(\frac{1}{3}\right)^{-f(x)g(x)} \le 9^{2g(x)}$을 만족시키는 모든 자연수 $x$ 값의 합은? [4.4점]<br><div class="exam-img-box"><img src="assets/images/22_매산고_1학기_중간_고2_수학I/q09.png" class="exam-img" alt="아래로 열린 포물선 f와 감소하는 직선 g가 있다. 포물선은 높이 4의 안내선과 x=4,6에서 만나고, 직선은 가로축과 x=5에서 만난다." data-archive-mobile-figure="true"></div>
````

- 원본 선지(`choices` 원 순서):

````text
1. 19
2. 20
3. 21
4. 22
5. 23
````

- 원본 `answer`: `③`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>밑을 모두 $3$으로 바꾸어 지수끼리 비교한다.</p><p>$\left(\frac13\right)^{-f(x)g(x)}=3^{f(x)g(x)}$, $9^{2g(x)}=3^{4g(x)}$이다.</p><p>$3&gt;1$이므로 부등식은 $f(x)g(x)\le4g(x)$, 즉 $g(x)(f(x)-4)\le0$이다.</p><p>그림에서 $g(5)=0$, $x&lt;5$일 때 $g(x)&gt;0$, $x&gt;5$일 때 $g(x)&lt;0$이다.</p><p>또 포물선은 $f(4)=f(6)=4$이고 $4&lt;x&lt;6$에서 $f(x)&gt;4$, 그 밖에서 $f(x)\le4$이다.</p><p>따라서 자연수 해는 $x=1,2,3,4,5,6$이다. 특히 $x=5$는 $g(x)=0$이므로 포함한다.</p><p>합은 $1+2+3+4+5+6=21$이다. 정답은 ③이다.</p></div>
````

- **독립 판독·정답 근거:** 3을 밑으로 통일하면 g(x)(f(x)−4)≤0. 그림에서 g의 영점 5, f=4의 교점 4·6을 확인하여 자연수 1~6, 합 21이다.
- **그림 증거:** 문제 PNG 원본 판독 / SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentity: `qid_v1_610293074afc8b6682b0378c12c001561fdfb26db43a8131c8accdefc4098169` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수법칙`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$a>0$이고, $a^x+a^{-x}=3$일 때, $\frac{a^{2x}+1}{a^{3x}+a^{-x}}=\frac{q}{p}$이다. 이때 $p-q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [4.5점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 4
2. 5
3. 6
4. 7
5. 8
````

- 원본 `answer`: `①`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$t=a^x&gt;0$으로 두면 $t+\frac1t=3$이다.</p><p>양변에 $t$를 곱하면 $t^2+1=3t$이다.</p><p>주어진 분수는 $\frac{t^2+1}{t^3+t^{-1}}=\frac{t(t^2+1)}{t^4+1}$이다.</p><p>$t^4+1=(t^2+1)^2-2t^2=(3t)^2-2t^2=7t^2$이다.</p><p>따라서 분수는 $\frac{t\cdot3t}{7t^2}=\frac37$이다.</p><p>서로소인 자연수 $p=7$, $q=3$이므로 $p-q=4$이다. 정답은 ①이다.</p></div>
````

- **독립 판독·정답 근거:** t=aˣ>0, t²+1=3t와 t⁴+1=7t²를 연립하여 분수 3/7; p−q=4로 ①이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentity: `qid_v1_11cea9c055972be5da85025d4a9e00cd435a5e0e2005f61643c428490149ffee` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `삼각함수의 그래프`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
함수 $y=a\sin bx - c$의 그래프가 그림과 같을 때, 상수 $a+b+c$의 값은? (단, $a>0, b>0, c>0$) [4.6점]<br><div class="exam-img-box"><img src="assets/images/22_매산고_1학기_중간_고2_수학I/q11.png" class="exam-img" alt="사인곡선의 가장 높은 위치는 y=0, 가장 낮은 위치는 y=−2이고 중심선은 y=−1이다. 중심선을 아래에서 위로 지나는 x좌표는 −2π/3, 0, 2π/3이다." data-archive-mobile-figure="true"></div>
````

- 원본 선지(`choices` 원 순서):

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `⑤`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>그래프의 최댓값은 $0$, 최솟값은 $-2$이므로 진폭은 $\frac{0-(-2)}2=1$이다.</p><p>$a&gt;0$이므로 $a=1$이다. 중심선은 $y=\frac{0+(-2)}2=-1$이므로 $c=1$이다.</p><p>그래프가 중심선을 위로 통과하는 점은 $x=-\frac{2\pi}{3},0,\frac{2\pi}{3}$으로 연속한다.</p><p>따라서 주기는 $\frac{2\pi}{3}$이고 $\frac{2\pi}{b}=\frac{2\pi}{3}$에서 $b=3$이다.</p><p>$a+b+c=1+3+1=5$이므로 정답은 ⑤이다.</p></div>
````

- **독립 판독·정답 근거:** q11.png에서 최고 0·최저 −2, 중심선 −1, 주기 2π/3을 판독하였으므로 a=1,b=3,c=1, 합 5이다.
- **그림 증거:** 문제 PNG 원본 판독.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentity: `qid_v1_e7623d097cd0f6b5e53c9e4319182af376eee9f655300d85f30f844f65a177f6` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `삼각부등식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
$0 \le x < 2\pi$에서 연립부등식 $\begin{cases} 2\sin^2 x - 7\cos x + 2 \ge 0 \\ \sin x \le \cos x \end{cases}$의 해를 $\alpha \le x \le \beta$라 할 때, $\alpha \times \beta$의 값은? [4.7점]
````

- 원본 선지(`choices` 원 순서):

````text
1. $\frac{5}{6}\pi^2$
2. $\frac{5}{4}\pi^2$
3. $\frac{5}{3}\pi^2$
4. $\frac{25}{12}\pi^2$
5. $\frac{55}{24}\pi^2$
````

- 원본 `answer`: `④`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>먼저 첫 번째 부등식을 $\cos x$만으로 정리한다.</p><p>$2\sin^2x-7\cos x+2\ge0$에서 $\sin^2x=1-\cos^2x$를 대입하면</p><p>$4-2\cos^2x-7\cos x\ge0$, 즉 $2\cos^2x+7\cos x-4\le0$이다.</p><p>$(2\cos x-1)(\cos x+4)\le0$이고 $\cos x+4&gt;0$이므로 $\cos x\le\frac12$이다.</p><p>$0\le x&lt;2\pi$에서 이는 $\frac\pi3\le x\le\frac{5\pi}3$이다.</p><p>둘째 조건 $\sin x\le\cos x$는 $\sqrt2\sin(x-\frac\pi4)\le0$과 같아</p><p>$0\le x\le\frac\pi4$ 또는 $\frac{5\pi}4\le x&lt;2\pi$이다.</p><p>두 조건의 공통 구간은 $\frac{5\pi}4\le x\le\frac{5\pi}3$이다.</p><p>따라서 $\alpha\beta=\frac{5\pi}4\cdot\frac{5\pi}3=\frac{25}{12}\pi^2$이므로 정답은 ④이다.</p></div>
````

- **독립 판독·정답 근거:** 첫째 조건은 cos x≤1/2, 둘째 조건은 sin x≤cos x. 교집합 [5π/4,5π/3]의 끝점 곱은 25π²/12이다.
- **그림 증거:** SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentity: `qid_v1_79478827707ef0ee2ab2d5a1c95d6177120cc2466c100f8f590965ae01c61d12` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수방정식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
방정식 $4^x+3^{-2y}=119+4\times 2^{x+1}+2\times 3^{1-y}$을 만족시키는 실수 $x, y$에 대하여 $x$의 최댓값을 $\alpha$, $y$의 최솟값을 $\beta$라 할 때, $(\alpha-1)^{-\beta}$의 값은? [4.8점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 12
2. 15
3. 18
4. 21
5. 24
````

- 원본 `answer`: `②`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$u=2^x&gt;0$, $v=3^{-y}&gt;0$으로 치환하면 $4^x=u^2$, $3^{-2y}=v^2$이다.</p><p>또 $4\cdot2^{x+1}=8u$, $2\cdot3^{1-y}=6v$이므로</p><p>$u^2+v^2=119+8u+6v$이다.</p><p>완전제곱식으로 바꾸면 $(u-4)^2+(v-3)^2=144$이다.</p><p>원의 반지름이 $12$이므로 $u$의 최댓값은 $4+12=16$이고, $v$의 최댓값은 $3+12=15$이다. 두 점은 모두 $u&gt;0,v&gt;0$을 만족한다.</p><p>$u=2^x$는 증가함수이므로 $x$의 최댓값은 $\alpha=\log_2 16=4$이다.</p><p>$v=3^{-y}$는 $y$가 작을수록 크므로 $y$의 최솟값은 $\beta=-\log_3 15$이다.</p><p>따라서 $(\alpha-1)^{-\beta}=3^{\log_3 15}=15$이므로 정답은 ②이다.</p></div>
````

- **독립 판독·정답 근거:** u=2ˣ, v=3^(−y)로 두면 (u−4)²+(v−3)²=144, 각 좌표 양수에서 u_max=16,v_max=15; α=4,β=−log₃15이므로 15이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentity: `qid_v1_755aec680c5f446b7fb57e454c5b45d42f04047f64ecf3f42fd2d035efb0f123` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `로그의 성질`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
아래 그림과 같이 두 변 $\mathrm{AB, CD}$가 서로 평행한 사다리꼴 $\mathrm{ABCD}$에서 $\overline{\mathrm{AB}}=6, \overline{\mathrm{CD}}=4$이다. 사다리꼴 $\mathrm{ABCD}$의 두 대각선이 만나는 점을 점 $\mathrm{P}$라 할 때, $\overline{\mathrm{AP}}=\log_a b, \overline{\mathrm{BP}}=\log_c b$이고 $\overline{\mathrm{BP}}:\overline{\mathrm{CP}}=2:1$이다. $\log_a c + k\log_c a > 6$이 되도록 하는 정수 $k$의 최솟값은? (단, $a, c$는 1이 아닌 양수이다.) [4.8점]<br><div class="exam-img-box"><img src="assets/images/22_매산고_1학기_중간_고2_수학I/q14.png" class="exam-img" alt="사다리꼴 ABCD에서 아래쪽 밑변 AB의 길이는 6, 평행한 위쪽 밑변 CD의 길이는 4이다. 대각선 AC와 BD의 교점이 P이다." data-archive-mobile-figure="true"></div>
````

- 원본 선지(`choices` 원 순서):

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `④`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>사다리꼴의 두 밑변 $AB\parallel CD$이므로 $\triangle APB$와 $\triangle CPD$는 닮음이다.</p><p>따라서 $AP:PC=AB:CD=6:4=3:2$이다.</p><p>문제에서 $BP:CP=2:1$이므로 $BP/AP=(2CP)/(\frac32CP)=\frac43$이다.</p><p>$AP=\log_a b$, $BP=\log_c b$이므로</p><p>$\frac{\log_c b}{\log_a b}=\log_c a=\frac43$이다. 길이인 두 로그는 양수이므로 나눗셈이 가능하다.</p><p>역수 관계에서 $\log_a c=\frac34$이다.</p><p>따라서 $\log_a c+k\log_c a&gt;6$은 $\frac34+\frac{4k}{3}&gt;6$이다.</p><p>양변에 $12$를 곱하면 $9+16k&gt;72$, 즉 $k&gt;\frac{63}{16}$이다.</p><p>이를 만족하는 가장 작은 정수는 $k=4$이므로 정답은 ④이다.</p></div>
````

- **독립 판독·정답 근거:** q14.png에서 밑변 6:4에 따른 대각선 분할 AP:PC=3:2를 판독했다. BP:CP=2:1에서 log_c a=4/3, log_a c=3/4, k>63/16이므로 최소 4이다.
- **그림 증거:** 문제 PNG 원본 판독 / SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentity: `qid_v1_b9189da5ce49491d9a8e92b5edff758741f824f0e07e2de78ab00c7ca7db6fbf` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `객관식`; 단원: `지수함수의 활용`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
0 \le x \le 4까지 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.<br>(가) 함수 $f(x) = \begin{cases} 2^x - 1 + n & (0 \le x \le 1) \\ \log_2(3-x) + n & (1 < x \le 2) \end{cases}$<br>(나) $2\le x\le4$인 모든 실수 $x$에 대해 $f(x)=f(x-2)$<br><br>함수 $f(x)$의 그래프와 $x$축, $y$축 및 직선 $x=4$로 둘러싸인 부분의 넓이가 42이 되도록 하는 모든 정수 $n$의 값의 곱을 $K$라고 할 때, $\frac{|K|}{10}$의 값은? [4.9점]
````

- 원본 선지(`choices` 원 순서):

````text
1. 11
2. 12
3. 13
4. 14
5. 15
````

- 원본 `answer`: `①`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>길이 $2$인 한 주기의 그래프와 $x$축 사이 넓이를 먼저 구한다.</p><p>$0\le x\le1$에서 $h(x)=2^x-1$은 $(0,0)$에서 $(1,1)$로 증가한다.</p><p>$1\le x\le2$의 $h(x)=\log_2(3-x)$를 $u=2-x$로 좌우 반사하면 $y=\log_2(1+u)$가 된다.</p><p>이것은 $y=2^u-1$의 역함수이다. 서로 역함수인 두 그래프가 단위 정사각형에서 나누는 두 넓이의 합은 $1$이다.</p><p>따라서 한 주기에서 $h$와 $x$축 사이의 넓이는 $1$이고, 전체 $0\le x\le4$에서는 같은 모양이 두 번 나타난다.</p><p>$h$의 최솟값은 $0$, 최댓값은 $1$이다.</p><p>$n\ge0$이면 그래프가 $x$축 위에 있어 한 주기 넓이는 $2n+1$이다. 전체 넓이 $42$이므로 $2(2n+1)=42$, $n=10$이다.</p><p>$n\le-1$이면 그래프가 $x$축 아래에 있어 한 주기 넓이는 $-(2n+1)$이다. 따라서 $-2(2n+1)=42$, $n=-11$이다.</p><p>그 밖의 정수 $n$은 없다. 모든 정수 $n$의 곱은 $K=10(-11)=-110$이다.</p><p>따라서 $|K|/10=11$이고 정답은 ①이다.</p></div>
````

- **독립 판독·정답 근거:** 한 주기 기초 도형의 넓이는 역함수 관계로 1이고 0~4에는 두 주기가 있다. n=10 또는 −11의 곱 −110에서 |K|/10=11이다.
- **그림 증거:** SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentity: `qid_v1_b2e023ace53689cfd43077b16e63a6c3a472207b860daa6de23c1b7157414528` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `서술형`; 단원: `지수법칙`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
※ 단답형 문제의 답은 OCR카드 앞면 답란에, 서술형 문제의 풀이와 답은 서답형 답란(뒷면)에 반드시 흑색 또는 청색 볼펜으로 작성하세요.<br><br>&lt;단답형 1&gt; $(2^{3+\sqrt{3}} + 2^{3-\sqrt{3}})^2 - (2^{3+\sqrt{3}} - 2^{3-\sqrt{3}})^2$을 간단히 하시오. [4점]
````

- 원본 선지(`choices` 원 순서):

````text
해당 없음 (원본 배열 비어 있음)
````

- 원본 `answer`: `256`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$(A+B)^2-(A-B)^2=4AB$를 이용하면 복잡한 무리수 지수가 서로 없어지게 된다.</p><p>$A=2^{3+\sqrt3}$, $B=2^{3-\sqrt3}$로 두면</p><p>$(A+B)^2-(A-B)^2=4AB$이다.</p><p>$AB=2^{3+\sqrt3}\cdot2^{3-\sqrt3}=2^{6}=64$이므로</p><p>$4AB=4\times64=256$이다.</p><p>따라서 답은 $256$이다.</p></div>
````

- **독립 판독·정답 근거:** 제곱의 차 4AB와 AB=2^(3+√3+3−√3)=2⁶를 적용하면 4×64=256이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentity: `qid_v1_21f116bfb700827c46002f6a81e8068016781256058d4f6f89c9d52493b6c039` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `서술형`; 단원: `삼각방정식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
&lt;단답형 2&gt; $0 \le x < 2\pi$일 때, 방정식 $\sin^2 x + 4\cos x + k = 0$이 실근을 갖도록 하는 실수 $k$값의 범위를 구하시오. [5점]
````

- 원본 선지(`choices` 원 순서):

````text
해당 없음 (원본 배열 비어 있음)
````

- 원본 `answer`: `$-4\le k\le4$`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$\sin^2x=1-\cos^2x$를 사용해 $u=\cos x$로 치환한다.</p><p>$0\le x&lt;2\pi$에서 $-1\le u\le1$이고 모든 $u$값이 실제로 가능하다.</p><p>주어진 방정식은 $1-u^2+4u+k=0$이므로 $k=u^2-4u-1$이다.</p><p>$u^2-4u-1=(u-2)^2-5$이고 $-1\le u\le1$에서는 감소한다.</p><p>$u=-1$일 때 $k=1+4-1=4$, $u=1$일 때 $k=1-4-1=-4$이다.</p><p>끝값도 각각 $x=\pi$, $x=0$에서 가능하다.</p><p>따라서 실근이 존재할 조건은 $-4\le k\le4$이다.</p></div>
````

- **독립 판독·정답 근거:** u=cos x∈[−1,1], k=u²−4u−1은 이 구간에서 감소하여 양 끝 k∈[−4,4]이다.
- **그림 증거:** 별도 자산 없음.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentity: `qid_v1_4f595f3dabe33f7697c1a891c6dde572880f109e3c1df4ed4d304d1285c805e6` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `서술형`; 단원: `삼각방정식`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
&lt;단답형 3&gt; $-1 < t < 1$인 실수 $t$에 대하여 $x$에 대한 방정식 $\sin\frac{\pi}{8}x=t$ ($0 \le x < 16$)의 두 실근의 차를 $f(t)$라 하고, $x$에 대한 방정식 $\cos\frac{\pi}{8}x=t$ ($0 \le x < 16$)의 두 실근의 차를 $g(t)$라 하자. $g(t)-f(t)$의 값 중에서 가장 큰 자연수를 $m$이라 할 때, $1 \le n \le m$인 자연수 $n$에 대하여 $g(t)-f(t)=n$을 만족시키는 $t$의 값을 $a_n$이라 하자.<br><br>(1) $m$의 값을 구하시오. [3점]<br>(2) ${a_1}^2+{a_2}^2+\cdots+{a_m}^2$의 값을 $S$라고 할 때, $8S$의 값을 구하시오. [3점]
````

- 원본 선지(`choices` 원 순서):

````text
해당 없음 (원본 배열 비어 있음)
````

- 원본 `answer`: `(1) 15; (2) 60`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>각을 $\theta=\frac\pi8x$로 바꾸면 $0\le\theta&lt;2\pi$이다.</p><p>$\sin a=t$를 만족하는 $-\frac\pi2&lt;a&lt;\frac\pi2$인 각 $a$를 정한다.</p><p>먼저 $t&gt;0$이면 $\sin\theta=t$의 두 해는 $\theta=a,\pi-a$이므로 $f(t)=\frac8\pi(\pi-2a)=8-\frac{16a}\pi$이다.</p><p>$\cos\theta=t$의 두 해는 $\theta=\frac\pi2-a,\frac{3\pi}2+a$이므로 $g(t)=8+\frac{16a}\pi$이다.</p><p>따라서 $t&gt;0$에서 $g(t)-f(t)=\frac{32a}\pi$이고 $0&lt;a&lt;\frac\pi2$이므로 $0&lt;g(t)-f(t)&lt;16$이다.</p><p>$t&lt;0$이면 $\sin\theta=t$의 두 해는 $\theta=\pi-a,2\pi+a$이므로 $f(t)=8+\frac{16a}\pi$이다. 이때도 $g(t)=8+\frac{16a}\pi$이므로 차는 $0$이다. $t=0$일 때도 차는 $0$이다.</p><p>(1) 차가 될 수 있는 가장 큰 자연수는 $m=15$이다.</p><p>(2) $g(t)-f(t)=n$ ($1\le n\le15$)에서 $a=\frac{n\pi}{32}$, 따라서 $a_n=t=\sin\frac{n\pi}{32}$이다.</p><p>$S=\sum_{n=1}^{15}\sin^2\frac{n\pi}{32}$이다.</p><p>$\sin^2\theta+\cos^2\theta=1$과 $\sin\frac{(16-n)\pi}{32}=\cos\frac{n\pi}{32}$을 이용하면</p><p>각 $n$과 $16-n$의 항을 짝지으면 제곱의 합이 $1$인 쌍이 $7$개이고, 가운데 $n=8$의 값은 $\sin^2(\pi/4)=\frac12$이다.</p><p>따라서 $S=7+\frac12=\frac{15}{2}$이다.</p><p>따라서 $8S=8\cdot\frac{15}{2}=60$이다.</p></div>
````

- **독립 판독·정답 근거:** t>0은 arcsin t=a∈(0,π/2)로 놓으면 g−f=32a/π∈(0,16), t≤0이면 0이다. 정수값 n=1~15, ∑sin²(nπ/32)=15/2이므로 8S=60이다.
- **그림 증거:** SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

### Q19 — UPGRADE

- source ordinal/id: `19` / `19`; sourceIdentity: `qid_v1_cc497c931a4126a236c34888c9fe939aca1f8fec2b4546c1a92f3ce783552bb3` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `서술형`; 단원: `상용로그`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
※ 서술형문제는 답만 기재할 경우 0점 처리합니다.<br><br>&lt;서술형 1&gt; $15^9$의 자리의 수를 $a$, 최고 자리의 숫자를 $b$라 할 때, 다음 물음에 답하시오. [총 10점]<br>(단, $\log 2=0.301, \log 3=0.477$로 계산한다.)<br><br>(1) $\log 15^9$의 값을 구하시오. [3점]<br>(2) $a$의 값을 구하시오. [3점]<br>(3) $b$의 값을 구하시오. [3점]<br>(4) $a-b$의 값을 구하시오. [1점]
````

- 원본 선지(`choices` 원 순서):

````text
해당 없음 (원본 배열 비어 있음)
````

- 원본 `answer`: `(1) 10.584; (2) 11; (3) 3; (4) 8`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>상용로그의 성질과 주어진 근삿값을 차례로 사용한다.</p><p>(1) $\log15=\log(3\cdot5)=\log3+\log5$이다.</p><p>$\log5=1-\log2=0.699$이므로 $\log15=0.477+0.699=1.176$이다.</p><p>따라서 $\log15^9=9\times1.176=10.584$이다.</p><p>(2) $10^{10}&lt;15^9&lt;10^{11}$이므로 $15^9$는 $11$자리 자연수이다. 따라서 $a=11$이다.</p><p>(3) $15^9=10^{10.584}=10^{10}\cdot10^{0.584}$이다. $10^{0.584}$는 $3$ 이상 $4$ 미만이므로 최고 자리 숫자는 $b=3$이다. 실제 $15^9=38443359375$이다.</p><p>(4) 따라서 $a-b=11-3=8$이다.</p></div>
````

- **독립 판독·정답 근거:** 상용로그 근삿값으로 log15=0.477+(1−0.301)=1.176, 9배=10.584, 자리수 11을 얻는다. 최고자리 판단은 log3=0.477<0.584<log4=0.602를 직접 대조해야 한다.
- **그림 증거:** 별도 자산 없음.
- **UPGRADE 이유:** 기존 풀이의 근거·학생 재현성 개선이 필요함. 수학적 결론 및 원본 정답을 보존한 완성 대안은 아래와 같다.

**학생용 개선 해설 (MD 후보; JS 미반영):**

상용로그로 자리수를 판단한다.
$\log 5=1-\log 2=0.699$이므로 $\log 15=\log3+\log5=0.477+0.699=1.176$이다.
따라서 (1) $\log15^9=9\times1.176=10.584$이다.
(2) $10^{10}<15^9<10^{11}$이므로 자리수 $a=11$이다.
(3) $15^9=10^{10}\cdot10^{0.584}$이다. 주어진 근삿값으로 $\log3=0.477$이고 $\log4=2\log2=0.602$이므로 $0.477<0.584<0.602$, 즉 $3<10^{0.584}<4$이다. 따라서 최고 자리 숫자는 $b=3$이다.
(4) $a-b=11-3=8$이다.
정답: (1) $10.584$, (2) $11$, (3) $3$, (4) $8$.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentity: `qid_v1_5546de92fbb1a66b01488b09d4c4f3714cd1a923d03584330a0e62bb49ffaf1f` · origin blob `52e613e77cce60392de096100734c37ec6eeac8a`
- 유형: `서술형`; 단원: `지수함수의 활용`; 교육과정: `수학I`
- 원본 발문·조건(`content` 그대로):

````text
&lt;서술형 2&gt; 좌표평면에서 점 $(t, r^t)$에서만 만나는 두 곡선 $y=r^x, y=\log_r x$ ($r \ne 1, r > 0$)에 대하여 함수 $f(x)$를 $$f(x)=\begin{cases} r^x & (x < t) \\ \log_r x & (x \ge t) \end{cases}$$라 하자. 함수 $g(x)=f(x)-2t$의 그래프와 그 역함수 $y=g^{-1}(x)$의 그래프가 서로 다른 세 점에서 만난다. 만나는 서로 다른 세 점의 $x$좌표가 $\alpha, \beta, t$ ($\alpha < \beta < t$)일 때, $6 \times \left| g\left(\frac{1}{\alpha}\right) \times g\left(\frac{1}{\alpha^2}\right) \right|$의 값을 구하시오. (단, $\alpha$는 상수이다.) [10점]
````

- 원본 선지(`choices` 원 순서):

````text
해당 없음 (원본 배열 비어 있음)
````

- 원본 `answer`: `56`
- 원본 `solution` (전문, HTML/LaTeX 포함):

````text
<div class="small-board"><p>$y=r^x$와 그 역함수 $y=\log_r x$의 교점은 직선 $y=x$에 대하여 대칭이다.</p><p>교점이 단 하나뿐이므로 그 점은 대칭축 위에 있어야 한다. 따라서 $t=r^t&gt;0$이다.</p><p>함수 $g(x)=f(x)-2t$에서 $g(t)=t-2t=-t$이다.</p><p>문제에 $x=t$가 $g$와 $g^{-1}$의 교점의 $x$좌표로 주어졌으므로 $g^{-1}(t)=-t$, 즉 $g(-t)=t$이다.</p><p>$-t&lt;t$이므로 $g(-t)=r^{-t}-2t=\frac1t-2t$이다.</p><p>따라서 $\frac1t-2t=t$, $3t^2=1$에서 $t=\frac1{\sqrt3}$이다.</p><p>이때 $0&lt;t&lt;1$이므로 $r&lt;1$이다. $g$는 연속인 감소함수이고 $g(-t)=t$, $g(t)=-t$이므로 교점의 두 $x$좌표는 $-t,t$로 짝을 이룬다.</p><p>나머지 한 교점은 $g(x)=x$인 고정점으로 $-t$와 $t$ 사이에 하나 존재한다. 따라서 $\alpha=-t=-\frac1{\sqrt3}$이다.</p><p>$\frac1\alpha=-\sqrt3=-3t$, $\frac1{\alpha^2}=3$이다.</p><p>$g(-\sqrt3)=r^{-3t}-2t=(r^t)^{-3}-2t=t^{-3}-2t=3\sqrt3-\frac2{\sqrt3}=\frac7{\sqrt3}$이다.</p><p>또 $r^t=t$에서 $\log_r t=t$이므로 $\log_r3=\log_r(t^{-2})=-2t=-\frac2{\sqrt3}$이다.</p><p>$3&gt;t$이므로 $g(3)=\log_r3-2t=-\frac4{\sqrt3}$이다.</p><p>따라서 $6|g(1/\alpha)g(1/\alpha^2)|=6\left|\frac7{\sqrt3}\cdot\left(-\frac4{\sqrt3}\right)\right|=56$이다.</p></div>
````

- **독립 판독·정답 근거:** 교점이 하나인 역함수 그래프의 교점은 (t,t), rᵗ=t. 역그래프와 g의 교점 t 조건에서 g(−t)=t, 3t²=1, α=−1/√3, g(−√3)=7/√3, g(3)=−4/√3이므로 6×28/3=56이다.
- **그림 증거:** SVG blob 확인, 시각 렌더 NOT_RUN.
- **KEEP 이유:** 기존 해설의 핵심 등식·조건·정답을 위와 같이 직접 대조했으며 실질적 수학 오류 또는 필수 논리 생략을 발견하지 못함. 최종 학생 화면 QA는 `NOT_RUN`.

## 시험지 단위 마감 및 후속 경계

- 20/20 원본 문항 읽기 완료, KEEP 19 / UPGRADE 1 / HOLD 0 / UNREAD 0.
- 개선 제안 1개는 이 MD에 완결된 학생용 문장으로 작성함. JS에 자동 이식되거나 운영 적용된 것은 아님.
- 그림 자산 10개 링크 확인; PNG 4개 직접 시각 판독, SVG는 출처·파일 존재를 확인했으나 시각 렌더 미실행.
- 다음 단계: 원본 JS에 승인된 핀포인트 이식, 필수 SVG 렌더·Golden/Negative·출고/등록은 별도 작업 범위로 남는다. `QA_NOT_RUN`.
