# 중1 유사시험지 SVG 체크리스트

수정 시각: 2026-11-12 · 담당 누적 브랜치: `work/similar-m1-accumulate` · 원격 이전 기준: `a352d192b` · 확인한 main snapshot: `f3d9320f6`

## 상태 규칙

- `필요·미완`: 현재 버전에 필요한 그림이 없거나, variant에 맞는지 확인되지 않았습니다. SVG는 만들지 않았습니다.
- `불필요`: 현재 발문/해설 텍스트로 풀 수 있다고 확인한 상태입니다. 원본 그림이 있으면 참고 경로만 적고 variant에 복사하지 않았습니다.
- `미확인`: 별도 문제/해설 그림이 필요한지 또는 기존 자산을 재사용할 수 있는지 확인이 남았습니다.
- `있음·참조됨`: 지정 버전의 JS가 자산을 참조하고 파일이 존재합니다. 이번 작업에서 화면/렌더 검수는 하지 않았으며 기존 결과를 보존합니다.
- 원본 기출 자산, 유사시험지 main 릴리스, 누적 브랜치 초안은 서로 다른 버전입니다. 경로 존재만으로 서로 대체할 수 있다고 보지 않습니다.

## 지정 문항 빠른 재확인

- **26 신흥중 2학기 중간 Q9 (main 릴리스):** 두 각의 위치를 나타내는 문제 SVG `q09.svg`는 참조되고 파일이 있습니다. 해설은 꺾인 점을 지나는 평행 보조선을 사용하지만 해설 SVG 연결은 없습니다. 해설 그림 필요성/제작 여부는 미확인으로 남깁니다.
- **24 연향중 2학기 기말 Q7:** 선분 AB를 지름으로 하는 반원을 A 중심으로 45° 회전한 어두운 부분 둘레 문항입니다. 후보 문제 그림과 유사 JS 연결이 없어 문제 그림은 필요·미완입니다. 원본 q7 그림과 해설 SVG는 존재하지만 수치가 달라 재사용할 수 있는지 확인되지 않았습니다. 해설 그림은 미확인입니다.
- **24 연향중 2학기 기말 Q23:** 어두운 부분을 직선 l을 축으로 회전시키는 회전체 문항입니다. 축과 도형 배치를 보여줄 후보 그림이 없어 문제 그림은 필요·미완입니다. 원본 q23 그림/해설 SVG 존재 여부만 확인했고 variant와 일치하지 않아 재사용하지 않았습니다. 해설 그림은 미확인입니다.
- **24 향림중 2학기 기말 Q23:** 직각삼각형에서 직사각형을 제외한 영역을 직선 l 주위로 회전해 부피를 구합니다. 회전축 및 제거할 직사각형의 배치가 필요하므로 후보 문제 그림은 필요·미완입니다. 원본 q23 이미지/해설 SVG는 존재하지만 유사 수치에 맞는 자산인지 확인하지 않았습니다. 해설 그림 필요성은 미확인입니다.
- **23 동산중 1학기 중간 유사 Q15:** 문제 q15.svg는 존재·참조됨. 해설이 참조하는 q15-solution.svg는 파일이 없어 해설 그림 필요·미완입니다.

### 25_팔마중_2학기_중간_중1_유사2 — 신규 Drive 판본

