# 2023 23_강남여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_강남여고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `8ebd40181370523fd304d862ce76c48ac485502d`
- standardCourse (전 문항): `수학I`; 2015 `수학I` 표기는 현행 대수 대응 구과정 자료로 취급
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_강남여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `25` · actual question/answer/solution read: `25` · KEEP 24 · UPGRADE 1 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 25문항 원본·정답·기존 해설 독립 검토. 학생용 해설은 MD 초안으로 기록하며 원본 JS/SVG·main·정답키는 변경하지 않음.

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

- `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q03-problem.svg` — Git blob `fda244ab9f2a8243864425887bc756f60b92753c`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q11-problem-replacement.svg` — Git blob `f3ae0d6f88d5f421a989846b11645bb55fe07c9a`; 실제 SVG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q18.png` — Git blob `87d01401479004cbfbb72f834f28f2f162c5cd12`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q21.png` — Git blob `c25a7b047bba40f8de4d17fd0deff98d3b88eb72`; 실제 PNG 화면 렌더·원문 조건 대조 완료
- `solutionImage` 보조 해설 자산 5개: GitHub 실제 파일과 Git blob 존재 확인. **보조 해설 그림의 전수 시각 판독·학생 최종 렌더는 NOT_RUN**.
  - Q02 `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q2-solution.svg` — `d54912f3e0588c710172a3ac613e2576f6f5ec0b`
  - Q06 `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q6-solution.svg` — `dca43feec794ec9e690de6ecf1b0a0d0c2e98f31`
  - Q10 `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q10-solution.svg` — `c3545dffda2ba3ad4fc0709430505ed468505098`
  - Q12 `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q12-solution.svg` — `15bae48a0f5eaac1f75f3a118f25995cb0bdc7fb`
  - Q20 `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q20-solution.svg` — `2eec4857d8588b27f72fc81267a8aace59028423`

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
${\{(-2)^2\}}^{\frac{1}{2}} \times {\left(3^{\frac{1}{2}}\right)}^2$의 값은? [3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
-6
-3
1
3
6
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$\sqrt{(-2)^2}=2$, $ (\sqrt3)^2=3$.
따라서 두 값의 곱은 $2\cdot3=6$이다. 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 양의 제곱근 \(\sqrt{(-2)^2}=2\)와 \((\sqrt3)^2=3\), 곱6, ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
각 $\theta$가 제3사분면의 각이고 $\sin\theta = -\frac{2}{3}$일 때, $\cos\theta$의 값은? [3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-\frac{\sqrt{5}}{3}$
$-\frac{2\sqrt{5}}{5}$
$1$
$\frac{\sqrt{5}}{3}$
$\frac{2\sqrt{5}}{5}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$\theta$는 제3사분면이므로 $\cos\theta<0$이다.
$\sin^2\theta+\cos^2\theta=1$에서
$\cos^2\theta=1-\left(-\frac23\right)^2=\frac59$.
따라서 $\cos\theta=-\frac{\sqrt5}{3}$이고 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 제3사분면에서 \(\cos\theta=-\sqrt{1-4/9}=-\sqrt5/3\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
반지름의 길이가 $12\text{cm}$이고 중심각의 크기가 $\frac{2}{3}\pi$인 부채꼴의 호의 길이는? [3점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$2\pi$
$4\pi$
$6\pi$
$8\pi$
$10\pi$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
부채꼴의 호의 길이는 $l=r\theta$이다. 중심각을 라디안으로 두면
$l=12\cdot\frac{2\pi}{3}=8\pi$.
따라서 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 실물 부채꼴 그림의 반지름12cm·각 \(2\pi/3\) 확인, 호길이 \(12(2\pi/3)=8\pi\), ④.
- 문제 그림: `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q03-problem.svg` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$5^{\log_5 3 \times \log_3 7}$의 값은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
5
6
7
8
9
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
지수의 곱을 로그의 성질로 정리한다.
$\log_5 3\cdot\log_3 7=\log_5 7$.
그러므로 $5^{\log_5 7}=7$이고 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 로그 연결 곱 \(\log_53\log_37=\log_57\), 따라서 \(5^{\log_57}=7\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x)=2^{x+k}$에서 $f(1)=8$일 때, $f(-3)$의 값은? (단, $k$는 실수) [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
0
$\frac{1}{2}$
1
$\frac{3}{2}$
2
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$f(1)=8$이므로 $2^{1+k}=2^3$, 따라서 $k=2$이다.
$f(-3)=2^{-3+2}=2^{-1}=\frac12$.
정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(2^{1+k}=8\)에서 \(k=2\), \(f(-3)=2^{-1}=1/2\), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y=\log_3(2x-3)+4$의 그래프의 점근선이 함수 $y=\log_3(4x-3)+2$의 그래프와 만나는 점의 좌표가 $(a, b)$일 때, $2ab$의 값은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
9
10
11
12
13
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 로그함수의 점근선은 $2x-3=0$, 즉 $x=\frac32$이다.
이 x좌표를 둘째 그래프에 대입하면
$b=\log_3(4\cdot\frac32-3)+2=\log_3 3+2=3$.
따라서 $(a,b)=(\frac32,3)$이고 $2ab=9$이므로 정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 첫 그래프 점근선 \(x=3/2\)을 둘째에 대입하면 \(b=\log_33+2=3\); \(2ab=9\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$\frac{\tan\left(-\frac{5}{4}\pi\right)}{\sin\frac{5}{3}\pi+\cos\frac{5}{6}\pi}$의 값은? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{3}$
$\frac{\sqrt{2}}{3}$
$\frac{\sqrt{3}}{3}$
$-\frac{\sqrt{2}}{3}$
$-\frac{\sqrt{3}}{3}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$\tan(-\frac54\pi)=\tan(-\frac14\pi)=-1$이다.
또 $\sin\frac53\pi=-\frac{\sqrt3}{2}$,
$\cos\frac56\pi=-\frac{\sqrt3}{2}$이므로 분모는 $-\sqrt3$이다.
따라서 전체 값은 $\frac1{\sqrt3}=\frac{\sqrt3}{3}$이고 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 사인의 합 \(\sin5\pi/3+\cos5\pi/6=-\sqrt3\), \(\tan(-5\pi/4)=-1\); 비 \(\sqrt3/3\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
어느 호수의 수면에서 빛의 세기를 $I_0\,\mathrm{W/m^2}$, 수심이 $x\,\mathrm{m}$인 곳에서 빛의 세기를 $I\,\mathrm{W/m^2}$라고 하면
$$I=I_0\left(\frac{1}{2}\right)^{\frac{x}{4}}$$
이라고 한다. 빛의 세기가 수면에서 빛의 세기의 $25\%$ 이하가 되려면 수심은 최소 몇 $\mathrm{m}$인가? [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
7
8
9
10
11
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
빛의 세기 비율은 $\frac I{I_0}=(\frac12)^{\frac{x}{4}}$이다.
조건은 $(\frac12)^{\frac{x}{4}}\le\frac14=(\frac12)^2$.
밑이 1보다 작으므로 $x/4\ge2$, 즉 $x\ge8$이다.
최소 수심은 8m이므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 빛의 세기 비율 \((1/2)^{x/4}\le1/4=(1/2)^2\), 밑 감소로 \(x\ge8\)m, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
두 자연수 $a$, $b$에 대하여
$$\frac{1+3\sin\theta}{1+\sin\theta} - \frac{2}{1-\sin\theta} = a - \frac{b}{\cos^2\theta}$$
일 때, $ab$의 값은? (단, $\theta \neq \frac{n\pi}{2}$, $n$은 정수이다.) [3.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
4
6
8
10
12
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$s=\sin\theta$라 놓고 통분한다.
$\frac{1+3s}{1+s}-\frac2{1-s}=\frac{(1+3s)(1-s)-2(1+s)}{1-s^2}$
$=\frac{-1-3s^2}{\cos^2\theta}=3-\frac4{\cos^2\theta}$.
따라서 $a=3$, $b=4$, $ab=12$이므로 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 통분하면 \((-1-3\sin^2\theta)/\cos^2\theta=3-4/\cos^2\theta\), \(a=3,b=4,ab=12\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < 2\pi$일 때 두 부등식 $\tan x > 0$, $\sqrt{2}\sin x + 1 < 0$을 모두 만족시키는 모든 $x$의 값의 범위가 $\alpha < x < \beta$이다. $\beta - \alpha$의 값은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{4}\pi$
$\frac{3}{4}\pi$
$\frac{5}{4}\pi$
$\frac{9}{4}\pi$
$\frac{11}{4}\pi$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$\tan x>0$인 범위는 $(0,\frac\pi2)\cup(\pi,\frac{3\pi}2)$이다.
$\sqrt2\sin x+1<0$은 $\sin x<-\frac1{\sqrt2}$이므로
$\frac{5\pi}4<x<\frac{7\pi}4$이다.
교집합은 $\frac{5\pi}4<x<\frac{3\pi}2$이고 길이는 $\frac\pi4$이다.
정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 제3사분면 \(\tan x>0\)과 \(\sin x<-1/\sqrt2\)를 교집합하면 \(5\pi/4<x<3\pi/2\); 길이 \(\pi/4\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
세 상수 $a$, $b$, $c$에 대하여 함수 $y=a\cos\{b\pi(x-a)\}+c$의 그래프가 그림과 같을 때, $a+b+c$의 값은? (단, $a>0$, $b>0$) [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
$\frac{10}{3}$
$\frac{11}{3}$
4
$\frac{13}{3}$
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
그래프의 최댓값이 3, 최솟값이 $-1$이므로 진폭 $a=2$, 중심선 $c=1$이다.
연속한 두 봉우리의 x좌표 차가 3이므로 주기는 3이고 $2\pi/(b\pi)=\frac{2}{b}=3$, 따라서 $b=\frac23$이다.
$a+b+c=2+\frac23+1=\frac{11}3$이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q11 그래프 진폭2, 중심선1, 연속 봉우리 간격3으로 \(a=2,b=2/3,c=1\), 합11/3, ③.
- 문제 그림: `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q11-problem-replacement.svg` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$0 \le x < \pi$일 때, 방정식 $\sin 6x = -\frac{1}{2}$의 서로 다른 실근의 개수는? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
4
5
6
7
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=6x$로 두면 $0\le t<6\pi$이다. 길이 $6\pi$ 구간에는 사인함수의 주기 $2\pi$가 3번 반복된다.
한 주기 안에서 $\sin t=-\frac12$의 해는 2개이므로 서로 다른 실근은 $3\cdot2=6$개이다.
정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(0\le6x<6\pi\)는 사인 주기 3개, \(\sin t=-1/2\)은 주기당 2근 →6개, ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `지수의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$2 \le n \le 50$인 자연수 $n$에 대하여 $\sqrt[6]{9} \times \sqrt[4]{8}$이 어떤 자연수의 $n$제곱근이 되도록 하는 자연수 $n$의 개수는? [4점]
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
$\sqrt[6]9\cdot\sqrt[4]8=3^{\frac{1}{3}}2^{\frac{3}{4}}$이다.
이를 어떤 자연수의 n제곱근으로 쓰려면 n제곱했을 때 지수 $\frac{n}{3}$, $3n/4$가 모두 정수여야 한다.
따라서 $n$은 3과 4의 공배수, 즉 12의 배수이다.
$2\le n\le50$에서 $n=12,24,36,48$의 4개이므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** \(\sqrt[6]9\sqrt[4]8=3^{1/3}2^{3/4}\)의 \(n\)제곱이 자연수일 조건 \(12\mid n\); 2–50에서 12,24,36,48 네 개, ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
자연수 $N(1 \le N \le 36)$과 음이 아닌 두 정수 $\alpha$, $\beta$가
$$\frac{1}{2}\log N = \alpha\log 2 + \beta\log 3$$
을 만족시키는 자연수 $N$의 개수는? [4점]
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
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
식의 양변을 로그로 비교하면 $\sqrt N=2^\alpha3^\beta$이고
$N=2^{2\alpha}3^{2\beta}\le36$이다.
가능한 $(\alpha,\beta)$는 $(0,0),(1,0),(2,0),(0,1),(1,1)$이다.
이에 대응하는 $N$은 $1,4,16,9,36$의 5개이므로 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** \(\sqrt N=2^\alpha3^\beta\)로 \(N=2^{2\alpha}3^{2\beta}\le36\)인 1,4,9,16,36 총5개, ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
제1사분면 위의 점 $\mathrm{P}$에 대하여 점 $\mathrm{P}$를 원점에 대하여 대칭이동한 점을 $\mathrm{Q}$라 하자. 두 동경 $\mathrm{OP}$, $\mathrm{OQ}$가 나타내는 각을 각각 $\alpha$, $\beta$라 하자. $\sin\alpha = \frac{\sqrt{3}}{4}$일 때, $\cos\beta$의 값은? (단, $\mathrm{O}$는 원점이고, 시초선은 $x$축의 양의 방향이다.) [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$-\frac{\sqrt{13}}{4}$
$-\frac{\sqrt{3}}{2}$
$-\frac{\sqrt{11}}{4}$
$-\frac{\sqrt{14}}{4}$
$-\frac{\sqrt{15}}{4}$
```

- 원본 `answer`: `①`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
점 P가 제1사분면에 있으므로 $\cos\alpha>0$이다.
$\cos\alpha=\sqrt{1-\sin^2\alpha}=\sqrt{1-\frac3{16}}=\frac{\sqrt{13}}4$.
Q는 P를 원점 대칭한 점이므로 $\beta=\alpha+\pi$이고
$\cos\beta=-\cos\alpha=-\frac{\sqrt{13}}4$.
정답은 ①이다.
```

- **독립 판정·핵심 연결/검산:** 원점 대칭된 제3사분면 \(Q\)에서 \(\cos\beta=-\cos\alpha=-\sqrt{13}/4\), ①.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $f(x)=\log_a(x^2-4x+8)$에 대하여 보기에서 옳은 것만을 있는 대로 고른 것은? (단, $a \neq 1$, $a>0$) [4점]

<보기>
(가) $a=2$일 때, $f(4)=3$이다.
(나) $a \ge 2$일 때, $a^2 \le x^2-4x+8 \le a^5$이면 함수 $f(x)$의 최댓값과 최솟값의 합은 $7$이다.
(다) $a=\frac{1}{2}$일 때, 함수 $f(x)$의 최댓값은 $4$이다.
```

- **원문 보기 (`choices` 순서 그대로):**

```text
(가)
(가), (나)
(가), (다)
(나), (다)
(가), (나), (다)
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
(가) $f(4)=\log_2(16-16+8)=\log_2 8=3$이므로 참이다.
(나) 밑 $a\ge2$에서 로그함수는 증가한다. 진수 범위가 $a^2$ 이상 $a^5$ 이하이므로 함수값은 2 이상 5 이하이고, 합은 7이다. 참이다.
(다) $a=\frac12$이면 감소함수이다. 진수의 최솟값은 $4$이므로 최댓값은 $\log_{\frac{1}{2}}4=-2$로서 4가 아니다.
옳은 것은 (가), (나)이므로 정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** (가) \(f(4)=3\), (나) \(a\ge2\)에서 진수 양 끝 \(a^2,a^5\)가 실제 도달하여 로그 최솟값2·최댓값5, (다) 밑1/2 최댓값−2; (가)(나), ②.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
자연수 전체의 집합의 두 부분집합
$$A = \left\{9,\, \frac{1}{2}+\log\sqrt[3]{a}\right\}, \quad B = \{x \mid x \ge 2\log a\}$$
에 대하여 $n(A \cap B)=1$이 되도록 하는 모든 양수 $a$의 값의 곱은? [4점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$10^3$
$10^4$
$10^5$
$10^6$
$10^7$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$n=\frac12+\log\sqrt[3]a$가 자연수여야 하므로
$\log a=3n-\frac32$, 즉 $a=10^{3n-\frac{3}{2}}$이다.
두 번째 원소가 B에 속하려면 $n\ge2\log a=6n-3$이어야 해 $n\le\frac35$가 되어 불가능하다.
따라서 교집합에 들어갈 수 있는 원소는 9뿐이며, 정확히 하나가 되려면
$9\ge2\log a$, 즉 $3n-\frac32\le\frac92$에서 $n=1,2$이다.
해당 a의 곱은 $10^{\frac{3}{2}}\cdot10^{\frac{9}{2}}=10^6$이므로 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** \(n=1/2+\frac13\log a\in\mathbb N\)으로 \(a=10^{3n-3/2}\), A의 다른 원소는 B 불포함. 9만 B에 속할 \(n=1,2\), 곱 \(10^6\), ④.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q18 — UPGRADE

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `지수함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$3 < 3+b < a$인 두 상수 $a$, $b$에 대하여 직선 $y=-x+a$가 두 곡선 $y=2^{x+1}+b$, $y=\log_2(x-b)-1$과 만나는 점을 각각 $\mathrm{A}$, $\mathrm{B}$, 직선 $y=-x+a$가 $x$축과 만나는 점을 $\mathrm{C}$, 곡선 $y=2^{x+1}+b$가 $y$축과 만나는 점을 $\mathrm{D}$, 곡선 $y=\log_2(x-b)-1$이 $x$축과 만나는 점을 $\mathrm{E}$라 하자. 점 $\mathrm{B}$는 선분 $\mathrm{AC}$를 $4:1$로 내분하고 삼각형 $\mathrm{AOB}$의 넓이가 $12$일 때, 삼각형 $\mathrm{DOE}$의 넓이는? (단, $\mathrm{O}$는 원점) [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
5
$\frac{9}{2}$
4
$\frac{7}{2}$
3
```

- 원본 `answer`: `②`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$s=\overline{y_A}=a-x_A$라 두면 $s>0$이다. B가 AC를 $4:1$로 내분하므로
$B=(a-\frac{s}{5},\frac{s}{5})$이다. 넓이 조건에서
$[AOB]=\frac45[AOC]=\frac45\cdot\frac{as}{2}=12$,
따라서 $as=30$이다.
A가 지수곡선 위에 있으므로 $b=s-2^{a-s+1}$이고, B가 로그곡선 위에 있으므로
$a-\frac{s}{5}-b=2^{1+\frac{s}{5}}$이다. $a=\frac{30}{s}$를 대입하면
$F(s)=\frac{30}{s}-\frac{6s}{5}+2^{\frac{30}{s}-s+1}-2^{1+\frac{s}{5}}=0$.
각 항을 미분하면 $F'(s)<0$ ($s>0$)이므로 해는 하나뿐이다. $s=5$가 식을 만족하므로 $a=6$, $b=1$이다.
$D=(0,3)$, $E=(3,0)$이어서 $[DOE]=\frac12\cdot3\cdot3=\frac92$.
정답은 ②이다.
```

- **독립 판정·핵심 연결/검산:** 실물 q18 그림의 \(B\in AC\), \([AOB]=12\)로 \(as=30\). 연립식의 엄격한 감소함수 \(F(s)\)에 \(s=5\) 대입해 \(a=6,b=1\), \(D(0,3),E(3,0)\)에서 넓이9/2. 미분 없이 단조성 설명 보강.
- 문제 그림: `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q18.png` (실물 판독 완료)

#### UPGRADE — 학생용 전면 개선 해설 초안

1. 직선은 \(y=-x+a\)이고 \(x\)축 교점은 \(C=(a,0)\)이다. \(A\)의 \(y\)좌표를 \(s>0\)이라 하면 \(A=(a-s,s)\)이다. \(B\)는 선분 \(AC\)를 \(4:1\)로 내분하므로 \(B=(a-s/5,s/5)\).
2. \(\triangle AOC\)에서 밑변 \(OC=a\), 높이 \(s\). 같은 밑변을 공유하는 \(B\)의 높이는 \(s/5\)이므로
   \[
   [AOB]=\frac45[AOC]=\frac45\cdot\frac{as}{2}=12
   \quad\Longrightarrow\quad as=30.
   \]
   따라서 \(a=30/s\).
3. \(A\)가 지수함수 \(y=2^{x+1}+b\) 위에 있으므로 \(s=2^{a-s+1}+b\), 곧 \(b=s-2^{a-s+1}\). \(B\)가 로그함수 \(y=\log_2(x-b)-1\) 위에 있으므로 \(a-s/5-b=2^{1+s/5}\).
4. 두 식을 합치고 \(a=30/s\)를 대입하면
   \[
   F(s)=\frac{30}{s}-\frac{6s}{5}
        +2^{30/s-s+1}-2^{1+s/5}=0\qquad(s>0).
   \]
   여기서 \(s\)가 증가하면 \(30/s\)은 감소하고, \(-6s/5\)도 감소한다. 지수 \(30/s-s+1\)이 감소하므로 \(2^{30/s-s+1}\) 역시 감소하고, \(-2^{1+s/5}\)도 감소한다. **네 항 모두 엄격하게 감소하므로 \(F(s)=0\)의 양의 해는 많아야 하나다.** 원문의 교육과정 밖 미분은 필요 없다.
5. \(s=5\)이면 \(a=30/5=6\)이다. \(F(5)=6-6+2^{6-5+1}-2^{1+1}=0\)으로 확인되므로 이 해가 유일하다. \(b=s-2^{a-s+1}=5-4=1\). 주어진 \(3<3+b<a\)는 \(3<4<6\)으로 만족한다.
6. \(D\)는 지수곡선의 \(y\)절편이므로 \(D=(0,2+b)=(0,3)\). \(E\)는 \(\log_2(x-b)-1=0\)에서 \(x-b=2\), 즉 \(E=(3,0)\)이다. \(\triangle DOE\)는 직각삼각형이므로
   \[
   [DOE]=\frac12\cdot3\cdot3=\boxed{\frac92}.
   \]
   정답 **②**.

- 이 문항의 원본 정답은 유지. **학생 노출/원본 치환은 아직 하지 않음**.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 그래프` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
$a > \frac{3}{2}$인 실수 $a$와 양수 $b$에 대하여 $0 \le x \le 2a$에서 정의된 두 함수
$$f(x)=\sin\frac{\pi x}{2a}, \quad g(x)=b\cos\frac{\pi(x-1)}{a}$$
이 있다. 직선 $y=-\frac{b}{2}$가 곡선 $y=g(x)$와 만나는 두 점을 각각 $\mathrm{A}$, $\mathrm{B}$라 하자. 곡선 $y=f(x)$ 위의 점 $\mathrm{C}$에 대하여 삼각형 $\mathrm{ABC}$가 한 변의 길이가 $2$인 정삼각형일 때, $a \times b^2$의 값은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
3
6
9
12
15
```

- 원본 `answer`: `③`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$g(x)=-\frac b2$이면 $\cos\frac{\pi(x-1)}a=-\frac12$이다.
주어진 구간 안 두 교점은 $x=1+\frac{2a}{3}$, $1+\frac{4a}{3}$이므로 $AB=\frac{2a}{3}$.
정삼각형의 한 변이 2이므로 $\frac{2a}{3}=2$, 따라서 $a=3$이다.
C는 AB의 중점에서 높이 $\sqrt3$만큼 위에 있다. 중점의 x좌표는 $1+a=4$이고
$f(4)=\sin\frac{2\pi}{3}=\frac{\sqrt3}{2}=-\frac b2+\sqrt3$.
따라서 $b=\sqrt3$이고 $ab^2=3\cdot3=9$이다. 정답은 ③이다.
```

- **독립 판정·핵심 연결/검산:** 수평선 \(-b/2\)과 \(g\) 교점 차 \(AB=2a/3=2\)에서 \(a=3\), 정삼각형 꼭짓점 높이√3로 \(b=\sqrt3\), \(ab^2=9\), ③.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그함수` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
양의 상수 $k$에 대하여 곡선 $y=\log_2(-2x+k)$의 점근선을 $l_1$, 곡선 $y=\log_4\left(\frac{x}{2}-k\right)$의 점근선을 $l_2$라 하자. 직선 $y=m\,(m은 상수)$가 곡선 $y=\log_2(-2x+k)$, 직선 $l_1$, 직선 $l_2$, 곡선 $y=\log_4\left(\frac{x}{2}-k\right)$와 만나는 점을 각각 $\mathrm{A}$, $\mathrm{B}$, $\mathrm{C}$, $\mathrm{D}$라 하자. $\overline{\mathrm{AB}}=\overline{\mathrm{BC}}=\overline{\mathrm{CD}}$일 때, 두 수 $k$, $m$에 대하여 $k-m$의 값은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{7}{4}$
$\frac{11}{6}$
$\frac{23}{12}$
2
$\frac{25}{12}$
```

- 원본 `answer`: `⑤`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
첫째 로그곡선의 수평선 교점은 $A=(\frac k2-2^{m-1},m)$이고 점근선은 $x=\frac k2$이다.
둘째 점근선은 $x=2k$, 교점은 $D=(2k+2\cdot4^m,m)$이다.
따라서 세 연속 거리의 조건은
$2^{m-1}=\frac{3k}{2}=2\cdot4^m$이다.
첫째와 셋째를 같게 두면 $2^{m-1}=2^{2m+1}$이므로 $m=-2$.
$\frac{3k}{2}=2^{m-1}=\frac18$에서 $k=\frac1{12}$.
그러므로 $k-m=\frac1{12}+2=\frac{25}{12}$이고 정답은 ⑤이다.
```

- **독립 판정·핵심 연결/검산:** 두 로그 점근선 \(x=k/2,2k\), 좌우 수평 거리 \(2^{m-1},3k/2,2\cdot4^m\)의 같음에서 \(m=-2,k=1/12\), \(k-m=25/12\), ⑤.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
그림과 같이 선분 $\mathrm{AB}$를 지름으로 하는 반원이 있다. 선분 $\mathrm{AB}$의 중점을 $\mathrm{O}$라 하고, 호 $\mathrm{AB}$ 위의 한 점 $\mathrm{P}$에 대하여 점 $\mathrm{O}$에서 선분 $\mathrm{AP}$에 내린 수선의 발을 $\mathrm{Q}$, 점 $\mathrm{P}$에서 선분 $\mathrm{AB}$에 내린 수선의 발을 $\mathrm{R}$라 하자. $\angle\mathrm{PAB}=30^\circ$이고 삼각형 $\mathrm{QAO}$의 넓이가 $\frac{\sqrt[4]{27}}{2}$일 때, $\log_3(\overline{\mathrm{AR}} \times \overline{\mathrm{BR}})$의 값은? [4.5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
$\frac{1}{2}$
$\frac{3}{4}$
1
$\frac{5}{4}$
$\frac{3}{2}$
```

- 원본 `answer`: `④`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
반지름을 $r$이라 하자. $\angle PAB=30^\circ$이므로 중심각 $\angle POB=60^\circ$이다.
좌표를 $A=(0,0)$, $O=(r,0)$로 잡으면 $P=(\frac{3r}{2},\frac{\sqrt3r}{2})$이다.
직선 AP 방향 단위벡터는 $(\frac{\sqrt3}{2},\frac12)$이므로
$AQ=\frac{\sqrt3r}{2}$, $OQ=\frac r2$.
$[QAO]=\frac12\cdot\frac{\sqrt3r}{2}\cdot\frac r2=\frac{\sqrt3r^2}{8}=\frac{\sqrt[4]{27}}2$에서
$r^2=4\sqrt[4]3$이다.
또 $AR=\frac{3r}{2}$, $BR=\frac r2$이므로
$AR\cdot BR=\frac{3r^2}{4}=3^{\frac{5}{4}}$.
따라서 로그값은 $\frac54$이고 정답은 ④이다.
```

- **독립 판정·핵심 연결/검산:** 실물 반원 q21.png의 30°와 수선 Q 확인. \([QAO]=\sqrt3r^2/8=3^{3/4}/2\)에서 \(r^2=4\,3^{1/4}\), \(AR\cdot BR=3^{5/4}\), 로그값5/4, ④.
- 문제 그림: `archive/assets/images/23_강남여고_1학기_중간_고2_수학I/q21.png` (실물 판독 완료)
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
부등식 $2\log_4(x-1) \le \frac{1}{2} + \log_4(x+11)$를 만족시키는 모든 정수 $x$의 개수를 구하여라. [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `6`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그의 진수 조건에서 $x>1$이다.
$2\log_4(x-1)=\log_2(x-1)$이고
$\frac12+\log_4(x+11)=\log_2\sqrt{2(x+11)}$이다.
밑 2 로그는 증가하므로 $x-1\le\sqrt{2(x+11)}$.
양변은 양수여서 제곱하면 $x^2-4x-21\le0$, 즉 $-3\le x\le7$이다.
$x>1$인 정수는 2,3,4,5,6,7의 6개이다.
```

- **독립 판정·핵심 연결/검산:** 진수 \(x>1\), 제곱 비교로 \((x-1)^2\le2(x+11)\) ⇒ \(-3\le x\le7\), 정수2–7의 6개.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `로그의 뜻과 성질` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
세 실수 $x$, $y$, $z$에 대하여 $4^x = 5$, $20^y = \frac{1}{25}$, $\frac{1}{p^z} = 125$이고 $\frac{1}{x} + \frac{2}{y} + \frac{3}{z} = -2$일 때, 양수 $p$의 값을 구하여라. [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `5`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$4^x=5$에서 $\frac{1}{x}=\log_5 4$.
$20^y=\frac{1}{25}$에서 $\frac{2}{y}=-\log_5 20$.
$1/p^z=125$에서 $z\log p=-3\log5$, 따라서 $\frac{3}{z}=-\log_5p$.
주어진 합은 $\log_5 4-\log_5 20-\log_5p=\log_5(1/(5p))=-2$.
그러므로 $1/(5p)=\frac{1}{25}$, $p=5$이다.
```

- **독립 판정·핵심 연결/검산:** \(\frac1x=\log_5 4\), \(\frac2y=-\log_5 20\), \(\frac3z=-\log_5p\); \(\log_5(1/(5p))=-2\)에서 \(p=5\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q24 — KEEP

- source ordinal/id: `24` / `24`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $y = \cos^2 x - \sin x + 1$의 최댓값을 $M$, 최솟값을 $m$이라고 할 때, $M+m$의 값을 구하여라. [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `9/4`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
$t=\sin x$라 두면 $-1\le t\le1$이고
$y=1-t^2-t+1=2-t^2-t=\frac94-(t+\frac12)^2$.
최댓값은 $t=-\frac12$일 때 $M=\frac94$이다.
최솟값은 구간 양 끝에서 비교한다. $t=1$이면 0, $t=-1$이면 2이므로 $m=0$.
따라서 $M+m=\frac94$이다.
```

- **독립 판정·핵심 연결/검산:** \(t=\sin x\in[-1,1]\), \(y=9/4-(t+1/2)^2\); 최대9/4, 최소0, 합9/4.
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

### Q25 — KEEP

- source ordinal/id: `25` / `25`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob: `8ebd40181370523fd304d862ce76c48ac485502d`
- 문항 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

```text
함수 $\log_2\sin^2\theta + \log_4\cos^4\theta = \log_2\frac{1}{16}$이 성립할 때, $\sin\theta + \cos\theta$의 값을 구하여라. (단, $0 < \theta < \frac{\pi}{2}$) [5점]
```

- **원문 보기 (`choices` 순서 그대로):**

```text
[보기 없음 — 서답형]
```

- 원본 `answer`: `\frac{\sqrt6}{2}`
- 기존 `solution` 결정적 실제 발췌 (HTML은 표시 편의를 위해 정리, 내용은 원본 JS에 보존):

```text
로그의 성질로 좌변을 합치면
$\log_2(\sin^2\theta)+\frac12\log_2(\cos^4\theta)
=\log_2(\sin^2\theta\cos^2\theta)$이다.
따라서 $\sin^2\theta\cos^2\theta=\frac1{16}$.
$0<\theta<\frac\pi2$이므로 $\sin\theta\cos\theta=\frac14$.
$(\sin\theta+\cos\theta)^2=1+2\sin\theta\cos\theta=\frac32$이고 합은 양수이므로
$\sin\theta+\cos\theta=\frac{\sqrt6}{2}$이다.
```

- **독립 판정·핵심 연결/검산:** 제1사분면에서 \(\sin\theta\cos\theta=1/4\); \((\sin+\cos)^2=3/2\)와 양수조건에서 \(\sqrt6/2\).
- 문제 그림: 별도 문제 그림 없음
- **KEEP 사유:** 원본 해설의 결론·정답·수치가 독립 검산과 일치하며, 필요한 조건 및 끝점이 확인됨. `READ_EVIDENCED` / 최종 QA `NOT_RUN`.

## 시험지 QA·완료 보고 경계

- **전 문항 READ_EVIDENCED**: 25/25. 문항별 원문·정답·기존 해설·독립 계산·그림 링크를 위에 기록.
- **UPGRADE 전체 풀이 초안**: 1개 완성; 학생 노출은 아직 하지 않음.
- **HOLD**: 0개. 원본 문항 조건·답 불일치가 확정된 문항은 발견되지 않음.
- **원본 보존**: original JS/SVG/PNG와 default `main` 무변경.
- **미실행**: 학생 실제 렌더, 전체 preflight, Golden/Negative, SHA-256 전체 영수증, 운영 출고. **MD 작성 완료는 출고 QA 통과를 뜻하지 않는다.**

