# M1S2-20261114-B01-A — 중1 2학기 통합 메타 재정비

## 범위와 보존

- 담당: 정확히 4시험지 95문항. A1은 시험지 1·2, A2는 시험지 3·4를 검토했다.
- Task ID: `6aa566e9-68d9-4735-a152-5db0e40e56d2`; owner: `GPT_ROOT_54CB21AF3005_A`.
- 전용 브랜치: `review/m1-s2-meta-b01-a-20261114`.
- 시작 main: `573fa32804480b2d70f7536b211e240e8d64d5ed`; PR 직전 확인 main: `0603b4c0c32fa8667ba493d0449fdfbb1ba52dea`. 추가 main 커밋은 자동등록 cursor 2파일이며 담당 소스·정본 변경은 없다.
- 최종 소스/compact 원격 체크포인트: `6bd5770cf6059acc08b80b3a3c001077abb18346`.
- 문항 내용·선지·정답·해설·그림 참조·UID를 보존했다. 95개 canonical UID, 보호 payload, 숫자 difficultyBucket 1–5, compact 형식·공식 용어 ID를 기계 검증했다.
- 새 PT/TPL·공통 binding·RPM crosswalk·용어사전 정의는 만들거나 수정하지 않았다. 공통 등록 요청은 `coordinator-requests.json`에 UID와 근거를 기록했다.

## 집계

GAP이 우선인 상호배타적 의미 판정이다. 정상 의미값을 보존하면서 누락 필드만 채운 경우는 KEEP이며, rationale·routing·신규 4칸 추가만으로 CORRECT를 늘리지 않았다. GAP 문항에서도 확정 가능한 교정은 적용했다. 정확한 전후값과 문항별 집계는 `final-counts.json`을 사용한다.

| 시험지 | 문항 | KEEP | CORRECT | GAP | level 교정 | source bucket 값 교정/누락 보완 | PT/TPL 문항(필드) | 4칸 기존 교정/신규 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| 연향중 기말 | 23 | 4 | 13 | 6 | 2 | 1/6 | 6(12) | 7/0 |
| 왕운중 기말 | 24 | 11 | 11 | 2 | 0 | 5/0 | 2(2) | 12/0 |
| 연향중 중간 | 24 | 2 | 13 | 9 | 0 | 1/0 | 2(3) | 0/24 |
| 왕의중 중간 | 24 | 8 | 7 | 9 | 0 | 0/24 | 3(5) | 0/24 |
| 합계 | 95 | 25 | 44 | 26 | 2 | 7/30 | 13(22) | 19/48 |

기존 question_metadata 기준 bucket 차이는 숫자값 교정 11문항, 문자열→숫자 정규화 3문항, UNKNOWN 보완 1문항이다. source bucket 30개 누락 보완과 중복되는 별도 비교이므로 합산하지 않는다. 왕운중 기말 Q23은 그림 근거가 불명확하여 기존 4/상을 유지했다. Q14는 공식 TPL 배정에 맞춰 `l4Disposition=ASSIGNED`를 정합화했다.

## 실제 출제 주제

주개념을 기준으로 각 시험지 번호를 한 번씩 분류했다. 도형이 등장한다는 이유만으로 입체 측정 유형으로 배정하지 않았다.

