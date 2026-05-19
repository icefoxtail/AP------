```txt
cat > CODEX_TASK.md <<'EOF'
# CODEX_TASK.md — v2 React UI 한글화 + Apple Style UX 보정

/goal `config-academy-os-v2/web-react/`의 React/Vite UI를 사용자 실사용 기준으로 보정하라. 이번 작업은 새 기능 대형 추가가 아니라, 현재 동작 중인 React UI를 한국어 운영 문구와 Apple style UX로 다듬는 작업이다. 기존 Worker/API/D1 구조는 건드리지 않는다. 기존 `web/` 바닐라 UI는 reference로 보존한다.

## 0. 현재 상태

현재 `config-academy-os-v2/web-react/`는 React/Vite 전환 1차가 완료되어 있고, `npm install`, `npm run build`, `npm run dev`가 통과했다.

현재 화면은 React 앱으로 정상 표시되지만 다음 보정이 필요하다.

- 사용자에게 보이는 일부 문구가 영어 또는 코드성 표현으로 남아 있음
- 사이드바 아이콘이 D/S/C/A/N/B/P/M/G 같은 알파벳으로 표시됨
- 대시보드 카드가 다소 평면적으로 보임
- 오늘 출결 현황 내부가 card-in-card처럼 보임
- 학원명/부제 표시가 자연스럽지 않음
- 현장 학원 운영 용어 기준으로 문구 정리가 필요함
- 사이드바는 이모지 대신 Lucide React 선 아이콘으로 정돈한다.

이번 작업 목표는 다음이다.

1. 사용자 노출 문구 한국어화
2. 학원 실무 용어 적용
3. 사이드바 Lucide React 아이콘/메뉴 문구 정리
4. 대시보드 카드 UX 보정
5. Apple style 카드/여백/active 상태 보정
6. 기존 React 기능 동작 보존
7. build 통과

## 1. 절대 금지

- `apmath/` 수정 금지
- `archive/` 수정 금지
- 기존 AP Math OS 운영 파일 수정 금지
- 기존 운영 schema/migration 수정 금지
- `config-academy-os-v2/worker/` 수정 금지
- `config-academy-os-v2/web/` 삭제 금지
- `config-academy-os-v2/web/` 대규모 수정 금지
- D1 remote apply/execute 금지
- Cloudflare deploy 금지
- Wrangler deploy/publish 금지
- R2 작업 금지
- git add/commit/push 금지
- 결제/문자/알림톡/OpenAI/Gemini 실연동 금지

작업 범위는 `config-academy-os-v2/web-react/` 내부로 제한한다.
필요 시 `config-academy-os-v2/CODEX_RESULT.md` 또는 `config-academy-os-v2/web-react/CODEX_RESULT.md`만 보고용으로 수정한다.

## 2. 사용자 노출 문구 기준

코드 내부 변수명/API field/DB column은 영어 유지 가능하다.

사용자에게 보이는 UI 문구는 한국어로 통일한다.

허용:
- 코드 내부: students, classes, attendance, billing 등 영어 가능
- API path: 영어 유지
- DB column: 영어 유지
- 개발 문서: 영어 일부 가능

금지:
- 실제 화면에 `Supplementary academy`, `Students`, `Classes`, `Search`, `Save`, `Cancel`, `Delete`, `Edit`, `New`, `Submit` 같은 영어 노출
- 사이드바에 D/S/C/A/N/B/P/M/G 알파벳 아이콘 노출
- 사용자 화면에 코드값 active/inactive/unpaid/paid 그대로 노출
- OS별 렌더링이 지저분할 수 있는 이모지 사이드바 아이콘 노출

## 3. 사이드바 메뉴 문구/아이콘 확정

사이드바 메뉴는 Lucide React 아이콘으로 정리한다.

이모지 아이콘은 사용하지 않는다.
D/S/C/A/N/B/P/M/G 같은 영어 알파벳 아이콘도 사용하지 않는다.
OS마다 렌더링이 달라 보이는 이모지 대신 `lucide-react`를 사용한다.

필수 설치:

npm install lucide-react

`config-academy-os-v2/web-react/package.json` dependencies에 `lucide-react`를 추가한다.

사이드바 메뉴는 아래 기준으로 바꾼다.

| page key | 화면 문구 | Lucide icon |
|---|---|---|
| dashboard | 대시보드 | LayoutDashboard |
| students | 학생 관리 | Users |
| classes | 반 관리 | BookOpen |
| attendance | 출결 관리 | ClipboardCheck |
| consultations | 상담 | MessageSquare |
| billing | 수납 관리 | CreditCard |
| parents | 학부모 | Heart |
| modules | 모듈 설정 | Puzzle |
| settings | 설정 | Settings |

`Sidebar.jsx`에는 아래 방식으로 적용한다.

import {
  LayoutDashboard,
  Users,
  BookOpen,
  ClipboardCheck,
  MessageSquare,
  CreditCard,
  Heart,
  Puzzle,
  Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard, section: '메인' },
  { id: 'students', label: '학생 관리', icon: Users, section: '학생 관리' },
  { id: 'classes', label: '반 관리', icon: BookOpen, section: '학생 관리' },
  { id: 'attendance', label: '출결 관리', icon: ClipboardCheck, section: '학생 관리' },
  { id: 'consultations', label: '상담', icon: MessageSquare, section: '운영' },
  { id: 'billing', label: '수납 관리', icon: CreditCard, section: '운영' },
  { id: 'parents', label: '학부모', icon: Heart, section: '운영' },
  { id: 'modules', label: '모듈 설정', icon: Puzzle, section: '설정' },
  { id: 'settings', label: '설정', icon: Settings, section: '설정' },
];

렌더링 기준:

const Icon = item.icon;

<span className="nav-icon">
  <Icon size={18} strokeWidth={1.8} />
</span>

주의:
- `consult`가 아니라 기존 page key인 `consultations`를 사용한다.
- `strokeWidth={1.8}`을 적용한다.
- icon size는 18로 고정한다.
- 아이콘은 텍스트보다 튀지 않게 정돈된 sidebar icon 느낌으로 맞춘다.
- 전체 톤은 ChatGPT/Claude 사이드바처럼 얇고 깔끔한 선 아이콘 느낌으로 맞춘다.

CSS는 아래 기준으로 보정한다.

.nav-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  flex-shrink: 0;
}

.nav-icon svg {
  display: block;
}

.sidebar-nav-item {
  min-height: 38px;
  align-items: center;
}

.sidebar-nav-item.active .nav-icon {
  color: var(--color-accent);
}

기존 `.nav-icon`에 있던 font-size, font-weight, letter-spacing, 알파벳 badge용 배경 스타일은 제거한다.
active 아이콘을 파란 박스로 감싸지 말고, Lucide 선 아이콘 자체가 accent color로 보이게 한다.

사이드바 상단:

- 학원명: 온보딩 입력값 또는 academy.name 표시
- 부제: 템플릿명 한글화 또는 숨김
- `Supplementary academy` 같은 영어 문구 제거

템플릿명 후보:

| code/key | 화면 표시 |
|---|---|
| math / middle_high_math / apmath | 수학 전문 학원 |
| general / tutoring | 종합 학원 |
| english | 영어 전문 학원 |
| elementary | 초등 전문 학원 |

부제를 안정적으로 표시하기 어렵다면 부제는 숨겨도 된다.
사용자가 보는 첫 줄 학원명이 가장 중요하다.

## 4. 대시보드 요약 카드 문구 확정

대시보드 상단 카드 문구를 아래처럼 정리한다.

| 기존 의미 | 표시 문구 | 보조 문구 |
|---|---|---|
| student count | 전체 학생 | 등록 인원 |
| teacher count | 강사 | 재직 강사 |
| class count | 개설 반 | 운영 중 |
| today attendance | 오늘 출결 | 입력 건수 |

숫자와 카드 구조는 유지하되, 사용자 화면에는 위 문구를 적용한다.

## 5. 출결 상태값 표시 기준

코드값은 유지한다.

| 코드값 | 화면 표시 |
|---|---|
| present | 출석 |
| late | 지각 |
| absent | 결석 |
| early | 조퇴 |

대시보드/출결 화면/배지/버튼에서 코드값이 그대로 노출되지 않게 한다.

## 6. 학생 관련 문구 기준

학생 화면에서 아래 문구를 우선 적용한다.

| 의미 | 표시 문구 |
|---|---|
| 등록일 | 등록일 |
| school_name | 학교 |
| grade | 학년 |
| phone | 연락처 |
| parent_phone | 보호자 연락처 |
| memo | 특이사항 |
| class_names | 수강 반 |
| active | 재원 |
| inactive | 퇴원 |

학생 목록 컬럼 추천:

- 이름
- 학년
- 수강 반
- 보호자 연락처
- 등록일

학생 상세/수정 모달 필드:

- 이름
- 학년
- 학교
- 연락처
- 보호자 연락처
- 특이사항

## 7. 수납 관련 문구 기준

수납 화면 문구를 아래 기준으로 정리한다.

| 의미 | 표시 문구 |
|---|---|
| billing | 수납 |
| invoice | 청구서 |
| paid | 납부 완료 |
| unpaid | 미납 |
| partial | 부분 납부 |
| cancelled | 취소 |
| paid_date | 납부일 |
| amount | 원비 |
| method | 납부 방법 |
| card | 카드 |
| bank_transfer | 계좌이체 |
| cash | 현금 |

수납 목록 컬럼 추천:

- 학생
- 청구 항목
- 원비
- 납부기한
- 상태

수납 추가 버튼 문구:

- 수납 추가

청구 템플릿 버튼 문구:

- 청구 항목 추가

## 8. 상담 관련 문구 기준

상담 화면 문구를 아래 기준으로 정리한다.

| 의미 | 표시 문구 |
|---|---|
| consultation | 상담 |
| consultation type | 상담 유형 |
| admission | 입학 상담 |
| study | 학습 상담 |
| withdrawal | 퇴원 상담 |
| etc | 기타 |
| counselor | 담당 강사 |
| scheduled | 예정 |
| completed | 완료 |
| cancelled | 취소 |
| content | 상담 내용 |

상담 화면이 아직 목록 중심이면 최소한 화면 제목/empty state/상태값만 한국어화한다.

## 9. 학부모 관련 문구 기준

학부모 화면 문구를 아래 기준으로 정리한다.

- 학부모
- 보호자 연락처
- 관계
- 이름
- 연락처
- 수신 동의
- 메시지 로그
- 실제 발송 아님
- 수동 기록

`manual`, `sms`, `kakao` 같은 채널 값은 화면에서 다음처럼 표시한다.

| 코드값 | 화면 표시 |
|---|---|
| manual | 수동 기록 |
| sms | 문자 |
| kakao | 알림톡 |

단, 실제 문자/알림톡 발송 기능은 구현하지 않는다.

## 10. 공통 액션 버튼 문구

아래 영어가 화면에 남지 않게 한다.

| 영어 | 한국어 |
|---|---|
| Save | 저장 |
| Cancel | 취소 |
| Delete | 삭제 |
| Edit | 수정 |
| Add / New | 추가 |
| Search | 검색 |
| Confirm | 확인 |
| Close | 닫기 |
| Submit | 제출 |
| Reset | 초기화 |
| Logout | 로그아웃 |

단, 현재 버튼이 실제로 세션 초기화라면 `초기화` 유지 가능하다.
로그아웃 동작이면 `로그아웃`으로 표시한다.

## 11. Empty State 문구

각 화면 빈 상태 문구를 아래 기준으로 정리한다.

| 화면 | 타이틀 | 설명 |
|---|---|---|
| 학생 | 등록된 학생이 없습니다 | 학생을 추가해 관리를 시작하세요. |
| 반 | 개설된 반이 없습니다 | 반을 만들어 학생을 배정해보세요. |
| 출결 | 출결 기록이 없습니다 | 오늘 출결을 입력해보세요. |
| 상담 | 오늘 상담이 없습니다 | 상담 일정이 생기면 여기에 표시됩니다. |
| 수납 | 수납 내역이 없습니다 | 수납 정보를 입력해보세요. |
| 학부모 | 등록된 연락처가 없습니다 | 보호자 연락처를 추가해보세요. |
| 모듈 | 설정된 모듈이 없습니다 | 필요한 기능을 켜서 운영 화면을 구성하세요. |

## 12. UI/UX 보정 5개

아래 CSS/컴포넌트 보정을 반드시 적용한다.

### 12.1 대시보드 내부 중첩 stat-card 제거

`오늘 출결 현황` 카드 안에 또 `.stat-card`가 들어가 card-in-card처럼 보이면 안 된다.

내부 출결 현황은 border 없는 flat card 또는 compact grid로 표시한다.

CSS 예시:

.stat-card-flat {
  padding: var(--spacing-4);
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  border: none;
}

.stat-card-flat .stat-value {
  font-size: 28px;
}

Dashboard 컴포넌트에서 오늘 출결 현황 내부는 `.stat-card` 대신 `.stat-card-flat` 또는 동등한 구조를 사용한다.

### 12.2 card shadow 추가

기본 `.card`에 shadow를 추가한다.

.card {
  box-shadow: var(--shadow-sm);
}

기존 border는 유지한다.

### 12.3 출결 stat 색상 포인트

출석/지각/결석/조퇴 또는 출석/지각/결석/미입력 카드에 색상 포인트를 준다.

CSS 예시:

.stat-card[data-color="green"],
.stat-card-flat[data-color="green"] {
  border-left: 3px solid var(--color-success);
}

.stat-card[data-color="orange"],
.stat-card-flat[data-color="orange"] {
  border-left: 3px solid var(--color-warning);
}

.stat-card[data-color="red"],
.stat-card-flat[data-color="red"] {
  border-left: 3px solid var(--color-danger);
}

.stat-card[data-color="blue"],
.stat-card-flat[data-color="blue"] {
  border-left: 3px solid var(--color-accent);
}

React 컴포넌트에 `color` prop 또는 `data-color` 속성을 추가한다.

### 12.4 page-content 중앙 정렬

넓은 화면에서 content가 왼쪽으로 붙지 않도록 한다.

.page-content {
  margin: 0 auto;
}

기존 max-width는 유지한다.

### 12.5 sidebar active icon 스타일 개선

active 상태에서 Lucide 아이콘이 선명하게 보이도록 한다.

.sidebar-nav-item.active .nav-icon {
  color: var(--color-accent);
}

.active 상태에서 아이콘 배경 박스는 만들지 않는다.
텍스트와 아이콘이 함께 accent color로 보이는 정도로 정리한다.

## 13. React 파일 보정 대상

우선 확인/수정할 파일:

- `config-academy-os-v2/web-react/package.json`
- `config-academy-os-v2/web-react/src/styles/design-system.css`
- `config-academy-os-v2/web-react/src/App.jsx`
- `config-academy-os-v2/web-react/src/components/Sidebar.jsx`
- `config-academy-os-v2/web-react/src/components/Layout.jsx`
- `config-academy-os-v2/web-react/src/components/Card.jsx`
- `config-academy-os-v2/web-react/src/components/Badge.jsx`
- `config-academy-os-v2/web-react/src/pages/Dashboard.jsx`
- `config-academy-os-v2/web-react/src/pages/Students.jsx`
- `config-academy-os-v2/web-react/src/pages/Classes.jsx`
- `config-academy-os-v2/web-react/src/pages/Attendance.jsx`
- `config-academy-os-v2/web-react/src/pages/Billing.jsx`
- `config-academy-os-v2/web-react/src/pages/Parents.jsx`
- `config-academy-os-v2/web-react/src/pages/Consultations.jsx`
- `config-academy-os-v2/web-react/src/pages/Modules.jsx`
- `config-academy-os-v2/web-react/src/pages/Settings.jsx`
- `config-academy-os-v2/web-react/src/utils/constants.js`
- `config-academy-os-v2/web-react/src/utils/format.js`

파일명이 다르면 실제 구조에 맞춰 찾는다.

## 14. 기능 보존

이번 작업은 문구/UX 보정이다.
이미 동작하던 기능은 깨면 안 된다.

보존해야 할 흐름:

- 온보딩
- 대시보드
- 학생 목록/추가/수정/삭제
- 반 목록/추가/학생 배정
- 출결 날짜/반 선택/저장
- 수납 목록/추가/상태 변경
- 학부모 연락처/메시지 로그
- 상담 목록
- 모듈/설정
- API client
- localStorage token/academy_id
- Worker API 연결

## 15. 검증

가능한 범위에서 실행한다.

필수:

cd config-academy-os-v2\web-react
npm install
npm run build
npm run check

가능하면 dev 서버도 확인한다.

npm run dev

확인 항목:

- `http://127.0.0.1:5173/` 접근 가능
- 콘솔 에러 0
- 사이드바 메뉴 한국어 표시
- Lucide React 아이콘 표시
- 알파벳 아이콘 제거
- 이모지 사이드바 아이콘 없음
- 대시보드 카드 shadow 확인
- 오늘 출결 현황 card-in-card 제거
- 학생/반/출결/수납/학부모 화면 문구 한국어 확인

