# 매산중 유사2 Q1 엔진 샘플

SAMPLE_ONLY; productionAuthorized=false. 현행 공식 composeConstructionCandidate API로 문제/해설 각각 생성했다. 양쪽 mathPlan 동일, identity는 PROBLEM_VISUAL / SOLUTION_VISUAL로 분리했다.

원문은 중1 누적 브랜치 JS blob b928c4c8fa415aaabd65a5a05ebd9cd4de20e852와 결속했다. 기존 입력 소유 라인이 이 경로에만 샘플을 추가하며 학년 JS/원본 자산/다른 샘플은 변경하지 않았다. 기존 작성 담당의 최근 기록에 SVG 제작은 없었고 이 문항은 이 라인의 기존 준비 문항이다.

문제 그림: 원문 조건인 직선 l 위의 A,B,C,D 순서만. 길이/등분 표시/반직선 강조/답 번호 없음. 해설 그림: 같은 직선 구조에서 C→왼쪽 반직선 하나만 강조해 시작점과 방향을 구분하도록 했다. CA=CB는 같은 시작점·방향이며 BC,CD,선분,직선은 달라 ①만 정답임을 검산했다.

문제와 해설 출력 SVG 글리프 재독해 A,B,C,D,l만 표시됨 확인. 문제 계획의 강조선 부재도 확인. 원문 발문/선지/정답을 수정하지 않았다.

- exact model / independent static primitive audit / plane-mark audit / headless rendered-layout audit: 실행 PASS.
- typographyPolicy: caller-supplied UNVERIFIED; Archive 측정값 아님.
- 직접 시각 검수 / actualArchive / qualification / publication: NOT_RUN.
- 엔진 snapshot 1206d96c524b4fc50afc83311d2a6131c7e5ab46; 엔진 코드 변경 없음.

original-only 측정/운영 게시 계약과 지정 게시 담당은 여전히 미확인이다. 샘플 보존을 운영 인계/게시 완료로 취급하지 않는다. PNG는 사용자 전달용으로 별도 생성했으며 Git에는 SVG 및 검증 결과만 보존한다.
