# 중1 기존 기출 메타 의미 재검토 — CURRENT

## 우선순위 변경 — 2026-11-13

사용자 최신 지시로 중1~중3 전6권 RPM L1/L2 정비를 먼저 진행한다. 별도 브랜치 `fix/rpm-middle-l1-l2-20261113`의 운영병합 후 이 작업으로 돌아온다. 시험지 완료는 여전히 0/44다. 첫 신흥중 24문항의 발문·문제 그림·풀이 읽기 기록은 [부분 검토 체크포인트](01-shinheung-semantic-read-checkpoint.json)에 보존했다. 기존 분류 대조·수정·PR은 미완료다. 같은 source blob의 읽기를 처음부터 반복하지 않고 남은 대조부터 재개한다.

## 현재 위치

- 작업: 중1 기존 기출 44시험지 · 1,047문항. 기준 main `a6708a849faca7ccfd438937138d7e88bd5ee23c`.
- 작업 브랜치: `review/m1-existing-meta-20261113`.
- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner: `GPT_ROOT_933015CD0A4F`.
- 완료: 0/44. 현재: 1번 `26_신흥중_2학기_중간_중1_기출.js` 24문항 검토 중.
- 정확한 진행/원본 blob/미완료/다음 순서의 단일 원장: [progress.json](progress.json).

## 실행 범위

사용자의 2026-11-13 지시로 기존 값·기존 PASS 여부와 관계없이 전 문항의 발문·그림·풀이 의미를 읽고 단원·소단원·RPM L1~L4·관련 메타를 비교한다. 기존 값이 맞으면 KEEP, 명백한 오류만 최소 수정한다. 정상 content/choices/answer/solution/image/layoutTag/wide/UID/provenance는 보존한다. R1/R2/R3 전면 재실행·정상 문항 재풀이·빈 메타 일괄 채우기는 이 작업이 아니다.

연도 내림차순, 같은 연도는 2기말→2중간→1기말→1중간, 같은 시험 시기는 학교명 가나다순. 현재 2026년 기말 파일은 없고 2중간 3개부터 시작한다. 인벤토리는 실제 Git 트리·VM 문항 배열로 확인했다.

## 한 시험지 마감 순서

1. latest main을 받고 해당 source blob·병행 PR/메타 요청의 정확한 범위를 확인한다. 완료 source가 그대로면 다시 검토하지 않는다.
2. source content/visual/solution을 읽어 핵심 풀이와 결정 단계를 문항별로 먼저 기록한 뒤 기존 분류·현재 canonical/실제 검색 연결을 비교한다. 같은 시험지 안의 문항만 분담한다.
3. 명확한 오분류만 source 지원 필드 또는 공식 시험지별 소형 요청으로 고친다. 공용 question_metadata/catalog/compiled 직접 편집 금지. 소스에 쓴 메타 변경과 같은 인박스를 중복 제출하지 않는다.
4. 변경 필드 allowlist, 문제·답·해설·자산 참조 보존, syntax, 해당 canonical/parent 및 직접 영향만 검사한다. 변경 source가 고정된 테스트/증거가 있는지 확인한다.
5. 그 시험지의 PR→main 병합→원격 main SHA와 변경 blob 확인. 한 시험지를 마친 뒤에만 다음 시험지로 간다. 무수정 시험지는 NO_CHANGE_MAIN_DONE 기록으로 마감한다.
6. progress.json·이 README·시험지별 검토 기록을 커밋·push하고 AWCR append-only checkpoint를 readback한다. 완료 선언과 실제 검증 범위를 구분한다.

## 병행 작업·정본 공백

- 별도 빈 메타 채우기는 `docs/agents/metadata.md`의 2026-11-11/12 결정에 따라 빈 값만 처리하며 고1·고2 우선이다. 여기서는 기존 값의 오분류를 고친다. 같은 UID/필드의 신규 병행 변경이 보이면 재조회 후 충돌을 기록하고 덮어쓰지 않는다.
- 초기 열린 PR #1952는 REVIEW2 등록기 개선이며 이 작업에서 수정하지 않는다.
- 작도/합동의 공식 소단원·RPM 연결 공백을 조사 중이다. 필요한 키/연결이 없으면 틀린 대체 키로 완료 처리하지 않고 정확한 필드·사유·다음 조치를 기록한다.

## 인계

다음 작업자는 progress.json의 `currentOrder`와 미완료 상태부터 이어간다. 현재 task에 합류할 때만 AWCR의 정확한 taskId/revision/raw SHA를 확인한다. 다른 task와 합류하지 않는다. 현행 완료표는 새 시험지 추가나 다음 학년/학기로 확장할 수 있으나 현재 승인 범위는 중1 전체뿐이다. 중1 완료 뒤 다음 학년을 자동 시작하지 않는다.

이미 확인한 진입: Notion 00 라우터(3e10e68bd69f81f19397e7cd1c8d3cfd), Archive 시작(3e10e68bd69f81898cc8fb85cb4b1398), 생명주기(3e10e68bd69f81fdb161ffc3f6227b6e), 02-01/02-06/02-07. Git 권위: AGENTS.md, docs/agents/metadata.md, Metadata Required CURRENT v1.2, Single Entry Resolver v1.0, FINAL QA card v2.0.1. 사용자 명시 전수 의미 검토·연속 진행·브랜치 인계 저장이 기본의 제한된 분모·중간 STOP보다 우선한다.

main 병합, 의미 검토, 자동등록 성공, 배포 성공은 각각 증거로 따로 기록한다.
