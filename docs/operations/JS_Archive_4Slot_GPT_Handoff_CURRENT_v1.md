# 문항 4칸 기록 — GPT 라인 인계 CURRENT v1

상태: CURRENT v1 (2026-11-03, 사용자 결정 "이 작업은 GPT 쪽으로 넘겨 진행"). 4칸 기록 작성을 Claude 시범에서 GPT 라인으로 넘긴다. 규칙 본문은 [4칸·용어 사전 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)이 소유하고, 이 문서는 누가·무엇을·어떤 순서로·어디에 내는지만 정한다. 둘이 다르면 계약이 우선한다.

## 1. 지금까지 한 일

**적용 구분(2026-11-04):** 이 문서의 회차·모델 비교·전용 작업 브랜치·`git add -f` 예외는 기존 자료의 시범/확대 배정에만 적용한다. 신규 기출·유사·ALIVE·교과서·문제집 등은 각 제작 라인에서 [공통 작성·검토·인계 요건](../architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md)에 따라 4칸과 작성·검토 기록을 함께 작성한다. 시범 비교 완료나 이 문서의 전용 브랜치를 신규 작성의 선행조건으로 삼지 않는다. 일반 제작분은 기존 stage-local/Drive 인계와 Git 증거 보존 규칙을 따른다. 이유: 비교 시범의 운영 예외와 모든 신규 결과물의 작성 의무를 구분하기 위해서다.

- 계약·사전 확정: 계약 CURRENT v1, 사전 [term-dictionary-v1.1.json](../architecture/4slot/term-dictionary-v1.1.json)(394용어), 평가 고정본 [term-dictionary-v1-frozen.json](../architecture/4slot/term-dictionary-v1-frozen.json)(393용어). PR #1265. 2026-11-03 사전 v1.2([term-dictionary-v1.2.json](../architecture/4slot/term-dictionary-v1.2.json), 401용어)와 계약 §3-1·§7-1 보강.
- 시범 두 번(계약 §15): 24년 고1 2학기 기말 113쌍(Claude 메인), 25년 고1 2학기 기말 268문항(Sonnet 작업자 4명, 독립·블라인드). 25년 원본 찾기 Top-1 81.3%, Top-3 96.3%, Top-5 쓸 만함 30/30.
- 운영 메타·등록기·catalog·검색 화면은 아직 4칸과 연결하지 않았다. 시범 원자료(작업자 기록, 판정 결과)는 Git에 없다(Claude 세션 작업 폴더). 이유: 증거는 Git에 두지 않는다([git-evidence](../agents/git-evidence.md)).

## 2. 역할 나눔

작성 라인은 GPT로 한정하지 않는다. 2026-11-03 사용자 결정으로 Antigravity(Gemini Flash 계열)로도 같은 1단계를 돌려 비교한다. 아래 표의 "GPT 라인"은 작성 라인 전체를 뜻하고, 제출물의 `judgedBy.agent`에 실제 도구·모델 이름을 적는다. 이유: 저비용 모델 중 어느 것이 충분한지는 같은 시험지로 재 봐야 안다. 로컬 저장소를 다루는 에이전트는 문항 텍스트 추출과 인용 대조에만 스크립트를 쓰고, 4칸 값을 스크립트로 만들지 않는다(계약 §7).


| 누가 | 하는 일 | 하지 않는 일 |
| --- | --- | --- |
| GPT 라인 | 지정 시험지의 문항을 읽고 4칸 JSON을 시험지별로 작성, 자체 점검, 작업 브랜치에 커밋 | main 직접 커밋·push, PR 생성·병합, 작업 폴더 밖 파일 수정(사전·계약·기존 메타·시험지 JS 포함) |
| 사용자 | 대상·모델·작업 브랜치 지정, 완료를 Claude에게 알림 | — |
| Claude 메인 | 제출물 검사(인용 대조·누락·용어), 채점(원본 찾기·Sonnet 비교), 후보 용어 정리, 사전 버전 갱신과 저장소 반영 | GPT 제출물 내용을 몰래 고쳐 PASS 처리 |

