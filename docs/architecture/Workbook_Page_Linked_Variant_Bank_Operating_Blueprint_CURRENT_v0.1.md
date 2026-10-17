# 교재 기반 유사문항 플랫폼 — 페이지·번호 출처연결 / Gemini 제작·GPT 검수 / 멀티교재 확장 v0.1

> 상태: 2026-10-17 설계 정본. 자동 예약라인 실행, Consumer 등록, 출고 또는 학생 배포 완료를 의미하지 않는다.
> 범위: 백발백중 중등을 파일럿으로 시작해 라이트쎈, RPM, 다른 중등 교재 및 고등 교재로 확장한다. 이 문서는 특정 교재 전용 규칙이 아니다.
> 정본 우선순위: 현재 Git·Notion의 Meta/Visual/교육과정 ACTIVE 실행 계약이 우선이고, Google Drive 규정 복사본은 Gemini가 읽기 위한 미러다.

## 1. 제품 목표와 사용자 동선
- 교재 원본은 Google Drive PDF로 보관한다. 기출처럼 100% 원본 JS 복원, 책 전체 JS 등록, 원본 그림 크롭을 신규 유사문항 생산의 필수 단계로 두지 않는다.
- 선생님은 교재 선택 → 판본·학년·코너 선택 → 인쇄 페이지 선택 → 학생 오답 번호 클릭 → 유사·쌍둥이 선택 → 여러 페이지의 문항을 바구니에 담아 일괄 출력한다.
- 정밀 검색에서는 RPM L1~L4, PT/TPL, CrossConcept, Condition, Integration, 난이도로 모든 교재의 신규 UID를 통합 검색한다.
- 페이지 검색과 개념 검색은 별도 원본 파일을 만들지 않고 하나의 승인 generatedUid를 조회한다. 검색 중에는 본문을 전부 로드하지 않는다.

## 2. 출처 식별자
- bookId: 출판사, 시리즈, 과목, 학년/학기, 교육과정, 교재명에 대응하는 책 식별자.
- editionId: 발행연도·판본·개정차·원본 PDF 버전을 구별한다. 제목이 같아도 판본이 다르면 다른 editionId.
- sourceLocationId: editionId + 코너/세트(A/B/C/D 등) + 교재 인쇄 페이지 + 문항 번호 + 하위 번호로 식별. PDF의 물리 페이지는 pdfPage로 별도 기록.
- Drive 원본 fileId와 파일 지문/SHA 또는 검증된 버전을 작업 원장에 보존. 같은 이름의 PDF를 동일 판본이라고 추정하지 않는다.
- generatedUid는 생성된 신규 문항 각각에 유일하게 부여. sourceLocationId 하나에 유사 1, 쌍둥이 1, 추가 변형 N개를 연결할 수 있다. variantRole과 variantOrdinal도 별도 보존한다.
- 문항의 RPM/PT/TPL과 난도는 원본 메타 자동 복사 금지. 생성된 최종 발문·풀이를 기준으로 공식 마스터와 대조한다.