| 시험지 | 실제 주제 | 문항 번호 | 개수 |
|---|---|---|---:|
| 연향중 기말 | 평각과 이웃한 각 | 2 | 1 |
| 연향중 기말 | 다각형·정다각형의 성질과 각 | 1, 3, 21 | 3 |
| 연향중 기말 | 원·부채꼴의 성질과 측정 | 4, 5, 6, 7, 8, 22 | 6 |
| 연향중 기말 | 다면체·정다면체·회전체의 성질 | 9, 10, 11 | 3 |
| 연향중 기말 | 원뿔 굴리기로 생기는 평면영역 넓이 | 12 | 1 |
| 연향중 기말 | 입체도형의 겉넓이·부피 | 13, 14, 15, 16, 23 | 5 |
| 연향중 기말 | 자료의 정리와 도수 해석 | 17, 19, 20 | 3 |
| 연향중 기말 | 중앙값 | 18 | 1 |
| 왕운중 기말 | 다각형·정다각형과 삼각형 각 | 1, 2, 3, 21 | 4 |
| 왕운중 기말 | 원·부채꼴의 성질과 측정 | 4, 5, 6, 22 | 4 |
| 왕운중 기말 | 다면체·정다면체·회전체의 성질 | 7, 8, 9 | 3 |
| 왕운중 기말 | 입체도형의 겉넓이·부피 | 11, 12, 13, 23 | 4 |
| 왕운중 기말 | 평균·중앙값·최빈값 | 10, 14, 15 | 3 |
| 왕운중 기말 | 줄기·잎/도수분포표/그래프 해석 | 16, 17, 18 | 3 |
| 왕운중 기말 | 상대도수와 집단 인원 비교 | 19, 20, 24 | 3 |
| 연향중 중간 | 좌표와 그래프 | 1, 2, 3, 4 | 4 |
| 연향중 중간 | 정비례와 반비례 | 5, 6, 7, 8, 21 | 5 |
| 연향중 중간 | 기본 도형 | 9, 10, 11, 12, 22 | 5 |
| 연향중 중간 | 위치 관계 | 13, 14, 15, 16, 23 | 5 |
| 연향중 중간 | 작도와 합동 | 17, 18, 19, 20, 24 | 5 |
| 왕의중 중간 | 좌표와 그래프 | 1, 2, 3, 4, 5 | 5 |
| 왕의중 중간 | 정비례와 반비례 | 6, 7, 8, 9, 10, 22 | 6 |
| 왕의중 중간 | 기본 도형 | 11, 12, 13, 21 | 4 |
| 왕의중 중간 | 위치 관계 | 14, 15, 16 | 3 |
| 왕의중 중간 | 작도와 합동 | 17, 18, 19, 20, 23, 24 | 6 |

## 검증 및 등록 경로

- `final-verification.json`: 95문항 보호 payload 불변, UID join 95개 고유, source/compact blob 일치, raw 인용 검사 FAIL 0, 4칸 필수 형식·공식 term ID 검사 통과.
- 다른 작업자의 표본: 시험지1 Q2·7·15, 시험지2 Q6·21·23, 시험지3 Q13·18·22, 시험지4 Q8·18·23. 변경·충돌·난이도 경계는 각 review와 root override 및 integration audit에 별도로 기록했다.
- source validator는 88 VALIDATED/7 FAIL이다. 7 FAIL은 이미 분리한 공식 binding/필수 PT·TPL 공백이며 이를 전체 PASS로 표시하지 않았다. 더 엄격한 exact-course 검사에서는 완전한 ACTIVE PT/TPL pair 90개, exact binding 82개다. HOLD로 표시한 유형 공백도 인계한다.
- 왕운중 기말: `m1s2-b01-a-exam2-native-20261114-r3`, native v2 24문항 공식 dry-run PASS, runtime materialization 24, fingerprint repair 24. 공식 basicScopeParentRef 8개로 기존 부모 선택 24개를 결속했다. r1·r2는 같은 브랜치의 이전 커밋에 보존하며 현재 inbox에는 r3만 둔다.
- 연향중 기말·연향중 중간·왕의중 중간: 각각 difficulty reviewedCorrection 9·2·6 UID 공식 dry-run PASS. 이 17 UID 요청은 난이도 계열 필드만 반영하며 full semantic 등록 완료를 뜻하지 않는다.
- 전체 기존 identity source fingerprint가 현재 보호 payload fingerprint보다 오래되었다. 이 배치가 문제를 바꾼 것이 아니며 native v2가 24개를 공식 경로로 갱신한다. 나머지 71개 full meta 등록은 canonical 공백과 기존 fingerprint 재결속을 해결한 뒤 official registrar로 수행한다. 기존 contentFingerprint 차이는 연향중 기말 Q10, 왕의중 중간 Q14에 별도 표시했다.
- compact 95문항의 runtime은 main의 공식 4slot writer가 생성한다. 공용 metadata/identity/runtime 파일을 수동 편집하지 않았다.
- 최종 판단은 PR 필수 CI 및 main 자동등록 영수증을 확인한 뒤 구분해서 보고한다. 이 문서는 PR 전 검증 기록이며 main 병합·자동등록·Consumer·배포 성공을 미리 주장하지 않는다.
- sparse checkout에 없는 다른 학년 시험지를 요구하는 전역 로컬 검사는 반복하지 않았다. full checkout 필수 CI를 사용한다. 추가 Chrome·Pages 전수검사는 시작하지 않았다.

## 공통 정의 인계

