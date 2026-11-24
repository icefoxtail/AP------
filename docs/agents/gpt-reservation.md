# GPT 예약 라인 프롬프트

> 2026-10-30 루트 `AGENTS.md`에서 옮긴 원문이다. 문구는 그대로 두고, 링크 경로만 이 폴더 기준으로 고쳤다. 본문 속 백틱 경로는 저장소 루트 기준이다.
> 이 영역 작업을 시작할 때 읽는다. 공통 규칙과 작업별 안내는 루트 [AGENTS.md](../../AGENTS.md)에 있다. 새 지시는 루트 `AGENTS.md`가 아니라 이 문서에 추가한다.

## CURRENT HARD — 모든 GPT 예약라인 프롬프트 개설·수정 공용 정본 (2026-10-17 / v1.0.0)

- 모든 신규·재설정 JS Archive GPT 예약(MASTER / CREATE / R1 / R2 / R3)은 **[예약라인 프롬프트 공용 CURRENT 정본](../../docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md)**과 같은 디렉터리의 정확한 역할 파일을 실제 본문으로 읽고 캠페인별 manifest·원본·Library·스케줄·ON/OFF 값을 바인딩하여 만든다. 현재 캠페인 HIGH_DYNAMIC만의 시간·원본 ID·학교명은 타 캠페인으로 복사하지 않는다.
- 공용 프롬프트의 새 역할·실제 문서 필독 영수증·qid별 정밀 Meta 실조회·Golden/Negative·원래 단계 책임 구분(OWNER_INCOMPLETE vs 진짜 EVIDENCE_DEBT)과 nonblocking ROUTED≠PASS 원칙을 유지한다. 기존 캠페인의 frozen roster·유효한 freeze/해설·품질계약·현재 사용자 명시 지시가 우선이다.
- [역할별 문서](../../docs/rules/02_PIPELINES/gpt-reservation/README_CURRENT.md#3-역할-파일-5개--복사수정은-여기서-시작)·[변경 이력](../../docs/rules/02_PIPELINES/gpt-reservation/CHANGELOG.md)을 함께 확인한다. 새로 발견한 빈틈을 고치면 해당 역할 파일/README/변경 이력을 좁게 수정하고 Git main·노션 예약 CURRENT 링크 및 **실제 예약 prompt 별도 readback**을 구분한다. 문서 갱신만으로 예약 실행/활성 상태가 바뀌거나 실제 검사 PASS가 됐다고 주장하지 않는다.
- 유사시험지 예약 라인: 중등은 `MIDDLE_SIMILAR_LINE1/2_CURRENT.md`, 고등은 [HIGH_SIMILAR_LINE1](../rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE1_GENERATOR_CURRENT.md)·[LINE2](../rules/02_PIPELINES/gpt-reservation/HIGH_SIMILAR_LINE2_REVIEWER_CURRENT.md)를 읽는다. 고등 큐는 `tools/route_queue_high.py`다.
- **GPT 채팅창에서 기출 유사2~N을 직접 제작하는 신규·이어받는 작업자**는 [유사시험지 난도 믹서 운영계약](gpt-similar-difficulty-mixer.md)을 실제로 읽고 원본의 난도 곡선·기존 세트의 사고 경험을 보존한다. 이유: 세트 번호에 따라 전 문항 난도를 올리거나 숫자만 바꾼 중복 세트를 만들지 않기 위해서다. 기존 활성 예약 프롬프트·작업 상태는 이 링크만으로 바뀌지 않는다.
- 유사시험지 예약 프롬프트에는 [유사문항 보기·정답 번호 정본](similar-choices.md)의 "다른 AI에 줄 지시문" 블록을 그대로 넣고, 목표 정답 번호 배열을 함께 준다. 이유: 모델이 고른 정답 번호는 되풀이 패턴이 되고, 정답을 끼워 넣은 보기는 정답을 드러낸다(2026-11-19).
