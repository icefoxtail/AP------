# M3 SVG Checklist

> 목적: 다른 작업자가 SVG 작업을 이어받을 때 문제 그림과 해설 그림을 혼동하지 않도록 현재 확인된 요구와 미확인 항목을 기록한다. 이 문서는 자산 존재 확인 목록이지 시각 검수 완료표가 아니다.

## 상태 표기

- `NEED`: 문제/해설 내용에 그림이 필요하지만 완성 자산을 확인하지 못함. `UNSUPPORTED` 계획도 여기 포함하며, 엔진 지원 여부는 이유에 덧붙인다.
- `PRESENT-UNVERIFIED`: 해당 경로의 자산 파일 존재를 확인했으나 렌더링·수학적 정확성은 검수하지 않음.
- `EXEMPT`: 검토 계획에서 텍스트·수식만으로 충분하다고 명시함.
- `CONFLICT`: 계획·본문·자산 상태가 서로 맞지 않아 판단 보류.
- `UNKNOWN`: 문항별 출처/계획/자산 대조가 아직 안 됨. 미확인은 PASS나 불필요를 뜻하지 않음.

이 체크리스트는 시험지별 누적 브랜치에 계속 추가한다. 이번 연향중 확인 기준은 착수 전 누적 브랜치 `9095531ec49eb0c75950bd28d129387f64a791e8`, `origin/main` `5d94eac054d4ed15f4c4902c7522e590d5f01417`이다. 자산 존재는 저장소 파일 경로만 확인했다. 이 작업에서는 화면·렌더링을 검사하지 않았고 SVG를 만들거나 바꾸지 않았다.

## 처리된 시험지와 기존 체크 대상

각 범위 표기는 범위 안의 **각 문항**에 해당 상태를 적용한다. `P`는 문제 그림, `S`는 해설 그림이다.

