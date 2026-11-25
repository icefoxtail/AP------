# 26_금당고_1학기_중간_고2_대수_유사2 — SVG 후속 및 병렬 작업 정합성

21문항의 그림 필요성을 독립 판정하였다. Q08·Q19는 R1에서 발문·풀이 구조가 바뀌었으며, 같은 날 다른 라인이 먼저 제작한 SVG는 **R1 수정 전 문제**에 대한 그림이므로 현재 학생용 JS에 연결하지 않는다. 기존 파일은 보존하되 R1 의미의 그림으로 재제작해야 한다. Q21은 문항 조건이 바뀌지 않았고, 병렬 작업의 실제 SVG를 재렌더해 수학 내용과 가독성을 확인했다.

| 번호 | 축 | R1 최종 상태 | 물리적 근거와 후속 조치 | plan |
| --- | --- | --- | --- | --- |
| Q08 | 문제 보조 | **SVG_TO_CREATE / NOT_RUN** | 이전 SVG 실물은 `y=2^x`, `f(0)=1`을 표시하지만 최종 문항은 `y=2^x+3`, P의 y=7, Q의 x=4이다. 의미 불일치로 JS `image` 연결 제거. 수정된 계획으로 다시 렌더·시각검수해야 한다. | `q08-problem-svg-pending.plan.json` |
| Q19 | 해설 | **SVG_TO_CREATE / NOT_RUN** | 이전 SVG 실물은 가능한 k를 `-8,2,12`로 표시하지만 최종 정답을 결정하는 값은 `-2,2,6`이다. 의미 불일치로 JS `solutionImage` 연결 제거. 수정 계획 재렌더 필요. | `q19-solution-svg-pending.plan.json` |
| Q21 | 해설 | **SVG_ASSET_READY / R1_VISUAL_PASS / JS_UNBOUND** | SVG를 Inkscape PNG로 재렌더해 포물선, `u=1/4,3/4`, `y=5/16`의 교점·라벨을 확인했다. 다만 정규 `q21-solution.plan.json`이 `EXEMPT`라 `solutionImage` 연결 시 공식 하네스가 FAIL이다. 임의 승격하지 않고 연결 보류. | `q21-solution-svg-pending.plan.json` |

## 검사 이력과 범위

- 병렬 SVG 제작 라인(2026-11-25)은 당시 문제 기준으로 전체 `plan-lint` 3/3, `render-plan.mjs` 3/3 ARCHIVE_BOUND, 학생 언어 검사 3/3, PNG 시각검수 3/3이라고 기록하였다. **이는 R1에서 수리된 Q08·Q19 문제와의 의미 일치를 증명하지 않는다.** 실제 그림을 R1 문제와 비교한 결과 두 그림은 불일치하였다.
- 독립 R1 수리 계획의 `plan-lint --shallow`는 Q08·Q19·Q21 모두 OK(3/3). 이 로컬 환경의 깊은 `plan-lint`는 Q19 OK, Q08·Q21에서는 `NotoSansKR.ttf` 미설치(`ENOENT`)로 미완료였다. Q08·Q19의 **수정 계획 기반 공식 재렌더는 아직 NOT_RUN**이다.
- Q21의 기존 실제 SVG는 수리 후에도 문항 조건이 그대로이며 이번 독립 R1에서 물리적 재렌더·시각 확인을 완료했다. 다만 정규 계획 EXEMPT로 활성 연결은 미완료이며 이 작업은 별도 도형 운영계획·엔진 증거 확보 후에만 가능하다. `R1_VISUAL_PASS`는 **별도 파일의 시각 내용 판정이지 연결 승인이나 운영 런타임 PASS가 아니다**.
- 42개 정규 운영 판정 계획(`qNN-problem.plan.json`, `qNN-solution.plan.json`)은 종전대로 EXEMPT이며, 후속 선택 그림은 별도 pending 계획에 보존한다. 세 SVG 파일은 삭제하지 않되 정규 엔진 승인 전에는 어느 것도 JS에 연결하지 않는다.
