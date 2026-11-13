# 중1 기존 시험지 메타 전수 검토 인계

## 현재 상태

**운영 완료 3/44장 · 읽기 95/1,047문항 · 운영 마감 71문항 · 남은 41장.** 현재 **04. 2025 동산중 중1 2학기 기말24**의 발문·선지·제공 풀이와 그림15개 읽기를 마쳤다. 후보 적용 전이며 공유 binding154의 과정명 오타 교정이 선행 의존이다. 5번으로 넘어가지 않는다.

- 저장소: https://github.com/icefoxtail/AP------
- taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner `GPT_ROOT_933015CD0A4F`, instructionRevision2.
- 담당 branch `review/m1-existing-meta-20261113`.
- 최신 확인 main `bf35b7e13417b033ee167117d567a9f0262712d6`, tree `31bb7763bb56018167279ad094dd787989129f75`.
- 직전 검증 branch checkpoint `7a00f23bf95c64f43993c57ce13d7f74c709b288`, tree `f4fe7f30ac81ede9fbbc915a76bbbfc30e261d04`. 이 문서의 최종 게시 SHA는 branch 실제 재읽기와 후속 AWCR에서 확인한다.
- 최신 원격 raw 검증 AWCR r26: file `1UDD7sfKRucwIKjI4TFDGcyEMmwwXcBtF`, SHA256 `cd43260a5dfc37e5eef6f5b4e6597b4e459d05f4311c938a5060dc2ee84dadb2`. 다음 immutable revision은 r27이다.

[README.md](README.md)의 전체44장 큐와 [progress.json](progress.json)의 상태를 함께 읽는다. 연도 내림차순 → 학기 내림차순 → 기말 먼저 → 학교명 순서로 한 장씩 마감한다. 사용자 승인은 연속 PR/main 병합을 포함한다.

## 동산중 검토 근거와 결정

[진입 기록](04-dongsan-intake.json), [Notion 라우팅](04-dongsan-entry-route.json), [전체 의미 원장](04-dongsan-semantic-review.json), [그림15개 실제 열람](04-dongsan-figure-read-evidence.json)을 읽는다. Source raw `357bfa1d8b326e228179624bf4943ec151a53362e23b00d2dcaac717a5334029`, blob `c75dc3e1ce47c0ec85e51a63b1a1e16ab479385f`이다. Explicit source.id/sourceOrdinal과 metadata·identity의24 UID를 결속했다. 배열 위치로 문항 번호를 추정하지 않는다.

시험명과 달리 실제 내용과 기존24 metadata는 **2022/M1-1**이다. 파일명으로 M1-2에 옮기지 않는다. Root가 모든 텍스트와 Q15/Q16/Q22 원본그림을 읽고, reviewer의 실제 그림15개 관찰·원본 SHA를 확인했다. 이것은 수학 재풀이·정답 검증·수학 FINAL QA 기록이 아니다.

기존 단원·소단원·PT를 모두 유지한다. Master의 실제 conceptClusterKey로24개를 정리하고, primary 내부 절차·선지 대조를 독립 개념 결합으로 표시한23개 integration을 NONE으로 정리한다. Q22의 두 명시적 소문항은 SEQUENTIAL 유지다. Q8 scalar 나눗셈은147의 명시적 선택 규칙과 native 정의에 맞으며 괄호 외형만으로 고른 것이 아니다. Q17은 정확한 native 사분면 부호 변환을 유지하고 양수·음수 조건을 보완하되, 정확한 locked RPM leaf가 없어 debt로 기록한다.

Q22는 기존 PT 아래 **단위량을 이용한 수량식과 식의 값** TPL1개를 보완한다. 키 `TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_UNIT_QUANTITY_AND_EVALUATION`. 단위량→수량식 모델→명시적 대입의 핵심 단계를 담으며 응답 형식 차이만으로 분리하지 않는다. [현재17팩 재사용 검색](04-dongsan-q22-native-proposal.json)에433PT/998TPL/531alias 검색·가까운18개 정의 대조가 있다. Exact RPM23/debt1, 현재 FAMILY의 선택을 정확한 native TPL과 부모에 결속하기 위한 DIRECT supplement8개 계획이다. 기존 leaf/정본 master 의미를 바꾸지 않는다.

