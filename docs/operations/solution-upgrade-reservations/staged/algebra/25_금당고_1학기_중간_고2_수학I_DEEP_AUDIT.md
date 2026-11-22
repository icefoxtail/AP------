# 2025 25_금당고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_금당고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_금당고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 18 · UPGRADE 3 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 21문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로만 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q07.png` — Git blob `2837f0ea9a7ed58af2114417b3cb390c5704e75a`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10.png` — Git blob `3191b4ffe0ad749e05cad1aa6646e3f0b5f2c232`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q15.png` — Git blob `f950950f3f15e6f2527e5bcdebd7efdd3d435c63`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16.png` — Git blob `ff2c697958683a67481fdb42ce9a5ba89dd25ee4`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-engine-v3.svg` — Git blob `8f844c61ee65b48902aae913f0452dbe5e7fe5e5`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20.png` — Git blob `0bd5e242f050a7b515c306c755922ea857f8aa31`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- solutionImage 보조 자산: 소스가 가리키는 4개 SVG의 파일 존재와 Git blob만 확인; **보조 해설 그림의 전수 시각 판독·학생 렌더는 NOT_RUN**.
  - Q10 `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10-solution-v2.svg` — `f308a3d697a975f77d810182f8d06afd8f7f65d6`
  - Q16 `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16-solution-v2.svg` — `1e92830b9d402a2ed1322f7d8d1028eb17d9d8b5`
  - Q18 `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-replacement.svg` — `735a147273ea3aed19cf4eb6dab686504bcd86bf`
  - Q20 `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20-solution-v3.svg` — `964ca3c7e1a7e62a4091484eb0424c1cc8a42ca5`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 옳지 않은 것은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $90^\circ = \dfrac{\pi}{2}$
② $60^\circ = \dfrac{\pi}{3}$
③ $\dfrac{\pi}{4} = 45^\circ$
④ $-\dfrac{\pi}{6} = -30^\circ$
⑤ $\dfrac{4}{3}\pi = 180^\circ$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 호도법에서 $\pi$ radian은 $180^\circ$이다.
> $\dfrac43\pi=\dfrac43\cdot180^\circ=240^\circ$이므로 ⑤의 등식은 옳지 않다.

- **독립 판정·핵심 연결/검산:** ⑤의 4π/3 라디안은 240°이므로 180°라는 보기만 거짓; 나머지 네 각 변환도 성립.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sqrt[3]{\sqrt{64}}$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $1$
② $2$
③ $4$
④ $8$
⑤ $10$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 먼저 $\sqrt{64}=8$이다. 따라서
> $\sqrt[3]{\sqrt{64}}=\sqrt[3]8=2$이다.
> 정답은 ②이다.

- **독립 판정·핵심 연결/검산:** √64=8을 먼저 계산하고 세제곱근 ∛8=2로 정답 ②를 재확인.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$2\log_3 9 + \log_5 25 - \log_2 4$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $1$
② $2$
③ $4$
④ $8$
⑤ $10$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $\log_3 9=2$, $\log_5 25=2$, $\log_2 4=2$이므로
> $2\log_3 9+\log_5 25-\log_2 4=2\cdot2+2-2=4$이다.
> 정답은 ③이다.

- **독립 판정·핵심 연결/검산:** 로그의 곱셈·거듭제곱 법칙으로 제시된 수치를 따로 계산하면 보기와 정답이 일치.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin\left(\dfrac{\pi}{2} + \dfrac{\pi}{3}\right)$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-\dfrac{\sqrt{3}}{2}$
② $-\dfrac{1}{2}$
③ $0$
④ $\dfrac{1}{2}$
⑤ $\dfrac{\sqrt{3}}{2}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $\dfrac\pi2+\dfrac\pi3=\dfrac{5\pi}6$이므로
> $\sin(\dfrac{5\pi}6)=\sin(\pi-\dfrac\pi6)=\dfrac12$이다.
> 정답은 ④이다.

