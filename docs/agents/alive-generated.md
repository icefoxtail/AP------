# ALIVE Generated 제작·출시

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — 실제 정본 숙독·제작 설계·UID별 품질 근거 (2026-10-14)
- **ALIVE/QID9 제작 시 역할별 선행:** 현재 ALIVE QID9·Meta·교육과정·해설·Visual/Golden 정본 중 **해당 제작 단계에 실제 적용되는 것만** 읽고 경로·SHA/적용 조항·실행 계획을 기록한다. 일반 FINAL QA나 다른 캠페인에 이 제작 전용 필독을 확대하지 않는다. 제목·목차만 훑고 읽었다고 선언하지 않는다.
- **제작 전에 설계:** 원본 qid·교육과정 내 풀이·고정 RPM Primary L3·L4·A/B/C의 실제 추가 사고·보기/정답 구조·문제/해설 SVG 필요성을 먼저 정한다.
- **UID별 증거 5축:** (1) 학습 level과 평가 difficultyBucket을 사고 단계·조건 분기·함정으로 독립 판정하고 각각 이유 기록(A/B/C 순서 자동 매핑 금지). (2) RPM L1~L4·PT/TPL·CrossConcept/Condition/Integration의 최종 풀이상 실제 필요성과 키의 정본 근거. (3) 해당 학년 교육과정 허용 공식/방법 및 학생 재현 가능한 해설·모든 보기와 조건 검증. (4) 문제 SVG (5) 해설 SVG 각각 필요성·실파일/SHA·좌표/primitive·라벨·경계점·가독성·실제 렌더 근거.
- **종료 조건:** 근거 없는 PASS 금지, 미확정 EVIDENCE_DEBT, 미실행 NOT_RUN. 변경 UID와 직접 의존 부분만 재검한다. 기존 예약 Library 인계/수동 Git 운영 경로 및 독립 검수 규정을 유지한다.

## CURRENT HARD — 승인 프로덕션에서 학생 조회 데이터 자동 생성·출시 결속 (2026-10-10 사용자 직접 지시)
- 승인된 Generated 프로덕션 문항과 학생 사용 가능 문항을 별도 수동 등록 상태로 관리하지 않는다. 문항 프로덕션 파일과 UID별 승인 기록이 authority이며, 학생 검색 index/Consumer는 여기서 자동 생성하는 조회 데이터다. 승인 문항을 다시 승인하거나 `NOT_REGISTERED` 보고만 남기고 종료하지 않는다.
- 실행 정본: `docs/architecture/Approved_Generated_Source_Derived_Student_Projection_RELEASE_CURRENT_v1.md`. 지원되는 QID9 생산 형식은 main 출시 빌드에서 자동 projection 생성 → 승인 UID 누락 0·Source/Meta/asset 결속 검증 → 실제 Chrome·runtime 검사 → 검증된 사이트 배포를 모두 닫는다. 미지원 승인 형식을 조용히 누락하지 말고 해당 compiler를 보강한다.
- Git 병합과 학생 사이트 배포를 구분한다. 승인 파일만 main에 들어갔다는 이유로 완료하지 않으며, 실패한 빌드는 기존 정상 사이트를 유지한다. 정확한 main SHA, 실제 배포 run, 학생 조회·선택·출력 evidence가 있어야 출시 완료다. 조회 파일을 수동으로 수정해 승인 authority와 분리하거나 실패 gate를 약화하여 통과시키지 않는다.

## CURRENT HARD — 다음 학교부터 ALIVE CREATE 중 해설 SVG 동시 제작 (2026-10-10 원장 지시)
- **적용: 팔마고 다음에 신규 착수하는 모든 학교 시험지의 ALIVE Generated 생산**(QID9/LITE 의미확장 공통). 제작자/작업자는 학교 작업 최초 진입에 기존 `.codex/skills/apmath-visual-upgrade/SKILL.md`, GPT Visual Contract, `도형추출.md`, 도형의방정식 해설 SVG 규정, **사용할 renderer schema/지원범위**를 필독하고 read receipt를 남긴다.
- **문항·발문·해설 작성 중** 문제용 시각정보와 해설용 SVG를 각각 결정하고, SVG 필요 시 같은 원본 qid의 CREATE closure 안에서 기존 엔진으로 사실 동결→spec→실파일 제작→좌표/semantic QA→UID/asset 결속을 완료한다. 도형의 방정식 H22-C2-01~04는 시각화 기본 필수, 예외는 수학적으로 좁게 기록. SVG 누락인데 TEXT_ONLY라고 정상완료 금지.
- **팔마고 기존 QID9 제작분은 적용 제외**: 형님이 별도 SVG 엔진 보강라인에 맡긴다. 기존 승인·문항은 일괄 재제작하지 않는다.
- 실행 정본: `alive/06_EXECUTION/ALIVE_NEXT_SCHOOL_CREATE_WITH_SOLUTION_SVG_CURRENT_v1.md`. 기존 엔진의 실제 미지원 family를 ACTIVE라 속이지 않고 HOLD/기존 대체 backend 경로로 마감하며, 실제 하지 않은 Chrome/Consumer 검사를 PASS라 표시하지 않는다.