Worker가 켜져 있으면 API 연결까지 확인한다.
Worker가 꺼져 있으면 build/check까지만 하고 CODEX_RESULT에 기록한다.

## 16. CODEX_RESULT.md 작성

`config-academy-os-v2/web-react/CODEX_RESULT.md` 상단에 결과를 추가한다.
가능하면 `config-academy-os-v2/CODEX_RESULT.md`에도 요약만 추가한다.

필수 구조:

# CODEX_RESULT

## 2026-05-19 v2 React UI 한글화 및 UX 보정

### 1. 생성/수정 파일

### 2. 문구 보정 완료

- 사이드바
- 대시보드
- 학생
- 반
- 출결
- 수납
- 상담
- 학부모
- 모듈
- 설정
- empty state
- 공통 버튼

### 3. UI/UX 보정 완료

- Lucide React sidebar icon 적용
- card shadow
- page-content center align
- active nav icon
- dashboard nested stat 제거
- attendance stat color point

### 4. 기능 보존 확인

- 온보딩
- 학생
- 반
- 출결
- 수납
- 학부모
- 상담
- 모듈/설정

### 5. 실행 결과

- npm install
- npm run build
- npm run check
- npm run dev 또는 브라우저 확인

### 6. 남은 WARN/다음 조치

### 7. 보존 확인

- 기존 web/ 보존 여부
- worker/ 수정 여부
- apmath/ 수정 여부
- archive/ 수정 여부
- D1 remote 여부
- deploy 여부
- git 여부

## 17. 완료 기준

완료 기준:

- 사용자 노출 주요 문구 한국어화
- 사이드바 메뉴/아이콘 Lucide React로 정리
- 이모지/알파벳 사이드바 아이콘 제거
- 대시보드 카드 UX 보정
- 학생/반/출결/수납/학부모 화면 주요 문구 한국어
- npm install PASS
- npm run build PASS
- npm run check PASS
- 기존 기능 보존
- 기존 AP Math OS 미수정

부분 완료 시 완료라고 쓰지 말고 남은 항목을 WARN으로 적는다.

## 18. 최종 재독 지시

현재 프로젝트 루트의 CODEX_TASK.md를 다시 열어 처음부터 끝까지 읽고 그대로 실행하라. 이전 작업 결과로 대체하지 마라.
EOF
```
