# 2024 24_팔마고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2024`
- source: `archive/exams/original/high/h2/1mid/24_팔마고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/24_팔마고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 21 · UPGRADE 1 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 22문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

- `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q13.png` — Git blob `9c1f90c0f81f3c5a8ebef6281f4af04226b954de`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q18.png` — Git blob `c4b0871ec652dce27a64807a7140ef18998133e6`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `solutionImage` 보조 해설 자산 3개: GitHub 실제 파일과 Git blob 존재 확인. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q11 `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q11-solution-v2.svg` — `211238f140c62f0dbddc89a157ea214c5468bc9d`
  - Q13 `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q13-solution-v2.svg` — `3fad4d66d89e6d902bc2de2e22799275948cae32`
  - Q16 `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q16-solution-v2.svg` — `43c48b30285ab12ed5e973f891579676c439bb1b`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 설명 중 옳은 것은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
4의 제곱근은 2이다.
복소수 범위에서 방정식 $x^3=-8$의 해는 $-2$ 하나뿐이다.
$\sqrt[4]{16} = -2$
-5의 네제곱근 중 실수인 것은 $-\sqrt[4]{5}$이다.
-7의 다섯제곱근 중 실수인 것은 $-\sqrt[5]{7}$이다.
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
각 보기에서 제곱근과 거듭제곱근의 뜻을 확인한다.
① 4의 제곱근은 2와 -2이므로 2만 제시한 설명은 옳지 않다.
② 복소수 범위에서 $x^3=-8$을 풀면 $x^3+8=(x+2)(x^2-2x+4)=0$이다. 따라서 해는 $-2$, $1+\sqrt{3}i$, $1-\sqrt{3}i$의 세 개이므로 “$-2$ 하나뿐”이라는 설명은 옳지 않다.
③ $\sqrt[4]{16}$은 양의 네제곱근이므로 2이다. 따라서 $-2$라는 설명은 옳지 않다.
④ 실수의 네제곱은 음수가 될 수 없으므로 $-5$의 네제곱근 중 실수인 것은 없다.
⑤ 홀수 제곱근은 음수가 될 수 있고 $(-\sqrt[5]{7})^5=-7$이므로 옳다.
따라서 옳은 설명은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 네제곱근의 실수 여부와 복소수 범위를 각각 비교하면 \(-7\)의 실수 다섯제곱근 \(-\sqrt[5]7\)만 옳아 ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $y = \log_2 \frac{1}{2}(x-1)$에 대한 설명으로 옳지 않은 것은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
정의역은 $\{x \mid x > 1\}$이다.
그래프의 점근선은 직선 $x=1$이다.
그래프는 점 $(3, 0)$을 지난다.
$x$의 값이 증가하면 $y$의 값도 증가한다.
$y=\log_{\frac{1}{2}} x$의 그래프를 $x$축으로 $m$만큼, $y$축으로 $n$만큼 평행이동한 그래프이다. ($m, n$은 상수)
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
주어진 함수는 $y=\log_2\left(\dfrac{x-1}{2}\right)$이다.

진수가 양수여야 하므로 $x>1$이고, 그래프의 수직점근선은 $x=1$이다. $x=3$이면 진수는 $1$이므로 $y=0$이다. 밑이 $2>1$이고 진수 $\frac{x-1}{2}$가 증가하므로 함수도 증가한다.

이 함수의 밑을 $\frac{1}{2}$로 바꾸면 $\log_2 u=-\log_{\frac{1}{2}}u$이므로 그래프는 증가한다. 반면 $y=\log_{\frac{1}{2}}x$는 감소하고, 평행이동은 그래프의 증가·감소 방향을 바꾸지 않는다.