| 시험지 | 문항별 문제 그림 (P) | 문항별 해설 그림 (S) | 근거 / 남은 일 |
|---|---|---|---|
| 24 신흥중 2학기 기말 (Q1–24) | Q1–24 `EXEMPT` | Q1–24 `EXEMPT` | 시험지별 계획 파일에 모두 EXEMPT. 렌더링 검수는 하지 않음. |
| 24 왕운중 2학기 기말 (Q1–23) | Q1,6,7,9,10,12,14,15,22 `NEED`; Q2–5,8,11,13,16–21,23 `EXEMPT` | Q1–23 `EXEMPT`* | 문제 그림 9개 계획은 `UNSUPPORTED`로 엔진 제작 미완. Q1의 원문 문제에는 해설이 인용하는 수치 그림이 빠져 있다. |
| 25 연향중 1학기 중간 (Q1–23) | Q1–23 `EXEMPT` | Q1–23 `EXEMPT` | 문항별 계획 전부 EXEMPT. |
| 26 연향중 1학기 중간 (Q1–23) | Q1–18,20–23 `EXEMPT`; Q19 `NEED` | Q1–18,20–23 `EXEMPT`; Q19 `NEED` | Q19 타일 배열 문장이 둘 이상의 직사각형 둘레를 허용한다. 예를 들어 x=1일 때 12개 단위 정사각형은 3×4 또는 2×6으로 배열될 수 있다. 유일한 답을 정하는 정확한 배치/조건과 그에 맞는 문제·해설 시각자료가 필요하다. |
| 26 왕운중 1학기 중간 (Q1–23; 현재 후보) | Q1–23 `EXEMPT` | Q1–23 `EXEMPT` | 원문 MD의 문제 그림 계획 23개를 읽고 문제·해설을 각각 대조했다. Q7의 수직선 위치와 Q22의 직사각형/평행 조건·길이는 문장으로 충분히 특정되어 별도 그림 없이 풀 수 있다. 렌더링 검수는 미실시. |
| 24 금당중 1학기 중간 (Q1–24; 현재 후보) | Q5,Q11 `NEED`; Q1–4,6–10,12–24 `EXEMPT` | Q5,Q11 `NEED`; Q1–4,6–10,12–24 `EXEMPT` | Q5는 Drive 문서 본문·구조 모두 그림이 없고, 발문/해설의 삼각형 길이·좌표가 서로 맞지 않아 HOLD. Q11은 세 정사각형의 밑변 정렬 배치와 외곽 둘레를 보여주는 그림이 학생 이해에 도움. SVG·렌더 미완. |
| 24 삼산중 1학기 중간 (Q1–24; 현재 후보) | Q10,Q19,Q21–23 `NEED`; Q1–9,11–18,20,24 `EXEMPT` | Q10,Q17,Q19,Q21–23 `NEED`; Q1–9,11–16,18,20,24 `EXEMPT` | Q10 넓이 도식, Q19 잘라낸 정사각형/넓이 차, Q21 수직선 좌표, Q22 직육면체, Q23 완전제곱식의 넓이 분할은 학생 이해에 도움. Q17 해설은 정수 경계를 수직선으로 보이면 유익. Q19 절단 위치는 원문에 특정되지 않아 임의 배치 금지. SVG·렌더 미완. |
| 24 연향중 1학기 중간 (Q1–23; 현재 후보) | Q7,Q22 `NEED`; Q1–6,8–21,23 `EXEMPT` | Q7,Q22 `NEED`; Q1–6,8–21,23 `EXEMPT` | Q7 정사각형 대각선과 B(2)에서 오른쪽 점 P로 이어지는 수직선, Q22 중앙에 놓인 작은 상자와 십자형 끈의 사선 구간은 그림으로 보면 관계를 따라가기 쉽다. 원문 MD는 모두 EXEMPT이나 유익한 그림 항목을 별도 기록했다. SVG·렌더 미완. |
| 25 신흥중 1학기 중간 (Q1–24; 현재 후보) | Q11 `NEED`; Q1–10,12–24 `EXEMPT` | Q1–24 `EXEMPT` | Q11 원문 MD는 재배열 그림을 `RENDERED`로 표시하지만 대응 파일 경로·자산이 현재 저장소에 없다. 조각 배치와 바깥 둘레를 확인할 그림이 필요하다. |
| 24 신흥중 1학기 중간 (Q1–25; 현재 후보) | Q6,Q24 `NEED`; Q1–5,7–23,25 `EXEMPT` | Q6,Q24 `NEED`; Q1–5,7–23,25 `EXEMPT` | Q6은 발문이 그림을 참조하지만 Google Doc에 그림 객체가 없고 문자 라벨·눈금만 있다. 좌표를 추정해 복원하지 않았다. Q24는 전개도와 원기둥의 둘레·반지름·높이 대응을 그리면 유익하다. SVG·렌더 미완. |
| 24 연향중 2학기 기말 (Q1–23; 현재 후보) | Q1–23 `EXEMPT` | Q1–23 `EXEMPT` | Q3는 AB가 반원의 지름임을 명시했고, Q4의 P 위치, Q5의 C가 원 위라는 조건, Q10의 x/y가 바라보는 호, Q21의 원 교점 위치/거리, Q22의 두 직선 위 점 순서를 문제 본문에 보충했다. 나머지 도형 수치·점 관계와 표/산점도 자료도 텍스트에 들어 있어 별도 SVG 없이 풀이 가능하다. 원본 기출의 유사 그림 자산은 값·문항이 다를 수 있어 재사용하지 않았다. |
| 25 금당중 2학기 중간 (Q1–24; 기존 시험지) | Q1,4–24 `UNKNOWN` (도형 계획 초안은 있으나 완료 상태 미기록); Q2–3 `EXEMPT` | Q1–24 `EXEMPT` | 초안 계획에 자산 경로/완료 검수가 없다. 도형 계획의 생성 완료로 간주하지 말 것. |
| 25 왕운중 2학기 중간 (Q1–24; `origin/main` 기존 파일) | Q1,Q14 `PRESENT-UNVERIFIED`; Q6,8,11,13,16,17,19–24 `UNKNOWN`; Q4,7,12,15,18 `NEED`; Q2,3,5,9,10 `EXEMPT` | Q1,Q14 `NEED`; Q2,6,8,9,11,13,16,17,19–24 `UNKNOWN`; Q12,15,18 `NEED`; Q3–5,7 `EXEMPT`; Q10 `CONFLICT` | Q1/Q14의 해설 도형 계획은 보조 시각정보를 요구하지만 대응 `q1-solution.svg`/`q14-solution.svg` 파일이 없다. Q10 해설 자산은 존재하지만 계획은 EXEMPT라 서로 충돌한다. 아래 세부 확인 참조. |
| 26 삼산중 2학기 중간 (Q1–24; 기존 파일) | Q1,3,5–6,8–24 `PRESENT-UNVERIFIED`; Q2,4,7 `EXEMPT` | Q1–24 `EXEMPT` | 문제 계획의 assetPath 21개를 `archive/assets/images`에서 찾음. 화면 검수 전 완료로 취급하지 말 것. |
| 26 삼산중 1학기 중간 (Q1–24; 기존 파일) | Q5,10,13,24 `UNKNOWN`; 나머지 Q1–4,6–9,11–12,14–23 `UNKNOWN` | Q1–24 `UNKNOWN` | 일부 문제 이미지 참조만 확인된 상태. 문항별 필요 여부·자산 경로·시각 검수가 미완. |
| 26 삼산중 1학기 중간 (Q1–24; 유사2 후보) | Q5,10,13,17,24 `NEED`; Q1–4,6–9,11–12,14–16,18–23 `EXEMPT` | Q3,5,10,13,17,21,24 `NEED`; Q1–2,4,6–9,11–12,14–20,22–23 `EXEMPT` | 이전 유사판은 그대로 보존. Q5·Q10 도형/대각선·수직선 관계, Q17 사진 배열과 여백, Q24 반복 분할·사다리꼴은 그림이 학습에 도움. Q3·Q21 해설에는 수직선 표현이 유익. Q13은 조각 접촉 원리를 보여줄 수 있으나 원문에 특정 배치가 없어 임의 배치는 금지. SVG·렌더 미완. |
| 23 왕운중 1학기 중간 유사1 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 23 왕운중 1학기 중간 유사2 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 23 왕운중 1학기 중간 유사3 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 23 풍덕중 1학기 중간 유사1 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 23 풍덕중 1학기 중간 유사2 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 23 풍덕중 1학기 중간 유사3 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 24 왕운중 1학기 중간 (Q1–23) | Q1–23 `UNKNOWN` | Q1–23 `UNKNOWN` | 문항별 체크 미작성. |
| 24 왕운중 1학기 중간 유사2 (Q1–23; 현재 후보) | Q8,Q19,Q23 `NEED`; Q1–7,9–18,20–22 `EXEMPT` | Q8,Q19,Q23 `NEED`; Q1–7,9–18,20–22 `EXEMPT` | 새 MD는 기존 유사판과 다른 판본(Q1 정답 ①, 기존 유사1은 ②)이라 `유사2.js`에 보존했다. Q8 직각삼각형·수직선, Q19 정사각형/직사각형 넓이 비교, Q23 변 길이를 표시한 직각삼각형은 그림이 이해에 도움. 기존 기출 자산은 다른 판본이라 재사용하지 않음. SVG·렌더 미완. |
| 24 이수중 1학기 중간 (Q1–25; 현재 후보) | Q10,Q12,Q23 `NEED`; Q1–9,11,13–22,24–25 `EXEMPT` | Q10,Q12,Q23 `NEED`; Q1–9,11,13–22,24–25 `EXEMPT` | Q10은 수직선·정사각형 대각선 이동, Q12는 밑변을 맞춘 세 정사각형의 계단형 외곽선, Q23은 3<x<5에서의 절댓값 부호 판단을 그림으로 보면 이해에 도움. 원문 MD 전부 EXEMPT, 문서 이미지 객체 없음. SVG·렌더 미완. |
| 24 향림중 1학기 중간 (Q1–24; 현재 후보) | Q10,Q14,Q22 `NEED`; Q1–9,11–13,15–21,23–24 `EXEMPT` | Q10,Q14,Q15,Q22,Q24 `NEED`; Q1–9,11–13,16–21,23 `EXEMPT` | Q1 ④의 모호한 “제곱근 16”을 √16으로 명시하고 독립 검산해 정답 ①을 유지했다. Q10 원 위 두 교점·수직선, Q14 수의 순서, Q15 계단형 f(x), Q22 원기둥/원뿔, Q24 소수 부분/절댓값 단계를 문제·해설로 나눠 표시. SVG·렌더 미완. |
| 25 왕운중 1학기 중간 유사1 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 25 왕운중 1학기 중간 유사2 (Q1–24) | Q1–24 `UNKNOWN` | Q1–24 `UNKNOWN` | 문항별 체크 미작성. |
| 25 왕운중 1학기 중간 유사3 (Q1–24; 현재 후보) | Q9,19,24 `NEED`; 나머지 Q1–8,10–18,20–23 `EXEMPT` | Q9,19,24 `NEED`; 나머지 Q1–8,10–18,20–23 `EXEMPT` | Q9 모눈 위 삼각형·원호 교점, Q19 분할 직사각형 배치, Q24 삼각형·수직선 위치가 문제와 풀이 이해에 도움되어 기록했다. 발문에 수치·관계는 보충했지만 그림은 생략하지 않는다. 원본 기출의 Q9/Q19/Q24 해설 SVG는 다른 수치라 재사용하지 않았고 유사3의 문제·해설 SVG는 미완료. Q6에는 공유 제곱근표 전체를 넣었다. 렌더 검수 미실시. |
| 24 풍덕중 2학기 기말 중3 (외부/별도 소유) | 문항 수 미확인, 모든 P `UNKNOWN` | 문항 수 미확인, 모든 S `UNKNOWN` | 별도 작업 중인 자료. 소유권·원문 대조 전 이 브랜치에서 수정하지 않음. |
| 25 왕운중 2학기 기말 중3 (외부/별도 소유) | 문항 수 미확인, 모든 P `UNKNOWN` | 문항 수 미확인, 모든 S `UNKNOWN` | 별도 작업 중인 자료. 소유권·원문 대조 전 이 브랜치에서 수정하지 않음. |

