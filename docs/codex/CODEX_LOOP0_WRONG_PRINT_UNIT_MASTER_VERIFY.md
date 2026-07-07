# CODEX LOOP 0 — 오답 출력 센터 마스터 단원 연결 검증

> 범위: **검증 전용**. 코드/CSS/DB/API 수정 없음. UI 미구현.
> 목적: JS아카이브 표준단원키 / `concept_map.js`를 APMS 오답 출력 센터에서 **재사용 가능한지** 확인.
> 작성일: 2026-06-26

---

## 0. 결론 요약 (TL;DR)

| 질문 | 결론 |
|------|------|
| 기존 마스터 단원 데이터를 재사용 가능한가 | **가능**. 단, 역할 분리가 필요하다(아래 1줄 요약). |
| 무엇을 기준으로 할 것인가 | **단원 식별/표시명/과목**은 이미 `exam_blueprints`(→ `wrongItem.unitKey/unit/course`)에 들어있음. **개념묶음 라벨/그룹**은 `concept_map.js` 재사용. **표시 순서(order)**만 별도 보강 필요. |
| 새 `standard_units` 테이블이 필요한가 | **이번 라운드 불필요.** |
| 드래그 UI 구현 전 최소 adapter | 단원키 → `{표시명, 과목, 정렬순서}` 맵 1개. `concept_map.js` 로더는 이미 존재(재사용). |
| Loop 1(카드 UI 개편)로 바로 가도 되는가 | **가능.** 카드 UI 개편은 단원 마스터에 의존하지 않음. 단원 마스터는 Loop 3에서만 필수. |

**한 줄 요약:** `concept_map.js`는 “단원명/순서 마스터”가 **아니라** “단원키 → 개념묶음(cluster) + 묶음 한글라벨” 맵이다. 단원명·과목은 이미 `exam_blueprints`에 저장되어 오답 item으로 흘러들어오므로, 이번 작업의 단원 기준은 **`wrongItem.unitKey`(=`standard_unit_key`)** 를 1차 키로 쓰고, `concept_map.js`는 개념묶음 분류/라벨 용도로 보조 재사용한다.

---

## 1. `archive/concept_map.js` 실제 데이터 구조

파일: [concept_map.js](archive/concept_map.js) (`v0.1 정정본`, 124줄)

전역 노출 객체/함수:

```text
window.CONCEPT_MAP            // standardUnitKey → conceptClusterKey  (41개 키)
window.CONCEPT_CLUSTER_LABEL  // conceptClusterKey → 한글 라벨        (25개)
window.getConceptClusterKey(unitKey)   → clusterKey | "__UNMAPPED__"
window.getConceptClusterLabel(unitKey) → 한글 라벨 | clusterKey
window.getConceptCluster(unitKey)      → { unitKey, conceptClusterKey, label, mapped:boolean }
```

예시:

```js
"H22-C-06": "ALG-EQ-HIGHER",   // 여러 가지 방정식과 부등식
"M3-04":    "FUNC-QUADRATIC",  // 이차함수와 그래프
"ALG-EQ-HIGHER": "고차방정식·부등식",
"FUNC-QUADRATIC": "이차함수",
```

### 핵심 관찰

- `concept_map.js`는 **단원키 → 개념묶음 키** 매핑이다. 같은 묶음(cluster)으로 여러 단원키가 **다대일**로 모인다(예: `H15-SA-05`, `H15-SA-06`, `H22-C-05` → 모두 `ALG-QUADRATIC-EQ`).
- 미매핑 키는 `"__UNMAPPED__"`를 반환 → **미분류 검출 장치가 이미 내장**되어 있음.

---

## 2. 표준단원키 / 단원명 / 과목 / 순서 필드 존재 여부

| 필드 | `concept_map.js` | `exam_blueprints` (DB→wrongItem) | 마스터 문서(.md) |
|------|:---:|:---:|:---:|
| 표준단원키 (`standard_unit_key`/`unitKey`) | ✅ (맵 key) | ✅ | ✅ |
| 단원명 (`standard_unit`/`unit`) | ❌ (없음) | ✅ | ✅ |
| 과목 (`standard_course`/`course`) | ❌ (없음) | ✅ | ✅(standardCourse 표) |
| 개념묶음 (`concept_cluster_key`/`cluster`) | ✅ (맵 value) | ✅ | ✅(확장 태그) |
| 정렬 순서 (`order`/`standardUnitOrder`) | ❌ (없음) | ❌ (컬럼 없음) | ✅ (Order 열) |

