# CODEX LOOP 1 — 오답 출력 카드 UI 개편

> 범위: 오답 출력 센터 상위 모드 선택 UI를 **카드형(학생/반/학년/유형)** 으로 개편.
> 원칙: 기존 학생별/반별/학년별 **로직 무수정**, mode 선택 UI만 카드화, 유형 카드는 신규 패널로 연결.
> 작성일: 2026-06-26
> 대상 파일: [apmath/js/clinic-print.js](apmath/js/clinic-print.js) (단일 파일, +87/-10)

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| 상위 카드 4종(학생/반/학년/유형) | ✅ 적용 |
| 기존 student/class/grade 로직 | ✅ 무수정 유지 |
| 유형 카드 → 신규 패널 연결 | ✅ (패널 골격 + 안내. 내부 기능은 Loop 2) |
| 기존 payload/QR 구조 | ✅ 영향 없음 (type 모드는 출력 미연결) |
| 문법 검사 `node --check` | ✅ PASS |
| 모바일 반응형 | ✅ 4→2열, 유형 서브카드 3→1열 |

---

## 2. 변경 내용

### 2.1 모드 선택: 라디오 3개 → 카드 4개

기존:

```text
[○ 학생별] [○ 반별] [○ 학년별]   (radio 3개, 3열 grid)
```

변경:

```text
[ 학생 ]  [ 반 ]  [ 학년 ]  [ 유형 ]    (카드 4개, 4열 grid)
 학생별   반별공통  학년별공통  최다빈출
 오답     오답     오답       ·단원별
```

- 각 카드는 `<label class="clinic-mode-card" data-mode="...">` 안에 **기존 라디오(`name="clinic-print-mode"`)를 숨겨서** 넣었다(`opacity:0; width:0`).
  → 기존 코드의 `document.querySelector('input[name="clinic-print-mode"]:checked').value` 셀렉터가 **그대로 동작**한다. 호환성 유지 핵심.
- 라디오 값: `student` / `class` / `grade` / **`type`(신규)**.
- 카드 클릭 시 `onchange="clinicPrintSwitchMode(classId)"` 호출.

### 2.2 신규 함수 `clinicPrintSwitchMode(classId)`

[clinic-print.js](apmath/js/clinic-print.js) — `clinicPrintUpdateStudentList` 바로 앞에 추가.

역할:
1. 선택된 카드의 활성 스타일 토글(primary 보더 + 연한 배경).
2. 모드별 패널 표시/숨김:
   - `student/class/grade` → 학생 섹션 + 제출 버튼 표시, 유형 패널 숨김 → 기존 `clinicPrintUpdateStudentList(classId)` 호출(= 기존 동작 그대로).
   - `type` → 학생 섹션 + 제출 버튼 숨김, 유형 패널 표시, 요약줄을 "유형별 오답 출력 준비 중"으로 갱신.

### 2.3 유형 패널 (`#clinic-print-type-panel`, 신규, 기본 숨김)

- 서브카드 3종 미리보기: **최다빈출 / 최다오답 / 단원별 오답** (문구는 계획서 §4와 동일, `opacity:0.6`로 비활성 표기).
- 안내: "유형별 오답 출력은 다음 단계에서 활성화됩니다."
- **실제 동작(필터·드래그·payload)은 Loop 2~4에서 구현** — Loop 경계 준수.

### 2.4 기존 함수 가드 (회귀 방지)

| 함수 | 변경 |
|------|------|
| `clinicPrintUpdateStudentList` | 최상단에 `currentMode === 'type'`이면 `clinicPrintSwitchMode` 위임 후 return. (시험 체크박스 onchange가 type 모드에서 학생 로직 실행하는 것 방지. 기존 `const mode` 재선언 충돌 없도록 `currentMode` 별도 변수 사용) |
| `clinicPrintSubmit` | `mode === 'type'`이면 안내 토스트 후 return. (제출 버튼은 type 모드에서 숨김 처리되지만 방어적 가드) |
| 모달 초기화 | `setTimeout(() => clinicPrintUpdateStudentList(classId), 0)` → `clinicPrintSwitchMode(classId)`로 교체(초기 카드 활성 상태 동기화). |

---

## 3. 기존 로직 무수정 확인 (계획서 §2 / FAIL 기준 대응)

- `clinicPrintBuildStudentWrongItems` / `clinicPrintBuildClassWrongItems` / `clinicPrintBuildGradeWrongSource` / `clinicPrintBuildPayload` — **수정 없음**.
- payload 구조(`mode`, `students`, `classWrongItems`, `gradeWrongItems`) — **변경 없음**. `type` 모드는 아직 payload를 만들지 않으므로 기존 QR/엔진 호환성에 영향 없음.
- `wrong_print_engine.html`, archive 엔진 핵심 함수(`wrapLatex`/`autoCompress`/`fitQuestionBox`/`renderSol`/`renderAns`) — **미접근**.

---

## 4. 검증

- `node --check apmath/js/clinic-print.js` → **PASS** (문법/`const` 재선언 충돌 없음).
- 정적 점검: `clinic-print-mode` 셀렉터, `clinic-print-exam`/`clinic-print-student` name, `#clinic-print-summary`/`#clinic-print-student-list` id 등 기존 참조 모두 보존.
- 미수행(다음 Loop에서): 실제 브라우저에서 모달 렌더/카드 전환/콘솔 에러/모바일 터치 — **Loop 5(UI/UX)·Loop 6(회귀)** 에서 실데이터로 검수.

---

## 5. 다음 단계 (Loop 2)

유형 패널의 서브카드를 실제 동작으로 연결:

```text
최다빈출 = correctRate >= 50 필터 + wrongCount desc   (기존 clinicPrintBuildClassWrongItems 집계 재사용)
최다오답 = correctRate <  50 필터 + wrongCount desc
단원별   = 마스터 단원 선택 패널 진입 (Loop 3 드래그로 이어짐)
범위(scope) = 현재 반 / 같은 학년 전체 토글
```

> Loop 0 보고서 §5 근거: `correctRate`/`wrongCount`는 이미 산출되어 있어 신규 마스터 없이 50% 경계 분기만 추가하면 됨.
