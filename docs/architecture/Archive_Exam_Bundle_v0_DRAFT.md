# 시험지 꾸러미 목록 v0 초안

범위: 읽기 전용 관찰 형식. 승인·등록 요청이나 완성 판정의 권위가 아니다. 운영 파일을 옮기거나 고치지 않는다. 제안 저장 위치는 `archive/data/exam-bundles/`이나 이번 도구는 저장소 밖에만 출력한다. Meta OS CURRENT 2~3장의 필드·상태를 그대로 쓰며, 새 관찰용 이름은 아래에 정의한다.

## 필드

| 필드 | 뜻 |
| --- | --- |
| `schemaVersion` | `archive-exam-bundle-v0` |
| `sourceArchiveFile`, `sourcePath` | exams 기준 경로, 저장소 기준 경로 |
| `sourceGitBlobSha`, `sourceSha256` | 실제 읽은 JS 바이트의 Git blob SHA-1·SHA-256 |
| `sourceCommit`, `gitBlobAvailable` | 현재 HEAD에서 경로와 blob이 일치할 때만 커밋, 로컬 객체 유무. dirty 파일도 바이트 해시는 남기되 커밋은 null |
| `questionCount`, `questions` | 실제 JS에서 읽은 분모와 순번순 문항 목록 |
| `inputs` | 정본 메타·UID map·4칸 index·compact의 경로/현재 해시/존재 상태 |
| `questionUid`, `sourceOrdinal`, `sourceQuestionNo` | 기존 UID만 재사용(없으면 null), 1부터 실제 순번, 원표기 번호. 출처 간 UID·순번·번호 충돌은 거부 |
| `sourceFingerprint`, `contentFingerprint` | 기존 source-delta의 지문 계산식. 원문을 싣지 않음 |
| `assets.files`, `assets.inline` | 참조별 실제 파일 해시·누락/외부 상태, 인라인 SVG/data image 해시. fragment는 파일 아님 |
| `metadata.inline/canonical/fourSlot` | 출처별 현재 값만 별도 보존. 핵심 메타/4칸 필드와 RPM 경로 구조 허용 목록, 임의 중첩 객체 거부. steps는 정수 또는 정수 배열 목록만 지원, 다른 구조는 명시 거부 |
| `metadata.sourceValuesDisagree`, `metaBinding` | 같은 필드가 양쪽에 실제 존재하며 값이 다를 때 필드명 목록, 정본 지문과의 exact/content/null 결속. 별칭이나 4칸↔CC 의미를 추정하지 않음 |
| `registration` | 정본 fieldStatus, index 등록·소스결속 상태, pending 사유 코드, compact의 현재 blob 일치 여부. index의 선언은 재검수 PASS가 아님 |
| `partial` | typeHold, missingFigure(외부/안전하지 않은 참조도 미확인), missing4slot(항목/칸 누락). 모두 false라도 완성이라는 뜻은 아님 |
| `overall`, `completion` | 공식 completion 도구의 판정만 허용. 현재 기준 main에 도구 없음: null/NOT_AVAILABLE. 작업 1 병합 뒤 연결 |
| `summary` | 출처별 값이 다른 문항 수, 부분 표시가 하나 이상인 문항 수 |

예시(설명용 축약, 생략된 필드는 실제 JSON에는 있음):
```json
{"schemaVersion":"archive-exam-bundle-v0","sourceArchiveFile":"original/example.js","questionCount":1,"questions":[{"questionUid":null,"sourceOrdinal":1,"sourceQuestionNo":1,"metadata":{"inline":{"difficultyBucket":2},"canonical":{"difficultyBucket":3},"fourSlot":{},"sourceValuesDisagree":["difficultyBucket"],"metaBinding":null},"partial":{"typeHold":false,"missingFigure":false,"missing4slot":true},"overall":null}]}
```

## 포함·제외와 기존 입력 대응

발문·보기·정답·해설 사본, 판정 원장 원문, 캡처, 승인 증거의 내용은 **포함하지 않는다**. JS/메타/그림/compact의 해시로만 결속한다. 로컬에서 실제 파일을 읽는다. sparse checkout 누락도 MISSING이므로 운영 누락을 판단하기 전 대상 경로를 checkout해야 한다. 외부 URL은 가져오지 않는다. 수학·그림 품질과 의미 메타를 새로 판정하지 않는다.

| 기존 형식 | 이 초안과의 대응 / 차이 |
| --- | --- |
| `archive-difficulty5-register-request-v1` | UID·순번·지문과 difficultyBucket/Confidence/BoundaryFlag/legacyLevelCompatibility의 현재 값. 승인·before/after·requestId를 생성하지 않음 |
| `archive-reviewed-exam-meta-register-request-v2` | sourceArchiveFile·UID·순번·지문과 단원/유형/RPM/관계 현재 값. registryChanges/승인·부모 증거를 대신하지 않음 |
| `archive-meta-4slot-compact-v1` | ordinal(표시번호)→sourceDisplayNumber, 실제 배열 위치→sourceOrdinal, format/given/goal/method/condition/steps를 fourSlot에 보존. compact의 sourceGitBlobSha와 실제 JS 비교, index 상태는 별도. 새 용어/의미 변환 없음 |

## 명령과 비교

`node archive/tools/bundle/build-bundle.mjs --exam original/example.js --out /tmp/example.bundle.json`

`node archive/tools/bundle/diff-bundle.mjs --before /tmp/before.json --after /tmp/after.json --out /tmp/diff.json`

출력은 새 파일만 생성한다(기존 출력 덮어쓰기 거부). 안전 경계는 symlink 실제 경로로도 확인한다. 비교는 같은 시험지만 허용하며, 각 manifest의 커밋:경로→blob과 바이트 해시·문항 지문을 다시 검증한 뒤 **git에서 읽은 두 문항**을 `source-delta.classify`에 전달한다. bodyFingerprint/assets/meta/registration 변화는 별도로 기록한다. dirty/없는 옛 객체/해시 없는 목록에서는 sourceDelta=null과 이유를 남긴다. 그림 파일만 바뀐 경우 JS 분류는 UNCHANGED일 수 있으나 assetsChanged는 true다. 목록은 관찰 자료이지 등록 권한/검수 증거가 아니다.
