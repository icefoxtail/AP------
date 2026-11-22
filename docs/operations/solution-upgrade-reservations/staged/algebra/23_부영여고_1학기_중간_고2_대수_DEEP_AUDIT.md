# 2023 23_부영여고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_부영여고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- course: `대수` (파일명); `standardCourse` 누락 `0/21`, `category` 누락 `0/21`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_부영여고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 19 · UPGRADE 1 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `Q14`
- 범위: 전 21문항의 원문 `content`·`choices`·`answer`·`solution` 및 참조 자료 검토. UPGRADE는 교체 가능한 학생용 해설 초안을 기록하고, HOLD는 수학적 충돌과 수정 권고를 기록한다. 원본 JS/그림/정답키/`main`은 수정하지 않음.

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


검토 방식: `23_부영여고_1학기_중간_고2_대수.js`의 실제 문제·보기·정답·기존 해설 21개 전수를 읽고, 방정식의 정의역·밑 및 진수·근 개수·이차함수 범위·삼각함수 부호·기하 도형 관계를 독립 검산했다. 객관식은 선지·정답 번호를 비교하고, 서답형은 수치를 직접 대조했다. 문제 이미지 1개는 모두 실제 시각 판독(원본 PNG 또는 SVG 렌더)을 수행했다. `solutionImage` 3개는 원격 원본 실파일·blob 증거를 확인했으며 **보조 해설 그림 전체의 시각 판독은 NOT_RUN**이다. `preflight.mjs`, Golden/Negative, UI 출고 게이트, SHA-256 영수증은 `NOT_RUN`이며 원본 재발행 아님.

## 문제·보조 해설 이미지 실물 증거

- Q02 `solutionImage` — `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q2-solution.svg` · Git blob `3696dc288c7151cbb0d63d168d1ca51dbd26a485` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q13 `image` — `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q13.png` · Git blob `9d833fe78a049e4379cf089feacf27b5ff7b49e6` · 실제 PNG/SVG 시각 판독 완료
- Q15 `solutionImage` — `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q15-solution.svg` · Git blob `eab832118df62b85e91ae90eb5fbecccd59196db` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q21 `solutionImage` — `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q21-solution.svg` · Git blob `ae75f94346805d9146be8988c9acab85d841e46a` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수의 계산` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
등식 $\sqrt[3]{16} + \sqrt[3]{54} + \sqrt[3]{2} = a \times \sqrt[3]{2}$ 를 만족시키는 유리수 $a$ 의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. 4
3. 5
4. 6
5. 8
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 거듭제곱근 내부를 소인수분해하여 공통 인수를 추출함.\n$i) 각 항의 성질 분석$\n$\sqrt[3]{16} = \sqrt[3]{2^4} = \sqrt[3]{2^3 \cdot 2} = 2\sqrt[3]{2}$\n$\sqrt[3]{54} = \sqrt[3]{2 \cdot 3^3} = 3\sqrt[3]{2}$\n$ii) 식의 결합 및 연산 전개$\n$\implies 2\sqrt[3]{2} + 3\sqrt[3]{2} + \sqrt[3]{2} = (2 + 3 + 1)\sqrt[3]{2}$\n$\implies 6\sqrt[3]{2}$\n$\because 6\sqrt[3]{2} = a\sqrt[3]{2}$\n$\therefore a = 6$
````

- **독립 판정·핵심 연결/검산:** 세제곱근의 성질로 \(\sqrt[3]{16}=2\sqrt[3]2,\ \sqrt[3]{54}=3\sqrt[3]2\); 합 \(6\sqrt[3]2\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `로그부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
부등식 $\log_{3}(3x-6) < 3$ 을 만족시키는 자연수 $x$ 의 개수는? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 6
2. 8
3. 10
4. 12
5. 14
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그부등식은 진수 조건($>0$)을 먼저 설정한 후 밑의 조건에 따라 해를 구함.\n$i) 진수 조건 확인$\n$3x - 6 > 0 \implies 3x > 6 \implies x > 2 \quad \cdots (1)$\n$ii) 로그부등식 풀이$\n$\log_{3}(3x-6) < 3 \implies 3x-6 < 3^3$\n$\implies 3x-6 < 27 \implies 3x < 33 \implies x < 11 \quad \cdots (2)$\n$iii) 공통 범위 추출$\n$(1), (2)$에 의해 $2 < x < 11$ 이므로 자연수 $x$ 는 $3, 4, 5, 6, 7, 8, 9, 10$ 임.\n$\therefore 8$개
````

