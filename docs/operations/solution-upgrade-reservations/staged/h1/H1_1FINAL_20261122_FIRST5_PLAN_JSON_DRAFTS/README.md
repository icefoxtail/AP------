# 고1 1학기 기말 유사 2026 첫 5종 — 공식 SVG 엔진 JSON 초안

> **30개 그림 역할 × 3 JSON = 90개 실행 입력 파일** + `manifest.json`. 2026-11-22 KST. `ENGINE_LINT_NOT_RUN / RENDER_NOT_RUN / PUBLISH_NOT_RUN`.

## 계약과 범위

- `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `archive/tools/geometry-equation/ops/svg-m1/briefs/plan.md`와 `plan-current.md`의 `item`/`plan`/`publish` 형식을 따른 초안이다.
- 5종 102문항의 기존 연결 SVG 18개를 렌더해 화면으로 보았고 원본 문제 그림 5개도 비교했다. 누락 28곳은 **원본에 그림이 있으나 유사에서 EXEMPT 처리된 역할**이므로 자동으로 오류·게시 의무로 확정하지 않는다. 학생 설명 효용을 재판정하는 제안이다.
- 매산 q13 S와 복성 q22 S는 기존 SVG를 시각 검수해 발견한 교체 후보 2곳이다. 이 두 역할은 새 SVG 승인 이후에만 `replace:true`로 바꾼다.
- 기존 역할 플랜 204개가 모두 `EXEMPT`로 기록되어 있다. 소스/기존 플랜 직접 수정은 하지 않았다.
- `ENGINE_SUPPORT_CHECK`와 `SCHEMATIC`은 공식 엔진이 지원하는 정밀 도형인지 검증이 필요하다. 정밀 표현이 불가능하면 억지 배포하지 말고 `UNSUPPORTED`로 재판정한다.

## 공식 엔진 명령 예

```bash
ROOT='docs/operations/solution-upgrade-reservations/staged/h1/H1_1FINAL_20261122_FIRST5_PLAN_JSON_DRAFTS'
SLOT="$ROOT/JF-01_26_광양제철고_q01_solution"
node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs "$SLOT/plan.json"
node archive/tools/geometry-equation/production/render-plan.mjs \
  --item "$SLOT/item.json" \
  --plan "$SLOT/plan.json" \
  --out ".tmp/svg-m1/runs/h1-1final-JF-01/out"
