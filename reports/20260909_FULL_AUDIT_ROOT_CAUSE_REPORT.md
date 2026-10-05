# H1 2학기 31개 외부검수 ZIP 전수감사 — 원인·파이프라인 이탈 보고서

- 감사 대상: 외부검수 ZIP 31개
- 고유 시험지 identity: 30개 (`23 부영여고 2학기 중간` 일반판과 v2가 중복)
- 검수 문항 수: 532문항
- 브라우저 검수 시도: exam / sol / ans 93케이스
- PNG 기본 decode: 53개 전부 파일 단위 decode 가능
- 시험지 단위 최종 PASS: 0개
- 시험지 단위 FAIL: 31개
- production/source/asset/ZIP 원본: 이번 감사에서 수정하지 않음
- 상태: 전수감사 원인 분석용 중간 판정. release seal이나 재작업 승인을 의미하지 않음

## 1. 결론

31개 ZIP 모두 시험지 단위 PASS가 될 수 없는 상태라는 전수검수 결과는 타당하다. 확인된 결함은 개별 문항의 정오답 실수만이 아니라 다음 네 가지 핵심 gate가 반복적으로 빠진 구조적 문제다.

1. 원본 PDF/HWP의 q번호·문항 본문·보기·asset을 production payload와 1:1로 묶는 source identity gate가 없었다.
2. full-page-first candidate와 독립 answer/solution 검수 사이의 경계가 무너져, 일부 문항은 다른 시험지 payload·요약문·placeholder가 production/ZIP에 들어갔다.
3. visual asset은 “PNG가 열리는가”만 확인하고 문항 의미·crop purity·좌우 절단·타 문항 혼입을 확인하지 않았다.
4. 실제 ZIP을 그대로 사용하는 exam/sol/ans 브라우저 검수와 current pipeline closure가 완료되기 전에 build/ZIP을 완료 상태처럼 취급했다.

따라서 이번 전수 결과의 본질은 “검수자가 뒤늦게 오류를 발견했다”가 아니라, 발견되어야 할 오류를 앞 단계에서 발견할 수 없도록 파이프라인을 수기 shortcut으로 운용한 데 있다.

## 2. 전수검수 결과

