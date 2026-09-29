# 아카이브 시험지 저장 기능 상세 구현 계획

작성일: 2026-09-29

상세 설계 완료: 2026-09-29. 상태: 로컬 구현 완료, 운영 적용 전. 아래 기능 합의와 함께 문서 후반의 데이터 구조·API·변경 파일·구현 순서·검증 기준을 구현 기준으로 사용한다.

사용자 요청에 따른 범위 조정: 학생 배포는 기존 아카이브 기능을 그대로 재사용한다. 이번 개편의 중심은 완성 시험지 저장과 저장본을 다시 여는 기능이다. 아래 내용을 이 범위에 맞춰 수정했다.

## 사용자 목표

문제지를 만들어 보관하고, 원하는 시점에 선택한 학생에게 배포한다. 같은 문제지를 다른 학생에게도 배포할 수 있어야 하며, 교사는 배포 직후 누구에게 배포됐는지 확인할 수 있어야 한다.

이번 검토는 사용자가 제공한 제작 화면과 현재 저장소의 코드에 한정한다. 로그인된 서비스에서 실제 학생 배포를 실행하거나 전체 흐름을 캡처하지 않았다. 운영 데이터와 코드는 변경하지 않았다.

화면 근거: [제작 화면](../reports/archive-paper-flow-20260929/01-compose-provided.png)

## 확인한 문제

1. 제작 화면에 문항 편집, 학생 선택, 출력, 출제 이력, 출제 저장, 다음 회차, 작업 백업이 함께 있다. 다음 행동의 우선순위가 불명확하다. 큰 문제지 미리보기는 유지할 장점이다.
2. `작업 파일 저장`은 JSON 백업 다운로드다. 미배포 작업은 교사별 브라우저 localStorage에 최근 20개까지 저장된다. `최근 출제 · 작업`의 `만들던 문제지 / 이어하기`는 있지만, 여러 기기에서 사용할 수 있는 문제지 보관함과 배포 시작점은 아니다.
3. `학생 선택 → 반 선택 → 학생 체크 → 선택한 학생 적용 → 제작 화면으로 복귀 → 학생에게 출제`로 배포가 분리된다. 학생을 적용하는 동작은 배포 완료가 아니다.
4. 출제 receipt가 있으면 대상 선택을 막는다. 전체 출제 완료 후 다음 회차를 시작하면 선택 문항을 비운다. 같은 문제지를 유지한 채 다른 학생에게 배포하는 사용자 목표와 맞지 않는다.
5. 첨부 화면에는 `검증 통과`와 `0 / 1개 문제지 출제 저장`, `아직 출제하지 않음`, catalog 버전 오류가 함께 보인다. 이 화면의 해당 문제지는 배포 완료로 표시되지 않는다. 문제지 내용 검사와 서버 배포 검증이 다른 시점에 이뤄진다는 점을 교사가 해석해야 한다.
6. 저장 성공과 PDF 준비 결과가 구분돼 있는 코드상 장점은 있지만, 기본 버튼 문구가 PDF 재시도로 바뀌고 결과가 제작 화면 아래에 남아 전체 배포 상태를 이해하기 어렵다.

접근성 검토 한계: 첨부 화면으로 키보드 이동, 초점 복귀, 스크린리더 발표, 확대 시 재배치를 확인할 수 없다. 저장 결과와 오류는 색뿐 아니라 문구로 표현해야 한다. 현재 상태 영역에 `role=status / aria-live=polite`가 있는 점은 확인했다.

## 권장 화면과 동작

### 1. 문제지 만들기

범위와 문항 수를 선택하고, 실제 문제지를 확인하면서 문항과 출력 설정을 수정한다. 제작 화면의 주요 행동은 `시험지 저장`으로 정한다. 출력은 보조 행동으로 둔다. 완성 시험지를 저장할 때 학생을 선택할 필요가 없어야 한다. 학생 배포는 저장 완료 후 기존 아카이브 기능으로 이어진다.

저장 성공 후 `시험지가 저장되었습니다`와 `저장한 시험지 보기`를 표시한다. 바로 배포하려면 이 저장본에서 기존 배포 기능을 연다. 저장 실패 상태를 저장 완료처럼 표시하지 않는다. 작업 중 자동 저장과 완성 시험지 저장은 구분한다. 별도의 `저장하고 배포` 복합 기능은 첫 구현의 필수 범위에 포함하지 않는다.

### 2. 내 문제지

기본 메뉴에 `저장한 시험지`를 둔다. 첫 구현의 목록에는 제목, 문항 수, 저장일을 표시하고 `열기`, `출력`, `학생에게 배포`를 제공한다. 배포하지 않은 시험지도 같은 목록에서 찾을 수 있어야 한다. 최근 배포일·누적 수신 학생 수 등 추가 집계는 첫 구현의 필수 범위가 아니다.

같은 교사 계정으로 다시 접속하거나 다른 기기에서 열어도 저장된 문제지가 나타나야 한다. 따라서 브라우저 백업에 의존하는 목록 이름 변경만으로 완료할 수 없다.

### 3. 기존 학생 배포 기능 연결

