# 2026 26_강남여고_1학기_중간_고2_대수.js — 대수 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2026`
- source: `archive/exams/original/high/h2/1mid/26_강남여고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `89be29594b16bde39f5d64fbd082ec61386df68f`
- standardCourse (전 문항): `대수`, 2022 개정 대수; 구 수학Ⅰ 대응 범위
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/26_강남여고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `25` · actual question/answer/solution read: `25` · KEEP 24 · UPGRADE 1 · HOLD 0 · UNREAD 0
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

- Q19: `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q19.png` (Git blob `1cb3191f1b115806229f2b4d8384b7a671610bee`), 실제 PNG 로드·시각 판독: O 중심 부채꼴과 P,Q의 안쪽 원호, AP/BQ 경계가 확인됨

학생 렌더 `NOT_RUN`; Golden/Negative 최종 QA `NOT_RUN`; 출고 `NOT_RUN`; SVG/JS 변조 `NONE`; 비그림 문제의 종이 원본 이미지/스캔 대조 `NOT_RUN`.

## 전 문항 심층 감사

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
실수 범위에서
다음 중 옳은 것은? (3점)
```

- 원문 보기: ① $\sqrt[5]{-32}=-2$ / ② $\sqrt[5]{32}=\pm2$ / ③ $\sqrt[4]{16}=-2$ / ④ $\sqrt[3]{-8}=2$ / ⑤ $\sqrt{(-3)^2}=-3$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 홀수 제곱근은 음수도 실수로 나타낼 수 있고, 짝수 제곱근 기호는 음이 아닌 값을 나타낸다. 각 보기를 확인한다.
> ① $(-2)^5=-32$이므로 $\sqrt[5]{-32}=-2$이다.
> ② $2^5=32$이므로 $\sqrt[5]{32}=2$이다. 홀수 제곱근의 실수값은 하나이므로 $\pm2$가 아니다.

- **판정·핵심 연결·독립 검산:** 홀수근 (-2)^5=-32와 짝수근의 비음수 원칙을 ①~⑤ 모두 대조했고, ⑤는 √9=3이므로 ①만 성립한다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
다음 중 옳지 않은 것은? (3점)
```

- 원문 보기: ① $\left(\dfrac14\right)^0=1$ / ② $(-3)^{-3}=-\dfrac1{27}$ / ③ $(2\times3)^{-2}=\dfrac1{36}$ / ④ $\sqrt[3]{125}+9^{\frac12}=8$ / ⑤ $(3\times4)^{\frac13}\div6^{\frac13}=2$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> ① $\left(\dfrac14\right)^0=1$이다.
> ② $(-3)^{-3}=-\dfrac1{27}$이다.
> ③ $(2\times3)^{-2}=6^{-2}=\dfrac1{36}$이다.

- **판정·핵심 연결·독립 검산:** ⑤는 (12/6)^(1/3)=∛2이고 나머지는 각각 1,-1/27,1/36,8임이 전개되어 있다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_a16=4$, $\log_{\frac15}25=b$일 때, $a^b$의 값은? (3점)
```

- 원문 보기: ① $-4$ / ② $-\dfrac14$ / ③ $1$ / ④ $\dfrac14$ / ⑤ $4$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $\log_a16=4$이므로 $a^4=16$이다. $a>0$, $a\ne1$에서 $a=2$이다.
> $\log_{\frac15}25=b$에서 $\left(\dfrac15\right)^b=25=5^2$이다.
> $5^{-b}=5^2$이므로 $b=-2$이다.

