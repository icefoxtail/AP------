# ADR 002 — 기존 배부의 원자적 문항 동결

상태: IMPLEMENTED / LOCAL RUNTIME VERIFIED · 2026-09-16

## 결정

기존 `/class-exam-assignments` resource에 `studio`와 `question-history` 작업을
추가한다. `studio`는 기존 assignment/recipients/exclusions 테이블에 저장하며
기존 PDF pipeline을 호출한다. 새 assignment나 student exposure 테이블은 없다.

`class_exam_assignment_questions`는 순서, canonical UID, source ordinal,
출제 당시 metadata를 동결한다. `archive2_write_key`는 class/date/archive의
동시 재시도를 방어하는 additive unique 값이다. canonical identity는 여전히
`class_exam_assignments.id` UUID다. 기존 logical duplicate는 migration에서
삭제하지 않으며 해당 assignment의 strict 등록을 409로 거절한다.

기존 시스템에서 이미 노출된 assignment를 수정하면서 새 UID로 덮어쓰는 대신,
strict 배부는 immutable snapshot으로 취급한다. 다른 내용/대상은 새 문제지로
배부한다. 기존 exclusion API를 통한 대상 제외/복원은 계속 effective history에
반영한다. legacy create endpoint도 strict snapshot 덮어쓰기를 차단한다.

## 저장·실패 경계

승인 catalog, source fingerprint, UID/source tuple, 최종 ordered UID parity,
반·학생 권한을 검증한 후 assignment/roster/exclusions/questions를 D1 batch로
동결한다. 이력은 사전 조회와 같은 transaction 안에서 모두 검사한다. 동시에
다른 배부가 먼저 commit했다면 새 배부 전체를 rollback한다.

PDF는 기존 `ensureAssignmentPdf`를 사용한다. PDF 실패 시 `saved=true`,
실제 assignment UUID와 실패 상태를 502로 반환한다. 재시도는 저장된 assignment를
재사용하며 새 recipient를 추가하지 않는다. PDF가 없는데 출제 성공이라고 표시하지 않는다.

## 조회

history = recipients − exclusions JOIN assignment questions. 후보 UID는 최종
intersection에만 사용한다. `unit_keys`는 history predicate가 아니며 metadata
재분류로 exposure가 사라지지 않는다. candidate filter 전에 확정·추정·미복원
coverage를 집계한다. 타이밍이 불확실한 effective recipient도 known UID를 숨기지 않는다.

## 확인된 runtime

`node tests/archive2-worker-runtime.mjs`에서 실제 workerd/D1을 사용했다.

- production route의 인증 거부와 기존 teacher-class 권한 경계
- actual source payload의 승인 catalog·fingerprint 검증, 위조 content 거부
- ordered question parity, recipient/exclusion 저장, 동일 UUID 재시도
- 대상 밖 학생 exposure 0, exclusion 제거 후 exposure 반영
- metadata/unit filter 변경과 무관한 UID 이력
- 새 배부의 과거 문항 중복 차단 및 동시 배부 race에서 한 건만 commit
- assignment 삭제 후 history 제거
- legacy 추정 1 + 미복원 2가 빈 candidate 교집합에서도 보존됨

로컬 Browser Rendering binding이 없어 PDF는 예상 실패였다. 이 검증은 PDF
생성 완료 증명이 아니다. 실제 문제/해설/정답 출력은 별도 브라우저 검증 대상이다.

production rollout은 `ARCHIVE2_ENABLED=true`, additive migration,
승인 catalog 배포가 모두 필요하다. 현재 production에 적용하지 않았다.
