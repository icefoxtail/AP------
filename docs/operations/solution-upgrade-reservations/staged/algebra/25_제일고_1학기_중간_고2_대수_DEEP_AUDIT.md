# 2025 25_제일고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_제일고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_제일고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 20 · UPGRADE 3 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `Q11`
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

- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4.svg` — Git blob `f607c3d91b685db95ad869a350d16295f221f98d`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-1.svg` — Git blob `81d91020ce03eae7c87939820af852e525402137`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-2.svg` — Git blob `193a3f7a2abb66801ae156c2280c4b45b8df8e3b`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-3.svg` — Git blob `9c176a9377b61b95ae6f652fcfd2c07a3ada8971`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-4.svg` — Git blob `159b5b98fa79aadfc738459637b76da91827f791`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-5.svg` — Git blob `162e0b75a87ffdf9962ff4662578c095cdc98636`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-problem-engine-v3.svg` — Git blob `5bf02451dcea3af0012042bad5126d4ff46f0f2c`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- Q19: 원본 `content` 안의 inline SVG를 추출하여 렌더·시각 판독 (별도 이미지 파일·blob 없음)
- solutionImage 보조 자산: 소스가 가리키는 8개 SVG의 파일 존재와 Git blob만 확인; **보조 해설 그림의 전수 시각 판독·학생 렌더는 NOT_RUN**.
  - Q01 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q1-solution.svg` — `6f0646915ce9fd5b53f6e5be1a320c913e15fb25`
  - Q07 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q7-solution.svg` — `462e4dd71b9f94f9d35d615989a38538aa684b3d`
  - Q09 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q9-solution.svg` — `597c4b38c5d6e10cefd0e86df1b625af919350de`
  - Q12 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q12-solution.svg` — `c9fe3c3e551770180aa1f096ab2805e5fa490d40`
  - Q13 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-restored-solution.svg` — `66a080bd9b74cbefc698965f9ba1005ddd9b3966`
  - Q18 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-solution.svg` — `820689163fcff1054a7ad7c53ca279f78f604580`
  - Q19 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q19-solution-v2.svg` — `3f294fb18f2384c143973c9bc5b9677dd85cd576`
  - Q20 `archive/assets/images/25_제일고_1학기_중간_고2_대수/q20-solution-v2.svg` — `fadf4a96cbf9d0df9c12dd74f1a6063f0862455c`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
