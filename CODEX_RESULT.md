1. 수정/신규 파일 목록
- 수정: apmath/js/clinic-print.js
- 수정: apmath/wrong_print_engine.html

2. 구현 완료 기능
- clinic-print.js의 시험 그룹/오답 item archiveFile을 session.archive_file 기준으로 유지
- 시험 그룹 key를 exam_date + exam_title + archive_file + question_count 기준으로 유지
- archive_file 없는 시험은 기존처럼 원문 연결 불가/비활성 처리
- wrong_print_engine.html의 아카이브 로드를 item.archiveFile만 사용하도록 고정
- archiveFile 정규화 규칙을 지정 기준으로 고정
- 최종 아카이브 URL을 https://icefoxtail.github.io/AP------/archive/ + encodedPath 기준으로 생성
- 지정 console.log 3종 추가

3. node --check 결과
- node --check apmath/js/clinic-print.js: 통과

4. 수동 테스트 체크리스트
- 오답 클리닉 출력 센터에서 archive_file 있는 시험 선택
- wrong_print_engine.html 새 창 열림 확인
- console에서 [clinic-print] archiveFile 값이 session.archive_file인지 확인
- console에서 [wrong_print_engine] loading archiveFile 값 확인
- console에서 [wrong_print_engine] archive url이 archive base + encodedPath인지 확인
- 시험 제목이 URL 경로로 사용되지 않는지 확인
- 문항 원문 로드 확인

5. 미구현/주의 항목
- archive_file 자체가 잘못 저장된 기존 데이터는 원문 로드 실패 가능
- HTML script 문법은 브라우저에서 최종 확인 필요
