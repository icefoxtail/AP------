# 고2 수학I·대수 시각자료 업그레이드 — 1단계 Inventory

## Baseline

- Working branch: `codex/visual-upgrade-h2-s1-algebra`
- Baseline branch: `main`
- Baseline commit: `981ac3c744c479f6eeee1d502752915c6ed429f7`
- `main`, `origin/main`, `HEAD` parity at inventory start: PASS
- Working tree at inventory start: clean

## Effective scope rule

문항 분모는 파일명이나 `standardCourse` 문자열만으로 정하지 않고, 현재 canonical master의 표준단원 키로 확정한다.

- Include: `H15-M1-*` (수학I), `H22-A-*` (대수)
- Exclude from this project: `H21-M1-*` legacy rows, `H22-C-*` 공통수학1 rows, `H22-C2-*` 공통수학2 rows
- Excluded rows remain protected and are included in whole-file runtime/render parity checks.
- No applicable `UNIT_OVERLAY` exists for 수학I or 대수 in `docs/rules/`; common ruleset + canonical master is effective.

## Observed inventory

| 항목 | 수량 | 비고 |
|---|---:|---|
| 대상 JS 파일 | 22 | `archive/exams/original/high/h2/{1mid,1final}`의 파일명 기준 후보 |
| 후보 전체 문항 | 475 | 대상 파일 전체 문항 |
| 대상 문항 | 459 | `H15-M1-*` 178 + `H22-A-*` 281 |
| 대상 외 보호 문항 | 16 | `H21-M1-*` 2 + `H22-C*` 14 |
| 대상 `image` 필드 | 57 | 누락 경로 0, 실제 PNG 존재 확인 |
| 대상 inline SVG 포함 문항 | 15 | 기존 SVG는 V1/V2 독립 검수 전까지 기준 사실로 사용하지 않음 |
| 대상 `그래프` 태그 | 39 | 태그는 후보 신호일 뿐 최종 필요성 판정 근거가 아님 |
| 대상 `도형` 태그 | 67 | 태그는 후보 신호일 뿐 최종 필요성 판정 근거가 아님 |
| 대상 `표` 태그 | 3 | 표는 도형·그래프와 별도 구조로 판정 |
| 적용 가능한 visual overlay | 0 | 집합·명제 overlay는 대상 아님 |

## Course-key distribution

### 수학I (`H15-M1-*`)

- `H15-M1-01`: 5
- `H15-M1-02`: 9
- `H15-M1-05`: 51
- `H15-M1-06`: 18
- `H15-M1-07`: 15
- `H15-M1-08`: 20
- `H15-M1-09`: 23
- `H15-M1-10`: 33
- `H15-M1-11`: 4
- 합계: 178

### 대수 (`H22-A-*`)

- `H22-A-01`: 79
- `H22-A-02`: 16
- `H22-A-03`: 21
- `H22-A-04`: 53
- `H22-A-05`: 34
- `H22-A-06`: 32
- `H22-A-07`: 35
- `H22-A-08`: 11
- 합계: 281

## Initial disposition policy

모든 459개 대상 문항을 먼저 triage한다. `NO_VISUAL`, `KEEP_EXISTING`, `REBUILD_EXISTING`, `ADD_NEW_VISUAL`은 태그 개수가 아니라 문제 원문·수학적 필요성·기존 visual의 유효성을 근거로 확정한다.

- `NO_VISUAL`: 시각화가 풀이·검산·학생 재현성에 실질적 이득이 없음
- `KEEP_EXISTING`: 기존 visual이 fact/semantic/style/runtime gate를 모두 만족하거나 후속 독립 검수에서 유지 가능
- `REBUILD_EXISTING`: 기존 visual이 필요하지만 hand-drawn/부정확/구조·style gate 위반
- `ADD_NEW_VISUAL`: visual이 필요하지만 기존 asset이 없음

이 문서는 분모와 보호 범위를 잠그는 단계의 기록이다. visual 필요성 최종 count와 생성 대상 count는 V1 source-only triage 후 확정한다.
