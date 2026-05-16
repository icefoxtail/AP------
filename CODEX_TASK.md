````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업 목적

AP Math OS 교재 화면 문구/구조를 클로드 정리안 기준으로 적용하고, 교재 카드 선택/교재 관리 기능을 보강한다.

이번 작업은 화면 문구와 교재 관리 기능만 수정한다.

## 1. 수정 대상

필수 수정:
- `apmath/js/study-material-wrong.js`

필요 시 확인만:
- `apmath/js/ui.js`
- `apmath/index.html`

## 2. 절대 금지

- git add 금지
- git commit 금지
- git push 금지
- wrangler deploy 금지
- D1 migration 금지
- 원장/관리자 대시보드 변경 금지
- 출석부/학생관리/플래너/아카이브 변경 금지
- 시험지 원문/PDF/archive 직접 열기 기능 추가 금지
- 기존 운영센터 index 구조 변경 금지

## 3. 용어 기준

클로드 정리안 전체 채택.

이번 화면에서는 `수업자료` 대신 `교재` 기준으로 정리한다.

사용 문구:
- 교재
- 교재 등록
- 교재 종류
- 교재명
- 단원 범위 설정
- 반별 교재 배정
- 오답 입력
- 오답 현황
- 교재 관리

탭:
- 자료 설정
- 오답 입력
- 오답 현황

버튼:
- 등록하기
- 새로고침
- 관리
- 목록 보기
- 배정하기
- 불러오기
- 조회
- 저장
- 취소
- 수정
- 삭제
- 닫기

금지 문구:
- 수업자료 오답
- 비활성화
- 활성화
- 사용 안 함
- 입력 열기
- 복습 출력
- 영어 UI 표현

## 4. 클로드 정리안 적용


### 1. `tabs()` — 탭 레이블

```js
const items = [['prepare', '자료 설정'], ['entry', '오답 입력'], ['view', '오답 현황']];
```

---

### 2. `injectStyle()` — CSS UX 개선 (3군데)

```css
/* smw-section-title 에 추가 */
.smw-section-title { font-size:14px; font-weight:900; color:var(--text); line-height:1.3;
  border-left:3px solid var(--primary); padding-left:9px; }

/* smw-help 교체 */
.smw-help { font-size:11px; font-weight:800; color:var(--secondary); line-height:1.45;
  background:rgba(26,92,255,.06); border-radius:8px; padding:6px 10px; }

/* smw-status-btn 에 추가 */
.smw-status-btn { min-width:40px; min-height:36px; border-radius:10px; border:1px solid var(--border);
  background:var(--surface-2); color:var(--text); font-weight:900; cursor:pointer; font-size:13px; }
```

---

### 3. `materialSection()` — 자료 등록

```js
function materialSection() {
    return `
        <div class="smw-section">
            <div class="smw-section-title">교재 등록</div>
            <div class="smw-grid">
                <div class="smw-field"><label>교재 종류</label><select id="smw-material-type">
                    <option value="textbook">교과서</option><option value="problem_book">문제기본서</option><option value="progress_book">진도교재</option><option value="test_prep">시험대비교재</option><option value="review_print">복습프린트</option><option value="clinic_print">클리닉프린트</option><option value="school_material">학교자료</option>
                </select></div>
                <div class="smw-field"><label>교재명</label><input id="smw-title" placeholder="예: 쎈 중3-1"></div>
                <div class="smw-field"><label>학년</label><input id="smw-grade" placeholder="예: 중3"></div>
                <div class="smw-field"><label>학기</label><input id="smw-semester" placeholder="예: 1학기"></div>
                <div class="smw-field"><label>시작 문항</label><input id="smw-start" type="number" inputmode="numeric"></div>
                <div class="smw-field"><label>끝 문항</label><input id="smw-end" type="number" inputmode="numeric"></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterial()">등록하기</button><button class="btn" onclick="loadStudyMaterialWrongData()">새로고침</button></div>
            <div class="smw-list">${(st().materials || []).map(m => `<button type="button" class="smw-row smw-material-card ${selectedMaterialIdFor() === String(m.id) ? 'active' : ''}" data-material-id="${h(m.id)}" onclick="selectStudyMaterialByCard(this)"><div class="smw-title">${h(m.title)}</div><div class="smw-meta">${h(materialTypeLabel(m.material_type))} · ${h(m.grade || '-')} · ${h(m.semester || '-')} · ${h(m.number_start || '')}-${h(m.number_end || '')}</div></button>`).join('') || '<div class="smw-row"><div class="smw-meta">등록된 교재가 없습니다.</div></div>'}</div>
        </div>
    `;
}
```