- Drive 문서 `1Wlrc5c5_K3xWD4HH4Gj1Wv5w-cdwiKxjk82KBsLxG20`에서 이식. main의 기존 `25_팔마중_2학기_중간_중1_유사` (`7a76eae71ce26b21b0d5c326889ba5b415793541`)과 다른 전체 24문항 판본이며, 특히 Q2·Q3의 조건/답이 다릅니다. 기존 JS와 기존 에셋은 수정하지 않았습니다. 새 identity `25_팔마중_2학기_중간_중1_유사2`을 별도 경로로 사용합니다.
- 발문과 해설을 문항별로 따로 읽은 결과, Q08과 Q20은 문제·해설 그림이 각각 필요하며 후보 JS 연결은 아직 없습니다. 나머지 22문항은 새 판본 텍스트와 풀이를 직접 확인해 별도 그림 불필요로 판정했습니다. 48개 계획 파일은 문제·해설 각각의 실제 판정 상태를 기록합니다. 기존 main판 SVG는 재사용하지 않았고, SVG는 만들지 않았습니다.
- 문항 계산·보기·답을 대조해 Q2 정답 ④와 Q3 정답 ③을 확인했습니다. Q3·Q13의 단위 TeX 간격을 바로잡고, Q5에는 O가 AD와 BE 선분의 내부에 있고 OB가 ∠AOC 안에 있다는 조건을 명시해 답의 유일성을 보완했습니다. 검수 승인/PASS는 표시하지 않았습니다.

| Q | 문제 그림 필요·현재 상태 | 해설 그림 필요·현재 상태 | 이유 및 구판 자산 상태 |
|---:|---|---|---|
| Q01 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 다면체의 절단 입체도형에서 교점(꼭짓점)과 교선(모서리)의 개수 계수 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q01.svg`; 이전 main판 해설 그림 참조 없음 |
| Q02 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 한 직선 위의 서로 다른 두 점으로 결정되는 직선의 동일성 판별 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q02.svg`; 이전 main판 해설 그림 참조 없음 |
| Q03 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 선분의 배수 관계와 중점을 이용한 길이의 일차방정식 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q03.svg`; 이전 main판 해설 그림 참조 없음 |
| Q04 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 수직이등분선의 정의, 수선의 발, 점과 직선 사이의 거리 관계 판별 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q04.svg`; 이전 main판 해설 그림 참조 없음 |
| Q05 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | O가 두 선분의 내부이고 OB가 ∠AOC 안임을 명시한 뒤에는 90° 직각 관계와 선형식만으로 풀 수 있어 별도 그림 불필요; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q05.svg`; 이전 main판 해설 그림 참조 없음 |
| Q06 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 공간에서 두 직선의 위치 관계 및 평면의 결정 조건 참·거짓 판별 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q07 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 정육면체에서 꼬인 위치 모서리 수와 수직으로 만나는 모서리 수 계수 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q07.svg`; 이전 main판 해설 그림 참조 없음 |
| Q08 | 필요·미완 — 새 후보 도형 없음 | 필요·미완 — 새 해설 그림 없음 | 두 평행선 쌍을 가로지르는 꺾인 선의 배치와 x,y,z 위치가 발문에 고정되지 않아 도형 배치를 보여야 합니다. 해설도 보조 평행선과 동측내각 위치를 표시해야 합니다. 이전 main q08.svg는 42°·38° 판본이며 p,q/y,z가 없어 부적합; 보존·미재사용. |
| Q09 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 삼각형의 작도 가능 순서와 미확정 점에 대한 선행 작도 불가능성 판별 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q10 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 크기가 같은 각 작도 과정에서 반지름과 현의 길이 관계 판별 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q10.svg`; 이전 main판 해설 그림 참조 없음 |
| Q11 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 삼각형 형성 부등식 위반 사례 및 닮음 삼각형 무수 다수 사례 판별 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q12 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 한 변과 한 각이 주어진 상태에서 SAS 합동을 완성하는 대응변 조건 식별 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q12.svg`; 이전 main판 해설 그림 참조 없음 |
| Q13 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 삼각형 합동 대응점 순서에 따른 대응각 계산 및 대응변 길이 합산 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q13.svg`; 이전 main판 해설 그림 참조 없음 |
| Q14 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 정사각형과 외부 정삼각형 결합에서 생성된 이등변삼각형의 밑각 합산 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q14.svg`; 이전 main판 해설 그림 참조 없음 |
| Q15 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 두 삼각형의 내각의 합 성질을 독립 적용하여 네 각의 합을 계산하는 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q15.svg`; 이전 main판 해설 그림 참조 없음 |
| Q16 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 정다각형의 내각과 외각의 비례배분 및 외각의 합을 이용한 변의 수 판별 기본 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q17 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 삼각형 외각과 평행선 엇각을 매개로 이등변삼각형의 밑각을 계산하는 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q17.svg`; 이전 main판 해설 그림 참조 없음 |
| Q18 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 대각선 개수 이차방정식 모델링 및 다각형 내각 총합 공식 적용 기본 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q19 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 원 위의 점들로 만들 수 있는 선분의 개수 조합 계수 기본 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q19.svg`; 이전 main판 해설 그림 참조 없음 |
| Q20 | 필요·미완 — 새 후보 도형 없음 | 필요·미완 — 새 해설 그림 없음 | 정오각형의 꼭짓점 순서, 24° 아래 변, 위쪽 변 x의 위치를 특정할 그림이 필요합니다. 해설은 외각 72° 두 번의 방향 변화를 표시해야 합니다. 이전 main q20.svg는 14° 판본이라 부적합; 보존·미재사용. |
| Q21 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 두 삼각형의 교각 맞꼭지각을 매개로 한 미지각 계산 서술형 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q21.svg`; 이전 main판 해설 그림 참조 없음 |
| Q22 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 정삼각형 외곽 결합 도형에서의 SAS 삼각형 합동 증명 서술형 문항; 이전 main판 문제 그림 보존·미재사용: `archive/assets/images/25_팔마중_2학기_중간_중1_유사/q22.svg`; 이전 main판 해설 그림 참조 없음 |
| Q23 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 외각 크기로부터 정다각형의 변의 수를 구하고 대각선 및 분할 삼각형 공식을 합산하는 서술형 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
| Q24 | 불필요 — 발문 직접 검토, 후보 JS 연결 없음 | 불필요 — 해설 직접 검토, 계획 `EXEMPT` | 대각선 분할 영역의 모서리 계수 원리로 다각형을 역산하고 내외각 합을 구하는 서술형 문항; 이전 main판 문제 그림 참조 없음; 이전 main판 해설 그림 참조 없음 |
## 현재 작업한 시험지

