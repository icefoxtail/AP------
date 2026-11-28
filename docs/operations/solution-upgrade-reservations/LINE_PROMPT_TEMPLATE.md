# 예약 작업 공통 프롬프트 — 전역 과목 대기열의 4개 작업자

네 예약창은 **과목 전용이 아니다**. 아래 공통 지시의 `<LANE_ID>`와 `<WORKER_BRANCH>`만 다르고, 실제 담당 과목은 매 실행 전역 대기열에서 결정한다. 매시간 10·20·30·40분에 독립적으로 시작한다.

```text
icefoxtail/AP------ 고등 학생용 해설 심층 감사 예약. 너는 <LANE_ID>, 본인 MD 작업 브랜치는 <WORKER_BRANCH>다. 특정 과목 전용이 아니다.

**전역 과목 순서 절대 준수:** 고1 공통수학1·2(h1) 전체 → 대수/수학Ⅰ(algebra) 전체 → 확률과 통계(probstat) 전체 → 미적분Ⅰ/수학Ⅱ(calculus1) 전체 → 미적분Ⅱ/구 미적분(calculus2) 전체 → 기하(geometry) 전체. 각 과목은 기출 전체→유사 전체→유형→교과서→문제집, 기출/학기별 유사는 2학기 기말 모든 연도 최신→과거→1학기 중간 모든 연도→1학기 기말 모든 연도→2학기 중간 모든 연도 순이다. 현재 시험 구분에 파일이 없으면 다음 시험 구분을 실제 검색해 폴백한다. 모든 전년도 2학기 기말이 끝나기 전 1학기 중간으로 넘어가지 않는다. 앞 과목의 미완료·미점유 대상이 있으면 다음 과목으로 건너뛰지 않는다. 중등 제외. 과목은 실제 standardCourse/교육과정/단원/소스를 확인하고 h2/h3 폴더명만으로 판정하지 않는다.

**시작 필독:** 원격 main 또는 병합 전 work/solution-upgrade-reservation-harness-20261121 브랜치의 docs/operations/solution-upgrade-reservations/HARNESS_CURRENT.md, GLOBAL_QUEUE_CURRENT.md, DEEP_QUESTION_AUDIT_TEMPLATE_CURRENT.md, docs-manifest.json 및 모든 core 지침/학생용 판서 샘플·Golden/Negative를 실제 본문으로 읽는다. source와 원본 blob SHA를 고정한다. 링크/요약만 보고 읽었다고 주장하지 않는다.

**작업자 중복 방지:** 공유 점유 브랜치 work/solution-upgrade-global-queue-20261121 의 claims/ 경로를 실제 읽는다. <LANE_ID> 소유의 IN_PROGRESS가 있으면 다른 시험지를 잡지 말고 반드시 그 시험지와 <WORKER_BRANCH>의 기존 MD를 재개한다. 없으면 전역 순서에서 현재 단계의 가장 앞 **미점유** 시험지 하나를 고른다. claims/<courseKey>/<sourceBlobSha>.json을 공유 브랜치에 GitHub create_file로 **독점 생성 성공**하고 readback하여 owner/source가 일치한 뒤 작업한다. 이미 존재/409/422 충돌이면 절대 덮어쓰지 말고 목록을 다시 읽어 다음 미점유 시험지를 선택한다. 다른 lane의 IN_PROGRESS claim은 가져오지 않는다. 점유 기록을 만들 수 없으면 본문 작업을 임의로 시작하지 마라. 공유 claim의 상태는 소유 lane만 현재 SHA 조건으로 갱신한다.

**시험지 한 장을 완료할 때까지 계속 심층 감사하고, 완료되면 같은 실행에서 바로 다음 시험지를 맡는 루프를 반복한다. 예약 1회=1장 제한은 폐지한다.** 각 시험지마다 원본 q1~qN의 문제 조건·보기·answer·기존 solution의 핵심 원문 식을 직접 읽고 각 문항 KEEP/UPGRADE/HOLD/UNREAD와 구체적 이유를 <WORKER_BRANCH>의 docs/operations/solution-upgrade-reservations/staged/<courseKey>/<sourceKey>_DEEP_AUDIT.md에 기록한다. KEEP은 원래 어떤 실제 계산식이 충분한지 증명해야 한다. UPGRADE는 어떤 정확한 원문 A→B 변형이 빠졌는지, 학생이 왜 막히는지와 완성된 학생용 새 풀이를 **수식 중심, 중간 등호 생략 없이** 작성·독립 검산한다. HOLD는 이미지/정답/원본 불확실성을 구체화한다. 그림이 필요하면 기존 엔진 문서를 읽고 SVG_REQUEST만 인계한다. SVG/JS/main은 직접 변경하지 않는다.

**첫 시험지에서 q1~qN을 모두 읽고 필요한 해설 MD를 전부 완성·검산한 뒤에만 다음 시험지를 선택한다.** 중간에도 MD를 실제 커밋·원격 readback하고, 실제 시스템 실행 제한·장애로 못 끝내면 공유 claim을 IN_PROGRESS로 두고 sourceKey/nextQid/미완료 UPGRADE를 남긴다. 다음 실행에서는 같은 시험지를 이어받는다. 모든 qid에 실제 문제·기존 풀이 인용과 판정 이유가 있어야 EXAM_AUDIT_COMPLETE. 모든 UPGRADE 전체 풀이가 MD에 기록돼야 EXAM_DRAFT_COMPLETE. 두 조건 충족 시 공유 claim을 AUDIT_DRAFT_COMPLETE로 갱신·readback하고, **그 실행을 종료하지 않고 즉시 전역 순서의 다음 미점유 시험지를 독점 점유해 같은 감사→개선→저장→완료 과정을 반복**한다(그림 미확인·Golden/Negative/렌더 등은 VISUAL_HOLD/NOT_RUN으로 별도 남기며 출고 PASS 아님). 허위 읽기·후보 목록만 저장 후 완료·운영 JS 병합 금지.

**20~30초 경과·한 장 완료·후보 선정만으로 자발적 종료하지 않는다.** 실제 실행 제한/소스·권한 장애/해결 불가 HOLD/대기열 소진 또는 다른 lane의 IN_PROGRESS claim만 남은 경우에만 안전한 상태 저장·정확한 이유 보고 후 중단한다. 현재 단계에 미점유 시험지가 없고 다른 lane의 IN_PROGRESS claim만 있으면 WAIT_FOR_CLAIMS로 대기한다. 그 단계의 모든 시험지가 AUDIT_DRAFT_COMPLETE이어야 다음 구분·다음 과목으로 갈 수 있다. 없는 버킷은 EMPTY_BUCKET, 분류 불명은 CLASSIFICATION_HOLD, 실제 Git 저장 불가면 SAVE_BLOCKED를 근거와 함께 남긴다. 첫 시험지가 없는 것만으로 작업 종료하지 마라.

보고: 내 lane/이번 담당 과목/시험지 제목·sourcePath/총 문항 수/실제 읽은 수/KEEP·UPGRADE·HOLD·UNREAD/완성 개선 qid/남은 qid/본인 MD·커밋/공유 점유 파일/다음 예약 재개 위치. 출고/Golden/시각 PASS를 주장하지 마라.
```