- **판정·핵심 연결·독립 검산:** a^4=16의 양의 로그 밑 a=2와 b=-2를 따로 구해 a^b=1/4로 끝나는 연결이 정확하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
다음 중 각을 나타내는 동경이 제3사분면에 존재하는 것은? (3점)
```

- 원문 보기: ① $\dfrac{11\pi}{3}$ / ② $\dfrac{25\pi}{6}$ / ③ $\dfrac{49\pi}{9}$ / ④ $-\dfrac{17\pi}{12}$ / ⑤ $-\dfrac{34\pi}{15}$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 각을 $2\pi$의 정수배만큼 더하거나 빼어 $0\le\theta<2\pi$로 나타낸다.
> ① $\dfrac{11\pi}{3}-2\pi=\dfrac{5\pi}{3}$이므로 제4사분면이다.
> ② $\dfrac{25\pi}{6}-4\pi=\dfrac{\pi}{6}$이므로 제1사분면이다.

- **판정·핵심 연결·독립 검산:** 각 선택지를 2π로 환원했고 13π/9만 π와 3π/2 사이임을 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
원점 $O$와 점 $P(-3,-4)$를 지나는 동경 $OP$가 나타내는 각의 크기를 $\theta$라고 할 때, $\tan\theta\times(\sin\theta+\cos\theta)$의 값은? (3점)
```

- 원문 보기: ① $-\dfrac{12}{5}$ / ② $-\dfrac{28}{15}$ / ③ $-\dfrac{16}{25}$ / ④ $\dfrac{16}{25}$ / ⑤ $\dfrac{28}{15}$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> $OP=\sqrt{(-3)^2+(-4)^2}=5$이고 $P$는 제3사분면에 있다.
> $\sin\theta=-\dfrac45$, $\cos\theta=-\dfrac35$, $\tan\theta=\dfrac43$이다.
> 따라서

- **판정·핵심 연결·독립 검산:** 반지름 5에서 sin=-4/5, cos=-3/5, tan=4/3이므로 곱 -28/15가 직접 나온다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
$\log 4.19=0.6222$일 때, $\log 419=a$, $\log 0.0419=b$이다. $a-b$의 값은? (3.5점)
```

- 원문 보기: ① $4$ / ② $2$ / ③ $1$ / ④ $-2$ / ⑤ $-4$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> $419=4.19\times100$이므로
> $a=\log4.19+\log100=0.6222+2=2.6222$이다.
> $0.0419=4.19\div100$이므로

- **판정·핵심 연결·독립 검산:** 419=4.19×10², 0.0419=4.19×10^-2이므로 로그 차가 정확히 4이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
다음 중 옳지 않은 것은? (3.5점)
```

- 원문 보기: ① 함수 $y=\sin x$의 정의역은 실수 전체의 집합이고 치역은 $\{y\mid-1\le y\le1\}$이다. / ② 함수 $y=\tan x$의 정의역과 치역은 실수 전체의 집합이다. / ③ 함수 $y=\sin x$의 그래프는 원점에 대하여 대칭이다. / ④ 함수 $y=\cos x$의 그래프는 $y$축에 대하여 대칭이다. / ⑤ 함수 $y=\tan x$는 주기가 $\pi$인 주기함수이다.
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> ① 사인함수는 모든 실수에서 정의되고 치역은 $[-1,1]$이므로 참이다.
> ② 탄젠트함수는 $x=\dfrac{\pi}{2}+n\pi$에서 정의되지 않으므로 정의역은 실수 전체가 아니다. 거짓이다.
> ③ $\sin(-x)=-\sin x$이므로 그래프는 원점 대칭이다.

