# 중등 통합 메타 D — 승인 9문항 등록과 기존 승인 23문항 보존

기준 main: `0add2ea9c9059e506f81a9e572efeceba6758b5f`. 새 Native 9문항과 기존 승인 보존23문항, 총8요청·32 UID를 기존 근거로 출고합니다. 승인된 ADD_ONLY 정의5개를 운반합니다. E023 Q6의 난도 교정은 기존 독립 adjudication의 2→1을 정확히 반영합니다.

## 출고 범위

| 학기 | 새 등록 대상 | 기존 승인 보존 |
|---|---|---|
| 중2 2학기 | E059 신흥19 기말 Q7·Q12, E028 왕운23 중간 Q2 | 0 |
| 중3 2학기 | E001 삼산26 중간 Q8·Q19, E017 풍덕24 기말 Q23, E023 순천여23 기말 Q5·Q6, E035 풍덕22 기말 Q3 | E001 5문항, E017 18문항 |

6개 원본의 학생 payload143개를 보존합니다. 현재 원본 기준 4칸114 registered/29 pending은 묶음별 검증에서 전후 동일합니다. #2209가 갱신한 E028 그림19문항은 현재 판본을 유지합니다. 중3 1학기는 조사·수정·패킷 인수 대상에서 제외합니다.

## 최신 main 결합과 검증

D 자체60경로의 before blob을 위 main에서 직접 재조회해 모두 정확 일치를 확인했습니다. 현재 main의 #2236 및 #2237 공용 동작을 보존하고, source reassessment·공유 테스트·등록 계약 문서3개에 기존 D의 좁은 변경만 결합했습니다. 양방향 3-way 결과가 바이트 단위로 같고 main 대비 추가분은 기존 D delta와 정확히 일치합니다. 현재 코드 의존53개를 고정한 관련 회귀65 PASS/0 FAIL/0 SKIP입니다.

#2228은 main `76cc4c8789c92d4f2c5cb55c2fca1815251617c2`에 이미 병합됐습니다. 최신 main tree를 기초로 하므로 그 뒤의 RPM·Consumer 및 공용 변경을 이전 blob으로 되돌리지 않습니다. 기존 E052 Q2/Q25 보존 입력도 #2227에 병합돼 중복 #2223은 병합 없이 닫았습니다.

이전 D HEAD `279213455526972ed5a359da91fcbe6eb8c377b5`의 필수 CI3개는 성공했습니다. 새 통합 HEAD는 필수 CI를 다시 통과해야 합니다. E024 Q4의 부모 운반 실패와 C의 현재 crosswalk evidence drift는 별도 입력 문제로 조사하며 검증 경계를 완화하지 않습니다.

D32 선택행의 metadata/identity·before/source·정의 중복 여부는 실제 등록 snapshot과 현재 main의 대응 입력에서 확인했습니다. 이미 유효한 공식 dry/write/native receipt/Changed-UID Consumer/projection replay와 원본·4칸 보존 증거를 재사용합니다.

## 실제 운영 상태

확인된 실제 등록 snapshot은 `e9af62176fc10bce6c30f420d911664082ec059b`입니다. writer43779609672 성공과 대상별 영수증·metadata·identity·4칸 및 Consumer를 확인했습니다. 전체 보고서는 REGISTRATION_PARTIAL이고 semantic lane은 NEEDS_REGISTRATION입니다. 다음 writer43787650174는 기록 시점에 Persist 단계이며 새 실제 등록 SHA는 확인되지 않았습니다.

Pages43786397078은 exact e9af의 R2 470/470을 통과했으나 RPM ID 불일치로 build가 실패했고 deploy는 건너뛰었습니다. 해당 RPM 수리는 #2230/#2228에 병합됐지만 새 운영 배포 성공으로 간주하지 않습니다.

## 병합과 재개

1. 이 D의 정확 HEAD 필수 CI와 현재 main 대상경로·중복등록을 확인합니다. 증거 commit ancestry를 보존하는 merge commit으로 병합합니다.
2. 병합과 별도로 실제 registered SHA, 요청8개/대상32 UID의 영수증·metadata·identity·Consumer·4칸 보존을 확인합니다. Pages도 exact SHA와 공개 결과를 별도로 확인합니다.
3. C #2203의 최신 ec961 HEAD는 C19와 재시도 기반 코드만 활성화하며 부모6 요청/index는 비활성 상태입니다. C와 D의 고정 선후 조건은 없습니다. 실제 main 입력과 CI가 준비된 범위부터 처리합니다.
4. 부모6은 D와 다른 승인된 정의 입력의 실제 등록 후 최종 registry를 읽고 source·metadata·identity·master·PT/TPL·binding·선택6 before·미완료 상태를 엄격히 대조한 뒤 활성화합니다. 아직 main에 최초 발행되지 않은 후보의 reseal에 새 requestId를 강제하지 않습니다. 이미 발행된 요청과 완료 기록의 불변성은 유지합니다.
5. 다른 소유자의 #2203/#2214 브랜치를 덮어쓰지 않습니다. 중복 C19 #2232는 병합 없이 닫았으며 유효한 독립 패킷과 근거를 재사용 가능한 상태로 보존했습니다.

현재 결합 근거는 `integration-cas-0add2ea.json`입니다. 이전 proof는 각 당시 snapshot의 검증 기록입니다. 새 승인·정답·해설·그림 판정으로 확장하지 않습니다. 과거 polygon2와 E052 신규 CC 후보는 이 PR에 포함하지 않습니다.
