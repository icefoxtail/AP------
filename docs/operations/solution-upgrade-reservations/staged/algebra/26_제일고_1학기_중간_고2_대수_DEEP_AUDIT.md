# 2026 26_제일고_1학기_중간_고2_대수.js — 대수 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2026`
- source: `archive/exams/original/high/h2/1mid/26_제일고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- standardCourse (전 문항): `대수`, 2022 개정 대수; 구 수학Ⅰ 대응 범위
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/26_제일고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 23 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 개선 전체안 작성; HOLD 별도 유지) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- scope: 1학기 중간 기출 전 문항 원본 판정 및 학생용 개선 MD. JS/SVG/main 변경·배포·Golden 최종 게이트는 수행하지 않음

## 필독·적용 근거

현재 본문을 GitHub fetch로 취득해 판정에 사용한 문서의 **Git blob SHA**(SHA-256 검증 영수증과는 별개):

- `docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md` — Git blob `fa258f6ab998c7fd0e2b398956309a43ce967e82`
- `docs/operations/solution-upgrade-reservations/GLOBAL_QUEUE_CURRENT.md` — Git blob `259bf732ac9932f832077a506c587cb1401a4f7f`
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md` — Git blob `eb02a8ed22515b70b0d897949945e40b013eaab6`
- `docs/operations/solution-upgrade-reservations/docs-manifest.json` — Git blob `649d90226c8dc8a936f1d41a07e4c51e09acc4e5`
- `AGENTS.md` — Git blob `61f2bd5223bd6e23dfc358425cf9c28e18f47dd8`
- `docs/rules/RULEBOOK_CURRENT.md` — Git blob `e2c5dd43a16469d25f155a23f723071fd8988a3e`
- `docs/agents/outcome-method-review.md` — Git blob `909dfdc6a30abcc9625a2450e55765796f65ec82`
- `docs/agents/gpt-reservation.md` — Git blob `308bd8c59bbda4b1bb6fc6c2fd600b4cd8abac9a`
- `docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md` — Git blob `0e6309c3893e50b98607c9d44c08a8a3dc73e9bb`
- `docs/agents/common.md` — Git blob `ef299aeecf718aeb3db03c4f3e19efaca47cc260`
- `archive/AGENTS.md` — Git blob `ea550cf69dde6fb60817ca1895341b80734908d2`
- `docs/agents/exam-pipeline.md` — Git blob `a3307a463626c2b21ba0c82b7d17410829f14ae3`
- `docs/agents/metadata.md` — Git blob `caf99a38f087d5e97ef0dc16b8638353ad32494c`
- `docs/agents/git-evidence.md` — Git blob `98165110adf82ddd16adec92f29951691484af21`
- `docs/rules/01_CANONICAL/JS아카이브_학생용해설_운영규칙_v1.md` — Git blob `bf5b8a1b6d7488d30b4b1ced5fbe6853001c9d75`
- `docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md` — Git blob `0ea5c57cdf71f8ded248b9ebd4dde0cf7b90e84c`
- `docs/rules/02_PIPELINES/Archive_작업전_Golden_Sample_Calibration_v1.md` — Git blob `693c7ed76dbd643dedd204bbcec9f707bbc2e2f2`
- `docs/operations/solution-upgrade-reservations/BOARD_SOLUTION_SAMPLES_CURRENT.md` — Git blob `f703929fa816fc4183f28235a355ecd3a1d6ace7`

적용 규칙: “한 시험지의 모든 문항 문제·정답·해설을 실제 읽고 KEEP/UPGRADE/HOLD/UNREAD의 구체적 근거 남기기”, “UPGRADE는 복사 가능한 학생용 완성 풀이와 독립 검산”, “학생 그림은 실물 파일 판독”, “원본 JS·SVG·main 무변경”. `preflight.mjs` 실행 및 SHA-256 read-receipt 재검증: `NOT_RUN` (로컬 저장소·전체 Node preflight 미구축). 

Calibration: 2025 순천여고 고1 2학기 기말 Q15/Q18와 2025 매산고 고2 수학Ⅱ Q7의 실제 원문·해설을 읽고 중간 등호·조건 점검 기준으로 사용. Negative: `archive/fixtures/review-negative-regressions/2026-10-01-bokseong/README.md` Git blob `f06387b8bbb5adce4244fbb576c0bd500ab282fa`의 작은 칠판 구조·실물 geometry·escape false-PASS 유형을 확인. **샘플 최종 게이트 자체는 NOT_RUN**.

## 실물 그림 검증