따라서 이 그래프를 $y=\log_{\frac{1}{2}}x$의 평행이동으로 볼 수 없다는 ⑤가 옳지 않다.
```

- **독립 판정·핵심 연결/검산:** \(y=\log_2((x-1)/2)\)는 정의역 \(x>1\), 점근선 \(x=1\), 점 (3,0), 증가함수. 감소함수 \(y=\log_{1/2}x\)의 평행이동이라는 ⑤만 틀림.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
정의역이 $\{x \mid -2 \le x \le 2\}$인 함수 $y=2^{x+2}+3$는 $x=p$일 때, 최솟값 $m$을 갖는다. 이때, $p+m$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2
3
4
5
6
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$2^{x+2}$는 $x$가 증가할수록 증가하므로 정의역 $-2\le x\le2$에서 가장 작은 값은 왼쪽 끝 $x=-2$에서 얻는다.

$p=-2$이고, 이때
$m=2^{-2+2}+3=2^0+3=4$이다.

따라서 $p+m=-2+4=2$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 밑2 지수함수 증가로 \(p=-2\), \(m=2^0+3=4\), \(p+m=2\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 <보기>에서 옳은 것만을 있는 대로 고른 것은?

<보기>
ㄱ. $\frac{4}{3}\pi = 240^\circ$
ㄴ. 시초선 $\mathrm{OX}$를 고정된 것으로 생각할 때, 동경 $\mathrm{OP}$의 위치가 정해지면 $\angle \mathrm{XOP}$의 크기는 유일하게 결정된다.
ㄷ. $\theta = 360^\circ \times n + 120^\circ$ ($n$은 정수) 는 제2사분면의 각이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄴ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
ㄱ. $\dfrac{4}{3}\pi$ 라디안을 도로 바꾸면
$\dfrac{4}{3}\pi\times\dfrac{180^\circ}{\pi}=240^\circ$이므로 참이다.

ㄴ. 동경의 위치가 같아도 한 바퀴를 더하거나 빼면 각의 크기가 달라진다. 따라서 각의 크기가 유일하게 정해지지 않으므로 거짓이다.

ㄷ. $360^\circ n+120^\circ$는 $120^\circ$와 동경이 같은 각이다. $120^\circ$는 제2사분면의 각이므로 참이다.

참인 것은 ㄱ, ㄷ이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(4\pi/3=240^\circ\) 참, 동경만으로 일반각 크기 유일하지 않음, \(360^\circ n+120^\circ\)는 제2사분면; ㄱ·ㄷ 참, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log_{(x+1)} (42-x-x^2)$이 정의되도록 하는 정수 $x$의 개수는?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
5
7
9
10
12
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그가 정의되려면 밑은 양수이고 $1$이 아니어야 하며, 진수는 양수여야 한다.

밑 조건에서 $x+1>0$이고 $x+1\ne1$이므로 $x>-1$, $x
e0$이다. 진수 조건은
$42-x-x^2>0$
$\iff (x+7)(6-x)>0$
이므로 $-7<x<6$이다.

두 조건을 합치면 $-1<x<6$, $x
e0$이다. 가능한 정수는 $1,2,3,4,5$로 모두 $5$개이다.

따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 밑 \(x+1>0,\ne1\), 진수 \((x+7)(6-x)>0\)의 교집합에서 정수 \(x=1,\dots,5\), 총5개, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
세 양수 $a, b, c$가 $a^x = b^{2y} = c^{3z} = 7$, $abc = 49$를 만족할 때 $\frac{6}{x} + \frac{3}{y} + \frac{2}{z}$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
6
8
10
12
14
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
공통으로 같은 값을 갖는 수가 $7$이므로
$a^x=b^{2y}=c^{3z}=7$이다.

따라서 $a=7^{\frac{1}{x}}$, $b=7^{1/(2y)}$, $c=7^{1/(3z)}$이고
$abc=7^{\frac1x+\frac1{2y}+\frac1{3z}}=49=7^2$이다.

밑이 같은 지수의 값이 같으므로
$\dfrac1x+\dfrac1{2y}+\dfrac1{3z}=2$이다. 양변에 $6$을 곱하면
$\dfrac6x+\dfrac3y+\dfrac2z=12$이다.

따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(abc=7^{1/x+1/(2y)+1/(3z)}=7^2\); 양변 지수에 6을 곱해 \(6/x+3/y+2/z=12\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$x = \log_2 6 + \log_4 9$일 때, $2^x$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
14
15
16
17
18
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
밑을 $2$로 맞추면
$\log_4 9=\dfrac{\log_2 9}{\log_2 4}=\dfrac{2\log_2 3}{2}=\log_2 3$이다.

그러므로
$x=\log_2 6+\log_2 3=\log_2 18$이다.

따라서 $2^x=18$이므로 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 밑변환 \(\log_49=\log_23\); \(x=\log_26+\log_23=\log_218\)이므로 \(2^x=18\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x) = \log_3 \left(1 + \frac{1}{x+2}\right)$에서
$$f(1) + f(2) + f(3) + \cdots + f(n) = 2$$
를 만족시키는 자연수 $n$의 값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
24
25
26
27
28
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$1+\dfrac1{x+2}=\dfrac{x+3}{x+2}$이므로
$f(k)=\log_3\dfrac{k+3}{k+2}$이다.

로그의 합을 곱의 로그로 바꾸면
$\sum_{k=1}^{n} f(k)=\log_3\left(\dfrac43\cdot\dfrac54\cdot\dfrac65\cdots\dfrac{n+3}{n+2}\right)$이다.

분자와 분모의 공통 인수가 약분되어
$\sum_{k=1}^{n} f(k)=\log_3\dfrac{n+3}{3}=2$이다.

따라서 $\dfrac{n+3}{3}=9$, $n=24$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 망원곱 \((4/3)(5/4)\cdots((n+3)/(n+2))=(n+3)/3=9\)에서 \(n=24\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
2 이상의 두 자연수 $m$, $n$에 대하여 등식
$$\sqrt[m]{4}\times\sqrt[n]{2}=\sqrt{2}$$
가 성립할 때, $m-n$의 최솟값은?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-5$
$-3$
$0$
$4$
$9$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$4=2^2$이므로 등식은
$$2^{\frac{2}{m}}\cdot 2^{\frac{1}{n}}=2^{\frac12}$$
로 나타낼 수 있다. 밑이 같은 거듭제곱이므로
$$\frac{2}{m}+\frac{1}{n}=\frac12$$
이다. 양변에 $2mn$을 곱하면
$$4n+2m=mn$$
이고, 이를 정리하면
$$(m-4)(n-2)=8$$
이다.

$m,n\ge2$이고 곱이 양수이므로 $m>4$, $n>2$이다. 두 인수는 양의 정수이므로 $8$의 양의 약수쌍을 모두 대입하면
$$(m-4,n-2)=(1,8),(2,4),(4,2),(8,1)$$
이고, 이에 대응하는 $(m,n)$은 $(5,10),(6,6),(8,4),(12,3)$이다.

각 경우의 $m-n$은 $-5,0,4,9$이므로 최솟값은 $-5$이다. 따라서 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** \(2/m+1/n=1/2\)에서 \((m-4)(n-2)=8\); 네 약수쌍의 \(m-n=-5,0,4,9\), 최솟값−5, ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
1이 아닌 두 양수 $a, b$가 있다. 두 함수 $f(x)=a^x$, $g(x)=b^x$에 대하여 양수 $n$에 대하여 $f(n) > g(n)$일 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은?

<보기>
ㄱ. $a > 1$이면 $b > 1$이다.
ㄴ. $b > 1$이면 $a > 1$이다.
ㄷ. $ab < 1$이면 $0 < b < 1$이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄴ
ㄷ
ㄱ, ㄴ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$n>0$이고 $a^n>b^n$이므로 밑의 대소 관계는 $a>b$이다.

ㄱ. $a>1$이어도 $b$는 $1$보다 작거나 같을 수 있으므로 거짓이다.

ㄴ. $b>1$이면 $a>b>1$이므로 참이다.

ㄷ. $b\ge1$이면 $a>b\ge1$이어서 $ab>1$이다. 따라서 $ab<1$이면 $0<b<1$이어야 하므로 참이다.

옳은 것은 ㄴ, ㄷ이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(n>0\)에서 \(a^n>b^n\iff a>b\). ㄱ 거짓, ㄴ 참, \(ab<1\Rightarrow b<1\)로 ㄷ 참, ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
반지름의 길이가 5 이고 중심각의 크기가 $\theta$인 부채꼴이 있다. $\theta$가 다음 <조건>을 만족시킬 때, 이 부채꼴의 호의 길이의 최댓값은?

<조건>
(가) $0 < \theta < \pi$
(나) 좌표평면에서 각 $\theta$를 나타내는 동경과 $4\theta$를 나타내는 동경이 $y$축에 대하여 대칭이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\pi$
$3\pi$
$5\pi$
$7\pi$
$9\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$y$축 대칭인 두 동경의 각을 각각 $\theta$, $4\theta$라 하면
$4\theta\equiv180^\circ-\theta\pmod{360^\circ}$이다.

따라서 $5\theta=180^\circ+360^\circ n$이고, $0<\theta<180^\circ$에서 가능한 값은 $36^\circ$, $108^\circ$이다.

호의 길이는 반지름과 중심각(라디안)의 곱이다. 더 큰 각 $108^\circ=\dfrac{3\pi}{5}$를 택하면
$5\cdot\dfrac{3\pi}{5}=3\pi$이다.

따라서 최댓값은 $3\pi$로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 동경의 y축 대칭 \(5\theta\equiv\pi\bmod2\pi\)에서 \(\theta=\pi/5,3\pi/5\); 최대 호길이 \(5(3\pi/5)=3\pi\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 실수 $a, b$에 대하여 $a^2 < a < b$ 일 때, 옳은 것만을 <보기>에서 있는 대로 고른 것은?

<보기>
ㄱ. $a^a > a^b$
ㄴ. $\log_a b > 1$
ㄷ. $\log_{b+1} a \times \log_{b+1} (a+1) < 0$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
ㄱ
ㄷ
ㄱ, ㄷ
ㄴ, ㄷ
ㄱ, ㄴ, ㄷ
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$a^2<a$에서 $a(a-1)<0$이므로 $0<a<1$이다. 또 $b>a$이므로 $b>0$이다.

ㄱ. 밑 $a$가 $0$과 $1$ 사이이면 지수가 커질수록 값이 작아진다. $a<b$이므로 $a^a>a^b$이고 참이다.

ㄴ. $b>a$이고 밑 $a<1$인 로그함수는 감소한다. 따라서 $\log_a b<\log_a a=1$이므로 거짓이다.

ㄷ. $b+1>1$이다. $0<a<1$이므로 $\log_{b+1}a<0$이고, $a+1>1$이므로 $\log_{b+1}(a+1)>0$이다. 두 값의 곱은 음수이므로 참이다.

옳은 것은 ㄱ, ㄷ이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(a^2<a<b\)에서 \(0<a<1\). 밑 감소로 ㄱ 참, \(\log_a b<1\)이라 ㄴ 거짓, \(\log_{b+1}a<0<\log_{b+1}(a+1)\)로 ㄷ 참, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
그림과 같이 길이가 8인 선분 $\mathrm{AB}$를 지름으로 하는 반원의 호 위에 점 $\mathrm{P}$가 있다. 선분 $\mathrm{AB}$ 위에 점 $\mathrm{Q}$를 $\overline{\mathrm{AP}}=\overline{\mathrm{AQ}}$가 되도록 잡고 부채꼴 $\mathrm{APQ}$의 호 $\mathrm{PQ}$를 그린다. 호 $\mathrm{BP}$의 길이가 $\frac{4}{3}\pi$일 때, 부채꼴 $\mathrm{APQ}$의 넓이는?

<div class="diagram-box"><img src="assets/images/24_팔마고_1학기_중간_고2_수학I/q13.png" width="300" /></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{7}{2}\pi$
$4\pi$
$\frac{9}{2}\pi$
$5\pi$
$\frac{11}{2}\pi$
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
반원의 반지름은 $4$이다. 호의 길이와 중심각의 관계로
$\angle BOP=\dfrac{\frac43\pi}{4}=\dfrac\pi3$이다.

$A,O,B$가 한 직선 위에 있으므로
$\angle AOP=\pi-\dfrac\pi3=\dfrac{2\pi}{3}$이다. 현의 길이 공식에 따라
$AP=2\cdot4\sin\left(\dfrac{1}{2}\cdot\dfrac{2\pi}{3}\right)=8\sin\dfrac\pi3=4\sqrt3$이다.

$AQ=AP$이고 $Q$가 $AB$ 위에 있으므로 $\angle PAQ=\angle PAB$이다. 지름 $AB$를 보는 원주각은 직각이고, 호 $BP$의 중심각이 $60^\circ$이므로 $\angle PAB=30^\circ=\dfrac\pi6$이다.

따라서 부채꼴 $APQ$의 넓이는
$\dfrac12(4\sqrt3)^2\cdot\dfrac\pi6=4\pi$이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 반원 q13.png에서 반지름4·호 BP 길이 \(4\pi/3\) 확인. 현 AP \(4\sqrt3\), 중심각 PAQ \(\pi/6\); 부채꼴 넓이 \(4\pi\), ②.
- 문제 그림: `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q13.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 $x$에 대하여 방정식 $k \times 2^x = 4^x + 2^x + 4$가 서로 다른 두 개의 실근을 갖도록 하는 정수 $k$중 절댓값이 10보다 작은 것의 개수는?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
2
4
6
8
10
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=2^x$라 두면 $t>0$이고 $4^x=t^2$이다. 방정식은
$t^2+(1-k)t+4=0$이 된다.

