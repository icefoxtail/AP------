# 2026 26_금당고_1학기_중간_고2_대수.js — 대수 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2026`
- source: `archive/exams/original/high/h2/1mid/26_금당고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `63f268b1aea9406182a7839d08f637e0d3494470`
- standardCourse (전 문항): `대수`, 2022 개정 대수; 구 수학Ⅰ 대응 범위
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/26_금당고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 20 · UPGRADE 1 · HOLD 0 · UNREAD 0
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

- Q8: `archive/assets/images/26_금당고_1학기_중간_고2_대수/q08.png` (Git blob `6143c401c2ac7b4258e435472119ea168002eb8e`), 실제 PNG 로드·시각 판독: 그래프에 x=1, y=a, y=32, x=b 표시가 보임

학생 렌더 `NOT_RUN`; Golden/Negative 최종 QA `NOT_RUN`; 출고 `NOT_RUN`; SVG/JS 변조 `NONE`; 비그림 문제의 종이 원본 이미지/스캔 대조 `NOT_RUN`.

## 전 문항 심층 감사

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$\left(\frac{b^3}{a^2}\right)^2\times\left(\sqrt[3]{a^4}\right)^3$을 간단히 하면은? (단, $a>0$, $b\ne0$) [3점]
```

- 원문 보기: ① $a^2$ / ② $b^3$ / ③ $a^4$ / ④ $b^5$ / ⑤ $b^6$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 지수법칙과 거듭제곱근을 차례로 정리한다.
> $\left(\frac{b^3}{a^2}\right)^2=\frac{b^6}{a^4}$,
> $\left(\sqrt[3]{a^4}\right)^3=a^4$이다.

- **판정·핵심 연결·독립 검산:** a>0에 대해 (∛a⁴)³=a⁴이고 (b³/a²)²=b⁶/a⁴이므로 약분 뒤 b⁶만 남는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_3 6+\log_3 5-\frac{1}{\log_{10}3}$의 값은? [3점]
```

- 원문 보기: ① 0 / ② 1 / ③ 2 / ④ $\log_3 20$ / ⑤ $\log_3 22$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 역수 관계를 이용해 밑을 맞춘다.
> $\frac{1}{\log_{10}3}=\log_3 10$이므로
> $\log_3 6+\log_3 5-\log_3 10$

- **판정·핵심 연결·독립 검산:** 1/log10 3=log3 10을 대입하면 log3(30/10)=log3 3=1이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=\left(\frac13\right)^x$의 역함수를 $y=\log_a x$라 하자. $a$의 값은? [3점]
```

- 원문 보기: ① $\frac13$ / ② $\frac12$ / ③ 1 / ④ 2 / ⑤ 3
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 지수함수 $y=(\frac{1}{3})^x$의 역함수는 밑이 같은 로그함수이다.
> $x=\left(\frac13\right)^y$
> 에서

- **판정·핵심 연결·독립 검산:** x=(1/3)^y로 변수 교환하면 y=log_(1/3)x이므로 밑 a=1/3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$\cos\frac{13\pi}{6}$의 값으로 올바른 것은? [3.2점]
```

- 원문 보기: ① $-\frac12$ / ② $\frac12$ / ③ $\frac{\sqrt3}{2}$ / ④ $-\frac{\sqrt3}{2}$ / ⑤ 1
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 각을 한 바퀴만큼 줄인다.
> $\frac{13\pi}{6}=2\pi+\frac{\pi}{6}$이므로
> $\cos\frac{13\pi}{6}=\cos\frac{\pi}{6}=\frac{\sqrt3}{2}$.

- **판정·핵심 연결·독립 검산:** 13π/6에서 2π를 빼 π/6의 코사인 √3/2를 얻는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$y=\sin 2x+3$의 치역으로 올바른 것은? [3.3점]
```

- 원문 보기: ① $\{y\mid -3\le y\le3\}$ / ② $\{y\mid -3\le y\le-1\}$ / ③ $\{y\mid 1\le y\le3\}$ / ④ $\{y\mid 2\le y\le4\}$ / ⑤ $\{y\mid 3\le y\le5\}$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 사인함수의 값의 범위는
> $-1\le\sin 2x\le1$이다.
> 각 변에 3을 더하면