---

### 4. `rangeSection()` — 단원 범위 설정

```js
function rangeSection() {
    return `
        <div class="smw-section">
            <div class="smw-section-title">단원 범위 설정</div>
            <div class="smw-field"><label>교재</label><select id="smw-range-material" onchange="onStudyMaterialSelectChange(this.value)">${materialOptions(selectedMaterialIdFor())}</select></div>
            <div class="smw-field"><label>단원 범위 붙여넣기</label><textarea id="smw-range-csv" placeholder="순서,대단원,소단원,시작번호,끝번호"></textarea></div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="importStudyMaterialRanges()">등록하기</button><button class="btn" onclick="loadStudyMaterialRanges()">목록 보기</button></div>
            <div id="smw-range-list" class="smw-list"></div>
        </div>
    `;
}
```

---

### 5. `assignmentRows()` + `assignSection()` — 반별 교재 배정

```js
function assignmentRows() {
    return (st().assignments || []).map(a => `<div class="smw-row"><div class="smw-title">${h(a.assignment_title || a.material_title)}</div><div class="smw-meta">${h(a.class_name || a.class_id)} · ${h(a.material_title || a.material_id)} · ${h(a.assigned_date)}</div></div>`).join('') || '<div class="smw-row"><div class="smw-meta">배정된 교재가 없습니다.</div></div>';
}
function assignSection() {
    const f = st().entryFilters || {};
    return `
        <div class="smw-section">
            <div class="smw-section-title">반별 교재 배정</div>
            <div class="smw-grid">
                <div class="smw-field"><label>학년</label><select id="smw-assign-grade" onchange="onStudyMaterialAssignGradeChange()">${gradeOptions(f.grade)}</select></div>
                <div class="smw-field"><label>반</label><select id="smw-assign-class">${filteredClassOptions(f.grade, f.class_id, '반 선택')}</select></div>
                <div class="smw-field"><label>교재</label><select id="smw-assign-material" onchange="onStudyMaterialSelectChange(this.value)">${materialOptions(selectedMaterialIdFor(f.material_id))}</select></div>
                <div class="smw-field"><label>배정일</label><input id="smw-assign-date" type="date" value="${today()}"></div>
                <div class="smw-field"><label>배정명 <span style="font-weight:700;opacity:.6;">(비워두면 교재명)</span></label><input id="smw-assign-title" placeholder="선택 입력"></div>
            </div>
            <div class="smw-actions"><button class="btn btn-primary" onclick="createStudyMaterialAssignment()">배정하기</button><button class="btn" onclick="loadStudyMaterialAssignments()">목록 보기</button></div>
            <div class="smw-list">${assignmentRows()}</div>
        </div>
    `;
}
```

---

### 6. `entryForm()` + `renderEntryRows()` — 오답 입력

```js
// entryForm 내 smw-section-title 및 help span, label
<div class="smw-section-title">오답 입력</div>
// ...
<div class="smw-field"><label>교재</label><select id="smw-entry-material" ...>
// ...
<button class="btn btn-primary" onclick="loadStudyMaterialEntrySheet()">불러오기</button>
<span class="smw-help">미입력(−) · O 전부 맞음 · X 오답 있음</span>

// renderEntryRows 내
if (!entry) return '<div class="smw-output">학년·반·교재 선택 후 [불러오기]를 누르세요.</div>';
if (!rows.length) return '<div class="smw-output">해당 반에 학생이 없습니다.</div>';

// table header
<thead><tr><th>학생명</th><th>상태</th><th>오답 번호</th><th>번호 선택</th></tr></thead>
```

---

### 7. `renderWrongNumberPicker()` — 번호 선택 팝업

```js
// picker-title
<div class="smw-picker-title">${h(picker.studentName)} — 오답 번호 선택</div>
<div class="smw-meta">선택된 번호: ${(picker.selected || []).length ? (picker.selected || []).join(', ') : '없음'}</div>
```

