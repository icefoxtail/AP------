window.examTitle = String.raw`2025_금당중3_1학기_중간_중3`;

window.questionBank = [
  {
    id: 1,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`다음 중 옳은 것은? [3점]`,
    choices: [
      String.raw`① $64$의 제곱근은 $8$이다.`,
      String.raw`② $\sqrt{(-3)^2} = -3$`,
      String.raw`③ 제곱근 $6$은 $\sqrt{6}$이다.`,
      String.raw`④ $\sqrt{25}$의 제곱근은 $\pm 5$이다.`,
      String.raw`⑤ $(-6)^2$의 제곱근은 $\pm \sqrt{6}$이다.`
    ],
    answer: "③",
    solution: String.raw`[풀이전략] 제곱근의 정의와 성질을 이용하여 각 보기의 참/거짓을 판별한다.
① $64$의 제곱근은 $\pm 8$이다. (거짓)
② $\sqrt{(-3)^2} = \sqrt{9} = 3$이다. (거짓)
③ 제곱근 $6$은 $\sqrt{6}$을 의미한다. (참)
④ $\sqrt{25} = 5$이므로, $5$의 제곱근은 $\pm \sqrt{5}$이다. (거짓)
⑤ $(-6)^2 = 36$이므로, $36$의 제곱근은 $\pm 6$이다. (거짓)

$\therefore$ 정답은 ③이다.`
  },
  {
    id: 2,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`다음 중 옳지 않은 것은? [3점]`,
    choices: [
      String.raw`① $\sqrt{5^2} = 5$`,
      String.raw`② $-(\sqrt{11})^2 = -11$`,
      String.raw`③ $\sqrt{(-7)^2} = 7$`,
      String.raw`④ $(-\sqrt{6})^2 = -6$`,
      String.raw`⑤ $\sqrt{16} = 4$`
    ],
    answer: "④",
    solution: String.raw`[풀이전략] 제곱근의 성질 $\sqrt{a^2} = |a|$, $(\sqrt{a})^2 = a$ ($a \ge 0$)를 이용한다.
① $\sqrt{5^2} = 5$ (참)
② $-(\sqrt{11})^2 = -11$ (참)
③ $\sqrt{(-7)^2} = |-7| = 7$ (참)
④ $(-\sqrt{6})^2 = 6$이다. (거짓)
⑤ $\sqrt{16} = \sqrt{4^2} = 4$ (참)

$\therefore$ 정답은 ④이다.`
  },
  {
    id: 3,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`다음 보기 중에서 무리수로 나타내어지는 것의 개수는? [4점]
<보기>
$\sqrt{\frac{4}{25}}, \pi, \sqrt{9}, 0.1\dot{1}\dot{5}, \sqrt{11}, 2+\sqrt{5}, \sqrt{1000}$`,
    choices: [String.raw`① 2`, String.raw`② 3`, String.raw`③ 4`, String.raw`④ 5`, String.raw`⑤ 6`],
    answer: "③",
    solution: String.raw`[풀이전략] 유리수(유한소수, 순환소수, 근호 없이 나타낼 수 있는 수)와 무리수(순환하지 않는 무한소수, 근호를 없앨 수 없는 수)를 구분한다.
- $\sqrt{\frac{4}{25}} = \frac{2}{5}$ (유리수)
- $\pi$ (무한소수, 무리수)
- $\sqrt{9} = 3$ (유리수)
- $0.1\dot{1}\dot{5}$ (순환소수, 유리수)
- $\sqrt{11}$ (무리수)
- $2+\sqrt{5}$ (무리수)
- $\sqrt{1000} = 10\sqrt{10}$ (무리수)

무리수는 $\pi, \sqrt{11}, 2+\sqrt{5}, \sqrt{1000}$으로 총 4개이다.

$\therefore$ 정답은 ③이다.`
  },
  {
    id: 4,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`$\sqrt{20-n}$이 자연수가 되도록 하는 자연수 $n$값 중 가장 작은 자연수를 $A$, 가장 큰 자연수를 $B$라 할 때, $A+B$의 값은? [4점]`,
    choices: [String.raw`① 23`, String.raw`② 24`, String.raw`③ 25`, String.raw`④ 26`, String.raw`⑤ 27`],
    answer: "①",
    solution: String.raw`[풀이전략] $\sqrt{20-n}$이 자연수가 되려면 근호 안의 수 $20-n$이 0보다 큰 제곱수여야 한다.
$n$이 자연수이므로 $n \ge 1$이고, $20-n < 20$이다.
20보다 작은 제곱수는 1, 4, 9, 16이다.
- $20-n = 1 \implies n = 19$
- $20-n = 4 \implies n = 16$
- $20-n = 9 \implies n = 11$
- $20-n = 16 \implies n = 4$
자연수 $n$은 4, 11, 16, 19이다.
최솟값 $A = 4$, 최댓값 $B = 19$이므로
$A+B = 4 + 19 = 23$

$\therefore$ 정답은 ①이다.`
  },
  {
    id: 5,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`다음 그림은 한 눈금의 길이가 $1$인 모눈종이 위에 수직선과 직각삼각형 $ABC$를 그리고, 점 $A$를 중심으로 하고 $\overline{AC}$를 반지름으로 하는 원을 그린 것이다. 원이 수직선과 만나는 두 점을 각각 $P, Q$라 할 때, $P-Q$의 값은? [4점]`,
    svg: String.raw`<svg width="160" height="120" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="#eee" stroke-width="1"/></pattern></defs><rect width="160" height="120" fill="url(#grid)"/><line x1="0" y1="100" x2="160" y2="100" stroke="black" stroke-width="1.5"/><path d="M 60 100 A 56.57 56.57 0 0 1 116.57 100" fill="none" stroke="black" stroke-width="1"/><path d="M 3.43 100 A 56.57 56.57 0 0 1 60 100" fill="none" stroke="black" stroke-width="1"/><line x1="60" y1="100" x2="100" y2="100" stroke="blue" stroke-width="2"/><line x1="100" y1="100" x2="100" y2="60" stroke="blue" stroke-width="2"/><line x1="60" y1="100" x2="100" y2="60" stroke="red" stroke-width="2"/><text x="58" y="115" font-family="serif" font-size="10">2</text><text x="18" y="115" font-family="serif" font-size="10">0</text><text x="38" y="115" font-family="serif" font-size="10">1</text><text x="78" y="115" font-family="serif" font-size="10">3</text><text x="98" y="115" font-family="serif" font-size="10">4</text><text x="118" y="115" font-family="serif" font-size="10">5</text><text x="55" y="95" font-family="serif" font-size="10">A</text><text x="102" y="112" font-family="serif" font-size="10">B</text><text x="102" y="58" font-family="serif" font-size="10">C</text><text x="116" y="95" font-family="serif" font-size="10">P</text><text x="3" y="95" font-family="serif" font-size="10">Q</text></svg>`,
    choices: [String.raw`① $-4\sqrt{2}$`, String.raw`② 0`, String.raw`③ $2\sqrt{2}$`, String.raw`④ 4`, String.raw`⑤ $4\sqrt{2}$`],
    answer: "⑤",
    solution: String.raw`[풀이전략] 피타고라스 정리를 이용하여 선분 $AC$의 길이를 구한 뒤, 수직선 위의 점의 좌표를 계산한다.
직각삼각형 $ABC$에서 밑변 $AB = 4-2 = 2$, 높이 $BC = 2$이므로
$AC = \sqrt{2^2 + 2^2} = \sqrt{8} = 2\sqrt{2}$
점 $A(2)$를 중심으로 반지름이 $2\sqrt{2}$인 원이므로
점 $P$의 좌표는 $2 + 2\sqrt{2}$, 점 $Q$의 좌표는 $2 - 2\sqrt{2}$이다.
$P-Q = (2+2\sqrt{2}) - (2-2\sqrt{2}) = 4\sqrt{2}$

$\therefore$ 정답은 ⑤이다.`
  },
  {
    id: 6,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`다음 중 두 실수의 대소 관계가 옳지 않은 것은? [4점]`,
    choices: [
      String.raw`① $\sqrt{2}+1 < \sqrt{3}+1$`,
      String.raw`② $5-\sqrt{6} < 2-\sqrt{6}$`,
      String.raw`③ $\sqrt{11}-1 > 2$`,
      String.raw`④ $\sqrt{7}-3 < \sqrt{8}-3$`,
      String.raw`⑤ $\sqrt{2}+\sqrt{3} < \sqrt{3}+\sqrt{5}$`
    ],
    answer: "②",
    solution: String.raw`[풀이전략] 양변에 같은 수를 더하거나 빼서 크기를 비교한다.
① 양변에서 $1$을 빼면 $\sqrt{2} < \sqrt{3}$ (참)
② 양변에 $\sqrt{6}$을 더하면 $5 < 2$ (거짓)
③ 양변에 $1$을 더하면 $\sqrt{11} > 3 = \sqrt{9}$ (참)
④ 양변에 $3$을 더하면 $\sqrt{7} < \sqrt{8}$ (참)
⑤ 양변에서 $\sqrt{3}$을 빼면 $\sqrt{2} < \sqrt{5}$ (참)

$\therefore$ 정답은 ②이다.`
  },
  {
    id: 7,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`다음 중 분모를 유리화한 것으로 옳지 않은 것은? [4점]`,
    choices: [
      String.raw`① $\frac{1}{\sqrt{3}} = \frac{\sqrt{3}}{3}$`,
      String.raw`② $\frac{3}{\sqrt{8}} = \frac{3\sqrt{2}}{4}$`,
      String.raw`③ $\frac{\sqrt{2}}{5\sqrt{3}} = \frac{\sqrt{6}}{15}$`,
      String.raw`④ $\frac{6}{\sqrt{24}} = \frac{1}{2}$`,
      String.raw`⑤ $\frac{4}{\sqrt{2}} = 2\sqrt{2}$`
    ],
    answer: "④",
    solution: String.raw`[풀이전략] 분모와 분자에 분모의 무리수 부분을 곱하여 유리화한다.
① $\frac{1}{\sqrt{3}} = \frac{1 \times \sqrt{3}}{\sqrt{3} \times \sqrt{3}} = \frac{\sqrt{3}}{3}$ (참)
② $\frac{3}{\sqrt{8}} = \frac{3}{2\sqrt{2}} = \frac{3 \times \sqrt{2}}{2\sqrt{2} \times \sqrt{2}} = \frac{3\sqrt{2}}{4}$ (참)
③ $\frac{\sqrt{2}}{5\sqrt{3}} = \frac{\sqrt{2} \times \sqrt{3}}{5\sqrt{3} \times \sqrt{3}} = \frac{\sqrt{6}}{15}$ (참)
④ $\frac{6}{\sqrt{24}} = \frac{6}{2\sqrt{6}} = \frac{3}{\sqrt{6}} = \frac{3\sqrt{6}}{6} = \frac{\sqrt{6}}{2}$ (거짓)
⑤ $\frac{4}{\sqrt{2}} = \frac{4\sqrt{2}}{2} = 2\sqrt{2}$ (참)

$\therefore$ 정답은 ④이다.`
  },
  {
    id: 8,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`다음 중 계산 결과가 가장 큰 것은? [4점]`,
    choices: [
      String.raw`① $\sqrt{2} \times \sqrt{5}$`,
      String.raw`② $\sqrt{42} \div \sqrt{7}$`,
      String.raw`③ $4\sqrt{5} \div \sqrt{10}$`,
      String.raw`④ $\sqrt{3} \div \sqrt{6} \times \sqrt{12}$`,
      String.raw`⑤ $\sqrt{3} \times \frac{3}{\sqrt{3}}$`
    ],
    answer: "①",
    solution: String.raw`[풀이전략] 근호를 포함한 식의 곱셈과 나눗셈 성질을 이용하여 각 보기의 값을 계산하고 비교한다.
① $\sqrt{2} \times \sqrt{5} = \sqrt{10} \approx 3.162$
② $\sqrt{42} \div \sqrt{7} = \sqrt{6} \approx 2.449$
③ $4\sqrt{5} \div \sqrt{10} = 4\sqrt{\frac{5}{10}} = 4\sqrt{\frac{1}{2}} = \frac{4}{\sqrt{2}} = 2\sqrt{2} \approx 2.828$
④ $\sqrt{3} \div \sqrt{6} \times \sqrt{12} = \sqrt{\frac{3}{6} \times 12} = \sqrt{6} \approx 2.449$
⑤ $\sqrt{3} \times \frac{3}{\sqrt{3}} = 3 = \sqrt{9}$
따라서 $\sqrt{10} > \sqrt{9} > \sqrt{8} > \sqrt{6}$이므로 결과가 가장 큰 것은 ①이다.`
  },
  {
    id: 9,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`$\sqrt{32} = a\sqrt{2}, 4\sqrt{3} = \sqrt{b}$일 때, $\sqrt{\frac{b}{a}}$의 값은? [4점]`,
    choices: [String.raw`① $\sqrt{2}$`, String.raw`② $\sqrt{5}$`, String.raw`③ $2\sqrt{2}$`, String.raw`④ $2\sqrt{3}$`, String.raw`⑤ $3\sqrt{3}$`],
    answer: "④",
    solution: String.raw`[풀이전략] 제곱근의 성질을 이용하여 $a, b$의 값을 먼저 구한다.

$\sqrt{32} = \sqrt{16 \times 2} = 4\sqrt{2}$ 이므로 $a = 4$
$4\sqrt{3} = \sqrt{16 \times 3} = \sqrt{48}$ 이므로 $b = 48$
$\therefore \sqrt{\frac{b}{a}} = \sqrt{\frac{48}{4}} = \sqrt{12} = 2\sqrt{3}$`
  },
  {
    id: 10,
    level: "상",
    category: "제곱근과 실수",
    content: String.raw`자연수 $x$에 대하여 $\sqrt{x}$ 이하의 자연수의 개수를 $f(x)$라 할 때, $f(1)+f(2)+\cdots+f(17)$의 값은? [5점]`,
    choices: [String.raw`① 38`, String.raw`② 39`, String.raw`③ 40`, String.raw`④ 41`, String.raw`⑤ 42`],
    answer: "⑤",
    solution: String.raw`[풀이전략] $\sqrt{x}$의 정수 부분을 파악하여 $f(x)$의 값을 구간별로 계산한다.

- $1 \le x < 4$ 일 때, $1 \le \sqrt{x} < 2$ 이므로 $f(x) = 1$ (3개: 1, 2, 3)
- $4 \le x < 9$ 일 때, $2 \le \sqrt{x} < 3$ 이므로 $f(x) = 2$ (5개: 4~8)
- $9 \le x < 16$ 일 때, $3 \le \sqrt{x} < 4$ 이므로 $f(x) = 3$ (7개: 9~15)
- $16 \le x < 25$ 일 때, $4 \le \sqrt{x} < 5$ 이므로 $f(x) = 4$ (2개: 16, 17)

합계: $(1 \times 3) + (2 \times 5) + (3 \times 7) + (4 \times 2) = 3 + 10 + 21 + 8 = 42$`
  },
  {
    id: 11,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`$\sqrt{24} + \frac{2}{\sqrt{2}} + \sqrt{2} \times \sqrt{3}$을 계산하면? [4점]`,
    choices: [String.raw`① $\sqrt{2}+3\sqrt{6}$`, String.raw`② $2\sqrt{3}$`, String.raw`③ $2\sqrt{6}$`, String.raw`④ $3\sqrt{3}+\sqrt{6}$`, String.raw`⑤ $2\sqrt{2}+5\sqrt{3}$`],
    answer: "①",
    solution: String.raw`[풀이전략] 각 항을 간단히 정리한 후 덧셈을 수행한다.
- $\sqrt{24} = 2\sqrt{6}$
- $\frac{2}{\sqrt{2}} = \sqrt{2}$
- $\sqrt{2} \times \sqrt{3} = \sqrt{6}$
식에 대입하면: $2\sqrt{6} + \sqrt{2} + \sqrt{6} = \sqrt{2} + 3\sqrt{6}$`
  },
  {
    id: 12,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`$\sqrt{3}(\sqrt{5}+4) - \sqrt{5}(2\sqrt{3}-\sqrt{15})$를 계산하면? [4점]`,
    choices: [String.raw`① $\sqrt{15}-3\sqrt{3}$`, String.raw`② $-\sqrt{15}+9\sqrt{3}$`, String.raw`③ $-3\sqrt{15}-\sqrt{3}$`, String.raw`④ $-3\sqrt{15}+\sqrt{3}$`, String.raw`⑤ $-\sqrt{15}-9\sqrt{3}$`],
    answer: "②",
    solution: String.raw`[풀이전략] 분배법칙을 이용하여 괄호를 풀고 동류항끼리 계산한다.
$\sqrt{15} + 4\sqrt{3} - (2\sqrt{15} - \sqrt{75}) = \sqrt{15} + 4\sqrt{3} - 2\sqrt{15} + 5\sqrt{3} = 9\sqrt{3} - \sqrt{15}$`
  },
  {
    id: 13,
    level: "중",
    category: "근호를 포함한 식의 계산",
    content: String.raw`$\sqrt{32} + 2\sqrt{24} - \sqrt{2}(2 + \frac{6}{\sqrt{12}}) = a\sqrt{2} + b\sqrt{6}$이 성립할 때, $a-b$의 값을 구하면? (단, $a, b$는 유리수이다.) [4점]`,
    choices: [String.raw`① -2`, String.raw`② -1`, String.raw`③ 0`, String.raw`④ 1`, String.raw`⑤ 2`],
    answer: "②",
    solution: String.raw`[풀이전략] 좌변의 식을 유리화 및 근호 정리를 통해 정리한다.
- 좌변: $4\sqrt{2} + 4\sqrt{6} - (2\sqrt{2} + \sqrt{6}) = 2\sqrt{2} + 3\sqrt{6}$
따라서 $a = 2, b = 3$ 이므로 $a - b = 2 - 3 = -1$`
  },
  {
    id: 14,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`$(2x+a)(3x+5)$를 전개한 식이 $6x^2 + bx + 10$일 때, $a+b$의 값을 구하면? [4점]`,
    choices: [String.raw`① 12`, String.raw`② 14`, String.raw`③ 16`, String.raw`④ 18`, String.raw`⑤ 20`],
    answer: "④",
    solution: String.raw`[풀이전략] 전개한 후 계수를 비교한다.
$(2x+a)(3x+5) = 6x^2 + (10+3a)x + 5a$
- $5a = 10 \implies a = 2$
- $b = 10 + 3a = 10 + 6 = 16$
$a + b = 18$`
  },
  {
    id: 15,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`다음 중에서 옳지 않은 것은? [4점]`,
    choices: [
      String.raw`① $(x+3)(x-7) = x^2 - 4x - 21$`,
      String.raw`② $(2x+y)^2 = 4x^2 + 4xy + y^2$`,
      String.raw`③ $(x+5)^2 = x^2 + 5x + 25$`,
      String.raw`④ $(x+5)(x-5) = x^2 - 25$`,
      String.raw`⑤ $(x+3)(3x-4) = 3x^2 + 5x - 12$`
    ],
    answer: "③",
    solution: String.raw`[풀이전략] 곱셈 공식을 검증한다.
③ $(x+5)^2 = x^2 + 10x + 25$ 이므로 $5x$는 틀리다.`
  },
  {
    id: 16,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`$x^2 + (2p+1)x + 9$가 완전제곱식이 될 때, 상수 $p$의 값을 모두 곱하면? [4점]`,
    choices: [String.raw`① $-\frac{35}{4}$`, String.raw`② -8`, String.raw`③ $-\frac{13}{2}$`, String.raw`④ $-\frac{9}{2}$`, String.raw`⑤ $-\frac{15}{4}$`],
    answer: "①",
    solution: String.raw`[풀이전략] $2p + 1 = \pm 2\sqrt{9} = \pm 6$
- $2p+1=6 \implies p=5/2$
- $2p+1=-6 \implies p=-7/2$
곱: $5/2 \times (-7/2) = -35/4$`
  },
  {
    id: 17,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`$(3x-y)^2 - (2x+y)(2x-y)$를 계산할 때, $x^2$의 계수를 $a$, $y^2$의 계수를 $b$라고 하자. 이때 $a+b$의 값을 구하면? [4점]`,
    choices: [String.raw`① 3`, String.raw`② 4`, String.raw`③ 5`, String.raw`④ 6`, String.raw`⑤ 7`],
    answer: "⑤",
    solution: String.raw`[풀이전략] 전개 후 계수 비교.
$(9x^2 - 6xy + y^2) - (4x^2 - y^2) = 5x^2 - 6xy + 2y^2$
$a=5, b=2 \implies a+b=7$`
  },
  {
    id: 18,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`다음 중에서 $x-2$를 인수로 갖지 않는 다항식은? [4점]`,
    choices: [
      String.raw`① $x^2-2x$`,
      String.raw`② $x^2-4x+4$`,
      String.raw`③ $x^2+x-2$`,
      String.raw`④ $x^2+x-6$`,
      String.raw`⑤ $x^2-4$`
    ],
    answer: "③",
    solution: String.raw`[풀이전략] $x=2$ 대입 시 $0$이 안 되는 것 찾기.
③ $2^2+2-2 = 4 \neq 0$.`
  },
  {
    id: 19,
    level: "상",
    category: "제곱근과 실수",
    content: String.raw`$-2 < x < \frac{1}{3}$일 때, $\sqrt{x^2+4x+4} + \sqrt{9x^2-6x+1}$을 간단히 하면? [5점]`,
    choices: [String.raw`① $-2x-3$`, String.raw`② $-2x+3$`, String.raw`③ $4x+1$`, String.raw`④ $5x-1$`, String.raw`⑤ $5x+1$`],
    answer: "②",
    solution: String.raw`[풀이전략] $|x+2| + |3x-1|$.
주어진 범위에서 $x+2 > 0, 3x-1 < 0$ 이므로
$(x+2) - (3x-1) = -2x+3$.`
  },
  {
    id: 20,
    level: "상",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`$x+y=4$이고 $x^2y+xy^2-x-y=16$일 때, $x^2+y^2$의 값을 구하면? [4점]`,
    choices: [String.raw`① 2`, String.raw`② 3`, String.raw`③ 4`, String.raw`④ 5`, String.raw`⑤ 6`],
    answer: "⑤",
    solution: String.raw`[풀이전략] $(x+y)(xy-1) = 16 \implies 4(xy-1)=16 \implies xy=5$.
$x^2+y^2 = 4^2 - 2(5) = 6$.`
  },
  {
    id: 21,
    level: "하",
    category: "제곱근과 실수",
    content: String.raw`[서술형1] 다음 수의 제곱근을 풀이 과정을 쓰고 구하시오. [4점]

(1) $36$의 제곱근을 구하면? [2점](부분점수 있음)

(2) $\sqrt{81}$의 제곱근을 구하면? [2점](부분점수 있음)`,
    choices: [],
    answer: String.raw`(1) $\pm 6$, (2) $\pm 3$`,
    solution: String.raw`(1) $\pm 6$
(2) $\sqrt{81}=9$이므로 $\pm 3$.`
  },
  {
    id: 22,
    level: "중",
    category: "제곱근과 실수",
    content: String.raw`[서술형2] $6-\sqrt{5}$의 소수 부분을 $x$라고 하면 $\frac{3+x}{3-x} = A+B\sqrt{5}$이다. 이 때, 유리수 $A+B$의 값을 풀이 과정을 쓰고 구하시오. (단, $A, B$는 유리수) [6점](부분점수 있음)`,
    choices: [],
    answer: String.raw`\frac{1}{5}`,
    solution: String.raw`$x = (6-\sqrt{5}) - 3 = 3-\sqrt{5}$.
$\frac{3+(3-\sqrt{5})}{3-(3-\sqrt{5})} = \frac{6-\sqrt{5}}{\sqrt{5}} = \frac{6\sqrt{5}-5}{5} = -1 + \frac{6}{5}\sqrt{5}$.
$A+B = -1 + 1.2 = 0.2 = 1/5$.`
  },
  {
    id: 23,
    level: "상",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`[서술형3] 아래 그림과 같이 한 변의 길이가 각각 $x$와 $y$인 두 정사각형이 있다. 두 정사각형의 둘레의 길이의 합은 $44$이고, 넓이의 합은 $65$이다. 다음 물음에 풀이 과정을 쓰고 답을 구하시오. [5점]`,
    svg: String.raw`<svg width="160" height="120" viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="40" width="50" height="50" fill="none" stroke="black" stroke-width="1.5"/><rect x="80" y="55" width="35" height="35" fill="none" stroke="black" stroke-width="1.5"/><text x="42" y="105" font-family="serif" font-size="12">x</text><text x="95" y="105" font-family="serif" font-size="12">y</text></svg>`,
    answer: String.raw`(1) $4x+4y=44$, (2) $x^2+y^2=65$, (3) 448`,
    solution: String.raw`(1) $4x+4y=44 \implies x+y=11$
(2) $x^2+y^2=65$
(3) $16xy = 8( (x+y)^2 - (x^2+y^2) ) = 8(121-65) = 8(56) = 448$.`
  },
  {
    id: 24,
    level: "중",
    category: "다항식의 곱셈과 인수분해",
    content: String.raw`[서술형4] 다음 두 다항식을 인수분해하여 공통인수를 구하고자 한다. 다음 물음에 풀이 과정을 쓰고 답을 구하시오. [5점]
$2x^2-5x-3, x^2-8x+15$

(1) 두 다항식을 각각 인수분해하여라. [각 2점](부분점수 있음)
(2) 두 다항식의 공통인수를 구하여라. [1점]`,
    choices: [],
    answer: String.raw`(1) $(2x+1)(x-3), (x-3)(x-5)$, (2) $x-3$`,
    solution: String.raw`(1) $(2x+1)(x-3)$, $(x-3)(x-5)$
(2) 공통인수는 $(x-3)$이다.`
  }
];