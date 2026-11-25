# AGENTS.md — 작업 안내판

이 파일은 안내판이다. 링크 문서는 자동으로 읽히지 않으므로 직접 읽는다. 충돌하면 영역 문서가 우선한다.

## 첫걸음

1. 최신 사용자 지시에서 대상·작업 종류·종료 조건을 먼저 확인한다.
2. 아래 표에서 해당 영역 문서를 열어 끝까지 읽고 시작한다. 시험지·메타·ALIVE·출고 작업이면 [docs/agents/common.md](docs/agents/common.md)(범위 판단·OWN_AND_FIX 원문)도 함께 읽는다. 관계없는 영역 문서는 열지 않는다.
3. 하위 폴더에 `AGENTS.md`가 있으면 그 범위에서 함께 따른다.

## 모든 작업 공통

- **목표·방법 재검토:** 사용자의 결과·명시 고정 요구와 제안된 실행 방법을 구분한다. 방법을 정답으로 전제하지 말고 실제 근거로 더 나은 선택을 검토한다. 이유: 사용자는 기술적 작업 설계까지 책임질 필요가 없다. [공통 판단 계약](docs/agents/outcome-method-review.md) 본문을 읽고 적용한다(읽은 판본 재사용, 접근 실패는 미적용 기록).
- **쉽게·넓게·빠르게·변화하게:** 절차를 새로 만들지 않는다. 값이 있으면 쓰고 실제 결함만 막는다. 사용 속도가 먼저다. main에서 이어받은 CI 실패는 병합을 막지 않고 내 PR의 실패만 고친다. 자료 PR은 등록기가 쉴 때 한 건씩, 그 밖은 바로, 각 라인이 직접 병합한다. **고정이 없다:** 문항·그림·해설은 바뀔 수 있고, 바뀌는 것을 막는 고정(바이트 고정·내용 고정 검사·원본 오류 보류)을 두지 않는다. 이미 들어온 시험지의 수정은 수정 프로토콜 → 작업자 재량 → 원본 대조(참고) 순이다(원문: [common.md](docs/agents/common.md) 맨 위 절). 이유: 절차가 늘면 문항을 못 쓴다. 원장님 결정 2026-11-24.
- **학생 결과 우선:** 문항·정답·해설·이미지/SVG 검수는 현행 JS와 실제 자산으로 학생이 문제를 풀고 해설을 이해할 수 있는지, 수학·교육적 정확도를 우선 판단한다. 원본은 필요할 때 사실·출처를 대조하는 근거이지 동일성 자체가 합격 기준은 아니다. 승인된 교정·생성본은 원본과 다르다는 이유만으로 되돌리지 않는다.
- **난이도는 정수 1~5만 쓴다:** 새 문항에 하/중/상(`level`)을 쓰지 않는다. 이유: 두 칸이 어긋나게 채워졌다. 상세: [docs/agents/metadata.md](docs/agents/metadata.md#난이도는-정수-15만-2026-11-18-21시-kst부터-적용)
- **해시와 검수 유지:** SHA·해시는 버전·출처·검증 대상을 잇는 근거로 유지하되 승인된 변경으로 값이 바뀔 수 있으므로, 차이만으로 오류를 확정하지 않는다. 각 영역의 승인·보호 필드·무결성·필수 자산 요구를 지킨다. 실제 오류·필수 자산 누락은 검수 범위에 두고, 검증·검수·보안 기준은 삭제·우회·완화하지 않는다.
- **범위:** 최신 지시의 대상과 종료 조건을 따른다. 한정 수정은 지정한 대상과 꼭 필요한 직접 의존 부분만 고치고, 범위 밖에서 발견한 것은 보고만 한다(넓히려면 사용자 승인).
- **정직한 기록:** 실행하지 않은 검사는 `NOT_RUN`, 근거가 부족한 판단은 `EVIDENCE_DEBT`로 남긴다. 근거 없는 PASS, 추정 메타값, 가짜 `NONE`을 쓰지 않는다.
- **아카이브 결과물 메타:** 기출·유사·ALIVE·교과서·문제집·교재/평가 문항을 작성·검수할 때는 [메타 안내](docs/agents/metadata.md)의 공통 계약에 따라 JS·확장 메타·4칸·작성/검토 기록을 함께 인계한다.
- **검사를 약하게 만들지 않는다:** 테스트·검사를 생략하거나 격리하지 않고, 분모를 줄이거나 기준을 완화해 통과시키지 않는다.
- **새 테스트 파일은 목록의 한 칸에 둔다:** `tests/test-inventory.json`의 run(`tests/` 바로 아래 *.test.js는 자동)·elsewhere·notRun 중 하나여야 한다(`docs/agents/token-efficiency.md` §11). 이유: 실행기에 없는 테스트가 수백 개 꺼져 있었다.
- **병합과 배포는 따로 기록한다:** `main` 반영은 사용자 승인 범위와 해당 작업의 필수 검사·병합 조건을 지킨다. CI·Pages·학생 배포 결과는 사실대로 따로 남긴다. 보호 규칙 우회, 강제 push, 다른 사람 브랜치의 이력 재작성은 하지 않는다.
- **Git에는 운영물만 둔다:** 운영 소스·자산·런타임·빌드/테스트 도구·현행 계약만 커밋한다. 원시 이력·캡처·로그·렌더 출력 같은 증거는 Drive에 둔다(허용된 cold root와 절차: `docs/agents/git-evidence.md`).
- **루트 폴더는 main 전용:** 본 체크아웃에서 커밋·브랜치 전환·파일 편집 금지. 자기 worktree에서 작업한다(상세: `docs/agents/git-evidence.md`). 이유: 루트가 main보다 1,679커밋 뒤처진 다른 브랜치가 된 일이 있다.
- **워크트리 정리:** 내 PR이 `main`에 병합되면 그 작업 워크트리는 바로 지운다. 남의 것·미병합 커밋이 있는 것은 지우지 않고 보고한다(절차: `docs/agents/git-evidence.md`). 이유: 워크트리 하나가 약 7GB라 C 드라이브가 찬 적이 있다.
- **공유 데이터 고정값:** 원본 시험지 JS·공유 크로스워크·생성문항 Meta를 바꾸면 `docs/agents/common.md` "공유 데이터 고정값" 절을 따르고, PR CI의 실패는 병합을 막지 않고 수리 목록으로 넘긴다(먼저 병합, 수리는 마지막에 관제가: 같은 문서 맨 위 절). 이유: 해시 고정값이 정상 수정에 깨져 main CI·배포가 막힌 적이 있다.
- **새 SVG는 엔진으로만:** 문제·해설 그림을 새로 만들 때는 어떤 작업이든 저장소 SVG 엔진으로 만들고, 손·스크립트 조립 SVG는 넣지 않는다. 엔진이 못 그리면 엔진을 고친다(`docs/agents/visual-svg.md` 맨 위 절). 이유: 직접 조립한 그림은 검증되지 않는다.
- **Archive 2.0 코드:** 화면·검색·출력·저장 코드를 바꾸면 먼저 `docs/rules/01_CANONICAL/Archive2_Runtime_Responsiveness_and_Original_Source_Contract_v1.md`를 읽는다. 병합 전에 `node tools/check-archive2-runtime.cjs`를 통과시키고, 흐름을 바꿨으면 실제 Chrome으로 확인한다. 원본 기출은 `engine.html?data=exams/<file>&mode=exam|sol|ans`로 바로 열리게 유지한다.

## 토큰 효율

정해진 검사·검수(테스트·런타임·R1/R2 전 qid 검수 포함)는 줄이지 않는다. 그 밖의 방식·소요 시간은 `docs/agents/token-efficiency.md`와 아래를 따른다.

- 추가로 하는 전수 측정은 사용자가 요청했거나 개수 자체가 결과물일 때만 한다. 기본은 대표 표본 몇 개로 확인한다.
- 무거운 검사는 단계당 한 번 돌린다. 전체 테스트는 병합 직전에 한 번, main과 비교할 때는 실패한 테스트만 main에서 다시 돌린다.
- 코드 검토자는 바뀐 부분을 읽고 관련 테스트만 다시 돌린다. 문서 작업과 단순 병합은 별도 검토를 생략한다.
- 무거운 작업은 한 번에 하나만 돌린다. 동시에 돌리면 시간 기준 테스트가 흔들려 재실행이 늘어난다.
- 새 테스트는 계속 늘어나는 운영 데이터의 정확한 개수 대신 결함 조건(누락·중복·깨진 참조 0 등)을 검사한다.
- 긴 명령은 백그라운드로 돌리고 끝날 때까지 기다린다. 진행 확인은 필요한 줄만 본다.

## 작업별 안내

| 작업 | 먼저 읽을 문서 |
| --- | --- |
| 현행 규칙 한 권 (우선 적용) | [docs/rules/RULEBOOK_CURRENT.md](docs/rules/RULEBOOK_CURRENT.md) |
| 문항 JS 한 흐름 (발문→게시) | [정본](docs/agents/question-js-flow.md) |
| 작업 지시서·방법 검토 (공통) | [공통 판단 계약](docs/agents/outcome-method-review.md) |
| 시험지 제작·검수 (CREATE·R1~R3) | [docs/agents/exam-pipeline.md](docs/agents/exam-pipeline.md) |
| 시험지 출고, `main` 운영병합 | [docs/agents/exam-release.md](docs/agents/exam-release.md) |
| GPT 사후 FINAL QA | [docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md](docs/operations/JS_Archive_FINAL_QA_EXECUTION_CARD_CURRENT.md) |
| GPT 예약 라인 프롬프트 개설·수정 | [docs/agents/gpt-reservation.md](docs/agents/gpt-reservation.md) |
| GPT 유사세트 난도 믹서 | [운영계약](docs/agents/gpt-similar-difficulty-mixer.md) |
| GPT 유사 실행 | [프롬프트](docs/agents/gpt-similar-exam-execution-prompt.md) |
| 문항 메타데이터 | [docs/agents/metadata.md](docs/agents/metadata.md) |
| ALIVE Generated 제작·출시 | [docs/agents/alive-generated.md](docs/agents/alive-generated.md) |
| 유사·생성 문항 보기와 정답 번호 | [docs/agents/similar-choices.md](docs/agents/similar-choices.md) |
| 문제·해설 그림 (SVG 엔진) | [docs/agents/visual-svg.md](docs/agents/visual-svg.md) |
| Google AI Studio 유사 생성·반입 | [docs/agents/aistudio-similar.md](docs/agents/aistudio-similar.md) |
| 시험지 표 (AP Table Engine) | [docs/agents/table-engine.md](docs/agents/table-engine.md) |
| Archive 2.0 화면·엔진 코드 | [docs/agents/archive2-code.md](docs/agents/archive2-code.md) |
| Git·Drive 증거·이력 정리 | [docs/agents/git-evidence.md](docs/agents/git-evidence.md) |
| 범위 판단, 수정 책임(OWN_AND_FIX) 원문 | [docs/agents/common.md](docs/agents/common.md) |
| 도메인 이전 | [docs/operations/WangjiEdu_Domain_Migration_Plan_v1.md](docs/operations/WangjiEdu_Domain_Migration_Plan_v1.md) |
| 토큰 효율 상세 | [docs/agents/token-efficiency.md](docs/agents/token-efficiency.md) |

## 이 파일 관리

- 새 사용자 지시와 캠페인 규칙은 해당 영역 문서에 추가한다. 모든 라인에 필요한 간결한 공통 우선순위는 `모든 작업 공통` 절에 둘 수 있다. 이 파일에는 날짜별 지시(`CURRENT TOP` 등)나 진행 현황을 쌓지 않는다. 여러 실행기의 공통 진입 문서이기 때문이다.
- 끝난 캠페인 규칙은 지운다. 이력은 git에 남는다(예: NEW14 규칙 3개는 2026-10-30 사용자 결정으로 삭제했다).
- 규칙 추가 시 이유 한 줄을 붙여 불필요한 재조사를 줄인다.
- 크기 상한, 날짜별 지시 금지, 링크 존재는 `tests/agents-md-budget.test.js`가 검사한다.
