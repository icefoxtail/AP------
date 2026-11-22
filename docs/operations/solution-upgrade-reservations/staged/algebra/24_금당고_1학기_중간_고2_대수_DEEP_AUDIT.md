# 2024 24_금당고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_금당고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `a86caae62dbecd956f1074e38b21beb833638861`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_금당고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 20 · UPGRADE 1 · HOLD 0 · UNREAD 0
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


검토 방식: 원본 `content`, `choices`, `answer`, `solution` 전 문항을 직접 읽고 정답·로그/지수 조건·구간 끝점·부호·그래프를 대조했다. 문항별로 원문 문제·선택지·정답·기존 해설 핵심 발췌와 **독립 판정의 구체적 수치**를 기록한다. UPGRADE는 학생용 전체 새 풀이를 제공한다. HOLD는 자료가 불충분하거나 원문에 수학적 불일치가 있는 상태로 정답을 임의 수정하지 않는다. 원본 시험의 신뢰성 복구는 별도 승인·원본 대조 후 수행한다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지·보조 해설 그림 검증

- Q14 문제 본문 SVG — 원본 JS에서 SVG 추출·렌더 후 시각 확인 (외부 파일 blob 없음)
- Q15 기존 해설의 코사인 도식 SVG — 원본 JS에서 SVG 추출·렌더 후 시각 확인 (외부 파일 blob 없음)
- `solutionImage` 보조 해설 자산: 9개 GitHub 취득·Git blob 존재 검증. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q09 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q9-solution.svg` — `5fad6ce695fc16bbffed51f8ecdcf838fd5fafd2`
  - Q11 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q11-solution.svg` — `e4a837bba773b0901d8dac1483be98b4a804197c`
  - Q13 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q13-solution.svg` — `147b505abe541556117e48ae69006c937ef13d64`
  - Q14 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q14-solution.svg` — `7877921d8b3bf8770a5d074dae2edc7f9e68b2de`
  - Q16 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q16-solution-v2.svg` — `2b71183bba79acd0057c22b11e81f5094660a10c`
  - Q17 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q17-solution.svg` — `77e0607222d8feb54f66b0cada337e79767852b8`
  - Q18 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q18-solution.svg` — `db4c3b474b58dd7cf4ec43afaa4ada64d28e46d9`
  - Q19 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q19-solution.svg` — `dc277789ddd0b1a6531c2d7fac658ddf34819e77`
  - Q21 `archive/assets/images/24_금당고_1학기_중간_고2_대수/q21-solution.svg` — `58dbb8296180c8d169f72b837d254f065b4313c2`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$\sqrt[5]{-32}$의 값은? [3.8]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-4
-2
1
2
4
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$-32 = (-2)^5$ 이므로 $\sqrt[5]{-32} = -2$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(\sqrt[5]{-32}=-2\) (홀수 제곱근), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$3^{\frac{10}{3}} \times 3^{-\frac{1}{3}}$의 값은? [3.8]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{9}$
$\frac{1}{3}$
3
9
27
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$3^{\frac{10}{3}} \times 3^{-\frac{1}{3}} = 3^{\frac{10}{3}-\frac{1}{3}} = 3^{\frac{9}{3}} = 3^3 = 27$ 이다.
```

- **독립 판정·핵심 연결/검산:** 밑과 지수를 정리하면 주어진 식이 \(27\)이 됨, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$\log_a b \times \log_b c \times \log_c a$의 값은? [3.8]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0
$\log_a c$
$\log_c b$
$\log_b a$
1
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\log_a b \cdot \log_b c = \log_a c$ 이고 $\log_a c \cdot \log_c a = 1$ 이므로 주어진 값은 $1$ 이다.
```