- **판정·핵심 연결·독립 검산:** -1≤sin2x≤1에 3을 더하면 치역 [2,4]가 된다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$740^\circ$의 동경이 나타내는 일반각을 $360^\circ\times n+\alpha^\circ$로 올바르게 나타낸 것은? (단, $n$은 정수) [3.5점]
```

- 원문 보기: ① $360^\circ\times n+10^\circ$ / ② $360^\circ\times n+20^\circ$ / ③ $360^\circ\times n+30^\circ$ / ④ $360^\circ\times n+40^\circ$ / ⑤ $360^\circ\times n+50^\circ$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 동경이 같아지는 각은 $360^\circ$의 정수배만큼 차이 난다.
> $740^\circ=2\cdot360^\circ+20^\circ$이므로
> $360^\circ n+20^\circ$의 꼴이다.

- **판정·핵심 연결·독립 검산:** 740=2×360+20으로 동경의 일반각은 360n+20도이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$n\ge2$인 자연수 $n$에 대하여 $-2n^2+9n$의 $n$제곱근 중에서 실수인 것의 개수를 $f(n)$이라 할 때, $f(3)+f(4)+f(5)+f(6)+f(7)$의 값은? [4점]
```

- 원문 보기: ① 5 / ② 6 / ③ 7 / ④ 8 / ⑤ 9
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 각 $n$에서 근호 안의 수의 부호와 $n$의 홀짝을 본다.
> $n=3$: $-2(3)^2+9(3)=9>0$이고 홀수 제곱근이므로 실근은 1개이다.
> $n=4$: $-2(4)^2+9(4)=4>0$이고 짝수 제곱근이므로 실근은 2개이다.

- **판정·핵심 연결·독립 검산:** n=3~7의 안쪽 수 부호 +,+,-,-,-와 지수 홀짝에 따른 실근 수 1,2,1,0,1의 합이 5이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=2^x$의 그래프가 오른쪽 그림과 같을 때, $b-a$의 값은? [4점]
```

- 원문 보기: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 6
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 그래프에서 $x=1$일 때의 함수값이 $a$이다.
> $a=2^1=2$.
> 또 $y=32$인 점의 $x$좌표가 $b$이므로

- **판정·핵심 연결·독립 검산:** 실물 PNG의 표시 a는 x=1에서 y=2, b는 y=32에서 x=5임을 확인해 b-a=3이다.
- 문제그림: `archive/assets/images/26_금당고_1학기_중간_고2_대수/q08.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $y=\log_4(x+a)+b$의 그래프가 점 $(6,0)$을 지나고 점근선이 직선 $x=-2$일 때, $a+b$의 값은? [4점]
```

- 원문 보기: ① $-\frac32$ / ② $-\frac12$ / ③ 0 / ④ $\frac12$ / ⑤ $\frac32$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 로그함수 $y=\log_4(x+a)+b$의 점근선은 $x=-a$이다.
> $-a=-2$에서 $a=2$이다.
> 점 $(6,0)$을 대입하면

- **판정·핵심 연결·독립 검산:** 점근선 x=-a=-2에서 a=2, (6,0)에서 b=-log4 8=-3/2이므로 합 1/2이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$\theta$가 제2사분면의 각이고 $\sin\theta\cos\theta=-\frac14$일 때, $\sin^4\theta+\cos^4\theta$의 값은? [4점]
```

- 원문 보기: ① $\frac38$ / ② $\frac12$ / ③ $\frac58$ / ④ $\frac34$ / ⑤ $\frac78$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 제곱의 합과 곱을 이용해 네제곱의 합으로 바꾼다.
> $\sin^4\theta+\cos^4\theta$
> $=(\sin^2\theta+\cos^2\theta)^2-2\sin^2\theta\cos^2\theta$.

- **판정·핵심 연결·독립 검산:** sin⁴+cos⁴=1-2(sin cos)²=1-2/16=7/8로 각의 사분면이 결과에 영향 없다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
다음 중 $\sin\theta+\cos\theta<0$이고 $\sin\theta\cos\theta>0$을 동시에 만족시키는 각 $\theta$의 크기가 될 수 있는 것은? [4점]
```

- 원문 보기: ① $\frac25\pi$ / ② $\frac45\pi$ / ③ $\frac65\pi$ / ④ $\frac85\pi$ / ⑤ $\frac95\pi$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 곱이 양수이므로 $\sin\theta$와 $\cos\theta$는 같은 부호이다.
> 합이 음수이므로 두 값은 모두 음수이고, 따라서 $\theta$는 제3사분면에 있다.
> 선택지를 비교하면

- **판정·핵심 연결·독립 검산:** 곱이 양수·합이 음수이므로 sin,cos 둘 다 음수이고 후보 중 6π/5만 제3사분면이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
둘레의 길이가 12로 일정할 때, 부채꼴의 넓이가 최대가 되는 경우의 중심각의 크기 $\theta$를 호도법으로 올바르게 나타낸 것은? [4점]
```