| 24 신흥중 1학기 기말 (Q1–24; 새 후보) | Q1–12,19,21–23 `EXEMPT`; Q13–18,20,24 `NEED` | Q1–12,19,21–23 `EXEMPT`; Q13–18,20,24 `NEED` | 원문 MD는 모두 EXEMPT이나 그래프·이동·사분면·삼각형 넓이·꼭짓점-직선 관계를 별도 판정했다. NEED 계획은 `UNSUPPORTED`, SVG 미제작. 선언 원본 경로는 main에 없고 실제 평행 기출판 `...기출c.js`와 그 SHA를 확인했다. 해당 기출판 폴더에 Q16/Q19/Q20 자산은 있으나 판본이 달라 재사용하지 않았다. |

| 24 연향중 1학기 기말 중3 (Q1–23; 새 후보) | Q8–10,Q12–14,Q17–20,Q23 `NEED`; 나머지 Q1–7,11,15–16,21–22 `EXEMPT` | Q8–10,Q12–14,Q17–20,Q22–23 `NEED`; 나머지 Q1–7,11,15–16,21 `EXEMPT` | 원문 MD는 23문항 전부 EXEMPT였으나 그래프·이동·직사각형·포물선 관계를 문제/해설별로 재판정했다. NEED 그림은 미제작. 원본 선언 경로는 main에 없고 접두어를 붙인 archive/exams/original/...기출c.js가 실제 원본이다. 원본 그림 파일은 변형 수치/판본이 달라 복사하지 않았다. |

| 24 왕운중 1학기 기말 중3 유사 (Q1–23; 새 후보) | Q16,Q18,Q21,Q23 `NEED`; 나머지 Q1–15,17,19–20,22 `EXEMPT` | Q16,Q18,Q21,Q23 `NEED`; 나머지 Q1–15,17,19–20,22 `EXEMPT` | Q2의 원래 ①은 등식으로 참이지만 공통인수를 덜 묶은 형태라 ②와 정답 유일성이 모호했다. 유사판 ①을 거짓 등식으로 보완·검산했다. Q16 경우의 수 표, Q18 완전제곱 넓이 모형, Q21 직사각형 치수, Q23 나이 막대를 발문·해설 각각 기록. 그림 미제작. |

| 23 순여중 2학기 기말 중3 유사 (Q1–24; 새 후보) | Q1–12,Q19–22 `NEED`; Q13–18,Q23–24 `EXEMPT` | Q1–12,Q19–22 `NEED`; Q13–18,Q23–24 `EXEMPT` | MD 원본 지정은 `23_순여중`; 별칭 `23_순천여중`과 24문항 JS blob·내용이 달라 중복 취급하지 않았다. 해당 `순천여중` 자산/기존 SVG 초안은 미사용. Q19 산점도 데이터 미제공으로 답 미검증. 그림 미제작. |
| 23 연향중 2학기 기말 중3 유사 (Q1–24; 현재 후보) | Q2–8,Q17–18,Q20–22,Q24 `NEED`; Q1,Q9–16,Q19,Q23 `EXEMPT` | Q2–8,Q17–18,Q20–22,Q24 `NEED`; Q1,Q9–16,Q19,Q23 `EXEMPT` | Q9·Q10·Q13·Q14·Q23·Q24의 누락/오류를 MD 해설 근거로 후보에서 바로잡았다. Q5는 동일 시험 원본 JS/SVG 코드의 접선·평행 현 관계와 MD 해설로 각 추론을 재확인했다(원본 40°, 후보 50°이므로 자산은 재사용하지 않음). Q6는 후보 발문에 점의 원주 순서 A-B-C-D와 x=외각 ∠APB를 명시하고 30°+45°=75°로 독립 검산했다. Q17은 유사판에서 점별 이름을 새로 지정해 A=(2,32), B=(4,28), C=(6,22), D=(8,18), E=(9,14)로 만들었다. 이 배치는 원본 복원이 아니다. 비율 검산 결과 A가 유일한 답이며 렌더는 미완. Q2–8/Q17–18/Q20–22/Q24 그림 미제작. MD 원본 선언 경로에 `archive/exams/` 접두어를 붙인 `archive/exams/original/middle/m3/2final/23_연향중_2학기_기말_중3_기출.js`가 main에 있으며 blob `d64c3c3285826c4df89d9044f5e1e87d5a80708b`; 이전 출처 미존재 보고를 정정한다. 24/25 판본은 별도 유지. |

### 24 신흥중 1학기 중간 — 문제·해설 그림 체크

- **Q6 — P `NEED`, S `NEED`:** 발문은 모눈 선분 AB·CD와 수직선의 P·Q 그림을 참조한다. 문서 본문에는 실제 이미지 객체가 없으며 `A B C D P Q -2 ... 6` 라벨만 있다. 해설은 좌표와 이동 방향을 서술하지만, 그 설명을 문제 그림으로 역추정하지 않았다. 원본 그림/문제 좌표 확인이 남았다.
- **Q24 — P `NEED`, S `NEED`:** 원기둥 전개도 옆면의 가로(밑면 원의 둘레)·세로(높이)를 원기둥의 반지름·부피에 연결하는 그림이 학생의 조건 해석과 풀이 이해에 도움이 된다. 자산은 없고 SVG 제작·검수는 미완이다.
- **나머지 문항:** 각 발문과 해설을 따로 확인했으며, 추가 그림이 주는 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 이는 렌더링 검수나 전체 독립 수학 검산을 뜻하지 않는다.

### 24 연향중 1학기 중간 — 문제·해설 그림 체크

- **Q7 — P `NEED`, S `NEED`:** 한 변 1인 정사각형의 대각선 BD가 BP의 길이와 같고, B가 수직선의 2이며 P가 오른쪽에 있다. 정사각형 대각선과 수직선 이동을 함께 그리면 길이와 좌표의 관계를 이해하기 쉽다.
- **Q22 — P `NEED`, S `NEED`:** 작은 정사각형 밑면 상자를 큰 상자 윗면 중앙에 놓고 두 직교 방향으로 끈을 두르는 경로, 두 상자 사이 사선 길이, 매듭 길이를 분리해 보여 주면 풀이를 따라가기 쉽다.
- **나머지 문항:** 발문과 해설을 나누어 확인했고 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 원문 MD의 모든 항목은 EXEMPT였으나 그 표기를 그대로 승인하지 않았다. 문서 이미지 객체는 없으며 SVG·렌더 검수는 미완이다.

### 24 왕운중 1학기 중간 유사2 — 문제·해설 그림 체크

기존 `24_왕운중_1학기_중간_중3_유사.js`를 보존하고 새 MD는 `유사2.js`로 분리했다. 두 파일은 main과 누적 브랜치의 기존 유사1 blob이 같고, 새 MD Q1 정답은 ①·유사1 Q1 정답은 ②다.

- **Q8 — P `NEED`, S `NEED`:** 수직선의 A(-1), 밑변 3·높이 2인 직각삼각형, 점 P가 놓이는 위치를 함께 보이면 빗변 길이와 좌표를 연결하기 쉽다.
- **Q19 — P `NEED`, S `NEED`:** 한 변 a인 정사각형과 가로 a+3·세로 a−3 직사각형의 넓이를 나란히 보이면 전개식으로 넓이를 비교하는 관계가 드러난다. 기출판의 Q19 자산은 원문/판본이 달라 재사용하지 않았다.
- **Q23 — P `NEED`, S `NEED`:** 빗변 a+b와 밑변 a−b를 표시한 직각삼각형을 그리면 피타고라스로 높이를 구해 넓이를 계산하는 풀이가 잘 보인다.
- **나머지 문항:** 발문과 해설을 각각 확인했으며 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 원문 MD의 시각 상태는 23문항 모두 EXEMPT였으나 이를 그대로 승인하지 않았다. 문서 이미지 객체는 없고 SVG·렌더 검수는 미완이다.

