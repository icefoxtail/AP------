# 2026 26_효천고_1학기_중간_고2_대수.js — 대수 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2026`
- source: `archive/exams/original/high/h2/1mid/26_효천고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- standardCourse (전 문항): `대수`, 2022 개정 대수; 구 수학Ⅰ 대응 범위
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/26_효천고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 22 · UPGRADE 0 · HOLD 1 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` (UPGRADE 개선 전체안 작성; HOLD 별도 유지) · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `23`
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

- Q23: `archive/assets/images/26_효천고_1학기_중간_고2_대수/q23.png` (Git blob `8837e92f8b452d72666242c9e2ca11ea22c890fe`), 실제 PNG 로드·시각 판독: A,B는 기울기 -1 직선, B와 C는 수평선 위에 있음; 원문 '선분 AB를 지나고 수평'과 불일치

학생 렌더 `NOT_RUN`; Golden/Negative 최종 QA `NOT_RUN`; 출고 `NOT_RUN`; SVG/JS 변조 `NONE`; 비그림 문제의 종이 원본 이미지/스캔 대조 `NOT_RUN`.

## 전 문항 심층 감사

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$2^2\times2^{-\frac73}\times2^{\frac13}=2^x$일 때, $x$값은? [3.3점]
```

- 원문 보기: ① $-3$ / ② $-2$ / ③ $-1$ / ④ $0$ / ⑤ $1$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 같은 밑의 거듭제곱을 곱할 때는 지수를 더한다.
> $2^2\times2^{-\frac73}\times2^{\frac13}=2^{2-\frac73+\frac13}$
> $=2^{2-2}=2^0$이다.

- **판정·핵심 연결·독립 검산:** 지수 2-7/3+1/3=0으로 2^x=1, x=0이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
다음 중 식을 간단히 한 것으로 옳지 않은 것은? [3.4점]
```

- 원문 보기: ① $(9^{0.25})^2=3$ / ② $3^{\sqrt5+1}\div3^{\sqrt5-1}=9$ / ③ $(2^2\times3)^{\frac23}\times\sqrt[3]{2^2\times3^{-2}}=4$ / ④ $\log_{\sqrt5}\frac1{25}=\frac14$ / ⑤ $\log_2 5\times\log_5 8=3$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 각 식을 지수·로그의 정의로 확인한다.
> ① $(9^{0.25})^2=9^{\frac{1}{2}}=3$이다.
> ② $3^{\sqrt5+1}\div3^{\sqrt5-1}=3^2=9$이다.

- **판정·핵심 연결·독립 검산:** ③의 밑지수 결합은 2²·3의 2/3제곱에 (2²3^-2)^(1/3)을 곱해 4, ④는 실제 -4이므로 오답 선택은 ④다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$\log 9.25=0.9661$일 때, $\log x=2.9661$을 만족시키는 $x$의 값은? [3.5점]
```

- 원문 보기: ① $925$ / ② $92.5$ / ③ $0.925$ / ④ $0.0925$ / ⑤ $0.00925$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 로그의 차는 진수의 비의 상용로그이다.
> $\log x-\log9.25=2.9661-0.9661=2$
> 따라서

- **판정·핵심 연결·독립 검산:** log x-log9.25=2로 x=9.25×100=925다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
두 상수 $a$, $b$에 대하여 $72^\circ=a\pi$, $b^\circ=\frac{\pi}{12}$일 때, $ab$의 값은? [3.6점]
```

- 원문 보기: ① $4$ / ② $6$ / ③ $8$ / ④ $10$ / ⑤ $12$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 도 단위를 라디안으로 바꾸어 $a$를 구한다.
> $72^\circ=72\times\frac{\pi}{180}=\frac{2\pi}{5}$이므로
> $a=\frac25$이다.