이유: 2026-11-03 사용자 결정으로 이 작업은 전용 작업 브랜치에서 한다(제출물 전달을 사람이 대신하지 않도록). 그 밖의 경계는 기존 GPT 라인 규칙([GPT 예약 라인](../agents/gpt-reservation.md))과 같게 두어 main과 운영 파일은 건드리지 않는다. 번호 매기기와 사전 갱신은 한 곳에서 해야 충돌하지 않는다(계약 §10).

작업 브랜치: `work/4slot-gpt-pilot-20261103` (main에서 분기). 작업 폴더: `archive-work/4slot-gpt-pilot-20261103/A/`(원본), `.../B/`(유사). `archive-work/`는 증거용 cold root라 이 브랜치는 main에 병합하지 않는다. Claude가 브랜치에서 읽어 검사·채점하고, 정본 경로가 정해지면 필요한 것만 옮긴다.

## 3. 단계

### 1단계 — 같은 시험지로 GPT 비교 (지금 할 일)

- 대상: 25년 고1 2학기 기말 12개(Sonnet 시범과 같은 문항). 아래 §5 표.
- 실행을 둘로 나눈다. **A회차 = 원본 6개, B회차 = 유사 6개.** 한 회차(한 대화)에서는 자기 세트만 연다. 이유: 원본과 유사를 같은 대화에서 보면 서로의 4칸을 닮게 써서 원본 찾기 점수가 부풀려진다.
- 사전은 현행판([term-dictionary-v1.5.json](../architecture/4slot/term-dictionary-v1.5.json), 749용어)을 쓴다. 사전에 없는 말은 후보로만 적는다. (1단계 첫 실행은 v1.1로 했다.)
- Claude가 받는 즉시 확인하는 것: 인용 원문 일치, 문항 누락, 사전 밖 용어(후보 처리), method 근거 형식. 그다음 원본 찾기 Top-1·3·5와 Sonnet 결과와의 칸별 용어 겹침을 낸다.
- 다음 단계로 가는 판단(사용자 결정): Top-3이 Sonnet(96%)과 크게 다르지 않고 인용 실패가 드물면 GPT로 확대한다. 차이가 크면 어느 규칙에서 갈렸는지 보고 규칙 문구나 모델을 조정해 다시 한다.

### 1단계 결과와 재실행 (2026-11-03)

- Antigravity Gemini 3.8 Flash로 A·B를 돌렸다. 형식·인용은 완벽했으나 원본 찾기 Top-1 63%·Top-3 87%로 Sonnet(82%·97%)보다 낮았다. 원인은 goal의 방법어, method 단계 누락(유사 회차 문항당 용어 5.1개), 특유 구조 누락, condition 누락이었다(계약 §15-6).
- 사용자 결정: "프롬프트를 꼼꼼하게 해서 진행". 계약 §3-1(칸별로 빠뜨리기 쉬운 것)·§7-1(제출 전 문항별 점검)과 사전 v1.2를 반영해 **B(유사 6개)만 다시** 돌린다. 저장 위치 `archive-work/4slot-gpt-pilot-20261103/gemini/B2/`. A는 그대로 비교 기준으로 쓴다. 이유: 약점이 유사 회차에 몰려 있었고, B만 다시 하면 한도를 7~8%만 쓴다.
- B2가 Gemini A와 맞춰 Top-3 90% 안팎 이상이면 같은 지시서로 2단계(예약 라인)로 간다.

- B2 결과(2026-11-03): 문항당 용어 5.2→8.9개, method 1.9→3.5개, goal 방법어 0. 원본 찾기(B2→Gemini A) Top-1 77.6%·Top-3 94.8%·Top-5 98.5%(B→A는 63.4/88.8/95.5%). 보강한 지시서로 Sonnet 수준에 가까워져 2단계로 간다.

### 2단계 — 확대 (1단계 결과를 본 뒤)

