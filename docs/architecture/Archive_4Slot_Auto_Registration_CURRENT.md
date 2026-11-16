# 기존 4slot의 main 병합 후 자동 등록 — CURRENT v1

2026-11-05 사용자 승인. **4slot 작성·검수는 진행 중인 별도 라인의 작업을 그대로 사용한다. 다시 작성하거나 PT/TPL에서 추정하지 않는다.**

## 입력과 자동 처리

입력 정본은 `archive/data/item-4slot/**/*.4slot.json`의 기존 `archive-meta-4slot-compact-v1`이다. 별도 inbox 제출 없이 main 병합, 원본/사전 변경, 시간별 누락 복구 때 `Archive Main Auto Metadata`의 4slot 단계가 처리한다. 기존 의미 메타 단계가 실패해도 4slot 처리는 보존한다. 2026-11-06부터 별도 Git writer/job이 아니라 단일 등록 transaction의 마지막 native 단계로 실행하며, 공유 등록 실패 시 보존된 기존 UID 기준으로 독립 결과를 처리한다.

`tools/4slot/build-4slot-runtime.cjs`가 compact 값·사전·검토/근거 참조를 읽고, 실제 source의 문항번호를 배열 순번으로 변환하여 `question_identity_map.json`의 기존 UID에 결속한다. UID를 새로 발명하지 않는다. 사전의 given/goal/method/condition 용어 번호, format, candidates, reviewedBy, evidence를 보존한다. 실제 문항을 다시 읽고 분류하는 AI 호출은 없다.

UID의 권위는 기존 identity 계약의 고유 UID + source 경로 + 배열 순번이다. native identity writer는 기존 행의 과거 sourceFingerprint를 매 수정마다 갱신하지 않으므로, 그 값이 오래되었다는 이유만으로 최신 판본에 결속된 4slot을 무효화하지 않는다. 공용 identity는 바꾸지 않고 `identityFingerprintStatus:HISTORICAL`을 표시한다. 4slot의 최신성은 별도로 compact가 지정한 실제 Git blob 및 문항별 학생 필드 동등성으로 검증한다. UID 중복·명시적 INVALID·문항번호 충돌·현재 source UID 충돌은 계속 거부한다. 기존 의미 메타 등록기의 승인 게이트를 변경한 것이 아니다.

출력은 `archive/data/item-4slot-index.json`과 `.archive-meta-register/auto/4slot/`의 기계 검증 영수증이다. source JS, compact 원본, 작성 브랜치, 정답/해설, 기존 의미 메타 승인에는 쓰지 않는다. `archive/item-4slot.js`는 UID 조회와 슬롯별 용어 검색 API다. 기존 검색 화면·출제 자격을 바꾸지 않는다. 인덱스와 API 제공은 새 검색 UI나 유사도 품질 검수 완료를 뜻하지 않는다.

## 보존·변경·실패

- source blob가 달라도 실제 학생 필드가 같으면 기존 4slot을 재사용한다. 실제 발문·보기·정답·해설·시각 참조가 바뀐 문항만 `STALE_STUDENT_PAYLOAD`로 분리한다. 원본을 되돌리거나 새 해설의 method를 추정하지 않는다.
- 과거 blob를 확보할 수 없고 유효한 저장 baseline도 없으면 `SOURCE_BASELINE_UNAVAILABLE`다. 최신 SHA로 숫자만 바꾸어 통과시키지 않는다.
- 로컬 에셋은 첫 등록 이후 바이트 변경을 감시한다. 원격 R2·시각 품질 검수나 최초 에셋의 과거 판본 검증을 했다고 표시하지 않는다.
- 기존 검수자·표본·근거를 그대로 참조하며 자동 실행을 독립 수학검수로 기록하지 않는다. 사전에 없는 후보는 candidates로 보존하며 임의 번호를 만들지 않는다.
- 문항별 오류는 pending 목록에 남기고 해당 문항만 활성 인덱스에서 제외한다. 정상 문항은 계속 등록한다. `PASS_WITH_SUPPLEMENTS`는 등록된 부분의 기계 검증 성공이고 전체 의미 품질 PASS가 아니다. 4slot 누락/STALE 때문에 학생 문제 접근을 막지 않는다.
- 동일 입력은 바이트 단위 동일 출력이다. writer가 현재 Git의 compact 목록과 입력·builder·출력 digest를 비교하므로 이벤트 누락 후에도 복구한다. 같은 유효 입력은 native 생성·검사를 반복하지 않으며, 변경 또는 미완료가 있으면 기존 builder로 다시 계산·검증한다.
- 파생 인덱스·검증 영수증은 같은 원격 커밋에 저장한다. main 경합 시 기존 non-force push helper가 최신 main에서 다시 만들고 검증한다. 같은 index SHA의 영수증은 덮어쓰지 않는다.

