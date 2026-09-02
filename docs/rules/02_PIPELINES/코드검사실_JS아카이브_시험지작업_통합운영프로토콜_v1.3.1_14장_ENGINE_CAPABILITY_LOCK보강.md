# 코드검사실 / JS아카이브 시험지 작업 통합 운영 프로토콜
## PDF·페이지 이미지 기반 신규 제작 / 기존 JS 검수·수정 / 이미지 에셋 / 1·2·3차 검수 / 최종 ZIP 봉인 전 단계
### Integrated Clean Edition — 2026-08-25
### Revision: 기존 v1.2 전 규칙 유지 + MIDDLE SCHOOL GRADE 1 SOLUTION MANDATORY LOCK — 중1 solution 공란 허용 예외 폐기 / 전 학년 일반 문항 solution 필수 / G3 SOLUTION 비공란 게이트 / 중1 해설 미작성 HARD_FAIL 추가
### Revision Addendum 2026-08-26: 14장 ENGINE CAPABILITY LOCK 보강 — solutionImage 엔진 지원 확인과 시험지별 브라우저 렌더 게이트 분리 / 지원 확인된 필드는 렌더 미실시만으로 1차 FAIL 금지
### Revision Addendum 2026-08-28: REAL RENDER GATE 고정 — 기준본 잠금 후 exam·solution·answer 실렌더를 수행하고, 수정 후 세 화면을 재렌더한 경우에만 최종 PASS·ZIP 봉인 허용 / internal-review-live는 사용 가능한 경우 별도 기록
### Revision Addendum 2026-09-01: EXTERNAL v1.2 FINAL PARITY LOCK — 유사문제 내부 검수는 외부 G0~G8을 하한선으로 사용 / fidelity·identity·metric visual·semantic questionType·score marker·외부 패키지 closure를 fail-closed로 강제

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
- 독립된 보기 제목을 화면에 `<보기>`로 표시해야 할 때만, 줄 시작 또는 `<br>` 뒤의 `&lt;보기&gt;` 사용
- 원본 줄바꿈을 엔진 구조에 맞는 `<br>` 또는 안전한 문자열 줄바꿈으로 표현
- 인쇄된 수식을 동일하게 보이도록 LaTeX로 변환

### INLINE VIEW LABEL LOCK — 발문 속 보기 단어와 독립 보기 제목 분리

- `보기에서`, `보기의`, `보기 중`, `보기를`, `보기와`처럼 **조사가 붙어 문장 성분으로 쓰인 경우**에는 반드시 평문 `보기`를 사용한다.
- `다음 &lt;보기&gt;에서`, `[보기]의 조건`, `<보기> 중`처럼 발문 안에 꺾쇠·대괄호 라벨을 넣지 않는다.
- `&lt;보기&gt;`, `<보기>`, `[보기]`는 실제 인쇄물의 독립된 보기 제목을 재현할 때만 사용하며, 문자열 시작 또는 명시적 `<br>` 뒤에서 보기 본문과 분리한다.
- 이미 `.note-box`, `.question-note-box`, `.box`로 구조화한 조건·보기 박스의 발문에는 평문 `보기`를 사용한다.
- 수정 후 `node archive/tools/view-label-lint.mjs`를 실행하여 인라인 보기 라벨 오류가 0건인지 확인한다.

이 규칙을 어기면 엔진이 발문 중간의 라벨을 독립 보기 블록으로 오인하여 자동 줄바꿈하거나 뒤 문장 전체를 박스 안에 넣을 수 있으므로 `HARD_FAIL`이다.

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

## 1-6. REAL RENDER GATE — 실제 화면 확인을 최종 PASS 필수 조건으로 고정

실제 엔진이 그린 화면을 확인하지 않은 상태에서 코드 구조만 보고 최종 PASS를 선언하지 않는다.

- 엔진 기능 지원 여부(`ENGINE CAPABILITY`)와 해당 시험지의 실제 브라우저 표시(`BROWSER RENDER`)는 별도 게이트다.
- 1차 구조·무결성 단계에서 브라우저 렌더를 아직 수행하지 않은 경우에는 1차 구조 판정을 유지할 수 있지만, 상태를 반드시 `NOT_TESTED`로 기록한다.
- 최종 PASS·최종 ZIP 봉인은 `exam`, `solution`, `answer` 세 화면의 실제 렌더 PASS를 모두 요구한다.
- 기준본 잠금 후 한 번 렌더하고, 수정이 발생하면 최종 ZIP 추출본에서 세 화면을 다시 렌더한다.
- 렌더 미실시(`NOT_TESTED`)는 엔진 지원 PASS로 대체할 수 없으며 최종 PASS로 승격할 수 없다.
- 실제 화면·스크롤·페이지 경계·MathJax 완료·이미지 decode를 확인하지 않고 정적 코드 검사만으로 렌더 PASS를 쓰지 않는다.

## 1-7. EXTERNAL v1.2 FINAL PARITY LOCK — 유사문제 내부 기준의 하한선

유사문제·유사시험지의 내부 검수 체크리스트는 외부
`코드검사실_유사문제_외부검수_통합규칙_v1.2_FINAL.md`의 `G0~G8`보다 약한 항목을 둘 수 없다.
외부 문서가 현재 실행 환경에 직접 제공되지 않은 경우에도 아래 규칙을 내부 기준으로 유지한다.

외부 parity 판정의 권위 순서는 `사용자의 현재 명시 지시 > 외부 v1.2 FINAL > ZIP 내부 review_manifest/review_intent`로 고정한다. 충돌은 보고서에 남기며, 사용자 지시로 필수 게이트를 생략한 경우에도 해당 항목을 `NOT_TESTED` 또는 `BLOCKED`로 기록한다.

강제 규칙:
1. 내부 단계명(`RENDERED_PACKAGED`, `READY_FOR_MANUAL_REVIEW`, `LOCALLY_FROZEN`)은 생산 PASS를 뜻하지 않는다. `FINAL CLOSURE`의 모든 게이트가 PASS이고 `productionSeal=PASS`인 경우에만 최종 완료·생산 승격을 허용한다.
2. `reviewIntent`, source↔candidate mapping, 시험지 identity/path가 확정되지 않으면 유사문제 Fidelity를 임의로 PASS하지 않는다.
3. `sourceIdentity`부터 `coreDecisionDelta`까지의 full Source Fingerprint, 정방향·역방향 Fidelity, A/B/C 판정 원장을 최종 문항별로 보존한다.
4. 좌표·metric 시각자료는 `pixel_per_unit_x = pixel_per_unit_y`, 필수 눈금·좌표, 불필요한 축/보조선 없음, 정답 누설 없음까지 확인한다.
5. 최종 candidate의 `questionType` 의미, score marker 중복, LaTeX 표면 오염, stale/중복 tags, identity 경로는 Node/VM 또는 동등한 결정적 검사로 차단한다.
6. whole-exam 유사 출력은 내부 evidence ZIP만으로 최종 PASS를 선언하지 않는다. compact external-review package, ZIP round-trip, 외부 지적사항 closure를 기록하고 최종 closure에 연결한다.
7. 기준본·후보·최종 ZIP이 달라지면 이전 1·2·3차 또는 브라우저 증거를 재사용하지 않고 최종 ZIP fresh extract 기준으로 다시 판정한다.

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

## 5-1. REAL RENDER GATE SEQUENCE — 중간 1회 + 최종 1회

시험지별 검수 순서는 다음 고정 순서를 따른다.

