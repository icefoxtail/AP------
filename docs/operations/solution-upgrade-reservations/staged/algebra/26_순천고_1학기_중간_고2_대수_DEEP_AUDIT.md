# 2026 26_순천고_1학기_중간_고2_대수.js — 대수 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2026`
- source: `archive/exams/original/high/h2/1mid/26_순천고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- standardCourse (전 문항): `대수`, 2022 개정 대수; 구 수학Ⅰ 대응 범위
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/26_순천고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `24` · actual question/answer/solution read: `24` · KEEP 23 · UPGRADE 1 · HOLD 0 · UNREAD 0
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

- Q5: `archive/assets/images/26_순천고_1학기_중간_고2_대수/q05.png` (Git blob `75bf1a427300bb382c8d2bcdf939ffb9d04a8024`), 실제 PNG 로드·시각 판독: 점근선 x=2와 x축 교점 x=5가 표시됨
- Q15: `archive/assets/images/26_순천고_1학기_중간_고2_대수/q15.png` (Git blob `742983456f1773408bfeb5b0e5f30c94cb486ff0`), 실제 PNG 로드·시각 판독: P에서 수평으로 Q, 수직으로 R, 두 곡선과 직선 y=x 표시가 보임

학생 렌더 `NOT_RUN`; Golden/Negative 최종 QA `NOT_RUN`; 출고 `NOT_RUN`; SVG/JS 변조 `NONE`; 비그림 문제의 종이 원본 이미지/스캔 대조 `NOT_RUN`.

## 전 문항 심층 감사

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$2^{-2}\times 8^{\frac53}$의 값은? [3.2점]
```

- 원문 보기: ① 1 / ② 2 / ③ 4 / ④ 8 / ⑤ 16
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $2^{-2}=\frac14$이고
> $8^{\frac53}=(\sqrt[3]8)^5=2^5=32$이다.
> 따라서

- **판정·핵심 연결·독립 검산:** 2^-2×(∛8)^5=(1/4)×32=8로 밑과 지수를 분리하여 확인했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\sqrt[3]{\sqrt{21}+3}\times\sqrt[3]{\sqrt{21}-3}\div\sqrt[9]{8}$의 값은? [3.2점]
```

- 원문 보기: ① $\sqrt[3]{2}$ / ② $\sqrt[3]{4}$ / ③ 2 / ④ $\sqrt[3]{3}$ / ⑤ $\sqrt[3]{6}$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 세제곱근을 곱하면
> $\sqrt[3]{(\sqrt{21}+3)(\sqrt{21}-3)}$
> $=\sqrt[3]{21-9}=\sqrt[3]{12}$이다.

- **판정·핵심 연결·독립 검산:** (√21+3)(√21-3)=12이고 ⁹√8=∛2이므로 ∛12/∛2=∛6이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_2 9\times\log_3 2\sqrt2$의 값은? [3.3점]
```

- 원문 보기: ① $\frac52$ / ② 3 / ③ $\frac72$ / ④ 4 / ⑤ $\frac92$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> $\log_2 9=2\log_2 3$이고
> $\log_3(2\sqrt2)=\log_3(2^{\frac32})=\frac32\log_3 2$이다.
> 따라서

- **판정·핵심 연결·독립 검산:** log₂9=2log₂3, log₃(2√2)=3/2 log₃2와 역수 관계를 곱하면 3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\log 5.67=0.7536$임을 이용하여 $\log x=-1.2464$를 만족시키는 양수 $x$의 값은? [3.3점]
```

- 원문 보기: ① 0.0567 / ② 0.567 / ③ 56.7 / ④ 567 / ⑤ 5670
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> $-1.2464=0.7536-2$이다.
> 주어진 값 $0.7536=\log 5.67$을 이용하면
> $\log x=\log 5.67-2$

- **판정·핵심 연결·독립 검산:** -1.2464=log5.67-2에서 x=5.67/100=0.0567이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
다음 그림은 함수 $y=\log_3(x+a)+b$의 그래프이다. 이 그래프는 점근선의 방정식이 $x=2$이고, 점 $(5,0)$을 지날 때, 두 상수 $a$, $b$에 대하여 $ab$의 값은? [3.5점]
```

