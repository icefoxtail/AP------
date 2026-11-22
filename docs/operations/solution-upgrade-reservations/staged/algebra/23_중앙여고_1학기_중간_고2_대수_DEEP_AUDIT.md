# 2023 23_중앙여고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_중앙여고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- standardCourse: `대수`; `standardCourse` 누락 0/5, `category` 누락 0/5, `questionType` 누락·공란 5/5
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_중앙여고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `5` · actual question/answer/solution read: `5` · KEEP 3 · UPGRADE 2 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS에 수록된 5문항의 `content`·`choices`·`answer`·`solution` 전수 감사. UPGRADE는 학생용 완성 풀이, HOLD는 수학적/시각적 출제 결손의 근거와 수정 권고를 기록함. 원본 JS/PNG/SVG/정답키/`main`은 변경하지 않음.
- **원본 완결성 경계:** 중앙여고 JS에는 실제 배열 문항이 Q01–Q05, 단 5개만 있음. Q05는 ‘서술형 3’ 표기지만 앞선 미수록 문항은 본 작업에서 추측하거나 생성하지 않음. 본 감사 완료는 **현재 저장된 JS 5문항 전체**에 한정하며 원 시험지 전 문항 완비는 `UNVERIFIED`.

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


검토 방식: 소스의 실제 문제·보기·정답·기존 해설 5개 전수를 읽고, 지수·로그 정의역과 밑 조건, 부등식의 끝점, 자연수 개수, 근호 실근, 기하 거리·넓이, 삼각함수 부호·주기를 독립 계산했다. 문제 원본 PNG/SVG 0개는 모두 실물 시각 판독했으며, 보조 `solutionImage` 2개는 Git blob 실파일 존재를 확인했다. 학생 최종 렌더·보조 그림 전수 시각 검수·`preflight.mjs`·Golden/Negative·운영 출고·SHA-256 영수증은 `NOT_RUN`.

메타데이터 주의: 비어 있는 `standardCourse`/`category`/`questionType`은 원본 공란을 그대로 `NOT_PRESENT`로 기록했다. 파일명과 표준 단원키는 참조 단서이지 원본 키 값을 임의 보충하지 않는다.

## 문제·보조 해설 이미지 원격 실물 증거

- Q04 `solutionImage` — `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q4-solution-v2.svg` · Git blob `48cc64a040794ba956fa4fc60772433922172f72` · 실파일/blob 확인, 시각 판독 NOT_RUN
- Q05 `solutionImage` — `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q5-solution.svg` · Git blob `58fb1bf1ba7d8d6e546d6687a18772e51a42dfa0` · 실파일/blob 확인, 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `지수법칙` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$a>0, a\ne 1$이고 $\sqrt[3]{a^2} = \sqrt{a\sqrt[3]{a^m}}$일 때, 상수 $m$의 값은? [3.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{5}{2}$
2. 3
3. 2
4. 1
5. $\frac{3}{2}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 거듭제곱근의 성질을 지수 법칙으로 변환하여 밑을 통일한 뒤 지수를 비교함.\n주어진 식의 좌변과 우변을 유리수 지수 형태로 변형함.\n$i) 좌변:  \sqrt[3]{a^2} = a^{\frac{2}{3}}$\n$ii) 우변:  \sqrt{a\sqrt[3]{a^m}} = (a \cdot a^{\frac{m}{3}})^{\frac{1}{2}} = (a^{1 + \frac{m}{3}})^{\frac{1}{2}}$\n지수 법칙 $(a^n)^m = a^{nm}$을 적용하여 우변을 정리함.\n$\implies a^{(\frac{3+m}{3}) \cdot \frac{1}{2}} = a^{\frac{3+m}{6}}$\n$\because$ 밑 $a$가 양수이고 $1$이 아니므로, 등식이 성립하려면 지수가 동일해야 함.\n$\implies \frac{2}{3} = \frac{3+m}{6}$\n양변에 $6$을 곱하여 일차방정식을 해결함.\n$4 = 3 + m \implies m = 1$\n$\therefore 1$
````

