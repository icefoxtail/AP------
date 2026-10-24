# 중등 수학 12단계 순환 유사문항 생산 5시간 주기 예약 라인 정본 (CURRENT v1.0)

## 1. 운영 기본 원칙 및 환경 규격

- **주기 및 배정**: **5시간 주기(0 */5 * * *)**, **1회 실행당 정확히 2개 시험지** 순차 처리.
- **실행 환경**: **반드시 독립 창 / 격리 세션(Separate Window / Dedicated Context)**에서 실행되어 다른 일상 작업이나 메인 대화를 차단하지 않음.
- **진도 관리 권위**: [`tools/route_queue.py`](file:///c:/Users/USER/Desktop/AP------/tools/route_queue.py)의 순차 12단계 단일 컨베이어(중1-1중 -> 중1-1기 -> ... -> 중3-2기)를 엄격히 준수.
- **출고 권위**: [`tools/main_merge_master.py`](file:///c:/Users/USER/Desktop/AP------/tools/main_merge_master.py) (13번 운영병합 전담 MASTER).

---

## 2. 1회차 실행 시 시험지별 7단계 불변 파이프라인

각 시험지는 다음 7단계를 100% 만족한 후, **시험지별로 독립 즉시 커밋 및 `origin/main` 푸시(`MAIN_DONE`)**를 완료하고 다음 시험지로 넘어간다.

1. `python tools/route_queue.py`로 현재 다음 대상 시험지 확인.
2. 원본 문항 분석 & 1:1 대응 유사문항 생성:
   - 100% KaTeX 표준 `$ ... $` 선지 및 수식 래핑.
   - 객관식 20문항 기준 ①~⑤ 정답 슬롯 균등 분배.
   - 원본 배점 일치 및 총점 100.0점.
   - 작은 칠판형 판서 해설.
3. 순백색 `#FFFFFF` SVG 에셋 생성 및 48개 `plan.json` 작도 플랜 완비.
4. Gemini R1/R2/R3 독립 검수 수행 및 `[examUid].review-receipt.json` 발행.
5. 소형 메타 `[examUid].meta-q01-q24.json` 작성 및 `question_identity_map` / `question_metadata` UID 등록.
6. `python tools/main_merge_master.py --exam [examUid] --apply`로 공식 v2 요청서 생성 및 dry-run 검증.
7. `origin/main` 푸시 및 원격 blob readback 확인 (`MAIN_DONE`).
8. 1번 완료 즉시 2번 시험지로 진입하여 동일 반복.