| 연도 | 시험지 | 판정 | 핵심 확인 결과 |
|---|---|---|---|
| 2019 | 강남고 기말 | FAIL | q8/q11/q12 source identity 불일치, q13 요약·좌측 절단, q14 동전 asset 혼입, q15/q23/q25 요약 |
| 2019 | 금당고 기말 | FAIL | q4 이후 source/JS identity 불일치, 후반 payload 타 문항 재사용 |
| 2019 | 금당고 중간 | FAIL | q4 이후 source/JS identity 불일치, q5 해설 운영 문구 잔존 |
| 2019 | 복성고 중간 | FAIL | source q8은 영화 관람 집합인데 JS는 직선·원 문제, q17/q18 발문 요약 |
| 2019 | 팔마고 기말 | FAIL | q1–q4부터 source PDF와 JS 불일치, 후반 타 시험지 문항 재사용 |
| 2019 | 팔마고 중간 | FAIL | 서술형 q21–q23이 원본 서술형과 불일치 |
| 2020 | 금당고 중간 | FAIL | q04/q06/q15/q19/q21이 question-wide crop 또는 본문·보기 혼입 |
| 2020 | 매산고 기말 | FAIL | q13 해설 운영 메모, q12 본문 포함 crop |
| 2020 | 매산고 중간 | FAIL | q1/q7/q9/q12/q17/q18 제어문자·깨진 LaTeX escape |
| 2020 | 매산여고 기말 | FAIL | q13 해설 불안정, q17 거리 최솟값 오답 |
| 2020 | 매산여고 중간 | FAIL | 제어문자·깨진 명령어, q03/q04/q13 본문 포함 visual crop |
| 2020 | 복성고 중간 | FAIL | 제어문자, q11 source text 포함 asset |
| 2020 | 순천고 중간 | FAIL | 제어문자, q13/q20 asset 오염 |
| 2020 | 순천여고 기말 | FAIL | q15 asset에 q17 본문·보기와 이전 graph 혼입 |
| 2020 | 제일고 중간 | FAIL | q3/q4/q6/q7/q13/q15/q18 제어문자·깨진 escape |
| 2020 | 효천고 기말 | FAIL | q15/q19 asset 본문 혼입 및 crop 부적절 |
| 2020 | 효천고 중간 | FAIL | q4 ‘역’ 정답이 원문 ①이지만 JS answer는 ④ |
| 2023 | 부영여고 중간 일반판 | FAIL | HWP ZIP 한글 경로와 manifest 불일치, q5 asset 경로 불일치 |
| 2023 | 부영여고 중간 v2 | FAIL | q1–q6 choices 공백, `Source question ... unresolved` placeholder |
| 2023 | 여양고 중간 | FAIL | 원본 q1 원의 접선인데 JS q1 집합 등 처음부터 identity 불일치 |
| 2023 | 여천고 기말 | FAIL | q13 `$` delimiter 오류로 미렌더 수식 2건, 해설 계산 오류 |
| 2023 | 여천고 중간 | FAIL | q010/q017 asset이 ZIP에 없어 naturalWidth=0 |
| 2023 | 중앙여고 기말 | FAIL | q16 경우의 수 해설 오류, q18 3000원 방법 수 5개 기록했으나 실제 6개 |
| 2023 | 한영고 기말 | FAIL | q3/q6/q15 visual crop 본문 혼입, source answer/visual adjudication 미종결 |
| 2023 | 한영고 중간 | FAIL | q5 본문 포함 crop, q11 answer-key 충돌이 해설 내부에 잔존 |
| 2024 | 부영여고 중간 | FAIL | q8 계산·answer 불일치, q15/q19 `pi`/`sqrt` 문자열 파손 |
| 2024 | 여양고 기말 | FAIL | q13 직접 계산 34가 choices에 없어 문항 불성립 |
| 2024 | 여천고 기말 | FAIL | q9 중간식 오류, q17이 bracket diagram 대신 q22 계열 asset 참조, delimiter 파손 |
| 2024 | 여천고 중간 | FAIL | q7/q19 본문 포함 asset, HWP ZIP 경로와 manifest 불일치 |
| 2024 | 중앙여고 기말 | FAIL | q11 함수 개수 문제인데 전혀 다른 여학생 조 편성 해설 560 기록 |
| 2024 | 한영고 기말 | FAIL | q13 직접 열거 163인데 answer/solution 95, HWP ZIP 경로 손상 |

## 3. 전수 통계가 보여 주는 결함 유형

첨부된 전수검수 결과와 staging-map을 저장소 ZIP 목록·production 산출물과 교차 확인한 통계다. 서로 겹치는 문항이 있으므로 합계를 단순히 더해 전체 결함 문항 수로 해석하면 안 된다.

| 결함 유형 | 확인 규모 | 의미 |
|---|---:|---|
| 객관식 choices가 5개가 아님 | 8문항 | 보기 유실·placeholder·문항 payload 불완전 |
| 제어문자 포함 | 22문항 | JS 문자열 serialization/escape 경계 실패 |
| `$...$` delimiter 홀수 | 6문항 | MathJax 미렌더 또는 문법적 수식 파손 |
| 발문 요약·truncated summary·placeholder | 12문항 | source transcription이 아니라 수기 요약/미완성 candidate가 최종물로 이동 |
| 해설 운영 문구 잔존 | 3문항 | source answer와 내부 처리 메모를 학생 해설에 섞음 |
| image 필드가 있는 문항 | 38문항 | image 개수 자체는 품질 지표가 아님 |
| HWP ZIP manifest와 실제 경로 불일치 | 9개 ZIP | Windows PowerShell 자기 round-trip만으로 Unicode path 문제를 가림 |
| PNG 기본 decode 가능 | 53개 | 바이트·파일 형식만 정상일 뿐 의미·provenance·crop purity는 보장하지 않음 |

## 4. 실제 원본 대조로 확정된 대표 증거

### 4.1 2019 강남고 기말 q8/q11/q12 identity drift

원본 PDF의 q8은 `f,r,i,e,n,d` 배열 문제이고, 현재 JS q8은 직선과 원의 넓이를 이등분하는 문제다.