- **독립 판정·핵심 연결/검산:** 진수 \(3x-6>0\)와 \(3x-6<27\)을 함께 적용하면 \(2<x<11\), 자연수 \(3,\ldots,10\) 8개, ②.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q2-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수함수의 최대최소` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$3 \le x \le 5$ 일 때, 함수 $y = (\frac{1}{3})^{x-5} + 3$ 의 최댓값을 $M$, 최솟값을 $m$ 이라 하자. $M-m$ 의 값은? [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 4
3. 6
4. 8
5. 10
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수함수의 밑($\frac{1}{3}$)이 $0 < a < 1$ 이므로 감소함수임을 이용함.\n$i) 감소함수의 성질 적용$\n$x$ 값이 작을수록 함숫값이 커지고, $x$ 값이 클수록 함숫값이 작아짐.\n$ii) 최댓값  M  계산$\n$x=3$ 일 때, $M = (\frac{1}{3})^{3-5} + 3 = (\frac{1}{3})^{-2} + 3 = 3^2 + 3 = 12$\n$iii) 최솟값  m  계산$\n$x=5$ 일 때, $m = (\frac{1}{3})^{5-5} + 3 = (\frac{1}{3})^0 + 3 = 1 + 3 = 4$\n$\therefore M - m = 12 - 4 = 8$
````

- **독립 판정·핵심 연결/검산:** \(1/3\)을 밑으로 하는 함수는 감소; 구간 \(x=3,5\)에서 값 12와 4, 차 8, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수법칙의 응용` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
실수 $x$ 에 대하여 $\frac{2^{x}-2^{-x}}{2^{x}+2^{-x}} = \frac{1}{2}$ 일 때, $4^{x}-4^{-x}$ 의 값은? [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{3}$
2. $\frac{2}{3}$
3. $\frac{5}{3}$
4. $\frac{7}{3}$
5. $\frac{8}{3}$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 분자·분모에 $2^x$ 를 곱하여 $4^x$ 꼴로 치환 유도함.\n$i) 식의 정리$\n$\frac{2^x(2^x - 2^{-x})}{2^x(2^x + 2^{-x})} = \frac{1}{2} \implies \frac{2^{2x} - 1}{2^{2x} + 1} = \frac{1}{2}$\n$\frac{4^x - 1}{4^x + 1} = \frac{1}{2} \implies 2(4^x - 1) = 4^x + 1$\n$2 \cdot 4^x - 2 = 4^x + 1 \implies 4^x = 3$\n$ii) 목표 식 계산$\n$4^x - 4^{-x} = 3 - \frac{1}{3} = \frac{8}{3}$\n$\therefore \frac{8}{3}$
````

- **독립 판정·핵심 연결/검산:** \(t=2^x>0\)로 두면 \((t-t^{-1})/(t+t^{-1})=1/2\Rightarrow t^2=3\); \(4^x-4^{-x}=3-1/3=8/3\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `부채꼴의 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
호의 길이가 $8\pi$, 넓이가 $48\pi$ 인 부채꼴의 반지름의 길이를 $r$, 중심각의 크기를 $\theta$ 라 할 때, $\frac{r\pi}{\theta}$ 의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 9
2. 12
3. 15
4. 18
5. 21
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 부채꼴의 넓이 공식 $S = \frac{1}{2}rl$ 을 이용함.\n$i) 반지름  r  도출$\n$48\pi = \frac{1}{2} \cdot r \cdot 8\pi \implies 48 = 4r \implies r = 12$\n$ii) 중심각  \theta  도출$\n$l = r\theta \implies 8\pi = 12\theta \implies \theta = \frac{8\pi}{12} = \frac{2}{3}\pi$\n$iii) 최종 계산$\n$\frac{12\pi}{2\pi/3} = 12 \times \frac{3}{2} = 18$\n$\therefore 18$
````

- **독립 판정·핵심 연결/검산:** \(S=(rl)/2\)에서 \(r=12\), \(\theta=l/r=2\pi/3\); \(r\pi/\theta=18\), ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 정의` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
각 $\theta$ 가 제 3사분면의 각이고 $\tan\theta = \frac{4}{3}$ 일 때, $\sin\theta$ 의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-\frac{4}{5}$
2. $-\frac{3}{4}$
3. $-\frac{3}{5}$
4. $\frac{3}{5}$
5. $\frac{4}{5}$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 사분면의 위치를 통해 각 함수의 부호를 결정함.\n$i) 부호 결정$\n제 3사분면에서는 $\tan$ 만 양수, $\sin$ 과 $\cos$ 은 음수임.\n$ii) 삼각비 계산$\n$\tan\theta = \frac{y}{x} = \frac{-4}{-3}$ 로 두면 빗변 $r = \sqrt{(-3)^2 + (-4)^2} = 5$\n$\sin\theta = \frac{y}{r} = \frac{-4}{5}$\n$\therefore -\frac{4}{5}$
````

