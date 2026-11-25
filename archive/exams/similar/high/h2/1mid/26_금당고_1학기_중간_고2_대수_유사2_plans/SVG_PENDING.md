# 26_금당고_1학기_중간_고2_대수_유사2 — SVG follow-up

신규 세트의 문제/해설 그림 필요성은 21문항 각각 독립 판정하였다. Q08은 수학적 필수 정보를 문제 발문에 모두 명시하여 그림 없이도 출제·풀이가 가능하다. 그래프는 이해를 돕는 선택적 보조 자료이며 실제 미제작 상태에서 운영 JS의 `image`로 연결하지 않는다.

| 번호 | 축 | 상태 | 조치 | plan |
| --- | --- | --- | --- | --- |
| Q08 | 문제 보조 | SVG_TO_CREATE / NOT_RUN | plan lint PASS; 실제 렌더는 브라우저 사전 검증 단계에서 실행 환경이 Unix socket 생성을 차단하여 FAILED. 후속 환경에서 렌더·PNG 시각 QA 후에만 연결 | `q08-problem-svg-pending.plan.json` |
| Q19 | 해설 | SVG_TO_CREATE / NOT_RUN | 공식 엔진 렌더 후 값·라벨·가독성 검수 | `q19-solution-svg-pending.plan.json` |
| Q21 | 해설 | SVG_TO_CREATE / NOT_RUN | 공식 엔진 렌더 후 두 교점·구간·라벨 검수 | `q21-solution-svg-pending.plan.json` |

운영 판정 파일 `qNN-problem.plan.json`, `qNN-solution.plan.json`은 42개 모두 EXEMPT로 남긴다. Q08·Q19·Q21의 선택적 후속 그림은 위 별도 계획 파일에서 보존한다. 이는 실제 SVG를 제작하지 않았다는 상태와, 발문·해설만으로 전 문항을 풀 수 있다는 판단을 동시에 명시하기 위함이다. 해설 그림을 실제 제작하기 전까지 `solutionImage`는 기록하지 않는다. 세 후속 계획 모두 공식 `plan-lint`에서 OK를 확인했으나, SVG 생성·실시각 품질 검수는 `NOT_RUN`이고 생성 성공을 주장하지 않는다.

## 공식 SVG 엔진 제작·검수·JS 연결 완료 (2026-11-25)

- 전체 `plan-lint.cjs`(NotoSansKR.ttf 포함): **3/3 OK**
- 공식 `render-plan.mjs`: **3/3 ARCHIVE_BOUND**
- `assertSvgStudentLanguage`: **3/3 PASS**
- PNG 실물 육안 검수: **3/3 PASS**

| 문항 | 축 | 엔진 결과 | 크기 | PNG 검수 | 연결된 JS 경로 |
| --- | --- | --- | --- | --- | --- |
| Q08 | problem | `ARCHIVE_BOUND` | medium | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q08-problem.svg` |
| Q19 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q19-solution.svg` |
| Q21 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_금당고_1학기_중간_고2_대수_유사2/q21-solution.svg` |
