# 해설 심층감사 공유 점유 브랜치

이 브랜치는 **예약 네 창의 중복 시험지 작업 방지**를 위한 제어 브랜치다. 운영 JS나 최종 해설은 여기 저장하지 않는다.

- 사용자 기준 순서: **고1 → 대수 → 확률과 통계 → 미적분Ⅰ → 미적분Ⅱ → 기하**.
- 상세 상태 전이/선점 규칙: [GLOBAL_QUEUE_CURRENT.md](docs/operations/solution-upgrade-reservations/GLOBAL_QUEUE_CURRENT.md).
- 각 시험지 선점: `claims/<courseKey>/<sourceBlobSha>.json` 파일을 **create_file로 한 번만** 생성. 성공/원격 readback 전에는 점유 확정이 아니다.
- ownerLane만 해당 claim을 `IN_PROGRESS → AUDIT_DRAFT_COMPLETE`로 갱신. 서로 다른 문항번호·학교를 잘못 묶지 않는다.
- 작업 결과물은 각 lane 작업 브랜치의 `docs/operations/solution-upgrade-reservations/staged/<courseKey>/`에 실제 MD로 보존.
- 파일이 없다는 이유로 시험 구분을 멈추지 않고 다음 구분을 검색. 미완료 claim이 있으면 다른 과목으로 이동하지 않는다.
- 이 브랜치의 점유 기록을 수동 정리/삭제/덮어쓸 때는 원본·커밋을 먼저 확인하고 명시적 사용자 지시를 받는다.
