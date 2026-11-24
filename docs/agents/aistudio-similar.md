# Google AI Studio(Gemini) 유사 시험지 생성·반입

Gemini가 만든 유사 시험지를 반입하는 흐름이다. 운전·검수 도구는 `archive/tools/aistudio-similar/`에 있다. 대기열·결과·시스템 지시문 원본은 Drive(`G:\내 드라이브\AP_유사시험지_마크다운\AI_Studio`)에 있다.

## 무엇·왜

- 원본 시험지 한 부를 올리면 Gemini가 문항마다 조건을 바꾼 유사문항 1개씩, 시험지 단위로 만든다. 이유: 숫자만 바꾼 유사는 학생에게 새 문제가 아니다.
- Claude(Sonnet)는 브라우저 운전과 반입 검수만 한다. 이유: 생성은 Pro 구독 한도 안에서 하므로 Claude 토큰이 들지 않는다.
- 품질 관찰(2026-11): 초반 시험지 10개 중 2개에서 정답이 틀렸다. 정답 번호를 지정해 주자 지정 준수는 100%(pilot 1, 21문항)였다. 정답만 보기 꼴이 다른 누설(FORM_LEAK)은 가끔 난다. 그래서 전 문항 직접 풀이 검수는 유지한다.

## 준비

- 계정 두 개를 같은 Chrome 창에서 쓴다(`/u/0`, `/u/1`). 이유: 한도가 계정별이라 병행하면 처리량이 는다.
- 각 계정의 Drive 동기화 폴더(G:, H:)의 `Google AI Studio` 폴더에 대화가 파일로 저장된다. 결과는 화면이 아니라 이 파일에서 꺼낸다. 이유: 코드 블록을 화면에서 꺼내는 길은 브라우저 필터가 막는다.
- 새 채팅마다 저장된 시스템 지시문 "출제자2"를 고르고 Thinking Level은 Medium으로 둔다. 이유: 새 채팅 기본값은 High라 느리다. 지시문 본문은 Drive의 `유사시험지_시스템지시문.md`.
- 결제·API 키·업그레이드·약관·계정 설정 버튼은 누르지 않는다.

## 생성 절차

세부 클릭 좌표와 코드는 Drive `tools/DRIVER_BRIEF.md`(운전 지시서)에 있다. 요약만 적는다.

1. 대기열 `진행상태.json`에서 첫 todo를 시작 전에 `claimed-A`/`claimed-B`로 바꾼다. 이유: 두 계정이 같은 시험지를 겹쳐 하지 않으려고.
2. `prep-exam.sh <원본 경로> <준비 폴더>`로 원본 `.txt`와 문제 그림 PNG를 준비한다. 이유: `.js`는 업로드가 실패해 `.txt`로 올려야 한다.
3. 새 채팅, 시스템 지시문, 업로드. 시험지 둘을 한 채팅에 섞지 않는다.
4. 절반씩 2번 요청한다(21문항이면 1~11, 12~21). 끊겨 id가 빠지면 빠진 범위만 5문항 단위로 다시 요청한다.
5. 요청 끝에 조련 문구를 붙인다. 이유: 정답 오류와 번호 순환(3 4 1 2 5)을 막는다.
   - `plan-answers.mjs <원본 경로> --name <저장 이름>`이 낸 `정답 번호 지정:` 줄(해당 범위)과 [공통 지시] 문단.
   - `출력 전에 문항마다 정답을 해설과 다른 방법(대입·역산·경우 세기 검산)으로 한 번 더 확인하고, 다르면 고쳐서 낸다. 보기 다섯 개를 나란히 보고 정답만 꼴이 다르면 오답을 고친다.`
