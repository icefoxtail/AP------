# CODEX_RESULT — JS아카이브 image 필드 자동 크기 분류 구현

## 1. 수정 파일

* archive/engine.html
* archive/mixed_engine.html

## 2. 구현 요약

* 추가 helper: `applyAutoImageSizeClasses(root)`, `autoImageSizeClassFor(img)`, `waitForQuestionImage(img)`
* renderExam 호출 위치: staging에 문항 box를 모두 append한 직후, 기존 `MathJax.typesetPromise([staging])` 호출 직전
* q.imageSize 수동 우선 여부: 유지. 기존 `image-small|half|medium|large|full` class가 있으면 자동 분류를 건너뜀
* 자동 분류 기준:
  * `ratio >= 2.2`: `image-full`
  * `1.25 <= ratio < 2.2`: `image-large`
  * `0.8 <= ratio < 1.25`: `image-small`
  * `ratio < 0.8`: `image-medium`
* fallback 기준: 이미지 없음, 로드 실패, natural size 없음은 `image-medium`

## 3. Codex A 구현 결과

* engine.html 적용 내용:
  * `renderQuestionImageHTML(q)`의 기존 수동 `q.imageSize` 처리 유지
  * 자동 분류 helper 추가
  * `renderExam()`에서 staging 높이 측정 및 MathJax 처리 전에 `await applyAutoImageSizeClasses(staging)` 호출
* mixed_engine.html 적용 내용:
  * engine.html과 동일한 helper 추가
  * 시험지 `renderExam()`에만 `await applyAutoImageSizeClasses(staging)` 호출
* renderSol 수정 여부: 없음
* CSS 값 변경 여부: 없음
* 데이터 파일 변경 여부: 없음

## 4. Codex B 로직·범위 검수

* 성역 함수 변경 여부: 없음
* MathJax 흐름 변경 여부: 기존 staging MathJax 호출 위치는 유지, 직전에 helper 호출만 추가
* q.imageSize 우선 여부: 기존 size class가 있으면 자동 분류 skip
* 이미지 로드 실패 처리: `error` 또는 timeout 후 `image-medium`으로 resolve하여 렌더 중단 방지
* 데이터 파일 변경 여부: 없음
* EIE 파일 변경 여부: 없음
* 판정: PASS

## 5. Codex C UI/CSS 검수

* 정사각형 이미지 분류: `0.8 <= ratio < 1.25`에서 `image-small`
* 가로형 이미지 분류: `ratio >= 2.2`는 `image-full`, `1.25 <= ratio < 2.2`는 `image-large`
* 세로형 이미지 분류: `ratio < 0.8`에서 `image-medium`
* 기존 CSS 값 변경 여부: 없음
* float/right/absolute 사용 여부: 없음
* 발문-이미지-보기 순서 유지 여부: 기존 `content -> imageHTML -> choicesHTML` 순서 유지
* 판정: PASS

## 6. Codex D 테스트·회귀 검수

* 실행한 명령:
  * 인라인 RED 확인: helper/call 부재 확인용 node 스크립트 실행, 구현 전 실패 확인
  * 인라인 GREEN 확인: helper/call/ratio/fallback 정적 contract node 스크립트 실행
  * `Select-String -Path .\archive\engine.html -Pattern "renderQuestionImageHTML|applyAutoImageSizeClasses|classifyQuestionImages|image-small|image-half|image-medium|image-large|image-full" -Context 2,8`
  * `Select-String -Path .\archive\mixed_engine.html -Pattern "renderQuestionImageHTML|applyAutoImageSizeClasses|classifyQuestionImages|image-small|image-half|image-medium|image-large|image-full" -Context 2,8`
  * `git diff -- archive/engine.html archive/mixed_engine.html`
  * `git status --short`
* diff 확인 결과:
  * 이번 구현 diff는 자동 이미지 크기 helper 추가와 `renderExam()` 내 helper 호출 추가
  * 두 엔진 파일에는 이전 note-box alias 변경분도 이미 존재함
  * CSS 이미지 크기 값 변경 없음
* 브라우저 확인 여부: 미실행
* 임시 파일 생성 여부: 없음
* 임시 파일 삭제 여부: 해당 없음
* 판정: PASS

## 7. 최종 판정

PASS

## 8. 남은 작업

* 브라우저에서 실제 PNG 3종(정사각형/가로형/세로형) 인쇄 레이아웃 육안 확인 권장
