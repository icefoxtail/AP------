# PROJECT_STRUCTURE.md

## 0. 문서 목적
이 문서는 AP Math OS, 학생/플래너/과제 하위 앱, JS아카이브, Worker 백업, 운영 보조 문서의 현재 폴더 구조와 주요 파일 역할을 빠르게 파악하기 위한 구조 요약 문서다.

## 1. 마지막 갱신
- 갱신 일시: 2026-05-14 16:40:56 +0900 (KST)
- 갱신 기준 브랜치: `main`
- 갱신 기준 커밋: `cbceb3f`

## 2. 최상위 구조

```text
/
├─ apmath/
│  ├─ js/
│  ├─ homework/
│  ├─ planner/
│  ├─ student/
│  └─ worker-backup/
├─ archive/
│  ├─ assets/
│  └─ exams/
├─ check/
├─ manual/
├─ planner/
├─ report-ai-proxy/
├─ alive/
├─ rules/
├─ index.html
├─ robots.txt
├─ CODEX_TASK.md
├─ CODEX_RESULT.md
└─ PROJECT_STRUCTURE.md
```

## 3. 주요 폴더 역할

| 경로 | 역할 | 비고 |
| --- | --- | --- |
| `apmath/` | AP Math OS 메인 프론트엔드와 하위 학생 앱 묶음 | 운영 화면 중심 |
| `apmath/js/` | AP Math OS 핵심 로직 JS 모음 | 대시보드, 일정, 학생, 교재, OMR 등 |
| `apmath/homework/` | 학생 과제 제출 화면 | 학생 제출 전용 진입점 |
| `apmath/planner/` | AP Math OS 내부 플래너 앱 | 별도 manifest 포함 |
| `apmath/student/` | 학생 개인 포털 | 이름+PIN 로그인 포털 |
| `apmath/worker-backup/worker/` | Cloudflare Worker API 및 D1 스키마 백업본 | 실운영 API 구조 추적용 |
| `archive/` | JS아카이브 메인 화면과 시험지 출력/믹서 엔진 | 기출·유사 문항 작업용 |
| `archive/assets/` | 시험지 이미지 등 자산 폴더 | 개별 파일은 대량이라 폴더 단위 관리 |
| `archive/exams/` | 원본/유사/유형 시험지 JS 데이터 저장소 | 학교/학년/시험 구분 포함 |
| `check/` | 학생 오답 제출 독립 페이지 | QR/오답 제출 흐름과 연결 |
| `manual/` | 선생님용 검색형 사용설명서 | 정적 데이터 기반 설명서 |
| `planner/` | 루트 레벨 독립 플래너 페이지 | `apmath/planner/`와 별도 경로 |
| `report-ai-proxy/` | 외부 AI 분석 프록시 서버 | Gemini 호출용 Node 서비스 |
| `alive/` | 문제 생성·검수용 프롬프트 모음 | 운영 문서성 자산 |
| `rules/` | 프로젝트 규칙·프로토콜 문서 모음 | 검수/수정/해설 기준 |
| `.agents/`, `.claude/`, `.codex/` | 에이전트/도구 설정 디렉터리 | 개발 보조 메타 폴더 |

## 4. 주요 파일 역할