- **독립 판정·핵심 연결/검산:** \(a^{2/3}=a^{(3+m)/6}\), \(a>0\ne1\)이므로 \(4=3+m\Rightarrow m=1\), 보기④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q02 — UPGRADE

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `거듭제곱근의 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$100 \le a \le 130, 5 \le b \le 10$일 때, $\sqrt[3]{a} + \sqrt{b}$의 값이 자연수가 되도록 하는 두 자연수 $a, b$에 대하여 $a-b$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 120
2. 118
3. 114
4. 116
5. 122
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 두 무리수의 합이 자연수가 되기 위해서는 각 항이 각각 유리수(자연수)가 되어야 함.\n$\sqrt[3]{a}$와 $\sqrt{b}$가 각각 자연수가 되는 조건을 탐색함.\n$i)  a  의 조건 분석: $\n$a$는 어떤 자연수의 세제곱수($k^3$)여야 함.\n주어진 범위 $100 \le a \le 130$ 내의 세제곱수를 나열함.\n$4^3 = 64$ (범위 미달), $5^3 = 125$ (포함), $6^3 = 216$ (범위 초과)\n$\therefore a = 125$\n$ii)  b  의 조건 분석: $\n$b$는 어떤 자연수의 제곱수($n^2$)여야 함.\n주어진 범위 $5 \le b \le 10$ 내의 제곱수를 나열함.\n$2^2 = 4$ (범위 미달), $3^2 = 9$ (포함), $4^2 = 16$ (범위 초과)\n$\therefore b = 9$\n$iii) 최종 값 산출: $\n$a - b = 125 - 9 = 116$\n$\therefore 116$
````

- **독립 판정·핵심 연결/검산:** **UPGRADE:** 범위에서 유일한 완전세제곱은 \(a=125\), 완전제곱은 \(b=9\), \(a-b=116\), ④. 원본의 ‘두 무리수가 합쳐 정수가 되면 각자 정수’라는 일반 주장은 거짓이므로 이 특수한 세제곱근·제곱근의 성질을 증명해서 사용해야 함.
- 그림 증거: 별도 문제 그림 없음
- **UPGRADE 사유:** 원문 정답 또는 계산은 유지하되 풀이의 엄밀성, 출제 조건의 명확성, 그래프 표기 가독성 개선이 필요. 학생용 보완 풀이를 완성해 아래 남김. 원본 정답키 미수정.

**학생용 교체·보완 해설 초안**

**1. 합이 정수일 때 두 근호를 따져 본다.** \(N=\sqrt[3]a+\sqrt b\in\mathbb N\)라 하자. \(\sqrt b=N-\sqrt[3]a\)이다. \(u=\sqrt b\)라고 놓으면
\[
a=(N-u)^3=N^3+3Nb-(3N^2+b)u.
\]
\(a,N,b\)는 정수이고 \(3N^2+b>0\)이므로, \(u\)가 무리수라면 우변이 무리수가 되어 모순이다. 따라서 \(u=\sqrt b\)는 유리수이고, 정수 \(b\)의 제곱근이 유리수이면 정수이다.

**2. 범위에서 \(b\)를 정한다.** \(5\le b\le10\) 중 완전제곱수는 \(9\)뿐이므로 \(b=9\), \(\sqrt b=3\).

**3. \(a\)를 정한다.** \(N=\sqrt[3]a+3\)이 정수이므로 \(\sqrt[3]a\)는 정수이다. \(100\le a\le130\)에서 완전세제곱수는 \(125=5^3\)뿐이다.

**답:** \(a-b=125-9=116\), **④**. 원본의 일반적 주장 ‘무리수 두 개의 합이 정수라면 각각 정수’는 거짓이므로, 위와 같은 이 문항의 특수조건 증명이 필요하다.


### Q03 — UPGRADE

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그의 정의와 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
1이 아닌 두 양수 $m, n$와 두 실수 $x, y$에 대하여 다음 두 조건이 성립할 때, $\log_m(x^2y+xy^2)$의 값을 구하시오. <div class='box'>(가) $xy$의 $n$제곱근 중 실수인 것은 $m^3$이다.<br>(나) $n^{x+y}$의 제곱근 중 양수인 것은 $n^{\frac{m}{2}}$이다.</div> [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $3n+1$
2. $m+n+2$
3. $m+2$
4. $2m+n$
5. $m+3n$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 거듭제곱근의 정의를 지수 식으로 변환하여 $xy$와 $x+y$에 대한 관계식을 유도함.\n$i) 조건 (가) 해석: $\n$xy$의 $n$제곱근이 $m^3$이라는 것은 $(m^3)^n = xy$를 의미함.\n$\therefore xy = m^{3n} \quad \cdots (1)$\n$ii) 조건 (나) 해석: $\n$n^{x+y}$의 제곱근이 $n^{\frac{m}{2}}$이라는 것은 $(n^{\frac{m}{2}})^2 = n^{x+y}$를 의미함.\n$\implies n^m = n^{x+y}$\n$\therefore x + y = m \quad \cdots (2)$\n$iii) 목표 식의 변형 및 계산: $\n구하고자 하는 식은 $\log_m(x^2y+xy^2)$ 임.\n공통인수 $xy$로 묶으면 $\log_m(xy(x+y))$ 가 됨.\n여기에 $(1)$과 $(2)$의 결과를 대입함.\n$\implies \log_m(m^{3n} \cdot m) = \log_m(m^{3n+1})$\n로그의 성질 $\log_a a^k = k$를 적용함.\n$\therefore 3n + 1$
````

- **독립 판정·핵심 연결/검산:** **UPGRADE:** (가)의 \(n\)제곱근 관계는 \(xy=(m^3)^n=m^{3n}\), (나)는 \(n^{x+y}=n^m\Rightarrow x+y=m\), 따라서 \(\log_m(xy(x+y))=3n+1\), ①. 단, 제곱근 지표 \(n\)을 양의 실수라고만 서술한 것은 정규 교육과정의 ‘\(n\)제곱근’ 정의(\(n\)은 2 이상 자연수)와 맞지 않아 명시 필요.
- 그림 증거: 별도 문제 그림 없음
- **UPGRADE 사유:** 원문 정답 또는 계산은 유지하되 풀이의 엄밀성, 출제 조건의 명확성, 그래프 표기 가독성 개선이 필요. 학생용 보완 풀이를 완성해 아래 남김. 원본 정답키 미수정.

**학생용 교체·보완 해설 초안**

**1. 거듭제곱근의 뜻을 적용한다.** (가)에서 \(m^3\)가 \(xy\)의 \(n\)제곱근이므로 \((m^3)^n=xy\), 즉 \(xy=m^{3n}\).

**2. 양의 제곱근을 지수식으로 바꾼다.** (나)에서 \(n^{m/2}\)는 \(n^{x+y}>0\)의 양의 제곱근이므로 \(n^m=n^{x+y}\). \(n>0,\ n\ne1\)이어서 \(x+y=m\)이다.

**3. 공통인수로 정리한다.**
\[
\log_m(x^2y+xy^2)=\log_m[xy(x+y)]
=\log_m(m^{3n}\cdot m)=3n+1.
\]
따라서 의도된 답은 **①**.

**출제 조건 보완:** ‘\(n\)제곱근’은 통상 지표 \(n\)이 **2 이상의 자연수**일 때 쓰이는데, 원문은 \(n\)을 1이 아닌 양수라고만 제시했다. 조건에 \(n\in\mathbb N,\ n\ge2\)를 명시해야 한다. 또한 ‘실수인 것은 \(m^3\)’이 유일한 실근을 뜻한다면 \(n\)은 홀수여야 한다.


### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그부등식의 활용` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
$x > 0$에서 부등식 $x^{\log_2 x} \ge kx^2$이 항상 성립하도록 하는 양수 $k$의 범위는? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $0 < k \le \frac{1}{2}$
2. 32
3. $0 < k \le \frac{1}{4}$
4. $0 < k \le \frac{1}{5}$
5. $0 < k \le \frac{1}{6}$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 지수에 로그가 포함된 부등식은 양변에 로그를 취하여 이차부등식의 판별식 문제로 전환함.\n지수의 밑이 $2$인 로그가 있으므로 양변에 밑이 $2$인 로그를 취함.\n$\log_2 (x^{\log_2 x}) \ge \log_2 (kx^2)$\n$\implies (\log_2 x) \cdot (\log_2 x) \ge \log_2 k + 2\log_2 x$\n$i) 치환 및 식 정리: $\n$\log_2 x = t$라 치환함. $x > 0$일 때 $t$는 모든 실수를 가짐.\n$t^2 \ge \log_2 k + 2t$\n$\implies t^2 - 2t - \log_2 k \ge 0 \quad \cdots (*)$\n$ii) 항상 성립할 조건 분석: $\n모든 실수 $t$에 대해 $(*)$이 성립하려면, 이차함수의 그래프가 $t$축과 만나지 않거나 접해야 함.\n$\implies$ 판별식 $D \le 0$ 이어야 함.\n$\frac{D}{4} = (-1)^2 - 1 \cdot (-\log_2 k) \le 0$\n$1 + \log_2 k \le 0 \implies \log_2 k \le -1$\n$iii)  k  의 범위 산출: $\n$\log_2 k \le \log_2 2^{-1} \implies k \le \frac{1}{2}$\n조건에서 $k$는 양수이므로,\n$\therefore 0 < k \le \frac{1}{2}$
````

