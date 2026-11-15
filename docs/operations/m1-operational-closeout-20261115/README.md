# 중1 4칸 운영 등록 입력 (2026-11-15)

난도·부모교정 핵심 PR #2113과 분리한 4칸 패킷이다. 이 문서는 아직 main writer 영수증 또는 Pages 완료를 주장하지 않는다.

중1 1학기의 기존 12시험지·286문항 검토를 재사용한다. 실제 풀이가 있는 4시험지93문항의 기존 저자4칸과 root표본12개를 재사용했고, 현 학생 필드와 인용을 대조했다. 연향19중간Q7은 원검토가 명시한 최소성/도출의 method 부채를 UID별 explicit hold로 유지한다. 팔마19중간Q16의 정확한 후보 방법은 독립 검토한 새사전 id750으로 연결했다. 92UID가 격리 공식등록기와 Consumer를 통과했고, source-only193문항은 method근거 부채로 제출하지 않았다.

중1 2학기는 기존759등록을 재사용한다. 왕운24기말Q14/Q21의 수리된 도해와 기존 슬롯만 직접 대조하여 source결속2개를 복구했다. 두 구/신 도해를 동일 그림으로 간주하지 않았고, 나머지22문항의 학생필드는 동일함을 확인했다. 761UID 전부 격리 Consumer에서 조회되었다.

사전v1.6은 v1.5의749개 정의·번호·동의어를 모두 보존하고, 중1후보1개와 중3 2학기후보6개를 독립검토근거에 따라750~756으로 추가한다. 중3 1학기 원본·브랜치·패킷은 다루지 않는다. 중2 2학기의 기존36명시보류를 운반하기 위한 strict native adapter는 네 원검토 바이트와 root결정의 UID/ordinal/fields를 검증한 뒤 pending으로만 처리한다. 일반 goal/method·전체시험지분모검사는 그대로이다.

`isolated-four-slot-registration-proof.json`은 실제격리 write→독립 check→replay의동일index SHA와 Consumer853/853, 명시보류1을기록한다. 전체1047대상UID와보류분류는 `expected-four-slot-uid-scope.json`에있다. 4칸등록은 새수학검수나 전체의미메타승인이 아니다. root는 PR CI·main병합 뒤 실제4slot영수증, 이UID범위Consumer, Pages의원격index를확인해야 한다.
