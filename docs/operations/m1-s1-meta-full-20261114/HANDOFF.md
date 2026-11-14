# M1-S1 메타 — Pro 마감 및 Codex 출고 인계

**Pro의 잔여 검토·통합안·최소 검증·시험지별 브랜치 보존·출고 인계 범위를 마감했다.** 12시험지 286문항을 대상으로 기존 전수 검토 286건과 독립표본 36건을 재사용하고, 남은 근거·정의·binding·원문 대조 항목만 처리했다. 이 마감은 현재 해설 판본의 최종 승인이나 출고 PASS를 뜻하지 않는다.

- workKey: `M1-S1-META-FULL`
- taskId: `ef319e48-5efb-4d99-a4ac-5ded7ac1d74d`
- 마감 owner: `GPT_ROOT_42DE8B02EF57`; root 및 실제 서브에이전트 3명 CLOSED
- 저장소 / 브랜치: `icefoxtail/AP------` / `review/m1-s1-meta-full-20261114`
- 작업 상태: `PAUSED_WITH_REMAINING / RESUME_READY`
- 인계 상태: `OFFERED → CODEX_LOCAL` (Codex 인수는 아직 기록하지 않음)
- 재개점: `327c4518d0e89aac9cb4879fdd4c58b3b8ff34fc`
- 기준 main: `8c3b8fe05348d7235546d7d2d9ec063029d19e4d`
- 최종 main 관측: `a54075b0d292de57841c64a9b70ff02acab90695`. 대상 source·canonical 정의·계약·도구 변경 없음. 타 범위 evidence/receipt 변경은 별도 관측 파일에 기록했다.
- 최종 원격 commit의 전체 SHA와 후속 AWCR 영수증은 **원격 readback 이후 Notion 재개 인덱스/AWCR에 기록**한다. 이 파일에 자기 commit SHA를 넣는 순환은 만들지 않는다.

## 바로 읽을 파일

| 목적 | 경로 |
| --- | --- |
| 현재 상태·source·UID·담당·다음 행동 | `progress.json` |
| 남은 근거·등록·선택 문맥 | `REMAINING.md` |
| 286 UID의 최신 메타 후보·override·정확 binding 요청 | `residual/merged-item-decisions.json` |
| 대표 PT/TPL/Condition 정의·차이·제외범위·지원 UID | `residual/merged-registry-proposals.json` |
| 합본 artifactId → 실제 Git 파일·SHA | `residual/artifact-path-map.json` |
| 마감 검증 및 각 증거 SHA | `verification/resume-closeout-verification.json` |
| 시험지별 주제·문항번호·개수, 실제/후보 난도 | `TOPICS-RESUME.md` / `topics-resume.json` |

합본과 원시 worker 제안이 다르면 합본에 명시된 대표키·override가 현재 검토 결론이다. 원시 파일은 근거 이력으로 보존한다. 제안 키와 내부 alias를 ACTIVE 정본으로 취급하지 않는다. `gap-index.json`, `TOPICS.md`, `topics.json`과 재개 전 `verification/final-verification.json`은 이전 검토의 이력이며 최신 후보는 위 재개 파일을 우선한다.

## 완료·재사용·미완료 수