| 순서 | 게이트 | 필수 수행 |
|---|---|---|
| R0 | 기준본 잠금 | `BASELINE DISCOVERY LOCK`으로 기준 ZIP/JS와 SHA를 확정 |
| R1 | 1차 구조 검수 | JS 구조·필수 필드·누락·오염·렌더 요소 구조 확인 |
| R2 | exam 실렌더 | 실제 시험지 화면에서 첫 문항부터 마지막 문항까지 확인 |
| R3 | solution 실렌더 | 실제 해설 화면에서 전 문항·수식·시각자료 확인 |
| R4 | answer 실렌더 | 실제 정답 화면에서 순서·표기·문항 수 확인 |
| R5 | 2차 수학 검수 | 독립 풀이·정답 유일성·answer↔solution 대조 |
| R6 | 3차 메타 검수 | 단원·세부단원·난이도·태그·배치 메타 대조 |
| R7 | 수정 및 재검 진입 | 수정이 있으면 allowlist/diff lock과 PRE-RECHECK LINT 적용 |
| R8 | 최종 재렌더 | 최종 ZIP 추출본에서 exam·solution·answer를 다시 전부 확인 |
| R9 | 최종 판정 | 구조·수학·메타·에셋·패키지·최종 실렌더를 함께 판정 |

R2~R4는 중간 렌더 게이트이고, R8은 최종 렌더 게이트다. 수정 후에는 수정된 모드만 다시 보는 것으로 끝내지 않고 최종적으로 세 모드를 모두 재확인한다.

`internal-review-live.html`이 운영 엔진에 존재하거나 사용 가능한 경우에는 R2~R4와 함께 열어 확인하고, 미사용·미제공이면 `NOT_APPLICABLE` 또는 `NOT_TESTED` 사유를 기록한다. 이 보조 화면의 유무는 `exam`·`solution`·`answer` 필수 게이트를 면제하지 않는다.

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

## 6-9. SIMILAR REVIEW INTENT / MAPPING / FULL FINGERPRINT LOCK

유사문제 검수는 먼저 **무엇을 보존하고 무엇을 변형했는지**를 고정한 뒤 수학 정답을 판정한다.

- 원본 시험지 Fidelity는 원시험지의 문구·숫자·배점·자료·구조가 기준본과 맞는지를 판정한다.
- 유사문제 Fidelity는 candidate가 원본의 concept·problemType·solutionGraph·난도 역할을 유지하면서 독립 문항으로 재설계되었는지를 판정한다. 두 Fidelity를 하나의 PASS로 합치지 않는다.

### REVIEW INTENT

- 판정 우선순위는 현재 사용자 지시 > 최종 패키지 manifest > 미해결로 기록한다.
- `reviewIntent`가 `source_fidelity`, `controlled_variant`, `reconstruction`, `source_repair` 중 무엇인지 확정되지 않으면 모드 의존 판정은 PASS로 쓰지 않는다.
- 모드 의도가 미해결이면 해당 문항은 `G5 BLOCKED`이며 최종 PASS를 금지한다.

### SOURCE ↔ CANDIDATE MAPPING

- 원본 문항과 후보 문항은 정확한 1:1 mapping 또는 명시적인 group mapping으로 고정한다.
- 후보가 어느 원본에서 파생되었는지, 원본의 공통자료·이미지·정답·해설이 어디에 대응하는지 문항별로 기록한다.
- mapping이 모호하거나 누락되면 `BLOCKED/UNVERIFIED`로 두며, 후보 문항 수가 맞는다는 이유만으로 PASS하지 않는다.
- 정방향(source→candidate)과 역방향(candidate→source) mapping을 독립적으로 확인한다.

권장 manifest 형식:

```text
reviewIntent: <locked intent>
sourceExam: <source identity>
candidateExam: <candidate identity>
questionMapping:
  candidate q1 -> source q1
  candidate q2 -> source q2
  ...
```

### FULL SOURCE FINGERPRINT

최종 문항별 원장에는 다음 필드를 보존한다.

```text
sourceIdentity,concept,problemType,template,questionFormat,sourceObjective,
solutionEntry,solutionGraph,decisionPoints,branchCount,hiddenConditions,
commonTraps,visualDependency,answerForm,difficultyBucket,difficultyVector,
lockedCore,mutableSurface,forbiddenTransforms,sourceConditionForm,
sourceSolutionEntry,candidateVariantClass,preprocessingLayer,coreDecisionDelta
```

- 위 fingerprint 중 핵심 필드가 비어 있거나 근거 파일이 없으면 G5 PASS 금지다.
- `lockedCore`, `mutableSurface`, `forbiddenTransforms`는 후보 생성·수정 전에 잠그며, 사후에 결과에 맞춰 소급 작성하지 않는다.
- source fingerprint와 후보의 차이는 `A/B/C` 판정 원장으로 남긴다. A=허용된 표면 변형, B=조건·구조 영향 변형, C=원본 의미 훼손 또는 검수 불가로 분리한다.
- 정답이 맞고 구조가 실행되더라도 fingerprint·mapping·A/B/C 증거가 없으면 유사문제 Fidelity는 PASS가 아니다.

## 6-10. VARIANT CLASS / C PREPROCESSING COMPLETENESS LOCK

유사문제 유형은 파일명이나 숫자 변경량이 아니라 실제 문항 구조와 풀이 부담으로 판정한다.

- 단순 숫자·문자·보기 순서만 바꾼 문항은 독립적인 유사문제로 PASS시키지 않는다.
- `candidateVariantClass`는 A/B/C를 문항별로 명시한다. A는 허용된 표면 변형, B는 조건·구조 변형, C는 학생이 핵심 정보를 복원·가공해야 하는 변형이다.
- `reviewIntent=ENHANCED_BC_MIX`이면 A 문항 수는 0, B 문항은 1개 이상, C 문항은 1개 이상이어야 한다. 이 구성 증거가 없으면 G5 FAIL이다.
- C형은 `preprocessingLayer`를 solution에 실제로 설명해야 한다. 학생이 그림·표·조건을 해석·복원·가공하는 선행 단계와 그 결과가 핵심 풀이로 이어지는지 재현 가능하게 확인한다.
- C형인데 전처리 단계가 해설에서 생략되거나 결과만 제시되면 `C_VARIANT_PREPROCESS_OMITTED`로 기록하고 G3 PASS를 금지한다.
- C형의 `coreDecisionDelta`는 원칙적으로 0이어야 한다. 핵심 판단 단계가 1개 이상 늘면 단순 C형이 아니라 심화 재분류 대상으로 올린다.

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
  solution,
  subUnitKey,
  subUnit,
  subUnitConfidence,
  subUnitClassificationDepth
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

## 7-3. FINAL SURFACE LINT — 학생 표시 표면의 결정적 차단

정답·수학 판정과 별개로, 학생에게 실제로 보이는 표면을 최종 candidate 기준으로 검사한다.

- 문항별 배점 표식(score marker)은 의도된 위치에 정확히 1개만 있어야 한다. 중복·누락·다중 렌더는 G1 FAIL이다.
- `questionType`, choices 유무, 정답 입력 방식(`answerType`)의 의미가 서로 일치해야 한다. choices가 없다는 이유만으로 자동 서술형으로 분류하지 않는다.
- 신규 production 출력에서는 `주관식`을 사용하지 않고 `단답형` 또는 `서술형`으로 의미를 고정한다.
- `객관식`, `단답형`을 tags에 자동 복제하지 않는다. tags는 내용·교과 분류용으로만 사용하며 중복·stale 값은 제거한다.
- `$-...$`, `$--...$`처럼 불릿·하이픈을 MathJax 수식으로 감싼 표면 오염을 차단한다. 음수 부호와 목록 불릿을 구분하며, 브라우저에서 의미가 달라지면 정답이 맞아도 FAIL이다.
- 최종 content·choices·solution·image·metadata는 shadow/intermediate JSON 및 최종 runtime과 대조한다. 중간 산출물에만 존재하는 교정은 최종 파일의 근거가 아니다.
- 결과는 `reports/final_surface_lint.csv`에 문항별로 기록하고, 하나라도 `FAIL/NOT_TESTED`이면 G1/G4 PASS를 금지한다.

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

