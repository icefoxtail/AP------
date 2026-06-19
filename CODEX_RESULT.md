# AP/EIE/Archive Live Flow Smoke Test Result

## 작업 성격
- 검수 전용
- 코드 수정 없음
- 결과 보고서 CODEX_RESULT.md만 갱신

## 검수 환경
- 로컬: http://127.0.0.1:8765 임시 HTTP 서버
- GitHub Pages: https://icefoxtail.github.io/AP------/ 주요 URL 200 응답 확인
- 모바일 WebView/PWA: UNVERIFIED
- 브라우저: Codex in-app browser

## 검수 결과 요약
- AP → Archive: UNVERIFIED - 운영 로그인 계정 없음. 세션 없는 로컬 Archive 진입 시 기출 보기 OFF 확인.
- Archive index AP 제출 QR: UNVERIFIED - 운영 로그인 계정 없음. 인증 없는 QR 진입은 로그인 안내와 일반 출력 버튼 표시 확인.
- Archive 일반 출력 fallback: PASS - no-session QR 흐름에서 일반 시험지 출력 버튼 표시 확인.
- Mixer → mixed_engine: UNVERIFIED - mixer 로드와 mixed_engine 참조/query 구성 코드는 확인, 카트 구성 후 실제 QR 출력은 미검수.
- Assessment MVP: PASS/PARTIAL - 페이지 로드, AP QR no-session fallback, 일반 출력 버튼 유지 확인. 인증된 반 목록은 UNVERIFIED.
- EIE 진입: PASS/PARTIAL - 토큰 없음 상태에서 로그인 화면 표시 확인. Bearer 정상/실제 401/403 Worker 응답은 UNVERIFIED.
- Wangji 학생관리: PASS/PARTIAL - 화면 로드, AP/EIE 401 section error 분리 확인. 인증된 AP/EIE 조회는 UNVERIFIED.
- 학생 포털 캐시: PASS/PARTIAL - v2026.06.19.1 표시 확인. in-app browser에서 serviceWorker API 미노출로 SW 등록/Cache Storage는 UNVERIFIED.

## PASS 항목
- `git diff --check` 통과.
- 지정 JS `node --check` 통과.
- Archive/engine/mixer/mixed_engine/assessment HTML inline script OS temp 추출 parse 통과.
- GitHub Pages root, archive index, student portal URL 200 응답 확인.
- Archive index 로컬 로드 확인.
- Archive no-session AP 제출 QR 흐름에서 로그인 안내와 일반 시험지 출력 버튼 표시 확인.
- Assessment MVP 로컬 로드 및 no-session AP 제출 QR fallback에서 일반 시험지 출력 버튼 표시 확인.
- EIE 토큰 없음 상태에서 로그인 화면 표시 확인.
- Wangji 학생관리에서 AP/EIE 401이 전체 화면 중단이 아니라 section error로 분리되는 것 확인.
- 학생 포털 화면 하단 `v2026.06.19.1` 표시 확인.
- `student-version.json`, `apmath/student/sw.js`, `apmath/student/index.html` 버전 문자열 일치 확인.
- EIE Basic 제거/Bearer 우선 코드 경로 확인.
- Wangji EIE auth header가 Basic 제거 후 Bearer만 보내는 코드 경로 확인.

## FAIL 항목
- 없음.

## 발견된 위험
- 운영 AP/EIE 계정이 없어 실제 Bearer 로그인 후 Archive 반 목록, QR 생성, `class-exam-assignments`, `exam-blueprints` live 응답은 UNVERIFIED.
- in-app browser 환경에서 `window.navigator.serviceWorker`가 노출되지 않아 학생 포털 Service Worker 등록과 Cache Storage 이름은 브라우저 런타임에서 UNVERIFIED.
- Mixer는 로드와 출력 버튼/`mixed_engine.html` 참조까지 확인했지만, 실제 문항 카트 구성 후 QR 출력은 UNVERIFIED.
- Archive index fallback 일반 출력 버튼 클릭 후 로컬 브라우저 URL 전환은 확정 검증하지 못함. 버튼 노출은 확인했으나 엔진 이동은 추가 수동 확인 권장.

## 수정 필요 시 최소 수정안
- 현재 smoke test에서 즉시 수정할 FAIL은 없음.
- 인증 실사용 확인을 위해 AP 원장/선생님 테스트 계정으로 다음만 추가 검수 필요:
  - Archive `/qr-classes` 200 및 반 목록 표시
  - Engine/Mixed Engine QR 표시
  - `/class-exam-assignments`, `/exam-blueprints` 200/2xx 응답
  - EIE Bearer 상태에서 dashboard/teacher/timetable/students route 진입
- 학생 포털 SW/Cache는 일반 Chrome 또는 모바일 PWA에서 Application 탭으로 추가 확인 필요.

## 건드리지 않은 항목
- DB schema
- Worker endpoint
- 출력 렌더링
- EIE 시간표 UI
- 학생 포털 UI