- **판정·핵심 연결·독립 검산:** 72도=2π/5에서 a=2/5, π/12=15도에서 b=15로 ab=6이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$\sin\theta=\frac45$일 때, $\tan\theta$의 값은? (단, $\frac\pi2<\theta<\pi$) [3.6점]
```

- 원문 보기: ① $-\frac43$ / ② $-\frac23$ / ③ $0$ / ④ $\frac23$ / ⑤ $\frac43$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> $\frac\pi2<\theta<\pi$이므로 $\theta$는 제2사분면에 있고 $\cos\theta<0$이다.
> $\sin^2\theta+\cos^2\theta=1$에서
> $\cos^2\theta=1-\left(\frac45\right)^2=\frac9{25}$

- **판정·핵심 연결·독립 검산:** 제2사분면 코사인은 -3/5이므로 tan=(4/5)/(-3/5)=-4/3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
겉넓이가 $108\pi$인 구의 반지름의 길이가 $\sqrt[n]{3^m}$일 때, 서로소인 두 자연수 $m,n$에 대하여 $m-n$의 값은? [3.7점]
```

- 원문 보기: ① $-3$ / ② $-1$ / ③ $1$ / ④ $3$ / ⑤ $5$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 구의 겉넓이 $4\pi r^2=108\pi$이므로
> $r^2=27=3^3$
> $r=3\sqrt3=3^{\frac32}$이다.

- **판정·핵심 연결·독립 검산:** 4πr²=108π에서 r²=27=3³, r=3^(3/2)로 m=3,n=2다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
두 수 $(81)^{\frac2n}$, $(125)^{\frac6{n+1}}$이 모두 자연수가 되도록 하는 모든 정수 $n$의 값의 합은? [3.8점]
```

- 원문 보기: ① $7$ / ② $8$ / ③ $9$ / ④ $10$ / ⑤ $11$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $(81)^{\frac2n}=3^{\frac8n}$이 자연수이려면 $\frac8n$이 자연수여야 하므로 $n$은 $8$의 양의 약수이다.
> 또 $(125)^{\frac6{n+1}}=5^{\frac{18}{n+1}}$이 자연수이려면 $n+1$은 $18$의 양의 약수이다.
> $n\mid8$에서 $n=1,2,4,8$이고, $n+1\mid18$에서 $n=1,2,5,8,17$이다.

- **판정·핵심 연결·독립 검산:** 3^(8/n),5^(18/(n+1))가 자연수려면 양의 정수 지수이며 n∈{1,2,4,8}과 n+1∣18의 교집합은 1,2,8이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_2 3=a$, $\log_3 5=b$, $\log_3 7=c$일 때, $\log_5 14$를 $a$, $b$, $c$에 대한 식으로 나타낸 것은? [3.9점]
```

- 원문 보기: ① $\frac1{ab}$ / ② $\frac1{ac}$ / ③ $\frac{1+bc}{ab}$ / ④ $\frac{1+ac}{ab}$ / ⑤ $\frac{1+ab}{ac}$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 로그의 곱셈 법칙으로 진수 $14$를 $2\times7$로 나눈다.
> $\log_5 14=\log_5 2+\log_5 7$
> $\log_5 2=\frac1{\log_2 5}=\frac1{ab}$이고

- **판정·핵심 연결·독립 검산:** log₅2=1/(ab), log₅7=c/b이므로 (1+ac)/(ab)다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
어느 약을 복용하면 몸속에 남아 있는 약의 성분은 4시간마다 30%씩 감소한다고 한다. 이 약을 복용한 후 몸속에 남아 있는 약의 성분이 처음의 절반 이하가 되는 것은 $x$시간 후부터이다. 이때 $x$의 값은? [4점]<br>(단, $\log7=0.8$, $\log2=0.3$으로 계산한다.)
```

- 원문 보기: ① $2$시간 / ② $3$시간 / ③ $4$시간 / ④ $5$시간 / ⑤ $6$시간
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 4시간마다 약 성분의 $70\%$가 남으므로 $x$시간 뒤 남는 비율은 $(0.7)^{\frac{x}{4}}$이다.
> 절반이 되는 시각은
> $(0.7)^{\frac{x}{4}}=0.5$를 만족한다.

- **판정·핵심 연결·독립 검산:** 4시간 지수 모델 (0.7)^(x/4)=0.5에 log0.7=-0.2,log0.5=-0.3을 대입해 x=6을 얻는다. 약 감소를 시간 연속비율로 해석한 전제는 원문에 명시돼 있지 않아 후속 원본 검증이 필요하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$\sin\theta+\cos\theta=\sqrt2$일 때, $\sin\theta-\cos\theta$의 값은? [4.2점]
```

