````bash
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK

## 0. 작업 목적

교재 관리에서 교재를 삭제한 뒤 화면 복귀와 목록 갱신이 잘못되는 문제만 수정한다.

문구는 절대 변경하지 않는다.

## 1. 수정 대상

필수 수정:
- `apmath/js/study-material-wrong.js`

확인만:
- `apmath/js/ui.js`
- `apmath/app.js`

## 2. 절대 금지

- 문구 변경 금지
- 탭명 변경 금지
- 버튼명 변경 금지
- 화면명 변경 금지
- CSS 변경 금지
- 신규 기능 추가 금지
- 실제 DB DELETE 금지
- 기존 단원/배정/오답 데이터 삭제 금지
- 원장/관리자 대시보드 변경 금지
- 출석부/학생관리/플래너/아카이브 변경 금지
- `git add` 금지
- `git commit` 금지
- `git push` 금지
- `wrangler deploy` 금지
- D1 migration 금지

## 3. 현재 문제

현재 `apmath/js/study-material-wrong.js`의 `deleteStudyMaterialManageItem()`에서 교재 삭제 후 아래 흐름이 발생한다.

```js
await call('PATCH', `study-materials/${encodeURIComponent(material.id)}`, { status: 'deleted' });
notify('교재를 삭제했습니다.');
st().manageSelectedId = '';
st().manageEditId = '';
await loadStudyMaterialWrongData();
await openStudyMaterialManage();
````

문제:

* 삭제 후 `openStudyMaterialManage()`를 다시 호출해서 삭제된 교재가 교재 관리 화면에 다시 보인다.
* 삭제 후 메인 교재 화면으로 복귀하지 않는다.
* 삭제한 교재가 선택값으로 남아 있을 수 있다.

## 4. 수정 기준

`deleteStudyMaterialManageItem()`만 필요한 범위에서 수정한다.

삭제 버튼 클릭 후 정상 흐름:

1. `PATCH status: deleted` 동작은 유지한다.
2. 실제 DB 삭제는 하지 않는다.
3. 삭제 성공 문구 `교재를 삭제했습니다.`는 그대로 유지한다.
4. 삭제 성공 후 `openStudyMaterialManage()`를 호출하지 않는다.
5. 삭제한 교재 id가 `selectedMaterialId`이면 `selectedMaterialId`를 빈 값으로 초기화한다.
6. `entryFilters.material_id`가 삭제한 교재 id이면 빈 값으로 초기화한다.
7. `viewFilters.material_id`가 삭제한 교재 id이면 빈 값으로 초기화한다.
8. `manageSelectedId`를 빈 값으로 초기화한다.
9. `manageEditId`를 빈 값으로 초기화한다.
10. `manageOpen`을 `false`로 바꾼다.
11. `loadStudyMaterialWrongData()`를 호출해 기본 교재 목록을 다시 불러온다.
12. 삭제 후 화면은 교재 관리 모달이 아니라 기본 교재 화면이어야 한다.
13. 삭제 처리된 교재는 기본 목록에 보이면 안 된다.
14. 기존 단원/배정/오답 데이터는 보존한다.

## 5. 권장 수정 형태

아래 방향으로만 고친다. 실제 코드 스타일은 현재 파일에 맞춘다.

```js
window.deleteStudyMaterialManageItem = async function () {
    const material = getManageSelectedMaterial();
    if (!material) return notify('교재를 선택하세요.', 'warn');
    if (!confirm('이 교재를 삭제할까요?')) return;

    const deletedId = String(material.id || '');

    await call('PATCH', `study-materials/${encodeURIComponent(material.id)}`, { status: 'deleted' });
    notify('교재를 삭제했습니다.');

    if (String(st().selectedMaterialId || '') === deletedId) st().selectedMaterialId = '';
    if (st().entryFilters && String(st().entryFilters.material_id || '') === deletedId) st().entryFilters.material_id = '';
    if (st().viewFilters && String(st().viewFilters.material_id || '') === deletedId) st().viewFilters.material_id = '';

    st().manageSelectedId = '';
    st().manageEditId = '';
    st().manageOpen = false;

    await loadStudyMaterialWrongData();
};
```

주의:

* 위 코드는 방향 예시다.
* 현재 파일의 함수/상태 구조와 충돌하지 않게 적용한다.
* 문구는 그대로 유지한다.
* `openStudyMaterialManage()` 재호출은 제거한다.

## 6. 검증

프로젝트 루트에서 실행한다.

```powershell
node --check apmath/js/study-material-wrong.js
node --check apmath/js/ui.js
node --check apmath/app.js
```

검색 확인:

```powershell
Select-String -Path .\apmath\js\study-material-wrong.js -Pattern "deleteStudyMaterialManageItem","openStudyMaterialManage","manageOpen","selectedMaterialId","교재를 삭제했습니다"
```

확인 기준:

* `deleteStudyMaterialManageItem()` 내부에서 삭제 성공 후 `openStudyMaterialManage()`를 호출하지 않아야 한다.
* 삭제 성공 후 `manageOpen = false` 처리가 있어야 한다.
* 삭제한 교재 id가 선택 상태에 남지 않도록 초기화해야 한다.
* 문구 변경 없어야 한다.

## 7. 수동 검수 항목

브라우저에서 확인:

1. 운영센터 진입
2. 교재 화면 열기
3. 교재 관리 클릭
4. 교재 선택
5. 삭제 클릭
6. `이 교재를 삭제할까요?` 확인
7. 삭제 후 교재 관리 모달이 닫히는지 확인
8. 기본 교재 화면으로 돌아오는지 확인
9. 삭제한 교재가 기본 목록에 안 보이는지 확인
10. 다시 교재 관리를 열었을 때 삭제한 교재가 일반 선택 대상으로 남아 있지 않은지 확인
11. 기존 단원/배정/오답 데이터가 삭제되지 않았는지 확인

## 8. 완료 보고

작업 완료 후 루트의 `CODEX_RESULT.md`에 아래 형식으로 짧게 저장한다.

```md
# CODEX_RESULT

