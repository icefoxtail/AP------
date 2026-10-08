window.examTitle = "ALIVE_LITE_BSG26_B04_Q17";
window.questionBank = [
  {
    "id": 1,
    "uid": "ALITE-BSG26-B04-Q17-S01",
    "sourceQid": 17,
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 연산",
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
    "content": "행렬 $A=\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$에 대하여 $A+A^2+\\cdots+A^8$의 모든 성분의 합은?",
    "choices": [
      "$88$",
      "$90$",
      "$96$",
      "$104$",
      "$108$"
    ],
    "answer": "①",
    "solution": "$N=A-I=\\begin{pmatrix}0&0\\\\2&0\\end{pmatrix}$라 놓으면 $N^2=O$이다. 따라서 $A^k=I+kN=\\begin{pmatrix}1&0\\\\2k&1\\end{pmatrix}$이다. 대각 성분합은 $16$, $(2,1)$성분합은 $2(1+\\cdots+8)=72$이므로 전체 합은 $88$이다.\n따라서 정답은 ①이다.",
    "sourceType": "generated"
  },
  {
    "id": 2,
    "uid": "ALITE-BSG26-B04-Q17-S02",
    "sourceQid": 17,
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 연산",
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
    "content": "행렬 $A=\\begin{pmatrix}1&0\\\\3&1\\end{pmatrix}$에 대하여 $A^n$의 $(2,1)$성분이 $21$이다. 자연수 $n$의 값은?",
    "choices": [
      "$6$",
      "$7$",
      "$8$",
      "$9$",
      "$10$"
    ],
    "answer": "②",
    "solution": "$N=A-I$이면 $N^2=O$이므로 $A^n=I+nN=\\begin{pmatrix}1&0\\\\3n&1\\end{pmatrix}$이다. $3n=21$에서 $n=7$이다.\n따라서 정답은 ②이다.",
    "sourceType": "generated"
  },
  {
    "id": 3,
    "uid": "ALITE-BSG26-B04-Q17-S03",
    "sourceQid": 17,
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 연산",
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
    "content": "행렬 $A=\\begin{pmatrix}1&0\\\\1&1\\end{pmatrix}$에 대하여 $A^2+A^4+A^6+A^8+A^{10}$의 모든 성분의 합은?",
    "choices": [
      "$30$",
      "$35$",
      "$40$",
      "$45$",
      "$50$"
    ],
    "answer": "③",
    "solution": "$A^k=\\begin{pmatrix}1&0\\\\k&1\\end{pmatrix}$이므로 다섯 행렬의 대각 성분합은 $10$이다. $(2,1)$성분합은 $2+4+6+8+10=30$이므로 합은 $40$이다.\n따라서 정답은 ③이다.",
    "sourceType": "generated"
  },
  {
    "id": 4,
    "uid": "ALITE-BSG26-B04-Q17-S04",
    "sourceQid": 17,
    "level": "중",
    "difficultyBucket": 3,
    "category": "행렬의 연산",
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
    "content": "행렬 $A=\\begin{pmatrix}1&0\\\\2&1\\end{pmatrix}$에 대하여 $A^3A^5$의 $(2,1)$성분은?",
    "choices": [
      "$8$",
      "$12$",
      "$14$",
      "$16$",
      "$20$"
    ],
    "answer": "④",
    "solution": "$A^3A^5=A^8$이다. $A=I+N$, $N^2=O$이므로 $A^8=I+8N=\\begin{pmatrix}1&0\\\\16&1\\end{pmatrix}$이다. 따라서 구하는 성분은 $16$이다.\n따라서 정답은 ④이다.",
    "sourceType": "generated"
  }
];