## 10-2. solution 품질 — ALL-GRADE SOLUTION MANDATORY LOCK

### 전 학년 공통 원칙
- **중1·중2·중3·고등 모든 일반 문항은 `solution`을 반드시 작성한다.**
- **중1도 `solution` 공란을 허용하지 않는다.**
- 과거의 `중1 solution 공란 허용`, `중1은 정답만 작성` 운영은 **폐기한다.**
- 중1이라는 이유만으로 `solution: ""`을 유지하거나 해설 작성·검수를 생략하면 `HARD_FAIL`이다.
- 기존 JS에 중1 `solution`이 비어 있으면 정상 legacy 예외로 통과시키지 않고 **해설 작성 대상**으로 잡는다.
- 원본 시험지에 공식 해설이 없더라도 발문·보기·정답을 독립 검산한 뒤 해당 학년 교육과정 범위 안에서 학생용 해설을 작성한다.
- 공식 제외 문항(`__EXCLUDED__`, `EXCLUDED_CANDIDATE` 등)은 해당 제외 규칙을 따르며, 이를 일반 중1 문항의 공란 허용 근거로 확대 적용하지 않는다.
- 해설의 난도와 표현 수준은 학년에 맞추되, **해설 존재 여부·answer 일치·핵심 풀이 완결성 검수는 전 학년에 동일하게 적용한다.**

전 학년(중1 포함) 일반 문항 기본 흐름:
```text
[키포인트]
조건 정리
풀이 방향
정석 풀이
결론
```

필수:
- 실제 계산식 또는 실제 판단 근거
- 식을 세우는 이유
- 핵심 단계 생략 없음
- answer와 마지막 결론 일치
- 운영 메모 없음
- 검수·OCR·수정 이력 없음
- 범용 템플릿 해설 금지
- 문항 자체를 직접 풀지 않은 채 `주어진 정답과 일치한다` 식으로 끝내는 해설 금지

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

신규 candidate·production은 위 세트에 세부단원 4개 필드를 추가해 검증한다.
`subUnitKey`는 compiled master에 존재하고 `standardUnitKey` parent와 일치해야 하며,
`subUnit`은 master 라벨과 같아야 한다. 허용 confidence는
`existing_preserved`, `candidate_evidence`, `category_or_cue_inferred`, `rule_inferred`,
depth는 `complete_candidate`, `complete_category`, `complete_documented`, `complete_rule`이다.
RAW/RRAW/UNMAPPED와 legacy 누락은 report 예외로 격리하며, 이 게이트는 원문·정답·해설을 수정하지 않는다.

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

## 12-0. 실전 에셋 실패 패턴 잠금 — 재발 방지 요약

에셋 작업에서 반복적으로 확인된 실패는 다음과 같이 일반화하여 차단한다. 이 절은 특정 시험지의 작업 이력을 저장하기 위한 것이 아니라 **재발 방지용 규칙**이다.

대표 실패 패턴:
- 학생 필기가 있다는 이유만으로 원본 도형 전체를 새로 재작도하여 원본의 선·비율·라벨 위치·인쇄 질감이 달라짐
- 수학적으로는 같은 의미라고 판단하여 각도·길이 라벨의 **소유 위치(ownership)** 를 임의 변경함
- 중점 tick, 합동표시, 직각표시, 점선 등 작은 의미표시를 누락하거나 서로 같은 모양으로 만들어 원본에 없는 등식 조건을 생성함
- 타이트 크롭으로 꼭짓점 문자, 선 끝, 표 외곽선, 작은 단위가 잘림
- 학생 필기 제거 후 원본 인쇄선을 국소 복원하면서 라벨·선·기호를 중복 생성함
- proof/table 에셋에서 4면 border 중 한쪽이 잘리거나 `(A)(B)(C)` 같은 빈칸 구조가 평문으로 바뀜
- 파일 존재·PNG decode·코드 실행만 정상이라는 이유로 실제 시각 오류를 PASS 처리함
- contact sheet만 보고 개별 PNG의 미세 누락·오염·잘림을 놓침

강제 원칙:
1. **깨끗하게 새로 그리는 것보다 원본 픽셀을 살리는 것을 우선한다.**
2. **조금 넓게 자르는 것을 기본값으로 하고, 모자라게 자르는 것을 금지한다.**
3. 학생 필기 제거는 원본의 핵심 도형·라벨·표시를 보존하는 최소 범위에서만 한다.
4. 수정 후에는 수정 대상 문제뿐 아니라 새로 생긴 시각 회귀가 없는지 반드시 원본과 다시 대조한다.
5. 에셋 GATE는 파일 무결성 검사가 아니라 **원본 의미·구조·라벨·소유권 보존 검사**다.

## 12-0-1. VISUAL AXIS / METRIC SCALE / REQUIRED SCALE LOCK

시각자료는 파일이 열리고 그림이 보인다는 이유만으로 의미 보존 PASS를 주지 않는다.

- 축은 자료가 실제 좌표평면 또는 단순함수 그래프임이 선언된 경우에만 허용한다. 순수 도형·선분·철사 구조·증명 그림에 원점, x/y축, 눈금, 화살표를 자동 삽입하지 않는다.
- `source_fingerprint`의 축 존재 여부와 최종 SVG의 `.axis` 개수·위치·역할을 대조한다. 불필요한 축·보조선이 새 교점, 각, 평행·수직 관계를 만들면 `VISUAL_AXIS_LEAK` HARD_FAIL이다.
- metric visual은 `pixel_per_unit_x = pixel_per_unit_y`를 강제한다. 확인할 수 없으면 `VISUAL_METRIC_SCALE_NOT_TESTED`로 기록하고 G6 PASS를 금지한다.
- 정사각형·원·직각·기울기 등 metric 의존 도형은 SVG 좌표와 raster pixel을 독립적으로 재계산하여 검증한다. 한 방식만 통과한 것은 충분하지 않다.
- 좌표·눈금·단위·길이·비율 등 문제 해결에 필요한 scale 정보가 발문 또는 최종 화면에서 사라지면 `VISUAL_REQUIRED_SCALE_MISSING` HARD_FAIL이다.
- 이미지 전처리 결과 자체가 답을 알려주거나, 특정 선택지를 강조하거나, 숨은 조건을 그림으로 추가하면 `VISUAL_ANSWER_LEAK` HARD_FAIL이다.
- renderer가 그리는 의미와 브라우저에서 보이는 topology를 분리해 확인한다. 도형·라벨·각도·길이의 ownership과 교점 수가 원본과 다르면 파일 무결성과 무관하게 FAIL이다.

필수 결과 파일:

```text
reports/visual_axis_policy_check.csv
reports/visual_metric_check.csv
```

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

## 12-1-1. ORIGINAL PIXEL FIRST LOCK — 원본 픽셀 최우선

학생 필기가 있다는 사실 자체는 재구성 허가가 아니다.

에셋 제작·수정의 강제 우선순위:
```text
1. DIRECT_SOURCE_CROP
2. 더 넓은/다른 범위의 DIRECT_SOURCE_CROP
3. DIRECT_CROP + PARTIAL_EDIT
4. COMPOSITE_DIRECT_CROP 또는 같은 원본의 깨끗한 픽셀을 이용한 SOURCE-PIXEL PATCH
5. 필기가 핵심 인쇄요소를 직접 덮은 국소 영역만 LOCAL_DETERMINISTIC_RECONSTRUCTION
6. FULL_RECONSTRUCTION_REQUIRED — 위 1~5가 모두 불가능할 때만
```