- 원문 보기: ① $-2\log_3 7$ / ② $-2$ / ③ 2 / ④ $\log_3 7$ / ⑤ $2\log_3 7$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 로그함수 $y=\log_3(x+a)+b$의 점근선은
> $x+a=0$, 즉 $x=-a$이다.
> 점근선이 $x=2$이므로

- **판정·핵심 연결·독립 검산:** 원본 PNG에서 수직 점근선 x=2와 x절편 5를 대조했고 a=-2,b=-1,ab=2가 일치한다.
- 문제그림: `archive/assets/images/26_순천고_1학기_중간_고2_대수/q05.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
다음 보기 중 옳은 것만을 있는 대로 고른 것은? [3.5점]<br><div class="box"><b>&lt;보기&gt;</b><br>ㄱ. $45^\circ=\frac\pi8$(라디안)<br>ㄴ. $300^\circ$을 나타내는 동경은 $\frac\pi3$을 나타내는 동경과 $x$축 대칭이다.<br>ㄷ. $-\frac56\pi$는 제3사분면의 각이다.</div>
```

- 원문 보기: ① ㄱ / ② ㄴ / ③ ㄱ, ㄴ / ④ ㄴ, ㄷ / ⑤ ㄱ, ㄴ, ㄷ
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> ㄱ. $45^\circ=\frac\pi4$이므로 $\frac\pi8$과 같지 않다.
> ㄱ은 거짓이다.
> ㄴ. $300^\circ=360^\circ-60^\circ$이다.

- **판정·핵심 연결·독립 검산:** 45도=π/4, 300도는 60도의 x축 대칭, -5π/6는 7π/6으로 환원돼 ㄴ·ㄷ만 참이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\sin\theta\tan\theta>0$이고 $\sin\theta+\tan\theta<0$이 성립할 때, 각 $\theta$의 크기가 될 수 있는 것은? [3.6점]
```

- 원문 보기: ① $-\frac56\pi$ / ② $\frac\pi3$ / ③ $\frac34\pi$ / ④ $\frac{13}6\pi$ / ⑤ $\frac{11}3\pi$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> $\sin\theta\tan\theta=\frac{\sin^2\theta}{\cos\theta}>0$이므로
> $\cos\theta>0$이다.
> 또 $\sin\theta+\tan\theta<0$이면 두 항이 함께 음수여야 하므로

- **판정·핵심 연결·독립 검산:** sinθ tanθ=sin²θ/cosθ>0에서 cos>0( sin≠0), 합 조건에서 sin<0이므로 5π/3만 가능하다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\log_{|x-2|}(-x^2+3x+10)$이 정의되도록 하는 정수 $x$의 값의 합은? (단, ‘ | |’은 절댓값 기호이다.) [3.8점]
```

- 원문 보기: ① 1 / ② 2 / ③ 3 / ④ 4 / ⑤ 5
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 로그가 정의되려면 진수와 밑에 다음 조건이 필요하다.
> $-x^2+3x+10>0$,
> $|x-2|>0$,

- **판정·핵심 연결·독립 검산:** 진수 -2<x<5와 밑 제외 x=1,2,3을 교차해 정수 -1,0,4의 합은 3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
정수 $a$에 대하여 함수 $f(x)=\left(\frac{a^2-8a+17}{2}\right)^x$이라 하자. 함수 $f(x)$가 모든 음의 실수 $x$에 대하여 $f(x)>1$을 만족시키는 $a$의 값은? [3.9점]
```

- 원문 보기: ① 0 / ② 1 / ③ 2 / ④ 3 / ⑤ 4
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 밑을
> $A=\frac{a^2-8a+17}{2}=\frac{(a-4)^2+1}{2}$
> 라고 하자.

- **판정·핵심 연결·독립 검산:** 밑 A=((a-4)²+1)/2가 0과 1 사이일 필요충분조건은 (a-4)²<1이고 정수 a=4다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
부등식 $\log(7-x)+\log(x+4)\le1$을 만족하는 모든 정수인 $x$에 대하여 그 합은? [4.0점]
```