서로 다른 두 실수 $x$에 대응하려면 이 이차방정식이 서로 다른 두 양의 근을 가져야 한다. 두 근의 곱은 $4>0$이고 합은 $k-1$이므로 두 근이 양수이려면 $k>1$이다. 판별식 조건은
$(1-k)^2-16>0$이다.

이를 $k>1$과 함께 적용하면 $k>5$이다. $|k|<10$인 정수 중 가능한 값은 $6,7,8,9$로 $4$개이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(t=2^x>0\)에서 \(t^2+(1-k)t+4=0\)이 서로 다른 양의 근 둘일 조건 \(k>5\); 정수 6,7,8,9의 4개, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
2보다 큰 두 자연수 $a, b$에 대하여 두 양수 $x, y$가 다음 <조건>을 만족시킬 때, $a, b$의 순서쌍 $(a, b)$의 개수는?

<조건>
(가) $\sqrt[a]{x} = \sqrt[b]{y^2} = 216$
(나) $\sqrt[3]{xy} = 2^{20} \times 3^{20}$
```

- **원문 보기 (`choices` 순서 그대로):**

```text
14
15
16
17
18
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 조건에서
$x=216^a$이다. 또 $y>0$이므로 $\sqrt[b]{y^2}=216$에서 $y^2=216^b$, $y=216^{\frac{b}{2}}$이다.