- **판정·핵심 연결·독립 검산:** tan의 정의역 제외점 π/2+nπ를 명시했고 sin 홀함수·cos 짝함수 및 tan 주기 판단이 정확하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — UPGRADE

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
두 함수 $y=3^x$, $y=9\times3^x$의 그래프와 두 직선 $y=1$, $y=9$로 둘러싸인 도형의 넓이는? (3.5점)
```

- 원문 보기: ① $4$ / ② $8$ / ③ $12$ / ④ $16$ / ⑤ $20$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $y=3^x$에서 $x=\log_3 y$이고, $y=9\times3^x$에서 $x=\log_3\dfrac y9=\log_3 y-2$이다.
> 따라서 $1\le y\le9$에서 두 그래프 사이의 가로 길이는 항상 2이다.
> 도형의 넓이는

- **판정·핵심 연결·독립 검산:** 기존 풀이의 '∫_1^9 2dy'는 대수 교육과정 밖 적분을 사용한다. y에 따른 두 그래프의 가로 간격이 정확히 2임을 확인했으며, 폭 2·높이 8의 동일 수평단면 넓이 설명으로 교체한다.
- 그림: 원문 별도 image 미지정

**UPGRADE 원문 A→B 결함·개선 사유:** 기존 풀이의 '∫_1^9 2dy'는 대수 교육과정 밖 적분을 사용한다. y에 따른 두 그래프의 가로 간격이 정확히 2임을 확인했으며, 폭 2·높이 8의 동일 수평단면 넓이 설명으로 교체한다.

**완성 학생용 대체 solution (독립 검산 포함):**

두 지수함수의 그래프는 서로 가로로 2만큼 평행이동한 관계에 있다.

$$
9\cdot3^x=3^{x+2}.
$$

같은 높이 $y$에서 두 그래프의 $x$좌표를 구하면

$$
\begin{aligned}
y=3^x &\iff x=\log_3 y,\\
y=9\cdot3^x &\iff x=\log_3\frac y9=\log_3 y-2.
\end{aligned}
$$

따라서 높이 $1\le y\le9$에서 두 그래프 사이의 가로 길이는 항상

$$
\log_3 y-(\log_3 y-2)=2
$$

이다. 모든 수평단면의 길이가 같은 직사각형(가로 2, 세로 $9-1=8$)과 넓이가 같으므로

$$
\text{도형의 넓이}=2(9-1)=2\cdot8=\boxed{16}.
$$

정답은 ④이다. **독립 검산:** $y=1$과 $y=9$에서 각각 두 경계의 $x$좌표는 $(-2,0)$과 $(0,2)$이므로 양쪽 가로 폭이 모두 2이다. 적분을 사용하지 않았다.

- 상태: `DRAFT_STAGED`, QA/학생 렌더 `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=3^x$의 그래프를 직선 $y=x$에 대하여 대칭이동한 후, $x$축의 방향으로 $a$만큼, $y$축의 방향으로 $-3$만큼 평행이동한 그래프는 점 $(11,-1)$을 지나고, 이 그래프의 점근선은 직선 $x=b$이다. $ab$의 값은? (단, $a,b$는 상수이다.) (3.5점)
```

- 원문 보기: ① $-4$ / ② $-3$ / ③ $-2$ / ④ $3$ / ⑤ $4$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $y=3^x$를 $y=x$에 대하여 대칭이동하면 역함수 $y=\log_3x$가 된다.
> 이를 오른쪽으로 $a$, 아래로 3만큼 옮기면 $y=\log_3(x-a)-3$이다.
> $(11,-1)$을 대입하면

- **판정·핵심 연결·독립 검산:** 역함수 대칭을 거친 y=log3(x-a)-3에 (11,-1)을 대입하면 11-a=9이고 점근선 x=a로 a=b=2를 재확인한다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
1이 아닌 양수 $a$와 자연수 $n$에 대하여 $f(n)=\sqrt{\sqrt[3]{a\sqrt{a^{n+1}}}}$일 때, $\dfrac{f(1)\times f(2)}{f(3)}$의 값은? (4점)
```

- 원문 보기: ① $\sqrt[4]{a}$ / ② $\sqrt[4]{a^3}$ / ③ $\sqrt[4]{a^5}$ / ④ $\sqrt[6]{a^7}$ / ⑤ $\sqrt[12]{a^{13}}$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 중첩된 근호를 거듭제곱으로 바꾸면
> $f(n)=\left(a\cdot a^{\frac{n+1}{2}}\right)^{\frac16}$.
> 따라서

