# 05_WORK_PLANNING_RULE

## 1. 구현 전 확정 순서

1. 정책 확인: `01_PROJECT_POLICY.md`
2. 도메인 확인: `domains/*.md`
3. 현재 구현 확인: `implemented/*.md`
4. 계획 확인: `plans/*.md`
5. 작업 범위와 수정 가능 파일 확정

계획 없이 바로 구현을 시작하지 않는다. 큰 작업은 정책, 계획, 세부 계획을 먼저 고정한다.

## 2. 작업 단위

- 큰 도메인 작업은 phase/round로 나눈다.
- 회귀 위험이 낮은 문서 정리는 큰 단위로 처리할 수 있다.
- 회귀 위험이 높은 로그인, initial-data, classroom, timetable, billing, student portal, OMR은 작은 검증 가능한 round로 나눈다.
- 너무 작은 미세 보정이 반복될 때는 원인 도메인 문서를 먼저 업데이트한다.

## 3. 외부 AI 검수용 4문서 묶음

- 공통: `01_PROJECT_POLICY.md`
- 도메인: 해당 `domains/*.md`
- 현재 구현: 관련 `implemented/*.md`
- 다음 계획: 관련 `plans/*.md`

## 4. 작업 후 업데이트

작업이 끝나면 해당 도메인 문서, implemented 문서, plan 문서, `CODEX_RESULT.md`를 업데이트한다. 업데이트하지 못한 경우 사유와 미확인 범위를 남긴다.

