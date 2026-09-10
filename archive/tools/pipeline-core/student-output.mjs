import fs from 'node:fs';

// Inspect evaluated JS strings: a source-level backslash count cannot prove
// that the student receives a LaTeX command after JavaScript unescaping.
export function validateStudentSerialization(question) {
  const errors = [];
  for (const [field, value] of Object.entries({ content: question?.content, solution: question?.solution, answer: question?.answer, ...(Array.isArray(question?.choices) ? question.choices : []).reduce((a, v, i) => ({ ...a, [`choice${i}`]: v }), {}) })) {
    if (typeof value !== 'string') continue;
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) errors.push(`LATEX_CONTROL_CHARACTER:${field}`);
    const math = value.match(/\$\$[\s\S]*?\$\$|\$[^$]*\$|\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]/g) || [];
    for (const span of math) {
      // Protect textual math annotations, including legitimate English words.
      const stripped = span.replace(/\\(?:text|mathrm|operatorname)\{[^{}]*\}/g, '');
      if (/(?<![\\A-Za-z])(?:ge|le|cdots|cdot)(?![A-Za-z])/.test(stripped)) errors.push(`LATEX_COMMAND_ESCAPE_LOST:${field}`);
    }
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors: [...new Set(errors)] };
}

const courses = { 'H15-SA': ['수학(상)'], 'H15-SB': ['수학(하)'], 'H15-M1': ['수학I', '수학Ⅰ', '수학1'], 'H15-M2': ['수학II', '수학Ⅱ', '수학2'], 'H15-CALC': ['미적분'], 'H15-PS': ['확률과통계'], 'H15-GV': ['기하와벡터', '기하'], 'H22-C': ['공통수학1'], 'H22-C2': ['공통수학2'], 'H22-A': ['대수'], 'H22-M1': ['미적분I', '미적분Ⅰ', '미적분1'], 'H22-M2': ['미적분II', '미적분Ⅱ', '미적분2'], 'H22-PS': ['확률과통계'], 'H22-GE': ['기하'] };
const master = JSON.parse(fs.readFileSync(new URL('../../data/master_tables/js_archive_tag_master.json', import.meta.url), 'utf8'));
export function validateCurriculumBinding(question, { source = {}, examId = '' } = {}) {
  const errors = [], unit = question?.standardUnitKey || '', sub = question?.subUnitKey;
  const identity = String(examId).match(/^(\d{2}|\d{4})_.*_고([123])(?:_|$)/);
  const family = unit.match(/^(H(?:15|22)-[^-]+)-/)?.[1];
  if (!family) {
    if (identity) errors.push('CURRICULUM_HIGH_SCHOOL_UNIT_KEY_INVALID');
    return { status: errors.length ? 'FAIL' : 'PASS', errors }; // Other grade contracts retain their existing validator.
  }
  if (!courses[family]?.includes(String(question.standardCourse || '').replace(/\s/g, ''))) errors.push('CURRICULUM_COURSE_UNIT_MISMATCH');
  if (!master.some(r => r.keyType === 'standardUnitKey' && r.key === unit)) errors.push('CURRICULUM_UNIT_UNKNOWN');
  if (sub && !master.some(r => r.keyType === 'subUnitKey' && r.key === sub && r.standardUnitKey === unit)) errors.push('CURRICULUM_SUBUNIT_PARENT_MISMATCH');
  const sourceFamily = String(source.standardUnitKey || '').match(/^(H(?:15|22))-/)?.[1];
  if (sourceFamily && !unit.startsWith(sourceFamily + '-')) errors.push('CURRICULUM_SOURCE_SYSTEM_MISMATCH');
  if (identity) {
    const year = Number(identity[1]) + (identity[1].length === 2 ? 2000 : 0), grade = Number(identity[2]);
    // Cohort transition: first high-school year of 2022 curriculum is 2025.
    if (year >= 2018 && (year - grade + 1 >= 2025 ? !unit.startsWith('H22-') : !unit.startsWith('H15-'))) errors.push('CURRICULUM_EXAM_COHORT_MISMATCH');
  }
  return { status: errors.length ? 'FAIL' : 'PASS', errors };
}
