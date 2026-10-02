# FORCE_NEW_CANDIDATE — 26 금당고 2학기 중간 고1

이 브랜치는 `geometry-visual-v1` 신규 생성 품질을 보는 파일럿이다. 기존 `solutionImage`/SVG 파일은 열거나 참조하지 않았다. 후보 입력은 시험지 문항 원문, 확정 solution, 독립 수학검산으로 동결한 EXPECTED FACT와 visualSpec뿐이다.

- 시작 main: `cdf6ae9725f05adbf68c35e637241b4055aa79b9`
- 대상: 20문항
- EXEMPT: 없음
- FORCE_NEW_CANDIDATE: q1–q20 (20개)
- 신규 SVG: 20개 (`candidate-svg/q01.svg`–`q20.svg`)
- 엔진 route: STANDARD. q20은 `function_graph`로 Python adaptive sampling 실행.
- engine witness: 20/20 `CANDIDATE_REQUIRES_QA`; approximate unresolved label 0.
- actual SVG geometry/text parity: 20/20 PASS; 독립 수학검산: 20/20 PASS.
- rendered desktop/mobile bbox: 미측정. 현 브라우저 환경에서 로컬 페이지 URL이 보안 정책으로 거부되어 실제 browser render를 실행하지 않았다.
- production JS/SVG 변경: 0; 다른 시험지 변경: 0; main merge: 없음.

## FORCE_NEW selector policy

`FORCE_NEW` affects only the existing solution SVG reuse/keep/skip disposition. It does **not** bypass either the domain eligibility gate or the visual applicability gate. Selection is fail-closed in this order:

1. `domainEligibility` must be `ELIGIBLE`; otherwise exclude the item as `EXCLUDE_DOMAIN_INELIGIBLE`.
2. `visualEligibility` must be explicitly `NON_EXEMPT`; `VISUAL_EXEMPT` is excluded even under `FORCE_NEW`.
3. For items that pass both gates, `FORCE_NEW` means generate a fresh candidate regardless of whether an existing solution SVG is present. Existing SVG content is not opened or used as input/reference.

The selector contract is recorded in [`selection-policy.json`](selection-policy.json). In this run, q1–q20 are domain-eligible and non-exempt, so all 20 were selected. If either eligibility gate changes for a future run, that item must be excluded even when the selector mode remains `FORCE_NEW`.

## Former EXEMPT 후보 재판정

| 문항 | 신규 시각자료의 학습 역할 | 판정 |
|---:|---|---|
| 2 | `∅`와 `{∅}`의 원소 수 0과 1을 중첩 의미 카드로 구분 | FORCE_NEW_CANDIDATE |
| 8 | `a=-1` 반례와 `a=6` 성립을 case 카드로 직접 비교 | FORCE_NEW_CANDIDATE |
| 16 | 나머지류 필터와 최대 집합 원소를 묶어 조건 추적 | FORCE_NEW_CANDIDATE |
| 19 | 세 endpoint case와 각 합 기여량을 표식으로 분리 | FORCE_NEW_CANDIDATE |

## 파일 구조

- `candidate-svg/`: 신규 SVG 20개
- `expected-facts/`: 문항별 source/derived/display facts와 frozen hash bundle
- `visual-spec/`: 엔진에 실제 입력된 visualSpec 20개
- `witness/`: geometry-visual-v1 build witness 20개
- `manifest.json`: 파일 SHA-256, 문항별 후보 맵, triage, qualification
- `source-lock.json`: source content/solution hashes와 시험지 source hash
- `independent-math-checks.json`: 문항별 독립 numeric check 결과
- `actual-svg-parity.json`: 저장된 실제 SVG bytes에서 재계산한 좌표·관계·표시 text 점검
- `calibration-preflight.json`: visual repair calibration gate evidence

Candidate는 검수·publication authority를 갖지 않는다. 이 branch는 새 그림 후보를 전달하는 용도이며 production 반영이나 main merge를 포함하지 않는다.