지수함수 $y=a^{x}(a>0, a\ne 1)$의 그래프의 성질로 옳지 않은 것은? (3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 정의역은 실수 전체의 집합이다.
② 치역은 양의 실수 전체의 집합이다.
③ $a>1$일 때, $x$의 값이 증가하면 $y$의 값도 증가한다.
④ $0<a<1$일 때, $x$의 값이 증가하면 $y$의 값은 감소한다.
⑤ 그래프는 점 $(0,1)$을 지나고, $y$축을 점근선으로 갖는다.
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 지수함수의 기본 그래프 개형 및 점근선 분석
> 이유: 지수함수 $y=a^x$는 $x$축($y=0$)을 점근선으로 가짐
> 근거: $x$값이 한없이 작아지거나 커질 때 $y$값은 0에 수렴하지만 닿지 않음
> 결론적으로 $y$축을 점근선으로 갖는다는 설명은 옳지 않음

- **독립 판정·핵심 연결/검산:** y=a^x의 점근선은 x축 y=0, y축이 아니라는 점을 짚어 ⑤.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q1-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\log_{3}(x+1)-1$의 그래프는 $y=\log_{3}x$의 그래프를 $x$축으로 $a$만큼, $y$축으로 $b$만큼 평행이동 한 것이다. $a+b$의 값은? (3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -2
② -1
③ 0
④ 1
⑤ 2
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 평행이동 정의를 이용한 계수 비교
> 이유: $y = \log_3(x - (-1)) + (-1)$ 꼴로 변형됨
> 근거: $x$축 이동량 $a=-1$, $y$축 이동량 $b=-1$임
> 결론적으로 $a+b = -1 + (-1) = -2$

- **독립 판정·핵심 연결/검산:** log₃(x+1)−1은 왼쪽1·아래1 이동, a+b=−2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $\log_{4}(3x+10)=2\log_{4}x$의 해는? (3.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -2
② 1
③ 3
④ 5
⑤ 8
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 진수 조건 확인 및 로그 성질 적용
> 이유: 진수 조건 $x>0$을 반드시 만족해야 함
> 근거: $\log_4(3x+10) = \log_4 x^2$에서 $x^2-3x-10=0$이 도출됨
> 정리하면 $(x-5)(x+2)=0$에서 $x=5$만 해로 인정됨

- **독립 판정·핵심 연결/검산:** x>0에서 log₄(3x+10)=log₄x²; (x−5)(x+2)=0 중 x5만 허용.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\frac{\sqrt[4]{32}}{\sqrt[4]{\sqrt{4}}}$ 의 값은? (3.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\sqrt{2}$
② 2
③ $2\sqrt{2}$
④ 4
⑤ $4\sqrt{2}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 거듭제곱근을 지수 법칙으로 변환하여 계산
> 이유: 분자는 $2^{\frac{5}{4}}$, 분모는 $\sqrt[8]{2^2} = 2^{\frac{1}{4}}$임
> 근거: 나눗셈은 지수의 차이므로 $2^{\frac{5}{4} - \frac{1}{4}} = 2^1$
> 결론적으로 2

- **독립 판정·핵심 연결/검산:** 분자 32^(1/4)=2^(5/4), 분모 (√4)^(1/4)=2^(1/4), 몫2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log 2=a, \log 3=b$일 때, $\log_{6}50$을 $a, b$에 대한 식으로 나타내면? (3.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{a-b}{a+b}$
② $\frac{2-a}{a+b}$
③ $\frac{2-a}{a-b}$
④ $\frac{1-a}{a-b}$
⑤ $\frac{1-a}{a+b}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 밑 변환 공식 및 상용로그 성질 활용
> 이유: $\log_6 50 = \frac{\log 50}{\log 6}$으로 변환 가능함
> 근거: $\log 50 = 2 - \log 2 = 2-a$이고 $\log 6 = a+b$임
> 결론적으로 $\frac{2-a}{a+b}$

- **독립 판정·핵심 연결/검산:** log50=2−log2=2−a, log6=a+b라 주어진 식 (2−a)/(a+b).
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음을 만족시키는 $\theta$와 같은 사분면에 속하는 각은? (3.3점)<br>$\sin \theta \cos \theta > 0, \sin \theta \tan \theta < 0$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $-\frac{9}{5}\pi$
② $-\frac{1}{4}\pi$
③ $\frac{2}{3}\pi$
④ $\frac{4}{3}\pi$
⑤ $\frac{7}{4}\pi$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 삼각함수 부호를 통한 사분면 판정
> 이유: $\sin \theta \cos \theta > 0$는 제1, 3사분면을 의미함
> 근거: $\sin \theta \tan \theta = \frac{\sin^2 \theta}{\cos \theta} < 0$에서 $\cos \theta < 0$이므로 제3사분면임
> 결론적으로 제3사분면 각인 $\frac{4}{3}\pi$가 정답임

- **독립 판정·핵심 연결/검산:** sinθ cosθ>0는 1·3사분면, sinθ tanθ<0는 cosθ<0, 교집합 3사분면, 4π/3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\log_{3}(x-1)$의 점근선과 함수 $y=2^{-x}+t$의 그래프가 만나는 점이 $x$축 위에 있을 때, 상수 $t$의 값은? (4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1
② $\frac{1}{2}$
③ $-\frac{1}{2}$
④ -1
⑤ -2
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 점근선 방정식 산출 및 교점 좌표 대입
> 이유: $\log_3(x-1)$의 점근선은 진수가 0인 $x=1$임
> 근거: $x$축 위에서의 교점은 $(1, 0)$이므로 이를 $y=2^{-x}+t$에 대입함
> 정리하면 $0 = \frac{1}{2} + t$에서 $t = -\frac{1}{2}$

- **독립 판정·핵심 연결/검산:** 로그 점근선 x=1의 x축 교점 (1,0)에 2^-1+t=0 대입, t=−1/2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q7-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$4^{\frac{1}{a}}=25^{\frac{1}{b}}=k$이고 $a+b=\frac{1}{3}$일 때, $\log k$의 값은? (4.1점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 3
② 4
③ 5
④ 6
⑤ 7
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 밑이 동일한 지수식으로 변형 및 조건 대입
> 이유: $k^a = 4, k^b = 25$에서 $k^{a+b} = 100$이 성립함
> 근거: $k^{\frac{1}{3}} = 10^2$이므로 $k = 10^6$임
> 결론적으로 $\log 10^6 = 6$

- **독립 판정·핵심 연결/검산:** k^(a+b)=4·25=100, a+b=1/3이므로 k=10⁶, log k=6.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — UPGRADE

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $y=\log_{3}x$ 의 그래프를 평행이동 또는 대칭이동하여 겹쳐지지 않는 것은? (4.1점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $y=3^{2x}-1$
② $y=(\frac{1}{3})^{x-1}$
③ $y=\log_{3}9x$
④ $y=\log_{\frac{1}{3}}x$
⑤ $y=\log_{3}(x+1)$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 로그함수와 지수함수의 평행이동 및 대칭이동 조건 분석
> 이유: $y=\log_{3}x$와 포개어지려면 밑이 $3$ 또는 $\frac{1}{3}$이어야 하며, 지수함수 형태일 경우 역함수 관계를 통해 밑이 $3$ 또는 $\frac{1}{3}$인 형태여야 함
> 근거: ① $y=3^{2x}-1 = 9^{x}-1$은 밑이 $9$이므로 평행이동이나 대칭이동으로 밑이 $3$인 로그함수와 겹칠 수 없음
> 결론적으로 ①이 겹쳐지지 않음

- **독립 판정·핵심 연결/검산:** ②는 y=3^-x의 우이동, ③ log₃9x는 수직 위이동, ④ x축 대칭, ⑤ 좌이동; ① 9^x−1만 별도 축척이 필요함을 보강.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q9-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q09 학생용 개선 해설 (전체안)

1. 원래 그래프 $y=\log_3 x$를 직선 $y=x$에 대칭이동하면 $y=3^x$이다. 이것을 $y$축에 대칭이동하고 오른쪽으로 1만큼 옮기면 ② $y=(1/3)^{x-1}$가 된다.
2. ③ $y=\log_3(9x)=\log_3 x+2$는 위로 2만큼 평행이동한 그래프다. ④ $y=\log_{1/3}x=-\log_3 x$는 $x$축 대칭, ⑤ $y=\log_3(x+1)$는 왼쪽으로 1만큼 평행이동한 그래프다.
3. ① $y=3^{2x}-1=9^x-1$은 $x$방향을 **절반으로 축소**해야 생긴다. 이는 평행이동·대칭이동만으로는 불가능하다. 실제로 수평점근선 $y=-1$로부터의 높이는 $x$가 1 증가할 때 9배가 되지만, $3^{\pm x+c}-1$형태의 모든 평행·축대칭 그래프에서는 그 비가 3 또는 $1/3$이다.
4. 따라서 겹쳐지지 않는 그래프는 $\boxed{①}$.

검산: ②~⑤는 각각 구체적인 대칭·평행이동을 제시했고 ①에서만 확대·축소가 필수임을 구별했다.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
모든 실수 $x$ 에 대하여 $\log_{a}(x^{2}+ax+2a)$ 의 값이 존재하도록 하는 모든 정수 $a$ 의 개수는? (4.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 4개
② 5개
③ 6개
④ 7개
⑤ 8개
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 로그의 밑과 진수 조건 수립 및 절대부등식 판정
> 이유: 밑 조건 $a>0, a
> eq 1$과 진수 조건 $x^{2}+ax+2a>0$이 모든 실수 $x$에 대해 성립해야 함
> 근거: 이차부등식이 항상 성립하려면 판별식 $D = a^{2}-8a < 0$이어야 하므로 $0 < a < 8$임

- **독립 판정·핵심 연결/검산:** 밑 정수 a≥2, 진수 이차식 판별식 a(a−8)<0으로 a=2..7 총6개.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — HOLD

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 수 중 가장 큰 수를 $A$, 가장 작은 수를 $B$ 라고 할 때, $\log_{2}\frac{A}{B}$ 의 값으로 옳은 것은? (4.2점)<br>$\frac{1}{\sqrt[3]{8}}$, $\frac{1}{\sqrt[4]{16}}$, $0.125^{\frac{2}{3}}$, $(\frac{1}{32})^{0.3}$, $\sqrt[5]{0.5^{4}}$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{2}{3}$
② $\frac{3}{4}$
③ $\frac{5}{6}$
④ $\frac{4}{3}$
⑤ $\frac{3}{2}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 거듭제곱의 밑을 통일하여 지수 크기 비교
> 이유: 각 수를 밑 $2$인 지수 형태로 변환하면 $2^{-\frac{2}{3}}, 2^{-1}, 2^{-2}, 2^{-1.5}, 2^{-0.8}$임
> 근거: 지수를 비교하면 $-\frac{2}{3}$가 가장 크고 $-2$가 가장 작으므로 $A=2^{-\frac{2}{3}}, B=2^{-2}$임
> 결론적으로 $\log_{2}\frac{2^{-\frac{2}{3}}}{2^{-2}} = -\frac{2}{3} - (-2) = \frac{4}{3}$임

- **독립 판정·핵심 연결/검산:** 첫 수 1/∛8=2^-1인데 원문 풀이가 2^-2/3으로 잘못 변경. 실제 다섯 수는 2^-1,2^-1,2^-2,2^-3/2,2^-4/5이고 로그비는 6/5; 다섯 보기에 없어 보류.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **HOLD 사유 및 후속 조치:** 원문 오류 확인, 정답키 승인 전 변경 금지.

#### Q11 보류 증거

**원문 정답·선지 불일치로 보류.** 원문 해설에서 $1/\sqrt[3]{8}=2^{-2/3}$이라 쓴 부분은 틀렸다. 실제로 $\sqrt[3]{8}=2$이므로 $1/\sqrt[3]{8}=2^{-1}$이다. 다섯 수는 순서대로
$$
2^{-1},\quad 2^{-1},\quad(2^{-3})^{2/3}=2^{-2},\quad(2^{-5})^{0.3}=2^{-3/2},\quad(2^{-1})^{4/5}=2^{-4/5}.
$$
따라서 가장 큰 수는 $A=2^{-4/5}$, 가장 작은 수는 $B=2^{-2}$이며
$$
\log_2\frac AB=-\frac45+2=\boxed{\frac65}.
$$
그러나 원본 다섯 선택지는 $2/3,3/4,5/6,4/3,3/2$로 **$6/5$가 없다.** 기존 표시 답 ④ ($4/3$)은 성립하지 않는다. 원문 수치/선지/정답키 중 어느 것을 고칠지 권한 있는 원본 대조와 정정 승인이 필요하다. 이 작업에서 원본 JS·보기·키를 임의 변경하거나 선택하지 않는다.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
둘레의 길이가 16인 부채꼴 중에서 그 넓이가 최대인 부채꼴의 반지름의 길이는? (4.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 4
② 5
③ 6
④ 7
⑤ 8
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 부채꼴의 둘레 조건을 이용한 넓이 함수 최대값 탐색
> 이유: $2r+l=16 \implies l=16-2r$이고, 넓이 $S = \frac{1}{2}rl = \frac{1}{2}r(16-2r) = 8r-r^{2}$임
> 근거: 이차함수 $S = -(r-4)^{2}+16$은 $r=4$일 때 최대값을 가짐
> 결론적으로 반지름의 길이는 4임

- **독립 판정·핵심 연결/검산:** 부채꼴 둘레 2r+l=16에서 넓이 −(r−4)²+16, r4.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q12-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — UPGRADE

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 두 양수 $a, b$에 대하여 두 함수 $y=\log_a x$와 $y=\log_b x$의 그래프가 다음 그림과 같을 때, 함수 $y=\left(\dfrac{a}{b}\right)^x-b^a$의 그래프의 개형으로 가장 알맞은 것은? (4.2점)<br><img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4.svg" alt="점 (1, 0)에서 만나는 두 감소 로그함수. x가 1보다 큰 쪽에서 밑이 a인 곡선이 밑이 b인 곡선보다 위에 있다." style="width:285px;max-width:100%;height:auto;">
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① <img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-1.svg" alt="증가하고 y축을 원점 위에서 지나는 그래프" style="width:130px;max-width:100%;height:auto;">
② <img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-2.svg" alt="증가하고 y축을 원점 아래에서 지나는 그래프" style="width:130px;max-width:100%;height:auto;">
③ <img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-3.svg" alt="감소하고 원점을 지나는 그래프" style="width:130px;max-width:100%;height:auto;">
④ <img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-4.svg" alt="감소하고 y축을 원점 아래에서 지나는 그래프" style="width:130px;max-width:100%;height:auto;">
⑤ <img src="assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-5.svg" alt="감소하고 y축을 원점 위에서 지나는 그래프" style="width:130px;max-width:100%;height:auto;">
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 두 로그함수의 그래프가 모두 감소하므로 $0<a<1$, $0<b<1$이다. $x>1$에서 $\log_a x>\log_b x$이므로 $\dfrac{1}{\ln a}>\dfrac{1}{\ln b}$이다. $\ln a$와 $\ln b$가 모두 음수이므로 $\ln a<\ln b$, 즉 $a<b$이다.
> 따라서 $0<\dfrac ab<1$이므로 $y=\left(\dfrac ab\right)^x-b^a$의 그래프는 감소한다. 또 $0<b^a<1$이므로 $y$절편은 $1-b^a>0$이고, 수평점근선은 $y=-b^a<0$이다.
> 원점 위에서 $y$축을 지나며 $x$가 커질수록 $x$축 아래의 수평점근선에 가까워지는 그래프는 ⑤이다.

- **독립 판정·핵심 연결/검산:** 실물 그림은 감소 로그 두 곡선과 ⑤ 감소 지수 선택지를 확인; 0<a<b<1을 교육과정의 로그 단조성만으로 설명하고 ln 사용을 제거할 필요.
- 문제 그림: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4.svg`, `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-1.svg`, `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-2.svg`, `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-3.svg`, `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-4.svg`, `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-quality-v4-choice-5.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q13-restored-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q13 학생용 개선 해설 (전체안)

1. 그림에서 $y=\log_a x$, $y=\log_b x$가 모두 감소하므로 밑은 $0<a<1$, $0<b<1$이다.
2. 그림의 $x>1$인 부분에서 $\log_a x>\log_b x$이다. $x=1/b>1$을 대입하면 $\log_b(1/b)=-1$이므로 $\log_a(1/b)>-1$이다. 한편 $\log_a(1/a)=-1$이고 $\log_a x$는 감소하므로 $1/b<1/a$, 즉 $a<b$이다. 따라서 $0<a/b<1$이다. (자연로그나 미분을 쓰지 않는다.)
3. 이제 $y=(a/b)^x-b^a$를 살핀다. 밑 $a/b$가 0과 1 사이이므로 그래프는 오른쪽으로 갈수록 **감소**한다.
4. $x=0$일 때 $y=1-b^a$이며 $0<b<1$, $a>0$이므로 $0<b^a<1$. 따라서 $y$절편은 **양수**이다. $x\to+\infty$에서 $(a/b)^x$는 0에 가까워지므로 수평점근선은 $y=-b^a<0$이다.
5. 감소함수·양의 $y$절편·음의 수평점근선을 모두 나타낸 그림은 $\boxed{⑤}$이다.

검산: 원본 문제와 보기 ①~⑤의 실물 SVG를 대조하였고, ⑤에 위 세 특징이 동시에 나타난다.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
층간소음은 소리의 세기에 따른 소리의 크기로 측정할 수 있다. 소리의 세기가 $I$ W/m$^2$일 때, 소리의 크기 $D$ dB는 $D = 10 \log \frac{I}{10^{-12}}$라고 한다. 스피커 음악 소리의 크기는 85dB이고 망치질 소리의 크기는 60dB일 때, 스피커 음악의 소리의 세기는 망치질 소리의 세기의 몇 배인가? (4.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\sqrt{10}$
② 10
③ $10\sqrt{10}$
④ 100
⑤ $100\sqrt{10}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 로그 방정식의 차를 이용한 세기 비율 계산
> 이유: $85 = 10 \log \frac{I_{1}}{10^{-12}}, 60 = 10 \log \frac{I_{2}}{10^{-12}}$이므로 두 식을 빼면 $25 = 10 \log \frac{I_{1}}{I_{2}}$임
> 근거: $\log \frac{I_{1}}{I_{2}} = 2.5 \implies \frac{I_{1}}{I_{2}} = 10^{2.5} = 10^{2}\cdot 10^{0.5} = 100\sqrt{10}$임
> 결론적으로 스피커 음악 세기는 망치질 세기의 $100\sqrt{10}$배임

- **독립 판정·핵심 연결/검산:** 85−60=25 dB라 log(I₁/I₂)=2.5, I₁/I₂=100√10.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$a>2$ 인 상수 $a$ 에 대하여 두 수 $\log_{2}a, \log_{a}8$ 이 $x$ 에 대한 이차방정식 $x^2-4x+k=0$ 의 두 실근일 때, $a+k$ 의 값은? (4.4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 11
② 12
③ 13
④ 14
⑤ 15
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 근과 계수의 관계 및 밑 변환 공식을 이용한 미지수 결정
> 이유: 두 근의 합 $\log_{2}a + \log_{a}8 = \log_{2}a + \frac{3}{\log_{2}a} = 4$임
> 근거: $\log_{2}a = t$라 하면 $t^{2}-4t+3=0$에서 $t=1, 3$인데 $a>2$이므로 $t=3$임
> 정리하면 $a=2^{3}=8$이고, 두 근의 곱 $k = \log_{2}a \times \frac{3}{\log_{2}a} = 3$이므로 $a+k=11$임

- **독립 판정·핵심 연결/검산:** t=log₂a>1에서 t+3/t=4→(t−1)(t−3)=0; t3,a8,k3, 합11.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\theta$ 가 제1사분면의 각이고 $\sin\theta - \cos\theta = \frac{\sqrt{3}}{3}$ 일 때, $\tan\theta + \frac{1}{\tan\theta}$ 의 값은? (4.4점)
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

> <b>[논리 분석]</b> 삼각함수의 합/차와 탄젠트 역수의 관계 활용
> 이유: $\tan\theta + \frac{1}{\tan\theta} = \frac{\sin\theta}{\cos\theta} + \frac{\cos\theta}{\sin\theta} = \frac{\sin^{2}\theta+\cos^{2}\theta}{\sin\theta\cos\theta} = \frac{1}{\sin\theta\cos\theta}$임
> 근거: 주어진 식을 제곱하면 $1-2\sin\theta\cos\theta = \frac{3}{9} = \frac{1}{3} \implies \sin\theta\cos\theta = \frac{1}{3}$임
> 결론적으로 구하는 값은 $\frac{1}{\frac{1}{3}} = 3$임

- **독립 판정·핵심 연결/검산:** (sin−cos)²=1/3→sinθcosθ=1/3, tanθ+1/tanθ=3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
자연수 $n(n \ge 2)$ 에 대하여 $n^2-3n$의 $n$제곱근 중 실수인 것의 개수를 $f(n)$이라 하자. $f(2)+f(3)+f(4)+f(5)+f(6)$의 값은? (4.5점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2
② 3
③ 4
④ 5
⑤ 6
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 실수인 거듭제곱근의 개수 판정
> 이유: $n$이 짝수일 때 $a>0$이면 2개, $a=0$이면 1개, $a<0$이면 0개임. $n$이 홀수일 때 $a$의 부호와 상관없이 항상 1개임
> 근거: $f(2)$는 $(-2)$의 2제곱근(0개), $f(3)$은 $0$의 3제곱근(1개), $f(4)$는 $4$의 4제곱근(2개), $f(5)$는 $10$의 5제곱근(1개), $f(6)$은 $18$의 6제곱근(2개)임
> 결론적으로 $0+1+2+1+2 = 6$

- **독립 판정·핵심 연결/검산:** n=2..6에서 거듭제곱근 개수 0,1,2,1,2를 별도로 세면 합6.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = t \cdot 2^x$ ($0 < t < 1$)의 그래프가 두 함수 $y = 2^{-x}$, $y = -2^x + 4$의 그래프와 만나는 점을 각각 P, Q라 하자.\n점 P와 점 Q의 $x$좌표의 비가 $1:2$일 때, $t$의 값은? (4.6점)\n<img src="assets/images/25_제일고_1학기_중간_고2_대수/q18-problem-engine-v3.svg" alt="세 지수함수와 교점 P, Q가 표시된 그래프" style="width:355px;max-width:100%;height:auto;">
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① ① $\frac{1}{9}$
② ② $\frac{1}{5}$
③ ③ $\frac{1}{4}$
④ ④ $\frac{1}{3}$
⑤ ⑤ $\frac{1}{2}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 세 지수함수의 교점 $P$와 $Q$의 $x$좌표 비율을 이용하여 연립방정식을 세우고 미지수 $t$를 구한다.
> 1. 좌표 설정: 점 $P$의 $x$좌표를 $k$ ($k>0$)라 하면, 점 $Q$의 $x$좌표는 $2k$이다.
> 2. 함숫값 관계식
> 점 $P$: $y=t \cdot 2^x$와 $y=2^{-x}$의 교점이므로 $t \cdot 2^k = 2^{-k}$ 이다. 이를 정리하면 $t = 2^{-2k} = \frac{1}{2^{2k}}$ 이다.

- **독립 판정·핵심 연결/검산:** 실물 q18 SVG의 P,Q x좌표가 양수이고 1:2; t2^u=2^-u 및 t2^(2u)=4−2^(2u)로 t1/3.
- 문제 그림: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-problem-engine-v3.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q18-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
이차함수 $y = f(x)$의 그래프가 다음 그림과 같이 세 점 $(2, 0)$, $(4, 0)$, $(0, 8)$을 지난다. 부등식 $\log_2 f(x) \le 3$을 만족시키는 정수 $x$의 개수는? (4.6점)\n<svg width="200" height="180" viewBox="0 0 200 180" xmlns="http://www.w3.org/2000/svg">\n  <line x1="20" y1="130" x2="180" y2="130" stroke="black" stroke-width="1" marker-end="url(#arrow)"/>\n  <line x1="50" y1="160" x2="50" y2="20" stroke="black" stroke-width="1" marker-end="url(#arrow)"/>\n  <path d="M 40.0,17.5 L 42.73,26.88 L 45.47,35.9 L 48.2,44.53 L 50.94,52.79 L 53.67,60.68 L 56.41,68.2 L 59.14,75.34 L 61.88,82.11 L 64.61,88.5 L 67.35,94.52 L 70.08,100.16 L 72.82,105.43 L 75.55,110.33 L 78.29,114.86 L 81.02,119.0 L 83.76,122.78 L 86.49,126.18 L 89.22,129.21 L 91.96,131.86 L 94.69,134.14 L 97.43,136.05 L 100.16,137.58 L 102.9,138.74 L 105.63,139.52 L 108.37,139.93 L 111.1,139.97 L 113.84,139.63 L 116.57,138.92 L 119.31,137.83 L 122.04,136.38 L 124.78,134.54 L 127.51,132.33 L 130.24,129.75 L 132.98,126.8 L 135.71,123.47 L 138.45,119.77 L 141.18,115.69 L 143.92,111.24 L 146.65,106.41 L 149.39,101.22 L 152.12,95.64 L 154.86,89.7 L 157.59,83.38 L 160.33,76.68 L 163.06,69.61 L 165.8,62.17 L 168.53,54.35 L 171.27,46.16 L 174.0,37.6" fill="none" stroke="black" stroke-width="1.5"/>\n  <text x="40" y="55" font-size="12px">8</text>\n  <text x="85" y="145" font-size="12px">2</text>\n  <text x="125" y="145" font-size="12px">4</text>\n  <text x="35" y="145" font-size="12px">O</text>\n  <text x="175" y="145" font-size="12px">x</text>\n  <text x="55" y="25" font-size="12px">y</text>\n  <text x="145" y="45" font-size="12px">y=f(x)</text>\n  <defs>\n    <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">\n      <path d="M0,0 L0,6 L6,3 z" fill="black"/>\n    </marker>\n  </defs>\n</svg>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① ① 3
② ② 4
③ ③ 5
④ ④ 6
⑤ ⑤ 7
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 그래프의 정보를 통해 이차함수의 식을 구하고, 로그의 진수 조건과 부등식의 성질을 연립하여 해를 구한다.
> 1. 이차함수의 식 구하기: $x$절편이 $2$와 $4$이므로 $f(x) = a(x-2)(x-4)$라 할 수 있다. 점 $(0, 8)$을 지나므로 $f(0) = a(-2)(-4) = 8a = 8 \implies a = 1$. 따라서 $f(x) = (x-2)(x-4) = x^2-6x+8$이다.
> 2. 로그의 진수 조건: 로그의 진수는 양수여야 하므로 $f(x) > 0 \implies (x-2)(x-4) > 0$. 따라서 $x < 2$ 또는 $x > 4$이다.
> 3. 로그부등식 풀이: $\log_2 f(x) \le 3 \implies f(x) \le 2^3 = 8$이다. $x^2-6x+8 \le 8 \implies x^2-6x \le 0 \implies x(x-6) \le 0$. 따라서 $0 \le x \le 6$이다.

- **독립 판정·핵심 연결/검산:** 이차식 f=(x−2)(x−4)이고 0<f(x)≤8을 풀면 정수 0,1,5,6 네 개.
- 문제 그림: 원문 inline SVG 실물 렌더·판독 완료
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q19-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — UPGRADE

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=2^{x-3}+1$의 그래프 위의 두 점 $A, B$와 함수 $y=-\frac{8}{2^x}+1$의 그래프 위의 두 점 $C, D$가 다음 조건을 만족시킨다.<br>(가) 사각형 $ABCD$는 평행사변형이다.<br>(나) 삼각형 $ABD$의 무게중심의 $x$좌표는 $\frac{11}{3}$이고, 삼각형 $ABC$의 무게중심의 $x$좌표는 $\frac{8}{3}$이다.<br>사각형 $ABCD$의 넓이로 옳은 것은? (단, 선분 $AC$는 평행사변형 $ABCD$의 대각선이다.) (5점)<br>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 4
② 6
③ 8
④ 10
⑤ 12
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 무게중심 좌표와 평행사변형의 평행이동 성질 활용
> 이유: $x_A+x_B+x_D=11, x_A+x_B+x_C=8$에서 $x_D-x_C=3$임. 평행사변형 조건에서 $x_B-x_A=x_C-x_D=-3$임
> 근거: $x_B=x_A-3, x_D=x_C+3$ 대입 및 $y$좌표 차이 동일성$(y_A-y_B = y_D-y_C)$ 이용 시 $x_A=5, x_C=1$ 도출
> 결론적으로 $A(5,5), B(2,1.5), C(1,-3), D(4,0.5)$ 좌표 확정 후 넓이 계산 시 10

- **독립 판정·핵심 연결/검산:** 두 무게중심의 x좌표 차에서 D_x−C_x=3, 평행사변형에서 B_x−A_x=−3; 기존 풀이의 좌표 결정 중간식 부족을 보완.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_제일고_1학기_중간_고2_대수/q20-solution-v2.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **UPGRADE 사유:** 수치는 유지하되 위에 적힌 논증 생략·설명 오류 또는 교육과정 밖 풀이를 학생용 풀이에서 교체한다.

#### Q20 학생용 개선 해설 (전체안)

1. 두 무게중심의 $x$좌표에서
$$
x_A+x_B+x_D=11,\qquad x_A+x_B+x_C=8
$$
이므로 $x_D-x_C=3$이다.
2. 평행사변형의 마주 보는 변 $AB$, $DC$는 평행하고 길이가 같다. 따라서 $x_B-x_A=x_C-x_D=-3$이고, $x_B=x_A-3$, $x_D=x_C+3$이다. 첫째 식과 둘째 식에 대입하면 $2x_A+x_C=11$이다.
3. $A,B$는 $y=2^{x-3}+1$, $C,D$는 $y=1-8/2^x$ 위에 있다. 평행사변형이므로 $y_A-y_B=y_D-y_C$. 이를 함수식에 대입하면
$$
2^{x_A-3}-2^{x_A-6}
=\left(1-\frac8{2^{x_C+3}}\right)-\left(1-\frac8{2^{x_C}}\right),
$$
$$
7\cdot2^{x_A-6}=7\cdot2^{-x_C}
\quad\Rightarrow\quad x_A+x_C=6.
$$
4. $2x_A+x_C=11$과 $x_A+x_C=6$을 연립하면 $x_A=5,x_C=1$; 따라서 $x_B=2,x_D=4$다. 각 함수에 대입하여
$$
A(5,5),\ B(2,\tfrac32),\ C(1,-3),\ D(4,\tfrac12)
$$
를 얻는다.
5. 밑변 $AB$의 길이는 $\sqrt{(5-2)^2+(5-\frac32)^2}=\frac{\sqrt{85}}2$이다. 직선 $AB$의 방정식은 $7x-6y-5=0$, 점 $D(4,\frac12)$에서 이 직선까지의 수선거리는
$$
\frac{|7\cdot4-6\cdot\frac12-5|}{\sqrt{7^2+(-6)^2}}
=\frac{20}{\sqrt{85}}.
$$
따라서 평행사변형의 넓이는 $\frac{\sqrt{85}}2\cdot\frac{20}{\sqrt{85}}=\boxed{10}$ (④).

검산: $AB$의 좌표 차 $(-3,-\frac72)$와 $DC$의 좌표 차 $(-3,-\frac72)$가 같고, $AD$와 $BC$의 차도 $(-1,-\frac92)$로 같다.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 1]<br>$a^2+a^{-2}$의 값을 구하시오.(6점, 부분점수 있음)<br>(※ 1보다 큰 양수 $a$에 대하여 $a^{\frac{1}{2}}+a^{-\frac{1}{2}}=\sqrt{7}$ 일 때, 다음 물음에 답하시오.)
```

- 원본 `answer`: `23`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 지수식의 제곱 변형
> 이유: $(a^{\frac{1}{2}}+a^{-\frac{1}{2}})^2 = a+a^{-1}+2=7$이므로 $a+a^{-1}=5$임
> 근거: $a^2+a^{-2} = (a+a^{-1})^2-2 = 25-2=23$임

- **독립 판정·핵심 연결/검산:** u=a^1/2+a^-1/2=√7이므로 a+a^-1=5; 제곱 빼기2로 a²+a^-2=23.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 2]<br>$a-a^{-1}$의 값을 구하시오.(4점, 부분점수 있음)<br>(※ 1보다 큰 양수 $a$에 대하여 $a^{\frac{1}{2}}+a^{-\frac{1}{2}}=\sqrt{7}$ 일 때, 다음 물음에 답하시오.)
```

- 원본 `answer`: `$\sqrt{21}$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 곱셈 공식의 변형 및 부호 판단
> 이유: $(a-a^{-1})^2 = (a+a^{-1})^2-4 = 21$임
> 근거: $a>1$이므로 $a-a^{-1}>0$임. 따라서 $\sqrt{21}$임

- **독립 판정·핵심 연결/검산:** a>1로 a−a^-1 양수, 제곱=(a+a^-1)²−4=21, √21.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 3]<br>함수 $y=\log_{2}(x-1)$의 역함수를 $f(x)$라 할 때,<br>방정식 $f(2x)+f(x+2)-47=0$의 실수해를 $\alpha$라 하자.<br>$f(\alpha)$의 값을 구하고 그 과정을 서술하시오. (5점, 부분점수 있음)
```

- 원본 `answer`: `6`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 역함수 산출 및 지수방정식 치환 풀이
> 이유: $f(x)=2^x+1$임. 방정식은 $(2^{2x}+1)+(2^{x+2}+1)-47=0$임
> 근거: $2^{2x}+4 \cdot 2^x-45=0 \implies (2^x+9)(2^x-5)=0$에서 $2^x=5$임
> 결론적으로 $f(\alpha)=2^\alpha+1=6$

- **독립 판정·핵심 연결/검산:** 역함수 f(x)=2^x+1, t=2^x>0에서 t²+4t−45=0→t5, f(α)=6.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `31b7ffc6f35600dee0a58a71beadfcce06599a92`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
[서술형 4]<br>$x$에 대한 이차방정식<br>$(\log a+2)x^2-2(\log a)x+1=0$이 실근을 갖도록 하는 실수 $a$의<br>값의 범위를 구하고 그 과정을 서술하시오. (5점, 부분점수 있음)
```

- 원본 `answer`: `$0 < a \le \frac{1}{10}$ (단, $a \neq \frac{1}{100}$) 또는 $a \ge 100$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> <b>[논리 분석]</b> 이차방정식 조건 및 판별식 범위 산출
> 이유: 이차방정식 조건 $\log a 
> eq -2 \implies a 
> eq \frac{1}{100}$. 판별식 $\frac{D}{4} = (\log a)^2-(\log a+2) \ge 0$

- **독립 판정·핵심 연결/검산:** t=log a의 계수 t+2≠0, 판별식 (t−2)(t+1)≥0을 함께 적용: 0<a≤1/10 단 a≠1/100 또는 a≥100.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 완료 판정·다음 작업

- 분모 24문항 모두 읽음. 판정 합 `20+3+1+0=24`.
- 학생용 개선 `3`건의 완성안 작성; HOLD `1`건은 원문/정답 승인 대기.
- 원본 자료·그림 원복/변경 `NONE`; `main` 수정 `NONE`; Golden/Negative/학생 렌더/출고 `NOT_RUN`.
- 다음 시험지는 동일 queue의 아직 미완료된 1학기 중간 2025년 대수 기출을 파일명 정렬 순서로 선택.