- **판정·핵심 연결·독립 검산:** 양수 a 조건에서 중첩근호의 지수를 (n+3)/12로 바꾸고 4+5-6=3이므로 a^(1/4)이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $n$에 대하여 $\sqrt[3]{\dfrac{24}{n}}$이 자연수가 되도록 하는 모든 $n$의 값의 합은? (4점)
```

- 원문 보기: ① $6$ / ② $12$ / ③ $18$ / ④ $27$ / ⑤ $36$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $\sqrt[3]{\dfrac{24}{n}}=m$인 자연수 $m$이 있다고 하자.
> 그러면 $n=\dfrac{24}{m^3}$이 자연수여야 한다.
> $m^3$이 24의 약수인 경우는 $m=1,2$이다.

- **판정·핵심 연결·독립 검산:** m³가 24의 약수일 조건에서 가능한 m=1,2만 존재하며 n=24,3의 합은 27이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
1이 아닌 두 양수 $a,b$에 대하여 $\dfrac{\log_3 a}{\log_3 b}=\dfrac32$일 때, $b^{\log_a\frac18}$의 값은? (4점)
```

- 원문 보기: ① $\dfrac12$ / ② $\dfrac14$ / ③ $1$ / ④ $2$ / ⑤ $4$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 주어진 조건에서
> $\dfrac{\log a}{\log b}=\dfrac32$이므로 $\dfrac{\log b}{\log a}=\dfrac23$이다.
> $E=b^{\log_a(\frac{1}{8})}$라 두면

- **판정·핵심 연결·독립 검산:** 로그 밑변환으로 log b/log a=2/3을 얻어 b^(log_a 1/8)=(1/8)^(2/3)=1/4이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
부등식 $n\le\log 24^{10}<n+1$을 만족시키는 자연수 $n$의 값은? (단, $\log2=0.3010$, $\log3=0.4771$로 계산한다.) (4점)
```

- 원문 보기: ① $11$ / ② $12$ / ③ $13$ / ④ $15$ / ⑤ $17$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> $24^{10}$의 상용로그를 계산한다.
> $\log24^{10}=10\log24$
> $=10(3\log2+\log3)$

- **판정·핵심 연결·독립 검산:** 24=2³·3을 쓰면 log 24^10=10(3×0.3010+0.4771)=13.801이므로 n=13이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
$\pi<\theta<\dfrac32\pi$이고 $\sin\theta-\cos\theta=\dfrac12$일 때, $\sin\theta+\cos\theta$의 값은? (4점)
```

- 원문 보기: ① $-\dfrac74$ / ② $-\dfrac{\sqrt7}{2}$ / ③ $\dfrac{\sqrt7}{2}$ / ④ $\dfrac74$ / ⑤ $\sqrt7$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 주어진 식을 제곱하면
> $(\sin\theta-\cos\theta)^2=\dfrac14$
> $1-2\sin\theta\cos\theta=\dfrac14$이므로 $\sin\theta\cos\theta=\dfrac38$이다.

- **판정·핵심 연결·독립 검산:** 제3사분면에서 sin,cos 모두 음수이고 합의 제곱이 7/4임을 계산해 음의 값을 골랐다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=-2\tan\dfrac{x}{2}$에 대한 설명으로 옳은 것만을 보기에서 있는 대로 고른 것은? (4점)
[보기]
ㄱ. 함수 $y=-2\tan\dfrac{x}{2}$를 $x$축의 방향으로 $\dfrac{\pi}{3}$만큼 평행이동하면 $y=-2\tan\left(\dfrac{x}{2}-\dfrac{\pi}{3}\right)$이다.
ㄴ. 함수 $y=-2\tan\dfrac{x}{2}$의 주기는 $2\pi$이다.
ㄷ. 함수 $y=-2\tan\dfrac{x}{2}$의 점근선은 직선 $x=2n\pi+\dfrac43\pi$이다.
ㄹ. 함수 $y=-2\tan\dfrac{x}{2}$의 최솟값은 $-2$, 최댓값은 $2$이다.
```

- 원문 보기: ① ㄱ / ② ㄴ / ③ ㄱ, ㄴ / ④ ㄴ, ㄷ / ⑤ ㄱ, ㄴ, ㄷ
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> ㄱ. $x$축 방향으로 $\pi/3$만큼 평행이동하면
> $y=-2\tan\left(\dfrac{x-\pi/3}{2}\right)=-2\tan\left(\dfrac x2-\dfrac\pi6\right)$이므로 보기의 식과 다르다. 거짓이다.
> ㄴ. $\tan u$의 주기는 $\pi$이므로 $\tan(\frac{x}{2})$의 주기는 $2\pi$이다. 참이다.

- **판정·핵심 연결·독립 검산:** ㄱ의 실제 평행이동은 x/2-π/6, ㄷ의 점근선은 (2n+1)π, ㄹ은 tan의 무계성으로 반박되어 ㄴ만 맞다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
지수함수 $y=2^{\frac{x}{2}}$의 그래프와 $x$축, $y$축 및 직선 $x=4$로 둘러싸인 도형과 그 내부에 있는 점 중 $x$좌표와 $y$좌표가 모두 정수인 점의 개수는? (4.5점)
```

