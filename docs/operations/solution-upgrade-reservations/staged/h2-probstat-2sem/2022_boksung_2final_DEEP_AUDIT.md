# 고2 확률과 통계 2학기 기말 — 22_복성고_2학기_기말_고2_확률과통계 전 문항 심층 감사

> lane40 기말 세 번째 5장 묶음 · 2026-11-22 KST. **학생용 해설 감사·수정안 MD 초안**. 원본 JS·보기·답안·그림·SVG 무수정. 운영 출고 PASS는 별도 단계.

## 0. 시험지 고정 정보

- 전용 라인: **lane40**, 고2 확률과 통계, 2학기 기말 원본. 다른 학기·유형 전환 없음.
- 원본 시험지: `22_복성고_2학기_기말_고2_확률과통계`
- 원본 JS 경로: `archive/exams/original/high/h2/2final/22_복성고_2학기_기말_고2_확률과통계.js`
- 원본 ref: `main`; **source Git blob SHA**: `c0305dec222b8629dd74c9712e10283190f3e180`.
- sourcePdf 메타데이터: 없음. 실제 인쇄 PDF 원문 대조 **NOT_RUN**.
- 총 문항 수: **20문항 (Q01~Q20)**; 실제 JS content·choices·answer·기존 solution **모든 문항의 전문 보존**.
- 감사 MD: `docs/operations/solution-upgrade-reservations/staged/h2-probstat-2sem/2022_boksung_2final_DEEP_AUDIT.md`; 전용 브랜치 `work/solution-upgrade-lane-40-probstat-2sem-20261122`.
- 원본문제 PNG: 고유 **2개**·참조 **2회**, 실물 다운로드 및 육안 판독 완료. 이미지 경로는 q.image/q.images/HTML 원문과 실제 GitHub 루트 `assets/images/`를 대조함.
- 기존 학생풀이 SVG: **9개** 경로 확인. 별도 SVG 렌더·Golden/Negative QA **NOT_RUN**.
- 방법: 원격 원본 JS JSON 정적 추출(스크립트 실행 없음), 전 문항 수학 독립 검산, 객관식 인덱스 대조, 원본 도형 실물 판독, 정규분포 참값 및 이항분포 정확값 검산. 실물 PDF / 렌더 QA는 이 단계와 구별.
- 결과: **EXAM_AUDIT_COMPLETE / READ_EVIDENCED 20/20; KEEP 19; UPGRADE 1; UNREAD 0.** 수정 문항 Q08.
- 이 시험지 cursor: `next_qid=NONE; UNREAD=[]`.

## 1. Q01~Q20 원문·기존 풀이 전문·독립 수학 검산

### Q01 — KEEP

- qid/source ordinal: `1`/1; sourceQid: `q01`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
1. 확률변수 $X$의 확률질량함수가 $P(X=x) = \frac{5-x}{10}\,(x=1, 2, 3, 4)$일 때 $X$의 평균을 구하시오. [3.9점]
~~~

- 원본 선택지: ① $\frac{1}{4}$ / ② $\frac{1}{2}$ / ③ $1$ / ④ $\frac{3}{2}$ / ⑤ $2$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 확률변수의 평균은 각 값에 그 값이 나올 확률을 곱하여 모두 더합니다. $P(X=1)=\frac{4}{10}$, $P(X=2)=\frac{3}{10}$, $P(X=3)=\frac{2}{10}$, $P(X=4)=\frac{1}{10}$이므로 $E(X)=1\cdot4/10+2\cdot3/10+3\cdot2/10+4\cdot1/10=\frac{4+6+6+4}{10}=2$입니다. 다른 보기들은 이 가중평균과 다르므로 정답은 ⑤입니다.
- **독립 수학 검산·판정 근거:** PMF (4,3,2,1)/10에서 E(X)=2, ⑤ 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
확률변수의 평균은 각 값에 그 값이 나올 확률을 곱하여 모두 더합니다. $P(X=1)=\frac{4}{10}$, $P(X=2)=\frac{3}{10}$, $P(X=3)=\frac{2}{10}$, $P(X=4)=\frac{1}{10}$이므로 $E(X)=1\cdot4/10+2\cdot3/10+3\cdot2/10+4\cdot1/10=\frac{4+6+6+4}{10}=2$입니다. 다른 보기들은 이 가중평균과 다르므로 정답은 ⑤입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q02 — KEEP

- qid/source ordinal: `2`/2; sourceQid: `q02`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
2. 모집단의 확률변수 $X$는 평균 20, 표준편차 3인 정규분포를 따른다. 모집단에서 크기가 $n$인 표본을 추출하여 표본평균을 $\overline{X_n}$이라 할 때, $P(20 \le \overline{X_n} \le 23) = P(20 \le X \le 32)$를 만족하는 자연수 $n$의 값을 구하시오. [4.1점]
~~~

- 원본 선택지: ① $4$ / ② $8$ / ③ $16$ / ④ $32$ / ⑤ $64$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 모집단의 평균이 20, 표준편차가 3이므로 표본평균은 평균 20, 표준편차 $3/\sqrt n$인 정규분포를 따릅니다. 따라서 $P(20\le\overline X_n\le23)=P(0\le Z\le\sqrt n)$입니다. 오른쪽 $P(20\le X\le32)$는 $P(0\le Z\le(32-20)/3)=P(0\le Z\le4)$입니다. 같은 표준정규분포 구간 확률이므로 $\sqrt n=4$, $n=16$입니다. 정답은 ③입니다.
- **독립 수학 검산·판정 근거:** 표본표준오차 3/√n 대 모집단3: √n=4, n=16 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
모집단의 평균이 20, 표준편차가 3이므로 표본평균은 평균 20, 표준편차 $3/\sqrt n$인 정규분포를 따릅니다. 따라서 $P(20\le\overline X_n\le23)=P(0\le Z\le\sqrt n)$입니다. 오른쪽 $P(20\le X\le32)$는 $P(0\le Z\le(32-20)/3)=P(0\le Z\le4)$입니다. 같은 표준정규분포 구간 확률이므로 $\sqrt n=4$, $n=16$입니다. 정답은 ③입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q03 — KEEP

- qid/source ordinal: `3`/3; sourceQid: `q03`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
3. 표준편차가 $\sigma$인 정규분포를 따르는 모집단에서 크기 $n$인 표본을 뽑아 신뢰도 $\alpha$로 모평균을 추정하려고 한다. &lt;보기&gt;에서 신뢰구간의 길이가 가장 긴 것과 가장 짧은 것을 차례로 구하시오. (단, $P(0 \le Z \le 1.96)=0.475$, $P(0 \le Z \le 2.58)=0.495$) [4.3점]
<br><br>&lt;보기&gt;<br>ㄱ. $n=100, \alpha=95\%$<br>ㄴ. $n=100, \alpha=99\%$<br>ㄷ. $n=400, \alpha=95\%$<br>ㄹ. $n=400, \alpha=99\%$
~~~