- 원문 보기: ① $-\sqrt2$ / ② $-1$ / ③ $0$ / ④ $1$ / ⑤ $\sqrt2$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 주어진 식을 제곱하면
> $\sin^2\theta+2\sin\theta\cos\theta+\cos^2\theta=2$
> $1+2\sin\theta\cos\theta=2$

- **판정·핵심 연결·독립 검산:** sin+cos=√2에서 2sin cos=1, (sin-cos)²=1-1=0으로 차 0이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
세 양수 $a$, $b$, $c$와 0이 아닌 세 실수 $x$, $y$, $z$가 $a^x=b^y=c^z=243$, $abc=27$을 만족시킬 때, $\frac1x+\frac1y+\frac1z$의 값은? [4.3점]
```

- 원문 보기: ① $\frac35$ / ② $\frac34$ / ③ $\frac43$ / ④ $\frac53$ / ⑤ $3$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 공통값이 $243$이므로
> $a=243^{\frac{1}{x}}$, $b=243^{\frac{1}{y}}$, $c=243^{\frac{1}{z}}$이다.
> 따라서

- **판정·핵심 연결·독립 검산:** abc=243^(1/x+1/y+1/z)=3³, 243=3⁵에서 지수 합 3/5다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
상수 $a$ ($a>1$)에 대하여 곡선 $y=a^x-3$ 위의 점 중 제1사분면에 있는 점 $A$를 지나고 $y$축에 평행한 직선이<br>$x$축과 만나는 점을 $B$, 곡선 $y=a^x-3$의 점근선과 만나는 점을 $C$라 하자. $\overline{AB}=\overline{BC}$이고 삼각형 $AOC$의 넓이가 $27$일 때, $a\times\overline{OB}$의 값은? (단, $O$는 원점이다.) [4.5점]
```

- 원문 보기: ① $2^{\frac19}3^{\frac13}$ / ② $2^{\frac13}3^{\frac79}$ / ③ $2^{\frac19}3^{\frac{11}9}$ / ④ $2^{\frac19}3^{\frac{19}9}$ / ⑤ $2^{\frac13}3^{\frac53}$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 점근선은 $y=-3$이다. $A=(t,a^t-3)$라 두면 $B=(t,0)$, $C=(t,-3)$이다.
> $\overline{AB}=\overline{BC}=3$이므로 $a^t-3=3$, 따라서 $a^t=6$이다.
> 삼각형 $AOC$에서 밑변 $AC=6$이고 높이는 $OB=t$이므로

- **판정·핵심 연결·독립 검산:** BC는 세로로 3, AB=3이므로 a^t=6, 삼각형 AOC는 밑변 6·높이 t로 t=9, 9·6^(1/9)이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $n$에 대하여 $\frac{2\log_2 n+1}{3}$의 값이 6이하의 자연수가 되도록 하는 모든 $n$의 값의 합은? [4.7점]
```

- 원문 보기: ① $136$ / ② $141$ / ③ $146$ / ④ $151$ / ⑤ $156$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 식의 값을 $m$이라 두면 $m$은 1부터 6까지의 자연수이다.
> \[\frac{2\log_2 n+1}{3}=m\]
> 양변을 정리하면

- **판정·핵심 연결·독립 검산:** m=1,3,5에서 자연수 지수 (3m-1)/2가 각각 1,4,7로 n=2,16,128의 합 146이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
한 자리의 자연수 $n$과 실수 $k$에 대하여 방정식 $(x^n-2)(x^{2n}-2)=0$을 만족시키는 모든 실근의 곱을 $k$라 하자. $n+k$의 최댓값과 최솟값을 더하면 $a+b2^c$꼴로 나타낼 수 있을 때, $a+b+c$의 값은? (단, $a$는 자연수, $|b|=1$, $0<c<1$) [4.8점]
```

