# AP Math Playground 학생용 문구 개선판

시작: `index.html`을 정적 웹 서버(GitHub Pages 등)에 올리면 됩니다. `labs/`, `assets/`, `tools/`, `universe/`, `next/`를 그대로 유지하세요.

## 현재 진입 구조 (2.0 전환 1단계)
- 진입: `index.html`(AP Math Universe) → 「실험실 입장」 → `next/index.html`(2.0 실험실 허브). 허브 맨 위와 아래에서 AP Math Universe와 이전 허브로 돌아갈 수 있습니다.
- 실험실 목록의 단일 출처는 `next/kit/apl-catalog.js`입니다(과정·단원·장면·기존/2.0 경로). 실험실을 더할 때는 여기에 한 항목만 더하면 허브의 목록·개수·검색·노선도가 자동으로 바뀝니다.
- `manifest.json`은 카탈로그에서 만듭니다. 직접 고치지 말고 `node apmath/playground/next/tools/gen-manifest.mjs`를 실행하세요. 카탈로그·manifest·파일 경로가 맞는지는 `node --test apmath/playground/next/tools/catalog.test.mjs`가 검사하며 CI(`tools/run-tests.js`)에 등록되어 있습니다.
- 이전 허브 `teacher-hub.html`은 전환 기간 동안 그대로 두고, 맨 위에서 새 허브로 안내합니다. 이 화면의 숫자(학년·과목, 카드, 바로가기)는 카드에서 직접 세어 채웁니다.

## 이번 변경
- 중1 8개, 중2 3개, 원과 부채꼴 기초판까지 총 12 HTML의 학생용 문구 정리
- 개발자·제작 홍보 표현과 화면상 HTML 다운로드 버튼 제거
- 각 실험실의 사용 방법 도움말, 홈페이지 단원 검색 추가
- 공통 관계 탐구 UI 문구 변경. 실제 도형 작도·학습 엔진의 수학 로직은 변경하지 않음

## 주의
- 일부 실험실은 CDN 라이브러리를 사용하므로 인터넷 연결 필요
- 코드 문법과 대표 화면·버튼을 점검했으며 수학 내용·모바일 실기기 전수 검증은 별도
- 이전 ZIP 대비 안전을 위해 원본 ZIP은 수정하지 않고 새 이름으로 저장
