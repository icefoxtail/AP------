# 2024 24_순천고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_순천고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_순천고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 22 · UPGRADE 1 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `8`
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

- `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q13.png` — Git blob `0cc698eff32a9a2551d499689964cb78caa93e78`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q17.png` — Git blob `5431fd0009910033b5729f5df2debfbacc552478`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q19.png` — Git blob `c356aaba1246dc4316ebb8ce9d0c03d1ff29b6bb`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `solutionImage` 보조 해설 자산: 6개 GitHub 취득·Git blob 존재 검증. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q11 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q11-solution-v2.svg` — `586bb42754fb575a8fb31ba8e569cb36c1a23618`
  - Q13 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q13-solution.svg` — `eaf4bbdf127ed40e868b9673200e31246cbdbea0`
  - Q17 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q17-solution.svg` — `b0dbb1ecd1d4bc824013c11ed167ca82dae85c10`
  - Q18 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q18-solution-v2.svg` — `6bc416af18ccd4cb5377e506dd30611ba41e4ebc`
  - Q20 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q20-solution-v2.svg` — `61273a4793c080547dc0729bee0acc73edee0962`
  - Q24 `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q24-solution-v2.svg` — `6c143ca3ef152ba30e48f7440218ccc76eac3a16`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 옳지않은 것을 고르시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2^4 \times 4^{\frac{3}{2}} = 128$
$(\sqrt{2}^{1+\sqrt{2}})^{1-\sqrt{2}} = \frac{\sqrt{2}}{2}$
$\sqrt[3]{(-3)^3} + \sqrt[6]{(-6)^6} = -9$
$\sqrt{\sqrt[4]{64}} = 2^{\frac{3}{4}}$
$(4^{\frac{1}{3}})^6 = 16$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각 보기의 값을 계산한다.
① $2^4\times4^{\frac32}=16\times8=128$이므로 옳다.
② $(\sqrt2)^{(1+\sqrt2)(1-\sqrt2)}=(\sqrt2)^{-1}=\frac{\sqrt2}{2}$이므로 옳다.
③ $\sqrt[3]{(-3)^3}+\sqrt[6]{(-6)^6}=-3+6=3$이다. $-9$가 아니므로 옳지 않다.
④ $\sqrt{\sqrt[4]{64}}=64^{\frac18}=2^{\frac34}$이므로 옳다.
⑤ $(4^{\frac13})^6=4^2=16$이므로 옳다.
따라서 옳지 않은 것은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(\sqrt[3]{(-3)^3}+\sqrt[6]{(-6)^6}=-3+6=3\)인데 ③은 −9로 표시해 유일한 오답.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$a^{2x} = 3$일 때, $\frac{a^{3x}-a^{-3x}}{a^x-a^{-x}}$의 값은? (단, $a>0$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
4
$\frac{13}{3}$
$\frac{14}{3}$
5
$\frac{16}{3}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$t=a^x$라 두면 $t>0$, $t^2=a^{2x}=3$이다.
분모는 $t-t^{-1}$이고 $t^2=3$이므로 0이 아니다.
$a^{3x}=t^3$, $a^{-3x}=t^{-3}$이므로
$\frac{t^3-t^{-3}}{t-t^{-1}}=t^2+1+t^{-2}$이다.
$t^2=3$, $t^{-2}=\frac13$을 대입하면
$3+1+\frac13=\frac{13}{3}$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(t=a^x>0,t^2=3\). \((t^3-t^{-3})/(t-t^{-1})=t^2+1+t^{-2}=13/3\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 각이 나타내는 동경의 위치가 다른 것은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$210^\circ$
$-840^\circ$
$570^\circ$
$-150^\circ$
$1290^\circ$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각을 $360^\circ$의 정수배를 더하거나 빼어 $0^\circ$ 이상 $360^\circ$ 미만으로 바꾼다.
① $210^\circ$는 $210^\circ$이다.
② $-840^\circ+1080^\circ=240^\circ$이다.
③ $570^\circ-360^\circ=210^\circ$이다.
④ $-150^\circ+360^\circ=210^\circ$이다.
⑤ $1290^\circ-1080^\circ=210^\circ$이다.
②만 동경의 위치가 다르므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** ①③④⑤는 모두 210°, ②의 \(-840^\circ\equiv240^\circ\)만 달라 ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\frac{3}{2}\pi < \theta < 2\pi$에서 $\cos\theta = \frac{4}{5}$일 때, $\tan\theta$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{3}{4}$
$\frac{3}{5}$
$\frac{4}{3}$
$-\frac{3}{5}$
$-\frac{3}{4}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\frac32\pi<\theta<2\pi$이므로 $\theta$는 제4사분면에 있다. 따라서 $\sin\theta<0$이다.
$\sin^2\theta+\cos^2\theta=1$에서
$\sin^2\theta=1-\left(\frac45\right)^2=\frac9{25}$,
$\sin\theta=-\frac35$이다.
따라서 $\tan\theta=\frac{\sin\theta}{\cos\theta}=\frac{-\frac{3}{5}}{\frac{4}{5}}=-\frac34$이므로 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 제4사분면 cos4/5, sin−3/5이므로 tan−3/4, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 상용로그표를 이용하여 $\log 3750 + \log 0.394$의 값을 구하면?

<table class="exam-table" border="1" style="border-collapse: collapse; text-align: center; margin: 12px auto; font-size: 0.9em;">
  <thead>
    <tr style="background-color: #f8f9fa;">
      <th style="padding: 4px 8px;">수</th>
      <th style="padding: 4px 8px;">0</th>
      <th style="padding: 4px 8px;">1</th>
      <th style="padding: 4px 8px;">2</th>
      <th style="padding: 4px 8px;">3</th>
      <th style="padding: 4px 8px;">4</th>
      <th style="padding: 4px 8px;">5</th>
    </tr>
  </thead>
  <tbody>
    <tr><td style="padding: 4px 8px;"><b>3.5</b></td><td style="padding: 4px 8px;">.5441</td><td style="padding: 4px 8px;">.5453</td><td style="padding: 4px 8px;">.5465</td><td style="padding: 4px 8px;">.5478</td><td style="padding: 4px 8px;">.5490</td><td style="padding: 4px 8px;">.5502</td></tr>
    <tr><td style="padding: 4px 8px;"><b>3.6</b></td><td style="padding: 4px 8px;">.5563</td><td style="padding: 4px 8px;">.5575</td><td style="padding: 4px 8px;">.5587</td><td style="padding: 4px 8px;">.5599</td><td style="padding: 4px 8px;">.5611</td><td style="padding: 4px 8px;">.5623</td></tr>
    <tr><td style="padding: 4px 8px;"><b>3.7</b></td><td style="padding: 4px 8px;">.5682</td><td style="padding: 4px 8px;">.5694</td><td style="padding: 4px 8px;">.5705</td><td style="padding: 4px 8px;">.5717</td><td style="padding: 4px 8px;">.5729</td><td style="padding: 4px 8px;">.5740</td></tr>
    <tr><td style="padding: 4px 8px;"><b>3.8</b></td><td style="padding: 4px 8px;">.5798</td><td style="padding: 4px 8px;">.5809</td><td style="padding: 4px 8px;">.5821</td><td style="padding: 4px 8px;">.5832</td><td style="padding: 4px 8px;">.5843</td><td style="padding: 4px 8px;">.5855</td></tr>
    <tr><td style="padding: 4px 8px;"><b>3.9</b></td><td style="padding: 4px 8px;">.5911</td><td style="padding: 4px 8px;">.5922</td><td style="padding: 4px 8px;">.5933</td><td style="padding: 4px 8px;">.5944</td><td style="padding: 4px 8px;">.5955</td><td style="padding: 4px 8px;">.5966</td></tr>
  </tbody>
</table>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2.1695
2.1466
4.1695
3.1695
3.1466
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
표에서 $\log 3.75=0.5740$, $\log 3.94=0.5955$이다.
$3750=3.75\times10^3$, $0.394=3.94\times10^{-1}$이므로
$\log3750=0.5740+3=3.5740$,
$\log0.394=0.5955-1=-0.4045$이다.
따라서 합은 $3.5740-0.4045=3.1695$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 실제 로그표의 \(\log3.75=.5740,\log3.94=.5955\)를 활용하면 \(3.5740-.4045=3.1695\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
이차방정식 $2x^2 - 8\sqrt{2}x - 16 = 0$의 두 근을 $\alpha, \beta$라고 할 때, $\log_2(\alpha+\beta) + \log_2(\alpha-\beta)$의 값을 구하시오. (단, $\alpha+\beta>0, \alpha-\beta>0$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2
$\frac{5}{2}$
3
5
$\frac{11}{2}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
이차방정식을 2로 나누면 $x^2-4\sqrt2x-8=0$이다.
근과 계수의 관계에서 $\alpha+\beta=4\sqrt2$이다.
두 근은
$x=\frac{4\sqrt2\pm\sqrt{(4\sqrt2)^2+32}}2=2\sqrt2\pm4$이다.
조건 $\alpha-\beta>0$에 맞추면 $\alpha=2\sqrt2+4$, $\beta=2\sqrt2-4$이므로 $\alpha-\beta=8$이다.
따라서
$\log_2(\alpha+\beta)+\log_2(\alpha-\beta)=\log_2(4\sqrt2)+\log_2 8=\frac52+3=\frac{11}{2}$이다.
정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 이차방정식 근 합 \(4\sqrt2\), 조건상 차8 → \(\log_2(4\sqrt2)+\log_2 8=11/2\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 로그 값이 정의되기 위한 실수 $x$의 범위를 구하시오.

<div class="quote-box">
$$\log_{2-x}(2x^2-8x+6)$$
</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$x>3$ 또는 $x<1$
$x<1$
$1<x<2$
$2<x<3$
$x>3$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 밑이 양수이고 1이 아니어야 하므로 $2-x>0$, $2-x\ne1$이다. 따라서 $x<2$, $x\ne1$이다.
진수는 양수여야 하므로
$2x^2-8x+6=2(x-1)(x-3)>0$,
즉 $x<1$ 또는 $x>3$이다.
이를 $x<2$, $x\ne1$과 함께 만족시키는 범위는 $x<1$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 로그 진수와 밑 조건의 교집합은 \(x<1\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — HOLD

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 <보기>의 함수의 그래프 중 함수 $y=\log_3 x$의 그래프를 $x$축 또는 $y$축에 대하여 대칭이동하거나 평행이동하여 겹쳐지는 것을 모두 고르면?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄱ, ㄴ
ㄱ, ㄷ
ㄱ, ㄴ, ㄷ
ㄱ, ㄴ, ㄹ
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각 식을 $y=\log_3x$의 그래프와 비교한다.
ㄱ. $y=\log_3(x-1)$은 $y=\log_3x$를 오른쪽으로 1만큼 평행이동한 그래프이다.
ㄴ. $y=\log_3(6x)=\log_3x+\log_36$이므로 위아래 평행이동한 그래프이다.
ㄷ. $y=\log_3x^3=3\log_3x$는 세로 방향으로 늘린 그래프이므로 평행이동 또는 대칭이동만으로 겹쳐지지 않는다.
ㄹ. $y=3^{-(x+2)}$는 지수함수 그래프이므로 로그함수 그래프의 평행이동·대칭이동이 아니다.
따라서 ㄱ, ㄴ을 고른 ②가 정답이다.
```

