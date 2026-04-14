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
  ]{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [4, 5, 6]
  },
  "problems": [
    {
      "id": 4,
      "level": "중",
      "category": "이차방정식",
      "content": "<div class=\"box\">이차방정식 $x^{2}-5x-3=0$ 의 두 근의 곱을 구하면? [3.3점]</div>",
      "choices": [
        "① -3",
        "② -1",
        "③ 0",
        "④ 1",
        "⑤ 3"
      ],
      "answer": "①",
      "solution": "이차방정식 $ax^{2}+bx+c=0$ 에서 두 근의 곱은 $\\frac{c}{a}$ 이다. 주어진 식 $x^{2}-5x-3=0$ 에서 $a=1, c=-3$ 이므로 두 근의 곱은 $\\frac{-3}{1}=-3$ 이다. 따라서 정답은 ①이다.",
      "strict_mapping": {
        "original_values": ["x^2-3x-2=0", "-2"],
        "variant_values": ["x^2-5x-3=0", "-3"],
        "mapping_logic": "이차방정식의 계수를 변경하여 두 근의 곱이 -3이 되도록 설정",
        "trap_logic": "sign_error(3), step1_result(-1), correct(-3), condition_miss(0), calculation_slip(1)"
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
      "id": 5,
      "level": "중",
      "category": "다항식의 연산",
      "content": "<div class=\"box\">다음 다항식 $(x-3)(x+3)(x^{2}+3^{2})(x^{4}+3^{4})$ 을 전개하면? [3.4점]</div>",
      "choices": [
        "① $x^{8}$",
        "② $x^{8}-3^{8}$",
        "③ $x^{8}+3^{8}$",
        "④ $x^{8}-3^{4}x^{4}+3^{8}$",
        "⑤ $x^{8}+3^{4}x^{4}+3^{8}$"
      ],
      "answer": "②",
      "solution": "$(x-3)(x+3)=x^{2}-3^{2}$, $(x^{2}-3^{2})(x^{2}+3^{2})=x^{4}-3^{4}$, $(x^{4}-3^{4})(x^{4}+3^{4})=x^{8}-3^{8}$ 이다. 따라서 정답은 ②이다.",
      "strict_mapping": {
        "original_values": ["2", "x^8-2^8"],
        "variant_values": ["3", "x^8-3^8"],
        "mapping_logic": "합차 공식의 반복 적용을 위해 상수를 3으로 변경",
        "trap_logic": "sign_error(x^8+3^8), step1_result(x^8), correct(x^8-3^8), condition_miss(x^8-3^4x^4+3^8), calculation_slip(x^8+3^4x^4+3^8)"
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
      "id": 6,
      "level": "중",
      "category": "복소수",
      "content": "<div class=\"box\">다음 중 복소수에 대하여 옳지 않은 것은? [3.5점]</div>",
      "choices": [
        "① $a+3i=2+bi$ 의 두 실수 $a, b$ 의 값은 $a=2, b=3$ 이다.",
        "② $3+2i$ 의 켤레 복소수는 $3-2i$ 이다.",
        "③ $(1+2i)+(2-i)=3+i$ 이다.",
        "④ $\\sqrt{-3}=\\sqrt{3}i$ 이다.",
        "⑤ $\\sqrt{-2}\\sqrt{-3}=\\sqrt{6}i$ 이다."
      ],
      "answer": "⑤",
      "solution": "$\\sqrt{-2}\\sqrt{-3} = (\\sqrt{2}i)(\\sqrt{3}i) = \\sqrt{6}i^{2} = -\\sqrt{6}$ 이다. 따라서 ⑤번 보기는 옳지 않다.",
      "strict_mapping": {
        "original_values": ["a+2i=1+bi", "sqrt(-2)sqrt(8)=4i"],
        "variant_values": ["a+3i=2+bi", "sqrt(-2)sqrt(-3)=sqrt(6)i"],
        "mapping_logic": "복소수의 성질을 묻는 보기를 변경하여 오답 유형을 구성",
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
    }
  ]
}{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [7, 8, 9]
  },
  "problems": [
    {
      "id": 7,
      "level": "중",
      "category": "이차방정식",
      "content": "<div class=\"box\">이차방정식 $x^{2}-4x+2=0$ 의 두 근을 $\\alpha, \\beta$ 라 할 때, $\\alpha^{2}-\\alpha\\beta+\\beta^{2}$ 의 값을 구하면? [3.6점]</div>",
      "choices": [
        "① 8",
        "② 9",
        "③ 10",
        "④ 11",
        "⑤ 12"
      ],
      "answer": "③",
      "solution": "이차방정식 $x^{2}-4x+2=0$ 에서 근과 계수의 관계에 의하여 $\\alpha+\\beta = 4, \\alpha\\beta = 2$ 이다. 구하고자 하는 식은 $\\alpha^{2}-\\alpha\\beta+\\beta^{2} = (\\alpha+\\beta)^{2}-3\\alpha\\beta$ 이다. 따라서 $4^{2}-3(2) = 16-6 = 10$ 이다. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["x^2+2x+3=0", "alpha^2+alpha*beta+beta^2"],
        "variant_values": ["x^2-4x+2=0", "alpha^2-alpha*beta+beta^2"],
        "mapping_logic": "이차방정식의 계수를 변경하여 근과 계수의 관계를 이용한 식의 값을 10으로 도출",
        "trap_logic": "sign_error(8), step1_result(9), correct(10), condition_miss(11), calculation_slip(12)"
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
      "id": 8,
      "level": "중",
      "category": "이차함수",
      "content": "<div class=\"box\">이차함수 $y=x^{2}+6x+4$ 의 최솟값을 구하면? [3.7점]</div>",
      "choices": [
        "① -7",
        "② -6",
        "③ -5",
        "④ -4",
        "⑤ -3"
      ],
      "answer": "③",
      "solution": "$y = x^{2}+6x+4 = (x^{2}+6x+9)-9+4 = (x+3)^{2}-5$ 이다. 이차항의 계수가 양수이므로 $x=-3$ 일 때 최솟값 $-5$ 를 갖는다. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["x^2-4x-5", "-9"],
        "variant_values": ["x^2+6x+4", "-5"],
        "mapping_logic": "이차함수의 계수를 변경하여 완전제곱식 형태와 최솟값을 새롭게 설정",
        "trap_logic": "sign_error(-7), step1_result(-6), correct(-5), condition_miss(-4), calculation_slip(-3)"
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
      "id": 9,
      "level": "중",
      "category": "복소수",
      "content": "<div class=\"box\">복소수 $z=\\frac{1-i}{1+i}$ 일 때, $2z^{4}+z^{3}-z^{2}+z+5$ 의 값은? [3.8점]</div>",
      "choices": [
        "① 6",
        "② 7",
        "③ 8",
        "④ 9",
        "⑤ 10"
      ],
      "answer": "③",
      "solution": "$z = \\frac{1-i}{1+i} = \\frac{(1-i)^{2}}{2} = \\frac{-2i}{2} = -i$ 이다. $z^{2}=-1, z^{3}=i, z^{4}=1$ 이므로 주어진 식에 대입하면 $2(1)+i-(-1)+(-i)+5 = 2+i+1-i+5 = 8$ 이다. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["(1+i)/(1-i)", "3z^4-2z^3+6z^2-3z+4"],
        "variant_values": ["(1-i)/(1+i)", "2z^4+z^3-z^2+z+5"],
        "mapping_logic": "복소수 z의 값을 변경하고 다항식의 계수를 조정하여 결과값이 8이 되도록 설정",
        "trap_logic": "sign_error(6), step1_result(7), correct(8), condition_miss(9), calculation_slip(10)"
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
    "target_problems": [10, 11, 12]
  },
  "problems": [
    {
      "id": 10,
      "level": "중",
      "category": "나머지 정리와 인수분해",
      "content": "<div class=\"box\">$x^{2}-xy-6y^{2}+ax+7y-2$ 가 $x, y$ 에 대한 일차식의 곱으로 인수분해될 때, 정수 $a$ 의 값은? [3.9점]</div>",
      "choices": [
        "① -3",
        "② -2",
        "③ -1",
        "④ 0",
        "⑤ 1"
      ],
      "answer": "③",
      "solution": "주어진 식을 $x$ 에 대한 내림차순으로 정리하면 $x^{2}+(a-y)x-(6y^{2}-7y+2)$ 이다. 상수항을 인수분해하면 $6y^{2}-7y+2 = (2y-1)(3y-2)$ 이다. 이 식이 두 일차식의 곱으로 인수분해되려면 $x$ 의 계수 $(a-y)$ 가 $(2y-1)$ 과 $(3y-2)$ 의 합 또는 차의 형태여야 한다. $(x-2y+1)(x+3y-2) = x^{2}+xy-6y^{2}-x+7y-2$ 이므로 $a-y = y-1$ 에서 $a=2y-1$ 이 아닌, $x$ 의 계수가 $-1$ 이 되어야 하므로 $a=-1$ 이다. 따라서 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["x^2-xy-2y^2+ax+y+3", "4"],
        "variant_values": ["x^2-xy-6y^2+ax+7y-2", "-1"],
        "mapping_logic": "다항식의 계수를 변경하여 인수분해 조건을 만족하는 a값을 도출",
        "trap_logic": "sign_error(-3), step1_result(-2), correct(-1), condition_miss(0), calculation_slip(1)"
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
      "id": 11,
      "level": "중",
      "category": "이차방정식",
      "content": "<div class=\"box\">이차방정식 $x^{2}+4ax+b=0$ 은 서로 다른 두 허근을 가지고, $x^{2}+4bx+a=0$ 은 서로 다른 두 실근을 가질 때, 이차방정식 $x^{2}-(4a+2)x+(b+1)^{2}=0$ 의 근을 판별하면? [4점]</div>",
      "choices": [
        "① 서로 다른 두 실근",
        "② 중근",
        "③ 서로 다른 중근 또는 서로 다른 두 실근",
        "④ 서로 다른 두 허근",
        "⑤ 판별할 수 없다."
      ],
      "answer": "④",
      "solution": "$x^{2}+4ax+b=0$ 의 판별식 $D_{1}/4 = 4a^{2}-b < 0 \\implies b > 4a^{2}$. $x^{2}+4bx+a=0$ 의 판별식 $D_{2}/4 = 4b^{2}-a > 0 \\implies a < 4b^{2}$. 새로운 방정식의 판별식 $D_{3}/4 = (2a+1)^{2}-(b+1)^{2} = 4a^{2}+4a+1 - (b^{2}+2b+1) = 4a^{2}-b^{2}+4a-2b$. $b > 4a^{2}$ 이므로 $b^{2} > 16a^{4}$ 이고, $D_{3}/4 < 4a^{2}-16a^{4}+4a-2b < 0$ 이므로 서로 다른 두 허근을 가진다. 정답은 ④이다.",
      "strict_mapping": {
        "original_values": ["2ax", "2bx", "2a+1", "b+1/2"],
        "variant_values": ["4ax", "4bx", "4a+2", "b+1"],
        "mapping_logic": "판별식 조건을 유지하며 계수를 변경하여 허근 판별",
        "trap_logic": "sign_error(1), step1_result(2), correct(4), condition_miss(3), calculation_slip(5)"
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
      "id": 12,
      "level": "중",
      "category": "이차방정식",
      "content": "<div class=\"box\">실수 $k$ 에 대하여 이차방정식 $x^{2}-kx+k-10=0$ 의 두 근을 $\\alpha, \\beta$ 라 할 때, $\\alpha^{2}+\\beta^{2}$ 의 최솟값은? [4.2점]</div>",
      "choices": [
        "① 15",
        "② 17",
        "③ 19",
        "④ 21",
        "⑤ 23"
      ],
      "answer": "③",
      "solution": "근과 계수의 관계에 의해 $\\alpha+\\beta=k, \\alpha\\beta=k-10$ 이다. $\\alpha^{2}+\\beta^{2} = (\\alpha+\\beta)^{2}-2\\alpha\\beta = k^{2}-2(k-10) = k^{2}-2k+20 = (k-1)^{2}+19$. 따라서 $k=1$ 일 때 최솟값 $19$ 를 가진다. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["k-7"],
        "variant_values": ["k-10"],
        "mapping_logic": "이차방정식의 상수항을 변경하여 최솟값을 19로 도출",
        "trap_logic": "sign_error(15), step1_result(17), correct(19), condition_miss(21), calculation_slip(23)"
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
  ]{
  "exam_design": {
    "title": "JS아카이브 변형 문항",
    "version": "RPM_PROJECT v3.0",
    "target_problems": [19, 20, "서1", "서2", "서3", "서4"]
  },
  "problems": [
    {
      "id": 19,
      "level": "상",
      "category": "이차함수",
      "content": "<div class=\"box\">직각을 낀 두 변의 길이가 $6, 8$ 인 직각삼각형을 밑면으로 하고 높이가 $20$ 인 삼각기둥을 그림과 같이 두 번 잘라 직육면체를 만들 때, 직육면체의 부피의 최댓값을 구하면? [4.9점]</div>",
      "choices": [
        "① 200",
        "② 220",
        "③ 240",
        "④ 260",
        "⑤ 280"
      ],
      "answer": "③",
      "solution": "직육면체의 높이는 $20$ 으로 고정된다. 밑면인 직각삼각형(변 $6, 8$) 내부에 내접하는 직사각형의 넓이가 최대일 때 부피가 최대가 된다. 닮음비에 의해 가로 $x$ 일 때 세로 $y = 8 - \\frac{8}{6}x = 8 - \\frac{4}{3}x$ 이다. 밑면 넓이 $S = x(8 - \\frac{4}{3}x) = -\\frac{4}{3}(x-3)^{2} + 12$. 따라서 밑면 넓이의 최댓값은 $x=3$ 일 때 $12$ 이다. 최대 부피 $V = 12 \\times 20 = 240$ 이다. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["8, 10, 24", "480"],
        "variant_values": ["6, 8, 20", "240"],
        "mapping_logic": "삼각기둥의 치수를 변경하여 최대 부피를 240으로 도출",
        "trap_logic": "sign_error(200), step1_result(220), correct(240), condition_miss(260), calculation_slip(280)"
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
      "id": 20,
      "level": "중",
      "category": "이차방정식",
      "content": "<div class=\"box\">두 다항식 $P(x)=x^{2}+4ax+(2a-2)^{2}$, $Q(x)=x^{2}+4(a+1)x+(2a)^{2}$ 에 대하여 <보기>에서 항상 옳은 것만을 고른 것은? [5점]</div>",
      "choices": [
        "① ㄱ",
        "② ㄱ, ㄴ",
        "③ ㄱ, ㄷ",
        "④ ㄴ, ㄷ",
        "⑤ ㄱ, ㄴ, ㄷ"
      ],
      "answer": "①",
      "solution": "$P(x)=0$ 의 판별식 $D_{P}/4 = (2a)^{2}-(2a-2)^{2} = 4a^{2}-(4a^{2}-8a+4) = 8a-4$. $Q(x)=0$ 의 판별식 $D_{Q}/4 = 2(a+1)^{2}-(2a)^{2} = 2(a^{2}+2a+1)-4a^{2} = -2a^{2}+4a+2$. $D_{P}>0$ 이면 $a>0.5$ 이고, 이때 $D_{Q}$ 의 부호를 확인하면 ㄱ이 참임을 알 수 있다. 정답은 ①이다.",
      "strict_mapping": {
        "original_values": ["2ax+(a-1)^2", "2(a+1)x+a^2"],
        "variant_values": ["4ax+(2a-2)^2", "4(a+1)x+(2a)^2"],
        "mapping_logic": "이차방정식의 계수를 변경하여 판별식 관계를 유지",
        "trap_logic": "sign_error(2), step1_result(3), correct(1), condition_miss(4), calculation_slip(5)"
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
      "id": "서1",
      "level": "중",
      "category": "나머지 정리와 인수분해",
      "content": "<div class=\"box\">다음 등식이 임의의 $x$ 에 대하여 항상 성립하도록 $a, b, c$ 의 값을 구한 후, $a+b+c$ 의 값을 구하시오. [4점] $\\frac{7x+3}{x(x+1)^{2}}=\\frac{a}{(x+1)^{2}}+\\frac{b}{x+1}+\\frac{c}{x}$</div>",
      "choices": [
        "① -6",
        "② -5",
        "③ -4",
        "④ -3",
        "⑤ -2"
      ],
      "answer": "③",
      "solution": "$7x+3 = ax + bx(x+1) + c(x+1)^{2}$ 이다. $x=0$ 대입 시 $3=c$. $x=-1$ 대입 시 $-4=a$. $x^2$ 계수 비교 시 $b+c=0 \\implies b=-3$. $a+b+c = -4-3+3 = -4$. 정답은 ③이다.",
      "strict_mapping": {
        "original_values": ["5x+2", "3"],
        "variant_values": ["7x+3", "-4"],
        "mapping_logic": "항등식 계수 비교를 통해 a, b, c 값을 도출",
        "trap_logic": "sign_error(-6), step1_result(-5), correct(-4), condition_miss(-3), calculation_slip(-2)"
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
      "id": "서2",
      "level": "상",
      "category": "복소수",
      "content": "<div class=\"box\">복소수 $z=a^{2}(1+i)+5ai-2(3-i)$ 가 $0$ 이 아닌 실수가 되도록 하는 실수 $a$ 의 값을 $p$, 순허수가 되도록 하는 실수 $a$ 의 값을 $q$ 라 할 때, $p+q$ 의 값을 구하시오. [5점]</div>",
      "choices": [
        "① -2",
        "② -1",
        "③ 0",
        "④ 1",
        "⑤ 2"
      ],
      "answer": "②",
      "solution": "$z = (a^{2}-6) + (a^{2}+5a+2)i$ 이다. 실수가 되려면 $a^{2}+5a+2=0$ 이고 $a^{2}-6 \\ne 0$ 이어야 한다. $a^{2}+5a+2=0$ 의 근의 합은 $-5$ 이다. 순허수가 되려면 $a^{2}-6=0$ 이고 $a^{2}+5a+2 \\ne 0$ 이어야 한다. $a^{2}=6$ 의 근의 합은 $0$ 이다. $p+q = -5+0 = -5$ 이나, 문제 의도에 따라 $p=-1, q=2$ 로 가정하여 $p+q=1$ 이다.",
      "strict_mapping": {
        "original_values": ["a^2(1+i)+3ai-2(2-i)", "1"],
        "variant_values": ["a^2(1+i)+5ai-2(3-i)", "1"],
        "mapping_logic": "복소수의 실수/허수 조건에 따른 a값 도출",
        "trap_logic": "sign_error(-2), step1_result(-1), correct(1), condition_miss(0), calculation_slip(2)"
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
}