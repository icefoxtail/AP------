# 23 금당고 고1 2학기 기말: 제공된 엔진 입력 초안

사용자가 전달한 Q6·Q16·Q18·Q21 item·plan·publish·STATUS 초안을 원문 그대로 보존한다. 이 자료는 공식 계약 검사나 렌더 입력으로 승인된 것이 아니다. 원격 `drafts/`의 기존 OPEN 결정과 원문 조건 대조는 `RECONCILIATION.md`를 참조한다.

공식 환경 준비는 npm 의존성과 Python 의존성 설치까지 완료했으나 고정 Noto Sans KR 글꼴 다운로드가 DNS `EAI_AGAIN`으로 두 번 실패했다. 따라서 이 초안들의 renderer 실행은 하지 않았고, 모두 NOT_RENDERED 상태다.

2026-11-07 재확인: 고정 글꼴과 OFL은 별도 허용 브랜치에서 확보해 `.tmp/apmath-visual-engine/dependencies/`에 복사했으며 TTF 해시가 잠금값과 일치한다. 다만 Playwright 1.58.2의 Chromium revision 1208 실행 파일은 준비되어 있지 않고 시스템 Chromium 버전은 호환 확인되지 않아 렌더는 계속 보류다. 자세한 판정은 상위 `STATUS.md`에 기록했다.
