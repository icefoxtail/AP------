\`\`\`json:exam  
{  
  "stem": "25\_풍덕중\_2학기\_기말\_중1\_유사",  
  "sourceArchiveFile": "original/middle/m1/2final/25\_풍덕중\_2학기\_기말\_중1\_기출.js",  
  "examFolder": "2final",  
  "grade": "중1",  
  "curriculum": "2022",  
  "questionCount": 23,  
  "totalScore": 100,  
  "generatedAt": "2026-11-12"  
}  
\`\`\`

\#\# Q01  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
다음 입체도형 중 다면체가 아닌 것은? \[3점\]  
\#\#\# 선지  
① 원기둥 ② 각기둥 ③ 삼각뿔 ④ 오각기둥 ⑤ 육각뿔대  
\#\#\# 정답  
①  
\#\#\# 해설  
다면체는 다각형인 면으로만 둘러싸인 입체도형이다.

① 원기둥은 위아래 밑면이 원이고 옆면이 굽은 곡면으로 이루어진 회전체이므로 다면체가 아니다.  
② 사각기둥, ③ 삼각뿔, ④ 오각기둥, ⑤ 육각뿔대는 모든 면이 다각형(삼각형, 사각형 등)으로 둘러싸여 있으므로 모두 다면체이다.

따라서 다면체가 아닌 것은 ①이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "다각형 면 구성 여부에 따른 다면체와 곡면 회전체 구별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "1",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE",  
  "conceptClusterKey": "SOLID\_FIGURE",  
  "primaryMethod": "원기둥은 옆면이 곡면이므로 다면체가 아님을 확인한다.",  
  "decisiveStep": "원기둥의 곡면 특성 식별",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 성질",  
    "l3": "다면체",  
    "l4": "다면체의 정의와 구분"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_POLYHEDRON\_EDGE\_FACE\_RELATIONS",  
    "templateKey": "TPL\_M1\_POLYHEDRON\_EDGE\_FACE\_RELATIONS\_FACE\_PROPERTY\_AUDIT",  
    "why": "다면체의 정의를 적용하여 다면체와 회전체를 구분하는 기본 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "다면체의 기본 정의에 따라 곡면을 가진 입체를 가려내는 1단계 판정",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "다면체",  
      "원기둥",  
      "각기둥",  
      "각뿔대"  
    \],  
    "goal": \[  
      "다면체"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q02  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
육각뿔대의 특징에 대한 설명으로 옳지 않은 것은? \[4점\]  
\#\#\# 선지  
① 두 밑면은 서로 평행하지만 합동은 아니다. ② 육각뿔대는 칠면체이다. ③ 육각뿔대의 옆면의 모양은 모두 사다리꼴이다. ④ 육각뿔대의 꼭짓점의 개수는 \$12\$개이다. ⑤ 육각뿔을 밑면에 평행한 평면으로 잘라 생기는 두 입체도형 중 각뿔이 아닌 쪽의 도형이다.  
\#\#\# 정답  
②  
\#\#\# 해설  
육각뿔대의 구성 요소와 기하학적 성질을 검토한다.

① 각뿔대의 두 밑면은 평행하지만 크기가 다르므로 합동이 아니다. (참)  
② \$n\$각뿔대의 면의 개수는 밑면 \$2\$개와 옆면 \$n\$개이므로 \$n+2\$개이다. 육각뿔대는 \$6 \+ 2 \= 8\$개이므로 팔면체이다. 칠면체라고 한 설명은 옳지 않다. (거짓)  
③ 각뿔대의 옆면은 평행한 두 밑면 사이에 놓인 사각형이므로 사다리꼴이다. (참)  
④ 육각뿔대의 꼭짓점의 개수는 위아래 밑면에 각각 \$6\$개씩 있으므로 \$2 \\times 6 \= 12\$개이다. (참)  
⑤ 각뿔을 밑면에 평행한 평면으로 잘랐을 때 생기는 두 입체도형 중 각뿔이 아닌 쪽이 각뿔대이다. (참)

따라서 옳지 않은 것은 ②이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "육각뿔대의 밑면, 옆면 모양, 면의 개수 공식 대조 판별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "2",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE",  
  "conceptClusterKey": "SOLID\_FIGURE",  
  "primaryMethod": "육각뿔대의 면의 개수가 6+2=8개임을 확인하여 2번의 오류를 식별한다.",  
  "decisiveStep": "면의 개수 8개 확인 및 칠면체 서술 오류 판정",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 성질",  
    "l3": "다면체의 요소",  
    "l4": "각뿔대의 성질"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_POLYHEDRON\_EDGE\_FACE\_RELATIONS",  
    "templateKey": "TPL\_M1\_POLYHEDRON\_EDGE\_FACE\_RELATIONS\_FACE\_PROPERTY\_AUDIT",  
    "why": "각뿔대의 밑면, 옆면, 꼭짓점, 면의 개수 성질을 종합 평가하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "각뿔대의 면의 개수 공식을 확인하는 1단계 개념 판별",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "각뿔대"  
    \],  
    "goal": \[  
      "다면체"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q03  
\- 형식: 객관식  
\- 배점: 3  
\#\#\# 발문  
정오각형 밑면에 이등변삼각형 \$5\$개가 둘러싸여 붙어 있는 전개도를 접어서 만든 입체도형의 모서리의 개수를 \$a\$, 꼭짓점의 개수를 \$b\$라 할 때, \$a+b\$의 값은? \[3점\]  
\#\#\# 선지  
① \$12\$ ② \$14\$ ③ \$16\$ ④ \$18\$ ⑤ \$20\$  
\#\#\# 정답  
③  
\#\#\# 해설  
전개도를 접었을 때 만들어지는 입체도형을 파악한다.

1단계: 정오각형 밑면에 삼각형 \$5\$개가 붙어 있으므로, 전개도를 접어 만들 수 있는 입체도형은 '오각뿔'이다.

2단계: 오각뿔의 모서리의 개수는 밑면 모서리 \$5\$개와 옆모서리 \$5\$개이므로  
\$\$\\begin{aligned}  
a &= 2 \\times 5 \\\\  
&= 10  
\\end{aligned}\$\$

3단계: 오각뿔의 꼭짓점의 개수는 밑면 꼭짓점 \$5\$개와 각뿔의 꼭짓점 \$1\$개이므로  
\$\$\\begin{aligned}  
b &= 5 \+ 1 \\\\  
&= 6  
\\end{aligned}\$\$

4단계: 따라서 \$a \+ b\$의 값은  
\$\$\\begin{aligned}  
a \+ b &= 10 \+ 6 \\\\  
&= 16  
\\end{aligned}\$\$  
정답은 ③이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "오각뿔 전개도 해석 및 모서리와 꼭짓점 개수 덧셈 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "3",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE",  
  "conceptClusterKey": "SOLID\_FIGURE",  
  "primaryMethod": "전개도로부터 오각뿔을 식별하고 모서리 10개, 꼭짓점 6개의 합 16을 계산한다.",  
  "decisiveStep": "a=10, b=6 산출 후 a+b=16 계산",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 성질",  
    "l3": "다면체의 전개도",  
    "l4": "각뿔의 전개도와 요소의 개수"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_POLYHEDRON\_COMPONENT\_COUNT",  
    "templateKey": "TPL\_M1\_POLYHEDRON\_COMPONENT\_COUNT\_CORE",  
    "why": "각뿔의 전개도로부터 입체도형을 유추하고 모서리와 꼭짓점 수를 구하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "오각뿔의 모서리와 꼭짓점 수를 구하여 합하는 1단계 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "각뿔",  
      "전개도"  
    \],  
    "goal": \[  
      "합"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q04  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
각기둥의 겉넓이와 전개도에 대한 설명 중 옳지 않은 것은? \[4점\]  
\#\#\# 선지  
① 각기둥의 겉넓이는 두 밑면의 넓이의 합과 옆면의 넓이의 합이다. ② 각기둥의 두 밑면은 서로 평행하고 합동이다. ③ 각기둥의 전개도에서 옆면 전체는 하나의 직사각형으로 나타낼 수 있다. ④ 각기둥의 옆면 전체를 펼친 직사각형의 가로의 길이는 밑면의 한 변의 길이와 같다. ⑤ 각기둥의 옆면 전체를 펼친 직사각형의 세로의 길이는 각기둥의 높이와 같다.  
\#\#\# 정답  
④  
\#\#\# 해설  
기둥의 겉넓이와 전개도의 성질을 확인한다.

① 기둥의 겉넓이는 두 밑면의 넓이와 옆면의 넓이를 모두 더한 값이다. (참)  
② 각기둥의 두 밑면은 서로 평행하고 합동인 다각형이다. (참)  
③ 각기둥의 전개도를 그릴 때 옆면들을 나란히 이어 붙이면 하나의 큰 직사각형이 된다. (참)  
④ 옆면 전체로 만들어진 직사각형의 가로의 길이는 밑면의 한 변의 길이가 아니라 '밑면의 둘레의 길이'와 같다. 밑면의 둘레와 옆면 직사각형의 가로가 맞닿아 접히기 때문이다. (거짓)  
⑤ 옆면 직사각형의 세로의 길이는 기둥의 높이와 같다. (참)

따라서 옳지 않은 것은 ④이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "각기둥 전개도 옆면 직사각형 치수(가로=밑면 둘레, 세로=높이) 원리 판별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "4",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "전개도 옆면 가로의 길이가 밑면의 둘레임을 확인하여 4번의 오류를 식별한다.",  
  "decisiveStep": "전개도 옆면 가로=밑면 둘레 원리 대조",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "기둥의 겉넓이",  
    "l4": "기둥의 겉넓이 구하는 방법"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_PRISM\_SURFACE\_AREA\_CONCEPT",  
    "templateKey": "TPL\_M1\_PRISM\_NET\_DIMENSION\_AUDIT",  
    "why": "기둥의 전개도에서 옆면 직사각형의 가로와 세로가 의미하는 치수를 검증하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "전개도 옆면 직사각형의 가로 치수 원리를 묻는 1단계 개념 판정",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "각기둥",  
      "전개도"  
    \],  
    "goal": \[  
      "겉넓이"  
    \],  
    "method": \[  
      "성질",  
      "둘레"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q05  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
어떤 회전체를 회전축에 수직인 평면으로 자른 단면은 항상 반지름의 길이가 \$3\\rm\\,cm\$인 원이고, 회전축을 포함하는 평면으로 자른 단면은 가로가 \$6\\rm\\,cm\$, 세로가 \$8\\rm\\,cm\$인 직사각형이다. 이 회전체의 겉넓이는? \[4점\]  
\#\#\# 선지  
① \$54\\pi\\rm\\,cm^2\$ ② \$57\\pi\\rm\\,cm^2\$ ③ \$60\\pi\\rm\\,cm^2\$ ④ \$63\\pi\\rm\\,cm^2\$ ⑤ \$66\\pi\\rm\\,cm^2\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
회전축에 수직인 단면과 축을 포함하는 단면으로부터 입체도형을 추론하여 겉넓이를 구한다.

1단계: 회전축에 수직인 평면으로 자른 단면이 항상 반지름 \$3\\rm\\,cm\$인 원이고, 축을 포함하는 평면으로 자른 단면이 직사각형이므로 이 입체도형은 '원기둥'이다.

2단계: 직사각형 단면에서 가로 \$6\\rm\\,cm\$는 밑면 원의 지름(\$2 \\times 3\$)이고, 세로 \$8\\rm\\,cm\$는 원기둥의 높이이다.  
따라서 밑면의 반지름 \$r \= 3\\rm\\,cm\$, 높이 \$h \= 8\\rm\\,cm\$인 원기둥이다.

3단계: 두 밑면의 넓이의 합은  
\$\$\\begin{aligned}  
2 \\times (\\pi \\times 3^2) &= 18\\pi\\rm\\,cm^2  
\\end{aligned}\$\$

4단계: 옆면의 넓이는 밑면 원의 둘레에 높이를 곱한 것이므로  
\$\$\\begin{aligned}  
(2\\pi \\times 3\) \\times 8 &= 48\\pi\\rm\\,cm^2  
\\end{aligned}\$\$

5단계: 따라서 원기둥의 겉넓이는  
\$\$\\begin{aligned}  
18\\pi \+ 48\\pi &= 66\\pi\\rm\\,cm^2  
\\end{aligned}\$\$  
정답은 ⑤이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "단면 정보로 원기둥 식별 및 밑넓이와 옆넓이 합산 겉넓이 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "5",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "단면 조건으로 반지름 3, 높이 8인 원기둥을 파악하고 겉넓이 18pi+48pi=66pi를 계산한다.",  
  "decisiveStep": "두 밑넓이 18pi \+ 옆넓이 48pi \= 66pi 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "기둥의 겉넓이",  
    "l4": "원기둥의 겉넓이"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_CYLINDER\_SURFACE\_AREA",  
    "templateKey": "TPL\_M1\_CROSS\_SECTION\_TO\_CYLINDER\_SURFACE",  
    "why": "회전축 절단 단면 정보로부터 원기둥 치수를 도출하고 겉넓이를 구하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "단면으로 원기둥 치수를 결정한 후 겉넓이 공식을 적용하는 2단계 연산",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "회전체",  
      "단면",  
      "직선"  
    \],  
    "goal": \[  
      "겉넓이"  
    \],  
    "method": \[  
      "원기둥",  
      "합"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q06  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
밑면의 반지름의 길이가 \$3\\rm\\,cm\$이고 높이가 \$7\\rm\\,cm\$로 서로 같은 원뿔과 원기둥이 있다. 원뿔 모양의 그릇에 모래를 가득 채워 원기둥 모양의 빈 그릇에 부었더니 \$3\$번 부었을 때 원기둥에 모래가 가득 찼다. 이 원뿔의 부피는? \[4점\]  
\#\#\# 선지  
① \$21\\pi\\rm\\,cm^3\$ ② \$24\\pi\\rm\\,cm^3\$ ③ \$28\\pi\\rm\\,cm^3\$ ④ \$35\\pi\\rm\\,cm^3\$ ⑤ \$63\\pi\\rm\\,cm^3\$  
\#\#\# 정답  
①  
\#\#\# 해설  
원뿔의 부피는 밑면의 넓이와 높이가 같은 원기둥 부피의 \$\\dfrac{1}{3}\$이다.

1단계: 밑면의 반지름이 \$3\\rm\\,cm\$, 높이가 \$7\\rm\\,cm\$인 원기둥의 부피 \$V\_{\\text{원기둥}}\$은  
\$\$\\begin{aligned}  
V\_{\\text{원기둥}} &= (\\pi \\times 3^2) \\times 7 \\\\  
&= 9\\pi \\times 7 \\\\  
&= 63\\pi\\rm\\,cm^3  
\\end{aligned}\$\$

2단계: 원뿔의 부피 \$V\_{\\text{원뿔}}\$은 원기둥 부피의 \$\\dfrac{1}{3}\$이므로  
\$\$\\begin{aligned}  
V\_{\\text{원뿔}} &= \\dfrac{1}{3} \\times 63\\pi \\\\  
&= 21\\pi\\rm\\,cm^3  
\\end{aligned}\$\$  
정답은 ①이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "원뿔 부피는 밑면과 높이가 같은 원기둥 부피의 1/3 공식 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "6",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "원기둥 부피 63pi를 구하고 1/3을 곱해 원뿔 부피 21pi를 계산한다.",  
  "decisiveStep": "63pi \* (1/3) \= 21pi 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "뿔의 부피",  
    "l4": "원뿔의 부피"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_CONE\_VOLUME\_EXPERIMENT",  
    "templateKey": "TPL\_M1\_CONE\_CYLINDER\_ONE\_THIRD\_RELATION",  
    "why": "원뿔과 원기둥의 1/3 부피 관계를 실험 상황을 통해 이해하고 계산하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "원기둥 부피 공식을 계산한 후 3으로 나누는 1단계 기본 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "원뿔",  
      "원기둥",  
      "반지름"  
    \],  
    "goal": \[  
      "부피"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q07  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
밑면의 가로의 길이가 \$6\\rm\\,cm\$, 세로의 길이가 \$4\\rm\\,cm\$인 직사각형이고, 높이가 \$8\\rm\\,cm\$인 사각뿔의 부피는? \[4점\]  
\#\#\# 선지  
① \$48\\rm\\,cm^3\$ ② \$64\\rm\\,cm^3\$ ③ \$72\\rm\\,cm^3\$ ④ \$96\\rm\\,cm^3\$ ⑤ \$192\\rm\\,cm^3\$  
\#\#\# 정답  
②  
\#\#\# 해설  
각뿔의 부피는 \$\\dfrac{1}{3} \\times (\\text{밑넓이}) \\times (\\text{높이})\$이다.

1단계: 밑면인 직사각형의 넓이는  
\$\$\\begin{aligned}  
6 \\times 4 &= 24\\rm\\,cm^2  
\\end{aligned}\$\$

2단계: 높이가 \$8\\rm\\,cm\$이므로 사각뿔의 부피 \$V\$는  
\$\$\\begin{aligned}  
V &= \\dfrac{1}{3} \\times 24 \\times 8 \\\\  
&= 8 \\times 8 \\\\  
&= 64\\rm\\,cm^3  
\\end{aligned}\$\$  
정답은 ②이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "사각뿔의 부피 공식 1/3 \* 밑넓이 \* 높이 직접 대입 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "7",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "밑넓이 24에 높이 8을 곱하고 1/3을 취하여 부피 64를 계산한다.",  
  "decisiveStep": "(1/3) \* 24 \* 8 \= 64 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "뿔의 부피",  
    "l4": "사각뿔의 부피"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_PYRAMID\_VOLUME",  
    "templateKey": "TPL\_M1\_RECTANGULAR\_PYRAMID\_VOLUME",  
    "why": "직사각형 밑면을 갖는 사각뿔의 부피 공식을 적용하는 표준 기본 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "밑넓이 계산 후 각뿔 부피 공식에 대입하는 1단계 기본 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "각뿔"  
    \],  
    "goal": \[  
      "부피"  
    \],  
    "method": \[  
      "넓이"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q08  
\- 형식: 객관식  
\- 배점: 5  
\#\#\# 발문  
밑면인 원의 반지름의 길이가 \$6\\rm\\,cm\$, 높이가 \$6\\rm\\,cm\$인 큰 원뿔에서, 윗면인 원의 반지름의 길이가 \$3\\rm\\,cm\$, 높이가 \$3\\rm\\,cm\$인 작은 원뿔을 잘라내어 만든 원뿔대의 부피는? \[5점\]  
\#\#\# 선지  
① \$54\\pi\\rm\\,cm^3\$ ② \$58\\pi\\rm\\,cm^3\$ ③ \$63\\pi\\rm\\,cm^3\$ ④ \$68\\pi\\rm\\,cm^3\$ ⑤ \$72\\pi\\rm\\,cm^3\$  
\#\#\# 정답  
③  
\#\#\# 해설  
원뿔대의 부피는 큰 원뿔의 부피에서 잘라낸 작은 원뿔의 부피를 빼서 구한다.

1단계: 큰 원뿔의 부피 \$V\_1\$은  
\$\$\\begin{aligned}  
V\_1 &= \\dfrac{1}{3} \\pi \\times 6^2 \\times 6 \\\\  
&= \\dfrac{1}{3} \\pi \\times 36 \\times 6 \\\\  
&= 72\\pi\\rm\\,cm^3  
\\end{aligned}\$\$

2단계: 잘라낸 작은 원뿔의 부피 \$V\_2\$는  
\$\$\\begin{aligned}  
V\_2 &= \\dfrac{1}{3} \\pi \\times 3^2 \\times 3 \\\\  
&= \\dfrac{1}{3} \\pi \\times 9 \\times 3 \\\\  
&= 9\\pi\\rm\\,cm^3  
\\end{aligned}\$\$

3단계: 따라서 원뿔대의 부피는  
\$\$\\begin{aligned}  
V\_1 \- V\_2 &= 72\\pi \- 9\\pi \\\\  
&= 63\\pi\\rm\\,cm^3  
\\end{aligned}\$\$  
정답은 ③이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "큰 원뿔 부피에서 작은 원뿔 부피를 감산하는 원뿔대 부피 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "8",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "큰 원뿔 부피 72pi에서 작은 원뿔 부피 9pi를 빼어 63pi를 도출한다.",  
  "decisiveStep": "72pi \- 9pi \= 63pi 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "뿔의 부피",  
    "l4": "원뿔대의 부피"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_TRUNCATED\_CONE\_VOLUME",  
    "templateKey": "TPL\_M1\_CONE\_SUBTRACTION\_FRUSTUM\_VOLUME",  
    "why": "두 원뿔의 부피 차를 이용하여 원뿔대의 부피를 계산하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "두 원뿔 부피를 각각 계산한 후 차를 구하는 2단계 연산",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "원뿔대",  
      "원뿔",  
      "반지름"  
    \],  
    "goal": \[  
      "부피"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q09  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
구가 꼭 맞게 들어가는 원기둥 모양의 수조에 물을 가득 채운 후, 구를 완전히 꺼냈다. 수조에 남아 있는 물의 부피가 \$144\\pi\\rm\\,cm^3\$일 때, 구의 반지름의 길이는? \[4점\]  
\#\#\# 선지  
① \$3\\rm\\,cm\$ ② \$4\\rm\\,cm\$ ③ \$5\\rm\\,cm\$ ④ \$6\\rm\\,cm\$ ⑤ \$7\\rm\\,cm\$  
\#\#\# 정답  
④  
\#\#\# 해설  
구의 반지름을 \$r\\rm\\,cm\$라 하면, 구가 꼭 맞게 들어가는 원기둥의 밑면의 반지름은 \$r\\rm\\,cm\$이고 높이는 지름과 같은 \$2r\\rm\\,cm\$이다.

1단계: 원기둥의 부피는  
\$\$\\begin{aligned}  
V\_{\\text{원기둥}} &= (\\pi r^2) \\times 2r \\\\  
&= 2\\pi r^3\\rm\\,cm^3  
\\end{aligned}\$\$

2단계: 구의 부피는  
\$\$\\begin{aligned}  
V\_{\\text{구}} &= \\dfrac{4}{3}\\pi r^3\\rm\\,cm^3  
\\end{aligned}\$\$

3단계: 남아 있는 물의 부피는 원기둥 부피에서 구의 부피를 뺀 것이므로  
\$\$\\begin{aligned}  
2\\pi r^3 \- \\dfrac{4}{3}\\pi r^3 &= \\dfrac{2}{3}\\pi r^3\\rm\\,cm^3  
\\end{aligned}\$\$

4단계: 남아 있는 물의 부피가 \$144\\pi\\rm\\,cm^3\$이므로  
\$\$\\begin{aligned}  
\\dfrac{2}{3}\\pi r^3 &= 144\\pi \\\\  
r^3 &= 144 \\times \\dfrac{3}{2} \\\\  
r^3 &= 216 \\\\  
r &= 6\\rm\\,cm  
\\end{aligned}\$\$  
정답은 ④이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "외접 원기둥과 구의 부피 차 2/3 pi r^3 \= 144pi 거듭제곱 방정식 풀이 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "9",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "남은 물의 부피 공식 (2/3)pi\*r^3 \= 144pi에서 r^3=216, r=6을 역산한다.",  
  "decisiveStep": "r^3 \= 216 도출 후 r=6 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "구의 부피",  
    "l4": "구와 외접 원기둥의 부피 관계"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_SPHERE\_CYLINDER\_INSCRIBED\_VOLUME",  
    "templateKey": "TPL\_M1\_WATER\_DISPLACEMENT\_SPHERE\_RADIUS",  
    "why": "구와 외접 원기둥의 부피 관계식을 세우고 부피 값으로부터 반지름을 역산하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "부피 차 공식 2/3 pi r^3을 유도하고 세제곱근을 구하는 2단계 대수-기하 연산",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "구",  
      "원기둥",  
      "반지름"  
    \],  
    "goal": \[  
      "길이"  
    \],  
    "method": \[  
      "부피",  
      "방정식"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q10  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
밑면이 뚫려 있는 원뿔 모양의 생일 고깔모자가 있다. 밑면의 반지름의 길이가 \$6\\rm\\,cm\$이고 모선의 길이가 \$15\\rm\\,cm\$일 때, 이 고깔모자의 겉넓이(옆넓이)는? \[4점\]  
\#\#\# 선지  
① \$45\\pi\\rm\\,cm^2\$ ② \$60\\pi\\rm\\,cm^2\$ ③ \$75\\pi\\rm\\,cm^2\$ ④ \$80\\pi\\rm\\,cm^2\$ ⑤ \$90\\pi\\rm\\,cm^2\$  
\#\#\# 정답  
⑤  
\#\#\# 해설  
고깔모자는 밑면이 뚫려 있으므로 부채꼴 모양의 옆넓이만 구하면 된다.

원뿔의 옆넓이 \$S\$는 밑면의 반지름 \$r\$와 모선의 길이 \$l\$을 이용하여 다음과 같이 구한다.  
\$\$\\begin{aligned}  
S &= \\pi r l  
\\end{aligned}\$\$

주어진 값 \$r \= 6\\rm\\,cm\$, \$l \= 15\\rm\\,cm\$를 대입하면  
\$\$\\begin{aligned}  
S &= \\pi \\times 6 \\times 15 \\\\  
&= 90\\pi\\rm\\,cm^2  
\\end{aligned}\$\$  
정답은 ⑤이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "원뿔 옆넓이 공식 S=pi\*r\*l 직접 대입 계산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "10",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "원뿔 옆넓이 공식 pi\*r\*l에 r=6, l=15를 대입하여 90pi를 계산한다.",  
  "decisiveStep": "pi \* 6 \* 15 \= 90pi 산출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "뿔의 겉넓이",  
    "l4": "원뿔의 옆넓이"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_CONE\_LATERAL\_AREA",  
    "templateKey": "TPL\_M1\_CONE\_HAT\_LATERAL\_SURFACE",  
    "why": "밑면이 뚫린 고깔모자의 겉넓이(원뿔의 옆넓이)를 구하는 실생활 연계 기본 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "원뿔 옆넓이 공식에 반지름과 모선을 바로 대입하는 1단계 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "원뿔",  
      "반지름"  
    \],  
    "goal": \[  
      "겉넓이"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q11  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음은 학생 \$10\$명의 하루 독서 시간을 조사하여 나타낸 자료이다. 이 자료의 중심 경향을 나타내기에 가장 적절한 대푯값과 그 값으로 옳은 것은? \[4점\]  
(단위: 분)

\<div class="question-table-wrap"\>\<table class="question-table"\>\<tbody\>\<tr\>\<td\>15\</td\>\<td\>20\</td\>\<td\>18\</td\>\<td\>22\</td\>\<td\>17\</td\>\</tr\>\<tr\>\<td\>25\</td\>\<td\>20\</td\>\<td\>19\</td\>\<td\>16\</td\>\<td\>90\</td\>\</tr\>\</tbody\>\</table\>\</div\>  
\#\#\# 선지  
① 중앙값, \$19.5\$분 ② 중앙값, \$20\$분 ③ 평균, \$26.2\$분 ④ 최빈값, \$20\$분 ⑤ 평균, \$19.5\$분  
\#\#\# 정답  
①  
\#\#\# 해설  
극단적인 값의 유무를 확인하고 적절한 대푯값을 선택하여 계산한다.

1단계: 자료를 보면 \$90\$분은 다른 \$9\$명의 독서 시간(\$15\$\~\$25\$분)에 비해 매우 큰 극단적인 값이다.  
평균은 극단적인 값의 영향을 크게 받으므로, 자료의 중심 경향을 나타내기에는 '중앙값'이 가장 적절하다.

2단계: 자료 \$10\$개를 작은 수부터 차례로 나열하면  
\$\$15,\\quad 16,\\quad 17,\\quad 18,\\quad 19,\\quad 20,\\quad 20,\\quad 22,\\quad 25,\\quad 90\$\$  
이다.

3단계: 자료의 개수가 \$n=10\$개(짝수)이므로 중앙값은 가운데 두 값(\$5\$번째 값 \$19\$, \$6\$번째 값 \$20\$)의 평균이다.  
\$\$\\begin{aligned}  
\\text{중앙값} &= \\dfrac{19 \+ 20}{2} \\\\  
&= 19.5\\text{분}  
\\end{aligned}\$\$  
따라서 가장 적절한 대푯값과 그 값은 '중앙값, \$19.5\$분'이다.  
정답은 ①이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "극단값 자료 대푯값 선택 판정 및 짝수 개 자료 중앙값 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "11",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_INTERPRETATION",  
  "conceptClusterKey": "DATA\_INTERPRETATION",  
  "primaryMethod": "극단값 90분으로 중앙값을 선택하고, 5번째(19)와 6번째(20)의 평균 19.5분을 구한다.",  
  "decisiveStep": "중앙값 선택 및 (19+20)/2 \= 19.5 계산",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "대푯값",  
    "l4": "대푯값의 선택과 중앙값"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_CENTRAL\_TENDENCY\_SELECTION",  
    "templateKey": "TPL\_M1\_OUTLIER\_DATASET\_MEDIAN\_CHOICE",  
    "why": "극단값이 포함된 자료에서 적절한 대푯값(중앙값)을 판별하고 값을 산출하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "극단값에 따른 대푯값 적절성을 판단하고 짝수 개 자료의 중앙값을 계산하는 2단계 통계",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "자료"  
    \],  
    "goal": \[  
      "대푯값",  
      "중앙값"  
    \],  
    "method": \[  
      "평균",  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q12  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 자료의 중앙값과 최빈값이 서로 같을 때, \$x\$의 값을 옳게 구한 것은? (단, 최빈값은 \$1\$개이다.) \[4점\]

\$\$4,\\quad 8,\\quad 6,\\quad 2,\\quad x,\\quad 5,\\quad 2,\\quad 4\$\$  
\#\#\# 선지  
① \$3\$ ② \$4\$ ③ \$5\$ ④ \$6\$ ⑤ \$7\$  
\#\#\# 정답  
②  
\#\#\# 해설  
최빈값의 유일성 조건과 중앙값을 분석하여 \$x\$를 결정한다.

1단계: 주어진 자료 중 \$x\$를 제외한 \$7\$개의 자료에서 \$2\$가 \$2\$번, \$4\$가 \$2\$번 나타나 있다.  
최빈값이 \$1\$개뿐이어야 하므로 \$x\$는 이미 \$2\$번 나타난 \$2\$ 또는 \$4\$ 중 하나이어야 한다.

2단계: \$x \= 2\$인 경우:  
자료를 정렬하면 \$2, 2, 2, 4, 4, 5, 6, 8\$이다.  
최빈값은 \$2\$이고, 중앙값은 \$4\$번째 값 \$4\$와 \$5\$번째 값 \$4\$의 평균인 \$4\$이다.  
최빈값(\$2\$)과 중앙값(\$4\$)이 서로 다르므로 조건을 만족하지 않는다.

3단계: \$x \= 4\$인 경우:  
자료를 정렬하면 \$2, 2, 4, 4, 4, 5, 6, 8\$이다.  
최빈값은 \$3\$번 나타난 \$4\$이다.  
중앙값은 \$4\$번째 값 \$4\$와 \$5\$번째 값 \$4\$의 평균인 \$\\dfrac{4+4}{2} \= 4\$이다.  
최빈값과 중앙값이 모두 \$4\$로 일치하고, 최빈값도 \$1\$개뿐이므로 조건을 완벽히 만족한다.

따라서 \$x \= 4\$이다.  
정답은 ②이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "최빈값 유일성 조건 하에서 중앙값과 최빈값 일치 방정식 추론 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "12",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_INTERPRETATION",  
  "conceptClusterKey": "DATA\_INTERPRETATION",  
  "primaryMethod": "x가 2 또는 4일 때를 비교하여 최빈값과 중앙값이 모두 4로 일치하는 x=4를 판정한다.",  
  "decisiveStep": "x=4일 때 최빈값=중앙값=4 일치 검증",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "대푯값",  
    "l4": "중앙값과 최빈값의 일치 조건"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_MEDIAN\_MODE\_MATCH\_VARIABLE",  
    "templateKey": "TPL\_M1\_MODE\_MEDIAN\_EQUATION\_UNKNOWN",  
    "why": "자료의 중앙값과 최빈값이 일치하는 조건을 만족하는 미지수를 추론하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "후보군(2, 4)에 대해 정렬 후 중앙값과 최빈값을 각각 비교하는 2단계 추론",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "자료"  
    \],  
    "goal": \[  
      "중앙값",  
      "최빈값"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q13  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 두 조건을 모두 만족시키는 자연수 \$a\$의 값이 될 수 없는 것은? \[4점\]

\<div class="question-note-box"\>\[조건1\] \$3\$개의 변량 \$4,\\ 8,\\ a\$의 중앙값은 \$8\$이다.\<br\>\[조건2\] \$3\$개의 변량 \$12,\\ 15,\\ a\$의 중앙값은 \$12\$이다.\</div\>  
\#\#\# 선지  
① \$8\$ ② \$9\$ ③ \$7\$ ④ \$11\$ ⑤ \$12\$  
\#\#\# 정답  
③  
\#\#\# 해설  
두 조건을 각각 \$a\$의 부등식 범위로 나타낸다.

1단계: \[조건1\]에서 \$4, 8, a\$의 중앙값이 \$8\$이 되려면, \$a\$는 \$8\$ 이상이어야 한다.  
만약 \$a \< 8\$이면 자료를 정렬했을 때 \$a, 4, 8\$ 또는 \$4, a, 8\$이 되어 중앙값이 \$a\$ 또는 \$4\$가 되므로 모순이다.  
따라서  
\$\$a \\ge 8\$\$

2단계: \[조건2\]에서 \$12, 15, a\$의 중앙값이 \$12\$가 되려면, \$a\$는 \$12\$ 이하이어야 한다.  
만약 \$a \> 12\$이면 중앙값이 \$12\$보다 커지므로 모순이다.  
따라서  
\$\$a \\le 12\$\$

3단계: 두 조건을 동시에 만족시키는 자연수 \$a\$의 범위는  
\$\$8 \\le a \\le 12\$\$  
이다.  
선지 중 \$7\$은 이 범위에 포함되지 않으므로 \$a\$의 값이 될 수 없다.

따라서 정답은 ③이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "3변량 중앙값 조건으로부터 부등식 범위 8\<=a\<=12 도출 및 부적합값 판별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "13",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_INTERPRETATION",  
  "conceptClusterKey": "DATA\_INTERPRETATION",  
  "primaryMethod": "두 조건으로부터 8\<=a\<=12의 범위를 도출하여 범위 밖의 수 7을 판정한다.",  
  "decisiveStep": "8 \<= a \<= 12 도출 및 7의 불포함 식별",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "대푯값",  
    "l4": "중앙값 조건을 만족하는 미지수 범위"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_MEDIAN\_RANGE\_INEQUALITY",  
    "templateKey": "TPL\_M1\_DUAL\_MEDIAN\_CONDITION\_RANGE",  
    "why": "두 개의 중앙값 조건으로부터 미지수 변량의 부등식 범위를 연립하여 구하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "중앙값 정의로부터 부등식을 세우고 공통 범위를 찾는 2단계 대수-통계 복합",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "자료"  
    \],  
    "goal": \[  
      "중앙값"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q14  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 줄기와 잎 그림은 어느 반 학생들의 줄넘기 기록을 조사하여 나타낸 것이다. 다음 설명 중 옳지 않은 것은? \[4점\]

\<div class="question-table-wrap"\>\<table class="question-table"\>\<thead\>\<tr\>\<th\>줄기\</th\>\<th\>잎\</th\>\</tr\>\</thead\>\<tbody\>\<tr\>\<td\>1\</td\>\<td\>5, 6, 8, 9\</td\>\</tr\>\<tr\>\<td\>2\</td\>\<td\>0, 2, 4, 5, 7, 8\</td\>\</tr\>\<tr\>\<td\>3\</td\>\<td\>1, 3, 3, 5, 6, 7, 9\</td\>\</tr\>\<tr\>\<td\>4\</td\>\<td\>2, 4, 6, 8, 8\</td\>\</tr\>\</tbody\>\</table\>\</div\>  
\#\#\# 선지  
① 반 전체 학생 수는 \$22\$명이다. ② 줄기가 \$1\$인 잎의 개수는 \$4\$개이다. ③ 줄넘기 기록이 가장 높은 학생의 기록은 \$48\$회이다. ④ 줄넘기 기록이 \$40\$회 이상인 학생 수는 \$4\$명이다. ⑤ 줄넘기 기록이 \$4\$번째로 낮은 학생의 기록은 \$19\$회이다.  
\#\#\# 정답  
④  
\#\#\# 해설  
줄기와 잎 그림의 각 항목을 확인한다.

① 각 줄기의 잎의 개수는 차례로 \$4, 6, 7, 5\$개이므로 전체 학생 수는  
\$\$4 \+ 6 \+ 7 \+ 5 \= 22\\text{명}\$\$  
이다. (참)  
② 줄기가 \$1\$인 잎은 \$5, 6, 8, 9\$로 모두 \$4\$개이다. (참)  
③ 가장 높은 기록은 줄기 \$4\$의 잎 \$8\$이므로 \$48\$회이다. (참)  
④ 줄넘기 기록이 \$40\$회 이상인 자료는 줄기가 \$4\$인 자료 전체이며, \$42, 44, 46, 48, 48\$로 총 \$5\$명이다. 따라서 \$4\$명이라고 한 ④는 옳지 않다. (거짓)  
⑤ 기록이 작은 순서로 나열하면 \$15, 16, 18, 19, \\dots\$이므로 \$4\$번째로 낮은 기록은 \$19\$회이다. (참)

따라서 옳지 않은 것은 ④이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "줄기와 잎 그림의 총인원, 구간 도수, 최댓값 및 순위 해석 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "14",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_ORGANIZATION",  
  "conceptClusterKey": "DATA\_ORGANIZATION",  
  "primaryMethod": "줄기 4의 잎이 5개임을 확인하여 40회 이상 학생 수가 5명임을 판정한다.",  
  "decisiveStep": "40회 이상 학생 수 5명 식별 및 4명 서술 오류 판별",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "줄기와 잎 그림",  
    "l4": "줄기와 잎 그림의 해석"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_STEM\_LEAF\_INTERPRETATION",  
    "templateKey": "TPL\_M1\_STEM\_LEAF\_RANK\_AND\_RANGE",  
    "why": "줄기와 잎 그림에서 특정 구간의 도수와 최댓값, 순위를 감사하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "줄기와 잎 그림에서 구간 도수 5명을 직접 계수하여 오류를 찾는 1단계 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "자료",  
      "줄기와잎"  
    \],  
    "goal": \[  
      "해석"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q15  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
다음 도수분포표는 어느 학급 학생 \$25\$명의 제자리멀리뛰기 기록을 조사하여 나타낸 것이다. 다음 설명 중 옳지 않은 것은? \[4점\]

\<div class="question-table-wrap"\>\<table class="question-table"\>\<thead\>\<tr\>\<th\>기록(cm)\</th\>\<th\>학생 수(명)\</th\>\</tr\>\</thead\>\<tbody\>\<tr\>\<td\>120 이상 \~ 140 미만\</td\>\<td\>3\</td\>\</tr\>\<tr\>\<td\>140 \~ 160\</td\>\<td\>6\</td\>\</tr\>\<tr\>\<td\>160 \~ 180\</td\>\<td\>11\</td\>\</tr\>\<tr\>\<td\>180 \~ 200\</td\>\<td\>4\</td\>\</tr\>\<tr\>\<td\>200 \~ 220\</td\>\<td\>1\</td\>\</tr\>\<tr\>\<td\>합계\</td\>\<td\>25\</td\>\</tr\>\</tbody\>\</table\>\</div\>  
\#\#\# 선지  
① 계급의 크기는 \$20\\rm\\,cm\$이다. ② 도수가 가장 큰 계급은 \$160\\rm\\,cm\$ 이상 \$180\\rm\\,cm\$ 미만이다. ③ 기록이 \$180\\rm\\,cm\$ 이상인 학생 수는 \$5\$명이다. ④ 기록이 \$160\\rm\\,cm\$ 이상 \$180\\rm\\,cm\$ 미만인 학생은 전체의 \$44\\%\$이다. ⑤ 기록이 \$210\\rm\\,cm\$인 학생은 정확히 \$1\$명이다.  
\#\#\# 정답  
⑤  
\#\#\# 해설  
도수분포표의 기본 성질을 검토한다.

① 계급의 크기는 구간의 너비이므로 \$140 \- 120 \= 20\\rm\\,cm\$이다. (참)  
② 도수가 가장 큰 계급은 \$11\$명인 '\$160\\rm\\,cm\$ 이상 \$180\\rm\\,cm\$ 미만'이다. (참)  
③ \$180\\rm\\,cm\$ 이상인 학생 수는 \$4 \+ 1 \= 5\$명이다. (참)  
④ '\$160\\rm\\,cm\$ 이상 \$180\\rm\\,cm\$ 미만' 계급의 학생 수는 \$11\$명이므로, 전체 \$25\$명 중 차지하는 백분율은  
\$\$\\dfrac{11}{25} \\times 100 \= 44\\%\$\$  
이다. (참)  
⑤ 도수분포표는 각 계급에 속한 도수만을 나타내므로, '\$200\\rm\\,cm\$ 이상 \$220\\rm\\,cm\$ 미만' 계급에 \$1\$명이 속해 있다는 사실만으로 그 학생의 기록이 정확히 \$210\\rm\\,cm\$라고 단정할 수 없다. (거짓)

따라서 옳지 않은 것은 ⑤이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "도수분포표의 계급 도수 성질 및 개별 변량 특정 불가 한계 판별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "15",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_ORGANIZATION",  
  "conceptClusterKey": "DATA\_ORGANIZATION",  
  "primaryMethod": "도수분포표에서 특정 변량값을 단정할 수 없다는 통계적 한계를 식별하여 5번의 오류를 찾는다.",  
  "decisiveStep": "도수분포표의 개별 변량 특정 불가 성질 확인",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "도수분포표",  
    "l4": "도수분포표의 이해와 한계"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_FREQUENCY\_TABLE\_LIMITATION",  
    "templateKey": "TPL\_M1\_FREQUENCY\_TABLE\_INDIVIDUAL\_VALUE\_AUDIT",  
    "why": "도수분포표의 기본 요소와 개별 자료값 식별 불가의 한계를 감사하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "도수분포표의 본질적 특성을 점검하는 1단계 개념 판정",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "도수분포표",  
      "계급",  
      "도수"  
    \],  
    "goal": \[  
      "해석"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q16  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
어느 반 학생들의 한 달 동안의 봉사활동 시간을 조사하여 나타낸 히스토그램에서, 계급의 크기를 \$a\$시간, 봉사활동 시간이 많은 쪽에서 \$6\$번째인 학생이 속한 계급의 도수를 \$b\$명이라 할 때, \$b-a\$의 값은? \[4점\]  
(단, 각 계급의 도수는 \$0\$\~\$4\$시간: \$2\$명, \$4\$\~\$8\$시간: \$6\$명, \$8\$\~\$12\$시간: \$12\$명, \$12\$\~\$16\$시간: \$5\$명, \$16\$\~\$20\$시간: \$2\$명이다.)  
\#\#\# 선지  
① \$1\$ ② \$2\$ ③ \$3\$ ④ \$4\$ ⑤ \$5\$  
\#\#\# 정답  
①  
\#\#\# 해설  
히스토그램의 계급의 크기와 상위 순위 도수를 구한다.

1단계: 가로축의 계급 경계가 \$0, 4, 8, 12, 16, 20\$이므로 계급의 크기 \$a\$는  
\$\$\\begin{aligned}  
a &= 4 \- 0 \= 4\\text{시간}  
\\end{aligned}\$\$

2단계: 봉사활동 시간이 가장 많은 쪽부터 학생 수를 누적하면  
'\$16\$시간 이상 \$20\$시간 미만' 계급에 \$2\$명(상위 \$1\$\~\$2\$번째)이 있고,  
그다음 '\$12\$시간 이상 \$16\$시간 미만' 계급에 \$5\$명(상위 \$3\$\~\$7\$번째)이 있다.  
따라서 봉사활동 시간이 많은 쪽에서 \$6\$번째인 학생이 속한 계급은 '\$12\$시간 이상 \$16\$시간 미만'이다.

3단계: 이 계급의 도수 \$b\$는  
\$\$b \= 5\\text{명}\$\$  
이다.

4단계: 따라서 \$b \- a\$의 값은  
\$\$\\begin{aligned}  
b \- a &= 5 \- 4 \\\\  
&= 1  
\\end{aligned}\$\$  
정답은 ①이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "히스토그램 계급 크기 산출 및 상위 순위 계급 도수 특정 차감 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "16",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_ORGANIZATION",  
  "conceptClusterKey": "DATA\_ORGANIZATION",  
  "primaryMethod": "계급의 크기 a=4와 상위 6번째 계급의 도수 b=5를 구하여 b-a=1을 계산한다.",  
  "decisiveStep": "a=4, b=5 결정 후 b-a=1 산출",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "히스토그램",  
    "l4": "히스토그램의 해석"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_HISTOGRAM\_CLASS\_AND\_RANK",  
    "templateKey": "TPL\_M1\_HISTOGRAM\_CLASS\_WIDTH\_AND\_RANK\_FREQUENCY",  
    "why": "히스토그램에서 계급의 크기와 순위에 따른 계급 도수를 찾아 차를 구하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "계급 크기 확인과 상위 누적 순위 추적으로 도수를 특정하는 2단계 연산",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "계급",  
      "도수"  
    \],  
    "goal": \[  
      "도수"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q17  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
어느 학교 배드민턴 동아리 학생 \$40\$명의 \$1\$분 동안 셔틀콕 리프팅 횟수를 조사하여 나타낸 도수분포다각형에서, 계급별 도수가 아래와 같을 때 옳은 것은? \[4점\]

• \$20\$회 이상 \~ \$25\$회 미만: \$2\$명  
• \$25\$회 이상 \~ \$30\$회 미만: \$4\$명  
• \$30\$회 이상 \~ \$35\$회 미만: \$8\$명  
• \$35\$회 이상 \~ \$40\$회 미만: \$14\$명  
• \$40\$회 이상 \~ \$45\$회 미만: \$8\$명  
• \$45\$회 이상 \~ \$50\$회 미만: \$4\$명  
\#\#\# 선지  
① 동아리 전체 학생 수는 \$38\$명이다. ② 리프팅 횟수가 \$45\$회 이상인 학생은 전체의 \$10\\%\$이다. ③ 계급의 크기는 \$10\$회이다. ④ 계급의 개수는 \$8\$개이다. ⑤ 리프팅 횟수가 \$30\$회 미만인 학생 수는 \$8\$명이다.  
\#\#\# 정답  
②  
\#\#\# 해설  
도수분포다각형의 항목을 하나씩 검토한다.

① 전체 학생 수는 모든 계급의 도수의 합이므로  
\$\$2 \+ 4 \+ 8 \+ 14 \+ 8 \+ 4 \= 40\\text{명}\$\$  
이다. (거짓)  
② 리프팅 횟수가 \$45\$회 이상인 학생 수는 마지막 계급의 \$4\$명이다. 전체 학생 수가 \$40\$명이므로 차지하는 백분율은  
\$\$\\dfrac{4}{40} \\times 100 \= 10\\%\$\$  
이다. 따라서 ②는 옳다. (참)  
③ 계급의 크기는 각 구간의 너비이므로 \$25 \- 20 \= 5\$회이다. (거짓)  
④ 계급의 개수는 점의 개수와 같으므로 \$6\$개이다. (거짓)  
⑤ \$30\$회 미만인 학생 수는 \$2 \+ 4 \= 6\$명이다. (거짓)

따라서 옳은 것은 ②이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "도수분포다각형의 계급별 도수 합산 및 상위 구간 백분율 판별 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "17",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_ORGANIZATION",  
  "conceptClusterKey": "DATA\_ORGANIZATION",  
  "primaryMethod": "45회 이상 도수 4명이 전체 40명에서 차지하는 비율 4/40\*100=10%를 검증한다.",  
  "decisiveStep": "4/40 \* 100 \= 10% 일치 확인",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "도수분포다각형",  
    "l4": "도수분포다각형의 해석"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_FREQUENCY\_POLYGON\_PERCENTAGE",  
    "templateKey": "TPL\_M1\_POLYGON\_CLASS\_PERCENTAGE\_AUDIT",  
    "why": "도수분포다각형에서 계급 크기, 총도수, 특정 구간 백분율을 점검하는 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "특정 계급의 도수를 전체로 나누어 백분율을 구하는 1단계 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "도수분포다각형",  
      "계급",  
      "도수"  
    \],  
    "goal": \[  
      "해석"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q18  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
어느 중학교 학생 \$150\$명의 한 학기 동안의 도서관 이용 횟수를 조사하여 나타낸 상대도수의 분포표에서, 이용 횟수가 \$35\$회인 학생이 속한 계급의 상대도수가 \$0.24\$이다. 이 계급에 속한 학생 수는? \[4점\]  
\#\#\# 선지  
① \$24\\text{명}\$ ② \$30\\text{명}\$ ③ \$36\\text{명}\$ ④ \$42\\text{명}\$ ⑤ \$48\\text{명}\$  
\#\#\# 정답  
③  
\#\#\# 해설  
(계급의 도수) \= (도수의 총합) \$\\times\$ (해당 계급의 상대도수)이다.

1단계: 전체 학생 수는 \$150\$명이다.

2단계: 해당 계급의 상대도수가 \$0.24\$이므로 학생 수는  
\$\$\\begin{aligned}  
150 \\times 0.24 &= 36\\text{명}  
\\end{aligned}\$\$  
따라서 정답은 ③이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "상대도수와 도수의 총합 곱셈을 통한 계급 도수 계산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "18",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_ORGANIZATION",  
  "conceptClusterKey": "DATA\_ORGANIZATION",  
  "primaryMethod": "전체 도수 150과 상대도수 0.24를 곱하여 계급의 도수 36을 산출한다.",  
  "decisiveStep": "150 \* 0.24 \= 36 계산",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "상대도수",  
    "l4": "상대도수와 도수의 계산"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_RELATIVE\_FREQUENCY\_RECOVERY",  
    "templateKey": "TPL\_M1\_TOTAL\_AND\_RELATIVE\_TO\_FREQUENCY",  
    "why": "도수의 총합과 상대도수가 주어졌을 때 계급의 도수를 직접 구하는 기본 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "상대도수 공식에 전체 인원을 곱하는 1단계 기본 연산",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "상대도수",  
      "도수"  
    \],  
    "goal": \[  
      "도수"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q19  
\- 형식: 객관식  
\- 배점: 4  
\#\#\# 발문  
학생 수가 \$100\$명인 A 중학교와 \$200\$명인 B 중학교 학생들의 앉은키에 대한 상대도수의 분포를 비교한 자료에서, 다음 설명 중 옳지 않은 것은? \[4점\]  
(단, A교의 상대도수는 \$70\\rm\\,cm\$ 미만: \$0.10\$, \$80\$\~\$90\\rm\\,cm\$: \$0.40\$이고, B교의 상대도수는 \$70\\rm\\,cm\$ 미만: \$0.05\$, \$80\$\~\$90\\rm\\,cm\$: \$0.35\$, \$90\\rm\\,cm\$ 이상: \$0.45\$이다.)  
\#\#\# 선지  
① A 중학교에서 앉은키가 \$70\\rm\\,cm\$ 미만인 학생 수는 \$10\$명이다. ② B 중학교에서 앉은키가 \$70\\rm\\,cm\$ 미만인 학생 수는 \$10\$명이다. ③ B 중학교에서 앉은키가 \$90\\rm\\,cm\$ 이상인 학생은 B 중학교 전체의 \$45\\%\$이다. ④ A 중학교와 B 중학교에서 앉은키가 \$80\\rm\\,cm\$ 이상 \$90\\rm\\,cm\$ 미만인 학생 수는 서로 같다. ⑤ 상대도수의 분포를 비교했을 때 B 중학교 학생들의 앉은키가 A 중학교 학생들보다 대체로 더 큰 편이다.  
\#\#\# 정답  
④  
\#\#\# 해설  
두 집단의 전체 도수가 서로 다르므로 상대도수에 각 집단의 전체 도수를 곱하여 실제 학생 수를 비교한다.

① A 중학교에서 \$70\\rm\\,cm\$ 미만인 학생 수는  
\$\$100 \\times 0.10 \= 10\\text{명}\$\$  
이다. (참)  
② B 중학교에서 \$70\\rm\\,cm\$ 미만인 학생 수는  
\$\$200 \\times 0.05 \= 10\\text{명}\$\$  
이다. (참)  
③ B 중학교에서 \$90\\rm\\,cm\$ 이상인 계급의 상대도수는 \$0.45\$이므로 백분율은 \$45\\%\$이다. (참)  
④ '\$80\\rm\\,cm\$ 이상 \$90\\rm\\,cm\$ 미만' 계급의 실제 학생 수를 구하면  
\$\$\\begin{aligned}  
\\text{A 중학교: } 100 \\times 0.40 &= 40\\text{명} \\\\  
\\text{B 중학교: } 200 \\times 0.35 &= 70\\text{명}  
\\end{aligned}\$\$  
이므로 학생 수가 서로 같지 않다. 따라서 ④는 옳지 않다. (거짓)  
⑤ B 중학교의 상대도수가 더 높은 구간 쪽으로 치우쳐 있으므로 학생들의 앉은키가 상대적으로 더 크다. (참)

따라서 옳지 않은 것은 ④이다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "전체 도수가 다른 두 집단의 상대도수 곱 실제 도수 환산 비교 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "19",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_INTERPRETATION",  
  "conceptClusterKey": "DATA\_INTERPRETATION",  
  "primaryMethod": "A교 도수 40명과 B교 도수 70명이 다름을 계산하여 4번의 오류를 식별한다.",  
  "decisiveStep": "100\*0.4=40과 200\*0.35=70 비교 후 불일치 판정",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "상대도수",  
    "l4": "두 집단의 상대도수 분포 비교"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_TWO\_GROUPS\_RELATIVE\_FREQUENCY\_COMPARE",  
    "templateKey": "TPL\_M1\_DIFFERENT\_TOTAL\_RELATIVE\_TO\_ABSOLUTE",  
    "why": "전체 도수가 다른 두 집단에서 상대도수를 바탕으로 실제 도수를 비교 판별하는 심화 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "CASE\_BRANCH",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "서로 다른 전체 인원을 반영하여 실제 도수를 산출 비교하는 2단계 문항",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "상대도수",  
      "도수"  
    \],  
    "goal": \[  
      "해석"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q20  
\- 형식: 서술형  
\- 배점: 5  
\#\#\# 발문  
\[서술형 1\] 다음 일차방정식을 풀고, 그 과정을 서술하시오. \[5점\]

(1) \$3x \- 5 \= 4\$ \[1점\]

(2) \$4(x \- 2\) \= x \+ 7\$ \[2점\]

(3) \$0.4x \- \\dfrac{3}{5} \= 1\$ \[2점\]  
\#\#\# 선지  
없음  
\#\#\# 정답  
(1) \$x \= 3\$, (2) \$x \= 5\$, (3) \$x \= 4\$  
\#\#\# 해설  
(1) \$3x \- 5 \= 4\$  
상수항을 우변으로 이항하여 정리하면  
\$\$\\begin{aligned}  
3x &= 4 \+ 5 \\\\  
3x &= 9 \\\\  
x &= 3  
\\end{aligned}\$\$

(2) \$4(x \- 2\) \= x \+ 7\$  
좌변의 괄호를 전개하면  
\$\$\\begin{aligned}  
4x \- 8 &= x \+ 7 \\\\  
4x \- x &= 7 \+ 8 \\\\  
3x &= 15 \\\\  
x &= 5  
\\end{aligned}\$\$

(3) \$0.4x \- \\dfrac{3}{5} \= 1\$  
소수와 분수가 섞여 있으므로 양변에 \$10\$을 곱하여 정수 계수로 변환하면  
\$\$\\begin{aligned}  
4x \- 6 &= 10 \\\\  
4x &= 10 \+ 6 \\\\  
4x &= 16 \\\\  
x &= 4  
\\end{aligned}\$\$

답: (1) \$x \= 3\$, (2) \$x \= 5\$, (3) \$x \= 4\$  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "기본 일차방정식, 괄호가 있는 일차방정식, 소수/분수 계수 일차방정식 대수 풀이 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "20",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-03",  
  "subUnitKey": "M1-03-LINEAR\_EQUATION",  
  "conceptClusterKey": "ALGEBRAIC\_EXPRESSION",  
  "primaryMethod": "이항, 분배법칙, 정수 계수화(10 곱하기)를 각각 적용하여 세 일차방정식의 해를 도출한다.",  
  "decisiveStep": "각 일차방정식 단계별 동류항 정리 및 해 x=3, 5, 4 도출",  
  "rpm": {  
    "majorUnit": "문자와 식",  
    "midUnit": "일차방정식",  
    "l3": "일차방정식의 풀이",  
    "l4": "복잡한 일차방정식의 풀이"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_LINEAR\_EQUATION\_SOLVE",  
    "templateKey": "TPL\_M1\_LINEAR\_EQUATION\_STEPWISE\_SOLUTION",  
    "why": "기본형, 괄호형, 분수·소수형 일차방정식의 표준 대수 풀이 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "일차방정식의 표준적인 이항 및 계수 정수화 단계 적용",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "방정식"  
    \],  
    "goal": \[  
      "해"  
    \],  
    "method": \[  
      "이항"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q21  
\- 형식: 서술형  
\- 배점: 10  
\#\#\# 발문  
\[서술형 2\] 다음은 정다면체에 대한 탐구 활동지이다. 제시된 물음에 답하고 그 과정을 서술하시오. \[총 10점\]

(1) 한 면의 모양이 모두 합동인 마름모로 이루어진 십이면체는 정다면체인지 아닌지 판단하고, 그 이유를 서술하시오. \[3점\]

(2) 정다면체의 정의를 완결된 문장으로 서술하시오. \[3점\]

(3) 입체도형의 꼭짓점을 이루기 위한 내각의 합 성질을 이용하여, 면의 모양이 정사각형인 정다면체가 정육면체 \$1\$가지만 존재하는 이유를 서술하시오. \[4점\]  
\#\#\# 선지  
없음  
\#\#\# 정답  
(1) 정다면체가 아니다. 정다면체가 되려면 모든 면이 정다각형이어야 하는데 마름모는 내각의 크기가 모두 같지 않아 정다각형이 아니기 때문이다.  (2) 모든 면이 서로 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 같은 다면체이다.  (3) 정사각형의 한 내각의 크기는 \$90^\\circ\$이다. 입체도형의 꼭짓점을 형성하려면 한 꼭짓점에 모인 면의 내각의 합이 \$360^\\circ\$보다 작아야 한다. 정사각형 \$3\$개가 모이면 \$90^\\circ \\times 3 \= 270^\\circ \< 360^\\circ\$이므로 입체가 되지만, \$4\$개가 모이면 \$90^\\circ \\times 4 \= 360^\\circ\$가 되어 평면이 되므로 불가능하다. 따라서 정육면체 \$1\$가지만 존재한다.  
\#\#\# 해설  
(1) 정다면체 여부 판단 및 이유:  
정다면체가 되기 위해서는 '모든 면이 서로 합동인 정다각형'이어야 한다.  
마름모는 네 변의 길이가 같지만 네 내각의 크기가 모두 같지 않으므로 정다각형이 아니다.  
따라서 마름모로 이루어진 십이면체는 정다면체가 아니다.

(2) 정다면체의 정의:  
'모든 면이 서로 합동인 정다각형이고, 각 꼭짓점에 모인 면의 개수가 모두 같은 다면체'이다.

(3) 정사각형으로 이루어진 정다면체가 \$1\$가지인 이유:  
1단계: 정사각형의 한 내각의 크기는 \$90^\\circ\$이다.  
2단계: 입체도형의 꼭짓점이 형성되려면 한 꼭짓점에 최소 \$3\$개 이상의 면이 모여야 하고, 그 꼭짓점에 모인 면의 내각의 크기의 합이 \$360^\\circ\$ 미만이어야 한다.  
3단계: 정사각형이 한 꼭짓점에 \$3\$개 모이면  
\$\$90^\\circ \\times 3 \= 270^\\circ \< 360^\\circ\$\$  
이므로 입체도형인 정육면체가 만들어진다.  
4단계: 그러나 정사각형이 \$4\$개 모이면  
\$\$90^\\circ \\times 4 \= 360^\\circ\$\$  
가 되어 면들이 완전히 펴져 평면을 이루므로 입체도형의 꼭짓점을 만들 수 없다.  
따라서 한 면의 모양이 정사각형인 정다면체는 정육면체 \$1\$가지만 존재한다.

답: 해설 참조  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "정다면체 정의 조건 검증 및 한 꼭짓점 내각합 360도 미만 성질 서술 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "21",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE",  
  "conceptClusterKey": "SOLID\_FIGURE",  
  "primaryMethod": "정다면체의 2대 조건(정다각형 면, 꼭짓점당 동일 면수)과 꼭짓점 내각합 360도 미만 원리를 서술한다.",  
  "decisiveStep": "정사각형 3개 합 270도 가능, 4개 합 360도 불가능 서술",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 성질",  
    "l3": "정다면체",  
    "l4": "정다면체의 정의와 형성 조건"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_REGULAR\_POLYHEDRON\_PROOF",  
    "templateKey": "TPL\_M1\_REGULAR\_POLYHEDRON\_EXISTENCE\_REASON",  
    "why": "정다면체의 정의와 한 꼭짓점에 모인 각의 합 조건을 바탕으로 정다면체의 개수를 증명하는 대표 서술형 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "정다면체의 정의 및 각도 기하학적 성립 원리를 논리적으로 서술하는 문항",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "정다면체",  
      "정사각형",  
      "다면체"  
    \],  
    "goal": \[  
      "정다면체"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q22  
\- 형식: 서술형  
\- 배점: 6  
\#\#\# 발문  
\[서술형 3\] 다음은 구의 겉넓이를 탐구하기 위해, 구 모양의 과일을 반으로 잘라 단면과 크기가 같은 원 \$4\$개를 그린 후, 과일 껍질을 잘라 원 \$4\$개를 채우는 활동이다. 물음에 답하고 그 풀이 과정을 서술하시오. \[총 6점\]

(1) 구의 반지름의 길이를 \$r\$이라 할 때, 위 탐구 활동의 결과를 근거로 구의 겉넓이 공식을 서술하시오. \[2점\]

(2) 반지름의 길이가 \$5\\rm\\,cm\$인 반구의 겉넓이를 구하고, 그 풀이 과정을 서술하시오. \[4점\]  
\#\#\# 선지  
없음  
\#\#\# 정답  
(1) \$4\\pi r^2\$ (단면 원의 넓이의 \$4\$배)  (2) \$75\\pi\\rm\\,cm^2\$  
\#\#\# 해설  
(1) 구의 중심을 지나는 단면인 원의 넓이는 \$\\pi r^2\$이다.  
탐구 활동에서 구의 겉넓이 전체(껍질)가 단면과 크기가 같은 원 \$4\$개의 넓이와 같으므로, 반지름이 \$r\$인 구의 겉넓이 공식은 다음과 같다.  
\$\$S \= 4\\pi r^2\$\$

(2) 반지름이 \$5\\rm\\,cm\$인 반구의 겉넓이 계산:  
1단계: 반구의 겉넓이는 굽은 곡면 부분의 넓이와 평평한 원 모양 밑면의 넓이의 합이다.

2단계: 곡면 부분의 넓이는 구 전체의 겉넓이의 절반이므로  
\$\$\\begin{aligned}  
\\dfrac{1}{2} \\times (4\\pi \\times 5^2) &= 2\\pi \\times 25 \\\\  
&= 50\\pi\\rm\\,cm^2  
\\end{aligned}\$\$

3단계: 평평한 원 모양 밑면의 넓이는  
\$\$\\begin{aligned}  
\\pi \\times 5^2 &= 25\\pi\\rm\\,cm^2  
\\end{aligned}\$\$

4단계: 따라서 반구의 겉넓이는  
\$\$\\begin{aligned}  
50\\pi \+ 25\\pi &= 75\\pi\\rm\\,cm^2  
\\end{aligned}\$\$

답: (1) \$4\\pi r^2\$  (2) \$75\\pi\\rm\\,cm^2\$  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "구 겉넓이 공식 유도 서술 및 반구 곡면과 원형 단면 합산 겉넓이 연산 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "22",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-07",  
  "subUnitKey": "M1-07-SOLID\_FIGURE\_MEASURE",  
  "conceptClusterKey": "SOLID\_FIGURE\_MEASURE",  
  "primaryMethod": "구 겉넓이 공식 4pi\*r^2을 제시하고, 반구 겉넓이 50pi+25pi=75pi를 계산한다.",  
  "decisiveStep": "반구 곡면 50pi \+ 밑면 25pi \= 75pi 도출",  
  "rpm": {  
    "majorUnit": "입체도형",  
    "midUnit": "입체도형의 겉넓이와 부피",  
    "l3": "구의 겉넓이",  
    "l4": "반구의 겉넓이"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_HEMISPHERE\_SURFACE\_AREA",  
    "templateKey": "TPL\_M1\_SPHERE\_INQUIRY\_HEMISPHERE\_AREA",  
    "why": "구 겉넓이의 기하학적 유도 원리를 설명하고 반구의 겉넓이를 구하는 서술형 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 2,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "구 겉넓이 원리를 서술하고 반구의 곡면과 밑면을 분할 합산하는 2단계 서술",  
  "level": "중",  
  "item4slot": {  
    "given": \[  
      "구",  
      "반지름"  
    \],  
    "goal": \[  
      "겉넓이"  
    \],  
    "method": \[  
      "원",  
      "합"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`