- Q17: `archive/assets/images/26_제일고_1학기_중간_고2_대수/q17.png` (Git blob `4df5fa1deccbce2e975174ded19123ecf4e175d5`), 실제 PNG 로드·시각 판독: x=0과 x=π/2의 두 연속 최대 3, 최솟값 -1 확인

학생 렌더 `NOT_RUN`; Golden/Negative 최종 QA `NOT_RUN`; 출고 `NOT_RUN`; SVG/JS 변조 `NONE`; 비그림 문제의 종이 원본 이미지/스캔 대조 `NOT_RUN`.

## 전 문항 심층 감사

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|1`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
다음 식의 값을 간단히 하면 $a\sqrt[3]{6}$이다. 정수 $a$의 값은? (3.5점)<br><br><div style="border: 1px solid #333; padding: 10px; margin: 10px 0; text-align: center;">$$\sqrt[3]{9} \times \sqrt[3]{18} - \sqrt{\sqrt[3]{36}}$$</div>
```

- 원문 보기: ① $-2$ / ② $-1$ / ③ $0$ / ④ $1$ / ⑤ $2$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> ∛(9)·∛(18)=∛(162)=3∛(6)이다.
> 또한 √(∛(36))=36^(1/6)=(6^2)^(1/6)=∛(6)이다.
> 따라서 주어진 식은 2∛(6)이므로 a=2이다. 정답은 ⑤이다.

- **판정·핵심 연결·독립 검산:** ∛(9·18)=∛162=3∛6, √(∛36)=36^(1/6)=∛6이므로 차는 2∛6이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|2`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
다음 식의 값을 간단히 하면 $\log n$이다. 자연수 $n$의 값은? (3.5점)<br><br><div style="border: 1px solid #333; padding: 10px; margin: 10px 0; text-align: center;">$$\log 8 - \log 4 + 2\log 3$$</div>
```

- 원문 보기: ① $6$ / ② $10$ / ③ $12$ / ④ $15$ / ⑤ $18$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $\log 8-\log 4+2\log 3=\log\frac{8}{4}+\log 3^2=\log 2+\log 9=\log 18$이다.
> 따라서 $n=18$이다. 정답은 ⑤이다.

- **판정·핵심 연결·독립 검산:** log8-log4+2log3=log(8×9/4)=log18로 n=18이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|3`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
다음 계산에서 <u>잘못된</u> 부분은? (3.5점)<br><br><div style="border: 1px solid #333; padding: 10px; margin: 10px 0; text-align: center;">$$\begin{matrix} 2 = (2^4)^{\frac{1}{4}} & = \{(-2)^4\}^{\frac{1}{4}} & = (-2)^{4 \times \frac{1}{4}} & = -2 \\ \uparrow & \uparrow & \uparrow & \uparrow \\ \text{①} & \text{②} & \text{③} & \text{④} \end{matrix}$$</div>
```

- 원문 보기: ① $2 = (2^4)^{\frac{1}{4}}$ / ② $(2^4)^{\frac{1}{4}} = \{(-2)^4\}^{\frac{1}{4}}$ / ③ $\{(-2)^4\}^{\frac{1}{4}} = (-2)^{4 \times \frac{1}{4}}$ / ④ $(-2)^{4 \times \frac{1}{4}} = -2$ / ⑤ 잘못된 부분이 없다.
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> ①과 ②에서는 $2^4=(-2)^4=16$이므로 값이 같다. 하지만 여기서 $16^{\frac{1}{4}}$는 $16$의 양의 네제곱근을 뜻하므로 $16^{\frac{1}{4}}=2$이다. $16$의 실수 네제곱근은 $\pm2$이지만, 지수 $\frac{1}{4}$ 표기는 그중 양의 근을 나타낸다.
> 따라서 $\{(-2)^4\}^{\frac{1}{4}}=2$인 반면 $(-2)^{4\cdot(\frac{1}{4})}=(-2)^1=-2$이다. 두 값을 같다고 한 ③의 등식은 성립하지 않는다. 정답은 ③이다.

- **판정·핵심 연결·독립 검산:** (-2)^4=16이어도 4제곱근 기호는 양의 2를 뜻하므로 ③의 지수 결합만 성립하지 않는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|4`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
호의 길이가 $4\pi$, 넓이가 $28\pi$인 부채꼴의 중심각의 크기는? (3.5점)
```

- 원문 보기: ① $\dfrac{2}{7}\pi$ / ② $\dfrac{3}{7}\pi$ / ③ $\dfrac{4}{7}\pi$ / ④ $\dfrac{5}{7}\pi$ / ⑤ $\dfrac{6}{7}\pi$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 부채꼴의 호의 길이와 넓이는 각각 l=rθ, S=(1/2)r²θ이다. 따라서 S=(1/2)rl에서 r=2S/l=56π/(4π)=14이다. 중심각은 θ=l/r=4π/14=2π/7이다. 정답은 ①이다.

