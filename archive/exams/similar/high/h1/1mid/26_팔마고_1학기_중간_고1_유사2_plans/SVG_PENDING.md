# 2026 팔마고 고1 1학기 중간 발전형 유사2 — SVG 후속 장부

- 운영 JS: `archive/exams/similar/high/h1/1mid/26_팔마고_1학기_중간_고1_유사2.js`
- Git blob SHA-1: `366f43f6e677ab4c6c521fde000cdbadc891cd7b`
- 문제용 필수 그림: **0/22**, 전 문항 **EXEMPT** (발문에 필요한 함수식·좌표·구간을 모두 명시)
- 해설용 그림: **2/22 SVG_TO_CREATE**, 나머지 **20 EXEMPT**
- 실제 SVG 렌더: **0/2 NOT_RUN**, PNG 실물 시각검수 **0/2 NOT_RUN**, 게시 **NOT_RUN**
- 공식 plan-lint `--shallow` **2/2 PASS**; 전체 lint는 NotoSansKR.ttf 의존 파일 부재로 `ENVIRONMENT_BLOCKED` (기능적인 PASS라고 주장하지 않음)
- 실제 없는 `solutionImage`를 JS에 넣지 않았다.

| 문항 | 종류 | 계획 JSON | 상태 | 후속 작업 |
| --- | --- | --- | --- | --- |
| Q09 | 해설 | `q09-solution.plan.json` | `SVG_TO_CREATE` | 전체 plan-lint → 공식 엔진 SVG/PNG 렌더 → 최댓값 좌표 육안검수 → 참조 게시 |
| Q22 | 해설 | `q22-solution.plan.json` | `SVG_TO_CREATE` | 전체 plan-lint → m=±1,0 구간별 경계 검증 → 공식 엔진 렌더·실물검수 → 참조 게시 |

후속 작업자는 `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`의 절차와 정본 엔진만 사용한다. 계획 JSON은 제작 결과가 아니며 해설 SVG 시각 검수 완료로 간주하지 않는다.
