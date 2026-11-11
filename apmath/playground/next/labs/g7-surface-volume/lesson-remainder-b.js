/* 겉넓이·부피 잔여 해설 B — 원본 t3/t5/t6/t7의 상태와 계산을 사용합니다.
 * 신규 8장면 18해설 + 기존 sv5-6의 별도 부피 질문 1해설.
 * 단계 수치는 svBStage(또는 기존 ready flags)와 함께 공개합니다.
 * 전수 시각검수는 운영 반영 후 QA_PENDING으로 별도 진행합니다. */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-surface-volume'] = window.APL_LESSONS['g7-surface-volume'] || {};
Object.assign(window.APL_LESSONS['g7-surface-volume'], {
  "sv3-3": {
    "title": "넘친 물로 부피 비교",
    "tab": "review",
    "answer": "$1:2:3$",
    "answerText": "$1:2:3$",
    "summary": "반지름이 같고 높이가 지름일 때 비교해요",
    "task": "수조 높이를 바꾸고 부피비도 같은지 직접 비교해 보세요",
    "chapters": [
      {
        "length": 12,
        "title": "같은 반지름과 높이",
        "start": {
          "s8R": 3,
          "s8K": 0,
          "s8T": 0,
          "svYaw": 24,
          "svPitch": 18
        },
        "cues": [
          {
            "at": 0,
            "say": "반지름은 모두 3, 원뿔과 원기둥의 높이는 6.",
            "set": {
              "svShowV": false,
              "svBStage": 0,
              "svBody": "cone",
              "svTankMode": "over"
            },
            "to": {
              "s8T": 1
            },
            "dur": 6
          },
          {
            "at": 3,
            "say": "완전히 잠기면 넘친 물은 물체의 부피와 같아요."
          },
          {
            "at": 7,
            "say": "원뿔 부피는 $\\frac13\\pi\\times3^2\\times6=18\\pi$.",
            "set": {
              "svBStage": 1
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "구를 넣으면",
        "start": {
          "s8T": 0
        },
        "cues": [
          {
            "at": 0,
            "say": "구의 반지름은 3, 지름은 6이에요.",
            "set": {
              "svBStage": 0,
              "svBody": "sph"
            },
            "to": {
              "s8T": 1
            },
            "dur": 5
          },
          {
            "at": 5.5,
            "say": "구 부피는 $\\frac43\\pi\\times3^3=36\\pi$예요.",
            "set": {
              "svBStage": 2
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "원기둥을 넣으면",
        "start": {
          "s8T": 0
        },
        "cues": [
          {
            "at": 0,
            "say": "원기둥은 밑넓이에 높이 6을 곱해요.",
            "set": {
              "svBStage": 0,
              "svBody": "cyl"
            },
            "to": {
              "s8T": 1
            },
            "dur": 5
          },
          {
            "at": 5.5,
            "say": "원기둥 부피는 $\\pi\\times3^2\\times6=54\\pi$예요.",
            "set": {
              "svBStage": 3
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "넘친 물의 비",
        "cues": [
          {
            "at": 0,
            "say": "원뿔, 구, 원기둥 순서로 부피를 비교해요.",
            "step": 4
          },
          {
            "at": 5,
            "say": "$18\\pi:36\\pi:54\\pi=1:2:3$이에요.",
            "set": {
              "svBStage": 4,
              "svShowV": true
            }
          }
        ]
      }
    ]
  },
  "sv3-5": [
    {
      "title": "1/4 구의 겉넓이",
      "label": "사분의 일",
      "tab": "review",
      "answer": "$32\\pi$",
      "answerText": "$32\\pi$ cm²",
      "summary": "겉넓이 = 남은 곡면 + 새로 생긴 단면",
      "task": "다른 조각을 골라 곡면의 비율과 단면 수를 비교해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "반지름과 전체 구",
          "start": {
            "s9R": 4,
            "s9T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름 4인 구를 중심을 지나는 평면으로 잘라요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svFrac": "quarter"
              },
              "step": 1
            },
            {
              "at": 0.5,
              "to": {
                "s9T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "구 전체의 겉넓이는 $4\\pi\\times4^2=64\\pi$.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 곡면",
          "cues": [
            {
              "at": 0,
              "say": "곡면은 구 전체의 $\\frac14$이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$64\\pi\\times\\frac14=16\\pi$예요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새 단면도 더해요",
          "cues": [
            {
              "at": 0,
              "say": "자르면서 생긴 평평한 면은 반원 2개예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 단면은 $\\frac12\\pi\\times4^2\\times2=16\\pi$예요.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "남은 곡면에 새 단면의 넓이를 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=16\\pi+16\\pi=32\\pi$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "1/8 구의 겉넓이",
      "label": "팔분의 일",
      "tab": "review",
      "answer": "$20\\pi$",
      "answerText": "$20\\pi$ cm²",
      "summary": "겉넓이 = 남은 곡면 + 새로 생긴 단면",
      "task": "다른 조각을 골라 곡면의 비율과 단면 수를 비교해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "반지름과 전체 구",
          "start": {
            "s9R": 4,
            "s9T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름 4인 구를 중심을 지나는 평면으로 잘라요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svFrac": "eighth"
              },
              "step": 1
            },
            {
              "at": 0.5,
              "to": {
                "s9T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "구 전체의 겉넓이는 $4\\pi\\times4^2=64\\pi$.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 곡면",
          "cues": [
            {
              "at": 0,
              "say": "곡면은 구 전체의 $\\frac18$이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$64\\pi\\times\\frac18=8\\pi$예요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새 단면도 더해요",
          "cues": [
            {
              "at": 0,
              "say": "자르면서 생긴 평평한 면은 사분원 3개예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 단면은 $\\frac14\\pi\\times4^2\\times3=12\\pi$예요.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "남은 곡면에 새 단면의 넓이를 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=8\\pi+12\\pi=20\\pi$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv3-6": [
    {
      "title": "구의 겉넓이 계산",
      "label": "겉넓이",
      "tab": "review",
      "answer": "$16\\pi$",
      "answerText": "$16\\pi$ cm²",
      "summary": "반지름 r를 겉넓이 공식에 대입해요",
      "task": "반지름을 바꿔 겉넓이의 변화를 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "기호와 주어진 길이",
          "start": {
            "sAR": 2,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름을 r라고 써요. 여기서는 r=2예요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svShape6": "full",
                "svAsk": "S"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "구의 겉넓이는 $4\\pi r^2$로 구해요.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "제곱부터 계산",
          "cues": [
            {
              "at": 0,
              "say": "제곱은 같은 수를 두 번 곱한다는 뜻이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$r^2=2\\times2=4$예요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "$4\\pi r^2$에 $r^2=4$를 넣어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "겉넓이 $=4\\pi\\times4=16\\pi$ cm²",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "구의 부피 계산",
      "label": "부피",
      "tab": "review",
      "answer": "$\\frac{32}{3}\\pi$",
      "answerText": "$\\frac{32}{3}\\pi$ cm³",
      "summary": "구의 부피는 반지름의 세제곱을 사용해요",
      "task": "겉넓이와 부피에서 반지름의 지수가 어떻게 다른지 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "반지름과 부피 공식",
          "start": {
            "sAR": 2,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름 r=2인 구의 부피를 구해요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svShape6": "full",
                "svAsk": "V"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "구의 부피 공식은 $\\frac43\\pi r^3$예요.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "세제곱 계산",
          "cues": [
            {
              "at": 0,
              "say": "세제곱은 같은 수를 세 번 곱해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$r^3=2\\times2\\times2=8$예요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "부피는?",
          "cues": [
            {
              "at": 0,
              "say": "공식 $\\frac43\\pi r^3$에 8을 대입해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "부피 $=\\frac43\\pi\\times8=\\frac{32}{3}\\pi$ cm³",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "부피에서 겉넓이로",
      "label": "역으로",
      "tab": "review",
      "answer": "$16\\pi$",
      "answerText": "$16\\pi$ cm²",
      "summary": "부피에서 반지름을 찾고 겉넓이를 구해요",
      "task": "부피가 주어진 반구도 같은 순서로 풀어 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "먼저 찾아야 할 길이",
          "start": {
            "sAR": 2,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "구의 부피가 $\\frac{32}{3}\\pi$ cm³로 주어졌어요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svShape6": "full",
                "svAsk": "rev"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "반지름 r를 먼저 찾아 겉넓이에 사용할 거예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "부피에서 반지름 찾기",
          "cues": [
            {
              "at": 0,
              "say": "$\\frac43\\pi r^3=\\frac{32}{3}\\pi$를 정리해요."
            },
            {
              "at": 5,
              "say": "$r^3=8$이므로 양수인 반지름은 $r=2$.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이 공식으로",
          "cues": [
            {
              "at": 0,
              "say": "구의 겉넓이는 $4\\pi r^2$예요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "찾은 반지름 2를 넣어 $4\\pi\\times2^2$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "제곱을 먼저 계산한 뒤 4π를 곱해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "겉넓이 $=4\\pi\\times4=16\\pi$ cm²",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv3-7": [
    {
      "title": "남은 구의 겉넓이",
      "label": "겉넓이",
      "tab": "review",
      "answer": "$36\\pi$",
      "answerText": "$36\\pi$ cm²",
      "summary": "남은 곡면과 새 단면을 모두 더해요",
      "task": "7/8이 남았을 때 새 단면의 모양도 비교해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "남은 부분 확인",
          "start": {
            "remR": 3,
            "remT": 1,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름 3인 구에서 1/4을 잘라 냈어요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "remKind": "three",
                "remMode": "surf",
                "remStarted": true
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "남은 곡면은 전체의 3/4, 새 단면도 생겨요."
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 곡면",
          "cues": [
            {
              "at": 0,
              "say": "구의 겉넓이 $4\\pi r^2$에 3/4을 곱해요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "$4\\pi\\times3^2\\times\\frac34=27\\pi$예요.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새 단면",
          "cues": [
            {
              "at": 0,
              "say": "새로 생긴 단면은 반지름 3인 반원 2개예요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "단면의 합은 $\\frac12\\pi\\times3^2\\times2=9\\pi$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "남은 곡면과 두 단면을 더해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "겉넓이 $=27\\pi+9\\pi=36\\pi$ cm²",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "남은 구의 부피",
      "label": "부피",
      "tab": "review",
      "answer": "$27\\pi$",
      "answerText": "$27\\pi$ cm³",
      "summary": "부피는 남은 비율만 곱해요",
      "task": "7/8이 남았을 때 부피도 직접 계산해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "전체 구의 부피",
          "start": {
            "remR": 3,
            "remT": 1,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "반지름 3인 구에서 1/4을 잘라 냈어요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "remKind": "three",
                "remMode": "vol",
                "remStarted": true
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "전체 부피는 $\\frac43\\pi\\times3^3=36\\pi$예요.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 비율",
          "cues": [
            {
              "at": 0,
              "say": "잘라 낸 1/4을 빼면 3/4이 남아요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "새 단면의 넓이는 부피에 더하지 않아요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 부피는?",
          "cues": [
            {
              "at": 0,
              "say": "전체 부피에 남은 비율 3/4을 곱해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "남은 부피 $=36\\pi\\times\\frac34=27\\pi$ cm³",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv5-2": [
    {
      "title": "막힌 원기둥 구멍",
      "label": "막힌 원",
      "tab": "review",
      "answer": "$192+12\\pi$",
      "answerText": "$192+12\\pi$ cm²",
      "summary": "원래 겉넓이 − 없어진 면 + 새 안쪽 면",
      "task": "구멍의 모양과 깊이를 바꿔 없어지는 면을 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "상자와 구멍의 크기",
          "start": {
            "s51A": 6,
            "s51H": 5,
            "s52U": 2,
            "s52D": 3,
            "s52T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "상자 밑면은 한 변 6인 정사각형, 높이는 5.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK52": "cb"
              },
              "to": {
                "s52T": 0.5
              },
              "dur": 4
            },
            {
              "at": 4,
              "say": "구멍의 반지름은 2, 깊이는 3이에요."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $2\\times6^2+4\\times6\\times5=192$.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 입구",
          "cues": [
            {
              "at": 0,
              "say": "구멍 때문에 없어진 바깥 면을 먼저 빼요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "입구 한 원을 빼요: $-\\pi\\times2^2=-4\\pi$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 안쪽 면",
          "cues": [
            {
              "at": 0,
              "say": "막힌 구멍은 안쪽 벽과 바닥을 더해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "안쪽 벽과 바닥은 $12\\pi+4\\pi=16\\pi$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 넓이에서 입구를 빼고 안쪽 면을 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=192-4\\pi+16\\pi=192+12\\pi$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "관통한 사각 구멍",
      "label": "관통 사각",
      "tab": "review",
      "answer": "$224$",
      "answerText": "$224$ cm²",
      "summary": "원래 겉넓이 − 없어진 면 + 새 안쪽 면",
      "task": "구멍의 모양과 깊이를 바꿔 없어지는 면을 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "상자와 구멍의 크기",
          "start": {
            "s51A": 6,
            "s51H": 5,
            "s52U": 2,
            "s52D": 3,
            "s52T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "상자 밑면은 한 변 6인 정사각형, 높이는 5.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK52": "st"
              },
              "to": {
                "s52T": 0.5
              },
              "dur": 4
            },
            {
              "at": 4,
              "say": "구멍 한 변은 2, 상자를 끝까지 관통해요."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $2\\times6^2+4\\times6\\times5=192$.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 입구",
          "cues": [
            {
              "at": 0,
              "say": "구멍 때문에 없어진 바깥 면을 먼저 빼요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "입구가 두 개라 $2\\times2^2=8$을 빼요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 안쪽 면",
          "cues": [
            {
              "at": 0,
              "say": "관통했으므로 구멍의 바닥은 없어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "안쪽 벽 4개는 $4\\times2\\times5=40$이에요.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 넓이에서 입구를 빼고 안쪽 면을 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=192-8+40=224$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "막힌 사각 구멍",
      "label": "막힌 사각",
      "tab": "review",
      "answer": "$216$",
      "answerText": "$216$ cm²",
      "summary": "원래 겉넓이 − 없어진 면 + 새 안쪽 면",
      "task": "구멍의 모양과 깊이를 바꿔 없어지는 면을 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "상자와 구멍의 크기",
          "start": {
            "s51A": 6,
            "s51H": 5,
            "s52U": 2,
            "s52D": 3,
            "s52T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "상자 밑면은 한 변 6인 정사각형, 높이는 5.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK52": "sb"
              },
              "to": {
                "s52T": 0.5
              },
              "dur": 4
            },
            {
              "at": 4,
              "say": "구멍 한 변은 2, 깊이는 3이에요."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $2\\times6^2+4\\times6\\times5=192$.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 입구",
          "cues": [
            {
              "at": 0,
              "say": "구멍 때문에 없어진 바깥 면을 먼저 빼요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "입구 정사각형 $2^2=4$를 빼요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 안쪽 면",
          "cues": [
            {
              "at": 0,
              "say": "막혔으므로 안쪽 벽과 바닥을 더해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "안쪽 벽과 바닥은 $4\\times2\\times3+2^2=28$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 넓이에서 입구를 빼고 안쪽 면을 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=192-4+28=216$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv5-4": [
    {
      "title": "모서리 중간 파내기",
      "label": "모서리중간",
      "tab": "review",
      "answer": "$224$",
      "answerText": "$224$ cm²",
      "summary": "없어진 면과 새로 생긴 면을 따로 세어요",
      "task": "파낸 위치를 바꿔 겉넓이가 늘거나 줄어드는 이유를 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "원래 입체와 조각",
          "start": {
            "s54A": 6,
            "s54P": 2,
            "s54Q": 2,
            "s54C": 3,
            "s54W": 2,
            "s54Z": 2,
            "s54T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "원래 정육면체의 한 모서리는 6이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK54": "mid"
              },
              "to": {
                "s54T": 1
              },
              "dur": 5
            },
            {
              "at": 4,
              "say": "조각의 길이는 3, 높이와 폭은 각각 2예요."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $6\\times6^2=216$이에요.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 바깥 면",
          "cues": [
            {
              "at": 0,
              "say": "빨간 면은 파내기 전 바깥으로 드러난 면이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "없어진 면의 넓이: $3\\times2+3\\times2=12$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 면",
          "cues": [
            {
              "at": 0,
              "say": "끝까지 파내지 않아 양 끝에 새 벽도 생겨요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 면의 넓이: $3\\times2+3\\times2+2\\times2^2=20$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 겉넓이에서 빼고 더할 면을 구분해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=216-12+20=224$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "모서리 끝까지 파내기",
      "label": "끝까지",
      "tab": "review",
      "answer": "$208$",
      "answerText": "$208$ cm²",
      "summary": "없어진 면과 새로 생긴 면을 따로 세어요",
      "task": "파낸 위치를 바꿔 겉넓이가 늘거나 줄어드는 이유를 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "원래 입체와 조각",
          "start": {
            "s54A": 6,
            "s54P": 2,
            "s54Q": 2,
            "s54C": 3,
            "s54W": 2,
            "s54Z": 2,
            "s54T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "원래 정육면체의 한 모서리는 6이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK54": "thru"
              },
              "to": {
                "s54T": 1
              },
              "dur": 5
            },
            {
              "at": 4,
              "say": "높이와 폭이 2인 조각이 길이 6을 관통해요."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $6\\times6^2=216$이에요.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 바깥 면",
          "cues": [
            {
              "at": 0,
              "say": "빨간 면은 파내기 전 바깥으로 드러난 면이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "없어진 면의 넓이: $6\\times2+6\\times2+2\\times2^2=32$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 면",
          "cues": [
            {
              "at": 0,
              "say": "끝까지 통하므로 안쪽 양 끝벽은 없어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 면의 넓이: $6\\times2+6\\times2=24$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 겉넓이에서 빼고 더할 면을 구분해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=216-32+24=208$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "가운데 홈 파내기",
      "label": "가운데홈",
      "tab": "review",
      "answer": "$232$",
      "answerText": "$232$ cm²",
      "summary": "없어진 면과 새로 생긴 면을 따로 세어요",
      "task": "파낸 위치를 바꿔 겉넓이가 늘거나 줄어드는 이유를 찾아보세요",
      "chapters": [
        {
          "length": 13,
          "title": "원래 입체와 조각",
          "start": {
            "s54A": 6,
            "s54P": 2,
            "s54Q": 2,
            "s54C": 3,
            "s54W": 2,
            "s54Z": 2,
            "s54T": 0,
            "svYaw": 28,
            "svPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "원래 정육면체의 한 모서리는 6이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svK54": "groove"
              },
              "to": {
                "s54T": 1
              },
              "dur": 5
            },
            {
              "at": 4,
              "say": "가운데 홈의 폭과 깊이는 각각 2, 길이는 6."
            },
            {
              "at": 8,
              "say": "원래 겉넓이는 $6\\times6^2=216$이에요.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "없어진 바깥 면",
          "cues": [
            {
              "at": 0,
              "say": "빨간 면은 파내기 전 바깥으로 드러난 면이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "없어진 면의 넓이: $6\\times2+2\\times2^2=20$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "새로 생긴 면",
          "cues": [
            {
              "at": 0,
              "say": "홈 바닥 한 면과 양옆의 벽 두 면을 더해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 면의 넓이: $6\\times2+2\\times6\\times2=36$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "원래 겉넓이에서 빼고 더할 면을 구분해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=216-20+36=232$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv5-5": [
    {
      "title": "속을 판 원뿔의 겉넓이",
      "label": "겉넓이",
      "tab": "review",
      "answer": "$102\\pi$",
      "answerText": "$102\\pi$ cm²",
      "summary": "바깥 옆면 + 바닥의 고리 + 안쪽 옆면",
      "task": "작은 원뿔의 크기를 바꿔 새로 생긴 안쪽 면을 비교해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "두 원뿔의 길이",
          "start": {
            "s55K": 2,
            "s55J": 1,
            "s55T": 0,
            "svYaw": 28,
            "svPitch": -22
          },
          "cues": [
            {
              "at": 0,
              "say": "큰 원뿔은 반지름 6, 모선 10이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svMode": "surf"
              },
              "to": {
                "s55T": 0.5
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "파낸 작은 원뿔은 반지름 3, 모선 5예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "바깥 옆면",
          "cues": [
            {
              "at": 0,
              "say": "옆넓이는 π × 반지름 × 모선으로 구해요.",
              "to": {
                "s55T": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "바깥 옆면 $=\\pi\\times6\\times10=60\\pi$.",
              "set": {
                "svBStage": 1
              },
              "step": 1
            }
          ]
        },
        {
          "length": 10,
          "title": "고리와 안쪽 면",
          "cues": [
            {
              "at": 0,
              "say": "바닥 고리 $=\\pi\\times6^2-\\pi\\times3^2=27\\pi$.",
              "set": {
                "svBStage": 2
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "안쪽 옆면 $=\\pi\\times3\\times5=15\\pi$.",
              "set": {
                "svBStage": 3
              },
              "step": 3
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "바깥, 고리, 안쪽 면의 넓이를 모두 더해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=60\\pi+27\\pi+15\\pi=102\\pi$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "속을 판 원뿔의 부피",
      "label": "부피",
      "tab": "review",
      "answer": "$84\\pi$",
      "answerText": "$84\\pi$ cm³",
      "summary": "큰 원뿔의 부피 − 파낸 원뿔의 부피",
      "task": "파낸 원뿔의 크기를 바꿔 남은 부피를 구해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "두 원뿔의 길이",
          "start": {
            "s55K": 2,
            "s55J": 1,
            "s55T": 0,
            "svYaw": 28,
            "svPitch": -22
          },
          "cues": [
            {
              "at": 0,
              "say": "큰 원뿔은 반지름 6, 높이 8이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "svMode": "vol"
              },
              "to": {
                "s55T": 0.5
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "파낸 작은 원뿔은 반지름 3, 높이 4예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "큰 원뿔의 부피",
          "cues": [
            {
              "at": 0,
              "say": "원뿔은 밑넓이 × 높이의 1/3이에요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "큰 부피 $=\\frac13\\pi\\times6^2\\times8=96\\pi$.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "파낸 원뿔의 부피",
          "cues": [
            {
              "at": 0,
              "say": "작은 원뿔도 같은 부피 공식을 써요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "파낸 부피 $=\\frac13\\pi\\times3^2\\times4=12\\pi$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 부피는?",
          "cues": [
            {
              "at": 0,
              "say": "파낸 부분은 전체에서 빼야 해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "남은 부피 $=96\\pi-12\\pi=84\\pi$ cm³",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ],
  "sv6-1": [
    {
      "title": "원기둥과 반구의 겉넓이",
      "label": "겉넓이",
      "tab": "review",
      "answer": "$57\\pi$",
      "answerText": "$57\\pi$ cm²",
      "summary": "각 겉넓이의 합에서 붙은 두 면을 빼요",
      "task": "다른 결합 입체에서도 붙어서 숨은 두 면을 찾아보세요",
      "chapters": [
        {
          "length": 11,
          "title": "붙어 있는 두 입체",
          "start": {
            "jcK": 1,
            "jcH": 5,
            "jcT": 0,
            "svYaw": 28,
            "svPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "원기둥과 반구의 반지름은 모두 3이에요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "jcKind": "hemi",
                "jcMode": "surf",
                "jcStarted": true
              },
              "to": {
                "jcT": 1
              },
              "dur": 6
            },
            {
              "at": 6,
              "say": "원기둥 높이는 5, 맞붙은 두 원은 안 보여요."
            }
          ]
        },
        {
          "length": 10,
          "title": "원기둥을 따로 계산",
          "cues": [
            {
              "at": 0,
              "say": "두 밑면과 옆면을 더한 겉넓이를 구해요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "$2\\pi\\times3^2+2\\pi\\times3\\times5=48\\pi$.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "반구를 따로 계산",
          "cues": [
            {
              "at": 0,
              "say": "반구는 곡면에 밑면인 원도 더해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "반구 겉넓이 $=3\\pi\\times3^2=27\\pi$.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "붙어서 숨은 면",
          "cues": [
            {
              "at": 0,
              "say": "맞붙은 원은 각 입체에서 한 장씩 숨었어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "빼야 할 두 원은 $2\\pi\\times3^2=18\\pi$.",
              "set": {
                "svBStage": 3
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "겉넓이는?",
          "cues": [
            {
              "at": 0,
              "say": "각 겉넓이를 더하고 숨은 두 원을 빼요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "겉넓이 $=48\\pi+27\\pi-18\\pi=57\\pi$ cm²",
              "set": {
                "svBStage": 4,
                "svShowV": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "원기둥과 반구의 부피",
      "label": "부피",
      "tab": "review",
      "answer": "$63\\pi$",
      "answerText": "$63\\pi$ cm³",
      "summary": "겹치는 부피가 없으므로 각 부피를 더해요",
      "task": "위에 붙이는 입체를 바꾸어 부피를 직접 더해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "두 입체의 길이",
          "start": {
            "jcK": 1,
            "jcH": 5,
            "jcT": 0,
            "svYaw": 28,
            "svPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "두 입체의 반지름은 3, 원기둥 높이는 5예요.",
              "set": {
                "svShowV": false,
                "svBStage": 0,
                "jcKind": "hemi",
                "jcMode": "vol",
                "jcStarted": true
              },
              "to": {
                "jcT": 0.55
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "겹치는 부피가 없으므로 각각 구해 더해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "원기둥의 부피",
          "cues": [
            {
              "at": 0,
              "say": "원기둥 부피는 밑넓이 × 높이예요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "$\\pi\\times3^2\\times5=45\\pi$예요.",
              "set": {
                "svBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "반구의 부피",
          "cues": [
            {
              "at": 0,
              "say": "반구의 부피는 구 전체 부피의 절반이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$\\frac12\\times\\frac43\\pi\\times3^3=18\\pi$예요.",
              "set": {
                "svBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "전체 부피는?",
          "cues": [
            {
              "at": 0,
              "say": "붙은 면은 넓이일 뿐, 뺄 부피는 없어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "전체 부피 $=45\\pi+18\\pi=63\\pi$ cm³",
              "set": {
                "svBStage": 3,
                "svShowV": true
              }
            }
          ]
        }
      ]
    }
  ]
});
// 기존 겉넓이 해설은 보존하고 질문이 다른 부피 버튼을 더합니다.
window.APL_LESSONS['g7-surface-volume']['sv5-6'] = [
  ...[].concat(window.APL_LESSONS['g7-surface-volume']['sv5-6'] || []),
  {
    "title": "상자와 원기둥의 부피",
    "label": "부피",
    "tab": "review",
    "answer": "$256+27\\pi$",
    "answerText": "$256+27\\pi$ cm³",
    "summary": "상자와 원기둥의 부피를 따로 구해 더해요",
    "task": "위 입체의 모양과 크기를 바꾸어 부피를 더해 보세요",
    "chapters": [
      {
        "length": 10,
        "title": "각 입체의 길이",
        "start": {
          "s56A": 8,
          "s56H": 4,
          "s56R": 3,
          "s56Z": 3,
          "s56T": 0,
          "svYaw": 28,
          "svPitch": 22
        },
        "cues": [
          {
            "at": 0,
            "say": "상자는 가로 8, 세로 8, 높이 4예요.",
            "set": {
              "svTop": "cyl",
              "svMode": "vol",
              "svShowV": false,
              "svBaseReady": false,
              "svSideReady": false,
              "svOtherReady": false,
              "svBigReady": false,
              "svSmallReady": false
            },
            "to": {
              "s56T": 0.5
            },
            "dur": 5
          },
          {
            "at": 5,
            "say": "위 원기둥은 반지름 3, 높이 3이에요."
          }
        ]
      },
      {
        "length": 10,
        "title": "상자 부피",
        "cues": [
          {
            "at": 0,
            "say": "상자는 밑넓이 8×8에 높이 4를 곱해요.",
            "step": 1
          },
          {
            "at": 5,
            "say": "상자 부피 $=8\\times8\\times4=256$.",
            "set": {
              "svBigReady": true
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "위 원기둥 부피",
        "cues": [
          {
            "at": 0,
            "say": "원기둥은 원의 넓이에 높이를 곱해요.",
            "step": 2
          },
          {
            "at": 5,
            "say": "원기둥 부피 $=\\pi\\times3^2\\times3=27\\pi$.",
            "set": {
              "svSmallReady": true
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "전체 부피는?",
        "cues": [
          {
            "at": 0,
            "say": "두 입체는 겹치지 않으므로 부피를 더해요.",
            "step": 3
          },
          {
            "at": 5,
            "say": "전체 부피 $=256+27\\pi$ cm³",
            "set": {
              "svShowV": true
            }
          }
        ]
      }
    ]
  }
];