- 원문 보기: ① 2 / ② 3 / ③ 4 / ④ 5 / ⑤ 6
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 로그의 진수 조건은
> $7-x>0$, $x+4>0$이므로 $-4<x<7$이다.
> 로그의 합을 한 로그로 합치면

- **판정·핵심 연결·독립 검산:** 진수 영역 -4<x<7, (x-6)(x+3)≥0에서 정수 -3,6만 남아 합 3이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
세 상수 $a$, $b$, $c$에 대하여 함수 $y=\frac{a}{9^x}+b$의 그래프는 함수 $y=\frac{2}{9^x}+c$의 그래프를 $x$축의 방향으로 $\frac12\log_3 5$만큼, $y$축의 방향으로 7만큼 평행이동한 것이고, 함수 $y=\frac{2}{9^x}+c$의 그래프는 점 $\left(-\frac12,10\right)$을 지난다. $a+b+c$의 값은? [4.1점]
```

- 원문 보기: ① 19 / ② 21 / ③ 23 / ④ 25 / ⑤ 27
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> $y=\frac2{9^x}+c$의 그래프를 오른쪽으로
> $h=\frac12\log_3 5$만큼 옮기면
> $y=\frac2{9^{x-h}}+c=\frac{2\cdot9^h}{9^x}+c$이다.

- **판정·핵심 연결·독립 검산:** 오른쪽 평행이동 h=(1/2)log₃5에서 9^h=5, 점 대입 c=4, 수직이동 b=11이므로 a+b+c=25이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
고속철도의 최고소음도 $L(\mathrm{dB})$을 예측하는 모형에 따르면 한 지점에서 열차가 가까운 선로 중앙 지점을 통과할 때의 속력을 $v(\mathrm{km/h})$라 할 때, 다음과 같은 관계식이 성립한다고 한다.<br>$$L=80+28\log\frac{v}{100}$$<br>한 지점에서 속력이 서로 다른 두 열차 $A$, $B$의 최고소음도를 예측할 때, 열차 $A$가 지점 $P$를 통과할 때의 속력이 열차 $B$가 지점 $P$를 통과할 때의 속력의 1.5배라고 하자. 두 열차 $A$, $B$의 예측 최고소음도를 각각 $L_A$, $L_B$라 할 때, $L_A-L_B$의 값은? [4.2점]
```

- 원문 보기: ① $14(\log2-\log3)$ / ② $14(\log3-\log2)$ / ③ $28\log3$ / ④ $28(\log2-\log3)$ / ⑤ $28(\log3-\log2)$
- 원본 answer: `⑤`
- 기존 solution의 결정적 실제 발췌:

> 두 열차의 속력을 각각 $v_A$, $v_B$라 하면
> $v_A=1.5v_B$이다.
> 따라서

- **판정·핵심 연결·독립 검산:** 동일 상수 80을 소거하고 log(vA/vB)=log(3/2)=log3-log2만 남긴다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
$\pi<\theta<\frac32\pi$에서<br>$$\frac{\sin\theta+3\sin\theta\cos\theta}{1+\cos\theta+2\cos^2\theta-\sin^2\theta}=3$$일 때, $\sin\theta-\cos\theta$의 값은? [4.3점]
```

- 원문 보기: ① $-\frac{\sqrt{10}}5$ / ② $-\frac{\sqrt{10}}{10}$ / ③ $\frac{\sqrt{10}}{10}$ / ④ $\frac{\sqrt{10}}5$ / ⑤ $\frac{3\sqrt{10}}{10}$
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> 분모를 정리하면
> $1+\cos\theta+2\cos^2\theta-\sin^2\theta$
> $=1+\cos\theta+2\cos^2\theta-(1-\cos^2\theta)$

- **판정·핵심 연결·독립 검산:** 원래 분모 cosθ(1+3cosθ)≠0을 유지하면 tanθ=3, III사분면에서 sin=-3/√10, cos=-1/√10으로 차 -√10/5이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
탄소 중립 정책에 따라 한 국가의 자동차 시장이 내연기관차에서 친환경 전기차 중심으로 빠르게 바뀌고 있다. 현재부터 $t$년 후, 그 해에 운행되는 총 내연기관차의 수 $N_I(t)$와 총 전기차 수 $N_E(t)$는 다음과 같이 예측된다고 한다.<br>$$N_I(t)=4096\times\left(\frac12\right)^{\frac t4}$$<br>$$N_E(t)=16\times(\sqrt2)^t$$<br>정부는 총 전기차의 수가 총 내연기관차의 수보다 많아지는 시점부터 관련 충전소 예산을 크게 늘릴 계획이라고 할 때, 최소 몇 년 후에 예산을 늘려야 하는가? (단, $t$는 자연수이다.) [4.3점]
```

