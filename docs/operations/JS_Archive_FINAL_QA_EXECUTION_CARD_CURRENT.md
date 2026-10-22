# JS Archive FINAL QA — SINGLE ENTRY EXECUTION CARD (CURRENT v2.0)

**적용:** 이미 Git `main`에 있는 시험지 1건의 GPT 사후 검수·결함 수리·필요한 시험지별 메타 입력·운영병합. **사용자 최신 명시 지시와 이 카드가 현재 실행 권위**다. 신규 CREATE/R1/R2/R3/ALIVE, 예약·공통 Actions 유지보수의 품질·작업 규칙을 변경하지 않는다.

**문서 진입:** 이 카드만 먼저 읽고 정확한 `examUid`/source/기존 증거로 이동한다. [Notion FINAL QA 작업 라우트](https://app.notion.com/p/4010e68bd69f81569b84fb85e8645590)는 필요할 때만 경로·예외 문서를 찾는 목차다. Notion 전체 생명주기·과거 v2.1·기존 FAST ROUTER·AGENTS를 전부 선열람하지 않는다.

## 1. 입력과 기존 검증 재사용

1. 사용자 지정 시험지/정확한 Git JS path/현재 `main` SHA·대상 blob부터 확인한다. 다음 시험지가 미지정이면 실제 과목별 대장과 Git 해당 폴더를 직접 대조하여 **최신년도 미완료 1건**을 고른다. 파일명 검색 결과만으로 존재·부재를 단정하지 않는다.
2. 실제 표시 QID 수 N을 식별하고 이전 QA·승인 기록의 `source blob/fingerprint + 관련 UID·asset·meta 판본`이 같으면 `REUSE_VERIFIED`로 재사용한다. Git 전체 HEAD가 움직였다는 이유만으로 동일 대상 파일을 전수 재검하지 않는다.
3. **이번 실검수 분모:** `OPEN / CHANGED / DIRECT_DEPENDENCY`, 증거의 정확한 결속이 없거나 충돌한 QID·필드. 확인하지 않은 문항을 신규 PASS로 기록하지 않는다.

## 2. 필요한 수리만 실행

4. 위 분모의 발문·정답/선지·학생 해설·교육과정·수식·이미지/SVG·실제 필요한 L1~L4/RPM/CC/Condition/Integration·`level`·`difficultyBucket`만 대조하고 확정 결함은 해당 부분을 직접 수리한다. 정상 문항과 기존 자산을 보존하고 바뀐 곳·직접 영향만 재검한다. 실제 확정 수학·해설·시각·메타 HARD FAIL을 방치한 채 품질 PASS를 선언하지 않는다.
5. **기본 제외:** 원본 PDF/HWP 전수 대조(사용자 별도 요청 예외), PT/TPL 조회·신규 수리/등록·PT/TPL parity, 정상 문항 전수 재풀이, 신규 R1/R2/R3 실행, 무관한 시험지/공용 시스템 수정.
6. 메타 변경이 **실제로 필요한 경우에만** 대상 시험지 소형 `.archive-meta-register/inbox/*.json` 요청 또는 현행 승인된 해당 경로의 stage-local 입력을 작성한다. 공용 `question_metadata.json`/대형 catalog/compiled 파생 JSON 전체 직접 수정·업로드 금지. 등록기 미지원은 정확한 `TOOLING_GAP`으로 분리하고 허위 승인 금지. 이미 승인·등록된 동일 판본에 중복 요청을 만들지 않는다.

## 3. Git main 운영병합 후 GPT 종료

7. 대상 JS/자산/필요한 소형 메타 입력만 변경한 PR을 생성해 GitHub가 허용하는 범위에서 `main`에 병합한다. 범위 밖 stage·commit·도구/CI·전체 인덱스 수정, `git add .`, 브랜치 보호 해제/강제 push 금지. CI 대기/무관한 실패로 병합을 불필요하게 지연하지 않는다.
8. **원격 `main` commit SHA와 대상 변경 파일 blob을 한 번 readback하면 GPT 종료:** `MAIN_DONE`. 변경 필요가 없고 이미 현행 `main` 실물이 확인되면 `NO_CHANGE_MAIN_DONE`. 미병합은 `BLOCKED/OPEN`으로 남기고 `firstMissingStep` 하나를 적는다. Notion 기록이 불가능하면 `RECORD_PENDING`으로 분리하며 실제 Git 병합 결과를 부정하지 않는다.
9. **GPT 완료조건에서 제외:** 병합 후 CI/Actions 반복 polling, Consumer/Search 화면의 N/N 수동 parity, DB/index/catalog/런타임 재생성·검증, Chrome/Pages 최종 배포 검사 및 기다림. 메타 자동 승인·등록과 검색/배포는 GitHub Actions 별도 owner의 책임이며, **Actions가 실제로 성공했는지 확인하지 않았다면 성공이라고 주장하지 않는다.**

## 4. 상태·예외·인계

- `MAIN_DONE` = Git 대상 병합 및 원격 readback. `PIPELINE_PASS` = Git Actions의 실제 검증 성공. `DEPLOY_DONE` = 실제 Pages 배포 성공. 셋은 독립 사실이다. 신규 품질 검수 `PASS`는 실행 증거가 있는 이번 분모만 기록한다.
- 별도 Git 기술 장애가 발생하면 실패 workflow와 정확한 원인을 따로 남긴다. 이미 증명된 `MAIN_DONE`을 되돌려 동일 시험지 수학 검수를 재시작하지 않는다. 자동복구·자동 알림은 검증 전 보장하지 않는다.
- 중단 인계는 `examUid / exact Git path / source blob / OPEN QID·필드 / 실제 수리 / 마지막 성공 SHA / firstMissingStep`만 기록한다. 같은 SHA·동일 문서를 재조회하거나 장문 문서 로드를 재개하지 않는다. 상세 오류 때만 [이전 FAST ROUTER v1.1](JS_Archive_FINAL_QA_FAST_ROUTER_HANDOFF_CURRENT_v1.md)의 관련 절을 참고하되 **예전 Consumer 수동 완료조건을 재적용하지 않는다**.
- **3줄 보고:** `완료: 시험지·실제 변경/mainSHA` / `미완료: GPT 잔여 또는 없음(자동화 후속 별도)` / `다음: 정확한 다음 시험지 또는 첫 미해결 단계`.

## 문서 소유권 · 구버전 처리

- GPT FINAL QA 실행 규칙은 **이 파일 1곳에서만** 개정한다. Notion [02-01 라우트](https://app.notion.com/p/4010e68bd69f81569b84fb85e8645590)는 사용 조건·링크만 유지한다.
- [Notion FINAL QA v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98)은 2026-10-21의 역사적 참고·증거 문서다. 그 문서 및 이 파일의 2026-10-21 이전 commit에 남은 `N/N 전수 Consumer 수동검사`·PT/TPL 필수·다중 필독 지시는 **현행 완료조건이 아니다**.
