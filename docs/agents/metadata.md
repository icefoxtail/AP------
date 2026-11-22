# 문항 메타데이터

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT — 새 문항 메타는 최소 한 벌 (2026-11-19, 사용자 승인)

- **작성자가 고르는 것:** `curriculum`(2015/2022), `standardUnitKey`·`subUnitKey`, `rpmPrimaryRecordId`(단수), `problemTypeKey`·`templateKey`, `difficultyBucket`(정수 1~5), `crossConceptKeys`·`conditionKeys`·`integrationPattern`, 4칸(`item-4slot/**` 별도 파일). 식별자와 결속 지문(발문+보기)은 기계가 만든다.
- **도구가 채우는 것:** `rpmL1~rpmL4`는 등록기가 번호의 크로스워크 행에서 채운다(아래 "등록기 최소 한 벌"). 단원·소단원 라벨·순서는 키에서 정해지는 값이므로 마스터 글자를 바꾸지 않는다(하네스가 채우고, 하네스가 없는 라인은 마스터 글자를 그대로 옮긴다).
- **쓰지 않는 것(요청에도 원본 JS에도):** `rpmPrimaryL1~L4`, `rpmPrimary{}`, `rpmPrimaryRecordIds`, `curriculumKey`(=`curriculum`), 맨 `L1~L4`, `ptTplCandidate`, `difficultyBasis`·`levelBasis`, `level`. `originalCategory`는 원본 기출에 적힌 글자만 적고 새 유사·생성 문항은 비운다. 원본 JS에 `level`·`L3` 같은 사본을 쓰면 파생 라벨과 달라 등록기 parity 검사로 거부된다.
- **아직 남은 관문(쓰지 않으면 문제없음):** CI 후보 검사(`tools/ci/archive-reviewed-source-candidate.mjs`)는 허용 목록 밖 필드를 아직 `UNKNOWN_METADATA_FIELD`로 거부한다. 스테이지 검증기는 난이도 보조 3칸(`difficultyConfidence`·`difficultyBoundaryFlag`·`legacyLevelCompatibility`)을 아직 요구하므로 이 셋은 계속 적는다.
- **허용 목록 안 필드를 `after`에 새로 넣을 때는 `before`에 `null`을 같이 쓴다**(CAS 규칙 그대로).
- **금지:** 경로→번호 역산, 번호→TPL 계산, 소단원→L1·L2 계산. 맨 `L1~L4`는 RPM 값과 PT·TPL 라벨이 섞인 칸이므로 기존 값을 비교해 지우거나 옮기지 않는다.
- **받는 쪽과 기존 값은 그대로다.** 화면·빌더·등록기는 옛 이름으로 들어온 값도 계속 받고, 기존 문항 값은 지우지 않는다.
- 이유: 같은 값을 여러 칸에 쓰게 하면 칸끼리 어긋난다(2026-11-18 하/중/상 사고). 줄이는 것은 쓰게 하는 것이지 받는 것이 아니다.

## CURRENT — 원본의 단원 값으로 단원을 못 정한 문항은 승인된 유형이 가리키는 통합 단원으로 묶는다 (2026-11-19 중1, 2026-11-22 중2~고2 확대, 여러 단원이면 좁히고·다수·마지막)

- **무엇:** 카탈로그 빌더가 승인된 유형(`metaHintPT`)이 있는 행에, 그 PT의 ACTIVE 연결(`curriculum_bindings.json`)이 같은 학년에서 가리키는 통합 단원으로 표시 전용 필드 `metaHintUnit`을 싣는다. 하나면 그 단원, 중등은 통합 단원 이름·고등은 통합 단원 키다. 규칙·학년별 켬/끔은 `archive/tools/unit-hint-lib.mjs` 한 곳이다. 통합 단원 층(`archive2-unified-units.js` `unitFor`)은 **원본의 단원 값(키·이름)으로 단원을 정하지 못한 문항에만** 이 값을 쓴다. 정본 RPM 판정, 문항별 중단원 지정표, 원본의 단원 값으로 정해지는 문항은 이 값을 읽지 않는다.
- **여러 단원에 걸치면(사용자 결정 2026-11-22, 학원 원장 + 관제 수정):** 처음 결정은 "가장 마지막 단원"이었으나, 측정해 보니 기존 단원과 22~40%만 맞았다(이 유형들은 "두 단원을 함께 쓰는 문항"이 아니라 "여러 단원에 나오는 유형"). 그래서 아래 순서로 정한다. 1) **좁히기:** 문항에 원본의 옛 대단원 키(예: 중2 `M2-05` 도형의 성질, `M2-01` 수와 식)가 있고 그 키로 연결된 통합 단원들을 알 수 있으면 PT 연결 단원 ∩ 그 단원들로 좁힌다(하나면 그것, 겹침이 없으면 싣지 않는다; 교재 단원 번호 키는 통합 단원 키와 다른 체계라 쓰지 않는다). 2) **다수 단원:** 남은 후보가 여럿이면 같은 학년(고등은 같은 과목)에서 같은 PT를 가진 "이미 단원이 정해진 문항"이 가장 많은 후보 단원, 동률이면 마지막 단원. 3) 후보 안에 이미 정해진 문항이 없으면 통합 단원 프로필(`UnitCore.PROFILES[...].units`) 순서상 마지막 단원. 문항 수는 빌더가 카탈로그를 만들 때 그 자리에서 세며 새 저장 파일·장부는 없다(힌트 없이 통합 단원 층이 정한 단원만 센다). 같은 입력이면 결과가 같다(후보는 프로필 순서, 동률은 마지막). 고등은 문항의 과목 안 단원 중에서만 고르고, 과목을 못 정했거나 그 과목 안에 연결 단원이 없으면 싣지 않는다(다른 과목 단원으로 보내지 않음). 통합 단원으로 못 옮기는 연결은 빼고 옮겨지는 연결만으로 정한다.
- **등록·승인은 아니다:** 정본 메타 행·영수증·`fieldStatus`를 만들지 않고 새 상태값·승인 종류도 없다(`metaHint*`와 같은 표시·선택 전용 길).
- **켜는 기준과 현재 상태(2026-11-22 측정, origin/main 카탈로그):** 학년·과목마다 "이미 단원이 정해진 문항에 같은 규칙을 적용했을 때(자기 자신을 뺀 다수) 기존 단원과 같은 비율"이 70% 이상일 때 켠다. 자기 자신을 뺀 일치율: 중1 84.8%, 중2 97.5%, 중3 97.2%, 고1 74.8%, 고2 75.8%(같은 문항에서 "첫 단원" 규칙은 중1 76%·중2 70%·중3 16%·고1 48%·고2 43%, "마지막 단원"은 22%·22%·83%·36%·38%). 끈 것: 고2 미적분 57.1%(28), 고3 전체(미적분 17.9%). 고2 기하와벡터는 90.5%(42)라 켰고, 고1 수학(하)·과목 공백·고2 공통수학1(표본 작음, 80% 안팎)도 켠 채다. 끈 과목은 `unit-hint-lib.mjs`의 `offSubjects`에 있고, 일치율을 다시 재서 넘으면 풀어 준다. 이유: 유형 연결은 근처 단원과 섞이기 쉬워, 낮은 과목은 학생이 단원별 선택에서 엉뚱한 문항을 만난다.

## 난이도는 정수 1~5만 (2026-11-18 21시 KST부터 적용)

- **적용 시점:** 2026-11-18 21:00 KST 이후 새로 만들거나 반입하는 모든 아카이브 문항(기출·유사·교과서·문제집·생성).
- **규칙:** 난이도는 정수 `difficultyBucket` 1~5만 판정한다. 새 문항에는 `level`(하/중/상)을 쓰지 않는다. 검사기는 `level`이 없으면 통과하고, 있으면 하/중/상만 허용한다.
- **기존 문항:** 그 전에 만들어진 문항의 `level`은 지우지 않고 그대로 두며, 하/중/상에서 정수로 환산하지 않는다.
- **우선순위:** 봉인 문서(룰북 v2.6, difficultyBucket 운영규칙 v1.3 등)의 "level 3단계 유지" 조항보다 이 결정이 새 문항에 우선한다. 봉인 문서는 고치지 않는다. 현행 규칙 전체는 [RULEBOOK_CURRENT.md](../rules/RULEBOOK_CURRENT.md).
- **이유:** 같은 것을 두 번 물어, 작성 모델이 같은 정수에 "중"과 "상"을 섞어 채웠다(두 칸이 어긋남).
- **진행 중(각각 다른 PR):** 옛 `mixer.html`(상/중/하 필터)은 진입 링크를 숨기고, 등록기의 `level` 검사는 삭제한다.

## CURRENT — 메타 결속 지문 범위: 발문과 보기만 본다 (2026-11-18, 사용자 결정)