- **판정·핵심 연결·독립 검산:** 호 4π, 넓이 28π에서 r=2S/l=14이고 θ=l/r=2π/7이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|5`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_{(x-2)}(-x^2+5x+6)$이 정의되기 위한 정수 $x$의 개수는? (3.5점)
```

- 원문 보기: ① $1$ / ② $2$ / ③ $3$ / ④ $4$ / ⑤ $5$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 로그가 정의되려면 밑 $x-2$에 대해 $x-2>0$, $x-2\ne1$이고, 진수는 $-x^2+5x+6>0$이어야 한다.
> $-x^2+5x+6=-(x-6)(x+1)>0$이므로 $-1<x<6$이다. 여기에 $x>2$를 적용하면 $2<x<6$이고, $x=3$은 밑이 $1$이 되어 제외된다.
> 따라서 가능한 정수는 $x=4,5$의 2개이다. 정답은 ②이다.

- **판정·핵심 연결·독립 검산:** 진수 -1<x<6과 밑 x>2,x≠3을 결합하면 정수 4,5 두 개다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|6`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
$\dfrac{\pi}{2} < \theta < \pi$이고 $\cos\theta + \sin\theta = \dfrac{1}{5}$일 때, $\tan\theta$의 값은? (3.5점)
```

- 원문 보기: ① $-\dfrac{4}{3}$ / ② $-\dfrac{3}{4}$ / ③ $-\dfrac{4}{5}$ / ④ $\dfrac{4}{5}$ / ⑤ $\dfrac{4}{3}$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> s=sinθ, c=cosθ라 하면 s+c=(1)/(5)이고 sc=((s+c)^2-1)/(2)=-(12)/(25)이다.
> s,c는 t^2-(1)/(5)t-(12)/(25)=0의 두 근이므로 {s,c}={(4)/(5),-(3)/(5)}이다. (π)/(2)<θ<π에서 s>0,c<0이므로 tanθ=(4/5)/(-3/5)=-(4)/(3)이다.
> 정답은 ①이다.

- **판정·핵심 연결·독립 검산:** 제2사분면 sin=4/5, cos=-3/5에서 tan=-4/3을 직접 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|7`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
두 양수 $a, b$와 $xyz \neq 0$인 세 실수 $x, y, z$에 대하여<br>$$2^x = 3^y = 4^z = k,$$<br>$$2yz - 3zx + 2xy = 3xyz$$<br>을 만족할 때, 양수 $k$의 값은? (4.3점)
```

- 원문 보기: ① $\dfrac{2}{3}$ / ② $\dfrac{4}{3}$ / ③ $2$ / ④ $\dfrac{8}{3}$ / ⑤ $\dfrac{10}{3}$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> A=log k라 두면 x=A/log 2, y=A/log 3, z=A/log 4이다. x,y,z≠0이므로 주어진 식을 xyz로 나누면 2/x−3/y+2/z=3이다. 대입하면 (2log 2−3log 3+2log 4)/A=3, 즉 3log(4/3)/A=3이다. 따라서 A=log(4/3), k=4/3이다. 정답은 ②이다.

- **판정·핵심 연결·독립 검산:** xyz로 나눈 뒤 (2log2-3log3+2log4)/logk=3으로 k=4/3이다; a,b는 원문에 등장하지만 실제 조건에 쓰이지 않는 편집상 잔여 변수다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|8`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
다음은 로그함수 $f(x) = \log_c(x-a)+b\;(c>0, c \neq 1)$와 그 그래프에 대한 설명이다. 다음 설명 중 <u>틀린</u> 것은? (4.3점)
```

- 원문 보기: ① 정역은 $\{x \mid x > a\text{인 실수}\}$이고 치역은 실수 전체의 집합이다. / ② $c > 1$일 때, $x$의 값이 증가하면 $f(x)$의 값도 증가한다. / ③ $g(x) = c^{x-b}+a$이라 할 때, $(g \circ f)(x) = x$이다. / ④ 곡선 $y=f(x)$의 점근선의 방정식은 $y=b$이다. / ⑤ $f(x_1) = f(x_2)$이면 $x_1 = x_2$이다.
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 정의역은 $x>a$이고 치역은 실수 전체이다. $c>1$이면 로그함수는 증가하고, $0<c<1$이면 감소하지만, 두 경우 모두 일대일이므로 ⑤의 설명은 참이다.
> $g(f(x))=c^{\log_c(x-a)+b-b}+a=x$이므로 $g(x)=c^{x-b}+a$는 $f$의 역함수이다.
> $y=\log_c x$의 그래프는 $c>1$일 때 증가하고 $0<c<1$일 때 감소하지만, 두 경우 모두 점근선은 $x=0$이다. 이 그래프를 $x$축 방향으로 $a$, $y$축 방향으로 $b$만큼 평행이동했으므로 점근선은 $x=a$이다. 따라서 점근선을 $y=b$라 한 ④가 틀렸다. 정답은 ④이다.