| 구분 | 수 | 의미 |
| --- | ---: | --- |
| 전체 대상 | 12시험지 / 286 UID | 원본 중1 1학기 중간·기말 |
| 기존 전수 검토 재사용 | 286 | 이전 검토 기록을 보존; 새 풀이 검증 승계 아님 |
| 기존 독립표본 재사용 | 36 | 시험지당3; 현재 UID·ordinal·원문 지문에 재결속 |
| 새 전수 검토 / 미착수 / 미열람 | 0 / 0 / 0 | 이미 끝낸 전체 검토를 반복하지 않음 |
| 잔여 판단 패킷 | 12 / 286 | 기존 공백·근거 항목의 처리와 남는 조건을 전량 연결 |
| 단일 PT/TPL 후보 / 선택 문맥 투영 보류 | 284 / 2 | 보류는 매산23·24. 소문항 후보6개를 보존 |
| 검토 후보 bucket 미정 | 3 | 매산22–24 선택 묶음. 그림 미판독은0 |
| SOURCE_ONLY method 근거 없음 | 193 | method=[] 유지 |
| 기존 해설의 현재 판본 승인 대기 | 93 | 판본 계보는 해명했으나 승인 증거는 별도 |
| methodCoverage / 의도 규칙 근거 | 1 / 1 | 연향19중간7 / 연향16중간11; 위 집합과 중복 |
| 이번 재개 source 수정 | 0 | 운영 source와 공유 정본 불변 |
| 브랜치 누적 source 메타 수정 | 17문항 / 21필드 | 재개 전에 적용된 지원 메타만 유지 |
| 등록 실행 / 출고 가능 선언 | 0 / 0 | 전체 품질 PASS나 등록 가능을 추정하지 않음 |

## 실제 3인 분담과 시험지별 저장

A는 3시험지70문항, B는 5시험지119문항, C는 4시험지97문항을 맡았다. 16연향24문항은 A의 파일 작성 전 B로 명시적으로 넘겼다. A는 전체 주제 집계와 보존·표본 결속, B는 원문·정의 교차검수와 이전 참조 감사, C는 통합 정의·문항 합본을 추가로 맡았다. 쓰기 경로를 분리했고 Git stage·commit·원격 ref 갱신은 root만 수행했다.

| 시험지 | 문항 | 재개 담당 | source 근거 | 시험지별 재개 checkpoint |
| --- | ---: | --- | --- | --- |
| 23_동산중_1학기_중간_중1_기출 | 23 | META_A | 기존 해설 / 현재 승인 대기 | `47b21d114bb0` |
| 19_금당중_1학기_기말_중1_수학 | 24 | META_B | SOURCE_ONLY | `b21e75722dd7` |
| 19_동산중_1학기_기말_중1_수학 | 25 | META_C | SOURCE_ONLY | `a0549fc406a2` |
| 19_연향중_1학기_기말_중1_수학 | 23 | META_A | SOURCE_ONLY | `5f3167b025bd` |
| 19_왕운중_1학기_기말_중1_수학 | 24 | META_B | SOURCE_ONLY | `45aef4a1fab9` |
| 19_연향중_1학기_중간_중1_기출 | 23 | META_C | 기존 해설 / 현재 승인 대기 | `6b51bd3654fc` |
| 19_왕운중_1학기_중간_중1_기출 | 24 | META_C | 기존 해설 / 현재 승인 대기 | `7f49aa20e0d8` |
| 19_팔마중_1학기_중간_중1_기출 | 23 | META_B | 기존 해설 / 현재 승인 대기 | `77cdabe5ed2f` |
| 17_금당중_1학기_중간_중1_수학 | 25 | META_C | SOURCE_ONLY | `6b2ea5d0cfc7` |
| 17_매산중_1학기_중간_중1_수학 | 24 | META_A | SOURCE_ONLY | `e4d9a4f62396` |
| 17_삼산중_1학기_중간_중1_수학 | 24 | META_B | SOURCE_ONLY | `a99a25e98291` |
| 16_연향중_1학기_중간_중1_수학 | 24 | META_B | SOURCE_ONLY | `c8871fae63ec` |

각 시험지 checkpoint는 원격 ref와 tree를 재조회했다. 마지막 통합 commit에는 이후 정정된 동산23 제안, 정의 합본, 현재 증거 재결속 및 인계 문서가 포함된다. 중간 checkpoint를 최종본으로 reset하지 않는다. `progress.json.resumeExamRemoteReceipts`에 전체 SHA가 있다.

## 이번에 해결한 핵심 항목

