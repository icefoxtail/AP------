# ALIVE LITE 고등 학교 로스터 — 최신연도 우선

**HARD: 2026 전체 → 2025 전체 → 2024 이하 순.** 2026 작업이 남아 있다면 자동으로 2025로 건너뛰지 않는다. 사용자 승인 예외만 별도 evidence로 기록.

## 2026
1. **복성고 2026** — FIRST TARGET / SOURCE_PATH_UNVERIFIED. 정확한 원본 시험지 시험종류·파일경로 확인 후 착수. `H1_SCHOOL_EXPANSION/2026/26_복성고_SOURCE_PENDING/`.
2. **효천고 2026 1학기 중간** — 기존 실험 이관·반입 부채 분리. `H1_SCHOOL_EXPANSION/2026/26_효천고_1학기_중간_고1/`.
3. **그 외 2026 고1 시험지** — Git actual inventory 후 원본 파일 경로·SHA 있는 대상만 추가. 이름/순서를 추측하지 않는다.

## 2025
- 2026 실대상 마감 후, 2025 source inventory를 만들어 최신학기·평가 순위로 기입. 현재 본 문서는 모든 2025 파일의 실조사를 마쳤다는 뜻이 아니다.

## Source discovery 규칙
- Git `archive/exams/original/high/h1` 원본 파일 inventory, 2026 source 존재/시험종류/학년/과목/문항수/sha 검증.
- 2026 복성고가 다른 학기 또는 다른 평가종류에 있으면 검증된 실경로로 school folder를 개명/재결속한다.
- 미확인 학교·연도·순서/분모를 만들어서 생산하지 않는다.

## 2026-10-08 SOURCE RESOLVED — 최신 사실이 위 이전 상태를 대체
- 정확한 첫 대상: **26_복성고_1학기_기말_고1_기출**
- source: `archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js`
- source blob SHA: `8266fa476906e9134b94f23e803bd3b2fb26ece4`
- 원본 파일의 question id 23개 관찰. 일부 파일 끝 후처리 코드 존재하므로 런타임 반영된 최종 bank/asset inventory는 생성 전 확인.
- 상태: SOURCE_FOUND → source audit/자산 확인 → 생성 batch. 기존 SOURCE_PATH_UNVERIFIED/중간 파일 가정은 HISTORY로 취급.
