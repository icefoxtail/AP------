# 2024 24_매산여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_매산여고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_매산여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 23 · UPGRADE 1 · HOLD 0 · UNREAD 0
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


검토 방식: 원본 `content`, `choices`, `answer`, `solution` 전 문항을 직접 읽고 정답·로그/지수 조건·구간 끝점·부호·그래프를 대조했다. 문항별로 원문 문제·선택지·정답·기존 해설 핵심 발췌와 **독립 판정의 구체적 수치**를 기록한다. UPGRADE는 학생용 전체 새 풀이를 제공한다. HOLD는 자료가 불충분하거나 원문에 수학적 불일치가 있는 상태로 정답을 임의 수정하지 않는다. 원본 시험의 신뢰성 복구는 별도 승인·원본 대조 후 수행한다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지·보조 해설 그림 검증

- `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q06.png` — Git blob `42aca5e3f1d66bc472ef0bdf01ff1232544ed1cd`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `solutionImage` 보조 해설 자산: 15개 GitHub 취득·Git blob 존재 검증. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q04 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q4-solution-v2.svg` — `ea7732ef0e5d31d9687874db9500f77d06ec957f`
  - Q05 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q5-solution-v2.svg` — `adb3c6177d47613d25de6d8b54b01d3464b3c4e9`
  - Q06 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q6-solution-v2.svg` — `fc185e5dae0e917f703d496b51665727bf9d1f7d`
  - Q08 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q8-solution.svg` — `090721c4c4532b55820d0db0d7ab1ac86e5fec1b`
  - Q09 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q9-solution-v2.svg` — `7dc21da7755bae8db11f6602c29728e854297302`
  - Q12 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q12-solution.svg` — `b8f1df1cb065d85068b9f4d0e2391a0aba408201`
  - Q14 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q14-solution-v2.svg` — `dd36177b8c0a3b90c569cfaa4c83d6a017f498f9`
  - Q15 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q15-solution.svg` — `fe086869c1c94f42498df568c30884d46f75beb6`
  - Q16 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q16-solution-v2.svg` — `cf6eb9e7d3b12407c0d22ff592b01d797c74c89e`
  - Q18 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q18-solution-v2.svg` — `ec71bd04100b1a9d21f9c8375a8dd84fecb3b102`
  - Q19 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q19-solution-v2.svg` — `4aec587c2cdaedd0a0652ea2d88fae4768fcfff6`
  - Q20 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q20-solution.svg` — `7efbab5c5491b1c11d322e5b526b083268d06efc`
  - Q21 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q21-solution-v2.svg` — `aa78d6473fccffc841e83001b27558ccf8ed8c8a`
  - Q22 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q22-solution.svg` — `a4a8103735f2a72211d6a5763a7abab7f897f5d8`
  - Q24 `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q24-solution-v2.svg` — `87477a9a873a960d0b65ed177a929f5aed3a7e78`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `qid_v1_b11a9f6c398580fa1d1aa22e6f29f05c42b35bda9a7e81ff59e6aeb1a78f238a`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$a = \sqrt[4]{2},\ b^3 = \sqrt{3}$일 때, $(ab)^{12}$의 값을 구하면? (단, $b$는 실수이다.) [3.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$12$
$54$
$72$
$108$
$216$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$a=2^{1/4}$이므로 $a^{12}=2^3=8$이다. 또 $b^3=\sqrt3=3^{1/2}$이므로 $b=3^{1/6}$이고 $b^{12}=3^2=9$이다.
따라서
$(ab)^{12}=a^{12}b^{12}=8\cdot9=72$이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \((ab)^{12}=72\)의 지수 법칙을 해당 식에 적용하면 72, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `qid_v1_8f838ff81d0016d03899baf1278762b4fc66c02f765a9007501451472c810c98`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_{(a-1)} (a^2-4a-12)$가 정의되기 위한 실수 $a$의 값의 범위를 구하면? [3.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$a < -2$
$-2 < a < 1$
$1 < a < 2$
$2 < a < 6$
$a > 6$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 밑은 양수이고 $1$이 아니어야 하며, 진수는 양수여야 한다.
밑 조건에서 $a-1>0$, $a-1\ne1$이므로 $a>1$, $a\ne2$이다.
진수 조건은
$a^2-4a-12=(a-6)(a+2)>0$
이므로 $a<-2$ 또는 $a>6$이다.
두 조건을 함께 만족하는 범위는 $a>6$이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 로그 밑·진수 정의역을 각각 교집합하면 \(a>6\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `qid_v1_f05a69b92f5d3f0a242958260d54373825eec7d9fc814806b6837c3b226e35ce`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 $x$에 대하여 $\frac{2^x - 2^{-x}}{2^x + 2^{-x}} = \frac{1}{2}$일 때, $4^x - 4^{-x}$의 값을 구하면? [3.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{3}$
$\frac{2}{3}$
$\frac{5}{3}$
$\frac{7}{3}$
$\frac{8}{3}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$t=2^x$라 놓으면 $t>0$이고 $2^{-x}=1/t$이다. 주어진 식에 대입하면
$\dfrac{t-1/t}{t+1/t}=\dfrac12$
이므로
$\dfrac{t^2-1}{t^2+1}=\dfrac12$이다.
양변을 정리하면 $2t^2-2=t^2+1$, 따라서 $t^2=3$이다.
$4^x=t^2=3$, $4^{-x}=1/3$이므로
$4^x-4^{-x}=3-\dfrac13=\dfrac83$이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 로그 밑변환으로 정리하고 \(t^2=3\)을 이용하면 \(8/3\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `qid_v1_fa6f0b21758b235e8152307f1a14de7417522ccbb7f1c05516491b0434853a12`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $y=\log_{\frac{1}{3}} (x+2)+3$에 대한 설명으로 옳은 것을 고르면? [3.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
정의역은 $\{x \mid x < -2\}$이다.
치역은 $\{y \mid y > 0\}$이다.
그래프의 점근선은 직선 $x=-2$이다.
그래프는 점 $(-2, 3)$을 지난다.
$x$의 값이 증가하면 $y$의 값도 증가한다.
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
밑이 $0<\dfrac13<1$이므로 로그함수는 감소한다. 진수 조건 $x+2>0$에서 정의역은 $x>-2$이고, 치역은 모든 실수이다.
로그함수의 그래프는 진수가 $0$에 가까워질 때 $x=-2$에 가까워지므로 점근선은 $x=-2$이다. 단, $x=-2$에서는 함수값이 정의되지 않아 그래프가 그 점을 지나지 않는다.
또 $x$가 증가하면 함수값은 감소한다. 따라서 옳은 설명은 점근선에 관한 ③이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 밑 \(1/3\)인 로그함수의 x축 방향 2칸 왼쪽·y축 방향 3칸 위 이동에서 점근선 \(x=-2\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `qid_v1_49e0790a17d27a25a8d9e4c1a77e2d538cc420ab82fc9af92d5475f34b4dd3d5`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = \left(\frac{1}{5}\right)^{x-1} + k$의 그래프가 제 $3$사분면을 지나지 않도록 하는 상수 $k$의 최솟값을 구하면? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-10$
$-5$
$0$
$5$
$10$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$x<0$이면 $1-x>1$이므로
$\left(\dfrac15\right)^{x-1}=5^{1-x}>5$이다.
그래프가 제3사분면을 지나지 않으려면 $x<0$일 때 $y\ge0$이어야 한다. 위의 부등식으로부터 $y=5^{1-x}+k>5+k$이므로 $k\ge-5$이면 모든 $x<0$에서 $y>0$이다.
반대로 $k<-5$이면 $x$를 $0$보다 작은 값에 충분히 가깝게 할 때 $5^{1-x}+k<0$이므로 제3사분면의 점이 생긴다. 따라서 가능한 $k$의 최솟값은 $-5$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 이차식 그래프가 제3사분면으로 진입하지 않는 경계값 \(k=-5\)를 포함해 최솟값 −5, ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `qid_v1_914be8c19c2737c8e4bc106b0f22737c15078d7428ae90f8b4b214ccb6d2add6`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
이차함수 $y=f(x)$의 그래프와 일차함수 $y=g(x)$의 그래프가 다음 그림과 같을 때, 부등식 $\left(\frac{2}{3}\right)^{f(x)} > \left(\frac{2}{3}\right)^{g(x)}$를 만족시키는 모든 자연수 $x$의 값의 합을 구하면? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$6$
$7$
$8$
$9$
$12$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$0<\dfrac23<1$이므로 지수함수 $\left(\dfrac23\right)^u$는 감소한다. 따라서
$\left(\dfrac23\right)^{f(x)}>\left(\dfrac23\right)^{g(x)}$
은 $f(x)<g(x)$와 같다.
그림에서 두 그래프가 만나는 점 사이에서 포물선 $y=f(x)$가 직선 $y=g(x)$보다 아래에 있다. 왼쪽 교점의 $x$좌표는 $2$와 $3$ 사이이고, 오른쪽 교점은 $x=5$이다.
따라서 조건을 만족하는 자연수는 $x=3,4$이고, 그 합은 $3+4=7$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q06.png에서 포물선·직선이 x≈2.5와 x5에서 만나고, 사이에서 부등식 성립. 정수 3,4의 합 7, ②.
- 문제 그림: `archive/assets/images/24_매산여고_1학기_중간_고2_수학I/q06.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `qid_v1_e53be69f362105181926202e479c8a6ef63cf1f2017c4f13101057eb71909add`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.6점]

<보기>
ㄱ. $210^\circ = \frac{7}{6}\pi$
ㄴ. $-1110^\circ$는 제 $3$사분면 각이다.
ㄷ. $800^\circ$와 $-280^\circ$의 일반각은 같다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄴ
ㄱ, ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각 문장을 확인한다.
ㄱ. $210^\circ=210\cdot\dfrac{\pi}{180}=\dfrac76\pi$이므로 참이다.
ㄴ. $-1110^\circ+3\cdot360^\circ=-30^\circ$이며, 이는 제4사분면의 각이므로 거짓이다.
ㄷ. $800^\circ-(-280^\circ)=1080^\circ=3\cdot360^\circ$이므로 두 각의 동경은 같다. 참이다.
따라서 옳은 것은 ㄱ, ㄷ이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(210^\circ=7\pi/6\)은 참, \(-1110^\circ\equiv-30^\circ\)는 요구 사분면과 다름, \(800^\circ\equiv80^\circ\)로 ㄱ·ㄷ, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `qid_v1_aaec276af31f7c21c8bf50931fbcc71f44d3d12116b97f4472464d4b1856af98`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < 2\pi$일 때, 방정식 $\sin x - \sqrt{3}\cos x = 0$의 모든 근의 합을 구하면? [3.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{4}{3}\pi$
$\frac{5}{3}\pi$
$2\pi$
$\frac{7}{3}\pi$
$\frac{8}{3}\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin x-\sqrt3\cos x=0$에서 $\cos x=0$이면 식이 성립하지 않으므로 $\cos x\ne0$이다. 양변을 $\cos x$로 나누면
$\tan x=\sqrt3$이다.
$0\le x<2\pi$에서 이를 만족하는 각은 $x=\dfrac\pi3$, $x=\dfrac{4\pi}3$이다.
따라서 모든 근의 합은 $\dfrac\pi3+\dfrac{4\pi}3=\dfrac{5\pi}3$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(\tan x=\sqrt3\)의 두 근 \(\pi/3,4\pi/3\)의 합 \(5\pi/3\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `qid_v1_5819a4f65879e3fdb09b6f69b2be2484c5152e31f3e2eb5873616ee101f6e1c1`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < \pi$일 때, 부등식 $-\frac{1}{2} \le \cos x < \frac{\sqrt{2}}{2}$의 해를 구하면? [3.7점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{\pi}{6} \le x < \frac{\pi}{3}$
$\frac{\pi}{6} < x \le \frac{3}{4}\pi$
$\frac{\pi}{4} < x \le \frac{2}{3}\pi$
$\frac{\pi}{4} < x \le \frac{5}{6}\pi$
$\frac{\pi}{3} \le x < \frac{3}{4}\pi$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$0\le x<\pi$에서 $\cos x$는 감소한다.
$\cos x<\dfrac{\sqrt2}{2}$를 만족하려면 $x>\dfrac\pi4$이어야 한다.
$\cos x\ge-\dfrac12$를 만족하려면 $x\le\dfrac{2\pi}3$이어야 한다.
두 범위를 함께 만족하는 해는 $\dfrac\pi4<x\le\dfrac{2\pi}3$이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 코사인 부등식을 기준각·정의구간으로 제한하면 \(\pi/4<x\le2\pi/3\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — UPGRADE

- source ordinal/id: `10` / `10`; sourceIdentityKey: `qid_v1_bbf025f8f23424cf7525164df9370f35331b28541f43d3a4d92e6ad4ea0b1460`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x, y$가 양수이고, $a$가 $1$이 아닌 양수일 때, 다음 <보기>에서 옳은 것만을 있는 대로 모두 고른 것은? [3.8점]

<보기>
ㄱ. $\log_a x \log_a y = \log_a x + \log_a y$
ㄴ. $\frac{\log_a x}{\log_a y} = \log_y x$ (단, $y \ne 1$인 양수이다.)
ㄷ. $\log_a (x-y) = \log_a x - \log_a y$
ㄹ. $(\log_a x)^n = n\log_a x$ (단, $n$은 실수이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄴ
ㄱ, ㄴ
ㄱ, ㄹ
ㄷ, ㄹ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각 로그 성질을 확인한다.
ㄱ. 곱의 로그 법칙은 $\log_a(xy)=\log_a x+\log_a y$이다. 주어진 식처럼 두 로그값을 곱하는 것은 일반적으로 합과 같지 않으므로 거짓이다.
ㄴ. 밑의 변환을 쓰면 $\dfrac{\log_a x}{\log_a y}=\dfrac{\ln x}{\ln y}=\log_y x$이므로 참이다.
ㄷ. 로그의 차는 $\log_a(x/y)$에 해당하며 $\log_a(x-y)$와 같지 않으므로 거짓이다.
ㄹ. 거듭제곱 법칙은 $\log_a(x^n)=n\log_a x$이다. 주어진 좌변은 로그값 자체를 거듭제곱한 것이므로 거짓이다.
따라서 옳은 것은 ㄴ뿐이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 곱·몫·거듭제곱 로그 법칙과 밑변환을 비교하면 ㄴ만 참. 원문은 자연로그 ln을 사용하므로 학생용에는 동일한 밑 \(10\)으로 정리, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음

#### UPGRADE — 학생용 전면 개선 해설 초안

1. \(x>0\), \(y>0\), \(a>0\), \(a\ne1\)이라는 로그 정의 조건부터 확인한다. ㄴ에만 \(y\ne1\)을 추가해야 밑이 \(y\)인 로그가 정의된다.
2. ㄱ은 \(\log_a(xy)=\log_ax+\log_ay\)라는 법칙을 \((\log_ax)(\log_ay)\)와 혼동한 식이다. 예를 들어 \(a=2,x=y=2\)이면 왼쪽은 1, 오른쪽은 2이므로 거짓.
3. ㄴ은 밑변환 공식으로 \(\frac{\log_a x}{\log_a y}=\frac{\log x/\log a}{\log y/\log a}=\frac{\log x}{\log y}=\log_y x\)이다. \(y\ne1\)이라 분모가 0이 아니므로 **참**이다. 원문처럼 교육과정 밖 자연로그 \(\ln\)을 도입할 필요가 없다.
4. ㄷ의 올바른 법칙은 \(\log_a(x/y)=\log_ax-\log_ay\)이며, \(\log_a(x-y)\)와 다르다. \(x\le y\)라면 왼쪽 자체가 정의되지 않을 수도 있다. 거짓.
5. ㄹ의 올바른 법칙은 \(\log_a(x^n)=n\log_ax\)이며 \((\log_ax)^n\)은 일반적으로 다르다. 예를 들어 \(a=2,x=8,n=2\)이면 왼쪽 9, 오른쪽 6으로 달라 거짓.
6. 따라서 옳은 것은 **ㄴ만**, 정답 **①**이다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `qid_v1_69aa739950b6907a1fe416e3a403b9eaf5b4b1c48d9be46da7972c60f691abdf`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
이차방정식 $x^2 - 3x - 5 = 0$의 두 근을 $\alpha, \beta$라 할 때,
$$2^{\frac{1}{\alpha^2 - 5}} \times 2^{\frac{1}{\beta^2 - 5}}$$
의 값을 구하면? [3.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{\sqrt[6]{2}}$
$\frac{1}{\sqrt[5]{2^3}}$
$\frac{1}{\sqrt[5]{2}}$
$\frac{2}{\sqrt[6]{2^3}}$
$\frac{5}{\sqrt[5]{2}}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
이차방정식의 근과 계수의 관계에서 $\alpha+\beta=3$, $\alpha\beta=-5$이다.
각 근은 $x^2-3x-5=0$을 만족하므로 $\alpha^2=3\alpha+5$, $\beta^2=3\beta+5$이다. 따라서 $\alpha^2-5=3\alpha$, $\beta^2-5=3\beta$이다.
주어진 곱은
$2^{1/(3\alpha)}\cdot2^{1/(3\beta)}=2^{\frac13(1/\alpha+1/\beta)}$
이고,
$\dfrac13\left(\dfrac1\alpha+\dfrac1\beta\right)=\dfrac13\cdot\dfrac{\alpha+\beta}{\alpha\beta}=\dfrac13\cdot\dfrac3{-5}=-\dfrac15$이다.
따라서 값은 $2^{-1/5}=\dfrac1{\sqrt[5]2}$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 로그 근을 합하고 제곱근 관계를 재대입하면 값 \(2^{-1/5}\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `qid_v1_93d247649b9fbb6b9662e3441088c5b1c7f50ccf90a33a94eb12b7ae868b40b3`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
어느 도시의 미세 먼지 농도는 매년 $7\%$씩 증가한다고 한다. 이와 같은 비율로 미세 먼지 농도가 계속 증가한다고 할 때, 미세 먼지 농도가 현재의 $2$배 이상이 되는 것은 최소 몇 년 후인지 고르면? (단, $\log 2 = 0.3010$, $\log 1.07 = 0.03$으로 계산한다.) [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$9$
$10$
$11$
$12$
$13$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
현재 농도를 $m_0$라 하면 $n$년 후 농도는 $m_0(1.07)^n$이다. 두 배 이상이 되는 조건은
$m_0(1.07)^n\ge2m_0$
이므로
$n\log1.07\ge\log2$이다.
주어진 값을 대입하면 $n\ge\dfrac{0.3010}{0.03}=10.033\ldots$이다. 년수 $n$은 정수이므로 이 조건을 처음 만족하는 값은 $11$이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 매년 7% 성장 \(1.07^n\)의 조건을 로그로 풀면 \(n>10.033\cdots\), 최소 11년, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `qid_v1_1cbeaface782f7114d0a1e0e3e118a422188aa1ad987e8b6341eb6704be83aac`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x$에 대한 방정식 $4^x - k \times 2^{x+1} + 25 = 0$이 오직 하나의 실근 $\alpha$를 가질 때, $k + 2^\alpha$의 값을 구하면? (단, $k$는 상수이다.) [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$4$
$6$
$8$
$10$
$12$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$t=2^x$라 놓으면 $t>0$이고 $4^x=t^2$, $2^{x+1}=2t$이다. 방정식은
$t^2-2kt+25=0$
으로 바뀐다. $x$와 $t=2^x$는 일대일 대응하므로 양의 실근 $t$가 하나여야 한다.
두 근의 곱이 $25>0$이므로 실근이 있으면 두 근은 같은 부호이다. 양의 실근이 하나만 생기려면 양의 중근이어야 하므로 판별식이 $0$이고 중근이 양수여야 한다.
$4k^2-100=0$에서 $k=\pm5$이고, 중근은 $t=k$이므로 양수 조건에 따라 $k=5$, $t=5$이다. 따라서 $k+2^\alpha=5+5=10$이다.
따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(t^2-2kt+25\)의 양의 중근 조건 \(k^2=25\), \(k=5,t=5\), 합10, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `qid_v1_88807f92467a86df2f773551ae4d0c61a1c090f24bcdd5cdc722a86573d7e61b`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$2$보다 큰 실수 $a$에 대하여 $a < x < a^2$일 때, $\log_a x$, $(\log_a x)^2$, $x$, $\log_a (\log_a x)$의 대소를 옳게 비교한 것을 고르면? [4.0점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\log_a x < (\log_a x)^2 < x < \log_a (\log_a x)$
$\log_a x < x < (\log_a x)^2 < \log_a (\log_a x)$
$x < \log_a (\log_a x) < \log_a x < (\log_a x)^2$
$\log_a (\log_a x) < x < \log_a x < (\log_a x)^2$
$\log_a (\log_a x) < \log_a x < (\log_a x)^2 < x$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$t=\log_a x$라 놓는다. $a>2$이고 $a<x<a^2$이므로 $1<t<2$이다. 따라서 $\log_a x=t$이고 $\log_a(\log_a x)=\log_a t$이다.
밑 $a>1$에서 로그함수는 증가하므로 $1<t$에서 $0<\log_a t<1<t<t^2$이다.
또 $a>2$와 $t>1$에서 $x=a^t>2^t$이고, 해설 그림에서 두 그래프를 비교하면 $1<t<2$에서 $2^t>t^2$이다. 그러므로 $t^2<x$이다.
따라서 $\log_a(\log_a x)<\log_a x<(\log_a x)^2<x$이므로 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\log_a x\in(1,2)\). \(0<\log_a t<t<t^2\)이고 \(x=a^t>2^t>t^2\)이므로 전체 순서 ⑤. 마지막 부등식은 지수·제곱 그래프의 해당 구간 비교에 의존.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `qid_v1_1303ee26567c91187744acb20fc3faea86c8503d6fc1cd8a27e26526d5409fad`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = \frac{1}{2}\sin\left(3x + \frac{\pi}{4}\right) - 1$의 최댓값을 $a$, 주기를 $b\pi$라 할 때, $a+b$의 값을 구하면? (단, $a, b$는 상수이다.) [4.0점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{8}$
$\frac{1}{6}$
$\frac{1}{4}$
$\frac{1}{3}$
$\frac{1}{2}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
사인함수의 최댓값은 $1$이므로
$a=\dfrac12\cdot1-1=-\dfrac12$이다.
$\sin(3x+\dfrac\pi4)$의 주기는 안쪽 계수 $3$에 의해 $\dfrac{2\pi}{3}$이다. 따라서 $b=\dfrac23$이다.
그러므로 $a+b=-\dfrac12+\dfrac23=\dfrac16$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 사인함수의 최댓값 −1/2과 주기 \(2\pi/3\)을 각각 적용하면 요구값 \(1/6\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `qid_v1_5eb4c00eaaaeb02e02706d761fc11ba434751c7c7fe8698423ea0dfc2ac5aeb1`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < \pi$일 때, $\sin\left(2x - \frac{\pi}{6}\right) = -\frac{\sqrt{3}}{2}$의 모든 근의 합을 구하면? [4.1점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\pi$
$\frac{7}{6}\pi$
$\frac{4}{3}\pi$
$\frac{3}{2}\pi$
$\frac{5}{3}\pi$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$u=2x-\dfrac\pi6$이라 놓으면 $0\le x<\pi$에서 $-\dfrac\pi6\le u<\dfrac{11\pi}6$이다.
$\sin u=-\dfrac{\sqrt3}{2}$를 만족하는 각 중 이 범위에 있는 것은 $u=\dfrac{4\pi}3$, $u=\dfrac{5\pi}3$이다.
따라서
$x=\dfrac{u+\pi/6}{2}$
에서 $x=\dfrac{3\pi}4$, $\dfrac{11\pi}{12}$를 얻는다. 두 근의 합은 $\dfrac{3\pi}4+\dfrac{11\pi}{12}=\dfrac{5\pi}3$이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 삼각방정식을 풀어 구간 내 두 근 \(3\pi/4,11\pi/12\)을 얻고 합 \(5\pi/3\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `qid_v1_83f1ce3a00383b4b57f6f007c689f34a7c6ab091b1c3ad5297765b48f295ec74`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
어떤 방사능 물질이 시간이 지남에 따라 일정한 비율로 붕괴되어 $a$년 후에는 처음 양의 $\frac{1}{2}$이 된다고 할 때, $a$년을 이 물질의 반감기라고 한다. 반감기가 $a$년인 방사능 물질의 처음의 양을 $m_0$이라 고 할 때, $t$년 후 이 방사능 물질의 양 $m(t)$는
$$m(t) = m_0 \times \left(\frac{1}{2}\right)^{\frac{t}{a}}$$
인 관계가 성립한다. 반감기가 $300$년인 방사능 물질의 양이 현재 $m$이라고 할 때, 이 물질의 양이 $\frac{m}{16}$이 되는 것은 지금으로부터 약 몇 년 후인지 구하면? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$200$년후
$400$년후
$600$년후
$800$년후
$1200$년후
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
처음 양을 $m_0$라 하면 $t$년 후의 양은 $m_0(1/2)^{t/300}$이다. 현재 양이 $m$이므로 $m_0=m$으로 두고, $m/16$이 되는 조건을 세우면
$m(1/2)^{t/300}=m/16$이다.
양변을 $m$으로 나누고 $1/16=(1/2)^4$를 쓰면 $t/300=4$이다. 따라서 $t=1200$년이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 반감기 300년에 \(1/16=(1/2)^4\)이 되려면 네 번 지나야 하므로 1200년, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `qid_v1_cee716a2718cc0ac8c86ab52d5179d05b51da5422a2533739b6875897289c8b0`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid 1 \le x < 1000\}$이고, 함숫값이 $\log x$의 소수 부분인 함수를 $f(x)$라 하자. 함수 $y=f(x)$의 그래프와 직선 $y = 2 - \frac{x}{n}$가 서로 다른 두 점에서 만나도록 하는 자연수 $n$의 개수를 구하면? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$55$
$50$
$45$
$40$
$35$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$10^k\le x<10^{k+1}$인 각 구간에서 $\log x$의 소수 부분은 $f(x)=\log x-k$이다. 여기서 $k=0,1,2$이다.
각 구간에서 $f(x)$는 증가하고 직선 $2-x/n$은 감소하므로 교점은 많아야 하나이다. 구간의 왼쪽 끝 $x=10^k$에서 함수값은 $0$이고, 오른쪽 끝에 가까워질 때 $f(x)$는 $1$에 가까워진다. 따라서 해당 구간에 교점이 생기는 조건은
$\dfrac{10^k}{2}\le n<10^{k+1}$
이다.
세 구간의 교점 존재 조건은 각각 $[1,10)$, $[5,100)$, $[50,1000)$에 속하는 자연수 $n$이다. 정확히 두 구간에 속하는 자연수는 $5\le n\le9$ 또는 $50\le n\le99$이다.
개수는 $5+50=55$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(10^j\le x<10^{j+1}\) 세 구간에서 각 한 교점. n의 가능 구간 [1,10), [5,100), [50,1000) 중 정확히 두 곳에 속하는 5–9,50–99 총55, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `qid_v1_ac9092b80bbe3b5d6b1a8247050e595d350f23fb6d9c203f2c242e05cb99251e`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x)$를 $f(x) = \begin{cases} \log_3 (9x - 9) & (1 < x < 4) \\ (\sqrt{3})^{6-x} & (x \ge 4) \end{cases}$라 하자.
$t \le x \le t+2$에서 함수 $f(x)$의 최댓값이 $3$이 되도록 하는 모든 자연수 $t$의 개수를 $a$, $s \le x \le s+1$에서 함수 $f(x)$의 최솟값이 $1$이 되도록 하는 모든 실수 $s$의 값의 합을 $b$라 할 때, $a+3b$의 값을 구하면? (단, $t > 1$, $s > 1$, $a, b$는 상수이다.) [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$21$
$22$
$23$
$24$
$25$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
첫 번째 식은 $f(x)=2+\log_3(x-1)$이므로 $1<x<4$에서 증가하고, $x$가 $4$에 가까워질 때 함수값은 $3$에 가까워진다. 두 번째 식은 $x\ge4$에서 $3^{(6-x)/2}$이므로 감소하며 $f(4)=3$이다. 따라서 전체 최댓값은 $x=4$에서 $3$이다.
길이 $2$인 구간 $[t,t+2]$가 $x=4$를 포함하려면 $t\le4\le t+2$이다. 자연수 $t>1$은 $2,3,4$이므로 $a=3$이다.
이제 $f(x)\ge1$인 범위를 구한다. 로그식에서 $2+\log_3(x-1)\ge1$은 $x\ge\dfrac43$이고, 지수식에서 $3^{(6-x)/2}\ge1$은 $x\le6$이다. 따라서 $f(x)\ge1$인 범위는 $[\dfrac43,6]$이다.
길이 $1$인 닫힌 구간에서 최솟값이 $1$이 되려면 구간이 이 범위 안에 있으면서 끝점 중 하나가 경계에 닿아야 한다. 가능한 $s$는 $\dfrac43$ 또는 $5$이므로 $b=\dfrac43+5=\dfrac{19}3$이다.
따라서 $a+3b=3+19=22$이고 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 조각함수 최댓값이 3인 t=2,3,4 → a3; 최솟값 1인 길이1 구간 시작 s=4/3 또는5 → b19/3; \(a+3b=22\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `qid_v1_b364d757864ebad6a19266254f87c3bcdc739e43acfad903c93dab593cb0a8b1`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
각 $\theta$를 나타내는 동경과 각 $5\theta$를 나타내는 동경이 $y$축에 대칭이고, 각 $\theta$를 나타내는 동경과 각 $7\theta$를 나타내는 동경이 $x$축에 대하여 대칭이다. 이 두 조건을 모두 만족시키는 $\theta$의 값이 $\frac{b}{a}\pi$일 때, $a+b$의 값을 구하면? (단, $0 < \theta < \pi$이고, $a, b$는 서로소인 자연수이다.) [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$3$
$4$
$5$
$6$
$7$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
동경의 대칭은 각의 동치식으로 바꾼다. $5\theta$의 동경이 $\theta$의 동경을 $y$축에 대칭이동한 것이므로
$5\theta\equiv\pi-\theta\pmod{2\pi}$,
따라서 $6\theta\equiv\pi\pmod{2\pi}$이다. $0<\theta<\pi$에서 가능한 값은 $\dfrac\pi6,\dfrac\pi2,\dfrac{5\pi}6$이다.
또 $7\theta$의 동경이 $\theta$의 동경을 $x$축에 대칭이동한 것이므로
$7\theta\equiv-\theta\pmod{2\pi}$,
즉 $8\theta\equiv0\pmod{2\pi}$이다. 같은 범위에서 가능한 값은 $\dfrac\pi4,\dfrac\pi2,\dfrac{3\pi}4$이다.
두 조건을 모두 만족하는 값은 $\theta=\dfrac\pi2$이다. 따라서 $a=2,b=1$이고 $a+b=3$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** y축 대칭 \(6\theta\equiv\pi\), x축 대칭 \(8\theta\equiv0\pmod{2\pi}\); 교집합 \(\theta=\pi/2\), a+b3, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `qid_v1_ba92ec2f949fde56fa87778d5a915793ce3fbc134b658d78867d43b3ad76855e`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $h(x)=3+2\cos\left(\dfrac{\pi}{2}(x-1)\right)$에 대하여 $4\le x\le8$일 때, $h(x)$는 $x=a$에서 최댓값 $b$, $x=c$에서 최솟값 $d$를 갖는다. 이때, $ad+bc$의 값을 구하면? (단, $a,b,c,d$는 상수이다.) [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$30$
$32$
$36$
$40$
$46$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
주어진 함수는 진폭이 $2$, 중심선이 $y=3$인 코사인 함수이다. $4\le x\le8$에서
$\dfrac{3\pi}{2}\le\dfrac{\pi}{2}(x-1)\le\dfrac{7\pi}{2}$이다.
이 범위에서 코사인값이 가장 큰 $1$은 각이 $2\pi$일 때, 가장 작은 $-1$은 각이 $3\pi$일 때 얻는다.
$\dfrac{\pi}{2}(x-1)=2\pi$에서 $x=5$이므로 $a=5$, $b=h(5)=5$이다.
$\dfrac{\pi}{2}(x-1)=3\pi$에서 $x=7$이므로 $c=7$, $d=h(7)=1$이다.
두 끝점에서는 $h(4)=h(8)=3$이므로 위 최댓값과 최솟값은 구간에서 각각 유일하다.
따라서
$ad+bc=5\cdot1+5\cdot7=40$이다.
따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 코사인 그래프의 x5에서 최댓값5, x7에서 최솟값1을 대입해 \(ad+bc=40\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `qid_v1_fe6b58407dd8095cd92ddbf17257452788670999fd60e714ee1bb317958327a8`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[주관식1 (서술형)] [6점](부분점수 있음)
각 $\theta$가 $\sin\theta + \cos\theta = \frac{\sqrt{3}}{2}$을 만족시킬 때, $\sin^6\theta - \cos^6\theta$의 값을 구하고, 그 과정을 서술하시오. (단, $\frac{3}{2}\pi < \theta < 2\pi$이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$-\dfrac{63\sqrt{15}}{256}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$s=\sin\theta$, $c=\cos\theta$라 하자. 주어진 조건에서 $s+c=\dfrac{\sqrt3}{2}$이다.
$(s+c)^2=1+2sc=\dfrac34$이므로 $sc=-\dfrac18$이다. 또 $\dfrac{3\pi}2<\theta<2\pi$이므로 제4사분면에서 $s-c<0$이다.
$(s-c)^2=1-2sc=\dfrac54$이므로 $s-c=-\dfrac{\sqrt5}{2}$이다. 따라서
$s^2-c^2=(s+c)(s-c)=-\dfrac{\sqrt{15}}4$
이고
$s^4+s^2c^2+c^4=(s^2+c^2)^2-s^2c^2=1-(sc)^2=\dfrac{63}{64}$이다.
그러므로
$\sin^6\theta-\cos^6\theta=(s^2-c^2)(s^4+s^2c^2+c^4)=-\dfrac{63\sqrt{15}}{256}$이다.
따라서 구하는 값은 $-\dfrac{63\sqrt{15}}{256}$이다.
```

- **독립 판정·핵심 연결/검산:** 제4사분면의 \(\sin\theta+\cos\theta=\sqrt3/2\), \(\sin\theta\cos\theta=-1/8\)로 \(\sin\theta-\cos\theta=-\sqrt5/2\), 여섯제곱식 \(-63\sqrt{15}/256\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `qid_v1_24a3ffb20bb9b7ac068b8d1c111013393c11e030ca7daebf599b4a5ba3bb3787`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[주관식2 (서술형)] [7점](부분점수 있음)
네 양수 $x, y, z, a$가 다음 <조건>을 만족시킬 때, $a^3$의 값을 구하고, 그 과정을 서술하시오.

<조건>
(가) $2^x = 3^y = a^z$
(나) $\log 3 + \log xy - \log(3x-y) = \log z$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\dfrac{27}{2}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
공통값을 $K$라 하면 $2^x=3^y=a^z=K$이다. 먼저 $2^x=3^y$에 로그를 취하면
$x\log2=y\log3$
이므로 $r=\dfrac xy=\dfrac{\log3}{\log2}$이다.
조건 (나)를 로그의 성질로 정리하면
$\log\dfrac{3xy}{3x-y}=\log z$
이므로 $z=\dfrac{3xy}{3x-y}$이다. $r=x/y$를 대입하면 $\dfrac zx=\dfrac3{3r-1}$, 따라서 $\dfrac xz=r-\dfrac13$이다.
이제 $2^x=a^z$에 로그를 취하면
$\log a=\dfrac xz\log2=(r-\dfrac13)\log2=\log3-\dfrac13\log2$이다.
따라서 $a=\dfrac3{\sqrt[3]2}$이고 $a^3=\dfrac{27}{2}$이다.
따라서 구하는 값은 $\dfrac{27}{2}$이다.
```

- **독립 판정·핵심 연결/검산:** 로그 밑변환·지수성질로 \(a^3=27/2\) 확인.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `qid_v1_f441aaf0d72ebb5d8b13a47178b09ecc299a6d9ecfbe9046324ab986553f3fbd`; 원본 blob: `e16b987101b3f8255357fc94ef4f12211109e8b7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[주관식3 (서술형)] [7점](부분점수 있음)
두 정수 $a, n$에 대하여 직선 $y=n$이 두 함수 $f(x)=2^{x-1}+a$, $g(x)=-2^x - \frac{a}{2}+9$의 그래프와 모두 만나도록 하는 정수 $n$의 개수가 $4$일 때, $n$의 최솟값을 $b$, 최댓값을 $c$라 하자. 좌표평면에서 두 곡선 $y=f(x)$, $y=g(x)$와 두 직선 $x=b$, $x=c$로 둘러싸인 영역의 내부 또는 그 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하고, 그 과정을 서술하시오. (단, $a, b, c$는 상수이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `344`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
직선 $y=n$이 $f(x)=2^{x-1}+a$의 그래프와 만나려면 $n>a$이고, $g(x)=-2^x-\dfrac a2+9$의 그래프와 만나려면 $n<9-\dfrac a2$이어야 한다. 따라서 두 그래프와 모두 만나는 정수 $n$은
$a<n<9-\dfrac a2$
를 만족한다.
$a$가 짝수이면 $a=2k$라 할 때 가능한 정수의 개수는 $8-3k$이므로 이를 $4$로 둘 때 정수 $k$가 나오지 않는다. $a$가 홀수이면 $a=2k+1$이고 가능한 정수의 개수는 $7-3k$이다. 이를 $4$로 두면 $k=1$, 따라서 $a=3$이다.
이때 가능한 정수 $n$은 $4,5,6,7$이므로 $b=4$, $c=7$이다. 영역에서 위쪽 곡선은 $f$, 아래쪽 곡선은 $g$이다. 정수 $x=4,5,6,7$에서 정수 $y$의 개수를 각각 센다.
$x=4$: $g(4)=-\dfrac{17}2$, $f(4)=11$이므로 $y=-8,-7,\ldots,11$의 $20$개이다.
$x=5$: $g(5)=-\dfrac{49}2$, $f(5)=19$이므로 $y=-24,-23,\ldots,19$의 $44$개이다.
$x=6$: $g(6)=-\dfrac{113}2$, $f(6)=35$이므로 $y=-56,-55,\ldots,35$의 $92$개이다.
$x=7$: $g(7)=-\dfrac{241}2
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** 양 곡선에 그은 수평선과 교차하는 정수 n이 4개인 조건에서 a3, b4,c7. 각 x4,5,6,7에서 정수점이 20,44,92,188개이므로 344.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 24/24; 문항별 원문·정답·기존 해설·조건·이미지 링크와 구체적 계산 위에 기록.
- **UPGRADE 전체 초안**: 1개 완성 (원본 학생용 JS에는 미반영).
- **HOLD**: 0개 (없음). HOLD는 승인 또는 신뢰 가능한 출제 원문이 확인될 때까지 상향 배포하지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 실제 UI 학생 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **심층 감사 MD의 작성 완료는 출고 통과를 뜻하지 않는다.**
- **후속**: HOLD 원문 재확인 및 개선 해설 이관 전에 별도 검증 게이트를 진행.

