# CODEX_TASK.md — routing stub

이 파일은 현재 canonical rule이나 실행 지시서가 아니다.

과거 2026-09-02 JS아카이브 신규 해설 v2.1 문서 동기화 지시서는
[`docs/rules/90_ARCHIVE/CODEX_TASK_20260902_JS아카이브_신규해설_v2.1.md`](docs/rules/90_ARCHIVE/CODEX_TASK_20260902_JS아카이브_신규해설_v2.1.md)에 원문 그대로 보존되어 있다.

현재 JS아카이브 규칙은 다음 순서로 읽는다.

1. [`docs/rules/00_RULES_INDEX.md`](docs/rules/00_RULES_INDEX.md)
2. [`docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md`](docs/rules/01_CANONICAL/JS아카이브룰북_v2.6.md)
3. SVG·그래프·`solutionImage` 또는 전수 품질 업그레이드·독립검수·봉인 작업이면 [`docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md`](docs/rules/02_PIPELINES/COMMON_PROTOCOL_v1.2.10.md)
4. SVG·그래프·`solutionImage` 작업이면 [`docs/rules/04_VISUAL/도형추출.md`](docs/rules/04_VISUAL/도형추출.md) v3.0
5. 도형의 방정식·좌표·직선·원 작업이면 [`docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md`](docs/rules/04_VISUAL/도형의방정식_해설_SVG_독립검수_운영규정_v1.1.md)
6. 해당 단원에 적용되는 `UNIT_OVERLAY`가 존재하면 그 문서
7. 시각 작업은 [`.codex/skills/apmath-visual-upgrade/SKILL.md`](.codex/skills/apmath-visual-upgrade/SKILL.md)의 강제 preflight를 따른다.

SVG·그래프·`solutionImage` 작업 시작 전 위 문서의 실제 버전·경로를 확인하고
`docs/rules/MANIFEST.md`의 바이트·SHA-256과 작업 트리를 대조한다. 필수 문서가
누락·불가독·버전 불일치·hash drift이면 작업을 시작하지 않는다. 적용 가능한
`UNIT_OVERLAY`가 없으면 그 사실을 기록하고, 존재하지만 읽지 못하면 보류한다.

이 root stub의 내용보다 위 rule-pack 문서와 사용자가 제공한 현재 작업 지시를 우선한다.
