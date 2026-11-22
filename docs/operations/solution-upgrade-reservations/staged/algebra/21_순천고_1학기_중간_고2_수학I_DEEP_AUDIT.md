# 2021 21_순천고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2021`
- source: `archive/exams/original/high/h2/1mid/21_순천고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` (본문을 읽은 작업 브랜치)
- source blob SHA: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 원본 metadata: `standardCourse` 누락 0/21, `category` 누락 19/21, `questionType` 누락·공란 0/21; 누락값은 추정하지 않고 `NOT_PRESENT`로 표기
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/21_순천고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `21` · actual question/answer/solution read: `21` · KEEP 21 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS의 모든 `content`·`choices`·`answer`·`solution`을 전수 열람하고, 매 문항의 계산·끝점·부호·그림을 독립 확인함. UPGRADE는 **학생용 완성 해설 제안**으로만 기록했으며 원본 JS/정답키/이미지/`main`은 변경하지 않음.

## 기준·검증 경계

- 사용자 요청의 연속 작업 구간: 고2 대수(구 수학Ⅰ), 2021년 1학기 중간고사, 원본 시험지 5개 순차 처리 중 해당 학교.
- 적용 지침: `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md` (기존 작업 브랜치에서 확인한 원칙).
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`: 이 브랜치에서 조회 시 `NOT_FOUND`; 직전 2022년 lane30 심층 감사 산출물과 기존 규칙의 필드 구조를 준용함. `NOT_FOUND`를 통과 처리하지 않음.
- 문제에 연결된 원본 PNG 1개는 내려받아 실제 이미지로 시각 판독, SVG 6개는 Git blob/원본 XML 확인만 수행. SVG 최종 렌더·페이지 실제 미리보기·전체 preflight·Golden/Negative·운영 출고·SHA-256 별도 영수증은 `NOT_RUN`. 원본 이미지 육안 확인과 운영 QA는 다름.
- `KEEP`·`UPGRADE`는 문항별 수학/학생용 설명 감사 판정이며 최종 운영 검증 통과 선언이 아님.

## 문제·해설 이미지 실물 증거

- Q07 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q7-solution.svg` · blob `ab355fae1ff796eea5d989c25d41feece4c50cb2` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q08 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q8-solution.svg` · blob `80749cd3769c8fd73266c4358f6dc0d6e065532b` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q14 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q14-solution.svg` · blob `40aced366f244ea033bfcf9a2ee942146cd62b6e` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q16 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q16-solution.svg` · blob `d80b268dbf643be58b1a21d5f06768198512dcfd` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q17 문제 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q17.png` · blob `ec7b84bc729aae9f62a855babd43d30624c2f1ec` · PNG 원본 시각 판독 완료
- Q18 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q18-solution.svg` · blob `3aed0bae5926d7878e26822dfe99a590ab0e91f3` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q20 보조 해설 이미지 — `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q20-solution-v2.svg` · blob `5f5c7a561fbb369c921d7a5ca9d07ba3314a9656` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `NOT_PRESENT` / `1`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳은 것은? [3.4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $-\sqrt[4]{81}=\pm 3$
2. $\sqrt[5]{-32}=-2$
3. $-\sqrt[3]{-27}=-3$
4. $\sqrt[6]{64}=\pm 2$
5. $\sqrt{-16}=-4$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
짝수 제곱근은 양의 실수인 주값을 뜻하고, 홀수 제곱근은 음수도 가질 수 있습니다.
① $\sqrt[4]{81}=3$이므로 $-\sqrt[4]{81}=-3$입니다. $\pm3$이 아닙니다.
② $(-2)^5=-32$이므로 $\sqrt[5]{-32}=-2$입니다.
③ $\sqrt[3]{-27}=-3$이므로 $-\sqrt[3]{-27}=3$입니다.
④ $\sqrt[6]{64}=2$로 한 값이며 $\pm2$가 아닙니다.
⑤ $\sqrt{-16}$은 실수 범위에서 정의되지 않습니다.
따라서 옳은 것은 ②입니다.
````

- **독립 판정·핵심 연결/검산:** \(\sqrt[5]{-32}=-2\)는 홀수차 실근. 다른 명제들과 구분해 ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q02 — KEEP

- source ordinal/id: `NOT_PRESENT` / `2`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳지 않은 것은? [3.6점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\sqrt{-2}\times \sqrt{-3}=-\sqrt{6}$
2. $\sqrt[3]{\sqrt{5^6}}=5$
3. $\sqrt[3]{-4}\times \sqrt[3]{-2}=2$
4. $\sqrt{(-3)^{3\times 2}}=\{\sqrt{(-3)^3}\}^2$
5. $\sqrt[3]{8}\times \sqrt[3]{9}-\sqrt{\sqrt[3]{81}}=3^{\frac{2}{3}}$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
① $\sqrt{-2}\sqrt{-3}=(i\sqrt2)(i\sqrt3)=-\sqrt6$입니다(복소수 범위).
② $\sqrt{5^6}=5^3=125$, $\sqrt[3]{125}=5$입니다.
③ $\sqrt[3]{-4}\sqrt[3]{-2}=\sqrt[3]{8}=2$입니다.
④ 좌변은 $\sqrt{(-3)^6}=\sqrt{729}=27$입니다. 반면 우변은 $\bigl(\sqrt{(-3)^3}\bigr)^2=-27$로 복소수 범위에서도 다릅니다. 실수 범위라면 우변 자체가 정의되지 않습니다.
⑤ $\sqrt[3]{8}\sqrt[3]{9}-\sqrt{\sqrt[3]{81}}=2\cdot3^{2/3}-3^{2/3}=3^{2/3}$입니다.
따라서 옳지 않은 것은 ④입니다.
````

- **독립 판정·핵심 연결/검산:** ④의 좌변 \(\sqrt{(-3)^6}=27\), 우변 \((\sqrt{(-3)^3})^2=-27\) (복소수 허용 시)이므로 등식이 거짓. 실수 범위에서는 우변 자체가 정의되지 않음.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q03 — KEEP

- source ordinal/id: `NOT_PRESENT` / `3`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳지 않은 것은? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\log_5 125=3$
2. $\log_{\frac{1}{2}} 16=-4$
3. $\log_2 \frac{1}{64}=-6$
4. $\log_4 2\times \log_4 32=3$
5. $\log_6 3+\log_6 2=1$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
① $5^3=125$이므로 $\log_5 125=3$입니다.
② $(\tfrac12)^{-4}=16$이므로 $\log_{1/2}16=-4$입니다.
③ $2^{-6}=\tfrac1{64}$이므로 $\log_2\tfrac1{64}=-6$입니다.
④ $\log_4 2=\tfrac12$, $\log_4 32=\tfrac52$이므로 곱은 $\tfrac12\cdot\tfrac52=\tfrac54\ne3$입니다.
⑤ $\log_6 3+\log_6 2=\log_6(3\cdot2)=\log_6 6=1$입니다.
따라서 ④가 옳지 않습니다.
````

- **독립 판정·핵심 연결/검산:** \(\log_4 2=1/2\), \(\log_4 32=5/2\), 곱5/4이므로 3이란 선택지 ④는 거짓.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q04 — KEEP

- source ordinal/id: `NOT_PRESENT` / `4`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳은 설명만을 <보기>에서 있는 대로 고른 것은?

<보기>
ㄱ. 정의역이 $\{x|-2\le x\le -1\}$인 함수 $y=\left(\frac{1}{4}\right)^{x+1}+1$의 최댓값은 2이다.
ㄴ. 함수 $y=\log_a (x-2)+2\,(a>0, a\ne 1)$은 $a$의 값에 상관없이 항상 $(3, 2)$를 지난다.
ㄷ. 정의역이 $\{x|-9\le x\le 90\}$인 함수 $y=\log(x+10)-4$의 최솟값은 $-4$이다.
ㄹ. 함수 $y=\log x^2$의 그래프와 함수 $y=2\log x$의 그래프는 서로 같다. [4.4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. ㄱ, ㄴ
2. ㄴ, ㄷ
3. ㄷ, ㄹ
4. ㄱ, ㄹ
5. ㄴ, ㄷ, ㄹ
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
ㄱ. 밑 $\tfrac14$는 $0$과 $1$ 사이이므로 지수함수는 감소합니다. $-2\le x\le-1$에서 $x=-2$일 때 $y=(\tfrac14)^{-1}+1=5$로 최대입니다. 따라서 '최댓값 2'는 거짓입니다.
ㄴ. $x=3$이면 $x-2=1$이므로 $y=\log_a1+2=0+2=2$입니다. 밑의 조건을 만족하는 모든 $a$에 대해 참입니다.
ㄷ. $x+10$은 $1$부터 $100$까지이므로 $\log(x+10)$은 $0$ 이상입니다. $x=-9$에서 $y=\log1-4=-4$로 최소입니다.
ㄹ. $\log x^2$는 $x\ne0$에서 정의되지만 $2\log x$는 $x>0$에서만 정의됩니다. 정의역이 달라 두 그래프는 같지 않습니다.
참인 것은 ㄴ, ㄷ이므로 ②입니다.
````

- **독립 판정·핵심 연결/검산:** 공통 로그그래프의 특이점 \((3,2)\)·이동함수 최솟값 \(-4\)로 ㄴ·ㄷ만 참, ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q05 — KEEP

- source ordinal/id: `NOT_PRESENT` / `5`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
함수 $f$가 $f(x)=\log_2 x$일 때, 다음 중 항상 참인 것은? [4.3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $f(1)=1$
2. $f(x+y)=f(x)\times f(y)$
3. $f(xy)=f(x)+f(y)$
4. $f\left(\frac{1}{x}\right)=\frac{1}{f(x)}$ (단, $f(x)\ne 0$)
5. $f(x^n)=\{f(x)\}^n$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$f(x)=\log_2x$의 정의역은 $x>0$입니다.
① $f(1)=\log_2 1=0$이므로 거짓입니다.
② 로그에는 덧셈을 곱으로 바꾸는 법칙이 없습니다. 예를 들어 $x=y=2$이면 $f(4)=2$이지만 $f(2)f(2)=1$입니다.
③ $x,y>0$일 때 $f(xy)=\log_2(xy)=\log_2x+\log_2y=f(x)+f(y)$로 항상 참입니다.
④ $f(1/x)=-f(x)$이지 $1/f(x)$가 아닙니다.
⑤ $f(x^n)=n f(x)$이지 $f(x)^n$이 아닙니다(정의되는 범위).
따라서 ③입니다.
````

- **독립 판정·핵심 연결/검산:** 곱셈로그 공식 \(f(xy)=f(x)+f(y)\)가 양의 진수에서 성립, ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q06 — KEEP

- source ordinal/id: `NOT_PRESENT` / `6`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
물질의 산성 또는 염기성의 정도를 나타내는 $\mathrm{pH}$는 수소 이온 농도를 $[\mathrm{H}^+]$라고 할 때, $\mathrm{pH}=-\log[\mathrm{H}^+]$로 정의한다. 올해 한 도시의 빗물의 평균 $\mathrm{pH}$가 $4.7$이라고 하자. $10$년 후 이 도시의 빗물의 평균 수소 이온 농도가 올해 빗물의 평균 수소 이온 농도의 절반이라면 이때의 $\mathrm{pH}$는? (단, $\log 2=0.3$으로 계산한다.) [4.2점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 5.0
2. 5.2
3. 5.4
4. 5.6
5. 5.8
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
올해의 수소 이온 농도를 $H$라 하면 $4.7=-\log H$입니다.
10년 뒤 농도는 $H/2$이므로
$\mathrm{pH}_{10}=-\log(H/2)=-\log H+\log2$입니다.
$=4.7+0.3=5.0$입니다.
농도가 절반으로 감소하면 pH는 $0.3$만큼 증가하므로 ①입니다.
````

- **독립 판정·핵심 연결/검산:** 수소이온농도 반감이면 \(pH\) 변화량 \(-\log(1/2)=\log2=0.3\), 최종5.0, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q07 — KEEP

- source ordinal/id: `NOT_PRESENT` / `7`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 각이 나타내는 동경의 위치가 다른 것은? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $-690^\circ$
2. $750^\circ$
3. $330^\circ$
4. $\frac{13}{6}\pi$
5. $-\frac{11}{6}\pi$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
동경의 위치는 $360^\circ$의 정수배를 더하거나 빼도 같습니다.
① $-690^\circ+720^\circ=30^\circ$입니다.
② $750^\circ-720^\circ=30^\circ$입니다.
③ $330^\circ$는 그대로 $330^\circ$입니다.
④ $\frac{13\pi}{6}=390^\circ$, $390^\circ-360^\circ=30^\circ$입니다.
⑤ $-\frac{11\pi}{6}=-330^\circ$, $-330^\circ+360^\circ=30^\circ$입니다.
다른 위치는 ③입니다.
````

- **독립 판정·핵심 연결/검산:** 각도 동경을 360°로 환산해 330°만 나머지와 다름, ③.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q7-solution.svg` / `ab355fae1ff796eea5d989c25d41feece4c50cb2` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q08 — KEEP

