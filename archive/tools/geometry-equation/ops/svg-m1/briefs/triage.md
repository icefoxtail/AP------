# 해설 그림 1차 판정 (읽기 전용)

AP Math 기출 시험지의 각 문항에 **해설용 SVG 그림**이 필요한지 판정한다. 그림은 결정적 관계(각·길이·평행·입체 구조·자료 분포·좌표 관계 등)를 학생에게 보여 줄 때만 만든다.

## 입력
- 문항 묶음: `{PACKET}` — 각 항목 `ord, content, choices, answer, solution, questionImage(PNG 절대경로 또는 null)`.
- 판정 기준: `/home/user/AP------/.tmp/svg-m1/guide/guide-core.md`의 **"2. 그림이 필요한가"**와 **"3. 어떤 plan을 쓰는가"** 절만 읽는다(나머지 절은 읽지 않는다).
- `questionImage`가 있는 문항은 그 PNG를 Read 도구로 직접 본다(문제 그림이 무엇을 보여 주는지 확인).

## 판정 값
- `FIGURE`: 해설 그림이 풀이 이해에 실제로 도움이 됨(문제 그림을 다시 그리며 풀이의 핵심 관계·보조선·값을 표시).
- `EXEMPT`: 그림이 불필요(순수 계산, 문제 그림만으로 충분하고 해설이 새 관계를 쓰지 않음, 용어 정의만 묻는 문항 등).
- `NO_SOURCE_FIGURE`: 문제가 "그림과 같이"라고 하는데 questionImage가 없음(엔진 일이 아님, 보고만).
- `UNSUPPORTED`: 그림이 필요하지만 가이드의 어떤 capability로도 표현할 수 없음(이유에 무엇이 부족한지 구체적으로).

## family 값
`PLANE`(축 없는 평면도형·작도·각/길이 표식·영역), `SOLID`(입체·전개도), `STAT`(도수분포·히스토그램·줄기와 잎 등), `COORD`(좌표평면 위 점·도형·정비례/반비례 그래프), `NUMBER_LINE`, `SET`, `OTHER`.

## 출력 (이 파일 하나만 쓴다)
`{OUT}`에 JSON 배열(문항 순서대로):
```json
[{"ord":1,"decision":"FIGURE","family":"PLANE","capability":"construction-spike-v1/PLANE_FIGURE_v1","reason":"한국어 60자 이내","figureIdea":"그림이 보여 줄 것 80자 이내"}]
```
EXEMPT도 reason을 쓴다. figureIdea는 FIGURE에만.

## 금지
- 위 출력 파일 외에는 어떤 파일도 만들거나 고치지 않는다. git·테스트·렌더 명령을 실행하지 않는다. 다른 에이전트를 부르지 않는다.
- 최종 답장은 5줄 이내: 판정 개수 요약(FIGURE n / EXEMPT n / 기타 n)만.
