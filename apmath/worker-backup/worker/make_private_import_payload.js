/**
 * JS아카이브 Private D1 입고 payload 생성기
 * 사용법:
 *   node make_private_import_payload.js ./26_매산여고_1학기_중간_고1_기출.js > private_import_payload.json
 */
const fs = require('fs');
const vm = require('vm');

const file = process.argv[2];
if (!file) {
  console.error('사용법: node make_private_import_payload.js <exam-js-file>');
  process.exit(1);
}

const code = fs.readFileSync(file, 'utf8');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: file, timeout: 3000 });

const examTitle = sandbox.window.examTitle;
const questions = sandbox.window.questionBank;

if (!examTitle || !Array.isArray(questions)) {
  console.error('examTitle 또는 questionBank를 찾지 못했습니다.');
  process.exit(1);
}

process.stdout.write(JSON.stringify({ examTitle, questions }, null, 2));