6. 요청을 보낸 뒤 약 10분 기다리고 Stop 버튼 유무만 한 번 확인한다. 폴링하지 않는다. 이유: 폴링은 토큰만 쓴다.
7. `merge-prompt.cjs "<Drive 대화 파일>" "<생성\이름.js>"`로 추출한다. count가 문항 수와 같고 id가 1..N이면 완료다. 빠지면 그 번호만 다시 요청하고 다시 합친다(같은 id는 나중 것이 덮어쓴다).
8. `생성\`에는 완성본만 둔다. 중간본은 준비 폴더에 둔다. 이유: 반입 검수자가 `생성\`을 바로 가져가 12/23문항 미완성본이 통과한 일이 있었다.
9. 대기열 항목을 `generated`로 고치고 `prompt`(탭 제목)와 `count`를 적는다.

## 추가 세트(유사2·유사3, variant)

> GPT 채팅창에서 직접 만드는 기출 기반 유사2~N은 [난도 믹서 운영계약](gpt-similar-difficulty-mixer.md)을 추가로 읽는다. 이 문서의 AI Studio 생성·반입 절차 및 이미 실행 중인 프롬프트를 자동 변경하지 않는다.

- 대기열 항목에 `variant`, `out`, `avoid`가 있으면 추가 세트다. 이름 규칙은 `<원본이름>_유사N.js`다. 이유: 아카이브가 이름 규칙으로 "유사문제 N세트 · 보기"에 자동 연결한다.
- 원본 `.txt`와 그림에 더해 기존 유사(유사1, variant 3이면 유사2도)를 `.txt`로 올린다. `avoid` 값이 `<ref>:<경로>`면 `git show "<값>"`으로 꺼낸다.
- 첫 요청 앞에 붙인다: `이번은 추가 세트(유사<variant>)다. 원본과 같은 개념·같은 난이도를 유지하되, 숫자만 바꾸지 말고 조건·주어진 것·묻는 것을 바꾼 변형으로 만든다. 첨부한 기존 유사 세트와 같은 변형(같은 조건 변경, 같은 수치)은 피한다.`
- 같은 원본을 겹쳐 생성했으면 버리지 말고 번호를 붙여 살린다. 이유: 유사 세트는 많을수록 학생 연습량이 늘고 비용은 이미 썼다.
- `variant:1`(기존 유사가 없는 원본)은 avoid가 비고 추가 세트 문단도 없다.

## 반입 검수

체크리스트 원문은 Drive `반입_마무리_체크리스트.md`다. 핵심만 적는다.

- 문항 수·id가 원본과 같은지 센다.
- 전 문항을 발문·보기만 보고 직접 푼다. 원본이 복수 정답 문항이면 유사도 복수 정답일 수 있다. 이유: Gemini 정답 오류가 실제로 있었다.
- 지정한 정답 번호대로 나왔는지 `lint-similar.mjs`로 확인하고 FORM_LEAK(정답만 꼴이 다른 보기)를 고친다. 보기 규칙은 [similar-choices.md](similar-choices.md)다. 수 보기는 크기순(오름 또는 내림)이고 정답 번호 배분(한 번호 30% 초과·3연속·순환 금지)을 지킨다.
- 난이도 보고 기준: 원본보다 조금 어려워지는 것은 괜찮다. 다른 단원이거나 교육과정 밖이거나 확 어려워진 문항만 보고한다. 이유: 학생이 풀 수 없는 문항만 걸러내면 충분하다.
- 서술형은 `[서술형 1]` 하나, 끝은 "…을 구하는 과정을 서술하시오."로 정리한다. 해설은 판서형(한 단계 한 줄, 결론 한 번)으로 정리한다.
- `[그림: …]`은 설명이 발문·해설과 맞는지만 본다.
- 결과는 `결과\<원본이름>_유사N.js`다. main·통합 브랜치에 이미 있으면 N을 올린다.

## 유형 채우기(TYPE_BANK)

문항이 적은 유형(TPL) 하나를 5문항 세트(1 기본형, 2·3 구조변형, 4·5 사고확장)로 채워 `archive/exams/types/high/h2/<stem>.js`로 넣는다. 도구는 `archive/tools/aistudio-typebank/`다. 이유: 유형별 연습 문항이 없는 단원이 있어 숫자만 바꾼 복제가 아니라 판단 단계가 다른 문항이 필요하다.

1. 요청 만들기: `node archive/tools/aistudio-typebank/prep-typebank.mjs --subject geo|calc2 --tpl <TPL|PT 키> [--l4 <RPM id,…>] --short <짧은유형명> --round <N> --out <폴더>`. `request.txt`(AI Studio에 붙임)와 `target.json`(정답 번호·키)이 나온다. 정답 번호는 스크립트가 뽑는다. stem은 `기하_<짧은유형명>_고2_유형은행<N>`/`미적분II_…`다.
2. 생성: 새 채팅(출제자2, Thinking Medium)에 `request.txt`를 한 번에 붙인다. 위 "생성 절차" 6~7번과 같이 `merge-prompt.cjs`로 `merged.js`를 꺼낸다.
3. 반입: `node archive/tools/aistudio-typebank/intake-typebank.mjs merged.js --target target.json --stem <stem>`. 문항 수·id·정답 번호·크기순·꼴 누설(lint-similar 재사용)·메타 키(목표·메뉴 안인지)를 검사하고 `[그림:]`/`[해설그림:]`을 떼어 `<stem>.figures-todo.json`에 옮긴다. 오류가 있으면 파일을 쓰지 않는다. 4칸(item-4slot)은 만들지 않는다(사전 번호와 근거가 필요해 4slot 라인 몫).
4. 풀이 검수: Sonnet이 발문·보기만 보고 5문항을 직접 풀어 정답을 대조한다. 틀리면 해당 문항만 AI Studio에 다시 요청한다.
5. 그림: figures-todo를 SVG 라인에 넘긴다(새 SVG는 엔진으로만, [visual-svg.md](visual-svg.md)). 그림이 붙기 전에는 PR·병합하지 않는다. 그림을 가리키는 발문이 그림 없이 학생에게 보인다.
6. PR: 관제가 순서를 조율한다. 이 PC는 `.git/info/exclude`가 `archive/exams/types/`를 가려 새 파일은 `git add -f`가 필요하다.
- 등록: main에 들어가면 `build_db.py`의 동기화가 `db.js` 행·UID·메타 보류 줄을 만들고(로컬 실행으로 확인, 먼저 `node archive/tools/meta-foundation/question-metadata-format.mjs assemble`, 10분 넘게 걸림), 병합 후 자동 등록기가 파일에 적힌 메타를 정식 등록한다. 등록기는 (교육과정·단원·소단원·PT)의 ACTIVE 바인딩이 정확히 하나 있어야 받는다. 기하 H22-GE-03의 `PT_GEO_SPACE_FIGURE`는 있다. 미적분II H22-M2-08의 `PT_AREA_BY_DEFINITE_INTEGRAL`은 2015 수학II 바인딩뿐이라 `EXACT_COURSE_BINDING_MISSING_OR_AMBIGUOUS`로 거절된다(크로스워크 `DIRECT_BINDING_GAP`). 바인딩 추가(추가 전용 `registryChanges`)나 유형 전용 요청이 먼저 필요하다. 등록기 단계는 로컬에서 돌리지 않았다(NOT_RUN).

### 기하 유형은행 대량 반입 (마플 대응표, 2026-11-23)

AI 스튜디오가 마플 유형 띠(2개씩 묶음 `geo_pNNN`)로 만든 결과(`C:\AI_WS\tmp\typebank\out\geo_*.js`)를 유형별 아카이브 JS로 바꾸는 도구다. 위 1~3번(요청 만들기·intake-typebank)과 달리 **PT/TPL/L4는 대응표에서 기계적으로** 붙이고, 문항별 판단(CrossConcept·Condition·결합 패턴·난이도·4칸)은 DeepSeek 한 라인(`opencode-go/deepseek-v4.1-flash`, 동시 1개)이 맡는다. 한도에 걸리면 기다렸다 재개하며 다른 모델이 대신 쓰지 않는다.

- 명령 한 줄(새 묶음도 같다): `node archive/tools/aistudio-typebank/typebank-geo.mjs all geo_p005.js …` (`prep|judge|apply|report` 단계별 실행도 된다). 입력 위치는 환경 변수 `TYPEBANK_MAPL`(대응표 md)·`TYPEBANK_QUEUE`(`pairs-geo.json`·`queue-geo.json` 폴더)·`TYPEBANK_OUT`(생성 결과)·`TYPEBANK_WORK`(요청서·판정·증거, 저장소 밖)이다.
- 하는 일: ① `keys-geo.mjs`가 (L4 리프, PT, TPL)을 레지스트리와 대조해 없는 TPL·크로스워크 DIRECT_ACTIVE 행을 add-only로 채운다(`geo-tpl-map.json`: 대응표의 새 TPL 후보를 이미 등록된 같은 형태의 TPL로 붙이는 `alias`, 같은 형태가 없을 때만 `newTpl` 정의. 둘 다 없으면 `TPL_UNDEFINED`로 멈춘다). 이유: TPL은 묻는 것 한 단어 굵기이고 같은 형태는 키를 재사용한다. ② 유형(srcImage → `pairs-geo.json`의 items) 하나당 `기하_NNN_<유형>_고2_유형은행N.js`를 `archive/exams/types/high/h2/`에 쓴다(발문의 `[중]` 같은 난이도 꼬리표는 걸러 낸다). ③ 정답 독립 풀이(해설 비공개)·메타 판정을 DeepSeek에 시키고 키·인용·사전·난이도 정수를 검사해 JS 필드·4칸(`archive/data/item-4slot/types/high/h2/<stem>.4slot.json`)에 반영한다. ④ 문항마다 `stage-meta-bridge`의 CREATE 판정(`evaluateMetaStage`)을 돌려 작업 폴더 `<TYPEBANK_WORK>/_generated/<stem>.create-resolver.json`에 남긴다(저장소에 두지 않는다: GIT_RAW_OUTPUT_FORBIDDEN)(PROJECTION_REUSE면 등록기가 같은 PT/TPL을 받는다).
- `[그림: …]` 자리표시는 본문에 그대로 두고 문항 목록(qid, 설명)을 `<작업 폴더>/figures-todo-all.json`에 낸다(SVG 단계 입력). 그림을 넣는 편집이 JS 파일을 바꾸면 4칸 compact의 `sourceGitBlobSha`도 갱신해야 한다.
- 검산: answer가 보기 범위, 해설 마지막 줄 정답 번호 일치는 기계가 보고, 수학 정답은 DeepSeek 독립 풀이와 대조해 불일치·애매한 문항을 `report`가 목록으로 낸다. 모든 메타는 단일 모델 초안(검수 전, `UNREVIEWED`)이다.
- 이 PC는 `.git/info/exclude`가 `archive/exams/types/`를 가리므로 새 JS는 `git add -f`로 올린다. 병합은 SVG가 끝난 뒤 관제와 조율한다.

### 미적분II 유형은행 반입과 두 과목 공통 규칙 (2026-11-24)

같은 도구가 미적분II도 한다: `node archive/tools/aistudio-typebank/typebank-geo.mjs --subject=calc2 all <out 파일>…`(`--subject=`는 명령 앞뒤 어디든, 또는 환경 변수 `TYPEBANK_SUBJECT=calc2`). 입력은 `TYPEBANK_MAPL`(기본 `mapl-types-calc2.md`), 작업 폴더는 기하 작업 폴더 아래 `calc2/`다. 생성기가 더 만들면 새 파일 이름만 이어 붙여 같은 명령을 다시 돈다(이미 판정한 유형은 건너뛴다).

- **키는 대응표가 아니라 크로스워크에서 읽는다(미적분II).** 대응표의 PT 열은 RPM 확장 전 기준이라 NO_MATCH가 많다. 리프(L4)마다 `DIRECT_ACTIVE` 행, `promotesRpmOnlyRowId` 행, 바인딩 공백(`DIRECT_BINDING_GAP`) 행에서 (PT, TPL)을 읽고, 문항이 고른 리프(`rpmPrimaryRecordId`)가 그 문항의 PT/TPL을 정한다. 이유: 같은 유형 띠 안에서도 리프마다 TPL이 달라 첫 리프 하나로 붙이면 문항과 TPL이 어긋난다.
- **바인딩 공백 리프는 resolver가 인정하는 add-only 행으로 올린다.** 같은 PT/TPL·같은 단원의 `DIRECT_ACTIVE` 행을 `promotesBindingGapRowId`로 덧붙인다(`keys-geo.mjs`). 기존 행은 고치지 않는다. 연결된 행이 전혀 없는 리프(예: 삼각함수의 합성 H2-CALC-RPM-162)의 유형은 `geo-tpl-map.json`의 `typeOverride`로 붙이거나 `skip`에 이유를 적어 반입하지 않는다. calc2_098(삼각함수의 합성)은 교육과정 밖이라 `skip`이다.
- **기하의 PT/TPL 정리:** 대응표 TPL 후보는 `geo-tpl-map.json`의 `alias`(같은 형태의 기존 TPL)로 붙이고, 같은 형태가 없을 때만 `newTpl`/`newPt`로 만든다. 대응표에 PT가 없는 유형은 `typeOverride`다. 2026-11-24 반입에서 새 PT 1(`PT_GEO_CONIC_MIXED`)·새 TPL 13을 더했다.
- 2022 미적분II에는 소단원이 없어 문항의 `subUnitKey`는 비우고 단원(`H22-M2-0x`)까지만 적는다.
- 파일 이름에 못 쓰는 문자(`|`, `'` 등)는 stem에서 뺀다. 한 유형의 DeepSeek 호출이 실패해도 다음 유형으로 가고, 실패 목록은 작업 폴더의 `judge-failures.json`에 남는다. DeepSeek 호출은 공용 슬롯(`D:/AP-svg-factory/labor/ds/dsslots.mjs`)을 한 번에 하나만 쥔다.
- `report`는 대기열 `n`보다 문항이 적게 온 유형(`shortOfQueueN`)과 새로 더한 키 수를 같이 낸다.

