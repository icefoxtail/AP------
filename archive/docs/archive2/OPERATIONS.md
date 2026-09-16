# Archive 2.0 RC 운영 및 재현

## 로컬 작업공간

저장소 루트에서 `python -m http.server 8768 --bind 127.0.0.1`을 실행하고
`http://127.0.0.1:8768/archive/workspace.html`을 연다. 새 진입점의 pilot 링크는
`archive/index.html?archive2=1`이다. 기본 index는 기존 workflow를 유지한다.

실제 Worker와 합성 학생을 사용하는 로컬 검증:

```text
cd apmath/worker-backup/worker
npm ci --ignore-scripts
cd ../../..
node tests/archive2-worker-runtime.mjs
node tests/archive2-worker-runtime.mjs --serve
```

`--serve`는 기본 8790 포트에서 로컬 fixture UI를 제공한다. `ARCHIVE2_FIXTURE_PORT`로
포트를 지정할 수 있다. 고1 검증반 A/B와 합성 학생만
있으며, production 연결이 없다는 표시가 나온다. fake auth는 이 fixture server에만
존재한다. 서버를 종료하면 fixture D1 상태는 사라진다.

## 읽기 projection 재생성

```text
node archive/tools/build-archive2-catalog.mjs
node archive/tools/build-archive2-crosswalk-inventory.mjs
```

입력은 기존 db/source JS, canonical identity map, approved sidecar와 RPM master다.
출력은 Archive 2.0 전용 projection이다. 이 명령은 global metadata builder를 실행하거나
source JS, identity map, metadata approval을 다시 쓰지 않는다. `--check`는 저장된
projection과 현재 입력의 parity를 검사한다.

## Migration와 rollout

RC2는 추가 schema migration이 없다. 원본 snapshot 검증에 `rawQuestionHash`와
`identityTitle`이 들어 있는 최신 catalog를 사용한다. `X-Archive2-Contract` 헤더 허용과
원본/MIXED snapshot을 읽는 engine·Student Portal 변경도 Worker와 함께 배포한다.

1. 별도 감사에서 RC와 배포 source parity를 확인한다.
2. 현재 D1 schema를 읽어 기존 assignment/recipient/exclusion/blueprint/PDF columns를 확인한다.
3. `20260916_archive2_question_bridge.sql`만 검토해 적용한다. 이전의 전체 migration을
   무조건 재실행하지 않는다. 기존 ledger에는 destructive legacy 정리도 들어 있다.
4. Worker와 정적 Archive artifact를 함께 배포한다. 서버가 같은 `index_version`을 확인한다.
5. 읽기 reconciliation을 검토한 후 승인된 bridge backfill을 적용한다.
6. `ARCHIVE2_ENABLED=true`를 설정하고 pilot에서 실제 PDF/R2 및 학생 노출을 확인한다.

이 문서는 배포 승인 자체가 아니다. 이 작업에서는 위 production 적용을 수행하지 않았다.

## Legacy reconciliation

Wrangler read-only JSON export의 result sets는 assignments, exam_blueprints,
recipient timestamp groups 순서다. 샘플 질의는 `RC1_REPORT.md`의 측정 범위를 따른다.

```text
node archive/tools/archive2-reconcile-history.mjs --input=.tmp/archive2/remote-readonly.json --output=.tmp/archive2/reconciled.json --sql-output=.tmp/archive2/backfill-candidate.sql
```

도구는 export의 `rows_written=0`을 확인한다. source path와 ordinal 또는 등록된 UID를
사용하며 문제 번호만으로 ordinal을 추정하지 않는다. alias/unregistered는 unresolved다.
SQL은 검토용이며 도구가 실행하지 않는다. 기존 snapshots는 `INSERT OR IGNORE`로 보호한다.

## API

- `POST /class-exam-assignments/question-history`: 기존 권한, student_ids batch, all/recent/off,
  candidate UID intersection, coverage. 실패를 빈 이력으로 취급하지 않는다.
- `POST /class-exam-assignments/studio`: contract_version/index_version, class_id/student_ids,
  final normal/MIXED payload. 학생용 assignment는 최대 80문항이며 UI는 50문항씩 분할한다.
- MIXED는 `MIXED:archive2-...` key를 사용한다. 배부 후 내용·대상 변경은 새 문제지로 처리한다.
- PDF 실패는 저장 여부와 분리된다. `saved=true`인 응답의 assignment UUID를 보존하고
  같은 요청 또는 기존 `/{assignment.id}/pdf` 경로로 재시도한다.

history correctness는 recipients − exclusions JOIN assignment_questions다. 이후 unit과
difficulty 재분류는 과거 UID 이력을 제거하지 않는다. timestamp가 불확실한 legacy
coverage를 확정 이력이라고 표시하지 않는다.

## 롤백

`ARCHIVE2_ENABLED`를 끄고 pilot 진입을 제거하면 기존 frontend/API 경로를 계속 쓸 수 있다.
이미 저장한 bridge와 strict snapshot을 삭제하지 않는다. strict assignment를 legacy
upsert로 덮어쓰는 보호도 유지한다. 새 table/columns는 additive하게 남길 수 있다.

D1 transaction 근거는 [공식 batch 문서](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch)를
따르며, 실제 rollback 및 동시 등록 시나리오는 workerd 테스트로 별도 확인했다.
