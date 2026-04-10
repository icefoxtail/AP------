/**
 * 20_풍덕중2_1학기_중간_중2 (무결성 검증 및 입고 V3.0)
 * 파일명: 20_풍덕중2_1학기_중간_중2.js
 * 적용 매뉴얼: AP수학 무결성 해설 & 엔진 가동 매뉴얼 v1.3 [IRONCLAD]
 */

window.examTitle = "20_풍덕중2_1학기_중간_중2";

window.questionBank = [
    {
        "id": 1,
        "level": "하",
        "tags": ["하"],
        "category": "순환소수의 표현",
        "content": "다음 중에서 순환소수의 표현으로 옳지 않은 것은? [4점]",
        "choices": [
            "$4.545454\\dots = 4.\\dot{5}\\dot{4}$",
            "$0.232323\\dots = 0.\\dot{2}\\dot{3}$",
            "$0.333\\dots = 0.\\dot{3}$",
            "$0.0272727\\dots = 0.0\\dot{2}\\dot{7}$",
            "$2.374374374\\dots = 2.37\\dot{4}$"
        ],
        "answer": "⑤",
        "solution_steps": [
            "1단계: 순환소수에서 순환마디는 소수점 아래에서 일정하게 반복되는 부분이며, 양 끝의 숫자 위에 점을 찍어 나타낸다. [cite: 2026-04-09]",
            "2단계: $2.374374374\\dots$에서 소수점 아래 반복되는 구간(순환마디)은 $374$이다. [cite: 2026-04-09]",
            "3단계: 순환마디가 세 자리 이상일 때는 양 끝 숫자 위에만 점을 찍으므로 $2.\\dot{3}7\\dot{4}$로 표기해야 옳다. [cite: 2026-04-09]"
        ],
        "error_check": "⑤번 순환마디 끝점 확인: $3, 7, 4$ 중 $3$과 $4$에만 점 찍힘 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 2,
        "level": "하",
        "tags": ["중하"],
        "category": "유한소수 판별",
        "content": "다음 <보기> 중 유한소수로 나타낼 수 있는 것을 모두 고른 것은? [4점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. $\\frac{1}{2^3 \\times 5}$ &nbsp; ㄴ. $\\frac{33}{2 \\times 3 \\times 5^2}$ <br> ㄷ. $\\frac{1}{2 \\times 7}$ &nbsp; ㄹ. $\\frac{21}{140}$</div>",
        "choices": ["ㄱ, ㄴ", "ㄱ, ㄹ", "ㄴ, ㄹ", "ㄱ, ㄴ, ㄹ", "ㄱ, ㄴ, ㄷ, ㄹ"],
        "answer": "④",
        "solution_steps": [
            "1단계: 기약분수로 나타내었을 때 분모의 소인수가 $2$ 또는 $5$뿐인 분수는 유한소수로 나타낼 수 있다. [cite: 2026-04-09]",
            "2단계: ㄱ. 분모 소인수 $2, 5$ (유한), ㄴ. $\\frac{11}{2 \\times 5^2}$ (유한), ㄷ. 분모 소인수 $7$ (무한)이다. [cite: 2026-04-09]",
            "3단계: ㄹ. $\\frac{21}{140} = \\frac{3}{20} = \\frac{3}{2^2 \\times 5}$ 이므로 분모 소인수가 $2, 5$뿐이다(유한). 따라서 ㄱ, ㄴ, ㄹ이다. [cite: 2026-04-09]"
        ],
        "error_check": "ㄹ번 약분 검증: $\\frac{21}{140} = \\frac{3}{20}$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 3,
        "level": "중",
        "tags": ["중"],
        "category": "순환소수가 되는 조건",
        "content": "분수 $\\frac{7}{5^2 \\times x}$를 순환소수로만 나타낼 수 있을 때, $10$ 이하의 자연수 $x$가 될 수 있는 모든 수들의 합을 구하면? [4점]",
        "choices": ["17", "18", "19", "20", "21"],
        "answer": "②",
        "solution_steps": [
            "1단계: 순환소수가 되려면 기약분수의 분모에 $2, 5$ 이외의 소인수가 존재해야 한다. [cite: 2026-04-09]",
            "2단계: $x \\in \\{1, 2, \\dots, 10\\}$ 중 $2, 5$ 이외의 소인수를 가진 후보는 $3, 6, 7, 9$이다. [cite: 2026-04-09]",
            "3단계: $x=7$인 경우 분자의 $7$과 약분되어 분모에 $2, 5$만 남으므로 제외된다. 따라서 가능한 $x$는 $3, 6, 9$이며 합은 $3+6+9=18$이다. [cite: 2026-04-09]"
        ],
        "error_check": "$x=7$ 대입 시 $\\frac{7}{25 \\times 7} = \\frac{1}{25}$ (유한) 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 4,
        "level": "하",
        "tags": ["하"],
        "category": "순환소수의 분수 표현",
        "content": "순환소수 $x=0.2\\dot{2}\\dot{7}$을 $10$의 거듭제곱을 이용하여 분수로 나타내려고 할 때, 가장 편리한 식은? [4점]",
        "choices": ["$100x - x$", "$100x - 10x$", "$1000x - x$", "$1000x - 10x$", "$1000x - 100x$"],
        "answer": "④",
        "solution_steps": [
            "1단계: 순환소수 $x = 0.2272727\\dots$에서 소수점 아래 부분이 일치하는 두 식을 만든다. [cite: 2026-04-09]",
            "2단계: $1000x = 227.2727\\dots$이고, $10x = 2.2727\\dots$이다. [cite: 2026-04-09]",
            "3단계: 두 식을 빼면 소수점 아래 부분이 소거되므로 $1000x - 10x$가 가장 적절하다. [cite: 2026-04-09]"
        ],
        "error_check": "소수점 아래 일치 여부: $1000x$와 $10x$ 모두 $.2727\\dots$로 일치 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 5,
        "level": "중",
        "tags": ["중"],
        "category": "유리수와 소수 관계",
        "content": "다음 중 옳은 것을 모두 고르면? (정답 2개) [4점]",
        "choices": [
            "모든 순환소수는 유리수이다.",
            "유한소수와 무한소수는 유리수이다.",
            "분수로 나타낼 수 없는 순환소수도 있다.",
            "모든 기약분수는 유한소수로 나타낼 수 있다.",
            "정수가 아닌 유리수는 유한소수 또는 순환소수로 나타낼 수 있다."
        ],
        "answer": "①, ⑤",
        "solution_steps": [
            "1단계: 순환소수는 모두 분수 꼴로 나타낼 수 있으므로 유리수이다(① 참). [cite: 2026-04-09]",
            "2단계: 무한소수 중 비순환 무한소수는 유리수가 아니며(② 거짓), 모든 순환소수는 분수 표현이 가능하다(③ 거짓). [cite: 2026-04-09]",
            "3단계: 기약분수 중 분모에 $2, 5$ 이외의 소인수가 있으면 순환소수가 되며(④ 거짓), 정수가 아닌 유리수는 유한소수나 순환소수로 분류된다(⑤ 참). [cite: 2026-04-09]"
        ],
        "error_check": "정답 개수 확인: 문제 조건(정답 2개)과 일치 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 6,
        "level": "중",
        "tags": ["중하"],
        "category": "지수법칙",
        "content": "다음 <보기> 중 식을 간단히 한 결과가 옳은 것은 모두 몇 개인가? [4점]<br><div style='border:1px solid #000; padding:5px;'>ㄱ. $a^3 \\times a = a^4$ <br> ㄴ. $(a^3)^2 = a^6$ <br> ㄷ. $a^3 \\div a^5 = a^2$ <br> ㄹ. $(-\\frac{a^2}{b^3})^2 = \\frac{a^4}{b^6}$ <br> ㅁ. $(a^4)^2 \\times (b^2)^3 = a^{14}$</div>",
        "choices": ["1개", "2개", "3개", "4개", "5개"],
        "answer": "③",
        "solution_steps": [
            "1단계: ㄱ. $a^{3+1}=a^4$ (참), ㄴ. $a^{3 \\times 2}=a^6$ (참)이다. [cite: 2026-04-09]",
            "2단계: ㄷ. $a^3 \\div a^5 = \\frac{1}{a^2}$이므로 거짓이고, ㄹ. $(-1)^2 \\frac{a^4}{b^6} = \\frac{a^4}{b^6}$ (참)이다. [cite: 2026-04-09]",
            "3단계: ㅁ. $a^8 \\times b^6$이므로 $a^{14}$이 될 수 없다(거짓). 따라서 옳은 것은 ㄱ, ㄴ, ㄹ로 3개이다. [cite: 2026-04-09]"
        ],
        "error_check": "ㄷ번 나눗셈 검증: 지수가 뒤가 크면 분수 형태 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 7,
        "level": "중",
        "tags": ["중"],
        "category": "지수법칙 응용",
        "content": "$3^3 = A$라고 할 때, $\\frac{1}{81^3}$을 $A$를 사용하여 나타내면? [4점]",
        "choices": ["$\\frac{1}{A^3}$", "$A^3$", "$\\frac{1}{A^4}$", "$A^4$", "$\\frac{1}{A^5}$"],
        "answer": "③",
        "solution_steps": [
            "1단계: $81$을 소인수분해하면 $3^4$이므로 $81^3 = (3^4)^3 = 3^{12}$이다. [cite: 2026-04-09]",
            "2단계: $A = 3^3$을 이용하여 $3^{12}$을 표현하면 $(3^3)^4 = A^4$이다. [cite: 2026-04-09]",
            "3단계: 따라서 $\\frac{1}{81^3} = \\frac{1}{3^{12}} = \\frac{1}{A^4}$이다. [cite: 2026-04-09]"
        ],
        "error_check": "지수 법칙 확인: $(3^4)^3 = 3^{12}$, $(3^3)^4 = 3^{12}$ 일치 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 8,
        "level": "중",
        "tags": ["중"],
        "category": "지수법칙 미지수 구하기",
        "content": "다음 조건을 모두 만족시키는 세 자연수 $a, b, c$에 대해 $a+b+c$의 값을 구하면? [4점]<br>(1) $(\\frac{2}{3^a})^5 = \\frac{2^5}{3^{20}}$ <br>(2) $(\\frac{7^a}{5^2})^4 = \\frac{7^c}{5^b}$",
        "choices": ["22", "24", "26", "28", "30"],
        "answer": "④",
        "solution_steps": [
            "1단계: 조건 (1)에서 $\\frac{2^5}{3^{5a}} = \\frac{2^5}{3^{20}}$이므로 $5a=20$, $a=4$이다. [cite: 2026-04-09]",
            "2단계: 조건 (2)에 $a=4$를 대입하면 $(\\frac{7^4}{5^2})^4 = \\frac{7^{16}}{5^8}$이므로 $c=16, b=8$이다. [cite: 2026-04-09]",
            "3단계: $a+b+c = 4+8+16 = 28$이다. [cite: 2026-04-09]"
        ],
        "error_check": "합산 검증: $4+8+16=28$ 확인 완료. [cite: 2026-04-09]"
    }
    ,
    {
        "id": 9,
        "level": "하",
        "tags": ["하"],
        "category": "단항식의 계산",
        "content": "다음 중 계산 결과가 옳지 않은 것은? [4점]",
        "choices": [
            "$4x^2 \\times (-5x^3) = 20x^5$",
            "$3x^3 \\times (-xy^2) = -3x^4y^2$",
            "$(3x^2)^2 \\div (-27x^{11}) = -\\frac{1}{3x^7}$",
            "$12x^4 \\div \\frac{4}{3}x^3 = 9x$",
            "$9x^2 \\times 4x^3 \\div 6x^4 = 6x$"
        ],
        "answer": "①",
        "solution_steps": [
            "1단계: ① $4x^2 \\times (-5x^3)$의 계수를 계산하면 $4 \\times (-5) = -20$이다. [cite: 2026-04-09]",
            "2단계: 지수법칙에 의해 문자를 계산하면 $x^2 \\times x^3 = x^{2+3} = x^5$이다. [cite: 2026-04-09]",
            "3단계: 따라서 결과는 $-20x^5$이 되어야 하므로 $20x^5$로 표기된 ①번은 옳지 않다. [cite: 2026-04-09]"
        ],
        "error_check": "부호 검증: (+) × (-) = (-)임을 재확인하여 ①번 오류 확정. [cite: 2026-04-09]"
    },
    {
        "id": 10,
        "level": "중",
        "tags": ["중"],
        "category": "단항식의 계산 활용",
        "content": "삼각형의 넓이가 $50x^2y^8$이고 밑변의 길이가 $20x^3y$일 때, 이 삼각형의 높이를 구하면? [4점]",
        "choices": [
            "$4x^3y^8$",
            "$4x^4y^8$",
            "$5x^2y^2$",
            "$5x^3y^8$",
            "$\\frac{5y^7}{x}$"
        ],
        "answer": "⑤",
        "solution_steps": [
            "1단계: 삼각형의 넓이 공식은 $\\text{넓이} = \\frac{1}{2} \\times \\text{밑변} \\times \\text{높이}$이다. [cite: 2026-04-09]",
            "2단계: $50x^2y^8 = \\frac{1}{2} \\times 20x^3y \\times h$ 식을 세우면 $50x^2y^8 = 10x^3y \\times h$이다. [cite: 2026-04-09]",
            "3단계: $h = \\frac{50x^2y^8}{10x^3y} = 5 \\times x^{2-3} \\times y^{8-1} = 5x^{-1}y^7 = \\frac{5y^7}{x}$이다. [cite: 2026-04-09]"
        ],
        "error_check": "역산 검증: $\\frac{1}{2} \\times 20x^3y \\times \\frac{5y^7}{x} = 50x^2y^8$ 성립 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 11,
        "level": "하",
        "tags": ["하"],
        "category": "이등변삼각형의 성질",
        "content": "$\\overline{AB} = \\overline{AC}$인 이등변삼각형 $ABC$에서 $\\angle C$의 외각의 크기가 $130^\\circ$일 때, $\\angle A$의 크기는? [4점]<br><svg width='160' height='120' viewBox='0 0 160 120'><path d='M80,20 L40,100 L120,100 Z M120,100 L150,100' fill='none' stroke='black'/><text x='75' y='15' font-size='10'>A</text><text x='30' y='110' font-size='10'>B</text><text x='115' y='110' font-size='10'>C</text><path d='M130,100 A10,10 0 0 0 125,95' fill='none' stroke='black'/><text x='130' y='90' font-size='9'>130°</text></svg>",
        "answer": "⑤",
        "solution_steps": [
            "1단계: 평각의 성질에 의해 $\\angle C = 180^\\circ - 130^\\circ = 50^\\circ$이다. [cite: 2026-04-09]",
            "2단계: $\\triangle ABC$는 $\\overline{AB}=\\overline{AC}$인 이등변삼각형이므로 두 밑각의 크기가 같다. $\\therefore \\angle B = \\angle C = 50^\\circ$. [cite: 2026-04-09]",
            "3단계: 삼각형의 세 내각의 합은 $180^\\circ$이므로 $\\angle A = 180^\\circ - (50^\\circ + 50^\\circ) = 80^\\circ$이다. [cite: 2026-04-09]"
        ],
        "error_check": "내각 합 검증: $80+50+50=180$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 12,
        "level": "중",
        "tags": ["중"],
        "category": "이등변삼각형의 성질",
        "content": "$\\overline{AB} = \\overline{AC}$인 이등변삼각형에서 $\\angle B$의 이등분선과 $\\overline{AC}$의 교점을 $D$라 하자. $\\angle A = 36^\\circ$일 때 다음 중 옳지 않은 것은? [4점]",
        "choices": [
            "$\\angle ABD = 36^\\circ$",
            "$\\overline{AD} = \\overline{BD} = \\overline{BC}$",
            "$\\angle ADB = 112^\\circ$",
            "$\\triangle ABD$는 이등변삼각형이다.",
            "$\\triangle BCD$는 이등변삼각형이다."
        ],
        "answer": "③",
        "solution_steps": [
            "1단계: $\\angle B = \\angle C = \\frac{180^\\circ - 36^\\circ}{2} = 72^\\circ$이고, $\\angle B$의 이등분선에 의해 $\\angle ABD = \\angle DBC = 36^\\circ$이다. [cite: 2026-04-09]",
            "2단계: $\\triangle ABD$에서 $\\angle A = \\angle ABD = 36^\\circ$이므로 $\\overline{AD}=\\overline{BD}$인 이등변삼각형이다. [cite: 2026-04-09]",
            "3단계: $\\triangle BCD$에서 $\\angle BDC = 180^\\circ - (36^\\circ + 72^\\circ) = 72^\\circ$이므로 $\\overline{BD}=\\overline{BC}$인 이등변삼각형이다. [cite: 2026-04-09]",
            "4단계: 따라서 $\\angle ADB = 180^\\circ - 72^\\circ = 108^\\circ$이므로 ③번 $112^\\circ$는 옳지 않다. [cite: 2026-04-09]"
        ],
        "error_check": "외각 성질 검증: $\\angle ADB = \\angle DBC + \\angle C = 36+72=108$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 13,
        "level": "하",
        "tags": ["하"],
        "category": "피타고라스 정리",
        "content": "직각삼각형 $ABC$에서 직각을 낀 두 변의 길이가 각각 $6, 8$일 때, 빗변 $x$의 길이는? [4점]<br><svg width='160' height='120' viewBox='0 0 160 120'><path d='M30,100 L110,100 L30,40 Z' fill='none' stroke='black'/><rect x='30' y='90' width='10' height='10' fill='none' stroke='black'/><text x='65' y='112' font-size='10'>8</text><text x='18' y='75' font-size='10'>6</text><text x='75' y='65' font-size='10'>x</text></svg>",
        "choices": ["$8$", "$10$", "$12$", "$14$", "$16$"],
        "answer": "②",
        "solution_steps": [
            "1단계: 피타고라스 정리에 의해 직각삼각형에서 빗변의 길이의 제곱은 나머지 두 변의 길이의 제곱의 합과 같다. [cite: 2026-04-09]",
            "2단계: $x^2 = 6^2 + 8^2 = 36 + 64 = 100$이다. [cite: 2026-04-09]",
            "3단계: $x > 0$이므로 $x = 10$이다. [cite: 2026-04-09]"
        ],
        "error_check": "피타고라스 수 확인: (6, 8, 10) 성립 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 14,
        "level": "중",
        "tags": ["중"],
        "category": "피타고라스 정리 활용",
        "content": "그림은 직각삼각형 $ABC$의 세 변을 한 변으로 하는 세 정사각형 $AFGB, IBHC, ACDE$를 그린 것이다. $AFGB$의 넓이가 $46\\text{cm}^2$, $IBHC$의 넓이가 $25\\text{cm}^2$일 때, $ACDE$의 넓이는? [4점]<br><Figure src='image_d7bada.png' />",
        "choices": ["$14\\text{cm}^2$", "$16\\text{cm}^2$", "$18\\text{cm}^2$", "$21\\text{cm}^2$", "$23\\text{cm}^2$"],
        "answer": "④",
        "solution_steps": [
            "1단계: 직각삼각형의 각 변을 한 변으로 하는 세 정사각형의 넓이 사이에는 빗변 위의 정사각형 넓이가 나머지 두 정사각형 넓이의 합과 같다는 성질이 있다. [cite: 2026-04-09]",
            "2단계: $(\\text{정사각형 } AFGB) = (\\text{정사각형 } ACDE) + (\\text{정사각형 } IBHC)$이다. [cite: 2026-04-09]",
            "3단계: $46 = ACDE + 25$이므로 $ACDE = 46 - 25 = 21$이다. 따라서 $21\\text{cm}^2$이다. [cite: 2026-04-09]"
        ],
        "error_check": "덧셈 검증: $21+25=46$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 15,
        "level": "하",
        "tags": ["하"],
        "category": "삼각형의 분류",
        "content": "삼각형의 세 변의 길이가 다음과 같을 때, 예각삼각형인 것은? [4점]",
        "choices": [
            "$2, 2, 3$",
            "$2, 3, 4$",
            "$3, 4, 5$",
            "$4, 5, 6$",
            "$5, 12, 13$"
        ],
        "answer": "④",
        "solution_steps": [
            "1단계: 가장 긴 변의 길이를 $c$, 나머지 두 변의 길이를 $a, b$라 할 때 $c^2 < a^2 + b^2$이면 예각삼각형이다. [cite: 2026-04-09]",
            "2단계: ④번의 경우 $6^2 = 36$이고 $4^2 + 5^2 = 16 + 25 = 41$이다. [cite: 2026-04-09]",
            "3단계: $36 < 41$이 성립하므로 예각삼각형이다. [cite: 2026-04-09]"
        ],
        "error_check": "다른 보기 검증: ③ $25=9+16$ (직각), ⑤ $169=25+144$ (직각) 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 16,
        "level": "중",
        "tags": ["중"],
        "category": "삼각형의 내심",
        "content": "점 $I$는 $\\triangle ABC$의 내심이고, $\\angle BIC = 110^\\circ$일 때, $\\angle A$의 크기는? [4점]<br><svg width='160' height='120' viewBox='0 0 160 120'><path d='M80,20 L30,100 L130,100 Z M30,100 L80,75 L130,100' fill='none' stroke='black'/><circle cx='80' cy='75' r='2' fill='black'/><text x='75' y='15' font-size='10'>A</text><text x='20' y='105' font-size='10'>B</text><text x='135' y='105' font-size='10'>C</text><text x='78' y='72' font-size='9'>I</text><text x='70' y='92' font-size='9'>110°</text></svg>",
        "choices": ["$37^\\circ$", "$40^\\circ$", "$45^\\circ$", "$50^\\circ$", "$55^\\circ$"],
        "answer": "②",
        "solution_steps": [
            "1단계: 삼각형의 내심 $I$에 대하여 $\\angle BIC = 90^\\circ + \\frac{1}{2}\\angle A$의 관계가 성립한다. [cite: 2026-04-09]",
            "2단계: $110^\circ = 90^\circ + \\frac{1}{2}\\angle A$ 식을 세워 정리하면 $20^\circ = \\frac{1}{2}\\angle A$이다. [cite: 2026-04-09]",
            "3단계: 따라서 $\\angle A = 40^\circ$이다. [cite: 2026-04-09]"
        ],
        "error_check": "공식 역대입: $90 + 20 = 110$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 17,
        "level": "중",
        "tags": ["중하"],
        "category": "삼각형의 내심 활용",
        "content": "그림에서 점 $I$는 $\\triangle ABC$의 내심이다. $\\triangle ABC$의 둘레의 길이가 $22\\text{cm}$이고 $\\overline{AD}=4\\text{cm}$, $\\overline{DB}=5\\text{cm}$일 때, $\\overline{EC}$의 길이를 구하면? [4점]<br><svg width='160' height='120' viewBox='0 0 160 120'><path d='Point A(80,10) B(20,100) C(140,100) Circle I(80,70) r=30' fill='none' stroke='black'/><text x='75' y='8' font-size='10'>A</text><text x='10' y='105' font-size='10'>B</text><text x='145' y='105' font-size='10'>C</text><text x='80' y='75' font-size='10'>I</text><line x1='50' y1='55' x2='50' y2='55' stroke='black'/><text x='40' y='55' font-size='9'>D</text><text x='115' y='55' font-size='9'>F</text><text x='80' y='110' font-size='9'>E</text></svg>",
        "choices": ["$1\\text{cm}$", "$1.2\\text{cm}$", "$1.5\\text{cm}$", "$2\\text{cm}$", "$2.5\\text{cm}$"],
        "answer": "④",
        "solution_steps": [
            "1단계: 삼각형의 내심에서 세 변에 내린 접점까지의 거리는 같으므로 $\\overline{AF}=\\overline{AD}=4\\text{cm}$, $\\overline{BE}=\\overline{DB}=5\\text{cm}$이다. [cite: 2026-04-09]",
            "2단계: $\\overline{CE}=\\overline{CF}=x$라 하면 $\\triangle ABC$의 둘레는 $2(\\overline{AD}+\\overline{DB}+\\overline{CE}) = 2(4+5+x) = 22$이다. [cite: 2026-04-09]",
            "3단계: $9+x=11$에서 $x=2$이므로 $\\overline{EC}=2\\text{cm}$이다. [cite: 2026-04-09]"
        ],
        "error_check": "둘레 계산: $2(4+5+2) = 22$ 성립 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 18,
        "level": "하",
        "tags": ["중하"],
        "category": "삼각형의 외심",
        "content": "그림에서 점 $O$가 $\\triangle ABC$의 외심일 때, $\\angle OBC$의 크기를 구하면? [4점]<br><svg width='160' height='120' viewBox='0 0 160 120'><circle cx='80' cy='60' r='50' fill='none' stroke='black'/><path d='M80,10 L30,60 L130,60 Z M80,60 L80,10 M80,60 L30,60 M80,60 L130,60' fill='none' stroke='black'/><text x='75' y='55' font-size='10'>O</text><text x='25' y='35' font-size='9'>30°</text><text x='105' y='35' font-size='9'>40°</text></svg>",
        "choices": ["$18^\\circ$", "$20^\\circ$", "$22^\\circ$", "$24^\\circ$", "$25^\\circ$"],
        "answer": "②",
        "solution_steps": [
            "1단계: 삼각형의 외심에서 세 꼭짓점에 이르는 거리는 같으므로 $\\triangle OAB$, $\\triangle OBC$, $\\triangle OCA$는 모두 이등변삼각형이다. [cite: 2026-04-09]",
            "2단계: 외심의 성질에 의해 $\\angle OAB + \\angle OBC + $\\angle OCA = 90^\\circ$가 성립한다. [cite: 2026-04-09]",
            "3단계: $30^\\circ + \\angle OBC + 40^\\circ = 90^\\circ$에서 $\\angle OBC = 20^\\circ$이다. [cite: 2026-04-09]"
        ],
        "error_check": "각도 합 검증: $30+20+40=90$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 19,
        "level": "상",
        "tags": ["중"],
        "category": "일차부등식",
        "content": "일차부등식 $x+1 \\le 3(x-3)$의 해가 일차부등식 $5x-a \\ge 4x+2$의 해와 같을 때, $a$의 값은? [5점]",
        "choices": ["$3$", "$2$", "$1$", "$0$", "$-1$"],
        "answer": "①",
        "solution_steps": [
            "1단계: $x+1 \\le 3x-9$를 정리하면 $2x \\ge 10$, 즉 $x \\ge 5$이다. [cite: 2026-04-09]",
            "2단계: $5x-a \\ge 4x+2$를 정리하면 $x \\ge a+2$이다. [cite: 2026-04-09]",
            "3단계: 두 부등식의 해가 같으므로 $a+2=5$에서 $a=3$이다. [cite: 2026-04-09]"
        ],
        "error_check": "$a=3$ 대입 시 $x \\ge 3+2=5$로 일치함 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 20,
        "level": "중",
        "tags": ["중"],
        "category": "삼각형의 성질",
        "content": "삼각형의 성질이 옳으면 '예' 방향으로 이동하고, 옳지 않으면 '아니오' 방향으로 이동할 때, 도착지는? [4점]<br><Figure src='image_d76062.jpg' />",
        "choices": ["서울", "대전", "대구", "부산", "광주/순천"],
        "answer": "③",
        "solution_steps": [
            "1단계: '두 내각의 크기가 같은 삼각형은 이등변삼각형이다'는 참이므로 '예' 방향으로 이동한다. [cite: 2026-04-10]",
            "2단계: '한 변의 길이와 한 예각의 크기가 각각 같은 두 직각삼각형은 서로 합동이다'는 RHA 합동으로 참이므로 '예' 방향으로 이동한다. [cite: 2026-04-10]",
            "3단계: '삼각형의 내접원의 중심에서 세 꼭짓점에 이르는 거리는 같다'는 거짓(외심의 성질)이므로 '아니오' 방향으로 이동한다. [cite: 2026-04-10]",
            "4단계: 최종 도착지는 '대구'이다. [cite: 2026-04-10]"
        ],
        "error_check": "이미지 내 논리 경로 추적 결과 '대구' 도달 확인 완료. [cite: 2026-04-10]"
    },
    {
        "id": 21,
        "level": "중",
        "tags": ["중하"],
        "category": "순환소수의 자릿수",
        "content": "[서술형 1] 순환소수 $0.\\dot{1}5384\\dot{6}$에 대하여 (1) 순환마디를 구하고, (2) 소수점 아래 $100$번째 자리의 숫자를 구하시오. [5점]",
        "choices": [],
        "answer": "(1) 153846 (2) 8",
        "solution_steps": [
            "1단계: 순환소수 $0.\\dot{1}5384\\dot{6}$의 순환마디는 반복되는 구간인 $1, 5, 3, 8, 4, 6$이다. [cite: 2026-04-09]",
            "2단계: 순환마디의 길이는 $6$이므로 $100$을 $6$으로 나누면 $100 = 6 \\times 16 + 4$이다. [cite: 2026-04-09]",
            "3단계: 나머지가 $4$이므로 순환마디의 $4$번째 숫자인 $8$이 $100$번째 자리의 숫자이다. [cite: 2026-04-09]"
        ],
        "error_check": "$100 = 66+34 = 96+4$ 연산 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 22,
        "level": "중",
        "tags": ["중"],
        "category": "단항식의 계산",
        "content": "[서술형 2] 단항식 $A$에 $2a^2b$를 나누어야 할 것을 잘못하여 곱하였더니 $16a^4b^3$이 되었다. 바르게 계산한 답을 구하시오. [6점]",
        "choices": [],
        "answer": "$4b$",
        "solution_steps": [
            "1단계: 잘못된 식 $A \\times 2a^2b = 16a^4b^3$에서 $A = \\frac{16a^4b^3}{2a^2b} = 8a^2b^2$이다. [cite: 2026-04-09]",
            "2단계: 바른 계산은 $A \\div 2a^2b$이므로 $8a^2b^2 \\div 2a^2b$를 계산한다. [cite: 2026-04-09]",
            "3단계: 계수는 $8 \\div 2 = 4$, 문자는 $a^2 \\div a^2 = 1, b^2 \\div b = b$이므로 최종 결과는 $4b$이다. [cite: 2026-04-09]"
        ],
        "error_check": "$4b \\times 2a^2b \\times 2a^2b = 16a^4b^3$ 성립 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 23,
        "level": "상",
        "tags": ["중"],
        "category": "삼각형의 내심과 외심",
        "content": "[서술형 3] $\\angle C=90^\\circ$인 직각삼각형 $ABC$에서 외접원의 반지름의 길이와 내접원의 반지름의 길이를 각각 구하시오. (단, $\\overline{AB}=20\\text{cm}, \\overline{AC}=12\\text{cm}, \\overline{BC}=16\\text{cm}$) [5점]<br><Figure src='image_d7bada.png' />",
        "choices": [],
        "answer": "외접원: $10\\text{cm}$, 내접원: $4\\text{cm}$",
        "solution_steps": [
            "1단계: 직각삼각형의 외심은 빗변의 중점이므로 외접원의 반지름 $R = \\frac{1}{2}\\overline{AB} = \\frac{20}{2} = 10\\text{cm}$이다. [cite: 2026-04-09]",
            "2단계: $\\triangle ABC$의 넓이는 $\\frac{1}{2} \\times 16 \\times 12 = 96\\text{cm}^2$이다. [cite: 2026-04-09]",
            "3단계: 내접원의 반지름을 $r$이라 하면 $96 = \\frac{1}{2}r(20+16+12) = 24r$에서 $r=4\\text{cm}$이다. [cite: 2026-04-09]"
        ],
        "error_check": "내접원 공식 $r = \\frac{16+12-20}{2} = \\frac{8}{2} = 4$ 확인 완료. [cite: 2026-04-09]"
    },
    {
        "id": 24,
        "level": "하",
        "tags": ["하"],
        "category": "삼각형의 외심의 정의",
        "content": "[서술형 4] 세 나무로부터 거리가 같은 보물이 묻힌 곳의 위치를 찾는 방법을 외심의 성질을 이용하여 서술하시오. [4점]",
        "choices": [],
        "answer": "삼각형의 세 변의 수직이등분선의 교점(외심)을 찾는다.",
        "solution_steps": [
            "1단계: 세 나무를 꼭짓점으로 하는 삼각형을 가정할 때, 세 꼭짓점으로부터 같은 거리에 있는 점은 외심이다. [cite: 2026-04-10]",
            "2단계: 삼각형의 외심은 세 변의 수직이등분선의 교점이다. [cite: 2026-04-10]",
            "3단계: 따라서 세 변의 수직이등분선을 그어 만나는 점을 찾으면 보물의 위치를 알 수 있다. [cite: 2026-04-10]"
        ],
        "error_check": "외심의 정의와 성질(꼭짓점까지의 거리 동일) 일치 확인 완료. [cite: 2026-04-10]"
    }
];