# 23 금당고 고1 2학기 기말 SVG 실행 현황

원격 시험지 브랜치에서 확인한 기준 HEAD: `91829c1275d63c3fee3e3bf8d7d5031464074c6d`. 이 worktree의 로컬 HEAD는 이전 동등 내용 커밋 `02966666ed604abbb84b464396f8bc4f95d52c00`이며 원격의 API 생성 커밋은 아직 로컬에 포함되지 않았다.

## 문항별 상태

- Q1: FAILED, 공식 엔진 2회 시도. 1차는 60-leaf compact tree schema 오류 `STAT_TREE_COMPACT_INVALID`; 계획을 단계별 5·4·3 선택 수 요약으로 바꾼 2차는 measure 단계에서 `ARCHIVE_PREFLIGHT_FAIL`로 실패(필수 Playwright 모듈 없음). SVG/PNG 없음, 시각 검수 NOT_RUN.
- Q2: 기존 계획을 5명→남은 4명→20 순서쌍 요약 수형도로 다듬음. 공식 렌더 NOT_RUN; Q1에서 전역 의존성 blocker를 확인한 뒤 재시도·설치하지 않음.
- Q3: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q4: 보기 ② 원본 그림과 대조해 임의 x=1선을 x=0(y축)으로 수정. 공식 렌더 NOT_RUN.
- Q5: CLAUDE_IN_PROGRESS, 기존 담당 보존.
- Q6: OPEN 유지. ROOT 제공 1차 입력은 `root-inputs/q6/`에 복원했으며 NOT_RENDERED.
- Q7: 기존 FAILED 5회 이력 보존. 추가 렌더 없음.
- Q8: OPEN, 기존 정합본 대기.
- Q9: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q10: 기존 ARCHIVE_BOUND SVG 보존(이전 기록 SHA-256 `080A0A689F3A4DB6E0BEA2FF04BE85CADD084FC423D4F338C55BC432C74D4FF7`).
- Q11: 기존 ARCHIVE_BOUND SVG 보존(이전 기록 SHA-256 `77B472B1796A261A63D843BB7CC840DE91147809EB3296844B7DAEFB781EC74C`).
- Q12: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q13: OPEN, 기존 정합본 대기.
- Q14–Q15: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q16: OPEN 유지. ROOT 제공 1차 입력은 `root-inputs/q16/`에 복원했으며 NOT_RENDERED.
- Q17: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q18: OPEN 유지. ROOT 제공 1차 입력은 `root-inputs/q18/`에 복원했으며 NOT_RENDERED.
- Q19: DRAFT_ONLY, 공식 렌더 NOT_RUN.
- Q20: OPEN, 기존 정합본 대기.
- Q21: OPEN 유지. ROOT 제공 1차 입력은 `root-inputs/q21/`에 복원했으며 NOT_RENDERED.

전역 blocker: 공식 `production/render-plan.mjs`가 `.tmp/apmath-visual-engine/dependencies/node_modules/playwright`를 찾지 못해 Q1 2차의 Archive measure 단계에서 실패했다. 사용자 지시에 따라 의존성 설치, 다른 렌더러 대체, 후속 렌더 재시도는 하지 않았다. 이 문서의 상태는 PASS나 게시 완료를 뜻하지 않는다.
