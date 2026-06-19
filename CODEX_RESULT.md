# Student Portal Version Cache Bust Hotfix Result

## 수정 파일
- apmath/student/index.html
- apmath/student/manifest.json
- apmath/student/student-version.json

## 문제 원인
- 모바일 홈 화면 앱/PWA가 예전 index/CSS/manifest를 캐시해 업데이트 후에도 예전 화면이 보일 수 있었다.
- 학생 프로그램에 명시적 앱 버전 확인/업데이트 안내 구조가 없었다.

## 핵심 변경
- STUDENT_APP_VERSION 추가
- student-version.json 추가
- 시작 시 student-version.json을 cache:no-store로 확인
- 새 버전 감지 시 업데이트 안내 표시
- 업데이트 버튼으로 version query/timestamp를 붙여 강제 재로딩
- manifest/icon/CSS 링크에 version query 추가
- 학생 세션 유지
- ?omr=1 기존 처리 유지

## 검수 결과
- 새 버전 감지: checkStudentPortalVersion()이 ./student-version.json?ts=Date.now()를 cache:'no-store'로 요청하고, 버전 불일치 시 showStudentUpdateNotice()를 호출하도록 확인
- 업데이트 버튼: reloadStudentPortalWithVersion()이 기존 URL의 query를 유지하면서 v/t를 set하고 window.location.replace()로 재로딩하도록 확인
- 기존 학생 세션 유지: 업데이트 경로에서 localStorage/sessionStorage 삭제 없음, clearSession() 미사용 확인
- OMR URL: shouldOpenOmrFromUrl()이 URLSearchParams로 omr=1만 확인하므로 v/t query와 충돌하지 않음
- manifest 로드: ./manifest.json?v=2026.06.19.1 링크 확인, manifest JSON parse 통과
- CSS/icon cache bust: apms-ui-foundation.css, apms-theme-override.css, manifest/icon/apple-touch-icon/brand/install icon에 v=2026.06.19.1 확인
- 모바일 홈 화면 앱: 기존 sw.js는 navigation network-first이며 query cache key와 충돌하지 않도록 확인, 실제 모바일 기기 검수는 미실행
- 콘솔 치명 오류: HTML 내부 script를 OS temp로 추출해 node --check 통과

## 확인 명령
- git diff --check: 통과, LF to CRLF working copy warning만 표시
- Select-String: STUDENT_APP_VERSION, student-version.json, cache:'no-store', showStudentUpdateNotice, reloadStudentPortalWithVersion, omr, manifest.json, apms-ui-foundation.css 확인
- JS parse 확인: UTF-8로 HTML 내부 script를 OS temp에 추출 후 node --check 통과

## 수정하지 않은 항목
- Service Worker 신규 도입 없음
- 학생 로그인 API 변경 없음
- DB/Worker 변경 없음

## 남은 위험
- 일부 모바일 WebView는 HTML 자체를 강하게 캐시할 수 있어 최초 1회는 앱 완전 종료 또는 URL version 진입이 필요할 수 있음
- 홈 화면 아이콘/앱 이름 변경은 재설치가 필요할 수 있음
