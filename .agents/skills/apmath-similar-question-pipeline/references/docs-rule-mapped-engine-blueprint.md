# APMath 유사 시험지 생성 엔진 — docs 기준 매핑 설계도 v0.1

## 0. 문서 상태

- 상태: IMPLEMENTED_PARTIAL
- 목적: docs/rules/의 운영 기준을 ALIVE 유사문제·전체 시험지 생성 파이프라인의 실행 계약으로 번역한다.
- 적용 대상: Archive 기준 시험지에서 유사문제 또는 유사 시험지를 생성하는 STAGED_EXAM 경로
- 현재 경계: Rule Snapshot, 참고문항 선별, 학생용 상세 해설 계약, 해설 SVG lane,
  배치 해설 walkthrough, 결정적 mother final gate가 staged MVP에 연결되었다.
  실제 브라우저 자동화와 최종 ZIP 추출본 재렌더는 여전히 수동 evidence 경계다.
  시각자료 품질 최저선은 `references/visual-quality-floor.md`에 두며,
  현재 자동 시각 capability는 원·기본 좌표/선분/곡선/표 범위다. 함수식
  compiler, 부등식 음영, 타원·포물선·쌍곡선, 미적분 오버레이는 별도
  capability로 등록하기 전까지 자동 PASS 대상이 아니다. 이 장기 범위는
  `visual-benchmark`의 실험 lane에서만 대표 사례를 반복 검증하며,
  benchmark 통과는 production capability 승격을 의미하지 않는다.

이 문서는 canonical 규칙을 대체하지 않는다. 규칙 충돌 시 docs/rules/00_RULES_INDEX.md의 읽기 순서와 01_CANONICAL/의 현재 기준을 따른다.

## 1. 권위 문서와 규칙팩 로딩

### 1-1. 작업 시작 시 읽는 문서

엔진은 모델을 호출하기 전에 다음 순서로 규칙팩을 해석한다.

1. docs/rules/00_RULES_INDEX.md
2. docs/rules/02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md
3. docs/rules/01_CANONICAL/JS아카이브룰북_v2.5.md
4. docs/rules/01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md
5. docs/rules/01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md
6. 작업 유형별 02_PIPELINES/ 문서
7. 03_REVIEW/의 1차·2차·3차·무결성 문서
8. 시각문항이면 04_VISUAL/의 도형·SVG 문서
9. archive/data/master_tables/js_archive_tag_master.json

90_ARCHIVE/, 과거 계획서, 자동 생성 audit 결과는 현재 규칙의 권위로 자동 적용하지 않는다.

### 1-2. Rule Snapshot

현재 구현은 Run의 `source/rule-snapshot.json`에 다음 정보를 저장하고,
manifest에는 그 상태·해시·경로를 요약한다.

~~~json
{
  "rulePack": {
    "indexPath": "docs/rules/00_RULES_INDEX.md",
    "files": [
      {
        "path": "docs/rules/01_CANONICAL/JS아카이브룰북_v2.5.md",
        "sha256": "..."
      }
    ],
    "compiledMasterPath": "archive/data/master_tables/js_archive_tag_master.json",
    "compiledMasterSha256": "...",
    "status": "READY",
    "snapshotSha256": "..."
  }
}
~~~

다음 경우 모델 작업과 최종 판정을 시작하지 않는다.

- 현재 파일 해시와 docs/rules/MANIFEST.md가 불일치
- Markdown canonical master와 compiled master의 key·label·parent·order가 불일치
- 작업에 필요한 규칙 문서가 누락되거나 읽히지 않음
- 이전 Run의 규칙팩을 새 Run에 재사용했지만 해시가 확인되지 않음

판정 코드는 SOURCE_PACK_DRIFT 또는 규칙팩 로딩 실패로 남긴다.