### 24 이수중 1학기 중간 — 문제·해설 그림 체크

- **Q10 — P `NEED`, S `NEED`:** 좌표 3에서 정사각형 한 변 1의 대각선 길이만큼 왼쪽으로 옮긴 점을 수직선에 보이면 $3-\sqrt{2}$의 위치를 이해하기 쉽다.
- **Q12 — P `NEED`, S `NEED`:** 넓이 8, 18, 25인 정사각형의 변 길이 $2\sqrt{2}$, $3\sqrt{2}$, 5를 바닥에 맞춰 차례로 이어 붙인 계단형 외곽선을 그리면 둘레를 가로·세로 구간으로 나누어 계산하기 쉽다. 원문 풀이도 이 배치를 전제로 한다.
- **Q23 — P `NEED`, S `NEED`:** 수직선에서 $3<x<5$를 표시하면 $x-5<0$, $x-3>0$이 되어 두 제곱근의 절댓값을 푸는 부호 판단에 도움이 된다.
- **나머지 문항:** 발문과 해설을 따로 확인했고 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 원문 MD의 그림 상태는 25문항 전부 EXEMPT였지만 그대로 승인하지 않았다. 문서에 inline/positioned 이미지 자산은 없으며 SVG·렌더 검수는 미완이다.

### 24 향림중 1학기 중간 — 문제·해설 그림 체크

- **Q10 — P/S `NEED`:** 수직선의 P(2), 밑변 2·높이 1 직각삼각형, 반지름 PQ인 원과 수직선 교점 A/B를 같이 표시하면 좌표 2±√5를 이해하기 쉽다.
- **Q14 — P/S `NEED`:** 다섯 실수의 근삿값을 수직선에 순서대로 놓으면 중앙값의 위치를 파악하기 쉽다.
- **Q15 — S `NEED`:** f(x)가 √x보다 작은 자연수의 개수라 완전제곱수에서 값이 변하는 계단형 그래프는 선택지의 함수 관계를 이해하는 데 도움이 된다. 문제는 식으로 정의되어 있어 P는 `EXEMPT`로 두었다.
- **Q22 — P/S `NEED`:** 반지름과 높이가 표시된 원기둥·원뿔을 나란히 보면 두 부피식을 세우는 이유를 이해하기 쉽다.
- **Q24 — S `NEED`:** √5의 정수 부분과 소수 부분, 1을 뺀 뒤 절댓값을 취하는 부호 변화를 수직선으로 보이면 풀이 단계에 도움이 된다. 발문은 정의와 식이 명시되어 있어 P는 `EXEMPT`로 두었다.
- **나머지 문항:** 발문과 해설을 따로 확인했고 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 원문 MD 그림 상태는 24문항 모두 EXEMPT였으나 그대로 승인하지 않았다. 문서에 inline/positioned 그림 객체는 없고 SVG·렌더 검수는 미완이다.
- **구획 표식:** 전달된 `/` 문자는 추출 텍스트에서 발견하지 못했다. 실제 U+E907(Q/JSON 블록) 경계로 분리했으며 답·해설·메타 잔재가 발문에 들어가지 않는지 확인했다.

\* 24 왕운 Q1 해설 계획은 `EXEMPT`지만, 해설에 쓰인 0.77·0.64·0.84가 문제의 그림에 의존한다는 연결 메모가 있다. 문제 그림이 빠진 상태에서는 두 단계의 시각 일관성을 확인할 수 없다. `EXEMPT`는 별도 해설 삽화가 계획되지 않았다는 뜻이며 문제 의존성이 해결됐다는 뜻이 아니다.

### 24 왕운중 2학기 기말 Q1 — 우선 확인

- **P / 문제:** `NEED`, 계획 상태 `UNSUPPORTED`. 현재 문제 텍스트만으로 해설이 인용하는 삼각비 값 `0.77`, `0.64`, `0.84`의 기하 정보/좌표를 복원할 수 없다. 원본 또는 정확한 문제 그림과 수치·점 위치 확인이 필요하다.
- **S / 해설:** 계획은 `EXEMPT`; 설명식 자체는 글로 읽히지만 위 수치의 출처가 P에 있어 독립적으로 완결됐다고 보지 않는다.
- **조치:** 원본 대조 전 숫자나 도형을 추정해 만들지 않는다. 그림이 확인되면 P와 S의 수치·표기를 함께 대조한다.

### 25 왕운중 2학기 중간 — main만의 자산/계획 충돌

아래 파일은 main에 있는 기존 시험지라 누적 브랜치에서 수정하지 않았다. 자산은 모두 존재 확인만 했고, 육안 검수는 미실시다.

| 문항 | 문제 그림 | 해설 그림 | 상태 |
|---|---|---|---|
| Q1 | `q1.svg` 존재 | 계획은 보조 도형을 요구하지만 `q1-solution.svg` 없음 | P `PRESENT-UNVERIFIED`; S `NEED` |
| Q10 | 문제 자산 없음 | `q10-solution.svg` 존재, 계획은 EXEMPT | S `CONFLICT` — 불필요 계획과 기존 자산의 의도를 확인할 것 |
| Q14 | `q14.svg` 존재 | 계획은 OA·OB 보조 반지름을 요구하지만 `q14-solution.svg` 없음 | P `PRESENT-UNVERIFIED`; S `NEED` |

경로: `archive/assets/images/25_왕운중_2학기_중간_중3_유사/`. 이 메모는 main 자산을 편집하거나 작업 소유권을 가져오지 않는다.

## 다음 대기열

현재 이 차례의 미처리 대기열은 없습니다. 문항별 그림 계획은 시험지별 `_plans/` 폴더에 problem/solution으로 나누어 기록했습니다.

| 순서 | 시험지 | 문제 그림 (P) | 해설 그림 (S) | 근거 |
|---:|---|---|---|---|
| — | 없음 | — | — | 새 대기 항목은 아직 인수되지 않음. |

시험지를 새로 인수하면 원문 문제/해설을 각각 읽고 모든 문항의 P/S 상태를 추가한다. 필요 그림의 요구조건, 자산 경로/존재, 렌더링 및 수학 검수 상태를 별도 기록하며, 검수 전에는 `PRESENT-UNVERIFIED`를 `완료`로 승격하지 않는다.

### 24 신흥중 1학기 기말 — 문제·해설 그림 체크

