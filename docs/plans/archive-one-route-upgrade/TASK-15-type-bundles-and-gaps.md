# 작업 15 — 유형 판정 마무리: 묶음표, 고1 빈 문항, 형식 정리 (2026-11-17)

작업 10·11·12 결과표를 관제가 인수 점검했다(23,913줄, 깨진 줄 0, uid 중복 0, PICK 20,564줄의 키 전부 ACTIVE·상위 일치). 판정 품질은 좋다. 등록 요청으로 바꾸려면 아래 네 가지가 더 필요하다. 순서대로 한다. 해설 그림 사양(작업 14)보다 이것을 먼저 한다.

## 왜
- 새 키 제안(NEW_KEY) 3,196줄이 서로 다른 이름 707개로 쪼개져 있고 절반이 1건뿐이다. 이대로 키를 만들면 "같은 풀이 유형의 문항이 한 묶음으로 잡힌다"는 목적을 잃는다. 묶음은 보고서 안의 글로만 있어 기계가 읽을 수 없다.
- 고1 원본 1,197문항은 유형 키가 비어 있는데 판정이 없다.
- 최종 쓰임은 "학교 시험지 하나와 유형·난이도·단원이 닮은 문항으로 다시 뽑기"다. 묶음이 너무 잘면 닮은 문항이 안 잡히고, 너무 크면 닮지 않은 문항이 섞인다. 기준은 "한 묶음 안의 두 문항을 학생에게 같은 유형 연습으로 내도 되는가"다.

## A. 새 PT 묶음표 (기계가 읽는 파일)
대상: 세 결과표의 `decision: "NEW_KEY"` 전 줄(중등 2,322 / 고등 78 / 교과서·유형 796).

1. `docs/plans/archive-one-route-upgrade/type-bundles/new-pt-bundles.json` — 묶음 목록.
   `{"bundle": "<묶음 id, 영문 대문자·밑줄, 예: NPT_M2_REPEATING_DECIMAL_FINITE_CONDITION>", "nameKo": "<이름>", "definition": "<정의 한두 문장: 결정적 풀이 단계>", "course": "<과목·학년 팩: middle1|middle2|middle3|고등 과목…>", "distinctFrom": ["<헷갈릴 기존 PT 키>", ...], "absorbInto": "<기존 ACTIVE PT 키 또는 null>", "count": <문항 수>, "examples": ["<uid>", "<uid>", "<uid>"]}`
2. `.../type-bundles/new-pt-assign.jsonl` — 줄별 대응표. NEW_KEY 줄마다 한 줄: `{"uid": "...", "bundle": "<묶음 id>", "tplHint": "<이 문항에 필요한 세부 유형 한 줄 또는 null>"}`. NEW_KEY 줄 전부가 정확히 한 번 나와야 한다.

### 묶는 원칙 (사용자 지적, 2026-11-17 — 가장 중요)
유형 사전의 첫 설계는 "PT/TPL은 **단어 위주로 단순하게**, 나머지 세부는 CrossConcept·Condition 같은 추가 메타로"였다. 이번 제안이 707개로 쪼개진 원인은 조건·상황·풀이 절차까지 PT 이름에 넣었기 때문이다(예: "연립방정식의 해를 대입한 미정계수 결정", "부등식의 해로 계수관계 복원", "유한순환소수 분모 조건"). 그래서 묶음은 아래 층으로 나눈다.