`coordinator-requests.json`은 32개 UID를 분류별 중복 포함하여 연결 공백 16문항(고유 target 14), exact binding 8문항(고유 tuple 7), native 유형 공백 4문항, RPM 세부 leaf 공백 5문항, 용어 후보 7문항/8건, 근거 확인 대기 4문항으로 구분한다. 26 GAP 의미판정에 용어 후보만 있는 문항을 더한 요청 범위이므로 두 숫자는 다른 집계이다.

핵심 인계: 연향중 기말 Q2·12는 기존 다른 유형으로 억지 연결하지 않는다. Q10·11의 `中1 수학`/`중1 수학` exact tuple 불일치와 Q17의 binding/leaf 공백을 분리한다. Q19는 후보 PT binding이 있으나 TPL 적용범위 확인이 필요하다. 왕운중 기말 Q21은 native binding PASS이고 crosswalk만 보완 대상이다. 왕의중 중간 Q8은 유효 PT에 대응하는 TPL 공백, Q23은 주어진 합동의 대응변 활용에 맞는 유형/leaf 공백이다.

## 원격 근거와 다음 작업

원본 인용을 포함한 raw 4칸은 전용 브랜치의 불변 커밋에 보존하고 최종 main tree에는 compact만 남긴다. author review의 로컬 raw 경로는 아래 검증된 historical commit에서 읽는다. 기존 review는 당시 판단의 스냅샷이며 최종 판단/참조는 root applied, cross review, audits 및 final-verification을 우선한다.

| 시험지 | 최종 source blob | raw 근거 commit |
|---|---|---|
| 연향중 기말 | `58499a15b018c4bc13d4e90c9dd630f6a458fe2b` | `27a263a24bb36ea0153e981cadc401a52cf55f6e` |
| 왕운중 기말 | `3b592f8f9c5e04fdf152dc47fed7b5d916937829` | `8837bbab7db868a9552eb372dbcea7a06a56b5ee` |
| 연향중 중간 | `5ea211ca5907ad3706105b7f88f593fbc511c151` | `09f970ab2bbbb78ce9ad1d10cecd4aa3db9aecdb` |
| 왕의중 중간 | `654aa51206cc7eed297cf3c75acc221f1209b25d` | `36d18b5e2ad45381854d38a1061e500a76dd9193` |

정확한 raw path·SHA, 당시 docs raw path, compact hash는 `final-verification.json`에 있다. 전용 원격 브랜치는 squash 병합 후에도 삭제하지 않는다.

다음 실행: 이 배치의 PR 필수 CI → main squash 병합 → 원격 SHA 확인 → 해당 native/difficulty/4slot 등록 영수증 확인 → Consumer·Pages 상태를 별도 확인 → AWCR immutable revision 저장 및 raw SHA 재조회. 네 시험지 밖의 작업은 총괄의 새 배정 전 시작하지 않는다.

## 필수 CI 직접 의존 복구

PR #1974의 첫 CI run `43528778641`은 runtime readiness가 manifest 입력을 변경한 뒤 즉시 이전 해시를 검사하여 중단됐다. main 공식 reviewed writer에 이미 있는 build_db 최대 1회 재생성 절차를 `archive-pr-registration-prepare.mjs`에 동일하게 연결했다. 두 번째 실패는 그대로 전파하며 기존 snapshot·derived scope·native proof·필수 검사를 유지한다.

관련 prepare/proof 회귀검사 28 PASS·0 FAIL·0 SKIP, A2 독립 diff 리뷰 결함 0건. A1이 열린 PR 73개 전부를 대조해 두 CI 파일과의 기존 작업 겹침 0건을 확인했다. 시험지·요청·compact 및 공용 정본/파생 데이터는 이 복구에서 변경하지 않았다. 이 두 CI 파일은 본 배치의 필수 병합 검사를 실행하기 위한 직접 의존 수정이다. 정확한 실패·수정 바이트·검증 근거는 `ci-recovery-verification.json`에 있다. 새 커밋의 원격 CI 결과는 별도로 확인한다.

## 왕운중 기말 native 부모 등록 보정

CI run `43530562918`은 재생성 고정점 검사를 통과한 다음 native Consumer 재검에서 중단됐다. 분리된 24문항 표본 환경의 공식 생성기로 `Q2.curriculumKey` 불일치를 재현했고, native L1/L2가 단원 표시명으로 대체된 22문항의 부모 연결 문제를 확인했다. 기존 source RPM 경로에 정확히 일치하는 공식 basic parent 8행을 그대로 발췌해 immutable r3의 `basicScopeParentRef`로 연결했다. 후보가 둘인 native tuple은 전체 대안과 선택 UID를 근거에 함께 남겼다. 새 키·공통 crosswalk·검증기 변경은 없다. Q1·Q21의 정상 부모와 Q23의 4/상·근거 대기는 유지했다.