- 원본 선택지: ① ㄱ, ㄷ / ② ㄱ, ㄹ / ③ ㄴ, ㄱ / ④ ㄴ, ㄷ / ⑤ ㄹ, ㄷ
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 신뢰구간의 길이는 $L=2z\sigma/\sqrt n$입니다. 같은 모집단이므로 $\sigma$는 네 경우에 공통입니다. 신뢰도를 95%에서 99%로 높이면 $z$가 1.96에서 2.58로 커져 구간이 길어지고, 표본크기를 100에서 400으로 늘리면 $\sqrt n$이 10에서 20으로 커져 구간이 짧아집니다. ㄱ. $z/\sqrt n=\frac{1.96}{10}=0.196$. ㄴ. $z/\sqrt n=\frac{2.58}{10}=0.258$. ㄷ. $z/\sqrt n=\frac{1.96}{20}=0.098$. ㄹ. $z/\sqrt n=\frac{2.58}{20}=0.129$. $0.258>0.196>0.129>0.098$이므로 가장 긴 것은 ㄴ, 가장 짧은 것은 ㄷ입니
- **독립 수학 검산·판정 근거:** CI 길이비 z/√n: .258>.196>.129>.098, 최장 ㄴ/최단 ㄷ 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
신뢰구간의 길이는 $L=2z\sigma/\sqrt n$입니다. 같은 모집단이므로 $\sigma$는 네 경우에 공통입니다. 신뢰도를 95%에서 99%로 높이면 $z$가 1.96에서 2.58로 커져 구간이 길어지고, 표본크기를 100에서 400으로 늘리면 $\sqrt n$이 10에서 20으로 커져 구간이 짧아집니다.<br>ㄱ. $z/\sqrt n=\frac{1.96}{10}=0.196$.<br>ㄴ. $z/\sqrt n=\frac{2.58}{10}=0.258$.<br>ㄷ. $z/\sqrt n=\frac{1.96}{20}=0.098$.<br>ㄹ. $z/\sqrt n=\frac{2.58}{20}=0.129$.<br>$0.258>0.196>0.129>0.098$이므로 가장 긴 것은 ㄴ, 가장 짧은 것은 ㄷ입니다. 순서가 ㄴ, ㄷ인 ④가 정답입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q04 — KEEP

- qid/source ordinal: `4`/4; sourceQid: `q04`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
4. 어느 과수원에서 수확한 배의 무게는 정규분포를 따른다고 한다. 이 과수원에서 수확한 배 100개를 임의 추출하여 무게를 달아보았더니 평균이 $274\text{g}$, 표준편차가 $45\text{g}$이었다. 이 과수원에서 수확한 배의 무게의 평균 $m\,(\text{g})$을 신뢰도 95%로 추정하면 $a \le m \le b$이다. 이 때, 자연수 $b$의 값은? (단, $P(0 \le Z \le 2) = 0.475$로 계산한다.) [4점]
~~~

- 원본 선택지: ① $275$ / ② $279$ / ③ $283$ / ④ $287$ / ⑤ $291$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 표본평균은 $274$g, 표본크기는 100, 표본표준편차는 $45$g입니다. 제시된 표에 따라 신뢰도 95%의 근사 임계값 $z=2$를 사용하면 오차한계는 $2\times45/\sqrt{100}=9$g입니다. 따라서 추정 구간은 $274-9\le m\le274+9$, 즉 $265\le m\le283$입니다. 상한 $b=283$이므로 정답은 ③입니다.
- **독립 수학 검산·판정 근거:** 95% 임계값 z≈2를 지시한 근사에 따라 274±9, 상한283 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
표본평균은 $274$g, 표본크기는 100, 표본표준편차는 $45$g입니다. 제시된 표에 따라 신뢰도 95%의 근사 임계값 $z=2$를 사용하면 오차한계는 $2\times45/\sqrt{100}=9$g입니다. 따라서 추정 구간은 $274-9\le m\le274+9$, 즉 $265\le m\le283$입니다. 상한 $b=283$이므로 정답은 ③입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q05 — KEEP

- qid/source ordinal: `5`/5; sourceQid: `q05`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
5. 450명의 학생이 치른 수학 시험 점수가 평균이 76점이고 표준편차가 8점인 정규분포를 이룬다고 할 때, 30등인 학생의 점수를 아래쪽 정규분포표를 이용하여 구하면 약 몇 점인가? [4.2점]<br><table style="border-collapse:collapse;margin:8px 0" aria-label="원본 시험지 표"><tr><th style="border:1px solid #444;padding:3px 9px;text-align:center">$z$</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">$P(0 \le Z \le z)$</th></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.191</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.341</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.433</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">2.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.477</td></tr></table>
~~~

- 원본 선택지: ① $77$ / ② $80$ / ③ $84$ / ④ $88$ / ⑤ $90$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 30등은 점수가 높은 쪽에서 약 30명이므로 상위 비율은 $\frac{30}{450}=1/15\approx0.0667$입니다. 즉 구하는 점수 $x$보다 높은 비율이 약 $0.0667$이어야 합니다. 표준화 $Z=\frac{X-76}{8}$을 하면 표의 $P(0\le Z\le1.5)=0.433$에서 오른쪽 꼬리 확률은 $0.5-0.433=0.067$입니다. $0.067$이 $0.0667$과 거의 같으므로 $z\approx1.5$를 선택합니다. 따라서 $(x-76)/8\approx1.5$, $x\approx76+12=88$점입니다. ④가 정답입니다. (등수는 정수이고 정규분포는 연속모형이므로 근삿값을 구하는 문제입니다.)
- **독립 수학 검산·판정 근거:** 상위 30/450≈.0667, z≈1.5이므로 76+8·1.5=88 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q5-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
30등은 점수가 높은 쪽에서 약 30명이므로 상위 비율은 $\frac{30}{450}=1/15\approx0.0667$입니다. 즉 구하는 점수 $x$보다 높은 비율이 약 $0.0667$이어야 합니다. 표준화 $Z=\frac{X-76}{8}$을 하면 표의 $P(0\le Z\le1.5)=0.433$에서 오른쪽 꼬리 확률은 $0.5-0.433=0.067$입니다. $0.067$이 $0.0667$과 거의 같으므로 $z\approx1.5$를 선택합니다. 따라서 $(x-76)/8\approx1.5$, $x\approx76+12=88$점입니다. ④가 정답입니다. (등수는 정수이고 정규분포는 연속모형이므로 근삿값을 구하는 문제입니다.)
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q06 — KEEP