- **작업 브랜치 `work/4slot-annotate-v1`** (main에서 분기, main에 병합하지 않음). 회차 지시서 `archive-work/4slot-annotate-v1/RUN_PROMPT.md`, 큐 `QUEUE-original.json`(861개·19,733문항), 도구 `tools/exam-items.cjs`(판정 필드만 꺼냄, questionBank·examData 두 형식)·`tools/validate-4slot.cjs`(FAIL/WARN), 출력 `out/<원래 경로>.4slot.json`. 이유: 지시서·큐·검사기를 한곳에 두어 회차마다 같은 기준으로 돌리고, 작업자가 도구를 매번 새로 만들지 않게 한다(시범에서 회차마다 스크립트를 새로 썼다).
- 큐 순서: 학기 2학기 기말→1학기 중간→1학기 기말→2학기 중간, 학년 고3→고2→고1→중3→중2→중1, 최신 연도부터. 시범 12개는 제외했다.
- 2026-11-03 사용자 결정: 본작업은 원본 기출 큐만 돌린다. 목적은 아카이브 문항을 분류해 두고 검색에 쓰는 것이고, 유사시험지로 하는 비교는 시범으로 충분히 했다. 유사 큐와 원본·유사 블라인드 규칙은 없앴다. 세션을 여러 개 돌릴 때는 실행 프롬프트에 `ORDER=시작-끝`을 주어 범위를 나눈다.

- 순서는 기존 유사시험지 작업 순서를 따른다: 고1 2학기 기말 → 1학기 중간 → 1학기 기말 → 2학기 중간, 각 안에서 고3→고2→고1, 원본과 그 유사시험지를 한 묶음으로. 한 회차는 원본이면 원본만, 유사면 유사만 연다(1단계와 같은 이유).
- 회차당 시험지 수는 사용자가 정한다(기본 1~2개). 제출 형식은 1단계와 같다.
- 확대 중 새 후보 용어는 Claude가 묶음 단위로 정리해 사전 버전을 올린다. GPT는 다음 회차에 새 버전을 읽는다.

### 1회차 결과 (2026-11-03)

- 규모와 수치: 시험지 10개·231문항, 검사기 FAIL 0, 문항당 평균 용어 6.6개(method 3.2개). Gemini 계열 저비용 에이전트가 `work/4slot-annotate-v1`에서 돌렸다.
- 메인이 출력 파일을 직접 검토해 찾은 문제:
  - `사칙연산`을 문항의 약 30%가 method에 넣었다. 무관한 문항이 이 말로 겹쳐 검색된다.
  - 한 칸 안에 같은 용어가 반복된 문항이 16개였다.
  - 사전에 없는 사차식을 넓은 다항식으로 바꿔 적고 후보 선언을 하지 않았다.
  - 작업 보고에 거짓 진술이 둘 있었다: 베이즈정리가 사전에 없다고 했으나 id 635로 있다. 보고서의 "#7 Q20 베이즈 문항"은 실제로 존재하지 않는다.
- 조치: 사전 v1.4(8용어 신설, 계약 §15-8), 계약 §3-1에 규칙 3개 추가, 검사기에 중복 용어 FAIL·method 사칙연산 WARN 추가, 실행 지시서(`RUN_PROMPT.md`)를 v1.4로 갱신, 1회차 출력은 기계적으로만 정리(중복 제거·method 사칙연산 제거).
- 2026-11-04 사전 v1.5: 동의어 505개를 감사해 별개 개념인 59개를 독립 용어로 분리했다(속도/가속도, 분산/표준편차, 정규분포/표준화 등, 계약 §10 7·§15-9). 이유: 위 "한 칸 중복" 정리가 표준화 같은 서로 다른 용어를 동의어로 보고 지웠다. 지워진 16곳은 작업 브랜치에서 되살렸다. 작성 라인은 v1.5로 적는다.
- 이후 운영: 작업자의 보고서는 그대로 믿지 않는다. 메인이 회차마다 출력 파일을 직접 열어 확인하고(보고와 파일 대조, 사전 존재 여부 직접 조회), 그 결과로 다음 회차 지시서를 고친다. 이유: 위 거짓 진술처럼 보고만으로는 검사기가 못 보는 오류를 놓친다.

