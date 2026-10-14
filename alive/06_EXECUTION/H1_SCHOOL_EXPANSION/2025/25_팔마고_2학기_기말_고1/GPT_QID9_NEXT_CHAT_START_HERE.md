# 2025 팔마고 고1 2학기 기말 — QID9 다음 채팅 시작 파일 (CURRENT)

## 첫 행동 — q06부터, 중복 제작 금지

1. Notion 「GPT 작업 전 필독 라우터」→「GPT 유사·변형 문항 생성 5단계」→「Archive 전체 작업 생명주기」의 CURRENT를 본문까지 읽고 최신 Git main·작업 브랜치를 다시 조회한다.
2. 작업 브랜치 `work/alive-25-palma-h1-2final-qid9`의 `GPT_QID9_PROGRESS_CURRENT.json`과 `GPT_QID9_QUALITY_HANDOFF_CURRENT.md` **최상단 CURRENT**를 먼저 읽는다. 다음 원본은 **q06**, 현재 누적 **q01~q05 45/207**. q01~q05 완료 기록을 고치거나 중복 제작하지 않는다.
3. 원본 q06의 실제 JS·필요 PNG/SVG를 읽고 교육과정(공통수학2)과 RPM Primary L3/실제 L4/등록된 PT·TPL·CrossConcept·Condition·Integration을 새로 판정한다. 이전 qid Meta를 복사하거나 qid 번호로 난이도를 정하지 않는다.
4. **원본 1문항에서 A1~C3 9개**: 학생용 자연스러운 발문→독립 수학 판단·해설·5지 실제 오답 오류 계산→학습 하중상/평가1~5 각각 근거→문제/해설 시각 필요성 별도 판정→필수 실 SVG 수치·좌표·라벨·Git SHA 대조→Reverse Stem Check·변경 영향 재확인.
5. **보기 배열/정답 분산**: 제작할 때부터 정답이 다양한 위치에 오도록 수치·질문을 설계하되 **숫자 보기는 오름차순, 사분면 조합은 자연스러운 순서**로 보존한다. ①~⑤를 맞추려고 후처리로 2,4,1,-5,100처럼 섞지 않는다. 마지막 207 전체의 최종 분포를 한 번 더 판단한다.
6. Git 변경은 해당 qid 신규 JSON/필요 SVG/UID별 메타 registry/누적 progress/receipt/quality handoff 및 이 파일의 next qid에 한정. 원본 기출·기존 유사·q01~q05는 변경하지 않는다. qid 1개=독립 커밋 1개, remote HEAD SHA/변경 파일 readback 확인.
7. 이번 수동 제작 트랙은 **독립 품질검사·실제 Chrome 브라우저 렌더·Consumer·운영 main 출시는 제외**(모두 `NOT_RUN`). 이들은 제작자의 수학·정적 SVG 자체확인을 대신하지 않으며 후보를 독립품질 PASS 또는 운영출시로 올리지 않는다.

## q05 실물 품질 참고 (복사형 제작 금지)

- `GPT_QID9_Q05_AUTHOR_BLUEPRINT.json`: A1~C3 함수 파라미터·평가목표·정답·오답 계산 경로, 수치 검산 근거
- `GPT_QID9_Q05_CREATE_DRAFT.json`: 학생용 발문·보기·교과과정 해설·난이도/메타 근거·문제/해설 SVG SHA
- `assets/q05/A1-problem.svg`~`C3-solution.svg`: 문제·해설 실제 함수 그래프 18개 (함수식/좌표와 실제 primitive 대조)
- `GPT_QID9_Q05_AUTHOR_RECEIPT.json`: 9 UID의 file/asset SHA와 수행된 검사·미수행 검사 분리
- 원본 q05 JS blob `0d12b75e824ab47f08fc3b5a6180be595f882c6e`; PNG blob `7cf6f0b4d35208e0dc97e8d2d19acb29220968ed`
- RPM Primary `H1-RPM-270`(무리함수 활용/식 결정)은 **RPM_ONLY**, `DIRECT_ACTIVE`라고 쓰면 안 된다. `PT_FUNCTION_RECOVERY` / `TPL_FUNCTION_FORM_FROM_GRAPH`는 별도 canonical ACTIVE 등록. 실제 풀이 근거로 선택하며 부재·불확실을 허위 NONE으로 채우지 않는다.
- q05 9/9 SOURCE UID exact 값은 `EVIDENCE_DEBT`. 실 브라우저와 독립검수는 `NOT_RUN`.

## 인계 단위

최신 `GPT_QID9_PROGRESS_CURRENT.json` + 새 qid JSON + `GPT_QID9_GENERATED_META_REGISTRY_v1.json` + 실 SVG + qid receipt + handoff + Git HEAD가 함께 진실이다. 과거 채팅의 PASS/숫자는 현재 상태를 대신하지 않는다.