- **판정·핵심 연결·독립 검산:** 로그함수 y=log_c(x-a)+b의 점근선은 수직선 x=a이며 역함수·단조성 나머지 진술은 유효하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|9`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
공동 주택에 사는 사람들에게 층간 소음이 큰 문제가 되고 있다. 층간 소음은 소리의 세기에 따른 소리의 크기로 측정할 수 있는데, 소리의 세기가 $I\text{ W/m}^2$일 때, 소리의 크기 $D\text{ dB}$은 다음과 같은 관계가 성립한다고 한다.<br>$$D = 10(\log I + 12)$$<br>소리의 세기가 $10^{-7}\text{ W/m}^2$일 때의 소리의 크기를 $A\text{ dB}$, 소리의 세기가 $10^{-11}\text{ W/m}^2$일 때의 소리의 크기를 $B\text{ dB}$라 하자. $A$는 $B$의 몇 배인가? (4.2점)
```

- 원문 보기: ① $3$ / ② $4$ / ③ $5$ / ④ $6$ / ⑤ $7$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> A=10(log 10^(−7)+12)=10(−7+12)=50이다. B=10(log 10^(−11)+12)=10(−11+12)=10이다. 따라서 A/B=50/10=5이다. 정답은 ③이다.

- **판정·핵심 연결·독립 검산:** 주어진 소음 모형에 I=10^-7,10^-11을 넣으면 각각 50,10dB, 비는 5다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|10`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
두 양수 $a,b$가 모두 $1$보다 크고 $\log_a b-\log_b a=1$일 때, $\log_{a^2b}(a^2b^2)$의 값은? (4.3점)
```

- 원문 보기: ① $\frac{\sqrt5}{5}$ / ② $1-\frac{\sqrt5}{5}$ / ③ $1+\frac{\sqrt5}{5}$ / ④ $2-\frac{\sqrt5}{5}$ / ⑤ $2+\frac{\sqrt5}{5}$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 두 양수 $a,b$가 모두 $1$보다 크므로 $x=\log_a b>0$이다. 밑을 바꾸면 $\log_b a=\frac{1}{x}$이므로 조건에서 $x-\frac1x=1$, 즉 $x^2-x-1=0$이다. $x>0$이므로 $x=\frac{1+\sqrt5}{2}$이다.
> 또한 $a^2b>1$이므로 로그의 밑변환을 적용할 수 있다.
> $\log_{a^2b}(a^2b^2)=\frac{\log_a(a^2b^2)}{\log_a(a^2b)}=\frac{2+2x}{2+x}$.

- **판정·핵심 연결·독립 검산:** x=log_a b는 x>0에서 x²-x-1=0의 양의 근, (2+2x)/(2+x)=1+√5/5다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|11`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x) = (2^{2x}+2^{-2x}) - 2(2^x+2^{-x})+1$은 $x=p$일 때, 최솟값 $m$을 갖는다. 이때, $m+2^p$의 값은? (4.3점)
```

- 원문 보기: ① $-2$ / ② $-1$ / ③ $0$ / ④ $1$ / ⑤ $2$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> $t=2^x+2^{-x}$라 두면 $2^x>0$이고 $t-2=2^x+2^{-x}-2=\dfrac{(2^x-1)^2}{2^x}\ge0$이므로 $t\ge2$이며, 등호는 $x=0$일 때 성립한다.
> 또한 $2^{2x}+2^{-2x}=t^2-2$이므로
> $f(x)=t^2-2-2t+1=(t-1)^2-2$이다.

- **판정·핵심 연결·독립 검산:** t=2^x+2^-x≥2, f=(t-1)²-2가 t=2에서 -1이고 p=0이므로 합 0이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|12`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x) = k\log_6 x + p$의 역함수 $g(x)$에 대하여 $g(3)=3$, $g(6)=6$일 때, $\dfrac{p}{k}$의 값은? (4.3점)<br>(단, $k \neq 0$이고, $k, p$는 상수이다.)
```