## 운영 경계와 롤백

기존 작성 브랜치 `work/4slot-annotate-v1`의 대량 evidence는 그대로 둔다. 본 단계는 **검수 후 main에 들어온 compact를 자동 등록**하는 단계이지, 미검수 작업 브랜치를 통째로 승인·병합하는 단계가 아니다. 기존 import 도구/검수 절차는 변경하지 않는다.

등록된 인덱스는 배포 명세에서 허용된 경우 읽기 전용 Consumer로 게시한다. 원시 증거·작성 브랜치 전체를 학생 패키지에 넣지 않는다. UI 연결은 별도 확인 범위다.

중단은 `.archive-meta-register/auto/config.json`의 `fourSlotEnabled:false`다. 기존 작성물·등록 결과를 삭제하지 않는다. 수정은 원래 compact의 해당 문항만 고쳐 main에 병합하면 다시 자동 처리한다.

## 명시된 원검토 보류의 운반 (2026-11-15)

완전한 시험지 compact의 한 문항이 원검토에서 명시적으로 보류되었으면 해당 item에 `registrationHold`를 보존한다. 스키마는 `4slot-native-review-hold-v1`이며 UID·배열 순번·원표기 문항번호·compact ordinal, 원검토의 정확한 경로/commit/raw SHA, 보류 사유와 nextAction을 묶는다. 이 필드는 등록 승인을 만들지 않으며 검증된 경우에도 해당 UID를 `EXPLICIT_REVIEW_HOLD` pending으로 남긴다. 전체 시험지 분모와 일반 goal/method·용어 유효성 검사는 그대로 적용한다. 빈칸 허용이나 모호한 `hold: true` 규칙은 없다.

현재 지원되는 원검토는 중1 1학기 `m1-s1-independent-exam-review-v1`의 `PARTIAL_METHOD_EVIDENCE_DEBT` 표본 결정과, 중2 2학기 root-acceptance·review·independent-sample·four-slot 네 문서가 결속한 `SOURCE_EVIDENCE_UNRESOLVED` 결정이다. 중2 보류는 root acceptance에 등록된 unresolved UID/ordinal/fields, review의 `BLOCKED_SOURCE_EVIDENCE`, 독립 검토자 분리와 네 원문 해시를 모두 확인한다. 근거가 누락되거나 달라지면 `INVALID_REGISTRATION_HOLD`로 남기며 등록하지 않는다. 근거 바이트는 캐시 입력과 실행 중 변경 감시에 포함된다.

보류 문항을 제외한 기존 검토 문항은 계속 등록한다. 이 운반 형식은 난도 등록, 전체 의미 메타 승인, 원본 또는 풀이의 수학 검수와 별개다.

## 교정 renderer HOLD 이후의 명시적 메타데이터 운반 (2026-11-16)

중3 2학기의 `m3-s2-renderer-correction-registration-hold-continuity-v1`에 의해 교정 그림과 결속된 기존 HOLD는, 별도 FINAL_QA 메타데이터 등록으로 source에 scope 키가 추가되어도 자동 승인되지 않는다. `m3-s2-renderer-hold-metadata-continuity-v1`은 아래의 한 단계 연속성만 지원한다.

