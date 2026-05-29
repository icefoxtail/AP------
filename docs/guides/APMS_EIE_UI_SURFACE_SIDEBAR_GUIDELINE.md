# APMS / EIE UI Surface & Sidebar Guideline v1.1

> 적용 범위: APMS, EIE  
> 상위 기준: `ACADEMY_APMS_EIE_COMMON_UI_INTERACTION_GUIDELINE_v1.1.md`  
> 문서 상태: APMS/EIE 전용 시각 기준 문서  
> 작성 기준일: 2026-05-29  
> 목적: APMS/EIE의 카드, row, 사이드바, hover, active, 아이콘 규칙을 하나로 고정한다.

---

## 0. 이 문서의 역할

이 문서는 전체 UI 구조 원칙 문서가 아니다.  
전체 구조 원칙은 `ACADEMY_APMS_EIE_COMMON_UI_INTERACTION_GUIDELINE_v1.1.md`를 따른다.

이 문서는 APMS/EIE의 실제 화면에서 반복되는 다음 문제를 막기 위한 **시각·상호작용 보조 기준**이다.

```text
- 기본 상태부터 파란 카드처럼 보이는 문제
- active와 hover가 섞여 선택된 것처럼 보이는 문제
- 큰 카드, 작은 카드, 카드 안 카드가 모두 같은 강도로 튀는 문제
- 사이드바가 구식으로 보이거나 메뉴별 아이콘 감각이 다른 문제
- APMS, EIE, Academy OS의 시각 문법이 서로 다르게 보이는 문제
- 선생님 화면에 AP/EIE 브랜드 이동 요소가 잘못 노출되는 문제
```

---

## 1. 핵심 결론

앞으로 APMS/EIE의 카드와 사이드바는 다음 기준을 따른다.

```text
기본 상태는 조용한 surface.
hover 상태에서만 “내가 여기 있어요”라는 위치감을 준다.
active 상태는 색칠이 아니라 현재 위치 표시만 한다.
파란 active 배경은 사용하지 않는다.
ACA 사이드바 아이콘 감각은 이식하되, APMS/EIE 구조와 권한 분리는 유지한다.
```

---

## 2. 색상 기준

새로운 파란색 계열 토큰을 만들지 않는다.  
APMS 안에 이미 있는 surface 계열을 우선 사용한다.

기본 토큰:

```text
var(--surface)    = 기본 카드 / 선택된 내부 버튼
var(--surface-2)  = 카드 뒤판 / hover 배경 / 작은 카드 배경
var(--border)     = 얇은 경계선
var(--text)       = 기본 텍스트
var(--secondary)  = 보조 텍스트
```

금지:

```text
- 기본 카드 배경을 파란색으로 채우기
- active 메뉴/카드를 파란색으로 칠하기
- 제출완료, 학습, 반 배정 등 상태 배지를 파란 배경으로 칠하기
- AP MATH / EIE 버튼만 파란 카드처럼 강조하기
```

허용:

```text
- hover 순간에만 surface-2로 은은하게 반응
- active 상태에서 surface-2 또는 얇은 border로 현재 위치 표시
- 텍스트 굵기, 미세한 border, 아주 약한 shadow로 구분
```

---

## 3. 카드 계층 기준

## 3-1. 큰 카드

큰 카드는 화면의 주요 이동·진입 단위다.

예시:

```text
APMS 원장님 대시보드:
- AP MATH
- EIE
- 출석부
- 시간표
- 성적표
- 관리

APMS 선생님 대시보드:
- 학급관리 반 카드
- 오늘일지 카드

EIE:
- 대시보드 주요 카드
- 클래스룸 수업 카드
```

기본:

```text
background: var(--surface)
border: 1px solid var(--border)
shadow: 매우 약하게 또는 없음
```

hover:

```text
background: var(--surface-2)
transform: translateY(-1px)
shadow: 약하게 증가
border: 조금 더 선명
```

금지:

```text
- 파란 배경
- 과한 glow
- 큰 이동감
- 선택된 탭처럼 보이는 스타일
```

---

## 3-2. 작은 카드