\#\# Q23  
\- 형식: 서술형  
\- 배점: 4  
\#\#\# 발문  
\[서술형 4\] 다음은 어느 학교 축제 부스에서 하루 동안 판매한 티셔츠의 치수를 조사하여 나타낸 표이다. 추가로 제작할 티셔츠의 치수를 결정할 때 가장 적절한 대푯값은 무엇인지 구하고, 그 이유를 서술하시오. \[4점\]

\< 티셔츠 판매 현황 \>  
\<div class="question-table-wrap"\>\<table class="question-table"\>\<thead\>\<tr\>\<th\>티셔츠 치수\</th\>\<th\>판매 수량(벌)\</th\>\</tr\>\</thead\>\<tbody\>\<tr\>\<td\>85(S)\</td\>\<td\>4\</td\>\</tr\>\<tr\>\<td\>90(M)\</td\>\<td\>7\</td\>\</tr\>\<tr\>\<td\>95(L)\</td\>\<td\>22\</td\>\</tr\>\<tr\>\<td\>100(XL)\</td\>\<td\>8\</td\>\</tr\>\<tr\>\<td\>105(XXL)\</td\>\<td\>3\</td\>\</tr\>\<tr\>\<td\>합계\</td\>\<td\>44\</td\>\</tr\>\</tbody\>\</table\>\</div\>  
\#\#\# 선지  
없음  
\#\#\# 정답  
최빈값, \$95\$(L). 가장 많이 판매된 치수가 \$95\$(L)이므로 추가 주문 수량을 결정하기 위한 대표 치수로 가장 적절하다.  
\#\#\# 해설  
1단계: 주어진 자료는 티셔츠 치수별 판매 수량을 나타낸 도수분포 자료이다. 의류 치수와 같은 상품 주문에서는 수치적인 평균값보다 학생들이 가장 많이 찾는 치수를 파악하는 것이 중요하다.