둘째 조건의 좌변은
$\sqrt[3]{xy}=216^{\frac{a+\frac{b}{2}}{3}}$이다. 한편 $2^{20}\cdot3^{20}=6^{20}=216^{\frac{20}{3}}$이므로 지수를 비교하여
$\dfrac{a+\frac{b}{2}}{3}=\dfrac{20}{3}$, 즉 $2a+b=40$을 얻는다.

$a,b$는 $2$보다 큰 자연수이므로 $a=3,4,\ldots,18$이고, 각각에 대해 $b=40-2a$가 하나씩 정해진다. 따라서 순서쌍은 $18-3+1=16$개이다.

정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(x=216^a,y=216^{b/2}\); \(\sqrt[3]{xy}=216^{20/3}\)에서 \(2a+b=40\), \(a=3,\dots,18\)의 16쌍, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — UPGRADE

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
좌표평면 위의 두 곡선 $y=3^{|x-1|}+2$와 $y=\log_2 (x+k)$가 만나는 서로 다른 두 점의 $x$좌표를 $x_1, x_2$ ($x_1 < x_2$)라고 할 때, $0 < x_1 < 1$, $1 < x_2 < 2$를 만족시키는 자연수 $k$의 개수는?
```

- **원문 보기 (`choices` 순서 그대로):**

```text
20
22
24
26
28
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
두 함수의 교점이 각 구간에 있는지 양 끝에서의 높이 비교로 판단한다.

