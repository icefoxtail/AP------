# 중1 기존 시험지 메타 전수 검토 인계

## 현재 상태

**운영 완료 3/44장 · 읽기 95/1,047문항 · 운영 마감 71문항 · 남은 41장.** 현재 **04. 2025 동산중 중1 2학기 기말24**의 의미 읽기와 그림15개 검토를 마쳤다. 동산 normal24의 r3 요청은 격리 등록·projection·최종 Consumer24/24/24·실제 RPM/native·범위 보존 검증을 통과했고 PR/main 마감 대기다. 실제 main 운영 마감 전이며, **5번 시험지로 넘어가지 않는다.**

- 저장소: https://github.com/icefoxtail/AP------
- taskId `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner `GPT_ROOT_933015CD0A4F`, instructionRevision2.
- 담당 branch `review/m1-existing-meta-20261113`.
- 최신 확인 main `573fa32804480b2d70f7536b211e240e8d64d5ed`, tree `c2ba60775fc7d1c724d429e0a6eb7545cad96fe7`.
- 직전 원격 재읽기 완료 branch `9eccf682c8569459466703ca844c504cb1939833`, tree `3c7e6e2b5bbbf8914b9e75f7835f79f3b5f82cc3`. 이 문서의 새 게시 SHA는 실제 branch 재읽기와 후속 AWCR에서 확인한다.
- 최신 raw 검증 AWCR r30: file `1V4LG5U6NGOG8Nr6GNmcm6TIZ4VRbXzjf`, SHA256 `80b6685af33f466ce6c60115e2b1de80f3cc0d8fd65292cea2bd24d1ceca01e8`. 공유 의존 마감을 기록한 immutable checkpoint다.

[README.md](README.md)의 전체44장 체크리스트와 [progress.json](progress.json)을 함께 읽는다. 순서는 연도 내림차순 → 학기 내림차순 → 기말 먼저 → 학교명 순서다. 사용자는 한 시험지씩 PR/main까지 마감하며 연속 진행하도록 승인했다.

## 현재 동산24의 정확한 입력과 판단

[진입 기록](04-dongsan-intake.json), [Notion 라우팅](04-dongsan-entry-route.json), [현재 의미 원장 rev2](04-dongsan-semantic-review-rev2.json), [그림15개 열람](04-dongsan-figure-read-evidence.json), [독립 후보 감사](04-dongsan-candidate-independent-check.json)을 재사용한다. 배열 위치로 문항 번호를 추정하지 않고 source.id/sourceOrdinal/metadata/identity의24 UID를 결속했다.

파일명은 `25_동산중_2학기_기말_중1_기출.js`이지만 실제 내용과 현재 metadata는 **2022/M1-1**이다. 파일명 때문에 M1-2로 옮기지 않는다. 기존 단원·소단원·PT는 모두 유지한다. Master에 있는 실제 conceptClusterKey로24개, primary 내부 절차를 독립 개념 결합으로 센 integration23개를 정정한다. Q22의 명시적 두 소문항은 SEQUENTIAL을 유지한다. Q17 양수·음수 조건을 보완한다. 수학 재풀이·정답 검증·수학 FINAL QA가 아니다.

Q22는 기존 PT 아래 `TPL_M1_ALGEBRAIC_EXPRESSION_TRANSLATION_UNIT_QUANTITY_AND_EVALUATION` 하나를 보완한다. 단위량에서 수량식을 세운 뒤 명시적으로 식의 값을 구하는 핵심 단계를 담는다. [17팩 재사용 검색](04-dongsan-q22-native-proposal.json)에433PT/998TPL/531alias와 가까운18개 정의 대조가 있다. Exact RPM23개를 기존 leaf에 연결하는 DIRECT supplement8개를 추가하고, **Q17 RPM ID/path는 null·HOLD·leaf debt**로 유지한다. 기존273 crosswalk와326leaf/24L1/54L2를 보존한다.

정확한 후보 source raw는 `9a631f2376d09ded4c4ca4a8d924ea7f5ba8c3bf3bb8e29adb33e9e4d6bff35f`, blob `eae025e4aa4e2a862c6e7db0a350682da142a086`이다. 정상24 payload·567 보호 literal·15 assets·대상4slot의 기존 독립 감사가 이 바이트에 결속돼 있다. 원문·정답·해설·이미지·UID·배점·난이도·source reviewStatus·4slot을 바꾸지 않는다.

## 실패 기록과 r3 보완 — 기존 guard 유지

첫 로컬 요청에는 자동 파생 L1~L4의 before가 빠져 dry-run에서 거부됐다. [before 보완 근거](04-dongsan-derived-label-preconditions.json)에 따라 helper가24×4 기존 값을 캡처하도록 한 줄 보완했으며 after와 분류 판단은 바꾸지 않았다.

r2는 공식 dry-run/write/build를 통과했으나, [최종 projection 실패](04-dongsan-r2-projection-failure.json)와 [실제 부모 감사](04-dongsan-r2-parent-audit-failure.json)가 **Q17 canonical_parent_missing**을 확인했다. [r2 보호 비교](04-dongsan-r2-isolated-protection.json)는 비대상 metadata/identity28,866행, M1 runtime635행, 타16pack, 이전71문항과 풍덕 outside1 보존을 확인했지만 전체 PASS를 주장하지 않는다. r2는 main에 게시·등록되지 않았다.

Q17 native L2 `좌표평면`과 현재 RPM 중단원 `좌표와 그래프`의 표시명 차이가 원인이다. 실제 main573fa의 `archive/data/basic-scope-parent-links.json`에 `2022/M1-1/M1-04/M1-04-COORDINATE_PLANE → 좌표평면과 그래프/좌표와 그래프`의 유일한 기존 행이 있다. [진단 보완 문서](04-dongsan-q17-parent-link-supplement.json)와 공식 parent-label evidence를 통해 기존 **basicScopeParentRef** 경로로 결속한다. 새 leaf, 잘못된 대체 분류, binding 변경, guard 완화가 아니다. 현재 의미 원장 rev2는 Q17 effectiveParent만 보완했으며 나머지 모든 의미 판단은 기존 원장과 같다.

현재 요청은 **`m1-dongsan-2025-final-meta-review-20261113-r3`**, raw **`575dab859b0e5b419a5f2428f19f0835ce11e236ccb9db5184e5a73dcdd9e0e4`**다. [r3 요청 결속](04-dongsan-r3-request-binding.json)과 [재현 준비 도구](checkpoint-tools/prepare-dongsan-parent-bound-r3.py)는 r2와 before/after24개·registry5개·source blob이 같고 요청ID/Q17 부모 근거/evidence refs만 달라졌음을 확인한다. 원래 공식 registrar SHA `997347340a7dbd1ae05c1f70935aa23a125b9bd7aad3a08a463bd2fb85af55f1`를 유지했다.

## 공유 binding154 의존 — 이미 운영 마감, 재등록 금지

[공유 범위](04-dongsan-binding-course-scope.json)에서154 LINEAR_EQUATION_SOLVING은 동산 Q11–14와 풍덕 Q20 하나를 함께 사용한다. 일반 v2의 외부 승인 보호를 유지하기 위해 이 한 행의 `中1 수학 → 중1 수학` 교정을 먼저 처리했다. 풍덕은 의미 검토 완료로 세지 않는다.

[PR1970](https://github.com/icefoxtail/AP------/pull/1970) → merge `c125a74c57176c72b4908c378c1c0eb8e01ff14c` → actual main `573fa32804480b2d70f7536b211e240e8d64d5ed`에서 마감했다. [운영 마감](04-binding-v2-operational-closeout.json), [writer 근거](04-binding-v2-main-writer-evidence.json), [원격 보호 비교](04-binding-v2-main-protection.json)를 확인한다. Writer43510415775/job132178883256의 exact request APPLIED1/rejected0/pending0, 최종 post-AutoMeta pre-push Consumer5/5/5, runtime659·새승인0, PUSHED1을 확인했다. Receipt raw `dde07d5cdc7bc9290dae8bef62d247c1521e47f54658efd44089e6092660a804`다.

공유 요청 `m1-linear-equation-course-spelling-20261113`은 **소비 완료됐으므로 inbox에 다시 넣지 않는다.** 현재 MIDDLE1은1.0.9/PT95/TPL213/bindings179/runtime659이다. 동산 normal24 요청의 registry5는 **Q22 TPL1 + 동산 내부에만 영향 있는 course spelling151/152/153/155**다. 공유154를 다시 수정하지 않는다. 전역 REGISTRATION_PARTIAL은 기존 optional semantic continuation이며 이 요청 실패를 뜻하지 않는다.

## 완료 항목과 병행 작업 경계

- RPM6권2022 L1/L2 [PR1958](https://github.com/icefoxtail/AP------/pull/1958): 24대단원·54중단원, 기존326leaf 보존·부모9개 정정. `fix/rpm-middle-l1-l2-20261113`에 인계가 있다.
- 신흥2026중간24: [PR1964](https://github.com/icefoxtail/AP------/pull/1964), [마감](01-shinheung-operational-closeout.json). 다른 owner PR1967 이후 source raw `2f1ab79eba940498b5c575ad1509a038b3f2dabd390823177635d83937fe4b56`도 보존했다.
- 왕운2026중간23: [PR1968](https://github.com/icefoxtail/AP------/pull/1968), actual main `738af248bd62813a572ac81725892b3f12ee2beb`, [마감](02-wangun-operational-closeout.json). 의미 원장은 UID/ordinal 정정된 revision3만 쓴다.
- 팔마2026중간24: [PR1969](https://github.com/icefoxtail/AP------/pull/1969), actual main `bf35b7e13417b033ee167117d567a9f0262712d6`, [마감](03-palma-operational-closeout.json). 실제 최종 Consumer24/24/24·대상밖/이전47 보존을 확인했다. Exact19/debt5다.
- 선행 비례 과정명 교정 PR1966도 actual main51cf/Consumer1/1/runtime613 보존으로 마감했다.

소비된 이전 요청을 다시 넣거나 완료된 의미 읽기를 반복하지 않는다. PR1405의 동산4slot24 UID는 main과 item값이 같고 검토 이력만 다르므로 보존한다. PR1751의 중1 실제6요청140 UID와 동산24 교집합0을 확인했다. 다른 owner task `241f49f8-fccb-4880-944e-9814a117b88e`/`GPT_ROOT_BF50408FB63B`의 마지막 확인 r16은 신흥 범위 COMPLETE_DECLARED/NO_NEXT_ACTION이며 임의 인수하지 않는다. PR1959 향림2024는 해당 순서에서 확인한다.

## 다음 실행

새 세션은 연결 Notion 필독 라우터 → Archive 시작/생명주기/메타 정본 라우트, 정확한 AWCR task 최신 revision, 최신 Git main/branch를 먼저 확인한다. 현 세션 동산 진입에서 이미 읽었고 관련 정본 SHA를 확인했다. 바이트가 같으면 이미 끝낸 의미 읽기와 검증을 재사용한다.

격리 공간은 `/workspace/scratch/933015cd0a4f/m1-dongsan-register-r3`, 기준9ecc/actual573이며 r2 공간은 실패 근거로 보존한다. 공식 projection·exact-request Consumer24·실제 RPM/native 부모·범위 보존은 [격리 사전검사](04-dongsan-r3-isolated-preflight.json)에서 통과했다. 입력 바이트가 같은 검사를 반복하지 않고 PR/main의 실제 writer 증거를 확인한다. 실패 전 검사와 수정 후 성공을 구분하며 전체 R1/R2/R3 재실행은 금지한다.

검증 통과 후 **소스3파일·정확 r3 inbox 요청·부모 증거·인계/감사 기록**을 담당 branch에 게시한다. Native/compiled/runtime/공통 metadata 생성물은 공식 writer가 만들며 수동 게시하지 않는다. 정확 head CI → PR merge → 실제 등록 영수증 → 최종 post-AutoMeta Consumer → 원격 SHA·보존 확인 → branch/AWCR immutable revision raw 검증 후에만 **05. 2025 신흥중 기말22**로 이동한다. 전체 workflow SUCCESS만으로 해당 요청 REGISTERED를 추정하지 않는다.

AWCR에는 안전한 상태·증거 참조·SHA·남은 일·nextAction만 저장한다. 원문 문제·정답/해설·credentials·upstream raw는 저장하지 않는다. 새 게시 SHA는 문서 자신의 미래 SHA로 추정하지 말고 실제 원격 재읽기에서 기록한다.

## 복사용 인계 프롬프트

> AP------ 중1 전수 메타 검토를 계속하세요. task f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. 연결 Notion·정확 AWCR r30 이후·최신 Git의 HANDOFF.md/progress.json을 확인하세요. RPM6권 L1/L2(PR1958)와 신흥24·왕운23·팔마24는 운영 완료했으니 반복하지 마세요. 현재3/44완료,95읽기/71운영마감,41장남음. 4번2025동산기말24는 실제2022/M1-1이며 텍스트·그림15 의미검토 완료입니다. 공유 binding154는 PR1970→actual main573fa32804480b2d70f7536b211e240e8d64d5ed에서 소비완료·최종Consumer5/5/5·runtime659보존으로 마감했습니다. 공유요청 재등록과 풍덕 의미완료 집계는 금지합니다. 동산 normal r3 요청은 raw575dab859b0e5b419a5f2428f19f0835ce11e236ccb9db5184e5a73dcdd9e0e4이며 Q17 기존 canonical 부모 근거를 basicScopeParentRef로 명시했습니다. native PT 유지/TPL Q22 하나/cluster24/integration23/condition Q17/RPMexact23·Q17leaf debt, registry는TPL1+내부spelling4입니다. r2 부모연결 실패를 보존했고 rev2 의미원장을 사용합니다. 실제 최신 검사·PR/main 상태를 읽고 남은 단계만 수행하세요. 동산 PR→main writer→영수증/최종Consumer/원격SHA→branch/AWCR 마감 후에만 다음 신흥기말22로 이동하세요.
