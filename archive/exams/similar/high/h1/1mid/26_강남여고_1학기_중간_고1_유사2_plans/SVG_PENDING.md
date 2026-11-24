# 강남여고 고1 1학기 중간 유사2 — 해설 SVG 후속 작업

**운영 JS 선반영 / 해설 SVG 추후 제작** (2026-11-25)

- 문항: Q01–Q24, 객관식 20·서술형 4, 총 100점.
- 문제용 SVG 의존: 0건. 아래 다섯 건은 모두 **해설 보조용**이며 문제 풀이에는 그림이 없어도 된다.
- 나머지 19건: `EXEMPT` (별도 SVG 불필요).
- 아래 5건: plan 작성 완료, **엔진 렌더 `NOT_RUN` / PNG 육안 검수 `NOT_RUN` / 게시 `PENDING`**.
- 운영 JS에는 각 문항의 `solutionPlanRef`만 기록했다. `solutionImage` 및 임의 SVG 파일 경로는 **아직 없다**.
- 엔진 계획 사전 검사 `plan-lint --shallow`: **5/5 OK** (Q22의 포물선 꼭짓점 (0, 5) 누락을 보완함). 심층 lint는 현 작업환경에 엔진 전용 `NotoSansKR.ttf`가 없어 **환경 의존성 오류로 미완료**. 실제 SVG 렌더·시각 품질 통과를 의미하지 않는다.

| 문항 | 해설에 보일 내용 | 계획 파일 | 현재 상태 |
| --- | --- | --- | --- |
| Q15 | 포물선 두 근의 구간 위치와 함수값 부호 | `q15-solution.plan.json` | `SVG_TO_CREATE` · `NOT_RUN` |
| Q16 | 주어진 구간에서의 이차함수 최대·최소 | `q16-solution.plan.json` | `SVG_TO_CREATE` · `NOT_RUN` |
| Q17 | 두 영점 1·5와 꼭짓점 (3, 8)을 나타낸 포물선 | `q17-solution.plan.json` | `SVG_TO_CREATE` · `NOT_RUN` |
| Q20 | 매출 이차함수의 해석과 금액 좌표 | `q20-solution.plan.json` | `SVG_TO_CREATE` · `NOT_RUN` |
| Q22 | 포물선과 직선의 접점 (-2, 9) | `q22-solution.plan.json` | `SVG_TO_CREATE` · `NOT_RUN` |

## 후속 완료 조건

1. 저장소 공식 SVG 엔진으로 계획을 lint·렌더한다. 수작업 SVG 생성 금지.
2. 렌더 결과 PNG를 열어 발문·해설 숫자/라벨과 실제 비교하고 잘림·중첩을 확인한다. 검사 기록이 없으면 `PASS`로 바꾸지 않는다.
3. SVG를 `archive/assets/images/26_강남여고_1학기_중간_고1_유사2/`에 저장하고 해당 JS의 **`solutionImage`** 경로를 연결한다. 문제용 `image`로 바꾸지 않는다.
4. 그림별 검사·게시 결과와 이 장부의 `NOT_RUN`을 실제 결과로 갱신한 별도 PR을 병합한다.

## 병합 범위와 검수 경계

이 선반영은 문항 본문·정답·해설·메타 및 **SVG 제작 필요 표시**를 반영하는 것이다. SVG 렌더 완료, 시각 검수 완료, 학생 사이트 배포 완료를 뜻하지 않는다. `.meta-q01-q24.json` 승인 게이트는 `review_required`로 보존했다.
