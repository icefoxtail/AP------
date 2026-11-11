/* 다각형 해설 B: t3 원본 질문·모델·정리·문제의 조건을 사용합니다.
 * 기존 공통 재생 키트 재사용, 최종 답은 마지막 장에서 pgShowAnswer로 공개합니다.
 * 전수 모바일 시각검수는 운영 반영 후 별도로 진행합니다. */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-polygons'] = window.APL_LESSONS['g7-polygons'] || {};
Object.assign(window.APL_LESSONS['g7-polygons'], {
  "p3-inO": [
    {
      "title": "안쪽의 점 O와 삼각형",
      "label": "삼각형 수",
      "tab": "review",
      "answer": "삼각형 7개",
      "answerText": "삼각형 7개",
      "summary": "내부의 한 점 O에서 각 변을 밑변으로 삼각형을 만들어요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "기호와 보조선",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "n은 꼭짓점의 수예요. 여기서는 볼록7각형이에요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "count"
              },
              "to": {
                "pgOt": 0.28
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "안쪽의 한 점 O를 모든 꼭짓점과 이어요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "한 변마다 한 삼각형",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "이웃한 두 꼭짓점과 O가 삼각형 하나를 만들어요.",
              "to": {
                "pgOt": 1
              },
              "dur": 6
            },
            {
              "at": 5,
              "say": "다각형의 변마다 이런 삼각형이 하나씩 생겨요.",
              "step": 1
            }
          ]
        },
        {
          "title": "삼각형의 개수",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "삼각형의 개수는 다각형의 변의 수와 같아요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "7각형은 삼각형 7개로 나뉘어요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "내각의 합을 구하는 원리",
      "label": "내각의 합",
      "tab": "review",
      "answer": "900°",
      "answerText": "900°",
      "summary": "삼각형들의 각의 합에서 내부 점 O 둘레의 각을 빼요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "조건과 기호",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "n은 꼭짓점의 수이고, 이 그림은 n=7이에요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "sum"
              },
              "to": {
                "pgOt": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "안쪽 점 O와 모든 꼭짓점을 이으면 삼각형이 생겨요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "삼각형의 각 모두 더하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "변마다 삼각형이 하나씩이므로 삼각형은 7개예요.",
              "set": {
                "pgBStage": 1
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "각의 합은 180°×7=1260°예요.",
              "set": {
                "pgBStage": 2
              },
              "step": 2
            }
          ]
        },
        {
          "title": "다각형에 없는 각",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "이 합에는 점 O 주위의 각도 함께 들어 있어요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "O 주위의 360°는 다각형의 내각이 아니므로 빼요.",
              "set": {
                "pgBStage": 3
              }
            }
          ]
        },
        {
          "title": "내각의 합 계산",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "일반적으로 180°×n−360°=180°×(n−2)예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "7각형의 내각의 합은 1260°−360°=900°예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p3-concave": [
    {
      "title": "오목해질 때 내각의 합",
      "label": "내각의 합",
      "tab": "review",
      "answer": "내각의 합은 그대로",
      "answerText": "내각의 합은 그대로",
      "summary": "오목한 꼭짓점의 큰 안쪽 각도 내각에 포함해요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "꼭짓점을 안쪽으로",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "사각형의 꼭짓점 P를 안쪽으로 밀어 볼게요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "sum"
              },
              "to": {
                "pgCf": 0.14
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "P의 안쪽 각이 180°보다 큰 오목사각형이 돼요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.85,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "삼각형으로 나누기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "P에서 마주 보는 꼭짓점으로 대각선을 그어요.",
              "to": {
                "pgBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "오목해져도 삼각형 두 개로 나뉘어요.",
              "set": {
                "pgBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "title": "합의 비교",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "큰 안쪽 각도 두 삼각형의 각을 합친 부분이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "180°×2=360°로 내각의 합은 그대로예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "움푹 들어간 쪽의 각",
      "label": "오목한 각",
      "tab": "review",
      "answer": "x=148°",
      "answerText": "x=148°",
      "summary": "오목한 안쪽 각을 먼저 구하고 점 주위의 360°에서 빼요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "주어진 각과 x",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "오목사각형의 내각 A=29°, B=90°, C=29°예요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "angle"
              },
              "to": {
                "pgBLine": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "x는 P에서 움푹 들어간 바깥쪽의 각이에요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "P의 안쪽 각",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "사각형의 내각의 합에서 나머지 세 내각을 빼요.",
              "set": {
                "pgBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "P의 안쪽 각은 360°−29°−90°−29°=212°예요.",
              "set": {
                "pgBStage": 2
              }
            }
          ]
        },
        {
          "title": "점 주위의 각",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "P의 안쪽 각과 x를 합하면 한 바퀴 360°예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "360°에서 212°를 빼면 x=148°예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p3-ext360": [
    {
      "title": "외각을 한 점에 모으면",
      "label": "외각의 합",
      "tab": "review",
      "answer": "360°",
      "answerText": "360°",
      "summary": "볼록다각형의 같은 방향 외각을 한 점에 모아 확인해요",
      "task": "직접 해 보기에서 꼭짓점 수를 바꾸어 외각이 모이는 모습을 확인해 보세요",
      "chapters": [
        {
          "title": "외각의 뜻",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "볼록육각형의 변을 같은 방향으로 늘여 외각을 정해요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "exterior"
              },
              "to": {
                "pgXt": 0.3
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "꼭짓점마다 외각을 하나씩 골랐어요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "각의 크기를 유지하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "각의 크기는 바꾸지 않고 꼭짓점을 한 점에 모아요.",
              "to": {
                "pgXt": 1
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "모인 외각은 겹치지 않고 빈틈없이 한 바퀴를 채워요.",
              "set": {
                "pgBStage": 2
              },
              "step": 2
            }
          ]
        },
        {
          "title": "한 바퀴의 크기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "한 점 주위의 각을 모두 합한 크기와 같아요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "따라서 이 다각형의 외각의 합은 360°예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p3-given": [
    {
      "title": "외각을 이용한 내각 계산",
      "label": "내각 x",
      "tab": "review",
      "answer": "x=110°",
      "answerText": "x=110°",
      "summary": "주어진 각을 외각으로 통일하고 마지막에 내각으로 되돌려요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "문제와 주어진 각",
          "length": 12,
          "cues": [
            {
              "at": 0,
              "say": "오각형 E의 내각 x를 구할 거예요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "given"
              },
              "to": {
                "pgBLine": 1
              },
              "dur": 4
            },
            {
              "at": 4,
              "say": "A=105°, B=110°, C=100°, D=115°는 내각이에요."
            },
            {
              "at": 8,
              "say": "외각으로 통일한 뒤, 외각의 합으로 계산해요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "내각을 외각으로",
          "length": 12,
          "cues": [
            {
              "at": 0,
              "say": "외각은 180°에서 그 꼭짓점의 내각을 빼요.",
              "step": 1
            },
            {
              "at": 4,
              "say": "A의 외각은 75°, B의 외각은 70°예요.",
              "set": {
                "pgBStage": 1
              }
            },
            {
              "at": 8,
              "say": "C의 외각은 80°, D의 외각은 65°예요.",
              "set": {
                "pgBStage": 2
              }
            }
          ]
        },
        {
          "title": "E의 외각 구하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "앞의 네 외각의 합은 290°예요. E의 외각을 e라 해요.",
              "set": {
                "pgBStage": 3
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "외각의 합은 360°이므로 e=360°−290°=70°예요.",
              "set": {
                "pgBStage": 4
              }
            }
          ]
        },
        {
          "title": "내각으로 되돌리기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "구하는 x는 내각이므로 180°에서 외각 e를 빼요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "180°에서 70°를 빼면 x=110°예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p3-mixed": [
    {
      "title": "섞인 각에서 내각 구하기",
      "label": "내각 x",
      "tab": "review",
      "answer": "x=110°",
      "answerText": "x=110°",
      "summary": "주어진 각을 외각으로 통일하고 마지막에 내각으로 되돌려요",
      "task": "직접 해 보기에서 조건을 바꾸어 같은 방법으로 풀어 보세요",
      "chapters": [
        {
          "title": "문제와 주어진 각",
          "length": 12,
          "cues": [
            {
              "at": 0,
              "say": "오각형 E의 내각 x를 구할 거예요.",
              "set": {
                "pgShowAnswer": false,
                "pgBStage": 0,
                "pgBAsk": "mixed"
              },
              "to": {
                "pgBLine": 1
              },
              "dur": 4
            },
            {
              "at": 4,
              "say": "A·B의 내각은 110°,105°, C·D의 외각은 70°,75°예요."
            },
            {
              "at": 8,
              "say": "외각으로 통일한 뒤, 외각의 합으로 계산해요.",
              "step": 1
            }
          ],
          "start": {
            "pgOn": 7,
            "pgOx": 0.2,
            "pgOy": 0.12,
            "pgOt": 0,
            "pgCn": 4,
            "pgCf": 0.14,
            "pgXn": 6,
            "pgXt": 0,
            "pgGa": 105,
            "pgGb": 110,
            "pgGc": 100,
            "pgGd": 115,
            "pgMa": 110,
            "pgMb": 105,
            "pgMc": 70,
            "pgMd": 75,
            "pgBLine": 0
          }
        },
        {
          "title": "내각을 외각으로",
          "length": 12,
          "cues": [
            {
              "at": 0,
              "say": "한 꼭짓점에서 내각과 외각을 합하면 180°예요.",
              "step": 1
            },
            {
              "at": 4,
              "say": "A의 외각은 70°, B의 외각은 75°예요.",
              "set": {
                "pgBStage": 1
              }
            },
            {
              "at": 8,
              "say": "C와 D는 외각이 주어졌으므로 70°, 75° 그대로예요.",
              "set": {
                "pgBStage": 2
              }
            }
          ]
        },
        {
          "title": "E의 외각 구하기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "앞의 네 외각의 합은 290°예요. E의 외각을 e라 해요.",
              "set": {
                "pgBStage": 3
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "외각의 합은 360°이므로 e=360°−290°=70°예요.",
              "set": {
                "pgBStage": 4
              }
            }
          ]
        },
        {
          "title": "내각으로 되돌리기",
          "length": 10,
          "cues": [
            {
              "at": 0,
              "say": "구하는 x는 내각이므로 180°에서 외각 e를 빼요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "180°에서 70°를 빼면 x=110°예요.",
              "set": {
                "pgShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ]
});