- 원문 보기: ① 11년 후 / ② 12년 후 / ③ 13년 후 / ④ 14년 후 / ⑤ 15년 후
- 원본 answer: `①`
- 기존 solution의 결정적 실제 발췌:

> $4096=2^{12}$, $\sqrt2=2^{\frac{1}{2}}$이므로
> $N_I(t)=2^{12-\frac t4}$,
> $N_E(t)=2^{4+\frac t2}$이다.

- **판정·핵심 연결·독립 검산:** 2^(4+t/2)>2^(12-t/4)에서 t>32/3이므로 최소 자연수 11이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
다음 그림과 같이 직선 $y=x$ 위의 한 점 $P$를 지나고 $x$축에 평행한 직선이 곡선 $y=\left(\frac14\right)^x$과 만나는 점을 $Q$, 점 $P$를 지나고 $y$축에 평행한 직선이 곡선 $y=-\log_2\left(x+\frac14\right)$과 만나는 점을 $R$라 하자. 삼각형 $PQR$가 $\overline{PQ}=\overline{PR}$인 이등변삼각형일 때, $\overline{QR}$의 길이는? [4.4점]
```

- 원문 보기: ① $\frac32$ / ② $\frac{3\sqrt2}4$ / ③ $\frac34$ / ④ $\frac{3\sqrt2}8$ / ⑤ $\frac38$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 점 $P$를 $P(t,t)$라 하자.
> 그림에서 $Q$는 $P$의 오른쪽, $R$은 $P$의 위쪽에 있으므로
> $PQ=Q_x-t$, $PR=R_y-t$이다.

- **판정·핵심 연결·독립 검산:** 실물 PNG상 P=(1/4,1/4), Q=(1,1/4), R=(1/4,1) 배치가 일치하며 PQ=PR=3/4, QR=3√2/4다.
- 문제그림: `archive/assets/images/26_순천고_1학기_중간_고2_대수/q15.png` 실물 PNG 시각 판독 완료 (상단 SHA 참조)
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
부등식 $\left(\frac19\right)^x-2k\times\left(\frac13\right)^{x-1}+18k\le0$을 만족시키는 실수 $x$가 존재하지 않도록 하는 실수 $k$의 값의 범위는? [4.5점]
```

- 원문 보기: ① $k>0$ / ② $0<k<2$ / ③ $0\le k<2$ / ④ $k\le2$ / ⑤ $k\le0$ 또는 $k\ge2$
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> $t=(\frac13)^x$라 두면 $t>0$이고
> $(\frac19)^x=t^2$,
> $(\frac13)^{x-1}=3t$이다.

