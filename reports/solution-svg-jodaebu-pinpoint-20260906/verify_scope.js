const fs = require('fs');
const vm = require('vm');
const cp = require('child_process');

const files = [
  ['2023', 'archive/exams/original/high/h2/2mid/23_조대부고_2학기_중간_고2_수학II.js', {
    1: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    11: ['tags','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    16: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    23: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
  }],
  ['2024', 'archive/exams/original/high/h2/2mid/24_조대부고_2학기_중간_고2_수학II.js', {
    1: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    5: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    7: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    8: ['tags','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    11: ['category','standardUnitKey','standardUnit','standardUnitOrder','subUnitKey','subUnit','tags'],
    12: ['solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    13: ['solution'],
    15: ['tags','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    16: ['tags','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    17: ['tags','solution','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    18: ['tags','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    20: ['solution','solutionImage','solutionImageAlt','solutionImageCaption','solutionImageSize','solutionImageStatus'],
    23: ['solution'],
  }],
];

function load(code) { const c = {window:{}}; vm.runInNewContext(code, c); return c.window.questionBank; }
const result = [];
for (const [year, file, allowedById] of files) {
  const current = load(fs.readFileSync(file, 'utf8'));
  const old = load(cp.execFileSync('git', ['show', `HEAD:${file}`], {encoding:'utf8'}));
  for (const q of current) {
    const before = old.find(x => x.id === q.id);
    const changed = Object.keys({...before, ...q}).filter(k => JSON.stringify(before?.[k]) !== JSON.stringify(q?.[k]));
    const allowed = allowedById[q.id] || [];
    const violations = changed.filter(k => !allowed.includes(k));
    result.push({year, id:q.id, changedFields:changed, allowedFields:allowed, violations});
  }
}
const out = {questionCount: result.length, violationCount: result.reduce((n, r) => n + r.violations.length, 0), rows: result.filter(r => r.changedFields.length)};
fs.writeFileSync('reports/solution-svg-jodaebu-pinpoint-20260906/scope-check.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify({questionCount:out.questionCount, violationCount:out.violationCount, changed:out.rows}, null, 2));
