# Codex SVG 1차 검수 호출 — Luna Xtreme High 반복 라인

목표는 검수 요청을 받은 시험지를 빠르게 1차 검수·수리하고 Claude 최종 검수로 넘기는 것이다. 게시·main 병합·화면/DOM qualification은 Claude가 맡는다. OpenCode를 호출하지 않는다.

## 반복 실행

1. `codex/svg-triage-20261107` 최신 HEAD와 `triage-20261107/QUEUE.md`를 읽는다. `READY_FOR_REVIEW`인 시험지 한 줄만 선택해 그 줄을 `REVIEWING <시험지키>`로 바꿔 push한다. 줄이 없으면 10분 뒤 최신 HEAD/QUEUE를 다시 읽는다. 대기 중 사용자에게 반복 보고하지 않는다.
2. QUEUE 줄에 적힌 브랜치와 SHA를 체크아웃한다. 구현자와 같은 시험지 브랜치에서 이어 작업한다. qNN 전용 branch를 새로 만들지 않는다.
3. 각 문항에서 실제 원문·정답·해설·기존 그림을 확인한 뒤 공식 SVG를 PNG로 만들어 직접 본다. 수학 식·교점·점근선·끝점/포함 여부·영역·라벨 소유, 그림·alt의 정답/보기 노출, 예시 caption, 320px 휴대폰 가독성을 확인한다. 함수·유리함수·무리함수는 학생 이해에 도움이 되면 그림을 유지·추가한다.
4. 문제를 발견하면 plan/publish를 고치고 공식 renderer로 다시 만든다. 횟수 상한은 없고 모든 attempt와 해시를 보존한다. 수동 SVG, 원본 JS·`archive/assets/` 수정, 검사 완화는 금지한다. 30분 넘게 막히면 해당 문항을 OPEN으로 기록하고 다음 문항으로 간다. DOM·qualification·publication·main 병합은 실행하지 않는다.
5. 시험지 전체 질문에 상태가 붙으면 OPEN이 남아도 같은 시험지 브랜치의 `triage-20261107/handoff/<시험지키>/`를 갱신해 push한다. 모든 기존/신규 문항을 HANDOFF.md 표에 포함한다. 공식 renderer 결과가 있으면 qNN에 `item.json`, `plan.json`, `{size,alt,caption}` 형식 `publish.json`, 공식 `figure-solution.svg`, ARCHIVE_BOUND `figure-result.json`, `review.md`를 둔다. publish.size는 figure-result.sizeClass와 같게 한다. 미렌더 OPEN/NOT_RUN 문항도 마지막 입력 3종과 review.md 사유를 둔다. PNG·로그·캡처는 Git에 넣지 않는다.
6. review.md는 5줄 이내: 기대 관계 / 확인 결과 / 직접 고친 것(없으면 없음) / 남은 문제(없으면 없음) / figure-solution.svg SHA-256. SVG가 없으면 SHA는 NOT_RUN로 쓰고 이유를 적는다. HANDOFF.md 표는 `| Q | 판정 | 상태(PASS/FIXED/OPEN) | 렌더 횟수 | 한 줄 사유 |`를 쓴다. FIXED는 Codex가 고쳐 통과시킨 것이며 Claude가 다시 본다.
7. 모든 문항 상태가 붙으면 push 후 원격 HEAD와 파일을 다시 읽는다. QUEUE의 해당 `REVIEWING <시험지키>` 줄을 `CLAUDE_HANDOFF <브랜치> <SHA>`로 바꿔 push한다. 다음으로 돌아간다. 사용자에게 정기 보고하지 않는다. 실제 작업이 30분 넘게 막히면 막힌 문항·이유만 보고한다.

## 금지

시험지 상태를 임의로 `READY_FOR_REVIEW`로 바꾸지 않는다. QUEUE가 `READY_FOR_REVIEW`로 넘기기 전 `.tmp` 후보를 선점하지 않는다. 다른 시험지 파일, 원본 JS, production asset, main은 수정하지 않는다. 별도 2차 검수나 OpenCode로 보내지 않는다.