- 원문 보기: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 6
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 반지름을 $r$이라 하면 호의 길이는 $r\theta$이므로 둘레 조건은
> $2r+r\theta=12$,
> $r=\frac{12}{\theta+2}$이다.

- **판정·핵심 연결·독립 검산:** 둘레 2r+rθ=12와 넓이 r²θ/2에서 (θ+2)²≥8θ를 이용해 θ=2에서 최대를 보였다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$\sqrt{\frac n3}$, $\sqrt[5]{\frac n2}$이 모두 자연수가 되도록 하는 자연수 $n$의 최솟값이 $n=2^a\times3^b$이다. 이때 $a+b$의 값은? [5점]
```

- 원문 보기: ① 7 / ② 9 / ③ 11 / ④ 13 / ⑤ 15
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 첫 번째 조건에서 $\frac{n}{3}$은 제곱수이고, 두 번째 조건에서 $\frac{n}{2}$는 다섯제곱수이다.
> 소인수 지수를 살핀다.
> $2^a$: $a-1$은 5의 배수이고 $a\ge1$이므로 최소 $a=6$이다.

- **판정·핵심 연결·독립 검산:** n/3이 제곱수 및 n/2가 다섯제곱수여야 하므로 2의 지수 최소 6, 3의 지수 최소 5이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $a$, $b$에 대하여 $a^4$이 7자리의 수이고, $ab^3$이 13자리의 수이다. 이때 $b$는 몇 자리의 수인가? [5점]
```

- 원문 보기: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 6
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> $a^4$이 7자리이므로
> $10^6\le a^4<10^7$,
> $32\le a\le56$이다.

- **판정·핵심 연결·독립 검산:** 32≤a≤56의 범위와 10¹²≤ab³<10¹³을 결합해 1000<b<10000, 즉 네 자리임을 도출했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
$x$에 대한 로그부등식 $\left(\log_2\frac xa\right)\left(\log_2\frac{x^2}a\right)+2\ge0$이 모든 양의 실수 $x$에 대하여 성립할 때, 양의 실수 $a$의 최솟값을 $m$이라 하자. 이때 $m$의 값은? [5점]
```

- 원문 보기: ① $\frac12$ / ② $\frac14$ / ③ $\frac18$ / ④ $\frac1{16}$ / ⑤ $\frac1{32}$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $t=\log_2x$, $A=\log_2a$로 놓으면 두 로그는 각각 $t-A$, $2t-A$이다.
> 부등식은
> $(t-A)(2t-A)+2\ge0$,

- **판정·핵심 연결·독립 검산:** t=log2 x는 전 실수, 판별식 A²-16≤0에서 log2 a≥-4이므로 a 최소 1/16이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
좌표평면에서 $y=\sqrt{x}\ (x>0)$ 위의 점 $P$에 대하여 동경 $OP$가 나타내는 각의 크기를 $\theta$라 하자. $3\cos^2\theta-\sin^2\theta=2$일 때, 점 $P$의 $y$좌표의 값은? (단, $O$는 원점이고, $x$축의 양의 방향을 시초선으로 한다.) [5.2점]
```

- 원문 보기: ① $\frac13$ / ② $\frac{\sqrt3}{3}$ / ③ 1 / ④ $\sqrt3$ / ⑤ 3
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 점 $P$는 제1사분면에 있으므로 $\cos\theta>0$, $\sin\theta>0$이다.
> $\sin^2\theta=1-\cos^2\theta$를 대입하면
> $3\cos^2\theta-(1-\cos^2\theta)=2$,