- **Q13 — P/S `NEED`:** $y=3x^2$의 꼭짓점·축·점·폭을 직접 그려 선택지의 그래프 성질을 비교하기 쉽다.
- **Q14 — P/S `NEED`:** $y=ax^2+4$와 $(2,8)$을 표시하면 수직 이동과 계수 관계를 연결하기 쉽다.
- **Q15 — P/S `NEED`:** 원래 그래프와 이동 뒤 꼭짓점의 좌표 변화를 나란히 보여 주면 $m,n$의 부호를 따라가기 쉽다.
- **Q16 — P/S `NEED`:** 꼭짓점 $(a,b)$의 제4사분면 위치와 음의 이차항에 따른 그래프 방향을 같이 보이면 계수 부호와 그래프 성질을 연결하기 쉽다.
- **Q17 — P/S `NEED`:** 꼭짓점 $(-3,6)$, $x=0$에서의 높이 $9a+6$, 제1사분면 영역을 표시하면 경계 $a=-2/3$을 이해하기 쉽다.
- **Q18 — P/S `NEED`:** 꼭짓점 $(2,-8)$, 축 $x=2$, 두 $x$절편을 표시하면 보기의 절편·증가성과 틀린 꼭짓점을 비교하기 쉽다.
- **Q20 — P/S `NEED`:** 두 $x$절편의 거리 6, 대칭축과 꼭짓점 높이를 보여 주면 삼각형 밑변·높이 관계가 드러난다.
- **Q24 — P/S `NEED`:** 포물선 꼭짓점 $(p,q)$, 직선 $y=2x-1$, 곡선 위 $(2,6)$을 함께 그리면 조건 두 개를 연결하기 쉽다.
- **나머지 문항:** 발문·해설을 각각 확인해 별도 그림이 주는 이득이 추가로 확인되지 않아 `EXEMPT`로 기록했다. MD의 EXEMPT 표기를 그대로 승인한 것이 아니다. SVG와 렌더 검수는 미완이다.
- **출처와 자산:** MD의 선언 경로 `original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출.js`는 main에 없다. 확인된 원본은 별도 경로 `archive/exams/original/middle/m3/1final/24_신흥중_1학기_기말_중3_기출c.js`(blob `e91c506fb47943d0b69b4015cc2b7c07c19f3ebe`)이다. 같은 파일이라고 보지 않고 문항 ID·순서·단원 배열과 주제의 일치로 평행 기출판 결속을 기록했다. 이 기출판의 Q16/Q19/Q20 이미지 자산은 파일로 존재하지만 내용 시각검수는 하지 않았으며, 유사판과 다를 수 있어 재사용하지 않았다.

### 24 연향중 1학기 기말 중3 — 문제·해설 그림 체크

- **Q8 — P/S `NEED`:** $y=2x^2$의 꼭짓점·대칭축·점·폭을 그래프에 표시하면 성질을 비교하기 쉽다.
- **Q9 — P/S `NEED`:** 포물선 위 윗변과 $x$축 밑변으로 된 직사각형의 꼭짓점·높이를 표시하면 넓이와 둘레의 식을 세우기 쉽다.
- **Q10 — P/S `NEED`:** 위아래로 7만큼 떨어진 두 포물선의 동일한 $x$에서 수직으로 이은 선분을 그리면 길이를 이해하기 쉽다.
- **Q12 — P/S `NEED`:** $y=ax^2$를 왼쪽 3만큼 옮긴 그래프와 주어진 두 점을 표시하면 이동과 함수값을 연결하기 쉽다.
- **Q13 — P/S `NEED`:** 축 $x=2$, $y$절편 $(0,1)$ 및 두 점을 포물선에 표시하면 대칭으로 $k$를 찾는 과정이 보인다.
- **Q14 — P/S `NEED`:** 원래 꼭짓점의 $x$좌표 부호와 새 그래프 $y=ax^2-p$의 방향·꼭짓점을 비교하면 보기 판단에 도움이 된다.
- **Q17 — P/S `NEED`:** 그래프를 $(-3,-10)$만큼 옮긴 꼭짓점과 전개식의 계수 $p,q$를 연결하면 이동 부호를 따라가기 쉽다.
- **Q18 — P/S `NEED`:** 꼭짓점 $(3,5)$, 축 $x=3$, $y$절편을 표시하면 옳지 않은 설명을 판별하기 쉽다.
- **Q19 — P/S `NEED`:** $x$절편 $O,B$와 꼭짓점 $A$, 삼각형의 밑변·높이를 표시하면 넓이와 계수 관계를 연결하기 쉽다.
- **Q20 — P/S `NEED`:** 두 $x$절편과 곡선 위 점을 포물선에 표시하면 인수형 식과 $k$를 연결하기 쉽다.
- **Q22 — S `NEED`, P `EXEMPT`:** $y=f(x)$와 $y=x$의 교점을 그리면 $f(p)=p$의 해 두 개와 그 합의 의미를 설명하기 쉽다. 문제는 함수 조건이 글과 식으로 완결된다.
- **Q23 — P/S `NEED`:** 축 $x=2$, 절편 $(-1,0),(5,0)$과 꼭짓점 높이 $n$을 표시하면 대칭과 계수 관계를 따라가기 쉽다.
- **나머지 문항:** 발문과 해설을 따로 확인해 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. 원문 MD의 일괄 EXEMPT를 그대로 승인하지 않았다. SVG 제작·렌더 검수는 미완이다.
- **출처:** MD의 `original/middle/m3/1final/24_연향중_1학기_기말_중3_기출c.js`는 경로 접두어가 빠져 main에 없다. 확인된 원본은 `archive/exams/original/middle/m3/1final/24_연향중_1학기_기말_중3_기출c.js`(blob `3997671dd7c476bc5bff4a2bdd0ae8d9a9cff89a`)이며 같은 23문항 순서와 주제를 갖는 원본 판본이다. 동일 파일이라 부르지 않고 출처 경로를 정정해 기록했다. 원본의 그림은 현재 후보와 값이 달라 재사용하지 않는다.

### 24 왕운중 1학기 기말 중3 유사 — 문제·해설 그림 체크

- **Q16 — P/S `NEED`:** 주사위 첫째·둘째 눈 $(a,b)$를 6×6 표로 나타내고 $a^2=4b$를 만족하는 칸을 표시하면 중근이 되는 경우를 세기 쉽다.
- **Q18 — P/S `NEED`:** $x^2-7x$에 $49/4$를 더해 정사각형을 만드는 넓이 모형은 완전제곱식과 $37/4$ 계산을 따라가는 데 도움된다.
- **Q21 — P/S `NEED`:** 인수분해한 넓이식에서 가로·세로를 표시한 직사각형은 둘레 식을 구성하는 데 도움된다.
- **Q23 — P/S `NEED`:** 하린 $x$살과 지우 $x+4$살 막대는 나이 차와 제곱합 조건을 연결하는 데 도움된다.
- **나머지 문항:** 발문과 해설을 각각 확인했으며 추가 그림의 학습 이득을 확인하지 못해 `EXEMPT`로 기록했다. SVG 제작·렌더 검수는 미완이다. 원본 기출 자산은 유사판과 값이 달라 복사하지 않는다.
- **Q2 보완:** 원문 보기 ① $4ax+8a=a(4x+8)$은 등식으로 참이라 공통인수 $4$를 더 묶을 수 있다는 점만으로 정답 ②와 구별하기 어렵다. 후보 JS의 ① 우변을 $a(4x+2)$로 바꿨다. 이 우변은 $4ax+2a$이므로 좌변과 항등적으로 같지 않다. ②만 정확한 인수분해로 남는 것을 별도 전개 검산했다.
- **출처:** MD 선언 경로 `original/middle/m3/1final/24_왕운중_1학기_기말_중3_기출c.js`는 경로 접두어가 빠져 main에서 찾지 못했다. 실제 원본은 `archive/exams/original/middle/m3/1final/24_왕운중_1학기_기말_중3_기출c.js`(blob `fadb9095cca8e37b4828b341bd52a9a48614b6a7`)이며 23문항 원본이다. 동일 파일이라고 처리하지 않고 확인한 경로를 기록했다.

