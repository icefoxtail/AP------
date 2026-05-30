# Archive Rulebook Master Table Patch

이 패치는 아카이브 룰북 문서 업데이트 전용입니다.

## 포함 내용

- 기출 PDF → JS아카이브 후보 변환 룰북
- 기존 JS 태그 고도화/유사문제 태그 룰북
- 교육과정/소단원/유형/templateKey 마스터테이블 룰북
- 마스터테이블 JSON schema/sample
- Codex 작업용 SOP 3개
- `archive/textbook/.agent/SKILLS_INDEX.md` SOP 연결 추가

## 수정하지 않는 것

- `archive/exams/**/*.js`
- `archive/db.js`
- `archive/engine.html`
- `archive/mixed_engine.html`
- `archive/mixer.html`
- UI 문구

## 적용 후 확인

- 새 문서들이 프로젝트에 들어갔는지 확인
- `archive/textbook/.agent/SKILLS_INDEX.md`에서 새 SOP 3개 연결 확인
- 기존 JS/엔진 파일 diff 없음 확인
