# 작업 6 — 꾸러미 목록 파일(bundle) 형식과 읽기 전용 생성기 초벌 (계획서 6-1장)

## 왜

시험지 하나의 발문·그림·메타·4칸을 한 번에 다루려면 "이 시험지는 이 파일들로 이루어져 있고 지금 상태는 이렇다"를 적은 목록 파일이 필요하다. 지금은 그 정보가 시험지 JS, 그림 폴더, 정본 메타, 4칸 파일, 등록 대기 목록에 흩어져 있다. 이 작업은 형식을 정하고, **이미 있는 시험지에서 목록 파일을 만들어 보는** 읽기 전용 도구를 만든다. 등록기 입력으로 쓰는 일은 다음 작업이다.

## 어디에 쓰나

브랜치 `feat/exam-bundle-20261116`(최신 `main`에서), 보고 `TASK-06-REPORT.md`.

## 만들 것

1. `docs/architecture/Archive_Exam_Bundle_v0_DRAFT.md` — 형식 초안(2쪽 이내). 필드 표, 예시 1개, 무엇을 담고 무엇을 담지 않는지, 기존 요청 형식(난이도 요청 `archive-difficulty5-register-request-v1`, 검수 등록 요청 `archive-reviewed-exam-meta-register-request-v2`, 4칸 compact)과의 대응표.
2. `archive/tools/bundle/build-bundle.mjs` — 읽기 전용 CLI. `--exam <시험지 경로>` → 저장소 밖 `--out`에 목록 파일 JSON.
   - 담는 것: 형식 버전, 시험지 경로와 git blob 해시, 문항 수, 문항별 `questionUid`·`sourceOrdinal`·원표기 번호, 문항별 그림 참조와 각 파일의 해시(없으면 없음 표시), 문항별 메타 값의 **출처별 현재 값**(시험지 JS 인라인 / 정본 `question_metadata.json` / 4칸 파일)과 서로 다른지 표시, 등록 상태(정본 `fieldStatus`, 4칸 등록 인덱스), 부분 완성 표시(유형 보류, 그림 없음, 4칸 없음).
   - 담지 않는 것: 발문·해설 원문 사본, 판정 원장 원본, 캡처.
   - 작업 1의 완성도 검사(`archive/tools/completion/`)가 main에 있으면 그 판정을 불러 문항별 `overall`을 넣고, 없으면 그 칸을 비우고 보고서에 "작업 1 병합 뒤 연결"로 적는다. 판정 로직을 복사하지 않는다.
3. `archive/tools/bundle/diff-bundle.mjs` — 목록 파일 두 개(같은 시험지의 전·후)를 비교해 문항별로 무엇이 바뀌었는지(본문 지문, 그림 해시, 메타 값, 등록 상태)를 낸다. 본문 변경 종류는 `archive/tools/meta-foundation/source-delta.mjs`의 `classify`를 쓴다(옛 문항은 git에서 읽는다).
4. 테스트와 작은 픽스처, `tools/run-tests.js` 등록.

## 판단 기준

- 목록 파일은 "선언"이 아니라 실제 파일에서 매번 계산한 결과여야 한다. 저장된 완료 표시를 믿는 필드를 만들지 않는다.
- 필드 이름은 기존 정본 필드·상태 어휘(`docs/architecture/JS_Archive_Meta_OS_CURRENT.md` 2~3장)를 따른다. 새 이름이 필요하면 이유를 적는다.
- 운영 데이터는 고치지 않는다. `archive/data/` 아래에 파일을 만들지 않는다(형식만 정하고 저장 위치는 제안으로).

## 완료 기준

새 테스트 통과. 실제 실행 3건(중3 1학기 시험지 1개, 고1 시험지 1개, 유사시험지 1개)의 출력 요약과 소요 시간, 출처별 값이 서로 다른 문항 수를 보고서에 붙인다.