- qid/source ordinal: `6`/6; sourceQid: `q06`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
6. 어느 자격증의 필기시험에 1000명이 응시하였다. 시험 응시자의 점수분포는 평균 44점, 표준편차 20점인 정규분포를 따른다고 한다. 이 시험에서 60점 이상인 응시자는 필기시험 합격이라고 할 때, 필기시험 합격자는 약 몇 명인가? [4.5점]<br><table style="border-collapse:collapse;margin:8px 0" aria-label="원본 시험지 표"><tr><th style="border:1px solid #444;padding:3px 9px;text-align:center">$z$</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">$P(0 \le Z \le z)$</th></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.1915</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.6</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.2257</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.7</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.2580</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.8</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.2881</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.9</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.3159</td></tr></table>
~~~

- 원본 선택지: ① 약 180명 / ② 약 210명 / ③ 약 240명 / ④ 약 270명 / ⑤ 약 300명
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 60점의 표준점수는 $z=\frac{60-44}{20}=\frac{16}{20}=0.8$입니다. 평균 44점보다 높은 점수이므로 표준정규분포의 오른쪽 꼬리 $P(Z\ge0.8)$을 구해야 합니다. 표가 주는 $P(0\le Z\le0.8)=0.2881$은 평균에서 0.8까지의 면적입니다. 전체 오른쪽 절반의 넓이 $0.5$에서 이를 빼면 $P(Z\ge0.8)=0.5-0.2881=0.2119$입니다. 따라서 예상 합격 인원은 $1000\times0.2119=211.9$, 약 210명입니다. 정답은 ②입니다.
- **독립 수학 검산·판정 근거:** Z=(60−44)/20=.8, P합격=.2119, 약212명≈210명 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q6-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
60점의 표준점수는 $z=\frac{60-44}{20}=\frac{16}{20}=0.8$입니다. 평균 44점보다 높은 점수이므로 표준정규분포의 오른쪽 꼬리 $P(Z\ge0.8)$을 구해야 합니다. 표가 주는 $P(0\le Z\le0.8)=0.2881$은 평균에서 0.8까지의 면적입니다. 전체 오른쪽 절반의 넓이 $0.5$에서 이를 빼면 $P(Z\ge0.8)=0.5-0.2881=0.2119$입니다. 따라서 예상 합격 인원은 $1000\times0.2119=211.9$, 약 210명입니다. 정답은 ②입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q07 — KEEP

- qid/source ordinal: `7`/7; sourceQid: `q07`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
7. 확률변수 $X$의 확률분포는 아래와 같고 확률변수 $Y=aX+b$에 대하여 확률변수 $Y$의 평균과 분산이 각각 25, 100일 때, $a+b$의 값을 구하시오. (단, $a>0$이다.) [4.5점]<br><table style="border-collapse:collapse;margin:8px 0" aria-label="원본 시험지 표"><tr><th style="border:1px solid #444;padding:3px 9px;text-align:center">$X$</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">0</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">1</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">2</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">3</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">계</th></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">$P(X)$</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">$\frac{1}{10}$</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">$\frac{2}{10}$</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">$\frac{3}{10}$</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">$\frac{4}{10}$</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">1</td></tr></table>
~~~

- 원본 선택지: ① $5$ / ② $15$ / ③ $25$ / ④ $35$ / ⑤ $45$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 원본 확률분포표에서 $P(X=0,1,2,3)=(1,2,3,4)/10$입니다. 먼저 $E(X)=0\cdot\frac1{10}+1\cdot\frac2{10}+2\cdot\frac3{10}+3\cdot\frac4{10}=2$입니다. $E(X^2)=0^2\cdot\frac1{10}+1^2\cdot\frac2{10}+2^2\cdot\frac3{10}+3^2\cdot\frac4{10}=5$이므로 $V(X)=5-2^2=1$입니다. $Y=aX+b$에 대하여 $V(Y)=a^2V(X)=100$이므로 $a^2=100$입니다. 원문에 $a>0$이 있으므로 $a=10$입니다. 또 $E(Y)=aE(X)+b=20+b=25$에서 $b=5$입니다. 따라서 $a+b=15$, 정답은 ②입니다.
- **독립 수학 검산·판정 근거:** E(X)=2,V(X)=1, a=10,b=5,a+b=15 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
원본 확률분포표에서 $P(X=0,1,2,3)=(1,2,3,4)/10$입니다. 먼저 $E(X)=0\cdot\frac1{10}+1\cdot\frac2{10}+2\cdot\frac3{10}+3\cdot\frac4{10}=2$입니다. $E(X^2)=0^2\cdot\frac1{10}+1^2\cdot\frac2{10}+2^2\cdot\frac3{10}+3^2\cdot\frac4{10}=5$이므로 $V(X)=5-2^2=1$입니다. $Y=aX+b$에 대하여 $V(Y)=a^2V(X)=100$이므로 $a^2=100$입니다. 원문에 $a>0$이 있으므로 $a=10$입니다. 또 $E(Y)=aE(X)+b=20+b=25$에서 $b=5$입니다. 따라서 $a+b=15$, 정답은 ②입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q08 — UPGRADE / SOURCE_FIDELITY_HOLD

- qid/source ordinal: `8`/8; sourceQid: `q08`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 통계적 추정.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
8. 표준편차가 $\sigma$인 정규분포를 따르는 어느 모집단에서 크기가 $n$인 표본을 뽑아 모평균을 신뢰도 95%로 추정하였더니 신뢰구간의 길이가 $l$이었다. 크기가 $64n$인 표본을 뽑아 모평균을 신뢰도 99%로 추정할 때, 신뢰구간의 길이를 구하시오. (단, $P(|Z| \le 2)=0.95, P(|Z| \le 3)=0.99$) [4.3점]
~~~

