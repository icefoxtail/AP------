# 코드검사실 / JS아카이브 시험지 작업 통합 운영 프로토콜
## PDF·페이지 이미지 기반 신규 제작 / 기존 JS 검수·수정 / 이미지 에셋 / 1·2·3차 검수 / 최종 ZIP 봉인 전 단계
### Integrated Clean Edition — 2026-08-10
### Revision: 풍덕중·순천여중·향림중 실전 작업 피드백 반영 — 기존 연향중·금당중 보강 유지 + PRE-RECHECK LINT / 수정 에셋 STRUCTURE TYPE LOCK / POST-ASSET-WRITE VISUAL GATE / NO DESTRUCTIVE MASKING / ADJACENT SMALL-PRINT OWNERSHIP LOCK / ALL-ASSET LABEL INVENTORY SWEEP / SOURCE REPAIR CANDIDATE IMPACT MATRIX / SOURCE REPAIR CONSISTENCY LOCK / DELIVERY SCOPE LOCK / LEVEL BORDERLINE STABILITY LOCK / 단일 REVIEW LEDGER / HARD FAIL·MINOR WARN 분리 / MASTER_ACCEPTED_PASS / ZIP UTF-8 ENTRY FLAG LOCK / ZIP PATH ROUND-TRIP LOCK

---

# 0. 문서 목적과 적용 범위

이 문서는 JS아카이브 시험지 작업에서 사용하는 **단일 통합 운영 기준본**이다.

적용 대상:
- 기존 JS + 원본 시험지 소스 검수·수정
- 원본 시험지 소스 단독 신규 JS 제작
- 정답 독립 검산
- 학생용 solution 작성·재작성
- 표준단원·메타·난이도 판정
- 문제용 이미지 에셋 제작
- 필요 시 해설용 시각자료 제작
- 1·2·3차 검수
- 수정프로토콜
- 수정 후 전 문항 재검
- 최종 ZIP 생성 및 무결성 검증
- 실제 브라우저 렌더 확인

이 문서는 작업 이력이나 직전 시험지 상태를 저장하지 않는다.
직전 작업 상태·현재 시험지명·진행 단계는 별도 `SESSION_STATE.md` 또는 해당 시험지 보고서에서 관리한다.

---

# 1. 최상위 원칙

## 1-1. 원본 사실 기준과 작업 기준본을 분리한다

### SOURCE TRUTH AUTHORITY — 원문 사실의 최상위 기준

발문·보기·배점·단위·도형 조건·표·그래프·보기박스 등 **시험지에 실제 인쇄된 내용의 최상위 기준은 원본 시험지 소스**다.

원본 시험지 소스:
1. 원본 PDF
2. PDF가 없는 경우 순서가 확정된 원본 페이지 이미지
3. 사용자가 원본으로 명시한 스캔 이미지 묶음

단, `APPROVED_SOURCE_REPAIR`가 명시 승인된 문항·필드만 승인 복원본을 원본 대신 사용한다.

### BASELINE AUTHORITY — 수정 작업의 기준본

같은 시험지의 수정본이 여러 개 있을 경우 작업 상태 기준본은 다음 순서로 정한다.

1. 사용자가 마지막으로 승인한 수정완료/최종완료 ZIP
2. 그 ZIP을 새 폴더에 실제 압축 해제한 JS와 에셋
3. 직전 승인 JS 단독 파일
4. 최초 업로드 JS

최초 JS는 수정 전 비교 자료일 뿐, 최신 승인본이 존재하면 작업 상태를 최초 JS로 되돌리지 않는다.

### BASELINE DISCOVERY LOCK — 수정 직전 기준본 재확정

수정 작업을 시작하기 직전에 실제 기준본을 다시 확정한다.

필수 기록:
```text
ACTIVE_BASELINE
baseline_type: final_zip / standalone_js / original_js
baseline_path:
baseline_zip_sha256:
baseline_internal_js_path:
baseline_internal_js_sha256:
standalone_js_path:
standalone_js_sha256:
baseline_reason:
```

규칙:
- 최신 승인 ZIP이 있으면 반드시 새 폴더에 실제 압축 해제한 내부 JS를 기준본으로 사용한다.
- 단독 JS가 최신 승인 ZIP 내부 JS와 다르면 `STALE_STANDALONE_DETECTED`로 기록한다.
- `STALE_STANDALONE_DETECTED` 상태의 단독 JS는 수정 기준본으로 사용하지 않는다.
- 기준본 SHA와 경로가 확정되기 전에는 allowlist 작성·파일 수정·재압축을 시작하지 않는다.
- 기준본을 바꾸려면 변경 사유와 새 SHA를 다시 기록한다.

---

## 1-2. 원문 성역

다음은 원본과 **표시 결과 기준으로 동일하게 보존**한다.

- 문장
- 띄어쓰기
- 쉼표·마침표·콜론 등 문장부호
- 괄호
- 배점
- 단위
- 각 기호
- 호·선분·직선·반직선 표기
- 수직·평행 기호
- 수식 구조
- 보기 순서
- 소문항 순서
- 조건박스·보기박스·증명박스 구조
- 표의 행·열·값
- 그림 내부 라벨·수치·각도·점 이름

**수학적으로 동치여도 원문 표기가 달라지면 1차 원문 무결성 FAIL**이다.

예:
- 원본 `\wideparen{AB}=3\wideparen{BC}`를 `호 AB의 길이는 호 BC의 길이의 3배`로 풀어쓰기 → FAIL
- 원본 `\angle x-\angle y`를 `x-y`로 단순화 → FAIL
- 원본 `주말동안`을 `주말 동안`으로 교정 → FAIL
- 원본 쉼표를 임의 제거 → FAIL

단, 엔진 안전성을 위한 **표현 방식 변환**은 허용한다.

예:
- 화면에 `<보기>`를 표시하기 위한 `&lt;보기&gt;`
- 원본 줄바꿈을 엔진 구조에 맞는 `<br>` 또는 안전한 문자열 줄바꿈으로 표현
- 인쇄된 수식을 동일하게 보이도록 LaTeX로 변환

판정 기준은 소스 코드 철자 자체가 아니라 **최종 표시 의미·기호·문자 보존**이다.

---

## 1-3. 독립 검산

기존 `answer`, `solution`, 이전 PASS 보고서는 정답 근거가 아니다.

- 모든 문항을 직접 다시 푼다.
- 객관식은 보기 5개를 모두 판정한다.
- 서술형은 답뿐 아니라 풀이 과정도 독립 검산한다.
- 고위험 문항은 다른 방식으로 이중 검산한다.
- 정답지와 직접 풀이가 다르면 정답지를 자동 신뢰하지 않는다.

---

## 1-4. 최소 수정

수정은 검수에서 확정된 범위만 한다.

- 정상 필드 취향 수정 금지
- 문장 미화 금지
- 전체 포맷 정리 금지
- 객체 재정렬 금지
- 따옴표 스타일 일괄 변경 금지
- 승인되지 않은 메타·난이도·이미지 수정 금지

핀포인트 수정은 반드시 `allowlist + diff lock`을 적용한다.

---

## 1-5. 확인하지 않은 것은 PASS 금지

실제 수행하지 않은 검사는 다음 중 하나로 기록한다.

- `미확인`
- `NOT TESTED`
- `해당 없음`

실행하지 않은 검사를 PASS라고 쓰지 않는다.

---

# 2. 역할과 작업 모드

ChatGPT는 이 프로젝트에서 **실제 제작·검수·수정 담당자**다.

사용자가 JS와 원본 소스를 올리면 별도 진행 예고나 승인 질문 없이 작업한다.

## 작업 모드 A — 기존 JS 검수·수정
입력:
- 기존/초안 JS
- 원본 시험지 소스

수행:
- 기존 구조를 유지
- 원본과 전 문항 대조
- 정답·해설·메타·이미지 독립 검수
- 필요한 항목만 최소 수정

## 작업 모드 B — 원본 단독 신규 제작
입력:
- 원본 시험지 소스
- 기존 JS 없음

수행:
- 다른 시험지의 content/choices/answer/solution/image를 재사용하지 않음
- 처음부터 JS·정답·해설·메타·이미지를 제작
- 최종 완료 전에 독립 재풀이 실시

---

# 3. 입력 인벤토리와 시험지 신원 잠금

## 3-1. 입력 인벤토리

작업 시작 즉시 다음을 확정한다.

- 작업 모드 A/B
- 원본 파일명
- 원본 SHA-256
- 원본 페이지 수 또는 페이지 이미지 수
- 페이지별 문항 범위
- 실제 총 문항 수
- 객관식/단답형/서술형 수
- 복수정답 명시 문항
- 부분점수 문항
- 그림·표·그래프·조건박스 문항
- 정답표 제공 여부
- 시험 범위·교육과정
- 이미지 필요 문항
- 최종 `window.examTitle`
- 최종 `delivery_scope`: `ZIP_ONLY` / `ZIP_PLUS_STANDALONE`

작업 모드 A 추가 확인:
- JS 파일명
- 기존 `window.examTitle`
- JS 문항 수
- id 연속성
- 기존 image 경로와 실제 파일 존재 여부
- 기준 ZIP/JS SHA

## 3-2. IDENTITY LOCK

파일명만 보고 학교·학년·학기·과목을 확정하지 않는다.

원본 인쇄면에서 가능한 범위까지 직접 확인:
- 학교명
- 학년
- 연도
- 학기
- 중간/기말
- 과목

확정 후 다음 문자열을 통일한다.

```text
JS 파일명
window.examTitle
assets/images/{examTitle}/
image 경로
조건부 solutionImage 경로
최종 ZIP 파일명
현재상태 보고서의 시험지명
```

원본 업로드 파일명은 provenance로 보존한다.

```text
source_filename
verified_exam_identity
```

학교명·학년·과목 정정이 발생하면 시험지명 문자열이 들어갈 수 있는 전체 경로·보고서를 다시 검색한다.

IDENTITY LOCK 전에는 최종 ZIP을 만들지 않는다.

---

# 4. 시험지별 작업 공간 완전 분리

시험지마다 새 작업 폴더를 사용한다.

금지:
- 이전 시험지 JS 복사 후 제목만 변경
- 이전 시험지 에셋 재사용
- 이전 시험지 보고서 복사
- 다른 시험지 q번호 이미지 혼입
- 과거 작업 폴더 위에 덮어쓰기

최종 ZIP 전 검색:
- 다른 학교명
- 다른 연도
- 다른 학년
- 다른 시험지명
- 사용하지 않는 이전 이미지 경로
- 이전 시험지의 실행 데이터

단, provenance 보고서 안의 과거 원본 파일명은 예외다.

---

# 5. 5문항 배치 루프

전 문항을 id 순서대로 5문항씩 처리한다.

예:
- 1~5
- 6~10
- 11~15
- 16~20
- 21~끝

각 배치에서 다음을 끝낸 뒤 다음 배치로 넘어간다.

1. 원본 발문 ↔ JS content 대조
2. 배점·단위·괄호·조건 대조
3. choices 전수 대조
4. 기존 answer를 신뢰하지 않고 독립 풀이
5. 정답 유일성·복수정답·정답 없음 확인
6. solution 신규 작성 또는 전면 재작성
7. standardUnit/category/level/tags 판정
8. 필요한 이미지 제작
9. 현재 배치 SELF_CHECK
10. FAIL 항목 즉시 수정 후 같은 배치 재검

후반 문항이라고 해설·검산·이미지 검수를 축약하지 않는다.

---

# 6. SOURCE FIDELITY LOCK — 원문 미세 무결성 강제 게이트

1차 원문 검수는 단순 의미 확인으로 끝내지 않는다.

