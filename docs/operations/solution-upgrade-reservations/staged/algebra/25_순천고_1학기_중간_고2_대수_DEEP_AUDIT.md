# 2025 25_순천고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_순천고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_순천고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 24 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
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

검토 방식: 원본 질문 `content`, `choices`, `answer`, `solution`을 전 문항 실제 읽고, 정답·진수/밑 조건·구간 끝점·부호·문항 그림을 대조했다. 원문 풀이의 핵심을 그대로 인용하고 판정 사유를 문항별로 기재했다. UPGRADE는 기존 해설을 그대로 대체해도 이해할 수 있도록 처음부터 끝까지 새로 썼다. HOLD는 정답을 임의 결정하지 않는다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지 증거

- `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-problem-v2.svg` — Git blob `0c986d83f3e8740cfc3e57090063e7808a68d487`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- Q05: 원본 `content` 안의 inline SVG를 추출하여 렌더·시각 판독 (별도 이미지 파일·blob 없음)
- Q24: 원본 `content` 안의 inline SVG를 추출하여 렌더·시각 판독 (별도 이미지 파일·blob 없음)
- solutionImage 보조 자산: 소스가 가리키는 6개 SVG의 파일 존재와 Git blob만 확인; **보조 해설 그림의 전수 시각 판독·학생 렌더는 NOT_RUN**.
  - Q05 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q5-solution.svg` — `4226accf2f90d7324921073a7875da251de1ac88`
  - Q09 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q9-solution.svg` — `a26fdbed54ca9ae16ef4529ab1fe0b0220ca986c`
  - Q13 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-solution.svg` — `693120526563f1edda494cc010052e614f024c4f`
  - Q14 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q14-solution.svg` — `c3eb5b91f2c782b2879ce2b8b7ff7563203a8c2b`
  - Q15 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q15-solution.svg` — `69d34344b29c227294d1d46ab83a8eb6f22b3804`
  - Q24 `archive/assets/images/25_순천고_1학기_중간_고2_대수/q24-solution-v2.svg` — `380721ccc4ef16316e862d6b1d59e0e830cac6bd`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 옳은 것은? (3.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $4^{\frac{1}{2}}=\sqrt{2}$
② $9^{-\frac{3}{2}}=27$
③ $2^{-1}=-\frac{1}{2}$
④ $7^{\frac{2}{3}}=\sqrt[3]{49}$
⑤ $(-3)^{-4}=-\frac{1}{81}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 분수 지수와 음의 지수의 뜻을 정확히 적용한다.
> 1번을 보면
> $4^{\frac{1}{2}}=\sqrt{4}=2$ 이므로 $\sqrt{2}$가 아니다.
> 2번을 보면

- **독립 판정·핵심 연결/검산:** ①2, ②1/27, ③1/2, ④∛49, ⑤1/81로 지수·부호를 비교하면 ④만 옳음.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_6 4 + \log_6 9$의 값은? (3.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1
② 2
③ 3
④ 4
⑤ 5
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 같은 밑의 로그의 합은 곱의 로그로 바꾼다.
> $\log_6 4+\log_6 9=\log_6(4\times 9)=\log_6 36$
> 그런데 $36=6^2$ 이므로
> $\log_6 36=\log_6 6^2=2$

- **독립 판정·핵심 연결/검산:** log_6 4+log_6 9=log_6 36=2; ②.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
아래 상용로그표에서 $\log 21$의 값은? (3.3점)\n<div class="question-table-wrap"><table class="question-table"><thead><tr><th>수</th><th>0</th><th>1</th><th>2</th><th>3</th></tr></thead><tbody><tr><td>2.0</td><td>0.3010</td><td>0.3032</td><td>0.3054</td><td>0.3075</td></tr><tr><td>2.1</td><td>0.3222</td><td>0.3243</td><td>0.3263</td><td>0.3284</td></tr><tr><td>2.2</td><td>0.3424</td><td>0.3444</td><td>0.3464</td><td>0.3483</td></tr><tr><td>2.3</td><td>0.3617</td><td>0.3636</td><td>0.3655</td><td>0.3674</td></tr><tr><td>2.4</td><td>0.3802</td><td>0.3820</td><td>0.3838</td><td>0.3856</td></tr></tbody></table></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $0.3010$
② $0.3222$
③ $1.3010$
④ $1.3222$
⑤ $3.2220$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 21을 $2.1\times 10$으로 보고 상용로그의 성질을 이용한다.
> $21=2.1\times 10$ 이므로
> $\log 21=\log(2.1\times 10)=\log 2.1+\log 10$
> 상용로그표에서 $\log 2.1=0.3222$ 이고

- **독립 판정·핵심 연결/검산:** 상용로그표 2.1 행·0 열에서 .3222 취득, log21=1+.3222=1.3222.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 각을 나타내는 동경이 속하는 사분면이 나머지 넷과 다른 하나는? (3.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $135^\circ$
② $-\frac{4}{3}\pi$
③ $510^\circ$
④ $\frac{29}{6}\pi$
⑤ $-855^\circ$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 주어진 각을 $0^\circ$ 이상 $360^\circ$ 미만의 각으로 바꾸어 사분면을 확인한다.
> ① $135^\circ$는 그대로 2사분면이다.
> ② $-\dfrac{4}{3}\pi=-240^\circ$ 이고, 여기에 $360^\circ$를 더하면 $120^\circ$이므로 2사분면이다.
> ③ $510^\circ-360^\circ=150^\circ$ 이므로 2사분면이다.

- **독립 판정·핵심 연결/검산:** 135°,120°,150°,150°는 제2사분면, −855°≡225°는 제3사분면.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=2^{x-a}+b$의 그래프가 다음 그림과 같을 때, $ab$의 값은? (단, a, b는 상수이고 점선은 그래프의 점근선이다.) (3.5점)<br><div class='flex justify-center my-4'><svg width='280' height='220' viewBox='-100 -160 320 230' xmlns='http://www.w3.org/2000/svg'><defs><marker id='arrowhead' markerWidth='10' markerHeight='7' refX='0' refY='3.5' orient='auto'><polygon points='0 0, 10 3.5, 0 7' fill='#000'/></marker></defs><line x1='-90' y1='0' x2='200' y2='0' stroke='#000' stroke-width='1.2' marker-end='url(#arrowhead)'/><line x1='0' y1='60' x2='0' y2='-140' stroke='#000' stroke-width='1.2' marker-end='url(#arrowhead)'/><line x1='-90' y1='50' x2='200' y2='50' stroke='#000' stroke-width='1' stroke-dasharray='4 3'/><path d='M -100 48 Q -20 48 0 -50 T 25 -155' fill='none' stroke='#000' stroke-width='1.8'/><text x='190' y='18' font-family='serif' font-style='italic' font-size='14'>x</text><text x='-20' y='-130' font-family='serif' font-style='italic' font-size='14'>y</text><text x='8' y='-45' font-family='serif' font-size='14'>2</text><text x='8' y='68' font-family='serif' font-size='14'>-2</text><text x='-18' y='18' font-family='serif' font-size='14'>O</text></svg></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 4
② 2
③ 1
④ -2
⑤ -4
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 점근선에서 $b$를 찾고, 그래프가 지나는 점을 이용하여 $a$를 구한다.
> 함수 $y=2^{x-a}+b$의 점근선은 $y=b$ 이다.
> 그림에서 점선이 $y=-2$ 이므로
> $b=-2$

- **독립 판정·핵심 연결/검산:** 문제에 포함된 SVG의 점근선 y=−2와 y절편 (0,2)를 비교하여 b=−2,a=−2, ab=4.
- 문제 그림: 원문 inline SVG 실물 렌더·판독 완료
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q5-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_{x+3}(-x^2+4x+45)$의 값이 존재하기 위한 모든 정수 $x$값의 합은? (3.6점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 29
② 34
③ 35
④ 44
⑤ 45
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그의 밑 조건과 진수 조건을 모두 만족해야 한다.
> 로그가 존재하려면
> (1) 밑 $x+3$이 양수이고 1이 아니어야 한다.
> (2) 진수 $-x^2+4x+45$가 양수여야 한다.

- **독립 판정·핵심 연결/검산:** 밑 x+3>0, x≠−2; 진수 −5<x<9의 정수 교집합 −1..8 합 35.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식 $\log_{\frac{1}{3}}(-x+2)\gt 1$의 해는? (3.7점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $x \gt \frac{1}{3}$
② $x \gt \frac{5}{3}$
③ $-\frac{1}{3} \lt x \lt 2$
④ $\frac{1}{3} \lt x \lt \frac{5}{3}$
⑤ $\frac{5}{3} \lt x \lt 2$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그부등식은 먼저 진수 조건을 구하고, 밑이 1보다 작은지 확인한다.
> 진수 조건부터 구하면
> $-x+2\gt 0$
> 따라서

- **독립 판정·핵심 연결/검산:** 밑 1/3이므로 부등호 역전, 0<2−x<1/3에서 5/3<x<2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid x \le 0\}$인 함수 $y=\sqrt{3}\,x$의 그래프 위의 원점이 아닌 한 점 $P$에 대해 동경 $OP$가 나타내는 각의 크기를 $\theta$라 할 때 $\sin\theta$의 값은? (단, O는 원점이고 시초선은 x축의 양의 부분이다.) (3.7점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-\frac{\sqrt{3}}{2}$
② $-\frac{\sqrt{2}}{2}$
③ $-\frac{1}{2}$
④ $\frac{1}{2}$
⑤ $\frac{\sqrt{3}}{2}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 그래프 위의 한 점을 잡아 원점과의 거리로 사인값을 구한다.
> 점 $P$는 직선 $y=\sqrt{3}x$ 위에 있다. 원점이 아닌 점이고 $x\le0$이므로 $x<0$, $y<0$이다. 따라서 $P$는 제3사분면에 있다.
> $x=-1$을 대입하면
> $y=\sqrt{3}(-1)=-\sqrt{3}$

- **독립 판정·핵심 연결/검산:** x<0, y=√3x<0이므로 제3사분면; P(−1,−√3)에서 sinθ=−√3/2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\log_3(x-1)$의 그래프의 특징에 대한 설명으로 옳은 것은? (3.8점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 점 $(1,\,0)$을 지난다.
② 점근선은 $y=1$이다.
③ 정의역은 실수 전체의 집합이다.
④ $x$값이 증가할수록 $y$값은 감소한다.
⑤ 함수 $y=3^x+1$의 그래프를 $y=x$에 대해 대칭이동한 그래프이다.
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 정의역, 점근선, 증가·감소, 역함수 관계를 차례로 확인한다.
> 함수 $y=\log_3(x-1)$에서 진수 $x-1$이 양수여야 하므로
> $x-1\gt 0 \Rightarrow x\gt 1$
> 따라서 정의역은 실수 전체가 아니라 $x\gt 1$이다.

- **독립 판정·핵심 연결/검산:** 정의역 x>1·점근선 x=1·증가함수; 역함수 y=3^x+1과 y=x 대칭인 보기⑤.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q9-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sqrt[3]{9\times\sqrt{3}}\times\sqrt[3]{9}\div\sqrt{\sqrt{243}}$을 간단히 한 값을 $a$라 할 때, $a$가 $b$의 12제곱근 중 하나이면 $b$의 값은? (4.0점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\sqrt{3}$
② 3
③ 9
④ 27
⑤ $9\sqrt{3}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 모든 수를 3의 거듭제곱으로 바꾸어 계산한다.
> 먼저
> $9\times\sqrt{3}=3^2\times 3^{\frac{1}{2}}=3^{\frac{5}{2}}$
> 따라서

- **독립 판정·핵심 연결/검산:** 3의 지수로 통일: 5/6+2/3−5/4=1/4, a^12=3³=27.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 옳지 않은 것은? (4.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $a \lt 0$일 때, $(\sqrt[3]{-a})^3=-a$
② $n$이 짝수이고 $a \gt 0$일 때, $x^n=a$를 만족시키는 실수 $x$의 값은 2개이다.
③ $(-2)^2$의 제곱근은 $\pm 2$
④ $n$이 홀수일 때, $-3$의 $n$제곱근 중 실수인 것은 $-\sqrt[n]{3}$이다.
⑤ $\sqrt{729}$의 세제곱근은 27
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 각 보기에서 거듭제곱근의 뜻을 정확히 따져 본다.
> ① $a\lt 0$이면 $-a\gt 0$이고, $(\sqrt[3]{-a})^3=-a$이므로 옳다.
> ② $n$이 짝수이고 $a\gt 0$이면 $x^n=a$를 만족하는 실수는 양수 1개, 음수 1개로 모두 2개이므로 옳다.
> ③ $(-2)^2=4$이고, 4의 제곱근은 $2$와 $-2$이므로 옳다.

- **독립 판정·핵심 연결/검산:** 제곱근/세제곱근의 주값 구분: √729=27이고 실수 세제곱근은 3이므로 ⑤가 거짓.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid \frac{1}{4} \le x \le 8\}$인 함수 $y=|\log_{\frac{1}{2}}x|+2$의 최댓값과 최솟값의 합은? (단, '||'은 절댓값 기호이다.) (4.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 7
② 8
③ 9
④ 10
⑤ 11
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그의 밑을 바꾸어 식을 단순하게 만든 뒤, 구간 끝과 기준점 $x=1$에서 값을 확인한다.
> $\log_{\frac{1}{2}}x=-\log_2 x$ 이므로
> $y=|\log_{\frac{1}{2}}x|+2=|-\log_2 x|+2=|\log_2 x|+2$
> 이제 구간 $\dfrac{1}{4}\le x\le 8$에서 값을 살펴보면

- **독립 판정·핵심 연결/검산:** |log_(1/2)x|=|log₂x|, x=1에서 2 최소, x=8에서 5 최대, 합 7.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
아래 그림과 같은 두 부채꼴 AOB, COD에 대하여 $\overset{\frown}{\text{AB}}=2\pi$, $\overset{\frown}{\text{CD}}=\frac{4}{3}\pi$이다. 색칠한 부분의 넓이가 $5\pi$일 때, $\angle\text{AOB}$의 크기는? (4.3점)<br><div class='flex justify-center my-4'><img src="assets/images/25_순천고_1학기_중간_고2_대수/q13-problem-v2.svg" style="display:block; margin:8px auto; width:245px; max-width:100%; height:auto; max-height:195px; object-fit:contain" alt="중심 O를 공유하는 두 부채꼴의 원호 사이가 색칠된 그림"></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{\pi}{9}$
② $\frac{\pi}{6}$
③ $\frac{2\pi}{9}$
④ $\frac{5\pi}{18}$
⑤ $\frac{\pi}{3}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 호의 길이와 넓이 공식을 이용하여 반지름과 중심각의 관계를 세운다.
> 바깥 부채꼴의 반지름을 $R$, 안쪽 부채꼴의 반지름을 $r$, 중심각을 $\theta$라 하자.
> 호의 길이 공식을 이용하면
> $R\theta=2\pi$, $r\theta=\dfrac{4}{3}\pi$

- **독립 판정·핵심 연결/검산:** 실물 q13.svg 두 동심 부채꼴 음영을 확인; R+r=15, (R+r)θ=10π/3이므로 θ=2π/9.
- 문제 그림: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-problem-v2.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q13-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \lt \theta \lt \frac{\pi}{2}$일 때 $\tan\theta\cos^2\theta$의 최댓값은? (4.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 0
② $\frac{1}{2}$
③ $\frac{\sqrt{2}}{2}$
④ $\frac{\sqrt{3}}{2}$
⑤ 1
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 식을 간단히 만든 뒤, 항상 성립하는 제곱식의 성질을 이용한다.
> 주어진 식을 정리하면
> $\tan\theta\cos^2\theta=\dfrac{\sin\theta}{\cos\theta}\cdot \cos^2\theta=\sin\theta\cos\theta$
> 이제

- **독립 판정·핵심 연결/검산:** tanθ cos²θ=sinθ cosθ≤1/2; θ=π/4에서 등호 성립.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q14-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \lt a \lt 1$일 때, 함수 $y=a^{x^2-2x-1}$의 최댓값이 9이다. 이때, $0 \le x \le 3$에서 함수의 최솟값이 $m$이라고 하면 $a+m$의 값은? (4.4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{10}{3}$
② $\frac{7}{3}$
③ $\frac{13}{9}$
④ $\frac{4}{9}$
⑤ $\frac{1}{9}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 밑이 0과 1 사이인 지수함수는 지수가 작을수록 함수값이 커진다.
> 지수를
> $f(x)=x^2-2x-1=(x-1)^2-2$
> 라고 두자.

- **독립 판정·핵심 연결/검산:** 지수 −2의 최솟값에서 a^-2=9→a=1/3; 0≤x≤3 지수 최댓값2→m=1/9, 합 4/9.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q15-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
모든 정수 $m, n$과 모든 유리수 $p, q$에 대해 두 집합\n$A = \{a \mid a\text{는 } a^m \div a^n = a^{m-n}, (a^m)^n = a^{mn}\text{을 만족하는 실수}\}$\n$B = \{a \mid a\text{는 } a^p \div a^q = a^{p-q}, (a^p)^q = a^{pq}\text{를 만족하는 실수}\}$\n에 관한 설명으로 옳지 않은 것은? (4.4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $0 \notin A$
② $\frac{1}{4} \in B$
③ $A \subset B$
④ $-2 \notin B$
⑤ $-\sqrt{3} \in A$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 정수 지수에서의 밑의 조건과 유리수 지수에서의 밑의 조건을 구분한다.
> 집합 $A$는 정수 지수에서 지수법칙이 항상 성립하는 실수 $a$의 집합이다.
> 정수 지수에서는 $a=0$이면 나눗셈 $a^m\div a^n$이 항상 가능하지 않으므로
> $A$에서는 $a

- **독립 판정·핵심 연결/검산:** 정수 지수법칙의 공통 정의역 A=ℝ\{0}, 유리수 지수법칙의 표준 정의역 B=(0,∞), A⊄B이므로 ③.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
2000년부터 2024년까지만 운영되었던 어떤 회사의 매출액은 이 기간동안 매년 25%씩 증가했다고 한다. 2000년에 이 회사의 매출액이 100억이었을 때 이 회사의 매출액이 처음으로 1000억 이상이 되었던 해는? (단, $\log 2 = 0.3$으로 계산한다.) (4.5점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2008년
② 2010년
③ 2012년
④ 2014년
⑤ 2016년
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 매년 25% 증가를 등비식으로 나타내고 상용로그로 부등식을 푼다.
> 2000년을 기준으로 $n$년 후의 매출액을 세우면
> $100\times(1.25)^n$
> 이다.

- **독립 판정·핵심 연결/검산:** 매출 100(5/4)^n≥1000, log(5/4)=.7−.6=.1 → n≥10, 2010년.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$x \gt 0$에서 다음 부등식\n$$x^{x^2+6} \le x^{9x-8}$$\n을 만족하는 모든 정수 $x$들의 집합을 A라고 하고 연립부등식\n$$\begin{cases} 2^{3x-1} \ge 4^x \\ 3(\sqrt{3})^x \ge (\sqrt{9})^{x-2} \end{cases}$$\n을 만족하는 모든 정수 $x$들의 집합을 B라고 하자. 이때 $A \cap B$의 모든 원소의 합은? (4.7점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 20
② 21
③ 24
④ 27
⑤ 28
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 집합 $A$, $B$를 각각 구한 뒤 공통 원소의 합을 구한다.
> 먼저 집합 $A$를 구하자.
> $x\gt 0$인 정수에 대하여
> $x^{x^2+6}\le x^{9x-8}$

- **독립 판정·핵심 연결/검산:** x=1 별도 포함, x>1에선 2≤x≤7; 연립 지수 부등식은 1≤x≤6, 공통 정수 1~6 합21.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$(4^x+4^{-x})-k(2^x+2^{-x})+11=0$이 실근이 없고, 아래 <조건>을 만족하는 자연수 $k$의 합은? (4.8점)\n<조건> $x^2-2(3^k-1)x+2(3^k+23) \le 0$을 만족하는 $x$가 존재한다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 14
② 15
③ 18
④ 20
⑤ 21
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 첫 식은 치환으로, 두 번째 조건은 판별식으로 처리한다.
> 먼저
> $t=2^x+2^{-x}$
> 라고 두면 $t\ge 2$ 이다.

- **독립 판정·핵심 연결/검산:** t=2^x+2^-x≥2로 t²−kt+9=0이 무근인 자연수 k≤5; 2차 조건 (3^k−9)(3^k+5)≥0으로 k≥2, 합 14.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
별의 밝기를 나타낼 때는 절대 등급과 겉보기 등급을 사용한다. 절대 등급은 별의 실제 밝기를 나타내는 기준으로 사용되는 등급이고 겉보기 등급은 지구에서 측정되는 별의 밝기를 등급으로 나타낸 것이다. 지구에서의 거리가 $d$파색인 별의 절대 등급을 $M$, 겉보기 등급을 $m$이라 하면 다음과 같은 식이 성립한다.\n$$M = m - 5(\log d - 1)$$\n지구와의 거리가 $\frac{15}{2}$파색이고 겉보기 등급이 2인 별의 절대 등급을 $M_A$, 지구와의 거리가 $\frac{3}{4}$파색이고 겉보기 등급이 1인 별의 절대 등급을 $M_B$라 할 때 $M_B - M_A$의 값은? (단, 파색은 거리의 단위이고 문제에 언급된 두 별이 존재한다고 가정한다.) (4.8점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -8
② -4
③ 4
④ 8
⑤ 12
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 두 별의 절대 등급을 각각 식으로 세운 뒤 빼 준다.
> 주어진 식은
> $M=m-5(\log d-1)$
> 이다.

- **독립 판정·핵심 연결/검산:** 두 거리 비 (3/4)/(15/2)=1/10, 절대 등급 차=−1−5log(1/10)=4.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
각 $\theta$를 나타내는 동경과 각 $3\theta$를 나타내는 동경이 $y$축에 대하여 대칭이라고 하자. $\sin\theta+\cos\theta \lt 0$일 때, $\tan(\theta+\frac{7}{12}\pi)$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $0 \lt \theta \lt 2\pi$이다.) (4점)
```