- **독립 판정·핵심 연결/검산:** 제3사분면의 \(\tan\theta=4/3\)은 \(\sin\theta=-4/5,\cos\theta=-3/5\)에 대응, ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `거듭제곱근의 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$n$ 이 2 이상의 자연수일 때, 보기 중 옳은 것만을 있는 대로 고른 것은? <div style='border:1px solid #000; padding:10px;'>ㄱ. $n$이 홀수일 때, 양의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\sqrt[n]{a}, -\sqrt[n]{a}$이다.<br>ㄴ. $n$이 홀수일 때, 음의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\sqrt[n]{a}$이다.<br>ㄷ. $n$이 짝수일 때, 양의 실수 $a$의 $n$제곱근 중에서 실수인 것은 $\pm\sqrt[n]{a}$이다.<br>ㄹ. $n$이 짝수일 때, 음의 실수 $a$의 $n$제곱근 중에서 실수는 존재하지 않는다.</div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ, ㄴ
2. ㄱ, ㄷ
3. ㄴ, ㄹ
4. ㄴ, ㄷ, ㄹ
5. ㄱ, ㄹ
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수 $n$ 의 홀/짝과 $a$ 의 부호에 따른 실근의 개수를 분류함.\nㄱ. $n$ 이 홀수이면 실근은 부호에 관계없이 오직 $1$개임. (거짓)\nㄴ. 홀수 제곱근은 음수 $a$ 에 대해서도 항상 실수인 $\sqrt[n]{a}$ 가 존재함. (참)\nㄷ. 짝수 제곱근은 양수 $a$ 에 대해 양/음 2개가 존재함. (참)\nㄹ. 음수의 짝수 제곱근 중 실수는 정의되지 않음. (참)\n$\therefore$ ㄴ, ㄷ, ㄹ
````

- **독립 판정·핵심 연결/검산:** 음수의 홀수제곱근은 실수 하나, 양수의 짝수제곱근은 실수 둘 등 부호·짝홀성을 따져 ㄴ·ㄷ·ㄹ이 참, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q08 — UPGRADE

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `로그의 연산 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
보기 중 옳은 것만을 고른 것은? (단, $x, y > 0, a > 0, a \neq 1$) <div style='border:1px solid #000; padding:10px;'>ㄱ. $\log_a x \log_a y = \log_a x + \log_a y$<br>ㄴ. $\frac{\log_a x}{\log_a y} = \log_y x$<br>ㄷ. $\log_a (x-y) = \log_a x - \log_a y$<br>ㄹ. $(\log_a x)^n = n \log_a x$</div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄴ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그의 기본 공식과 밑 변환 공식을 정확히 판별함.\nㄱ. $\log_a x + \log_a y = \log_a (xy)$ 이므로 곱셈은 성립하지 않음. (거짓)\nㄴ. 밑 변환 공식 $\frac{\log_a x}{\log_a y} = \log_y x$ 는 참임. (참)\nㄷ. $\log_a x - \log_a y = \log_a (\frac{x}{y})$ 임. (거짓)\nㄹ. $\log_a (x^n) = n\log_a x$ 이나, 전체의 $n$제곱과는 다름. (거짓)\n$\therefore$ ㄴ
````

- **독립 판정·핵심 연결/검산:** **UPGRADE:** ㄱ의 곱과 합은 다르고, ㄷ은 로그의 몫 공식과 혼동했고, ㄹ은 로그 앞의 배수와 로그값 전체의 거듭제곱이 다름. ㄴ의 밑변환식만 참(②)이나 **주어진 \(y>0\)에는 \(y=1\)이 포함되어 두 로그식이 미정의**. 학생용 해설에 \(y\ne1\)이 추가로 필요하다는 정의역 주석을 명시.
- 그림 증거: 별도 문제 그림 없음
- **UPGRADE 사유:** 계산/의도된 정답은 유지하되 학생 이해도, 원본 표기 혼용 또는 정의역 조건의 명시성을 보완할 필요가 있음. 초안은 아래에 완성하여 남김. 원본 정답키 미수정.

