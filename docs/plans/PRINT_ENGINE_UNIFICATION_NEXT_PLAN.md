# PRINT_ENGINE_UNIFICATION_NEXT_PLAN

시험지 출력 엔진 3종(엔진 / 믹서엔진 / 오답엔진)의 렌더링 코어 통합과, 통합 후 미리보기 기반 문항 편집(단원별 문항수 확인, id별 제외, 시험범위 밖 문항 제외) 기능까지의 로드맵.

## 1. 현재 상태

### 1.1 엔진 3종 비교

| | 엔진 (`archive/engine.html`) | 믹서엔진 (`archive/mixed_engine.html`) | 오답엔진 (`apmath/wrong_print_engine.html`) |
|---|---|---|---|
| 용도 | 아카이브 시험 파일 통째 출력 | 믹서 카트(자유 구성) 출력 | 오답 클리닉 문항 출력 |
| 데이터 입력 | URL 파라미터(`data=exams/x.js`) — 무상태, 링크 공유 가능 | `localStorage` 키 핸드오프(`mixedQuestions_<key>` + `?key=`) — 휘발성, 공유 불가 | 서버 API(`packet`/`set` 키) + URL 압축(`wp=`) + storage + **postMessage 실시간 채널** |
| qpp(문항/쪽) | index 모달(`qppModal`)에서 4/6 고정, 엔진 내 변경 불가 | 2/4/6/8 **라이브 변경** | 4 고정(`CLINIC_QPP`) |
| 문항 조작 | 없음(파일 전체 id순 출력) | 셔플, 카트 자유 구성, PDF 뷰어 지원 | 오답 자동 추출 |
| 헤더 편집 | 팝오버 폼 | 팝오버 폼(복붙 동일) | 팝오버 + **미리보기 인라인 편집**(contenteditable, 포커스 보존 로직 포함) |
| 미리보기 | 새 탭(`fit=screen` 축소 지원) | 새 탭 | **임베드 iframe(`preview=1`) + 설정 변경 시 자동 갱신**(`apmath/js/clinic-print.js` 좌설정/우미리보기) |
| OS 연동 | 블루프린트·출제이력 자동 등록(`registerBlueprintToOS`, `registerClassExamAssignmentToOS` — `submitQr`/`class` 파라미터 있을 때만) | 출제 학급 선택 모달 | 서버 저장 payload → 짧은 QR 키 |

### 1.2 문제점

- **렌더링 코어 삼중 복제**: `SE_OVERHEAD_*` 상수, staging 측정, 페이지네이션, `printHeaderOptions` 정규화(clampText/normalize/getDefault), QR 패치가 세 파일에 거의 동일 코드로 존재. 이미 드리프트 시작(오답엔진에만 `showDate`, 믹서에만 qpp 셀렉트/셔플). 기능 하나 추가 시 3회 작업 + 회귀 3배.
- **아카이브 QR 출제 흐름에 내용 확인 단계 없음**: `archive/index.html`의 "AP 제출 QR" 경로는 시험 → 출력방식 → qpp → 출제 대상 선택 → 최종 확인(**명단만**) → 출제 완료 순서라, 시험 내용을 한 번도 보지 않고 출제가 끝난다.
- **믹서 핸드오프 휘발성**: localStorage 기반이라 "어제 만든 믹서 시험지 재출력"이 불가능하고 링크 공유도 안 된다.

### 1.3 활용 가능한 기존 자산 (확인됨)