### 24_연향중_2학기_기말_중1_유사

- 버전: 누적 브랜치 초안 (`ce58c5a / 37566cf`); 23문항. 유사 JS의 `image`/`solutionImage` 연결은 0개이며, 유사 버전 asset 폴더도 없습니다.
- 원본 기출 JS가 참조한 파일은 `origin/main`의 `archive/assets/images/`에서 실제 존재를 확인했습니다. 숫자·조건이 바뀐 그림은 재사용하지 않습니다.

| Q | 문제 그림 필요·현재 상태 | 해설 그림 필요·현재 상태 | 이유 및 참고 자산 |
|---:|---|---|---|
| Q01 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 다각형의 기본 정의 및 외각·내각 성질에 대한 진위 판정 문항 |
| Q02 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q2-solution.svg`; 정다각형 한 내각의 크기 계산 기본 수식 문항 |
| Q03 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q3.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q3-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q04 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q4.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q4-solution.svg`; 다각형의 대각선의 개수 공식을 실생활 악수 상황에 적용한 문항 |
| Q05 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q5-solution.svg`; 원과 부채꼴, 현의 성질에 관한 개념 진위 판정 문항 |
| Q06 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q6.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q6-solution.svg`; 부채꼴의 넓이와 중심각 크기의 정비례 관계를 이용한 일차방정식 비례식 문항 |
| Q07 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q7.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q7-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q08 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q8-solution.svg`; 각기둥, 각뿔, 각뿔대, 정다면체의 구성 요소 및 성질에 대한 개념 판정 문항 |
| Q09 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q9.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q9-solution.svg`; 조건에 따른 다면체의 모서리 수 역산 및 명칭 판별 문항 |
| Q10 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q10-solution.svg`; 회전체의 회전축을 포함하는 평면으로 자른 단면의 형태 판정 문항 |
| Q11 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q11.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q11-solution-v2.svg`; 축에서 떨어진 평면도형의 회전체 및 수직 단면의 기하학적 형태 판정 문항 |
| Q12 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q12.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q12-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q13 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q13.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q13-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q14 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q14.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q14-solution.svg`; 원뿔의 부피 공식을 활용한 두 컵의 용량 배수 비교 문항 |
| Q15 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q15.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q15-solution.svg`; 구의 부피 및 겉넓이 공식의 닮음비/거듭제곱비 연계 계산 문항 |
| Q16 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q16.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q16-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q17 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 상대도수 분포표의 합 1 성질을 이용한 특정 계급 도수 역산 문항 |
| Q18 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q18.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q18-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q19 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 도수와 상대도수 표의 미지수를 총도수 식과 합 1 성질로 산출하는 문항 |
| Q20 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 상대도수 합을 백분율로 환산하는 기본 통계 계산 문항 |
| Q21 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q21.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q21-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q22 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q22.png`; 해설 원본: 참조 없음; 정다면체의 2가지 정의 요건 기술 및 준정다면체의 비적합 사유 서술 문항 |
| Q23 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q23.png`; 해설 원본: 있음 `assets/images/24_연향중_2학기_기말_중1_기출/q23-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |

### 24_향림중_2학기_기말_중1_유사

- 버전: 누적 브랜치 초안 (`c4a83f8 / 2e9e41a`); 24문항. 유사 JS의 `image`/`solutionImage` 연결은 0개이며, 유사 버전 asset 폴더도 없습니다.
- 원본 기출 JS가 참조한 파일은 `origin/main`의 `archive/assets/images/`에서 실제 존재를 확인했습니다. 숫자·조건이 바뀐 그림은 재사용하지 않습니다.

| Q | 문제 그림 필요·현재 상태 | 해설 그림 필요·현재 상태 | 이유 및 참고 자산 |
|---:|---|---|---|
| Q01 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q1-solution.svg`; 원, 현, 할선, 부채꼴의 기본 정의 진술 판별 문항 |
| Q02 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 참조 없음; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q2-solution.svg`; 면의 수와 옆면 모양 조건으로 각뿔대 식별 대수 문항 |
| Q03 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q3.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q3-solution-v2.svg`; 원뿔대 축단면 기하 형태 판정 문항 |
| Q04 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q4.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q4-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q05 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 변량, 계급, 도수, 상대도수 총합 기본 성질 판별 문항 |
| Q06 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q6.png`; 해설 원본: 참조 없음; 도수분포표 조건 이상 계급 도수 합산 문항 |
| Q07 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q7.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q7-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q08 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q8.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q8-solution-v3.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q09 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q9.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q9-solution-v2.svg`; 정다면체 정의 필수 조건(꼭짓점당 면의 수 일치) 판별 문항 |
| Q10 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q10.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q10-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q11 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q11.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q11-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q12 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q12.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q12-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q13 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q13.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q13-solution.svg`; 히스토그램 구간 도수 백분율 산출 대수 문항 |
| Q14 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q14.png`; 해설 원본: 참조 없음; 도수분포표 배수 조건 연립 일차방정식 대수 문항 |
| Q15 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q15.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q15-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q16 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q16.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q16-solution.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q17 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q17.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q17-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q18 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q18.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q18-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q19 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q19.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q19-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q20 | 불필요 — 현재 후보 텍스트로 해결 가능 | 불필요 — 별도 해설 그림 없이 텍스트 풀이 | 문제 원본: 참조 없음; 해설 원본: 참조 없음; 대화형 상대도수 결측치 복원 및 특정 구간 도수 역산 대수 문항 |
| Q21 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q21.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q21-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q22 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q22.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q22-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q23 | 필요·미완 — 유사 JS 연결/자산 없음 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q23.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q23-solution-v2.svg`; variant 재사용 불가: The main original exam image exists, but its source question parameters differ from the similar-exam MD; reusing it would show conflicting data. Keep the problem visual unresolved until a matching asset is available. |
| Q24 | 불필요 — 현재 후보 텍스트로 해결 가능 | 미확인 — 유사 JS 해설 그림 없음; 원본 SVG 있음, 호환성 미검토 | 문제 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q24.png`; 해설 원본: 있음 `assets/images/24_향림중_2학기_기말_중1_기출/q24-solution.svg`; 줄기와 잎 그림 작성 서술형 문항 |