- 원본 선택지: ① $\frac{1}{8}l$ / ② $\frac{3}{16}l$ / ③ $\frac{1}{4}l$ / ④ $\frac{5}{16}l$ / ⑤ $\frac{3}{8}l$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 모평균의 신뢰구간 길이는 $L=2z\sigma/\sqrt n$입니다. 처음 길이는 $l=2\cdot2\sigma/\sqrt n=4\sigma/\sqrt n$입니다. 새 표본크기는 $64n$이므로 $\sqrt{64n}=8\sqrt n$이고, 신뢰도 99%의 임계값은 3입니다. 따라서 새 길이는 $L'=2\cdot3\sigma/(8\sqrt n)=3\sigma/(4\sqrt n)$입니다. 원래 $l=4\sigma/\sqrt n$와 비교하면 $L'/l=(\frac{3}{4})/4=\frac{3}{16}$이므로 $L'=3l/16$입니다. 표본이 커지는 효과 $\frac{1}{8}$과 임계값 증가 효과 $\frac{3}{2}$를 곱해도 $\frac{3}{16}$입니다. 정답은 ②입
- **독립 수학 검산·판정 근거:** UPGRADE: 95%에 z=2, 99%에 z=3인 주어진 꼬리표기는 표준정규분포의 실제 확률과 큰 차이. 학교식 가상 근사로는 3l/16이나 실제 95/99%에서는 약(2.576/1.96)l/8≈0.1643l.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
모평균의 신뢰구간 길이는 $L=2z\sigma/\sqrt n$입니다. 처음 길이는 $l=2\cdot2\sigma/\sqrt n=4\sigma/\sqrt n$입니다. 새 표본크기는 $64n$이므로 $\sqrt{64n}=8\sqrt n$이고, 신뢰도 99%의 임계값은 3입니다. 따라서 새 길이는 $L'=2\cdot3\sigma/(8\sqrt n)=3\sigma/(4\sqrt n)$입니다. 원래 $l=4\sigma/\sqrt n$와 비교하면 $L'/l=(\frac{3}{4})/4=\frac{3}{16}$이므로 $L'=3l/16$입니다. 표본이 커지는 효과 $\frac{1}{8}$과 임계값 증가 효과 $\frac{3}{2}$를 곱해도 $\frac{3}{16}$입니다. 정답은 ②입니다.
~~~

#### UPGRADE — 원본 분리 수정 제안(출고 미적용)

- **오류 및 왜 중요한가:** `P(|Z|≤2)=.95`, `P(|Z|≤3)=.99`는 실제 각각 약 .9545, .9973임. 특히 99%의 z≈2.58을 3으로 놓아 신뢰구간 비율을 크게 왜곡.
- **원문/선택지 수정안:** 근사 임계값을 95%의 1.96, 99%의 2.58로 수정하고, ② 보기 `$\frac{3}{16}l$`를 `$0.165l$`로 대체해 소수 셋째 자리 반올림으로 묻는다.
- **교정된 학생용 완전 풀이:**

동일 σ인 모집단의 신뢰구간 길이는 L=2zσ/√n. 따라서 새 구간과 원래 구간의 비는 (2.58/1.96)×√(n/(64n))=2.58/(1.96×8)=0.1645408…≈0.165이다. 따라서 수정 ②가 맞다. 원본 3l/16은 99% 신뢰도를 3σ라 잘못 지정한 근삿값이다.

- 수정 후 정답: **② (0.165l)**.
- 판정: **원본 z표/보기 수정 전 SOURCE_FIDELITY_HOLD**. 원본 JS·보기·원답·SVG는 건드리지 않음.

- 문항 상태: **UPGRADE | READ_EVIDENCED | SOURCE_FIDELITY_HOLD | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q09 — KEEP

- qid/source ordinal: `9`/9; sourceQid: `q09`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
9. 안경 낀 학생의 비율이 25%인 복성고등학교에서 300명을 뽑을 때, 안경 낀 학생이 60명 이하일 확률을 구하시오. (단, 정규근사에서 연속성 보정은 하지 않는다.) [4.5점]<br><table style="border-collapse:collapse;margin:8px 0" aria-label="원본 시험지 표"><tr><th style="border:1px solid #444;padding:3px 9px;text-align:center">$z$</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">$P(0 \le Z \le z)$</th></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.1915</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.3413</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.4332</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">2.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.4772</td></tr></table>
~~~

- 원본 선택지: ① $0.3085$ / ② $0.1587$ / ③ $0.0668$ / ④ $0.0228$ / ⑤ $0.0062$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 안경 낀 학생 수를 $X$라 하면, 각 학생의 안경 착용 여부를 확률 $0.25$인 독립 베르누이 시행으로 모델링할 때 $X\sim B(300,0.25)$입니다. $np=75$, $n(1-p)=225$이므로 정규근사를 적용할 수 있습니다. 평균은 $\mu=np=75$, 표준편차는 $\sigma=\sqrt{np(1-p)}=\sqrt{56.25}=7.5$입니다. 문제 조건대로 연속성 보정 없이 표준화하면 $P(X\le60)\approx P(Z\le(60-75)/7.5)=P(Z\le-2)$입니다. 정규분포의 대칭성으로 $P(Z\le-2)=0.5-P(0\le Z\le2)=0.5-0.4772=0.0228$입니다. 따라서 ④입니다. 연속성 보정을 쓰면 다른 근삿값이 나오므로 이 답은
- **독립 수학 검산·판정 근거:** B(300,.25), 평균75·표준편차7.5; 무보정 z=−2, 0.0228 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q9-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
안경 낀 학생 수를 $X$라 하면, 각 학생의 안경 착용 여부를 확률 $0.25$인 독립 베르누이 시행으로 모델링할 때 $X\sim B(300,0.25)$입니다. $np=75$, $n(1-p)=225$이므로 정규근사를 적용할 수 있습니다. 평균은 $\mu=np=75$, 표준편차는 $\sigma=\sqrt{np(1-p)}=\sqrt{56.25}=7.5$입니다.<br>문제 조건대로 연속성 보정 없이 표준화하면 $P(X\le60)\approx P(Z\le(60-75)/7.5)=P(Z\le-2)$입니다. 정규분포의 대칭성으로 $P(Z\le-2)=0.5-P(0\le Z\le2)=0.5-0.4772=0.0228$입니다. 따라서 ④입니다. 연속성 보정을 쓰면 다른 근삿값이 나오므로 이 답은 원문 표·보기의 무보정 근사에 해당합니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q10 — KEEP

- qid/source ordinal: `10`/10; sourceQid: `q10`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
10. 두 명의 사격 선수 주봉과 양현이 10점인 표적을 맞힐 확률이 각각 0.85, 0.92이다. 주봉, 양현 두 선수가 표적을 향해 각각 한 발씩 쏠 때, 두 명 중 한 명만 10점인 표적을 맞힐 확률을 구하시오. (단, 두 선수의 명중 여부는 서로 독립이다.) [4.3점]
~~~