- **독립 판정·핵심 연결/검산:** 로그의 순환 밑변환 곱 \(\log_ab\log_bc\log_ca=1\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">방정식 $\log_2(x+5) = \log_2(2x+1)$의 해는? [3.8]</div>
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
진수 조건은 $x+5>0$, $2x+1>0$ 이므로 $x>-\frac{1}{2}$ 이다. 같은 밑의 로그가 같으므로 $x+5=2x+1$ 이고, 이를 풀면 $x=4$ 이다. $x=4$ 는 진수 조건도 만족한다.
```

- **독립 판정·핵심 연결/검산:** 진수 \(2x+1>0\)에서 정의역을 점검하고 풀면 \(x=4\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">다음 중 제2사분면의 각은? [4.0]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$72^\circ$
$225^\circ$
$330^\circ$
$405^\circ$
$500^\circ$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
제2사분면의 각은 $90^\circ < \theta < 180^\circ$ 이다. $500^\circ = 360^\circ + 140^\circ$ 이므로 제2사분면의 각이다.
```

- **독립 판정·핵심 연결/검산:** \(500^\circ\equiv140^\circ\pmod{360^\circ}\)로 제2사분면, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">각 $\theta$가 제3사분면의 각이고 $\sin\theta = -\frac{1}{3}$일 때, $\cos\theta$의 값은? [4.0]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-\frac{2\sqrt{2}}{3}$
$-\frac{\sqrt{2}}{3}$
0
$\frac{\sqrt{2}}{3}$
$\frac{2\sqrt{2}}{3}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin^2\theta + \cos^2\theta = 1$ 이므로 $\cos^2\theta = 1 - \left(-\frac{1}{3}\right)^2 = 1 - \frac{1}{9} = \frac{8}{9}$ 이다. $\theta$ 는 제3사분면의 각이므로 $\cos\theta<0$ 이다. 따라서 $\cos\theta = -\frac{2\sqrt{2}}{3}$ 이다.
```

- **독립 판정·핵심 연결/검산:** 제3사분면 \(\sin=-1/3\)에서 \(\cos=-2\sqrt2/3\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">부등식 $(\log_3 x)^2 - \log_3 x^3 + 2 < 0$을 만족시키는 자연수 $x$의 개수는? [4.0]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
5
7
9
11
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\log_3 x = t$ 로 두면 $\log_3 x^3 = 3\log_3 x = 3t$ 이므로 부등식은 $t^2 - 3t + 2 < 0$ 이다. 즉 $(t-1)(t-2)<0$ 이므로 $1<t<2$ 이다. 따라서 $1<\log_3 x<2$, 즉 $3<x<9$ 이다. 자연수 $x$ 는 $4,5,6,7,8$ 이므로 개수는 $5$ 이다.
```

- **독립 판정·핵심 연결/검산:** 로그 부등식의 양 끝 경계를 점검하면 자연수 \(x=4,5,6,7,8\), 5개, ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">호의 길이가 $2\pi$, 넓이가 $3\pi$인 부채꼴의 반지름의 길이를 $r$, 중심각의 크기를 $\theta$라 할 때, $\frac{\theta}{r}$의 값은? [4.2]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{\pi}{18}$
$\frac{\pi}{9}$
$\frac{2\pi}{9}$
$\frac{4\pi}{9}$
$\frac{8\pi}{9}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
호의 길이와 넓이 공식은 $r\theta = 2\pi$, $\frac{1}{2}r^2\theta = 3\pi$ 이다. 첫째 식에서 $\theta = \frac{2\pi}{r}$ 이고, 이를 둘째 식에 대입하면 $\frac{1}{2}r^2 \cdot \frac{2\pi}{r} = 3\pi$ 이므로 $r=3$ 이다. 따라서 $\theta = \frac{2\pi}{3}$ 이고, $\frac{\theta}{r} = \frac{2\pi/3}{3} = \frac{2\pi}{9}$ 이다.
```

- **독립 판정·핵심 연결/검산:** 호 길이 \(2\pi\), 넓이 \(3\pi\)에서 반지름3·중심각 \(2\pi/3\), 따라서 \(\theta/r=2\pi/9\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$0 \le x < 2\pi$에서 방정식 $2\sin^2 x + 3\sin x - 2 = 0$의 모든 해의 합은? [4.2]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0
$\frac{\pi}{2}$
$\pi$
$\frac{3\pi}{2}$
$2\pi$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
방정식을 인수분해하면 $(2\sin x-1)(\sin x+2)=0$ 이다. $\sin x=-2$ 는 불가능하므로 $\sin x=\frac{1}{2}$ 이다. $0 \le x < 2\pi$ 에서 해는 $x=\frac{\pi}{6}, \frac{5\pi}{6}$ 이므로 모든 해의 합은 $\pi$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(\sin x=1/2\)인 범위의 두 근 \(\pi/6,5\pi/6\), 합 \(\pi\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$0 \le x \le \frac{\pi}{2}$에서 부등식 $\tan\left(x+\frac{\pi}{6}\right) \ge \sqrt{3}$의 해가 $\alpha \le x < \beta$일 때, $\tan(\beta-\alpha)$의 값은? [4.2]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0
$\frac{\sqrt{3}}{3}$
$\frac{\sqrt{2}}{2}$
$\frac{\sqrt{3}}{2}$
$\sqrt{3}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$y=x+\frac{\pi}{6}$ 이라 두면 $\frac{\pi}{6} \le y \le \frac{2\pi}{3}$ 이다. $\tan y \ge \sqrt{3}$ 를 만족하려면 $\frac{\pi}{3} \le y < \frac{\pi}{2}$ 이므로 $\frac{\pi}{6} \le x < \frac{\pi}{3}$ 이다. 따라서 $\alpha=\frac{\pi}{6}$, $\beta=\frac{\pi}{3}$ 이고, $\beta-\alpha=\frac{\pi}{6}$ 이므로 $\tan(\beta-\alpha)=\tan\frac{\pi}{6}=\frac{\sqrt{3}}{3}$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(\tan(x+\pi/6)\ge\sqrt3\)에서 \(x\in[\pi/6,\pi/3)\), 경계 \(\tan(\pi/6)=\sqrt3/3\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">자연수 $n\ (n \ge 2)$에 대하여 $-n^2+11n-24$의 $n$제곱근 중에서 실수인 것의 개수를 $f(n)$이라 할 때, $f(n)+f(n+1)=3$을 만족시키는 모든 자연수 $n$의 값의 합은?</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
12
14
16
18
20
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$-n^2+11n-24 = -(n-3)(n-8)$ 이다. $x^n=A$ 의 실근 개수는 $A>0$ 이면 홀수 차수에서 1개, 짝수 차수에서 2개이고, $A=0$ 이면 1개, $A<0$ 이면 홀수 차수에서 1개, 짝수 차수에서 0개이다. 이를 이용하면 $f(3)=1$, $f(4)=2$, $f(5)=1$, $f(6)=2$, $f(7)=1$ 이다. 따라서 $f(n)+f(n+1)=3$ 을 만족하는 $n$ 은 $3,4,5,6$ 이고, 그 합은 $18$ 이다.
```

- **독립 판정·핵심 연결/검산:** 연속된 정수 차수의 실수 제곱근 개수 합이 3인 \(n=3,4,5,6\)의 합 18, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">두 자연수 $n, m$에 대하여 $n \times \left(\frac{\sqrt[4]{3}}{\sqrt[4]{2}}\right)^m$이 자연수일 때, $m+n$의 최솟값은?</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6
8
10
12
14
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
주어진 식은 $n\left(\frac{3}{2}\right)^{\frac{m}{4}}$ 이다. 이 값이 자연수가 되려면 $\left(\frac{3}{2}\right)^{\frac{m}{4}}$ 가 유리수가 되어야 하므로 $m$ 은 4의 배수여야 한다. $m=4k$ 로 두면 식은 $n\left(\frac{3}{2}\right)^k = \frac{n\cdot 3^k}{2^k}$ 이다. 이를 자연수로 만들기 위한 최소의 $n$ 은 $2^k$ 이므로 $m+n = 4k + 2^k$ 이다. $k=1$ 일 때 $m=4, n=2$ 로 최솟값 $6$ 을 가지므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 거듭제곱 지수 정수 조건 \(n(3/2)^{m/4}\), 최소 \(m=4,n=2\), 합 6, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">양수 $k$에 대하여 $1 \le x \le 3$에서 함수 $y = \log_2(x^2-2kx+k^2+1)+2$의 최솟값은 $3$, 최댓값은 $M$일 때, $k+2^M$의 값은?</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
36
40
44
48
52
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
함수식은 $y = \log_2((x-k)^2+1)+2$ 이다. 최솟값이 $3$ 이므로 $(x-k)^2+1$ 의 최솟값이 $2$ 여야 하고, 이는 구간 $[1,3]$ 에서 점 $k$ 와의 최소거리가 $1$ 임을 뜻한다. $k>0$ 이므로 $k=4$ 이다. 이때 $(x-4)^2+1$ 의 최댓값은 $x=1$ 에서 $10$ 이므로 $M=\log_2 10 + 2$ 이다. 따라서 $2^M = 2^{\log_2 10 + 2} = 40$ 이고, $k+2^M = 44$ 이다.
```

- **독립 판정·핵심 연결/검산:** \((x-k)^2+1\)의 최솟값이 2인 조건에서 양수 \(k=4\); \(M=\log_2 10+2\), \(k+2^M=44\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수의 그래프` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
두 양수 $a, b$에 대하여 곡선 $y=a \sin\frac{\pi}{b}x \; (0 \le x \le 3b)$이 직선 $y=a$와 만나는 서로 다른 두 점을 A, B라 하자.<br><div style='text-align:center; margin: 10px 0;'><svg viewBox='0 0 300 280' preserveAspectRatio='xMidYMid meet'><line x1='20' y1='160' x2='280' y2='160' stroke='black' stroke-width='1.5' marker-end='url(#arrow)'/><line x1='40' y1='260' x2='40' y2='20' stroke='black' stroke-width='1.5' marker-end='url(#arrow)'/><defs><marker id='arrow' viewBox='0 0 10 10' refX='5' refY='5' markerWidth='4' markerHeight='4' orient='auto-start-reverse'><path d='M 0 0 L 10 5 L 0 10 z' fill='black'/></marker></defs><line x1='30' y1='80' x2='260' y2='80' stroke='black' stroke-width='1'/><text x='15' y='75' font-size='12' font-style='italic'>y=a</text><path d='M 40,160 Q 55,80 70,80 T 100,160 Q 115,240 130,240 T 160,160 Q 175,80 190,80 T 220,160' fill='none' stroke='black' stroke-width='1.5'/><text x='25' y='175' font-size='12'>O</text><text x='275' y='150' font-size='12' font-style='italic'>x</text><text x='25' y='25' font-size='12' font-style='italic'>y</text><circle cx='70' cy='80' r='2' fill='black'/><circle cx='190' cy='80' r='2' fill='black'/><text x='65' y='70' font-size='12'>A</text><text x='185' y='70' font-size='12'>B</text><line x1='40' y1='160' x2='70' y2='80' stroke='black' stroke-dasharray='4 4' stroke-width='1'/><line x1='40' y1='160' x2='190' y2='80' stroke='black' stroke-dasharray='4 4' stroke-width='1'/><text x='170' y='45' font-size='12' font-style='italic'>y=a sin(πx/b)</text></svg></div><br>삼각형 OAB의 넓이가 $4$이고 직선 OA의 기울기와 직선 OB의 기울기의 곱이 $\frac{16}{5}$일 때, $a+b$의 값은? (단, O는 원점이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\sqrt{2}$
$\frac{3\sqrt{2}}{2}$
$2\sqrt{2}$
$\frac{5\sqrt{2}}{2}$
$3\sqrt{2}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$y=a$ 와 곡선이 만나는 점은 $\sin\frac{\pi}{b}x = 1$ 일 때이므로 $x=\frac{b}{2}, \frac{5b}{2}$ 이다. 따라서 $A\left(\frac{b}{2}, a\right)$, $B\left(\frac{5b}{2}, a\right)$ 이다. 삼각형 OAB 의 넓이는 $ab$ 이므로 $ab=4$ 이다. 또 기울기 곱은 $\frac{a}{\frac{b}{2}} \cdot \frac{a}{5b/2} = \frac{4a^2}{5b^2} = \frac{16}{5}$ 이므로 $a=2b$ 이다. 이를 $ab=4$ 에 대입하면 $b=\sqrt{2}$, $a=2\sqrt{2}$ 이고, 따라서 $a+b=3\sqrt{2}$ 이다.
```

- **독립 판정·핵심 연결/검산:** 문제 내 SVG에서 사인의 두 최고점 A(b/2,a), B(5b/2,a) 확인. 넓이 \(ab=4\), 두 기울기 곱 \(4a^2/(5b^2)=16/5\), \(a=2b\), 합 \(3\sqrt2\), ⑤.
- 문제 그림: 문제 본문 inline SVG 렌더 판독
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$-a \le x \le a$에서 방정식 $5\sin^2\left(x+\frac{\pi}{2}\right)-\sin^2 x+\cos 2x=0$이 서로 다른 6개의 근을 갖도록 하는 양수 $a$의 최솟값은 $\frac{q}{p}\pi$이다. $p+q$의 값을 구하시오. (단, $p$와 $q$는 서로소인 자연수이다.)</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
7
9
10
13
14
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin\left(x+\frac{\pi}{2}\right)=\cos x$ 이므로 식은 $5\cos^2x-\sin^2x+\cos 2x=0$ 이다. $\cos 2x = \cos^2x-\sin^2x$ 를 이용하면 $6\cos^2x-2\sin^2x=0$, 즉 $3\cos^2x-\sin^2x=0$ 이다. $\sin^2x=1-\cos^2x$ 를 대입하면 $4\cos^2x-1=0$ 이고, 따라서 $\cos x = \pm\frac{1}{2}$ 이다.
 [해설 내 SVG 그림] 
해는 $\pm\frac{\pi}{3}, \pm\frac{2\pi}{3}, \pm\frac{4\pi}{3}, \pm\frac{5\pi}{3}, \dots$ 이므로 서로 다른 6개의 근을 갖기 위한 최소의 $a$ 는 $\frac{4\pi}{3}$ 이다. 따라서 $p=3$, $q=4$ 이고 $p+q=7$ 이다.
```

- **독립 판정·핵심 연결/검산:** 원문 해설에 포함된 코사인 그래프 SVG를 렌더해 \(\cos x=\pm1/2\)의 대칭근 6개와 \(a=4\pi/3\), \(p+q=7\) 확인, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">점 A(8, 0)을 지나는 직선 $y=-x+8$이 두 곡선 $y=a^x$, $y=\log_a x$와 만나는 점을 각각 B, C라 하고, 점 B를 지나고 $y$축에 수직인 직선이 곡선 $y=\log_a x$와 만나는 점을 D라 하자. $\overline{BC}:\overline{CA}=2:1$일 때, 삼각형 BCD의 넓이는? (단, $a>1$) [4.6]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
107
214
321
428
535
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
직선 $y=-x+8$ 위에서 지수함수와 로그함수의 교점은 서로 좌표가 뒤바뀌므로 $B=(t, 8-t)$, $C=(8-t, t)$ 로 둘 수 있다. 또 $A=(8,0)$ 이고 $\overline{BC}:\overline{CA}=2:1$ 이므로 같은 직선 위의 길이비를 이용하면 $\frac{8-2t}{t}=2$ 이고, 따라서 $t=2$ 이다. 그러므로 $B=(2,6)$, $C=(6,2)$ 이다.
점 $B$ 가 $y=a^x$ 위에 있으므로 $a^2=6$ 이다. 점 $D$ 는 $y=6$ 과 $y=\log_a x$ 의 교점이므로 $x=a^6=(a^2)^3=6^3=216$ 이고, 따라서 $D=(216,6)$ 이다. 삼각형 BCD 의 넓이는 $\frac{1}{2}\cdot(216-2)\cdot(6-2)=428$ 이다.
```

- **독립 판정·핵심 연결/검산:** 기울기 −1의 직선에서 역함수 교점 \(B=(2,6),C=(6,2)\), \(D=(216,6)\)이므로 넓이 \(214\cdot4/2=428\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">닫힌구간 $[0, 2\pi]$에서 정의된 함수 $f(x)$는 $$f(x)=\begin{cases}\cos x & \left(0 \le x \le \frac{k}{3}\pi\right)\\[6pt]2\cos\left(\frac{k}{3}\pi\right)-\cos x & \left(\frac{k}{3}\pi < x \le 2\pi\right)\end{cases}$$ 이다. 곡선 $y=f(x)$와 직선 $y=\cos\left(\frac{k}{3}\pi\right)$의 교점의 개수를 $a_k$라 할 때, $a_1+a_2+a_3+a_4+a_5$의 값은? [4.8]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6
7
8
9
10
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
두 구간 모두에서 직선 $y=\cos\left(\frac{k}{3}\pi\right)$ 와의 교점은 결국 $\cos x = \cos\left(\frac{k}{3}\pi\right)$ 의 해를 세는 것과 같다. 
$k=1,2,3,4,5$ 에 대하여 각각의 해 개수는 $a_1=2$, $a_2=2$, $a_3=1$, $a_4=2$, $a_5=2$ 이다. 따라서 $a_1+a_2+a_3+a_4+a_5=9$ 이다.
```

- **독립 판정·핵심 연결/검산:** 구간별 \(\cos x=\cos(k\pi/3)\)의 중복 없는 근 개수는 \(2,2,1,2,2\), 합 9, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `로그함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">함수 $y=\log_2 x$의 그래프를 $y$축의 방향으로 $-3$만큼 평행이동한 후 $x$축에 대하여 대칭이동한 그래프가 함수 $y=\log_a bx$의 그래프와 일치할 때, $a+b$의 값을 구하시오. (단, $a \ne 1$, $a>0$, $b>0$이고, $a, b$는 상수이다.) [4.0]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `\frac{5}{8}`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$y=\log_2 x$ 를 아래로 3만큼 평행이동하면 $y=\log_2 x-3$ 이다. 이를 $x$ 축 대칭이동하면 $y=-(\log_2 x-3)=-\log_2 x+3$ 이다. 또 $-\log_2 x = \log_{\frac{1}{2}}x$ 이므로 $-\log_2 x+3 = \log_{\frac{1}{2}}x + \log_{\frac{1}{2}}\frac{1}{8} = \log_{\frac{1}{2}}\left(\frac{x}{8}\right)$ 이다. 따라서 $a=\frac{1}{2}$, $b=\frac{1}{8}$ 이고, $a+b=\frac{5}{8}$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(y=\log_{1/2}(x/8)\)의 밑·평행이동 상수를 비교하면 \(a+b=5/8\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">실수 $t$에 대하여 직선 $y=t$와 함수 $y=|a\sin 2x + b|\ (0 \le x \le 2\pi)$의 그래프가 만나는 서로 다른 교점의 개수를 $f(t)$라 하자. $f(3)=7$일 때, $f(t)=4$를 만족시키는 모든 양수 $t$의 범위를 구하시오. (단, $a>0$, $b>0$) [5.0]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `3<t<9`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$f(3)=7$ 이 되려면 방정식 $|a\sin 2x+b|=3$ 이 $\sin 2x=0$ 에서 5개, $\sin 2x=-1$ 또는 $1$ 에서 2개 해를 가져야 한다. 이 조건을 만족시키는 값은 $a=6$, $b=3$ 이다. 따라서 함수는 $y=|6\sin 2x+3|$ 이다.
이제 $|6\sin 2x+3|=t$ 를 풀면 $\sin 2x=\frac{t-3}{6}$ 또는 $\sin 2x=\frac{-t-3}{6}$ 이다. $3<t<9$ 에서는 첫 번째 식만 해를 4개 갖고 두 번째 식은 해가 없으므로 $f(t)=4$ 이다. 따라서 구하는 범위는 $3<t<9$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(f(3)=7\)에서 조각별 계수 \(a=6,b=3\), 조건 \(f(t)=4\)의 해 범위 \(3<t<9\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수와 로그` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">두 실수 $a, b$에 대하여 $7^{a+b}=16$, $7^{a-b}=4$일 때, $\log_7 8^{\frac{a+b}{ab}}$의 값을 구하시오. [10]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `4`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$7^{a+b}=16$, $7^{a-b}=4$ 이므로 $a+b=\log_7 16$, $a-b=\log_7 4$ 이다. 두 식을 더하면 $2a=\log_7 64$ 이므로 $a=\log_7 8$ 이고, 두 식을 빼면 $2b=\log_7 4$ 이므로 $b=\log_7 2$ 이다. 따라서 $\frac{a+b}{ab} = \frac{\log_7 16}{(\log_7 8)(\log_7 2)} = \frac{4\log_7 2}{3(\log_7 2)^2} = \frac{4}{3\log_7 2}$ 이다. 그러므로 $\log_7 8^{\frac{a+b}{ab}} = \frac{a+b}{ab}\cdot\log_7 8 = \frac{4}{3\log_7 2}\cdot 3\log_7 2 = 4$ 이다.
```

- **독립 판정·핵심 연결/검산:** \(a=\log_7 8=3\log_7 2\), \(b=\log_7 2\)이므로 \(\log_7 8^{(a+b)/(ab)}=4\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `a86caae62dbecd956f1074e38b21beb833638861`
- 문항 단원/과정: `지수함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
<div class="box">$a>2$인 실수 $a$에 대하여 기울기가 $-1$인 직선이 두 곡선 $y=a^{x-3}$, $y=\log_a(x-3)$과 만나는 점을 각각 A, B라 하자. 점 C(3, 0)에 대하여 삼각형 ABC의 넓이가 10이고 선분 AB의 중점의 $x$좌표가 $\frac{11}{2}$일 때, $a$의 값을 구하시오. [10]</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\frac{81}{4}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
좌표를 평행이동하여 u=x-3이라 두면 두 곡선은 y=a^u, y=log_a u이고, 직선은 y=8-u이다. 두 곡선의 교점은 (u,v)와 (v,u)의 형태로 대응하므로 주어진 중점 x좌표 11/2에서 u+v=5, 즉 직선은 y=-x+8이다.

삼각형의 두 교점을 A=(u+3,5-u), B=(8-u,u)라 하고 C=(3,0)이라 하자. 넓이 조건에서 1/2 |det(A-C,B-C)| = 1/2 |u^2-(5-u)^2| = 10이다.

이므로 |10u-25|=20이다. 따라서 u=1/2 또는 9/2이다. a>2이고 A가 y=a^u 위에 있어야 하므로 u=1/2를 선택한다. 이때 A=(7/2,9/2)이고 a^{1/2}=9/2이므로 a=81/4이다.

따라서 구하는 값은 $\frac{81}{4}$이다.
```

- **독립 판정·핵심 연결/검산:** 역함수 두 교점의 좌표를 (u,v),(v,u)로 두면 u+v=5. 기울기 −1과 넓이10에서 두 좌표 차4; \(a>2\)로 \(u=1/2,v=9/2\)를 정하고 \(a^{1/2}=9/2\), \(a=81/4\). 기존 행렬식 풀이 대신 고교 기하 풀이로 보강.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 좌표를 \(x\)축 방향으로 3만큼 왼쪽으로 평행이동하고 \(u=x-3\)으로 쓰면 두 그래프는 \(y=a^u\), \(y=\log_a u\)이다. 두 그래프는 서로 역함수이므로 직선 \(y=u\)에 대칭이다. 기울기 \(-1\)인 직선도 이 대칭에 의해 자기 자신으로 겹친다. 따라서 그 직선의 두 교점은 \((u,v)\), \((v,u)\)로 좌표가 바뀐 한 쌍이다.
2. 원래 좌표의 두 점은 \(A=(3+u,v)\), \(B=(3+v,u)\)이다. 중점의 \(x\)좌표가 \(11/2\)이므로 \(\{(3+u)+(3+v)\}/2=11/2\), 즉 **\(u+v=5\)**이다. 평행이동한 좌표에서 교점이 지나는 직선은 \(u+y=5\)이다.
3. 선분 \(AB\)는 기울기 \(-1\)이므로 길이가 \(\sqrt2|v-u|\)이다. \(C=(3,0)\)은 평행이동한 좌표에서는 원점 \((0,0)\)이고, 원점에서 직선 \(u+y=5\)까지의 거리는 \(5/\sqrt2\)이다. 따라서 삼각형 넓이는
   \[
   10=\frac12\times\sqrt2|v-u|\times\frac5{\sqrt2}
      =\frac52|v-u|.
   \]
   그러므로 **\(|v-u|=4\)**이다. (행렬식 없이 밑변×높이 공식만 사용.)
4. \(u+v=5\), \(|v-u|=4\)에서 두 수는 \(1/2,9/2\)이다. 지수곡선의 교점 \(A=(3+u,v)\)에는 \(v=a^u\)가 성립한다. \(a>2\)이므로 \(u>0\)에서 \(v>1\). 따라서 \(u=1/2\), \(v=9/2\)가 맞고, 그 반대는 불가능하다.
5. \(a^{1/2}=9/2\)이므로 **\(a=81/4\)**. 역로그에 다시 대입해 \(\log_a(9/2)=1/2\)도 확인된다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 21/21; 문항별 원문·정답·기존 해설·조건·이미지 링크와 구체적 계산 위에 기록.
- **UPGRADE 전체 초안**: 1개 완성 (원본 학생용 JS에는 미반영).
- **HOLD**: 0개 (없음). HOLD는 승인 또는 신뢰 가능한 출제 원문이 확인될 때까지 상향 배포하지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 실제 UI 학생 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **심층 감사 MD의 작성 완료는 출고 통과를 뜻하지 않는다.**
- **후속**: HOLD 원문 재확인 및 개선 해설 이관 전에 별도 검증 게이트를 진행.

