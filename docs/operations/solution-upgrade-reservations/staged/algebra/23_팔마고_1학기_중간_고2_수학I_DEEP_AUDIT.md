# 2023 23_팔마고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_팔마고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `cd58f58b29534ed05890805ee717637ac080dbcc`
- standardCourse: `수학I`; `standardCourse` 누락 0/22, `category` 누락 0/22, `questionType` 누락·공란 0/22
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_팔마고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS에 수록된 22문항의 `content`·`choices`·`answer`·`solution` 전수 감사. UPGRADE는 학생용 완성 풀이, HOLD는 수학적/시각적 출제 결손의 근거와 수정 권고를 기록함. 원본 JS/PNG/SVG/정답키/`main`은 변경하지 않음.

## 작업 기준·검증 경계

기준 문서의 Git blob 식별자(lane30 선행 검토에서 확인한 기준 버전; 본 작업에서 전체 preflight/SHA-256 영수증 재생성은 하지 않음):

- `AGENTS.md` — `61f2bd5223bd6e23dfc358425cf9c28e18f47dd8`
- `docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md` — `fa258f6ab998c7fd0e2b398956309a43ce967e82`
- `docs/operations/solution-upgrade-reservations/GLOBAL_QUEUE_CURRENT.md` — `259bf732ac9932f832077a506c587cb1401a4f7f`
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md` — `eb02a8ed22515b70b0d897949945e40b013eaab6`
- `docs/operations/solution-upgrade-reservations/docs-manifest.json` — `649d90226c8dc8a936f1d41a07e4c51e09acc4e5`
- `docs/rules/RULEBOOK_CURRENT.md` — `e2c5dd43a16469d25f155a23f723071fd8988a3e`
- `docs/agents/outcome-method-review.md` — `909dfdc6a30abcc9625a2450e55765796f65ec82`
- `docs/agents/gpt-reservation.md` — `308bd8c59bbda4b1bb6fc6c2fd600b4cd8abac9a`
- `docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md` — `0e6309c3893e50b98607c9d44c08a8a3dc73e9bb`
- `docs/agents/common.md` — `ef299aeecf718aeb3db03c4f3e19efaca47cc260`
- `archive/AGENTS.md` — `ea550cf69dde6fb60817ca1895341b80734908d2`
- `docs/agents/exam-pipeline.md` — `a3307a463626c2b21ba0c82b7d17410829f14ae3`
- `docs/agents/metadata.md` — `caf99a38f087d5e97ef0dc16b8638353ad32494c`
- `docs/agents/git-evidence.md` — `98165110adf82ddd16adec92f29951691484af21`
- `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md` — `bf5b8a1b6d7488d30b4b1ced5fbe6853001c9d75`
- `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md` — `0ea5c57cdf71f8ded248b9ebd4dde0cf7b90e84c`
- `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` — `693c7ed76dbd643dedd204bbcec9f707bbc2e2f2`
- `docs/operations/solution-upgrade-reservations/BOARD_SOLUTION_SAMPLES_CURRENT.md` — `f703929fa816fc4183f28235a355ecd3a1d6ace7`


검토 방식: 소스의 실제 문제·보기·정답·기존 해설 22개 전수를 읽고, 지수·로그 정의역과 밑 조건, 부등식의 끝점, 자연수 개수, 근호 실근, 기하 거리·넓이, 삼각함수 부호·주기를 독립 계산했다. 문제 원본 PNG/SVG 4개는 모두 실물 시각 판독했으며, 보조 `solutionImage` 3개는 Git blob 실파일 존재를 확인했다. 학생 최종 렌더·보조 그림 전수 시각 검수·`preflight.mjs`·Golden/Negative·운영 출고·SHA-256 영수증은 `NOT_RUN`.

## 문제·보조 해설 이미지 원격 실물 증거

- Q09 `solutionImage` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q9-solution.svg` · Git blob `0b48744ddce07af16383cd1aa2fee61f4ee78274` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q10 `solutionImage` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q10-solution.svg` · Git blob `4516cb72162f75e0f7602861a0e751e8f71cb5e2` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q11 `solutionImage` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q11-solution.svg` · Git blob `e67b8bc66c0b1027f57ad62e7c5ea182463f812d` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q12 `content` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q12.png` · Git blob `35e8a53bad234c214e465ff878568632d9ffbe9e` · 실제 PNG/SVG 시각 판독 완료
- Q13 `content` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q13.png` · Git blob `a77530c02374face69cfcb0b86182b905b9e7185` · 실제 PNG/SVG 시각 판독 완료
- Q17 `content` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q17-problem-v1.svg` · Git blob `967d4c8fbbf2b2162112487cb66e94424b620e29` · 실제 PNG/SVG 시각 판독 완료
- Q19 `content` — `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q19.png` · Git blob `cd35933d688fb570185cf965f79d91169156640c` · 실제 PNG/SVG 시각 판독 완료

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q01`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `지수법칙으로 괄호 전체 거듭제곱` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$8^{-1} \div \left(\frac{1}{2} \times \sqrt[3]{4}\right)^{3}$의 값은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{4}$
2. $\frac{1}{2}$
3. 1
4. 2
5. 4
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>거듭제곱을 먼저 계산합니다. $((\frac{1}{2})\sqrt[3]{4})^3=(\frac{1}{2})^3\cdot4=\frac{1}{2}$입니다.</p><p>$8^{-1}\div(\frac{1}{2})=(\frac{1}{8})\times2=\frac{1}{4}$이므로 <b>①</b>입니다. 세제곱은 괄호 전체에 적용합니다.</p>
````

