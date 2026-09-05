import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { relativeRepoPath, sha256, stableStringify } from './io.mjs';

const LOGIC_UNIT_KEYS = new Set(['H15-SB-01', 'H15-SB-02']);

export function loadExamFile(filePath) {
  const window = {};
  vm.runInNewContext(fs.readFileSync(filePath, 'utf8'), { window }, { filename: filePath, timeout: 5000 });
  if (!Array.isArray(window.questionBank)) throw new Error(`questionBank missing: ${filePath}`);
  return { title: window.examTitle ?? path.basename(filePath, '.js'), questions: window.questionBank };
}

export function buildTargetInventory(repoRoot, { years = ['21', '22'], unitKeys = [...LOGIC_UNIT_KEYS] } = {}) {
  const examDir = path.join(repoRoot, 'archive', 'exams', 'original', 'high', 'h1', '2mid');
  const files = fs.readdirSync(examDir).filter((name) => years.some((year) => name.startsWith(`${year}_`))).sort();
  const items = [];
  for (const name of files) {
    const absolutePath = path.join(examDir, name);
    const exam = loadExamFile(absolutePath);
    for (const question of exam.questions) {
      if (!unitKeys.includes(question.standardUnitKey)) continue;
      const questionUid = `${exam.title}:q${String(question.id).padStart(2, '0')}`;
      const solutionImage = typeof question.solutionImage === 'string' ? question.solutionImage : null;
      items.push({
        questionUid,
        examId: exam.title,
        qid: question.id,
        year: name.slice(0, 2),
        school: name.split('_')[1] ?? null,
        sourceFile: relativeRepoPath(repoRoot, absolutePath),
        sourceFileSha: sha256(fs.readFileSync(absolutePath)),
        standardUnitKey: question.standardUnitKey,
        standardUnit: question.standardUnit,
        subUnitKey: question.subUnitKey ?? null,
        category: question.category ?? null,
        content: question.content ?? '',
        choices: Array.isArray(question.choices) ? question.choices : [],
        problemImageRefs: collectProblemImageRefs(question),
        sharedProblemMaterial: question.sharedProblemMaterial ?? null,
        solutionImage,
        solutionImageAlt: question.solutionImageAlt ?? null,
        solutionImageCaption: question.solutionImageCaption ?? null,
        actualSolutionVisualAttached: Boolean(solutionImage),
        problemVisualMathDependency: Boolean(question.problemVisualMathDependency),
        sharedVisualMathDependency: Boolean(question.sharedVisualMathDependency)
      });
    }
  }
  return items.sort((a, b) => a.questionUid.localeCompare(b.questionUid));
}

function collectProblemImageRefs(question) {
  const values = [];
  for (const key of ['problemImage', 'problemImageRef', 'image', 'imageRef', 'originalProblemImage']) {
    if (typeof question[key] === 'string') values.push(question[key]);
  }
  return [...new Set(values)];
}

export function buildSourceOnlyBundle(items, ruleEvidence) {
  return {
    bundleType: 'V1_SOURCE_ONLY_LOGIC_VISUAL_TRIAGE',
    contractVersion: 'v1',
    ruleEvidence,
    items: items.map((item) => ({
      questionUid: item.questionUid,
      examId: item.examId,
      qid: item.qid,
      year: item.year,
      school: item.school,
      standardUnitKey: item.standardUnitKey,
      standardUnit: item.standardUnit,
      subUnitKey: item.subUnitKey,
      category: item.category,
      content: item.content,
      choices: item.choices,
      problemImageRefs: item.problemImageRefs,
      sharedProblemMaterial: item.sharedProblemMaterial
    }))
  };
}

export function sourceBundleSha(bundle) {
  return sha256(stableStringify(bundle));
}
