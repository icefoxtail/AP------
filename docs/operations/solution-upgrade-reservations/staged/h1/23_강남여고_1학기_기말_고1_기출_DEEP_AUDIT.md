# 2023 강남여고 고1 1학기 기말 — 심층 감사 진행 중

- lane30 / original / h1/1final / 2023 / 2015 교육과정 수학(상).
- sourcePath: `archive/exams/original/high/h1/1final/23_강남여고_1학기_기말_고1_기출.js`
- sourceBlobSha: `89d4bacd0ccb07cd4dc0627b07ac2b03d651aee6`.
- 현재 상태: IN_PROGRESS; nextQid=8; 완성 판정 7문항(KEEP 7 / UPGRADE 0 / HOLD 0 / UNREAD: q8 이후).
- 원본 solutionImage SVG의 실물 시각 검증은 아직 NOT_RUN. 그림이 포함된 q1,q3~q7은 이미지 독립 검증 후 최종 판정 재확인 필요.
- EXAM_AUDIT_COMPLETE=NO; EXAM_DRAFT_COMPLETE=NO; Golden/Negative calibration=NOT_RUN; student exam/sol/ans render=NOT_RUN; 출고 PASS 아님.
- 이번 실행은 원격 source와 하네스·템플릿·판서 샘플·core 문서의 접근 및 시작 부분을 확인했으나 core 전체 판독·Golden/Negative 실물 판독은 완료하지 못함. 따라서 완전한 preflight 완료 주장 금지.

## q1 — KEEP (수학 검토 잠정, SVG QA 미실행)
- 원문: 연립부등식 `2x-4>0, -3+x≤1`의 정수해 개수. 보기 1,2,3,4,5. answer ②.
- 기존 solution: `첫 번째 부등식에서 $2x-4>0$이므로 $2x>4$, 따라서 $x>2$이다.` / `두 조건을 동시에 만족하려면 $2<x\\le4$이어야 한다.`
- 검산: 2x−4>0 → x>2; x−3≤1 → x≤4. 교집합 (2,4]의 정수 {3,4} 두 개. 기존 풀이에 두 조건과 경계가 모두 나와 KEEP.
- solutionImage q1-solution.svg NOT_RUN.

## q2 — KEEP
- 원문: A(2,3), B(a,−1)의 거리 5, 양수 a. 보기 1,2,3,4,5. answer ⑤.
- 기존 solution: `$(a-2)^2+(-1-3)^2=5^2$` / `$a=5$ 또는 $a=-1$이다.`
- 검산: (a−2)²+16=25 → (a−2)²=9 → a=5 또는 −1; 양수 조건으로 5. 양수 조건을 실제 적용하여 KEEP.

## q3 — KEEP (SVG QA 미실행)
- 원문: A(−5,2), B(1,5)를 2:1 내분 P, 외분 Q, 거리 PQ. 보기 √5,2√5,3√5,4√5,5√5. answer ④.
- 기존 solution: `$P\\left(\\dfrac{2\\cdot1+1\\cdot(-5)}{3},\\dfrac{2\\cdot5+1\\cdot2}{3}\\right)=(-1,4)$` / `$Q\\left(\\dfrac{2\\cdot1-1\\cdot(-5)}{2-1},\\dfrac{2\\cdot5-1\\cdot2}{2-1}\\right)=(7,8)$`.
- 검산: P=(−1,4), Q=(7,8); PQ=√(8²+4²)=√80=4√5. 내·외분 분모 3과 1을 구별했고 거리 전개도 충분하여 KEEP.
- solutionImage q3-solution-v2.svg NOT_RUN.

## q4 — KEEP (SVG QA 미실행)
- 원문: A(5,2),B(2,4),C(−1,−3) 삼각형 무게중심 G=(a,b)의 a+b. 보기 1,2,3,4,5. answer ③.
- 기존 solution: `$G=\\left(\\dfrac{5+2+(-1)}{3},\\dfrac{2+4+(-3)}{3}\\right)=(2,1)$이다.`
- 검산: x좌표 (5+2−1)/3=2, y좌표 (2+4−3)/3=1, 합3. 두 좌표의 평균을 각각 실제 전개하여 KEEP.
- solutionImage q4-solution.svg NOT_RUN.

## q5 — KEEP (SVG QA 미실행)
- 원문: (5,1)을 지나고 2x+y−3=0에 평행한 직선. 보기 y=−2x+11, y=2x+11, y=−2x−11, y=2x−11, y=3x+5. answer ①.
- 기존 solution: `$y-1=-2(x-5)$이다.` / `정리하면 $y-1=-2x+10$, 따라서 $y=-2x+11$이다.`
- 검산: 기존 직선 y=−2x+3의 기울기 −2; 점 (5,1) 대입해 1=−10+11. 괄호 전개가 실제 나와 KEEP.
- solutionImage q5-solution-v2.svg NOT_RUN.

## q6 — KEEP (SVG QA 미실행)
- 원문: 원점 중심 반지름 r인 원이 3x−y−10=0에 접함. 보기 3,√10,√11,2√3,√13. answer ②.
- 기존 solution: `$\\dfrac{|3\\cdot0-0-10|}{\\sqrt{3^2+(-1)^2}}=\\dfrac{10}{\\sqrt{10}}=\\sqrt{10}$이다.`
- 검산: 원점과 직선 거리 10/√10=√10. 수선의 발 H=(3,−1)도 직선 위(9+1−10=0)이며 OH=√10. 접선 조건 적용 명확하여 KEEP.
- solutionImage q6-solution-v2.svg NOT_RUN.

## q7 — KEEP (SVG QA 미실행)
- 원문: 5x−2y+3=0을 x방향 +2, y방향 a 평행이동, 이동 직선이 (3,2)를 지남. 보기 −5,−4,−3,−2,−1. answer ④.
- 기존 solution: `$5(x-2)-2(y-a)+3=0$이다.` / `$15-4+2a-7=0$에서 $2a+4=0$, 따라서 $a=-2$이다.`
- 검산: 5(x−2)−2(y−a)+3=5x−2y+2a−7=0; (3,2) 대입 15−4+2a−7=0 → a=−2. 좌표 이동의 역치환과 계산이 제시되어 KEEP.
- solutionImage q7-solution-v2.svg NOT_RUN.

## 재개
- q8부터 원본 문항/보기/answer/solution을 실제 읽고 끝 문항까지 전수 판정할 것.
- 모든 원본 SVG/PNG 파일을 실제 fetch·판독하고 관련 KEEP을 다시 확인할 것.
- Golden 2~3개 및 Negative 원문, core 문서 전체, 학생 화면 QA 미실행을 유지할 것.
- 이미 완료한 2025/2024 및 2023 기존 MD를 재작업 건수에 포함하지 말 것.