`저장한 시험지 → 학생에게 배포`에서 기존 아카이브의 반·학생 선택, 최종 확인, 등록, 결과 표시를 재사용한다. 새 학생 선택 창이나 배포 시스템을 만들지 않는다. 기존 기능이 저장된 시험지 내용을 받도록 필요한 연결만 추가한다.

동일한 저장본을 나중에 다른 학생에게도 전달할 수 있어야 한다. 기존 배포 기록의 대상이나 내용을 바꾸지 않고, 저장본으로 새 배포를 시작한다. 재배포와 재시도 구분, 기존 과제의 중복 처리 등은 기존 배포 계약을 확인해서 연결한다. 별도의 중복 학생 필터나 새 과제 정책을 이번 저장 기능에 추가하지 않는다.

### 4. 배포 결과와 내역

기존 아카이브의 배포 결과와 출제 내역을 사용한다. 저장 성공 메시지와 배포 성공 메시지는 구분한다. `시험지 저장됨`이 학생 배포 완료를 뜻하지 않는다.

연결 시 실제 선택 학생에게 저장본이 전달되는지와 PDF 실패 처리에 회귀가 없는지 확인한다. 기존 배포 결과 화면의 전면 개편은 저장 기능의 필수 범위가 아니다.

여러 권이 만들어진 경우 각 권을 식별해 저장하고 다시 열 수 있어야 한다. 단일 시험지와 여러 권 모두 기존 배포 기능의 입력으로 연결할 수 있는지 확인한다.

## 구현 원칙

- 문제지 내용의 저장과 학생 배포 기록을 분리한다. 하나의 문제지 저장본을 여러 배포 기록에서 참조할 수 있어야 한다.
- 저장본에는 문항 순서, 내용, 정답·해설, 이미지 참조, 출력 설정을 보존한다. 나중에 배포할 때 최신 아카이브에서 조용히 새 문항으로 재조립하지 않는다.
- 기존 assignment·recipient·학생 포털·PDF 경로를 연결해 사용한다. 별도 학생 배포 시스템을 병행하지 않는다.
- 배포된 저장본을 수정하지 않는다. 수정본은 새 버전으로 저장하며 기존 학생은 당시 배포된 저장본을 받는다.
- catalog 전체 버전 변경과 개별 저장 문항의 변경을 구분한다. 기존 검증을 제거해서 오류를 숨기지 않는다. 저장 시 검증된 snapshot의 재배포 계약을 서버에서 정의하고, 배포 직전 필요한 검사를 자동 수행한다.
- 첨부 오류가 정적 화면과 서버 catalog 불일치에서 발생했는지 운영 환경을 별도로 확인한다. 이번 코드 검토만으로 운영상 원인은 확정하지 않는다.
- 복구 가능한 기존 브라우저 작업을 `내 문제지`에 저장할 수 있는 이전 경로를 마련한다. 기존 배포 기록은 보존한다.

## 완료 기준

1. 학생을 선택하지 않고도 문제지를 저장한다.
2. 저장 후 창을 닫고 다시 열어도, 다른 기기로 접속해도 같은 저장본을 찾는다.
3. 저장본에서 기존 아카이브 학생 배포 기능을 열고 배포를 완료한다.
4. 다른 날 다른 학생에게 배포해도 문항과 순서가 바뀌지 않는다.
5. 배포 결과의 학생 명단이 서버 수신 기록 및 학생 포털 표시와 일치한다.
6. 기존 배포의 재시도·대상 선택·과제 등록 동작에 회귀가 없다.
7. 학생 배포 없이 문제·정답·해설을 다시 열거나 출력할 수 있다.
8. 저장 실패를 저장 완료로 표시하지 않고 기존 저장본을 보존한다.
9. 아카이브 갱신이 무관한 기존 저장본의 배포를 불필요하게 막지 않으며, 실제 내용·권한 문제는 검증한다.

## 코드 근거

- `archive/archive2-workspace.js`: `draft / drafts / save / applyDraft`, `renderInspector`, `renderDeliveryProgress`, `renderRecent`, `targets`, `assign`, `assignmentStatus`, `next-round / backup` 이벤트.
- `archive/archive2-papers.js`: 문제지별 receipt와 완료·PDF 대기 상태 계산.
- `archive/archive2-navigation.js`: 현재 메뉴의 `문제지 만들기 / 출제 내역`.
- `archive/index.html`: 기존 `AssignTarget`의 반·학생 선택, 최종 확인, 결과 표시와 `getIndexAssignmentMixedPayload / registerIndexClassExamAssignment`의 구성 시험지 배포 입력.
- `apmath/worker-backup/worker/helpers/archive2-questions.js`: `validateApprovedMixedQuestions`의 catalog 버전·문항·내용 검증.

위 코드는 검토 시점 작업 트리 기준이다. 기존의 미커밋 변경을 포함할 수 있으며, 운영 환경의 상태를 보증하지 않는다.

## 상세 구현 결정

### A. 첫 구현의 범위

완성 시험지를 서버에 저장하고, 저장한 시험지 목록에서 열기·문제/정답/해설 출력·기존 학생 배포 기능 호출을 제공한다. 현재 제작 중 자동 저장은 그대로 작업 복구용으로 사용한다.

