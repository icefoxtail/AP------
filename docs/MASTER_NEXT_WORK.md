# MASTER_NEXT_WORK

다음 작업과 보류/금지/완료 기준을 한눈에 정리하는 문서다.

## 1. 상태값 기준

- 완료: 실제 코드 또는 기준 문서로 확인됨.
- 일부 완료: 제한된 범위에서만 구현됨.
- 진행 중: foundation 또는 workflow가 있으나 후속 보강 필요.
- 보류: 의도적으로 숨김 또는 승인 대기.
- 확인 필요: 문서에는 있으나 실제 파일까지 확인하지 못함.
- 금지: 승인 없이 구현/노출/실행 금지.

## 2. 우선순위 요약

| 우선순위 | 작업 | 영역 | 완료 기준 | 업데이트 문서 |
|---|---|---|---|---|
| P0 | 문서 구조 정리 검수 | 문서 | docs 루트, `_index`, archive 이동 이력, review pack 확인 | 3대 기준 문서, `README`, `_index` |
| P0 | review pack final gate 유지 | Codex workflow | 새 zip 경로와 entries 확인 | `CODEX_RESULT.md`, review SOP |
| P1 | 하위 문서 stale 경로 감사 | 문서 | 이동된 경로 참조 중 현재 문서에 필요한 것 보정 | 관련 하위 문서 |
| P1 | `docs/implemented` 실제 코드 대조 감사 | 문서/구현 | 확인 필요와 완료 분리 | implemented maps |
| P1 | report cohort / 평가리포트 검증 | Report AI / archive | archive_file + examYear + 학년 cohort 확인 | REPORT_AI, ARCHIVE_OMR, implemented maps |
| P2 | hidden foundation 노출 감사 | foundation | hidden/approved 목록 정리 | hidden foundation map |
| P2 | 시간표 staging/apply 보강 | timetable | staging/live 분리 확인 | TIMETABLE docs |
| P3 | CMath/EIE branch 정의 | 상위 OS | branch 분리 문서화 | roadmap/domain docs |

## 3. 문서 구조 후속 관리

- 새 문서는 루트에 직접 만들지 말고 `docs/_index/DOCS_STRUCTURE.md` 기준으로 배치한다.
- 완료된 작업 문서와 과거 Codex 결과는 archive로 이동한다.
- 이동한 문서는 `docs/_index/ARCHIVE_INDEX.md`에 기록한다.
- archive 문서는 과거 근거이며 현재 기준이 아니다.
- 향후 작업 완료 시 3대 기준 문서 업데이트 필요 여부를 `CODEX_RESULT.md`에 기록한다.

## 4. 보류 / 금지 항목

- 문서 정리를 명분으로 한 코드, DB, Worker, UI, package 수정.
- `apmath/` 또는 repository-level `archive/` 산출물 변경.
- 명시 승인 없는 deploy, remote D1, production smoke.
- 삭제 판단이 불확실한 문서 삭제.
- archive 내부 과거 문서 본문 전체를 무리하게 현재 경로로 재작성.
- hidden foundation UI 노출.
- 실제 SMS/Kakao/email 발송 또는 실제 결제 gateway 연동.

## 5. 작업 유형별 완료 체크

| 작업 유형 | 완료 체크 |
|---|---|
| 문서 구조 변경 | root 목록, `_index`, archive index, read order, review pack 확인 |
| rulebook/policy 변경 | `MASTER_RULEBOOK.md`, `01_PROJECT_POLICY.md`, `08_DOCUMENT_UPDATE_RULE.md` 확인 |
| 현재 상태 변경 | `MASTER_CURRENT_PROGRESS.md`, 관련 `implemented/*.md` 확인 |
| 계획 변경 | `MASTER_NEXT_WORK.md`, 관련 `plans/*.md` 확인 |
| review 결과 반영 | 검증된 상태와 미확인 상태 분리 |

## 6. 다음 작업 시작 규칙

미래 작업은 먼저 아래 순서로 읽는다.

1. `docs/README.md`
2. `docs/00_READ_ME_FIRST.md`
3. `docs/MASTER_RULEBOOK.md`
4. `docs/MASTER_CURRENT_PROGRESS.md`
5. `docs/MASTER_NEXT_WORK.md`
6. 작업별 domain / implemented / plan 문서
