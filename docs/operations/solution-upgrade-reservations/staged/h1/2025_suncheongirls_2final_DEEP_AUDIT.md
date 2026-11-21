# 2025 순천여고 공통수학2 2학기 기말 — lane10 심층 감사 (진행 중)

- 원본: `archive/exams/original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js`
- ref: main, blob SHA: `70cb32b708e1a4209b98b4f83ffaf6fddeeeb220`
- sourceDocumentSha256: `5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947`
- standardCourse: 공통수학2; 기출(original), 2025 2final; 21문항
- 공유 claim: `claims/h1/70cb32b708e1a4209b98b4f83ffaf6fddeeeb220.json`, lane10 IN_PROGRESS
- **현재 판정: KEEP 5 / UPGRADE 0 / HOLD 0 / UNREAD 16. nextQid=6. EXAM_AUDIT_COMPLETE 아님.**
- 이 문서는 source 원문을 직접 대조한 Q1~Q5만 판정했다. 후속 Golden/Negative calibration, 이미지 렌더, 운영 JS 출고: NOT_RUN. Q4~Q5 solutionImage는 실제 렌더 미확인(VISUAL_HOLD).
- 하네스 문서 확인: HARNESS_CURRENT `fa258f6ab998c7fd0e2b398956309a43ce967e82`, GLOBAL_QUEUE `259bf732ac9932f832077a506c587cb1401a4f7f`, DEEP_TEMPLATE `eb02a8ed22515b70b0d897949945e40b013eaab6`, manifest `649d90226c8dc8a936f1d41a07e4c51e09acc4e5`; core 문서 파일 접근/해시 확인, calibration 샘플 판독 미완료. preflight 실행 NOT_RUN.

## Q1 — KEEP
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|1`. 문제: 자연수 전체집합에서 `p:x-3>0`의 부정의 진리집합 원소 합. 보기 4,5,6,7,8; 답 ③.
- 원문 solution: `$\\sim p:x\\le3$이다.`, `$1+2+3=6$이다.`
- 판정: 부정 조건을 x≤3으로 옮기고 자연수 1,2,3을 명시해 합 6을 직접 계산한다. 자연수 범위 누락이 없고 추가 전개가 불필요하다. 독립 검산: 1+2+3=6.

## Q2 — KEEP
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|2`. ㄱ 2−√2 무리수, ㄴ (1+2i)(1−2i)=3, ㄷ ∃실수 x: x²−4x+1>5, ㄹ ∀자연수 n: n²+4n+3<0. 보기 ㄱㄴ/ㄴㄹ/ㄷㄹ/ㄴㄷ/ㄱㄷ; 답 ⑤.
- 원문 solution: `$(1+2i)(1-2i)=1+4=5$`, `$x^2-4x+1=25-20+1=6>5$`, `$(n+1)(n+3)>0$`.
- 판정: ㄱ 무리수 성질, ㄴ 켤레복소수 곱, ㄷ x=5의 존재 예시, ㄹ 자연수에서 두 양수 곱으로 반박이 모두 원문에 있다. 독립 검산: (1+2i)(1−2i)=5, x=5일 때 6>5, n≥1이면 (n+1)(n+3)>0.

## Q3 — KEEP
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|3`. 대우 증명 빈칸: ab 홀수 ⇒ a,b 홀수 ⇒ a=2k+1,b=2l+1; 보기 ①짝수 ②홀수 ③2k ④2l+1 ⑤2k²+2l²+2k+2l+1; 잘못된 짝 ③, 답 ③.
- 원문 solution: `$a^2+b^2=(2k+1)^2+(2l+1)^2$`, `$=4k^2+4k+1+4l^2+4l+1$`, `$=2(2k^2+2k+2l^2+2l+1)$`.
- 판정: 제곱 전개부터 2의 배수 인수분해까지 중간 등호가 이미 충분하며, 빈칸 ③이 2k가 아니라 2k+1인 이유도 직접 제시한다. 독립 검산: 홀수 제곱 둘의 합은 짝수.

## Q4 — KEEP (VISUAL_HOLD)
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|4`. p: |x|+|y|=0, q: |x|+|y|=|x+y|, r: x²+2y²−2xy≤0; ㄱ p⇒q, ㄴ q⇒r의 역, ㄷ ~p⇒~r의 대우는 거짓, ㄹ p⇔r. 답 ④.
- 원문 solution: `$Q=\\{(x,y)\\mid xy\\ge0\\}$`, `$r:(x-y)^2+y^2\\le0$`, `$P=R\\subseteq Q$`.
- 판정: p,r은 (0,0)만, q는 xy≥0이므로 ㄱ·ㄴ·ㄹ 참이고 ㄷ 거짓. 제곱합 비음수 논증 및 대우 r⇒p를 기존 풀이가 명시한다. 독립 검산: x²+2y²−2xy=(x−y)²+y²≥0, r이면 x=y=0. solutionImage q4-solution.svg는 원본 경로만 확인, 시각 판독 미실행.

## Q5 — KEEP (VISUAL_HOLD)
- sourceIdentityKey: `sha256:5729d6f3d8cac3c69fbbfa8c2fb27533b51868a4c00b8c3b010b6c30f6c7e947|5`. Q∪R=R, P∩Qᶜ=P, 항상 참인 명제: ①p⇒q ②p⇒~q ③r⇒p ④~r⇒q ⑤~q⇒~r. 답 ②.
- 원문 solution: `$Q\\cup R=R$에서 $Q\\subseteq R$`, `$P\\cap Q^c=P$에서 $P\\subseteq Q^c$`, `$P=\\{a\\}$, $Q=\\{b\\}$, $R=\\{b,c\\}$`.
- 판정: P⊆Qᶜ로 ②를 직접 증명하고 U={a,b,c} 반례로 나머지 네 선택지가 항상 참은 아님을 보인다. 독립 검산: 제시한 P,Q,R은 Q⊆R, P∩Q=∅를 만족한다. solutionImage q5-solution.svg는 원본 경로만 확인, 시각 판독 미실행.

## 재개
Q6~Q21 원문 전체·기존 풀이·보기·답을 차례로 확인하고 판정, UPGRADE 발견 시 학생용 완성 해설과 독립 검산을 이 파일에 기록. Golden/Negative 실제 샘플 판독 및 적용 문서 전문 검증도 완료 전 수행. Q1~Q5의 VISUAL_HOLD는 별도 시각 QA 대상. claim은 IN_PROGRESS 유지.
