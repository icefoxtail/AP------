# 예약 작업 공통 프롬프트 — 시험지 1장 심층 해설 감사

**2026-11-21 사용자 최신 지시**: 한 번에 여러 시험지를 빨리 훑지 않는다. 우선순위 시험지 **한 장**을 1번부터 마지막까지 실제 읽고, **각 문항마다 읽은 근거와 KEEP/UPGRADE/HOLD 이유**를 기록한다. 개선 해설은 완성된 수식 중심 MD로 저장한다. 과목 변수만 달리하여 4개 매시간 독립 라인에 적용한다.

```text
icefoxtail/AP------의 고등 학생용 기존 해설 개선 예약라인. 담당은 <COURSE_LABEL>, course=<COURSE_KEY>. **한 예약에서 실질 작업할 시험지는 정확히 1장**이다. 이전 시험지의 문항별 감사/개선 MD가 미완료면 그 시험지를 먼저 이어받는다. 문항이 20~30개여도 첫 후보 하나만 고치고 다음 시험지로 넘어가지 마라. 여러 시험지/134문항 JSON 파싱·키워드 스캔은 '읽음'의 증거가 아니다.

소스 선택은 **기출 전체 → 유사 전체 → 유형 → 교과서 → 문제집**. 기출과 학기별 유사는 **2학기 기말 모든 연도 최신→과거 → 1학기 중간 모든 연도 최신→과거 → 1학기 기말 모든 연도 → 2학기 중간 모든 연도** 순. 한 시험 구분에 해당 과목 미처리 시험지가 0개면 같은 실행에서 즉시 다음 구분을 실제 검색한다. 대수/수학Ⅰ, 미적분Ⅰ/수학Ⅱ의 구명칭·고2/고3 폴더·standardCourse를 실제 확인한다. 빈 시험 구분은 종료·SAVE_BLOCKED 사유가 아니다. 중등 제외.

시작 시 main에 하네스가 있으면 main, 병합 전이면 work/solution-upgrade-reservation-harness-20261121 브랜치에서 docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md, docs-manifest.json, DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md, BOARD_SOLUTION_SAMPLES_CURRENT.md 및 manifest core/해당 AGENTS/학생용 solution 정본/Golden·Negative를 **실제 본문으로 읽고** 적용하라. 링크 존재만 확인하지 말고 읽기 영수증/미실행 상태를 사실대로 남겨라. 샘플 5개는 판서 스타일 참고일 뿐 수학적 답 권위가 아니다.

담당 작업 브랜치 work/solution-upgrade-<COURSE_KEY>의 docs/operations/solution-upgrade-reservations/staged/<COURSE_KEY>/에서 미완료 audit MD와 커서를 찾는다. 없다면 실제 원본 JS 1장, blob SHA, sourceIdentityKey(없으면 NOT_PRESENT), 총문항 수, 표기 교육과정을 고정해 <sourceKey>_DEEP_AUDIT.md를 작성한다.

**모든 문항 q1~qN에서 아래를 실제 작성하라.** (1) 원문 문제의 수치/식/정의역/조건 중 핵심 사실, 원본 answer, 기존 solution에서 결정적인 실제 수식·문장 1~3줄을 정확히 인용한다. (2) 기존 해설의 첫 식→핵심 변형→조건/경우→답이 학생에게 재현 가능한지, 독립 수학 확인과 '친절함'을 구분해 판단한다. (3) 판정 KEEP / UPGRADE / HOLD / UNREAD와 **왜 그런지 구체적 수학 근거**를 적는다. KEEP은 기존 풀이의 어떤 식이 충분하며 왜 논리 점프가 없는지 증명한다. `좋음`/`충분함`/`문제 없음`만 쓰면 무효. UPGRADE는 학생이 멈추는 원문 A→B 전환, 정확히 생략된 중간 등식·조건/교육과정 밖 풀이와 개선 이유를 적고 **완성된 학생용 solution 본문 전체**를 즉시 수식 전개로 작성한다. HOLD는 못 확인한 원본/그림/정답과 필요한 후속 작업을 명시한다. 읽지 못한 문항은 UNREAD로 남기고 완료라 하지 않는다.

친절한 해설은 한글 설명량이 아니라 **연속되는 계산식**이다. 왜 첫 식을 세웠는지 짧게, 결정적 괄호 전개→항 이동→인수분해/약분→정의역/나누는 수 0 여부·부호·경우→결론을 등호·부등호로 보여 줘라. 교육과정 밖 풀이를 쓰지 말고, 도움이 될 때만 2번째 풀이를 추가하라. SVG는 직접 만들지 않는다. 필요시 하네스 §5와 실제 SVG 엔진 문서를 읽고 SVG_REQUEST/plan 인계만 한다.

**시험지 완료 게이트:** 전체 qid에 문제/기존 해설 인용+판정 이유가 있어야 EXAM_AUDIT_COMPLETE. 모든 UPGRADE의 완성 학생용 solution을 독립 검산하고 MD에 커밋·readback해야 EXAM_DRAFT_COMPLETE. 둘 중 하나라도 안 되면 **IN_PROGRESS**, 남은 qid/후속 작업을 기록하고 다음 예약에서 동일 시험지부터 계속한다. 개수 맞추려고 좋은 풀이를 억지로 고치지 마라. 결함이 1개뿐이라면 다른 모든 문항을 왜 KEEP/HOLD했는지 근거가 있어야 한다.

각 단계의 실제 audit MD를 **자기 과목 Git 작업 브랜치에 커밋하고 readback**한다. SCAN_LEDGER.md에는 현재 1개 시험지/다음 qid 커서만 요약한다. 운영 JS, content, choices, answer, 원본 SVG, 승인 메타, main/운영 병합은 건드리지 않는다. MD 초안은 NOT_PRODUCTION / REVIEW_REQUIRED. Golden/Negative·독립 정답·SVG 시각/학생 화면 렌더 QA가 미실행이면 NOT_RUN으로 정확히 표시하고 후속 JS 출고 때 수행한다. 문서/그림 원본이 없으면 HOLD, MD 저장 자체가 불가능한 권한·도구 장애일 때만 SAVE_BLOCKED.

최종 보고는 **그 시험지 한 장의 총 문항 / 실제 읽은 문항 / KEEP·UPGRADE·HOLD·UNREAD 각각 / 완성 학생용 풀이 qid / 남은 qid / Git 커밋·MD 링크 / 다음 예약 재개 위치**. '읽은 흔적' 없는 전체 완료·허위 PASS·후보만 선정 후 완료 주장은 금지한다.
```

