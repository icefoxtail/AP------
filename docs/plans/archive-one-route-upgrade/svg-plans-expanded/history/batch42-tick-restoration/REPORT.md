# 교과서 028-h 이후 눈금 소급 복원
- 현황48: h13,i3,j6,l4,m16,n6. r은 작성본에서 별도 복원 및14PASS 완료.
- 기준 저장ref ec7309299cafd2f93c7fb110d1b3d507c27ad106: 48개 모두 기존 저장본이다. 초기 git show 실패18개를 미저장으로 오분류했으나, 리드가 검증된 batch 보존본을 currentRemoteBlob와 대조하여 48개 모두 기존 저장본이며 눈금 외 변경0임을 확인했다. 최종 기준은 current-manifest.json 및 lead-independent-structural-check.json이다.
- 양 축 빈 배열44건은 필드를 제거해 엔진 자동눈금 복원. x축 핵심값이 이미 지정된4건은 그 x값을 보존하고 해당 최솟값·최댓값 y눈금을 추가.
- 실제 풀이 좌표·requiredPoints·overlays·끝점·sourceDomain·domain·표시창·caption 등은 모두 변경하지 않았음을 tick-only-diff에서 구조 동일성 검증.
- 기존 원본사본은 덮어쓰지 않았고 별도 patch directory만 작성. 오래된 builder를 다시 실행하면 빈 배열이 재등장할 수 있어 수합된 최신 계획을 기준으로 후속 수정해야 한다.
- 공식 최종 spec 48/48 PASS. 실제 렌더·모바일은 NOT_RUN, 공식 최종 spec만 검사. 환경 준비/렌더 실행 없음.
