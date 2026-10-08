window.examTitle = "ALIVE_LITE_BSG26_B04R2_Q17_OPERATION";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-BSG26-B04R2-Q17-S01",
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 거듭제곱",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C-09-MATRIX_OPERATION",
    "subUnit": "행렬의 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬"
    ],
    "wide": false,
    "content": "$A=\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$일 때, $A+A^2+\\cdots+A^6$의 모든 성분의 합은?",
    "choices": [
      "$12$",
      "$42$",
      "$48$",
      "$54$",
      "$66$"
    ],
    "answer": "④",
    "solution": "$A=\\begin{pmatrix}1&0\\\\0&1\\end{pmatrix}+N$, $N=\\begin{pmatrix}0&0\\\\2&0\\end{pmatrix}$으로 놓으면 $N^2=O$이다.\n직접 곱하면 $A^2=\\begin{pmatrix}1&0\\\\4&1\\end{pmatrix}$이고, 이를 반복하면 $A^k=\\begin{pmatrix}1&0\\\\2k&1\\end{pmatrix}$이다.\n$A$부터 $A^6$까지 대각 성분의 합은 $12$이고, 왼쪽 아래 성분의 합은 $2(1+2+\\cdots+6)=42$이다.\n따라서 전체 성분의 합은 $12+42=54$이다.\n따라서 정답은 ④이다.",
    "problemTypeKey": "PT_H1_MATRIX_MULTIPLICATION",
    "templateKey": "TPL_H1_MATRIX_PRODUCT_DIRECT",
    "sourceType": "generated"
  },
  {
    "id": 2,
    "uid": "ALITE-BSG26-B04R2-Q17-S02",
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 거듭제곱",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C-09-MATRIX_OPERATION",
    "subUnit": "행렬의 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬"
    ],
    "wide": false,
    "content": "$A=\\begin{pmatrix}1&0\\\\3&1\\end{pmatrix}$일 때 $A^n$의 $(2,1)$성분이 $27$이다. 자연수 $n$은?",
    "choices": [
      "$7$",
      "$8$",
      "$9$",
      "$10$",
      "$27$"
    ],
    "answer": "③",
    "solution": "$A^2=\\begin{pmatrix}1&0\\\\6&1\\end{pmatrix}$, $A^3=\\begin{pmatrix}1&0\\\\9&1\\end{pmatrix}$으로 왼쪽 아래 성분이 거듭제곱할 때마다 $3$씩 증가한다.\n따라서 $A^n=\\begin{pmatrix}1&0\\\\3n&1\\end{pmatrix}$이다.\n조건에서 $3n=27$이므로 $n=9$이다.\n따라서 정답은 ③이다.",
    "problemTypeKey": "PT_H1_MATRIX_MULTIPLICATION",
    "templateKey": "TPL_H1_MATRIX_PRODUCT_DIRECT",
    "sourceType": "generated"
  },
  {
    "id": 3,
    "uid": "ALITE-BSG26-B04R2-Q17-S03",
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 거듭제곱",
    "originalCategory": "행렬",
    "standardCourse": "공통수학1",
    "standardUnitKey": "H22-C-09",
    "standardUnit": "행렬과 그 연산",
    "standardUnitOrder": 9,
    "subUnitKey": "H22-C-09-MATRIX_OPERATION",
    "subUnit": "행렬의 연산",
    "subUnitConfidence": "candidate_evidence",
    "subUnitClassificationDepth": "complete_candidate",
    "questionType": "객관식",
    "layoutTag": "grid",
    "tags": [
      "객관식",
      "행렬"
    ],
    "wide": false,
    "content": "$A=\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$일 때 $A-A^2+A^3-A^4+A^5-A^6+A^7-A^8$의 $(2,1)$성분은?",
    "choices": [
      "$-16$",
      "$-8$",
      "$0$",
      "$8$",
      "$16$"
    ],
    "answer": "②",
    "solution": "$A^k=\\begin{pmatrix}1&0\\\\2k&1\\end{pmatrix}$이므로 $(2,1)$성분은 $2k$이다.\n주어진 교대합의 $(2,1)$성분은 $2(1-2+3-4+5-6+7-8)$이다.\n인접한 두 항을 묶으면 $(-1)+(-1)+(-1)+(-1)=-4$이므로 전체는 $-8$이다.\n따라서 정답은 ②이다.",
    "problemTypeKey": "PT_H1_MATRIX_MULTIPLICATION",
    "templateKey": "TPL_H1_MATRIX_PRODUCT_DIRECT",
    "sourceType": "generated"
  }
];