## 1. 생성/수정 파일
- 수정: `apmath/js/study-material-wrong.js`
- 확인: `apmath/js/ui.js`
- 확인: `apmath/app.js`

## 2. 구현 완료 또는 확인 완료
- 교재 삭제 후 `openStudyMaterialManage()` 재호출 제거
- 삭제 후 `manageOpen=false`로 기본 교재 화면 복귀 처리
- 삭제한 교재가 선택 상태에 남지 않도록 초기화
- 삭제 후 교재 목록 재조회 유지
- 문구 변경 없음
- 실제 DB 삭제 없음
- 기존 단원/배정/오답 데이터 보존

## 3. 실행 결과
- `node --check apmath/js/study-material-wrong.js`: 결과 기재
- `node --check apmath/js/ui.js`: 결과 기재
- `node --check apmath/app.js`: 결과 기재
- wrangler 실행: 없음
- D1 migration 실행: 없음
- git add/commit/push 실행: 없음

## 4. 결과 요약
- 교재 삭제 후 관리 모달에 남는 문제를 수정
- 삭제 후 기본 교재 화면으로 정상 복귀하도록 수정
- 삭제한 교재 선택 상태가 남지 않도록 정리

## 5. 잘못한 점 / 위험했던 점 / 보존해야 할 것
- 잘못한 점: 삭제 후 관리 모달을 다시 열어 삭제된 교재가 계속 보일 수 있었음
- 위험했던 점: 삭제된 교재 id가 선택 상태에 남아 화면 복귀가 꼬일 수 있었음
- 보존해야 할 것: 문구, 기존 교재 데이터 구조, 단원/배정/오답 데이터 보존

## 6. 다음 조치
- 실제 화면에서 교재 삭제 후 기본 화면 복귀와 목록 갱신 수동 확인 필요
```

마지막 터미널 출력은 반드시 아래 문장으로 끝낸다.

```text
CODEX_RESULT.md에 완료 보고를 저장했습니다.
```

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF

```
```
