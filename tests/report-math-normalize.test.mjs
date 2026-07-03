import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = ['report-text.js', 'report-center.js', 'report-print.js']
  .map(file => fs.readFileSync(path.join(root, 'apmath/js', file), 'utf8'))
  .join('\n');

const context = {
  state: { db: {} },
  window: {},
  document: { getElementById: () => null },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  console,
  setTimeout,
  clearTimeout
};
context.window = context;
vm.createContext(context);
vm.runInContext(source, context, { filename: 'apmath/js/report.js' });

assert.equal(context.reportCenterNormalizeMathText('순수 한국어 문장입니다.'), '순수 한국어 문장입니다.');
assert.match(context.reportCenterNormalizeMathText('x^2+bx-c를 정리합니다.'), /\$x\^\{2\}\+bx-c\$/);
assert.equal(context.reportCenterNormalizeMathText('$x^2$를 유지합니다.'), '$x^2$를 유지합니다.');
assert.match(context.reportCenterNormalizeMathText('√(b^2+4c)를 확인합니다.'), /\$\\sqrt\{b\^\{2\}\+4c\}\$/);
assert.match(context.reportCenterNormalizeMathText('a/b 형태입니다.'), /\$\\frac\{a\}\{b\}\$/);

console.log('report math normalize test passed');
