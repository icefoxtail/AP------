# .claude/skills — 외부(제3자) 스킬

Claude Code 전용 외부 스킬을 저장소에 넣어 두는 곳이다. 클라우드 세션·서브에이전트·여러 PC가 같은 스킬을 쓰게 하려고 사용자 홈(`~/.claude`)이 아니라 저장소에 둔다. 우리가 만든 스킬은 `.agents/skills`, `.codex/skills`에 있다.

## 등록 기준

외부 스킬을 추가할 때 모두 지킨다.

- **훅 금지.** 이유: 클라우드 환경에 이미 Stop/UserPromptSubmit 훅이 있어 겹친다.
- **SKILL.md 머리말에 `disable-model-invocation: true`가 기본.** 이유: 설명이 매 세션·서브에이전트 컨텍스트에 상시 로드되면 토큰이 낭비된다. 사용자가 `/이름`으로 부를 때만 로드된다.
- **기존 스킬과 이름·역할 중복 확인.** 대상: `.agents/skills`, `.codex/skills`, Claude Code 기본 제공 `code-review`·`simplify`·`security-review`. 이유: 같은 일을 하는 스킬이 둘이면 어느 쪽을 따를지 혼란스럽다.
- **정식 태그(없으면 커밋 SHA)로 고정.** 이유: 브랜치 끝을 쓰면 원본이 바뀔 때 검토 없이 동작이 달라진다.
- **라이선스 파일을 동봉하고 폴더에 `VENDOR.md`(출처·버전·로컬 수정·업데이트 절차)를 둔다.** 이유: 재배포 조건을 지키고, 다음 작업자가 원본과의 차이를 바로 안다.
- **산출물을 저장소 루트에 쓰지 않는다.** 쓰는 스킬이면 `.gitignore`에 넣거나 저장소 밖으로 보낸다. 이유: 생성물이 운영 소스에 섞이면 안 된다(AGENTS.md "Git에는 운영물만").
- **`tools/skills/manifest.json`에 등록하고 `node tools/skills/verify-skills.mjs --json`을 통과시킨다.** 이유: 등록되지 않은 스킬 폴더나 누락 파일을 CI가 잡는다.

## 목록

| 스킬 | 호출 | 용도 | 적용 대상·주의 |
| --- | --- | --- | --- |
| impeccable (skill-v4.8.0) | `/impeccable` | 기존 화면 디자인 개선: critique → polish·layout·adapt → 브라우저 확인 | 아카이브 `archive/`, APMS `apmath/`, 도형실험실 `apmath/playground/labs/`, 학생포털 `apmath/student/`. 수학 엔진·문제·정답·버튼 동작은 바꾸지 않는다. 화면을 바꾸면 Archive 2.0 런타임 계약과 `node tools/check-archive2-runtime.cjs`를 따른다. 금지 명령은 `impeccable/VENDOR.md`. |
| security-audit (c1c8a8c) | `/security-audit` | 워커 `apmath/worker-backup/worker/`, `workers/`의 인증·학생 데이터·권한·배포 설정 감사 | 기본 제공 `/security-review`는 변경분 검토라 역할이 다르다. 비용이 크므로 범위를 좁혀 호출한다. 주의는 `security-audit/VENDOR.md`. |

## 미확인

- Codex에서 이 스킬들이 동작하는지는 확인하지 않았다(이번엔 Claude Code 전용).
