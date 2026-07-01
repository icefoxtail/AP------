# CODEX_RESULT

## 1. 생성/수정 파일

이번 세션(오답 클리닉 학생 타깃팅 개편 + 전수 조사 + 순차 수정)에서 실제로 만들거나 고친 파일:

- `apmath/js/clinic-print.js` — 최다빈출/최다오답 50% 경계 수정(50%↑ → 50%초과/이하), 단원별 오답 3단계 정답률 필터(75%초과/50~75%/50%이하) 추가, 유형 카드·단원별 정렬을 오답수 우선 → 정답률 우선(쉬운 문제부터)으로 변경, 반/학년/유형 모드에 배포 대상 학생 선택 UI 추가, 배포 대상을 항상 "화면에서 선택한 학생"으로만 제한(반/학년 자동 전체배포 금지), 반 공통 오답 통계는 선택 인원과 무관하게 반 전체 모집단 기준으로 분리 계산, 학생 목록 재렌더 시 사용자가 해제한 체크 상태를 보존하도록 수정(전체 선택 리셋 버그), 전체 해제 버튼 추가, 반/학년/유형 모드의 학생 선택지를 "본인 오답 있는 학생만" → "전체 명단(오답 0명도 포함)"으로 확장.
- `apmath/css/apms-clinic-print.css` — 단원별 정답률 토글 3열 그리드, 학생 섹션 버튼 그룹(`clinic-print-mini-btn-group`) 스타일 추가.
- `apmath/worker-backup/worker/helpers/foundation-db.js` — `canAccessStudentsBatch` 신규 export(대상 학생 여러 명을 한 번의 `IN()` 쿼리로 권한 확인). 기존 `canAccessStudent`/`canAccessClass`는 무수정.
- `apmath/worker-backup/worker/routes/wrong-clinics.js` — `assertCreatePermission`을 학생별 순차 D1 조회 → `canAccessStudentsBatch` 1회 호출로 교체, `loadStudentTarget`(학생 1명씩 조회) 제거하고 `loadStudentTargetsBatch`(IN() 1회 조회)로 교체하여 `normalizeDistributionTargets`의 모든 경로(explicit targets / student 모드 / class 모드)에서 사용, 동일 세트 내 동일 학생에게 패킷이 중복 생성되지 않도록 `packetedStudentIds` 가드 추가.
- `apmath/js/student.js` — 교사용 학생 상세의 오답 클리닉 탭에 "반 공통 오답 / 학년 공통 오답 / 유형 공통 오답 / 개인 오답" 구분 라벨 추가.
- `apmath/student/index.html` — 학생 포털 오답 클리닉 카드에 동일한 구분 라벨(`getWrongClinicScopeLabel`) 추가, `saveSession`의 학생 전환 캐시 초기화 목록에 누락돼 있던 `materialWrongDraft` 추가.
- `CODEX_RESULT.md` — 본 문서(신규 작성, 기존 무관 내용 교체).

세션 중 조사만 하고 **수정하지 않은** 파일(아래 8번 참조): `apmath/wrong_print_engine.html`, `apmath/js/classroom.js`, `apmath/worker-backup/worker/routes/wrong-clinics.js`의 `type:'class'`/`custom_group` 타깃 허용 경로.

## 2. 구현 완료 또는 확인 완료

- 최다빈출/최다오답 50% 경계, 단원별 3단계 필터 — 완료, `node --check` + 기존 테스트 통과.
- 오답지 문항 정렬을 "오답수 많은 순" → "정답률 높은(쉬운) 순, 동률이면 오답수 많은 순"으로 변경 — 완료.
- 반/학년/유형 모드 배포 대상을 교사가 직접 선택한 학생으로만 제한(자동 전체배포 제거) — 완료, `clinicPrintBuildWrongClinicTargets`가 모든 모드에서 `type:'student'`만 생성.
- 반/학년 공통 오답 통계는 배포 인원 선택과 무관하게 항상 전체 모집단 기준 — 완료(`clinicPrintBuildPayload` 내부에서 통계용 모집단과 배포용 선택을 분리).
- 학생 체크리스트 재렌더 시 사용자의 해제 상태 보존 — 완료(오늘 실사용에서 나온 핵심 버그로 추정, 최우선 수정).
- 전체 선택/전체 해제 버튼 — 완료.
- 반/학년/유형 모드 학생 선택지에 오답 0명 학생도 포함 — 완료.
- 워커 대량 배포 시 N+1 순차 D1 조회 → 배치 조회(1~2회)로 축소 — 완료(`canAccessStudentsBatch`, `loadStudentTargetsBatch`).
- 세트당 학생 중복 패킷 방지 가드 — 완료.
- 학생/교사 화면에 "공통 오답 vs 개인 오답" 라벨 — 완료.
- 학생 전환 캐시 초기화 누락(`materialWrongDraft`) — 완료.