구현 위치: `alive/engine/rule_pack.py`. 실제 저장된 snapshot은 모델 입력에
규칙 원문을 중복 주입하지 않고, 활성 문서의 repository-relative 경로와
MANIFEST/compiled master의 해시를 제공한다. production-like root에서
snapshot이 READY가 아니면 staged preflight가 fail-closed 된다.

### 1-3. 검수 통과 참고문항 팩

`alive/engine/reference_examples.py`가 `archive/exams/similar/**/*.js`를
스캔하고 `reviewed_pass` 또는 `auto_high` 상태의 문항만 canonical
단원·유형·응답형식·난이도·시각 의존성으로 점수화한다. Run에는
`source/reference-pack.json`이 저장된다.

- 문항별 최대 3개, 파일별 최대 2개로 컨텍스트를 제한한다.
- 참고팩에는 student-facing 필드만 남기며 `answer`와 `solution`은 넣지 않는다.
- 참고문항은 권위 문서가 아니므로 새 수치의 재계산·독립 풀이를 대체하지 않는다.
- 독립 검수 task packet에는 참고팩을 허용하지 않아 맹검성을 유지한다.

## 2. 원문 보존과 유사 변형의 분리

Archive 추출 규칙의 “원문 성역”은 원본 Archive JS를 고치는 작업에 적용한다. 유사문제 생성에서는 원본을 절대 변경하지 않고, 새 후보에 별도의 변형 계약을 부여한다.

~~~text
원본 시험지·원본 에셋
  └─ immutable source lock
       └─ variationContract
            └─ generated candidate
~~~

### 2-1. 보존 대상

- 문항 수와 문항 순서
- 문항 유형과 응답 형식
- 문항별 배점과 시험지 총점
- 교육과정 및 canonical 단원 계층
- 핵심 개념과 풀이 구조
- 공통자료·공통그림의 연결 관계
- 시각자료가 문제에서 수행하는 정보 역할
- choices의 번호 소유권: 데이터에는 내용만, 번호는 엔진이 표시

### 2-2. 허용 변형 대상

선택한 생성 프로필이 허용한 범위에서만 다음을 바꾼다.

- 수치·계수·변수
- 문맥과 표면 표현
- 보기의 오답 경로
- 좌표·길이·각도·축 범위
- 시각자료의 라벨과 결정론적 배치

### 2-3. 금지 변형 대상

- 핵심 개념을 다른 단원으로 변경
- 문항 유형·배점·총점 변경
- 원문보다 사고 단계를 임의로 삭제
- 시각 정보가 필수인데 그림을 제거
- 새 수치에 맞지 않는 원문 에셋 재사용
- 정답에 맞추어 발문·보기·그림을 사후 끼워 맞추기
- canonical master에 없는 단원키 추측

문항마다 다음 sidecar 계약을 만든다.

~~~json
{
  "sourceQuestionId": "...",
  "sourceQuestionSha256": "...",
  "preserve": ["questionType", "score", "coreConcept", "visualRole"],
  "allowedChanges": ["numericParameters", "choiceDistractors"],
  "forbiddenChanges": ["curriculum", "questionType", "visualTopology"],
  "variationMode": "STRUCTURAL_VARIANT",
  "contractSha256": "..."
}
~~~

## 3. 목표 파이프라인

~~~text
S00 RULE_AND_SOURCE_LOCK
  → S01 PREFLIGHT
  → S01A VISUAL_RECON (시각문항만)
  → S02 ROUND1_GENERATION
  → S03 INDEPENDENT_REVIEW_1
  → S04 BOUNDED_REVISION
  → S05 INDEPENDENT_REVIEW_2
  → S06 MOTHER_SEMANTIC_FINAL
  → S07 DETERMINISTIC_ASSEMBLY
  → S08 INTERMEDIATE_REAL_RENDER
  → S09 PACKAGE
~~~