1. **93문항 등록 지문 계보:** 모든 등록 QFULL은 `e853086c37753bf50362bcc1ccf9378f4d20fac3`의 부모 판본과 일치했다. 현재 QFULL 차이는 solution 필드뿐이며 이후 solution 추가 수정3건도 추적했다. 실제 현재 판본 승인과 계보 해명을 분리했다.
2. **매산14 시각 부채 종료:** 원 PDF를 확보해 수치·배치를 직접 확인했고 root가 같은 부분을 대조했다. level 중 / bucket2, low·B12는 잠정 검토 후보다.
3. **매산22–24 선택 구조 확인:** 선택 묶음의 최고 부담을 단일 UID 난도로 강제하지 않았다. bucketUNKNOWN3, 단일 PT/TPL 투영 보류2를 기록하고 소문항 판단을 보존했다.
4. **원문 대조:** 금당19의 문제/표시본 판본 충돌과 JS 전사 차이를 분리했다. 매산4·삼산15의 전제 문제는 원문에도 있음을 확인했고, 중복 보기·의도된 오답의 표기를 무조건 고치지 않도록 정리했다.
5. **삼산23 분류·목표어:** 단일 반복 단위의 위치와 개수 과제로 판정했다. 선행기초 route/정의 제안, `판정`+`개수` goal-only 보정과 공식 검사 결과를 남겼다.
6. **유형 통합:** 기존 정의 실제 범위를 비교하여 중복 제안과 잘못된 부모 연결을 보정했다. 연향기말17은 기존 ACTIVE 그래프 성질 판정 정의를 재사용해 별도 신규 TPL을 철회했다.

## 통합 정의와 정확 binding

| 구분 | 통합 결과 |
| --- | ---: |
| 미등록 PT 정의 초안 | 45 |
| 미등록 TPL 정의 초안 | 114 |
| 미등록 Condition 초안 | 2 |
| 기존 ACTIVE 정의 참조 | 112 |
| 내부 alias / 대표 키 | 27 / 23 |
| 통합 결정 / 부모 보정 | 25 / 6 |
| leaf 요청 그룹 | 46 |

leaf46그룹은 서로 다른 새 leaf46개가 등록 확정되었다는 뜻이 아니다. 부모·경로·교육과정별 요청과 원천 선언을 묶은 검토 자료다. 기존 ACTIVE의 정의를 몰래 확장하지 않았고, 필요한 확장은 미등록 대표 초안에 명시했다.

최종 후보의 정확 binding 문맥은 578개다. ACTIVE 정확 재사용 후보186, 기존 부모의 binding 공백111, 과정명 불일치 공백37, 새 부모 등록 후 binding 요청244다. 이 수는 UID 수가 아니라 교육과정별 후보 문맥 수다. 이전 전체 후보 감사의 716문맥/45UID 과정명 차이와 분모가 다르다. 과정명 `중1 수학`과 `中1 수학`, ownerPack, 2015/2022, source 원본 교육과정 provenance를 구별했다.

## 난도와 주제 집계

| 항목 | 운영 source 실제값 | 검토 후보 |
| --- | --- | --- |
| 학습 level 하 / 중 / 상 / 미정 | 10 / 75 / 8 / 193 | 116 / 158 / 12 / 0 |
| bucket 1 / 2 / 3 / 4 / 5 / 미정 | 17 / 53 / 20 / 3 / 0 / 193 | 78 / 161 / 40 / 4 / 0 / 3 |

학습 level과 bucket은 서로 변환하지 않았다. source의 미정193은 필드 부재이며 후보 집계와 구별한다. 매산22–24의 기존 학습 level 중은 잠정 제안으로 보존했고, 선택 문맥 미정 bucket과 합쳐 확정한 것으로 표시하지 않았다.

| 주제 | 문항 |
| --- | ---: |
| 소인수분해 | 69 |
| 정수와 유리수 | 90 |
| 문자와 식 | 86 |
| 좌표평면과 그래프 | 38 |
| 입체도형 | 2 |
| 선행기초 단일 반복 | 1 |
| 합계 | 286 |

