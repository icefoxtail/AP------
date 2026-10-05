import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const REPORT = path.join(ROOT, 'reports', 'hs-quadratic-svg-upgrade-20260908');
const BANK_MANIFEST = JSON.parse(fs.readFileSync(path.join(REPORT, '37_candidate_source_repair_manifest_r8.json'), 'utf8'));
const OUTPUT = path.join(REPORT, '39_approved_source_only_v1_expected_facts_r9.json');

const TARGETS = [
  {
    id: 13,
    school: '26_금당고',
    sourceBasename: '26_금당고_1학기_중간_고1_기출_c.js',
    expectedVisualType: 'cartesian',
    expectedFacts: {
      parameterCondition: 'k≠0',
      line: { slope: 2, intercept: -3 },
      discriminantIdentity: 'Δ/4 = k(5+b−2a)+(1−a)^2',
      representativeK: 1,
      representativeIntersection: [-1, -5],
      allNonzeroKIntersection: 'one point',
      derivedParameters: { a: 1, b: -3 },
      result: -2
    }
  },
  {
    id: 17,
    school: '26_금당고',
    sourceBasename: '26_금당고_1학기_중간_고1_기출_c.js',
    expectedVisualType: 'number-line',
    expectedFacts: {
      parameter: 'a',
      exactThreeIntersectionRange: { left: 1, right: 4, leftClosed: false, rightClosed: false },
      intersectionCountByRegion: [
        { region: '0<a≤1', count: 2 },
        { region: '1<a<4', count: 3 },
        { region: 'a=4', count: 4 },
        { region: 'a>4', count: 5 }
      ],
      maximum: '없다'
    }
  },
  {
    id: 19,
    school: '26_매산여고',
    sourceBasename: '26_매산여고_1학기_중간_고1_기출_c.js',
    expectedVisualType: 'cartesian',
    expectedFacts: {
      functions: ['y=(x−1)^2', 'y=−(x−2)^2+5'],
      horizontalLevels: [0, 1, 4, 5],
      sharedPoints: [[0, 1], [3, 4]],
      distinctThreeIntersectionTValues: [0, 1, 4, 5],
      sum: 10
    }
  },
  {
    id: 9,
    school: '26_팔마고',
    sourceBasename: '26_팔마고_1학기_중간_고1_기출_c.js',
    expectedVisualType: 'geometry',
    expectedFacts: {
      upperFunction: 'y=−x^2/3+3',
      lowerFunction: 'y=x^2−9',
      maximizingParameter: 't=3/4',
      width: '2t',
      height: '12−4t^2/3',
      perimeterFunction: 'P(t)=−8t^2/3+4t+24',
      maximumPerimeter: '51/2'
    }
  },
  {
    id: 15,
    school: '26_팔마고',
    sourceBasename: '26_팔마고_1학기_중간_고1_기출_c.js',
    expectedVisualType: 'cartesian',
    expectedFacts: {
      horizontalLine: 'y=7',
      intersectionXs: [-3, 1],
      reconstructedFunction: 'f(x)=a(x+3)(x−1)+7',
      interval: [-2, 2],
      maximumOnInterval: { x: 2, y: 22 },
      coefficient: 3,
      target: { x: 3, y: 43 }
    }
  }
];

function load(relative) {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, relative), 'utf8'), context, { filename: relative, timeout: 10000 });
  return JSON.parse(JSON.stringify(context.window));
}

function sha(value) { return crypto.createHash('sha256').update(value).digest('hex'); }

function resolveAsset(relative) {
  const candidates = [path.join(ROOT, relative), path.join(ROOT, 'archive', relative)];
  return candidates.find(candidate => fs.existsSync(candidate)) ?? null;
}

function main() {
  const rows = [];
  for (const target of TARGETS) {
    const file = BANK_MANIFEST.candidateFiles.find(item => path.basename(item.sourcePath) === target.sourceBasename);
    if (!file) throw new Error(`source bank not found for ${target.school}`);
    const bank = load(file.candidatePath);
    const question = bank.questionBank.find(item => Number(item.id) === target.id);
    if (!question) throw new Error(`question not found: ${target.school} q${target.id}`);
    const sourceJsPath = file.sourcePath;
    rows.push({
      questionUid: `${sourceJsPath}|${path.basename(sourceJsPath, '.js')}|${target.id}`,
      sourceJsPath,
      id: target.id,
      content: question.content,
      choices: question.choices ?? [],
      problemImageRef: question.image ?? null,
      problemImageSha256: question.image && resolveAsset(question.image) ? sha(fs.readFileSync(resolveAsset(question.image))) : null,
      expectedVisualType: target.expectedVisualType,
      expectedFacts: target.expectedFacts
    });
  }
  const output = {
    schemaVersion: 'HS_QUADRATIC_APPROVED_SOURCE_ONLY_V1_EXPECTED_FACTS_R9',
    status: 'EXPECTED_FACTS_FROZEN_SOURCE_ONLY_NO_PASS',
    inputVisibilityProfile: 'SOURCE_ONLY_AFTER_APPROVED_SOURCE_REPAIR',
    priorReviewVisibility: 'NONE',
    sourceRepairManifest: 'reports/hs-quadratic-svg-upgrade-20260908/37_candidate_source_repair_manifest_r8.json',
    rows,
    note: 'These five expected facts were frozen from the corrected source problem/content and independently recomputed. Solutions, existing SVGs, and prior V2/V3 verdicts were not used to derive the facts.'
  };
  fs.writeFileSync(OUTPUT, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify({ status: output.status, rows: rows.length, inputVisibilityProfile: output.inputVisibilityProfile }, null, 2));
}

main();
