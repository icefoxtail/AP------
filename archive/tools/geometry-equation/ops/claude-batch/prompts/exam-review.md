[루나 검수자 — 2학기 기말 시험지 한 개 전체 해설 SVG 검수]
작업 트리 절대경로: <WORKTREE> (이하 상대경로는 모두 이 기준, 모든 셸 명령은 먼저 이 경로로 cd). 이 프롬프트가 저장소 AGENTS.md·HANDOFF_SVG_CODEX.md의 대기열·잠금·원장·ROOT 조율 절차보다 우선한다. QUEUE.md, 공유 원장, 시도 이력 재구성, 문항별 브랜치, DOM/qualification/publication 검사는 하지 않는다.
위임 금지(사용자 지시 2026-11-08, ~/.codex/AGENTS.md의 OpenCode·deepseek 위임 규칙보다 우선): OpenCode·deepseek·다른 모델·하위 에이전트에 작업이나 검수를 넘기지 않는다. deepseek은 그림을 볼 수 없다. 루나 자신이 PNG를 직접 열어 보고 판단·수정한다. 최종 마무리는 항상 Claude 쪽 Sonnet이 한다.
원문 읽기 확인: 판정 전에 node로 시험지 JS를 읽어(global.window={}; eval(파일); window.questionBank) Q01 content 앞부분을 REVIEW.md 첫 줄에 옮겨 적는다. CONTENT(원문과 구현 불일치)가 3건 이상 나오면 원문을 잘못 읽은 것으로 보고 다시 읽은 뒤 판정한다(2026-11-09: 23 팔마 수학II 검수자가 다른 문제를 읽고 전부 CONTENT로 판정).
파일 쓰기: REVIEW.md·TABLE.md·plan/publish JSON은 UTF-8로 쓴다(PowerShell Set-Content/Out-File 기본 인코딩 금지, node나 python으로 쓴다). 한글이 ?로 깨지면 다시 쓴다. 줄끝은 LF.

[작업 단위 = 시험지 하나 전체] (사용자 결정 2026-11-09)
구현자(<IMPL>)는 이 시험지의 **모든 문항**을 판정·처리했다(<IMPL>/TABLE.md 전 문항, <IMPL>/SUMMARY.md, FIGURE·REPLACE 문항은 <IMPL>/qNN/). 검수자도 **모든 문항**의 판정을 본다. 교육과정 기준은 실행 끝의 "과목" 줄.

기준: docs/agents/visual-svg.md 공통 프롬프트 블록 3번 판정 기준, .tmp/svg-m1/briefs/review1.md. 완료 기준은 "학생이 PC·휴대폰에서 보고 풀이를 이해할 수 있는가"이며 수치상 완벽주의는 하지 않는다.
렌더는 node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <outdir> 로만 한다(환경·잠금 처리 포함, render.lock을 직접 다루지 않는다). PNG: node .tmp/svg-m1/svg2png.cjs <svg> <png> 600. 비교 PNG: PYTHONIOENCODING=utf-8 python .tmp/work/compare.py <구형 파일> <신형 svg> <out.png>.

할 일:
A. 전 문항 판정의 타당성(<IMPL>/TABLE.md와 실행 끝의 "기존 해설 그림 분류표"를 대조):
   - 분류표가 OLD_SVG/OLD_PNG인 문항은 모두 REPLACE(또는 정당한 UNSUPPORTED/CONTENT)여야 한다. 구형이 그대로 남은 채 KEEP_EXISTING이면 오류다(구형 SVG는 예외 없이 신형으로 재작업).
   - 분류표가 NEW인 문항은 결함(정답·보기 번호 노출, 틀린 값, 빗금 분수, 영어, 라벨 문제, 교육과정 밖)이 있으면 REPLACE(FIX), 없으면 KEEP_EXISTING. 기존 신형 그림을 직접 열어 확인했는지 본다.
   - **빠뜨린 NEW 기회**: EXEMPT 문항의 원문·해설을 node로 직접 읽고, 함수·그래프·도형·통계 단원에서 해설 그림이 학생에게 조금이라도 도움이 되는데 EXEMPT로 둔 것이 없는지 본다. 있으면 직접 plan/publish를 만들어 렌더하고 FIGURE로 바꾼다(item.json은 구현 폴더의 다른 문항 것을 참고하되 questionUid·sourcePath가 그 문항 것이어야 한다).
   - **약한 EXEMPT 이유**: "원문에 그림이 있다", "간단하다"만으로는 약하다. 해설 그림이 원문 그림을 넘어서는 정보가 있으면 만든다. 진짜 순수 계산(순열·조합 계산, 복소수 사칙 등)만 EXEMPT로 남긴다. 이유가 약한 EXEMPT는 구체 이유로 고쳐 쓰거나 FIGURE로 바꾼다.
   - UNSUPPORTED/CONTENT는 근거를 의심한다. 시도한 방법·오류 코드가 구체적인지, CONTENT가 정말 원문 오류인지 원문으로 직접 확인한다. 가능하면 plan을 고쳐 다시 그려 본다.
