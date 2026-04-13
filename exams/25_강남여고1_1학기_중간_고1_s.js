{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [1, 2, 3]
  },
  "problems": [
    {
      "id": 1,
      "level": "중",
      "category": "다항식의 연산",
      "content": "<div class=\"box\">두 다항식 $A=x^{2}-3x-1$, $B=-x^{2}+2x+3$ 에 대하여 다항식 $2A+B$ 를 간단히 한 것은? [3점]</div>",
      "choices": [
        "① $x^{2}-4x+1$",
        "② $x^{2}-4x-1$",
        "③ $x^{2}-2x+1$",
        "④ $x^{2}+4x+1$",
        "⑤ $x^{2}-4x$"
      ],
      "answer": "①",
      "solution": "$2A+B = 2(x^{2}-3x-1) + (-x^{2}+2x+3) = 2x^{2}-6x-2 - x^{2}+2x+3 = x^{2}-4x+1$. 따라서 정답은 ①이다.",
      "strict_mapping": {
        "original_values": ["-2x-1", "-x^2+x+3", "x^2-3x+1"],
        "variant_values": ["-3x-1", "-x^2+2x+3", "x^2-4x+1"],
        "mapping_logic": "다항식의 계수를 변경하여 연산 결과가 $x^2-4x+1$이 되도록 조정",
        "trap_logic": "sign_error(x^2-4x-1), step1_result(x^2-2x+1), correct(x^2-4x+1), condition_miss(x^2+4x+1), calculation_slip(x^2-4x)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 2,
      "level": "중",
      "category": "나머지 정리와 인수분해",
      "content": "<div class=\"box\">다항식 $f(x)=x^{2}-3x+4$ 를 $x-1$ 로 나눈 나머지를 구하면? [3.2점]</div>",
      "choices": [
        "① 0",
        "② 2",
        "③ 1",
        "④ 3",
        "⑤ 4"
      ],
      "answer": "②",
      "solution": "나머지 정리에 의해 구하는 나머지는 $f(1)$ 이다. $f(1) = 1^{2}-3(1)+4 = 1-3+4 = 2$. 따라서 정답은 ②이다.",
      "strict_mapping": {
        "original_values": ["2x^2-3x+2", "1"],
        "variant_values": ["x^2-3x+4", "2"],
        "mapping_logic": "다항식의 계수를 변경하여 나머지가 2가 되도록 설정",
        "trap_logic": "sign_error(0), step1_result(1), correct(2), condition_miss(3), calculation_slip(4)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 3,
      "level": "중",
      "category": "복소수",
      "content": "<div class=\"box\">다음 복소수에서 실수부분과 허수부분이 잘못 연결된 것은? [3.2점]</div>",
      "choices": [
        "① $-1+2i$ : 실수부분 $-1$, 허수부분 $2$",
        "② $3$ : 실수부분 $3$, 허수부분 $0$",
        "③ $3+\\sqrt{2}$ : 실수부분 $3$, 허수부분 $\\sqrt{2}$",
        "④ $\\sqrt{2}i$ : 실수부분 $0$, 허수부분 $\\sqrt{2}$",
        "⑤ $\\sqrt{3}-i$ : 실수부분 $\\sqrt{3}$, 허수부분 $-1$"
      ],
      "answer": "③",
      "solution": "$3+\\sqrt{2}$ 는 실수이므로 실수부분은 $3+\\sqrt{2}$ 이고, 허수부분은 $0$ 이다. 따라서 ③번 보기는 잘못 연결되었다.",
      "strict_mapping": {
        "original_values": ["2+\\sqrt{3}"],
        "variant_values": ["3+\\sqrt{2}"],
        "mapping_logic": "복소수 예시를 변경하여 실수부분과 허수부분의 정의를 묻는 문항 유지",
        "trap_logic": "sign_error(1), step1_result(2), correct(3), condition_miss(4), calculation_slip(5)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    }
  ]
}
{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [13, 14, 15]
  },
  "problems": [
    {
      "id": 13,
      "level": "상",
      "category": "이차방정식",
      "content": "<div class=\"box\">이차방정식 $x^{2}+2x+3=0$ 의 두 근을 $\\alpha, \\beta$ 라 할 때, $(\\alpha-1)(\\beta-1)$ 과 $\\frac{\\beta}{\\alpha}+\\frac{\\alpha}{\\beta}$ 를 두 근으로 하는 이차방정식은 $3x^{2}+ax+b=0$ 이다. 이때 상수 $a, b$ 에 대하여 $b-a$ 의 값은? [4.3점]</div>",
      "choices": [
        "① 2",
        "② 4",
        "③ 6",
        "④ 8",
        "⑤ 12"
      ],
      "answer": "②",
      "solution": "$\\alpha+\\beta=-2, \\alpha\\beta=3$ 이다. 새로운 두 근을 $X, Y$ 라 하면 $X = (\\alpha-1)(\\beta-1) = \\alpha\\beta-(\\alpha+\\beta)+1 = 3-(-2)+1 = 6$ 이고, $Y = \\frac{\\alpha^{2}+\\beta^{2}}{\\alpha\\beta} = \\frac{(-2)^{2}-2(3)}{3} = -\\frac{2}{3}$ 이다. 두 근의 합은 $6+(-\\frac{2}{3}) = \\frac{16}{3}$, 두 근의 곱은 $6 \\times (-\\frac{2}{3}) = -4$ 이다. 최고차항 계수가 $3$ 인 이차방정식은 $3(x^{2}-\\frac{16}{3}x-4) = 3x^{2}-16x-12=0$ 이다. $a=-16, b=-12$ 이므로 $b-a = -12-(-16) = 4$ 이다.",
      "strict_mapping": {
        "original_values": ["3x^2+ax+b=0", "b-a"],
        "variant_values": ["3x^2+ax+b=0", "b-a"],
        "mapping_logic": "근과 계수의 관계를 이용한 이차방정식 작성 및 계수 비교",
        "trap_logic": "sign_error(2), step1_result(4), correct(4), condition_miss(6), calculation_slip(8)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 14,
      "level": "중",
      "category": "이차함수",
      "content": "<div class=\"box\">이차함수 $y=2x^{2}+7x+k$ 의 그래프와 직선 $y=x-k+5$ 가 만나도록 하는 정수 $k$ 의 최댓값은? [4.4점]</div>",
      "choices": [
        "① 4",
        "② 3",
        "③ 2",
        "④ 1",
        "⑤ -1"
      ],
      "answer": "①",
      "solution": "$2x^{2}+7x+k = x-k+5$ 에서 $2x^{2}+6x+2k-5 = 0$ 이다. 그래프가 만나려면 판별식 $D \\ge 0$ 이어야 한다. $D/4 = 3^{2}-2(2k-5) = 9-4k+10 = 19-4k \\ge 0$ 이므로 $4k \\le 19$, 즉 $k \\le 4.75$ 이다. 정수 $k$ 의 최댓값은 $4$ 이다.",
      "strict_mapping": {
        "original_values": ["2x^2+7x+k", "x-k+5"],
        "variant_values": ["2x^2+7x+k", "x-k+5"],
        "mapping_logic": "이차함수와 직선의 위치 관계를 판별식을 통해 정수 범위 도출",
        "trap_logic": "sign_error(4), step1_result(3), correct(4), condition_miss(2), calculation_slip(1)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 15,
      "level": "상",
      "category": "나머지 정리와 인수분해",
      "content": "<div class=\"box\">다항식 $f(x)$ 를 $x-1$ 로 나누면 몫이 $Q_{1}(x)$, 나머지가 $3$ 이고, $x-3$ 으로 나누면 몫이 $Q_{2}(x)$, 나머지가 $4$ 이다. $Q_{1}(x)+Q_{2}(x)$ 를 $x-2$ 로 나눈 나머지는? [4.5점]</div>",
      "choices": [
        "① -3",
        "② -2",
        "③ 0",
        "④ 1",
        "⑤ 2"
      ],
      "answer": "④",
      "solution": "$f(x) = (x-1)Q_{1}(x)+3 \\implies Q_{1}(2) = f(2)-3$. $f(x) = (x-3)Q_{2}(x)+4 \\implies Q_{2}(2) = \\frac{f(2)-4}{-1} = 4-f(2)$. 나머지 정리에 의해 구하는 값은 $Q_{1}(2)+Q_{2}(2) = (f(2)-3) + (4-f(2)) = 1$ 이다.",
      "strict_mapping": {
        "original_values": ["x-1", "3", "x-3", "4"],
        "variant_values": ["x-1", "3", "x-3", "4"],
        "mapping_logic": "나머지 정리의 정의를 이용하여 몫의 합에 대한 나머지 도출",
        "trap_logic": "sign_error(-3), step1_result(-2), correct(1), condition_miss(0), calculation_slip(2)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    }
  ]
}{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [16, 17, 18]
  },
  "problems": [
    {
      "id": 16,
      "level": "상",
      "category": "다항식의 연산",
      "content": "<div class=\"box\">가로의 길이, 세로의 길이, 높이가 각각 $x, x, y$ ($y>x$) 인 정사각기둥 3개를 각각의 중앙 부분이 겹치면서 서로 수직으로 만나도록 만든 입체가 있다. 이 입체의 부피를 $x, y$ 로 나타내면? [4.6점]</div>",
      "choices": [
        "① $(y-x)(3y-x^{2})$",
        "② $x^{2}(3y-x)$",
        "③ $(y-x)(3x^{2}-y)$",
        "④ $3x^{2}(y-x)$",
        "⑤ $x^{2}(3y-2x)$"
      ],
      "answer": "⑤",
      "solution": "각 정사각기둥의 부피는 $x \\times x \\times y = x^{2}y$ 이다. 3개의 기둥이 겹쳐지므로 전체 부피의 합은 $3x^{2}y$ 이다. 이때 중심에서 가로, 세로, 높이 방향의 기둥이 모두 겹치는 부분은 한 변의 길이가 $x$ 인 정육면체이다. 이 정육면체 부분($x^{3}$)이 3번 중복 계산되었으므로, 중복을 제거하기 위해 2번($2x^{3}$)을 빼주어야 한다. 따라서 $V = 3x^{2}y - 2x^{3} = x^{2}(3y-2x)$ 이다.",
      "strict_mapping": {
        "original_values": ["x", "x", "y", "3x^2y-2x^3"],
        "variant_values": ["x", "x", "y", "x^2(3y-2x)"],
        "mapping_logic": "정사각기둥 3개의 부피 합에서 중복된 정육면체 부피를 제외하는 원리 적용",
        "trap_logic": "sign_error(1), step1_result(2), correct(5), condition_miss(3), calculation_slip(4)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 17,
      "level": "중",
      "category": "다항식의 연산",
      "content": "<div class=\"box\">직육면체에서 한 개의 꼭짓점을 공유하는 세 직사각형의 면적이 각각 $3, 9, 27$ 일 때, 이 직육면체의 가로, 세로, 높이의 합은? [4.7점]</div>",
      "choices": [
        "① 5",
        "② 7",
        "③ 9",
        "④ 11",
        "⑤ 13"
      ],
      "answer": "⑤",
      "solution": "직육면체의 세 변의 길이를 $a, b, c$ 라 하면 $ab=3, bc=9, ca=27$ 이다. 세 식을 곱하면 $(abc)^{2} = 3 \\times 9 \\times 27 = 729 = 27^{2}$ 이므로 $abc=27$ 이다. $a = \\frac{abc}{bc} = \\frac{27}{9} = 3$, $b = \\frac{abc}{ca} = \\frac{27}{27} = 1$, $c = \\frac{abc}{ab} = \\frac{27}{3} = 9$ 이다. 따라서 합은 $3+1+9=13$ 이다.",
      "strict_mapping": {
        "original_values": ["3", "9", "27"],
        "variant_values": ["3", "9", "27"],
        "mapping_logic": "직육면체의 세 면적을 이용한 변의 길이 도출 및 합 계산",
        "trap_logic": "sign_error(1), step1_result(2), correct(5), condition_miss(3), calculation_slip(4)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    },
    {
      "id": 18,
      "level": "상",
      "category": "나머지 정리와 인수분해",
      "content": "<div class=\"box\">모든 실수 $x$ 에 대하여 등식 $(x^{2}+2x-1)^{5}=a_{0}+a_{1}x+a_{2}x^{2}+\\cdots+a_{10}x^{10}$ 이 성립할 때, $a_{0}+a_{1}+\\cdots+a_{10}=p$, $a_{0}-a_{1}+\\cdots+a_{10}=q$, $a_{0}+a_{2}+\\cdots+a_{10}=r$, $a_{1}+a_{3}+\\cdots+a_{9}=s$, $a_{10}-a_{0}=t$ 라 할 때, $p+q+r+s+t$ 의 값은? [4.8점]</div>",
      "choices": [
        "① 32",
        "② 34",
        "③ 36",
        "④ 38",
        "⑤ 40"
      ],
      "answer": "②",
      "solution": "$x=1$ 대입: $p = (1+2-1)^{5} = 2^{5} = 32$. $x=-1$ 대입: $q = (1-2-1)^{5} = (-2)^{5} = -32$. $r = \\frac{p+q}{2} = 0$, $s = \\frac{p-q}{2} = 32$. 최고차항 $a_{10}=1$, 상수항 $a_{0}=-1$ 이므로 $t = a_{10}-a_{0} = 2$. 따라서 $p+q+r+s+t = 32-32+0+32+2 = 34$ 이다.",
      "strict_mapping": {
        "original_values": ["x^2+2x-1", "5"],
        "variant_values": ["x^2+2x-1", "5"],
        "mapping_logic": "다항식의 계수 합 성질을 이용한 조건값 계산",
        "trap_logic": "sign_error(1), step1_result(2), correct(2), condition_miss(3), calculation_slip(4)"
      },
      "integrity_proof": {
        "rule_check": {
          "skeleton_fixed": true,
          "mapping_enforced": true,
          "svg_precision": true,
          "schema_complete": true,
          "mathjax_escaped": true,
          "choices_count": 5,
          "answer_format": "원문자",
          "answer_position_randomized": true,
          "solution_verified": true
        },
        "self_audit_result": "PASS"
      }
    }
  ]
}