원본 PDF의 q11은

```text
A={x | ax+1=2√(-x-2)}에 대하여 A≠∅이기 위한 실수 a의 범위
```

인데 현재 JS q11은 유한집합에서 거짓인 명제를 고르는 문제다.

원본 PDF의 q12는 네 사람의 선물 교환 경우의 수 문제이고 정답은 9인데, 현재 JS q12는 원과 직선의 현 길이 문제다.

이것은 answer-key 오류나 OCR 오타가 아니라 문항 전체가 다른 source payload로 대체된 것이다.

### 4.2 2019 강남고 기말 q13/q14 asset provenance

원본 q13은 모든 모서리 길이의 합과 공간대각선이 주어진 직육면체 겉넓이 문제다. 현재 q13.png는 직육면체를 포함하지만 좌측 경계가 잘려 있고, 문제 문장·선택지 영역까지 함께 들어가 있다.

원본 q14는 $0$부터 $10$까지의 정수 집합 부분집합 개수 문제다. 그런데 현재 q14.png는 원본 page 3의 q20 동전 지불 문제 이미지다. 기존 `asset_manifest.csv`는 이를 `source page 3 graph`라고 적고 있어 이미지와 provenance metadata가 함께 틀렸다.

### 4.3 수학 계산 오류

전수검수에서는 다음처럼 직접 계산으로 판정 가능한 오류도 확인됐다.

- 2023 여천고 기말 q1: JS 발문 기준 정답은 ④인데 현재 answer는 ①.
- 2020 매산여고 기말 q17: $g(x)=(x-3)/(x+3)$와 $A(-3,1)$ 거리 최솟값은 $2\sqrt3$인데 현재 answer는 $\sqrt{10}$.
- 2024 부영여고 중간 q8: 현재 해설의 접선 기울기와 answer가 성립하지 않고 직접 계산값은 $5\sqrt{30}/2$이며 choices에도 없음.
- 2024 한영고 기말 q13: 직접 열거 결과는 163인데 현재 answer/solution은 95.
- 2023 중앙여고 기말 q18: 3000원을 만드는 방법은 직접 열거 6개인데 해설은 5개.
- 2024 여양고 기말 q13: 해설 계산 34가 choices에 없어 단일 정답 문항 자체가 성립하지 않음.

## 5. 어느 단계에서 파이프라인을 임의로 어긋나게 했는가

### A. 2019·2020 PDF legacy 경로 — Route A를 건너뛰고 production을 직접 작성

2019 강남고 build commit `42eff6a1`의 변경 목록은 production JS, PNG 2개, DB, question-index 및 report뿐이다. 해당 시험지에 대한 다음 Route A 산출물이 commit/tree에 없다.

- full-page-first candidate JS
- page-level Vision extract JSON
- q-level source ordinal map
- crop provenance map
- candidate validator output
- browser exam/sol/ans evidence

production JS에는 `sourceQuestionNo`나 `displayNo`가 없고 id가 `1–5, 8–16, 20, 23–25`로 불연속이다. 그런데 이 불연속 id를 source q번호처럼 사용하면서 content가 다른 문항으로 바뀌어도 차단할 수 없었다.

2019·2020 계열은 공통적으로 “원본 전체를 candidate로 보존하고 제외 문항만 명시”한 것이 아니라, 필요한 문항만 골라 production JS를 수기로 구성한 뒤 빈 번호를 남기거나 다른 payload를 넣었다. 이것이 q8/q11/q12 같은 identity drift의 직접 원인이다.

### B. q-level source mapping 부재 — 제외 목록이 실제 source ordinal과 함께 이동

기존 `EXCLUDED_QUESTIONS.md`는 q06/q07/q17/q18/q19/q21/q22를 제외한다고 적었지만, 원본 q6/q7의 실제 내용과 report의 graph/inverse 사유가 맞지 않는다.

즉, “문항이 불확실해서 제외”한 것이 아니라 “다른 문항 목록의 번호·사유가 현재 source에 붙은 것”이다. source identity를 먼저 freeze하지 않고 answer/asset 단계에서 번호를 기준으로 병합한 결과다.