- **판정·핵심 연결·독립 검산:** t=(1/3)^x>0에서 이차식 t²-6kt+18k가 양의 영역에서 0 이하가 되지 않는 k는 [0,2)다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
세 변의 길이가 모두 자연수인 삼각형 $ABC$가 있다. 점 $O$를 중심으로 하고 세 선분 $AC$, $BC$, $AB$의 길이를 각각 반지름으로 하는 세 부채꼴 $S_1$, $S_2$, $S_3$을 그린다고 하자. 세 부채꼴의 중심각의 크기는 모두 $\theta\ (0<\theta<\pi)$로 같다. 다음 조건을 만족시킬 때 부채꼴 $S_3$의 넓이는? [4.6점]<br><div class="box"><b>&lt;조건&gt;</b><br>(가) 두 부채꼴 $S_1$과 $S_2$의 넓이의 합은 부채꼴 $S_3$의 넓이와 같다.<br>(나) 삼각형 $ABC$의 넓이는 30이다.<br>(다) 세 부채꼴 $S_1$, $S_2$, $S_3$의 호의 길이의 합은 $12\pi$이다.</div>
```

- 원문 보기: ① $30\pi$ / ② $\frac{169}5\pi$ / ③ $36\pi$ / ④ $\frac{196}5\pi$ / ⑤ $42\pi$
- 원본 answer: `②`
- 기존 solution의 결정적 실제 발췌:

> 삼각형의 세 변의 길이를 $a=BC$, $b=CA$, $c=AB$라 하자.
> 세 부채꼴의 넓이는 각각 $\frac12a^2\theta$, $\frac12b^2\theta$, $\frac12c^2\theta$이다.
> 조건 (가)에서 $a^2+b^2=c^2$이므로 $C$가 직각이다.

- **판정·핵심 연결·독립 검산:** 부채꼴 넓이 조건으로 c²=a²+b², 삼각형 넓이 ab/2=30에서 5·12·13을 찾아 호 길이로 θ=2π/5를 구했다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $n$에 대하여 원 $x^2+y^2=81^{\frac1n}$ 위의 점 $P(x_1,y_1)$에서 접선이 $x$축, $y$축과 만나는 점을 각각 $Q$, $R$이라고 하자. 삼각형 $OQR$에 대하여 그 넓이를 $S_n$이라고 할 때, $S_n$은 다음 조건을 만족한다.<br><div class="box"><b>&lt;조건&gt;</b><br>(가) $x_1y_1=3^{3-2n}$이다.<br>(나) $S_n$은 $n=k$일 때, 최솟값 $m$을 갖는다.</div>이때, 자연수 $k$와 상수 $m$에 대하여 $k+m$의 값은? (단, $O$는 원점이다.) [4.7점]
```

- 원문 보기: ① $\frac{13}2$ / ② $\frac{31}2$ / ③ $\frac{85}2$ / ④ $\frac{247}2$ / ⑤ $\frac{303}2$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 원의 반지름의 제곱은 $81^{\frac{1}{n}}=3^{\frac{4}{n}}$이다.
> 접점 $P(x_1,y_1)$에서의 접선은
> $x_1x+y_1y=3^{\frac{4}{n}}$이다.

