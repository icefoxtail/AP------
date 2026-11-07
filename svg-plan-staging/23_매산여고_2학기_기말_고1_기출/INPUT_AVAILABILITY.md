# 23 매산여고 고1 2학기 기말 — 작업 범위와 입력 접근 상태

## 대조 기준

- 원문: archive/exams/original/high/h1/2final/23_매산여고_2학기_기말_고1_기출.js
- 최신 main 기준: 5279940ce8f880fe6acfb8e227f2556781c6cbb9 (2026-11-07).
- 공통 계획 브랜치: svg/h1-2final-tasks, 대조 시점 원격 SHA a70134efb36ec7294928c952a5be736113deb4c5.
- 시험지별 작업 브랜치: codex/visual-svg-23-maesan-h1-2final.

## ROOT 계획·입력 보존

- ROOT_PLAN의 23문항 전체 계획은 최초 작업 전달 메시지에 온전하게 포함되어 ROOT_PLAN.md에 보존했다.
- root-inputs README는 신규 초안 18문항을 명시했다. Q6·Q9·Q16·Q22의 기존 입력/OPEN 이력은 재작성하지 않고 Q8은 과거 렌더 자산 확인 대기이므로, 대상 18문항은 Q1–5, Q7, Q10–15, Q17–21, Q23이다.
- 첫 작업 커밋에는 완전한 JSON이 그때 확인된 15세트만 포함되어 Q7·Q10·Q18이 빠졌다. 그 뒤 ROOT가 이 세 문항의 실제 전체 입력을 재전달해 이번 커밋에서 원문대로 보존한다. 앞서 추출된 Q7의 일부 메시지 조각 파일은 전체 입력과 중복되어 제거했다.
- Q7·Q10·Q18의 JSON 문법과 item sourcePath/ordinal을 정적으로 확인했다. 원문 수학 및 입력 형태 대조를 validation/followup-static-review.json에 기록했다. 공식 엔진 parser/validator와 렌더는 실행하지 않았다.
- Q7은 기존 5회 시도 상태를 보존하고 재렌더하지 않는다. Q7·Q18은 sourceConditions/newVisualInformation이 없어 현재 Phase 2 source coverage 단계에서 보완이 필요하다. Q18 multi-curve-figure-v1은 문서에 계약 설명이 있으나 phase2.mjs capability 허용 목록에서 확인되지 않아 공식 경로가 OPEN이다.

## 원문·기존 작업 보호

- 최신 main과 공통 계획 브랜치에 이 시험지의 ROOT_PLAN/root-inputs 파일이 없었음을 확인했다. 공통 계획 브랜치에는 다른 시험지 계획만 있었다.
- Q6·Q9·Q16·Q22의 기존 drafts/실패·OPEN 기록은 읽기·수정·재렌더하지 않았다. Q8은 PR #855 이력의 실제 산출물 위치 확인 대기로 유지한다.
- Q3·Q17 원본 문제 PNG 및 Q10 원본 등산로 PNG를 보존했다. Q10의 새 mapping은 원본 경로 배치를 대체하지 않는다.
- main의 기존 해설 SVG Q9·Q22를 수정하지 않았다. 기존 문제·해설·답·자산 및 다른 담당자 작업은 변경하지 않았다.