현재 staged runtime의 S09는 `READY_FOR_PACKAGE` 상태에서 evidence와 Run
산출물을 압축하는 단계다. 렌더에서 결함이 발견될 때의 `RENDER_FIX`와
최종 ZIP 추출본 재렌더·G1~G8 closure는 다음 자동화 단계의 설계 목표로
남겨 둔다.

문항별 생성과 검수를 교대로 실행하지 않는다. 전체 1차 생성이 끝난 뒤 독립 검수 1을 시작하고, 수정이 끝난 뒤 독립 검수 2를 시작한다.

### 3-1. 배치 단위

문서의 기본 작업 단위인 5문항을 논리 배치로 사용한다.

~~~text
22문항 → b01 1~5 / b02 6~10 / b03 11~15 / b04 16~20 / b05 21~22
~~~

동시에 실행하는 배치는 최대 4개다. 다섯 번째 배치는 큐에 남겼다가 앞선 배치가 종료되면 실행한다. 배치 내부에서는 5문항 전체의 source·solution·visual·self-check 계약을 완성하지만, 세대 간 독립 검수는 모든 1차 배치 완료 후 시작한다.

현재 staged MVP의 균등 4분할은 호환 상태로 보존하되, docs 기준 활성화 시 위 5문항 논리 배치로 전환한다.

## 4. 단계별 계약

### S00 — Rule and Source Lock

- 요청의 시험지·문항·변형 프로필을 정규화
- Archive source JS, 관련 asset, 문항 순서, 문항 수, 배점, 시험 신원 잠금
- Rule Snapshot과 source SHA 기록
- production Archive는 읽기 전용

### S01 — Preflight

- 전 문항의 question type, score, total score, curriculum, visual dependency 판정
- canonical master의 단원 key를 직접 대조할 준비
- choices 라벨 중복, 필수 필드, source asset 존재 여부 확인
- 지원하지 않는 family는 조용히 다른 모드로 낮추지 않고 CAPABILITY_PRECHECK_FAIL

### S01A — Visual Recon

visualDependency != NONE인 문항에만 적용한다.

초기 생성 전에 실제 원본 이미지·crop·SVG·table을 직접 확인하고 다음 visualFingerprint를 만든다.

- 점·선·도형·축·표의 종류와 개수
- 라벨·수치·각도·눈금
- 연결·평행·수직·대응·교점 관계
- topology와 문제에서의 정보 역할
- 필수 시각정보인지 장식인지
- 원본 asset 경로와 SHA

시각자료를 파일명·태그·이전 보고서만 보고 추정하지 않는다.

### S02 — Round 1 Generation

각 Builder는 source question, variationContract, rule snapshot, visualFingerprint만 받고 다음을 만든다.

- 학생용 content, choices, questionType
- 학생이 따라갈 수 있는 `solution`과 구조화된 `solutionDetail`
- answer contract
- canonical metadata 후보
- 문제용 시각문항의 `visualSpec` 또는 `diagramBlueprint`
- 필요한 경우 해설 전용 `solutionVisualSpec`
- 자체 구조·수학·시각 self-check

Builder의 self-check는 독립 PASS가 아니다.

### S03/S05 — Independent Review 1/2

독립 수학 검수자는 생성자의 private answer contract, 내부 계획, 이전 검수자의
reasoning을 받지 않는다. 학생용 해설 검수는 별도의 `solution view`를 읽되
answerContract와 private plan은 받지 않는다.

검수자는 다음을 직접 판정한다.

- 문제 성립성과 정답 유일성
- 보기 5개 전수 판정
- solution과 answer 일치
- variationContract 충실성
- 교육과정·canonical metadata
- 문제↔시각자료↔해설 정합성
- 학생이 해설만 읽고 풀이를 재현할 수 있는지
- 단계별 식의 이유·정리 설명·검산·자주 하는 실수
- 원·직선·접선·접점·공통현·중심·반지름·수선 문항의 해설 도형 존재
- 실제 파일·SVG 구조·렌더 준비 상태

