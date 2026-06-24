수정 대상:
- apmath/wrong_print_engine.html

목표:
QR 또는 정답+해설 출력에서 학생별로
[정답표 먼저] → [해설지] → [양면 인쇄용 빈 페이지]
순서로 출력되게 한다.

현재 문제:
- QR URL은 mode=sol&qr=1로 열려 해설지만 고정된다.
- QR 모드에서 정답표 버튼도 숨긴다.
- renderAns()는 학생별 정답표를 완성된 묶음 구조로 만들지 않는다.
- 정답표와 해설지가 분리된 탭 구조라, 학생별 인쇄 흐름이 깔끔하지 않다.

수정 1. QR target mode 변경
- buildQrTargetUrl()에서 mode=sol 대신 mode=review 또는 mode=packet 같은 전용 모드를 사용한다.
- 예: mode=review&qr=1&wp=...
- QR 모드는 문제지/정답표/해설지 탭 전환형이 아니라, 자동으로 정답표+해설지를 한 문서로 렌더링한다.

수정 2. QR UI 변경
- QR 모드에서는 상단 탭 자체를 숨긴다.
- 상단 제목은 "AP Math 오답 확인"으로 표시한다.
- QR 화면에는 정답표가 먼저 나오고, 그 아래 해설지가 이어진다.

수정 3. 학생별 정답+해설 묶음 렌더 함수 추가
새 함수 예시:
- renderStudentReviewPacket(area, payload)
- renderAnswerPagesForStudent(area, student, items, pageMeta)
- renderSolutionPagesForStudent(area, student, items, pageMeta)

동작:
1. 학생별 items를 cloneQuestionForRender()로 만든다.
2. 먼저 해당 학생 정답표 페이지를 출력한다.
3. 이어서 해당 학생 해설지를 출력한다.
4. 해당 학생 묶음 전체 페이지 수를 계산한다.
5. 다음 학생이 남아 있고 전체 페이지 수가 홀수이면 appendBlankPage(area)를 넣는다.

중요:
- 정답표 번호는 학생별로 1번부터 시작한다.
- 해설지 번호도 같은 items 순서로 1번부터 시작한다.
- 정답표 번호와 해설지 번호가 반드시 일치해야 한다.

수정 4. QR compact payload 처리
- 학생 개별 QR은 현재처럼 해당 학생 wrongItems만 담는다.
- QR을 찍으면 해당 학생의 정답표 1페이지가 먼저 나오고, 다음 페이지부터 해설지가 나온다.
- 반별/학년별 QR은 공통 오답 정답표 → 공통 오답 해설지 순서로 출력한다.

수정 5. 일반 전체 출력에도 선택 옵션 적용
- 기존 문제지/해설지/정답표 탭은 유지한다.
- 단, QR 또는 전용 review 모드에서는 탭 방식이 아니라 정답+해설 묶음 방식으로 출력한다.
- 추후 버튼명을 "정답+해설지"로 추가해도 되는 구조로 만든다.

검수 기준:
1. 학생 A QR을 찍으면 첫 페이지는 학생 A 정답표다.
2. 두 번째 페이지부터 학생 A 해설지가 나온다.
3. 해설지가 5페이지에서 끝나면 6페이지는 빈 페이지다.
4. 여러 학생 묶음 출력 시 다음 학생은 7페이지부터 정답표가 시작된다.
5. 학생별 정답표 번호와 해설지 번호가 일치한다.
6. QR에서는 문제지 출력이 보이면 안 된다.
7. QR에서 이미지 문항과 imageTag 문항도 해설지에 정상 출력된다.