- **판정·핵심 연결·독립 검산:** 접선 절편의 곱을 r⁴/(x1y1)로 표현하면 S_n=(1/2)3^(2n+8/n-3); 정수 n=2에서 최솟값이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — UPGRADE

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
세 양수 $a$, $b$, $c$에 대하여 좌표평면 위의 세 점 $A(1,\log_2a)$, $B(4,\log_2b)$, $C(5,\log_2c)$가 원점 $O$를 지나는 한 직선 위에 있다. $b-a=14$일 때, 1보다 큰 두 실수 $p$, $q$가 다음을 만족시킨다.<br>$$\log_pa+\log_qb=\log_2\left(\frac c{16}\right)$$<br>이때 $\log_2(pq)$의 최솟값은? [4.8점]
```

- 원문 보기: ① $\frac{15}2$ / ② 8 / ③ $\frac{17}2$ / ④ 9 / ⑤ $\frac{19}2$
- 원본 answer: `④`
- 기존 solution의 결정적 실제 발췌:

> 세 점이 원점을 지나는 직선 위에 있으므로
> $\log_2a=m$, $\log_2b=4m$, $\log_2c=5m$라 둘 수 있다.
> $b-a=14$에서 $a=2^m$, $b=2^{4m}$이므로

- **판정·핵심 연결·독립 검산:** 원문은 코시–슈바르츠로 최소값 9를 바로 도출한다. 고2 학생이 재현하기 쉬운 양수 대입과 산술기하평균으로 최솟값·등호조건을 다시 제시한다.
- 그림: 원문 별도 image 미지정

**UPGRADE 원문 A→B 결함·개선 사유:** 원문은 코시–슈바르츠로 최소값 9를 바로 도출한다. 고2 학생이 재현하기 쉬운 양수 대입과 산술기하평균으로 최솟값·등호조건을 다시 제시한다.

**완성 학생용 대체 solution (독립 검산 포함):**

세 점이 원점을 지나는 같은 직선 위에 있으므로 기울기를 $m$이라 놓으면

$$
\log_2a=m,\qquad \log_2b=4m,\qquad \log_2c=5m.
$$

$t=2^m>0$이라 두면 $a=t$, $b=t^4$, $c=t^5$이고,

$$
\begin{aligned}
b-a&=14\\
t^4-t&=14\\
t^4-t-14&=0\\
(t-2)(t^3+2t^2+4t+7)&=0.
\end{aligned}
$$

$t>0$에서 두 번째 인수는 양수이므로 $t=2$이다. 따라서

$$
a=2,\quad b=16,\quad c=32.
$$

$p,q>1$이므로

$$
u=\log_2p>0,\qquad v=\log_2q>0
$$

로 놓는다. 주어진 조건에 밑변환을 적용하면

$$
\begin{aligned}
\log_pa+\log_qb&=\log_2(c/16)\\
\frac1u+\frac4v&=1.
\end{aligned}
$$

$\frac1u<1$이므로 $u>1$이다. 양변에 $uv$를 곱하면

$$
\begin{aligned}
v+4u&=uv\\
v(u-1)&=4u\\
v&=\frac{4u}{u-1}=4+\frac4{u-1}.
\end{aligned}
$$

$w=u-1>0$이라 두면

$$
\begin{aligned}
\log_2(pq)&=u+v\\
&=(w+1)+4+\frac4w\\
&=5+w+\frac4w\\
&\ge5+2\sqrt{w\cdot\frac4w}\\
&=5+4\\
&=9.
\end{aligned}
$$

산술평균과 기하평균의 부등식에서 등호가 성립하려면 $w=4/w$, 즉 $w=2$이다.

이때 $u=3$, $v=6$이고

$$
\frac13+\frac46=1
$$

이므로 실제로 조건을 만족한다. 따라서 최솟값은 $\boxed9$이고 정답은 ④이다. **독립 검산:** $p=2^3=8$, $q=2^6=64$이면 $\log_8 2+\log_{64}16=1/3+2/3=1=\log_2(32/16)$이다.

- 상태: `DRAFT_STAGED`, QA/학생 렌더 `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
자연수 $n$에 대하여 함수 $y=f_n(x)$를 다음과 같이 정의한다.<br>$$f_n(x)=-2|x-4|+2n+1\quad(4-n\le x\le4+n)$$<br>네 개의 함수 $y=f_1(x)$, $y=f_2(x)$, $y=f_3(x)$, $y=f_4(x)$의 그래프에 대하여 함수 $g(x)=\log_3(x-1)+4$의 그래프와 만나는 점의 개수를 $a$, 함수 $h(x)=\log_{\frac12}(x-2)+1$과 만나는 점의 개수를 $b$라고 하자. 이때, $a+b$의 값은? [4.8점]
```

- 원문 보기: ① 7 / ② 8 / ③ 9 / ④ 10 / ⑤ 11
- 원본 answer: `③`
- 기존 solution의 결정적 실제 발췌:

> 각 로그함수의 정의역과 단조성, 각 $f_n$의 꼭짓점을 이용해 교점 수를 센다.
> $g(x)=\log_3(x-1)+4$는 $x>1$에서 증가하고 오목하게 휜다.
> $n=1$이면 $f_1(x)\le3$이고 $x\in[3,5]$에서 $g(x)\ge g(3)=4$이므로 교점은 0개이다.

- **판정·핵심 연결·독립 검산:** 실제 각 f_n의 정의역과 증가 로그 g·감소 로그 h를 비교한 결과 g교점은 0,1,3,1개, h교점은 각 1개로 합이 9다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
서답형 1. (서술형) 세 양수 $a$, $b$, $c$에 대하여 $a^3=3$, $b^5=7$, $c^9=11$이라고 하자. 이때, $(abc)^n$이 자연수가 되도록 하는 자연수 $n$의 최솟값을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음. 4점]
```

- 원본 answer: `45`
- 기존 solution의 결정적 실제 발췌:

> $(abc)^n=a^nb^nc^n$이다.
> $a^3=3$, $b^5=7$, $c^9=11$이므로
> $a^n=3^{\frac{n}{3}}$, $b^n=7^{\frac{n}{5}}$,