- 원본 선택지: ① $0.206$ / ② $0.248$ / ③ $0.290$ / ④ $0.332$ / ⑤ $0.374$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 문제 조건에서 두 선수의 명중 여부는 서로 독립이므로 계산합니다. '한 명만 성공'은 다음 두 경우뿐이고 두 경우는 동시에 일어날 수 없습니다. ① 주봉만 10점: $0.85\times(1-0.92)=0.85\times0.08=0.068$. ② 양현만 10점: $(1-0.85)\times0.92=0.15\times0.92=0.138$. 따라서 $P(\text{정확히 한 명})=0.068+0.138=0.206$이므로 ①입니다. 둘 다 성공하거나 둘 다 실패한 경우는 '한 명만'에 포함되지 않습니다.
- **독립 수학 검산·판정 근거:** 독립인 두 사수 중 정확히 한 명만 성공 .85·.08+.15·.92=.206 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q10-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
문제 조건에서 두 선수의 명중 여부는 서로 독립이므로 계산합니다. '한 명만 성공'은 다음 두 경우뿐이고 두 경우는 동시에 일어날 수 없습니다.<br>① 주봉만 10점: $0.85\times(1-0.92)=0.85\times0.08=0.068$.<br>② 양현만 10점: $(1-0.85)\times0.92=0.15\times0.92=0.138$.<br>따라서 $P(\text{정확히 한 명})=0.068+0.138=0.206$이므로 ①입니다. 둘 다 성공하거나 둘 다 실패한 경우는 '한 명만'에 포함되지 않습니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q11 — KEEP

- qid/source ordinal: `11`/11; sourceQid: `q11`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
11. 흰 공 $n$개와 빨간 공 3개가 들어 있는 주머니에서 한 개씩 2개의 공을 꺼낼 때, 첫 번째는 흰 공, 두 번째는 빨간 공이 나올 확률이 $\frac{1}{4}$이다. 이때 모든 $n$의 값의 합을 구하시오. (단, 꺼낸 공은 다시 넣지 않는다.) [4점]
~~~

- 원본 선택지: ① $4$ / ② $5$ / ③ $6$ / ④ $7$ / ⑤ $8$
- 원본 정답: **④**
- 기존 solution 정확 발췌: > 복원하지 않고 뽑으므로 처음 흰 공이 나올 확률은 $\frac{n}{(n+3)}$이고, 그 뒤 빨간 공이 나올 조건부확률은 $\frac{3}{(n+2)}$입니다. 따라서 $\dfrac{n}{n+3}\cdot\dfrac3{n+2}=\dfrac14$입니다. 정리하면 $12n=(n+3)(n+2)=n^2+5n+6$, 즉 $n^2-7n+6=(n-1)(n-6)=0$입니다. 가능한 자연수 $n$은 1과 6이므로 합은 7입니다. 정답은 ④입니다.
- **독립 수학 검산·판정 근거:** 흰공 n, 빨간3: 3n/((n+3)(n+2))=1/4, n=1 또는6, 합7 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
복원하지 않고 뽑으므로 처음 흰 공이 나올 확률은 $\frac{n}{(n+3)}$이고, 그 뒤 빨간 공이 나올 조건부확률은 $\frac{3}{(n+2)}$입니다. 따라서 $\dfrac{n}{n+3}\cdot\dfrac3{n+2}=\dfrac14$입니다. 정리하면 $12n=(n+3)(n+2)=n^2+5n+6$, 즉 $n^2-7n+6=(n-1)(n-6)=0$입니다. 가능한 자연수 $n$은 1과 6이므로 합은 7입니다. 정답은 ④입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q12 — KEEP

- qid/source ordinal: `12`/12; sourceQid: `q12`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
12. 주머니 속에 흰 공과 검은 공을 합쳐서 10개가 들어 있다. 이 중에서 동시에 2개를 꺼낼 때 적어도 1개가 흰 공일 확률이 $\frac{8}{15}$이다. 이때 흰 공의 개수를 구하시오. [3.9점]
~~~

- 원본 선택지: ① $3$ / ② $4$ / ③ $5$ / ④ $6$ / ⑤ $7$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 흰 공을 $w$개라 하면 검은 공은 $10-w$개입니다. 적어도 흰 공 하나를 뽑을 확률은 $1-P(\text{검은 공만 2개})$이므로 $1-\dfrac{\binom{10-w}{2}}{\binom{10}{2}}=\frac{8}{15}$입니다. 따라서 $\binom{10-w}{2}=45\times7/15=21$입니다. $\binom72=21$이므로 검은 공은 7개, 흰 공은 $10-7=3$개입니다. 정답은 ①입니다.
- **독립 수학 검산·판정 근거:** P(흰공≥1)=8/15 => 검은공7, 흰공3 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
흰 공을 $w$개라 하면 검은 공은 $10-w$개입니다. 적어도 흰 공 하나를 뽑을 확률은 $1-P(\text{검은 공만 2개})$이므로 $1-\dfrac{\binom{10-w}{2}}{\binom{10}{2}}=\frac{8}{15}$입니다. 따라서 $\binom{10-w}{2}=45\times7/15=21$입니다. $\binom72=21$이므로 검은 공은 7개, 흰 공은 $10-7=3$개입니다. 정답은 ①입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q13 — KEEP

- qid/source ordinal: `13`/13; sourceQid: `q13`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
13. 아래 그림과 같은 정십각형의 세 꼭짓점을 연결하여 삼각형을 만들 때, 이 삼각형이 직각삼각형이 될 확률을 구하시오. [4.5점]
~~~