### 26_신흥중_2학기_중간_중1_유사 — main에 이미 릴리스된 버전

- main JS blob `53fbe5cc11154d69a172c101d3d46c1ad77ee8d8` (역사상 공개 릴리스 `a74a77039`); 24문항. 문제 SVG 18개가 JS에 연결되어 파일도 존재합니다. 이 기존 릴리스와 SVG는 보존합니다.
- 누적 브랜치에는 별도 초안 commit `7a8584102`가 있어 main 릴리스와 내용/그림 연결이 다릅니다. 중복 보정이나 병합은 하지 않고, owner 확인 전 해당 초안을 더 수정하지 않습니다.
- main 릴리스의 해설 `solutionImage` 연결은 0개입니다. 텍스트 해설을 유지하며, 별도 해설 그림 필요 여부가 명확하지 않은 문항은 미확인으로 둡니다.

| Q | 문제 그림 필요·현재 상태 | 해설 그림 필요·현재 상태 | 이유 및 참고 자산 |
|---:|---|---|---|
| Q01 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q01.svg` 존재; 해설: 참조 없음 |
| Q02 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q02.svg` 존재; 해설: 참조 없음 |
| Q03 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q03.svg` 존재; 해설: 참조 없음 |
| Q04 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q04.svg` 존재; 해설: 참조 없음 |
| Q05 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q06 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q06.svg` 존재; 해설: 참조 없음 |
| Q07 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q07.svg` 존재; 해설: 참조 없음 |
| Q08 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q08.svg` 존재; 해설: 참조 없음 |
| Q09 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q09.svg` 존재; 해설: 참조 없음; 해설은 꺾인 점을 지나는 평행 보조선을 사용하므로 보조선 그림 필요성 확인 |
| Q10 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q11 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q12 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q12.svg` 존재; 해설: 참조 없음 |
| Q13 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q13.svg` 존재; 해설: 참조 없음 |
| Q14 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q15 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q15.svg` 존재; 해설: 참조 없음 |
| Q16 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q16.svg` 존재; 해설: 참조 없음 |
| Q17 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q18 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q18.svg` 존재; 해설: 참조 없음 |
| Q19 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q19.svg` 존재; 해설: 참조 없음 |
| Q20 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q20.svg` 존재; 해설: 참조 없음 |
| Q21 | 불필요 — main 릴리스는 텍스트 조건만 사용 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: 별도 파일 없음; 해설: 참조 없음 |
| Q22 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q22.svg` 존재; 해설: 참조 없음 |
| Q23 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q23.svg` 존재; 해설: 참조 없음 |
| Q24 | 필요·있음·참조됨 — 기존 main SVG 보존 | 미확인 — main에는 별도 해설 그림 없음; 필요성 판정 안 됨 | 문제: `assets/images/26_신흥중_2학기_중간_중1_유사/q24.svg` 존재; 해설: 참조 없음 |

### 23_동산중_1학기_중간_중1_유사 — main에서 지정된 Q15

- 기존 main JS를 변경하지 않았습니다. 문제 SVG는 참조되고 파일이 존재합니다. 해설 SVG는 JS가 참조하지만 파일이 없어 미완입니다.

| Q | 문제 그림 필요·현재 상태 | 해설 그림 필요·현재 상태 | 이유 및 참고 자산 |
|---:|---|---|---|
| Q15 | 필요·있음·참조됨 — `archive/assets/images/23_동산중_1학기_중간_중1_유사/q15.svg` | 필요·미완 — JS가 `q15-solution.svg`를 참조하나 파일 없음 | 정육면체 전개도 접기와 마주 보는 면 쌍을 시각적으로 확인해야 합니다. 해설은 면 짝을 판정하지만 해설 SVG가 누락되어 있습니다. |

## 다음 소스 큐와 소유 상태

아직 문항별 시각 감사를 하지 않은 소스는 qid를 추정하지 않고 `미확인`으로 둡니다. 소유가 불명확하거나 다른 라인 소유인 자료는 해당 담당 확인 전 시작하지 않습니다.

| 시험지 / Drive 문서 ID | 상태 | qid별 문제·해설 그림 체크 |
|---|---|---|
| 24_왕운중_2학기_기말_중1_유사_일체형.md · `1EQ6zG8UtSudqfmKB0uE1VE8FuWVo6f95TtsZD0oDnxk` | 다른 담당 소유로 지정됨 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 24_율촌중_2학기_기말_중1_유사_일체형.md · `1sR5BvEfmkr6YY8G169qJWfQeqrOoS5lPZ14sumvCEpg` | 다른 담당 소유로 지정됨 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_왕의중_2학기_중간_중1_유사_일체형.md · `1QO3dZdsgkZZZDxmPRI-CxTz4vs_MBoPNyH5LfRuc8-s` | 소유 미확인; 시작 전 확인 필요 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_왕운중_2학기_중간_중1_유사_일체형.md · `10LZncPDCk_0MhVbcWSNOv5Hq3SbE9vU8E8vGTFO6fgg` | 소유 미확인; 시작 전 확인 필요 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_연향중_2학기_중간_중1_유사_일체형.md · `1n78zw5jQbaC-z7HKvv8bruFYl_ZKsq3g_3EybyNEln4` | 소유 미확인; 시작 전 확인 필요 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_동산중_2학기_중간_중1_유사_일체형.md · `1YUv356UxR7kRkSKSnPYYUzMGbtzarARK324g7QMLr5w` | 소유 미확인; 시작 전 확인 필요 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_풍덕중_2학기_기말_중1_유사_일체형.md · `1VUqpXMKDMa6IZBQzSwJhANkz0dxhLrAeXuiBKKMp954` | 기존 PR/다른 라인 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_팔마중_2학기_기말_중1_유사_일체형.md · `1l4TvwU9Qtj6w5FI22d1_X7zag15mclb96sYgm2HB5BY` | 기존 PR/다른 라인 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_연향중_2학기_기말_중1_유사_일체형.md · `1SOaYOsN1m5_0t1ePwk5Tf7bf4Ey6lmGBN4E8Y8Zv8rY` | 기존 PR/다른 라인 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_신흥중_2학기_기말_중1_유사_일체형.md · `1338HujciqDOoBmGOF-yF_DJtVvRvKOk5RpjtM4rsukw` | 다른 라인 할당 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_동산중_2학기_기말_중1_유사_일체형.md · `1DfejCYGuMbuW9r_tpY38RBMhlhqe6ge7WGH5b7c8Ux0` | 다른 라인 할당 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 25_왕의중_2학기_기말_중1_유사_일체형.md · `10YkX-QQ4HMDr-Bd_JCWlBzgofNNeECC1UoDAAYSOVQw` | 다른 라인 할당 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 26_팔마중_2학기_중간_중1_유사_일체형.md · `1QIoZclBQwi-TJFee9MVFnxb7ebUjZwiamgKRlTGXVLc` | 다른 Codex 라인 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |
| 26_왕운중_2학기_중간_중1_유사_일체형.md · `1FJp0KU-vKHBBHMUojKknSFb1A6vszZZQP7WQQR-pznQ` | 다른 Codex 라인 | 미확인 — 문항 수와 그림 필요 여부를 읽지 않음; 소유 확인 뒤 qid별 추가 |

다음 담당자는 이 표의 큐에서 소유를 먼저 확인하고, 인수한 시험지의 모든 qid에 문제/해설 두 칸을 채웁니다. 소유가 확인되기 전에는 기존 작업을 덮거나 새 SVG를 만들지 않습니다.
