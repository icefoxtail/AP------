# Archive 2.0 D-stage isolated inventory

- Source repository: `icefoxtail/AP------`
- Frozen main SHA: `ca60a38b1cb773bb946b671979061e9e09197daf`
- File denominator: **45**
- Total source bytes: **61,512,170**

## Purpose

고2·고3 공통 과목(semantic subject) 통합 D단계를 시작하기 전에 관련 UI, filtering, catalog build, taxonomy, Meta Foundation runtime, Unit Past runtime, tests를 한 SHA에 고정한 격리 인벤토리입니다.

## Isolation rule

이 브랜치의 `_isolated/archive2-d-semantic-subjects-ca60a38/files/` 아래 파일은 source blob SHA를 그대로 참조한 exact copy입니다. 원본 main 파일은 수정하지 않았습니다. 이 인벤토리 브랜치는 main에 merge하지 않습니다.

## D-stage boundary

- UI/display/query layer: 분석 후 수정 후보
- Archive2 core: semantic subject resolver 후보이나 selection semantics는 보존
- catalog/taxonomy/meta runtime: authority/evidence; 임의 수정 금지
- Unit Past core/runtime: 고2·고3 course/profile parity 확인 대상
- output/papers/mixer selector: boundary only; D단계 기능 수정 금지

상세 파일별 SHA/역할은 `INVENTORY_MANIFEST.json` 참조.
