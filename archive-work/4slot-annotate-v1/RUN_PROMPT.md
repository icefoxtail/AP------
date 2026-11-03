# 4칸 기록 본작업 — 회차 지시서 (v1.1, 2026-11-03: 사전 v1.4)

이 파일은 작업 브랜치 `work/4slot-annotate-v1`의 회차 지시서다. 실행할 때마다 이 파일을 처음부터 끝까지 읽고 그대로 따른다. 실행 프롬프트는 `N`(이번 회차 시험지 수)만 정해 준다. 대상은 원본 기출 큐 하나다(2026-11-03 사용자 결정: 목적은 아카이브 문항을 분류해 두고 나중에 검색에 쓰는 것이고, 유사시험지 비교 시범은 충분히 했으므로 유사시험지는 돌리지 않는다).

이 기록은 약 2만 2천 문항 중에서 쌍둥이·유사 문항을 골라내는 데 쓰인다. 형식보다 **이 문항을 다른 문항과 구별해 주는 용어를 빠짐없이 적는 것**이 더 중요하다. 빨리 끝내는 것보다 문항마다 꼼꼼히 하는 것이 목표다. 시범(25년 고1 2학기 기말)에서 이 지시서 수준으로 했을 때 원본 찾기 Top-3가 87%에서 95%로 올랐다.

## 0. 준비와 필독

1. `git fetch origin` → `git checkout work/4slot-annotate-v1` → `git pull`.
2. 아래 문서를 `git show origin/main:<경로>`로 끝까지 읽고, 답변 맨 앞에 경로와 origin/main 커밋 SHA를 적는다.
   - `docs/architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md` — §1(용어·대표 표기)·§2·§3·§3-1·§4·§5·§7·§7-1·§8·§10을 정독한다.
   - `docs/operations/JS_Archive_4Slot_GPT_Handoff_CURRENT_v1.md` — §4 제출 형식, §6 로컬 에이전트 규칙.
   - `docs/architecture/4slot/term-dictionary-v1.4.json`(`dictionaryVersion` `term-dict-v1.4-2026-11-03`) — 용어 690개. 작업 브랜치에 같은 경로로 들어 있으므로 origin/main에 아직 없으면 작업 폴더의 파일을 읽는다. 시작 전에 ko·synonyms를 훑어 쓸 수 있는 말을 먼저 익힌다. `status: RETIRED` 용어는 쓰지 않는다.
3. 이 폴더의 도구를 쓴다. 새로 만들 필요 없다.
   - 문항 꺼내기: `node archive-work/4slot-annotate-v1/tools/exam-items.cjs archive/exams/<경로>.js [시작번호] [끝번호]` — 판정에 쓰는 필드(발문 Q, 보기 C, 해설 S, 그림 IMG)만 보여 준다.
   - 검사: `node archive-work/4slot-annotate-v1/tools/validate-4slot.cjs <제출 파일>` — FAIL은 반드시 0, WARN은 그 문항으로 돌아가 다시 본다. v1.4부터 **한 칸 안의 같은 용어(동의어를 풀어 같은 번호가 되는 경우 포함)는 FAIL**, **method의 `사칙연산`은 WARN**이다.

## 1. 이번 회차 대상 고르기

- 큐 파일: `archive-work/4slot-annotate-v1/QUEUE-original.json`의 `list`를 `order` 순서로 본다.
- 출력 파일 `archive-work/4slot-annotate-v1/out/<path에서 .js를 .4slot.json으로>`이 **origin 브랜치에 이미 있는 시험지는 건너뛴다**(`git pull` 후 확인).
- 남은 것 중 앞에서부터 `N`개를 이번 회차 대상으로 한다. 실행 프롬프트가 `ORDER=시작-끝` 범위를 주면 그 범위 안에서만 고른다(세션 여러 개를 동시에 돌릴 때 범위를 나눠 겹치지 않게 하기 위해서다). 시작할 때 대상 목록(order·path·문항 수)을 답변에 적는다.