$0<x<1$에서는 $3^{1-x}+2$가 감소하고 $\log_2(x+k)$가 증가한다. 따라서 교점이 하나 생기려면 $x=0$에서 로그 그래프가 아래에 있고 $x=1$에서 위에 있어야 한다.
$\log_2 k<5$, $\log_2(k+1)>3$이므로 $7<k<32$이다.

$1<x<2$에서는 $3^{x-1}+2$가 증가한다. 로그함수는 증가가 완만하고 지수함수는 이 구간에서 더 빠르게 증가하므로 두 그래프의 높이 차는 한 번만 바뀐다. 교점 조건은 $x=1$에서 로그 그래프가 위에 있고 $x=2$에서 아래에 있는 것이다.
$\log_2(k+1)>3$, $\log_2(k+2)<5$이므로 $7<k<30$이다.

두 구간의 조건을 합치면 $7<k<30$이다. 자연수 $k$는 $8,9,\ldots,29$이므로 $22$개이다.

따라서 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 좌우 구간 교점의 경계 높이 조건 \(7<k<32\) 및 \(7<k<30\), 공통 \(k=8,\dots,29\) 총22. 우측 구간 단일 교점 논증은 함수 차의 증가성 확인을 보강.
- 문제 그림: 별도 문제 그림 없음

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 두 함수의 높이 차를 \(H(x)=3^{|x-1|}+2-\log_2(x+k)\)로 둔다. 교점은 \(H(x)=0\)인 지점이며 로그 정의역은 \(x+k>0\)이다. \(k\)가 자연수이므로 \([0,2]\)에서 모두 정의된다.
2. **왼쪽 \(0<x<1\):** \(3^{1-x}+2\)는 감소하고 \(\log_2(x+k)\)는 증가하므로 교점은 최대 하나다. 구간 내부에 교점이 있으려면 양 끝에서 부호가 엄격히 바뀌어야 한다.
   \[
   H(0)=5-\log_2k>0\Longleftrightarrow k<32,\quad
   H(1)=3-\log_2(k+1)<0\Longleftrightarrow k>7.
   \]
   따라서 \(7<k<32\).
