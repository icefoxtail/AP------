# 2023 23_순천여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_순천여고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- course: `수학I` (파일명); `standardCourse` 누락 `0/23`, `category` 누락 `0/23`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_순천여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `23` · actual question/answer/solution read: `23` · KEEP 23 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 23문항의 원문 `content`·`choices`·`answer`·`solution` 및 참조 자료 검토. UPGRADE는 교체 가능한 학생용 해설 초안을 기록하고, HOLD는 수학적 충돌과 수정 권고를 기록한다. 원본 JS/그림/정답키/`main`은 수정하지 않음.

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


검토 방식: `23_순천여고_1학기_중간_고2_수학I.js`의 실제 문제·보기·정답·기존 해설 23개 전수를 읽고, 방정식의 정의역·밑 및 진수·근 개수·이차함수 범위·삼각함수 부호·기하 도형 관계를 독립 검산했다. 객관식은 선지·정답 번호를 비교하고, 서답형은 수치를 직접 대조했다. 문제 이미지 3개는 모두 실제 시각 판독(원본 PNG 또는 SVG 렌더)을 수행했다. `solutionImage` 9개는 원격 원본 실파일·blob 증거를 확인했으며 **보조 해설 그림 전체의 시각 판독은 NOT_RUN**이다. `preflight.mjs`, Golden/Negative, UI 출고 게이트, SHA-256 영수증은 `NOT_RUN`이며 원본 재발행 아님.

## 문제·보조 해설 이미지 실물 증거

