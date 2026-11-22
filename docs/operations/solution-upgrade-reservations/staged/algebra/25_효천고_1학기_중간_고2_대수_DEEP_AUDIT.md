# 2025 25_효천고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_효천고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_효천고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 21 · UPGRADE 2 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `18`
- 범위: 전 24문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로만 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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


검토 방식: 원본 `content`, `choices`, `answer`, `solution` 전 문항을 직접 읽고 정답·로그/지수 조건·구간 끝점·부호·그래프를 대조했다. 문항별로 원문 문제·선택지·정답·기존 해설 핵심 발췌와 **독립 판정의 구체적 수치**를 기록한다. UPGRADE는 학생용 전체 새 풀이를 제공한다. HOLD는 자료가 불충분하거나 원문에 수학적 불일치가 있는 상태로 정답을 임의 수정하지 않는다. 원본 시험의 신뢰성 복구는 별도 승인·원본 대조 후 수행한다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지·보조 해설 그림 검증

- `archive/assets/images/25_효천고_1학기_중간_고2_대수/q05-problem-readable-v2.svg` — Git blob `3045108c51407357228e09daae58302047699287`; 실물 SVG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/25_효천고_1학기_중간_고2_대수/q09-audit-rework.svg` — Git blob `d8fa5fa4ad2ebfe5884ec4306a375ba3035af1fe`; 실물 SVG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/25_효천고_1학기_중간_고2_대수/q16-problem-v2.svg` — Git blob `d92fa5989cfad40bdbaca2f2ebb81c7dcdf5f3d5`; 실물 SVG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/25_효천고_1학기_중간_고2_대수/q19-audit-rework.svg` — Git blob `b731caeec811e55005b5d2323f8c26cdff6a50c4`; 실물 SVG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/25_효천고_1학기_중간_고2_대수/q23-problem-v2.svg` — Git blob `61049cee0aa98bb030151415144795a8dd8e2a40`; 실물 SVG 실제 화면 판독 및 원문 도식 조건 대조
- Q21 문제 본문 SVG — 원본 JS에서 SVG 추출·렌더 후 시각 확인 (외부 파일 blob 없음)
- Q23 문제 본문 인라인 SVG·외부 원도형 — 원본 JS에서 SVG 추출·렌더 후 시각 확인 (외부 파일 blob 없음)
- `solutionImage` 보조 해설 자산: 9개 GitHub 취득·Git blob 존재 검증. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q05 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q5-solution.svg` — `dfec3bfa4d6fc69a6387fb2ef38272e5c68a73af`
  - Q07 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q7-solution-v2.svg` — `e4ff869e805db55fcdb97329ae68e02fd8b04818`
  - Q09 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q9-solution.svg` — `f5a6b4cddea0ca7c3b6fe3a714269a8970f5120a`
  - Q10 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q10-solution.svg` — `a8d670f654e9670aa780fb5e0fb4fb3d37c11f80`
  - Q11 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q11-solution.svg` — `b429b16d04084cac02f2c516a2143d4ea69b8e89`
  - Q16 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q16-solution-v2.svg` — `c74ba9d9e6228cb2363d3ab866c869c31bec0611`
  - Q19 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q19-solution.svg` — `88e98023047963bd15e8d2778a0a4de83efbb259`
  - Q20 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q20-solution.svg` — `0747ad6a30b459990c40963b429d7816d55158f4`
  - Q21 `archive/assets/images/25_효천고_1학기_중간_고2_대수/q21-solution.svg` — `47a224807b21a5595b32c6d89679b2150fd6aef5`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 빈칸에 들어갈 것으로 옳은 것은? [3점]<br>(단, $a>0,\ a\neq 1,\ N>0$)<br><br><div style="text-align:left;"><table style="width:100%; max-width:280px; margin:0; text-align:center; border-collapse:collapse; border:1px solid black; table-layout:fixed; font-family:serif;"><tr><td colspan="5" style="border:1px solid black; padding:5px; font-weight:bold;">$a^x=N \iff x=\log_a N$</td></tr><tr><td style="border:1px solid black; padding:2px;">$5^3=125$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">①</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$5=\log_3 125$</td></tr><tr><td style="border:1px solid black; padding:2px;">②</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$4=\log_3 81$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$4^3=81$</td></tr><tr><td style="border:1px solid black; padding:2px;">$2^{-3}=\frac{1}{8}$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">③</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$-3=\log_2\frac{1}{8}$</td></tr><tr><td style="border:1px solid black; padding:2px;">④</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$-1=\log_{\frac{1}{7}}7$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$\left(\frac{1}{7}\right)^1=7$</td></tr><tr><td style="border:1px solid black; padding:2px;">$16^{\frac{1}{4}}=2$</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">⑤</td><td style="border:1px solid black; width:18px; padding:0;">$\iff$</td><td style="border:1px solid black; padding:2px;">$\frac{1}{4}=\log_2 16$</td></tr></table></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$5=\log_3 125$
$4^3=81$
$-3=\log_2\frac{1}{8}$
$\left(\frac{1}{7}\right)^1=7$
$\frac{1}{4}=\log_2 16$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
지수와 로그의 기본 정의 $a^x=N \iff x=\log_a N$을 이용하여 각 보기의 변환이 올바른지 검증한다.

주어진 지수식과 로그식의 관계가 수학적으로 참인지 확인한다.

- $5^3=125 \iff 3=\log_5 125$ 이므로 ①은 옳지 않다.
- $4=\log_3 81 \iff 3^4=81$ 이므로 ②는 옳지 않다.
- $2^{-3}=\frac{1}{8} \iff -3=\log_2\frac{1}{8}$ 이므로 ③은 옳다.
- $-1=\log_{\frac{1}{7}}7 \iff (\frac{1}{7})^{-1}=7$ 이므로 ④는 옳지 않다.
- $16^{\frac{1}{4}}=2 \iff \frac{1}{4}=\log_{16}2$ 이므로 ⑤는 옳지 않다.

