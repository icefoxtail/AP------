# SCAN Source-Only → CREATE 동적 배정기 v1 (읽기 전용)

목적: 시험지 인테이크가 계속 늘어날 때 기존 고정 29건은 그대로 유지하면서, 새 원본은 운영 파일 / 기존 작업 / PR / Library / 공식 검수 증거와 대조한 뒤 **새 CREATE 대상** 또는 **기존 작업 인계 대상**으로 구분한다.

## Pro 12레인 / Plus 5레인 용량 전환 (v2)

- `--profile pro12`는 현재 Pro의 CREATE 12개를 실제 실행 슬롯으로 사용한다(기본값).
- `--profile plus5`는 향후 Plus용 실행 슬롯 5개에서 기존 12개 **논리 담당 큐**를 분담한다.
- 기존 29건의 소유 및 `rows[].lane`은 절대로 재배정하지 않는다. `rows[].executionSlot`만 12/5에 따라 바뀐다.
- `workers`는 실행 슬롯별 대기열이다. Plus 전환 때 기존 12개 예약을 모두 ON하지 말고 5개만 사용한다. 유효 writer lease가 있는 시험지는 슬롯 전환 전 먼저 마감하거나 정식 인계해야 한다.
- 코드 설정 변경은 `--profile plus5`로 가능하다. 실제 예약 OFF/ON과 동시 writer 안전성 검증은 별개다.
- 인덱스 source/main/branches/PR/Library/receipts/ownership 중 하나라도 불완전하면 `completeForDispatch=false`이며 신규 Git 쓰기 자동 허용하지 않는다.

## 현재 정본

- Git 원본: `codex/scan-intake-deliverables-20261012` → `스캔_인테이크_산출물/<시험지>/<시험지>.js`
- 학생 운영 파일: 최신 `main`의 `archive/exams/original/middle/m3/` 등 `archive/exams` 내 `original`/`product`/`production` JS
- Library: `/Archive2-GPT/generations/SCAN_M3_2021_2025/` (전체 재귀 목록)
- 현재 활성화할 범위: `중3`, 2025년 이하, 우선 2021~2025 배정 29건 보존. **2026 자동 제외**.
- 미래 2015~2020 인테이크는 동적 발견 가능. 중2는 같은 엔진을 다른 scope/캠페인으로 분리해서 사용.

## 실행

이 ZIP을 저장소 루트의 `archive/tools/scan_dynamic_intake_v1/`에 압축 해제한 뒤 실행한다. 라이브 실행은 Git과 Files/Library 스냅샷 권한이 있는 Codex/Work executor에 한한다. 이 도구는 읽기 전용이다.

Node.js 22 이상 필요. 저장소 local checkout에서 원본 브랜치 및 모든 원격 branch refs 최신 fetch 후:

```bash
node archive/tools/scan_dynamic_intake_v1/collect-git-inventory.mjs --outdir /tmp/scan-snapshots
node archive/tools/scan_dynamic_intake_v1/scan-dispatch.mjs \
  --source-index /tmp/scan-snapshots/git-source-index.json \
  --production-index /tmp/scan-snapshots/git-production-index.json \
  --branches-index /tmp/scan-snapshots/git-branches-index.json \
  --prs-index /tmp/scan-snapshots/git-open-prs-index.json \
  --library-index /tmp/scan-snapshots/library-index.json \
  --receipts-index /tmp/scan-snapshots/receipts-index.json \
  --ownership-index /tmp/scan-snapshots/ownership-index.json \
  --output /tmp/scan-snapshots/dispatch.json
```

`library-index.json`는 Files Library의 재귀 `list` 전체 결과를 `{"complete":true,"items":[{"path":"/.../CREATE/abc.zip"},...]}` 형태로 제공한다. **페이지가 빠졌으면 `complete:false`.** Git만으로 Library를 확인했다고 속이지 않는다.

`receipts-index.json` 형식은 `{"complete":true,"receipts":[{"examId":"...","stage":"CREATE","validation":"PASS","verified":true,"remoteReadback":true,"artifactSha":"<40자리 실제 최종 Git SHA>"}]}`. 확인된 공식 증거가 없다면 빈 배열을 사용하되, 실제로 해당 Library stage들을 확인한 경우에만 `complete:true`로 표시한다.

`ownership-index.json`은 `{"complete":true,"assignments":{"시험지ID":{"lane":"CREATE-B1","sourceBlobSha":"...","lease":{"active":false}}}}`. 29개 기존 담당은 엔진의 고정 pin이 1차 기준이고, 신규 담당은 **시험지 ID 해시 기반 12레인 안정 배정**이다. 이미 assigned된 시험지는 이 파일의 담당이 우선한다. 이 도구는 lease를 획득하거나 해제하지 않는다.

`--from-git` 옵션을 사용하면 source/main 인덱스를 자동으로 수집할 수 있다. 다만 모든 PR과 Library 조회는 별도 인덱스로 공급해야 한다.

## 상태의 의미

| 상태 | 의미 | 생성 여부 |
|---|---|---|
| `SKIP_PRODUCTION` | 동일 시험지가 main 운영 JS에 존재 | 재제작 금지 |
| `READY_R1` | 실제 공식 CREATE PASS + final SHA + 원격 readback 증빙 | 재제작 금지 |
| `PR_PENDING` | 기존 학생용 PR이 열려 있음 | 신규 중복 작업 금지 |
| `IN_PROGRESS` | 유효 writer lease 확인됨 | 다른 worker 선점 금지 |
| `CREATE_RESUME` | 기존 책임자 / Git 후보 / Library 제작물 존재 | 동일 결과를 인수해 계속 |
| `CREATE_NEW` | 전체 범위 중복검사 완료, 신규 원본 | CREATE queue 후보 |
| `SOURCE_REVISION_REVIEW` | 소스 SHA가 작업 중 변함 | 원본 임의 덮어쓰기 금지 |
| `DUPLICATE_REVIEW` | 동일 시험지 정규화 ID의 다중 원본 | 자동 배정 보류 |
| `INVENTORY_UNVERIFIED` | PR, Library, refs, ownership 등 확인 미완 | 자동 실행 보류 |

**중요:** `mayStartCreate`는 큐의 분류에만 해당하며 Git에 쓸 권한이 아니다. 모든 행의 `gitWriteAllowed`는 **false**로 출력한다. Writer claim, 원격 코드 쓰기, Work 실행, Node22 validator, Library 업로드, 예약 재가동은 이 1단계 도구에 포함되지 않는다.

## 검증

```bash
node --test archive/tools/scan_dynamic_intake_v1/tests/scan-dispatch.test.mjs
```

11개 자동 테스트: 별칭 동등성, 기존 29 pin, 신규 원본 자동 발견, 제품 파일 재제작 차단, 기존 브랜치/PR/Library 승계, 인벤토리 미완 fail-closed, 공식 영수증 SHA 검증, 소스 수정 보호, 신규 유입 후 기존 담당 불변, 이중 원본 차단.

## 다음 단계(별도 승인 전에는 실행하지 않음)

1. Work/Files 연결로 Library·영수증 최신 인덱스를 매 주기 작성.
2. 이 배정기가 완전한 snapshot에 대해서만 CREATE 동적 큐를 게시.
3. CREATE worker의 원자 writer claim과 stage 제품 마감, Work MASTER의 기술 복구를 연결.
4. 정규 R1/R2/R3 레인을 별도로 생성.

기존 예약 15개는 OFF 유지. Work MASTER 3개는 별도 Work 모드에서 생성/실행하도록 형님께 먼저 알릴 것.