2단계: 표에서 각 치수별 판매 수량을 비교하면  
\$85\$는 \$4\$벌, \$90\$은 \$7\$벌, \$95\$는 \$22\$벌, \$100\$은 \$8\$벌, \$105\$는 \$3\$벌이다.  
판매 수량이 가장 많은 치수는 \$22\$벌이 판매된 \$95\$(L)이다.  
따라서 최빈값은 \$95\$(L)이다.

3단계: 이유 서술:  
티셔츠의 치수를 결정할 때는 가장 많은 학생이 선택한 치수를 파악하여 수요에 맞추는 것이 필요하므로, 도수가 가장 큰 값을 나타내는 '최빈값'이 가장 적절한 대푯값이다.

답: 최빈값, \$95\$(L). 가장 많이 판매된 치수가 \$95\$(L)이므로 추가 주문 및 수요를 대표하기에 가장 적절하다.  
\`\`\`json:plan  
{  
  "status": "EXEMPT",  
  "reason": "상품 치수 도수분포 자료에서 최빈값 식별 및 대푯값 선정 타당성 서술 문항"  
}  
\`\`\`  
\`\`\`json:meta  
{  
  "sourceQid": "23",  
  "variationType": "STRICT\_VARIANT",  
  "standardCourse": "중1",  
  "courseKey": "MID-MATH-1",  
  "curriculum": "2022",  
  "standardUnitKey": "M1-08",  
  "subUnitKey": "M1-08-DATA\_INTERPRETATION",  
  "conceptClusterKey": "DATA\_INTERPRETATION",  
  "primaryMethod": "판매 수량이 22벌로 가장 많은 95(L)을 최빈값으로 구하고, 의류 치수 결정에 최빈값이 적절한 이유를 서술한다.",  
  "decisiveStep": "최빈값 95(L) 도출 및 최다 판매 수요 대표성 서술",  
  "rpm": {  
    "majorUnit": "통계",  
    "midUnit": "자료의 정리와 해석",  
    "l3": "대푯값",  
    "l4": "최빈값의 실생활 활용"  
  },  
  "ptTplCandidate": {  
    "problemTypeKey": "PT\_M1\_MODE\_REAL\_LIFE\_APPLICATION",  
    "templateKey": "TPL\_M1\_PRODUCT\_SIZE\_MODE\_JUSTIFICATION",  
    "why": "상품 사이즈 선호도 조사에서 최빈값을 구하고 대푯값으로서의 타당성을 논증하는 실생활 템플릿"  
  },  
  "crossConceptKeys": \[\],  
  "conditionKeys": \[\],  
  "integrationPattern": "SEQUENTIAL",  
  "difficultyBucket": 1,  
  "difficultyConfidence": "high",  
  "difficultyBoundaryFlag": "NONE",  
  "difficultyReason": "최빈값을 표에서 찾고 실생활 상황에 따른 이유를 서술하는 기본 문항",  
  "level": "하",  
  "item4slot": {  
    "given": \[  
      "자료"  
    \],  
    "goal": \[  
      "최빈값",  
      "대푯값"  
    \],  
    "method": \[  
      "성질"  
    \],  
    "condition": \[\]  
  },  
  "hold": ""  
}  
\`\`\`  
