# 2024 제일고 고1 1학기 중간 기출 — lane20 심층 감사 (진행 중)

- status: IN_PROGRESS; EXAM_AUDIT_COMPLETE=false; EXAM_DRAFT_COMPLETE=false
- sourcePath: `archive/exams/original/high/h1/1mid/24_제일고_1학기_중간_고1_기출.js`
- sourceRef: main; sourceBlobSha: `df7c23d398d09b377c16c8a888acf64a8392203b`
- source examTitle: `24_제일고_1학기_중간_고1_기출`; standardCourse: `공통수학1`; original/1mid/2024
- denominator: 22; 직접 읽고 문항별 판정 기록 3; KEEP 3 / UPGRADE 0 / HOLD 0 / UNREAD 19
- nextQid: 4; pendingUpgrade: none identified among q1–q3; q4–q22 미감사
- source identity: 원본 파일 경로 + blob SHA + 해당 파일 내 id; 문항 번호만으로 다른 소스와 결속하지 않음
- Golden/Negative/학생 화면 렌더/시각 검증: NOT_RUN. 출고 PASS 아님. JS/SVG/main 미변경.
- 규칙 참고: HARNESS_CURRENT, GLOBAL_QUEUE_CURRENT, DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT 및 docs-manifest core 문서. preflight/해시 receipt 검증 NOT_RUN.

## q1 — KEEP
- 원문: 두 실수 $x,y$에 대하여 $-2+3i=x+(y+5)i$일 때 $x+y$ (단 $i=\\sqrt{-1}$).
- 보기: $-4,-2,0,2,4$; answer: ①.
- 기존 solution 인용: `$x=-2$, $y+5=3$` / `$y=-2$` / `$x+y=-2+(-2)=-4$`.
- 판정: 복소수의 실수부와 허수부를 각각 비교하는 근거가 명시되고, $y+5=3$에서 $y=-2$를 구해 합을 계산하는 식도 있다. 독립 계산 $3-5=-2$, $-2-2=-4$로 정답 ①과 일치한다. 결정적 계산 누락 없음. 이미지 필요 없음.

## q2 — KEEP
- 원문: $x^3+2x^2+x-3$을 $x-1$로 나눈 나머지.
- 보기: $1,2,3,4,5$; answer: ①.
- 기존 solution 인용: `$P(1)=1^3+2\\cdot1^2+1-3$` / `$=1+2+1-3=1$`.
- 판정: 일차식 $x-1$의 근 1을 나머지정리에 대입한다는 설명과 실제 대입·산술 전개가 모두 있다. 독립 계산 $1+2+1-3=1$로 일치한다. 경우 분리 불필요. 이미지 필요 없음.

## q3 — KEEP
- 원문: $x-y=2$, $x^3-y^3=20$일 때 $xy$.
- 보기: $1,2,3,4,5$; answer: ②.
- 기존 solution 인용: `$x^3-y^3=(x-y)^3+3xy(x-y)$` / `$20=2^3+3xy\\cdot2$` / `$20=8+6xy$ $12=6xy$`.
- 판정: 항등식과 대입이 원문에 명시되어 있고 $20-8=12$, $12/6=2$의 일차 계산만 남는다. 독립 검산: $(x-y)^3+3xy(x-y)=8+6(2)=20$. 답 ②와 일치. 이미지 필요 없음.

## 재개
- q4부터 동일 sourceBlobSha를 확인하고 원문 조건·보기·정답·기존 solution을 직접 읽어 판정할 것.
- q4–q22는 UNREAD이며 KEEP으로 간주하지 않는다.
- UPGRADE가 발견되면 해당 문항의 전체 학생용 수식 전개와 별도 독립 검산을 기록할 것.