## 2. 참고하지 않는 것

- 문항에서 읽는 것은 발문·보기·해설·그림뿐이다. problemTypeKey, templateKey, crossConceptKeys, conditionKeys, L1~L4, 단원명, semanticMeta, tags 같은 메타 필드는 보지 않는다(`exam-items.cjs`는 이것들을 보여 주지 않는다). 이유: 키를 보고 채우면 키 치환이 된다(계약 §7).
- 다른 시험지의 4칸 기록을 불러와 베끼지 않는다. 문항마다 직접 읽고 정한다.

## 3. 문항 하나를 처리하는 순서 (모든 문항에 똑같이)

1. 발문·보기·해설을 끝까지 읽는다. 그림(IMG 또는 발문 속 img 경로)이 있으면 파일을 연다.
2. 해설을 단계로 나눈다. 단계마다 "무슨 개념으로 무엇을 정하는가"를 한 줄 메모한다. 단순 사칙계산 단계는 뺀다.
3. **format**: 계약 §5의 값 하나.
4. **given**: 문제에 이미 주어진 대상. 사전의 가장 구체적인 용어(함수보다 이차함수·유리함수, 도형보다 원·직선·이등변삼각형). 넓은 말을 함께 써도 된다.
5. **goal**: 구하거나 판정·증명하는 대상만. 대입·계산·치환·정리·적용·변형 같은 방법어는 쓰지 않는다(method로).
   - "f(3)의 값" → [함숫값] / "상수 k의 값" → [매개변수, 결정] / "넓이의 최솟값" → [넓이, 최솟값] / "옳은 것을 모두 고르면" → [판정]
6. **method**: 2에서 나눈 결정적 단계마다 그 단계의 개념을 하나 이상. 보통 2~4개. 하나뿐이면 해설을 다시 읽는다. 해설이 이름을 말하면 `evidenceType: NAMED`, 이름 없이 쓰면 `IMPLIED` + `justification` 한 줄.
   - `사칙연산`은 method에 쓰지 않는다. 문항의 핵심이 계산 자체일 때(분수 계산·식의 값 계산 단원)만 예외다. 이유: 1회차에 문항의 30%가 사칙연산을 달아 서로 무관한 문항이 같은 용어로 겹쳤다.
   - 한 칸 안에 같은 용어를 두 번 쓰지 않는다(예: method `정규분포, 정규분포`). 단계가 둘이면 서로 다른 개념(이항분포 → 정규분포근사 → 표준화)으로 쓴다.
   - 사전에 없는 말(예: 사차식)은 넓은 말(다항식)로 바꿔 쓰지 말고 후보로 선언한다(계약 §10). 넓은 말은 같은 칸에 함께 써도 된다.
7. **특유 구조**: 같은 단원의 다른 문항과 이 문항을 구별하는 구조를 반드시 적는다(예: 반복합성, 주기, 가법성, 고정점, 대칭이동, 평행이동, 최단거리, 대우, 귀류법, 경우분류, 배정, 분배, 상대순서고정, 근의분리, 조립제법, 부분분수). 넓은 말(함수·합성함수·집합·명제)만으로 끝내지 않는다.
8. **condition**: 발문의 제약을 모두. 수 범위(자연수·정수·실수·구간), 부호(양수·음수), "모든 x에 대하여"(항상성립), "서로 다른"(구별가능), 정의역 제한, 중복 제한. 정말 없을 때만 비운다.
9. 모든 용어에 `src`(stem/choices/solution)와 `quote`(그 텍스트에 글자 그대로 있는 5~40자).
10. 계약 §7-1 여섯 가지를 이 문항에 대해 확인한다. 하나라도 "아니오"면 고친다.

