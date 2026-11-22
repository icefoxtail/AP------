# 2023 23_순천고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2023`
- source: `archive/exams/original/high/h2/1mid/23_순천고_1학기_중간_고2_수학I.js`
- source ref: `main@6879fbd15d04cd41af0567d92c874b96c7e56b1c`
- source blob SHA: `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- course: `수학I` (파일명); `standardCourse` 누락 `22/22`, `category` 누락 `22/22`
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/23_순천고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `22` · actual question/answer/solution read: `22` · KEEP 20 · UPGRADE 2 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 전 22문항의 원문 `content`·`choices`·`answer`·`solution` 및 참조 자료 검토. UPGRADE는 교체 가능한 학생용 해설 초안을 기록하고, HOLD는 수학적 충돌과 수정 권고를 기록한다. 원본 JS/그림/정답키/`main`은 수정하지 않음.

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


검토 방식: `23_순천고_1학기_중간_고2_수학I.js`의 실제 문제·보기·정답·기존 해설 22개 전수를 읽고, 방정식의 정의역·밑 및 진수·근 개수·이차함수 범위·삼각함수 부호·기하 도형 관계를 독립 검산했다. 객관식은 선지·정답 번호를 비교하고, 서답형은 수치를 직접 대조했다. 문제 이미지 4개는 모두 실제 시각 판독(원본 PNG 또는 SVG 렌더)을 수행했다. `solutionImage` 7개는 원격 원본 실파일·blob 증거를 확인했으며 **보조 해설 그림 전체의 시각 판독은 NOT_RUN**이다. `preflight.mjs`, Golden/Negative, UI 출고 게이트, SHA-256 영수증은 `NOT_RUN`이며 원본 재발행 아님.

메타데이터 주의: 일부 문항에 `standardCourse`/`category` 키가 없으므로 해당 셀은 `NOT_PRESENT`로 표기하고, 파일명의 ‘수학I/대수’는 검색용 별도 단서일 뿐 원본 메타데이터 값으로 둔갑시키지 않음.

## 문제·보조 해설 이미지 실물 증거

- Q02 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q2-solution.svg` · Git blob `701f7e9e66c7899ab9ec7cdb9e268075bd643e6e` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q03 `content` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q03-engine-upgrade.svg` · Git blob `6a644dff453d3a42b0ac73fcce8e2b113f8ee4f5` · 실제 PNG/SVG 시각 판독 완료
- Q10 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q10-solution.svg` · Git blob `3d24d673484e97c97ee212aaa00c9b608e511f3e` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q12 `content` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-r3-source-recrop.png` · Git blob `0abfdd8fa07286833833b717158b1418dc551b72` · 실제 PNG/SVG 시각 판독 완료
- Q12 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-solution.svg` · Git blob `ccffe50cb6566f0f9f8b574bf53891770ae54b55` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q15 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q15-solution.svg` · Git blob `d51f46543df7889fdde5f9b78449af6c8f4c14d5` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q18 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q18-solution.svg` · Git blob `df2607c51c99c37c43452b9fffdc9a446167e358` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q19 `content` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-r3-source-recrop.png` · Git blob `9d1845e0e61cdbb1ae298fedc3939c155c71248f` · 실제 PNG/SVG 시각 판독 완료
- Q19 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-solution.svg` · Git blob `e26f09a38589ba6eef90cd5a12ac97a32368412f` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN
- Q21 `content` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q21.png` · Git blob `faab86cc70522ddefeb18f8531552566deb883de` · 실제 PNG/SVG 시각 판독 완료
- Q22 `solutionImage` — `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q22-solution.svg` · Git blob `75a125fb5ce6385f8683702c546fe2d5b99b3c6a` · 실제 파일/blobs 확인; 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q01`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-01` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$\sqrt[4]{(-3)^4} + \sqrt[3]{(-4)^3} \times \sqrt{\sqrt[3]{64}}$의 값은? [3.5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. -5
2. -2
3. 2
4. 5
5. 11
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>[핵심] 짝수 제곱근은 0 이상인 값을 택하고, 중첩된 근호는 안쪽부터 계산합니다.</p><p>$\sqrt[4]{(-3)^4}=3$, $\sqrt[3]{(-4)^3}=-4$입니다.</p><p>또 $\sqrt[3]{64}=4$이므로 $\sqrt{\sqrt[3]{64}}=\sqrt4=2$입니다.</p><p>따라서 $3+(-4)\times2=-5$이며, 정답은 <b>①</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 짝수제곱근의 주값과 홀수제곱근의 부호를 구분하면 \(\sqrt[4]{(-3)^4}=3,\ \sqrt[3]{(-4)^3}=-4,\ \sqrt{\sqrt[3]{64}}=2\); 합 \(3-8=-5\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q02 — KEEP

- source ordinal/id: `2` / `2`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q02`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-03` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 함수 $y=2^{x-3}+1$의 설명으로 옳은 것은? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 정의역은 $\{x \mid x>3\}$이다.
2. 치역은 실수 전체의 집합이다.
3. 그래프의 점근선은 $y=1$이다.
4. $x$의 값이 증가하면 $y$의 값은 감소한다.
5. 그래프는 함수 $y=2^x$의 그래프를 $x$축의 방향으로 $3$만큼, $y$축의 방향으로 $-1$만큼 평행이동한 것이다.
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$2^{x-3}>0$이므로 정의역은 실수 전체이고 치역은 $y>1$입니다. 밑이 2로 1보다 크므로 증가함수입니다.</p><p>$y=2^x$를 오른쪽으로 3, 위로 1만큼 옮겼으므로 점근선은 $y=1$입니다. 옳은 설명은 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(y=2^{x-3}+1\)은 \(x\)방향 +3, \(y\)방향 +1 이동; 정의역 실수 전체, 치역 \(y>1\), 수평 점근선 \(y=1\), ③.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q2-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q03 — UPGRADE

- source ordinal/id: `3` / `3`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q03`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
오른쪽 그림은 함수 $y=\log_{\frac{1}{2}}x$의 그래프와 직선 $y=x$이다. 이때 실수 $a$의 값은? [3.5점]<br><div class="exam-img-box"><img src="assets/images/23_순천고_1학기_중간_고2_수학I/q03-engine-upgrade.svg" alt="로그함수 y=log 밑 1/2 x와 직선 y=x의 그래프. 점선은 같은 높이 y=1과 y=1/2에서 두 그래프의 점을 이어, 구하는 x좌표를 a로 나타낸다." class="exam-img"></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{2}$
2. $\frac{2}{3}$
3. $\frac{3}{4}$
4. $\frac{1}{\sqrt{3}}$
5. $\frac{1}{\sqrt{2}}$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>그림에서 직선 $y=x$ 위의 점 $(\frac{1}{2},\frac{1}{2})$와 같은 높이의 점을 로그곡선 위에 표시했고, 그 점의 $x$좌표가 $a$입니다.</p><p>따라서 $\log_{\frac{1}{2}}a=\frac{1}{2}$이므로 $a=(\frac{1}{2})^{\frac{1}{2}}=1/\sqrt2$입니다. 정답 <b>⑤</b>. 그림의 점선은 $y=x$ 위의 $(\frac{1}{2},\frac{1}{2})$에서 수평으로 로그곡선까지 이어지고, 그 로그곡선 점의 $x$좌표를 $a$로 표시합니다. 두 실선의 교점은 다른 곳이므로 $\log_{\frac{1}{2}}a=a$로 놓으면 안 됩니다. $\log_{\frac{1}{2}}a=\frac{1}{2}$에서 $a=1/\sqrt2$입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 실물 SVG에서 표시한 점 \(a\)의 로그곡선 높이는 \(1/2\)이다. \(\log_{1/2}a=1/2\Rightarrow a=(1/2)^{1/2}=1/\sqrt2\), ⑤. \(y=x\)와 두 곡선의 교점을 \(a\)로 혼동하지 않음.
- 그림 증거: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q03-engine-upgrade.svg` (시각 검토, blob `6a644dff453d3a42b0ac73fcce8e2b113f8ee4f5`)
- **UPGRADE 사유:** 계산/의도된 정답은 유지하되 학생 이해도, 원본 표기 혼용 또는 정의역 조건의 명시성을 보완할 필요가 있음. 초안은 아래에 완성하여 남김. 원본 정답키 미수정.

**학생용 교체 해설 초안**

**1단계—그림의 점을 읽는다.** \(y=x\) 위의 \((1/2,1/2)\)에서 오른쪽으로 그은 수평 점선이 로그함수 \(y=\log_{1/2}x\)를 만나는 점의 \(x\)좌표가 \(a\)이다. 따라서 그림이 준 관계는 \(\log_{1/2}a=1/2\)이다.

**2단계—로그를 지수식으로 바꾼다.** \(\displaystyle a=(1/2)^{1/2}=\frac1{\sqrt2}\).

**주의:** 두 실선 \(y=x\)와 \(y=\log_{1/2}x\)의 교점을 뜻하는 문제가 아니므로 \(\log_{1/2}a=a\)라고 놓으면 안 된다.

**답:** \(\displaystyle a=\frac1{\sqrt2}\), **⑤**. 기존 해설의 같은 계산 반복 문단을 하나로 정리한 학생용 초안.


### Q04 — KEEP

- source ordinal/id: `4` / `4`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q04`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-02` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $f$가 $f(x)=\log x^2$일 때, 다음 중 항상 참인 것은? [3.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $f(1)=1$
2. $f(\sqrt{x})=\log x$
3. $f(x)=2\log x$
4. $f(x+y)=f(x) \times f(y)$
5. $f(-x)=-f(x)$
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$f(x)=\log x^2$의 정의역은 $x\ne0$입니다. $x>0$일 때 $f(\sqrt x)=\log(\sqrt x)^2=\log x$이므로 ②는 참입니다.</p><p>① $f(1)=0$입니다. ③ $f(x)=2\log x$는 $x>0$에서만 성립합니다. ④ 로그는 곱셈 관계를 만족하지 않습니다. ⑤ $f(-x)=f(x)$이므로 홀함수가 아닙니다. 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(f(x)=\log(x^2)\)는 \(x\ne0\)에서 정의. \(f(\sqrt x)=\log x\)가 되는 것은 \(x>0\)에서만; 이 정의역 확인을 포함해 ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q05 — KEEP

- source ordinal/id: `5` / `5`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q05`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-05` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
크기가 $-530^\circ$인 각은 제몇 사분면의 각인가? [3.6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 제1사분면의 각
2. 제2사분면의 각
3. 제3사분면의 각
4. 제4사분면의 각
5. 존재하지 않음
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>일반각은 $360^\circ$의 정수배를 더해도 동경이 같습니다.</p><p>$-530^\circ+720^\circ=190^\circ$이고 $180^\circ<190^\circ<270^\circ$이므로 제3사분면입니다. 정답 <b>③</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(-530^\circ+720^\circ=190^\circ\)이므로 동경은 제3사분면, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q06 — KEEP

- source ordinal/id: `6` / `6`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q06`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-05` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 옳지 않은 것은? [3.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $-12^\circ = -\frac{\pi}{15}$
2. $\frac{3}{5}\pi = 108^\circ$
3. $\frac{30^\circ}{\pi} = \frac{1}{6}$
4. $-225^\circ = -\frac{5}{4}\pi$
5. $\frac{6}{5}\pi = 210^\circ$
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>라디안 변환 공식은 $180^\circ=\pi$입니다. ① $-12^\circ=-\pi/15$, ② $3\pi/5=108^\circ$, ③ $30^\circ/\pi=\frac{1}{6}$, ④ $-225^\circ=-5\pi/4$는 모두 옳습니다.</p><p>⑤ $6\pi/5=216^\circ$이지 $210^\circ$가 아닙니다. 정답 <b>⑤</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(6\pi/5\)라디안은 \(216^\circ\)이지 \(210^\circ\)가 아니므로 잘못된 설명 ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q07 — KEEP

- source ordinal/id: `7` / `7`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q07`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-01` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 중 옳은 것은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $a<0$일 때, $(\sqrt[4]{-a})^4 = a$이다.
2. $(-2)^2$의 제곱근은 $2$이다.
3. $\sqrt{256}$의 네제곱근 중 실수인 것은 $\pm 2$이다.
4. $n$이 홀수이고 $a<0$일 때, $x^n = a$를 만족시키는 실수 $x$의 값은 $n$개이다.
5. $n$이 짝수일 때, $-3$의 $n$제곱근 중 실수인 것은 $\sqrt[n]{-3}$이다.
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>① $a<0$이면 $-a>0$이고 $(\sqrt[4]{-a})^4=-a$이므로 거짓입니다. ② $(-2)^2=4$의 제곱근은 $\pm2$로 거짓입니다.</p><p>③ $\sqrt{256}=16$이고 $x^4=16$의 실근은 $\pm2$이므로 참입니다.</p><p>④ 음수의 홀수제곱근은 실수 한 개, ⑤ 음수의 짝수제곱근은 실수가 없으므로 거짓입니다. 정답 <b>③</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(\sqrt{256}=16\)의 실수 네제곱근은 \(x^4=16\Rightarrow x=\pm2\), 짝수근과 홀수근의 실근 수를 구분하여 ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q08 — KEEP

- source ordinal/id: `8` / `8`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q08`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-01` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$1$보다 큰 자연수 $n$과 음의 정수 $a$에 대하여 다음 <보기> 중 옳은 것의 개수는? [4.2점]

<보기>
ㄱ. $\sqrt[n]{(-a)^{2n}} = a^2$
ㄴ. $\sqrt[n]{(-a)^n} = a$
ㄷ. $\sqrt[2n]{(-a)^{2n}} = -a$
ㄹ. $\{\sqrt[n]{(-a)^2}\}^n = -a^2$
ㅁ. $(\sqrt[n]{-a})^n = a$ (단, $n$은 홀수)
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 0
2. 1
3. 2
4. 3
5. 4
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$a<0$이므로 $-a>0$입니다. ㄱ $\sqrt[n]{(-a)^{2n}}=(-a)^2=a^2$로 참입니다. ㄴ $\sqrt[n]{(-a)^n}=-a$이므로 거짓입니다.</p><p>ㄷ $\sqrt[2n]{(-a)^{2n}}=-a$로 참입니다. ㄹ 왼쪽은 $(-a)^2=a^2$이므로 $-a^2$가 아닙니다. ㅁ 왼쪽은 $-a$이므로 $a$가 아닙니다.</p><p>참은 ㄱ, ㄷ 두 개이므로 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 음수 \(a\)에 대한 \(n>1\)제곱근의 실수 존재성과 원시 조건에서 ㄱ·ㄷ만 성립, 참인 개수 2, ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q09 — KEEP

- source ordinal/id: `9` / `9`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q09`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-01` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$x = \frac{1}{2}(5^{\frac{1}{6}} + 5^{-\frac{1}{6}})$일 때, $(x+\sqrt{x^2-1})^6$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $\frac{1}{25}$
2. $\frac{1}{5}$
3. $\frac{1}{\sqrt{5}}$
4. 5
5. 25
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$t=5^{\frac{1}{6}}>1$이라 하면 $x=(t+t^{-1})/2$입니다. 따라서 $x^2-1=(t-t^{-1})^2/4$입니다.</p><p>$t>1$이므로 $\sqrt{x^2-1}=(t-t^{-1})/2$입니다. 두 식을 더하면 $x+\sqrt{x^2-1}=t$.</p><p>6제곱은 $t^6=5$로 정답 <b>④</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(x=(5^{1/6}+5^{-1/6})/2\)에서 \(x+\sqrt{x^2-1}=5^{1/6}\) (양수인 큰 근), 여섯제곱은 5, ④.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q10 — KEEP

- source ordinal/id: `10` / `10`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q10`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 보기의 함수의 그래프 중에서 함수 $y = \log_{\sqrt{2}} x$의 그래프를 평행이동 또는 대칭이동하여 겹쳐지는 것만을 모두 고른 것은? [4.1점]