- Q07 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q7-solution-v2.svg` · Git blob `85b380a3084f19fd4ca7136d2caa51e321e48385` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q10 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q10-solution.svg` · Git blob `a15f11018d9c55657a1a542347dc229ad5a7a617` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q12 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q12-solution.svg` · Git blob `bc804833645a835f4930fdcce31305dd5a882795` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q13 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q13-solution-v2.svg` · Git blob `9a9c6b7c9ca1139f838c0f84fb1b04d952e2cf72` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q14 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q14-solution-v2.svg` · Git blob `53005dcdc8d980e9def184aff1f0418dc45da81b` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q15 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q15-solution-v2.svg` · Git blob `cec9fe0b7d6ba3b2911a3fcfa1897deff6e29162` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q16 `image` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q16.png` · Git blob `dfc58321ee95a3533e35efbd647b90992b7fa613` · 실제 PNG/SVG 시각 판독 완료
- Q18 `image` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q18.png` · Git blob `3e6b4b232a06cd62ebf3d90f9ffea552a02ca825` · 실제 PNG/SVG 시각 판독 완료
- Q19 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q19-solution-v2.svg` · Git blob `3b731e83a42930f4f7dc178c7de93cc9205a85ed` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q20 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q20-solution-v2.svg` · Git blob `ef76e8910a1662b95987b48a9fe72c6e69a028a2` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q22 `image` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q22-problem-v1.svg` · Git blob `c620e6da621ec244f0201e9f811aeb0815cab3e6` · 실제 PNG/SVG 시각 판독 완료
- Q23 `solutionImage` — `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q23-solution-v2.svg` · Git blob `e909a680ea4ea1aa0b170c3a5f28a8bfdc36449c` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.6`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
반지름의 길이가 $8$이고, 중심각의 크기가 $\frac{\pi}{4}$인 부채꼴의 넓이는? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2\pi$
2. $8\pi$
3. $9\pi$
4. $10\pi$
5. $16\pi$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
부채꼴의 넓이는
$\frac12 r^2\theta$이다.
주어진 값 $r=8$, $\theta=\frac{\pi}{4}$를 대입하면
$\frac12\cdot8^2\cdot\frac{\pi}{4}$
$=32\cdot\frac{\pi}{4}=8\pi$이다.
따라서 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 부채꼴 넓이 \(\frac12 r^2\theta=\frac12\cdot64\cdot\pi/4=8\pi\), ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.6`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\left(2^{\sqrt{3}}\right)^{\sqrt{3}} + 2^{\frac{3}{2}} \times \frac{1}{\sqrt{2}}$의 값은? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $10$
2. $12$
3. $13$
4. $14$
5. $15$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
거듭제곱의 거듭제곱에서는 지수를 곱한다.
$\left(2^{\sqrt3}\right)^{\sqrt3}=2^{\sqrt3\cdot\sqrt3}=2^3=8$이다.
또
$2^{\frac32}\cdot\frac1{\sqrt2}=2^{\frac32}\cdot2^{-\frac12}=2$이다.
따라서 구하는 값은 $8+2=10$이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \((2^{\sqrt3})^{\sqrt3}=2^3=8\), \(2^{3/2}/\sqrt2=2\); 합 10, ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q03 — KEEP

- source ordinal/id: `3` / `3`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$1$이 아닌 두 양수 $a, b$에 대하여 $5\log a = 3\log b$일 때, $10\log_a b$의 값은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{3}{5}$
2. $5$
3. $6$
4. $15$
5. $\frac{50}{3}$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
주어진 식에서 로그의 밑을 바꾸어 비를 구한다.
$5\log a=3\log b$이므로
$\frac{\log b}{\log a}=\frac53$이다.
따라서
$\log_a b=\frac{\log b}{\log a}=\frac53$이고
$10\log_a b=10\cdot\frac53=\frac{50}{3}$이다.
따라서 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(5\log a=3\log b\)에서 \(\log_a b=5/3\), 따라서 \(10\log_a b=50/3\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 옳은 것은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-27$의 세제곱근 중 실수인 것은 $2$개이다.
2. $16$의 네제곱근 중 실수인 것은 $1$개이다.
3. $-16$의 네제곱근 중 실수인 것은 $1$개이다.
4. $-8$의 세제곱근 중 실수인 것은 $1$개이다.
5. $64$의 세제곱근 중 실수인 것은 $3$개이다.
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
홀수 차수와 짝수 차수의 거듭제곱근에서 실수인 해의 개수를 확인하자.

① $x^3=-27$의 실수해는 $x=-3$ 하나이므로 2개가 아니다.

② $x^4=16$의 실수해는 $x=2,-2$의 2개이므로 1개가 아니다.

③ $x^4=-16$은 실수해가 없으므로 1개가 아니다.

④ $x^3=-8$의 실수해는 $x=-2$ 하나이므로 실수인 세제곱근은 1개이다.

⑤ $x^3=64$의 실수해는 $x=4$ 하나이므로 3개가 아니다.

따라서 옳은 것은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(x^3=-8\)에는 실수 해 \(-2\) 하나; 홀수제곱근·짝수제곱근의 실수 해 개수를 구분한 ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
방정식 $\log_2 (x+1) + \log_2 (x-2) = 2$의 해를 $\alpha$라 할 때, $3^\alpha$의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{9}$
2. $\frac{1}{3}$
3. $3$
4. $9$
5. $27$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그의 진수 조건에서 $x>2$이다.
로그의 합을 곱으로 바꾸면
$\log_2{(x+1)(x-2)}=2$이다.
따라서
$(x+1)(x-2)=4$
$x^2-x-6=0$
$(x-3)(x+2)=0$이다.
조건 $x>2$를 만족하는 해는 $\alpha=3$뿐이다.
그러므로 $3^\alpha=27$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 진수 \(x>2\)에서 \((x+1)(x-2)=4\Rightarrow x=3\); \(3^\alpha=27\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.8`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sin(-150^\circ) - \cos\left(\frac{4\pi}{3}\right) + \tan\left(-\frac{3\pi}{4}\right)$의 값은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-1$
2. $-\frac{1}{2}$
3. $0$
4. $1$
5. $\frac{3}{2}$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
삼각함수의 특수각 값을 각각 구한다.
$\sin(-150^\circ)=-\frac12$,
$\cos(\frac{4\pi}{3})=-\frac12$,
$\tan(-\frac{3\pi}{4})=1$이다.
따라서
$-\frac12-(-\frac12)+1=1$이다.
정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(\sin(-150^\circ)=-1/2,\ \cos(4\pi/3)=-1/2,\ \tan(-3\pi/4)=1\). 주어진 합차는 1, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
정의역이 $\{x \mid -2 \le x \le 2\}$인 함수
$$f(x) = 3 \times \left(\frac{a}{a+2}\right)^x$$
의 최댓값이 $48$일 때, 상수 $a$의 값은? (단, $a > 0$) [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{2}{3}$
2. $\frac{4}{3}$
3. $\frac{8}{3}$
4. $4$
5. $6$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
밑 $r=\frac{a}{a+2}$는 $a>0$이므로 $0<r<1$이다.
따라서 $f(x)=3r^x$는 감소함수이고, 정의역 $[-2,2]$에서 최댓값은 $x=-2$일 때이다.
$3r^{-2}=48$에서
$r^2=\frac1{16}$, $r=\frac14$이다.
그러므로
$\frac{a}{a+2}=\frac14$
$4a=a+2$
$a=\frac23$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(0<a/(a+2)<1\)이므로 주어진 구간 최댓값은 왼쪽 끝 \(x=-2\)에서 48. \(3(a/(a+2))^{-2}=48\)로 \(a/(a+2)=1/4\), \(a=2/3\), ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q7-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
소리의 세기가 $I\text{ W/m}^2$일 때, 소리의 크기 $D\text{ dB}$는
$$D = k\log\frac{I}{10^{-12}}\ (k\text{는 상수})$$
와 같이 정한다고 한다. 속삭이는 대화의 소리의 세기가 $10^{-10}\text{ W/m}^2$일 때, 소리의 크기는 $20\text{ dB}$이다. 망치질 소리의 세기가 $10^{-6}\text{ W/m}^2$일 때 망치질 소리의 크기는 속삭이는 대화의 소리의 크기의 몇 배인가? [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2$
2. $3$
3. $4$
4. $5$
5. $6$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
속삭이는 소리에서
$20=k\log\frac{10^{-10}}{10^{-12}}=k\log 10^2=2k$이므로 $k=10$이다.
망치질 소리에서는
$D=10\log\frac{10^{-6}}{10^{-12}}=10\log 10^6=60$이다.
따라서 크기의 비는 $\frac{60}{20}=3$이고 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 소리 세기 20dB인 세기를 \(10^{-10}\)으로 두면 변환계수 \(k=10\); \(10^{-6}\)의 크기는 60dB로 원래의 3배, ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `3.9`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
두 실수 $a, b$에 대하여 $3^a = 4^b = 144$이 성립할 때, $\frac{1}{a} + \frac{1}{b}$의 값은? (단 $ab \ne 0$이다.) [3.9점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-\frac{1}{4}$
2. $-\frac{1}{2}$
3. $\frac{1}{2}$
4. $\frac{1}{4}$
5. $\frac{5}{4}$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$3^a=144$에서 $a=\log_3 144$이므로
$\frac1a=\log_{144}3$이다.
같은 방법으로 $\frac1b=\log_{144}4$이다.
따라서
$\frac1a+\frac1b=\log_{144}3+\log_{144}4$
$=\log_{144}12=\frac12$이다.
정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(3^a=4^b=144\)이면 \(1/a+1/b=\log_{144}3+\log_{144}4=\log_{144}12=1/2\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
부등식 $\log_{\frac{1}{2}} (x-4) + \log_{\frac{1}{2}} (x+3) > \log_{\frac{1}{2}} 4 - 1$를 만족시키는 해가 $\alpha < x < \beta$라고 할 때, $\beta - \alpha$의 값은? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $3$
3. $5$
4. $7$
5. $9$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
정의역에서 $x>4$이다.
오른쪽은 $\log_{\frac{1}{2}}4-1=-2-1=-3$이다.
왼쪽 로그의 합은
$\log_{\frac{1}{2}}{(x-4)(x+3)}$이다.
밑이 $0$과 $1$ 사이이므로
$(x-4)(x+3)<(\frac12)^{-3}=8$이다.
정리하면
$x^2-x-20<0$
$(x+4)(x-5)<0$이므로 $-4<x<5$이다.
정의역과 함께 보면 $4<x<5$이고, 구간의 길이는 $1$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 밑 \(1/2<1\)이라 부등호를 뒤집고 진수 \((x-4)(x+3)>0\)도 적용. \(x>4\) 영역의 해는 \(4<x<5\), 길이 1, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q10-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
모든 실수 $x$에 대하여 이차부등식
$$\frac{x^2 - 2\times 3^k x + 7\times 3^k +18}{10^{-12}} > 0$$
가 항상 성립하도록 하는 실수 $k$값의 범위는? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-2 < k < 9$
2. $0 < k < 2$
3. $0 < k < 9$
4. $k > 9$
5. $k < 2$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
분모 $10^{-12}$는 양수이므로 분자의 이차식이 모든 실수 $x$에서 양수여야 한다.
이차식의 판별식이 음수일 조건을 쓰면
$\frac D4=(3^k)^2-(7\cdot3^k+18)<0$이다.
인수분해하면
$(3^k-9)(3^k+2)<0$이다.
$3^k+2>0$이므로 $3^k<9$, 즉 $k<2$이다.
따라서 범위는 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(y=3^k>0\)라 놓고 근을 비교하면 \(y^2-7y-18<0\Rightarrow0<y<9\). 따라서 \(3^k<9\) 또는 \(k<2\), ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
한 개의 주사위를 던져 나오는 눈의 수를 원소로 가지는 집합 $A$에 대하여 집합 $X$를
$$X = \left\{x \mid x = \sin\frac{a\pi}{7}, a \in A\right\}$$
라 하자. 집합 $X$의 원소의 개수는? [4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$a=1,2,3,4,5,6$을 대입한다.
$X=\{\sin\frac{\pi}{7},\sin\frac{2\pi}{7},\sin\frac{3\pi}{7},\sin\frac{4\pi}{7},\sin\frac{5\pi}{7},\sin\frac{6\pi}{7}\}$이다.
$\sin(\pi-t)=\sin t$이므로
$\sin\frac{6\pi}{7}=\sin\frac{\pi}{7}$,
$\sin\frac{5\pi}{7}=\sin\frac{2\pi}{7}$,
$\sin\frac{4\pi}{7}=\sin\frac{3\pi}{7}$이다.
처음 세 값은 서로 다르므로 원소는 3개이다.
정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(\sin(a\pi/7)\)에서 \(a=1,\ldots,6\)은 \(a\)와 \(7-a\)가 같은 값이므로 서로 다른 값 3개, ③.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q12-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $f(x) = \log_2 x$에 대하여 함수 $y = f(x)$의 그래프를 $x$축에 대하여 대칭이동 시킨 후 $y$축의 방향으로 $m$만큼 평행 이동시키면 함수 $y = g(x)$의 그래프가 된다. 두 함수 $y = f(x)$의 그래프와 $y = g(x)$의 그래프가 직선 $y = 2$에 대하여 대칭일 때, 상수 $m$의 값은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $8$
2. $4$
3. $0$
4. $-4$
5. $-8$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$y=\log_2x$를 $x$축에 대칭이동하면 $y=-\log_2x$이다.
이를 위로 $m$만큼 옮긴 그래프는
$g(x)=-\log_2x+m$이다.
직선 $y=2$에 대한 대칭 그래프의 식은
$y=4-\log_2x$이다.
따라서 $-\log_2x+m=4-\log_2x$이므로 $m=4$이다.
정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(y=\log_2 x\)를 \(x\)축 대칭 후 \(m\)만큼 위로 올리면 \(y=-\log_2 x+m\). 두 곡선 대칭축 \(y=m/2=2\), \(m=4\), ②.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q13-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.1`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$x$에 대한 방정식 $|3^{x+1} - 5| = k$가 한 개의 양의 실근과 한 개의 음의 실근을 갖도록 하는 모든 자연수 $k$의 값의 합은? [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $7$
2. $9$
3. $12$
4. $14$
5. $15$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$t=3^{x+1}$이라 두면 $t>0$이고, $x>0$은 $t>3$, $x<0$은 $0<t<3$과 같다.
$|t-5|=k$의 두 후보는 $t=5+k$, $t=5-k$이다.
첫 값은 $k>0$일 때 항상 $3$보다 크다.
둘째 값이 양수이면서 $3$보다 작으려면
$0<5-k<3$이므로 $2<k<5$이다.
자연수 $k$는 $3,4$이고 합은 $7$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(|3^{x+1}-5|=k\)가 양·음의 실근을 각 하나 갖는 정수 \(k\)는 3,4만이므로 합 7, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q14-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_3 (-x^2 + ax + 2)$의 값이 자연수가 되도록 하는 실수 $x$의 개수가 $5$일 때, 양수 $a$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $2$
2. $4$
3. $6$
4. $8$
5. $10$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$-x^2+ax+2=3^n$을 생각하면
$x^2-ax+(3^n-2)=0$이다.
자연수 $n$마다 실근 개수는 판별식
$D=a^2-4(3^n-2)=a^2+8-4\cdot3^n$으로 결정된다.
실근이 2개인 단계가 두 번이고 한 번 접하는 단계가 한 번이면 전체가 5개다.
따라서 세 번째 단계 $n=3$에서 꼭짓값이 $3^3=27$이고, 그보다 작은 $3,9$에서는 각각 서로 다른 두 근이 생긴다.
$\frac{a^2}{4}+2=27$에서 $a^2=100$이다.
$a>0$이므로 $a=10$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_3(-x^2+ax+2)\)가 자연수가 되는 서로 다른 \(x\)의 수를 5개로 맞추려면 진수 포물선의 최대가 27, \(\ 2+a^2/4=27\); \(a=10\), ⑤.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q15-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.2`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 그림과 같이 좌표평면 위에 곡선 $y = \log_{\frac{1}{2}} x$와 $x$축 위에 서로 다른 세 점 $A(x_1, 0)$, $B(x_2, 0)$, $C(x_3, 0)$이 있다. $\overline{AB} = \overline{BC}$일 때, 옳은 것만을 보기에서 있는 대로 고른 것은? (단, $1 < x_1 < x_2 < x_3$) [4.2점]
<보기>
ㄱ. $\log_{\frac{1}{2}} (x_2 - x_1) = \log_{\frac{1}{2}} (x_3 - x_2)$
ㄴ. $\log_{\frac{1}{2}} (x_1 + x_2 + x_3) = \log_{\frac{1}{2}} (3x_2)$이다.
ㄷ. $\log_{\frac{1}{2}} \frac{x_2}{x_1} > \log_{\frac{1}{2}} \frac{x_3}{x_2}$이다.
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄴ
4. ㄱ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$x_2-x_1=x_3-x_2$이므로 ㄱ의 두 로그 진수는 같다. ㄱ은 참이다.
또
$x_1+x_2+x_3=3x_2$이므로 ㄴ도 참이다.
$x_1<x_2<x_3$이고 두 간격이 같으므로
$\frac{x_2}{x_1}=1+\frac d{x_1}>1+\frac d{x_2}=\frac{x_3}{x_2}$이다.
밑 $\frac{1}{2}$인 로그함수는 감소하므로
$\log_{\frac{1}{2}}\frac{x_2}{x_1}<\log_{\frac{1}{2}}\frac{x_3}{x_2}$이다. ㄷ은 거짓이다.
따라서 옳은 것은 ㄱ, ㄴ이고 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 실물 그래프에서 \(A,B,C\)는 \(x\)축 위에서 간격이 일정하다. 밑 \(1/2\) 로그는 감소·볼록하여 높이/변화량 관계상 ㄱ·ㄴ 참, ㄷ 거짓, ③.
- 그림 증거: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q16.png` (시각 검토, blob `dfc58321ee95a3533e35efbd647b90992b7fa613`)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$1$보다 크고 $50$보다 작은 두 자연수 $a, b$에 대하여 $\frac{\log\sqrt{b}}{\log a} = \frac{\log a}{\log\sqrt{b}}$를 만족시키는 순서쌍 $(a, b)$의 개수는? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $9$
2. $8$
3. $7$
4. $6$
5. $5$
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
로그의 분모와 분자는 양수이므로 비가 같다는 식에서
$(\log a)^2=(\log\sqrt b)^2$이고 두 값이 양수이므로
$\log a=\log\sqrt b$이다.
따라서 $a=\sqrt b$, 즉 $b=a^2$이다.
$1<a,b<50$에서 $a$는 $2,3,4,5,6,7$이고 각 값마다 $b=a^2<50$이 성립한다.
순서쌍은 6개이며 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_{\sqrt b}a=\log_a\sqrt b\)로부터 유효 밑 조건을 확인해 \(b=a^2\). \(2\le a\le7\)인 자연수 6개에 대응하는 쌍 6개, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.3`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
그림과 같이 선분 $AB$를 지름으로 하는 반원이 있다. 선분 $AB$의 중점을 $O$라 하고 호 $AB$ 위의 점 $P$에 대하여 $AP$의 중점 $Q$에서 선분 $AB$에 내린 수선의 발을 $R$이라 하자. $\angle PAB = 30^\circ$이고 $\log_3 (\overline{AR} \times \overline{OR}) = \frac{8}{3}$일 때, 삼각형 $PAB$의 넓이를 구하면 $k\sqrt[6]{3}$이다. 상수 $k$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $64$
2. $72$
3. $74$
4. $82$
5. $92$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$Q$는 $AP$의 중점이고 $QR\perp AB$이므로 $R$은 $AP$의 수평 중점이다.
$\angle APB=90^\circ$이고 $\angle PAB=30^\circ$이므로 $\triangle PAB$는 $30^\circ$-$60^\circ$-$90^\circ$ 삼각형이다.
$AB=L$이라 두면 $AP=\frac{\sqrt3}{2}L$이고, $P$의 높이는
$AP\sin30^\circ=\frac{\sqrt3}{4}L$이다.
또 $AR=AP\cos30^\circ/2=3L/8$, $OR=AB/2-AR=\frac{L}{8}$이다.
따라서
$AR\cdot OR=3L^2/64$이고
$\log_3(3L^2/64)=\frac{8}{3}$에서
$3L^2/64=3^{\frac{8}{3}}$, $L^2=64\cdot3^{\frac{5}{3}}$이다.
삼각형 넓이는
$\frac12L\cdot\frac{\sqrt3}{4}L=\frac{\sqrt3}{8}L^2=72\sqrt[6]{3}$이다.
따라서 $k=72$이고 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 반원에서 \(\angle APB=90^\circ\), \(\angle PAB=30^\circ\); 중점 \(Q\)의 수선 \(QR\)로 \(AR=3AB/8,\ OR=AB/8\) (실물 그림 확인). 주어진 길이·면적 조건에 대입해 요청한 계수 \(k=72\), ②.
- 그림 증거: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q18.png` (시각 검토, blob `3e6b4b232a06cd62ebf3d90f9ffea552a02ca825`)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.4`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $f(x) = \log_2 (x-3) - 2$, $g(x) = \log_2 |x-3| - 2$에 대하여 $y = g(x)$와 직선 $y = 1$이 만나는 두 점을 $A(x_1, y_1)$, $B(x_2, y_2)$라 하자. 점 $B$를 지나고 기울기가 $-1$인 직선과 $y = f(x)$의 역함수와의 교점을 $C$라 할 때, 삼각형 $ABC$의 넓이는? (단, $x_1 < x_2$) [4.4점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $80$
2. $76$
3. $74$
4. $64$
5. $48$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$g(x)=1$에서
$\log_2|x-3|-2=1$, 따라서 $|x-3|=8$이다.
그러므로 $A=(-5,1)$, $B=(11,1)$이다.
점 $B$를 지나고 기울기가 $-1$인 직선은 $y=-x+12$이다.
$f(x)=\log_2(x-3)-2$의 역함수는
$y=3+2^{x+2}$이다.
교점에서 $3+2^{x+2}=-x+12$이다.
이를 한쪽으로 모으면 $2^{x+2}+x-9=0$이다. $2^{x+2}+x-9$는 증가함수이므로 해는 하나뿐이다.
$x=1$을 대입하면 양쪽이 모두 $11$이므로 $C=(1,11)$이다.
밑변 $AB=16$, 높이는 $10$이므로 넓이는 $\frac12\cdot16\cdot10=80$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(g(x)=\log_2|x-3|-2=1\Rightarrow x=-5,11\). \(B=(11,1)\)을 지나는 기울기 -1 직선은 \(y=-x+12\). \(f^{-1}(x)=3+2^{x+2}\)와 \(C=(1,11)\)에서 만나고, 삼각형 넓이 80, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q19-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `객관식` / `4.5`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
실수 $k$에 대하여 함수 $f(x) = 2\cos\frac{x}{3} + k$에 대하여 다음 보기 중 옳은 것을 있는 대로 고른 것은? [4.5점]
<보기>
ㄱ. $y = f(x)$의 주기는 $6\pi$이다.
ㄴ. $y = f(x)$의 치역의 원소 중 정수인 것의 개수는 $5$개이다.
ㄷ. $y = |f(x) - 1|$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M - m = 3$를 만족시키는 $k$값의 곱은 $-1$ 이다.
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄴ
4. ㄱ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$2\cos(\frac{x}{3})$의 주기는 $6\pi$이므로 ㄱ은 참이다.
치역은 $[k-2,k+2]$이다. $k=0$이면 이 구간의 정수는 $-2,-1,0,1,2$로 5개지만, $k=\frac12$이면 구간은 $[-\frac32,\frac52]$이고 정수는 $-1,0,1,2$로 4개이다. 따라서 ㄴ은 거짓이다.

$u=f(x)-1$의 범위는 $[k-3,k+1]$이다.
$k<-1$ 또는 $k>3$이면 이 구간이 0의 한쪽에 놓이므로 $M-m=4$이다.
$-1\le k\le3$이면 구간이 0을 포함하여 $m=0$, $M=\max(|k-3|,|k+1|)$이다. $M=3$을 만족하는 값은 $k=0$ 또는 $k=2$이고, 두 값의 곱은 $0$이다. 따라서 ㄷ도 거짓이다.

옳은 것은 ㄱ뿐이므로 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(f(x)=2\cos(x/3)+k\)의 기본주기 \(6\pi\)는 참. 수평 범위 \([k-2,k+2]\) 안 정수 개수는 항상 5가 아니며, \(M-m=3\)인 \(k=0,2\)의 곱도 주장과 불일치; ㄱ만 참, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q20-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q21 — KEEP

- source ordinal/id: `21` / `21`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `서술형` / `6`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
$\theta$가 제 $3$사분면의 각이고 $\cos\theta + \cos\left(\frac{\pi}{2} + \theta\right) = \frac{1}{3}$일 때, $\sqrt{-\sin\theta}\sqrt{-\cos\theta}$의 값을 구하시오. (6점)
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `\frac{2}{3}`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
제3사분면에서는 $\sin\theta<0$, $\cos\theta<0$이다. 따라서 $x=-\sin\theta$, $y=-\cos\theta$로 두면 $x>0$, $y>0$이다.

삼각함수의 관계 $\cos\left(\frac{\pi}{2}+\theta\right)=-\sin\theta$를 주어진 식에 대입하면
$\cos\theta-\sin\theta=\frac13$이다.

$x=-\sin\theta$, $y=-\cos\theta$이므로
$x-y=\frac13$이다.

또한
$x^2+y^2=\sin^2\theta+\cos^2\theta=1$이다.

따라서
$(x-y)^2=x^2+y^2-2xy$,
$\frac19=1-2xy$,
$xy=\frac49$이다.

구하려는 값은
$\sqrt{-\sin\theta}\sqrt{-\cos\theta}=\sqrt{x}\sqrt{y}=\sqrt{xy}=\sqrt{\frac49}=\frac23$이다.
````

- **독립 판정·핵심 연결/검산:** 제3사분면에서 사인·코사인이 둘 다 음수. \(\cos\theta-\sin\theta=1/3\)을 제곱해 \(\sin\theta\cos\theta=4/9\); 두 음수의 크기의 곱의 제곱근 \(2/3\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
직선 $y = -2x + k$와 $y$축과의 교점을 $A$라 하고, $y = -2x + k$가 두 함수 $y = 4^x - 3$, $y = 2^{x+a} + 2$의 그래프와 만나는 점을 각각 $B, C$라 하자. 점 $C$의 $x$좌표가 $2$이고, 점 $A$가 $\overline{BC}$를 $3:4$로 외분하는 점일 때, 상수 $a, k$값을 각각 구하시오. (7점)
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `a=-1, k=8`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
$A$는 $y$축 위의 점이므로 $x_A=0$이고, $x_C=2$이다.
$A$가 $\overline{BC}$를 $3:4$로 외분하므로 $|x_B|:|x_C|=3:4$이다. 따라서 $x_B=\frac32$ 또는 $x_B=-\frac32$이다. $x_B=-\frac32$이면 $0$이 $-\frac32$와 $2$ 사이에 있어 내분이 되므로, 외분 조건에 맞는 값은 $x_B=\frac32$이다.
$B$는 $y=4^x-3$ 위에 있으므로 $y_B=4^{\frac{3}{2}}-3=5$이다. 직선 $y=-2x+k$에 대입하면 $5=-2\cdot\frac32+k$에서 $k=8$이다.
이제 $C$의 직선 위의 $y$좌표는 $-2\cdot2+8=4$이다. $C$는 $y=2^{x+a}+2$ 위에 있으므로 $4=2^{2+a}+2$, $2^{2+a}=2$이고 $a=-1$이다.
따라서 $a=-1$, $k=8$이다.
````

- **독립 판정·핵심 연결/검산:** 실물 SVG에서 \(A=(0,k)\), \(C\)의 \(x=2\), 외분비 \(AB:AC=3:4\)로 \(x_B=3/2\). \(4^{3/2}-3=5\)와 직선 기울기 -2에서 \(k=8\); \(2^{2+a}+2=4\Rightarrow a=-1\).
- 그림 증거: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q22-problem-v1.svg` (시각 검토, blob `c620e6da621ec244f0201e9f811aeb0815cab3e6`)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q23 — KEEP

- source ordinal/id: `23` / `23`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob `3ba7f42ea0da041c88b1cf7a2348dcc72d6ec357`
- 형식/배점: `서술형` / `7`; 문항 단원/과정: `수학I` / `수학I`
- **원문 문제·조건 (`content` 그대로):**

````text
양수 $k$에 대하여 세 함수 $f(x) = \log_{\frac{1}{3}} (x+3)$, $g(x) = \log_9 (x+3)$, $h(x) = \log_3 (x-k)$가 있다. 두 함수 $y = f(x)$, $y = g(x)$의 그래프의 교점을 $A$, 두 함수 $y = f(x)$, $y = h(x)$의 그래프의 교점을 $B$, 두 함수 $y = g(x)$, $y = h(x)$의 그래프의 교점을 $C$라고 하고, 함수 $y = h(x)$의 그래프의 점근선이 두 함수 $y = f(x)$, $y = g(x)$의 그래프와 만나는 점을 각각 $D, E$라 하자. $\overline{DE} = \frac{3}{2}\log_3 6$일 때, 삼각형 $ABC$의 무게중심의 $x$좌표를 구하시오. (7점)
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `\frac{4+\sqrt{10}}{3}`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
교점 $A$는
$\log_{\frac{1}{3}}(x+3)=\log_9(x+3)$에서 구한다.
$u=\log_3(x+3)$라 두면 $-u=\frac{u}{2}$이므로 $u=0$, $A=(-2,0)$이다.
점근선은 $x=k$이다. 이 직선과 $f,g$의 교점 $D,E$는 세로로 놓이며
$DE=|\log_{\frac{1}{3}}(k+3)-\log_9(k+3)|=\frac32\log_3(k+3)$이다.
주어진 길이와 비교하여 $k+3=6$, 따라서 $k=3$이다.
$B$는 $f=h$에서
$-\log_3(x+3)=\log_3(x-3)$이므로 $(x+3)(x-3)=1$, 즉 $x^2=10$이다.
$x=\pm\sqrt{10}$ 중 $h$의 정의역 $x>3$을 만족하는 값은 $x_B=\sqrt{10}$이다.
$C$는 $g=h$에서
$\frac12\log_3(x+3)=\log_3(x-3)$이므로 $x+3=(x-3)^2$이다.
$(x-1)(x-6)=0$ 중 정의역 $x>3$을 만족하는 것은 $x_C=6$이다.


세로 점근선은 $x=3$이다. 그림에서 만나는 곳을 아래와 같이 대응시킨다.

| 점 | 그림에서의 위치 | 좌표 |
| --- | --- | --- |
| $A$ | 곡선 $f$와 $g$의 교점 | $x=-2$, $y=0$ |
| $B$ | 곡선 $f$와 $h$의 교점 | $x=\sqrt{10}$, $y=\log_3(\sqrt{10}-3)$ |
| $C$ | 곡선 $g$와 $h$의 교점 | $x=6$, $y=1$ |
| $D$ | 곡선 $f$와 점근선의 교점 | $x=3$, $y=-\log_3 6$ |
| $E$ | 곡선 $g$와 점근선의 교점 | $x=3$, $y=\frac{1}{2}\log_3 6$ |

무게중심의 $x$좌표는
$\frac{-2+\sqrt{10}+6}{3}=\frac{4+\sqrt{10}}{3}$이다.
````

- **독립 판정·핵심 연결/검산:** \(f,g\)의 밑변환과 \(h\)의 점근선을 이용해 \(k=3\), 세 점의 \(x\)좌표 \(-2,\sqrt{10},6\). 삼각형 무게중심 \(x=(-2+\sqrt{10}+6)/3=(4+\sqrt{10})/3\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천여고_1학기_중간_고2_수학I/q23-solution-v2.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 전수 범위: Q01–Q23; 총 23개, UNREAD 0. 각 문항의 원문/보기/정답/기존 해설과 독립 계산을 수록.
- 판정 합계: KEEP 23, UPGRADE 0, HOLD 0 (총 23).
- 학생용 개선 초안: NONE; 모두 본문 수록.
- 보류: NONE; 출고 전 원문·선지·해설·정답 합동 수정 필요.
- 실물 원본 그림 3개 판독, 보조 해설 그림 9개 원본 존재 확인. 최종 학생 화면/UI 렌더·통합 QA `NOT_RUN`.
- 본 문서는 worker branch 감사 기록이다. 실제 운영 자료로 출고·배포한 상태가 아니며, 잔여 HOLD는 다음 시험지 검토 진행을 막지 않는다.