3. **오른쪽 \(1<x<2\):** \(3^{x-1}+2\)는 빠르게 증가하는 지수 그래프, \(\log_2(x+k)\)는 점점 완만해지는 로그 그래프다. 특히 \(k\ge8\)이면 이 구간에서 지수 그래프의 증가 속도가 로그 그래프보다 항상 크므로 높이 차 \(H\)는 계속 증가한다. 그러므로 교점은 최대 하나다. (원본에서는 이 ‘한 번만 만남’의 이유가 생략돼 있었다.)
4. 오른쪽 내부에 교점이 있으려면
   \[
   H(1)=3-\log_2(k+1)<0\Longleftrightarrow k>7,
   \quad
   H(2)=5-\log_2(k+2)>0\Longleftrightarrow k<30.
   \]
   따라서 \(7<k<30\). 등호 \(k=7\) 또는 \(30\)이면 교점이 구간 끝에 생겨 **엄격한 구간 조건**에 맞지 않는다.
5. 양쪽 조건을 동시에 만족하는 자연수는 \(8,9,\ldots,29\), 개수 \(29-8+1=\boxed{22}\). 정답 **②**. 두 구간의 단일 교점과 끝점 제외 조건을 모두 확인했으므로 실제 교점은 정확히 두 개다.

**감사자 별도 검증(학생용 수식에 미포함):** \(1\le x\le2,\ k\ge8\)에서 \(H'(x)=(\ln3)3^{x-1}-1/((x+k)\ln2)> \ln3-1/(9\ln2)>0\). 근의 유일성을 수학적으로 재확인했으며 학생용 문구는 그래프 증가 양상으로 제시한다.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형1(단답형1)]
$x = 2^{\frac{1}{3}} + 2^{-\frac{1}{3}}$일 때, $2x^3 - 6x - 2$의 값을 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `3`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$a=2^{\frac{1}{3}}$이라 두면 $x=a+a^{-1}$이다.

$(a+a^{-1})^3=a^3+3a+3a^{-1}+a^{-3}$이고, $a^3=2$, $a^{-3}=\dfrac12$이므로
$x^3=\dfrac52+3(a+a^{-1})=\dfrac52+3x$이다.

따라서
$2x^3-6x-2=2\left(\dfrac52+3x\right)-6x-2=3$이다.

정답은 $3$이다.
```

- **독립 판정·핵심 연결/검산:** \(x=2^{1/3}+2^{-1/3}\)이면 \(x^3=5/2+3x\); \(2x^3-6x-2=3\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형2(단답형2)]
함수 $y=\log_{\frac{1}{3}} kx$ ($k$는 양의 실수)의 그래프를 $x$축의 방향으로 $m$만큼 평행이동한 후 $y=x$에 대하여 대칭이동시킨 함수 $y=f(x)$의 그래프가 아래 그림과 같다. 함수 $y=f(x)$ 그래프가 $(1, 0)$을 지나고, $y=f(x)$의 그래프의 점근선이 직선 $y=-3$일 때, $k+m$의 값을 구하시오.

<div class="diagram-box"><img src="assets/images/24_팔마고_1학기_중간_고2_수학I/q18.png" width="300" /></div>
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `-26/9`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
원래 로그함수를 오른쪽으로 $m$만큼 옮기면
$y=\log_{\frac{1}{3}}(k(x-m))$이다. 이 그래프를 $y=x$에 대하여 대칭이동하면 식에서 $x,y$를 서로 바꾸어
$x=\log_{\frac{1}{3}}(k(y-m))$를 얻는다.

로그의 정의로
$k(y-m)=(\frac{1}{3})^x$이므로
$f(x)=m+\dfrac1k(\frac{1}{3})^x$이다.

이 지수함수의 수평점근선은 $y=m$이므로 $m=-3$이다. 또한 $(1,0)$을 지나므로
$0=-3+\dfrac1{3k}$, $k=\dfrac19$이다.

따라서 $k+m=\dfrac19-3=-\dfrac{26}{9}$이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q18.png의 수평점근선 \(y=-3\)에서 \(m=-3\); 역함수 식 \(f(x)=m+(1/k)(1/3)^x\), 점 (1,0)에서 \(k=1/9\), 합−26/9.
- 문제 그림: `archive/assets/images/24_팔마고_1학기_중간_고2_수학I/q18.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형3(단답형3)]
27이하의 양수 $a$에 대하여 $a^{\log_3 4}$의 값이 $2^n$ 꼴($n$은 양의 정수)이 되도록 하는 모든 $a$의 값의 곱을 구하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `3^(21/2)`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
결과가 양의 정수 지수를 갖는 $2^n$이라고 하자.

