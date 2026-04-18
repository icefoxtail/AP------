window.questionBank = [
 // 12번 문항: 수직선 정밀도 개선 및 -5~+5 눈금/정수 라벨 추가
{
    id: 14,
    level: "상",
    category: "같은 것이 있는 순열",
    originalCategory: "같은 것이 있는 순열",
    standardCourse: "확률과 통계",
    standardUnitKey: "STAT-02",
    standardUnit: "순열과 조합",
    standardUnitOrder: 2,
    content: "아래의 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단거리로 갈 때, P지점을 거치지 않고 가는 경우의 수는? [4.4점]\n<svg width='240' height='160' viewBox='0 0 240 160' xmlns='http://www.w3.org/2000/svg' style='display:block; margin: 10px auto;'>\n  <line x1='20' y1='20' x2='220' y2='20' stroke='black' stroke-width='1'/>\n  <line x1='20' y1='60' x2='220' y2='60' stroke='black' stroke-width='1'/>\n  <line x1='20' y1='100' x2='220' y2='100' stroke='black' stroke-width='1'/>\n  <line x1='20' y1='140' x2='220' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='20' y1='20' x2='20' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='60' y1='20' x2='60' y2='100' stroke='black' stroke-width='1'/>\n  <line x1='60' y1='100' x2='60' y2='140' stroke='red' stroke-width='2' stroke-dasharray='4,2'/>\n  <line x1='100' y1='20' x2='100' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='140' y1='20' x2='140' y2='60' stroke='black' stroke-width='1'/>\n  <line x1='140' y1='60' x2='140' y2='100' stroke='red' stroke-width='2' stroke-dasharray='4,2'/>\n  <line x1='140' y1='100' x2='140' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='180' y1='20' x2='180' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='220' y1='60' x2='220' y2='140' stroke='black' stroke-width='1'/>\n  <line x1='220' y1='20' x2='220' y2='60' stroke='red' stroke-width='2' stroke-dasharray='4,2'/>\n  <circle cx='20' cy='20' r='3' fill='black'/><text x='10' y='15' font-size='12'>A</text>\n  <circle cx='220' cy='140' r='3' fill='black'/><text x='225' y='150' font-size='12'>B</text>\n  <circle cx='140' cy='60' r='4' fill='blue'/><text x='145' y='55' font-size='12' fill='blue'>P</text>\n</svg>",
    choices: ["28", "29", "30", "31", "32"],
    answer: "⑤",
    solution: "A에서 B까지 가는 전체 최단 경로의 수에서 P를 거쳐 가는 최단 경로의 수를 뺀다. 주어진 도로망은 가로 5칸, 세로 3칸으로 구성되어 있다.\n전체 경로의 수: 가로 5칸, 세로 3칸이므로 $\\frac{8!}{5!3!} = {}_{8}C_3 = 56$가지이다.\nA에서 P까지 가는 경로: 가로 3칸, 세로 1칸이므로 $\\frac{4!}{3!1!} = {}_4C_1 = 4$가지이다.\nP에서 B까지 가는 경로: 가로 2칸, 세로 2칸이므로 $\\frac{4!}{2!2!} = {}_4C_2 = 6$가지이다.\nP를 거치는 경로의 수: $4 \\times 6 = 24$가지이다.\n따라서 P를 거치지 않고 가는 경로의 수는 $56 - 24 = 32$가지이다."
  },
  {
    id: 22,
    level: "상",
    category: "원순열",
    originalCategory: "원순열",
    standardCourse: "확률과 통계",
    standardUnitKey: "STAT-02",
    standardUnit: "순열과 조합",
    standardUnitOrder: 2,
    content: "1학년 학생 2명, 2학년 학생 3명, 3학년 학생 3명이 일정한 간격을 두고 원 모양의 탁자에 다음 조건을 만족시키도록 모두 둘러앉는 경우의 수를 구하시오. (단, 회전하여 일치하는 것은 같은 것으로 본다.) [4.8점]\n<svg width='180' height='180' viewBox='0 0 200 200' style='display:block; margin: 10px auto;'>\n  <circle cx='100' cy='100' r='70' stroke='black' stroke-width='2' fill='none'/>\n  <circle cx='170' cy='100' r='5' fill='black'/><circle cx='149' cy='149' r='5' fill='black'/>\n  <circle cx='100' cy='170' r='5' fill='black'/><circle cx='51' cy='149' r='5' fill='black'/>\n  <circle cx='30' cy='100' r='5' fill='black'/><circle cx='51' cy='51' r='5' fill='black'/>\n  <circle cx='100' cy='30' r='5' fill='black'/><circle cx='149' cy='51' r='5' fill='black'/>\n</svg>\n<조 건>\n(가) 같은 학년 학생끼리는 서로 이웃하여 앉지 않는다.\n(나) 같은 학년 학생끼리는 서로 마주보고 앉지 않는다.",
    choices: ["72", "144", "288", "360", "720"],
    answer: "②",
    solution: "[풀이] 수식 중심 전개\n1) 3학년 3명을 배치하는 패턴 (이웃X, 마주보기X): $\\rightarrow (3-1)! = 2$가지\n2) 남은 5자리에 1, 2학년을 배치하는 경우의 수: $\\rightarrow 3! \\times 2! = 12$가지\n3) 전체 유효 패턴 조합에 따른 계산: $\\rightarrow 6 \\times 2 \\times 12 = 144$\n---\n[결론] 정답: 144이다."
  },
  {
    id: 23,
    level: "중",
    category: "원순열",
    originalCategory: "원순열",
    standardCourse: "확률과 통계",
    standardUnitKey: "STAT-02",
    standardUnit: "순열과 조합",
    standardUnitOrder: 2,
    content: "아래의 그림과 같이 밑면이 정사각형이고 옆면이 모두 합동인 사각뿔의 5개의 면에 서로 다른 6가지 색 중 5가지 색을 사용하여 칠하는 경우의 수를 구하고, 그 과정을 함께 서술하시오. (단, 한 면에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) [4점]\n<svg width='150' height='150' viewBox='0 0 150 150' style='display:block; margin: 10px auto;'>\n  <line x1='75' y1='20' x2='30' y2='100' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='120' y2='100' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='140' y2='80' stroke='black' stroke-width='1.5'/>\n  <line x1='75' y1='20' x2='50' y2='80' stroke='gray' stroke-width='1' stroke-dasharray='4,2'/>\n  <polyline points='30,100 120,100 140,80' fill='none' stroke='black' stroke-width='1.5'/>\n  <polyline points='30,100 50,80 140,80' fill='none' stroke='gray' stroke-width='1' stroke-dasharray='4,2'/>\n</svg>",
    choices: [" "],
    answer: "180",
    solution: "[풀이] 수식 중심 전개\n1) 6가지 색 중 5가지 색을 선택하는 경우: ${}_6C_5 = 6$\n2) 선택된 5색 중 밑면을 칠하는 경우: 5\n3) 옆면 4개를 칠하는 원순열의 수: $(4-1)! = 6$\n$\\therefore 6 \\times 5 \\times 6 = 180$\n---\n[결론] 정답: 180이다."
  },
  {
    id: 14,
    level: "상",
    category: "같은 것이 있는 순열",
    originalCategory: "같은 것이 있는 순열",
    standardCourse: "확률과 통계",
    standardUnitKey: "STAT-02",
    standardUnit: "순열과 조합",
    standardUnitOrder: 2,
    content: `아래의 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단거리로 갈 때, P지점을 거치지 않고 가는 경우의 수는? [4.4점]
<svg width="240" height="160" viewBox="0 0 240 160" xmlns="http://www.w3.org/2000/svg" style="display:block; margin:10px auto;">
  <line x1="20" y1="20" x2="220" y2="20" stroke="black" stroke-width="1"/>
  <line x1="20" y1="60" x2="220" y2="60" stroke="black" stroke-width="1"/>
  <line x1="20" y1="100" x2="220" y2="100" stroke="black" stroke-width="1"/>
  <line x1="20" y1="140" x2="220" y2="140" stroke="black" stroke-width="1"/>
  <line x1="20" y1="20" x2="20" y2="140" stroke="black" stroke-width="1"/>
  <line x1="60" y1="20" x2="60" y2="100" stroke="black" stroke-width="1"/> <line x1="100" y1="20" x2="100" y2="140" stroke="black" stroke-width="1"/>
  <line x1="140" y1="20" x2="140" y2="60" stroke="black" stroke-width="1"/> <line x1="140" y1="100" x2="140" y2="140" stroke="black" stroke-width="1"/>
  <line x1="180" y1="20" x2="180" y2="140" stroke="black" stroke-width="1"/>
  <line x1="220" y1="60" x2="220" y2="140" stroke="black" stroke-width="1"/> <circle cx="20" cy="20" r="3" fill="black"/><text x="10" y="15" font-size="12">A</text>
  <circle cx="220" cy="140" r="3" fill="black"/><text x="225" y="150" font-size="12">B</text>
  <circle cx="140" cy="60" r="4" fill="blue"/><text x="145" y="55" font-size="12" fill="blue">P</text>
</svg>`,
    choices: ["28", "29", "30", "31", "32"],
    answer: "⑤",
    solution: `A에서 B까지 가는 전체 최단 경로의 수에서 P를 거쳐 가는 최단 경로의 수를 뺀다. 주어진 도로망은 가로 5칸, 세로 3칸으로 구성되어 있다.
전체 경로의 수: 가로 5칸, 세로 3칸이므로 \\(\\frac{8!}{5!3!} = {}_{8}C_3 = 56\\)가지이다.
A에서 P까지 가는 경로: 가로 3칸, 세로 1칸이므로 \\(\\frac{4!}{3!1!} = {}_4C_1 = 4\\)가지이다.
P에서 B까지 가는 경로: 가로 2칸, 세로 2칸이므로 \\(\\frac{4!}{2!2!} = {}_4C_2 = 6\\)가지이다.
P를 거치는 경로의 수: \\(4 \\times 6 = 24\\)가지이다.
따라서 P를 거치지 않고 가는 경로의 수는 \\(56 - 24 = 32\\)가지이다.`
  },
];