| 파일 | 역할 | 수정 주의 |
| --- | --- | --- |
| `index.html` | 루트 진입 HTML, 제목은 `AP Math OS` | 상위 랜딩 연결점 여부 확인 |
| `apmath/index.html` | AP Math OS 메인 HTML, 제목은 `AP Math OS` | 메인 대시보드 진입 구조 주의 |
| `apmath/app.js` | OS 부트스트랩 성격의 상위 스크립트 | 다른 JS 모듈 연동 확인 필요 |
| `apmath/js/core.js` | API_BASE, 세션, 공통 유틸 등 핵심 로직 | 전역 흐름 영향이 큼 |
| `apmath/js/dashboard.js` | 운영 대시보드 중심 기능 | 대형 파일이라 부분 수정 주의 |
| `apmath/js/management.js` | 학생/반 운영 관리 로직 | 상태 동기화 영향 확인 |
| `apmath/js/schedule.js` | 일정 관리 로직 | 수업 일정 데이터 영향 |
| `apmath/js/timetable.js` | 시간표 관련 로직 | 일정 UI와 연결 |
| `apmath/js/textbook.js` | 교재 관리 로직 | 교재 동기화 주의 |
| `apmath/js/student.js` | 학생 관련 운영 기능 | 포털/학생 데이터와 연계 가능 |
| `apmath/js/qr-omr.js` | QR/OMR 관련 선생님용 처리 로직 | 제출/채점 흐름 영향 |
| `apmath/js/report.js` | 리포트/분석 관련 화면 로직 | 프록시/Worker와 연동 가능 |
| `apmath/homework/index.html` | 과제 제출 화면, 제목은 `AP Math OS | 과제 제출` | 학생 제출 흐름 유지 필요 |
| `apmath/student/index.html` | 학생 포털 화면, 제목은 `AP Math OS | 학생 포털` | 이름+PIN 로그인 진입점 |
| `apmath/planner/index.html` | 앱 내부 플래너 화면, 제목은 `AP MATH 플래너` | 학생 자동 로그인 연계 주의 |
| `apmath/wrong_print_engine.html` | 오답 클리닉 출력 엔진, 제목은 `AP Math 오답 클리닉` | 출력 레이아웃 회귀 주의 |
| `apmath/service-worker.js` | AP Math OS 서비스 워커 | 캐시 전략 변경 주의 |
| `archive/index.html` | JS아카이브 메인, 제목은 `JS아카이브 | 수학 기출 통합 시스템` | 기출 노출 정책 주의 |
| `archive/engine.html` | 시험지 출력 엔진, 제목은 `JS아카이브 엔진 - Stage E v1.7.5 (AP Header + Submit QR)` | 렌더/QR 흐름 영향 큼 |
| `archive/mixer.html` | 시험지 믹서 화면, 제목은 `JS아카이브 | 믹서 개편 v4.6.1 (UX/Mobile Optimized + Stability Fixed)` | 저장소 사용 방식 주의 |
| `archive/mixed_engine.html` | 믹서 출력 엔진, 제목은 `JS아카이브 | 믹서 출력 (Rulebook v1.9 + Image Field Final)` | 엔진 계열 차이 추적 필요 |
| `archive/db.js` | 아카이브 DB 데이터 접근 보조 파일 | 시험지 데이터 구조 영향 |
| `archive/concept_map.js` | 개념 맵 관련 데이터/로직 | 아카이브 탐색 연동 가능 |
| `archive/build_db.py` | 아카이브 DB 생성 보조 스크립트 | 데이터 생성용 스크립트 |
| `archive/classify_jsarchive_exams.py` | 시험지 분류 보조 스크립트 | 파일 정리 자동화 추정 |
| `check/index.html` | 학생 오답 제출 페이지, 제목은 `AP Math 오답 제출` | 제출 입력 흐름 확인 |
| `check/check.js` | 오답 제출 페이지 동작 스크립트 | 제출 처리와 직접 연결 |
| `manual/index.html` | 사용설명서 페이지, 제목은 `AP Math OS 사용설명서` | 정적 안내 화면 |
| `manual/manual-data.js` | 설명서 데이터 본문 | 갱신 시 검색 키워드 영향 |
| `manual/manual.js` | 설명서 상호작용 로직 | 검색/탭 동작 담당 |
| `manual/manual.css` | 설명서 전용 스타일 | UI만 영향 |
| `planner/index.html` | 루트 독립 플래너, 제목은 `AP Math Planner` | `apmath/planner/`와 별도 구현 |
| `report-ai-proxy/api/report-analysis.js` | 리포트 AI 분석 프록시 엔드포인트 | Gemini 연동/비밀키 검증 주의 |
| `report-ai-proxy/package.json` | 프록시 Node 패키지 설정 | 실행 스크립트·의존성 기준 |
| `report-ai-proxy/README.txt` | 프록시 동작 및 환경변수 설명서 | Worker 비밀값 연동 참고 |
| `apmath/worker-backup/worker/index.js` | Cloudflare Worker 통합 API 엔진 | 주석 헤더상 `AP Math OS v26.1.2 [IRONCLAD - Phase 4/5 FINAL RECOVERY]` |
| `apmath/worker-backup/worker/schema.sql` | D1 메인 스키마 | 임의 변경 금지 대상 |
| `apmath/worker-backup/worker/schema_planner.sql` | 플래너 관련 스키마 분리본 | 플래너 DB 구조 참고 |
| `apmath/worker-backup/worker/wrangler.jsonc` | Worker 배포 설정 | 바인딩/DB 설정 확인 |
| `robots.txt` | 크롤러 정책 파일 | 공개 경로 제어 |
| `CODEX_TASK.md` | 현재 Codex 작업 지시서 | 턴마다 내용 변경 가능 |
| `CODEX_RESULT.md` | Codex 작업 결과 요약 보고 | 짧은 완료 보고 유지 |

