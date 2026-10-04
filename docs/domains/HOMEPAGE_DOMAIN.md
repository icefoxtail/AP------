# HOMEPAGE_DOMAIN

## A. 정책

- 왕지교육 홈페이지와 내부 운영 시스템을 분리한다.
- AP Math, 씨매쓰 초등, EIE 영어학원을 균형 있게 노출하되, 내부 AP Math 운영 기능을 외부 홈페이지에 직접 노출하지 않는다.

## B. 현재 구현 구조

- 확인된 후보: 루트 `index.html`, `robots.txt`
- 홈페이지 전용 Worker route/DB는 이번 1차 확인에서 특정하지 못했다.
- 기존 AP Math 운영 화면은 `apmath/index.html`로 분리되어 있다.

## C. 데이터/API 흐름

현재 확인 필요. 상담 예약/공지/로그인 방향은 계획으로만 취급한다.

## D. 회귀 위험

- 외부 홈페이지가 내부 운영 API/파일을 직접 노출
- AP Math만 과도하게 노출하거나 다른 학원 모듈 방향과 충돌
- 운영 login과 홈페이지 login 혼선

## E. 추가 계획

홈페이지 구조, 상담 예약, 공지, 학원별 소개, 운영 시스템 로그인 진입을 별도 계획으로 확정한다.

## F. 작업 후 업데이트 규칙

홈페이지 변경 시 `CURRENT_FRONTEND_MAP.md`, `CURRENT_UI_EXPOSURE_MAP.md`, `HOMEPAGE_NEXT_PLAN.md`, `CODEX_RESULT.md`를 업데이트한다.

