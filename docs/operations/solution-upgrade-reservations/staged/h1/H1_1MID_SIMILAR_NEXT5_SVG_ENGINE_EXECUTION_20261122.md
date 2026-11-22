# 고1 1학기 중간 유사 다음 5종 — SVG 엔진 실행 및 시각 QA 인계

> 작성일 2026-11-22 KST · 대상 `work/solution-upgrade-h1-similar-1mid-20261122`. **엔진 렌더·publish 이전의 계획**이다.

## 0. 시작 조건

- [JSON manifest](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/manifest.json)에서 26개 slot의 `sourceFile`, `sourceSha`, `originalImageSha`, `existingImageSha`를 확인한다. 기준 소스 commit은 `ebe97fab7ea5ea9716638d20764d66dde1d76b2e`.
- `AUTHOR_GUIDE.md`와 `ops/svg-m1/briefs/plan.md`, `plan-current.md`를 직접 읽고 공식 CLI를 사용한다. 엔진 코드는 바꾸지 않는다.
- `BLOCKED_MATH`(매산 q12 S)는 정답과 선택지 교정 전 **게시 금지**. 매산 q10은 치수 y가 전체 가로인 구획임을 문제 그림으로 명시한 뒤 시각 QA한다.
- 수학 오류 별도 필수 교정: 매산 q11(공통 해 없음), q18(잘못된 인수분해), 순천 q16(퇴화된 직육면체), 제일 q15(빈 해설·모호한 일반항), 팔마 q23(서논술 답 메타데이터), 제일 q18(그림 조건). 이 작업의 JSON 패킷만으로 해결되지 않는다.

## 1. 슬롯 단위 공식 입력

```bash
PACKET_ROOT='docs/operations/solution-upgrade-reservations/staged/h1/H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS'
for SLOT in "$PACKET_ROOT"/N5-*_q*_*; do
  [ -d "$SLOT" ] || continue
  node archive/tools/geometry-equation/ops/claude-batch/plan-lint.cjs "$SLOT/plan.json" || continue
  SLOT_NAME="${SLOT##*/}"
  node archive/tools/geometry-equation/production/render-plan.mjs \
    --item "$SLOT/item.json" \
    --plan "$SLOT/plan.json" \
    --out ".tmp/svg-m1/runs/h1-1mid-next5/$SLOT_NAME/out"
done
```

- 각 slot의 `figure-result.json`에서 `ARCHIVE_BOUND` 확인. 거부 사유가 있으면 엔진 자체를 수정하지 말고 `plan.json`의 capability-specific 데이터를 보완한다.
- `ENGINE_SUPPORT_CHECK` 일곱 건: 매산 q10P(내부 칸막이·전체 가로 치수), 강남 q16P(세 직교기둥+2패널), 순천 q7S(일차식 graph), 순천 q20P(무리수 원-현 정확 좌표), 제일 q13P(계수 부호 미상 대표 포물선), 팔마 q17P(도형 표현), 팔마 q23S(문항 answer 메타 일치). 각 엔진 결과에 독립 계산을 대조한다.
- 이 저장소 기준 컨테이너는 `visual_engine` 모듈이 없어 **공식 lint/render를 성공시키지 못함**. 별도 Codex 환경에서 의존성 복원 후 전수 재시도한다.

## 2. 독립 이미지 QA

| 역할 | 필수 시각·수학 QA | 승인 기준 |
|---|---|---|
| 신규 문제 P 4개 | 원본의 배치 역할, 유사 수치·기호, 정답 누출, 원치 않는 숫자·선 추가 | **A-only PASS**, 정답/도출값 표시 금지 |
| 신규 해설 S 20개 | 실제 식의 계수·판별식·정수 구간·꼭짓점·점 이동·치수선 | **A-only PASS**, 계산식과 모든 표식 일치 |
| 기존 문제 강남 q16 P 교체 | [그림 1] 단독 기둥 및 [그림 2] 세 기둥이 모두 존재, 중앙 x³이 세 번 중복 | **A/B PASS**, 기존 도형보다 빠진 정보 없음 |
| 기존 해설 순천 q5 S 교체 | 함수 −x²+4x+5 및 정의역 [−1,1], 끝값 0·8, 무관 L/R/T 도형 제거 | **A/B PASS**, 답을 독립 재검산 |

- SVG를 공식 PNG 도구로 재래스터하여 원본 SVG와 pixel-level label/선/채움 오독이 없는지 확인한다. 375px 모바일, A4 인쇄, 문제/해설/정답 실제 호출 화면, 100%와 축소 크기를 각각 점검한다.
- 원본과 유사는 숫자가 달라질 수 있다. 원본 그림을 픽셀 복사하지 않고 **조건 보존**, 유사 정답 누출 없음, 역할 대응, 가독성에 따라 최종 승인한다.
- 복합 SVG에서 라벨 몰림·너무 짧은 치수선·선 교차·좌표 잘림이 있으면 plan의 layout/coordinate placement만 조정하고 다시 렌더한다.
- `publish.json.size`는 `figure-result.json.sizeClass`와 맞춘다. 생성 후 source provenance를 검증한다.

## 3. 게시 및 원본 보전

- 신규 역할만 A-only 검수 후 링크 추가. 기존 이미지 2건은 A/B PASS 후 `replace:true` 계약으로 교체한다. 원본 SVG·수정 전 JS는 삭제하지 않는다.
- 공식 `pubflow.py --batch`는 독립 QA를 통과한 결과에만 실행한다. 최종 브랜치 커밋에는 렌더 결과, QA 리포트, 링크 변경 diff, 원본/변형 SHA를 포함한다.
- 오류/미지원/보류 slot은 `UNSUPPORTED` 또는 `BLOCKED_*`로 남기고 **완료 또는 게시로 보고하지 않는다**.

## 4. 완료 조건

- 111문항의 P0 콘텐츠 오류가 정정되거나 분리 보류됐음이 명확하다.
- 26개 slot의 JSON lint/engine 지원 결과가 각각 기록됐다.
- 정상 렌더한 신규 이미지 24개는 A-only, 교체 2개는 A/B로 실제 육안 PASS했다.
- 학생이 보는 source/solution 연결과 `sizeClass`/alt/caption을 대조했고 게시/브랜치 diff를 독립 재검토했다.

기초 감사: [5종 통합 시각 검수](./H1_1MID_SIMILAR_NEXT5_VISUAL_QA_20261122.md) · [26세트 JSON README](./H1_1MID_20261122_NEXT5_PLAN_JSON_DRAFTS/README.md).