첫 구현은 현재 `문제지 만들기`에서 생성한 시험지를 대상으로 한다. 원본 아카이브 전체·단원별 기출·기존 배포 내역을 보관함에 일괄 이전하거나, 시험지 공유·폴더·예약 배포·배포 화면 재설계·저장본 직접 편집을 추가하지 않는다. 기존 브라우저 작업은 교사가 복원하고 `시험지 저장`을 눌러 이전할 수 있다.

저장본은 내용을 덮어쓰지 않는 완성본이다. 제작 화면을 더 수정하고 다시 저장하면 새 저장본을 만든다. 같은 상태에서 저장 버튼을 반복 클릭하거나 통신 실패 후 재시도하는 경우에는 같은 저장 요청을 사용한다.

### B. 확인한 기존 구조와 재사용 위치

| 확인한 사실 | 설계에 반영할 내용 |
|---|---|
| `class_exam_assignments.class_id`가 필수이고 기존 identity가 반·날짜·archive_file로 결정됨 | 학생 없는 보관본을 가짜 반이나 가짜 배포 기록으로 만들지 않고 별도 보관 테이블에 저장 |
| `archive2-workspace.js:prepare()`가 50문항씩 `{questions, meta}`를 생성 | 기존 준비 함수를 사용해 권별 저장본을 만들고 새 렌더러를 만들지 않음 |
| `archive2-source.js:restore()`가 현재 원본을 다시 로드 | 저장한 시험지 열기에서는 이 함수를 사용하지 않고 서버 snapshot을 직접 읽음 |
| `archive/index.html`에 `AssignTarget`의 반·학생 선택, 최종 확인, 재시도, 결과 표시가 있음 | 저장본의 배포에 동일 패널을 사용 |
| `registerIndexClassExamAssignment()`가 구성 시험지를 전달할 수 있음 | 저장본 ID를 전달하는 입력 분기를 추가; 기존 원본·단원별 기출 입력은 유지 |
| 엄격한 등록은 `handleArchive2()`가 assignment·recipient·exclusion·문항 bridge를 함께 저장 | 저장본 입력을 이 공통 저장 경계에 연결; 느슨한 legacy POST로 우회하지 않음 |
| `handleArchive2()`가 `saved: true`와 PDF 실패를 함께 반환할 수 있음 | 저장된 assignment를 성공 receipt로 보존하고 PDF만 재시도 |
| workspace 초기화와 `render()`가 catalog 로딩 성공에 의존 | 보관함 경로는 catalog 없이 초기화·표시·출력이 가능하도록 분리 |

현재 작업 트리에는 Worker 배포 경계와 출력 엔진의 다른 미커밋 변경이 있다. 구현 시작 시 최신 diff를 확인하고, 관련 변경을 보존한 상태로 필요한 위치에만 추가한다.

### C. 저장할 데이터와 DB

현재 Worker의 `env.DB` D1을 사용한다. 별도 서비스나 별도 DB를 도입하지 않는다. 새 테이블은 `archive_saved_papers` 하나로 시작한다. 각 행은 실제 출력할 한 권이다. 여러 권은 같은 `save_batch_id`로 저장 묶음을 식별한다. 첫 목록은 권별 행으로 표시하고 제목의 `1권 / 2권`으로 구분한다. 폴더나 별도 묶음 탐색 UI는 만들지 않는다.

| 필드 | 역할 |
|---|---|
| `id` TEXT PRIMARY KEY | 서버에서 만든 저장본 UUID |
| `owner_teacher_id` TEXT NOT NULL | 인증된 교사 ID; 요청 본문에서 받지 않음 |
| `save_batch_id` TEXT NOT NULL | 저장 버튼 1회의 UUID; 재시도 시 유지 |
| `part_index` INTEGER NOT NULL | 0부터 시작하는 권 번호 |
| `part_count` INTEGER NOT NULL | 이번 저장의 전체 권 수 |
| `title` TEXT NOT NULL | 해당 권의 저장 당시 표시 제목 |
| `grade`, `subject` TEXT NOT NULL | 목록 표시와 배포 대상 검증에 사용하는 확인된 정보 |
| `question_count` INTEGER NOT NULL | 실제 저장된 문항 수 |
| `snapshot_json` TEXT NOT NULL | 아래 전체 내용과 배포용 문항 근거 |
| `snapshot_hash` TEXT NOT NULL | 정규화한 snapshot의 SHA-256 |
| `save_request_hash` TEXT NOT NULL | 전체 권·순서·제목·조건을 포함한 저장 요청 hash |
| `source_index_version` TEXT NOT NULL | 저장 시 서버가 확인한 catalog 버전 |
| `schema_version` TEXT NOT NULL | `archive-saved-paper-v1` |
| `created_at` TEXT NOT NULL | 서버 저장 시각 |
| `deleted_at` TEXT NULL | 보관함에서 삭제할 때 사용하는 표시 삭제 시각 |

`snapshot_json` 구조는 `{questions, meta, bridgeRows, selectionFilters, verifiedAt}`로 고정한다.

