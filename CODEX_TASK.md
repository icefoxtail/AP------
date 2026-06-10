# AP MATH 학생상세 상단 프로필 sticky 고정 UX 핫픽스 지시서

## 0. 작업 목적

AP MATH 학생상세 모달에서 스크롤/드래그 시 상단의 학생 핵심 정보가 가려지는 문제를 수정한다.

현재 학생상세 상단에는 다음 정보가 표시된다.

```text
학생명
재원 상태
학교/학년
소속 반
PIN
정보 수정 버튼
```

예시:

```text
허홍
재원 / 왕운중 · 중1 / 중1C / PIN 1138
정보 수정
```

현재 이 영역이 일반 카드처럼 본문 안에 들어가 있어서, 모달을 스크롤하거나 드래그할 때 상단 모달 헤더와 겹치거나 가려져 UX가 좋지 않다.

이번 작업은 이 상단 정보를 **학생상세 sticky identity bar**로 고정하는 작업이다.

---

## 1. 수정 대상 파일

원칙상 수정 파일은 아래 1개만 허용한다.

```text
apmath/js/student.js
```

다음 파일은 수정하지 않는다.

```text
apmath/index.html
apmath/js/ui.js
apmath/js/core.js
apmath/worker-backup/worker/index.js
apmath/worker-backup/worker/routes/operations.js
```

백엔드/API/DB 수정 금지.

---

## 2. 현재 구조 확인

`apmath/js/student.js` 안에 `injectStudentStyles()` 함수가 있고, 그 안에서 학생상세 관련 CSS가 주입된다.

현재 핵심 클래스는 다음이다.

```text
.ap-student-detail-shell
.ap-student-profile-head
.ap-student-head-main
.ap-student-head-badges
.ap-student-head-actions
.ap-student-pill
.ap-student-status
.ap-student-action
```

학생상세 상단 HTML은 `renderStudentDetailHeader(sid, tab)`에서 생성된다.

현재 형태는 대략 다음 구조다.

```html
<header class="ap-student-profile-head">
  <div class="ap-student-head-main">
    <h1>학생명</h1>
    <div class="ap-student-head-badges">
      <span class="ap-student-status">재원</span>
      <span class="ap-student-pill">학교 · 학년</span>
      <span class="ap-student-pill">반</span>
      <span class="ap-student-pill">PIN</span>
    </div>
  </div>
  <div class="ap-student-head-actions">
    <button class="ap-student-action">정보 수정</button>
  </div>
</header>
```

이 헤더는 `renderStudentDetailTab()`에서 모달 본문 최상단에 들어가며, 바로 아래에 `renderStudentConsultationPinnedCard(sid)`가 이어진다.

---

## 3. 문제 정의

현재 문제는 다음이다.

```text
1. 학생 프로필 헤더가 일반 카드라 스크롤 시 위로 밀려 올라감
2. 모달 상단의 “취소 / 허홍 프로필” 헤더 아래로 학생 정보 카드가 말려 들어가면서 가려짐
3. 모바일에서 드래그할 때 재원/반/PIN 뱃지가 상단에 겹치거나 일부 가려짐
4. 학생상세에서 상담/기본정보를 보는 동안 학생 식별 정보가 계속 보이지 않음
```

수정 목표는 다음이다.

```text
학생상세 모달 안에서
학생명 / 재원 / 학교·학년 / 반 / PIN / 정보 수정 버튼이
상단에 안정적으로 붙어 있게 한다.
```

---

## 4. 구현 원칙

### 반드시 sticky 사용

이번 작업은 `position: sticky`로 처리한다.

```text
position: fixed 사용 금지
```

이유:

```text
fixed는 화면 기준으로 떠서 모달 본문을 덮을 수 있음
fixed는 모바일 주소창/키보드/모달 하단시트와 충돌 위험이 큼
sticky는 모달 body 스크롤 흐름 안에서 자연스럽게 고정됨
```

### top 값

모달 body 안에서 sticky가 되어야 하므로 기본은 다음 기준이다.

```css
top: 0;
```

