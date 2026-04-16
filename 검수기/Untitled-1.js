// id: 1, 2, 14번 문항의 [도형필요] 태그를 SVG로 교체하고 해설을 수리적으로 재구성하였습니다.
window.questionBank = [
  {
    id: 1,
    level: "중",
    category: "원순열",
    content: "아래의 그림과 같이 정사각형을 4등분한 4개의 영역을 서로 다른 4가지 색을 모두 사용하여 칠하는 경우의 수를 구하면? (단, 각 영역에는 한 가지 색만 칠하고, 회전하여 일치하는 것은 같은 것으로 본다.) [3.2점]\n<svg width='100' height='100' viewBox='0 0 100 100' style='display:block; margin: 10px auto;'><rect x='10' y='10' width='80' height='80' fill='none' stroke='black' stroke-width='2'/><line x1='10' y1='50' x2='90' y2='50' stroke='black' stroke-width='2'/><line x1='50' y1='10' x2='50' y2='90' stroke='black' stroke-width='2'/></svg>",
    choices: ["① 6", "② 10", "③ 12", "④ 16", "⑤ 24"],
    answer: "1",
    solution: "[풀이]\n정사각형을 4등분한 영역을 색칠하는 것은 4개의 원소에 대한 원순열과 같음\n\\rightarrow (4-1)! = 3!\n\\rightarrow 3 \\times 2 \\times 1 = 6\n---\n[결론]\n정답: 1"
  },
  {
    id: 2,
    level: "상",
    category: "원순열",
    content: "아래 그림과 같이 정삼각형 모양의 탁자에 남자 2명과 여자 4명이 둘러앉을 때, 남자 2명이 탁자의 다른 모서리에 앉는 경우의 수를 구하면? (단, 회전하여 일치하는 것은 같은 것으로 본다.) [3.8점]\n<svg width='200' height='180' viewBox='0 0 200 180' style='display:block; margin: 10px auto;'><polygon points='100,20 20,160 180,160' fill='none' stroke='black' stroke-width='2'/><circle cx='55' cy='75' r='5' fill='gray'/><circle cx='75' cy='110' r='5' fill='gray'/><circle cx='145' cy='75' r='5' fill='gray'/><circle cx='125' cy='110' r='5' fill='gray'/><circle cx='75' cy='170' r='5' fill='gray'/><circle cx='125' cy='170' r='5' fill='gray'/></svg>",
    choices: ["① 48", "② 60", "③ 120", "④ 144", "⑤ 192"],
    answer: "5",
    solution: "[풀이]\n1) 전체 경우의 수: 6명을 정삼각형 탁자(회전 대칭성 3)에 배열\n\\rightarrow \\frac{6!}{3} = 240\n2) 남자 2명이 같은 모서리에 앉는 경우의 수:\n\\rightarrow (남자가 앉을 모서리 선택) \\times (남자 2명 배열) \\times (여자 4명 배열) / (회전 중복)\n\\rightarrow \\frac{3 \\times 2! \\times 4!}{3} = 2 \\times 24 = 48\n3) 남자 2명이 다른 모서리에 앉는 경우의 수:\n\\rightarrow 240 - 48 = 192\n---\n[결론]\n정답: 5"
  },
  {
    id: 14,
    level: "상",
    category: "같은 것이 있는 순열",
    content: "아래의 그림과 같은 도로망이 있다. A지점에서 출발하여 B지점까지 최단거리로 갈 때, P지점을 거치지 않고 가는 경우의 수는? [4.4점]\n<svg width='260' height='160' viewBox='-20 -20 280 180' style='display:block; margin: 10px auto;'><path d='M0,0 H250 M0,40 H250 M0,80 H250 M0,120 H250 M0,0 V120 M50,0 V120 M100,0 V120 M150,0 V120 M200,0 V120 M250,0 V120' fill='none' stroke='#ccc' stroke-width='1'/><circle cx='0' cy='120' r='4' fill='red'/><text x='-15' y='135' font-size='12'>A</text><circle cx='150' cy='80' r='4' fill='blue'/><text x='155' y='75' font-size='12'>P</text><circle cx='250' cy='0' r='4' fill='red'/><text x='255' y='10' font-size='12'>B</text></svg>",
    choices: ["① 28", "② 29", "③ 30", "④ 31", "⑤ 32"],
    answer: "5",
    solution: "[풀이]\n1) A에서 B로 가는 전체 최단 경로 (가로 5칸, 세로 3칸):\n\\rightarrow \\frac{(5+3)!}{5!3!} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = 56\n2) P를 거쳐가는 경로:\n\\rightarrow (A \\rightarrow P) \\times (P \\rightarrow B) = \\frac{4!}{3!1!} \\times \\frac{4!}{2!2!} = 4 \\times 6 = 24\n3) P를 거치지 않는 경로:\n\\rightarrow 56 - 24 = 32\n---\n[결론]\n정답: 5"
  }
];