따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 지수·로그 동치식을 각 보기에 대입하면 ③의 \(2^{-3}=1/8\iff -3=\log_2(1/8)\)만 참.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 선지 중 나머지 넷과 다른 값을 갖는 것은?<br>(단, $a,b,c>0,\ a,b,c\neq 1$) [3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$13^0$
$\log_7 1$
$\sqrt{2}\times2^{-\frac{1}{2}}$
$\frac{1}{\log_2 2}$
$\log_a b\times\log_b c\times\log_c a$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
지수와 로그의 기본값, 그리고 로그의 밑변환 성질을 이용해 각 보기의 값을 비교한다.

각 보기의 값을 각각 계산하여 서로 다른 값을 찾는다.

$13^0=1$ 이고, $\log_7 1=0$ 이다.
$\sqrt{2}\times2^{-\frac{1}{2}}=\sqrt{2}\times\frac{1}{\sqrt{2}}=1$ 이다.
$\frac{1}{\log_2 2}=\frac{1}{1}=1$ 이다.
또 $\log_a b\times\log_b c\times\log_c a=\frac{\log b}{\log a}\times\frac{\log c}{\log b}\times\frac{\log a}{\log c}=1$ 이다.

②만 값이 $0$이고 나머지는 모두 $1$이므로, 따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(\log_7 1=0\)이고 나머지는 밑과 진수가 같은 로그값 1이어서 ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 상용로그표를 보고 구한 $\log 2.31$의 값은? [3점]<br><br><div style="text-align:center;"><table style="border-collapse: collapse; text-align: center; width: 220px; border: 1.2px solid black; font-family: serif;"><tr style="background:#fcfcfc;"><th style="border: 1px solid black; padding: 2px;"></th><th style="border: 1px solid black; padding: 2px;">0</th><th style="border: 1px solid black; padding: 2px;">1</th><th style="border: 1px solid black; padding: 2px;">2</th><th style="border: 1px solid black; padding: 2px;">3</th></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.0</td><td style="border: 1px solid black; padding: 2px;">0.3010</td><td style="border: 1px solid black; padding: 2px;">0.3032</td><td style="border: 1px solid black; padding: 2px;">0.3054</td><td style="border: 1px solid black; padding: 2px;">0.3075</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.1</td><td style="border: 1px solid black; padding: 2px;">0.3222</td><td style="border: 1px solid black; padding: 2px;">0.3243</td><td style="border: 1px solid black; padding: 2px;">0.3263</td><td style="border: 1px solid black; padding: 2px;">0.3284</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.2</td><td style="border: 1px solid black; padding: 2px;">0.3424</td><td style="border: 1px solid black; padding: 2px;">0.3444</td><td style="border: 1px solid black; padding: 2px;">0.3464</td><td style="border: 1px solid black; padding: 2px;">0.3483</td></tr><tr><td style="border: 1px solid black; padding: 2px; font-weight: bold;">2.3</td><td style="border: 1px solid black; padding: 2px;">0.3617</td><td style="border: 1px solid black; padding: 2px;">0.3636</td><td style="border: 1px solid black; padding: 2px;">0.3655</td><td style="border: 1px solid black; padding: 2px;">0.3674</td></tr></table></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0.3010
0.3284
0.3444
0.3636
0.3674
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
상용로그표에서 소수 첫째 자리와 둘째 자리를 기준으로 위치를 찾는다.

$\log 2.31$은 2.3행과 1열에 해당하는 값을 찾으면 된다.

상용로그표에서 2.3행을 찾고, 그중 1열의 값을 읽으면 $0.3636$ 이다.

따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 상용로그표의 2.3행·1열에서 \(\log 2.31=0.3636\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
어느 지역의 해저에서 일어난 지진의 규모를 $M$, 지진으로 발생하는 해일의 최고 높이를 $H$m라고 하면<br>$M=\log H+6.5$<br>인 관계가 성립한다고 한다. 해일의 최고 높이가 $10$m일 때, 지진 규모는? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
7.5
10.5
12
14
16.5
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
주어진 식에 $H=10$을 대입하고 $\log 10=1$을 이용한다.

$M=\log H+6.5$, 해일의 높이는 $H=10$이다.

식에 $H=10$을 대입하면
$M=\log 10+6.5$ 이다.
상용로그의 성질에 의해 $\log 10=1$ 이므로
$M=1+6.5=7.5$ 이다.

따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 주어진 로그식을 변환하면 \(\log 10+6.5=1+6.5=7.5\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그래프의 식으로 옳은 것은? [3.5점]<br><br><div style="text-align:center;"><img src="assets/images/25_효천고_1학기_중간_고2_대수/q05-problem-readable-v2.svg" alt="수평점근선과 y절편이 주어진 증가 그래프" style="width:300px;max-width:100%;height:auto;"></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $y = x^2 - 2x - 3$
② $y = \left(\frac{1}{2}\right)^{x-1} + 2$
③ $y = 3^{x-1} + 2$
④ $y = \log_3(x-2)$
⑤ $y = \log_{\frac{1}{2}}(x-2)$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
주어진 그래프는 점근선이 $y=2$인 지수함수의 형태를 띠고 있으며, $y$절편이 $\frac{7}{3}$이다.
지수함수 $y = a^{x-p} + q$에서 점근선이 $y=2$이므로 $q=2$이다.
$y$절편이 $(0, \frac{7}{3})$이므로 $x=0$을 대입하면 $a^{0-p} + 2 = \frac{7}{3}$, 즉 $a^{-p} = \frac{1}{3}$이다.
보기에 있는 식 중 ③ $y = 3^{x-1} + 2$를 확인하면:
1) 점근선이 $y=2$이다.
2) $x=0$일 때 $y = 3^{-1} + 2 = \frac{1}{3} + 2 = \frac{7}{3}$이다.
3) 밑이 $3 > 1$이므로 증가하는 형태의 그래프이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 실제 SVG에 나타난 점근선 \(y=2\), \(y\)절편 \(7/3\)으로 \(y=3^{x-1}+2\)를 확인, ③.
- 문제 그림: `archive/assets/images/25_효천고_1학기_중간_고2_대수/q05-problem-readable-v2.svg` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 빈칸에 들어갈 값으로 옳은 것은? [3.5점]<br><br><div style="text-align:center;"><table style="border-collapse: collapse; text-align: center; width: 270px; border: 1.2px solid black; font-family: serif;"><tr><th style="border: 1px solid black; padding: 3px; font-weight: normal; background:#fcfcfc;">60분법</th><td style="border: 1px solid black; padding: 3px;">$0^\circ$</td><td style="border: 1px solid black; padding: 3px;">$30^\circ$</td><td style="border: 1px solid black; padding: 3px;">$60^\circ$</td><td style="border: 1px solid black; padding: 3px;">$90^\circ$</td><td style="border: 1px solid black; padding: 3px;">$120^\circ$</td><td style="border: 1px solid black; padding: 3px;">$150^\circ$</td><td style="border: 1px solid black; padding: 3px;">$180^\circ$</td></tr><tr><th style="border: 1px solid black; padding: 3px; font-weight: normal; background:#fcfcfc;">호도법</th><td style="border: 1px solid black; padding: 3px;">0</td><td style="border: 1px solid black; padding: 3px;">①</td><td style="border: 1px solid black; padding: 3px;">②</td><td style="border: 1px solid black; padding: 3px;">③</td><td style="border: 1px solid black; padding: 3px;">④</td><td style="border: 1px solid black; padding: 3px;">⑤</td><td style="border: 1px solid black; padding: 3px;">$\pi$</td></tr></table></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{\pi}{6}$
$\frac{\pi}{5}$
$\frac{\pi}{4}$
$\frac{\pi}{2}$
$\frac{3\pi}{2}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각도를 호도법으로 바꾸는 식 $180^\circ=\pi$를 이용한다.