`top: 58px`, `top: 64px` 같은 전역 헤더 기준값을 넣지 않는다.
이 학생상세는 일반 페이지가 아니라 모달 내부이므로, 전역 앱 헤더 기준으로 맞추면 기기별로 어긋날 수 있다.

### JS 로직 변경 금지

이번 작업은 레이아웃/UX 핫픽스다.

아래 로직은 건드리지 않는다.

```text
상담 저장
상담 조회
정보 수정 저장
학생 상세 데이터 로딩
모달 step stack
closeModal / showModalStep
```

---

## 5. 구체 수정 지시

### 5-1. `.ap-student-profile-head`를 sticky identity bar로 변경

`injectStudentStyles()` 내부의 기존 `.ap-student-profile-head` 정의를 찾아 수정한다.

권장 CSS:

```css
.ap-student-profile-head {
    position: sticky;
    top: 0;
    z-index: 24;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: start;
    gap: 12px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--surface);
    box-shadow: 0 8px 22px rgba(15, 23, 42, .075);
}
```

기존 카드 느낌은 유지하되, sticky로 고정한다.

---

### 5-2. sticky 상태에서 배경 투명 문제 방지

sticky가 되면 아래 내용이 뒤로 지나가므로 배경은 반드시 불투명해야 한다.

```css
.ap-student-profile-head {
    background: var(--surface);
}
```

다크모드 보정도 추가한다.

```css
body.dark .ap-student-profile-head {
    background: var(--surface);
    box-shadow: none;
}
```

이미 `body.dark .ap-student-profile-head` 규칙이 있다면 중복되지 않게 병합한다.

---

### 5-3. 모바일에서 압축형으로 보이게 조정

모바일에서는 헤더가 너무 크면 화면을 많이 차지한다.
학생명, 뱃지, 정보 수정 버튼이 한 카드 안에서 보기 좋게 압축되도록 아래 규칙을 추가한다.

```css
@media (max-width: 600px) {
    .ap-student-profile-head {
        grid-template-columns: minmax(0, 1fr) auto;
        gap: 10px;
        padding: 10px 12px;
        border-radius: 14px;
        align-items: start;
    }

    .ap-student-head-main {
        min-width: 0;
        gap: 6px;
    }

    .ap-student-head-main h1 {
        font-size: 20px;
        line-height: 1.12;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .ap-student-head-badges {
        gap: 5px;
        margin: 0;
        max-height: 52px;
        overflow: hidden;
    }

    .ap-student-pill,
    .ap-student-status {
        min-height: 22px;
        padding: 2px 7px;
        font-size: 10.5px;
        line-height: 1.2;
        white-space: nowrap;
    }

    .ap-student-head-actions {
        align-items: flex-start;
        justify-content: flex-end;
        flex: 0 0 auto;
    }

    .ap-student-action {
        min-height: 36px;
        padding: 0 10px;
        border-radius: 10px;
        font-size: 12px;
        white-space: nowrap;
    }
}
```

중요:

```text
상태/반/PIN 뱃지를 display:none으로 숨기지 말 것.
학생 식별 정보는 유지해야 한다.
```

---

### 5-4. 최근 상담 카드가 sticky 헤더 밑으로 자연스럽게 이어지게 하기

`renderStudentDetailTab()` 구조는 유지한다.

현재 구조:

```js
${renderStudentDetailHeader(sid, 'basic')}
${renderStudentConsultationPinnedCard(sid)}
${bodyHtml}
```

이 순서는 유지한다.

다만 sticky 헤더 아래의 시각 간격이 너무 붙으면 `.ap-student-consult-pinned` 또는 `.ap-student-detail-shell` gap을 조정한다.

권장:

```css
.ap-student-detail-shell {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
```

이미 `gap:14px`라면 유지 가능하다.
핵심은 sticky 헤더가 최근 상담 카드와 겹치지 않아야 한다.

---

## 6. 금지 사항

아래 작업은 하지 않는다.