- **결정:** 검수된 메타를 문항에 묶는 지문(결속)은 발문과 보기(선택지)만 본다. 해설·정답·그림·다른 메타가 바뀌어도 이미 한 판정은 유지하고, 발문·보기가 바뀌는 오류 수정 때만 다시 판정한다. 이유: 해설을 다듬거나 그림을 SVG로 교체하거나 이미지를 다시 자를 때마다 검수된 메타가 무효가 되어 자동 등록 대기가 수천 건 쌓였다. 발문은 처음 정해 두면 웬만해서 바뀌지 않는다.
- **발문의 정의:** `content`, 없으면 `question`, 없으면 `stem` 중 비어 있지 않은 문자열이다(`archive/exam-source-reader.js`의 `readStemForBinding`). 이유: 중등 일부 시험지(63개 파일)는 발문이 `question`에만 있는데 기존 지문은 `content`만 읽어서 그 파일들의 발문 수정이 조용히 통과했다.
- **발문 안의 그림 태그는 지문에서 가린다.** `<img>`·`<svg>`·`<figure>`·`<picture>`를 지우고 빈 `<p></p>`를 지운다. 모든 `<…>`를 지우지 않는다(수식의 `a<b`가 사라져 발문 수정이 가려진다). 보기 앞의 ①~⑩ 기호 한 개는 지문에서 빼되 `1)`·`(1)`·`1.` 같은 번호는 지우지 않는다(`1.5`가 깨진다). 공백·줄바꿈·`<br>` 차이는 같게 본다. 이유: 중등 시험지는 그림이 발문 문자열 안에 들어 있어서 그림 교체가 곧 발문 변경으로 보였다.
- **보기가 그림 안에 든 문항(`choicesEmbeddedInImage`)은 그림이 곧 보기이므로 `image`·`images`를 지문에 포함한다.** 이유: 이 문항은 그림을 바꾸면 보기가 바뀐다.
- **예외 — 그림이 곧 문제·보기인 곳은 그림도 결속에 들어간다:** ① 발문이 그림뿐인 문항(그림 태그를 지우면 글자가 남지 않음) ② 보기 칸이 그림뿐인 문항 ③ 보기가 전부 비었거나 기호(①~⑤ 등)뿐이고 문항에 그림이 있는 경우 ④ `choicesEmbeddedInImage` 문항. 이때는 그림 경로(`image`·`images`, 발문·보기 안 그림 태그의 주소)가 지문에 포함되어, 그림을 바꾸면 재판정 대상이 된다. 서술형(`choices: []`)은 ③에 해당하지 않는다(보기가 없는 것이지 그림이 보기인 것이 아니다). 이유: 그림을 빼면 학생이 보는 문제·보기가 남지 않는 문항에서 그림 교체가 조용히 통과하면 승인된 것과 다른 문제가 나간다(구현: `archive/question-binding.js`, 지문 버전 `text-v1`).
- **승인된 교정 재결속 (2026-11-19):** `entries`(동결)는 "발문·보기가 같다"만 담으므로, 승인된 교정 커밋·PR이 발문·보기를 정식으로 고친 행(공백·표기 `format`, 내용 교정 `content`, 발문·보기는 같고 그림만 바뀐 `figure`)은 같은 파일의 별도 구역 `revisions`(추가 전용)에 남긴다. 항목은 옛 지문 `fp`, 옛 text `from`, 현재 text, 교정 커밋 40자 `commits`, `prs`를 싣고, 도구는 `build-text-binding-rebinds.mjs --revisions <승인목록.tsv> [--write-revisions]`(승인 판단은 사람·관제가 하고 도구는 git 이력으로 옛 지문·옛 text를 기계 확인한 것만 기록)이다. 소비자(`classifyMetaBinding`)는 옛 지문이 행이 들고 있던 값이고 text가 현재 text-v1과 같을 때만 "row"로 인정하므로, 이후 발문·보기가 또 바뀌면 효력이 저절로 사라진다. `--check --against <ref>`는 `entries`는 한 글자도 같게, `revisions`는 기존 항목이 그대로 앞에 있게(추가만) 요구한다. `content` 교정 행의 유형·난이도 판정은 옛 발문 기준이므로 교정 뒤 다시 볼 대상이다(별도 검토 라인). 이유: 정식 교정된 문항이 카탈로그에서 source_release로 빠져 화면·출제에서 사라지는 것을, 동결된 옛 기록을 건드리거나 새 장부를 만들지 않고 막기 위해서다. **같은 (uid, fp)의 나중 항목이 이긴다 (2026-11-19):** 정식 수정으로 같은 지문 키의 text가 다시 바뀐 경우, 도구는 같은 모양의 새 항목을 `revisions` 뒤에 추가할 수 있고(효력 있는 마지막 항목의 text가 현재 text와 같으면 ALREADY_RECORDED로 거절), 읽는 쪽(`text-binding-lib.mjs`의 `rebindHolds`, 카탈로그·등록기·`classifyMetaBinding`이 모두 이 함수를 쓴다)은 같은 키의 마지막 항목만 쓴다. 동결 entries와 키가 겹치면 revisions의 나중 항목이 우선한다. `--check --against`는 기존 항목이 그대로 앞에 있을 것만 요구하고 `--verify-history`는 대체된 옛 항목을 "supersededRevisions"로 세고 건너뛴다. 이유: 옛 기록을 고치거나 새 상태값을 만들지 않고 두 번째 정식 수정을 추가 전용으로 남기기 위해서다.
- **발문·보기를 고친 작업은 결속까지 같은 작업 안에서 마무리한다 (2026-11-19, 사용자 지시).** 발문·보기(또는 그림이 곧 문제·보기인 문항의 그림)를 고치는 PR은 바뀐 행 목록(questionUid)을 함께 내고, 병합과 같은 묶음에서 둘 중 하나를 끝낸다. ① 수학 내용이 같은 정식 수정(원문 복원·오탈자·표기·최소 수정)은 `build-text-binding-rebinds.mjs --revisions`로 새 지문을 재결속 기록에 추가한다(추가 전용, 같은 문항은 나중 기록이 이긴다). ② 문제가 실질적으로 달라진 행(정답·요구·조건이 바뀜)은 재결속하지 않고 유형·난이도를 다시 판정해 등록한다. 어느 쪽인지 정하지 못한 행은 목록에 남겨 보고한다. 이유: 자동 등록기와 카탈로그는 발문·보기 결속이 확인되지 않는 행을 계속 거절하므로, 수리만 하고 지문을 갱신하지 않으면 그 문항은 유형·난이도가 붙지 않은 채로 남는다.
- **적용 범위는 메타 결속뿐이다.** 저장한 문제지·출제본의 무결성 지문과 4칸의 출처 지문은 이 결정과 별개이고 지금 그대로다. 기존 영수증·identity 기록·메타 행·런타임은 고치지 않고, 소급 적용은 "재결속 장부"를 새 파일로 추가하는 방식으로 한다. 이유: 승인 기록은 사후에 고쳐 쓰지 않는다.
- **이 문서는 결정의 기록이다.** 구현은 후속 PR로 단계별로 들어온다(텍스트 지문 모듈 `archive/question-binding.js` → 재결속 장부 → 등록기 → 카탈로그). 그 전까지 등록기·카탈로그의 동작은 바뀌지 않았다.
- **구현 상태 (2026-11-18):** ① 텍스트 지문 모듈 `archive/question-binding.js`. ② **카탈로그**(`build-archive2-catalog.mjs`, 판정은 `archive/tools/meta-foundation/text-binding-lib.mjs`의 `classifyMetaBinding` 한 곳): `metaBinding`은 값 하나("text" 또는 빔) — "이 행의 메타가 지금과 같은 발문+보기에 대한 것인가"다. 근거는 행의 내용 지문 일치, 동결된 재결속 기록, 유형 판정 자신의 지문(`typeApproval.textBindingFingerprint`)이고, 유형 판정만 근거일 때는 PT/TPL만 내고 L3·교육과정은 뺀다. 화면 반영은 등록 스냅숏(카탈로그 재생성)이 돈 뒤다. ③ **재결속 기록** `archive/data/meta-foundation/text-binding-rebinds.v1.json`은 옛 기록(영수증·identity)용으로 git 이력에서 1회 계산한 결과이며 **동결**되어 더 자라지 않는다(도구 `build-text-binding-rebinds.mjs`: `--write`는 파일이 있으면 거절, `--check --against <ref>`는 기준 ref와 같아야 통과). 발문·보기가 바뀐 문항과 이력에서 못 찾은 문항은 기록하지 않는다. ④ 새 유형 판정은 `typeApproval.textBindingFingerprint`(text-v1)를 직접 싣는다. 자동 등록 레인(`auto-register-merged-source.mjs`)은 이 변경 범위 밖이다(접힌 `metaBinding`에 맞춘 verify 한 줄만 바꿨다). ⑤ 카탈로그의 `sourceStatus`·기본 배정(`verifiedBasicAssignment`)·표시 투영(`createSourceBoundDisplayProjection`의 `textBound`)도 같은 기준을 쓴다: 행 결속(`classifyMetaBinding`이 "row")이 확인된 행은 해설·정답·그림이 바뀌어도 통과하고, 유형 판정만 묶인 행("type")·결속 없는 행은 이전처럼 걸린다. 이유: 해설만 고친 문항이 문제지 만들기 기본 선택에서 사라지지 않게 하기 위해서다.
- **자동 등록 레인도 발문·보기로 결속을 본다 (2026-11-19).** `auto-register-merged-source.mjs`의 `IDENTITY_SOURCE_FINGERPRINT_MISMATCH`·`METADATA_SOURCE_FINGERPRINT_CONFLICT` 거절 조건을 전체 지문에서 "행이 지금과 같은 발문·보기에 묶여 있는가"(`classifyMetaBinding`이 `row`: 행의 내용 지문 일치 또는 동결된 재결속 기록)로 바꿨다. 지문이 전부 일치하는 행은 전과 같이 통과하고, 확인되지 않은 행·유형 판정(`type`)만 묶인 행은 같은 사유로 계속 거절한다. identity의 전체 지문은 감사용으로만 두고 이번에 갱신하지 않는다. identity가 낡은 행을 등록할 때는 행의 전체 지문도 그대로 두고 내용 지문만 현재로 바꾼다(행≠identity 어긋남이 생기면 FINAL_QA·난이도 등록 길이 divergence로 거절한다). 이유: 해설·정답만 고쳐도 그 문항의 자동 등록이 영구히 막혔다(등록 대기 13,229건 중 3,713건이 이 사유였다).
- **재결속 기록의 추가 전용 검사는 merge-base 기준이다 (2026-11-19).** `build-text-binding-rebinds.mjs --check --against <ref> --merge-base`는 기준을 ref의 최신 파일이 아니라 HEAD와 ref의 merge-base 시점 파일로 삼는다(`entries`는 그대로, `revisions`는 앞부분 그대로, 뒤에 추가만 허용). 이유: 기준 브랜치가 재결속 기록을 늘릴 때마다 그 전에 갈라진 모든 PR의 `test`가 "기존 항목이 다르다"로 헛실패했다. 이 PR이 고친 기존 항목은 PR 단계에서 그대로 잡힌다. merge-base를 못 구하면 `BASE_UNAVAILABLE`로 표시한다(조용한 통과 아님).

## CURRENT — 단일 모델 초안 등급: 비어 있는 메타는 모델 하나로 빨리 채우고 초안으로 표시한다 (2026-11-18, 사용자 결정)

- **값이 있으면 쓴다.** 막는 것은 실제 결함뿐이다(없는 키, 학년·과목 불일치, 발문·보기가 바뀐 문항). 이유: 사용자 결정(2026-11-18) "최대한 많은 유형을 최대한 많이 활용하는 거야." "첫 번째 작업자의 결과값이 있으면 충분히 사용할 수 있게 하고, 나중에 토큰 여유가 있으면 두 번째 딥시크를 띄우면 그게 독립이니 그렇게 판단하면 된다. 무조건 안 되는 건 절대 안 돼. 있으면 사용이야."
- **결정("그래. 일단 채우자."):** 비어 있는 메타(유형 키·난이도·라벨 등)는 교차 검증 없이 모델 하나(`opencode-go/deepseek-v4.1-flash`)가 판정해 빨리 채운다. 이 값은 **검수 전 초안 등급**이다. 검수 값과 구분되는 초안 등급 표시를 붙인다. 이유: 등록 대기 약 13,000건을 두 번 독립 판정으로는 감당할 수 없고, 문제지 선정 품질에는 초안이라도 있는 편이 낫다.
- **이 범위의 예외다.** 아래 "판정은 두 번, 서로 보지 않고 한다"와 "난이도 값은 고치지 않는다(추정해 바꾸지 않는다)" 조항, 그리고 추정 메타값 금지는 이 초안 등급 범위에서만 적용하지 않는다. 그 밖의 경로(검수 값으로 등록, 이미 두 번 판정한 값의 변경)는 그대로다.
- **지키는 것:** 등록부에 실제로 있는 키만 쓴다 / 학년·과목이 맞는다 / 기계 검사는 그대로 통과해야 한다. 이미 승인된 값은 덮어쓰지 않는다(빈 칸만 채운다). 맞는 키가 없으면 가까운 키에 붙이거나 추정하지 않고 위 "확장 원칙"대로 정식 `registryChanges`로 새 키를 만든다. 이유: 초안이라도 존재하지 않는 키나 다른 학년 키가 들어가면 화면의 필터와 설명이 틀린다.
- **초안 등급 표시와 승격:** 초안 값도 문제 선정·필터·화면에 그대로 쓴다. 초안 등급 표시는 얼마나 확인됐는지를 알려 주는 꼬리표이며 사용을 막는 조건이 아니다. 집계 보고에서만 검수 값과 구분해 센다. 초안 표시 필드는 표시 전용이며 선정 가능(selectable/usable) 판정에 넣지 않는다. 표시의 필드 이름·값은 후속 PR에서 정한다(이 문서는 이름을 확정하지 않는다). 두 번째 독립 판정(같은 종류의 모델을 따로 띄운 것도 독립으로 본다)과 일치하면 등급을 올린다. 승격은 선택이며 사용의 전제가 아니다. 두 번째 판정은 토큰 여유가 있을 때 돌린다.
- **표시 이름(확정, 2026-11-18):** 요청의 승인 종류는 `DRAFT_SINGLE_MODEL`, 행의 칸별 상태는 `fieldStatus.<칸>` = `draft_single_model`이다. 이 둘 외에 새 상태값·필드·영수증 종류는 만들지 않는다(사전: `archive/data/meta-os/status-vocabulary.json`). 결속은 발문+보기 지문(`archive/question-binding.js` text-v1) 하나다.
- **난이도 초안 요청의 결속(2026-11-19):** 요청 항목마다 판정 당시 발문+보기 지문 `textBindingFingerprint`가 실려 있고, 난이도 등록기는 이것을 현재 문항의 text-v1 지문과 대조해 다르면 그 요청을 거절한다(dry-run·write·verify-projection 동일; 해설·정답·그림 수정은 지문이 같아 통과). 요청의 **모든 항목**에 이 지문이 실려 있는 `DRAFT_SINGLE_MODEL` 요청은 시험지 파일 전체 blob(`latestBlobSha`) 비교를 하지 않는다(`isTextBoundDraft`, 등록기·PR 미리 검증·소비자 게이트가 같은 판정). 이유: 같은 시험지의 다른 문항 해설·그림이 고쳐졌다는 이유로 요청 전체가 거절되던 것을 없애고, 막는 것을 "발문·보기가 바뀐 문항"이라는 실제 결함으로 좁히기 위해서다. 다른 승인 종류나 지문 없는 항목이 섞인 요청은 파일 blob 비교가 그대로다.
- **운영 순서 확인(2026-11-19):** 난이도 초안 요청을 만든 뒤 같은 시험지의 다른 문항 해설 한 글자를 바꾸고 `tools/ci/reviewed-meta-register-pass.sh`를 끝까지 돌리면 등록·투영 검증·소비자 검증이 모두 통과해야 한다(요청 1개로 확인함). 시험지에 이미 실제 난이도 값(초안 값과 다른 숫자·확신도·경계)이 적힌 문항은 요청에서 뺀다 — 이 길은 빈 칸 채우기만 하고, 그런 행은 소비자 검증이 막는다.