- `questions`: 문항 순서대로 모든 문제·선지·정답·해설·수식·이미지 참조·출력에 필요한 layout 필드를 보존한다. UID만 저장하지 않는다.
- `meta`: 기존 mixed 엔진 형식을 사용한다. 제목·부제·우측 문구·이름칸·점수칸·문항/쪽·QR·ordered questionUids·학년·과목을 포함한다.
- `bridgeRows`: 서버가 `buildQuestionSnapshot()`으로 만든 UID·source ordinal·fingerprint·메타데이터 근거다. 저장 시점에 확정하며 배포할 때 최신 catalog로 덮어쓰지 않는다.
- `selectionFilters`: 현재 제작 조건을 저장해 생성 근거를 남긴다. 학생 ID·반 ID·학생 이름은 보관 snapshot에 넣지 않는다.

필요한 인덱스는 `UNIQUE(owner_teacher_id, save_batch_id, part_index)` 및 `(owner_teacher_id, deleted_at, created_at, id)`다. `part_index < part_count`, 문항 수 1~50, 제목 길이 등 CHECK를 둔다. `snapshot_hash`와 `save_request_hash`가 달라지는 UPDATE는 DB trigger로 거절한다. 삭제는 snapshot을 변경하지 않는다.

`class_exam_assignments`에는 nullable `saved_paper_id`와 조회용 인덱스만 추가한다. 이는 출제 기록이 어느 보관본에서 왔는지 연결하는 참조다. 새로운 수신자/배포 기록 테이블을 만들지 않는다.

**크기와 원자성:** 권당 직렬화된 snapshot 전체를 UTF-8 1,500,000바이트 이하로 제한한다. 저장 요청은 최대 8권·400문항·UTF-8 8,000,000바이트로 제한하고 스트림을 읽는 동안 상한을 검사한다. 기존 배포 payload의 문자 수 제한과도 호환되는지 저장 전에 검사한다. 한 번에 만든 여러 권은 검증 완료 후 D1 `batch()` 하나로 저장하고, 중간 실패 시 전부 롤백한다. 저장 성공을 부분 성공으로 표현하지 않는다.

같은 batch ID로 같은 내용을 재시도하면 기존 ID 목록을 돌려준다. 같은 batch ID로 내용이나 권 수를 바꾸면 409를 반환한다. 동시 첫 저장도 UNIQUE와 불변 hash trigger를 통해 한 묶음만 남는다. 모든 query는 bind parameter를 사용한다.