## 3. 15분 예약 배치 / 4페이지씩
- 최초 운영 단위는 교재의 연속 4페이지. 백발백중 기준 약 24문항은 가정치이며 페이지별 실제 분모를 기록한다.
- A/B/C/D는 교재 안의 실제 분류 또는 서로 충돌하지 않는 네 작업 큐로 구성. 같은 sourceLocationId를 동시 선점하지 않게 lease와 배치 ID를 발급한다.
- 각 큐는 editionId, sectionId, pdfPageRange, 작업 revision을 기록하고 이미 생산 완료된 원본 번호에 재할당하지 않는다.
- 15분 스케줄은 별도 실행기/API에서 지원성을 확인해 구성한다. 현재 예약작업이 15분 실행 중이라고 주장하지 않는다.
- Gemini CREATE: 원본 위치 파악 → 일반적인 계산/기본 문항은 근거와 함께 SKIP_BASIC → 대상 문항마다 신규 유사문항, 보기, 정답, 최소 등호 풀이, 문제 SVG(필요시), 정밀 Meta 후보 생성.
- GPT REVIEW: 생성자 답·해설을 가린 채 독립 풀이 → 유일 정답/조건/학년 교육과정/계산 복잡도/학생 가용성/보기 중복/필수 SVG 의미 정확성 검사.
- 실패 UID만 FIX → 변동된 내용 재검수. 불가독 원본·지원되지 않는 SVG는 HOLD 및 마스터 수리. 통과하지 않은 문항은 등록하지 않는다.
- 제작완료 ≠ 독립검수 통과 ≠ 소비자 인덱스 반영 ≠ 학생용 출력 완료. 각 상태를 별도로 기록한다.
- 시간당 생산량: 네 큐가 각자 15분 간격 4p×약24문항이면 이론상 후보 약 384개/시간. 네 큐가 15분마다 교대로 한 번씩이면 약 96개/시간. 실측 승인량은 별도 산정한다.

## 4. 품질 범위 — 경량 독립 검수
- 정답 유일성, 논리적 조건 완전성, 교육과정 적합성, 중복/잘못된 보기, 단위 오류, 학생이 풀기 자연스러운지 확인.
- 수치 변형은 정수·약수·배수·자연스러운 유리수·깔끔한 길이/각/넓이를 선호한다. 무리한 수치, 긴 분모 계산, 불필요한 근호, 과도한 연산량, 중학교 수준을 벗어나는 풀이면 재생성.
- 해설은 식의 동치변형·등호 전개와 필수 논리 정도의 학생용 기본 풀이를 목표로 한다. 작은 칠판 장문 해설이나 QID9 A1~C3 체계를 이 라인의 기본 요구로 하지 않는다. 다만 풀이 오류·이해 불가이면 반드시 수정.
- 유명 교재 자체가 검수됐다는 사실은 수치를 변경해 새로 만든 문항의 정답·그림 검증을 대신하지 않는다.
- 신규 창작 표현을 유지한다. 유사문항이란 이유만으로 저작권 문제가 자동 해소되지는 않는다. 원문의 창작적 표현과 과도하게 유사한 단순 숫자 교체는 별도 검토한다.

## 5. 문제 SVG 핵심 하드룰
- 원본 이미지 크롭과 재현이 목적이 아니므로 생성 문항의 실제 조건으로 새 SVG를 제작한다.
- 문제 시각자료/해설 시각자료 필요성은 구분. TEXT_ONLY라면 억지로 SVG를 만들지 않는다. 시각정보가 필수라면 SVG를 만들고 검증하기 전 승인 금지.
- 필수 순서: 변경 후 발문/풀이 확정 → 독립 수학적 사실(expected facts) → Python 또는 검증된 기하 계산 → SVG 실제 좌표·선분·도형 생성 → SVG primitive 역산 검증 → 겹침·잘림·실제 렌더 검사.
- 눈대중 좌표 금지. 직각·평행·길이·교점·각도·그래프/눈금·수식과 SVG 불일치, 잘못 붙은 점 라벨, 문제용 그림의 정답 누설은 불합격.
- 기존 Visual/도형추출 CURRENT 문서의 Golden/Negative 및 physical evidence 규칙 적용. 지원되지 않는 도형 family는 있는 척하지 말고 HOLD_VISUAL.
- 기출 원본 PNG 불변 원칙은 기출의 원본 재현 작업에 적용하며 본 신규 유사문항의 새 문제 그림 생성과 구분한다.