---

### 8. `viewForm()` + `renderViewText()` — 오답 현황

```js
// viewForm
<div class="smw-section-title">오답 현황</div>
// ...
<div class="smw-field"><label>교재</label><select id="smw-view-material" ...>
// ...
if (!data) return '학년·반·교재 선택 후 [조회]를 누르세요.';

// renderViewText 섹션 레이블
lines.push('▸ 제출 현황');
// ...
lines.push('▸ 오답 집계');
// ...
lines.push('▸ 단원별 오답');
// ...
lines.push('▸ 학생별 오답');
// ...
lines.push('▸ 오답 목록');  // student scope
```

---

### 9. notify / confirm 메시지

```js
// createStudyMaterial
notify('교재를 등록했습니다.');

// createStudyMaterialAssignment
notify('반 배정을 완료했습니다.');

// loadStudyMaterialRanges
if (!materialId) return notify('교재를 선택하세요.', 'warn');

// loadStudyMaterialEntrySheet
if (!f.class_id) return notify('반을 선택하세요.', 'warn');
if (!f.material_id) return notify('교재를 선택하세요.', 'warn');

// saveStudyMaterialTeacherBatch
if (!rows.length) return notify('저장할 내용이 없습니다. 오답 번호를 입력하거나 O(정답)로 표시하세요.', 'warn');
if (!confirm(`총 ${rows.length}명 저장\n　· 정답: ${okCount}명\n　· 오답 입력: ${rows.length - okCount}명\n　· 미입력 제외: ${empty}명\n\n저장하시겠습니까?`)) return;
notify(`${res.saved || 0}명 저장 완료`);

// loadStudyMaterialView
if (!scope.type) return notify('학년을 선택하세요.', 'warn');

// loadStudyMaterialEntrySheet (먼저 불러오세요)
if (!entry?.assignment?.id) return notify('먼저 학생 목록을 불러오세요.', 'warn');
```

---

적용 순서 : CSS → 함수들 순서대로 교체하면 됨. Gemini한테 넘길 거면 지시서 만들어줄게.
### 4-1. tabs()

탭 레이블을 아래 기준으로 정리한다.