B. FIGURE·REPLACE 문항(<IMPL>/qNN)을 각각:
   1) 시험지 JS의 원문·정답·해설과 대조한다. figure.png를 직접 보고(없으면 svg2png로 만든다) 확인: 수학 값이 맞는가, 해설이 쓰는 점·교점·점근선이 창 안에 보이는가, 라벨이 대상 곁에 있고 겹치지 않는가, 정답이 그림·alt에 없는가(그림 속 값이 곧 정답인 경우 포함), caption 끝에 정답이 있는가(예시 값이면 "예:"), publish.json size가 out/figure-result.json의 sizeClass와 같은가(다르면 sizeClass로 맞춘다).
   2) **UPGRADE(REPLACE) 문항은 compare.png로 구형의 핵심 관계가 신형에 모두 보존됐는지 확인한다.** 구현자가 SUMMARY.md에 적은 구형 핵심 관계 목록이 실제 구형 그림과 맞는지도 구형 파일을 열어 확인한다(빠뜨린 관계가 있으면 신형에 추가한다). 빠진 관계가 있으면 plan을 고쳐 다시 렌더한다. compare.png가 없거나 오래됐으면 새로 만든다.
   3) 문제가 있으면 고친 item/plan/publish로 --out <REV>/qNN/out 재렌더한다(ARCHIVE_BOUND까지, 횟수 제한 없음).
C. 결과 폴더:
   - <REV>/qNN/ — **최종 FIGURE·REPLACE 문항 전부**: 수정한 것은 고친 결과(item.json, plan.json, publish.json, figure.png, out/, UPGRADE면 compare.png), 문제없이 통과한 것은 <IMPL>/qNN을 **그대로 복사**(out/ 포함). 새로 FIGURE로 바꾼 문항도 여기 둔다. 판정이 KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT인 문항은 qNN 폴더를 만들지 않는다.
   - <REV>/TABLE.md — **최종 판정** 전 문항 한 줄씩, 구현 TABLE.md와 같은 형식(`| 문항 | 판정 | 이유 |`, 판정은 정확히 FIGURE·REPLACE·KEEP_EXISTING·EXEMPT·UNSUPPORTED·CONTENT, 파서 `^| Q?(\d+) | ([A-Z_]+)`). 판정을 바꾼 문항은 이유에 "검수에서 …로 변경: …"을 적는다. 행 수 = 시험지 문항 수.
   - <REV>/REVIEW.md — 첫 줄은 원문 읽기 확인(Q01 앞부분). 그 아래 문항별 한 줄: `qNN | PASS(무수정)/FIXED(무엇을)/JUDGMENT_CHANGED(무엇→무엇)/KEEP_EXISTING/EXEMPT_CONFIRMED/UNSUPPORTED/CONTENT | 메모`. UPGRADE 문항은 핵심 관계 보존 확인 결과(O/X)를 메모에 적는다. 구현자 대비 바뀐 점 요약을 맨 끝에.
금지: 손으로 SVG 작성·수정, 정답을 그림/alt에 넣기, 원본 JS·archive/assets·엔진 코드 수정, git commit/push/병합, 검사 완화.
최종 메시지는 REVIEW.md 경로 한 줄.