표의 빈칸은 $30^\circ$에 대응하는 호도법 값이다.

$180^\circ=\pi$ 이므로
$30^\circ=\frac{30}{180}\pi=\frac{\pi}{6}$ 이다.

따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 각도 변환 \(30^\circ\times\pi/180=\pi/6\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $y=2^{-x}-3$에 대한 설명으로 옳지 않은 것은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
그래프는 점 $(0,-2)$을 지난다.
정의역은 실수 전체의 집합이다.
$x$의 값이 증가하면 $y$의 값은 감소한다.
그래프의 점근선은 직선 $y=-3$이다.
그래프는 함수 $y=2^x$의 그래프를 $x$축에 대하여 대칭이동 후 $y$축의 방향으로 3만큼 평행이동한 것과 같다.
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$y=2^{-x}-3$은 $y=2^x$를 y축에 대하여 대칭이동한 뒤 아래로 3만큼 평행이동한 함수이다.

각 보기의 설명이 함수의 성질과 맞는지 확인한다.

$x=0$일 때 $y=2^0-3=-2$ 이므로 ①은 옳다.
지수함수는 모든 실수에서 정의되므로 ②도 옳다.
$2^{-x}$는 $x$가 증가할수록 감소하므로 ③도 옳다.
$x\to\infty$일 때 $2^{-x}\to0$ 이므로 점근선은 $y=-3$이고, ④도 옳다.
한편 $y=2^{-x}$는 $y=2^x$를 y축에 대하여 대칭이동한 그래프이므로, ⑤의 x축 대칭이동이라는 설명은 틀리다.

따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** \(2^{-x}-3\)은 \(y\)축 대칭 후 3만큼 아래로 이동한 함수; ⑤의 \(x\)축 대칭 설명이 오류.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$8^{\frac{2}{3}}\times\left(\frac{1}{2}\right)^{-1}\times\left(\log_9 3+3^{\log_3 1}\right)\times2\sin\frac{\pi}{6}$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
8
9
10
11
12
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
지수 계산, 로그값 계산, 삼각함수 값을 구한 뒤 곱한다.

식을 네 부분으로 나누어 계산한다.

$8^{\frac{2}{3}}=(\sqrt[3]{8})^2=2^2=4$ 이다.
$\left(\frac12\right)^{-1}=2$ 이다.
$\log_9 3=\frac12$ 이고, $\log_3 1=0$ 이므로 $3^{\log_3 1}=1$ 이다.
따라서 $\log_9 3+3^{\log_3 1}=\frac12+1=\frac32$ 이다.
또 $2\sin\frac\pi6=2\cdot\frac12=1$ 이다.
그러므로 전체 값은 $4\times2\times\frac32\times1=12$ 이다.

따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 주어진 지수·로그 관계에서 수열 항을 정리한 곱 12를 재계산, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
그림과 같이 종이로 부채를 만들려고 한다.<br>$\angle BOA=\frac{2}{3}\pi$이고 두 부채꼴 $OAB,\ OCD$의 반지름의 길이가 각각 $6\text{ cm},\ 12\text{ cm}$일 때, 종이의 넓이는? [4점]<br><br><div style="text-align:center;">
<img src="assets/images/25_효천고_1학기_중간_고2_대수/q09-audit-rework.svg" style="width:100%;max-width:570px;height:auto" alt="문제 그림"></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$33\pi$
$36\pi$
$39\pi$
$42\pi$
$45\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
환부채꼴의 넓이는 바깥 부채꼴의 넓이에서 안쪽 부채꼴의 넓이를 빼서 구한다.

중심각은 $\frac{2\pi}{3}$, 바깥 반지름은 $12$, 안쪽 반지름은 $6$이다.

반지름이 $R$, 중심각이 $\theta$인 부채꼴의 넓이는 $\frac{1}{2}R^2\theta$ 이다.
따라서 종이의 넓이는
$\frac{1}{2}\cdot\frac{2\pi}{3}\cdot(12^2-6^2)$
$=\frac{1}{2}\cdot\frac{2\pi}{3}\cdot(144-36)$
$=\frac{\pi}{3}\cdot108=36\pi$ 이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** SVG의 바깥 반지름 12, 안쪽 반지름 6, 중심각 \(2\pi/3\)으로 \(\tfrac12(12^2-6^2)\cdot2\pi/3=36\pi\), ②.
- 문제 그림: `archive/assets/images/25_효천고_1학기_중간_고2_대수/q09-audit-rework.svg` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x\mid -1\le x\le 2\}$일 때, 두 함수<br>$y=2^{-x}+6$의 최댓값을 $a$, $y=\log_3(2x+5)+3$의 최댓값을 $b$라고 하자. $a+b$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
11
12
13
14
15
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각 함수의 증가, 감소를 이용하여 정의역의 끝값에서 최댓값을 구한다.

정의역은 $-1\le x\le2$ 이다.

$y=2^{-x}+6$은 $x$가 증가할수록 감소하므로 최댓값은 $x=-1$일 때이다.
따라서 $a=2^{-(-1)}+6=2+6=8$ 이다.
또 $y=\log_3(2x+5)+3$은 로그함수의 증가성과 일차식 $2x+5$의 증가성을 이용하면 증가함수이므로 최댓값은 $x=2$일 때이다.
따라서 $b=\log_3 9+3=2+3=5$ 이다.
그러므로 $a+b=8+5=13$ 이다.

따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 각 함수의 증가·감소와 정의역을 나누어 센 경우 8+5=13, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=2^{|x-2|}+3$의 그래프와 직선 $y=k$가 만나지 않을 때, 실수 $k$의 값의 범위로 옳은 것은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$k<3$
$k\le 3$
$k=3$
$k<4$
$k\le 4$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$|x-2|\ge0$ 이므로 지수 부분의 최솟값을 먼저 찾는다.

함수는 $y=2^{|x-2|}+3$ 이다.

$|x-2|\ge0$ 이므로
$2^{|x-2|}\ge2^0=1$ 이다.
따라서 $y=2^{|x-2|}+3\ge1+3=4$ 이다.
최솟값 4는 $x=2$일 때 나온다.
직선 $y=k$가 그래프와 만나지 않으려면 그래프의 최솟값보다 작아야 하므로 $k<4$ 이다.