각 문항을 **문장·문자·수식·기호 단위로 원본과 대조**한다.

## 6-1. 필수 대조 항목

- wording: 문구
- spacing: 띄어쓰기
- punctuation: 문장부호
- score: 배점
- units: 단위
- conditions: 괄호·단서
- math_symbols: 수학기호
- geometry_notation: 각·호·선분·직선·수직·평행
- choices: 보기 5개
- box_table: 보기박스·조건박스·표
- image_labels: 그림 내부 라벨
- small_print: 작은 첨자·각도·단위·점 이름

특히 다음 표기를 별도 점검한다.

```text
\angle
\wideparen
\overline
\overleftrightarrow
\overrightarrow
\perp
\parallel
^\circ
\sqrt
\dfrac
cm / cm^2 / cm^3
```

## 6-2. 원문 정방향 + 역방향 재검

최종 원문 검수는 두 번 한다.

1. q1 → 마지막 문항
2. 마지막 문항 → q1

두 번째 검수는 첫 번째 체크 표시를 그대로 복사하지 않고 다시 원본을 본다.

## 6-3. 증거 파일

권장:
```text
reports/source_fidelity_matrix.csv
```

컬럼:
```text
id,wording,spacing,punctuation,math_symbols,geometry_notation,
units,score,conditions,choices,box_table,image_labels,zoom_checked,
shared_range,shared_anchor,source_sequence,render_sequence,sequence_status,standalone_safe,status
```

전 문항 `status=PASS`가 아니면 1차 PASS 금지.

## 6-4. RENDER-EQUIVALENT SOURCE DISTRIBUTION — 최종 표시 결과 기준 원문 보존

엔진 렌더 순서 또는 데이터 구조 제약 때문에 원본의 일부 텍스트·조건·표·대화·보기 요소를
`content`가 아니라 PNG 이미지 안에 포함해야 하는 경우가 있다.

이 경우 SOURCE FIDELITY는 `content` 단독이 아니라 아래 전체의 **최종 표시 결과 합계**로 판정한다.

```text
content + image + choices
```

허용 조건:
- 원본에서 이미지로 이동한 문구·조건·표·대화가 이미지 안에 완전하게 존재
- 확대 없이도 최종 출력에서 판독 가능
- 원본의 상대 순서와 의미 유지
- 이미지 안의 문자·수식·기호가 원본과 동일
- 해당 구조를 `asset_manifest`에 기록
- 텍스트가 이미지로 이동했다는 이유만으로 누락으로 판정하지 않음

금지:
- 엔진 제약을 이유로 원문 문구 생략
- 조건 일부만 이미지에 넣고 나머지를 누락
- 원본 순서 변경
- 이미지 안에서 원문 문장을 임의 축약·요약
- content와 image에 같은 문구를 중복 삽입하여 최종 렌더 중복 발생

따라서 통이미지 문항은 반드시 **최종 렌더 기준으로 원문 완전성**을 확인한다.

## 6-4-1. ADJACENT SMALL-PRINT OWNERSHIP LOCK — 자료 주변 단위·출처·주석 소유권 잠금

표·그래프·산점도·자료배열·`data_box` 등 시각자료 주변에 인접한 작은 인쇄 요소는
별도 장식이 아니라 **해당 자료의 소유 요소(owned small print)** 인지 먼저 판정한다.

대표 소유 요소:
```text
(단위: ...)
(출처: ...)
축 단위
표 머리글
범례
각주·주석
※
단,
```

강제 규칙:
1. 자료 본체를 이미지로 쓰는 경우 인접 단위·출처·범례·주석이 원본에서 그 자료에 종속되어 있으면 함께 보존하는 것을 우선한다.
2. 엔진 구조상 이미지에 포함하지 않는 경우 `content` 등 다른 렌더 요소에 반드시 존재해야 한다.
3. 최종 `content + image + choices` 합계에서 해당 요소는 **정확히 1회** 존재해야 한다.
4. 자료 본체는 존재하지만 원본의 `(단위: ...)`, `(출처: ...)`, 축 단위, 범례가 어디에도 없으면 1차 FAIL이다.
5. 같은 단위·출처가 `content`와 이미지에 중복되어 두 번 표시되어도 FAIL이다.
6. 단위·출처가 문제 풀이에 직접 필요하지 않더라도 SOURCE FIDELITY 대상에서 제외하지 않는다.
7. 수정 에셋을 재크롭할 때 주변 작은 인쇄 요소의 소유권을 다시 확인하고, 크롭 경계 밖으로 밀려나지 않았는지 검사한다.

`source_fidelity_matrix.csv`에는 필요 시 다음 컬럼을 추가한다.
```text
small_print_owner,small_print_location,small_print_duplicate,status
```

## 6-5. NOTATION INVENTORY GATE — 기하 표기 종류 잠금

기하 문항은 수학적으로 같은 대상이라도 표기 종류가 바뀌면 원문 무결성 FAIL이다.

원본에서 등장하는 문자쌍·기호별 표기 종류를 별도로 확인한다.

예:
```text
AB = 선분 → \overline{AB}
AB = 직선 → \overleftrightarrow{AB}
PA = 반직선 → \overrightarrow{PA}
AB = 호 → \wideparen{AB}
ABC = 각 → \angle ABC
l ∥ m → \parallel
AB ⟂ CD → \perp
```

필수 검사:
- 원본의 선분/직선/반직선/호 구분
- 화살표 방향
- 각 기호
- 수직·평행 기호
- 동일 문자쌍이 다른 종류로 사용되는지 여부
- JS source와 Node VM runtime에서 동일 표기가 유지되는지 여부

원본의 `\overrightarrow{PA}`가 JS에서 단순 `PA`가 되는 등
표기 종류가 소실되면 수학적 의미가 추론 가능하더라도 1차 FAIL이다.

권장 증거:
```text
reports/notation_inventory.csv
```

권장 컬럼:
```text
id,token,source_notation,js_notation,runtime_notation,status
```

## 6-6. STRUCTURAL ELEMENT INVENTORY — 원본 구조요소 잠금

텍스트와 수치가 모두 맞더라도 원본의 시각적 구조요소가 사라지면 SOURCE FIDELITY FAIL이 될 수 있다.

작업 시작 시 문항별 구조요소를 먼저 인벤토리화한다.

구조요소 예:
```text
data_box
condition_box
choice_box
proof_box
table
graph
geometry
dialogue_box
composite_block
```

권장 증거:
```text
reports/structural_element_inventory.csv
```

권장 컬럼:
```text
id,source_structure,js_render_structure,structure_match,note,status
```

강제 판정:
- 원본에 직사각형 자료박스가 있는데 JS 최종 표시에서 단순 텍스트로만 바뀌면 내부 값이 100% 같아도 FAIL.
- 원본 조건박스·보기박스·증명박스·표의 외곽 구조가 사라지면 FAIL.
- 표를 단순 줄글로 풀어 쓰거나 박스 내부 자료를 박스 밖 일반 문장으로 바꾸면 FAIL.
- 엔진 안전성을 위한 HTML/CSS 구조 변환은 최종 표시 결과가 원본 구조와 동등할 때만 허용한다.
- `source_fidelity_matrix.csv`의 `box_table` PASS는 이 인벤토리 결과와 일치해야 한다.


## 6-7. SHARED MATERIAL RANGE LOCK — 공통자료 범위·소유권 잠금

원본에서 `[18-19]`, `[20-21]`, `다음 자료를 보고 두 물음에 답하시오`처럼 하나의 자료를 여러 문항이 공유하는 경우,
각 문항을 독립된 이미지 문항처럼 처리하지 않고 **공통자료 범위(range)** 를 먼저 확정한다.

필수 확정 항목:
```text
shared_range
shared_anchor
shared_members
source_order
standalone_safe
```

정의:
- `shared_range`: 공통자료가 적용되는 원본 문항 범위. 예: `18-19`
- `shared_anchor`: 공통자료를 실제로 소유하는 첫 문항. 원칙적으로 범위의 첫 문항
- `shared_members`: 공통자료를 함께 참조하는 문항 집합
- `source_order`: 공통 발문·자료·각 문항의 원본 표시 순서
- `standalone_safe`: 후속 문항을 단독 추출해도 공통자료가 함께 제공되는지 여부

강제 규칙:
1. 공통자료는 원칙적으로 **범위 첫 문항(anchor)에 1회만 둔다.**
2. 후속 문항에 같은 PNG를 무조건 복제하지 않는다.
3. 원시험지 순차 출력에서는 anchor와 후속 문항의 연속성이 유지되어야 한다.
4. 후속 문항이 `mixer`·랜덤출제·단독 추출에서 공통자료 없이 분리될 수 있으면 `standalone_safe=false`로 기록한다.
5. `standalone_safe=false`는 원시험지 순차 출력 자체의 FAIL 사유가 아니다. 원시험지 구조가 정상이라면 PASS 가능하고, **단독 추출 모드에 대해서만 WARN**한다.
6. 엔진이 공통자료 dependency를 실제 지원하는 것이 확인되지 않았다면 이를 해결하려고 JS에 임의 신규 필드를 추가하지 않는다.
7. 원시험지 출력에서 anchor가 누락되거나 범위가 끊겨 후속 문항이 자료 없이 표시되면 FAIL이다.
8. 공통자료를 후속 문항마다 중복 삽입해 원본보다 자료가 반복 출력되면 SOURCE FIDELITY FAIL이다.
9. 공통자료의 범위 표기(`[18-19]` 등)가 원본에 존재하면 삭제·이동·재작성하지 않고 표시 결과 기준으로 보존한다.

`source_fidelity_matrix.csv`에는 공통자료 문항에 대해 최소 다음을 기록한다.
```text
shared_range,shared_anchor,standalone_safe
```

## 6-8. RENDER SEQUENCE GATE — 원본 요소 순서 ↔ 최종 표시 순서 강제 비교

SOURCE FIDELITY는 요소의 존재 여부뿐 아니라 **최종 표시 순서**까지 동일해야 한다.

원본과 최종 렌더를 다음과 같은 순서 토큰으로 비교한다.

예:
```text
source_sequence: common_stem>graph>question>choices
render_sequence: common_stem>graph>question>choices
sequence_status: PASS
```

필수 검사:
- 공통 발문과 자료의 선후관계
- 그림/그래프와 뒤따르는 조건박스·설명문의 선후관계
- 본문 질문과 이미지의 선후관계
- 이미지와 choices의 선후관계
- 공통자료 anchor와 후속 문항의 선후관계
- 소문항 `(1)`, `(2)`와 각 자료의 선후관계

강제 판정:
- 모든 문구·그림·보기·조건이 존재하더라도 원본 순서와 최종 표시 순서가 다르면 1차 FAIL.
- `content → image → choices` 엔진 순서 때문에 원본 순서를 보존할 수 없으면 13-1 `ENGINE ORDER COMPOSITE BLOCK`을 적용한다.
- 같은 내용이 `content`와 `image`에 중복되어 순서상 두 번 보이면 FAIL.
- 순서 검사는 source 문자열만 보는 것이 아니라 실제 최종 표시 구조를 기준으로 한다.

`source_fidelity_matrix.csv`의 다음 컬럼은 공통자료·복합 통이미지·이미지 중간삽입 문항에서 필수다.
```text
source_sequence,render_sequence,sequence_status
```

`sequence_status != PASS`인 문항이 하나라도 있으면 1차 전체 PASS 금지.

---

# 7. JS 구조·런타임 무결성

최종 저장본 기본 스키마:

```js
{
  id,
  level,
  category,
  originalCategory,
  standardCourse,
  standardUnitKey,
  standardUnit,
  standardUnitOrder,
  questionType,
  layoutTag,
  tags,
  wide,
  content,
  choices,
  answer,
  solution
}
```

