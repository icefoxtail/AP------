# 중1 정비례·반비례 binding 과정명 정정

## 범위

기존 ACTIVE `PT_M1_PROPORTION_PARAMETER_EVALUATION`의 2022 · M1-04 · GRAPH_RELATION binding 한 행에서 `中1 수학`을 `중1 수학`으로 정정한다. 기존 지원 UID는 2025 동산중 2학기 기말 Q21 한 문항이며, 원본·metadata·identity의 과정명은 이미 정상이다. 동일 tuple의 정상 과정명 행을 중복 추가하지 않는다.

왕운중 2026 중1 2학기 중간 Q6·Q8은 이 기존 유형을 재사용하므로, 왕운중 시험지 등록 전에 별도의 공식 과정명 정정을 마친다. 실제 메타 정본은 single writer가 변경하며 이 PR에는 작은 요청과 검증 기록만 포함한다.

## 확인

깨끗한 main `e2aa30e7c95aac4fc1a6a0748d13f078382b6f40`에서 공식 builder로 입력 해시를 생성했다. 공식 dry-run과 격리 write, build, projection, changed-UID Consumer 검증을 수행했다. 대상 UID 1/1과 전체 MIDDLE1 runtime 613개의 의미·승인·선택 상태를 보존했고, 보호 파일104개의 SHA와 전체 runtime.records가 유지됐다. 원본 시험지와 기존 승인 근거는 수정하지 않았다. 정확한 요청·영수증·검증 결과의 해시는 같은 폴더의 `02-binding-course-correction-preflight.json`에 기록했다.

이는 메타 분류 재승인이나 수학 검수가 아니다. 실제 main writer의 등록 영수증과 최종 Consumer 보존 검증, 원격 SHA를 확인한 후에만 왕운중 요청을 생성한다. 기존 R1·R2·R3는 다시 실행하지 않았다.