> **중요:** `concept_map.js`에는 **단원명·과목·순서가 없다.** 단원명/과목은 `exam_blueprints`(스키마: `standard_unit`, `standard_course`)에 이미 저장되어 오답 item으로 들어온다. **순서(order)** 만 어디에도 런타임 데이터로 없고, 오직 마스터 문서 [JS아카이브_표준단원키_마스터테이블.md](docs/rules/JS아카이브_표준단원키_마스터테이블.md)의 표에만 존재한다.

`exam_blueprints` 스키마 근거 — [stage6a_exam_blueprints.sql](apmath/worker-backup/worker/migrations/stage6a_exam_blueprints.sql):

```sql
CREATE TABLE IF NOT EXISTS exam_blueprints (
  archive_file TEXT NOT NULL,
  question_no INTEGER NOT NULL,
  ...
  standard_unit_key TEXT,
  standard_unit TEXT,
  standard_course TEXT,
  concept_cluster_key TEXT,
  ...
);
```

---

## 3. `exam_blueprints.standard_unit_key` ↔ `concept_map.js` 매칭 가능성

**가능.** 두 곳 모두 동일한 표준단원키 체계(`M3-04`, `H22-C-06`, `H15-SA-07` …)를 사용한다.
`concept_map.js` 헤더 주석: *“커버: db.js 실제 등장 키 41개 전체”* — 즉 `concept_map.js`는 db.js 등장 키만 커버하는 **부분 집합**이다.

### 커버리지 리스크 (단원별 오답 마스터 목록 생성 시 반드시 고려)

`concept_map.js`는 41키만 담는다. 마스터 문서의 다음 단원들은 **`concept_map.js`에 없음** → `getConceptClusterKey` 호출 시 `"__UNMAPPED__"`:

```text
H22-C2-02 직선의 방정식 / H22-C2-03 원의 방정식 / H22-C2-04 도형의 이동
H22-A-06~08 (수열 전체) / H22-M1·M2 (미적분 전체) / H22-GE (기하 전체)
M1-05~08, M2-04~05, M2-07~08, M3-05~07 등 중등 다수
```

> **따라서 단원별 오답 “마스터 단원 목록”을 `concept_map.js`만으로 만들면 안 된다.**
> 목록 생성 기준은 (a) 마스터 문서의 unitKey 전체 또는 (b) `exam_blueprints`에 실제 등장한 unitKey(3순위 fallback)를 써야 하고, `concept_map.js`는 묶음 라벨링 보조로 쓴다.

---

## 4. `clinic-print.js`의 `wrongItem.unitKey` ↔ `concept_map.js` 매칭 가능성

**가능.** `wrongItem.unitKey`는 `exam_blueprints.standard_unit_key`를 그대로 복사한 값이다.

근거 — [clinic-print.js:345-357](apmath/js/clinic-print.js) (학생/학년 동일 패턴, 429줄):

```js
const bp = clinicPrintFindBlueprint(session, questionNo);
return {
    examKey, examTitle, examDate, archiveFile, questionNo,
    unitKey: bp?.standard_unit_key || '',
    unit:    bp?.standard_unit     || '',
    course:  bp?.standard_course   || '',
    cluster: bp?.concept_cluster_key || ''
};
```

→ `wrongItem.unitKey`를 `getConceptCluster(unitKey)`에 그대로 넣으면 묶음 키/라벨/매핑여부를 얻을 수 있다. 변환 어댑터 불필요.

---

## 5. 현재 `wrongItem`에 unitKey/unit/course/cluster가 들어가는 흐름

```text
exam_blueprints (DB row)
   │  standard_unit_key / standard_unit / standard_course / concept_cluster_key
   ▼
clinicPrintFindBlueprint(session, questionNo)          [clinic-print.js]
   ▼
clinicPrintBuildStudentWrongItems / ...GradeWrongSource → wrongItem
   │  {unitKey, unit, course, cluster}
   ▼
clinicPrintBuildClassWrongItems(...)                   [clinic-print.js:469-]
   │  itemKey = `${archiveFile}|${questionNo}` 로 dedupe
   │  wrongCount 집계, totalCount=cohort, correctRate 계산(513줄)
   │  → unitKey/unit/course/cluster 보존
   ▼
payload.students / payload.classWrongItems / payload.gradeWrongItems
   ▼
wrong_print_engine.html (렌더)
```

### 최다빈출/최다오답이 “이미 계산 가능”하다는 사실

[clinic-print.js:509-518](apmath/js/clinic-print.js)에서 **item별 `correctRate`(정답률)와 `wrongCount`가 이미 산출**된다:

```js
correctRate: total ? Math.round(((total - wrongCount) / total) * 100) : null
```

