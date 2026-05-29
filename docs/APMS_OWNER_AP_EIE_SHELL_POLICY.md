# APMS_OWNER_AP_EIE_SHELL_POLICY

작성일: 2026-05-29

---

## 1. 목적

원장(admin) 대시보드에서 AP MATH 화면과 EIE 화면이 같은 시각적 shell을 사용하도록 구조를 통일한다.

---

## 2. AP MATH 기준 구조

AP MATH 원장 대시보드(`renderAdminControlCenter`)는 다음 구조를 기준으로 삼는다.

```
#ap-admin-dashboard.owner-dashboard-shell
├─ owner-brand-tabs (AP MATH 현재 / EIE 이동)
├─ ap-admin-shortcuts (출석부·시간표·성적표·관리)
├─ 오늘 운영 개요 섹션
├─ 선생님 현황 섹션
├─ 최근 상담 섹션
├─ 신규 학생 섹션
├─ 집중 케어 섹션
└─ 주간일정 섹션
```

콘텐츠 폭: `max-width: 850px`  
카드 radius: `16px`  
카드 border: `1px solid var(--border)`  
폰트 무게: 본문 `500`, 카드 제목 `600`

---

## 3. EIE 렌더링 기준

EIE 대시보드는 `/eie/index.html`에서 별도 페이지로 렌더링된다.

EIE 대시보드(`EieDashboardView.render()`)는 `owner-dashboard-shell` 래퍼를 사용하여 AP MATH와 같은 콘텐츠 폭과 구조를 따른다.

```
eie-shell-main
└─ owner-dashboard-shell
   └─ eie-admin-home
      ├─ owner-brand-tabs (AP MATH 이동 / EIE 현재)
      ├─ eie-admin-action-grid (출석부·시간표·학생관리·관리)
      ├─ 오늘 운영 개요 섹션
      ├─ EIE 현황 섹션
      └─ 최근 등록 원생 섹션
```

---

## 4. 공통 owner shell CSS 클래스

| 클래스 | 정의 위치 | 역할 |
|--------|-----------|------|
| `.owner-dashboard-shell` | dashboard-foundation.css, eie.css | 콘텐츠 폭 850px, auto margin |
| `.owner-brand-tabs` | dashboard-foundation.css, eie.css | AP/EIE 선택 탭 컨테이너 (2열 grid) |
| `.owner-brand-tab` | dashboard-foundation.css, eie.css | 탭 버튼/링크 (44px height) |
| `.owner-brand-tab--current` | dashboard-foundation.css, eie.css | 현재 탭 (cursor:default) |
| `.owner-section-card` | dashboard-foundation.css, eie.css | 섹션 카드 (16px radius) |
| `.owner-stat-grid` | dashboard-foundation.css, eie.css | 4열 통계 그리드 |

---

## 5. AP/EIE 게이트 구조 (양쪽 동일)

```html
<!-- AP MATH 원장 화면에서 -->
<div class="owner-brand-tabs ap-admin-app-gate ...">
  <button class="owner-brand-tab owner-brand-tab--current ..." aria-current="page">AP MATH</button>
  <a class="owner-brand-tab ..." href="../eie/index.html#dashboard">EIE</a>
</div>

<!-- EIE 원장 화면에서 -->
<div class="owner-brand-tabs eie-admin-app-gate ...">
  <a class="owner-brand-tab ..." href="../apmath/index.html">AP MATH</a>
  <button class="owner-brand-tab owner-brand-tab--current ..." aria-current="page">EIE</button>
</div>
```

탭 높이: `44px`  
탭 border-radius: `12px`  
컨테이너 border-radius: `16px`  
active 상태: border + surface 배경 (파란 배경 사용 금지)

---

## 6. 선생님 화면에 브랜드 전환 UI 금지

`dashboard-teacher.js`에는 AP MATH/EIE 선택 탭이 없어야 한다.  
`apAdminDashboardRole()` 가 `'admin'`일 때만 `apInsertAdminSystemGate()`가 실행된다.

---

## 7. Unauthorized fallback 표시 정책

EIE API가 Unauthorized를 반환할 때:
- 데이터 오류를 `eie-dashboard-notice` 클래스 카드로 낮은 위계로 표시
- 레이아웃이 깨지지 않게 `renderNotice(data)` 로 안전하게 처리
- 빈 상태(`[]`)로 fallback → 통계 카드가 0으로 표시됨

---

## 8. CSS 변수 브리지

EIE `/eie/css/eie.css`에 APMS CSS 변수 앨리어스가 정의되어 있다:

```css
:root {
    --primary: var(--eie-primary);
    --surface: var(--eie-surface);
    --surface-2: var(--eie-surface-2);
    --border: var(--eie-border);
    --text: var(--eie-text);
    --secondary: var(--eie-muted);
    --bg: var(--eie-bg);
}
```

이를 통해 `owner-*` 공통 클래스가 `var(--border)` 등을 쓸 때 EIE 페이지에서도 올바른 값을 참조한다.