강제 규칙:
1. 원본에서 도형·표·라벨의 핵심 정보가 판독 가능하면 전체 재작도 금지.
2. `PARTIAL_EDIT`는 원본 크롭본 위에서 학생 필기·도장·오염 제거에 필요한 국소 범위로 제한한다.
3. 같은 원본 안에 동일 구조의 깨끗한 대응 픽셀이 있으면 새로 그리기보다 원본 픽셀 합성을 우선한다.
4. 국소 재구성은 필기에 가려진 영역만 대상으로 하고, 가려지지 않은 원본 픽셀은 유지한다.
5. 전체 재구성이 필요한 경우 `FULL_RECONSTRUCTION_REQUIRED` 사유와 직접 크롭 불가 근거를 보고서에 남긴다.
6. 재구성 에셋도 원본의 점 위치·선 연결·표식·비율·라벨 ownership을 임의 단순화하지 않는다.
7. 학생의 풀이·정답·보조선은 복원 근거로 사용하지 않는다.

필수 provenance 분류:
```text
DIRECT_SOURCE_CROP
DIRECT_CROP+PARTIAL_EDIT
COMPOSITE_DIRECT_CROP
COMPOSITE_DIRECT_CROP+PARTIAL_EDIT
LOCAL_DETERMINISTIC_RECONSTRUCTION
FULL_RECONSTRUCTION_REQUIRED
```

## 12-1-2. GENERATIVE ASSET BAN — 생성형 이미지 금지 / 결정론적 복원만 허용

수학 시험지의 도형·그래프·표·증명박스 에셋에는 **생성형 이미지 모델이 만든 그림을 사용하지 않는다.**

금지:
- AI 이미지 생성 모델로 수학 도형을 새로 생성
- 원본을 참고한 것처럼 보이지만 좌표·선·라벨이 비결정적으로 바뀌는 스타일 변환
- 원본 확인 없이 보기 좋은 도형으로 임의 재디자인

허용:
- 원본 직접 크롭
- 원본 픽셀의 국소 보정
- 원본 좌표·수치·표식 인벤토리에 근거한 **결정론적(vector/raster) 국소 복원**

`FULL_RECONSTRUCTION_REQUIRED`가 발생하더라도 생성형 이미지가 아니라 원본 사실에서 재현 가능한 결정론적 방식으로 복원한다.

## 12-1-3. SAFE CROP MARGIN LOCK — 여유 크롭 강제

에셋은 **타이트하게 잘라내는 것보다 조금 넓게 가져가는 것을 기본값**으로 한다.

강제 규칙:
1. 최초 크롭은 필요한 최종 범위보다 넓게 잡는다.
2. 가장 바깥쪽 인쇄요소와 이미지 경계 사이에 눈으로 확인 가능한 안전여백을 둔다.
3. 점 이름·길이·각도·단위·선 끝·화살표·tick·직각표시·점선·음영 경계·박스선은 경계에 닿지 않게 한다.
4. 권장 안전여백 목표는 **가장 바깥쪽 라벨 문자 높이 1개 이상**이다. 주변 문항 혼입 때문에 불가능하면 핵심 요소를 잘라내지 말고 인접 오염을 별도 부분수정한다.
5. `B`, `C`, `D`, `E`처럼 꼭짓점 한 글자라도 일부 잘리면 FAIL.
6. 선이 끝까지 이어지지만 끝점 라벨이 잘리거나, 라벨은 보이지만 선 끝이 잘리면 FAIL.
7. 표·proof box·조건박스는 4면 border 밖에도 안전여백을 남긴다.
8. 크롭 경계에 핵심 요소가 너무 가까워 잘림 여부를 판단하기 어려우면 `outer_margin_ok=FAIL`이다.
9. 최종 다듬기(trim)는 POST-ASSET-WRITE VISUAL GATE를 통과한 뒤에만 최소 범위로 한다.
10. 애매하면 좁게 자르지 말고 넓게 유지한다.

권장 기록:
```text
crop_margin_top,crop_margin_bottom,crop_margin_left,crop_margin_right,outer_margin_ok
```

## 12-1-4. HANDWRITING REMOVAL TIER LOCK — 학생 필기 제거 단계 잠금

학생 필기는 다음 단계 순서로 처리한다.

```text
A. 크롭 범위 조정으로 필기를 제외
B. 원본 크롭 위 여백 영역 PARTIAL_EDIT
C. 원본 크롭 위 핵심 인쇄요소와 겹치지 않는 국소 필기 제거
D. 같은 원본의 깨끗한 SOURCE-PIXEL PATCH
E. 가려진 국소 영역만 결정론적 복원
F. 전체 재구성 — 최후 수단
```

규칙:
- A~D로 해결 가능한데 E/F를 선택하면 FAIL.
- 핵심 선에 닿는 필기를 무리하게 인페인팅하여 선을 녹이거나 끊지 않는다.
- 필기 제거 후 원본 인쇄요소를 복원해야 할 경우 **지워진 요소만 정확히 1회** 복원한다.
- 필기와 원본 인쇄가 구분되지 않으면 학생 필기를 추측하여 도형 조건으로 채택하지 않는다.

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

## 12-2-5. GEOMETRY TOPOLOGY & SEMANTIC OWNERSHIP LOCK — 도형 연결구조·표시 소유권 잠금

도형 에셋은 라벨 존재 여부만 보지 않고 **무엇과 무엇이 연결되어 있는지, 각 표식이 어느 대상에 속하는지**까지 원본과 대조한다.

문항별 기대 인벤토리 예:
```text
vertices
edges
auxiliary_lines
dashed_lines
parallel_marks
right_angle_marks
midpoint_tick_groups
congruence_marks
angle_labels: {text, owner_angle}
length_labels: {text, owner_segment}
shading_regions
box_borders
```

강제 판정:
1. 원본에 없는 선을 추가하거나 원본 선을 누락하면 HARD FAIL.
2. 점 이름이 존재하더라도 다른 점 위치로 이동하면 FAIL.
3. 각도 라벨은 해당 각의 내부 또는 원본이 명확히 소유권을 나타내는 위치에 있어야 한다. 변 옆에 떠 있어 다른 각으로 읽힐 수 있으면 FAIL.
4. 길이 라벨은 어느 선분 전체 또는 부분을 뜻하는지 원본과 동일해야 한다. 전체 길이를 부분 길이처럼 보이게 배치하면 FAIL.
5. 동일 tick/표식은 **실제로 같은 길이·같은 관계를 뜻할 때만** 동일 모양을 사용한다. 서로 다른 변의 중점표시가 우연히 같은 모양이 되어 원본에 없는 등식이 생기면 FAIL.
6. 중점 tick, 직각표시, 평행표시, 합동표시, 점선 등 작은 기호도 수학 조건으로 간주한다.
7. 증명 그림에서 보조점·보조선이 하나라도 빠져 후속 proof가 그림과 연결되지 않으면 FAIL.
8. 표·proof box 안의 빈칸 `(A)(B)(C)` 등은 내용뿐 아니라 **박스 여부와 등호/문장 연결 위치**까지 원본과 동일해야 한다.
9. 시각적으로 그럴듯하거나 정답이 우연히 같다는 이유로 topology/ownership 오류를 PASS 처리하지 않는다.

권장 기록:
```text
id,expected_topology,observed_topology,missing_edges,extra_edges,
mark_group_status,angle_owner_status,length_owner_status,status,note
```

