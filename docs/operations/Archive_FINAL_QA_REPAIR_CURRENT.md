# JS Archive — FINAL QA & REPAIR (전 학년·전 과목 CURRENT v2)

> **단일 실행 정본:** [Notion 전 학년·전 과목 Final QA & Repair Skill](https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98). 이 Git 문서는 최종확인 라인이 공통 프로토콜을 찾아 읽도록 돕는 **진입점**이며, Notion Skill의 내용을 중복 유지하지 않는다. 2026-10-21 사용자 지시.

## 언제 실행하나

이미 제작·검수된 **Git `main`의 특정 시험지 1건**을 사용자/최종확인 라인이 사후 학생용 품질점검·직접 보완하도록 지정한 경우. 초·중·고 이름을 하드코딩하지 않고 **중등·고등 모든 학년·과목**의 해당 시험지 원본과 교육과정/Meta 정본을 사용한다. 신규 CREATE/R1/R2/R3, 원본 인테이크, 포괄적 재검수 또는 CI/공통 시스템 수리에는 적용하지 않는다.

1. Notion [GPT 작업 전 라우터](https://app.notion.com/p/3e10e68bd69f81f19397e7cd1c8d3cfd) → [Archive 시작](https://app.notion.com/p/3e10e68bd69f81898cc8fb85cb4b1398) → [작업 생명주기](https://app.notion.com/p/3e10e68bd69f81fdb161ffc3f6227b6e) → **위 공통 CURRENT Skill 본문**을 읽고, 최신 Git `main`·시험지 JS/sidecar·실제 정본을 확인한다.
2. `{examUid}`의 **실제 학생 표시 QID N/N**을 해설 품질·메타 의미·수학 핵심·시각과 함께 전부 점검. 기존 적합한 R1/R2/R3 증거를 재사용하고 **전 문항 독립답 재동결은 반복하지 않는다**. 고난도·의심·불일치 QID만 정밀 재풀이.
3. QID별 `KEEP` / `FIX` / `EVIDENCE_DEBT` 기록. 문제가 확인된 해설·메타·도형·자산/발문만 **직접 최소 수리**. 정상 문항·원본·유효 SVG 보존, 다른 시험지·공통 시스템 변경 금지.
4. 변경 QID와 직접 의존만 표적 재검. 미실행 `NOT_RUN`을 PASS로 만들지 않는다.
5. 수정분만 시험지 단위 최소 커밋/PR/**Git main 실제 운영병합** 후 원격 main commit+blob SHA readback. **무수정이면 빈 커밋 없이** `NO_CHANGE/MAIN_ALREADY_PRESENT` 확인. 해당 시험지 Notion 행에 문항별 판정·변경 이력·미해결·실제 완료 체크 기록.
6. **시험지 1건을 중간보고 없이 가능한 끝까지 마감**하고, 수정 QID, 미해결, 최종 main SHA와 필요한 차단 근거만 간단히 보고. GitHub가 병합을 거절하면 우회하지 않고 그 시험지만 정확한 BLOCKED 상태로 기록한다.

**과목별 DB는 진도/증거를 기록하는 장소**이고 이 파일이나 과목별 예전 v1은 공통 Skill을 대체하지 않는다. 예: [고2 수학Ⅰ·대수 운영판](https://app.notion.com/p/4000e68bd69f81e49ce9f2bed952a779), [고2 확률과통계 운영판](https://app.notion.com/p/4000e68bd69f81e38529e2fdb678be98). 각 과목의 교육과정과 정본 키는 반드시 분리한다.

### 최종확인 라인 호출 템플릿

```text
임무: {examUid} 학생용 Final QA & Repair.
작업 전 Notion 전 학년·전 과목 FINAL QA & REPAIR CURRENT v2 Skill
https://app.notion.com/p/4000e68bd69f818080a3e7a042c4aa98
을 읽고 지시대로 시행한다. 최종 출력 QID N/N의 해설·메타·핵심 수학·시각을 전부 점검하고,
확정 결함만 직접 최소 수정, 변경 영향만 재검, Git main 운영병합(무수정 NO_CHANGE) 및
해당 시험지 Notion 체크 원격 확인까지 동일 실행에서 마감한다.
R1/R2/R3 재시작·다른 시험지/공통 시스템 수정 금지.
중간보고 없이 수정 QID·미해결·최종 main SHA만 보고한다.
```

**정본 권한 경계:** 이 사후 Final QA 규칙은 CREATE/R1/R2/R3의 검증기·품질 게이트·예약 권한을 변경하지 않는다. Git main 존재 ≠ 콘텐츠 품질 PASS ≠ Pages/학생 사이트 배포 성공. 최신 사용자 명시 지시가 우선한다.
