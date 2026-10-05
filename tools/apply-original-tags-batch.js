const fs = require('fs');
const path = require('path');
const { loadExam, snapshotQuestion, stableHash } = require('./audit-original-tags.js');

const root = path.resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findQuestionBlock(source, id) {
  const rawId = String(id);
  const escapedId = escapeRegExp(rawId);
  const idValuePattern = `(?:${escapedId}|["']${escapedId}["'])`;
  const idPattern = new RegExp(`(^|\\n)(\\s*)["']?id["']?\\s*:\\s*${idValuePattern}\\s*,`);
  const match = idPattern.exec(source);
  if (!match) return null;
  let start = match.index + match[1].length;
  while (start > 0 && source[start] !== '{') start -= 1;
  if (source[start] !== '{') return null;

  let depth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return { start, end: i + 1, block: source.slice(start, i + 1) };
    }
  }
  return null;
}

function findQuestionBlockByIndex(source, targetIndex) {
  const bankMatch = /window\.questionBank\s*=/.exec(source);
  if (!bankMatch) return null;
  let objectDepth = 0;
  let inString = false;
  let quote = '';
  let escaped = false;
  let start = -1;
  let index = -1;

  for (let i = bankMatch.index + bankMatch[0].length; i < source.length; i += 1) {
    const ch = source[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === '{') {
      if (objectDepth === 0) {
        start = i;
      }
      objectDepth += 1;
    }
    if (ch === '}') {
      objectDepth -= 1;
      if (objectDepth === 0) {
        const block = source.slice(start, i + 1);
        if (/["']?content["']?\s*:/.test(block) && /["']?answer["']?\s*:/.test(block)) {
          index += 1;
          if (index === Number(targetIndex)) {
            return { start, end: i + 1, block };
          }
        }
      }
    }
  }
  return null;
}

function replaceTagsInBlock(block, tags) {
  const tagText = `"tags": ${JSON.stringify(tags)}`;
  const tagsRegex = /["']?tags["']?\s*:\s*\[[\s\S]*?\]/;
  if (tagsRegex.test(block)) {
    return block.replace(tagsRegex, tagText);
  }

  const wideRegex = /(["']?wide["']?\s*:\s*(?:true|false))/;
  if (wideRegex.test(block)) {
    return block.replace(wideRegex, `$1,\n    ${tagText}`);
  }

  const solutionRegex = /(["']?solution["']?\s*:\s*"[\s\S]*?")/;
  assert(solutionRegex.test(block), 'cannot find safe insertion point for tags');
  return block.replace(solutionRegex, `${tagText},\n    $1`);
}

function applyTagPlan(plan) {
  const file = path.join(root, plan.file);
  const beforeLoaded = loadExam(file);
  const beforeQuestions = Array.from(beforeLoaded.questionBank);
  const beforeHashes = beforeQuestions.map((question) => (question ? stableHash(snapshotQuestion(question)) : stableHash(null)));
  let source = beforeLoaded.source;
  const byId = new Map(beforeQuestions.filter(Boolean).map((question) => [String(question.id), question]));

  for (const item of plan.items || []) {
    const id = String(item.id);
    const hasIndex = item.index !== undefined && item.index !== null;
    const question = hasIndex ? beforeQuestions[Number(item.index)] : byId.get(id);
    assert(question, `${plan.file} question ${hasIndex ? `index ${item.index}` : id} not found`);
    const current = Array.isArray(question.tags) ? question.tags : [];
    const additions = Array.isArray(item.addTags) ? item.addTags : [];
    const nextTags = [...new Set([...current, ...additions].map((tag) => String(tag).trim()).filter(Boolean))];
    const found = hasIndex ? findQuestionBlockByIndex(source, Number(item.index)) : findQuestionBlock(source, id);
    assert(found, `${plan.file} question ${hasIndex ? `index ${item.index}` : id} block not found`);
    const nextBlock = replaceTagsInBlock(found.block, nextTags);
    source = source.slice(0, found.start) + nextBlock + source.slice(found.end);
  }

  fs.writeFileSync(file, source, 'utf8');

  const afterLoaded = loadExam(file);
  const afterQuestions = Array.from(afterLoaded.questionBank);
  for (let index = 0; index < afterQuestions.length; index += 1) {
    const question = afterQuestions[index];
    assert(beforeHashes[index], `${plan.file} question index ${index} unexpectedly added`);
    const beforeHash = beforeHashes[index];
    const afterHash = question ? stableHash(snapshotQuestion(question)) : stableHash(null);
    assert(beforeHash === afterHash, `${plan.file} question index ${index} non-tags field changed`);
    if (question && Array.isArray(question.tags)) {
      assert(new Set(question.tags).size === question.tags.length, `${plan.file} question index ${index} has duplicate tags`);
      assert(!question.tags.some((tag) => typeof tag !== 'string' || !tag.trim()), `${plan.file} question index ${index} has invalid tag`);
    }
  }
  assert(afterLoaded.questionBank.length === beforeLoaded.questionBank.length, `${plan.file} question count changed`);
}

if (require.main === module) {
  const inputPath = process.argv[2];
  assert(inputPath, 'usage: node tools/apply-original-tags-batch.js <plan.json>');
  const plans = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const list = Array.isArray(plans) ? plans : [plans];
  list.forEach(applyTagPlan);
  console.log(`applied ${list.length} tag plan(s)`);
}

module.exports = { applyTagPlan };
