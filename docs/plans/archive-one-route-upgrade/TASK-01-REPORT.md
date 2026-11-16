# TASK-01 완료 보고

## 커밋 및 범위
- 구현: `02567ad770f1f1dd7f05451e57b1f526d469a8a5`, `feat/completion-check-20261116`.
- 기준 HEAD: `3e4c4404463f7556898048de43f8ec0d8cac2cda`. 기존 원격 파일에 구현이 없어 TASK-01 명세로 구현했다. 접근할 수 없는 이전 미커밋 작업을 복구했다고 주장하지 않는다.
- PR/main 병합, 데이터·registry 수정, 승인·등록 변경 없음.
- 추가: archive/tools/completion/check.mjs, lib.mjs, tests/archive-completion-check.test.mjs, tests/fixtures/completion-check/cases.json.
- 변경: tools/run-tests.js 필수 명령 등록, docs/agents/metadata.md 사용법 3줄.

## 재사용 및 조건 출처
- tools/4slot/build-4slot-runtime.cjs: loadBank, build(...).index, sha. 저장된 인덱스와 현재 read-only 재검증 결과를 함께 확인한다. UID와 source tuple 검증, payload·asset freshness, 기존 continuity 예외를 그대로 재사용한다. 새로 등록 가능한 행을 REGISTERED로 승격하지 않는다.
- archive/tools/meta-foundation/active-registry.mjs: loadActiveMetaRegistry, validateActiveMetaFields. 활성 키·부모·curriculum binding 조건 재사용. registry 오류는 수정 없이 진단으로 노출한다.
- archive/tools/meta-foundation/rpm-active-resolver.mjs: DIFFICULTY_CONFIDENCE, DIFFICULTY_BOUNDARY_FLAGS, LEGACY_LEVEL_COMPATIBILITY.
- archive/tools/meta-foundation/source-delta.mjs: sourceFingerprint. 현재 fingerprint 일치 여부만 부가 표시하며, 역사적 변경 유형을 추정하지 않는다.
- archive/tools/archive-content-inputs.mjs: questionAssetReferences, localAssetPath.
- import 시 실행되는 builder의 비공개 조건은 옮김: build-archive2-catalog.mjs:232 approvedFieldStatus 정규식, :103-136 유형 HOLD 관련 조건(코드 주석에도 출처).
- verify-archive-content-scope.mjs:18-35의 Python ElementTree XML parser 방식. 외부 통신 없이 SVG XML/root 확인만 한다.
- 정본 question_metadata.json을 사용하며 인라인 차이는 inlineDiffers에 표시한다. unit 이름/키는 active tag master와 대조한다.

## 검증
- `node --test tests/archive-completion-check.test.mjs`: PASS 32/32. 모든 상태값, 순수 함수 입력 불변, canonical 우선, registry 실패 시 보수적 처리, SVG XML, data SVG, CLI 선택, 경로 traversal·저장소 내부·symlink 출력 거부 확인.
- `node --check archive/tools/completion/check.mjs`, lib.mjs, tools/run-tests.js: PASS.
- `git diff --check`: PASS.
- 두 실제 실행 전후 git status 동일. 출력은 /tmp에만 작성. 원문·정본·index의 작업트리 변경 없음.
- 중3 명령: `node archive/tools/completion/check.mjs --scope original/middle/m3/1 --format json --out /tmp/completion-m3-final.json --require complete`. 미완성 데이터이므로 예상대로 exit 1.
- 중1 명령: `node archive/tools/completion/check.mjs --scope original/middle/m1 --format json --out /tmp/completion-m1-final.json`. exit 0.

## 실제 결과
칸별 부족 수는 중복된다. overall 분포 합계는 전체 문항 수이다.
### m3
소요 33.72초.
```json
{
  "exams": 115,
  "questions": 2750,
  "distribution": {
    "stem": {
      "OK": 2750
    },
    "answer": {
      "OK": 2492,
      "MISSING": 258
    },
    "solution": {
      "OK": 2492,
      "MISSING": 258
    },
    "figure": {
      "NOT_NEEDED": 2019,
      "OK": 729,
      "BROKEN_SVG": 2
    },
    "unit": {
      "LABEL_MISMATCH": 624,
      "MISSING": 718,
      "APPROVED": 1408
    },
    "difficulty": {
      "NUMBER_ONLY": 1815,
      "MISSING": 25,
      "APPROVED": 886,
      "INVALID": 24
    },
    "type": {
      "MISSING": 2554,
      "INVALID": 177,
      "HOLD": 19
    },
    "fourSlot": {
      "REGISTERED": 1803,
      "STALE": 523,
      "MISSING": 424
    },
    "overall": {
      "IN_PROGRESS": 2490,
      "BLOCKED": 260
    }
  }
}
```