### 아직 정하지 않은 것 (Claude·사용자)

- (정했다, 2026-11-04) 4칸 파일의 main 경로와 `schemaVersion`, 기계 검사 도구의 저장소 반영: [검수와 main 반영](JS_Archive_4Slot_Review_and_Main_Import_CURRENT_v1.md)이 소유한다. 도구는 `tools/4slot/`, compact 파일은 `archive/data/item-4slot/`. 제출물(증거 파일)은 계속 작업 브랜치의 작업 폴더에 둔다.

## 4. 제출 형식

시험지 1개 = 파일 1개, 이름 `<시험지 JS 파일 이름에서 .js를 뺀 것>.4slot.json`.

```json
{
  "schemaVersion": "archive-meta-4slot-v0",
  "sourceArchiveFile": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
  "sourceGitBlobSha": "dcd0d7a4cd4afb009ce85ee1927c24ad18500aaf",
  "dictionaryVersion": "term-dict-v1.4-2026-11-03",
  "judgedBy": {"agent": "gpt-<모델 이름>", "run": "A", "at": "2026-11-04"},
  "items": [
    {
      "sourceOrdinal": 1,
      "format": "옳지 않은 것 고르기",
      "slots": {
        "given":     [{"term": "다항식", "src": "choices", "quote": "$3x-1$"}],
        "goal":      [{"term": "판정", "src": "stem", "quote": "유리식이 아닌 것은?"}],
        "method":    [{"term": "정의", "src": "solution", "quote": "꼴로 나타낼 수 있는 식", "evidenceType": "NAMED"}],
        "condition": []
      },
      "reasons": {"method": "유리식의 정의로 각 보기를 판별"},
      "steps": [],
      "scenarioNote": ""
    }
  ],
  "candidates": [
    {"term": "전체집합", "en": "UNIVERSAL_SET", "synonyms": [], "kind": "대상", "parent": "집합", "note": "부분집합·여집합을 정하는 기준 집합", "usedIn": [3, 7]}
  ],
  "selfCheck": {"items": 22, "quotesChecked": 180, "quotesNotFound": 0, "notes": ""}
}
```

- `sourceOrdinal`은 시험지 JS의 문항 `id`다. `questionUid`와 지문(QBODY·QFULL)은 Claude가 받을 때 채운다. 이유: GPT가 직접 계산하면 식이 조금만 달라도 값이 어긋난다(계약 §12).
- `src`는 `stem`(문항 `content`), `choices`(보기 중 하나), `solution`(해설) 중 하나. `quote`는 그 텍스트에 **글자 그대로**(LaTeX·공백 포함) 있는 5~40자.
- `term`은 사전의 `ko`(대표 표기)나 `synonyms` 중 하나. 문항이 쓰는 정확한 개념이 사전에 없으면 넓은 말로 바꿔 쓰지 말고 `candidates`에 선언해 같은 이름으로 쓰고, 사전의 상위 용어도 같은 칸에 함께 적는다(계약 §10). 선언에는 `en`(영문 대문자 코드)·`synonyms`·`kind`·`parent`·`note`·`usedIn`을 모두 채운다.
- method 항목마다 `evidenceType`(`NAMED`/`IMPLIED`). IMPLIED면 `"justification": "왜 같은 방법인지 한 줄"`이 필수.
- `format`은 계약 §5의 9개 값 중 하나.
- `selfCheck`는 제출 전 자기 점검 결과다. 인용을 원문에서 찾지 못한 것이 있으면 고친 뒤 제출하고, 끝내 못 고친 것은 `notes`에 적는다.

## 5. 1단계 대상 (main 기준 Git blob SHA, 2026-11-03)

