// EIE timetable rebuild script v21
// Purpose: replace the current imported/incorrect EIE timetable cells with the manually rebuilt truth timetable.
// Scope: timetable cells only. Student assignments are NOT copied to the new cells.
// Run location: EIE app timetable screen console after login.

(async () => {
  const TRUTH_CARDS = [
  {
    "truth_id": "truth_01_RS2-1",
    "truth_no": 1,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RS2-1",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [
        "Carmen"
      ],
      "??: [
        "Carmen"
      ],
      "??: [
        "Foreigner"
      ],
      "紐?: [
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: RS2-1 ?섏븘 (Carmen)",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_02_LE3",
    "truth_no": 2,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "LE3",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "IVY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "?먮Ц: LE3 IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_03_PHONIC2",
    "truth_no": 3,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "PHONIC2",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "Foreigner"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "紐?二????뚮땳?ㅻ뒗 ?대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_04_RT_1",
    "truth_no": 4,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RT 1",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "Foreigner"
      ],
      "??: [
        "IVY"
      ],
      "??: [
        "Carmen"
      ],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "Carmen"
      ]
    },
    "memo": "?먮Ц: RT 1 IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_05_FP2",
    "truth_no": 5,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "FP2",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [
        "Zoe"
      ],
      "??: [
        "Zoe"
      ],
      "紐?: [
        "Carmen"
      ],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "?먮Ц: FP2 Zoe",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_06_PL2",
    "truth_no": 6,
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "PL2",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "??: [
        "Lily"
      ],
      "??: [
        "Lily"
      ],
      "??: [
        "Lily"
      ],
      "紐?: [
        "Foreigner"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "memo": "?먮Ц: Lily PL2",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_07_PHONIC1",
    "truth_no": 7,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PHONIC1",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "??: [
        "Lily"
      ],
      "??: [
        "Lily"
      ],
      "??: [
        "Foreigner"
      ],
      "紐?: [],
      "湲?: [
        "Lily"
      ]
    },
    "memo": "紐?二????뚮땳?ㅻ뒗 ?대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_08_PJ2",
    "truth_no": 8,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PJ2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "??: [
        "Zoe"
      ],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "?먮Ц: PJ2 吏?? 二쇳븯 IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_09_珥?5_6",
    "truth_no": 9,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "珥?5,6",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [
        "Carmen"
      ],
      "??: [
        "Lily"
      ],
      "??: [
        "Carmen"
      ],
      "紐?: [],
      "湲?: []
    },
    "memo": "?먮Ц ?뺤씤 ?꾩슂: 珥?5,6 Carmen",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_10_RS2-2",
    "truth_no": 10,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "RS2-2",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [
        "Foreigner"
      ],
      "??: [
        "Carmen"
      ],
      "??: [
        "Carmen"
      ],
      "紐?: [
        "Carmen"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: (Car) RS2-2",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_11_FP2",
    "truth_no": 11,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "FP2",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "Foreigner"
      ],
      "??: [
        "IVY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "?먮Ц: FP2 STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_12_RTH_2",
    "truth_no": 12,
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "RTH 2",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [
        "Zoe"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [
        "Zoe"
      ],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "?먮Ц: RTH 2 Zoe",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_13_RS4",
    "truth_no": 13,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "RS4",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "Zoe"
      ],
      "紐?: [
        "Foreigner"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "?먮Ц: RS4 ?꾩썝 STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_14_LT4",
    "truth_no": 14,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "LT4",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [
        "Foreigner"
      ],
      "??: [
        "Foreigner"
      ],
      "紐?: [
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?????섎뒗 ?대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_15_?꾩슦5",
    "truth_no": 15,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "?꾩슦5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [],
      "??: [
        "Lily"
      ],
      "??: [],
      "紐?: [
        "Lily"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "?먮Ц: ?꾩슦5 ?붾ぉ湲?IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_16_?뱀옱5",
    "truth_no": 16,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "?뱀옱5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [],
      "??: [
        "IVY"
      ],
      "紐?: [],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "?먮Ц: ?뱀옱5 ?붿닔湲?IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_17_CH5_6",
    "truth_no": 17,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "CH5,6",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "??: [
        "Lily"
      ],
      "??: [
        "Lily"
      ],
      "??: [
        "Lily"
      ],
      "紐?: [],
      "湲?: [
        "Lily"
      ]
    },
    "memo": "?먮Ц: CH5,6 Lily",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_18_JA_2-2",
    "truth_no": 18,
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "JA 2-2",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [
        "Foreigner"
      ],
      "??: [
        "Carmen"
      ],
      "??: [
        "Carmen"
      ],
      "紐?: [
        "Carmen"
      ],
      "湲?: [
        "Carmen"
      ]
    },
    "memo": "?먮Ц: JA 2-2 ?쒓???(Carmen)",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_19_?꾩슦5",
    "truth_no": 19,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "?꾩슦5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [],
      "??: [
        "Lily"
      ],
      "??: [],
      "紐?: [
        "Lily"
      ],
      "湲?: []
    },
    "memo": "湲?PREP???대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_20_?뱀옱5",
    "truth_no": 20,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "?뱀옱5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [],
      "??: [
        "Lily"
      ],
      "紐?: [],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "?먮Ц: ?뱀옱5 ?붿닔湲?IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_21_LE_6",
    "truth_no": 21,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "LE 6",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [
        "Carmen"
      ],
      "??: [
        "Foreigner"
      ],
      "??: [
        "Carmen"
      ],
      "紐?: [
        "Zoe"
      ],
      "湲?: []
    },
    "memo": "?먮Ц: LE 6 (Carmen)",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_22_以??6",
    "truth_no": 22,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "以??6",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "Foreigner"
      ],
      "??: [],
      "??: [
        "STACY"
      ],
      "紐?: [],
      "湲?: [
        "Lily"
      ]
    },
    "memo": "以?쒕컲? 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_23_以?_?ㅼ옱",
    "truth_no": 23,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "以? ?ㅼ옱",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [],
      "??: [
        "Zoe"
      ],
      "??: [],
      "紐?: [
        "Foreigner"
      ],
      "湲?: []
    },
    "memo": "紐??ㅼ옱諛?/ 湲?PREP???대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_24_以?_?쒖?",
    "truth_no": 24,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "以? ?쒖?",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [],
      "??: [
        "Carmen",
        "STACY"
      ],
      "??: [],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "?먮Ц: 以?(?쒖?) ?붾ぉ湲?STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_25_以?_?댁쑉_梨꾩썝",
    "truth_no": 25,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "以? ?댁쑉/梨꾩썝",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "Lily"
      ],
      "??: [],
      "??: [
        "IVY"
      ],
      "紐?: [],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "?먮Ц: 以? ?댁쑉/梨꾩썝 IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_26_誘쇱콈A4",
    "truth_no": 26,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "誘쇱콈A4",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "Carmen"
      ],
      "湲?: [
        "Carmen"
      ]
    },
    "memo": "?먮Ц: 誘쇱콈A4 (Carmen)",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_27_以?_?덈퉰",
    "truth_no": 27,
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "以? ?덈퉰",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [],
      "??: [
        "Foreigner"
      ],
      "紐?: [],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: 以? ?덈퉰 ZOE",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_28_以?_?덈퉰",
    "truth_no": 28,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "以? ?덈퉰",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Lily"
      ],
      "??: [],
      "??: [
        "Zoe"
      ],
      "紐?: [],
      "湲?: []
    },
    "memo": "湲?PREP???대떦 ?쒖쇅",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_29_以?C",
    "truth_no": 29,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "以?C",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "??: [],
      "??: [
        "Carmen"
      ],
      "??: [],
      "紐?: [
        "Foreigner"
      ],
      "湲?: [
        "Carmen"
      ]
    },
    "memo": "?먮Ц: 以?C (Carmen)",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_30_以?_?쒖?",
    "truth_no": 30,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "以? ?쒖?",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "?먮Ц: 以?(?쒖?) ?붾ぉ湲?STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_31_?덈퉬以멇2",
    "truth_no": 31,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "?덈퉬以멇2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "Carmen"
      ],
      "??: [],
      "??: [
        "IVY"
      ],
      "紐?: [],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "?먮Ц: ?덈퉬以멇2 ?댁쑉/梨꾩썝 IVY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_32_以?-6",
    "truth_no": 32,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "以?-6",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [],
      "??: [
        "Zoe"
      ],
      "??: [],
      "紐?: [
        "Lily"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: ?ㅼ옱 以?-6 Zoe ?붾ぉ湲?,
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_33_以??",
    "truth_no": 33,
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "以??",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [],
      "??: [
        "STACY"
      ],
      "紐?: [],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "????以??硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_34_以?A",
    "truth_no": 34,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [],
      "??: [
        "Zoe"
      ],
      "??: [],
      "紐?: [
        "Zoe"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "湲?以? A+B READING 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_35_以?-1",
    "truth_no": 35,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?-1",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [],
      "??: [
        "IVY"
      ],
      "??: [],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "memo": "湲?以? 1+2 READING 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_36_以?A",
    "truth_no": 36,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [],
      "??: [
        "Foreigner"
      ],
      "紐?: [],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: 以?A誘쇳븯 ?붿닔湲?ZOE",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_37_以?-2",
    "truth_no": 37,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?-2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [],
      "??: [
        "IVY"
      ],
      "紐?: [],
      "湲?: []
    },
    "memo": "湲??⑸컲 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_38_以?BB",
    "truth_no": 38,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?BB",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "?먮Ц: 以?BB ?붾ぉ湲?STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_39_以?B",
    "truth_no": 39,
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "以?B",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [],
      "??: [
        "STACY"
      ],
      "紐?: [],
      "湲?: []
    },
    "memo": "湲??⑸컲 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_40_以?A",
    "truth_no": 40,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以?A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [],
      "??: [
        "Zoe"
      ],
      "??: [],
      "紐?: [
        "Zoe"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "湲?以? A+B READING 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_41_以?A",
    "truth_no": 41,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以?A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "??: [
        "Zoe"
      ],
      "??: [],
      "??: [
        "Zoe"
      ],
      "紐?: [],
      "湲?: [
        "Zoe"
      ]
    },
    "memo": "?먮Ц: 以?A誘쇳븯 ?붿닔湲?ZOE",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_42_以?BB",
    "truth_no": 42,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以?BB",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "memo": "?먮Ц: 以? BB ?붾ぉ湲?STACY",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_43_以?",
    "truth_no": 43,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以?",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [],
      "??: [
        "STACY"
      ],
      "紐?: [],
      "湲?: [
        "STACY"
      ]
    },
    "memo": "湲?以? A+B READING 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_44_以?_?뺤슦",
    "truth_no": 44,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以? ?뺤슦",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [],
      "??: [
        "IVY"
      ],
      "紐?: [],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "湲?以? ?⑸컲 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_45_以?_?섏??대컲",
    "truth_no": 45,
    "period_order": 7,
    "period_label": "7援먯떆",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "以? ?섏??대컲",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "??: [],
      "??: [
        "IVY"
      ],
      "??: [],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "Foreigner"
      ]
    },
    "memo": "湲?以? ?⑸컲 硫붾え",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  },
  {
    "truth_id": "truth_46_?⑥뼱_?대━??,
    "truth_no": 46,
    "period_order": 8,
    "period_label": "?⑥뼱 ?대━??,
    "start_time": "20:00",
    "end_time": "20:45",
    "material_text": "?⑥뼱 ?대━??,
    "homeroom_teacher": "",
    "day_teachers": {
      "??: [],
      "??: [],
      "??: [],
      "紐?: [],
      "湲?: []
    },
    "memo": "",
    "source": "26?꾩쁺?닿컯?ъ떆媛꾪몴 / ?곸뼱26.04 湲곗? ?섍린 ?뺣━"
  }
];
  const DAY_ORDER = ['??, '??, '??, '紐?, '湲?];
  const TEACHER_NAMES = ['Carmen', 'IVY', 'Lily', 'Zoe', 'STACY', 'Foreigner', 'Laura'];
  function normalizeKey(value) { return String(value == null ? '' : value).trim(); }
  function asRows(result) {
    if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
    if (Array.isArray(result?.cells)) return result.cells;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.rows)) return result.rows;
    return [];
  }
  function rawMeta(card, day) {
    return {
      source_type: 'manual_truth_rebuild_v21',
      truth_id: card.truth_id,
      truth_no: card.truth_no,
      material_text: card.material_text,
      homeroom_teacher: card.homeroom_teacher,
      day_teachers: card.day_teachers,
      teacher_names_by_day: card.day_teachers,
      note: card.memo || '',
      source: card.source,
      day_label: day,
      applied_at: new Date().toISOString()
    };
  }
  function payloadFor(card, day, teachers) {
    return {
      id: `eie_truth_2604_${String(card.truth_no).padStart(2, '0')}_${day || 'all'}`,
      source_type: 'manual',
      day_label: day || '',
      period_label: card.period_label,
      period_order: card.period_order,
      start_time: card.start_time,
      end_time: card.end_time,
      class_name_raw: card.material_text,
      material_text: card.material_text,
      material: card.material_text,
      teacher_name_raw: (teachers || []).join(', '),
      teacher_names: teachers || [],
      status: 'active',
      memo: card.memo || '',
      raw_meta_json: rawMeta(card, day)
    };
  }
  function rowsForCard(card) {
    const rows = [];
    DAY_ORDER.forEach(day => {
      const teachers = Array.isArray(card.day_teachers?.[day]) ? card.day_teachers[day].filter(Boolean) : [];
      if (teachers.length) rows.push(payloadFor(card, day, teachers));
    });
    if (!rows.length) rows.push(payloadFor(card, '', card.homeroom_teacher ? [card.homeroom_teacher] : []));
    return rows;
  }
  if (!window.EieApi?.getTimetable || !window.EieApi?.createTimetableCell || !window.EieApi?.updateTimetableCell) {
    throw new Error('EIE API not ready. Open the real EIE timetable screen after login.');
  }
  const current = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
  const currentRows = asRows(current);
  const createRows = TRUTH_CARDS.flatMap(rowsForCard);
  console.table(TRUTH_CARDS.map(card => ({
    no: card.truth_no,
    period: card.period_label,
    time: `${card.start_time}~${card.end_time}`,
    material: card.material_text,
    homeroom: card.homeroom_teacher || '-',
    mon: (card.day_teachers['??] || []).join('/'),
    tue: (card.day_teachers['??] || []).join('/'),
    wed: (card.day_teachers['??] || []).join('/'),
    thu: (card.day_teachers['紐?] || []).join('/'),
    fri: (card.day_teachers['湲?] || []).join('/'),
    memo: card.memo || ''
  })));
  console.log('Current visible timetable cells:', currentRows.length);
  console.log('Truth cards:', TRUTH_CARDS.length);
  console.log('Cells to create:', createRows.length);
  const msg = [
    'EIE timetable rebuild v21',
    '',
    `Current cells to archive: ${currentRows.length}`,
    `Truth cards to create: ${TRUTH_CARDS.length}`,
    `Day cells to create: ${createRows.length}`,
    '',
    'This will archive the current visible timetable cells and create the rebuilt timetable from the manually reviewed truth table.',
    'Student assignments are NOT copied to the new cells.',
    '',
    'Continue?'
  ].join('\n');
  if (!window.confirm(msg)) {
    console.log('Cancelled. No changes were made.');
    return;
  }
  const report = {
    started_at: new Date().toISOString(),
    archived: [],
    archive_failures: [],
    created: [],
    create_failures: [],
    truth_cards: TRUTH_CARDS.length,
    create_rows: createRows.length
  };
  for (const row of currentRows) {
    const id = normalizeKey(row?.id || row?.cell_id || '');
    if (!id) continue;
    try {
      await window.EieApi.updateTimetableCell(id, {
        status: 'archived',
        memo: [row.memo || '', '[archived by EIE truth rebuild v21]'].filter(Boolean).join(' ')
      });
      report.archived.push(id);
    } catch (error) {
      report.archive_failures.push({ cell_id: id, error: error?.message || String(error) });
    }
  }
  for (const payload of createRows) {
    try {
      const result = await window.EieApi.createTimetableCell(payload);
      report.created.push({ id: payload.id, day: payload.day_label, material: payload.material_text, result });
    } catch (error) {
      report.create_failures.push({ id: payload.id, day: payload.day_label, material: payload.material_text, error: error?.message || String(error) });
    }
  }
  try {
    const refreshed = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
    const refreshedRows = asRows(refreshed);
    if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(refreshedRows);
    if (window.EieRouter?.open) window.EieRouter.open('timetable');
    report.refreshed_count = refreshedRows.length;
  } catch (error) {
    report.refresh_error = error?.message || String(error);
  }
  report.finished_at = new Date().toISOString();
  console.log('EIE timetable rebuild v21 report:', report);
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `eie_timetable_rebuild_v21_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
  if (report.create_failures.length || report.archive_failures.length) {
    alert(`Done with warnings. Create failures: ${report.create_failures.length}, archive failures: ${report.archive_failures.length}`);
  } else {
    alert('EIE timetable rebuild v21 completed.');
  }
})().catch(error => {
  console.error('EIE timetable rebuild v21 failed:', error);
  alert(error?.message || String(error));
});