- 원문 보기: ① $\log_6 \dfrac{2}{3}$ / ② $\log_6 \dfrac{4}{3}$ / ③ $\log_6 2$ / ④ $\log_6 \dfrac{8}{3}$ / ⑤ $\log_6 \dfrac{10}{3}$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> g(3)=3, g(6)=6이므로 역함수 관계에서 f(3)=3, f(6)=6이다. klog₆3+p=3, k+p=6이므로 k(1−log₆3)=3, 즉 klog₆2=3이다. 따라서 p/k=3/k−log₆3=log₆2−log₆3=log₆(2/3)이다. 정답은 ①이다.

- **판정·핵심 연결·독립 검산:** 역함수 고정점 g(3)=3,g(6)=6은 f의 고정점과 같아 klog₆2=3, p/k=log₆(2/3)이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|13`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
삼각함수와 그 그래프에 대한 설명으로 옳지 <u>않은</u> 것은? (4.3점)
```

- 원문 보기: ① 함수 $y=3\sin(2x+1)$의 주기는 $\pi$이다. / ② 함수 $y=-2\cos x+3$의 최댓값과 최솟값의 차는 $4$이다. / ③ 두 함수 $f(x)=\sin x$, $g(x)=\cos\left(\dfrac{\pi}{2}-x\right)$는 같은 함수이다. / ④ 함수 $h(x)=\tan\left\{a\left(x+\dfrac{\pi}{6}\right)\right\}$의 주기가 $\dfrac{\pi}{3}$일 때, $h\left(\dfrac{\pi}{6}\right)=\sqrt{3}$이다. / ⑤ 함수 $y=2\tan 4x+1$의 점근선의 방정식이 $x=k\pi$($k$는 실수)일 때, 가장 작은 양수 $k$의 값은 $\dfrac{1}{8}$이다.
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> ①의 주기는 $\dfrac{2\pi}{2}=\pi$이고, ②의 최댓값·최솟값은 $5,1$이므로 차는 $4$이다. ③은 $\cos\left(\dfrac\pi2-x\right)=\sin x$이므로 참이다.
> ④의 주기가 $\dfrac\pi3$이면 $\dfrac\pi{|a|}=\dfrac\pi3$에서 $a=\pm3$이다. 따라서 $h\left(\dfrac\pi6\right)=\tan\left(\dfrac{a\pi}{3}\right)=\tan(\pm\pi)=0\ne\sqrt3$이다.
> ⑤의 점근선은 $4x=\dfrac\pi2+r\pi$에서 $x=\dfrac\pi8+\dfrac{r\pi}{4}$ ($r\in\mathbb Z$)이다. 이를 $x=k\pi$로 쓰면 $k=\dfrac18+\dfrac r4$이고, 가장 작은 양수는 $k=\dfrac18$이다. 따라서 옳지 않은 설명은 ④이다.

- **판정·핵심 연결·독립 검산:** 탄젠트의 주기에서 a=±3이며 h(π/6)=tan(±π)=0, ⑤ 점근선 k=1/8은 실제 성립한다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|14`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
$0 \le x \le 5$에서 정의된 세 함수 $f(x)=x^2-2x+3$, $g_1(x)=\log_2(x+1)$, $g_2(x)=\log_{\frac{1}{3}}(x+14)$가 있다. 함수 $(g_1 \circ f)(x)$의 최댓값을 $M$, $(g_2 \circ f)(x)$의 최솟값을 $m$이라 할 때, $Mm = k\log_3 19$를 만족한다. 정수 $k$의 값은? (4.5점)
```

- 원문 보기: ① $-6$ / ② $-5$ / ③ $-4$ / ④ $-3$ / ⑤ $-2$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> f(x)=(x-1)^2+2이고 0≤ x≤5에서 2≤ f(x)≤18이다.
> g_1은 증가함수이므로 M=log₂(18+1)=log₂ 19이다. 밑이 (1)/(3)인 로그함수는 감소하므로 g_2(f(x))의 최솟값은 f(x)=18일 때 m=log₁/₃32=-log₃ 32이다.
> Mm=-log₂ 19·5log₃ 2=-5log₃ 19이므로 k=-5이다. 정답은 ②이다.

- **판정·핵심 연결·독립 검산:** f의 최대가 18이고 증가 로그와 감소 로그를 각각 대입해 M=log₂19,m=-5log₃2, 곱은 -5log₃19다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|15`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
직선 $y=-3x$와 원 $x^2+y^2=10$와 만나는 점 중 제 $2$사분면 위의 점을 $\text{P}$, 제 $4$사분면 위의 점을 $\text{Q}$라 하자. 동경 $\text{OP}$가 나타내는 각의 크기를 $\theta_1$, 동경 $\text{OQ}$가 나타내는 각의 크기를 $\theta_2$라 할 때, $\sin\theta_1 + \cos\theta_2$의 값은? (4.9점)<br>(단, $x$축의 양의 방향을 시초선으로 한다.)
```

