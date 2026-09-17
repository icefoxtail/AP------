# ADR 003 — 교육과정별 구성과 검수되지 않은 legacy crosswalk

상태: ACCEPTED FOR RC · 2026-09-16

기존 Unit Past의 h1/h2 directKeyMap 64개를 별도 inventory로 보존한다.
실제 연결 코드가 존재하는 것과 Metadata Foundation v2의 canonical 전체 경로
사이에 `EXACT + REVIEWED` 대응이 승인된 것은 다르다. 기존 legacy key의 깊이가
불규칙하며, 2022 외분점처럼 기본 출력 가능 범위도 달라진다. 이 연결을 자동으로
canonical L1/L2 대응이나 현행 교육과정 출제 승인으로 승격하지 않는다.

RC는 과목 계열로 과거/현행 자료를 함께 탐색하고, 자동 구성은 한 교육과정·과목의
canonical path 안에서 수행한다. 현재 reviewed EXACT 대응표는 0건이다. 이는
기존 자료를 삭제하거나 metadata를 UNKNOWN으로 재작성하는 결정이 아니다.
원본 시험 재현은 기존 engine으로, legacy 출제는 기존 경로로 계속 접근한다.

Crosswalk inventory는 `archive/data/archive2-crosswalk-inventory.json`이며
`build-archive2-crosswalk-inventory.mjs --check`로 실제 코드와의 drift를 검증한다.
Data Health에서 검수 전 매핑 수를 표시한다. 향후 검수된 canonical path 대응을
도입할 때도 source curriculum, source UID, assignment 당시 metadata는 보존하며
`courseFamily` 일치만으로 문항을 혼합하지 않는다.

문서의 화면 구분을 그대로 복제하는 대신, 이 데이터 경계를 교사의 범위 선택에서
명시적으로 드러내는 것을 선택했다. 검수되지 않은 구·신 교육과정 자동 혼합은 RC에서
활성화하지 않는다.
