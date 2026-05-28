# CODEX_RESULT

## 1. 생성/수정 파일

- 수정: `eie/js/utils/eie-normalize.js`
- 수정: `eie/js/utils/eie-excel-parser.js`
- 수정: `eie/js/eie-state.js`
- 수정: `eie/js/views/eie-timetable.js`
- 수정: `eie/js/views/eie-student-seeds.js`
- 수정: `eie/css/eie.css`
- 수정: `apmath/worker-backup/worker/routes/eie.js`
- 수정: `docs/EIE_WORKING_RULEBOOK.md`
- 수정: `docs/EIE_TIMETABLE_DATA_MODEL.md`
- 생성/수정: `CODEX_RESULT.md`

## 2. 구현 완료 또는 확인 완료

- Round 5 학생·전화번호 후보 검토 1차 구현.
- 엑셀 parser가 수업 셀별 `raw_meta_json.student_candidates`, `student_names`, `contact_candidates`, `needs_review_reasons`를 생성하도록 보강.
- 시간표 셀에는 학생 이름 chip만 표시하도록 구현.
- 학생 이름 클릭 시 오른쪽 학생 후보 상세 패널 표시.
- 전화번호는 시간표 셀에 노출하지 않고 학생 후보 상세 패널에서만 표시.
- 동명이인 표시는 같은 정규화 전화번호가 2건 이상인 후보 기준으로 보정.
- v5 보정: 기존 데이터가 `student_candidates` 없이 `student_names`, `students`, `studentSeeds`만 가진 경우에도 chip 클릭 상세 패널이 열리도록 `EieState.findStudentCandidate()` fallback을 추가.
- 학생 후보 검토 화면에서 학생 후보/연락처 후보/확인 필요/전화 없음 요약 및 목록 표시.
- Worker `routes/eie.js`의 student-seeds/contact-seeds/needs-review stub을 `eie_timetable_cells.raw_meta_json` 기반 read-only 응답으로 교체.
- `eie_students`, `eie_student_contacts`, `eie_student_schedule_assignments` 정식 테이블/쓰기 API는 만들지 않음.
- import 상세 조회 SQL의 중복 `FROM eie_import_sessions` 오타를 함께 보정.
- EIE Round 4/5 범위 문서를 현재 기준으로 정정.

## 3. 실행 결과

- `node --check eie/js/eie-app.js` PASS
- `node --check eie/js/eie-state.js` PASS
- `node --check eie/js/eie-api.js` PASS
- `node --check eie/js/utils/eie-normalize.js` PASS
- `node --check eie/js/utils/eie-excel-parser.js` PASS
- `node --check eie/js/views/eie-dashboard.js` PASS
- `node --check eie/js/views/eie-import.js` PASS
- `node --check eie/js/views/eie-student-seeds.js` PASS
- `node --check eie/js/views/eie-timetable.js` PASS
- `node --check apmath/worker-backup/worker/routes/eie.js` PASS
- 금지 테이블 생성 문자열 검색 결과: 신규 생성 없음
- EIE route 내 APMS 학생/학부모/반 배정 테이블 INSERT 검색 결과: 신규 INSERT 없음
- 시간표 셀 렌더 영역 전화번호 직접 노출 검색 결과: 상세 패널 표시만 존재

## 4. 결과 요약

Round 5는 새 정식 학생/연락처 테이블 없이 기존 import/timetable cell staging 데이터 안의 raw metadata를 활용하는 후보 검토 단계로 구현했다. 시간표에서는 학생 이름만 빠르게 확인하고, 개인정보 성격의 전화번호는 상세 패널 또는 후보 검토 화면에서만 확인하도록 분리했다. v5에서는 기존 import 데이터 호환을 위해 `student_names` fallback chip 클릭 시에도 상세 후보를 생성해 열 수 있도록 보정했다.

## 5. 다음 조치

- 프로젝트에 패치 적용 후 EIE에서 엑셀 가져오기 또는 기존 import 데이터를 기준으로 시간표 화면 진입.
- `raw_meta_json.student_candidates`가 있는 새 데이터와 `raw_meta_json.student_names`만 있는 기존 데이터 모두에서 학생 chip 클릭 상세 패널이 열리는지 확인.
- 학생 chip 표시, 상세 패널, 전화번호 상세 전용 노출, 같은 전화번호 기준 동명이인/전화 없음/확인 필요 badge를 브라우저에서 확인.
- Round 4 기능인 수업 셀 추가/수정/status/filter/archived 전체 보기/새로고침 유지 여부 확인.
- Worker 배포 전 `/api/initial-data` 회귀 확인은 유지.
- Round 6 또는 별도 확정 라운드 전까지 학생/연락처/수업배정 정식 생성은 계속 금지.

검수팩:
- Gemini/외부 검수용 part01: `eie-round5-student-phone-candidates-review-pack-v5-part01-core-20260528.zip`
- Gemini/외부 검수용 part02: `eie-round5-student-phone-candidates-review-pack-v5-part02-context-20260528.zip`
