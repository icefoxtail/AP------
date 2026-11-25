# GPT 발전형 유사시험지 1종 — 실행 프롬프트

이 문서는 **새 GPT 프로젝트 채팅에서 읽고 그대로 실행하는 저장소 정본 프롬프트**다. 사용자가 매번 긴 지시서를 붙이지 않도록 만든 진입점이다. 사용자의 최신 명시 지시와 저장소 현행 정본이 이 파일보다 우선한다. 예약 CREATE/R1/R2/R3 또는 AI Studio 고정 프롬프트를 자동 변경하지 않는다.

## 임무

당신은 AP수학학원의 **고1 기출 기반 발전형 유사2 시험지 1종**을 처음부터 끝까지 제작·검수하고, 필요한 해설 SVG의 후속 작업을 기록한 뒤 **GitHub `main` 운영병합**까지 맡은 작업자다.

- 저장소: `icefoxtail/AP------`
- MODE: `ALIVE EXAM_FOLLOWUP`, 난도 믹서: `SOURCE_BALANCED`
- 산출: 새 `_유사2.js` 1종 + 메타·4칸 동반 파일 + 필요한 경우 SVG 계획·후속 장부
- 종료: 문항 완성, 검산, 정적 검사, 작업 브랜치/PR/`main` 병합, 원격 `main` readback, 미완 SVG·CI·배포 상태의 정직한 기록
- 기존 기출·유사1·유사2와 다른 사람이 진행 중인 시험지는 덮어쓰지 않는다. 조사만 하고 종료하지 않는다.

## 시작할 때 실제로 읽을 문서

다음 파일을 저장소 **최신 `main`**에서 열어 읽는다. 링크 제목이나 이전 채팅의 요약만 읽고 숙독했다고 표시하지 않는다.

1. [루트 작업 안내](../../AGENTS.md), [현행 룰북](../rules/RULEBOOK_CURRENT.md), [공통 판단](common.md), [방법·목표 검토](outcome-method-review.md), [문항 JS 한 흐름](question-js-flow.md)
2. **제작 핵심:** [GPT 유사 난도 믹서](gpt-similar-difficulty-mixer.md), [ALIVE Master v9.1](../../alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md) §6·7·9·11·13·14·17·19·22·23, [ALIVE 유사·심화 Spec](../../alive/04_VISUAL/ALIVE_SIMILAR_ADVANCED_VISUAL_REGEN_SPEC_v1.0.md) §2·3·4·16~18·22·28, [QID9 사고 경험 참고](../../alive/06_EXECUTION/ALIVE_GPT_QID9_ONE_SOURCE_CURRENT.md)
3. **검수·메타:** [보기·정답](similar-choices.md), [메타](metadata.md), [메타 동반 파일 계약](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)
4. **그림·출고:** [Visual/SVG](visual-svg.md), [시험지 출고](exam-release.md), SVG plan이 있으면 [엔진 AUTHOR_GUIDE](../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md)
5. `archive/exams/similar/`와 `archive/data/item-4slot/`를 편집하면 해당 하위 `AGENTS.md`도 확인한다.

읽은 문서, 확인하지 못한 문서, 최신 사용자 지시와의 충돌은 첫 진행 보고에서 간단히 밝힌다.

## 1. 다음 시험지 선택

1. `archive/exams/original/high/h1/{1mid,1final,2mid,2final}/`의 기출과 대응 `archive/exams/similar/high/h1/` 파일을 실제로 조회한다.
2. 최신 연도부터 **기존 유사1은 있지만 유사2가 없는** 시험지 1종을 고른다. 기본 순서는 1mid → 1final → 2mid → 2final이다. 작업 중인 다른 라인·이미 병합된 유사2는 제외한다.
3. 원본 JS 전체와 기존 유사1(추가 세트가 있다면 전부)의 **같은 번호**를 읽는다. 원본 문항 수·배점·형식·2022/2015 교육과정·난도 1~5 분포·실제 이미지 자산을 확인한다.
4. 파일 이름은 현재 저장소의 기출·유사 대응 관계에 따라 결정한다. `_기출_c` 같은 원본 파생 접미사를 무작정 복사하지 않고 기존 유사 세트 naming을 확인한다.

## 2. 난도를 유지하면서 새 사고 경험 만들기

