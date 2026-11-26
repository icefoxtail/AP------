# 2021 풍덕중 중2 2학기 중간: 문제/해설 SVG 재설계 인수 검수

## 범위·검증 기준

- 유일한 대상: `archive/exams/original/middle/m2/2mid/21_풍덕중_2학기_중간_중2_수학.js`의 q01–q25, 문제/해설 각 1축 총 **50축**.
- 원문 JS의 문항·해설, `archive/assets/images/21_풍덕중_2학기_중간_중2_수학/`의 기출 PNG 및 현행 SVG 12종을 확인했다. 원본 PNG q16/q17/q20/q21은 중요한 부분이 잘리거나 거의 비어 있어 도형의 독립적인 1:1 대조 증거가 부족하다.
- `plan-lint.cjs`는 해당 폴더의 `*.plan.json` 파일을 **개별 경로**로 넘겨 shallow/full 모두 실행했다. 이 도구는 `*.plan.json`을 디렉터리 탐색 시 자동 수집하지 않으므로 `rg --files | rg '\.plan\.json$' | xargs node .../plan-lint.cjs`를 사용해야 한다.
- `C✓`는 원문 및 확인 가능한 원본/기존 에셋의 도형 조건을 plan의 **실제 그리기 필드**에 대응시켰고 린트가 통과했다는 뜻이다. **실제 SVG에서의 `DRAWN_FEATURE_PARITY=PASS`를 뜻하지 않는다.** `R?`는 브라우저 합성·PNG·학생/A4 화면의 1:1 DRAWN 검사가 `ARCHIVE_PREFLIGHT_FAIL`(Chrome 미설치/다운로드 불가)로 실행되지 않았다는 뜻이다.
- `E`는 원본 기출 PNG의 결손으로 `EVIDENCE_DEBT`, `P`는 명시한 `ENGINE_CAPABILITY_PENDING`. `–`는 해당 축에 별도 시각 에셋이 없어 `EXEMPT`라는 뜻이다. 문제에 미제시된 해설 결과는 문제용 그림에 넣지 않았다. 기본 면 채움은 없다.

