# 중등 통합 메타 D — 승인 9문항 등록과 기존 승인 23문항 보존

기준 main: `828b0797450a56280208506b8808b62e2d341195`. 현재 입력은 새 native 9문항, 기존 native 보존23문항, 총8요청·32 UID입니다. 승인된 ADD_ONLY 정의5개를 운반하며 새 수학·그림·난도 판정은 없습니다. E023 Q6의 난도 교정은 기존 독립 adjudication의 2→1을 정확 반영합니다.

## 출고 범위

| 학기 | 새 등록 대상 | 기존 승인 보존 |
|---|---|---|
| 중2 2학기 | E059 신흥19 기말 Q7·Q12, E028 왕운23 중간 Q2 | 0 |
| 중3 2학기 | E001 삼산26 중간 Q8·Q19, E017 풍덕24 기말 Q23, E023 순천여23 기말 Q5·Q6, E035 풍덕22 기말 Q3 | E001 5문항, E017 18문항 |

6개 원본의 학생 payload143개를 보존합니다. 현재 원본 기준 4칸114 registered/29 pending은 묶음별 검증에서 전후 동일하며, #2209가 바꾼 E028의 그림19문항을 이전판으로 되돌리지 않습니다. 중3 1학기 조사·수정·패킷 인수는0입니다.

## 최신 main 통합

59개 D 대상경로의 before blob을 위 main에서 직접 재조회했고 전부 정확히 일치했습니다. #2226의 공용 helper·renderer continuity와 테스트 변경을 보존했습니다. 공유 테스트의 D 추가는 기존60행뿐이며 양방향 3-way 결과가 같습니다. 영향 회귀44 PASS/0 FAIL/0 SKIP입니다.

#2228 HEAD `a09d1a0c76e9da974cf69482953d69e3355bad66`의 정확7경로를 의존 변경으로 포함했습니다. 이 PR은 #2228의 main 병합 후에 병합합니다. 그때 #2228 변경7개는 이 PR의 유효 diff에서 빠지고 D 자체60경로가 남습니다. #2228 소유 브랜치는 수정하지 않습니다. RPM1개 ID 동기화의 독립 exact 증거와 D5 Consumer 경계 읽기 검토를 재사용합니다. PT/TPL·identity·source·unknown conflict guard는 계속 유지됩니다.

기존 E052 Q2/Q25의 현재 원본 보존 입력은 #2227로 이미 main에 병합되었습니다. 중복 #2223은 병합 없이 닫았고 그3파일을 이 PR에 추가하지 않았습니다. 과거 proof의 “#2223 통합” 설명은 당시 계획이며 이 문서와 `integration-cas-828b079.json`이 최신 상태입니다.

## 검증과 아직 남은 운영 단계

B/#2201의 실제 등록 snapshot은 `e9af62176fc10bce6c30f420d911664082ec059b`입니다. writer43779609672 성공과 대상별 영수증·metadata·identity·4칸 및 Consumer를 확인했습니다. 보고서 전체 상태는 REGISTRATION_PARTIAL이고 semantic lane은 NEEDS_REGISTRATION이며 완료로 바꾸지 않습니다.

D32 선택행의 metadata/identity·before/source·정의 중복 여부는 실제 snapshot과 최신 main에서 검증했습니다. 묶음별 공식 dry/write/native receipt/Changed-UID Consumer/projection replay를 재사용합니다. 이 통합 HEAD의 필수 CI는 새로 실행합니다. 과거 HEAD의 CI 성공을 대신 사용하지 않습니다.

Pages43786397078은 exact e9af의 R2 470/470을 통과했으나 RPM ID 불일치로 build가 실패했고 deploy는 건너뛰었습니다. 공개 배포는 완료가 아닙니다. #2228에 정확한 RPM 수리가 있습니다.

## 병합 순서와 재개

1. #2228 정확 HEAD의 필수 CI와 현재 원격 상태를 확인해 먼저 main에 병합합니다.
2. D 정확 HEAD의 필수 CI·현재 대상경로·중복등록을 확인하고 증거 commit ancestry를 보존하는 merge commit으로 병합합니다.
3. D의 실제 main registered SHA·영수증32·Consumer·4칸 및 exact SHA Pages/공개 바이트를 각각 확인합니다.
4. 실제 등록된 D registry에서 C 부모6의 source·metadata·identity·master·PT/TPL·binding·원 operation 미완료를 모두 다시 확인한 뒤 새 immutable strict-CAS 요청을 만듭니다. 기존 request bytes는 유지하고 활성 index 참조 하나만 교체합니다.
5. C6에 실제 증거 차단이 있으면 C의 중3 2학기 4칸19를 독립 출고합니다. 다른 소유자의 #2203/#2214 브랜치는 덮어쓰지 않습니다.

과거 `integration-cas-f6fdf1a.json`, current2209/current2219 proof는 해당 snapshot의 검증 기록입니다. 새 원본·승인·난도 판정을 위한 근거로 확장하지 않습니다. polygon2와 E052 신규 CC 소유 범위는 제외합니다.