**학생용 교체 해설 초안**

ㄱ. \(\log_a x+\log_a y=\log_a(xy)\)이다. 로그값을 곱하는 식과 혼동했으므로 거짓.

ㄴ. \(\displaystyle\log_y x=\frac{\log_a x}{\log_a y}\)는 **\(y>0,\ y\ne1\)**일 때 밑변환 공식으로 참이다. 다만 원문은 \(y>0\)만 제시하므로 \(y=1\)인 경우 식의 분모가 0이고 \(\log_y x\)도 정의되지 않는다. 출제 검토 단계에서 조건에 \(y\ne1\)을 명시해야 한다.

ㄷ. 로그의 뺄셈 공식은 \(\log_a x-\log_a y=\log_a(x/y)\)이다. \(\log_a(x-y)\)가 아니므로 거짓.

ㄹ. \(\log_a(x^n)=n\log_a x\)가 올바른 공식이다. \((\log_a x)^n\)과는 다르므로 거짓.

**의도된 답:** ㄴ, **②**. **보완 조건:** \(y\ne1\) 추가(기존 원문·정답키 미수정).


### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `상용로그의 활용` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
미세 먼지 농도가 매년 7%씩 증가할 때, 현재의 2배 이상이 되는 것은 최소 몇 년 후인가? (단, $\log 2 = 0.3010, \log 1.07 = 0.03$)
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 9
2. 10
3. 11
4. 12
5. 13
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 매년 일정한 비율로 증가하는 원리(복리)를 이용하여 식을 세움.\n$A(1 + 0.07)^n \ge 2A \implies (1.07)^n \ge 2$\n양변에 상용로그를 취함.\n$n \log 1.07 \ge \log 2 \implies 0.03n \ge 0.3010$\n$n \ge \frac{0.3010}{0.03} = 10.033\dots$\n$\therefore$ 최소 11년 후
````