- 원문 보기: ① $11$ / ② $12$ / ③ $13$ / ④ $14$ / ⑤ $15$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 정수 $x$를 $0,1,2,3,4$로 나누어 경계와 내부의 정수 $y$를 센다.
> $x=0$일 때 $0\le y\le1$이므로 2개이다.
> $x=1$일 때 $0\le y\le\sqrt2$이므로 2개이다.

- **판정·핵심 연결·독립 검산:** x=0~4에 대해 가능한 정수 y 개수 2,2,3,3,5를 모두 포함하여 합 15를 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
곡선 $y=\log_a x$ $(a>1)$이 $x$축, 직선 $y=2$와 만나는 점을 각각 $A,B$라 하고, 점 $B$에서 $x$축, $y$축에 내린 수선의 발을 각각 $C,D$라 하자. 사각형 $ACBD$의 넓이가 5일 때, 사각형 $ACBD$의 둘레의 길이는 $b+\sqrt c$이다. $\dfrac{b+c}{a^2}$의 값은? (4.5점)
```

- 원문 보기: ① $3$ / ② $4$ / ③ $5$ / ④ $6$ / ⑤ $7$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> $y=\log_a x$가 $x$축과 만나는 점은 $A=(1,0)$이고, $y=2$와 만나는 점은 $B=(a^2,2)$이다.
> 따라서 $C=(a^2,0)$, $D=(0,2)$이다.
> 사각형의 넓이는 밑변 길이 $AC=a^2-1$, 윗변 길이 $DB=a^2$, 높이 2인 사다리꼴이므로

- **판정·핵심 연결·독립 검산:** 사다리꼴 넓이 (a²-1+a²)·2/2=5에서 a²=3, 둘레 7+√5로 (7+5)/3=4이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
배양기에 들어있는 어느 미생물을 관찰하기 시작한 지 $x$시간 후의 미생물의 수를 $f(x)$라 하면 $f(x)=k\times3^{\frac{x}{a}}$ $(a,k는 실수)$인 관계가 성립한다고 한다. 미생물의 수가 27배로 증가하는 데 6시간이 걸린다고 할 때, 미생물의 수가 243배로 증가하는 데 걸리는 시간은? (4.5점)
```

- 원문 보기: ① $6$ / ② $8$ / ③ $10$ / ④ $12$ / ⑤ $14$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 6시간 동안 증가한 배율은
> $3^{\frac{6}{a}}=27=3^3$이므로 $\frac{6}{a}=3$, $a=2$이다.
> 243배는 $3^5$배이므로 필요한 시간을 $t$라 하면