- 원문 보기: ① $\frac{63}8$ / ② $\frac{51}8$ / ③ $\frac{49}8$ / ④ $\frac{37}9$ / ⑤ $\frac{47}9$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 첫 번째 인수의 실근과 두 번째 인수의 실근을 나누어 본다.
> $x^n=2$의 실근 곱은 $n$이 홀수이면 $2^{\frac{1}{n}}$이고, $n$이 짝수이면 $-2^{\frac{2}{n}}$이다.
> $x^{2n}=2$의 실근은 $\pm2^{1/(2n)}$이므로 그 곱은 $-2^{\frac{1}{n}}$이다.

- **판정·핵심 연결·독립 검산:** n 홀수/짝수에 따른 실근곱 -2^(2/n), +2^(3/n)에서 n=1 최소 -3, n=8 최대 8+2^(3/8)을 비교했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
$a>0$인 실수 $a$에 대하여 두 곡선 $y=\log_3\left(-\frac1x\right)$, $y=\log_3(x+4a)$가 만나는 두 점을 $A$, $B$라 하자. 선분 $AB$의 중점이 직선 $2x+4y+3=0$ 위에 있을 때, $a$의 값은? [4.8점]
```

- 원문 보기: ① $\frac34$ / ② $\frac54$ / ③ $\frac74$ / ④ $\frac94$ / ⑤ $\frac{11}4$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 두 곡선의 교점에서는 로그의 진수가 같으므로
> $-\frac1x=x+4a$
> $x^2+4ax+1=0$이다.

- **판정·핵심 연결·독립 검산:** 두 교점 x좌표의 곱 1과 합 -4a로 y좌표 합 0, 중점 (-2a,0)에서 a=3/4이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
함수 $f(x)=\begin{cases}3^x &(x>2)\\-3^x+18 &(x\le2)\end{cases}$에 대하여 방정식 $9^{f(x)}-28\times3^{n+f(x)}+3^{2n+3}=0$의 서로 다른 실근의 개수가 3개가 되도록 하는 자연수 $n$의 값의 합은? [4.9점]
```

- 원문 보기: ① $9$ / ② $24$ / ③ $40$ / ④ $48$ / ⑤ $57$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $t=3^{f(x)}$, $A=3^n$이라 두면 방정식은
> $t^2-28At+27A^2=0$
> $(t-A)(t-27A)=0$이다.

- **판정·핵심 연결·독립 검산:** f의 높이 y=9에는 해 1개, 9<y<18에는 2개, y≥18에는 1개로 f=n,f=n+3의 개수를 합하면 n=9,15,16,17이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
상수 $k$에 대하여 정의역과 공역이 각각 실수 전체의 집합인 함수 $f(x)=\begin{cases}2^{-x-2}&(x<k)\\-\log_2(x+2)-2&(x\ge k)\end{cases}$가 일대일 대응이다. 함수 $g(x)=\begin{cases}\log_2(2-x)+2&(x<-k)\\-2^{x-2}+2&(x\ge-k)\end{cases}$를<br>라 할 때, $f(a)\le b\le g(a)$를 만족시키는 정수 $a$, $b$의 모든 순서쌍 $(a,b)$의 개수는? (단, $-2\le a\le1$) [5점]
```

- 원문 보기: ① $21$ / ② $23$ / ③ $25$ / ④ $27$ / ⑤ $29$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> $f$만 일대일 대응이라는 조건을 이용한다.
> 왼쪽 가지의 치역은 $(2^{-k-2},\infty)$, 오른쪽 가지의 치역은 $(-\infty,-\log_2(k+2)-2]$이다.
> 전사이면서 일대일이 되려면 두 치역이 경계에서 만나야 하므로

- **판정·핵심 연결·독립 검산:** 전사·단사의 치역 경계로 -2<k<-7/4를 얻어 a=-2,-1,0,1 각각의 정수 b 개수 4,6,7,6을 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
다음을 만족시키는 각 $\theta$는 제 몇 사분면의 각인지 쓰시오.<br>$\sin\theta>0$, $\tan\theta<0$ [3점]
```