## 장애 대응

- "Model isn't available right now": 멈춤이 아니다. 10분마다 다시 시도한다. 이유: 혼잡 시간대 일시 장애로 30분쯤 뒤 풀렸다.
- 한도·quota·rate limit·resource exhausted: 1번 재시도하고 같으면 항목을 `blocked-quota`로 적고 그날은 멈춘다. 한도는 17시(KST) 무렵 리셋되므로 그 뒤 재개한다.
- 탭이 멈춤: 2분 뒤 한 번 더 보고, 그대로면 탭을 닫고 새 탭에서 이어한다. 이유: 멈춘 탭은 기다려도 풀리지 않았다.
- 로그인·약관·동의 화면: 멈추고 사람에게 넘긴다.
- 고아 python 루프(`python -`)가 CPU를 먹는지 가끔 확인하고 정리한다.

## 메타·그림·병합

- 메타는 [similar-import 하네스](../../archive/tools/similar-import/JUDGMENT_GUIDE.md)로 만든다. 단일 모델 초안(`DRAFT_SINGLE_MODEL`)이다. 공통 계약은 [metadata.md](metadata.md)다.
- pilot 흐름: `pack-judgment.mjs`로 판정 요청 묶음을 만들어 Gemini에 맡기고, `unpack-judgment.cjs`로 Drive 대화에서 꺼낸 뒤 `errors-for-gemini.cjs`로 오류를 되돌린다. 절차는 `PILOT_DRIVER.md`, 경량 검수는 `LIGHT_REVIEW.md`(둘 다 이 폴더)에 있다.
- 그림은 원본·기존 유사의 같은 번호 그림을 재사용한다(plan 복사 후 숫자·조건만 변경). 원본에 그림 자료가 없을 때만 일반 판정을 한다. 규칙은 [visual-svg.md](visual-svg.md)를 따른다.
- 병합은 병합 라인(관제)이 순서를 조율한다. 반입 작업자는 PR을 임의로 병합하지 않는다.