작은 카드는 큰 카드 안의 정보 조각이다.  
큰 카드처럼 붕 뜨면 안 된다.

예시:

```text
- 오늘 운영 안의 재원 / 최근 등록 / 퇴원 / 휴원
- 오늘일지 안의 수·목·금 카드
- 카드 안에 들어간 상태 요약 박스
- EIE 학생 상세 안의 작은 정보 카드
```

기본:

```text
background: var(--surface-2)
border: 1px solid transparent 또는 아주 약한 border
shadow: 없음
```

hover:

```text
background: var(--surface)
border: var(--border) 또는 살짝 진한 border
transform: 없음 또는 아주 미세하게만
shadow: 없음 또는 매우 약하게
```

금지:

```text
- 큰 카드보다 더 튀는 shadow
- 큰 카드보다 강한 hover
- 파란 active 배경
- 부모 카드보다 더 눈에 띄는 색상
```

---

## 3-3. row형 항목

row는 목록/일정/최근기록처럼 한 줄 단위로 클릭되는 요소다.

예시:

```text
- 사이드바 메뉴 row
- 주간일정 row
- 최근 상담 row
- 최근 등록 학생 row
- 학생관리 목록 row
- EIE 학생 목록 row
```

기본:

```text
background: transparent 또는 var(--surface)
border: 필요 시만 사용
shadow: 없음
```

hover:

```text
background: var(--surface-2)
border-radius: 10~12px
transform: 없음
shadow: 없음
```

row는 카드처럼 떠오르지 않는다.  
마우스를 올렸을 때 뒤에 둥근 배경이 생기며 “여기 있다” 정도만 보여준다.

---

## 4. 클릭 가능 요소 기준

hover는 클릭 가능한 요소에만 적용한다.

적용:

```text
- 이동 카드
- 열기 가능한 카드
- 상세가 열리는 row
- 사이드바 메뉴
- 탭 버튼
- 주간일정 항목
```

비적용:

```text
- 단순 숫자 통계
- 읽기 전용 설명 박스
- 클릭 동작이 없는 정보 카드
- label / badge / 상태 텍스트
```

클릭 가능하지 않은 요소에 hover를 주면 사용자가 누를 수 있다고 오해한다.

---

## 5. active와 hover 분리

active는 현재 위치 또는 현재 필터 상태를 뜻한다.  
hover는 마우스가 올라가 있다는 뜻이다.

둘을 섞지 않는다.

```text
hover:
- 순간 반응
- 마우스를 빼면 사라짐
- surface-2 / border / 약한 shadow

active:
- 현재 위치 표시
- 파란 배경 금지
- surface-2 또는 얇은 좌측선/텍스트 굵기 정도만 허용
```

AP MATH / EIE 버튼은 “현재 선택된 브랜드 탭”처럼 보이면 안 된다.  
둘 다 이동 카드다.

---

## 6. APMS 사이드바 기준

## 6-1. 기본 원칙

APMS 사이드바는 Academy OS의 아이콘 감각을 이식하되, APMS의 메뉴 구조와 권한 분리는 그대로 유지한다.

```text
- React 컴포넌트 복붙 금지
- APMS 바닐라 JS/CSS 구조로 재현
- 메뉴명 임의 변경 금지
- 기능명 임의 변경 금지
- 선생님 화면에 AP/EIE 이동 게이트 노출 금지
```

---

## 6-2. 아이콘 기준

Academy OS 사이드바 기준을 따른다.

```text
아이콘 크기:
- 펼친 메뉴: 18px
- 접힌 rail 또는 단독 아이콘: 20px

stroke:
- stroke-width: 1.8 전후
- stroke-linecap: round
- stroke-linejoin: round

스타일:
- outlined
- 단색
- 텍스트보다 튀지 않게
```

아이콘은 lucide/tabler 계열처럼 가벼운 outline 스타일을 사용한다.  
컬러 아이콘은 사용하지 않는다.

---

## 6-3. 사이드바 row 기준

기본:

```text
height: 36~40px
border-radius: 10~12px
background: transparent
color: var(--secondary)
```

hover:

```text
background: var(--surface-2)
color: var(--text)
```

