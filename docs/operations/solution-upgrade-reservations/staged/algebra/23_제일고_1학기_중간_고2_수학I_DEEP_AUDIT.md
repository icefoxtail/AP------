# 2023 23_제일고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_제일고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `b055713a6ff56a8a3646e014a56edcf5f112a871`
- standardCourse: `수학I`; `standardCourse` 누락 0/23, `category` 누락 0/23, `questionType` 누락·공란 0/23
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_제일고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 23 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS에 수록된 23문항의 `content`·`choices`·`answer`·`solution` 전수 감사. UPGRADE는 학생용 완성 풀이, HOLD는 수학적/시각적 출제 결손의 근거와 수정 권고를 기록함. 원본 JS/PNG/SVG/정답키/`main`은 변경하지 않음.

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


검토 방식: 소스의 실제 문제·보기·정답·기존 해설 23개 전수를 읽고, 지수·로그 정의역과 밑 조건, 부등식의 끝점, 자연수 개수, 근호 실근, 기하 거리·넓이, 삼각함수 부호·주기를 독립 계산했다. 문제 원본 PNG/SVG 1개는 모두 실물 시각 판독했으며, 보조 `solutionImage` 4개는 Git blob 실파일 존재를 확인했다. 학생 최종 렌더·보조 그림 전수 시각 검수·`preflight.mjs`·Golden/Negative·운영 출고·SHA-256 영수증은 `NOT_RUN`.

## 문제·보조 해설 이미지 원격 실물 증거