### C. content·choices를 source transcription이 아닌 요약문으로 허용

`직육면체의 모든 모서리 합과 공간대각선으로 겉넓이를 구하는 문항이다`처럼 실제 발문과 조건·점수·보기 없이 요약한 payload가 최종 JS에 남았다. 이 방식은 수학적으로 비슷한 문제를 설명할 수는 있지만, archive original exam의 source transcription이 아니다.

현재 규칙상 `content`는 editorial summary가 아니라 printed wording, qualifiers, choices, proof/condition block까지 보존해야 한다. 이 gate가 candidate-to-production 과정에서 무력화됐다.

### D. visual asset을 semantic 검수 없이 파일명으로 연결

crop의 실제 의미를 확인하지 않고 `q13.png`, `q14.png`처럼 question id와 파일명만 맞추면 provenance가 통과하는 구조였다.

그 결과:

- question-wide crop이 problem image 필드에 들어감
- 원문 텍스트·보기·이전 문항이 asset에 혼입
- 좌측·우측이 잘린 diagram이 PNG decode PASS
- 다른 문항의 coin/graph/bracket asset이 현재 q번호에 연결

PNG decode는 필요한 하위 검사일 뿐이며, visual semantic parity나 clean crop PASS가 아니다.

### E. HWP native conversion 이후의 custom shortcut

HWP source를 Hancom native PDF로 변환한 단계 자체는 비교적 올바른 방향이었다. 그러나 그 다음 단계에서 다음 shortcut을 사용했다.

1. `prepare-*.mjs`가 외부 page-level Vision 결과 대신 수기 Vision JSON을 만들어 넣었다.
2. 판독되지 않은 문항에 `Source question ... unresolved` 형태의 dummy payload를 채운 candidate가 생성됐다.
3. `complete-*.mjs`가 handoff에서 허용된 answer/solution 범위를 넘어 content/category/subunit/image/review metadata까지 수기로 재구성했다.
4. 23 여양고 중간은 다른 시험지의 full-page sequence를 재사용하는 별도 lane으로 처리했는데, page layout 유사성은 문항 identity parity의 증거가 아니다.
5. `package-*.mjs`는 Windows PowerShell `Compress-Archive` 후 같은 PowerShell `Expand-Archive`로 fresh check를 했다. 동일한 producer/consumer 조합은 Unicode filename corruption을 발견할 수 없다.
6. HWP ZIP이 실제 외부 staging에서 한글 경로가 깨졌는데도 package-level source copy와 same-environment extraction PASS를 근거로 완료 처리했다.

결론적으로 HWP 변환 runtime은 개선됐지만, native PDF 이후의 source identity·independent review·portable package·closure gate가 다시 수기 경로로 돌아갔다.

### F. 독립검수·수학검산을 최종 gate로 사용하지 않음

전수검수에서 발견된 수학 오류들은 모두 독립 계산으로 확인 가능한 수준이다. 그러나 기존 작업에서는 다음이 없었다.

- source-only blind solve envelope
- answer/solution reviewer의 문항별 evidence
- source conflict와 answer-key defect의 분리 ledger
- answer/solution blank·conflict를 production promotion에서 fail-close하는 current closure evidence

그 결과 해설이 다른 문제의 계산을 설명하거나, 직접 계산과 답지가 다를 때 그 충돌을 해설 안에 남긴 채 포함시켰다.

### G. candidate/build/production/release 상태를 혼동

기존 report에는 browser QA가 `NOT_PERFORMED` 또는 `NOT_TESTED`라고 적혀 있고 final quality PASS도 선언하지 않았다. 그럼에도 ZIP과 inventory state는 완료 build처럼 취급됐다.

현재 규칙의 상태는 다음처럼 분리되어야 한다.

```text
candidate generated
    ≠ answer/solution independently reviewed
    ≠ source fidelity PASS
    ≠ real browser render PASS
    ≠ reviewed_pass closure
    ≠ production release/seal
```

이번 작업에서는 이 구분이 운영상 무너져 “외부검수 ZIP 생성 완료”가 “시험지 단위 품질 완료”처럼 읽혔다.

### H. branch/rules preflight도 충족하지 못함

