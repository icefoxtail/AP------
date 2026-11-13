# 중1 기존 시험지 메타 검토 인계

## 현재 상태

- taskId: `f46ac6a5-f2f7-4ae1-a0af-5806b87de808`, owner: `GPT_ROOT_933015CD0A4F`.
- 저장소: https://github.com/icefoxtail/AP------
- 담당 브랜치: `review/m1-existing-meta-20261113`.
- 큐: `progress.json`의44장/1,047문항. 연도 DESC → 학기 DESC → 기말 먼저 → 학교명 순서.
- **운영 완료1장(신흥중24), 남은43장. 현재2번 왕운중23의 전체 읽기 완료, 의미 판정은 확정했고 등록은 준비 중.** 전체 읽기47문항이며 완료 문항24와 구분한다. 다음 시험지를 시작하지 않는다.
- 최신 확인 main: `33f26c795e7a86fc3b63737996c6885cff4c7bba`; 실제 첫 시험지 등록·Consumer snapshot: `cb3e9ecd54a16ee0e87c354df1e9c9a61d2dd2c4`.
- 이전 검증된 원격 체크포인트: `36ed7902d71bccf3645e40674ab6d8ae7e894646`. 새 읽기 snapshot의 실제 게시 commit은 fetch한 이 브랜치와 다음 AWCR revision에서 확인한다.
- AWCR 최신 검증 r15: file `1ypZHzLY4zX4LFPBUnQenHeAi2ZVNQ76Z`, raw SHA256 `a45d9c1d95d473aee747f61d193c2725076770d7fc22e69e8b75fb72417103b7`. 다음 r16에는 새 원격 읽기 checkpoint와 미완료 단계를 기록한다.

**현재 의미 정본은 [revision2](02-wangun-semantic-review-rev2.json)다.** 추출 배열 순서를 문항 번호로 잘못 사용한 후보 UID 연결을 현재 metadata/identity의 명시적 sourceOrdinal로23개 모두 재결속했다. [정정 근거](02-wangun-uid-association-correction.json)를 확인하고 이전 원장의 UID로 등록하지 않는다. 의미 판정·읽기 근거·정상 데이터는 그대로이며 정정 전에 source/정본/등록 적용은0이었다.

## 완료 재사용

RPM6권 L1/L2 선행 작업 PR1958 완료. 인계 branch `fix/rpm-middle-l1-l2-20261113`, head `3292dc0b5457d8f6f1a491f7f4866fe5be4082b7`. 24L1/54L2, 326leaf 보존. 2015를 2022로 재표기하지 않는다.

신흥중은 [운영 마감 근거](01-shinheung-operational-closeout.json)가 최종 기준이다. PR1960/1961의 거부와 PR1964 rev3의 성공 이력은 `progress.json` 및 개별 frozen evidence에 보존되어 있다. 이미 끝낸 문제 읽기·PR·등록을 반복하지 않는다. 실제 등록24/runtime24/정본17, 최종 Consumer24/24 PASS, exact RPM22/debt2. 원본 최종 blob `a8de75bc9cc2b6a4479866d75b8ebec637404a04`, raw SHA `ed814badbe74c42dc9c1908ad8094fbf9bbe2f3fed7c6cfdafbf2cac88e6b4ef`. cb3→33은 writer 상태2파일만 바뀌어 [근거](01-shinheung-main-cursor-only-advance.json)로 실제 검증을 재사용했다.

## 현재 왕운중23