- **판정·핵심 연결·독립 검산:** 제1사분면에서 cos=√3/2, sin=1/2, tan=1/√3이고 곡선 y=√x에는 tan=1/√x이므로 x=3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
2 이상의 자연수 $m$에 대하여 집합 $A_m$을 $A_m=\{x\mid0<x\le100$이고 $\log_mx$는 자연수$\}$라 할 때, 다음 중 옳은 것만을 있는 대로 고른 것은? [5.5점]<br><div class="note-box">ㄱ. $n(A_3)=4$<br>ㄴ. 2 이상의 자연수 $p$가 2의 배수이면 $n(A_p)$도 2의 배수이다.<br>ㄷ. $n(A_m)=1$을 만족시키는 모든 자연수 $m$의 개수는 90개다.</div>
```

- 원문 보기: ① ㄱ / ② ㄴ / ③ ㄷ / ④ ㄱ, ㄴ / ⑤ ㄱ, ㄷ
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $\log_mx$가 자연수이면 $x=m^k$ ($k=1,2,\ldots$)이고 $m^k\le100$이다.
> ㄱ. $A_3=\{3,9,27,81\}$이므로 $n(A_3)=4$이다. 참.
> ㄴ. $p=4$이면 $A_4=\{4,16,64\}$이므로 $n(A_4)=3$이다. 2의 배수라는 조건을 만족하지만 원소 수는 홀수가 되어 거짓.

- **판정·핵심 연결·독립 검산:** A3의 원소 3,9,27,81 네 개, p=4 반례, 11≤m≤100의 원소 한 개 조건까지 직접 대조했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
서로 다른 두 함수 $f(x)=\log_2(3x-12)$, $g(x)=-\log_a(bx+c)$와 직선 $l$이 다음 조건을 만족시킬 때, $abc$의 값은? (단, $a,b,c$는 상수이다.) [5.5점]<br><div class="note-box">(가) 두 곡선 $y=f(x)$, $y=g(x)$의 점근선은 모두 직선 $l$이다.<br>(나) 실수 $t$에 대하여 직선 $y=t$가 두 곡선 $y=f(x)$, $y=g(x)$ 및 직선 $l$과 만나는 점을 각각 $P,Q,R$라 하면 모든 실수 $t$에 대하여 $\overline{PR}=\overline{QR}$이다.</div>
```

- 원문 보기: ① -20 / ② -18 / ③ -16 / ④ -14 / ⑤ -12
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> $f(x)$의 점근선은 $x=4$이므로 $l:x=4$이다. $g(x)$도 같은 점근선을 가지므로 $-\frac{c}{b}=4$, 즉 $c=-4b$이다.
> 높이가 $t$인 수평선과 만나는 점의 $x$좌표를 구한다.
> $f(x)=t$에서