결과는 문항 또는 배치별 PASS / REVISE / FAIL과 핀포인트 근거로 남긴다.

### S04 — Bounded Revision

- 독립 검수에서 지적된 필드만 수정
- allowlist + diff lock + PRE-RECHECK LINT
- 시각문항은 content·answer·solution·solutionDetail·visualSpec·solutionVisualSpec·asset을 하나의 Candidate로 취급
- 핵심 수학 또는 시각 관계가 바뀌면 해당 문항의 독립 풀이부터 재실행
- 무한 자동 재생성 금지. 기본 경로는 재시도 한도를 넘으면
  `MANUAL_REVIEW_REQUIRED`로 보류한다. 사용자가 이미 시작한 whole-exam Run을
  계속하라고 명시한 경우에 한해, 원본 증거를 보존하는 단 한 번의 bounded
  `adaptive-staged-correction-start` pass를 허용하고, 그 pass 뒤에도 실패하면
  수동 보류로 남긴다.

### S06 — Mother Semantic Final

마더에이전트는 전체 시험지의 통합 판정자다. 문항별 Builder가 아니다.

입력:

- 전체 accepted student payload
- variationContract와 source fingerprint
- 독립 검수 1·2 결과의 요약
- 결정적 구조·정답·메타·asset 검사 결과
- visualSpec와 visual validator 결과
- 전 문항의 solutionDetail 및 1·2차 `solutionReview`
- 필수 solutionVisualSpec/asset의 역할·해시

검사:

- 문항 수·순서·배점·총점
- 문항 간 난도와 유형 균형
- 정답표와 solution의 전체 정합성
- 중복·누락·원문 에셋 혼입
- 시각자료의 문제·해설 역할 분리
- 독립 검수 결과의 충돌
- solutionDetail 누락·학생 walkthrough 미통과
- 해설 도형 필수 문항의 solution asset 누락

출력은 PASS / REVISE / HOLD다. 마더가 결과 파일을 직접 고치지 않으며, HARD_FAIL을 승인으로 덮지 않는다.

### S07 — Deterministic Assembly

결정적 CLI가 다음을 수행한다.

- canonical master 직접 대조
- JS schema와 choices 번호 소유권 확인
- answer contract 비교
- serializer/parser round-trip
- 중복·문항 수·ID·배점·총점 확인
- 문제용 asset과 해설용 asset 경로 확인
- 생산 Archive가 아닌 Run 전용 staging 산출물 작성

### S08 — Intermediate Real Render

마더 검수와 조립이 끝난 후보를 production engine의 실제 브라우저에서 확인한다.

필수 화면:

- exam
- solution
- answer

확인 항목:

- 첫 문항부터 마지막 문항까지
- 마지막 페이지와 페이지 경계
- MathJax 완료·콘솔 오류·overflow
- 표·보기·소문항 줄바꿈
- 이미지/SVG decode, clipping, 안전여백, 라벨 판독
- 문제용 asset은 exam에, 해설용 asset은 solution에만 표시

internal-review-live.html은 사용 가능한 경우 보조 확인하며, 필수 세 화면을 대체하지 않는다.

### Render Fix (Post-MVP)

렌더 문제가 발견되면 문제 유형에 따라 재진입한다.

- CSS·배치만 수정: 결정적 lint → 해당 화면 확인 → 전체 최종 재렌더
- content·choices·answer·solution 변경: 해당 문항 독립 수학 검수 재실행
- visualSpec·좌표·라벨·asset 변경: Python 검증 → Visual Validator → 해당 배치 독립 재검수
- 범위 밖 보호 문항 발견: 즉시 일괄 수정하지 않고 별도 issue로 기록

### Final ZIP Render and Closure (Post-MVP)

최종 ZIP을 새 폴더에 실제 압축 해제한 뒤 exam·solution·answer를 모두 다시 렌더한다. 마지막으로 G1~G8을 한 곳에서 판정한다.