## CURRENT — 유형(PT/TPL) 판정은 직접 판정 결과를 정본으로 받는다 (2026-11-17, 사용자 결정)

이 절이 아래 "빈 메타 총정리"·"실행 방식"·"REVIEW2" 절의 유형 관련 문구보다 우선한다. 난이도·단원·소단원은 아래 절 그대로다(두 번 독립 판정).

- **유형에는 "두 판정이 일치한 것만 등록"을 요구하지 않는다.** 문항·해설·그림을 읽고 해설의 결정적 풀이 단계를 한 문장으로 적은 직접 판정 한 번이 정식 값이다. 다른 판정 줄은 문턱이 아니라 품질 대조용이다. 이유: 유형이 비어 있는 문항이 1만 5천 개가 넘고, 판정 속도와 근거 품질이 충분한 작업자가 생겼다. 엄격한 문턱보다 모든 문항을 쓸 수 있게 하는 것이 목표다.
- **지키는 것은 세 가지:** 근거 문장 없이 채우지 않는다 / 고른 키가 레지스트리에 ACTIVE다 / TPL의 상위가 고른 PT다.
- **도구는 확인용이지 문턱이 아니다.** 후보 조회 도구가 후보를 못 주거나(단원 연결 없음) 검사가 통과시키지 못해도 판정을 보류로 낮추지 않는다. 판정은 읽은 대로 적고 검사 결과는 따로 적는다. 보류는 문항·그림이 없거나 근거가 없어 판단 자체가 안 될 때만 쓴다.
- **PT만 맞으면 PT만 먼저 채운다.** 맞는 TPL이 없으면 TPL은 새 키 제안으로 남긴다.
- **새 키는 막지 않는다.** 비슷한 키가 이미 있는지 엄격히 가리느라 붙들지 않고, 만든 키마다 이름·정의·해당 문항을 남긴다. 뜻이 비슷한 유형은 나중에 묶음표로 하나로 본다(소단원 묶음표와 같은 방식, 키는 그대로 두고 묶음만 얹는다). 키·연결 표 파일 수정은 PR로만 올린다(`docs/agents/common.md` "공유 데이터 고정값").
- **새 키의 생성 규칙과 도구 (NEW_KEY 묶음표 → 등록 요청):** 묶음표(`data/type-bundles-20261117`의 `new-pt-bundles.json`·`new-pt-assign.jsonl`·`new-tpl-bundles.json`·`new-tpl-assign.jsonl`)의 묶음 하나가 새 키 하나다. 키는 묶음 id에서 결정적으로 만든다: `NPT_<과정>_<이름>` → `PT_<과정>_<이름>`, `NTPL_<과정>_<이름>` → `TPL_<과정>_<이름>`(과정 접두는 묶음 id 안에 있다). 한 번 나간 키는 바꾸지 않고 같은 입력은 같은 키를 낸다. 이름(`canonicalLabelKo`)·정의는 묶음표의 한글 `nameKo`·`definition` 그대로다. `absorbInto`가 있는 묶음은 그 기존 키를 쓰고 키를 만들지 않으며, 만든 키가 이미 등록부에 있고 상위가 같으면 새로 만들지 않고 그 키를 쓴다. 변환기 `build-type-judgment-requests.mjs`에 `--bundles <git ref> [--bundles-only]`를 주면 NEW_KEY 줄(과 새 TPL이 필요한 PT-only 줄)이 위 키의 PICK 줄로 바뀌고, 쓰인 키마다 기존 추가 전용 `registryChanges`(problemTypes/templates/bindings, 필요하면 pack 범위 추가)가 가장 먼저 정렬되는 요청(`tc-…`)에 실린다. 새 상태값·필드·영수증 종류는 없다. 새 PT의 소유 pack은 묶음 문항 단원에 이미 바인딩이 가장 많은 pack(없으면 과정에 바인딩이 가장 많은 pack), 바인딩은 문항 자신의 단원·소단원(태그 마스터에 있는 것, 과정·교육과정마다 최대 3쌍)이다. `--replace-draft-types`를 주면 유형 칸에 임시값(빈 상태·`manual_review_pending`·`projection_unmaterialized`, 등록기가 이미 덮어쓰기를 받는 상태)이 있고 dots 값과 다른 문항은 별도 요청(`tr-…`, 빈 칸 등록보다 뒤에 정렬)으로 교체하고, 승인값·`r2e_adjudicated` 등은 유지하며 `TYPE_KEPT_DIFFERS_FROM_JUDGMENT`(기존·판정 값 포함)로 `--skipped-out` 목록에 남긴다. `--max-requests N`은 등록 순서대로 앞의 N개만 써서 한 묶음으로 올린다(다음 묶음은 앞 묶음이 등록된 main에서 같은 명령을 다시 돌린다). 구현 `archive/tools/meta-foundation/new-type-keys.mjs`, 테스트 `tests/archive-new-type-keys.test.mjs`. 이유: 새 키 판정 3천여 줄이 키가 없어 유형으로 고를 수 없었고, 같은 묶음이 항상 같은 키가 되어야 다시 생성해도 요청이 어긋나지 않는다.
- **범위와 결과 위치:** 원본 기출·유사·교과서 문항의 유형 판정은 한 작업 줄이 전체를 맡는다. 결과표는 운반용 브랜치 `data/type-judgment-c-20261116`(중등)·`-d-`(고등)·`-t-`(교과서)의 `docs/plans/archive-one-route-upgrade/type-results-*/`에 문항당 한 줄로 쌓인다. 다른 줄이 같은 문항을 판정하기 전에 여기를 먼저 본다. 유사 문항이 원본과 풀이 유형이 같으면 원본의 판정을 이어 쓴다.
- **규칙이 바뀌면 같은 날 이 문서를 고쳐 `main`에 올린다.** 이유: 2026-11-16 밤, 잠금 해제가 문서에 반영된 뒤에도 다른 작업 줄이 "공식 도구 결과만·두 판정 일치만"이라는 옛 문구로 유형 작업을 시작했다.
- **유형만 등록하는 요청 (`approval.type: "DIRECT_JUDGMENT"`, 2026-11-17).** v2 요청 형식에 `scope: "PARTIAL_UIDS"`, `fieldScope: "TYPE_ONLY"`를 붙이고, 문항마다 `before`/`after`에 `problemTypeKey`·`templateKey`만 적는다(TPL이 없으면 PT만). 필수 증거: 문항별 `rationale`(결정적 풀이 단계 한 문장)·`judgedFingerprints`(판정 때 읽은 지문)·`scope`(과목·교육과정), 요청의 `approval.judge`·`decisionRef`(이 절의 제목)·`resultSource`(결과표 브랜치·커밋·파일)이고 `reviewPassCount`는 1이다. 등록기는 `problemTypeKey`·`templateKey`·`fieldStatus.problemType/template`(= `approved_direct_judgment`)·`typeApproval`만 쓰고, 단원·소단원·난이도·교차개념·조건·결합패턴·RPM 경로와 행 상태는 읽어 승인하지도 쓰지도 않는다(요청에 그 칸이 있으면 거부). 이미 승인된 유형은 덮어쓰지 않고 승인 전 값만 바꾼다. PT/TPL ACTIVE·TPL 상위·과목·교육과정별 ACTIVE 연결·`before` 일치·원본 blob 결속은 그대로 엄격하다. 새 키는 같은 요청의 `registryChanges`(추가 전용 problemTypes/templates/bindings)로 넣고, 같은 새 키를 쓰는 요청이 여럿이면 그 키를 만드는 요청 파일 이름이 먼저 정렬되게 한다. 영수증은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/<requestId>.json`(`fieldScope: "TYPE_ONLY"`)이다. 구현 `archive/tools/meta-foundation/register-type-judgment.mjs`, 테스트 `tests/archive-type-judgment-registration.test.mjs`. 이유: 기존 v2 요청은 단원·난이도·교차개념까지 한꺼번에 승인해서, 유형 판정이 끝난 문항도 다른 칸이 승인 전이면 요청이 되지 못했다.
- **유형 전용 요청의 한계(알고 쓴다):** (1) 행의 지문(stem·보기·그림)이 현재 원본과 달라 `rowBinding`이 `stale`인 행도, 판정이 현재 발문·보기에 대한 것이면(`typeApproval.textBindingFingerprint`가 현재 text-v1과 같거나 판정 당시 내용 지문이 현재와 같음) 카탈로그가 PT/TPL을 보여준다(아래 "메타 결속 지문 범위" 구현 상태). 원본의 해설·정답만 바뀐 `content` 행은 원래 보인다. (2) 영수증이 있는 행(`metadataApprovalType`이 있는 행)과 분류 HOLD 행은 이 길로 받지 않는다. (3) 학생 화면에서는 유형 필터·"승인" 표시(메타 힌트 길)로 보이고, 단원·소단원·RPM 경로 승인이 필요한 L3/L4 엄격 길은 그대로다.
- **키의 과정이 시험지 학년 이하이면 받는다 (`reach`, 2026-11-19, 사용자 결정 "교육과정 이동 시켜서 메타 완성시켜").** 행의 과정과 키의 과정이 달라도, 키 과정의 학년이 max(행 과정 학년, 시험지 경로 학년) 이하이면 변환기(`chooseScope`)와 등록기(`course-aliases.mjs`의 `reach()`)가 받고 영수증 `typeApproval.scope`에 `rowCourse`·`courseRelation: "reach"`를 남긴다(같은 과정·별칭·후속은 전과 같고 먼저 본다). 시험지 학년보다 높은 학년의 키는 계속 거부한다(같은 학년 키로 다시 판정). 위로 옮겨 간 단원(2009 개정 중3 좌표 거리·최단거리 → 2022 공통수학2)만 `course-aliases.v1.json`의 `courseMoves`(추가 전용, PT·행 학년·키 학년·시험지 연도 상한)로 따로 받는다. 행의 과정·단원 필드는 옮기지 않는다(화면의 유형 선택은 PT만 읽고, 단원별 배치는 행의 단원 필드와 시험지 학년으로 하기 때문). 이유: 교육과정 개편으로 단원이 아래 학년으로 옮겨 가거나 시험지가 낮은 학년 내용을 쓰는 문항 약 260건이 과정 불일치로 거부되고 있었다. 주의: 이 규칙은 형식 검사만 넓히므로 천장 이하 학년의 틀린 키도 형식상 통과한다. 키가 문항에 맞는지는 내용 판정(결정 단계 근거 문장·발문·보기 결속)이 지키는 안전장치다.
- **유형 전용 요청은 문항의 발문+보기에만 묶인다 (2026-11-18).** 요청 항목마다 `textBindingFingerprint`(text-v1: 발문+보기, 판정 시점 문항 기준)가 필수이고, 등록기는 현재 문항의 text-v1과 비교해 다르면 요청 전체를 거절한다(레인이 요청 단위로 전부-아니면-전무라서. 변환기 `build-type-judgment-requests.mjs`는 판정 시점 원본(`--judged-base auto`, 기본)과 비교해 발문·보기가 바뀐 문항도 빼지 않는다: 2026-11-22 학원 원장 결정으로, 발문·보기가 판정 뒤 바뀌었어도(최소 수정) 유형은 그대로 쓰고 요청은 현재 발문·보기에 묶는다. 바뀐 문항은 요약 `judgedBaseCheck.changedKept`와 증거 원장 줄의 `stemChangedSinceJudgment`로 남고, 판정 시점 원본을 못 찾은 "미확인"은 `judgedBaseCheck.unverified`에 건수가 나온다). 시험지 파일의 blob(`expectedSourceBlobSha1`)·`judgedFingerprints`·그림·해설·정답은 비교하지 않는다. 이미 등록된 요청의 재생(replay)은 이후 파일이 바뀌어도 깨지지 않는다. 이유: 그림 참조만 바뀐 시험지의 유형 요청이 blob 불일치로 거부되어 요청을 다시 만들어야 했다.
- **남은 blob 비교 지점도 발문+보기로 옮김 (2026-11-20).** ① REVIEW2·FINAL_QA 검토 요청(`reviewed-exam-registration-v2.mjs`, 소비자 게이트 `verify-changed-uid-consumer-approval.mjs`, PR 미리 검증 `archive-pr-native-preview.mjs`가 같은 판정 `text-binding-lib.mjs`의 `reviewedSourceTextUnchanged`를 쓴다): `expectedSourceBlobSha1`이 현재 파일과 달라도, 요청이 다루는 문항의 text-v1(발문+보기, 그림이 곧 발문·보기인 문항은 그림 경로 포함)이 요청이 고정한 옛 blob(git에서 읽음)과 같으면 같은 문제로 보고 통과한다. 발문·보기가 다르거나 문항 수가 다르거나 옛 blob을 git에서 못 읽으면 전과 같이 `source Git blob drift`로 거절한다. META_PIPELINE_AUDIT·승인 보존·재결속 등 다른 승인 종류는 증거가 파일 전체 sha256을 직접 가리키므로 blob 비교를 그대로 둔다. ② 시험지별 부모 연결(`exam-scoped/*.parent-links.json`, 빌더 `build-basic-scope-parent-links.mjs`와 소비자 게이트): 파일 blob 비교를 없앴다. 연결은 문항마다 `sourceBodyFingerprint`(발문+보기+그림, text-v1보다 엄격)로 이미 묶여 있고 그 검사가 그대로 거절한다. `expectedSourceBlobSha1` 필드는 참고용이다. ③ diff5 테스트 픽스처는 운영 시험지 blob을 고정하지 않고 테스트가 시작할 때 현재 파일의 LF blob으로 맞춘다. 이유: 해설 그림만 게시해도 파일 blob이 바뀌어, CI가 빨개지면 사람이 세 곳(diff5 픽스처, parent-links, inbox 요청과 approval-note)의 blob을 손으로 다시 맞추는 PR을 따로 만들었다(c2ece4b76f, b4c6e60e5e, c74ed2af63 등). 막는 것은 학생이 보는 발문·보기가 바뀐 실제 결함뿐이다.

## CURRENT — PT/TPL 이름의 굵기: 단어 위주로 단순하게, 세부는 조건·결합 개념으로 (2026-11-17, 사용자 결정)

새 PT·TPL을 제안·생성·묶을 때와 유형을 판정할 때 모든 작업자(기출·유사·교과서·ALIVE, 사람·모델 공통)가 따른다. 위 "직접 판정" 절과 아래 "확장 원칙" 절에 더해 적용한다.

- **PT는 개념 단어 하나다.** 교과서 소단원·핵심 개념 굵기의 짧은 명사구로 짓는다(예: 순환소수, 근의 공식, 무게중심, 지수법칙). 이름에 조건·상황·풀이 절차를 넣지 않는다("연립방정식의 해를 대입한 미정계수 결정", "부등식의 해로 계수관계 복원" 같은 이름은 PT가 아니다). 한 PT에 수십~수백 문항이 모이는 것이 정상이다.
- **TPL은 그 개념 안에서 묻는 것 한 단어다.** 한 단계만 더 나눈다(예: 순환소수 → 유한소수 판별 / 분수로 변환 / 자릿수 찾기). 한 PT 아래 TPL은 보통 몇 개다.
- **그 밖의 세부는 PT/TPL이 아니라 Condition·CrossConcept에 적는다.** 미정계수가 있다, 해의 조건이 주어진다, 도형과 결합한다, 문장제다, 다른 단원 개념이 함께 쓰인다 같은 것이다. 맞는 Condition·CrossConcept 키가 없으면 아래 "확장 원칙"대로 새로 만든다.
- **판단 기준:** 이름을 수학 교사에게 한 단어로 말했을 때 어떤 문항들인지 바로 떠오르는가. 떠오르지 않을 만큼 길거나 좁으면 TPL이나 조건·결합 개념으로 내린다. 기존 사전의 굵기(`PT_M3_POLY_FACTORIZATION`, `PT_CIRCLE_TANGENT`, `PT_BINOMIAL_DISTRIBUTION`)에 맞춘다.
- **새 키 제안은 기계가 읽는 묶음표로 낸다.** 보고서의 글이 아니라 묶음 목록(묶음 id·이름·정의·기존 키로 흡수할지)과 문항별 대응표(uid → 묶음, 조건·결합 개념 꼬리표)를 파일로 남긴다. 같은 개념을 작업 줄마다 다른 이름으로 제안하지 않도록, 제안 전에 기존 묶음표를 먼저 본다.
- **판정 지시서에는 이 굵기를 처음부터 적는다.**
- 이유: 2026-11-16~17 유형 직접 판정(23,913줄)에서 새 PT 제안 3,196줄이 서로 다른 이름 707개로 갈렸고 그 절반이 1건뿐이었다. 지시서에 이름의 굵기가 없어서 조건과 절차가 PT 이름에 들어갔다. 사전의 첫 설계는 "PT/TPL은 단어 위주로 단순하게, 나머지는 CrossConcept 등 추가 메타로"였고, 유형의 쓰임(학교 시험지와 유형이 닮은 문항으로 다시 뽑기)은 같은 유형 문항이 한 묶음으로 모여야 성립한다.

## CURRENT — 공유 크로스워크는 추가만 한다 / 통파일 해시 고정은 봉인 영수증 + 행 검사로만 허용 (2026-11-03, 사용자 결정 A안)

- `archive/data/meta-foundation/crosswalks/**`는 다른 세션이 계속 행을 덧붙이는 공유 파일이다. 승인된 Generated Meta가 박아 둔 파일 통해시(`rpmDraftAuthoritySha256`, `rpmAuthoritySha256`)는 이 파일이 자라면 달라진다. 가드는 고정된 옛 해시를 (1) 봉인된 영수증(`archive/tools/sealed-crosswalk-digests.cjs`)이 같은 파일에 대해 기록한 해시이고 (2) Meta가 가리키는 행이 현재 파일에 그대로 있을 때(코스·단원·소단원·L1~L3, 생성 L4가 아니면 L4 라벨 일치)만 받는다. 어느 쪽이든 어긋나면 그대로 실패시킨다. 승인·영수증·학생 화면 내용은 고치지 않는다.
- `auto-register-approved-qid9.mjs`는 기존 승인 기록을 "다시 계산한 Meta와 크로스워크 해시 필드만 다르다"(해시를 같게 맞춘 정규화 비교) + 위 두 조건일 때만 변경 없음으로 넘긴다. 소스 샤드·시각 결속·샤드 드리프트·중복 검사는 그대로다. 새 가드를 만들 때도 통해시 동일성 대신 이 방식을 쓴다.
- 이유: 2026-11-03 f8e9ca610(고1 2학기 기말 유사 5건의 크로스워크 행 추가)이 `high1.json` 통해시를 바꿔 승인 Palma UID 약 171건의 Meta가 옛 해시를 가리키게 됐고, 학생 내용은 그대로인데 CI(`EXISTING_APPROVED_UID_REQUIRES_PINPOINT_REPAIR`)와 학생 사이트 배포가 막혔다. 이 때문에 봉인을 영수증 2개에 손으로 두지 않고 아래 레지스트리로 자동화했다(2026-11-03 사용자 승인).
- **봉인 레지스트리:** `archive/data/meta-foundation/crosswalks/sealed-digests.v1.json`(추가 전용, 항목 = path·sha256·gitBlobSha1·sealedAt·sealedBy·reason). `crosswalkDigestAccepted`는 현재 해시, 영수증, 레지스트리에 같은 경로로 봉인된 해시만 받는다(경로가 다르면 불가). 레지스트리가 깨지면(중복·형식 오류·`crosswalks/` 밖 경로) 실패 쪽으로 닫는다.
- **등록 때 자동 봉인:** Meta에 통해시를 박는 도구(`register-approved-generated-meta.mjs`, 이를 부르는 `auto-register-approved-qid9.mjs`, `backfill-generated-meta.cjs`, `build-generated-meta-browse-aliases.cjs`)는 자기가 실제로 읽은 크로스워크 바이트의 해시를 같은 쓰기에서 덧붙인다(멱등). 현재도 봉인도 아닌 해시를 박은 Meta는 `auto-register ... --check`와 게이트에서 `CROSSWALK_DIGEST_NOT_SEALED`로 실패하므로 PR 단계에서 잡힌다. 새 도구를 만들 때도 `planSeal`로 같은 방식을 쓴다.
- **백필은 git 이력으로 검증되는 것만:** `node archive/tools/backfill-sealed-crosswalk-digests.cjs [--write]`는 저장소의 승인 Meta가 박은 해시를 모아 그 크로스워크 파일의 실제 과거 버전(`git log -- <path>`)과 일치하는 것만 봉인하고, 일치 없는 해시는 봉인하지 않고 목록으로 보고한다. 이유: 추가 전용 공유 파일 때문에 행이 그대로인 승인 항목이 막혀서는 안 된다. 봉인은 증거일 뿐 면제가 아니다(Meta가 가리키는 행 검사는 그대로).

## CURRENT TOP — 단일 메타 Resolver 연결 (2026-10-30)

- 신규 기출 CREATE/R1/R2/R3에서 Primary RPM L1~L4 + CrossConcept/Condition/Integration을 교육과정 내 실제 풀이로 판정하고, PT/TPL은 [단일 진입·Resolver CURRENT](https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md) §0에 따라 정한다. **(2026-11-16 사용자 결정) "PT/TPL은 공식 Resolver 결과만" 제한은 없앴다.** Resolver 조회, 결정 단계를 근거로 한 직접 판정, 새 키 신설이 모두 정식 경로다. 근거 없이 채우지 않고, 키의 ACTIVE·부모·바인딩 검증은 그대로다. 이유: 유형은 계속 늘어나는 분류라 한 판정기에 묶을 수 없다. CrossConcept으로 Primary를 대체하지 않는다. 모델 공통 규칙이며 사후 FINAL QA의 기존 PT/TPL 재검 제외·예약 Git writer 금지/현재 캠페인 설정은 유지한다.

## CURRENT — 모든 결과물의 확장 메타·4칸·검토 기록 작성 (2026-11-04, 사용자 결정)

- 기출·유사문제/시험지·ALIVE/Generated·교과서·문제집·교재/평가 결과물은 제작할 때 **문항 JS + 확장 의미 메타 + 4칸 + 작성·검토·변경·출처 기록**을 함께 작성한다. 필수 정보·역할별 책임·제출 분모·SOURCE_ONLY 인계·기존 UID 재사용은 [의미 메타 정본의 공통 작성·검토·인계 요건](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)이 소유한다. 이유: 4칸을 별도 시범으로만 안내하면 신규 결과물에서 빠질 수 있다.
- 문항의 4칸(given·goal·method·condition × 용어 번호) 기록을 만들거나 검사할 때는 [4칸·용어 사전 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)을 먼저 읽는다.
- 4칸은 문항의 발문과 해설을 읽고 판정한다. PT/TPL/CC/COND 키나 라벨을 보고 치환해 채우지 않는다.
- 신규 제작분은 해당 제작·검수 라인이 자기 역할 안에서 작성·검토한다. 기존 자료의 비교 시범·일괄 확대는 [4칸 GPT 인계](../operations/JS_Archive_4Slot_GPT_Handoff_CURRENT_v1.md)의 별도 배정·독립성·제출 형식을 따른다. 이 문서가 모델이나 예약·Git 쓰기 권한을 새로 지정하지 않는다.
- 작성한 4칸 기록의 검수·main 반영(compact 파일 `archive/data/item-4slot/`, 도구 `tools/4slot/`, 반려 절차)은 [4칸 검수와 main 반영](../operations/JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md)을 따른다. 이유: 증거는 작업 브랜치에 두고 main에는 용어 번호만 올리는 분리를 지키기 위해서다.
- 아직 운영 메타(`question_metadata.json`, git에는 `archive/data/question-metadata/v1/`의 시험별 조각으로 있다)·등록기·catalog·검색 화면과 연결하지 않았고 기존 승인·출제 자격에 영향이 없다. 이유: 시범 결과는 좋지만 통합은 장애 주입과 PC·휴대폰 실제 확인을 거쳐 따로 승인받기로 했다.

## CURRENT — PT·TPL·CrossConcept·Condition·크로스워크 행 확장 원칙 (2026-11-02, 사용자 결정)

사용자 결정 취지: "맞는 키가 없으면 새로 만들어도 된다. PT·TPL·CrossConcept 등은 언제나 확장 가능하고, 나중에 같은 형태의 문제가 나오면 거기에 붙이면 된다. 문항은 계속 생성되고 형태가 다양하니 유연하게 만들고 문서화하라."

- **(a) 맞는 기존 키가 없으면 가장 가까운 키에 억지로 붙이지 않는다. 정식 `registryChanges`로 새 키를 만든다.** 문항 해설과 정의가 모순되는 키를 달아 두면 학생 화면의 L4·유형 설명이 문항과 어긋나고, 그 키를 근거로 같은 유형을 모으면 엉뚱한 문항이 섞인다(신흥중 25 Q19가 다른 시험의 "미정계수 결정" TPL을 숫자 위치만 보고 물려받은 사례).
- **(b) 새 키의 이름·정의·`internalSkeleton`은 같은 형태 문항이 재사용할 수 있게 일반화해서 쓴다.** 특정 시험의 숫자·식·인물을 넣지 않고 풀이 구조(무엇을 어떤 순서로 하는지)로 쓴다. 이유: 정의가 한 문항에 묶이면 다음 문항이 붙을 수 없어 같은 유형의 키가 계속 늘어난다. 이름 규칙은 기존 키 패턴을 따른다(예: `TPL_<과정>_<풀이 구조>`, 부모 PT 아래). 기존 키로 충분한지 먼저 같은 PT 아래 TPL 정의를 읽고 판단한다.
- **(c) 새 키는 공식 레지스트리에 정식으로 넣는다.** ("PT/TPL은 공식 Resolver 결과만" 규칙은 2026-11-16 사용자 결정으로 없앴다. 남은 원칙은 근거 없이 쓰지 말라는 것이다.) 새 키는 반드시 정식 요청(근거 파일 SHA 결속, 등록기 검증, 크로스워크·바인딩 정합)으로 들어가고, 이후 Resolver가 그 키를 결과로 낸다.
- **(d) 다음 문항이 같은 형태면 그 키를 재사용한다.** 새 키를 또 만들지 않는다. 지원 문항(`supportingQuestionUids`)과 크로스워크 `templateCandidates`에 덧붙이고, 정의가 그 문항을 포함하도록 억지로 넓혀야 하면 새 키를 만든다. 이유: 키가 같은 형태 문항의 묶음 단위여야 검색·통계가 의미를 가진다.
- **(e) 추가(add-only)를 우선하고, 기존 행·키 수정은 영향 문항을 확인하고 기록한다.** 새 TPL·바인딩·크로스워크 행은 추가로 처리한다. 같은 리프·단원에 쓰는 행이 `RPM_ONLY`뿐이라 후보 TPL을 붙일 ACTIVE 행이 없는 경우처럼 기존 행을 바꿔야 할 때만 최소 수정하고(예: `RPM_ONLY`를 `FAMILY_ACTIVE`로), 같은 행을 쓰는 모든 문항의 Resolver 결과가 그대로인지 확인해 요청의 증거 파일에 적는다. 이유: 기존 행을 쓰는 다른 시험지의 메타를 조용히 바꾸지 않기 위해서다. 의미 키 삭제·정의 변경은 지금처럼 등록기가 막는다.
- **크로스워크 행 확장:** 문항의 PT/TPL에 맞는 ACTIVE 행이 없어 RPM Primary 경로(`rpmPrimaryPath`)를 못 채우면, 문항·해설을 보고 마스터에 있는 RPM 리프를 정해 `archive/data/meta-foundation/crosswalks/rpm-primary-v1.0/<파일>.json`에 `DIRECT_ACTIVE` 행(문항의 PT/TPL, 문항 자신의 `standardUnitKey`·`subUnitKey`, ACTIVE 바인딩)을 덧붙이고 `summary` 개수를 갱신한다. 이름이 비슷하다고 고르지 않는다. 같은 리프 후보가 둘이면 소형 메타에 `rpmPrimaryRecordId`로 지목한다. 마스터에 맞는 리프가 아예 없거나 해설이 두 리프 중 하나로 정해지지 않는 문항만 비워 두고 이유를 EVIDENCE_DEBT로 적는다.
- **같은 (리프, 단원)에 TPL이 둘 이상이면 새 행을 더해도 된다. Resolver가 행을 고른다:** 행은 (리프, 단원, PT/TPL) 단위이고 등록기(`targetParentRef.crosswalkRef`)와 `main_merge_master.py`는 PT/TPL이 정확히 같은 `DIRECT_ACTIVE` 행을 요구한다. Resolver는 리프+단원으로 행을 찾고, 세부단원(`subUnitKey`)이 다른 행은 제외한 뒤에도 `DIRECT_ACTIVE` 행이 둘 이상이면 `CROSSWALK_ROW_SELECTION_PENDING`을 내고, 결정 단계로 고른 `familyTemplateSelection`(`crosswalkRecordId`와 그 행의 `templateKey`)이 있으면 그 행으로 `PROJECTION_REUSE`를 낸다(`FAMILY_ACTIVE`와 같은 선택 규칙). 행 중 하나라도 `DIRECT_ACTIVE`/`ACTIVE`가 아니거나 PT/TPL이 비면 이전처럼 `CROSSWALK_COMPATIBILITY_ROW_AMBIGUOUS`다. 한 리프에 PT가 둘 이상(예: 수II 증감표)이어도 되고, 같은 PT 아래 TPL만 여럿이면 `FAMILY_ACTIVE` 한 행에 `templateCandidates`로 모아도 된다(신흥중 M3-RPM-025). 이유: 새 형태가 생길 때마다 행을 더하는 쪽이 add-only이고 이미 등록된 문항 값은 건드리지 않는다. 2026-11-02 전수 확인: 같은 (curriculum, scope, rpmPath, 단원) 중복 11군 25행이 모두 선택으로 해소됨(`rpm-active-resolver.test.mjs`).
- 실행 기록: 신흥중 25 중3 Q19·Q20 신규 TPL `TPL_M3_COMMON_FACTOR_BY_FACTORIZATION`, `TPL_M3_FIND_OTHER_FACTOR_BY_FACTORIZATION`(+ 크로스워크 `M3-RPM-025` FAMILY_ACTIVE) `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/finalqa-shinheung-25-1mid-m3-q19-q20-tpl-20261102.review.json`, 비워 둔 RPM 경로 8문항과 금당고 유사 Q1·Q16 단원 재정렬 `.../rpmpath-8q-crosswalk-decisions-20261102.review.json`. 같은 형태 문항을 만나면 이 사례를 먼저 본다.
- 도구: `python3 tools/main_merge_master.py --exam <시험지> --rpm-path-delta --request-tag <태그> --evidence <결정 파일>`은 이미 한 번 delta를 낸 시험지에 새 requestId로 두 번째 delta를 만든다(같은 requestId는 등록기가 거부). 소형 메타 항목에 `unitRealign: true`와 바뀐 단원 필드(`standardUnitKey/standardUnit/subUnitKey/subUnit/conceptClusterKey`)·`parentAssignment`를 적으면 그 단원 필드와 RPM 경로를 한 요청으로 보낸다(내용이 속한 교육과정 단원과 등록 단원이 달라 경로와 어긋날 때). 시험지 JS의 같은 필드도 함께 맞춰야 등록기가 받는다.

## CURRENT — 학년이 달라도 같은 형태의 유형은 기존 키를 재사용하고 그 학년 연결을 추가한다 (2026-11-22, 사용자 결정)

- 같은 형태의 유형이 다른 학년에 이미 있으면 학년별 사본 키를 만들지 않는다. 기존 키를 그대로 쓰고, 그 학년의 과정·단원 연결(binding)과 소속 pack 범위를 add-only `registryChanges`로 추가해 그 학년에서도 등록·검색되게 한다. "같은 학년·과목의 키만" 규칙은 이 경우에 한해 풀린다. 형태가 정말 같을 때만이고, 비슷해 보인다고 붙이지 않는다(맞는 키가 없으면 위 확장 원칙대로 새 키). 문항 행에 맞는 단원이 없어 단원 연결을 만들 수 없으면 단원 없이 유형만 건다.
- 등록기·변환기는 키에 그 학년·교육과정 연결이 있으면 통과한다. 연결이 없으면 변환기가 `SCOPE_PT_BOUND_TO_OTHER_COURSE`·`SCOPE_CURRICULUM_MISMATCH`로 건너뛴다. 변환기(`grade-bindings.mjs`)가 이 두 사유를 받으면 문항 행 자신의 교육과정·과정과 문항의 단원(태그 마스터에 있는 값, 없으면 결과 줄의 `binding: { standardUnitKey, subUnitKey }`)으로 그 키의 소유 pack에 add-only 연결 한 줄과(필요하면) pack 범위 추가를 같은 첫 요청의 `registryChanges`에 싣는다. 키는 새로 만들지 않고, 단원을 정할 수 없으면 `GRADE_BINDING_NO_UNIT`로 남긴다(예: PR #2651의 중1 경우의 수, 2015 기하 평면벡터는 손으로 넣은 같은 형태).
- 이유: 교육과정 개정으로 유형이 학년을 옮기며, 학년별 사본 키는 같은 유형을 갈라 검색·다시 만들기를 약하게 한다.

## CURRENT — 기본범위 승인 재결속 `archive-basic-scope-rebind-request-v1` (2026-11-02, 사용자 결정)

- 기본범위 승인(운영 메타 `question_metadata.json`의 standardUnit/subUnit 승인 행, 시험별 조각 `archive/data/question-metadata/v1/` + `basic-scope-source-links.json` 부모 연결)된 문항의 그림만 바뀌어 fingerprint가 어긋나 strict 검색에서 사라졌을 때, 메타 값은 그대로 두고 원본 해시만 다시 묶는 등록 요청이다. 구현: `archive/tools/meta-foundation/register-basic-scope-rebind.mjs`, 테스트: `tests/archive-basic-scope-rebind.test.mjs`. 이유: 기존 등록기(v2)는 시험지 전체 재등록만 받아 그림 하나 때문에 전체 재검수를 해야 했고, 등록 동기화(main 등록기)는 본문 fingerprint가 달라진 부모 연결을 조용히 버린다.
- 거부 조건: 요청이 메타 값을 바꾸려 함(before/after는 두 fingerprint만), 승인 행이 아님·검토 초기화 대기, 요청 시험지에 없는 qid, 소스 blob/이전 blob/저장된 fingerprint/after 해시 불일치, 이전 blob이 승인 fingerprint를 재현하지 못함, 정답·선택지·풀이·분류 필드 변경, 본문 변경(맨 앞 `[도형필요]`/`[그래프필요]` 줄 제거와 숫자·`$`·`\` 없는 8자 이하 선언 문구 수정만 허용), 그림 파일 없음, 그림·본문이 실제로 안 바뀜, `basicParent`가 승인 소단원의 유일한 정본 부모가 아님, 기존 연결의 부모 변경. 거부 시 어떤 파일도 쓰지 않는다.
- 추가 결속(2026-11-02 검수 반영): 새 그림(image 참조 변경, 파일 존재, 해당 문항 `assets/images/<시험지>/q<번호>.<ext>`)이 항상 필수이고 본문 수정은 그 위에서만 허용한다. 글자 수·숫자 제한만으로는 "최대→최소" 같은 뜻 뒤집기를 못 막으므로, 승인 evidenceRefs의 검토 파일(`archive-basic-scope-rebind-review-v1`)에 같은 requestId·examUid·sourceArchiveFile, 문항별 `contentEdits`(요청과 정확히 같음)와 변경 후 본문 `contentAfterSha256`이 있어야 한다. 다른 요청·시험지·문항의 검토 파일은 거부한다.
- 이 경로는 검수를 대신하지 않는다. 그림 변경이 문항 의미를 바꾸지 않았다는 확인(문항·해설·정답·그림 직접 확인)을 `evidenceRefs`의 검토 파일에 남긴 요청만 쓴다.

## CURRENT — 유사시험지 RPM Primary 경로(rpmPrimaryPath) 등록 (2026-11-02)

- 등록기가 읽는 RPM 경로 필드는 `rpmPrimaryPath`(L1~L4, crosswalkRecordIds)뿐이다. 소형 메타가 `rpmPrimary{recordId}`·`rpmPrimaryL1~4`로만 적으면 등록 요청 생성기(`tools/main_merge_master.py`)가 버려 학생 검색 카드에 "RPM L1~L4 미지정"이 나온다(24 매산여고·25 제일고 수II, 25 금당고 확통이 그랬다). 이제 생성기가 공식 크로스워크에서 경로를 정해 `rpmPrimaryPath`로 싣는다: 같은 교육과정·과목·PT·TPL의 ACTIVE 행 중 소형 메타가 지목한 레코드이거나, 후보 경로가 하나뿐일 때만. 후보가 없거나 여럿인데 지목이 없거나 지목 레코드의 PT/TPL이 다르면 그 문항은 비워 둔다(EVIDENCE_DEBT, 이름이 비슷하다고 추정하지 않는다). 이유: RPM Primary는 Resolver/크로스워크 결과만 쓴다. (2026-11-19) 이제 등록기가 `rpmPrimaryRecordId`를 저장하고 빈 `rpmL1~L4`를 그 번호에서 채우므로, 새 문항은 위 "최소 한 벌"대로 번호만 쓴다.
- 이미 등록된 시험지에 경로만 추가: `python3 tools/main_merge_master.py --exam <시험지> --rpm-path-delta --apply` → `.archive-meta-register/inbox/rpmpath-<시험지>.json`(FINAL_QA, 다른 승인 값 변경 없음, 기존 `targetParentRef` 유지, 경로를 못 정한 문항은 빈 패치). 이유: 같은 requestId로 다시 등록하면 "requestId reused with different content"로 거부된다.

- 등록기 최소 한 벌(2026-11-19): 작성자는 키·`rpmPrimaryRecordId`·난이도 정수 같은 판정 값만 요청에 넣는다. 사본·보조 필드(`rpmPrimaryL1~L4`, `difficultyBasis` 등 `reviewed-meta-value-fields.mjs` 목록 밖)를 안 써도 등록되고, 써도 거부하지 않는다. 저장하지 않고 영수증·결과의 `reportTags`(`UNSTORED_FIELDS`)에 이름만 남긴다. `rpmPrimaryRecordId`가 있고 `rpmL1~L4`가 비어 있으면 등록기가 크로스워크 그 번호의 행에서 채운다(이미 있는 값은 덮지 않고 다르면 `RPM_DIFFERS_FROM_CROSSWALK`만 보고, 번호가 크로스워크에 없으면 비워 두고 `RPM_RECORD_ID_NOT_IN_CROSSWALK`로 보고). 운영 뒤쪽 검사(consumer-verify)도 같은 원칙이라 저장되지 않는 필드와 번호 자체는 소비자 값 비교에서 뺀다. 이유: 사본을 손으로 쓰다 어긋나 요청이 거부되는 일을 없애고, 글자는 도구가 채우게 하기 위해서다.
- 생성기 보강(2026-11-02): ① 크로스워크 행의 `scope`(`수학_상/하`)와 `standardCourse`(`수학(상/하)`)는 같은 과목의 두 표기라 어느 쪽이든 과목과 같으면 후보로 본다(2015 고1 문항이 모두 경로를 잃었던 원인). ② `FAMILY_ACTIVE` 행은 `templateCandidates`에 문항의 TPL이 있으면 후보다(행이 TPL 선택을 Resolver에 맡기는 구조라 `templateKey`가 없다). 소형 메타가 지목한 레코드가 문항의 PT/TPL·내용과 맞지 않으면 지목을 고치거나(새 행 `rpmPrimaryRecordId`) 마스터에 맞는 리프가 없을 때만 비운다. 이유: 지목이 틀린 채로 두면 문항이 엉뚱한 리프에 붙거나 경로 없이 등록된다.
- 24 고1 2학기 기말 유사 5건 기록: 결정과 영향 확인은 `archive/data/meta-foundation/evidence/reviewed-exam-meta/v1/rpmpath-h1-2final-24-5exams-crosswalk-decisions-20261102.review.json`. 소형 메타의 L1/L2가 RPM 부모(예: 함수>함수)인데 `parentAssignment`가 없으면 등록기가 'canonical label mismatch'로 거부하므로 값을 낮추지 말고 `parentAssignment`(CROSSWALK_EXACT)를 항목마다 적는다. 같은 바인딩을 필요로 하는 요청이 여럿이면 registryChanges는 요청 처리 순서(inbox 파일명 순)상 먼저 오는 요청 하나에만 싣는다(두 번 실으면 둘째가 'registry before mismatch'로 거부된다).

## CURRENT — Generated 확장 키(EXT-*) 등록 (2026-11-02, 사용자 결정)

- 소형 메타가 `EXT-CROSS-*`/`EXT-COND-*`를 쓰면 등록기(`reviewed-exam-registration-v2.mjs`)가 색인·원본 registry·정본 부모·교육과정/과목 범위를 확인하고 받는다. 정본 승격은 일어나지 않는다(정본 registry, compiled, RPM LOCKED, 색인은 바뀌지 않음). 미등록·부모 없음·승격 주장·`GENERATED_ACTIVE` 아님은 계속 거부한다. 이유: 확장 키 하나 때문에 시험지 전체 등록이 막혔다. 상세: [등록 v2](../architecture/Reviewed_Exam_Meta_Registration_v2.md).
- 요청 JSON은 확장 키를 `crossConceptKeys`/`conditionKeys`에 그대로 적는다(`registryChanges`에 확장 정의를 넣지 않는다). 확장 L4(`rpmGeneratedL4Key`)는 등록기 필드가 아니라 원본 JS·확장 registry에 둔다.

## CURRENT TOP — 메타 계약은 정확한 업무 정본으로 이동 (2026-10-22)

- [Notion 02-06 메타데이터 라우트](https://app.notion.com/p/4010e68bd69f81588ea0cc325bbe51cb)에서 **의미 판정**과 **공용 조회/소형 JSON 쓰기** 및 **Git 자동 등록 기술 담당**을 구분한다. 실질적 규칙은 [의미 메타 정본](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md), [소형 JSON 쓰기 정본](../../docs/architecture/JS_Archive_Small_JSON_Meta_Write_Contract_CURRENT_v1.md)에 한 번만 둔다. 기존 역할별 검수·Golden·Blind 의무는 유지한다.
- 공용 대형 메타는 조회용이며 작업자는 시험지 소형 JSON/stage-local 패킷만 수정한다. 병합 후 등록·Consumer/Search parity는 Git 자동화/기술 소유 범위다. GPT 사후 FINAL QA의 종료는 [v2.0 카드](../../docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md)대로 Git main/대상 blob 확인까지이며, PT/TPL 신규 검사 제외·후속 CI/Pages 수동 폴링 제외를 지킨다. 자동화 검증을 수행하지 않았으면 `PIPELINE_PASS`라고 주장하지 않는다.

## CURRENT HARD — JS 신규·수정·검수 Meta 필수 확인 (2026-10-10)
- 모든 기출·유사·Generated·교재/평가용 JS의 신규 제작·기존 수정·문항 검수에서 [JS Metadata 필수 계약](../../docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)을 적용한다. 해당 작업 UID의 standardUnit/subUnit·RPM L1~L4·CrossConcept/Condition/Integration/PT/TPL·1~5 난이도(정수 difficultyBucket만, 새 문항에 `level` 없음: [난이도 절](#난이도는-정수-15만-2026-11-18-21시-kst부터-적용))·UID/sourceQid/provenance·Consumer/index 정합을 확인한다. 미확정 근거는 정확한 EVIDENCE_DEBT로 기록하고 가짜 키/추정값/가짜 NONE으로 채우지 않는다. 핀포인트 작업의 범위를 무관한 문항 전수 재검으로 확대하지 않는다. 메타 변경은 필수 직접 dependency와 운영 검색 projection에 결속한다.

## CURRENT — 5단계 난이도(Gemini) 인박스 운반: 수리는 도구가, 작업 목록은 빈 파일만 (2026-11-11, 사용자 위임 결정)

- **배경 숫자:** 2026-10-30 ~ 11-09 장부(`.archive-meta-register/diff5-intake-ledger.json`) 698건 중 반영 191건(3,424문항), 보류 504건. 보류의 절반(약 260건)은 이미 난이도가 있는 시험지를 다시 판정한 것이고, 나머지 절반(약 240건)은 형식 문제였다(원본 변경으로 해시 불일치 57, `ordinal` 대신 `sourceOrdinal` 48, 값 형식 무효 42, payload 형식 29 등). 그동안 난이도가 전혀 없는 파일 333개(7,611문항)는 그대로였다.
- **수리는 운반 작업자가 손으로 하지 않고 도구가 한다:** `node archive/tools/meta-foundation/register-difficulty5.mjs --wrap <Drive 원본> --normalize …`. `sourceOrdinal`→`ordinal`, 신뢰도 대문자→소문자, `schemaVersion`→`v1`, 등록 필드만 추출, `latestBlobSha`를 현재 파일의 LF blob 해시로 맞춘다. 고친 내용은 stderr의 `DIFF5_INTAKE_REPAIRS:` 줄과 `gemini._intakeNote`에 남는다. 이유: 지시문으로 시킨 손 수리는 규칙이 있는 동안에도 해시 불일치 57건을 그대로 흘렸다(Windows CRLF 바이트 해시를 쓰는 등 매번 다르게 처리).
- **난이도 값은 고치지 않는다.** `after.difficultyBucket` 등 판정 값은 그대로 옮기고, `"3"`·`"certain"`·`"none"`처럼 규격과 다른 값은 추정해 바꾸지 않아 지금처럼 `SKIP_INVALID`가 된다. 등록기의 문항 번호↔questionUid 대조와 "기존 숫자는 덮어쓰지 않는다"는 그대로다. 단, 위 "단일 모델 초안 등급" 절의 빈 칸 채우기는 이 조항의 예외다.
- **장부의 "같은 파일은 건너뛴다"는 유지한다.** 다만 수리 규칙이 바뀌어 다시 볼 가치가 생긴 보류 건은 장부에서 그 항목을 지워 다음 회차에 새 파일로 다시 처리되게 한다(2026-11-11에 해시 불일치·ordinal·payload·값 형식 무효 176건을 이렇게 되돌렸다). 충돌(기존 난이도와 다름)·questionUid 불일치·원본 없음은 되돌리지 않는다.
- **판정 대상은 난이도가 빈 파일만:** `node archive/tools/meta-foundation/list-missing-difficulty5.mjs [--format tsv] [--out <파일>]`이 정본 메타 기준으로 목록을 만든다(기출 최신 연도 먼저 → 유형 → 교과서 → 유사, 일부만 빈 파일은 빈 문항 번호 포함). Gemini 예약 라인에는 이 목록의 파일만 판정하게 한다. 이유: 이미 숫자가 있는 파일의 재판정은 인박스에서 전부 버려진다.
- 기존 난이도와 다르게 나온 재판정을 반영하려면 `reviewedCorrection`(정확한 근거 필요) 경로를 쓴다. 인박스 운반에서 덮어쓰지 않는다.

## CURRENT — 빈 메타 총정리: Codex가 직접 판정·등록한다 (2026-11-11, 사용자 결정)

- **라인 결정(같은 날 변경):** 처음 계획은 Gemini 1차 · GPT 예약 2차였으나 사용자가 "Gemini 워커는 빼고 Codex 창에서 바로 시킨다"로 바꿨다. Gemini는 유사문항 생성 라인으로 돌리고, 분류 판정에는 쓰지 않는다. 이유: Gemini 제출은 형식 문제와 재판정으로 버려진 비율이 높았고(난이도 698건 중 191건만 등록), 저장소에서 도구를 직접 돌릴 수 있는 Codex가 판정부터 등록까지 한 곳에서 하는 편이 운반 단계가 없다. 난이도 라인(위 절)은 이미 만들어져 있어 대상 목록이 빌 때까지 Gemini에 그대로 두되, 한 주 등록 실적이 나오지 않으면 Codex로 옮긴다.

- **배경 숫자(2026-11-11 정본 28,615문항):** 빈 값은 난이도 7,611(373개 파일), 단원 2,295(기출 106개 파일), 소단원 4,416(기출 2,713 · 교과서 1,703), 유형 PT/TPL 17,371(853개 파일). 개념 묶음·CrossConcept·Condition·Integration은 대부분 비어 있지만 Archive 2.0의 어느 화면도 읽지 않는다. 이미 판정했는데 등록되지 않은 유형 판정이 `pending-supplement` 72개 시험지(948문항)와 `rejected`(120문항)에 있고, 거부 사유는 대부분 `curriculumKey`·`before` 불일치 같은 형식 문제다.
- **판단은 모델이, 형식은 도구가 만든다.** 판정하는 세션은 아래 판정 원장만 낸다. 등록 요청의 `before`·해시·문항 수·스키마는 도구가 정본에서 읽어 채운다. 이유: 손으로 만든 요청이 난이도 약 240건, 분류 39건 이상 형식으로 거부됐다.
- **빈 것만 한다.** 대상은 저장소 도구가 만든 "빈 파일 목록"에 있는 파일뿐이고 위에서부터 한다. 이유: 난이도 제출 698건 중 약 260건이 이미 값이 있는 시험지의 재판정이라 버려졌다.
- **한 번 읽을 때 다 받는다.** 분류 읽기 한 번에 단원·소단원(빈 문항만), 핵심 풀이·결정 단계·RPM L1~L4, CrossConcept·Condition·Integration을 함께 낸다. 화면이 읽지 않는 항목만 채우는 단독 작업은 만들지 않는다. 난이도는 별도 판정이라 위 절의 라인을 그대로 쓴다.
- **판정은 두 번, 서로 보지 않고 한다. 안 맞으면 추정하지 않는다.** 1차 판정과 2차 판정은 서로 다른 대화 컨텍스트에서 한다(별도 Codex 창이거나, 한 감독 세션이 따로 띄운 하위 작업자 둘). 2차는 자기 원장을 다 쓰기 전에 1차 원장을 열지 않고, 감독 세션은 2차 작업자에게 대상 시험지 목록만 넘기고 1차 원장의 내용은 넘기지 않는다. 감독 세션은 불일치를 한쪽 값으로 정해 주지 않는다. 두 원장이 일치한 문항만 등록하고 불일치·판정 불가는 HOLD 목록에 `EVIDENCE_DEBT`로 남긴다. 같은 세션의 자기 점검을 독립 검수로 적지 않는다. 단, 위 "단일 모델 초안 등급" 절의 범위(비어 있는 메타를 모델 하나로 채우고 초안 등급으로 표시)는 이 조항의 예외다.
- **PT/TPL도 원장에 적을 수 있다 (2026-11-16 사용자 결정으로 변경, 이전: "원장에 적지 않는다").** 문항·해설의 결정 단계를 근거로 ACTIVE 키를 직접 판정해 근거 구절과 함께 적는다. RPM 경로에서 Resolver(`rpm-active-resolver.mjs`)가 뽑은 값도 그대로 쓸 수 있다. 맞는 키가 없으면 가까운 키에 붙이지 말고 "새 키 후보"로 적어 `registryChanges`로 처리한다(위 "확장 원칙" 절). 두 판정이 일치한 값만 등록한다. 이유: 유형을 Resolver 출력으로만 받으면 크로스워크 행이 없는 문항의 유형 칸이 계속 빈다.
- **역할(창 A·B는 별도 창 또는 감독 세션의 하위 작업자 A·B):** Codex 창 A = 도구 제작, 밀린 판정 회수(판정 값은 그대로 두고 `before`·해시만 현재 정본으로 다시 만들어 새 `requestId`로 재제출), 분류 1차 원장. Codex 창 B = 분류 2차 원장, 두 원장 대조 → 도구로 요청 생성 → dry-run → 인박스 PR, HOLD·새 키 후보·거부 건 처리. 원장은 작업 폴더 `.tmp/meta-backfill/`에 두고 커밋하지 않는다.
- **채우는 순서(화면에 쓰이는 것부터):** ① 난이도(기출 2026년 → 과거 → 유형별·교과서·유사) ② 단원·소단원이 빈 기출 ③ 유형(기출 최신 연도부터) ④ 교과서 소단원, 유형별·유사 문제지.
- **판정 원장 `meta-judgment-ledger-v1`(시험지 하나에 파일 하나):** 최상위 `schemaVersion`, `judge`(`pass1`|`pass2`), `createdAt`, `sourceArchiveFile`(목록 값 그대로), `items[]`. 문항마다 `ordinal`, `questionUid`, `primaryMethod`(핵심 풀이 한 문장), `decisiveStep`(결정 단계 한 문장), `rpmPath{majorUnit, midUnit, l3, l4}`, `crossConceptKeys[]`, `conditionKeys[]`, `integrationPattern`, 그리고 목록에서 단원·소단원이 빈 문항에만 `standardUnitKey`, `subUnitKey`. 키는 저장소가 내보낸 선택지 표에 있는 값만 쓰고, 맞는 값이 없거나 판정할 수 없으면 값을 비우고 `hold`에 사유를 적는다.
- **도구:** 빈 메타 목록·선택지 표는 `list-missing-meta.mjs`, 두 원장을 대조해 v2 요청을 만드는 것은 `build-meta-request.mjs`(아직 없음)이다. 도구 병합을 기다리지 않고 판정을 먼저 시작한다(2026-11-11 변경, 아래 절).
- **이 계획 밖:** 소단원 값과 필드 승인은 있으나 문항 상태가 의미 검토 대기라 카탈로그가 빼는 문항이 약 11,800개 있다(`archive/tools/build-archive2-catalog.mjs`의 소단원 승인 조건). 값을 채울 일이 아니라 화면 규칙 결정이다.

## CURRENT — 빈 메타 채우기 실행 방식: 루나 밤샘 판정 + 기계 합격 검사 (2026-11-11, 사용자 결정)

위 "빈 메타 총정리" 절의 원칙(빈 것만, 두 번 독립 판정, 판단은 모델·형식은 도구)은 그대로이고, 실행 방식만 아래로 바꿨다.

- **받아 두고 나중에 묶는다(채워 가는 메타 전체의 방향).** 새 키가 생기면 미분류로 받아 두고, 묶기·포함시키기는 나중에 따로 한다. 이유: "정본이 아니다"라는 이유로 값이 밀려 파이프라인이 멈추는 일을 없앤다. 소단원은 묶음표의 미분류가 그 자리이고, PT/TPL·Condition 키도 같은 방향으로 간다(계약 변경은 따로 제안).
- **판정자는 루나(Codex 저비용 모델)이고 감독 세션이 직접 돌린다.** 난이도도 루나가 판정한다. Gemini 난이도 판정은 나중에 참고로만 쓴다. Sonnet은 코드와 작은 표본 확인에만 쓴다. 이유: 읽고 판정하는 대량 작업은 속도가 느려도 되고(밤새 실행), Sonnet 사용량을 아낀다.
- **한 번에 모든 층을 정리한다.** 난이도, 단원·소단원, RPM 경로, CrossConcept·Condition·Integration, 4칸까지 기출·유사·생성 문항 전부가 대상이다. 순서는 고1·고2 과목별로 먼저 끝내고 확인한 뒤 나머지다. 중등은 기존 L2·L3 분류에서 크게 벗어나지 않는다.
- **난이도는 보수적으로.** 두 단계 사이에서 애매하면 낮은 단계를 주고 경계 플래그로 표시한다. 정의·공식을 바로 쓰면 1단계다. 계산이 길다·서술형이다·배점이 높다는 올리는 이유가 아니다. 이유: 1차 표본 30문항 중 어긋난 7문항 가운데 6문항이 높게 잡은 쪽이었다.
- **기계 합격 검사(원장 단위).** 틀 문장 반복, 발문 인용, 일반 문구, 선택지에 없는 키, 사유 없는 빈 칸, 문항 식별자 불일치가 있으면 그 원장을 통째로 버리고 그 시험지를 다시 시킨다. 이유: 범주별 고정 문구를 스크립트로 찍어 낸 원장이 1차에서 45개 중 41개였다.
- **문항 번호 확인.** 판정 근거는 반드시 그 번호 문항의 내용이어야 한다(24번 칸에 20번 내용을 적은 사례). 두 판정을 대조할 때 근거가 같은 문항을 설명하는지도 본다.
- **보류 문항은 그림을 직접 읽는 라인으로 다시 판정한다.** "조건이 모순", "선택지에 답이 없음"은 보류 사유가 아니다. 이유: 중·고등 문항의 그런 오류는 이미 고친 상태라, 모순으로 보이면 잘못 읽은 것이다. 그림 파일이 실제로 없거나 값이 읽히지 않을 때만 보류한다.
- **4칸은 문항마다 판정한다.** 유사·생성 문항은 원본의 4칸을 참고하되 그대로 이어받지 않는다. 묻는 것·조건이 달라지면 값이 달라도 정상이다(정본 문서 미결 2번을 이것으로 닫는다).
- **단원·소단원의 기준은 2022 개정 교재 차례다.** 예: 연립일차부등식과 "이차방정식의 실근의 조건"은 공통수학1 "여러 가지 부등식". 학년이 어긋난 값(고1 문항에 중2 키 등)은 재판정 대상으로 넘겨 바로잡는다.
- **두 판정의 대조(2026-11-12 사용자 결정):** 일치 → `REVIEW2`(`reviewPassCount: 2`, 두 원장 파일의 SHA-256을 근거로)로 요청. 난이도 한 단계 차이 → **2차 값** + 경계 플래그, 확신도 `low`. 두 단계 이상·한쪽 보류·분류 불일치 → 요청에서 빼고 보류. 이유: 2차 전체가 보수 규칙 아래에서 판정됐고 틀 문장이 없었다. "낮은 쪽" 규칙은 보수 규칙과 겹쳐 두 번 내려가(1단계 28%) 2차가 구체적 근거로 올린 문항까지 내렸다.
- **옛 과목·표가 빈 과목은 지금 과목의 표로 합류한다(2026-11-12 사용자 결정).** 2009 개정 "기하와 벡터"처럼 유형 경로 선택지가 없는 과목의 문항은 보류하지 않고 같은 내용을 지금 다루는 과목(기하 등)의 표에서 고르고, 어느 표를 썼는지 원장에 `choiceTableUsed`로 남긴다. 이유: 표가 없다는 이유만으로 문항 전체가 보류돼 화면에서 유형으로 찾을 수 없었다.
- **작업자 감독(2026-11-12 사용자 지시):** 시험지 하나를 끝낼 때마다 보고 줄(`끝났어요 | 시각 | 시험지 | 문항 | 보류`)을 남기게 하고, 한 실행에서 기준(시험지 4개)보다 적게 한 실행은 다음 지시문에 실제 숫자와 함께 지적한다. 원장 없이 완료로만 적은 시험지는 진행표에서 빼 다시 시킨다. 형식 문제(PowerShell의 배열 감싸기, 수식 역슬래시)는 작업자 탓으로 버리지 않고 도구가 고쳐 읽는다.

## CURRENT — 소단원 묶음표: 같은 내용의 소단원 키를 하나로 보여 주고 고른다 (2026-11-11, 사용자 결정)

- **무엇:** `archive/data/archive2-subunit-groups.json`. 같은 통합 단원(subject + unitKey) 안에서 한 소단원으로 보여 주고 선택하는 `subUnitKey` 묶음이다. 기존 키·정본 값(`question_metadata.json`, git에는 `archive/data/question-metadata/v1/` 조각), 크로스워크, `sealed-digests`, 카탈로그는 바꾸지 않는다. 표시와 선택에만 쓰고 표에 없는 키는 자기 자신이 하나의 묶음이다. 이유: 같은 내용이 2015·2022 키, 표기, 단원 번호 때문에 여러 풀로 갈라져 소단원 평가가 모이지 않았다.
- **원천과 도구:** 사람이 문항 발문을 읽고 정한 판정은 `archive/data/meta-os/subunit-group-rules.json`이 소유한다. 표는 `node archive/tools/meta-os/build-subunit-groups.mjs`로 만들고 `--check`로 같은지 본다. 표를 손으로 고치지 않는다. 새 묶음은 규칙 파일에 판정을 추가해 다시 만든다. 새 키가 정본에 생겨도 `--check`는 실패하지 않고 미분류(자기 묶음) 키 수만 센다.
- **묶음 종류:** `subunit`(소단원, 이름은 마스터 표 `labelKo`이고 2022 체계 키가 있으면 그 이름), `unit_general`(`...-CORE` 같은 넓은 키, 쪼갠 키와 묶지 않음, 이름 "단원 일반"), `unit_other`(마스터 표에 없는 임시 키 중 분명한 마스터 소단원이 없는 것, 이름 "기타"), `moved`(다른 단원 소단원에 속하는 키, 아래), `excluded`(문제 번호가 키가 된 `...-P152-Q04` 류, 소단원 평가 제외).
- **묶는 기준:** 이름·내용이 사실상 같을 때만 묶는다. 삼각함수 정의와 삼각함수 기본처럼 범위가 다르면 묶지 않고, 확신이 없으면 따로 둔다. 키마다 실제 문항 2~3개의 발문을 읽어 같은 내용인지 확인한 묶음만 `reviewed: true`다.
- **이동 표시(`moved`):** 그 단원에 놓여 있지만 내용이 다른 단원 소단원(또는 그 단원의 "단원 일반")에 속하는 키는 `moved` 묶음의 `belongsTo{subject,unitKey,unitLabel,groupKey}`로 그 묶음을 가리킨다. 가리키는 묶음이 실제로 있어야 하고(생성기·테스트가 검사), 이동의 이동(사슬)은 없다. 키 값은 바꾸지 않는다. 예: 중2 연립일차부등식(M2-03-SYSTEM_INEQ_SOL 등)은 2022 교육과정에서 고1로 옮겨 가 공통수학1 "여러 가지 방정식과 부등식"의 연립부등식 묶음을 가리킨다. 화면이 이 표시를 읽는 방법은 아직 정해지지 않았다(통합 단원 배치 코드는 이 PR에서 바꾸지 않음).
- **학년이 다른 키(`cross_grade_key`):** 중등 범위에 다른 학년 접두어(M1·M2·M3)나 고등 키, 고등 범위에 중등 키가 있으면 근거를 `cross_grade_key`로 표시해야 하고(표시가 없으면 생성기가 실패), 이 표시는 그런 키에만 쓴다. 문항의 소단원 값이 틀렸다는 뜻이라 재판정 라인이 그 학년의 키로 고친다. 묶음표는 값을 고치지 않고 내용이 맞는 소단원에 묶어 보여 줄 뿐이다.
- **구역(`section`):** 한 단원의 소단원을 머리말로 나누고 싶을 때 단원에 `sections`(이름 목록)를 두고 소단원 묶음에 `section`을 단다. 지금은 공통수학1 "여러 가지 방정식과 부등식"만 "여러 가지 방정식"/"여러 가지 부등식"으로 나눈다. 단원 일반·기타·이동·제외 묶음에는 `section`이 없다.
- **검사:** `tests/meta-os-subunit-groups.test.mjs`(한 키는 통합 단원당 한 묶음, 표의 키가 정본에 있음, 라벨 한글·비어 있지 않음, 종류별 규칙, `--check` 일치). 운영 데이터의 정확한 개수는 고정하지 않는다.

## CURRENT — 문항별 중단원 지정표 (2026-11-17, 사용자 결정)

- **무엇:** `archive/data/archive2-middle-parent-assignments.json`. 옛(2015) 소단원 키가 2022 중단원 둘 이상에 걸치거나 키가 없어서 단원 표(중등)의 "중단원 미지정"에 떨어지던 문항을, 문항을 하나씩 읽고(1차, 독립 2차, 불일치는 최종 판정) 정한 중단원 하나에 잇는 표다. 옛 키·크로스워크·`legacySubUnitMappings`(`RPM_MIDDLE_LEGACY_SUBUNIT_PARENT_DRIFT` 검사 대상)·봉인 문서는 바꾸지 않는다(소단원 묶음표와 같은 "키는 그대로, 표를 얹는다" 방식). 이유: 원의 성질 380문항이 "원주각"·"원주각의 활용" 칸이 0인 채 미지정에 있어 선생님이 원주각만 골라 출제할 수 없었다.
- **정본과 파생:** 정본은 지정표 파일 하나다. 카탈로그 빌더(`archive/tools/build-archive2-catalog.mjs`)가 지정표를 읽어 카탈로그 문항에 `reviewedMiddleParentKey` 필드를 싣고(파생, `--check`가 불일치를 잡는다), 화면은 그 필드만 읽는다(`UnitPastExamsCore.reviewedMiddleParent`, 단원 표 `archive2-unit-tree.js` `assign`, 통합 단원 `classify`). 지정표를 따로 내려받지 않는다.
- **지문 조건:** 문항 본문(발문·보기·그림)의 지문(`assignmentFingerprint`)이 판정 당시와 같을 때만 필드가 실린다. 본문이 바뀐 문항은 필드가 없어 예전 규칙으로 떨어진다(추정 금지). 해설·정답만 바뀐 것은 지정이 유지된다.
- **우선순위:** 정본 판정이 EXACT인 문항은 그 판정이 1순위이고 지정표는 쓰지 않는다. 지정이 같은 학년의 다른 대단원 중단원이면 대단원도 그 중단원의 대단원이 된다. 학년이 다른 중단원(예: 중3 문항을 중2 피타고라스 정리로)은 지정표에 넣지 않는다(문항 학년은 바꾸지 않는다). 판정이 NOT_IN_2022인 문항도 넣지 않는다(예전처럼 미지정).
- **도구:** `node archive/tools/build-middle-parent-assignments.mjs --ledger <final.jsonl> [--unresolved <out.jsonl>]`로 판정 원장(한 줄에 한 문항 JSONL)을 지정표로 바꾼다. `OTHER_BIG_UNIT` 행은 판정자가 적은 대단원·중단원 이름이 같은 학년의 정본 중단원 하나와 정확히 맞을 때만 풀고(학년 접두어·공백 차이만 맞춘다), 아니면 추정하지 않고 `unresolved`로 낸다. `--check`는 지정표 파일을 검증한다. 원장(`final.jsonl`, 근거글 포함 약 3MB)은 Git에 넣지 않고 Drive에 두며, 지정표 `basis.ledgerSha256`에 해시만 남긴다. 문항을 더 판정했으면 원장을 합쳐 도구를 다시 돌린다. 지정표를 손으로 고치지 않는다.
- **워커:** 워커(`apmath/worker-backup/worker`)는 단원 분류(`archive2-unit-tree`·`archive2-unified-units`·`unit-past-exams-core`)를 번들하지 않는다. 지정표 변경은 워커 재배포 대상이 아니다(`tools/ci/apms-worker-bundle-paths.txt`의 파일을 건드리지 않았다).
- **검사:** `tests/archive2-middle-parent-assignments.test.js`(지정 문항이 지정 중단원으로 감, EXACT 1순위, 지문이 다르면 무시, 키가 전부 정본, 카탈로그 필드가 지정표와 일치). 운영 데이터의 정확한 개수는 고정하지 않는다.

## CURRENT — REVIEW2 등록 완화 (2026-11-13, 사용자 결정)

두 번 독립 판정(REVIEW2) 경로에만 적용한다. 다른 승인 유형(FINAL_QA, META_PIPELINE_AUDIT)과 나머지 검사는 그대로다.

- **원본이 갖지 않은 칸:** 시험지 JS가 `standardCourse`/`standardUnitKey`/`subUnitKey`/`level`을 아예 갖지 않으면 REVIEW2 등록과 검색 투영 검증이 이를 불일치로 보지 않는다. 값이 있는데 다르면 이전처럼 거부한다. `level`은 원본에 없으면 만들어 넣지 않는다(있는데 하·중·상이 아니면 거부).
- **검수 상태:** 시험지의 `reviewStatus`와 등록 후 `reviewed_pass`의 차이는 REVIEW2에서 소비자 충돌로 거부하지 않는다(`verifyConsumerValues`의 `blockingConflicts`와 `verify-changed-uid-consumer-approval.mjs`의 METADATA_CONFLICT 판정에서 `reviewStatus`만 제외). 시험지 파일은 고치지 않는다.
- **유형 경로를 정할 수 없는 문항(`typeHold`):** 항목에 `typeHold: true`를 두면 단원·소단원과 판정된 CrossConcept·Condition·Integration만 등록한다. PT/TPL이 둘 다 미등록인 문항에만 쓸 수 있고, `after`에 PT/TPL/L3/L4/rpmL3/rpmL4를 넣으면 거부한다. 결과 행은 `metadataStatus: approved_partial_with_explicit_holds`, `fieldStatus.problemType/template: manual_review_pending`, `metaFoundationHoldReason: TYPE_PATH_UNBOUND_UNIT_SUB_ONLY`이며 런타임 행을 만들지 않는다. 크로스워크·봉인 문서·4칸 사전은 건드리지 않는다.
- 도구: `_luna/classify-final/register/`의 `select-ready.cjs` → `build-meta-request.mjs` → `verify-batch.mjs` → `install-batch.sh`.

## CURRENT — 문항 본문 변경 종류 판정기 `source-delta` (등록기 동작은 아직 바꾸지 않음)

- **무엇:** `archive/tools/meta-foundation/source-delta.mjs`는 같은 문항의 옛 본문과 현재 본문을 비교해 무엇이 바뀌었는지 판정하는 순수 모듈이다(`UNCHANGED`·`FIGURE`·`NOTATION`·`SOLUTION`·`STEM_EDIT`·`ANSWER`·`REPLACED`·`NUMBER_MISMATCH`). 지문 계산식은 기존 등록기와 글자 그대로 같고, `NOTATION`은 코드에 이유와 함께 적힌 명시 규칙만 같게 본다(애매하면 아님). 이유: 그림 교체·본문 오류 수정으로 지문이 어긋난 문항의 메타를 떼지 않고, 변경 종류를 꼬리표로 남기는 재결속의 첫 단계다.
- **보고 도구:** `node archive/tools/meta-foundation/source-delta-report.mjs --scope <시험지 경로 접두어> --out <저장소 밖 경로>`는 읽기 전용이며 어긋난 문항마다 git 이력에서 옛 blob을 찾아 분류를 집계한다. 보고서는 Git에 두지 않는다(저장소 안 출력은 거부). `REPLACED` 임계값(`REPLACED_RECALL_THRESHOLD`)은 표본 약 20건으로 정한 값이고 전수 보고로 보정한다.
- 이 PR 시점에서 등록기·빌더·화면 코드는 이 모듈을 쓰지 않는다. 검사: `tests/archive-source-delta.test.mjs`.

- 완성도 확인: `node archive/tools/completion/check.mjs --scope original/middle/m3/1` (읽기 전용, 시험별 요약 + 문항 TSV).
- JSON 증적은 `--format json --out /tmp/completion.json`, 완료 게이트는 `--require complete`를 사용한다. 저장소 내부 출력은 금지한다.
- 실행 이유: 본문·답·풀이·그림과 canonical 메타/4슬롯의 부족 상태를 분리 집계하며, 수학 정오·승인·등록을 자동 변경하지 않는다.
- 상태값: stem·answer `OK|MISSING`(답·풀이의 `.`·`-`·`?`·`TODO`·`null`·`undefined` 단독 값은 `BOILERPLATE`), solution `OK|MISSING|BOILERPLATE`, figure `OK|NOT_NEEDED|FILE_MISSING|BROKEN_SVG`, unit `APPROVED|RECORDED|LABEL_MISMATCH|MISSING`, difficulty `APPROVED|NUMBER_ONLY|INVALID|MISSING`, type `APPROVED|RECORDED|HOLD|INVALID|REGISTRY_UNAVAILABLE|MISSING`, fourSlot `REGISTERED|WRITTEN|STALE|MISSING`, overall `COMPLETE|PENDING_REGISTER|IN_PROGRESS|BLOCKED`. 태그·`&nbsp;`를 벗기고 비어 있으면 없는 값으로 보되 그림·수식 태그(`<img`·`<svg`·`<math`)가 있으면 내용으로 본다. 이유: 빈 값을 완성으로 통과시키지 않기 위해서다.
- `REGISTRY_UNAVAILABLE`은 활성 레지스트리를 읽지 못한 환경 문제다(문항 데이터 결함 아님). 이 상태면 COMPLETE가 될 수 없고, 요약 머리의 `# WARNING` 줄·stderr·`--require complete` 실패 사유에 표시된다. 빈 선택(문항 0개)도 `--require complete`는 실패시킨다.
- 4칸에 `NOT_SUBMITTED`·`EXPLICIT_REVIEW_HOLD:`·`SOURCE_UID_CONFLICT` 저장 사유가 있으면 `reasons`에 그대로 나오고 `PENDING_REGISTER`(등록하면 됨)가 아니라 `IN_PROGRESS`로 본다. unit 불일치는 `UNIT_NAME_DIFFERS`·`UNIT_KEY_NOT_IN_MASTER`·`SUBUNIT_*`로 구분해 `reasons`에 적는다.
- SVG 검사는 `python3`(없으면 `python`)의 XML 파서가 필요하고, 시작할 때 프로브해 쓸 수 없으면 `PYTHON_UNAVAILABLE`로 중단한다(Windows의 Microsoft Store 스텁 포함). 깨짐(`BROKEN_SVG`)은 파서가 ParseError를 낸 경우만이다. `--exam` 하나만 봐도 4칸 등록부 빌더가 전체 4칸 파일을 다시 검증한다(빌더에 시험지 한정 옵션이 없다).
