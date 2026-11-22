# 대수 1학기 시험지 SVG 대량 작도 플랜 — 2026-11-22

## 작업 범위

- 원본: 고2 대수/수학Ⅰ 1학기 중간·기말 2019–2026 (lane30).
- **13개 시험지의 17개 그림**에 대해 SVG 엔진 실행용 3종 입력 파일(item.json, plan.json, publish.json) 초안을 마련했다.
  - 문제 그림 14개, 해설 그림 3개.
  - 이미지 전수 감사의 표시 대상 36개 자산 중 **15개**에 대응한다.
  - 개별 심층 감사에서 추가 예약된 제일고 대수c Q09·Q12 두 건도 포함한다.
- 작업 기준 소스 리비전: 58d5ae41faad4aca51318b44798156cc6e946f1c.
- 정확한 문항, 원본 이미지 경로, blob SHA, 이전 HOLD 상태, 미작성 **21개** 표시 자산은 BATCH_MANIFEST.json을 참조한다.

## 검증 결과

1. 각 JSON 파싱·원본 JS 문항 번호·sourceQuote 원문 일치 **17/17**.
2. 공식 SVG 엔진 plan-lint.cjs --shallow 결과 **OK 17 / FAIL 0**.
3. 원본 이미지 blob SHA 대조 **17/17 일치**.
4. **전체 린트 및 실제 SVG 렌더는 미완료.** 기본 전체 린트는 엔진 고정 의존성 .tmp/apmath-visual-engine/dependencies/NotoSansKR.ttf가 없어 17개 모두 ENOENT로 중지됐다. 환경 결손은 플랜 자체의 통과/실패로 분류하지 않는다.
5. publish.json의 size는 SVG 생성·학생 화면 검수 전 제안값일 뿐이다.

## 다음 작업자 절차

1. 저장소의 archive/tools/geometry-equation/production/AUTHOR_GUIDE.md와 docs/agents/visual-svg.md 계약대로 **해시 검증된 고정 한글 폰트** 및 의존성을 설치한다. 임의의 대용 폰트로 승인 처리하지 않는다.
2. 각 하위 디렉터리를 하나의 그림 단위로 삼아 전체 plan-lint.cjs를 실행하고, 실패 시 plan.json의 사실·표시 목록을 수정한다.
3. SVG 엔진으로 렌더한 뒤 매니페스트의 sourceAsset 이미지와 좌표·변 길이·호·색칠·라벨을 나란히 비교한다. 잘림·겹침을 실제로 검사하고 publish.json의 대체텍스트·크기·설명을 최종 조정한다.
4. VISUAL_HOLD_READABILITY 또는 SOURCE_LINK_HOLD는 플랜이 존재하더라도 **출처 검수 승인 전 교체 금지**. 특히 강남여고 2019 기말 Q12, 강남여고 2024 기말 Q07 HOLD를 유지한다.
5. 새 SVG/원본 JS 연결은 별도 승인·테스트 게이트에서 처리한다. 이번 묶음은 작도 계획만 작성했으며 정답·해설·원본 이미지·배포 파일을 바꾸지 않았다.

## 다음 묶음 후보와 보류 원칙

- BATCH_MANIFEST.json auditBacklog의 AWAIT_PLAN_AUTHORING: 원본 조건이 확정되면 다음 묶음 작성.
- HOLD_SOURCE_CONFIRMATION: 원본 스캔 재확인 또는 출제 문장 교정 승인 이후 착수. 수치·색칠 영역을 추측하지 않는다.
- 복잡한 해설 패널 등 현 엔진 입력 계약에 맞지 않는 것은 별도 편집 레인으로 인계한다.

**상태: PLANNED_ONLY.** 학생 UI·Golden/Negative·출고 PASS 아님.
