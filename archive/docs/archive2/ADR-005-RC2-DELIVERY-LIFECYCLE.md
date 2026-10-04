# ADR 005 — 출제 결과를 중심으로 원본·제작 문제지를 연결

채택: 2026-09-17. 시작 HEAD: `6e69a8a034db6e781f948441f07768a4c5496fe6`.

## 실제 사용에서의 판단

교사는 설정 화면보다 출제 후 상태를 명확하게 알아야 한다. RC1에서는 원본과 제작
문제지의 설정 위치가 달랐고, PDF 실패가 출제 자체의 실패처럼 보였다. 여러 문제지 중
하나만 저장돼도 전체가 잠겼다. 따라서 출제 설정, 저장된 문제지, 학생의 실제 접근을
하나의 lifecycle로 연결한다.

`최근 출제 · 작업`은 기존 class assignment API를 읽는다. 시험을 열면 최초 recipient,
exclusion, assignment에 연결된 exam_session을 보여준다. 교사용 학생 포털 미리보기도
기존 경로를 사용한다. 새로운 학생 시스템이나 이력 DB는 만들지 않는다.

## 원본 출제의 공통 저장 경계

Archive 2.0의 기존 반/학생 패널은 유지한다. 해당 패널은 원본 전체와 명시적인 학생 ID를
기존 `/class-exam-assignments`에 보내며 `X-Archive2-Contract: archive2-v1`으로 공통
저장 경계를 선택한다. 인증과 반 접근 권한은 기존 helper를 사용한다.

공통 transaction에서 assignment, 최초 recipients, exclusions, question bridge,
기존 exam_blueprints를 함께 저장한다. 재시도는 같은 UUID와 hash를 확인하고 신규
roster를 삽입하지 않는다. 동시 요청도 실제 최초 insert의 UUID에만 roster 쓰기를 허용한다.
D1 batch의 rollback 의미를 사용하며 별도 배부 transaction subsystem은 만들지 않는다.
[D1 batch contract](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch).

원본 출제에는 자동 선택 eligibility를 적용하지 않는다. 원본 전체 필드의 JSON hash를
생성 catalog와 대조한다. 검증된 identity만 UID로 연결하고 미등록 identity는 순서를 가진
UNRESOLVED row로 남긴다. 원본이나 sidecar를 임의 승인하지 않는다. 기존 blueprint가
검증된 source ordinal과 충돌하면 이번 원본 출제의 근거로 바로잡는다. 임의의 alias
복원이나 전체 legacy backfill은 하지 않는다.

## 저장된 내용과 출력

기존 `mixed_payload_json` content snapshot을 원본에도 사용한다. 원본은
`meta.sourceKind=archive2-original`로 식별한다. raw questions는 변경하지 않으며,
등록된 ordered questionUids를 별도로 보존한다. 원본 출력은 기존 engine의 snapshot
입력 경로를 사용한다. 저장된 문항에 최신 sidecar를 다시 merge하지 않는다.

기존 printHeaderOptions를 공통 편집 폼에서 소비한다. 제목·부제·오른쪽 표시·이름란·점수란,
문항/쪽·QR 설정이 원본과 제작 문제지에서 같은 뜻을 갖는다. 파일 경로와 identityTitle은
표시 제목과 분리한다. 학생 포털의 문제·정답·해설도 같은 저장본을 복원하며 출력 설정과
문항 재정렬 UI를 통해 저장본의 순서를 바꾸지 않는다.

새 작업의 QR 기본값은 OFF다. 명시적으로 ON이면 기존 QR renderer로 학생 포털 링크를
출력한다. 학생은 이름/PIN으로 자신의 내 시험지를 연다. 이미 저장한 작업과 같은 조건의
다음 회차는 교사가 선택했던 설정을 보존한다. legacy QR 경로는 유지한다.

## 여러 권의 부분 성공

문제지별 key는 해당 문제지의 UID·출력 설정에만 의존한다. 한 권을 수정해도 다른 권의
key가 바뀌지 않는다. receipt는 partIndex별로 관리하며 저장된 권만 잠근다. 전체 완료는
모든 권의 저장 이후다. PDF 실패는 저장 성공과 분리한다.

실패한 권은 교체·출력 설정 수정·재시도가 가능하다. 저장된 권은 API의 실제 snapshot으로
복원하고 새로운 source에서 재조립하지 않는다. 재시도에서 본인의 저장된 UID만 현재 이력
검사에서 제외한다. 다른 학생 이력 충돌을 전체 선택 목록과 함께 지우지 않는다.

일반 출력 창을 열었다는 사실만으로 작업을 확정하지 않는다. 학생에게 출제되기 전까지
편집할 수 있다. 각 권의 교체 목록과 번호는 실제 보고 있는 문제지에 맞춘다.

## 배포 경계

RC2에서 새 DB migration은 추가하지 않는다. RC1 bridge migration, 새 catalog,
Worker와 정적 UI를 함께 배포해야 한다. 원본 전체 필드 hash가 없는 이전 catalog는
원본의 새 저장 경계를 통과하지 못한다. 생산 환경의 Browser Rendering/R2 성공 확인은
별도 rollout 검증이다. 이 작업에서는 main merge, deploy, remote migration을 하지 않는다.
