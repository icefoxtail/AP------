// EIE 2026 PDF material/day-teacher apply script v13
// ASCII-safe source: Korean text is encoded as Unicode escapes to avoid Console clipboard encoding errors.
// Run location: logged-in EIE timetable page DevTools Console.
// Scope: update material_text/material/raw_meta_json day teachers only. Student assignments are not touched.

(async () => {
  const PDF_TRUTH_ROWS = [
  {
    "truth_row": 1,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RS2-1 \uc218\uc544 (Carmen)",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\uc6d4": "Carmen",
      "\ud654": "Carmen",
      "\uc218": "Foreigner",
      "\ubaa9": "Zoe",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 2,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "LE3 IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\ud654": "STACY",
      "\uc218": "IVY",
      "\ubaa9": "STACY",
      "\uae08": "IVY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 3,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "PHONIC2 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\ud654": "Foreigner",
      "\uc218": "STACY",
      "\ubaa9": "\uc8fc4\uc77c \ud30c\ub2c9\uc2a4",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 4,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "RT 1 IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "Foreigner",
      "\ud654": "IVY",
      "\uc218": "Carmen",
      "\ubaa9": "IVY",
      "\uae08": "Carmen"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 5,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "FP2 Zoe",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\ud654": "Zoe",
      "\uc218": "Zoe",
      "\ubaa9": "Carmen",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 6,
    "page": 1,
    "period_order": 1,
    "period_label": "1\uad50\uc2dc",
    "start_time": "15:10",
    "end_time": "15:50",
    "material_text": "Lily PL2",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "\uc6d4": "Lily",
      "\ud654": "Lily",
      "\uc218": "Lily",
      "\ubaa9": "Foreigner",
      "\uae08": "Lily"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 7,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PHONIC1Lily",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "\uc6d4": "Lily",
      "\ud654": "Lily",
      "\uc218": "Foreigner",
      "\ubaa9": "\uc8fc4\uc77c \ud30c\ub2c9\uc2a4",
      "\uae08": "Lily"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 8,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "PJ2 \uc9c0\uc6d0,\uc8fc\ud558Ivy",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\ud654": "IVY",
      "\uc218": "Zoe",
      "\ubaa9": "IVY",
      "\uae08": "IVY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 9,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "\ucd08 5,6",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\uc6d4": "Carmen",
      "\uc218": "Lily",
      "\uae08": "Carmen"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 10,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "(Car) RS2-2",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\uc6d4": "Foreigner",
      "\ud654": "Carmen",
      "\uc218": "Carmen",
      "\ubaa9": "Carmen",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 11,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "FP2 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\ud654": "Foreigner",
      "\uc218": "IVY",
      "\ubaa9": "STACY",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 12,
    "page": 1,
    "period_order": 2,
    "period_label": "2\uad50\uc2dc",
    "start_time": "15:50",
    "end_time": "16:30",
    "material_text": "RTH 2 Zoe",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\ud654": "Zoe",
      "\uc218": "STACY",
      "\ubaa9": "Zoe",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 13,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "RS4 \ub3c4\uc6d0 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\ud654": "STACY",
      "\uc218": "Zoe",
      "\ubaa9": "Foreigner",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 14,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "LT4 ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\ud654": "Foreigner",
      "\uc218": "Foreigner",
      "\ubaa9": "Zoe",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 15,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "\ud604\uc6b05 \ud654\ubaa9\uae08IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\ud654": "Lily",
      "\ubaa9": "Lily",
      "\uae08": "IVY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 16,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "\uc2b9\uc7ac5 \uc6d4\uc218\uae08IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\uc218": "IVY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 17,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "CH5,6Lily",
    "homeroom_teacher": "Lily",
    "day_teachers": {
      "\uc6d4": "Lily",
      "\uc218": "Lily",
      "\uae08": "Lily"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 18,
    "page": 1,
    "period_order": 3,
    "period_label": "3\uad50\uc2dc",
    "start_time": "16:30",
    "end_time": "17:10",
    "material_text": "JA 2-2 \ud55c\uac00\ub78c (Carmen)",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\uc6d4": "Foreigner",
      "\ud654": "Carmen",
      "\uc218": "Carmen",
      "\ubaa9": "Carmen",
      "\uae08": "Carmen"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 19,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\ud604\uc6b05 \ud654\ubaa9\uae08IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\ud654": "Lily",
      "\ubaa9": "Lily",
      "\uae08": "PREP"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 20,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc2b9\uc7ac5 \uc6d4\uc218\uae08IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\uc218": "Lily",
      "\uae08": "IVY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 21,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "LE 6 (Carmen)",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\uc6d4": "Carmen",
      "\ud654": "Foreigner",
      "\uc218": "Carmen",
      "\ubaa9": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 22,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc900\uc11c 6 STACY \uc6d4\uc218\uae08",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "Foreigner",
      "\uc218": "STACY",
      "\uae08": "Lily"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 23,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc9111 \uc724\uc7ac ZOE \ud654\ubaa9\uae08",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\ud654": "Zoe",
      "\ubaa9": "Foreigner",
      "\uae08": "PREP"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 24,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc9112(\uc2dc\uc740) \ud654\ubaa9\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\ud654": "STACY",
      "\ubaa9": "IVY",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 25,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc9111 \ud574\uc728/\ucc44\uc6d0 IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "Lily",
      "\uc218": "IVY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 26,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\ubbfc\ucc44A4 (Carmen)",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\ud654": "STACY",
      "\ubaa9": "Carmen",
      "\uae08": "Carmen"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 27,
    "page": 2,
    "period_order": 4,
    "period_label": "4\uad50\uc2dc",
    "start_time": "17:10",
    "end_time": "17:50",
    "material_text": "\uc9111 \uc608\ube48 ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\uc218": "Foreigner",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 28,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc9111 \uc608\ube48 ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Lily",
      "\uc218": "Zoe",
      "\uae08": "PREP"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 29,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc9111C (Carmen)",
    "homeroom_teacher": "Carmen",
    "day_teachers": {
      "\ud654": "Carmen",
      "\ubaa9": "Foreigner",
      "\uae08": "Carmen"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 30,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc9112(\uc2dc\uc740) \ud654\ubaa9\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\ud654": "STACY",
      "\ubaa9": "STACY",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 31,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc608\ube44\uc911A2 \ud574\uc728/\ucc44\uc6d0 IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "Carmen",
      "\uc218": "IVY",
      "\uae08": "IVY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 32,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc724\uc7ac \uc9111-6 Zoe \ud654\ubaa9\uae08",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\ud654": "Zoe",
      "\ubaa9": "Lily",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 33,
    "page": 2,
    "period_order": 5,
    "period_label": "5\uad50\uc2dc",
    "start_time": "17:50",
    "end_time": "18:30",
    "material_text": "\uc900\uc11c6 /STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\uc218": "STACY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 34,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9113A(\ucc28\uc218\ube48) \ud654\ubaa9\uae08 ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\ud654": "Zoe",
      "\ubaa9": "Zoe",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 35,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9112-1(\ub098\uc740\ubc18) IVY \ud654\ubaa9\uae08",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\ud654": "IVY",
      "\ubaa9": "IVY",
      "\uae08": "IVY \uc9112 1+2 READING"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 36,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9112A\ubbfc\ud558 (\uc6d4\uc218\uae08) ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\uc218": "Foreigner",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 37,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9112-2(\ud615\uc6b0) \uc6d4\uc218\uae08 IVY",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\uc218": "IVY",
      "\uae08": "\ud569\ubc18"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 38,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9111BB \ud654\ubaa9\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\ud654": "STACY",
      "\ubaa9": "STACY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 39,
    "page": 3,
    "period_order": 6,
    "period_label": "6\uad50\uc2dc",
    "start_time": "18:30",
    "end_time": "19:15",
    "material_text": "\uc9113B(\uc815\uc218\ubbfc) \uc6d4\uc218\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\uc218": "STACY",
      "\uae08": "\ud569\ubc18"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 40,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9113A(\ucc28\uc218\ube48) \ud654\ubaa9\uae08 ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\ud654": "Zoe",
      "\ubaa9": "Zoe",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 41,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9112A\ubbfc\ud558 (\uc6d4\uc218\uae08) ZOE",
    "homeroom_teacher": "Zoe",
    "day_teachers": {
      "\uc6d4": "Zoe",
      "\uc218": "Zoe",
      "\uae08": "Zoe"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 42,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9111 BB \ud654\ubaa9\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\ud654": "STACY",
      "\ubaa9": "STACY",
      "\uae08": "Lily"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 43,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9113(\uc815\uc218\ubbfc) \uc6d4\uc218\uae08 STACY",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "STACY",
      "\uc218": "STACY",
      "\uae08": "STACY"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 44,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9112(\ud615\uc6b0) \uc6d4\uc218\uae08 Stacy",
    "homeroom_teacher": "STACY",
    "day_teachers": {
      "\uc6d4": "IVY",
      "\uc218": "IVY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 45,
    "page": 3,
    "period_order": 7,
    "period_label": "7\uad50\uc2dc",
    "start_time": "19:15",
    "end_time": "20:00",
    "material_text": "\uc9112 \ub098\uc740\uc774\ubc18",
    "homeroom_teacher": "IVY",
    "day_teachers": {
      "\ud654": "IVY",
      "\ubaa9": "IVY",
      "\uae08": "Foreigner"
    },
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  },
  {
    "truth_row": 46,
    "page": 3,
    "period_order": 8,
    "period_label": "8\uad50\uc2dc",
    "start_time": "20:00",
    "end_time": "20:45",
    "material_text": "\ub2e8\uc5b4 \ud074\ub9ac\ub2c9",
    "homeroom_teacher": "",
    "day_teachers": {},
    "source": "26\ub144\uc601\uc5b4\uac15\uc0ac\uc2dc\uac04\ud45c.pdf"
  }
];
  const DAY_ORDER = ["\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08"];

  function normalizeKey(value) {
    return String(value == null ? '' : value).trim();
  }

  function normalizeTime(value) {
    const raw = normalizeKey(value);
    if (!raw) return '';
    const match = raw.match(/(\d{1,2})[:\uC2DC]\s*(\d{1,2})?/);
    if (!match) return raw;
    const hour = Number(match[1]);
    const minute = Number(match[2] || 0);
    if (!Number.isFinite(hour) || !Number.isFinite(minute)) return raw;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function normalizeMatchTime(value) {
    const text = normalizeTime(value);
    const match = text.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return text;
    let hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour >= 13) hour -= 12;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  function normalizeDay(value) {
    const raw = normalizeKey(value).replace(/\uC694\uC77C/g, '').trim();
    return DAY_ORDER.find(day => raw.includes(day)) || '';
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

  function splitTeacherValue(value) {
    const text = normalizeKey(value);
    if (!text) return [];
    return Array.from(new Set(text.split(/[,+/]/).map(item => normalizeKey(item)).filter(Boolean)));
  }

  function truthDayTeachersForPatch(dayTeachers) {
    const result = {};
    DAY_ORDER.forEach(day => {
      const value = normalizeKey(dayTeachers?.[day] || '');
      result[day] = value ? splitTeacherValue(value) : [];
    });
    return result;
  }

  function periodKeyFromRow(row) {
    return [
      Number.isFinite(Number(row?.period_order)) ? Number(row.period_order) : '',
      normalizeKey(row?.period_label || row?.period || ''),
      normalizeMatchTime(row?.start_time || row?.start || row?.from_time || ''),
      normalizeMatchTime(row?.end_time || row?.end || row?.to_time || '')
    ].join('|');
  }

  function periodKeyFromTruth(row) {
    return [
      Number(row.period_order || 0),
      normalizeKey(row.period_label || ''),
      normalizeMatchTime(row.start_time || ''),
      normalizeMatchTime(row.end_time || '')
    ].join('|');
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
      return Number(a.truth_row || 0) - Number(b.truth_row || 0);
    });
  }

  function groupByPeriod(rows, keyFn) {
    const map = new Map();
    rows.forEach(row => {
      const key = keyFn(row);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    });
    return map;
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
      material: row.material_text || row.material || row.class_name_raw || row.class_name || row.name || '',
      source_cell_ids: [row.id || row.cell_id].filter(Boolean),
      source_rows: [row]
    }));
  }

  function buildMappings(sessions, truthRows) {
    const sessionPeriods = groupByPeriod(sessions, session => periodKeyFromRow(session.source_rows?.[0] || session));
    const truthPeriods = groupByPeriod(truthRows, periodKeyFromTruth);
    const mappings = [];
    const warnings = [];

    const allKeys = Array.from(new Set([...sessionPeriods.keys(), ...truthPeriods.keys()])).sort();
    allKeys.forEach(key => {
      const sessionGroup = sortSessions(sessionPeriods.get(key) || []);
      const truthGroup = sortTruth(truthPeriods.get(key) || []);
      if (sessionGroup.length !== truthGroup.length) {
        warnings.push(`\uAE30\uAC04/\uAD50\uC2DC ${key}: \uD604\uC7AC \uCE74\uB4DC ${sessionGroup.length}\uAC1C, PDF \uC815\uB2F5 ${truthGroup.length}\uAC1C`);
      }
      const count = Math.min(sessionGroup.length, truthGroup.length);
      for (let index = 0; index < count; index += 1) {
        mappings.push({ session: sessionGroup[index], truth: truthGroup[index], period_key: key, index });
      }
    });
    return { mappings, warnings };
  }

  function rawMetaWithTruth(row, truth, dayTeachers) {
    const meta = getRawMeta(row);
    return {
      ...meta,
      material_text: truth.material_text,
      class_text: truth.material_text,
      homeroom_teacher: truth.homeroom_teacher || meta.homeroom_teacher || '',
      day_teachers: dayTeachers,
      teacher_names_by_day: dayTeachers,
      pdf_truth: {
        source: truth.source,
        page: truth.page,
        truth_row: truth.truth_row,
        period_label: truth.period_label,
        start_time: truth.start_time,
        end_time: truth.end_time,
        applied_at: new Date().toISOString()
      }
    };
  }

  function payloadForRow(row, truth) {
    const day = normalizeDay(row?.day || row?.day_label || row?.day_of_week || '');
    const dayTeachers = truthDayTeachersForPatch(truth.day_teachers);
    const isWeekdayRow = DAY_ORDER.includes(day);
    const teachers = isWeekdayRow ? (dayTeachers[day] || []) : (truth.homeroom_teacher ? [truth.homeroom_teacher] : []);
    return {
      class_name_raw: truth.material_text,
      material_text: truth.material_text,
      material: truth.material_text,
      teacher_names: teachers,
      teacher_name_raw: teachers.join(', '),
      raw_meta_json: rawMetaWithTruth(row, truth, dayTeachers)
    };
  }

  if (!window.EieApi?.getTimetable || !window.EieApi?.updateTimetableCell) {
    throw new Error('EieApi.getTimetable/updateTimetableCell을 찾을 수 없습니다. EIE 시간표 화면에서 실행해 주세요.');
  }

  const result = await window.EieApi.getTimetable(null, { status: 'active,imported,needs_review,hidden' });
  const rows = asRows(result);
  const sessions = getCurrentSessions(rows);
  const { mappings, warnings } = buildMappings(sessions, PDF_TRUTH_ROWS);

  const preview = mappings.map((item, index) => ({
    no: index + 1,
    period: item.truth.period_label,
    time: `${item.truth.start_time}~${item.truth.end_time}`,
    current: item.session.material || item.session.class_name || item.session.class_full_name || '',
    pdf_material: item.truth.material_text,
    homeroom: item.truth.homeroom_teacher || '',
    mon: item.truth.day_teachers['\uC6D4'] || '',
    tue: item.truth.day_teachers['\uD654'] || '',
    wed: item.truth.day_teachers['\uC218'] || '',
    thu: item.truth.day_teachers['\uBAA9'] || '',
    fri: item.truth.day_teachers['\uAE08'] || '',
    cell_count: (item.session.source_rows || []).length
  }));
  console.table(preview);
  if (warnings.length) console.warn('매칭 경고:', warnings);
  if (!mappings.length) {
    alert('PDF 기준으로 매칭된 카드가 0개입니다. 저장하지 않았습니다.');
    return;
  }

  const ok = window.confirm(`PDF 기준 교재명/요일별 담임을 ${mappings.length}개 카드에 반영합니다.\n학생 배정은 건드리지 않습니다.\n진행할까요?`);
  if (!ok) {
    console.log('취소되었습니다.');
    return;
  }

  const report = {
    started_at: new Date().toISOString(),
    source: '26년영어강사시간표.pdf',
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
        report.failures.push({ truth_row: item.truth.truth_row, reason: 'row id 없음' });
        continue;
      }
      try {
        await window.EieApi.updateTimetableCell(rowId, payloadForRow(row, item.truth));
        report.updated_cells.push({
          cell_id: rowId,
          truth_row: item.truth.truth_row,
          material_text: item.truth.material_text,
          homeroom_teacher: item.truth.homeroom_teacher,
          day_teachers: item.truth.day_teachers
        });
      } catch (error) {
        report.failures.push({ cell_id: rowId, truth_row: item.truth.truth_row, error: error?.message || String(error) });
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
  console.log('PDF 기준 교재/요일별 담임 반영 완료:', report);
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `eie_pdf_material_teacher_apply_report_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
})().catch(error => {
  console.error('PDF 기준 교재/요일별 담임 반영 실패:', error);
  alert(error?.message || String(error));
});
