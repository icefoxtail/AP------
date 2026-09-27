# Archive 작업 폴더

신규 작업은 `_generated`, `candidate/`, `.candidate.js`를 만들지 않는다.
처음부터 실제 Archive 파일명과 상대 경로를 사용하고 상위 폴더로 작업본을 구분한다.
공용 코어의 모든 pipeline profile은 같은 작업 폴더 인터페이스를 사용한다.

```text
archive-work/
  exams/original/high/h1/1mid/<시험지전체명>.js
  assets/images/<시험지전체명>/q001_visual.png
  assets/images/<시험지전체명>/q001-solution.svg
  evidence/<시험지전체명>/
    manifest.json
    source-files.json
    extraction.json
    pages/page_p001.png
    reports/source_inventory.json
    reports/source_identity_map.json
    reviews/<run-id>/run.json
```

`archive-work`는 예시이며 `--work-root`로 저장소 내 다른 폴더를 지정할 수 있다.
JS의 `image` / `solutionImage`는 `assets/images/...` 그대로 유지한다.
원본 문제 그림과 해설 그림은 같은 시험지 에셋 폴더에서 파일명으로 구분한다.
검수 보고서와 페이지 판독 근거는 `evidence`에 둔다. 실제 시험지 JS/에셋에
generated lifecycle marker를 만들거나 성공 후 자동 삭제하지 않는다.

## 공용 코어

저장소 루트에서 실행한다.

```powershell
node archive/tools/pipeline-core/cli.mjs workspace-init --work-root archive-work --exam-file original/high/h1/1mid/<시험지전체명>.js
node archive/tools/pipeline-core/cli.mjs preview --work-root archive-work --exam-file original/high/h1/1mid/<시험지전체명>.js
```

`preview`는 실제 production engine을 사용하되 선택한 시험지 JS와 에셋은 작업
폴더에서 읽는다. 작업 에셋이 없으면 production 이미지로 대체하지 않고 404를
반환한다. 출력 URL은 `preview=1`이므로 출제 등록/QR 부작용을 차단한다.
작업 폴더를 직접 서비스에 등록하지 않는다.

기존 시험지 수정의 검수 준비:

```powershell
node archive/tools/pipeline-core/cli.mjs prepare --pipeline logic-visual --run-id review-01 --work-root archive-work --exam-file original/high/h1/1mid/<시험지전체명>.js
```

원본은 기본적으로 `archive/exams/<동일 상대 경로>`에서 읽고 작업본은
`archive-work/exams/<동일 상대 경로>`에서 읽는다. 원본 에셋과 작업본 에셋도 각각의
루트에서 읽는다. 다른 원본 폴더는 `--source-root`, 명시적 원본 JS는 `--source`로
지정한다. 새 기출의 전체 제작은 별도 동결한 원본 JS를 `--source`로 지정하고,
`prepare-v2`의 기존 manifest / registry / builder / work-batch 조건을 충족한다.
원본과 작업 JS는 다른 폴더의 같은 파일명이어도 된다.

`--workdir` 생략 시 `evidence/<시험지전체명>/reviews/<run-id>`에 새 검수 실행을 만든다.
render capture도 그 시험지 `evidence` 아래 새 폴더를 지정하면 된다.
검수 입력 해시, 원본 충실성, 독립 풀이, Meta, 시각자료, 최종 반영 검증은 유지한다.

기존 봉인된 manifest의 `candidate` input role / `candidatePath`와 옛 `--candidate`
옵션은 호환용으로 읽는다. 내부 검수 schema를 바꾸거나 과거 검수 증거를 재작성하지
않는다. 신규 파일명이나 저장 폴더가 candidate일 필요는 없다. 명시적 파일 입력은
`--working-exam` 옵션을 사용할 수 있다.

## 발문·에셋 추출

진입점: `archive/tools/past-exam-pipeline/run-source-exam.mjs`.
샘플 manifest: `archive/tools/past-exam-pipeline/examples/source-exam.manifest.json`.

