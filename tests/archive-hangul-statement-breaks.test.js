const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const engineFiles = [
  'archive/engine.html',
  'archive/mixed_engine.html',
  'apmath/wrong_print_engine.html'
];

const fixtures = [
  {
    name: 'compact markers',
    input: 'ㄱ. A ㄴ. B ㄷ. C',
    expected: 'ㄱ. A<br>ㄴ. B<br>ㄷ. C'
  },
  {
    name: 'one existing break per item',
    input: 'ㄱ. A<br>ㄴ. B<br>ㄷ. C',
    expected: 'ㄱ. A<br>ㄴ. B<br>ㄷ. C'
  },
  {
    name: 'repeated breaks',
    input: 'ㄱ. A<br><br>ㄴ. B<br><br><br>ㄷ. C',
    expected: 'ㄱ. A<br>ㄴ. B<br>ㄷ. C'
  },
  {
    name: '보기 prefix keeps the existing box policy',
    input: '보기: ㄱ. A ㄴ. B ㄷ. C',
    assert(output) {
      assert.match(output, /보기<\/b><br>ㄱ\. A<br>ㄴ\. B<br>ㄷ\. C/);
    }
  },
  {
    name: 'short items are still separated',
    input: 'ㄱ. 참 ㄴ. 거짓 ㄷ. 참',
    expected: 'ㄱ. 참<br>ㄴ. 거짓<br>ㄷ. 참'
  },
  {
    name: 'natural line break inside an item is preserved',
    input: 'ㄱ. 첫 번째 문장이 길어서<br>중간에 의도된 줄바꿈<br>ㄴ. 다음 항목',
    expected: 'ㄱ. 첫 번째 문장이 길어서<br>중간에 의도된 줄바꿈<br>ㄴ. 다음 항목'
  },
  {
    name: 'five Hangul items',
    input: 'ㄱ. A ㄴ. B ㄷ. C ㄹ. D ㅁ. E',
    expected: 'ㄱ. A<br>ㄴ. B<br>ㄷ. C<br>ㄹ. D<br>ㅁ. E'
  },
  {
    name: 'existing question-note-box contents are normalized without rebuilding the box',
    input: '<div class="question-note-box">ㄱ. A ㄴ. B ㄷ. C</div>',
    expected: '<div class="question-note-box">ㄱ. A<br>ㄴ. B<br>ㄷ. C</div>'
  },
  {
    name: 'LaTeX stays intact',
    input: 'ㄱ. $\\sum a_n$이 수렴한다. ㄴ. 두 번째 항목',
    expected: 'ㄱ. $\\sum a_n$이 수렴한다.<br>ㄴ. 두 번째 항목'
  },
  {
    name: 'HTML image attributes and table structure stay intact',
    input: '<div class="question-note-box">ㄱ. A <img src="x.png" alt="ㄴ. literal"> ㄴ. B</div><table><tr><td>ㄱ. table ㄴ. cell</td></tr></table>',
    expected: '<div class="question-note-box">ㄱ. A <img src="x.png" alt="ㄴ. literal"><br>ㄴ. B</div><table><tr><td>ㄱ. table ㄴ. cell</td></tr></table>'
  },
  {
    name: 'choice area is not a statement-break target',
    input: '<div class="choices"><div class="choice-text">ㄱ. A ㄴ. B</div></div>',
    expected: '<div class="choices"><div class="choice-text">ㄱ. A ㄴ. B</div></div>'
  },
  {
    name: 'one marker is unchanged',
    input: '일반 문장에 ㄱ. 하나만 등장한다.',
    expected: '일반 문장에 ㄱ. 하나만 등장한다.'
  }
];

function loadNormalizer(engineFile) {
  const source = fs.readFileSync(path.join(root, engineFile), 'utf8');
  const start = source.indexOf('function normalizeQuestionNotes');
  const end = source.indexOf('function sanitizeProtectedSegments', start);
  assert.ok(start >= 0, `${engineFile}: normalizeQuestionNotes was not found`);
  assert.ok(end > start, `${engineFile}: normalizer section boundary was not found`);
  const context = { console };
  vm.runInNewContext(
    `${source.slice(start, end)}\nthis.__api = { normalizeViewBlocks };`,
    context,
    { filename: engineFile }
  );
  return context.__api.normalizeViewBlocks;
}

function normalizeForFixture(normalizeViewBlocks, input) {
  return normalizeViewBlocks(input);
}

function decodeContentLiteral(value) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}

function productionContentFields() {
  const examRoot = path.join(root, 'archive', 'exams');
  const files = [];
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(fullPath);
      else if (entry.isFile() && fullPath.endsWith('.js')) files.push(fullPath);
    }
  };
  visit(examRoot);

  const fields = [];
  const quotedContent = /"content"\s*:\s*"((?:\\.|[^"\\])*)"/g;

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    for (const match of source.matchAll(quotedContent)) {
      fields.push({ file, content: decodeContentLiteral(match[1]) });
    }
  }
  return fields;
}

