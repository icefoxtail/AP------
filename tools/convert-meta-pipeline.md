# META_PIPELINE 일괄 변환기

2026-11-05 변경: 현재 production 해설·난이도를 보존한다. 감사본과 production의 학생 필드 차이는 parity 보고서에 false로 정직하게 기록하고, L1/L2 누락도 request.supplements에 남겨 요청을 출력한다. 공식 등록기가 정본 투영을 거부하면 선승인·후보완 영수증으로 접수한다. 입력 감사본 자체의 SHA/UID 오류는 여전히 BLOCKED다. 아래의 이전 SHA/부모 누락 차단 설명보다 이 정책이 우선한다. 자세한 출고 상태는 docs/operations/META_PIPELINE_STUDENT_ACCESS_FIRST.md 참조.

`convert-meta-pipeline.mjs`는 로컬로 내려받은 Gemini 감사·매니페스트·분류 JSON과 원본 JS를 기존 v2 등록 요청으로 변환한다. Git/Drive/등록기 실행은 하지 않는다. 기본은 dry-run이며 `--write`는 별도 staging 폴더에만 출력한다.

```powershell
node tools/convert-meta-pipeline.mjs --batch C:/input/batch.json --out C:/output/meta-staging
node tools/convert-meta-pipeline.mjs --batch C:/input/batch.json --out C:/output/meta-staging --write
```

batch.json 예시(입력 파일은 절대 경로 사용):

```json
{"packages":[{"requestId":"meta-example-v1","sourceArchiveFile":"original/high/h1/2final/exam.js","driveSource":"C:/input/exam.js","audit":"C:/input/audit.json","manifest":"C:/input/manifest.json","classification":"C:/input/classification.json"}]}
```

지원: ALIVE_META_AUDIT_ATOMIC_v3의 rich/key-only/sourceDrive-flat 변형, META_AUDIT_ATOMIC_PACKAGE_v2, 그리고 `examId`/`sourceFileId` 계약을 사용하는 SOP_v1.2_AUDIT_ATOMIC. 원본 JS 문항 배열은 `window.questionBank`, `window.questions`, `window.examData.questions`를 지원한다. v1.2도 감사·매니페스트·분류 파일의 시험 식별자, Drive ID, source SHA, 전체 순번/문항 수를 각각 교차검증하고 기존 승인 proof 버전으로 연결한다. 해시·UID·문항 수가 어긋나면 변환하지 않는다.

검증: 감사·매니페스트·분류와 Drive 감사본 SHA, 시험지 이름/Drive ID, N문항·ordinal 중복, metadata/identity UID 일치. production과 감사본의 SHA 및 UID별 학생 필드 차이는 각각 기록한다. 원본 JSON은 바이트 그대로 보존한다. 해설 등 production 변경은 되돌리지 않고 후보완 요청으로 만든다.

부모 분류는 현재 metadata의 curriculum/course/L1/L2와 CANONICAL_MASTER의 유일한 정확 일치로 가져온다. 없으면 `PARENT_REFERENCE_REQUIRED` 후보완 항목을 붙여 요청을 계속 생성한다. `parentRefs`로 정확한 참조를 추가할 수 있다. 신규 정의는 `registryChanges`, 기존 개념 재사용 근거는 `existingConceptReviews`, 미검토 필드는 `unreviewedFields`로 전달할 수 있다. 키 이름만으로 의미를 만들지 않는다.

출력은 `CONVERTED`(변환 완료) 또는 `BLOCKED`이며, 변환 성공은 등록·학생 승인 성공을 뜻하지 않는다. 기존 등록기가 메타·정본·부모 참조 및 최종 승인 계약을 검증한다. 같은 ID로 다른 출력이 있으면 덮어쓰지 않는다. 대상 하나의 실패는 다른 패키지 변환을 막지 않는다.

`manifestType: META_AUDIT_ATOMIC_PACKAGE`인 실제 SOP v1.2 및 `ALIVE_META_AUDIT_ATOMIC_PACKAGE_v3` 입력은 감사·매니페스트·분류 원본을 보존하면서 파일 식별자·감사 SHA·승인 상태·전체 순번·UID·PT/TPL/CrossConcept 일치를 검사한다. 이 형식의 등록기용 메타 proof가 아직 준비되지 않은 경우 변환기는 메타 변경이 없는 access-only 요청을 내며, `metadataReviewed: false`와 `NOT_VERIFIED`를 기록한다. 공식 Action의 후보완 수납은 정본 메타 등록이나 검수 통과가 아니다. SHA·UID·감사/분류 불일치는 계속 차단한다.

감사 제목에 없는 `c` 접미사가 production 파일명에만 붙은 경우 `auditedExamAlias`를 명시할 수 있다. 세 입력의 감사 제목이 이 별칭과 정확히 같고, source SHA·UID·순번과 해설 이외의 학생 필드가 모두 일치할 때만 access-only 요청을 만든다. 해설 필드의 차이는 parity와 후보완에 남긴다.

원문이 `question` 필드를 쓰고 정답이 비어 있는 source-only 인계는 `sourceOnlyExamAlias`를 지정할 수 있다. 세 입력 제목과 SHA·UID·순번을 확인하고, 문항별 발문·보기는 필드명과 LaTeX 이스케이프·공백만 정규화해 비교하며 문제 그림은 정확히 같아야 한다. 감사본 정답은 전부 빈 값이어야 하고 현재 정답은 검증했다고 주장하지 않는다. 원본별 필드 차이와 metadata `NOT_VERIFIED`는 그대로 기록한다.

검증 명령: `node --test tests/convert-meta-pipeline.test.mjs`.
