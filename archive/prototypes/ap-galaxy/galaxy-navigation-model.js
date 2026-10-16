(function attachGalaxyNavigationModel(root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  if (root) root.APGalaxyNavigationModel = model;
})(typeof window === 'undefined' ? globalThis : window, function createGalaxyNavigationModel() {
  'use strict';

  const clean = (value) => String(value ?? '').normalize('NFC').trim();
  const MIDDLE_GRADES = ['중1', '중2', '중3'];
  const COMMON_COURSES = ['공통수학1', '공통수학2'];

  function displayCourseName(value) {
    const name = clean(value).replace(/\s+/g, ' ');
    // 2015/2022 aliases share one galaxy. Original exam metadata stays intact.
    const compact = name.normalize('NFKC').replace(/\s/g, '');
    const aliases = {
      '수학(상)': '공통수학1', '수학상': '공통수학1',
      '수학(하)': '공통수학2', '수학하': '공통수학2',
      '공통수학I': '공통수학1', '공통수학II': '공통수학2',
      '수학I': '대수', '수학1': '대수',
      '수학II': '미적분I', '수학2': '미적분I',
      '미적분I': '미적분I', '미적분1': '미적분I',
      '미적분': '미적분II', '미적분II': '미적분II', '미적분2': '미적분II',
      '기하': '기하와벡터', '기하와벡터': '기하와벡터',
      '확률과통계': '확률과 통계',
    };
    return aliases[compact] || name || '과정 미상';
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
