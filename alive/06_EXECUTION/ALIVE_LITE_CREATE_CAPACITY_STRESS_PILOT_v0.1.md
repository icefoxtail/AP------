# ALIVE LITE CREATE — 단일 세션 최대 생산량 실측 파일럿 v0.1

작성일: 2026-10-08
상태: CURRENT CAPACITY EXPERIMENT / 이 문서 자체가 실제 생산 성적표는 아님
대상: 2026 복성고 고1 1학기 기말 `archive/exams/original/high/h1/1final/26_복성고_1학기_기말_고1_기출.js`
원본 Git blob SHA(최초): `8266fa476906e9134b94f23e803bd3b2fb26ece4` — 최신 main에서 재확인.

## 목적
원본 1~3문항 입력의 작은 배치 제한을 제거하고, **한 CREATE 채팅 세션이 수학/메타/해설 품질을 지키면서 실제로 몇 개의 완전한 generated candidate를 작성·저장할 수 있는가**를 실측한다. 20분 등의 시간 목표나 고정 출력 10/20/100개 quota는 두지 않는다. 시험지 전체 원본을 seed inventory로 읽는다.

## 정확한 역할 분리
- **CREATE 채팅창**: 원본 inventory 23 qid 및 비주얼 참조 확인, 의미 Blueprint 탐색, 발문·5지/주관식 구조·정답·학생용 해설·L1/L2/L3/L4·난이도·학교 마커 동시 완성, 생성 candidate의 안전한 shard/metadata 저장, manifest/index + 생성 receipt 및 remote readback. 문항당 길이/계산량에 따라 생산 수 자유. 필요하면 내부적으로 저장 checkpoint를 만들되 **원본 qid 1~3개 처리 후 멈추지 않는다.**
- **REVIEW+MAIN 별도 채팅창**: 저장된 실제 생성 후보를 blind 독립 풀이·정답 유일성·해설·교육과정·메타 검수하고, 문제 있는 qid만 수정해 별도 증거를 남긴 뒤 승인된 결과를 main에 병합/원격 readback까지 책임진다.
- 별도 R2/R3/MASTER/시험지별 렌더 예약단계를 이 실험에서 추가하지 않는다.
- SVG는 생성/학생 참조 자산 구조 검사 후 별도 시각검수 후순위 배치. 그러나 **그래프에서 읽어야 하는 수학적 사실은 REVIEW가 독립검수**해야 한다. 필수 시각자산이 없으면 검수 PASS/학생 공급 불가.

## 실제 진행
1. 새 CREATE 채팅 1개를 배정해 **23개 원본 전체를 inventory**한다. 같은 1개 실행에서 가능한 모든 의미 있는 L4/Blueprint 분기를 탐색하며 생산한다.
2. 생성물은 기존 RPM canon / ALIVE Lite schema / 원본 SHA를 지키고 L2별 shard·metadata로 저장한다. 임의로 원본 내용·canonical RPM을 변경하지 않는다.
3. 한 번의 채팅이 이어지는 동안 next eligible qid를 계속 소화한다. 한 qid별 출력 수는 고정하지 않는다. 중복 숫자변형은 허용하되 새로운 Blueprint 수로 세지 않는다.
4. 작업이 실제로 끝날 때 또는 실행 한계에 도달하면 해당 시점의 **완성된 Git artifact/UID/receipt 기준으로만** 수량을 보고한다. 미완성 계획·draft는 총 생산에 포함하지 않는다.
5. 채팅 중 생성 원장에 실제 작업 단위의 checkpoint를 남길 수 있다. 이는 세션 분할이나 1~3 qid 종료 규칙이 아니다.
6. 다른 REVIEW 채팅은 frozen candidate를 실제 readback한 다음 독립 검수+main 반영한다. 마지막에 나온 **CREATE 완성 후보 수**와 **REVIEW 통과/실제 main 반영 수**를 별도로 보고한다.

## 실측 필수 수치
- original seed denominator, touched qids, generated complete UID count, candidate per source qid, distinct semanticBlueprintFingerprint count, numeric-only variant count, deduplicated count, SVG required/generated, full student solution count, Git candidate committed/pushed/readback count, reviewer PASS/FAIL, main published count.
- 소요시간은 실제 측정이 가능한 환경에서만 기록. 작업시간 추측·요금/리미트 추정 금지.
- 스키마·후처리·자산 문제로 멈춘 경우 원인/마지막 checkpoint를 기록하고 다음 채팅에서 continuation; 성공 수치로 위장 금지.

## 하드룰
- 기존 작은 배치 권장(원본 1~3 qid)은 **이 capacity 실험에서는 적용하지 않는다**.
- 문항 개수만 높이려고 의미 없는 복붙·교육과정 위반·오답·미완성 해설·거짓 Meta를 만들지 않는다.
- 기존 JS아카이브 원본 시험지 R1/R2/R3 운영·필수 actual render 계약은 그대로 유지. 이 규정은 ALIVE 생성 공급에만 적용.
- 이 문서의 생성만으로 테스트가 실행됐다고 주장하지 않는다.