- **독립 판정·핵심 연결/검산:** 매년 7% 성장 시 \(1.07^n\ge2\); 제시된 \(\log1.07=.03,\ \log2=.301\)로 \(n\ge10.033\ldots\), 처음 \(n=11\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수의 대소 비교` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
네 수 $\sqrt{\sqrt{\frac{1}{8}}}, \sqrt[3]{\frac{1}{16}}, 0.125^{\frac{2}{9}}, 32^{-0.3}$ 중 가장 큰 수를 $M$ 이라 할 때, $M^{-3}$ 의 값은? [4.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 4
3. 6
4. 8
5. 10
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 밑을 $2$ 로 통일하여 지수값의 크기를 비교함.\n(1) $\sqrt{\sqrt{2^{-3}}} = (2^{-3})^{\frac{1}{4}} = 2^{-\frac{3}{4}} = 2^{-0.75}$\n(2) $\sqrt[3]{2^{-4}} = 2^{-\frac{4}{3}} \approx 2^{-1.33}$\n(3) $(2^{-3})^{\frac{2}{9}} = 2^{-\frac{6}{9}} = 2^{-\frac{2}{3}} \approx 2^{-0.66}$\n(4) $(2^5)^{-0.3} = 2^{-1.5}$\n가장 큰 값 $M = 2^{-\frac{2}{3}}$\n$M^{-3} = (2^{-\frac{2}{3}})^{-3} = 2^2 = 4$\n$\therefore$ 4
````

- **독립 판정·핵심 연결/검산:** 네 지수를 밑 2로 통일하면 \(-3/4,-4/3,-2/3,-3/2\) 중 가장 큰 지수는 \(-2/3\). \(M=2^{-2/3}\)이므로 \(M^{-3}=4\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수/로그의 역함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
두 함수 $y=\log_2(2-x)+3, y=\log_{\frac{1}{3}}(x-8)+5$ 의 역함수를 각각 $f(x), g(x)$ 라 하자. 모든 실수 $x$ 에 대하여 $f(x) < n < g(x)$ 를 만족시키는 정수 $n$ 의 개수는? [4.6점]
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
<b>[Logical Anchor]</b> 역함수를 구하여 지수함수의 치역(점근선)을 통한 부등식을 수립함.\n(상세 유도 과정)\n$f(x) = 2 - 2^{x-3} < 2$ (치역: $y < 2$)\n$g(x) = 8 + 3^{5-x} > 8$ (치역: $y > 8$)\n정수 $n$ 은 $f(x)$ 의 최댓값 경계 $2$ 부터 $g(x)$ 의 최솟값 경계 $8$ 사이의 값을 가짐.\n$2 \le n \le 8 \implies n \in \{2, 3, 4, 5, 6, 7, 8\}$\n$\therefore 7$개
````

- **독립 판정·핵심 연결/검산:** \(f(x)=2-2^{x-3}<2\), \(g(x)=8+(1/3)^{x-5}>8\). 모든 \(x\)에서 \(f(x)<n<g(x)\)인 정수는 \(2,\ldots,8\), 7개, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 각 변환` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin\left(\frac{\pi}{2}+\theta\right)+\sin(\pi-\theta)+\cos\left(\frac{\pi}{2}+\theta\right)+\cos(-\theta)=a$, $\cos^{2}\theta(1+\tan\theta)^{2}+2\sin\theta(1-\cos\theta)-1=b$ 라 할 때, 두 상수 $a, b$에 대하여 $a^{2}+b^{2}$ 의 값은? [4.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 각 변환 공식으로 $a$, $b$를 $\theta$의 식으로 단순화함.\n$a=\cos\theta+\sin\theta-\sin\theta+\cos\theta=2\cos\theta$\n$b=(\cos\theta+\sin\theta)^2+2\sin\theta-2\sin\theta\cos\theta-1=1+2\sin\theta\cos\theta+2\sin\theta-2\sin\theta\cos\theta-1=2\sin\theta$\n$\therefore a^2+b^2=4\cos^2\theta+4\sin^2\theta=4$
````

- **독립 판정·핵심 연결/검산:** \(a=2\cos\theta,b=2\sin\theta\)에서 \(a^2+b^2=4(\cos^2+\sin^2)=4\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `삼각함수의 그래프` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y = a \cos(bx-c)$ 의 그래프가 다음과 같을 때, $\frac{abc}{\pi}$ 의 최솟값은? (단, $a, b, c > 0$) [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 6
2. 7
3. 8
4. 9
5. 10
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 그래프의 진폭(최대/최소), 주기, 평행이동을 순차적으로 분석함.\n$i)  a  도출: 최댓값  3,  최솟값  -3 \implies a = 3$\n$ii)  b  도출: 주기가  \pi \implies \frac{2\pi}{b} = \pi \implies b = 2$\n$iii)  c  도출:  x = \frac{5}{6}\pi  에서 최대  3 \implies 2(\frac{5}{6}\pi) - c = 0 \implies c = \frac{5}{3}\pi$\n$iv) 계산:  \frac{3 \cdot 2 \cdot 5/3\pi}{\pi} = 10$\n$\therefore 10$
````