### 23 순여중 2학기 기말 중3 유사 — 문제·해설 그림 체크

- **Q1–12 — P/S `NEED`:** 원주각·중심각, 내접사각형, 접선-현 관계와 점 배치가 문제 이해 및 해설의 각도 관계에 필요하다. 별칭 원본 SVG는 값과 배치가 이 유사판에 맞는지 검증되지 않아 사용하지 않는다.
- **Q19 — P/S `NEED` (제작 미완):** 원본 MD에 나머지 점 좌표가 없어 원본 그림 파일만으로 원자료를 복원하지 않았다. 후보 문항을 명시된 여섯 좌표와 제외점 (가),(나)를 주는 새 자료형으로 재구성했다. 편차곱 합이 0이라 답 ①임을 검산했다. 점 분포를 보여 주는 문제·해설 시각화는 후속 제작 대상이며 원본/별칭 PNG·SVG를 재사용하지 않았다.
- **Q20 — P/S `NEED`:** 산점도와 직선 $y=x$ 위쪽 점을 보여 주면 과학 점수가 수학 점수보다 큰 학생을 세기 쉽다. 해설에 좌표 10개가 있어 3명/30% 계산은 확인했지만 새 그림은 만들지 않았다.
- **Q21–22 — P/S `NEED`:** 원에 내접한 사각형과 중심각/접선 접점을 표시하면 증명과 각도 계산을 따라가기 쉽다.
- **나머지 문항:** 통계 자료·수치와 풀이가 텍스트로 완결되며 별도 그림의 이득을 확인하지 못해 `EXEMPT`로 기록했다. SVG 제작·렌더 검수는 미완이다.
- **Q4 형식 차단:** 후보 발문은 `[정답 2개]`, 답 `②, ⑤`이며 두 보기는 기하 계산으로 모두 참이다. `verify_similar_exam.mjs`는 객관식 답을 원형 숫자 하나로만 허용한다. 이를 문항 오류로 간주하거나 검사기를 완화하지 않았다.
- **별칭·자산:** MD가 지정한 원본 `archive/exams/original/middle/m3/2final/23_순여중_2학기_기말_중3_기출.js` blob `eb37be5cbd55288b965f7a414a46bd5a82e2f5a5`; `23_순천여중` 원본은 blob `361feba2088c78608b9995b3b9fc5c563f0181da`로 문항 내용/답·해설 일부가 다르다. Q19 PNG 두 경로의 SHA-256은 동일하지만 어느 자산도 후보에 사용하지 않았다. 별칭 자산 폴더와 SVG 초안은 후보에 혼합하지 않았다. 화면 검수는 하지 않았다.
### 23 연향중 2학기 기말 중3 유사 — 문제·해설 그림 체크

- **Q1 — P/S `EXEMPT`:** 원주각 성질의 문장 참·거짓 문항으로, 별도 그림이 학습 근거를 더하지 않는다.
- **Q2–4 — P/S `NEED`:** Q2는 큰 호의 115° 원주각과 중심각/작은 중심각, Q3는 지름 AB와 54° 직각삼각형, Q4는 25°·75° 원주각에 대응하는 호의 비를 표시하면 이해에 도움이 된다. 현재 원도형은 없고 후속 제작 대상으로 기록했다.
- **Q5 — P/S `NEED`, 렌더 미완:** 원본 코드/SVG의 접선 AT·평행 현 BC 관계와 MD 풀이를 확인했다. 후보 값 50°에서 두 밑각은 각각 65°다. 원본은 40°이므로 자산을 복사하지 않는다.
- **Q6 — P/S `NEED`, 렌더 미완:** 발문에 원주 순서 A-B-C-D와 x=외각 ∠APB를 명시했고, 두 내대각 30°·45°의 합 75°를 검산했다. 그림 자산은 미제작이다.
- **Q7 — P/S `NEED`:** 내접 오각형 ABCDE의 순서와 중심각 COD=64°를 표시하면 ∠B·∠E가 보는 호를 추적하기 쉽다.
- **Q8 — P/S `NEED`:** 현 AB=16, 중점 M, 호까지의 sagitta 4와 직각삼각형 OMA를 보여 주면 반지름 10 cm 풀이가 명확하다.
- **Q9–16 — P/S `EXEMPT`:** 평균·중앙값·최빈값·분산·표준편차의 값과 조건을 발문에 모두 적은 수치·개념 문항이다. Q13은 빠졌던 “변량 9의 편차” 질문을 복원했다.
- **Q17 — P/S `NEED`, 새 배치 명시·렌더 미완:** 유사판에서 A=(2,32), B=(4,28), C=(6,22), D=(8,18), E=(9,14)로 새 이름 대응을 정했다. 원본 배치 복원 주장은 하지 않는다. A의 운동시간 x=2는 최솟값이고 체지방률 y=32는 최댓값이므로 A가 유일한 좌상점이다. 엔진은 점별 이름을 지원하지만 후보 렌더 자산은 미생성.
- **Q18 — P/S `NEED`:** 20개 점에 y=x 기준선을 그려 y≥x와 y>x를 구분하면 학생 수 계산을 확인하기 쉽다.
- **Q19 — P/S `EXEMPT`:** 자동차 주행거리와 남은 연료의 관계 및 다섯 산점도 유형이 말로 설명되어 있어 음의 상관관계를 텍스트만으로 판별할 수 있다.
- **Q20 — P/S `NEED`:** 16개 점과 y=x 기준선을 표시하면 같은 악력인 4명의 개수를 확인하기 쉽다.
- **Q21–22 — P/S `NEED`:** Q21은 내접사각형과 접점 C·접선 CT, Q22는 원 밖 P와 내부 E의 두 현 교점을 표시하면 각 관계 풀이에 도움이 된다. 원도형 배치·렌더 미완.
- **Q23 — P/S `EXEMPT`:** 두 분단의 인원·평균·표준편차를 발문에 명시한 결합분산 계산 문항이다. 원 MD는 A분단 조건이 빠져 있어 해설의 12명·평균 6·표준편차 2를 근거로 후보 발문에 보충했다.
- **Q24 — P/S `NEED`:** 20개 점의 우하향 추세, 같은 y=8의 서로 다른 x, y≤6인 점 8개를 검토하는 산점도다. 해설용 그림에도 세 사실의 근거를 표시하면 유용하다.
- **출처·제작 상태:** Drive 문서에는 표·삽입 그림 객체가 없다. MD sourceArchiveFile 경로는 `archive/exams/` 접두어를 붙여 main의 원본 파일과 결속했다. 점·각 배치는 문서 계획/해설 및 유사판에서 명시적으로 정한 조건으로 검토했다. 후보 전용 SVG·PNG는 만들거나 열지 않았고, 문제·해설 시각화 13문항은 미완으로 남긴다. 2024·2025 연향중 기말 판본은 이 후보와 합치거나 수정하지 않았다.
# 22 왕운중 중3 1학기 중간 유사 — SVG 인계 체크리스트

