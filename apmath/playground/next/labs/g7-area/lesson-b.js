/* 넓이 해설 B: t2 원본 질문·모델·정리와 문제의 조건을 사용합니다.
 * 공통 재생 키트를 재사용하고 최종 답은 마지막 장에서 arShowAnswer로 공개합니다.
 * 전수 모바일 시각검수는 운영 반영 후 별도로 진행합니다. */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-area'] = window.APL_LESSONS['g7-area'] || {};
Object.assign(window.APL_LESSONS['g7-area'], {
  "b1-rt": [
    {
      "title": "빗변에 내린 높이 구하기",
      "label": "높이 h",
      "tab": "review",
      "answer": "2.4 cm",
      "answerText": "2.4 cm",
      "summary": "같은 삼각형의 넓이를 두 밑변으로 나타내어 같게 놓아요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 변과 높이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "직각삼각형의 AB=3 cm, AC=4 cm, BC=5 cm예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "height",
                "b2Mode": 0
              },
              "to": {
                "b1T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "h는 A에서 빗변 BC에 내린 수선 AH의 길이예요.",
              "step": 1
            }
          ],
          "start": {
            "b1K": 1,
            "b1T": 0,
            "b2A": 10,
            "b2K": 0,
            "b3B": 8,
            "b3H": 5,
            "b3T": 0.35,
            "b3U": 0.8,
            "b4B": 10,
            "b4D": 5,
            "b4H": 6,
            "b4P": 2,
            "b4T": 0,
            "b5M": 3,
            "b5N": 2,
            "b5H": 8,
            "b5T": 0,
            "b5Q": 0,
            "arBLine": 0
          }
        },
        {
          "title": "직각을 낀 두 변",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "서로 수직인 AB와 AC를 밑변과 높이로 써요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "삼각형 넓이는 3×4÷2=6 cm²예요.",
              "set": {
                "arBStage": 1
              }
            }
          ]
        },
        {
          "title": "빗변을 밑변으로",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "이번에는 BC를 밑변으로, AH를 높이로 잡아요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "같은 넓이를 5×h÷2로도 나타낼 수 있어요.",
              "set": {
                "arBStage": 2
              }
            }
          ],
          "start": {
            "b1T": 0
          }
        },
        {
          "title": "같은 넓이로 식 세우기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "3×4÷2=5×h÷2에서 12=5×h예요.",
              "set": {
                "arBStage": 3
              },
              "step": 3
            },
            {
              "at": 5,
              "say": "h=12÷5=2.4 cm예요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "b2-para": [
    {
      "title": "밑변을 바꾸어 넓이 비교",
      "label": "넓이 비교",
      "tab": "review",
      "answer": "넓이는 같다",
      "answerText": "넓이는 같다",
      "summary": "밑변을 바꾸면 그 밑변에 수직인 높이를 사용해요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "두 밑변과 높이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "BC=10 cm, CD=5 cm인 평행사변형이에요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "compare",
                "b2Mode": 0
              },
              "to": {
                "arBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "BC에 수직인 높이 h₁은 4 cm예요.",
              "step": 1
            }
          ],
          "start": {
            "b1K": 1,
            "b1T": 0,
            "b2A": 10,
            "b2K": 0,
            "b3B": 8,
            "b3H": 5,
            "b3T": 0.35,
            "b3U": 0.8,
            "b4B": 10,
            "b4D": 5,
            "b4H": 6,
            "b4P": 2,
            "b4T": 0,
            "b5M": 3,
            "b5N": 2,
            "b5H": 8,
            "b5T": 0,
            "b5Q": 0,
            "arBLine": 0
          }
        },
        {
          "title": "첫 번째 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "평행사변형의 넓이는 밑변×높이예요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "BC를 밑변으로 하면 10×4=40 cm²예요.",
              "set": {
                "arBStage": 1
              }
            }
          ]
        },
        {
          "title": "다른 밑변의 높이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "CD를 밑변으로 고르면 높이는 CD에 수직이어야 해요.",
              "set": {
                "b2Mode": 1
              },
              "to": {
                "arBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "그 높이를 h₂라 하면 넓이는 5×h₂예요.",
              "set": {
                "arBStage": 2
              },
              "step": 2
            }
          ],
          "start": {
            "arBLine": 0
          }
        },
        {
          "title": "같은 도형 비교",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "밑변을 바꾸어도 평행사변형 자체는 그대로예요.",
              "set": {
                "b2Mode": 2
              },
              "step": 3
            },
            {
              "at": 5,
              "say": "10×4=5×8로, 어느 밑변을 골라도 넓이는 같다.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "다른 밑변에 대한 높이",
      "label": "다른 높이",
      "tab": "review",
      "answer": "8 cm",
      "answerText": "8 cm",
      "summary": "먼저 넓이를 구한 뒤 새 밑변의 길이로 나누어요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 높이와 구할 높이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "평행사변형의 BC=10 cm, CD=5 cm예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "height",
                "b2Mode": 0
              },
              "to": {
                "arBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "BC의 높이 h₁=4 cm이고, CD의 높이 h₂를 구해요.",
              "step": 1
            }
          ],
          "start": {
            "b1K": 1,
            "b1T": 0,
            "b2A": 10,
            "b2K": 0,
            "b3B": 8,
            "b3H": 5,
            "b3T": 0.35,
            "b3U": 0.8,
            "b4B": 10,
            "b4D": 5,
            "b4H": 6,
            "b4P": 2,
            "b4T": 0,
            "b5M": 3,
            "b5N": 2,
            "b5H": 8,
            "b5T": 0,
            "b5Q": 0,
            "arBLine": 0
          }
        },
        {
          "title": "넓이부터 구하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "알고 있는 밑변 BC와 그 높이 h₁을 곱해요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "평행사변형의 넓이는 10×4=40 cm²예요.",
              "set": {
                "arBStage": 1
              }
            }
          ]
        },
        {
          "title": "새 밑변으로 나타내기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "A에서 직선 CD에 수직인 선을 내려요.",
              "set": {
                "b2Mode": 1
              },
              "to": {
                "arBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "CD를 밑변으로 하면 5×h₂=40이에요.",
              "set": {
                "arBStage": 2
              },
              "step": 2
            }
          ],
          "start": {
            "arBLine": 0
          }
        },
        {
          "title": "높이 계산",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "높이는 넓이를 해당 밑변의 길이로 나누어 구해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "h₂=40÷5=8 cm예요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ]
});
