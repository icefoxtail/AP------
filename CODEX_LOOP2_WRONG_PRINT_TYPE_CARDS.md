# CODEX LOOP 2 — 유형 카드 내부 구현

> 범위: 유형 패널 내부에 작은 카드 3종(최다빈출/최다오답/단원별 오답)과 범위(scope) 토글을 구현하고, **정답률 50% 분기**로 실제 집계 결과를 미리보기로 표시.
> 원칙: 신규 마스터/ DB 없음. 기존 집계 함수 재사용. 실제 출력(payload·엔진) 연결은 Loop 4, 단원 드래그는 Loop 3.
> 작성일: 2026-06-26
> 대상 파일: [apmath/js/clinic-print.js](apmath/js/clinic-print.js) (단일 파일, 누적 +235/-10 vs main)

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| 범위 토글(현재 반 / 같은 학년 전체) | ✅ |
| 유형 서브카드 3종 선택형 | ✅ 최다빈출 / 최다오답 / 단원별 오답 |
| 최다빈출 = 정답률 **50% 이상**, 오답수 내림차순 | ✅ |
| 최다오답 = 정답률 **50% 미만**, 오답수 내림차순 | ✅ |
| 단원별 = 단원 그룹 미리보기 + 미분류 버킷 | ✅ (드래그/출력은 다음 Loop) |
| 신규 마스터/DB | ❌ 없음 (기존 집계 재사용) |
| 기존 student/class/grade 로직·payload | ✅ 무수정 |
| `node --check` | ✅ PASS |

---

## 2. UI 구조 (유형 패널)

```text
범위
[ 현재 반 ] [ 같은 학년 전체 ]          ← scope: class / grade

유형 선택
[ 최다빈출 ] [ 최다오답 ] [ 단원별 오답 ]   ← typeMode: frequent / mostWrong / unit

결과 미리보기 (#clinic-print-type-result)
- frequent/mostWrong: 정답률·오답수 정렬 목록(상위 12 + "외 N문항")
- unit: 단원별 문항 수 목록(+ 기타/단원 미분류)
```

- 선택 상태는 숨김 input(`#clinic-print-type-scope`, `#clinic-print-type-mode`)에 보관 → 시험 선택을 바꿔도 유형/범위 선택이 유지됨.
- 기본값: 범위=현재 반, 유형=최다빈출.

---

## 3. 데이터 흐름 (신규 마스터 없음)

Loop 0 결론대로 **기존 집계를 그대로 재사용**한다.

```text
clinicPrintGetScopeWrongItems(classId, examKeys, scope)
  ├ scope='class' → BuildStudentWrongItems(반 전체 학생) → BuildExamCohortCounts → BuildClassWrongItems
  └ scope='grade' → BuildGradeWrongSource → BuildClassWrongItems
        ↓ (각 item에 correctRate, wrongCount, unitKey, unit 이미 포함)
clinicPrintFilterTypeItems(items, rateRule)
  ├ rateRule='gte50' → correctRate >= 50   (최다빈출)
  └ rateRule='lt50'  → correctRate <  50   (최다오답)
  정렬: wrongCount desc → correctRate desc → questionNo asc
```

- `correctRate`/`wrongCount`는 `clinicPrintBuildClassWrongItems`(509-518)가 이미 산출 → 신규 계산 없음.
- **경계 처리:** 정답률 정확히 50% → 최다빈출(50% 이상). 계획서 §4와 일치.

---

## 4. 신규 함수 ([clinic-print.js](apmath/js/clinic-print.js))

| 함수 | 역할 |
|------|------|
| `clinicPrintGetScopeWrongItems(classId, examKeys, scope)` | 범위(반/학년)별 dedupe 공통 오답 목록 생성. 기존 build 함수 재사용. |
| `clinicPrintFilterTypeItems(items, rateRule)` | 50% 분기 필터 + 오답수 내림차순 정렬. |
| `clinicPrintSetTypeScope(classId, scope)` | 범위 토글 활성화 + 재렌더. |
| `clinicPrintSetTypeMode(classId, typeMode)` | 유형 카드 활성화 + 재렌더. |
| `clinicPrintRenderTypePanel(classId)` | 현재 범위/유형/선택 시험 기준 결과 미리보기 렌더 + 요약줄 갱신. |

`clinicPrintSwitchMode`의 type 분기는 이제 `clinicPrintRenderTypePanel(classId)`를 호출(시험 선택 변경 시에도 `clinicPrintUpdateStudentList`의 type 가드를 통해 자동 재렌더).

---

## 5. 미분류 누락 방지 (FAIL 기준 대응)

- 단원별 미리보기에서 `item.unitKey`가 없으면 **버리지 않고** `"기타 / 단원 미분류"` 버킷으로 수집.
- 최다빈출/최다오답은 정답률 기준 분기이므로 단원 유무와 무관하게 포함(단, 정답률 산출 불가 항목은 50% 분기 대상이 아니라 제외 — 실데이터에선 오답 1건이라도 제출 코호트 ≥ 1이라 거의 발생하지 않음. Loop 5/6에서 실데이터 검수).

---

## 6. 회귀 안전성

- 기존 build/payload 함수(`clinicPrintBuildPayload`, `clinicPrintBuildStudentWrongItems`, `clinicPrintBuildClassWrongItems`, `clinicPrintBuildGradeWrongSource`) **읽기만 재사용, 수정 없음**.
- `type` 모드는 아직 payload/엔진을 호출하지 않음 → 기존 학생/반/학년 출력·QR·`wrong_print_engine.html` 영향 없음.
- archive 엔진 핵심 함수 미접근.
- type 모드에서 제출 버튼 숨김 + `clinicPrintSubmit` type 가드 유지(방어적).

---

## 7. 검증

- `node --check apmath/js/clinic-print.js` → **PASS**.
- 참조 함수 존재 확인: `clinicPrintGetClassStudents`(80), `clinicPrintGetClassGrade`(96), `clinicPrintBuildExamCohortCounts`(386) 등.
- 브라우저 실렌더/콘솔/모바일 터치 검수는 계획대로 **Loop 5/6**에서 실데이터로.

---

## 8. 다음 단계 (Loop 3)

단원별 오답 → 마스터 단원 선택 + 드래그 정렬:

```text
마스터 단원 목록 생성   : Loop 0 §6 경로 (등장 unitKey + blueprints 단원명 + order adapter)
선택 단원 목록 / 순서변경 : 드래그 + 위/아래 버튼 보조
모바일 터치 대응
미분류(기타) 버킷 유지
```
