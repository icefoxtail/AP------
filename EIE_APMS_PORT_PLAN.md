# EIE_APMS_PORT_PLAN

## 1. 실제 확인한 APMS 파일

- apmath/index.html — CSS 변수, header, sticky nav, 라우팅 구조
- apmath/js/dashboard.js — 원장님 대시보드 카드 구조, copyPhoneNumber, apEscapeHtml

## 2. 실제 확인한 EIE 파일

- eie/index.html — 현재 shell, nav, script 로드 순서
- eie/css/eie.css — 전체 1123줄. eie-admin-* 카드 CSS 이미 존재
- eie/js/eie-api.js — PROD_WORKER_ORIGIN = wangji-eie-os. resolveApiBase, findStoredAuthHeader, makeHeaders, stubResponse, request, get 내부 함수
- eie/js/eie-app.js — escapeHtml, mount, renderPanel (forbidden text 포함)
- eie/js/eie-router.js — dashboard/timetable 2개 route만 있음
- eie/js/eie-state.js — 전체 상태 관리 (import/timetable/student 상태 혼재)
- eie/js/views/eie-dashboard.js — 운영센터 1카드만 있음
- eie/js/views/eie-timetable.js — 관리 UI 과다 (수업 추가, filter, summary, editor panel, status 버튼, confirm 버튼)
- apmath/worker-backup/worker/routes/eie.js — EIE worker route (읽기 전용 확인)

## 3. APMS에서 EIE로 그대로 이식할 구조

- 앱 shell: sticky header, brand, nav pill, main 컨테이너
- 원장님 대시보드 레이아웃: eie-admin-head (타이틀/원장님), shortcuts (앱 전환), card-grid (4카드)
- 학생관리 진입 구조: 카드 클릭 → students route → 목록 + 상세 패널
- 클래스룸 진입 구조: 카드 클릭 → classroom route → 수업카드 + 상세 패널
- 기본 카드 UI: eie-admin-card CSS (이미 존재)
- 학생 상세 패널: eie-student-detail-panel, eie-detail-grid, eie-detail-row (이미 존재)
- 인증/API 호출 방식: eie-api.js 구조 그대로 (localStorage 기반 auth header)

## 4. EIE에서 다르게 할 것

- Worker URL: wangji-eie-os.js-pdf.workers.dev (APMS와 다름)
- 브랜드: EIE 영어 관리
- 시간표: day_label 아닌 period_order/period_label/start_time 기반 그리드
- 선생님: Carmen, IVY, Lily, Stacy, Zoe (DB에서 동적 로드)
- 수업명/반명: class_name_raw 직접 표시
- 학생: confirmed-students API 기반 (timetable assigned_students 파싱 금지)
- 관리: 준비 상태 placeholder

## 5. 현재 eie/ 파일별 판정

| 파일 | 판정 | 이유 |
|------|------|------|
| eie/index.html | 수정 | nav 링크 추가, 신규 view 스크립트 로드 추가 |
| eie/css/eie.css | 수정 | eie-student-list, eie-student-row, eie-notice-box 추가 |
| eie/js/eie-api.js | 유지 | 검수 PASS. 내부 구조 수정 금지 |
| eie/js/eie-app.js | 수정 | fetchWithAuth 추가, forbidden text 제거 |
| eie/js/eie-router.js | 수정 | students/classroom/management route 추가 |
| eie/js/eie-state.js | 유지 | 그대로 유지 |
| eie/js/views/eie-dashboard.js | 교체 | 4카드 + AP MATH/EIE 전환 |
| eie/js/views/eie-timetable.js | 교체 | 관리 UI 전체 제거, 원장 확인용으로 정리 |

## 6. 오늘 실제 구현 범위

- APMS 복제형 EIE shell (index.html 수정)
- EIE 대시보드 4카드 (시간표/학생관리/클래스룸/관리)
- EIE 시간표 연결 (원장 확인용, 관리 UI 제거)
- 학생관리 shell (confirmed-students 기반 목록, 전화번호 상세 전용)
- 클래스룸 shell (timetable 수업 카드, 학생 목록)
- 관리 shell (placeholder)
- eie-students.js, eie-classroom.js, eie-management.js 신규 생성

## 7. 오늘 건드리지 않는 것

- APMS 원본 (apmath/ 전체)
- Worker/D1
- migration/seed
- 실제 학생관리 write
- 실제 클래스룸 write
- drag/drop
- eie/js/eie-api.js 내부 구조
- eie/js/eie-state.js (그대로 유지)

## 8. 위험 요소 및 대응

| 위험 | 대응 |
|------|------|
| 대시보드 원본 훼손 | apmath/js/dashboard.js 수정 금지. EIE 전용 파일만 수정 |
| Worker URL 혼선 | eie-api.js wangji-eie-os 유지. ap-math-os-v2612 grep 확인 |
| 인증 누락 | fetchWithAuth: localStorage auth header 전달 |
| 전화번호 노출 | 시간표 셀/학생 목록에 phone 미표시. 상세 패널에서만 표시 |
| 과거 압축파일 혼입 | 작업 파일은 eie/ 및 루트 .md 파일만 |
| EIE import/student-seeds 재도입 | router에 해당 route 없음. index.html에 해당 script 없음 |
| API fallback 빈 시간표 문제 | result.fallback === true 시 "시간표를 불러오지 못했습니다." 명시 표시 |

## 9. 선생님 목록 (D1 실제 확인)

- Carmen
- IVY
- Lily
- Stacy
- Zoe

DB에서 teacher_name_raw로 동적 로드. TIMETABLE_FIXED_TEACHERS 하드코딩 없음.
