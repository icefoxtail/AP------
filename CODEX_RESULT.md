1. 수정/신규 파일 목록
- 수정: apmath/student/index.html
- 수정: apmath/worker-backup/worker/index.js

2. 구현 완료 기능
- 학생 개인 포털 OMR 카드의 준비 중 안내 제거
- 학생포털에서 자기 반의 출제 시험지 목록 조회 기능 추가
- GET /api/student-portal/exams 추가
- POST /api/student-portal/omr-submit 추가
- 학생 토큰 검증 후 본인 소속 반의 class_exam_assignments만 조회
- 시험지 클릭 후 1번~N번 틀린 번호 체크 방식 OMR 입력 구현
- 제출 시 exam_sessions 생성/갱신
- 제출 시 wrong_answers 삭제 후 재저장
- score 자동 계산
- archive_file, class_id, exam_title, exam_date, question_count 유지 저장
- 제출 완료 시험은 목록에서 점수/제출 상태 표시 및 수정 가능

3. 검사 결과
- node --check apmath/worker-backup/worker/index.js: 통과
- student/index.html 내부 script 추출 후 node --check: 통과

4. 수동 테스트 체크리스트
- /apmath/student/ 로그인
- OMR 입력 카드 클릭
- 자기 반에 출제된 시험지 목록 표시 확인
- 다른 반 시험지가 노출되지 않는지 확인
- 시험지 클릭 시 문항 수만큼 번호 버튼 표시 확인
- 틀린 번호 선택/해제 확인
- 제출 후 제출 완료/점수 표시 확인
- 선생님 화면 exam_sessions 반영 확인
- 선생님 화면 wrong_answers 반영 확인
- 클리닉 오답 출력에 반영 확인
- 기존 과제/플래너 이동 정상 확인
- 기존 선생님용 QR/OMR 기능 회귀 없음 확인

5. 미구현/주의 항목
- 학생포털 OMR 1차는 정답 전체 입력 방식이 아니라 틀린 번호 체크 방식
- class_exam_assignments에 question_count가 없는 시험은 학생 제출 불가 안내
- 기존 qr-omr.js는 선생님용 보조 도구로 유지
