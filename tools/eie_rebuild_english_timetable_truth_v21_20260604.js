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
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RS2-1",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [
        "Carmen"
      ],
      "화": [
        "Carmen"
      ],
      "수": [
        "Foreigner"
      ],
      "목": [
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: RS2-1 수아 (Carmen)",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_02_LE3",
    "truth_no": 2,
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "LE3",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "IVY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "IVY"
      ]
    },
    "memo": "원문: LE3 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_03_PHONIC2",
    "truth_no": 3,
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "PHONIC2",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "Foreigner"
      ],
      "수": [
        "STACY"
      ],
      "목": [],
      "금": [
        "STACY"
      ]
    },
    "memo": "목 주4일 파닉스는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_04_RT_1",
    "truth_no": 4,
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RT 1",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "Foreigner"
      ],
      "화": [
        "IVY"
      ],
      "수": [
        "Carmen"
      ],
      "목": [
        "IVY"
      ],
      "금": [
        "Carmen"
      ]
    },
    "memo": "원문: RT 1 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_05_FP2",
    "truth_no": 5,
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "FP2",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [
        "Zoe"
      ],
      "수": [
        "Zoe"
      ],
      "목": [
        "Carmen"
      ],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "원문: FP2 Zoe",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_06_PL2",
    "truth_no": 6,
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "PL2",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "월": [
        "Lily"
      ],
      "화": [
        "Lily"
      ],
      "수": [
        "Lily"
      ],
      "목": [
        "Foreigner"
      ],
      "금": [
        "Lily"
      ]
    },
    "memo": "원문: Lily PL2",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_07_PHONIC1",
    "truth_no": 7,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PHONIC1",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "월": [
        "Lily"
      ],
      "화": [
        "Lily"
      ],
      "수": [
        "Foreigner"
      ],
      "목": [],
      "금": [
        "Lily"
      ]
    },
    "memo": "목 주4일 파닉스는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_08_PJ2",
    "truth_no": 8,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PJ2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [
        "IVY"
      ],
      "수": [
        "Zoe"
      ],
      "목": [
        "IVY"
      ],
      "금": [
        "IVY"
      ]
    },
    "memo": "원문: PJ2 지원, 주하 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_09_초_5_6",
    "truth_no": 9,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "초 5,6",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [
        "Carmen"
      ],
      "화": [
        "Lily"
      ],
      "수": [
        "Carmen"
      ],
      "목": [],
      "금": []
    },
    "memo": "원문 확인 필요: 초 5,6 Carmen",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_10_RS2-2",
    "truth_no": 10,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "RS2-2",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [
        "Foreigner"
      ],
      "화": [
        "Carmen"
      ],
      "수": [
        "Carmen"
      ],
      "목": [
        "Carmen"
      ],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: (Car) RS2-2",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_11_FP2",
    "truth_no": 11,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "FP2",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "Foreigner"
      ],
      "수": [
        "IVY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "원문: FP2 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_12_RTH_2",
    "truth_no": 12,
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "RTH 2",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [
        "Zoe"
      ],
      "수": [
        "STACY"
      ],
      "목": [
        "Zoe"
      ],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "원문: RTH 2 Zoe",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_13_RS4",
    "truth_no": 13,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "RS4",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "Zoe"
      ],
      "목": [
        "Foreigner"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "원문: RS4 도원 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_14_LT4",
    "truth_no": 14,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "LT4",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [
        "Foreigner"
      ],
      "수": [
        "Foreigner"
      ],
      "목": [
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "memo": "프-영-수는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_15_현우5",
    "truth_no": 15,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "현우5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [],
      "화": [
        "Lily"
      ],
      "수": [],
      "목": [
        "Lily"
      ],
      "금": [
        "IVY"
      ]
    },
    "memo": "원문: 현우5 화목금 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_16_승재5",
    "truth_no": 16,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "승재5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [],
      "수": [
        "IVY"
      ],
      "목": [],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "원문: 승재5 월수금 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_17_CH5_6",
    "truth_no": 17,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "CH5,6",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "월": [
        "Lily"
      ],
      "화": [
        "Lily"
      ],
      "수": [
        "Lily"
      ],
      "목": [],
      "금": [
        "Lily"
      ]
    },
    "memo": "원문: CH5,6 Lily",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_18_JA_2-2",
    "truth_no": 18,
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "JA 2-2",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [
        "Foreigner"
      ],
      "화": [
        "Carmen"
      ],
      "수": [
        "Carmen"
      ],
      "목": [
        "Carmen"
      ],
      "금": [
        "Carmen"
      ]
    },
    "memo": "원문: JA 2-2 한가람 (Carmen)",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_19_현우5",
    "truth_no": 19,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "현우5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [],
      "화": [
        "Lily"
      ],
      "수": [],
      "목": [
        "Lily"
      ],
      "금": []
    },
    "memo": "금 PREP는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_20_승재5",
    "truth_no": 20,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "승재5",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [],
      "수": [
        "Lily"
      ],
      "목": [],
      "금": [
        "IVY"
      ]
    },
    "memo": "원문: 승재5 월수금 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_21_LE_6",
    "truth_no": 21,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "LE 6",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [
        "Carmen"
      ],
      "화": [
        "Foreigner"
      ],
      "수": [
        "Carmen"
      ],
      "목": [
        "Zoe"
      ],
      "금": []
    },
    "memo": "원문: LE 6 (Carmen)",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_22_준서_6",
    "truth_no": 22,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "준서 6",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "Foreigner"
      ],
      "화": [],
      "수": [
        "STACY"
      ],
      "목": [],
      "금": [
        "Lily"
      ]
    },
    "memo": "준서반은 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_23_중1_윤재",
    "truth_no": 23,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "중1 윤재",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [],
      "화": [
        "Zoe"
      ],
      "수": [],
      "목": [
        "Foreigner"
      ],
      "금": []
    },
    "memo": "목 윤재반 / 금 PREP는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_24_중2_시은",
    "truth_no": 24,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "중2 시은",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [],
      "화": [
        "Carmen",
        "STACY"
      ],
      "수": [],
      "목": [
        "IVY"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "원문: 중2(시은) 화목금 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_25_중1_해율_채원",
    "truth_no": 25,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "중1 해율/채원",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "Lily"
      ],
      "화": [],
      "수": [
        "IVY"
      ],
      "목": [],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "원문: 중1 해율/채원 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_26_민채A4",
    "truth_no": 26,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "민채A4",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "Carmen"
      ],
      "금": [
        "Carmen"
      ]
    },
    "memo": "원문: 민채A4 (Carmen)",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_27_중1_예빈",
    "truth_no": 27,
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "중1 예빈",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [],
      "수": [
        "Foreigner"
      ],
      "목": [],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: 중1 예빈 ZOE",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_28_중1_예빈",
    "truth_no": 28,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "중1 예빈",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Lily"
      ],
      "화": [],
      "수": [
        "Zoe"
      ],
      "목": [],
      "금": []
    },
    "memo": "금 PREP는 담당 제외",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_29_중1C",
    "truth_no": 29,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "중1C",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "월": [],
      "화": [
        "Carmen"
      ],
      "수": [],
      "목": [
        "Foreigner"
      ],
      "금": [
        "Carmen"
      ]
    },
    "memo": "원문: 중1C (Carmen)",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_30_중2_시은",
    "truth_no": 30,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "중2 시은",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "원문: 중2(시은) 화목금 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_31_예비중A2",
    "truth_no": 31,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "예비중A2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "Carmen"
      ],
      "화": [],
      "수": [
        "IVY"
      ],
      "목": [],
      "금": [
        "IVY"
      ]
    },
    "memo": "원문: 예비중A2 해율/채원 IVY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_32_중1-6",
    "truth_no": 32,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "중1-6",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [],
      "화": [
        "Zoe"
      ],
      "수": [],
      "목": [
        "Lily"
      ],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: 윤재 중1-6 Zoe 화목금",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_33_준서6",
    "truth_no": 33,
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "준서6",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [],
      "수": [
        "STACY"
      ],
      "목": [],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "월/수 준서 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_34_중3A",
    "truth_no": 34,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중3A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [],
      "화": [
        "Zoe"
      ],
      "수": [],
      "목": [
        "Zoe"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "금 중3 A+B READING 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_35_중2-1",
    "truth_no": 35,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중2-1",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [],
      "화": [
        "IVY"
      ],
      "수": [],
      "목": [
        "IVY"
      ],
      "금": [
        "IVY"
      ]
    },
    "memo": "금 중2 1+2 READING 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_36_중2A",
    "truth_no": 36,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중2A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [],
      "수": [
        "Foreigner"
      ],
      "목": [],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: 중2A민하 월수금 ZOE",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_37_중2-2",
    "truth_no": 37,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중2-2",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [],
      "수": [
        "IVY"
      ],
      "목": [],
      "금": []
    },
    "memo": "금 합반 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_38_중1BB",
    "truth_no": 38,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중1BB",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "STACY"
      ],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "원문: 중1BB 화목금 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_39_중3B",
    "truth_no": 39,
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "중3B",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [],
      "수": [
        "STACY"
      ],
      "목": [],
      "금": []
    },
    "memo": "금 합반 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_40_중3A",
    "truth_no": 40,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중3A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [],
      "화": [
        "Zoe"
      ],
      "수": [],
      "목": [
        "Zoe"
      ],
      "금": [
        "STACY"
      ]
    },
    "memo": "금 중3 A+B READING 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_41_중2A",
    "truth_no": 41,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중2A",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "월": [
        "Zoe"
      ],
      "화": [],
      "수": [
        "Zoe"
      ],
      "목": [],
      "금": [
        "Zoe"
      ]
    },
    "memo": "원문: 중2A민하 월수금 ZOE",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_42_중1BB",
    "truth_no": 42,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중1BB",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "STACY"
      ],
      "금": [
        "Lily"
      ]
    },
    "memo": "원문: 중1 BB 화목금 STACY",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_43_중3",
    "truth_no": 43,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중3",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [],
      "수": [
        "STACY"
      ],
      "목": [],
      "금": [
        "STACY"
      ]
    },
    "memo": "금 중3 A+B READING 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_44_중2_형우",
    "truth_no": 44,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중2 형우",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [],
      "수": [
        "IVY"
      ],
      "목": [],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "금 중2 합반 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_45_중2_나은이반",
    "truth_no": 45,
    "period_order": 7,
    "period_label": "7교시",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "중2 나은이반",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "월": [],
      "화": [
        "IVY"
      ],
      "수": [],
      "목": [
        "IVY"
      ],
      "금": [
        "Foreigner"
      ]
    },
    "memo": "금 중2 합반 메모",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  },
  {
    "truth_id": "truth_46_단어_클리닉",
    "truth_no": 46,
    "period_order": 8,
    "period_label": "단어 클리닉",
    "start_time": "20:00",
    "end_time": "20:45",
    "material_text": "단어 클리닉",
    "homeroom_teacher": "",
    "day_teachers": {
      "월": [],
      "화": [],
      "수": [],
      "목": [],
      "금": []
    },
    "memo": "",
    "source": "26년영어강사시간표 / 영어26.04 기준 수기 정리"
  }
];
  const DAY_ORDER = ['월', '화', '수', '목', '금'];
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
    mon: (card.day_teachers['월'] || []).join('/'),
    tue: (card.day_teachers['화'] || []).join('/'),
    wed: (card.day_teachers['수'] || []).join('/'),
    thu: (card.day_teachers['목'] || []).join('/'),
    fri: (card.day_teachers['금'] || []).join('/'),
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
    if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
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