~~~text
G1 SOURCE/VARIATION FIDELITY
G2 MATH
G3 SOLUTION
G4 META
G5 ASSET
G6 CORRECTION
G7 PACKAGE
G8 BROWSER
~~~

G1~G8 중 하나라도 FAIL, UNVERIFIED, NOT_TESTED이면 최종 PASS와 ZIP 봉인을 선언하지 않는다. MINOR_WARN만 남은 경우에도 마스터의 명시적 수용과 ledger 기록이 있어야 한다.

## 5. 시각자료 생성 계약

### 5-1. 문항과 에셋의 동시 동결

시각문항 Candidate는 다음을 하나의 단위로 본다.

~~~text
content + choices + answer + solution
       + visualSpec + asset + image/solutionImage path
~~~

수학 성립·정답 유일성·교육과정·Fidelity·시각 정합성이 모두 확인될 때까지 동결하지 않는다. 동결 후 핵심 좌표·수치·visualSpec·asset이 바뀌면 해당 검수부터 다시 시작한다.

### 5-2. SVG/PNG 선택

- 단순 좌표평면·선분·삼각형·사각형·원·수직선·단순 그래프: SVG 우선
- 복잡한 그래프·GeoGebra·인쇄 안정성이 더 중요한 자산: deterministic PNG 허용
- 생성형 이미지 모델로 수학 도형을 만들지 않음
- 좌표·교점·길이·각도·비율이 필요한 SVG는 Python 계산을 먼저 실행
- 함수 그래프는 눈대중 Bezier가 아니라 sampling 결과로 생성

### 5-3. JS 연결

- 문제용 시각자료: image 또는 기존 호환이 필요한 content 내부 시각요소
- 신규 PNG는 assets/images/<examTitle>/q{id}.png와 image 필드 우선
- 해설용 시각자료: `solutionVisualSpec`에서 생성한 hash-bound `solutionImage`
  또는 solution 내부 검증 inline SVG
- 문제용 image와 해설용 시각자료를 혼동하거나 무단 재사용하지 않음
- 시각요소가 있으면 tags에 도형, 그래프, 표 등 해당 태그 유지
- layoutTag와 wide는 마스터 지시 없이 자동 변경하지 않음

### 5-4. SVG 필수 검사

- viewBox, width, height 존재
- SVG XML parse 성공
- 내부 <br>·LaTeX·외부 폰트·script·foreignObject 없음
- Python 결과와 좌표·특수점 일치
- 라벨·수치의 semantic ownership 정상
- 4면 안전여백과 clipping 없음
- 흑백 인쇄 판독 가능
- 정답을 그림이 직접 누설하지 않음
- 원의방정식 계열은 중심·점·직선·접선·수선·현 등 풀이에 필요한 요소가 표시됨

## 6. 판정·상태 계약

~~~text
DRAFT
  → MOTHER_PASS_PENDING_RENDER
  → RENDER_PASS_PENDING_PACKAGE
  → AUTO_READY
  → LOCALLY_FROZEN
~~~

- DRAFT: 생성·검수·조립 중
- MOTHER_PASS_PENDING_RENDER: 마더 의미 검수는 PASS지만 실제 렌더 미완료
- RENDER_PASS_PENDING_PACKAGE: 세 화면 렌더는 PASS지만 최종 ZIP 재검증 전
- AUTO_READY: G1~G8 모두 PASS, production 등록은 별도 승인 필요
- LOCALLY_FROZEN: 최종 ZIP과 evidence가 해시로 잠김

NOT_TESTED는 중간 상태 기록에는 사용할 수 있지만 AUTO_READY와 LOCALLY_FROZEN으로 승격할 수 없다.

## 7. 역할·모델·쓰기 경계