- **판정·핵심 연결·독립 검산:** 6시간에 3³배이므로 a=2, 3⁵배에 걸리는 시간은 5a=10으로 비율이 맞는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
그림과 같이 중심이 $O$이고 반지름의 길이가 $r$인 부채꼴 $OAB$에 대하여 선분 $OA$를 $2:1$로 내분하는 점을 $P$라 하고, 중심이 $O$이고 반지름의 길이가 $OP$인 원이 선분 $OB$와 만나는 점을 $Q$라 하자. 호 $AB$, 호 $PQ$와 두 선분 $AP$, $BQ$로 둘러싸인 부분의 둘레의 길이가 $\dfrac{23}{3}$, 넓이가 $\dfrac{10}{3}$일 때, $r$의 값의 곱은? (4.5점)
```

- 원문 보기: ① $30$ / ② $40$ / ③ $45$ / ④ $50$ / ⑤ $60$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> $OA$를 $2:1$로 내분하므로 $OP=\dfrac{2r}{3}$, $AP=\dfrac r3$이다. 또 $OQ=OP$이므로 $BQ=\dfrac r3$이다. 부채꼴의 중심각을 $\theta$라 하자.
> 둘레 조건에서
> $r\theta+\dfrac{2r}{3}\theta+\dfrac r3+\dfrac r3=\dfrac{23}{3}$

- **판정·핵심 연결·독립 검산:** 실물 부채꼴 PNG에서 P,Q가 내측 원호와 AP,BQ 경계를 구성함을 확인했다. 5rθ+2r=23, r²θ=12에서 r=4 또는 15/2이므로 곱 30이다.
- 문제그림: `archive/assets/images/26_강남여고_1학기_중간_고2_대수/q19.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
직선 $y=-\dfrac13x+\dfrac23$을 $l$이라 하자.
직선 $l$이 $x$축의 양의 방향과 이루는 둔각의 크기를 $\theta$라 할 때,
$\sin(\pi+\theta)\times\sin\left(\theta-\dfrac32\pi\right)=\dfrac qp$이다. $pq$의 값은? (단, $p$와 $q$는 서로소인 자연수이다.) (4.5점)
```

- 원문 보기: ① $-30$ / ② $-24$ / ③ $13$ / ④ $24$ / ⑤ $30$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 직선의 기울기는 $-\frac{1}{3}$이고 $\theta$는 둔각이므로 $\tan\theta=-\frac{1}{3}$이다.
> $\sin(\pi+\theta)=-\sin\theta$이고 $\sin(\theta-3\pi/2)=\cos\theta$이다.
> 따라서 곱은 $-\sin\theta\cos\theta$이다.

- **판정·핵심 연결·독립 검산:** 기울기 -1/3인 둔각에서 sinθcosθ=tanθ/(1+tan²θ)=-3/10, 주어진 두 사인의 곱은 +3/10이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
$0\le x<2\pi$일 때, 방정식 $|4\cos2x+1|=3$의 모든 해의 합은? (4.5점)
```

- 원문 보기: ① $\dfrac{11}{2}\pi$ / ② $6\pi$ / ③ $\dfrac{13}{2}\pi$ / ④ $7\pi$ / ⑤ $\dfrac{15}{2}\pi$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 절댓값을 나누어 푼다.
> $4\cos2x+1=3$이면 $\cos2x=\frac{1}{2}$이므로 $x=\pi/6,5\pi/6,7\pi/6,11\pi/6$이다.
> $4\cos2x+1=-3$이면 $\cos2x=-1$이므로 $x=\pi/2,3\pi/2$이다.

- **판정·핵심 연결·독립 검산:** cos2x=1/2의 네 해와 cos2x=-1의 두 해가 겹치지 않고 합이 6π이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
[서논술형]
※ 풀이과정 없이 답만 적은 경우 0점 처리하며, 풀이과정을 알아볼 수 있도록 OCR 답안지 서술형 답란에 볼펜으로 작성하시기 바랍니다.
[서술형 1] 각 $\theta$가 제2사분면의 각일 때, 각 $\dfrac{\theta}{2}$를 나타내는 동경이 존재할 수 있는 사분면을 모두 구하시오. (4점)
```

- 원본 answer: `제1사분면 또는 제3사분면`
- 기존 solution의 결정적 실제 발췌:

> $\theta$가 나타내는 동경이 제2사분면에 있으므로 대표각은 $\pi/2<\alpha<\pi$이다.
> $\theta=\alpha+2n\pi$라 두면 $\theta/2=\alpha/2+n\pi$이다.
> $\pi/4<\alpha/2<\pi/2$이므로 $\alpha/2$는 제1사분면에 있다.

- **판정·핵심 연결·독립 검산:** θ=α+2nπ(π/2<α<π)로 놓아 θ/2=α/2+nπ가 1·3사분면만 가능함을 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
[서논술형]
[서술형 2] 두 자연수 $a,b$에 대하여 $\log a-2=\log2-\log b$를 만족시키는 $a,b$의 모든 순서쌍 $(a,b)$의 개수를 구하시오. (5점)
```

