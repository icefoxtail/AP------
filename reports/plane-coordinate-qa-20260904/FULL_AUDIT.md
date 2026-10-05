# 고1 「평면좌표」 핀포인트 전수검수

- 기준 시작 `origin/main`: `58b69d4ab32bd14392c423e047461a15e842b4e4`
- 작업 브랜치: `codex/fix-h1-plane-coordinate-qa-20260904`
- 최신 main 재확인 시점의 `origin/main`: `cf79da39f752790c274818634268783423b12528` (동시 작업 커밋이 시작 후 추가됨; 최종 merge 전에 반영)
- 기준 전 inventory: 27 JS / 96 unique question objects
  - H15-SA-09: 69
  - H22-C2-01: 27
- 최종 canonical inventory: 27 JS / 95 objects
  - H15-SA-09: 68
  - H22-C2-01: 27
  - H15-SA-10으로 교정 이동: 1 (`24 금당고 1학기 기말 q5`)
- 전수 coverage: 기준 96/96 objects; `content`, `choices`, `answer`, `solution`, `solutionImage`, standard/subunit metadata, tags, questionType, JS runtime을 모두 검사
- 독립 수학 검산: 96/96 PASS, 수학 오류 0건

## 전체 문항 coverage

아래 ID 목록은 최신 기준으로 직접 로드한 JS questionBank의 전수 목록이다. `q5` 이동 항목은 기준 96개에 포함하여 검산했으며, 최종 canonical 평면좌표 집계에서는 H15-SA-10으로 별도 집계했다.

| 시험지 | qCount | 독립 검산 대상 ID |
|---|---:|---|
| 22 금당고 1final | 4 | 3, 8, 9, 10 |
| 22 매산고 1final | 4 | 4, 8, 17, 20 |
| 22 복성고 1final | 2 | 11, 16 |
| 22 순천여고 1final | 5 | 1, 9, 10, 16, 20 |
| 22 제일고 1final | 5 | 5, 6, 7, 8, 9 |
| 22 팔마고 1final | 3 | 2, 3, 18 |
| 22 효천고 1final | 6 | 1, 3, 7, 8, 18, 22 |
| 23 강남여고 1final | 6 | 2, 3, 4, 17, 20, 25 |
| 23 금당고 1final | 3 | 1, 8, 13 |
| 23 매산고 1final | 7 | 1, 4, 5, 15, 16, 18, 20 |
| 23 복성고 1final | 3 | 3, 10, 17 |
| 23 순천여고 1final | 5 | 1, 8, 14, 17, 22 |
| 23 팔마고 1final | 2 | 1, 21 |
| 24 금당고 1final | 6 | 2, 3, 5, 15, 17, 19 |
| 24 매산고 1final | 5 | 3, 4, 8, 12, 20 |
| 23 충무고 1mid | 1 | 17 |
| 24 제일고 1mid | 5 | 10, 11, 12, 13, 18 |
| 21 제일고 2final | 1 | 3 |
| 22 강남여고 2mid | 3 | 1, 5, 6 |
| 23 순천여고 2mid | 1 | 16 |
| 24 금당고 2mid | 2 | 16, 20 |
| 25 금당고 2mid | 4 | 1, 7, 9, 10 |
| 25 매산고 2mid | 2 | 9, 16 |
| 25 순천고 2mid | 1 | 3 |
| 25 순천여고 2mid | 4 | 2, 3, 8, 9 |
| 25 제일고 2mid | 3 | 10, 11, 20 |
| 25 효천고 2mid | 3 | 1, 14, 21 |
| **합계** | **96** | **96/96** |

## 독립 검산 범위

- 좌표·거리: 두 점 거리, 점–직선 거리, 축 조건, 대칭/최단거리
- 내분·외분: 내부/외부 위치와 좌표 공식, 선분 전체 조건
- 무게중심·넓이: 좌표 평균, 평행사변형 대각선, 삼각형 넓이비
- 도형 관계: 각의 이등분선, 내심·접선·닮음, 정사각형/마름모의 수직·동일 길이
- 자취·최적화: 거리합 반사, 거리제곱합, 넓이비와 AM-GM, 직선/원 자취
- 객관식: 제시 선택지와 독립 계산 결과의 일치 및 유일성
- 서술형/단답형: 조건만으로 답이 확정되는지, answer와 solution 결론 일치

## 변경 내역

### SVG 6건

1. `22 제일고 1final q6`: 무관한 `P(-1,4), Q(7,8)` 제거; 실제 `A(0,4), B(3,1), C(-3/2,11/2), O(0,0)`와 `[OBC]=3[OAC]` 표시
2. `22 순천여고 1final q10`: `P1(3,4)`를 실제 점명 `D(3,4)`로 교정하고 `BD:DC=3:1`, 넓이비를 표시
3. `25 금당고 2mid q10`: `AB=(-4,3)`을 점으로 오인하던 그림 제거; 실제 A/B/C/D 정사각형, `CD` 기울기 `-3/4`, y절편 `37/4` 표시
4. `25 효천고 2mid q14`: `P1(-1,-0.4)`를 `D(-1,-2/5)`로 교정
5. `25 효천고 2mid q21`: `P2` 제거; 가능한 두 점을 `C₁(-4,0)`, `C₂(-28,-36)`로 명시
6. `25 순천고 2mid q3`: 네 번째 꼭짓점 오표기 `A(1,-3)`을 `C(1,-3)`으로 교정

