# AP MATH 원장 대시보드 리디자인 재작업 지시서

## 0. 현재 화면 판정

현재 적용된 원장 대시보드 풀화면/7:3 시안은 실패다.

실패 이유:

* AP MATH / EIE 버튼이 얇고 길게 늘어진 줄처럼 보인다.
* 출석부 / 시간표 / 성적표 / 관리 버튼도 핵심 업무 버튼이 아니라 긴 입력칸처럼 보인다.
* 풀화면을 썼지만 버튼과 카드의 상하 높이가 부족해 빈 화면처럼 보인다.
* 카드 사이 간격이 줄마다 다르고 정돈감이 없다.
* 상단 버튼 영역과 본문 영역의 위계가 약하다.
* 오늘 운영 버튼이 우측에 들어간 것은 맞지만 1줄 4칸이라 너무 약하다.
* 좌측 선생님 현황과 우측 오늘 운영의 시작 높이 정렬이 중요하다.
* 원장 대시보드에 “일지 작성” 버튼이 남아 있다.

이번 작업은 현재 시안을 보정하는 수준이 아니라, 원장 대시보드 상단과 본문 레이아웃을 다시 정리한다.

---

## 1. 최종 목표

원장님 대시보드를 풀화면 운영 대시보드로 재구성한다.

구조 목표:

1. 상단 전체폭 Command Card

   * AP MATH / EIE
   * 출석부 / 시간표 / 성적표 / 관리

2. 본문 7:3 레이아웃

   * 좌측 7: 선생님 현황, 최근 상담
   * 우측 3: 오늘 운영, 최근 등록 원생, 확인 필요, 주간일정, 검색창

3. 오늘 운영

   * 재원 / 최근등록 / 퇴원 / 시험지 보관함
   * 우측 3컬럼 첫 카드
   * 2x2 운영 카드 형태

4. 모든 카드 간격 통일

   * 개별 margin 금지
   * 부모 grid/flex의 gap 토큰으로만 간격 제어

5. 원장 대시보드의 “일지 작성” 버튼 제거

   * CSS 숨김 금지
   * 렌더 단계에서 버튼 자체 제거
   * 선생님 대시보드 일지 작성 기능은 유지

---

## 2. 수정 대상

우선 수정 대상:

* `apmath/js/dashboard.js`
* `apmath/css/dashboard-foundation.css`

확인만 할 파일:

* `apmath/js/dashboard-admin.js`
* `apmath/css/apms-ui-foundation.css`
* `apmath/css/apms-theme-override.css`

EIE 파일은 이번 라운드에서 수정하지 않는다.

EIE 후속 작업은 별도로 진행한다.
단, AP MATH / EIE 버튼의 이동 기능은 반드시 유지한다.

---

## 3. 절대 금지

* EIE 파일 수정 금지
* API/DB 변경 금지
* 데이터 구조 변경 금지
* 라우팅 변경 금지
* 버튼 onclick 변경 금지
* 섹션 삭제 금지
* 새 기능 추가 금지
* 모달 수정 금지
* 원장 선생님 카드 클릭 기능 부활 금지
* 선생님 대시보드 구조 변경 금지
* 저장소 루트에 검수/패치/백업 산출물 생성 금지
* 임시 파일은 OS temp 또는 `../AI_CENTER/ROUNDS` 하위만 허용
* 최종 git 변경사항에는 원본 수정 파일만 남길 것

---

## 4. 허용 범위

이번 작업은 CSS-only가 아니다.

허용:

* 원장 대시보드 render 단계에서 표시용 wrapper 추가
* 기존 섹션을 Command Card / main / side로 감싸기
* 기존 dashboard.js 런타임 style의 `max-width:850px`, `margin:0 auto` 제거 또는 완화
* 원장 대시보드 전용 class 추가
* 원장 대시보드에서만 “일지 작성” 버튼 렌더 제거

단, 기존 데이터, 버튼 기능, onclick, API 호출, 섹션 내용은 바꾸지 않는다.

---

## 5. AP MATH / EIE 연결 관련 주의

조사 결과:

* AP MATH의 EIE 버튼은 `location.replace('../eie/index.html#dashboard')`로 별도 EIE 앱으로 이동한다.
* EIE는 별도 JS/CSS를 사용한다.
* AP MATH의 `dashboard-foundation.css`는 EIE에 직접 영향을 주지 않는다.
* `AP MATH / EIE` 게이트는 `dashboard-admin.js`의 `apInsertAdminSystemGate()`가 `#ap-admin-dashboard` 첫 자식으로 삽입한다.

