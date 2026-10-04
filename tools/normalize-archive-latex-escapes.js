const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DEFAULT_TARGET = path.join(ROOT, 'archive', 'exams');
const WRITE = process.argv.includes('--write');
const TARGET = path.resolve(
  process.argv.find((arg) => arg.startsWith('--target='))?.slice('--target='.length) || DEFAULT_TARGET
);

const KNOWN_MACROS = [
  'implies',
  'times',
  'dfrac',
  'frac',
  'sqrt',
  'pm',
  'left',
  'right',
  'text',
  'textcircled',
  'lt',
  'gt',
  'le',
  'ge',
  'neq',
  'infty',
  'cdot',
  'div',
  'angle',
  'theta',
  'alpha',
  'beta',
  'gamma',
  'pi',
  'sin',
  'cos',
  'tan',
  'log',
  'ln',
  'lim',
  'sum',
  'prod',
  'int',
  'overline',
  'bar',
  'vec',
  'hat',
  'begin',
  'end',
  'textbf',
  'mathrm',
  'boldsymbol',
  'qquad',
  'quad',
];

const CIRCLED = {
  0: '⓪',
  1: '①',
  2: '②',
  3: '③',
  4: '④',
  5: '⑤',
  6: '⑥',
  7: '⑦',
  8: '⑧',
  9: '⑨',
  10: '⑩',
  11: '⑪',
  12: '⑫',
  13: '⑬',
  14: '⑭',
  15: '⑮',
  16: '⑯',
  17: '⑰',
  18: '⑱',
  19: '⑲',
  20: '⑳',
};

const macroAlternation = KNOWN_MACROS.join('|');
const macroSlashRunRe = new RegExp(String.raw`\\+(?=(?:${macroAlternation})(?:\b|\{|\s|[+\-=]))`, 'g');
const literalSlashRunRe = /\\+(?=[{}()[\]])/g;
const joinedLtGtRe = /\\\\(lt|gt)(?=[A-Za-z])/g;
const textCircledRe = /\\{1,2}textcircled\{([0-9]{1,2})\}/g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile() && entry.name.endsWith('.js')) out.push(full);
  }
  return out;
}

function countMatches(text, re) {
  re.lastIndex = 0;
  let count = 0;
  while (re.exec(text)) count += 1;
  re.lastIndex = 0;
  return count;
}

function protectRawTemplates(source) {
  const rawTemplates = [];
  const text = source.replace(/String\.raw`[\s\S]*?`/g, (match) => {
    const token = `__LATEX_RAW_TEMPLATE_${rawTemplates.length}__`;
    rawTemplates.push(match);
    return token;
  });

  return {
    text,
    restore(value) {
      return value.replace(/__LATEX_RAW_TEMPLATE_(\d+)__/g, (match, index) => rawTemplates[Number(index)] ?? match);
    },
  };
}

function normalizeText(source) {
  const protectedSource = protectRawTemplates(source);
  const sourceForFix = protectedSource.text;
  const stats = {
    overEscapedMacros: 0,
    singleEscapedMacros: 0,
    joinedLtGt: countMatches(sourceForFix, joinedLtGtRe),
    overEscapedLiterals: 0,
    singleEscapedLiterals: 0,
    textCircled: 0,
  };

  let text = sourceForFix;

  text = text.replace(macroSlashRunRe, (slashes) => {
    if (slashes.length === 4) {
      stats.overEscapedMacros += 1;
      return '\\\\';
    }
    if (slashes.length === 1) {
      stats.singleEscapedMacros += 1;
      return '\\\\';
    }
    return slashes;
  });
  text = text.replace(literalSlashRunRe, (slashes, offset, fullText) => {
    const nextChar = fullText[offset + slashes.length];
    if (slashes.length === 4 && (nextChar === '{' || nextChar === '}')) {
      stats.overEscapedLiterals += 1;
      return '\\\\';
    }
    if (slashes.length === 1) {
      stats.singleEscapedLiterals += 1;
      return '\\\\';
    }
    return slashes;
  });
  text = text.replace(joinedLtGtRe, '\\\\$1 ');
  text = text.replace(textCircledRe, (match, n) => {
    const glyph = CIRCLED[Number(n)];
    if (!glyph) return match;
    stats.textCircled += 1;
    return `\\\\text{${glyph}}`;
  });

  return { text: protectedSource.restore(text), stats };
}

function main() {
  if (!fs.existsSync(TARGET)) {
    console.error(`Target does not exist: ${TARGET}`);
    process.exit(1);
  }

  const files = walk(TARGET);
  const changed = [];
  const totals = {
    filesScanned: files.length,
    filesChanged: 0,
    overEscapedMacros: 0,
    singleEscapedMacros: 0,
    joinedLtGt: 0,
    overEscapedLiterals: 0,
    singleEscapedLiterals: 0,
    textCircled: 0,
  };

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const { text, stats } = normalizeText(source);
    if (text === source) continue;

    changed.push({ file: path.relative(ROOT, file), ...stats });
    totals.filesChanged += 1;
    totals.overEscapedMacros += stats.overEscapedMacros;
    totals.singleEscapedMacros += stats.singleEscapedMacros;
    totals.joinedLtGt += stats.joinedLtGt;
    totals.overEscapedLiterals += stats.overEscapedLiterals;
    totals.singleEscapedLiterals += stats.singleEscapedLiterals;
    totals.textCircled += stats.textCircled;

    if (WRITE) fs.writeFileSync(file, text, 'utf8');
  }

  console.log(JSON.stringify({ mode: WRITE ? 'write' : 'dry-run', target: path.relative(ROOT, TARGET), totals, changed }, null, 2));
}

main();