## 도구(`archive/tools/aistudio-similar/`)

- `common.mjs`는 하네스 위치를 이 저장소 루트로 잡는다. 다른 곳을 쓰려면 `SIMILAR_HARNESS`, 작업 폴더는 `SIMILAR_PILOT_WORK`로 바꾼다. 원본은 `origin/main`에서 읽으므로 먼저 `git fetch origin main`을 한다.
- `prep-exam.sh`, `merge-prompt.cjs`, `plan-answers.mjs`, `lint-similar.mjs`, `stage-similar.mjs`, `refresh-stage.mjs`, `pack-judgment.mjs`, `unpack-judgment.cjs`, `errors-for-gemini.cjs`, `review-list.cjs`.
- Drive 경로(`G:\…\Google AI Studio`)는 데이터 위치라 인자로 넘긴다.

## 추후 방향

- (a) 경량 검수: 걸린 문항만 직접 푼다. pilot 1은 21문항 중 8문항만 풀고 정답 오류 놓침 0이었다. 표본이 1개라 pilot 2 뒤에 정한다.
- (b) 메타 판정도 Gemini에 맡기기: pilot에서 check-judgment 21/21, apply 통과였다.
- (c) ALIVE QID9의 9가지 변형 방향을 요청문에 넣어 유사4 이상을 만든다(나중).
- (d) 시스템 지시문 정본을 저장소로 옮긴다.
- (e) 대기열·운전 스크립트를 저장소로 옮긴다.