따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(2^{|x-2|}+3\)의 최솟값 4이므로 교점을 만들지 않는 \(k<4\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\frac{\pi}{2}<\theta<\pi$인 $\theta$에 대하여 $\sin\theta=\frac{\sqrt{7}}{4}$일 때, $\cos\theta$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{3}{4}$
$\frac{1}{4}$
0
$-\frac{1}{4}$
$-\frac{3}{4}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin^2\theta+\cos^2\theta=1$을 이용하고, 사분면으로 부호를 결정한다.

$\frac\pi2<\theta<\pi$ 이므로 $\theta$는 제2사분면에 있다.

$\sin\theta=\frac{\sqrt7}{4}$ 이므로
$\cos^2\theta=1-\sin^2\theta=1-\left(\frac{\sqrt7}{4}\right)^2=1-\frac{7}{16}=\frac{9}{16}$ 이다.
따라서 $\cos\theta=\pm\frac34$ 이다.
그런데 제2사분면에서는 $\cos\theta<0$ 이므로
$\cos\theta=-\frac34$ 이다.

따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 제2사분면에서 \(\sin\theta=\sqrt7/4\)이면 \(\cos\theta=-3/4\) (피타고라스), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=a\sin\frac{\pi}{2b}x$의 최댓값은 3이고 주기는 4이다. 두 양수 $a,\ b$의 합 $a+b$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
4
3
$\frac{5}{2}$
2
1
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
삼각함수의 최댓값은 진폭으로, 주기는 계수로 결정된다.

함수는 $y=a\sin\frac{\pi}{2b}x$ 이고, 최댓값은 3, 주기는 4이다.

$\sin$의 최댓값은 1이므로 함수의 최댓값은 $a$ 이다.
따라서 $a=3$ 이다.
또 $y=\sin kx$의 주기는 $\frac{2\pi}{k}$ 이므로
$y=a\sin\frac{\pi}{2b}x$의 주기는
$\frac{2\pi}{\pi/(2b)}=4b$ 이다.
주기가 4이므로 $4b=4$ 이고, 따라서 $b=1$ 이다.
그러므로 $a+b=3+1=4$ 이다.

따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 진폭 3, 주기 4에서 \(a=3\), \(b=1\)로 합 4, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin\theta+\cos\theta=\frac{1}{2}$일 때, $\sin\theta-\cos\theta$의 값은? [4점]<br>(단, $\sin\theta<\cos\theta$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-\frac{\sqrt{7}}{2}$
$-\frac{3}{8}$
0
$\frac{3}{8}$
$\frac{\sqrt{7}}{2}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
합의 제곱과 차의 제곱을 이용하면 $\sin\theta\cos\theta$를 구할 수 있다.

$\sin\theta+\cos\theta=\frac12$ 이고, $\sin\theta<\cos\theta$ 이다.

양변을 제곱하면
$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta$ 이므로
$\left(\frac12\right)^2=1+2\sin\theta\cos\theta$ 이다.
따라서 $\frac14=1+2\sin\theta\cos\theta$ 이고,
$2\sin\theta\cos\theta=-\frac34$ 이다.
이제
$(\sin\theta-\cos\theta)^2=1-2\sin\theta\cos\theta$ 이므로
$1-\left(-\frac34\right)=\frac74$ 이다.
따라서 $\sin\theta-\cos\theta=\pm\frac{\sqrt7}{2}$ 이다.
그런데 $\sin\theta<\cos\theta$ 이므로 차는 음수이다.

따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \((\sin\theta-\cos\theta)^2=2-(\sin\theta+\cos\theta)^2=7/4\); 부호조건으로 \(-\sqrt7/2\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 함수 중 주기가 나머지 넷과 다른 것은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$y=\sin 2x-1$
$y=2\cos x+1$
$y=\sqrt{3}\tan(-x)$
$y=\lvert 2\cos x\rvert$
$y=\sqrt{2}\cos 2x-\sqrt{3}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
삼각함수의 평행이동, 상수배는 주기에 영향을 주지 않고, 내부의 계수와 절댓값 여부만 확인하면 된다.

각 함수의 주기를 구하여 비교한다.

$y=\sin 2x-1$의 주기는 $\pi$ 이다.
$y=2\cos x+1$의 주기는 $2\pi$ 이다.
$y=\sqrt3\tan(-x)$는 $\tan x$와 같은 주기를 가지므로 $\pi$ 이다.
$y=|2\cos x|$는 $|\cos x|$의 주기와 같아서 $\pi$ 이다.
$y=\sqrt2\cos 2x-\sqrt3$의 주기는 $\pi$ 이다.

나머지 넷과 주기가 다른 것은 ②이므로, 따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 다섯 함수의 주기를 각각 \(\pi,2\pi,\pi,\pi,\pi\)로 확인하므로 ②만 다른 주기.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같이 중심이 $O$, 반지름의 길이가 1인 사분원의 호 $PQ$를 9등분하는 점을 차례로 $P_1,\ P_2,\ \cdots,\ P_8$이라고 하자. 점 $P_1,\ P_2,\ \cdots,\ P_8$에서 선분 $OP$에 내린 수선의 발을 각각 $Q_1,\ Q_2,\ \cdots,\ Q_8$이라고 할 때, <br>$\overline{OQ_1}^{\,2}+\overline{OQ_2}^{\,2}+\overline{OQ_3}^{\,2}+\cdots+\overline{OQ_8}^{\,2}$의 값은? [4.5점]<br><br><div style="text-align:center;">
<img src="assets/images/25_효천고_1학기_중간_고2_대수/q16-problem-v2.svg" style="display:block; margin:8px auto; width:315px; max-width:100%; height:auto; max-height:248px; object-fit:contain" alt="사분원호의 등분점에서 선분 OP에 내린 수선"></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
1
2
3
4
5
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
반지름이 1인 사분원 위의 점의 x좌표를 $\cos$로 나타내고, 서로 보각인 각의 제곱합을 묶는다.

사분원의 중심각 $\frac\pi2$를 9등분하므로 각 점은 $\frac{i\pi}{18}\ (i=1,2,\dots,8)$에 대응한다.

점 $P_i$의 x좌표가 곧 $OQ_i$의 길이이므로
$OQ_i=\cos\frac{i\pi}{18}$ 이다.
따라서 구하는 값은
$\sum_{i=1}^{8}\cos^2\frac{i\pi}{18}$ 이다.
이제 서로 보각인 각끼리 묶으면
$\cos^2 10^\circ+\cos^2 80^\circ=1$,
$\cos^2 20^\circ+\cos^2 70^\circ=1$,
$\cos^2 30^\circ+\cos^2 60^\circ=1$,
$\cos^2 40^\circ+\cos^2 50^\circ=1$ 이다.
따라서 전체 합은 $1+1+1+1=4$ 이다.

따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** SVG의 사분원호 9등분에서 내린 수선의 길이는 \(\cos10^\circ,\dots,\cos80^\circ\). 서로 여각인 4쌍의 제곱합이 각 1이어서 총 4, ④.
- 문제 그림: `archive/assets/images/25_효천고_1학기_중간_고2_대수/q16-problem-v2.svg` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
2보다 큰 실수 $a$에 대하여 $a\le x < a^2$일 때, $(\log_a x)^2,\ \log_a x^2,\ \log_a(\log_a x)$를 크기순으로 옳게 나열한 것은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$(\log_a x)^2<\log_a(\log_a x)<\log_a x^2$
$\log_a(\log_a x)<\log_a x^2<(\log_a x)^2$
$\log_a(\log_a x)<(\log_a x)^2<\log_a x^2$
$\log_a x^2<\log_a(\log_a x)<(\log_a x)^2$
$\log_a x^2<(\log_a x)^2<\log_a(\log_a x)$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$t=\log_a x$로 치환하면 세 식을 간단히 비교할 수 있다.

$a\le x<a^2$ 이므로 $1\le\log_a x<2$ 이다. 이를 $t$라 두면 $1\le t<2$ 이다.

$t=\log_a x$라 두면
$(\log_a x)^2=t^2$, $\log_a x^2=2t$, $\log_a(\log_a x)=\log_a t$ 이다.
$1\le t<2$ 이고 $a>2$ 이므로
$0\le\log_a t<1$ 이다.
또 $1\le t<2$에서 $t^2<2t$ 이다.
따라서
$\log_a t<t^2<2t$ 이다.
즉,
$\log_a(\log_a x)<(\log_a x)^2<\log_a x^2$ 이다.

따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\log_a x\in[1,2)\)로 두고 \(\log_a t<t^2<2t\)인 영역을 점검, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — HOLD

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
두 집합 $A_4=\{\log_4 1,\log_4 2,\log_4 3,\ \cdots,\ \log_4 100\}$, $A_{2^k}=\{\log_{2^k} 1,\log_{2^k} 2,\log_{2^k} 3,\ \cdots,\ \log_{2^k} 100\}$에 대하여 $n(A_4\cap A_{2^k})=4$를 만족하는 자연수 $k$의 값은? [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
1
2
3
4
5
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
공통원소 조건을 로그의 밑변환으로 바꾸면 정수 조건 문제로 바뀐다.

공통원소가 되려면 어떤 $n,m$에 대하여 $\log_4 n=\log_{2^k} m$ 이어야 한다.

밑변환 공식을 이용하면
$\log_4 n=\frac{\log_2 n}{2}$, $\log_{2^k} m=\frac{\log_2 m}{k}$ 이다.
따라서
$\frac{\log_2 n}{2}=\frac{\log_2 m}{k}$ 이고,
$k\log_2 n=2\log_2 m$ 이므로 $n^k=m^2$ 이다.
보기 중 $k=3$일 때 $n^3=m^2$ 이려면 $n=t^2$, $m=t^3$ 꼴이 된다.
이때 $m=t^3\le100$ 이어야 하므로 가능한 $t$는 $1,2,3,4$ 뿐이다.
따라서 공통원소의 개수는 4개이다.

따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 공통 로그값 조건 \(n^k=m^2\)에서 \(k=3\)이면 \(n=t^2,m=t^3\)로 4개이나 \(k=6\)에서도 \(m=n^3\le100\)으로 \(n=1,2,3,4\)의 4개. 자연수 전체에서 유일하지 않음.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음

#### HOLD — 출제 원문·정답 검증 필요

- **보류 원인 — 자연수 해가 둘 이상:** \(A_4\cap A_{2^k}\)의 원소는 \(n^k=m^2\) (\(1\le n,m\le100\))에 대응한다. \(k=3\)이면 \(n=t^2,m=t^3\)에서 \(t=1,2,3,4\)로 4개, 선택지 ③을 지지한다. 그러나 **선택지 밖인 \(k=6\)**도 \(m=n^3\le100\)이므로 \(n=1,2,3,4\), 정확히 4개가 된다. 일반 자연수 \(k\) 전체를 대상으로 하면 ‘\(k\)의 값’이 유일하지 않다.
- **필요 조치:** 출제 원문에 \(1\le k\le5\) 같은 제한이 있었는지 확인한다. 없었다면 문제를 ‘보기의 \(k\) 중’으로 바꾸거나 정답 조건을 재설계해야 한다. 현행 답 ③을 무단 변경하지 않고 HOLD로 유지.

- 원본 JS/정답키/선지/그림 변경 금지. 확인 전 학생용 해설 자동 승격 금지.

### Q19 — UPGRADE

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수함수와 로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
상수 $k(k > 0)$에 대하여 직선 $y = -x + 2k$가 두 함수 $f(x) = \log(x - k)$, $g(x) = 10^{x+1} + k + 1$의 그래프와 만나는 점을 각각 A, B라 하자. $\overline{AB} = 5\sqrt{2}$일 때, $k$의 값은?<br><br><div style='text-align:center;'>
<img src="assets/images/25_효천고_1학기_중간_고2_대수/q19-audit-rework.svg" style="width:100%;max-width:570px;height:auto" alt="문제 그림"></div><br>(단, $\log 2 = 0.3010$)<br>[5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1.6990
② 2.3010
③ 2.4771
④ 3.3010
⑤ 3.6990
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
* 1단계: 두 점 $A(x_1, y_1)$, $B(x_2, y_2)$는 기울기가 -1인 직선 $x+y=2k$ 위에 있다.
* 2단계: $\overline{AB} = \sqrt{2}|x_1-x_2| = 5\sqrt{2}$이므로 $|x_1-x_2|=5$이다. 그래프상 $x_1 > x_2$이므로 $x_1 = x_2+5$이고, $y_2 = y_1+5$이다.
* 3단계: 점 $A$를 $f(x)$에 대입하면 $y_1 = \log(x_1-k)$, 점 $B$를 $g(x)$에 대입하면 $y_1+5 = 10^{x_2+1}+k+1$이다.
* 4단계: $y_1+4 = 10^{x_2+1}+k$와 $x_2+5 = 10^{y_1}+k$를 연립하면 대칭성에 의해 $x_2+1 = y_1$임을 알 수 있다.
* 5단계: 직선의 방정식에 대입하면 $x_2 + (x_2+6) = 2k \Rightarrow x_2 = k-3$. 따라서 $y_1 = k-2, x_1 = k+2$이다.
* 6단계: $f(x)$에 대입하면 $k-2 = \log(k+2-k) = \log 2 = 0.3010$. 따라서 $k = 2.3010$이다.
* 정답: ②
```

- **독립 판정·핵심 연결/검산:** 기울기 −1 직선에서 두 점의 좌표 차가 각각 5. 원문 ‘대칭성에 의해’는 유일성 증명이 빠졌으며 \(10^u+u\)의 엄격한 증가로 보강하면 \(k=2.3010\), ②.
- 문제 그림: `archive/assets/images/25_효천고_1학기_중간_고2_대수/q19-audit-rework.svg` (실물 판독 완료)

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 두 점은 기울기 \(-1\)인 직선 \(x+y=2k\) 위에 있으므로, 좌표 차의 절댓값이 같고 거리가 그 값의 \(\sqrt2\)배이다. \(\overline{AB}=5\sqrt2\)에서 \(|x_A-x_B|=5\). 실제 그림에서 \(A\)가 \(B\)의 오른쪽·아래쪽이므로 \(B=(t,2k-t)\), \(A=(t+5,2k-t-5)\)로 쓴다.
2. \(A\)가 \(y=\log(x-k)\) 위에 있으므로 \(10^{\,2k-t-5}=t+5-k\)이다. \(B\)가 \(y=10^{x+1}+k+1\) 위에 있으므로 \(10^{\,t+1}=2k-t-k-1=k-t-1\).
3. \(u=t+1\), \(v=2k-t-5\)로 두자. 그러면 두 식은 \(10^v=u+4-k\), \(10^u=v+4-k\)이다. 따라서 \(10^v+v=10^u+u\). \(z\)가 커지면 \(10^z+z\)는 반드시 커지므로 이 등식에서 **\(u=v\)**임이 유일하게 따라온다. 원문 해설의 ‘대칭성에 의해’라는 생략 부분이 바로 이 증명이다.
4. \(u=v\)이고 직선 위의 \(B=(u-1,u+5)\)이므로 \(2k=(u-1)+(u+5)=2u+4\), 곧 \(u=k-2\). 따라서 \(A=(k+2,k-2)\).
5. 로그함수에 대입해 \(k-2=\log((k+2)-k)=\log2=0.3010\). \(k=2.3010\). 정답 **②**. \(k>0\)이고 로그 진수 2도 양수이므로 조건에 맞는다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형 1. [5점]<br><br>두 부등식 $\log_3(x-2)<2$과 $\left(\frac{1}{8}\right)^x\le\left(\frac{1}{4}\right)^{x+2}$과 방정식 $2\cos^2x-\cos x-1=0$을 동시에 만족하는 $x$값을 구하는 과정을 서술하시오. (단, $0\le x<2\pi$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\frac{4\pi}{3}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
두 부등식으로 $x$의 범위를 먼저 구한 뒤, 삼각방정식의 해 중에서 그 범위에 들어가는 값을 찾는다.

$\log_3(x-2)<2$, $\left(\frac18\right)^x\le\left(\frac14\right)^{x+2}$, 그리고 $2\cos^2x-\cos x-1=0$ 이다.

먼저 $\log_3(x-2)<2$ 에서 정의역 조건은 $x>2$ 이고, 밑이 3이므로 증가함수여서
$x-2<9$ 이다. 따라서 $2<x<11$ 이다.
다음으로 $\left(\frac18\right)^x\le\left(\frac14\right)^{x+2}$ 에서 밑을 2로 바꾸면
$2^{-3x}\le2^{-2x-4}$ 이다.
지수함수의 성질에 의해 $-3x\le-2x-4$ 이므로 $x\ge4$ 이다.
따라서 두 부등식을 동시에 만족하면 $4\le x<11$ 이다.
이제 삼각방정식은
$2\cos^2x-\cos x-1=0$
$(2\cos x+1)(\cos x-1)=0$ 이므로
$\cos x=1$ 또는 $\cos x=-\frac12$ 이다.
$0\le x<2\pi$ 에서 해는 $x=0,\ \frac{2\pi}{3},\ \frac{4\pi}{3}$ 이다.
이 중 $4\le x<11$ 을 만족하는 값은 $\frac{4\pi}{3}$ 뿐이다.

따라서 구하는 값은 $\frac{4\pi}{3}
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** \(x\)의 정의역과 코사인 부등식의 해를 교집합하면 \(4\pi/3\)만 남음.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
재학이는 다음 문제를 주어진 시간 안에 해결하지 못하고 답안을 제출하였다. 재학이의 미완성된 풀이를 이용하여 다음 문제의 값을 옳게 구한 것은? [5점]

문제)
세 함수 $f(x) = \cos \pi x$, $g(x) = \sin \pi x$, $h(x) = ax + b$가 다음 조건을 만족시킨다. 홀수인 자연수 $b$의 값은? (단, $a$는 자연수)

가. $0 \le x \le 4$일 때, 방정식 $(f \circ h)(x) = (h \circ g)\left(\frac{3}{2}\right)$의 서로 다른 실근의 개수는 홀수이다.
나. $0 \le x \le 4$일 때, 방정식 $(f \circ h)(x) = (h \circ g)(t)$의 서로 다른 모든 실근의 합이 56이 되도록 하는 실수 $t$가 존재한다.

재학이의 풀이 과정)
$(f \circ h)(x) = \cos(a \pi x + b \pi)$이고 $b$가 홀수이므로 $(f \circ h)(x) = -\cos a \pi x$이다.
$(h \circ g)\left(\frac{3}{2}\right) = -a + b$이므로 서로 다른 실근의 개수가 홀수가 되기 위해서는 $-a + b = -1$이 되어야 한다.
즉 $b = a - 1$이다.

<div style='text-align:center;'>
<svg width='250' height='180' viewBox='0 0 250 180' xmlns='http://www.w3.org/2000/svg'>
  <defs>
    <marker id='arrowhead' markerWidth='10' markerHeight='7' refX='0' refY='3.5' orient='auto'>
      <polygon points='0 0, 10 3.5, 0 7' fill='black' />
    </marker>
  </defs>
  <line x1='40' y1='160' x2='40' y2='20' stroke='black' stroke-width='1.5' marker-end='url(#arrowhead)' />
  <line x1='20' y1='90' x2='230' y2='90' stroke='black' stroke-width='1.5' marker-end='url(#arrowhead)' />
  <line x1='40' y1='50' x2='220' y2='50' stroke='black' stroke-width='1' stroke-dasharray='4 2' />
  <line x1='40' y1='130' x2='220' y2='130' stroke='black' stroke-width='1' stroke-dasharray='4 2' />
  <polyline points='40.0,130.0 42.4,127.1 44.8,118.7 47.3,106.0 49.7,90.5 52.1,74.7 54.5,60.7 57.0,50.7 59.4,46.4 61.8,48.2 64.2,56.1 66.7,68.7 69.1,84.1 71.5,99.9 73.9,114.1 76.4,124.4 78.8,129.6 81.2,128.9 83.6,122.7 86.1,113.2' fill='none' stroke='black' stroke-width='1.2' />
  <polyline points='180.0,50.0 184.0,65.0 188.0,100.0 192.0,122.0 196.0,128.5 200.0,130.0' fill='none' stroke='black' stroke-width='1.2' />
  <text x='130' y='105' font-size='14' text-anchor='middle'>...</text>
  <text x='35' y='25' font-size='11' text-anchor='end' font-style='italic'>y</text>
  <text x='235' y='105' font-size='11' text-anchor='start' font-style='italic'>x</text>
  <text x='35' y='54' font-size='10' text-anchor='end'>1</text>
  <text x='35' y='134' font-size='10' text-anchor='end'>-a+b</text>
  <rect x='192' y='92' width='16' height='12' fill='white' />
  <text x='200' y='102' font-size='10' text-anchor='middle'>4</text>
</svg>
</div>

$0 \le x \le 4$일 때, 방정식 $(f \circ h)(x) = -\cos a \pi x$는 주기 $\frac{2}{a}$에 맞춰 $2a$번 반복되고, $x = 2$에 대하여 대칭이므로 대칭인 해들의 합은 4를 만족한다.
방정식 $(f \circ h)(x) = (h \circ g)(t)$의 서로 다른 모든 실근의 합이 56이 되도록 하는 실수 $t$가 존재한다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 7
② 9
③ 11
④ 13
⑤ 17
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
합성함수의 주기와 선대칭 성질을 이용하여 실근의 개수와 합을 구한다.
1단계: 재학이의 풀이에 의해 $b = a - 1$이고 $b$가 홀수이므로 $a$는 짝수임을 알 수 있다.
2단계: 함수 $y = -\cos a\pi x$의 주기는 $T = \frac{2\pi}{a\pi} = \frac{2}{a}$이며, 주어진 범위 $0 \le x \le 4$ 안에서 주기가 $4 \div \frac{2}{a} = 2a$번 반복된다.
3단계: 코사인 그래프는 각 주기 내에서 대칭성을 가지며, 전체 범위 $0 \le x \le 4$에서는 $x=2$를 기준으로 좌우 대칭이다. 따라서 실근이 쌍으로 존재할 때 한 쌍의 합은 항상 4이다.
4단계: 모든 실근의 합이 56이므로 실근의 개수를 $N$이라 하면, $\frac{N}{2} \times 4 = 56$에서 $N = 28$이다.
5단계: $2a$개의 주기에서 총 28개의 실근이 생기려면 한 주기당 실근이 1개씩 존재해야 하므로 $2a = 28 \implies a = 14$이다.
6단계: $b = a - 1$이므로 $b = 14 - 1 = 13$이다.

따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(b=a-1\)과 홀수 \(b\)로 짝수 \(a\). 합 56·대칭축 2에서 근 28개인데 한 주기당 해 개수가 높이별로 달라 원문 유도는 누락; 경우 나눔으로 \(a=14,b=13\), ④.
- 문제 그림: 문제 본문 inline SVG 렌더 판독

#### UPGRADE — 학생용 전면 개선 해설 초안

1. \(b\)는 홀수이므로 \(\cos(a\pi x+b\pi)=-\cos(a\pi x)\)이다. 재학이의 (가) 풀이에서 \(b=a-1\)을 얻는다. \(b\)가 홀수이므로 **\(a\)는 짝수**이다.
2. (나)의 방정식은 \(-\cos(a\pi x)=c\) (\(c=a\sin\pi t+b\)) 꼴이다. \(0\le x\le4\)에서 \(x\mapsto4-x\)로 바꾸어도 왼쪽 값이 같으므로 해들은 \(x=2\)를 기준으로 대칭이다. 따라서 서로 다른 해가 \(N\)개라면 **모든 해의 합은 \(2N\)**이다. 합이 56인 조건에서 \(N=28\).
3. 한 주기를 두 번씩 지나도록 \(x=0\)부터 4까지 \(2a\)개의 완전한 주기가 있다. 수평선 높이 \(c\)별 근의 개수를 끝점 중복 없이 분류한다.
   - \(c>1\) 또는 \(c<-1\): \(N=0\).
   - \(c=-1\): \(x=0,4\)가 포함되어 \(N=2a+1\).
   - \(c=1\): 각 주기의 가운데에서 \(N=2a\).
   - \(-1<c<1\): 각 주기에서 두 번 만나 \(N=4a\).
4. \(N=28\)을 만족하려면 \(2a=28\)에서 \(a=14\), 또는 \(4a=28\)에서 \(a=7\)이다. 후자는 \(a\)가 짝수라는 조건과 모순이다. \(2a+1=28\)은 자연수 해가 없다. 그러므로 \(a=14\)가 유일하다. 이때 \(c=1\)은 \(t\)를 적절히 고르면 실제로 가능하다.
5. \(b=a-1=13\). 정답 **④**. 원문의 ‘주기당 한 근’ 결론 앞에 빠졌던 수평선 높이별 경우를 모두 검증했다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형 2. [5점]<br><br>등식 $\left(5^x+5^{-x}\right)^2-\left(5^x+5^{-x}\right)=6$을 만족시키는 실수 $x$에 대하여 $125^x+125^{-x}$의 값을 구하는 과정을 서술하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `18`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$5^x+5^{-x}$를 하나의 문자로 놓아 식을 단순화하고, 세제곱의 합 공식을 이용한다.

$\left(5^x+5^{-x}\right)^2-\left(5^x+5^{-x}\right)=6$ 이다.

$t=5^x+5^{-x}$ 라 두면 주어진 식은
$t^2-t=6$ 이다.
따라서
$t^2-t-6=0$
$(t-3)(t+2)=0$ 이므로 $t=3$ 또는 $t=-2$ 이다.
그런데 $5^x>0$, $5^{-x}>0$ 이므로 $t=5^x+5^{-x}>0$ 이다.
따라서 $t=3$ 이다.
이제 $a=5^x$, $b=5^{-x}$ 라 두면 $a+b=3$, $ab=1$ 이다.
구하는 값은
$125^x+125^{-x}=5^{3x}+5^{-3x}=a^3+b^3$ 이다.
세제곱의 합 공식을 이용하면
$a^3+b^3=(a+b)^3-3ab(a+b)$ 이므로
$a^3+b^3=3^3-3\cdot1\cdot3=27-9=18$ 이다.

따라서 구하는 값은 18이다.
```

- **독립 판정·핵심 연결/검산:** \(t=5^x+5^{-x}=3\)이면 \(5^{3x}+5^{-3x}=t^3-3t=18\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형 3. [5점]<br>두 함수 $f(x) = \sin x + a$, $g(x) = -\cos x + b$의 그래프가 다음과 같다.<br><div style='text-align:center;'>
<img src="assets/images/25_효천고_1학기_중간_고2_대수/q23-problem-v2.svg" alt="두 삼각함수의 그래프"></div><br>$0 \le x < 2\pi$에서 $f(x)$와 $g(x)$에 대하여 정의된 함수 $h(x)$ = <svg width='120' height='30' style='vertical-align:middle'><g class='fraction'><text x='60' y='10' font-size='9px' text-anchor='middle' font-family='serif'>|f(x)-g(x)|+f(x)+g(x)</text><line x1='5' y1='13' x2='115' y2='13' stroke='black' stroke-width='0.8'/><text x='60' y='23' font-size='9px' text-anchor='middle' font-family='serif'>2</text></g></svg> 에 대하여 $h(x)$의 최솟값은 0이다. $h(x) = k (k > 1)$가 서로 다른 세 실근을 가질 때, $a, b, k$의 값과 $h(x)$의 최댓값 $m$의 곱 $a \times b \times k \times m$의 값을 구하는 과정을 서술하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\frac{1+\sqrt{2}}{2}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
* 1단계: $h(x) = \max(f(x), g(x))$이다. 그래프에서 두 함수의 교점 중 낮은 지점이 최솟값이 된다.
* 2단계: 최솟값이 0이므로, $x = \frac{7\pi}{4}$에서 $f(\frac{7\pi}{4}) = g(\frac{7\pi}{4}) = 0$이다.
* 3단계: $\sin(\frac{7\pi}{4}) + a = 0 \Rightarrow a = \frac{\sqrt{2}}{2}$이고, $-\cos(\frac{7\pi}{4}) + b = 0 \Rightarrow b = \frac{\sqrt{2}}{2}$이다.
* 4단계: $h$가 어느 구간에서 $f$이고 어느 구간에서 $g$인지 확인한다. $f(x)=g(x)$는 $\sin x = -\cos x$, 즉 $x = \frac{3\pi}{4}, \frac{7\pi}{4}$이다. $x=\pi$에서 $g > f$이므로 $\frac{3\pi}{4} < x < \frac{7\pi}{4}$에서는 $h=g$, 그 밖에서는 $h=f$이다.
* 5단계: $h(x) = k\,(k>1)$의 실근을 센다. $1 < k < \sqrt{2}$이면 $f$쪽 1개, $g$쪽 1개로 2개이고, $\sqrt{2} < k < 1+\frac{\sqrt{2}}{2}$이면 4개이다. $k = \sqrt{2}$일 때만 $x=\fra
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** 외부 그림의 두 교점과 최댓값 비교: \(a=b=\sqrt2/2\), 실근 3개 높이 \(k=\sqrt2\), \(m=1+\sqrt2/2\), 곱 \((1+\sqrt2)/2\).
- 문제 그림: `archive/assets/images/25_효천고_1학기_중간_고2_대수/q23-problem-v2.svg` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `523b7e4522b4ca7b658288de28c9bad8a94be598`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형 4. [5점]<br><br>함수 $f(x)=\left|\cos2\left(x-\frac{\pi}{6}\right)\right|+\frac{1}{2}\left(-\pi\le x\le\pi\right)$에 대하여 두 직선 $y=k,\ y=1$과 만나는 서로 다른 점의 개수를 각각 $m,\ n$이라고 할 때, $m-n=-1$이면 $k$의 범위와 $f(x)=k$의 모든 실근의 합을 구하는 과정을 각각 서술하시오. (단, $k$는 양의 실수)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\frac12<k<1$이면 $\frac{4\pi}{3}$, $1<k<\frac32$이면 $-\frac{2\pi}{3}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
함수 $f(x)=\left|\cos 2\left(x-\dfrac\pi6\right)\right|+\dfrac12$의 최솟값은 $\dfrac12$, 최댓값은 $\dfrac32$이다.
절댓값을 씌운 코사인 그래프의 주기는 $\dfrac\pi2$이므로 구간 $[-\pi,\pi]$에는 정확히 네 주기가 들어간다.

먼저 $y=1$과의 교점 개수 $n$을 센다.
$\left|\cos 2\left(x-\dfrac\pi6\right)\right|=\dfrac12$는 네 주기에서 보통 여덟 번 성립한다.
그런데 양 끝 $x=-\pi,\pi$에서도 $f(x)=1$이므로 마지막 끝점까지 합하면 $n=9$이다.

$m-n=-1$이므로 $m=8$이어야 한다.
따라서 $\dfrac12<k<\dfrac32$이면서 $k\ne1$이다.
($k=\dfrac12,\dfrac32$에서는 접하는 점이 네 개뿐이고, $k=1$에서는 아홉 개이다.)

이제 교점 8개의 $x$좌표 합을 구한다.
$c=k-\dfrac12$라 하고 $\alpha=\arccos c$ ($0<\alpha<\dfrac\pi2$)라 두자.
$u=2\left(x-\dfrac\pi6\right)$로 놓으면
$-\dfrac{7\pi}{3}\le u\le\dfrac{5\pi}{3}$이고, $|\cos u|=c$이다.
또 $x=\dfrac
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** \(|\cos2(x-\pi/6)|\)은 구간에서 네 주기. \(y=1\)은 양 끝점 포함 9개, 나머지 높이에서 8개; 해의 합은 \(k<1\)일 때 \(4\pi/3\), \(k>1\)일 때 \(-2\pi/3\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 24/24; 문항별 원문·정답·기존 해설·조건·이미지 링크와 구체적 계산 위에 기록.
- **UPGRADE 전체 초안**: 2개 완성 (원본 학생용 JS에는 미반영).
- **HOLD**: 1개 (Q18). HOLD는 승인 또는 신뢰 가능한 출제 원문이 확인될 때까지 상향 배포하지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 실제 UI 학생 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **심층 감사 MD의 작성 완료는 출고 통과를 뜻하지 않는다.**
- **후속**: HOLD 원문 재확인 및 개선 해설 이관 전에 별도 검증 게이트를 진행.

