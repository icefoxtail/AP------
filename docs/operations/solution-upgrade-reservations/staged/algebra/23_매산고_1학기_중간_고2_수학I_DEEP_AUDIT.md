# 2023 23_매산고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_매산고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_매산고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `20` · actual question/answer/solution read: `20` · KEEP 19 · UPGRADE 1 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 20문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

- `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-b.svg` — Git blob `162a7ce33d64637f759f0c7092cbdf616047925c`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-c.svg` — Git blob `518799c993f99f5db867f810c241bd2644a7e5f0`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-a.svg` — Git blob `092df1fe99b0dc4952b2d5942e978ac72b411c7f`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q14-problem-v2.svg` — Git blob `d4322dbd9444c35c9908d5ad0db0ee10d1dd8685`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `solutionImage` 보조 해설 자산 2개: GitHub 실제 파일과 Git blob 존재 확인. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q18 `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q18-solution-v2.svg` — `b8456d5721a538adb6bdb44348b009974332b516`
  - Q20 `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q20-solution-v2.svg` — `c1121c5d2e6569816b1fb26b42c1ba61c1879916`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$3^4 \times 3^{-3}$의 값은? [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{1}{3^{12}}
\frac{1}{3^8}
\frac{1}{3^4}
\frac{1}{3}
3
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
같은 밑을 곱할 때는 지수를 더한다.
$3^4\times3^{-3}=3^{4+(-3)}$
$=3^1=3$
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 같은 밑 지수 합 \(3^{4-3}=3\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_2 8$의 값은? [3.9점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2
3
4
5
6
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그는 밑을 몇 제곱해야 진수가 되는지를 나타낸다.
$2^3=8$이므로
$\log_2 8=3$이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(2^3=8\)이므로 \(\log_28=3\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin\theta < 0$, $\cos\theta < 0$을 만족시키는 각 $\theta$는 제몇 사분면인가? [4.0점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
제1사분면
제2사분면
제3사분면
제4사분면
제5사분면
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
사인의 부호는 $y$좌표의 부호, 코사인의 부호는 $x$좌표의 부호와 같다.
두 값이 모두 음수이면 $x<0$, $y<0$이다.
따라서 각 $\theta$의 동경은 제3사분면에 있다.
그러므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(\sin\theta,\cos\theta\) 모두 음수이므로 제3사분면, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 $\{x \mid 0 \le x < 2\pi\}$에서 정의된 그래프를 $y = \sin x$, $y = \cos x$, $y = \tan x$ 순서대로 나열하였을 때 옳은 것은? [4.0점]<br>다음 세 그림에 붙인 기호로 각 보기의 순서를 나타냈다.<div class="q04-plot"><b>가</b><br><img src="assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-b.svg" alt="좌표평면에서 양의 높이부터 내려가는 물결곡선을 나타낸다. 가운데에서 가장 낮고 오른쪽으로 다시 높아진다." style="display:block;width:296px;max-width:100%;height:auto"></div><div class="q04-plot"><b>나</b><br><img src="assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-c.svg" alt="좌표평면에서 세 증가 가지를 나타낸다. 두 수직 점근선이 가지를 가르고 첫 가지는 원점에서 시작한다." style="display:block;width:296px;max-width:100%;height:auto"></div><div class="q04-plot"><b>다</b><br><img src="assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-a.svg" alt="좌표평면에서 원점부터 올라가는 물결곡선을 나타낸다. 가운데에서 x축을 지나며 오른쪽 끝까지 이어진다." style="display:block;width:296px;max-width:100%;height:auto"></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
다 · 가 · 나
가 · 다 · 나
가 · 나 · 다
다 · 나 · 가
나 · 가 · 다
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
먼저 $y=\sin x$는 $x=0$에서 $0$으로 시작해 증가한다. $y=\cos x$는 $x=0$에서 $1$로 시작해 감소한다.
$y=\tan x$는 $x=0$에서 $0$이고, $\dfrac{\pi}{2}$와 $\dfrac{3\pi}{2}$에서 점근선을 갖는다. 같은 특징을 가진 그림은 사인, 코사인, 탄젠트의 순서로 다, 가, 나이다.
따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 세 실물 SVG에서 가는 \(x=0\)에서 1로 시작하는 코사인, 나는 점근선 있는 탄젠트, 다는 0에서 증가하는 사인; 순서 다·가·나, ①.
- 문제 그림: `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-b.svg` (실물 판독 완료), `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-c.svg` (실물 판독 완료), `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q04-plot-a.svg` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log 5.1 = 0.7076$일 때, $\log 510$의 값은? [4.1점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-1.2924
-0.2924
0.7076
1.7076
2.7076
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$510=5.1\times100$이므로 로그의 곱셈 성질을 쓴다.
$\log510=\log5.1+\log100$
$=0.7076+2=2.7076$
따라서 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** \(510=5.1\cdot10^2\), \(\log510=.7076+2=2.7076\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_2 5 \times \log_5 10 \times \log_{10} 16$ 의 값을 구하면? [4.1점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
4
5
6
7
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
밑과 진수가 차례로 연결되어 있으므로 밑을 바꾸어 곱한다.
$\log_2 5\times\log_5 10=\log_2 10$
따라서
$\log_2 10\times\log_{10}16=\log_2 16$
$=4$
그러므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(\log_25\log_510\log_{10}16=\log_216=4\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
반지름의 길이가 $3$ 이고 호의 길이가 $2$ 인 부채꼴의 중심각의 크기를 구하면? [4.2점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
\frac{2}{3}
1
\frac{4}{3}
\frac{5}{3}
2
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
호도법에서 부채꼴의 호의 길이와 반지름은 $s=r\theta$의 관계를 만족한다.
$r=3$, $s=2$를 대입하면
$2=3\theta$
$\theta=\dfrac23$ (라디안)이다.
따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 호길이 \(s=r\theta\), 반지름3·호길이2에서 \(\theta=2/3\) 라디안, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\sin\theta + \cos\theta = \frac{2}{3}$일 때, $18\sin\theta\cos\theta$의 값을 구하시오. [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-15
-10
-5
5
10
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
주어진 합을 제곱하면 두 삼각함수의 곱이 나타난다.
$(\sin\theta+\cos\theta)^2=\dfrac49$
$1+2\sin\theta\cos\theta=\dfrac49$
$2\sin\theta\cos\theta=-\dfrac59$
따라서
$18\sin\theta\cos\theta=9\left(2\sin\theta\cos\theta\right)=-5$
그러므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \((\sin+\cos)^2=4/9=1+2\sin\cos\)이므로 \(18\sin\cos=-5\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = \frac{1}{2}\cos 2\left(x - \frac{\pi}{3}\right) + 1$의 주기를 $a$, 최댓값을 $M$, 최솟값을 $m$이라 할 때, $a \times M \times m$ 값을 구하면? [4.3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-\frac{1}{4}\pi
\frac{1}{4}\pi
\frac{1}{2}\pi
\frac{3}{4}\pi
\pi
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y=\dfrac12\cos 2(x-\dfrac\pi3)+1$에서 각의 계수는 $2$이므로 주기는
$a=\dfrac{2\pi}{2}=\pi$이다.
코사인값의 범위가 $-1\le\cos(\cdots)\le1$이므로
$\dfrac12(-1)+1\le y\le\dfrac12(1)+1$
따라서 $m=\dfrac12$, $M=\dfrac32$이다.
$aMm=\pi\times\dfrac32\times\dfrac12=\dfrac{3\pi}{4}$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 코사인 각 계수2로 주기 \(\pi\), 최대3/2·최소1/2, 곱 \(3\pi/4\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid -1 \le x \le 2\}$일 때, 함수 $y = 3^{x-1} - 1$의 최댓값과 최솟값을 각각 $M$, $m$이라 할 때, $9(M+m)$의 값을 구하면? [4.4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6
7
8
9
10
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
밑이 $3>1$이므로 $y=3^{x-1}-1$은 증가함수이다.
따라서 $-1\le x\le2$에서
$M=3^{2-1}-1=2$
$m=3^{-1-1}-1=\dfrac19-1=-\dfrac89$이다.
그러므로 $9(M+m)=9(2-\dfrac89)=10$이고 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 지수함수 증가, \(M=2,m=-8/9\), \(9(M+m)=10\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$3 \le n \le 8$ 인 자연수 $n$과 $|m| \le 3$ 인 정수 $m$에 대하여 $m$의 $n$제곱근 중 실수인 것의 개수를 $f(m, n)$이라 할 때, $f(m, n)=1$을 만족하는 모든 순서쌍 $(m, n)$ 개수를 구하면? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
22
23
24
25
26
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$m=0$이면 $n$이 어느 값이든 실수인 $n$제곱근은 $0$ 하나이다.
$m>0$일 때는 $n$이 홀수이면 실근이 하나, 짝수이면 $\pm\sqrt[n]{m}$ 두 개이다.
$m<0$일 때는 $n$이 홀수이면 실근이 하나, 짝수이면 실근이 없다.
$3\le n\le8$에는 홀수 $n$이 3개, 짝수 $n$이 3개 있다. 홀수 $n$마다 가능한 $m=-3,-2,-1,0,1,2,3$이 모두 한 개씩 기여하여 $7\times3=21$개이다. 짝수 $n$에는 $m=0$만 한 개이므로 $3$개이다.
합은 $21+3=24$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 홀수 차수 \(n=3,5,7\)마다 \(m=-3,\ldots,3\) 7개씩, 짝수 \(n=4,6,8\)은 \(m=0\) 한 개씩; 총24, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$k > 0$ 인 실수 $k$에 대하여 두 함수 $y = \log_2(x-k)$ 와 $y = \log_2(-x-k)$의 그래프가 $y=2$의 그래프와 만나는 두 교점을 각각 $\mathrm{A}, \mathrm{B}$라 하자. $\overline{\mathrm{AB}} = 16$일 때, 실수 $k$의 값을 구하면? [4.6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
4
5
6
7
8
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y=\log_2(x-k)$가 $y=2$와 만나는 점 A에서는
$\log_2(x-k)=2$이므로 $x-k=4$, $x_A=k+4$이다.
점 B에서는
$\log_2(-x-k)=2$이므로 $-x-k=4$, $x_B=-k-4$이다.
두 점의 y좌표는 모두 $2$이므로
$\overline{AB}=x_A-x_B=(k+4)-(-k-4)=2k+8$이다.
$2k+8=16$에서 $k=4$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 교점의 x좌표는 \(k+4,-k-4\). 거리 \(2k+8=16\)에서 \(k=4\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
자연수 $n$에 대하여 $\log_4 \frac{2n^3}{\sqrt{n}}$의 값이 $50$ 이하의 자연수가 되도록 하는 자연수 $n$의 개수를 구하면? [4.8점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
9
10
11
12
13
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그값을 $k$라 두면 $k$는 $1$ 이상 $50$ 이하의 자연수이다.
$\log_4\dfrac{2n^3}{\sqrt n}=k$에서
$2n^{\frac{5}{2}}=4^k$
$n^5=2^{4k-2}$이다.
$n$이 자연수이려면 $n=2^t$ ($t$는 자연수)이어야 하므로
$5t=4k-2$이다.
이를 5로 나눈 나머지를 비교하면 $4k\equiv2\pmod5$, 즉 $k\equiv3\pmod5$이다.
$1\le k\le50$에서 가능한 값은 $3,8,13,18,23,28,33,38,43,48$로 10개이다.
따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 로그값 \(k\in\{1,\ldots,50\}\)에서 \(n^5=2^{4k-2}\), \(k\equiv3\pmod5\), \(k=3,8,\ldots,48\)의 10개, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x) = \sin\pi x\,(x \ge 0)$의 그래프와 직선 $y = \frac{4}{5}$이 만나는 점의 $x$좌표를 작은 것부터 차례로 $x_1, x_2, x_3, x_4, x_5$ 라 할 때, $f(x_1 + 2x_2 + 3x_3 + 4x_4 + 3x_5)$ 의 값은? [4.9점]<br>그림은 오른쪽으로 이어지는 그래프의 앞부분을 나타낸다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-1
-\frac{4}{5}
0
\frac{4}{5}
1
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$0<\alpha<\dfrac12$이고 $\sin(\pi\alpha)=\dfrac45$라 하자. 주기 2인 그래프에서 직선 $y=\dfrac45$와의 첫 다섯 교점은
$x_1=\alpha,\quad x_2=1-\alpha,\quad x_3=2+\alpha,\quad x_4=3-\alpha,\quad x_5=4+\alpha$이다.
가중합을 정리하면
$x_1+2x_2+3x_3+4x_4+3x_5=32+\alpha$이다.
따라서
$f(x_1+2x_2+3x_3+4x_4+3x_5)=\sin(32\pi+\pi\alpha)$
$=\sin(\pi\alpha)=\dfrac45$이다.
그러므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 실물 사인 q14.svg의 첫 다섯 교점은 \(\alpha,1-\alpha,2+\alpha,3-\alpha,4+\alpha\); 가중합 \(32+\alpha\), 따라서 함수값 \(4/5\), ④.
- 문제 그림: `archive/assets/images/23_매산고_1학기_중간_고2_수학I/q14-problem-v2.svg` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식
$$\log_2(2-x)^2 - \log_{\sqrt{2}}(10-2x) \le 0$$
을 만족시키는 자연수 $x$의 값의 합을 구하면? [5.0점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
8
9
10
11
12
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 로그의 진수 조건은 $(2-x)^2>0$이므로 $x\ne2$이고, 둘째는 $10-2x>0$이므로 $x<5$이다.
$\log_{\sqrt2}(10-2x)=2\log_2(10-2x)$이므로 부등식은
$\log_2\dfrac{(2-x)^2}{(10-2x)^2}\le0$
과 같다. 밑 $2>1$에서 이는
$\dfrac{(2-x)^2}{(10-2x)^2}\le1$, 즉 $|2-x|\le10-2x$이다.
자연수 $x$를 확인한다. $x=1$은 만족하고 $x=2$는 진수 조건에서 제외된다. $x>2$이면 $x-2\le10-2x$에서 $x\le4$이므로 $x=3,4$가 만족한다.
가능한 자연수는 $1,3,4$이고 합은 $8$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 밑·진수조건 \(x\ne2,x<5\). 비교 \(|2-x|\le10-2x\)에서 자연수 \(x=1,3,4\), 합8, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
81의 네제곱근 중 실근을 모두 구하시오. [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$-3, 3$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
네제곱근은 $x^4=81$을 만족하는 실수 $x$이다.
$81=3^4$이므로
$x^4=3^4$
$|x|=3$이다.
따라서 실근은 $x=-3,3$이다.
```