따라서 이번 작업에서는 AP MATH만 수정한다.

주의:

* `AP MATH / EIE` 게이트 삽입 로직은 수정하지 않는다.
* 새 wrapper는 게이트 아래에 위치해야 한다.
* AP MATH / EIE 버튼은 최상단 Command Card 영역과 시각적으로 이어져야 한다.
* EIE 버튼 클릭 이동은 유지한다.

---

## 6. 레이아웃 구조

원장 대시보드는 다음 구조가 되도록 정리한다.

```html
<div id="ap-admin-dashboard" class="ap-admin-dashboard">
  <!-- AP MATH / EIE 게이트는 dashboard-admin.js가 첫 자식으로 삽입 -->

  <section class="ap-admin-command-card">
    <div class="ap-admin-work-nav">
      <!-- 출석부 / 시간표 / 성적표 / 관리 -->
    </div>
  </section>

  <section class="ap-admin-dashboard__layout">
    <main class="ap-admin-dashboard__main">
      <!-- 선생님 현황 -->
      <!-- 최근 상담 -->
    </main>

    <aside class="ap-admin-dashboard__side">
      <!-- 오늘 운영: 재원 / 최근등록 / 퇴원 / 시험지 보관함 -->
      <!-- 최근 등록 원생 -->
      <!-- 확인 필요 -->
      <!-- 주간일정 -->
      <!-- 검색창 -->
    </aside>
  </section>
</div>
```

주의:

* AP MATH / EIE 게이트를 중복 렌더하지 않는다.
* 출석부 / 시간표 / 성적표 / 관리는 전체폭 Command Card 안에 둔다.
* 재원 / 최근등록 / 퇴원 / 시험지 보관함은 상단에서 빼고 우측 3컬럼 첫 카드로 이동한다.
* 선생님 현황과 오늘 운영은 같은 y축에서 시작해야 한다.

---

## 7. 상단 Command Card 디자인

현재처럼 얇고 긴 줄 버튼은 금지한다.

상단 핵심 영역은 “줄”이 아니라 “업무 Command Card”처럼 보여야 한다.

### 7-1. AP MATH / EIE

* 전체폭 2분할
* min-height: 56~64px
* 현재 선택 앱이 명확히 보이게 처리
* 얇은 막대 버튼 금지
* 버튼 사이 간격은 gap 토큰 사용

### 7-2. 출석부 / 시간표 / 성적표 / 관리

* 전체폭 4분할
* min-height: 68~76px
* 원장님 핵심 업무 카드처럼 보여야 함
* font-size: 15px 내외
* font-weight: 700
* border-radius: 10~12px
* 긴 input 같은 얇은 버튼 모양 금지

---

## 8. 오늘 운영 카드

`재원 / 최근등록 / 퇴원 / 시험지 보관함`은 우측 3컬럼 첫 카드로 이동한다.

현재처럼 1줄 4칸 금지.

2x2 운영 카드로 만든다.

```text
오늘 운영
┌────────────┬────────────┐
│ 재원        │ 최근등록     │
├────────────┼────────────┤
│ 퇴원        │ 시험지 보관함 │
└────────────┴────────────┘
```

기준:

* 2컬럼 grid
* 각 버튼 min-height: 60~64px
* font-size: 13~14px
* font-weight: 700
* gap 토큰 사용
* 우측 컬럼 폭 안에서 안정적으로 보여야 함

---

## 9. 카드 간격 통일

이번 작업에서 가장 중요한 기준 중 하나다.

현재 문제:

* AP MATH / EIE 버튼 사이 간격
* 출석부 / 시간표 / 성적표 / 관리 버튼 사이 간격
* 선생님 카드 사이 간격
* 좌측 7컬럼과 우측 3컬럼 사이 간격
* 우측 카드 stack 사이 간격
* 최근 상담 row 사이 간격

위 간격들이 서로 달라 화면이 정돈되어 보이지 않는다.

수정 기준:

1. 카드 사이 간격은 개별 margin으로 만들지 않는다.
2. 모든 카드/섹션 간격은 부모 grid/flex의 `gap`으로만 만든다.
3. 카드 자체에는 margin을 주지 않는다.
4. 기존 inline `margin-top`, `margin-bottom`, `margin-left`, `margin-right`가 간격을 만들고 있으면 제거하거나 상위 gap으로 이관한다.
5. `justify-content: space-between`으로 카드 사이를 억지로 벌리는 방식 금지.
6. grid column width와 gap을 명확히 지정한다.

