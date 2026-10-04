# JS아카이브 신규 해설 v2.1 문서 동기화 결과

## 1. 수정한 파일
- docs/rules/02_PIPELINES/문제해설추출.md
- docs/rules/02_PIPELINES/해설프로토콜.md
- docs/rules/01_CANONICAL/JS아카이브룰북_v2.5.md
- docs/rules/02_PIPELINES/수정프로토콜.md
- docs/rules/03_REVIEW/무결성검수.md
- docs/rules/02_PIPELINES/JS_문항품질_업그레이드.md
- docs/rules/03_REVIEW/수학_문항오류_검증_프로토콜_v2.1.md
- alive/숫자변형생성용.md
- tools/create_probstat_solution_agent_packs_16x5_20260602.js
- tools/archive_audit.js

## 2. 수정하지 않은 영역
- archive/exams/**/*.js 수정 없음
- archive/engine.html 수정 없음
- archive/mixed_engine.html 수정 없음
- archive/mixer.html 수정 없음
- archive/index.html 수정 없음
- archive/db.js 수정 없음
- archive/assets/** 수정 없음
- assets/images/** 수정 없음
- 기존 PNG/SVG 이미지 수정 없음
- 기존 solution 데이터 일괄 리모델링 없음

## 3. 핵심 반영 내용
- 기존 운영 JS solution은 보존하고, 신규 JS 파일과 신규 기출 변환 및 신규 solution 생성 작업부터 v2.1 규칙을 적용하도록 명시했다.
- `[키포인트]`, `조건 정리`, `풀이 방향`, `정석 풀이` 같은 고정 라벨 강제 규칙을 신규 v2.1 기준에서 제거했다.
- 결론은 `answer`와 일치하는 자연문으로 끝내도록 정리했다.
- 정답 역산, answer 끼워 맞추기, 그래프를 정답에 맞춰 후처리하는 방식을 금지했다.
- 발문용 시각자료(content/image)와 해설용 시각자료(solution 내부 `.sol-visual` inline SVG)를 분리했다.
- SVG 내부 `<br>` 및 LaTeX 금지, viewBox/width/height 필수, 일반 텍스트 라벨 사용 원칙을 보강했다.
- 부등식은 실제 수직선, 함수는 그래프 개형, 원은 중심/반지름 좌표평면, 직선은 좌표평면 직선 그림을 우선하도록 유형별 원칙을 추가했다.
- 불확실 문항은 solution에 운영 메모를 넣지 않고 빈 문자열 또는 review_needed/오류 목록으로 분리하도록 정리했다.

## 4. 2차 확인 대상 결과
- alive/숫자변형생성용.md: 신규 solution 예시와 체크리스트의 `[키포인트]` 강제 문구를 v2.1 자연 풀이 흐름 기준으로 수정했다.
- tools/create_probstat_solution_agent_packs_16x5_20260602.js: 팩 안내문과 체크리스트의 `[키포인트]` 강제를 제거하고 v2.1 기준으로 바꿨다.
- tools/archive_audit.js: `[키포인트]` 누락 WARN 대신 solution 결론 확인 WARN으로 조정했다.

## 5. 검증
- `node --check tools/archive_audit.js` 통과
- `node --check tools/create_probstat_solution_agent_packs_16x5_20260602.js` 통과
- 구버전 `[키포인트]` 강제 및 `∴ 정답` 강제 문구 검색 결과 없음
- `git diff --check` 통과

## 6. 남은 이슈
- 엔진 CSS에 `.sol-visual` 전용 스타일이 필요한지는 별도 UI/렌더 작업에서 확인할 수 있다.
- 신규 solution 생성 시 재사용할 SVG 템플릿 라이브러리는 이번 문서 동기화 범위에서는 만들지 않았다.
- 실제 신규 JS 파일 1개를 대상으로 한 v2.1 샘플 검증은 별도 작업으로 남겼다.
