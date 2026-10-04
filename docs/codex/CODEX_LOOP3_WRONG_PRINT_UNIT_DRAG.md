# CODEX LOOP 3 — 단원별 오답 드래그 UI

> 범위: 단원별 오답에서 **마스터 단원 목록 생성 → 선택 → 출력 순서 드래그/버튼 정렬** 구현.
> 원칙: 신규 DB 없음. unitKey 기준 그룹핑. 미분류 누락 금지. 출력(payload) 연결은 Loop 4.
> 작성일: 2026-06-26
> 대상 파일: [apmath/js/clinic-print.js](apmath/js/clinic-print.js) (단일 파일, 누적 +432/-10 vs main)

---

## 1. 결과 요약

| 항목 | 상태 |
|------|------|
| 마스터 단원 목록 생성 (unitKey 기준) | ✅ |
| 단원 선택(+) / 제거(×) | ✅ |
| 출력할 단원 순서 변경 — 드래그 | ✅ Pointer Events (마우스·**터치**·펜 공통) |
| 순서 변경 — ↑/↓ 버튼 보조 | ✅ |
| 단원별 정답률 규칙 토글(최다빈출/최다오답) | ✅ |
| 미분류(기타) 버킷 | ✅ 누락 없음, 선택 가능 |
| 마스터 순서 정렬 | ✅ unitKey 접두(과목)+숫자(Order) 어댑터 |
| 신규 DB/마스터 invent | ❌ 없음 |
| `node --check` | ✅ PASS |

---

## 2. UI 구조 (단원별 선택 시, 계획서 §5)

```text
[ 현재 반 ] [ 같은 학년 전체 ]      ← 범위(상단 공유 토글)

유형
[ 최다빈출 (50%↑) ] [ 최다오답 (50%↓) ]   ← 단원별 정답률 규칙

마스터 단원
┌───────────────────────────┐
│ 이차함수            4문항   [+] │
│ 여러 가지 방정식과 부등식  3문항 [+] │
│ 기타 / 단원 미분류   2문항   [+] │
└───────────────────────────┘

출력할 단원  (드래그 또는 ↑↓로 순서 변경)
┌───────────────────────────┐
│ ≡ 1. 여러 가지 방정식과 부등식  [↑][↓][×] │
│ ≡ 2. 이차함수                 [↑][↓][×] │
└───────────────────────────┘
```

---

## 3. 마스터 단원 목록 생성 (FAIL 기준 정면 대응)

계획서 §3/§9 FAIL: *"단원 목록을 standard_unit 문자열만 모아서 만듦"* → **회피**.

구현(`clinicPrintComputeScopeUnits`):
1. 범위(반/학년)의 공통 오답 → 정답률 규칙(gte50/lt50) 필터.
2. **`unitKey` 기준으로 Map 그룹핑** (이름 문자열 Set 아님).
3. 표시명은 `item.unit`(= `exam_blueprints.standard_unit`, 마스터 표시명) 사용.
4. **순서 어댑터** `clinicPrintUnitOrder(unitKey)`:
   - unitKey 접두(과목) → `CLINIC_COURSE_RANK`(JS아카이브 마스터 과목 순서).
   - unitKey 숫자 접미 = 마스터 Order (예: `H22-C-06` → Order 6).
   - 정렬: `과목 rank → Order → 라벨`.
5. **미분류 처리:** `unitKey` 없으면 `__UNCLASSIFIED__` 버킷(`기타 / 단원 미분류`), `rank=999`로 **항상 맨 끝**. 선택 가능 단원으로 노출 → 누락 없음.

> Loop 0 §6 권장 경로(“등장 unitKey + blueprints 단원명 + order adapter”)를 그대로 구현. 새 `standard_units` 테이블/JSON 빌드 불필요.
>
> 순서 어댑터 검증(샘플): `M3-02 → M3-04 → H22-C-01 → H22-C-06 → H22-C2-01 → H15-SA-07 → (미지원 prefix 900) → (미분류 999)` — 마스터 과목/단원 순서와 일치.

