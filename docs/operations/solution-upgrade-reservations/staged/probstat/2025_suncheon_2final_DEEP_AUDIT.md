# 2025 순천고 고2 2학기 기말 확률과 통계 — 문항별 심층 감사
- 상태: IN_PROGRESS / NOT_PRODUCTION / REVIEW_REQUIRED
- source: `archive/exams/original/high/h2/2final/25_순천고_2학기_기말_고2_확률과통계.js`
- source blob SHA: `99b9133152e7368ec2032a91a7d17f694d9faf36` (main read)
- standardCourse: `확률과 통계`; sourceIdentityKey: Q1~Q6에 필드 없음(NOT_PRESENT)
- 전체 24문항; 이번 개별 읽기/판정 6문항; KEEP 5 / UPGRADE 0 / HOLD 1 / UNREAD 18
- 이전 staged 진행 장부는 지정 경로에서 404. 다른 이름의 기존 MD 전체 목록은 확인되지 않아 중복 여부는 추가 확인 필요.
- 하네스 branch: `work/solution-upgrade-reservation-harness-20261121`; HARNESS blob `35ec39699e90b4175d06025d5336ee4b9a4204c5`; manifest `6f1c2af723425089aea2810327db21506f3632`; template `eb02a8ed22515b70b0d897949945e40b013eaab6`; board samples `f703929fa816fc4183f28235a355ecd3a1d6ace7`; preflight `2b18c45a7081b0ba2772cb4127bb956142d653ac`.
- 현행 필독 core 문서의 Git blob SHA는 이번에 조회했으나 전체 본문/Golden 2~3 및 Negative 실물 calibration, SHA-256 receipt 검증은 완료하지 못함: EVIDENCE_DEBT / NOT_RUN. 이 감사는 예비이며 EXAM_AUDIT_COMPLETE가 아님.

## Q1 — KEEP (예비)
- 조건: 주사위 90회, 6의 약수인 눈 1,2,3,6; X는 해당 횟수, E(X²) 질문. 원본 답 ④(3620).
- 기존 solution 발췌: `E(X)=np=90\\times\\dfrac{2}{3}=60`; `V(X)=np(1-p)=90\\times\\dfrac{2}{3}\\times\\dfrac{1}{3}=20`; `E(X^2)=V(X)+\\{E(X)\\}^2`.
- 근거: 성공확률 4/6=2/3, 이항분포 평균 60·분산 20을 구한 뒤 분산 정의로 20+3600=3620까지 연결되어 있다. 제곱의 평균과 평균의 제곱을 혼동하지 않게 분산식을 이미 제시한다. 독립 계산 일치. 그림 없음.

## Q2 — KEEP (예비)
- 조건: 서로 다른 동전 두 개를 200회 던짐, 두 앞면의 횟수 X, Y=2X+3의 평균. 원본 답 ③(103).
- 기존 solution 발췌: `p=\\dfrac{1}{2}\\times\\dfrac{1}{2}=\\dfrac{1}{4}`; `E(X)=200\\times\\dfrac{1}{4}=50`; `E(Y)=E(2X+3)=2E(X)+3`.
- 근거: 두 독립 동전의 동시 앞면 확률, 시행 횟수, 기대값 선형성이 순서대로 나와 2×50+3=103이 재현 가능하다. 독립 계산 일치. 그림 없음.

## Q3 — KEEP (예비)
- 조건: 모집단 N(60,3²), n=36, 표본평균 N(a,b²), b>0, ab. 원본 답 ①(30).
- 기존 solution 발췌: `E(\\bar X)=60`; `\\sigma_{\\bar X}=\\dfrac{3}{\\sqrt{36}}=\\dfrac{1}{2}`; `\\bar X\\sim N\\left(60,\\left(\\dfrac{1}{2}\\right)^2\\right)`.
- 근거: 평균 불변과 표준편차의 √n 분모를 모두 적었고, b>0이므로 b=1/2를 선택하여 ab=30. 분산과 표준편차 혼동 없음. 독립 계산 일치. 그림 없음.

## Q4 — HOLD (시각 원본 미검증)
- 조건: 모집단의 확률분포가 문제 그림 표에만 있음; 표본크기 4, 표본평균 분산 질문. 원본 답 ⑤(1/16).
- 기존 solution 발췌: `\\dfrac{1}{8}+a+\\dfrac{1}{8}=1`; `V(X)=(1-2)^2\\times\\dfrac{1}{8}`; `V(\\bar X)=\\dfrac{V(X)}{4}=\\dfrac{1}{16}`.
- 근거: 기존 해설이 가정한 표 (X=1,2,3, 확률 1/8,3/4,1/8)라면 평균 2, 분산 1/4, 표본평균 분산 1/16으로 계산은 맞다. 그러나 원문 분포표는 `assets/images/25_순천고_2학기_기말_고2_확률과통계/q4.png`에만 있고 실제 이미지를 판독하지 못했다. **원본 표 확인 전 KEEP/UPGRADE 금지**. 필요한 후속: 원본 이미지와 해설의 세 확률·값 대조.

## Q5 — KEEP (예비)
- 조건: 모집단 정규분포 σ=5g, n=100, 표본평균 170g, 95% z=1.96. 원본 답 ④(169.02~170.98).
- 기존 solution 발췌: `1.96\\times\\dfrac{5}{10}=0.98`; `170-0.98\\le m\\le170+0.98`.
- 근거: √100=10, 오차한계 0.98, 신뢰구간 양 끝 169.02·170.98을 직접 계산한다. 공식을 사용할 입력이 모두 명시되어 핵심 계산 점프 없음. 독립 계산 일치. 그림 없음.

## Q6 — KEEP (예비)
- 조건: 정규 모집단 σ=3, n=81, 99% z=2.58, 신뢰구간 2.14≤m≤a. 원본 답 ②(3.86).
- 기존 solution 발췌: `e=2.58\\times\\dfrac{3}{\\sqrt{81}}`; `\\bar x=2.14+0.86=3.00`; `a=\\bar x+e=3.00+0.86=3.86`.
- 근거: 표본평균 중심의 대칭 구간이라는 이유가 설명되고 오차한계 0.86을 통해 왼쪽 끝→중심→오른쪽 끝으로 계산한다. 독립 계산 일치. 그림 없음.

## 미완료/재개
- Q7~Q24: UNREAD (원본 JS를 가져왔다는 사실만으로 개별 판정하지 않음).
- UPGRADE 완성 solution: 아직 0건; 후보 0건은 시험지 전체에 대한 결론이 아님.
- 다음 커서: `original / 2final / 2025 / 25_순천고_2학기_기말_고2_확률과통계.js / Q7`; Q4 그림 판독 별도 OPEN.
- Golden/Negative, 학생 화면 렌더, SVG 시각 QA, preflight SHA-256 receipt: NOT_RUN. 운영 JS/SVG 변경 없음.
