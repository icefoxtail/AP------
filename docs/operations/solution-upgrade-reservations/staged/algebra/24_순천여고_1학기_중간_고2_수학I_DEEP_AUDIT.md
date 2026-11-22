# 2024 24_순천여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_순천여고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `de899bcac5973e43e87945d3b17e015dd911e972`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_순천여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 22 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 22문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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



검토 방식: 원본 `content`, `choices`, `answer`, `solution`을 전 문항 읽고 로그의 진수·밑 조건, 지수 양의 해, 삼각함수 범위·끝점, 교점 개수와 그림을 독립 대조했다. 모든 문항에 원문·선지·정답·기존 해설 발췌·구체적 수치 검산을 남긴다. UPGRADE는 원문을 대체할 수 있도록 새 풀이를 처음부터 끝까지 작성했다. 원본 정답 및 콘텐츠의 실제 치환은 이 MD 작성 범위 밖이다. 학생 실제 UI 렌더·`preflight.mjs`·Golden/Negative 게이트·운영 출고는 `NOT_RUN`.

## 실물 이미지·보조 해설 그림 증거

- `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q07.png` — Git blob `740d254c6fdc6a1ac28203548769f20fecef957f`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `solutionImage` 보조 해설 자산 4개: GitHub 실제 파일과 Git blob 존재 확인. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q18 `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q18-solution-v2.svg` — `21743338b8ce04a6c48c3d9cce2ee0c339be6b91`
  - Q19 `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q19-solution.svg` — `f7655dbc8b348d936f1a13a0b35881f3ac4c4d90`
  - Q20 `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q20-solution-v2.svg` — `cb12447ec2880747bd98fd02618fe6f27a378c3b`
  - Q22 `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q22-solution-v2.svg` — `1878cbb0d7549dbc9d7e6c5c33e901d1261017b9`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $3^{x+2}=\sqrt{27}$의 근은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-1$
$-\dfrac{1}{2}$
$0$
$\dfrac{1}{2}$
$1$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$3^{x+2}=\sqrt{27}$의 양변을 밑이 $3$인 거듭제곱으로 나타낸다.

$\sqrt{27}=\sqrt{3^3}=3^{\frac32}$이므로 $3^{x+2}=3^{\frac32}$이다.

밑이 같은 거듭제곱의 값이 같으므로 $x+2=\frac32$, 따라서 $x=-\frac12$이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(3^{x+2}=3^{3/2}\)에서 \(x=-1/2\), 정답 ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음은 상용로그표의 일부이다.<table class="standard-table"><thead><tr><th>수</th><th>...</th><th>4</th><th>5</th><th>6</th><th>...</th></tr></thead><tbody><tr><td>$\vdots$</td><td>...</td><td>$\vdots$</td><td>$\vdots$</td><td>$\vdots$</td><td>...</td></tr><tr><td>$5.9$</td><td>...</td><td>$.7738$</td><td>$.7745$</td><td>$.7752$</td><td>...</td></tr><tr><td>$6.0$</td><td>...</td><td>$.7810$</td><td>$.7818$</td><td>$.7825$</td><td>...</td></tr><tr><td>$6.1$</td><td>...</td><td>$.7882$</td><td>$.7889$</td><td>$.7896$</td><td>...</td></tr></tbody></table>이 표를 이용하여 구한 $\log 60.5$의 값은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$0.2182$
$0.7818$
$1.7818$
$2.7818$
$7.818$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$60.5=6.05\times10$이므로 $\log60.5=1+\log6.05$이다.

표에서 $6.0$의 행과 $5$의 열이 만나는 값은 $0.7818$이다.