- 원문 보기: ① $\dfrac{\sqrt{10}}{5}$ / ② $\dfrac{3\sqrt{10}}{10}$ / ③ $\dfrac{2\sqrt{10}}{5}$ / ④ $\dfrac{\sqrt{10}}{2}$ / ⑤ $\dfrac{3\sqrt{10}}{5}$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 직선 y=-3x 위에서 원점으로부터 거리 √(10)인 점은 P=(-1,3), Q=(1,-3)이다. 두 점은 x^2+y^2=10을 만족하고 각각 제2, 제4사분면에 있다.
> 따라서 sinθ_1=(3)/(√(10)), cosθ_2=(1)/(√(10))이고 합은 (4)/(√(10))=(2√(10))/(5)이다. 정답은 ③이다.

- **판정·핵심 연결·독립 검산:** 원·직선 교점을 P=(-1,3),Q=(1,-3)으로 직접 계산해 sinθ1+cosθ2=4/√10이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|16`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
원 $C: x^2+y^2+6x-6y+14=0$이 있다. 원점 $\text{O}$와 원 $C$ 위의 점 $\text{P}$에 대하여 $2^{\frac{\overline{\text{OP}}}{3}}$가 자연수가 되게 하는 점 $\text{P}$의 개수는? (4.9점)
```

- 원문 보기: ① $3$개 / ② $4$개 / ③ $5$개 / ④ $6$개 / ⑤ $7$개
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 원을 완전제곱식으로 바꾸면 $(x+3)^2+(y-3)^2=4$이므로 중심 $O'=(-3,3)$, 반지름은 $2$이고 $OO'=3\sqrt2$이다.
> $2^{OP/3}=m\in\mathbb N$이면 $OP=3\log_2m$이다. 원점 중심의 반지름 $OP$인 원이 $C$와 만나려면 $3\sqrt2-2\le OP\le3\sqrt2+2$이어야 하므로
> $2^{(3\sqrt2-2)/3}\le m\le2^{(3\sqrt2+2)/3}$, 즉 약 $1.679\le m\le4.231$이다. 따라서 가능한 자연수는 $m=2,3,4$이다.

- **판정·핵심 연결·독립 검산:** 완전제곱한 원의 중심 거리 3√2와 반지름 2에 비추어 OP=3,3log₂3,6이 모두 두 교점을 가지므로 총 6점이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|17`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=a\sin(bx-c)+1$의 그래프가 다음 그림과 같을 때, 상수 $a, b, c$에 대하여 $abc$의 값은? (4.9점)<br>(단, $a<0, b>0, 0<c<\pi$이다.)<br><br><img src="assets/images/26_제일고_1학기_중간_고2_대수/q17.png" style="max-width: 480px; display: block; margin: 10px 0;">
```

- 원문 보기: ① $-5\pi$ / ② $-4\pi$ / ③ $-3\pi$ / ④ $-2\pi$ / ⑤ $-\pi$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 그래프의 최댓값 3, 최솟값 -1에서 진폭은 2이고 a<0이므로 a=-2이다.
> x=0과 x=(π)/(2)에서 연속한 최댓값을 가지므로 주기는 (π)/(2), 따라서 b=(2π)/(π/2)=4이다. x=0에서 최댓값이므로 -2sin(-c)=2, 즉 sin c=1이다. 0<c<π에서 c=(π)/(2)이다.
> 따라서 abc=(-2)·4·(π)/(2)=-4π이다. 정답은 ②이다.

