# Geometry visual engine upgrade — final code qualification

- 상태: **GEOMETRY_VISUAL_ENGINE_CODE_READY** (공유 코드와 격리 fixture 범위)
- 브랜치: codex/geometry-visual-engine-upgrade
- 완료 Phase: 0–15. Phase15 봉인 commit은 이 보고서를 포함하는 Git commit으로 확인한다.
- publicationAuthorized=false; productionPromotion=false
- Python 77, Node 31, actual SVG 13, bbox 26, archive 12, determinism 13 PASS
- 신규 엔진 P0/P1=0/0; 신규 회귀=0; 원본 4493개 변경=0; 기존 verifier6개 바이트 일치

## 기존 production qualification finding

기존 v22 raw qualification은 **FAIL**를 유지한다. 현재 99건 중 91 PASS / 8 FAIL이며 고정 과거 분모는 94다.
8건의 입력은 모두 Phase0 baseline과 같고, 신규 회귀는 0이다. 이 코드 봉인은 해당 production finding을 해결하거나 PASS로 변경하지 않는다.
심각도 재분류와 production 자산 조치는 이후 inventory/FULL PILOT 범위다. 원본 FAIL 전체는 legacy-contract/qualification.json에 보존했다.

## Phase commits

- Phase 0: cbf74dcb69142f85d829a1c8f9c32f48457686b3 chore(geometry): freeze visual engine upgrade baseline
- Phase 1: 78202c0352bf220f4c88d3ca80d1191902938805 refactor(geometry): add shared numeric geometry model
- Phase 2: 76c1ff3c36ead20eebc7e1fd07ad07198c6a23f0 feat(geometry): add semantic visual specification
- Phase 3: d8d75f66331300b2813c7b0b25b8b24e88e57f75 fix(geometry): add safe math expression serializer
- Phase 4: d74e292757c9b82334e5589d1c2b37e255ee10e4 feat(geometry): add adaptive graph sampling and viewport
- Phase 5: e5394bb6857b71d03940b391c815a0deb80a2755 feat(geometry): add collision-aware label layout
- Phase 6: 65e2a9c31d842ed0c82103867442385aafd4571b refactor(geometry): add shared SVG composer and style tokens
- Phase 7: ac340fc9ad69a5b5ae51c02727f6f62443e37be1 feat(geometry): add optional safe TikZ draft adapter
- Phase 8: c6a0caeeff0346897c88a08979b56b24c7567360 refactor(geometry): route candidate entrypoints through shared engine
- Phase 9: 0f0084cccbfcd0910a129340752de06e4c923e4a feat(geometry): add independent static and actual SVG gates
- Phase 10: 91277df0c142786592748bf9dc5edb4b59307b0f feat(geometry): add real rendered bbox collision QA
- Phase 11: 12d5135d19a963d96053dc233dff52914d6f6ef5 feat(geometry): add generic native archive render evidence
- Phase 12: d7a7753d20812eebfa542dceef8b5b8f4e4b273c chore(geometry): bind config workspace and deterministic bytes
- Phase 13: 23b378b4114e187b8a99e627f83a4dba3343d913 test(geometry): qualify full visual engine regression corpus
- Phase 14: d234a232c794ef13d10c8c89d83aa35910a6af89 test(geometry): preserve legacy contract and qualify all archive modes

## 성능 측정

| 측정 | 범위 |
|---|---|
| SVG bytes | 6950.000–47526.000 |
| DOM node count | 62.000–99.000 |
| path count | 0.000–0.000 |
| text node count | 16.000–28.000 |
| build median ms | 4.117–56.280 |
| browser layout ms | 0.400–0.900 |
| standalone desktop render ms | 76.393–179.148 |
| standalone mobile render ms | 73.929–105.560 |
| native archive desktop ready ms | 327.900–15485.300 |
| native archive mobile ready ms | 321.900–13335.300 |

정확성 게이트 이후 측정했다. 환경별 시간 차이가 있고 임의 latency 예산을 PASS 조건으로 추가하지 않았다.

## Inventory / evidence

- 코드 변경 52개, 물리 evidence 996개: inventory.json (각 파일 SHA/bytes)
- code-ready.json: 필수 gate, raw asset binding, evidence SHA, 기존 FAIL 목록
- tests/phase-15-code-tests.json: 전체 unit/syntax 결과와 현재 코드 SHA
- performance/build.json, performance/browser.json: 원시 시간/DOM 수치
- Phase0–15별 Lead 정적 확인 및 Luna의 PASS/FAIL, 실패·수정 이력은 phases/ 및 tests/에 저장

## 범위와 후속 작업

- optional TikZ adapter is candidate draft only; converted SVG must pass the same gates
- archive mobile keeps existing fitted print-page preview; physical print/publication QA is reserved for FULL PILOT
- seal does not qualify all pre-existing production assets or authorize question publication
- main merge, GOLD 전체 이식, production SVG 교체 및 FULL PILOT은 수행하지 않았다.