각 시험지에서 해당하는 **모든 문항 번호와 개수**는 `TOPICS-RESUME.md`에 있다. 실제 source 반영을 주장하는 분포가 아니다.

## 변경과 보존 범위

이번 재개에서 source 수정은0이다. 이전 브랜치가 적용한17문항21필드는 difficultyBucket4, legacyLevelCompatibility3, Condition1, Integration12, difficultyBoundaryFlag1이다. 원문·답·해설·그림·레이아웃·UID·순서·기존 level 문자열을 바꾸지 않았다.

원래 `review.json.after/sourcePatch`는 제안이다. 실제 반영은 `rootSourceDisposition.currentMetadata/appliedFieldDeltas`, 재개 전 최종 검증과 실제 Git source diff를 따른다. 새 합본의 `sourceProjectionApplied=false`도 유지한다. Palma의 이전 source SHA 근거는 원형을 보존하고 root receipt의 metadata-only 재결속을 통해 현재 SHA와 연결했다.

## 필수 검사와 증거 한계

- 기존 source12 raw bytes·UID286 순서·원래 검토48파일을 재개점과 대조하여 그대로임을 확인했다. 독립표본36의 UID/ordinal, QBODY/QFULL, 별도 원문 UTF-8 hash를 현재 source에 직접 재결속했다.
- 독립표본 파일의 `finalAuthorArtifactReadback`24개 해시와 초기 worker 참조24개는 최종 파일과 다르다. B 감사에서 작성자 payload와 이후 root 통합 파일의 참조 계층 차이를 확인했고, review5개는 root 부가 필드를 제외하여 작성자 SHA를 정확 재구성했다. 나머지 작성자 payload의 정확 원바이트는 회수하지 못했다. 과거 해시를 현재 해시로 바꾸어 이력을 덮지 않았다. 현재 `checks.json.artifactHashes` 및 기존 최종 검증은 현재 파일과 일치하고 새 보존 영수증이 현재 source/sample을 결속한다. 정확한 중간 bytes를 회수하지 못한 참조의 의미 불변을 추정하지 않는다. `verification/prior-independent-reference-audit.json`과 보존 영수증을 함께 읽는다.
- 통합 UID286, 입력 SHA69, artifact/JSON pointer2,288개, 공식 ACTIVE 정의·TPL 부모·내부 alias·지원 UID·정확 binding578문맥을 검사했다. root 구조/결속 오류0이다.
- 실제 바뀐 삼산23 goal 제안만 메모리에서 적용해 공식 4칸 validator로 해당24문항을 검사했다. 예상 밖 FAIL0, 기존 empty method24, warning19다. 원래 4칸 파일은 변경하지 않았다.
- 기존 전량 기계검사·63asset 지문·13solution SVG 시각 검토는 source 불변 근거로 재사용했다. 모든 SOURCE_ONLY193의 empty method 부채는 그대로 남는다.
- 최신 main의 대상 source/UID/정본 정의/계약/도구 드리프트를 확인했다. 현재 대상에 영향 없는 다른 scope의 evidence 및 catalog receipt 변화는 숨기지 않고 기록했다.
- 공식 Resolver, 공유 등록, main merge, 배포는 `NOT_RUN`이다. 전체 build·브라우저·출고 검증을 하지 않은 것을 PASS로 표기하지 않는다.

읽기 전용 재현은 저장소 root에서 필요한 범위만 수행한다.

```bash
node docs/operations/m1-s1-meta-full-20261114/verify-resume-merged.cjs /tmp/m1-resume-integration.json
node docs/operations/m1-s1-meta-full-20261114/verify-resume-four-slot.cjs /tmp/m1-resume-four-slot.json
node docs/operations/m1-s1-meta-full-20261114/verify-resume-preservation.cjs --repo . --output /tmp/m1-resume-preservation.json
```

