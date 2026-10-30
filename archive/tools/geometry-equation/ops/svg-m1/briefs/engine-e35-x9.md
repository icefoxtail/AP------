# 엔진 확장 E35 (옛 X9): 수직선 컴퍼스 작도·값 없는 문자 점

먼저 `/home/user/AP------/.tmp/svg-m1/briefs/engine-common.md`를 읽고 따른다(시작 시 reset 대상 origin 끝은 E30·E34가 들어간 최신). 범위: number-line-figure-v1(필요하면 그 관측기·가이드·힌트). 평면·좌표·입체·통계 렌더 코드는 건드리지 않는다. 다른 계정의 옛 X9 브랜치(`claude/svg-ext-mid-small`)는 원격에 없다 — 처음부터 구현한다.

**계약:** 정답지 `archive/tools/geometry-equation/ops/golden/item29/plan.json`(21_금당중 1학기 중간 중3 q21)이 지금 실패하는 항목이다. 이 plan의 필드 모양(`numberLine.constructions[]: {id, center, radius:{value}, arc:{side}, hits:[{id, branch}]}`, POINTS 점의 surd 값 `-5+2*sqrt(5)`, `numberLineCaption`)을 그대로 받아 ARCHIVE_BOUND가 되게 하는 것이 1차 완료 기준이다(정답지 manifest note의 item29 설명 참고).

## 기능 (위에서부터; 하나 끝내고 커밋한 뒤 다음)
1. **수직선 컴퍼스 작도** `numberLine.constructions`: 그려진 점을 중심으로 정확한 반지름(정수·분수·sqrt 식, SymPy로 다시 계산)의 호를 수직선 위쪽에 그리고(arc.side LEFT/RIGHT/BOTH), 호가 수직선과 만나는 점(hits)이 그 점의 값과 정확히 같은지 검사, 끝점 surd 라벨(`-5+2√5`, `1+√5`). 관측기는 plan에서 중심·반지름·교점을 독립 계산해 SVG의 호 반지름·교점 위치를 대조(변조 테스트 포함). 선택: 반지름의 출처 선분을 수직선 위 모눈에 그리는 `source:{grid:true, from:[x,y], to:[x,y]}`(모눈 한 칸 1, 직각삼각형/정사각형 대각선 — 교과서 √2 작도), 이 선분 길이와 radius가 같은지 검사. 오류 코드 `NUMBER_LINE_CONSTRUCTION_*` 명시.
2. **값 없는 문자 점**: POINTS 점에 숫자 값 없이 문자 이름(`"a"`, `"-a"`, `"n"`, `"b"` — 소문자·부호 있는 수식 이름 그대로)을 쓰고 위치는 제약으로: `between:[p,q]`(두 점·눈금 사이), `mirrorOf:"a"`(0에 대해 대칭), `order`(왼쪽→오른쪽 순서), 표시 위치는 엔진이 제약을 만족하는 값으로 정하되 그 값은 그림에 쓰지 않는다. 관측기는 제약(순서·대칭·사이)을 SVG 좌표로 확인. 이름은 수식 글꼴(이탤릭 소문자), 대문자로 바꾸지 않는다.
3. 확인만: "전개도 면 라벨"(E28b `net.faceLabels`)과 "좌표 점 연결"(overlays/좌표 작도 선분)이 이미 되는지 보고 — 빠진 것이 있으면 보고에 적기만 한다.

## 실제 문항
- golden item29 → ARCHIVE_BOUND(manifest의 기존 항목, 새 기능 첫 렌더를 기준 SVG로 저장).
- `25_동산중_2학기_중간_중1_수학` q13(값 없는 문자 점 -a, a — 원장 OPEN_UNSUPPORTED). packet `/home/user/AP------/.tmp/svg-m1/packets/25_동산중_2학기_중간_중1_수학.json`(없으면 `node /home/user/AP------/.tmp/svg-m1/make-packet.mjs archive/exams/original/middle/m1/2mid/25_동산중_2학기_중간_중1_수학.js <out> --with-existing`로 만들어 runs/e35/ 안에).
- `25_왕운중_1학기_중간_중2_기출` q20: 게시본(runs/25_왕운중2a-plane1/q20)이 n 대신 대문자 N, 해와 n 구분 약함 — 소문자 n을 0과 1 사이 문자 점으로, -2·-1·0 채운 점(해), 1·2 빈 점(E30 point.style HOLLOW), 다섯 값 눈금 라벨, 범위식 0<n≤1은 쓰지 않는다.
결과는 `/home/user/AP------/.tmp/svg-m1/runs/e35/<시험>-q<N>/`. 정답 값을 쓰지 않는다.