6개 모두 XML parse, viewBox/aspect, equal-unit 축척 metadata, forbidden SVG math, 좌표 label identity, 기울기/절편/거리비/도형 topology 독립 검산 PASS.

### subUnitKey / subUnit

| 문항 | before | after | 판정 |
|---|---|---|---|
| 22 복성고 1final q11 | `H15-SA-09-COORDINATE_METRIC` / 좌표와 거리 | `H15-SA-09-GEOMETRY_APPLICATION` / 도형의 방정식 활용 | 실제 핵심이 이등변삼각형 내접 직사각형 넓이 최댓값 |
| 23 충무고 1mid q17 | `H15-SA-09-GEOMETRY_EQUATION` / 도형의 방정식 | `H15-SA-09-GEOMETRY_RELATION` / 도형의 관계 | 내심·접선·평행·닮음·넓이 관계 |
| 24 금당고 2mid q16 | `H15-SA-09-GEOMETRY_EQUATION` / 도형의 방정식 | `H15-SA-09-GEOMETRY_APPLICATION` / 도형의 방정식 활용 | 사각형 넓이비와 AM-GM 최솟값 |
| 24 금당고 1final q5 | `H15-SA-09` / 평면좌표; `COORDINATE_METRIC` / 좌표와 거리 | `H15-SA-10` / 직선의 방정식; `DISTANCE_ANGLE` / 직선 사이의 거리와 각 | 점–직선 거리 공식 |
| 24 금당고 1final q15 | `H15-SA-09-TRIANGLE_CENTROID_AREA` / 삼각형의 좌표와 무게중심 | `H15-SA-09-COORDINATE_METRIC` / 좌표와 거리 | 정삼각형 변 위 점의 거리제곱합 최솟값 |
| 24 매산고 1final q12 | `H15-SA-09-COORDINATE_METRIC` / 좌표와 거리 | 유지 | 좌표 넓이 공식과 두 x축 점 사이 거리 |
| 24 매산고 1final q20 | `H15-SA-09-COORDINATE_METRIC` / 좌표와 거리 | `H15-SA-09-LOCUS_RATIO` / 거리 조건과 자취 | 거리제곱합으로 원의 자취 |
| 24 제일고 1mid q11 | `H22-C2-01-GEOMETRY_EQUATION` / 도형의 방정식 | `H22-C2-01-COORDINATE_METRIC` / 평면좌표와 거리 | 4등분점 단순 내분 계산 |
| 25 순천여고 2mid q2 | `H22-C2-01-GEOMETRY_EQUATION` / 도형의 방정식 | `H22-C2-01-COORDINATE_METRIC` / 평면좌표와 거리 | 두 점 사이 거리 |

8개 key/subUnit 수정, 1개 유지 판정.

### tags / questionType

- solutionImage 또는 실제 도형 자산이 있고 `도형`이 누락된 32문항에 `도형` 보강
- 24 금당고 1final q19에 누락된 `서술형` 보강
- 23 강남여고 1final q25: `questionType 단답형 → 서술형`, tags `[] → [서술형, 도형]`; 발문이 풀이 과정 서술을 요구하는 것과 일치
- 태그 추가 총 33 field changes; questionType 1 field change

### solution 2건

- 23 강남여고 1final q4: 평균의 이유를 계산 앞에 두고 정답 결론을 마지막으로 이동
- 24 금당고 1final q3: 중점 공식의 이유를 계산 앞에 두고 정답 결론을 마지막으로 이동
- answer와 계산은 변경하지 않음

## 보호·구조 게이트

- 보호 필드 `content`, `choices`, `answer`: 기준 96개 전체 diff 0
- 수정 JS: 22 files; 허용 변경 field만 존재
- 수정 SVG: 6 files; solutionImage path는 보존
- canonical compiled master: 요청 key 전부 등록, parent/label 정합 PASS
- JS syntax/VM: 27/27 PASS
- question-index: 최신 JS metadata/tag 반영, qKey 중복 0

## 브라우저 evidence

`engine-browser-harness.html`이 최신 격리 worktree의 27개 production JS를 iframe으로 순차 로드하고, `exam/sol/ans` 각각에 대해 q-number/answer count, 마지막 문항, image naturalWidth, MathJax/visual element, page/q-box overflow, load-error를 검사한다. 최종 실행 결과는 같은 디렉터리의 `browser_render_check.md`에 기록한다.
