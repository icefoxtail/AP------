# APMATH_ACCESS_CONTROL_NEXT_PLAN

작성일: 2026-05-29

---

## 현황 요약

### GitHub Pages 정적 호스팅 한계

GitHub Pages는 HTML 파일에 대한 접근 제어를 지원하지 않는다.

- URL을 알면 누구나 HTML 파일에 직접 접근할 수 있다.
- `.htaccess`, `HTTP 401`, `HTTP 403` 응답이 불가능하다.
- **HTML 파일 숨김으로 데이터를 보호할 수 없다.**

### 현재 보호 체계

AP Math OS는 Cloudflare Worker 기반 API를 사용한다.

- 민감 데이터는 Worker 엔드포인트에서 인증 후 응답한다.
- HTML 파일이 공개되어도 데이터는 Worker 인증을 통과해야 접근 가능하다.
- 이 구조라면 HTML 공개 자체는 큰 위험이 아니다.

---

## 경로별 접근 제어 현황

| 경로 | 현재 보호 | 권장 |
|------|-----------|------|
| /apmath/ | Worker 연결 (fetch) | Worker 인증 확인 |
| /apmath/student/ | PIN 입력 필요 | PIN + Worker 인증 |
| /apmath/homework/ | PIN + 로그인 | PIN + Worker 인증 |
| /apmath/planner/ | PIN + 로그인 | PIN + Worker 인증 |
| /apmath/wrong_print_engine.html | PIN 필요 | PIN + Worker 인증 |
| /archive/ | 로그인 필요 | Worker 인증 확인 |
| /archive/engine.html | PIN + 로그인 | PIN + Worker 인증 |
| /archive/mixed_engine.html | PIN + 로그인 | PIN + Worker 인증 |
| /archive/mixer.html | PIN + 로그인 | Worker 인증 확인 |
| /eie/ | 없음 | 내용 점검 후 판단 |

---

## 다음 작업 제안

### 단기 (즉시)

1. `/eie/index.html` 내용 점검 — 민감 정보가 없으면 그대로, 있으면 비공개 처리 (저장소에서 제거 또는 Worker 인증 페이지로 교체)
2. Worker 엔드포인트에 실제 인증 미들웨어가 적용되어 있는지 확인
3. PIN 방식 외 토큰/세션 인증이 필요한 경로 우선 순위 정리

### 중기 (도메인 이전 전)

1. 커스텀 도메인 적용 시 Cloudflare Pages 또는 Vercel로 이전 검토
   - Cloudflare Pages: Worker 통합, 엣지 인증 가능
   - Vercel: 미들웨어 인증, 경로별 보호 가능
2. 운영 앱(`/apmath/`)을 별도 서브도메인으로 분리 (`app.wangjiedu.com` 등)

### 장기 (운영 안정화)

1. 학생 포털을 완전히 분리된 서브도메인으로 이전
2. 아카이브를 내부 전용 도메인에 배치
3. 왕지교육 브랜드 대문만 공개 도메인에 유지

---

## 현재 리스크 평가

**낮음**: HTML 공개 자체는 Worker 인증이 정상 작동한다면 데이터 노출 없음  
**중간**: Worker 인증이 누락된 엔드포인트가 있을 경우 데이터 노출 가능  
**높음**: PIN이 클라이언트 JS에만 저장되어 있을 경우 우회 가능 (Worker 검증 필요)

Worker 인증 코드 감사를 별도 작업으로 진행할 것을 권장한다.