## 5. 하위 앱 / 독립 페이지

| 경로 | 역할 | 비고 |
| --- | --- | --- |
| `apmath/student/` | 학생 개인 포털 | 로그인 후 과제·플래너·OMR 진입 |
| `apmath/homework/` | 학생 과제 제출 | 학생별 과제 제출 화면 |
| `apmath/planner/` | 앱 내부 플래너 | 학생 포털과 연결 가능 |
| `planner/` | 독립 플래너 | 별도 라우트로 유지 |
| `check/` | 오답 제출 전용 페이지 | 시험 QR/오답 입력 흐름 |
| `manual/` | 검색형 사용설명서 | 선생님용 운영 가이드 |
| `report-ai-proxy/` | AI 분석 외부 프록시 | Worker 외부 런타임 |

## 6. Worker / DB 관련 파일

| 파일 | 역할 | 주의 |
| --- | --- | --- |
| `apmath/worker-backup/worker/index.js` | Cloudflare Worker API 엔진 | 주석상 복구 통합본, 광범위 API 포함 |
| `apmath/worker-backup/worker/schema.sql` | 메인 D1 스키마 | 테이블 변경 시 전역 영향 |
| `apmath/worker-backup/worker/schema_planner.sql` | 플래너 스키마 보조본 | 메인 스키마와 중복 여부 점검 필요 |
| `apmath/worker-backup/worker/migrations/` | 단계별 SQL 마이그레이션 모음 | 파일명이 운영 이력 역할 |
| `apmath/worker-backup/worker/initial_admin.json` | 초기 관리자 데이터 | 초기화/시드 참고용 |
| `apmath/worker-backup/worker/initial_teacher1.json` | 초기 교사 데이터 | 시드 성격 파일 |
| `apmath/worker-backup/worker/_archive/` | 이전 스키마 백업본 | 직접 운영 반영 전 비교 필요 |

## 7. 이번 갱신 변경점

### 새로 발견된 파일

- `PROJECT_STRUCTURE.md`를 이번 기준 스냅샷 문서로 신규 생성함.

### 사라진 파일

- 기존 기준 문서가 없어 비교 가능한 삭제 파일 없음.

### 위치 변경 의심 파일

- 기존 기준 문서가 없어 비교 가능한 위치 변경 파일 없음.

## 8. 다음 사람이 확인할 포인트

- `apmath/planner/`와 루트 `planner/`가 각각 어떤 배포 경로에서 실제 사용되는지 분리 확인이 필요하다.
- `apmath/worker-backup/worker/`가 이름상 백업 경로이므로 실제 운영 Worker 원본 경로와 동일한지 점검이 필요하다.
- `archive/exams/`와 `archive/assets/`는 규모가 커서, 구조 문서 갱신 시 폴더 단위 유지 원칙을 계속 지키는 편이 안전하다.
- 새 하위 앱이나 API 프록시 파일이 추가되면 이 문서를 먼저 갱신해 경로 기준을 맞춰야 한다.