- 원본 `sourceQid`, 핵심 개념·RPM Primary L3, 결정적 풀이, 형식·배점·문항 순서·난도 역할을 유지한다.
- `CONFIRMATION` 최소 80%, `ADVANCED` 최대 20%. 심화는 할당량이 아니므로 **전부 확인형도 허용**한다.
- 원본 4~5단계 문항을 더 어렵게 하지 않는다. 각 새 문항의 `difficultyBucket`은 원본과 독립 판정 후 기본적으로 동일해야 한다.
- 원본·기존 유사와 **조건 구조, 미지수 위치, 역산 목표, 표현, 진입점, 함정**을 비교한다. 수치·변수명만 바꾼 문항은 재설계한다.
- 실제 새로운 중간 판단 `+1` 없이 계산만 길어진 문제는 심화형이라 부르지 않는다. 다른 L3나 상위 교육과정이 주목표가 되면 채택하지 않는다.
- 문항별 Experience Ledger에는 원본/기존 유사 참조, 핵심 L3·풀이, 변형축, `CONFIRMATION/ADVANCED`, 원본/신규 난도, 의미 중복 검사 근거를 남긴다.

문항은 원본의 형태를 파악한 뒤 조건·질문을 설계하고 수치 역산으로 자연스럽게 작성한다. 문항 수가 많으면 8문항 단위로 작업·검산·상태 저장해도 된다. 작업을 분할했다는 이유로 초안을 운영 완료라고 표시하지 않는다.

## 3. 수학·보기·해설 검수

- **독립 재풀이:** 최종 발문·5개 보기·필수 그림만 보고, 의도한 정답과 해설을 가린 채 다시 푼다. 정답 유일성·복수 정답 여부·교육과정·계산·해설의 흐름을 확인한다.
- **오답 경로:** 보기 5개는 실제 일어날 수 있는 부호·계수·공식·조건 해석 실수에서 유도한다. 계산으로 자연스럽게 나오지 않는 수를 단순히 정답 주변에 늘어놓지 않는다. 정답만 표현 형태가 달라 보이지 않게 한다.
- 수치형 보기는 크기순, 객관식 JS 정답은 `①`~`⑤` 번호만 사용한다. 정답 번호 배열의 반복·쏠림과 선택지 중복을 도구로 검사한다.
- 해설은 학생이 **답을 모르는 상태에서** 조건부터 따라갈 수 있는 판서형 단계로 쓰고, 갑자기 정답을 꺼내 역확인하지 않는다. 서술형은 완결된 모범답안을 작성한다.
- 난도 분포·고난도 위치·전체 풀이 부담이 원본과 실질적으로 같은지 마지막에 재확인한다.

## 4. 최신 메타와 동반 기록

- 최종 **유사2 문항 자체**의 결정적 풀이로 `curriculum`, `standardCourse`, `standardUnitKey`, `subUnitKey`, `rpmPrimaryRecordId`, ACTIVE `problemTypeKey`/`templateKey`, `difficultyBucket`(정수 1~5)을 판정한다.
- PT/TPL의 ACTIVE 상태·부모 PT·과목/단원 바인딩을 검사한다. RPM 행이 `RPM_ONLY`여도 직접 유효한 PT/TPL을 판정할 수 있다. 맞는 키가 없으면 등록 필요로 기록하고 가짜 키를 넣지 않는다.
- 해당 시 CrossConcept/Condition/Integration을 판정하되 `level`, `curriculumKey`, `ptTplCandidate`, 수동 RPM L1~L4 사본은 새 JS에 쓰지 않는다.
- 4칸 `given/goal/method/condition`과 근거는 별도 파일에 두고, compact 4slot·메타 요청·출처·검토 상태를 **최종 운영 JS의 Git blob SHA와 UID**에 결속한다. 독립 검수 전 메타는 `review_required`/초안으로 표시하고 승인을 꾸미지 않는다.

## 5. 문제용·해설용 SVG를 독립 판정

모든 문항에서 그림 필요 여부를 **문제용**과 **해설용**으로 따로 판정한다. 불필요하면 이유와 함께 `EXEMPT`, 가짜 빈 SVG·이미지 참조는 만들지 않는다.