- Q03 `solutionImage` — `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q3-solution.svg` · Git blob `8ce49954b9ddca2adf5051d746aa9e008f4f1868` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q09 `solutionImage` — `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q9-solution.svg` · Git blob `f0ffe1d5f640673e7cd7b3ca08cb26000dcc40a3` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q16 `solutionImage` — `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q16-solution.svg` · Git blob `4de72c4138b4570c62c369f6a7b8c589e18faf0a` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q17 `content` — `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q17-problem-v1.svg` · Git blob `26c4d0dd1de6a0689c472a51832d58b15354250b` · 실제 PNG/SVG 시각 판독 완료
- Q18 `solutionImage` — `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q18-solution.svg` · Git blob `97e5ceda9c0ac74b0f24e505efa46d1cff4ae3ab` · 실파일/blob 확인, 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q01`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `세제곱근의 몫과 상용로그` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\frac{\sqrt[3]{81}}{\sqrt[3]{3}} - \frac{2}{3} \log 1000$의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>세제곱근의 몫은 같은 지수의 세제곱근으로 합칠 수 있으므로 $\sqrt[3]{81}/\sqrt[3]{3}=\sqrt[3]{27}=3$입니다.</p><p>상용로그 $\log1000=3$이므로 $3-(\frac{2}{3})\cdot3=1$. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 거듭제곱근 몫은 \(\sqrt[3]{81/3}=\sqrt[3]{27}=3\), 상용로그 \(\log1000=3\)이므로 \(3-\frac23\cdot3=1\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q02`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `로그의 밑·진수 조건 교집합` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_{x-2}(-x^2+4x+5)$가 정의되도록 하는 정수 $x$의 값은? [3.8점]
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
<p>밑 $x-2$가 양수이면서 1이 아니어야 하므로 $x>2$, $x\ne3$입니다.</p><p>진수 $-x^2+4x+5=9-(x-2)^2>0$에서 $-1<x<5$입니다. 정수 후보 $3,4$ 중 $x=3$은 밑이 1이므로 제외됩니다.</p><p>따라서 $x=4$, 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 밑 조건 \(x-2>0,\ x-2\ne1\)에서 \(x>2,x\ne3\); 진수 \(9-(x-2)^2>0\)에서 \(-1<x<5\). 정수 \(x=4\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q03`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `부채꼴 넓이와 호 길이 관계` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
호의 길이가 $\pi$, 넓이가 $2\pi$인 부채꼴의 반지름의 길이는? [3.8점]
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
<p>부채꼴의 넓이는 $S=\frac12 r^2\theta$, 호의 길이는 $l=r\theta$이므로 $S=\frac12rl$입니다.</p><p>$2\pi=\frac12r\pi$에서 $r=4$. 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 호 길이 \(l=r\theta=\pi\), 넓이 \(S=rl/2=2\pi\)에서 \(r=4\), ④.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q3-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q04`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `삼각함수 부호와 관계` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin\theta < 0$, $\cos\theta = -\frac{3}{5}$일 때, $5\sin\theta + 9\tan\theta$의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 7
2. 8
3. 9
4. 10
5. 11
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$\sin\theta<0$, $\cos\theta=-\frac{3}{5}$이므로 제3사분면입니다. 따라서 $\sin\theta=-\frac{4}{5}$, $\tan\theta=(-\frac{4}{5})/(-\frac{3}{5})=\frac{4}{3}$입니다.</p><p>$5\sin\theta+9\tan\theta=5(-\frac{4}{5})+9(\frac{4}{3})=-4+12=8$. 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(\sin\theta<0,\cos\theta=-3/5\)이므로 제3사분면에서 \(\sin=-4/5,\tan=4/3\); \(5\sin+9\tan=-4+12=8\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q05`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `로그 합과 진수 일치·정의역` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
방정식 $\log_5 (x^2+3x-13) = 1 + \log_5 (x-1)$를 만족시키는 실수 $x$의 값은? [3.8점]
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
<p>오른쪽은 $1+\log_5(x-1)=\log_5(5(x-1))$입니다. 로그의 진수가 모두 양수이므로 $x>1$을 먼저 확인합니다.</p><p>$x^2+3x-13=5x-5$에서 $x^2-2x-8=(x-4)(x+2)=0$. $x=4$만 정의역을 만족하므로 <b>④</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 정의역 \(x>1\)에서 \(x^2+3x-13=5(x-1)\)을 정리하면 \((x-4)(x+2)=0\); 적법한 해는 \(x=4\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q06`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `지수의 밑 통일과 삼각비` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\frac{2^{\sin\theta}}{2^{\cos\theta}} = 8^{\cos\theta}$을 만족시키는 각 $\theta$에 대하여 $\tan\theta$의 값은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \frac{1}{2}
2. \frac{1}{3}
3. \frac{1}{4}
4. 3
5. 4
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>양변을 밑 2로 통일하면 $2^{\sin\theta-\cos\theta}=2^{3\cos\theta}$입니다.</p><p>따라서 $\sin\theta=4\cos\theta$입니다. $\cos\theta=0$이면 이 식이 불가능하므로 나누어도 되고, $\tan\theta=4$. 정답 <b>⑤</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(2^{\sin\theta-\cos\theta}=2^{3\cos\theta}\)이므로 \(\sin\theta=4\cos\theta\); \(\cos\theta=0\)은 불가능해 \(\tan\theta=4\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q07`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `짝수근 주값과 로그 밑 변환을 보기별 검산` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 바르게 계산한 것의 개수는? [4.3점]

<보기>
ㄱ. $\{(-3)^6\}^{\frac{1}{2}} = -27$
ㄴ. $\sqrt[4]{(-3)^4} + \sqrt[3]{-2^6} = -7$
ㄷ. $\sqrt[4]{32} - \sqrt[4]{27} \times \sqrt[4]{6} + 7\sqrt[4]{2} = 6\sqrt[4]{2}$
ㄹ. $(\log_2 9 + \log_{\sqrt{2}} 9) \times \log_9 16 = 12$
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 0개
2. 1개
3. 2개
4. 3개
5. 4개
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>ㄱ $\sqrt{(-3)^6}=\sqrt{729}=27$로 음수가 아니므로 거짓입니다. ㄴ $\sqrt[4]{(-3)^4}=3$, $\sqrt[3]{-2^6}=\sqrt[3]{-64}=-4$여서 합은 $-1$로 거짓입니다.</p><p>ㄷ $\sqrt[4]{32}=2\sqrt[4]2$, $\sqrt[4]{27}\sqrt[4]6=3\sqrt[4]2$이므로 전체는 $(2-3+7)\sqrt[4]2=6\sqrt[4]2$로 참입니다.</p><p>ㄹ $\log_{\sqrt2}9=2\log_29$, $\log_916=4/\log_29$이므로 곱은 $3\log_29\cdot4/\log_29=12$로 참입니다. 옳은 것 2개, 정답 <b>③</b>.</p>
````

- **독립 판정·핵심 연결/검산:** ㄱ 짝수근 주값 27이므로 거짓, ㄴ \(3-4=-1\)로 거짓, ㄷ \((2-3+7)\sqrt[4]2=6\sqrt[4]2\) 참, ㄹ \((\log_29+2\log_29)\log_916=12\) 참. 두 개, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q08`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `t−1/t 세제곱 항등식과 a 이차방정식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
양수 $a$에 대하여 $x=a^{\frac{1}{3}} - a^{-\frac{1}{3}}$가 방정식 $3x^3 + 9x - 8 = 0$의 실근일 때, $a$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$t=a^{\frac{1}{3}}>0$으로 두면 $x=t-t^{-1}$입니다. 항등식 $(t-t^{-1})^3+3(t-t^{-1})=t^3-t^{-3}$을 사용합니다.</p><p>$3x^3+9x=8$에서 $3(a-a^{-1})=8$, 즉 $3a^2-8a-3=0$입니다.</p><p>$(3a+1)(a-3)=0$이므로 양수 $a=3$이고 정답 <b>②</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=a^{1/3}>0,\ x=t-t^{-1}\)에 항등식 \(x^3+3x=a-a^{-1}\)을 대입하면 \(3a^2-8a-3=0\); 양수 해 \(a=3\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q09`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `상용로그 지수 치환과 정수 간격` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$10 < x < 1000$인 실수 $x$에 대하여 $\log\frac{1}{x}$과 $\log\frac{1}{x^3}$의 차가 정수가 되도록 하는 모든 $x$의 값의 곱은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 10^4
2. 10^{\frac{9}{2}}
3. 10^5
4. 10^{\frac{11}{2}}
5. 10^6
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 로그를 하나의 변수로 표현</b></p><p>$t=\log x$라고 놓으면 $10<x<1000$에서 $1<t<3$입니다. $\log(1/x)=-t$, $\log(1/x^3)=-3t$이므로 두 값의 차의 절댓값은 $2t$입니다.</p><p><b>2. 정수 조건과 열린 경계</b></p><p>$2<2t<6$이므로 정수로 가능한 값은 $3,4,5$뿐입니다. $2$와 $6$은 원래 $x$의 범위가 열린 구간이어서 포함되지 않습니다. 따라서 $t=\frac{3}{2},2,\frac{5}{2}$입니다.</p><p><b>3. 모든 해의 곱</b></p><p>$x=10^t$이므로 모든 $x$의 곱은 $10^{\frac{3}{2}}\cdot10^2\cdot10^{\frac{5}{2}}=10^{6}$입니다. 정답은 <b>⑤</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=\log x\in(1,3)\)에서 두 로그의 차의 절댓값 \(2t\)가 자연수 정수이면 3,4,5; \(t=3/2,2,5/2\)의 합 6이므로 모든 \(x\)의 곱 \(10^6\), ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q9-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q10`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `연쇄 밑 변환과 분수 로그` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_2 3 = a$, $\log_3 5 = b$일 때, $\log_6 45$를 두 실수 $a, b$로 나타내면? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \frac{2a+b}{a+b}
2. \frac{a+3b}{a+b}
3. \frac{3ab+a}{a+1}
4. \frac{ab+2a}{a+1}
5. \frac{3ab+2a}{a+1}
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$a=\log_23$, $b=\log_35$이므로 $\log_25=(\log_23)(\log_35)=ab$입니다.</p><p>$\log_645=\frac{\log_2(9\cdot5)}{\log_2(2\cdot3)}=\frac{2a+ab}{1+a}=\frac{ab+2a}{a+1}$입니다. 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(\log_25=\log_23\,\log_35=ab\), \(\log_645=(2a+ab)/(1+a)=a(b+2)/(a+1)\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q11`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `짝수·홀수 거듭제곱근의 정수해 분류` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$2$이상의 자연수 $n$에 대하여 $64$의 $n$제곱근이 정수 $a$가 될 때, 모든 $a$의 값의 개수는? [4.3점]
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
<p><b>1. 정수 거듭제곱의 지수 확인</b></p><p>$64=2^6$이고 $a^n=64$입니다. $n\ge2$이며 $|a|>1$인 정수 $a$는 $2$의 거듭제곱이어야 합니다. $|a|=2^k$라 놓으면 $kn=6$이므로 가능한 $n$은 $2,3,6$뿐입니다.</p><p><b>2. 음수 해는 짝수 지수에서만 가능</b></p><p>$n=2$이면 $a=\pm8$, $n=3$이면 $a=4$이고 음수는 세제곱하여 양수 $64$가 될 수 없습니다. $n=6$이면 $a=\pm2$입니다.</p><p><b>3. 서로 다른 정수의 개수</b></p><p>$a=-8,-2,2,4,8$의 총 $5$개이므로 정답은 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(64=2^6=a^n,\ n\ge2\). \(n=2,3,6\)에서 정수 \(a=\pm8,4,\pm2\)의 다섯 개(음의 홀수제곱은 64가 아님), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q12`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `로그 합을 곱으로 바꾼 망원곱` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$f(x) = \log_a \{\log_x (x+1)\}$에 대하여 $f(2)+f(3)+\cdots+f(255)=3$일 때, 상수 $a$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$f(x)=\log_a(\log_x(x+1))$이므로 로그의 합을 곱의 로그로 합칩니다.</p><p>$\sum_{x=2}^{255}f(x)=\log_a\prod_{x=2}^{255}\frac{\ln(x+1)}{\ln x}$입니다. 분자·분모가 연쇄 약분되어 곱은 $\ln256/\ln2=8$입니다.</p><p>따라서 $\log_a8=3$, $a^3=8$에서 $a=2$. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(\sum_{x=2}^{255}\log_a(\log_x(x+1))=\log_a\prod_{x=2}^{255}\ln(x+1)/\ln x=\log_a(\ln256/\ln2)=\log_a8=3\); \(a=2\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q13`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `감소 로그의 구간 끝점 극값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
정의역이 $\{x \mid 0 \le x \le 12\}$인 함수 $f(x) = 2\log_{\frac{1}{2}}(x+a)$가 최댓값 $-4$, 최솟값 $m$을 갖는다. $a+m$의 값은? (단, $a$는 상수이다.) [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -5
2. -4
3. -3
4. -2
5. -1
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>밑 $\frac{1}{2}$의 로그는 감소하므로 최댓값은 $x=0$에서 나옵니다. $2\log_{\frac{1}{2}}a=-4$에서 $\log_{\frac{1}{2}}a=-2$, $a=4$입니다.</p><p>최솟값은 $x=12$에서 $m=2\log_{\frac{1}{2}}(12+4)=2(-4)=-8$입니다.</p><p>$a+m=4-8=-4$, 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 밑 \(1/2\) 로그는 감소. 최대 \(x=0\)에서 \(2\log_{1/2}a=-4\Rightarrow a=4\), 최소 \(x=12\)에서 \(m=2\log_{1/2}16=-8\); \(a+m=-4\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q14`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `삼각함수 유리식 항등변형` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin\theta > 0$이고 $\frac{1+\sin\theta}{\cos\theta} + \frac{\cos\theta}{1+\sin\theta} = -6$일 때, $\tan\theta \times \sin\theta$의 값은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -\frac{8}{3}
2. -\frac{2\sqrt{2}}{3}
3. -\frac{1}{3}
4. \frac{2\sqrt{2}}{3}
5. \frac{8}{3}
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$s=\sin\theta$, $c=\cos\theta$로 놓습니다. $c^2=(1-s)(1+s)$이므로 $\frac{1+s}{c}+\frac{c}{1+s}=\frac{1+s+1-s}{c}=\frac{2}{c}$입니다.</p><p>$\frac{2}{c}=-6$에서 $c=-\frac{1}{3}$. $s>0$이므로 $s=\sqrt{1-c^2}=2\sqrt2/3$입니다.</p><p>$\tan\theta\sin\theta=s^2/c=(\frac{8}{9})/(-\frac{1}{3})=-\frac{8}{3}$. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(s=\sin\theta>0,\ c=\cos\theta\ne0\)라 하면 주어진 분수식은 \(2/c=-6\). \(c=-1/3,s=2\sqrt2/3\), \(\tan\theta\sin\theta=s^2/c=-8/3\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q15`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `반대 동경의 π 합동식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\frac{\pi}{2} < \theta < \pi$이고 각 $\theta$와 각 $5\theta$를 나타내는 동경이 일직선 위에 있고 방향이 반대일 때, $\sin(\theta - \frac{5}{12}\pi)$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \frac{1}{2}
2. \frac{\sqrt{2}}{2}
3. \frac{\sqrt{3}}{2}
4. \frac{\sqrt{2}}{3}
5. \frac{\sqrt{3}}{3}
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>반대 방향의 동경은 두 각의 차가 홀수배 $\pi$입니다. 따라서 $5\theta-\theta=4\theta\equiv\pi\pmod{2\pi}$.</p><p>$\theta=\pi/4+k\pi/2$ 중 $\pi/2<\theta<\pi$인 값은 $3\pi/4$뿐입니다.</p><p>$\sin(\theta-5\pi/12)=\sin(9\pi/12-5\pi/12)=\sin(\pi/3)=\sqrt3/2$. 정답 <b>③</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 반대 동경은 \(5\theta-\theta=(2k+1)\pi\). \(\pi/2<\theta<\pi\)에서 \(\theta=3\pi/4\), 목표 \(\sin(\pi/3)=\sqrt3/2\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q16`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.6`; 문항 단원/과정: `역함수·제1사분면·두 단조 그래프 끝점 비교` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y=-2^x+4$의 역함수의 그래프와 함수 $y=\log_3 (x+\frac{k}{2})-2$의 그래프가 제$1$사분면에서 만나도록 하는 모든 자연수 $k$의 개수는? [4.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 149
2. 150
3. 151
4. 152
5. 153
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 역함수와 제1사분면 범위</b></p><p>$y=-2^x+4$를 $x$에 대하여 풀면 $x=\log_2(4-y)$이므로 역함수는 $f(x)=\log_2(4-x)$입니다. $f(x)>0$인 제1사분면 구간은 $0<x<3$입니다. 이 구간에서 $f$는 연속이고 엄격히 감소합니다.</p><p><b>2. 두 그래프의 교점 조건</b></p><p>$g(x)=\log_3(x+\frac{k}{2})-2$는 $k$가 자연수일 때 $0\le x\le3$에서 연속·엄격히 증가합니다. 따라서 $f(x)-g(x)$는 엄격히 감소합니다. 열린 구간 $(0,3)$ 안에서 0이 되려면 $f(0)>g(0)$, $f(3)<g(3)$이 필요충분합니다.</p><p>$f(0)=2$, $g(0)=\log_3(\frac{k}{2})-2$이므로 $\log_3(\frac{k}{2})<4$, 즉 $k<162$입니다.</p><p>$f(3)=0$, $g(3)=\log_3(3+\frac{k}{2})-2$이므로 $3+\frac{k}{2}>9$, 즉 $k>12$입니다. 경계 $k=12,162$는 교점이 축 위에 있으므로 제외합니다.</p><p><b>3. 정수 개수</b></p><p>$k=13,14,\ldots,161$이므로 $161-13+1=149$개입니다. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 역함수는 \(f(x)=\log_2(4-x)\), 제1사분면에서 \(0<x<3\) 엄격 감소. \(g(x)=\log_3(x+k/2)-2\) 증가하므로 양 끝 부호가 엇갈리는 \(12<k<162\); 자연수 13..161의 149개, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q16-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q17`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.6`; 문항 단원/과정: `거리비로 교점 x좌표 차 고정·지수 조건 연립` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$a > 1$인 실수 $a$에 대하여 직선 $y=-x+4$가 두 곡선 $y=a^{x-1}$, $y=\log_a (x-1)$과 만나는 점을 각각 $A, B$라 하고, 곡선 $y=a^{x-1}$이 $y$축과 만나는 점을 $C$라 하자. $\overline{AB} = 2\sqrt{2}$일 때, 점 $C$의 $y$ 좌표는? [4.6점]<br><div class="exam-img-box"><img src="assets/images/23_제일고_1학기_중간_고2_수학I/q17-problem-v1.svg" class="exam-img" alt="좌표평면의 개형이다. 직선 y=−x+4와 지수곡선 y=a^(x−1)의 교점 A, 직선과 로그곡선 y=logₐ(x−1)의 교점 B, 지수곡선과 y축의 교점 C, 원점 O가 표시되어 있다."></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. \frac{2}{25}
2. \frac{1}{10}
3. \frac{3}{25}
4. \frac{7}{50}
5. \frac{4}{25}
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 두 교점의 좌표 관계</b></p><p>직선 $y=-x+4$와 $y=a^{x-1}$의 교점을 $A=(t,4-t)$라고 두면 $a^{t-1}=4-t$입니다. 양변에 밑 $a$의 로그를 취하면 $\log_a(4-t)=t-1$입니다. 따라서 $B=(5-t,t-1)$은 $y=\log_a(x-1)$와 $y=-x+4$를 모두 만족합니다. $a>1$이므로 두 곡선의 각 교점은 유일합니다.</p><p><b>2. 거리 조건과 부호 검토</b></p><p>두 점은 기울기 $-1$인 직선 위에 있으므로 $AB=\sqrt2\,|x_B-x_A|=\sqrt2|5-2t|=2\sqrt2$입니다. 따라서 $|5-2t|=2$, 즉 $t=\frac32$ 또는 $t=\frac72$입니다. $a>1$일 때 $a^{t-1}>1$인 $t>1$에서는 $4-t>1$이어야 하므로 $t<3$입니다. 따라서 $t=\frac72$는 불가능하고 $t=\frac32$만 남습니다.</p><p><b>3. 밑과 절편</b></p><p>$a^{\frac{1}{2}}=4-\frac32=\frac52$이므로 $a=\frac{25}{4}$입니다. $C$는 $x=0$에서 $y=a^{-1}$이므로 $y_C=\frac4{25}$. 정답 <b>⑤</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 지수·로그 교점은 직선 \(x+y=4\) 위에서 서로 대응해 \(A=(t,4-t), B=(5-t,t-1)\). 거리 \(\sqrt2|5-2t|=2\sqrt2\)와 \(a>1\) 조건에서 \(t=3/2\); \(a^{1/2}=5/2\)이므로 \(C\)의 \(y=a^{-1}=4/25\), ⑤. 실물 SVG의 A·B·C 위치와 대조 완료.
- 그림 증거: `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q17-problem-v1.svg` (시각 검토, blob `26c4d0dd1de6a0689c472a51832d58b15354250b`)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q18`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `4.9`; 문항 단원/과정: `로그 이차부등식의 구간과 집합 교집합` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
두 집합
$$A = \{x \mid (\log_2 x)^2 - 2a\log_2 x + a^2-1 \le 0\}$$
$$B = \{x \mid x^2 - 9x + 8 \le 0\}$$
에 대하여 $A \cap B \neq \varnothing$을 만족시키는 정수 $a$의 개수는? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 4
2. 5
3. 6
4. 7
5. 8
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 두 집합을 구간으로 나타내기</b></p><p>$t=\log_2x$로 놓으면 $(t-a)^2\le1$이므로 $a-1\le t\le a+1$입니다. 따라서 $A=[2^{a-1},2^{a+1}]$입니다. 또한 $(x-1)(x-8)\le0$이므로 $B=[1,8]$입니다.</p><p><b>2. 교집합이 존재할 조건</b></p><p>두 닫힌구간이 적어도 한 점을 공유하려면 $A$의 왼쪽 끝 $2^{a-1}$이 $8$ 이하이고, 오른쪽 끝 $2^{a+1}$이 $1$ 이상이어야 합니다. 즉 $a-1\le3$, $a+1\ge0$이므로 $-1\le a\le4$입니다. 원래 부등식에 등호가 있으므로 양 끝 정수도 포함합니다.</p><p><b>3. 정수 개수</b></p><p>$a=-1,0,1,2,3,4$의 $6$개입니다. 정답은 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=\log_2x\)라 하면 \(A=[2^{a-1},2^{a+1}], B=[1,8]\). 교집합이 있으려면 \(a-1\le3,\ a+1\ge0\), 즉 정수 \(a=-1,\ldots,4\)의 6개, ③.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_제일고_1학기_중간_고2_수학I/q18-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q19`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `객관식` / `5`; 문항 단원/과정: `지수방정식 이차치환 후 절댓값 해 개수 분기` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$5$이하의 두 자연수 $m, n$에 대하여 함수 $f(x)$를 $f(x)=|3^x-m|+n$이라 하자. $x$에 대한 방정식 $4^{f(x)} - 10 \times 2^{f(x)+1} + 64 = 0$이 서로 다른 세 실근을 갖도록 하는 $m, n$의 순서쌍을 $(m, n)$이라고 할 때, 다음 중 옳지 않은 것은? [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. (2, 1)
2. (2, 2)
3. (3, 1)
4. (3, 2)
5. (4, 2)
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 지수방정식부터 정리</b></p><p>$t=2^{f(x)}>0$으로 놓으면 $4^{f(x)}-10\cdot2^{f(x)+1}+64=0$은 $t^2-20t+64=(t-4)(t-16)=0$입니다. 따라서 $f(x)=2$ 또는 $f(x)=4$이고, $|3^x-m|=2-n$ 또는 $|3^x-m|=4-n$입니다.</p><p><b>2. 절댓값 방정식의 해 개수</b></p><p>$3^x>0$이므로 $|3^x-m|=c$는 $c<0$이면 0개, $c=0$이면 1개, $0<c<m$이면 2개, $c\ge m$이면 1개입니다. 두 식은 우변 $2-n$, $4-n$이 서로 달라 공통해가 없습니다.</p><p><b>3. 모든 보기 판정</b></p><p>① $(m,n)=(2,1)$: $c=1,3$이므로 $2+1=3$개(성립).<br>② $(2,2)$: $c=0,2$이므로 $1+1=2$개(불성립).<br>③ $(3,1)$: $c=1,3$이므로 $2+1=3$개(성립).<br>④ $(3,2)$: $c=0,2$이므로 $1+2=3$개(성립).<br>⑤ $(4,2)$: $c=0,2$이므로 $1+2=3$개(성립).</p><p>세 실근 조건에 맞지 않는 유일한 보기는 <b>②</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=2^{f(x)}>0\)에서 \((t-4)(t-16)=0\)이므로 \(f=2\) 또는4. \(|3^x-m|=c\)의 양수 진수 해 개수를 보기별로 세면 (2,2)만 총 두 실근, 나머지는 세 실근이므로 틀린 보기 ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q20`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `서술형` / `4`; 문항 단원/과정: `로그 치환으로 지수부등식을 이차부등식화` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 1] 부등식 $x^{\log_2 x} < 16x^3$을 만족시키는 자연수 $x$의 개수를 구하시오. [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `15`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$x$는 자연수이므로 $x\ge1$입니다. $t=\log_2x$로 두면 $x=2^t$, $x^{\log_2x}=2^{t^2}$이고 $16x^3=2^{4+3t}$입니다.</p><p>밑이 2로 1보다 크므로 $t^2<4+3t$, 즉 $(t-4)(t+1)<0$에서 $-1<t<4$입니다.</p><p>자연수 $x$에서는 $t\ge0$이므로 $1\le x<16$. $x=1,2,\ldots,15$의 <b>15개</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=\log_2x,\ x\in\mathbb N\)에서 \(t^2-3t-4=(t-4)(t+1)<0\); \(1\le x<16\)의 자연수 15개.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q21`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `서술형` / `5`; 문항 단원/과정: `반복 제거의 지수모형과 상용로그 역산` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 2] 어느 회사의 정수 필터는 정수 작업을 한번 할 때마다 불순물의 양이 $x\%$ 제거할 수 있다고 한다. 정수 작업을 $7$회 반복 실시하면 불순물의 양은 처음의 $20\%$ 이하로 줄어든다고 할 때 자연수 $x$의 최솟값을 구하시오.
(단, $\log 2 = 0.3$, $\log 7.94 = 0.9$로 계산한다.) [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `21`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 반복 후 남는 비율</b></p><p>한 번 처리할 때 불순물의 남는 비율은 $1-\frac{x}{100}$입니다. $0<x<100$이면 7번 후 남는 비율은 $(1-x/100)^7$이므로 조건은 $(1-x/100)^7\le1/5$입니다. $x=100$도 조건을 만족하지만 최소값 후보는 아닙니다.</p><p><b>2. 상용로그로 부등식 계산</b></p><p>양변이 양수인 범위에서 로그를 취하면 $7\log(1-\frac{x}{100})\le\log(\frac{1}{5})=\log2-1=-0.7$이므로 $\log(1-\frac{x}{100})\le-0.1$입니다. $\log7.94=0.9$에서 $\log0.794=-0.1$이고, 상용로그는 증가하므로 $1-x/100\le0.794$입니다.</p><p><b>3. 자연수 최소</b></p><p>$x/100\ge0.206$, 즉 $x\ge20.6$입니다. 자연수 중 최솟값은 <b>21</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 7회 뒤의 잔량은 \((1-x/100)^7\). 제시된 \(\log2=.3,\log7.94=.9\)를 써서 \(1-x/100\le0.794\), \(x\ge20.6\); 최소 자연수 21. 로그 사용 시 \(0<x<100\) 먼저 확인하고 \(x=100\)은 최소 아님.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q22`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `서술형` / `5`; 문항 단원/과정: `sin+cos 치환과 제곱합 범위` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 3] $3\sin\theta - 4\tan\theta = 4$일 때, $\sin\theta + \cos\theta$의 값을 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `$-1/3$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 삼각함수 관계식으로 정리</b></p><p>$s=\sin\theta$, $c=\cos\theta$라 놓으면 원래 식 $3s-4s/c=4$에서 $c\ne0$입니다. 양변에 $c$를 곱하면 $3sc=4(s+c)$입니다.</p><p><b>2. 구하려는 합을 직접 변수로</b></p><p>$u=s+c$라 놓으면 $u^2=s^2+c^2+2sc=1+2sc$이므로 $sc=(u^2-1)/2$입니다. 이를 대입하여 $3(u^2-1)=8u$, 즉 $3u^2-8u-3=(3u+1)(u-3)=0$입니다.</p><p><b>3. 가능한 값 판정</b></p><p>$u=3$ 또는 $u=-\frac{1}{3}$이지만 $(\sin\theta+\cos\theta)^2\le2(\sin^2\theta+\cos^2\theta)=2$이므로 $|u|\le\sqrt2$입니다. 따라서 $u=3$은 불가능하고 구하는 값은 <b>$-\frac13$</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(s=\sin\theta,c=\cos\theta\), 식에 \(c\ne0\)을 사용하면 \(3sc=4(s+c)\). \(u=s+c\)에서 \(3u^2-8u-3=0\)이므로 \(u=3,-1/3\); \(|u|\le\sqrt2\)에서 \(u=-1/3\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `23_제일고_1학기_중간_고2_수학I:q23`; 원본 blob `b055713a6ff56a8a3646e014a56edcf5f112a871`
- 형식/배점: `서술형` / `6`; 문항 단원/과정: `수평 교점 거리와 k≥0에서 로그거리 최댓값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 4] 자연수 $n$에 대하여 직선 $y=k$($k$는 실수)와 두 곡선 $y=\log_3 x$, $y=\log_3(x-n)$이 만나는 점을 각각 $P, Q$라 하고, 점 $Q$를 지나고 $x$축에 수직인 직선이 곡선 $y=\log_3 x$와 만나는 점을 $R$라 할 때, 다음 조건을 만족시키는 자연수 $n$의 최솟값을 구하시오. [6점]

어떤 음이 아닌 실수 $k$에 대하여 $\overline{PQ} + \overline{RQ} \ge 15$이다.
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 객관식 보기 없음)
````

- 원본 `answer`: `13`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p><b>1. 세 점의 좌표</b></p><p>$k\ge0$에서 $P=(3^k,k)$, $Q=(n+3^k,k)$이고, $Q$를 지나는 수직선 위의 $R=(n+3^k,\log_3(n+3^k))$입니다. 따라서 $PQ=n$, $RQ=\log_3(n+3^k)-k=\log_3(1+n/3^k)$입니다.</p><p><b>2. 존재 조건을 최대값으로 바꾸기</b></p><p>$n>0$이고 $3^k$는 $k\ge0$에서 증가하므로 $n/3^k$는 감소합니다. 따라서 $RQ$는 $k=0$에서 가장 크며, $PQ+RQ\le n+\log_3(n+1)$입니다. $k=0$이 허용되므로 이 상한은 실제로 달성됩니다. 즉 어떤 $k\ge0$에서 길이의 합이 15 이상일 필요충분조건은 $n+\log_3(n+1)\ge15$입니다.</p><p><b>3. 인접 자연수 검토</b></p><p>$n=12$이면 $12+\log_3 13<12+3=15$이고, $n=13$이면 $13+\log_3 14>13+2=15$입니다. 왼쪽 식은 $n$에 대해 증가하므로 최소 자연수는 <b>13</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(P=(3^k,k),Q=(n+3^k,k),R=(n+3^k,\log_3(n+3^k))\). \(PQ+RQ=n+\log_3(1+n/3^k)\)는 \(k\ge0\)에서 \(k=0\)이 최대. \(n=12\)은 15 미만, \(n=13\)은 15 이상이므로 최소 \(n=13\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 원본 소스 전수: Q01–Q23, 23개, `UNREAD 0`. 원문·보기·정답·기존 해설과 독립 검산을 모두 기록.
- 판정 합계: KEEP 23, UPGRADE 0, HOLD 0 (총 23).
- 개선 해설 초안: NONE; 해당 Q에 본문 수록.
- 보류: NONE; 출제 이미지/조건 복구 뒤 재감사 필요.
- 원문 문제 그림 1개 실제 판독, 보조 해설 그림 4개 존재 검증. 최종 UI 출고 QA `NOT_RUN`.
- 본 MD는 worker branch 감사 기록이며 실제 JS 교체 또는 운영 병합 상태가 아니다.
