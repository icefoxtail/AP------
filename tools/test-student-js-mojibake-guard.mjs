import { readFileSync } from 'node:fs';

const files = [
  'apmath/js/student.js',
  'apmath/js/student-edit.js',
  'apmath/worker-backup/worker/routes/students.js',
  'apmath/worker-backup/worker/helpers/admin-db.js',
  'apmath/worker-backup/worker/index.js',
  'apmath/js/core.js'
];

const forbiddenFragments = [
  '筌',
  '癰',
  '繞',
  '繹',
  '嶺',
  '囹',
  '怨룸',
  '곕떽',
  '뽰읅',
  '븍뜄'
];

const requiredStudentPhrases = [
  '학생 등록을 처리 중입니다.',
  '등록 중...',
  '학생이 추가되었습니다.',
  '이미 등록 처리된 학생입니다.',
  '학생 추가에 실패했습니다.',
  '학생 추가 중 오류가 발생했습니다.',
  '학생 정보가 수정되었습니다.',
  '학생 정보 수정에 실패했습니다.',
  '학생 정보 수정 중 오류가 발생했습니다.',
  '퇴원 처리되었습니다.',
  '퇴원 처리에 실패했습니다.',
  '퇴원 처리 중 오류가 발생했습니다.',
  '재원으로 복구되었습니다.',
  '재원 복구에 실패했습니다.',
  '재원 복구 중 오류가 발생했습니다.',
  '제적',
  '재원',
  '신입',
  '휴원',
  '학생 이력',
  '상태 변경 이력',
  '반 이동 이력',
  '보호자 연락처 추가',
  '보호자 연락처 수정',
  '상담 기록 추가',
  '상담 기록 수정',
  '학생 이력 데이터를 불러오는 중입니다.',
  '학생 이력 데이터를 다시 확인해 주세요.'
];

function lineOf(text, index) {
  return text.slice(0, index).split(/\r?\n/).length;
}

function lineTextAt(text, lineNumber) {
  return text.split(/\r?\n/)[lineNumber - 1] || '';
}

const failures = [];

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  for (const fragment of forbiddenFragments) {
    const index = text.indexOf(fragment);
    if (index >= 0) {
      const lineNumber = lineOf(text, index);
      const excerpt = lineTextAt(text, lineNumber).trim();
      failures.push(`${file}:${lineNumber} forbidden mojibake fragment "${fragment}" in line: ${excerpt}`);
    }
  }
}

const studentText = [
  readFileSync('apmath/js/student.js', 'utf8'),
  readFileSync('apmath/js/student-edit.js', 'utf8')
].join('\n');

for (const phrase of requiredStudentPhrases) {
  if (!studentText.includes(phrase)) {
    failures.push(`student UI sources: required Korean phrase missing: "${phrase}"`);
  }
}

if (failures.length) {
  console.error('Student mojibake guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Student mojibake guard passed for ${files.length} files and ${requiredStudentPhrases.length} required phrases.`);