$a^{\log_3 4}=2^n$에서 양변을 정리하면 $a=3^{\frac{n}{2}}$이다. $a\le27=3^3$이므로 $n=1,2,\ldots,6$이다. (지수 $0$을 포함해 $a=1$을 넣어도 곱은 변하지 않는다.)

따라서 모든 $a$의 곱은
$\prod_{n=1}^{6}3^{\frac{n}{2}}=3^{\frac{1+2+3+4+5+6}{2}}=3^{\frac{21}{2}}$이다.
```

- **독립 판정·핵심 연결/검산:** \(a^{\log_34}=2^n\)에서 \(a=3^{n/2}\), \(a\le27\)이면 \(n=1,\dots,6\); 지수합21/2로 곱 \(3^{21/2}\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형4(서술형1)]
함수 $y=\log_2 (x-1) + \log_2 (9-x)$는 $x=p$일 때, 최댓값 $m$을 갖는다. $p$와 $m$의 값을 각각 구하는 과정을 서술하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `p=5, m=4`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
정의역은 $x-1>0$과 $9-x>0$을 함께 만족하는 $1<x<9$이다.

로그의 합을 하나로 합치면
$y=\log_2((x-1)(9-x))$이다. 곱 안의 식을 완전제곱식으로 고치면
$(x-1)(9-x)=16-(x-5)^2$이다.

이 값은 $x=5$일 때 최댓값 $16$을 갖는다. 밑 $2>1$이므로 로그함수도 진수가 클수록 커져 $y$는 $x=5$에서 최댓값을 갖는다.

따라서 $p=5$, $m=\log_2 16=4$이다.
```