- **독립 판정·핵심 연결/검산:** **문제 데이터의 <보기> ㄱ·ㄴ·ㄷ·ㄹ 함수식이 실제 누락됨.** 기존 해설에는 네 함수식이 쓰여 있고 해설상 ②를 지지하지만 문제 본문만으로 재현 불가능.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음

#### HOLD — 출제 원문·정답 검증 필요

- **보류 원인 — 문제의 <보기> 본문 누락:** 원본 content는 ‘다음 <보기>의 함수’라고만 쓰였고 ㄱ·ㄴ·ㄷ·ㄹ 함수식이 없다. choices도 ‘ㄱ’, ‘ㄱ, ㄴ’ 같은 조합뿐이다. 따라서 문제·선택지만 읽는 학생은 정답을 결정할 수 없다.
- **교차검산:** 해설에는 ㄱ \(y=\log_3(x-1)\), ㄴ \(y=\log_3(6x)\), ㄷ \(y=\log_3 x^3\), ㄹ \(y=3^{-(x+2)}\)라고 적혀 있다. 이 네 식이 **원문과 일치한다는 확인은 아직 없다.** 해당 식을 가정할 때만 ㄱ·ㄴ이 이동으로 얻어져 답 ②가 타당하다.
- **필요 조치:** 시험지 원문 또는 별도의 신뢰 가능한 이미지에서 실제 <보기> 네 식을 대조한 다음에만 문제 데이터와 해설을 복구한다. 현재는 추정 복원 금지, HOLD.

