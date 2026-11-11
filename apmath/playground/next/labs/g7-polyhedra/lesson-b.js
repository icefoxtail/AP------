/* 다면체·정다면체 해설 B: t2/t4 원본 질문·모델·정리 단계를 사용합니다.
 * 공통 키트 재사용, 최종 답은 마지막 장에서만 phShowAnswer로 공개합니다.
 * 운영 반영 후 전수 모바일 품질검수는 별도로 진행합니다. */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-polyhedra'] = window.APL_LESSONS['g7-polyhedra'] || {};
Object.assign(window.APL_LESSONS['g7-polyhedra'], {
  "p2-1": [
    {
      "title": "정삼각형을 모으면",
      "label": "가능한 경우",
      "tab": "review",
      "answer": "정팔면체",
      "answerText": "정팔면체",
      "summary": "한 꼭짓점의 각의 합을 360°와 비교해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "면을 한 점에 모으기",
          "start": {
            "phPp": 3,
            "phQq": 3
          },
          "cues": [
            {
              "at": 0,
              "say": "정삼각형을 한 꼭짓점에 4개 모아 볼게요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0
              },
              "to": {
                "phQq": 4
              },
              "dur": 2
            },
            {
              "at": 5,
              "say": "정삼각형의 한 내각은 60°예요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "각의 합 비교",
          "cues": [
            {
              "at": 0,
              "say": "같은 꼭짓점에 모인 내각을 모두 더해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$60^\\circ\\times4=240^\\circ$, 360°보다 작아요.",
              "set": {
                "phBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "어떤 입체일까요",
          "cues": [
            {
              "at": 0,
              "say": "틈이 남아서 면들을 접어 입체로 만들 수 있어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "정삼각형이 4개씩 모이는 정팔면체예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "정육각형을 모으면",
      "label": "불가한 경우",
      "tab": "review",
      "answer": "만들 수 없다",
      "answerText": "만들 수 없다",
      "summary": "각의 합이 360°이면 평평해져요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "정육각형 모으기",
          "start": {
            "phPp": 6,
            "phQq": 4
          },
          "cues": [
            {
              "at": 0,
              "say": "정육각형 3개를 한 꼭짓점에 모아 볼게요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0
              },
              "to": {
                "phQq": 3
              },
              "dur": 2
            },
            {
              "at": 5,
              "say": "정육각형의 한 내각은 120°예요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "평평해지는 이유",
          "cues": [
            {
              "at": 0,
              "say": "한 꼭짓점에 모인 내각을 더해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "$120^\\circ\\times3=360^\\circ$로 틈이 없어요.",
              "set": {
                "phBStage": 2
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "판정",
          "cues": [
            {
              "at": 0,
              "say": "꼭짓점을 만들려면 각의 합이 360° 미만이어야 해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "정육각형으로 정다면체를 만들 수 없다.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p2-2": [
    {
      "title": "정팔면체의 면 살피기",
      "label": "면의 모양",
      "tab": "review",
      "answer": "정삼각형",
      "answerText": "정삼각형",
      "summary": "입체 이름은 면의 개수, 면의 모양은 따로 살펴요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "강조한 면",
          "start": {
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정팔면체에서 파란색으로 강조한 한 면을 봐요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel": "octa",
                "phBAsk": "face"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "이름의 팔은 면이 여덟 개라는 뜻이에요."
            }
          ]
        },
        {
          "length": 10,
          "title": "변과 각 확인",
          "cues": [
            {
              "at": 0,
              "say": "강조한 한 면에는 변이 세 개 있어요."
            },
            {
              "at": 5,
              "say": "정다면체의 면은 변과 각이 같은 정다각형이에요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "면의 모양은",
          "cues": [
            {
              "at": 0,
              "say": "세 변과 세 각이 같은 삼각형의 이름을 떠올려요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "정팔면체의 한 면은 정삼각형이에요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "한 꼭짓점의 면 세기",
      "label": "모인 면 수",
      "tab": "review",
      "answer": "4개",
      "answerText": "4개",
      "summary": "꼭짓점 하나를 고르고 그 점을 가진 면을 세어요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "꼭짓점 하나 고르기",
          "start": {
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정팔면체의 노란 꼭짓점을 살펴봐요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel": "octa",
                "phBAsk": "q"
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "그 점을 함께 가진 면만 세어야 해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "뒤쪽 면도 확인",
          "cues": [
            {
              "at": 0,
              "say": "앞에서 보이는 면만 세면 뒤쪽 면을 놓쳐요.",
              "to": {
                "phYaw": -65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "입체를 돌려 같은 꼭짓점에 닿는 면을 확인해요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "모인 면의 수",
          "cues": [
            {
              "at": 0,
              "say": "한 면을 중복해서 세지 않도록 한 바퀴 살펴봐요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "한 꼭짓점에 모인 면은 4개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p2-3": [
    {
      "title": "붙인 입체의 조건",
      "label": "이유",
      "tab": "review",
      "answer": "정다면체가 아니에요",
      "answerText": "정다면체가 아니에요",
      "summary": "겉에 남은 면과 꼭짓점에 모인 면을 구분해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "한 면씩 맞붙이기",
          "start": {
            "phJoin": 0,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정사면체 두 개의 한 면을 완전히 맞붙여요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phEx": "bi",
                "phBAsk": "why"
              },
              "to": {
                "phJoin": 1
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "맞붙은 두 면은 입체 안쪽에 들어가요."
            }
          ]
        },
        {
          "length": 10,
          "title": "두 조건 확인",
          "cues": [
            {
              "at": 0,
              "say": "모든 겉면은 서로 합동인 정삼각형이에요.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "양 끝에는 면 3개, 가운데에는 면 4개씩 모여요."
            }
          ]
        },
        {
          "length": 10,
          "title": "같은 수가 모일까요",
          "cues": [
            {
              "at": 0,
              "say": "정다면체는 꼭짓점마다 모이는 면의 수도 같아야 해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "모인 면의 수가 달라서 정다면체가 아니에요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "붙인 입체의 면 세기",
      "label": "면의 수",
      "tab": "review",
      "answer": "6개",
      "answerText": "6개",
      "summary": "겉에 남은 면과 꼭짓점에 모인 면을 구분해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "한 면씩 맞붙이기",
          "start": {
            "phJoin": 0,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정사면체 두 개의 한 면을 완전히 맞붙여요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phEx": "bi",
                "phBAsk": "count"
              },
              "to": {
                "phJoin": 1
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "맞붙은 두 면은 입체 안쪽에 들어가요."
            }
          ]
        },
        {
          "length": 10,
          "title": "원래 면과 숨은 면",
          "cues": [
            {
              "at": 0,
              "say": "정사면체 하나의 면은 4개, 둘은 $4+4=8$개.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "서로 붙인 면을 하나씩, 모두 2개 빼야 해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "겉에 남은 면",
          "cues": [
            {
              "at": 0,
              "say": "안쪽의 두 면을 겉면으로 세지 않아요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "겉에 남은 면은 $8-2=6$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "면이 네 개 모이는 점",
      "label": "꼭짓점 수",
      "tab": "review",
      "answer": "면 4개가 모이는 꼭짓점 3개",
      "answerText": "면 4개가 모이는 꼭짓점 3개",
      "summary": "겉에 남은 면과 꼭짓점에 모인 면을 구분해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "한 면씩 맞붙이기",
          "start": {
            "phJoin": 0,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정사면체 두 개의 한 면을 완전히 맞붙여요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phEx": "bi",
                "phBAsk": "four"
              },
              "to": {
                "phJoin": 1
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "맞붙은 두 면은 입체 안쪽에 들어가요."
            }
          ]
        },
        {
          "length": 10,
          "title": "붙인 자리의 점",
          "cues": [
            {
              "at": 0,
              "say": "붙인 삼각형의 꼭짓점에는 면이 4개씩 모여요.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "양 끝의 두 꼭짓점은 이 조건에 해당하지 않아요."
            }
          ]
        },
        {
          "length": 10,
          "title": "조건에 맞는 점",
          "cues": [
            {
              "at": 0,
              "say": "붙인 삼각형의 꼭짓점을 한 번씩 세어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "면 4개가 모이는 꼭짓점 3개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p2-4": [
    {
      "title": "정십이면체의 모서리",
      "label": "모서리",
      "tab": "review",
      "answer": "30개",
      "answerText": "30개",
      "summary": "면마다 센 수에서 중복된 횟수만큼 나눠요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "면의 모양과 개수",
          "start": {
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정십이면체는 정오각형 면 12개로 이루어져요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel4": "dodeca",
                "phHv": 0,
                "phHf": 0,
                "phBAsk": "E"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "면의 수를 F, 한 면의 변의 수를 p라고 해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "중복하여 센 수",
          "cues": [
            {
              "at": 0,
              "say": "면마다 모서리를 세면 $pF=5\\times12=60$.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "모서리 하나를 이웃한 두 면이 함께 가져요."
            }
          ]
        },
        {
          "length": 10,
          "title": "구하는 개수",
          "cues": [
            {
              "at": 0,
              "say": "같은 모서리를 2번씩 세었으므로 2로 나눠요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "모서리는 $60\\div2=30$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "정십이면체의 꼭짓점",
      "label": "꼭짓점",
      "tab": "review",
      "answer": "20개",
      "answerText": "20개",
      "summary": "면마다 센 수에서 중복된 횟수만큼 나눠요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "면의 모양과 개수",
          "start": {
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정십이면체는 정오각형 면 12개로 이루어져요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel4": "dodeca",
                "phHv": 0,
                "phHf": 0,
                "phBAsk": "V"
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "면의 수를 F, 한 면의 변의 수를 p라고 해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "중복하여 센 수",
          "cues": [
            {
              "at": 0,
              "say": "면마다 꼭짓점를 세면 $pF=5\\times12=60$.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            },
            {
              "at": 5,
              "say": "꼭짓점 하나를 모인 세 면이 함께 가져요."
            }
          ]
        },
        {
          "length": 10,
          "title": "구하는 개수",
          "cues": [
            {
              "at": 0,
              "say": "같은 꼭짓점를 3번씩 세었으므로 3로 나눠요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "꼭짓점는 $60\\div3=20$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p2-5": {
    "title": "면의 중심으로 새 입체",
    "tab": "review",
    "answer": "정팔면체",
    "answerText": "정팔면체",
    "summary": "원래 면의 중심은 새 입체의 꼭짓점이 돼요",
    "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
    "chapters": [
      {
        "length": 10,
        "title": "면마다 중심 표시",
        "start": {
          "phDual": 0.02,
          "phYaw": -30,
          "phPitch": 24
        },
        "cues": [
          {
            "at": 0,
            "say": "정육면체의 여섯 면 한가운데에 점을 찍어요.",
            "set": {
              "phShowAnswer": false,
              "phBStage": 0,
              "phSel5": "cube"
            },
            "to": {
              "phDual": 0.3
            },
            "dur": 4
          },
          {
            "at": 5,
            "say": "점 하나가 새 입체의 꼭짓점 하나가 돼요.",
            "step": 1
          }
        ]
      },
      {
        "length": 10,
        "title": "이웃한 중심 연결",
        "cues": [
          {
            "at": 0,
            "say": "이웃한 면의 중심끼리 선분으로 연결해요.",
            "to": {
              "phDual": 1
            },
            "dur": 5
          },
          {
            "at": 5,
            "say": "원래 꼭짓점 둘레의 세 점은 새 삼각형 면이 돼요.",
            "set": {
              "phBStage": 1
            },
            "step": 2
          }
        ]
      },
      {
        "length": 10,
        "title": "새 입체 확인",
        "cues": [
          {
            "at": 0,
            "say": "새 입체는 삼각형 면 여덟 개로 둘러싸여 있어요.",
            "step": 3
          },
          {
            "at": 5,
            "say": "면의 중심을 이어 만든 입체는 정팔면체예요.",
            "set": {
              "phShowAnswer": true
            }
          }
        ]
      }
    ]
  },
  "p2-6": {
    "title": "정다면체의 경우 세기",
    "tab": "review",
    "answer": "5가지",
    "answerText": "5가지",
    "summary": "면은 3개 이상, 모인 내각의 합은 360° 미만",
    "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
    "chapters": [
      {
        "length": 13,
        "title": "삼각형으로 모으기",
        "start": {
          "phPp": 3,
          "phQq": 3
        },
        "cues": [
          {
            "at": 0,
            "say": "면은 한 꼭짓점에 3개 이상 모여야 해요.",
            "set": {
              "phShowAnswer": false,
              "phBStage": 0
            },
            "to": {
              "phQq": 5
            },
            "dur": 2
          },
          {
            "at": 4,
            "say": "정삼각형의 한 내각은 60°예요."
          },
          {
            "at": 8,
            "say": "3·4·5개는 가능해요. 6개면 360°예요.",
            "set": {
              "phBStage": 1
            },
            "step": 1
          }
        ]
      },
      {
        "length": 13,
        "title": "정사각형의 경우",
        "start": {
          "phPp": 4,
          "phQq": 3
        },
        "cues": [
          {
            "at": 0,
            "say": "정사각형의 한 내각은 90°예요.",
            "step": 2
          },
          {
            "at": 4,
            "say": "3개는 270°라서 입체가 될 수 있어요."
          },
          {
            "at": 8,
            "say": "4개는 360°이므로 3개만 가능해요.",
            "set": {
              "phBStage": 2
            }
          }
        ]
      },
      {
        "length": 13,
        "title": "정오각형의 경우",
        "start": {
          "phPp": 5,
          "phQq": 3
        },
        "cues": [
          {
            "at": 0,
            "say": "정오각형의 한 내각은 108°예요."
          },
          {
            "at": 4,
            "say": "3개면 324°, 4개면 432°예요."
          },
          {
            "at": 8,
            "say": "360°보다 작은 것은 3개를 모은 경우예요.",
            "set": {
              "phBStage": 3
            }
          }
        ]
      },
      {
        "length": 13,
        "title": "변이 더 많아지면",
        "start": {
          "phPp": 6,
          "phQq": 3
        },
        "cues": [
          {
            "at": 0,
            "say": "정육각형의 한 내각은 120°예요."
          },
          {
            "at": 4,
            "say": "3개만 모아도 360°라서 입체가 안 돼요."
          },
          {
            "at": 8,
            "say": "변이 더 많은 정다각형은 한 내각이 더 커요.",
            "set": {
              "phBStage": 4
            }
          }
        ]
      },
      {
        "length": 10,
        "title": "가능한 조합의 수",
        "cues": [
          {
            "at": 0,
            "say": "삼각형은 세 경우, 사각형과 오각형은 한 경우씩.",
            "step": 3
          },
          {
            "at": 5,
            "say": "조건에 맞는 조합은 $3+1+1=5$가지예요.",
            "set": {
              "phShowAnswer": true
            }
          }
        ]
      }
    ]
  },
  "p4-1": {
    "title": "평면으로 정육면체 자르기",
    "tab": "review",
    "answer": "정육각형",
    "answerText": "정육각형",
    "summary": "단면은 평면이 입체 안에서 만나는 부분 전체예요",
    "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
    "chapters": [
      {
        "length": 10,
        "title": "중심으로 단면판 옮기기",
        "start": {
          "phTa": 45,
          "phTb": 45,
          "phTd": 0.7,
          "phYaw": -70,
          "phPitch": 24
        },
        "cues": [
          {
            "at": 0,
            "say": "세 방향으로 같은 만큼 기울인 평면으로 잘라요.",
            "set": {
              "phShowAnswer": false,
              "phBStage": 0
            },
            "to": {
              "phTd": 0
            },
            "dur": 5
          },
          {
            "at": 5,
            "say": "평면을 정육면체 중심까지 옮긴 모습을 봐요."
          }
        ]
      },
      {
        "length": 10,
        "title": "단면을 둘러싼 선분",
        "cues": [
          {
            "at": 0,
            "say": "평면이 지나는 각 면에 선분이 하나씩 생겨요.",
            "set": {
              "phBStage": 1
            },
            "step": 1
          },
          {
            "at": 5,
            "say": "여섯 면을 지나므로 단면의 변도 여섯 개예요.",
            "step": 2
          }
        ]
      },
      {
        "length": 10,
        "title": "실제 모양 확인",
        "cues": [
          {
            "at": 0,
            "say": "이 경우 여섯 변의 길이와 여섯 각이 모두 같아요.",
            "step": 3
          },
          {
            "at": 5,
            "say": "이 중심 단면의 모양은 정육각형이에요.",
            "set": {
              "phShowAnswer": true
            }
          }
        ]
      }
    ]
  },
  "p4-2": [
    {
      "title": "꼭짓점을 자른 뒤의 면",
      "label": "면",
      "tab": "review",
      "answer": "32개",
      "answerText": "32개",
      "summary": "원래 요소와 새로 생긴 요소를 따로 세어요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "모든 꼭짓점을 자르기",
          "start": {
            "phTr": 0.05,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정이십면체의 꼭짓점을 모서리의 1/3씩 잘라요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel6": "icosa",
                "phBAsk": "F"
              },
              "to": {
                "phTr": 0.3333333333333333
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "원래 면은 20개, 꼭짓점 12개, 모서리 30개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "무엇이 새로 생길까요",
          "cues": [
            {
              "at": 0,
              "say": "원래 20개 면이 남고 꼭짓점마다 새 면이 생겨요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "원래 꼭짓점은 12개이므로 새 면도 그만큼 생겨요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "면의 개수",
          "cues": [
            {
              "at": 0,
              "say": "빠뜨리거나 두 번 센 부분이 없는지 확인해요.",
              "step": 1
            },
            {
              "at": 5,
              "say": "새 입체의 면는 $20+12=32$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "꼭짓점을 자른 뒤의 꼭짓점",
      "label": "꼭짓점",
      "tab": "review",
      "answer": "60개",
      "answerText": "60개",
      "summary": "원래 요소와 새로 생긴 요소를 따로 세어요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "모든 꼭짓점을 자르기",
          "start": {
            "phTr": 0.05,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정이십면체의 꼭짓점을 모서리의 1/3씩 잘라요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel6": "icosa",
                "phBAsk": "V"
              },
              "to": {
                "phTr": 0.3333333333333333
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "원래 면은 20개, 꼭짓점 12개, 모서리 30개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "무엇이 새로 생길까요",
          "cues": [
            {
              "at": 0,
              "say": "원래 모서리마다 양 끝에 새 꼭짓점이 생겨요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "원래 모서리는 30개이고 양 끝을 따로 세어요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "꼭짓점의 개수",
          "cues": [
            {
              "at": 0,
              "say": "빠뜨리거나 두 번 센 부분이 없는지 확인해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "새 입체의 꼭짓점는 $2\\times30=60$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "꼭짓점을 자른 뒤의 모서리",
      "label": "모서리",
      "tab": "review",
      "answer": "90개",
      "answerText": "90개",
      "summary": "원래 요소와 새로 생긴 요소를 따로 세어요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "모든 꼭짓점을 자르기",
          "start": {
            "phTr": 0.05,
            "phYaw": -30,
            "phPitch": 24
          },
          "cues": [
            {
              "at": 0,
              "say": "정이십면체의 꼭짓점을 모서리의 1/3씩 잘라요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel6": "icosa",
                "phBAsk": "E"
              },
              "to": {
                "phTr": 0.3333333333333333
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "원래 면은 20개, 꼭짓점 12개, 모서리 30개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "무엇이 새로 생길까요",
          "cues": [
            {
              "at": 0,
              "say": "기존 모서리 중간과 새 단면의 변을 구분해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 단면의 변은 모서리 양 끝에 하나씩, $2\\times30=60$.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "모서리의 개수",
          "cues": [
            {
              "at": 0,
              "say": "빠뜨리거나 두 번 센 부분이 없는지 확인해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "새 입체의 모서리는 $30+60=90$개예요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p4-3": [
    {
      "title": "세 점을 지나는 평면",
      "label": "A·G·H",
      "tab": "review",
      "answer": "직사각형",
      "answerText": "직사각형",
      "summary": "세 점의 삼각형에서 멈추지 않고 평면을 넓혀요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "세 점을 두 점씩 연결",
          "start": {
            "phTe": 0,
            "phYaw": -30,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 세 꼭짓점 A, G, H를 골랐어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phC3": [
                  "A",
                  "G",
                  "H"
                ],
                "phVman": true
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "선분이 모서리인지 면의 대각선인지 확인해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "평면을 끝까지 넓히기",
          "cues": [
            {
              "at": 0,
              "say": "세 점으로 정해지는 평면은 끝없이 넓어요.",
              "step": 2
            },
            {
              "at": 0.5,
              "to": {
                "phTe": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정육면체 안에서 평면이 지나는 부분을 살펴봐요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 경계 찾기",
          "cues": [
            {
              "at": 0,
              "say": "GH와 평행한 AB를 따라 넷째 점 B까지 닿아요.",
              "set": {
                "phBStage": 2
              },
              "step": 3
            },
            {
              "at": 5,
              "say": "모서리와 면 대각선은 길이가 다르고 네 각은 직각."
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 모양",
          "cues": [
            {
              "at": 0,
              "say": "꼭짓점과 변의 성질을 함께 확인해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "따라서 단면의 모양은 직사각형이에요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "세 점을 지나는 평면",
      "label": "B·D·E",
      "tab": "review",
      "answer": "정삼각형",
      "answerText": "정삼각형",
      "summary": "세 점의 삼각형에서 멈추지 않고 평면을 넓혀요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "세 점을 두 점씩 연결",
          "start": {
            "phTe": 0,
            "phYaw": -30,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 세 꼭짓점 B, D, E를 골랐어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phC3": [
                  "B",
                  "D",
                  "E"
                ],
                "phVman": true
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "선분이 모서리인지 면의 대각선인지 확인해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "평면을 끝까지 넓히기",
          "cues": [
            {
              "at": 0,
              "say": "세 점으로 정해지는 평면은 끝없이 넓어요.",
              "step": 2
            },
            {
              "at": 0.5,
              "to": {
                "phTe": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정육면체 안에서 평면이 지나는 부분을 살펴봐요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 경계 찾기",
          "cues": [
            {
              "at": 0,
              "say": "평면을 넓혀도 다른 꼭짓점에는 닿지 않아요.",
              "set": {
                "phBStage": 2
              },
              "step": 3
            },
            {
              "at": 5,
              "say": "세 변이 모두 같은 정사각형 면의 대각선이에요."
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 모양",
          "cues": [
            {
              "at": 0,
              "say": "꼭짓점과 변의 성질을 함께 확인해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "따라서 단면의 모양은 정삼각형이에요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "세 점을 지나는 평면",
      "label": "A·B·C",
      "tab": "review",
      "answer": "정사각형",
      "answerText": "정사각형",
      "summary": "세 점의 삼각형에서 멈추지 않고 평면을 넓혀요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "세 점을 두 점씩 연결",
          "start": {
            "phTe": 0,
            "phYaw": -30,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 세 꼭짓점 A, B, C를 골랐어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phC3": [
                  "A",
                  "B",
                  "C"
                ],
                "phVman": true
              },
              "step": 1
            },
            {
              "at": 5,
              "say": "선분이 모서리인지 면의 대각선인지 확인해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "평면을 끝까지 넓히기",
          "cues": [
            {
              "at": 0,
              "say": "세 점으로 정해지는 평면은 끝없이 넓어요.",
              "step": 2
            },
            {
              "at": 0.5,
              "to": {
                "phTe": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정육면체 안에서 평면이 지나는 부분을 살펴봐요.",
              "set": {
                "phBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 경계 찾기",
          "cues": [
            {
              "at": 0,
              "say": "세 점이 있는 윗면의 나머지 꼭짓점 D도 지나요.",
              "set": {
                "phBStage": 2
              },
              "step": 3
            },
            {
              "at": 5,
              "say": "이 평면은 정육면체의 한 면과 같아요."
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 모양",
          "cues": [
            {
              "at": 0,
              "say": "꼭짓점과 변의 성질을 함께 확인해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "따라서 단면의 모양은 정사각형이에요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "p4-4": [
    {
      "title": "새 입체와 꼭짓점",
      "label": "입체·꼭짓점",
      "tab": "review",
      "answer": "정팔면체, 꼭짓점 6개",
      "answerText": "정팔면체, 꼭짓점 6개",
      "summary": "원래 면의 중심이 새 꼭짓점이 돼요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "중심에 점 찍기",
          "start": {
            "phDu": 0,
            "phYaw": -36,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 각 면 중심에 점을 하나씩 찍어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel7": "cube",
                "phBAsk": "shape"
              },
              "to": {
                "phDu": 0.31
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "원래 면이 여섯 개이므로 점도 여섯 개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "이웃한 중심 잇기",
          "cues": [
            {
              "at": 0,
              "say": "이웃한 면의 중심끼리 선분으로 연결해요.",
              "to": {
                "phDu": 0.65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "원래 꼭짓점 둘레마다 삼각형 면이 하나 생겨요.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "새 입체 완성",
          "cues": [
            {
              "at": 0,
              "say": "모든 면을 칠해 새 입체를 살펴봐요.",
              "to": {
                "phDu": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정팔면체, 꼭짓점 6개가 생겨요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "중심을 이은 입체의 새 면",
      "label": "새 면",
      "tab": "review",
      "answer": "새 면 8개",
      "answerText": "새 면 8개",
      "summary": "새 면은 원래 꼭짓점, 새 모서리는 원래 모서리에 대응해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "원래 요소 확인",
          "start": {
            "phDu": 0,
            "phYaw": -36,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 각 면 중심에 점을 찍어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel7": "cube",
                "phBAsk": "F"
              },
              "to": {
                "phDu": 0.31
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정육면체의 꼭짓점은 여덟 개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "하나씩 대응시키기",
          "cues": [
            {
              "at": 0,
              "say": "원래 꼭짓점 하나 둘레의 세 중심이 새 면을 만들어요.",
              "to": {
                "phDu": 0.65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "원래 요소 하나마다 새 면 하나가 생겨요.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "새 요소의 개수",
          "cues": [
            {
              "at": 0,
              "say": "빠짐없이 일대일로 대응하는지 확인해요.",
              "to": {
                "phDu": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "따라서 새 면 8개가 생겨요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "중심을 이은 입체의 새 모서리",
      "label": "새 모서리",
      "tab": "review",
      "answer": "새 모서리 12개",
      "answerText": "새 모서리 12개",
      "summary": "새 면은 원래 꼭짓점, 새 모서리는 원래 모서리에 대응해요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "원래 요소 확인",
          "start": {
            "phDu": 0,
            "phYaw": -36,
            "phPitch": 22
          },
          "cues": [
            {
              "at": 0,
              "say": "정육면체의 각 면 중심에 점을 찍어요.",
              "set": {
                "phShowAnswer": false,
                "phBStage": 0,
                "phSel7": "cube",
                "phBAsk": "E"
              },
              "to": {
                "phDu": 0.31
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "정육면체의 모서리는 열두 개예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "하나씩 대응시키기",
          "cues": [
            {
              "at": 0,
              "say": "모서리 하나를 공유한 두 면의 중심을 이어요.",
              "to": {
                "phDu": 0.65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "원래 요소 하나마다 새 모서리 하나가 생겨요.",
              "set": {
                "phBStage": 1
              },
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "새 요소의 개수",
          "cues": [
            {
              "at": 0,
              "say": "빠짐없이 일대일로 대응하는지 확인해요.",
              "to": {
                "phDu": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "따라서 새 모서리 12개가 생겨요.",
              "set": {
                "phShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ]
});