- Source Doc: `1ab--2F-5AxUioVAGhOXwGLmKSw4YtNrblNwQy8YpLWk` (revision `AHj4eMQq51RdPispYXtc6g9QZjYq9kttIHgNiO1kZlKyo3aJSUAUd5aICf6x37BrEQaiedlSHcJ-6_eO1Us45_dlZWyoHHN7BD7wIXm3tlA`)
- Candidate JS blob SHA-1: `5cc02043c56221aec5288fa4fa7a452cc203d1f4`
- 화면·SVG 렌더 검수: `NOT_RUN`; SVG 제작: `NOT_RUN`.
- `NEED`는 작성 계획/학습 이득이 확인됐으나 자산 미완료, `EXEMPT`는 문제·해설 본문만으로 그림 추가 이득을 확인하지 못했다는 CREATE 판정이다. R2 학생 관점 검토는 완료; SVG 제작·화면 검수는 미완이다.

| 문항 | 문제 그림 | 해설 그림 | 근거 / 남은 작업 |
|---|---|---|---|
| Q01 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q02 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q03 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q04 | `NEED` | `NEED` | 대수 막대의 $x^2$, 두 $3ax$ 직사각형과 제곱의 차 변형을 시각화하면 넓이 구조를 이해하기 쉽다. 문제·해설 그림 모두 미제작. |
| Q05 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q06 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q07 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q08 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q09 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q10 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q11 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q12 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q13 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q14 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q15 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q16 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q17 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q18 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q19 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q20 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q21 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q22 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q23 | `EXEMPT` | `EXEMPT` | 문장·식·수치가 텍스트로 완결되고 별도 그림의 학습 이득을 CREATE 단계에서 찾지 못함. R2 검토 완료; 시각 검수는 미완. |
| Q24 | `NEED` | `NEED` | 밑면과 평행하게 잘라 내는 사각뿔의 닮음비·높이비를 도식화하면 잘려 나간 작은 뿔의 부피 계산을 이해하기 쉽다. 문제·해설 그림 모두 미제작. |

# 22 팔마중 중3 1학기 중간 유사 — SVG 인계 체크리스트

- Source Doc: `1CIecfQYdTanlZBwirIYSRgvk34q5y46NTGP2b7RuMMQ` (revision `AHj4eMQeX-wmYiSGeMUODQOCtIxjvH218cbLhSmksPjHw5V5KiPCA22W2XTNzaXkUrC90KYBG3IglA4KRFze0lEfghRmQjYp2Oi86xDwr_A`)
- Candidate JS blob SHA-1: `a52f2527229fc30378ae12c19a1ebcb56da50f8b`
- Source Doc has 0 inline objects, 0 tables, and 0 positioned objects. No source figure asset was embedded.
- SVG creation/rendering and screen review: `NOT_RUN` by scope. Do not reuse the original exam's different figures without validation.
- The source Doc has no embedded visuals for Q13/Q22. To avoid inventing the missing original layout, the candidate rewrites these as explicit text-defined variations. They are not claimed to reproduce the source figure; changed-qid R1/R2 review completed; Q22 initial perimeter error was disclosed and corrected to 18√5 cm.

| Item | Problem figure | Solution figure | Evidence / remaining work |
|---|---|---|---|
| Q01 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q02 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q03 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q04 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q05 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q06 | `NEED` | `NEED` | 수직선과 정사각형 대각선·거리의 관계를 그리면 좌표 이동과 무리수 위치를 이해하기 쉽다. 그림 자산·렌더 미완.
| Q07 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q08 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q09 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q10 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q11 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q12 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q13 | `NEED` | `NEED` | 후보 variation이 빼는 두 직사각형과 겹치는 $b\times b$ 정사각형을 문장으로 명시한다. 문제·해설 그림은 넓이 관계 이해에 유익하지만 자산·렌더 미완; 원본 배치 재현이 아님.
| Q14 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q15 | `NEED` | `NEED` | 타일의 넓이·개수와 직사각형 구성의 관계를 시각화하면 인수분해가 변의 길이로 이어지는 과정을 보여 줄 수 있다. 그림 자산·렌더 미완.
| Q16 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q17 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q18 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q19 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q20 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q21 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q22 | `NEED` | `NEED` | 후보 variation이 A-B-C 순서와 공통 밑변 배치를 발문에 명시한다. 계단형 외곽 둘레 그림은 도움이 되나 자산·렌더 미완; 원본 배치 재현이 아님.
| Q23 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q24 | `EXEMPT` | `EXEMPT` | 수와 식의 계산·전개·인수분해가 중심이며 문제와 풀이가 텍스트·수식으로 완결되어 추가 도식의 학습 이득이 확인되지 않음.
| Q25 | `NEED` | `NEED` | 두 원의 8등분 조각을 나란히 보이면 한 조각 넓이 차의 1/8 관계를 파악하기 쉽다. 그림 자산·렌더 미완.

# 22 풍덕중 중3 1학기 중간 유사 — SVG/도식 인계 체크리스트

- Source Doc: `1QvctH-loYppqz_9hOQJMnGxYK56vuaULu2vgdjbLf1o` revision `AHj4eMQ4ELrwIe-OCfve34eMS4eyh2CGKVx0jSKy6bj9gSHOu2tqBpi5wm7KzXOf56iP59E1f6cqOrNQnQlWtvBaxVbcLBP_K0U9sXJw9zA`
- Source archive: `archive/exams/original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` (branch blob `cfa2bf6373f18ec4150d424927dcf17204fcab44`)
- Candidate JS blob SHA-1: `4caaf5d6612b488f31dc31f9501291fe3688a376`
- Google Docs table API found one native 6×7 table for Q10; its cell sequence is retained in the candidate as a TeX array.
- Q20 has a source SVG-plan paragraph, but no final image asset or rendered validation is included. SVG creation and screen review were not run by scope.

| Item | Problem visual | Solution visual | Rationale / remaining |
|---|---|---|---|
| Q01 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q02 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q03 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q04 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q05 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q06 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q07 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q08 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q09 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q10 | PRESENT | PRESENT | The verified native 6x7 square-root approximation table is already embedded in the candidate stem as a Markdown table; the same table supports the solution. No separate SVG asset is needed.
| Q11 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q12 | NEED | NEED | A cuboid sketch would help students follow the spatial relationships used in the stem and solution. SVG/asset not created; pending later batch.
| Q13 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q14 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q15 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q16 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q17 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q18 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q19 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q20 | NEED | NEED | The prompt explicitly refers to a rectangle and equal-area square; a diagram helps students map side lengths to equal areas. The Doc includes SVG plan code but no rendered asset is included in the candidate. Asset not created; visual status remains pending.

# 22 풍덕중 중3 1학기 중간 유사 — SVG/도식 인계 체크리스트

