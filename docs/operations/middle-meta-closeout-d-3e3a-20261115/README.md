# 중등 통합 메타 D — 기존 승인 9문항 등록과 기존 승인 23건 보존

완료된 전수 검토와 정확한 독립 승인에 남은 정의·원본 결속·등록 입력을 운반합니다. 새로운 수학·그림·난도 판정은 만들지 않습니다.

## 출고 범위

| 묶음 | 정확한 대상 | 새 native 등록 | 기존 native 보존 |
| --- | --- | ---: | ---: |
| 중2 2학기 | 신흥19 기말 E059 Q7·Q12, 왕운23 중간 E028 Q2 | 3 | 0 |
| 중3 2학기 기존 잔여 | 삼산26 중간 E001 Q8·Q19, 풍덕24 기말 E017 Q23 | 3 | 23 |
| 중3 2학기 TPL support | 순천여23 기말 E023 Q5·Q6, 풍덕22 기말 E035 Q3 | 3 | 0 |
| 합계 | 요청 8개, 선택 UID 32개 | 9 | 23 |

- 현 main의 source 6파일, 학생용 143문항의 원문·선택지·정답·해설·그림을 보존합니다.
- 현 원본을 공식 4칸 빌더에 넣은 기준으로 등록114와 기존 pending29를 전후 그대로 보존합니다. 등록114는 중2 28 + 중3 기존37 + support49입니다. pending29는 #2209에서 그림이 바뀐 E028의19와 기존 중3의10입니다. 이 패킷이 새로 만드는 보류는0입니다.
- 원래 승인된 ADD_ONLY 정의5만 등록합니다: 중2 CC2/TPL1, 중3 COND1/TPL1. 원래 support UID와 승인 문서는 바꾸지 않습니다.
- E023 Q6의 난도2→1은 기존 독립 adjudication을 반영하는 교정1건입니다. 원 native가 Mother2를 before로 명시했고, 독립 판정의 정확 UID/raw SHA와 세 source 판본·asset 바이트가 일치합니다.

## 최신 main의 다른 작업을 보존

통합 기준 main은 `f6fdf1aaadb2345273eb314db0ab2cc80dab7e07`입니다.

#2209가 왕운23 중간의 다른19문항 그림을 바꾼 뒤에도 Q2의 전체 객체와 학생 payload는 기존 검토판본과 정확히 같았습니다. 최신 source의 모든 바이트를 보존하고 승인된 Q2 metadata suffix257bytes만 붙였습니다. expectedSourceBlobSha1도 그 정확한 새 source에 결속했습니다. 과거 M2 검증의47/47은 이전 원본에 대한 기록이며, 현재 검증은28 registered/19 pending입니다.

#2219의 두 공용 renderer helper를 유지합니다. 기존 D rationale 회귀와 최신 renderer 회귀를 3-way로 합친 test를 사용했고24 PASS·0 FAIL·0 SKIP을 확인했습니다. D의60행 추가 블록을 제거하면 최신 main test 바이트와 정확히 같습니다. 최신 helper에서 중2 선택3의 공식 replay/Consumer도 통과했습니다.

Polygon E011 Q17/E052 Q5는 이 출고에서 제외했습니다. #2219/#2220의 활성 담당자가 E052에 별도 `CC_QUADRILATERAL_ANGLE_SUM`(support1)을 확정·제출했고, 과거 후보는 `CC_POLYGON_INTERIOR_ANGLE_SUM`(support4)을 사용합니다. 키·정의·지원 집합이 동일하지 않아 의미 충돌이 없다고 새로 판단하지 않습니다. 다른 담당자의 source·registry·inbox·신규 승인을 덮거나 같은 UID를 중복 출고하지 않습니다.

Support3은 두 polygon CC가 모두 없는 D-only fixture에서도 공식 dry/write/native/Consumer/replay를 통과했습니다. 새 의존성은 D의 기존 승인 TPL 하나뿐이며 별도 registryChanges는0입니다.

## 검증 근거

초기6 HEAD `ccd5f67f16d1768f486c6a4c83a773dfb027f570`의 원격 CI3개는 모두 통과했습니다. 이번 통합 HEAD의 CI는 별도로 확인합니다.

- https://github.com/icefoxtail/AP------/actions/runs/43776575226
- https://github.com/icefoxtail/AP------/actions/runs/43776575153
- https://github.com/icefoxtail/AP------/actions/runs/43776575277

현재 입력에 대한 공식 registrar dry/write/replay, native receipt, Changed-UID Consumer와 4칸 보존을 묶음별로 검증했습니다. 범위 밖 metadata·identity·runtime과 기존 승인값은 보존합니다. 기존 D rationale 수리는 #2163의 소유3파일만 재사용하며, native after/item 우선순위와 정확한 네 값의 verbatim 일치 조건을 유지합니다.

주요 현재 증거:

- 이 디렉터리 `integration-cas-f6fdf1a.json`: 실제 main before/after Git blob 대조 및 통합 범위.
- `m2-current2209-official-proof.json`, `m2-current2209-renderer-holds19.json`.
- `rationale-current2219-integration.json`, `polygon-two-excluded-current-owner.json`.
- `docs/operations/middle-meta-closeout-3e3a-20261116/m3s2-residual3-local-gates.json`.
- 같은 디렉터리 `m3s2-tpl-support3-local-gates.json`, `m3s2-e023-q6-existing-authority.json`.
- `docs/operations/middle-meta-closeout-3e3a-20261116/m3s2-support3-d-only-dependency.json`.

이전6 패킷의 검증 자료도 그대로 남겼습니다. 최신 source에 대한 숫자와 판본 판단에는 위 current2209/D-only/current2219 증거를 우선합니다.

## 운영 순서

#2208 CLI 수리는 이미 main에 병합됐고 실제 writer의 semantic lane도 VERIFIED를 확인했습니다. 현재까지 writer가 main 동시 변경으로 저장 재시도를 소진한 사실과, 이 패킷의 로컬·CI 검증을 구분합니다.

1. B/#2201의 실제 main 등록·선택 Consumer를 확인합니다.
2. C 부모6을 실제 등록합니다. 다른 담당자의 정의 추가로 전역 registry SHA가 달라지면, 선택6의 source·metadata·identity·정본·binding과 기존 미완료 상태를 대조한 새 immutable strict-CAS 요청으로만 재결속합니다. 원 base/prior-source 핀과 검증 조건은 유지합니다.
3. C6 실제 등록 뒤 이 패킷의 source·정의·UID 중복을 다시 확인하고 병합합니다. 새 정의5가 C6보다 먼저 등록되지 않도록 합니다.
4. 실제 registered SHA/영수증, 선택32 Consumer, 현재4칸114/29, 정확 registered SHA의 Pages·공개 바이트를 각각 확인합니다.

로컬·PR CI만으로 실제 등록·배포 완료를 선언하지 않습니다. 중3 1학기 변경 경로는0입니다.
