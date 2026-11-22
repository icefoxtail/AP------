# 2025 25_순천여고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_순천여고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `218d631bb69516db8403a7af272b81e83fb64cfc`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_순천여고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 21 · UPGRADE 2 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 23문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로만 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

검토 방식: 원본 질문 `content`, `choices`, `answer`, `solution`을 전 문항 실제 읽고, 정답·진수/밑 조건·구간 끝점·부호·문항 그림을 대조했다. 원문 풀이의 핵심을 그대로 인용하고 판정 사유를 문항별로 기재했다. UPGRADE는 기존 해설을 그대로 대체해도 이해할 수 있도록 처음부터 끝까지 새로 썼다. HOLD는 정답을 임의 결정하지 않는다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지 증거

- `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20.png` — Git blob `5fd3eb0535809217de24aaac4a1231966a5255f6`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- solutionImage 보조 자산: 소스가 가리키는 9개 SVG의 파일 존재와 Git blob만 확인; **보조 해설 그림의 전수 시각 판독·학생 렌더는 NOT_RUN**.
  - Q03 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q3-solution-v2.svg` — `5196368c912b7246c6fc9e0a077aea13cf897bd1`
  - Q08 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q8-solution-v2.svg` — `e7ba7a310b5b8607aafd7091c8b82a4da8484bff`
  - Q10 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q10-solution.svg` — `25c72875a570ba4cb3f4305229e4d3cf4715c1d8`
  - Q13 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q13-solution.svg` — `c7fcaf635013e6d405d4112b67ab090ea507182e`
  - Q14 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q14-solution.svg` — `d297ba19cb81976ed56acb3f8a13694cfc1f9021`
  - Q15 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q15-solution.svg` — `457f1eac859a1cf654eb87c7d5c3da297438ec5d`
  - Q18 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q18-solution.svg` — `c9a0d86072ad33a88d9784782b5d8b0e3b675b16`
  - Q19 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q19-solution.svg` — `6fd468436742a7c96b3927a010e51fc74d78bcaf`
  - Q20 `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20-solution.svg` — `b977135a958bb39401e5081e2e54bc47b8b18110`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$2^{2\sqrt{3}} \times 2^{3-2\sqrt{3}}$의 값은? [3.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2
② 4
③ 8
④ 16
⑤ 32
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 지수법칙 $a^m \times a^n = a^{m+n}$을 적용한다.
> 2단계: $2^{2\sqrt{3} + (3-2\sqrt{3})} = 2^3$
> 3단계: $2^3 = 8$
> * 검산: 지수 부분의 무리수 $2\sqrt{3}$과 $-2\sqrt{3}$이 소거되어 $2^3$이 됨을 확인.

- **독립 판정·핵심 연결/검산:** 같은 밑 곱의 지수 2√3+3−2√3=3이므로 2³=8.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 방정식 $\log_2 (x-3) + \log_2 (x+3) = 4$의 해를 구하면? [3.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -5
② -1
③ 1
④ 5
⑤ 9
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 로그의 성질 $\log_a M + \log_a N = \log_a MN$을 적용한다.
> $\log_2 (x-3)(x+3) = 4 \Rightarrow \log_2 (x^2-9) = 4$
> 2단계: 로그의 정의에 의해 $x^2-9 = 2^4 = 16$이므로 $x^2 = 25$이다.
> 3단계: $x = \pm 5$이나, 로그의 진수 조건($x-3>0, x+3>0$)에 의해 $x>3$이어야 한다. 따라서 $x=5$.

- **독립 판정·핵심 연결/검산:** 진수조건 x>3, 로그 합을 풀면 x²−9=16, x=5만 허용.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\left(\frac{1}{2}\right)^x+1$의 그래프를 $y$축에 대하여 대칭이동 한 후 $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $b$만큼 평행이동 하였더니 함수 $y=2^{x-3}+5$의 그래프와 일치하였다. 상수 $a, b$에 대하여 $ab$의 값은? [3.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -12
② -10
③ 8
④ 10
⑤ 12
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $y=\left(\frac{1}{2}\right)^x+1$을 $y$축에 대하여 대칭이동하면 $x$ 대신 $-x$를 대입하므로 $y=\left(\frac{1}{2}\right)^{-x}+1 = 2^x+1$이다.
> 2단계: 이 그래프를 $x$축으로 $a$, $y$축으로 $b$만큼 평행이동하면 $y=2^{x-a}+1+b$가 된다.
> 3단계: 주어진 식 $y=2^{x-3}+5$와 비교하면 $a=3, 1+b=5 \Rightarrow b=4$이다.
> 4단계: $ab = 3 \times 4 = 12$

- **독립 판정·핵심 연결/검산:** y축 대칭 후 2^x+1, 오른쪽 3·위로4이므로 ab=12.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q3-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 그 값이 가장 큰 것은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\log_{\frac{1}{3}} 9$
② $\log_5 \sqrt{125}$
③ $4^{\log_2 3}$
④ $\log_4 8$
⑤ $\frac{1}{\log_{64} 2}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 각 보기의 값을 계산한다.
> ① $\log_{3^{-1}} 3^2 = -2$
> ② $\log_5 5^{\frac{3}{2}} = \frac{3}{2} = 1.5$
> ③ $4^{\log_2 3} = (2^2)^{\log_2 3} = 2^{2\log_2 3} = 2^{\log_2 9} = 9$

- **독립 판정·핵심 연결/검산:** 다섯 보기 직접 계산: −2,3/2,9,3/2,6; 최대 9인 ③.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
각을 $360^{\circ} \times n + \alpha^{\circ}$ ($n$은 정수, $0^{\circ} \le \alpha^{\circ} < 360^{\circ}$)의 꼴로 나타낼 때 다음 중 $\alpha$의 값이 가장 큰 것은? [3.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -1100
② -500
③ 500
④ 1100
⑤ 2000
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 각 보기의 $\alpha$를 구한다.
> ① $-1100^{\circ} = 360^{\circ} \times (-4) + 340^{\circ} \Rightarrow \alpha=340$
> ② $-500^{\circ} = 360^{\circ} \times (-2) + 220^{\circ} \Rightarrow \alpha=220$
> ③ $500^{\circ} = 360^{\circ} \times 1 + 140^{\circ} \Rightarrow \alpha=140$

- **독립 판정·핵심 연결/검산:** 각도 360°로 나눈 나머지는 340,220,140,20,200; 최대 ①.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin\theta + \cos\theta = \frac{1}{5}$일 때, $\sin\theta\cos\theta$의 값은? [3.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-\frac{12}{25}$
② $\frac{12}{25}$
③ $-\frac{24}{25}$
④ $\frac{24}{25}$
⑤ $-\frac{4}{25}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 주어진 식의 양변을 제곱하면 $(\sin\theta + \cos\theta)^2 = \left(\frac{1}{5}\right)^2$이다.
> 2단계: $\sin^2\theta + 2\sin\theta\cos\theta + \cos^2\theta = \frac{1}{25}$이므로 $1 + 2\sin\theta\cos\theta = \frac{1}{25}$이다.
> 3단계: $2\sin\theta\cos\theta = \frac{1}{25} - 1 = -\frac{24}{25}$이므로 $\sin\theta\cos\theta = -\frac{12}{25}$이다.
> * 검산: 곱셈공식에 따른 전개 및 이항 결과가 정확함.

- **독립 판정·핵심 연결/검산:** (sin+cos)²=1/25, 2sin cos=−24/25, sin cos=−12/25.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 $x$에 대하여 $\frac{a^x - a^{-x}}{a^x + a^{-x}} = \frac{1}{2}$일 때, $\frac{a^{2x} + a^{-2x}}{a^{2x} - a^{-2x}}$의 값은? (단, $a>0$, $a \ne 1$) [3.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{4}{5}$
② $\frac{5}{4}$
③ $\frac{3}{4}$
④ $\frac{3}{2}$
⑤ $\frac{2}{3}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $\frac{a^x - a^{-x}}{a^x + a^{-x}} = \frac{1}{2}$의 좌변 분모, 분자에 $a^x$를 곱하면 $\frac{a^{2x} - 1}{a^{2x} + 1} = \frac{1}{2}$이다.
> 2단계: 대각선으로 곱하여 정리하면 $2(a^{2x} - 1) = a^{2x} + 1 \Rightarrow 2a^{2x} - 2 = a^{2x} + 1 \Rightarrow a^{2x} = 3$이다.
> 3단계: 구하고자 하는 식 $\frac{a^{2x} + a^{-2x}}{a^{2x} - a^{-2x}}$에 $a^{2x} = 3, a^{-2x} = \frac{1}{3}$을 대입한다.
> 4단계: $\frac{3 + \frac{1}{3}}{3 - \frac{1}{3}} = \frac{\frac{10}{3}}{\frac{8}{3}} = \frac{10}{8} = \frac{5}{4}$이다.

- **독립 판정·핵심 연결/검산:** t=a^(2x)>0에서 (t−1)/(t+1)=1/2 → t=3; (t+1/t)/(t−1/t)=5/4.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x) = \log_2 (x-a) + 2$의 역함수의 그래프가 점 $(a+4, a+2)$를 지날 때, $a$의 값은? (단, $a$는 상수이다.) [3.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -5
② -4
③ -3
④ -2
⑤ -1
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 역함수가 점 $(a+4, a+2)$를 지나므로, 본래 함수 $f(x)$는 점 $(a+2, a+4)$를 지난다.
> 2단계: $f(a+2) = \log_2(a+2-a) + 2 = \log_2 2 + 2 = 1 + 2 = 3$이다.
> 3단계: 따라서 $a+4 = 3$이므로 $a = -1$이다.
> * 검산: $a=-1$ 대입 시 $f(1) = 3$이 되어 역함수가 $(3, 1)$을 지남을 확인. (이는 $a+4=3, a+2=1$과 일치함)

- **독립 판정·핵심 연결/검산:** 역함수가 (a+4,a+2)를 지나므로 원함수는 (a+2,a+4); log₂2+2=3 → a=−1.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q8-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `삼각함수의 그래프` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\theta$가 제$2$사분면의 각이고 $|\cos\theta - \sin\theta| - \sqrt{\cos^2\theta} = \frac{1}{2}$일 때, $\cos\theta$의 값은? [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-\frac{\sqrt{3}}{2}$
② $\frac{\sqrt{3}}{2}$
③ $-\frac{1}{2}$
④ $\frac{1}{2}$
⑤ $-\frac{3}{4}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $\theta$가 제$2$사분면의 각이므로 $\cos\theta < 0, \sin\theta > 0$이다.
> 2단계: 주어진 식에서 $\cos\theta - \sin\theta < 0$이므로 $|\cos\theta - \sin\theta| = -\cos\theta + \sin\theta$이고, $\sqrt{\cos^2\theta} = |\cos\theta| = -\cos\theta$이다.
> 3단계: $(-\cos\theta + \sin\theta) - (-\cos\theta) = \frac{1}{2} \Rightarrow \sin\theta = \frac{1}{2}$이다.
> 4단계: $\cos\theta = -\sqrt{1 - \sin^2\theta} = -\sqrt{1 - \frac{1}{4}} = -\frac{\sqrt{3}}{2}$이다.

- **독립 판정·핵심 연결/검산:** 제2사분면 부호로 주어진 절댓값 식이 sinθ=1/2가 됨; cosθ=−√3/2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=2\log(x+1)+1$에 대한 설명으로 옳은 것만을 <보기>\n에서 있는대로 모두 고른 것은? [4점]\n<보기>\nㄱ. 그래프는 점 $(0, 1)$을 지난다.\nㄴ. 그래프의 점근선은 직선 $y=1$이다.\nㄷ. 그래프는 제 $4$사분면을 지나지 않는다.\nㄹ. 그래프는 함수 $y=\log(x+1)^2$를 $y$축의 방향으로 $1$만큼\n    평행이동 한 것이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① ㄱ
② ㄱ, ㄷ
③ ㄱ, ㄷ, ㄹ
④ ㄴ, ㄹ
⑤ ㄴ, ㄷ, ㄹ
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: ㄱ. $x=0$을 대입하면 $y=2\log 1+1=1$이므로 $(0, 1)$을 지난다. (참)
> 2단계: ㄴ. 로그함수의 진수 조건 $x+1>0$에 의해 점근선은 $x=-1$이다. (거짓)
> 3단계: ㄷ. $x>-1$에서 $y$값은 $-\infty$부터 증가하며, $x=0$일 때 $y=1>0$이므로 제$4$사분면을 지나지 않는다. (참)
> 4단계: ㄹ. $y=\log(x+1)^2$은 정의역이 $x 

- **독립 판정·핵심 연결/검산:** ㄱ f(0)=1 참, ㄴ 점근선 x=−1 거짓, ㄷ x>0에서 y>1 참, ㄹ 정의역 상이해 거짓.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q10-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sqrt[4]{\frac{\sqrt[3]{a^2}}{\sqrt{a}}} \times \sqrt[8]{\frac{\sqrt[6]{a}}{a}}$ 를 간단히 하면 $\sqrt[n]{\frac{1}{a}}$이다. 자연수 $n$의 값\n은? (단, $a>0$, $a \ne 1$) [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 12
② 14
③ 16
④ 18
⑤ 20
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 주어진 식의 각 항을 지수 법칙을 이용해 분리한다.
> 2단계: $\frac{a^{\frac{2}{12}}}{a^{\frac{1}{8}}} \times \frac{a^{\frac{1}{48}}}{a^{\frac{1}{8}}}$
> 3단계: $a^{\frac{1}{6} - \frac{1}{8} + \frac{1}{48} - \frac{1}{8}} = a^{\frac{8 - 6 + 1 - 6}{48}} = a^{-\frac{3}{48}} = a^{-\frac{1}{16}}$이다.
> 4단계: $a^{-\frac{1}{16}} = \sqrt[16]{\frac{1}{a}}$이므로 $n=16$이다.

- **독립 판정·핵심 연결/검산:** 지수 합 (2/3−1/2)/4+(1/6−1)/8=1/24−5/48=−1/16, n=16.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\frac{\pi}{2} < \theta < \pi$이고 각 $\theta$를 나타내는 동경과 각 $4\theta$를 나타내는\n동경이 일치할 때, 각 $\theta = \frac{q}{p}\pi$이다. 서로소인 두 자연수\n$p, q$에 대해 $p-q$의 값은? [4.1점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2
② 1
③ 0
④ -1
⑤ -2
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 두 동경이 일치하므로 $4\theta - \theta = 2n\pi$ ($n$은 정수)이다.
> 2단계: $3\theta = 2n\pi \Rightarrow \theta = \frac{2n}{3}\pi$.
> 3단계: $\frac{\pi}{2} < \theta < \pi$이므로 $\frac{\pi}{2} < \frac{2n}{3}\pi < \pi \Rightarrow \frac{3}{4} < n < \frac{3}{2}$이다.
> 4단계: 이를 만족하는 정수 $n=1$이며, $\theta = \frac{2}{3}\pi$이다.

- **독립 판정·핵심 연결/검산:** 3θ=2mπ에서 θ=2mπ/3; 제2사분면에선 m=1, p−q=3−2=1.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
둘레의 길이가 $20$인 부채꼴 중에서 그 넓이가 최대인 부채\n꼴의 넓이를 $a$, 넓이가 최대인 부채꼴의 중심각의 크기를\n$b$라고 할 때, $a+b$의 값은? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 8
② 14
③ 12
④ 25
⑤ 27
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 부채꼴의 반지름을 $r$, 호의 길이를 $l$이라 하면 $2r + l = 20$이므로 $l = 20 - 2r$이다.
> 2단계: 넓이 $S = \frac{1}{2}rl = \frac{1}{2}r(20-2r) = -r^2 + 10r = -(r-5)^2 + 25$이다.
> 3단계: $r=5$일 때 최대 넓이 $a=25$를 갖고, 이때 $l=10$이다.
> 4단계: 중심각 $b = \frac{l}{r} = \frac{10}{5} = 2$이므로 $a+b = 25+2 = 27$이다.

- **독립 판정·핵심 연결/검산:** 둘레 20에서 S=r(20−2r)/2=−(r−5)²+25; r5·호10·중심각2, 합27.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q13-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x) = \begin{cases} |4^x - 4| & (x \ge 0) \\ |4^{-x} - 4| & (x < 0) \end{cases}$ 와 직선 $y=k$ ($k$는 실수)\n에 대하여 방정식 $f(x)=k$이 서로 다른 세 실근을 가질\n때, $k$의 값은? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1
② 2
③ 3
④ 4
⑤ 5
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $f(x)$의 그래프는 $y$축에 대해 대칭이며, $x \ge 0$일 때 $y = |4^x - 4|$의 그래프를 그린다.
> 2단계: $x=0$에서 $y=3$이고, $x=1$에서 $y=0$이며, 점근선은 없는 형태로 증가한다.
> 3단계: $f(x)=k$가 서로 다른 세 실근을 가지려면 직선 $y=k$가 극대점인 $(0, 3)$을 지나야 한다.
> 4단계: 따라서 $k=3$이다.

- **독립 판정·핵심 연결/검산:** 짝함수 f(x)=|4^|x|−4|, y=3은 원점 x0과 양쪽 해 두 개, 모두 3개.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q14-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
이차방정식 $x^2 - x\log_2 k^2 + \log_2 k + 6 = 0$이 실근을 갖도록\n하는 실수 $k$의 범위는? [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $0 < k \le \frac{1}{4}$ or $k \ge 8$
② $k \le \frac{1}{4}$ or $k \ge 8$
③ $0 < k < \frac{1}{4}$ or $k > 8$
④ $k \le \frac{1}{8}$ or $k \ge 4$
⑤ $0 < k < \frac{1}{8}$ or $k \ge 4$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 로그의 진수 조건에 의해 $k>0$이다.
> 2단계: 이차방정식이 실근을 가지려면 판별식 $D \ge 0$이어야 한다. $D = (\log_2 k^2)^2 - 4(\log_2 k + 6) \ge 0$.
> 3단계: $(2\log_2 k)^2 - 4\log_2 k - 24 \ge 0 \Rightarrow 4(\log_2 k)^2 - 4\log_2 k - 24 \ge 0 \Rightarrow (\log_2 k)^2 - \log_2 k - 6 \ge 0$.
> 4단계: $(\log_2 k - 3)(\log_2 k + 2) \ge 0$이므로 $\log_2 k \ge 3$ 또는 $\log_2 k \le -2$이다.

- **독립 판정·핵심 연결/검산:** u=log₂k에서 판별식 4(u−3)(u+2)≥0, k>0에서 k≤1/4 또는 k≥8.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q15-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$5 \le n \le 14$인 자연수 $n$에 대하여 $n^2 - 15n + 50$의 $n$제곱근\n중 실수인 것의 개수를 $f(n)$이라 하자. $2f(n) = f(n+1)$을\n만족시키는 모든 $n$의 값의 합은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 19
② 20
③ 22
④ 24
⑤ 25
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $n$이 홀수일 때 실수인 거듭제곱근의 개수 $f(n)$은 항상 $1$이다.
> 2단계: $n$이 짝수일 때, $n^2-15n+50 = (n-5)(n-10)$의 부호에 따라 $f(n)$은 양수면 $2$, $0$이면 $1$, 음수면 $0$이다.
> 3단계: $5 \le n \le 14$ 범위에서 $f(n)$의 값을 구하면 $f(6)=0, f(8)=0, f(10)=1, f(12)=2, f(14)=2$이다. (홀수는 모두 $1$)
> 4단계: $2f(n) = f(n+1)$을 만족하는 경우는 $2f(11) = 2 \times 1 = 2 = f(12)$와 $2f(13) = 2 \times 1 = 2 = f(14)$이다.

- **독립 판정·핵심 연결/검산:** 짝수 n: (n−5)(n−10)의 부호로 f(6)=0,f(8)=0,f(10)=1,f(12)=2,f(14)=2; 홀수는 1, n=11,13 합24.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
두 실수 $a, b$가 다음 <조건>을 만족시킬 때, $(\log_a 2)^2 \times \log_2 b = \frac{p}{q}$\n이다. $p+q$ 값은? (단, $p, q$는 서로소인 자연수) [4.5점]\n                    <조건>\n(가) $\log_{\sqrt{2}} ab = 18$\n(나) $\log_a \sqrt{b} = \log_{\sqrt{b}} a$\n(다) $1 < a < b$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 5
② 6
③ 7
④ 8
⑤ 9
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> (나)에서
> $\frac{1}{2}\log_a b=2\log_b a$이다.
> $\log_b a=\frac{1}{\log_a b}$이므로
> $(\log_a b)^2=4$이다.

- **독립 판정·핵심 연결/검산:** t=log_a b>0, (나)의 조건으로 t²=4→t=2, b=a²; ab=2⁹→a8,b64, 곱 2/3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — UPGRADE

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 전체 집합에서 정의된 함수 $f(x)$가 다음 조건을 만족시킨다.\n| (가) $f(x) = \begin{cases} x & (0 \le x < 1) \\ -x+2 & (1 \le x < 2) \end{cases}$ |\n| (나) 모든 실수 $x$에 대하여 $f(x+2) = f(x)$이다. |\n자연수 $n$에 대하여 함수 $y=f(x)$의 그래프가 함수\n$y=\log_{3n} x$와 만나는 점의 개수가 $98$일 때, 자연수 $n$의 값\n은? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 27
② 30
③ 33
④ 36
⑤ 39
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: 함수 $f(x)$는 주기가 $2$인 주기함수이며, 각 구간 $[2k, 2k+2]$마다 $x=2k+1$에서 최댓값 $1$을 갖는 산 모양의 그래프를 그린다.
> 2단계: 함수 $y=\log_{3n} x$는 점 $(1, 0)$과 $(3n, 1)$을 지나는 증가함수이다.
> 3단계: 교점의 개수를 파악하기 위해 $3n$이 홀수인 경우($3n=2k+1$)를 가정한다. $y=\log_{3n} x$가 $y=1$에 도달하는 $x=2k+1$까지 교점을 센다.
> 4단계: 첫 교점은 $1<x<2$에서 $1$개이고, $x=3, 5, \cdots, 2k-1$의 $k-1$개 봉우리에서는 각각 $2$개씩 교점을 갖고, 마지막 $x=2k+1$에서 꼭짓점과 $1$개의 교점을 갖는다.

- **독립 판정·핵심 연결/검산:** 주기2의 삼각형 파형과 증가하는 로그함수 교점을 봉우리 위치별로 세면 3n=99, n=33; 원본의 홀짝 문턱 설명 보강 필요.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q18-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q18 학생용 개선 해설 (전체안)

1. $f(x+2)=f(x)$이므로 그래프는 각 $j=0,1,2,\ldots$에 대하여 $(2j,0)$, $(2j+1,1)$, $(2j+2,0)$을 잇는 삼각형 모양이다. $y=\log_{3n}x$는 $3n>1$이므로 증가하고 $(1,0)$, $(3n,1)$을 지난다.
2. $0<x\le1$에서 로그값은 $0$ 이하, $f(x)>0$ ($x>0$)이므로 교점이 없다. 첫 봉우리의 내려가는 쪽 $1<x<2$에서 $f$는 $1$에서 $0$으로 감소하고 로그함수는 $0$보다 크게 증가하므로 교점이 정확히 1개다.
3. 이후 홀수 $j=3,5,\ldots$인 봉우리에서 $j<3n$이면 꼭짓점 높이 $1$이 로그값보다 높고 양끝의 $f=0$은 로그값보다 낮다. 각 봉우리 양쪽에 교점이 2개씩 있다. $x>3n$에서는 $\log_{3n}x>1\ge f(x)$이므로 교점이 없다.
4. $3n=2m$이 짝수이면 $j=3,5,\ldots,2m-1$인 봉우리 $m-1$개에서 각각 2개, 첫 구간에서 1개이므로 총 $1+2(m-1)=2m-1=3n-1$개다. $3n=2m+1$이 홀수이면 $j=3,5,\ldots,2m-1$인 봉우리 $m-1$개에 각각 2개, 첫 구간 1개, $j=3n$에서 로그와 $f$가 모두 1인 접점 1개이므로 총 $1+2(m-1)+1=2m=3n-1$개다.
5. 어느 경우나 교점 수는 $3n-1$이므로 $3n-1=98$, $3n=99$, $\boxed{n=33}$.

검산: 첫 1개 + 3부터 97까지의 홀수 봉우리 48개에 각 2개 + 마지막 $x=99$에서 1개 = $1+96+1=98$.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
두 양수 $a, b(a>1, 0<b<1)$에 대하여\n$f(x) = \begin{cases} \log_2 (x-4) - a & (x \ge 6) \\ b^{x-6} - a & (x < 6) \end{cases}$ 이다. 함수 $y=f(x)$와 $x$축\n이 만나는 두 점을 각각 $\mathrm{A, B}$라 하자. $\overline{\mathrm{AB}} = 5$ 이고\n$f(12) = \frac{a}{2}$일 때, $(ab)^3$의 값은? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{1}{2}$
② 4
③ 8
④ 12
⑤ 27
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $f(12) = \frac{a}{2}$를 이용해 $a$를 구한다. $12 \ge 6$이므로 $f(12) = \log_2 (12-4) - a = \log_2 8 - a = 3 - a$이다.
> 2단계: $3 - a = \frac{a}{2} \Rightarrow \frac{3a}{2} = 3 \Rightarrow a = 2$이다.
> 3단계: 함수 $f(x)$와 $x$축이 만나는 점은 $f(x)=0$의 해이다. $x \ge 6$일 때 $\log_2 (x-4) - 2 = 0 \Rightarrow x-4 = 2^2 \Rightarrow x=8$이다. (점 $\mathrm{A}$를 $(8, 0)$이라 하자.)
> 4단계: $\overline{\mathrm{AB}} = 5$이므로 점 $\mathrm{B}$의 $x$좌표는 $8-5=3$ 또는 $8+5=13$이다. $13$은 $x \ge 6$ 구간의 유일한 해가 $8$임에 모순되므로, 나머지 한 해는 $x < 6$ 구간에 속하는 $x=3$이다.

- **독립 판정·핵심 연결/검산:** f(12)=3−a=a/2에서 a2; x≥6 해8, 다른 영점3이므로 b^-3=2, (ab)³=4.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q19-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
두 상수 $a$, $k(1\lt a\lt 3,\ 0\lt k\lt 1)$에 대하여 직선 $y=3$이 두 곡선 $y=3^{x+1}$, $y=a^{x+1}$과 만나는 두 점을 각각 $A$, $B$라 하고, 직선 $y=k$가 두 곡선 $y=3^{x+1}$, $y=a^{x+1}$과 만나는 두 점을 각각 $C$, $D$라 하자. 사각형 $ADCB$가 넓이가 $\dfrac{8}{3}$인 평행사변형일 때, $ak$의 값은? (4.7점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $3^{\frac{1}{3}}$
② $3^{-\frac{1}{3}}$
③ $3^{\frac{1}{2}}$
④ $3^{-\frac{1}{2}}$
⑤ $3^{\frac{3}{2}}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 평행사변형이므로 윗변과 아랫변이 평행이고, 대각선의 중점이 일치한다는 성질을 이용해 먼저 $k$를 구한 뒤 넓이로 $a$를 구한다.
> 1단계: 각 점의 좌표를 구한다.
> 직선 $y=3$과 $y=3^{x+1}$의 교점은 $3^{x+1}=3$이므로 $x=0$이다. 따라서 $A=(0,3)$이다.
> 직선 $y=3$과 $y=a^{x+1}$의 교점은 $a^{x+1}=3$이므로 $x=\log_a 3-1$이다. 따라서 $B=(\log_a 3-1,\ 3)$이다.

- **독립 판정·핵심 연결/검산:** 실물 q20.png의 평행사변형 좌표가 A(0,3),B(1,3),C(−2,1/3),D(−3,1/3)이고, k=1/3,a=√3, ak=3^-1/2로 확인.
- 문제 그림: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20.png` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_순천여고_1학기_중간_고2_대수/q20-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x | x \le 2\}$인 함수 $y = 2^{2x} - 2^{x+1} - 8$은 $x=a$일 때 최\n댓값 $M$을 갖고 $x=b$일 때 최솟값 $m$을 갖는다. 실수\n$a, b, M, m$을 구하는 과정과 정답을 서술하시오. [6점]
```

- 원본 `answer`: `a=2, b=0, M=0, m=-9`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $2^x = t$로 치환한다. $x \le 2$이므로 $t$의 범위는 $0 < t \le 4$이다.
> 2단계: 주어진 함수를 $t$에 대한 이차함수로 나타내면 $y = t^2 - 2t - 8 = (t-1)^2 - 9$이다.
> 3단계: 대칭축이 $t=1$이고 범위가 $0 < t \le 4$이므로, $t=1$일 때 최솟값을 갖고, 대칭축에서 가장 먼 $t=4$일 때 최댓값을 갖는다.
> 4단계: $t=1$일 때 $y = -9$이므로 $m = -9$이다. 이때 $2^x = 1$이므로 $x=0$이 되어 $b=0$이다.

- **독립 판정·핵심 연결/검산:** 2^x=t∈(0,4], y=(t−1)²−9에서 최소 t1→−9, 최대 t4→0.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
빛이 어떤 유리판을 한 장 통과할 때마다 그 밝기가 $5\%$씩 감소\n한다고 한다. 밝기가 $A$인 빛이 이 유리판을 $20$장 통과했을 때\n그 밝기는 처음의 몇 배가 되는지 구하는 과정과 정답을 서술하시\n오. (단, $\log 9.5 = 0.9777$, $\log 3.581 = 0.5540$으로 계산한다.) [7점]
```

- 원본 `answer`: `0.3581`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $20$장 통과 후의 밝기는 $A(1 - 0.05)^{20} = A(0.95)^{20}$이다. 처음 밝기의 $x$배가 된다고 하면 $x = 0.95^{20}$이다.
> 2단계: 양변에 상용로그를 취하면 $\log x = 20\log 0.95$이다.
> 3단계: $\log 0.95 = \log (9.5 \times 10^{-1}) = \log 9.5 - 1 = 0.9777 - 1 = -0.0223$이다.
> 4단계: $\log x = 20 \times (-0.0223) = -0.446$이다.

- **독립 판정·핵심 연결/검산:** 20장 후 비율 .95²⁰, log값 −.446=−1+.554, 주어진 log3.581로 .3581.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — UPGRADE

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `218d631bb69516db8403a7af272b81e83fb64cfc`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$1$이 아닌 세 양수 $a, b, c$가 $-5\log_a b = 25\log_b c = \log_c a$ 를 만\n족시킨다. $b \times c$의 값이 $200$ 이하의 자연수가 되도록 하는 모든\n자연수 $a$의 값의 합을 구하는 과정과 정답을 서술하시오. [7점]
```

- 원본 `answer`: `275`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 1단계: $-5\log_a b = 25\log_b c = \log_c a = k$라 둔다.
> 2단계: $\log_a b = -\frac{k}{5}$, $\log_b c = \frac{k}{25}$, $\log_c a = k$이다.
> 3단계: 로그의 성질에 의해 $\log_a b \times \log_b c \times \log_c a = 1$이므로, $(-\frac{k}{5}) \times (\frac{k}{25}) \times k = 1 \Rightarrow -\frac{k^3}{125} = 1 \Rightarrow k^3 = -125 \Rightarrow k = -5$이다.
> 4단계: 대입하면 $\log_a b = 1 \Rightarrow b = a$이고, $\log_b c = -\frac{1}{5} \Rightarrow c = b^{-\frac{1}{5}} = a^{-\frac{1}{5}}$이다.

- **독립 판정·핵심 연결/검산:** 로그의 곱은 1이므로 공통값 k³=−125→k=−5, b=a,c=a^-1/5; a^4/5 자연수의 5제곱수 조건 설명 보강 필요.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q23 학생용 개선 해설 (전체안)

1. 공통값을 $k=-5\log_a b=25\log_b c=\log_c a$라 하자. 로그의 순환 곱이 $1$이므로
$$
1=(\log_a b)(\log_b c)(\log_c a)
=(-k/5)(k/25)k=-k^3/125.
$$
따라서 $k=-5$.
2. $\log_a b=1$에서 $b=a$, $\log_b c=-1/5$에서 $c=a^{-1/5}$이다. 그러므로 $bc=a^{4/5}$이다.
3. $a$는 자연수, $bc$도 자연수여야 한다. $bc=t\in\mathbb N$이라 놓으면 $a^4=t^5$. 어떤 소수 $p$가 $a$에 $e$번 나타나면 왼쪽의 $p$ 지수는 $4e$이고, 오른쪽은 5의 배수다. $4$와 $5$는 서로소이므로 $e$는 5의 배수여야 한다. 모든 소수에 대해 마찬가지이므로 $a=m^5$인 자연수 $m\ge2$이다.
4. 이때 $bc=m^4\le200$. $2^4=16,3^4=81,4^4=256$이므로 $m=2,3$만 가능하다.
5. $a=2^5=32$ 또는 $3^5=243$. 합은 $\boxed{275}$.

검산: $m=2,3$에 $b=a,c=1/m$을 대입하면 모든 로그 밑·진수가 양수이며 $1$이 아니고, $bc=m^4\le200$이다.

## 완료 판정·다음 작업

- 분모 23문항 모두 읽음. 판정 합 `21+2+0+0=23`.
- 학생용 개선 `2`건의 완성안 작성; HOLD `0`건은 원문/정답 승인 대기.
- 원본 자료·그림 원복/변경 `NONE`; `main` 수정 `NONE`; Golden/Negative/학생 렌더/출고 `NOT_RUN`.
- 다음 시험지는 동일 queue의 아직 미완료된 1학기 중간 2025년 대수 기출을 파일명 정렬 순서로 선택.
