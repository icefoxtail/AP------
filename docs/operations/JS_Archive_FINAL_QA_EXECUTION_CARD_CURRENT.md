# JS Archive FINAL QA — SINGLE ENTRY EXECUTION CARD (CURRENT v2.1.0)

**적용:** 이미 Git `main`에 있는 시험지 1건의 GPT 사후 검수·결함 수리·필요한 시험지별 메타 입력·운영병합. **사용자 최신 명시 지시와 이 카드가 현재 실행 권위**다. 신규 CREATE/R1/R2/R3/ALIVE, 예약·공통 Actions 유지보수의 품질·작업 규칙을 변경하지 않는다.

**문서 진입:** 이 카드만 먼저 읽고 정확한 `examUid`/source/기존 증거로 이동한다. [Notion FINAL QA 작업 라우트](https://app.notion.com/p/4010e68bd69f81569b84fb85e8645590)는 필요할 때만 경로·예외 문서를 찾는 목차다. Notion 전체 생명주기·과거 v2.1·기존 FAST ROUTER·AGENTS를 전부 선열람하지 않는다.

**2026-11-05 자동 등록 연결:** 소스에 명시된 변경 메타는 main 병합 뒤 [자동 메타 등록 CURRENT](../architecture/Archive_Main_Merge_Auto_Metadata_CURRENT.md)의 시스템 담당이 등록·소비자 반영·재시도를 책임진다. 작업자에게 별도 등록 요청서 작성이나 정상 문항 재검수를 다시 요구하지 않는다. 실제 의미 보완이 필요한 필드는 해당 UID의 별도 보완으로 남기며 이미 완료한 코드 수리·병합과 구별한다.

## 1. 입력과 기존 검증 재사용

1. 사용자 지정 시험지/정확한 Git JS path/현재 `main` SHA·대상 blob부터 확인한다. 다음 시험지가 미지정이면 실제 과목별 대장과 Git 해당 폴더를 직접 대조하여 **최신년도 미완료 1건**을 고른다. 파일명 검색 결과만으로 존재·부재를 단정하지 않는다.
2. 실제 표시 QID 수 N을 식별하고 **`FIRST_FORMAL` / `VERIFIED_DELTA`를 먼저 구분한다.** 첫 정식 사후 품질검수 또는 독립 검수 증거가 문항별로 없는 시험지는 `FIRST_FORMAL`: 발문·정답/선지·해설·교육과정·메타·플랜 의미 검수를 **N/N, 문제/해설 2N/2N** 진행한다. 생성자의 자가검사, CI, 전체 점수만 적힌 과거 영수증은 독립 전수검수의 증거가 아니다. 예전 `REVIEW_REQUIRED`, `NOT_RUN`, 미확인 결과를 PASS로 승격하지 않는다.
3. **`VERIFIED_DELTA` 재사용은 예외적으로 허용:** 이전 `FIRST_FORMAL`의 문항별 독립 재풀이·검수 항목·2축 판정이 실제로 남아 있고, 각 QID의 발문·보기·답·해설·메타 의미 지문 및 플랜 다이제스트가 현재와 같을 때만 `REUSE_VERIFIED`. 이후 확인할 분모는 `OPEN / CHANGED / DIRECT_DEPENDENCY`이되, 바뀐 필드는 반드시 재검수한다. 같은 Git HEAD라는 이유로 PASS하지도 않고, **무관한 HEAD 이동만으로 입증된 전수검수를 무한 반복하지도 않는다.** 보고에 신규 실검수 N, 증거 재사용 N, 미검증 N을 분리한다.

## 2. 필요한 수리만 실행

4. 해당 분모에서 **정답을 가린 독립 재풀이**와 객관식 정답 유일성·자연스러운 오답, 작은칠판 해설 전개·수식 표기, 교육과정·난도·실제 과목/단원에 맞는 메타·PT/TPL 바인딩을 각각 검수한다. 최초 정식검수의 정상 문항도 이 분모에서 빼지 않는다. 플랜 JSON은 단순 스키마 통과만으로 끝내지 않고 **원문 발문/해설 결속(엔진이 허용할 때 `sourceQuote` 실제 일치), 좌표·함수·구간·경계·단서 노출, 문제/해설 축 구분, 공식 엔진 기능 및 shallow/full 린트**를 검수한다. `UNSUPPORTED`는 실행 가능 PASS 수에서 빼고 엔진 한계·요구사항을 분리 기록한다. 수학·해설·플랜·메타의 확정 HARD FAIL은 직접 최소 수리·영향 재검한다. 구조 검사만으로 수학적 PASS를 주장하지 않는다.
5. **기본 제외:** 실제 그래프/SVG 제작·렌더 실행·PNG/스크린샷 시각검수(후속 엔진 담당), 원본 PDF/HWP 전수 대조(별도 요청 예외), 새 PT/TPL 등록·공용 registry 수정, 신규 R1/R2/R3 실행, 무관한 시험지/공용 시스템 수정. **`VERIFIED_DELTA`에서만** 증거가 그대로인 정상 문항의 반복 전수 재풀이를 제외한다. GPT의 `main` 병합과 학생용 필수 이미지 제작·실제 배포 완료는 서로 다른 상태다.
6. 소스 JS에 명시되어 main에 병합되는 메타 변경은 자동 등록기가 UID별 소형 요청·영수증을 생성한다. **작업자는 같은 변경을 `.archive-meta-register/inbox/*.json`으로 중복 제출하지 않는다.** 소스 밖의 별도 의미 메타 보완은 기존 승인된 시험지별 소형 JSON/stage-local 입력 경로를 유지한다. 공용 `question_metadata.json`/대형 catalog/compiled 파생 JSON 전체 직접 수정·업로드 금지. 등록기 미지원·빈 메타는 정확한 보완 사유로 분리하고 허위 승인 금지. 이미 승인·등록된 동일 판본에 중복 요청을 만들지 않는다.

## 3. FIRST_FORMAL 증거 게이트 — 실행 의무

- 문항별 **블라인드 1차 답과 계산 근거**, 객관식 보기·정답 유일성, 해설·교육과정·메타 검수 여부, 문제/해설 각 축의 검수 이유를 남긴다. 독립 검수자·분리 실행 근거는 기록하되, 텍스트 주장 하나로 실제 수학적 독립성을 자동 증명했다고 주장하지 않는다. 이전 생성 영수증에 `23/23`만 써 있거나 해설/플랜 변경으로 증거가 낡으면 `FIRST_FORMAL` 검증을 다시 한다.
- **정확한 JS 경로로** `node tools/harness/verify-finalqa-evidence.cjs --exam <repo-relative-exam.js> --blind-pack`을 실행해 **정답·해설·메타가 없는 독립 풀이 입력**을 검수자에게 전달한다. 같은 경로에 `--template`을 실행해 모든 QID의 **NOT_RUN 출발 양식**을 만든다. 별도 검수자의 1차 답·계산 근거가 고정된 다음 정답과 비교하고, 양식에 `blindArtifactRef`·문항별 검수 결과를 입력한다. `--exam <동일 경로> --evidence <완성된 JSON 경로>`로 검사한다. 원본 계산 과정은 Git 외 증거 보관처에 두고, Git에는 필요한 소형 검수 영수증만 넣는다.
- 이 게이트는 **문항/메타 의미 필드별 SHA-256 지문**, QID 누락/중복, 블라인드 결과·점검 증거, 문제/해설 2N 축, 플랜 파일 다이제스트, 실제 `sourceQuote` 일치(지원 스키마만), 문제용 파생 중심점 노출, `UNSUPPORTED`의 인계 형식, **공식 shallow/full plan-lint 종료 상태**를 검사한다. `--no-lint`는 진단 전용이며 `QA_EVIDENCE_COMPLETE`가 될 수 없다. 실패·미완은 `EVIDENCE_INCOMPLETE` 및 정확한 결함 코드로 보고한다.
- `QA_EVIDENCE_COMPLETE`는 **검수 증거의 형식·결속·분모 및 공식 린트가 갖추어졌다는 뜻**이지 프로그램이 수학·교육적 진실을 증명했다는 뜻이 아니다. 정식 수학 품질 판정은 실제 독립 검수자가 문항별 계산을 확인해야 한다. 플랜 수는 `executable / unsupported / exempt`로 분리하고 `UNSUPPORTED`를 엔진 지원 PASS로 합산하지 않는다. 렌더·PNG 미실행은 항상 별도 `NOT_RUN`이다.
- 기존 역사적 영수증·시각 후속 장부의 `BLOCKED_REQUIRED_VISUAL`은 실제 당시 기록으로 보존한다. 새 GPT QA 결과와 `MAIN_DONE`·`SVG_VISUAL_QA_DONE`·학생 배포 상태를 덮어써서 가짜 단일 PASS로 만들지 않는다.

## 4. Git main 운영병합 후 GPT 종료

7. 대상 JS/자산/필요한 소형 메타 입력만 변경한 PR을 생성해 GitHub가 허용하는 범위에서 `main`에 병합한다. 범위 밖 stage·commit·도구/CI·전체 인덱스 수정, `git add .`, 브랜치 보호 해제/강제 push 금지. CI 대기/무관한 실패로 병합을 불필요하게 지연하지 않는다.
8. **원격 `main` commit SHA와 대상 변경 파일 blob을 한 번 readback하면 GPT 종료:** `MAIN_DONE`. 변경 필요가 없고 이미 현행 `main` 실물이 확인되면 `NO_CHANGE_MAIN_DONE`. 미병합은 `BLOCKED/OPEN`으로 남기고 `firstMissingStep` 하나를 적는다. Notion 기록이 불가능하면 `RECORD_PENDING`으로 분리하며 실제 Git 병합 결과를 부정하지 않는다.
9. **GPT 완료조건에서 제외:** 병합 후 CI/Actions 반복 polling, Consumer/Search 화면의 N/N 수동 parity, DB/index/catalog/런타임 재생성·검증, Chrome/Pages 최종 배포 검사 및 기다림. 자동 등록·후보완 기록·소비자 검증·실패 재시도는 GitHub Actions 담당이며, **Actions가 실제로 성공했는지 확인하지 않았다면 성공이라고 주장하지 않는다.** 자동화 구현·시범운영을 사용자가 별도로 지시한 작업만 실제 실행 결과를 추가 검증한다.

## 5. 상태·예외·인계

- `MAIN_DONE` = Git 대상 병합 및 원격 readback. `PIPELINE_PASS` = Git Actions의 실제 검증 성공. `DEPLOY_DONE` = 실제 Pages 배포 성공. 셋은 독립 사실이다. 신규 품질 검수 `PASS`는 실행 증거가 있는 이번 분모만 기록한다.
- 별도 Git 기술 장애가 발생하면 실패 workflow와 정확한 원인을 따로 남긴다. 이미 증명된 `MAIN_DONE`을 되돌려 동일 시험지 수학 검수를 재시작하지 않는다. 자동복구·자동 알림은 검증 전 보장하지 않는다.
- 중단 인계는 `examUid / exact Git path / source blob / OPEN QID·필드 / 실제 수리 / 마지막 성공 SHA / firstMissingStep`만 기록한다. 같은 SHA·동일 문서를 재조회하거나 장문 문서 로드를 재개하지 않는다. 상세 오류 때만 [이전 FAST ROUTER v1.1](JS_Archive_FINAL_QA_FAST_ROUTER_HANDOFF_CURRENT_v1.md)의 관련 절을 참고하되 **예전 Consumer 수동 완료조건을 재적용하지 않는다**.
- **3줄 보고:** `완료: 시험지·실제 변경/mainSHA` / `미완료: GPT 잔여 또는 없음(자동화 후속 별도)` / `다음: 정확한 다음 시험지 또는 첫 미해결 단계`.

## 문서 소유권 · 구버전 처리

- GPT FINAL QA 실행 규칙은 **이 파일 1곳에서만** 개정한다. Notion [02-01 라우트](https://app.notion.com/p/4010e68bd69f81569b84fb85e8645590)는 사용 조건·링크만 유지한다.
- [Notion FINAL QA v2.1](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98)은 2026-10-21의 역사적 참고·증거 문서다. 그 문서 및 이 파일의 2026-10-21 이전 commit에 남은 `N/N 전수 Consumer 수동검사`·PT/TPL 필수·다중 필독 지시는 **현행 완료조건이 아니다**.
