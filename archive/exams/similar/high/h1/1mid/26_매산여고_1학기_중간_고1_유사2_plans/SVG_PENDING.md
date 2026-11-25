# 2026 매산여고 고1 1학기 중간 발전형 유사2 — SVG 후속 작업

- 운영 원고: `archive/exams/similar/high/h1/1mid/26_매산여고_1학기_중간_고1_유사2.js`
- 원고 Git blob SHA-1: `43cd8d76544a23a737f39c5c17031ca20de3df59`
- 문제용 필수 시각자료: **0/23건**. Q22는 A·B·C·P 좌표, 수선·평행선 및 교점을 발문에 모두 정의해 그림 없이도 유일하게 풀 수 있음. 나머지 문항도 수식·표·구간을 텍스트로 제시하여 모두 `EXEMPT`.
- 해설 보조 그림: **2/23건 `SVG_TO_CREATE`**. 21건은 풀이 과정의 수식·조건 설명으로 학생이 재현할 수 있어 `EXEMPT`.
- 공식 엔진 `plan-lint --shallow`: **2/2 OK** (2026-11-25).
- 공식 엔진 전체 `plan-lint`: **환경 차단**, `NotoSansKR.ttf` 고정 의존 파일 부재. 해시 잠금 기준을 우회하지 않았으며 **PASS 아님**.
- 실제 SVG 렌더: **0/2, `NOT_RUN`**. PNG 생성·육안 검수: **0/2, `NOT_RUN`**. 학생 게시: `NOT_RUN`.

| 문항 | 종류 | 계획 JSON | 상태 | 후속 시각 검증 |
| --- | --- | --- | --- | --- |
| Q07 | 해설용, 구간 최대·최소 | `q07-solution.plan.json` | `SVG_TO_CREATE` | 엔진 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |
| Q22 | 해설용, 도형 넓이의 최대 | `q22-solution.plan.json` | `SVG_TO_CREATE` | 엔진 전체 lint·렌더·PNG 육안 검수 `NOT_RUN` |

후속 담당자는 저장소 공식 SVG 엔진의 잠금된 NotoSansKR 환경을 준비하고, 위 plan 두 개의 전체 lint → 엔진 렌더 → 수학적·시각적 PNG 검수 → 검증된 해설 SVG 경로만 `solutionImage`로 연결한다. 이 시점에 존재하지 않는 `solutionImage`를 JS에 미리 기입하지 않았다. Q22의 문제용 시각 자산은 필요하지 않다.
