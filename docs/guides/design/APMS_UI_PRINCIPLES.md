# APMS UI 원칙

이 문서는 AP Math OS / APMS 화면 작업의 공통 UI 기준이다.

목표는 화면을 새로 꾸미는 것이 아니라, 선생님과 원장이 실제 운영 중 빠르게 읽고 눌러야 하는 정보를 조용하고 일관되게 정렬하는 것이다.

---

## 1. 최상위 기준

- 화면은 운영자를 감시하는 느낌이 아니라, 오늘 처리할 일을 놓치지 않게 도와주는 느낌이어야 한다.
- 기능이 많아 보여서는 안 된다.
- 카드와 row는 정보를 정리하기 위한 구조이지 장식이 아니다.
- 색, 굵은 글씨, 그림자, 배지로 상태를 과하게 때리지 않는다.
- 기존 문구, 버튼명, 화면명, 운영 용어는 사용자 요청 없이 변경하지 않는다.
- 기존 흐름과 기능을 유지한 채 스타일만 정리한다.
- 전역 CSS를 건드리지 않는다.

---

## 2. Apple-style의 APMS 해석

APMS에서 Apple-style은 다음을 의미하지 않는다.

- 파란색 버튼 강제
- 모든 카드를 크게 둥글게 만들기
- 강한 shadow 사용
- 전체 padding을 크게 늘려 정보 밀도 붕괴
- `body`, `button`, `.card`, `*` 같은 전역 selector 덮어쓰기
- `!important` 남발

APMS에서 Apple-style은 다음을 의미한다.

- 낮은 font-weight
- 얇은 선
- 거의 보이지 않는 그림자
- 색보다 정보 정렬
- 카드보다 row 중심
- 배지보다 텍스트 중심
- hover 때만 약한 반응
- 클릭 가능한 row에는 chevron 하나만 사용
- 상태 강조를 줄이고 문구와 위치로 위계 표현

---

## 3. 카드와 row의 역할

카드는 삭제하지 않는다.

다만 카드 안에 또 카드를 넣지 않는다.

### 3.1 카드가 필요한 곳

섹션 또는 큰 정보 묶음은 카드로 감싼다.

예:

- 오늘일지
- 오늘일정
- 학급관리
- 선생님 현황
- 학생 기본 정보
- 반 기본 정보

### 3.2 카드 안쪽 항목

카드 내부의 반복 항목은 line row로 정리한다.

예:

- 수/목 일지 row
- 일정 row
- 학급 row
- 학생 row
- 상담 row
- 제출 상태 row

### 3.3 금지 구조

- 카드 안 작은 카드 반복
- row마다 두꺼운 border
- row마다 강한 background
- row마다 radius/shadow 적용
- 상태값을 배지로 과하게 강조

---

## 4. Typography 기준

대시보드와 운영 화면은 400~500 중심으로 간다.

| 용도 | 크기 | 굵기 |
|---|---:|---:|
| 화면 최상위 제목 | 15px | 500~600 |
| 섹션 제목 | 14px | 500 |
| 카드 제목 / 반 이름 / 학생 이름 | 14px | 500 |
| 일반 row 텍스트 | 13px | 400 |
| 보조 텍스트 | 12px | 400 |
| chip 텍스트 | 12px | 400~500 |
| 버튼 텍스트 | 13px | 500 |
| chevron | 14px | 400 |

금지:

- 700/800/900 신규 사용
- 숫자만 굵게 만드는 구조
- 상태값만 bold 처리
- 같은 줄 안에서 글자 크기와 두께가 과하게 뒤섞이는 구조

---

## 5. 색상 기준

색은 상태를 소리치게 하는 도구가 아니다.

기본 방향:

- 기본 텍스트: 기존 `var(--text)` 또는 `#111827`
- 보조 텍스트: 기존 `var(--secondary)` 또는 `#6b7280`
- row 상태 텍스트: 기존 text 계열
- chevron: `#9ca3af` 수준의 약한 회색
- hover background: `rgba(15,23,42,0.03)` 수준

금지:

- 제출완료 초록 강조
- 미작성 주황 강조
- 결석/미완료를 모든 화면에서 강한 경고색으로 표시
- 기능 의미가 없는 파란색 강조
- 색으로만 상태를 구분

출석부처럼 색상 자체가 기능인 화면은 별도 기준으로 다룬다.

---

## 6. 클릭 가능한 row 기준

클릭 가능한 row는 버튼처럼 보이게 만들지 않는다.

기준:

- row 전체 clickable
- 오른쪽 chevron `›` 표시
- cursor pointer
- hover 때만 아주 약한 background
- hover 시 padding/margin 변동 금지
- layout shift 금지

예:

```html
<div class="journal-day-cell" onclick="...">
  <span class="journal-day-cell__label">수 5/20</span>
  <span class="journal-day-cell__spacer"></span>
  <span class="journal-day-cell__status">제출완료</span>
  <span class="journal-day-cell__chevron">›</span>
</div>
```

---

## 7. CSS 적용 원칙

- 새 UI는 전용 class로 작성한다.
- 기존 inline style은 작업 범위 안에서만 점진 제거한다.
- CSS 파일 전체를 새 스타일로 갈아엎지 않는다.
- 기존 selector를 삭제하기 전 실제 사용 여부를 확인한다.
- 전역 selector 수정 금지.
- `button`, `.card`, `body`, `*` 직접 수정 금지.
- 기존 CSS foundation 위에 필요한 class만 안전 추가한다.

---

## 8. 화면 작업 검수 기준

UI 작업은 코드 PASS만으로 끝나지 않는다.

필수 확인:

- node --check 통과
- 기존 기능/문구/버튼명 보존
- 브라우저 화면 캡처 확인
- 카드 shell이 사라지지 않았는지 확인
- 카드 안 카드가 생기지 않았는지 확인
- font-weight 700 이상이 신규로 들어오지 않았는지 확인
- line row가 카드처럼 보이지 않는지 확인
- 클릭 가능한 row가 chevron으로 구분되는지 확인

화면 캡처에서 어색하면 코드상 PASS여도 UI PASS가 아니다.