현재 nightly worktree에서 `node tools/skills/verify-skills.mjs` 결과는 다음과 같다.

```text
Skill verification: FAIL
branch does not contain the latest origin/main (ahead=33, behind=6)
```

이 branch preflight 실패는 q8/q11 identity 오류의 직접 원인은 아니지만, current rule/tool 기준이 최신 main과 고정되지 않은 상태에서 작업을 진행했다는 별도 운영 gate 위반이다. 이 상태에서는 최종 release나 seal을 선언하면 안 된다.

## 6. 검사 도구가 왜 막지 못했는가

### `exam-lint`

2019 강남고 production JS의 결과는 다음이었다.

```text
대상 1개 파일 / 18문항
FAIL 0개 파일 / WARN 1개 파일
```

경고는 빈 tags와 id 불연속뿐이었다. 이 도구는 source PDF를 읽어 q8과 JS q8의 본문을 비교하지 않으므로 이번 identity drift를 잡지 못한다.

### DB/question-index

DB qCount=18, question-index row=18로 내부적으로 일치했다. 하지만 이는 잘못된 JS를 DB와 index가 함께 참조한다는 뜻일 뿐이다.

```text
원본 PDF 25문항
    ↓  [검증되지 않은 q-level mapping]
production JS 18문항
    ↓
DB/index 18문항
```

DB/index parity는 source fidelity의 대체 검사가 아니다.

### ZIP fresh check

기존 fresh check는 CRC, Node syntax/VM, PNG decode, PDF nonzero bytes를 확인했다. 실제 archive consumer가 보는 Unicode entry name, 문제 image semantic, 원본 q번호 parity, browser layout은 확인하지 않았다.

특히 HWP는 ZIP 생성과 해제를 동일한 Windows PowerShell 계열로 수행했기 때문에 독립 검수 staging에서 재현되는 한글 경로 손상을 가렸다.

### 브라우저 staging

첨부 결과에 따르면 HWP 일부 browser 검수는 손상된 ZIP 경로를 임시 staging에서 정상 한글 경로로 보정한 뒤 수행됐다. 따라서 그 화면이 로드됐더라도 deliverable ZIP의 exact bytes를 검수한 것이 아니다. 이 경우 결과 상태는 PASS가 아니라 `NOT_TESTED` 또는 `FAIL`이어야 한다.

## 7. 근본 원인 분류

| 원인 | 직접 결과 | 책임이 있는 이탈 |
|---|---|---|
| source identity key 부재 | q번호는 같지만 다른 문항 payload | `sourceQuestionNo/displayNo` 없이 id·파일명 기준 병합 |
| full-page-first 결과를 authoritative input으로 쓰지 않음 | 요약문·placeholder·타 시험지 문항 | 수기 Vision JSON·수기 content 재작성 |
| answer/solution 단계와 content 단계 경계 붕괴 | 다른 문항 해설, 조건 누락 | handoff 허용 필드 밖 metadata/content 재구성 |
| visual semantic gate 부재 | 타 문항 image·본문 혼입·clipping | PNG decode와 provenance filename을 PASS로 오인 |
| 안전한 serialization 부재 | 제어문자·깨진 LaTeX | JS 문자열을 canonical serializer 없이 직접 작성 |
| 독립 수학검산 미완료 | q1/q8/q13/q17/q18 등 정답·해설 오류 | blind solve/choice uniqueness gate 미실행 |
| portable ZIP 검수 부재 | HWP 한글 경로 손상 | 동일 PowerShell producer/consumer self-test |
| browser/closure gate 미실행 | 31개 모두 release PASS 불가 | `NOT_TESTED` 상태에서 build 완료 처리 |
| branch preflight 실패 | 최신 rule/tool 기준 미고정 | `verify-skills` FAIL 후 작업 지속 |

## 8. 재발 방지를 위해 반드시 고정해야 할 gate

이번 보고서는 수정 승인이 아니므로 production을 건드리지 않았다. 재작업을 시작할 때는 다음 조건을 먼저 고정해야 한다.

### 8.1 source identity freeze