특히 확인(최종 검수에서 반복 지적된 것): 해설에 없는 보조선이 그래프처럼 보이지 않는가, 라벨이 대상 곁에 있는가(색 일치는 요구하지 않음), caption·alt가 그림에 없는 이름을 가리키지 않는가, 치환 변수가 문제 변수와 충돌하지 않는가. "PASS(무수정)"는 이 항목을 실제로 확인했을 때만 쓴다.
- y=x·기울기 ±1 직선·원이 있으면 가로·세로 눈금이 같은가(y=x가 45°로 보이는가). 다르면 equalUnits:true로 고쳐 재렌더한다.
- 반복 경로가 끊기지 않았는가, caption이 말하는 점의 값을 그림에서 읽을 수 있는가, 곡선 라벨이 실제 그 곡선 곁에 있는가.
- 라벨을 숨겨 통과시킨 문항은 지시선으로 살릴 수 있는지 먼저 시도한다.
- 그림이 해당 과목 교육과정 안의 대상인가, 해설이 실제로 쓰는 방법을 보여 주는가(교육과정 밖 치환·우회 그래프가 아닌가).
- alt·caption이 한국어 평문인가($ LaTeX·영어 없음) (수식·변수는 기호로 쓴다: x, y, f(x), √, ², −, ≤, π, 분수는 "4분의 97" 또는 기호. "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀어 쓰지 않는다. "영어 금지"는 영어 단어 문장을 뜻하며 변수 이름은 해당하지 않는다.), caption이 해설 복사가 아닌 짧은 요약이고 끝에 정답이 있는가. 그림 속 영어·빗금 분수가 없는가(세로 분수만).
- 좌표·값 라벨 글꼴이 다른 라벨(수식 글꼴)과 같은가(얇은 일반 글꼴이면 FAIL).
- 점근선 라벨이 y축 이름·눈금 숫자 곁이 아니라 자기 점선 곁에 있는가.
- 근호가 든 좌표·교점은 엔진 자동 표기(SELECT_POINT 결과)가 "−1+(−1√10)", "(0,(−1√10))"처럼 어색하게 나온다. 좌표를 아는 점은 SOURCE_POINT로 좌표를 식(add/sub+sqrt)으로 직접 주어 "−1−√10"으로 보이게 한다(20 매산여고 1학기 기말 Q18). 직선 식 라벨이 "y=x+(−√10)"이면 라벨을 끄고 caption에 기호로 쓴다.
- 구분 표현(사용자 지시 2026-11-10): 직선·곡선·원·영역이 여럿 있어 학생이 구분해야 하면 **색을 1순위로**(그림 안에서 직관적으로 구분하는 가장 효율적인 방법, 사용자 2026-11-10) 대상마다 다른 색을 주고, 필요하면 선 종류(실선·점선·굵기)·면 채움(음영)을 더해 확실히 구분하고 각각 라벨을 붙인다(예: 원래 도형과 이동한 도형, 두 원, 공통 영역과 나머지, 보조선과 본 그래프). 쓸 수 있는 옵션은 AUTHOR_GUIDE.md에서 찾는다. 옵션이 없어 구분이 약하면 ENGINE_GAPS에 "구분 표현 부족: 무엇"으로 적는다. 구형이 색으로 구분하던 것(예: 두 원 파랑·주황, 직선별 다른 색, 이동 전후)은 신형에서도 색 구분을 유지한다 — 색상 구분은 구형이 나은 부분이 있다(사용자 2026-11-10). UPGRADE 관계 목록에 "색 구분"도 넣고 compare.png로 확인한다.

[끝까지 진행 — 사용자 지시] 시간·분량·토큰 제한은 없다. 시험지의 모든 문항이 TABLE.md에 판정되고 그림 대상 문항의 렌더·PNG 확인이 끝날 때까지 멈추지 않는다. "전체를 끝내지 못했다"고 보고하고 중간에 끝내지 않는다. 문항 하나를 끝낼 때마다 그 문항의 산출물과 TABLE.md·SUMMARY.md 줄을 바로 써서 진행분을 남긴다.
