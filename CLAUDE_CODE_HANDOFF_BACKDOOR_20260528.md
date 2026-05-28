# Claude Code 인수인계서 - Backdoor API 배포 전 최종 검수
작성일: 2026-05-28

---

## 현재 목적

Cloudflare Worker에 백도어 read-only 관리자 API를 추가했다. 배포 전 최종 검수 및 배포 승인/거부 판정이 남아 있다.

---

## 수정 파일

- `apmath/worker-backup/worker/routes/backdoor.js` (신규, untracked)
- `apmath/worker-backup/worker/index.js` (수정됨: import 1줄 + 라우팅 블록 7줄)

---

## 건드리면 안 되는 파일

- `apmath/js/core.js`
- `apmath/js/dashboard.js`
- `apmath/js/ui.js`
- `apmath/index.html`
- `apmath/worker-backup/worker/index.js` 내 `/api/initial-data` 구간 (line 2744~)
- 기존 운영 API 라우팅 전반
- `eie/` 폴더
- `docs/` 폴더 (review-packs 포함)
- `claude_eie_*/` untracked 폴더들

---

## 이미 추가된 API 목록

모두 `GET` 전용, `admin` 권한 전용.

| 엔드포인트 | 설명 |
|---|---|
| `GET /api/backdoor/overview` | 학생/반/선생님 수, 오늘 출석/숙제 현황, 예정 일정, 최근 학생 |
| `GET /api/backdoor/students` | 학생 목록 (페이지 단위, 필터 지원) |
| `GET /api/backdoor/classes` | 반 목록 (페이지 단위, active 필터) |
| `GET /api/backdoor/today` | 오늘 날짜 기준 출석/숙제/일정 |
| `GET /api/backdoor/timetable` | 반별 시간표 슬롯 + active enrollment 수 |
| `GET /api/backdoor/billing-summary` | 월별 수납/환불/출납 요약 |
| `GET /api/backdoor/search` | 학생/반/선생님 키워드 검색 |

---

## 최종 검수 순서

1. `node --check apmath/worker-backup/worker/index.js` → PASS 확인
2. `node --check apmath/worker-backup/worker/routes/backdoor.js` → PASS 확인
3. `git diff -- apmath/js apmath/index.html` → 출력 없음(변경 없음) 확인
4. `git diff -- apmath/worker-backup/worker/index.js` → backdoor import + 라우팅 블록만 확인
5. `backdoor.js` 안에 INSERT/UPDATE/DELETE/UPSERT/env.DB.batch 없음 확인
6. `backdoor.js` 안에 SELECT * 없음 확인
7. `backdoor.js` 안에 student_pin/phone/parent 컬럼 없음 확인

---

## 배포 전 확인 항목

- [ ] node check 양쪽 PASS
- [ ] git diff frontdoor 출력 없음
- [ ] git diff index.js 에 backdoor 외 변경 없음
- [ ] backdoor.js 내 write SQL 없음
- [ ] backdoor.js 내 개인정보 컬럼 없음
- [ ] `/api/initial-data` 구간 diff 없음

---

## 배포 금지 조건

다음 중 하나라도 해당하면 배포하지 않는다.

- node check FAIL
- `apmath/js/*` 또는 `apmath/index.html` diff 발생
- `/api/initial-data` 구간 변경 발견
- `backdoor.js` 내 INSERT/UPDATE/DELETE/env.DB.batch 발견
- `backdoor.js` 내 SELECT * 신규 사용 발견
- `backdoor.js` 내 student_pin/phone/parent_phone 반환 발견

---

## 프론트 연결 금지 조건

- `apmath/js/*` 수정 금지
- `apmath/index.html` 수정 금지
- 백도어 API를 기존 프론트 bootstrap/dashboard/운영 화면에 연결 금지
- 기존 `/api/initial-data` 응답 계약 변경 금지

---

## helper import/export 확인 결과

| 항목 | 결과 |
|---|---|
| `helpers/foundation-db.js` 존재 | YES |
| `isAdminUser` named export | YES (line 24) |
| `helpers/response.js` 존재 | YES |
| `jsonResponse` named export | YES (line 8) |
| local helper 보정 필요 | NO |
| import resolution 실패 가능성 | 없음 |

---

## 남은 위험

- `backdoor.js`는 untracked. 커밋 시 명시적으로 `git add` 대상에 포함해야 한다.
- `docs/review-packs/`, `claude_eie_*/` 폴더도 untracked. 커밋 대상에서 제외해야 한다. 삭제는 사용자 확인 후 진행.
- 브라우저/Worker 동작 테스트 미실시. 배포 후 `/api/backdoor/overview` 응답 확인 필요.
- `billing-summary`의 `recent_transactions`에 `student_name` 포함. 연락처는 없으므로 허용 범위로 판단하나 필요 시 재검토.
- Cloudflare D1 테이블 스키마가 Worker 쿼리 컬럼과 맞지 않으면 일부 API가 500을 반환할 수 있다. `safeAll` 미사용 구간에서 발생 가능.

---

## 배포 명령 (판정 PASS 시에만 실행)

```
cd C:\Users\USER\Desktop\AP------\apmath\worker-backup\worker
npx wrangler deploy
```
