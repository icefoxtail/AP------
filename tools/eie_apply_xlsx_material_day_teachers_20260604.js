// EIE 26.04 Excel 湲곗? 援먯옱紐??붿씪蹂??대떦留?諛섏쁺?섎뒗 ?ㅽ뻾 ?ㅽ겕由쏀듃 v18
// 湲곗? ?뚯씪: ?곸뼱26.04 (1).xlsx / sheet: 26.04
// ?ㅽ뻾 ?꾩튂: ?ㅼ젣 EIE ?쒓컙???붾㈃ > DevTools Console
// 諛섏쁺 ??? 援먯옱紐? ??????紐?湲??대떦
// ?덈? 嫄대뱶由ъ? ?딆쓬: ?곷떒 ?댁엫 ?? ?숈깮 諛곗젙, cell id, 援먯떆/?쒓컙, 異쒓껐/?숈젣/?곷떞

(async () => {
  const XLSX_TRUTH_CARDS = [
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "rs3-1 Carmen",
    "material_text": "rs3-1",
    "day_teachers": {
      "??: [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "fp3 zoe",
    "material_text": "fp3",
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
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "LE4 IVY",
    "material_text": "LE4",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "phonic3 stacy",
    "material_text": "phonic3",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "pl3 Lily",
    "material_text": "pl3",
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
        "Lily"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1援먯떆",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 14,
    "excel_order": 6,
    "header_text": "LT1 IVY",
    "material_text": "LT1",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "pj3  ivy",
    "material_text": "pj3",
    "day_teachers": {
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "??: [
        "IVY"
      ],
      "紐?: [
        "IVY"
      ],
      "湲?: [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "rs3-2Carmen",
    "material_text": "rs3-2",
    "day_teachers": {
      "??: [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "phonics1 Lily",
    "material_text": "phonics1",
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
        "Lily"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "珥덈Ц踰?Lily",
    "material_text": "珥덈Ц踰?,
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
        "Lily"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "fp3 stacy",
    "material_text": "fp3",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2援먯떆",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 12,
    "excel_order": 6,
    "header_text": "rth3 zoe",
    "material_text": "rth3",
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
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "5???덈퉬以?Carmen",
    "material_text": "5???덈퉬以?,
    "day_teachers": {
      "??: [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "5??stacy",
    "material_text": "5??,
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "2IVY3?쇰컲?붿닔湲?,
    "material_text": "2/3?쇰컲",
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
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "Lily 3?쇰컲",
    "material_text": "3?쇰컲",
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
        "Lily"
      ],
      "湲?: [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3援먯떆",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "LT5 zoe",
    "material_text": "LT5",
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
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "以?-3 ?붾ぉstacy",
    "material_text": "以?-3",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "STACY"
      ],
      "湲?: []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "以?-3 zoe?붾ぉ湲?,
    "material_text": "以?-3",
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
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "以?-2 ivy?붿닔",
    "material_text": "以?-2",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "?덈퉬以?以묐벑援먯옱)stacy",
    "material_text": "?덈퉬以?以묐벑援먯옱)",
    "day_teachers": {
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "??: [
        "STACY"
      ],
      "紐?: [
        "STACY"
      ],
      "湲?: [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4援먯떆",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "4???덈퉬以?Carmen",
    "material_text": "4???덈퉬以?,
    "day_teachers": {
      "??: [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "以?-3 ?붾ぉ stacy",
    "material_text": "以?-3",
    "day_teachers": {
      "??: [],
      "??: [
        "STACY"
      ],
      "??: [],
      "紐?: [
        "STACY"
      ],
      "湲?: []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "以?-4 Carmen",
    "material_text": "以?-4",
    "day_teachers": {
      "??: [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5援먯떆",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 10,
    "excel_order": 3,
    "header_text": "以?-1 Laura",
    "material_text": "以?-1",
    "day_teachers": {
      "??: [
        "Laura"
      ],
      "??: [
        "Laura"
      ],
      "??: [
        "Laura"
      ],
      "紐?: [
        "Laura"
      ],
      "湲?: [
        "Laura"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "以?-4IVY(??",
    "material_text": "以?-4",
    "day_teachers": {
      "??: [],
      "??: [
        "IVY"
      ],
      "??: [],
      "紐?: [],
      "湲?: []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "zoe2-1 ?붿닔湲?,
    "material_text": "2-1",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "以?-2 ?붿닔湲뉹VY",
    "material_text": "以?-2",
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
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "以?-1?붿닔湲늮tacy",
    "material_text": "以?-1",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "3-2zoe",
    "material_text": "3-2",
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
        "Zoe"
      ],
      "湲?: [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6援먯떆",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 12,
    "excel_order": 6,
    "header_text": "以?-5?붾ぉ湲늮tacy",
    "material_text": "以?-5",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  }
];
  const DAY_ORDER = ['??, '??, '??, '紐?, '湲?];

  function normalizeKey(value) {
    return String(value == null ? '' : value).trim();
  }

  function normalizeTime(value) {
    const raw = normalizeKey(value);
    if (!raw) return '';
    const match = raw.match(/(\d{1,2})[:??\s*(\d{1,2})?/);
    if (!match) return raw;
    let hour = Number(match[1]);
    const minute = Number(match[2] || 0);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return raw;
    if (hour > 0 && hour < 9) hour += 12;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function asRows(result) {
    if (Array.isArray(result?.timetable_cells)) return result.timetable_cells;
    if (Array.isArray(result?.cells)) return result.cells;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.rows)) return result.rows;
    return [];
  }

  function getRawMeta(row) {
    const value = row?.raw_meta_json;
    if (!value) return {};
    if (typeof value === 'object') return value;
    try { return JSON.parse(value); } catch (error) { return {}; }
  }

  function periodKeyFromRow(row) {
    return [
      Number.isFinite(Number(row?.period_order)) ? Number(row.period_order) : '',
      normalizeKey(row?.period_label || row?.period || ''),
      normalizeTime(row?.start_time || row?.start || row?.from_time || ''),
      normalizeTime(row?.end_time || row?.end || row?.to_time || '')
    ].join('|');
  }

  function periodKeyFromTruth(row) {
    return [
      Number(row.period_order || 0),
      normalizeKey(row.period_label || ''),
      normalizeTime(row.start_time || ''),
      normalizeTime(row.end_time || '')
    ].join('|');
  }

  function groupByPeriod(rows, keyFn) {
    const map = new Map();
    (rows || []).forEach(row => {
      const key = keyFn(row);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return map;
  }

  function sortSessions(sessions) {
    return [...(sessions || [])].sort((a, b) => {
      const ap = Number(a.period_order || a.source_rows?.[0]?.period_order || 0);
      const bp = Number(b.period_order || b.source_rows?.[0]?.period_order || 0);
      if (ap !== bp) return ap - bp;
      const ai = Math.min(...(a.source_rows || []).map(row => Number(row.source_index ?? row.column_index ?? 9999)).filter(Number.isFinite));
      const bi = Math.min(...(b.source_rows || []).map(row => Number(row.source_index ?? row.column_index ?? 9999)).filter(Number.isFinite));
      if (ai !== bi) return ai - bi;
      return normalizeKey(a.material || a.class_name || '').localeCompare(normalizeKey(b.material || b.class_name || ''), 'ko');
    });
  }

  function sortTruth(rows) {
    return [...(rows || [])].sort((a, b) => {
      if (Number(a.period_order) !== Number(b.period_order)) return Number(a.period_order) - Number(b.period_order);
      return Number(a.excel_order || 0) - Number(b.excel_order || 0);
    });
  }

  function getCurrentSessions(rows) {
    if (window.EieTimetableView && typeof window.EieTimetableView._buildDisplaySessions === 'function') {
      return window.EieTimetableView._buildDisplaySessions(rows);
    }
    return rows.map((row, index) => ({
      session_id: row.id || row.cell_id || `row_${index}`,
      period_order: row.period_order,
      period_label: row.period_label,
      start_time: row.start_time,
      end_time: row.end_time,
      material: row.material_text || row.material || getRawMeta(row).material_text || row.class_name_raw || row.class_name || row.name || '',
      source_cell_ids: [row.id || row.cell_id].filter(Boolean),
      source_rows: [row]
    }));
  }

  function buildMappings(sessions, truthRows) {
    const sessionPeriods = groupByPeriod(sessions, session => periodKeyFromRow(session.source_rows?.[0] || session));
    const truthPeriods = groupByPeriod(truthRows, periodKeyFromTruth);
    const mappings = [];
    const warnings = [];
    let hardMismatch = false;

    const allKeys = Array.from(new Set([...sessionPeriods.keys(), ...truthPeriods.keys()])).sort();
    allKeys.forEach(key => {
      const sessionGroup = sortSessions(sessionPeriods.get(key) || []);
      const truthGroup = sortTruth(truthPeriods.get(key) || []);
      if (sessionGroup.length !== truthGroup.length) {
        hardMismatch = true;
        warnings.push(`援먯떆/?쒓컙 ${key}: ?꾩옱 移대뱶 ${sessionGroup.length}媛? ?묒? 湲곗? ${truthGroup.length}媛?);
      }
      const count = Math.min(sessionGroup.length, truthGroup.length);
      for (let index = 0; index < count; index += 1) {
        mappings.push({ session: sessionGroup[index], truth: truthGroup[index], period_key: key, index });
      }
    });

    return { mappings, warnings, hardMismatch };
  }

  function dayTeachersObject(truth) {
    const result = {};
    DAY_ORDER.forEach(day => {
      const value = truth?.day_teachers?.[day] || [];
      result[day] = Array.isArray(value) ? value.map(normalizeKey).filter(Boolean) : [];
    });
    return result;
  }

  function rawMetaWithTruth(row, truth) {
    const meta = getRawMeta(row);
    const dayTeachers = dayTeachersObject(truth);
    return {
      ...meta,
      material_text: truth.material_text,
      class_text: truth.material_text,
      day_teachers: dayTeachers,
      teacher_names_by_day: dayTeachers,
      // ?곷떒 ?댁엫 ?댁? ?좎??쒕떎. homeroom_teacher???덈줈 ?곗? ?딅뒗??
      excel_truth: {
        source: '?곸뼱26.04 (1).xlsx',
        sheet: '26.04',
        header_text: truth.header_text,
        header_row: truth.excel_header_row,
        header_col: truth.excel_col,
        period_label: truth.period_label,
        start_time: truth.start_time,
        end_time: truth.end_time,
        applied_at: new Date().toISOString(),
        scope: 'material_text_and_weekday_teachers_only'
      }
    };
  }

  function payloadForRow(row, truth) {
    return {
      class_name_raw: truth.material_text,
      material_text: truth.material_text,
      material: truth.material_text,
      raw_meta_json: rawMetaWithTruth(row, truth)
      // teacher_names / teacher_name_raw ??intentionally ?쒖쇅?쒕떎.
      // ?곷떒 ?댁엫 ?닿낵 湲곗〈 row ?대떦 ?뺣낫??諛붽씀吏 ?딅뒗??
    };
  }

  if (!window.EieApi?.getTimetable || !window.EieApi?.updateTimetableCell) {
    throw new Error('EieApi.getTimetable/updateTimetableCell??李얠쓣 ???놁뒿?덈떎. ?ㅼ젣 EIE ?쒓컙???붾㈃?먯꽌 ?ㅽ뻾??二쇱꽭??');
  }

  const result = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
  const rows = asRows(result);
  const sessions = getCurrentSessions(rows);
  const { mappings, warnings, hardMismatch } = buildMappings(sessions, XLSX_TRUTH_CARDS);

  const preview = mappings.map((item, index) => ({
    no: index + 1,
    period: item.truth.period_label,
    time: `${item.truth.start_time}~${item.truth.end_time}`,
    current_material: item.session.material || item.session.class_name || item.session.class_full_name || '',
    xlsx_header: item.truth.header_text,
    xlsx_material: item.truth.material_text,
    mon: (item.truth.day_teachers?.??|| []).join(', '),
    tue: (item.truth.day_teachers?.??|| []).join(', '),
    wed: (item.truth.day_teachers?.??|| []).join(', '),
    thu: (item.truth.day_teachers?.紐?|| []).join(', '),
    fri: (item.truth.day_teachers?.湲?|| []).join(', '),
    cell_count: (item.session.source_rows || []).length
  }));

  console.table(preview);
  if (warnings.length) console.warn('留ㅼ묶 寃쎄퀬:', warnings);

  if (hardMismatch) {
    alert('?꾩옱 ?쒓컙??移대뱶 ?섏? ?곸뼱26.04 ?묒? 湲곗? 移대뱶 ?섍? 留욎? ?딆븘 ??μ쓣 以묐떒?⑸땲?? Console??留ㅼ묶 寃쎄퀬瑜??뺤씤??二쇱꽭??');
    return;
  }

  const ok = window.confirm(`?곸뼱26.04 ?묒? 湲곗? 援먯옱紐낃낵 ?붿씪蹂??대떦留?${mappings.length}媛?移대뱶??諛섏쁺?⑸땲??
??????紐?湲??쒓린???묒? 癒몃━湲???붿닔湲??붾ぉ/?붾ぉ湲?洹쒖튃?쇰줈 ?쒗븳?덉뒿?덈떎.
?곷떒 ?댁엫 ?? ?숈깮 諛곗젙, 援먯떆/?쒓컙? 嫄대뱶由ъ? ?딆뒿?덈떎.
吏꾪뻾?좉퉴??`);
  if (!ok) {
    console.log('痍⑥냼?덉뒿?덈떎.');
    return;
  }

  const report = {
    started_at: new Date().toISOString(),
    source: '?곸뼱26.04 (1).xlsx / sheet 26.04',
    scope: 'material_text_and_weekday_teachers_only',
    warnings,
    total_mappings: mappings.length,
    updated_cells: [],
    failures: []
  };

  for (const item of mappings) {
    const sourceRows = Array.isArray(item.session.source_rows) ? item.session.source_rows : [];
    for (const row of sourceRows) {
      const rowId = normalizeKey(row?.id || row?.cell_id || '');
      if (!rowId) {
        report.failures.push({ truth: item.truth.header_text, reason: 'row id ?놁쓬' });
        continue;
      }
      try {
        await window.EieApi.updateTimetableCell(rowId, payloadForRow(row, item.truth));
        report.updated_cells.push({
          cell_id: rowId,
          header_text: item.truth.header_text,
          material_text: item.truth.material_text,
          day_teachers: item.truth.day_teachers
        });
      } catch (error) {
        report.failures.push({ cell_id: rowId, header_text: item.truth.header_text, error: error?.message || String(error) });
      }
    }
  }

  try {
    const refreshed = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
    const refreshedRows = asRows(refreshed);
    if (window.EieState?.setTimetableCells) window.EieState.setTimetableCells(refreshedRows);
    if (window.EieRouter?.open) window.EieRouter.open('timetable');
  } catch (error) {
    report.refresh_error = error?.message || String(error);
  }

  report.finished_at = new Date().toISOString();
  console.log('?곸뼱26.04 湲곗? 援먯옱紐??붿씪蹂??대떦 諛섏쁺 ?꾨즺:', report);
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `eie_xlsx_material_day_teachers_apply_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
})().catch(error => {
  console.error('?곸뼱26.04 湲곗? 援먯옱紐??붿씪蹂??대떦 諛섏쁺 ?ㅽ뙣:', error);
  alert(error?.message || String(error));
});
