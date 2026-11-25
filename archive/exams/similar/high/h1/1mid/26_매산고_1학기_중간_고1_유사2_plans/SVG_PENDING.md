# 26_매산고_1학기_중간_고1_유사2 — SVG 후속 작업

- 운영 JS: `archive/exams/similar/high/h1/1mid/26_매산고_1학기_중간_고1_유사2.js`
- Git blob SHA-1: `8220726885c6902fa41217a9b956d907587ef3bb`
- 문제용 필수 SVG: **0건** (20개 문항 모두 발문·기호·조건만으로 풀이 가능, EXEMPT)
- 해설용 SVG 계획: **4건**. 계획만 작성하며 공식 엔진 렌더·PNG 확인·학생 게시 **NOT_RUN**.
- 나머지 16개 해설: 수식과 계산 설명만으로 충분한 **EXEMPT**.
- 정적 plan-lint `--shallow`: **4/4 OK** (공식 엔진의 구조·모델 검사, 2026-11-25).
- 정적 plan-lint 전체 모드: **환경 의존성 차단(FONT_HASH_LOCK_REQUIRED)**. 고정된 공식 한글 폰트 해시가 현재 실행 환경과 일치하지 않으므로 전체 모드 PASS라고 쓰지 않음. 해시 잠금·엔진 검사 기준은 변경하지 않음.

| 문항 | 후속 상태 | 계획 | 엔진·이미지 검사 |
| --- | --- | --- | --- |
| Q04 | SVG_TO_CREATE | `q04-solution.plan.json` — 해설에서 꼭짓점과 비대칭 양 끝점의 높이 비교 | NOT_RUN |
| Q15 | SVG_TO_CREATE | `q15-solution.plan.json` — 두 영점과 꼭짓점이 있는 차함수 h(x)의 모양 | NOT_RUN |
| Q18 | SVG_TO_CREATE | `q18-solution.plan.json` — 두 포물선의 교차 높이와 꼭짓점 높이별 세 점 조건 | NOT_RUN |
| Q20 | SVG_TO_CREATE | `q20-solution.plan.json` — 최솟값과 서로 다른 3개 근을 만드는 수평선 위치 | NOT_RUN |

검증된 해설 그림이 아직 없으므로 학생용 JS에는 `solutionImage` 경로를 넣지 않았다. 후속 작업자는 공식 고정 폰트·엔진 환경에서 전체 lint 재실행 → 공식 엔진 렌더 → PNG 육안 확인 → 검증된 경로만 JS에 연결한다.