| 역할 | 책임 | 쓰기 경계 |
|---|---|---|
| Mother Orchestrator | 요청 정규화, 단계 전환, 큐·재개, 최종 reducer 호출 | manifest, Run 상태 |
| Builder | 문항·solution·visualSpec 생성 | 자기 batch inbox |
| Independent Reviewer 1/2 | 독립 풀이·구조·Fidelity·시각 검수 | 자기 evidence |
| Visual Asset Builder | Python 결과 기반 SVG/PNG 생성 | 자기 asset staging |
| Visual Validator | 좌표·topology·라벨·파일·렌더 검증 | visual evidence |
| Mother Semantic Reviewer | 전체 시험지 통합 의미 검수 | 판정 artifact만 |
| Deterministic CLI | schema·hash·master·round-trip·package 판정 | final staging |
| Browser Render Reviewer | 실제 화면과 캡처·로그 증거 작성 | render evidence |

모델 자동 경로는 기본 gpt-5.6-luna + xhigh를 사용한다. 상태 전이와 계산 가능한 판정은 모델이 아닌 결정적 CLI가 수행한다. Terra/Sol은 routine path에 넣지 않고 사용자가 별도 수동 감사를 요청할 때만 사용한다.

## 8. 구현 승격 순서

### Phase A — Rule Bridge and Nonvisual Closure

- Rule Snapshot 생성기
- variationContract 저장·해시
- 5문항 논리 배치
- 마더 의미 최종검수 task와 reducer
- nonvisual 시험지의 exam/solution/answer 실렌더 evidence hard gate

### Phase B — Visual Recon and Deterministic Asset Lane (partially active)

- staged `S01A_VISUAL_RECON`의 local asset 경로·해시·디코드 검사
- source `visualFingerprint` 및 top-level `visualSpec` 계약
- deterministic SVG renderer와 asset/spec/report hash validator
- Candidate+Asset 동시 수용 및 final/shadow asset materialization
- 남은 범위: 실제 브라우저 시각 PASS 자동화와 최종 ZIP 추출본 closure

### Phase C — Final ZIP Render and Recovery

- 최종 ZIP 추출본 재렌더
- render failure의 범위별 재진입
- G1~G8 closure reducer
- 캡처·출력물·렌더 로그 evidence package

### Phase D — Archive UI Integration

- Archive에서 시험지를 선택하는 입력 화면
- 변형 프로필 선택
- Run 시작·진행·중단·재개 표시
- local result와 production publish 승인 분리

## 9. 첫 수용 테스트

입력:

~~~text
25년 금당고 고1 2학기 중간고사 전체 유사문제 만들어줘.
~~~

수용 조건:

1. 규칙팩과 source가 SHA로 잠김
2. 22문항이 5문항 논리 배치로 준비됨
3. 시각문항은 생성 전에 원본 asset을 직접 확인함
4. 전체 1차 문항이 먼저 완성됨
5. 독립 검수 1·수정·독립 검수 2가 순서대로 끝남
6. 마더가 전체 시험지를 PASS 또는 수정 사유로 판정함
7. 시각문항의 Python 결과·visualSpec·SVG/PNG·JS 경로가 일치함
8. exam·solution·answer 실제 렌더가 모두 PASS임
9. 최종 ZIP 추출본에서 세 화면을 다시 확인함
10. G1~G8이 모두 PASS이며 production Archive는 별도 승인 전 변경하지 않음

## 10. 현재 MVP와의 차이

현재 STAGED_EXAM은 다음을 의도적으로 보류한다.

- 원본 asset이 없거나 지원하지 않는 시각 의존 문항의 자동 생성
- Codex 내부 브라우저 자동 조작
- 최종 ZIP 추출본 재렌더 자동화

따라서 현재 capability가 이 설계의 모든 항목을 활성화했다고 보고하지 않는다. 활성화되지 않은 항목은 NOT_TESTED, CAPABILITY_PRECHECK_FAIL, 또는 MANUAL_REVIEW_REQUIRED로 남긴다.
