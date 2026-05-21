# APMS 문서 구조

이 폴더는 AP Math OS / APMS 작업 기준 문서를 보관한다.

## 루트에 남기는 문서

프로젝트 루트에는 현재 작업 중인 파일만 남긴다.

- `CODEX_TASK.md`
- `CODEX_RESULT.md`

작업 완료 후 오래 보관해야 하는 결과서, 검수서, 분석서는 루트에 두지 않고 `docs/` 아래로 이동한다.

## docs 주요 구조

- `PROJECT_RULEBOOK_AND_STRUCTURE_MAP.md`  
  AP Math OS / 왕지교육 프로젝트 공통 룰북과 구조 지도.

- `PROJECT_PATCH_WORKFLOW_STANDARD.md`  
  패치 제작, 검수, 적용, 커밋 흐름 표준.

- `WANGJI_OS_ROADMAP.md`, `WANGJI_OS_STRUCTURE.md`  
  왕지교육 OS 상위 구조와 로드맵.

- `design/`  
  APMS UI 원칙, 대시보드 기준, UI 검수 SOP, 작업 역할 분리 메모.

- `initial-data/`  
  `/api/initial-data` 분리와 lazy load 관련 분석 문서.

- `timetable/`  
  시간표 버전/새학기 초안 설계처럼 계속 참고할 시간표 설계 문서.

- `reference/`  
  프로젝트 구조 요약처럼 참고용 성격의 문서.

- `archive/`  
  이미 사용한 검수서, 결과서, 감사 리포트, 과거 작업 산출물 보관.

## 정리 원칙

1. 루트에는 현재 작업 파일만 둔다.
2. 기준 문서는 `docs/` 또는 하위 폴더에 둔다.
3. 이미 사용한 결과서와 검수서는 삭제하지 않고 `docs/archive/`에 보관한다.
4. AI 작업자가 기준 문서를 헷갈리지 않도록 결과서와 룰북을 같은 위치에 섞지 않는다.
5. zip, 검수팩, 임시 압축 폴더는 원칙적으로 git에 넣지 않는다.
