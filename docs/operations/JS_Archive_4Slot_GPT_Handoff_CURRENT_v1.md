# 문항 4칸 기록 — GPT 라인 인계 CURRENT v1

상태: CURRENT v1 (2026-11-03, 사용자 결정 "이 작업은 GPT 쪽으로 넘겨 진행"). 4칸 기록 작성을 Claude 시범에서 GPT 라인으로 넘긴다. 규칙 본문은 [4칸·용어 사전 계약](../architecture/JS_Archive_Item_4Slot_Term_Contract_CURRENT_v1.md)이 소유하고, 이 문서는 누가·무엇을·어떤 순서로·어디에 내는지만 정한다. 둘이 다르면 계약이 우선한다.

## 1. 지금까지 한 일

- 계약·사전 확정: 계약 CURRENT v1, 사전 [term-dictionary-v1.1.json](../architecture/4slot/term-dictionary-v1.1.json)(394용어), 평가 고정본 [term-dictionary-v1-frozen.json](../architecture/4slot/term-dictionary-v1-frozen.json)(393용어). PR #1265.
- 시범 두 번(계약 §15): 24년 고1 2학기 기말 113쌍(Claude 메인), 25년 고1 2학기 기말 268문항(Sonnet 작업자 4명, 독립·블라인드). 25년 원본 찾기 Top-1 81.3%, Top-3 96.3%, Top-5 쓸 만함 30/30.
- 운영 메타·등록기·catalog·검색 화면은 아직 4칸과 연결하지 않았다. 시범 원자료(작업자 기록, 판정 결과)는 Git에 없다(Claude 세션 작업 폴더). 이유: 증거는 Git에 두지 않는다([git-evidence](../agents/git-evidence.md)).

## 2. 역할 나눔

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
- 사전은 v1.1을 쓴다. 사전에 없는 말은 후보로만 적는다.
- Claude가 받는 즉시 확인하는 것: 인용 원문 일치, 문항 누락, 사전 밖 용어(후보 처리), method 근거 형식. 그다음 원본 찾기 Top-1·3·5와 Sonnet 결과와의 칸별 용어 겹침을 낸다.
- 다음 단계로 가는 판단(사용자 결정): Top-3이 Sonnet(96%)과 크게 다르지 않고 인용 실패가 드물면 GPT로 확대한다. 차이가 크면 어느 규칙에서 갈렸는지 보고 규칙 문구나 모델을 조정해 다시 한다.

### 2단계 — 확대 (1단계 결과를 본 뒤)

- 순서는 기존 유사시험지 작업 순서를 따른다: 고1 2학기 기말 → 1학기 중간 → 1학기 기말 → 2학기 중간, 각 안에서 고3→고2→고1, 원본과 그 유사시험지를 한 묶음으로. 한 회차는 원본이면 원본만, 유사면 유사만 연다(1단계와 같은 이유).
- 회차당 시험지 수는 사용자가 정한다(기본 1~2개). 제출 형식은 1단계와 같다.
- 확대 중 새 후보 용어는 Claude가 묶음 단위로 정리해 사전 버전을 올린다. GPT는 다음 회차에 새 버전을 읽는다.

### 아직 정하지 않은 것 (Claude·사용자)

- 4칸 파일의 저장소 내 정본 경로와 `schemaVersion` 정식 이름(계약 §17(a)). 정해질 때까지 제출물은 작업 브랜치의 작업 폴더에 둔다.
- 기계 검사 도구의 저장소 반영. 지금은 Claude가 받은 뒤 검사한다.

## 4. 제출 형식

시험지 1개 = 파일 1개, 이름 `<시험지 JS 파일 이름에서 .js를 뺀 것>.4slot.json`.

```json
{
  "schemaVersion": "archive-meta-4slot-v0",
  "sourceArchiveFile": "original/high/h1/2final/25_금당고_2학기_기말_고1_기출.js",
  "sourceGitBlobSha": "dcd0d7a4cd4afb009ce85ee1927c24ad18500aaf",
  "dictionaryVersion": "term-dict-v1.1-2026-11-03",
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
    {"term": "고정점", "kind": "방법", "parent": "역함수", "note": "f(x)=x인 점", "usedIn": [15]}
  ],
  "selfCheck": {"items": 22, "quotesChecked": 180, "quotesNotFound": 0, "notes": ""}
}
```

- `sourceOrdinal`은 시험지 JS의 문항 `id`다. `questionUid`와 지문(QBODY·QFULL)은 Claude가 받을 때 채운다. 이유: GPT가 직접 계산하면 식이 조금만 달라도 값이 어긋난다(계약 §12).
- `src`는 `stem`(문항 `content`), `choices`(보기 중 하나), `solution`(해설) 중 하나. `quote`는 그 텍스트에 **글자 그대로**(LaTeX·공백 포함) 있는 5~40자.
- `term`은 사전의 `ko`(대표 표기)나 `synonyms` 중 하나. 없으면 `candidates`에 선언하고 같은 이름으로 쓴다.
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

## 6. 지켜야 할 것 (요약)

- 문항의 발문과 해설을 읽고 판정한다. PT/TPL/CC/COND 키나 단원명을 보고 채우지 않는다.
- 수 범위 제한(자연수·정수·실수·구간)은 condition에 적는다. 배정과 분배를 구분한다. 문장제 소재는 `scenarioNote`에만.
- 시범 결과 파일(Sonnet 기록)을 찾거나 요청하지 않는다. 이유: 비교 대상을 보면 비교가 안 된다.
- 작업 브랜치의 자기 회차 폴더에만 커밋한다. main에는 쓰지 않는다. 사전·계약에서 고칠 점을 발견하면 제출물 `selfCheck.notes`에 적는다.