- **PT = 개념 단어 하나.** 교과서 소단원·핵심 개념 수준의 짧은 명사구(예: "순환소수", "근의 공식", "무게중심", "연립방정식의 해", "지수법칙"). 이름에 "~을 이용한 ~의 ~ 결정" 같은 절차·조건을 넣지 않는다. 한 PT에 수십~수백 문항이 모이는 것이 정상이다.
- **TPL = 그 개념 안에서 묻는 것 한 단어.** 한 단계만 더 나눈다(예: 순환소수 → "유한소수 판별", "분수로 변환", "자릿수 찾기"). TPL도 짧게. 한 PT 아래 TPL은 보통 3~8개.
- **그 밖의 세부는 PT/TPL에 넣지 않고 꼬리표로 뺀다.** 미정계수가 있다, 해의 조건이 주어진다, 도형과 결합한다, 실생활 문장제다, 다른 단원 개념이 같이 쓰인다 같은 것은 `conditionHints`(조건)와 `crossConceptHints`(함께 쓰인 다른 개념)에 짧은 단어로 적는다. 기존 Condition·CrossConcept 키가 있으면 그 키를 쓰고(`docs/architecture/JS_Archive_Meta_Single_Entry_Resolver_CURRENT.md`와 레지스트리에서 목록 확인), 없으면 한글 단어로 적는다. 관제가 나중에 키로 만든다.
- 판단 기준: "이 이름을 수학 교사에게 한 단어로 말했을 때 어떤 문항들인지 바로 떠오르는가." 떠오르지 않을 만큼 길거나 좁으면 PT가 아니라 TPL이나 꼬리표다.
- 기존 사전의 PT 이름 결(예: `PT_M3_POLY_FACTORIZATION`, `PT_CIRCLE_TANGENT`, `PT_BINOMIAL_DISTRIBUTION`)과 같은 굵기로 맞춘다.

이 원칙에 따라 `new-pt-assign.jsonl`의 줄 형식을 넓힌다: `{"uid", "bundle", "tplHint", "conditionHints": ["…"], "crossConceptHints": ["…"]}`. 꼬리표가 없으면 빈 배열.

규칙
- 묶음은 세 결과표를 **가로질러** 만든다. 같은 개념(예: 근의 공식, 순환소수)이 중등 원본과 유형 문제지에서 다른 이름으로 제안돼 있다. 하나로 합친다.
- 기존 ACTIVE PT로 충분한 제안은 새 묶음을 만들지 말고 `absorbInto`에 그 키를 적는다(예: 지수법칙 계산 → `PT_M2_MONOMIAL_MULTIPLICATION_DIVISION`, 원자료 분산·표준편차 → 기존 통계 PT가 맞는지 정의를 읽고 판단). 이때 대응표의 그 줄들은 그 묶음 id를 그대로 쓴다(관제가 PICK으로 바꾼다).
- 1건뿐인 묶음은 가까운 묶음에 합칠 수 있는지 먼저 본다. 정말 다른 풀이면 1건 묶음으로 둔다. 억지로 합치지 않는다.
- 중2는 사전이 얇아(PT 39개) 공백이 크다. 단원별(유리수와 순환소수, 식의 계산, 연립방정식, 부등식, 일차함수, 확률, 도형의 성질·닮음)로 사전의 뼈대를 세운다는 생각으로 묶는다.
- 이름이 없는 119줄(`ACTIVE PT 전체 검토:`)도 문항을 다시 읽고 묶음에 넣는다.
- 목표 규모는 정하지 않는다. 다만 707개 이름이 그대로 707개 묶음이 되면 실패다. 위 원칙대로면 새 PT는 수십 개 규모(중2 단원마다 몇 개씩)가 자연스럽다.
- 먼저 중2 "수와 식"(유리수와 순환소수, 식의 계산) 한 단원만 묶어 `type-bundles/PILOT-m2-number-expr.md`에 묶음 목록과 문항 수를 올리고 관제 확인을 받은 뒤 나머지를 진행한다. 굵기가 어긋난 채 3천 줄을 다 묶는 일을 막기 위해서다. 확인을 기다리는 동안 C(고1 판정)와 D(형식 정리)를 먼저 한다.

## B. 세부 유형(TPL) 묶음표
대상: `decision: "PICK"`이고 `tpl`이 null인 3,331줄.
- `.../type-bundles/new-tpl-bundles.json`: `{"bundle": "NTPL_…", "pt": "<상위 PT 키>", "nameKo", "definition", "absorbInto": "<기존 ACTIVE TPL 키 또는 null>", "count", "examples": [uid…]}`
- `.../type-bundles/new-tpl-assign.jsonl`: `{"uid", "pt", "bundle"}` (묶음에 넣을 근거가 없으면 `"bundle": null` — PT만 등록한다. 억지로 넣지 않는다.)
- 여기도 A의 원칙을 따른다: TPL은 "그 개념 안에서 묻는 것 한 단어"이고, 조건·결합 개념은 `conditionHints`·`crossConceptHints`로 뺀다(대응표 줄에 같은 두 칸을 둔다). 지금 note의 TPL 제안은 정의 문장 2,148종으로 흩어져 있는데, 대부분은 새 TPL이 아니라 기존 TPL + 꼬리표로 풀릴 것이다.
- PT별로 묶는다. 건수가 많은 PT부터: PT_M3_POLY_FACTORIZATION(205), PT_M3_RADICAL_CALCULATION(107), PT_M3_POLY_MULTIPLICATION(89), PT_M3_REAL_NUMBER_COMPARISON(70), PT_M3_QUADRATIC_FUNCTION_PROPERTIES(64) …
- 기존 TPL이 실제로 맞는데 놓친 경우는 `absorbInto`에 그 키를 적는다.
- A에서 만든 새 PT 묶음 아래의 세부 유형은 A의 `tplHint`로 충분하다. 여기서 다루지 않는다.

