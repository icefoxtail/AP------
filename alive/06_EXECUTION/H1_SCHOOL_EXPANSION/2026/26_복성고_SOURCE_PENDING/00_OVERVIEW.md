# 2026 복성고 — SOURCE_PENDING

first target: **26 복성고**. 학기/평가/과목/source path 및 SHA는 미확인. 현재 `archive/exams/original/high/h1/1mid` 목록에 26 복성고가 없음. 다른 경로 실제 탐색 전 임의 복성고 파일 생성 금지.

stage: SOURCE_DISCOVERY. source inventory=NOT_LOCKED. source questions=UNKNOWN. generated=0 confirmed in this campaign. imported=0. SVG=NOT_ASSESSED.

NEXT: Git original/high/h1 tree에서 26 복성고 전체 검색 → 실제 filename/sha/문항수 결속 → 표준 학교 폴더 이름 확정 → qid 단위 생성 개시.

## 2026-10-08 SOURCE RESOLVED — 최신 사실이 위 이전 상태를 대체
- 정확한 첫 대상: **26_복성고_1학기_기말_고1_기출**
- source: `archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js`
- source blob SHA: `8266fa476906e9134b94f23e803bd3b2fb26ece4`
- 원본 파일의 question id 23개 관찰. 일부 파일 끝 후처리 코드 존재하므로 런타임 반영된 최종 bank/asset inventory는 생성 전 확인.
- 상태: SOURCE_FOUND → source audit/자산 확인 → 생성 batch. 기존 SOURCE_PATH_UNVERIFIED/중간 파일 가정은 HISTORY로 취급.