- 공개 immutable candidate의 `M3_REVIEWED_METADATA_V1` manifest와 원 요청은 정확한 source before/after, 전체 문항 분모, 선택 UID/ordinal, 현재 identity를 결속한다. 선택 문항의 `curriculumKey`와 `courseKey` 두 own-field만 absent에서 각각 `2015`, `M3-2`로 추가할 수 있다. 기존 null, 값 교체, 다른 필드, 비선택 문항 변경은 허용하지 않는다.
- 각 선택의 immutable `m3-s2-complete-semantic-review-v1` 원문은 해당 UID/ordinal의 `rpm.sourceComparison.curriculum=2015`와 `scope=M3-2`를 명시해야 한다. 원 after에 모순되는 scope 값이 있으면 거부한다. native source/current source/current metadata 및 candidate base의 immutable 초기 metadata에 이미 있는 curriculum, curriculumKey, courseKey, standardCourse, courseSemester, semester, grade, gradeKey도 이 명시 scope와 일치해야 한다. 초기 행은 UID/source/ordinal과 원 요청 before에도 결속하므로 writer가 파생한 curriculum 값으로 원래의 명시적 null을 숨길 수 없다. 알려진 일치값은 바꾸지 않고 보존하며, null·다른 학년/학기·알 수 없는 alias는 이 named carrier에서만 거부한다. renderer 독립검토를 교육과정 승인으로 사용하지 않는다.
- carrier는 원 corrected HOLD, 그 상태의 compact 전체, candidate manifest/request, materialized source hash, 선택 inventory를 묶는다. 현재 compact에서 달라질 수 있는 것은 source blob 결속 및 두 위치의 동일 `metadataTransportEvidence`/`metadataContinuity` 참조뿐이다. 원 HOLD, 검수자, 모든 슬롯, 학생 payload, 교정 에셋은 그대로여야 한다. 이 carrier를 다음 carrier의 임의 출발점으로 쓰는 chain은 지원하지 않는다.
- official metadata write가 먼저 완료되어 임시 checkout에 생성한 영수증을 읽는다. `verify-hold-metadata-replay.mjs`는 immutable 후보를 공식 materializer의 read-only 모드로 재생하고, 기존 V2의 공식 replay에서 current metadata·identity·runtime·영수증을 검증한다. 각 immutable patch의 native sourceReview도 다시 재생하여 저장된 proof 전체와 일치시킨다. registry 변경은 0이다.
- 이 검사는 catalog/Consumer가 갱신되기 전에도 실행 가능하다. 아직 존재하지 않는 미래 main 영수증 커밋을 요구하지 않는다. 공개된 candidate 입력과 로컬에서 공식 발급된 영수증을 구분하며, 실제 main 등록/배포 확인은 후속 gate이다.
- child 실행은 60초 유한 상한을 사용하고 source/metadata를 쓰지 않는다. typed metadata HOLD는 캐시된 성공을 그대로 재사용하지 않고 매 빌드에서 current 발급 상태를 확인한다. 근거·영수증·marker 삭제, source/asset/승인값 변조, unknown schema/scope/field는 `INVALID_REGISTRATION_HOLD`로 남는다. marker를 함께 숨겨도 원 corrected HOLD의 고정 source와 불일치하므로 기존 경로로 통과할 수 없다.

이 과정에서 새 4slot 승인, 새 의미 판정, 난도 판정, 검토 횟수는 모두 0이다. 메타데이터 요청의 실제 승인 건수와 renderer HOLD 유지 건수를 합산하지 않는다. 검증된 HOLD UID는 여전히 `EXPLICIT_REVIEW_HOLD:SOURCE_RENDERER_CORRECTION_PENDING`이며 등록 인덱스에서 제외한다. 실제 검증 순서는 metadata write → 4slot build → 공식 catalog/readiness/parent closure → typed Consumer이다.