- **독립 판정·핵심 연결/검산:** \(x^4=81=3^4\)에서 실수 네제곱근 \(-3,3\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 두 양수 $a, b$에 대하여 $\log a = k\log b$ 이고 $\log_b a^2 + \log_a b^4 = 9$ 을 만족시키는 모든 실수 $k$ 값의 합을 구하시오. [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\dfrac92$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$1$이 아닌 양수 $a,b$이므로 $\log b\ne0$이고 $t=\log_ba=\dfrac{\log a}{\log b}=k$로 둘 수 있다. $t\ne0$이다.
로그 밑 변환으로
$\log_ba^2=2t,\qquad \log_ab^4=\dfrac4t$이다.
따라서
$2t+\dfrac4t=9$
$2t^2-9t+4=0$
$(2t-1)(t-4)=0$이므로 $t=\dfrac12$ 또는 $4$이다.
모든 $k$의 합은 $\dfrac12+4=\dfrac92$이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\log_ba=k\ne0\), \(2t+4/t=9\)의 근 \(t=1/2,4\) 합9/2.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
제 1사분면 위의 점 $\mathrm{A}$의 $x$축 위로의 수선의 발은 점 $\mathrm{B}(1, 0)$이고, 함수 $f(x)=\log_a x\,(a > 1)$ 그래프 위의 한 점 $\mathrm{C}$에 대하여 $\overline{\mathrm{AB}}=\overline{\mathrm{AC}}$ 를 만족한다. 두 점 $\mathrm{B}, \mathrm{C}$의 중점이 $\mathrm{M}$이고 $\overline{\mathrm{AM}}=2$, $\overline{\mathrm{AB}}=4$ 일 때, $a^{12}$ 의 값을 구하시오. [6점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$13+4\sqrt3$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
점 B가 $(1,0)$이고 A는 x축 위로 길이 $4$만큼 떨어져 있으므로 $A=(1,4)$이다.
$AB=AC$이고 M은 BC의 중점이므로 이등변삼각형의 꼭짓점에서 그은 중선 $AM$은 $BC$에 수직이다. 직각삼각형 $ABM$에서
$BM=\sqrt{AB^2-AM^2}=\sqrt{4^2-2^2}=2\sqrt3$이다.
$M=(u,v)$라 두면 $AM=2$, $BM=2\sqrt3$에서
$(u-1)^2+(v-4)^2=4,\qquad (u-1)^2+v^2=12$이다. 두 식을 빼면 $8v-16=8$이므로 $v=3$이고, 다시 대입하면 $(u-1)^2=3$이다.
따라서 $M=(1\pm\sqrt3,3)$이고 $C=2M-B=(1\pm2\sqrt3,6)$이다. C는 $y=\log_a x$ 위에 있고 $a>1$, $y_C=6>0$이므로 $x_C>1$이다. 따라서 $C=(1+2\sqrt3,6)$이다.
$6=\log_a(1+2\sqrt3)$에서 $a^6=1+2\sqrt3$이다.
$a^{12}=(1+2\sqrt3)^2=13+4\sqrt3$이다.
```

- **독립 판정·핵심 연결/검산:** 삼각형 ABM의 직각 관계로 \(M=(1\pm\sqrt3,3)\), 로그함수 \(a>1\) 조건에서 \(C=(1+2\sqrt3,6)\). \(a^6=1+2\sqrt3\), 제곱 \(13+4\sqrt3\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$10 \le n \le 99$ 에서 존재하는 자연수 $n$과 $1 \le x \le n$ 에서 존재하는 $x$에 대하여 방정식 $\sin\frac{x\pi}{2} = 0$ 을 만족하는 서로 다른 실근의 개수를 $f(n)$이라 하고 연립방정식
$$\begin{cases} \sin\frac{x\pi}{2} = 0 \\ \cos\frac{x\pi}{2} = -1 \end{cases}$$
을 만족하는 서로 다른 실근의 개수를 $g(n)$이라 하자. $f(n) = 2g(n)$일 때, 자연수 $n$값의 최댓값을 서술하시오. [10점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$97$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$\sin\dfrac{x\pi}{2}=0$이면 $x=2k$ ($k$는 양의 정수)이다. 따라서
$f(n)=\left\lfloor\dfrac n2\right\rfloor$이다.
연립방정식에서는 $x=2k$에 대해 $\cos(k\pi)=-1$이어야 하므로 $k$가 홀수이다. 즉 $x=2,6,10,\ldots$이고
$g(n)=\left\lfloor\dfrac{n+2}{4}\right\rfloor$이다.
$n=4q,4q+1,4q+2,4q+3$으로 나누면 앞의 두 경우에만 $f(n)=2g(n)$이 성립한다.
$10\le n\le99$에서 이 조건을 만족하는 가장 큰 자연수는 $97$이다.
```

- **독립 판정·핵심 연결/검산:** 사인근 \(x=2,4,\ldots\), 동시 코사인 조건 \(x=2,6,10,\ldots\); \(n\bmod4\)가 0·1인 경우만 \(f=2g\), 범위 10–99에서 최대97.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — UPGRADE

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2a978c62991e79730d62bb3ff72ea6c7e9670b7b`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
점 $(0, 0)$을 지나는 $y = a\cos(bx+c)$의 그래프 일부분과 $x$축에 평행한 직선 $l$이 제 1사분면에서 만나는 두 점의 $x$좌표가 $4, 12$이다. 네 직선 $l, x=4, x=12, y=0$으로 둘러싸인 영역의 넓이가 $16\sqrt{2}$일 때, 세 양수 $a, b, c$의 곱 $abc$의 최솟값을 서술하시오. [10점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `$\dfrac{3\pi^2}{8}$`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
네 직선으로 둘러싸인 부분은 가로 길이 $12-4=8$인 직사각형이다. 높이를 $h$라 하면
$8h=16\sqrt2$, 따라서 $h=2\sqrt2$이다.
그래프가 원점을 지나고 $a>0$이므로 $a\cos c=0$, 즉 $c=\dfrac{(2m+1)\pi}{2}$ ($m$은 음이 아닌 정수)이다.
$x=4,12$에서 함수값이 같으므로 위상 $u=c+4b$, $v=c+12b$는 $\cos u=\cos v$를 만족한다. $u-v=2r\pi$인 가지라면 $8b$가 $2\pi$의 배수이고 $\cos(c+4b)=0$이 되어 $h>0$과 모순이다. 따라서 $u+v=2r\pi$, 즉 $c+8b=r\pi$이다.
$k=r-m$이라 두면 $b=\dfrac{(2k-1)\pi}{16}$ ($k$는 양의 정수)이다. 그러면 $|\cos4b|=\dfrac{\sqrt2}{2}$이고 양의 높이 조건에서 $a=\dfrac{2\sqrt2}{|\cos4b|}=4$이다.
$k=1$일 때 가능한 가장 작은 양의 $c$는 $\dfrac{3\pi}{2}$이고, $b=\dfrac\pi{16}$이다. 이때 그래프는 $0<x<16$에서 양수이며 $x=4,12$에서 각각 $2\sqrt2$가 된다.
$k\ge2$이면 $b\ge\dfrac{3\pi}{16}$이고 $c\ge\dfrac\pi2$이므로
$abc=4bc\ge4\cdot\dfrac{3\pi}{16}\cdot\dfrac\pi2=
[... 원본 solution 계속]
```

- **독립 판정·핵심 연결/검산:** 원점 통과로 \(c\)는 양의 홀수 \(\pi/2\), 높이 \(16\sqrt2/8=2\sqrt2\); 두 x에서 같은 양의 값의 위상 합으로 \(b=(2k-1)\pi/16\), \(a=4\). 최소 유효 조합 \(b=\pi/16,c=3\pi/2\)에서 \(abc=3\pi^2/8\), 1사분면 부호·나머지 경우 검증 보강.
- 문제 그림: 별도 문제 그림 없음

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 두 교점의 \(x\)좌표가 4, 12이고 두 점 모두 제1사분면의 직선 \(l\) 위에 있으므로 \(l\)의 높이 \(h>0\)이다. 넓이 조건에서 \((12-4)h=16\sqrt2\), 따라서 **\(h=2\sqrt2\)**이다.
2. \(a\cos(b\cdot0+c)=0\)이고 \(a>0,c>0\)이므로 \(\cos c=0\). 곧
   \[
   c=\frac{(2m+1)\pi}{2}\qquad(m=0,1,2,\ldots).
   \]
3. 두 교점의 높이가 같으므로 \(\cos(c+4b)=\cos(c+12b)\). 코사인값이 같으려면 두 각의 차가 \(2r\pi\)이거나 합이 \(2r\pi\)이다.
   - 차가 \(2r\pi\)인 경우 \(8b=2r\pi\), 즉 \(4b=r\pi\)라서 \(\cos(c+4b)=0\). 그런데 높이는 \(2\sqrt2>0\)이므로 **불가능**.
   - 따라서 각의 합이 \(2r\pi\), \(2c+16b=2r\pi\), 즉 \(c+8b=r\pi\)이어야 한다.
4. \(c=(2m+1)\pi/2\)를 대입하고 \(k=r-m\)으로 쓰면
   \[
   b=\frac{(2k-1)\pi}{16},\qquad k=1,2,3,\ldots
   \]
   이다. \(x=4\)에서의 위상은 \(c+4b=(4m+2k+1)\pi/4\)이고, 그 코사인 절댓값은 항상 \(\sqrt2/2\). 그러므로 \(a\cdot(\sqrt2/2)=2\sqrt2\)에서 **\(a=4\)**이다. 다만 코사인값 자체가 **양수인 경우만** 실제 조건에 맞는다.
5. \(k=1\)이면 \(b=\pi/16\)으로 가능한 가장 작은 값이다. \(m=0\), \(c=\pi/2\)에서는 \(x=4\)의 코사인값이 \(\cos3\pi/4<0\)이어서 탈락한다. \(m=1\), \(c=3\pi/2\)에서는 \(\cos7\pi/4=\sqrt2/2>0\)이고 \(x=12\)에서도 높이 \(2\sqrt2\)이므로 **가능**하다. 이때
   \[
   abc=4\cdot\frac{\pi}{16}\cdot\frac{3\pi}{2}=\frac{3\pi^2}{8}.
   \]
6. 다른 경우가 더 작을 수 없는지도 확인한다. \(k=1\)에서 유효한 \(c\)는 이미 \(3\pi/2\) 이상이다. \(k\ge2\)이면 \(b\ge3\pi/16\), \(c\ge\pi/2\)이므로
   \[
   abc=4bc\ge4\cdot\frac{3\pi}{16}\cdot\frac{\pi}{2}
   =\frac{3\pi^2}{8}.
   \]
   경계값 \(k=2,m=0\)은 위상이 \(5\pi/4\)여서 높이가 음수이므로 등호를 만들지 못한다.
7. 따라서 요구한 **최솟값은 \(\boxed{3\pi^2/8}\)**이다. 원문에서 생략된 '양의 높이' 부호 확인과 후보 전체 비교를 포함했다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 20/20. 문항별 원문·정답·기존 해설·독립 계산·그림 링크를 위에 기록.
- **UPGRADE 전체 풀이 초안**: 1개 완성; 학생 노출은 아직 하지 않음.
- **HOLD**: 0개. 원본 문항 조건·답 불일치가 확정된 문항은 발견되지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 학생 실제 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **MD 작성 완료는 출고 QA 통과를 뜻하지 않는다.**