- 원본 `answer`: `$-\frac{\sqrt{3}}{3}$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $y$축 대칭인 두 동경의 각의 관계를 식으로 세운 뒤 조건에 맞는 $\theta$를 찾는다.
> 각 $\theta$를 나타내는 동경과 각 $3\theta$를 나타내는 동경이 $y$축에 대하여 대칭이면, 두 각의 합은 홀수배의 $\pi$가 된다.
> 따라서
> $\theta+3\theta=(2n+1)\pi$

- **독립 판정·핵심 연결/검산:** y축 대칭 각 θ+3θ=(2m+1)π, sinθ+cosθ<0에서 θ=5π/4; tan(11π/6)=−√3/3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 서로 다른 12개의 자연수들의 집합\n$$S = \{a_1, a_2, a_3, \dots, a_{12}\}$$\n에 대하여 다음 조건을 만족시킨다고 하자.\n<조건> 모든 $i = 2, 3, 4, \dots, 12$에 대하여 $\frac{a_i}{a_1} \in S$\n이때 $\log_{a_1}a_2 + \log_{a_1}a_3 + \dots + \log_{a_1}a_{12}$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오. (6점)
```

- 원본 `answer`: `77`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 조건에서 $a_1$은 로그의 밑이므로 $a_1>1$이다.
> 또한 $i=2,\ldots,12$에 대하여 $\dfrac{a_i}{a_1}\in S$이므로, $a_i$를 $a_1$로 나누어도 집합 $S$의 자연수가 나온다.
> 어떤 원소 $u\in S$가 $a_1$보다 작다고 가정하자.
> $u$는 $a_1$과 다른 원소이므로 $\dfrac{u}{a_1}\in S$여야 한다.