## 12-2-6. PARTIAL EDIT PATCH DIFF LOCK — 부분수정 영역·회귀 잠금

`DIRECT_CROP+PARTIAL_EDIT`, `COMPOSITE_DIRECT_CROP+PARTIAL_EDIT`, `LOCAL_DETERMINISTIC_RECONSTRUCTION`은 수정 영역 자체를 allowlist처럼 잠근다.

수정 전 기록:
```text
edit_region
issue_to_remove
source_print_inside_region
source_print_expected_after
```

수정 후 강제 검사:
1. 허용된 `edit_region` 밖의 원본 픽셀·구조를 불필요하게 바꾸지 않는다.
2. 필기 제거 과정에서 같이 지워진 원본 인쇄요소 목록을 만든다.
3. 복원해야 하는 인쇄요소는 **누락 0 / 중복 0**이어야 한다.
4. 점 이름을 국소 복원한 경우 동일 라벨이 이미 남아 있지 않은지 검사한다.
5. 선을 국소 복원한 경우 기존 선과 겹쳐 이중선·튀어나온 선·새 교점이 생기지 않는지 검사한다.
6. `E` 같은 라벨을 새로 쓴 뒤 원본 `E`가 이미 남아 중복되는 경우 HARD FAIL.
7. 필기 제거 때문에 음영·원주·점선 질감이 달라진 경우 해당 구조를 원본과 다시 비교한다.
8. 부분수정 성공 여부는 코드 실행 성공이 아니라 최종 PNG의 실제 시각 결과로 판정한다.

가능하면 원본 크롭과 수정본의 pixel diff를 저장하여 `edit_region` 밖 변경이 없는지 기계적으로 확인한다.

권장 기록:
```text
id,edit_region,changed_pixel_bbox,outside_region_change,
removed_handwriting,restored_print,duplicate_regression,status
```

## 12-2-7. COMPONENT COMPLETENESS & CROP ENVELOPE GATE — 구성요소 완전성·크롭 외곽 잠금

도형 전체가 보인다고 느껴지는 것만으로 PASS하지 않고, 원본의 구성요소 목록을 기준으로 **통째로 잘려나간 부분이 없는지** 검사한다.

대표 구성요소:
```text
main_figure
secondary_figure
left_square / right_square
auxiliary_triangle
proof_table
condition_box
choice_block
dimension_line
legend / small_print
```

강제 규칙:
1. 복합 도형의 일부 정사각형·삼각형·보조그림이 크롭 밖으로 사라지면 FAIL.
2. 꼭짓점 라벨이 경계 밖으로 빠진 경우 해당 도형 자체가 보이더라도 FAIL.
3. proof/table은 내부 텍스트뿐 아니라 외곽 4면과 제목 영역까지 포함해야 한다.
4. 원본의 왼쪽/오른쪽 두 그림 중 한쪽이 잘렸거나 축소되어 의미가 달라지면 FAIL.
5. 구성요소를 안전하게 모두 포함시키려면 인접 학생 필기나 다른 문항 일부가 들어오더라도 먼저 넓게 크롭하고, 핵심 영역 밖의 혼입만 후처리한다.
6. 구성요소 완전성 검수 후에만 최종 trim을 허용한다.

권장 기록:
```text
id,expected_components,observed_components,missing_components,
crop_envelope_ok,outer_margin_ok,status
```

## 12-2-8. FINAL ALL-ASSET TOPOLOGY SWEEP — 라벨뿐 아니라 선·표식 전수 재검

12-2-4 `FINAL ALL-ASSET LABEL INVENTORY SWEEP`는 최종 단계에서 다음 항목까지 확장한다.

```text
expected_labels
expected_edges
expected_auxiliary_lines
expected_mark_groups
expected_shading_regions
expected_borders
expected_components
```

한 시험지에서 에셋을 1건이라도 수정했다면 최종 ZIP 추출본의 **모든 PNG**에서 위 항목을 원본과 대조한다.

판정:
- 라벨은 모두 있는데 선 하나가 빠짐 → FAIL
- 선은 모두 있는데 중점표시가 잘못된 그룹으로 통일됨 → FAIL
- 표 내용은 맞지만 외곽선 한 면이 잘림 → FAIL
- 각도 숫자는 맞지만 다른 각의 소유 위치로 이동함 → FAIL
- 파일 decode와 SHA가 모두 정상이어도 시각 의미가 달라지면 FAIL

최종 G5 ASSET PASS는 `LABEL INVENTORY + TOPOLOGY INVENTORY + SAFE MARGIN + PARTIAL EDIT REGRESSION`이 모두 PASS일 때만 선언한다.

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

수정·재크롭·재구성한 에셋은 다음 정보를 **필수**로 기록한다. 수정하지 않은 기존 에셋은 가능한 범위에서 동일 형식으로 유지한다.
```text
id,asset_role,image_path,source_page,source_type,crop_box,
structure_type,edit_region,reconstructed,width,height,sha256,status
```

`source_type`:
```text
direct_crop
direct_crop_partial_edit
composite_direct_crop
composite_direct_crop_partial_edit
local_deterministic_reconstruction
full_reconstruction_required
```

정의:
- `direct_crop`: 원본의 연속된 한 영역을 그대로 직접 크롭
- `direct_crop_partial_edit`: 원본 직접 크롭본을 유지하면서 학생 필기·오염만 국소 수정
- `composite_direct_crop`: 원본의 둘 이상 직접 크롭 영역을 **원본 순서대로 합성**한 통이미지
- `composite_direct_crop_partial_edit`: 원본 직접 크롭 조각을 합성한 뒤 필요한 국소 필기·오염만 수정
- `local_deterministic_reconstruction`: 학생 필기가 핵심 인쇄요소를 직접 덮어 원본 픽셀만으로 복원 불가한 **국소 영역만** 원본 사실 기준으로 결정론적 복원
- `full_reconstruction_required`: direct/partial/composite/local 방식으로도 핵심 조건 보존이 불가능하여 전체 결정론적 재구성이 불가피한 최후 상태. 사유 증거 필수

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

# 14. 해설용 그래프·solutionImage / ENGINE CAPABILITY LOCK

`solutionImage` 계열은 **엔진 기능 지원 여부**와 **해당 시험지의 실제 브라우저 렌더 여부**를 분리하여 판정한다.

핵심 원칙:
> `FIELD SUPPORT CHECK`와 `PER-EXAM RENDER CHECK`는 서로 다른 게이트다.

따라서 `solutionImage`가 실제 운영 엔진에서 지원되는 것이 확인되었다면,
이번 시험지에서 브라우저 실렌더를 수행하지 않았다는 이유만으로
해당 문항의 1차 구조·무결성을 FAIL 처리하지 않는다.

## 14-1. ENGINE CAPABILITY LOCK — 엔진 기능 지원 확인

`solutionImage` 계열 지원 여부는 다음 둘 중 하나로 확인할 수 있다.

### A. 실제 엔진 코드 정적 검사
현재 운영 `engine.html` 또는 실제 렌더 코드에서 다음을 확인한다.

- `solutionImage` 또는 대응 필드를 읽는 코드가 존재
- 해설(`sol`) 렌더 경로가 존재
- 시험지(`exam`)·정답(`ans`) 모드와 구분되는 분기 또는 동등한 노출 제어가 존재
- 이미지 경로를 실제 DOM/image 렌더 대상으로 사용하는 코드가 존재

### B. 승인된 ENGINE_CAPABILITY 기록
이미 동일 운영 엔진에서 기능 지원을 검증했다면,
다음 정보를 별도 capability 기록으로 잠글 수 있다.

권장 파일:
```text
reports/ENGINE_CAPABILITY_LOCK.md
```