합본의 progress 입력 해시는 생성 당시 값이다. 이후 마감 진행표와 충돌하지 않도록 `residual/merge-input-progress.json`에 원바이트를 보존했고 `artifact-path-map.json`이 이를 지정한다. worker의 절대 경로는 출처 이력이며 Git에 보존된 상대 경로로 모든69입력을 검증할 수 있다.

## Codex 인수 순서

1. Notion 라우터·시작/생명주기·재개 인덱스의 정확 task와 마지막 AWCR raw readback을 확인한다. `OFFERED`를 실제 인수한 뒤 다음 immutable revision으로 기록한다.
2. 원격 브랜치 최신 HEAD를 fetch하고 이 인계와 진행표/합본/검증을 확인한다. 새 날짜별 브랜치나 과거 SHA reset으로 이미 완료한 작업을 잃지 않는다.
3. 최신 main의 대상 변경만 확인하고 `REMAINING.md`의 R01/R02/R03/R05/R06/R07/R08/R09를 이어간다. R04 시각 부채와93판본 계보 조사, 전수검토286·표본36을 이유 없이 반복하지 않는다.
4. 현재 판본 승인·method 근거·선택 문맥과 등록 선행 조건을 해결한다. 새 전수 풀이·해설 작성·R1/R2/R3를 이 인계의 권한으로 추정하지 않는다.
5. source 수정/공유 정본 등록/출고가 승인된 경우에만 정확 UID/판본과 필요한 검사로 이어간다. 현재 Pro 작업에서의 main·공유 등록·배포 미실행과 권한 한계를 자동 해제하지 않는다.
6. 실제 완료·남은 일·검증 참조·nextAction을 진행표, Notion 자기 행, AWCR immutable 다음 revision에 기록하고 raw SHA/revision을 다시 확인한다.

## 복사할 Codex 인계문

```text
M1-S1-META-FULL의 기존 Pro 인계를 이어받아 출고 전 남은 항목만 처리해.
taskId: ef319e48-5efb-4d99-a4ac-5ded7ac1d74d
이전 owner: GPT_ROOT_42DE8B02EF57 (CLOSED / RESUME_READY)
저장소: icefoxtail/AP------
브랜치: review/m1-s1-meta-full-20261114
진행표: docs/operations/m1-s1-meta-full-20261114/progress.json
인계서: 같은 폴더 HANDOFF.md 및 REMAINING.md
Notion 「중등 통합 메타 작업 — 재개 인덱스 CURRENT」와 마지막 AWCR raw revision/SHA,
실제 원격 HEAD를 대조해 정확 task의 OFFERED→ACCEPTED 인수를 기록해.
기존 전수 검토286·독립표본36을 재사용했고 잔여패킷12시험지286UID까지 저장되어 있어.
residual/merged-item-decisions.json, merged-registry-proposals.json, artifact-path-map.json부터 읽어.
단일 후보284, 매산23/24 선택문맥 투영보류2와 part6, 매산22–24 bucketUNKNOWN3을 보존해.
R01 method근거193, R02 현재해설승인93, 연향19중간7 methodCoverage, 연향16중간11 규칙근거,
정확binding/leaf/미등록정의와 원문판본결정만 이어가. 매산14 시각판독과93판본계보 조사는 끝났어.
원래 source/검토48파일 불변·36표본현재source재결속 영수증과 이전 내부hash참조 감사도 읽어.
원시 worker 제안과 합본이 충돌하면 명시된 통합 override를 따라. ACTIVE 등록으로 오해하지 마.
새 브랜치·과거SHA reset·전체재풀이·해설재작성·R1/R2/R3를 임의로 추가하지 마.
main병합·공유등록·배포는 실제권한과 선행승인 확인 후 Codex절차로 진행해.
진행표/Notion 자기행/AWCR immutable 다음revision 및 raw SHA를 갱신해.
```
