# 2025 동산중 중1 2학기 기말 — SVG 전수 시각 재감사

- 원본: `archive/exams/original/middle/m1/2final/25_동산중_2학기_기말_중1_기출.js` (Git blob `b55ef95606474e1065e555553075b380c8276015`)
- 범위: 실제 24문항, 문제 24축 + 해설 24축 = 48축. 다른 JS·기존 SVG·PNG는 변경하지 않음.
- 확인: 발문/해설의 수학 조건과 현행 `image`/`solutionImage` 실파일, 원본 PNG 7개(15,16,18,19,21,22,24번)를 실제로 열고 비교. 정규 크기에서 PC/휴대폰/A4 게시 렌더는 별도 후속 검수(`NOT_RUN`).
- 판정: `REPLAN`은 엔진에서 실행하는 JSON 재작성 계획(현행 SVG 교체·게시 전 단계), `KEEP`은 현행 그림이 의미상 맞아 유지, `EXEMPT`는 그 축의 별도 그림 교육 가치가 작거나 순수 계산. `EVIDENCE_DEBT`: 원본 해설 PNG는 이 저장소에 없음.
- 공통 조건: 도형 내부 색칠 기본 금지. 도표 항목, 색칠한 영역·필수 비교 시에만 면 채움을 허용. `DRAWN_FEATURE_PARITY=PASS`는 plan의 실제 렌더 필드/원문 수학 조건을 1:1 정적으로 대조했다는 뜻이고, SVG 실물 검증과 다름.

| 파일/qid | 축 | 기존 결함/판정 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 동산/q01 | problem | EXEMPT: 곱셈 기호 생략 규칙 | — | — | NOT_RUN | N/A |
| 동산/q01 | solution | EXEMPT: 수식 변환만으로 설명 완결 | — | — | NOT_RUN | N/A |
| 동산/q02 | problem | EXEMPT: 수량을 문자식으로 표현 | — | — | NOT_RUN | N/A |
| 동산/q02 | solution | EXEMPT: 나머지 1개 제외 계산 | — | — | NOT_RUN | N/A |
| 동산/q03 | problem | EXEMPT: 대입 계산 | — | — | NOT_RUN | N/A |
| 동산/q03 | solution | EXEMPT: 대입값 계산 | — | — | NOT_RUN | N/A |
| 동산/q04 | problem | EXEMPT: 부호·분수 대입 | — | — | NOT_RUN | N/A |
| 동산/q04 | solution | EXEMPT: 수식 연산 | — | — | NOT_RUN | N/A |
| 동산/q05 | problem | EXEMPT: 다항식 용어 판별 | — | — | NOT_RUN | N/A |
| 동산/q05 | solution | EXEMPT: 차수·계수 설명 | — | — | NOT_RUN | N/A |
| 동산/q06 | problem | EXEMPT: 동류항 상자/식 자체가 제시 | — | — | NOT_RUN | N/A |
| 동산/q06 | solution | EXEMPT: 항의 분류 | — | — | NOT_RUN | N/A |
| 동산/q07 | problem | EXEMPT: 괄호 제거 계산 | — | — | NOT_RUN | N/A |
| 동산/q07 | solution | EXEMPT: 부호 전개 | — | — | NOT_RUN | N/A |
| 동산/q08 | problem | EXEMPT: 단항식으로 나누기 | — | — | NOT_RUN | N/A |
| 동산/q08 | solution | EXEMPT: 계수 나눗셈 | — | — | NOT_RUN | N/A |
| 동산/q09 | problem | EXEMPT: 분수식 계산 | — | — | NOT_RUN | N/A |
| 동산/q09 | solution | EXEMPT: 통분 정리 | — | — | NOT_RUN | N/A |
| 동산/q10 | problem | EXEMPT: 문장→방정식 | — | — | NOT_RUN | N/A |
| 동산/q10 | solution | EXEMPT: 식의 양변 해석 | — | — | NOT_RUN | N/A |
| 동산/q11 | problem | EXEMPT: 후보 방정식 대입 | — | — | NOT_RUN | N/A |
| 동산/q11 | solution | EXEMPT: 각 후보에 값 대입 | — | — | NOT_RUN | N/A |
| 동산/q12 | problem | EXEMPT: 연산 과정이 문장/식으로 충분 | — | — | NOT_RUN | N/A |
| 동산/q12 | solution | EXEMPT: 등식의 성질 단계 | — | — | NOT_RUN | N/A |
| 동산/q13 | problem | EXEMPT: 일차방정식 | — | — | NOT_RUN | N/A |
| 동산/q13 | solution | EXEMPT: 일차방정식 풀이 | — | — | NOT_RUN | N/A |
| 동산/q14 | problem | EXEMPT: 두 방정식의 공통해 | — | — | NOT_RUN | N/A |
| 동산/q14 | solution | EXEMPT: 이항·대입 연산 | — | — | NOT_RUN | N/A |
| 동산/q15 | problem | KEEP: 원본 PNG 점·축·눈금 A,B,C,D,E 확인 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q15 | solution | KEEP: 점의 실제 좌표·점선 수선 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q16 | problem | KEEP: 원본 PNG의 P·A·좌표축·사분면 확인 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q16 | solution | KEEP: P(a,b), A 제3사분면과 축의 성질 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q17 | problem | EXEMPT: 제4사분면 조건·부호 추론은 텍스트로 완결 | — | — | NOT_RUN | N/A |
| 동산/q17 | solution | KEEP: A(3,-2), B(-5,3/2), 수선·부호 주석 모두 정확; 실제 크기 재확인 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q18 | problem | KEEP: 선택 그래프 5개 원본 PNG, 증가 후 일정한 속력 조건 포함 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q18 | solution | KEEP: 증가 후 수평선 관계 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q19 | problem | KEEP: 원본 PNG 반복 높이 0~30m, 20분 주기 확인 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q19 | solution | KEEP: 최고점 10·30·50분, 기준 높이 20m 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q20 | problem | EXEMPT: 정비례의 정의/식 판정 | — | — | NOT_RUN | N/A |
| 동산/q20 | solution | EXEMPT: 비율의 상수성 설명 | — | — | NOT_RUN | N/A |
| 동산/q21 | problem | KEEP: 원본 PNG 원점 지나는 직선·반비례 곡선·교점(-6,2) 확인 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q21 | solution | KEEP: a=-1/3, b=-12 교점 두 곡선 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q22 | problem | KEEP: 원본 PNG 칼륨 A=450·B=300(mg/100g) 표 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q22 | solution | EXEMPT: 비례식·수치 계산으로 풀이 완결 | — | — | NOT_RUN | N/A |
| 동산/q23 | problem | EXEMPT: 거리/시간 문장제 | — | — | NOT_RUN | N/A |
| 동산/q23 | solution | KEEP: 버스·자전거 도착시간 40분 차 도식 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |
| 동산/q24 | problem | KEEP: 원본 PNG 거북/토끼 시작점·60분 2km 교점 확인 | PNG 원본 | — | NOT_RUN | N/A(원본 자산) |
| 동산/q24 | solution | KEEP: 토끼 (10,0)·거북 (60,2) 좌표/점선 일치 | 기존 SVG | — | NOT_RUN | N/A(기존 자산) |

## 미재작성 판정

q17 해설은 실물 크기로 재확인했으며 `a=3,b=-2`라는 예시가 정확하다. A(3,-2)는 제4사분면, B(-5,3/2)는 제2사분면이고 좌표축·수선·주석이 모두 그려져 있다. 작은 미리보기의 인상을 근거로 교체하면 기존 시각 정보가 사라질 수 있으므로 `KEEP`으로 확정했다.

원문 해설 PNG가 없으므로 해설 원본 대비 품질 평가는 `EVIDENCE_DEBT`. 기존 연결 SVG 자체와 학생이 읽을 수 있는 수학 의미를 대조했다. 새 SVG는 작성·게시하지 않았다(`NOT_RUN`).
