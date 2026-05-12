1. 수정/신규 파일 목록
- 수정: apmath/js/clinic-print.js
- 수정: apmath/wrong_print_engine.html

2. 구현 완료 기능
- AP_CLINIC_PRINT_PAYLOAD key 통일 확인
- window.open 전 sessionStorage 저장 보장
- noopener 새 창 전달 실패 대비 localStorage 백업 저장/읽기 추가
- wrong_print_engine.html 현재 경로 기준 안전 URL 열기 적용
- payload 저장/로드 console.log 추가
- payload가 있을 때 즉시 렌더링, 없을 때만 기존 오류 화면 표시

3. node --check 결과
- node --check apmath/js/clinic-print.js: 통과

4. 수동 테스트 체크리스트
- 반 화면에서 오답지 출력 클릭
- 시험/학생 선택 후 오답지 만들기 클릭
- wrong_print_engine.html 새 창 열림 확인
- 오답지 데이터를 찾을 수 없습니다 문구가 사라지고 렌더링되는지 확인
- 팝업 차단 시 toast 표시 확인

5. 미구현/주의 항목
- HTML script 문법은 브라우저 수동 확인 필요
- localStorage 백업은 같은 origin에서만 동작