```js
const items = [['prepare', '자료 설정'], ['entry', '오답 입력'], ['view', '오답 현황']];
````

### 4-2. injectStyle()

클로드 정리안의 CSS UX 개선을 적용한다.

적용 대상:

* `.smw-section-title`
* `.smw-help`
* `.smw-status-btn`

목표:

* section-title 강조
* help text 시인성 강화
* O/X/미입력 상태 버튼 터치 영역 개선

### 4-3. materialSection()

문구를 아래 기준으로 정리한다.

* 섹션 제목: `교재 등록`
* label:

  * `교재 종류`
  * `교재명`
  * `학년`
  * `학기`
  * `시작 문항`
  * `끝 문항`
* 버튼:

  * `등록하기`
  * `새로고침`
  * `관리`

교재 카드:

* 카드 클릭은 교재 선택만 한다.
* 카드 안 또는 카드 바로 옆에 수정/삭제 버튼을 직접 노출하지 않는다.
* 카드 클릭 시 selectedMaterialId가 갱신되어야 한다.
* 선택된 교재는 active/selected 표시가 되어야 한다.
* 선택된 교재는 단원 범위 설정, 반별 교재 배정, 오답 입력, 오답 현황의 교재 select 값에도 동기화되어야 한다.

등록된 교재가 없을 때:

* `등록된 교재가 없습니다.`

### 4-4. rangeSection()

문구:

* 섹션 제목: `단원 범위 설정`
* label:

  * `교재`
  * `단원 범위 붙여넣기`
* textarea placeholder:

  * `순서,대단원,소단원,시작번호,끝번호`
* 버튼:

  * `등록하기`
  * `목록 보기`

### 4-5. assignSection()

문구:

* 섹션 제목: `반별 교재 배정`
* label:

  * `학년`
  * `반`
  * `교재`
  * `배정일`
  * `배정명`
* 배정명 보조 문구:

  * `(비워두면 교재명)`
* 버튼:

  * `배정하기`
  * `목록 보기`

배정 목록 없을 때:

* `배정된 교재가 없습니다.`

### 4-6. entryForm(), renderEntryRows()

문구:

* 섹션 제목: `오답 입력`
* label:

  * `학년`
  * `반`
  * `교재`
* 버튼:

  * `불러오기`
* help:

  * `미입력(−) · O 전부 맞음 · X 오답 있음`

entry 없음:

* `학년·반·교재 선택 후 [불러오기]를 누르세요.`

학생 없음:

* `해당 반에 학생이 없습니다.`

표 헤더:

* `학생명`
* `상태`
* `오답 번호`
* `번호 선택`

### 4-7. renderWrongNumberPicker()

문구:

* 제목: `오답 번호 선택`
* 선택 표시:

  * `선택된 번호: 없음`
  * 선택값이 있으면 번호 목록 표시

### 4-8. viewForm(), renderViewText()

문구:

* 섹션 제목: `오답 현황`
* label:



  * `학년`
  * `반`
  * `학생`
  * `교재`
* 버튼:

  * `조회`

data 없음:

* `학년·반·교재 선택 후 [조회]를 누르세요.`

출력 섹션:

* `▸ 제출 현황`
* `▸ 오답 집계`
* `▸ 단원별 오답`
* `▸ 학생별 오답`
* `▸ 오답 목록`

### 4-9. notify / confirm 메시지

적용:

* 교재 등록 성공: `교재를 등록했습니다.`
* 반 배정 성공: `반 배정을 완료했습니다.`
* 교재 미선택: `교재를 선택하세요.`
* 반 미선택: `반을 선택하세요.`
* 저장 내용 없음: `저장할 내용이 없습니다. 오답 번호를 입력하거나 O(정답)로 표시하세요.`
* 저장 confirm:

  * `총 N명 저장`
  * `정답: N명`
  * `오답 입력: N명`
  * `미입력 제외: N명`
  * `저장하시겠습니까?`
* 저장 완료: `N명 저장 완료`
* 학년 미선택: `학년을 선택하세요.`
* 학생 목록 미불러옴: `먼저 학생 목록을 불러오세요.`

## 5. 추가 기능: 교재 관리

### 5-1. 자료 등록 영역에 관리 버튼 추가

`교재 등록` 섹션 버튼은 아래 순서로 둔다.

* `등록하기`
* `새로고침`
* `관리`

### 5-2. 교재 관리 모달

`관리` 버튼 클릭 시 교재 관리 모달을 연다.

모달 제목:

* `교재 관리`

안내:

* `교재를 선택하세요.`

모달 안 목록:

* 전체 교재를 표시한다.
* 삭제 처리된 교재도 관리 모달에서는 확인 가능해야 한다.
* 교재 하나를 선택하면 선택 표시를 한다.

선택 후 버튼:

* `수정`
* `삭제`
* `닫기`

일반 교재 카드에는 수정/삭제 버튼을 노출하지 않는다.

### 5-3. 수정

`수정` 클릭 시 수정 폼을 보여준다.

수정 가능 항목:

* 교재 종류
* 교재명
* 학년
* 학기
* 시작 문항
* 끝 문항

버튼:

* `저장`
* `취소`

저장 시 기존 교재 row를 업데이트한다.

성공 문구:

* `교재를 수정했습니다.`

### 5-4. 삭제

화면 문구는 `삭제`로 표시한다.

하지만 실제 동작은 DB row 삭제가 아니라 숨김 처리다.

삭제 버튼 클릭 시 한 번 더 확인한다.

확인 문구:

* `이 교재를 삭제할까요?`

버튼:

* `삭제`
* `취소`

삭제 동작:

* 실제 DELETE 금지
* soft delete / hidden 처리
* 기본 교재 목록에서는 안 보이게 한다.
* 기존 단원/배정/오답 데이터는 보존한다.
* 관리 모달에서는 삭제 처리된 교재도 확인 가능하게 한다.

성공 문구:

* `교재를 삭제했습니다.`

## 6. 구현 방식

기존 함수명과 구조를 최대한 유지한다.

선택 상태는 하나로 통합한다.

* `selectedMaterialId` 또는 기존 선택 상태를 사용
* 카드 클릭, 단원 범위 설정, 반별 교재 배정, 오답 입력, 오답 현황의 교재 선택값이 서로 동기화되어야 한다.

교재 카드 클릭 함수가 없다면 최소 추가:

* `selectStudyMaterialByCard(el)`
* `onStudyMaterialSelectChange(materialId)`
* `selectedMaterialIdFor(fallback)`

기존에 같은 역할의 함수가 있으면 새로 만들지 말고 보강한다.

## 7. API 확인

교재 수정/삭제 처리에 필요한 API가 이미 있으면 기존 API를 사용한다.

없으면 worker 수정이 필요할 수 있으나, 이번 작업에서는 먼저 `study-material-wrong.js` 기준으로 가능한 범위만 수정한다.

worker 수정이 필요하다고 판단되면:

* 임의로 worker를 수정하지 말고
* CODEX_RESULT.md에 “worker API 추가 필요”로 보고한다.

## 8. 검증

프로젝트 루트에서 실행:

```powershell
node --check apmath/js/study-material-wrong.js
node --check apmath/js/ui.js
node --check apmath/app.js
```

검색 검수:

```powershell
Select-String -Path .\apmath\js\study-material-wrong.js -Pattern "수업자료 오답","비활성화","활성화","사용 안 함","입력 열기","복습 출력"
Select-String -Path .\apmath\js\study-material-wrong.js -Pattern "교재 등록","교재 관리","이 교재를 삭제할까요","selectedMaterialId"
```

수동 검수 항목:

1. 운영센터 진입
2. 교재 화면 열기
3. 교재 카드 클릭 시 선택 표시
4. 단원 범위 설정/반별 교재 배정/오답 입력/오답 현황의 교재 선택값 동기화
5. 관리 버튼 클릭 시 교재 관리 모달 열림
6. 교재 선택 후 수정 가능
7. 교재 선택 후 삭제 가능
8. 삭제 후 기본 목록에서 안 보임
9. 삭제 후 기존 단원/배정/오답 데이터가 삭제되지 않음

## 9. 완료 보고

작업 완료 후 루트의 `CODEX_RESULT.md`에 아래 형식으로 짧게 저장한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `apmath/js/study-material-wrong.js`
- 확인: `apmath/js/ui.js`
- 확인: `apmath/app.js`

## 2. 구현 완료 또는 확인 완료
- 클로드 정리안 기준 교재 문구 적용
- 탭을 `자료 설정 | 오답 입력 | 오답 현황`으로 정리
- 교재 등록/단원 범위 설정/반별 교재 배정/오답 입력/오답 현황 문구 정리
- 교재 카드 클릭 선택 동작 유지/보강
- 선택 교재 동기화 구현 또는 확인
- 교재 관리 모달 추가 또는 구현 가능 여부 확인
- 수정 기능 추가 또는 구현 가능 여부 확인
- 삭제 문구 적용, 실제 동작은 숨김 처리
- 기본 목록에서 삭제 처리된 교재 숨김
- 기존 단원/배정/오답 데이터 보존

## 3. 실행 결과
- `node --check apmath/js/study-material-wrong.js`: 결과 기재
- `node --check apmath/js/ui.js`: 결과 기재
- `node --check apmath/app.js`: 결과 기재
- wrangler 실행: 없음
- D1 migration 실행: 없음
- git add/commit/push 실행: 없음

## 4. 결과 요약
- 교재 화면 문구를 학원 실무 기준으로 정리
- 교재 카드 선택과 관리 흐름을 분리
- 화면에는 삭제로 보이지만 실제 데이터는 숨김 처리로 보존

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 것
- 잘못한 점: 이전 작업에서 카드 선택과 관리 기능이 명확히 분리되지 않았음
- 위험했던 점: 삭제를 실제 DB 삭제로 구현하면 기존 단원/배정/오답 데이터가 손상될 수 있음
- 보존해야 할 것: 운영센터/출석부/학생관리/플래너/아카이브 기존 흐름 변경 금지

## 6. 다음 조치
- 실제 화면에서 교재 선택/수정/삭제 흐름 수동 검수 필요
```

마지막 터미널 출력은 반드시 아래 문장으로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

EOF

```
```


---