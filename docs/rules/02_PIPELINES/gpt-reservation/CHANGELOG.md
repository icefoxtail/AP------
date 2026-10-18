# JS Archive GPT 예약라인 공용 프롬프트 정본 — 변경 이력

**현재 대표 문서:** [README_CURRENT.md](README_CURRENT.md). 파일은 CURRENT 고정 경로이고, 역사적 각 버전은 Git commit/blob SHA로 추적한다. 수정 전 항상 Notion 라우터/예약 CURRENT/Git main 정본을 다시 읽는다. 이 파일은 실제 예약 변경 영수증이나 실험 실행 증거를 대신하지 않는다.

## v1.0.1 — 2026-10-18: 통합 출고 Library 자동 인계

- 사용자 직접 지시: 예약 MASTER의 배정·복구 부담을 늘리지 않고 R3가 stage 종료 직후 최종 패킷/영수증/manifest를 RELEASE_HUB/PENDING에 복사·원격 readback하며 다음 회차에는 누락·MASTER 재수리 revision도 정합 확인.
- R3_REVIEWED/READY_MASTER_DECISION은 transport이며 RELEASE_READY/MAIN_DONE 아님. 원본 stage 보존, 본문/Meta/Golden/블라인드 품질 규칙, 활성 예약 5개 일정·권한은 유지.
- 초기 HIGH_DYNAMIC 13건 Library ZIP/영수증/manifest의 저장 현물은 별도로 확인해야 하고 공용 INDEX는 초기 snapshot. Git 운영 출고/배포는 별도 승인과 기술 확인.

## v1.0.0 — 2026-10-17: 5개 예약 통합 최초 공용판

### 트리거 / 확인한 회귀 사례
HIGH_DYNAMIC 2019 금당고 고2 수학Ⅱ 2학기 중간고사 R1: source-only 21/21 동결, 해설 q09·q14·q16·q17 UPGRADE 및 17 KEEP은 존재했으나, 전 qid `CANONICAL_META_EVIDENCE_DEBT`, Golden/Negative `NOT_RUN`, 원본 PDF q07~q21 실제 대조 미수행, q18 변수 표기 추가 확인 필요. 실제 문서 read receipt는 증명되지 않았다. 따라서 “문서 읽기 지시 문구”와 “실제 필독·각 단계의 품질 책임”이 분리되어 있었다.

### 설계 결정
- R1/R2는 답·Node syntax/기본 Meta 단순 통과가 아닌 학생 작은칠판 해설 **적극** 업그레이드 담당. qid 수 cap 없고 GOOD KEEP은 존중.
- CREATE/R1/R2/R3는 자기 stage에서 최신 canonical Meta를 UID별 실제 조회하고 해결 가능한 누락을 직접 고친다. 오류인 `OWNER_INCOMPLETE`과 실제 시도한 `EVIDENCE_DEBT`를 구분한다.
- `DOC_READ_RECEIPT.json` 물리 파일 ID/SHA+정본 실제 조회/적용 조항을 필수 증거로 한다. 문서 읽기 또는 검사 미실행은 PASS 금지. Goldens는 적용 stage 판정 전에 실제 검토.
- Library 단계 인계는 비차단 `ROUTED`, 품질 `PASS`와 분리. 원래 소유자 책임을 남기되 R1 valid freeze·기존 정상 qid 재작업/전 시험지 HOLD 금지.
- MASTER는 동적 인테이크 캠페인에서만 신규 배정을 추가하고, 기존 unresolved qid 수리·책임감사 수행. 마지막 Git 출고 판정은 예약 MASTER가 아닌 별도 상위 감독/승인 출판 담당.
- 사용자 명시 ON/OFF/캠페인 분모/예약시간은 재사용 템플릿이 임의 변경하지 않으며, 동적 캠페인과 frozen A/B/C 캠페인을 구별한다.
- Git 현행 Prompt Template v1의 오래된 NEW14 시기별 상충 조항은 신규 공용판이 덮어쓰되 과거 campaign 기록은 HISTORY로 유지.
- 검증 계획: canonical 문서 경로·링크·Git readback, Notion Skill 설정 재조회, 대표 ROLE 조립 필수 변수 누락 검토, 실제 새 예약의 첫 실행 증거는 별도 확인.

### 적용 범위 / 상태 구분
- 공용 Git CURRENT 7문서(README+5 roles+CHANGELOG): **이 변경의 대상**.
- Git `AGENTS.md` + 기존 `JS_Archive_2.0_GPT_Scheduled_Prompt_Template_v1.md`: 새 CURRENT로 진입시키는 포인터만 추가.
- 노션 `JS Archive GPT 예약 2.0 — CURRENT` 아래 공용 Skill 및 `GPT 작업 전 필독 라우터` 포인터: Git 병합 후 별도 저장·재조회.
- 당시 HIGH_DYNAMIC 5개 실제 자동화 prompt: 직전 별도 작업에서 변경/ON 확인됨. 본 공용화 자체가 자동화 5개를 새로 생성·변경한 것이 아님.
- **RUN VALIDATION**: 신규 공용 템플릿을 실제 예약으로 생성해 첫 Library 실행까지 end-to-end 검증했다는 뜻은 아님.

## 앞으로 추가 기록 형식

### vX.Y.Z — YYYY-MM-DD
- 발견한 틈 / 실제 failure artifact ID:
- 실패를 재현한 역할 및 정확한 조항:
- Git/Notion 정본 사실과 충돌 여부:
- 수정 파일·조항·적용 역할:
- 정상/회귀 검토 증거:
- Git PR/main SHA:
- 노션 Skill/라우터 링크 확인:
- 기존 예약별 prompt 업데이트/ON·RRULE readback:
- 첫 실행 Library DOC_READ_RECEIPT·qid 수리 증거:
- 미완/다음 owner:
