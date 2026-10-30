# AGENTS.md — 작업 안내판

이 파일은 모든 에이전트(Codex·Claude·GPT 작업자)가 시작할 때 자동으로 읽는 안내판이다. 세부 규칙은 작업 영역별 문서에 있고, 그 작업을 할 때만 읽는다.
요약과 원문이 다르면 영역 문서의 원문이 우선한다.

## 첫걸음

1. 최신 사용자 지시에서 대상·작업 종류·종료 조건을 먼저 확인한다.
2. 아래 표에서 해당 영역 문서를 열어 끝까지 읽고 시작한다. 시험지·메타·ALIVE·출고 작업이면 [docs/agents/common.md](docs/agents/common.md)(범위 판단·OWN_AND_FIX 원문)도 함께 읽는다. 관계없는 영역 문서는 열지 않는다.
3. 하위 폴더에 `AGENTS.md`가 있으면 그 범위에서 함께 따른다.

## 모든 작업 공통

- **범위:** 최신 지시의 대상과 종료 조건을 따른다. 한정 수정은 지정한 대상과 꼭 필요한 직접 의존 부분만 고친다. 범위 밖에서 발견한 것은 보고만 하고, 범위를 넓히려면 사용자 승인을 받는다.
- **정직한 기록:** 실행하지 않은 검사는 `NOT_RUN`, 근거가 부족한 판단은 `EVIDENCE_DEBT`로 남긴다. 근거 없는 PASS, 추정 메타값, 가짜 `NONE`을 쓰지 않는다.
- **검사를 약하게 만들지 않는다:** 테스트·검사를 생략하거나 격리하지 않고, 분모를 줄이거나 기준을 완화해 통과시키지 않는다.
- **병합과 배포는 따로 기록한다:** `main` 병합 지시를 받으면 병합부터 하고, CI·Pages·학생 배포 결과는 사실대로 따로 남긴다. 보호 규칙 우회, 강제 push, 다른 사람 브랜치의 이력 재작성은 하지 않는다.
- **Git에는 운영물만 둔다:** 운영 소스·자산·런타임·빌드/테스트 도구·현행 계약만 커밋한다. 원시 이력·캡처·로그·렌더 출력 같은 증거는 Drive에 둔다(허용된 cold root와 절차: `docs/agents/git-evidence.md`).
- **Archive 2.0 코드:** 화면·검색·출력·저장 코드를 바꾸면 먼저 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 읽는다. 병합 전에 `node tools/check-archive2-runtime.cjs`를 통과시키고, 흐름을 바꿨으면 실제 Chrome으로 확인한다. 원본 기출은 `engine.html?data=exams/<file>&mode=exam|sol|ans`로 바로 열리게 유지한다.

## 토큰 효율

정해진 검사·검수 절차(테스트, 런타임 검사, 시험지 R1·R2 전 qid 검수 등)는 줄이지 않는다. 그 밖의 작업 방식은 아래를 따른다. 상세와 소요 시간은 `docs/agents/token-efficiency.md`에 있다.

- 추가로 하는 전수 측정은 사용자가 요청했거나 개수 자체가 결과물일 때만 한다. 기본은 대표 표본 몇 개로 확인한다.
- 무거운 검사는 단계당 한 번 돌린다. 전체 테스트는 병합 직전에 한 번, main과 비교할 때는 실패한 테스트만 main에서 다시 돌린다.
- 코드 검토자는 바뀐 부분을 읽고 관련 테스트만 다시 돌린다. 문서 작업과 단순 병합은 별도 검토를 생략한다.
- 무거운 작업은 한 번에 하나만 돌린다. 동시에 돌리면 시간 기준 테스트가 흔들려 재실행이 늘어난다.
- 새 테스트는 계속 늘어나는 운영 데이터의 정확한 개수 대신 결함 조건(누락·중복·깨진 참조 0 등)을 검사한다.
- 긴 명령은 백그라운드로 돌리고 끝날 때까지 기다린다. 진행 확인은 필요한 줄만 본다.

## 작업별 안내

| 작업 | 먼저 읽을 문서 |
| --- | --- |
| 시험지 제작·검수 (CREATE·R1·R2·R3, Codex·ROOT) | [docs/agents/exam-pipeline.md](docs/agents/exam-pipeline.md) |
| 시험지 출고, `main` 운영병합 | [docs/agents/exam-release.md](docs/agents/exam-release.md) |
| GPT 사후 FINAL QA | [docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md](docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md) |
| GPT 예약 라인 프롬프트 개설·수정 | [docs/agents/gpt-reservation.md](docs/agents/gpt-reservation.md) |
| 문항 메타데이터 | [docs/agents/metadata.md](docs/agents/metadata.md) |
| ALIVE Generated 제작·출시 | [docs/agents/alive-generated.md](docs/agents/alive-generated.md) |
| 문제·해설 그림 (Visual·SVG), SVG 엔진 | [docs/agents/visual-svg.md](docs/agents/visual-svg.md) |
| Archive 2.0 화면·엔진 코드 | [docs/agents/archive2-code.md](docs/agents/archive2-code.md) |
| Git 저장 범위, Drive 증거, 이력 정리 | [docs/agents/git-evidence.md](docs/agents/git-evidence.md) |
| 범위 판단, 수정 책임(OWN_AND_FIX) 원문 | [docs/agents/common.md](docs/agents/common.md) |
| 도메인 이전 (wangjiedu.com) | [docs/operations/WangjiEdu_Domain_Migration_Plan_v1.md](docs/operations/WangjiEdu_Domain_Migration_Plan_v1.md) |
| 토큰 효율 상세 | [docs/agents/token-efficiency.md](docs/agents/token-efficiency.md) |

## 이 파일 관리

- 새 사용자 지시와 캠페인 규칙은 해당 영역 문서에 추가한다. 이 파일에는 날짜별 지시(`CURRENT TOP` 등)나 진행 현황을 쌓지 않는다. 모든 에이전트가 매번 읽기 때문이다.
- 끝난 캠페인 규칙은 지운다. 이력은 git에 남는다(예: NEW14 규칙 3개는 2026-10-30 사용자 결정으로 삭제했다).
- 규칙을 추가할 때는 이유를 한 줄 붙인다. 이유가 있어야 다음 작업자가 다시 조사하거나 되돌리지 않는다.
- 크기 상한, 날짜별 지시 금지, 링크 존재는 `tests/agents-md-budget.test.js`가 검사한다.