### m1
소요 26.07초.
```json
{
  "exams": 44,
  "questions": 1047,
  "distribution": {
    "stem": {
      "OK": 1047
    },
    "answer": {
      "MISSING": 193,
      "OK": 854
    },
    "solution": {
      "MISSING": 193,
      "OK": 854
    },
    "figure": {
      "NOT_NEEDED": 381,
      "OK": 666
    },
    "unit": {
      "MISSING": 193,
      "APPROVED": 653,
      "RECORDED": 201
    },
    "difficulty": {
      "NUMBER_ONLY": 465,
      "APPROVED": 568,
      "MISSING": 14
    },
    "type": {
      "MISSING": 296,
      "INVALID": 731,
      "HOLD": 20
    },
    "fourSlot": {
      "REGISTERED": 844,
      "MISSING": 187,
      "STALE": 16
    },
    "overall": {
      "BLOCKED": 193,
      "IN_PROGRESS": 854
    }
  }
}
```

## 대조값 차이 및 원인
- 중3 시험 115/문항 2750 일치. 숫자 보유 2725 = NUMBER_ONLY1815 + APPROVED886 + INVALID24. INVALID24는 difficultyConfidence=reconstructed_evidence 등 기존 허용값 밖 보조값 때문에 숫자가 있어도 승인으로 세지 않는다.
- 중3 4슬롯 작성2326 = REGISTERED1803 + STALE523, 등록1803 일치. 523은 기존 빌더의 STALE_STUDENT_PAYLOAD.
- 중1 시험44/문항1047, 난이도 숫자1033 = NUMBER_ONLY465 + APPROVED568 일치.
- 중1 참고 등록860과 현재 REGISTERED844의 차이16은 기존 빌더가 STALE_STUDENT_PAYLOAD로 대기 처리한 문항이다. 저장된 등록 이력만으로 현재 유효하다고 세지 않는다.
- 기존 registry의 canonical hash 불일치 2건: archive/data/meta-foundation/canonical/concepts/middle1.json, plane-geometry.json. loadActiveMetaRegistry는 UNAVAILABLE을 반환한다. 따라서 키가 있는 유형 중 중3 177/중1 731은 INVALID로 보수적 표시한다. 데이터나 검증 기준을 수정하지 않았다.
- 중3 unit LABEL_MISMATCH624는 정본의 legacy 단원키/이름이 현재 master와 다른 경우 등. 예: M3-05 정본 이름 이차함수와 그 그래프, master 이름 삼각비. 임의 정규화하지 않았다.

## 모호한 상태와 한계
- 난이도 보조 3칸은 완전하지만 fieldStatus.difficulty 미승인인 경우에 해당하는 전용 enum이 명세에 없다. COMPLETE로 승격하지 않도록 NUMBER_ONLY + reasons=DIFFICULTY_APPROVAL_PENDING으로 표시한다. 이 경우 다른 값이 완전하면 overall=PENDING_REGISTER이며, 보조값 자체가 불완전하면 IN_PROGRESS다.
- 원격 이미지 참조는 네트워크 검증하지 않는다. FILE_MISSING으로 보수적 표시하되 figureDetails.unverifiedRemote에 따로 남긴다. 로컬·inline·data SVG는 XML 확인한다.
- sourceFingerprintMatches는 사실 비교만 한다. metadata 재승인이나 source-delta 역사 분석을 수행하지 않는다.
- 수학적 정오, 그림과 문제의 의미 일치, 이미지 시각 QA: NOT_RUN.
- tools/run-tests.js 전체, --all 전범위, 배포/브라우저 동작, CI 완료 검증: NOT_RUN.
- 소요 시간에는 production 4slot builder의 전체 입력 read-only 검증도 포함된다.
