# PUBLIC_PRIVATE_ROUTE_AUDIT

감사 일자: 2026-05-29  
기준 배포: https://icefoxtail.github.io/AP------/

---

## 경로별 감사 결과

| 경로 | title | 역할 추정 | 공개 접근 | 로그인/PIN | API 호출 | 노출 위험도 | 권장 분류 |
|------|-------|-----------|-----------|------------|----------|-------------|-----------|
| / (index.html) | 왕지교육 — 교육 브랜드 허브 | 왕지교육 브랜드 대문 | ✅ 공개 | 없음 | 없음 | 낮음 | 공개 가능 |
| /apmath-home/ | AP MATH — 중·고등 수학 전문관 | AP MATH 브랜드 소개 | ✅ 공개 | 없음 (시안 제거 완료) | 없음 | 낮음 | 공개 가능 |
| /apmath/ | AP Math OS | 운영 앱 진입점 (fetch 호출) | 진입 가능 | 없음 (Worker 연결) | ✅ 있음 | 중간 | 운영 앱 진입점 — 공개 가능하나 데이터는 Worker 보호 필요 |
| /apmath/student/ | AP Math OS \| 학생 포털 | 학생 PIN 입력 포털 | 진입 가능 | ✅ PIN 필요 | ✅ 있음 | 중간 | 학생 PIN 진입 — HTML 공개, 데이터는 Worker 보호 |
| /apmath/homework/ | AP Math OS \| 과제 제출 | 과제 제출 화면 | 진입 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 학생 PIN 진입 |
| /apmath/planner/ | AP Math Planner | 플래너 | 진입 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 선생님/원장님 로그인 필요 |
| /apmath/wrong_print_engine.html | AP Math 오답 클리닉 | 오답 출력 엔진 | 직접 접근 가능 | ✅ PIN | ✅ 있음 | 중간 | 선생님 전용 도구 — PIN 보호 |
| /archive/ | JS아카이브 \| 수학 기출 통합 시스템 | 기출 아카이브 메인 | 진입 가능 | ✅ 로그인 | ✅ 있음 | 중간 | 선생님/원장님 로그인 필요 |
| /archive/engine.html | JS아카이브 엔진 | 아카이브 출력 엔진 | 직접 접근 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 선생님 전용 도구 |
| /archive/mixed_engine.html | JS아카이브 믹서 출력 | 믹서 출력 | 직접 접근 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 선생님 전용 도구 |
| /archive/mixer.html | JS아카이브 믹서 | 믹서 편집 | 직접 접근 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 선생님 전용 도구 |
| /eie/ | EIE 영어 관리 | EIE 내부 관리 | 직접 접근 가능 | 없음 | 없음 | 낮음 | 내부 문서 수준 — 향후 이전 고려 |
| /planner/ | AP Math Planner | 루트 레벨 플래너 | 진입 가능 | ✅ PIN+로그인 | ✅ 있음 | 중간 | 선생님/원장님 로그인 필요 |
| /manual/ | AP Math OS 사용설명서 | 운영 설명서 | ✅ 공개 접근 | 없음 | 없음 | 낮음 | 공개 가능 (내부용 문서) |
| /check/ | AP Math 오답 제출 | 오답 제출 화면 | ✅ 공개 접근 | 없음 | 없음 | 낮음 | 학생 접근 가능 |

---

## 핵심 판단

### GitHub Pages 정적 호스팅 특성

- HTML 파일 자체는 URL을 알면 누구나 접근 가능하다.
- 데이터 보호는 HTML 숨김으로 불가능하다.
- Worker/API 레벨에서 인증/권한 처리가 되어 있으면 HTML이 공개되어도 데이터는 안전하다.

### 현재 위험도 평가

- **낮음**: 브랜드 대문(/, /apmath-home/), 설명서(/manual/), 오답 제출(/check/)
- **중간**: 운영 앱(/apmath/), 학생 포털(/apmath/student/), 아카이브(/archive/) — PIN/로그인 보호 있음, 단 Worker 보호 별도 확인 필요
- **주의**: /eie/ — 로그인 없이 접근 가능, 민감 정보 없으면 무해하나 정리 권장

### 권장 조치

1. Worker/API 엔드포인트에 인증 확인 (HTML 숨김 불가)
2. /eie/ 내용 점검 후 공개 여부 결정
3. /apmath/wrong_print_engine.html 등 직접 URL 접근 가능한 도구는 PIN 보호 유지