- Source: `archive/exams/original/middle/m1/2mid/26_왕운중_2학기_중간_중1_기출.js`.
- 읽은 blob: `76377173ecb0ba989188561bbefac2afb3232479`; raw SHA256: `165bed044a8d530ce79a03ceee5b29d8ea21e068295ae1fd75419a5ae2fbef37`.
- [전체 읽기 checkpoint](02-wangun-semantic-read-checkpoint.json), [외부 그림33개 해시](02-wangun-figure-read-evidence.json).
- Part A: [Q1–8](02-wangun-q01-q08-review.json), Part B: [Q9–16](02-wangun-q09-q16-review.json), Part C: [Q17–23](02-wangun-q17-q23-review.json). 이들은 독립/담당별 후보 원장이다. root의 최종 판정은 [02-wangun-semantic-review-rev2.json](02-wangun-semantic-review-rev2.json)에 root가 확정했다.
- root는 전체23 text/solution을 읽고 Q4/Q11/Q14 및 담당Q19–23 실제 그림을 추가 확인했다. 담당자들이33개 고유 그림을 모두 실제 열람했다.
- Q19는 중앙값 조건 복원/RPM223, Q20는 계급 도수 비교/RPM227로 root와 독립 검토자가 일치했다. 도표 외형만 보고 히스토그램231을 유지하지 않는다.
- 새 후보 key는 작도 순서Q1, 그래프 성질Q7, 작업량 반비례Q10, 반비례 열린영역 자연수점Q14, 비례 그래프 좌표·수평선분분할Q22이다. 공식 등록 전 운영 활성으로 주장하지 않는다.
- 기존 skeleton 재사용: Q4 꼬인 모서리 분류, Q6 표 완성, Q8 반비례 상수 대입, Q11 선분 관계→SAS→대응, Q23 정삼각형 SAS 대응. 숫자·응답형식 차이로 key를 증식하지 않는다.
- 후보의 `crossConceptKeys`에 PT_*가 제시된 부분은 최종안에서 실제 CC registry로 교정해야 한다. 정본 integrationPattern은 NONE/SEQUENTIAL/INTERDEPENDENT/REINTERPRETATION/CASE_BRANCH/DEEP_COMPOSITE뿐이다.
- 최종 의미 원장은 확정했다. 아직 source/정본 변경, 공식 등록, Consumer preflight, 왕운 PR은 없다.

## 공용 의존과 병행 작업

[PR1965 검토](02-pr1965-review.json): 기존 GRAPH_RELATION/PARAMETER_EVALUATION binding의 `中1 수학` 오타가 Q6/Q8을 막는다. 정상 coordinate-plane 소단원으로 임의 이동하지 않는다. 정정은 기존승인/out-of-scope 보존 경로로 먼저 처리하고 그 결과 main에서 일반 왕운 요청을 만든다. PR1965의 현재 head `9f82851d9807ffd04952a43874622e9d331e038b`, 공개 source/request 직접 겹침0. 다른 담당의 비공개 로컬 작업은 추정하지 않는다.

CI 실패는 신흥중 Q20의 실제 FINAL_QA를 오래된 middle-geometry runtime test가 META_PIPELINE_AUDIT로 고정 기대하는 한 건이다. root의 exam_reviewer 보조 담당이 이 테스트 한 파일의 수정 후보를 실제 영수증·현재identity 결속으로 확인했다. 그동안 PR1965도 같은 테스트를 고치고 native 영수증 재사용 보호를 추가했으므로 root의 중복 tracked patch는 scratch에 보존한 뒤 원복했다. 추가 head의 [검토](02-pr1965-head9f828-review.json)와 CI 완료를 확인하여 단일 변경을 재사용한다. 실패를 과거 Gangnam source mismatch와 혼동하지 않는다. 기존 승인 규칙/소비자 검사를 완화하지 않는다.

기존 PR1751 head가 그대로이면61개 요청 중 실제 큐 중복은17·20·24·38·39·40이다. 해당 차례 전에 최신 source/request/receipt를 다시 확인한다. 24번의1751 expectedblob은 현재원본과 달랐다. PR1959는2024향림중(24번) 문제그림만 담당하나 현재head는9a3078b92ddd2730af5fc5e3eb8bb1a55664e925로 전진하여 image연결도 변경했다. 그 차례에는 source와 그림 모두 최신해시로 읽는다. 현재2026왕운/신흥과 직접겹침은 없다. PR1952 REVIEW2 완화는 이 작업의 승인경로로 채택하지 않았다.

## 다음 실행 순서

