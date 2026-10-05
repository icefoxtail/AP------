# CODEX 지시서 — 학교시험 학부모 리포트 출력 V2 (간단본)

상세 근거·라인번호는 `CODEX_TASK_SCHOOL_EXAM_PARENT_REPORT_PRINT_V2_20260707.md` 참조. 이 문서는 실행 순서만 정리한다.

## 목표
학교시험 상세 학부모 리포트 PDF를 실제 발송 가능한 카드형 리포트로 재구축한다. 실측 PDF에서 확인된 치명 결함(UI 박제 / 표 붕괴 / 수식 에러 / 빈 페이지 / 반복 문구)을 없앤다.

## 확정 방향
- 인쇄는 **off-screen 포털**로 분리 (앱 셸 DOM 배제)
- 표·이미지·수식은 **엔진(`wrong_print_engine.html`) 함수를 공용 모듈로 추출**해 재사용
- 이미지 필드는 실제 경로 → 절대경로 해석 후 렌더

## 작업 순서

### 1. 공용 모듈 추출 — `apmath/js/archive-render.js` (신규)
- 엔진에서 추출: `ARCHIVE_BASE_URL`, `normalizeArchiveFile`, `resolveArchiveAssetUrl`, `rewriteImgSrcInHtml`, `getQuestionImageRaw`, `wrapLatex`
- `window.ApArchiveRender`로 노출 (클래식 스크립트, ESM 아님)
- `index.html`에 `report-center.js`보다 먼저 로드
- `wrong_print_engine.html`은 인라인 제거 후 모듈 사용 → **출력 회귀 없어야 함**
  - 단, 엔진이 별도 창으로 인쇄를 띄워 모듈 로드가 어려우면: 엔진은 인라인 유지 + report-center만 모듈 사용(소스 1:1 동일)
- 테스트: `tests/archive-render.test.mjs`

### 2. 인쇄 off-screen 포털 (UI 박제 해결)
- `reportCenterOpenSchoolExamDetailedPrintView`: `#app-root` innerHTML 교체 대신 `body` 하위 `#report-print-portal` 생성
- 인쇄 CSS: `@media print { body.aprc-school-print-mode > *:not(#report-print-portal){ display:none !important; } }`
- 종료 함수는 포털 제거 + 클래스 해제
- PASS: 인쇄 1페이지 최상단이 `AP MATH REPORT`로 시작, 헤더/햄버거/뒤로가기 없음

### 3. 표·이미지·수식 리치 렌더 (표 붕괴 / 수식 & 해결)
- 학부모 출력 문항 본문은 `reportCenterArchiveTextToHtml`/`stripHtml`/`limitText`를 **거치지 않는다**
- 대신: `wrapLatex(rewriteImgSrcInHtml(contentRich, archiveFile))`
- `reportCenterNormalizeQuestionDetail`에 `contentRich`(무절단), `image`, `_archiveFile` 추가
- 문항 카드에 `getQuestionImageRaw` + `resolveArchiveAssetUrl`로 이미지 렌더 (인라인 img와 중복 가드)
- 인쇄 CSS: `table{border-collapse;td/th border+padding}`, `img{max-width:100%}`, `break-inside:avoid`, `print-color-adjust:exact`

### 4. 수식 에러 안전망
- `reportCenterTypesetMath`: 타이프셋 후 `mjx-merror` 노드 검사 → 있으면 인쇄 차단 + 교사용 경고 toast (학부모용 원시 에러 노출 금지)
- (1차 차단은 3번의 `wrapLatex`가 이미 처리)

### 5. 첫 페이지 카드 재구성 (빈 페이지 해결)
- 첫 페이지에 카드: 학생/시험 정보 · 점수(정답률/오답수/전체·반 평균 대비) · 핵심 진단 · 다음 수업 계획
- 값 없으면 `-`, 하단에 큰 공백 남기지 말 것
- 점수 대비는 최소한의 막대 시각화

### 6. 문항 코멘트 다양화 (반복 문구 해결)
- `reportCenterBuildParentQuestionParagraph`의 4분기 + 넓은 `isCondition` 정규식이 원인
- 단원계열/오답태그/유형/정답률 밴드 조합으로 문형 확장
- 문서 빌드 시 `usedComments[]` 누적 → `reportCenterPickNonDuplicateText`로 중복 회피
- PASS: 5문항에서 동일 문장 3회 이상 반복 없음

### 7. 문구/정렬 정리
- 제목: `AP MATH REPORT` + `기말고사 분석 리포트`(시험명 없으면 `학교시험 분석 리포트`). 학생명은 정보 카드로.
- 오답 문항은 **번호순** (`reportCenterSortWrongRowsByQuestionNo`)
- 금지어 제거: `상세 학부모 리포트`, `학교시험 오답과 다음 수업 관리 계획을 정리했습니다`, `먼저 볼 문항`, `우선 확인 문항`, `실제 문항`
- 각 페이지 푸터: `AP수학 · 생성일 · 페이지 n`

### 8. 테스트
- 기존 테스트의 구(舊) 구조 기대 제거, 새 발송 계약으로 교체
- 신규: 금지어 없음 / 점수·평균·정답률 표시 / 번호순 / `<table>`·`<img>` 보존 / `Misplaced &` 없음 / 헤더 미노출 / 코멘트 반복 없음

## 최종 PASS
1. 인쇄물에 앱 UI 없음
2. 표가 행/열로 정상 렌더
3. 이미지 렌더됨
4. `Misplaced &` 등 수식 에러 노출 없음
5. 첫 페이지 카드로 채워짐(빈 공백 없음)
6. 문항 번호순 + 금지어 없음
7. 코멘트 반복 없음
8. 엔진 출력 회귀 없음
9. 테스트 전부 통과

## 금지
- 단순 문자열 치환으로 끝내지 말 것
- 기존 평가리포트/엔진 출력 깨지 말 것
- 문항 원문·정답 데이터 없는데 가짜로 만들지 말 것
- 테스트 기대값 느슨하게 바꾸지 말 것
