# ALIVE LITE CONTINUATION — CURRENT

2026-10-08 KST | CURRENT / 생성 우선 | Authority: Git main. Notion은 미러/진입점.

## 작업자 첫 실행
1. 최신 origin/main을 fetch, AGENTS.md 및 nested 지침을 읽는다.
2. 이 CURRENT → ALIVE_LITE_EXECUTION_RULES.md → ALIVE_LITE_SCHOOL_ROSTER_LATEST_FIRST.md → 대상 시험지 00~07을 1회 읽는다.
3. 기존 working tree의 미커밋 파일 보호. 별도 브랜치/worktree. 대상 범위만 stage/commit/push하고 remote readback.
4. stage 상태는 **실제 Git artifact·manifest·receipt·SHA**를 보고 다시 계산한다. 본 문서 카운트는 스냅샷이며 실제 파일보다 우선하지 않는다.

## 작업 순서
- NEXT: 2026 복성고 원본 검색·시험지 UID inventory/source SHA 확정. 현재 1학기 중간 폴더에서 복성고 2026을 찾지 못함. 정확한 원본 경로 미확정 상태에서는 생성 금지.
- 2026 전체 대상 완료·대기부채 정리 뒤 2025. 학년/과목/학기별 파일은 원본 Git inventory에서 수집한다. 같은 연도 안에서는 발견된 source의 최근 학기/평가일을 근거로 순서 지정하되 미확인 값을 추측하지 않는다.
- 효천고 2026 기존 파일럿은 별도 이관 상태 문서. 복성고로 생성물 재사용/혼합 금지.

## 품질 및 SVG 계약
- 신규 문항: source qid → 여러 의미 Blueprint 탐색 → 발문·보기·정답·학생용 해설·RPM 메타 원패스 → L2 shard/meta → UID 인덱스/manifest → 독립 검수.
- SVG 필수: graphSpec·실제 SVG 생성 후 Codex 실제 엔진 렌더·캡처·시각 QA. SVG_CREATED≠RENDER_PASS. 그림 없는 후보에게 기계적으로 SVG 제작 금지.
- 독립 수학검수·교육과정·실제 렌더·학생 공급 허가는 각각 별개 gate. 미실행을 PASS로 기록 금지.
- 채팅 sandbox ZIP만 존재할 때는 IMPORT_PENDING. 작업자가 접근 가능한 Git/실제 filesystem 경로와 SHA가 확인되기 전 반입 완료 보고 금지.

## 병목 / handoff
- 복성고: SOURCE_PATH_UNVERIFIED (실제 파일 검색 필요).
- 효천고: 파일럿 브랜치 78 UID (2026-10-08 14시대 원격 readback), batch009·011 로컬 16 후보 미반입, SVG 4개 Codex 렌더 대기; 94는 예상치, Git 등록 수 아님.
- 새 worker는 다음 일감 소진 시 로스터 최신연도에서 다음 source로 이동. 지침 부재·미해결 artifact면 continuation/blocked 상태를 남기고 다른 대상은 계속 진행.

## 2026-10-08 SOURCE RESOLVED — 최신 사실이 위 이전 상태를 대체
- 정확한 첫 대상: **26_복성고_1학기_기말_고1_기출**
- source: `archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js`
- source blob SHA: `8266fa476906e9134b94f23e803bd3b2fb26ece4`
- 원본 파일의 question id 23개 관찰. 일부 파일 끝 후처리 코드 존재하므로 런타임 반영된 최종 bank/asset inventory는 생성 전 확인.
- 상태: SOURCE_FOUND → source audit/자산 확인 → 생성 batch. 기존 SOURCE_PATH_UNVERIFIED/중간 파일 가정은 HISTORY로 취급.