- **판정·핵심 연결·독립 검산:** 두 점근선이 x=4이므로 c=-4b, 좌우 수평거리 비교에서 |b|=3와 a=1/2, abc=-4ab²=-18이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — UPGRADE

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x)=|x-k|-4$ ($k$는 실수)와 양의 실수 $a$ ($a\ne1$)에 대하여 함수 $g(x)$를<br>$g(x)=\begin{cases}a^{-f(x)}&(f(x)<0)\\a^{f(x)}&(f(x)\ge0)\end{cases}$<br>이라 하자. 함수 $y=g(x)$의 그래프와 직선 $y=16$의 교점의 개수가 3이고 $g(1)=16$일 때, 모든 $k$의 값의 합은? [5.8점]
```

- 원문 보기: ① -3 / ② -1 / ③ 0 / ④ 1 / ⑤ 3
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 정의에 따라 두 경우 모두 $g(x)=a^{|f(x)|}$이다.
> $y=16$과의 교점이 3개가 되려면 $|f(x)|$가 하나의 양의 높이에서 세 번 취해져야 한다. $|f(x)|=\bigl||x-k|-4\bigr|$의 모양에서 세 교점이 생기는 높이는 4뿐이다.
> 따라서 $\log_a16=4$, 즉 $a^4=16$이다. $a>0$, $a\ne1$이므로 $a=2$.

- **판정·핵심 연결·독립 검산:** 기존 설명은 세 교점 조건을 그래프 모양만으로 단언한다. 높이 c에 따라 | |x-k|-4 |=c의 해가 4·3·2개임을 나누어 계산하는 해설로 보강한다.
- 그림: 원문 별도 image 미지정

**UPGRADE 원문 A→B 결함·개선 사유:** 기존 설명은 세 교점 조건을 그래프 모양만으로 단언한다. 높이 c에 따라 | |x-k|-4 |=c의 해가 4·3·2개임을 나누어 계산하는 해설로 보강한다.

**완성 학생용 대체 solution (독립 검산 포함):**

두 경우의 정의를 하나로 합치면

$$
g(x)=a^{|f(x)|}=a^{\,\bigl||x-k|-4\bigr|}.
$$

$|f(x)|\ge0$이므로 $0<a<1$이면 $g(x)\le1$이다. $g(1)=16>1$이므로 반드시 $a>1$이다.

$$
c=\log_a16>0
$$

라 두면 $g(x)=16$과 동치인 방정식은

$$
\bigl||x-k|-4\bigr|=c
$$

이다. 절댓값을 풀면

$$
|x-k|=4+c\quad\text{또는}\quad|x-k|=4-c.
$$

- $0<c<4$이면 $4+c>0$, $4-c>0$이므로 각각 해가 2개씩, 모두 4개이다.
- $c=4$이면 $|x-k|=8$에서 해 2개, $|x-k|=0$에서 해 1개로 모두 3개이다.
- $c>4$이면 두 번째 식의 오른쪽이 음수라 불가능하고, 첫 번째 식에서 해 2개이다.

교점이 정확히 3개이므로 $c=4$이고,

$$
\begin{aligned}
\log_a16&=4\\
a^4&=16\\
a&=2\quad(a>1).
\end{aligned}
$$

이제 $g(1)=16$을 대입한다.

$$
\begin{aligned}
2^{\,\bigl||1-k|-4\bigr|}&=16=2^4\\
\bigl||1-k|-4\bigr|&=4\\
|1-k|-4&=4\quad\text{또는}\quad -4\\
|1-k|&=8\quad\text{또는}\quad0.
\end{aligned}
$$

따라서

$$
k=-7,\ 1,\ 9
$$

이고 모든 $k$의 합은

$$
-7+1+9=\boxed3.
$$

정답은 ⑤이다. **독립 검산:** 각 $k$에 대하여 $x=k-8,k,k+8$에서 $g(x)=16$이며, 세 점은 서로 다르다.

- 상태: `DRAFT_STAGED`, QA/학생 렌더 `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
50 이하의 두 자연수 $a,b$에 대하여 $\frac{1}{\log_{a+1}10}+\frac{3}{\log_{b+1}1000}$의 값이 자연수가 되도록 하는 $a,b$의 모든 순서쌍 $(a,b)$의 개수를 구하는 과정을 서술하시오. [8점]
```

- 원본 answer: `13`
- 기존 solution의 결정적 실제 발췌:

> 밑 변환으로 각 항을 밑 10의 로그로 바꾼다.
> $\frac1{\log_{a+1}10}=\log_{10}(a+1)$,
> $\frac3{\log_{b+1}1000}=\log_{10}(b+1)$.

- **판정·핵심 연결·독립 검산:** 밑변환 후 (a+1)(b+1)∈{10,100,1000}이고 각각 순서쌍 2,7,4개를 직접 열거했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `63f268b1aea9406182a7839d08f637e0d3494470`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $k$에 대하여 두 함수 $f(x)=3^x$, $g(x)=3\times9^x+\left(\frac13\right)^k$가 있다. 실수 $t$에 대하여 직선 $x=t$가 두 곡선 $y=f(x)$, $y=g(x)$와 만나는 점을 각각 $A,B$라 하자. 두 점 $A,B$ 사이의 거리가 $\frac7{27}$이 되도록 하는 실수 $t$의 개수가 2이고 이 두 실수의 합을 $p$라 할 때, $k+\left(\frac13\right)^p$의 값을 구하는 과정을 서술하시오. [12점]
```

- 원본 answer: `83/2`
- 기존 solution의 결정적 실제 발췌:

> $u=3^t$라 놓으면 $u>0$이고 $9^t=u^2$이다. 두 점은 같은 세로선 위에 있으므로 거리는 함수값 차의 절댓값이다.
> $|g(t)-f(t)|=\left|3u^2-u+3^{-k}\right|=\frac7{27}$.
> $Q(u)=3u^2-u+3^{-k}$라 하자. $Q(u)=-\frac{7}{27}$은

- **판정·핵심 연결·독립 검산:** u=3^t>0에서 Q(u)=-7/27는 불가능하고 Q(u)=7/27은 k=1일 때만 두 양근 1/9,2/9를 갖는다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 종료·후속

- 분모 검증: 20+1+0+0=21; 각 문항에는 원본 content/answer/solution 실제 발췌와 특정 계산 근거가 있다.
- 작성된 학생용 UPGRADE: Q19; 미완성 개선: NONE.
- HOLD: NONE (출고 차단·원본 확인 사항 유지).
- 원본 그림 PNG 실물 열람: 1건; 이미지가 전혀 없는 문항은 이미지 대조 대상에서 제외. 필수 시각 PASS·학생 화면 렌더·최종 수학 출고 검수는 `NOT_RUN`.
- JS, SVG, main, 공유 claim 파일 직접 수정: 없음. 본인 브랜치 MD 초안만 기록.