<보기>
ㄱ. $y = \log_{\sqrt{2}}(2-3x)$
ㄴ. $y = \left(\frac{\sqrt{2}}{2}\right)^x$
ㄷ. $y = 2^{\frac{x}{2}-1} + 3$
ㄹ. $y = 2\log_{\sqrt{2}}(x-1)$
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. ㄱ, ㄴ
2. ㄴ, ㄷ
3. ㄷ, ㄹ
4. ㄱ, ㄴ, ㄷ
5. ㄱ, ㄷ, ㄹ
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>ㄱ $\log_{\sqrt2}(2-3x)=\log_{\sqrt2}3+\log_{\sqrt2}(\frac{2}{3}-x)$이므로 수평 반사·이동과 수직 이동으로 얻습니다.</p><p>ㄴ $(\sqrt2/2)^x$는 역함수 반사 $y=x$와 축 대칭을 통해, ㄷ $2^{\frac{x}{2}-1}+3=(\sqrt2)^{x-2}+3$는 역함수와 평행이동을 통해 얻습니다.</p><p>ㄹ $2\log_{\sqrt2}(x-1)$은 세로 확대가 필요하여 평행·대칭만으로는 얻지 못합니다. 정답은 ㄱ, ㄴ, ㄷ인 <b>④</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 로그곡선의 좌우 반사·평행이동으로 ㄱ, \(y=x\) 대칭으로 지수곡선 변환한 뒤 \(y\)축 대칭으로 ㄴ, 역함수 반사·평행이동으로 ㄷ 가능; ㄹ은 세로배율 2가 필요해 제외, ㄱ·ㄴ·ㄷ ④.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q10-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q11 — KEEP

