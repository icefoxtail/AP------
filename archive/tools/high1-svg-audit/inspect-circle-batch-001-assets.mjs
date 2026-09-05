import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const targets = [
  ['archive/exams/original/high/h1/1final/22_금당고_1학기_기말_고1_기출.js', [6, 11, 12, 21]],
  ['archive/exams/original/high/h1/1final/22_매산고_1학기_기말_고1_기출.js', [5]],
];
const interesting = new Set(['circle', 'line', 'polyline', 'polygon', 'text', 'path', 'rect']);
const output = [];
for (const [sourcePath, ids] of targets) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(sourcePath, 'utf8'), context, { filename: sourcePath });
  for (const question of context.window.questionBank || []) {
    if (!ids.includes(question.id)) continue;
    const assetPath = path.join('archive', question.solutionImage);
    const svg = fs.readFileSync(assetPath, 'utf8');
    const root = svg.match(/<svg\b([^>]*)>/i)?.[1] || '';
    const elements = [];
    for (const match of svg.matchAll(/<(circle|line|polyline|polygon|text|path|rect)\b([^>]*)>(?:([\s\S]*?)<\/\1>)?/gi)) {
      if (!interesting.has(match[1].toLowerCase())) continue;
      const attrs = {};
      for (const attr of match[2].matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)) attrs[attr[1]] = attr[2];
      elements.push({ tag: match[1].toLowerCase(), attrs, text: (match[3] || '').trim() });
    }
    output.push({ id: question.id, standardUnitKey: question.standardUnitKey, assetPath: assetPath.replaceAll('\\', '/'), root, elementCount: elements.length, elements });
  }
}
console.log(JSON.stringify(output, null, 2));
