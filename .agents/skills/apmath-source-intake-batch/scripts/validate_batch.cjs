const fs = require('fs');
const path = require('path');
const vm = require('vm');

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Usage: node validate_batch.cjs <target_dir_or_js_path>");
  process.exit(1);
}

let jsFiles = [];
if (fs.statSync(targetDir).isDirectory()) {
  const findJs = (dir) => {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        findJs(full);
      } else if (file.endsWith('.js')) {
        jsFiles.push(full);
      }
    });
  };
  findJs(targetDir);
} else {
  jsFiles = [targetDir];
}

console.log(`Auditing ${jsFiles.length} JS exam file(s)...`);

let hasError = false;

jsFiles.forEach((jsPath, idx) => {
  const baseName = path.basename(jsPath, '.js');
  const code = fs.readFileSync(jsPath, 'utf8');
  const sandbox = { window: {} };

  try {
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
  } catch (e) {
    console.error(`[FAIL] ${baseName}: Syntax/Evaluation Error: ${e.message}`);
    hasError = true;
    return;
  }

  const examData = sandbox.window.examData;
  if (!examData || !Array.isArray(examData.questions)) {
    console.error(`[FAIL] ${baseName}: window.examData.questions missing!`);
    hasError = true;
    return;
  }

  const questions = examData.questions;
  const qCount = questions.length;
  const totalScore = questions.reduce((sum, q) => sum + (Number(q.score) || 0), 0);
  const roundedScore = Math.round(totalScore * 10) / 10;

  const scoreOk = roundedScore === 100.0;
  const ansEmpty = questions.every(q => q.answer === '');
  const solEmpty = questions.every(q => q.solution === '');

  // Check choices format
  let choicesOk = true;
  questions.forEach(q => {
    if (!Array.isArray(q.choices)) choicesOk = false;
  });

  // Check referenced images
  const examDir = path.dirname(jsPath);
  let imagesOk = true;
  let missingImgs = [];
  questions.forEach(q => {
    const matches = (q.question || '').matchAll(/<img[^>]+src=["']([^"']+)["']/g);
    for (const m of matches) {
      const relSrc = m[1];
      const imgPath = path.resolve(examDir, relSrc);
      if (!fs.existsSync(imgPath)) {
        imagesOk = false;
        missingImgs.push(relSrc);
      }
    }
  });

  const pass = scoreOk && ansEmpty && solEmpty && choicesOk && imagesOk;
  if (!pass) hasError = true;

  const status = pass ? "PASS" : "FAIL";
  console.log(`[${status}] ${baseName} | 문항: ${qCount} | 배점합계: ${roundedScore.toFixed(1)}점 | 정답/해설빈값: ${ansEmpty && solEmpty ? 'OK' : 'ERR'} | 에셋참조: ${imagesOk ? 'OK' : 'MISSING: ' + missingImgs.join(', ')}`);
});

if (hasError) {
  console.error("\n❌ VALIDATION FAILED: 일부 시험지가 계약 조건을 충족하지 못했습니다.");
  process.exit(1);
} else {
  console.log("\n✅ ALL EXAMS PASSED (100.0점 합계, 빈 정답/해설, 에셋 정상 결속 완벽 검증)");
}
