1. 수정/신규 파일 목록
- 수정: apmath/wrong_print_engine.html

2. 구현 완료 기능
- `wrong_print_engine.html`의 출력 CSS를 `archive/engine.html`, `archive/mixed_engine.html`의 시험지 서식 기준에 맞춰 정렬
- A4 페이지 치수, 여백, `page-exam-frame`, `page-header`, `page-header-title`, `page-header-meta`, `grid-container`, `grid-col`, `q-box`, `q-num`, `q-content`, `choices`, `choice-item`, `choice-no`, `choice-text` 구조를 엔진 기준으로 조정
- 학생별 오답지와 반별 공통 오답지를 기존 엔진과 같은 시험지형 헤더/2단 배치/페이지 번호 흐름으로 출력되게 조정
- 기존 payload 로드, `archiveFile` fetch, `questionBank` 추출, 학생별/반별 오답 로직은 유지

3. 검사 결과
- 별도 자동 검사 명령은 없음
- 기준 파일(`archive/engine.html`, `archive/mixed_engine.html`)과 출력 클래스 구조를 대조해 서식 정렬 적용

4. 수동 테스트 체크리스트
- 클리닉 → 오답 출력 진입2
- 학생별 오답지 출력에서 기존 엔진 시험지와 같은 A4 여백/2단 배치인지 확인
- 반별 공통 오답지 출력에서 기존 엔진 시험지와 같은 헤더/문항 간격인지 확인
- 문항 번호, 보기 번호, 보기 간격이 기존 엔진과 같은지 확인
- MathJax 수식 렌더링이 정상인지 확인
- 인쇄/PDF 저장 시 기존 엔진과 같은 출력 느낌인지 확인

5. 미구현/주의 항목
- 이번 수정은 출력 서식 정렬만 반영했으며, payload/원문 로드/오답 집계 로직은 의도적으로 변경하지 않음
- 최종 동일성 판단은 브라우저에서 `archive/engine.html` 출력물과 나란히 비교해 확인 필요