- source ordinal/id: `NOT_PRESENT` / `8`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
$\sin\theta+\cos\theta=\frac{1}{2}$일 때, $\sin^3\theta-\cos^3\theta$의 값이 $\frac{a\sqrt{b}}{16}$이다. 정수 $a, b$에 대하여 $a+b$의 값은? (단, $\frac{3}{2}\pi < \theta < 2\pi$) [4.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 2
2. 4
3. 6
4. 8
5. 10
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$s=\sin\theta$, $c=\cos\theta$라 두면 $s+c=\tfrac12$입니다.
$(s+c)^2=s^2+c^2+2sc$에서 $\tfrac14=1+2sc$, 따라서 $sc=-\tfrac38$입니다.
$(s-c)^2=s^2+c^2-2sc=1+\tfrac34=\tfrac74$입니다.
$\frac{3\pi}{2}<\theta<2\pi$이므로 $s<0<c$이고 $s-c=-\tfrac{\sqrt7}{2}$입니다.
$s^3-c^3=(s-c)(s^2+sc+c^2)=(s-c)(1+sc)$
$=-\tfrac{\sqrt7}{2}(1-\tfrac38)=-\tfrac{5\sqrt7}{16}$입니다.
따라서 $a=-5$, $b=7$, $a+b=2$이므로 ①입니다.
````

- **독립 판정·핵심 연결/검산:** \((\sin+\cos)^2=1/4\)에서 \(sc=-3/8\), 제4사분면이므로 \(s-c=-\sqrt7/2\). \(s^3-c^3=-5\sqrt7/16\), 요구 \(a+b=2\), ①.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q8-solution.svg` / `80749cd3769c8fd73266c4358f6dc0d6e065532b` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q09 — KEEP

- source ordinal/id: `NOT_PRESENT` / `9`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
식 $\sin(\pi-\theta)\cos\left(\frac{3}{2}\pi-\theta\right)+\cos(\pi+\theta)\sin\left(\frac{1}{2}\pi-\theta\right)$를 간단히 한 것은? [4.2점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 2
2. 1
3. 0
4. -1
5. -2
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
삼각함수의 각 변환을 하나씩 적용합니다.
$\sin(\pi-\theta)=\sin\theta$,
$\cos(\tfrac{3\pi}{2}-\theta)=-\sin\theta$,
$\cos(\pi+\theta)=-\cos\theta$,
$\sin(\tfrac\pi2-\theta)=\cos\theta$입니다.
따라서 원래 식은
$\sin\theta(-\sin\theta)+(-\cos\theta)\cos\theta$
$=-\sin^2\theta-\cos^2\theta=-1$입니다.
정답은 ④입니다.
````

- **독립 판정·핵심 연결/검산:** 제시한 삼각비를 제곱합 항등식으로 묶으면 \(-\sin^2\theta-\cos^2\theta=-1\), ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q10 — KEEP

- source ordinal/id: `NOT_PRESENT` / `10`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
$0\le x < 2\pi$일 때, 방정식 $\sin 2x = \frac{3}{4}$의 모든 실근의 합은? [4.3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\pi$
2. $2\pi$
3. $3\pi$
4. $4\pi$
5. $5\pi$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$t=2x$라 두면 $0\le t<4\pi$이고 $\sin t=\tfrac34$입니다.
$0<\alpha<\tfrac\pi2$, $\sin\alpha=\tfrac34$라 하면 한 주기의 해는 $t=\alpha,\pi-\alpha$입니다.
두 주기에 걸친 네 해는 $\alpha,\pi-\alpha,2\pi+\alpha,3\pi-\alpha$입니다.
$t$의 합은 $6\pi$이므로 $x$의 합은 $\tfrac{6\pi}{2}=3\pi$입니다.
정답은 ③입니다.
````

- **독립 판정·핵심 연결/검산:** \(\sin2x=3/4\)는 \(0\le2x<4\pi\)에서 네 근, 대응 \(x\)의 합 \(3\pi\), ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q11 — KEEP

- source ordinal/id: `NOT_PRESENT` / `11`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
$x>a$일 때, $\sqrt[n]{x^m}=x^{\frac{m}{n}}$이 성립한다. 실수 $a$의 값으로 적절하지 않은 것은? (단, $m$은 정수, $n$은 $n\ge 2$인 정수) [4.1점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. -1
2. 0
3. 1
4. 2
5. 3
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\sqrt[n]{x^m}=x^{m/n}$을 모든 정수 $m$과 $n\ge2$에 대해 실수로 정의하려면 $x>0$이어야 합니다.
$x>0$에서는 실수 지수의 성질에 따라 두 식이 같습니다.
$a=0$이면 $x>a$가 바로 $x>0$이므로 성립하고, $a=1,2,3$도 성립합니다.
그러나 $a=-1$이면 $x=-\tfrac12$도 $x>a$를 만족합니다. 이때 $m=1,n=2$를 택하면 $\sqrt{x}$는 실수가 아닙니다.
따라서 적절하지 않은 것은 ①입니다.
````

- **독립 판정·핵심 연결/검산:** \(a=-1\)에서는 \(m=1,n=2\)인 경우 음수의 짝수근이 실수 정의 불가. 나머지 선택지 조건 성립, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q12 — KEEP

- source ordinal/id: `NOT_PRESENT` / `12`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
로그방정식 $\log_4(2x^2-8)=\log_2(x+a)$가 오직 하나의 실근을 갖기 위한 실수 $a$의 값의 범위는? [4.9점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $a < -2$
2. $a > 2$
3. $-2 \le a < 2$
4. $-2 < a < 2$
5. $-2 < a \le 2$
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
로그의 진수 조건은 $2x^2-8>0$, $x+a>0$입니다.
$\log_4(2x^2-8)=\log_2(x+a)$에서
$\tfrac12\log_2(2x^2-8)=\log_2(x+a)$이므로
$\sqrt{2x^2-8}=x+a$입니다.
양변을 제곱하면 $2x^2-8=(x+a)^2$, 즉 $x^2-2ax-a^2-8=0$입니다.
따라서 후보는 $x=a\pm\sqrt{2a^2+8}$입니다.
$+$ 후보의 $x+a=2a+\sqrt{2a^2+8}>0$ 조건은 $a>-2$일 때 성립합니다.
$-$ 후보의 $x+a=2a-\sqrt{2a^2+8}>0$ 조건은 $a>2$일 때만 성립합니다.
$a=-2$ 또는 $a=2$의 경계에서 해당 후보는 $x+a=0$이므로 제외합니다.
따라서 실근이 정확히 하나인 범위는 $-2<a\le2$이고, 정답은 ⑤입니다.
````

- **독립 판정·핵심 연결/검산:** 로그진수 \(2x^2-8>0,x+a>0\)를 유지한 후보 \(x=a\pm\sqrt{2a^2+8}\): 양의 가지 \(a>-2\), 음의 가지 \(a>2\). 정확히 하나는 \(-2<a\le2\), ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q13 — KEEP

- source ordinal/id: `NOT_PRESENT` / `13`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
$a$는 $12$의 거듭제곱이고, $b$는 $36$의 거듭제곱근 중 양의 실수이다. $ab^2=64c$를 만족시키는 자연수 $c$가 $3$의 $n$제곱일 때, 자연수 $n$의 값은? [4.7점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 2
2. 3
3. 4
4. 5
5. 6
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
거듭제곱의 지수를 자연수 $r$이라 두어 $a=12^r$로 나타냅니다. $b$는 $36$의 양의 거듭제곱근이므로 어떤 자연수 $s\ge2$에 대하여 $b=\sqrt[s]{36}=36^{1/s}$입니다. 또한 $c=3^n$입니다.
$12=2^2\cdot3$, $36=2^2\cdot3^2$, $64=2^6$이므로
$ab^2=(12^r)(36^{1/s})^2=2^{2r}3^r\cdot2^{4/s}3^{4/s}=2^{2r+4/s}3^{r+4/s}=2^6\cdot3^n$입니다.
양변을 알맞게 거듭제곱하여 소인수분해를 비교하면 $2r+\frac4s=6$, $r+\frac4s=n$을 얻습니다.
첫째 식에서 $2rs+4=6s$, 즉 $(3-r)s=2$입니다. $r$은 자연수이고 $s\ge2$이므로 $3-r=1$, $s=2$, $r=2$입니다.
따라서 $n=r+\frac4s=2+\frac42=4$이므로 정답은 ③입니다.
````

- **독립 판정·핵심 연결/검산:** 양의 밑 소인수 지수 일치로 \(r=2,s=2,n=4\), ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q14 — KEEP

- source ordinal/id: `NOT_PRESENT` / `14`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
좌표평면 위의 곡선 $y=2^x-3$과 함수 $y=-\log(x-3)+1$의 점근선 그리고 $x$축으로 둘러싸인 영역(경계포함)에 속하는 점 중 $x$좌표와 $y$좌표가 모두 정수인 점의 개수는? [4.6점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 7
2. 8
3. 9
4. 10
5. 11
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$y=2^x-3$은 $x=\log_2 3$에서 $x$축과 만납니다.
$y=-\log(x-3)+1$의 수직점근선은 $x=3$입니다. 이 점근선과 $x$축, 곡선 $y=2^x-3$이 만드는 닫힌 영역을 셉니다.
$\log_2 3\approx1.585$이므로 정수 $x$는 $2$ 또는 $3$입니다.
$x=2$일 때 $0\le y\le2^2-3=1$이므로 정수 $y=0,1$의 2개입니다.
$x=3$일 때 $0\le y\le2^3-3=5$이므로 정수 $y=0,1,2,3,4,5$의 6개입니다.
합하면 $2+6=8$개이므로 ②입니다.
````

- **독립 판정·핵심 연결/검산:** 지수곡선 \(y=2^x-3\), 직선 \(x=3\), \(x\)축으로 닫힌 영역의 정수 가로좌표는 \(x=2,3\). \(x=2\)에서는 높이0·1의 2점, \(x=3\)에서는 높이0부터5의 6점, 합8, ②.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q14-solution.svg` / `40aced366f244ea033bfcf9a2ee942146cd62b6e` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q15 — KEEP

- source ordinal/id: `NOT_PRESENT` / `15`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
방정식 $9^x-2\times 3^{x+1}+k+10=0$이 서로 다른 두 실근을 갖도록 하는 정수 $k$의 개수는? [4.7점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 8
2. 9
3. 10
4. 11
5. 12
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$t=3^x$로 놓으면 실수 $x$에 대해 $t>0$이고, $9^x=t^2$, $2\times3^{x+1}=6t$입니다.
$t^2-6t+k+10=0$, 즉 $(t-3)^2=-k-1$이므로
$t=3\pm\sqrt{-k-1}$입니다.
서로 다른 두 실근 $x$가 있으려면 서로 다른 두 양의 $t$가 있어야 합니다.
따라서 $0<\sqrt{-k-1}<3$이고, 이를 제곱하면 $0<-k-1<9$입니다.
즉 $-10<k<-1$이므로 정수 $k$는 $-9,-8,-7,-6,-5,-4,-3,-2$의 8개입니다. 정답은 ①입니다.
````

- **독립 판정·핵심 연결/검산:** \(t=3^x>0\)에서 \((t-3)^2=-k-1\). 서로 다른 양근 조건 \(-10<k<-1\), 정수8개, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q16 — KEEP

- source ordinal/id: `NOT_PRESENT` / `16`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
둘레의 길이가 $10$인 부채꼴 중에서 그 넓이가 최대인 것의 중심각의 크기는? [3.4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{1}{2}$
2. 1
3. $\frac{3}{2}$
4. 2
5. $\frac{5}{2}$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
부채꼴의 반지름을 $r>0$, 중심각을 $\theta$라디안이라 하면 호의 길이는 $r\theta$입니다.
둘레가 $10$이므로 $2r+r\theta=10$, 따라서 $\theta=\tfrac{10}{r}-2$입니다.
넓이 $S=\tfrac12r^2\theta=\tfrac12r^2(\tfrac{10}{r}-2)=5r-r^2$입니다.
완전제곱식을 만들면 $S=-(r-\tfrac52)^2+\tfrac{25}{4}$이므로 $r=\tfrac52$일 때 최대입니다.
이때 $\theta=\tfrac{10}{5/2}-2=4-2=2$라디안입니다.
정답은 ④입니다.
````

- **독립 판정·핵심 연결/검산:** 부채꼴 둘레 \(2r+r\theta=10\); 넓이 \(\frac12r(10-2r)=5r-r^2\)는 \(r=5/2\)에서 최대, ④.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q16-solution.svg` / `d80b268dbf643be58b1a21d5f06768198512dcfd` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q17 — KEEP

- source ordinal/id: `NOT_PRESENT` / `17`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
다음 그림은 함수 $f(x)=a\cos bx+c$의 그래프이다. $a>0$일 때, $ac+b$의 최솟값은?

<div class="exam-img-box"><img src="assets/images/21_순천고_1학기_중간_고2_수학I/q17.png" class="exam-img"></div> [4.3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{22}{3}$
2. $\frac{23}{3}$
3. 8
4. $\frac{25}{3}$
5. $\frac{26}{3}$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
원본 그래프에서 최댓값은 $6$, 최솟값은 $2$입니다.
$a>0$이므로 진폭 $a=\tfrac{6-2}{2}=2$, 중심선 $c=\tfrac{6+2}{2}=4$입니다.
최대점 $x=0$에서 다음 최대점 $x=6\pi$까지가 한 주기이므로 $T=6\pi$입니다.
$T=\tfrac{2\pi}{|b|}$에서 $|b|=\tfrac13$이고 $b=\pm\tfrac13$입니다.
$ac+b=2\cdot4+b=8+b$이므로 작은 값을 주는 $b=-\tfrac13$을 택합니다.
최솟값은 $8-\tfrac13=\tfrac{23}{3}$이므로 ②입니다.
````

- **독립 판정·핵심 연결/검산:** 그래프 최대6·최소2 ⇒ 진폭 \(a=2\), 중심선 \(c=4\), 극대 사이 주기 \(6\pi\) ⇒ \(|b|=1/3\). \(ac+b\) 최솟값은 \(b=-1/3\)을 택한 \(23/3\), ②.
- 그림/보조 해설 증거: 문제 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q17.png` / `ec7b84bc729aae9f62a855babd43d30624c2f1ec` / PNG 원본 시각 판독 완료
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q18 — KEEP

- source ordinal/id: `NOT_PRESENT` / `18`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
좌표평면 위에 중심이 원점 $\mathrm{O}$이고 반지름의 길이가 $2$인 원이 있다. 각 $\theta$가 나타내는 동경과 원이 만나는 점의 좌표를 $\mathrm{A}(a, b)$라 하자.
$\tan\left(\frac{3}{2}\pi+\theta\right)=\frac{3}{4},\ \cos(-\theta)>0$
일 때, $a-b$의 값은? [4.6점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $-\frac{2}{5}$
2. $\frac{2}{5}$
3. $\frac{6}{5}$
4. 2
5. $\frac{14}{5}$
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\tan(\tfrac{3\pi}{2}+\theta)=\tan(\tfrac\pi2+\theta)=-\cot\theta=\tfrac34$입니다.
따라서 $\tan\theta=-\tfrac43$입니다.
$\cos(-\theta)=\cos\theta>0$이고 탄젠트가 음수이므로 $\theta$의 동경은 제4사분면입니다.
$3:4:5$ 직각삼각형 비로 $\cos\theta=\tfrac35$, $\sin\theta=-\tfrac45$입니다.
반지름이 $2$이므로 $a=2\cos\theta=\tfrac65$, $b=2\sin\theta=-\tfrac85$입니다.
$a-b=\tfrac65-(-\tfrac85)=\tfrac{14}{5}$이므로 ⑤입니다.
````

- **독립 판정·핵심 연결/검산:** \(\tan(3\pi/2+\theta)=3/4\Rightarrow\tan\theta=-4/3\), \(\cos>0\)에서 \((\cos,\sin)=(3/5,-4/5)\); 요구 \(a-b=14/5\), ⑤.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q18-solution.svg` / `3aed0bae5926d7878e26822dfe99a590ab0e91f3` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q19 — KEEP

- source ordinal/id: `NOT_PRESENT` / `19`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
보기에서 임의의 실수 $x$에 대하여
$f(x)=f(-x),\ f(2+x)=f(2-x)$
를 만족시키는 함수만을 있는 대로 고른 것은?

<보기>
ㄱ. $f(x)=-\cos\left(\frac{\pi}{2}x-\frac{\pi}{2}\right)$
ㄴ. $f(x)=2\sin\left(\pi x+\frac{3\pi}{2}\right)$
ㄷ. $f(x)=\left|3\tan\left(\pi x-\frac{1}{2}\pi\right)\right|$ [4.8점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. ㄱ
2. ㄴ
3. ㄷ
4. ㄱ, ㄴ
5. ㄴ, ㄷ
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
조건은 임의의 실수 $x$에 대하여 두 등식이 성립해야 한다는 뜻이다. 먼저 $f(x)=f(-x)$는 짝함수 조건이고, $f(2+x)=f(2-x)$는 직선 $x=2$에 대한 대칭 조건이다.

ㄱ. $f(x)=-\cos\left(\frac{\pi}{2}x-\frac{\pi}{2}\right)=-\sin\frac{\pi x}{2}$이다.
$f(-x)=\sin\frac{\pi x}{2}$이므로 일반적으로 $f(-x)\ne f(x)$이다. 따라서 ㄱ은 아니다.

ㄴ. $f(x)=2\sin\left(\pi x+\frac{3\pi}{2}\right)=-2\cos\pi x$이다.
$f(-x)=-2\cos(-\pi x)=-2\cos\pi x=f(x)$이다.
또한 $f(2+x)=-2\cos(2\pi+\pi x)=-2\cos\pi x$,
$f(2-x)=-2\cos(2\pi-\pi x)=-2\cos\pi x$이므로 두 조건을 모두 만족한다.

ㄷ. $f(x)=\left|3\tan\left(\pi x-\frac{\pi}{2}\right)\right|$는 $x$가 정수이면 탄젠트가 정의되지 않는다. 따라서 임의의 실수 $x$ 전체에 대해 값을 갖는 함수로서 주어진 조건을 만족한다고 할 수 없다.

그러므로 ㄴ만 옳아 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 두 대칭축 \(x=0,2\)와 함수값·진폭을 대조하면 \(-2\cos\pi x\)만 조건 만족, ㄴ, ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q20 — KEEP

- source ordinal/id: `NOT_PRESENT` / `20`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `서술형` / `NOT_PRESENT`; 원본 단원/과정: `삼각함수의 그래프` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
<서술형 1>
함수 $y=2\cos\left(\frac{1}{2}x-\pi\right)+1$에 대한 다음 물음에 답하시오. 주기를 계산하시오. 주어진 함수의 평행이동을 설명하시오. 치역을 조건제시법으로 나타내시오. 주어진 함수의 그래프를 그리시오. [10.0점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `주기 $4\pi$, 오른쪽 $2\pi$ 평행이동·위로 $1$ 평행이동, 치역 $\{y\mid-1\le y\le3\}$`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
주어진 함수는 $y=2\cos(\tfrac12x-\pi)+1=2\cos\bigl(\tfrac12(x-2\pi)\bigr)+1$입니다.
(1) 코사인 함수 $y=\cos t$의 주기는 $2\pi$이고, $x$의 계수가 $\tfrac12$이므로 주기는 $T=\tfrac{2\pi}{1/2}=4\pi$입니다.
(2) $y=2\cos(\tfrac12x)$의 그래프를 $x$축 방향으로 $2\pi$만큼 오른쪽으로, $y$축 방향으로 $1$만큼 위로 평행이동한 그래프입니다.
(3) $-1\le\cos t\le1$이므로 $-2\le2\cos t\le2$, 양변에 $1$을 더해 $-1\le y\le3$입니다. 따라서 치역은 $\{y\mid-1\le y\le3\}$입니다.
(4) $y=-2\cos(\tfrac x2)+1$로도 쓸 수 있으므로 $x=0,\pi,2\pi,3\pi,4\pi$에서 $y=-1,1,3,1,-1$입니다. 이 다섯 점을 매끄러운 코사인 곡선으로 잇고 $4\pi$마다 반복합니다.
````

- **독립 판정·핵심 연결/검산:** \(y=2\cos(x/2-\pi)+1\)의 주기4π, 오른쪽 평행이동2π, 위로1, 치역[−1,3]; \(0,\pi,2\pi,3\pi\)에서 높이 −1,1,3,1.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_순천고_1학기_중간_고2_수학I/q20-solution-v2.svg` / `5f5c7a561fbb369c921d7a5ca9d07ba3314a9656` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q21 — KEEP

- source ordinal/id: `NOT_PRESENT` / `21`; `questionUid`: `NOT_PRESENT`; source blob: `ba930e03e654cb1ac73dbdaaf10b87cde8ed32bf`
- 형식/배점: `서술형` / `NOT_PRESENT`; 원본 단원/과정: `로그의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
<서술형 2> 로그의 정의와 지수법칙을 이용하여 다음 (1)~(4)를 보이시오. (단, $a>0$, $a\ne1$, $M>0$, $N>0$)
(1) $\log_a1=0$임을 보이시오.
(2) $\log_a a=1$임을 보이시오.
(3) $\log_a\frac{M}{N}=\log_aM-\log_aN$임을 보이시오.
(4) 로그의 밑의 변환을 이용하여 $\log_{a^m}b^n=\frac{n}{m}\log_ab$임을 보이시오. (단, $a>0$, $a\ne1$, $b>0$, $b\ne1$, $m\ne0$이고 $m,n$은 실수) [10.0점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `① $0$, ② $1$, ③ $\log_a(M/N)=\log_aM-\log_aN$, ④ $\log_{a^m}b^n=\frac nm\log_ab$ ($m\ne0$)`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
(1) 로그의 정의에서 $a^t=1$인 지수 $t$를 찾습니다. $a^0=1$이므로 $\log_a1=0$입니다.
(2) $a^1=a$이므로 로그의 정의에 따라 $\log_a a=1$입니다.
(3) $u=\log_aM$, $v=\log_aN$이라 두면 $M=a^u$, $N=a^v$입니다.
$\frac{M}{N}=\frac{a^u}{a^v}=a^{u-v}$이므로 $\log_a\frac{M}{N}=u-v=\log_aM-\log_aN$입니다.
(4) $m\ne0$이므로 $a^m>0$이고 $a^m\ne1$이어서 밑 $a^m$의 로그가 정의됩니다.
밑의 변환 공식을 적용하면
$\log_{a^m}b^n=\frac{\log_a b^n}{\log_a a^m}=\frac{n\log_a b}{m}=\frac nm\log_a b$입니다.
따라서 (1)~(4)의 등식이 주어진 조건에서 모두 성립합니다.
````

- **독립 판정·핵심 연결/검산:** \(a^0=1,a^1=a\), 로그의 곱셈·나눗셈법칙, 밑변환 공식을 각 진수 양수와 \(m\ne0\) 조건 아래에서 단계별 확인.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


## 종합 인계

- 시험지 범위: 21/21 문항 전수, 정답키/풀이 수치의 독립 검산 기록 21건.
- 판정: KEEP 21, UPGRADE 0, HOLD 0, UNREAD 0.
- **해설 보완 제안:** 없음; UPGRADE 문항은 본문에 최종 학생용 교정안을 포함함.
- 문항 원본·정답키·그림 파일 수정/배포: `NOT_DONE`; 이 MD는 감사 기록 겸 제안안.
- 원격 readback 완료 후에도 운영/자동화 검증 상태는 `QA_NOT_RUN`으로 유지.
