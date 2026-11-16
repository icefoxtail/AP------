# 중등 통합 메타 D — 승인 9문항 등록과 기존 승인 23문항 보존

기준 main: `b645719341bc7deae6ed3b21a78f878109dc7789`. 최소 입력 수리 #2246의 정확 HEAD `387dba05a709c6b3e65e712ffd3e7932fcf148df`를 의존으로 유지합니다.

## 출고 범위

| 학기 | 새 Native 등록 대상 | 기존 승인 보존 |
|---|---|---|
| 중2 2학기 | E059 신흥19 기말 Q7·Q12, E028 왕운23 중간 Q2 | 0 |
| 중3 2학기 | E001 삼산26 중간 Q8·Q19, E017 풍덕24 기말 Q23, E023 순천여23 기말 Q5·Q6, E035 풍덕22 기말 Q3 | E001 5문항, E017 18문항 |

신규9·보존23, 총8요청·32 UID와 기존 승인 ADD_ONLY 정의5개입니다. E023 Q6의2→1은 정확 UID에 대한 기존 독립 adjudication을 운반합니다. 새 수학·난도 판정은 없습니다.

6개 원본의 학생 payload143개와 최신 그림을 보존합니다. 묶음별 현재4칸114 registered/29 pending은 전후 동일합니다. #2209의 E028 그림19문항을 이전판으로 되돌리지 않습니다. 중3 1학기와 오래된 polygon2·별도 E052 후속은 이 PR에서 제외합니다.

## 현재 main 결합

현재 main의 #2236/#2237 및 #2248 공용 동작을 보존합니다. #2248과 D62경로의 교집합은 source reassessment1파일뿐이고 원본·UID 교집합은 없습니다. 최신 main2756a9da에 기존 D의 정확한 rationale delta만 결합한 결과가806a7c6e입니다. 양방향3-way 바이트 일치, 기존 delta exact, 기존 테스트·문서 후보 c86956ef/b002ff20은 그대로입니다.

관련 회귀는 기존 rationale37 + current-definition28 + 새 typed prerequisite22 =87 PASS/0 FAIL/0 SKIP입니다. E024 및 D3의 실제 요청4 UID는 새 opt-in 선언이 없어 두 신규 진입점이 모두 null이며 원본/요청/외부 문맥을 바꾸지 않는 경계를 확인했습니다.

#2246은 역사적 부분 FINAL_QA 보존 영수증의 preview parity와 E024 Q4의 기존 승인 부모 운반만 수리합니다. 정확8경로, preview67 및 독립 검토, E024 공식 dry/write/replay·Consumer1·projection replay·독립 요청 검토가 통과했습니다. 이 의존의 E0241을 D9에 중복 합산하지 않습니다.

기존 공식 Native·Changed-UID Consumer·projection replay 및 원본/4칸 보존 증거를 재사용하고 새 통합 HEAD의 필수 CI를 확인합니다. 과거 HEAD의 CI를 대신 사용하지 않습니다. 상세 현재 근거는 `current-input-repair-dependency.json`이며 이전 proof는 당시 snapshot 기록입니다.

## 운영 마감 순서

1. #2246 정확 HEAD CI·현재8경로를 확인해 먼저 병합합니다.
2. 이 D 정확 HEAD CI·선택32 before/source/identity·정의 중복과 최신 경로를 확인하고 merge commit으로 병합합니다. 기존 immutable Native evidence ancestry를 보존합니다.
3. 실제 registered SHA에서 영수증8/대상32·metadata·identity·Consumer·4칸을 확인하고 exact SHA Pages/공개 결과를 별도로 확인합니다.
4. C의 부모6 요청/index는 현재 비활성입니다. D와 다른 승인 정의 입력의 실제 최종 registry 및 선택6 엄격CAS를 확인한 뒤 별도 활성화합니다. 이 stack의 선택된 병합 순서와 프로젝트의 의미 의존을 혼동하지 않습니다.

확인된 actual snapshot은 e9af62176fc10bce6c30f420d911664082ec059b(writer43779609672, REGISTRATION_PARTIAL)입니다. writer43787650174는 main 경쟁3회 뒤 저장 없이 종료됐으며 다음43793905345가 준비 중입니다. D·E024의 실제 등록이나 새 공개 배포를 아직 완료로 선언하지 않습니다. Pages43786397078은 R2 470/470 뒤 RPM build 실패·deploy skipped였으며 병합된 RPM 수리의 새 배포는 후속 확인 대상입니다.

원 #2203/#2214 브랜치를 덮어쓰지 않습니다. 기존 P2는 #2227과 활성 #2244의 실제 상태를 대조해 재사용하며 중복 #2223은 닫힌 상태입니다.

후속 #2249의24경로는 D/R/C 대상 및 D6개 source·compact와 교집합0입니다. 4칸114/29는 기존 공식 묶음 검증값이며 실제 운영 수치는 새 registered snapshot에서 확인합니다.