| 회차 | 파일 (`archive/exams/` 아래) | blob SHA |
| --- | --- | --- |
| A | `original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js` | dcd0d7a4cd4afb009ce85ee1927c24ad18500aaf |
| A | `original/high/h1/2final/25_순천고_2학기_기말_고1_기출.js` | d542c9841e60bdb4a56e106fd58be6f46f0bb7c2 |
| A | `original/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2.js` | decfc40a552c4f7be80889b971e630e2d5cc3525 |
| A | `original/high/h1/2final/25_제일고_2학기_기말_고1_기출.js` | b9b8c8649f1b47adf41b9bcc07cc94af0647a55e |
| A | `original/high/h1/2final/25_팔마고_2학기_기말_고1_기출.js` | 5576281f2328c7a9f5cad69ae09829c5a7c8a20f |
| A | `original/high/h1/2final/25_효천고_2학기_기말_고1_기출.js` | c2c0397e70b46b081b5129b88c5185938bfb8dc7 |
| B | `similar/high/h1/2final/25_금당고_2학기_기말_고1_유사.js` | dd61011746b3ae714bc56c0c5f017e03401a37d8 |
| B | `similar/high/h1/2final/25_순천고_2학기_기말_고1_유사.js` | 8119ce12e1d45998e82a8396a76e0d274e96f7eb |
| B | `similar/high/h1/2final/25_순천여고_2학기_기말_고1_공통수학2_유사.js` | 5699950d9ad2be2c27f13108450fcff85ff81589 |
| B | `similar/high/h1/2final/25_제일고_2학기_기말_고1_유사.js` | 86c55ed12e95ce33faae8027a26dace12e754c68 |
| B | `similar/high/h1/2final/25_팔마고_2학기_기말_고1_유사.js` | 6bae74fae9764888517c331b1e483b4a45608a2d |
| B | `similar/high/h1/2final/25_효천고_2학기_기말_고1_유사.js` | 1cf187cf5ec89bc97f9b63737e1420450b251eda |

- 문항 수: 원본 134, 유사 134(학교별 22·23·21·22·23·23).
- 유사 JS에는 `problemTypeKey`·`templateKey`·`crossConceptKeys`·`conditionKeys`·`sourceQid` 같은 기존 메타 필드가 있다. **읽지 않는다.** `content`·`choices`·`solution`(그리고 그림이 있으면 그림)만 본다. 이유: 키를 보고 채우면 키 치환이 되고(계약 §7), `sourceQid`를 보면 원본 찾기 평가가 무의미해진다.
- 그림이 있는 문항(`image` 필드)은 그림을 함께 본다. 이유: 25년 Sonnet 시범에서 그림 없이 채운 문항은 given·condition이 빠질 수 있었다(계약 §4).

## 6. 로컬 에이전트(Antigravity·Codex 등)가 지킬 것

- 스크립트는 문항 텍스트 꺼내기(content·choices·solution·image만), 인용 대조, 형식 검사에만 쓴다.
- 문항별 4칸 값을 JSON으로 저장하는 스크립트는 써도 되지만, 그 안의 값은 문항을 읽고 직접 적은 것이어야 한다. 키워드 매칭·정규식·용어 목록 대조로 용어를 자동 선택하지 않는다. 이유: 그러면 키 치환과 같은 오류가 생긴다(계약 §7).
- `archive-work/`는 `.gitignore`에 걸려 있으니 결과 파일만 `git add -f`로 올린다. 보조 스크립트는 커밋하지 않는다.
- 다른 회차 폴더와 반대 세트 시험지는 열거나 검색하지 않는다.

## 7. 지켜야 할 것 (요약)

- 문항의 발문과 해설을 읽고 판정한다. PT/TPL/CC/COND 키나 단원명을 보고 채우지 않는다.
- 수 범위 제한(자연수·정수·실수·구간)은 condition에 적는다. 배정과 분배를 구분한다. 문장제 소재는 `scenarioNote`에만.
- 시범 결과 파일(Sonnet 기록)을 찾거나 요청하지 않는다. 이유: 비교 대상을 보면 비교가 안 된다.
- 작업 브랜치의 자기 회차 폴더에만 커밋한다. main에는 쓰지 않는다. 사전·계약에서 고칠 점을 발견하면 제출물 `selfCheck.notes`에 적는다.
