# 다음 코덱스 작업자 인계 프롬프트 — 고2 대수/수학Ⅰ SVG

저장소: `icefoxtail/AP------`
작업·푸시 브랜치: `work/solution-upgrade-lane-30-20261121`
인계 기준 커밋: `0381e86ead5d5f5408eb8df39d7de5c46fbe0f29`

## 목표

고2 대수/구 수학Ⅰ 1학기 중간·기말 기출의 시각자료 작도 플랜을 이어받아, **공식 SVG 엔진으로 실제 생성 및 검증**하는 후속 작업을 수행하라. 이전 작업자는 **플랜 작성까지만 완료**했다. 완료됐다고 표시된 것은 SVG 실물 제작이 아니다.

## 시작 전 반드시 읽을 자료

1. `docs/agents/visual-svg.md`
2. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`
3. `archive/tools/geometry-equation/ops/svg-m1/planned/algebra/20261122/FINAL_HANDOFF.md`
4. 같은 폴더의 `FINAL_HANDOFF_MANIFEST.json`, `BATCH_MANIFEST.json`, `BATCH2_MANIFEST.json`
5. `deferred/**/authoring-plan.json` 11개 각각의 `layout`, `sourceConfirmation`, `engineNeeds`, `verification`

## 확인된 인계 상태

- 전체 시각 감사 표시 자산 **36건 전부 계획 문서화**: 기존 엔진 실행형 `item.json / plan.json / publish.json` 25건 + 조건부 작도 설계 11건.
- 개별 시험지 감사 추가 2건을 포함하여 **기존 엔진 실행형 초안 27건**. `plan-lint.cjs --shallow` **27/27 통과**. 전체 린트·SVG 렌더·학생 화면·Golden/Negative·출고 승인 **미수행**.
- 이번 추가 11건은 **`deferred/**/authoring-plan.json` 형식의 인계 설계**다. 문항 인용구와 원본 자산 blob SHA **11/11 일치**. **엔진 실행용 JSON이 아니며** `--shallow` 27건에 포함하지 않는다.
- 11건 중 **4건은 엔진/복합 레이아웃 계획**, **7건은 원본 근거 확인 HOLD**. 작도 설계가 존재한다는 이유로 HOLD 해제나 출고 승인 처리하지 말 것.

## 실제 후속 작업 순서

1. 원격 작업 브랜치를 최신 상태로 받아 현재 SHA와 자산 blob SHA부터 확인한다. 다른 작업자의 변경과 충돌 시 보존·재조정한다.
2. 기존 실행형 27건부터 공식 엔진 전체 린트·렌더를 진행한다. 저장소 지정된 고정 한글 폰트 `.tmp/apmath-visual-engine/dependencies/NotoSansKR.ttf`의 원본·해시를 검증하고 준비한다. 임의 폰트 대체로 검증 통과 처리하지 않는다.
3. 각 렌더 결과를 **원본 PNG/SVG와 실물 비교**해 좌표·길이·호·색칠·라벨·잘림·겹침을 확인하고, `publish.json`의 대체텍스트·크기·설명까지 검토한다. 문항별 통과/실패를 기록한다.
4. `deferred`의 엔진/레이아웃 4건은 개별 `authoring-plan.json`의 요구 기능을 검토해 공식 엔진 지원 또는 정식 엔진 확장으로 처리하고, 그때만 실행형 3종 JSON을 작성한다. 수작업 SVG 생성 금지.
5. 원본 HOLD 7건은 고해상도 출제본에서 손실된 숫자·선분·음영·단계를 독립 확인하고 필요시 **원문 교정 승인**을 받는다. 원본을 확보하지 못한 항목은 HOLD 목록에 남기고 다른 항목의 검증은 계속한다. 기존 해설 수치·정답으로 문제 원본을 역추정하지 않는다.
6. 특별 주의: 2026 효천고 중간 Q23은 `AB`와 `BC` 수평선 문구가 충돌하므로 원문 승인 전 수정 금지. 2024 강남여고 기말 Q19는 `R₃` 우측 잘림·음영 위치 확인 필요. 2019 매산여고 기말 Q19의 15개 선분은 원본 그림에서 대표 선분+생략점으로 표시되어 있으니 표현을 확인하라. 2019 순천여고 기말 Q07의 **(가)(나)(다)는 문제 빈칸 그대로** 남긴다.
7. 앞선 실행형 초안 중 2019 강남여고 기말 Q12, 2024 강남여고 기말 Q07도 원본 이미지 판독 HOLD가 유지됨을 확인한다.
8. 승인된 범위의 실제 수정만 엔진으로 반영하고, 학생 UI 렌더·Golden/Negative·preflight 등 저장소 정식 게이트를 검증한다. **원본 시험지 JS·정답·해설·이미지 교체 및 출고는 별도 승인 전 수행하지 않는다.**
9. 진행 결과를 문항별 `RENDERED_PASS` / `RENDERED_FAIL` / `SOURCE_HOLD` / `ENGINE_GAP`으로 나누어 MD와 매니페스트에 갱신한다. 실제 변경은 **위 작업 브랜치에 커밋·푸시**하고 커밋 SHA, 완료 수, 미해결 HOLD, 다음 단계만 간결히 보고한다. `main`에는 병합하지 않는다.

## 금지 및 완료 기준

- 수작업 SVG, 불명확한 원본 수치의 창작, 출처 미확인 상태의 HOLD 해제, 테스트 없이 출고 PASS 표기 금지.
- **플랜 작성 완료 / 엔진 렌더 완료 / 학생 화면 검수 완료 / 배포 승인 완료를 서로 다른 상태**로 관리.
- 문제가 있는 1건 때문에 전체 작업을 멈추지 말고 해당 건을 HOLD로 기록해 나머지를 진행.