D1의 행/문자열 상한은 현재 2,000,000바이트이며, batch는 SQL 실패 시 전체를 롤백한다. 제품의 1,500,000바이트 상한은 이 제약보다 낮게 잡은 설계값이다. [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [D1 batch API](https://developers.cloudflare.com/d1/worker-api/d1-database/).

**이미지 보존 범위:** 문제지 snapshot을 만들기 전에 승인된 `assets/images/` 경로가 가리키는 PNG/JPEG/SVG/WebP/GIF 바이트를 읽어 snapshot 안의 data URL로 고정한다. `image`, `solutionImage`, HTML 내 `img src`와 CSS `url(...)` 참조를 처리하며, snapshot SHA-256에 이미지 내용까지 포함한다. 이렇게 하면 같은 정적 파일 경로의 이후 교체가 이미 저장한 시험지에 영향을 주지 않는다. 외부 HTTP 이미지처럼 승인 archive 자산 경로 밖의 URL은 원래 참조로 보존하며 해당 원격 서버의 파일 수명은 보장하지 않는다. 저장량은 기존 권당 UTF-8 1,500,000바이트 한도를 그대로 따른다. 별도의 그림 생성은 하지 않는다.

### D. API 계약

새 자원 이름은 `/api/archive-saved-papers`로 정한다. Worker `index.js`의 exam resource 목록에 추가하고 `routes/exams.js`에서 기존 인증으로 교사를 확인한 뒤 전용 handler로 보낸다.

| 요청 | 입력/응답 |
|---|---|
| `POST /archive-saved-papers` | 입력 `{schema_version, save_batch_id, index_version, selection_filters, papers:[{part_index, questions, meta}]}`. 응답 `{success:true, saved:true, papers:[{id,title,question_count,part_index,part_count,created_at}]}`. 학생·반 없이 호출 |
| `GET /archive-saved-papers?limit=20&cursor=…&q=…` | 내 저장본의 제목·문항 수·학년·과목·저장일·묶음 정보만 반환. snapshot JSON은 목록에서 제외. 기본 20권, 최대 50권; `(created_at,id)` cursor |
| `GET /archive-saved-papers/:id` | 소유자의 저장본과 hash 반환. catalog를 읽지 않음 |
| `DELETE /archive-saved-papers/:id` | `deleted_at` 설정. 기존 배포와 학생 시험지는 삭제하지 않음 |
| `POST /class-exam-assignments`의 저장본 입력 | 기존 endpoint에 `{contract_version:'archive2-v1', saved_paper_id, class_id, student_ids, exam_date, assignment_batch_id}`를 전달. 기존 패널이 호출하며 전용 배포 endpoint는 새로 만들지 않음 |

오류는 `success:false, code, error`를 사용한다. 로그인 없음 401, 교사 역할 없음 403, 다른 교사의 저장본·없는 저장본 404, 저장 요청 hash 충돌 409, 검증 실패 409, 크기 초과 413, migration 미적용 503으로 정한다. 저장본 삭제 후 새 배포는 404. 이미 저장된 assignment의 상태 확인·PDF 재시도는 기존 assignment 경로로 계속 가능하다.

목록·상세·삭제는 인증된 `teacher.id`를 조건에 반드시 포함한다. 첫 구현은 admin도 자신의 목록만 기본 사용한다. 교사 간 공유나 임의 owner 선택은 추가하지 않는다. API 응답은 개인 저장본이 공개 cache에 남지 않도록 처리한다.

### E. 저장 시 검증과 catalog 갱신

저장은 기존 `prepare()`의 결과를 서버에 보낸 뒤 이루어진다. 서버에서 역할·스키마·권 수·문항 수·제목·출력 설정·UID/source ordinal·문항 fingerprint·승인 상태·생성 범위를 검사한다. 현재 `validateApprovedMixedQuestions`, `buildQuestionSnapshot`, 출력 설정 normalizer를 재사용하거나 동등한 공통 helper로 추출한다. 서버가 확인하지 않은 browser payload를 신뢰한 저장본으로 취급하지 않는다.

기존 문제가 있는 `검증 통과 / catalog 버전 불일치`는 저장 단계에서 처리한다. 새 저장의 input index가 오래돼도 서버는 먼저 현재 등록 내용과 각 문항을 대조한다. 내용·순서가 유지되고 현재 생성 범위와 승인 조건도 충족하면 서버 메타데이터로 정규화해 저장한다. 단순 버전 문자열 차이만으로 문항을 재추첨하지 않는다. 문항 내용·등록 근거·범위가 실제로 달라졌다면 실패한 문항을 알려 주고 저장하지 않는다. 기존 출제의 엄격한 검증은 전역으로 완화하지 않는다.

저장한 시험지를 열거나 배포할 때는 owner·snapshot hash·스키마·삭제 상태 및 현재 배포 대상 권한을 검사한다. 최신 catalog와 source 파일로 다시 선택/조립하지 않는다. 저장 당시 승인된 내용의 보관·배포 계약을 신규 저장본 경로에만 적용한다.

저장 전후의 화면 편집 signature를 비교하고, 저장 중 문항 변경을 잠근다. 저장 중 탭을 닫거나 응답을 받지 못하면 `save_batch_id`를 브라우저 작업에 함께 보관해 재시도한다. 입력이 바뀌지 않은 재시도에서 새 UUID를 만들지 않는다. 저장 완료와 학생 배포 완료는 별개의 상태다.

### F. 기존 배포 기능 연결 상세

1. 보관함에서 저장본 ID로 기존 아카이브를 연다. URL은 `index.html?savedPaper=<UUID>`만 전달하며 시험지 전체 JSON이나 토큰을 URL에 넣지 않는다.
2. `archive2-entry.js`에 저장본 진입을 추가한다. 인증 후 상세 API를 조회하고 기존 `openAssignTargetPanel()`에 표시 제목·학년·과목·문항 수·`savedPaperId`를 가진 item을 전달한다.
3. 기존 반/학생 패널·최종 확인·진행 상태·실패 반 재시도를 그대로 사용한다. 미리보기에는 상세 API로 읽은 `{questions,meta}`를 기존 mixed 엔진에 전달한다. 로컬 저장 공간은 렌더러의 임시 입력으로만 사용하고 보관 원본으로 취급하지 않는다.
4. `registerIndexClassExamAssignment()`의 저장본 분기에서는 studentIds와 savedPaperId를 함께 서버에 전달한다. 기존 원본 계약 헤더 분기보다 먼저 저장본 입력을 식별한다. savedPaperId가 잘못됐을 때 legacy 배포로 떨어지지 않게 한다.
5. `handleArchive2()`에 저장본 입력 mode를 추가한다. 서버가 소유자의 snapshot을 읽고 제목·문항 수·출력 설정·문항 bridge를 구성한다. 클라이언트가 보낸 문항/정답/제목/출력 옵션으로 저장본을 덮어쓰지 않는다. 화면에서 QPP를 선택하더라도 첫 구현의 저장본 배포는 저장 당시 QPP를 사용한다.
6. 현재 `canAccessClass`, roster 재원 확인, `requireStudentAccess`, 학년 검증을 그대로 수행한다. 배포 이력으로 저장 문항을 자동 교체하지 않는다. 저장본 경로의 history mode는 현재 studio UI와 같은 `off`로 둔다.
7. 기존 `class_exam_assignments`, recipients, exclusions, 문항 bridge, blueprint 등록을 기존 원자적 저장 루틴으로 처리한다. `saved_paper_id`도 같은 transaction에 기록한다. 학생 포털·OMR·PDF는 기존 assignment를 사용한다.

**배포 identity:** 기존 UNIQUE identity가 `(class_id,exam_date,archive_file)`이므로 저장본 ID만 archive_file로 사용하면 같은 날 추가 배포가 기존 명단과 충돌할 수 있다. 저장본 경로는 `MIXED:archive2-saved-<paperId>-<batchUuid>`를 사용한다. 새 배포 시작마다 batch UUID를 하나 만들고 여러 반과 실패 재시도에 같은 UUID를 사용한다. 저장본 ID는 내용 identity이고 batch UUID는 기존 배포 시작을 구분하는 값이다. 기존 `class_exam_assignments.id`가 학생 과제의 실제 identity인 원칙은 유지한다.

이 방식으로 같은 반에 같은 날 새로 등록된 학생에게도 저장본으로 별도 배포를 시작할 수 있다. 기존 배포의 최초 roster는 변경하지 않는다. 다른 학생에게 새 배포와 같은 요청의 재시도가 혼동되지 않도록 테스트한다.

**자동 출력 주의:** 기존 `assignTargetMaybeFinish()`는 성공 후 엔진을 열며, 일부 엔진은 자동 등록을 수행한다. 저장본 경로의 출력에는 실제 등록된 assignment와 같은 archive_file/key를 사용하고 `assignmentRegistered/preRegistered`를 전달해야 한다. 저장본의 미리보기 key로 별도 과제가 생기지 않도록 한다. 보관함으로부터 시작한 경우에만 기존 embedded receipt 연동과 같이 완료 결과를 남겨 확인할 수 있도록 연결한다. 모든 아카이브 배포 화면의 동작을 전면 변경하지 않는다.

### G. 화면과 상태

| 위치 | 변경 |
|---|---|
| 제작 화면 우측 | 주 행동 `시험지 저장`, 보조 `출력`. 학생 선택·직접 studio 출제·출제 receipt·다음 회차를 일반 제작 흐름의 기본 패널에서 걷어냄 |
| 저장 결과 | `시험지 1개를 저장했습니다` 또는 `시험지 3권을 저장했습니다`, `저장한 시험지 보기`, 저장본의 기존 배포 기능 진입 |
| 내비게이션 | `문제지 만들기` 다음에 `저장한 시험지` 추가. 기존 `출제 내역`은 배포 기록으로 유지 |
| 보관함 목록 | 권별 제목·문항 수·저장일; 여러 권은 권 번호 표시, `열기 / 출력 / 학생에게 배포 / 삭제` |
| 저장본 상세 | 기존 mixed 엔진 미리보기와 `문제 / 정답 / 해설`, 출력, 기존 학생 배포 버튼 |
| 제작 보조 메뉴 | `작업 파일 저장`은 `작업 백업 다운로드`로 명확히 표시. 기존 JSON 백업 복구 유지 |

state에는 `saveBusy`, `saveBatchId`, `saveSignature`, `savedPaperIds`, `saveError`를 추가한다. state의 `receipts/sealed`는 이전 작업 복원과 기존 배포 기능을 위한 값으로 남겨 두며 보관함 저장 완료와 공유하지 않는다. 저장했다고 편집 중 작업을 배포 확정 상태로 잠그지 않는다.

저장한 시험지의 URL은 `workspace.html?view=saved`, 상세는 `workspace.html?view=saved&paper_id=<UUID>`로 정한다. 새 `Archive2Library` 모듈은 목록·상세·출력·삭제·배포 진입을 맡고 기존 인증/header·API helper를 공유한다. `readUrl()`, navigation의 currentKey, popstate, boot, `render()` 모두 saved view를 처리한다. saved view에서 catalog 로딩 실패가 보관함을 막지 않아야 한다.

모바일에서는 메뉴 추가로 탭이 너무 좁아지지 않도록 기존 navigation 스타일 안에서 줄바꿈/스크롤을 검증한다. 새 레이아웃 디자인이나 별도 사이트는 만들지 않는다. 저장 결과는 aria-live로 안내하고 오류 후 입력과 미리보기를 보존한다. 삭제 후에도 학생에게 이미 배포한 assignment는 남는다고 삭제 확인에 명시한다.

### H. 수정 파일과 책임

아래 신규 파일명은 구현 목표이며 이 계획 작업에서는 파일을 생성하지 않았다.

| 파일 | 작업 |
|---|---|
| `apmath/worker-backup/worker/migrations/20260929_archive_saved_papers.sql` 신규 | 보관 테이블·인덱스·CHECK·snapshot 불변 trigger, assignment saved_paper_id |
| `apmath/worker-backup/worker/routes/archive-saved-papers.js` 신규 | 저장/목록/상세/표시 삭제 API |
| `apmath/worker-backup/worker/helpers/archive-saved-papers.js` 신규 | bounded JSON 읽기, snapshot 검증·정규화·hash·소유권 조회 |
| `apmath/worker-backup/worker/index.js` | 신규 resource를 기존 exam routing/auth에 연결 |
| `apmath/worker-backup/worker/routes/exams.js` | 보관 API 위임, 저장본 배포 입력을 strict handler로 위임 |
| `apmath/worker-backup/worker/routes/archive2.js` | 저장본 입력 mode와 공통 transaction 연결; 현재 미커밋 변경 보존 |
| `apmath/worker-backup/worker/helpers/archive2-questions.js` | 기존 검증·문항 snapshot·blueprint helper 재사용을 위한 최소 추출 |
| `archive/archive2-library.js` 신규 | 보관함 목록·상세·출력·기존 배포 호출 |
| `archive/archive2-workspace.js` | 제작 저장, saved view·boot, 기본 제작 패널 단순화, 복구 작업 저장 연결 |
| `archive/workspace.html`, `archive/archive2.css` | 보관함 모듈 로드·스타일·정적 캐시 버전 갱신 |
| `archive/archive2-navigation.js`, `archive/archive2-navigation.css` | 저장한 시험지 메뉴·active·모바일 처리 |
| `archive/index.html`, `archive/archive2-entry.js` | savedPaper 진입·기존 AssignTarget의 저장본 item·POST·receipt 연결 |
| `archive/archive-session.js` | 원칙적으로 수정 없이 인증 handoff 재사용 |
| `archive/mixed_engine.html`, `routes/exam-pdf.js`, 학생 포털 | 원칙적으로 기존 snapshot 입력 재사용; 실제 assignment key 출력 연동에 필요한 변경이 있으면 최소 범위로 추가 |
| `tests/archive-saved-papers-*.test.mjs` 신규 | 스키마·검증·권한·저장/조회/삭제·배포 회귀 |
| `tests/archive-saved-papers-runtime.mjs` 신규 | 기존 Miniflare/D1 harness를 활용한 원자성·학생 포털 통합 검증 |

### I. 구현 순서와 단계별 완료 조건

1. **저장 계약·migration·fixtures.** 실제 대표 시험지의 UTF-8 크기와 이미지 참조, 기존 owner/auth·source grade·문항 bridge를 확인한다. 새 migration을 로컬에 적용하고 snapshot 불변·표시 삭제·저장 묶음 rollback 테스트를 만든다. 이 단계 완료 기준은 저장 테이블과 재시도 계약을 실행 가능한 fixture로 검증한 것이다.
2. **서버 보관 API.** 저장·목록·상세·삭제를 만든다. 반 없이 저장하고 별도 세션/브라우저에서 동일 owner가 조회할 수 있는지 검증한다. 2권 중 하나가 실패하면 아무 권도 저장되지 않아야 한다. 새 저장의 최신 catalog 검사와 이미 저장된 snapshot 조회의 catalog 독립성을 검증한다.
3. **제작 저장·보관함 UI.** 기존 `prepare()`와 엔진으로 저장하고 다시 연다. 저장 버튼·상태·목록·문제/정답/해설 출력·삭제·기존 브라우저 작업의 명시적 저장을 연결한다. 새 로그인 세션의 빈 localStorage에서도 서버 저장본을 열어야 한다.
4. **기존 배포 연결.** 기존 반·학생 패널에 저장본을 전달하고 strict assignment 저장을 연결한다. 다른 날/다른 반/같은 날 추가 학생, 선택하지 않은 학생 제외, batch 재시도와 실제 assignment key를 검증한다. 새 학생 배포 UI를 만들지 않는다.
5. **최종 회귀·출시 준비.** 기존 원본/단원별 기출 배포, PDF·학생 포털·OMR·반 권한을 회귀 검증한다. 제작·보관함·배포 진입을 PC/모바일로 확인하고 증거를 남긴다. 로컬 완성본, 적용할 migration, 배포 순서를 함께 제시한다.

단계 2~3 완료 시 학생을 고르지 않고 시험지를 보관·열기·출력할 수 있다. 전체 완료는 단계 4~5를 통과하고 저장본이 실제 선택 학생의 기존 포털에서 확인되는 상태다. 단계 3의 성공만으로 전체 기능 완료라고 보고하지 않는다.

### J. 반드시 통과할 테스트

| 분류 | 검증 시나리오 |
|---|---|
| 저장과 배포 분리 | class_id/student_ids 없이 저장 성공; assignment·recipient·PDF 등록은 0건 |
| 내용 동일성 | 문항 순서·정답·해설·이미지 참조·출력 설정이 저장/상세/렌더/배포 payload에서 일치 |
| 영속성 | localStorage와 브라우저 작업을 지운 별도 교사 세션에서 서버 저장본 열기 |
| 소유권 | 다른 교사의 ID로 상세·삭제·배포 실패; 비로그인/학생 역할 실패; owner spoof 무효 |
| validation | UID/ordinal·답안·fingerprint·문항 수·grade·출력 설정 변조 거절; 승인되지 않은 문항 저장 거절 |
| catalog | 무관한 catalog 변경은 이미 저장된 열기/배포에 영향 없음; 새 저장의 실질적 내용 변경은 차단 |
| UTF-8 크기 | 한국어/수식으로 문자 수는 작아도 byte 상한을 넘는 요청 거절; 권별 snapshot과 전체 요청 경계 |
| 여러 권 | 80문항 생성 시 50+30 두 권 저장; 둘째 권 검증/DB 실패 시 전체 rollback |
| 저장 재시도 | 동일 batch·동일 내용의 반복/동시 호출에 같은 ID; 동일 batch·다른 내용은 409 |
| 배포 대상 | 기존 패널에서 학생 1명 선택 후 그 학생만 포털에 표시; 다른 학생 제외 |
| 배포 identity | 같은 배포 retry 중복 0건; 새 batch는 별도 assignment; 같은 날 새로 등록된 학생 배포 가능 |
| snapshot 보호 | savedPaperId 배포에서 client mixed_payload/제목/QPP 변조로 서버 저장본 변경 불가 |
| PDF | assignment 저장 후 PDF 실패에도 과제 보존; 같은 assignment PDF 재시도만 수행 |
| 엔진 연동 | 기존 자동 출력/등록이 추가 과제를 생성하지 않음; 문제/정답/해설 제목·QR·QPP 일치 |
| 삭제 | 보관함에서 삭제한 시험지는 새 배포 차단; 기존 학생의 배포 시험지와 오답 기록 유지 |
| UI 회귀 | 원본·단원별 기출 AssignTarget·기존 recent 화면·PC/모바일 메뉴·뒤로가기 유지 |

기존 기준 테스트는 `archive2-core.test.cjs`, `archive2-rc2-output.test.cjs`, `archive2-compose-scope.test.js`, `archive2-navigation.test.cjs`, `archive2-worker-validation.test.mjs`, `archive2-worker-runtime.mjs`, `archive-target-selection-phase3-contract.test.js`, `apmath-exam-assignment-identity.test.js`, `student-portal-assignment-recipients.test.js`, `student-portal-mixed-review-payload.test.js`, `apmath-exam-pdf-artifacts.test.js`를 사용한다. 필요한 신규 tests는 저장 기능의 실제 데이터·권한·부분 실패를 검증하며 구현 문자열만 비교하는 테스트로 대체하지 않는다.

브라우저 검증은 앱의 사용 가능한 브라우저 도구로 로컬 fixture에서 진행한다. 실제 학생에게 테스트 배포하지 않는다. 기본 테스트 runner가 ESM/CJS runtime 전부를 자동 실행하지 않으므로 신규 필수 테스트가 CI에서 실행되도록 runner 또는 workflow 등록도 확인한다.

### K. 출시와 복구

출시 순서는 **보관 migration → 저장본 대응 Worker → 캐시 버전을 갱신한 정적 UI**다. migration/Worker가 없는 환경은 보관 기능만 준비되지 않았다는 503/안내를 보여주고 기존 아카이브 이용을 유지한다. 기존 assignment 데이터의 일괄 UPDATE/DELETE는 하지 않는다.

첫 구현은 기존 `ARCHIVE2_ENABLED`와 새 테이블 존재 확인을 사용한다. migration capability는 요청 시작마다 여러 번 확인하지 않도록 기존 schema 조회 방식에 맞춘다. 전역 mutable 변수에 사용자별 snapshot·권한·저장 상태를 저장하지 않는다.

기능 복구는 UI/신규 endpoint 진입을 되돌리고 새 저장 데이터를 보존하는 방식으로 한다. 보관 테이블을 drop하거나 기존 학생 과제를 삭제하지 않는다. D1 snapshot은 기존 DB backup 대상에 포함되며, 이미지의 실제 보관 위치는 I-1 확인 결과도 함께 운영 문서에 기록한다.

설계 문서 작성 당시에는 계획서만 수정했다. 후속 구현 요청으로 로컬 migration·Worker·UI·기존 배포 연결과 fixture 검증을 완료했다. 운영 migration·Worker 배포·정적 사이트 게시·실제 학생 배포는 실행하지 않았다.

### L. 구현 시작 시 확인할 항목

위의 DB·API·재사용 경로·UI 범위는 이 문서의 기본 결정이다. 구현 중 확인할 항목은 저장 구조를 다시 선택하는 문제가 아니라 다음 세 가지의 실행 검증이다.

1. 운영 schema와 저장소 migration의 설치 상태가 일치하는지, 기존 미커밋 변경에 충돌하는 지점이 있는지 확인한다.
2. 이미지 참조의 실제 보존 방식과 권별 최대 크기를 대표 시험지로 확인한다. 필요한 자산 보존 작업은 저장 snapshot 기능에 포함한다.
3. 기존 AssignTarget의 QR·자동 출력·assignment key가 새 저장본 입력에서도 동일 과제를 가리키는지 로컬 통합 검증한다.

로컬 fixture에서는 학생 없이 저장, 다른 세션의 목록·상세 조회, UTF-8 상한, 긴 catalog overlay 버전, idempotent retry, 저장 묶음 rollback, static image byte snapshot 보존, 기존 assignment 경로와의 연결, 같은 날 새 batch로 다른 학생에게 재배포, soft delete 뒤 기존 assignment 보존을 검증했다. 기본 test runner는 통과했다. 별도 `archive2-worker-validation.test.mjs`는 현재 작업 트리의 catalog/source 불일치로 source restoration 1건과 candidate lookup 1건이 실패한다. 운영 환경의 migration 적용 상태, Worker 배포, 정적 사이트 게시, 실제 학생 포털에서의 출제 완료는 아직 검증하지 않았다.