| 과목 | `<COURSE_KEY>` | `<COURSE_LABEL>` | Asia/Seoul 매시 |
| --- | --- | --- | --- |
| 고1 | `h1` | `고1 공통수학1·2` | 10분 |
| 대수 | `algebra` | `대수(수학Ⅰ 대응 포함)` | 20분 |
| 미적분Ⅰ | `calculus1` | `미적분Ⅰ(수학Ⅱ 대응 포함)` | 30분 |
| 확률과 통계 | `probstat` | `확률과 통계` | 40분 |

## 실행 확인

1. 작업이 시작할 때 템플릿과 필독 본문을 실제로 읽었는지.
2. 동일 시험지를 q1~qN 순서대로 감수하고, 각 문항의 실제 문제 조건+기존 해설 구절+수학적 유지/개선 이유가 저장됐는지.
3. 한 문항도 무근거 KEEP 처리하지 않았는지. 읽지 못한 문항을 UNREAD로 기록했는지.
4. 개선 대상은 학생이 따라 풀 수 있는 실제 수식 전개의 새 solution과 독립 검산이 있는지.
5. 원격 브랜치의 감사 MD/커밋/재개 커서가 실제 존재하는지. 시험지가 끝나지 않았다면 다른 시험지를 선택하지 않았는지.
