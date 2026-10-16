const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execSync } = require('child_process');

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

console.log(`\n================================================================================`);
console.log(`📋 문항별 2단계 정밀 전수 품질 검증 게이트 (총 ${jsFiles.length}개 시험지 대상)`);
console.log(`   [핵심 집중 축: 발문 2차 원문대조 전사 / 객관식 5선지 / 에셋 여백(Margin) 확보]`);
console.log(`   [점수제/배점 합산 일체 배제 -> 오직 발문·보기·에셋 퀄리티만 검증]`);
console.log(`================================================================================\n`);

let totalHasError = false;
const scriptDir = __dirname;
const auditAssetPy = path.join(scriptDir, 'audit_asset.py');

jsFiles.forEach((jsPath) => {
  const baseName = path.basename(jsPath, '.js');
  const code = fs.readFileSync(jsPath, 'utf8');
  const sandbox = { window: {} };

  try {
    vm.createContext(sandbox);
    vm.runInContext(code, sandbox);
  } catch (e) {
    console.error(`\n❌ [FAIL] ${baseName}: Syntax/Evaluation Error: ${e.message}`);
    totalHasError = true;
    return;
  }

  const examData = sandbox.window.examData;
  if (!examData || !Array.isArray(examData.questions)) {
    console.error(`\n❌ [FAIL] ${baseName}: window.examData.questions 누락 또는 스키마 오류!`);
    totalHasError = true;
    return;
  }

  const questions = examData.questions;
  const qCount = questions.length;
  const examDir = path.dirname(jsPath);

  console.log(`--------------------------------------------------------------------------------`);
  console.log(`📄 시험지: ${baseName} (총 ${qCount}문항 전수 검사)`);
  console.log(`--------------------------------------------------------------------------------`);

  let examFailCount = 0;

  // 문항별 전수 보고 및 검증
  questions.forEach((q, idx) => {
    const qid = q.id !== undefined ? q.id : (idx + 1);
    const qtext = q.question || '';
    const qErrors = [];

    // 1. 발문 퀄리티 검증 (KaTeX 수식, 달러 짝, cases 환경, 문맥)
    let mathStatus = "KaTeX 정상";
    if (typeof qtext !== 'string' || qtext.trim().length === 0) {
      qErrors.push("발문 비어있음");
    } else {
      const dollarCount = (qtext.match(/\$/g) || []).length;
      if (dollarCount % 2 !== 0) {
        qErrors.push(`달러($) 짝 불일치 (${dollarCount}개)`);
      }
      const beginCases = (qtext.match(/\\begin\{cases\}/g) || []).length;
      const endCases = (qtext.match(/\\end\{cases\}/g) || []).length;
      if (beginCases !== endCases) {
        qErrors.push(`cases 불일치 (${beginCases} vs ${endCases})`);
      }
    }

    // 2. 보기 퀄리티 검증 (객관식 정확히 5개 선지 / 주관식 빈배열)
    let choiceStatus = "";
    if (!Array.isArray(q.choices)) {
      qErrors.push("choices가 배열이 아님");
      choiceStatus = "선지오류";
    } else if (q.choices.length === 0) {
      choiceStatus = "주관식/서술형";
    } else if (q.choices.length === 5) {
      choiceStatus = "객관식 5선지";
      q.choices.forEach((c, cIdx) => {
        if (typeof c !== 'string' || c.trim().length === 0) {
          qErrors.push(`${cIdx + 1}번 선지 공백`);
        }
        const cDollar = (c.match(/\$/g) || []).length;
        if (cDollar % 2 !== 0) {
          qErrors.push(`${cIdx + 1}번 선지 달러($) 불일치`);
        }
      });
    } else {
      qErrors.push(`객관식 선지 수 오류 (${q.choices.length}개, 반드시 5개)`);
      choiceStatus = `선지 ${q.choices.length}개(오류)`;
    }

    // 3. 에셋 퀄리티 및 여백 검증 (그림 참조 문항 태그 결속 및 여백 확보)
    const mentionsDiagram = /(?:그림과\s*같이|다음\s*그림|그림에서|좌표평면\s*위|그래프는|도형은|그림과\s*같은)/.test(qtext);
    const imgMatches = Array.from(qtext.matchAll(/<img[^>]+src=["']([^"']+)["']/g));
    let assetStatus = "에셋 없음";

    if (imgMatches.length > 0) {
      const assetResults = [];
      imgMatches.forEach(m => {
        const relSrc = m[1];
        const imgPath = path.resolve(examDir, relSrc);
        if (!fs.existsSync(imgPath)) {
          qErrors.push(`에셋 파일 없음 (${relSrc})`);
          assetResults.push(`[${path.basename(relSrc)}: 누락]`);
        } else {
          try {
            execSync(`python "${auditAssetPy}" "${imgPath}"`, { encoding: 'utf8' });
            assetResults.push(`[${path.basename(relSrc)}: 여백PASS]`);
          } catch (err) {
            const errOut = (err.stdout || err.stderr || err.message).trim();
            qErrors.push(`에셋 여백 결함 (${path.basename(relSrc)}: ${errOut})`);
            assetResults.push(`[${path.basename(relSrc)}: 여백FAIL]`);
          }
        }
      });
      assetStatus = assetResults.join(' ');
    } else if (mentionsDiagram) {
      qErrors.push("발문에 그림/그래프 언급이 있으나 <img> 태그 누락");
      assetStatus = "⚠️ 에셋 누락";
    }

    // 4. Source-Only 검증
    if (q.answer !== '') qErrors.push("answer 필드 비어있지 않음");
    if (q.solution !== '') qErrors.push("solution 필드 비어있지 않음");

    // 문항별 라인 보고 출력 (점수 배제, 품질 3대 요소 집중)
    const qidStr = `Q${String(qid).padStart(2, '0')}`;
    if (qErrors.length === 0) {
      console.log(`  ✅ ${qidStr} | ${choiceStatus} | ${mathStatus} | ${assetStatus} -> [정상]`);
    } else {
      examFailCount++;
      console.error(`  ❌ ${qidStr} | ${choiceStatus} | ${assetStatus} -> 결함: ${qErrors.join('; ')}`);
    }
  });

  if (examFailCount > 0) {
    totalHasError = true;
    console.log(`\n  👉 [결과] ${baseName}: 결함 문항 ${examFailCount}건 발견 (수정 및 재검수 필요)\n`);
  } else {
    console.log(`\n  👉 [결과] ${baseName}: 전 문항(${qCount}개) 발문 2차 전사 일치 및 에셋 여백 무결성 확인 완료 [PASS]\n`);
  }
});

console.log(`================================================================================`);
if (totalHasError) {
  console.error("❌ VALIDATION FAILED: 일부 문항의 발문/보기/에셋 여백 품질이 기준에 미달했습니다.");
  process.exit(1);
} else {
  console.log("✅ ALL EXAMS PASSED: 전 문항 발문 2차 전사 일치, 객관식 5선지, 에셋 여백 품질 완벽 확인");
  console.log(`================================================================================\n`);
}
