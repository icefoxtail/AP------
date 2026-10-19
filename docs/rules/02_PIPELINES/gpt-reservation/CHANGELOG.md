# JS Archive GPT 예약라인 공용 프롬프트 정본 — 변경 이력

## v1.0.2 — 2026-10-19: HIGH_DYNAMIC Google Drive 출고 허브 전환
- 문제: ChatGPT Library 허브가 Codex/Work의 연결된 Google Drive에서 검색되지 않아 PENDING 32건 중 Git 이미 병합된 13건이 중복 대기로 보임.
- 사용자 결정: Google Drive `Archive2-GPT/RELEASE_HUB`(folder ID `1DQigbs29hiuvwxbS-6i7w6hK6iziNk57`)를 HIGH_DYNAMIC R3→출고의 단일 정본으로 사용. 기존 stage Library 및 5예약 일정/ON 변경 금지.
- R3: 각 examUid별 raw R3_PACKET.zip+R3_HANDOFF.json+RELEASE_MANIFEST.json 직접 Drive 사본 저장, 원격 readback SHA·ID 확인, 중복 SHA SKIP, 신규 revision만 PENDING, 장애는 HUB_SYNC_PENDING 복구. MAIN_DONE은 별도 출고 담당이 Git main 실증거 확인 후에만 Drive DONE 마킹.
- 기존 자료: 기존 Library 보존. Google Drive 이관과 권위 변경은 개별 파일 readback에 따라 별도 추적; 과거 PENDING 존재만으로 신규 출고 대상 판정 금지.
- 적용 범위: R3_CURRENT.md 및 README_CURRENT.md 문구, HIGH_DYNAMIC R3 예약 프롬프트. CREATE/R1/R2/MASTER 불변. 실제 다음 예약 실행의 Drive 등록 및 파일 readback은 별도 증거로 확인.


**현재 대표 문서:** [README_CURRENT.md](README_CURRENT.md). 파일은 CURRENT 고정 경로이고, 역사적 각 버전은 Git commit/blob SHA로 추적한다. 수정 전 항상 Notion 라우터/예약 CURRENT/Git main 정본을 다시 읽는다. 이 파일은 실제 예약 변경 영수증이나 실험 실행 증거를 대신하지 않는다.

## HIGH_DYNAMIC R1 v1.1 — 2026-10-19: 연속 R1 수납·컨테이너 세션 오류 복구

- 원인: CREATE는 다건 연속으로 `READY_R1` 인계할 수 있는데 R1은 매 회차 한 시험지만 처리. `20_제일고_1학기_기말_고2_확률과통계` R1은 source-only 22/22 로컬 풀이 후 Library 업로드에서 `container_session_unavailable`로 원격 freeze 미생성. 실제 답 비교/Meta/Golden/R2 인계는 미실행이며 R1 품질 PASS 아님.
- 최소 변경: **HIGH_DYNAMIC R1에 한정** 1건 cap 해제, 최신 READY_R1/active writer 실물 대조와 orphan-first 반복 소비, 비싼 독립풀이 전 업로드 preflight, 이전 세션 경로 재사용 금지/실제 참조만 사용, 기존 동결본이 사라졌을 때 false freeze 금지, 개별 INFRA_RETRY 후 다른 backlog 수납 지속.
- 유지: Notion/Git 실제 필독·DOC_READ_RECEIPT, R1 blind, 전 qid 작은칠판/정밀 Meta, Golden/Negative·품질 진실성, READY_R2 비차단, 5레인 ON/시각, 예약 Git writer 금지. 업데이트한 실제 R1 예약과 이 Git 문서 변경을 별도 확인한다. 적체 0 또는 성공률 100%를 주장하지 않는다.
- 수정 범위: R1_CURRENT.md / README_CURRENT.md / CHANGELOG.md. 신규 시험지·기존 정답·학생 JS/이미지 변경 0.

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


## v1.0.1 — 2026-10-18: R3 통합 출고 허브 자동 인계
- 사용자 요청: 반복적인 R3 시험지 탐색 없이 복수 시험지를 통합 Library에서 한꺼번에 Git main 출고할 수 있도록 R3 완료 시 인계 실물을 별도 복제한다.
- 기존 실물: HIGH_DYNAMIC R3 13개 시험지 각각 latest 패킷·R3 인계 receipt → `/Archive2-GPT/RELEASE_HUB/PENDING/<examUid>/`에 사본 보존; 초기 `INDEX.json` 13건, Git 파일명 부재 4/존재 9. 기존 파일의 내용 parity 미검증, DONE 0. 각 R3 qualityPass=false를 품질 승격하지 않았다.
- 적용: R3_CURRENT.md §6 및 README_CURRENT.md 링크. R3 최종 Library 인계 후 packet/receipt/manifest remote readback; examUid+SHA 중복 억제; HUB_SYNC_PENDING 재시도; 원본 R3 불변. ROOT INDEX는 스냅샷, exam manifest가 권위.
- 승인/기술 분리: R3_REVIEWED ≠ QUALITY_PASS ≠ 출고승인. 지정 출고 감독만 최신 main과 실제 차이를 확인하고 user-directed 병합/배포 검증 후 DONE. MASTER 업무 및 예약 5개의 ON/RRULE 유지.
- Git 문서 작업, 실제 HIGH_DYNAMIC R3 예약 업데이트/readback, 다음 R3 회차의 실행 evidence, Git merge는 서로 구분해서 기록한다.
