import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const REPORTS = path.join(ROOT, 'reports', 'geometry_equation_20260902');
const config = {
  protocol: '고1 도형의 방정식 전수 업그레이드 및 다중 독립 검수·최종 봉인 프로토콜 v2.2',
  buildBatchSize: 5,
  pilotMaxPerBucket: 2,
  equalScaleModelTolerance: 1e-9,
  equalScaleRenderTolerance: 0.005,
  visualSvgForbiddenTokens: ['<br>', '$...$', '\\frac', '\\dfrac', '\\sqrt', 'MathJax', 'mathjax'],
  solutionFieldsOnly: ['solution', 'solutionImage', 'solutionImageAlt', 'solutionImageCaption', 'solutionImageSize'],
  productionBaselinePolicy: 'READ_ONLY',
  stagingDirectory: 'reports/geometry_equation_20260902/staging/archive',
};
const canonical = JSON.stringify(config);
const sha = crypto.createHash('sha256').update(canonical).digest('hex');
fs.writeFileSync(path.join(REPORTS, 'project_config.json'), `${JSON.stringify({ ...config, projectConfigSha: sha }, null, 2)}\n`, 'utf8');
console.log(JSON.stringify({ status: 'PROJECT_CONFIG_FROZEN', projectConfigSha: sha, config }, null, 2));
