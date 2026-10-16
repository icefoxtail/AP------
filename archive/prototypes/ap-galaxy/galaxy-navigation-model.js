(function attachGalaxyNavigationModel(root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  if (root) root.APGalaxyNavigationModel = model;
})(typeof window === 'undefined' ? globalThis : window, function createGalaxyNavigationModel() {
  'use strict';

  const clean = (value) => String(value ?? '').normalize('NFC').trim();
  const MIDDLE_GRADES = ['중1', '중2', '중3'];
  const COMMON_COURSES = ['공통수학1', '공통수학2'];

  // One course galaxy across 2015/2022 curricula; preserve original exam fields.
  // Unmapped/changed topics keep their own labels rather than being silently discarded.
  function displayCourseName(value) {
    const name = clean(value).replace(/\s+/g, ' ');
    const compact = name.replace(/\s/g, '').replace(/Ⅰ/g, 'I').replace(/Ⅱ/g, 'II').replace(/Ⅲ/g, 'III');
    if (compact === '수학(상)' || compact === '수학상') return '공통수학1';
    if (compact === '수학(하)' || compact === '수학하') return '공통수학2';
    if (compact === '기하' || compact === '기하와벡터') return '기하와벡터';
    if (compact === '수학I' || compact === '수학1' || compact === '대수') return '대수';
    if (compact === '수학II' || compact === '수학2' || compact === '미적분I' || compact === '미적분1') return '미적분I';
    if (compact === '미적분' || compact === '미적분II' || compact === '미적분2') return '미적분II';
    if (compact === '공통수학I') return '공통수학1';
    if (compact === '공통수학II') return '공통수학2';
    if (compact === '확률과통계') return '확률과 통계';
    return name || '과정 미상';
  }

  function curriculumGroupForExam(exam) {
    const grade = clean(exam?.grade) || '학년 미상';
    if (/^중[123]$/.test(grade)) {
      return { id: 'curriculum:middle:' + grade, name: grade + ' 은하', order: Number(grade.slice(1)) };
    }
    const sourceCourse = exam?.primaryStandardCourse || exam?.courseRanges?.[0]?.standardCourse || exam?.subject;
    const name = displayCourseName(sourceCourse);
    return { id: 'curriculum:high:' + name, name, order: 10 };
  }

  function buildNavigationSections(exams) {
    const countsById = new Map();
    const high2CountsById = new Map();
    const namesById = new Map();
    for (const exam of exams || []) {
      const group = curriculumGroupForExam(exam);
      namesById.set(group.id, group.name);
      countsById.set(group.id, (countsById.get(group.id) || 0) + 1);
      if (clean(exam.grade) === '고2') high2CountsById.set(group.id, (high2CountsById.get(group.id) || 0) + 1);
    }

    const middle = MIDDLE_GRADES.map((grade) => ({
      id: 'curriculum:middle:' + grade,
      name: grade,
      count: countsById.get('curriculum:middle:' + grade) || 0,
    }));
    const common = COMMON_COURSES.map((name) => ({
      id: 'curriculum:high:' + name,
      name,
      count: countsById.get('curriculum:high:' + name) || 0,
    }));
    const coreIds = new Set([...middle, ...common].map((item) => item.id));
    const high2 = [...high2CountsById.entries()]
      .filter(([id]) => !coreIds.has(id))
      .map(([id, count]) => ({ id, name: namesById.get(id) || id.slice('curriculum:high:'.length), count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ko'));

    return [
      { id: 'middle', label: '중등 학년', items: middle },
      { id: 'common', label: '공통수학', items: common },
      { id: 'high2', label: '고2 과목', items: high2 },
    ];
  }

  return Object.freeze({ displayCourseName, curriculumGroupForExam, buildNavigationSections });
});