## 즉시 해결할 공유 binding154 의존

[전체 영향 범위](04-dongsan-binding-course-scope.json)에서 metadata28,890/approved12,320/runtime6,608을 확인했다. MIDDLE1 binding151–155의 `中1 수학`을 `중1 수학`으로 바꿀 때 exact 영향17 = 동산16 + 풍덕1이다. 151/152/153/155는 동산 내부만 영향이고, **154 LINEAR_EQUATION_SOLVING은 동산4와 풍덕Q20 하나**를 공유한다.

풍덕 UID는 `qid_v1_553b57b364c7ebc98905d8268bc248b500f3e8a62855de1769b6328dfff6fdb2`, source `original/middle/m1/2final/25_풍덕중_2학기_기말_중1_기출.js` Q20이다. 현재 승인·runtime 선택 가능이다. 154를 동산 일반 v2 요청에서 고치면 외부 승인 signature가 바뀌므로 기존 out-of-scope guard에 걸린다. **이 guard를 완화하거나 새 alias/중복type으로 우회하지 않는다.** 풍덕 문항의 의미 검토 완료로 세지 않는다.

기존 spelling-correction v1은 한 binding/한 source만 보존하므로 두 source를 가진154에는 충분하지 않다. 별도 작업공간 `m1-dongsan-binding-bridge`에서 한 binding의 과정명 한 필드만 바꾸는 v2를 구현한다. 기존 v1과 일반 reviewed-exam-v2 보호를 유지하고, 실제 old/new tuple/support/runtime union에서 나온 정확5UID·2source를 source raw/blob/count·metadata/identity/runtime·기존 indexed R2 proof와 결속한다. 전체 MIDDLE1 runtime의 공식 consumer 의미·승인·선택 snapshot을 보존하고 unknown/unapproved/unbound source·추가/누락/변조·중복binding·다른행 변경을 거부해야 한다.

이 선행 교정은 별도 PR/main의 실제 영수증과 최종 보존 Consumer까지 마감한다. 이후 새 main에서 동산의 normal24 요청을 만들고 남은4개 동산 내부 spelling row를 정확 before/after로 정정한다. 현재 production source/canonical/runtime는 변경하지 않았다.

## 병행 작업 경계

[PR1405](04-dongsan-pr1405-scope.json)는 동산 sidecar24 UID가 겹치지만 현 main과 item값은 같고 검토 이력만 다르다. 해당4slot을 보존하고 메타 수정 후 직접 Consumer 영향을 확인한다. [PR1751/다른 owner](04-dongsan-other-owner-pr1751-scope.json)는 중1 요청6개 실제140 UID와 동산24 교집합0·registryChanges0. 다른55개 item 전체를 새로 읽었다고 주장하지 않는다. 다른 owner의 최신 r16은 신흥 범위 COMPLETE_DECLARED/NO_NEXT_ACTION이며 임의 인수하지 않는다. PR1959 향림2024 source/그림은 해당 차례에서 재확인한다.

## 이미 완료한 항목 — 동일 입력을 반복하지 말 것