- **독립 판정·핵심 연결/검산:** 정의역 \(1<x<9\), \((x-1)(9-x)\)는 \(x=5\)에서 최대16; \(p=5,m=\log_216=4\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형5(서술형2)]
어느 기업에서 올해 기업의 부채가 자기 자본의 4배에 이르자, 내년부터 매년 부채를 전년도에 비해 $10\%$씩 줄이고, 자기 자본은 $20\%$씩 늘리는 계획을 세웠다. 이 계획대로 진행될 때, 이 기업의 자기 자본이 처음으로 부채보다 많아지는 해는 올해로부터 몇 년 후인지 구하는 과정을 서술하시오.
(단, $\log 2 = 0.30$, $\log 3 = 0.48$로 계산한다.)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `5`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
올해 자기 자본을 $C$라 하면 올해 부채는 $4C$이다. $n$년 후 자기 자본과 부채는 각각
$C(1.2)^n$, $4C(0.9)^n$이다.

자기 자본이 부채보다 많아지는 조건은
$C(1.2)^n>4C(0.9)^n$이며, 이를 정리하면 $\left(\dfrac43\right)^n>4$이다.

$n=4$이면 $\left(\dfrac43\right)^4=\dfrac{256}{81}<4$이므로 아직 자기 자본이 더 많지 않다.
$n=5$이면 $\left(\dfrac43\right)^5=\dfrac{1024}{243}>4$이므로 자기 자본이 부채보다 많다.

따라서 처음으로 자기 자본이 부채보다 많아지는 해는 올해로부터 5년 후이다.
```

- **독립 판정·핵심 연결/검산:** 부채 \(4C(0.9)^n\)와 자본 \(C(1.2)^n\) 비교에서 \((4/3)^4=256/81<4<1024/243=(4/3)^5\), 최초 5년 후.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `10dbb946486a39cf10f809cf44b774f247ba9fce`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형6(서술형3)]
$x$에 대한 부등식
$$(\log_2 x)^2 - (\log_2 n + 2)\log_2 x + 3(\log_2 n - 1) < 0$$
을 만족시키는 정수 $x$의 개수가 2가 되도록 하는 모든 자연수 $n$의 값의 합을 구하는 과정을 서술하시오.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `64`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=\log_2x$, $s=\log_2n$이라 두면 부등식의 왼쪽은
$(t-3)(t-(s-1))$로 인수분해된다. 따라서 $t$는 $3$과 $s-1$ 사이에 있다. 밑 $2$가 $1$보다 크므로 $x$의 범위는 $8$과 $\frac{n}{2}$ 사이이다.

$n<16$이면 $\frac{n}{2}<x<8$이다. $n=2k$일 때 정수 $x$는 $k+1$부터 $7$까지이므로 개수는 $7-k$이다. 이것이 $2$가 되려면 $k=5$, $n=10$이다. $n=2k+1$이면 $x$는 $k+1$부터 $7$까지이고, 개수 $7-k=2$에서 $n=11$을 얻는다.

$n>16$이면 $8<x<n/2$이다. $n=2k$일 때 정수 $x$는 $9$부터 $k-1$까지이므로 개수는 $k-9$이다. $k-9=2$에서 $n=22$를 얻는다. $n=2k+1$일 때는 $9$부터 $k$까지여서 개수는 $k-8$이다. $k-8=2$에서 $n=21$이다.

$n=16$이면 구간의 길이가 $0$이므로 조건을 만족하지 않는다. 가능한 $n$의 합은 $10+11+21+22=64$이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\log_2x,s=\log_2n\), 해는 \(x\)가 \(8,n/2\) 사이. 정확히 두 정수인 경우 \(n=10,11,21,22\), 합64.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 22/22. 문항별 원문·정답·기존 해설·독립 계산·그림 링크를 위에 기록.
- **UPGRADE 전체 풀이 초안**: 1개 완성; 학생 노출은 아직 하지 않음.
- **HOLD**: 0개. 원본 문항 조건·답 불일치가 확정된 문항은 발견되지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 학생 실제 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **MD 작성 완료는 출고 QA 통과를 뜻하지 않는다.**