- **독립 판정·핵심 연결/검산:** 실물 그래프에서 최대 3·최소 -3으로 \(a=3\), 이웃 극대점 \(5\pi/6,11\pi/6\) 간격 \(\pi\)로 \(b=2\); 첫 극대 위치에서 가장 작은 \(c=5\pi/3\), \(abc/\pi=10\), ⑤.
- 그림 증거: `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q13.png` (시각 검토, blob `9d833fe78a049e4379cf089feacf27b5ff7b49e6`)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q14 — HOLD

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `산술·기하 평균과 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
1이 아닌 서로 다른 두 양수 $a, b$ 가 $\log_a b = \log_b a$ 를 만족시킬 때, $(a+2)(b+2)$ 의 최솟값은? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그의 상등 조건으로부터 $ab=1$ 관계를 유도함.\n$\log_a b = \frac{1}{\log_a b} \implies (\log_a b)^2 = 1$\n$a \neq b$ 이므로 $\log_a b = -1 \implies b = a^{-1} \implies ab = 1$\n$(a+2)(b+2) = ab + 2(a+b) + 4 = 1 + 2(a+b) + 4 = 5 + 2(a+b)$\n산술·기하 평균 부등식 적용: $a+b \ge 2\sqrt{ab} = 2$\n최솟값 $= 5 + 2(2) = 9$\n$\therefore 9$
````

- **독립 판정·핵심 연결/검산:** **HOLD:** 주어진 \(a,b>0,\ a,b\ne1,\ a\ne b\), \(\log_a b=\log_b a\)에서 \((\log a)^2=(\log b)^2\)이며 \(a\ne b\)이므로 \(ab=1\). \((a+2)(b+2)=5+2(a+1/a)>9\) (등호 \(a=1\)은 금지). **최솟값은 존재하지 않고 하한만 9**이므로 원본 정답 ②는 그대로 출고 불가.
- 그림 증거: 별도 문제 그림 없음
- **HOLD 사유:** 원문 문항의 수학적 조건과 원본 정답 사이에 실제 충돌이 있어 자동 출고 불가. 기존 정답키는 감사 증거로 보존하며 출제자 수정 후 재감사 필요.

**보류 근거 및 수정 권고**

- 원본 정답 `②(9)`를 **보존**하되 ‘최솟값’이 존재하지 않으므로 출고 **HOLD**.
- \(\log_a b=\log_b a\)에서 \(\frac{\ln b}{\ln a}=\frac{\ln a}{\ln b}\). \(\ln a,\ln b\ne0\)이고 \(a\ne b\)이므로 \(\ln b=-\ln a\), 즉 \(ab=1\).
- 목적식 \(F=(a+2)(b+2)=ab+2a+2b+4=5+2(a+1/a)\). \(a>0,\ a\ne1\)에서 \(a+1/a>2\)이므로 **항상 \(F>9\)**.
- \(a\to1^+\), \(b=1/a\to1^-\)로 잡으면 \(F\to9\)이므로 9는 하한/하극한 값일 뿐 달성되는 최소값이 아니다.
- **수정 권고:** ‘최솟값’ 대신 ‘하한’·‘최솟값이 존재하지 않음을 설명’ 등의 물음으로 바꾸고 보기·정답을 동시 검수하거나, 정의역 조건을 재설계. 승인 전 원본 수정 금지.


### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `로그함수의 최대최소` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y = \log_{3}(x-1) + \log_{3}(7-x)$ 에 대한 설명으로 옳은 것은? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 그래프는 점 $(4, 1)$을 지난다.
2. 함수의 최댓값은 4이다.
3. $x$의 값이 증가하면 $y$의 값도 증가한다.
4. 정의역은 $\{x|1 \le x \le 7\}$이다.
5. 치역은 $\{y|y \le 2\}$이다.
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 진수 조건과 로그의 결합을 통해 이차함수의 범위를 분석함.\n$i) 진수 조건:  x-1 > 0, 7-x > 0 \implies 1 < x < 7$\n$ii) 식 정리:  y = \log_3 \{(x-1)(7-x)\} = \log_3 (-x^2 + 8x - 7)$\n$iii) 이차함수 분석:  -x^2 + 8x - 7 = -(x-4)^2 + 9$\n진수의 최댓값은 $9$ 이므로 $y$ 의 최댓값은 $\log_3 9 = 2$ 임.\n$\therefore$ 치역은 $y \le 2$ 이다.
````

- **독립 판정·핵심 연결/검산:** \(y=\log_3[(x-1)(7-x)]\), \(1<x<7\). 진수는 \(x=4\)에서 최대 9, \(y_{\max}=2\), ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q15-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `삼각방정식의 실근` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
방정식 $\cos^{2}x - \sin x + 1 - k = 0$ 이 실근을 갖도록 하는 실수 $k$ 의 범위가 $a \le k \le b$ 일 때, $b-a$ 의 값은? [4.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1/4
2. 3/4
3. 5/4
4. 7/4
5. 9/4
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> $\sin$ 으로 변수를 통일하여 이차함수의 근의 분리로 해석함.\n$(1 - \sin^2 x) - \sin x + 1 - k = 0$\n$\sin x = t \ (-1 \le t \le 1)$ 라 치환\n$k = -t^2 - t + 2$\n이차함수 $f(t) = -(t + \frac{1}{2})^2 + \frac{9}{4}$ 의 범위를 분석함.\n$t = -\frac{1}{2}$ 일 때 최대 $\frac{9}{4}$, $t = 1$ 일 때 최소 $0$\n실근 범위: $0 \le k \le 9/4$\n$\therefore b - a = \frac{9}{4}$
````

- **독립 판정·핵심 연결/검산:** \(\sin\theta=s\in[-1,1]\)에서 \(k=2-s^2-s\)는 최소 0, 최대 \(9/4\); 차 \(9/4\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `이차방정식과 지수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
이차방정식 $x^{2}-3x-5=0$ 의 두 근을 $\alpha, \beta$ 라 할 때, $2^{\frac{1}{\alpha^{2}-5}} \times 2^{\frac{1}{\beta^{2}-5}}$ 의 값은? [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1/\sqrt[5]{2^2}$
2. $1/\sqrt[5]{2^3}$
3. $1/\sqrt[5]{2}$
4. $2/\sqrt[5]{2^3}$
5. $5/\sqrt[5]{2}$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 근의 대입 성질 $\alpha^2 - 3\alpha - 5 = 0$ 을 이용함.\n$\alpha^2 - 5 = 3\alpha$ 이고 $\beta^2 - 5 = 3\beta$ 임.\n지수 법칙에 의해: $2^{\frac{1}{3\alpha} + \frac{1}{3\beta}} = 2^{\frac{\alpha+\beta}{3\alpha\beta}}$\n근과 계수의 관계 $\alpha+\beta=3, \alpha\beta=-5$ 대입:\n$\implies 2^{\frac{3}{3(-5)}} = 2^{-\frac{1}{5}} = \frac{1}{\sqrt[5]{2}}$\n$\therefore \frac{1}{\sqrt[5]{2}}$
````

- **독립 판정·핵심 연결/검산:** 두 근의 합 3, 곱 -5를 이용해 \((\alpha^2-5)^{-1}+(\beta^2-5)^{-1}=-1/5\), 지수값 \(2^{-1/5}\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$-\pi \le x \le \pi$ 에서 부등식 $2\sin^{2}(x-\frac{\pi}{3}) - 3\cos(x+\frac{\pi}{6}) + 1 \le 0$ 의 해가 $a\pi \le x \le b\pi$ 일 때, $b-a$ 의 값은? [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1/3
2. 2/3
3. 1
4. 4/3
5. 5/4
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 각을 통일하기 위해 치환과 여각 공식을 활용함.\n$x - \frac{\pi}{3} = \theta$ 라 하면 $x + \frac{\pi}{6} = \theta + \frac{\pi}{2}$ 임.\n$\cos(\theta + \frac{\pi}{2}) = -\sin\theta$\n식 $\implies 2\sin^2\theta + 3\sin\theta + 1 \le 0$\n$(2\sin\theta + 1)(\sin\theta + 1) \le 0 \implies -1 \le \sin\theta \le -\frac{1}{2}$\n범위 환산 후 $b-a$ 계산 시 $\frac{2}{3}$ 도출.\n$\therefore \frac{2}{3}$
````

- **독립 판정·핵심 연결/검산:** \(\theta=x-\pi/3\)로 치환하면 \(\sin\theta\in[-1,-1/2]\), 해당 \(x\) 구간 \([-\pi/2,\pi/6]\), 길이 \(2\pi/3\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `주기함수와 직선 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 1] 방정식 $|\sin(\pi x)| = \frac{1}{4}x$ 의 서로 다른 실근의 개수를 구하시오. [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `8`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
[키포인트] 각 사인 봉우리에서 직선과의 높이 차를 확인하여 교점 수를 센다.
1단계: 왼쪽이 절댓값이므로 해가 있으려면 x≥0이다. x>4이면 x/4>1인데 |sin(πx)|≤1이므로 해가 없다. x=4에서도 왼쪽은 0, 오른쪽은 1이므로 해가 없다. 따라서 0≤x<4만 보면 된다.
2단계: 0≤x≤1에서는 g(x)=sin(πx)−x/4로 두자. g(0)=0, g(1/2)=1−1/8=7/8>0, g(1)=−1/4<0이므로 x=0 외에 (1/2,1)에 적어도 한 근이 있다. 사인 반주기의 그래프는 아래로 엄밀히 굽어 있어 직선 x축과 세 점에서 만날 수 없다. 실제로 세 교점이 있다면 가운데 점의 그래프가 양 끝 교점을 잇는 선분보다 위에 있어야 하여 높이가 0보다 커지는 모순이다. 이미 x=0이 한 근이므로 (0,1)의 양의 근은 정확히 하나이다.
3단계: k=1,2,3일 때 [k,k+1]은 각각 절댓값 사인의 봉우리 하나이다. g(x)=|sin(πx)|−x/4로 두면 g(k)=−k/4<0, g(k+1)=−(k+1)/4<0이고, 가운데에서는 g(k+1/2)=1−(k+1/2)/4>0이다. 연속이므로 가운데 왼쪽과 오른쪽에 각각 적어도 한 근이 있다. 이 봉우리에서 g는 아래로 엄밀히 굽어 있어 세 근을 가질 수 없으므로 각 구간에 근이 정확히 두 개씩 있다.
4단계: 전체 근은 x=0 한 개, (0,1)에 한 개, (1,2),(2,3),(3,4)에 각 두 개이다. 따라서 서로 다른 실근의 개수는 1+1+2×3=8이다.
````

- **독립 판정·핵심 연결/검산:** \(|\sin(\pi x)|=x/4\)는 \(0\le x\le4\); \(x=0\) 하나, \((0,1)\) 하나, \((1,2),(2,3),(3,4)\)에서 각각 둘로 총 8개.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수와 로그의 혼합 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 2] 네 양수 $x, y, z, a$ 에 대하여 (가) $2^{x} = 3^{y} = a^{z}$ (나) $\log 3 + \log xy - \log(3x-y) = \log z$ 일 때 $a^{3}$ 의 값을 구하시오. [6.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `27/2`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 조건 (나)에서 변수 간의 역수 합 관계를 이끌어냄.\n(나) $\log(\frac{3xy}{3x-y}) = \log z \implies z = \frac{3xy}{3x-y} \implies \frac{1}{z} = \frac{3x-y}{3xy} = \frac{1}{y} - \frac{1}{3x}$\n(가) $2^x=3^y=a^z=K$ 라 두면 $x=\log_2 K, y=\log_3 K, z=\log_a K$\n$\frac{1}{z} = \log_K a, \frac{1}{y} = \log_K 3, \frac{1}{3x} = \frac{1}{3}\log_K 2 = \log_K \sqrt[3]{2}$\n$\log_K a = \log_K 3 - \log_K \sqrt[3]{2} = \log_K (\frac{3}{\sqrt[3]{2}})$\n$a = \frac{3}{\sqrt[3]{2}} \implies a^3 = \frac{27}{2}$\n$\therefore 27/2$
````

- **독립 판정·핵심 연결/검산:** \(2^x=3^y=a^z\)와 주어진 지수 관계를 로그 변환해 정리하면 \(a^3=27/2\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `ffc16d5e7e1f02d210352b136d81ac334a636d31`
- 형식/배점: `` / `NOT_PRESENT`; 문항 단원/과정: `지수부등식의 정수 해 (서술형)` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형 3] 자연수 $a, b$ 에 대하여 부등식 $b < 2^{n} \times a \le 16b$ 를 만족하는 모든 정수 $n$ 의 합이 18일 때, $a+b$가 최소가 되도록 하는 $a, b$의 값을 구하시오. [7.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `a=1, b=4`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 정수해의 합으로 $\frac{b}{a}$의 범위를 구한 뒤, $a+b$의 최솟값을 결정한다.\n$i) 정수해의 범위$\n$\frac{b}{a} < 2^n \le 16b/a \implies \log_2(\frac{b}{a}) < n \le \log_2(\frac{b}{a})+4$이다. 정수해가 연속된 네 정수이고 그 합이 18이므로 정수해는 $3,4,5,6$이다. 따라서 $2 \le \log_2(\frac{b}{a})<3$, 즉 $4 \le b/a<8$이다.\n$ii) $a+b$의 최솟값$\n$b/a\ge4$이므로 자연수 $a,b$에 대하여 $b\ge4a$이다. 따라서 $a+b\ge5a\ge5$이고, 등호는 $a=1, b=4$일 때 성립한다.\n$\therefore a=1, b=4$
````

- **독립 판정·핵심 연결/검산:** \(2^n a\)가 \(b<2^n a\le16b\) 범위에 드는 네 연속 \(n=3,4,5,6\)의 합은 18; 부등식 \(4\le b/a<8\)에서 최소 자연수쌍 \((a,b)=(1,4)\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_부영여고_1학기_중간_고2_대수/q21-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 전수 범위: Q01–Q21; 총 21개, UNREAD 0. 각 문항의 원문/보기/정답/기존 해설과 독립 계산을 수록.
- 판정 합계: KEEP 19, UPGRADE 1, HOLD 1 (총 21).
- 학생용 개선 초안: Q08; 모두 본문 수록.
- 보류: Q14; 출고 전 원문·선지·해설·정답 합동 수정 필요.
- 실물 원본 그림 1개 판독, 보조 해설 그림 3개 원본 존재 확인. 최종 학생 화면/UI 렌더·통합 QA `NOT_RUN`.
- 본 문서는 worker branch 감사 기록이다. 실제 운영 자료로 출고·배포한 상태가 아니며, 잔여 HOLD는 다음 시험지 검토 진행을 막지 않는다.