1. 실제 시험지 제목을 `examId`와 `archiveRelativePath`의 파일명에 동일하게 넣는다.
2. PDF는 `pdfPath`, 이미지 시험지는 순서가 확정된 `sourcePageImagePaths`를 넣는다.
   둘을 동시에 지정하지 않는다. HWP는 먼저 PDF/페이지 이미지로 변환한다.
3. `--prepare`로 전체 페이지와 판독 요청서를 만든다. 이 단계는 빈 JS를 만들지 않는다.
4. 전체 페이지를 읽어 `inventory-input.json`에 모든 문항의 번호·페이지·disposition을
   기록하고 독립 확인 후 `status: INDEPENDENT_INVENTORY_VERIFIED`로 확정한다.
   페이지 근거 경로는 `pages/page_p001.png`와 같이 시험지 evidence 폴더 기준이다.
5. 요청 schema에 맞게 발문·선지·원본 그림 bbox의 페이지별 JSON을 작성한다.
   원본 문항 목록은 이 JSON의 번호를 믿고 자동 생성하지 않는다.
6. manifest의 `sourceInventoryPath`와 `visionPageExtractJsonPath`를 지정하고 실행한다.

```powershell
node archive/tools/past-exam-pipeline/run-source-exam.mjs --manifest <입력manifest.json> --work-root archive-work --prepare
node archive/tools/past-exam-pipeline/run-source-exam.mjs --manifest <입력manifest.json> --work-root archive-work
```

성공하면 실제 파일명의 JS와 필요한 문제 그림이 작업 폴더에 작성된다. 정답·해설은
빈 값이며 결과는 `SOURCE_EXTRACTED_REVIEW_REQUIRED`다. 발문 원본 대조와 그림의
잘림·라벨·다른 문항 오염 검수는 여전히 필요하다. 자동 추출 성공은 semantic PASS나
production 반영 승인이 아니다. `NEEDS_WORK`는 프로세스 exit code 2다.

재추출은 `--replace-source`를 명시해야 한다. 작성된 정답·해설·해설 그림이 있으면
재추출을 거부한다. 문항 누락·번호 불일치·원본 변경은 거부하고 기존 JS를 보존한다.
파일명 중복을 자동으로 `_2`로 바꾸지 않는다. 문제지/해설지/중복 원본을 먼저 고른다.

이미지 원본은 순서별 raw SHA를 `source-files.json`에 기록한다. 문서 SHA는 그 SHA
배열의 공용 `objectSha`이며 입력 inventory에 선언한 값이 다르면 거부한다.

배치는 기존 선택 manifest를 재사용한다.

```powershell
node archive/tools/past-exam-pipeline/run-batch.mjs --inventory --source-root D:/기출 --work-root archive-work
node archive/tools/past-exam-pipeline/run-batch.mjs --run-selected --selected-manifest <선택manifest.json> --source-only --prepare --work-root archive-work
node archive/tools/past-exam-pipeline/run-batch.mjs --run-selected --selected-manifest <선택manifest.json> --source-only --work-root archive-work
```

일괄 준비 후 각 job에 독립 확인한 inventory와 판독 JSON 경로를 넣어야 한다.
전체 V3 제작용 실행도 새 기본 config에서는 같은 작업 폴더에 출력하며 기존
calibration과 최종 검증은 유지한다. 과거 `generatedRoot`를 명시한 config는
봉인된 옛 실행 복구에 한해서 호환된다.

## 적용 범위

이번 변경은 공용 prepare/preview/에셋 결박 인터페이스와 Past Exam의 신규 기본 출력,
발문 추출, 후속 evidence/검증/반영 경로를 연결한다. 다른 전용 생산기나 ALIVE,
textbook 실행기의 기존 기본 출력 위치까지 자동으로 일괄 변경하지 않는다.
해당 실행기들도 이 공용 작업 루트를 전달하도록 후속 전환할 수 있다.
production 반영은 최종 검증된 JS/에셋만 대상으로 하며 기존 DB/index 절차를 따른다.
