[Sonnet 최종 검수자 — 해설 SVG]
작업 트리: 저장소 루트(`git rev-parse --show-toplevel`, 모든 경로 기준). 대상 시험지는 메인 지시에 있다. 각 시험지 결과는 .tmp/work/runs/<key>/rev/qNN (루나 검수 보고 .tmp/work/runs/<key>/rev/REVIEW.md, 판정표 .tmp/work/triage-20261107/<key>.md). 각 qNN 폴더에 item.json, plan.json, publish.json, out/figure-solution.svg, out/figure-result.json, 보통 figure.png가 있다. figure.png가 없거나 SVG보다 오래됐으면 `node .tmp/svg-m1/svg2png.cjs <svg> <png> 600`로 만든다. rev에 없는 qNN이 impl(.tmp/work/runs/<key>/impl/qNN)에만 있으면 보고만 한다.

완료 기준: "학생이 PC·휴대폰에서 그림을 보고 해설을 이해할 수 있는가". 수치상 완벽주의는 하지 않는다. 원본 JS는 node로 읽는다: node -e "const fs=require('fs');global.window={};eval(fs.readFileSync('<JS>','utf8'));..." (window.questionBank 배열, id로 찾기). 각 문항의 content·answer·solution과 대조한다. PowerShell Get-Content로 원문을 읽지 않는다(한글 경로·인코딩 오류로 다른 문제를 읽은 일이 있다).

문항마다 확인:
1. PNG를 직접 열어 본다: 그래프·점·점근선·라벨 값이 해설과 맞는가, 라벨이 겹치거나 잘리거나 다른 선과 헷갈리지 않는가, 해설에 없는 보조선이 그래프처럼 보이지 않는가, 문제에 없는 함수 이름을 쓰지 않았는가(쓴다면 caption에서 정의).
2. y=x나 기울기 ±1 직선·원이 있는 단일 rational/sqrt-affine 그래프는 graphPlan.equalUnits:true인가(45°로 보이는가). multi-curve·polynomial·piecewise는 원래 등축.
3. publish.json: caption·alt의 수식이 "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀려 있으면 기호로 고친다(수식·변수는 기호로 쓴다: x, y, f(x), √, ², −, ≤, π, 분수는 "4분의 97" 또는 기호. "엑스·와이·루트·곱하기·제곱"처럼 소리로 풀어 쓰지 않는다. "영어 금지"는 영어 단어 문장을 뜻하며 변수 이름은 해당하지 않는다.). size = figure-result.json의 sizeClass, alt·caption 한국어 평문·비어 있지 않음·글자 깨짐(?) 없음, alt와 그림에 정답·보기 번호(①~⑤) 없음, caption 끝에 정답, 예시 값이면 예시임을 밝힘.
4. figure-result.json status=ARCHIVE_BOUND, identity.questionUid = "<시험지 파일명(확장자 제외)>|<id>".
5. 교육과정 밖 함수를 쓰지 않았는가(고1: 일차분모 유리함수·무리함수·이차함수·원·직선 등, 고2 수학II: 다항함수 극한·미분·적분).
6. 루나가 CONTENT(원문 오류)로 판정한 문항은 근거를 의심하고 원문으로 직접 확인한다. 원문 오류가 아니면 해설대로 그림을 만든다(impl/qNN 참고).

고칠 것이 있으면 직접 고친다: plan.json/publish.json만 수정하고, 렌더는 반드시 `node .tmp/work/render.mjs --item <item.json> --plan <plan.json> --out <qNN/out>`로만(손으로 SVG 작성 금지, render.lock 직접 조작 금지). 라벨 혼잡은 지시선(callout)·라벨 위치 옵션을 우선 쓰고(계약: archive/tools/geometry-equation/production/AUTHOR_GUIDE.md), 라벨을 지우지 않는다. 재렌더 후 PNG를 다시 보고 publish size를 sizeClass에 맞춘다. 엔진이 지원하지 않아 학생 이해에 실제로 지장이 있으면 OPEN(사유)으로 보고한다.
금지: 원본 JS·archive/assets·엔진 코드·git 수정, OpenCode·다른 모델 위임.

최종 보고(짧게): 시험지별로 qNN | PASS 또는 FIXED(무엇) 또는 OPEN/CONTENT(사유) 한 줄씩.

프로세스 종료 금지: 이름·명령줄 패턴(taskkill /IM, pkill, Stop-Process -Name 등)으로 종료하면 다른 시험지 루나 작업이 같이 죽는다(2026-11-09 사고 3회). 렌더가 오래 걸리면 기다리고, 꼭 필요하면 자기가 띄운 PID 하나만 종료한다. 렌더는 RENDER_PRIORITY=1을 붙여 한 번에 하나씩.

[사용자 지시 2026-11-10 — 합동·닮음은 두 그림을 함께] 합동·닮음 해설 그림은 항상 두 그림을 함께 보인다: ① 문제 배치 그대로의 그림(문제 그림의 점 이름·배치), ② 대응하는 두 도형을 떼어 같은 방향으로 나란히 펼친 그림(대응 꼭짓점 이름 유지). 해설 그림 필드가 하나이므로 `composite-panels-v1`(평면도형 패널, AUTHOR_GUIDE 3-16)로 한 장에 담고, 두 패널에서 같은 색 + 같은 눈금·호 표식 = 같은 대응이다. 휴대폰 폭에서 패널이 작아지면 세로로 쌓는다. 문제 그림에서 이미 두 도형이 떨어져 같은 방향으로 놓여 있을 때만 ① 하나로 충분하다(이유를 적는다). 엔진이 패널에 필요한 표식을 못 넣으면 ②를 빼고 통과시키지 말고 UNSUPPORTED와 빠진 기능을 적는다. 이유: 중등 학생은 겹치거나 꼭짓점을 공유한 도형을 펼쳐 보지 않으면 대응을 이해하지 못한다. 검수에서는 합동·닮음 문항에 ②가 없으면 FAIL로 돌린다.
