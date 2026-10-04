# Codex 인계 — RPM Primary v0.3 Audit Integrated

이 ZIP은 taxonomy 정본 후보 수정본이다. production 문항 migration은 아직 시작하지 않는다.

## 읽기 순서
1. README.md
2. 00_POLICY/RPM_PRIMARY_POLICY.md
3. 00_POLICY/TAXONOMY_SCHEMA_v2.md
4. 00_POLICY/CURRICULUM_APPLICABILITY_POLICY.md
5. 06_AUDIT/AUDIT_ADJUDICATION_45.md
6. 07_VALIDATION/VALIDATION_REPORT.md

## 중요한 정책
- 15개정/22개정 병행 유지.
- 교육과정 밖이라고 taxonomy에서 자동 DELETE하지 않는다.
- `RPM_EXTENDED*`는 taxonomy에 남기되 기본 출력 제외.
- canonical identity는 curriculum/course/full path. 다른 과목의 같은 label은 자동 MERGE하지 않는다.
- RPM-primary L1/L2 명칭은 임의 자연어 교정 금지.

## 이번 repo 정리 작업에서 금지
- exam JS 수정
- question_metadata.json 수정
- question-meta.js 수정
- js_archive_tag_master.json production 치환
- CANONICAL_DRAFT를 임의 LOCKED 승격
- git add . / git add -A / stash / reset / clean

## 다음 별도 프로젝트
Metadata Foundation v2 계획서가 승인되면 대단원(L1) 단위로 실제 문항을
L1~L4 + difficultyBucket 1~5 동시 migration한다.
