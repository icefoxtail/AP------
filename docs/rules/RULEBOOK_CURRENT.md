# JS Archive 룰북 (현행 한 권)

2026-11-18 제정. 지금 지켜지는 규칙만 한 줄씩 모았다. 규칙마다 이유 한 줄과 상세 문서 링크를 붙인다. 새 규칙을 만들지 않고 현행 문서와 사용자 결정만 옮겼다.

## 0. 이 책의 지위

- 우선순위는 **사용자 최신 지시 > 이 책 > 영역별 작업 문서(`docs/agents/*.md`, 이름에 CURRENT가 붙은 현행 계약) > 옛 봉인 문서(`docs/rules/` 안, 참고용)**다. 이유: 봉인 문서 51개 중 어느 것이 이기는지 정해져 있지 않았다. → [AGENTS.md](../../AGENTS.md)
- 이 책과 옛 봉인 문서가 다르면 이 책을 따른다. 단 봉인 문서 중 데이터(단원키 마스터테이블, RPM `CANONICAL_MASTER.json`)는 그대로 정본이다. 이유: 코드와 테스트가 그 파일을 직접 읽는다. → [마스터테이블](01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md)
- 이 책과 영역 문서가 다르면 이 책을 따르고, 어긋난 영역 문서를 고친다. 이유: 같은 주제를 두 곳이 다르게 말하면 작업자가 옛 쪽을 따른다.
- 이 책에 없는 세부만 해당 영역 문서를 연다(지도는 8장). 새 사용자 지시는 해당 영역 문서에 추가한다. 이유: 이 책을 짧게 유지하기 위해서다. → [AGENTS.md](../../AGENTS.md)
- 규칙 뒤의 날짜는 사용자 결정일이다. 결정이 바뀌면 같은 날 영역 문서와 이 책을 함께 고친다. 이유: 잠금 해제 결정이 문서에 늦게 반영돼 옛 문구로 작업을 시작한 줄이 있었다. → [metadata.md](../agents/metadata.md)

## 1. 공통 원칙

- 문항·정답·해설·그림은 학생이 풀고 이해할 수 있는지, 수학·교육 정확도로 판단한다. 원본은 사실·출처를 대조하는 근거이지 "원본과 같아야 합격"의 기준이 아니다. 이유: 기계적 동일성보다 학생이 쓸 수 있는 결과가 목적이다. → [AGENTS.md](../../AGENTS.md)
- **이미 들어온 시험지의 수정은 ① 수정 프로토콜(최소 수정·직접 검산·정답/해설/보기 함께·사후 보고) → ② 작업자 재량 → ③ 원본 대조(참고) 순이다(우선 적용).** 원본 대조가 필수인 것은 처음 만들 때(CREATE·첫 반입)뿐이고, 검수 분류는 "수정함/오탐" 둘뿐이다. "원본 확인 대기"·"판단 불가"로 남기거나 사용자에게 원본 확인을 부탁하지 않고, 문항·시험지 파일을 바이트로 고정하는 보류를 두지 않는다. 아래·봉인 문서의 "원본 대조 필수" 문구보다 이 줄이 먼저다. 이유: 원장님 결정 2026-11-11·11-23·11-24. → [common.md](../agents/common.md)
- 완료 기준은 "학생이 쓰기에 적당한가"(오류, 깨진 그림, 가려지는 내용, 동작하지 않는 버튼)다. 수치상 완벽을 요구하지 않는다. 이유: 보고만 믿고 넘겨 학생에게 필요한 값이 빠진 그림이 게시된 일이 있었다. → [CLAUDE.md](../../CLAUDE.md)
- 사용자가 정한 결과·고정 요구와 제안된 실행 방법을 구분하고, 방법은 실제 근거로 검증한다. 이유: 사용자가 작업 방법까지 책임질 필요는 없다. → [outcome-method-review.md](../agents/outcome-method-review.md)
- 범위는 최신 지시의 대상과 종료 조건이다. 한정 수정은 지정 대상과 직접 의존 부분만 고치고, 범위 밖 발견은 보고만 한다. 이유: 한정 수정이 전수 재검으로 번지는 것을 막는다. → [common.md](../agents/common.md)
- 실행하지 않은 검사는 `NOT_RUN`, 근거가 부족하면 `EVIDENCE_DEBT`로 쓴다. 근거 없는 PASS, 추정 메타값, 가짜 `NONE`을 쓰지 않는다. 이유: PASS는 실제 확인을 뜻해야 다음 작업자가 믿는다. → [AGENTS.md](../../AGENTS.md)
- 테스트·검사를 생략·격리하거나 분모를 줄이고 기준을 완화해 통과시키지 않는다. 이유: 통과가 품질 증거여야 한다. → [AGENTS.md](../../AGENTS.md)
- SHA·해시는 버전·출처를 잇는 근거로 두되, 값이 다르다는 이유만으로 오류를 확정하지 않는다. 이유: 승인된 변경으로 값이 바뀔 수 있다. → [AGENTS.md](../../AGENTS.md)
- 검사는 결함 조건(누락·중복·깨진 참조 0 등)으로 쓴다. 계속 늘어나는 운영 데이터의 개수 같은 변하는 값을 상수와 비교하지 않는다. 이유: 시험지가 늘 때마다 고정 숫자를 고치는 수정이 반복됐다. → [token-efficiency.md](../agents/token-efficiency.md)
- 추가 전수 측정은 사용자가 요청했거나 개수 자체가 결과물일 때만 한다. 기본은 대표 표본이다. 이유: 인쇄 잘림 수정 한 단계가 전 학년 출력물을 몇 시간 측정했다. → [token-efficiency.md](../agents/token-efficiency.md)
- 무거운 검사는 단계당 한 번, 한 번에 하나만 돌린다(전체 테스트는 병합 직전 1회). 이유: 동시에 돌리면 시간 기준 테스트가 흔들려 재실행이 늘었다. → [token-efficiency.md](../agents/token-efficiency.md)