## 3. 실행 결과

```
로컬 Node 테스트 전체 실행: PASS=97 / FAIL=3 / TOTAL=100
명령: for f in tests/*.test.js tests/*.test.mjs; do node "$f"; done
```

실패 3건은 모두 이번 세션 수정 이전부터 존재하던 것으로 확인(아래 8번 상세):
- `tests/apmath-global-surface.test.js` — classroom.js 함수 surface 픽스처가 이전 커밋(`b0aff19c`)의 classroom.js 변경분을 반영하지 못해 실패. 이번 세션은 classroom.js를 수정하지 않음.
- `tests/classroom-monthly-status-board.test.js` — 동일하게 이전 classroom.js 변경분 관련, 이번 세션과 무관.
- `tests/student-portal-wrong-clinic-hotfix.test.js` — `STUDENT_APP_VERSION` 하드코딩 문자열(`'2026.06.29.2'`) assert가 이전 커밋에서 이미 `'2026.07.01.1'`로 올라간 것과 불일치. 이번 세션에서 버전 문자열을 추가로 올리지 않았으므로 그대로 실패 유지(버전 범프는 배포 타이밍 판단이 필요해 임의로 건드리지 않음).

관련 개별 테스트 재확인(전부 PASS):
- `tests/apmath-clinic-print-assignment-visibility.test.js`
- `tests/apmath-wrong-print-qr-solution-regression.test.js`
- `tests/assessment-submit-qr-student-page-route.test.js`
- `tests/student-portal-omr-history-routes.test.js`
- `tests/student-portal-omr-review-ui.test.js`

`node --check`로 구문 검사한 파일: `apmath/js/clinic-print.js`, `apmath/js/student.js`, `apmath/js/classroom.js`(무수정 확인용), `apmath/worker-backup/worker/routes/wrong-clinics.js`, `apmath/worker-backup/worker/helpers/foundation-db.js` — 전부 통과. `apmath/student/index.html`은 `<script>` 블록을 추출해 `new Function()`으로 파싱 검증 — 전부 통과.

## 4. 결과 요약

오늘(2026-07-01) 사용자가 오답 클리닉을 실제로 사용하다 발견한 문제를 계기로 두 단계로 작업했다.

1) **기능 개편**: 반별/학년별/유형별 오답 클리닉이 화면 선택과 무관하게 반·학년 전체에 자동 배포되던 구조적 문제를 고쳐, 배포 대상을 교사가 직접 선택하도록 바꿨다. 동시에 "공통 오답 문항 통계"는 배포 인원과 분리해 항상 전체 모집단 기준을 유지했다(사용자 확정 결정).
2) **전수 조사 + 순차 수정**: 위 개편 직후 실사용에서 "너무 많은 문제"가 있었다는 피드백을 받아, 본인 코드(`clinic-print.js`) 정밀 재검토 + 3개 병렬 서브에이전트(출력 엔진/워커 백엔드/학생 포털)로 오늘 변경된 전체 파일을 조사했다. 그 결과 학생 체크리스트가 시험 체크박스 하나만 건드려도 전체 선택으로 몰래 리셋되는 치명적 버그를 발견해 최우선으로 고쳤고(오늘 문제의 핵심 원인으로 추정), 이어서 우선순위대로: 워커 대량 배포 시 N+1 순차 DB 조회, 학생 선택지가 공통 오답 콘텐츠임에도 개인 오답 유무로 걸러지던 불일치, 세트 내 학생 중복 패킷 가드, 학생 전환 캐시 누락, 학생/교사 화면의 "공통 오답 vs 개인 오답" 라벨 부재를 순서대로 수정했다.

