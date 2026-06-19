# Student Portal Service Worker Version Sync Result

## 수정 파일
- apmath/student/index.html
- apmath/student/sw.js
- apmath/student/manifest.json
- apmath/student/student-version.json

## 문제 원인
- 학생 포털 앱 버전과 service worker cache name이 따로 관리되고 있었다.
- service worker가 일부 정적 리소스를 cache-first로 잡아 새 화면 반영이 늦을 수 있었다.
- student-version.json이 service worker 캐시에 잡힐 위험이 있었다.

## 핵심 변경
- STUDENT_SW_VERSION 추가
- CACHE_NAME을 학생 포털 버전 기반으로 변경
- student-version.json network-only 처리
- ?v / ?t / ?ts 요청 network-first 처리
- service worker register에 version query 및 update() 보강
- 학생 세션 유지
- ?omr=1 기존 처리 유지

## 검수 결과
- 버전 일치: STUDENT_APP_VERSION, STUDENT_SW_VERSION, manifest.json version, student-version.json version 모두 2026.06.19.1로 확인
- 새 버전 감지: 기존 checkStudentPortalVersion()이 student-version.json?ts=Date.now()와 cache:'no-store'를 사용하고, service worker도 student-version.json을 network-only로 처리함
- 업데이트 버튼: reloadStudentPortalWithVersion()이 기존 query를 유지하면서 v/t를 set하고 location.replace()를 호출함
- service worker cache 교체: CACHE_NAME이 apmath-student-portal-2026.06.19.1로 변경되며 activate에서 다른 cache key를 삭제함
- student-version.json no-store: sw.js fetch handler에서 /student-version.json 요청을 fetch(req, { cache:'no-store' })로 처리함
- OMR URL: shouldOpenOmrFromUrl()은 omr=1만 확인하므로 ?omr=1&v=2026.06.19.1과 충돌하지 않음
- 기존 학생 세션: 업데이트 및 service worker 흐름에서 APMATH_STUDENT_PORTAL_SESSION, PLANNER_SID, PLANNER_PIN 삭제 없음
- 로그인/홈/과제/플래너/OMR: API, 세션, 데이터 구조 변경 없음
- 콘솔 치명 오류: sw.js node --check 통과, HTML 내부 script OS temp 추출 후 node --check 통과

## 확인 명령
- git diff --check: 통과, LF to CRLF working copy warning만 표시
- node --check sw.js: 통과
- Select-String: STUDENT_APP_VERSION, student-version.json, serviceWorker.register, reloadStudentPortalWithVersion, omr, STUDENT_SW_VERSION, CACHE_NAME, skipWaiting, clients.claim, searchParams, manifest/student-version version 확인

## 남은 위험
- 이미 아주 오래된 service worker가 잡힌 기기는 최초 1회 앱 완전 종료 또는 브라우저 캐시 삭제가 필요할 수 있음
- 홈 화면 아이콘/앱 이름 변경은 OS 정책상 재설치가 필요할 수 있음