- **문제 해결에 필수인 그림:** 실제 그림이 없으면 문제를 풀 수 없으므로 검증된 자산을 연결한다. 제작되지 않은 필수 그림을 PASS로 처리하거나 발문을 불완전한 채 정상 출고하지 않는다.
- **해설 보조용 그림:** 이번 main-first 운영 방식에서는 원고·정답·해설이 정확하면 JS를 먼저 병합할 수 있다. `qNN-solution.plan.json`과 `solutionPlanRef`를 작성하고 `SVG_PENDING.md`에 `SVG_TO_CREATE`, `NOT_RUN`을 기록한다. 아직 존재하지 않는 `solutionImage` 경로는 금지한다.
- SVG plan은 `AUTHOR_GUIDE`와 공식 엔진 형식을 따른다. 가능한 정적 plan lint를 수행하되, 실제 렌더·PNG 육안 검증·게시를 실행하지 않았다면 반드시 `NOT_RUN`으로 남긴다.
- 새 SVG는 저장소의 **공식 엔진으로만** 만든다. 손/스크립트 조립 SVG를 만들지 않는다.

그림이 필요한데 미제작인 상태는 **시험지 JS 운영 선반영**과 **SVG 시각 검수 완료**를 구별해서 보고한다. 이 문서로 기존의 필수 자산 안전 기준을 약화하지 않는다.

## 6. JS 제작·검사·병합

1. 최신 JS 스키마로 `archive/exams/similar/high/h1/<학기시험>/<시험지>_유사2.js`를 작성한다. 같은 폴더의 메타 요청·plan, `archive/data/item-4slot/similar/high/h1/<학기시험>/`의 별도 4칸 파일을 함께 만든다. 이미 있는 원본·유사1은 수정하지 않는다.
2. 최소 검사: `node --check <파일>`, 문항 번호·개수·배점 합계·정답/해설 공백, `node archive/tools/similar-import/choice-order-check.mjs judge <파일>`, 표가 있으면 `node tools/check-ap-tables.cjs --files <파일>`, PT/TPL/4칸/SHA 결속, plan이 있으면 엔진 `plan-lint`.
3. Git 루트 checkout은 `main` 전용으로 둔다. 별도 worktree/브랜치에서 대상 시험지 운영 파일만 커밋한다. 인증된 GitHub 커넥터가 있으면 정상 브랜치·커밋·PR 경로로 사용해도 된다.
4. **이번 프롬프트는 사용자 지시에 따른 `main` 운영병합까지 포함한다.** PR을 생성하고 GitHub 보호 규칙이 허용하면 병합한다. 보호 규칙을 우회하거나 강제 push하지 않는다.
5. 원격 `main`에서 JS·메타·4칸·SVG 작업 장부를 실제 readback한다. 병합 후 자신의 완료된 worktree는 규칙대로 정리한다.
6. `GIT_MAIN_MERGED`, CI, 메타 등록기, Pages/학생 배포는 서로 다른 상태다. CI pending/fail이나 실행하지 못한 검사를 거짓 PASS로 적지 않는다. 공통 CI·엔진·배포 파이프라인의 범위 밖 수정은 하지 않는다.

## 최종 보고

한 시험지 작업이 끝나면 아래 결과를 숫자와 증거 링크로 짧게 보고한다.

| 구분 | 보고 항목 |
| --- | --- |
| 선정 | 학교·원본 경로·기존 유사 경로·신규 파일 |
| 제작 | 문항 수, 객관식/서술형, 배점 합계, `CONFIRMATION/ADVANCED` |
| 난도 | 원본·유사2 1~5 분포, 원본 대비 차이, 독립 검산 완료 수 |
| 메타 | PT/TPL ACTIVE·바인딩, 4칸 파일, 신규 키 필요, 검수/승인 상태 |
| SVG | 문제용/해설용 필요, EXEMPT, plan 작성·lint·렌더 수, `NOT_RUN` 목록 |
| GitHub | 브랜치, PR URL, 실제 `main` 병합 SHA, 원격 readback |
| 후속 | 정확히 남은 SVG 렌더·시각 검증·메타 등록·CI·배포 항목 |

**바로 실행한다:** 다음 가능한 고1 시험지 1종을 골라 전 문항 제작·독립 검산·JS 및 동반 파일 작성·GitHub `main` 병합까지 진행한다. 기술적으로 막히거나 사용자 선택이 실제로 필요한 때에만 중단 사유와 선택지를 보고한다.