→ **최다빈출** = `correctRate >= 50` 필터 + `wrongCount desc`, **최다오답** = `correctRate < 50` 필터 + `wrongCount desc`. 둘 다 **신규 마스터 없이** 기존 집계 결과만 필터/정렬하면 된다. (현재는 correctRate 내림차순으로 이미 정렬됨 → 50% 경계 분기만 추가하면 됨.)

---

## 6. 단원별 오답 UI에서 마스터 단원 목록을 생성할 최소 경로

권장 우선순위(계획서 §3 데이터 기준과 일치):

```text
1순위(목록 골격) : 마스터 문서의 unitKey + 단원명 + order 표
2순위(라벨/묶음)  : concept_map.js (CONCEPT_CLUSTER_LABEL, getConceptCluster)
3순위(fallback)  : exam_blueprints에 실제 등장한 unitKey 집계 (해당 반/학년 데이터 한정)
```

**현실적 최소 경로(1차):** 실제로 오답이 존재하는 단원만 보여주면 충분하므로 —
`payload`(또는 build 단계)의 wrongItem들을 `unitKey`로 group → 각 그룹의 표시명은 `wrongItem.unit`(blueprints 단원명) 사용 → 정렬은 **단원키→order 맵(adapter)** 으로 부여. 이렇게 하면 마스터 문서를 전부 JSON화하지 않고도 “등장한 단원”만 정확한 순서로 나열 가능.

---

## 7. `concept_map.js`를 화면에서 직접 로드 vs 별도 JSON/API adapter

**별도 빌드/ API 불필요. 로더가 이미 존재한다.**

근거 — [core.js:1642-1653](apmath/js/core.js):

```js
async function loadConceptMapForRecommend() {
    if (state.ui.conceptMapCache) return state.ui.conceptMapCache;
    const text = await fetchArchiveScriptText('concept_map.js');
    const map = new Function('window', `${text}\n;return window.CONCEPT_MAP || {};`)(sandbox);
    state.ui.conceptMapCache = map || {};
    ...
}
```

- `apmath/index.html`은 `js/clinic-print.js`를 이미 `<script defer>`로 로드([index.html:1002](apmath/index.html))하지만 `concept_map.js`는 `<script>` 직접 포함이 아니라 **`fetchArchiveScriptText` 샌드박스 평가**로 가져온다(JS아카이브 base URL 후보 순회).
- 따라서 오답 출력 센터에서도 동일 패턴(`loadConceptMapForRecommend`)을 재사용하면 된다. `CONCEPT_CLUSTER_LABEL`/`getConceptCluster`까지 필요하면 로더의 `return` 부분만 확장하거나, 같은 방식의 라벨 로더를 하나 추가한다. → **이것이 유일하게 필요한 “adapter” 수준의 작업.**

---

## 8. 마스터에 없는 unitKey → “기타 / 단원 미분류” 처리 방법

- `wrongItem.unitKey`가 **빈 문자열**(blueprint 매칭 실패/미태깅) → `"기타 / 단원 미분류"` 버킷.
- `unitKey`는 있으나 order 맵/마스터에 **없는 키** → 동일하게 미분류 버킷 끝으로(order 999).
- `getConceptClusterKey(unitKey) === "__UNMAPPED__"` → 묶음 라벨도 “미분류”로 표기.

> **FAIL 방지(계획서 §5):** 미분류 문항을 **버리지 말고 반드시 버킷으로 수집**. 단원 group이 비더라도 “기타 / 단원 미분류” 섹션은 출력에 포함.

---

## 9. 단원 드래그 UI 구현 시 필요한 데이터 형태

```js
// 마스터 단원 목록 (선택 후보)
[{ unitKey, label, course, order, wrongCount }]   // wrongCount=해당 범위 오답 수(0 가능)

// 출력할 단원 목록 (선택됨, 순서변경 대상)
selectedUnitKeys: string[]   // 사용자가 옮긴 단원키
unitOrder:        string[]   // 드래그 후 최종 순서 (= 출력 섹션 순서)
```

→ 계획서 §6 payload 설계(`selectedUnitKeys`, `unitOrder`)와 그대로 호환. label/order는 §6~7의 adapter 맵에서, wrongCount는 기존 `clinicPrintBuildClassWrongItems` 집계에서 얻는다.

---

## 10. 회귀 위험 파일 / 함수

### 수정 대상(이번 작업 범위)
| 파일 | 위험 함수/영역 |
|------|----------------|
| [clinic-print.js](apmath/js/clinic-print.js) | `clinicPrintBuildPayload`(528-), `clinicPrintBuildClassWrongItems`(469-), 모달 UI(`showModal('오답 클리닉 출력 센터'...)` 800-), 모드 radio(student/class/grade) |
| [wrong_print_engine.html](apmath/wrong_print_engine.html) | `parsePayload`/QR compact(`m`: student/class/grade, 252-269), 섹션 렌더, `loadAllQuestionBanks`(819-) |