## C. 고1 원본 빈 문항 1,197건 판정
정본에서 유형 키(`problemTypeKey`)가 비어 있는데 `fieldStatus.problemType`이 `approved_semantic_review`라서 건너뛴 고1 원본 문항이다(77개 시험지, 2학기 중간 641·기말 296이 큼). **상태 꼬리표와 관계없이 유형 키가 비어 있으면 판정 대상이다.** 작업 11과 같은 형식으로 `type-results-d/h1-*.jsonl`에 이어 쓴다(이미 있는 uid는 다시 쓰지 않는다). 목록은 정본 `archive/data/question_metadata.json`에서 `sourceArchiveFile`이 `original/high/h1/`로 시작하고 유형 키가 빈 문항에서 기존 결과표의 uid를 빼면 나온다.

## D. 형식 정리 (값은 바꾸지 않는다)
- `step`이 잘린 2줄을 고친다: `비상_미적분1` 11번("[1,3]에서 "), `비상교육_미적분1` 4번("피적분함수를 ").
- `비상_미적분1.jsonl`(194줄)은 정본에 uid가 없고 `비상교육_미적분1.jsonl`과 같은 책이다. 파일은 지우지 말고 `type-results-t/README.md`에 "등록에는 `비상교육_미적분1`만 쓴다"고 한 줄 적는다.
- `백발백중_공통수학2`는 step이 유형 설명문이라 문항을 특정하지 못한다(같은 문장 최대 76회). 판정은 받아들인다. 다시 쓰지 않아도 된다.
- 표본에서 본 의문 2건을 다시 본다: 비상 확률과통계 확률분포 중단원 6번(`TPL_EXPECTATION_TRANSFORM` → 분포표로 평균을 직접 구하는 문제라 TPL 없이 PT만이 맞아 보임), 복성고 고1 2학기 중간 20번(`TPL_AMGM_PRODUCT_EXTREMUM` → 합의 상한을 구하는 구조). 고칠지 판단해 note에 이유를 적는다.

## 하지 않는 것
- 정본 메타·시험지 JS·레지스트리·등록 요청을 만들거나 고치지 않는다. 등록 변환은 관제가 한다.
- 승인된 중등 문항의 기존 값과 다른 판정(1,503줄 중 PT 153건·TPL 261건)은 그대로 둔다. 관제가 승인 값을 유지하고 차이 목록을 따로 본다.
- 원문 오류 의심(HOLD 153건, note의 "원문 의심" 182줄)은 고치지 않는다. 지금처럼 note에 남긴다.

## 자리와 완료
- 묶음표: 새 브랜치 `data/type-bundles-20261117`의 `docs/plans/archive-one-route-upgrade/type-bundles/`. 고1 추가 판정: 기존 `data/type-judgment-d-20261116`. 형식 정리: 각 결과 브랜치.
- 완료 조건: (A) NEW_KEY 줄 전부가 대응표에 한 번씩 있고 대응표의 모든 bundle이 묶음 목록에 있다. (B) 대상 줄 전부가 대응표에 있다. (C) 고1 빈 문항 가운데 판정 없는 것이 0(HOLD 포함). 각 수치를 `TASK-15-REPORT.md`에 적는다. 묶음 수, absorbInto 건수, 1건 묶음 수, 판단이 갈린 묶음 목록도 적는다.
- 끝나면 작업 14(해설 그림 사양)를 이어 간다.