- 원본 answer: `제2사분면`
- 기존 solution의 결정적 실제 발췌:

> $\sin\theta>0$이면 $\theta$는 제1사분면 또는 제2사분면에 있다.
> $\tan\theta<0$이면 $\sin\theta$와 $\cos\theta$의 부호가 서로 다르다.
> 이미 $\sin\theta>0$이므로 $\cos\theta<0$이다.

- **판정·핵심 연결·독립 검산:** sinθ>0과 tanθ<0에서는 cosθ<0이므로 제2사분면만 가능하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
[단답형 2], [서술형 3]에 해당되는 문제입니다.<br>$\log_a b$, $\log_b a$, $\log_a\frac ab$, $\log_{\frac{1}{a}}b$의 대소를 다음 물음에 맞게 비교하시오.<br>$a=\frac13$, $b=\frac12$일 때, 대소를 비교하시오. [3점]
```

- 원본 answer: `$\log_b a>\log_a b>\log_a\frac ab>\log_{1/a}b$`
- 기존 solution의 결정적 실제 발췌:

> 각 로그값을 비교할 수 있도록 계산한다.
> $\log_b a=\log_{\frac{1}{2}}(\frac{1}{3})=\frac{\log_2 3}{1}=\log_2 3>1$이다.
> $\log_a b=\log_{\frac{1}{3}}(\frac{1}{2})=\frac{\log_2 2}{\log_2 3}=\frac1{\log_2 3}$이다.

- **판정·핵심 연결·독립 검산:** t=log₂3>1에서 네 값이 t,1/t,1-1/t,-1/t 순서로 내려간다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
다음 부등식 $\log_2(2x-1)<4$를 만족하는 $x$의 범위를 구하고 그 과정을 서술하시오. [5점]
```

- 원본 answer: `$\frac12<x<\frac{17}2$`
- 기존 solution의 결정적 실제 발췌:

> 로그의 진수가 양수여야 하므로
> $2x-1>0$
> $x>\frac12$이다.

- **판정·핵심 연결·독립 검산:** 로그 진수 2x-1>0과 증가함수 조건 2x-1<16을 합쳐 1/2<x<17/2다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
다음 방정식 $2^{2x}-k2^{x+1}+2k+15=0$의 두 실근의 비가 $1:2$일 때, 실수 $k$의 값을 구하고 그 과정을 서술하시오. [6점]
```

- 원본 answer: `6`
- 기존 solution의 결정적 실제 발췌:

> $t=2^x$라 두면 $t>0$이고 방정식은
> $t^2-2kt+2k+15=0$이다.
> 두 실근을 $x$, $2x$라 두면 이 이차방정식의 두 근은 $t=2^x$와 $t^2=2^{2x}$이다.

- **판정·핵심 연결·독립 검산:** t=2^x>0, 두 실근 x,2x에서 2k=t+t²=t³-15이므로 (t-3)(t²+2t+5)=0, t=3, k=6이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
[단답형 2], [서술형 3]에 해당되는 문제입니다.<br>$\log_a b$, $\log_b a$, $\log_a\frac ab$, $\log_{\frac{1}{a}}b$의 대소를 다음 물음에 맞게 비교하시오.<br>$0<b^2<a<b$를 만족하는 실수 $a$, $b$에 대하여 대소를 비교하고 그 과정을 서술하시오. [6점]
```

- 원본 answer: `$\log_b a>\log_a b>\log_a\frac ab>\log_{1/a}b$`
- 기존 solution의 결정적 실제 발췌:

> $0<b^2<a<b$에서 $0<b<1$이다.
> $b^2<a<b$에 밑이 $b$인 로그를 취한다. 밑이 $0$과 $1$ 사이이므로 부등호 방향이 바뀌어
> $2>\log_b a>1$이다.

- **판정·핵심 연결·독립 검산:** 0<b²<a<b<1에서 t=log_b a가 1<t<2, 1/t가 1/2~1이므로 네 로그의 부호·크기가 순서대로 정해진다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — HOLD

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `b05d9d76c0a3b9dbdd5afce86b1ccc27289f1c33`
- 원문 문제·조건(소스 content 그대로):

```text
그림과 같이 기울기가 $-1$인 직선이 두 곡선 $y=3^x$, $y=\log_3x$와 만나는 두 점을 각각 $A$, $B$라 하고, 선분 $AB$를 지나고 $x$축과 평행한 직선이 곡선 $y=3^x$와 만나는 점을 $C$라 하자. 선분 $AB$의 길이가 $24\sqrt2$, 삼각형 $ABC$의 넓이가 $312$이다. 점 $A$의 $x$좌표를 $\alpha$라 할 때, $\alpha-\log_3\alpha$의 값을 구하고 그 과정을 서술하시오. (단, $O$는 원점이다.) [7점]
```

- 원본 answer: `2`
- 기존 solution의 결정적 실제 발췌:

> 기울기가 $-1$인 직선 위에서는 두 점의 $x$좌표 차와 $y$좌표 차의 절댓값이 같다. 그림에서 $A$는 왼쪽 위, $B$는 오른쪽 아래에 있으므로, $AB=24\sqrt2$에서 두 좌표 차의 절댓값은 각각 $24$이다.
> 점 $A$의 $x$좌표를 $\alpha$라 하자. 지수함수와 로그함수는 서로 역함수이고, $x+y=\text{상수}$인 직선은 $y=x$ 대칭에 대해 변하지 않는다. 따라서
> \[A=(\alpha,3^\alpha),\qquad B=(3^\alpha,\alpha).\]

- **판정·핵심 연결·독립 검산:** 원본 PNG는 A와 B를 잇는 기울기 -1 직선과 B,C를 잇는 수평선(두 번째 곡선과 교점)을 보여 준다. 다만 문제 문구는 '선분 AB를 지나고 x축과 평행한 직선'이라고 되어 있어 한 직선이 기울기 -1인 선분 전체를 지나며 동시에 수평일 수 없다. 문구 '점 B를 지나고'로의 원문 확인·승인 필요.
- 문제그림: `archive/assets/images/26_효천고_1학기_중간_고2_대수/q23.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)

**HOLD 해결 항목:** 원본 문장 '선분 AB를 지나고 x축과 평행한 직선'은 기울기 -1인 AB 전체와 수평선을 동일시해 문자 그대로 성립 불가. 실물 PNG와 현재 해설에서는 '점 B를 지나고'가 의도된 것으로 보인다. 원본 교정 승인/이미지 대조 후 원문 수정 여부 결정; JS 원문은 현재 미변경.

- 상태: `HOLD_SOURCE_TEXT` (그림은 판독함; 원문 변경 승인 대기), 출고 `NOT_RUN`.

## 종료·후속

- 분모 검증: 22+0+1+0=23; 각 문항에는 원본 content/answer/solution 실제 발췌와 특정 계산 근거가 있다.
- 작성된 학생용 UPGRADE: NONE; 미완성 개선: NONE.
- HOLD: Q23 (출고 차단·원본 확인 사항 유지).
- 원본 그림 PNG 실물 열람: 1건; 이미지가 전혀 없는 문항은 이미지 대조 대상에서 제외. 필수 시각 PASS·학생 화면 렌더·최종 수학 출고 검수는 `NOT_RUN`.
- JS, SVG, main, 공유 claim 파일 직접 수정: 없음. 본인 브랜치 MD 초안만 기록.