용어 고르기:
- 사전의 ko 또는 synonyms만 쓴다. 대표 표기(ko)로 적는 것을 우선한다.
- **사전에 없는 정확한 개념을 넓은 말로 바꿔 쓰지 않는다.** `candidates`에 선언(term·en·synonyms·kind·parent·note·usedIn)하고 그 이름으로 쓰며, 같은 칸에 사전의 상위 용어도 함께 적는다(계약 §10). 표기만 다른 말은 후보로 올리지 말고 사전 용어를 쓴 뒤 `selfCheck.notes`에 "동의어 추가 필요: X → Y".
- 소재 이름은 칸에 넣지 않고 `scenarioNote`에. 배정(서로 다른 대상을 칸에 대응)과 분배(같은 대상을 나누어 넣기)를 구분한다.

## 4. 스크립트 사용 범위

- 허용: `exam-items.cjs`·`validate-4slot.cjs` 실행, 네가 문항마다 직접 적은 값을 JSON 파일로 저장하는 스크립트.
- 금지: 키워드 매칭·정규식·용어 목록 대조로 용어·칸·format을 자동으로 고르는 것, 한 문항의 값을 다른 문항에 복사하는 것, 다른 시험지의 4칸을 불러와 쓰는 것.
- 보조 스크립트는 커밋하지 않는다.

## 5. 제출 (시험지마다)

- 파일: `archive-work/4slot-annotate-v1/out/<path에서 .js를 .4slot.json으로>` (예: `out/original/high/h2/2final/25_강남여고_2학기_기말_고2_수학II.4slot.json`). 형식은 인계 문서 §4.
- `sourceArchiveFile` = 큐의 `path`, `sourceGitBlobSha` = 큐의 `blob`, `dictionaryVersion` = "term-dict-v1.4-2026-11-03", `judgedBy` = {"agent": "<도구>-<실제 모델 이름>", "run": "original-<회차 첫 order>-<끝 order>", "at": "<날짜>"}.
- `sourceOrdinal`은 `exam-items.cjs`가 보여 주는 `=== 번호`다(questionBank는 id, examData는 number).
- `validate-4slot.cjs`가 FAIL 0일 때만 커밋한다. WARN은 해당 문항을 다시 보고, 그대로 두면 이유를 `selfCheck.notes`에 적는다. `selfCheck`에는 items, quotesChecked, quotesNotFound, warningsRechecked(다시 본 문항 번호), notes.
- 커밋은 시험지마다 하나: `4slot original #<order>: <시험지 이름>`. 결과 파일만 `git add -f`(archive-work는 .gitignore 대상).
- push 전에 `git pull`, 그다음 push. 강제 push 금지. 이 폴더(`archive-work/4slot-annotate-v1/out/`) 밖 파일은 수정하지 않는다. main 커밋·push, PR 생성·병합 금지.
- 시험지 하나가 끝나면 커밋·push까지 마치고 다음 시험지로 간다. 이유: 한도로 회차가 중간에 끊겨도 끝난 시험지는 남는다.

## 6. 회차 보고 (짧게)

- 처리한 시험지(order·이름·문항 수·커밋 SHA)
- 문항당 평균 용어 수, method 평균 개수, 인용 불일치(고친 뒤), WARN 재검토 수
- candidates 목록(시험지별), "동의어 추가 필요" 목록
- "사전에 없다"고 쓰기 전에 사전 `ko`와 `synonyms`를 검색해 확인한다. 이유: 1회차 보고가 사전에 있는 베이즈정리(635)를 없다고 했다.
- 애매했던 문항은 실제 결과 파일의 order·문항 번호를 그대로 적는다. 결과 파일에 없는 내용을 쓰지 않는다. 이유: 1회차 보고가 #7 Q20을 베이즈 문항이라 했으나 실제로는 신뢰구간 문항이었다.
- 판단이 애매했던 문항 3개 이내, 규칙·사전에서 고칠 점
- 걸린 시간과 한도 사용량(알 수 있으면), 다음 회차가 시작할 order