- 원본 선택지: ① $\frac{1}{4}$ / ② $\frac{7}{24}$ / ③ $\frac{1}{3}$ / ④ $\frac{3}{8}$ / ⑤ $\frac{5}{12}$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 정십각형의 모든 꼭짓점은 같은 원 위에 있습니다. 원에 내접하는 삼각형에서 한 변이 지름이면 그 변을 바라보는 원주각은 $90^\circ$입니다. 반대로 직각삼각형의 빗변은 외접원의 지름이므로, 직각삼각형을 세는 일은 '지름 한 개와 나머지 꼭짓점 한 개'를 고르는 일과 같습니다. 정십각형의 서로 마주 보는 꼭짓점 쌍은 5개이므로 지름은 5개입니다. 지름의 두 끝점을 정한 뒤 세 번째 꼭짓점은 나머지 8개 중 하나입니다. 따라서 직각삼각형은 $5\times8=40$개입니다. 한 직각삼각형의 빗변은 하나뿐이므로 이 방법으로 같은 삼각형을 두 번 세지 않습니다. 전체 삼각형은 $\binom{10}{3}=120$개이고 확률은 $\frac{40}{120}=\frac{1}{3}$입
- **독립 수학 검산·판정 근거:** 육안 확인한 정십각형 그림: 마주 보는 꼭짓점 쌍5, 직각삼각형40/전체120=1/3 일치.
- 원본문제 PNG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q13.png` (원본 실물 육안 확인; 실제 저장 루트 `assets/images/`).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q13-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
정십각형의 모든 꼭짓점은 같은 원 위에 있습니다. 원에 내접하는 삼각형에서 한 변이 지름이면 그 변을 바라보는 원주각은 $90^\circ$입니다. 반대로 직각삼각형의 빗변은 외접원의 지름이므로, 직각삼각형을 세는 일은 '지름 한 개와 나머지 꼭짓점 한 개'를 고르는 일과 같습니다.<br>정십각형의 서로 마주 보는 꼭짓점 쌍은 5개이므로 지름은 5개입니다. 지름의 두 끝점을 정한 뒤 세 번째 꼭짓점은 나머지 8개 중 하나입니다. 따라서 직각삼각형은 $5\times8=40$개입니다. 한 직각삼각형의 빗변은 하나뿐이므로 이 방법으로 같은 삼각형을 두 번 세지 않습니다.<br>전체 삼각형은 $\binom{10}{3}=120$개이고 확률은 $\frac{40}{120}=\frac{1}{3}$입니다. 정답은 ③입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q14 — KEEP

- qid/source ordinal: `14`/14; sourceQid: `q14`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 이항정리.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
14. 다음 $\left(2x - \frac{1}{y}\right)^6$의 전개식에서 $\frac{x^2}{y^4}$의 계수를 구하시오. [5점]
~~~

- 원본 선택지: ① $24$ / ② $36$ / ③ $40$ / ④ $54$ / ⑤ $60$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 이항정리의 일반항은 $\binom6r(2x)^{6-r}(-\frac{1}{y})^r$입니다. $x^2/y^4$가 나오려면 $6-r=2$, $r=4$여야 합니다. 해당 항은 $\binom64(2x)^2(-\frac{1}{y})^4=15\cdot4\cdot x^2/y^4=60x^2/y^4$입니다. 따라서 계수는 60이고 정답은 ⑤입니다.
- **독립 수학 검산·판정 근거:** (2x−1/y)^6 중 x²/y⁴ 항은 r=4, 계수 C(6,4)·4=60 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
이항정리의 일반항은 $\binom6r(2x)^{6-r}(-\frac{1}{y})^r$입니다. $x^2/y^4$가 나오려면 $6-r=2$, $r=4$여야 합니다. 해당 항은 $\binom64(2x)^2(-\frac{1}{y})^4=15\cdot4\cdot x^2/y^4=60x^2/y^4$입니다. 따라서 계수는 60이고 정답은 ⑤입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q15 — KEEP

- qid/source ordinal: `15`/15; sourceQid: `q15`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 경우의 수.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
15. 집합 $X=\{1, 2, 3, 4, 5\}$에 대하여 $X$에서 $X$로의 함수 $f$가 다음 조건을 만족시킬 때, 함수 $f$의 개수를 구하시오. [5점]
<br><br>&lt;조건&gt;<br>(가) $f(1) \le f(3) \le f(5)$<br>(나) $f(2) > f(4)$
~~~

- 원본 선택지: ① $295$ / ② $300$ / ③ $315$ / ④ $325$ / ⑤ $350$
- 원본 정답: **⑤**
- 기존 solution 정확 발췌: > 함수는 다섯 입력 $1,2,3,4,5$의 함숫값을 모두 정하면 하나로 결정됩니다. 조건 (가)는 $f(1),f(3),f(5)$가 $1$부터 $5$ 사이에서 같아도 되는 비내림차순 세 수라는 뜻입니다. 각 값이 몇 번 나타나는지 세는 중복조합이므로 $\binom{5+3-1}{3}=\binom73=35$가지입니다. 조건 (나)는 $f(2)>f(4)$이므로 두 함숫값은 달라야 합니다. $1$부터 $5$에서 서로 다른 두 값을 고르면 큰 값을 반드시 $f(2)$에, 작은 값을 $f(4)$에 배치해야 하므로 $\binom52=10$가지입니다. 두 조건은 서로 다른 입력 위치에만 걸려 있어 서로를 제한하지 않습니다. 따라서 곱의 법칙으로 $35\times10=350$개의 함수가 생깁
- **독립 수학 검산·판정 근거:** f(1),f(3),f(5) 비내림차순35가지와 f(2)>f(4) 10가지, 전체350 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
함수는 다섯 입력 $1,2,3,4,5$의 함숫값을 모두 정하면 하나로 결정됩니다. 조건 (가)는 $f(1),f(3),f(5)$가 $1$부터 $5$ 사이에서 같아도 되는 비내림차순 세 수라는 뜻입니다. 각 값이 몇 번 나타나는지 세는 중복조합이므로 $\binom{5+3-1}{3}=\binom73=35$가지입니다.<br>조건 (나)는 $f(2)>f(4)$이므로 두 함숫값은 달라야 합니다. $1$부터 $5$에서 서로 다른 두 값을 고르면 큰 값을 반드시 $f(2)$에, 작은 값을 $f(4)$에 배치해야 하므로 $\binom52=10$가지입니다.<br>두 조건은 서로 다른 입력 위치에만 걸려 있어 서로를 제한하지 않습니다. 따라서 곱의 법칙으로 $35\times10=350$개의 함수가 생깁니다. 정답은 ⑤입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q16 — KEEP

- qid/source ordinal: `16`/16; sourceQid: `q16`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 경우의 수.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
16. 8명의 가족이 다음과 같은 직사각형 모양의 식탁에 앉아서 식사를 하려고 한다. 의자에 앉을 수 있는 방법의 수를 구하시오. (단, 식탁을 반 바퀴 돌려 겹치는 자리는 같은 배치로 센다.) [5점]
~~~

- 원본 선택지: ① $8!$ / ② $7! \times 4$ / ③ $7! \times 3$ / ④ $7! \times 2$ / ⑤ $7!$
- 원본 정답: **②**
- 기존 solution 정확 발췌: > 그림에는 긴 변에 3개씩, 양쪽 짧은 변에 1개씩 총 8개의 의자가 있습니다. 모든 자리를 고정된 서로 다른 위치로 세면 $8!$가지입니다. 이 문제에서는 식탁을 $180^\circ$ 돌려 같은 자리 배치가 되는 경우를 동일하게 세는 방식으로 계산합니다. 이때 $90^\circ$ 회전은 의자 배치가 일치하지 않고, $180^\circ$ 회전은 일치하므로 각 배치를 정확히 2번씩 세었습니다. 따라서 $8!/2=4\times7!$가지로 ②입니다.
- **독립 수학 검산·판정 근거:** 육안 확인한 양 긴변3개·단변1개 식탁: 180도 동일시로 8!/2=4·7! 일치.
- 원본문제 PNG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q16.png` (원본 실물 육안 확인; 실제 저장 루트 `assets/images/`).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q16-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
그림에는 긴 변에 3개씩, 양쪽 짧은 변에 1개씩 총 8개의 의자가 있습니다. 모든 자리를 고정된 서로 다른 위치로 세면 $8!$가지입니다. 이 문제에서는 식탁을 $180^\circ$ 돌려 같은 자리 배치가 되는 경우를 동일하게 세는 방식으로 계산합니다. 이때 $90^\circ$ 회전은 의자 배치가 일치하지 않고, $180^\circ$ 회전은 일치하므로 각 배치를 정확히 2번씩 세었습니다. 따라서 $8!/2=4\times7!$가지로 ②입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q17 — KEEP

