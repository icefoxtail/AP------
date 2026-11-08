# 20 매산고 고2 수학II 2학기 기말: 로컬 입력 준비 결과

상태: LOCAL_ONLY / DRAFT_ONLY / NOT_READY. OPEN 16문항의 item.json·plan.json·publish.json 및 STATUS.md 64파일을 로컬에 저장했다. 현재 48 JSON 모두 해당 성공 검사에서 읽은 바이트와 일치한다. 원격 쓰기·구현 인계는 하지 않았다.

## 시험지 전체 판정

| 문항 | 판정 및 현 범위 |
|---|---|
| Q01 | 기존 신엔진 FIGURE 및 입력 보호, 변경 없음 |
| Q02 | OPEN 입력 준비, 극대·극소 함수도 |
| Q03 | OPEN 입력 준비, 이차함수와 접선 |
| Q04 | OPEN 입력 준비, 시간 t≥0의 유한 부분도와 접선 |
| Q05 | 기존 EXEMPT 판정 보존 |
| Q06 | 기존 신엔진 FIGURE 및 입력 보호, 변경 없음 |
| Q07 | OPEN 입력 준비, 닫힌구간 [-1,4]의 정확한 다항 곡선 |
| Q08 | 기존 EXEMPT 판정 보존 |
| Q09 | OPEN 입력 준비, 두 극값 높이와 정확한 교점 |
| Q10 | OPEN 입력 준비, 포물선과 정확한 최적 직사각형; 원본 PNG 보호 |
| Q11 | OPEN 입력 준비, 영점 수직선과 캡션의 부호; 미지 도함수 모양을 만들지 않음; 원본 PNG 보호 |
| Q12 | OPEN 입력 준비, 매개변수 구간 [0,3/2] |
| Q13 | OPEN 입력 준비, 기호 a<c<b 관계도; 임의 함수 모양·유일성 단정 없음 |
| Q14 | OPEN 입력 준비, 이차함수와 정확한 값 |
| Q15 | OPEN 입력 준비, 기호 x+1<c_x<x+3 관계도; 거리 비율·유일성 단정 없음 |
| Q16 | OPEN 입력 준비, 원문의 세 조각과 비엄격 국소 극대 의미 유지 |
| Q17 | OPEN 입력 준비, 사차함수의 두 극대와 극소 |
| Q18 | OPEN 입력 준비, 두 가능한 삼차함수의 별도 두 패널 |
| Q19 | OPEN 입력 준비, 삼차곡선·극점·영점 부분도; y=a/2 수평선은 이 부분도에서 생략 |
| Q20 | OPEN 입력 준비, 실제 g의 꺾인 조각선; 보간 h 곡선은 그리지 않고 h′(4)와 구분 |

사용자가 함수 그림이 이해에 도움이 되면 계획하라고 한 이유와 지시선·가독성 계획은 각 입력에 남겼다. 입력 준비가 기존 OPEN 판정을 게시 완료로 바꾸지는 않는다. 현재 배타 소유는 UNKNOWN이다.

## 실제 수행 검사

- 첫 검사 2026-11-08T23-05-03-740Z: 14문항 입력 경로 통과. Q16은 PIECEWISE_POLY_FORMULA_INVALID, Q19는 INVALID_CUBIC_QUARTIC_DRAW_INTERVAL 발생. 그 결과와 수정 전 파일을 보존했다.
- Q16은 잘못된 선택적 formula 설명 문자열만 제거했다. Q19는 필수 초기 domain·viewport를 추가하고 생략 범위 문구를 명료화했다. 원래 수학과 sourceDomain, item/publish는 유지했다.
- 두 문항 한 차례 재검사 2026-11-08T23-13-07-665Z: 둘 다 통과. 현재 16문항의 해당 입력 검사 PASS.
- 수직선 4문항은 실제 expandNumberLineFigure 통과. 함수도 12문항은 Q18의 두 패널을 포함해 13개 spec의 실제 fit_overview/specFor, semantic_model.validate, critical 구성, viewport, 축 제목 및 눈금 guard 대조를 통과했다. 존재하는 COORDINATE_LABEL만 exact_coordinate로 검사했고 없는 경우 NOT_APPLICABLE이다.
- 모든 현재 48 JSON이 성공한 검사 입력 해시와 일치한다. 환경·harness 오류와 미사용 fail-closed 대체 함수 호출은 0이다. 엔진 소스나 검증 기준을 수정하지 않았다.

검사 세부: final-input-results.json 및 checker/recheck/reports/, checker/recheck-q16-q19/reports/. 소스·정답·해설의 바이트 결속 검사는 수행했지만 전체 독립 수학 검토와 원본 이미지의 독립 재검수는 NOT_RUN이다. engine.prepare/build/render, SVG/PNG 시각 확인, 전체 배치·가독성 검수, CI, 게시, 인계도 NOT_RUN이다. 입력 PASS를 READY나 실물 완료로 사용하지 않는다.

## 보존 및 기준

원문 기준 main bc47febaf592b4da9614b2695abc9e0851291f5b, source Git blob e33263a10b575c9713052ded3ae9b792dbdc3cb7. source-exact.js 38,634바이트를 보존했다. Q01/Q06 SVG·입력, Q10/Q11 PNG, PR #534 과거 승인 및 #1405 메타데이터 이력은 수정하지 않았다.

마지막 읽기에서 main ed06a82af57c37509e09b36e60b0aa59660fd313, triage codex/svg-triage-20261107의 HEAD 971092c7e6b4fe8a679e94a3f85045b9b46b9420을 확인했다. 이 원격 전진은 본 작업이 실행한 것이 아니다. 기준 이후 해당 시험지 원문·자산과 엔진 코드 변경은 없었으며, 현 시험지의 원격 입력 폴더는 기존 Q01/Q06 두 개와 동일한 tree SHA로 남아 있다. 원격 읽기 증거는 final-ref-readback.json, latest-main-compare.json, latest-protected-inputs.json에 있다.

이전 로컬 패키지의 674개 보호 기록은 재확인했으며 변경이 없다. 효천 ref 갱신 심사거절은 재시도하거나 우회하지 않았다. 추가 검사나 원격 보존을 이 결과가 승인하지 않는다.
