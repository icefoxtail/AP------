# 2025 25_매산고_1학기_중간_고2_대수.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2025`
- source: `archive/exams/original/high/h2/1mid/25_매산고_1학기_중간_고2_대수.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- standardCourse (전 문항): `대수`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/25_매산고_1학기_중간_고2_대수_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 21 · UPGRADE 0 · HOLD 0 · UNREAD 0
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

검토 방식: 원본 질문 `content`, `choices`, `answer`, `solution`을 전 문항 실제 읽고, 정답·진수/밑 조건·구간 끝점·부호·문항 그림을 대조했다. 원문 풀이의 핵심을 그대로 인용하고 판정 사유를 문항별로 기재했다. UPGRADE는 기존 해설을 그대로 대체해도 이해할 수 있도록 처음부터 끝까지 새로 썼다. HOLD는 정답을 임의 결정하지 않는다. JS 학생 렌더·`preflight.mjs`·Golden/Negative 실제 최종 게이트·출고는 `NOT_RUN`.

## 실물 이미지 증거

- `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-problem-v2.svg` — Git blob `15bee6fa7346a23eff12938b7429118db98b2b38`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-problem-readable-v2.svg` — Git blob `9608b0b65d7c5f85a03a88c040266331ba6343ff`; GitHub 파일 취득 후 실제 PNG/SVG 화면 판독
- solutionImage 보조 자산: 소스가 가리키는 4개 SVG의 파일 존재와 Git blob만 확인; **보조 해설 그림의 전수 시각 판독·학생 렌더는 NOT_RUN**.
  - Q07 `archive/assets/images/25_매산고_1학기_중간_고2_대수/q7-solution.svg` — `f194e73f143b096a386d66790c5276c7c74b56f3`
  - Q11 `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-solution.svg` — `81da8cf1f542591b7ee74201bbbed7c4d20d5e17`
  - Q13 `archive/assets/images/25_매산고_1학기_중간_고2_대수/q13-solution.svg` — `046c94bad25328ab252c4236f5e6c0a644834818`
  - Q18 `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-solution.svg` — `bba674758ad8b83b17402740f64afeab602ad0b5`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각함수` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
어떤 부채꼴의 호의 길이가 $\pi$이고 넓이가 $4\pi$일 때, 반지름의 길이는? (4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 5
② 6
③ 7
④ 8
⑤ 9
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 부채꼴의 호의 길이와 넓이 공식을 이용한다.
> - 호의 길이 $l = \pi$
> - 넓이 $S = 4\pi$
> 부채꼴의 넓이 공식 $S = \frac{1}{2}rl$에 주어진 값을 대입한다.

- **독립 판정·핵심 연결/검산:** 호 길이 π와 넓이 4π에 S=rl/2 적용: r=8, 정답 ④.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `지수의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$-8$의 세 제곱근 중에서 실수인 것을 $a$, $81$의 네 제곱근 중에서 음의 실수인 것을 $b$라 할 때, $ab$의 값은? (4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2
② 3
③ 4
④ 5
⑤ 6
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 거듭제곱근 중 실수인 것의 개수와 값을 구하는 방법을 이용한다.
> - $a$: $-8$의 세 제곱근 중 실수
> - $b$: $81$의 네 제곱근 중 음의 실수
> $-8$의 세 제곱근 중에서 실수인 것은 방정식 $x^3 = -8$의 실근이므로 $a = \sqrt[3]{-8} = -2$이다.

- **독립 판정·핵심 연결/검산:** ∛(−8)=−2와 음의 ⁴√81=−3, 곱 6을 재계산.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < 2\pi$일 때, 방정식 $\cos x = \frac{1}{2}$의 모든 근의 합은? (4.2점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① $\frac{\pi}{2}$
② $\pi$
③ $\frac{3}{2}\pi$
④ $2\pi$
⑤ $\frac{5}{2}\pi$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 주어진 범위에서 삼각함수의 대칭성을 이용하여 삼각방정식의 해를 구한다.
> - $0 \le x < 2\pi$
> - $\cos x = \frac{1}{2}$
> $\cos x = \frac{1}{2}$를 만족하는 $x$의 값 중 제$1$사분면의 각은 $x = \frac{\pi}{3}$이다.

- **독립 판정·핵심 연결/검산:** 0≤x<2π에서 cos x=1/2의 두 해 π/3,5π/3 합 2π.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
양수 $N=a \times 10^n$ ($n$은 정수, $1 \le a < 10$)에 대하여<br>$\log N=2.8768$일 때, $a+n$의 값은? (단, $\log 7.53=0.8768$로 계산한다.) (4.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 8.53
② 9.53
③ 10.53
④ 11.53
⑤ 12.53
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 상용로그의 지표(정수 부분)와 가수(소수 부분)의 성질을 이용한다.
> - $N = a \times 10^n$ ($n$은 정수, $1 \le a < 10$)
> - $\log N = 2.8768$
> - $\log 7.53 = 0.8768$

- **독립 판정·핵심 연결/검산:** log N=2+.8768에서 a=7.53,n=2, 합 9.53.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
직선 $\sqrt{3}x-y+2\sqrt{3}=0$이 $x$축의 양의 방향과 이루는 각의 크기를 $\theta$라 할 때, $\cos\theta-\tan\theta\sin\theta$의 값은? (단, $0<\theta<\pi$)<br>(4.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -1
② -2
③ -3
④ -4
⑤ -5
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 직선의 기울기와 $\tan\theta$의 관계, 그리고 삼각함수 사이의 관계를 이용한다.
> - 직선 $\sqrt{3}x-y+2\sqrt{3}=0$
> - $x$축의 양의 방향과 이루는 각의 크기 $\theta$ ($0<\theta<\pi$)
> 주어진 직선의 방정식을 정리하면 $y = \sqrt{3}x + 2\sqrt{3}$이므로, 기울기는 $\sqrt{3}$이다.

- **독립 판정·핵심 연결/검산:** 직선 기울기 √3과 0<θ<π로 θ=π/3, 식은 1/2−3/2=−1.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `지수의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$x>1$이고 $x+x^{-1}=4$일 때, $x^3-x^{-3}$의 값은? (4.5점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 40
② 44
③ 48
④ $30\sqrt{3}$
⑤ 56
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 곱셈 공식의 변형을 이용하여 식의 값을 구한다.
> - $x>1$
> - $x+x^{-1}=4$
> 먼저 $x-x^{-1}$의 값을 구한다.

- **독립 판정·핵심 연결/검산:** x+x^-1=4, x>1에서 x−x^-1=2√3, 세제곱 차 30√3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 중 함수 $f(x)=2\log_3x$에 대한 설명으로 옳은 것은? (4.5점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 정의역은 실수 전체의 집합이다.
② $x_1 > x_2$이면 $f(x_1) < f(x_2)$이다.
③ 함수 $y=f(x)$는 점 $(1,2)$를 지난다.
④ 함수 $y=(\sqrt{3})^x$와 역함수 관계이다.
⑤ 함수 $y=f(x)$의 그래프는 함수 $y=\log_3x^2$의 그래프와 같다.
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그함수의 정의역, 치역, 점근선, 증가/감소 및 역함수의 성질을 분석한다.
> - $f(x)=2\log_3x$
> ① 진수 조건에 의해 $x>0$이므로 정의역은 양의 실수 전체의 집합이다. (거짓)
> ② 밑이 $3$으로 $1$보다 크므로 증가함수이다. 따라서 $x_1 > x_2$이면 $f(x_1) > f(x_2)$이다. (거짓)

- **독립 판정·핵심 연결/검산:** 다섯 보기의 정의역·역함수식을 독립 비교; f^-1(x)=(√3)^x만 참.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q7-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
모든 실수 $x$에 대하여 $\log_a (ax^2-2ax+3)$이 정의되기 위한 자연수 $a$의 값은? (4.6점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1
② 2
③ 3
④ 4
⑤ 5
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그가 정의되기 위한 밑 조건과 진수 조건을 확인한다.
> - 밑 조건: $a > 0, a 
> eq 1$
> - 진수 조건: 모든 실수 $x$에 대하여 $ax^2-2ax+3 > 0$

- **독립 판정·핵심 연결/검산:** 밑의 자연수 조건 a≥2와 판별식 a(a−3)<0의 교집합은 a=2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
지진은 지구 내부의 에너지가 지표로 나오면서 발생하는데, 지진이 지구 내부에서 최초로 발생된 지점을 진원(震源, earthquake focus), 진원에서 수직으로 연결된 지표면 위의 지점을 진앙(震央, epicenter)이라고 한다. 지진의 크기를 절대적 수치로 나타내는 방법인 '규모'는 미국의 지진학자 리히터(Richter, C. F., 1900~1986)가 도입한 것으로 진앙에서 100km 떨어진 지점에서 지진계로 측정한 지진파의 최대 진폭이 $A\mu m$(마이크로미터)일 때, 지진의 규모 $M$은 $M=\log A$라고 한다. 또 규모가 $M$인 지진의 에너지의 크기를 $E$라 하면 $\log E=11.8+1.5M$이라고 한다. 지진의 규모가 1만큼 증가할 때, 지진의 최대 진폭과 지진의 에너지는 각각 몇 배 증가하는지 차례대로 나열한 것은? (단, $\sqrt{10}=3.2$로 계산한다.) (4.6점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 2배, 15배
② 4배, 15배
③ 4배, 32배
④ 10배, 15배
⑤ 10배, 32배
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 주어진 로그 관계식에 조건을 대입하여 변수의 증가 비율을 구한다.
> - $M = \log A$
> - $\log E = 11.8 + 1.5M$
> - $\sqrt{10} = 3.2$

- **독립 판정·핵심 연결/검산:** 지진 규모가 1 증가하면 진폭 10배, 에너지 10^(3/2)=10√10≈32배.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$a = (1+\frac{1}{3})(1+\frac{1}{3^2})(1+\frac{1}{3^4})(1+\frac{1}{3^8})$일 때, 
$\log_3(3-2a)$의 값은? (4.8점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -15
② -12
③ -9
④ -6
⑤ -3
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 합차 공식을 이용하여 식을 간단히 한 후 로그의 값을 계산한다.
> - $a = \left(1+\frac{1}{3}\right)\left(1+\frac{1}{3^2}\right)\left(1+\frac{1}{3^4}\right)\left(1+\frac{1}{3^8}\right)$
> 주어진 식의 양변에 $\left(1-\frac{1}{3}\right)$을 곱한다.
> $\left(1-\frac{1}{3}\right)a = \left(1-\frac{1}{3}\right)\left(1+\frac{1}{3}\right)\left(1+\frac{1}{3^2}\right)\left(1+\frac{1}{3^4}\right)\left(1+\frac{1}{3^8}\right)$

- **독립 판정·핵심 연결/검산:** 곱 a에 1−1/3을 곱해 1−3^-16으로 묶음; 3−2a=3^-15, 로그값 −15.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각함수의 그래프` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=a\sin(bx+c)+d$의 그래프 중 일부가 아래 그림과 같을 때, 상수 $a, b, c, d$에 대하여 $\frac{abcd}{2\pi}$의 값은?
(단, $a>0, b>0, \pi<c<2\pi$) (5.1점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 1
② 3
③ 5
④ 7
⑤ 9
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 삼각함수 그래프의 최댓값, 최솟값, 주기를 이용하여 미정계수를 구한다.
> - $y=a\sin(bx+c)+d$ ($a>0, b>0, \pi<c<2\pi$)
> - 그래프의 최댓값은 $3$, 최솟값은 $-1$
> - 그래프의 인접한 두 최댓값의 $x$좌표는 각각 $\frac{\pi}{2}, \frac{3\pi}{2}$

- **독립 판정·핵심 연결/검산:** 실물 q11 SVG 최고 3·최저 -1, 최고점 π/2·3π/2 확인; a2,d1,b2,c3π/2로 결과 3.
- 문제 그림: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-problem-v2.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q11-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
실수 $a$에 대하여 함수 $f(t) = \cos^2 t + 2a\sin t$ ($0 \le t \le 2\pi$)의 최댓값을 $M(a)$라고 할 때, $M(-2)+M(0)+M(3)$의 값은?
(5.3점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 7
② 8
③ 9
④ 10
⑤ 11
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 삼각함수의 종류를 하나로 통일하고 치환하여 이차함수의 최대, 최소를 구한다.
> - $f(t) = \cos^2 t + 2a\sin t$ ($0 \le t \le 2\pi$)
> - 최댓값을 $M(a)$
> $\cos^2 t = 1 - \sin^2 t$이므로 $f(t) = -\sin^2 t + 2a\sin t + 1$이다.

- **독립 판정·핵심 연결/검산:** M(a)는 t=sin x∈[-1,1]에서 −(t−a)^2+a²+1; M(−2)=4,M(0)=1,M(3)=6.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `지수의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
방정식 $4^x + a \cdot 2^x + 3 = 0$이 실근을 갖지 않도록 하는 정수 $a$의 최솟값은? (5.4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① -3
② -1
③ 1
④ 3
⑤ 5
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> $2^x = t$로 치환하여 이차방정식의 실근의 조건을 분석한다.
> - 방정식 $4^x + a \cdot 2^x + 3 = 0$이 실근을 갖지 않는다.
> $2^x = t$ ($t > 0$)로 치환하면 주어진 방정식은 $t^2 + at + 3 = 0$이 된다.
> 원래 방정식이 실근을 갖지 않으려면, 이 이차방정식이 양의 실근을 갖지 않아야 하므로 다음 두 가지 경우를 생각할 수 있다.

- **독립 판정·핵심 연결/검산:** t=2^x>0에서 t²+at+3=0은 a>−2√3이면 양의 실근 없음; 최소 정수 −3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- 보조 `solutionImage`: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q13-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `지수의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$n \ge 2$인 자연수 $n$에 대하여 함수 $f(x)=3^x-n$의 그래프가 $y=f^{-1}(x)$의 그래프와 만나는 두 점의 $x$좌표 중 큰 값을 $g(n)$이라 하자. $k \le g(n) < k+1$을 만족시키는 자연수 $k$를 $h(n)$이라 할 때, $h(n) < h(n+1)$을 만족시키는 100이하의 $n$의 값 중 최댓값은? (5.4점)
```

- **원문 보기 (`choices` 순서 그대로):**

```text
① 22
② 23
③ 76
④ 77
⑤ 100
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 함수와 그 역함수의 교점은 직선 $y=x$ 위에 있음을 이용하여 관계식을 세우고, 함수의 증가 및 정수 조건을 분석한다.
> - $n \ge 2$인 자연수
> - $f(x)=3^x-n$과 $y=f^{-1}(x)$의 교점의 $x$좌표 중 큰 값 $g(n)$
> - $k \le g(n) < k+1$인 자연수 $k = h(n)$

- **독립 판정·핵심 연결/검산:** 큰 교점 g(n)의 정수 문턱 3^k−k를 나열: k=2,3,4에서 n=6,23,76; 최대 76.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log 2 = a$, $\log 3 = b$일 때, 다음을 $a$와 $b$에 대한 식으로 나타내시오.<br>(1) $\log_2 5$ (2점)
```

- 원본 `answer`: `$\dfrac{1-a}{a}$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 밑변환공식과 상용로그의 성질($\log 2 + \log 5 = 1$)을 이용한다.
> - $\log 2 = a$
> - $\log 3 = b$
> 밑변환공식에 의해 $\log_2 5 = \dfrac{\log 5}{\log 2}$이다.

- **독립 판정·핵심 연결/검산:** 상용로그 밑변환 log_2 5=(1−a)/a, 문제 (1) 정답 확인.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
$\log 2 = a$, $\log 3 = b$일 때, 다음을 $a$와 $b$에 대한 식으로 나타내시오.<br>(2) $\log 3$ (2점)
```

- 원본 `answer`: `$b$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 밑이 생략된 로그는 상용로그(밑 10)이며, 주어진 조건을 직접 활용한다.
> - $\log 2 = a$
> - $\log 3 = b$
> 밑이 생략된 로그 $\log 3$은 상용로그 $\log_{10} 3$을 의미한다.

- **독립 판정·핵심 연결/검산:** 조건이 log3=b로 주어졌으므로 문제 (2)는 b 그대로.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
연립방정식 $$\begin{cases} x^2 y^4 = 1 \\ \log_2 x + (\log_2 y)^2 = 3 \end{cases}$$ 을 만족하는 실수 $x, y$의 순서쌍 $(x, y)$를 모두 구하시오. (5점)
```

- 원본 `answer`: `$(4, \frac{1}{2}), (\frac{1}{64}, 8)$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 지수와 로그의 성질을 이용하여 연립방정식을 치환 가능한 하나의 문자에 대한 이차방정식으로 변형한다.
> - $x^2 y^4 = 1$
> - $\log_2 x + (\log_2 y)^2 = 3$
> - 진수 조건: $x > 0, y > 0$

- **독립 판정·핵심 연결/검산:** x,y>0, t=log_2 y로 t²−2t−3=0; (x,y)=(4,1/2),(1/64,8).
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
다음 그림과 같이 중심각을 공유하는 두 부채꼴 $OAB$, $OCD$에 대하여 도형 $ABDC$의 둘레의 길이가 48이다. 도형 $ABDC$의 넓이가 최대가 될 때, 선분 $AC$의 길이를 구하시오. (6점)
```

- 원본 `answer`: `12`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 부채꼴의 호의 길이와 넓이 공식을 이용하여 도형의 둘레와 넓이를 미지수로 나타내고 이차함수의 최대를 구한다.
> - 중심각을 공유하는 두 부채꼴 $OAB, OCD$
> - 도형 $ABDC$의 둘레 길이: $48$
> 두 부채꼴의 중심각을 $\theta$, 작은 부채꼴의 반지름을 $r_1$, 큰 부채꼴의 반지름을 $r_2$라 하자.

- **독립 판정·핵심 연결/검산:** 실물 q18 SVG에서 바깥·안쪽 두 부채꼴의 호와 반지름 차 확인; S=−(AC−12)²+144로 최대 AC=12.
- 문제 그림: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-problem-readable-v2.svg` (실물 판독 완료)
- 보조 `solutionImage`: `archive/assets/images/25_매산고_1학기_중간_고2_대수/q18-solution.svg` (존재·blob 확인, 별도 학생 렌더 미실시)
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `지수의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x)=a^x+a^{-x}$ ($a>0, a\neq 1$)과 실수 $k$에 대하여 $f(2k)=7$일 때, $f(3k)$의 값을 구하시오.
```

- 원본 `answer`: `18`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 곱셈 공식의 변형을 이용하여 지수식의 값을 계산한다.
> - $f(x) = a^x + a^{-x}$
> - $f(2k) = 7$
> 주어진 조건에서 $f(2k) = a^{2k} + a^{-2k} = 7$이다.

- **독립 판정·핵심 연결/검산:** u=a^k+a^-k>0이고 u²=9라 u=3; u³−3u=18.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
이차방정식 $x^2-ax+a=0$의 두 근이 $\sin\theta$, $\cos\theta$ 이다. 이때, 실수 $a$의 값과 $\sin^3\theta+\cos^3\theta$의 값을 구하시오.
```

- 원본 `answer`: `$a=1-\sqrt{2}$, $\sin^3\theta+\cos^3\theta = \sqrt{2}-2$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 이차방정식의 근과 계수의 관계 및 삼각함수 사이의 관계를 이용하여 식의 값을 구한다.
> - 이차방정식 $x^2-ax+a=0$의 두 근: $\sin\theta, \cos\theta$
> 근과 계수의 관계에 의해 다음 두 식이 성립한다.
> $\sin\theta + \cos\theta = a$

- **독립 판정·핵심 연결/검산:** 두 근의 합·곱이 모두 a, 삼각 항등식으로 a=1±√2; 판별식 또는 |sin+cos|≤√2로 a=1−√2, 세제곱 합 √2−2.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `2b54e1b6b19ecc513632d4679132852a8b9631ea`
- 문항 단원/과정: `로그의 뜻과 성질` / `대수`
- **원문 문제·조건 (`content` 그대로):**

```text
[서답형 6번] 방정식 $\log_2\{x^2+(a+1)x-a+3\}-\log_2x=0$이 오직 한 개의 근을 갖기 위한 실수 $a$의 조건을 구하시오. (7점)
```

- 원본 `answer`: `$a=-6$ 또는 $a>3$`
- 기존 `solution` 결정적 실제 발췌 (원문에 포함된 `\\n`은 줄바꿈으로 표시):

> 로그방정식의 진수 조건을 만족하는 이차방정식의 실근의 개수를 판별한다.
> - $\log_2\{x^2+(a+1)x-a+3\} - \log_2x = 0$
> - 오직 한 개의 실근을 가짐
> 로그의 성질을 이용하여 방정식을 변형하면 $\log_2\{x^2+(a+1)x-a+3\} = \log_2x$이므로 진수끼리 같아야 한다.

- **독립 판정·핵심 연결/검산:** 진수 x>0에서 이차식 x²+ax−a+3의 양근 하나: 양의 중근 a=−6 또는 서로 다른 이부호 근 a>3.
- 문제 그림: 별도 `image` 또는 `content`내 그림 없음
- **KEEP 사유:** 원본 해설과 정답이 위의 계산·조건·문항 그림에 부합하며, 정답에 이르는 필수 단계가 충분히 확인된다. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 완료 판정·다음 작업

- 분모 21문항 모두 읽음. 판정 합 `21+0+0+0=21`.
- 학생용 개선 `0`건의 완성안 작성; HOLD `0`건은 원문/정답 승인 대기.
- 원본 자료·그림 원복/변경 `NONE`; `main` 수정 `NONE`; Golden/Negative/학생 렌더/출고 `NOT_RUN`.
- 다음 시험지는 동일 queue의 아직 미완료된 1학기 중간 2025년 대수 기출을 파일명 정렬 순서로 선택.