- RPM6권2022 L1/L2 [PR1958](https://github.com/icefoxtail/AP------/pull/1958): 대단원24·중단원54, 기존326leaf 보존·부모9개 정정. `fix/rpm-middle-l1-l2-20261113`에 인계가 있다.
- 신흥24 [PR1964](https://github.com/icefoxtail/AP------/pull/1964), [첫 마감](01-shinheung-operational-closeout.json). 다른 owner의 [PR1967](https://github.com/icefoxtail/AP------/pull/1967) 이후 현재 source raw `2f1ab79eba940498b5c575ad1509a038b3f2dabd390823177635d83937fe4b56`도 보존했다.
- 왕운23 [PR1968](https://github.com/icefoxtail/AP------/pull/1968), actual main `738af248bd62813a572ac81725892b3f12ee2beb`, [마감](02-wangun-operational-closeout.json). 의미 원장은 UID/ordinal 정정된 revision3만 사용한다.
- 팔마24 [PR1969](https://github.com/icefoxtail/AP------/pull/1969), actual main `bf35b7e13417b033ee167117d567a9f0262712d6`, [마감](03-palma-operational-closeout.json). 실제 writer43493276504·post-AutoMeta Consumer24/24/24·metadata24/identity24/runtime24/정본7·대상밖/이전47 보존을 확인했다. RPM exact19/debt5. 실제 main과 격리 증거 핵심23파일·canonical resources141·loader9개가 같아 동일 검증을 반복하지 않았다.
- 선행 과정명 교정 [PR1966](https://github.com/icefoxtail/AP------/pull/1966): actual main51cf·Consumer1/1·runtime613 보존으로 완료했다.

이미 소비된 Palma/Wangun/Shinheung 요청을 inbox에 다시 넣지 않는다. 팔마의 요청은 head `e5860a968cc65f4e8817dc8492c14959f8d9b7d1` 또는 writer artifact에서 읽는다.

## 이어서 실행

새 세션은 연결 Notion 라우터→Archive 시작/생명주기/메타 라우트, 정확한 현재 AWCR, 최신 Git main/branch를 먼저 확인한다. 현 세션의 동산 진입 시 이미 읽었으며 해당 Git 정본 raw도 같음을 확인했다. Source와 관련 입력이 같으면 완료된 의미 읽기를 반복하지 않는다.

공유 binding 교정 의존 마감 후 동산 source 메타-only 후보와 공식 소형 등록 요청을 만든다. 정상 문제·정답·해설·이미지15·UID·배점·난이도·source reviewStatus·4slot을 보존한다. Official v2/changed-UID Consumer·실제RPM 부모를 확인하고, 전체 R1/R2/R3를 실행하지 않는다. Generated common metadata/runtime/compiled JSON을 수동 게시하지 않는다.

한 시험지 PR→정확 head CI→main merge→실제 등록 영수증→최종 post-AutoMeta Consumer→원격 SHA·보존 확인 후에만5번2025신흥기말22로 간다. 전역 workflow SUCCESS로 해당 요청 REGISTERED를 추정하지 않는다. 의미 있는 완료 단위마다 원장·인계·근거를 branch에 게시 후 실제 raw/blob/tree를 재읽고, AWCR는 안전한 상태·참조·SHA·남은 일·nextAction만 다음 immutable revision으로 저장 후 raw 확인한다. 원문 문제/정답/해설·credentials·upstream raw를 AWCR에 넣지 않는다.

## 복사용 인계 프롬프트

> AP------ 중1 전수 메타 검토를 계속하세요. task f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. 연결Notion·정확AWCR r26이후·최신Git의 HANDOFF.md/progress.json을 먼저 확인하세요. RPM6권L1/L2와 신흥24·왕운23·팔마24는 운영 완료했으니 반복하지 마세요. 현재3/44완료,95문항읽기/71운영마감,41장남음. 4번2025동산기말24는 텍스트·그림15 의미읽기 완료,실제2022/M1-1,후보적용전입니다. 공유binding154 과정명 오타가 동산4+풍덕Q20 하나를 공유해 일반v2외부보호에 걸립니다. 좁은 한binding/두source 보존용course-correction v2를 구현·검증·main마감하고 그후 동산24후보를 새main에서 만드세요. 일반guard를완화하거나풍덕을검토완료로세지마세요. 원장의PT유지/TPL1/cluster24/integration23/condition1/RPMexact23/Q17debt를이어적용합니다. 한장씩PR→main→실제영수증/최종Consumer/SHA→branch/AWCR마감후다음으로. 전체R1/R2/R3·동일입력검증반복금지,정상데이터/4slot/source reviewStatus보존.

중1 전체 종료 후 남은 taxonomy debt와 학년·학기별 큐를 다음 담당에게 넘긴다. 미검토 학년·시험지를 완료 표시하지 않는다.