- qid/source ordinal: `17`/17; sourceQid: `q17`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 이항정리.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
17. 다음 $\log_6 ({}_{30}\mathrm{C}_0 + 5\,{}_{30}\mathrm{C}_1 + 5^2\,{}_{30}\mathrm{C}_2 + \cdots + 5^{30}\,{}_{30}\mathrm{C}_{30})$의 값을 구하시오. [5점]
~~~

- 원본 선택지: ① $10$ / ② $20$ / ③ $30$ / ④ $40$ / ⑤ $50$
- 원본 정답: **③**
- 기존 solution 정확 발췌: > 이항정리 $(a+b)^n=\sum_{r=0}^{n}\binom nr a^{n-r}b^r$을 이용합니다. 주어진 합은 $\sum_{r=0}^{30}\binom{30}r5^r=(1+5)^{30}=6^{30}$입니다. 따라서 $\log_6(6^{30})=30$이고 정답은 ③입니다.
- **독립 수학 검산·판정 근거:** 이항합 ΣC(30,r)5^r=6³⁰, log₆=30 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: 없음.
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
이항정리 $(a+b)^n=\sum_{r=0}^{n}\binom nr a^{n-r}b^r$을 이용합니다. 주어진 합은 $\sum_{r=0}^{30}\binom{30}r5^r=(1+5)^{30}=6^{30}$입니다. 따라서 $\log_6(6^{30})=30$이고 정답은 ③입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q18 — KEEP

- qid/source ordinal: `18`/18; sourceQid: `q18`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
18. A 주머니에 흰 공 2개, 검은 공 5개 그리고 B 주머니에 흰 공 3개, 검은 공 4개가 들어 있다. A 주머니에서 공을 한 개 임의로 꺼내 B 주머니에 넣은 뒤, B 주머니에서 공을 하나 꺼낸다. B에서 꺼낸 공이 흰 공일 때, A에서 B로 옮겨진 공이 흰 공이었을 확률을 $\frac{a}{b}$라 할 때 $a+b$의 값을 구하시오. (단 $a, b$는 서로소이다.) [5점]
~~~

- 원본 선택지: ① $31$ / ② $29$ / ③ $27$ / ④ $25$ / ⑤ $23$
- 원본 정답: **①**
- 기존 solution 정확 발췌: > 문제 조건대로 A에서 꺼낸 공을 B에 옮긴 뒤 B에서 공을 하나 꺼내는 경우로 계산합니다. $W$를 '옮긴 공이 흰 공', $H$를 'B에서 흰 공을 꺼냄'이라고 둡니다. ① 흰 공을 옮길 확률은 $P(W)=\frac{2}{7}$이고, 이때 B에는 흰 공이 4개·전체가 8개이므로 $P(H\mid W)=\frac{4}{8}$입니다. 두 사건이 함께 일어날 확률은 $P(W\cap H)=(\frac{2}{7})(\frac{4}{8})=\frac{8}{56}$입니다. ② 검은 공을 옮길 확률은 $\frac{5}{7}$이고, 이때 B에는 흰 공이 3개·전체가 8개이므로 $P(W^c\cap H)=(\frac{5}{7})(\frac{3}{8})=\frac{15}{56}$입니다. 따라서
- **독립 수학 검산·판정 근거:** 베이즈 P(흰색 이동|B흰색)=8/(8+15)=8/23, a+b31 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q18-solution-v2.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
문제 조건대로 A에서 꺼낸 공을 B에 옮긴 뒤 B에서 공을 하나 꺼내는 경우로 계산합니다. $W$를 '옮긴 공이 흰 공', $H$를 'B에서 흰 공을 꺼냄'이라고 둡니다.<br>① 흰 공을 옮길 확률은 $P(W)=\frac{2}{7}$이고, 이때 B에는 흰 공이 4개·전체가 8개이므로 $P(H\mid W)=\frac{4}{8}$입니다. 두 사건이 함께 일어날 확률은 $P(W\cap H)=(\frac{2}{7})(\frac{4}{8})=\frac{8}{56}$입니다.<br>② 검은 공을 옮길 확률은 $\frac{5}{7}$이고, 이때 B에는 흰 공이 3개·전체가 8개이므로 $P(W^c\cap H)=(\frac{5}{7})(\frac{3}{8})=\frac{15}{56}$입니다.<br>따라서 $P(H)=\frac{8}{56}+\frac{15}{56}=\frac{23}{56}$입니다. 'B에서 흰 공이 나왔다'는 조건 아래에서 흰 공을 옮겼을 확률은 $P(W\mid H)=P(W\cap H)/P(H)=(\frac{8}{56})/(\frac{23}{56})=\frac{8}{23}$입니다. $a+b=8+23=31$이므로 ①입니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q19 — KEEP

- qid/source ordinal: `19`/19; sourceQid: `q19`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률분포.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
[서술형 1] 주봉전자는 전구의 60%를 A 공장에서, 40%를 B 공장에서 생산하여 판매한다고 한다. 어떤 대리점에서 주봉전자 제품의 전구를 임의로 150개 구매하였을 때, A 공장에서 생산된 전구가 102개 이상일 확률을 표준정규분포표를 이용하여 구하시오. (단, 정규근사에서 연속성 보정은 하지 않는다.) [10점]<br><table style="border-collapse:collapse;margin:8px 0" aria-label="원본 시험지 표"><tr><th style="border:1px solid #444;padding:3px 9px;text-align:center">$z$</th><th style="border:1px solid #444;padding:3px 9px;text-align:center">$P(0 \le Z \le z)$</th></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.1915</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.3413</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">1.5</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.4332</td></tr><tr><td style="border:1px solid #444;padding:3px 9px;text-align:center">2.0</td><td style="border:1px solid #444;padding:3px 9px;text-align:center">0.4772</td></tr></table>
~~~