## 6. 데이터 설계 및 기존 Archive 연결
- 원본: Drive 교재 PDF + book/edition registry + 페이지/코너/문항번호 작업 원장. 신규 생성물: 질문·보기·답·최소해설·problemImage/solutionImage·메타·approval·sourceLocationId를 가진 UID 논리 객체.
- 물리 저장: 승인 JSON 객체를 작은 shard 묶음으로 저장할 수 있다. index는 UID/메타/책·판본/원본 위치/상태/shard 주소만 담는 경량 파생 인덱스.
- UID→shard를 로드해 해당 문항만 기존 출력 envelope로 복원. 기존 Generated Consumer index/shard와 archive2-source.js 복원 구조를 토대로 어댑터 호환성 검증 후 연결.
- 임시 제작 JSON↔JS adapter는 파일럿 호환성이 필요할 때만 사용. 교재 한 권의 원본 JS를 영구 제작·보관하지 않는다.
- 지금 archive/db.js와 archive2-catalog.json은 시험지 중심이므로 이 교재 확장 기능을 위해 무리하게 사용하지 않는다.
- 스키마 신규필드와 기존 Consumer 컬럼 사이 호환성·공식 Generated approval/rights/visual index parity는 구현 전 별도 확인. 설계 예시를 이미 서비스에서 지원하는 필드라고 주장하지 않는다.

## 7. 필독/참고 문서와 복사본 정책
- 작업 전: 이 설계서 → JS아카이브 룰북/Meta Foundation/표준단원 마스터·세부단원 규칙 → 도형추출 및 시각품질 정본 → 배정 교재 실제 PDF 페이지 순서.
- canonical Git 메타 필독: https://github.com/icefoxtail/AP------/blob/main/docs/architecture/JS_Archive_Metadata_Required_On_Create_Edit_Review_CURRENT_v1.md
- Notion 필독 라우터: https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd
- Notion Archive 시작: https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398
- Drive 미러: https://drive.google.com/drive/folders/1JNSkaBc3zuSc8JESm9cFUbgDjAxJcLpw
- Gemini도 Drive 공유 문서의 실제 내용을 읽었는지 파일 ID, 버전, 작업 적용 항목을 배치 원장에 기록해야 한다. 파일 검색 가능과 문서 숙독은 다르다.
- Drive 복사본은 REFERENCE_COPY이며 정본과 자동 동기화된다고 가정하지 않는다. 최종 권위는 최신 ACTIVE Notion/Git이다. 원본을 이동/삭제하지 않는다.

## 8. 파일럿과 구현 순서
- P0: 원본 PDF 판본/코너/인쇄 페이지와 PDF 페이지 매핑, 문항 수·기본 제외 기준 확정.
- P1: 4페이지 × 4큐 Gemini 생성/ GPT 독립검수/표적수정/승인 객체를 파일럿으로 검증.
- P2: 정밀 Meta + Source 위치 sidecar + 승인 Consumer shard/index 및 UID 정합성 확인.
- P3: 교재→페이지→원본 문항번호 클릭 UI, 유사/쌍둥이 선택·누적 바구니·일괄 출력 구현.
- P4: 라이트쎈/RPM/중고등 다수 교재 확장, 계산예산·SVG 난도별 규칙 및 외부 예약 스케줄 실가동.
- KPI: 원본 대상·기본 제외·제작 후보·블라인드 통과·수정률·SVG 오류·계산 부담 오류·출처 위치 누락·승인 UID·실제 검색/출력 성공을 별도 집계.
- 현재 확인된 Drive 문제집 폴더는 https://drive.google.com/drive/folders/1K7xH5Sse18jPFLe8hmQiVBC-c_CZF4Np 이며 다수 백발백중 PDF를 확인했다. 사용자가 언급한 108종 전체를 동일 위치에 전수확인한 것은 아니다.

## 9. 단계 상태 계약
QUEUED → CLAIMED → GENERATED → BLIND_REVIEW → (FIX_REQUIRED → REGENERATED → BLIND_REVIEW) → APPROVED → CONSUMER_REGISTERED → INDEX_VERIFIED → OUTPUT_VERIFIED.
예외 상태: SKIP_BASIC, SOURCE_UNREADABLE, HOLD_VISUAL, HOLD_MATH, HOLD_RIGHTS. 각 원본 문항 위치는 어느 상태인지 반드시 남는다.
