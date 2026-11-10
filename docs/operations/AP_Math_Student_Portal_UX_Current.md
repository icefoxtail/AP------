# AP Math 학생포털 UX — 현행 계약과 디자인 인계

대상: `apmath/student/`, 학생이 사용하는 과제·플래너, 실험실 진입·복귀.
관련 변경: [PR #1661](https://github.com/icefoxtail/AP------/pull/1661), [이슈 #1653](https://github.com/icefoxtail/AP------/issues/1653).
기준: `apmath/DESIGN.md`, `apmath/playground/DESIGN.md`, 최신 사용자 지시.

## 제품 우선순위

1. 시험지 확인 → 직접 채점 → 틀린 번호 체크 → OMR 제출 → 기록 점수 확인 → 정답·해설 복습.
2. 도형·수학 실험실.
3. 클리닉·학습 기록·수업자료 오답.
4. 플래너와 과제 제출.

홈은 서버의 전체 시험지 목록에서 입력 가능한 진행 중 시험지를 먼저, 그다음 제출 완료 시험지를 날짜 순으로 3개 보여 주고 전체 목록을 분명하게 연결한다. 날짜·제출 여부로 전체 목록에서 예전 시험지를 숨기지 않는다. 같은 시험지가 홈과 전체 목록에서 다른 상태로 표시되지 않도록 카드 렌더러와 정본 조회 경로를 공유한다.

동시 진행된 [PR #1659](https://github.com/icefoxtail/AP------/pull/1659)의 시험지 우선순위·교사 읽기 전용·OMR 접근성·예상/기록 점수 구분을 통합한다. 해당 작업의 동작 테스트와 브라우저 검증도 유지하며, CSS 파일명·화면 문구에 묶인 기대만 현재 구조로 옮긴다. PWA 버전은 기존 운영 버전보다 높은 `2026.11.11.2`로 일관화한다.

## 화면 및 코드 소유

| 화면 | 구현 | 디자인·동작 기준 |
|---|---|---|
| 로그인 | `apmath/student/index.html`, `student-portal.css` | 짧은 학습 소개, 이름/PIN 레이블, 모바일에서 로그인까지 짧은 이동 |
| 홈·시험지 목록 | 같은 파일 | 시험지 우선, 전체 목록 접근, 상태 필터, 모바일 하단/PC 상단 내비게이션 |
| 오답 선택·OMR 결과 | 같은 파일 | 44px 이상 번호 버튼, `aria-pressed`, 선택 시 초점·스크롤 유지, 예상/기록 점수 구분 |
| 클리닉·수업자료 입력 | 같은 파일 | 시험 OMR과 저장 의미 분리, 로딩/실패/재시도, 수업자료 전체 목록 접근 |
| 학습 기록 | `clinic-learning-view.js` | 기간·조건·기록 읽기, 현재 페이지/누적/부분 기록의 의미 보존 |
| 기준 시험·보충 시험 관계 | `clinic-lineage-view.js` | 취소/제외/미확인 링크 경계 보존, 학생 표현과 44px 버튼 |
| 사진 과제 제출 | `apmath/homework/index.html`, `css/student-tools.css` | PIN·사진 선택·완료 단계, 실제 썸네일·장수·삭제, 실패 후 재시도와 포털 복귀 |
| 플래너 | `apmath/planner/index.html`, `css/student-tools.css` | 모바일 날짜 이동·접이식 월력, 할 일·집중 타이머·모달, 기존 다크 모드 |
| 실험실 진입·복귀 | `apmath/playground/index.html`, `universe/universe.css`, `next/kit/apl-hub.js`, `apl-hub.css` | Universe/board/paper 유지, 학생포털 복귀, 학년 해시 유지 |

`student-portal.css`가 포털의 토큰과 화면 스타일을 소유한다. 구형 APMS override를 다시 겹쳐 로드하지 않는다. 과제·플래너는 `student-tools.css`의 화면 범위 선택자를 사용하며, 선생님 APMS 전체 스타일을 덮지 않는다.

## 시각 기준

- 웜 스톤 `#faf9f7`, 흰 표면, 본문 `#1c1917`, 보조 글자 `#6b645f`.
- 주요 행동은 `#1c1917`; 파랑 `#2563eb`는 선택·링크·포커스에 쓴다.
- 완료 `#15803d`, 진행/주의 `#b45309`, 오류 `#b91c1c`를 의미에 맞게 제한한다. 상태는 색과 함께 문구로 표시한다.
- 본문 400/500, 제목 600을 기본으로 한다. 학생이 읽는 글자는 12px 이상, 입력은 16px, 터치 조작은 최소 44px.
- 카드 16px, 입력·버튼 8px. 카드에 장식용 그림자·그라데이션·여러 색 버튼을 추가하지 않는다.
- 모바일에서는 제목과 주 행동을 먼저 읽는다. 내비게이션·제출 바·업데이트 알림이 서로를 덮지 않아야 한다.
- 실험실은 수학 무대의 기존 별도 색 체계를 유지한다. 포털 색으로 3D·도형·그래프의 의미색을 다시 칠하지 않는다.

## 보호할 기능 계약

- Worker·인증·학생 권한·실제 학생 데이터·시험지/정답/해설의 수학적 내용을 디자인 변경으로 수정하지 않는다.
- 서버 `/student-portal/exams` 목록이 시험지의 정본이다. 같은 날 재출제된 다른 assignment ID를 합치지 않는다.
- OMR 요청은 기존 `wrong_ids` 계약을 사용하고, 표시 점수는 서버 응답을 그대로 기록한다. 예상 점수는 문항 수 기준 예상임을 표시한다.
- 이미 제출된 OMR은 재제출/수정할 수 없다. 상태 미확인·취소·대체·열람 전용은 입력을 막고 열람 권한은 기존대로 유지한다.
- 동일 시험 제출 중 재진입해도 두 번째 POST를 보내지 않는다. 실패 시 선택을 보존하고 다시 제출할 수 있게 한다.
- 선생님 미리보기는 UI와 `apiPost` 양쪽에서 쓰기를 금지한다.
- async 요청은 인증 세대·resource sequence·화면 세대·draft identity를 확인한다. 이전 학생이나 이전 자료의 응답이 현재 화면/선택을 덮지 않아야 한다.
- 같은 입력 항목으로 되돌아가면 메모리의 선택을 보존한다. 로그아웃·학생 전환은 데이터를 지운다. 앱 재시작 후 초안 복원은 제공하지 않는다.
- PWA 자동 업데이트는 입력·미저장 선택·전송 중 상태를 보호한다. 앱 버전, manifest, `student-version.json`, service worker 및 정적 리소스 query를 함께 올린다.
- Archive 원본/MIXED 복습·PDF·snapshot 복원 계약은 기존 엔진을 그대로 사용한다. 원문이 없는 시험은 파일이 없는 이유를 안내하고 임의 내용을 만들지 않는다.

## 검증 방법

정적/계약 회귀:

```sh
node --test tests/student-portal-*.test.js tests/apmath-student-teacher-preview.test.js tests/apmath-dark-mode-modals.test.js
node tools/run-tests.js
```

실제 Chromium:

```sh
NODE_PATH=/path/to/playwright/node_modules node tests/student-portal-ux-browser.cjs --output=/tmp/student-portal-ux
```

`.github/workflows/student-portal-ux-browser.yml`은 정확한 PR head와 baseline을 별도 checkout한다. 실제 제품 HTML에 합성 API 응답을 연결하며 함수 교체나 로그인 화면 숨김으로 제품 동작을 대체하지 않는다. 사진 업로드·OMR POST도 합성 API만 사용한다. 결과는 screenshot/report artifact에 남으며 원시 캡처·로그를 Git에 커밋하지 않는다.

대표 화면 폭은 360/390, 태블릿 800·1280, PC 1440이며 실험실 헤더는 320도 확인한다. 정상/빈 목록/통신 실패/늦은 응답/teacher preview/unknown·cancelled·replaced·review-only/원문 없음/legacy MIXED를 구분한다. 새 결과 화면, 번호 선택, 제출 payload, 서버 점수, 뒤로가기, 모달·사진·타이머 동작도 확인한다.

인증이 필요한 합성 동작 검증과 실제 운영 계정 검증을 혼동하지 않는다. 운영에서는 배포 SHA, 리소스 버전/내용, 공개 로그인·하위 공개 화면을 실제 브라우저로 확인한다. 학생 데이터에 테스트 제출을 만들지 않는다.

## Claude Code / Impeccable 최종 미감 검수

최신 main에서 저장소의 Impeccable 스킬을 읽고 시작한다. 이번 화면의 기준은 **시험지 중심의 짧은 흐름, APMS 웜 체계, 모바일에서 한눈에 읽히는 상태와 행동**이다.

검토할 부분은 360/390px의 정보 밀도·줄바꿈, 800px 카드/관계 정보 배치, 1280/1440px 여백·카드 균형, 제출 전후 버튼 위계, 클리닉/기록의 긴 목록, 플래너 다크 모드, Universe 복귀 헤더다. 스타일을 다듬더라도 위 보호 계약과 실제 검증 분모를 유지한다. 변경 후 관련 브라우저 흐름을 다시 실행하고 자신의 PR·배포 근거를 남긴다.

GPT의 구현·검수·운영 반영은 이 후속 미감 검토와 별개로 완료해야 한다. 실제 완료 SHA·CI·배포 결과는 PR 및 최종 보고에서 확인하며, 이 문서는 실행하지 않은 검사에 PASS를 부여하지 않는다.