| 예약 | `<LANE_ID>` | `<WORKER_BRANCH>` | 매시(서울) |
| --- | --- | --- | --- |
| ① | `lane10` | `work/solution-upgrade-lane-10-20261121` | 10분 |
| ② | `lane20` | `work/solution-upgrade-lane-20-20261121` | 20분 |
| ③ | `lane30` | `work/solution-upgrade-lane-30-20261121` | 30분 |
| ④ | `lane40` | `work/solution-upgrade-lane-40-20261121` | 40분 |

## 실행 확인

1. 네 예약이 똑같은 전역 과목 순서를 갖고, 각자 다른 lane ID/브랜치를 쓰는지 확인.
2. 공유 브랜치에서 선점 claim을 독점 생성하고 readback한 시험지에 대해서만 실제 MD 작업하는지 확인.
3. 원본을 직접 읽은 문항별 KEEP/UPGRADE/HOLD 이유가 남는지, 한 시험지 완료 전 다른 시험지를 시작하지 않는지 확인.
4. 선행 과목/시험 구분 미완료가 있을 때 후행 단계로 넘어가지 않는지, 진행중 claim을 다른 창이 덮어쓰지 않는지 확인.
5. 최종 JS/Git 운영 병합·SVG 자체 생성은 이 예약의 권한이 아니라는 점 유지.
