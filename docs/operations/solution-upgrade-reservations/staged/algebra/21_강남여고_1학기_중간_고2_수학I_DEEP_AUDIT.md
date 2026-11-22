# 2021 21_강남여고_1학기_중간_고2_수학I.js — 고2 대수/구 수학Ⅰ 해설 심층 감사

- line: `lane30` · courseKey: `algebra` · material: `original` · term: `1mid` · year: `2021`
- source: `archive/exams/original/high/h2/1mid/21_강남여고_1학기_중간_고2_수학I.js`
- source ref: `work/solution-upgrade-lane-30-20261121` (본문을 읽은 작업 브랜치)
- source blob SHA: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 원본 metadata: `standardCourse` 누락 0/30, `category` 누락 0/30, `questionType` 누락·공란 0/30; 누락값은 추정하지 않고 `NOT_PRESENT`로 표기
- worker branch: `work/solution-upgrade-lane-30-20261121`
- auditPath: `docs/operations/solution-upgrade-reservations/staged/algebra/21_강남여고_1학기_중간_고2_수학I_DEEP_AUDIT.md`
- denominator: `30` · actual question/answer/solution read: `30` · KEEP 28 · UPGRADE 2 · HOLD 0 · UNREAD 0
- state: `EXAM_AUDIT_COMPLETE` · `EXAM_DRAFT_COMPLETE` · `QA_NOT_RUN`
- next_qid: `NONE`; unfinished upgrades: `NONE`; remaining HOLD: `NONE`
- 범위: 원본 JS의 모든 `content`·`choices`·`answer`·`solution`을 전수 열람하고, 매 문항의 계산·끝점·부호·그림을 독립 확인함. UPGRADE는 **학생용 완성 해설 제안**으로만 기록했으며 원본 JS/정답키/이미지/`main`은 변경하지 않음.

## 기준·검증 경계

- 사용자 요청의 연속 작업 구간: 고2 대수(구 수학Ⅰ), 2021년 1학기 중간고사, 원본 시험지 5개 순차 처리 중 해당 학교.
- 적용 지침: `AGENTS.md`, `docs/agents/common.md`, `docs/agents/exam-pipeline.md`, `docs/agents/outcome-method-review.md`, `archive/AGENTS.md` (기존 작업 브랜치에서 확인한 원칙).
- `docs/operations/solution-upgrade-reservations/DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md`: 이 브랜치에서 조회 시 `NOT_FOUND`; 직전 2022년 lane30 심층 감사 산출물과 기존 규칙의 필드 구조를 준용함. `NOT_FOUND`를 통과 처리하지 않음.
- 문제에 연결된 원본 PNG 4개는 내려받아 실제 이미지로 시각 판독, SVG 1개는 Git blob/원본 XML 확인만 수행. SVG 최종 렌더·페이지 실제 미리보기·전체 preflight·Golden/Negative·운영 출고·SHA-256 별도 영수증은 `NOT_RUN`. 원본 이미지 육안 확인과 운영 QA는 다름.
- `KEEP`·`UPGRADE`는 문항별 수학/학생용 설명 감사 판정이며 최종 운영 검증 통과 선언이 아님.

## 문제·해설 이미지 실물 증거

- Q12 보조 해설 이미지 — `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q12-solution-v2.svg` · blob `b03e9a3c7633c3e2ee8a2f5c7bab174a80e1260d` · SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- Q23 문제 이미지 — `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q23.png` · blob `50da192d5051dc4185d1e8405f5fabd6969efd84` · PNG 원본 시각 판독 완료
- Q25 문제 이미지 — `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q25.png` · blob `556eb5a8eff16b01ca41866d8725952e96482f69` · PNG 원본 시각 판독 완료
- Q26 문제 이미지 — `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q26.png` · blob `a2b37b6e057faf88f1001088f591e7284b189a98` · PNG 원본 시각 판독 완료
- Q29 문제 이미지 — `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q29.png` · blob `47cc46b66facef017a49731fff811486c9f1f18e` · PNG 원본 시각 판독 완료

## 전 문항 심층 판정

### Q01 — KEEP