선택 필드:
```text
image
```

기본값:
```text
layoutTag: "grid"
wide: false
tags: []
```

특수 `layoutTag`, `wide:true`는 마스터 명시 지시 전용이다.

## 7-1. q() 헬퍼 함수

`q()`가 객체를 자동 생성해도 함수 인수만 보지 않는다.

Node VM 실행 후 실제 `window.questionBank` 객체를 검사한다.

자동생성 결과를 그대로 신뢰하지 않는다.

특히 확인:
- `standardUnit`
- `standardUnitOrder`
- `questionType`
- `tags`
- `wide`
- `layoutTag`

choices가 없다고 자동으로 서술형으로 분류하지 않는다.

## 7-2. Node/VM/LaTeX

반드시 실행:
- `node --check`
- Node VM 로드
- id 1~끝 연속성
- 필수 필드
- 필드 타입
- 런타임 제어문자
- 달러 기호 짝
- LaTeX source↔runtime 비교

중점 명령:
```text
\ne
\notin
\neq
\times
\therefore
\implies
\because
\frac
\dfrac
\sqrt
\lt
\gt
\angle
\wideparen
\overline
\overleftrightarrow
```

source에 있던 LaTeX 명령이 runtime에서 줄바꿈·탭·백스페이스 등으로 소모되면 FAIL.

---

# 8. 정답·수학 검수

전 문항 직접 풀이.

## 객관식
- 보기 5개 전수 판정
- 실제 정답 존재
- 정확히 1개인지 확인
- 명시적 복수정답이면 모든 정답과 오답 확인
- answer와 실제 결과 일치

### 8-1. 통이미지 보기 객관식의 2차 검수

`questionType: "객관식"`인데 `choices: []`인 경우 즉시 구조 오류로 단정하지 않는다.

먼저 다음을 확인한다.
- 보기 ①~⑤ 전체가 하나의 PNG 안에 포함되어 있는가
- 해당 PNG가 실제 보기 전체 역할을 하도록 구성되었는가
- 원본의 보기 순서와 상대 배치가 유지되는가

위 조건을 만족하면:
- JS의 `choices` 배열 대신 **이미지 내부 ①~⑤를 실제 보기 5개로 간주**
- 이미지 내부 각 보기를 ①~⑤ 전수 판정
- 정답 유일성 또는 명시적 복수정답 여부 확인
- `answer`와 이미지 내부 실제 보기 번호 일치 확인
- `questionType`은 `"객관식"`을 유지

이미지 내부 보기 일부가 잘렸거나 판독 불가하면 2차 PASS 금지.

## 서술형/단답형
- 실제 결과 독립 산출
- answer와 일치
- solution 중간 과정과 일치
- 단위 필요 시 단위 확인
- 원문에서 특정 풀이법을 요구하면 그 방법을 사용

정답표와 직접 계산이 다르면 직접 재검산 후 판단한다.

---

# 9. HIGH_RISK GATE — 고위험 문항 이중 검산

다음은 한 번의 풀이만으로 PASS 금지.

- 모든 서술형
- level `"상"`
- 복수정답 문항
- 옳은 것/옳지 않은 것/모두 고른 것
- 도형·그래프 내부 조건 판독 필요
- 원문 최소 복원 문항
- answer 변경 문항
- 매개변수·해의 개수·교점·접선·불연속점
- 여러 조건이 단계적으로 연결되는 문항
- 계산값이 비정상적으로 큰 문항
- SOURCE REPAIR 문항

이중 검산 방법:
1. 정석 풀이
2. 다른 방법으로 재확인

예:
- 원래 식 대입
- 좌표 풀이
- 다른 밑변·높이로 넓이 확인
- 각의 합으로 역검산
- 보기별 참/거짓 전수표
- 가능한 경우 유한 후보 전체 전수검사

두 결과가 다르면 PASS 금지.

---

# 10. SOLUTION METHOD LOCK — 학생용 해설 교육과정 게이트

정답이 맞는 것과 해설 방법이 적절한 것은 별개다.

## 10-1. 필수 원칙
- 해당 시험의 학년·과목 교육과정 안의 방법을 우선한다.
- 해당 학년에서 배우지 않는 정리·기호·방법을 핵심 풀이로 사용하면 solution FAIL.
- 더 상위 과정의 방법이 짧더라도 학생용 기본 해설에는 사용하지 않는다.
- 마스터가 명시적으로 상위 과정 풀이를 허용한 경우만 예외.

## 10-2. solution 품질

중1은 별도 운영 기준에 따라 공란 허용 가능.

중2 이상:
```text
[키포인트]
조건 정리
풀이 방향
정석 풀이
결론
```

필수:
- 실제 계산식
- 식을 세우는 이유
- 핵심 단계 생략 없음
- answer와 마지막 결론 일치
- 운영 메모 없음
- 검수·OCR·수정 이력 없음

객관식 결론 표준형:
```text
따라서 정답은 ③이다.
```

서술형 결론 표준형:
```text
따라서 구하는 값은 $...$이다.
```

결론 문구 판정:
- 객관식 solution의 **실제 최종 정답 번호가 `answer`와 일치**하고, 그 직전 계산·논리가 완결되어 있으면 결론 문구가 표준형과 약간 다르다는 이유만으로 HARD FAIL 처리하지 않는다.
- 예: `따라서 $x+y=197^\circ$이므로 정답은 ①이다.`처럼 정답 번호와 수학적 의미가 정확하면 23-1의 `MINOR_WARN`으로 분류할 수 있다.
- 정답 번호 누락, 다른 번호 제시, 값 불일치, 결론이 애매하여 학생이 최종 답을 확정할 수 없는 경우는 HARD FAIL이다.
- 단순 문구 차이를 고치기 위해 이미 정상인 계산식·answer·content를 확장 수정하지 않는다.

## 10-3. 증거 파일

권장:
```text
reports/solution_curriculum_check.csv
```

컬럼:
```text
id,standardCourse,main_method,concepts_used,out_of_scope,status
```

## 10-4. SOLUTION REFERENT CONSISTENCY GATE — 해설 근거·대상 연결성 검수

해설 문장 하나가 개별적으로 참이라는 이유만으로 PASS하지 않는다.
각 근거가 **바로 다음 논리 단계에서 실제로 필요한 대상·각·변·점·식과 정확히 연결되는지** 확인한다.

대표 오류:
```text
참인 문장: ∠ABQ=90°
실제 다음 단계에 필요한 근거: ∠ACQ=90°
```

이처럼 문장 자체는 참이고 최종 답도 맞더라도, 닮음·합동·비례식의 실제 근거 대상이 다르면 solution FAIL이다.

필수 검사:
- 닮음 삼각형의 대응 순서와 대응각·대응변
- 합동 조건에서 사용한 변·각의 실제 대상
- 원주각·중심각에서 가리키는 호의 실제 대응
- 선분/직선/반직선/호 표기 대상
- 대입식의 변수와 직전 정의된 값의 대응
- 경우 나누기의 조건과 해당 경우에 실제 적용된 식
- 표/그래프에서 읽은 행·열·축 값과 solution 문장의 대상
- `그러므로`, `따라서`, `이므로` 뒤 결론이 직전 근거로 실제 도출되는지 여부

판정:
- 대상 문자 1개가 잘못되어도 이후 계산값이 우연히 맞으면 PASS 금지.
- 대응 순서가 틀렸지만 비례식 결과가 우연히 같은 경우도 FAIL.
- 단순 오탈자처럼 보여도 논리 근거를 바꾸는 문자 오류는 solution 오류로 본다.
- `level:"상"`, 서술형, 도형 문항은 HIGH_RISK 2차 검산에 이 게이트를 반드시 포함한다.

`solution_curriculum_check.csv`에는 필요 시 다음 컬럼을 추가한다.
```text
referent_check,correspondence_check,logic_link_status
```

---

# 11. 분류·메타·난이도

공식 표준단원키 마스터테이블을 기준으로 다음을 하나의 세트로 검증한다.

```text
standardCourse
standardUnitKey
standardUnit
standardUnitOrder
```

분류는 발문 단어가 아니라 **핵심 풀이 도구**를 기준으로 한다.

## 11-1. questionType
```text
객관식
단답형
서술형
```

## 11-2. tags

`questionType`과 `tags`를 분리한다.

객관식/단답형이라는 이유만으로 tags에 동일 문자열을 자동 추가하지 않는다.

권장 tags:
```text
서술형
복수정답
도형
그래프
표
공통자료
```

시각자료 기준:
- 순수 기하 그림 → `도형`
- 함수/산점도/좌표 그래프 → `그래프`
- 실제 표 → `표`
- 보기 전체가 이미지여도 실제 성격에 따라 태그 결정

### 11-2-1. TAG LINT — questionType 중복 태그 자동 차단

3차 검수에서는 사람의 육안 판정과 별개로 Node VM 최종 객체에 대해 tags 자동 LINT를 수행한다.

기본 금지 태그:
```text
객관식
단답형
```

규칙:
- `questionType === "객관식"`이라는 이유만으로 `tags`에 `"객관식"`을 넣지 않는다.
- `questionType === "단답형"`이라는 이유만으로 `tags`에 `"단답형"`을 넣지 않는다.
- 위 금지 태그가 최종 runtime tags에 존재하면 마스터의 문항별 명시 승인 없이는 3차 FAIL.
- 서술형은 프로젝트 운영 규칙에 따라 `"서술형"` 태그 사용을 허용한다.
- 자동 LINT는 source 문자열이 아니라 Node VM에서 생성된 최종 `window.questionBank` 객체를 대상으로 한다.

권장 로그:
```text
reports/tag_lint.csv
```

권장 컬럼:
```text
id,questionType,tags,forbidden_tag,approved,status
```

### 11-2-2. TAG SEMANTIC LINT — 구조요소와 시각자료 태그 의미 일치

`tags`는 단순히 이미지가 있다는 이유로 붙이지 않고, **원본 구조요소의 실제 의미**와 일치해야 한다.

특히 `"표"` 태그는 다음처럼 엄격하게 사용한다.

`"표"` 허용:
- 행·열 구조가 있는 실제 표
- 셀 경계 또는 행·열 대응이 풀이에 의미를 가지는 자료
- HTML `<table>`로 표현되는 것이 자연스러운 원본 표

`"표"` 금지 또는 제거 대상:
- 숫자 몇 개를 사각형으로 둘러싼 `data_box`
- `(가)(나)(다)` 조건을 둘러싼 `condition_box`
- 객관식 ㄱ/ㄴ/ㄷ을 둘러싼 `choice_box`
- 증명 문장을 둘러싼 `proof_box`
- 단순 대화·설명 `dialogue_box`
- 단순 박스형 자료라는 이유만으로 표로 분류한 경우

교차검사:
- `STRUCTURAL ELEMENT INVENTORY.source_structure`와 runtime `tags`를 대조한다.
- `source_structure == table`인데 `"표"` 태그가 없으면 3차 WARN 또는 FAIL.
- `source_structure != table`이고 표 성격이 전혀 없는데 `"표"`가 있으면 3차 WARN 또는 FAIL.
- 그래프가 실제 핵심 시각자료이면 `"그래프"`, 순수 기하 그림이면 `"도형"`을 사용한다.
- 복합 통이미지 안에 여러 요소가 있어도 태그는 파일 형식이 아니라 **문항의 실제 자료 성격**을 기준으로 한다.

`tag_lint.csv` 권장 확장 컬럼:
```text
id,questionType,tags,forbidden_tag,source_structure,semantic_mismatch,approved,status
```

## 11-3. level
허용:
```text
하 / 중 / 상
```

