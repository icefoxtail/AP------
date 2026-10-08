# B06 → 독립 REVIEW / Codex Visual Render 인계

- 대상: **26_복성고_1학기_기말_고1_기출** source q18·q19, 원본 Git blob `8266fa476906e9134b94f23e803bd3b2fb26ece4`.
- 작업 브랜치: `pilot/alive-lite-bokseong-b06-design-first-20261008` (CREATE 전용, main 미병합).
- 실제 생성: **25 UID** — q18 10개, q19 15개. 객관식 23개(보기 5개), 서답형 2개.
- 별도 디자인: `B06_BATCH_DESIGN.json` 38개 탐색/25 채택; `B06_STEM_PATTERN_BANK.json` 발문·오개념 설계; 두 개의 원본 PNG 정확한 시각 증거 `B06_SOURCE_VISUAL_AUDIT.json`.
- shard·metadata: 
  - `archive/generated/lite/v1/2022/H1/H22-C-06-EQUATION_APPLICATION/shards/batch-BSG26-B06-q18.js`
  - `archive/generated/lite/v1/2022/H1/H22-C-06-EQUATION_APPLICATION/metadata/batch-BSG26-B06-q18.json`
  - `archive/generated/lite/v1/2022/H1/H22-C-08-COUNTING_PRINCIPLE/shards/batch-BSG26-B06-q19.js`
  - `archive/generated/lite/v1/2022/H1/H22-C-08-COUNTING_PRINCIPLE/metadata/batch-BSG26-B06-q19.json`
- 인덱스: `archive/data/generated-lite/bokseong-2026-1final-b06-create-index-v1.json` 및 누적 v6(191 active generated candidates, **학생 승인 수가 아님**).
- 수학 제작자 재계산: `B06_CREATOR_MATH_WITNESSES.json` 25/25 answer 일치. 검수자의 blind 정답 동결은 미수행.

## 주개념 및 경계

- q18 primary `H1-RPM-177` 방정식의 활용/도형·함수 결합, target L2 `H22-C-06-EQUATION_APPLICATION`. 중등 기하·겉넓이·부피는 보조개념.
- q19 primary `H1-RPM-187` 합·곱의 법칙/단계별 선택 (조건부 경우나누기 후보는 `H1-RPM-186`), target L2 `H22-C-08-COUNTING_PRINCIPLE`. semantic source scope `H22-C-07-CORE` (이전 같은 학년).
- EXT-L4 후보 14종은 registry에 exampleUid만 결속. 아직 승인되지 않았으며, RPM LOCKED canonical은 수정하지 않았음.
- q19 원본 그래프: 인접 `AB,AC,AD,BC,CD` / 비인접 `BD`. q19-S13은 `BD` 경계를 추가한 K4 그림, q19-S14는 `AC` 경계를 제거한 4-cycle 그림. SVG polygon boundary에 대한 정적 edge 검증은 PASS이나 **Archive 실제 렌더는 NOT_RUN**.

## 독립검수 최우선 고위험 위치

- q18-S05·S09·S10: 겉넓이 방정식의 복수 근 중 `s<h` 또는 `s√2<2a`를 실제로 만족하는 근 선택.
- q18-S06: **막힌 홈**의 바닥 면적은 원래 윗면 개구 공제와 상쇄, 관통구멍 공식 재사용 금지.
- q18-S07: 두 구멍이 공간적으로 겹치지 않아 증가량을 합산할 수 있는지 실제 SVG 도형 확인.
- q18-S08: 정사각형이 아닌 **원형 관통구멍**의 내부 곡면 `2πrh` 확인.
- q19-S06·S07·S08·S10·S12: 특정 빨강 금지/정확히 한 번/팔레트 교집합의 경우별 배타성, 6^4 배치 직접 완전열거로 비교.
- q19-S13·S14: 새 그림에서 실제 공유경계가 정확히 6개 또는 4개인지 확인. 도형이 다르면 정답이 달라짐.

## 다음 단계 및 금지선

1. 별도 REVIEW 채팅에서 저장 답/해설 노출 전 학생용 발문·5지·필수 source/새 SVG를 읽고 **25/25 독립 정답 동결**.
2. 독립 Meta/L3-L4·교육과정·해설 조판·5지 오개념 및 진정한 Blueprint 중복 검사. 정상 item 반복 재검 금지, finding만 핀포인트 수리.
3. Codex가 7개 새 SVG 실제 Archive 엔진 렌더·캡처와 blob SHA parity 확인 후 시각 release 판정.
4. APPROVED UID만 별도 Generated Consumer DB 등록·학생용 실제 조회/선택 확인 후 main publish/remote readback. 창작자는 여기에 PASS를 기입하지 않음.
5. q15 기존 taxonomy HOLD 및 q10·q11 과거 continuation은 B06 검수와 분리해 별도 추적.

**현재 B06: CREATE C/D DONE · independent REVIEW NOT_TESTED · actual render NOT_RUN · Generated Consumer 등록 0 · main publication 없음.**