- **판정·핵심 연결·독립 검산:** 원본 PNG에서 연속 최대가 x=0,π/2, 최대 3·최소 -1임을 확인했다; a=-2,b=4,c=π/2,abc=-4π다.
- 문제그림: `archive/assets/images/26_제일고_1학기_중간_고2_대수/q17.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|18`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x) = \log_2 |2x|$의 그래프와 $x$축과의 교점을 $\text{A}, \text{B}$, 곡선 $y=f(x)$와 직선 $y=3$의 교점을 $\text{C}, \text{D}$라 하자. 네 점 $\text{A}, \text{B}, \text{C}, \text{D}$로 이루어진 사각형의 넓이는? (4.9점)
```

- 원문 보기: ① $\dfrac{27}{2}$ / ② $14$ / ③ $\dfrac{29}{2}$ / ④ $15$ / ⑤ $\dfrac{31}{2}$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> x축과 만나는 점은 |2x|=1에서 A(-(1)/(2),0), B((1)/(2),0)이다.
> y=3과 만나는 점은 log₂|2x|=3, 즉 |2x|=8에서 C(-4,3), D(4,3)이다. 평행한 두 변의 길이는 각각 1,8이고 높이는 3이므로 넓이는 (1+8)/(2)·3=(27)/(2)이다. 정답은 ①이다.

- **판정·핵심 연결·독립 검산:** |2x|=1,8에서 x축·y=3 교점의 두 가로 길이 1,8과 높이 3인 사다리꼴 넓이 27/2다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|19`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
직선 $y=-\frac{2}{n}x+1$과 함수 $y=\sin\left(\frac{\pi x}{2}\right)$의 그래프가 제4사분면에서 만나는 서로 다른 점이 $3$개가 되도록 하는 모든 자연수 $n$의 값의 합은? (4.9점)
```

- 원문 보기: ① $36$ / ② $37$ / ③ $38$ / ④ $39$ / ⑤ $46$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 직선의 식을 $L_n(x)=1-\dfrac{2x}{n}$이라 하고, 두 그래프의 높이 차를 $F_n(x)=\sin\left(\dfrac{\pi x}{2}\right)-L_n(x)$라 하자.
> 제4사분면에서는 $y<0$이므로 $1-\dfrac{2x}{n}<0$, 즉 $x>\dfrac n2$이다. 또 사인값은 $-1$보다 작아질 수 없으므로 $1-\dfrac{2x}{n}\ge -1$, 따라서 $x\le n$이다. 그러므로 교점을 셀 범위는 $\dfrac n2<x\le n$이다. 특히 $x=n$은 제4사분면에 속할 수 있으므로 포함한다.
> 사인곡선의 음의 반주기는 $(2,4),(6,8),(10,12),\ldots$이고, 각 반주기의 양 끝에서 사인값은 $0$, 가운데에서 $-1$이다. 이 범위에서 직선은 $0$보다 작고 감소한다. 한 음의 반주기에서 사인곡선은 한 번 내려갔다 올라오는 그릇 모양이므로 직선과 최대 두 번 만나며, 양 끝에서 직선보다 위에 있고 가운데에서 아래에 있으면 두 번 만난다. 올라가는 반쪽에서는 사인값은 증가하고 직선은 감소하므로 교점은 많아야 하나이다.

- **판정·핵심 연결·독립 검산:** 제4사분면 교점의 x범위 n/2<x≤n을 고정하고 n=1..30의 수치 부호변화도 별도 확인해 정확히 3개인 n=7,12,13,14를 재현했다. 고급 삼각부등식의 교육적 난도는 후속 검수 대상이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|서술형 1`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
다음 각을 일반각 표현으로 나타내고, 제 몇 사분면의 각인지 서술하시오. (2점)<br><br><div style="border: 1px solid #333; padding: 10px; margin: 10px 0; text-align: center;">$$-\dfrac{7}{4}\pi$$</div>
```

- 원본 answer: `π/4+2nπ (n∈ℤ), 제1사분면`
- 기존 solution의 결정적 실제 발췌:

> 일반각으로 나타내면 -(7)/(4)π+2nπ이다. 이를 (π)/(4)+2(n-1)π로 정리할 수 있으므로 동경은 제1사분면에 있다.

- **판정·핵심 연결·독립 검산:** -7π/4+2π=π/4로 일반각 π/4+2nπ, 제1사분면이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|서술형 2`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
모든 실수 $x$에 대하여 부등식<br>$$x^2 - 2\sqrt{2}x\sin\left(\dfrac{\pi}{2}+\theta\right) - \sin(\pi-\theta)+1 > 0$$<br>이 성립하도록 하는 $\theta$의 범위에 대하여 $\tan\theta$ 값의 범위를 구하고 그 풀이 과정을 함께 서술하시오. (5.5점, 부분 점수 있음)<br>(단, $\theta \neq \dfrac{\pi}{2}, \dfrac{3\pi}{2}$이고 $0 < \theta < 2\pi$이다.)
```

- 원본 answer: `(-∞,-1/√3)∪(1/√3,∞)`
- 기존 solution의 결정적 실제 발췌:

> 주어진 식을 x에 대한 이차식으로 보면 x²−2√2 cosθ·x+1−sinθ이다. 이 식이 모든 실수 x에서 양수이려면 판별식이 음수여야 한다. 따라서 4(2cos²θ+sinθ−1)<0, 즉 2cos²θ+sinθ−1<0이다. s=sinθ라 두면 (1−s)(2s+1)<0이므로 s<−1/2이다. 0<θ<2π에서 7π/6<θ<11π/6이며 θ=3π/2는 제외된다. 이 구간에서 tanθ의 범위는 (−∞,−1/√3)∪(1/√3,∞)이다.

- **판정·핵심 연결·독립 검산:** 전 실수 x 양수 조건은 이차식 판별식 <0이며 s=sinθ에 대해 (1-s)(2s+1)<0이어서 tan의 두 열린 범위를 얻는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|서술형 3`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
$1$보다 큰 자연수 $n$에 대하여 $n^2 - 13n + 30$의 $n$제곱근 중 서로 다른 실수인 것의 개수를 $f(n)$이라 할 때,<br>$$f(2) + f(3) + f(4) + \cdots + f(11) + f(12)$$<br>의 값을 구하고 그 풀이 과정을 함께 서술하시오. (5.5점, 부분 점수 있음)
```

- 원본 answer: `10`
- 기존 solution의 결정적 실제 발췌:

> 인수분해하면 n²−13n+30=(n−3)(n−10)이다. n=2부터 12까지 대입하여 부호와 n의 짝홀을 함께 확인한다. 양수의 짝수제곱근은 서로 다른 두 실수, 양수의 홀수제곱근은 한 실수이다. 음수는 n이 홀수일 때 한 실수, 짝수일 때 실수가 없고, 0은 한 실수이다.
> n=2: 8>0이고 짝수이므로 2개이다. n=3: 0이므로 1개이다. n=4: −6, n=6: −12, n=8: −10은 음수이고 짝수 지수이므로 각각 0개이다. n=5: −10, n=7: −12, n=9: −6은 음수이고 홀수 지수이므로 각각 1개이다. n=10: 0이므로 1개이다. n=11: 8>0이고 홀수이므로 1개이다. n=12: 18>0이고 짝수이므로 2개이다.
> 따라서 합은 2+1+0+1+0+1+0+1+1+1+2=10이다.

- **판정·핵심 연결·독립 검산:** (n-3)(n-10)의 부호와 홀짝을 n=2..12에 대조해 실수인 거듭제곱근 개수 합이 10이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `sha256:e9f7bb365108d2362064151bc418cb3f862a01bc810124ad5c6e561a0334fca1|서술형 4`; 원본 blob: `fe6fc8eb7b2b07758f591a38106fb1c1030d76c8`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x)$를<br>$$f(x) = \begin{cases} x+11 & (x < -3) \\ |2^{1-x}-8| & (x \ge -3) \end{cases}$$<br>라 하자. $|n| \le 10$인 정수 $n$에 대하여 직선 $y=n$과 함수 $y=f(x)$의 그래프가 만나는 서로 다른 교점의 개수를 $g(n)$이라 하자. 함수 $f(x)$의 그래프를 그리고 $g(n_1)+g(n_2)=3$이 되는 순서쌍 $(n_1, n_2)$의 개수를 풀이 과정과 함께 서술하시오. (7점, 부분 점수 있음)
```