- **판정·핵심 연결·독립 검산:** 서로 다른 소수 3,7,11에 대한 지수 n/3,n/5,n/9가 모두 정수여야 하므로 최소 공배수 45다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
서답형 2. (서술형) 정의역이 $\{x\mid-6\le x\le0\}$인 함수 $y=\log_a(-x^2-8x+9)$에 대하여 함수가 최댓값 2를 가진다고 하자. 이때, 상수 $a$의 값을 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $a>0$, $a\ne1$이다.) [부분 점수 있음. 6점]
```

- 원본 answer: `5`
- 기존 solution의 결정적 실제 발췌:

> $-x^2-8x+9=25-(x+4)^2$이다.
> 정의역 $[-6,0]$에서 이 값은
> $x=-4$일 때 최댓값 25를 갖고,

- **판정·핵심 연결·독립 검산:** 진수 25-(x+4)²는 [-6,0]에서 9~25, 감소 로그 밑은 최댓값이 양의 2일 수 없으므로 a=5다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
서답형 3. (서술형) $3<n\le10$인 자연수 $n$에 대하여 $n^2-14n+45$의 $n$제곱근 중 실수인 것의 개수를 $f(n)$이라 할 때, $f(n)<f(n+1)$을 만족하는 $n$의 값의 합을 구하는 과정을 풀이 과정과 함께 서술하시오. [부분 점수 있음. 4점]
```

- 원본 answer: `23`
- 기존 solution의 결정적 실제 발췌:

> $n^2-14n+45=(n-5)(n-9)$의 부호와 $n$의 짝홀에 따라
> 실수인 $n$제곱근의 개수를 정한다.
> $n=4$이면 양수의 짝수 제곱근이 2개,

- **판정·핵심 연결·독립 검산:** f(4..11) 수열 2,1,0,1,0,1,2,1을 비교하여 상승 n=6,8,9의 합 23이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `49a37fa4f4493caaf5308efd343bdcafea7532a2`
- 원문 문제·조건(소스 content 그대로):

```text
서답형 4. (서술형) 10 이하의 두 자연수 $a$, $b$에 대하여 함수 $f(x)$를 $f(x)=\left|\left(\frac12\right)^x-a\right|+b$라 하자. $x$에 대한 방정식 $f(x)+\frac{21}{f(x)}=10$이 서로 다른 세 실근을 갖도록 하는 모든 순서쌍 $(a,b)$의 개수를 구하는 과정을 풀이 과정과 함께 서술하시오. (단, $x$는 실수, $|\quad|$는 절댓값 기호이다.) [부분 점수 있음. 6점]
```

- 원본 answer: `14`
- 기존 solution의 결정적 실제 발췌:

> $y=(\frac12)^x$라 두면 $y>0$이고
> $f(x)=|y-a|+b$이다.
> 먼저 $t=f(x)>0$라 두면

- **판정·핵심 연결·독립 검산:** t=f(x)=3 또는7, y=(1/2)^x>0에서 양의 y 해의 개수를 b=1,2,3으로 나눠 4+4+6=14개이다.
- 그림: 원문 별도 image 미지정
- **KEEP 구체 사유:** 기존 원문 풀이에 위 계산·조건 확인이 모두 실제 전개되어 있고 정답으로 연결되는 중간식이 확보되어 있어 학생용 전체 재작성은 불필요하다. 상태: `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 종료·후속

- 분모 검증: 23+1+0+0=24; 각 문항에는 원본 content/answer/solution 실제 발췌와 특정 계산 근거가 있다.
- 작성된 학생용 UPGRADE: Q19; 미완성 개선: NONE.
- HOLD: NONE (출고 차단·원본 확인 사항 유지).
- 원본 그림 PNG 실물 열람: 2건; 이미지가 전혀 없는 문항은 이미지 대조 대상에서 제외. 필수 시각 PASS·학생 화면 렌더·최종 수학 출고 검수는 `NOT_RUN`.
- JS, SVG, main, 공유 claim 파일 직접 수정: 없음. 본인 브랜치 MD 초안만 기록.