- Source Doc: `1QvctH-loYppqz_9hOQJMnGxYK56vuaULu2vgdjbLf1o` revision `AHj4eMQ4ELrwIe-OCfve34eMS4eyh2CGKVx0jSKy6bj9gSHOu2tqBpi5wm7KzXOf56iP59E1f6cqOrNQnQlWtvBaxVbcLBP_K0U9sXJw9zA`
- Source archive: `archive/exams/original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` (branch blob `cfa2bf6373f18ec4150d424927dcf17204fcab44`)
- Candidate JS blob SHA-1: `61d7db63c9473cd4b1a8976a370ff26d0273c874`
- Google Docs table API found one native 6×7 table for Q10; its cell sequence is retained in the candidate as a TeX array.
- Q20 has a source SVG-plan paragraph, but no final image asset or rendered validation is included. SVG creation and screen review were not run by scope.

| Item | Problem visual | Solution visual | Rationale / remaining |
|---|---|---|---|
| Q01 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q02 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q03 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q04 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q05 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q06 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q07 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q08 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q09 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q10 | PRESENT | PRESENT | The verified native 6x7 square-root approximation table is already embedded in the candidate stem as a Markdown table; the same table supports the solution. No separate SVG asset is needed.
| Q11 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q12 | NEED | NEED | A cuboid sketch would help students follow the spatial relationships used in the stem and solution. SVG/asset not created; pending later batch.
| Q13 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q14 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q15 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q16 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q17 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q18 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q19 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q20 | NEED | NEED | The prompt explicitly refers to a rectangle and equal-area square; a diagram helps students map side lengths to equal areas. The Doc includes SVG plan code but no rendered asset is included in the candidate. Asset not created; visual status remains pending.

# 22 풍덕중 중3 1학기 중간 유사 — SVG/도식 인계 체크리스트

- Source Doc: `1QvctH-loYppqz_9hOQJMnGxYK56vuaULu2vgdjbLf1o` revision `AHj4eMQ4ELrwIe-OCfve34eMS4eyh2CGKVx0jSKy6bj9gSHOu2tqBpi5wm7KzXOf56iP59E1f6cqOrNQnQlWtvBaxVbcLBP_K0U9sXJw9zA`
- Source archive: `archive/exams/original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` (branch blob `cfa2bf6373f18ec4150d424927dcf17204fcab44`)
- Candidate JS blob SHA-1: `1453406220c6251efd1daff1cdc05542b5c36f68`
- Google Docs table API found one native 6×7 table for Q10; its cell sequence is retained in the candidate as a TeX array.
- Q20 has a source SVG-plan paragraph, but no final image asset or rendered validation is included. SVG creation and screen review were not run by scope.

| Item | Problem visual | Solution visual | Rationale / remaining |
|---|---|---|---|
| Q01 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q02 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q03 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q04 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q05 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q06 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q07 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q08 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q09 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q10 | PRESENT | PRESENT | The verified native 6x7 square-root approximation table is already embedded in the candidate stem as a Markdown table; the same table supports the solution. No separate SVG asset is needed.
| Q11 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q12 | NEED | NEED | A cuboid sketch would help students follow the spatial relationships used in the stem and solution. SVG/asset not created; pending later batch.
| Q13 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q14 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q15 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q16 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q17 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q18 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q19 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q20 | NEED | NEED | The prompt explicitly refers to a rectangle and equal-area square; a diagram helps students map side lengths to equal areas. The Doc includes SVG plan code but no rendered asset is included in the candidate. Asset not created; visual status remains pending.

# 22 풍덕중 중3 1학기 중간 유사 — SVG/도식 인계 체크리스트

- Source Doc: `1QvctH-loYppqz_9hOQJMnGxYK56vuaULu2vgdjbLf1o` revision `AHj4eMQ4ELrwIe-OCfve34eMS4eyh2CGKVx0jSKy6bj9gSHOu2tqBpi5wm7KzXOf56iP59E1f6cqOrNQnQlWtvBaxVbcLBP_K0U9sXJw9zA`
- Source archive: `archive/exams/original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` (branch blob `cfa2bf6373f18ec4150d424927dcf17204fcab44`)
- Candidate JS blob SHA-1: `1ec292e1cac348059e130c1eb65d5c7933a2c378`
- Google Docs table API found one native 6×7 table for Q10; its cell sequence is retained in the candidate as a TeX array.
- Q20 has a source SVG-plan paragraph, but no final image asset or rendered validation is included. SVG creation and screen review were not run by scope.

| Item | Problem visual | Solution visual | Rationale / remaining |
|---|---|---|---|
| Q01 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q02 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q03 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q04 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q05 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q06 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q07 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q08 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q09 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q10 | PRESENT | PRESENT | The verified native 6x7 square-root approximation table is already embedded in the candidate stem as a Markdown table; the same table supports the solution. No separate SVG asset is needed.
| Q11 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q12 | NEED | NEED | A cuboid sketch would help students follow the spatial relationships used in the stem and solution. SVG/asset not created; pending later batch.
| Q13 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q14 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q15 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q16 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q17 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q18 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q19 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q20 | NEED | NEED | The prompt explicitly refers to a rectangle and equal-area square; a diagram helps students map side lengths to equal areas. The Doc includes SVG plan code but no rendered asset is included in the candidate. Asset not created; visual status remains pending.

# 22 풍덕중 중3 1학기 중간 유사 — SVG/도식 인계 체크리스트

- Source Doc: `1QvctH-loYppqz_9hOQJMnGxYK56vuaULu2vgdjbLf1o` revision `AHj4eMQ4ELrwIe-OCfve34eMS4eyh2CGKVx0jSKy6bj9gSHOu2tqBpi5wm7KzXOf56iP59E1f6cqOrNQnQlWtvBaxVbcLBP_K0U9sXJw9zA`
- Source archive: `archive/exams/original/middle/m3/1mid/22_풍덕중_1학기_중간_중3_기출.js` (branch blob `cfa2bf6373f18ec4150d424927dcf17204fcab44`)
- Candidate JS blob SHA-1: `1ec292e1cac348059e130c1eb65d5c7933a2c378`
- Google Docs table API found one native 6×7 table for Q10; its cell sequence is retained in the candidate as an AP Table Engine pipe table.
- Q20 has a source SVG-plan paragraph, but no final image asset or rendered validation is included. SVG creation and screen review were not run by scope.

| Item | Problem visual | Solution visual | Rationale / remaining |
|---|---|---|---|
| Q01 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q02 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q03 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q04 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q05 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q06 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q07 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q08 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q09 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q10 | PRESENT | PRESENT | The verified native 6x7 square-root approximation table is already embedded in the candidate stem as a Markdown table; the same table supports the solution. No separate SVG asset is needed.
| Q11 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q12 | NEED | NEED | A cuboid sketch would help students follow the spatial relationships used in the stem and solution. SVG/asset not created; pending later batch.
| Q13 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q14 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q15 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q16 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q17 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q18 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q19 | EXEMPT | EXEMPT | Question and solution are algebraic/numeric and self-contained in text and formulas; no distinct diagram/table is required for student understanding.
| Q20 | NEED | NEED | The prompt explicitly refers to a rectangle and equal-area square; a diagram helps students map side lengths to equal areas. The Doc includes SVG plan code but no rendered asset is included in the candidate. Asset not created; visual status remains pending.