---

## 4. 드래그 / 순서 변경 (모바일 대응)

`clinicPrintAttachUnitDnD` — **Pointer Events** 기반:
- `≡` 핸들 `pointerdown` → 드래그 시작(`touch-action:none`으로 터치 스크롤 충돌 방지).
- `pointermove` → 포인터 Y와 행 중앙 비교로 DOM 노드 실시간 재배치(시각 피드백).
- `pointerup` → DOM 순서를 `unitSelection` 배열로 확정 후 재렌더.
- 마우스·터치·펜 단일 코드로 동작 → **모바일 터치 드래그 가능**.

보조: 각 행 `↑`/`↓` 버튼(`clinicPrintUnitMove`) — 드래그 어려운 환경/접근성용. 양끝은 disabled.

---

## 5. 상태 관리

```js
const clinicPrintTypeState = { unitSelection: [], unitRate: 'lt50', dragKey: null };
```

- `unitSelection`: 출력할 단원키 **순서 배열**(= 출력 순서, Loop 4의 `unitOrder` 원천).
- 모달 열 때 `openClinicPrintCenter`에서 초기화 → 이전 반 선택 잔존 방지.
- 범위/규칙/시험 변경 시 재렌더하며 **현존하지 않는 선택 단원만 자동 정리**(존재하는 선택은 순서 유지).
- `#clinic-print-type-result`(root) 재렌더와 무관하게 모듈 상태로 보존.

---

## 6. 신규 함수

| 함수 | 역할 |
|------|------|
| `clinicPrintUnitOrder(unitKey)` | 과목 rank + Order 추출(순서 어댑터). |
| `clinicPrintComputeScopeUnits(classId)` | unitKey 기준 단원 목록 생성·정렬(미분류 포함). |
| `clinicPrintRenderUnitMode(classId)` | 단원별 스캐폴드(규칙 토글/마스터/출력할/안내) 렌더. |
| `clinicPrintSetUnitRate(classId, rate)` | 최다빈출/최다오답 규칙 전환. |
| `clinicPrintRenderUnitLists(classId)` | 마스터/출력할 목록 렌더 + 요약 + DnD 부착. |
| `clinicPrintUnitAdd/Remove/Move` | 선택 추가·제거·↑↓ 이동. |
| `clinicPrintAttachUnitDnD(classId)` | Pointer Events 드래그 정렬. |

---

## 7. 회귀 안전성

- 기존 build/payload/엔진 함수 **무수정**. type 모드는 아직 payload/엔진 미호출 → 기존 학생/반/학년 출력·QR 영향 없음.
- 신규 함수/상태는 모두 `clinicPrint*` 네임스페이스, 전역 오염 최소.
- archive 엔진 핵심 함수 미접근.
- 보안: 모든 동적 값 `clinicPrintEscapeHtml/Attr/JsString` 적용(onclick·data-key 안전).

---

## 8. 검증

- `node --check apmath/js/clinic-print.js` → **PASS**.
- 순서 어댑터 단위 검증(위 §3) → 마스터 과목/Order 순서 일치, 미분류 맨 끝.
- escape 헬퍼 존재·동작 확인(따옴표 → `\x27/\x22`).
- 브라우저 실렌더/터치 드래그/콘솔/모바일 깨짐은 계획대로 **Loop 5/6** 실데이터 검수.

---

## 9. 다음 단계 (Loop 4)

선택 결과를 실제 출력 payload에 연결:

```text
payload 확장: mode='type', typeMode='frequent'|'mostWrong'|'unit',
             scope='class'|'grade', rateRule='gte50'|'lt50',
             selectedUnitKeys = clinicPrintTypeState.unitSelection,
             unitOrder        = clinicPrintTypeState.unitSelection (드래그 순서)
wrong_print_engine.html: 유형별 제목 + 단원별 섹션 출력
기존 students/classWrongItems/gradeWrongItems 구조 유지
```
