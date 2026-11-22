# 2024 24_강남여고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_강남여고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `d1749abccb0e5603f257244086cdc78311f146e9`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_강남여고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `25` · actual question/answer/solution read: `25` · KEEP 25 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 전체 풀이 완성, HOLD 원문 확인 대기) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 25문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로만 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

- `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q16.png` — Git blob `71f79da5a41044fbe755188d72c71fd2d7442a55`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q18.png` — Git blob `53bc114643cc0976f2ecfe75f44cead7e02154ea`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q24.png` — Git blob `d7a372f2d233818daf916969c630bb6b7087f79f`; 실물 PNG 실제 화면 판독 및 원문 도식 조건 대조
- `solutionImage` 보조 해설 자산: 9개 GitHub 취득·Git blob 존재 검증. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q09 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q9-solution.svg` — `77bde73fa08e0873a4b954f705ae715800c99426`
  - Q10 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q10-solution.svg` — `06114c8be0bfe41302949c631d8b799584963ab6`
  - Q15 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q15-solution.svg` — `f28231fe711ad124ed20c6e2a3f155102f98aa84`
  - Q16 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q16-solution.svg` — `8d22b6029cf433e354e487ac95f0fad3cf72cee9`
  - Q18 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q18-solution.svg` — `52ad5057bdca8a3c449b814ce5f04232f60214b2`
  - Q19 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q19-solution.svg` — `67a64a4c307294084dc11153323ddcb8e4b6ce73`
  - Q20 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q20-solution.svg` — `ec130b24e3285497022e4ffe69dc5fbeaf6b49e5`
  - Q21 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q21-solution.svg` — `9d5a1de6f4c5c24d8040772d6e90fb42ac84d07b`
  - Q22 `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q22-solution.svg` — `0b05886ad0bbe07cfa762834734a5c1c52eccb4b`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$8^{\frac{2}{3}} \times 2^{-2}$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$1$