따라서 $\log60.5=1+0.7818=1.7818$이고 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 상용로그표의 6.0행·5열 \(\log6.05=.7818\); \(\log60.5=1.7818\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sqrt[3]{\sqrt{a^2 b^5}} \times \sqrt{\sqrt[3]{a^4 b^7}} = a^x b^y$일 때, $x+y$의 값은? (단, $a>0, b>0$) [3.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$1$
$2$
$3$
$4$
$5$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
중첩된 제곱근을 지수로 바꾸어 각 문자의 지수를 더한다.

$\sqrt[3]{\sqrt{a^2b^5}}=(a^2b^5)^{\frac16}=a^{\frac13}b^{\frac56}$이고, $\sqrt{\sqrt[3]{a^4b^7}}=(a^4b^7)^{\frac16}=a^{\frac23}b^{\frac76}$이다.

따라서 곱은 $a^{\frac13+\frac23}b^{\frac56+\frac76}=ab^2$이다.

$x=1$, $y=2$이므로 $x+y=3$이고 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 각 중첩근의 지수를 \(1/6\)으로 바꾸면 \(a^{1/3+2/3}b^{5/6+7/6}=ab^2\), \(x+y=3\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_x (6-x)$의 값이 존재하도록 하는 모든 정수 $x$의 값의 합은? [3.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$9$
$14$
$15$
$20$
$21$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그의 밑은 양수이고 $1$이 아니어야 하며, 진수는 양수여야 한다.

밑 조건에서 $x>0$, $x\ne1$이고, 진수 조건에서 $6-x>0$, 즉 $x<6$이다.

이를 만족하는 정수는 $2,3,4,5$이므로 합은 $2+3+4+5=14$이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 로그의 밑 \(0<x\ne1\), 진수 \(x<6\)에서 정수 \(2,3,4,5\) 합 14, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $y=5^{x-1}+1$에 대한 설명으로 옳지 않은 것은? [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
그래프의 점근선은 $x=1$이다.
그래프는 점 $(1, 2)$를 지난다.
정의역은 실수 전체의 집합이다.
$x$의 값이 증가하면 $y$의 값도 증가한다.
그래프는 $y=\log_5 (x-1)+1$의 그래프와 직선 $y=x$에 대하여 대칭이다.
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y=5^{x-1}+1$은 $y=5^x$를 오른쪽으로 $1$, 위로 $1$만큼 평행이동한 그래프이다.

따라서 점근선은 수평선 $y=1$이다. $x=1$일 때 $y=2$이므로 $(1,2)$를 지나고, 정의역은 모든 실수이다. 밑 $5>1$이므로 함수는 증가한다.

점근선이 $x=1$이라는 ①이 옳지 않다. 따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 지수함수의 점근선은 \(y=1\)이며 \(x=1\)에서 값2, 증가함수·실수 전체 정의역; 수직 점근선이라는 ①만 오답.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\theta$가 제2사분면의 각이고 $\tan\theta = -\dfrac{1}{2}$일 때, $\sin\theta + \cos\theta$의 값은? [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-\dfrac{\sqrt{5}}{5}$
$0$
$\dfrac{\sqrt{5}}{5}$
$\dfrac{2\sqrt{5}}{5}$
$\dfrac{3\sqrt{5}}{5}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
제2사분면에서 $\sin\theta>0$, $\cos\theta<0$이다. $\tan\theta=\frac{\sin\theta}{\cos\theta}=-\frac12$이므로 직각삼각형의 두 변의 비를 $1:2$로 두면 빗변은 $\sqrt5$이다.

사분면에 맞는 부호를 붙여 $\sin\theta=\frac1{\sqrt5}$, $\cos\theta=-\frac2{\sqrt5}$이다.

따라서 $\sin\theta+\cos\theta=-\frac1{\sqrt5}=-\frac{\sqrt5}{5}$이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 제2사분면 \(\tan\theta=-1/2\)이므로 \(\sin=1/\sqrt5,\cos=-2/\sqrt5\), 합 \(-\sqrt5/5\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\log_3 (x+a)+b$의 그래프가 오른쪽 그림과 같을 때, 상수 $a, b$의 값에 대하여 $a+b$의 값은? [4점]<img src="assets/images/24_순천여고_1학기_중간_고2_수학I/q07.png" class="question-img" alt="문제 7 그림">
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$1$
$2$
$3$
$4$
$5$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그함수 $y=\log_3(x+a)+b$의 수직점근선은 $x=-a$이다. 그림의 점근선이 $x=-3$이므로 $a=3$이다.

그래프의 $y$절편은 $3$이다. $x=0$을 대입하면 $3=\log_3 3+b=1+b$이므로 $b=2$이다.

따라서 $a+b=5$이고 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q07.png에서 수직점근선 \(x=-3\), \(y\)절편3 확인. \(a=3,\log_3 3+b=3\)이어서 \(b=2,a+b=5\), ⑤.
- 문제 그림: `archive/assets/images/24_순천여고_1학기_중간_고2_수학I/q07.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 <보기>에서 옳은 것을 모두 고른 것은? [4점]<div class="box-content"><b><보 기></b><br>ㄱ. $-16$의 네제곱근 중에서 실수인 것은 없다.<br>ㄴ. $-5$의 다섯제곱근 중 실수인 것은 $-\sqrt[5]{5}$이다.<br>ㄷ. $\sqrt[4]{(-6)^4}$는 $-6$이다.<br>ㄹ. $n$이 짝수일 때, $-9$의 $n$제곱근 중에서 실수인 것은 2개이다.</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ, ㄴ
ㄴ, ㄷ
ㄴ, ㄹ
ㄱ, ㄴ, ㄹ
ㄱ, ㄷ, ㄹ
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
각 문장을 차례로 판단한다.

ㄱ. 짝수 제곱근은 실수에서 음수가 될 수 없으므로 $-16$의 네제곱근 중 실수는 없다. 참이다.

ㄴ. 홀수 제곱근은 음수도 가지므로 $-5$의 실수인 다섯제곱근은 $-\sqrt[5]{5}$ 하나이다. 참이다.

ㄷ. $\sqrt[4]{(-6)^4}=|-6|=6$이므로 거짓이다.

ㄹ. 짝수 제곱은 음수가 될 수 없으므로 $-9$의 실수인 $n$제곱근은 없다. 거짓이다.

옳은 것은 ㄱ, ㄴ이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 짝수근의 음수 진수는 실근 없음, \(\sqrt[4]{(-6)^4}=6\)이므로 ㄱ·ㄴ만 참, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 두 양수 $a, b$에 대하여 $\log_{\sqrt{5}} a = 4$, $\log_b \dfrac{1}{25} = -2$일 때, $\log_{b^2} a + \log_{a^2} b$의 값은? [4.1점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\dfrac{1}{2}$
$1$
$\dfrac{5}{4}$
$\dfrac{5}{2}$
$5$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 조건에서 $\log_{\sqrt5}a=4$이므로 $a=(\sqrt5)^4=25$이다.

둘째 조건에서 $\log_b\frac1{25}=-2$이므로 $b^{-2}=5^{-2}$이다. $b>0$이므로 $b=5$이다.

따라서 $\log_{b^2}a+\log_{a^2}b=\log_{25}25+\log_{625}5=1+\frac14=\frac54$이다.

따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 두 로그 조건으로 \(a=25,b=5\), \(\log_{25}25+\log_{625}5=1+1/4=5/4\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 < a < b < 1$일 때, 세 수 $A=\log_a b$, $B=\log_b a$, $C=\log_b \dfrac{b}{a}$의 대소 관계를 바르게 나타낸 것은? [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$A < B < C$
$A < C < B$
$B < C < A$
$C < A < B$
$C < B < A$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$0<a<b<1$에서 $\log a<\log b<0$이다.

$A=\log_a b=\frac{\log b}{\log a}$는 $0$과 $1$ 사이이고, $B=\log_b a=\frac1A>1$이다.

또한 $C=\log_b\frac ba=\log_b b-\log_b a=1-B<0$이다.

그러므로 $C<A<B$이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(0<a<b<1\)에서 \(0<A=\log_ab<1\), \(B=1/A>1\), \(C=1-B<0\); \(C<A<B\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x | -1 \le x \le 2\}$일 때, 함수 $y=2^{x^2-2x-1}$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M-m$의 값은? [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\dfrac{9}{4}$
$\dfrac{11}{4}$
$\dfrac{13}{4}$
$\dfrac{15}{4}$
$\dfrac{17}{4}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
지수함수 $2^t$는 증가하므로 먼저 지수 $t=x^2-2x-1$의 최댓값과 최솟값을 구한다.

$t=(x-1)^2-2$이고 $-1\le x\le2$이다. 최솟값은 $x=1$일 때 $-2$이다. 양 끝에서 $t(-1)=2$, $t(2)=-1$이므로 최댓값은 $2$이다.

따라서 $M=2^2=4$, $m=2^{-2}=\frac14$이고 $M-m=\frac{15}{4}$이다. 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 지수 \((x-1)^2-2\)의 최댓값2(\(x=-1\)), 최솟값−2(\(x=1\)); \(2^2-2^{-2}=15/4\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
양의 정수 $x, y$가 $\log (3x-1) - \log x = 1 - \log y$를 만족할 때, 다음 중 $x+y$의 값은? [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2$
$3$
$4$
$5$
$6$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그의 차를 하나의 로그로 합친다. $\log(3x-1)-\log x=\log(\frac{3x-1}{x})$이고 $1-\log y=\log10-\log y=\log(\frac{10}{y})$이다.

따라서 $\frac{3x-1}{x}=\frac{10}{y}$이므로 $x(3y-10)=y$이다. 양의 정수 $x,y$이고 좌변의 부호가 양수이므로 $3y-10>0$, 즉 $y\ge4$이다.

$y=4$이면 $x=2$, $y=5$이면 $x=1$이다. $y\ge6$이면 $x=\frac{y}{(3y-10)}<1$이므로 양의 정수 $x$가 될 수 없다.

가능한 경우는 $(x,y)=(1,5),(2,4)$이고 모두 $x+y=6$이다. 따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 상용로그를 합쳐 \(x(3y-10)=y\), 양의 정수해 \((x,y)=(2,4),(1,5)\)만 가능해 합은 모두6, ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
세 양수 $a, b, c$에 대하여 $2^a = 4^b = k^{\frac{1}{c}}$, $a+b=2abc$일 때, 실수 $k$의 값은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2$
$2\sqrt{2}$
$4$
$4\sqrt{2}$
$8$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
공통값을 $t$라 두면 $t=2^a=4^b=k^{\frac{1}{c}}>1$이다. $L=\log_2t$라 하면 $a=L$, $b=\frac L2$, $\log_2 k=cL$이다.

조건 $a+b=2abc$에 대입하면 $\frac{3L}{2}=cL^2$이다. $L>0$이므로 $cL=\frac32$이다.

따라서 $\log_2k=c\log_2t=cL=\frac32$이고 $k=2^{\frac{3}{2}}=2\sqrt2$이다. 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 공통값 \(t=2^a=4^b=k^{1/c}\), \(a+b=2abc\)에서 \(c\log_2t=3/2\); \(k=2^{3/2}=2\sqrt2\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$(3^{\log_{\sqrt{3}} 2} + 7^{\log_7 3})^2 - (3^{\log_{\sqrt{3}} 2} - 7^{\log_7 3})^2$의 값은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$7$
$21$
$28$
$42$
$48$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$3^{\log_{\sqrt3}2}=3^{2\log_3 2}=2^2=4$이고, $7^{\log_7 3}=3$이다.

항등식 $(u+v)^2-(u-v)^2=4uv$를 이용하면 주어진 값은 $4\cdot4\cdot3=48$이다.

따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** \(3^{\log_{\sqrt3}2}=4\), \(7^{\log_7 3}=3\); 제곱 차 \(4uv=4\cdot4\cdot3=48\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 함수 $y=\log_3 x$, $y=\log_5 (x+2)$에 대하여 다음 <보기>에서 옳은 것만을 있는 대로 고른 것은? [4.5점]<div class="box-content"><b><보 기></b><br>ㄱ. 두 함수의 교점의 $y$좌표는 1이다.<br>ㄴ. $\log_3 1.5 < \log_5 3.5$<br>ㄷ. $\log_3 4 < \log_5 6$</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄱ, ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
교점의 좌표를 $(x,y)$라 하자. $y=\log_3 x=\log_5(x+2)$이므로 $x=3^y$, $x+2=5^y$이고, 따라서 $5^y-3^y=2$이다. 오른쪽이 양수이므로 $y>0$이다. $y>0$에서 $5^y-3^y=3^y((\frac{5}{3})^y-1)$은 양의 두 증가함수의 곱이므로 증가한다. $y=1$에서 값이 $2$이므로 유일한 해는 $y=1$이다. ㄱ은 참이다.

ㄴ. $\log_3 1.5<\frac{1}{2}$는 $1.5<\sqrt3$에서 성립한다. 또한 $\log_5 3.5>\frac{1}{2}$는 $3.5>\sqrt5$에서 성립하므로 ㄴ은 참이다.

ㄷ. $\log_3 4>\frac{6}{5}$는 $3^6=729<4^5=1024$에서, $\log_5 6<\frac{6}{5}$는 $5^6=15625>6^5=7776$에서 따른다. 따라서 $\log_3 4>\log_5 6$이므로 ㄷ은 거짓이다.

옳은 것은 ㄱ, ㄴ이므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 교점 높이 \(y=1\)은 유일, \(\log_3 1.5<1/2<\log_5 3.5\)은 참, \(\log_3 4>\log_5 6\)이므로 ㄱ·ㄴ만 참, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
이차방정식 $3x^2-x+a=0$의 두 근이 $\sin\theta, \cos\theta$일 때, $\tan\theta$와 $\dfrac{1}{\tan\theta}$을 두 근으로 하고 $x^2$의 계수가 4인 이차방정식은? (단, $a$는 상수) [4.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$4x^2+x+4=0$
$4x^2+3x+4=0$
$4x^2+5x+4=0$
$4x^2+7x+4=0$
$4x^2+9x+4=0$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
처음 이차방정식의 두 근이 $\sin\theta,\cos\theta$이므로 근과 계수의 관계에서 $\sin\theta+\cos\theta=\frac13$, $\sin\theta\cos\theta=\frac a3$이다.

$(\sin\theta+\cos\theta)^2=\sin^2\theta+\cos^2\theta+2\sin\theta\cos\theta$에 대입하면 $\frac19=1+\frac{2a}{3}$, 따라서 $a=-\frac43$이다.

구하려는 두 근의 합은 $\tan\theta+\frac1{\tan\theta}=\frac{\sin^2\theta+\cos^2\theta}{\sin\theta\cos\theta}=\frac1{\frac{a}{3}}=-\frac94$이고, 곱은 $1$이다.

따라서 계수가 $4$인 이차방정식은 $4x^2-4(-\frac94)x+4=0$, 즉 $4x^2+9x+4=0$이다. 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 근 합·곱에서 \(\sin\theta+\cos\theta=1/3,\sin\theta\cos\theta=-4/9\); \(\tan+1/\tan=-9/4\)로 \(4x^2+9x+4=0\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
어떤 원통형 펌프의 반지름을 $R$, 1분 동안의 유체 배출량을 $Q$, 흡입구의 유속을 $V$라 하면 $R = k\left(\dfrac{Q}{V}\right)^{\frac{1}{3}}$ (단 $V>0$, $k$는 양의 상수)가 성립한다고 한다. 두 펌프 $A, B$의 반지름을 각각 $R_A, R_B$, 1분 동안의 유체 배출량을 각각 $Q_A, Q_B$, 흡입구의 유속을 각각 $V_A, V_B$라 하자. $Q_A$가 $Q_B$의 $\dfrac{4}{3}$배, $V_A$가 $V_B$의 $\dfrac{32}{81}$배, $R_A - R_B = 30$일 때, $R_B$의 값은? [4.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$10$
$15$
$40$
$60$
$90$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$R=k(\frac{Q}{V})^{\frac{1}{3}}$에서 반지름의 비는 $\frac{R_A}{R_B}=\left(\frac{Q_A/Q_B}{V_A/V_B}\right)^{\frac{1}{3}}$이다.

주어진 비를 대입하면 $\frac{R_A}{R_B}=\left(\frac{\frac{4}{3}}{\frac{32}{81}}\right)^{\frac{1}{3}}=\left(\frac{27}{8}\right)^{\frac{1}{3}}=\frac32$이다.

그러므로 $R_A-R_B=\frac12R_B=30$이고 $R_B=60$이다. 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 배출량·유속 비의 비가 \((4/3)/(32/81)=27/8\), 반지름 비 \(3/2\); 차30에서 \(R_B=60\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1보다 큰 양수 $a$에 대하여 함수 $y=a^x+b$의 그래프와 함수 $y=\log_a (x-b)$의 그래프가 서로 다른 두 점 $A, B$에서 만나고, 다음 조건을 만족시킨다.<div class="box-content">(가) 두 점 $A, B$ 사이의 거리는 $2\sqrt{2}$이다.<br>(나) 선분 $AB$의 수직이등분선은 $x+y-2=0$이다.</div>$a+b$의 값은? (단, $b$는 상수) [4.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\sqrt{3}-1$
$\sqrt{2}-1$
$\sqrt{3}$
$\sqrt{2}+1$
$\sqrt{3}+1$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y=a^x+b$와 $y=\log_a(x-b)$는 서로 역함수의 그래프이므로 두 그래프의 교점은 직선 $y=x$에 대해 대칭이다.

두 교점이 서로 대칭인 한 쌍이라면 선분 $AB$의 수직이등분선은 $y=x$가 된다. 주어진 직선 $x+y-2=0$은 이와 다르므로 두 교점은 대칭으로 짝을 이루는 점이 아니라 각각 대칭축 위에 놓인다. 따라서 $A,B$는 $y=x$ 위에 있다.

선분의 수직이등분선 $x+y=2$와 $y=x$의 교점은 중점 $M=(1,1)$이다. $AB=2\sqrt2$이고 $AB$의 기울기는 $1$이므로 양 끝점은 중점에서 각각 $(1,1)$만큼 떨어져 $A=(0,0)$, $B=(2,2)$이다.

두 점이 $y=a^x+b$ 위에 있으므로 $x=0$에서 $1+b=0$, 따라서 $b=-1$이다. $x=2$에서 $a^2-1=2$이고 $a>1$이므로 $a=\sqrt3$이다.

따라서 $a+b=\sqrt3-1$이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 역함수 교점의 \(y=x\) 대칭성과 수직이등분선 \(x+y=2\)에서 두 교점 \((0,0),(2,2)\) 확정. \(b=-1,a=\sqrt3\), 합 \(\sqrt3-1\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
10보다 작은 자연수 $m(m \ge 2)$에 대하여 $m^{18}$의 $n$제곱근 중에서 정수가 존재하도록 하는 2 이상의 자연수 $n$의 개수가 5가 되도록 하는 모든 $m$의 값의 합은? [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$21$
$22$
$23$
$24$
$25$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$m=\prod p_i^{e_i}$로 소인수분해하면 $m^{18}=\prod p_i^{18e_i}$이다.

$m^{18}$의 $n$제곱근이 정수가 되려면 각 소인수 지수 $18e_i$가 $n$으로 나누어져야 한다. $g$를 모든 $18e_i$의 최대공약수라 하고, $N(g)$를 $g$의 약수 중 $2$ 이상인 수의 개수라 하자.

$m=2,3,5,6,7$에서는 소인수 지수의 최대공약수가 $18$이므로 가능한 $n\ge2$는 $18$의 약수 $2,3,6,9,18$의 5개이다. 표에서 이때 $g=18$, $N(g)=5$임을 확인한다.

$m=4,9$에서는 최대공약수가 $36$이라 개수가 8개이고, $m=8$에서는 최대공약수가 $54$라 개수가 7개이다.

조건을 만족하는 $m$은 $2,3,5,6,7$이므로 합은 $23$이고 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(m=2,3,5,6,7\)의 \(m^{18}\) 정수 \(n\)제곱근은 \(n=2,3,6,9,18\)의 5개; \(m=4,8,9\)는 개수가 다름. 합23, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 1] 연립부등식 $\begin{cases} \left(\dfrac{3}{4}\right)^{2x-1} \ge \left(\dfrac{4}{3}\right)^{x-5} \\ \log_2 x + \log_2 (x+4) \le 5 \end{cases}$ 을 만족하는 $x$의 범위를 구하는 과정을 서술하시오. [6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$0<x\le2$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 부등식에서 $\frac43=(\frac34)^{-1}$이므로 $(\frac34)^{2x-1}\ge(\frac34)^{5-x}$이다. 밑이 $0$과 $1$ 사이이므로 지수를 비교할 때 부등호가 바뀐다.

$2x-1\le5-x$, 따라서 $x\le2$이다.

둘째 부등식의 정의역은 $x>0$이다. 로그의 합을 곱으로 합치면 $\log_2(x(x+4))\le5$이므로 $x(x+4)\le32$이다.

$x^2+4x-32\le0$, 즉 $(x+8)(x-4)\le0$에서 $-8\le x\le4$이다. 정의역을 적용하면 $0<x\le4$이다.

두 범위의 공통 부분은 $0<x\le2$이다.
```

- **독립 판정·핵심 연결/검산:** 첫 부등식 밑 \(3/4<1\)로 \(x\le2\), 둘째 로그 정의역·진수 조건으로 \(0<x\le4\); 교집합 \(0<x\le2\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 2] 방정식 $4^x - k \cdot 2^x + k \cdot \dfrac{1}{2^x} + 3k + 5 + \dfrac{1}{4^x} = 0$ 이 실근을 갖기 위한 실수 $k$의 값의 범위는 $k \ge \alpha$ 또는 $k \le \beta$이다. $|\beta - \alpha|$의 값을 구하는 과정을 서술하시오. [7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `16`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=2^x$라 두면 $t>0$이고 $4^x=t^2$, $2^{-x}=t^{-1}$, $4^{-x}=t^{-2}$이다.

주어진 식은 $t^2+t^{-2}+5+k(3-t+t^{-1})=0$이다. $u=t-t^{-1}$라 두면 $t^2+t^{-2}=u^2+2$이고, $u$는 모든 실숫값을 가질 수 있다.

따라서 실근이 존재할 조건은 $u^2-ku+3k+7=0$이 실근을 갖는 것이다. 판별식 $D$에 대해

$D=k^2-4(3k+7)\ge0$

$(k-14)(k+2)\ge0$이다.

따라서 $k\ge14$ 또는 $k\le-2$이고 $|\beta-\alpha|=|-2-14|=16$이다.
```

- **독립 판정·핵심 연결/검산:** \(u=2^x-2^{-x}\)가 모든 실숫값을 취함. 방정식은 \(u^2-ku+3k+7=0\), 판별식 \((k-14)(k+2)\ge0\)이므로 경계 차16.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `de899bcac5973e43e87945d3b17e015dd911e972`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 3] 로그방정식 $\log_{(x^2+3x)}(2x-1) = \log_{10}(2x-1)$ 을 만족시키는 모든 근을 구하는 과정을 서술하시오. (단, 로그가 성립하기 위한 모든 조건을 반드시 포함하여 서술할 것) [7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `1, 2`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
먼저 로그가 성립하기 위한 조건을 정리한다. 진수 조건에서 $2x-1>0$, 즉 $x>\frac12$이다. 밑은 $x^2+3x>0$이고 $x^2+3x\ne1$이어야 한다. $x>\frac12$이면 밑은 양수이다.

진수가 $1$인 경우 $2x-1=1$, 즉 $x=1$이다. 이때 밑은 $4$이므로 로그가 성립하고 두 로그값은 모두 $0$이다.

이제 $x\ne1$이면 $2x-1\ne1$이다. 밑변환을 쓰면 $\frac{\log(2x-1)}{\log(x^2+3x)}=\log(2x-1)$이다. $\log(2x-1)\ne0$이므로 양변을 나누어 $\log(x^2+3x)=1$을 얻는다.

따라서 $x^2+3x=10$, 즉 $(x+5)(x-2)=0$이다. $x=-5$는 $x>\frac12$에 어긋나고, $x=2$는 조건을 만족한다.

따라서 모든 근은 $x=1,2$이다.
```

- **독립 판정·핵심 연결/검산:** 진수 \(2x-1>0\), 밑 \(x^2+3x\ne1\). 진수 1일 때 \(x=1\)을 먼저 보존하고 나머지 밑 \(10\)에서 \(x=2\); 두 근 1,2.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 22/22. 문항별 원문·정답·기존 해설·독립 계산·그림 링크를 위에 기록.
- **UPGRADE 전체 풀이 초안**: 0개 완성; 학생 노출은 아직 하지 않음.
- **HOLD**: 0개. 원본 문항 조건·답 불일치가 확정된 문항은 발견되지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 학생 실제 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **MD 작성 완료는 출고 QA 통과를 뜻하지 않는다.**