- **독립 판정·핵심 연결/검산:** 유한집합 닫힘성: a₁ 최소, 각 원소는 a₁로 반복 나누면 a₁에 도달, a₁^1..a₁^12; 지수 합 2+…+12=77.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 양의 실수 $a, b$와 자연수 $m, n$이 아래의 조건을 만족할 때 순서쌍 $(m, n)$의 개수를 구하는 과정을 풀이 과정과 함께 서술하시오.\n(가) $a^m = b^n$\n(나) $a^6b = a^m$ (4점)
```

- 원본 `answer`: `4`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> (나)에서 $b$를 $a$의 식으로 나타내고, 이를 (가)에 대입하여 자연수 조건을 이용한다.
> (나)에서
> $a^6b=a^m$
> 양변을 $a^6$으로 나누면

- **독립 판정·핵심 연결/검산:** b=a^(m−6), a^m=b^n에서 m(n−1)=6n. n−1은 6의 양의 약수 네 개, (m,n) 네 쌍.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b1ca8ab1c906da514fc3dca64d32ad42c1b15257`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
아래 그림과 같이 함수 $y=a^{x-2}$, 함수 $y=\log_a(x-2)$의 그래프와 함수 $y=-x+6$의 그래프의 교점을 각각 A, B라 하고 $y=-x+6$과 $y$축의 교점을 C라 하면 $\overline{\text{AB}}:\overline{\text{AC}}=2:3$이다. 이때 $a$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $a \gt 1$) (6점)<br><div class='flex justify-center my-4'><svg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'><defs><marker id='arrow' viewBox='0 0 10 10' refX='8' refY='5' markerWidth='6' markerHeight='6' orient='auto-start-reverse'><path d='M 0 0 L 10 5 L 0 10 z' fill='black'/></marker></defs><line x1='40' y1='200' x2='220' y2='200' stroke='black' stroke-width='1.2' marker-end='url(#arrow)'/><line x1='40' y1='210' x2='40' y2='20' stroke='black' stroke-width='1.2' marker-end='url(#arrow)'/><line x1='40' y1='50' x2='190' y2='200' stroke='black' stroke-width='1.5'/><path d='M 42 198 Q 100 195 115 125 C 122 80 125 40 128 15' fill='none' stroke='#000' stroke-width='1.8'/><path d='M 92 230 Q 95 185 165 175 C 205 170 230 165 245 162' fill='none' stroke='#000' stroke-width='1.8'/><circle cx='40' cy='50' r='2.5' fill='black'/><text x='20' y='55' font-size='14' font-family='serif' font-style='italic'>C</text><circle cx='115' cy='125' r='2.5' fill='black'/><text x='102' y='120' font-size='14' font-family='serif' font-style='italic'>A</text><circle cx='165' cy='175' r='2.5' fill='black'/><text x='170' y='170' font-size='14' font-family='serif' font-style='italic'>B</text><text x='225' y='215' font-size='13' font-family='serif' font-style='italic'>x</text><text x='20' y='25' font-size='13' font-family='serif' font-style='italic'>y</text><text x='20' y='215' font-size='14' font-family='serif' font-style='italic'>O</text></svg></div>
```

- 원본 `answer`: `3`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 두 그래프가 서로 역함수 관계이므로 대칭성을 이용하고, 선분의 비로 점 A의 좌표를 구한다.
> 함수 $y=a^{x-2}$와 $y=\log_a(x-2)$는 서로 역함수 관계이므로, 두 그래프는 직선 $y=x$가 아니라 이 문제의 이동된 형태를 반영하면 서로 대응되는 점들이 대칭을 이룬다.
> 직선 $y=-x+6$과 대칭의 기준이 되는 직선 $y=x-2$의 교점을 $M$이라 하자.
> 그러면

- **독립 판정·핵심 연결/검산:** 문제 내 SVG의 A,B,C 배치·반사축 y=x−2 확인; M=(4,2), C=(0,6), AB:AC=2:3에서 A=(3,3), a=3.
- 문제 그림: 원문 inline SVG 실물 렌더·판독 완료
- 보조 `solutionImage`: `archive/assets/images/25_순천고_1학기_중간_고2_대수/q24-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 완료 판정·다음 작업

- 분모 24문항 모두 읽음. 판정 합 `24+0+0+0=24`.
- 학생용 개선 `0`건의 완성안 작성; HOLD `0`건은 원문/정답 승인 대기.
- 원본 자료·그림 원복/변경 `NONE`; `main` 수정 `NONE`; Golden/Negative/학생 렌더/출고 `NOT_RUN`.
- 다음 시험지는 동일 queue의 아직 미완료된 1학기 중간 2025년 대수 기출을 파일명 정렬 순서로 선택.
