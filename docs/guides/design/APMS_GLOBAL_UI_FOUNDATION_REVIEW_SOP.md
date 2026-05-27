# APMS Global UI Foundation Review SOP

## 기본 원칙

요약만 보고 PASS하지 않는다. 실제 변경 파일 전체와 관련 함수, selector를 확인한다.

## 확인 순서

1. 변경 파일 목록 확인.
2. 새 CSS에 금지 selector가 없는지 확인.
3. `classroom.js` 변경 범위가 상단/toolbar/student board/row인지 확인.
4. 기존 문구, 버튼명, 화면명, 함수명, onclick, API 호출이 보존됐는지 확인.
5. `node --check apmath/js/classroom.js` 실행.
6. `index.html` CSS link 중복 확인.
7. 화면 캡처가 필요한 항목은 CODEX_RESULT에 보류로 적는다.

## PASS 금지 조건

근거 없는 PASS, 미검증 PASS, 요약만 본 PASS는 금지한다. 코드 PASS와 UI PASS는 분리한다.

## 검수 요청 시 포함할 항목

파일명, 함수명, selector, 실제 확인 근거, 미확인 항목, 수정 필요 여부를 함께 적는다.

