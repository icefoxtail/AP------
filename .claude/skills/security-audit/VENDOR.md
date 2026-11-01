# VENDOR: security-audit

외부 스킬을 저장소에 넣은 것이다. 원본을 임의로 고치지 않는다.

- 출처: https://github.com/cloudflare/security-audit-skill (경로 `skills/security-audit/`)
- 고정 버전: 정식 태그 없음 → 커밋 `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8` (2026-09-14, "Clarify guidance and full audit modes")
- 라이선스: MIT (`LICENSE`, 원본 루트 파일을 같은 커밋에서 가져옴)
- 사용법: 사용자가 `/security-audit`로 직접 호출할 때만 로드된다. 용도·적용 대상은 `../README.md`.

## 로컬 수정 (이것 하나뿐)

`SKILL.md` 머리말에 `disable-model-invocation: true` 한 줄 추가(`name:` 바로 다음 줄).
이유: 설명이 매 세션·서브에이전트 컨텍스트에 상시 로드되지 않게 하려는 것(토큰 효율). 그 밖의 파일은 원본과 같다. 추가 파일은 `LICENSE`, `VENDOR.md`뿐이다.

## 업데이트 절차

1. 새 태그가 생겼으면 그 태그, 없으면 검토한 커밋 SHA를 정한다.
2. `git archive <커밋> skills/security-audit LICENSE`로 풀어 현재 폴더와 `diff -r` 한다. 바뀐 내용을 읽는다.
3. 원본으로 덮어쓰고 위 한 줄을 다시 넣는다.
4. 이 파일의 커밋·날짜를 갱신한다.
5. `node tools/skills/verify-skills.mjs --json`이 PASS인지 확인한다.

## 금지·주의

- 전체 감사 모드는 서브에이전트를 많이 써서 비용이 크다. 범위를 좁혀(디렉터리 단위) 호출한다.
- 산출물(보고서·증거)은 `~/security-audit-skill/` 아래(저장소 밖)에 만들어진다. 저장소에 복사해 커밋하지 않는다.
- 대상 코드 실행·재현은 샌드박스에서만 한다. 운영 서버·실제 학생 데이터에 대해 실행하지 않는다.
- 기본 제공 `/security-review`는 변경분 검토이고, 이 스킬은 코드베이스 전체 감사라 역할이 다르다.