active:

```text
background: var(--surface-2)
color: var(--text)
font-weight: 600 전후
파란 배경 금지
```

사이드바는 카드처럼 떠오르지 않는다.

---

## 6-4. APMS 메뉴 아이콘 매핑

기본 매핑은 다음을 우선한다.

```text
대시보드     layout-dashboard / home
출석부       calendar-check
시간표       calendar-clock
성적표       chart-bar / file-analytics
학생관리     users
클래스룸     school / presentation
리포트       file-text / report-analytics
아카이브     archive
설정/관리    settings
사용설명서   book-open / help-circle
로그아웃     log-out
```

메뉴명이 실제 코드와 다르면 기존 메뉴명을 우선한다.  
아이콘 이름은 구현 편의에 따라 대응되는 inline SVG로 치환할 수 있다.

---

## 7. EIE 사이드바 / 내비게이션 기준

EIE는 APMS와 같은 hover/active 감각을 사용한다.

단, 메뉴 구조는 절대 섞지 않는다.

```text
EIE 메뉴 후보:
- 대시보드: layout-dashboard
- 시간표: calendar-clock
- 학생관리: users
- 클래스룸: school
- 관리: settings
```

APMS 메뉴를 EIE에 넣지 않는다.  
EIE 메뉴를 APMS 선생님 화면에 넣지 않는다.

EIE가 상단 nav를 유지하더라도 hover/active 규칙은 동일하게 적용한다.  
좌측 사이드바로 전환하는 경우에도 APMS와 같은 아이콘 체계를 사용한다.

---

## 8. APMS 원장님 대시보드 기준

적용 대상:

```text
- AP MATH / EIE 이동 카드
- 출석부 / 시간표 / 성적표 / 관리
- 오늘 운영 카드
- 선생님 현황 카드
- 최근 상담 / 최근 등록 원생 row
```

기준:

```text
- 카드 기본 배경은 var(--surface)
- 작은 카드 배경은 var(--surface-2)
- hover에서만 위치감 표시
- 카드 크기는 하단 compact 카드 기준을 우선한다
- AP MATH / EIE를 파란 탭처럼 만들지 않는다
```

---

## 9. APMS 선생님 대시보드 기준

적용 대상:

```text
- 학급관리 전체 / 중등 / 고등 탭
- 학급관리 반 카드
- 오늘일지 카드
- 오늘일지 안의 작은 카드
- 주간일정 row
- 신입생 상담 row
```

기준:

```text
- 기존 학급관리 탭 감각을 기준으로 한다
- 학급관리 카드 hover 감각을 다른 카드에도 확장한다
- 오늘 수업요일 active는 파란 배경이 아니라 최소 표시만 한다
- 제출완료 파란 배경 금지
- 선생님 대시보드에는 AP MATH / EIE 게이트를 노출하지 않는다
```

---

## 10. EIE 화면 기준

적용 대상:

```text
- EIE 대시보드 카드
- 시간표 셀
- 학생 목록 row
- 학생 상세 정보 카드
- 클래스룸 수업 카드
- 관리 화면 카드
```

기준:

```text
- APMS와 같은 surface/hover 규칙 사용
- 시간표 셀은 작은 카드 또는 row 수준의 hover만 사용
- 학생 목록 row는 둥근 배경 hover
- 클래스룸은 선생님 화면처럼 카드 + 원터치 감각 유지
- 전화번호/민감정보는 목록 또는 시간표 셀에 과노출하지 않는다
```

---

## 11. 구현 파일 기준

APMS 쪽 주요 파일:

```text
apmath/js/ui.js
apmath/js/core.js
apmath/js/dashboard.js
apmath/js/dashboard-admin.js
apmath/js/dashboard-teacher.js
apmath/css/sidebar-foundation.css
apmath/css/dashboard-foundation.css
apmath/css/apms-ui-foundation.css
apmath/css/apms-theme-override.css
```

EIE 쪽 주요 파일:

```text
eie/index.html
eie/css/eie.css
eie/js/eie-app.js
eie/js/eie-router.js
eie/js/eie-state.js
eie/js/views/*.js
```