- 시험 데이터 문항마다 단원 메타 보유: `id`, `level`, `standardUnit`, `standardUnitKey`, `standardUnitOrder`, `standardCourse`, `category`, `questionType`, `tags`.
- `archive/db.js` 시험 메타에 시험범위 보유: `rangeStartUnitKey`~`rangeEndUnitKey`, `courseRanges` — "범위 밖 문항" 자동 판별 가능.
- 블루프린트 등록이 이미 `question_no`(출력 순번)와 `source_question_no`(원본 id)를 분리 저장 — 문항 제외·재번호 시 스키마 변경 불필요.
- `engine.html`에 `fit=screen` 축소 렌더 존재, 등록 API는 `submitQr`/`class` 없으면 no-op — 부작용 없는 미리보기 임베드가 지금도 가능.
- 오답엔진의 `preview=1` 모드: 툴바 축소, `AP_CLINIC_PREVIEW` postMessage 수신, `AP_CLINIC_HEADER_EDIT` 역방향 동기화, 편집 중 재렌더 보류(포커스 보존) — 표준화할 원형.

## 2. 최종 목표

세 엔진을 **하나의 렌더 코어 + 소스별 어댑터** 구조로 수렴하고, UI는 "작업대(Workbench)" 패턴으로 통일한다.

```
┌────────────────────────────────────────────────────────┐
│ 툴바: [시험지|해설지|정답표] [문항/쪽 2·4·6·8] [셔플]     │
│       [QR출력 ▾] [인쇄/PDF] [출제하기 →]                 │
├──────────────────┬─────────────────────────────────────┤
│ 소스 패널(교체식) │  라이브 미리보기 (print-core iframe)  │
│ · 아카이브: 시험  │  · 설정 변경 시 postMessage 즉시 갱신  │
│   정보+문항 목록  │  · 제목/보조문구 인라인 직접 편집       │
│ · 믹서: 카트+필터 │  · 실제 인쇄물과 동일한 페이지네이션    │
│ · 클리닉: 학생/   │                                     │
│   시험 선택       │                                     │
├──────────────────┴─────────────────────────────────────┤
│ [출제하기] → 대상 선택(학년→반→학생) → 최종확인(명단+시험지) │
└────────────────────────────────────────────────────────┘
```

각 엔진에서 가져와 표준화하는 것:

- **오답엔진**: `preview=1` + postMessage 채널, 인라인 헤더 편집, 서버 저장 payload(짧은 키·재출력).
- **믹서엔진**: qpp 라이브 변경(2/4/6/8), 셔플. qpp가 엔진 안에서 바뀌면 `archive/index.html`의 `qppModal` 단계 삭제 가능.
- **엔진**: URL 무상태 로딩, OS 블루프린트/출제이력 등록, `fit=screen`.

통합 데이터 계약: `{ source: 'archive'|'mixer'|'clinic', items[], meta, headerOptions, qpp, qrOptions }`. 로딩 우선순위는 서버 키 > URL > storage > postMessage(미리보기).

통합 후 문항 편집 기능(아카이브 소스 패널):

- 단원별 문항수·난이도 분포 요약 + 단원 단위 on/off
- 문항 목록에서 id별 제외/복원, 체크 변경 시 미리보기 즉시 재렌더
- `db.js` 시험범위 메타 기준 "범위 밖 문항" 자동 표시 + 일괄 제외
- 제외 상태는 URL 파라미터(`exclude=5,12,17`)로 표현 — 무상태·공유·재출력 유지

## 3. 절대 금지/보류

- **기존 QR URL 하위호환 절대 유지**: 이미 인쇄되어 나간 시험지의 QR이 `wrong_print_engine.html?packet=...`, `engine.html?data=...` 등을 가리킨다. 세 파일의 URL·파라미터는 영구히 동작해야 하며, 통합은 내부 구현 교체로만 한다. 최종 수렴 시에도 기존 파일은 shim으로 유지.
- **인쇄물 페이지네이션 회귀 금지**: 코어 추출 전후 출력물이 페이지 단위로 동일해야 한다(리포트 PDF와 동일하게 page-break 검수 최우선). 믹서엔진은 "Rulebook v1.9" 자체 수정분이 있어 별도 비교 필수.
- 믹서의 3패널 자유 구성 UI(mixer.html) 자체 개편은 이번 범위에서 **보류** — 카트 소스 패널로의 이식은 최종 수렴(Phase 6) 시점에 판단.
- Phase 4(워커 API) 전까지 서버/스키마 변경 금지. 프론트 커밋만으로 워커 API는 반영되지 않음(별도 배포 토폴로지) 유의.