판정은 기존 값을 신뢰하지 않는다.

- 하: 개념 1개 직접 적용, 짧고 직선적
- 중: 2개 이상 개념 결합, 조건 해석, 함정 보기
- 상: 경우 전수, 정수조건 핵심, 다단 구조화, 발상형

`상` 또는 `하` 판정은 최종 3차 보고에서 한 줄 근거를 남기는 것을 권장한다.

## 11-3-1. LEVEL BORDERLINE STABILITY LOCK — 경계 난이도 반복 흔들림 방지

난이도는 원문·정답처럼 완전히 기계적으로 결정되는 필드가 아니므로, **인접 두 level이 모두 합리적으로 설명 가능한 경계 문항을 재검 때마다 반복 변경하지 않는다.**

level 수정은 다음 중 하나가 명확할 때만 한다.
- 현재 level의 정의와 실제 풀이 구조가 명백히 충돌
- 인접 level 기준을 2개 이상 뚜렷하게 충족
- 기존 level 판정 근거에 사실 오류 또는 누락이 있음
- SOURCE REPAIR 등으로 문항 구조 자체가 바뀌어 기존 난이도 근거가 더 이상 유효하지 않음

경계 문항 처리:
```text
BORDERLINE_ACCEPTABLE
```

적용 원칙:
1. `하↔중`, `중↔상` 모두 합리적으로 설명 가능하고 핵심 풀이 구조가 바뀌지 않았다면 기존 level을 유지할 수 있다.
2. 단순 검수자 취향 차이, 계산량 체감 차이만으로 level을 반복 수정하지 않는다.
3. `조건 해석이 필요한데 하`, `다단 구조화가 뚜렷한데 하`처럼 명백한 오분류는 경계 문항으로 보지 않고 수정한다.
4. `BORDERLINE_ACCEPTABLE`을 적용한 경우 최종 3차 보고에 유지 사유를 한 줄 남긴다.
5. 이미 마스터가 특정 level을 명시 승인한 문항은 문항 구조가 바뀌지 않는 한 그 승인값을 우선한다.
6. level 안정화 규칙은 수학 오류·메타 오류를 덮는 용도로 사용할 수 없다.

권장 기록:
```text
reports/level_review.csv
```

권장 컬럼:
```text
id,current_level,candidate_level,borderline,reason,master_locked,status
```

## 11-4. 메타 수정 시 동족 문항 연쇄 재검

단원키·단원명이 수정되면 인접·혼동 가능 단원의 문항 전체를 다시 판정한다.

---

# 12. 이미지 에셋 제작·검수

기본 경로:
```text
assets/images/{examTitle}/q{id}.png
```

## 12-1. 제작
- 원본 직접 크롭 우선
- 원본 선·라벨·비율·인쇄 질감 최대 보존
- 재구성은 직접 크롭으로 핵심 조건을 판독할 수 없을 때만
- 학생 필기·도장·인접 문항 제외
- 점 이름·각도·길이·직각·점선·축 미절단
- 사방 안전 여백
- 원본 비율 왜곡 금지

## 12-2. 개별 4면 검사

각 PNG를 개별로 열고 원본과 1:1 대조한다.

- 위
- 아래
- 왼쪽
- 오른쪽
- 전체 외곽
- 라벨
- 작은 수치
- 각도
- 축
- 점선
- 박스 외곽
- 안전 여백

접촉 검수표만 보고 PASS 금지.

박스 외곽선이 이미지 끝에 닿으면 FAIL 또는 재크롭 대상.

## 12-2-1. MODIFIED ASSET STRUCTURE TYPE LOCK — 수정 에셋 구조타입 선확정

이미지를 **신규 생성·수정·재크롭·재구성**하는 문항은 작업을 시작하기 전에 해당 에셋의 원본 구조타입을 먼저 확정한다.

허용 구조타입 예:
```text
geometry
graph
table
data_box
condition_box
choice_box
proof_box
dialogue_box
composite_block
```

강제 규칙:
1. 수정 대상 에셋마다 `structure_type`을 먼저 기록한 뒤 크롭·재구성을 시작한다.
2. `data_box`, `condition_box`, `choice_box`, `proof_box`, `table` 등 박스형 구조는 수정 후 `border_top`, `border_bottom`, `border_left`, `border_right`, `outer_margin_ok`를 **권장이 아니라 필수**로 검사한다.
3. 원본에 존재하는 박스 외곽선 필수 면 하나라도 `FAIL`이면 해당 에셋 수정은 완료 처리하지 않는다.
4. `data_box`, `condition_box`, `choice_box`, `proof_box`라는 이유만으로 runtime `tags`에 `"표"`를 부여하지 않는다. 실제 행·열 구조가 있는 `table`일 때만 11-2-2 기준으로 `"표"`를 사용한다.
5. `composite_block`이면 `component_order`와 원본 `source_sequence`를 함께 잠그고, 합성 후 순서가 달라지면 FAIL이다.
6. 수정하지 않은 기존 에셋에는 이 절차를 이유로 불필요한 재크롭을 확장 적용하지 않는다. 다만 최종 12-2 개별 4면 검수 대상에서는 제외되지 않는다.
7. 수정 에셋의 `structure_type`과 11-2-2 TAG SEMANTIC LINT 결과가 충돌하면 수정 완료 보고 금지.

`asset_manifest.csv`의 수정 에셋 권장 확장 컬럼:
```text
structure_type,border_top,border_bottom,border_left,border_right,
outer_margin_ok,component_order
```

## 12-2-2. POST-ASSET-WRITE VISUAL GATE — 저장 직후 실제 PNG 재오픈

수정·재크롭·재구성한 에셋은 **이미지 처리 코드가 성공했다는 이유만으로 PASS 처리하지 않는다.**

강제 절차:
1. 디스크에 최종 저장된 정확한 `q{id}.png`를 개별로 다시 연다.
2. 원본 시험지와 1:1 비교하여 이번 수정 대상 문제가 실제로 사라졌는지 확인한다.
3. 수정 과정에서 새 잘림·마스킹·선 단절·라벨 누락·왜곡·인접 콘텐츠 혼입이 생기지 않았는지 확인한다.
4. 수정한 PNG의 상·하·좌·우 및 핵심 라벨을 다시 본다.
5. contact sheet는 보조 수단일 뿐 개별 PNG 재오픈을 대체하지 못한다.
6. 최종 ZIP 생성 후에는 **새 압축 해제본의 동일 PNG를 한 번 더 개별 오픈**한다.
7. 작업 폴더의 수정본과 ZIP 추출본이 시각적으로 동일한지 확인한다.
8. 수정 코드 실행 성공과 에셋 수정 PASS를 동일시하지 않는다.

판정:
- 수정 직후 실제 PNG를 열지 않았으면 `UNVERIFIED`.
- ZIP 추출본의 수정 PNG를 다시 열지 않았으면 최종 G5 PASS 금지.
- 수정 대상 문제는 사라졌지만 새로운 시각 회귀가 생겼으면 FAIL.

권장 기록:
```text
reports/post_asset_write_visual_check.csv
```

권장 컬럼:
```text
id,issue_before,issue_resolved,new_regression,working_file_opened,
zip_extract_opened,source_compared,status,note
```

## 12-2-3. NO DESTRUCTIVE MASKING ON CORE GEOMETRY — 핵심 도형 파괴적 마스킹 금지

학생 필기·오염·밑줄 제거를 위해 흰색 사각형, 브러시, 인페인팅 등
**파괴적 마스킹을 핵심 도형과 접하는 영역에 적용하지 않는다.**

핵심 도형 영역 예:
```text
원주
접선
현
반지름
직선·선분
교점
접점
축
점선
각 표시
길이·각도 라벨
점 이름
박스 외곽선
```

우선순위:
1. 더 넓은 원본 재크롭
2. 더 고해상도 원본 재렌더 후 재크롭
3. 원본 선·라벨·비율을 보존한 최소 재구성
4. 마스킹은 핵심 선·라벨·접점과 완전히 분리된 여백 영역에서만 허용

강제 판정:
- 마스킹으로 원주·접선·현·축·박스선 등이 1픽셀이라도 인위적으로 끊겨 보이면 FAIL.
- 흰색 블록·사각형·번짐이 원본에 없는데 핵심 구조 주변에 새로 생기면 FAIL.
- 필기 제거 후 접점·교점의 위치 관계가 불분명해지면 FAIL.
- 핵심 도형과 학생 필기가 겹쳐 직접 제거가 위험하면 억지로 지우지 말고 원본 재크롭 또는 최소 재구성을 선택한다.
- 재구성 시에는 12-1의 원본 형태 보존 원칙을 그대로 적용한다.

## 12-2-4. FINAL ALL-ASSET LABEL INVENTORY SWEEP — 전체 에셋 핵심 라벨 전수 대조

한 시험지에서 에셋 신규 생성·수정·재크롭이 **1건이라도 발생한 경우**, 최종 재검에서는 수정 에셋만 다시 보는 것으로 끝내지 않는다.
**최종 ZIP 추출본의 모든 PNG를 개별 오픈하여 원본의 핵심 라벨 인벤토리와 1:1 대조한다.**

목적:
- 점 이름 한 글자 누락
- 축 이름·단위 누락
- 작은 각도·길이 수치 누락
- 박스 제목·범례·주석 누락
- 수정하지 않은 기존 에셋의 과거 크롭 결함
을 마지막 단계에서 차단한다.

### EXPECTED LABEL INVENTORY

도형·그래프·표·자료박스 문항은 원본에서 먼저 기대 라벨 목록을 만든다.

예:
```text
q22 expected_labels:
A,B,C,O,P,36°,x
```

필수 대상:
```text
점 이름
축 이름
각도
길이·수치
단위
접점·교점 문자
범례
박스 제목
표 머리글
작은 주석
원본에 인쇄된 기타 핵심 문자
```

강제 절차:
1. 원본에서 문항별 `expected_labels`를 먼저 기록한다.
2. 최종 ZIP 새 압축 해제본의 `q{id}.png`를 하나씩 연다.
3. `expected_labels`가 최종 PNG에 모두 존재하는지 확인한다.
4. 각 라벨이 단순 존재하는 것뿐 아니라 잘리지 않고 판독 가능한지 확인한다.
5. 원본 expected label 1개라도 없으면 해당 에셋 FAIL이다.
6. “그림의 의미상 추론 가능하다”, “점 위치로 알 수 있다”는 이유로 누락 라벨을 PASS 처리하지 않는다.
7. 수정하지 않은 기존 에셋도 이 최종 sweep 대상에서 제외하지 않는다.
8. contact sheet는 전체 누락 탐지용 보조 자료일 뿐, 개별 PNG 전수 오픈을 대체하지 못한다.

최종 에셋 재검 순서:
```text
modified asset verification
→ all-asset label inventory sweep
→ final ZIP extract visual recheck
```

권장 기록:
```text
reports/asset_label_inventory.csv
```

권장 컬럼:
```text
id,expected_labels,observed_labels,missing_labels,clipped_labels,source_compared,status,note
```

## 12-3. 이미지 충돌 원인 3분류
1. JS 전사 오류
2. 원본 인쇄 라벨 오류
3. 실제 도형/그래프 형상 오류

원인이 확정되기 전에 임의 수정하지 않는다.

## 12-4. 이미지 파일명

한 시험지에서 0채움 방식을 혼용하지 않는다.

예:
```text
q1.png ~ q24.png
```
또는
```text
q01.png ~ q24.png
```

둘 중 하나.

고아 이미지 0개, 누락 이미지 0개를 확인한다.

## 12-5. asset_manifest

권장:
```text
id,asset_role,image_path,source_page,source_type,crop_box,
reconstructed,width,height,sha256,status
```

