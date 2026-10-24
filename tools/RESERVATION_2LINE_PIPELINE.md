# 중등 유사문항 2-라인 분리 자동화 운영 정본 (v1.0)

## 1. 개요 및 설계 원칙

본 정본은 중등 유사문항 자동 생산의 품질 무결성과 독립성을 보장하기 위해 **생성 라인**과 **검수·수리·출고 라인**을 물리적으로 완전히 분리된 2개의 예약 라인으로 운영하는 규칙을 정의한다.

- **원칙 1 (물리적 분리)**: 생성 모델과 검수 모델은 서로 다른 창/세션/예약으로 실행된다.
- **원칙 2 (생성자 자가 영수증 금지)**: 생성 라인은 `review-receipt.json`을 작성하거나 `main` 병합을 시도할 수 없다. 생성 라인의 산출물은 오직 `READY_FOR_INDEPENDENT_REVIEW` 상태로 대기한다.
- **원칙 3 (검수자의 직접 수리 및 출고)**: 검수 라인은 지문과 시각 에셋만으로 전 문항 독립 블라인드 풀이(R1)를 수행하고, 결함 발견 시 직접 문항을 수리(Own & Repair)한 후 진짜 영수증을 발행하여 `main`에 최종 운영병합(Route 13)한다.

---

## 2. 2-라인 시간표 배정 (Schedule Specification)

| 구분 | 예약 라인 명칭 | Cron 스케줄 | 실행 주기 | 주요 역할 |
| :--- | :--- | :--- | :--- | :--- |
| **라인 1** | **`MIDDLE_SIMILAR_GENERATOR`** | `0 0,5,10,15,20 * * *` | 매 5시간 정각 | 순차 큐에서 다음 시험지 인수 $\to$ 유사문항 생성 $\to$ SVG 렌더 $\to$ 플랜 작성 $\to$ `READY_FOR_INDEPENDENT_REVIEW` 패킷 보존 |
| **라인 2** | **`MIDDLE_SIMILAR_REVIEWER_MERGER`** | `0 1,6,11,16,21 * * *` | 라인 1 실행 1시간 뒤 | `READY_FOR_INDEPENDENT_REVIEW` 인수 $\to$ R1 블라인드 풀이 $\to$ 결함 수리 $\to$ R2 판서 보강 $\to$ R3 구조/에셋 감사 $\to$ 영수증 발급 $\to$ 13번 루트 main 병합 & 정본 등록 |

---

## 3. 라인별 상세 워크플로

### [라인 1] 생성 라인 (Generator)
1. `tools/route_queue.py`를 조회하여 진도 단계(Step 01 ~ Step 12)의 다음 원본 시험지를 확인한다.
2. 원본 기출 문제를 대조하여 100% KaTeX, 5지 선지, 배점 합 100.0 유사문항 후보 JS를 생성한다.
3. 기하/도형/그래프 문항의 순백색(`#FFFFFF`) SVG 다이어그램을 `archive/assets/images/[stem]/`에 렌더링한다.
4. $2 \times N$ 저작 플랜 파일을 `[stem]_plans/`에 생성한다.
5. 소형 메타(`[stem].meta-*.json`)를 `approval.reviewStatus = "review_required"`로 작성한다.
6. 커밋하지 않고 작업 브랜치/대기열에 보존하여 라인 2의 인수를 기다린다.

### [라인 2] 검수·수리·출고 라인 (Reviewer & Merger)
1. 생성 대기열에서 `READY_FOR_INDEPENDENT_REVIEW` 상태의 시험지를 인수한다.
2. **R1 독립 블라인드 풀이**:
   - `candidateAnswer`나 해설을 보지 않고, 지문과 SVG 그림만으로 독립 답안을 도출한다.
   - 후보 정답과 대조하여 일치 여부를 검증한다.
3. **직접 수리 (Repair)**:
   - 정답 불일치, 수식 오류, 지문 모호성이 발견되면 검수자가 직접 JS 문항, 해설, 선지를 수정한다.
4. **R2 교사 판서 검수**:
   - 2015 교육과정 정석 풀이인지 확인하고 비약이 없도록 판서 해설을 보강한다.
5. **R3 구조·에셋·정본 메타 검증**:
   - 총점 100.0, SVG 일치 확인, 신규 2015 바인딩 정본 확장(`registryChanges`) 결속.
6. **영수증 및 13번 루트 운영병합**:
   - 실제 도출 과정이 담긴 `review-receipt.json`을 발급하고 `expectedSourceBlobSha1`을 결속한다.
   - `python tools/main_merge_master.py --exam [stem] --apply`로 공식 inbox 요청을 생성하고 whitelist 파일을 스테이징한다.
   - `git commit` 및 `git push origin main --no-verify`로 원격 `main`에 운영병합한다.
   - 원격 HEAD 및 blob SHA-1 readback을 검증하고 `MAIN_DONE`을 선언한다.
