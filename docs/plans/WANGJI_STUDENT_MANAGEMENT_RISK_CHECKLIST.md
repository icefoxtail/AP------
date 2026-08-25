# 왕지교육 공통 학생관리 v1 — 위험 체크리스트 (RISK_CHECKLIST)

> 설계 보정 문서. 각 위험에 대응책 포함.
> 대원칙: **원본 DB 유지 · 재입력/일괄 복사 금지 · 1차 read-only overlay · 장기 write-through.**

## A. 위험 요소 분석

| # | 위험 | 설명 | 대응책 |
|---|---|---|---|
| 1 | 기존 DB 재입력 | 기존 AP/EIE 학생/상담/시간표를 새 DB에 다시 입력·복사하려는 유혹 | 새 DB는 anchor/link/공통입력만. 원본 데이터는 adapter read만. 일괄 복사·재입력 금지를 전 문서에 명시 |
| 2 | 원본 DB vs overlay DB 책임 경계 붕괴 | 무엇이 원본이고 무엇이 overlay인지 흐려짐 | `wangji_students`는 snapshot+anchor, 원본 우선권은 AP/EIE. 표시 시 adapter 원본값 우선. 문서에 책임 경계 고정 |
| 3 | AP/EIE ID 충돌 | `students.id`와 `eie_students.id`는 독립 키, 동일 인물도 다른 ID | 공통 `wangji_student_id` 정본 + `wangji_student_links(source_app, source_student_id)` 매핑. cross-DB FK 금지 |
| 4 | 동명이인 자동 병합 | 이름/번호 유사로 잘못 합쳐짐 | 자동 병합 금지. 학교·학년·보호자번호는 `confidence_reason` 후보로만. active는 관리자 확정 |
| 5 | 보호자 번호 없는 학생 연결 | 매칭 근거 부족 | 번호 없으면 자동 후보 생성 안 함. 수동 연결만. UI에 "연락처 없음" 경고 |
| 6 | AP/EIE 시간표 구조 차이 | AP=class+class_time_slots(class 중심), EIE=eie_timetable_cells(셀 중심) | adapter가 각자 모델로 조회 후 공통 표시 모델로 정규화. 통합 시간표 엔진 안 만듦(read만) |
| 7 | AP/EIE Worker 인증 방식 차이 | AP=teacher 세션, EIE=Bearer 토큰 | adapter별 인증 캡슐화. 서버-사이드 토큰/세션 공유 방식 별도 확정(구현 전 결정) |
| 8 | adapter 장애 시 전체 화면 장애 | 한 워커 다운이 통합 화면 전체 마비 | 섹션 단위 `section_errors`로 격리. 한 adapter 실패해도 나머지 렌더 |
| 9 | 상담 3원화 | AP/EIE/공통 상담 분산 | 1차: 신규는 공통에만, 기존은 read. `source_scope` 구분. 일괄 복사 금지. 장기 입력만 왕지로 이전 |
| 10 | 장기 write-through 시 원본 DB 오염 | 왕지 입력이 원본을 잘못 덮어씀 | 5단계로 분리, 별도 검수·테스트. 트랜잭션/검증 게이트. 부분 실패 롤백 정책 사전 정의 |
| 11 | write adapter가 공식 route 우회 | 원본 DB 직접 SQL로 무결성 깨짐 | **기존 공식 route/API 재사용 우선.** 직접 SQL UPDATE 금지 원칙 명시 |
| 12 | 교사 권한 범위 미확정 | 어느 교사가 어느 학원 학생을 보는지 미정 | **후속 검수 항목.** 1~4단계 admin 한정. 교사 노출 전 권한 모델 별도 설계 |
| 13 | 기존/신규 학생관리 사용자 혼동 | 두 화면 병존으로 혼선 | 진입점/명칭 분리, 단계별 전환. 6단계에서 기존을 보조화하되 즉시 교체 안 함 |
| 14 | 기존 변경 파일 오염 | 작업 외 파일 잘못 수정 | `eie/css/eie.css`, `eie/js/views/eie-attendance.js` 등 기존 변경 파일 미수정. git status로 구분 보고 |
| 15 | 단일 DB 통합 마이그레이션 | 두 `consultations` 이름 충돌, ID 충돌 | 단일 DB 통합은 별도 라운드. 그 전까지 overlay 별도 D1 격리. prefix/네임스페이스 규칙 사전 정의 |

## B. 검수 체크리스트

### 기존 기능 침범 여부
- [ ] `apmath/` 화면/로그인/대시보드/시간표/클래스룸/학생상세 미변경
- [ ] `eie/` 화면/라우터/뷰 미변경
- [ ] 기존 상담/클래스룸/출결 버튼 유지

### DB 재입력/마이그레이션
- [ ] 기존 AP/EIE 학생/반/시간표/상담/출결/성적 새 DB 복사 0
- [ ] `ap-math-os` 스키마 변경 0 / `wangji-eie-os` 스키마 변경 0
- [ ] 공통 테이블은 별도 저장소(신규 D1 권장)에만

### overlay/입력 책임 경계
- [ ] 새 DB = overlay/link/index (원본 아님)
- [ ] 1차 adapter read-only, 쓰기 호출 없음
- [ ] write-through는 5단계 이후 + 공식 API 우선

### 라우팅/권한
- [ ] 공통 페이지 경로가 AP/EIE 경로와 분리 (EIE 해시 키와 충돌 없음)
- [ ] 1~4단계 admin 한정, 교사 노출 보류

### 중복/매칭
- [ ] 자동 병합 코드 없음, candidate만 자동 생성
- [ ] 보호자 번호 없으면 자동 후보 생성 안 함

### 회귀 테스트 후보
- [ ] `tests/eie-student-worker-crud-parity.test.js`
- [ ] `tests/eie-worker-route-permissions.test.js`
- [ ] AP 학생 목록/상세/상담/시간표 수동 점검
- [ ] EIE 학생/시간표/출결 수동 점검

## C. 검증(이번 라운드 산출 기준)
- 코드 수정 없음 / DB 변경 없음 / write-through 구현 없음
- 배포 없음 / git commit·push 없음
- 기존 변경 파일(`eie/css/eie.css`, `eie/js/views/eie-attendance.js`) 미수정
- 산출물: docs 5종 + `CODEX_RESULT1.md`만
