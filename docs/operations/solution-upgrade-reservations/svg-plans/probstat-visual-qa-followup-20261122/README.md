# 확률과 통계 기출 시각 QA WARN — 후속 SVG 엔진 plan JSON (3문항)

**작성: 2026-11-22 KST. 단계: JSON 초안 작성 완료 / 엔진·렌더·게시 NOT_RUN.**

기존 `probstat-upgrade-hold-20261122`는 감사 UPGRADE/HOLD 127문항을 모두 판정했다. 이번 묶음은 그 목록에 **포함되지 않았지만** 2학기 기출 시각 QA 보고서가 `REVIEW`/개념 WARN으로 분리한 **KEEP 3문항**을 다룬다. 원본 JS·SVG·PNG와 `main`은 바꾸지 않았다.

| 문항 | 시각 WARN의 핵심 | 신규 `plan.json` 초안 |
| --- | --- | --- |
| 2021 효천고 2학기 기말 Q03 | 원문에 없는 `a<g(b)<f(a)<b` 순서가 x축에 고정돼 보임 | `stat-chart-figure-v1 / NORMAL_CURVE`의 조건 충족 **예시 두 곡선**. a=0,b=1,σX=1,σY=2는 원문 수치가 아니며, `f(a),g(b)`를 x축 눈금으로 쓰지 않음 |
| 2022 순천고 2학기 기말 Q09 | 전체 음영 확률 3/8과 계수 a=1/2가 서로 다른 부분의 면적처럼 보임 | `piecewise-polynomial-spike-v1`의 V자 밀도와 **단일 중앙 음영**. 계수는 캡션에서 구별 |
| 2023 복성고 2학기 중간 Q16 | `a=1` 개형은 전체 면적 3/2이라 실제 확률밀도로 오독할 위험 | `piecewise-polynomial-spike-v1`의 **비율 좌표** `u=x/a,v=f(x)/a`. 삼각형 넓이비 그림이며 실제 밀도값이 아님을 명시 |

## 생성 파일과 조건

- 문항별 `items/<exam>/qNN/item.json`, `plan.json`, `publish.json`, `evidence.json` 각 한 개.
- `index.json`에 세 문항의 출처·원본 JS SHA 및 기존 SVG SHA를 기록. **현재 GitHub main의 blob SHA와 기존 심층 감사 MD에 기록된 SHA가 모두 일치함을 확인**했다.
- `publish.json`의 alt·caption·size는 **초안**이다. engine이 보고하는 실제 `sizeClass`와 맞추기 전 게시하지 않는다.
- `plan.json`의 sourceConditions와 newVisualInformation은 SVG author 가이드 형식을 따르지만 **plan-lint, 도형 렌더, 실제 PNG 검수는 NOT_RUN**이므로 최종 엔진 PASS를 주장하지 않는다.
- Q03의 숫자는 문제에서 주어지지 않은 임의의 **조건 충족 한 예**다. 이 수치가 원문에 주어진 사실처럼 보이면 재계획한다.
- Q16의 비율좌표 그림 면적 3/2은 **확률이 아니다**. 실제 확률밀도의 정규화 조건은 `(3/2)a²=1`이다. 색칠 영역과 전체 영역의 비는 `(3/4)/(3/2)=1/2`이다.

## 다음 Codex/Claude Code 실행 순서 (이 커밋에서는 수행하지 않음)

1. `item.json`의 JS/source ordinal과 `evidence.json`의 source/SVG blob SHA를 재검증한다.
2. `archive/tools/geometry-equation/production/AUTHOR_GUIDE.md`, `docs/agents/visual-svg.md`를 읽고 `ops/claude-batch/plan-lint.cjs`로 문항별 계획을 검사한다.
3. engine이 SPEC 오류를 내면 **plan만 고친다**. 손 SVG 작성 금지. 확률 분포의 정규화, 눈금·음영·면적을 독립 계산으로 대조한다.
4. 각 엔진 SVG를 PNG 600px로 렌더해 원본 PNG·현재 SVG와 나란히 육안 검수한다. 후보 한 예만 표시한 경우에는 그림에 **예시**임을 실제로 명시한다.
5. 승인된 plan만 SVG 엔진으로 출판하고, JS 경로 반영/학생용 검수/Golden/Negative를 별도 작업으로 처리한다.

## 범위 제외

접근성 루트 메타데이터나 모바일 `WATCH`는 이번 **신규 그림 제작 JSON** 대상으로 억지 분류하지 않았다. 기존 SVG의 `<title>/<desc>` 또는 제품 화면 CSS 검사로 해결할 수 있는 별도 큐다. 유사시험지 작업은 여기서 시작하지 않았다.
