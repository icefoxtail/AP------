# 10개 시험지 입력 초안 브랜치 보존

상태: DRAFT_ONLY / NOT_READY. 저장 대상은 판정·item.json·plan.json·publish.json·STATUS.md 초안이다. 공식 SVG 완성, 검수 완료, 학생 게시 또는 구현자 인계를 뜻하지 않는다.

기준 브랜치: codex/svg-triage-20261107
기준 커밋: 0f7684bbed2aa58ccd588bc5d233c74032ab1e75

## 보존 범위

| 시험지 | 주입력 문항 | 입력·상태 파일 | 처리 |
| --- | ---: | ---: | --- |
| [23 매산여고](inputs/23-maesangirls-math2/root-inputs/) | 17 | 76 | 기존 원격과 로컬 blob SHA 전부 동일. 재작성 없음. Q19·Q21 보조안 포함. |
| [22 효천고](inputs/22-hyocheon-math2/root-inputs/) | 16 | 64 | 신규 추가. 확장 요약은 별도 파일로 보존. |
| [22 팔마고](inputs/22-palma-math2/root-inputs/) | 16 | 64 | 신규 추가. |
| [22 매산고](inputs/22-maesan-math2/root-inputs/) | 16 | 64 | 신규 추가. |
| [22 순천고](inputs/22-suncheon-math2/root-inputs/) | 16 | 64 | 신규 추가. 기존 manifest의 Q16·Q22 NOT_RUN 기록을 보존. 후속 재검 결과 결속은 별도. |
| [22 복성고](inputs/22-bokseong-math2/root-inputs/) | 18 | 72 | 신규 추가. Q14 TECHNICAL_HOLD, Q18 CONTENT_HOLD 유지. |
| [22 금당고](inputs/22-geumdang-math2/root-inputs/) | 16 | 64 | 신규 추가. |
| [21 매산여고](inputs/21-maesangirls-math2/root-inputs/) | 18 | 72 | 신규 추가. Q22 CONTENT_HOLD, Q23 TECHNICAL_HOLD 유지. |
| [21 순천여고](inputs/21-suncheongirls-math2/root-inputs/) | 16 | 68 | 신규 추가. Q19 주입력·조각다항식 대안 둘 다 TECHNICAL_HOLD 유지. |
| [20 매산여고](inputs/20-maesangirls-math2/root-inputs/) | 16 | 64 | 신규 추가. Q08 별도 CONTENT_HOLD 유지. |

합계: 주입력 165문항, 입력·상태 672파일. 이 중 23 매산여고 76파일은 이전에 저장되었고, 이번 추가는 나머지 9개 시험지 596파일이다. 보조안은 별도 문항으로 세지 않는다.

[효천고 확장 요약](inputs/22-hyocheon-math2/ROOT_DRAFT_SUMMARY.md) 1파일은 로컬 원본 바이트 그대로 별도 보존한다. 기존 [효천고 판정표](22-hyocheon-math2.md)는 덮어쓰지 않는다.

21 순천여고 Q19의 별도 대안 경로: [alternatives/piecewise](inputs/21-suncheongirls-math2/root-inputs/q19/alternatives/piecewise/).

## 보존 검사와 한계

- 전체 로컬 대상 673파일(입력·상태 672 + 효천고 확장 요약 1)의 크기·SHA-256·Git blob SHA-1은 해당 기존 package manifest와 일치했다.
- 기존 브랜치와 비교하여 23 매산여고 76파일은 동일함을 확인했고 재작성하지 않았다. 새 입력 596파일은 기존 경로가 없음을 확인했다.
- 기존 판정표·예약 문항·원문 JS·기존 SVG/PNG·엔진·ledger·대기열은 변경하지 않는다. 미완성 20 매산고 패키지는 범위 밖이다.
- 보존한 STATUS와 확장 요약의 LOCAL_ONLY·PENDING·원격 NOT_RUN 문구는 작성 당시의 기록이다. 이번 작업은 브랜치 보존만 추가하며, 원래 기록을 고쳐 과거 실행 상태를 바꾸지 않는다.
- 이 작업에서 공식 engine.prepare/build, SVG/PNG 렌더, 브라우저·시각 검수, 독립 전체 수학 검토, CI, 학생 게시, main 병합, 구현자 인계는 NOT_RUN이다.
- 입력 함수 PASS를 전체 수학·시각·출고 PASS로 확대하지 않는다. 기록된 제한·실패·보류는 그대로 유지한다.

## 후속 결과 구분

22 순천고 Q16·Q22는 이 패키지 작성 이후 별도 입력 재검을 통과했다는 후속 보고가 있다. 이번 저장은 원래 초안 바이트 보존이 목적이며, 후속 로그·입력 해시 결속을 수행하지 않았다. 기존 manifest/STATUS의 NOT_RUN은 과거 스냅샷 기록이며 최신 검사 결과를 부정하는 판정이 아니다. 후속 검증 기록은 별도로 연결해야 한다.
