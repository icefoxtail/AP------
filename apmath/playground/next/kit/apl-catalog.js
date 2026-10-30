/* ==========================================================================
   AP Math Lab · 실험실 카탈로그 (apl-catalog.js) — 허브·검색·노선도의 단일 출처
   - 실험실을 추가하면 이 목록에 한 항목만 더하면 됩니다. 개수·필터·검색·노선도는 자동입니다.
   - legacy: 기존 실험실 경로(playground 기준), next: 2.0 셸로 옮긴 실험실 경로(있을 때만)
   - strand: 노선도에서 이 실험실이 속한 대표 노선, scenes: 상위 장면(탭) 이름
   ========================================================================== */
window.APLab = window.APLab || {};
window.APLab.catalog = {
 "version": "2026-10-30",
 "labs": [
  {
   "id": "g7-points-lines",
   "course": "g7",
   "unit": "기본 도형",
   "strand": "shape",
   "order": 1,
   "title": "점 · 직선 · 반직선 · 선분 · 각",
   "short": "점·직선·각",
   "summary": "직선·반직선·선분의 차이, 중점, 맞꼭지각, 종이 접기에서 생기는 각을 점을 움직이며 확인합니다.",
   "keywords": "점 직선 반직선 선분 각 중점 삼등분점 맞꼭지각 각의 이등분선 수직 수선의 발 두 점 사이의 거리 시침 분침 종이테이프 기본 도형 중1",
   "badge": "기초",
   "scenes": [
    "직선·반직선·선분의 차이, 공통부분 (5종)",
    "중점·삼등분점과 선분의 길이 (4종)",
    "선의 개수, 맞꼭지각, 시계의 각도 (4종)",
    "종이 접기, 각의 이등분선, 수직 (4종)"
   ],
   "legacy": "labs/g7/points-lines.html",
   "next": "next/labs/g7-points-lines.html",
   "glyph": "<path d=\"M10 52 L64 18\"/><circle cx=\"16\" cy=\"48\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/><circle cx=\"58\" cy=\"22\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/><path d=\"M38 58 L70 58\"/>"
  },
  {
   "id": "g7-spatial",
   "course": "g7",
   "unit": "기본 도형",
   "strand": "space",
   "order": 2,
   "title": "위치 관계 · 반례",
   "short": "위치 관계",
   "summary": "평면과 공간에서 직선·평면의 위치 관계를 알아보고, 항상 옳지는 않은 설명의 반례를 찾아봅니다.",
   "keywords": "위치 관계 반례 평행 수직 꼬인 위치 직선과 평면 평면 결정 조건 전개도 모서리 다면체 공간 중1",
   "badge": "탐구",
   "scenes": [
    "다면체에서 꼬인 위치의 모서리 찾기 (6종)",
    "전개도를 접으며 위치 관계 알아보기 (4종)",
    "직선과 평면의 수직, 평면이 정해지는 조건 (4종)",
    "공간에서 참·거짓 판별과 반례 찾기 (6종)"
   ],
   "legacy": "labs/g7/spatial-relations.html",
   "next": "next/labs/g7-spatial.html",
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
   "summary": "다각형의 대각선·내각·외각과 삼각형·사각형의 넓이를 도형을 움직이며 확인합니다.",
   "keywords": "평면도형 다각형 대각선 내각 외각 넓이 삼각형 평행사변형 사다리꼴 오각형 육각형 별 모양 중1",
   "badge": "기초·응용",
   "scenes": [
    "삼각형·평행사변형·사다리꼴의 높이와 넓이",
    "평행선 사이의 넓이, 길의 넓이, 둘레",
    "대각선의 개수, 내각의 합, 외각의 합 360°",
    "별 모양 등 복잡한 도형의 각의 크기"
   ],
   "legacy": "labs/g7/polygons-area.html?v=20261027-g7chalkboard",
   "next": "next/labs/g7-polygons.html",
   "glyph": "<path d=\"M12 44 L32 16 L66 30 L60 60 L24 62 Z\"/><path d=\"M12 44 L60 60 M32 16 L60 60\"/>"
  },
  {
   "id": "g7-circle-sector",
   "course": "g7",
   "unit": "평면도형",
   "strand": "circle",
   "order": 4,
   "title": "원과 부채꼴",
   "short": "원과 부채꼴",
   "summary": "원의 각 부분, 호의 길이, 둘레, 넓이, 색칠한 부분의 넓이를 단계별 실험으로 직접 탐구합니다.",
   "keywords": "원 부채꼴 호 현 중심각 활꼴 반원 사분원 호의 길이 둘레 넓이 색칠한 부분의 넓이 중1",
   "badge": "26실험",
   "scenes": [
    "원의 각 부분의 이름 (호·현·부채꼴·활꼴)",
    "원·반원·사분원·부채꼴·활꼴",
    "호의 길이와 도형의 둘레",
    "원과 부채꼴의 넓이",
    "색칠한 부분의 넓이",
    "응용 문제",
    "도형을 넣고 빼고 나누고 옮기기"
   ],
   "legacy": "labs/g7/원과_부채꼴_통합_마스터_스튜디오.html?v=20261027-circlelab-26",
   "next": "next/labs/g7-circle-sector.html",
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
   "summary": "각기둥·각뿔·각뿔대와 정다면체의 면·꼭짓점·모서리 사이의 관계, 전개도, 단면을 확인합니다.",
   "keywords": "다면체 정다면체 각기둥 각뿔 각뿔대 정육면체 정사면체 면 꼭짓점 모서리 전개도 단면 입체 중1",
   "badge": "입체",
   "scenes": [
    "각기둥·각뿔·각뿔대",
    "정다면체가 5가지뿐인 이유, 정다면체가 아닌 예",
    "전개도를 접어 꼭짓점과 모서리 찾기",
    "정육면체의 단면, 꼭짓점 쪽을 잘라 낸 입체"
   ],
   "legacy": "labs/g7/polyhedra.html?v=20261027-g7chalkboard",
   "next": "next/labs/g7-polyhedra.html",
   "glyph": "<path d=\"M40 8 L68 26 L60 58 L26 66 L10 34 Z\"/><path d=\"M40 8 L40 38 L68 26 M40 38 L10 34 M40 38 L26 66 M40 38 L60 58\"/>",
   "tags": [
    "입체"
   ]
  },
  {
   "id": "g7-nets",
   "course": "g7",
   "unit": "입체도형",
   "strand": "space",
   "order": 6,
   "title": "전개도와 입체 단면",
   "short": "전개도",
   "summary": "기둥·뿔·정다면체·원기둥·원뿔의 전개도를 접고 펼치며, 입체를 자른 단면의 모양을 확인합니다.",
   "keywords": "전개도 접기 펼치기 정육면체 각기둥 각뿔 각뿔대 정다면체 원기둥 원뿔 원뿔대 단면 최단 경로 입체도형 중1",
   "badge": "입체",
   "scenes": [
    "정육면체의 전개도, 전개도가 될 수 없는 모양, 최단 경로",
    "각기둥의 전개도 (삼각기둥·직육면체·오각기둥 등)",
    "각뿔과 각뿔대의 전개도",
    "정다면체의 전개도, 한 꼭짓점에 모인 각의 합",
    "원기둥·반원기둥·속이 빈 원기둥의 전개도",
    "원뿔·원뿔대의 전개도와 입체의 단면"
   ],
   "legacy": "labs/g7/nets-folding.html",
   "next": "next/labs/g7-nets.html",
   "glyph": "<path d=\"M26 10 H50 V36 H26 Z M26 36 H50 V58 H26 Z M2 36 H26 V58 H2 Z M50 36 H74 V58 H50 Z M26 58 H50 V72 H26 Z\"/>",
   "sceneTotal": 30,
   "tags": [
    "입체"
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
   "summary": "기둥·뿔·뿔대·구의 겉넓이와 부피를 정육면체 쌓기, 물 붓기, 단면으로 확인합니다.",
   "keywords": "겉넓이 부피 기둥 뿔 뿔대 원기둥 원뿔 구 반구 입체 단면 중1",
   "badge": "입체",
   "scenes": [
    "기둥의 겉넓이와 부피, 1 cm³ 정육면체 쌓기 (4종)",
    "뿔·뿔대의 겉넓이와 부피, 기둥과 뿔의 부피 비 3 : 1 (4종)",
    "구·반구의 겉넓이, 원뿔·구·원기둥의 부피 비 1 : 2 : 3 (4종)",
    "입체를 붙이거나 파낸 도형의 겉넓이·부피 (6종)"
   ],
   "legacy": "labs/g7/입체도형의 겉넓이와 부피.html",
   "next": "next/labs/g7-surface-volume.html",
   "glyph": "<path d=\"M22 24 L48 14 L72 28 L72 58 L48 68 L22 54 Z\"/><path d=\"M22 24 L48 38 L72 28 M48 38 L48 68\"/>",
   "tags": [
    "입체"
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
   "summary": "다면체와 회전체의 모양, 전개도, 회전체의 단면과 입체 위의 최단 경로를 한곳에서 살펴봅니다.",
   "keywords": "입체도형 종합 다면체 정다면체 회전체 회전축 겨냥도 전개도 단면 최단 경로 중1",
   "badge": "입체 종합",
   "scenes": [
    "다면체(기둥·뿔·뿔대)와 정다면체 (5종)",
    "정육면체·정팔면체·사각뿔의 전개도 접기 (5종)",
    "회전체 만들기와 회전체의 단면 (4종)",
    "회전체의 전개도와 옆면 위의 최단 경로 (4종)"
   ],
   "legacy": "labs/g7/다면체·회전체&겨냥도·전개도.html",
   "next": "next/labs/g7-solids.html",
   "glyph": "<ellipse cx=\"38\" cy=\"18\" rx=\"26\" ry=\"10\"/><path d=\"M12 18 V54 M64 18 V54\"/><path d=\"M12 54 A26 10 0 0 0 64 54 M12 54 A26 10 0 0 1 64 54\" stroke-dasharray=\"4 4\"/>"
  },
  {
   "id": "g8-triangles",
   "course": "g8",
   "unit": "삼각형의 성질",
   "strand": "shape",
   "order": 1,
   "title": "삼각형의 성질 탐구",
   "short": "삼각형",
   "summary": "이등변삼각형, 삼각형의 합동 조건, 외심과 내심을 48개 장면에서 도형을 움직이며 확인합니다.",
   "keywords": "삼각형 이등변삼각형 합동 직각삼각형의 합동 조건 각의 이등분선 수직이등분선 외심 내심 무게중심 보조선 48장면 중2",
   "badge": "48장면",
   "scenes": [
    "이등변삼각형의 성질",
    "직각삼각형의 합동 조건 (RHA, RHS)",
    "삼각형의 합동 조건 (SSS, SAS, ASA)",
    "각의 이등분선·수직이등분선의 성질",
    "삼각형의 외심과 수직이등분선",
    "삼각형의 내심과 내접원, 넓이",
    "외심·내심·무게중심의 위치 비교",
    "보조선을 그어 각의 크기 구하기"
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
   "title": "사각형의 성질 탐구",
   "short": "사각형",
   "summary": "평행사변형의 성질과 판별, 사각형 사이의 관계, 넓이가 같은 도형을 30개 장면에서 확인합니다.",
   "keywords": "사각형 평행사변형 직사각형 마름모 정사각형 등변사다리꼴 대각선 판별 넓이 중점 반례 종이 접기 30장면 중2",
   "badge": "30장면",
   "scenes": [
    "평행사변형의 성질과 판별 조건",
    "평행사변형에서 직사각형·마름모·정사각형으로, 등변사다리꼴",
    "넓이가 같은 도형 만들기, 평행사변형 안의 점 P",
    "사각형의 네 변의 중점을 이은 사각형",
    "종이 접기, 정사각형의 회전, 정사각형과 정삼각형",
    "판별 조건으로 부족한 경우와 반례"
   ],
   "legacy": "labs/g8/quadrilaterals-atlas.html",
   "next": "next/labs/g8-quadrilaterals.html",
   "glyph": "<path d=\"M10 24 L58 14 L74 58 L26 68 Z\"/><path d=\"M10 24 L74 58 M58 14 L26 68\"/><circle cx=\"42\" cy=\"41\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 30
  },
  {
   "id": "g8-similarity",
   "course": "g8",
   "unit": "도형의 닮음",
   "strand": "shape",
   "order": 3,
   "title": "도형의 닮음 탐구",
   "short": "닮음",
   "summary": "겹쳐진 삼각형에서 닮은 삼각형을 찾아 닮음비를 구하고, 평행선과 선분의 길이의 비, 무게중심을 31개 장면에서 확인합니다.",
   "keywords": "닮음 닮음비 닮음 조건 삼각형 평행선 선분의 길이의 비 각의 이등분선 중점 무게중심 넓이의 비 부피의 비 31장면 중2",
   "badge": "31장면",
   "scenes": [
    "겹쳐진 삼각형·뒤집힌 삼각형의 닮음 조건",
    "평행선과 선분의 길이의 비, 각의 이등분선",
    "직각삼각형에서 빗변에 내린 수선과 닮음",
    "삼각형의 두 변의 중점을 이은 선분, 무게중심",
    "종이 접기와 사각형 속의 닮은 삼각형",
    "닮음비와 넓이의 비·부피의 비, 원뿔의 평행 단면"
   ],
   "legacy": "labs/g8/similarity-atlas.html",
   "next": "next/labs/g8-similarity.html",
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
   "summary": "직각삼각형의 세 변 사이의 관계가 성립하는 이유와 활용 문제를 직접 움직이며 탐구합니다.",
   "keywords": "피타고라스 정리 직각삼각형 피타고라스 수 예각 직각 둔각 정사각형 넓이 초승달 모양 수선 종이 접기 최단 거리 중2",
   "badge": "탐구",
   "scenes": [
    "세 정사각형의 넓이 (a²+b²=c²)",
    "피타고라스 정리가 성립하는 이유 (넓이로 설명)",
    "피타고라스 수와 그 배수",
    "삼각형이 예각·직각·둔각인지 판별하기",
    "두 선분의 길이의 제곱의 합이 같아지는 경우 (대각선이 수직인 사각형 등)",
    "세 변 위의 정삼각형·반원의 넓이, 초승달 모양",
    "빗변에 내린 수선과 선분의 길이의 관계 (AB²=BH·BC 등)",
    "종이 접기와 최단 거리"
   ],
   "legacy": "labs/g8/피타고라스.html",
   "next": "next/labs/g8-pythagoras.html",
   "glyph": "<path d=\"M12 64 L12 16 L60 64 Z\"/><path d=\"M12 16 L12 16 M12 16 L22 16 L22 26 L12 26\"/> <path d=\"M12 64 L12 54 L22 54\" stroke-dasharray=\"3 3\"/>",
   "sceneTotal": 40
  },
  {
   "id": "g9-trig-ratio",
   "course": "g9",
   "unit": "삼각비",
   "strand": "trig",
   "order": 1,
   "title": "삼각비",
   "short": "삼각비",
   "summary": "직각삼각형에서 sin·cos·tan의 값이 각의 크기에 따라 어떻게 변하는지 직접 움직여 확인합니다.",
   "keywords": "삼각비 sin cos tan 사인 코사인 탄젠트 직각삼각형 30° 45° 60° 사분원 높이 측량 삼각형의 넓이 중3",
   "badge": "탐구",
   "scenes": [
    "삼각비의 뜻, 기준이 되는 각이 바뀔 때",
    "30°·45°·60°의 삼각비, 직선의 기울기와 tan",
    "반지름이 1인 사분원에서 삼각비의 크기 비교",
    "직각삼각형의 변의 길이, 높이와 거리 재기",
    "예각·둔각삼각형의 변의 길이 (수선으로 직각삼각형 만들기)",
    "삼각형의 높이 구하기 (tan x, tan y 이용)",
    "삼각형의 넓이, 각의 이등분선의 길이",
    "평행사변형과 사각형의 넓이 (대각선과 사잇각)"
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
   "summary": "원의 현, 접선, 원주각과 중심각, 원에 내접하는 사각형, 접선과 현이 이루는 각을 직접 움직이며 탐구합니다.",
   "keywords": "원의 성질 현 접선 할선 원주각 중심각 내접사각형 외접사각형 접선과 현이 이루는 각 공통접선 중3",
   "badge": "탐구",
   "scenes": [
    "원의 현의 성질, 원을 접어 중심 찾기",
    "원의 접선, 삼각형의 내접원, 원에 외접하는 사각형",
    "원주각과 중심각, 반원에 대한 원주각 90°",
    "원에 내접하는 사각형 (대각의 합 180°, 한 외각)",
    "접선과 현이 이루는 각 (∠BAT=∠BCA), 두 원의 공통접선",
    "원의 두 현·두 할선·접선과 할선의 길이 관계, 반례"
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
   "summary": "이차함수 그래프의 꼭짓점·축, 판별식과 직선과의 위치 관계, 최댓값·최솟값을 직접 움직여 탐구합니다.",
   "keywords": "이차함수 포물선 꼭짓점 축 판별식 이차방정식 실근 이차부등식 최댓값 최솟값 절댓값 그래프 직선과의 위치 관계 공통수학 함수",
   "badge": "함수",
   "scenes": [
    "이차함수의 그래프와 직선의 위치 관계, 교점과 실근",
    "축이 움직일 때 구간에서의 최댓값·최솟값",
    "절댓값이 있는 그래프와 실근의 개수",
    "이차방정식의 실근의 위치 (판별식·축·함숫값)",
    "모든 x에서 성립하는 이차부등식, x의 범위가 제한된 경우",
    "자주 틀리는 조건 (이차식인지 확인, ‘모든 x’의 뜻)"
   ],
   "legacy": "labs/공통수학/이차함수.html",
   "next": "next/labs/common-quadratic.html",
   "glyph": "<path d=\"M8 68 Q40 8 72 68\"/><line x1=\"40\" y1=\"8\" x2=\"40\" y2=\"70\" stroke-dasharray=\"3 3\"/><circle cx=\"40\" cy=\"24\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 30
  },
  {
   "id": "common-lines",
   "course": "common",
   "unit": "도형의 방정식",
   "strand": "coord",
   "order": 2,
   "title": "평면좌표 · 직선 · 도형의 이동",
   "short": "직선·이동",
   "summary": "두 점 사이의 거리와 내분점, 직선의 방정식, 점과 직선 사이의 거리, 평행이동과 대칭이동을 직접 움직여 확인합니다.",
   "keywords": "평면좌표 두 점 사이의 거리 내분점 직선의 방정식 수직 점과 직선 사이의 거리 평행이동 대칭이동 도형의 이동 최단 거리 공통수학",
   "badge": "도형의 이동",
   "scenes": [
    "선분의 내분점과 연장선 위의 점, 중선과 변의 길이의 관계",
    "k의 값에 관계없이 지나는 점, 두 직선의 수직 조건 (mm′=-1)",
    "점과 직선 사이의 거리, 좌표로 삼각형의 넓이 구하기",
    "평행이동·대칭이동에서 점과 도형의 식이 바뀌는 방법",
    "대칭이동을 이용한 최단 거리 (빛의 반사)",
    "두 점까지의 거리의 비가 일정한 점의 자취, 직선의 방정식 응용"
   ],
   "legacy": "labs/공통수학/평면·직선·이동.html",
   "next": "next/labs/common-lines.html",
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
   "summary": "원의 방정식의 표준형·일반형, 원과 직선·두 원의 위치 관계, 접선의 방정식을 직접 움직여 탐구합니다.",
   "keywords": "원의 방정식 표준형 일반형 중심 반지름 원과 직선 현의 길이 두 원 공통현 접선의 방정식 공통접선 자취 도형의 방정식 공통수학",
   "badge": "도형의 방정식",
   "scenes": [
    "원의 방정식의 표준형, 지름이 주어진 원, 세 점을 지나는 원",
    "x축·y축에 접하는 원 (반지름과 중심 좌표의 부호)",
    "두 점까지의 거리의 비가 일정한 점의 자취",
    "원과 직선의 위치 관계와 현의 길이",
    "두 원의 위치 관계, 두 원의 교점을 지나는 직선과 원",
    "원의 접선의 방정식 (기울기, 접점, 원 밖의 점이 주어질 때)",
    "두 원의 공통접선의 길이, 두 접점을 지나는 직선",
    "응용: 원 위의 점에서의 최솟값, 넓이를 이등분하는 직선, 반사"
   ],
   "legacy": "labs/공통수학/원의 방정식.html",
   "next": "next/labs/common-circle-eq.html",
   "glyph": "<circle cx=\"40\" cy=\"42\" r=\"24\"/><line x1=\"8\" y1=\"42\" x2=\"72\" y2=\"42\" stroke-dasharray=\"3 3\"/><line x1=\"40\" y1=\"8\" x2=\"40\" y2=\"72\" stroke-dasharray=\"3 3\"/><circle cx=\"40\" cy=\"42\" r=\"3\" fill=\"currentColor\" stroke=\"none\"/>",
   "sceneTotal": 32
  },
  {
   "id": "common-functions",
   "course": "common",
   "unit": "함수와 그래프",
   "strand": "func",
   "order": 4,
   "title": "합성함수 · 유리함수 · 무리함수",
   "short": "유리·무리함수",
   "summary": "합성함수와 역함수, 유리함수·무리함수의 그래프를 움직이며 점근선, 대칭, 직선과의 교점을 탐구합니다.",
   "keywords": "합성함수 역함수 유리함수 무리함수 점근선 그래프 대칭 직선과의 교점 일대일대응 공통수학 함수",
   "badge": "함수",
   "scenes": [
    "합성함수와 역함수",
    "유리함수의 그래프",
    "유리함수와 직선의 교점",
    "무리함수의 그래프"
   ],
   "legacy": "labs/공통수학/합성함수·유리함수·무리함수.html",
   "next": "next/labs/common-functions.html",
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
   "summary": "지수함수·로그함수의 그래프를 움직이며 평행이동, 대칭, 내분점과 닮음, 절댓값이 있는 그래프에서 변하지 않는 값을 관찰합니다.",
   "keywords": "대수 지수함수 로그함수 거듭제곱근 평행이동 역함수 대칭 절댓값 그래프 내분점 닮음 격자점 치환 지수·로그 함수",
   "badge": "지수·로그 함수",
   "scenes": [
    "거듭제곱근 중 실수인 것의 개수",
    "그래프의 평행이동, 선분의 길이와 넓이",
    "역함수의 그래프와 직선 y=x에 대한 대칭",
    "절댓값을 씌운 그래프와 교점의 x좌표의 곱",
    "내분점과 닮음비를 이용한 점의 좌표 구하기",
    "그래프의 기울기·넓이로 대소 비교 (ㄱ, ㄴ, ㄷ 판별 문제)",
    "격자점(x좌표, y좌표가 모두 정수인 점)의 개수",
    "치환하여 이차방정식으로 바꾸고 두 근의 조건 구하기"
   ],
   "legacy": "labs/대수/part1a.html",
   "next": "next/labs/alg-explog.html",
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
   "summary": "거듭제곱근 중 실수인 것, 상용로그의 정수 부분과 소수 부분, 지수함수의 그래프를 도형과 함께 살펴봅니다.",
   "keywords": "대수 거듭제곱근 상용로그 정수 부분 소수 부분 지수함수 그래프 내분점 등차수열 등비수열 치환 절댓값 지수함수 심화",
   "badge": "지수함수 심화",
   "scenes": [
    "거듭제곱근 중 실수인 것의 개수 (표로 정리)",
    "거듭제곱근이 자연수·유리수가 되는 조건과 약수",
    "상용로그의 정수 부분과 소수 부분의 그래프",
    "k·2ˣ의 그래프를 2ˣ의 평행이동으로 보기",
    "밑이 다른 두 지수함수와 수평선이 만나는 점의 내분",
    "x좌표가 등차수열이면 y좌표는 등비수열",
    "aˣ+a⁻ˣ=t (t≥2)로 치환하여 방정식 풀기",
    "|aˣ−k|=t의 해의 합 (점근선을 기준으로 접은 그래프)"
   ],
   "legacy": "labs/대수/part1a2.html",
   "next": "next/labs/alg-exp-deep.html",
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
   "summary": "로그함수의 그래프에서 길이와 넓이, 진수 조건, 지수함수와의 역함수 관계, 원과 도형이 만나는 문제를 탐구합니다.",
   "keywords": "대수 로그함수 진수 조건 역함수 그래프 세로 길이 넓이 절댓값 교점 대칭 원 격자점 로그함수와 역함수 도형",
   "badge": "로그함수",
   "scenes": [
    "로그함수의 그래프에서 세로 길이와 넓이",
    "진수 조건: log₂(x²)과 2log₂x의 그래프"
   ],
   "legacy": "labs/대수/part1b.html",
   "next": "next/labs/alg-log.html",
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
   "summary": "로그함수와 역함수의 그래프로 만든 직사각형·사다리꼴, 원과 관련된 문제 8가지를 탐구합니다.",
   "keywords": "대수 로그함수 역함수 진수 조건 절댓값 그래프 교점 직사각형 사다리꼴 원 격자점 대칭 로그 도형 심화",
   "badge": "로그 도형 심화",
   "scenes": [
    "로그함수의 그래프에서 세로 길이가 일정한 선분과 넓이",
    "진수 조건: log₂(x²)과 2log₂x의 그래프 비교",
    "y=|logₐ(x−p)|의 그래프와 직선의 교점의 x좌표의 곱",
    "역함수의 그래프와 직선 y=x에 대한 대칭",
    "y=x가 아닌 직선에 대하여 대칭인 지수·로그함수",
    "기울기가 ±1인 직선으로 만든 직사각형·사다리꼴의 넓이",
    "지수함수·로그함수의 그래프와 원이 만나는 점",
    "역함수로 가로·세로를 바꿔 격자점의 개수 세기"
   ],
   "legacy": "labs/대수/part1b1.html",
   "next": "next/labs/alg-log-deep.html",
   "glyph": "<path d=\"M7 68 L72 5\" stroke=\"#D8B77E\" stroke-dasharray=\"4 4\" stroke-width=\"1.6\"/><rect x=\"26\" y=\"24\" width=\"29\" height=\"27\" stroke=\"#A78AC8\" stroke-width=\"1.4\"/><path d=\"M10 64 Q23 41 46 34 T69 26\" stroke-width=\"2.2\"/><path d=\"M17 61 Q28 57 35 44 T65 13\" stroke=\"#D8B77E\" stroke-width=\"1.9\"/>"
  },
  {
   "id": "alg-unit-circle",
   "course": "algebra",
   "unit": "Ⅱ. 삼각함수",
   "strand": "trig",
   "order": 5,
   "title": "단위원과 삼각함수의 그래프",
   "short": "단위원·그래프",
   "summary": "단위원 위의 점을 움직이며 sin θ, cos θ, tan θ의 값과 삼각함수의 그래프를 함께 확인합니다.",
   "keywords": "대수 삼각함수 단위원 사인 코사인 탄젠트 삼각함수의 그래프 삼각방정식 삼각부등식 주기",
   "badge": "단위원·그래프",
   "scenes": [
    "단위원 위의 점의 좌표로 sin θ, cos θ 읽기",
    "단위원의 좌표가 삼각함수의 그래프로 이어지는 과정",
    "삼각방정식: 직선 y=k와 그래프의 교점",
    "삼각부등식: 그래프가 직선보다 위(아래)에 있는 x의 범위"
   ],
   "legacy": "labs/대수/단위원과그래프.html",
   "next": "next/labs/alg-unit-circle.html",
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
   "keywords": "대수 삼각함수 부채꼴 삼각방정식 삼각함수의 그래프 사인법칙 코사인법칙 외접원 내접사각형 기본 8문항 심화 8문항 16문항",
   "badge": "기본 8 · 심화 8",
   "scenes": [
    "둘레가 일정한 부채꼴의 넓이의 최댓값",
    "단위원 위의 점의 회전과 대칭, 직각삼각형의 합동",
    "y=sin 2x의 그래프와 직선의 교점의 대칭",
    "y=|3 sin x − 1|의 그래프와 직선의 교점의 개수"
   ],
   "legacy": "labs/대수/part2a.html",
   "next": "next/labs/alg-trig-geometry.html",
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
   "summary": "삼각형에 보조선을 그어 사인법칙·코사인법칙으로 변의 길이, 넓이, 외접원의 반지름을 구하는 문제를 직접 움직이며 탐구합니다.",
   "keywords": "대수 삼각함수 사인법칙 코사인법칙 삼각형 보조선 수선의 발 외접원 내접원 공통현 중선 넓이 높이",
   "badge": "사인·코사인법칙",
   "scenes": [
    "수선의 발을 내려 밑변의 길이와 넓이 구하기",
    "세 변의 길이로 높이와 넓이 구하기",
    "두 외접원이 공유하는 현(공통현)과 반지름",
    "외접원의 반지름의 비로 사인값 구하기"
   ],
   "legacy": "labs/대수/part2b.html",
   "next": "next/labs/alg-sine-cosine-law.html",
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
   "summary": "등차수열·등비수열을 함수의 그래프로 나타내 보고, 점화식으로 정의된 수열의 항을 그림으로 따라가며 규칙을 찾습니다.",
   "keywords": "대수 수열 등차수열 등비수열 일반항 등차중항 수열의 합 Σ 부분분수 점화식 절댓값 수열 그래프",
   "badge": "수열의 그래프",
   "scenes": [
    "등차수열의 일반항(직선 그래프)과 등차중항",
    "등차수열의 합 Sₙ의 그래프 (원점을 지나는 포물선)",
    "절댓값이 있는 수열의 합 Σ|aₖ|, |Sₙ|",
    "Sₙ에 상수항이 있을 때 a₁이 규칙에서 벗어나는 경우",
    "등비수열의 합을 구간별로 나누어 비교하기",
    "부분분수로 나누어 항이 차례로 없어지는 합",
    "점화식으로 정의된 수열이 같은 값을 되풀이하는 규칙",
    "점화식을 거꾸로 따라가며 가능한 a₁의 값 모두 찾기"
   ],
   "legacy": "labs/대수/part3.html",
   "next": "next/labs/alg-sequence.html",
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
   "summary": "좌극한·우극한, 극한값의 계산, 함수의 연속과 불연속, 사잇값 정리를 그래프에서 직접 움직여 탐구합니다.",
   "keywords": "함수의 극한 연속 불연속 수렴 발산 좌극한 우극한 0/0 꼴 사잇값 정리 미적분1 극한 연속",
   "badge": "극한·연속",
   "scenes": [
    "좌극한·우극한과 함수의 연속 판정",
    "0/0 꼴의 극한값 구하기 (분모와 분자가 모두 0에 가까워질 때)",
    "두 함수의 곱 f(x)g(x)의 연속",
    "교점의 개수를 나타내는 함수 g(t)의 극한과 연속",
    "사잇값 정리와 방정식의 실근의 존재"
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
   "summary": "평균변화율이 미분계수로 가까워지는 과정, 접선의 방정식, 좌미분계수·우미분계수, 공통접선을 직접 움직여 탐구합니다.",
   "keywords": "접선 미분계수 평균변화율 순간변화율 기울기 극한 롤의 정리 평균값 정리 좌미분계수 우미분계수 미분가능성 법선 공통접선 미적분1 미분",
   "badge": "미분",
   "scenes": [
    "평균변화율에서 미분계수(접선의 기울기)로",
    "롤의 정리와 평균값 정리",
    "좌미분계수·우미분계수와 미분가능성",
    "접선에 수직인 직선(법선)과 최단 거리",
    "두 곡선에 공통으로 접하는 직선"
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
   "title": "함수와 도함수의 그래프",
   "short": "도함수와 그래프",
   "summary": "함수 f(x)의 그래프와 도함수 f′(x)의 그래프가 서로 어떻게 대응하는지 증가·감소와 극값으로 탐구합니다.",
   "keywords": "도함수 그래프 증가 감소 극댓값 극솟값 증감표 그래프의 개형 삼차함수 사차함수 실근의 개수 정적분으로 정의된 함수 미적분1 미분",
   "badge": "미분",
   "scenes": [
    "삼차함수의 그래프의 개형과 증감표",
    "도함수의 그래프로 사차함수의 그래프의 개형 그리기",
    "극값의 부호와 방정식 f(x)=0의 실근의 개수",
    "도함수의 그래프에서 f(x)−g(x)의 그래프 알아내기",
    "정적분으로 정의된 함수 g(x)=∫ₐˣ f(t)dt의 그래프"
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
   "title": "삼차함수의 비율 관계",
   "short": "삼차함수 비율",
   "summary": "삼차함수의 그래프에서 극대인 점·극소인 점·점대칭의 중심 사이의 길이와 넓이의 비에서 규칙을 찾습니다.",
   "keywords": "삼차함수 비율 극대 극소 점대칭 접선 넓이 도함수 접선의 개수 미적분1 다항함수",
   "badge": "다항함수",
   "scenes": [
    "극대·극소인 점에서 그은 수평 접선이 곡선과 다시 만나는 점",
    "곡선 위의 점에서 그은 접선이 곡선과 다시 만나는 점 (비 2 : 1)",
    "접선과 곡선으로 둘러싸인 넓이, 점대칭의 중심을 지나는 수평선이 나눈 넓이",
    "도함수의 그래프와 x축 사이의 넓이와 극댓값·극솟값의 차",
    "곡선 밖의 한 점에서 그을 수 있는 접선의 개수 (1, 2, 3개)"
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
   "title": "사차함수의 비율 관계",
   "short": "사차함수 비율",
   "summary": "사차함수의 그래프에서 극값을 갖는 점과 접선이 만드는 길이·넓이의 비에서 규칙을 찾습니다.",
   "keywords": "사차함수 비율 극대 극소 삼중근 대칭 접선 넓이 도함수 미분가능성 절댓값 미적분1 다항함수",
   "badge": "다항함수",
   "scenes": [
    "삼중근을 갖는 사차함수에서 극소점의 위치 비 3 : 1",
    "대칭인 W 모양 사차함수: 극대점의 수평 접선과 만나는 점 (비 1 : √2)",
    "수평 접선과 사차함수의 그래프로 둘러싸인 넓이",
    "도함수의 그래프에서 두 부분의 넓이의 차와 극솟값의 차",
    "y=|f(x)−k|가 미분가능하지 않은 점의 개수"
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
   "summary": "절댓값을 씌운 함수와 합성함수의 그래프를 움직이며 교점의 개수, 극값, 미분가능성을 탐구합니다.",
   "keywords": "합성함수 절댓값 그래프 교점의 개수 극값 미분가능성 치환 방정식 미적분1 함수",
   "badge": "함수",
   "scenes": [
    "절댓값을 씌운 네 가지 그래프 (y=|f(x)|, y=f(|x|) 등)",
    "방정식 |f(x)−t|=k의 실근(교점)의 개수",
    "|f(x)|g(x)가 미분가능하기 위한 조건",
    "합성함수 f(g(x))의 극값",
    "방정식 f(g(x))=k: g(x)=t로 치환하여 두 단계로 풀기"
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
   "summary": "직사각형으로 넓이를 근사하는 과정에서 정적분의 뜻을 이해하고, 곡선으로 둘러싸인 부분의 넓이를 구합니다.",
   "keywords": "정적분 넓이 근사 직사각형 포물선과 직선으로 둘러싸인 넓이 두 곡선 사이의 넓이 역함수 부정적분 미적분1 적분",
   "badge": "적분",
   "scenes": [
    "정적분의 값과 곡선이 만드는 넓이의 차이",
    "포물선과 직선으로 둘러싸인 넓이, 넓이를 이등분하는 직선",
    "삼차함수의 그래프에서 두 부분의 넓이가 같을 조건 (S₁=S₂)",
    "두 곡선 사이의 넓이와 f(x)−g(x)의 그래프",
    "역함수의 그래프로 둘러싸인 넓이를 정적분으로 구하기"
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
   "summary": "위치 x(t), 속도 v(t), 가속도 a(t)와 움직인 거리 사이의 관계를 그래프로 확인합니다.",
   "keywords": "속도 가속도 이동거리 움직인 거리 위치 속력 위치의 변화량 미분 적분 수직선 위의 점의 운동 미적분1 응용",
   "badge": "응용",
   "scenes": [
    "위치의 변화량과 움직인 거리의 차이",
    "운동 방향이 바뀌는 순간 (속도가 0일 때)",
    "원점으로 되돌아오는 순간, 속력이 가장 큰 순간",
    "두 점 P, Q가 만나는 순간과 두 점 사이의 거리",
    "x(t)의 그래프와 v(t)의 그래프 구별하기"
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
   "summary": "포물선의 정의(초점과 준선), 표준형, 초점을 지나는 현, 접선의 성질을 직접 움직여 탐구합니다.",
   "keywords": "포물선 초점 준선 정의 표준형 초점을 지나는 현 접선 꼭짓점 이차곡선 기하",
   "badge": "이차곡선",
   "scenes": [
    "포물선의 정의, 정삼각형이 되는 경우, 거리의 합의 최솟값",
    "초점을 지나는 현이 나뉜 두 길이 a, b의 관계 (1/a+1/b=1/p)",
    "초점을 지나는 현을 지름으로 하는 원, 준선 위의 두 접선",
    "접선과 초점·준선이 이루는 마름모, 닮은 직각삼각형"
   ],
   "legacy": "labs/기하와벡터/포물선.html",
   "next": "next/labs/geom-parabola.html",
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
   "summary": "타원의 정의(두 초점), 표준형, 장축·단축, 이심률, 접선의 성질을 직접 움직여 탐구합니다.",
   "keywords": "타원 초점 장축 단축 이심률 정의 표준형 접선 법선 이차곡선 기하",
   "badge": "이차곡선",
   "scenes": [
    "타원의 정의, 두 초점과 타원 위의 점이 이루는 삼각형",
    "장축을 지름으로 하는 원과 타원, 접선의 x절편",
    "접선에 대한 한 초점의 대칭점, 두 초점에서 접선까지 거리의 곱",
    "접점에서 두 초점을 본 각의 이등분선, 수직인 두 접선의 교점의 자취"
   ],
   "legacy": "labs/기하와벡터/타원.html",
   "next": "next/labs/geom-ellipse.html",
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
   "summary": "쌍곡선의 정의(두 초점까지의 거리의 차), 표준형, 점근선, 이심률, 접선의 성질을 직접 움직여 탐구합니다.",
   "keywords": "쌍곡선 점근선 초점 이심률 정의 표준형 접선 이차곡선 기하",
   "badge": "이차곡선",
   "scenes": [
    "쌍곡선의 정의 |PF′−PF|=2a, 초점과 P가 이루는 삼각형",
    "점근선과 초점에서 점근선에 내린 수선 (길이 b)",
    "쌍곡선 위의 점에서 두 점근선에 내린 수선의 길이의 곱",
    "접점에서 두 초점을 본 각의 이등분선, 초점에서 접선까지 거리의 곱"
   ],
   "legacy": "labs/기하와벡터/쌍곡선.html",
   "next": "next/labs/geom-hyperbola.html",
   "glyph": "<path d=\"M8 68 Q14 38 28 18\"/><path d=\"M52 18 Q66 38 72 68\"/><line x1=\"8\" y1=\"8\" x2=\"72\" y2=\"68\" stroke-dasharray=\"3 3\"/><line x1=\"72\" y1=\"8\" x2=\"8\" y2=\"68\" stroke-dasharray=\"3 3\"/>"
  },
  {
   "id": "geom-space",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 4,
   "title": "공간도형",
   "short": "공간도형",
   "summary": "공간에서 직선과 평면의 위치 관계, 삼수선의 정리, 이면각을 돌려 보며 확인합니다.",
   "keywords": "공간도형 직선 평면 꼬인 위치 삼수선의 정리 이면각 정사면체 직육면체 대각선 입체 기하",
   "badge": "입체",
   "scenes": [
    "꼬인 위치에 있는 두 직선이 이루는 각, 정사면체",
    "삼수선의 정리",
    "두 평면이 이루는 각(이면각)과 정사면체 (cos θ=1/3)",
    "직육면체의 대각선이 밑면·모서리와 이루는 각"
   ],
   "legacy": "labs/기하와벡터/공간도형 3D.html",
   "glyph": "<path d=\"M40 8 L70 28 L60 62 L20 70 L8 36 Z\"/><path d=\"M40 8 L38 40 L70 28 M38 40 L8 36 M38 40 L20 70 M38 40 L60 62\"/>",
   "next": "next/labs/geom-space-3d.html",
   "tags": [
    "입체"
   ]
  },
  {
   "id": "geom-projection",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 5,
   "title": "정사영",
   "short": "정사영",
   "summary": "도형의 정사영의 넓이 S′=S cos θ를 입체 그림으로 확인합니다.",
   "keywords": "정사영 넓이 코사인 이면각 투영 원기둥 단면 타원 정육면체 단면 입체 기하",
   "badge": "입체",
   "scenes": [
    "정사영의 넓이 (S′=S cos θ)",
    "정사영을 이용해 원기둥의 비스듬한 단면(타원)의 넓이 구하기",
    "정육면체의 단면과 밑면이 이루는 각",
    "비스듬히 비치는 햇빛이 만드는 그림자의 넓이"
   ],
   "legacy": "labs/기하와벡터/정사영 3D.html",
   "next": "next/labs/geom-projection.html",
   "glyph": "<path d=\"M8 62 L48 14 L72 48 L32 70 Z\" stroke-dasharray=\"0\"/><path d=\"M8 62 L48 62 L72 62\" stroke-dasharray=\"4 3\"/><path d=\"M48 14 L48 62\" stroke-dasharray=\"3 3\"/>",
   "tags": [
    "입체"
   ]
  },
  {
   "id": "geom-space-coord",
   "course": "geom",
   "unit": "공간도형과 공간좌표",
   "strand": "space",
   "order": 6,
   "title": "공간좌표",
   "short": "공간좌표",
   "summary": "공간좌표, 두 점 사이의 거리, 선분의 내분점, 구의 방정식을 입체 그림으로 탐구합니다.",
   "keywords": "공간좌표 점 사이의 거리 중점 내분점 구의 방정식 수선의 발 대칭이동 접선의 길이 입체 기하",
   "badge": "입체",
   "scenes": [
    "수선의 발의 좌표, 대칭이동을 이용한 최단 거리",
    "선분의 내분점과 평면 위의 점 (z좌표의 절댓값의 비)",
    "구와 평면이 만나서 생기는 원 (반지름² = R²−d²)",
    "구 밖의 점에서 구 위의 점까지 거리의 최대·최소, 접선의 길이"
   ],
   "legacy": "labs/기하와벡터/공간좌표_3D.html",
   "next": "next/labs/geom-space-coord.html",
   "glyph": "<line x1=\"40\" y1=\"68\" x2=\"40\" y2=\"8\"/><line x1=\"8\" y1=\"50\" x2=\"72\" y2=\"50\"/><line x1=\"14\" y1=\"20\" x2=\"66\" y2=\"62\"/> <circle cx=\"52\" cy=\"28\" r=\"4\" fill=\"currentColor\" stroke=\"none\"/>",
   "tags": [
    "입체"
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
   "summary": "벡터의 덧셈과 뺄셈을 평행사변형과 삼각형으로 나타내고, 점을 움직이며 합과 차를 확인합니다.",
   "keywords": "벡터 덧셈 뺄셈 평행사변형 삼각형 시점 종점 중점 영벡터 일차결합 무게중심 넓이의 비 기하",
   "badge": "벡터",
   "scenes": [
    "벡터의 덧셈 (평행사변형·삼각형·중점)",
    "벡터의 뺄셈, 시점을 같게 하여 나타내기 (종점 − 시점)",
    "원의 중심을 거쳐 벡터를 나누어 나타내기",
    "세 벡터의 합이 영벡터일 때 삼각형의 넓이의 비 (a : b : c)"
   ],
   "legacy": "labs/기하와벡터/벡터의덧셈과뺄셈.html",
   "next": "next/labs/geom-vector-ops.html",
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
   "summary": "벡터의 성분, 내적과 두 벡터가 이루는 각, 정사영과 내적의 관계를 직접 움직여 탐구합니다.",
   "keywords": "벡터 성분 내적 사잇각 수직 정사영 중점 원 위의 점 최댓값 최솟값 기하",
   "badge": "벡터",
   "scenes": [
    "내적을 정사영으로 보기 (밑변의 길이 × 정사영의 길이)",
    "성분으로 나타낸 벡터의 내적, 이루는 각, 수직 조건",
    "원 위의 점 P가 움직일 때 내적의 최댓값·최솟값",
    "선분 AB의 중점 M에 대하여 내적 PA·PB를 PM으로 나타내기"
   ],
   "legacy": "labs/기하와벡터/벡터의 성분·내적.html",
   "next": "next/labs/geom-vector-dot.html",
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
   "summary": "위치벡터를 이용해 직선, 선분의 내분점·외분점, 삼각형의 내부, 원을 벡터로 나타내 봅니다.",
   "keywords": "벡터 도형 직선의 방정식 내분점 외분점 위치벡터 방향벡터 법선벡터 원의 방정식 자취 넓이 기하",
   "badge": "벡터",
   "scenes": [
    "내분점·외분점의 위치벡터, 세 점이 한 직선 위에 있을 조건",
    "OP=m·OA+n·OB, m+n=k일 때 점 P의 자취와 넓이",
    "방향벡터와 법선벡터로 나타낸 직선의 방정식",
    "벡터로 나타낸 원의 방정식 (지름의 양 끝점, 접선)"
   ],
   "legacy": "labs/기하와벡터/벡터로 나타낸 도형.html",
   "next": "next/labs/geom-vector-figure.html",
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
   "name": "도형 노선",
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
   "name": "삼각 노선",
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
   "name": "원·곡선 노선",
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
   "name": "공간 노선",
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
   "name": "좌표·벡터 노선",
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
   "name": "함수 노선",
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
   "name": "미적분 노선",
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
   "name": "수열 노선",
   "hue": "green",
   "stations": [
    "alg-sequence"
   ]
  }
 ]
};