- 원본 JS/정답키/선지/그림 변경 금지. 확인 전 학생용 해설 자동 승격 금지.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$441^x = 9$, $49^y = 81$일 때, $\frac{1}{x} - \frac{2}{y}$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
1
-1
0
2
-2
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$441^x=9$에서 $x=\log_{441}9$이므로
$\frac1x=\log_9 441=\log_3 21=1+\log_3 7$이다.
$49^y=81$에서 $y=\log_{49}81$이므로
$\frac2y=\frac{2\log 49}{\log81}=\frac{2\cdot2\log7}{4\log3}=\log_3 7$이다.
따라서 $\frac1x-\frac2y=1$이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(1/x=\log_9 441=1+\log_3 7\), \(2/y=\log_3 7\)이므로 차 1, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x \le 3$에서 함수 $y = \log_{\frac{1}{2}} (x^2-2x+a)$은 최솟값 -3을 갖는다. 이때 상수 $a$의 값은? (단, $a>1$이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
5
6
7
8
9
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
밑 $\frac12$가 1보다 작으므로 로그함수는 감소한다. 따라서 로그값의 최솟값은 진수 $x^2-2x+a$가 최댓값일 때 얻는다.
$0\le x\le3$에서 이차식은 위로 볼록하므로 최댓값은 양 끝에서 비교한다.
$x=0$일 때 $a$, $x=3$일 때 $a+3$이므로 최댓값은 $a+3$이다.
$\log_{\frac{1}{2}}(a+3)=-3$에서 $a+3=(\frac{1}{2})^{-3}=8$이다.
따라서 $a=5$이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 밑 \(1/2\)인 로그 감소성 때문에 진수의 최댓값 \(a+3\)이 로그 최솟값 −3에 대응. \(a+3=8\), a5, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음은 함수 $y=-4^{-x-1}+3$의 설명이다.

<div class="quote-box">
<center><b>&lt;보 기&gt;</b></center>
지수함수 $y=-4^{-x-1}+3$의 정의역은 실수 전체집합이며, 치역은 $\{y|y < \fbox{ (ㄱ) }\}$이다. 그래프의 점근선은 $y=\fbox{ (ㄴ) }$이다. 함수 $y=-4^{-x-1}+3$는 함수 $y=4^{-x}$를 $x$축의 방향으로 $\fbox{ (ㄷ) }$만큼 평행이동한 뒤, $x$축 대칭이동을 하고 $y$축의 방향으로 $\fbox{ (ㄹ) }$만큼 평행이동한 그래프 이다.
</div>

$(\text{ㄱ}) + (\text{ㄴ}) + (\text{ㄷ}) + (\text{ㄹ})$의 값을 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2
4
6
8
10
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$4^{-x-1}>0$이므로 $y=-4^{-x-1}+3<3$이다. 정의역은 모든 실수이고 치역은 $y<3$이므로 ㄱ은 3이다.
$-4^{-x-1}+3$의 수평점근선은 $y=3$이므로 ㄴ은 3이다.
$4^{-x-1}$은 $y=4^{-x}$를 왼쪽으로 1만큼 옮긴 것이다. 이어 $x$축 대칭이동을 하고 위로 3만큼 옮겼으므로 ㄷ은 $-1$, ㄹ은 3이다.
합은 $3+3-1+3=8$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(-4^{-x-1}+3\)의 치역 상한3·점근선3·왼쪽1 이동−1·위3 이동으로 3+3−1+3=8, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $x^{x^2+x} = x^6$의 모든 해의 합을 구하시오. (단, $x>0$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
1
0
-1
-3
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$x>0$이므로 양변에 로그를 취해 지수끼리 비교할 수 있다.
$x^{x^2+x}=x^6$에서
$(x^2+x)\log x=6\log x$,
$(x^2+x-6)\log x=0$이다.
$(x-2)(x+3)\log x=0$이므로 $x=1$ 또는 $x=2$이다. $x=-3$은 조건 $x>0$에 맞지 않는다.
모든 해의 합은 $1+2=3$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \((x^2+x-6)\log x=0\)에서 양수 해 1,2를 얻고 합3, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
그림과 같이 반지름의 길이가 $6$이고 중심각의 크기가 $\frac{\pi}{6}$인 부채꼴 $\mathrm{OAB}$가 있다. 선분 $\mathrm{OA}$ 위의 점 $\mathrm{E}$에 대하여 선분 $\mathrm{EA}$를 지름으로 하고 선분 $\mathrm{OB}$에 접하는 반원을 $\mathrm{C}$라고 할 때, 부채꼴 $\mathrm{OAB}$의 넓이를 $T_1$, 색칠된 부분의 넓이를 $T_2$라 할 때, $T_1-T_2$의 값을 구하시오.

<div class="diagram-box"><img src="assets/images/24_순천고_1학기_중간_고2_수학I/q13.png" width="320" /></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{5}{3}\pi - 2\sqrt{3}$
$2\sqrt{3} + \frac{2}{3}\pi$
$\pi$
$2\pi - 2\sqrt{3}$
$3\pi$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
부채꼴의 넓이는
$T_1=\frac12\cdot6^2\cdot\frac\pi6=3\pi$이다.
$OE=x$라 두면 $EA=6-x$이고 반원의 반지름은 $\frac{6-x}{2}$이다. 반원의 중심을 $M$이라 하면 $OM=\frac{OE+OA}{2}=\frac{x+6}{2}$이다.
$OB$는 $OA$와 $\frac\pi6$의 각을 이루고, 반원이 $OB$에 접하므로 중심 $M$에서 $OB$까지의 거리가 반지름과 같다.
그 거리는 $OM\sin\frac\pi6=\frac{x+6}{4}$이므로
$\frac{x+6}{4}=\frac{6-x}{2}$,
$x+6=12-2x$, $x=2$이다. 따라서 반원의 반지름은 2이고 색칠된 부분의 넓이 $T_2$는 $\frac12\pi\cdot2^2=2\pi$이다.
$T_1-T_2=3\pi-2\pi=\pi$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 실물 부채꼴·반원 접선 그림에서 바깥 넓이3π, 반원 반지름2·넓이2π로 차 π, ③.
- 문제 그림: `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q13.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x$에 대한 이차방정식 $x^2-ax-a^2=0$의 두 근이 $\sin\theta$, $\cos\theta$일 때 모든 $a$의 값의 곱은? (단, $a$는 상수)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-1
$-\frac{1}{2}$
$-\frac{1}{3}$
$\frac{1}{3}$
1
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
두 근이 $\sin\theta$, $\cos\theta$이므로 근과 계수의 관계에서
$\sin\theta+\cos\theta=a$, $\sin\theta\cos\theta=-a^2$이다.
$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta$를 쓰면
$a^2=1-2a^2$,
$3a^2=1$이다.
따라서 가능한 $a$는 $\pm\frac1{\sqrt3}$이고 그 곱은 $-\frac13$이다.
정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 근과 계수의 관계에서 \(\sin\theta+\cos\theta=a\), \(\sin\theta\cos\theta=-a^2\); \(3a^2=1\), 두 a의 곱 −1/3, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 집합 $A=\{6, 8, 11\}$, $B=\{-17, 4, 10, 12\}$에 대하여 집합 $C$를 $C=\{x | x^a = b, a \in A, b \in B, x\text{는 실수}\}$라 할 때, 알맞은 설명을 모두 고르시오.

<div class="quote-box">
<center><b>&lt;보 기&gt;</b></center>
ㄱ. $\sqrt[8]{-17} \in C$<br>
ㄴ. 집합 $C$의 원소의 개수는 16개이다.<br>
ㄷ. 집합 $C$의 원소 중 가장 큰 값은 $\sqrt[6]{12}$이다.
</div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
ㄱ. 8은 짝수이므로 $x^8=-17$을 만족하는 실수는 없다. 거짓이다.
ㄴ. 짝수 지수 6, 8에서는 각각 양수 $4,10,12$마다 두 실근이 있으므로 $2\cdot3\cdot2=12$개이다. 홀수 지수 11에서는 네 값 $-17,4,10,12$마다 실근이 하나씩 있으므로 4개이다. 이 근들은 서로 달라 전체 원소는 $12+4=16$개이다. 참이다.
ㄷ. 가장 큰 원소는 양수의 거듭제곱근 중 가장 큰 값이다. 같은 양수에서는 지수가 작을수록 근이 크므로 가장 큰 값은 $\sqrt[6]{12}$이다. 참이다.
따라서 옳은 것은 ㄴ, ㄷ이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 짝수 지수에서 양수 세 진수의 양·음 근 12개, 홀수 11차에서 음수 포함 4개, 중복 없이 총16; 최대 \(\sqrt[6]{12}\), 따라서 ㄴ·ㄷ, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\pi < \theta < \frac{3}{2}\pi$이고 $\tan\theta + \frac{1}{\tan\theta} = 4$라고 하자. 이때, $\sin^3\theta + \cos^3\theta$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{3\sqrt{6}}{4}$
$-\frac{3\sqrt{6}}{4}$
$\frac{3\sqrt{3}}{8}$
$\frac{3\sqrt{6}}{8}$
$-\frac{3\sqrt{6}}{8}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\pi<\theta<\frac32\pi$이므로 $\sin\theta<0$, $\cos\theta<0$이고 $\sin\theta+\cos\theta<0$이다.
$\tan\theta+\frac1{\tan\theta}=\frac{\sin^2\theta+\cos^2\theta}{\sin\theta\cos\theta}=4$이므로 $\sin\theta\cos\theta=\frac14$이다.
$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta=\frac32$이므로 $\sin\theta+\cos\theta=-\frac{\sqrt6}{2}$이다.
따라서
$\sin^3\theta+\cos^3\theta=(\sin\theta+\cos\theta)(1-\sin\theta\cos\theta)=-\frac{\sqrt6}{2}\cdot\frac34=-\frac{3\sqrt6}{8}$이다.
정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 제3사분면 \(\sin\theta\cos\theta=1/4\), \(\sin\theta+\cos\theta=-\sqrt6/2\); 세제곱 합 −3√6/8, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같은 정육면체 $\mathrm{ABCD-EFGH}$의 부피가 $2^5$일 때, 삼각형 $\mathrm{AFC}$의 넓이가 $\sqrt{3} \times 2^{\frac{p}{q}}$이다. 이때 서로소인 두 자연수 $p, q$에 대하여 $10p+q$의 값은?

<div class="diagram-box"><img src="assets/images/24_순천고_1학기_중간_고2_수학I/q17.png" width="280" /></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
43
58
73
88
103
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
정육면체의 모서리 길이를 $s$라 하면 $s^3=2^5$이므로 $s=2^{\frac{5}{3}}$이다.
$AF$, $FC$, $CA$는 각각 정육면체의 한 면의 대각선이므로
$AF=FC=CA=s\sqrt2$이다. 따라서 $\triangle AFC$는 한 변의 길이가 $s\sqrt2$인 정삼각형이다.
삼각형의 넓이는
$\frac{\sqrt3}{4}(s\sqrt2)^2=\frac{\sqrt3}{2}s^2=\sqrt3\cdot2^{\frac{7}{3}}$이다.
따라서 $p=7$, $q=3$이고 $10p+q=73$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 실물 정육면체 그림에서 부피 \(2^5\)이면 한 변 \(2^{5/3}\), 삼각형 AFC의 변 \(2^{5/3}\sqrt2\), 넓이 \(\sqrt3\,2^{7/3}\), 요구값 73, ③.
- 문제 그림: `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q17.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$-7 \le x \le 7$에서 정의된 함수 $f$가 다음 조건을 만족시킨다고 한다.

<div class="quote-box">
(가) $f(x) = \begin{cases} -x+1 & (0 \le x \le 1) \\ -|x-3|+2 & (1 < x < 5) \\ 2x-10 & (5 \le x \le 7) \end{cases}$<br>
(나) 모든 실수 $x$에 대하여 $f(-x) = f(x)$
</div>

$y=f(x)$와 $y=2^{-\frac{x}{3}}$의 교점의 개수를 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
4
5
6
7
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$f$는 짝함수이므로 먼저 $x\ge0$에서 $f(x)$와 $2^{-\frac{x}{3}}$의 교점 수를 센 뒤, 대칭인 음의 쪽을 확인한다.
$0\le x\le1$에서는 $f(x)=1-x$이고 지수함수는 양수이다. $x=0$에서만 만나므로 교점 1개이다.
$1<x<3$에서 $f(x)=x-1$은 증가하고 $2^{-x/3}$은 감소한다. 양 끝에서 두 함수의 대소가 바뀌므로 교점 1개이다.
$3\le x<5$에서 $f(x)=5-x$는 감소하고 지수함수는 감소하지만, 시작점에서는 $f(3)=2>2^{-1}$이고 $x=5$에 가까워지면 $f(x)\to0<2^{-\frac{5}{3}}$이다. 두 그래프는 한 번 만난다.
$5\le x\le7$에서 $f(x)=2x-10$은 증가하고 지수함수는 감소하므로 한 번 만난다. 따라서 양의 쪽에 교점 3개, $x=0$에 1개이다.
$x<0$에서는 $u=-x$라 놓으면 지수함수 값은 $2^{\frac{u}{3}}$이다. $u=3$에서 $f(3)=2=2^{\frac{3}{3}}$이고, $0<u<3$에서는 $f(u)<2^{u/3}$, $u>3$에서는 각 구간에서 두 함수가 다시 만나지 않는다. 음의 쪽 교점은 $x=-3$ 하나이다.
전체 교점 수는 $3+1+1=5$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 짝함수 f와 지수함수의 그래프는 x0·양의 영역 3점·음의 x−3 한 점에서 만나 총5, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같이 함수 $y=2\log_2 x$의 그래프 위의 한 점 $\mathrm{A}$를 지나고 $x$축에 평행한 직선이 함수 $y=2^{x-3}$의 그래프와 만나는 점을 $\mathrm{B}$, 점 $\mathrm{B}$를 지나고 $y$축에 평행한 직선이 함수 $y=2\log_2 x$의 그래프와 만나는 점을 $\mathrm{D}$, 점 $\mathrm{D}$를 지나고 $x$축에 평행한 직선이 함수 $y=2^{x-3}$와 만나는 점을 $\mathrm{C}$라고 하자. $\overline{\mathrm{AB}} = \overline{\mathrm{BD}} = 2$일 때, 사각형 $\mathrm{ABCD}$의 넓이는?

<div class="diagram-box"><img src="assets/images/24_순천고_1학기_중간_고2_수학I/q19.png" width="300" /></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{7}{2}$
3
$\frac{5}{2}$
2
$\frac{3}{2}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
점 $A=(a,2\log_2a)$, $B=(b,2\log_2a)$라 두면 $AB=b-a=2$이다.
$B$가 $y=2^{x-3}$ 위에 있으므로 $2\log_2a=2^{b-3}$이다.
$D$는 $x=b$에서 로그그래프 위의 점이다. $BD=2$이므로 $2\log_2b-2\log_2a=2$,
$\log_2\frac ba=1$에서 $b=2a$이다.
$b=a+2$와 $b=2a$를 풀면 $a=2$, $b=4$이다. 따라서 $A=(2,2)$, $B=(4,2)$, $D=(4,4)$이다.
$C$는 지수그래프에서 $y=4$인 점이므로 $2^{x-3}=4$에서 $C=(5,4)$이다.
사다리꼴 $ABCD$의 평행한 변은 $AB=2$, $DC=5-4=1$이고 높이는 $BD=2$이다.
넓이는 $\frac{2+1}{2}\cdot2=3$이므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q19.png의 계단형 사각형 A(2,2),B(4,2),C(5,4),D(4,4)으로 위·아래 밑변 길이1,2·높이2를 확인해 넓이3, ②.
- 문제 그림: `archive/assets/images/24_순천고_1학기_중간_고2_수학I/q19.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
곡선 $y=5^{x-1}, y=\log_5(x-1), y=\log_{\frac{1}{3}}(x-2)$와 $x$축, $y$축으로 둘러쌓인 영역의 내부 또는 경계에 포함되고 $x$좌표와 $y$좌표가 모두 정수인 점의 개수를 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6개
7개
8개
9개
10개
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
영역에서 정수 $x$좌표가 가능한 값을 먼저 찾는다.
$y=5^{x-1}$은 $x=0$에서 $\frac15$, $x=1$에서 1이다. $y=\log_5(x-1)$은 $x=2$에서 0이고, $y=\log_{\frac{1}{3}}(x-2)$은 $x=3$에서 0이다. 로그 두 그래프는 $2<x<3$에서 만나므로 영역의 정수 $x$좌표는 $0,1,2$뿐이다.
$x=0$에서는 정수 $y$가 0 하나이다.
$x=1$에서는 영역의 경계가 $y=0$과 $y=1$이므로 정수 $y$는 0,1의 2개이다.
$x=2$에서는 $0\le y\le5$이므로 정수 $y$는 0,1,2,3,4,5의 6개이다.
따라서 정수 좌표의 점은 $1+2+6=9$개이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 영역과 x축에 대해 정수 \(x=0,1,2\)에서 각각 y의 가능 개수 1,2,6 → 총9, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서답형 1. (서술형) 다음 부등식을 푸시오.

$$(x+2)^{x^2-20} < (x+2)^{-x^2+6x} \quad (\text{단, } x > -2)$$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$-1<x<5$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
조건 $x>-2$에서 밑 $x+2>0$이다. $x=-1$이면 밑이 1이므로 양변이 같아 부등식을 만족하지 않는다.
$-2<x<-1$이면 $0<x+2<1$이므로 밑이 1보다 작은 거듭제곱의 비교 방향이 바뀐다. $L=x^2-20$, $R=-x^2+6x$라 하면 부등식이 성립하려면 $L>R$이어야 한다.
$L-R=2(x-5)(x+2)$인데, 이 구간에서는 $x-5<0$, $x+2>0$이므로 $L-R<0$이다. 따라서 이 구간에는 해가 없다.
$x>-1$이면 $x+2>1$이므로 지수의 비교 방향이 그대로이다. $L<R$, 즉 $2(x-5)(x+2)<0$에서 $-2<x<5$를 얻는다. 여기에 $x>-1$을 적용하면 $-1<x<5$이다.
따라서 해는 $-1<x<5$이다.
```

- **독립 판정·핵심 연결/검산:** 밑 \(x+2\)가 0과1 사이인 구간과 1 초과인 구간을 나누어 부등호 방향을 비교하면 \(-1<x<5\).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서답형 2. (서술형) $-10 \le x \le 10$에서 다음 부등식

$$\log_{x-2}(2x^2-11x+14) > 2$$

를 만족하는 정수 $x$의 개수를 풀이 과정과 함께 서술하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `5`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 밑 조건에서 $x-2>0$, $x-2\ne1$이다. 진수 조건은
$2x^2-11x+14=(2x-7)(x-2)>0$이다.
밑 조건 $x>2$와 함께 보면 진수 조건은 $x>\frac72$이다. 따라서 밑 $x-2>1$이고 로그함수는 증가한다.
그러므로 부등식은
$2x^2-11x+14>(x-2)^2$와 동치이다.
정리하면 $x^2-7x+10>0$, 즉 $(x-5)(x-2)>0$이다.
이를 $x>\frac72$와 함께 적용하면 $x>5$이다.
$-10\le x\le10$의 정수 중 $x>5$인 것은 $6,7,8,9,10$으로 5개이다.
따라서 정답은 5이다.
```

- **독립 판정·핵심 연결/검산:** 로그의 밑 \(x-2>1\), 진수>0부터 검토한 후 \((x-5)(x-2)>0\)을 적용하면 정수 x6,7,8,9,10 총5.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서답형 3. (서술형) 방사성 물질을 보관하는 곳에는 외부로 방사선 입자가 누출되는 것을 방지하기 위하여 특수 보호막을 설치한다. 어떤 방사선 입자의 20%를 막아주는 보호막을 10장 설치하였을 때, 10장째 보호막을 통과한 방사선 입자의 양은 처음 양의 약 몇 %인지 풀이 과정과 함께 서술하시오. (단, $\log 2 = 0.3010$, $\log 3 = 0.4771$, $\log 1.08 = 0.03$, $\log 6.18 = 0.7910$이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `약 10.8% (약 11%)`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
보호막 한 장을 통과할 때마다 처음 양의 $80\%=0.8$배가 남는다.
10장 뒤 남는 비율은 $0.8^{10}$이므로 처음 양에 대한 백분율은 $100\cdot0.8^{10}\%$이다.
로그를 이용하면
$\log(100\cdot0.8^{10})=2+10(3\log2-1)$
$=2+10(0.9030-1)=1.030$이다.
따라서 백분율은 $10^{1.03}=10\cdot10^{0.03}$이다. 주어진 $\log1.08\approx0.03$을 이용하면 약 $10\cdot1.08=10.8\%$이다.
그러므로 10장째 보호막을 통과한 양은 처음 양의 약 10.8%, 즉 약 11%이다.
```

- **독립 판정·핵심 연결/검산:** 보호막 10장 통과 비율 \(0.8^{10}\), 제공된 상용로그 근삿값으로 약10.8% (약11%).
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — UPGRADE

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `34095e3fb78c49728c4dab8cdaac17a0199ae7e7`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서답형 4. (서술형) 함수 $y=\left(\frac{3}{2}\right)^{x+1}+2$, $y=\left(\frac{3}{2}\right)^{x-2}-1$가 기울기를 $-1$로 하는 직선과 만나는 교점을 각각 $\mathrm{A}, \mathrm{B}$라고 한다. 이때 두 점 $\mathrm{A}, \mathrm{B}$의 중점을 $\left(\frac{5}{2}, a\right)$라고 한다. 원점을 $\mathrm{O}$라고 하며, 삼각형 $\mathrm{OAB}$의 넓이를 $S$라고 할 때, $\frac{2S}{a}$의 값을 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\frac{63}{11}$`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
직선의 방정식을 $y=-x+c$라 하자. $x$좌표의 중점이 $\frac52$이므로 $x_A+x_B=5$이다.
$x_A=u$, $x_B=5-u$라 놓고 두 점이 같은 직선 위에 있음을 이용한다.
$f_1(u)+u=\left(\frac32\right)^{u+1}+u+2$,
$f_2(5-u)+(5-u)=\left(\frac32\right)^{3-u}+4-u$이다.
두 값의 차는 $g(u)=\left(\frac32\right)^{u+1}-\left(\frac32\right)^{3-u}+2u-2$이다. $u$가 커질수록 첫 항은 증가하고 둘째 항의 음수는 증가하며 $2u-2$도 증가하므로 $g$는 증가한다.
$u=1$이면 $g(1)=0$이므로 유일하게 $x_A=1$, $x_B=4$이다. 이에 따라 $c=f_1(1)+1=\frac{17}{4}+1=\frac{21}{4}$이다.
$A=(1,\frac{17}{4})$, $B=(4,\frac54)$이고 중점의 $y$좌표는 $a=\frac{\frac{17}{4}+\frac{5}{4}}{2}=\frac{11}{4}$이다.
$S=\frac12|x_Ay_B-x_By_A|=\frac12|\frac54-17|=\frac{63}{8}$이다.
따라서 $\frac{2S}{a}=\frac{\frac{63}{4}}{\frac{11}{4}}=\fra
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** 중점 x좌표5/2와 기울기 −1로 두 교점 x좌표 1,4를 얻음; A(1,17/4), B(4,5/4), 넓이63/8, 중점 높이 a11/4, \(2S/a=63/11\). 원문 행렬식 넓이 계산을 기하 방식으로 보강.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 두 교점을 지나는 직선을 \(y=-x+c\)로 두자. \(A\)의 \(x\)좌표를 \(u\), 중점의 \(x\)좌표가 \(5/2\)이므로 \(B\)의 \(x\)좌표는 \(5-u\)이다.
2. 각 점에서 \(x+y=c\)이므로
   \[
   \left(\frac32\right)^{u+1}+u+2
   =
   \left(\frac32\right)^{3-u}+4-u.
   \]
   즉 \(\left(\frac32\right)^{u+1}-\left(\frac32\right)^{3-u}+2u-2=0\)이다. \(u\)가 증가하면 첫 항과 \(-(\frac32)^{3-u}\), \(2u-2\)가 모두 엄격하게 증가하므로 왼쪽은 계속 증가한다. 따라서 해가 있다면 유일하다.
3. \(u=1\)을 대입하면 두 지수항이 모두 \((3/2)^2\)로 같아지고 \(2u-2=0\)이므로 성립한다. 유일한 해 \(u=1\)에서 \(x_A=1\), \(x_B=4\).
4. 원래 두 함수에 대입하면
   \[
   A=\left(1,\left(\tfrac32\right)^2+2\right)=\left(1,\tfrac{17}{4}\right),\quad
   B=\left(4,\left(\tfrac32\right)^2-1\right)=\left(4,\tfrac54\right).
   \]
   중점 높이는 \(a=(17/4+5/4)/2=11/4\). 두 점을 잇는 직선은 \(x+y=21/4\)이다.
5. **행렬식을 쓰지 않고 넓이를 계산한다.** \(|AB|=\sqrt{3^2+(-3)^2}=3\sqrt2\). 원점 \(O\)에서 직선 \(x+y=21/4\)에 내린 수선의 길이는 \(21/(4\sqrt2)\)이다. 따라서 \(S=\frac12\cdot3\sqrt2\cdot\frac{21}{4\sqrt2}=63/8\).
6. \(\displaystyle\frac{2S}{a}=\frac{63/4}{11/4}=\boxed{\frac{63}{11}}\). 원본의 계산값을 유지하되 밑변×높이와 증가성만으로 유일성·넓이를 설명했다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 24/24; 문항별 원문·정답·기존 해설·조건·이미지 링크와 구체적 계산 위에 기록.
- **UPGRADE 전체 초안**: 1개 완성 (원본 학생용 JS에는 미반영).
- **HOLD**: 1개 (Q08). HOLD는 승인 또는 신뢰 가능한 출제 원문이 확인될 때까지 상향 배포하지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 실제 UI 학생 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **심층 감사 MD의 작성 완료는 출고 통과를 뜻하지 않는다.**
- **후속**: HOLD 원문 재확인 및 개선 해설 이관 전에 별도 검증 게이트를 진행.