- source ordinal/id: `1` / `1`; `questionUid`: `qid_v1_3c08857b9d1878cc5f8b8f2b1b8b836726bd963e471f72e4cf06cfa47b3c0c93`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
1. $\cos\frac{4}{3}\pi$의 값은? [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $-\frac{\sqrt{3}}{2}$
2. $-\frac{1}{2}$
3. $0$
4. $\frac{1}{2}$
5. $\frac{\sqrt{3}}{2}$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
주어진 각을 한 바퀴보다 작은 동경의 각으로 바꾼다.
$\frac{4\pi}{3}=\pi+\frac{\pi}{3}$이므로 동경은 제3사분면에 있다.
기준각은 $\frac{\pi}{3}$이고, 제3사분면에서 코사인은 음수이다.
따라서 $\cos\frac{4\pi}{3}=-\cos\frac{\pi}{3}=-\frac12$이다.
정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(\cos(4\pi/3)=-\cos(\pi/3)=-1/2\); ②와 일치.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q02 — KEEP

- source ordinal/id: `2` / `2`; `questionUid`: `qid_v1_f241cc21e8aa90132faeed6a0a521568684a654546fe733b2242e225f826092c`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `로그의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
2. $1+\log_2 4$의 값은? [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
로그의 정의에 따라 $\log_2 4=2$이다.
따라서 $1+\log_2 4=1+2=3$이다.
정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(1+\log_2 4=1+2=3\); ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q03 — KEEP

- source ordinal/id: `3` / `3`; `questionUid`: `qid_v1_5f5cee9df229f08fb2e1ff0d7e9bbec885189c8f6eeefb58de95c0f9f2737e48`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
3. $\frac{25}{4}\pi$를 $2n\pi+\theta$꼴로 나타낼 때, 각 $\theta$의 크기는? (단, $n$은 정수, $0\le \theta < 2\pi$) [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{1}{4}\pi$
2. $\frac{\pi}{2}$
3. $\frac{3}{4}\pi$
4. $\pi$
5. $\frac{5}{4}\pi$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$2\pi=\frac{8\pi}{4}$이므로 $\frac{25\pi}{4}=3(2\pi)+\frac{\pi}{4}$이다.
$0\le\theta<2\pi$인 나머지 각은 $\theta=\frac{\pi}{4}$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(25\pi/4=3\cdot2\pi+\pi/4\); 동경은 \(\pi/4\), ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q04 — KEEP

- source ordinal/id: `4` / `4`; `questionUid`: `qid_v1_f2d9c6ca4c008388494ea3f769c58992c7269458a34884c4264bae01e775bb66`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
4. 각 $\theta$가 제2사분면의 각이고 $\sin\theta = \frac{3}{5}$일 때, $\tan\theta$의 값은? [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{4}{5}$
2. $\frac{3}{4}$
3. $\sqrt{3}$
4. $-\frac{4}{5}$
5. $-\frac{3}{4}$
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\sin\theta=\frac35$이고 $\theta$는 제2사분면이므로 $\cos\theta<0$이다.
$\sin^2\theta+\cos^2\theta=1$에서
$\cos^2\theta=1-\frac9{25}=\frac{16}{25}$이다.
따라서 $\cos\theta=-\frac45$이고
$\tan\theta=\frac{\sin\theta}{\cos\theta}=\frac{\frac{3}{5}}{-\frac{4}{5}}=-\frac34$이다.
정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 제2사분면에서 \(\sin=3/5\)이면 \(\cos=-4/5\), \(\tan=-3/4\); ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q05 — KEEP

- source ordinal/id: `5` / `5`; `questionUid`: `qid_v1_62a039c594ae7aaeb3072d44d0bb3340ba92ce2525e307fa7f526fc8dd55b975`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
5. 방정식 $5^{1-2x}=\sqrt{5}$의 해는? [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{1}{4}$
2. $\frac{1}{2}$
3. $1$
4. $\frac{3}{2}$
5. $2$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\sqrt5=5^{\frac{1}{2}}$이므로 지수가 같은 밑의 거듭제곱을 비교한다.
$1-2x=\frac12$에서 $-2x=-\frac12$, 따라서 $x=\frac14$이다.
정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(5^{1-2x}=5^{1/2}\)에서 \(x=1/4\), ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q06 — KEEP

- source ordinal/id: `6` / `6`; `questionUid`: `qid_v1_1d80a8e833a503eadf5cc8f084bfc6bcbdf71785421c19ac53bf3ee5d735b70f`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
6. 반지름의 길이가 6이고 호의 길이가 $2\pi$인 부채꼴의 중심각의 크기를 $a\pi$, 넓이를 $b\pi$라고 할 때, $ab$의 값은? (단, $a, b$는 상수) [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
호의 길이 공식 $s=r\theta$에서 $2\pi=6a\pi$이므로 $a=\frac13$이다.
부채꼴의 넓이는 $\frac12r^2\theta$이므로
$6\pi=\frac12\cdot6^2\cdot\frac{\pi}{3}=b\pi$에서 $b=6$이다.
따라서 $ab=\frac13\cdot6=2$이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(\theta=s/r=\pi/3\), 부채꼴 넓이 \(6\pi\); 원문이 요구한 곱 \(ab=2\), ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q07 — KEEP

- source ordinal/id: `7` / `7`; `questionUid`: `qid_v1_4a275989777874ee8b0285e586e2d7fb6c02eb2272e37d60250cdb4836fe2ef0`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `로그함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
7. 두 곡선 $y-1=3^x$, $y=\log_2(x+a)$의 점근선을 각각 $l_1, l_2$라 하자. 두 직선 $l_1, l_2$가 직선 $y=x$에 대하여 서로 대칭일 때, 상수 $a$의 값은? [2.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $0$
2. $-3$
3. $-1$
4. $1$
5. $3$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$y-1=3^x$의 수평 점근선은 $y=1$이고, $y=\log_2(x+a)$의 수직 점근선은 $x=-a$이다.
직선 $y=x$에 대한 대칭에서 $(0,1)$은 $(1,0)$으로 옮겨지므로 두 점근선은 각각 $y=1$, $x=1$이어야 한다.
따라서 $-a=1$이고 $a=-1$이다. 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** 지수함수 수평점근선 \(y=1\), 로그함수 수직점근선 \(x=a-1\)을 좌표 이동·대칭과 대조해 ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q08 — KEEP

- source ordinal/id: `8` / `8`; `questionUid`: `qid_v1_6e5af247a3589d35cef4390b7094adee1dc83186125e33897e1354eb053e053b`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `2.5`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
8. $a>1$일 때, 다음을 만족시키는 실수 $k$의 값은? [2.5점]
$$\sqrt[3]{a \times \sqrt{a \times \sqrt[4]{a^3}}} \div \sqrt[6]{a \times \sqrt[3]{a^k}} = 1$$
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{33}{4}$
2. $9$
3. $\frac{19}{2}$
4. $10$
5. $\frac{21}{2}$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$a>1$이므로 서로 같은 거듭제곱 $a^u=a^v$에서는 지수 $u,v$가 같다.
분자의 지수를 차례로 계산하면
$\sqrt[4]{a^3}=a^{\frac{3}{4}}$,
$\sqrt{a\times a^{\frac{3}{4}}}=a^{(1+\frac{3}{4})/2}=a^{\frac{7}{8}}$,
$\sqrt[3]{a\times a^{\frac{7}{8}}}=a^{(1+\frac{7}{8})/3}=a^{\frac{5}{8}}$이다.
분모의 지수는
$\sqrt[6]{a\times\sqrt[3]{a^k}}=a^{(1+\frac{k}{3})/6}=a^{\frac{1}{6}+\frac{k}{18}}$이다.
두 지수를 같게 두면
$\frac58=\frac16+\frac{k}{18}$,
$\frac{k}{18}=\frac58-\frac16=\frac{11}{24}$,
$k=18\times\frac{11}{24}=\frac{33}{4}$이다.
따라서 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 중첩근호 지수 \(5/8\), 분모 지수 \(1/6+k/18\)을 맞춰 \(k=33/4\), ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q09 — KEEP

- source ordinal/id: `9` / `9`; `questionUid`: `qid_v1_9b76cc0e61a89fd7929773b4ee2e5708d408fd9d5e4150450ce63194bd48f405`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `지수함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
9. 함수 $y=2^{x-m}+n$의 그래프와 그 역함수의 그래프가 두 점에서 만나고, 두 교점의 $x$좌표가 각각 $1, 2$일 때, $m+n$의 값은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $1$
2. $2$
3. $3$
4. $4$
5. $5$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
증가함수와 그 역함수의 그래프는 $y=x$에 대하여 대칭이다. 두 교점의 $x$좌표가 1, 2인데 한 교점이 대각선 밖에 있으면 대칭인 두 점의 좌표는 $(1,2)$, $(2,1)$이 된다. 이는 증가함수의 순서와 맞지 않으므로 두 교점은 모두 $y=x$ 위에 있다.
따라서 $f(1)=1$, $f(2)=2$이다.
$2^{1-m}+n=1$, $2^{2-m}+n=2$를 빼면 $2^{1-m}=1$이므로 $m=1$이다. 첫 식에서 $n=0$이다.
따라서 $m+n=1$이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 증가함수와 그 역함수가 갖는 두 교점은 \(y=x\) 위에 있어야 한다. 조건 대입 시 \(m=1,n=0\), 합 1, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q10 — KEEP

- source ordinal/id: `10` / `10`; `questionUid`: `qid_v1_6802c680a8db2350377b98221ca769dc310d77204874cd6052137842a5891724`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
10. $0<\theta<\frac{\pi}{2}$이고 $\frac{\sin\theta}{1+\cos\theta} + \frac{1+\cos\theta}{\sin\theta} = 4$일 때, $\cos\theta$의 값은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $1$
2. $\frac{1}{2}$
3. $\frac{\sqrt{2}}{2}$
4. $\frac{\sqrt{3}}{2}$
5. $\sqrt{2}$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$t=\frac{\sin\theta}{1+\cos\theta}=\tan\frac\theta2$라 두면 $0<t<1$이다.
문제의 식은 $t+\frac1t=4$이므로 $t^2-4t+1=0$이다.
$0<t<1$을 만족하는 근은 $t=2-\sqrt3$이다.
반각 관계에서 $\cos\theta=\frac{1-t^2}{1+t^2}=\frac{1/t-t}{1/t+t}$이다.
여기서 $1/t+t=4$, $1/t-t=2\sqrt3$이므로 $\cos\theta=\frac{\sqrt3}{2}$이다. 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(t=\tan(\theta/2)\in(0,1)\)에서 \(t+1/t=4\), \(\cos\theta=\sqrt3/2\), ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q11 — KEEP

- source ordinal/id: `11` / `11`; `questionUid`: `qid_v1_42850a9f191e8ba6c50cc79724b6828a52a1f2d82a9cc3c864f3d5183b6d76f6`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
11. $0\le x < 2\pi$일 때, 방정식 $2\cos^2 x - 3\sin x = 0$을 만족시키는 모든 $x$의 값의 합은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{\pi}{2}$
2. $\frac{2}{3}\pi$
3. $\frac{5}{6}\pi$
4. $\pi$
5. $\frac{7}{6}\pi$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$2\cos^2x=2(1-\sin^2x)$를 사용하면
$2\sin^2x+3\sin x-2=0$이다.
$(2\sin x-1)(\sin x+2)=0$인데 $-1\le\sin x\le1$이므로 $\sin x=\frac12$이다.
$0\le x<2\pi$에서 해는 $x=\frac\pi6,\frac{5\pi}6$이다.
합은 $\pi$이므로 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(2(1-\sin^2x)-3\sin x=0\)을 \((2\sin x-1)(\sin x+2)=0\)으로 정리. 실근 \(\sin x=1/2\)에서 \(x=\pi/6,5\pi/6\), 합 \(\pi\), ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q12 — KEEP

- source ordinal/id: `12` / `12`; `questionUid`: `qid_v1_646bf99d035a233af87c27bc9158c5f0ce945273bf8da992650dbd426edb4216`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
12. 다음 두 조건을 동시에 만족하는 각 $\theta$의 범위가 $a\pi < \theta < b\pi$일 때, $a+b$의 값은? (단, $0 < \theta \le 2\pi$) [3점]
<div class="problem-box">
<b>&lt;조건&gt;</b><br>
(가) $\sin\theta > \frac12$<br>
(나) $\cos\theta < 0$
</div>
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{2}{3}$
2. $\frac{5}{6}$
3. $1$
4. $\frac{4}{3}$
5. $\frac{3}{2}$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$0<\theta\le2\pi$에서 $\sin\theta>\frac12$가 되려면
$\frac{\pi}{6}<\theta<\frac{5\pi}{6}$이다.
또 $\cos\theta<0$인 범위는 제2사분면과 제3사분면이므로
$\frac{\pi}{2}<\theta<\frac{3\pi}{2}$이다.
두 범위가 동시에 성립하려면 그 교집합을 취한다.
$\frac{\pi}{2}<\theta<\frac{5\pi}{6}$이므로
$a=\frac12$, $b=\frac56$이다.
$a+b=\frac12+\frac56=\frac43$이다.
따라서 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(\sin\theta>1/2\), \(\cos\theta<0\)의 교집합 \((\pi/2,5\pi/6)\); 정규화한 끝점 합 \(4/3\), ④.
- 그림/보조 해설 증거: 보조 해설 이미지: `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q12-solution-v2.svg` / `b03e9a3c7633c3e2ee8a2f5c7bab174a80e1260d` / SVG Git blob/원본 XML 확인; 렌더 시각 판독 NOT_RUN
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q13 — KEEP

- source ordinal/id: `13` / `13`; `questionUid`: `qid_v1_46bcea266cd2f80738eb6ca13b24f8e9a69765a1caa88470f4d98f5bb8f4a666`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
13. $\left(\frac{1}{1024}\right)^{\frac{1}{n}}$이 자연수가 되도록 하는 정수 $n$의 값의 합은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $-15$
2. $-17$
3. $17$
4. $-18$
5. $18$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\left(\frac1{1024}\right)^{\frac{1}{n}}=2^{-\frac{10}{n}}$이다. 자연수가 되려면 $n<0$이고 $-\frac{10}{n}$은 양의 정수여야 한다.
따라서 $n=-d$에서 $d$는 10의 양의 약수이므로 $n=-1,-2,-5,-10$이다.
그 합은 $-18$이다. 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** \(2^{-10/n}\in\mathbb N\)이려면 \(-10/n\)이 양의 정수. 따라서 \(n\)은 10의 음의 약수 \(-1,-2,-5,-10\), 합 \(-18\), ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q14 — KEEP

- source ordinal/id: `14` / `14`; `questionUid`: `qid_v1_4a129449c069421b798be30637ddbe5ab52f469f50197638569d7534c3faf25d`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `지수함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
14. 부등식 $4^x - 2^{x+3} + k + 1 > 0$이 모든 실수 $x$에 대하여 성립하도록 하는 자연수 $k$의 최솟값은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $14$
2. $15$
3. $16$
4. $17$
5. $18$
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$t=2^x$라 두면 $t>0$이고 식은 $t^2-8t+k+1>0$이다.
이 이차식의 꼭짓점은 $t=4$에서 생기며, 최솟값은 $k+1-16=k-15$이다.
모든 $x$에서 엄밀히 양수이려면 $k-15>0$이어야 하므로 자연수 $k$의 최솟값은 16이다.
정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(t=2^x>0\)로 두면 \((t-4)^2+k-15>0\). \(t=4\)도 가능하므로 최소 자연수 \(k=16\), ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q15 — KEEP

- source ordinal/id: `15` / `15`; `questionUid`: `qid_v1_9a403f4d7349c3fe4c0dcc5d09f7891b085d8c83e5f3704f6e2f443dacdf63d8`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
15. 예각삼각형 $\mathrm{ABC}$에 대한 다음 보기 중 옳은 것을 모두 고른 것은? [3점]
<div class="problem-box">
<b>&lt;보기&gt;</b><br>
(가) $\cos\frac{B+C}{2} = -\sin\frac{A}{2}$<br>
(나) $\sin(A+B)+\sin C = 0$<br>
(다) $\tan A + \tan(B+C) = 0$
</div>
````

- 원문 보기 (`choices` 원래 순서):

````text
1. (가)
2. (나)
3. (다)
4. (가), (다)
5. (나), (다)
````

- 원본 `answer`: `③`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
예각삼각형에서 $A+B+C=\pi$이다.
(가) $\cos\frac{B+C}{2}=\cos\frac{\pi-A}{2}=\sin\frac A2>0$이므로 음수인 $-\sin\frac A2$와 같지 않다. 거짓이다.
(나) $\sin(A+B)+\sin C=\sin(\pi-C)+\sin C=2\sin C>0$이므로 0이 아니다. 거짓이다.
(다) $B+C=\pi-A$이므로 $\tan A+\tan(B+C)=\tan A+\tan(\pi-A)=\tan A-\tan A=0$이다. 참이다.
옳은 것은 (다)뿐이므로 정답은 ③이다.
````

- **독립 판정·핵심 연결/검산:** \(A+B+C=\pi\)를 써서 (가)·(나)는 거짓, \(\tan A+\tan(B+C)=0\)만 참, ③.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q16 — KEEP

- source ordinal/id: `16` / `16`; `questionUid`: `qid_v1_875c237827bea0a892b74b38118953adeadf488c6673b8e5b3652ae2e0c6b748`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `로그의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
16. 1이 아닌 두 양수 $a, b$가 다음 조건을 만족시킬 때, $a^2+b^2$의 값은? (단, $a+b\ne 1$) [3점]
<div class="problem-box">
<b>&lt;조건&gt;</b><br>
(가) $\frac{1}{\log_{a+b} 2} = 4$<br>
(나) $\log_2 a = 4 - \frac{1}{\log_b 2}$
</div>
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $220$
2. $224$
3. $228$
4. $232$
5. $236$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
(가)에서 $\frac1{\log_{a+b}2}=4$이므로 $\log_{a+b}2=\frac14$이다.
따라서 $a+b=2^4=16$이다.
또 $\frac1{\log_b2}=\log_2b$이므로 (나)는 $\log_2a+\log_2b=4$, 즉 $ab=16$을 뜻한다.
그러므로 $a^2+b^2=(a+b)^2-2ab=16^2-2\cdot16=224$이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(\log_{a+b}2=1/4\)에서 \(a+b=16\), \(\log_2a+\log_2b=4\)에서 \(ab=16\); \(a^2+b^2=224\), ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q17 — KEEP

- source ordinal/id: `17` / `17`; `questionUid`: `qid_v1_a73ceedfdd949c555421d998223f5fbf773b28373069c774b910b640a6a4d356`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `삼각함수의 그래프` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
17. 함수 $y=2\sin\pi x$의 그래프가 직선 $y=\frac{x}{n}$와 만나는 점의 개수를 $f(n)$이라 할 때, $f(2)+f(3)$의 값은? [3점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $18$
2. $19$
3. $20$
4. $21$
5. $22$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$g_n(x)=2\sin(\pi x)-\frac{x}{n}$이라 두면 $g_n$은 홀함수여서 0이 아닌 해는 원점 대칭으로 짝을 이룬다. $x>0$에서는 사인값이 양수인 구간만 교점이 생길 수 있다.
$(0,1)$에서는 원점 다음에 한 번 더 만나고, 각 양의 반주기 $(2k,2k+1)$에서는 양 끝에서 $g_n<0$이다. 중점에서 $g_n(2.5)=2-\frac{2.5}{n}>0$인 구간은 오목하므로 교점이 두 개다.
$n=2$에서는 $(2,3)$만 해당하고 $x\ge4$에서는 $x/2\ge2$라 추가 교점이 없다. 따라서 양의 교점은 3개, $f(2)=2\cdot3+1=7$이다.
$n=3$에서는 $(2,3)$과 $(4,5)$가 해당한다. $x\ge6$에서는 $x/3\ge2$라 추가 교점이 없다. 따라서 양의 교점은 5개, $f(3)=2\cdot5+1=11$이다.
그러므로 $f(2)+f(3)=18$이고 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 홀함수 교점 대칭과 양의 사인 봉우리별 두 교점을 세면 \(f(2)=7,f(3)=11\); 합 18, ①. \(x/n>2\)가 되면 추가 교점 없음.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q18 — KEEP

- source ordinal/id: `18` / `18`; `questionUid`: `qid_v1_4c80d733abc458ee6f5c2b459bc05edd8323285102abcaf5cf0f866fed68af53`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
18. 조건을 만족하는 두 입체도형 $\mathrm{A, B}$의 부피가 서로 같을 때, 서로소인 두 자연수 $m, n$에 대하여 $m+n$의 값은? [3점]
<div class="problem-box">
<b>&lt;조건&gt;</b><br>
$\mathrm{A}$. 가로의 길이, 세로의 길이가 각각 $\sqrt{8}$, $\sqrt[3]{32}$, 높이가 $\sqrt[3]{\sqrt{128}}$인 직육면체<br>
$\mathrm{B}$. 한 모서리의 길이가 $\sqrt[m]{2^n}$인 정육면체
</div>
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $19$
2. $20$
3. $21$
4. $22$
5. $23$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
직육면체의 부피를 2의 거듭제곱으로 나타내면
$\sqrt8\cdot\sqrt[3]{32}\cdot\sqrt[3]{\sqrt{128}}=2^{\frac{3}{2}+\frac{5}{3}+\frac{7}{6}}=2^{\frac{13}{3}}$이다.
정육면체의 한 모서리 길이가 $\sqrt[m]{2^n}$이므로 부피는 $2^{3n/m}$이다.
$2^{\frac{13}{3}}=2^{3n/m}$에서 $9n=13m$이다. 서로소 자연수 조건으로 $m=9,n=13$이므로 $m+n=22$이다. 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 직육면체 부피 \(2^{13/3}\), 정육면체 부피 \(2^{3n/m}\); \(9n=13m\) 최소 자연수 \((m,n)=(9,13)\), 합 22, ④.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q19 — KEEP

- source ordinal/id: `19` / `19`; `questionUid`: `qid_v1_152c012a3ef3e7de9326b2386bacb454b1cd07739acb2635d4908c7be8b5526d`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3.5`; 원본 단원/과정: `지수함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
19. $x+y=1$, $x\ge 0, y\ge 0$일 때 $\frac{1}{2^x 3^y} + \frac{1}{3^x 2^y}$의 최솟값은? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{\sqrt{3}}{3}$
2. $\sqrt{3}$
3. $1$
4. $\sqrt{6}$
5. $\frac{\sqrt{6}}{3}$
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$u=2^x3^y$, $v=3^x2^y$라 두면 $uv=6^{x+y}=6$이다.
따라서 산술·기하평균에 의해
$\frac1u+\frac1v\ge2\sqrt{\frac1{uv}}=\frac2{\sqrt6}=\frac{\sqrt6}{3}$이다.
$x=y=\frac12$일 때 $u=v$이므로 등호가 성립한다. 최솟값은 $\frac{\sqrt6}{3}$이고 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** \(u=2^x3^y,v=3^x2^y\), \(uv=6\). 산술기하평균 등호가 \(x=y=1/2\)에서 성립해 최솟값 \(\sqrt6/3\), ⑤.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q20 — KEEP

- source ordinal/id: `20` / `20`; `questionUid`: `qid_v1_f0ea3281fdf39669e7051f0afbbc706b98432c4b2254502e3e92c652615fc966`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3.5`; 원본 단원/과정: `지수함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
20. $-1 \le x \le 2$에서 정의된 함수 $f(x)=\left(\frac{3}{a}\right)^x$의 최댓값이 4가 되도록 하는 모든 양수 $a$의 값의 곱은? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $16$
2. $18$
3. $20$
4. $22$
5. $24$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$r=\frac3a$라 두면 $f(x)=r^x$이다.
$r>1$이면 구간에서 최댓값은 $x=2$일 때이므로 $r^2=4$, $r=2$, $a=\frac32$이다.
$0<r<1$이면 최댓값은 $x=-1$일 때이므로 $r^{-1}=4$, $r=\frac14$, $a=12$이다.
가능한 양수 $a$의 곱은 $\frac32\cdot12=18$이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** 구간 \([-1,2]\)에서 \(r=3/a\)인 지수함수의 최대가 4가 되려면 \(r=2\) 또는 \(1/4\); \(a=3/2,12\)의 곱 18, ②.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q21 — UPGRADE

- source ordinal/id: `21` / `21`; `questionUid`: `qid_v1_a2724403ac86ac3efa5fe7dba0576439ee6099fd4af79fedb0cc42eeb130fc32`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3.5`; 원본 단원/과정: `삼각방정식과 삼각부등식` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
21. 어느 섬의 선착장에서 시각이 $x$시일 때, 해수면의 높이를 $h(x)\mathrm{m}$라고 하면
$$h(x) = 5 + 4.8\sin\frac{\pi}{6}x \quad (0 \le x < 24)$$
라고 한다. 이 섬의 선착장에서 해수면의 높이가 $7.4\mathrm{m}$ 이상일 때만 여객선을 댈 수 있다고 할 때, 여객선을 댈 수 있는 시간은 하루에 몇 시간 동안인지 구하면? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $8$
2. $9$
3. $10$
4. $11$
5. $12$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$5+4.8\sin\frac{\pi x}{6}\ge7.4$에서 $\sin\frac{\pi x}{6}\ge\frac12$이다.
사인값이 한 주기에서 $\frac12$ 이상인 구간은 각도 기준 $\frac\pi6$부터 $\frac{5\pi}6$까지이며, 이를 시간으로 바꾸면 길이는 4시간이다?
한 주기의 시간은 12시간이고, 경계각 차는 $\frac{4\pi}{6}=\frac{2\pi}{3}$이므로 시간 길이는 $12\cdot\frac{1}{3}=4$시간이다.
하루 24시간에는 주기가 2번 있으므로 가능한 시간은 $4\cdot2=8$시간이다. 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(\sin(\pi x/6)\ge1/2\)는 각 12시간 주기마다 4시간, 24시간 동안 총 8시간, ①. 원문 해설의 ‘4시간이다?’는 불필요한 의문형으로 정정 필요.
- 그림/보조 해설 증거: 별도 이미지 없음
- **UPGRADE 사유:** 원본 수학 결과와 정답은 맞지만 학습자가 재현할 핵심 중간 단계·표현의 명료성에 보완이 필요함. 아래 완성된 학생용 교정안 기록. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

**학생용 보완 해설**

\(h(x)\ge7.4\)인 시각을 찾자.
\[
5+4.8\sin\frac{\pi x}{6}\ge7.4
\quad\Longleftrightarrow\quad
\sin\frac{\pi x}{6}\ge\frac12.
\]
각 \(t=\frac{\pi x}{6}\)로 놓으면 \(0\le x<24\)에서 \(0\le t<4\pi\)이다. \(\sin t\ge\frac12\)인 한 주기 \(0\le t<2\pi\)의 구간은 \([\frac\pi6,\frac{5\pi}6]\)이고, 폭은 \(\frac{2\pi}{3}\)이다. 이를 시간으로 환산하면
\[
\frac{6}{\pi}\cdot\frac{2\pi}{3}=4\text{시간}.
\]
하루 24시간에 사인함수의 12시간 주기가 두 번 반복되므로 접안 가능한 시간의 총길이는 \(4\times2=\boxed{8\text{시간}}\)이다. 경계시각은 접안 가능하지만 총시간의 길이에는 영향을 주지 않는다. 정답은 **①**이다.

**교정 이유:** 원문 풀이의 ‘4시간이다?’라는 물음표를 제거하고, 각도의 폭을 실제 시간으로 환산하는 근거 및 반주기 아닌 전체 주기의 횟수를 명시한다.


### Q22 — KEEP

- source ordinal/id: `22` / `22`; `questionUid`: `qid_v1_3cf8060171cecc0691866313ca5c6b58cb6dbbd8dd81aef619b9e0147256b484`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `3.5`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
22. $a=4^4 \times 8^8$일 때, $\frac{a}{2^n}$의 $n$제곱근 중에서 자연수인 것이 존재하도록 하는 2 이상의 자연수 $n$의 개수는? [3.5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $5$
2. $7$
3. $9$
4. $11$
5. $13$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$a=4^4\cdot8^8=2^8\cdot2^{24}=2^{32}$이다.
$\frac a{2^n}=2^{32-n}$의 $n$제곱근은 $2^{\frac{32-n}{n}}$이다. 자연수가 되려면 $\frac{32}{n}-1$이 0 이상의 정수여야 하므로 $n$은 32의 약수이고 $2\le n\le32$이다.
가능한 $n$은 $2,4,8,16,32$의 5개이다. 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** \(4^4\cdot8^8=2^{32}\). \(2^{32/n-1}\)이 자연수가 되는 \(n\)은 \(2,4,8,16,32\), 5개, ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q23 — KEEP

- source ordinal/id: `23` / `23`; `questionUid`: `qid_v1_155e176becbd89cdf26ccea441a7508c0e665b024c9c8bb4176aff1af8cf2874`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `4`; 원본 단원/과정: `로그함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
23. 그림과 같이 좌표평면에 점 $\mathrm{A}(4, 4)$와 함수 $f(x)=\log_a(bx-12)$의 그래프가 있다. 곡선 $y=f(x)$의 점근선이 $x$축과 만나는 점을 $\mathrm{P}$라 할 때, 곡선 $y=f(x)$ 위의 제1사분면의 점 $\mathrm{Q}$에 대하여 삼각형 $\mathrm{APQ}$가 다음 조건을 만족시킨다.
<img src="assets/images/21_강남여고_1학기_중간_고2_수학I/q23.png" class="question-img" data-archive-mobile-figure="true" alt="좌표평면에서 A(4,4), 점근선이 x축과 만나는 P, 로그곡선 위의 제1사분면 점 Q가 표시되어 있다. 삼각형 APQ는 A에서 직각이고, Q를 지나는 수평선이 변 AP를 지난다.">
<div class="problem-box">
<b>&lt;조건&gt;</b><br>
(가) 점 $\mathrm{Q}$를 지나고 $x$축에 평행한 직선은 삼각형 $\mathrm{APQ}$의 넓이를 이등분한다.<br>
(나) 삼각형 $\mathrm{APQ}$는 $\angle\mathrm{A}=90^\circ$인 직각이등변삼각형이다.
</div>
$a+b$의 값은? (단, $a, b$는 $a>1, b>0$인 상수이다.) [4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $8$
2. $9$
3. $10$
4. $11$
5. $12$
````

- 원본 `answer`: `⑤`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
점근선은 $x=\frac{12}{b}$이므로 $P=(p,0)$에서 $p=\frac{12}{b}$라 두자. 조건 (가)의 수평선은 $Q$와 변 $AP$ 위의 점 $T$를 지난다. 두 삼각형 $ATQ$, $PTQ$는 밑변 $TQ$를 공유하므로 넓이가 같으면 $A$, $P$에서 수평선까지의 높이가 같다. 따라서 수평선의 $y$좌표는 $A$, $P$의 $y$좌표 4와 0의 중간인 2이고, $Q$의 $y$좌표도 2이다.
$AP=(p-4,-4)$, $AQ=(q-4,-2)$라 두면 $\angle A=90^\circ$이므로 $(p-4)(q-4)+8=0$이다. 두 변의 길이가 같으므로 $(q-4)^2+4=(p-4)^2+16$이다.
그림의 위치에 따라 $p<4<q$이다. 위 두 식을 풀면 $p=2$, $q=8$이다. 따라서 $b=12/p=6$이다.
$Q$가 로그곡선 위에 있으므로 $2=\log_a(6\cdot8-12)=\log_a36$이다. $a>1$에서 $a=6$, 따라서 $a+b=12$이다. 정답은 ⑤이다.
````

- **독립 판정·핵심 연결/검산:** 수평선 넓이 이등분은 \(y_Q=2\). \(AP\perp AQ\)와 \(AP=AQ\), \(p<4<q\)를 풀어 \(P=(2,0),Q=(8,2)\); \(b=6,a=6\), 합12, ⑤. 원본 그림 일치.
- 그림/보조 해설 증거: 문제 이미지: `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q23.png` / `50da192d5051dc4185d1e8405f5fabd6969efd84` / PNG 원본 시각 판독 완료
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q24 — KEEP

- source ordinal/id: `24` / `24`; `questionUid`: `qid_v1_3deb8f4d627f64344767064408a3ec2381d6471aadd98fd6005c300d20c8a44c`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `4`; 원본 단원/과정: `지수함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
24. 함수
$$f(x) = \begin{cases} 2^{x+1} & (x < a) \\ 16\left(\frac{1}{2}\right)^x - 4 & (x \ge a) \end{cases}$$
에 대하여 $f(0) < f(a) < f(1)$이 성립하도록 하는 실수 $a$의 값의 범위가 $\log_2 p < a < \log_2 q$일 때, 두 실수 $p, q$에 대하여 $p+q$의 값은? [4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{14}{3}$
2. $5$
3. $\frac{16}{3}$
4. $\frac{17}{3}$
5. $6$
````

- 원본 `answer`: `①`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
항상 $f(1)=4$이다. $a>0$이면 $f(0)=2$이고 $f(a)=16\cdot2^{-a}-4$이다.
조건은 $2<16\cdot2^{-a}-4<4$이므로 $6<16\cdot2^{-a}<8$이다. 이를 정리하면 $2<2^a<\frac83$, 따라서 $1<a<\log_2\frac83$이다.
$a\le0$이면 $f(0)=12$이고 $f(1)=4$라 $f(0)<f(a)<f(1)$이 불가능하다.
따라서 $p=2$, $q=\frac83$이고 $p+q=\frac{14}{3}$이다. 정답은 ①이다.
````

- **독립 판정·핵심 연결/검산:** 구간별 식과 엄격부등호를 함께 적용해 \(1<a<\log_2(8/3)\), 요구 \(p+q=14/3\), ①.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q25 — KEEP

- source ordinal/id: `25` / `25`; `questionUid`: `qid_v1_dc081d5b0e6c875ad2d653a7cab47cead1bed0acdb4339a6a4cfb0db2bd92106`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `4`; 원본 단원/과정: `삼각함수의 뜻과 값` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
25. 그림과 같이 반지름의 길이가 1이고 중심이 원점 $\mathrm{O}$인 원 위의 두 점을 $\mathrm{A, B}$라 하고, 점 $\mathrm{A}$를 지나고 선분 $\mathrm{OA}$에 수직인 직선과 직선 $\mathrm{OB}$가 만나는 점을 $\mathrm{C}$라 할 때, 선분 $\mathrm{OA}$ 위의 점 $\mathrm{D}$가 다음 조건을 만족시킨다.
<img src="assets/images/21_강남여고_1학기_중간_고2_수학I/q25.png" class="question-img" data-archive-mobile-figure="true" alt="단위원의 중심은 O이고 A와 B는 원 위에 있다. A를 지나 OA에 수직인 직선은 OB와 C에서 만나며, D는 OA 위에서 BD⊥OA를 이룬다. 중심각은 θ이다.">
<div class="problem-box">
<b>&lt;조건&gt;</b><br>
(가) $\overline{\mathrm{OA}} \perp \overline{\mathrm{BD}}$<br>
(나) $\overline{\mathrm{BD}} + \frac{1}{\overline{\mathrm{OC}}} = \frac{4}{3}$
</div>
$\angle\mathrm{AOB}=\theta$라 할 때, $\frac{\sin^2\theta}{\sin\theta - \cos\theta} + \frac{\cos\theta}{1-\tan\theta}$의 값은? [4점]
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $\frac{1}{3}$
2. $\frac{2}{3}$
3. $1$
4. $\frac{4}{3}$
5. $\frac{5}{3}$
````

- 원본 `answer`: `④`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$\angle AOB=\theta$라 두면 $B=(\cos\theta,\sin\theta)$이고, 수직 조건에서 $BD=\sin\theta$이다. $OB=1$이므로 직선 $OB$와 $x=1$의 교점은 $C=(1,\tan\theta)$이며 $OC=\sec\theta$이다.
따라서 조건은 $\sin\theta+\cos\theta=\frac43$이다.
구하는 식의 둘째 항은
$\frac{\cos\theta}{1-\tan\theta}=\frac{\cos^2\theta}{\cos\theta-\sin\theta}$이다.
전체 식은
$\frac{\sin^2\theta-\cos^2\theta}{\sin\theta-\cos\theta}=\sin\theta+\cos\theta=\frac43$이다. 정답은 ④이다.
````

- **독립 판정·핵심 연결/검산:** 반지름 1에서 \(BD=\sin\theta, OC=1/\cos\theta\). 주어진 \(\sin\theta+\cos\theta=4/3\)으로 계산값 \(4/3\), ④; 접선·수선 원본 도형과 부합.
- 그림/보조 해설 증거: 문제 이미지: `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q25.png` / `556eb5a8eff16b01ca41866d8725952e96482f69` / PNG 원본 시각 판독 완료
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q26 — UPGRADE

- source ordinal/id: `26` / `26`; `questionUid`: `qid_v1_7cb8b3d2bcb1cd25b393f3ad46ce172d0b8fc1d3e10cb37b0db9701d6af08a27`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `객관식` / `4`; 원본 단원/과정: `로그함수` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
26. 두 함수 $f(x)=\frac{1}{2}\log_a x$, $g(x)=\log_{\frac{1}{a}} x$ ($a>1$)에 대하여 두 곡선 $y=f(x)$, $y=g(x)$가 그림과 같다. 점 $\mathrm{A}(1, 0)$을 지나고 $x$축의 양의 방향과 이루는 각의 크기가 $30^\circ$이고 기울기가 양수인 직선 $l_1$이 곡선 $y=f(x)$와 만나는 점 중 $\mathrm{A}$가 아닌 점을 $\mathrm{B}$, 점 $\mathrm{B}$를 지나고 직선 $l_1$에 수직인 직선 $l_2$가 곡선 $y=g(x)$와 만나는 점 중 $x$좌표가 1보다 큰 점을 $\mathrm{C}$, 점 $\mathrm{C}$를 지나고 직선 $l_2$에 수직인 직선 $l_3$이 $x$축과 만나는 점을 $\mathrm{D}$라 하자. 직선 $l_2$와 $x$축이 만나는 점 $\mathrm{E}$에 대하여 $\overline{\mathrm{AE}} : \overline{\mathrm{ED}} = 1 : 3$일 때, $\overline{\mathrm{BD}}^2$의 값은? [4점]
<img src="assets/images/21_강남여고_1학기_중간_고2_수학I/q26.png" class="question-img" data-archive-mobile-figure="true" alt="로그곡선 f와 g 및 A(1,0)을 표시한다. l1은 A에서 기울기 양수로 f와 B에서 만나고, B를 지나는 l2는 g와 C에서 만난다. C를 지나 l2에 수직인 l3는 x축과 D에서 만나며, E는 l2와 x축의 교점이다.">
````

- 원문 보기 (`choices` 원래 순서):

````text
1. $169$
2. $172$
3. $175$
4. $178$
5. $181$
````

- 원본 `answer`: `②`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$B=(u,y_B)$라 두면 $l_1$의 기울기가 $1/\sqrt3$이므로 $y_B=(u-1)/\sqrt3$이다. $l_2$의 $x$절편은 $E=\frac{4u-1}{3}$이다. $AE:ED=1:3$에서 $D=(\frac{16u-13}{3},0)$이다.
두 수직선 $l_2,l_3$의 교점인 $C$를 구하면 $x_C=\frac{7u-4}{3}$, $y_C=-\sqrt3(u-1)$이다. $C$는 $g(x)=-\log_a x$ 위에 있고 $B$는 $f(x)=\frac12\log_a x$ 위에 있으므로
$\log_a u=\frac{2(u-1)}{\sqrt3}$, $\log_a x_C=\sqrt3(u-1)$이다. 따라서 $x_C=u^{\frac{3}{2}}$이고
$\frac{7u-4}{3}=u^{\frac{3}{2}}$이다. $r=\sqrt u>1$로 두면 $(r-1)(3r^2-4r-4)=0$에서 $r=2$, $u=4$이다.
그러므로 $B=(4,\sqrt3)$, $D=(17,0)$이고 $BD^2=(17-4)^2+(\sqrt3)^2=172$이다. 정답은 ②이다.
````

- **독립 판정·핵심 연결/검산:** \(l_2\perp l_1\)로 \(E_x=(4u-1)/3\), \(AE:ED=1:3\)으로 \(D_x=(16u-13)/3\). 로그 높이비에서 \(u^{3/2}=(7u-4)/3\), \(u=4\), \(BD^2=172\), ②. 교점 C 산출을 학생용 풀이에 전개할 필요.
- 그림/보조 해설 증거: 문제 이미지: `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q26.png` / `a2b37b6e057faf88f1001088f591e7284b189a98` / PNG 원본 시각 판독 완료
- **UPGRADE 사유:** 원본 수학 결과와 정답은 맞지만 학습자가 재현할 핵심 중간 단계·표현의 명료성에 보완이 필요함. 아래 완성된 학생용 교정안 기록. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.

**학생용 보완 해설**

\(B=(u,v)\)라 두자. \(B\)는 \(A=(1,0)\)의 오른쪽에 있고 \(l_1\)의 기울기가 \(\tan30^\circ=1/\sqrt3\)이므로
\[
v=\frac{u-1}{\sqrt3},\qquad u>1.
\]
\(l_2\)는 \(l_1\)과 수직이라 기울기 \(-\sqrt3\)이다. \(l_2:y-v=-\sqrt3(x-u)\)에서 \(y=0\)을 대입하면 \(E=(\frac{4u-1}{3},0)\)이다. 원본 그림처럼 \(A,E,D\)가 이 순서대로 놓이고 \(AE:ED=1:3\)이므로
\[
x_D=1+4(x_E-1)=\frac{16u-13}{3}.
\]
\(l_3\)의 기울기는 다시 \(1/\sqrt3\)이고 \(D\)를 지나므로 \(l_3:y=(x-x_D)/\sqrt3\)이다. 교점 \(C=(w,z)=l_2\cap l_3\)에는
\[
-\sqrt3(w-u)+\frac{u-1}{\sqrt3}=\frac{w-x_D}{\sqrt3}
\quad\Longrightarrow\quad
w=\frac{7u-4}{3},\quad z=-\sqrt3(u-1).
\]
한편 \(B\)는 \(f(x)=\tfrac12\log_ax\) 위이므로 \(\log_a u=\frac{2(u-1)}{\sqrt3}\). \(C\)는 \(g(x)=-\log_ax\) 위이므로 \(\log_a w=\sqrt3(u-1)\)이다. 두 식을 나누면 \(\log_a w=\frac32\log_a u\), 곧
\[
w=u^{3/2}=\frac{7u-4}{3}.
\]
\(r=\sqrt u>1\)로 두면 \(3r^3-7r^2+4=(r-1)(r-2)(3r+2)=0\). \(r>1\)이므로 \(r=2,u=4\)이다. 따라서 \(B=(4,\sqrt3)\), \(D=(17,0)\)이고
\[
BD^2=(17-4)^2+(0-\sqrt3)^2=169+3=\boxed{172}.
\]
정답은 **②**이다.

**교정 이유:** 기존 해설의 \(E\), \(D\), \(C\) 좌표가 바로 결과로 제시되어 있기 때문에, 수직선 방정식과 내분비에서 해당 좌표가 도출되는 연산을 보강한다.


### Q27 — KEEP

- source ordinal/id: `27` / `27`; `questionUid`: `qid_v1_99adf8f8fcb2e9678b15a32dceb471e3dff540da151a3207554d2bc373444b73`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `서술형` / `5`; 원본 단원/과정: `지수의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
서술형1. $a = \sqrt[3]{\sqrt{5^{18}}}$, $b = 9^{\frac{5}{2}} \times 27^{-\frac{5}{3}}$, $c = \{(-3)^2\}^{\frac{1}{2}}$, $d = 81^{0.75}$일 때, $a+b+c+d$의 값을 구하시오. [5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `156`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
각 항을 3의 거듭제곱 또는 5의 거듭제곱으로 정리한다.
$a=\sqrt[3]{\sqrt{5^{18}}}=5^3=125$이다.
$b=9^{\frac{5}{2}}\cdot27^{-\frac{5}{3}}=3^5\cdot3^{-5}=1$이다.
$c=\{(-3)^2\}^{\frac{1}{2}}=\sqrt9=3$, $d=81^{0.75}=81^{\frac{3}{4}}=3^3=27$이다.
따라서 $a+b+c+d=125+1+3+27=156$이다.
````

- **독립 판정·핵심 연결/검산:** \(125+1+3+27=156\). 각 지수·로그 조건에서 선택한 \((a,b,c,d)\)와 대조.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q28 — KEEP

- source ordinal/id: `28` / `28`; `questionUid`: `qid_v1_1b39c11538ad1b80b3095fe6269468ca481bf62244e49b062aefd2d0cbef805c`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `서술형` / `5`; 원본 단원/과정: `로그의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
서술형2. 부등식
$$\log_3(x-3) + \log_3(x+1) < 1 + \log_3 4$$
의 해가 $a < x < b$일 때, $a+b$의 값을 구하시오. [5점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `8`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
로그의 진수 조건에서 $x-3>0$과 $x+1>0$이므로 $x>3$이다.
$1+\log_3 4=\log_3 12$이고 로그함수는 증가하므로
$(x-3)(x+1)<12$이다.
$x^2-2x-3<12$, 즉 $(x+3)(x-5)<0$이므로 $-3<x<5$이다. 진수 조건과 합치면 $3<x<5$이다.
따라서 $a=3,b=5$이고 $a+b=8$이다.
````

- **독립 판정·핵심 연결/검산:** \(x>3\)의 진수 조건과 \((x-3)(x+1)<12\)를 교차하면 \(3<x<5\); 끝점 합 8.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q29 — KEEP

- source ordinal/id: `29` / `29`; `questionUid`: `qid_v1_d64b21fc0f4c042404e76db08fe17c714bc2512a4ede6ea5b2086aad1adcb50a`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `서술형` / `5`; 원본 단원/과정: `삼각함수의 그래프` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
서술형3. 함수 $y=a\cos b(x-c)+d$의 그래프가 다음과 같을 때, 상수 $a, b, c, d$에 대하여 $abcd$의 값을 구하시오. (단, $a>0, b>0, 0<c<\pi$) [5점]
<img src="assets/images/21_강남여고_1학기_중간_고2_수학I/q29.png" class="question-img" data-archive-mobile-figure="true" alt="코사인 그래프는 y=3과 y=−1 사이에서 진동한다. 첫 최댓값 아래 x=π/12, 이어지는 최솟값 아래 x=7π/12가 표시되고, 다음 최댓값까지 곡선이 이어진다.">
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `\frac{\pi}{3}`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
그래프의 최댓값은 3, 최솟값은 -1이므로 진폭 $a=2$, 중심선 $d=1$이다.
연속한 두 최댓값은 $x=\frac{\pi}{12}$와 $x=\frac{13\pi}{12}$에서 나타나므로 주기는 $\pi$이다. 따라서 $\frac{2\pi}{b}=\pi$에서 $b=2$이다.
첫 최댓값이 $x=c=\frac{\pi}{12}$일 때 생기므로 $c=\frac{\pi}{12}$이다.
따라서 $abcd=2\cdot2\cdot\frac{\pi}{12}\cdot1=\frac{\pi}{3}$이다.
````

- **독립 판정·핵심 연결/검산:** 그래프의 최고 3·최저 −1은 진폭2·중심선1, 극대 간 주기 \(\pi\), 최초 극대 \(\pi/12\). \(abcd=\pi/3\); 원본 그림의 \(7\pi/12\) 극소점으로 재확인.
- 그림/보조 해설 증거: 문제 이미지: `archive/assets/images/21_강남여고_1학기_중간_고2_수학I/q29.png` / `47cc46b66facef017a49731fff811486c9f1f18e` / PNG 원본 시각 판독 완료
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


### Q30 — KEEP

- source ordinal/id: `30` / `30`; `questionUid`: `qid_v1_c9228a4e56a07c01b827915e5747f8db5db224120279e07b9e2964b429d4f8b5`; source blob: `ea9a24ccb631dd8dd86409ba7f13cbd45d28cbbd`
- 형식/배점: `서술형` / `5`; 원본 단원/과정: `로그의 뜻과 성질` / `수학I`
- 원문 문제·조건 (`content` 그대로):

````text
서술형4. 사람이 느끼는 소리의 크기는 물리적으로 측정한 소리의 세기와 다르며 거리에 따라 변한다. 소리의 크기와 소리의 세기, 거리 사이에는 다음과 같은 관계가 있다. [총 5점]
<div class="problem-box">
<b>&lt;관계&gt;</b><br>
(가) 소리의 세기가 $I\mathrm{W/m^2}$일 때, 소리의 크기를 $S\mathrm{dB}$이라고 하면 $S=10\log\frac{I}{I_0}$이다. 이때 $I_0$은 사람이 들을 수 있는 가장 작은 소리의 세기로 $I_0 = 10^{-12}\mathrm{W/m^2}$이다.<br>
(나) 소리의 세기 $I\mathrm{W/m^2}$는 음원에서 떨어진 거리 $d\mathrm{m}$ ($d\ne 0$)의 제곱에 반비례한다. 즉, $I=\frac{k}{d^2}$ ($k$는 상수)이다.
</div>
(1) 음원에서 떨어진 거리가 $d_1\mathrm{m}$, $d_2\mathrm{m}$인 두 지점에서 소리의 크기를 각각 $S_1\mathrm{dB}$, $S_2\mathrm{dB}$이라고 할 때, $S_2 = S_1 + 20\log\frac{d_1}{d_2}$이 성립함을 증명하시오. [3점]
(2) 공연장의 스피커에서 $2\mathrm{m}$ 떨어진 곳의 소리의 크기가 $100\mathrm{dB}$이라고 할 때, 이 스피커에서 $10\mathrm{m}$ 떨어진 곳의 소리의 크기는 얼마인지 구하시오. (단, $\log 2 = 0.3$으로 계산) [2점]
````

- 원문 보기 (`choices` 원래 순서):

````text
NOT_PRESENT (서답형/단답형 원본 필드 확인)
````

- 원본 `answer`: `86`
- 기존 `solution` 전체 (원본 HTML/LaTeX 보존):

````text
$I_i=\frac{k}{d_i^2}$를 $S_i=10\log\frac{I_i}{I_0}$에 대입한다.
$S_2-S_1=10\log\left(\frac{k/(d_2^2I_0)}{k/(d_1^2I_0)}\right)=10\log\left(\frac{d_1^2}{d_2^2}\right)=20\log\frac{d_1}{d_2}$이다.
두 거리의 비가 $d_1:d_2=2:10$이면
$S_2=100+20\log\frac{2}{10}=100-20\log5$이다.
$\log5=1-\log2=0.7$이므로 $S_2=100-14=86\mathrm{dB}$이다.
````

- **독립 판정·핵심 연결/검산:** 거리의 제곱에 반비례하는 음의 세기로 \(\Delta S=20\log_{10}(d_1/d_2)\), \(10/2=5\)와 \(\log 5=0.7\)에서 86 dB.
- 그림/보조 해설 증거: 별도 이미지 없음
- **KEEP 사유:** 원문 해설의 수치·조건·단위·끝점·선지/기입답을 독립 검산해 일치함을 확인. `READ_EVIDENCED` / 최종 운영 QA `NOT_RUN`.


## 종합 인계

- 시험지 범위: 30/30 문항 전수, 정답키/풀이 수치의 독립 검산 기록 30건.
- 판정: KEEP 28, UPGRADE 2, HOLD 0, UNREAD 0.
- **해설 보완 제안:** Q21, Q26; UPGRADE 문항은 본문에 최종 학생용 교정안을 포함함.
- 문항 원본·정답키·그림 파일 수정/배포: `NOT_DONE`; 이 MD는 감사 기록 겸 제안안.
- 원격 readback 완료 후에도 운영/자동화 검증 상태는 `QA_NOT_RUN`으로 유지.
