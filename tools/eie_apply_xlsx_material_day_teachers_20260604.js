// EIE 26.04 Excel 기준 교재명/요일별 담당만 반영하는 실행 스크립트 v18
// 기준 파일: 영어26.04 (1).xlsx / sheet: 26.04
// 실행 위치: 실제 EIE 시간표 화면 > DevTools Console
// 반영 대상: 교재명, 월/화/수/목/금 담당
// 절대 건드리지 않음: 상단 담임 열, 학생 배정, cell id, 교시/시간, 출결/숙제/상담

(async () => {
  const XLSX_TRUTH_CARDS = [
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "rs3-1 Carmen",
    "material_text": "rs3-1",
    "day_teachers": {
      "월": [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "fp3 zoe",
    "material_text": "fp3",
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
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "LE4 IVY",
    "material_text": "LE4",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [
        "IVY"
      ],
      "수": [
        "IVY"
      ],
      "목": [
        "IVY"
      ],
      "금": [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "phonic3 stacy",
    "material_text": "phonic3",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "STACY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "pl3 Lily",
    "material_text": "pl3",
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
        "Lily"
      ],
      "금": [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 1,
    "period_label": "1교시",
    "start_time": "15:10",
    "end_time": "15:50",
    "excel_header_row": 2,
    "excel_col": 14,
    "excel_order": 6,
    "header_text": "LT1 IVY",
    "material_text": "LT1",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [
        "IVY"
      ],
      "수": [
        "IVY"
      ],
      "목": [
        "IVY"
      ],
      "금": [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "pj3  ivy",
    "material_text": "pj3",
    "day_teachers": {
      "월": [
        "IVY"
      ],
      "화": [
        "IVY"
      ],
      "수": [
        "IVY"
      ],
      "목": [
        "IVY"
      ],
      "금": [
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "rs3-2Carmen",
    "material_text": "rs3-2",
    "day_teachers": {
      "월": [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "phonics1 Lily",
    "material_text": "phonics1",
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
        "Lily"
      ],
      "금": [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "초문법 Lily",
    "material_text": "초문법",
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
        "Lily"
      ],
      "금": [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "fp3 stacy",
    "material_text": "fp3",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "STACY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 2,
    "period_label": "2교시",
    "start_time": "15:50",
    "end_time": "16:30",
    "excel_header_row": 13,
    "excel_col": 12,
    "excel_order": 6,
    "header_text": "rth3 zoe",
    "material_text": "rth3",
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
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "5일 예비중 Carmen",
    "material_text": "5일 예비중",
    "day_teachers": {
      "월": [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "5일 stacy",
    "material_text": "5일",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "STACY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "2IVY3일반월수금",
    "material_text": "2/3일반",
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
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "Lily 3일반",
    "material_text": "3일반",
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
        "Lily"
      ],
      "금": [
        "Lily"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 3,
    "period_label": "3교시",
    "start_time": "16:30",
    "end_time": "17:10",
    "excel_header_row": 24,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "LT5 zoe",
    "material_text": "LT5",
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
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "중2-3 화목stacy",
    "material_text": "중2-3",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "STACY"
      ],
      "금": []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "중1-3 zoe화목금",
    "material_text": "중1-3",
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
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "중1-2 ivy월수",
    "material_text": "중1-2",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "예비중(중등교재)stacy",
    "material_text": "예비중(중등교재)",
    "day_teachers": {
      "월": [
        "STACY"
      ],
      "화": [
        "STACY"
      ],
      "수": [
        "STACY"
      ],
      "목": [
        "STACY"
      ],
      "금": [
        "STACY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 4,
    "period_label": "4교시",
    "start_time": "17:10",
    "end_time": "17:50",
    "excel_header_row": 35,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "4일 예비중 Carmen",
    "material_text": "4일 예비중",
    "day_teachers": {
      "월": [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "중2-3 화목 stacy",
    "material_text": "중2-3",
    "day_teachers": {
      "월": [],
      "화": [
        "STACY"
      ],
      "수": [],
      "목": [
        "STACY"
      ],
      "금": []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "중1-4 Carmen",
    "material_text": "중1-4",
    "day_teachers": {
      "월": [
        "Carmen"
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 5,
    "period_label": "5교시",
    "start_time": "17:50",
    "end_time": "18:30",
    "excel_header_row": 47,
    "excel_col": 10,
    "excel_order": 3,
    "header_text": "중1-1 Laura",
    "material_text": "중1-1",
    "day_teachers": {
      "월": [
        "Laura"
      ],
      "화": [
        "Laura"
      ],
      "수": [
        "Laura"
      ],
      "목": [
        "Laura"
      ],
      "금": [
        "Laura"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 2,
    "excel_order": 1,
    "header_text": "중2-4IVY(화)",
    "material_text": "중2-4",
    "day_teachers": {
      "월": [],
      "화": [
        "IVY"
      ],
      "수": [],
      "목": [],
      "금": []
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 4,
    "excel_order": 2,
    "header_text": "zoe2-1 월수금",
    "material_text": "2-1",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 6,
    "excel_order": 3,
    "header_text": "중2-2 월수금IVY",
    "material_text": "중2-2",
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
        "IVY"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 8,
    "excel_order": 4,
    "header_text": "중3-1월수금stacy",
    "material_text": "중3-1",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 10,
    "excel_order": 5,
    "header_text": "3-2zoe",
    "material_text": "3-2",
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
        "Zoe"
      ],
      "금": [
        "Zoe"
      ]
    },
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  },
  {
    "period_order": 6,
    "period_label": "6교시",
    "start_time": "18:30",
    "end_time": "19:15",
    "excel_header_row": 58,
    "excel_col": 12,
    "excel_order": 6,
    "header_text": "중1-5화목금stacy",
    "material_text": "중1-5",
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
    "parse_rule": "header_teacher_applies_only_to_header_weekdays"
  }
];
  const DAY_ORDER = ['월', '화', '수', '목', '금'];

  function normalizeKey(value) {
    return String(value == null ? '' : value).trim();
  }

  function normalizeTime(value) {
    const raw = normalizeKey(value);
    if (!raw) return '';
    const match = raw.match(/(\d{1,2})[:시]\s*(\d{1,2})?/);
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
    if (window.EieTimetableV2View && typeof window.EieTimetableV2View._buildDisplaySessions === 'function') {
      return window.EieTimetableV2View._buildDisplaySessions(rows);
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
        warnings.push(`교시/시간 ${key}: 현재 카드 ${sessionGroup.length}개, 엑셀 기준 ${truthGroup.length}개`);
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
      // 상단 담임 열은 유지한다. homeroom_teacher는 새로 쓰지 않는다.
      excel_truth: {
        source: '영어26.04 (1).xlsx',
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
      // teacher_names / teacher_name_raw 는 intentionally 제외한다.
      // 상단 담임 열과 기존 row 담당 정보는 바꾸지 않는다.
    };
  }

  if (!window.EieApi?.getTimetable || !window.EieApi?.updateTimetableCell) {
    throw new Error('EieApi.getTimetable/updateTimetableCell을 찾을 수 없습니다. 실제 EIE 시간표 화면에서 실행해 주세요.');
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
    mon: (item.truth.day_teachers?.월 || []).join(', '),
    tue: (item.truth.day_teachers?.화 || []).join(', '),
    wed: (item.truth.day_teachers?.수 || []).join(', '),
    thu: (item.truth.day_teachers?.목 || []).join(', '),
    fri: (item.truth.day_teachers?.금 || []).join(', '),
    cell_count: (item.session.source_rows || []).length
  }));

  console.table(preview);
  if (warnings.length) console.warn('매칭 경고:', warnings);

  if (hardMismatch) {
    alert('현재 시간표 카드 수와 영어26.04 엑셀 기준 카드 수가 맞지 않아 저장을 중단합니다. Console의 매칭 경고를 확인해 주세요.');
    return;
  }

  const ok = window.confirm(`영어26.04 엑셀 기준 교재명과 요일별 담당만 ${mappings.length}개 카드에 반영합니다.
월/화/수/목/금 표기는 엑셀 머리글의 월수금/화목/화목금 규칙으로 제한했습니다.
상단 담임 열, 학생 배정, 교시/시간은 건드리지 않습니다.
진행할까요?`);
  if (!ok) {
    console.log('취소했습니다.');
    return;
  }

  const report = {
    started_at: new Date().toISOString(),
    source: '영어26.04 (1).xlsx / sheet 26.04',
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
        report.failures.push({ truth: item.truth.header_text, reason: 'row id 없음' });
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
    if (window.EieRouter?.open) window.EieRouter.open('timetable-v2');
  } catch (error) {
    report.refresh_error = error?.message || String(error);
  }

  report.finished_at = new Date().toISOString();
  console.log('영어26.04 기준 교재명/요일별 담당 반영 완료:', report);
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `eie_xlsx_material_day_teachers_apply_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
})().catch(error => {
  console.error('영어26.04 기준 교재명/요일별 담당 반영 실패:', error);
  alert(error?.message || String(error));
});
