import { readFileSync } from 'node:fs';

const files = [
  'apmath/js/student.js',
  'apmath/worker-backup/worker/routes/students.js',
  'apmath/worker-backup/worker/helpers/admin-db.js',
  'apmath/worker-backup/worker/index.js',
  'apmath/js/core.js'
];

const mojibakePatterns = [
  { name: 'replacement-glyph cluster: 占', re: /占/ },
  { name: 'replacement-glyph cluster: 筌', re: /筌/ },
  { name: 'bare mojibake marker: 餓', re: /餓/ },
  { name: 'replacement-glyph cluster: 獄', re: /獄/ },
  { name: 'replacement-glyph cluster: 癰', re: /癰/ },
  { name: 'replacement-glyph cluster: 窈', re: /窈/ },
  { name: 'broken source marker: 源낆쨯', re: /源낆쨯/ },
  { name: 'broken question prefix: ?源', re: /\?源/ },
  { name: 'broken question/control cluster: ??', re: /\?\?/ },
  { name: 'broken student token: ?숈', re: /\?숈/ },
  { name: 'broken register token: ?깅', re: /\?깅/ },
  { name: 'broken consultation token: ?곷떞', re: /\?곷떞/ },
  { name: 'broken history token: ?대젰', re: /\?대젰/ },
  { name: 'broken edit token: ?섏젙', re: /\?섏젙/ },
  { name: 'broken delete token: ??젣', re: /\?\?젣/ },
  { name: 'broken process token: 泥섎━', re: /泥섎━/ },
  { name: 'broken guardian token: 蹂댄샇', re: /蹂댄샇/ },
  { name: 'broken restore token: 蹂듦뎄', re: /蹂듦뎄/ },
  { name: 'broken add token: 異붽?', re: /異붽\?/ },
  { name: 'broken discharged token: ?쒖쟻', re: /\?쒖쟻/ },
  { name: 'broken load token: 遺덈윭', re: /遺덈윭/ },
  { name: 'broken progress token: 以묒엯', re: /以묒엯/ }
];

const requiredStudentPhrases = [
  '학생 등록을 처리 중입니다.',
  '등록 중...',
  '추가',
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
  for (const pattern of mojibakePatterns) {
    const match = pattern.re.exec(text);
    if (match) {
      const lineNumber = lineOf(text, match.index);
      const excerpt = lineTextAt(text, lineNumber).trim();
      failures.push(`${file}:${lineNumber} forbidden mojibake pattern "${pattern.name}" matched "${match[0]}" in line: ${excerpt}`);
    }
  }
}

const studentText = readFileSync('apmath/js/student.js', 'utf8');
for (const phrase of requiredStudentPhrases) {
  if (!studentText.includes(phrase)) {
    failures.push(`apmath/js/student.js: required Korean phrase missing: "${phrase}"`);
  }
}

if (failures.length) {
  console.error('Student mojibake guard failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Student mojibake guard passed for ${files.length} files and ${requiredStudentPhrases.length} required phrases.`);