Academy OS 참조 파일:

```text
web-react/src/components/Sidebar.jsx
web-react/src/components/Layout.jsx
web-react/src/config/menuRegistry.js
web-react/src/config/routeRegistry.js
web-react/src/styles 또는 실제 CSS 엔트리
```

Academy OS 코드는 참조만 한다.  
APMS/EIE에 React 구조를 직접 붙이지 않는다.


---

## 11-1. 유지보수성 기준

시각 보정은 누적 패치로 덮어쓰기만 하지 않는다.

기본 원칙:

```text
- 위치/열림/닫힘 보존용 CSS는 hard-lock 영역에 둔다.
- 색감/hover/active/아이콘 보정은 visual layer 영역에 둔다.
- 시각 보정용 !important는 최소화한다.
- inline style로 카드/hover 스타일을 추가하지 않는다.
- 반복되는 inline style은 의미 class로 승격한다.
```

권장 class:

```text
.ap-surface-toolbar
.ap-surface-toolbar--two / --three / --four
.ap-surface-action
.ap-surface-action--current
```

EIE 라우팅 버튼은 HTML inline onclick이 아니라 라우터의 delegated handler로 처리한다.
---

## 12. 외부감사 체크리스트

UI 대수술 검수자는 다음을 반드시 확인한다.

```text
1. 기본 상태부터 파란 카드처럼 보이는 요소가 없는가?
2. hover에서만 “내가 여기 있어요” 느낌이 나는가?
3. 큰 카드 / 작은 카드 / row hover 강도가 구분되는가?
4. 카드 안 카드가 부모 카드보다 더 튀지 않는가?
5. 사이드바 hover는 둥근 연한 배경만 쓰는가?
6. active가 파란 배경이 아니라 현재 위치 표시 정도인가?
7. ACA 아이콘 감각이 APMS/EIE에 맞게 이식됐는가?
8. APMS 선생님 화면에 AP/EIE 이동 버튼이나 문자열이 없는가?
9. APMS와 EIE 메뉴 구조가 섞이지 않았는가?
10. 기존 메뉴명/기능명이 임의 변경되지 않았는가?
11. 클릭 불가능한 정보 박스에 hover가 들어가지 않았는가?
12. 모바일에서 hover 전제만으로 기능 인지가 깨지지 않는가?
```

---

## 13. 금지 패턴

```text
- 파란 active 카드
- 파란 active 사이드바
- AP MATH / EIE만 파란 탭처럼 강조
- 카드 전체를 hover가 아니라 기본 상태에서 색칠
- 작은 카드가 큰 카드보다 더 강하게 떠오름
- 사이드바 메뉴가 카드처럼 붕 뜸
- 아이콘을 컬러풀하게 사용
- 선생님 화면에 EIE/AP MATH 게이트 노출
- APMS와 EIE 메뉴 혼합
- React 컴포넌트 직접 복붙
```

---

## 14. 최종 기준 문장

```text
APMS/EIE의 기본 화면은 조용해야 한다.
클릭 가능한 요소는 hover에서만 살아나야 한다.
파란색은 active 배경이 아니라 최소한의 표면 구분에만 쓴다.
큰 카드는 움직임으로, 작은 카드는 색감과 border로, row는 둥근 배경으로 반응한다.
사이드바는 Academy OS 아이콘 감각을 따르되 APMS/EIE 구조와 권한을 절대 섞지 않는다.
```

---

## 15. 변경 로그

```text
2026-05-29 v1.0
- APMS/EIE 전용 카드 surface / sidebar / icon / hover 기준 작성
- Academy OS Sidebar 감각 이식 기준 정리
- APMS 선생님 화면 AP/EIE 노출 금지 재고정
- 큰 카드 / 작은 카드 / row hover 계층화 기준 고정

2026-05-29 v1.1
- hard-lock CSS와 visual layer CSS 분리 기준 추가
- 시각 보정용 !important 최소화 기준 추가
- 반복 inline style을 의미 class로 승격하는 기준 추가
- EIE route button inline onclick 금지 및 delegated handler 기준 추가
```