- **독립 판정·핵심 연결/검산:** sin(5π/6)=1/2로 기준각 π/6, 제2사분면 부호를 검산.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $2^{x-2} = 32$의 해는? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $1$
② $3$
③ $5$
④ $7$
⑤ $9$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $32=2^5$이므로 $2^{x-2}=2^5$에서 $x-2=5$이다.
> 따라서 $x=7$이고 정답은 ④이다.

- **독립 판정·핵심 연결/검산:** 주어진 로그/지수 관계를 정의역과 함께 대입하여 x=7 검산.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_2 9 \times \log_3 4$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $2$
② $4$
③ $8$
④ $16$
⑤ $32$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $\log_2 9=2\log_2 3$, $\log_3 4=2\log_3 2$이다.
> 따라서 $\log_2 9\cdot\log_3 4=4(\log_2 3)(\log_3 2)=4$이다.
> 정답은 ②이다.

- **독립 판정·핵심 연결/검산:** 같은 밑 로그를 하나로 합쳐 인수분해하면 원문 수치 4가 나옴.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
아래 그림과 같이 반지름의 길이가 $3$, 중심각의 크기가 $30^\circ$인 부채꼴의 넓이는? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\dfrac{\pi}{4}$
② $\dfrac{\pi}{2}$
③ $\dfrac{3}{4}\pi$
④ $\pi$
⑤ $2\pi$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $30^\circ=\dfrac\pi6$ radian이다. 부채꼴의 넓이는 $\dfrac12r^2\theta$이므로
> $S=\dfrac12\cdot3^2\cdot\dfrac\pi6=\dfrac{3\pi}4$이다.
> 정답은 ③이다.

- **독립 판정·핵심 연결/검산:** 실물 q07.png의 반지름 3·중심각 30° 확인, S=9(π/6)/2=3π/4.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q07.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = 2^x$의 그래프를 $x$축 방향으로 $a$만큼 $y$축 방향으로 $b$만큼 평행이동한 그래프가 $(0, 3)$을 지나고 점근선이 직선 $y = 1$일 때, $ab$의 값은? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-5$
② $-4$
③ $-3$
④ $-2$
⑤ $-1$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 평행이동한 그래프는 $y=2^{x-a}+b$이다. 점근선이 $y=1$이므로 $b=1$이다.
> $(0,3)$을 대입하면 $3=2^{-a}+1$에서 $a=-1$이다.
> 따라서 $ab=-1$이고 정답은 ⑤이다.

- **독립 판정·핵심 연결/검산:** 지수함수의 평행이동과 서로 대응하는 점을 비교하면 ab=-1; 식과 일치.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid -1 \le x \le 2\}$일 때, 함수 $y = 3^{x-1} - 1$의 최댓값을 $M_1$, 함수 $y = \log_{\frac{1}{3}}(2x+5) + 3$의 최댓값을 $M_2$라 하자. $M_1 + M_2$의 값을 구하면? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $4$
② $6$
③ $8$
④ $10$
⑤ $12$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $y=3^{x-1}-1$은 증가함수이므로 $x=2$에서 $M_1=2$이다.
> 밑이 $\frac{1}{3}$인 로그함수는 감소하므로 $x=-1$에서 $M_2=\log_{\frac{1}{3}}3+3=2$이다.
> 따라서 $M_1+M_2=4$이고 정답은 ①이다.

- **독립 판정·핵심 연결/검산:** 지수함수는 증가하여 x=2에서 M₁=3−1=2, 밑 1/3의 로그함수는 감소하여 x=−1에서 M₂=−1+3=2; 합 4.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
오른쪽 그림은 함수 $y = \sin x$의 그래프를 나타낸 것이다. $0 \le x \le 2\pi$일 때, 방정식 $\sin x = \dfrac{1}{2}$의 모든 해의 합은? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\dfrac{5}{6}\pi$
② $\pi$
③ $\dfrac{7}{6}\pi$
④ $\dfrac{4}{3}\pi$
⑤ $2\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 그래프와 $y=\dfrac12$의 교점에서 $\sin x=\dfrac12$이다.
> $0\le x\le2\pi$에서 $x=\dfrac\pi6,\dfrac{5\pi}6$이므로 두 해의 합은 $\pi$이다.
> 정답은 ②이다.