- 원본 answer: `50`
- 기존 solution의 결정적 실제 발췌:

> x<-3에서는 y=x+11이므로 수평선 y=n과의 교점은 n<8일 때 하나이다. x≥-3에서 y=|2^(1-x)-8|의 값은 0 이상 8 이하이다.
> n<0이면 선형 부분에서만 1개, n=0이면 선형 부분과 절댓값 그래프에서 각각 1개, 1≤ n≤7이면 선형 부분 1개와 절댓값 그래프 2개로 총 3개, n=8이면 x=-3에서 1개, n=9,10이면 0개이다.
> 따라서 g(n)=1인 n은 -10부터 -1까지와 8로 11개, g(n)=2인 n은 0 하나, g(n)=3인 n은 1부터 7까지 7개, g(n)=0인 n은 9,10 두 개이다. 합이 3인 순서쌍은 (g(n_1),g(n_2))=(1,2),(2,1),(0,3),(3,0)인 경우이다.

- **판정·핵심 연결·독립 검산:** x<-3의 직선 가지와 x≥-3의 절댓값 지수 가지를 따로 세면 g(n)=1인 11개, g=2인 1개, g=3인 7개, g=0인 2개로 50쌍이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 종료·후속

- 분모 검증: 23+0+0+0=23; 각 문항에는 원본 content/answer/solution 실제 발췌와 특정 계산 근거가 있다.
- 작성된 학생용 UPGRADE: NONE; 미완성 개선: NONE.
- HOLD: NONE (출고 차단·원본 확인 사항 유지).
- 원본 그림 PNG 실물 열람: 1건; 이미지가 전혀 없는 문항은 이미지 대조 대상에서 제외. 필수 시각 PASS·학생 화면 렌더·최종 수학 출고 검수는 `NOT_RUN`.
- JS, SVG, main, 공유 claim 파일 직접 수정: 없음. 본인 브랜치 MD 초안만 기록.