`source_type`:
```text
direct_crop
composite_direct_crop
reconstructed
```

정의:
- `direct_crop`: 원본의 연속된 한 영역을 그대로 직접 크롭
- `composite_direct_crop`: 원본의 둘 이상 직접 크롭 영역을 **원본 순서대로 합성**한 통이미지
- `reconstructed`: 직접 크롭만으로 핵심 조건을 살릴 수 없어 도형·그래프 등을 재구성

`composite_direct_crop` 사용 예:
```text
graph + condition_box
figure + dialogue_box
graph + choice_table
```

`composite_direct_crop`은 새로 그린 이미지가 아니며, 원본의 각 구성 요소를 직접 크롭하여
원본의 상대 순서를 보존하기 위한 엔진 호환 방식이다.

권장 추가 컬럼:
```text
component_order,embedded_source_text,note
```

박스형 에셋(`data_box`, `condition_box`, `choice_box`, `proof_box`, `table` 등)은
한쪽 외곽선 누락을 접촉검수에서 놓치지 않도록 다음 컬럼을 추가 기록한다.

```text
border_top,border_bottom,border_left,border_right,outer_margin_ok
```

판정 규칙:
- 원본에 존재하는 외곽선은 해당 방향 `PASS`여야 한다.
- 원본에 없는 방향은 `N/A`로 기록한다.
- 외곽선이 이미지 경계에 닿아 선의 완전성을 판정하기 어려우면 `FAIL`.
- `border_top/bottom/left/right` 중 원본 필수 면 하나라도 FAIL이면 해당 에셋 전체 `status=FAIL`.
- `outer_margin_ok=FAIL`이면 재크롭 대상으로 본다.
- 박스형이 아닌 순수 도형·그래프는 위 컬럼을 `N/A`로 둘 수 있다.

## 12-6. FINAL ASSET CLEAN GATE — 중간산출물 차단

최종 `assets/images/{examTitle}/`에는 실제 JS에서 사용하는 최종 에셋만 둔다.

기본 허용 파일명:
```text
q{id}.png
```

시험지 전체가 0채움 규칙을 사용하기로 확정된 경우에만:
```text
q01.png
q02.png
...
```
형태를 일관되게 허용한다.

최종 폴더에서 다음 패턴은 자동 FAIL 대상으로 본다.

```text
*_new.*
*_tmp.*
*_crop.*
*_test.*
*_debug.*
*_old.*
*_before.*
*_after.*
*_backup.*
```

추가 검사:
- JS에서 참조하지 않는 PNG 0개
- 동일 q번호 후보 이미지 2개 이상 존재 0건
- 임시 합성 부품 이미지가 최종 에셋 폴더에 남아 있지 않음
- 최종 ZIP 재해제본에서도 동일 조건 유지

임시 크롭·합성 부품은 작업 폴더 또는 OS temp에서만 관리하고 최종 `assets/images/`에 포함하지 않는다.

---

# 13. 보기 전체가 이미지인 객관식

①~⑤가 하나의 시각적 비교 묶음이면 **통이미지 1장**을 기본으로 한다.

```js
image: "assets/images/{examTitle}/q19.png",
choices: []
```

조건:
- 이미지 안에 ①~⑤ 전체 포함
- 번호·보기 전체 미절단
- 상대 배치 유지
- 고아 `q19_1.png`~`q19_5.png` 같은 중간 파일 없음

이 구조에서는 객관식인데 `choices: []`라는 이유만으로 FAIL 처리하지 않는다.

마스터가 개별 이미지 분리를 명시한 경우만 예외.

## 13-1. ENGINE ORDER COMPOSITE BLOCK — 엔진 렌더 순서 보존용 통이미지

원본의 실제 순서가 다음과 같이 구성될 수 있다.

```text
발문
↓
그림/그래프
↓
조건박스·대화박스·설명표
↓
보기
```

그런데 현재 엔진 구조가 `content → image → choices` 순서로 렌더되어
`content` 안의 조건박스·대화박스를 이미지 뒤에 배치할 수 없는 경우,
원본 순서를 보존하기 위해 **연속 시각 블록 전체를 하나의 통이미지로 구성**한다.

대표 예:
```text
그래프 + 조건박스
도형 + 대화박스
그래프 + 조건표
도형 + 설명박스
```

처리 원칙:
1. `content`에는 통이미지보다 앞에 있는 발문까지만 둔다.
2. 그림/그래프와 뒤따르는 조건·대화·표를 원본에서 직접 크롭한다.
3. 둘 이상 영역이면 `composite_direct_crop`으로 원본 순서대로 합성한다.
4. 통이미지 내부 구성 순서는 원본과 동일해야 한다.
5. 원본 텍스트·기호·박스 외곽을 축약하거나 다시 타이핑하지 않는 것을 우선한다.
6. 통이미지 뒤에 일반 객관식 보기가 있으면 `choices`를 유지한다.
7. 보기 자체까지 이미지에 포함된 구조라면 13장의 통이미지 보기 규칙에 따라 `choices: []`를 허용한다.
8. `asset_manifest`에 합성 사유와 구성 순서를 기록한다.

이 방식은 엔진 한계에 따른 **원본 순서 보존용 호환 처리**이며,
문항 내용을 재구성하거나 재출제하는 것으로 보지 않는다.

## 13-2. COMPOSITE BLOCK 검수

복합 통이미지는 개별 요소뿐 아니라 요소 사이의 순서도 검수한다.

필수:
- 원본의 그림/그래프가 먼저인지 확인
- 조건박스·대화박스·표의 원본 위치 확인
- 통이미지 내부 순서가 원본과 동일
- 각 구성 요소의 사방 안전여백
- 구성 요소 사이 불필요한 중복·잘림 없음
- content에서 이미지로 이동한 원문이 중복 출력되지 않음

순서가 바뀌면 모든 내용이 존재하더라도 1차 FAIL이다.

공통자료 문항은 추가로 6-7 `SHARED MATERIAL RANGE LOCK`과 6-8 `RENDER SEQUENCE GATE`를 함께 적용한다.
특히 공통자료 anchor에 통이미지를 둔 뒤 후속 문항에서 같은 자료를 다시 삽입하여 중복 출력하지 않는다.

---

# 14. 해설용 그래프·solutionImage 조건부 규칙

`solutionImage` 계열은 **실제 engine.html에서 해당 필드를 지원하는 것이 확인된 경우에만 사용**한다.

엔진 지원이 확인되지 않은 상태에서 기본 스키마처럼 자동 추가하지 않는다.

지원 확인 시 사용 가능한 조건부 확장 필드 예:
```js
solutionImage
solutionImageAlt
solutionImageCaption
solutionImageSize
```

문제용 `image`와 해설용 이미지는 별도 파일로 관리한다.

해설 그래프가 사용되면:
- exam 모드 노출 0
- ans 모드 노출 0
- sol 모드에서만 표시
- 경로·decode·크기·캡션·본문 일치 확인

엔진 지원 여부가 미확인이라면 해당 기능은 `NOT TESTED`로 둔다.

---

# 15. 수정프로토콜 — allowlist + diff lock

사용자가 “수정프로토콜 진행해/가동해”라고 하면 직전 검수에서 확정된 수정 범위를 승인한 것으로 본다.

별도 승인 질문 없이 실행한다.

수정 시작 전에는 반드시 1-1의 `BASELINE DISCOVERY LOCK`을 다시 수행한다.
최신 승인 ZIP과 단독 JS가 불일치하면 ZIP 추출본을 기준본으로 잠그고 stale 단독 JS를 수정 기준으로 사용하지 않는다.

## 15-1. allowlist 작성
예:
```text
allowlist:
- q17.content
- q21.solution
```

## 15-2. diff lock

수정 후 기준본과 수정본을 구조적으로 비교한다.

PASS 조건:
- 실제 diff가 allowlist와 정확히 일치
- 승인되지 않은 diff 0건
- 수정하지 않은 PNG SHA 동일
- 수정하지 않은 content/choices/answer/solution/meta/image 동일

권장:
```text
reports/source_to_final_diff.csv
```

컬럼:
```text
id,field,before,after,approved,status
```

`approved=false` 1건이라도 있으면 수정 완료 보고 금지.

## 15-3. PRE-RECHECK LINT — 수정 직후 재검 진입 전 자동 게이트

`diff lock`을 통과한 직후, 16장의 전 문항 재검에 들어가기 **전에** 기계적으로 잡을 수 있는 오류를 먼저 제거한다.

목적:
- 전체 1·2·3차 재검을 다시 돌린 뒤 단순 형식 오류를 발견하는 반복 루프를 줄인다.
- 수정 과정에서 새로 생긴 런타임·LaTeX·태그·경로 오류를 즉시 차단한다.
- 기존 정상 범위까지 자동 확장 수정하지 않는다.

검사 기준은 source 문자열이 아니라 가능한 항목은 **Node VM 최종 runtime 객체**를 기준으로 한다.

필수 LINT:
1. `node --check`
2. Node VM 로드 및 문항 수/id 연속성
3. 필수 필드 존재와 필드 타입
4. 객관식 일반 문항 `choices` 수, 통이미지 보기 객관식 예외 구조
5. answer ↔ solution의 실제 최종 정답 번호/값 일치
6. solution 결론 존재 여부
7. `$...$` 짝
8. 수식 내부 직접 `<`, `>` 사용 여부와 `\lt`, `\gt` 적용 여부
9. LaTeX source↔runtime 제어문자 소모 여부
10. 학생용 solution 내 운영 메모·검수 흔적·OCR/수정 이력
11. image 경로 ↔ 실제 파일 존재 여부
12. runtime `tags`의 금지 태그와 11-2-2 TAG SEMANTIC LINT
13. 비승인 `layoutTag` 특수값 / `wide:true`
14. 수정 에셋의 12-2-1 `structure_type` / 박스 4면 / 안전여백 상태
15. allowlist 밖 신규 diff 0건

판정:
- 실제 정답 번호·값이 틀리거나 누락된 solution 결론은 `HARD_FAIL`.
- 정답 번호·값과 논리가 정확하고 **결론 문구만 표준형과 다른 경우**는 23-1의 `MINOR_WARN`.
- `MINOR_WARN`을 표준화할 필요가 있더라도 해당 solution 필드가 기존 allowlist에 없으면 자동 확장 수정하지 않는다.
- 이미 allowlist에 포함된 같은 필드 안에서 발생한 기계적 형식 오류는 같은 수정 라운드 안에서 최소 보정 후 PRE-RECHECK LINT를 다시 실행할 수 있다.
- 무관한 문항·필드에서 새 오류가 발견되면 현재 allowlist를 몰래 확장하지 말고 신규 검수 적발 항목으로 기록한다.
- PRE-RECHECK LINT에 `HARD_FAIL`이 남아 있으면 16장 전 문항 재검으로 넘어가지 않는다.

권장 기록:
```text
reports/pre_recheck_lint.csv
```

권장 컬럼:
```text
id,check_type,field,severity,before,after,allowlisted,status,note
```

이 파일은 필요 시 최종 ZIP에 포함할 수 있으나 25장의 필수 현재상태 증거 8종 개수에는 포함하지 않는다.

---

# 16. 수정 후 전 문항 재검

수정 직후 수정 문항만 확인하고 종료하지 않는다.

반드시:
1. q1 → 끝까지 전 문항 재검
2. 끝 → q1 SOURCE FIDELITY 역방향 재검
3. answer-solution 일치
4. 후반 문항 누락
5. 이미지 누락
6. 압축·생략
7. allowlist 밖 변경
8. Node/VM
9. 변경하지 않은 이미지 SHA
10. 현재상태 보고서 동기화

