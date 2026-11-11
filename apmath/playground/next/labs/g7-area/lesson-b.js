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
  ],
  "b3-rail": [
    {
      "title": "평행선 위에서 움직이면",
      "label": "넓이 원리",
      "tab": "review",
      "answer": "넓이는 일정",
      "answerText": "넓이는 일정",
      "summary": "밑변과 평행선 사이의 높이가 유지되는지 확인해요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "밑변과 높이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "밑변 BC=8 cm, 두 평행선 사이의 거리는 5 cm예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "area",
                "b2Mode": 0
              },
              "to": {
                "b3T": 0.6
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "꼭짓점 A를 위쪽 평행선 위에서 가로로 옮겨요.",
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
          "title": "움직여도 같은 조건",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "높이는 A에서 직선 BC에 수직으로 잰 거리예요.",
              "to": {
                "b3T": 0.8
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "평행선 사이의 거리는 같고 밑변 BC도 그대로예요.",
              "step": 2
            }
          ]
        },
        {
          "title": "넓이 판단",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "삼각형의 넓이는 밑변×높이÷2로 계산해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "8×5÷2=20 cm²이므로 넓이는 일정해요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "넓이가 같으면 둘레도 같을까",
      "label": "둘레",
      "tab": "review",
      "answer": "둘레는 달라질 수 있다",
      "answerText": "둘레는 달라질 수 있다",
      "summary": "둘레는 세 변의 길이의 합으로 넓이와 구별해요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "옮기기 전의 조건",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "BC=8 cm, 평행선 사이의 거리는 5 cm예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "perimeter",
                "b2Mode": 0
              },
              "to": {
                "b3T": 0.88
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "A를 C의 위쪽에서 오른쪽 바깥으로 옮겨 볼게요.",
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
            "b3T": 0.75,
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
          "title": "세 변의 길이 비교",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "BC는 그대로이고 AB와 AC의 길이를 비교해요.",
              "to": {
                "b3T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "이렇게 옮기면 AB와 AC가 둘 다 길어져요.",
              "step": 2
            }
          ]
        },
        {
          "title": "넓이와 둘레 구별",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "둘레는 세 변의 길이의 합이에요. 넓이와 다른 값이죠.",
              "step": 3
            },
            {
              "at": 5,
              "say": "넓이가 같아도 둘레는 달라질 수 있다.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "다른 꼭짓점의 삼각형 넓이",
      "label": "넓이 문제",
      "tab": "review",
      "answer": "△A′BC=20 cm²",
      "answerText": "△A′BC=20 cm²",
      "summary": "높이 수치 없이도 같은 밑변과 같은 높이로 넓이를 비교해요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "l과 m은 평행하고 △ABC의 넓이는 20 cm²예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "transfer",
                "b2Mode": 0
              },
              "to": {
                "arBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "같은 직선 l 위의 점 A′로 만든 △A′BC를 봐요.",
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
          "title": "밑변과 높이 비교",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "두 삼각형은 밑변 BC를 함께 써요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "두 높이는 모두 평행선 l과 m 사이의 거리예요.",
              "step": 2
            }
          ]
        },
        {
          "title": "주어진 넓이 이용",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "밑변과 높이가 같으므로 두 삼각형의 넓이가 같아요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "따라서 △A′BC=20 cm²예요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "b4-wing": [
    {
      "title": "대각선 양옆의 넓이 비교",
      "label": "넓이 관계",
      "tab": "review",
      "answer": "S₁=S₂",
      "answerText": "S₁=S₂",
      "summary": "넓이가 같은 두 삼각형에서 공통 부분을 빼요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "도형과 기호",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "사다리꼴에서 AD∥BC이고 두 대각선의 교점은 O예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "wingCompare",
                "b2Mode": 0
              },
              "to": {
                "b4T": 0.4
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "S₁은 △ABO, S₂는 △DCO의 넓이예요.",
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
          "title": "같은 넓이에서 빼기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "△ABC와 △DBC는 밑변 BC와 높이가 같아요.",
              "set": {
                "arBStage": 1
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "양쪽에서 공통 부분 △OBC를 빼요.",
              "set": {
                "arBStage": 2
              },
              "to": {
                "b4T": 0.8
              },
              "dur": 3
            }
          ]
        },
        {
          "title": "남은 두 부분",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "같은 넓이에서 같은 부분을 빼면 남은 넓이도 같아요.",
              "to": {
                "b4T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "따라서 양옆 삼각형의 넓이는 S₁=S₂예요.",
              "set": {
                "arShowAnswer": true
              },
              "step": 3
            }
          ]
        }
      ]
    },
    {
      "title": "대각선 옆 삼각형의 넓이",
      "label": "넓이 계산",
      "tab": "review",
      "answer": "10 cm²",
      "answerText": "10 cm²",
      "summary": "△ABC에서 공통 부분 △OBC를 빼면 △ABO가 남아요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 두 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "△ABC의 넓이는 30 cm², △OBC의 넓이는 20 cm²예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "wingArea",
                "b2Mode": 0
              },
              "to": {
                "b4T": 0.4
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "구하는 넓이 S₁은 △ABO의 넓이예요.",
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
          "title": "도형을 두 부분으로",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "△ABC는 △ABO와 △OBC로 나뉘어요.",
              "to": {
                "b4T": 0.8
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "전체에서 △OBC를 빼면 △ABO만 남아요.",
              "set": {
                "arBStage": 2
              },
              "step": 2
            }
          ]
        },
        {
          "title": "남은 넓이 계산",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "주어진 30 cm²에서 공통 부분 20 cm²를 빼요.",
              "to": {
                "b4T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "△ABO의 넓이는 30−20=10 cm²예요.",
              "set": {
                "arShowAnswer": true
              },
              "step": 3
            }
          ]
        }
      ]
    }
  ],
  "b5-ratio": [
    {
      "title": "같은 높이의 넓이 비",
      "label": "넓이의 비",
      "tab": "review",
      "answer": "S₁:S₂=3:2",
      "answerText": "S₁:S₂=3:2",
      "summary": "높이가 같으면 넓이의 비는 밑변의 길이의 비와 같아요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "밑변과 넓이의 기호",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "밑변 BD=m=3 cm, DC=n=2 cm예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "ratio",
                "b2Mode": 0
              },
              "to": {
                "b5T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "두 삼각형의 넓이를 S₁, S₂라 하고 높이는 h=8 cm예요.",
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
          "title": "두 넓이 나타내기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "두 삼각형은 같은 꼭짓점과 밑변의 직선을 써요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "S₁=3×8÷2=12, S₂=2×8÷2=8이에요.",
              "set": {
                "arBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "title": "공통인 높이 약분",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "넓이의 비에서 공통인 높이 h와 2로 나누기를 약분해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "넓이의 비는 밑변의 비와 같은 S₁:S₂=3:2예요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "밑변의 비로 ABD 넓이 구하기",
      "label": "ABD 넓이",
      "tab": "review",
      "answer": "12 cm²",
      "answerText": "12 cm²",
      "summary": "전체 넓이를 밑변의 비에 맞춰 몫으로 나누어요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 비와 전체 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "BD:DC=3:2이고 전체 △ABC의 넓이는 20 cm²예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "part",
                "b2Mode": 0
              },
              "to": {
                "b5T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "구하는 것은 △ABD의 넓이예요.",
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
          "title": "넓이의 비 구하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "두 삼각형은 A에서 직선 BC까지의 높이 h가 같아요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "따라서 △ABD:△ADC의 넓이의 비도 3:2예요.",
              "set": {
                "arBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "title": "한 몫의 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "전체 넓이를 3+2=5개의 같은 몫으로 나누어요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "한 몫의 넓이는 20÷5=4 cm²예요.",
              "set": {
                "arBStage": 2
              }
            }
          ]
        },
        {
          "title": "구하는 삼각형의 몫",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "△ABD는 밑변의 비에서 3몫에 해당해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "넓이는 4×3=12 cm²예요.",
              "set": {
                "arShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "밑변의 비로 ADC 넓이 구하기",
      "label": "ADC 넓이",
      "tab": "review",
      "answer": "8 cm²",
      "answerText": "8 cm²",
      "summary": "전체 넓이를 밑변의 비에 맞춰 몫으로 나누어요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "title": "주어진 비와 전체 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "BD:DC=3:2이고 전체 △ABC의 넓이는 20 cm²예요.",
              "set": {
                "arShowAnswer": false,
                "arBStage": 0,
                "arBAsk": "part",
                "b2Mode": 0
              },
              "to": {
                "b5T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "구하는 것은 △ADC의 넓이예요.",
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
            "b5Q": 1,
            "arBLine": 0
          }
        },
        {
          "title": "넓이의 비 구하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "두 삼각형은 A에서 직선 BC까지의 높이 h가 같아요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "따라서 △ABD:△ADC의 넓이의 비도 3:2예요.",
              "set": {
                "arBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "title": "한 몫의 넓이",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "전체 넓이를 3+2=5개의 같은 몫으로 나누어요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "한 몫의 넓이는 20÷5=4 cm²예요.",
              "set": {
                "arBStage": 2
              }
            }
          ]
        },
        {
          "title": "구하는 삼각형의 몫",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "△ADC는 밑변의 비에서 2몫에 해당해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "넓이는 4×2=8 cm²예요.",
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
