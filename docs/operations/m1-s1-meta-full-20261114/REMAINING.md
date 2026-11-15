# M1-S1 메타 — Codex가 이어받을 미완료

## 현재 운영 마감 — 2026-11-15

- 작업 `M1-S1-META-FULL`, taskId `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`, owner `GPT_ROOT_33CD7F492CC2`. 현재 root와 보조 작업자 모두 쓰기 종료(`CLOSED`), `RESUME_READY`다.
- 원래 `CODEX_LOCAL` 인수는 AWCR r8까지 확인되지 않았다. 현재 root는 사용자 직접 지시에 따라 r9에서 `CHATGPT_RESUME` 인수를 기록했다. 다른 운영 PR의 병합을 이 task의 Codex 인수 증거로 간주하지 않았다.
- 기존 12시험지·286문항 전수 검토, 독립표본36, 기존93 판본 계보를 재사용했다. 재전수검토0. 원래 합본286개·원시 검토 기록은 바꾸지 않았으며 최신 판단은 `residual/current-judgment-overlay-20261115.json`의3개 명시 보완과 함께 읽는다.
- [운영 PR #2133](https://github.com/icefoxtail/AP------/pull/2133)은 head `136b1d66603062ddfdeda6a0b3ac14f29265aaaa`의 적용 검사6개 성공·등록 job 정상 skip 확인 후 병합됐다. main 병합 commit `fc58d6737e5178268c511a5d9c24c4651e103b05`, 원격 main 재조회 commit `fc58d6737e5178268c511a5d9c24c4651e103b05`에서 실제3파일의 내용과 Git blob을 검증했다.
- 연향19중간Q7: 빠진 최소성·기약성 해설을 보강하고 method `[53,1,19,12]`를 문항 단위로 승인했다. source는 solution만 수정하고 다른22문항·선지·정답을 보존했다. compact의 해당 hold를 제거했다. 독립 근거 commit `45c17f1b31dd6898b7b4af108729b3bb9eb5472f`와 raw SHA를 고정했다. 정식 native FINAL_QA 승인으로 일괄 승격하지 않았다.
- 금당19기말Q20: 독립 대조한 두 원본 PDF와 일치하도록 계수6→8을 question 필드에서 한 글자 정정했다. 답·해설 공란, 다른23문항, 직접 유사문항은 보존했다. legacy fingerprint가 question alias를 제외하는 한계 때문에 실제 원문 문자열 SHA·raw source·Git blob으로 결속했다.
- 매산17중간Q19: 원본 확대에서 점 형태의 인쇄 흔적을 다시 확인했으므로 기존 점 삭제 제안을 기각했다. source는 보존했고, 과거의 단정적 no-dot 판정만 새 근거로 보완했다.
- 최초 head `956a5add…`의 CI 결과342 PASS/1 FAIL은 보존했다. 범위 밖 M1S2 Q13의 canonical 분류07/05 불일치였으며, 기존 공식 등록 완료 main `5f8f509108cfc4bfac3ce47813839aaa3c558274`를 정방향 병합하여 새 head에서 검사를 통과했다. 다른 source·공용 테스트·workflow를 수정하지 않았다.
- 기존 난도4건과4칸92건의 실제metadata/Consumer 반영은 main `5f8f509…`에서 확인했다. 이번 변경의 실제 자동등록 상태: `NEW_REPAIR_REGISTRATION_IN_PROGRESS_AS_OF_20261115T103324Z`. Pages 상태: `LIVE_5F8_PRIOR_RELEASE_NEW_REPAIR_PENDING`. PR의93개 등록 preview 성공은 main 저장 또는 배포 완료와 구분한다.
- 원격 Chrome 회귀검사는 성공했으나 고정50문항에 이번Q7/Q20은 포함되지 않았다. 별도 두문항 화면검사는 로컬 브라우저 기동 제한·지원브라우저 연결 불가로 `BLOCKED`이며 실제 화면 PASS를 주장하지 않는다.
- 운영 병합과 원격 재조회는 완료했다. SOURCE_ONLY193 method 근거 및 다른92 현재해설 승인 증거, 정식 native 승인·선택 묶음·원문/정본 부채는 아래와 같이 남는다. 전체 품질 또는 전체 출고 PASS를 선언하지 않는다.
- 최신 병합·검사·원격내용 증거: `verification/operational-20261115/scoped-main-merge-closeout.json`. 의미 있는 각 단위는 immutable AWCR에 저장했고 마지막 commit 이후 생성하는 최종 revision과 raw SHA는 Notion/AWCR에서 외부 참조한다.

## 남은 범위와 다음 실행

| 범위 | 현재 판정 | 다음에 필요한 근거 또는 조치 |
| --- | --- | --- |
| SOURCE_ONLY193 | 조사한 현재 Git·기존 검토·허용 Drive 자료에서 승인 가능한 풀이 방법 근거 미확보. method=[] 유지 | 실제 승인된 해설 판본 또는 새로 명시 승인한 풀이·방법 근거를 UID/판본에 결속한다. 이미 수행한 전수검토를 반복하지 않는다. |
| 기존 해설93 | Q7은 새 해설·method 보강의 한정 승인1개. 다른92 현재 해설 승인 근거 미확보 | 판본 계보와 별개인 현재 판본 승인 기록을 확인한다. 현재 native FINAL_QA93개를 일괄 승인하지 않았다. |
| 매산22~24 선택 묶음 | 전체UID 난도 bucket 미정3개, 단일PT/TPL 투영 보류2개 유지 | 선택 묶음의 평가단위와 단일 투영 규칙을 정본에 확정한 뒤 해당 UID만 처리한다. |
| 금당19Q15 | 실제 판본의 연산자 충돌 미해결 | 판본 선택의 근거가 필요하다. |
| 매산17Q4·삼산17Q15 | 원본 조건/정의역·소수 전제 문제 | 원본 자체 결함과 전사 오류를 구분한 현재 판정을 보존하고 필요한 정정 승인만 처리한다. |
| 삼산17Q17·금당17Q15 | 원본의 중복 선택지 | 전사 오류처럼 임의 수정하지 않는다. |
| 연향16Q11 | 의도한 규칙의 유일성 근거 부족 | 의도 판정 근거가 필요하다. |
| 삼산17Q23 | 단일주기 계수 문제의 route/leaf 정본 보완 대기 | 기존 LCM 제외 판정을 보존하고 정확한 정의·binding을 처리한다. |
| PT/TPL/COND·binding 제안 |45 PT·114 TPL·2 COND 등은 통합 제안이며 ACTIVE 등록 완료 아님 | 승인된 정본 정의와 exact binding을 확인한 항목만 별도로 등록한다. |
| 이번 Q7 자동등록·Pages | 최신 실제 상태는 운영 마감 영수증 참조 | 완료로 추정하지 않고 실제 main 생성물·live 영수증을 대조한다. 자동화 수정 없는 일반 콘텐츠 작업의 운영 main 병합은 완료했다. |

## 보존된 이전 Pro 마감 기록

아래는 이전 checkpoint의 이력이다. 위 최신 상태와 판단 보완 파일이 현재 운영 상태를 우선한다.

이 문서는 재개점 `327c4518d0e89aac9cb4879fdd4c58b3b8ff34fc` 이후 잔여 검토를 반영한 현재 상태다. 12시험지 286 UID의 기존 전수 검토와 36개 독립표본을 재사용했다. 새 전수 풀이·해설 작성은 하지 않았다. 기존 `gap-index.json`의 614개 기록은 이력이며, 최신 문항별 결론은 `residual/merged-item-decisions.json`, 정의 대표키는 `residual/merged-registry-proposals.json`을 먼저 읽는다.

Pro의 잔여 검토·제안 통합·브랜치 보존·인계 범위는 마감한다. 다음 항목은 근거·선택 문맥·정식 등록을 요구하므로 전체 의미/출고 PASS로 승격하지 않는다. 상태는 `PAUSED_WITH_REMAINING / RESUME_READY`, Codex 인계는 `OFFERED`이며 인수 완료를 뜻하지 않는다.

## 남은 일과 정확한 다음 행동

| ID | 대상 | 이번에 끝낸 부분 | Codex의 다음 행동 |
| --- | --- | --- | --- |
| R01 | SOURCE_ONLY 8시험지 193 UID | 발문 기반 메타 후보·기존 공백 처리·현재 source 결속. 정답·해설 공란 보존 | 정당한 기존 해설 및 현재 판본 승인 근거를 확보하거나 별도 승인된 후속 해설 작업으로 연결. 근거 계약 충족 전 `method=[]` 유지 |
| R02 | 기존 해설 있음 4시험지 93 UID | 등록 QFULL 전부를 `e853086c…`의 부모 판본에서 재현. 현재 지문과의 차이는 모두 solution 필드이며 이후 추가 수정 3건도 추적 | `verification/resume-source-lineage.json`을 재사용하고 현재 UID+solution bytes에 맞는 실제 최종 승인 증거를 결속. 지문 계보 확인을 VERIFIED_FINAL 승인으로 바꾸지 않음 |
| R03 | 문항별 정의·binding·crosswalk·RPM 제안 | 세 작업자의 정의 비교, 중복 대표키 통합, 잘못된 부모 후보 보정, 지원 UID·차이·제외범위 기록 | 합본의 미등록 정의와 정확 curriculum/course/unit/subUnit/ownerPack/PT/TPL 문맥을 정본 절차로 검토. 내부 alias는 등록된 정본 alias가 아님. 별도 권한과 선행 조건 충족 전 공유 정본/production inbox에 쓰지 않음 |
| R05 | 19연향 중간 7번 | 기존 해설이 후보의 성립 확인에 머물고 도출·최소성이 빠진다는 methodCoverage 판단 재사용 | 현재 해설의 방법 포괄 근거를 보완할 수 있는 승인 자료를 연결. 인용 문자열 일치만으로 의미 완결 선언 금지 |
| R06 | 17삼산 중간 23번 | 단일 반복 단위의 위치·개수 과제로 판정. 두 주기의 LCM 후보 배제. 선행기초 route/정의 제안과 goal `판정`+`개수` 보정 검증 | 해당 선행기초의 정식 route/leaf 및 새 정의를 승인된 절차로 등록. 현재 M1 유리수 계산 경로에 강제 삽입하지 않음. 해설 method는 여전히 R01 대상 |
| R07 | 아래 원문 내용 항목 | 원 PDF 대조로 전사 차이, 실제 판본 충돌, 원문 자체 전제/보기 문제를 구별 | 승인된 정본의 권위와 수정 범위를 결정한 뒤 해당 UID만 수정·재결속. 원문·정답·해설 자동수정 금지 |
| R08 | 17매산 중간 22–24번 | 원본이 각 묶음에서 한 수준만 고르는 선택 구조임을 확인. 소문항 후보를 모두 기록 | 단일 UID의 선택 문맥/스키마를 결정. bucket UNKNOWN 3개 유지, 23·24번의 단일 PT/TPL 투영 보류 2개는 `partCandidates`로 이어감. 가장 어려운 선택지를 묶음 전체의 필수 부담으로 간주하지 않음 |
| R09 | 16연향 중간 11번 | 그림의 두 예시와 맞는 규칙 후보 및 한계를 기록 | 의도된 규칙을 확정하는 원자료/승인 근거 확인. 예시에 맞는 후보라는 이유만으로 최종 method로 등록하지 않음 |

범주별 수는 겹치므로 합산하지 않는다. sourceOnly 193과 solved 93의 전역 근거 집합은 전체 286이다. 등록 실행 0, 출고 가능으로 선언한 UID 0이다.

## 해결되어 다시 시작할 필요가 없는 항목

- **R04 매산14 그림 판독:** 원 PDF의 수치·배치를 A와 root가 확인했다. 시각 근거 부채는 종료했다. 학습 level 중 / bucket 2, confidence low·B12는 검토 후보이며 현재 source나 정식 승인으로 승격하지 않았다.
- **R02 판본 계보:** 93개의 오래된 등록 지문이 어느 판본인지 확인했다. 같은 전체 지문 추적을 반복하지 말고 현재 판본의 승인 근거에 집중한다.
- **삼산23 목표어:** 기존 사전의 `판정`을 사용하고 `개수`를 보존하는 goal-only 제안이 공식 validator에서 예상 밖 오류 0이었다. 원래 `four-slot.json`은 그대로이며 제안은 `residual/worker-b/four-slot-patches.json`에 있다.
- **16연향16 CC 공백:** 이미 ACTIVE인 `CC_GEOMETRIC_AREA_VOLUME_FORMULA` 재사용 근거를 기록했다. 새로운 CC를 중복 생성하지 않는다.
- **연향기말17:** ACTIVE `PT_FUNCTION_GRAPH_PROPERTIES / TPL_FUNCTION_GRAPH_PROPERTY_JUDGMENT` 재사용으로 통합했다. A의 별도 point-membership 템플릿은 철회된 후보이므로 등록하지 않는다.
- 기존 12시험지 검토·36표본·63개 asset 지문·13개 solution SVG 시각 검토는 동일 source 판본에 필요한 범위에서 재사용한다. 새 근거가 생긴 해당 UID와 필드만 재검사한다.

## 원 PDF 대조 결과와 남은 결정

| 시험지·문항 | 원본에서 확인한 사실 | 남는 처리 |
| --- | --- | --- |
| 19금당 기말15 | 문제 PDF/JS와 풀이 표시본의 연산자 표기가 다름. 실제 판본 충돌 | 문제 PDF와 표시본 중 권위 있는 정본을 결정하고 선택지와의 관계를 확인. 학생 필기를 최종 승인으로 사용하지 않음 |
| 19금당 기말20 | 두 원 PDF의 식과 JS의 계수가 다름 | 전사 교정 범위를 승인하고 해당 source fingerprint/인용을 재결속. 이번에는 원문 변경 없음 |
| 17매산 중간4 | 필요한 소수/완전 소인수분해 전제가 원 PDF에도 없음 | 원문 자체 조건 문제로 유지. 후보 정의의 조건을 몰래 발문에 추가하지 않음 |
| 17매산 중간19 | 의도된 틀린 보기의 표기에 JS만 불필요한 점이 있음 | 작은 전사 복원안만 검토. 틀린 보기를 수학적으로 참이 되게 고치지 않음 |
| 17삼산 중간15 | 변수의 소수 전제가 원문에도 없음 | 원문 자체 전제 문제로 분리 |
| 17삼산 중간17 | 중복 보기 역시 원본에 존재. 복수정답 표현 가능 | 메타 검토를 시험지 전체 HOLD로 만들지 않음. 원문 품질 사항으로 보존 |
| 17금당 중간15 | 중복 보기 역시 원본에 존재 | 단일 정답/메타 판단을 막는 미확인 전사 문제로 남기지 않음 |
| 17금당 중간22 | 이미 틀린 보기의 변수 표기가 원본과 일치 | 전사 불확실성 종료. 해당 오답을 임의 교정하지 않음 |

Drive ID·PDF SHA·페이지·crop SHA와 판독 범위는 매산의 `original-source-evidence.json`, B의 `source-content-findings.json`, 금당17의 `residual-review.json`, root의 `verification/resume-root-visual-review.json`에 있다. 원 PDF 파일과 학생 필기는 검증된 해설 패킷으로 복사하지 않았다.

## 분류와 등록 시 주의할 문맥

기존 감사의 716개 후보 문맥(정확 ACTIVE 340 / 누락155 / 미확정221)과 45 UID의 `중1 수학` / `中1 수학` 차이는 과거 감사 숫자다. 이 숫자를 새 합본의 확정 등록 수로 읽지 않는다. 새 합본에서 ACTIVE 키 재사용, 미등록 대표키, 정확 binding 요청, leaf 요청과 source 교육과정 provenance를 나누었다. course나 ownerPack을 임의 정규화하지 않는다.

SOURCE_ONLY의 원본 교육과정은 파일명 연도로 추정하지 않는다. 2015와 2022는 비교/적용 시나리오이며 원본 provenance UNKNOWN과 구별한다. solved source의 등록 provenance와 JS 필드 공란도 구별한다.

Palma의 B 원천 근거는 이전 raw source SHA를 정직하게 유지한다. root의 `residual-checks.json.sourceVersionRebinding`이 기존 bucket·경계 두 메타 필드 차이만 확인하고 현재 source SHA에 다시 연결한다. 오래된 해시를 현재 해시로 덮어써 이력을 숨기지 않는다.

## 인수와 검증 순서

1. Notion 재개 인덱스의 정확 taskId `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`와 원격 브랜치, 마지막 AWCR raw SHA/revision, 모든 writer CLOSED를 확인한다. 실제 인수를 다음 immutable revision으로 기록한다.
2. `WORKER_CURRENT.md` → `progress.json` → `HANDOFF.md` → 이 문서 → 합본 두 파일 순서로 읽는다. 원시 worker 제안과 합본이 다르면 합본에 명시된 override를 따른다.
3. 최신 main의 대상 source·UID·계약·canonical 변경만 대조한다. main은 계속 변할 수 있으므로 마지막 관측값을 영구 불변으로 간주하지 않는다.
4. R01/R02/R05/R08/R09의 근거·선택 문맥과 R03/R06의 등록 선행 조건을 해결하고, 실제 변경된 UID에 필요한 검사만 한다. 공식 Resolver는 선행 승인 조건 충족 전 `NOT_RUN`이다.
5. 현재 Pro 작업의 main 병합·공용 등록·배포 권한을 추정하지 않는다. 출고 권한이 확인된 후 Codex 절차에 따라 진행하고 결과·잔여·증거를 Notion 자기 행과 AWCR에 기록한다.

주제별 문항 번호·개수와 운영 source 실제 난도 / 검토 후보 난도는 `TOPICS-RESUME.md` 및 `topics-resume.json`을 사용한다. 이전 `TOPICS.md`와 `topics.json`은 재개 전 집계 이력이다.
