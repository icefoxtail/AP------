# wangji-eie-os — EIE 전용 최소 Worker

이 Worker는 EIE 전용입니다. APMS Worker가 아닙니다.

## 기본 정보

| 항목 | 값 |
|---|---|
| Worker 이름 | wangji-eie-os |
| 엔드포인트 | https://wangji-eie-os.js-pdf.workers.dev |
| D1 DB | wangji-eie-os |
| D1 DB ID | 2066e8ce-a02e-4f35-9c2d-d60891afff63 |
| 처리 라우트 | /api/eie, /api/eie/* |

## Worker 구조

```
index.js          — EIE 전용 fetch handler (APMS 라우트 없음)
routes/eie.js     — EIE 학생/시간표 CRUD API
helpers/response.js — jsonResponse, errorResponse 헬퍼
wrangler.jsonc    — EIE 전용 배포 설정
wrangler.toml     — EIE 전용 배포 설정 (백업)
```

## 처리 경로

- `GET/POST/PATCH/DELETE /api/eie/*` — EIE 학생·시간표 관리
- `GET /` 또는 `GET /health` — 상태 확인
- 그 외 — 404 JSON 반환

## 배포 (사용자 확인 필수)

```powershell
cd C:\Users\USER\Desktop\wangji-eie-worker
node --check .\index.js
node --check .\routes\eie.js
npx wrangler deploy
```

## APMS Worker와 혼동 금지

| | EIE Worker | APMS Worker |
|---|---|---|
| Worker 이름 | wangji-eie-os | ap-math-os-v2612 |
| 배포 루트 | C:\Users\USER\Desktop\wangji-eie-worker | AP------\apmath\worker-backup\worker |
| D1 | wangji-eie-os | ap-math-os |
