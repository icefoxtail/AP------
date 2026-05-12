1. 수정/신규 파일 목록
- 수정: apmath/js/qr-omr.js
- 수정: apmath/js/classroom.js

2. 구현 완료 기능
- 선생님 직접 입력 OMR 화면에서 archive_file 입력칸을 hidden 처리하고 상태 문구만 표시
- archive_file 결정 우선순위를 presetArchiveFile → 동일 시험/날짜 session → 동일 시험 최근 session → assignment → 빈 값으로 적용
- exam_title은 표시용으로만 저장하고 archive_file과 분리 유지
- archive_file이 없으면 payload에 억지로 만들지 않고 저장 허용
- 일괄 OMR 입력 화면에서도 archive_file 입력칸을 숨기고 자동 결정된 상태만 표시
- classroom.js의 시험성적/학생별 입력 흐름은 기존 archive/session 값을 openOMR 추가 인자로 계속 전달하도록 유지
- normalizeQrArchiveFile이 하위 폴더 포함 실제 경로를 보존하도록 정리

3. node --check 결과
- node --check apmath/js/qr-omr.js: 통과
- node --check apmath/js/classroom.js: 통과

4. 수동 테스트 체크리스트
- 아카이브에서 반 시험 출제
- DB에 archive_file 저장 확인
- AP Math OS 반 화면에서 선생님 성적 입력
- archive_file 입력칸이 보이지 않는지 확인
- 시험명은 자유롭게 바꿔도 되는지 확인
- 저장 후 exam_sessions.archive_file이 원래 파일 경로로 유지되는지 확인
- 클리닉 → 오답 출력
- wrong_print_engine.html에서 원문 문항 로드 확인

5. 미구현/주의 항목
- `state.db`에 assignment 데이터가 없는 화면에서는 session 기준 우선순위가 먼저 적용됨
- archive_file 자체가 비어 있거나 잘못 저장된 기존 데이터는 여전히 원문 연결 불가로 남음