$2$
$3$
$4$
$5$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$8^{\frac{2}{3}}=4$이고 $2^{-2}=\frac{1}{4}$이므로
$8^{\frac{2}{3}}\times2^{-2}=4\times1/4=1$이다.
따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(8^{2/3}=4\), \(2^{-2}=1/4\)이므로 곱 1, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_2 a = 3$일 때, 양수 $a$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2$
$4$
$6$
$8$
$10$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 정의에 따라 $\log_2 a=3$이면 $a=2^3$이다.
따라서 $a=8$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(\log_2a=3\)에서 \(a=8\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 옳지 않은 것은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$90^\circ = \frac{\pi}{2}$
$\frac{5}{3}\pi = 150^\circ$
$135^\circ = \frac{3}{4}\pi$
$\frac{2}{9}\pi = 40^\circ$
$-120^\circ = -\frac{2}{3}\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
각도를 도 단위와 라디안 단위로 바꾸어 확인한다.
$\dfrac{5}{3}\pi$는 $\dfrac{5}{3}\times180^\circ=300^\circ$이므로 $150^\circ$와 같지 않다.
나머지는 각각 $90^\circ=\dfrac{\pi}{2}$, $135^\circ=\dfrac{3}{4}\pi$, $\dfrac{2}{9}\pi=40^\circ$, $-120^\circ=-\dfrac{2}{3}\pi$로 옳다.
따라서 옳지 않은 것은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(5\pi/3=300^\circ\)이므로 150°라고 한 진술이 틀림, ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
중심각의 크기가 $\frac{\pi}{3}$이고 호의 길이가 $2\pi$인 부채꼴의 넓이는?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2\pi$
$3\pi$
$4\pi$
$5\pi$
$6\pi$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
부채꼴의 호의 길이는 $r\theta$이므로
$r\cdot\dfrac{\pi}{3}=2\pi$에서 $r=6$이다.
넓이는 $\dfrac12r^2\theta$이므로
$\dfrac12\cdot6^2\cdot\dfrac{\pi}{3}=6\pi$이다.
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 호의 길이·중심각 관계에서 반지름 6, 부채꼴 넓이 \(6\pi\), ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $4^x = \left(\frac{1}{2}\right)^{x-9}$을 만족시키는 실수 $x$의 값은?
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
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
양변을 밑이 $2$인 거듭제곱으로 나타내면
$2^{2x}=2^{-(x-9)}$이다.
밑이 같으므로 $2x=-(x-9)$, 따라서 $3x=9$이고 $x=3$이다.
따라서 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 주어진 지수방정식의 밑을 통일하면 \(x=3\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $\log_2 (2x-1) = 2$를 만족시키는 실수 $x$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$3$
$\frac{5}{2}$
$2$
$\frac{3}{2}$
$1$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 진수 조건은 $2x-1>0$이다.
방정식에서 $2x-1=2^2=4$이므로 $2x=5$, $x=\dfrac52$이다.
이 값은 진수 조건도 만족한다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 로그의 진수조건을 먼저 반영해 풀면 \(x=5/2\), ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 계산 과정에서 처음으로 등호가 성립하지 않는 곳은?

$$32 = 2^5 \underset{\text{①}}{=} (\sqrt{4})^5 \underset{\text{②}}{=} 4^{\frac{5}{2}} \underset{\text{③}}{=} \{(-2)^2\}^{\frac{5}{2}} \underset{\text{④}}{=} (-2)^5 \underset{\text{⑤}}{=} -32$$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
①
②
③
④
⑤
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
앞의 등식들은 $\sqrt4=2$이고 $4^{\frac{5}{2}}=(\sqrt4)^5=32$이므로 성립한다.
또한 ${(-2)^2}^{\frac{5}{2}}=4^{\frac{5}{2}}=32$이다.
하지만 $(-2)^5=-32$이므로 이 등호에서 처음으로 값이 달라진다.
따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 음의 밑을 지수 성질에 그대로 적용한 ④의 등식이 성립하지 않음.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin(-\theta) = \frac{\sqrt{7}}{4}$이고 $\tan\theta > 0$일 때, $\cos(\pi+\theta)$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{3}{4}$
$-\frac{1}{4}$
$0$
$\frac{1}{4}$
$-\frac{3}{4}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin(-\theta)=-\sin\theta=\dfrac{\sqrt7}{4}$이므로 $\sin\theta=-\dfrac{\sqrt7}{4}$이다.
$\tan\theta>0$이고 사인이 음수이므로 코사인도 음수이다. 따라서 $\cos\theta=-\dfrac34$이다.
$\cos(\pi+\theta)=-\cos\theta=\dfrac34$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(\sin\theta<0,\tan\theta>0\)에서 제3사분면, \(\cos(\pi+\theta)=3/4\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
곡선 $y=2^{x-1}+a$의 점근선과 곡선 $y=\log_3 (2x-b)$의 점근선의 교점의 좌표가 $(3, 3)$일 때, 두 상수 $a, b$에 대하여 $a+b$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$5$
$6$
$7$
$8$
$9$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$y=2^{x-1}+a$의 수평점근선은 $y=a$이고, $y=\log_3(2x-b)$의 수직점근선은 $x=\dfrac b2$이다.
두 점근선의 교점이 $(3,3)$이므로 $a=3$, $\dfrac b2=3$에서 $b=6$이다.
따라서 $a+b=9$이고 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 두 그래프의 수평·수직 점근선에서 \(a=3,b=6\), 합 9, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < 2\pi$에서 부등식
$$\sin x + \cos\left(\frac{\pi}{2}-x\right) < 1$$
의 해가 $0 \le x < a$, $b < x < 2\pi$일 때, $a+b$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{3}\pi$
$\frac{1}{2}\pi$
$\frac{2}{3}\pi$
$\pi$
$\frac{3}{2}\pi$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\cos(\dfrac{\pi}{2}-x)=\sin x$이므로 부등식은 $2\sin x<1$이다.
$0\le x<2\pi$에서 $\sin x<\dfrac12$인 범위는
$0\le x<\dfrac{\pi}{6}$ 또는 $\dfrac{5\pi}{6}<x<2\pi$이다.
따라서 $a=\dfrac{\pi}{6}$, $b=\dfrac{5\pi}{6}$이고 $a+b=\pi$이다. 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(2\sin x<1\)의 경계 \(\pi/6,5\pi/6\)로 요구한 각의 합 \(\pi\), ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$$\frac{\sin\left(\frac{\pi}{2}+\theta\right)\tan^2(\pi-\theta)}{\cos\left(\frac{3}{2}\pi-\theta\right)} + \frac{\sin^3\left(\frac{3}{2}\pi+\theta\right)}{\sin\left(\frac{3}{2}\pi-\theta\right)\cos^2\theta} - \frac{\cos\left(\frac{5}{2}\pi+\theta\right)}{\sin\left(\frac{\pi}{2}+\theta\right)}$$
의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$1$
$2$
$0$
$-1$
$-2$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
첫째 항은 $\cos\theta\cdot\tan^2\theta/(-\sin\theta)=-\tan\theta$이다.
둘째 항은 $(-\cos\theta)^3/[(-\cos\theta)\cos^2\theta]=1$이다.
마지막 분수는 $-\tan\theta$이므로 식에서 빼면 $+\tan\theta$가 된다.
전체 값은 $-\tan\theta+1+\tan\theta=1$이다.
따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 삼각비 항등식과 사분면 부호를 차례로 대입한 값이 1, ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
-$64^3$의 $n$제곱근 중에서 정수인 것이 존재하도록 하는 $2$ 이상의 모든 자연수 $n$의 값의 합은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$9$
$12$
$26$
$38$
$39$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
주어진 수는 $-64^3=-2^{18}$이다. 이 수의 $n$제곱근이 정수이려면 음수의 실수 $n$제곱근이 있어야 하므로 $n$은 홀수이고, $2^{\frac{18}{n}}$이 정수여야 하므로 $n$은 $18$의 약수이다.
$2$ 이상인 홀수 약수는 $3,9$이다.
따라서 구하는 합은 $3+9=12$이다. 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(-64=-2^6\)이고 \((-64)^3=-2^{18}\); 조건에 맞는 홀수 지수 3과 9의 합 12, ②.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 $x$와 $2$ 이상의 자연수 $n$에 대하여 $x$의 $n$제곱근 중에서 실수인 것의 개수를 $f_n(x)$라 할 때,
$$f_3\left(\sin\frac{5}{6}\pi\right) + f_4\left(\cos\frac{1}{3}\pi\right) + f_5\left(\tan\frac{2}{3}\pi\right) + f_6\left(\cos\frac{5}{6}\pi\right)$$
의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2$
$3$
$4$
$5$
$6$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin\dfrac{5\pi}{6}=\dfrac12$이므로 $f_3(\dfrac12)=1$이다.
$\cos\dfrac{\pi}{3}=\dfrac12$이므로 양수의 네제곱근은 $2$개여서 $f_4(\dfrac12)=2$이다.
$\tan\dfrac{2\pi}{3}=-\sqrt3$은 음수이므로 홀수 제곱근은 실수 하나여서 $f_5(-\sqrt3)=1$이다.
$\cos\dfrac{5\pi}{6}=-\dfrac{\sqrt3}{2}$의 짝수 제곱근은 실수가 없으므로 $f_6(-\dfrac{\sqrt3}{2})=0$이다.
합은 $1+2+1+0=4$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 실수 \(n\)제곱근의 개수를 홀짝·진수 부호로 분류하면 1+2+1+0=4, ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x$에 대한 이차방정식 $x^2 - 3x + 4a\sin\theta = 0$의 두 근이 $\cos\theta, \tan\theta$일 때, $\frac{1+\sin\theta-\sin^2\theta}{a\cos\theta}$의 값은? (단, $0 < \theta < \frac{\pi}{2}$이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$8$
$9$
$10$
$11$
$12$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
두 근의 합과 곱을 이용하면 $\cos\theta+\tan\theta=3$이고 $\cos\theta\tan\theta=4a\sin\theta$이다.
$\cos\theta\tan\theta=\sin\theta$이며 $\sin\theta>0$이므로 $a=\dfrac14$이다.
$c=\cos\theta$, $s=\sin\theta$라 두면 $c+\dfrac{s}{c}=3$, 즉 $c^2+s=3c$이다.
따라서 분자는 $1+s-s^2=c^2+s=3c$이고 분모는 $a\cos\theta=\dfrac c4$이다.
구하는 값은 $\dfrac{3c}{\frac{c}{4}}=12$이므로 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 삼각방정식의 경계각에서 \(a=1/4\), 요구식 12, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
조류 발전은 빠른 유속을 이용하여 전기를 생산하는 방식으로 어느 조류 발전기는 유속이 $2\,\text{m/s}$ 이상일 때 발전이 가능하다고 한다. 이 조류 발전기가 설치된 어느 지역에서 시각이 $x$시 일 때, 유속을 $f(x)\,\text{m/s}$라고 하면
$$f(x) = 4\sin\frac{\pi}{12}x \quad (0 \le x \le 12)$$
라고 한다. $0$시부터 $12$시까지 조류 발전이 가능한 시간은 몇 시간 동안인가?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$5$
$6$
$7$
$8$
$9$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
발전이 가능한 조건은 $4\sin\dfrac{\pi x}{12}\ge2$, 즉 $\sin\dfrac{\pi x}{12}\ge\dfrac12$이다.
$0\le x\le12$에서 각 $\dfrac{\pi x}{12}$는 $0$부터 $\pi$까지 변하므로 조건은 $\dfrac{\pi}{6}\le\dfrac{\pi x}{12}\le\dfrac{5\pi}6$이다.
따라서 $2\le x\le10$이고 가능한 시간은 $10-2=8$시간이다.
정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 사인함수의 주기·진폭과 해당 구간에서 시간 차 8시간 확인, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림은 이차함수 $y=f(x)$의 그래프와 일차함수 $y=g(x)$의 그래프이다. 부등식
$$\log_{\frac{1}{2}} |f(x)| > \log_{\frac{1}{2}} |g(x)|$$
를 만족시키는 정수 $x$의 개수는?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$16$
$18$
$20$
$22$
$24$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
그림에서 포물선은 꼭짓점 $(0,-4)$를 지나고 $x$절편이 $-8,8$이므로 $f(x)=\dfrac{x^2}{16}-4$이다. 직선은 $x$절편 $-4$와 두 그래프의 교점의 $x$좌표 $16$을 지나므로 $g(x)=\dfrac35x+\dfrac{12}{5}$이다.
밑이 $\dfrac12$인 로그함수는 감소하므로 주어진 부등식은 $0<|f(x)|<|g(x)|$이다. 로그의 진수 조건까지 포함하면 $|f(x)|<|g(x)|$와 $f(x)\ne0$을 함께 확인해야 한다.
$|f(x)|<|g(x)|$는 $(f(x)-g(x))(f(x)+g(x))<0$과 같다. 경계는 $f=g$ 또는 $f=-g$에서 생긴다.
$f=g$의 해는 $x=-\dfrac{32}{5},16$이고, $f=-g$의 해는 $x=\dfrac{-24\pm8\sqrt{19}}5$이다.
$f=-g$의 작은 근을 $r_1=-\dfrac{24+8\sqrt{19}}5$, 큰 근을 $r_3=\dfrac{-24+8\sqrt{19}}5$라 하고, $f=g$의 근을 $r_2=-\dfrac{32}{5}$, $r_4=16$이라 하면 $r_1<r_2<r_3<r_4$이다. 두 이차식 $f-g$, $f+g$는 모두 위로 열린다. 따라서 $f-g<0$인 구간은 $(r_2,r_4)$이고 $f+g<0$인 구간은 $(r_1,r_3)$이
[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** 실물 q16.png에서 포물선 절편 ±8·직선 절편 −4·교점 x16 확인. 감소 밑으로 \(0<|f|<|g|\), 두 구간의 정수 중 x=±8을 제외해 4+12=16, ①.
- 문제 그림: `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q16.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x) = -2^{|x-a|} + a$의 그래프가 $x$축과 두 점 $\mathrm{A, B}$에서 만나고 $\overline{\mathrm{AB}} = 6$이다. 함수 $f(x)$가 $x=p$에서 최댓값 $q$를 가질 때, $p+q$의 값은? (단, $a$는 상수이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$12$
$13$
$14$
$15$
$16$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
그래프가 $x$축과 두 점에서 만나므로 $a>1$이다. 교점에서는 $-2^{|x-a|}+a=0$, 즉 $|x-a|=\log_2a$이므로 두 근은 $a-\log_2a$와 $a+\log_2a$이다. 두 근 사이의 거리가 $6$이므로 $2\log_2a=6$, 따라서 $a=8$이다.
함수는 $x=a$에서 최댓값을 갖는다. 따라서 $p=8$, $q=a-1=7$이다.
그러므로 $p+q=15$이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 영점 \(a\pm\log_2a\) 사이 거리가 6이므로 \(\log_2a=3,a=8\), 최대점 \(p=8,q=7\), 합15, ④.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
그림과 같이 상수 $k$에 대하여 함수 $f(x) = \log_2 (x-1) + k$의 그래프의 점근선이 함수 $g(x) = \log_2 (x+3) + 5$의 그래프와 만나는 점을 $\mathrm{A}$, 점 $\mathrm{A}$를 지나고 기울기가 $-1$인 직선이 함수 $y=f(x)$의 그래프와 만나는 점을 $\mathrm{B}$라 하자. 선분 $\mathrm{AB}$의 길이가 $4\sqrt{2}$일 때, $k$의 값은? (단, $\mathrm{O}$는 원점이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{2}$
$1$
$\frac{3}{2}$
$2$
$\frac{5}{2}$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$f$의 점근선은 $x=1$이다. 이를 $g$에 대입하면 $A=(1,\log_2 4+5)=(1,7)$이다.
기울기 $-1$인 직선에서 두 점 사이 거리가 $4\sqrt2$이므로 좌표 차의 절댓값은 각각 $4$이다. 그림의 교점은 $B=(5,3)$이다.
$B$가 $y=f(x)$ 위에 있으므로 $3=\log_2(5-1)+k=2+k$이다.
따라서 $k=1$이고 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 그림에서 \(f\)의 점근선 x1과 \(g\)의 교점 \(A=(1,7)\), 기울기 −1·거리 \(4\sqrt2\)로 \(B=(5,3)\), \(k=1\), ②.
- 문제 그림: `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q18.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 함수 $f(x) = -a^x + \log_2 a$, $g(x) = a^x - \log_2 a$에 대하여 다음 조건을 만족시킬 때, 양수 $a$의 값은? (단, $a \ne 1$)

<조건>
(가) 두 곡선 $y=f(x)$, $y=g(x)$는 만나지 않는다.
(나) 두 곡선 $y=f(x)$, $y=g(x)$의 두 점근선 사이의 거리는 $8$이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{16}$
$\frac{1}{4}$
$2$
$4$
$16$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
두 곡선이 만나려면 $-a^x+\log_2a=a^x-\log_2a$, 즉 $a^x=\log_2a$인 실수 $x$가 있어야 한다.
$0<a<1$이면 $\log_2a<0$인 반면 $a^x>0$이므로 만날 수 없다. $a>1$이면 $\log_2a>0$이고 지수함수 $a^x$의 치역은 양수 전체이므로 만난다. 따라서 조건 (가)에서 $0<a<1$이다.
두 수평점근선은 $y=\log_2a$와 $y=-\log_2a$이므로 거리는 $-2\log_2a=8$이다. 따라서 $\log_2a=-4$이고 $a=\dfrac1{16}$이다.
정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 지수함수 그래프의 서로 만나지 않는 조건에서 \(0<a<1\); 두 수평 점근선 거리8로 \(a=1/16\), ①.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
곡선 $y=\sin 2x$가 $x$축과 만나는 점과 곡선 $y=\sin 3x$가 $x$축과 만나는 점의 $x$좌표 중 음이 아닌 수를 작은 것부터 차례대로 나열한 것을 $x_1, x_2, x_3, \cdots$이라 하자. $x_4 \le x \le x_8$에서 함수 $y=\cos\frac{2}{3}x$가 $x=a$에서 최댓값을 갖고 $x=b$에서 최솟값을 가질 때, $a+b$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{11}{6}\pi$
$2\pi$
$\frac{13}{6}\pi$
$\frac{7}{3}\pi$
$\frac{5}{2}\pi$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$\sin2x=0$의 음이 아닌 해는 $k\frac{\pi}{2}$이고, $\sin3x=0$의 해는 $k\frac{\pi}{3}$이다. 서로 다른 값을 작은 순서로 나열하면 $0,\frac{\pi}{3},\frac{\pi}{2},\frac{2\pi}{3},\pi,\frac{4\pi}{3},\frac{3\pi}{2},\frac{5\pi}{3}$이므로 $x_4=\frac{2\pi}{3}$, $x_8=\frac{5\pi}{3}$이다.
$y=\cos\frac{2x}{3}$의 각은 이 구간에서 $\frac{4\pi}{9}$부터 $\frac{10\pi}{9}$까지 변한다. 최댓값은 왼쪽 끝 $x=a=\frac{2\pi}{3}$에서, 최솟값은 각이 $\pi$일 때인 $x=b=\frac{3\pi}{2}$에서 갖는다.
따라서 $a+b=\frac{13\pi}{6}$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 정렬된 삼각함수의 영점 \(x_4=2\pi/3,x_8=5\pi/3\), 최댓값·최솟값 구간에서 \(a=2\pi/3,b=3\pi/2\), 합 \(13\pi/6\), ③.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 양수 $a, b$에 대하여 $0 \le x \le 2\pi$에서 정의된 함수 $f(x) = a\sin 2x + b$가 있다. $-a+b \le t \le a+b$인 실수 $t$에 대하여 함수 $y=f(x)$의 그래프와 직선 $y=t$가 만나는 서로 다른 모든 점의 $x$좌표의 합을 $g(t)$라 하자. 함수 $g(t)$가 다음 조건을 만족시킬 때, $ab$의 값은?

<조건>
(가) $g(2) + g(3) = \frac{15}{2}\pi$
(나) 함수 $g(t)$는 $t=10$일 때, 최솟값을 갖는다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$6$
$12$
$18$
$20$
$24$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
함수 $f(x)=a\sin2x+b$에서 $u=\dfrac{t-b}{a}$라 두면 $\sin2x=u$의 해가 교점의 $x$좌표가 된다.
$0<u<1$일 때 네 교점의 $x$좌표의 합은 $3\pi$이고, $-1<u<0$일 때는 $5\pi$이다. $u=0$이면 $x=0,\dfrac{\pi}{2},\pi,\dfrac{3\pi}{2},2\pi$이므로 $g(b)=5\pi$이다.
하한 $u=-1$에서는 두 교점의 합이 $\dfrac{5\pi}{2}$이고, 상한 $u=1$에서는 두 교점의 합이 $\dfrac{3\pi}{2}$이다. 따라서 $g(t)$의 최솟값은 상한 $t=a+b$에서 얻으며, 조건 (나)에서 $a+b=10$이다.
조건 (가)의 합 $\dfrac{15\pi}{2}$는 $\dfrac{5\pi}{2}+5\pi$이어야 하므로 $t=2$ 또는 $t=3$이 하한이어야 한다. 하한이 $3$이면 $t=2$는 정의역 밖이므로 불가능하다. 하한이 $2$일 때 $t=3$이 중심 $b$라면 $b=3$, $a=1$이 되어 $a+b=4$이므로 조건 (나)와 모순이다. 따라서 $b-a=2$이고 $t=3$은 음수 내부값이다.
$a+b=10$, $b-a=2$를 풀면 $a=4$, $b=6$이다. 실제로 $t=3$에서 $u=(3-6)/4=-3/4$이므로 음수 내부이고, 조건 (가)도 만족한다.

[... 이후 원본 source의 solution에 계속]
```

- **독립 판정·핵심 연결/검산:** \(\sin2x\)의 수평선 교점 개수를 높이별로 구분하면 \(a+b=10,b-a=2\), \(a=4,b=6\), 곱24, ⑤.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형1. 원점 $\mathrm{O}$와 점 $\mathrm{P}(-3, 4)$를 지나는 동경 $\mathrm{OP}$가 나타내는 각을 $\theta$라 할 때, $\sin\theta + \cos\theta + \tan\theta = -\frac{q}{p}$이다. 이때, $p+q$의 값을 구하시오. (단, $p$와 $q$는 서로소인 자연수이다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `32`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
$OP=\sqrt{(-3)^2+4^2}=5$이므로 $\sin\theta=\dfrac45$, $\cos\theta=-\dfrac35$, $\tan\theta=-\dfrac43$이다.
따라서 $\sin\theta+\cos\theta+\tan\theta=\dfrac{12-9-20}{15}=-\dfrac{17}{15}$이다.
$p=15$, $q=17$이므로 $p+q=32$이다.
```

- **독립 판정·핵심 연결/검산:** 점 (−3,4)로 반지름5를 만든 뒤 \(\sin=4/5,\cos=-3/5,\tan=-4/3\)의 합 \(-17/15\)에서 요구값 32.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형2. 두 부등식 $\left(\frac{1}{3}\right)^{2x} > \frac{1}{81}$, $8^{x^2+2x-4} \le 4^{x^2+x}$을 모두 만족시키는 정수 $x$의 개수를 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `8`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
첫째 부등식은 밑 $\dfrac13$이 $1$보다 작으므로 지수를 비교할 때 부등호 방향이 바뀌어 $2x<4$, 즉 $x<2$이다.
둘째 부등식의 밑을 $2$로 통일하면 $2^{3(x^2+2x-4)}\le2^{2(x^2+x)}$이다. 따라서 $x^2+4x-12\le0$, 즉 $-6\le x\le2$이다.
두 범위를 함께 만족하는 정수는 $-6,-5,\ldots,1$로 모두 8개이다.
```

- **독립 판정·핵심 연결/검산:** 로그 정의역·부등식 해 \(x<2\)와 \(-6\le x\le2\)의 교집합에서 정수 8개.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형3. 함수 $f(x)=a\cos b(x-\pi)+c$의 그래프가 다음 그림과 같을 때, $f\left(\frac{4}{3}\pi\right)$의 값을 구하시오. (단, $a>0$, $b>0$)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `2`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
그림에서 최댓값은 $3$, 최솟값은 $-1$이므로 진폭은 $a=2$, 중심선은 $y=1$이라서 $c=1$이다. 연속한 두 최솟값이 $x=0$과 $x=2\pi$에 있으므로 주기는 $2\pi$이고 $b=1$이다.
따라서 $f(\dfrac{4\pi}{3})=2\cos(\dfrac{4\pi}{3}-\pi)+1=2\cos\dfrac{\pi}{3}+1=2$이다.
```

- **독립 판정·핵심 연결/검산:** q24.png의 최댓값3·최솟값−1·연속 최솟값 x0,2π로 \(a=2,c=1,b=1\); \(f(4\pi/3)=2\).
- 문제 그림: `archive/assets/images/24_강남여고_1학기_중간_고2_대수/q24.png` (실물 판독 완료)
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q25 — KEEP

- source ordinal/id: `25` / `25`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `d1749abccb0e5603f257244086cdc78311f146e9`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
서술형4. $\log_x (3-x)$의 값이 정의되도록 하는 정수 $x$의 값을 $\alpha$라 할 때, $\log_2 (\alpha^3+8) - \log_2 \alpha^2$의 값을 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `2`
- 기존 `solution` 결정적 실제 발췌 (HTML 그림은 대체 표시, 내용은 source에 보존):

```text
로그의 밑은 양수이고 1이 아니어야 하므로 $x>0$, $x\ne1$이다. 진수 조건은 $3-x>0$, 즉 $x<3$이다.
따라서 이를 만족하는 정수 $x$는 $2$뿐이므로 $\alpha=2$이다.
이를 구하는 식에 대입하면
$\log_2(\alpha^3+8)-\log_2(\alpha^2)=\log_2 16-\log_2 4=4-2=2$이다.
따라서 구하는 값은 $2$이다.
```

- **독립 판정·핵심 연결/검산:** 로그식이 정의되는 자연수 범위를 독립 검산하면 \(x=2\)만 남으므로 정답 2.
- 문제 그림: 별도 `image` 또는 `content` 내 외부 그림 없음
- **KEEP 사유:** 수치·선지·원본 해설의 결론이 위 검산과 일치한다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 25/25; 문항별 원문·정답·기존 해설·조건·이미지 링크와 구체적 계산 위에 기록.
- **UPGRADE 전체 초안**: 0개 완성 (원본 학생용 JS에는 미반영).
- **HOLD**: 0개 (없음). HOLD는 승인 또는 신뢰 가능한 출제 원문이 확인될 때까지 상향 배포하지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 실제 UI 학생 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **심층 감사 MD의 작성 완료는 출고 통과를 뜻하지 않는다.**
- **후속**: HOLD 원문 재확인 및 개선 해설 이관 전에 별도 검증 게이트를 진행.