## 4. Phase 구조

### Phase 0 — 아카이브 출제 전 미리보기 (선행 퀵윈, 코어 통합과 독립) ✅ 완료 (2026-07-02)

QR 출제 경로에서 시험 내용을 확인하고 출제하도록 한다. 기존 `fit=screen`과 등록 API 가드를 그대로 활용.

1. `engine.html`에 `preview=1` 모드 추가: 상단 툴바 숨김, `fit=screen` 강제, 등록 함수 2종 방어적 스킵, QR 삽입 생략.
2. `renderAssignTargetSelectView` 헤더에 "시험지 미리보기" 버튼 → 우측 슬라이드 iframe(좁은 화면은 오버레이/접이식). iframe은 첫 클릭 시 lazy load.
3. `renderAssignTargetReviewView`(최종 확인)를 좌측 명단 / 우측 시험지 미리보기 2단으로 — "이 명단에게 이 시험지가 출제됩니다"를 한 화면에서 확정. Phase 2 완료 후 표준 채널로 자연 흡수.

**구현 노트 (계획과 다른 점/추가된 것):**

- 제출/해설 QR 차단은 `shouldRenderSubmitQr()`/`shouldRenderSolutionQr()`에 `isPreviewMode()` 가드 한 곳으로 처리 — 등록 함수 2종은 `shouldRenderSubmitQr()`을 게이트로 쓰므로 자동으로 함께 차단된다.
- preview 모드에서 모드 탭(시험지/해설지/정답표)은 남겨서 출제 전 해설·정답까지 확인 가능.
- 미리보기 iframe은 `#assignTargetBody`가 조작마다 innerHTML 재렌더되는 구조라 **모달 박스의 형제 요소**(`#assignTargetPreviewPane`)로 두었고, 같은 시험이면 src를 유지해 뷰 전환/체크 조작에도 리로드되지 않음(검증됨).
- 미리보기 열림 시 모달 폭 920→1400px 확장, ≤1024px에서는 세로 스택(44vh) 폴백.
- 출제 진행(progress) 화면 진입 시 미리보기는 자동으로 닫힌다.
- 로컬 프리뷰 한정 이슈: `npx serve`의 cleanUrls가 `engine.html?query` 리다이렉트 시 쿼리를 유실 → 루트에 `serve.json`(`cleanUrls: false`) 추가로 해결(운영 Pages는 영향 없음).
- 검증 완료: preview 무부작용(등록 API 미호출), 일반 모드 회귀 없음(submitQr QR 삽입 정상), 재렌더 iframe 생존, review 2단, 모바일 폴백, 콘솔 에러 없음.

### Phase 1 — print-core.js 추출 (전제 작업) ✅ 완료 (2026-07-02)

- 페이지네이션·staging 측정·`printHeaderOptions`·QR 패치·모드 탭·screen-fit을 공용 모듈(`archive/js/print-core.js` 등 단일 파일)로 추출.
- 세 엔진이 코어를 소비하도록 교체. **UX 변경 동결** — 출력물 무변화가 검증 기준.
- 드리프트 정리: `showDate` 등 옵션 차이를 코어 옵션으로 승격.

**구현 노트 (계획과 다른 점/판단 기록):**