권장 기록:
```text
engine_version
engine_sha256
checked_at
evidence_type: static_code / browser_verified
supported_fields
supported_modes
solutionImage_supported: YES/NO
```

동일한 `engine_version` 또는 `engine_sha256`이 유지되는 동안에는
시험지마다 같은 기능 지원 여부를 반복 검증할 필요가 없다.

다음 경우 capability lock을 다시 확인한다.
- `engine.html` 또는 렌더 엔진 SHA 변경
- 렌더 관련 코드 수정
- 지원 필드명 변경
- exam/ans/sol 모드 분기 변경
- 기존 capability 기록과 실제 코드가 충돌하는 증거 발견

## 14-2. 조건부 확장 필드

엔진 지원 확인 시 사용할 수 있는 예:
```js
solutionImage
solutionImageAlt
solutionImageCaption
solutionImageSize
```

위 필드는 **엔진 지원이 확인된 조건부 확장 필드**이며,
기본 필수 스키마 필드와는 구분한다.

신규 문항에 엔진 미확인 확장 필드를 임의 추가하지 않는다.

단, 기존 JS에 `solutionImage`가 이미 존재하는 경우
엔진 지원 여부를 확인하지 않았다는 이유만으로 즉시 삭제하거나 1차 FAIL 처리하지 않는다.
먼저 `ENGINE CAPABILITY LOCK`을 확인하고,
확인이 불가능하면 해당 기능만 `NOT TESTED`로 둔다.

## 14-3. 문제용 image와 해설용 solutionImage 분리

문제용 `image`와 해설용 이미지는 별도 역할로 관리한다.

예:
```js
image: "assets/images/{examTitle}/q08.png",
solutionImage: "assets/images/{examTitle}/q08-solution.png"
```

검수:
- 각 경로의 실제 파일 존재
- PNG/JPG decode 가능
- 시험지명 경로 정합
- 잘림·오염·안전여백 확인
- 해설 본문과 이미지 내용 일치
- `solutionImage`로 참조된 파일은 고아 에셋으로 판정하지 않음
- 문제용과 해설용 파일의 SHA가 우연히 같더라도 역할이 명확하고 경로가 정상이라면 그 자체로 FAIL 처리하지 않음

## 14-4. 해설 이미지 노출 모드

해설 그래프 또는 해설 이미지는 원칙적으로:
- exam 모드 노출 0
- ans 모드 노출 0
- sol 모드에서만 표시

엔진 정적 코드에서 위 모드 분기가 확인되면
**기능 지원 상태는 PASS 가능**하다.

실제 브라우저 렌더를 수행한 경우:
- exam 모드 미노출 확인
- ans 모드 미노출 확인
- sol 모드 표시 확인
- 크기·캡션·본문 순서 확인

## 14-5. CAPABILITY 판정과 RENDER 판정 분리

### CASE A — 엔진 지원 확인 + 실제 브라우저 렌더 확인
```text
engine_capability: PASS
solutionImage_path: PASS
browser_render: PASS
```
→ 구조·에셋·렌더 모두 PASS 가능.

### CASE B — 엔진 지원 확인 + 이번 시험지 브라우저 렌더 미실시
```text
engine_capability: PASS
solutionImage_path: PASS
browser_render: NOT_TESTED
```
→ **문항의 1차 구조·무결성은 PASS 가능.**
→ `solutionImage` 존재만으로 FAIL 처리 금지.
→ 실제 렌더 게이트만 `NOT_TESTED`로 기록한다.
→ 단, 최종 `FINAL CLOSURE GATE`·최종 ZIP 봉인·최종 운영 PASS는 허용하지 않는다.

### CASE C — 엔진 지원 여부 자체가 미확인
```text
engine_capability: NOT_TESTED
browser_render: NOT_TESTED
```
→ 신규 `solutionImage` 자동 추가 금지.
→ 기존 필드가 존재한다면 해당 기능만 `NOT_TESTED`로 기록하고 capability 확인 대상으로 넘긴다.
→ **필드 존재 자체만으로 문항 수학/원문/메타 FAIL을 만들지 않는다.**
→ 단, 실제 런타임 오류·경로 누락·decode 실패가 확인되면 해당 항목은 FAIL.

### CASE D — 현재 운영 엔진이 해당 필드를 지원하지 않음이 확인
```text
engine_capability: FAIL
```
→ `solutionImage` 사용 불가.
→ 지원 가능한 inline SVG/HTML 또는 기존 엔진 호환 방식으로 전환한다.

## 14-6. FAIL / NOT TESTED 오탐 방지

다음은 금지한다.

- 현재 시험지에 `engine.html`이 첨부되지 않았다는 이유만으로 이미 지원 확인된 `solutionImage`를 FAIL 처리
- capability 확인 없이 기존 `solutionImage`를 임의 삭제
- `solutionImage`로 정상 참조된 파일을 고아 PNG로 판정
- 브라우저 실렌더 미실시를 1차 SOURCE/STRUCTURE FAIL과 혼동
- 엔진 기능 지원 여부와 개별 시험지 에셋 경로 오류를 같은 사유로 묶어 판정

판정은 반드시 분리한다.
```text
FIELD SUPPORT
ASSET PATH / DECODE
SOURCE / SOLUTION CONSISTENCY
BROWSER RENDER
```

## 14-7. 최종 보고 문구

엔진 지원은 확인되었으나 브라우저 렌더를 수행하지 않았다면:
```text
solutionImage engine capability: PASS
solutionImage asset/path/decode: PASS
browser sol-mode render: NOT_TESTED
1차 구조·무결성: PASS
최종 PASS·ZIP 봉인: 불가 — exam/solution/answer 최종 실렌더 필요
```

이 경우 `browser sol-mode render: NOT_TESTED`는
해당 문항의 원문·수학·메타 PASS를 취소하는 사유가 아니다.
그러나 전체 시험지의 최종 PASS를 선언하려면 22장과 23장의 필수 실렌더 게이트를 완료해야 한다.

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
16. `view-label-lint.mjs`의 인라인 보기 라벨 오류 0건

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
correction_status,review_intent_status,mapping_status,fidelity_status,
metric_scale_status,required_scale_status,axis_policy_status,response_form_status,
score_marker_status,identity_path_status,external_review_status,production_seal,
issue_code,severity,master_accepted,final_status,note
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
external_review_status
production_seal
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
8. 유사 출력은 `review_intent_status`, `mapping_status`, `fidelity_status`, `metric_scale_status`, `required_scale_status`, `axis_policy_status`, `response_form_status`, `score_marker_status`, `identity_path_status`, `external_review_status`, `production_seal`을 기존 상태와 별도로 기록한다.
9. 위 외부 parity 필드 중 하나라도 누락·`FAIL`·`WARN`·`NOT_TESTED`·`BLOCKED`·`UNVERIFIED`이면 legacy 9개 상태가 모두 PASS여도 최종 `final_status=PASS`를 금지한다.

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

## 21-0. EXTERNAL REVIEW PACKAGE CLOSURE LOCK

whole-exam 유사 출력은 최종 내부 evidence ZIP과 별도로 외부 검수가 재현 가능한 compact package를 만든다.

- 패키지에는 `original/archive/...`와 `similar/archive/...`를 분리해 담고, 원본·후보 JS의 문항 수·identity mapping·참조 에셋을 1:1로 확인한다.
- 모든 참조 에셋의 존재·상대경로·SHA-256을 기록하고, 누락·orphan·중복 identity를 허용하지 않는다.
- package ZIP에 대해 `testzip`, fresh extract, 경로 traversal, 허용 확장자, 전 파일 수, 결과 path/SHA/roundTrip을 확인한다.
- 외부 검수 결과가 없으면 `external_review_status=NOT_TESTED`로 명시하며 최종 PASS를 금지한다. 지적사항이 있으면 각 항목을 `open → fixed → closed`로 추적하고 미종결 항목은 PASS 금지다.
- `RENDERED_PACKAGED`, `READY_FOR_MANUAL_REVIEW`, `LOCALLY_FROZEN`은 생산 승인 상태가 아니다. 최종 `productionSeal=PASS`는 외부 package closure와 FINAL CLOSURE를 모두 통과한 뒤에만 부여한다.

