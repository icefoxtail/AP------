# 2022 금당고 고1 2학기 기말

원문: archive/exams/original/high/h1/2final/22_금당고_2학기_기말_고1_기출.js
원문 Git blob: e078f4fc60ff33dd0dcee0464abc99c05277e120
기준: origin/main 5279940ce8f880fe6acfb8e227f2556781c6cbb9

완전한 입력 초안은 Q02–Q07, Q10–Q21(단, Q09 제외)이며 모두 NOT_RENDERED. Official parser, render, independent rendered-SVG review, and publication are NOT_RUN. No font or browser setup was attempted. Q01/Q08 have no qNN folder because their current main visuals already cover the proposed content; Q09 has no qNN folder because the source/domain conflict is unresolved.

Q01 | KEEP | 기존 main solution SVG에 그래프와 P, p=2, q=−1이 이미 있다. 새 입력은 같은 그림을 되풀이하므로 제외.
Q02 | FIGURE | a=1 예시로 시작점과 (0,2)를 나타낸다. 실제 조건 f(−1)=2와 예시가 다름을 publish caption에 밝힌다.
Q03 | FIGURE | 일의 자리별 십의 자리 후보를 나타낸다. 한 항목에서 여러 화살표가 나가는 함수가 아닌 선택 대응임을 plan caption에 밝힌다.
Q04 | FIGURE | 첫 선수를 1번으로 고정한 예시의 둘째 선수 다섯 후보만 보인다. 여러 후보 선택 대응이며 전체 순열을 열거하지 않는다.
Q05 | FIGURE | 네 원소 중 두 개를 고르는 작은 사례에서 A 포함·제외로 나눠 인접한 조합 항의 구조를 보여 준다.
Q06 | FIGURE | 유리함수, 역함수, y=x와 대응점 (3,8), (8,3)을 나타낸다. 점근선·눈금·점 이름 겹침은 렌더 확인 대상.
Q07 | FIGURE | 18개 전체 항이 아니라 첫 세 항의 인접 분수 소거만 나타낸다. 괄호와 분수 라벨 간격은 렌더 확인 대상.
Q08 | KEEP | 기존 main solution SVG가 f, 역함수, y=x, P·Q와 d=√2, m=1을 이미 나타낸다. 최종 합은 SVG에 없고 제안 입력과 중복된다.
Q09 | OPEN | 원문은 x≠−a인 모든 x라 하지만 해설값 a=−2에서 x=0일 때 f(2−x), f(2+x)가 정의되지 않는다. 원문 조건과 해설을 다시 대조하기 전 입력·게시 금지. 기존 SVG는 보존.
Q10 | FIGURE | 선택한 세 상자에 서로 다른 공 다섯 개를 모두 넣는 한 예만 그린다. 포함배제 전체 계산은 그림에 쓰지 않는다.
Q11 | FIGURE | n=3일 때 양끝 여학생·연속한 남학생 다섯 명의 한 배열만 그린다. 두 경우의 전체 수를 비교하는 그림이라고 주장하지 않는다.
Q12 | FIGURE | 초콜릿 한 개일 때 유효한 종류 패턴 CCHCC만 나타낸다. 서로 다른 사탕의 전체 배열과 초콜릿 두 개 경우는 그림에 열거하지 않는다.
Q13 | REPLACE | 기존 main SVG는 허용 기울기 범위와 경계값을 직접 보여 준다. 새 후보는 m=−1/2 예시만 보여 주며 답 범위를 그림에 쓰지 않는다.
Q14 | FIGURE | 원본 q14.png의 여섯 영역을 바꾸지 않고 인접 관계만 보조도로 나타낸다. 화살표는 함수나 방향을 뜻하지 않는다.
Q15 | FIGURE | t=1→4, t=2→1/2인 양끝값 대응만 나타낸다. 4/t³의 연속 곡선이나 감소 증명을 그린다고 주장하지 않는다.
Q16 | FIGURE | 원본 q16.png를 보존하고 사용 가능한 인접 빈 좌석쌍만 보조도로 나타낸다. 각 화살표 방향은 좌석쌍의 방향이 아니다.
Q17 | REPLACE | 기존 main SVG에는 −3/2≤t≤0이 들어 있고 t=0의 시작점이 포함돼 있다. 새 후보는 내부 예시 t=−1에서 두 교점을 비교한다.
Q18 | REPLACE | 기존 main SVG는 답 n=9를 그림에 표시한다. 새 후보는 n=8 예시의 두 교점만 나타낸다.
Q19 | FIGURE | 원문 13개 중 평행선 세 개와 다른 직선 하나의 예시만 그린다. 전체 선택 수를 그림에 쓰지 않는다.
Q20 | REPLACE | 기존 main SVG는 32+40=72를 그림에 표시한다. 새 후보는 한 사례의 집합 분할을 보여 주고 전체 열거는 본문 해설에 둔다.
Q21 | FIGURE | k=3에서 유리함수와 두 원을 같은 축척으로 나타낸다. 중심·반지름은 정확값이며 네 접점은 엔진이 곡선-원 교점으로 계산하도록 지정했다.

REPLACE와 FIGURE는 미렌더 입력 후보 분류이며 교체 승인이나 품질 PASS가 아니다. 모든 기존 이미지와 원본 PNG는 이 브랜치에서 수정하지 않았다.