## 2. 문항 데이터와 불변

- 신규 문항은 기본 스키마(`id, category, standardCourse, standardUnitKey, content, choices, answer, solution, subUnitKey, layoutTag, wide` 등)를 보존한다. `layoutTag`는 `grid`, `wide`는 `false`가 기본이다. 이유: 필드 계약이 흩어져 문서마다 다르게 말했다. → [메타 필수 요건 §2](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)
- 메타만 고치는 작업은 `content/choices/answer/solution/image/layoutTag/wide`에 손대지 않는다. 이유: 메타 작업이 학생이 보는 문제를 바꾸지 않게 한다. → [메타 필수 요건 §4](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)
- 메타 결속 지문은 발문과 보기 하나뿐이다. 해설·정답·그림·다른 메타가 바뀌어도 이미 한 판정은 유지하고, 발문·보기가 바뀌는 오류 수정 때만 다시 판정한다. 그림이 곧 문제·보기인 문항만 예외로 그림도 결속한다(2026-11-18). 이유: 해설을 다듬거나 그림을 교체할 때마다 검수된 메타가 무효가 되어 등록 대기가 수천 건 쌓였다. → [metadata.md](../agents/metadata.md)
- 원본 시험지 JS(`archive/exams/original`)를 고칠 때는 바뀐 필드를 확인하고 그 시험지를 고정한 해시를 찾는다. `solution`만 바뀌면 같은 PR에서 고정 해시를 갱신하고, `content·answer·choices`가 바뀌면 고정값을 바꾸지 않고 멈춰 보고한다. 이유: 그 문항에서 나온 생성문항을 다시 검토해야 한다. → [common.md](../agents/common.md)
- 원문 오류는 메인이 판단해 정답 수정, 보기 최소 수정, 새 문항 교체까지 할 수 있다. 조건은 독립 계산 두 번 일치, 별도 PR, 공유 데이터 고정값 절차, 사후 보고다(2026-11-12 사용자 결정). 이유: 사용자가 원문 오류 처리를 메인 판단에 맡겼다. → [common.md](../agents/common.md)
- 시험지 이미지는 `archive/assets/images/<시험지키>/`에 둔다. 시험지 폴더 안이나 저장소 최상위에 두면 R2로 올라가지 않아 학생 화면에서 그림이 깨진다. 기존 그림을 바꿀 때는 새 파일 이름을 쓰거나 `?v=` 값을 올린다. 이유: 해설 그림 199개가 이렇게 빠졌고, 같은 이름이면 옛 그림이 캐시에서 보인다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 원본 기출은 `engine.html?data=exams/<file>&mode=exam|sol|ans`로 바로 열리게 유지한다. 원본 전체를 브라우저 저장소에 복사해야 열리는 구조로 되돌리지 않는다. 이유: 클릭 반응과 저장소 오류에 강해야 한다. → [archive2-code.md](../agents/archive2-code.md)
- 해설·정답 열람은 잠그지 않는다(2026-11-10). 이유: 공부용으로 받은 학생이 풀다가 바로 확인하는 경우가 있다. → [archive2-code.md](../agents/archive2-code.md)
- 원본 JS의 명백한 기계적 손상(깨진 태그, 잘린 문자열, 제어 문자 등)은 묻지 않고 먼저 복구하고 병합 때 보고한다. 이유: 뻔한 손상을 묻느라 학생 화면의 깨짐이 오래 남았다(사용자 결정).

