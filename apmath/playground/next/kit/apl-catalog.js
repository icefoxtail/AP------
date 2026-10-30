/* ==========================================================================
   AP Math Lab · 실험실 카탈로그 (apl-catalog.js) — 허브·검색·노선도의 단일 출처
   - 실험실을 추가하면 이 목록에 한 항목만 더하면 됩니다. 개수·필터·검색·노선도는 자동입니다.
   - legacy: 기존 실험실 경로(playground 기준), next: 2.0 셸로 옮긴 실험실 경로(있을 때만)
   - strand: 노선도에서 이 실험실이 속한 대표 노선, scenes: 상위 장면(탭) 이름
   ========================================================================== */
window.APLab = window.APLab || {};
window.APLab.catalog = {
 "version": "2026-10-29",
 "labs": [
  {
   "id": "g7-points-lines",
   "course": "g7",
   "unit": "기본 도형",
   "strand": "shape",
   "order": 1,
   "title": "점 · 직선 · 반직선 · 선분 · 각",
   "short": "점·직선·각",
   "summary": "도형 언어부터 시작하는 기초 실험. 반직선과 선분 차이, 각도 측정.",
   "keywords": "점 직선 반직선 선분 각 기초 도형 점 · 직선 · 반직선 · 선분 · 각 중1 · 단원 01 기초",
   "badge": "기초",
   "scenes": [
    "직선·반직선·선분 & 공통부분 (5종)",
    "중점·삼등분·조건식 블록 (4종)",
    "선의 개수·맞꼭지각·시계 (4종)",
    "종이 테이프 접기·이등분선·직교 (4종)"
   ],
   "legacy": "labs/g7/points-lines.html",
   "glyph": "<path d=\"M10 52 L64 18\"/><circle cx=\"16\" cy=\"48\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"58\" cy=\"22\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M38 58 L70 58\"/>"
  },
  {
   "id": "g7-spatial",
   "course": "g7",
   "unit": "기본 도형",
   "strand": "space",
   "order": 2,
   "title": "위치관계 · 반례",
   "short": "위치관계",
   "summary": "평면과 공간에서의 위치관계. 예상과 다른 반례 발견.",
   "keywords": "위치관계 반례 평행 수직 꼬인 공간 위치관계 · 반례 중1 · 단원 02 탐구",
   "badge": "탐구",
   "scenes": [
    "다면체 꼬인 위치 소거 스캐너 (6종)",
    "전개도 접어 위치관계 추적 (4종)",
    "직선·평면 수직 & 평면 결정조건 (4종)",
    "공간 명제 참·거짓 3D 반례기 (6종)"
   ],
   "legacy": "labs/g7/spatial-relations.html",
   "glyph": "<path d=\"M14 48 L60 48 L74 28 L30 28 Z\"/><path d=\"M18 14 L18 62 M60 10 L60 54\"/><circle cx=\"18\" cy=\"48\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "g7-polygons",
   "course": "g7",
   "unit": "평면도형",
   "strand": "shape",
   "order": 3,
   "title": "평면도형 · 다각형 · 넓이",
   "short": "다각형·넓이",
   "summary": "다각형·각도와 넓이 변화. 내각의 합 동적 관찰.",
   "keywords": "평면도형 다각형 넓이 각도 오각형 육각형 평면도형 · 다각형 · 넓이 중1 · 단원 03 기초·응용",
   "badge": "기초·응용",
   "scenes": [
    "넓이 원리·바깥 액자",
    "평행선 넓이·산책로·둘레",
    "대각선(n-3)·내각·외각 360°",
    "별모양·복잡한 외각 마스터"
   ],
   "legacy": "labs/g7/polygons-area.html?v=20261027-g7chalkboard",
   "glyph": "<path d=\"M12 44 L32 16 L66 30 L60 60 L24 62 Z\"/><path d=\"M12 44 L60 60 M32 16 L60 60\"/>"
  },
  {
   "id": "g7-circle-sector",
   "course": "g7",
   "unit": "평면도형",
   "strand": "circle",
   "order": 4,
   "title": "원과 부채꼴 · 움직이는 실험실",
   "short": "원과 부채꼴",
   "summary": "6단계 · 26개 실험으로 호·현·둘레·넓이·색칠 면적을 직접 탐구합니다.",
   "keywords": "원 부채꼴 호 현 중심각 둘레 넓이 26개 실험 원과 부채꼴 · 개념 실험실 중1 · 단원 04",
   "badge": "26실험",
   "scenes": [
    "원 알아보기",
    "기본형",
    "길이·둘레",
    "넓이 원리",
    "색칠한 넓이",
    "응용 문제",
    "도형 변환 실험"
   ],
   "legacy": "labs/g7/원과_부채꼴_통합_마스터_스튜디오.html?v=20261027-circlelab-26",
   "glyph": "<circle cx=\"40\" cy=\"38\" r=\"28\"/><path d=\"M40 38 L40 10 A28 28 0 0 1 64 52 Z\" fill=\"currentColor\" fill-opacity=\".15\"/><path d=\"M40 38 L40 10 M40 38 L64 52\"/>",
   "sceneTotal": 26,
   "extra": [
    {
     "label": "기초판",
     "href": "labs/g7/원과_부채꼴_통합_마스터_스튜디오.html?start=basic&v=20261027-circlelab-26"
    }
   ]
  },
  {
   "id": "g7-polyhedra",
   "course": "g7",
   "unit": "입체도형",
   "strand": "space",
   "order": 5,
   "title": "다면체와 정다면체",
   "short": "다면체",
   "summary": "정다면체의 구조·절단·관계. 오일러 공식 시각화.",
   "keywords": "다면체 정다면체 정육면체 정사면체 면 꼭짓점 모서리 3D 다면체와 정다면체 중1 · 단원 05 3D",
   "badge": "3D",
   "scenes": [
    "각기둥·각뿔·각뿔대",
    "정다면체 증명·반례·쌍대",
    "전개도 3D 접기·꼭짓점 추적",
    "단면 슬라이서·꼭짓점 깎기"
   ],
   "legacy": "labs/g7/polyhedra.html?v=20261027-g7chalkboard",
   "glyph": "<path d=\"M40 8 L68 26 L60 58 L26 66 L10 34 Z\"/><path d=\"M40 8 L40 38 L68 26 M40 38 L10 34 M40 38 L26 66 M40 38 L60 58\"/>",
   "tags": [
    "3D"
   ]
  },
  {
   "id": "g7-nets",
   "course": "g7",
   "unit": "입체도형",
   "strand": "space",
   "order": 6,
   "title": "전개도 변환",
   "short": "전개도",
   "summary": "접고 펼치며 이해하는 3D 전개도. 관계 탐구 내장.",
   "keywords": "전개도 변환 접기 펼치기 육면체 3D 전개도 변환 중1 · 단원 06 3D",
   "badge": "3D",
   "scenes": [
    "정육면체 족보·불량·최단거리",
    "각기둥 패밀리 (3·4·5·6·사다리꼴)",
    "각뿔 & 각뿔대 (삼·사·오각뿔·뿔대)",
    "정다면체 5총사 & 360° 타일",
    "원기둥·반원기둥·케이크·휴지심",
    "원뿔·원뿔대 & 🔪입체 단면 스캐너"
   ],
   "legacy": "labs/g7/nets-folding.html",
   "glyph": "<path d=\"M26 10 H50 V36 H26 Z M26 36 H50 V58 H26 Z M2 36 H26 V58 H2 Z M50 36 H74 V58 H50 Z M26 58 H50 V72 H26 Z\"/>",
   "sceneTotal": 30,
   "tags": [
    "3D"
   ]
  },
  {
   "id": "g7-surface-volume",
   "course": "g7",
   "unit": "입체도형",
   "strand": "space",
   "order": 7,
   "title": "겉넓이 · 부피",
   "short": "겉넓이·부피",
   "summary": "실제 표면·단면과 부피의 관계. 입체를 슬라이스해서 확인.",
   "keywords": "겉넓이 부피 원기둥 원뿔 구 입체 겉넓이 · 부피 중1 · 단원 07 3D",
   "badge": "3D",
   "scenes": [
    "단위큐브(1cm³) & 기둥 겉넓이·부피 (4종)",
    "뿔·뿔대·고깔모자 & 3:1 물붓기 (4종)",
    "구(4πr²)·반구(3πr²) & 아르키메데스 1:2:3 (4종)",
    "쌍원뿔·이중원뿔·구멍·모퉁이 파낸 입체 (6종)"
   ],
   "legacy": "labs/g7/입체도형의 겉넓이와 부피.html",
   "glyph": "<path d=\"M22 24 L48 14 L72 28 L72 58 L48 68 L22 54 Z\"/><path d=\"M22 24 L48 38 L72 28 M48 38 L48 68\"/>",
   "tags": [
    "3D"
   ]
  },
  {
   "id": "g7-solids",
   "course": "g7",
   "unit": "입체도형",
   "strand": "space",
   "order": 8,
   "title": "입체도형 종합",
   "short": "입체 종합",
   "summary": "다면체·회전체 연결, 겨냥도·전개도 종합 탐색.",
   "keywords": "입체도형 종합 회전체 겨냥도 전개도 연결 비교 입체도형 종합 중1 · 단원 08 입체 비교",
   "badge": "입체 비교",
   "scenes": [
    "다면체(기둥·뿔·뿔대) & 정다면체 (5종)",
    "정육면체·다면체 전개도 폴딩 (5종)",
    "회전체 360° 생성 & 단면 슬라이서 (4종)",
    "회전체 전개도 & 개미 최단거리 (4종)"
   ],
   "legacy": "labs/g7/다면체·회전체&겨냥도·전개도.html",
   "glyph": "<ellipse cx=\"38\" cy=\"18\" rx=\"26\" ry=\"10\"/><path d=\"M12 18 V54 M64 18 V54\"/><path d=\"M12 54 A26 10 0 0 0 64 54 M12 54 A26 10 0 0 1 64 54\" stroke-dasharray=\"4 4\"/>"
  },
  {
   "id": "g8-triangles",
   "course": "g8",
   "unit": "삼각형의 성질",
   "strand": "shape",
   "order": 1,
   "title": "삼각형 경험도감",
   "short": "삼각형",
   "summary": "합동·각·내심과 외심·고난도 보조선 48개 배치 탐구.",
   "keywords": "삼각형 합동 내심 외심 수심 보조선 48장면 삼각형 경험도감 중2 · 단원 01 48장면",
   "badge": "48장면",
   "scenes": [
    "이등변 & 4대선",
    "직각합동 RHA/RHS",
    "일반합동 SSS/SAS/ASA",
    "각·수직이등분선",
    "외심 O & 수직이등분",
    "내심 I & 넓이·접선",
    "외심·내심·무게중심 비교",
    "고난도 각 & 보조선"
   ],
   "legacy": "labs/g8/triangles-atlas.html",
   "next": "next/labs/g8-triangles.html",
   "glyph": "<path d=\"M38 8 L76 68 L6 68 Z\"/><path d=\"M38 8 L38 68\"/><path d=\"M30 68 V58 H38\"/><circle cx=\"38\" cy=\"38\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 48
  },
  {
   "id": "g8-quadrilaterals",
   "course": "g8",
   "unit": "사각형의 성질",
   "strand": "shape",
   "order": 2,
   "title": "사각형 경험도감",
   "short": "사각형",
   "summary": "판별·넓이·대각선·반례·회전 41개 장면. 사각형 분류 완전 정복.",
   "keywords": "사각형 평행사변형 마름모 직사각형 대각선 판별 넓이 41장면 사각형 경험도감 중2 · 단원 02 41장면",
   "badge": "41장면",
   "scenes": [
    "평행사변형 성질·5대 판정",
    "사각형 족보 진화 & 등변사다리꼴",
    "등적변형 · 나비 넓이 · 내부 점 P",
    "중점연결 바리뇽 (직사각↔마름모)",
    "종이접기 & 정사각형 회전·정삼각형",
    "가짜 조건 반례 연구소 (오답 1위)"
   ],
   "legacy": "labs/g8/quadrilaterals-atlas.html",
   "glyph": "<path d=\"M10 24 L58 14 L74 58 L26 68 Z\"/><path d=\"M10 24 L74 58 M58 14 L26 68\"/><circle cx=\"42\" cy=\"41\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 30
  },
  {
   "id": "g8-similarity",
   "course": "g8",
   "unit": "도형의 닮음",
   "strand": "shape",
   "order": 3,
   "title": "닮음 경험도감",
   "short": "닮음",
   "summary": "숨은 삼각형 분리·정렬·대응·비. 비율의 시각적 이해.",
   "keywords": "닮음 비 삼각형 분리 정렬 대응 44장면 닮음 경험도감 중2 · 단원 03 44장면",
   "badge": "44장면",
   "scenes": [
    "포개진 삼각형·반전·SAS",
    "모래시계·평행선·각이등분선",
    "직각삼각형 수선 3총사(소공식)",
    "중점연결 & 무게중심(2:1)",
    "종이접기 & 사각형 닮음 킬러",
    "차원비(길이·넓이·부피) & 원뿔절단"
   ],
   "legacy": "labs/g8/similarity-atlas.html",
   "glyph": "<path d=\"M8 58 L28 20 L48 58 Z\"/><path d=\"M50 68 L62 42 L76 68 Z\"/><path d=\"M8 58 L50 68 M28 20 L62 42\" stroke-dasharray=\"3 4\"/>",
   "sceneTotal": 31
  },
  {
   "id": "g8-pythagoras",
   "course": "g8",
   "unit": "피타고라스 정리",
   "strand": "shape",
   "order": 4,
   "title": "피타고라스 정리",
   "short": "피타고라스",
   "summary": "직각삼각형·증명·활용 인터랙티브 탐구.",
   "keywords": "피타고라스 정리 직각삼각형 증명 활용 피타고라스 정리 중2 · 단원 04 탐구",
   "badge": "탐구",
   "scenes": [
    "세 정사각형 넓이 (a²+b²=c²)",
    "4대 증명 (유클리드·바스카라)",
    "피타고라스 수 & 배수 탐색",
    "예각·직각·둔각 판별기",
    "겹친 도형 제곱의 합 3총사",
    "정삼각형·반원·초승달 넓이",
    "빗변 수선 & 소(牛) 공식",
    "종이접기 & 최단거리 응용"
   ],
   "legacy": "labs/g8/피타고라스.html",
   "glyph": "<path d=\"M12 64 L12 16 L60 64 Z\"/><path d=\"M12 16 L12 16 M12 16 L22 16 L22 26 L12 26\"/> <path d=\"M12 64 L12 54 L22 54\" stroke-dasharray=\"3 3\"/>",
   "sceneTotal": 39
  },
  {
   "id": "g9-trig-ratio",
   "course": "g9",
   "unit": "삼각비",
   "strand": "trig",
   "order": 1,
   "title": "삼각비",
   "short": "삼각비",
   "summary": "sin·cos·tan을 직접 움직이며 탐구. 각도 변화에 따른 비율 변화.",
   "keywords": "삼각비 sin cos tan 직각삼각형 고도 삼각비 중3 · 단원 01 탐구",
   "badge": "탐구",
   "scenes": [
    "삼각비 뜻 & 기준각 전환",
    "특수각(30°·45°·60°) & 기울기",
    "반지름 1 사분원 & 대소비교",
    "직각삼각형 변 & 실생활 측량",
    "일반삼각형 변 (특수각 보존!)",
    "삼각형 높이 h (tan x ± tan y)",
    "삼각형 넓이 & 각이등분선",
    "평행사변형 & 대각선 넓이"
   ],
   "legacy": "labs/g9/삼각비.html",
   "glyph": "<path d=\"M8 64 L8 14 L64 64 Z\"/><path d=\"M8 14 L8 24 L18 24\"/> <path d=\"M28 64 L28 42\" stroke-dasharray=\"3 3\"/><text x=\"34\" y=\"56\" font-size=\"11\" fill=\"currentColor\" stroke=\"none\">sinθ</text>",
   "sceneTotal": 38,
   "next": "next/labs/g9-trig-ratio.html"
  },
  {
   "id": "g9-circle",
   "course": "g9",
   "unit": "원의 성질",
   "strand": "circle",
   "order": 2,
   "title": "원의 성질",
   "short": "원의 성질",
   "summary": "원주각·중심각·접선·할선 관계 인터랙티브 탐구.",
   "keywords": "원 접선 할선 원주각 중심각 내접 외접 원의 성질 중3 · 단원 02 탐구",
   "badge": "탐구",
   "scenes": [
    "원과 현 · 원 접기 · 아치복원",
    "원과 접선 · 내접원 · 피토정리",
    "원주각=½중심각 · 반원90° · 삼각비",
    "내접사각형(180°) · 외각 · 오각형",
    "접현각(∠BAT=∠BCA) & 두 원 접선",
    "원과 비례(할선·접선) & 착시반례"
   ],
   "legacy": "labs/g9/원.html",
   "next": "next/labs/g9-circle.html",
   "glyph": "<circle cx=\"40\" cy=\"38\" r=\"28\"/><path d=\"M12 38 L40 10 L68 38\"/><circle cx=\"40\" cy=\"38\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 30
  },
  {
   "id": "common-quadratic",
   "course": "common",
   "unit": "방정식과 부등식",
   "strand": "func",
   "order": 1,
   "title": "이차함수",
   "short": "이차함수",
   "summary": "이차함수 그래프 변환, 꼭짓점·축·판별식 동적 탐구.",
   "keywords": "이차함수 포물선 꼭짓점 축 판별식 그래프 이차함수 공통수학 함수",
   "badge": "함수",
   "scenes": [
    "차함수 f-g 변환 & 직선 위치관계",
    "움직이는 대칭축 x=p 최대·최소",
    "절댓값 폴딩(|f|, f(|x|)) & 실근개수",
    "실근의 위치 (근의 분리: 함·판·축)",
    "항상 성립하는 부등식 & 제한부등식",
    "1등급 결정타 함정 연구소"
   ],
   "legacy": "labs/공통수학/이차함수.html",
   "glyph": "<path d=\"M8 68 Q40 8 72 68\"/><line x1=\"40\" y1=\"8\" x2=\"40\" y2=\"70\" stroke-dasharray=\"3 3\"/><circle cx=\"40\" cy=\"24\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 30
  },
  {
   "id": "common-lines",
   "course": "common",
   "unit": "도형의 방정식",
   "strand": "coord",
   "order": 2,
   "title": "평면 · 직선 · 이동",
   "short": "직선·이동",
   "summary": "평행이동·대칭이동 시각화. 직선의 방정식과 도형 이동.",
   "keywords": "평면 직선 이동 평행이동 대칭이동 좌표 평면 · 직선 · 이동 공통수학 변환",
   "badge": "변환",
   "scenes": [
    "내분·외분 줄자 & 파푸스 중선",
    "정점 회전 직선 & 수직(mm'=-1)",
    "점·직선 거리 & 신발끈 넓이",
    "점 vs 도형 부호 역설 & 복합변환",
    "빛의 반사 & 거울 대칭 최단거리",
    "아폴로니오스 원 & 함정 연구소"
   ],
   "legacy": "labs/공통수학/평면·직선·이동.html",
   "glyph": "<line x1=\"8\" y1=\"38\" x2=\"72\" y2=\"38\"/><line x1=\"40\" y1=\"8\" x2=\"40\" y2=\"68\"/><path d=\"M18 18 L38 28 L58 18\" stroke-dasharray=\"0\"/><path d=\"M18 58 L38 48 L58 58\" stroke-dasharray=\"3 3\"/>",
   "sceneTotal": 30
  },
  {
   "id": "common-circle-eq",
   "course": "common",
   "unit": "도형의 방정식",
   "strand": "circle",
   "order": 3,
   "title": "원의 방정식",
   "short": "원의 방정식",
   "summary": "원의 방정식 표준형·일반형, 좌표 위치와 교점 탐구.",
   "keywords": "원의 방정식 좌표 중심 반지름 교점 원의 방정식 공통수학 좌표기하",
   "badge": "좌표기하",
   "scenes": [
    "원의 탄생·표준형·지름",
    "축에 접하는 원·부호함정",
    "아폴로니오스의 원·자취",
    "원과 직선 (d vs r·현)",
    "두 원 위치·공통현(O₁-O₂)",
    "접선의 방정식 3대 유형",
    "공통외접선·내접선·극선",
    "킬러 응용 (중선·이등분·반사)"
   ],
   "legacy": "labs/공통수학/원의 방정식.html",
   "glyph": "<circle cx=\"40\" cy=\"42\" r=\"24\"/><line x1=\"8\" y1=\"42\" x2=\"72\" y2=\"42\" stroke-dasharray=\"3 3\"/><line x1=\"40\" y1=\"8\" x2=\"40\" y2=\"72\" stroke-dasharray=\"3 3\"/><circle cx=\"40\" cy=\"42\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 32
  },
  {
   "id": "common-functions",
   "course": "common",
   "unit": "함수와 그래프",
   "strand": "func",
   "order": 4,
   "title": "합성함수 · 유리 · 무리함수",
   "short": "유리·무리함수",
   "summary": "합성함수·유리함수·무리함수 그래프 인터랙티브 탐구.",
   "keywords": "합성함수 유리함수 무리함수 역함수 그래프 합성함수 · 유리 · 무리함수 공통수학 함수",
   "badge": "함수",
   "scenes": [
    "유리함수 대칭과 등적변형",
    "무리함수·역함수 대칭 사각형",
    "유리·무리 결합과 교점 개수",
    "꺾인 함수와 역함수 3교점"
   ],
   "legacy": "labs/공통수학/합성함수·유리함수·무리함수.html",
   "glyph": "<path d=\"M8 68 Q20 10 40 38 Q60 66 72 8\"/><circle cx=\"8\" cy=\"68\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"72\" cy=\"8\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-explog",
   "course": "algebra",
   "unit": "Ⅰ. 지수함수와 로그함수",
   "strand": "func",
   "order": 1,
   "title": "지수·로그함수 그래프 탐구",
   "short": "지수·로그 그래프",
   "summary": "지수·로그함수의 8대 유형과 그래프·불변량을 조작하며 관찰합니다.",
   "keywords": "대수 고등 함수 도형 지수함수와 로그함수 지수·로그함수 그래프 탐구 지수·로그 함수 지수·로그함수의 8대 유형과 그래프·불변량을 조작하며 관찰합니다. part1a.html",
   "badge": "지수·로그 함수",
   "scenes": [
    "거듭제곱근 실근 개수",
    "평행이동과 기울기 절단",
    "역함수 대칭과 1:1:√2",
    "절댓값 꺾기와 곱 불변량",
    "내분·외분 닮음비 투영",
    "기하 번역 대소 비교(ㄱㄴㄷ)",
    "격자점(정수점) 스캐너",
    "치환 방부등식과 근의 분리"
   ],
   "legacy": "labs/대수/part1a.html",
   "glyph": "<path d=\"M8 68 H72 M14 8 V69\" stroke-opacity=\".45\"/><path d=\"M15 61 Q39 62 45 49 T67 10\" stroke-width=\"2.7\"/><path d=\"M22 67 Q28 32 42 25 T68 21\" stroke=\"#D8B77E\" stroke-width=\"1.7\"/><circle cx=\"45\" cy=\"49\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-exp-deep",
   "course": "algebra",
   "unit": "Ⅰ. 지수함수와 로그함수",
   "strand": "func",
   "order": 2,
   "title": "거듭제곱근·상용로그·지수함수",
   "short": "지수함수 심화",
   "summary": "거듭제곱근, 상용로그의 정수·소수 부분과 지수함수 심화를 시각화합니다.",
   "keywords": "대수 고등 함수 도형 지수함수와 로그함수 거듭제곱근·상용로그·지수함수 지수함수 심화 거듭제곱근, 상용로그의 정수·소수 부분과 지수함수 심화를 시각화합니다. part1a2.html",
   "badge": "지수함수 심화",
   "scenes": [
    "거듭제곱근 실근 매트릭스 심화",
    "자연수·유리수 조건 약수 스캐너",
    "상용로그 정수·소수부분 톱니파",
    "지수 계수 흡수 & 가로 간격 불변량",
    "밑이 다른 두 지수함수 수평 내분비",
    "지수 위 세 점 일직선",
    "대칭형 aˣ + a⁻ˣ & t ≥ 2 치환",
    "|aˣ − k| = t 점근선 반사"
   ],
   "legacy": "labs/대수/part1a2.html",
   "glyph": "<path d=\"M8 67 H74 M13 7 V68\" stroke-opacity=\".4\"/><path d=\"M15 59 Q41 58 47 45 T70 7\" stroke-width=\"2.8\"/><path d=\"M12 48 Q25 41 41 40 T70 37\" stroke=\"#D8B77E\" stroke-width=\"1.8\" stroke-dasharray=\"4 4\"/><circle cx=\"47\" cy=\"45\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-log",
   "course": "algebra",
   "unit": "Ⅰ. 지수함수와 로그함수",
   "strand": "func",
   "order": 3,
   "title": "로그함수와 역함수·도형",
   "short": "로그와 역함수",
   "summary": "로그함수 고유 성질, 역함수, 원·도형의 연결을 탐구합니다.",
   "keywords": "대수 고등 함수 도형 지수함수와 로그함수 로그함수와 역함수·도형 로그함수 로그함수 고유 성질, 역함수, 원·도형의 연결을 탐구합니다. part1b.html",
   "badge": "로그함수",
   "scenes": [
    "로그함수 고유 성질",
    "역함수·원·도형 결합"
   ],
   "legacy": "labs/대수/part1b.html",
   "glyph": "<path d=\"M8 68 H72 M12 8 V69\" stroke-opacity=\".45\"/><path d=\"M14 59 Q21 48 32 44 T69 39\" stroke-width=\"2.5\"/><path d=\"M20 66 L69 17\" stroke=\"#D8B77E\" stroke-width=\"1.3\" stroke-dasharray=\"4 4\"/><circle cx=\"32\" cy=\"44\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-log-deep",
   "course": "algebra",
   "unit": "Ⅰ. 지수함수와 로그함수",
   "strand": "func",
   "order": 4,
   "title": "로그함수·역함수 도형 심화",
   "short": "로그 도형 심화",
   "summary": "로그함수와 역함수, 직사각형의 관계를 8대 유형으로 탐구합니다.",
   "keywords": "대수 고등 함수 도형 지수함수와 로그함수 로그함수·역함수 도형 심화 로그 도형 심화 로그함수와 역함수, 직사각형의 관계를 8대 유형으로 탐구합니다. part1b1.html",
   "badge": "로그 도형 심화",
   "scenes": [
    "로그 세로 간격 불변량 & 등적 넓이",
    "진수 조건 함정",
    "|logₐ(x−p)| 교점 곱 & 중점",
    "정직한 역함수 대칭 & 1:1:√2",
    "어긋난 역함수 대칭축 이동",
    "기울기 ±1 직사각형·사다리꼴",
    "지수·로그와 원 결합",
    "역함수 축 전환 격자점"
   ],
   "legacy": "labs/대수/part1b1.html",
   "glyph": "<path d=\"M7 68 L72 5\" stroke=\"#D8B77E\" stroke-dasharray=\"4 4\" stroke-width=\"1.6\"/><rect x=\"26\" y=\"24\" width=\"29\" height=\"27\" stroke=\"#A78AC8\" stroke-width=\"1.4\"/><path d=\"M10 64 Q23 41 46 34 T69 26\" stroke-width=\"2.2\"/><path d=\"M17 61 Q28 57 35 44 T65 13\" stroke=\"#D8B77E\" stroke-width=\"1.9\"/>"
  },
  {
   "id": "alg-unit-circle",
   "course": "algebra",
   "unit": "Ⅱ. 삼각함수",
   "strand": "trig",
   "order": 5,
   "title": "단위원과 삼각함수 파형 연동",
   "short": "단위원·파형",
   "summary": "단위원의 점을 움직여 sin·cos·tan 좌표와 그래프를 함께 확인합니다.",
   "keywords": "대수 고등 함수 도형 삼각함수 단위원과 삼각함수 파형 연동 단위원·그래프 단위원의 점을 움직여 sin·cos·tan 좌표와 그래프를 함께 확인합니다. 단위원_연동탐구_시안.html",
   "badge": "단위원·그래프",
   "scenes": [
    "단위원에서 좌표 읽기",
    "좌표가 파형으로 이어지기",
    "방정식 모드",
    "부등식 모드"
   ],
   "legacy": "labs/대수/단위원과그래프.html",
   "glyph": "<circle cx=\"32\" cy=\"38\" r=\"27\" stroke-width=\"2.2\"/><path d=\"M5 38 H60 M32 8 V67\" stroke-opacity=\".4\"/><path d=\"M32 38 L52 19 L52 38\" stroke=\"#D8B77E\" stroke-width=\"2\"/><path d=\"M64 10 Q67 22 70 37 T76 68\" stroke=\"#D8B77E\" stroke-width=\"2.1\"/><circle cx=\"52\" cy=\"19\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-trig-geometry",
   "course": "algebra",
   "unit": "Ⅱ. 삼각함수",
   "strand": "trig",
   "order": 6,
   "title": "삼각함수와 도형 활용",
   "short": "삼각함수와 도형",
   "summary": "부채꼴·삼각방정식·사인법칙·코사인법칙을 기본 8문항과 심화 8문항으로 탐구합니다.",
   "keywords": "대수 고등 함수 도형 삼각함수 삼각함수와 도형 활용 삼각함수 기본 8문항 심화 8문항 부채꼴 특수각 그래프 사인법칙 코사인법칙 기하 16문항 part2a.html",
   "badge": "기본 8 · 심화 8",
   "scenes": [
    "부채꼴 넓이의 최댓값",
    "단위원 회전·대칭과 합동",
    "sin 2x와 직선의 교점 대칭",
    "|3 sin x − 1| 교점 개수"
   ],
   "legacy": "labs/대수/part2a.html",
   "glyph": "<path d=\"M6 40 H74 M15 8 V69\" stroke-opacity=\".4\"/><path d=\"M6 40 C14 8 22 8 30 40 S46 72 54 40 S70 8 75 27\" stroke-width=\"2.7\"/><path d=\"M6 40 C14 56 22 56 30 40 S46 24 54 40 S70 56 75 48\" stroke=\"#D8B77E\" stroke-width=\"1.8\"/>"
  },
  {
   "id": "alg-sine-cosine-law",
   "course": "algebra",
   "unit": "Ⅱ. 삼각함수",
   "strand": "trig",
   "order": 7,
   "title": "사인·코사인법칙 도형 탐구",
   "short": "사인·코사인법칙",
   "summary": "삼각형의 보조선과 사인·코사인법칙을 조작하며 이해합니다.",
   "keywords": "대수 고등 함수 도형 삼각함수 사인·코사인법칙 도형 탐구 사인·코사인법칙 삼각형의 보조선과 사인·코사인법칙을 조작하며 이해합니다. part2b.html",
   "badge": "사인·코사인법칙",
   "scenes": [
    "수선의 발로 밑변·넓이",
    "세 변으로 높이·넓이",
    "공통현과 두 외접원",
    "외접원 반지름 비와 사인값"
   ],
   "legacy": "labs/대수/part2b.html",
   "glyph": "<path d=\"M11 66 L33 10 L72 66 Z\" stroke-width=\"2.6\"/><path d=\"M33 10 V66\" stroke=\"#D8B77E\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><path d=\"M33 60 H39 V66\" stroke=\"#D8B77E\" stroke-width=\"1.5\"/><path d=\"M18 53 Q25 48 30 51\" stroke=\"#A78AC8\" stroke-width=\"1.8\"/><circle cx=\"33\" cy=\"10\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "alg-sequence",
   "course": "algebra",
   "unit": "Ⅲ. 수열",
   "strand": "seq",
   "order": 8,
   "title": "수열의 그래프와 점화식",
   "short": "수열",
   "summary": "수열을 함수 그래프로 나타내고 점화식의 거미줄 그림·역추적 트리를 조작합니다.",
   "keywords": "대수 고등 함수 도형 수열 수열의 그래프와 점화식 수열의 함수적 해석 수열을 함수 그래프로 나타내고 점화식의 거미줄 그림·역추적 트리를 조작합니다. part3.html",
   "badge": "수열의 함수적 해석",
   "scenes": [
    "등차 일반항 직선 & 등차중항",
    "합 Sₙ 원점 통과 포물선",
    "절댓값 수열",
    "Sₙ 상수항 함정과 a₁ 점프",
    "등비수열 구간 블록 합",
    "시그마 망원급수 소거",
    "점화식 주기성 거미줄",
    "점화식 역추적 이진 트리"
   ],
   "legacy": "labs/대수/part3.html",
   "glyph": "<path d=\"M7 68 H74 M12 8 V69\" stroke-opacity=\".4\"/><path d=\"M16 61 Q38 52 42 35 T70 13\" stroke=\"#D8B77E\" stroke-width=\"1.4\" stroke-dasharray=\"4 4\"/><path d=\"M16 61 L29 56 L42 35 L55 24 L69 13\" stroke-width=\"2.3\"/><circle cx=\"16\" cy=\"61\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"29\" cy=\"56\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"42\" cy=\"35\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"55\" cy=\"24\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"69\" cy=\"13\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "calc1-limits",
   "course": "calc1",
   "unit": "함수의 극한과 연속",
   "strand": "calc",
   "order": 1,
   "title": "함수의 극한 · 연속",
   "short": "극한·연속",
   "summary": "수렴·발산·연속·불연속 개념 그래프 인터랙티브 탐구.",
   "keywords": "함수 극한 연속 불연속 수렴 발산 함수의 극한 · 연속 미적분1 극한·연속",
   "badge": "극한·연속",
   "scenes": [
    "좌·우극한 & 연속 판정",
    "0/0 부정형 & 기울기비",
    "곱함수 f(x)g(x) 연속",
    "교점 개수 함수 g(t)",
    "사잇값 정리(IVT)"
   ],
   "legacy": "labs/미적분1/함수의 극한·연속.html",
   "next": "next/labs/calc1-limits.html",
   "glyph": "<path d=\"M8 52 Q24 52 36 28\"/><path d=\"M44 28 Q56 52 72 52\"/><circle cx=\"40\" cy=\"28\" r=\"4\" stroke=\"currentColor\" fill=\"var(--surface2)\"/> <circle cx=\"40\" cy=\"28\" r=\"2\" fill=\"currentColor\" stroke=\"none\" opacity=\".3\"/>"
  },
  {
   "id": "calc1-tangent",
   "course": "calc1",
   "unit": "미분",
   "strand": "calc",
   "order": 2,
   "title": "접선과 미분계수",
   "short": "접선·미분계수",
   "summary": "접선의 기울기·미분계수·순간변화율 동적 탐구.",
   "keywords": "접선 미분계수 기울기 극한 순간변화율 접선과 미분계수 미적분1 미분",
   "badge": "미분",
   "scenes": [
    "할선→접선 & 미분계수",
    "평균값·롤의 정리",
    "좌·우미분 & 첨점 판별",
    "법선과 최단거리",
    "두 곡선의 공통접선"
   ],
   "legacy": "labs/미적분1/접선과 미분계수.html",
   "glyph": "<path d=\"M8 64 Q40 4 72 48\"/><line x1=\"16\" y1=\"72\" x2=\"64\" y2=\"20\"/> <circle cx=\"42\" cy=\"32\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "next": "next/labs/calc1-tangent.html"
  },
  {
   "id": "calc1-derivative-shape",
   "course": "calc1",
   "unit": "미분",
   "strand": "calc",
   "order": 3,
   "title": "도함수 ↔ 원함수",
   "short": "도함수↔원함수",
   "summary": "원함수와 도함수 그래프의 상호관계 동적 탐구.",
   "keywords": "도함수 원함수 미분 그래프 관계 도함수 ↔ 원함수 미적분1 미분",
   "badge": "미분",
   "scenes": [
    "삼차 개형 & 증감표",
    "사차 개형 조각가",
    "극값 부호 & 실근 개수",
    "f'-g' 차함수 추론",
    "g(x)=∫ₐˣ f(t)dt 추론"
   ],
   "legacy": "labs/미적분1/도함수 ↔ 원함수.html",
   "next": "next/labs/calc1-derivative-shape.html",
   "glyph": "<path d=\"M8 58 Q20 10 40 38 Q60 66 72 18\"/><path d=\"M8 50 Q20 46 40 40 Q60 34 72 30\" stroke-dasharray=\"3 3\"/>"
  },
  {
   "id": "calc1-cubic",
   "course": "calc1",
   "unit": "미분",
   "strand": "calc",
   "order": 4,
   "title": "삼차함수 비율관계",
   "short": "삼차함수 비율",
   "summary": "삼차함수 극값·변곡점 비율의 규칙성 발견.",
   "keywords": "삼차함수 비율 극값 변곡점 그래프 삼차함수 비율관계 미적분1 고차함수",
   "badge": "고차함수",
   "scenes": [
    "1:1:1 & 1:√3 박스",
    "사선 접선 2:1 불변",
    "넓이 1/12 & 변곡할선",
    "f(x)↔f'(x) 동기화",
    "외부점 접선 개수(1·2·3)"
   ],
   "legacy": "labs/미적분1/삼차함수 비율관계.html",
   "next": "next/labs/calc1-cubic.html",
   "glyph": "<path d=\"M8 60 Q24 12 40 38 Q56 64 72 16\"/>"
  },
  {
   "id": "calc1-quartic",
   "course": "calc1",
   "unit": "미분",
   "strand": "calc",
   "order": 5,
   "title": "사차함수 비율관계",
   "short": "사차함수 비율",
   "summary": "사차함수 그래프와 극값·변곡점 비율 탐구.",
   "keywords": "사차함수 비율 극값 변곡점 그래프 사차함수 비율관계 미적분1 고차함수",
   "badge": "고차함수",
   "scenes": [
    "삼중근 3 : 1 비율",
    "대칭 W형 1 : √2 비율",
    "넓이 1/20 & 1/30 공식",
    "f(x)↔f'(x) 넓이 동기화",
    "|f(x)-k| 미분가능성"
   ],
   "legacy": "labs/미적분1/사차함수 비율관계.html",
   "next": "next/labs/calc1-quartic.html",
   "glyph": "<path d=\"M8 50 Q18 8 28 38 Q40 68 52 30 Q62 8 72 48\"/>"
  },
  {
   "id": "calc1-composite",
   "course": "calc1",
   "unit": "미분",
   "strand": "calc",
   "order": 6,
   "title": "합성함수 · 절댓값 그래프",
   "short": "합성·절댓값",
   "summary": "합성함수·절댓값 변환 그래프 동적 탐구.",
   "keywords": "합성함수 절댓값 그래프 변환 함수 합성함수 · 절댓값 그래프 미적분1 함수",
   "badge": "함수",
   "scenes": [
    "4대 절댓값 변환",
    "|f(x)-t|=k 교점 스캔",
    "|f(x)|·g(x) 첨점 힐링",
    "합성함수 f(g(x)) 극값",
    "f(g(x))=k 2단계 치환"
   ],
   "legacy": "labs/미적분1/합성함수·절댓값 그래프.html",
   "next": "next/labs/calc1-composite.html",
   "glyph": "<path d=\"M8 64 L24 24 L40 64 L56 24 L72 64\"/>"
  },
  {
   "id": "calc1-integral",
   "course": "calc1",
   "unit": "적분",
   "strand": "calc",
   "order": 7,
   "title": "정적분과 넓이",
   "short": "정적분·넓이",
   "summary": "구분구적법·리만합으로 넓이 개념 시각적 이해.",
   "keywords": "정적분 넓이 구분구적법 리만합 사다리꼴 정적분과 넓이 미적분1 적분",
   "badge": "적분",
   "scenes": [
    "정적분 vs 넓이 분할",
    "포물선 1/6 & 이등분",
    "삼차 넓이 S₁ = S₂",
    "두 곡선 ↔ 차함수 동기화",
    "역함수 정적분 퍼즐"
   ],
   "legacy": "labs/미적분1/정적분과 넓이.html",
   "next": "next/labs/calc1-integral.html",
   "glyph": "<path d=\"M8 64 Q40 4 72 64 Z\" fill=\"currentColor\" fill-opacity=\".12\"/> <path d=\"M8 64 Q40 4 72 64\"/> <line x1=\"8\" y1=\"64\" x2=\"72\" y2=\"64\"/>"
  },
  {
   "id": "calc1-motion",
   "course": "calc1",
   "unit": "적분",
   "strand": "calc",
   "order": 8,
   "title": "속도 · 가속도 · 이동거리",
   "short": "속도·이동거리",
   "summary": "위치함수·속도·가속도·이동거리 상호관계 시각화.",
   "keywords": "속도 가속도 이동거리 위치 함수 미분 적분 속도 · 가속도 · 이동거리 미적분1 응용",
   "badge": "응용",
   "scenes": [
    "변위 vs 이동거리",
    "운동 방향 전환(유턴)",
    "원점 복귀 & 최대속력",
    "두 점 P·Q 추격전",
    "위치 x(t) vs 속도 v(t) 함정"
   ],
   "legacy": "labs/미적분1/속도·가속도·이동거리.html",
   "next": "next/labs/calc1-motion.html",
   "glyph": "<path d=\"M8 60 Q20 58 32 30 Q44 8 56 30 Q68 50 72 48\"/><path d=\"M8 50 L72 50\" stroke-dasharray=\"3 3\"/><circle cx=\"44\" cy=\"12\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "geom-parabola",
   "course": "geom",
   "unit": "이차곡선",
   "strand": "circle",
   "order": 1,
   "title": "포물선",
   "short": "포물선",
   "summary": "포물선 표준형, 초점·준선 관계 동적 탐구.",
   "keywords": "포물선 초점 준선 방정식 이차곡선 포물선 기하와벡터 이차곡선",
   "badge": "이차곡선",
   "scenes": [
    "정의·정삼각형·최단거리",
    "기출1: 초점현 역수합·cosθ",
    "기출2: 초점현 원·두 접선 직교",
    "기출3: 접선 마름모·페달 닮음"
   ],
   "legacy": "labs/기하와벡터/포물선.html",
   "glyph": "<path d=\"M8 68 Q40 4 72 68\"/><line x1=\"8\" y1=\"52\" x2=\"72\" y2=\"52\" stroke-dasharray=\"3 3\"/><circle cx=\"40\" cy=\"30\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "geom-ellipse",
   "course": "geom",
   "unit": "이차곡선",
   "strand": "circle",
   "order": 2,
   "title": "타원",
   "short": "타원",
   "summary": "타원 표준형, 초점·장단축·이심률 동적 탐구.",
   "keywords": "타원 초점 장축 단축 이심률 방정식 타원 기하와벡터 이차곡선",
   "badge": "이차곡선",
   "scenes": [
    "정의·직각·초점현",
    "보조원·정사영·절편",
    "대칭점 F''·중점연결·d₁d₂=b²",
    "법선 이등분·몬쥬의 원"
   ],
   "legacy": "labs/기하와벡터/타원.html",
   "glyph": "<ellipse cx=\"40\" cy=\"38\" rx=\"32\" ry=\"20\"/><circle cx=\"22\" cy=\"38\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"58\" cy=\"38\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>"
  },
  {
   "id": "geom-hyperbola",
   "course": "geom",
   "unit": "이차곡선",
   "strand": "circle",
   "order": 3,
   "title": "쌍곡선",
   "short": "쌍곡선",
   "summary": "쌍곡선 표준형, 초점·점근선·이심률 동적 탐구.",
   "keywords": "쌍곡선 점근선 초점 이심률 표준형 쌍곡선 기하와벡터 이차곡선",
   "badge": "이차곡선",
   "scenes": [
    "정의(|PF'-PF|=2a) 킬러",
    "기출1: 점근선 & 초점 수선(=b)",
    "기출2: 두 점근선 수선 곱",
    "기출3: 접선(각이등분) & 수선곱"
   ],
   "legacy": "labs/기하와벡터/쌍곡선.html",
   "glyph": "<path d=\"M8 68 Q14 38 28 18\"/><path d=\"M52 18 Q66 38 72 68\"/><line x1=\"8\" y1=\"8\" x2=\"72\" y2=\"68\" stroke-dasharray=\"3 3\"/><line x1=\"72\" y1=\"8\" x2=\"8\" y2=\"68\" stroke-dasharray=\"3 3\"/>"
  },
  {
   "id": "geom-space",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 4,
   "title": "공간도형 3D",
   "short": "공간도형",
   "summary": "공간에서 직선·평면 관계, 이면각 동적 3D 시각화.",
   "keywords": "공간도형 3D 직선 평면 이면각 정사영 공간도형 3D 기하와벡터 3D",
   "badge": "3D",
   "scenes": [
    "꼬인 위치 & 정사면체 수직(90°)",
    "기출1: 삼수선의 정리 킬러",
    "기출2: 이면각 & 정사면체(cosθ=1/3)",
    "기출3: 직육면체 대각선 & 삼면각"
   ],
   "legacy": "labs/기하와벡터/공간도형 3D.html",
   "glyph": "<path d=\"M40 8 L70 28 L60 62 L20 70 L8 36 Z\"/><path d=\"M40 8 L38 40 L70 28 M38 40 L8 36 M38 40 L20 70 M38 40 L60 62\"/>",
   "next": "next/labs/geom-space-3d.html",
   "tags": [
    "3D"
   ]
  },
  {
   "id": "geom-projection",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 5,
   "title": "정사영 3D",
   "short": "정사영",
   "summary": "도형의 정사영, 넓이 공식(cosθ) 3D 시각화 탐구.",
   "keywords": "정사영 3D 넓이 코사인 투영 정사영 3D 기하와벡터 3D",
   "badge": "3D",
   "scenes": [
    "정사영 기본 (S' = S cosθ)",
    "기출1: 원기둥 타원 단면 역정사영",
    "기출2: 정육면체 단면 이면각(1/√3)",
    "기출3: 비스듬한 태양광 그림자"
   ],
   "legacy": "labs/기하와벡터/정사영 3D.html",
   "glyph": "<path d=\"M8 62 L48 14 L72 48 L32 70 Z\" stroke-dasharray=\"0\"/><path d=\"M8 62 L48 62 L72 62\" stroke-dasharray=\"4 3\"/><path d=\"M48 14 L48 62\" stroke-dasharray=\"3 3\"/>",
   "tags": [
    "3D"
   ]
  },
  {
   "id": "geom-space-coord",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 6,
   "title": "공간좌표 3D",
   "short": "공간좌표",
   "summary": "3차원 좌표계, 두 점 거리·중점·구의 방정식 탐구.",
   "keywords": "공간좌표 3D 점 거리 중점 구의 방정식 공간좌표 3D 기하와벡터 3D",
   "badge": "3D",
   "scenes": [
    "수선의 발 & 대칭 최단거리",
    "기출1: 내분점 & 평면 교점(|z₁|:|z₂|)",
    "기출2: 구와 평면의 교선원(R²-d²)",
    "기출3: 구 밖의 점 최대·최소 & 접선장"
   ],
   "legacy": "labs/기하와벡터/공간좌표_3D.html",
   "glyph": "<line x1=\"40\" y1=\"68\" x2=\"40\" y2=\"8\"/><line x1=\"8\" y1=\"50\" x2=\"72\" y2=\"50\"/><line x1=\"14\" y1=\"20\" x2=\"66\" y2=\"62\"/> <circle cx=\"52\" cy=\"28\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/>",
   "tags": [
    "3D"
   ]
  },
  {
   "id": "geom-vector-ops",
   "course": "geom",
   "unit": "벡터",
   "strand": "coord",
   "order": 7,
   "title": "벡터의 덧셈과 뺄셈",
   "short": "벡터 연산",
   "summary": "평행사변형법·삼각형법 시각화. 벡터 합성 직접 조작.",
   "keywords": "벡터 덧셈 뺄셈 평행사변형 삼각형법 벡터의 덧셈과 뺄셈 기하와벡터 벡터",
   "badge": "벡터",
   "scenes": [
    "덧셈 (평행사변형·삼각형·중점)",
    "뺄셈 & 시점 통일 (종점-시점)",
    "기출1: 원의 중심 경유 분해",
    "기출2: 영벡터 합 & 넓이비(a:b:c)"
   ],
   "legacy": "labs/기하와벡터/벡터의덧셈과뺄셈.html",
   "glyph": "<path d=\"M16 60 L48 20 L68 44\"/><path d=\"M16 60 L68 44\" stroke-dasharray=\"4 3\"/><path d=\"M48 20 L16 60\"/>"
  },
  {
   "id": "geom-vector-dot",
   "course": "geom",
   "unit": "벡터",
   "strand": "coord",
   "order": 8,
   "title": "벡터의 성분 · 내적",
   "short": "성분·내적",
   "summary": "벡터 성분 분해, 내적·각도 관계 동적 탐구.",
   "keywords": "벡터 성분 내적 각도 크기 방향 벡터의 성분 · 내적 기하와벡터 벡터",
   "badge": "벡터",
   "scenes": [
    "정사영 기하학 (바닥×그림자)",
    "성분 내적 & 사잇각·수직 판정",
    "기출1: 원 위 동점 내적 최대·최소",
    "기출2: 중점 제곱차 (PA·PB=PM²-L²)"
   ],
   "legacy": "labs/기하와벡터/벡터의 성분·내적.html",
   "glyph": "<path d=\"M16 58 L56 22\"/><path d=\"M16 58 L64 50\"/><path d=\"M44 28 A22 22 0 0 1 58 46\"/>"
  },
  {
   "id": "geom-vector-figure",
   "course": "geom",
   "unit": "벡터",
   "strand": "coord",
   "order": 9,
   "title": "벡터로 나타낸 도형",
   "short": "벡터와 도형",
   "summary": "벡터로 직선·삼각형·내분점·외분점 표현 탐구.",
   "keywords": "벡터 도형 표현 직선 삼각형 내분 외분 벡터로 나타낸 도형 기하와벡터 벡터",
   "badge": "벡터",
   "scenes": [
    "내분·외분 & 일직선(1-t, t)",
    "기출1: 계수 합(m+n=k) 자취·넓이",
    "기출2: 방향벡터 vs 법선벡터 직선",
    "기출3: 원의 벡터방정식 (지름·접선)"
   ],
   "legacy": "labs/기하와벡터/벡터로 나타낸 도형.html",
   "glyph": "<path d=\"M12 58 L48 18\" marker-end=\"url(#arr)\"/><path d=\"M32 62 L68 30\" stroke-dasharray=\"4 3\" marker-end=\"url(#arr2)\"/> <defs><marker id=\"arr\" markerWidth=\"6\" markerHeight=\"6\" refX=\"3\" refY=\"3\" orient=\"auto\"><path d=\"M0 0 L6 3 L0 6 Z\" fill=\"currentColor\"/></marker> <marker id=\"arr2\" markerWidth=\"6\" markerHeight=\"6\" refX=\"3\" refY=\"3\" orient=\"auto\"><path d=\"M0 0 L6 3 L0 6 Z\" fill=\"currentColor\"/></marker></defs>"
  }
 ],
 "courses": [
  {
   "id": "g7",
   "name": "중1",
   "level": "중학교 1학년",
   "title": "기본 도형 · 평면도형 · 입체도형",
   "hue": "teal"
  },
  {
   "id": "g8",
   "name": "중2",
   "level": "중학교 2학년",
   "title": "삼각형 · 사각형 · 닮음 · 피타고라스",
   "hue": "blue"
  },
  {
   "id": "g9",
   "name": "중3",
   "level": "중학교 3학년",
   "title": "삼각비 · 원의 성질",
   "hue": "indigo"
  },
  {
   "id": "common",
   "name": "공통수학",
   "level": "고등학교 1학년",
   "title": "방정식과 부등식 · 도형의 방정식 · 함수",
   "hue": "violet"
  },
  {
   "id": "algebra",
   "name": "대수",
   "level": "고등학교 2학년",
   "title": "지수·로그함수 · 삼각함수 · 수열",
   "hue": "gold"
  },
  {
   "id": "calc1",
   "name": "미적분Ⅰ",
   "level": "고등학교 2학년",
   "title": "함수의 극한 · 미분 · 적분",
   "hue": "orange"
  },
  {
   "id": "geom",
   "name": "기하",
   "level": "고등학교 2·3학년",
   "title": "이차곡선 · 공간도형 · 벡터",
   "hue": "pink"
  }
 ],
 "strands": [
  {
   "id": "shape",
   "name": "도형 라인",
   "hue": "teal",
   "stations": [
    "g7-points-lines",
    "g7-polygons",
    "g8-triangles",
    "g8-quadrilaterals",
    "g8-similarity",
    "g8-pythagoras"
   ]
  },
  {
   "id": "trig",
   "name": "삼각 라인",
   "hue": "gold",
   "stations": [
    "g8-pythagoras",
    "g9-trig-ratio",
    "alg-unit-circle",
    "alg-trig-geometry",
    "alg-sine-cosine-law"
   ]
  },
  {
   "id": "circle",
   "name": "원·곡선 라인",
   "hue": "pink",
   "stations": [
    "g7-circle-sector",
    "g9-circle",
    "common-circle-eq",
    "geom-parabola",
    "geom-ellipse",
    "geom-hyperbola"
   ]
  },
  {
   "id": "space",
   "name": "공간 라인",
   "hue": "indigo",
   "stations": [
    "g7-spatial",
    "g7-polyhedra",
    "g7-nets",
    "g7-surface-volume",
    "g7-solids",
    "geom-space",
    "geom-projection",
    "geom-space-coord"
   ]
  },
  {
   "id": "coord",
   "name": "좌표·벡터 라인",
   "hue": "blue",
   "stations": [
    "common-lines",
    "common-circle-eq",
    "geom-vector-ops",
    "geom-vector-dot",
    "geom-vector-figure",
    "geom-space-coord"
   ]
  },
  {
   "id": "func",
   "name": "함수 라인",
   "hue": "violet",
   "stations": [
    "common-quadratic",
    "common-functions",
    "alg-explog",
    "alg-exp-deep",
    "alg-log",
    "alg-log-deep",
    "calc1-limits"
   ]
  },
  {
   "id": "calc",
   "name": "미적분 라인",
   "hue": "orange",
   "stations": [
    "calc1-limits",
    "calc1-tangent",
    "calc1-derivative-shape",
    "calc1-cubic",
    "calc1-quartic",
    "calc1-composite",
    "calc1-integral",
    "calc1-motion"
   ]
  },
  {
   "id": "seq",
   "name": "수열 라인",
   "hue": "green",
   "stations": [
    "alg-sequence"
   ]
  }
 ]
};