### 회귀 보호 포인트 (깨지면 FAIL)
```text
payload.mode 'student'|'class'|'grade' 및 students/classWrongItems/gradeWrongItems 구조 유지
QR compact m=student/class/grade 호환 유지 (신규 type 모드는 별도 분기로 추가)
clinicPrintFindBlueprint / wrongItem {unitKey,unit,course,cluster} 시그니처 유지
```

### 절대 건드리지 않음(계획서 §2)
```text
archive/engine.html, archive/mixed_engine.html 핵심 렌더 알고리즘
wrapLatex / autoCompress / fitQuestionBox / renderSol / renderAns
```

> 학년별 오답은 `teacher_name` 담임 필터 없이 같은 grade의 active class 전체를 모으는 구조이며, 실제 노출 범위는 로그인 역할의 `state.db.classes/exam_sessions`에 종속된다 → **권한 밖 학년/반 노출 여부는 Loop 6 회귀에서 검수**(계획서 §1.학년 카드 주석과 일치).

---

## 11. Loop 0 필수 결론 (지시문 요구 항목)

1. **기존 마스터 단원 데이터를 재사용 가능한가** → **예.** 단, `concept_map.js` = 개념묶음/라벨, `exam_blueprints`(→wrongItem) = 단원키/단원명/과목으로 **역할을 나눠** 재사용.
2. **재사용 시 기준 파일/필드**
   - 단원 1차 키: `wrongItem.unitKey` (= `exam_blueprints.standard_unit_key`)
   - 단원 표시명/과목: `wrongItem.unit` / `wrongItem.course` (= `standard_unit` / `standard_course`)
   - 개념묶음/라벨: `archive/concept_map.js`의 `CONCEPT_MAP` + `CONCEPT_CLUSTER_LABEL` (`getConceptCluster`)
   - 정렬 순서: 마스터 문서 [JS아카이브_표준단원키_마스터테이블.md](docs/rules/JS아카이브_표준단원키_마스터테이블.md)의 Order 표 → **단원키→order 정적 맵 1개**로 보강
3. **새 `standard_units` 테이블 필요 여부** → **이번 라운드 불필요.** 단원명/과목/묶음이 이미 `exam_blueprints`에 저장되고 로더가 존재. (장기 저장형 오답 세트 단계에서 DB snapshot 별도 검토)
4. **드래그 UI 전 필요한 최소 adapter** →
   - (재사용) `concept_map.js` 로더: `core.js`의 `loadConceptMapForRecommend` 패턴 그대로.
   - (신규, 소규모) **단원키 → `{label, course, order}` 맵** 1개. 1차는 “등장한 unitKey + blueprints 단원명 + order 맵” 조합으로 충분, 마스터 전체 JSON화는 선택.
5. **Loop 1(카드 UI 개편)로 바로 진입 가능한가** → **예.** 카드 UI(학생/반/학년/유형)는 단원 마스터에 의존하지 않음. 단원 마스터/adapter는 **Loop 3(단원별 드래그)** 에서만 필수.

---

## 12. 다음 Loop 권고 순서

```text
Loop 1  상위 카드 UI(학생/반/학년/유형) 개편 — 기존 mode 로직 유지, 데이터 의존 없음 → 바로 진행 가능
Loop 2  유형 카드 내부(최다빈출/최다오답/단원별) — correctRate≥50 / <50 분기는 기존 집계 재사용
Loop 3  단원별 드래그 — §6~7의 단원키→{label,course,order} adapter가 선행 필요
Loop 4  payload 확장 — mode/typeMode/scope/rateRule/selectedUnitKeys/unitOrder 추가(기존 키 보존)
Loop 5  UI/UX 검수
Loop 6  회귀 검수 — 학생/반/학년 출력·QR·권한 범위·미분류 누락 0 확인
```

---

### 검증 한계 (정직 고지)
- 본 보고서는 **정적 코드/스키마 분석** 결과다. 런타임 실데이터(`exam_blueprints`에 실제로 `standard_unit_key`가 채워진 비율, 미태깅 문항 비율)는 확인하지 못했다 → **미분류 버킷 실제 발생량은 Loop 5/6에서 실데이터로 검수** 필요.
- `concept_map.js`는 41키 부분 커버이므로, 단원별 오답 목록을 `concept_map.js`만으로 만들면 다수 단원이 누락된다(§3). 목록 골격은 blueprints 등장 unitKey 또는 마스터 문서 기준으로 만들 것.
