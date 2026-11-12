# AP Math 변경분 검수 실행 절차

이 절차는 기존의 검증된 해설을 매번 재생하지 않고, 신규·변경 입력과 명시적인 위험 표본을 고르는 방법입니다. 현재 검수 결과와 증거 위치는 `APMATH_PLAYER_AUDIT_20261112_FINAL.json`을 기준으로 확인합니다. 원본 실행 기록의 FAIL·REVIEW는 수정하지 않습니다.

## 1. 현재 작업과 증거를 먼저 고정

연결된 Notion 작업 라우터, 프로젝트 시작·생명주기 문서, 현재 Git main을 확인하고 독립 검수 브랜치를 만듭니다. 작업 기록은 정확한 taskId와 owner에 연결합니다. 이전 대화의 PASS 선언만으로 제외하지 않습니다.

수학·구조, 브라우저, 독립 시각·교육 검수는 별도 결과입니다. 각 단계 완료 시점에 커밋하며, 전체 완료에는 세 단계가 모두 필요합니다. 브라우저 원본과 PNG는 증거 보관처에 저장하고 Git에는 도구와 간결한 영수증을 둡니다.

## 2. 해시가 검증된 브라우저 baseline으로 선별

최종 보고서의 portable baseline 묶음을 내려받아 SHA256과 내부 `MANIFEST.json`을 확인하고 폴더 구조를 유지해 풉니다. 이 묶음에는 원본 JSONL·summary, inventory, baseline, 정확한 수동 판정과 그 판정에 사용된 PNG가 포함됩니다. 추가 시각 검토가 필요할 때만 전체 원본 캡처 묶음을 가져옵니다.

저장소 루트에서 실행합니다. `AUDIT_DIR`은 이번 작업의 증거 폴더, `BASELINE_DIR`은 검증한 묶음을 푼 폴더입니다.

```bash
node apmath/playground/next/tools/player-audit-scope.mjs \
  --out "$AUDIT_DIR/inventory.json"

node apmath/playground/next/tools/player-audit-select.mjs \
  --inventory "$AUDIT_DIR/inventory.json" \
  --baseline "$BASELINE_DIR/baseline.json" \
  --out "$AUDIT_DIR/selection.json"
```

새 도형·복잡한 움직임·모바일 배치·수학적 오해 가능성은 별도 위험 목록으로 추가합니다. `--risk`는 자동 선별된 대상을 삭제할 수 없습니다. 위험 목록의 `views`, `capture`, `playback`, `normalPlayback`으로 필요한 화면과 실제 연속 재생 표본을 명시합니다.

- 입력 fingerprint가 같아도 원본 행·summary·소스 묶음·해시·완료 계약이 일치해야 제외합니다.
- 새 입력, 변경된 입력, 누락·손상·상충 증거, 원본 FAIL은 실행 대상으로 남습니다.
- 원본 REVIEW는 정확한 체크와 원본 PNG를 독립 검토한 경우에만 `SCOPED_MANUAL_RESOLVED`로 구분합니다. 전체 시각 품질 PASS를 뜻하지 않습니다.
- 공통 플레이어·렌더러 변경은 의존하는 기존 브라우저 증거를 무효화합니다. 필요한 공통 회귀를 수행하되 수학 검수까지 자동으로 반복하지 않습니다.
- 이전의 정상 단일 재생 증거는 그 계약만 유지합니다. 더 강한 seek·복원 계약이 필요한 경우에만 `--require-seek`로 승격 대상을 고릅니다.

`selection.json`의 `targets`가 비어 있으면 자동 브라우저 검수 대상은 없습니다. 이 경우 빈 manifest를 CI에 올리지 않습니다. 대상이 있으면 1~8의 `shards`를 지정한 뒤 `apmath/playground/next/tools/player-fast-audit.targets.json`에 저장합니다. 선택 근거와 검수 브랜치를 함께 보존합니다.

## 3. 고속 브라우저 검수

전용 Actions workflow `player-fast-audit.yml`은 audit 브랜치의 명시적 manifest만 실행합니다. 학생 제품의 기본 속도는 바꾸지 않습니다. 검수 도구의 기본 QA 배율 10은 학생 기본 rate 1.5에 곱해 사용합니다.

모든 선택 해설에서 초기 상태, 자막·장 시작과 중간, 이동 중간·끝, 마지막 프레임, 종료 카드, 탐구 복원을 확인합니다. 실제 native timeline의 `stateAt`과 렌더된 값을 비교합니다. 종료·복원 캔버스의 bitmap/CSS 비율도 확인합니다. 지정한 표본에서는 실제 연속 재생과 정상 속도의 정지·되감기·재생·중도 닫기·다음 이동을 검사합니다.

정지 샘플과 고속 연속 재생은 서로 다른 증거입니다. 정상 속도 읽기·이해도, 모든 연속 프레임, 실제 터치 기기나 보조기술 사용을 검증한 것으로 보고하지 않습니다.

## 4. 원본을 집계하고 다음 baseline 생성

각 shard ZIP의 API digest, 전체 bytes, ZIP 무결성과 실제 source SHA를 확인합니다. 같은 실행의 `artifacts-index.json`을 원본 폴더에 함께 둡니다. 원본 JSONL을 재작성하지 않습니다.

```bash
node apmath/playground/next/tools/player-audit-aggregate.mjs \
  --artifacts "$AUDIT_DIR/raw" \
  --manifest "$AUDIT_DIR/manifest.json" \
  --inventory "$AUDIT_DIR/inventory.json" \
  --out "$AUDIT_DIR/aggregate.json"

node apmath/playground/next/tools/player-audit-baseline.mjs \
  --input "$AUDIT_DIR/baseline-input.json" \
  --out "$AUDIT_DIR/baseline.json"
```

입력 schema와 정확한 독립 판정 형식은 baseline 도구의 `--help`에 있습니다. 여러 실행을 결합할 때 `preferArtifacts`로 최신 증거의 우선순위를 명시합니다. 최신 FAIL·REVIEW를 오래된 PASS로 대체하지 않습니다. 모든 baseline 경로는 묶음 안에서 상대 경로로 유지합니다.

마지막으로 같은 inventory를 새 baseline으로 다시 선별해 누락된 기본 화면이 없는지 확인합니다. 도구 자체의 합성 fixture 결과는 제품 검수 PASS 수에 포함하지 않습니다.

## 5. 독립 검토와 마감

자동검사에서 발견한 문제, 복잡한 도형과 불확실한 화면을 별도 검토자가 실제로 봅니다. 동일 PNG bytes는 SHA를 확인해 재사용할 수 있습니다. 공통 코드 변경 뒤의 이전 관찰은 영향을 받지 않는 내용과 새 회귀로 확인한 동작 범위를 구분해 연결합니다. 수정된 복원 화면처럼 실제 배치가 달라지는 부분은 새 캡처를 직접 확인합니다.

최종 보고에는 전체·제외·신규·회귀 수, 세 단계별 상태, 실제 수정, 고속 재생 실측과 한계, 남은 항목, 브랜치·커밋·증거를 기록합니다. 원본과 metadata 저장 후 다시 읽어 SHA·revision을 확인합니다. main 병합과 배포는 별도 지시가 있어야 진행합니다.
