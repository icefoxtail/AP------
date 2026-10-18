# JS Archive GPT 예약라인 공용 프롬프트 정본 — 변경 이력

**현재 대표 문서:** [README_CURRENT.md](README_CURRENT.md). 파일은 CURRENT 고정 경로이고, 역사적 각 버전은 Git commit/blob SHA로 추적한다. 수정 전 항상 Notion 라우터/예약 CURRENT/Git main 정본을 다시 읽는다. 이 파일은 실제 예약 변경 영수증이나 실험 실행 증거를 대신하지 않는다.

## v1.2.0 — 2026-10-18: HIGH MASTER 신규 배정 최우선 + 전 단계 실물 인계 연결 책임

### 사용자 시정
- 기존 MASTER 실물 예약은 신규 배정→R1/R2/R3 일반 qid 수리를 우선했으며, CREATE→R1뿐 아니라 **R1→R2, R2→R3, R3→감독 GPT**의 누락 인계·오래된 checkpoint를 본인이 직접 회수해 복구하는 의무가 충분하지 않았다. 한 회차 1시험지 제한과 단일 결함 선점 때문에 연결 공급이 장시간 굶을 수 있음.
- 사용자가 우선순위 확정: **신규 배정 최우선 → 각 stage의 미완료 인계 전부 연결/직접 수리 → 나머지 일반 qid 품질/증거 감사**. 한 단계만 완료/보고하고 회차 종료 금지.

### 구현
- `MASTER_CURRENT.md` §0 동적 MASTER `ASSIGN→RECONCILE_ALL_TRANSITIONS→DIRECT_REPAIR_AND_HANDOFF→NEXT` 연속 루프 추가. Library source + artifact SHA/readback, stage별 READY receipt/ZIP, 원 owner 추적, stale CLAIM 우선 복구, 활성 writer 우회 및 다음 eligible 회전.
- MASTER 본인이 인계 요건의 빈 부분을 직접 제작/수리하되 유효한 R1 블라인드 freeze/이미 검증한 해설·Meta 보존. MASTER가 답을 본 상태에서 신규 R1 blind 수행했다고 주장하지 않으며 실제 R1이 해야 할 독립 작업은 입력을 바로 사용 가능한 상태로 복원. ROUTED≠PASS, Golden/Meta/검증 품질·출고 승인 경계 불변.
- `README_CURRENT.md`에 해당 HIGH 캠페인 MASTER 역할 오버라이드 명시. 이 캠페인 CREATE v1.1 연속 루프와 병행하되 타 writer 중복 금지. 다른 캠페인/R1·R2·R3 설정 불변.
- 실제 MASTER 예약 프롬프트 수정 성공/원래 매시 :48 ON/RRULE readback과 향후 Library 인계의 첫 실증 검증은 **별도** 기록. 문서 변경 자체는 운영 성공 증거가 아니다.

## v1.1.0 — 2026-10-18: HIGH 동적 CREATE 연속 루프 및 orphan claim 복구

### 재현 근거
- `HIGH_DYNAMIC_INTAKE_20261017`: `20_매산고_2학기_중간_고2_확률과통계` CREATE claim 2026-10-18 07:56 KST, `23_강남여고_2학기_중간_고2_수학II` CREATE claim 09:58 KST. 둘 다 CREATE stage 폴더 빈 상태/READY_R1 없음이 확인됨. 이후 다른 시험지 `22_금당고_2학기_기말_고2_수학II`는 13:12 KST READY_R1가 존재.
- 실제 HIGH 예약은 "첫 미선점 1시험지"로 선택했고 README 기본 "회차당 최대 하나"와 결합돼 기존 claim을 재개하지 못한 채 새 입력을 소비할 수 있었다. 개별 실행 도구 중단 원인 로그는 미확인; 이는 확인된 선택/마감 위험 구조의 수정이다.

### 사용자 승인 설계 / 대상
- `CREATE_CURRENT.md` §0에 `CONTINUOUS_RECOVER_CREATE_HANDOFF` 추가: **복구 → 완성 → 실제 R1 인계/readback → 최신 backlog 재조회 → 다음 입력 연속 수신**을 한 회차의 단일 루프로 정의.
- 미완료 own claim/checkpoint(산출물 없이 claim만 있는 경우 포함)가 새 배정보다 우선. 유효 R1 receipt로 인계한 시험지는 제외, 타 writer 중복/기존 유효 파일 덮어쓰기 금지.
- 작업이 끊길 때 가능한 최신 학생 JS·source-only·자산·qid/meta/검증·다음 재개 지점을 물리 저장/remote readback. `NO_INPUT`은 미완료/신규 모두 실조회 0인 경우뿐.
- `README_CURRENT.md`는 **사용자 명시 승인 HIGH CREATE에만** 1시험지/회차 기본 상한의 예외를 부여. R1/R2/R3/MASTER 및 타 캠페인의 조건·ON/OFF·RRULE은 그대로.

### 검증 / 적용 구분
- 검증 대상: 오래된 claim만 존재, 실제 mid-work checkpoint, 서로 다른 READY_CREATE 두 건, active competing writer, 한 건 도구 오류/다른 eligible, remote readback 실패, 무입력.
- Git 문서 변경은 실행 증거가 아니며 실제 HIGH CREATE 예약 프롬프트 수정/readback 및 다음 실행의 Library 실물 인계 결과로 별도 확인한다. 품질·Meta·Golden·R1 blind 및 `ROUTED≠PASS` 불변.

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