| 파일/qid | 축 | 기존결함/판정 및 원문 대조 | capability | plan경로 | plan-lint shallow/full | DRAWN_FEATURE_PARITY |
|---|---|---|---|---|---|---|
| 풍덕/q01 | 문제 | 식·보기 텍스트, 시각 에셋 없음 | EXEMPT | – | N/A | N/A |
| 풍덕/q01 | 해설 | 대입·정의 텍스트 | EXEMPT | – | N/A | N/A |
| 풍덕/q02 | 문제 | 순서쌍 보기 | EXEMPT | – | N/A | N/A |
| 풍덕/q02 | 해설 | 수치 대입 | EXEMPT | – | N/A | N/A |
| 풍덕/q03 | 문제 | 대수식 | EXEMPT | – | N/A | N/A |
| 풍덕/q03 | 해설 | 대입식 | EXEMPT | – | N/A | N/A |
| 풍덕/q04 | 문제 | 연립방정식 보기 | EXEMPT | – | N/A | N/A |
| 풍덕/q04 | 해설 | 연립식 검산 | EXEMPT | – | N/A | N/A |
| 풍덕/q05 | 문제 | 대입법 빈칸 | EXEMPT | – | N/A | N/A |
| 풍덕/q05 | 해설 | 대입법 정리 | EXEMPT | – | N/A | N/A |
| 풍덕/q06 | 문제 | 가감법 진술 | EXEMPT | – | N/A | N/A |
| 풍덕/q06 | 해설 | 가감법 해설 | EXEMPT | – | N/A | N/A |
| 풍덕/q07 | 문제 | 연립방정식 | EXEMPT | – | N/A | N/A |
| 풍덕/q07 | 해설 | 상수 결정 | EXEMPT | – | N/A | N/A |
| 풍덕/q08 | 문제 | 자리수 관계 | EXEMPT | – | N/A | N/A |
| 풍덕/q08 | 해설 | 식 세우기 | EXEMPT | – | N/A | N/A |
| 풍덕/q09 | 문제 | 함수 판별 문장 | EXEMPT | – | N/A | N/A |
| 풍덕/q09 | 해설 | 함수 정의 | EXEMPT | – | N/A | N/A |
| 풍덕/q10 | 문제 | 유리식 함수값 | EXEMPT | – | N/A | N/A |
| 풍덕/q10 | 해설 | 함수값 대입 | EXEMPT | – | N/A | N/A |
| 풍덕/q11 | 문제 | 닮은 사각형 ABCD/EFGH: ∠C 70°, EH 6, 2:3 대응각·변 명확화 | construction-spike-v1 | [q11-problem.plan.json](q11-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q11 | 해설 | 대응각 G=70°, AD=4 보강, 길이 치수선 표시 | construction-spike-v1 | [q11-solution.plan.json](q11-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q12 | 문제 | 개념 보기(도형의 이름만) | EXEMPT | – | N/A | N/A |
| 풍덕/q12 | 해설 | 닮음의 정의 설명 | EXEMPT | – | N/A | N/A |
| 풍덕/q13 | 문제 | 두 사각기둥 숨은 모서리 점선·높이 4/8; (나) 64cm³와 모형 체적 일치 | solid-figure-v1 | [q13-problem.plan.json](q13-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q13 | 해설 | 1:2 길이비, 1:8 부피비, (가) 8cm³ | solid-figure-v1 | [q13-solution.plan.json](q13-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q14 | 문제 | 두 삼각형 ∠B=∠E=50°, BC 8, EF 4 치수/각 호 | construction-spike-v1 | [q14-problem.plan.json](q14-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q14 | 해설 | 정답 추가 조건 AB 12, DE 6으로 SAS 닮음 직접 표시 | construction-spike-v1 | [q14-solution.plan.json](q14-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q15 | 문제 | AB 6, AC 8, AD x, ∠ABD=∠ACB=40°(호·치수) | construction-spike-v1 | [q15-problem.plan.json](q15-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q15 | 해설 | AA 닮음으로 AD=9/2 치수 치환 | construction-spike-v1 | [q15-solution.plan.json](q15-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q16 | 문제 | 빗변 BC와 높이 AD의 두 직각, BD 2/AD 4/DC x; 원본 PNG 일부 잘림 | construction-spike-v1 | [q16-problem.plan.json](q16-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q16 | 해설 | AD²=BD·DC, DC 8; 원본 PNG 결손 | construction-spike-v1 | [q16-solution.plan.json](q16-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q17 | 문제 | 평행사변형, AB 연장 BF 4, D–E–F 직선, AD 5/AB 6; 원본 PNG 거의 백지 | construction-spike-v1 | [q17-problem.plan.json](q17-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q17 | 해설 | 닮음에서 BE 2, EC 3, 일직선/평행 유지; 원본 PNG 결손 | construction-spike-v1 | [q17-solution.plan.json](q17-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q18 | 문제 | 사다리꼴 AD∥BC, 대각선·중점 눈금, PQ=x, AD 8/BC 14 | construction-spike-v1 | [q18-problem.plan.json](q18-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q18 | 해설 | 중점연결 정리 PQ 3, 교차 보조선 유지 | construction-spike-v1 | [q18-solution.plan.json](q18-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q19 | 문제 | 세 중선·세 변의 중점 눈금, 무게중심 G, 총 넓이 30 | construction-spike-v1 | [q19-problem.plan.json](q19-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q19 | 해설 | 6등분 도형·△GDC=5의 넓이 관계(설명), 불필요한 면 채움 없음 | construction-spike-v1 | [q19-solution.plan.json](q19-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q20 | 문제 | 두 무게중심 G,G′의 중선·보조선, GG′ 2; 원본 PNG 거의 백지 | construction-spike-v1 | [q20-problem.plan.json](q20-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q20 | 해설 | AD=9 추가, 중선상 순서 A–G–G′–D; 원본 PNG 결손 | construction-spike-v1 | [q20-solution.plan.json](q20-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q21 | 문제 | G 무게중심, E/F 중점·FE∥BC, 연결선; 원본 PNG 일부 잘림 | construction-spike-v1 | [q21-problem.plan.json](q21-problem.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q21 | 해설 | △GEF:△AEF=1:3, 중앙 보조선·중점 유지; 원본 PNG 결손 | construction-spike-v1 | [q21-solution.plan.json](q21-solution.plan.json) | PASS/PASS | C✓+E / R? |
| 풍덕/q22 | 문제 | 대수·서술 문항, 시각 에셋 없음 | EXEMPT | – | N/A | N/A |
| 풍덕/q22 | 해설 | 수식 풀이 | EXEMPT | – | N/A | N/A |
| 풍덕/q23 | 문제 | 표를 포함한 연립식, 도형 에셋 없음 | EXEMPT | – | N/A | N/A |
| 풍덕/q23 | 해설 | 식과 표의 계산 | EXEMPT | – | N/A | N/A |
| 풍덕/q24 | 문제 | ∠AED=∠ABC 동일 호, AD 9/AC 12, DE 연결; 면 채움 없음 | construction-spike-v1 | [q24-problem.plan.json](q24-problem.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q24 | 해설 | AA 닮음과 넓이비 9:16, 잔여 14cm²(텍스트) | construction-spike-v1 | [q24-solution.plan.json](q24-solution.plan.json) | PASS/PASS | C✓ / R? |
| 풍덕/q25 | 문제 | 작은 정사면체 6개와 큰 1개는 한 프레임에 7개; 엔진 최다 3개 입체. 크기 5/10만 정확 재현 | solid-figure-v1 | [q25-problem.plan.json](q25-problem.plan.json) | PASS/PASS | **P: SIX_SMALL_ONE_LARGE_LAYOUT** / R? |
| 풍덕/q25 | 해설 | A=6V, B=8V 비교는 설명·2개 기준 입체로 표시, 실제 6개 배치 미재현 | solid-figure-v1 | [q25-solution.plan.json](q25-solution.plan.json) | PASS/PASS | **P: SIX_SMALL_ONE_LARGE_LAYOUT** / R? |

## DRAWN_FEATURE_PARITY 및 운영 인계

- 조건·표식 계획 검수: **24/24 시각 축 shallow/full PASS**. 비시각 축 **26/26 EXEMPT**.
- 엔진 계획 내 실제 표식 필드: `displaySegments`·`rightAngles`·`planeMarks.angles/equalAngles/equalLengths/parallels/dimensions`·`solid-figure-v1`의 치수와 은선. 문장/캡션만으로 원본의 각·길이 표식을 대체하지 않는다.
- `EVIDENCE_DEBT`: q16, q17, q20, q21(원본 PNG 손상; 현행 SVG+원문 교차대조로 계획 작성). `ENGINE_CAPABILITY_PENDING`: q25의 **작은 정사면체 6개+큰 1개 동일 장면 표시**, 필요 기능은 7개 이상의 정다면체 인스턴스/다중 패널 배치와 제품 그룹 라벨.
- 실제 `DRAWN_FEATURE_PARITY` **미완료**: `render-plan.mjs`의 Chrome 사전검사 실패. 계획의 `plan-lint=PASS`를 렌더/원본 이미지 1:1 최종 PASS로 승격하지 않는다. 후속 운영 렌더 환경에서 SVG↔원본↔학생 화면·A4 검증이 필요하다.
