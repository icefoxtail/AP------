# 2021 21_매산고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2021`
- source: `archive/exams/original/high/h2/1mid/21_매산고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` (본문을 읽은 작업 브랜치)
- source blob SHA: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 원본 metadata: `standardCourse` 누락 20/20, `category` 누락 20/20, `questionType` 누락·공란 0/20; 누락값은 추정하지 않고 `NOT_PRESENT`로 표기
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/21_매산고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `20` · actual question/answer/solution read: `20` · KEEP 20 · UPGRADE 0 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS의 모든 `content`·`choices`·`answer`·`solution`을 전수 열람하고, 매 문항의 계산·끝점·부호·그림을 독립 확인함. UPGRADE는 **학생용 완성 해설 제안**으로만 기록했으며 원본 JS/정답키/이미지/`main`은 변경하지 않음.

## 기준·검증 경계

- 사용자 요청의 연속 작업 구간: 고2 대수(구 수학Ⅰ), 2021년 1학기 중간고사, 원본 시험지 5개 순차 처리 중 해당 학교.
- 적용 지침: `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md` (기존 작업 브랜치에서 확인한 원칙).
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`: 이 브랜치에서 조회 시 `NOT_FOUND`; 직전 2022년 lane30 심층 감사 산출물과 기존 규칙의 필드 구조를 준용함. `NOT_FOUND`를 통과 처리하지 않음.
- 문제에 연결된 원본 PNG 0개는 내려받아 실제 이미지로 시각 판독, SVG 0개는 Git blob/원본 XML 확인만 수행. SVG 최종 렌더·페이지 실제 미리보기·전체 preflight·Golden/Negative·운영 출고·SHA-256 별도 영수증은 `NOT_RUN`. 원본 이미지 육안 확인과 운영 QA는 다름.
- `KEEP`·`UPGRADE`는 문항별 수학/학생용 설명 감사 판정이며 최종 운영 검증 통과 선언이 아님.

## 문제·해설 이미지 실물 증거

- 원문에 연결된 개별 문제/해설 그림 없음

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `NOT_PRESENT` / `1`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
방정식 $2^{x+2} = 64$의 해를 구하면? [3.9점]
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
$64=2^6$이므로 $2^{x+2}=2^6$이다.
밑이 같은 지수방정식이므로 지수를 같게 놓으면 $x+2=6$, 따라서 $x=4$이다.
정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(2^x=16\)의 지수 비교로 \(x=4\).
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q02 — KEEP

- source ordinal/id: `NOT_PRESENT` / `2`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
$\log_3 81 - \dfrac{3}{2}\log_2 16$의 값은? [3.9점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. -2
2. 0
3. 1
4. \dfrac{3}{2}
5. 2
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$81=3^4$, $16=2^4$이므로 $\log_3 81=4$, $\log_2 16=4$이다.
따라서 $\log_3 81-\dfrac32\log_2 16=4-\dfrac32\cdot4=4-6=-2$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 양의 밑 로그·음의 지수 법칙을 정리한 값은 \(-2\).
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q03 — KEEP

- source ordinal/id: `NOT_PRESENT` / `3`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳지 않은 것을 구하면? [4.0점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\dfrac{\pi}{2} = 90^\circ$
2. $\dfrac{3}{4}\pi = 135^\circ$
3. $\dfrac{5}{6}\pi = 250^\circ$
4. $\dfrac{4}{3}\pi = 240^\circ$
5. $\dfrac{2}{5}\pi = 72^\circ$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
라디안의 크기에 $\dfrac{180^\circ}{\pi}$를 곱해 도의 크기로 바꾸면
$\dfrac\pi2=90^\circ$, $\dfrac34\pi=135^\circ$, $\dfrac56\pi=150^\circ$,
$\dfrac43\pi=240^\circ$, $\dfrac25\pi=72^\circ$이다.
따라서 $\dfrac56\pi=250^\circ$라는 ③이 옳지 않다.
````

- **독립 판정·핵심 연결/검산:** \(5\pi/6=150^\circ\)이므로 250°로 읽은 ③이 거짓.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q04 — KEEP

- source ordinal/id: `NOT_PRESENT` / `4`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
반지름의 길이가 $4$이고 중심각의 크기가 $\dfrac{\pi}{6}$인 부채꼴의 호의 길이를 $a$, 넓이를 $b$라고 할 때 $a+b$의 값을 구하면? [4.1점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. \dfrac{2}{3}\pi
2. \pi
3. \dfrac{4}{3}\pi
4. \dfrac{5}{3}\pi
5. 2\pi
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
중심각 $\theta=\dfrac\pi6$는 라디안으로 주어졌으므로 호의 길이는 $r\theta$이다.
$a=4\cdot\dfrac\pi6=\dfrac23\pi$이다.
부채꼴의 넓이는 $\dfrac12r^2\theta$이므로 $b=\dfrac12\cdot4^2\cdot\dfrac\pi6=\dfrac43\pi$이다.
따라서 $a+b=\dfrac23\pi+\dfrac43\pi=2\pi$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 호의 길이 \(2\pi/3\), 부채꼴 넓이 \(4\pi/3\), 합 \(2\pi\), ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q05 — KEEP

- source ordinal/id: `NOT_PRESENT` / `5`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
다음 중 옳은 것을 구하면? [4.1점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $25$의 네제곱근은 $\pm\sqrt{5}$이다.
2. $64$의 세제곱근은 $4$뿐이다.
3. $\sqrt[3]{-8} = -\sqrt[4]{(-4)^2}$이다.
4. $-27$의 세제곱근은 $1$개이다.
5. $n$이 짝수일 때, $-4$의 $n$제곱근 중에서 실수인 것은 $1$개이다.
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
‘25의 네제곱근’처럼 ‘a의 n제곱근’이라고 하면 해당 거듭제곱방정식을 만족하는 모든 복소수 해를 말한다. 반면 근호 기호는 정해진 한 값을 나타낸다.
① $z^4=25$를 풀면 $(z^2-5)(z^2+5)=0$이다. 따라서 $z=\pm\sqrt5$뿐 아니라 $z=\pm i\sqrt5$도 해이다. 그러므로 ①은 옳지 않다.
② $z^3=64$에서
$z^3-64=(z-4)(z^2+4z+16)=0$이다. 첫째 인수에서 $z=4$이고, 둘째 인수의 해는 $z=-2\pm2\sqrt3 i$이다. 세제곱근은 4뿐이 아니므로 ②도 옳지 않다.
③ 근호 기호로 나타낸 실수값은 $\sqrt[3]{-8}=-2$이고, $\sqrt[4]{(-4)^2}=\sqrt[4]{16}=2$이다. 따라서 오른쪽도 $-2$이므로 등식은 참이다.
④ $z^3=-27$에서
$z^3+27=(z+3)(z^2-3z+9)=0$이다. 해는 $z=-3$과 $z=\dfrac{3\pm3\sqrt3 i}{2}$로 세 개이므로 ④는 옳지 않다.
⑤ $n$이 짝수이고 $x$가 실수이면 $x^n\ge0$이다. 따라서 $x^n=-4$를 만족하는 실수는 없고, 실수인 근은 0개이다. ⑤도 옳지 않다.
옳은 것은 ③뿐이다.
````

- **독립 판정·핵심 연결/검산:** 홀수제곱근의 음수 실근과 짝수제곱근의 주값을 구분하면 ³√−8=−2, −⁴√16=−2; 참인 ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q06 — KEEP

- source ordinal/id: `NOT_PRESENT` / `6`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
$\dfrac{\cos^2\theta}{1+\sin\theta} + \cos\theta\tan\theta + (\sin\theta - \cos\theta)^2 + (\sin\theta + \cos\theta)^2$의 값을 구하면? [4.1점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. \dfrac{1}{2}
2. 1
3. \dfrac{3}{2}
4. 3
5. \dfrac{5}{2}
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
원래 식이 정의되는 범위에서는 $1+\sin\theta\ne0$이고 $\cos\theta\ne0$이다.
$\dfrac{\cos^2\theta}{1+\sin\theta}=\dfrac{1-\sin^2\theta}{1+\sin\theta}=1-\sin\theta$,
$\cos\theta\tan\theta=\sin\theta$이다.
또 $(\sin\theta-\cos\theta)^2+(\sin\theta+\cos\theta)^2=2\sin^2\theta+2\cos^2\theta=2$이다.
그러므로 주어진 식의 값은 $(1-\sin\theta)+\sin\theta+2=3$이고 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 로그 분모·진수의 정의역을 먼저 확인한 뒤 밑변환·역수 법칙을 적용하면 요구값 3, ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q07 — KEEP

- source ordinal/id: `NOT_PRESENT` / `7`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
원점과 점 $\mathrm{P}(-4, 3)$를 이은 선분을 동경으로 하는 각을 $\theta$라고 할 때, $\sqrt{(\cos\theta+\tan\theta)^2} - |\tan\theta - \sin\theta|$의 값을 구하면? [4.2점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. \dfrac{7}{5}
2. 1
3. \dfrac{4}{5}
4. \dfrac{3}{5}
5. \dfrac{1}{5}
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
점 $P(-4,3)$까지의 거리는 $\sqrt{(-4)^2+3^2}=5$이다.
따라서 $\cos\theta=-\dfrac45$, $\sin\theta=\dfrac35$, $\tan\theta=-\dfrac34$이다.
$\sqrt{(\cos\theta+\tan\theta)^2}=|-\dfrac45-\dfrac34|=\dfrac{31}{20}$,
$|\tan\theta-\sin\theta|=|-\dfrac34-\dfrac35|=\dfrac{27}{20}$이다.
차는 $\dfrac{31}{20}-\dfrac{27}{20}=\dfrac15$이므로 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 좌표 \((-4,3)\)으로 \(\cos=-4/5,\sin=3/5,\tan=-3/4\); 절댓값 두 항의 차는 \(31/20-27/20=1/5\), ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q08 — KEEP

- source ordinal/id: `NOT_PRESENT` / `8`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
다음 <보기> 중에서 $1$이 아닌 두 양수 $a, b$에 대하여 옳은 것만을 있는 대로 고른 것은? [4.3점]<br><br><b>[보 기]</b><br>ㄱ. $0<a<1, 0<b<1$일 때, $\sqrt[3]{a} = \sqrt[4]{b}$이면 $a<b$이다.<br>ㄴ. $b>a>0$이면 $\sqrt{a}\sqrt[3]{b} < \sqrt[3]{a}\sqrt{b}$이다.<br>ㄷ. $1>a$일 때, $\log_a b > 1$이면 $a<b$이다.
````

- 원문 보기 (`choices` 원래 순서):

````text
1. ㄱ
2. ㄴ
3. ㄱ, ㄷ
4. ㄴ, ㄷ
5. ㄱ, ㄴ, ㄷ
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
ㄱ. $\sqrt[3]{a}=\sqrt[4]{b}$이므로 양변을 $12$제곱하면 $a^4=b^3$입니다. 따라서 $b=a^{\frac{4}{3}}=a\sqrt[3]{a}$입니다. $0<a<1$에서 $\sqrt[3]{a}<1$이므로 $b<a$이고, $a<b$라는 주장은 거짓이다.
ㄴ. 양수 $a^{1/3}b^{1/3}$으로 두 식을 나누면 각각 $a^{1/6}$, $b^{1/6}$이다. $b>a>0$이므로 $a^{\frac{1}{6}}<b^{1/6}$이고 주장은 참이다.
ㄷ. $0<a<1$일 때 $y=\log_a x$는 감소한다. 따라서 $\log_a b>1=\log_a a$이면 $b<a$이므로 $a<b$라는 주장은 거짓이다.
옳은 것은 ㄴ뿐이므로 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 짝수제곱근의 실근 조건과 로그 밑·진수를 대조하면 ㄴ만 참, ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q09 — KEEP

- source ordinal/id: `NOT_PRESENT` / `9`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
$\dfrac{1}{8} \le x \le 8$에서 함수 $y=(\log_2 x)^2 - 4\log_2\dfrac{1}{x} + 1$의 최댓값을 $M$, 최솟값을 $m$이라 할 때, $M+m$의 값을 구하면? [4.4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 26
2. 23
3. 21
4. 20
5. 19
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$t=\log_2x$라 두면 $\dfrac18\le x\le8$에서 $-3\le t\le3$이다.
$\log_2\dfrac1x=-t$이므로 $y=t^2-4(-t)+1=(t+2)^2-3$이다.
$t=-2$가 범위 안에 있으므로 최솟값은 $m=-3$이다.
양 끝에서 $y(-3)=-2$, $y(3)=22$이므로 최댓값은 $M=22$이다.
따라서 $M+m=22-3=19$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(t=\log_2x\in[-3,3]\), \((t+2)^2-3\)의 최솟값 \(-3\), 최댓값22, 합19, ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q10 — KEEP

- source ordinal/id: `NOT_PRESENT` / `10`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
다음 연립 부등식의 정수해의 개수를 구하면? [4.5점]<br><br>$$\begin{cases} \log_2(2x+1) < 3 \\ \log_{\frac{1}{3}}(x-1) \ge \log_{\frac{1}{3}}(2x+1) \end{cases}$$
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
첫째 로그의 진수 조건은 $2x+1>0$이다. 밑 $2>1$이므로
$\log_2(2x+1)<3=\log_2 8$에서 $0<2x+1<8$, 즉 $-\dfrac12<x<\dfrac72$이다.
둘째 로그의 진수 조건은 $x-1>0$과 $2x+1>0$이므로 $x>1$이다. 밑 $\dfrac13$은 $0$과 $1$ 사이여서 로그함수가 감소하므로
$\log_{\frac{1}{3}}(x-1)\ge\log_{\frac{1}{3}}(2x+1)$은 $x-1\le2x+1$, 즉 $x\ge-2$와 같다.
$x>1$이면 이 조건은 자동으로 성립한다. 따라서 해는 $1<x<\dfrac72$이고 정수해는 $2,3$ 두 개이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 진수 조건 \(x>1\)에서 첫 로그부등식을 풀면 \(x<7/2\); 자연수 해 \(2,3\) 두 개, ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q11 — KEEP

- source ordinal/id: `NOT_PRESENT` / `11`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
$a+b+c=-1$, $2^a+2^b+2^c=15$, $2^{-a}+2^{-b}+2^{-c}=12$을 만족시키는 세 실수 $a, b, c$에 대하여 $4^a+4^b+4^c$의 값을 구하면? [4.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 215
2. 213
3. 189
4. 174
5. 172
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$x=2^a$, $y=2^b$, $z=2^c$라 두면 $x,y,z>0$이다.
$a+b+c=-1$에서 $xyz=2^{-1}=\dfrac12$이고 $x+y+z=15$이다.
$\dfrac1x+\dfrac1y+\dfrac1z=\dfrac{xy+yz+zx}{xyz}=12$이므로 $xy+yz+zx=12\cdot\dfrac12=6$이다.
따라서 $4^a+4^b+4^c=x^2+y^2+z^2=(x+y+z)^2-2(xy+yz+zx)=225-12=213$이다.
정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(2^a,2^b,2^c\)를 각각 \(u,v,w\)로 치환, \(uvw=1/2,u+v+w=15,uv+vw+wu=6\); \(u^2+v^2+w^2=213\), ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q12 — KEEP

- source ordinal/id: `NOT_PRESENT` / `12`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
어떤 생물은 매시간 일정한 비율로 생장하여 24시간 후면 생물의 크기가 처음의 3배가 된다고 한다. 14시간 후의 이 생물의 크기는 처음보다 몇 % 증가하였는지 다음의 상용로그표를 이용하여 구하면? [4.6점]<br><br><table border="1" style="border-collapse: collapse; text-align: center; margin: 10px auto;"><tr><th style="padding: 4px 15px;">$x$</th><th style="padding: 4px 15px;">$\log x$</th></tr><tr><td>1.59</td><td>0.20</td></tr><tr><td>1.91</td><td>0.28</td></tr><tr><td>2.52</td><td>0.40</td></tr><tr><td>3.00</td><td>0.48</td></tr><tr><td>3.63</td><td>0.56</td></tr></table>
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 91%
2. 63%
3. 59%
4. 56%
5. 48%
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
한 시간 뒤 크기의 비율을 $r$이라 하면 24시간 뒤 세 배이므로 $r^{24}=3$이다.
14시간 뒤 크기는 처음의 $r^{14}=3^{\frac{14}{24}}=3^{\frac{7}{12}}$배이다.
$\log(3^{\frac{7}{12}})=\dfrac7{12}\log3=\dfrac7{12}\cdot0.48=0.28$이다.
표에서 $\log x=0.28$이면 $x=1.91$이므로 14시간 뒤 크기는 처음의 $1.91$배이다.
증가율은 $(1.91-1)\cdot100\%=91\%$이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 24시간에 3배이면 14시간 배수 \(3^{7/12}\). 주어진 상용로그로 약1.91배, 증가율91%, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q13 — KEEP

- source ordinal/id: `NOT_PRESENT` / `13`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
다음 <보기>에서 <u>틀린 것</u>만을 있는 대로 고르면? [4.7점]<br><br><b>[보 기]</b><br>ㄱ. $\{x \mid \log x^2 = 4\} = \{x \mid 2\log x = 4\}$<br>ㄴ. $\{x \mid \log\bigl((x+1)(x-2)\bigr) = 1\} = \{x \mid \log(x+1) + \log(x-2) = 1\}$<br>ㄷ. $\left\{x \;\middle|\; \log_2\left(\dfrac{x+2}{x-1}\right) = 1\right\} = \{x \mid \log_2(x+2) - \log_2(x-1) = 1\}$
````

- 원문 보기 (`choices` 원래 순서):

````text
1. ㄱ
2. ㄴ
3. ㄷ
4. ㄱ, ㄴ
5. ㄴ, ㄷ
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
ㄱ. $\log x^2=4$의 진수 조건은 $x\ne0$이다. $x^2=10^4$에서 해집합은 $\{-100,100\}$이다.
$2\log x=4$는 $x>0$이어야 하므로 해집합은 $\{100\}$이다. 두 집합은 같지 않아 ㄱ은 틀리다.
ㄴ. 왼쪽 로그의 진수는 $(x+1)(x-2)$이므로 $(x+1)(x-2)=10$이고
$x^2-x-12=0$, $(x-4)(x+3)=0$이므로 왼쪽 해집합은 $\{-3,4\}$이다. 오른쪽의 두 로그가 모두 정의되려면 $x>2$여야 한다. 이때 같은 곱의 식을 풀면 해는 $x=4$뿐이므로 두 집합은 다르다. ㄴ은 틀리다.
ㄷ. 왼쪽 식에서 진수의 비가 양수이고 그 값이 $2$여야 하므로 $\dfrac{x+2}{x-1}=2$이다. 풀면 $x=4$이고 왼쪽 진수 조건을 만족한다.
오른쪽은 $x>1$에서 로그의 차를 한 로그로 합치면 같은 식이 되어 해는 $x=4$뿐이다. 따라서 두 집합이 같아 ㄷ은 옳다.
틀린 것은 ㄱ, ㄴ이므로 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 로그의 양수 진수·밑 조건을 반영하면 ㄱ·ㄴ 거짓, ㄷ 참, ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q14 — KEEP

- source ordinal/id: `NOT_PRESENT` / `14`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
두 수 $\sqrt[5]{\dfrac{n}{4}}$, $\sqrt[6]{\dfrac{n}{3}}$이 모두 자연수가 되도록 하는 자연수 $n$의 최솟값이 $2^a \times 3^b$일 때, 자연수 $a, b$에 대하여 $ab$의 값은? [4.8점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 288
2. 297
3. 300
4. 312
5. 325
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$n$을 소인수분해하고 2와 3의 지수를 각각 $e_2,e_3$라 하자.
$\sqrt[5]{\frac{n}{4}}$가 자연수이려면 $e_2\ge2$이고 $e_2-2$는 5의 배수여야 한다. 따라서 가능한 작은 지수는 $2,7,12,\ldots$이다. 또 $\sqrt[6]{\frac{n}{3}}$가 자연수이려면 $e_2$가 6의 배수여야 한다. 후보 $2,7,12$ 중 이를 처음 만족하는 것은 $12$이다.
3의 지수는 $\frac{n}{3}$이 자연수의 6제곱이므로 $e_3\ge1$이고 $e_3-1$은 6의 배수이다. 한편 $\frac{n}{4}$가 5제곱이 되려면 $e_3$는 5의 배수이다. 후보 $e_3=5,10,15,20,25$를 보면 $e_3-1=4,9,14,19,24$이고, $e_3-1$이 6의 배수가 되는 가장 작은 $e_3$는 $25$이다.
다른 소수의 지수는 5와 6의 배수, 즉 30의 배수여야 하므로 $n$을 가장 작게 하려면 그런 소수는 넣지 않는다. 따라서 최소인 $n$은 $2^{12}\cdot3^{25}$이고 $a=12$, $b=25$이다.
그러므로 $ab=12\cdot25=300$이고 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 지수 소인수 \(2^{12}3^{25}\)에 대해 조건을 연립해 \(a\cdot b=300\), ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q15 — KEEP

- source ordinal/id: `NOT_PRESENT` / `15`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `객관식` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
함수 $f(x)=2^x$에 대하여 함수 $g(x), h(x)$를 아래와 같이 정의하자.<br><br>$$g(x) = f(x)-1$$<br>$$h(x) = f(-x) + \dfrac{a}{16}$$<br><br>좌표평면에서 $g(x)=h(x)$를 만족하는 점을 $A$라고 할 때, 점 $B(6, 0)$와 원점 $O$를 세 점으로 하는 삼각형 $AOB$의 넓이가 $21$이 되도록 하는 $a$에 대하여 $[\log a]$의 값을 구하면? [4.9점]<br>(단, $[x]$는 $x$보다 크지 않은 최대의 정수이다.)
````

- 원문 보기 (`choices` 원래 순서):

````text
1. 1
2. 2
3. 3
4. 4
5. 5
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$A=(x,y)$라 하면 $g(x)=h(x)$이므로 $y=2^x-1$이다.
삼각형의 밑변 $OB$의 길이는 $6$이고 높이는 $|y|$이므로 $\dfrac12\cdot6\cdot|y|=21$, $|y|=7$이다.
$2^x>0$이므로 $y=2^x-1>-1$이다. 따라서 $y=-7$은 불가능하여 $y=7$이다.
$2^x-1=7$에서 $2^x=8=2^3$이므로 $x=3$이다.
$h(3)=7$을 대입하면 $2^{-3}+\dfrac a{16}=7$, 즉 $\dfrac18+\dfrac a{16}=7$이다.
따라서 $\dfrac a{16}=\dfrac{55}{8}$, $a=110$이다.
$10^2=100<110<1000=10^3$이므로 $2<\log a<3$이고 $[\log a]=2$이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 교점의 높이와 밑변6의 삼각형 넓이21로 \(y_A=7\), \(x_A=3\), \(a=110\); \(\lfloor\log a\rfloor=2\), ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q16 — KEEP

- source ordinal/id: `NOT_PRESENT` / `16`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `단답형` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
[단답형 1] $\sqrt[4]{\sqrt[3]{4^2}} = 2^k$일 때, $k$의 값을 구하시오. [5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `\dfrac{1}{3}`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$4^2=2^4$이므로 $\sqrt[3]{4^2}=\sqrt[3]{2^4}=2^{\frac{4}{3}}$이다.
여기에 네제곱근을 취하면 지수가 $4$분의 $1$이 되어
$\sqrt[4]{\sqrt[3]{4^2}}=(2^{\frac{4}{3}})^{\frac{1}{4}}=2^{(\frac{4}{3})(\frac{1}{4})}=2^{\frac{1}{3}}$이다.
따라서 $k=\dfrac13$이다.
````

- **독립 판정·핵심 연결/검산:** \(\sqrt[4]{(\sqrt[3]4)^2}=2^{1/3}\)으로 지수법칙을 다시 대입.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q17 — KEEP

- source ordinal/id: `NOT_PRESENT` / `17`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `단답형` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
[단답형 2] $x = \log_3(\sqrt{5}-2)$일 때, $9^x + 9^{-x}$의 값을 구하시오. [5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `18`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$x=\log_3(\sqrt5-2)$에서 $3^x=\sqrt5-2$이다.
따라서 $9^x=(3^x)^2=(\sqrt5-2)^2=9-4\sqrt5$이다.
$9^x\cdot9^{-x}=1$이므로
$9^{-x}=\dfrac1{9-4\sqrt5}=\dfrac{9+4\sqrt5}{(9-4\sqrt5)(9+4\sqrt5)}=9+4\sqrt5$이다.
그러므로 $9^x+9^{-x}=18$이다.
````

- **독립 판정·핵심 연결/검산:** \(x=\log_3(\sqrt5-2)\); \(9^x+9^{-x}=(\sqrt5-2)^2+(\sqrt5+2)^2=18\).
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q18 — KEEP

- source ordinal/id: `NOT_PRESENT` / `18`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `단답형` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
[단답형 3] $f(x) = \log_3 x$를 $x$축으로 $+1$만큼, $y$축으로 $+2$만큼 평행이동한 함수를 $g(x)$라 하자. 이때 $x^{\log_2\sqrt{x}} \times 2^{\log_4 4x} = g^{-1}(3)$를 만족하는 $x$를 구하시오. [5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `\dfrac{1}{4},\;2`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
식에 있는 $\sqrt{x}$와 $4x$가 로그의 진수이므로 $x>0$이다.
$f(x)=\log_3x$를 오른쪽으로 $1$, 위쪽으로 $2$만큼 옮기면 $g(x)=\log_3(x-1)+2$이다.
$y=\log_3(x-1)+2$에서 $x=3^{y-2}+1$이므로 $g^{-1}(3)=3^{3-2}+1=4$이다.
$t=\log_2x$라 두면 $x=2^t$, $\log_2\sqrt{x}=\dfrac t2$이므로 $x^{\log_2\sqrt{x}}=2^{t^2/2}$이다.
또 $4x=2^{t+2}$이므로 $\log_4(4x)=\dfrac{t+2}{2}=1+\dfrac t2$이다.
주어진 식은 $2^{t^2/2}\cdot2^{1+\frac{t}{2}}=4=2^2$이므로
$t^2+t+2=4$, 즉 $t^2+t-2=0$이다. $(t-1)(t+2)=0$에서 $t=1$ 또는 $t=-2$이다.
따라서 $x=2$ 또는 $x=\dfrac14$이다. 두 값 모두 처음의 조건 $x>0$을 만족하므로 해는 $\dfrac14,2$이다.
````

- **독립 판정·핵심 연결/검산:** 역함수 대칭성으로 \(g^{-1}(3)=4\); \(t=\log_2x\) 방정식 \((t+2)(t-1)=0\)의 해 \(x=1/4,2\).
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q19 — KEEP

- source ordinal/id: `NOT_PRESENT` / `19`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `서술형` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
[서술형 1] 아래와 같이 정의되는 함수 $f(x)$와 로그함수 $y=\log_{2n}(x-1)$가 만나는 교점의 개수가 $10$개 이하가 되도록 하는 자연수 $n$의 개수를 구하시오. [10점]<br><br>(가) $f(x)=x^2, -1 \le x \le 1$<br>(나) 모든 실수 $x$에 대하여 $f(x) = f(x+2)$
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `5`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
(나)에 의해 $f$의 그래프는 $y=x^2$의 조각을 주기 $2$로 반복한다. 각 조각은 위로 열린 포물선이며 $0\le f(x)\le1$이다.
$1<x<2$이면 $x-1<1$이므로 $\log_{2n}(x-1)<0\le f(x)$이고 교점이 없다. $x=2$에서는 두 함수값이 모두 $0$이다. 또 $x>2n+1$이면 $\log_{2n}(x-1)>1\ge f(x)$이므로 교점이 없다. 따라서 $[2,2n+1]$에서만 교점을 세면 된다.

$b=2n$이라 놓고 상승 구간 $[2k,2k+1]$에서 $x=2k+t$ ($0\le t\le1$)라 두자. 이때 $f(x)=t^2$이고 로그함숫값은 $L(t)=\log_b(2k-1+t)$이다. 밑 $b>1$인 로그 그래프는 두 점을 잇는 현보다 위에 있으므로, $0<s<t\le1$일 때
$L(s)\ge\dfrac{s}{t}L(t)+\left(1-\dfrac{s}{t}\right)L(0)\ge\dfrac{s}{t}L(t)$이다. 여기서 $L(0)\ge0$이고 $L(t)>0$이므로
$\dfrac{L(s)}{s^2}\ge\dfrac{L(t)}{st}>\dfrac{L(t)}{t^2}$이다. 따라서 $L(t)/t^2$는 $t$가 커질수록 엄격히 작아지고, $L(t)=t^2$는 상승 구간 안에서 많아야 한 번 성립한다.

먼저 $k=1$이면 $L(0)=0$이다. $n>1$일 때 $c=L(1)=\log_b2$는 $0<c<1$이다. 양 끝을 잇는 현 성질로 $L(t)\ge ct$이므로 $0<t<c$에서는 $L(t)>t^2$이다. 반면 $t=1$에서는 $L(1)=c<1=t^2$이다. 위에서 보인 비율의 엄격한 감소와 로그함수의 연속성에 따라 이 사이에 내부 교점이 정확히 하나 있다. $n=1$이면 $b=2$이고 $L(1)=1$이다. 이때 현 성질로 $L(t)\ge t>t^2$ ($0<t<1$)이므로 내부 교점은 없고, 양 끝 $x=2,3$만 교점이다.

$2\le k<n$이면 $L(0)=\log_b(2k-1)>0$이므로 $t$가 $0$에 가까울 때 $L(t)/t^2$는 1보다 크다. $t=1$에서는 $L(1)=\log_b(2k)<1$이므로 비율이 1보다 작다. 따라서 각 상승 구간에 내부 교점이 하나 있다. 마지막 상승 구간 $k=n$에서는 $L(1)=\log_b(2n)=1$이고 비율이 엄격히 감소하므로 $0<t<1$에서는 $L(t)/t^2>1$이다. 이 구간에는 내부 교점이 없고 끝점 $x=2n+1$에서만 만난다.

하강 구간 $[2k+1,2k+2]$ ($1\le k<n$)에서는 $f$가 $1$에서 $0$으로 감소하고 로그함수는 증가한다. 왼쪽 끝에서는 $1>\log_b(2k)$이고 오른쪽 끝에서는 $0<\log_b(2k+1)$이므로 각 하강 구간에 교점이 정확히 하나 있다.

정리하면 $x=2$에서 한 번, 처음부터 마지막 직전까지의 상승 구간에서 $n-1$번, 하강 구간에서 $n-1$번, 마지막 끝점 $x=2n+1$에서 한 번 만난다. $n=1$일 때도 내부 상승·하강 교점은 없고 두 끝점 $2,3$만 있어 같은 식으로 전체 교점 수는 $2n$개이다.
$2n\le10$이므로 $n=1,2,3,4,5$이고 조건을 만족하는 자연수는 $5$개이다.
````

- **독립 판정·핵심 연결/검산:** 2주기 포물선과 로그 \(y=\log_{2n}(x-1)\)의 교점은 \(2n\)개(\(x=2,2n+1\) 포함). \(2n\le10\)을 만족하는 \(n=1,...,5\), 5개.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q20 — KEEP

- source ordinal/id: `NOT_PRESENT` / `20`; `questionUid`: `NOT_PRESENT`; source blob: `3b073e714872d7aab450c186c0b82300f8b43aff`
- 형식/배점: `서술형` / `NOT_PRESENT`; 원본 단원/과정: `NOT_PRESENT` / `NOT_PRESENT`
- 원문 문제·조건 (`content` 그대로):

````text
[서술형 2] 집합 $A$와 $B$가 다음과 같이 정의되어 있고 아래 조건을 만족한다고 한다. [10점]<br><br>(가) $A = \{x \mid |x+3| \le a, x \ne 2\}$<br>(나) $B = \left\{b \;\middle|\; b = \log_{\frac{1}{a+1}}\left|1 - \dfrac{1}{2}x\right| + 5, x \in A\right\}$<br>(다) 집합 $B$에 속하는 원소 중 가장 큰 원소는 $5$이다.<br><br>위 조건들을 만족하는 양의 실수 $a$의 값을 구하고 이때, 집합 $B$에 속하는 원소 중 가장 작은 원소 $K$를 구하시오.
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `a=3,\;K=4`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$a>0$이므로 밑 $\dfrac1{a+1}$은 $0$과 $1$ 사이이고 로그함수는 감소한다.
$A$는 구간 $[-3-a,-3+a]$에서 $x=2$만 제외한 집합이다.

$a\ge5$이면 $2$가 구간에 들어간다. $x=2$는 제외되어도 $A$ 안에서 $x$를 $2$에 가깝게 잡으면 $\left|1-\dfrac x2\right|$이 $0$에 가까워진다. 밑이 $0$과 $1$ 사이이므로 로그값이 위로 한없이 커져 $B$에는 가장 큰 원소가 없다. 따라서 $0<a<5$이다.

이때 구간의 모든 $x$가 $2$보다 작으므로 $\left|1-\dfrac x2\right|=1-\dfrac x2$이다. 이 값은 $x$가 커질수록 작아져 가장 작은 값은 오른쪽 끝 $x=-3+a$에서 $\dfrac{5-a}{2}$이다.
로그함수는 감소하므로 $B$의 가장 큰 원소는 $5+\log_{1/(a+1)}\left(\dfrac{5-a}{2}\right)$이다. 이것이 $5$이려면 로그값이 $0$이므로 $\dfrac{5-a}{2}=1$, $a=3$이다.

$a=3$이면 $A=[-6,0]$이고 $\left|1-\dfrac x2\right|$은 $1$부터 $4$까지의 값을 갖는다. 밑은 $\dfrac14$이므로 로그값은 $\log_{1/4}1=0$에서 $\log_{1/4}4=-1$까지이다.
따라서 $B$의 최솟값은 $K=5-1=4$이고 답은 $a=3,\;K=4$이다.
````

- **독립 판정·핵심 연결/검산:** \(a\ge5\)면 제외점 \(x=2\) 주변에서 로그값이 위로 발산하여 최댓값 불가능. \(0<a<5\)에서 최댓값5 조건은 \((5-a)/2=1\) → \(a=3\), 최솟값4.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


## 종합 인계

- 시험지 범위: 20/20 문항 전수, 정답키/풀이 수치의 독립 검산 기록 20건.
- 판정: KEEP 20, UPGRADE 0, HOLD 0, UNREAD 0.
- **해설 보완 제안:** 없음; UPGRADE 문항은 본문에 최종 학생용 교정안을 포함함.
- 문항 원본·정답키·그림 파일 수정/배포: `NOT_DONE`; 이 MD는 감사 기록 겸 제안안.
- 원격 readback 완료 후에도 운영/자동화 검증 상태는 `QA_NOT_RUN`으로 유지.
