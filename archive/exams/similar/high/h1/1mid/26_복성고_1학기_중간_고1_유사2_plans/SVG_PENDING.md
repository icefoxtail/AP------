# 2026 복성고 고1 1학기 중간 발전형 유사2 — SVG 후속 장부

- 운영 JS: `archive/exams/similar/high/h1/1mid/26_복성고_1학기_중간_고1_유사2.js`
- 원고 Git blob SHA-1: `e2ba21487f24ff49f9c5af9c524772f2e23c8447`
- 문제용 필수 이미지: **0/24건**; 24건 모두 `EXEMPT`. 각 문제는 필요한 수식·좌표·도형 관계를 발문에서 구체적으로 정의한다.
- 해설용 그림: **4/24건 `SVG_TO_CREATE`**, 나머지 20건 `EXEMPT` (풀이와 재현 가능한 수식·좌표가 해설에 포함).
- 계획 JSON: **4건 작성**, 공식 엔진 `--shallow` 검사 **4/4 OK**. 전체 엔진 lint는 `NotoSansKR.ttf` 의존 파일 부재로 `ENVIRONMENT_BLOCKED`.
- 실제 SVG 렌더 **0/4 `NOT_RUN`**, PNG 생성·육안검수 **0/4 `NOT_RUN`**, 학생 게시 `NOT_RUN`.
- 미제작 `solutionImage` 경로는 JS에 기입하지 않는다.

| 문항 | 종류 | 계획 JSON | 상태 | 후속 작업 |
| --- | --- | --- | --- | --- |
| Q09 | 해설용 | `q09-solution.plan.json` | `SVG_TO_CREATE` | 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |
| Q16 | 해설용 | `q16-solution.plan.json` | `SVG_TO_CREATE` | 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |
| Q18 | 해설용 | `q18-solution.plan.json` | `SVG_TO_CREATE` | 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |
| Q22 | 해설용 | `q22-solution.plan.json` | `SVG_TO_CREATE` | 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |

후속 담당자는 공식 SVG 엔진 환경에서 각 계획의 전체 lint → 엔진 렌더 → 수학·시각 PNG 검수 → 검증된 해설 그림의 `solutionImage` 연결 순서로 처리한다. Q19의 원은 무리수 반지름을 포함하고, 학생용 발문과 좌표식·분기 해설만으로 유일한 풀이가 가능해 시각 보조를 `EXEMPT`로 판정했다.