- source ordinal/id: `11` / `11`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q11`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
함수 $y = \frac{x^{4-\log x}}{10}$는 $x=a$에서 최댓값 $b$를 가질 때, $\frac{b}{a}$의 값은? [4.2점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 10
2. 1
3. $\frac{3}{2}$
4. $\frac{1}{10}$
5. $\frac{3}{100}$
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$t=\log x$로 두면 $x=10^t$이고 $y=x^{4-t}/10=10^{t(4-t)-1}$입니다.</p><p>$t(4-t)-1=-(t-2)^2+3$이므로 최댓값은 $t=2$에서 $b=10^3=1000$입니다.</p><p>이때 $a=x=10^2=100$이므로 $\frac{b}{a}=10$. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=\log x\)로 바꾸어 \(\log y=t(4-t)-1\)의 정점 \(t=2\)에서 최대 \(a=10^2=100\), \(b=10^3=1000\), \(b/a=10\), ①.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q12 — KEEP

- source ordinal/id: `12` / `12`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q12`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
다음 그림과 같이 두 곡선 $y=\log_2 4(x+1)$, $y=\log_2(x-1)-1$과 두 직선 $3x+2y=4$, $3x+2y=14$로 둘러싸인 부분의 넓이는? [4.4점]<br><div class="exam-img-box"><img src="assets/images/23_순천고_1학기_중간_고2_수학I/q12-r3-source-recrop.png" class="exam-img"></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 8
2. 10
3. 12
4. 14
5. 16
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>두 곡선은 $y_1=\log_2(x+1)+2$, $y_2=\log_2(x-1)-1$입니다. 첫 곡선을 오른쪽 2, 아래로 3만큼 이동하면 둘째 곡선이 됩니다.</p><p>이동 벡터 $(2,-3)$은 $3x+2y=c$와 평행합니다. 두 직선 $3x+2y=4$와 $3x+2y=14$의 수직거리는 $10/\sqrt{13}$이고, 평행 이동 길이는 $\sqrt{13}$입니다.</p><p>두 곡선 사이에서 각 $3x+2y=c$의 절편을 연결하는 벡터가 항상 $(2,-3)$이므로, 경계선 사이의 거리를 따라 쓸어 만든 띠의 넓이는 이동 길이 $\sqrt{13}$와 두 평행선의 수직거리 $10/\sqrt{13}$의 곱입니다. 곡선 모양이 달라도 같은 이동 벡터이므로 면적이 보존됩니다. 따라서 넓이는 $\sqrt{13}\cdot10/\sqrt{13}=10$입니다. 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 실물 그래프에서 두 로그곡선의 이동량은 \((2,-3)\). 직선 \(3x+2y=4,14\)의 간격 \(10/\sqrt{13}\), 이동벡터 길이 \(\sqrt{13}\); 대응 평행사변형 넓이 10, ②.
- 그림 증거: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-r3-source-recrop.png` (시각 검토, blob `0abfdd8fa07286833833b717158b1418dc551b72`); 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q12-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q13 — KEEP

- source ordinal/id: `13` / `13`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q13`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-03` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
부등식 $x^{3x+2} > x^{x-2}$을 만족시키는 $x$의 값의 범위는? (단, $x>0$) [4.1점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. $x>0$
2. $0<x<1$
3. $x>1$
4. $0<x<2$
5. $x>2$
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$x>1$이면 밑이 1보다 크므로 지수를 비교합니다. $3x+2>x-2$는 $2x+4>0$이므로 항상 참입니다.</p><p>$0<x<1$에서는 지수부등호가 뒤집혀 $3x+2<x-2$이어야 하지만 $2x+4<0$은 불가능합니다. $x=1$에서는 양변이 같습니다.</p><p>따라서 해는 <b>$x>1$</b>, 정답 <b>③</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(x>1\)이면 밑 \(x>1\)과 지수 비교가 같은 방향이고 \(3x+2>x-2\). \(0<x<1\)이면 반대 방향이므로 불가능; \(x>1\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q14 — KEEP

- source ordinal/id: `14` / `14`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q14`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-05` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$9\cos^2\theta + \frac{1}{\cos^2\theta} = 6$일 때, $2\{(\sin\theta - \frac{1}{\sin\theta})^2 + (\cos\theta - \frac{1}{\cos\theta})^2\}$의 값은? [4.3점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 1
2. 3
3. 5
4. 7
5. 9
````

- 원본 `answer`: `②`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$c=\cos\theta\ne0$라 하면 $9c^2+1/c^2=6$에서 $(3c-\frac{1}{c})^2=0$이므로 $c^2=\frac{1}{3}$입니다.</p><p>따라서 $s^2=\sin^2\theta=\frac{2}{3}$입니다. $(s-\frac{1}{s})^2=s^2+1/s^2-2=\frac{2}{3}+\frac{3}{2}-2=\frac{1}{6}$입니다.</p><p>$(c-\frac{1}{c})^2=\frac{1}{3}+3-2=\frac{4}{3}$이므로 두 값의 합은 $\frac{3}{2}$, 두 배는 $3$. 정답 <b>②</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(9\cos^2\theta+1/\cos^2\theta=6\)을 \(\cos^2\theta=u\)의 이차방정식으로 풀어 \(u=1/3\), \(\sin^2=2/3\); 목표식 3, ②.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q15 — KEEP

- source ordinal/id: `15` / `15`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q15`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$\log_2(-|x|^2 + a|x| + 3)$의 값이 자연수가 되도록 하는 실수 $x$의 개수가 $6$일 때, 모든 자연수 $a$의 값의 합은? [5점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 7
2. 8
3. 9
4. 10
5. 11
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$t=|x|\ge0$으로 두면 로그의 진수는 $F(t)=-t^2+at+3$입니다. 로그값이 자연수라는 것은 $F(t)=2,4,8,\ldots$ 중 하나라는 뜻입니다.</p><p>$F(0)=3$이고 $F$는 아래로 열린 포물선입니다. $F(t)=2$는 양의 $t$해가 한 개이므로 $x=\pm t$ 두 개입니다. 전체 실수해가 6개가 되려면 $F(t)=4$가 양의 $t$해 두 개를 가져 네 개를 더하고, $F(t)=8$에는 해가 없어야 합니다.</p><p>따라서 $4<F_{\max}=3+a^2/4<8$, 즉 $2<a<\sqrt{20}$. 자연수 $a=3,4$이므로 합은 $7$. 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** \(t=|x|\ge0,\ F(t)=-t^2+at+3\). 로그가 자연수일 때 \(F=2,4,8,\ldots\); \(F(0)=3\)이므로 \(F=2\)는 실수 \(x\) 2개, \(F=4\)는 4개, \(F=8\)은 0개여야 전체 6개다. 따라서 \(4<F_{\max}=3+a^2/4<8\Rightarrow2<a<\sqrt{20}\), 자연수 \(a=3,4\), 합 7, ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q15-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q16 — KEEP

- source ordinal/id: `16` / `16`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q16`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-03` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
액체의 끓는 온도 $T(^\circ\mathrm{C})$와 증기압력 $P(\mathrm{mmHg})$ 사이에 $\log P = a + \frac{b}{c+T}$ ($a, b, c$는 상수이고 $T > -c$)인 관계가 성립한다. 표는 어떤 액체의 끓는 온도의 대한 증기압력을 나타낸 것이다.
(단, $\log 2 = 0.301$로 계산한다.)

[표]
| 끓는 온도($^\circ\mathrm{C}$) | 0 | 5 | 10 |
| 증기압력($\mathrm{mmHg}$) | 4.8 | 6.6 | 8.8 |

이 표를 이용할 때 다음 <보기> 중 옳은 것의 개수는? [5.1점]

<보기>
ㄱ. $0.602 < a + \frac{b}{c} < 0.699$
ㄴ. $b < 0$
ㄷ. $c > 0$
ㄹ. $P < 10^a$
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 0
2. 1
3. 2
4. 3
5. 4
````

- 원본 `answer`: `⑤`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$T=0$이 허용되므로 $c>0$입니다. 표에서 $T$가 증가할수록 $P$가 증가합니다. $c+T>0$이므로 $T$가 증가하면 $\frac{1}{(c+T)}$는 감소합니다. 그런데 $a+\frac{b}{(c+T)}$는 증가해야 하므로 $b<0$입니다. 미분 없이 단조성만 사용합니다.</p><p>ㄱ $T=0$에서 $a+\frac{b}{c}=\log4.8$입니다. $4<4.8<5$이고 $\log4=2\log2=0.602$, $\log5=1-\log2=0.699$이므로, 주어진 $\log2=0.301$만으로 $0.602<\log4.8<0.699$를 증명할 수 있습니다. ㄴ $b<0$ 참, ㄷ $c>0$ 참입니다.</p><p>ㄹ $\frac{b}{(c+T)}<0$이므로 $\log P<a$, 즉 $P<10^a$입니다. 네 문장이 모두 참이므로 <b>⑤</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 표에 \(T=0,5,10\)의 압력 4.8,6.6,8.8이 증가하므로 \(P=10^{a+b/(c+T)}\)에서 \(b<0\). 주어진 로그 범위와 \(10^a\) 한계를 적용하면 보기 네 진술이 모두 참, ⑤.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q17 — KEEP

- source ordinal/id: `17` / `17`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q17`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-03` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
어떤 양이 처음 값의 절반이 되는 데에 걸리는 시간을 반감기라 한다. 방사성 동위원소 ${}^{14}\mathrm{C}$의 반감기는 $5700$년이다. 어느 지층에서 발굴된 나무 조각의 ${}^{14}\mathrm{C}$의 양을 재어보니 남아 있는 양이 원래의 양의 $30\%$이었을 때, 이 지층이 몇 년 전의 지층인가? (단, $\log 2 = 0.3$, $\log 3 = 0.5$로 계산한다.) [4.7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 8500년
2. 9000년
3. 9500년
4. 10000년
5. 10500년
````

- 원본 `answer`: `③`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>반감기가 5700년이므로 $t$년 후 남는 비율은 $(\frac{1}{2})^{\frac{t}{5700}}$입니다.</p><p>남은 양이 30%이므로 $(\frac{1}{2})^{\frac{t}{5700}}=0.3$. 상용로그를 취하면 $(\frac{t}{5700})\log0.5=\log0.3$입니다.</p><p>$\log0.5=-0.3$, $\log0.3=\log3-1=0.5-1=-0.5$이므로 $\frac{t}{5700}=\frac{5}{3}$, $t=9500$년입니다. 정답 <b>③</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 방사성탄소 반감기 5700년, 잔량 30%는 \((1/2)^{t/5700}=0.3\). 주어진 상용로그 \(\log2=.3,\log3=.5\)로 \(t/5700=5/3\), \(t=9500\), ③.
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q18 — KEEP

- source ordinal/id: `18` / `18`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q18`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-04` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$a>1$인 실수 $a$에 대하여 곡선 $y=\log_a x$와 원 $C: (x-\frac{5}{3})^2 + y^2 = \frac{25}{9}$의 두 교점을 양 끝점으로 하는 선분이 원 $C$의 지름일 때, $a$의 값은? [4.8점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 3
2. $\frac{7}{2}$
3. 4
4. $\frac{9}{2}$
5. 5
````

- 원본 `answer`: `①`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>원 중심은 $(\frac{5}{3},0)$입니다. 지름 양 끝의 로그그래프 교점을 $P=(x_1,y_1)$, $Q=(x_2,y_2)$라 하면 $x_1+x_2=\frac{10}{3}$, $y_1+y_2=0$입니다.</p><p>로그의 합으로 $\log_a(x_1x_2)=0$이므로 $x_1x_2=1$. 따라서 $x_1,x_2$는 $t^2-(\frac{10}{3})t+1=0$의 근으로 $\frac{1}{3},3$입니다.</p><p>$x=3$에서 원의 방정식은 $(\frac{4}{3})^2+y^2=\frac{25}{9}$이므로 $y=1$ (증가 로그). $\log_a3=1$에서 $a=3$, 정답 <b>①</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 원 \(x^2+y^2=(10/3)x\)의 \(x\)축 교점은 \(0\)과 \(10/3\), 로그함수와 원의 두 교점 \(x_1x_2=1,\ x_1+x_2=10/3\)에서 \(x_1=1/3,x_2=3\); \(\log_a3=1\)로 \(a=3\), ①.
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q18-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q19 — KEEP

- source ordinal/id: `19` / `19`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q19`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `객관식` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-05` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
$5$ 이상의 자연수 $n$에 대하여 원 $(x-n)^2 + (y-n)^2 = 8$ 위의 점 $P_n$에서 원 $x^2+y^2=8$에 그은 접선의 접점을 $A$라 하자. $\sin(\angle AP_n O)$의 최댓값과 최솟값의 곱을 $f(n)$이라 할 때, $f(6)+f(8)+f(10)+\cdots+f(18) = \frac{q}{p}$이다. $p+q$의 값은? (단, $p, q$는 서로소인 두 자연수이다.) [4.9점]<br><div class="exam-img-box"><img src="assets/images/23_순천고_1학기_중간_고2_수학I/q19-r3-source-recrop.png" class="exam-img"></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
1. 53
2. 55
3. 57
4. 59
5. 61
````

- 원본 `answer`: `④`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$OA=\sqrt8=2\sqrt2$이고 접점 A에서 $OA\perp AP_n$입니다. 직각삼각형에서 $\sin\angle AP_nO=OA/OP_n$입니다.</p><p>$P_n$은 중심 $(n,n)$, 반지름 $2\sqrt2$인 원 위에 있으므로 $OP_n$의 최소·최대는 각각 $\sqrt2(n-2)$, $\sqrt2(n+2)$입니다.</p><p>따라서 $f(n)=\frac{2}{n-2}\cdot\frac{2}{n+2}=\frac4{n^2-4}=\frac1{n-2}-\frac1{n+2}$입니다.</p><p>짝수 $n=6,8,\ldots,18$을 합하면 중간 항이 소거되어 $\frac{1}{4}+\frac{1}{6}-\frac{1}{18}-\frac{1}{20}=\frac{14}{45}$입니다. 따라서 $p=45,q=14$, $p+q=59$. 정답 <b>④</b>.</p>
````

- **독립 판정·핵심 연결/검산:** 실물 원 그림에서 직각삼각형의 \(\sin\angle AP_nO=OA/OP_n\), \(OP_n\in[\sqrt2(n-2),\sqrt2(n+2)]\). 따라서 \(f(n)=4/(n^2-4)=1/(n-2)-1/(n+2)\); \(n=6,8,\ldots,18\) 망원합 \(14/45\), \(p+q=59\), ④.
- 그림 증거: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-r3-source-recrop.png` (시각 검토, blob `9d1845e0e61cdbb1ae298fedc3939c155c71248f`); 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q19-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q20 — KEEP

- source ordinal/id: `20` / `20`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q20`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-01` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
서답형 1. (서술형) $a>0, a \ne 1$인 실수 $a$에 대하여 $(\sqrt[5]{a^2})^2 = \sqrt[3]{a\sqrt{a^k}}$일 때, 유리수 $k$에 대하여 $10k$의 값을 구하는 풀이 과정과 답을 서술하시오. [부분 점수 있음, 6점] [6점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `28`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$a>0$, $a\ne1$이므로 지수법칙을 적용해도 됩니다. 왼쪽은 $(a^{\frac{2}{5}})^2=a^{\frac{4}{5}}$입니다.</p><p>오른쪽은 $\sqrt[3]{a\sqrt{a^k}}=(a\cdot a^{\frac{k}{2}})^{\frac{1}{3}}=a^{\frac{1}{3}+\frac{k}{6}}$입니다.</p><p>지수를 비교하면 $\frac{4}{5}=\frac{1}{3}+\frac{k}{6}$, 따라서 $\frac{k}{6}=\frac{7}{15}$, $k=\frac{14}{5}$입니다. $10k=\boxed{28}$입니다.</p>
````

- **독립 판정·핵심 연결/검산:** 같은 밑 \(a\)의 지수를 비교해 \(4/5=1/3+k/6\), \(k=14/5\)이므로 \(10k=28\).
- 그림 증거: 별도 문제 그림 없음
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q21`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-03` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
서답형 2. (서술형) 그림과 같이 함수 $y=3^{-x}$의 그래프 위의 점 $\mathrm{A}$에 대하여 점 $\mathrm{A}$에서 $x$축에 내린 수선의 발을 $\mathrm{B}$라 하자. 선분 $\mathrm{AB}$를 한 변으로 하고 $x$축 위의 점 $\mathrm{C}$의 $x$좌표가 점 $\mathrm{B}$의 $x$좌표보다 작도록 정사각형 $\mathrm{ABCD}$를 그린다. 직선 $\mathrm{CD}$와 함수 $y=3^{-x}$의 그래프가 만나는 점을 $\mathrm{E}$라 하고, 삼각형 $\mathrm{EDA}$의 넓이를 $S_1$, 정사각형 $\mathrm{ABCD}$의 넓이를 $S_2$라 하자. $2S_2 = 3S_1$일 때, 점 $\mathrm{A}$의 $x$좌표는 $\log_3(\log_a 3)$이다. $a$의 값을 구하는 풀이과정과 답을 서술하시오. [부분 점수 있음, 7점] [7점]<br><div class="exam-img-box"><img src="assets/images/23_순천고_1학기_중간_고2_수학I/q21.png" class="exam-img"></div>
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `$7/3$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$A=(t,h)$라 하면 $h=3^{-t}>0$입니다. 정사각형의 한 변은 $h$이므로 $B=(t,0)$, $C=(t-h,0)$, $D=(t-h,h)$입니다.</p><p>곡선과 $CD$의 교점 $E$의 높이는 $3^{-(t-h)}=h3^h$입니다. 따라서 $S_2=h^2$, $S_1=\frac12h(h3^h-h)=\frac12h^2(3^h-1)$입니다.</p>

A의 x좌표를 $t$라 두자. 원래 그림의 삼각형 $EDA$에서 $DA$가 밑변이고 $ED$가 높이이다.

| 그림 속 대상 | 결정 관계 |
| --- | --- |
| 정사각형 한 변 | $AB=AD=h=3^{-t}>0$ |
| 왼쪽의 세 점 | $x_C=x_D=x_E=t-h$ |
| 교점의 높이 | $y_E=3^{-(t-h)}=h\,3^h$ |
| 삼각형의 높이 | $ED=y_E-h=h(3^h-1)$ |
| 정사각형 넓이 | $S_2=h^2$ |
| 삼각형 넓이 | $S_1=\frac{1}{2}h\cdot ED=\frac{1}{2}h^2(3^h-1)$ |
| 주어진 넓이 조건 | $2S_2=3S_1$ |

<p>$2S_2=3S_1$에서 $2=\frac32(3^h-1)$, $3^h=\frac{7}{3}$, $h=\log_3(\frac{7}{3})$입니다.</p><p>$h=3^{-t}$이므로 $t=\log_3(\frac{1}{h})=\log_3(\log_{\frac{7}{3}}3)$입니다. 문제의 $t=\log_3(\log_a3)$와 비교하면 <b>$a=\frac{7}{3}$</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(A=(t,h),h=3^{-t}\)라 놓으면 정사각형 한 변 \(h\), 왼쪽 교점 높이 \(h3^h\). \(S_1=h^2(3^h-1)/2\), \(S_2=h^2\); \(2S_2=3S_1\Rightarrow3^h=7/3\)에서 \(t=\log_3(\log_{7/3}3)\), 따라서 \(a=7/3\). 실제 그림에서 E가 D의 위쪽임을 확인.
- 그림 증거: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q21.png` (시각 검토, blob `faab86cc70522ddefeb18f8531552566deb883de`)
- **UPGRADE 사유:** 계산/의도된 정답은 유지하되 학생 이해도, 원본 표기 혼용 또는 정의역 조건의 명시성을 보완할 필요가 있음. 초안은 아래에 완성하여 남김. 원본 정답키 미수정.

**학생용 교체 해설 초안**

**1. 점과 정사각형의 한 변을 둔다.** \(A=(t,h)\)라 쓰면 \(h=3^{-t}>0\). \(ABCD\)가 정사각형이므로 \(AB=BC=CD=DA=h\), \(B=(t,0)\), \(C=(t-h,0)\), \(D=(t-h,h)\).

**2. 점 \(E\)의 높이를 구한다.** \(E\)는 \(x=t-h\)에서 \(y=3^{-x}\) 위에 있으므로
\[
y_E=3^{-(t-h)}=3^{-t}\cdot3^h=h3^h.
\]
따라서 \(ED=y_E-h=h(3^h-1)\).

**3. 넓이 조건을 쓴다.** \(S_2=h^2\), \(S_1=\frac12\cdot DA\cdot ED=\frac12h^2(3^h-1)\). 따라서
\[
2h^2=\frac32h^2(3^h-1)\Rightarrow3^h=\frac73,\quad h=\log_3\frac73.
\]

**4. 요구된 로그 형태와 비교한다.** \(3^{-t}=h\Rightarrow t=\log_3(1/h)=\log_3(\log_{7/3}3)\). 원문의 \(t=\log_3(\log_a3)\)과 비교해 **\(a=\frac73\)**.

원본의 중복 설명과 HTML/Markdown 혼용을 정리한 학생용 단계형 해설이며, 실물 그림의 점 위치와 일치한다.


### Q22 — KEEP

- source ordinal/id: `22` / `22`; sourceIdentityKey: `23_순천고_1학기_중간_고2_수학I:q22`; 원본 blob `545a0258e842e0bf3964c4db1331fd59a7a992a3`
- 형식/배점: `서술형` / `NOT_PRESENT`; 문항 단원/과정: `H15-M1-05` / `NOT_PRESENT (파일명: 수학I)`
- **원문 문제·조건 (`content` 그대로):**

````text
서답형 3. (서술형) 원점 $\mathrm{O}$와 곡선 $y=\frac{7}{x}\,(x>0)$ 위의 점 $\mathrm{P}$에 대하여 동경 $\mathrm{OP}$가 나타내는 각의 크기를 $\theta$라고 할 때, $\sin\theta+\cos\theta$의 최댓값을 구하는 풀이 과정과 답을 서술하시오. [부분 점수 있음, 7점] [7점]
````

- **원문 보기 (`choices` 원래 순서):**

````text
(서답형: 별도 객관식 보기 없음)
````

- 원본 `answer`: `$\sqrt2$`
- **기존 `solution` 실제 발췌 (HTML/LaTeX 원형 유지):**

````text
<p>$P=(x,\frac{7}{x})$이고 $x>0$이므로 제1사분면에서 $\sin\theta,\cos\theta>0$입니다. $x=\sqrt7$이면 $P=(\sqrt7,\sqrt7)$이므로 $\theta=\pi/4$가 실제 가능합니다.</p><p>모든 각에 대해 $(\sin\theta+\cos\theta)^2\le2(\sin^2\theta+\cos^2\theta)=2$이므로 $\sin\theta+\cos\theta\le\sqrt2$입니다.</p><p>$\theta=\pi/4$에서 등호가 성립하므로 최댓값은 <b>$\sqrt2$</b>입니다.</p>
````

- **독립 판정·핵심 연결/검산:** \(P=(x,7/x)\), \(x>0\)이므로 점은 제1사분면. \(\sin\theta+\cos\theta\le\sqrt2\), 동등은 \(x=\sqrt7\)에서 성립하므로 최대 \(\sqrt2\).
- 그림 증거: 별도 문제 그림 없음; 보조 solutionImage: `archive/assets/images/23_순천고_1학기_중간_고2_수학I/q22-solution.svg` (존재 검증)
- **KEEP 사유:** 원문 해설·정답을 독립 검산한 결과 수치와 논리적 결론이 일치하며, 해당 문항의 조건·예외·끝점을 확인함. `READ_EVIDENCED` / 운영 QA `NOT_RUN`.

## 종료 검증 및 다음 단계

- 전수 범위: Q01–Q22; 총 22개, UNREAD 0. 각 문항의 원문/보기/정답/기존 해설과 독립 계산을 수록.
- 판정 합계: KEEP 20, UPGRADE 2, HOLD 0 (총 22).
- 학생용 개선 초안: Q03, Q21; 모두 본문 수록.
- 보류: NONE; 출고 전 원문·선지·해설·정답 합동 수정 필요.
- 실물 원본 그림 4개 판독, 보조 해설 그림 7개 원본 존재 확인. 최종 학생 화면/UI 렌더·통합 QA `NOT_RUN`.
- 본 문서는 worker branch 감사 기록이다. 실제 운영 자료로 출고·배포한 상태가 아니며, 잔여 HOLD는 다음 시험지 검토 진행을 막지 않는다.
