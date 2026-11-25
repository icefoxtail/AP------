# 26_강남여고_1학기_중간_고2_대수_유사2 SVG 후속 장부

- 문제용 필수 그림: Q01~Q25 전부 EXEMPT. Q19는 바깥/안쪽 부채꼴 반지름과 두 호·두 직선 경계를 발문에 모두 기술해 도형이 없어도 풀이 가능.
- 해설용 그림: Q19 q19-solution.plan.json 1건 SVG_TO_CREATE / NOT_RUN. 고리 부채꼴에서 호와 반지름을 시각화하는 보조도이며, 운영 JS 해설은 그림 없이 완결됨.
- 해설 SVG 렌더 0/1, PNG 육안 검수 0/1, 게시 0/1; 실제 solutionImage 경로 없음.
- 나머지 Q01~Q18, Q20~Q25 해설 보조 SVG는 EXEMPT (판서 수식 충분).
- 별도 시각 개선 때 Q17 사다리꼴, Q25 삼각함수 구간을 재평가할 것.
- 메타 독립 승인, CI, 학생 사이트 배포를 SVG 완료나 main 병합과 혼동하지 않음.

## 공식 SVG 엔진 제작·검수·JS 연결 완료 (2026-11-25)

- 전체 `plan-lint.cjs`(NotoSansKR.ttf 포함): **1/1 OK**
- 공식 `render-plan.mjs`: **1/1 ARCHIVE_BOUND**
- `assertSvgStudentLanguage`: **1/1 PASS**
- PNG 실물 육안 검수: **1/1 PASS**

| 문항 | 축 | 엔진 결과 | 크기 | PNG 검수 | 연결된 JS 경로 |
| --- | --- | --- | --- | --- | --- |
| Q19 | solution | `ARCHIVE_BOUND` | full | PASS | `assets/images/26_강남여고_1학기_중간_고2_대수_유사2/q19-solution.svg` |
