# Archive Session Bridge Completion Hotfix Result

## 수정 파일
- archive/index.html
- archive/mixer.html
- CODEX_RESULT.md

## 문제 원인
- AP Math OS 대시보드는 #apmsess 해시로 세션을 전달하고 있었지만 archive/index.html의 복원 함수명이 일관되지 않았고 init() 시작부에서 복원되지 않았다.
- archive/index.html에서 세션 복원이 DB 로드와 권한 계산보다 먼저 보장되지 않으면 mixer.html로도 세션이 안정적으로 이어지지 않는다.
- archive/mixer.html은 window.onload에서 restoreApmathSessionFromHash()를 호출하므로 함수 정의와 호출 순서가 유지되어야 한다.

## 핵심 변경
- archive/index.html에 restoreApmathSessionFromHash() 복원 흐름을 명명 일관화
- archive/index.html init() 시작부에서 세션 복원
- archive/index.html -> mixer.html 이동 시 APMATH_SESSION 기반 #apmsess 유지
- archive/mixer.html의 #apmsess 복원 함수 정의 유지 및 index와 동일한 payload 허용 기준 적용
- mixer QR 인증은 session_token Bearer 우선, Basic fallback 유지
- index/mixer 세션 없음 fallback에서 일반 시험지 출력 유지

## 검수 결과
- AP 대시보드 -> archive/index 세션 복원: PASS, init() 시작부에서 restoreApmathSessionFromHash() 호출
- archive/index 기출 보기 권한: PASS, includeOriginalArchiveItems 계산 전에 복원 실행
- archive/index -> mixer 세션 유지: PASS, buildArchiveInternalUrl('mixer.html') 구조 유지
- mixer AP 제출 QR 반 목록: PASS, getMixerAssignmentAuthHeader() Bearer 우선 유지
- session_token only 상태: PASS, 정적 계약 검증 통과
- raw_password fallback 상태: PASS, Basic fallback 유지
- 세션 없음 fallback: PASS, index와 mixer 모두 일반 시험지 출력 버튼 유지
- 일반 시험지 출력: PASS, 로그인 필수로 변경하지 않음
- 모바일 앱/WebView: UNVERIFIED, 실제 모바일 WebView 실기기 확인 필요
- URL 해시 제거: PASS, 복원 시 history.replaceState()로 hash 제거
- 콘솔 치명 오류: PASS, inline script parse 검증 통과

## 확인 명령
- 브라우저 콘솔 기준 치명 JS 오류 없음: inline script parse로 대체 확인
- git diff --check 통과
- 수정 파일 외 불필요 파일 생성 없음
- node tests/archive-subject-synonym-search.test.js 통과
- node tests/assessment-grade-target-assignment.test.js 통과

## 남은 위험
- WebView별 localStorage 격리 차이
- session_token 만료 시 재로그인 UX
- Worker Bearer 인증 지원 범위