```text
1. #modal-header, #modal-body, #modal-content 전역 구조 변경 금지
2. showModal / closeModal / showModalStep 수정 금지
3. position: fixed 사용 금지
4. 학생상세 전체를 새 HTML로 재작성 금지
5. 상담 핫픽스에서 수정한 onclick/문자열 escape 로직 되돌리기 금지
6. 정보 수정 버튼 제거 금지
7. 재원/학교/반/PIN 뱃지 숨김 처리 금지
8. 백엔드/API/DB 수정 금지
```

---

## 7. 이전 상담 핫픽스 보존 조건

최근 상담 핫픽스가 이미 적용되어 있다면 반드시 유지한다.

확인할 것:

```text
+ 새 상담 버튼 클릭 정상
+ 첫 상담 기록하기 클릭 정상
상담 날짜 버튼 클릭 정상
정보 수정 버튼 클릭 정상
```

이번 sticky 작업 중 `onclick`, `apmsStudentJsString`, `apmsStudentOnclickArg` 관련 코드를 되돌리면 안 된다.

---

## 8. 정적 검증

수정 후 반드시 실행한다.

```powershell
node --check apmath\js\student.js
```

추가 검색 검수:

```powershell
Select-String -Path "apmath\js\student.js" -Pattern "ap-student-profile-head|ap-student-head-badges|ap-student-action|position:\s*sticky|position:\s*fixed|renderStudentDetailHeader|renderStudentDetailTab" -Context 2,2
```

확인 기준:

```text
1. .ap-student-profile-head에 position: sticky가 있음
2. .ap-student-profile-head에 top: 0이 있음
3. .ap-student-profile-head에 z-index가 있음
4. .ap-student-profile-head에 불투명 background가 있음
5. position: fixed가 새로 추가되지 않았음
6. renderStudentDetailHeader 구조가 크게 바뀌지 않았음
```

---

## 9. 브라우저 수동 확인 시나리오

실제 화면 확인 없는 PASS 금지.

### PC 또는 모바일 공통

```text
1. AP MATH 로그인
2. 학생상세 열기
3. 학생명 / 재원 / 학교·학년 / 반 / PIN이 표시되는지 확인
4. 아래로 스크롤
5. 학생 요약 헤더가 모달 상단에 붙어 있는지 확인
6. 최근 상담 / 기본정보가 헤더 아래에서 자연스럽게 이어지는지 확인
7. 헤더가 최근 상담 내용을 과하게 가리지 않는지 확인
8. 정보 수정 버튼 클릭 정상 확인
9. + 새 상담 버튼 클릭 정상 확인
```

### 모바일/좁은 화면 확인

```text
1. 모바일 폭에서 학생상세 열기
2. 상단 학생명과 뱃지가 2줄 이내로 보기 좋게 보이는지 확인
3. 드래그/스크롤 시 재원/반/PIN이 상단 헤더에 가려지지 않는지 확인
4. 정보 수정 버튼이 오른쪽에서 눌리는지 확인
5. 모달 닫기/뒤로가기 동작이 기존과 같은지 확인
```

---

## 10. PASS 기준

아래 조건을 모두 만족해야 PASS다.

```text
1. 학생상세 상단 프로필 카드가 sticky로 고정됨
2. 스크롤/드래그 시 학생명/재원/반/PIN이 모달 상단에 가려지지 않음
3. 최근 상담 카드와 기본정보 영역이 깨지지 않음
4. 상담 핫픽스 기능이 유지됨
5. 정보 수정 버튼 정상 동작
6. node --check 통과
7. 변경 파일은 원칙적으로 apmath/js/student.js 1개
```

---

## 11. 최종 보고 형식

작업 완료 후 아래 형식으로 보고한다.

```text
## 수정 파일
- apmath/js/student.js

## 수정 내용
- 학생상세 상단 프로필 카드 sticky 고정
- 모바일에서 학생명/상태/학교/반/PIN 뱃지 압축 표시
- 정보 수정 버튼 유지
- 상담 핫픽스 onclick 로직 보존

## 검증
- node --check apmath/js/student.js 통과
- 학생상세 스크롤 시 상단 정보 가림 없음 확인
- + 새 상담 클릭 정상 확인
- 정보 수정 클릭 정상 확인

## 미수행
- 미수행 항목이 있으면 명시
```
