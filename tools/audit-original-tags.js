const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');

const root = path.resolve(__dirname, '..');
const baseDir = path.join(root, 'archive', 'exams', 'original');

function walk(dir) {
  const out = [];
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) out.push(...walk(full));
    if (item.isFile() && item.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function loadExam(file) {
  const source = fs.readFileSync(file, 'utf8');
  const context = { window: {}, console: { log() {}, warn() {}, error() {} } };
  vm.createContext(context);
  vm.runInContext(source, context, { filename: file, timeout: 5000 });
  return {
    source,
    examTitle: context.window.examTitle || '',
    questionBank: Array.isArray(context.window.questionBank) ? context.window.questionBank : [],
  };
}

function stableHash(value) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function snapshotQuestion(question) {
  return {
    id: question.id,
    content: question.content,
    choices: question.choices,
    answer: question.answer,
    solution: question.solution,
    level: question.level,
    questionType: question.questionType,
    standardCourse: question.standardCourse,
    standardUnitKey: question.standardUnitKey,
    standardUnit: question.standardUnit,
    standardUnitOrder: question.standardUnitOrder,
    layoutTag: question.layoutTag,
    wide: question.wide,
  };
}

function audit(files = walk(baseDir)) {
  const rows = [];
  const errors = [];
  for (const file of files) {
    try {
      const loaded = loadExam(file);
      let emptyTags = 0;
      let missingTags = 0;
      let nonArrayTags = 0;
      let duplicateTags = 0;
      const hashes = loaded.questionBank.map((question) => stableHash(snapshotQuestion(question)));
      loaded.questionBank.forEach((question) => {
        if (question.tags === undefined) missingTags += 1;
        else if (!Array.isArray(question.tags)) nonArrayTags += 1;
        else {
          if (!question.tags.length) emptyTags += 1;
          if (new Set(question.tags).size !== question.tags.length) duplicateTags += 1;
          if (question.tags.some((tag) => typeof tag !== 'string' || !tag.trim())) nonArrayTags += 1;
        }
      });
      rows.push({
        file: path.relative(root, file).replace(/\\/g, '/'),
        count: loaded.questionBank.length,
        emptyTags,
        missingTags,
        nonArrayTags,
        duplicateTags,
        contentHash: stableHash(hashes),
      });
    } catch (error) {
      errors.push({ file: path.relative(root, file).replace(/\\/g, '/'), error: error.message });
    }
  }
  return { rows, errors };
}

if (require.main === module) {
  const result = audit();
  console.log(JSON.stringify(result, null, 2));
  if (result.errors.length) process.exit(1);
}

module.exports = { audit, loadExam, snapshotQuestion, stableHash };
