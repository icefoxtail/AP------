# AP/EIE/Archive Auth Backend Cleanup Round 2 Result

## 수정 파일
- apmath/js/classroom-planner.js
- apmath/js/wangji-student-management.js
- archive/index.html
- archive/mixer.html
- archive/engine.html
- archive/mixed_engine.html
- archive/assessment/assessment-mvp.html
- eie/js/eie-api.js
- eie/js/eie-app.js
- shared/js/wangji-owner-auth-bridge.js

## 전제
- 이전 P0 인증 브릿지 수정은 유지
- 학생 포털 캐시 수정은 건드리지 않음

## 해결한 문제
- hardcoded API base 반복 정리
- AP direct fetch 401/403 처리 보강
- Archive QR API 실패 안내 보강
- EIE Basic 전송 차단/401/403 처리 보강
- Wangji/shared bridge API base 정리

## 핵심 변경
- Archive/AP/Wangji 계열 API base를 파일 내부 상수와 기존 window override 중심으로 정리했다.
- AP classroom planner direct fetch가 401/403 외 실패에서 기존 ledger 데이터를 빈 배열로 덮어쓰지 않도록 보강했다.
- Archive QR class 조회, assignment 저장, blueprint 저장 실패에 401/403/auth/network 안내를 추가했다.
- assessment QR 실패 상태에서도 일반 시험지 출력 버튼을 유지했다.
- EIE API wrapper와 EIE app auth helper에서 legacy Basic 값을 제거하고, Bearer가 없으면 Worker 호출 전에 로그인 흐름으로 복귀하게 했다.
- Wangji student management의 EIE auth header 생성 경로에서 Basic 전송을 차단했다.

## 검수 결과
- AP direct fetch 401: PASS - handleUnauthorizedResponse 호출 경로 확인
- AP direct fetch 403: PASS - 권한 안내 toast 경로 확인
- Archive QR 401: PASS - 로그인 후 재시도 안내 및 일반 출력 경로 유지
- Archive QR 403: PASS - 원장/담당 선생님 권한 확인 안내 및 일반 출력 경로 유지
- Archive 일반 출력: PASS - QR API 실패 분기만 변경, 출력/렌더링 구조 미변경
- EIE Bearer 정상: PASS - Bearer header 유지
- EIE Basic legacy 차단: PASS - Basic 제거 후 Bearer 없으면 로그인 복귀
- API base 반복 정리: PASS - 파일 내부 상수/해석기 사용, endpoint path 유지
- 콘솔 치명 오류: PASS - node --check 및 HTML inline parse 통과

## 확인 명령
- git diff --check: PASS, LF/CRLF 경고만 있음
- Select-String: PASS, 지정 패턴 확인
- node --check: PASS, touched JS 확인
- HTML inline parse: PASS, OS temp 추출 후 parse 확인

## 수정하지 않은 항목
- DB schema: 변경하지 않음
- Worker endpoint 이름/응답 구조: 변경하지 않음
- EIE 시간표 UI/레이아웃: 변경하지 않음
- AP 대시보드 디자인: 변경하지 않음
- Archive 출력 엔진 렌더링/MathJax/인쇄 구조: 변경하지 않음
- 학생 포털 캐시/서비스워커: 변경하지 않음
- P0 인증 브릿지 재작성: 변경하지 않음

## 남은 위험
- 실제 모바일 WebView/배포 Worker 차이는 실기기 확인 필요
- live Worker 401/403 응답은 로컬 정적 검증으로만 확인했으며 실서버 호출 검증은 하지 않음

## 리뷰 봇 결과
- Codex B logic/routing: PASS after rerun
- Codex C UI/UX/CSS: PASS, runtime screenshot은 UNVERIFIED
- Codex D tests/regression: PASS, live browser/WebView는 UNVERIFIED