- 원본 PDF/HWP마다 SHA-256, 페이지 수, source q번호 범위를 manifest에 고정한다.
- 모든 question object에 `sourceQuestionNo`, `displayNo`, `sourcePageNo`, `sourcePageEvidencePaths`를 보존한다.
- q번호가 빠지는 경우에도 id를 재번호화하지 말고 source ordinal과 archive sequential id를 별도 보존한다.
- 다른 시험지 page sequence나 content 재사용은 exact page hash가 같다는 이유만으로 허용하지 않는다. source identity·학교·시험지·q-level evidence를 별도로 확인한다.

### 8.2 content/choices gate

- full-page evidence와 production `content`/`choices`를 문항별로 비교한다.
- 요약문, `Source question ... unresolved`, `[판독불가]` dummy text는 최종 candidate·ZIP에 남기지 않는다.
- uncertain item은 source defect/REVIEW_NEEDED로 남기고 content를 추측해 채우지 않는다.
- answer/solution reviewer는 content·choices를 임의로 고치지 않고, extraction defect는 별도 source-fidelity lane으로 되돌린다.

### 8.3 visual gate

- visualAssetBBox는 graph/figure/table/diagram만 포함해야 한다.
- 원문 발문·보기·정답·이전 문항·page border가 들어가면 FAIL이다.
- crop의 semantic identity를 q content와 함께 blind review한다.
- 좌측·우측 clipping, 라벨 절단, 축·점·도형 손실을 PNG decode와 별도로 검사한다.

### 8.4 math and answer gate

- 답지와 무관하게 각 문항을 독립 풀이한다.
- 선택지 단일성, 조건 충분성, 정의역/치역, 서술형 계산을 확인한다.
- answer-key conflict는 해설 안에 운영 문구로 남기지 말고 별도 ledger에서 `ANSWER_KEY_DEFECT`로 분리한다.
- 해설의 최종 결론과 answer field가 자동·수동으로 모두 일치해야 한다.

### 8.5 portable package gate

- ZIP 내부 경로를 Windows PowerShell과 Python/7-Zip 등 서로 다른 consumer로 각각 열어 확인한다.
- Unicode filename의 raw entry name, UTF-8 flag, manifest path, actual path를 byte-level로 비교한다.
- staging에서 파일명을 보정한 뒤 browser PASS를 기록하지 않는다. 반드시 deliverable ZIP exact extraction을 검수한다.

### 8.6 release/closure gate

- `validate_final_candidates.py`
- `reviewed_pass` envelope
- current pipeline closure manifest
- DB/index parity
- exact ZIP extraction
- exam/sol/ans browser render

이 일곱 가지가 모두 닫히기 전에는 상태를 DONE 또는 final PASS로 올리지 않는다. 구조적으로 생성됐다는 의미의 BUILT와 품질·release가 끝났다는 의미의 DONE을 분리해야 한다.

## 9. 현재 조치 상태

- 전수검수 결과: 보존
- 원본 PDF/HWP: 보존
- 기존 production JS/DB/index/asset: 이번 원인 분석에서 수정하지 않음
- 2019 강남고 기말: 기존 상태 파일에서 `FAIL_CANDIDATE`로 기록됨
- 나머지 30개: 첨부 전수 결과 기준으로 모두 시험지 단위 FAIL이며, 재작업 전까지 release PASS로 취급하지 않음
- 자동화: 이전 terminal heartbeat는 종료된 상태이며, 이번 보고서 작성만으로 재가동하지 않음

## 10. 최종 판정

이번 전수검수에서 가장 중요한 발견은 “31개 중 몇 개가 실수였는가”가 아니다. 원본 identity·visual provenance·독립 수학검산·실브라우저 exact ZIP 검수를 서로 독립적인 hard gate로 두지 않았고, 그 자리를 수기 축약·파일명 매칭·동일 환경 ZIP self-test·구조 lint가 대신했다는 점이다.

따라서 현재 31개 ZIP은 모두 external-review용 보류 artifact이며, 어느 것도 source-faithful final archive나 release PASS로 승격할 수 없다. 재작업은 문항별 정답 수정부터 시작하면 안 되고, 먼저 source inventory와 q-level identity map을 새로 freeze한 뒤 각 시험지를 candidate 단계부터 다시 통과시켜야 한다.