---

# 22. 실제 브라우저 렌더

브라우저 렌더 PASS는 실제 engine에서 확인했을 때만 준다.

필수:
- 최종 ZIP 압축 해제본 사용
- `exam.html` 또는 동등한 exam 렌더 화면
- `sol.html` 또는 동등한 solution 렌더 화면
- `ans.html` 또는 동등한 answer 렌더 화면
- MathJax 완료
- 이미지 decode 완료
- 첫 페이지부터 마지막 페이지까지 확인

## 22-1. 화면별 필수 체크리스트

### exam 화면

- 문항 번호가 순서대로 보이는가
- 발문·조건·배점이 누락되지 않았는가
- 보기 ①~⑤가 정상 표시되고 서로 붙지 않는가
- 표·그림·PNG·SVG가 발문 바로 아래에 위치하는가
- 그림·SVG·PNG가 잘리지 않고 라벨·눈금·수치를 판독할 수 있는가
- 공통자료 anchor와 후속 문항 연결이 정상인가
- 후반 문항과 마지막 페이지까지 표시되는가
- 빈 마지막 페이지·중복 문항·누락 문항이 없는가

### solution 화면

- 전 문항 해설이 존재하고 중간에 끊기지 않는가
- 줄바꿈·문단·서술형 소문항 `(1)(2)(3)` 구조가 무너지지 않는가
- MathJax 수식이 모두 렌더되고 깨진 원문 명령이 남지 않는가
- 해설의 최종 결론이 `answer`와 일치하는가
- 해설용 SVG·PNG·`solutionImage`가 존재하는 경우 크기·캡션·본문 순서가 정상인가
- 교육과정 밖 표현이나 운영 메모가 학생 화면에 노출되지 않는가
- 페이지 경계에서 해설·수식·시각자료가 잘리지 않는가

### answer 화면

- 정답표의 문항 수와 순서가 JS와 일치하는가
- 객관식·복수정답·단답형·서술형 표기가 구분되는가
- 실제 JS `answer` 값과 화면의 정답이 일치하는가
- 후반 문항과 마지막 정답까지 누락 없이 표시되는가

### 공통 화면 점검

- 발문 속 평문 `보기`가 독립 보기 라벨로 오인되어 자동 줄바꿈·과대 박스를 만들지 않는가
- 표·보기·이미지의 폭이 화면과 인쇄 영역을 벗어나지 않는가
- 페이지 경계에서 요소가 잘리거나 겹치지 않는가
- 브라우저 화면과 인쇄/내부리뷰 출력에서 수식·이미지·줄바꿈이 유지되는가

## 22-2. 중간 렌더와 최종 재렌더

- 기준본 잠금 직후 R2~R4를 수행하고 `baseline` 결과로 기록한다.
- 이후 content, choices, answer, solution, image, SVG, layoutTag, CSS, 엔진 코드를 하나라도 수정하면 기존 렌더 결과를 최종 근거로 사용하지 않는다.
- 수정 후 최종 ZIP을 새로 압축 해제하여 R8에서 `exam`, `solution`, `answer`를 모두 재렌더한다.
- 수정하지 않은 화면도 최종 세 모드 재렌더에 포함한다. 다른 필드의 변경이 공통 CSS·페이지 분할·문항 순서에 영향을 줄 수 있기 때문이다.

## 22-3. 판정값과 증거

각 필수 화면은 다음 중 하나로 기록한다.

```text
PASS | WARN | FAIL | NOT_TESTED
```

기본 증거 파일:
```text
reports/browser_render_check.md
```

최소 기록:
```text
baseline:
  exam: PASS/WARN/FAIL/NOT_TESTED
  solution: PASS/WARN/FAIL/NOT_TESTED
  answer: PASS/WARN/FAIL/NOT_TESTED
  internal_review_live: PASS/WARN/FAIL/NOT_APPLICABLE/NOT_TESTED
final:
  exam: PASS/WARN/FAIL/NOT_TESTED
  solution: PASS/WARN/FAIL/NOT_TESTED
  answer: PASS/WARN/FAIL/NOT_TESTED
  internal_review_live: PASS/WARN/FAIL/NOT_APPLICABLE/NOT_TESTED
later_questions_checked: YES/NO
mathjax_complete: YES/NO
image_decode_complete: YES/NO
evidence: screenshot / print-output / render-log
checked_questions_or_pages:
```

스크린샷·출력물·렌더 로그 등 실제 확인 증거가 없으면 PASS로 기록하지 않는다. `internal-review-live.html`은 존재하거나 사용 가능한 경우 기록하되, 없으면 `NOT_APPLICABLE`로 남길 수 있다.

## 22-4. 최종 실렌더 판정

- 최종 `exam=PASS`, `solution=PASS`, `answer=PASS`이고 후반 문항 확인·MathJax 완료·이미지 decode 완료가 모두 충족되어야 G8 BROWSER PASS다.
- 필수 화면 중 하나라도 `FAIL`이면 최종 판정은 FAIL이다.
- 필수 화면 중 하나라도 `WARN`이면 최종 PASS가 아니라 WARN이다.
- 필수 화면 중 하나라도 `NOT_TESTED`이면 최종 PASS가 아니라 WARN/미완료다.
- 엔진 capability 정적 검사 PASS, Node 실행 PASS, HTML 파일 존재만으로 브라우저 실렌더 PASS를 대체할 수 없다.

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
| G3 | SOLUTION | **전 학년 일반 문항 solution 비공란** + answer 일치 + 핵심 풀이 완결성 + 교육과정 적합성 PASS |
| G4 | META | 단원·questionType·tags·level PASS |
| G5 | ASSET | 실제 파일·4면·라벨·SHA + FINAL ASSET CLEAN GATE PASS |
| G6 | CORRECTION | allowlist/diff lock + stale report PASS |
| G7 | PACKAGE | 최종 ZIP 추출본 Node/VM/SHA/경로 + WINDOWS ZIP COMPATIBILITY GATE + 필수 증거 8종 + delivery_scope 준수 + ZIP_PLUS_STANDALONE 시 PARITY GATE PASS |
| G8 | BROWSER | 최종 ZIP 추출본의 exam·solution·answer 실렌더 및 후반 문항 확인 PASS |

G8의 `NOT_TESTED`는 1차 구조·무결성 단계의 임시 상태로는 기록할 수 있지만, FINAL CLOSURE GATE의 PASS 조건으로 인정하지 않는다. G1~G8 중 하나라도 PASS가 아니면 최종 PASS·ZIP 봉인을 선언하지 않는다.

## 23-0. EXTERNAL v1.2 FINAL MIRROR — 내부 FINAL CLOSURE 확장 게이트

외부 v1.2의 G0~G8을 내부 최종 closure에 다음처럼 1:1로 매핑한다.

