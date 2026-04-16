window.questionBank = [
  {
    id: 14,
    level: "상",
    category: "같은 것이 있는 순열",
    originalCategory: "같은 것이 있는 순열",
    standardCourse: "확률과 통계",
    standardUnitKey: "STAT-02",
    standardUnit: "순열과 조합",
    standardUnitOrder: 2,
    content: "아래의 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단거리로 갈 때, P지점을 거치지 않고 가는 경우의 수는? (단, 그림에서 비어있는 영역에는 도로가 없다.) [4.4점]\n<svg width='320' height='160' viewBox='-20 -20 340 180' style='display:block; margin: 10px auto;'><path d='M0,0 H200 M250,0 H300 M0,40 H300 M0,80 H300 M0,120 H300 M0,0 V120 M50,0 V80 M100,0 V120 M150,0 V120 M200,0 V40 M200,80 V120 M250,0 V120 M300,0 V120' fill='none' stroke='#333' stroke-width='1.5'/><rect x='45' y='85' width='10' height='30' fill='#fff' stroke='none'/><rect x='195' y='45' width='10' height='30' fill='#fff' stroke='none'/><rect x='245' y='5' width='10' height='30' fill='#fff' stroke='none'/><circle cx='0' cy='0' r='4' fill='red'/><text x='-15' y='-5' font-size='14' font-weight='bold'>A</text><circle cx='200' cy='40' r='5' fill='blue'/><text x='208' y='35' font-size='14' font-weight='bold'>P</text><circle cx='300' cy='120' r='4' fill='red'/><text x='305' y='135' font-size='14' font-weight='bold'>B</text></svg>",
    choices: ["① 28", "② 29", "③ 30", "④ 31", "⑤ 32"],
    answer: "5",
    solution: "[풀이]\n지점 A를 원점 $(0,0)$으로 할 때, 도로망의 소실 구간과 지점 위치는 다음과 같음\n- 지점: $A(0,0)$, $P(4,-1)$, $B(6,-3)$\n- 소실 구간: $(1,-2) \\sim (1,-3)$, $(4,-1) \\sim (4,-2)$, $(5,0) \\sim (5,-1)$\n\n1) A에서 B까지의 전체 최단 경로의 수:\n\\rightarrow \\text{격자점의 숫자를 적어 경로를 합산하면 (합의 법칙)}\n\\rightarrow N(\\text{전체}) = 62\n\n2) P지점을 거쳐가는 최단 경로의 수:\n\\rightarrow (A \\rightarrow P): \\text{가로 4칸, 세로 1칸의 경로 } \\rightarrow \\frac{5!}{4!1!} = 5\n\\rightarrow (P \\rightarrow B): \\text{가로 2칸, 세로 2칸의 경로 } \\rightarrow \\frac{4!}{2!2!} = 6\n\\rightarrow N(P) = 5 \\times 6 = 30\n\n3) P지점을 거치지 않고 가는 최단 경로의 수:\n\\rightarrow N(\\text{전체}) - N(P) = 62 - 30 = 32\n---\n[결론]\n정답: 5"
  }
];