수정 후 최종 문구:
```text
전 문항 재검 완료, 텍스트 누락/압축/생략 여부 확인 완료
```

---

# 17. 원본 자체 오류 문항 — SOURCE REPAIR OVERRIDE

기본은 원본 보존이다.

원본 자체가 수학적으로 성립하지 않고, 사용자가 **원본보다 실제 문항 성립을 우선하도록 명시 승인**한 경우에만 예외 모드를 적용한다.

단순 “수정프로토콜 진행해”는 SOURCE REPAIR 승인으로 보지 않는다.

승인 예:
```text
원본 신경 쓰지 말고 실제 문제가 성립하도록 고쳐
정답이 유일하도록 문항을 복원해
```

## 발동 조건
- JS 전사 오류 아님
- 원본 조건으로 정답 없음/복수/조건 부족/성립 불가 확인
- 독립 검산 완료
- 일반 최소복원으로 원문 의도가 유일하지 않음
- 마스터 명시 승인

## 최소 수정 후보
가능한 경우 동일 수정비용 후보를 전수 비교한다.

우선순위:
1. 숫자·부호·기호 1개
2. 조건 1개
3. 보기 1개
4. 그보다 큰 변경은 최후 수단

정상 후보가 둘 이상이면:
```text
REPAIR_AMBIGUOUS
```
로 보고하고 임의 선택하지 않는다.

학생용 content/solution에는 수정 이력을 쓰지 않는다.

## 17-1. SOURCE REPAIR CANDIDATE IMPACT MATRIX — 복원 후보 영향도 비교

SOURCE REPAIR 후보가 둘 이상이면 **수정 글자 수·수정 필드 수만 비교하여 자동 선택하지 않는다.**
최소 수정 원칙은 유지하되, 각 후보가 문항 전체 의도와 하위 조건에 미치는 영향을 함께 비교한다.

필수 비교 항목:
1. 수정 필드 수와 실제 수정량
2. 원문 핵심 조건 보존 정도
3. 원자료와 평균·합계·중앙값·분산 등 파생 조건의 정합성
4. 모든 소문항의 성립 여부
5. 정답 유일성
6. 계산 결과의 교육과정상 자연스러움
7. `content / image / choices / answer / solution`에 필요한 연쇄 수정 범위
8. 새 복수정답·정답 없음·비정상 값 발생 여부
9. 시각자료가 있는 경우 PNG 수정 필요 여부와 난이도
10. 원래 출제 의도를 가장 적게 훼손하는지 여부

특히 다음 충돌은 자동으로 어느 한쪽을 고치지 않는다.
```text
원자료 ↔ 명시된 평균
원자료 ↔ 합계
원자료 ↔ 중앙값/최빈값
원자료 ↔ 분산/표준편차
도형 수치 ↔ 발문 파생값
표 값 ↔ 본문 요약값
```

처리 규칙:
- 후보가 하나만 명백히 우월하면 그 근거를 보고하고 마스터 승인 후 적용한다.
- 동일 수정비용 후보가 둘 이상이면 impact matrix를 먼저 보고한다.
- 문항 의도 보존 측면에서 후보별 장단점이 갈리면 `REPAIR_AMBIGUOUS`를 유지하고 임의 선택하지 않는다.
- 마스터가 특정 복원 방향을 지정하면 그 후보를 `APPROVED_SOURCE_REPAIR`로 잠근다.
- “정답이 더 예쁘다”는 이유만으로 후보를 선택하지 않는다. 다만 교육과정상 자연스러움은 다른 조건과 함께 보조 판단 근거로 사용할 수 있다.

권장 증거:
```text
reports/source_repair_candidate_matrix.csv
```

권장 컬럼:
```text
id,candidate_id,change_summary,edit_cost,source_preservation,
subquestion_validity,unique_answer,downstream_changes,asset_change_required,
new_risk,master_selected,status,note
```

## 17-2. SOURCE REPAIR CONSISTENCY LOCK — 수리 조건 전 계층 동기화

`APPROVED_SOURCE_REPAIR`가 적용된 문항은 승인된 수정값이
**모든 표시·논리 계층에서 동일하게 반영되었는지** 별도로 확인한다.

필수 비교:
```text
content ↔ image ↔ choices ↔ answer ↔ solution
```

강제 규칙:
1. 수리된 숫자·부호·조건·보기가 이미지 안에도 존재하면 PNG도 같은 승인값으로 갱신한다.
2. JS `content`만 수정하고 이미지에 구버전 조건이 남아 있으면 FAIL.
3. 이미지와 content가 서로 다른 조건을 동시에 보여 주면 FAIL.
4. `answer`와 `solution`은 반드시 수리된 최종 조건을 기준으로 다시 계산한다.
5. solution 내부에 수리 전 숫자·조건·정답이 잔존하면 FAIL.
6. SOURCE REPAIR 문항은 최종 ZIP 새 추출본에서 수리된 조건을 다시 직접 풀어 정답 유일성을 재확인한다.
7. 승인된 변경 외의 원문 요소는 1-2 원문 성역을 그대로 유지한다.
8. 학생용 content/solution에는 수리 이력·원본 오류 설명을 노출하지 않는다.

권장 증거:
```text
reports/source_repair_consistency.csv
```

권장 컬럼:
```text
id,approved_change,content_match,image_match,choices_match,
answer_match,solution_match,unique_answer_rechecked,status
```

---

# 18. SOURCE ERROR LIFECYCLE

원본 자체 오류 문항의 상태를 보고서에서 명시한다.

```text
SOURCE_ERROR_UNRESOLVED
EXCLUDED
APPROVED_SOURCE_REPAIR
REPAIRED_PENDING_RECHECK
ACTIVE_PASS
```

`ACTIVE_PASS` 조건:
- 문항 성립
- 정답 유일
- answer 확정
- solution 완성
- 1차 PASS
- 2차 PASS
- 3차 PASS
- 고위험 재검 PASS

---

# 19. 최종 ZIP 구성

Windows 기본 압축 해제기 호환 ZIP.

루트:
```text
{시험지명}.js
assets/images/{시험지명}/...
reports/...
```

금지:
- 중첩 최상위 폴더
- `__MACOSX`
- 숨김 임시 파일
- 심볼릭 링크
- 과거 라운드 실행 데이터
- 고아 이미지

보고서는 provenance와 현재상태 보고서를 분리한다.

## 19-0. FINAL REVIEW LEDGER — 현재상태 단일 진실 원장

현재상태 보고서 여러 개를 각각 독립적으로 손수 판정하지 않는다.

최종 보고서 재생성 직전에 **하나의 검수 원장(single source of truth)** 을 먼저 만들고,
현재상태 보고서의 문항별 PASS/WARN/FAIL 값은 이 원장의 상태를 기준으로 생성한다.

권장 파일:
```text
reports/final_review_ledger.csv
```

권장 문항별 컬럼:
```text
id,source_status,math_status,solution_status,meta_status,asset_status,
correction_status,issue_code,severity,master_accepted,final_status,note
```

파일 전체 상태용 `__FILE__` 행 권장 컬럼/값:
```text
id=__FILE__
examTitle
question_count
final_js_sha256
image_count
package_status
browser_status
final_status
```

강제 규칙:
1. `FINAL_RECHECK.md`, `source_fidelity_matrix.csv`, `solution_curriculum_check.csv` 등 현재상태 보고서의 판정은 원장과 모순되면 안 된다.
2. 한 문항이 원장에서는 PASS인데 다른 현재상태 보고서에 FAIL로 남아 있으면 `STALE REPORT FAIL`.
3. 최종 JS, PNG, allowlist, master acceptance 상태 중 하나라도 바뀌면 원장을 먼저 갱신하고 현재상태 보고서를 다시 생성한다.
4. 과거 라운드 원장을 현재상태 원장으로 복사하여 쓰지 않는다.
5. `MASTER_ACCEPTED_PASS`를 적용한 MINOR_WARN은 `severity=MINOR_WARN`, `master_accepted=true`를 남긴다.
6. HARD FAIL은 `master_accepted=true`로 승격할 수 없다.
7. 패키징 직전 20장 STALE REPORT LOCK에서 원장 ↔ 현재상태 보고서 ↔ 최종 JS의 핵심 상태를 삼자 대조한다.

`final_review_ledger.csv` 자체는 최종 ZIP에 포함을 권장하지만,
기존 필수 증거 8종의 계약을 불필요하게 늘리지 않기 위해 **필수 8종 개수에는 포함하지 않는다.**
단, 원장을 사용하지 않는 경우에도 현재상태 보고서 간 상호 모순 0건을 별도 방식으로 증명해야 한다.

## 현재상태 권위 보고서

최종 JS와 현재 상태가 반드시 일치해야 한다.

최종 ZIP에 아래 8종은 **필수**다.
```text
reports/FINAL_RECHECK.md
reports/source_fidelity_matrix.csv
reports/solution_curriculum_check.csv
reports/source_to_final_diff.csv
reports/node_check.txt
reports/node_vm_check.txt
reports/asset_manifest.csv
reports/sha256_manifest.txt
```

1개라도 빠지면 G7 PACKAGE FAIL이다.

### CURRENT REPORT REGENERATION LOCK

현재상태 보고서는 과거 라운드 파일을 단순 복사·부분 수정하여 최종 증거로 사용하지 않는다.

최종 ZIP 생성 직전 또는 생성 직후의 최종 추출본을 기준으로 아래 파일을 **현재 상태에서 재생성**한다.
- `FINAL_RECHECK.md`
- `source_fidelity_matrix.csv`
- `solution_curriculum_check.csv`
- `source_to_final_diff.csv`
- `node_check.txt`
- `node_vm_check.txt`
- `asset_manifest.csv`
- `sha256_manifest.txt`

규칙:
- 이전 라운드 보고서는 provenance로 보존 가능하지만 현재 PASS 증거로 재사용 금지.
- 과거 SHA, 과거 수정 문항, 과거 FAIL/WARN 상태가 현재상태 보고서에 남으면 STALE REPORT FAIL.
- 최종 ZIP을 다시 만들었으면 현재상태 보고서와 SHA manifest도 다시 생성한다.

중복된 `questions.json`, `question_bank.json`, 문항 CSV 등 실행 가능한 구조화 데이터가 있으면 최종 JS와 완전 정합시키거나 제거한다.

## 19-1. WINDOWS ZIP COMPATIBILITY GATE

최종 전달 ZIP은 일반 ZIP 무결성뿐 아니라 **Windows Explorer 기본 압축 해제기 호환성**도 별도로 확인한다.

권장 생성 조건:
- 표준 ZIP 포맷
- 압축 방식은 `DEFLATE` 또는 `STORE`
- ZIP entry creator system은 가능하면 MS-DOS/NT FAT 호환 값 사용
- Unix UID/GID extra metadata 제거
- 심볼릭 링크 금지
- 한글 내부 파일명은 UTF-8 ZIP 표준 방식으로 기록
- **한글 등 비ASCII 문자가 포함된 모든 ZIP entry는 General Purpose Bit Flag의 UTF-8 플래그(bit 11, `0x800`)가 실제로 설정되어 있어야 한다.**
- JS 파일은 ZIP 루트에 실제 파일로 존재
- 중첩 최상위 폴더 없음
- 모든 JS/PNG 파일 크기 0 byte 금지

### 19-1-1. ZIP UTF-8 ENTRY FLAG LOCK — 한글 내부경로 인코딩 강제 검사

한글 파일명·폴더명이 ZIP 내부에서 깨지면 `testzip()`과 파일 SHA가 정상이어도 Windows 사용자에게는 파일이 보이지 않거나 깨진 이름으로 표시될 수 있다.
따라서 **ZIP 내용 무결성 검사와 파일명 인코딩 검사를 별개 게이트로 수행**한다.