- **독립 판정·핵심 연결/검산:** \(t=\log_2x\in\mathbb R\)이면 \(t^2-2t-\log_2k=(t-1)^2-(1+\log_2k)\). 모든 실수에서 0 이상이려면 \(1+\log_2k\le0\), \(0<k\le1/2\), ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q4-solution-v2.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `c4fe8565220eacc79ce4a4d30a88b50f7df245ea`
- 형식/배점: `NOT_PRESENT` / `NOT_PRESENT`; 문항 단원/과정: `로그방정식의 근의 분리` / `대수`
- **원문 문제·조건 (`content` 그대로):**

````text
[서술형3] $(\log_3 x)^2 - 2\log_3 x + k = 0$의 한 근이 $3x^2-4x+1=0$의 두 근 사이에 있을 때, 두 근의 곱과 상수 $k$의 범위를 구하시오. [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1.  
2.  
3.  
4.  
5.
````

- 원본 `answer`: `9, -3 < k < 0`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<b>[Logical Anchor]</b> 로그의 치환을 통해 방정식의 근을 새로운 변수의 범위로 매핑하여 근의 위치 조건을 해결함.\n$i) 기준 방정식의 해 도출: $\n$3x^2 - 4x + 1 = 0 \implies (3x - 1)(x - 1) = 0$\n$\therefore x = \frac{1}{3}, \ 1$\n$ii) 로그 방정식의 치환: $\n$\log_3 x = t$라 하면 주어진 식은 $t^2 - 2t + k = 0$ 이 됨.\n한 근 $x$가 $\frac{1}{3} < x < 1$ 사이에 존재해야 하므로,\n$\implies \log_3 \frac{1}{3} < t < \log_3 1$\n$\therefore -1 < t < 0$ 범위 내에 한 근이 존재해야 함.\n$iii) 두 근의 곱 계산: $\n치환된 방정식 $t^2 - 2t + k = 0$의 두 근을 $t_1, t_2$라 하면,\n근과 계수의 관계에 의해 $t_1 + t_2 = 2$\n$\log_3 x_1 + \log_3 x_2 = 2 \implies \log_3 (x_1x_2) = 2$\n$\therefore x_1x_2 = 3^2 = 9$\n$iv)  k  의 범위 도출: $\n$f(t) = t^2 - 2t + k$라 할 때, 대칭축이 $t=1$이므로 한 근이 $(-1, 0)$에 있으려면,\n$f(-1) \cdot f(0) < 0$ 을 만족해야 함.\n$f(-1) = 1 + 2 + k = k + 3$\n$f(0) = 0 - 0 + k = k$\n$\implies (k + 3)k < 0$\n$\therefore -3 < k < 0$
````

