#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const COMMANDS = [
  'dfrac', 'frac', 'sqrt', 'left', 'right', 'overline', 'underline',
  'begin', 'end', 'displaystyle', 'text', 'mathrm', 'mathbf', 'mathbb',
  'operatorname', 'lim', 'sum', 'prod', 'int', 'infty', 'theta', 'alpha',
  'beta', 'gamma', 'delta', 'omega', 'lambda', 'mu', 'sigma', 'pi', 'sin',
  'cos', 'tan', 'log', 'ln', 'cdot', 'times', 'div', 'pm', 'mp', 'leq',
  'geq', 'neq', 'lt', 'gt', 'cup', 'cap', 'subset', 'supset', 'in', 'notin',
  'emptyset', 'angle', 'triangle', 'parallel', 'perp', 'vec', 'widehat',
  'overbrace', 'underbrace'
];

const LOW_SIGNAL_BARE_COMMANDS = new Set([
  'text', 'end', 'in', 'div', 'log', 'ln', 'sin', 'cos', 'tan', 'lim', 'sum',
  'prod', 'int', 'pi', 'lt', 'gt', 'pm', 'mp'
]);

const HIGH_SIGNAL_COMMANDS = COMMANDS.filter(command => !LOW_SIGNAL_BARE_COMMANDS.has(command));
const SORTED_COMMANDS = [...COMMANDS].sort((left, right) => right.length - left.length);
const SORTED_HIGH_SIGNAL_COMMANDS = [...HIGH_SIGNAL_COMMANDS].sort((left, right) => right.length - left.length);
const RUNTIME_FIELDS = ['answer', 'solution', 'explanation', 'sol'];

function parseArgs(argv) {
  const options = { repo: process.cwd() };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--repo') options.repo = argv[++i];
    else throw new Error(`Unknown argument: ${argv[i]}`);
  }
  return options;
}

function walkJsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const target = path.join(dir, entry.name);
    if (entry.isDirectory()) return walkJsFiles(target);
    return entry.isFile() && entry.name.endsWith('.js') ? [target] : [];
  });
}

function normalizeRelative(repo, file) {
  return path.relative(repo, file).replaceAll('\\', '/');
}

function scanStringEnd(source, start, quote) {
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === '\\') {
      i += 1;
      continue;
    }
    if (source[i] === quote) return i;
  }
  return source.length;
}

function nearestQuestionId(source, offset) {
  const prefix = source.slice(0, offset);
  const idPattern = /(?:^|[,{]\s*)["']?id["']?\s*:\s*(\d+)/gm;
  let id = '?';
  for (const match of prefix.matchAll(idPattern)) id = match[1];
  return id;
}

function mathSegments(value, field) {
  if (field === 'answer') return [value];
  return [...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]*?\$/g)].map(match => match[0]);
}

const args = parseArgs(process.argv.slice(2));
const repo = path.resolve(args.repo);
const examRoot = path.join(repo, 'archive', 'exams');
const files = walkJsFiles(examRoot);
const issueMap = new Map();
let questionCount = 0;
let fieldCount = 0;
let staticOccurrenceCount = 0;
let evaluationErrorCount = 0;

function addIssue(file, id, field, defect) {
  const relative = normalizeRelative(repo, file);
  const key = `${relative}#${id}#${field}`;
  const issue = issueMap.get(key) || { file: relative, id: Number(id) || id, field, defects: [] };
  if (!issue.defects.includes(defect)) issue.defects.push(defect);
  issueMap.set(key, issue);
}

const propertyPattern = /(?:["']?(answer|solution|explanation|sol)["']?)\s*:\s*(String\.raw\s*)?(["'`])/g;
const slashCommandPattern = new RegExp(`(\\\\+)(${SORTED_COMMANDS.join('|')})(?![A-Za-z])`, 'g');
const bareCommandPattern = new RegExp(`(^|[^\\\\A-Za-z])(${SORTED_HIGH_SIGNAL_COMMANDS.join('|')})(?![A-Za-z])`, 'g');
const controlCharacters = new Map([
  [8, 'backspace'],
  [9, 'tab'],
  [11, 'vertical-tab'],
  [12, 'form-feed'],
  [13, 'carriage-return']
]);

for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');

  propertyPattern.lastIndex = 0;
  let propertyMatch;
  while ((propertyMatch = propertyPattern.exec(source))) {
    const field = propertyMatch[1];
    const isRaw = Boolean(propertyMatch[2]);
    const quote = propertyMatch[3];
    const valueStart = propertyPattern.lastIndex;
    const valueEnd = scanStringEnd(source, valueStart, quote);
    const rawValue = source.slice(valueStart, valueEnd);
    propertyPattern.lastIndex = valueEnd + 1;

    if (isRaw) continue;
    slashCommandPattern.lastIndex = 0;
    let commandMatch;
    while ((commandMatch = slashCommandPattern.exec(rawValue))) {
      if (commandMatch[1].length % 2 === 0) continue;
      staticOccurrenceCount += 1;
      addIssue(file, nearestQuestionId(source, propertyMatch.index), field, `odd-source-slash-${commandMatch[2]}`);
    }
  }

  const context = { window: {} };
  try {
    vm.createContext(context);
    vm.runInContext(source, context, { filename: file, timeout: 2000 });
  } catch (error) {
    evaluationErrorCount += 1;
    addIssue(file, '?', 'evaluation', error.message);
    continue;
  }

  const questions = context.window.questionBank || context.window.questions || [];
  if (!Array.isArray(questions)) continue;
  questionCount += questions.length;

  for (const question of questions) {
    for (const field of RUNTIME_FIELDS) {
      if (question[field] == null) continue;
      fieldCount += 1;
      const value = String(question[field]);

      for (const [code, name] of controlCharacters) {
        if (value.includes(String.fromCharCode(code))) addIssue(file, question.id, field, `runtime-${name}`);
      }

      for (const segment of mathSegments(value, field)) {
        bareCommandPattern.lastIndex = 0;
        let bareMatch;
        while ((bareMatch = bareCommandPattern.exec(segment))) {
          addIssue(file, question.id, field, `runtime-bare-${bareMatch[2]}`);
        }
      }
    }
  }
}

const issues = [...issueMap.values()].sort((left, right) =>
  left.file.localeCompare(right.file, 'ko') ||
  Number(left.id) - Number(right.id) ||
  left.field.localeCompare(right.field)
);

const report = {
  ok: issues.length === 0,
  files: files.length,
  questions: questionCount,
  fields: fieldCount,
  evaluationErrors: evaluationErrorCount,
  staticOccurrences: staticOccurrenceCount,
  affectedFields: issues.length,
  affectedAnswers: issues.filter(issue => issue.field === 'answer').length,
  affectedSolutions: issues.filter(issue => issue.field !== 'answer' && issue.field !== 'evaluation').length,
  issues
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = report.ok ? 0 : 1;
