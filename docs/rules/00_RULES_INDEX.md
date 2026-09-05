# JS아카이브 규칙 통합 인덱스

이 문서는 `docs/rules/`의 단일 진입점이다. 규칙 원문을 무리하게 한 파일에 복사하지 않고, 기준 원본·작업 프로토콜·검수 프로토콜·특수 규정·역사 문서를 역할별로 분리한다.

## 1. 현재 읽기 순서

### 신규 JS 추출·변환

모든 신규·변환 작업의 독립검수·봉인·실렌더 공통 기준은
`02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`를 함께 적용한다.

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 문항에만 적용)
3. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
4. `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
4. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
5. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
6. `02_PIPELINES/문제해설추출.md`
7. 필요 시 `02_PIPELINES/🤖 JS아카이브 발문·보기 추출 프로토콜 v4.md` 또는 `02_PIPELINES/JS_변환_프롬프트.md`
8. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
9. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
10. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`

### 기존 JS 해설 업그레이드

기존 production 업그레이드도 `02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`의
독립검수·source conflict·실렌더·봉인 조건을 공통으로 적용한다.

1. `01_CANONICAL/JS아카이브룰북_v2.6.md`
2. 해당 단원이 도형·그래프 대상이면 `04_VISUAL/도형추출.md` v3.0
3. `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
4. `02_PIPELINES/코드검사실_JS아카이브_시험지작업_통합운영프로토콜_v1.3.1_14장_ENGINE_CAPABILITY_LOCK보강.md`
5. `02_PIPELINES/해설프로토콜.md`
6. `02_PIPELINES/JS_문항품질_업그레이드.md`
7. 필요 시 `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`
8. `03_REVIEW/무결성검수.md`

### 수정·최종 출시

1. `01_CANONICAL/프로젝트_컨텍스트.md`
2. `02_PIPELINES/수정프로토콜.md`
3. `02_PIPELINES/작업방식_5문항배치루프_필수.md`
4. `03_REVIEW/JS아카이브_1차검수_프로토콜.md`
5. `03_REVIEW/JS아카이브_2차검수_프로토콜.md`
6. `03_REVIEW/JS아카이브_3차검수_프로토콜.md`
7. `03_REVIEW/무결성검수.md`
8. `04_VISUAL/도형추출.md` v3.0 (도형·그래프 문항에만 적용)
9. `04_VISUAL/AP_MATH_OS_집합_명제_논리시각자료_Semantic_Overlay_v1.4_QUALIFICATION_READY.md` (집합·명제 Logic Visual qualification 전용 candidate overlay)
10. `04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md` (해당 시)

## 2. 디렉터리별 역할

| 디렉터리 | 의미 | 현재 기준 |
|---|---|---|
| `01_CANONICAL/` | 모든 작업이 공유하는 기준 원본 | 운영 기준 |
| `02_PIPELINES/` | 추출·변환·해설·수정 실행 규칙 | 작업 종류별 적용 |
| `03_REVIEW/` | 구조·수학·메타데이터·최종 무결성 검수 | 검수 단계별 적용 |
| `04_VISUAL/` | 표·도형·그래프·SVG 제작과 검수 | 해당 문항에만 적용 |
| `05_DESIGN/` | 향후 엔진·시스템 구현 설계 | 구현 승인 전 참고 |
| `90_ARCHIVE/` | 레거시·DRAFT·대체된 이전 버전 | 현재 기준 아님 |

`02_PIPELINES/코드검사실_…통합운영프로토콜…`은 시험지 작업 전체를 조율하는 상위 운영 기준이다. 개별 추출·해설·수정 문서는 이 통합 기준의 세부 실행 모듈로 본다.

## 3-1. 실렌더 게이트

최종 PASS·ZIP 봉인은 코드 구조나 엔진 capability 확인만으로 선언하지 않는다. 통합 프로토콜의 `REAL RENDER GATE` 순서에 따라 기준본 잠금 후 `exam / solution / answer`를 실제 브라우저에서 확인하고, 수정 후 최종 ZIP 추출본에서 세 화면을 다시 모두 확인한다.

- 필수 화면 상태: `PASS / WARN / FAIL / NOT_TESTED`
- 최종 PASS 조건: 세 필수 화면 모두 PASS + 후반 문항·마지막 페이지·MathJax·이미지 decode 확인
- `NOT_TESTED`: 1차 구조 단계에서는 기록 가능하지만 최종 PASS·봉인 불가
- `internal-review-live.html`: 사용 가능한 경우 별도 확인, 없으면 `NOT_APPLICABLE` 또는 `NOT_TESTED` 사유 기록
- 실제 증거: `reports/browser_render_check.md` 또는 동등한 캡처·출력물·렌더 로그

## 3. 기준 원본

현재 신규 작업의 기준은 다음 세 문서와 compiled master의 조합이다.

- `01_CANONICAL/JS아카이브룰북_v2.6.md`
- `01_CANONICAL/JS아카이브_표준단원키_마스터테이블.md`
- `01_CANONICAL/JS아카이브_세부단원_운영규칙_v1.md`
- `04_VISUAL/도형추출.md` v3.0 (그래프·도형·hybrid 세부 수치와 출판 gate의 canonical source)
- `archive/data/master_tables/js_archive_tag_master.json`

마스터 테이블은 데이터 계약이고, 룰북·운영규칙은 그 데이터를 사용하는 정책 계약이므로 하나의 거대 문서로 합치지 않는다.

## 4. 중복 규칙을 읽는 방법

추출, 해설, 품질개선 문서에는 공통적으로 수식·solution·SVG·기존 production 보호 규칙이 나타날 수 있다. 작업 유형을 먼저 고른 뒤 해당 프로토콜을 주 기준으로 삼고, 다른 문서는 참조 문서로만 읽는다. 규칙 우선순위는 `룰북 → 최신 VISUAL 생성 프로토콜 → 작업별 pipeline → review protocol`이다. 그래프 style token·sampling·출판 수치와 geometry stroke·indicator·hatching·3D·hybrid 규칙은 `04_VISUAL/도형추출.md` v3.0만 authoritative source로 사용한다.

### 4-1. 충돌 방지 고정 규칙

- 신규 `choices`에는 ①~⑤ 등 보기 번호를 넣지 않는다. 배열에는 보기 내용만 저장하고 번호 표시는 엔진이 담당한다.
- 3차 메타데이터 검수에서 문서 내부 간이 단원표·기억·과거 예시는 사용하지 않는다. `JS아카이브_표준단원키_마스터테이블.md`와 compiled master를 직접 대조하고, 둘이 불일치하면 `SOURCE_PACK_DRIFT`로 FAIL 처리한다.

## 5. 역사 문서 처리

`90_ARCHIVE/`의 문서는 삭제하지 않고 당시의 설계·판정 근거로 보존한다. 현재 작업의 규칙으로 자동 적용하지 않는다. 특히 `DRAFT`, `LEGACY snapshot`, `v1.0` 문서는 새 작업 기준이 아니다.

## 6. 무결성 관리

`MANIFEST.md`는 이 디렉터리의 현재 운영 문서 목록과 SHA-256을 기록한다. 문서 이동·통합 후에는 누락 파일, 오래된 경로, 해시 불일치를 확인하고 manifest를 다시 생성한다.

## 7. archive 인접 문서의 경계

다음 문서는 규칙팩에 복사하지 않고 구현 코드 옆에 유지한다.

- `../../archive/tools/README.md`: 실제 검사 도구와 실행 명령의 안내
- `../../archive/tools/past-exam-pipeline/README.md`: PDF→candidate 파이프라인 실행 안내
- `../../archive/tools/past-exam-pipeline/docs/PAST_EXAM_PIPELINE_V2_POLICY.md`: 해당 도구의 구현 정책
- `../../archive/tools/js-bank-cleanup/README.md`, `../../archive/tools/tag-enrichment/README.md`: 각 도구의 실행·출력 계약

다음 영역은 현재 규칙으로 승격하지 않는다.

- `../../archive/_generated/`: 자동 생성된 inventory·audit·review 결과
- `../../archive/textbook/`: 교재 전용 파이프라인과 결과
- `../../archive/archive/docs/`: historical rulebook·구현계획·이전 설계
- `../../archive/analysis/`: 특정 작업의 분석·계획 메모