## 5. 다음 조치

- **미조치(권고만)**: 워커의 `normalizeDistributionTargets`가 여전히 `type:'class'`/`custom_group` 타깃 형식을 문법적으로 허용한다(현재 어떤 호출부도 사용하지 않음을 확인했고, 사용되더라도 `assertCreatePermission`이 최종 학생 목록 단위로 권한을 재검증하므로 실제 보안 구멍은 아님). 다만 "절대 반 전체 자동배포 금지"를 관례가 아닌 서버 강제 규칙으로 만들고 싶다면 `type==='student'` 이외 타깃을 명시적으로 거부하는 편이 안전하다.
- **미조치**: `tests/student-portal-wrong-clinic-hotfix.test.js`의 버전 문자열 assert. 실제 배포 시 캐시버스팅 버전을 올릴 때 함께 갱신 필요(배포 타이밍은 사용자 판단 필요 — `apmath 배포 토폴로지` 메모 참고: 프론트/워커/DB 3중 파이프라인이라 커밋만으로는 라이브 반영 안 됨).
- **미조치**: `tests/apmath-global-surface.test.js`, `tests/classroom-monthly-status-board.test.js` — classroom.js의 이전(비-본 세션) 변경분과 관련된 실패로, 이번 세션 범위 밖. 별도 확인 필요.
- **배포 필요**: 이번 세션에서 고친 워커 파일(`wrong-clinics.js`, `foundation-db.js`)은 `apmath/worker-backup/worker/`가 실제 라이브 소스이므로 `npx wrangler deploy`로 재배포해야 반영된다. 커밋만으로는 API가 갱신되지 않는다.

## 6. 실제로 읽은 기준 문서

- `docs/codex/CODEX_RESULT_RULE.md` (이 문서의 구조 규칙)
- `docs/MASTER_CURRENT_PROGRESS.md`, `docs/MASTER_NEXT_WORK.md` (3대 기준 문서 업데이트 판단용으로 열람)
- 저장된 메모리: `apmath 배포 토폴로지`(프론트/워커/DB 3중 배포), `git 푸시 워크플로`
- 기존 세션 로그(CODEX_LOOP0~7_WRONG_PRINT_*.md)는 명명 관례 확인용으로만 열람, 본문 내용을 근거로 삼지는 않음.

## 7. 실제로 확인한 코드/스키마 범위

- `apmath/js/clinic-print.js` 전체(1700여 줄) 처음부터 끝까지 직접 읽고 재검토.
- `apmath/worker-backup/worker/routes/wrong-clinics.js` 전체(1082줄) — 서브에이전트가 전체 조사, 본인이 권한체크/타깃정규화/패킷생성 구간(약 250~560줄) 직접 재확인 후 수정.
- `apmath/worker-backup/worker/helpers/foundation-db.js` 전체(약 100줄) 직접 확인 후 함수 추가.
- `apmath/wrong_print_engine.html`(2076줄) — 서브에이전트가 필드 매칭/정렬/모드 분기/레이아웃 관점으로 전체 조사, 본인은 git diff(약 20줄)만 직접 확인. 코드 자체는 수정하지 않음.
- `apmath/js/student.js` — 오답 클리닉 탭 렌더 함수(2093~2160줄) 직접 확인 후 수정. 나머지(3377줄)는 서브에이전트가 관련 함수(openWrongClinicPacket류, saveSession 등)만 검색 기반으로 조사.
- `apmath/student/index.html` — 오답 클리닉 관련 함수(세션 저장, 패킷 목록/오픈, URL 딥링크) 직접 확인 후 수정. 전체(3000줄 이상)를 처음부터 읽지는 않음.
- `apmath/js/classroom.js` — git diff(약 90줄) 직접 확인, 수정 없이 리뷰만.
- DB 스키마: `wrong_clinic_sets`/`wrong_clinic_set_items`/`wrong_clinic_distributions`/`wrong_clinic_packets`/`wrong_clinic_packet_items`의 `CREATE TABLE IF NOT EXISTS` 정의를 코드로 확인. 실제 원격 D1 스키마(`PRAGMA table_info`)는 조회하지 않음(로컬 코드 감사만 수행, 원격 접속 안 함).

