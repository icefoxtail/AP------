# APMS Global UI Foundation Sidebar Bridge

## Academy OS 확인 결과

Academy OS sidebar는 icon + label row, section label, active/hover tone, role pill 구조를 사용한다. `Sidebar.jsx`, `Layout.jsx`, `Card.jsx`, `Button.jsx`, `Badge.jsx`, `menuRegistry.js`, `modes.js`, `design-system.css`를 읽어 확인했다.

## APMS 적용 방식

APMS sidebar는 이미 `sidebar-foundation.css` 작업 영역이 있으므로 이번 작업에서 `ui.js`나 sidebar 로직을 수정하지 않는다.

## 후속 연결 원칙

- icon + label row 구조는 유지하되 새 아이콘을 추가하지 않는다.
- section label은 조용한 11~12px meta tone으로 유지한다.
- active는 soft accent background와 text color만 사용한다.
- hover는 layout shift 없이 background만 바꾼다.

이번 작업은 sidebar 완료 상태를 global foundation 문서와 연결하는 계획까지만 다룬다.