- **독립 판정·핵심 연결/검산:** 괄호 세제곱 \((\frac12\sqrt[3]4)^3=\frac12\), \(8^{-1}/(\frac12)=1/4\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q02`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `지수 조건 치환과 분수 통분` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
실수 $a$에 대하여 $4^a = 5$일 때, $\frac{2^a - 2^{-a}}{2^a + 2^{-a}}$의 값을 $\frac{q}{p}$라 하자. $p+q$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 7
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$t=2^a>0$으로 두면 $t^2=4^a=5$입니다.</p><p>분자·분모에 $t$를 곱하면 $(t-t^{-1})/(t+t^{-1})=(t^2-1)/(t^2+1)=\frac{5-1}{(5+1)}=\frac{2}{3}$입니다.</p><p>따라서 $p=3,q=2$, $p+q=5$로 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=2^a>0,\ t^2=5\)로 치환하면 \((t^2-1)/(t^2+1)=4/6=2/3\), \(p+q=5\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q03`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `호도법의 호 길이 공식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
반지름의 길이가 6이고 호의 길이가 $8\pi$인 부채꼴의 중심각의 크기는? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{\pi}{6}$
2. $\frac{\pi}{3}$
3. $\frac{\pi}{2}$
4. $\frac{2}{3}\pi$
5. $\frac{4}{3}\pi$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 중심각은 호도법으로 계산합니다.</b> 중심각이 $1$라디안일 때 호의 길이는 반지름과 같으므로, 일반적으로 호의 길이 $l=r\theta$입니다. 이때 $\theta$는 라디안 단위입니다.</p><p><b>2. 수치를 대입합니다.</b> $8\pi=6\theta$에서 $\theta=\dfrac{8\pi}{6}=\dfrac{4\pi}{3}$입니다.</p><p><b>3. 보기 확인.</b> $\frac{4\pi}{3}$은 $240^\circ$에 해당하고, 보기 ⑤와 같습니다. 반지름 6을 곱하는 것이 아니라 호의 길이를 6으로 <b>나누어야</b> 합니다.</p>
````

- **독립 판정·핵심 연결/검산:** 호도법 \(l=r\theta\): \(8\pi=6\theta\Rightarrow\theta=4\pi/3\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q04`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `로그 성질과 정수 배수 조건` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\frac{1}{3}\log 2^n + \frac{1}{6}\log 25^n$이 정수가 되도록 하는 $50$ 이하의 자연수 $n$의 개수는? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 16
2. 15
3. 14
4. 13
5. 12
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>상용로그 성질을 이용합니다. $\frac13\log2^n+\frac16\log25^n=\frac n3\log2+\frac n3\log5=\frac n3\log10=\frac{n}{3}$입니다.</p><p>이 값이 정수이려면 $n$은 3의 배수입니다. $3,6,\ldots,48$은 16개이므로 <b>①</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 상용로그를 합치면 \(\frac n3\log2+\frac n3\log5=n/3\). 자연수 \(n\le50\) 중 3의 배수 16개, ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q05`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `상용로그 자릿수 분리와 비례상수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
외부 자극의 세기를 $I$, 감각의 세기를 $S$라고 하면
$$S = k \log I \quad (k\text{는 상수})$$
인 관계가 성립한다고 한다. 어느 자극의 세기가 160일 때 감각의 세기가 1.1이라고 하면, 이 자극의 세기가 16일 때 감각의 세기는 얼마인가? [3.8점]<br>(단, $\log 1.6 = 0.2$로 계산한다.)
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 0.65
2. 0.6
3. 0.55
4. 0.5
5. 0.4
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$\log160=\log(1.6\times100)=0.2+2=2.2$입니다. $1.1=k\cdot2.2$에서 $k=0.5$.</p><p>$\log16=\log(1.6\times10)=1.2$이므로 $S=0.5\times1.2=0.6$입니다. 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(\log160=2.2\)와 \(1.1=k\log160\)로 \(k=1/2\). \(\log16=1.2\)이므로 세기 \(S=0.6\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q06`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `삼각함수 주기성과 부호` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin\left(-\frac{\pi}{6}\right) + \cos\frac{7}{3}\pi + \tan\frac{5}{4}\pi$의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -2
2. -1
3. 0
4. 1
5. 2
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$\sin(-\pi/6)=-\frac{1}{2}$, $\cos(7\pi/3)=\cos(\pi/3)=\frac{1}{2}$, $\tan(5\pi/4)=\tan(\pi/4)=1$입니다.</p><p>합은 $-\frac{1}{2}+\frac{1}{2}+1=1$, 따라서 <b>④</b>. 주기와 음각의 부호를 구별합니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(\sin(-\pi/6)=-1/2,\ \cos(7\pi/3)=1/2,\ \tan(5\pi/4)=1\); 합 1, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q07`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `지수함수 감소와 끝점 극값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$a > 0$, $a \ne 1$인 상수 $a$에 대하여 정의역이 $\{x \mid 1 \le x \le 2\}$인 함수 $y = a^x + 1$의 최댓값이 $\frac{5}{4}$일 때, 최솟값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{5}{16}$
2. $\frac{1}{2}$
3. $\frac{11}{16}$
4. $\frac{7}{8}$
5. $\frac{17}{16}$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 증가·감소 방향부터 결정</b></p><p>$a>1$이면 $a^x+1$은 증가하고 $x=2$의 최댓값은 $a^2+1>2$입니다. 주어진 최댓값 $\frac{5}{4}$보다 크므로 모순입니다. 따라서 $0<a<1$이고 함수는 감소합니다.</p><p><b>2. 양 끝점 계산</b></p><p>최댓값은 $x=1$에서 $a+1=\frac{5}{4}$이므로 $a=\frac{1}{4}$입니다. 최솟값은 $x=2$에서 $1+a^2=1+\frac{1}{16}=\frac{17}{16}$입니다. 정답 <b>⑤</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(a>1\)이면 \(a^2+1>2>5/4\)이므로 \(0<a<1\). 최대 \(a+1=5/4\Rightarrow a=1/4\), 최소 \(1+a^2=17/16\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q08`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `역함수 지수식 치환` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$y=\log_2(x+1)$의 역함수를 $g(x)$라 할 때, 방정식 $g(2x)+g(x+2)-43=0$의 실수해를 $\beta$라 하자. $g(\beta)$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 7
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 역함수를 구합니다.</b> $y=\log_2(x+1)$에서 $x+1=2^y$, $x=2^y-1$이므로 $g(x)=2^x-1$입니다. 역함수 $g$는 모든 실수에서 정의됩니다.</p><p><b>2. 치환으로 방정식을 풉니다.</b> $g(2x)+g(x+2)-43=0$에 대입하면 $2^{2x}+2^{x+2}-45=0$입니다. $t=2^x>0$을 놓으면 $t^2+4t-45=(t-5)(t+9)=0$입니다.</p><p><b>3. 허용되는 해를 고릅니다.</b> $t=-9$는 $2^x>0$에 어긋나므로 $t=5$만 가능합니다. 따라서 $2^\beta=5$, $g(\beta)=2^\beta-1=4$입니다. <b>정답 ②</b>. $t$의 양수 조건 덕분에 실수해도 유일합니다.</p>
````

- **독립 판정·핵심 연결/검산:** 역함수 \(g(x)=2^x-1\). \(t=2^x>0\)로 \(t^2+4t-45=0\Rightarrow t=5\), 따라서 \(g(\beta)=4\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q09`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `로그함수의 정의역·점근선·변환` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 로그함수 $y=-\log_3(5-x)+3$에 대한 설명으로 옳지 않은 것은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 정의역은 $\{x \mid x < 5\}$이다.
2. 그래프는 점 $(4, 3)$을 지난다.
3. 그래프는 $y=\log_3 x$의 그래프를 평행이동하면 겹쳐진다.
4. 그래프의 점근선의 방정식은 $x=5$이다.
5. $x$값이 증가하면 $y$의 값도 증가한다.
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 진수 조건부터 확인합니다.</b> $5-x>0$이므로 정의역은 $x<5$이고, $x=5$는 수직점근선입니다. $x=4$를 대입하면 $y=-\log_3 1+3=3$이므로 ①·②·④는 맞습니다.</p><p><b>2. 증가 방향을 따집니다.</b> $x$가 커지면 $5-x$는 작아지고 $\log_3(5-x)$도 감소합니다. 앞에 $-$가 붙어 $y$는 증가하므로 ⑤도 맞습니다.</p><p><b>3. ③의 변환 종류를 검토합니다.</b> $y=\log_3x$에서 $x$를 $5-x$로 바꾸려면 좌우 반사가, 로그 전체에 $-$를 붙이려면 상하 반사가 필요합니다. 평행이동만으로는 이런 반사를 만들 수 없습니다. 따라서 옳지 않은 설명은 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 원문 함수는 \(x<5\)에서 증가·볼록하고 수직 점근선 \(x=5\). \(y=\log_3x\)의 단순 평행이동으로 얻을 수 없고 대칭이 필요하므로 ③ 거짓.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q9-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q10`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `사분면 부호와 동경 대칭 합동식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
양수 $\theta$가 다음 조건을 만족시킨다.

(가) $\sin\theta\cos\theta > 0$, $\sin\theta\tan\theta < 0$
(나) 좌표평면에서 각 $\theta$를 나타내는 동경과 $3\theta$를 나타내는 동경이 서로 $y$축에 대하여 대칭이다.

$\theta$의 최솟값을 $\alpha$라 할 때, $\sin\alpha \times \cos\alpha$의 값은? [4.5점]<br>(단, 좌표평면에서 시초선은 원점에서 $x$축의 양의 방향으로 정한다.)
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{4}$
2. $\frac{1}{2}$
3. 1
4. $-\frac{1}{2}$
5. $-\frac{1}{4}$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 부호로 사분면을 좁힙니다.</b> $\sin\theta\cos\theta>0$이면 사인과 코사인의 부호가 같아 제1 또는 제3사분면입니다. 또 $\sin\theta\tan\theta=\dfrac{\sin^2\theta}{\cos\theta}<0$이므로 $\cos\theta<0$입니다. 따라서 $\theta$의 동경은 제3사분면입니다.</p><p><b>2. $y$축 대칭을 각의 합동식으로 바꿉니다.</b> $\theta$와 $3\theta$가 $y$축 대칭이면 $3\theta\equiv\pi-\theta\pmod{2\pi}$입니다. 즉 $4\theta=\pi+2k\pi$, $\theta=\dfrac{\pi}{4}+\dfrac{k\pi}{2}$ ($k$는 정수)입니다.</p><p><b>3. 가장 작은 양수 제3사분면 각을 고릅니다.</b> 후보는 $\pi/4,3\pi/4,5\pi/4,7\pi/4,\ldots$이며 처음으로 제3사분면에 드는 각은 $\alpha=5\pi/4$입니다. 이때 $\sin\alpha=\cos\alpha=-\sqrt2/2$이므로 곱은 $\frac{1}{2}$. <b>정답 ②</b>입니다. 부호가 음수인 두 수의 곱이 양수임에 주의합니다.</p>
````

- **독립 판정·핵심 연결/검산:** 제3사분면이어야 하고 \(3\theta\equiv\pi-\theta\pmod{2\pi}\Rightarrow\theta=\pi/4+k\pi/2\). 최소 양수 제3사분면 각 \(5\pi/4\)에서 \(\sin\alpha\cos\alpha=1/2\), ②.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q10-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q11`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `탄젠트의 세 단조 구간과 끝점 부호` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$0 \le x \le 2$에서 함수 $y=\tan\pi x$의 그래프와 직선 $y=-\frac{11}{3}x+n$이 서로 다른 세 점에서 만나도록 하는 자연수 $n$의 최댓값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 4
2. 5
3. 6
4. 7
5. 8
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 교점을 한 함수의 해로 바꾸기</b></p><p>$\tan(\pi x)=-\frac{11}{3}x+n$을 $h(x)=\tan(\pi x)+\frac{11}{3}x=n$으로 바꿉니다. 탄젠트의 점근선 $x=\frac{1}{2},\frac{3}{2}$는 제외됩니다.</p><p><b>2. 세 구간의 해 개수</b></p><p>$[0,\frac{1}{2})$, $(\frac{1}{2},\frac{3}{2})$, $(\frac{3}{2},2]$에서 탄젠트와 일차식의 합 $h$는 각각 엄격히 증가하므로 구간마다 해가 최대 하나입니다. 첫 구간은 $h(0)=0$에서 $+\infty$까지이므로 자연수 $n>0$에 대해 1개, 가운데는 $-\infty$부터 $+\infty$까지이므로 항상 1개입니다.</p><p>마지막 구간은 $-\infty$부터 $h(2)=\frac{22}{3}$까지이므로 세 번째 해가 있으려면 $n\le22/3$입니다. $x=2$는 정의역에 포함되어 등호도 허용됩니다.</p><p><b>3. 최대 자연수</b></p><p>자연수 $n$의 최댓값은 $7$이므로 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(h(x)=\tan(\pi x)+11x/3\)는 점근선으로 나뉜 세 구간에서 각각 증가. 오른쪽 구간의 최댓값 \(h(2)=22/3\)을 포함하므로 세 교점 조건 \(n\le22/3\), 최대 자연수 7, ④.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q11-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q12`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `사인그래프 진폭·주기·중심선` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=a\sin bx + c$의 그래프가 그림과 같을 때, 세 상수 $a, b, c$에 대하여 $a+b+c$의 값은? [4.1점]<br>(단, $a>0, b>0$)<br><br><div class="exam-img-box"><img src="assets/images/23_팔마고_1학기_중간_고2_수학I/q12.png" class="exam-img" alt="곡선 y=a sin bx+c의 최고점은 y=2에서 x=π/4와 5π/4에 있고, 가운데 최저점은 y=−4에서 x=3π/4에 있다. 점선 안내선이 최고·최저 높이와 x좌표를 표시한다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 원본 그래프에서 위아래 높이를 읽습니다.</b> 최댓값 $2$, 최솟값 $-4$이므로 진폭은 $a=\dfrac{2-(-4)}2=3$이고 중심선은 $c=\dfrac{2+(-4)}2=-1$입니다.</p><p><b>2. 주기를 읽습니다.</b> 연속된 최고점의 $x$좌표는 $\pi/4$와 $5\pi/4$이므로 주기는 $T=5\pi/4-\pi/4=\pi$입니다. $y=a\sin bx+c$의 주기는 $2\pi/b$이고 $b>0$이므로 $b=2$입니다.</p><p><b>3. 그래프 방향까지 검산합니다.</b> $x=\pi/4$이면 $3\sin(2\cdot\pi/4)-1=2$, $x=3\pi/4$이면 $3\sin(3\pi/2)-1=-4$로 그림과 일치합니다. 따라서 $a+b+c=3+2-1=4$, <b>정답 ④</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 실물 그래프의 최고 2·최저 -4에서 \(a=3,c=-1\), 연속 마루 \(x=\pi/4,5\pi/4\) 간격 \(\pi\)로 \(b=2\). 합 4, ④.
- 그림 증거: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q12.png` (시각 검토, blob `35e8a53bad234c214e465ff878568632d9ffbe9e`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q13`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.6`; 문항 단원/과정: `로그 진수 양수 조건과 그래프 부등식 교집합` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
이차함수 $y=f(x)$의 그래프와 일차함수 $y=g(x)$의 그래프가 그림과 같을 때, 부등식 $\log_3 f\left(\frac{x}{3}\right) \le \log_3 g\left(\frac{x}{3}\right)$를 만족시키는 정수 $x$의 개수는? [4.6점]<br><br><div class="exam-img-box"><img src="assets/images/23_팔마고_1학기_중간_고2_수학I/q13.png" class="exam-img" alt="좌표평면에 위로 열린 이차함수 y=f(x)와 증가하는 직선 y=g(x)가 있다. f의 x절편은 −4,4이고 g의 x절편은 1이다. 두 그래프의 교점 x좌표 −2,6에 세로 점선이 표시되어 있다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 7
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 로그를 비교하기 전에 정의역을 구합니다.</b> 밑 $3>1$이므로 $\log_3 f(u)\le\log_3 g(u)$는 <b>두 진수가 모두 양수일 때만</b> $f(u)\le g(u)$와 동치입니다. $u=\frac{x}{3}$으로 놓습니다.</p><p><b>2. 원본 그래프의 조건을 각각 구합니다.</b> 포물선 $f$의 영점은 $-4,4$이므로 $f(u)>0$은 $u<-4$ 또는 $u>4$입니다. 직선 $g$의 영점은 $1$이므로 $g(u)>0$은 $u>1$입니다. 두 그래프의 교점은 $-2,6$이고 포물선이 직선 이하인 구간은 $-2\le u\le6$입니다.</p><p><b>3. 세 조건을 교집합으로 묶습니다.</b> $\bigl((u<-4)\text{ 또는 }(u>4)\bigr)\cap(u>1)\cap[-2,6]=(4,6]$입니다. 따라서 $4<x/3\le6$, 즉 $12<x\le18$입니다.</p><p><b>4. 정수 해를 세어 봅니다.</b> $x=13,14,15,16,17,18$의 6개입니다. $x=12$는 $f(4)=0$이므로 로그가 정의되지 않아 포함되지 않습니다. <b>정답 ④</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 실물 그래프의 \(f\) 영점 \(-4,4\), \(g\) 영점 1, 교점 \(-2,6\)을 독립 읽음. \(u=x/3\)의 진수 양수 조건과 \(f(u)\le g(u)\)를 교집합으로 묶으면 \(4<u\le6\), 정수 \(x=13..18\)의 6개, ④.
- 그림 증거: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q13.png` (시각 검토, blob `a77530c02374face69cfcb0b86182b905b9e7185`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q14`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `공통 거듭제곱 치환과 AM-GM` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
세 양수 $a, b, c$가 다음 조건을 만족시킨다.

(가) $\sqrt{a} = \sqrt[3]{b} = \sqrt[4]{c}$
(나) $\log_3 \frac{ab}{c} = 2$

1보다 큰 실수 $m, n$이 $\log_3 a \times \log_m b \times \log_n c = 1$을 만족시킬 때, $\log_3 mn$의 최솟값은? [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $3\sqrt{5}$
2. $8\sqrt{3}$
3. $10\sqrt{5}$
4. $16\sqrt{3}$
5. $18\sqrt{5}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 공통 거듭제곱근을 하나로 놓기</b></p><p>$\sqrt a=\sqrt[3]b=\sqrt[4]c=t>0$이면 $a=t^2,b=t^3,c=t^4$입니다. 따라서 $ab/c=t$이고 $\log_3t=2$에서 $t=9$입니다. 즉 $a=3^4,b=3^6,c=3^8$입니다.</p><p><b>2. 로그의 밑을 통일</b></p><p>$u=\log_3m>0$, $v=\log_3n>0$이라 하면 $\log_mb=\frac{6}{u}$, $\log_nc=\frac{8}{v}$입니다. 주어진 곱은 $4\cdot6/u\cdot8/v=1$이므로 $uv=192$입니다.</p><p><b>3. 최소값과 등호 조건</b></p><p>구하는 값 $\log_3(mn)=u+v$는 산술·기하평균 부등식으로 $u+v\ge2\sqrt{uv}=2\sqrt{192}=16\sqrt3$입니다. $u=v=8\sqrt3$인 $m,n>1$이 실제로 존재하므로 등호를 달성합니다. 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 공통 양수 \(t=\sqrt a=\sqrt[3]b=\sqrt[4]c\)에서 \(ab/c=t=9\)이므로 \(a=3^4,b=3^6,c=3^8\). \(u=\log_3m,v=\log_3n>0\)이면 \(uv=192\), \(u+v\ge2\sqrt{192}=16\sqrt3\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q15`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `로그 치환과 완전제곱식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
정의역이 $\{x \mid 1 \le x \le 16\}$인 함수 $y = (\log_2 x)\left(\log_{\frac{1}{2}}x\right) + 2\log_2 x + 11$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 7
2. 9
3. 11
4. 13
5. 15
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 로그의 치환 범위를 정합니다.</b> $1\le x\le16$에서 $t=\log_2x$로 두면 $0\le t\le4$입니다. $\log_{\frac{1}{2}}x=-\log_2x=-t$이므로 주어진 식은 $y=-t^2+2t+11$입니다.</p><p><b>2. 완전제곱식으로 최대를 찾습니다.</b> $y=12-(t-1)^2$이므로 꼭짓점 $t=1$이 구간 안에 있고 $M=12$입니다.</p><p><b>3. 최소는 양 끝점에서 비교합니다.</b> 아래로 볼록이 아닌 이차함수이므로 최소는 끝점에서 나옵니다. $y(0)=11$, $y(4)=-16+8+11=3$이므로 $m=3$입니다.</p><p>따라서 $M-m=12-3=9$, <b>정답 ②</b>입니다. $t=4$는 실제 $x=16$에 대응하므로 끝점도 허용됩니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=\log_2x\in[0,4]\)이면 \(y=-t^2+2t+11=12-(t-1)^2\). 최대12, 양 끝점 최솟값3, 차 9, ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q16`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.6`; 문항 단원/과정: `로그 정의역과 절댓값 지수방정식 분기` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=\log_{\frac{1}{3}}(3x-t)$의 그래프와 직선 $x=3$이 한 점에서 만나고, 함수 $y=|3^{-x}-t|$의 그래프와 직선 $y=4$가 두 점에서 만나도록 하는 모든 정수 $t$의 값의 합은? [4.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 22
2. 23
3. 24
4. 25
5. 26
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 로그함수와 수직선의 교점</b></p><p>밑 $\frac{1}{3}$은 유효하므로 $x=3$이 로그함수 $y=\log_{\frac{1}{3}}(3x-t)$의 정의역에 있으면 교점은 정확히 하나입니다. $3\cdot3-t>0$이므로 $t<9$입니다.</p><p><b>2. 절댓값 함수와 수평선의 두 교점</b></p><p>$|3^{-x}-t|=4$는 $3^{-x}=t+4$ 또는 $3^{-x}=t-4$입니다. $3^{-x}$는 양수 전체를 정확히 한 번씩 지나므로, 두 식이 각각 한 실근을 가지려면 $t+4>0$ 및 $t-4>0$이어야 합니다. 두 우변은 서로 달라 해도 서로 다릅니다. 따라서 $t>4$입니다.</p><p><b>3. 정수 합</b></p><p>$4<t<9$에서 $t=5,6,7,8$이므로 합은 $26$, 정답 <b>⑤</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 로그 함수가 \(x=3\)에 정의되려면 \(t<9\). \(|3^{-x}-t|=4\)가 두 해를 가지려면 \(t-4>0\), 따라서 정수 \(t=5,6,7,8\)의 합 26, ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q17`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `객관식` / `4.6`; 문항 단원/과정: `직선 위 거리 비와 두 로그 교점 연립` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
그림과 같이 직선 $y=-\frac{1}{2}x+7$이 $y$축, $x$축과 만나는 점을 각각 $\mathrm{A}, \mathrm{B}$라 하고, 직선 $y=-\frac{1}{2}x+7$이 두 함수 $y=\log_a(x-1)$, $y=\log_a(x-3)-1$의 그래프와 만나는 점을 각각 $\mathrm{P}, \mathrm{Q}$라 하자. $\overline{\mathrm{AP}}=2\overline{\mathrm{QB}}$일 때, 상수 $a^3$의 값은? (단, $a>1$) [4.6점]<br><br><div class="exam-img-box"><img src="assets/images/23_팔마고_1학기_중간_고2_수학I/q17-problem-v1.svg" class="exam-img" alt="좌표평면에 직선 y=−1/2 x+7과 로그곡선 y=log_a(x−1), y=log_a(x−3)−1이 그려져 있다. 직선의 y축 교점 A와 x축 교점 B, 각 로그곡선과의 교점 P,Q가 표시되어 있다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 7
2. 8
3. 9
4. 10
5. 11
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 그래프의 평행이동 관계</b></p><p>$f(x)=\log_a(x-1)$이라 두면 다른 곡선은 $g(x)=\log_a(x-3)-1=f(x-2)-1$입니다. 즉 $f$를 오른쪽으로 2, 아래로 1 옮긴 그래프입니다. 직선 $y=-\frac{x}{2}+7$도 이 이동에 따라 자기 자신으로 옮겨지므로 교점 $Q$는 $P$를 $(2,-1)$만큼 옮긴 점입니다. 따라서 $x_Q=x_P+2$입니다.</p><p><b>2. 직선 위 거리 비율</b></p><p>직선의 절편은 $A=(0,7)$, $B=(14,0)$입니다. 같은 기울기 $-\frac{1}{2}$인 직선 위 거리의 비는 $x$좌표 차의 비와 같으므로 $AP/QB=x_P/(14-x_Q)=2$입니다. $x_Q=x_P+2$를 대입하면 $x_P=2(12-x_P)$, 즉 $x_P=8$, $x_Q=10$입니다.</p><p><b>3. 로그값과 밑</b></p><p>$P=(8,7-\frac{8}{2})=(8,3)$이므로 $3=\log_a(8-1)=\log_a7$입니다. 따라서 $a^3=7$이며 $a>1$도 만족합니다. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 로그곡선 \(y=\log_a(x-3)-1\)은 \(y=\log_a(x-1)\)을 오른쪽2 아래1 이동한 것이고 직선 기울기 \(-1/2\)에서도 교점 이동 \((2,-1)\). \(AP=2QB\)에서 \(x_P=8,x_Q=10\), \(P_y=3=\log_a7\Rightarrow a^3=7\), ①. SVG 좌표 순서 대조.
- 그림 증거: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q17-problem-v1.svg` (시각 검토, blob `967d4c8fbbf2b2162112487cb66e94424b620e29`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q18`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `서술형` / `5`; 문항 단원/과정: `삼각함수 제곱관계와 완전제곱` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서답형 1(단답형 1)] 함수 $f(x)=\cos^2\left(x-\frac{3}{4}\pi\right) - \cos\left(x-\frac{\pi}{4}\right) + \frac{11}{4}$의 최댓값을 $M$이라 할 때, $M$의 값을 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `4`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 각을 통일합니다.</b> $u=x-\pi/4$로 두면 $x-3\pi/4=u-\pi/2$이므로 $\cos(x-3\pi/4)=\cos(u-\pi/2)=\sin u$입니다. 따라서 $f(x)=\sin^2u-\cos u+\frac{11}{4}$입니다.</p><p><b>2. 한 변수의 이차식으로 바꿉니다.</b> $v=\cos u$라 두면 $-1\le v\le1$이고 $\sin^2u=1-v^2$입니다. 따라서 $f=1-v^2-v+\frac{11}{4}=4-(v+\frac{1}{2})^2$입니다.</p><p><b>3. 등호를 실제로 달성할 수 있는지 확인합니다.</b> 제곱은 항상 0 이상이므로 $f\le4$입니다. $v=-\frac{1}{2}$는 $[-1,1]$ 안에 있으므로 $\cos u=-\frac{1}{2}$인 각을 택할 수 있고, 그때 $f=4$가 됩니다. 따라서 최댓값은 <b>4</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 각 통일 \(u=x-\pi/4,\ v=\cos u\in[-1,1]\)로 \(f=4-(v+1/2)^2\), \(v=-1/2\)에서 최댓값 4.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q19`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `서술형` / `5`; 문항 단원/과정: `원 중심과 지름의 중점 관계` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서답형 2(단답형 2)] 그림과 같이 1보다 큰 두 양수 $a, b$ ($a>b$)에 대하여 점 $\mathrm{A}(2, 0)$을 지나고 기울기가 1인 직선이 두 함수 $y=\log_a x$, $y=\log_b x$의 그래프와 제1사분면에서 만나는 점을 각각 $\mathrm{P}, \mathrm{Q}$라 하자. 점 $\mathrm{P}$를 중심으로 하는 원을 $\mathrm{C}$라 할 때, 원 $\mathrm{C}$는 두 점 $\mathrm{A}, \mathrm{Q}$를 지난다. 이 원 $\mathrm{C}$와 $x$축이 만나는 점 중 $\mathrm{A}$가 아닌 점 $\mathrm{R}$에 대하여 $\overline{\mathrm{AR}}=2$이다. $a^2+b^2$의 값을 구하시오. [5점]<br><br><div class="exam-img-box"><img src="assets/images/23_팔마고_1학기_중간_고2_수학I/q19.png" class="exam-img" alt="좌표평면에 y=log_a x, y=log_b x 두 곡선과 A=(2,0)을 지나는 기울기 1인 직선이 있고, 직선과 두 곡선의 교점은 P,Q이다. P를 중심으로 A,Q를 지나는 원 C가 그려져 있으며, 원의 다른 x축 교점 R은 A의 오른쪽에 있다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `13`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 원의 중심 좌표</b></p><p>$A=(2,0)$이고 그림에서 다른 $x$축 교점 $R$은 $A$의 오른쪽에 있으며 $AR=2$이므로 $R=(4,0)$입니다. 원의 중심 $P$는 현 $AR$의 수직이등분선 위에 있으므로 $x_P=\frac{2+4}{2}=3$입니다. 또 $P$는 기울기 1인 직선 $y=x-2$ 위에 있으므로 $P=(3,1)$입니다.</p><p><b>2. 지름의 성질로 Q 구하기</b></p><p>직선 $AQ$는 원의 중심 $P$를 지나므로 $AQ$는 지름입니다. 따라서 $P$가 $AQ$의 중점이고 $Q=2P-A=(4,2)$입니다.</p><p><b>3. 두 로그의 밑 계산</b></p><p>$P$가 $y=\log_ax$ 위에 있으므로 $1=\log_a3$, 즉 $a=3$입니다. $Q$가 $y=\log_bx$ 위에 있으므로 $2=\log_b4$, 즉 $b^2=4$와 $b>1$에서 $b=2$입니다. 따라서 $a^2+b^2=9+4=\boxed{13}$입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 현 \(AR\)의 중점인 원 중심 \(P\)의 \(x=3\), 직선 \(y=x-2\)로 \(P=(3,1)\), 지름의 반대 끝점 \(Q=(4,2)\). \(a=3,b=2\)이므로 \(a^2+b^2=13\). 실물 그림의 \(R\)이 오른쪽인 것까지 확인.
- 그림 증거: `archive/assets/images/23_팔마고_1학기_중간_고2_수학I/q19.png` (시각 검토, blob `cd35933d688fb570185cf965f79d91169156640c`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q20`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `서술형` / `6`; 문항 단원/과정: `로그 밑 조건과 이차식 전체 양수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서답형 3(서술형 1)] 모든 실수 $x$에 대하여 $\log_{|a-1|}(x^2+2ax+5a)$가 정의되기 위한 모든 정수 $a$의 값의 합을 구하시오. [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `7`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 로그가 모든 실수 $x$에서 정의될 조건을 나눕니다.</b> 밑 $|a-1|$은 $>0$이면서 $\ne1$이어야 하고, 진수 $x^2+2ax+5a$는 모든 실수에서 <b>엄격히 양수</b>여야 합니다.</p><p><b>2. 진수의 최솟값을 이용합니다.</b> $x^2+2ax+5a=(x+a)^2+a(5-a)$입니다. 모든 $x$에서 양수이려면 최솟값 $a(5-a)>0$이어야 하므로 $0<a<5$입니다. 등호인 $a=0,5$는 어떤 $x$에서 진수가 0이 되어 제외됩니다.</p><p><b>3. 정수와 밑 조건을 함께 확인합니다.</b> 후보 $a=1,2,3,4$ 중 $a=1$은 밑이 0, $a=2$는 밑이 1이므로 제외됩니다. $a=3,4$의 밑은 각각 2,3이고 진수 최솟값도 양수입니다. 합은 $3+4=\boxed{7}$입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 진수 \((x+a)^2+a(5-a)>0\)가 모든 실수에서 성립하려면 \(0<a<5\). 정수 \(a=1,2,3,4\) 중 로그 밑 \(|a-1|\notin\{0,1\}\)인 \(3,4\); 합 7.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q21`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `여각 관계로 제곱 사인 쌍짓기` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서답형 4(서술형 2)] 크기가 $\frac{\pi}{2}$인 각을 10등분한 한 각의 크기를 $\theta$라 하자.
$$\sin^2\theta + \sin^2 2\theta + \sin^2 3\theta + \cdots + \sin^2 10\theta$$
의 값을 $k$라 하자. $2k$의 값을 구하시오. [7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `11`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$\theta=(\pi/2)/10=\pi/20$이므로 $10\theta=\pi/2$입니다.</p><p>$j=1,2,3,4$에 대해 $\sin^2(j\theta)+\sin^2((10-j)\theta)=\sin^2(j\theta)+\cos^2(j\theta)=1$입니다.</p><p>네 쌍의 합은 4이고, $\sin^2(5\theta)=\sin^2(\pi/4)=\frac{1}{2}$, $\sin^2(10\theta)=1$이므로 $k=4+\frac{1}{2}+1=\frac{11}{2}$입니다. 따라서 $2k=\boxed{11}$.</p>
````

- **독립 판정·핵심 연결/검산:** \(\theta=\pi/20\)에서 \(\sin^2 j\theta+\sin^2(10-j)\theta=1\)인 네 쌍, 중간 \(j=5\)의 \(1/2\), 마지막 \(j=10\)의1. \(k=11/2\), \(2k=11\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `23_팔마고_1학기_중간_고2_수학I:q22`; 원본 blob `cd58f58b29534ed05890805ee717637ac080dbcc`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `로그 절댓값의 범위와 자연수 하한` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서답형 5(서술형 3)] 로그부등식
$$|\log_2 a - \log_2 10| + \log_2 b \le 1$$
을 만족시키는 두 자연수 $a, b$에 대하여 $a+b$의 최솟값을 구하시오. [7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `6`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 절댓값 항의 허용범위</b></p><p>$b$가 자연수이므로 $b\ge1$, 따라서 $\log_2b\ge0$입니다. 주어진 합이 1 이하이려면 $|\log_2(\frac{a}{10})|\le1$이어야 합니다.</p><p><b>2. a의 범위</b></p><p>$-1\le\log_2(\frac{a}{10})\le1$이고 밑 $2>1$이므로 $1/2\le a/10\le2$, 즉 $5\le a\le20$입니다.</p><p><b>3. 하한의 실제 달성</b></p><p>$a+b\ge5+1=6$입니다. $a=5,b=1$을 넣으면 좌변은 $|\log_2(\frac{1}{2})|+\log_21=1+0=1$로 조건을 만족합니다. 따라서 최솟값은 <b>6</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 자연수 \(b\ge1\)이므로 \(\log_2b\ge0\); 부등식에서 \(5\le a\le20\). \(a=5,b=1\)이 실제 성립하므로 \(a+b\) 최솟값 6.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 원본 소스 전수: Q01–Q22, 22개, `UNREAD 0`. 원문·보기·정답·기존 해설과 독립 검산을 모두 기록.
- 판정 합계: KEEP 22, UPGRADE 0, HOLD 0 (총 22).
- 개선 해설 초안: NONE; 해당 Q에 본문 수록.
- 보류: NONE; 출제 이미지/조건 복구 뒤 재감사 필요.
- 원문 문제 그림 4개 실제 판독, 보조 해설 그림 3개 존재 검증. 최종 UI 출고 QA `NOT_RUN`.
- 본 MD는 worker branch 감사 기록이며 실제 JS 교체 또는 운영 병합 상태가 아니다.