- 코어 구조와 API는 `docs/implemented/PRINT_CORE_MODULE_MAP.md`에 정리. `window.PrintCore` 단일 전역, 빌드 없음. 중복 코드 약 1,540줄 삭제(엔진 3종), 코어 690줄 신설.
- 시험지 페이지네이션은 `renderMeasuredExamPages` 하나로 통합하되 `makePage(pageNumber)` / `onBeforePageMeasure`(오답 homework) / `onPageRendered`(오답 그룹별 QR) 훅으로 엔진 차이를 흡수. 해설 컬럼 플로우는 `createSolutionFlow`(+`prepareColumn` 훅), 정답표는 `renderAnswerPages`.
- **믹서 "Rulebook v1.9" 자체 수정분 판단 — 흡수하지 않고 엔진 잔류로 확정**: 믹서만의 diff(측정 페이지 헤더 포함 `pNum===0||1` 조건, `extractChoice`의 `.answer` 키 부재, `protectRenderSegments`의 구식 보호 순서, PDF 모드, [성역] wrapLatex)는 전부 코어 추출 범위 밖 레이어(콘텐츠 파이프라인·makePage 훅)에 있어 코어에 넣을 필요가 없었다. 콘텐츠 정규화 파이프라인 전체는 Phase 1 범위에서 의도적으로 제외(1.2절 목록 그대로) — 오답엔진의 `normalizeViewBlocks` 마커 정규식도 엔진마다 달라 통일 시 출력이 변한다.
- 이미지 자동 사이즈 비율표가 아카이브(2.2/1.4/0.7/0.4)와 오답엔진(2.2/1.25/0.8)이 서로 달라, 코어 `createImageSizer`에 비율 함수·인라인 이미지 대기 여부를 주입하는 방식으로 각자 유지(출력 보존).
- `showDate`는 코어 `normalizePrintHeaderOptions`로 승격(엔진/믹서는 렌더에서 안 읽으므로 무해). screen-fit `updateScreenFitScale(maxScale)`에 상한 파라미터를 둠 — Phase 2 preview 축소(0.72)용.
- 엔진/믹서 `renderSol`에 있던 도달 불가 사(死)코드(이른 `return` 뒤 구현) 제거 — 출력 무영향.
- MathJax typeset은 코어에서 try/catch로 통일(오답엔진 방식) — 실패 시에도 렌더 계속. 정상 경로 무변화.
- 검증: 로컬 프리뷰로 전/후 페이지 시그니처 완전 일치 확인 — 엔진(qpp4/qpp6/해설 분할/정답표/QR 2종), 믹서(qpp2/qpp8/고정시드 셔플/해설), 오답(exam/review, `wp=` 하위호환). 상세는 implemented 문서 4절. `packet=`/`set=`/`data=`/`key=` 로딩 코드는 미변경.
- OS 등록 API·세션 복원 블록은 엔진/믹서에 아직 중복 — 렌더링 코어가 아니라 Phase 1 범위 밖. 이후 Phase에서 공용화 후보.

### Phase 2 — 미리보기 채널 표준화

- 오답엔진의 `preview=1` + postMessage(payload 수신/헤더 편집 역방향) + 인라인 헤더 편집 + 포커스 보존 재렌더 보류를 코어로 이동.
- 메시지 타입을 `AP_CLINIC_*`에서 공용 이름(`AP_PRINT_PREVIEW`/`AP_PRINT_HEADER_EDIT`)으로 일반화, 기존 타입은 별칭 수신 유지.
- engine.html/mixed_engine.html도 임베드 미리보기 가능해짐.

### Phase 3 — 툴바 통일

- qpp 라이브 셀렉트(2/4/6/8), 셔플(믹서 소스 전용 노출), QR 팝오버, 헤더 편집을 코어 툴바 단일 구현으로.
- `archive/index.html`의 `qppModal` 단계 제거(출제 흐름 1단계 단축).

### Phase 4 — 데이터 계약 통일 + 믹서 서버 저장화 (유일한 워커 변경 Phase)

- 통합 payload 스키마 확정. 로딩 우선순위: 서버 키 > URL > storage > postMessage.
- 믹서 localStorage 핸드오프를 오답 클리닉 packet API 패턴의 서버 저장으로 교체(공유·재출력 가능). 워커 라우트 추가/일반화.

### Phase 5 — 아카이브 문항 편집 소스 패널 (단원별 문항수 / id별 제외 / 범위 밖 제외)