간격 토큰 기준:

```css
:root {
  --ap-admin-page-pad: 32px;
  --ap-admin-section-gap: 24px;
  --ap-admin-card-gap: 16px;
  --ap-admin-row-gap: 12px;
}
```

적용 기준:

* 페이지 좌우 padding: 32px
* 큰 섹션 사이: 24px
* 카드 사이: 16px
* 카드 내부 row 사이: 12px

---

## 10. CSS 기준 예시

실제 class명은 코드에 맞춰 적용한다.

```css
body #ap-admin-dashboard {
  width: 100%;
  max-width: none;
  margin: 0;
  padding: 0 var(--ap-admin-page-pad) 32px;
  box-sizing: border-box;
}

body #ap-admin-dashboard .ap-admin-command-card {
  display: grid;
  gap: var(--ap-admin-card-gap);
  margin-bottom: var(--ap-admin-section-gap);
}

body #ap-admin-dashboard .owner-brand-tabs,
body #ap-admin-dashboard .ap-admin-work-nav {
  display: grid;
  gap: var(--ap-admin-card-gap);
}

body #ap-admin-dashboard .owner-brand-tabs {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

body #ap-admin-dashboard .ap-admin-work-nav {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

body #ap-admin-dashboard .owner-brand-tab {
  min-height: 60px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
}

body #ap-admin-dashboard .ap-admin-work-nav .btn,
body #ap-admin-dashboard .ap-admin-work-nav button {
  min-height: 72px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
}

body #ap-admin-dashboard .ap-admin-dashboard__layout {
  display: grid;
  grid-template-columns: minmax(0, 7fr) minmax(340px, 3fr);
  gap: var(--ap-admin-section-gap);
  align-items: start;
}

body #ap-admin-dashboard .ap-admin-dashboard__main,
body #ap-admin-dashboard .ap-admin-dashboard__side {
  min-width: 0;
  display: grid;
  gap: var(--ap-admin-section-gap);
}

body #ap-admin-dashboard .ap-admin-teacher-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--ap-admin-card-gap);
}

body #ap-admin-dashboard .ap-admin-ops-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--ap-admin-card-gap);
}

body #ap-admin-dashboard .ap-admin-ops-grid button,
body #ap-admin-dashboard .ap-admin-ops-grid .btn {
  min-height: 64px;
  border-radius: 10px;
  font-weight: 700;
}
```

모바일:

```css
@media (max-width: 1199px) {
  body #ap-admin-dashboard {
    padding-left: 16px;
    padding-right: 16px;
  }

  body #ap-admin-dashboard .ap-admin-dashboard__layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  body #ap-admin-dashboard {
    padding-left: 12px;
    padding-right: 12px;
  }

  body #ap-admin-dashboard .ap-admin-work-nav {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  body #ap-admin-dashboard .ap-admin-work-nav .btn,
  body #ap-admin-dashboard .ap-admin-work-nav button {
    min-height: 56px;
  }

  body #ap-admin-dashboard .owner-brand-tab {
    min-height: 52px;
  }

  body #ap-admin-dashboard .ap-admin-ops-grid button,
  body #ap-admin-dashboard .ap-admin-ops-grid .btn {
    min-height: 56px;
  }
}
```

---

## 11. 원장 대시보드 “일지 작성” 버튼 제거

현재 원장 대시보드 선생님 현황 카드에 “일지 작성” 버튼이 보인다.

원장님 화면은 확인 화면이지 선생님 대신 일지를 작성하는 화면이 아니다.

수정 기준:

* 원장 대시보드에서는 “일지 작성” 버튼을 렌더링하지 않는다.
* CSS `display:none`으로 숨기지 않는다.
* HTML 생성 단계에서 버튼 자체를 만들지 않는다.
* 미작성 상태는 `미작성` 배지로만 표시한다.
* 선생님 본인 대시보드의 일지 작성 기능은 유지한다.

FAIL 조건:

* 원장 대시보드에 “일지 작성” 버튼이 하나라도 보이면 FAIL
* 원장님이 선생님 일지 작성 화면으로 진입할 수 있으면 FAIL
* 선생님 대시보드의 본인 일지 작성 기능이 사라지면 FAIL