```

1. 한 그림당 별도 out 폴더로 순차 렌더한다. `figure-result.json`에 `ARCHIVE_BOUND`가 확인돼야만 렌더 성공으로 보고한다.
2. `figure.png`, `figure-*.svg`를 375px/A4 기준으로 실제 눈으로 확인하고, 원문 수식·정수점·절편·색칠·라벨과 비교한다.
3. `publish.json.size`는 렌더한 `sizeClass`로 재기록한다. `medium`은 지금 임시값이다. 해설용 `caption`의 마지막은 정답 요약이다.
4. 문제용 그림에는 새 풀이 보조선이나 정답 유도값을 노출하지 않는다. 해설 그림에는 중간값/경계를 명시한다.
5. 엔진 불가라면 선·도형을 수동 SVG로 그리지 않는다. 스키마 지원을 판단하고 `UNSUPPORTED`/`CONTENT`와 근거를 기록한다.
6. 다른 검수자 독립 QA PASS 이후에만 `pubflow.py`로 출고한다. 기존 그림 교체는 `replace:true`를 명시한다.

## 30개 역할 목록

| ID | 시험지 | 문항/역할 | 유형 | Capability | 검증상태 | JSON |
|---|---|---|---|---|---|---|
| JF-01 | 광양제철고 유사1 | q1 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-01_26_광양제철고_q01_solution/plan.json) |
| JF-02 | 광양제철고 유사1 | q8 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-02_26_광양제철고_q08_solution/plan.json) |
| JF-03 | 광양제철고 유사1 | q12 해설 | 누락 재평가 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` / ILLUSTRATIVE | [plan.json](./JF-03_26_광양제철고_q12_solution/plan.json) |
| JF-04 | 광양제철고 유사1 | q14 해설 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-04_26_광양제철고_q14_solution/plan.json) |
| JF-05 | 광양제철고 유사1 | q18 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-05_26_광양제철고_q18_solution/plan.json) |
| JF-06 | 광양제철고 유사2 | q8 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-06_26_광양제철고2_q08_solution/plan.json) |
| JF-07 | 광양제철고 유사2 | q12 해설 | 누락 재평가 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` / ILLUSTRATIVE | [plan.json](./JF-07_26_광양제철고2_q12_solution/plan.json) |
| JF-08 | 광양제철고 유사2 | q14 해설 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-08_26_광양제철고2_q14_solution/plan.json) |
| JF-09 | 광양제철고 유사2 | q18 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-09_26_광양제철고2_q18_solution/plan.json) |
| JF-10 | 금당고 | q3 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-10_26_금당고_q03_solution/plan.json) |
| JF-11 | 금당고 | q4 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-11_26_금당고_q04_solution/plan.json) |
| JF-12 | 금당고 | q9 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-12_26_금당고_q09_solution/plan.json) |
| JF-13 | 금당고 | q12 문제 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-13_26_금당고_q12_problem/plan.json) |
| JF-14 | 금당고 | q14 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-14_26_금당고_q14_solution/plan.json) |
| JF-15 | 금당고 | q16 해설 | 누락 재평가 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-15_26_금당고_q16_solution/plan.json) |
| JF-16 | 금당고 | q20 해설 | 누락 재평가 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-16_26_금당고_q20_solution/plan.json) |
| JF-17 | 매산고 | q9 해설 | 누락 재평가 | `polynomial-spike-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-17_26_매산고_q09_solution/plan.json) |
| JF-18 | 매산고 | q14 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-18_26_매산고_q14_solution/plan.json) |
| JF-19 | 매산고 | q17 해설 | 누락 재평가 | `number-line-figure-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-19_26_매산고_q17_solution/plan.json) |
| JF-20 | 매산고 | q18 문제 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-20_26_매산고_q18_problem/plan.json) |
| JF-21 | 매산고 | q18 해설 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-21_26_매산고_q18_solution/plan.json) |
| JF-22 | 매산고 | q19 문제 | 누락 재평가 | `polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` / ILLUSTRATIVE | [plan.json](./JF-22_26_매산고_q19_problem/plan.json) |
| JF-23 | 매산고 | q19 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-23_26_매산고_q19_solution/plan.json) |
| JF-24 | 복성고 | q11 해설 | 누락 재평가 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-24_26_복성고_q11_solution/plan.json) |
| JF-25 | 복성고 | q14 해설 | 누락 재평가 | `number-line-figure-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-25_26_복성고_q14_solution/plan.json) |
| JF-26 | 복성고 | q18 문제 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` / SCHEMATIC | [plan.json](./JF-26_26_복성고_q18_problem/plan.json) |
| JF-27 | 복성고 | q19 문제 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` / SCHEMATIC | [plan.json](./JF-27_26_복성고_q19_problem/plan.json) |
| JF-28 | 복성고 | q23 해설 | 누락 재평가 | `construction-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-28_26_복성고_q23_solution/plan.json) |
| JF-29 | 매산고 | q13 해설 | 교체 | `piecewise-polynomial-spike-v1` | `ENGINE_SUPPORT_CHECK` | [plan.json](./JF-29_26_매산고_q13_solution/plan.json) |
| JF-30 | 복성고 | q22 해설 | 교체 | `number-line-figure-v1` | `DRAFT_NOT_LINTED` | [plan.json](./JF-30_26_복성고_q22_solution/plan.json) |

## 다음 코덱스 작업자 주의

- 매산 q13 S: 현재 `2a=8`인 기존 그림을 **a=5, 2a=10, 경계 x=−6·4** 그림으로 교체한다. breakpoints (−4,6), (2,6) 및 가로선 y=10의 교점 두 곳을 플랜 검산한다.
- 복성 q22 S: 기존 `k=0` 예시 대신 `k=1`의 정수 −1~3, `k=7`의 정수 5(4는 열린 경계 제외) 두 경우를 보여 준다.
- 금당 q12 P 도로망, 매산 q18 P/S 좌석, 복성 q18 P 원기둥 관통 구멍·q19 P 영역 그림·q23 S 방향 경로는 엔진 타입 지원과 원본에 대한 학생 가독성을 필수 확인한다.
- 이 파일은 `plan.json` 초안이 준비됐다는 뜻일 뿐 새 그림의 lint, 실제 엔진 렌더, 독립 QA, 게시 완료를 뜻하지 않는다.