- 좌측 소스 패널: 단원 요약(문항수 + 난이도 분포, 단원 on/off) + 문항 목록(개별 제외/복원). 변경 시 postMessage 재렌더.
- `db.js` `courseRanges` 기준 "범위 밖" 배지 + 일괄 제외 버튼.
- 제외 상태는 `exclude=` URL 파라미터. **번호는 재번호 + 원본 id 추적**(`question_no` / `source_question_no` 분리 저장 활용).
- **출제 정합성**: 블루프린트/출제이력 등록, `q` 파라미터(문항 수), 채점 기준이 전부 "제외 반영 후" 기준으로 흘러가야 함. 어긋나면 OMR/제출 채점 문항 수 불일치 — 이 Phase의 최대 리스크.

### Phase 6 — 단일 print_engine.html 수렴 (장기)

- 단일 엔진 + 소스 어댑터. 기존 세 파일은 리다이렉트 shim.
- 믹서 카트 패널 이식 여부 판단.

## 5. 수정 가능 파일

| Phase | 파일 |
|---|---|
| 0 | `archive/engine.html`, `archive/index.html` |
| 1~3 | `archive/engine.html`, `archive/mixed_engine.html`, `apmath/wrong_print_engine.html`, `apmath/js/clinic-print.js`, `archive/index.html`, 신규 공용 코어 JS/CSS |
| 4 | 위 + `archive/mixer.html`, `apmath/worker-backup/worker/routes/*`(믹서 payload 저장 라우트) |
| 5 | `archive/engine.html`(소스 패널), `archive/index.html`, 코어 JS |

오답엔진은 `apmath/`, 나머지는 `archive/`에 있으나 같은 Pages 오리진이므로 공용 JS 공유 가능.

## 6. 제외 범위

- 믹서 3패널 UI(mixer.html) 자체 개편, 자동출제(autogen) 로직 변경
- OMR/채점 로직 변경(Phase 5는 등록되는 문항 수·번호 정합성만 보장)
- 시험 데이터 파일 포맷 변경, `db.js` 생성 파이프라인 변경
- 클리닉 오답 추출 로직(clinic-print.js의 payload 구성) 변경 — 미리보기 채널 코어화 시 소비부만 교체

## 7. 검증 기준

- **출력물 회귀(모든 Phase 공통, 최우선)**: 대표 시험 파일(4qpp/6qpp, wide 문항, 이미지 포함), 믹서 카트(2/8qpp, 셔플), 클리닉 packet을 코어 교체 전후 인쇄 미리보기로 페이지 단위 비교. 섹션/문항이 페이지 경계에서 쪼개지지 않아야 함.
- **미리보기 무부작용**: `preview=1`에서 블루프린트/출제이력 등록 API 호출이 발생하지 않음(네트워크 탭 확인).
- **기존 QR 하위호환**: 기존 형식 URL(`packet=`, `set=`, `wp=`, `data=`, `key=`) 전부 정상 렌더.
- **출제 흐름**: 일반 출력 경로 무변화 → QR 경로 미리보기 열기/닫기 → 최종 확인 2단 → 출제 후 학생 포털 노출 확인.
- **Phase 5 정합성**: 문항 제외 후 출제 시 블루프린트 문항 수·번호, `q` 파라미터, 정답표가 모두 제외 반영 후 기준으로 일치.
- 모바일 폭(likely <900px)에서 미리보기 접이식/오버레이 폴백 동작.
- 로컬 검증은 `.claude/launch.json` 프리뷰 서버 사용.

## 8. 문서 업데이트 기준

- Phase 완료 시 본 문서의 해당 Phase에 완료 표시 및 실제 구현과 다른 점 기록.
- Phase 1 완료 시 코어 모듈 구조를 `implemented/` 문서로 남김.
- Phase 4 완료 시 워커 라우트 추가분을 도메인 문서에 반영.
- 출제 대상 선택 흐름과 겹치는 변경은 `ARCHIVE_EXAM_TARGET_SELECTION_NEXT_PLAN.md`와 상호 참조 유지.