- 원본 answer: `12`
- 기존 solution의 결정적 실제 발췌:

> $\log a-2=\log2-\log b$에서 $2=\log100$을 이용하면
> $\log a+\log b=\log2+2=\log200$이다.
> 따라서 $\log(ab)=\log200$이므로 $ab=200$이다.

- **판정·핵심 연결·독립 검산:** ab=200=2³·5², a의 양의 약수 12개가 각각 하나의 b를 정하므로 순서쌍은 12개다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
[서논술형]
[서술형 3] 세 양수 $a,b,c$에 대하여 $a^3=5$, $b^5=3$, $c^6=2$일 때, $(abc)^n$이 자연수가 되도록 하는 100 이하의 자연수 $n$의 값을 모두 구하시오. (5점)
```

- 원본 answer: `n=30, 60, 90`
- 기존 solution의 결정적 실제 발췌:

> $(abc)^n=a^nb^nc^n=5^{\frac{n}{3}}3^{\frac{n}{5}}2^{\frac{n}{6}}$이다.
> $(abc)^n$이 자연수가 되려면 서로 다른 소수 $5$, $3$, $2$의 지수 $\dfrac n3$, $\dfrac n5$, $\dfrac n6$이 모두 음이 아닌 정수여야 한다.
> 따라서 $n$은 $3$, $5$, $6$의 공배수이다.

- **판정·핵심 연결·독립 검산:** 세 서로 다른 소수 5,3,2의 지수가 각각 정수여야 하므로 n은 lcm(3,5,6)=30의 배수 30·60·90이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q25 — KEEP

- source ordinal/id: `25` / `25`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `89be29594b16bde39f5d64fbd082ec61386df68f`
- 원문 문제·조건(소스 content 그대로):

```text
[서논술형]
[서술형 4] $0\le x<2\pi$일 때, 두 부등식 $\sin^2x-\cos^2x-\cos x>0$, $\sin x>\cos x$를 동시에 만족시키는 $x$의 값의 범위를 구하시오. (6점)
```

- 원본 answer: `$\dfrac\pi3<x<\pi$ 또는 $\pi<x<\dfrac54\pi$`
- 기존 solution의 결정적 실제 발췌:

> 첫째 부등식에서 $\sin^2x=1-\cos^2x$이므로
> $1-2\cos^2x-\cos x>0$이다.
> 이를 인수분해하면

- **판정·핵심 연결·독립 검산:** 첫 부등식은 -1<cos x<1/2(π 제외), 둘째는 π/4<x<5π/4이므로 교집합이 두 열린 구간으로 분리된다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 종료·후속

- 분모 검증: 24+1+0+0=25; 각 문항에는 원본 content/answer/solution 실제 발췌와 특정 계산 근거가 있다.
- 작성된 학생용 UPGRADE: Q8; 미완성 개선: NONE.
- HOLD: NONE (출고 차단·원본 확인 사항 유지).
- 원본 그림 PNG 실물 열람: 1건; 이미지가 전혀 없는 문항은 이미지 대조 대상에서 제외. 필수 시각 PASS·학생 화면 렌더·최종 수학 출고 검수는 `NOT_RUN`.
- JS, SVG, main, 공유 claim 파일 직접 수정: 없음. 본인 브랜치 MD 초안만 기록.
