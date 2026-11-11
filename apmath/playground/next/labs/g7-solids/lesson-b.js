/* 회전체 해설 B: t2 원본 질문·모델·정리와 연습문제 조건을 사용합니다.
 * 기존 재생 키트 재사용. 최종 답은 마지막 장에서 soShowAnswer로 공개합니다.
 * 전수 모바일 품질검수는 운영 반영 후 별도로 진행합니다. */
window.APL_LESSONS = window.APL_LESSONS || {};
window.APL_LESSONS['g7-solids'] = window.APL_LESSONS['g7-solids'] || {};
Object.assign(window.APL_LESSONS['g7-solids'], {
  "s2-1": [
    {
      "title": "축에 수직인 단면",
      "label": "단면 모양",
      "tab": "review",
      "answer": "단면은 원",
      "answerText": "단면은 원",
      "summary": "속이 찬 입체의 두 끝 사이를 잘라 확인해요",
      "task": "직접 해 보기에서 원뿔·구로 바꾸어 두 끝 사이의 단면을 살펴보세요",
      "chapters": [
        {
          "length": 10,
          "title": "자르는 방향",
          "cues": [
            {
              "at": 0,
              "say": "속이 찬 원기둥을 살펴볼게요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "shape",
                "soK2": "cyl"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "두 끝 사이에서 회전축에 수직으로 잘라요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "중심과 경계",
          "cues": [
            {
              "at": 0,
              "say": "축과 자르는 평면이 만난 점을 찾아요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "그 점에서 단면의 경계까지 거리가 모두 같아요."
            }
          ]
        },
        {
          "length": 10,
          "title": "단면의 이름",
          "cues": [
            {
              "at": 0,
              "say": "중심에서 같은 거리에 있는 경계를 가진 도형이에요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "이 원기둥을 자른 단면은 원이에요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "높이에 따른 단면 크기",
      "label": "크기 변화",
      "tab": "review",
      "answer": "꼭짓점 쪽으로 작아진다",
      "answerText": "꼭짓점 쪽으로 작아진다",
      "summary": "원뿔의 단면은 꼭짓점에 가까울수록 작아져요",
      "task": "직접 해 보기에서 높이를 바꾸고 원기둥·구의 변화와 비교해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "두 끝 사이에서 자르기",
          "cues": [
            {
              "at": 0,
              "say": "원뿔의 두 끝 사이를 축에 수직으로 잘라요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "size",
                "soK2": "cone"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "자르는 평면을 꼭짓점 쪽으로 올려 볼게요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 4,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.25,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "높이를 바꾸기",
          "cues": [
            {
              "at": 0,
              "say": "축에서 옆면까지의 거리가 어떻게 바뀌나요?",
              "to": {
                "soU": 0.75
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "같은 높이의 단면과 밑면을 나란히 비교해요.",
              "step": 3
            }
          ]
        },
        {
          "length": 10,
          "title": "크기 변화 정리",
          "cues": [
            {
              "at": 0,
              "say": "원의 반지름이 줄어들면 단면의 크기도 줄어요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "원뿔의 단면은 꼭짓점 쪽으로 작아진다.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "중간 높이의 반지름",
      "label": "반지름",
      "tab": "review",
      "answer": "2 cm",
      "answerText": "2 cm",
      "summary": "밑면에 평행한 중간 단면의 반지름은 밑면의 절반이에요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "조건과 기호",
          "cues": [
            {
              "at": 0,
              "say": "밑면 반지름 R=4 cm, 높이 h=6 cm예요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "radius",
                "soK2": "cone"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "밑면에서 3 cm 위를 밑면과 평행하게 잘라요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 4,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.5,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "높이의 비",
          "cues": [
            {
              "at": 0,
              "say": "꼭짓점에서 단면까지의 높이를 먼저 비교해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "그 높이도 6−3=3 cm로 전체 높이의 절반이에요."
            }
          ]
        },
        {
          "length": 10,
          "title": "반지름의 비",
          "cues": [
            {
              "at": 0,
              "say": "축을 포함한 단면에서 작은 삼각형과 큰 삼각형을 봐요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "밑면에 평행하므로 반지름도 같은 비로 줄어요."
            }
          ]
        },
        {
          "length": 10,
          "title": "반지름 계산",
          "cues": [
            {
              "at": 0,
              "say": "높이의 비가 1:2이므로 밑면 반지름을 2로 나눠요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "단면의 반지름은 4÷2=2 cm예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "s2-2": [
    {
      "title": "축을 포함한 단면의 모양",
      "label": "단면 모양",
      "tab": "review",
      "answer": "이등변삼각형",
      "answerText": "이등변삼각형",
      "summary": "축을 포함한 단면의 양쪽 모선은 길이가 같아요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "축을 포함해 자르기",
          "cues": [
            {
              "at": 0,
              "say": "원뿔의 회전축 l을 포함하는 평면을 넣어요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "shape",
                "soK2": "cone"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "밑면의 중심과 꼭짓점을 함께 지나는 평면이에요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "경계와 같은 길이",
          "cues": [
            {
              "at": 0,
              "say": "단면의 밑변은 밑면인 원의 지름이에요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "꼭짓점에서 밑변 양 끝까지의 두 모선이 같아요."
            }
          ]
        },
        {
          "length": 10,
          "title": "단면 이름",
          "cues": [
            {
              "at": 0,
              "say": "두 변의 길이가 같은 삼각형의 이름을 떠올려요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "원뿔의 축을 포함한 단면은 이등변삼각형이에요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "자르는 방향을 바꾸면",
      "label": "방향 비교",
      "tab": "review",
      "answer": "모양과 크기가 같다",
      "answerText": "모양과 크기가 같다",
      "summary": "축을 포함한 채 방향을 바꾼 단면들은 합동이에요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "같은 축을 지나는 판",
          "cues": [
            {
              "at": 0,
              "say": "원뿔의 축을 포함한 평면으로 잘라요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "rotate",
                "soK2": "cone"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "평면이 회전축에서 벗어나지 않도록 해요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "평면을 돌리기",
          "cues": [
            {
              "at": 0,
              "say": "회전축을 포함한 채 평면의 방향을 돌려요.",
              "to": {
                "soPsi": 60
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "밑변은 늘 같은 밑면의 지름, 높이는 원뿔의 높이예요.",
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "방향과 단면",
          "cues": [
            {
              "at": 0,
              "say": "두 모선도 그대로여서 단면의 변 길이가 유지돼요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "방향을 바꾸어도 모양과 크기가 같다, 즉 합동이에요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "s2-3": [
    {
      "title": "원기둥 단면의 넓이",
      "label": "원기둥",
      "tab": "review",
      "answer": "36 cm²",
      "answerText": "36 cm²",
      "summary": "단면의 가로 길이에는 반지름이 아니라 지름을 써요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "조건과 단면",
          "cues": [
            {
              "at": 0,
              "say": "밑면 반지름 r=3 cm, 높이 h=6 cm예요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "area",
                "soK2": "cyl"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "회전축을 포함한 평면으로 잘라 단면을 봐요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "가로는 지름",
          "cues": [
            {
              "at": 0,
              "say": "회전축의 양쪽 반지름을 합쳐 가로 길이를 구해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "단면의 가로는 지름이므로 2r=6 cm예요.",
              "set": {
                "soBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "넓이 전략",
          "cues": [
            {
              "at": 0,
              "say": "단면의 높이는 입체의 높이와 같은 6 cm예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "직사각형의 넓이는 가로×세로로 구해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "계산과 단위",
          "cues": [
            {
              "at": 0,
              "say": "길이의 단위는 cm, 넓이의 단위는 cm²예요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "단면의 넓이 = 6×6=36 cm²예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "원뿔 단면의 넓이",
      "label": "원뿔",
      "tab": "review",
      "answer": "18 cm²",
      "answerText": "18 cm²",
      "summary": "단면의 가로 길이에는 반지름이 아니라 지름을 써요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "조건과 단면",
          "cues": [
            {
              "at": 0,
              "say": "밑면 반지름 r=3 cm, 높이 h=6 cm예요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "area",
                "soK2": "cone"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "회전축을 포함한 평면으로 잘라 단면을 봐요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "가로는 지름",
          "cues": [
            {
              "at": 0,
              "say": "회전축의 양쪽 반지름을 합쳐 가로 길이를 구해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "단면의 밑변은 지름이므로 2r=6 cm예요.",
              "set": {
                "soBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "넓이 전략",
          "cues": [
            {
              "at": 0,
              "say": "단면의 높이는 입체의 높이와 같은 6 cm예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "삼각형의 넓이는 밑변×높이÷2로 구해요."
            }
          ]
        },
        {
          "length": 10,
          "title": "계산과 단위",
          "cues": [
            {
              "at": 0,
              "say": "길이의 단위는 cm, 넓이의 단위는 cm²예요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "단면의 넓이 = 6×6÷2=18 cm²예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "원뿔대 단면의 넓이",
      "label": "원뿔대",
      "tab": "review",
      "answer": "30 cm²",
      "answerText": "30 cm²",
      "summary": "단면의 가로 길이에는 반지름이 아니라 지름을 써요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "조건과 단면",
          "cues": [
            {
              "at": 0,
              "say": "큰 반지름 R=3, 작은 반지름 r=2 cm예요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "area",
                "soK2": "frus"
              },
              "to": {
                "soE": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "높이 h=6 cm이고, 축을 포함한 평면으로 잘라요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "가로는 지름",
          "cues": [
            {
              "at": 0,
              "say": "회전축의 양쪽 반지름을 합쳐 가로 길이를 구해요.",
              "step": 2
            },
            {
              "at": 5,
              "say": "아랫변 2R=6 cm, 윗변 2r=4 cm예요.",
              "set": {
                "soBStage": 1
              }
            }
          ]
        },
        {
          "length": 10,
          "title": "넓이 전략",
          "cues": [
            {
              "at": 0,
              "say": "단면의 높이는 입체의 높이와 같은 6 cm예요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "사다리꼴의 넓이는 (윗변+아랫변)×높이÷2예요."
            }
          ]
        },
        {
          "length": 10,
          "title": "계산과 단위",
          "cues": [
            {
              "at": 0,
              "say": "길이의 단위는 cm, 넓이의 단위는 cm²예요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "단면의 넓이 = (4+6)×6÷2=30 cm²예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "s2-4": [
    {
      "title": "단면에서 회전체 찾기",
      "label": "회전체 찾기",
      "tab": "review",
      "answer": "원뿔대",
      "answerText": "원뿔대",
      "summary": "축의 한쪽 단면을 한 바퀴 돌려 입체를 만들어요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "단면과 회전축",
          "cues": [
            {
              "at": 0,
              "say": "주어진 단면은 등변사다리꼴이에요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "solid",
                "soK2": "frus"
              },
              "to": {
                "soT": 0.18
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "회전축 l은 위·아래 밑변의 가운데를 지나가요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "반쪽을 돌리기",
          "cues": [
            {
              "at": 0,
              "say": "축의 한쪽 반을 한 바퀴 돌려 자취를 살펴요.",
              "to": {
                "soT": 1
              },
              "dur": 5
            },
            {
              "at": 5,
              "say": "서로 평행하고 크기가 다른 두 원이 밑면이 돼요.",
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "회전체의 이름",
          "cues": [
            {
              "at": 0,
              "say": "두 밑면 사이를 곧은 옆면이 연결해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "완성한 회전체는 원뿔대예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "s2-5": [
    {
      "title": "축을 따라 단면 접기",
      "label": "접어 보기",
      "tab": "review",
      "answer": "선대칭도형",
      "answerText": "선대칭도형",
      "summary": "접어서 겹치는 단면의 대칭축은 회전축이에요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "접는 선 확인",
          "cues": [
            {
              "at": 0,
              "say": "원뿔의 축을 포함한 단면을 살펴요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "fold",
                "soK2": "cone"
              },
              "to": {
                "soFold": 0.3
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "회전축 l을 접는 선으로 왼쪽 반을 넘겨요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "두 반쪽 비교",
          "cues": [
            {
              "at": 0,
              "say": "같은 높이에서 축까지의 거리가 좌우로 같아요.",
              "to": {
                "soFold": 1
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "꼭짓점과 변이 서로 포개지는지 확인해요.",
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "성질의 이름",
          "cues": [
            {
              "at": 0,
              "say": "접었을 때 두 반쪽이 꼭 겹치는 도형이에요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "이 단면은 회전축을 대칭축으로 하는 선대칭도형이에요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ],
  "s2-6": [
    {
      "title": "원뿔을 평행하게 자르면",
      "label": "남은 입체",
      "tab": "review",
      "answer": "원뿔대",
      "answerText": "원뿔대",
      "summary": "밑면에 평행하게 자른 작은 원뿔을 떼어 내요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "자르는 평면",
          "cues": [
            {
              "at": 0,
              "say": "큰 원뿔을 밑면에 평행한 평면으로 잘라요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "solid",
                "soK2": "cone"
              },
              "to": {
                "soG": 0.65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "빨간 윗부분을 옆으로 떼어 내어 모양을 봐요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "떼어 낸 부분",
          "cues": [
            {
              "at": 0,
              "say": "떼어 낸 부분은 꼭짓점과 원인 밑면을 가진 원뿔이에요.",
              "to": {
                "soG": 1
              },
              "dur": 3
            },
            {
              "at": 5,
              "say": "남은 입체의 두 밑면은 서로 평행하고 크기가 달라요.",
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "남은 부분의 이름",
          "cues": [
            {
              "at": 0,
              "say": "큰 원뿔에서 작은 원뿔을 뺀 부분에 주목해요.",
              "step": 3
            },
            {
              "at": 5,
              "say": "남은 입체는 원뿔대예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    },
    {
      "title": "잘라 낸 뒤의 높이",
      "label": "높이",
      "tab": "review",
      "answer": "6 cm",
      "answerText": "6 cm",
      "summary": "남은 높이는 큰 원뿔 높이에서 작은 원뿔 높이를 빼요",
      "task": "직접 해 보기에서 조건을 바꿔 같은 방법으로 확인해 보세요",
      "chapters": [
        {
          "length": 10,
          "title": "주어진 높이",
          "cues": [
            {
              "at": 0,
              "say": "큰 원뿔의 높이 H=8 cm, 작은 높이 h=2 cm예요.",
              "set": {
                "soShowAnswer": false,
                "soBStage": 0,
                "soBAsk": "height",
                "soK2": "cone"
              },
              "to": {
                "soG": 0.65
              },
              "dur": 4
            },
            {
              "at": 5,
              "say": "평행하게 잘라 윗부분을 떼어 냈어요.",
              "step": 1
            }
          ],
          "start": {
            "soSR": 3,
            "soSr": 2,
            "soSH": 6,
            "soU": 0.4,
            "soE": 0,
            "soPsi": 0,
            "soT": 0,
            "soFold": 0,
            "soG": 0,
            "soCutR": 4,
            "soCutH": 8,
            "soC": 1,
            "soYaw": 0,
            "soPitch": 25
          }
        },
        {
          "length": 10,
          "title": "높이의 관계",
          "cues": [
            {
              "at": 0,
              "say": "높이는 두 밑면 사이에 수직으로 잰 거리예요.",
              "to": {
                "soG": 1
              },
              "dur": 3
            },
            {
              "at": 5,
              "say": "전체 높이 H는 작은 높이 h와 남은 높이의 합이에요.",
              "step": 2
            }
          ]
        },
        {
          "length": 10,
          "title": "높이 계산",
          "cues": [
            {
              "at": 0,
              "say": "남은 높이는 H−h로 구해요.",
              "step": 4
            },
            {
              "at": 5,
              "say": "남은 높이 = 8−2=6 cm예요.",
              "set": {
                "soShowAnswer": true
              }
            }
          ]
        }
      ]
    }
  ]
});