- **독립 판정·핵심 연결/검산:** \((3x-1)(x-1)=0\)의 두 근 \(1/3,1\) 사이 로그근은 \(-1<t=\log_3x<0\). \(t^2-2t+k\)는 \(t<1\)에서 감소하므로 \((k+3)k<0\Rightarrow-3<k<0\). 두 로그방정식 해 \(x_1x_2=3^{t_1+t_2}=3^2=9\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_중앙여고_1학기_중간_고2_대수/q5-solution.svg` (원격 존재 검증)
- **KEEP 사유:** 원문 해설의 수치·선지·정답과 독립 검산이 일치하며, 해당 문항의 조건과 끝점이 확인됨. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 원본 소스 전수: Q01–Q05, 5개, `UNREAD 0`. 원문·보기·정답·기존 해설과 독립 검산을 모두 기록.
- 판정 합계: KEEP 3, UPGRADE 2, HOLD 0 (총 5).
- 개선 해설 초안: Q02, Q03; 해당 Q에 본문 수록.
- 보류: NONE; 출제 이미지/조건 복구 뒤 재감사 필요.
- 원문 문제 그림 0개 실제 판독, 보조 해설 그림 2개 존재 검증. 최종 UI 출고 QA `NOT_RUN`.
- 중앙여고 source 배열은 5문항만 확인됨. 실제 지필 시험 전체가 5문항인지 여부는 미확인(`UNVERIFIED`). 추가 자료가 있을 경우 별도 범위 편성.
- 본 MD는 worker branch 감사 기록이며 실제 JS 교체 또는 운영 병합 상태가 아니다.