공식 dry-run 24 PASS, 분리 표본의 apply/replay 및 `--verify-projection` 24 PASS, changed-UID Consumer 24 changed/24 checked/24 passed·미관측 필드 0을 확인했다. 실제 전체 저장소 필수 CI와 main 등록은 아직 별도 확인 대상이다. 현재 요청·근거는 `root-exam2.native-r3-dryrun.json`, `native-parent-registration-verification.json`, `a2-native-r3-audit.json`을 우선한다. r2 dry-run과 기존 `a2-registration-audit.json`은 원격 커밋 `e8fa8be3b342e73fd11a278c3ce542600d47154f` 당시의 역사 기록이며 r3 Consumer 성공을 대신하지 않는다. source/compact/95문항 검증과 최종 KEEP/CORRECT/GAP 집계는 이 등록 요청 보정으로 바뀌지 않았다.

## 연향중 중간 Q13 부모 게시 교정 보류 — 1문항 5필드

의미 판정은 기본 도형의 공간 위치 관계로 확정되어 있으며 기존 GAP/RPM_LEAF_GAP을 유지한다. CI run `43533869947`에서 공용 metadata/runtime의 예전 입체도형 부모와 교정 source의 기본도형 부모가 충돌한 것이 확인됐다. 현재 공식 단일 UID 부모 전환 경로가 없고, 시험지 전체 native 등록은 Q4·20·21의 별도 binding 공백 때문에 보류되어 있다. 사용자 지시에 따라 이 공유 충돌만 총괄에 인계하고 나머지 확정 변경을 계속 반영한다.

Q13의 `standardUnitKey`, `standardUnit`, `standardUnitOrder`, `subUnitKey`, `subUnit` 다섯 게시 필드만 확인한 main 값으로 유지한다. 기존 입체도형 분류를 올바른 판정으로 인정한 것이 아니다. 올바른 M1-05/POSITION_RELATION 교정안은 원격 `a4e8b1c6972161e71262bef93e434a0bb8021b97`과 `q13-parent-publication-hold.json`에 보존했다. Integration NONE, 유효 PT/TPL, 의미 검토 및 4칸은 유지한다. **95문항 검토 완료와 Q13 부모 게시 교정 보류 1건을 구분하며, 95문항의 메타가 전부 정상화됐다고 주장하지 않는다.**

새 source blob에 raw/compact를 공식 importer로 재결속하고, 난이도 2 UID 요청은 `m1s2-b01-a-exam3-difficulty-20261114-r2`로 발행했다. 이전 r1과 원래 교정안·인용 근거는 전용 브랜치의 고정 커밋에 남아 있다. 동일 공식 생성기와 변경하지 않은 화면 분류 비교를 담당 95문항에 적용해 보류 전 1건/보류 후 0건 불일치를 확인했다. 이 검사는 게시 일관성 확인이며 보류된 부모 교정의 운영 반영 성공을 뜻하지 않는다.

동일 CI job은 15분 17초 뒤 cancelled로 끝났으며, 15분 예산과 부합하지만 공식 annotation을 읽을 수 없어 시간제한 원인은 확정하지 않았다. 기존 전체 검사를 끝낼 실행 예산으로 test job만 30분으로 조정했다. trigger·권한·동시성·검사 명령·판정은 그대로다. 같은 workflow 파일을 변경하는 PR #956의 실제 diff는 trigger paths만 포함해 timeout hunk와 겹치지 않으며 해당 브랜치는 수정하지 않았다. `ci-budget-verification.json`에 관측과 범위를 기록했다.

### 최종 게시 직전 main 재조회

최신 `main`은 `0f638ef02303919e82136e4671d0f9f70db436b1`입니다. 이전 `ed83f05220b64f75cbbd5de360a68dd6ddaadd22` 이후 #1975는 Meta OS 방향 원칙 6을 PT/TPL·4칸으로 확장했고, 등록 코드·정본 키·등록 경로는 그대로임을 명시했습니다. 해당 문서 diff와 writer state 변경을 직접 확인했으며 본 배정 소스·공식 요청과의 충돌은 없습니다. 새 값에 관한 이름·상위·이유는 기존 coordinator 요청 근거에 보존하며, 본 배정의 임의 키 생성 금지 및 공용 정의 담당 분리는 유지합니다.