## 8. 확인하지 못한 파일 또는 미검증 파일

- **실제 브라우저 동작 미검증**: 이번 세션 전체가 정적 코드 감사 + `node --check`/기존 Node 테스트 기반이며, 실제 Cloudflare Worker/D1 원격 환경이나 브라우저에서 반/학년/유형 클리닉 생성 → 학생 포털 수신 → 인쇄까지 end-to-end로 직접 클릭 테스트하지 않았다. 백엔드는 로그인 세션과 실 데이터가 필요해 로컬 재현이 불가능했다.
- `apmath/wrong_print_engine.html` — 서브에이전트 조사 결과만 신뢰했고 본인이 직접 전체를 읽지 않음.
- `apmath/js/classroom.js`의 `renderClassroomClinicStudentPackets`/`duplicate_item_count` 관련 로직 — 존재를 확인했고 오늘 다른 작업(사전 존재하는 중복 문항 감지)과 연관돼 보이나, 그 계산 로직 자체(워커의 duplicate 판정 SQL, 약 800~840줄)는 상세 검증하지 않음.
- `tests/apmath-global-surface.test.js`, `tests/classroom-monthly-status-board.test.js` 실패의 정확한 원인 코드(classroom.js의 이전 변경분)는 실패 메시지로만 확인했고 근본 수정은 시도하지 않음(범위 밖 판단).
- 원격 D1 실제 스키마 상태(마이그레이션 적용 여부)는 미확인 — 메모리 기록상 `d1_migrations` 추적을 쓰지 않는 프로젝트라 코드만으로는 라이브 스키마를 단정할 수 없음.

## 9. 추후 보강 필요 문서

- 없음. 이번 작업은 앱 코드 버그 수정이며 신규/변경이 필요한 문서 산출물은 없다고 판단.

## 10. 3대 기준 문서 업데이트 판정

**업데이트하지 않음.**

## 11. 업데이트한 기준 문서

- 없음.

## 12. 업데이트하지 않은 기준 문서와 사유

- `docs/MASTER_RULEBOOK.md`, `docs/MASTER_CURRENT_PROGRESS.md`, `docs/MASTER_NEXT_WORK.md` 모두 미수정.
  - 사유: 이 3개 문서는 열람 결과 "docs 구조 정리/정책" 추적용이며, "AP Math 운영센터" 항목 자체가 이미 "이번 작업에서 코드 검증 없음"으로 표기돼 있어 오답 클리닉 같은 개별 기능의 코드 버그 수정을 추적하는 문서가 아니다. 이번 작업은 문서 구조 변경이 아니라 `apmath/js`, `apmath/worker-backup/worker` 앱 코드 버그 수정이므로 이 3개 문서의 갱신 대상에 해당하지 않는다고 판단했다.

## 13. 자체 검수 결과

- `node --check`: `clinic-print.js`, `student.js`, `classroom.js`(무수정 확인), `wrong-clinics.js`, `foundation-db.js` 전부 통과.
- `student/index.html` 인라인 `<script>` 블록 전체 `new Function()` 파싱 통과.
- 로컬 테스트 전체 실행: PASS=97/FAIL=3/TOTAL=100 (실패 3건은 전부 본 세션 이전부터 존재, 4번 항목 상세 참조).
- 실제 배포/원격 실행 검증은 하지 않음(REAL BROWSER E2E: NOT VERIFIED) — 최종 확인은 실제 반/학년/유형 클리닉 생성 후 학생 포털에서 수신 여부를 눈으로 보는 것을 권장.

## 14. 리뷰팩 경로

- 해당 없음(이번 세션은 리뷰팩을 생성하지 않음).