function markerCount(value) {
  return (value.match(/[ㄱㄴㄷㄹㅁ]\./g) || []).length;
}

function protectedStructureSignature(value) {
  const count = pattern => (value.match(pattern) || []).length;
  return {
    tables: count(/<table\b/gi),
    tableEnds: count(/<\/table>/gi),
    images: count(/<img\b/gi),
    svgs: count(/<svg\b/gi),
    svgEnds: count(/<\/svg>/gi),
    choices: count(/class=["'][^"']*\bchoices\b[^"']*["']/gi),
    solutionBlocks: count(/class=["'][^"']*(?:sol-meta|sol-exp|solution)[^"']*["']/gi)
  };
}

function statementAuditStream(value) {
  return String(value)
    .replace(
      /<div[^>]*class=["'][^"']*(?:\bchoices\b|\bsol-meta\b|\bsol-exp\b|\bsolution\b)[^"']*["'][^>]*>[\s\S]*?<\/div>|<table\b[\s\S]*?<\/table>|<svg\b[\s\S]*?<\/svg>|<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>/gi,
      '\u0000'
    )
    .replace(
      /\\\([\s\S]*?\\\)|\\\[[\s\S]*?\\\]|\$\$[\s\S]*?\$\$|\$(?!\$)[\s\S]*?(?<!\$)\$/g,
      '\u0001'
    )
    .replace(/<img\b[^>]*>/gi, '\u0002')
    .replace(/<(?!br\b)\/?[A-Za-z][^>]*>|<!--[\s\S]*?-->/gi, '');
}

function separatorProblems(value) {
  const auditValue = statementAuditStream(value);
  const matches = [...auditValue.matchAll(/[ㄱㄴㄷㄹㅁ]\./g)];
  const rank = new Map([['ㄱ', 0], ['ㄴ', 1], ['ㄷ', 2], ['ㄹ', 3], ['ㅁ', 4]]);
  const problems = [];
  for (let index = 1; index < matches.length; index += 1) {
    const previous = matches[index - 1];
    const current = matches[index];
    const previousRank = rank.get(previous[0][0]);
    const currentRank = rank.get(current[0][0]);
    if (currentRank <= previousRank) continue;
    const between = auditValue.slice(previous.index + previous[0].length, current.index);
    if (between.includes('\u0000')) continue;
    const trailingSeparator = between.match(/(?:\s|<br\s*\/?>)*$/i)?.[0] || '';
    const breakCount = (trailingSeparator.match(/<br\s*\/?>/gi) || []).length;
    if (breakCount !== 1) {
      problems.push({ previous: previous[0], current: current[0], between });
    }
  }
  return problems;
}

const normalizers = Object.fromEntries(engineFiles.map(file => [file, loadNormalizer(file)]));

test('all three engines implement the Hangul statement-break contract', () => {
  for (const [engineFile, normalizeViewBlocks] of Object.entries(normalizers)) {
    for (const fixture of fixtures) {
      const output = normalizeForFixture(normalizeViewBlocks, fixture.input);
      if (fixture.assert) fixture.assert(output);
      else assert.equal(output, fixture.expected, `${engineFile}: ${fixture.name}`);
    }
  }
});

test('all three engines are idempotent for every statement-break fixture', () => {
  for (const [engineFile, normalizeViewBlocks] of Object.entries(normalizers)) {
    for (const fixture of fixtures) {
      const once = normalizeForFixture(normalizeViewBlocks, fixture.input);
      const twice = normalizeForFixture(normalizeViewBlocks, once);
      const thrice = normalizeForFixture(normalizeViewBlocks, twice);
      assert.equal(twice, once, `${engineFile}: ${fixture.name} changed on pass 2`);
      assert.equal(thrice, once, `${engineFile}: ${fixture.name} changed on pass 3`);
    }
  }
});

test('production inventory remains 304 candidate content fields and has zero normalization damage', () => {
  const fields = productionContentFields();
  const candidates = fields.filter(field => markerCount(field.content) >= 2);
  assert.equal(candidates.length, 304, 'production inventory denominator changed');

  for (const [engineFile, normalizeViewBlocks] of Object.entries(normalizers)) {
    const failures = [];
    for (const field of candidates) {
      const before = field.content.replace(/\\n/g, '<br>').replace(/\r\n|\r|\n/g, '<br>');
      const after = normalizeViewBlocks(before);
      if (markerCount(after) !== markerCount(before)) {
        failures.push({ type: 'marker-missing', file: field.file, before, after });
        continue;
      }
      const beforeStructure = protectedStructureSignature(before);
      const afterStructure = protectedStructureSignature(after);
      if (JSON.stringify(beforeStructure) !== JSON.stringify(afterStructure)) {
        failures.push({ type: 'structure-damage', file: field.file, beforeStructure, afterStructure });
        continue;
      }
      const separators = separatorProblems(after);
      if (separators.length > 0) {
        failures.push({ type: 'duplicate-or-missing-break', file: field.file, separators });
      }
    }
    assert.deepEqual(failures, [], `${engineFile}: production inventory normalization audit failed`);
  }
});
