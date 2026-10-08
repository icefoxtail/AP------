# Archive 시험지 임시 작업 폴더와 production 승격 v1

STATUS: CURRENT — 2026-10-06. 시험지 중간물의 기존 generated 저장 정책을 대체한다.

## 저장 위치

- 신규 시험지의 임시 JS·SVG·crop·render·bundle은 저장소 루트 `.tmp/archive/<runId>/<examUid>/`에만 쓴다. `archive/` 및 `archive/exams/` 아래에 임시 시험지를 만들지 않는다.
- JS basename은 처음부터 `<examUid>.js`로 고정한다. 경로나 파일명에 `_generated`, `.generated`, `generated`를 붙여 시험지 상태를 표현하지 않는다. 같은 시험지의 CREATE/R1/R2/R3는 같은 임시 파일을 갱신한다.
- 이미지·SVG도 처음부터 최종 명명 규칙을 사용한다. 시험지별 자산 디렉터리는 `<examUid>`, 문제 이미지는 `qNN.png` 또는 해당 원본 형식, 해설 SVG는 `qNN-solution.svg`로 문항과 용도를 구분한다. 기존 정본의 확정된 자산명은 보존한다. `temp`, `candidate`, stage명이나 버전 번호를 최종 파일명에 덧붙여 상태를 표현하지 않는다.
- 승격 대상 JS의 `image` / `solutionImage`는 처음부터 `assets/images/<examUid>/<asset-name>`의 최종 상대 참조를 사용한다. 임시 자산의 실제 위치와 이 참조의 대응은 작업 manifest와 preview 환경에서 해결한다. 임시 경로를 넣었다가 승격 시 문자열 치환하는 방식을 기본으로 사용하지 않는다. 별도 ALIVE review-only shadow는 설치용 정본과 구분한다.
- 공개되는 최종 JS는 기존 `archive/exams/original/<school-level>/<grade>/<term>/<examUid>.js` 정본 하나다. 유사문항 등 기존 production 종류의 정본 경로도 유지한다.
- 임시 폴더는 Git 및 DB/index/시험지 목록에 등록하지 않는다. stage evidence는 필요시 기존 `archive/analysis/` 등 영구 기록 위치에 남기되, 임시 JS를 production 완료로 기록하지 않는다.
- 이미 있는 production 시험지의 bounded 수정은 지정된 정본을 사용한다. 새 후보가 필요하면 위 임시 폴더에 격리한다.

## 인계와 승격

ROOT/worker 인계는 `examUid`, 고정 `workingPath`, `productionPath`, 실제 artifact SHA, evidence와 changed/open qid로 한다. 중간 경로를 stage별로 복사·개명하지 않는다. 변경 후에는 기존 SHA 계약대로 영향 qid와 direct dependency evidence를 재결속한다.

기존 품질·독립검수·render gate를 통과한 뒤 승인된 publish 단계에서만 production으로 승격한다. 실제 사용 자산을 `archive/assets/images/<examUid>/`에 반영하고 final JS의 상대 참조를 production 기준으로 확인한다. asset reference 변경이 bytes를 바꾸면 변경 범위 검수 및 SHA rebind가 필요하며, 복사 전 PASS SHA를 최종 production SHA로 가장하지 않는다.

정상 승격은 확정된 JS·이미지·SVG의 이름과 JS 참조를 유지한 채 저장 위치만 바꾸는 작업이다. 이름이나 참조 변경이 필요한 경우는 정상 승격과 분리된 수정으로 기록한다.

MAIN_DONE receipt는 working path/SHA와 production path/SHA의 대응, 자산 참조 확인, 최종 evidence 결속을 기록한다. 최종 production 및 receipt가 닫히기 전 임시 파일을 삭제하지 않는다. 성공 후 cleanup은 참조·보존 의무가 확인된 임시 파일만 대상으로 한다.

Git은 필요한 production·자산·evidence·receipt만 exact path로 stage한다. publish 직전 `node tools/archive/check-exam-workspace-policy.mjs --staged`가 PASS해야 한다. CI는 base 대비 변경된 금지 경로를 거부한다. 기존 역사 파일은 허용된 신규 작업 위치가 아니며 삭제 변경만 이 gate에서 허용한다.

## 과거 자료 경계

`archive/_generated/` 및 `archive/exams/_generated/`는 과거 입력/evidence 조회만을 위한 폐기 경로다. 새 파일 생성·갱신·stage·publication을 금지한다. 기존 artifact와 SHA/receipt를 일괄 이동하거나 새 경로로 소급 변경하지 않는다. 미완료 과거 작업을 재개할 때는 기존 artifact를 보존하고 임시 폴더로 1회 복사한 뒤 원 path/SHA와 새 working path/SHA를 migration receipt에 연결한다. 기존 PASS는 실제 bytes와 identity가 유지되는 범위에서만 사용한다.

generated 전용 옛 정책·설계는 `docs/rules/90_ARCHIVE/generated-workspace/`에 보관한다. 다른 정본의 과거 generated ledger 링크는 역사적 근거이며 새 출력 경로 지시가 아니다. `generated_pending` 등 기존 schema enum이나 자동 생성 DB/index의 이름을 이번 경로 정책으로 임의 변경하지 않는다. ALIVE의 Archive 시험지 review shadow/임시 입력도 `.tmp/archive/`를 사용한다. ALIVE runtime protocol·상태 enum 및 교재 파이프라인의 별도 계약은 변경하지 않는다.
