# ALIVE GPT QID9 — 원본 한 문항 × 9개 슬롯 작업 계약 CURRENT

2026-10-09 사용자 직접 지시. `alive/01_CANONICAL/ALIVE_MASTER_RULEBOOK_v9.1_STABLE.md`는 ALIVE MODE/proof/교육과정에 계속 상위. 이 문서는 **교육용 생산량과 세션 작업 단위**의 현재 사용자 override를 구현하며 무검수 출시를 허용하지 않는다.

## 단위·산출
1. 시험지 source 분모 고정 후 **source qid 하나**만 읽는다. 학생 원본(발문·보기·필요 이미지), 원본 풀이·curriculum·real RPM L3/L4를 이해한다. 한 세션에서 여러 source qid를 한꺼번에 생산하지 않는다.
2. A1~A3 반복 숙달(기본·수치·조건), B1~B3 사고 확장(판단 추가·역산·표현 전환), C1~C3 실전 평가(종합·변별·고난도)을 각각 목표로 설계한다. **아홉 칸을 전부 채우는 제작 시도를 의무화**한다. A 숫자변형은 의도적으로 허용하되 새 Blueprint라고 하지 않는다.
3. 슬롯마다 학생 발문, 5지 또는 원본 형식에 맞는 정식 답형, 정답, 한국어 상세 해설, 실제 오답 이유, 레벨/1~5 bucket, RPM 경로, 원본 UID/수식·에셋 요구를 명시한다. C3 최고난도 등급도 실제 풀이 기준으로 검수하여 조정한다. 서로 다른 9개 L4를 억지로 만들지 않는다.
4. 9개를 물리 draft로 만들되 어느 하나가 과도하게 억지스럽거나 수학이 틀리면 `QID_INCOMPLETE`로 반환한다. **9 PASS 강제 불가**. 다음 qid에 자동 이동하지 않고 해당 원본의 나머지 슬롯부터 이어서 완성한다.
5. 별도 GPT 독립 REVIEW: 먼저 학생용 문장/보기/그림만 읽어 9개 개별 계산·답 동결 → 저장된 답·해설과 대조 → 발문 의미·교육적 품질·Meta·필수 에셋 점검. CREATE의 자체 확인은 독립 승인 아님.
6. GPT가 확정한 승인분만 학생 Consumer source에 등록하고 실렌더·DB 인덱스·학생 조회·remote SHA gate를 완료한다. Codex는 지정 파일에 대한 Git main 운영병합·readback만 담당한다. 이전 main 후보에 있던 기존 UID와의 중복/유사도는 별도로 판단한다.

## 세션·정본·인계
- source QID별 branch 파일과 durable 9-slot ledger를 남긴다. `A1~C3 -> UID/path/SHA/created/reviewed/release/HOLD reason` + source file SHA + latest main + next exact step가 최소 인계 필드다.
- 한 source qid의 설계/생산이 끝나면 checkpoint·HANDOFF 문서로 새 채팅을 바로 시작할 수 있게 한다. 80% 토큰 사용률은 도구에서 제공하지 않으면 **측정 불가**, 감지한 척 숫자를 적지 않는다. 장문·복잡도 증가, 대화 단절 위험, qid 완료 시점에 선제 인계한다.
- 인계 문서에 붙여넣을 짧은 실행 프롬프트를 포함한다. 다음 창은 기존 Git branch와 main을 확인하고 **첫 미완료 단계**부터 처리한다. 성공한 단계 중복 재작업 금지.
- 기존 팔마고 27후보는 main candidate 아카이브 보존; 학생 등록은 4이고 23은 supply HOLD로 별도 유지. 이 계획은 기존 HOLD를 자동으로 푸는 면제권이 아니다.