강제 규칙:
1. ZIP 중앙 디렉터리의 모든 entry를 열거한다.
2. entry 이름에 ASCII 이외 문자가 1자라도 있으면 `flag_bits & 0x800 != 0`인지 실제 검사한다.
3. 비ASCII entry의 UTF-8 플래그가 하나라도 꺼져 있으면 `WINDOWS_ZIP_UTF8_FLAG_FAIL`로 기록하고 G7 PACKAGE FAIL 처리한다.
4. 깨진 이름을 CP437/CP949 등으로 추정 복구하여 PASS시키지 않는다. **최종 ZIP 자체가 올바른 UTF-8 이름을 보유해야 한다.**
5. 외부 ZIP 파일명만 영문이라고 내부 한글 경로 검사를 생략하지 않는다.
6. ASCII-only entry는 `0x800` 미설정 자체를 오류로 보지 않는다.

필수 기록값:
```text
non_ascii_entry_count
utf8_flag_pass_count
utf8_flag_fail_count
```

PASS 조건:
```text
utf8_flag_fail_count = 0
```

### 19-1-2. ZIP PATH ROUND-TRIP LOCK — 압축 전·중앙디렉터리·재해제 경로 3자 일치

파일 내용 SHA만 같아도 **경로명 자체가 변형되면 패키지 FAIL**이다.
최종 ZIP은 아래 세 경로 집합을 별도로 수집하여 정렬 후 완전 일치 비교한다.

```text
A. 압축 전 payload 상대경로 목록
B. ZIP 중앙 디렉터리에서 UTF-8로 해석된 entry 상대경로 목록
C. 새 폴더 extractall() 후 실제 생성된 상대경로 목록
```

강제 규칙:
1. `A == B == C`가 바이트/문자열 의미 기준으로 모두 일치해야 한다.
2. 한글 파일명·폴더명, 공백, 괄호, 밑줄, 숫자, 확장자를 모두 비교한다.
3. 파일 수가 같아도 경로 문자열이 하나라도 다르면 FAIL이다.
4. 동일 내용이 깨진 다른 이름으로 추출된 경우 SHA가 같아도 PASS 금지다.
5. 루트 JS 파일명과 `assets/images/{시험지명}/` 폴더명은 별도 핵심 경로로 한 번 더 확인한다.
6. 경로 비교는 디렉터리 엔트리 수가 아니라 **payload 파일 상대경로**를 기준으로 한다.

필수 기록값:
```text
prepack_path_count
central_directory_payload_path_count
extracted_payload_path_count
path_roundtrip_mismatch_count
root_js_name_match
asset_exam_folder_name_match
```

PASS 조건:
```text
path_roundtrip_mismatch_count = 0
root_js_name_match = true
asset_exam_folder_name_match = true
```

필수 검증:
1. ZIP 중앙 디렉터리 파일 목록을 실제 출력하여 확인
2. **19-1-1 `ZIP UTF-8 ENTRY FLAG LOCK` PASS**
3. **19-1-2 `ZIP PATH ROUND-TRIP LOCK`에서 압축 전 ↔ 중앙 디렉터리 ↔ 실제 재해제 경로 3자 완전 일치**
4. ZIP 루트 `{시험지명}.js` 존재 확인
5. `zipfile.testzip()` PASS
6. 새 폴더에 실제 `extractall()`
7. 압축 전후 payload file 수 동일
8. 압축 전후 상대 경로/파일명 동일
9. 압축 전후 전 파일 SHA-256 동일
10. 압축 해제본 JS `node --check`
11. PNG 실파일 열기 가능 여부
12. 최종 ZIP 안에 숨김·임시·Unix 전용 링크 항목 없음

ZIP 카운트는 다음 3개를 분리 기록한다.
```text
payload_file_count        # 실제 파일 수
directory_entry_count     # ZIP 내부 디렉터리 엔트리 수
total_zip_entry_count     # 파일 + 디렉터리 전체 엔트리 수
```

`payload_file_count`와 `total_zip_entry_count`가 다르다는 이유만으로 오류로 보지 않는다.
압축 전후 동일성 비교에는 `payload_file_count`를 사용한다.

사용자가 Windows에서 “ZIP 안 파일이 안 보인다”, “압축은 열리는데 파일이 없다”라고 보고한 경우:
- 기존 ZIP을 정상으로 가정하지 않는다.
- 기준 JS와 에셋을 다시 찾는다.
- Windows 호환 조건으로 새 ZIP을 생성한다.
- 새 ZIP 중앙 디렉터리에서 비ASCII entry의 `0x800` UTF-8 플래그를 다시 검사한다.
- 새 ZIP을 다시 압축 해제하여 **압축 전 ↔ ZIP 중앙 디렉터리 ↔ 재해제 상대경로 3자 일치**를 다시 검증한다.
- 파일 가시성·파일 수·전 파일 SHA를 다시 검증한다.
- 필요하면 **내용이 동일한 영문 외부 ZIP 파일명 사본**을 추가 제공할 수 있다.

외부 ZIP 파일명을 영문으로 바꾸더라도 내부 JS명·`examTitle`·에셋 경로는 승인 없이 변경하지 않는다.

## 19-2. DELIVERY SCOPE LOCK — 최종 전달 범위 선확정

최종 산출물 생성 전에 **사용자에게 실제로 전달할 파일 범위**를 확정한다.
불필요한 standalone 산출물을 습관적으로 생성하여 stale 파일 때문에 최종 판정이 흔들리는 일을 금지한다.

허용 모드:
```text
ZIP_ONLY
ZIP_PLUS_STANDALONE
```

### ZIP_ONLY
- 최종 판정의 기술 기준은 21장 `FINAL ZIP AUTHORITY`에 따른 최종 ZIP 새 압축 해제본이다.
- 단독 `수정완료.js`, `최종완료.js`를 최종 산출물로 생성·제공하지 않는다.
- 작업공간 또는 과거 대화에 남은 standalone JS와의 불일치는 G7 FAIL 사유가 아니다.
- `STANDALONE ↔ ZIP PARITY GATE`는 `N/A`로 기록한다.
- 사용자에게는 ZIP 링크를 최종 산출물로 제공한다.

### ZIP_PLUS_STANDALONE
- ZIP과 단독 JS를 모두 최종 산출물로 제공한다.
- 19-3 `STANDALONE ↔ ZIP PARITY GATE`를 반드시 수행한다.
- `byte_equal=false`이면 PACKAGE FAIL이다.

마스터 지시 해석:
```text
“압축파일 내부만 온전하면 됨”
“ZIP만 보면 됨”
“압축파일만 줘”
```
→ `ZIP_ONLY`로 잠근다.

```text
“JS도 따로 줘”
“ZIP과 단독 JS 둘 다 줘”
```
→ `ZIP_PLUS_STANDALONE`으로 잠근다.

강제 기록:
```text
delivery_scope: ZIP_ONLY / ZIP_PLUS_STANDALONE
```

규칙:
1. delivery_scope가 확정되기 전에 최종 다운로드 링크 목록을 만들지 않는다.
2. `ZIP_ONLY`인데 standalone JS를 추가 제공하여 새 parity 책임을 만들지 않는다.
3. `ZIP_PLUS_STANDALONE`인데 parity 검사 없이 두 파일을 동시에 최종본으로 제공하지 않는다.
4. 작업 도중 delivery_scope가 변경되면 현재상태 보고서와 FINAL REVIEW LEDGER의 package 상태를 갱신한다.
5. 이 규칙은 ZIP 내부 JS의 무결성·Node/VM·SHA 검사를 면제하지 않는다.

## 19-3. STANDALONE ↔ ZIP PARITY GATE — 별도 JS 전달본 동등성

최종 ZIP과 별도로 `수정완료.js`, `최종완료.js` 등 단독 JS를 사용자에게 제공하는 경우 적용한다.

필수 검사:
```text
standalone_js_sha256
zip_internal_js_sha256
byte_equal
```

PASS 조건:
- 단독 JS와 최종 ZIP 루트 내부 JS의 SHA-256이 동일
- 바이트 비교가 완전히 동일
- `node --check`가 양쪽 모두 PASS

FAIL 조건:
- SHA가 다름
- runtime 객체가 일부라도 다름
- 한쪽에만 구버전 tags/solution/content/answer/meta가 남음

`byte_equal=false`이면 PACKAGE FAIL이며 단독 JS 다운로드 링크를 최종본으로 제공하지 않는다.
단독 JS를 제공하지 않는 `ZIP_ONLY` 작업에서는 `해당 없음(N/A)`으로 기록한다.

---

# 20. STALE REPORT LOCK

최종 ZIP 생성 직전 현재상태 보고서의 핵심 값을 최종 JS와 대조한다.

반드시 일치:
- examTitle
- 문항 수
- 최종 JS SHA-256
- 이미지 수
- 수정 문항
- 현재 FAIL/WARN/PASS 상태
- 제외 문항 상태
- source repair 상태

JS와 보고서가 다르면 패키지 FAIL.

`final_review_ledger.csv`를 사용하는 경우 추가로 확인:
- ledger의 문항별 `final_status` ↔ 각 현재상태 보고서 문항 상태 일치
- ledger `__FILE__`의 `final_js_sha256` ↔ 최종 JS SHA 일치
- ledger의 `severity/master_accepted` ↔ FINAL_RECHECK의 경고·승인 상태 일치
- 보고서 한 곳에만 과거 FAIL/WARN이 남아 있지 않음

과거 라운드의 SHA가 현재 `final_js_sha256`으로 남아 있으면 FAIL.

---

# 21. 최종 ZIP 단일 기준본 — FINAL ZIP AUTHORITY

최종 완료 판정의 유일한 기술 기준본은 **방금 생성한 최종 ZIP의 새 압축 해제본**이다.

작업 폴더 PASS는 최종 PASS 근거가 아니다.

반드시 수행:
1. ZIP 생성
2. `zipfile.testzip()`
3. 새 폴더 `extractall()`
4. ZIP 루트 JS 확인
5. 압축 전후 파일 수
6. 전 파일 SHA-256
7. `unzip -t`
8. 압축 해제본 `node --check`
9. Node VM
10. LaTeX source↔runtime
11. id/문항 수/필수 필드
12. image 경로 ↔ 실제 파일
13. 이미지 변경 문항 시각 확인
14. allowlist/diff lock
15. 중복 구조화 데이터 정합성
16. STALE REPORT LOCK
17. 1·2·3차 결과와 최종 추출본 상태 일치
18. `delivery_scope=ZIP_PLUS_STANDALONE`인 경우 `STANDALONE ↔ ZIP PARITY GATE`
19. 현재상태 필수 증거 8종 존재 및 최종 추출본 기준 재생성 여부

한 항목이라도 FAIL이면 완료 판정 FAIL.

---

# 22. 실제 브라우저 렌더

브라우저 렌더 PASS는 실제 engine에서 확인했을 때만 준다.

필수:
- 최종 ZIP 압축 해제본 사용
- exam 모드
- sol 모드
- ans 모드
- MathJax 완료
- 이미지 decode 완료
- 첫 페이지부터 마지막 페이지까지 확인

검사:
- 발문·보기·해설 잘림
- 페이지 경계
- 중복/누락
- 이미지 비율·크기
- 수식 미렌더
- 복수정답 표시
- 서술형 소문항 줄바꿈
- 빈 마지막 페이지

렌더를 실행하지 못했으면:
```text
브라우저 렌더: 미확인
최종 운영 판정: WARN
```

스크린샷·출력물·렌더 로그 없이 PASS 금지.

---

# 23. FINAL CLOSURE GATE — 완료 선언 단일 게이트

