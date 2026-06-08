const MONDAY = '2026-06-08';
const WEDNESDAY = '2026-06-10';
const SATURDAY = '2026-06-06';

const cells = [
  {
    id: 'cell_ivy_wed_lily',
    class_name_raw: 'Seungjae 5',
    day_label: '수',
    period_label: '4교시',
    period_order: 4,
    column_index: 6,
    teacher_name_raw: 'IVY',
    teacher_names: ['IVY'],
    homeroom_teacher: 'IVY',
    day_teachers: { 월: ['IVY'], 수: ['Lily'], 금: ['IVY'] },
    teacher_names_by_day: { 수: ['Lily'] },
    weekday_teachers: { wed: ['Lily'] },
    raw_meta_json: JSON.stringify({
      teacher_names: ['IVY'],
      homeroom_teacher: 'IVY',
      day_teachers: { 월: ['IVY'], 수: ['Lily'], 금: ['IVY'] },
      teacher_names_by_day: { 수: ['Lily'] },
      weekday_teachers: { wed: ['Lily'] }
    }),
    assigned_students: [
      {
        assignment_id: 'assign_alpha',
        student_id: 'student_alpha',
        display_name: 'Alpha',
        grade: '초5',
        teacher_names: ['Lily']
      }
    ]
  },
  {
    id: 'cell_stacy_raw_meta',
    class_name_raw: 'Raw Meta Stacy',
    day_label: '월',
    period_label: '2교시',
    period_order: 2,
    teacher_name_raw: '',
    raw_meta_json: JSON.stringify({
      homeroom_teacher: 'Zoe',
      day_teachers: { 월: ['Stacy'] },
      teacher_names_by_day: { 월: ['Stacy'] }
    }),
    assigned_students: []
  },
  {
    id: 'cell_malformed_raw',
    class_name_raw: 'Malformed Raw',
    day_label: '월',
    period_label: '3교시',
    period_order: 3,
    teacher_name_raw: 'Carmen',
    raw_meta_json: 'invalid{json',
    assigned_students: []
  },
  {
    id: 'cell_carmen_only',
    class_name_raw: 'Carmen Only',
    day_label: '화',
    period_label: '1교시',
    period_order: 1,
    teacher_name_raw: 'Carmen',
    homeroom_teacher: 'Carmen',
    raw_meta_json: JSON.stringify({
      homeroom_teacher: 'Carmen',
      day_teachers: { 화: ['Carmen'] }
    }),
    assigned_students: []
  }
];

const sessions = {
  owner: { teacherName: 'Owner', role: 'owner' },
  admin: { teacherName: 'admin', role: 'admin' },
  lily: { teacherName: 'Lily', role: 'teacher' },
  ivyVariant: { teacherName: ' ivy ', role: 'teacher' },
  stacy: { teacherName: 'Stacy', role: 'teacher' },
  carmen: { teacherName: 'Carmen', role: 'teacher' },
  zoe: { teacherName: 'Zoe', role: 'teacher' },
  noToday: { teacherName: 'Laura', role: 'teacher' }
};

module.exports = {
  MONDAY,
  WEDNESDAY,
  SATURDAY,
  cells,
  sessions
};