---

## 12. 최근 상담

최근 상담은 좌측 7컬럼에 둔다.

기준:

* 최근 상담 row는 카드 폭을 안정적으로 사용한다.
* 긴 상담 텍스트는 2줄 말줄임 유지
* 클릭 확장 기능 추가 금지
* 상담 데이터/내용 변경 금지

---

## 13. 최근 등록 원생 / 확인 필요 / 주간일정 / 검색

이 네 영역은 우측 3컬럼에 둔다.

우측 컬럼은 운영 보조 패널 역할이다.

기준:

* 카드 stack 간격은 `--ap-admin-section-gap`
* 내부 row 간격은 `--ap-admin-row-gap`
* 카드 사이 margin 금지
* 검색창은 우측 stack 마지막에 둔다.
* 우측 컬럼이 너무 좁아지면 1199px 이하에서는 1열로 전환한다.

---

## 14. 카드 톤

최근 수정한 선생님 대시보드 톤을 따른다.

기준:

* 일반 카드 radius: 6px
* shadow: none
* border: 연한 1px
* background: 기존 theme surface 유지
* 구분감은 그림자보다 border 색, 배경 톤, 간격으로 만든다.

단, 상단 Command Card 버튼은 일반 카드보다 살짝 크게 둥글게 해도 된다.

* command button radius: 10~12px
* 일반 카드 radius: 6px

---

## 15. 검증

필수:

```bash
node --check apmath/js/dashboard.js
node --check apmath/js/dashboard-admin.js
node --check apmath/js/ui.js
```

브라우저 확인:

1. 원장 계정 로그인
2. AP MATH / EIE가 최상단에서 카드형 2분할로 보이는지 확인
3. 출석부 / 시간표 / 성적표 / 관리가 얇은 줄이 아니라 두꺼운 업무 카드처럼 보이는지 확인
4. 카드 사이 간격이 모든 줄에서 일정한지 확인
5. 선생님 현황과 오늘 운영이 같은 y축에서 시작하는지 확인
6. 오늘 운영이 우측 첫 카드이며 2x2로 보이는지 확인
7. 좌측 7컬럼에 선생님 현황과 최근 상담이 있는지 확인
8. 우측 3컬럼에 오늘 운영, 최근 등록 원생, 확인 필요, 주간일정, 검색창이 있는지 확인
9. 원장 대시보드에 “일지 작성” 버튼이 사라졌는지 확인
10. 선생님 대시보드의 일지 작성 기능은 유지되는지 확인
11. EIE 버튼 클릭 시 `../eie/index.html#dashboard` 이동이 유지되는지 확인
12. 모바일 390px에서 가로 스크롤이 없는지 확인
13. 모바일에서 핵심 버튼이 너무 작아지지 않는지 확인

---

## 16. FAIL 조건

아래 중 하나라도 해당하면 FAIL이다.

* AP MATH / EIE가 얇고 긴 줄처럼 보이면 FAIL
* 출석부 / 시간표 / 성적표 / 관리가 얇고 긴 줄처럼 보이면 FAIL
* 카드 사이 간격이 줄마다 다르면 FAIL
* margin으로 카드 사이 간격을 만들었으면 FAIL
* `space-between`으로 버튼 간격을 억지로 벌렸으면 FAIL
* 오늘 운영이 1줄 4칸이면 FAIL
* 선생님 현황과 오늘 운영의 시작 y축이 맞지 않으면 FAIL
* 원장 대시보드에 “일지 작성” 버튼이 남아 있으면 FAIL
* 선생님 대시보드 일지 작성 기능이 사라지면 FAIL
* EIE 파일이 수정되면 FAIL
* 저장소 루트에 검수/패치/백업 산출물이 생기면 FAIL

---

## 17. 보고 형식

작업 후 아래 형식으로 보고한다.

* 실제 수정 파일 목록
* dashboard.js에서 감싼 섹션 목록
* 새로 추가한 wrapper/class 목록
* AP MATH / EIE 게이트 영향 여부
* Command Card 적용 결과
* 본문 7:3 적용 결과
* 오늘 운영 2x2 적용 결과
* 카드 gap 통일 방식
* 일지 작성 버튼 제거 여부
* 선생님 대시보드 영향 여부
* EIE 영향 여부
* PC 실화면 확인 결과
* 모바일 390px 확인 결과
* node --check 결과
* git 변경 파일 목록