- **독립 판정·핵심 연결/검산:** 실물 q10.png는 y=sin x; sin x=1/2의 두 근 π/6,5π/6 합 π.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10.png` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q10-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식 $2\cos\left(x-\dfrac{\pi}{3}\right) < 1$의 해가 $\alpha < x < \beta$일 때, $\beta-\alpha$의 값은? (단, $0 \le x \le 2\pi$) [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\dfrac{1}{3}\pi$
② $\dfrac{2}{3}\pi$
③ $\pi$
④ $\dfrac{4}{3}\pi$
⑤ $\dfrac{5}{3}\pi$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $t=x-\dfrac\pi3$으로 두면 $\cos t<\dfrac12$이다.
> $-\dfrac\pi3\le t\le\dfrac{5\pi}3$에서 해는 $\dfrac\pi3<t<\dfrac{5\pi}3$이다.
> 따라서 $\dfrac{2\pi}3<x<2\pi$이고 $\beta-\alpha=\dfrac{4\pi}3$이다. 정답은 ④이다.

- **독립 판정·핵심 연결/검산:** cos(x−π/3)<1/2은 x∈(2π/3,2π), 양끝 구간 확인, 길이 4π/3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식 $2\sin^2 x - 4\cos x + a - 6 \le 0$이 모든 실수 $x$에 대하여 성립하도록 하는 실수 $a$의 최댓값은? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $0$
② $1$
③ $2$
④ $3$
⑤ $4$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $t=\cos x$이면 $-1\le t\le1$이고 $\sin^2x=1-t^2$이다.
> 주어진 식의 왼쪽은 $2(1-t^2)-4t+a-6=-2(t+1)^2+a-2$이다.
> 이 값이 항상 $0$ 이하이려면 $a\le2$이므로 최댓값은 $2$이다. 정답은 ③이다.

- **독립 판정·핵심 연결/검산:** cos x=t∈[-1,1]로 치환 후 −2(t+1)^2+a−2의 최대가 t=−1에서 a−2임을 점검, a=2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x > 1$인 실수 $x$에 대하여 $x$의 제곱근 중 음수인 것을 $f(x)$, $x$의 세제곱근 중 실수인 것을 $g(x)$라 하자. $(f \circ g)(x)$의 값이 정수가 되도록 하는 $1$보다 큰 실수 $x$의 최솟값은? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $4$
② $8$
③ $16$
④ $32$
⑤ $64$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $f(x)=-\sqrt{x}$, $g(x)=\sqrt[3]{x}$이므로
> $(f\circ g)(x)=-x^{\frac{1}{6}}$이다. 이것이 정수가 되려면 $x^{\frac{1}{6}}$은 양의 정수이다.
> $1$보다 큰 $x$의 최솟값은 $2^6=64$이고 정답은 ⑤이다.

- **독립 판정·핵심 연결/검산:** 합성함수 f(g(x))=−x^(1/6)의 정수 조건에서 x=64를 원식에 재대입.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
기압고도계는 지면으로부터의 고도에 따라 대기압이 달라지는 현상을 이용하여 고도를 측정하는 기기이다. 해수면에서의 대기압을 $p_0\text{기압}$, 측정하고자 하는 고도에서의 대기압을 $p\text{기압}$이라 할 때, 기압고도계로 측정한 고도 $h\text{미터}$는 다음과 같다.
$$h = 44000\left\{1-\left(\dfrac{p}{p_0}\right)^{0.2}\right\}$$
측정하고자 하는 고도에서의 대기압이 해수면에서의 대기압의 $\dfrac{1}{5}$배일 때, 기압고도계로 측정한 고도 $h\text{미터}$는? [4.8점]
(단, $\log 2 = 0.30$, $\log 7.25 = 0.86$으로 계산한다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $12100$
② $12200$
③ $12300$
④ $12400$
⑤ $12500$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $\log(\frac{1}{5})=-(1-\log2)=-0.70$이므로 $\log((\frac{1}{5})^{0.2})=-0.14$이다.
> $\log7.25=0.86$에서 $10^{-0.14}=10^{0.86-1}\approx0.725$이다.
> 따라서 $h\approx44000(1-0.725)=12100$이고 정답은 ①이다.

- **독립 판정·핵심 연결/검산:** 로그 모델의 상용로그 표기와 근삿값 log7.25=.86, log2=.30를 사용해 h≈12100 재계산.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = a\cos(bx+c)+d$의 그래프가 다음과 같다. 네 상수 $a, b, c, d$에 대하여 $abcd$의 값은? [5점]
(단, $a > 0$, $b > 0$, $-\pi < c < 0$, $d > 0$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-8\pi$
② $-6\pi$
③ $-4\pi$
④ $-2\pi$
⑤ $-\pi$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 그래프에서 최댓값은 $5$, 최솟값은 $-1$이므로 $a=3$, $d=2$이다.
> 최댓값 사이의 간격은 $\pi$이므로 주기는 $\pi$, 따라서 $b=2$이다.
> $x=\pi/3$에서 최댓값이므로 $2(\pi/3)+c=0$에서 $c=-2\pi/3$이다.
> $abcd=3\cdot2\cdot(-2\pi/3)\cdot2=-8\pi$이므로 정답은 ①이다.

- **독립 판정·핵심 연결/검산:** 실물 q15.png 최댓값 5·최솟값 -1·봉우리 π/3,4π/3 확인; a3,d2,b2,c−2π/3에서 abcd=−8π.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q15.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
오른쪽 그림과 같이 반지름의 길이가 $3$이고 중심각의 크기가 $\dfrac{\pi}{6}$인 부채꼴 $\mathrm{OAB}$가 있다. 선분 $\mathrm{OA}$ 위의 점 $\mathrm{P}$에 대하여 선분 $\mathrm{PA}$를 지름으로 하고 선분 $\mathrm{OB}$에 접하는 반원을 $\mathrm{C}$라 할 때, 부채꼴 $\mathrm{OAB}$의 넓이를 $S_1$, 반원 $\mathrm{C}$의 넓이를 $S_2$라 하자. $S_1 + S_2$의 값은? [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\dfrac{1}{4}\pi$
② $\dfrac{1}{2}\pi$
③ $\dfrac{3}{4}\pi$
④ $\pi$
⑤ $\dfrac{5}{4}\pi$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $OP=p$라 하면 반원의 중심 $M$은 $OA$ 위에서 $OM=\frac{p+3}{2}$, 반지름은 $\frac{3-p}{2}$이다.
> $OB$와 $OA$의 각이 $\pi/6$이고 반원이 $OB$에 접하므로
> $\dfrac{p+3}{2}\sin\dfrac\pi6=\dfrac{3-p}{2}$이다. 따라서 $p=1$이고 반지름은 $1$이다.
> $S_1=\dfrac12\cdot3^2\cdot\dfrac\pi6=\dfrac{3\pi}4$, $S_2=\dfrac\pi2$이므로 합은 $\dfrac{5\pi}4$이다. 정답은 ⑤이다.

- **독립 판정·핵심 연결/검산:** 실물 q16.png에서 반원 중심 M의 OB까지 수선거리=반지름. OP=1, 반지름1, 두 넓이 3π/4+π/2=5π/4.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16.png` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q16-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$n$이 자연수일 때, $0 \le x \le 2n\pi$에서 방정식 $\sin(nx) = \dfrac{1}{2}$을 만족하는 해의 개수를 $f(n)$이라 하자. 이때 $f(n) \le 270$을 만족하는 $n$의 최댓값은? [5.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $7$
② $9$
③ $11$
④ $13$
⑤ $15$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $t=nx$로 놓으면 $0\le t\le2n^2\pi$이다. 한 주기마다 $\sin t=\frac{1}{2}$의 해는 2개이므로 $f(n)=2n^2$이다.
> $2n^2\le270$에서 $n^2\le135$이고 $11^2\le135<12^2$이다.
> 따라서 최댓값은 11, 정답은 ③이다.

- **독립 판정·핵심 연결/검산:** 0≤x≤2nπ에서 sin(nx)=1/2의 근을 n의 각도 길이로 세면 2n²개, 제시 범위에서 n=11 검산.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — UPGRADE

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
아래 그림과 같이 두 함수 $f(x)=2^x-1$, $g(x)=\log_2(x+1)$의 그래프가 $x$축과 만나는 공통점을 $\mathrm{A}$라 하자. 두 그래프의 공통점 중 $x$좌표가 $1$인 점을 $\mathrm{D}$라 하고, 점 $\mathrm{B}$는 $y=f(x)$ 위에서 $x$좌표가 $3$인 점, 점 $\mathrm{C}$는 $y=g(x)$ 위에서 $y$좌표가 $2$인 점이라 하자. 삼각형 $\mathrm{ADC}$의 넓이를 $S_1$, 삼각형 $\mathrm{DBC}$의 넓이를 $S_2$라 할 때, $S_1+S_2$의 값은? [5.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\dfrac{9}{2}$
② $\dfrac{11}{2}$
③ $6$
④ $9$
⑤ $11$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 두 그래프의 $x$절편을 구하면 $f(x)=0$에서 $x=0$, $g(x)=0$에서 $x+1=1$이므로 공통점은 $\mathrm{A}=(0,0)$이다. $x=1$일 때 $f(1)=1$, $g(1)=1$이므로 $\mathrm{D}=(1,1)$이다. $\mathrm{B}$는 $x=3$인 $f$ 위의 점이므로 $\mathrm{B}=(3,7)$이고, $\mathrm{C}$는 $g(x)=2$에서 $x+1=4$이므로 $\mathrm{C}=(3,2)$이다.
> 좌표의 행렬식을 이용하면 $S_1=\dfrac12|1\cdot2-1\cdot3|=\dfrac12$이다.
> 또 $\overrightarrow{DB}=(2,6)$, $\overrightarrow{DC}=(2,1)$이므로 $S_2=\dfrac12|2\cdot1-6\cdot2|=5$이다.
> 따라서 $S_1+S_2=\dfrac12+5=\dfrac{11}{2}$이므로 정답은 ②이다.

- **독립 판정·핵심 연결/검산:** 실물 q18 SVG의 A,D,B,C 위치와 원본 좌표를 확인; 수치 11/2은 맞으나 행렬식·벡터를 쓰는 기존 풀이는 대수/수학Ⅰ 범위에 맞춰 초등기하로 대체 필요.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-engine-v3.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q18-problem-replacement.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q18 학생용 개선 해설 (전체안)

1. 두 함수의 $x$절편은 모두 $x=0$이므로 $A(0,0)$이다. $x=1$에서 $2^1-1=\log_2(1+1)=1$이므로 $D(1,1)$이다.
2. $x_B=3$이므로 $B=(3,2^3-1)=(3,7)$. $\log_2(x_C+1)=2$에서 $x_C=3$이므로 $C(3,2)$이다.
3. $A,D$는 직선 $y=x$ 위에 있다. 이 직선과 $BC$가 놓인 직선 $x=3$의 교점을 $E(3,3)$이라 하자. $EC=1$이고 $A,D,E$는 순서대로 일직선 위에 있다. 세로변 $EC$를 밑변으로 보면 $\triangle AEC$의 높이는 $3$, $\triangle DEC$의 높이는 $2$이므로
$$
S_1=[\triangle AEC]-[\triangle DEC]
=\frac12\cdot1\cdot3-\frac12\cdot1\cdot2=\frac12.
$$
4. $BC=7-2=5$이고 $D$에서 직선 $x=3$까지의 거리는 $3-1=2$이다. 따라서
$$
S_2=[\triangle DBC]=\frac12\cdot5\cdot2=5.
$$
5. $S_1+S_2=\frac12+5=\boxed{\frac{11}{2}}$ (②).

검산: 두 넓이는 양수이고, $\triangle DBC$의 세로 밑변·가로 높이가 그림과 일치한다. 행렬식이나 벡터 넓이 공식은 쓰지 않았다.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서·논술형 1] 부등식 $\log_3(x-1) - \log_3\left(\dfrac{2}{3}x-1\right) - 1 > 0$의 해가 $\alpha < x < \beta$일 때, $\alpha\beta$의 값을 풀이과정과 함께 상세하게 서술하시오. [5점]
```

- 원본 `answer`: `3`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그의 진수 조건에서 $x>\frac{3}{2}$이다.
> 로그를 합치고 밑 $3>1$을 이용하면 $\dfrac{x-1}{(\frac{2}{3})x-1}>3$이다.
> 정의역에서 분모가 양수이므로 $x-1>2x-3$, 즉 $x<2$이다.
> 따라서 $(\alpha,\beta)=(\frac{3}{2},2)$이고 $\alpha\beta=3$이다.

- **독립 판정·핵심 연결/검산:** 진수·밑 조건을 합친 3/2<x<2와 끝점 배제를 확인; 두 경계 곱은 3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — UPGRADE

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서·논술형 2] 아래 그림과 같이 곡선 $y = -\log_a x$ ($a > 1$)와 원 $C: \left(x - \dfrac{5}{3}\right)^2 + y^2 = \dfrac{17}{9}$이 만나는 서로 다른 두 점을 $\mathrm{P}, \mathrm{Q}$라 하자. 선분 $\mathrm{PQ}$가 원 $C$의 지름일 때, $a$의 값을 풀이과정과 함께 상세하게 서술하시오. [7점]
```

- 원본 `answer`: `27`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 원의 중심은 $M=(\frac{5}{3},0)$이다. $P=(u,v)$라 하면 $Q=(\frac{10}{3}-u,-v)$이고 두 점이 같은 로그곡선 위에 있으므로 $u(\frac{10}{3}-u)=1$이다.
> 따라서 $u=\frac{1}{3}$ 또는 $3$이며, 그림에서 $P$는 $x<1$이므로 $u=\frac{1}{3}$이다.
> 원에 대입하면 $v^2=\frac{17}{9}-(\frac{1}{3}-\frac{5}{3})^2=\frac{1}{9}$이고 $P$는 $x$축 위에 있으므로 $v=\frac{1}{3}$이다.
> $\frac{1}{3}=\log_a3$에서 $a=27$이다.

- **독립 판정·핵심 연결/검산:** 실물 q20.png에서 P는 제1사분면, Q는 제4사분면. 기존 풀이의 'P는 x축 위'라는 문장이 v=1/3과 모순; 도형과 대칭성을 사용한 정정 필요.
- 문제 그림: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20.png` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_금당고_1학기_중간_고2_수학I/q20-solution-v3.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q20 학생용 개선 해설 (전체안)

1. 원의 중심은 $M(\frac53,0)$이다. 그림에서 $P$는 왼쪽 위, $Q$는 오른쪽 아래에 있다. $P=(u,v)$ ($v>0$)라고 하면 $PQ$가 지름이므로 $Q=(\frac{10}{3}-u,-v)$이다.
2. 두 점이 $y=-\log_a x$ 위에 있으므로
$$
v=-\log_a u,\qquad -v=-\log_a(\tfrac{10}{3}-u).
$$
더하면 $\log_a[u(\frac{10}{3}-u)]=0$, 즉 $u(\frac{10}{3}-u)=1$이다.
3. $3u^2-10u+3=(3u-1)(u-3)=0$이므로 $u=\frac13$ 또는 $u=3$. 왼쪽 위 점이 $P$이므로 $u=\frac13$이다.
4. 원의 방정식에 대입하면
$$
(\tfrac13-\tfrac53)^2+v^2=\tfrac{17}{9}
\ \Rightarrow\ v^2=\tfrac19.
$$
그림에서 $P$의 $y$좌표는 **양수**이므로 $v=\frac13$이다. (원본 해설의 ‘$P$는 $x$축 위’라는 구절은 ‘$x$축 위쪽’으로 바로잡아야 한다.)
5. $P(\frac13,\frac13)$를 로그곡선에 대입하면
$$
\tfrac13=-\log_a(\tfrac13)=\log_a3,
\qquad a^{1/3}=3,
$$
따라서 $\boxed{a=27}$.

검산: $Q=(3,-\frac13)$도 $y=-\log_{27}x$에 있고 $PQ$의 중점은 $(\frac53,0)$으로 원의 중심과 같다.

### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `f3ce1331fb1d5811e6f96bdcf62c57e672dd1bd6`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서·논술형 3] 두 자연수 $a, b$에 대하여 함수 $f(x) = \sin(a\pi x) + 2b$ ($0 \le x \le 1$)이 있다. 집합 $\{x \mid \log_2 f(x)\text{는 정수}\}$의 원소의 개수가 $7$이 되도록 하는 서로 다른 모든 $a$의 값의 합을 풀이과정과 함께 상세하게 서술하시오. [8점]
```

- 원본 `answer`: `10`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $f(x)$의 범위는 $[2b-1,2b+1]$이다. $b\ge2$에서는 가능한 2의 거듭제곱이 $2b$뿐이므로 $\sin(a\pi x)=0$이고 해의 수는 $a+1$이다. 따라서 $a=6$이다.
> $b=1$이면 $f(x)=1$ 또는 $2$, 즉 $\sin(a\pi x)=-1$ 또는 $0$이다. $\sin(a\pi x)=0$의 해는 $a+1$개이고, $-1$의 해는 $\lfloor(2a+1)/4\rfloor$개이다.
> $a+1+\lfloor(2a+1)/4\rfloor=7$을 만족하는 값은 $a=4$이다. 가능한 서로 다른 $a$의 합은 $4+6=10$이다.

- **독립 판정·핵심 연결/검산:** b≥2에서 2b가 실제 2의 거듭제곱인지 확인이 누락되어 있으므로 경우별 존재성 및 7개 해 셈을 보강할 필요.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q21 학생용 개선 해설 (전체안)

1. $\log_2 f(x)$가 정수라는 것은 $f(x)$가 $1,2,4,8,\ldots$ 중 하나라는 뜻이다. $f(x)=\sin(a\pi x)+2b$이므로 $2b-1\le f(x)\le2b+1$이다.
2. **$b\ge2$**: 끝값 $2b-1,2b+1$은 $3$ 이상인 홀수이므로 2의 거듭제곱일 수 없다. 구간에 들어올 수 있는 거듭제곱은 가운데의 짝수 $2b$뿐이다. 단, 이것도 $2b$가 2의 거듭제곱일 때만 가능하다. 예컨대 $b=2$면 $2b=4$여서 실제 가능하다. 이 경우 $\sin(a\pi x)=0$, $x=0,\frac1a,\ldots,1$로 해가 $a+1$개이다. $a+1=7$에서 $\boxed{a=6}$.
3. **$b=1$**: $1\le f(x)\le3$에서 가능한 거듭제곱은 $1$과 $2$이다. 따라서 $\sin(a\pi x)=-1$ 또는 $0$이다. $0$의 해는 $a+1$개, $-1$의 해는 $0\le a\pi x\le a\pi$에 속하는 $3\pi/2,7\pi/2,11\pi/2,\ldots$의 수인 $\lfloor(2a+1)/4\rfloor$개이다. 두 해집합은 겹치지 않는다.
4. 조건은
$$
a+1+\left\lfloor\frac{2a+1}{4}\right\rfloor=7.
$$
왼쪽은 $a$에 따라 증가한다. $a=4$에서 $5+\lfloor9/4\rfloor=7$, $a=3$에서 $4+\lfloor7/4\rfloor=5$, $a=5$에서 $6+\lfloor11/4\rfloor=8$이므로 이 경우는 $\boxed{a=4}$뿐이다.
5. 가능한 서로 다른 $a$는 $4,6$이며 합은 $\boxed{10}$.

검산: $b=1,a=4$는 영점 5개와 $-1$점 2개; $b=2,a=6$은 영점 7개로 각각 실제 해 7개를 만든다.

## 완료 판정·다음 작업

- 분모 21문항 모두 읽음. 판정 합 `18+3+0+0=21`.
- 학생용 개선 `3`건의 완성안 작성; HOLD `0`건은 원문/정답 승인 대기.
- 원본 자료·그림 원복/변경 `NONE`; `main` 수정 `NONE`; Golden/Negative/학생 렌더/출고 `NOT_RUN`.
- 다음 시험지는 동일 queue의 아직 미완료된 1학기 중간 2025년 대수 기출을 파일명 정렬 순서로 선택.
