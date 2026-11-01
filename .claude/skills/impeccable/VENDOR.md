# VENDOR: impeccable

외부 스킬을 저장소에 넣은 것이다. 원본을 임의로 고치지 않는다.

- 출처: https://github.com/pbakaus/impeccable (경로 `.claude/skills/impeccable/`)
- 고정 버전: 정식 릴리스 태그 `skill-v4.8.0` = 커밋 `414603bf14c7a344edb466bb1f85690c77ce8b7d` (SKILL.md `version: 4.8.0`, `scripts/VERSION` 0.1.18)
- 라이선스: Apache-2.0 (`LICENSE`), 제3자 고지 `NOTICE.md` (원본 루트 파일을 같은 커밋에서 가져옴)
- 사용법: 사용자가 `/impeccable ...`로 직접 호출할 때만 로드된다. 용도·적용 대상은 `../README.md`.

## 로컬 수정 (이것 하나뿐)

`SKILL.md` 머리말에 `disable-model-invocation: true` 한 줄 추가(`name:` 바로 다음 줄).
이유: 설명이 매 세션·서브에이전트 컨텍스트에 상시 로드되지 않게 하려는 것(토큰 효율). 그 밖의 파일은 원본과 같다. 추가 파일은 `LICENSE`, `NOTICE.md`, `VENDOR.md`뿐이다.

## 업데이트 절차

1. 새 정식 태그(`skill-vX.Y.Z`)를 받는다. HEAD나 브랜치 끝은 쓰지 않는다.
2. `git archive <태그 커밋> .claude/skills/impeccable LICENSE NOTICE.md`로 풀어 현재 폴더와 `diff -r` 한다. 바뀐 내용(특히 scripts, 엔진 체크섬, 훅 관련)을 읽는다.
3. 원본으로 덮어쓰고 위 한 줄을 다시 넣는다. `scripts/impeccable`의 실행 비트를 유지한다.
4. 이 파일의 태그·커밋·`scripts/VERSION`을 갱신한다.
5. `node tools/skills/verify-skills.mjs --json`이 PASS인지 확인한다.

## 금지·주의

- 금지: `npx impeccable install` (사용자 홈·프로젝트에 별도로 설치함).
- 금지: `/impeccable hooks on` (훅이 `.claude/settings.local.json`에 설치됨. 훅은 이 저장소에서 쓰지 않는다. 이유: 클라우드 환경의 Stop/UserPromptSubmit 훅과 겹친다).
- 금지: `init`·`document`를 대상 지정 없이 쓰는 것. 현재 방침: PRODUCT.md는 저장소 루트 1개(AP Math 공통), DESIGN.md는 화면 폴더별(`apmath/playground/` 완료, 나머지 `archive/`, `apmath/`(APMS), `apmath/student/`는 아직). `document`는 반드시 대상 폴더 경로에 쓰게 지정할 것 — 지정하지 않으면 루트에 써서 화면들이 섞인다. 이유: 이 저장소는 화면마다 디자인이 달라 하나의 루트 DESIGN.md로는 맞지 않는다.
- 엔진은 첫 실행 때 `~/.impeccable/bin`에 sha256(`scripts/engine-checksums.txt`) 검증 후 내려받는다. 네트워크가 필요하다.
- 실행 결과·세션 파일은 저장소 루트 `.impeccable/`에 쓰이므로 `.gitignore`에 넣었다. 커밋하지 않는다.