| External gate | 내부에서 반드시 확인할 항목 |
|---|---|
| G0 | fresh extract, ZIP/JS 무결성, `reviewIntent`, source↔candidate mapping, identity/path, START SHA |
| G1 | syntax/VM, 필수 필드, score marker, 학생 표시 표면 오염, 누락 문항 |
| G2 | 독립 풀이, 정답 유일성, 답 형식 및 문항별 answer 검증 |
| G3 | 해설 계산·논리·교육과정·재현성, 전 문항 solution, C preprocessing completeness |
| G4 | unit/subunit/level, semantic `questionType`, tags, 응답 형식 |
| G5 | full Source Fingerprint, 정방향·역방향 Fidelity, A/B/C, 난이도, visual dependency |
| G6 | 실제 SVG/PNG, semantic ownership/topology, axis policy, metric scale, required scale, composite/shared range/sequence |
| G7 | local duplicate, identity/path, orphan/missing assets, external-review package, END SHA = START SHA |
| G8 | 최종 ZIP fresh extract의 exam·solution·answer 실제 렌더 및 후반 문항 확인 |

추가 강제 규칙:

- 위 external G0~G8 중 하나라도 `FAIL`, `BLOCKED`, `UNVERIFIED`이면 최종 PASS를 금지한다. G0~G7의 `NOT_TESTED`도 최종 PASS로 승격할 수 없으며, G8의 `NOT_TESTED`는 외부 기준에 따라 최종 WARN으로만 기록한다.
- `MINOR_WARN`은 외부 v1.2와 동일하게 명시적 마스터 승인으로 닫힌 경우에만 PASS 승격할 수 있다. 외부 지적사항이 미종결이면 승인된 경미사항으로 간주하지 않는다.
- `RENDERED_PACKAGED`·`READY_FOR_MANUAL_REVIEW`·`LOCALLY_FROZEN`은 lifecycle status일 뿐 `productionSeal=PASS`와 동의어가 아니다.
- 원장·현재상태 보고서·최종 ZIP 요약이 서로 다르면 `STALE REPORT FAIL`이며, 과거 1·2·3차나 이전 브라우저 증거를 재사용하지 않는다.
- 내부 legacy G1~G8이 PASS여도 external mirror 증거가 없으면 최종 PASS·생산 승격을 선언하지 않는다.

## 23-1. ISSUE SEVERITY LOCK — HARD FAIL / MINOR WARN 분리

오류를 모두 같은 강도로 취급하지 않는다.
**수학·원문·구조·런타임·에셋·패키지 무결성에 영향을 주는 문제와, 의미에 영향 없는 학생용 문구 형식 차이를 분리한다.**

### HARD_FAIL

다음은 원칙적으로 HARD FAIL이다.
- 원문 문자·기호·조건·보기·박스·순서 불일치
- 정답 오류, 정답 없음, 비명시 복수정답
- answer ↔ solution 실제 정답 번호/값 불일치
- **중1 포함 일반 문항의 solution 공란 또는 해설 미작성**
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
- 내부 G1~G8과 외부 parity G0~G8이 전부 PASS
- 또는 내부·외부 게이트의 경미사항이 23-2 `MASTER_ACCEPTED_PASS`로 모두 닫혀 최종적으로 전 게이트가 PASS 상태

### WARN
- G1~G7 전부 PASS
- G8만 NOT TESTED
- 또는 승인되지 않은 `MINOR_WARN`만 존재

### FAIL
- G1~G7 중 하나라도 FAIL 또는 UNVERIFIED
- 외부 parity G0~G8 중 하나라도 FAIL, BLOCKED 또는 UNVERIFIED
- 정답 오류
- 원문 변형
- 교육과정 밖 핵심 solution
- 메타 오류
- 이미지 조건 누락
- allowlist 밖 수정
- stale report
- ZIP 손상

**G1~G8이 전부 PASS가 아니면 “완료”, “최종 완료”, “수정 완료 PASS”라는 표현을 사용하지 않는다.**

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
| 실제 브라우저 렌더 — baseline exam | | |
| 실제 브라우저 렌더 — baseline solution | | |
| 실제 브라우저 렌더 — baseline answer | | |
| 실제 브라우저 렌더 — final exam | | |
| 실제 브라우저 렌더 — final solution | | |
| 실제 브라우저 렌더 — final answer | | |
| internal-review-live | | |

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
- baseline exam / solution / answer 판정
- final exam / solution / answer 판정
- 후반 문항 스크롤·마지막 페이지 확인 여부
- MathJax 완료 여부
- 이미지 decode 완료 여부
- `internal-review-live.html` 판정 또는 미사용 사유
- 실제 캡처·출력물·렌더 로그 증거 경로
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

실렌더 게이트 증거는 최종 PASS에 필수이며, 다음 파일을 기본 위치로 사용한다.
```text
reports/browser_render_check.md
```

위 파일 대신 동등한 캡처·출력물·렌더 로그 묶음을 사용하는 경우에도 보고서에 실제 경로와 baseline/final별 exam·solution·answer 판정을 명시한다.

그 밖에 필요한 경우에만 추가:
```text
reports/APPROVED_SOURCE_REPAIR.md
reports/source_repair_diff.csv
reports/source_error_lifecycle.csv
reports/ASSET_CONTACT_SHEET.jpg
```

과거 라운드 보고서는 참고용 provenance이며 현재 PASS 증거가 아니다.

유사문제·유사시험지의 외부 parity closure에는 다음 증거를 추가한다.

```text
reports/review_intent.json
reports/question_mapping.csv
reports/source_fingerprint.csv
reports/variant_proof_ledger.json
reports/final_surface_lint.csv
reports/visual_axis_policy_check.csv
reports/visual_metric_check.csv
reports/external_review_package_manifest.json
reports/external_review_findings.json
reports/final_closure_report.json
```

- `variant_proof_ledger.json`에는 A/B/C 판정과 `coreDecisionDelta`를 문항별로 남긴다.
- `external_review_findings.json`은 지적사항이 없을 때도 빈 배열을 명시하여 `NOT_TESTED`와 구분한다.
- 위 parity 증거 중 필요한 파일이 없으면 해당 게이트는 `NOT_TESTED`이며 최종 PASS가 아니다.

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

> **원본은 문자·기호·자료 주변 단위·출처까지 잠그고, 정답은 독립적으로 다시 푼다. 에셋은 ORIGINAL PIXEL FIRST를 기본으로 하며 생성형 이미지를 금지하고, 학생 필기가 있어도 `넓은 원본 크롭 → 부분수정 → 원본 픽셀 합성 → 국소 결정론적 복원` 순서를 지킨다. 크롭은 항상 여유 있게 잡아 점 이름·선 끝·표 외곽을 잘라먹지 않는다. 수정 에셋은 구조타입·부분수정 영역·도형 topology·각도/길이 ownership까지 잠그고, 저장 직후와 ZIP 추출 후 다시 연다. 에셋 작업이 1건이라도 있었으면 최종에는 모든 PNG의 EXPECTED LABEL + TOPOLOGY INVENTORY를 전수 대조하며, 핵심 도형에는 파괴적 마스킹을 하지 않는다. SOURCE REPAIR는 후보별 영향도를 비교한 뒤 승인안을 content·image·choices·answer·solution 전 계층에 동기화한다. 난이도 경계 문항은 근거 없는 반복 변경을 막고, 수정 직후 PRE-RECHECK LINT로 기계 오류를 먼저 제거한다. 최종 ZIP은 비ASCII entry의 UTF-8 `0x800` 플래그와 압축 전·중앙디렉터리·재해제 상대경로 3자 round-trip을 강제로 검증한다. 최종 전달은 DELIVERY SCOPE를 먼저 잠그며, 현재상태 보고서는 단일 REVIEW LEDGER와 동기화한다. HARD FAIL과 MINOR WARN을 분리하되 HARD FAIL은 타협하지 않고, 경미사항만 마스터 승인으로 종료하며, 최종 PASS는 새로 푼 ZIP 추출본의 증거로만 선언한다.**