1. Notion 필독 라우터/시작/생명주기 및 AWCR의 이 task 최신 safe checkpoint, Git main/담당 remote head를 확인한다. 같은 task의 완료단위는 근거 해시가 같으면 재검토하지 않는다.
2. 왕운 최종 의미 원장을 재사용한다. Q2 integration NONE과 Q22새 skeleton은 root 및 독립 담당자가 이미 확정했다. Q2는 정확한 도구 역할 RPM leaf가 없으므로 debt; 일반CC는 실제 정본키로만 채운다.
3. 직접 실패한 runtime test를 정확 영수증검증으로 고치고 필요한 공용PR1965/과정명 정정 등록을 완료한다. 범위를 겹쳐 덮어쓰지 않는다.
4. 원본의 분류·관련메타만 최소수정한다. 문제·선지·답·해설·그림·UID·배점·난도·source reviewStatus는 보존한다. 메타 전수확정 후 tagConfidence/tagStatus만 공식메타 FINAL_QA annotation에 맞춘다. 수학 FINAL_QA 플래그는 만들지 않는다.
5. 현재 exact source/정본 기반 v2 요청을 만들고, 격리 공식 등록→카탈로그→전체23 Consumer와 RPM 부모 연결을 확인한다. dry-run/PR CI가 실제등록을 대신하지 않는다. 필요한 key/binding은 add-only이며 잘못된RPM leaf는 null/debt.
6. 한 시험지 PR→main 병합→single writer 실제REGISTERED 영수증→AutoMeta 이후23 Consumer→원격main SHA를 확인한 뒤만 완료체크. frozen 근거와 인계 및 AWCR 다음revision을 기록·재읽기한다.
7. 그다음3번2026팔마중으로 이동. 이후학년/학기는 같은 큐·완료체크·SHA·명시적debt를 포함한 별도scope 인계로 잇는다.

## 재사용 도구와 실행 주의

- `checkpoint-tools/extract-reviewed-exam-projections.py`: 큰metadata/identity에서 대상시험지의 현재행만 추출.
- `checkpoint-tools/build-reviewed-exam-v2-request.mjs`: 실제root확정/evidence/source 보존을 결속하는 요청builder. 공식등록기가 최종권위. Q16부모label공백 정규화는PR1965와같은좁은처리만필요할수있다.
- Shell은 `login:false`. Git push 인증은없으며GitHub tree/commit/ref API의expected_sha lease로게시한다. 검증한local stagedtree와서버tree가같아야한다. 성공한원격raw/head/tree를다시읽는다.
- `m1-registration-repro`는과거첫시험지격리검증의dirtytree이다. main으로간주하지말고, 재사용시이task소유변경임을확인·보존후정리한다. 다른작업tree는만지지않는다.
- 모든artifact는Git에보존하며AWCR는metadata whitelist만기록한다. 원문/답/풀이/credentials/raw로그는AWCR에넣지않는다.

## 새 대화 복사용 프롬프트

> 저장소 icefoxtail/AP------의 중1 기존시험지 전체메타 재검토를 이어서 진행해 주세요. taskId f46ac6a5-f2f7-4ae1-a0af-5806b87de808, owner GPT_ROOT_933015CD0A4F, branch review/m1-existing-meta-20261113입니다. Notion 라우터와 AWCR 이task최신revision, 원격main/브랜치를 확인한 뒤 docs/operations/m1-meta-review-20261113/HANDOFF.md와progress.json을 읽으세요. 신흥중24는 실제운영마감 완료이므로 반복하지 않습니다. 현재2026왕운중 중1 2학기 중간23은 전부읽고후보근거를동결했으며 의미확정·과정명정정의존·등록·PR/main 마감이남아있습니다. 정확source/그림hash가같으면읽기근거를재사용하세요. 별도빈메타작업과겹치지않게한시험지씩끝내고, 최신년도내림차순으로44장완료까지추가승인없이이어가세요. R1/R2/R3전수재실행금지, 정상데이터보존, missingRPMleaf는debt유지, exact전체Consumer·원격SHA·인계체크포인트를남기세요.