- 원본 선택지: 서술형 — 없음
- 원본 정답: **0.0228**
- 기존 solution 정확 발췌: > A 공장 제품의 개수를 $X$라 하면, 각 제품의 출처를 확률 $0.6$인 독립 시행으로 모델링할 때 $X\sim B(150,0.6)$입니다. 평균 $\mu=np=150\times0.6=90$, 분산 $np(1-p)=150\times0.6\times0.4=36$, 표준편차 $\sigma=6$입니다. $np=90$, $n(1-p)=60$으로 정규근사를 적용할 수 있습니다. 문제 조건에서 연속성 보정을 하지 않으므로 $P(X\ge102)\approx P(Z\ge(102-90)/6)=P(Z\ge2)$입니다. 표가 주는 $P(0\le Z\le2)=0.4772$는 평균에서 $z=2$까지의 면적이므로, 오른쪽 꼬리는 $0.5-0.4772=0.0228$입니다. 따라서 근삿값은 $0.0
- **독립 수학 검산·판정 근거:** B(150,.6), μ90 σ6, 무보정 z=2, 꼬리 .0228 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q19-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
A 공장 제품의 개수를 $X$라 하면, 각 제품의 출처를 확률 $0.6$인 독립 시행으로 모델링할 때 $X\sim B(150,0.6)$입니다. 평균 $\mu=np=150\times0.6=90$, 분산 $np(1-p)=150\times0.6\times0.4=36$, 표준편차 $\sigma=6$입니다. $np=90$, $n(1-p)=60$으로 정규근사를 적용할 수 있습니다.<br>문제 조건에서 연속성 보정을 하지 않으므로 $P(X\ge102)\approx P(Z\ge(102-90)/6)=P(Z\ge2)$입니다. 표가 주는 $P(0\le Z\le2)=0.4772$는 평균에서 $z=2$까지의 면적이므로, 오른쪽 꼬리는 $0.5-0.4772=0.0228$입니다. 따라서 근삿값은 $0.0228$입니다. 연속성 보정 $101.5$를 쓰는 근사와는 구분합니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

### Q20 — KEEP

- qid/source ordinal: `20`/20; sourceQid: `q20`; sourceIdentityKey: `NOT_PRESENT`; 원본 blob SHA: `c0305dec222b8629dd74c9712e10283190f3e180`; 단원: 확률.
- 실제 원문 문제·수치·조건 (JS content 정확 보존):

~~~text
[서술형 2] 어떤 야구선수가 상대팀의 투수 김주봉과 대결할 때 안타를 칠 확률은 0.2이고, 투수 조양현과 대결할 때 안타를 칠 확률은 0.25이다. 한 경기에서 이 선수가 투수 김주봉과 2회 대결한 후 투수 조양현과 1회 대결한다면 3회의 대결 중 2회 이상 안타를 칠 확률을 구하시오. (단, 각 타석의 안타 여부는 서로 독립이다.) [10점]
~~~

- 원본 선택지: 서술형 — 없음
- 원본 정답: **0.12**
- 기존 solution 정확 발췌: > 문제 조건에 따라 세 타석의 안타 여부는 서로 독립이므로 김주봉 상대 2회는 각각 성공확률 $0.2$, 조양현 상대 1회는 성공확률 $0.25$로 계산합니다. '2회 이상'은 정확히 2회 또는 3회 안타이며 서로 겹치지 않습니다. ① 김주봉 상대 2안타, 조양현 상대 무안타: $(0.2)^2(1-0.25)=0.04\times0.75=0.03$. ② 김주봉 상대 정확히 1안타, 조양현 상대 안타: 두 김주봉 타석 중 성공하는 타석을 고르는 $\binom21=2$를 곱하여 $2\times0.2\times0.8\times0.25=0.08$. ③ 세 타석 모두 안타: $(0.2)^2\times0.25=0.01$. 따라서 $0.03+0.08+0.01=0.12$입니다. 0회 또는 1
- **독립 수학 검산·판정 근거:** 독립 타석 확률 정확히2회 이상 .03+.08+.01=.12 일치.
- 원본문제 PNG: 별도 외부 원문 PNG 없음(인라인 표는 원문 content에 포함).
- 기존 풀이 SVG: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q20-solution.svg` (경로만 확인; 렌더 **NOT_RUN**).
- 기존 solution **전문** (원문 유지, 변경 없음):

~~~text
문제 조건에 따라 세 타석의 안타 여부는 서로 독립이므로 김주봉 상대 2회는 각각 성공확률 $0.2$, 조양현 상대 1회는 성공확률 $0.25$로 계산합니다. '2회 이상'은 정확히 2회 또는 3회 안타이며 서로 겹치지 않습니다.<br>① 김주봉 상대 2안타, 조양현 상대 무안타: $(0.2)^2(1-0.25)=0.04\times0.75=0.03$.<br>② 김주봉 상대 정확히 1안타, 조양현 상대 안타: 두 김주봉 타석 중 성공하는 타석을 고르는 $\binom21=2$를 곱하여 $2\times0.2\times0.8\times0.25=0.08$.<br>③ 세 타석 모두 안타: $(0.2)^2\times0.25=0.01$.<br>따라서 $0.03+0.08+0.01=0.12$입니다. 0회 또는 1회 안타는 포함되지 않습니다.
~~~

- 문항 상태: **KEEP | READ_EVIDENCED | QA_NOT_RUN**. 원본 content/answer/choices/solution/SVG 미수정.

## 2. 이미지·문항 기초 증적

- 고유 PNG 2개 실제 실물과 원문 문제 조건을 대조했다. Q13: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q13.png` · Q16: `assets/images/22_복성고_2학기_기말_고2_확률과통계/q16.png`.
- 이미지 및 학생풀이 `solutionImage`는 원본 경로를 인용한 것일 뿐, SVG 생성·렌더·Golden·Negative QA PASS를 주장하지 않는다.
- 수학 판정은 원본 JS 정적 본문 및 표·그림 기반; 편집/배포용 PDF 별도 검수 **NOT_RUN**.
- UPGRADE 1건은 문제 정의·표준정규 수치·근사와 정확값의 구분을 포함한 **수정 제안**. 원본 학습문항·정답을 임의 변경하지 않는다.

## 3. 시험지 완료 상태

- **20/20 READ_EVIDENCED; UNREAD=[]; next_qid=NONE; EXAM_AUDIT_COMPLETE.**
- source fidelity, SVG 렌더, Golden/Negative, 인쇄 PDF 대조, 운영출고: **별도 HOLD/NOT_RUN**.
