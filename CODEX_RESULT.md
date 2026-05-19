# CODEX_RESULT

## 1. 생성/수정 파일

- 수정: `apmath/js/student.js`
- 수정: `docs/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`
- 수정: `docs/INITIAL_DATA_SPLIT_ANALYSIS.md`
- 수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

### message_logs 별도 lazy loader 2차

- `message_logs`를 `/api/students/:id/detail-data`에 포함하지 않는 원칙 유지 확인
- `ensureStudentParentContactDataLoaded()`에서 `parent-foundation/messages` 자동 호출 제거
- `ensureStudentParentMessageLogsLoaded(studentId, options)` 추가
- 연락 이력은 `연락 이력 보기` 클릭 시에만 `parent-foundation/messages?student_id=...&limit=200` 호출
- message 전용 상태 `messagesLoadedAt`, `messageLoading`, `messageInFlight`, `messageError` 추가
- 연락 이력 로딩/빈 목록/오류 상태 모달 표시 보강
- 연락 이력 로딩 중 다른 서브 모달을 열었을 때 기존 비동기 결과가 뒤늦게 모달을 덮어쓰지 않도록 `isStudentDetailSubModal()` 가드 추가
- 기존 연락 설정/수신동의/보호자 연락처 추가·수정·삭제 흐름 보존
- 실제 메시지 발송, message-preview 노출, 학부모 공개 기능 추가 없음

### 운영 로그/이력 뷰어 2차

- 학생 상태 변경 이력과 반 이동 이력은 기존 학생 상세 상담기록 탭 내부 모달 방식 유지
- 이력 데이터 empty/loading/error 방어 유지 확인
- 상태 변경 이력/반 이동 이력 로딩 중 다른 서브 모달로 이동한 경우 뒤늦은 `showModal()` 실행을 중단하는 가드 추가
- 서브 모달이 열린 상태에서 lazy loader 완료 시 상담기록 탭이 덮어써지는 경쟁 조건 방어 유지
- 원장 대시보드 새 카드 추가 없음
- message_logs는 학생 이력 lazy data와 분리 유지

### 시간표 버전/충돌 UI 후속 안정화

- 시간표 충돌 상세 UI가 기존 draft/scan-preview 흐름 안에만 남아 있음을 확인
- 학생/선생님/교실 분리 표시와 empty state 방어 확인
- Worker/schema/migration 추가 수정 없음

### 홈페이지/왕지교육 SaaS 통합 준비

- APMS는 Academy OS 안에 재구현하지 않고 기존 바닐라 JS 하위 앱으로 유지하는 방향 문서화
- Academy OS는 로그인, 학원 선택, 멤버십, 권한, 공통 운영층 담당으로 정리
- APMS는 로그인 후 APMS 진입 버튼으로 들어가는 독립 실행 하위 앱 방향으로 정리
- 씨매쓰 초등과 EIE 영어학원은 Academy OS 내부 모듈 방향으로 합류시키는 구조 문서화
- 실제 세션 브릿지, 새 메뉴, 새 UI 구현은 하지 않음

### 보존 확인

- 학생 포털 미수정
- 플래너 미수정
- 숙제 사진 미수정
- OMR/QR/시험지/아카이브 미수정
- Worker route 미수정
- schema/migration 미수정
- 원장/관리자 대시보드 새 기능 노출 없음
- 수납·출납 UI 새 노출 없음
- 기존 문구·버튼명·화면명 임의 변경 없음

## 3. 실행 결과

실행한 명령:

- `node --check /mnt/data/work_apms_patch/student.js`
- `node --check /mnt/data/work_apms_patch/timetable.js`
- `node --check /mnt/data/work_apms_patch/index.js`
- `node --check /mnt/data/work_apms_patch/parent-foundation.js`
- `rg -n "parent-foundation/messages|ensureStudentParentMessageLogsLoaded|messagesLoadedAt|messageInFlight|message_logs|detail-data" /mnt/data/work_apms_patch/student.js /mnt/data/work_apms_patch/PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md /mnt/data/work_apms_patch/INITIAL_DATA_SPLIT_ANALYSIS.md`

검증 판정:

- `student.js` PASS
- `timetable.js` PASS
- `index.js` PASS
- `parent-foundation.js` PASS
- 검색 검증 PASS

실행하지 않은 검증:

- 운영 API smoke test는 수행하지 않음
- 브라우저 실기 확인은 사용자 직접 확인 항목으로 남김
- Worker deploy는 수행하지 않음

## 4. 결과 요약

학생 상세 상담기록 탭에서 보호자 연락처/수신동의 로딩과 연락 이력 로딩을 분리했다. 이제 `message_logs`는 상담기록 탭 진입 시 자동으로 가져오지 않고, `연락 이력 보기` 버튼을 눌렀을 때만 별도 lazy loader로 불러온다. 학생 상태/반 이동 이력과 시간표 충돌 상세 UI는 기존 모달 기반 숨김 노출 원칙을 유지했고, Academy OS와 APMS 통합 방향은 문서에만 정리했다.

## 5. 잘못한 점 / 위험했던 점 / 보존한 점

- 잘못한 점: 없음
- 위험했던 점: 연락 이력 lazy load를 분리하면서 기존 연락 이력 버튼이 사라지거나, 서브 모달이 loader 완료 시 덮어써질 위험이 있었다. message 전용 상태, 기존 `shouldRefreshCurrentStudentCnsTab()` 방어, `isStudentDetailSubModal()` await 이후 가드를 함께 사용해 탭/서브 모달 덮어쓰기 위험을 줄였다.
- 보존한 점: 기존 학생 상세, 보호자 연락처, 연락 설정, 상담기록, 시간표 충돌 상세, 학생 포털, OMR/QR, 플래너, 숙제 사진, Worker/schema/migration을 보존했다.

## 6. 배포/운영 필요 사항

- Worker deploy 필요 여부: 불필요
- D1 migration 필요 여부: 불필요
- 프론트 정적 배포/GitHub Pages 반영 필요 여부: 필요
- 브라우저 확인 필요 항목:
  - 학생 상세 → 상담기록 탭 진입
  - 보호자 연락처 표시
  - 연락 설정 모달
  - 연락 이력 보기 클릭 시 연락 이력 lazy load
  - 연락 이력 없음/오류 상태 표시
  - 상태 변경 이력 / 반 이동 이력 모달
  - 시간표 충돌 상세 보기
- git commit/push: 사용자 확인 후 직접 실행

## 7. 다음 단계 추천

- 브라우저 확인 후 정상일 경우 커밋/푸시
- 이후 실제 Academy OS → APMS 진입 브릿지는 별도 설계/작업으로 분리
