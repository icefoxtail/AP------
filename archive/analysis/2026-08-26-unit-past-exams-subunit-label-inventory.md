# 단원별기출 소단원 label inventory

- 기준일: 2026-08-26
- 대상: `archive/data/question_metadata.json` 10,690건 중 고1·고2 단원별기출 scope
- 목적: 영문 표시명 backfill 전 baseline과 분류 검토 대상을 고정

## Baseline

| profile | scanned | classified | 영문 포함 문항 |
|---|---:|---:|---:|
| 고1 | 2,478 | 2,477 | 236 |
| 고2 | 1,670 | 1,608 | 422 |
| 중1 | 737 | 733 | 0 |
| 중2 | 1,450 | 1,447 | 0 |
| 중3 | 1,646 | 1,646 | 0 |

고2 `미적분Ⅰ → 미분계수` baseline은 총 59문항이며, `H15-M2-03-DERIVATIVE` 40문항, `H15-M2-03-DERIVATIVE_DEFINITION` 18문항, `H15-M2-03-CONTINUITY` 1문항이다.

## Proposed Korean display labels

아래 label은 `subUnitKey` 표시용이다. key 자체는 이 단계에서 변경하지 않는다.

| subUnitKey suffix | proposed label | semantic review |
|---|---|---|
| `APPLICATION_OF_CALCULUS` | 미분·적분의 활용 | parent별 용어 확정 필요 |
| `CONTINUITY` | 함수의 연속 | 부모 단원과 실제 분류 확인 |
| `DERIVATIVE` | 미분 | 미분계수·도함수와 경계 확인 |
| `DERIVATIVE_DEFINITION` | 미분계수 | 유지 |
| `INTEGRAL` | 적분 | parent별 세부명 확인 |
| `CONDITIONAL_PROBABILITY` | 조건부확률 | 일부 parent mismatch 확인 |
| `PROBABILITY_DISTRIBUTION` | 확률분포 | 일부 parent mismatch 확인 |
| `RANDOM_VARIABLE` | 확률변수 | 유지 |
| `STATISTICAL_ESTIMATION` | 통계적 추정 | 유지 |
| `EXPONENT_LOG` | 지수와 로그 | 유지 |
| `EXPONENTIAL_FUNCTION` | 지수함수 | 일부 parent mismatch 확인 |
| `LOGARITHMIC_FUNCTION` | 로그함수 | 유지 |
| `TRIGONOMETRIC_FUNCTION` | 삼각함수 | 유지 |
| `QUADRATIC_EQUATION` | 이차방정식 | 유지 |
| `QUADRATIC_FUNCTION_APPLICATION` | 이차함수의 활용 | 유지 |
| `QUADRATIC_FUNCTION_GRAPH` | 이차함수의 그래프 | 유지 |
| `HIGHER_EQUATION` | 여러 가지 방정식 | 유지 |
| `HIGHER_INEQUALITY` | 여러 가지 부등식 | 유지 |
| `SYSTEM_OF_EQUATIONS` | 연립방정식 | 유지 |
| `COMBINATION` | 조합 | 유지 |
| `COUNTING_PRINCIPLE` | 경우의 수 | 유지 |
| `PERMUTATION` | 순열 | 유지 |

`INTEGRAL`과 `APPLICATION_OF_CALCULUS`는 부모 단원에 따라 `부정적분`, `정적분`, `적분의 활용`처럼 더 좁은 명칭으로 확정할 수 있다. Phase 1에서는 화면 영문 제거를 위해 parent-aware label을 적용하되, 분류 key의 재배치는 별도 판정으로 남긴다.

## Semantic review queue

다음 문항군은 영문 label backfill과 별도로 원문·해설·category를 대조한다.

- `H15-M2-03-CONTINUITY` 1문항: 미분계수 parent 아래 연속 관련 key
- `H15-M2-04-CONTINUITY` 1문항: 도함수 parent 아래 연속 관련 key
- `H15-M2-02-DERIVATIVE` 1문항: 함수의 연속 parent 아래 미분 관련 key
- `H15-M2-05-DERIVATIVE` 9문항: 접선의 방정식 parent 아래 미분 관련 key
- `H15-PS-03-CONDITIONAL_PROBABILITY` 7문항: 확률의 뜻과 활용 parent 아래 조건부확률 key
- `H15-PS-04-PROBABILITY_DISTRIBUTION` 1문항: 조건부확률 parent 아래 확률분포 key
- `H15-PS-06-PROBABILITY_DISTRIBUTION` 2문항: 통계적 추정 parent 아래 확률분포 key
- `H22-A-03-EXPONENTIAL_FUNCTION` 2문항: 로그함수 parent 아래 지수함수 key
- `H22-A-04-EXPONENTIAL_FUNCTION` 1문항: 삼각함수 parent 아래 지수함수 key

## Gate

Phase 1 종료 조건은 다음과 같다.

- master source에 영문 display label이 남지 않는다.
- 모든 영문 key에는 proposed/canonical Korean label이 존재한다.
- semantic review queue는 label backfill과 분리되어 기록된다.
- baseline의 문항 수·UID·difficulty bucket·subUnitKey는 변경되지 않는다.
