# 26 금당고 고1 2학기 중간 FORCE_NEW SVG 파일럿

브랜치: `codex/pilot-26-geumdang-h1-force-new-svg`
대상 원문: `archive/exams/original/high/h1/2mid/26_금당고_2학기_중간_고1_기출.js`

이 실행은 원문 문항·최종 해설·동결 `EXPECTED_FACTS`만 입력으로 사용해 후보 SVG를 새로 생성했다. 기존 candidate SVG, 기존 visualSpec, witness, 생산 SVG는 새 후보의 입력이나 참조로 열지 않았다.

## 선택 분모

- 원문 20문항, 문제·해설 source-lock 20/20
- `VISUAL_EXEMPT` 4문항: q2 집합 원소 수, q8 집합 상등, q16 부분집합/나머지류 최대합, q19 부분집합 합산
- `FORCE_NEW` 16문항: q1, q3–q7, q9–q15, q17, q18, q20
- 면제 문항에는 geometry-visual-v1 후보 SVG, visualSpec, witness를 두지 않는다. 향후 logic/table visual 계열 필요성은 별도로 판단한다.

geometry-visual-v1 기본 허용 visual type은 `coordinate_geometry`, `line_circle_geometry`, `function_graph`다. 도형 카드로 표현할 수 있다는 이유만으로 선택하지 않으며, 결정적 공간·그래프 관계가 없거나 `explanation_card`만 가능한 유형은 제외한다. 정책은 `selection-policy.json`에 기록했다.

## 새 시각 설계

- q3 접선 식의 음수 부호를 수학 기호 `−`로 표시
- q6 세 중선과 G(2,1)을 그리고 중점은 M, N, L로 표기
- q7 수직인 두 직선 위의 점 관계를 한국어로 표시
- q11 평행·수직 경우를 분리된 두 좌표 패널로 구성
- q12 OH ⟂ AB, AH=BH=4, OH=3, r=5를 직접 표시
- q14 선은 plotting frame 안에서 자르고 밖으로 연장하지 않음
- q15 고정 현 AB, 중심 C, 수직 지름 방향, 먼 교점 P와 P의 접선을 표시
- q17 넓이비 2:1 → s+t=4/3과 PQ 최소 → s=t를 별도 보조 패널로 구성
- q18 C₀→C₁→C 단계와 거리 √5인 두 직선의 양의 절편 선택을 표시
- q20 중심 궤적 대신 y=|2t−f(t)+10|과 y=5t를 비교하고 3, 8, 12 및 (3,8)∪(8,12), 길이 2인 (10,12) → a=12를 표시

## 검증

최종 산출물 기준으로 모두 16/16 PASS:

- 독립 수학 parity
- 실제 저장 SVG geometry/text parity
- static viewBox 이탈 0, unresolved label 0
- 학생용 한국어 우선 표현 lint
- decisive-step pedagogy gate
- Chrome 실제 DOM bbox: text·geometry viewBox 이탈 0, text overlap 0, 빈 라벨 0, 폰트 로드 완료

검증 결과는 `validation-report.json`, `actual-svg-parity.json`, `student-language-lint.json`, `viewbox-unresolved-labels.json`, `student-language-pedagogy-gate.json`, `actual-browser-bbox.json`에 있다. 모든 후보는 검수 전용이며 production publication authority가 없다. 기존 production SVG 및 골든 결과와의 우열 비교는 수행하지 않았다.