최종 완료 보고 전 다음 게이트를 한곳에서 확인한다.

| Gate | 내용 | PASS 조건 |
|---|---|---|
| G1 | SOURCE FIDELITY | 전 문항 원문 문자·기호·보기·박스·이미지 대조 PASS |
| G2 | MATH | 전 문항 독립 풀이·정답 유일성 PASS |
| G3 | SOLUTION | answer 일치 + 교육과정 적합성 PASS |
| G4 | META | 단원·questionType·tags·level PASS |
| G5 | ASSET | 실제 파일·4면·라벨·SHA + FINAL ASSET CLEAN GATE PASS |
| G6 | CORRECTION | allowlist/diff lock + stale report PASS |
| G7 | PACKAGE | 최종 ZIP 추출본 Node/VM/SHA/경로 + WINDOWS ZIP COMPATIBILITY GATE + 필수 증거 8종 + delivery_scope 준수 + ZIP_PLUS_STANDALONE 시 PARITY GATE PASS |
| G8 | BROWSER | 실제 engine 렌더 PASS 또는 NOT TESTED |

## 23-1. ISSUE SEVERITY LOCK — HARD FAIL / MINOR WARN 분리

오류를 모두 같은 강도로 취급하지 않는다.
**수학·원문·구조·런타임·에셋·패키지 무결성에 영향을 주는 문제와, 의미에 영향 없는 학생용 문구 형식 차이를 분리한다.**

### HARD_FAIL

다음은 원칙적으로 HARD FAIL이다.
- 원문 문자·기호·조건·보기·박스·순서 불일치
- 정답 오류, 정답 없음, 비명시 복수정답
- answer ↔ solution 실제 정답 번호/값 불일치
- solution 핵심 계산·논리·근거 대상 오류
- 교육과정 밖 핵심 풀이
- 필수 필드/choices/JS runtime 오류
- LaTeX 런타임 파손 또는 엔진 안전 규칙 위반
- 이미지 핵심 조건·라벨·박스 외곽 누락
- 메타/단원키의 명백한 오류
- allowlist 밖 수정
- stale report
- ZIP 손상·SHA 불일치·필수 파일 누락
- 검사를 수행하지 않아 핵심 상태가 `UNVERIFIED`인 경우

HARD FAIL은 마스터가 단순히 “그 정도는 괜찮다”고 말한 것으로 자동 PASS 승격하지 않는다.
원본 오류를 의도적으로 수리하거나 예외 승인하는 경우에는 17장 `SOURCE REPAIR OVERRIDE` 등 해당 명시 절차를 따른다.

### MINOR_WARN

다음 조건을 **모두 만족하는 비의미적 형식 차이**만 MINOR WARN으로 둘 수 있다.
- 실제 수학 결과 정상
- `answer`와 solution의 최종 정답 번호/값 일치
- 학생이 최종 답을 명확히 알 수 있음
- 원문 `content/choices/image` 불변
- JS/런타임/렌더 안전성에 영향 없음
- 교육과정·메타·태그 의미에 영향 없음

대표 예:
- 객관식 결론이 `따라서 정답은 ①이다.` 표준형과 문구만 조금 다르지만, 동일 문장 안에 정확한 정답 번호가 명시되어 있고 논리가 완결된 경우
- 학생 이해에 영향 없는 solution의 비의미적 공백·문장 형식 차이

MINOR WARN으로 낮출 수 없는 예:
- 최종 정답 번호가 없거나 다른 번호인 경우
- `<`, `>` 직접 사용처럼 엔진 안전/LaTeX 규칙을 위반하는 경우
- 기호·변수·대상 문자가 달라 논리 근거가 바뀌는 경우
- 원문 표기 차이
- 이미지 라벨·박스 누락
- stale report

## 23-2. MASTER_ACCEPTED_PASS — 경미사항 마스터 승인 종료

`MINOR_WARN`만 남은 경우 마스터가 해당 항목을 명시적으로 수용하면 그 항목을
`MASTER_ACCEPTED_PASS`로 닫을 수 있다.

조건:
1. 남은 항목이 모두 23-1의 `MINOR_WARN` 조건을 만족
2. HARD FAIL / UNVERIFIED 0건
3. 마스터가 해당 경미사항을 최종 사용 가능 상태로 명시 승인
4. `final_review_ledger.csv` 사용 시 `master_accepted=true` 기록
5. `FINAL_RECHECK.md`에 승인된 경미사항과 승인 상태를 기록

효과:
- 승인된 MINOR_WARN은 해당 게이트 판정에서 **해결된 것으로 간주하여 PASS 승격 가능**하다.
- 실제 파일을 억지로 다시 수정하지 않고 종료할 수 있다.
- 승인되지 않은 MINOR_WARN은 기존 WARN으로 유지한다.

제한:
- G8 브라우저 `NOT TESTED`는 MINOR_WARN과 별개다. 실제 렌더 미확인은 기존 규칙대로 WARN이며,
  별도 명시 지시 없이 `MASTER_ACCEPTED_PASS`가 자동으로 G8을 면제하지 않는다.
- HARD FAIL은 이 규칙으로 PASS 승격할 수 없다.

## 판정 규칙

### PASS
- G1~G8 전부 PASS
- 또는 G1~G8 중 경미사항이 있었으나 23-2 `MASTER_ACCEPTED_PASS`로 모두 닫혀 최종적으로 전 게이트가 PASS 상태

### WARN
- G1~G7 전부 PASS
- G8만 NOT TESTED
- 또는 승인되지 않은 `MINOR_WARN`만 존재

### FAIL
- G1~G7 중 하나라도 FAIL 또는 UNVERIFIED
- 정답 오류
- 원문 변형
- 교육과정 밖 핵심 solution
- 메타 오류
- 이미지 조건 누락
- allowlist 밖 수정
- stale report
- ZIP 손상

**G1~G7이 전부 PASS가 아니면 “완료”, “최종 완료”, “수정 완료 PASS”라는 표현을 사용하지 않는다.**

---

# 24. 최종 보고 형식

```text
# 최종 판정: PASS / WARN / FAIL
```

| 검수 영역 | 판정 | 결과 |
|---|---:|---|
| SOURCE FIDELITY | | |
| 1차 구조·런타임 | | |
| 2차 수학·정오답 | | |
| SOLUTION METHOD | | |
| 3차 분류·메타·난이도 | | |
| 이미지 에셋 | | |
| 수정 diff lock | | |
| ZIP·기술 무결성 | | |
| 실제 브라우저 렌더 | | |

필수 기재:
- 원본 페이지 수
- 총 문항 수
- 객관식/단답형/서술형 수
- 수정 문항
- 수정 필드
- 정답 변경 문항
- 복수정답 문항
- 원문 최소 복원 문항
- SOURCE REPAIR 문항
- 이미지 생성/재크롭 문항
- level/meta 수정 문항
- solution 수정 문항
- `node --check`
- Node VM
- source↔runtime LaTeX
- 이미지 수
- ZIP payload_file_count
- ZIP directory_entry_count
- ZIP total_zip_entry_count
- ZIP non_ascii_entry_count / utf8_flag_fail_count
- ZIP path_roundtrip_mismatch_count
- ZIP root_js_name_match / asset_exam_folder_name_match
- 실제 압축 해제 검사
- delivery_scope: ZIP_ONLY / ZIP_PLUS_STANDALONE
- 단독 JS 제공 시 standalone_js_sha256 / zip_internal_js_sha256 / byte_equal
- final JS SHA-256
- final ZIP SHA-256
- 브라우저 렌더 여부
- HARD_FAIL 잔존 수
- MINOR_WARN 잔존 수
- MASTER_ACCEPTED_PASS 적용 여부와 승인 항목
- final_review_ledger 사용 시 ledger ↔ 현재상태 보고서 parity
- 다운로드 링크

마지막 문구:
```text
전 문항 재검 완료, 텍스트 누락/압축/생략 여부 확인 완료
```

---

# 25. 증거 파일 최소 세트

보고서 수를 불필요하게 늘리지 않는다.

최종 ZIP의 **현재상태 증거 필수 세트**:
```text
reports/FINAL_RECHECK.md
reports/source_fidelity_matrix.csv
reports/solution_curriculum_check.csv
reports/source_to_final_diff.csv
reports/node_check.txt
reports/node_vm_check.txt
reports/asset_manifest.csv
reports/sha256_manifest.txt
```

- 위 8종은 권장이 아니라 필수다.
- 1개라도 누락되면 G7 PACKAGE FAIL.
- 최종 ZIP이 새로 생성될 때마다 최종 추출본을 기준으로 재생성한다.
- 과거 라운드 보고서를 이름만 유지한 채 내용 일부만 덮어써 현재 증거로 사용하는 것을 금지한다.

필요한 경우에만 추가:
```text
reports/APPROVED_SOURCE_REPAIR.md
reports/source_repair_diff.csv
reports/source_error_lifecycle.csv
reports/browser_render_check.md
reports/ASSET_CONTACT_SHEET.jpg
```

과거 라운드 보고서는 참고용 provenance이며 현재 PASS 증거가 아니다.

---

# 26. 봉인 프로토콜 적용 시점

봉인은 일반 제작·수정 단계와 분리한다.

사용자가 명시적으로 **“봉인 진행”**이라고 했을 때만:
- `_r.js`
- 봉인 주석
- `examMeta`
- `Object.freeze(window.questionBank)`

등을 적용한다.

봉인본은 일반 수정완료본을 대체하지 않는다.

봉인 전 SHA와 봉인 후 SHA를 구분한다.

---

# 27. 새 시험지 시작 규칙

사용자가 다음 시험지의 JS + 원본 시험지 소스를 올리면:
- 진행 예고 없이 즉시 작업
- 이전 시험지 데이터·정답·이미지 재사용 금지
- 새 작업 공간 생성
- SOURCE TRUTH / BASELINE 분리
- 5문항 배치
- 원문 fidelity lock
- 독립 검산
- solution method lock
- 이미지 4면 검사
- 1·2·3차
- 수정 시 allowlist/diff lock
- 최종 ZIP authority
- FINAL CLOSURE GATE

까지 적용한다.

브라우저 실렌더가 불가능하면 데이터·패키지가 모두 정상이어도 최종 운영 판정은 WARN으로 한다.

---

# 28. 운영 한 줄 요약

> **원본은 문자·기호·자료 주변 단위·출처까지 잠그고, 정답은 독립적으로 다시 풀며, 수정 에셋은 구조타입부터 잠근다. 수정 PNG는 저장 직후와 ZIP 추출 후 다시 열고, 에셋 작업이 1건이라도 있었으면 최종에는 모든 PNG의 EXPECTED LABEL INVENTORY를 전수 대조한다. 핵심 도형에는 파괴적 마스킹을 하지 않는다. SOURCE REPAIR는 후보별 영향도를 비교한 뒤 승인안을 content·image·choices·answer·solution 전 계층에 동기화한다. 난이도 경계 문항은 근거 없는 반복 변경을 막고, 수정 직후 PRE-RECHECK LINT로 기계 오류를 먼저 제거한다. 최종 ZIP은 비ASCII entry의 UTF-8 `0x800` 플래그와 압축 전·중앙디렉터리·재해제 상대경로 3자 round-trip을 강제로 검증한다. 최종 전달은 DELIVERY SCOPE를 먼저 잠그며, 현재상태 보고서는 단일 REVIEW LEDGER와 동기화한다. HARD FAIL과 MINOR WARN을 분리하되 HARD FAIL은 타협하지 않고, 경미사항만 마스터 승인으로 종료하며, 최종 PASS는 새로 푼 ZIP 추출본의 증거로만 선언한다.**
