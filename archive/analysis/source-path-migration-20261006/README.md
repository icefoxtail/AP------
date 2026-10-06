# 중2·기하 source 경로/표시용 태그 이전

검토 브랜치: `codex/m2-geometry-source-paths-20261006`
기준 main: `5b55eb186828826ead86db411423661163c7dd5e`

중2 미승격 10개와 기하 6개의 source-only JS를 최종 명칭/경로로 준비했다. 기하 6개에는 기출 suffix를 붙여 examTitle과 자산 디렉터리를 함께 정리했다. JS와 자산은 .tmp/archive에서 먼저 준비했으며 임시 파일을 Git에 넣지 않는다.

이 브랜치의 canonical 위치는 다음 조판/제작을 위한 검토용 source 입력이다. 답/해설/Meta/difficulty 완성, 품질 PASS, DB/index 등록, production publication, MAIN_DONE을 뜻하지 않는다. 이번 변경에서 그 작업을 수행하지 않았다.

기존 production 중2 5개는 bytes를 유지하고 generated 중복만 제거했다. 학생용 content/choices/questionType/answer/solution은 보존했다. 표시용 tags 및 최종 자산 참조만 수정했으며, 팔마중 q23/q24 경계의 누락 쉼표 1건은 source text를 바꾸지 않고 고쳤다.

과거 evidence/receipt는 소급 재작성하지 않는다. 제거된 입력은 migration.receipt.json의 base SHA와 legacyPath로 Git에서 복원할 수 있다. geometry의 examUid/path 변경과 영향 qid별 tag/asset mapping, 파일 SHA는 해당 receipt에 남겼다. 기존 source-only evidence를 새 artifact의 품질 PASS로 재사용하지 않는다.
