# CODEX_RESULT_STUDY_MATERIAL_STUDENT_EDITABLE

## 1. 수정 파일

- `apmath/student/index.html`

## 2. 구현 완료

- 제출 완료 수업자료/교재 오답 카드에도 `오답 수정` 버튼이 표시되도록 수정했다.
- 제출 전 수업자료/교재 오답 카드는 기존처럼 `오답 입력` 버튼을 표시한다.
- 제출 여부와 관계없이 `openMaterialWrongOmr(assignment_id)`로 진입 가능하게 했다.
- `openMaterialWrongOmr()`에서 제출 완료 수업자료 오답 차단 흐름을 제거했다.
- 상세 조회 결과의 기존 `wrong_numbers`를 `Set`으로 유지해 수정 화면에 재진입하도록 보존했다.
- `data.submission.is_no_wrong` 값이 1이면 `materialWrongDraft.is_no_wrong`도 1로 반영되도록 수정했다.
- `submitMaterialWrongOmr()`는 기존 `material-omr/submit` API를 그대로 사용한다.

## 3. 보존 확인

- `renderOmrInput()` 수정 없음.
- `submitOmr()` 수정 없음.
- 일반 시험 OMR의 `이미 제출한 OMR은 수정할 수 없습니다.` 문구 유지 확인.
- 일반 시험 OMR의 `이미 제출한 OMR은 다시 제출할 수 없습니다.` 문구 유지 확인.
- 일반 시험 OMR 제출 완료 수정 금지 흐름 유지.
- 학생 포털 로그인/플래너/숙제/배정 자료 흐름 변경 없음.
- 시험지 원문/PDF/archive 직접 열기 기능 추가 없음.
- `수업자료 원문은 열리지 않습니다.` 안내 유지.

## 4. 검증 결과

- `apmath/student/index.html`에서 `이미 제출한 수업자료 오답은 수정할 수 없습니다.` 문구 미검출.
- `apmath/student/index.html`에서 일반 OMR 수정 불가 문구 2개 유지 확인.
- 제출 완료 수업자료 오답 카드에도 `오답 수정` 버튼 렌더링 확인.
- 인라인 script 문법 검증: PASS
  - 실행: `node -e "...new vm.Script(scripts)..."`
  - 결과: `inline script syntax OK`
- `git status --short` 결과:
  - ` M apmath/student/index.html`
  - `?? CODEX_RESULT_STUDY_MATERIAL_STUDENT_EDITABLE.md`

## 5. 미실행 항목

- 배포 미실행
- 운영 smoke 미실행
- git add 미실행
- git commit 미실행
- git push 미실행