## 3. 메타

- **새 문항의 작성자는 최소 한 벌만 고른다:** `curriculum`, `standardUnitKey`·`subUnitKey`, `rpmPrimaryRecordId`, PT·TPL, `difficultyBucket`, CrossConcept·Condition·Integration, 4칸(별도 파일). RPM 글자 `rpmL1~L4`는 등록기가 번호에서 채우고, 읽는 곳 없는 사본(`rpmPrimaryL1~L4`, `rpmPrimary{}`, `curriculumKey`, 맨 `L1~L4` 등)은 요청에도 원본 JS에도 쓰지 않는다. 기존 값은 지우지 않고 그대로 읽는다(2026-11-19). 이유: 같은 것을 여러 칸에 쓰면 칸끼리 어긋난다(하/중/상 사고). → [metadata.md](../agents/metadata.md)
- **난이도는 정수 `difficultyBucket` 1~5만 판정한다. 새 문항에 `level`(하/중/상)을 쓰지 않는다.** 이전 문항의 `level`은 지우지 않고 보존하며 하/중/상에서 정수로 환산하지 않는다(2026-11-18 21시 KST부터). 이유: 같은 것을 두 번 물어 작성 모델이 같은 정수에 "중"과 "상"을 섞어 채웠다. → [metadata.md](../agents/metadata.md#난이도는-정수-15만-2026-11-18-21시-kst부터-적용)
- 난이도는 정의·공식을 바로 쓰면 1이고, 줄 수·서술형·배점·계산량은 올리는 이유가 아니다. 애매하면 낮게 잡고 경계 플래그로 표시한다. 이유: 1차 표본에서 어긋난 문항 대부분이 높게 잡은 쪽이었다. → [metadata.md](../agents/metadata.md)
- 단원·소단원 키는 마스터테이블에 실제 있는 것만 쓴다. `RAW-`·`UNMAPPED-`·`PROPOSED-` 키를 정식 분류로 쓰지 않는다. 소단원 묶음표는 표시·선택용이고 키는 바꾸지 않는다. 이유: 없는 키는 화면의 필터와 설명을 틀리게 만든다. → [메타 필수 요건 §2](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)
- RPM Primary는 해당 학년 교육과정 안에서 학생이 재현할 최종 풀이로 레코드 번호 하나를 고른다. 경로에서 번호를 거꾸로 찾거나 번호에서 TPL을 계산하지 않고, CrossConcept·Condition으로 Primary를 대체하지 않는다. 이유: 한 경로가 번호 여럿에 걸리고, 교육과정 밖 해법은 학생 해설과 어긋난다. → [Resolver](../architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md)
- **유형(PT·TPL) 키는 문항·해설의 결정 단계를 읽은 직접 판정이 정본이다. "공식 Resolver 결과만"이라는 제한은 없다**(2026-11-16·17). 지킬 것은 근거 문장, 키가 ACTIVE, TPL의 상위가 고른 PT, 세 가지다. 이유: 유형은 계속 늘어나는 분류라 한 판정기에 묶을 수 없고 유형 칸이 대부분 비어 있었다. → [metadata.md](../agents/metadata.md)
- 맞는 키가 없으면 가까운 키에 억지로 붙이지 않고 정식 `registryChanges`로 새 키를 만든다. 이름·정의는 같은 형태 문항이 재사용할 수 있게 일반화하고, 다음 문항이 같은 형태면 그 키를 재사용한다(2026-11-02). 이유: 문항과 모순되는 키는 학생 화면의 유형 설명을 틀리게 하고, 키가 늘어나는 것을 막는다. → [metadata.md](../agents/metadata.md)
- PT는 개념 단어 하나, TPL은 그 안에서 묻는 것 한 단어로 짓는다. 조건·상황·절차는 Condition·CrossConcept에 적는다(2026-11-17). 이유: 이름에 절차를 넣은 새 PT 제안 3,196줄이 서로 다른 이름 707개로 갈렸다. → [metadata.md](../agents/metadata.md)
- 상태는 문턱이 아니라 꼬리표다. 값이 있으면 쓰고 막는 것은 실제 결함(없는 키, 학년·과목 불일치, 발문·보기가 바뀐 문항)뿐이다. 비어 있는 메타는 모델 하나로 채워 초안(`DRAFT_SINGLE_MODEL`)으로 표시하고 승인된 값은 덮어쓰지 않는다(2026-11-18). 이유: 등록 대기 약 13,000건. → [metadata.md](../agents/metadata.md), [Meta OS](../architecture/JS_Archive_Meta_OS_CURRENT.md)
- 새로 만들거나 고치는 문항은 JS, 확장 메타, 4칸, 작성·검토 기록을 함께 인계한다. 4칸은 발문과 해설을 읽고 판정하며 PT/TPL 키나 라벨로 치환하지 않는다. 이유: JS만 받고 메타·기록을 놓치지 않기 위해서다. → [메타 필수 요건](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md), [4칸 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)
- 공유 크로스워크(`archive/data/meta-foundation/crosswalks`)는 행을 추가만 하고, 생성문항 Meta는 공식 도구로만 등록하며 해시 필드를 손으로 고치지 않는다. 이유: 한 행 추가가 승인 생성문항 약 171건의 해시를 어긋나게 했다. → [common.md](../agents/common.md)

## 4. 해설과 그림

- 학생용 해설은 해당 연도·학년·과목 교육과정 안에서 논리적으로 완결되게 쓰고, 학생 관점에서 따라갈 수 있게 한다. 이유: 교육과정 밖 공식으로 쓴 해설은 학생이 따라갈 수 없다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 학생에게 보이는 설명은 한국어 교육과정 용어로 쓰고, 그림에 raw TeX·caret·영어 제작 메모·debug 문구가 보이지 않게 한다. 이유: 제작 흔적이 그대로 학생 화면에 나갔다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- **해설 그림은 풀이 과정의 값을 넣고, 정답이 그림에 보여도 반려하지 않는다. 정답·새 보조선을 숨기는 규칙은 문제 그림에만 적용한다**(2026-11-17). 이유: 학생 화면은 정답을 해설 그림보다 먼저 보여 주므로 숨겨도 막는 것이 없고 그림만 빈약해진다. → [visual-svg.md](../agents/visual-svg.md)
- 그림은 저장소의 SVG 엔진으로 만들고 손으로 SVG를 쓰지 않는다. 작성 규칙은 AUTHOR_GUIDE가 정본이다. 이유: 엔진 출력만 관측기가 식·라벨·눈금을 다시 대조한다. → [AUTHOR_GUIDE](../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md), [visual-svg.md](../agents/visual-svg.md)
- 그림 판정은 학생 기준이다. 라벨은 대상 곁에 두고(떠 있으면 지시선), 같은 각·길이는 같은 색으로 묶고, y=x 대칭·정사각형·기울기가 중요하면 가로·세로 눈금을 같게 한다(`equalUnits`). 합동·닮음 해설은 문제 배치 그림과 대응 도형을 떼어 펼친 그림을 함께 보인다. 이유: 눈금 비 차이로 y=x가 가파르게 그려진 그림이 두 단계 검수를 통과한 일이 있다. → [visual-svg.md](../agents/visual-svg.md)
- 그림 안의 분수는 좌표·띠·공식 어디서든 세로분수로 쓰고 빗금 분수를 쓰지 않는다. 작아져도 양보하지 않는다. 이유: 학생이 교과서에서 보는 모양과 같아야 읽힌다(사용자 결정).
- 닮은 도형을 떼어 그릴 때는 실제 닮음비대로 크기를 달리 그린다(2026-11-11). 이유: 같은 크기로 그리면 닮음이 합동처럼 보인다.
- 색은 관계를 구분하는 데만 쓰고, 선 모양·직접 라벨·경계선으로도 구분되게 한다. 그림과 보기 바탕은 흰색이 기본이다. 이유: 색을 구분하기 어려워도 읽혀야 한다. → [visual-svg.md](../agents/visual-svg.md)
- 최상위 `<svg>`에 `viewBox`와 같은 비율의 `width`·`height`를 넣는다. 이유: `viewBox`만 있으면 래스터 인쇄에서 그림이 크게 잘린 글자 하나로 나온다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 그림을 예외로 빼거나 쪽수를 이유로 생략하지 않는다. 엔진이 못 그리면 지시선·plan 구조 변경을 먼저 시도하고, 그래도 안 되면 `UNSUPPORTED`로 두고 빠진 기능을 적는다(2026-11-11). 이유: 해설이 몇 쪽이든 그림을 빼지 않는 것이 학생에게 좋다. → [visual-svg.md](../agents/visual-svg.md), [archive2-code.md](../agents/archive2-code.md)
- 해설 그림 장부는 시험지 하나에 파일 하나이고 전용 도구로만 읽고 쓴다. 이미 PUBLISHED인 문항은 명시적으로 넘길 때만 바뀐다. 이유: 일부 문항만 다시 게시하다 기존 게시 402문항이 OPEN으로 덮인 사고가 있었다. → [visual-svg.md](../agents/visual-svg.md)
- 그림의 제작과 검수는 서로 다른 인스턴스가 하고, 검수가 PASS한 것만 게시한다. 렌더하지 않은 그림은 PASS로 적지 않는다(`NOT_RUN`). 이유: 제작자가 자기 그림을 승인하면 독립 검수가 아니다. → [visual-svg.md](../agents/visual-svg.md)

## 5. 조판·화면·인쇄

- **배치는 엔진이 자동으로 정한다.** 모든 문항을 기본 칸(`grid`)에 먼저 놓고, (쪽당 4문항 배치) 글자가 10.8px 밑으로 줄어드는 문항만 한 단 전체로 올린다. 데이터의 `layoutTag`·`wide`는 처음 배치에서 무시한다. 수동 지정은 `layoutForce: "subjective-2up"`뿐이다(2026-11-18). 이유: 사람이 붙인 옛 태그가 과해 짧은 문항이 한 단을 통째로 차지했다. → [archive2-code.md](../agents/archive2-code.md)
- **전폭(`fullwidth`) 배치는 쓰지 않는다**(`solutionImageLayout: "fullwidth"` 포함, 2026-11-18). 이유: 큰 그림이 칸을 채워 풀이 쓸 자리가 없고 배치 규칙끼리 다퉜다. → [archive2-code.md](../agents/archive2-code.md)
- 한 쪽 안의 읽는 순서는 항상 문항 번호 오름차순(왼쪽 단 위→아래, 오른쪽 단 위→아래)이다. 쪽 수 증가와 빈 자리는 감수한다(2026-11-18). 이유: 서술형이 낀 쪽에서 21→23→22로 읽혔다. → [archive2-code.md](../agents/archive2-code.md)
- **그림 크기는 단 폭 비율 하나다**: 문제 그림 75%, 해설 그림 80% 이하이고, 한 그림만 키우려면 `imageScale`·`solutionImageScale`(30~100)을 쓴다. 옛 등급 필드는 A4 배치에서 크기에 영향이 없다(2026-11-21). 이유: 한 단 안에서 그림을 읽기 쉽게 키우고 풀이 공간을 확보한다. → [archive2-code.md](../agents/archive2-code.md)
- 문항 하나가 칸에 안 맞아도 시험지 전체를 막지 않는다. 그 문항만 단계적으로 키워 다시 쪽을 나누고, 쪽 전체는 특별한 경우만 쓴다. 이유: 문항 하나가 넘쳐 시험지 전체가 출력되지 않았다. → [archive2-code.md](../agents/archive2-code.md)
- 표는 AP Table Engine이 그린다. 파이프 표로 쓰고 셀의 수식은 `$…$`로 쓰며 class·style·border는 쓰지 않는다. 인계 전에 `node tools/check-ap-tables.cjs --files <파일>`로 FAIL 0을 확인한다. 이유: 표 디자인은 엔진이 정하고 깨지는 표는 검증기가 잡는다. → [table-engine.md](../agents/table-engine.md), [표 계약](01_CANONICAL/AP_Table_Engine_Contract_v1.md)
- **렌더 엔진 파일(`engine.html`, `mixed_engine.html` 등)의 바이트·해시·줄수를 상수와 비교하는 검사를 만들지 않는다.** 문항 수, 렌더 준비 완료, 수식 오류 0, 넘침 없음 같은 결함 조건을 검사한다(2026-11-18). 이유: 인쇄 핫픽스의 `?v=` 한 줄까지 CI를 깨뜨려 엔진을 고칠 때마다 알려진 실패가 쌓였다. → [archive2-code.md](../agents/archive2-code.md)
- 시험지 문자열 처리(`wrapLatex` 등)는 `archive/render-text.js` 한 곳에서만 고친다. 이유: 두 HTML이 복사본을 따로 가져 한쪽만 고친 사고가 쌓였다. → [archive2-code.md](../agents/archive2-code.md)
- 화면·검색·출력·저장 코드는 먼저 Archive2 런타임 계약을 읽고, 병합 전에 `node tools/check-archive2-runtime.cjs`를 통과시키며 흐름을 바꿨으면 실제 Chrome으로 확인한다. 이 검사를 완화하지 않는다. 이유: 느린 클릭, 빈 창, 저장소 의존 회귀를 막는다. → [런타임 계약](01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md), [archive2-code.md](../agents/archive2-code.md)
- 화면 색·글꼴·모양은 `archive/archive2-tokens.css`와 `archive/DESIGN.md`를 따른다. 이유: 화면마다 모양이 달라 완성도가 낮아 보였다. → [archive2-code.md](../agents/archive2-code.md)

## 6. 제작·검수 흐름

- 원본 시험지의 기본 종료는 CREATE → R1 → R2 → R3 → 프로덕션 JS·필수 에셋의 main 반영과 원격 일치 확인이다. 등록·배포는 별도 요청 범위다. 이유: 등록·배포를 병합 선행조건으로 자동 추가하지 않기 위해서다. → [exam-pipeline.md](../agents/exam-pipeline.md), [Fast Lane](02_PIPELINES/JS_Archive_2.0_Codex_Fast_Lane_CURRENT_v1.md)
- CREATE는 전 문항을 직접 풀어 해설 초안과 동반 메타를 쓴다. R1은 정답·해설을 보기 전에 전 문항의 독립 답을 동결한 뒤 비교한다. 신규 R2는 별도 검수자가 전 문항의 현재 해설을 학생 관점에서 검산·개선한다. R3는 바뀐 것·열린 것·직접 의존과 최종 구조·표시만 확인한다. 이유: 단계마다 책임이 겹치면 전수 재검이 반복된다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 신규 문항에 항목·시험지 단위 HOLD를 발행하지 않는다. 결함은 담당자·문항·다음 행동을 정해 직접 수정하고, 복구할 수 없으면 승인된 ALIVE 문형으로 대체한다. 이유: 결함은 반환이 아니라 수정·대체로 완성해야 한다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 시험지 작업 중에는 공유 도구·검증기·렌더러·등록기·CI를 고치지 않는다. 도구 수정은 따로 맡긴 작업에서만 한다. 이유: 도구 수정은 따로 맡긴 작업의 책임이다. → [exam-pipeline.md](../agents/exam-pipeline.md)
- 추출이 끝난 발문·보기·수식·이미지는 JS와 실제 에셋을 기본 입력으로 쓰고 PDF 전 페이지 대조를 하지 않는다. 필요한 문항·사실만 골라 대조한다. 이유: 전체 훑기는 비용이 크고 결함 문항만 원문이 필요하다. → [exam-pipeline.md](../agents/exam-pipeline.md), [추출 입력 우선](02_PIPELINES/Archive_Extracted_Source_First_v1.md)
- 수정은 서브에이전트가 하고 검수는 수정자와 다른 인스턴스가 한다. 위치를 아는 20줄 안팎의 작은 수정은 메인이 직접 하고 관련 테스트와 diff만 확인한다(2026-11-18). 검수는 바뀐 부분과 관련 테스트만 다시 돌린다. 이유: 작은 수정에 지시서·검수 왕복을 붙이면 수정보다 토큰이 몇 배 든다. → [CLAUDE.md](../../CLAUDE.md), [token-efficiency.md](../agents/token-efficiency.md)
- 작업 지시서에는 최종 결과, 고정 요구·금지, 읽을 정본, 성공 기준을 쓰고 끝이 열린 "전체 측정"은 쓰지 않는다. 이유: 완료 증거가 분명해야 작업자가 멈출 곳을 안다. → [outcome-method-review.md](../agents/outcome-method-review.md), [token-efficiency.md](../agents/token-efficiency.md)
- **유사시험지 반입**은 변환 → 후보·빈 틀 생성 → 작성자 판정 → `check-judgment` → 검수 묶음 → 다른 실행의 검수자 판정 → `apply-judgment` → 병합 순서다. 작성자는 풀어 본 뒤에 저장 정답을 보고, 검수자도 먼저 풀어서 적는다. 수학 내용은 고치지 않고 정답이 다르면 `answerMatches:false`로 보고해 시험지를 보류한다. 이유: 도구가 형식을 잡고 모델은 판단만 하며, 저장 정답을 베낀 영수증은 거짓이 된다. → [JUDGMENT_GUIDE](../../archive/tools/similar-import/JUDGMENT_GUIDE.md)
- 유사시험지 반입의 작성자 판정은 Gemini(안티그래비티), 최종 검수·수정은 Sonnet이 맡고, 검수가 끝난 시험지만 병합한다. 처리 순서는 최근 연도부터 내림차순이다(2026-11-18). 이유: 작성 모델 산출물을 바로 운영에 넣는 것은 위험하고, 최근 시험지가 먼저 쓰인다.
- GPT 예약 라인(MASTER/CREATE/R1/R2/R3, 유사 라인)은 공용 README와 정확히 한 역할 파일을 실제 본문으로 읽고 만든다. 문서를 고쳐도 기존 예약이 바뀌지는 않는다. 이유: 예약 prompt는 별도로 읽어 확인해야 한다. → [gpt-reservation.md](../agents/gpt-reservation.md), [README_CURRENT](02_PIPELINES/gpt-reservation/README_CURRENT.md)

## 7. 병합·배포·Git

- **검수를 통과한 변경은 CI 결과와 관계없이 병합한다. CI 수리는 병합이 끝난 뒤 관제 세션이 모아서 한다**(2026-11-17). 병합 전에 바뀐 부분의 관련 테스트는 직접 돌리고, 실패는 수리 목록에 적는다. 이유: CI 수리를 기다리며 검수 통과 변경이 하루 가까이 멈췄다. → [common.md](../agents/common.md), [MAIN_FIRST](../operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md)
- 병합은 묶을 수 있으면 묶는다. main 병합마다 단일 writer가 등록을 돌리고, 밀린 등록은 정시 실행이 소화한다. 작업자에게 등록 JSON 작성을 다시 요구하지 않는다. 이유: 병합마다 밀린 전체를 훑느라 한 건이 12~17분 걸렸다. → [CLAUDE.md](../../CLAUDE.md), [자동 등록](../architecture/Archive_Main_Merge_Auto_Metadata_CURRENT.md)
- 자료 묶음의 등록 실행이 도는 동안에는 병합을 멈추고, 준비된 PR은 실행이 시작되기 전에 한 묶음으로 넣는다(2026-11-18). 이유: 몇 분마다 병합해 등록기가 매번 다시 만들었고 배포가 몇 시간 밀렸다.
- 보호 규칙 우회, 강제 push, 다른 사람 브랜치 이력 재작성을 하지 않는다. 충돌은 병합으로 푼다. 이유: 이력 손상은 되돌릴 수 없다. → [AGENTS.md](../../AGENTS.md)
- 병합과 배포는 따로 기록한다. `GIT_MAIN_MERGED`는 CI·Pages·학생 배포 성공을 뜻하지 않는다. 학생 Pages 배포는 릴리스 게이트를 통과해야 하고 실패하면 기존 사이트가 유지된다. 이유: 병합 성공을 배포 성공으로 읽으면 학생 화면 오류를 놓친다. → [MAIN_FIRST](../operations/Archive_MAIN_FIRST_CI_DEFERRED_CURRENT.md)
- 공유 데이터 고정값 절차를 지킨다: 봉인 레지스트리를 손으로 넓히지 않고, `CROSSWALK_DIGEST_NOT_SEALED`가 나오면 검사를 끄지 않고 공식 도구를 `--write`로 다시 돌려 봉인한다. 이유: 서로 다른 세션의 정상 작업이 main CI와 학생 배포를 두 번 막았다. → [common.md](../agents/common.md)
- 승인된 판본은 고치지 않고 장부(`docs/operations/edition-ledger/ledger-v1.json`)에 "같은 판본" 행을 끝에만 덧붙인다. 발문·보기가 실제로 바뀌었으면 행이 아니라 사람 재판정이다. 이유: 배치·엔진 한 줄을 고칠 때마다 관계없는 문항의 승인이 낡아 CI가 빨개졌다. → [common.md](../agents/common.md)
- Git에는 운영 소스·자산·런타임·도구·현행 계약만 커밋한다. 원시 이력·캡처·로그·렌더 출력은 Drive에 둔다. 이유: 증거가 저장소를 키웠다. → [git-evidence.md](../agents/git-evidence.md)
- 저장소 루트 폴더는 `main` 전용이다. 커밋·브랜치 전환·파일 작업은 자기 워크트리에서 한다. 내 PR이 병합되면 그 워크트리를 바로 지우고 남의 것·미병합은 지우지 않고 보고한다. 이유: 루트에서 작업한 줄 때문에 루트가 main보다 1,679커밋 뒤처졌고, 워크트리(약 7GB)가 C 드라이브를 채웠다. → [git-evidence.md](../agents/git-evidence.md)
- 보고에는 한 일, 확인 근거(실행한 명령과 결과), 남은 일, 사용자 결정이 필요한 것을 쓴다. 이유: 읽는 사람이 PASS와 NOT_RUN을 구분해야 한다. → [common.md](../agents/common.md)

## 8. 부록

### 8.1 한 장 지도

| 하려는 일 | 이 책 + 읽을 문서 |
| --- | --- |
| 모든 작업 시작 | 0·1장 + [AGENTS.md](../../AGENTS.md), [outcome-method-review.md](../agents/outcome-method-review.md) |
| 시험지 제작·검수 | 2·3·4·6장 + [exam-pipeline.md](../agents/exam-pipeline.md) |
| 시험지 출고, main 병합 | 7장 + [exam-release.md](../agents/exam-release.md), [common.md](../agents/common.md) |
| 문항 메타 | 3장 + [metadata.md](../agents/metadata.md), [Meta OS](../architecture/JS_Archive_Meta_OS_CURRENT.md) |
| 해설·문제 그림 | 4장 + [visual-svg.md](../agents/visual-svg.md), [AUTHOR_GUIDE](../../archive/tools/geometry-equation/production/AUTHOR_GUIDE.md) |
| 표 | 5장 + [table-engine.md](../agents/table-engine.md) |
| 화면·엔진 코드 | 5장 + [archive2-code.md](../agents/archive2-code.md), [런타임 계약](01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md) |
| 유사시험지 반입 | 6장 + [JUDGMENT_GUIDE](../../archive/tools/similar-import/JUDGMENT_GUIDE.md) |
| GPT 예약 라인 | 6장 + [gpt-reservation.md](../agents/gpt-reservation.md) |
| ALIVE Generated | [alive-generated.md](../agents/alive-generated.md) |
| Git·Drive·워크트리 | 7장 + [git-evidence.md](../agents/git-evidence.md) |
| 토큰·검사 운영 | 1장 + [token-efficiency.md](../agents/token-efficiency.md) |

### 8.2 이 책이 대체하는 옛 문서 (`docs/rules/` 안 파일명, 참고용으로만 남음)

- 01_CANONICAL: 프로젝트_컨텍스트, JS아카이브룰북_v2.6, JS아카이브_문항메타_파운데이션_운영규칙_v1, JS아카이브_difficultyBucket_5단계_운영규칙_v1.3, JS아카이브_세부단원_운영규칙_v1, JS아카이브_Meta_RPM_ACTIVE_공용Resolver_계약_v1, JS아카이브_단원순서_주개념분류_운영규정_v1, JS아카이브_학생용해설_운영규칙_v1, JS아카이브_문항조판_운영규칙_v1
- 02_PIPELINES: COMMON_PROTOCOL_v1.2.10, 공통파이프라인_실행계약_v1, 작업방식_5문항배치루프_필수, 작업방식_적응형배치루프_v1, 수정프로토콜, 수정후보고프로토콜, 해설프로토콜, 문제해설추출, JS_변환_프롬프트, JS_문항품질_업그레이드, 발문·보기 추출 프로토콜 v4, 코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1, JS_Archive_2.0_Codex_Execution_v1, JS_Archive_2.0_Common_Quality_Contract_v1, JS_Archive_2.0_Codex_Canary_Canonical_v1, JS_Archive_Automation_Stable_Operating_Contract_v1(보관: 90_ARCHIVE/2026-11-18_superseded), JS_Archive_Scheduled_Worker_Prompt_Canonical_Template_v1(보관: 90_ARCHIVE/2026-11-18_superseded), Archive_No_Stop_Pipeline_Final_Debt_v1(보관: 90_ARCHIVE/2026-11-18_superseded), Archive_Authority_Write_Pending_Materialization_v1, Archive_Final_Item_Direct_Replacement_v1(보관: 90_ARCHIVE/2026-11-18_superseded), Archive_GPT_Artifact_First_Lightweight_v1, Archive_작업전_Golden_Sample_Calibration_v1, JS_ARCHIVE_R2E_INTAKE_TO_MAIN_v1(보관: 90_ARCHIVE/2026-11-18_superseded)·v3, Past_Exam_V3_COMPLETE, GENERATED_ARTIFACT_GIT_POLICY_v1, GPT_격리작업공간_실행규칙_v1(보관: 90_ARCHIVE/2026-11-18_superseded)
- 03_REVIEW: JS아카이브_1차검수_프로토콜, JS아카이브_2차검수_프로토콜, JS아카이브_3차검수_프로토콜, JS아카이브_PHYSICAL_EVIDENCE_BEFORE_PASS_v1, 무결성검수, 수학_문항오류_검증_프로토콜_v2.1
- 04_VISUAL: JS_Archive_GPT_Visual_Production_Contract_v1, 도형추출, 기하_시각자료_해설_독립검수_통합운영규정_v1.1, 도형의방정식_해설_SVG_독립검수_운영규정_v1.1, AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4
- 00_RULES_INDEX(읽기 순서·디렉터리 역할 부분)

대체되지 않는 것: 단원키 마스터테이블, `taxonomy/**`(RPM `CANONICAL_MASTER.json`), `02_PIPELINES/gpt-reservation/*_CURRENT.md`, AP_Table_Engine_Contract_v1, Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1, Fast_Lane_CURRENT_v1, Archive_Extracted_Source_First_v1, 04_VISUAL의 Problem_Bank_* 게이트 2개, MANIFEST. 이유: 코드·테스트·하네스가 읽거나 현행 계약이다. 옛 문서를 보관 폴더로 옮기는 일은 다음 PR이다.
